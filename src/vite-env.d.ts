/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_STORAGE_PROVIDER: string
  readonly VITE_R2_PUBLIC_URL?: string
  readonly VITE_R2_BUCKET_NAME?: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GA_TRACKING_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Extend Window interface for global variables
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    Sentry?: {
      captureException: (error: Error, context?: any) => void
    }
  }
}
