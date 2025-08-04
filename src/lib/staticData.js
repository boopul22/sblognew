/**
 * Supabase data loader
 * Provides access to real-time data from Supabase database
 */

import { supabasePublic } from './supabase.js'

// Data cache for performance
let dataCache = {
  posts: null,
  authors: null,
  categories: null,
  tags: null,
  lastFetch: {
    posts: null,
    authors: null,
    categories: null,
    tags: null
  }
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

/**
 * Check if cached data is still valid
 */
function isCacheValid(type) {
  const lastFetch = dataCache.lastFetch[type]
  return lastFetch && (Date.now() - lastFetch) < CACHE_DURATION
}

/**
 * Get all posts from Supabase
 */
export async function getAllPosts() {
  // Return cached data if still valid
  if (dataCache.posts && isCacheValid('posts')) {
    return dataCache.posts
  }

  console.log('Fetching posts from Supabase...')
  const { data, error } = await supabasePublic
    .from('posts')
    .select(`
      id,
      wp_id,
      title,
      slug,
      content,
      excerpt,
      author_id,
      published_at,
      status,
      reading_time,
      featured_image_url,
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
    console.error('Failed to fetch posts:', error)
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  // Cache the data
  dataCache.posts = data || []
  dataCache.lastFetch.posts = Date.now()

  return dataCache.posts
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
 * Get all authors from Supabase
 */
export async function getAllAuthors() {
  // Return cached data if still valid
  if (dataCache.authors && isCacheValid('authors')) {
    return dataCache.authors
  }

  console.log('Fetching authors from Supabase...')
  const { data, error } = await supabasePublic
    .from('users')
    .select('id, wp_id, username, display_name, full_name, email, role, registered_at')
    .order('display_name')

  if (error) {
    console.error('Failed to fetch authors:', error)
    throw new Error(`Failed to fetch authors: ${error.message}`)
  }

  // Cache the data
  dataCache.authors = data || []
  dataCache.lastFetch.authors = Date.now()

  return dataCache.authors
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
 * Get all categories from Supabase
 */
export async function getAllCategories() {
  // Return cached data if still valid
  if (dataCache.categories && isCacheValid('categories')) {
    return dataCache.categories
  }

  console.log('Fetching categories from Supabase...')
  const { data, error } = await supabasePublic
    .from('categories')
    .select('id, wp_id, name, slug, description')
    .order('name')

  if (error) {
    console.error('Failed to fetch categories:', error)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  // Cache the data
  dataCache.categories = data || []
  dataCache.lastFetch.categories = Date.now()

  return dataCache.categories
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
 * Get all tags from Supabase
 */
export async function getAllTags() {
  // Return cached data if still valid
  if (dataCache.tags && isCacheValid('tags')) {
    return dataCache.tags
  }

  console.log('Fetching tags from Supabase...')
  const { data, error } = await supabasePublic
    .from('tags')
    .select('id, wp_id, name, slug, description')
    .order('name')

  if (error) {
    console.error('Failed to fetch tags:', error)
    throw new Error(`Failed to fetch tags: ${error.message}`)
  }

  // Cache the data
  dataCache.tags = data || []
  dataCache.lastFetch.tags = Date.now()

  return dataCache.tags
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
 * Clear data cache (useful for development)
 */
export function clearDataCache() {
  dataCache = {
    posts: null,
    authors: null,
    categories: null,
    tags: null,
    lastFetch: {
      posts: null,
      authors: null,
      categories: null,
      tags: null
    }
  }
}
