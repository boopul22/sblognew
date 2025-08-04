#!/usr/bin/env node

/**
 * Enhanced WordPress to Supabase Migration Runner
 * 
 * This script provides a comprehensive interface for running the WordPress migration
 * with various options and safety checks.
 */

const readline = require('readline');
const EnhancedWordPressMigration = require('./enhanced-wordpress-migration');
require('dotenv').config();

class MigrationRunner {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    try {
      console.log('🚀 Enhanced WordPress to Supabase Migration');
      console.log('=' .repeat(60));
      
      // Show current configuration
      await this.showConfiguration();
      
      // Confirm migration settings
      const confirmed = await this.confirmMigration();
      if (!confirmed) {
        console.log('❌ Migration cancelled by user');
        process.exit(0);
      }
      
      // Run the migration
      const migration = new EnhancedWordPressMigration();
      await migration.migrate();
      
      console.log('\n✅ Migration completed successfully!');
      console.log('📝 Check the migration report for detailed results');
      
    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      console.error('📝 Check the migration report and logs for details');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async showConfiguration() {
    console.log('\n📋 Current Configuration:');
    console.log('-'.repeat(40));
    console.log(`Supabase URL: ${process.env.SUPABASE_URL || 'Not set'}`);
    console.log(`Service Key: ${process.env.SUPABASE_SERVICE_KEY ? '***' + process.env.SUPABASE_SERVICE_KEY.slice(-4) : 'Not set'}`);
    console.log(`Batch Size: ${process.env.BATCH_SIZE || '50'}`);
    console.log(`Dry Run: ${process.env.DRY_RUN || 'false'}`);
    console.log(`WordPress SQL File: ${process.env.WP_SQL_FILE || 'Not specified'}`);
    console.log(`WordPress Base URL: ${process.env.WORDPRESS_BASE_URL || 'Not specified'}`);
    
    // Check for required environment variables
    const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.log('\n⚠️  Missing required environment variables:');
      missing.forEach(key => console.log(`   - ${key}`));
      throw new Error('Missing required environment variables');
    }
  }

  async confirmMigration() {
    console.log('\n⚠️  IMPORTANT WARNINGS:');
    console.log('- This migration will modify your Supabase database');
    console.log('- Existing data may be overwritten if conflicts occur');
    console.log('- Make sure you have a database backup before proceeding');
    
    if (process.env.DRY_RUN === 'true') {
      console.log('\n🔍 DRY RUN MODE: No actual changes will be made');
    } else {
      console.log('\n🚨 LIVE MODE: Changes will be made to your database');
    }
    
    const answer = await this.question('\nDo you want to proceed? (yes/no): ');
    return answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
}

// Command line argument parsing
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--dry-run':
        process.env.DRY_RUN = 'true';
        break;
      case '--batch-size':
        if (args[i + 1]) {
          process.env.BATCH_SIZE = args[i + 1];
          i++; // Skip next argument
        }
        break;
      case '--force':
        options.force = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }
  
  return options;
}

function showHelp() {
  console.log(`
Enhanced WordPress to Supabase Migration

Usage: node run-enhanced-migration.js [options]

Options:
  --dry-run           Run migration in dry-run mode (no actual changes)
  --batch-size <n>    Set batch size for processing (default: 50)
  --force             Skip confirmation prompts
  --help, -h          Show this help message

Environment Variables:
  SUPABASE_URL              Supabase project URL (required)
  SUPABASE_SERVICE_KEY      Supabase service role key (required)
  BATCH_SIZE               Batch size for processing (default: 50)
  DRY_RUN                  Set to 'true' for dry run mode
  WP_SQL_FILE              Path to WordPress SQL dump file
  WORDPRESS_BASE_URL       WordPress site URL for image migration

Examples:
  # Run in dry-run mode
  node run-enhanced-migration.js --dry-run
  
  # Run with custom batch size
  node run-enhanced-migration.js --batch-size 100
  
  # Run with force (skip confirmations)
  node run-enhanced-migration.js --force

Before running:
1. Ensure your .env file is properly configured
2. Make sure extracted WordPress data exists in extracted-data/
3. Create a backup of your Supabase database
4. Test with --dry-run first
`);
}

// Pre-flight checks
async function preflightChecks() {
  const fs = require('fs').promises;
  const path = require('path');
  
  console.log('🔍 Running pre-flight checks...');
  
  // Check if extracted data exists
  const extractedDataPath = path.join(__dirname, 'extracted-data');
  try {
    await fs.access(extractedDataPath);
    console.log('✅ Extracted data directory found');
  } catch (error) {
    throw new Error(`Extracted data directory not found: ${extractedDataPath}`);
  }
  
  // Check for essential data files
  const requiredFiles = ['users.json', 'categories.json', 'posts.json'];
  for (const file of requiredFiles) {
    try {
      await fs.access(path.join(extractedDataPath, file));
      console.log(`✅ ${file} found`);
    } catch (error) {
      throw new Error(`Required data file not found: ${file}`);
    }
  }
  
  console.log('✅ Pre-flight checks passed');
}

// Main execution
async function main() {
  try {
    const options = parseArguments();
    
    await preflightChecks();
    
    if (options.force) {
      // Skip interactive confirmation
      const migration = new EnhancedWordPressMigration();
      await migration.migrate();
      console.log('✅ Migration completed successfully!');
    } else {
      // Run interactive migration
      const runner = new MigrationRunner();
      await runner.run();
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = MigrationRunner;
