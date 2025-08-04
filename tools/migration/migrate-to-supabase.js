require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
const path = require('path');

class SupabaseMigrator {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    this.batchSize = parseInt(process.env.BATCH_SIZE) || 100;
    this.dryRun = process.env.DRY_RUN === 'true';
    this.dataDir = path.join(__dirname, 'extracted-data');
  }

  async migrate() {
    console.log(`Starting migration to Supabase (DRY_RUN: ${this.dryRun})...`);
    
    try {
      // Load extracted data
      const users = await this.loadData('users.json');
      const categories = await this.loadData('categories.json');
      const tags = await this.loadData('tags.json');
      const posts = await this.loadData('posts.json');
      const attachments = await this.loadData('attachments.json');
      const postMeta = await this.loadData('postMeta.json');
      const postCategories = await this.loadData('postCategories.json');
      const postTags = await this.loadData('postTags.json');

      // Migrate in order (respecting foreign key constraints)
      console.log('Migrating users...');
      const userIdMap = await this.migrateUsers(users);
      
      console.log('Migrating categories...');
      const categoryIdMap = await this.migrateCategories(categories);
      
      console.log('Migrating tags...');
      const tagIdMap = await this.migrateTags(tags);
      
      console.log('Migrating posts...');
      const postIdMap = await this.migratePosts(posts, userIdMap);

      console.log('Migrating attachments...');
      const attachmentIdMap = await this.migrateAttachments(attachments, userIdMap, postIdMap);

      console.log('Applying post metadata...');
      await this.migratePostMeta(postMeta, postIdMap);

      console.log('Linking posts to categories...');
      await this.migratePostCategories(postCategories, postIdMap, categoryIdMap);

      console.log('Linking posts to tags...');
      await this.migratePostTags(postTags, postIdMap, tagIdMap);
      
      console.log('Migration completed successfully!');
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  async loadData(filename) {
    const filePath = path.join(this.dataDir, filename);
    if (await fs.pathExists(filePath)) {
      return await fs.readJson(filePath);
    }
    return [];
  }

  async migrateUsers(users) {
    const idMap = {};
    
    if (this.dryRun) {
      console.log(`Would migrate ${users.length} users`);
      users.forEach(user => {
        idMap[user.wp_id] = `fake-uuid-${user.wp_id}`;
      });
      return idMap;
    }

    for (let i = 0; i < users.length; i += this.batchSize) {
      const batch = users.slice(i, i + this.batchSize);
      
      const { data, error } = await this.supabase
        .from('users')
        .insert(batch.map(user => ({
          wp_id: user.wp_id,
          username: user.username,
          email: user.email,
          display_name: user.display_name,
          user_url: user.user_url,
          registered_at: user.registered_at
        })))
        .select('id, wp_id');

      if (error) {
        console.error('Error inserting users:', error);
        throw error;
      }

      // Build ID mapping
      data.forEach(user => {
        idMap[user.wp_id] = user.id;
      });
    }

    console.log(`Migrated ${users.length} users`);
    return idMap;
  }

  async migrateCategories(categories) {
    const idMap = {};
    
    if (this.dryRun) {
      console.log(`Would migrate ${categories.length} categories`);
      categories.forEach(cat => {
        idMap[cat.wp_id] = `fake-uuid-${cat.wp_id}`;
      });
      return idMap;
    }

    // Sort categories to handle parent relationships
    const sortedCategories = this.sortCategoriesByParent(categories);

    for (let i = 0; i < sortedCategories.length; i += this.batchSize) {
      const batch = sortedCategories.slice(i, i + this.batchSize);
      
      const { data, error } = await this.supabase
        .from('categories')
        .insert(batch.map(cat => ({
          wp_id: cat.wp_id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parent_id: cat.parent_wp_id ? idMap[cat.parent_wp_id] : null
        })))
        .select('id, wp_id');

      if (error) {
        console.error('Error inserting categories:', error);
        throw error;
      }

      data.forEach(cat => {
        idMap[cat.wp_id] = cat.id;
      });
    }

    console.log(`Migrated ${categories.length} categories`);
    return idMap;
  }

  async migrateTags(tags) {
    const idMap = {};
    
    if (this.dryRun) {
      console.log(`Would migrate ${tags.length} tags`);
      tags.forEach(tag => {
        idMap[tag.wp_id] = `fake-uuid-${tag.wp_id}`;
      });
      return idMap;
    }

    for (let i = 0; i < tags.length; i += this.batchSize) {
      const batch = tags.slice(i, i + this.batchSize);
      
      const { data, error } = await this.supabase
        .from('tags')
        .insert(batch.map(tag => ({
          wp_id: tag.wp_id,
          name: tag.name,
          slug: tag.slug,
          description: tag.description
        })))
        .select('id, wp_id');

      if (error) {
        console.error('Error inserting tags:', error);
        throw error;
      }

      data.forEach(tag => {
        idMap[tag.wp_id] = tag.id;
      });
    }

    console.log(`Migrated ${tags.length} tags`);
    return idMap;
  }

  async migratePosts(posts, userIdMap) {
    const idMap = {};
    
    if (this.dryRun) {
      console.log(`Would migrate ${posts.length} posts`);
      posts.forEach(post => {
        idMap[post.wp_id] = `fake-uuid-${post.wp_id}`;
      });
      return idMap;
    }

    for (let i = 0; i < posts.length; i += this.batchSize) {
      const batch = posts.slice(i, i + this.batchSize);
      
      const { data, error } = await this.supabase
        .from('posts')
        .insert(batch.map(post => ({
          wp_id: post.wp_id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          post_type: post.post_type,
          status: post.status,
          author_id: userIdMap[post.author_wp_id],
          published_at: post.published_at,
          updated_at: post.updated_at
        })))
        .select('id, wp_id');

      if (error) {
        console.error('Error inserting posts:', error);
        throw error;
      }

      data.forEach(post => {
        idMap[post.wp_id] = post.id;
      });
    }

    console.log(`Migrated ${posts.length} posts`);
    return idMap;
  }

  async migrateAttachments(attachments, userIdMap, postIdMap) {
    const idMap = {};

    if (this.dryRun) {
      console.log(`Would migrate ${attachments.length} attachments`);
      attachments.forEach(attachment => {
        idMap[attachment.wp_id] = `fake-uuid-${attachment.wp_id}`;
      });
      return idMap;
    }

    for (let i = 0; i < attachments.length; i += this.batchSize) {
      const batch = attachments.slice(i, i + this.batchSize);

      const { data, error } = await this.supabase
        .from('attachments')
        .insert(batch.map(attachment => ({
          wp_id: attachment.wp_id,
          title: attachment.title,
          slug: attachment.slug,
          content: attachment.content,
          excerpt: attachment.excerpt,
          mime_type: attachment.mime_type,
          status: attachment.status,
          author_id: userIdMap[attachment.author_wp_id],
          parent_post_id: attachment.parent_wp_id ? postIdMap[attachment.parent_wp_id] : null,
          created_at: attachment.created_at,
          updated_at: attachment.updated_at
        })))
        .select('id, wp_id');

      if (error) {
        console.error('Error inserting attachments:', error);
        throw error;
      }

      // Build ID mapping
      data.forEach(attachment => {
        idMap[attachment.wp_id] = attachment.id;
      });
    }

    console.log(`Migrated ${attachments.length} attachments`);
    return idMap;
  }

  async migratePostMeta(postMeta, postIdMap) {
    if (this.dryRun) {
      console.log(`Would migrate ${postMeta.length} post meta entries`);
      return;
    }

    const validMeta = postMeta.filter(meta => postIdMap[meta.post_wp_id]);

    for (let i = 0; i < validMeta.length; i += this.batchSize) {
      const batch = validMeta.slice(i, i + this.batchSize);
      
      const { error } = await this.supabase
        .from('post_meta')
        .insert(batch.map(meta => ({
          post_id: postIdMap[meta.post_wp_id],
          meta_key: meta.meta_key,
          meta_value: meta.meta_value
        })));

      if (error) {
        console.error('Error inserting post meta:', error);
        throw error;
      }
    }

    console.log(`Migrated ${validMeta.length} post meta entries`);
  }

  async migratePostCategories(postCategories, postIdMap, categoryIdMap) {
    if (this.dryRun) {
      console.log(`Would migrate ${postCategories.length} post-category relationships`);
      return;
    }

    const validRelations = postCategories.filter(rel => 
      postIdMap[rel.post_wp_id] && categoryIdMap[rel.category_wp_id]
    );

    for (let i = 0; i < validRelations.length; i += this.batchSize) {
      const batch = validRelations.slice(i, i + this.batchSize);
      
      const { error } = await this.supabase
        .from('post_categories')
        .insert(batch.map(rel => ({
          post_id: postIdMap[rel.post_wp_id],
          category_id: categoryIdMap[rel.category_wp_id]
        })));

      if (error) {
        console.error('Error inserting post categories:', error);
        throw error;
      }
    }

    console.log(`Migrated ${validRelations.length} post-category relationships`);
  }

  async migratePostTags(postTags, postIdMap, tagIdMap) {
    if (this.dryRun) {
      console.log(`Would migrate ${postTags.length} post-tag relationships`);
      return;
    }

    const validRelations = postTags.filter(rel => 
      postIdMap[rel.post_wp_id] && tagIdMap[rel.tag_wp_id]
    );

    for (let i = 0; i < validRelations.length; i += this.batchSize) {
      const batch = validRelations.slice(i, i + this.batchSize);
      
      const { error } = await this.supabase
        .from('post_tags')
        .insert(batch.map(rel => ({
          post_id: postIdMap[rel.post_wp_id],
          tag_id: tagIdMap[rel.tag_wp_id]
        })));

      if (error) {
        console.error('Error inserting post tags:', error);
        throw error;
      }
    }

    console.log(`Migrated ${validRelations.length} post-tag relationships`);
  }

  sortCategoriesByParent(categories) {
    const sorted = [];
    const remaining = [...categories];
    
    // First, add categories without parents
    const withoutParents = remaining.filter(cat => !cat.parent_wp_id);
    sorted.push(...withoutParents);
    remaining.splice(0, remaining.length, ...remaining.filter(cat => cat.parent_wp_id));
    
    // Then add categories with parents (multiple passes may be needed)
    while (remaining.length > 0) {
      const beforeLength = remaining.length;
      
      for (let i = remaining.length - 1; i >= 0; i--) {
        const cat = remaining[i];
        const parentExists = sorted.some(s => s.wp_id === cat.parent_wp_id);
        
        if (parentExists) {
          sorted.push(cat);
          remaining.splice(i, 1);
        }
      }
      
      // Prevent infinite loop
      if (remaining.length === beforeLength) {
        console.warn('Some categories have missing parents, adding them anyway');
        sorted.push(...remaining);
        break;
      }
    }
    
    return sorted;
  }
}

// Run the migration
async function main() {
  const migrator = new SupabaseMigrator();
  await migrator.migrate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SupabaseMigrator;
