#!/usr/bin/env node

/**
 * Simple WordPress to Supabase Migration Script
 * Manually migrates key content from WordPress to Supabase
 */

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

class SimpleMigrator {
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
    
    const users = [
      {
        wp_id: 1,
        username: 'admin',
        email: 'admin@zayotech.com',
        full_name: 'Admin User',
        display_name: 'Admin',
        user_login: 'admin',
        user_url: 'https://zayotech.com',
        role: 'admin',
        registered_at: '2023-07-20 22:58:21'
      },
      {
        wp_id: 2,
        username: 'author',
        email: 'author@zayotech.com',
        full_name: 'Content Author',
        display_name: 'Author',
        user_login: 'author',
        user_url: 'https://zayotech.com',
        role: 'author',
        registered_at: '2023-07-20 22:58:21'
      }
    ];

    const { data, error } = await supabase
      .from('users')
      .upsert(users, { onConflict: 'wp_id' });

    if (error) {
      console.error('❌ Error migrating users:', error);
      throw error;
    }

    console.log(`✅ Migrated ${users.length} users`);
    return data;
  }

  async migrateCategories() {
    console.log('📁 Migrating categories...');
    
    const categories = [
      {
        wp_id: 1,
        name: 'Love Shayari',
        slug: 'love-shayari',
        description: 'Beautiful love shayari in Hindi'
      },
      {
        wp_id: 2,
        name: 'Sad Shayari',
        slug: 'sad-shayari',
        description: 'Heart touching sad shayari'
      },
      {
        wp_id: 3,
        name: 'Motivational Quotes',
        slug: 'motivational-quotes',
        description: 'Inspirational and motivational quotes'
      },
      {
        wp_id: 4,
        name: 'Hindi Shayari',
        slug: 'hindi-shayari',
        description: 'Collection of Hindi shayari'
      },
      {
        wp_id: 5,
        name: 'Friendship Shayari',
        slug: 'friendship-shayari',
        description: 'Shayari about friendship'
      }
    ];

    const { data, error } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'wp_id' });

    if (error) {
      console.error('❌ Error migrating categories:', error);
      throw error;
    }

    console.log(`✅ Migrated ${categories.length} categories`);
    return data;
  }

  async migrateTags() {
    console.log('🏷️ Migrating tags...');
    
    const tags = [
      { wp_id: 1, name: 'Hindi', slug: 'hindi', description: 'Hindi content' },
      { wp_id: 2, name: 'Shayari', slug: 'shayari', description: 'Shayari posts' },
      { wp_id: 3, name: 'Love', slug: 'love', description: 'Love related content' },
      { wp_id: 4, name: 'Sad', slug: 'sad', description: 'Sad content' },
      { wp_id: 5, name: 'Motivational', slug: 'motivational', description: 'Motivational content' },
      { wp_id: 6, name: 'Quotes', slug: 'quotes', description: 'Quotes and sayings' },
      { wp_id: 7, name: 'Friendship', slug: 'friendship', description: 'Friendship content' },
      { wp_id: 8, name: 'Life', slug: 'life', description: 'Life related content' },
      { wp_id: 9, name: 'Inspirational', slug: 'inspirational', description: 'Inspirational content' },
      { wp_id: 10, name: 'Heart Touching', slug: 'heart-touching', description: 'Emotional content' }
    ];

    const { data, error } = await supabase
      .from('tags')
      .upsert(tags, { onConflict: 'wp_id' });

    if (error) {
      console.error('❌ Error migrating tags:', error);
      throw error;
    }

    console.log(`✅ Migrated ${tags.length} tags`);
    return data;
  }

  async migratePosts() {
    console.log('📝 Migrating posts...');
    
    // Get user and category mappings
    const { data: users } = await supabase.from('users').select('id, wp_id');
    const { data: categories } = await supabase.from('categories').select('id, wp_id');
    
    const userMap = new Map(users.map(u => [u.wp_id, u.id]));
    const categoryMap = new Map(categories.map(c => [c.wp_id, c.id]));

    const posts = [
      {
        wp_id: 196,
        title: 'Inspirational Quotes',
        slug: 'inspirational-quotes',
        content: `<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><strong>Inspirational Quotes:</strong> Here are more than 100 of the best English quotes that can motivate you every day. If you want to be successful, you must always keep yourself inspired. You will get a lot out of these words, and they will change your life.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">यहां अंग्रेजी में सौ से अधिक सर्वश्रेष्ठ प्रेरणादायक उद्धरण मिलेंगे, जो आपको हर दिन प्रेरित करेंगे। यदि आप सफलता चाहते हैं तो हमेशा प्रेरित रहें। आपकी जिंदगी इन कोट्स से बदल जाएगी।</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>Calm is a superpower.</p>
</blockquote>
<!-- /wp:quote -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>Everything you can imagine is real.</p>
</blockquote>
<!-- /wp:quote -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>You are never too old to set another goal or to dream a new dream.</p>
</blockquote>
<!-- /wp:quote -->`,
        excerpt: 'Inspirational Quotes: Here are more than 100 of the best English quotes that can motivate you every day.',
        status: 'published',
        author_id: userMap.get(2),
        category_id: categoryMap.get(3),
        published_at: '2024-02-21 15:37:46',
        reading_time: 5
      },
      {
        wp_id: 228,
        title: 'Happy New Year Wishes in Hindi',
        slug: 'happy-new-year-wishes-in-hindi',
        content: `<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">नव वर्ष के इस शुभ अवसर पर हम आपके लिए लेकर आये हैं हिंदी में शुभकामनाओं और शायरियों का एक बेहतरीन संग्रह।</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>नया साल आपके जीवन में खुशियों की बारिश लाए,<br>
हर दिन आपके लिए नई उमंग और नई आशा लाए।<br>
नव वर्ष की हार्दिक शुभकामनाएं!</p>
</blockquote>
<!-- /wp:quote -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>बीते साल की यादें दिल में बसी रहें,<br>
नए साल में आपकी सभी मुरादें पूरी हों।<br>
Happy New Year 2024!</p>
</blockquote>
<!-- /wp:quote -->`,
        excerpt: 'नव वर्ष के इस शुभ अवसर पर हम आपके लिए लेकर आये हैं हिंदी में शुभकामनाओं और शायरियों का एक बेहतरीन संग्रह।',
        status: 'published',
        author_id: userMap.get(2),
        category_id: categoryMap.get(1),
        published_at: '2023-08-09 17:01:08',
        reading_time: 3
      },
      {
        wp_id: 300,
        title: 'Love Shayari in Hindi',
        slug: 'love-shayari-in-hindi',
        content: `<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">प्रेम की गहराई को व्यक्त करने वाली सबसे खूबसूरत हिंदी शायरी का संग्रह।</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>तुम्हारी मोहब्बत में हमने जो खुशी पाई है,<br>
वो खुशी हमें जन्नत में भी नहीं मिल सकती।<br>
तुम हो तो जिंदगी है, तुम नहीं तो कुछ भी नहीं।</p>
</blockquote>
<!-- /wp:quote -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>इश्क़ में हमने सिर्फ तुम्हें चाहा है,<br>
तुम्हारे सिवा किसी और को नहीं देखा है।<br>
तुम्हारी मोहब्बत ही हमारी जिंदगी है।</p>
</blockquote>
<!-- /wp:quote -->`,
        excerpt: 'प्रेम की गहराई को व्यक्त करने वाली सबसे खूबसूरत हिंदी शायरी का संग्रह।',
        status: 'published',
        author_id: userMap.get(2),
        category_id: categoryMap.get(1),
        published_at: '2023-08-10 10:30:00',
        reading_time: 4
      }
    ];

    const { data, error } = await supabase
      .from('posts')
      .upsert(posts, { onConflict: 'wp_id' });

    if (error) {
      console.error('❌ Error migrating posts:', error);
      throw error;
    }

    console.log(`✅ Migrated ${posts.length} posts`);
    return data;
  }

  async run() {
    try {
      console.log('🚀 Starting Simple WordPress to Supabase migration...\n');
      
      await this.clearExistingData();
      await this.migrateUsers();
      await this.migrateCategories();
      await this.migrateTags();
      await this.migratePosts();
      
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n📊 Migration Summary:');
      console.log('   👥 Users migrated: 2');
      console.log('   📁 Categories migrated: 5');
      console.log('   🏷️  Tags migrated: 10');
      console.log('   📝 Posts migrated: 3');
      
    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      process.exit(1);
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new SimpleMigrator();
  migrator.run();
}

module.exports = SimpleMigrator;
