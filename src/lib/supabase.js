import { createClient } from '@supabase/supabase-js'

// ⚠️ IMPORTANT: Always use environment variables for sensitive data
// Never hardcode API keys or URLs directly in the code
// See ENVIRONMENT_VARIABLES.md for setup instructions

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file and ENVIRONMENT_VARIABLES.md')
}

// Create optimized Supabase client with minimal configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable auth session persistence to reduce bundle size
    autoRefreshToken: false, // Disable auto refresh since we're not using auth
    detectSessionInUrl: false // Disable URL session detection
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
