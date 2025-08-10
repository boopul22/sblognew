#!/usr/bin/env node

/**
 * Update user role to admin
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from the root .env.local file
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_KEY')
  console.error('\nPlease check your .env.local file.')
  process.exit(1)
}

// Create Supabase client with service key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateUserRole() {
  console.log('🚀 Updating user role to admin...\n')

  const email = 'bipul281b@gmail.com'

  try {
    // First, get the user from auth
    console.log('1. Finding user in Supabase Auth...')
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    const authUser = users.find(u => u.email === email)
    if (!authUser) {
      throw new Error(`User with email ${email} not found in auth`)
    }

    console.log(`✅ Found user: ${authUser.id}`)

    // Check if user exists in users table
    console.log('2. Checking users table...')
    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)

    if (selectError) {
      throw selectError
    }

    if (existingUsers && existingUsers.length > 0) {
      // Update existing user
      console.log('3. Updating existing user role...')
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.id)

      if (updateError) {
        throw updateError
      }

      console.log('✅ User role updated to admin')
    } else {
      // Insert new user record
      console.log('3. Creating user record...')
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: 'Bipul Kumar',
          display_name: 'Bipul Kumar',
          username: 'bipul',
          role: 'admin',
          registered_at: authUser.created_at,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        throw insertError
      }

      console.log('✅ User record created with admin role')
    }

    console.log('\n🎉 Success! You can now access the admin dashboard.')
    console.log('Visit: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error updating user role:', error.message)
    process.exit(1)
  }
}

updateUserRole()
