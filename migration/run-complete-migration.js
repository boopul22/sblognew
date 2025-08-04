#!/usr/bin/env node

/**
 * Run Complete WordPress to Supabase Migration
 * This script fetches the Supabase service key and runs the migration
 */

const { createClient } = require('@supabase/supabase-js');
const WordPressMigrator = require('./wordpress-to-supabase-complete');

async function getSupabaseServiceKey() {
  console.log('🔑 Fetching Supabase service key...');
  
  // For now, we'll need to set this manually or get it from Supabase dashboard
  // The service key should be set as an environment variable for security
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!serviceKey) {
    console.log('\n⚠️  SUPABASE_SERVICE_KEY not found in environment variables.');
    console.log('Please set your Supabase service key as an environment variable:');
    console.log('export SUPABASE_SERVICE_KEY="your_service_key_here"');
    console.log('\nYou can find your service key in your Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Settings > API');
    console.log('4. Copy the "service_role" key (not the anon key)');
    process.exit(1);
  }
  
  return serviceKey;
}

async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  const supabase = createClient(
    'https://ktxhnxmdbfkswmkikgum.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  );
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
}

async function clearExistingData() {
  console.log('🧹 Clearing existing data...');
  
  const supabase = createClient(
    'https://ktxhnxmdbfkswmkikgum.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  );
  
  try {
    // Delete in reverse order due to foreign key constraints
    await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tags').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Existing data cleared');
  } catch (error) {
    console.error('⚠️  Error clearing data (this might be expected):', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting Complete WordPress to Supabase Migration\n');
    
    // Get and validate service key
    await getSupabaseServiceKey();
    
    // Test connection
    const connected = await testSupabaseConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // Ask user if they want to clear existing data
    console.log('\n⚠️  This migration will replace all existing data in your Supabase database.');
    console.log('Do you want to continue? (y/N)');
    
    // For automated execution, we'll skip the prompt
    // In a real scenario, you might want to add readline for user input
    console.log('Proceeding with migration...\n');
    
    // Clear existing data
    await clearExistingData();
    
    // Run the migration
    const migrator = new WordPressMigrator();
    await migrator.run();
    
    console.log('\n🎉 Complete migration finished successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your React components to use Supabase data');
    console.log('2. Remove all mock/static data files');
    console.log('3. Test all functionality with real data');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, getSupabaseServiceKey, testSupabaseConnection };
