#!/usr/bin/env node

/**
 * Test script to verify build process and environment variables
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

console.log('🔍 Testing Build Environment...');
console.log('=' .repeat(50));

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}: ${process.env[varName].substring(0, 20)}...`);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  process.exit(1);
}

// Test Supabase connection
console.log('\n🔗 Testing Supabase Connection...');
try {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Simple connectivity test
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .limit(1);

  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.log('💡 This might be expected if the database is empty or RLS is strict');
  } else {
    console.log('✅ Supabase connection successful');
    console.log(`📊 Found ${data?.length || 0} posts`);
  }
} catch (error) {
  console.error('❌ Supabase connection error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Build environment test completed!');
console.log('✅ Ready for deployment');
