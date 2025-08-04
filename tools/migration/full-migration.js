const WordPressDataExtractor = require('./extract-data');
const SupabaseMigrator = require('./migrate-to-supabase');
const ImageMigrator = require('./migrate-images');
const StorageSetup = require('./setup-storage');
require('dotenv').config();

class FullMigration {
  constructor() {
    this.sqlFilePath = process.env.WP_SQL_FILE || '../u957990218_GpBKT.sql';
    this.wordpressBaseUrl = process.env.WORDPRESS_BASE_URL || '';
    this.dryRun = process.env.DRY_RUN === 'true';
  }

  async runFullMigration() {
    console.log('🚀 Starting full WordPress to Supabase migration...');
    console.log(`SQL File: ${this.sqlFilePath}`);
    console.log(`WordPress Base URL: ${this.wordpressBaseUrl}`);
    console.log(`Dry Run: ${this.dryRun}`);
    console.log('=' .repeat(60));

    try {
      // Step 1: Extract data from WordPress SQL
      console.log('\n📊 Step 1: Extracting data from WordPress SQL...');
      const extractor = new WordPressDataExtractor(this.sqlFilePath);
      await extractor.extractData();

      // Step 2: Set up Supabase storage
      console.log('\n🗄️  Step 2: Setting up Supabase storage...');
      const storageSetup = new StorageSetup();
      await storageSetup.setupImagesBucket();

      // Step 3: Migrate basic data (users, categories, tags, posts)
      console.log('\n📝 Step 3: Migrating basic data to Supabase...');
      const migrator = new SupabaseMigrator();
      await migrator.migrate();

      // Step 4: Migrate images
      console.log('\n🖼️  Step 4: Migrating images...');
      if (this.wordpressBaseUrl) {
        const imageMigrator = new ImageMigrator();
        await imageMigrator.migrateImages();
      } else {
        console.log('⚠️  WORDPRESS_BASE_URL not set. Skipping image download and upload.');
        console.log('   Images will be migrated to database but files won\'t be downloaded.');
      }

      // Step 5: Verification
      console.log('\n✅ Step 5: Verifying migration...');
      await this.verifyMigration();

      console.log('\n🎉 Full migration completed successfully!');
      console.log('=' .repeat(60));

    } catch (error) {
      console.error('\n❌ Migration failed:', error);
      throw error;
    }
  }

  async verifyMigration() {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    try {
      // Count records in each table
      const tables = ['users', 'categories', 'tags', 'posts', 'attachments'];
      const counts = {};

      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.warn(`Could not count ${table}:`, error.message);
          counts[table] = 'Error';
        } else {
          counts[table] = count;
        }
      }

      console.log('\n📊 Migration Summary:');
      console.log('─'.repeat(30));
      Object.entries(counts).forEach(([table, count]) => {
        console.log(`${table.padEnd(12)}: ${count}`);
      });

      // Check storage bucket
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (!bucketError) {
        const imagesBucket = buckets.find(b => b.name === 'images');
        if (imagesBucket) {
          console.log(`Storage       : ✅ Images bucket ready`);
        } else {
          console.log(`Storage       : ❌ Images bucket not found`);
        }
      }

      // Sample a few posts to check content
      const { data: samplePosts, error: postsError } = await supabase
        .from('posts')
        .select('title, content')
        .limit(3);

      if (!postsError && samplePosts.length > 0) {
        console.log('\n📝 Sample Posts:');
        samplePosts.forEach((post, index) => {
          console.log(`${index + 1}. ${post.title.substring(0, 50)}...`);
        });
      }

    } catch (error) {
      console.error('Verification failed:', error);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
WordPress to Supabase Migration Tool

Usage: node full-migration.js [options]

Options:
  --help, -h          Show this help message
  --dry-run          Run in dry-run mode (no actual changes)
  --extract-only     Only extract data from WordPress SQL
  --migrate-only     Only migrate to Supabase (skip extraction)
  --images-only      Only migrate images
  --verify-only      Only run verification

Environment Variables:
  WP_SQL_FILE        Path to WordPress SQL dump file
  WORDPRESS_BASE_URL Base URL of WordPress site (for image downloads)
  SUPABASE_URL       Supabase project URL
  SUPABASE_SERVICE_KEY Supabase service role key
  DRY_RUN           Set to 'true' for dry run mode
  BATCH_SIZE        Batch size for database operations (default: 100)

Examples:
  node full-migration.js
  node full-migration.js --dry-run
  node full-migration.js --images-only
    `);
    return;
  }

  // Set dry run mode if specified
  if (args.includes('--dry-run')) {
    process.env.DRY_RUN = 'true';
  }

  const migration = new FullMigration();

  try {
    if (args.includes('--extract-only')) {
      console.log('Running extraction only...');
      const extractor = new WordPressDataExtractor(migration.sqlFilePath);
      await extractor.extractData();
    } else if (args.includes('--migrate-only')) {
      console.log('Running migration only...');
      const migrator = new SupabaseMigrator();
      await migrator.migrate();
    } else if (args.includes('--images-only')) {
      console.log('Running image migration only...');
      const imageMigrator = new ImageMigrator();
      await imageMigrator.migrateImages();
    } else if (args.includes('--verify-only')) {
      console.log('Running verification only...');
      await migration.verifyMigration();
    } else {
      // Run full migration
      await migration.runFullMigration();
    }

    console.log('\n✅ Operation completed successfully!');
  } catch (error) {
    console.error('\n❌ Operation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FullMigration;
