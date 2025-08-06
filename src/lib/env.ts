import { z } from 'zod'

// Environment variable schema for type safety
const envSchema = z.object({
  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  
  // Storage Configuration
  VITE_STORAGE_PROVIDER: z.enum(['cloudflare-r2', 'supabase']).default('cloudflare-r2'),
  VITE_R2_PUBLIC_URL: z.string().url().optional(),
  VITE_R2_BUCKET_NAME: z.string().optional(),
  
  // Application Configuration
  VITE_APP_URL: z.string().url().default('http://localhost:3000'),
  VITE_APP_NAME: z.string().default('Sayari Blog'),
  
  // Development/Production flags
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEV: z.boolean().default(false),
  PROD: z.boolean().default(false),
  
  // Optional Analytics/Monitoring
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_GA_TRACKING_ID: z.string().optional(),
})

// Parse and validate environment variables
function parseEnv() {
  const rawEnv = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_STORAGE_PROVIDER: import.meta.env.VITE_STORAGE_PROVIDER,
    VITE_R2_PUBLIC_URL: import.meta.env.VITE_R2_PUBLIC_URL,
    VITE_R2_BUCKET_NAME: import.meta.env.VITE_R2_BUCKET_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    NODE_ENV: import.meta.env.NODE_ENV,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID,
  }

  const result = envSchema.safeParse(rawEnv)
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:')
    console.error(result.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables. Check your .env file and ENVIRONMENT_VARIABLES.md')
  }
  
  return result.data
}

// Export typed environment variables
export const env = parseEnv()

// Type for environment variables
export type Env = z.infer<typeof envSchema>

// Utility to check if we're in development
export const isDev = env.NODE_ENV === 'development'
export const isProd = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Utility to get app URL with proper trailing slash handling
export const getAppUrl = (path = '') => {
  const baseUrl = env.VITE_APP_URL.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl
}
