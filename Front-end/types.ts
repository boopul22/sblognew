export interface User {
  id: string;
  email?: string | null;
  username?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  display_name_en_hi?: string; // Custom field for frontend
  user_login?: string | null;
  user_url?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  role: string;
  wp_id?: number | null;
  registered_at: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en_hi?: string; // Custom field for frontend
  slug: string;
  description?: string | null;
  color: string;
  parent_id?: string | null;
  wp_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  name_en_hi?: string; // Custom field for frontend
  slug: string;
  description?: string | null;
  color: string;
  wp_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface PostCategory {
  categories: Category;
}

export interface PostTag {
  tags: Tag;
}

export interface Shayari {
  id: number;
  theme: 'love' | 'sad' | 'motivational' | 'friendship' | 'life';
  lines: string[];
  lines_en_hi: string[];
  author: string;
  author_en_hi: string;
  likes: number;
  views: number;
  shares: number;
}

export interface Post {
  id: string;
  title: string;
  title_en_hi?: string; // Custom field for frontend
  slug: string;
  content: string;
  content_en_hi?: string; // Custom field for frontend
  excerpt?: string | null;
  excerpt_en_hi?: string; // Custom field for frontend
  featured_image?: string | null;
  featured_image_url?: string | null;
  status: string;
  author_id?: string | null;
  category_id?: string | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  reading_time?: number | null;
  view_count: number;
  wp_id?: number | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined data from relationships
  users?: User;
  post_categories?: PostCategory[];
  post_tags?: PostTag[];
  likes?: number; // Calculated field
  shayariCollection?: Shayari[];
}