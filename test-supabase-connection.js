#!/usr/bin/env node

/**
 * Test Supabase Connection
 * Quick test to see if the Supabase client is working correctly
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

// Create public client (same as supabasePublic)
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'sayari-blog-test@1.0.0'
    }
  }
})

async function testConnection() {
  try {
    console.log('\n📡 Testing connection to posts table...')
    
    const { data, error } = await supabasePublic
      .from('posts')
      .select('id, title, slug, status')
      .eq('status', 'published')
      .limit(3)

    if (error) {
      console.error('❌ Error fetching posts:', error)
      return
    }

    console.log('✅ Successfully fetched posts:')
    data.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title} (${post.slug})`)
    })

    console.log('\n🎉 Connection test successful!')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testConnection()
