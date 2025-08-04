#!/usr/bin/env node

/**
 * Complete WordPress to Supabase Migration Script
 * Migrates all WordPress data from data.sql to Supabase database
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY || !SUPABASE_URL) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
  console.error('Make sure .env.local file exists with correct Supabase configuration');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

class WordPressMigrator {
  constructor() {
    this.sqlContent = '';
    this.users = new Map();
    this.categories = new Map();
    this.tags = new Map();
    this.posts = new Map();
    this.termTaxonomy = new Map();
    this.termRelationships = new Map();
    this.postMeta = new Map();
  }

  async loadSqlFile() {
    console.log('📖 Loading WordPress SQL file...');
    try {
      this.sqlContent = fs.readFileSync(path.join(__dirname, '../data.sql'), 'utf8');
      console.log('✅ SQL file loaded successfully');
    } catch (error) {
      console.error('❌ Error loading SQL file:', error.message);
      throw error;
    }
  }

  parseInsertStatements(tableName) {
    console.log(`🔍 Parsing ${tableName} data...`);
    const regex = new RegExp(`INSERT INTO \`${tableName}\` VALUES\\s*([\\s\\S]*?);`, 'gi');
    const matches = this.sqlContent.match(regex);
    
    if (!matches) {
      console.log(`⚠️  No data found for table ${tableName}`);
      return [];
    }

    const allData = [];
    matches.forEach(match => {
      // Extract the VALUES part
      const valuesMatch = match.match(/VALUES\s*([\s\S]*)/i);
      if (valuesMatch) {
        const valuesString = valuesMatch[1].replace(/;$/, '');
        // Parse individual rows - this is a simplified parser
        const rows = this.parseValues(valuesString);
        allData.push(...rows);
      }
    });

    console.log(`✅ Parsed ${allData.length} records from ${tableName}`);
    return allData;
  }

  parseValues(valuesString) {
    const rows = [];
    let currentRow = [];
    let inString = false;
    let stringChar = '';
    let escaped = false;
    let parenDepth = 0;
    let currentValue = '';

    for (let i = 0; i < valuesString.length; i++) {
      const char = valuesString[i];
      
      if (escaped) {
        currentValue += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        currentValue += char;
        continue;
      }

      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
        currentValue += char;
        continue;
      }

      if (inString && char === stringChar) {
        inString = false;
        stringChar = '';
        currentValue += char;
        continue;
      }

      if (inString) {
        currentValue += char;
        continue;
      }

      if (char === '(') {
        parenDepth++;
        if (parenDepth === 1) {
          currentRow = [];
          currentValue = '';
          continue;
        }
      }

      if (char === ')') {
        parenDepth--;
        if (parenDepth === 0) {
          // End of row
          if (currentValue.trim()) {
            currentRow.push(this.parseValue(currentValue.trim()));
          }
          if (currentRow.length > 0) {
            rows.push(currentRow);
          }
          currentValue = '';
          continue;
        }
      }

      if (parenDepth > 0) {
        if (char === ',' && parenDepth === 1) {
          currentRow.push(this.parseValue(currentValue.trim()));
          currentValue = '';
          continue;
        }
        currentValue += char;
      }
    }

    return rows;
  }

  parseValue(value) {
    if (value === 'NULL') return null;
    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\');
    }
    if (/^\d+$/.test(value)) return parseInt(value);
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
    return value;
  }

  async parseWordPressData() {
    console.log('🔄 Parsing WordPress data structure...');

    // Parse users
    const usersData = this.parseInsertStatements('wp_users');
    usersData.forEach(row => {
      this.users.set(row[0], {
        wp_id: row[0],
        user_login: row[1],
        user_nicename: row[3],
        user_email: row[4],
        user_url: row[5],
        user_registered: row[6],
        display_name: row[9]
      });
    });

    // Parse terms (categories and tags)
    const termsData = this.parseInsertStatements('wp_terms');
    termsData.forEach(row => {
      this.tags.set(row[0], {
        wp_id: row[0],
        name: row[1],
        slug: row[2]
      });
    });

    // Parse term taxonomy to separate categories from tags
    const termTaxonomyData = this.parseInsertStatements('wp_term_taxonomy');
    termTaxonomyData.forEach(row => {
      const termId = row[1];
      const taxonomy = row[2];
      const description = row[3];
      const parent = row[4];
      
      this.termTaxonomy.set(row[0], {
        term_taxonomy_id: row[0],
        term_id: termId,
        taxonomy: taxonomy,
        description: description,
        parent: parent
      });

      if (taxonomy === 'category') {
        const term = this.tags.get(termId);
        if (term) {
          this.categories.set(termId, {
            ...term,
            description: description,
            parent_id: parent || null
          });
          this.tags.delete(termId);
        }
      }
    });

    // Parse posts
    const postsData = this.parseInsertStatements('wp_posts');
    console.log(`🔍 Examining ${postsData.length} total wp_posts records...`);

    postsData.forEach((row, index) => {
      // Debug first few posts to understand structure
      if (index < 5) {
        console.log(`Post ${index}: type="${row[17]}", status="${row[7]}", title="${row[5]?.substring(0, 50)}..."`);
      }

      // Check for both 'post' type and 'publish' status, and ensure it's not empty
      if (row[17] === 'post' && row[7] === 'publish' && row[5] && row[5].trim() !== '') {
        console.log(`✅ Found valid post: "${row[5]}"`);
        this.posts.set(row[0], {
          wp_id: row[0],
          post_author: row[1],
          post_date: row[2],
          post_date_gmt: row[3],
          post_content: row[4] || '',
          post_title: row[5],
          post_excerpt: row[6] || '',
          post_status: row[7],
          post_name: row[11] || row[5].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          post_type: row[17]
        });
      }
    });

    // Parse term relationships (post-category associations)
    const termRelData = this.parseInsertStatements('wp_term_relationships');
    termRelData.forEach(row => {
      const postId = row[0];
      const termTaxonomyId = row[1];
      
      if (!this.termRelationships.has(postId)) {
        this.termRelationships.set(postId, []);
      }
      this.termRelationships.get(postId).push(termTaxonomyId);
    });

    console.log(`✅ Parsed data summary:`);
    console.log(`   👥 Users: ${this.users.size}`);
    console.log(`   📁 Categories: ${this.categories.size}`);
    console.log(`   🏷️  Tags: ${this.tags.size}`);
    console.log(`   📝 Posts: ${this.posts.size}`);
  }

  async clearExistingData() {
    console.log('🧹 Clearing existing data...');

    try {
      // Delete in reverse order due to foreign key constraints
      const { error: postsError } = await supabase.from('posts').delete().gte('id', 0);
      if (postsError) console.log('Posts clear error:', postsError.message);

      const { error: tagsError } = await supabase.from('tags').delete().gte('id', 0);
      if (tagsError) console.log('Tags clear error:', tagsError.message);

      const { error: categoriesError } = await supabase.from('categories').delete().gte('id', 0);
      if (categoriesError) console.log('Categories clear error:', categoriesError.message);

      const { error: usersError } = await supabase.from('users').delete().gte('id', 0);
      if (usersError) console.log('Users clear error:', usersError.message);

      console.log('✅ Existing data cleared');
    } catch (error) {
      console.error('⚠️  Error clearing data (this might be expected):', error.message);
    }
  }

  async migrateUsers() {
    console.log('👥 Migrating users...');

    const usersToInsert = Array.from(this.users.values()).map(user => ({
      wp_id: user.wp_id,
      username: user.user_login,
      email: user.user_email,
      full_name: user.display_name,
      display_name: user.display_name,
      user_login: user.user_login,
      user_url: user.user_url,
      role: 'author',
      registered_at: user.user_registered
    }));

    const { data, error } = await supabase
      .from('users')
      .upsert(usersToInsert, { onConflict: 'wp_id' });

    if (error) {
      console.error('❌ Error migrating users:', error);
      throw error;
    }

    console.log(`✅ Migrated ${usersToInsert.length} users`);
    return data;
  }

  async migrateCategories() {
    console.log('📁 Migrating categories...');
    
    const categoriesToInsert = Array.from(this.categories.values()).map(category => ({
      wp_id: category.wp_id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: null // We'll handle parent relationships in a second pass
    }));

    const { data, error } = await supabase
      .from('categories')
      .upsert(categoriesToInsert, { onConflict: 'wp_id' });

    if (error) {
      console.error('❌ Error migrating categories:', error);
      throw error;
    }

    console.log(`✅ Migrated ${categoriesToInsert.length} categories`);
    return data;
  }

  async migrateTags() {
    console.log('🏷️ Migrating tags...');

    const tagsToInsert = Array.from(this.tags.values()).map(tag => ({
      wp_id: tag.wp_id,
      name: tag.name,
      slug: tag.slug,
      description: ''
    }));

    // Insert tags in batches to handle large datasets
    const batchSize = 50;
    for (let i = 0; i < tagsToInsert.length; i += batchSize) {
      const batch = tagsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('tags')
        .upsert(batch, { onConflict: 'wp_id' });

      if (error) {
        console.error('❌ Error migrating tags batch:', error);
        throw error;
      }

      console.log(`✅ Migrated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(tagsToInsert.length/batchSize)}`);
    }

    console.log(`✅ Migrated ${tagsToInsert.length} tags`);
  }

  async migratePosts() {
    console.log('📝 Migrating posts...');
    
    // Get user and category mappings
    const { data: users } = await supabase.from('users').select('id, wp_id');
    const { data: categories } = await supabase.from('categories').select('id, wp_id');
    
    const userMap = new Map(users.map(u => [u.wp_id, u.id]));
    const categoryMap = new Map(categories.map(c => [c.wp_id, c.id]));

    const postsToInsert = [];
    
    for (const [wpId, post] of this.posts) {
      const authorId = userMap.get(post.post_author);
      
      // Find category for this post
      let categoryId = null;
      const termRels = this.termRelationships.get(wpId) || [];
      
      for (const termTaxId of termRels) {
        const termTax = this.termTaxonomy.get(termTaxId);
        if (termTax && termTax.taxonomy === 'category') {
          categoryId = categoryMap.get(termTax.term_id);
          break;
        }
      }

      postsToInsert.push({
        wp_id: wpId,
        title: post.post_title,
        slug: post.post_name,
        content: post.post_content,
        excerpt: post.post_excerpt || '',
        status: 'published',
        author_id: authorId,
        category_id: categoryId,
        published_at: post.post_date,
        reading_time: Math.ceil(post.post_content.length / 1000) // Rough estimate
      });
    }

    // Insert posts in batches
    const batchSize = 50;
    for (let i = 0; i < postsToInsert.length; i += batchSize) {
      const batch = postsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('posts')
        .upsert(batch, { onConflict: 'wp_id' });

      if (error) {
        console.error('❌ Error migrating posts batch:', error);
        throw error;
      }
      
      console.log(`✅ Migrated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(postsToInsert.length/batchSize)}`);
    }

    console.log(`✅ Migrated ${postsToInsert.length} posts`);
  }

  async run() {
    try {
      console.log('🚀 Starting WordPress to Supabase migration...\n');

      await this.loadSqlFile();
      await this.parseWordPressData();

      console.log('\n📤 Starting data migration to Supabase...');
      await this.clearExistingData();
      await this.migrateUsers();
      await this.migrateCategories();
      await this.migrateTags();
      await this.migratePosts();
      
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n📊 Migration Summary:');
      console.log(`   👥 Users migrated: ${this.users.size}`);
      console.log(`   📁 Categories migrated: ${this.categories.size}`);
      console.log(`   🏷️  Tags migrated: ${this.tags.size}`);
      console.log(`   📝 Posts migrated: ${this.posts.size}`);
      
    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      process.exit(1);
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new WordPressMigrator();
  migrator.run();
}

module.exports = WordPressMigrator;
