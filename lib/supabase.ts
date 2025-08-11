import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'sharevault'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          username: string | null
          full_name: string | null
          display_name: string | null
          user_login: string | null
          user_url: string | null
          avatar_url: string | null
          bio: string | null
          role: string
          wp_id: number | null
          registered_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          display_name?: string | null
          user_login?: string | null
          user_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          wp_id?: number | null
          registered_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          display_name?: string | null
          user_login?: string | null
          user_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          wp_id?: number | null
          registered_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          parent_id: string | null
          wp_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          parent_id?: string | null
          wp_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          parent_id?: string | null
          wp_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          wp_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          wp_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          wp_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          featured_image_url: string | null
          status: string
          author_id: string | null
          category_id: string | null
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          reading_time: number | null
          view_count: number
          wp_id: number | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          featured_image_url?: string | null
          status?: string
          author_id?: string | null
          category_id?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          reading_time?: number | null
          view_count?: number
          wp_id?: number | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          featured_image_url?: string | null
          status?: string
          author_id?: string | null
          category_id?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          reading_time?: number | null
          view_count?: number
          wp_id?: number | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      post_categories: {
        Row: {
          id: string
          post_id: string | null
          category_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          category_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          category_id?: string | null
          created_at?: string
        }
      }
      post_tags: {
        Row: {
          id: string
          post_id: string | null
          tag_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          tag_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          tag_id?: string | null
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string | null
          post_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          post_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          post_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
