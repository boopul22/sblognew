/**
 * Optimized database queries with minimal data fetching
 * Reduces unused JavaScript by only loading required fields
 */

import { supabasePublic } from './supabase.js'

// Base query configurations to reduce data transfer
const BASE_POST_FIELDS = 'id, title, slug, excerpt, published_at, status, featured_image_url, content'
const FULL_POST_FIELDS = 'id, title, slug, content, excerpt, author_id, published_at, status, featured_image_url'
const AUTHOR_FIELDS = 'id, username, display_name, bio'

/**
 * Fetch posts for home page with minimal data
 * Only loads essential fields to reduce bundle size
 */
export const fetchHomePosts = async (page = 0, postsPerPage = 10, searchQuery = '') => {
  const from = page * postsPerPage
  const to = from + postsPerPage - 1

  let query = supabasePublic
    .from('posts')
    .select(BASE_POST_FIELDS)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  // Apply search filter if provided
  if (searchQuery && searchQuery.trim()) {
    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
  }

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  return {
    posts: data || [],
    hasMore: data && data.length === postsPerPage,
    total: count
  }
}

/**
 * Fetch single post with full content
 * Only loads when actually viewing a post
 */
export const fetchSinglePost = async (slug) => {
  const { data, error } = await supabasePublic
    .from('posts')
    .select(`
      ${FULL_POST_FIELDS},
      users:author_id (${AUTHOR_FIELDS}),
      post_categories (
        categories (
          id,
          name,
          slug
        )
      ),
      post_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Post not found')
    }
    throw new Error(`Failed to fetch post: ${error.message}`)
  }

  return data
}

/**
 * Fetch posts by category with minimal data
 */
export const fetchCategoryPosts = async (categorySlug, page = 0, postsPerPage = 10) => {
  const from = page * postsPerPage
  const to = from + postsPerPage - 1

  const { data, error } = await supabase
    .from('posts')
    .select(`
      ${BASE_POST_FIELDS},
      post_categories!inner (
        categories!inner (
          slug
        )
      )
    `)
    .eq('post_categories.categories.slug', categorySlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch category posts: ${error.message}`)
  }

  return {
    posts: data || [],
    hasMore: data && data.length === postsPerPage
  }
}

/**
 * Fetch posts by tag with minimal data
 */
export const fetchTagPosts = async (tagSlug, page = 0, postsPerPage = 10) => {
  const from = page * postsPerPage
  const to = from + postsPerPage - 1

  const { data, error } = await supabase
    .from('posts')
    .select(`
      ${BASE_POST_FIELDS},
      post_tags!inner (
        tags!inner (
          slug
        )
      )
    `)
    .eq('post_tags.tags.slug', tagSlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch tag posts: ${error.message}`)
  }

  return {
    posts: data || [],
    hasMore: data && data.length === postsPerPage
  }
}

/**
 * Fetch posts by author with minimal data
 */
export const fetchAuthorPosts = async (username, page = 0, postsPerPage = 10) => {
  const from = page * postsPerPage
  const to = from + postsPerPage - 1

  const { data, error } = await supabase
    .from('posts')
    .select(`
      ${BASE_POST_FIELDS},
      authors!inner (
        username
      )
    `)
    .eq('authors.username', username)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch author posts: ${error.message}`)
  }

  return {
    posts: data || [],
    hasMore: data && data.length === postsPerPage
  }
}

/**
 * Fetch all authors with minimal data
 */
export const fetchAuthors = async () => {
  const { data, error } = await supabase
    .from('authors')
    .select(`
      ${AUTHOR_FIELDS},
      posts!inner (
        id
      )
    `)
    .order('display_name')

  if (error) {
    throw new Error(`Failed to fetch authors: ${error.message}`)
  }

  // Group by author and count posts
  const authorsMap = new Map()
  
  data?.forEach(author => {
    const key = author.id
    if (!authorsMap.has(key)) {
      authorsMap.set(key, {
        id: author.id,
        username: author.username,
        display_name: author.display_name,
        bio: author.bio,
        post_count: 0
      })
    }
    authorsMap.get(key).post_count++
  })

  return Array.from(authorsMap.values())
}

/**
 * Fetch single author with minimal data
 */
export const fetchAuthor = async (username) => {
  const { data, error } = await supabase
    .from('authors')
    .select(AUTHOR_FIELDS)
    .eq('username', username)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Author not found')
    }
    throw new Error(`Failed to fetch author: ${error.message}`)
  }

  return data
}

/**
 * Fetch categories with post counts
 */
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id, name, slug,
      post_categories (
        posts!inner (
          id
        )
      )
    `)
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data?.map(category => ({
    ...category,
    post_count: category.post_categories?.length || 0
  })) || []
}

/**
 * Fetch tags with post counts
 */
export const fetchTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select(`
      id, name, slug,
      post_tags (
        posts!inner (
          id
        )
      )
    `)
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`)
  }

  return data?.map(tag => ({
    ...tag,
    post_count: tag.post_tags?.length || 0
  })) || []
}
