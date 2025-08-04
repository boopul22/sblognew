#!/usr/bin/env node

/**
 * Setup Admin User Script
 * Creates an admin user in Supabase Auth and the users table
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   VITE_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_KEY')
  console.error('\nPlease check your .env file.')
  process.exit(1)
}

// Create Supabase client with service key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAdminUser() {
  console.log('🚀 Setting up admin user...\n')

  const email = 'bipul281b@gmail.com'
  const password = 'admin123' // Change this to a secure password
  const userData = {
    email,
    full_name: 'Bipul Kumar',
    username: 'bipul',
    display_name: 'Bipul Kumar',
    role: 'admin'
  }

  try {
    // Step 1: Create user in Supabase Auth
    console.log('1. Creating user in Supabase Auth...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: userData
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('   ✅ User already exists in Auth')
        
        // Get existing user
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.email === email)
        
        if (existingUser) {
          authData.user = existingUser
        } else {
          throw authError
        }
      } else {
        throw authError
      }
    } else {
      console.log('   ✅ User created in Auth')
    }

    // Step 2: Check if user exists in users table
    console.log('2. Checking users table...')
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingUser) {
      console.log('   ✅ User already exists in users table')
      
      // Update role to admin if needed
      if (existingUser.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', authData.user.id)
        
        if (updateError) throw updateError
        console.log('   ✅ Updated user role to admin')
      }
    } else {
      // Step 3: Create user record in users table
      console.log('3. Creating user record in users table...')
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          username: userData.username,
          display_name: userData.display_name,
          role: userData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (insertError) {
        throw insertError
      }
      console.log('   ✅ User record created in users table')
    }

    console.log('\n🎉 Admin user setup complete!')
    console.log('\nLogin credentials:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('\n⚠️  IMPORTANT: Change the password after first login!')
    console.log('\nYou can now login at: http://localhost:5173/admin/login')

  } catch (error) {
    console.error('\n❌ Error setting up admin user:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupAdminUser()
