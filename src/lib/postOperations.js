import { supabase } from './supabase'
import { generateUniqueSlug, validateSlugFormat } from '../utils/slugUtils'

/**
 * Create a new post
 * @param {object} postData - Post data to create
 * @returns {Promise<object>} - Created post data
 */
export const createPost = async (postData) => {
  try {
    // Validate required fields
    if (!postData.title) {
      throw new Error('Title is required')
    }

    // Validate and generate unique slug
    const slugValidation = validateSlugFormat(postData.slug)
    if (!slugValidation.isValid) {
      throw new Error(slugValidation.message)
    }

    const uniqueSlug = await generateUniqueSlug(postData.slug)

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('You must be logged in to create posts')
    }

    // Prepare post data
    const postToCreate = {
      title: postData.title.trim(),
      slug: uniqueSlug,
      content: postData.content || '',
      excerpt: postData.excerpt || '',
      status: postData.status || 'draft',
      featured_image_url: postData.featured_image_url || null,
      meta_title: postData.meta_title || null,
      meta_description: postData.meta_description || null,
      author_id: user.id, // Use authenticated user's ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Set published_at if status is published
    if (postToCreate.status === 'published') {
      postToCreate.published_at = postData.published_at || new Date().toISOString()
    }

    // Insert post into database
    const { data, error } = await supabase
      .from('posts')
      .insert([postToCreate])
      .select()
      .single()

    if (error) {
      console.error('Database error creating post:', error)
      throw new Error(`Failed to create post: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

/**
 * Update an existing post
 * @param {string} postId - ID of the post to update
 * @param {object} postData - Updated post data
 * @returns {Promise<object>} - Updated post data
 */
export const updatePost = async (postId, postData) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required')
    }

    // Validate required fields
    if (!postData.title) {
      throw new Error('Title is required')
    }

    // Validate slug format if provided
    if (postData.slug) {
      const slugValidation = validateSlugFormat(postData.slug)
      if (!slugValidation.isValid) {
        throw new Error(slugValidation.message)
      }

      // Ensure slug is unique (excluding current post)
      const uniqueSlug = await generateUniqueSlug(postData.slug, postId)
      postData.slug = uniqueSlug
    }

    // Prepare update data
    const postToUpdate = {
      title: postData.title.trim(),
      content: postData.content || '',
      excerpt: postData.excerpt || '',
      status: postData.status || 'draft',
      featured_image_url: postData.featured_image_url || null,
      meta_title: postData.meta_title || null,
      meta_description: postData.meta_description || null,
      updated_at: new Date().toISOString()
    }

    // Include slug if provided
    if (postData.slug) {
      postToUpdate.slug = postData.slug
    }

    // Set published_at if status is being changed to published
    if (postToUpdate.status === 'published' && postData.published_at) {
      postToUpdate.published_at = postData.published_at
    } else if (postToUpdate.status === 'published') {
      // If publishing for the first time, set published_at to now
      const { data: currentPost } = await supabase
        .from('posts')
        .select('published_at')
        .eq('id', postId)
        .single()

      if (!currentPost?.published_at) {
        postToUpdate.published_at = new Date().toISOString()
      }
    }

    // Update post in database
    const { data, error } = await supabase
      .from('posts')
      .update(postToUpdate)
      .eq('id', postId)
      .select()
      .single()

    if (error) {
      console.error('Database error updating post:', error)
      throw new Error(`Failed to update post: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

/**
 * Delete a post
 * @param {string} postId - ID of the post to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deletePost = async (postId) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required')
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) {
      console.error('Database error deleting post:', error)
      throw new Error(`Failed to delete post: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

/**
 * Get a post by ID
 * @param {string} postId - ID of the post to retrieve
 * @returns {Promise<object>} - Post data
 */
export const getPostById = async (postId) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required')
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Post not found')
      }
      console.error('Database error fetching post:', error)
      throw new Error(`Failed to fetch post: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

/**
 * Get posts with pagination and filtering
 * @param {object} options - Query options
 * @returns {Promise<object>} - Posts data with pagination info
 */
export const getPosts = async (options = {}) => {
  try {
    const {
      page = 0,
      limit = 10,
      status = null,
      search = '',
      orderBy = 'updated_at',
      orderDirection = 'desc'
    } = options

    let query = supabase
      .from('posts')
      .select('id, title, slug, status, published_at, created_at, updated_at', { count: 'exact' })

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply search filter
    if (search && search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`)
    }

    // Apply ordering
    query = query.order(orderBy, { ascending: orderDirection === 'asc' })

    // Apply pagination
    const from = page * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error fetching posts:', error)
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    return {
      posts: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: data && data.length === limit
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

/**
 * Duplicate a post
 * @param {string} postId - ID of the post to duplicate
 * @returns {Promise<object>} - Duplicated post data
 */
export const duplicatePost = async (postId) => {
  try {
    // Get the original post
    const originalPost = await getPostById(postId)

    // Create a new post with duplicated data
    const duplicatedData = {
      title: `${originalPost.title} (Copy)`,
      slug: `${originalPost.slug}-copy`,
      content: originalPost.content,
      excerpt: originalPost.excerpt,
      featured_image_url: originalPost.featured_image_url,
      meta_title: originalPost.meta_title,
      meta_description: originalPost.meta_description,
      status: 'draft' // Always create duplicates as drafts
    }

    return await createPost(duplicatedData)
  } catch (error) {
    console.error('Error duplicating post:', error)
    throw error
  }
}

/**
 * Bulk update post status
 * @param {string[]} postIds - Array of post IDs to update
 * @param {string} status - New status for the posts
 * @returns {Promise<number>} - Number of posts updated
 */
export const bulkUpdatePostStatus = async (postIds, status) => {
  try {
    if (!postIds || postIds.length === 0) {
      throw new Error('Post IDs are required')
    }

    if (!['draft', 'published', 'private'].includes(status)) {
      throw new Error('Invalid status')
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString()
    }

    // Set published_at if publishing
    if (status === 'published') {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .in('id', postIds)
      .select('id')

    if (error) {
      console.error('Database error bulk updating posts:', error)
      throw new Error(`Failed to update posts: ${error.message}`)
    }

    return data ? data.length : 0
  } catch (error) {
    console.error('Error bulk updating posts:', error)
    throw error
  }
}
