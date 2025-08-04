import { useState, useEffect, useCallback, useRef } from 'react'
import { createPost, updatePost, getPostById } from '../lib/postOperations'
import { generateUniqueSlug } from '../utils/slugUtils'
import toast from 'react-hot-toast'

/**
 * Custom hook for managing post editor state and operations
 * @param {string} postId - ID of post being edited (null for new post)
 * @returns {object} - Post editor state and methods
 */
export const usePostEditor = (postId = null) => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(!!postId)
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [error, setError] = useState(null)

  const autoSaveTimeoutRef = useRef(null)
  const isEditingRef = useRef(!!postId)

  // Load post data if editing
  useEffect(() => {
    if (postId) {
      loadPost(postId)
    }
  }, [postId])

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && post && (post.title || post.content)) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave()
      }, 30000) // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [isDirty, post])

  /**
   * Load post data from database
   */
  const loadPost = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const postData = await getPostById(id)
      setPost(postData)
      isEditingRef.current = true
    } catch (err) {
      console.error('Error loading post:', err)
      setError(err.message)
      toast.error('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update post data in state
   */
  const updatePostData = useCallback((updates) => {
    setPost(prev => ({
      ...prev,
      ...updates
    }))
    setIsDirty(true)
  }, [])

  /**
   * Auto-save post as draft
   */
  const handleAutoSave = async () => {
    if (!post || !isDirty || autoSaving || saving) return

    setAutoSaving(true)
    try {
      const postData = {
        ...post,
        status: 'draft'
      }

      let savedPost
      if (isEditingRef.current && post.id) {
        savedPost = await updatePost(post.id, postData)
      } else {
        // First save - create new post
        savedPost = await createPost(postData)
        isEditingRef.current = true
        
        // Update URL to edit mode
        if (typeof window !== 'undefined' && savedPost.id) {
          window.history.replaceState(null, '', `/admin/edit/${savedPost.id}`)
        }
      }

      setPost(savedPost)
      setLastSaved(new Date())
      setIsDirty(false)
    } catch (err) {
      console.error('Auto-save failed:', err)
      // Don't show error toast for auto-save failures to avoid annoying user
    } finally {
      setAutoSaving(false)
    }
  }

  /**
   * Save post with specific status
   */
  const savePost = async (status = 'draft', showToast = true) => {
    if (!post) return null

    setSaving(true)
    try {
      const postData = {
        ...post,
        status
      }

      // Set published_at if publishing
      if (status === 'published' && !post.published_at) {
        postData.published_at = new Date().toISOString()
      }

      let savedPost
      if (isEditingRef.current && post.id) {
        savedPost = await updatePost(post.id, postData)
      } else {
        savedPost = await createPost(postData)
        isEditingRef.current = true
        
        // Update URL to edit mode
        if (typeof window !== 'undefined' && savedPost.id) {
          window.history.replaceState(null, '', `/admin/edit/${savedPost.id}`)
        }
      }

      setPost(savedPost)
      setLastSaved(new Date())
      setIsDirty(false)

      if (showToast) {
        const action = status === 'published' ? 'published' : 'saved'
        toast.success(`Post ${action} successfully!`)
      }

      return savedPost
    } catch (err) {
      console.error('Error saving post:', err)
      if (showToast) {
        toast.error('Failed to save post. Please try again.')
      }
      throw err
    } finally {
      setSaving(false)
    }
  }

  /**
   * Save as draft
   */
  const saveDraft = () => savePost('draft')

  /**
   * Publish post
   */
  const publishPost = () => savePost('published')

  /**
   * Unpublish post (change to draft)
   */
  const unpublishPost = () => savePost('draft')

  /**
   * Update post title and auto-generate slug if needed
   */
  const updateTitle = useCallback(async (title) => {
    updatePostData({ title })

    // Auto-generate slug for new posts
    if (!isEditingRef.current && title) {
      try {
        const slug = await generateUniqueSlug(title)
        updatePostData({ title, slug })
      } catch (err) {
        console.error('Error generating slug:', err)
        updatePostData({ title })
      }
    }
  }, [updatePostData])

  /**
   * Update post content
   */
  const updateContent = useCallback((content) => {
    updatePostData({ content })
  }, [updatePostData])

  /**
   * Update post excerpt
   */
  const updateExcerpt = useCallback((excerpt) => {
    updatePostData({ excerpt })
  }, [updatePostData])

  /**
   * Update post slug
   */
  const updateSlug = useCallback((slug) => {
    updatePostData({ slug })
  }, [updatePostData])

  /**
   * Update featured image
   */
  const updateFeaturedImage = useCallback((featured_image_url) => {
    updatePostData({ featured_image_url })
  }, [updatePostData])

  /**
   * Update SEO metadata
   */
  const updateSEO = useCallback((seoData) => {
    updatePostData(seoData)
  }, [updatePostData])

  /**
   * Reset post data
   */
  const resetPost = useCallback(() => {
    setPost(null)
    setIsDirty(false)
    setError(null)
    setLastSaved(null)
    isEditingRef.current = false
  }, [])

  /**
   * Check if post has unsaved changes
   */
  const hasUnsavedChanges = isDirty && !autoSaving && !saving

  /**
   * Get post status info
   */
  const getStatusInfo = () => {
    if (!post) return { status: 'new', label: 'New Post', color: '#6c757d' }

    const statusConfig = {
      draft: { label: 'Draft', color: '#ffc107' },
      published: { label: 'Published', color: '#28a745' },
      private: { label: 'Private', color: '#dc3545' }
    }

    return {
      status: post.status,
      ...statusConfig[post.status] || { label: post.status, color: '#6c757d' }
    }
  }

  return {
    // State
    post,
    loading,
    saving,
    autoSaving,
    lastSaved,
    isDirty,
    error,
    hasUnsavedChanges,
    isEditing: isEditingRef.current,

    // Methods
    loadPost,
    updatePostData,
    savePost,
    saveDraft,
    publishPost,
    unpublishPost,
    updateTitle,
    updateContent,
    updateExcerpt,
    updateSlug,
    updateFeaturedImage,
    updateSEO,
    resetPost,
    getStatusInfo,

    // Auto-save
    handleAutoSave
  }
}
