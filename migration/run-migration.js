#!/usr/bin/env node

/**
 * WordPress to Supabase Migration Runner
 * 
 * Usage: node run-migration.js [path-to-data.sql]
 */

const path = require('path');
const WordPressMigrator = require('./wordpress-to-supabase-migration');

async function main() {
  const args = process.argv.slice(2);
  const sqlFilePath = args[0] || '../data.sql';
  
  console.log('🚀 WordPress to Supabase Migration Tool');
  console.log('=====================================\n');
  
  if (!require('fs').existsSync(sqlFilePath)) {
    console.error(`❌ SQL file not found: ${sqlFilePath}`);
    console.log('Usage: node run-migration.js [path-to-data.sql]');
    process.exit(1);
  }
  
  const migrator = new WordPressMigrator();
  
  try {
    const startTime = Date.now();
    const results = await migrator.migrate(sqlFilePath);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n🎉 Migration Summary:');
    console.log('====================');
    console.log(`✅ Users migrated: ${results.users}`);
    console.log(`✅ Categories migrated: ${results.categories}`);
    console.log(`✅ Posts migrated: ${results.posts}`);
    console.log(`✅ Relationships migrated: ${results.relationships}`);
    console.log(`⏱️  Total time: ${duration} seconds\n`);
    
    console.log('🎯 Next Steps:');
    console.log('- Update your React app to remove all mock data');
    console.log('- Test the website with real Supabase data');
    console.log('- Verify search, filtering, and pagination work correctly');
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
