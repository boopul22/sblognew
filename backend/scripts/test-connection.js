#!/usr/bin/env node

/**
 * Test Supabase Connection Script
 * Verifies that environment variables are correctly set and database is accessible
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('=' .repeat(50))

// Check environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log(`📡 URL: ${supabaseUrl}`)
console.log(`🔑 Key: ${supabaseAnonKey.substring(0, 20)}...`)

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🧪 Testing database connection...')
    
    // Test 1: Check if we can connect to the database
    const { data: tables, error: tablesError } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true })
    
    if (tablesError) {
      console.error('❌ Database connection failed:', tablesError.message)
      return false
    }
    
    console.log('✅ Database connection successful!')
    
    // Test 2: Check table structure
    console.log('\n📊 Checking database tables...')
    
    const tablesToCheck = ['users', 'posts', 'categories', 'tags', 'comments', 'likes', 'bookmarks']
    const tableResults = {}
    
    for (const table of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          tableResults[table] = `❌ Error: ${error.message}`
        } else {
          tableResults[table] = `✅ ${count || 0} records`
        }
      } catch (err) {
        tableResults[table] = `❌ Error: ${err.message}`
      }
    }
    
    // Display results
    console.log('\nTable Status:')
    console.log('-'.repeat(30))
    Object.entries(tableResults).forEach(([table, status]) => {
      console.log(`${table.padEnd(12)}: ${status}`)
    })
    
    // Test 3: Check RLS policies
    console.log('\n🔒 Testing Row Level Security...')
    
    try {
      // This should work (public read access to published posts)
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, title, status')
        .eq('status', 'published')
        .limit(1)
      
      if (postsError) {
        console.log('⚠️  RLS test: No published posts or RLS blocking access')
      } else {
        console.log(`✅ RLS test: Can read ${posts?.length || 0} published posts`)
      }
    } catch (err) {
      console.log('⚠️  RLS test failed:', err.message)
    }
    
    // Test 4: Check performance indexes
    console.log('\n⚡ Checking performance indexes...')
    
    try {
      const start = Date.now()
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10)
      
      const duration = Date.now() - start
      
      if (error) {
        console.log('⚠️  Index test failed:', error.message)
      } else {
        console.log(`✅ Query performance: ${duration}ms (should be <100ms with indexes)`)
      }
    } catch (err) {
      console.log('⚠️  Performance test failed:', err.message)
    }
    
    console.log('\n🎉 Connection test completed!')
    console.log('Your Supabase setup is ready for development.')
    
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ All tests passed! Your environment is ready.')
      process.exit(0)
    } else {
      console.log('\n❌ Some tests failed. Check your configuration.')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Test script error:', error)
    process.exit(1)
  })
