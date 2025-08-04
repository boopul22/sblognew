/**
 * WordPress to Supabase Migration Script
 * 
 * This script migrates WordPress data from data.sql to Supabase
 * Handles: Posts, Categories, Users, and Relationships
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ktxhnxmdbfkswmkikgum.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eGhueG1kYmZrc3dta2lrZ3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjE5OTksImV4cCI6MjA2OTUzNzk5OX0.5uWgEIlaGqHQupdBEsu76kzPDN3vzq4UFEknmKSpmHg';

const supabase = createClient(supabaseUrl, supabaseKey);

class WordPressMigrator {
  constructor() {
    this.sqlContent = '';
    this.users = new Map();
    this.categories = new Map();
    this.posts = [];
    this.postCategories = [];
  }

  // Load and parse SQL file
  async loadSqlFile(filePath) {
    console.log('📁 Loading SQL file...');
    this.sqlContent = fs.readFileSync(filePath, 'utf8');
    console.log('✅ SQL file loaded successfully');
  }

  // Extract WordPress users
  extractUsers() {
    console.log('👥 Extracting users...');
    
    const userInsertRegex = /INSERT INTO `wp_users` VALUES\s*\((.*?)\);/gs;
    const matches = [...this.sqlContent.matchAll(userInsertRegex)];
    
    matches.forEach(match => {
      const values = match[1];
      // Parse user data - WordPress format: ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name
      const userMatches = values.match(/\((\d+),'([^']*)','[^']*','([^']*)','([^']*)','[^']*','([^']*)','[^']*',\d+,'([^']*)'\)/g);
      
      if (userMatches) {
        userMatches.forEach(userMatch => {
          const userParts = userMatch.match(/\((\d+),'([^']*)','[^']*','([^']*)','([^']*)','[^']*','([^']*)','[^']*',\d+,'([^']*)'\)/);
          if (userParts) {
            const [, id, username, nicename, email, registered, displayName] = userParts;
            this.users.set(parseInt(id), {
              wp_id: parseInt(id),
              username: username || nicename,
              email: email,
              display_name: displayName || username,
              full_name: displayName || username,
              created_at: this.parseWordPressDate(registered)
            });
          }
        });
      }
    });
    
    console.log(`✅ Extracted ${this.users.size} users`);
  }

  // Extract WordPress categories and terms
  extractCategories() {
    console.log('📂 Extracting categories...');
    
    // Extract terms
    const termInsertRegex = /INSERT INTO `wp_terms` VALUES\s*\((.*?)\);/gs;
    const termMatches = [...this.sqlContent.matchAll(termInsertRegex)];
    
    const terms = new Map();
    termMatches.forEach(match => {
      const values = match[1];
      const termValueMatches = values.match(/\((\d+),'([^']*)','([^']*)',\d+\)/g);
      
      if (termValueMatches) {
        termValueMatches.forEach(termMatch => {
          const termParts = termMatch.match(/\((\d+),'([^']*)','([^']*)',\d+\)/);
          if (termParts) {
            const [, id, name, slug] = termParts;
            terms.set(parseInt(id), { name, slug });
          }
        });
      }
    });

    // Extract term taxonomy to identify categories
    const taxonomyRegex = /INSERT INTO `wp_term_taxonomy` VALUES\s*\((.*?)\);/gs;
    const taxonomyMatches = [...this.sqlContent.matchAll(taxonomyRegex)];
    
    taxonomyMatches.forEach(match => {
      const values = match[1];
      const taxValueMatches = values.match(/\((\d+),(\d+),'([^']*)',[^,]*,(\d+),\d+\)/g);
      
      if (taxValueMatches) {
        taxValueMatches.forEach(taxMatch => {
          const taxParts = taxMatch.match(/\((\d+),(\d+),'([^']*)',[^,]*,(\d+),\d+\)/);
          if (taxParts) {
            const [, taxonomyId, termId, taxonomy, count] = taxParts;
            
            // Only process categories (not tags or other taxonomies)
            if (taxonomy === 'category' && terms.has(parseInt(termId))) {
              const term = terms.get(parseInt(termId));
              this.categories.set(parseInt(taxonomyId), {
                wp_id: parseInt(taxonomyId),
                term_id: parseInt(termId),
                name: term.name,
                slug: term.slug,
                description: this.getCategoryDescription(term.name),
                color: this.getCategoryColor(term.name),
                post_count: parseInt(count)
              });
            }
          }
        });
      }
    });
    
    console.log(`✅ Extracted ${this.categories.size} categories`);
  }

  // Extract WordPress posts
  extractPosts() {
    console.log('📝 Extracting posts...');
    
    const postInsertRegex = /INSERT INTO `wp_posts` VALUES\s*\((.*?)\);/gs;
    const matches = [...this.sqlContent.matchAll(postInsertRegex)];
    
    matches.forEach(match => {
      const values = match[1];
      // Parse complex post data with proper escaping handling
      const postMatches = this.parsePostValues(values);
      
      postMatches.forEach(post => {
        // Only process published posts of type 'post'
        if (post.post_status === 'publish' && post.post_type === 'post' && post.post_title.trim()) {
          this.posts.push({
            wp_id: post.ID,
            title: this.cleanText(post.post_title),
            slug: post.post_name || this.generateSlug(post.post_title),
            content: this.cleanContent(post.post_content),
            excerpt: this.cleanText(post.post_excerpt) || this.generateExcerpt(post.post_content),
            author_id: post.post_author,
            status: 'published',
            published_at: this.parseWordPressDate(post.post_date),
            created_at: this.parseWordPressDate(post.post_date),
            updated_at: this.parseWordPressDate(post.post_modified)
          });
        }
      });
    });
    
    console.log(`✅ Extracted ${this.posts.length} posts`);
  }

  // Extract post-category relationships
  extractPostCategories() {
    console.log('🔗 Extracting post-category relationships...');
    
    const relationshipRegex = /INSERT INTO `wp_term_relationships` VALUES\s*\((.*?)\);/gs;
    const matches = [...this.sqlContent.matchAll(relationshipRegex)];
    
    matches.forEach(match => {
      const values = match[1];
      const relationshipMatches = values.match(/\((\d+),(\d+),\d+\)/g);
      
      if (relationshipMatches) {
        relationshipMatches.forEach(relMatch => {
          const relParts = relMatch.match(/\((\d+),(\d+),\d+\)/);
          if (relParts) {
            const [, postId, taxonomyId] = relParts;
            
            // Only add if both post and category exist
            const post = this.posts.find(p => p.wp_id === parseInt(postId));
            const category = this.categories.get(parseInt(taxonomyId));
            
            if (post && category) {
              this.postCategories.push({
                post_wp_id: parseInt(postId),
                category_wp_id: parseInt(taxonomyId)
              });
            }
          }
        });
      }
    });
    
    console.log(`✅ Extracted ${this.postCategories.length} post-category relationships`);
  }

  // Helper methods
  parseWordPressDate(dateStr) {
    if (!dateStr || dateStr === '0000-00-00 00:00:00') {
      return new Date().toISOString();
    }
    return new Date(dateStr).toISOString();
  }

  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .trim();
  }

  cleanContent(content) {
    if (!content) return '';
    
    // Remove WordPress blocks and HTML, keep the text content
    let cleaned = content
      .replace(/<!-- wp:.*?-->/g, '')
      .replace(/<!-- \/wp:.*?-->/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    return cleaned;
  }

  generateExcerpt(content, length = 150) {
    const cleaned = this.cleanContent(content);
    return cleaned.length > length ? cleaned.substring(0, length) + '...' : cleaned;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  getCategoryDescription(name) {
    const descriptions = {
      'shayari': 'हिंदी शायरी का संग्रह',
      'quotes': 'प्रेरणादायक कोट्स',
      'status': 'स्टेटस और कैप्शन',
      'wishes': 'शुभकामनाएं और बधाई संदेश',
      'hindi': 'हिंदी कंटेंट',
      'english': 'अंग्रेजी कंटेंट'
    };
    
    const lowerName = name.toLowerCase();
    for (const [key, desc] of Object.entries(descriptions)) {
      if (lowerName.includes(key)) return desc;
    }
    
    return `${name} से संबंधित कंटेंट`;
  }

  getCategoryColor(name) {
    const colors = {
      'shayari': '#ff6b6b',
      'quotes': '#4ecdc4', 
      'status': '#45b7d1',
      'wishes': '#f9ca24',
      'hindi': '#6c5ce7',
      'english': '#fd79a8'
    };
    
    const lowerName = name.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
      if (lowerName.includes(key)) return color;
    }
    
    return '#95a5a6';
  }

  // Complex post value parser to handle escaped content
  parsePostValues(values) {
    const posts = [];
    let currentPos = 0;
    
    while (currentPos < values.length) {
      const startPos = values.indexOf('(', currentPos);
      if (startPos === -1) break;
      
      let depth = 0;
      let pos = startPos;
      let inQuotes = false;
      let quoteChar = '';
      
      while (pos < values.length) {
        const char = values[pos];
        
        if (!inQuotes && (char === "'" || char === '"')) {
          inQuotes = true;
          quoteChar = char;
        } else if (inQuotes && char === quoteChar && values[pos - 1] !== '\\') {
          inQuotes = false;
          quoteChar = '';
        } else if (!inQuotes) {
          if (char === '(') depth++;
          else if (char === ')') depth--;
          
          if (depth === 0) {
            const postData = values.substring(startPos + 1, pos);
            const post = this.parsePostData(postData);
            if (post) posts.push(post);
            currentPos = pos + 1;
            break;
          }
        }
        pos++;
      }
      
      if (pos >= values.length) break;
    }
    
    return posts;
  }

  parsePostData(data) {
    // WordPress post structure: ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count
    
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    let quoteChar = '';
    let i = 0;
    
    while (i < data.length) {
      const char = data[i];
      
      if (!inQuotes && (char === "'" || char === '"')) {
        inQuotes = true;
        quoteChar = char;
        i++;
        continue;
      } else if (inQuotes && char === quoteChar && data[i - 1] !== '\\') {
        inQuotes = false;
        quoteChar = '';
        i++;
        continue;
      } else if (!inQuotes && char === ',') {
        fields.push(currentField.trim());
        currentField = '';
        i++;
        continue;
      }
      
      currentField += char;
      i++;
    }
    
    if (currentField.trim()) {
      fields.push(currentField.trim());
    }
    
    if (fields.length >= 23) {
      return {
        ID: parseInt(fields[0]) || 0,
        post_author: parseInt(fields[1]) || 1,
        post_date: fields[2].replace(/'/g, ''),
        post_date_gmt: fields[3].replace(/'/g, ''),
        post_content: fields[4].replace(/'/g, ''),
        post_title: fields[5].replace(/'/g, ''),
        post_excerpt: fields[6].replace(/'/g, ''),
        post_status: fields[7].replace(/'/g, ''),
        comment_status: fields[8].replace(/'/g, ''),
        ping_status: fields[9].replace(/'/g, ''),
        post_password: fields[10].replace(/'/g, ''),
        post_name: fields[11].replace(/'/g, ''),
        to_ping: fields[12].replace(/'/g, ''),
        pinged: fields[13].replace(/'/g, ''),
        post_modified: fields[14].replace(/'/g, ''),
        post_modified_gmt: fields[15].replace(/'/g, ''),
        post_content_filtered: fields[16].replace(/'/g, ''),
        post_parent: parseInt(fields[17]) || 0,
        guid: fields[18].replace(/'/g, ''),
        menu_order: parseInt(fields[19]) || 0,
        post_type: fields[20].replace(/'/g, ''),
        post_mime_type: fields[21].replace(/'/g, ''),
        comment_count: parseInt(fields[22]) || 0
      };
    }
    
    return null;
  }

  // Supabase Migration Methods
  async migrateUsers() {
    console.log('🚀 Migrating users to Supabase...');

    const userArray = Array.from(this.users.values());
    const batchSize = 50;

    for (let i = 0; i < userArray.length; i += batchSize) {
      const batch = userArray.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('users')
        .upsert(batch, {
          onConflict: 'username',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Error migrating users batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`✅ Migrated users batch ${i / batchSize + 1} (${batch.length} users)`);
      }
    }

    console.log(`✅ User migration completed: ${userArray.length} users`);
  }

  async migrateCategories() {
    console.log('🚀 Migrating categories to Supabase...');

    const categoryArray = Array.from(this.categories.values());

    for (const category of categoryArray) {
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color
        }, {
          onConflict: 'slug',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Error migrating category ${category.name}:`, error);
      } else {
        console.log(`✅ Migrated category: ${category.name}`);
        // Store the Supabase ID for relationship mapping
        if (data && data[0]) {
          category.supabase_id = data[0].id;
        }
      }
    }

    console.log(`✅ Category migration completed: ${categoryArray.length} categories`);
  }

  async migratePosts() {
    console.log('🚀 Migrating posts to Supabase...');

    // Get user mapping from Supabase
    const { data: supabaseUsers } = await supabase
      .from('users')
      .select('id, username');

    const userMapping = new Map();
    supabaseUsers?.forEach(user => {
      // Find corresponding WordPress user
      for (const [wpId, wpUser] of this.users.entries()) {
        if (wpUser.username === user.username) {
          userMapping.set(wpId, user.id);
          break;
        }
      }
    });

    const batchSize = 25;
    const migratedPosts = [];

    for (let i = 0; i < this.posts.length; i += batchSize) {
      const batch = this.posts.slice(i, i + batchSize);

      const postsToInsert = batch.map(post => ({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        author_id: userMapping.get(post.author_id) || userMapping.values().next().value,
        status: post.status,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at
      }));

      const { data, error } = await supabase
        .from('posts')
        .upsert(postsToInsert, {
          onConflict: 'slug',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Error migrating posts batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`✅ Migrated posts batch ${i / batchSize + 1} (${batch.length} posts)`);
        if (data) {
          migratedPosts.push(...data);
        }
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`✅ Post migration completed: ${this.posts.length} posts`);
    return migratedPosts;
  }

  async migratePostCategories() {
    console.log('🚀 Migrating post-category relationships to Supabase...');

    // Get post and category mappings from Supabase
    const { data: supabasePosts } = await supabase
      .from('posts')
      .select('id, slug, title');

    const { data: supabaseCategories } = await supabase
      .from('categories')
      .select('id, slug, name');

    // Create mapping from WordPress to Supabase IDs
    const postMapping = new Map();
    const categoryMapping = new Map();

    // Map posts
    supabasePosts?.forEach(post => {
      const wpPost = this.posts.find(p =>
        p.slug === post.slug || p.title === post.title
      );
      if (wpPost) {
        postMapping.set(wpPost.wp_id, post.id);
      }
    });

    // Map categories
    supabaseCategories?.forEach(category => {
      for (const [wpId, wpCategory] of this.categories.entries()) {
        if (wpCategory.slug === category.slug || wpCategory.name === category.name) {
          categoryMapping.set(wpId, category.id);
          break;
        }
      }
    });

    // Create post-category relationships
    const relationships = [];
    this.postCategories.forEach(rel => {
      const postId = postMapping.get(rel.post_wp_id);
      const categoryId = categoryMapping.get(rel.category_wp_id);

      if (postId && categoryId) {
        relationships.push({
          post_id: postId,
          category_id: categoryId
        });
      }
    });

    // Insert relationships in batches
    const batchSize = 100;
    for (let i = 0; i < relationships.length; i += batchSize) {
      const batch = relationships.slice(i, i + batchSize);

      const { error } = await supabase
        .from('post_categories')
        .upsert(batch, {
          onConflict: 'post_id,category_id',
          ignoreDuplicates: true
        });

      if (error) {
        console.error(`❌ Error migrating relationships batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`✅ Migrated relationships batch ${i / batchSize + 1} (${batch.length} relationships)`);
      }
    }

    console.log(`✅ Post-category relationship migration completed: ${relationships.length} relationships`);
  }

  // Main migration orchestrator
  async migrate(sqlFilePath) {
    try {
      console.log('🎯 Starting WordPress to Supabase migration...\n');

      // Step 1: Load and parse WordPress data
      await this.loadSqlFile(sqlFilePath);
      this.extractUsers();
      this.extractCategories();
      this.extractPosts();
      this.extractPostCategories();

      console.log('\n📊 Migration Summary:');
      console.log(`- Users: ${this.users.size}`);
      console.log(`- Categories: ${this.categories.size}`);
      console.log(`- Posts: ${this.posts.length}`);
      console.log(`- Post-Category Relations: ${this.postCategories.length}\n`);

      // Step 2: Migrate to Supabase
      await this.migrateUsers();
      await this.migrateCategories();
      await this.migratePosts();
      await this.migratePostCategories();

      console.log('\n🎉 Migration completed successfully!');

      return {
        users: this.users.size,
        categories: this.categories.size,
        posts: this.posts.length,
        relationships: this.postCategories.length
      };

    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }
}

module.exports = WordPressMigrator;
