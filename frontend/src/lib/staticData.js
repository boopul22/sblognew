/**
 * Static data loader for SSG
 * Provides access to pre-generated static data with fallback to dynamic fetching
 */

import { supabasePublic } from './supabase.js'

// Static data cache
let staticDataCache = {
  posts: null,
  authors: null,
  categories: null,
  tags: null,
  routes: null,
  manifest: null
}

// Flag to track if we're in SSG mode
const isSSGMode = import.meta.env.SSG_MODE === 'true'

/**
 * Load static data file with error handling
 */
async function loadStaticData(filename) {
  try {
    const response = await fetch(`/data/static/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.warn(`Failed to load static data ${filename}:`, error)
    return null
  }
}

/**
 * Get all posts with static data fallback
 */
export async function getAllPosts() {
  // Try static data first
  if (!staticDataCache.posts) {
    staticDataCache.posts = await loadStaticData('posts.json')
  }
  
  if (staticDataCache.posts) {
    return staticDataCache.posts
  }

  // Fallback to dynamic fetching
  console.log('Falling back to dynamic post fetching')
  const { data, error } = await supabasePublic
    .from('posts')
    .select(`
      id,
      title,
      slug,
      content,
      excerpt,
      author_id,
      published_at,
      status,
      featured_image_url,
      reading_time,
      users:author_id (
        id,
        username,
        display_name,
        full_name
      ),
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
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  return data || []
}

/**
 * Get single post by slug
 */
export async function getPostBySlug(slug) {
  const posts = await getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

/**
 * Get posts with pagination and search
 */
export async function getPostsPaginated(page = 0, postsPerPage = 10, searchQuery = '') {
  const allPosts = await getAllPosts()
  
  let filteredPosts = allPosts
  
  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filteredPosts = allPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query)
    )
  }

  const from = page * postsPerPage
  const to = from + postsPerPage
  const paginatedPosts = filteredPosts.slice(from, to)

  return {
    posts: paginatedPosts,
    hasMore: to < filteredPosts.length,
    total: filteredPosts.length
  }
}

/**
 * Get all authors with static data fallback
 */
export async function getAllAuthors() {
  // Try static data first
  if (!staticDataCache.authors) {
    staticDataCache.authors = await loadStaticData('authors.json')
  }
  
  if (staticDataCache.authors) {
    return staticDataCache.authors
  }

  // Fallback to dynamic fetching
  console.log('Falling back to dynamic author fetching')
  const { data, error } = await supabasePublic
    .from('users')
    .select('id, user_login, display_name, user_registered')
    .order('display_name')

  if (error) {
    throw new Error(`Failed to fetch authors: ${error.message}`)
  }

  return data || []
}

/**
 * Get author by username
 */
export async function getAuthorByUsername(username) {
  const authors = await getAllAuthors()
  return authors.find(author => author.username === username) || null
}

/**
 * Get posts by author
 */
export async function getPostsByAuthor(authorId, searchQuery = '') {
  const allPosts = await getAllPosts()
  let authorPosts = allPosts.filter(post => post.author_id === authorId)

  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    authorPosts = authorPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query)
    )
  }

  return authorPosts
}

/**
 * Get all categories with static data fallback
 */
export async function getAllCategories() {
  // Try static data first
  if (!staticDataCache.categories) {
    staticDataCache.categories = await loadStaticData('categories.json')
  }
  
  if (staticDataCache.categories) {
    return staticDataCache.categories
  }

  // Fallback to dynamic fetching
  console.log('Falling back to dynamic category fetching')
  const { data, error } = await supabasePublic
    .from('categories')
    .select('id, name, slug, description')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data || []
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug) {
  const categories = await getAllCategories()
  return categories.find(category => category.slug === slug) || null
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(categoryId, searchQuery = '') {
  const allPosts = await getAllPosts()
  let categoryPosts = allPosts.filter(post => 
    post.categories && post.categories.some(cat => cat.id === categoryId)
  )

  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    categoryPosts = categoryPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query)
    )
  }

  return categoryPosts
}

/**
 * Get all tags with static data fallback
 */
export async function getAllTags() {
  // Try static data first
  if (!staticDataCache.tags) {
    staticDataCache.tags = await loadStaticData('tags.json')
  }
  
  if (staticDataCache.tags) {
    return staticDataCache.tags
  }

  // Fallback to dynamic fetching
  console.log('Falling back to dynamic tag fetching')
  const { data, error } = await supabasePublic
    .from('tags')
    .select('id, name, slug, description')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`)
  }

  return data || []
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug) {
  const tags = await getAllTags()
  return tags.find(tag => tag.slug === slug) || null
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tagId, searchQuery = '') {
  const allPosts = await getAllPosts()
  let tagPosts = allPosts.filter(post => 
    post.tags && post.tags.some(tag => tag.id === tagId)
  )

  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    tagPosts = tagPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query)
    )
  }

  return tagPosts
}

/**
 * Get all routes for SSG
 */
export async function getAllRoutes() {
  if (!staticDataCache.routes) {
    staticDataCache.routes = await loadStaticData('routes.json')
  }
  
  return staticDataCache.routes || []
}

/**
 * Get build manifest
 */
export async function getBuildManifest() {
  if (!staticDataCache.manifest) {
    staticDataCache.manifest = await loadStaticData('manifest.json')
  }
  
  return staticDataCache.manifest || null
}

/**
 * Clear static data cache (useful for development)
 */
export function clearStaticDataCache() {
  staticDataCache = {
    posts: null,
    authors: null,
    categories: null,
    tags: null,
    routes: null,
    manifest: null
  }
}
