import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ktxhnxmdbfkswmkikgum.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eGhueG1kYmZrc3dta2lrZ3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjE5OTksImV4cCI6MjA2OTUzNzk5OX0.5uWgEIlaGqHQupdBEsu76kzPDN3vzq4UFEknmKSpmHg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
