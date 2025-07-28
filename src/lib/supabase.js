import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ckjpejxjpcfmlyopqabt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNranBlanhqcGNmbWx5b3BxYWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTk5OTUsImV4cCI6MjA2OTI5NTk5NX0.sdinJPYznrITCIJBijRV2iwA0TSLLsTmLWtTYY37OLE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
