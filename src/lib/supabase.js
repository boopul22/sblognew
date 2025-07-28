import { createClient } from '@supabase/supabase-js'

// ⚠️ IMPORTANT: Always use environment variables for sensitive data
// Never hardcode API keys or URLs directly in the code
// See ENVIRONMENT_VARIABLES.md for setup instructions

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file and ENVIRONMENT_VARIABLES.md')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
