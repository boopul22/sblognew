import { createClient } from '@supabase/supabase-js'

// ⚠️ IMPORTANT: Always use environment variables for sensitive data
// Never hardcode API keys or URLs directly in the code
// See ENVIRONMENT_VARIABLES.md for setup instructions

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file and ENVIRONMENT_VARIABLES.md')
}

// Create Supabase client with authentication enabled for admin functionality
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable auth session persistence for admin login
    autoRefreshToken: true, // Enable auto refresh for admin sessions
    detectSessionInUrl: true // Enable URL session detection for auth flows
  },
  db: {
    schema: 'public' // Explicitly set schema to reduce overhead
  },
  global: {
    headers: {
      'X-Client-Info': 'sayari-blog@1.0.0' // Custom client identifier
    }
  }
})

// Create a separate client for public operations (reading published posts)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable auth session persistence for public operations
    autoRefreshToken: false, // Disable auto refresh for public operations
    detectSessionInUrl: false // Disable URL session detection for public operations
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'sayari-blog-public@1.0.0'
    }
  }
})
