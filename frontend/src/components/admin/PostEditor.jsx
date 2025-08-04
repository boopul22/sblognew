import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import RichTextEditor from './RichTextEditor'
import ImageUploader from './ImageUploader'
import PostPreview from './PostPreview'
import { generateSlug, validateSlugUniqueness } from '../../utils/slugUtils'
import { createPost, updatePost } from '../../lib/postOperations'
import toast from 'react-hot-toast'

const PostEditor = ({ 
  initialData = null, 
  onSave, 
  onCancel, 
  loading = false, 
  isEditing = false 
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [slugChecking, setSlugChecking] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
    reset
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      featured_image_url: initialData?.featured_image_url || '',
      meta_title: initialData?.meta_title || '',
      meta_description: initialData?.meta_description || '',
      status: initialData?.status || 'draft'
    }
  })

  const watchedTitle = watch('title')
  const watchedSlug = watch('slug')
  const watchedContent = watch('content')

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !isEditing) {
      const newSlug = generateSlug(watchedTitle)
      setValue('slug', newSlug)
    }
  }, [watchedTitle, setValue, isEditing])

  // Validate slug uniqueness
  useEffect(() => {
    const validateSlug = async () => {
      if (watchedSlug && watchedSlug !== initialData?.slug) {
        setSlugChecking(true)
        try {
          const isUnique = await validateSlugUniqueness(watchedSlug, initialData?.id)
          if (!isUnique) {
            toast.error('This slug is already taken. Please choose a different one.')
          }
        } catch (error) {
          console.error('Error validating slug:', error)
        } finally {
          setSlugChecking(false)
        }
      }
    }

    const timeoutId = setTimeout(validateSlug, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedSlug, initialData?.slug, initialData?.id])

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && (watchedTitle || watchedContent)) {
      const autoSaveTimeout = setTimeout(async () => {
        await handleAutoSave()
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimeout)
    }
  }, [isDirty, watchedTitle, watchedContent])

  const handleAutoSave = async () => {
    if (!isDirty) return

    setAutoSaving(true)
    try {
      const formData = watch()
      if (isEditing && initialData?.id) {
        await updatePost(initialData.id, { ...formData, status: 'draft' })
      } else if (formData.title || formData.content) {
        // Only auto-save if there's meaningful content
        const savedPost = await createPost({ ...formData, status: 'draft' })
        if (savedPost && !initialData) {
          // Update the URL to edit mode after first save
          window.history.replaceState(null, '', `/admin/edit/${savedPost.id}`)
        }
      }
      setLastSaved(new Date())
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setAutoSaving(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      let savedPost
      if (isEditing) {
        savedPost = await updatePost(initialData.id, data)
      } else {
        savedPost = await createPost(data)
      }
      onSave(data, data.status === 'draft')
      return savedPost
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post. Please try again.')
      throw error
    }
  }

  const handleSaveDraft = () => {
    setValue('status', 'draft')
    handleSubmit(onSubmit)()
  }

  const handlePublish = () => {
    setValue('status', 'published')
    setValue('published_at', new Date().toISOString())
    handleSubmit(onSubmit)()
  }

  const handleContentChange = useCallback((content) => {
    setValue('content', content, { shouldDirty: true })
  }, [setValue])

  const handleImageUpload = useCallback((imageUrl) => {
    setValue('featured_image_url', imageUrl, { shouldDirty: true })
  }, [setValue])

  return (
    <div className="post-editor">
      <div className="editor-header">
        <div className="editor-actions">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn btn-outline"
          >
            {showPreview ? '📝 Edit' : '👁️ Preview'}
          </button>
          
          <div className="save-status">
            {autoSaving && <span className="auto-saving">Auto-saving...</span>}
            {lastSaved && !autoSaving && (
              <span className="last-saved">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="primary-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn btn-outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="btn btn-primary"
            disabled={loading || !watchedTitle}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="editor-content">
        {showPreview ? (
          <PostPreview data={watch()} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="post-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' }
                  })}
                  className={`form-control ${errors.title ? 'error' : ''}`}
                  placeholder="Enter post title..."
                />
                {errors.title && <span className="error-message">{errors.title.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="slug">
                  URL Slug * 
                  {slugChecking && <span className="checking">Checking...</span>}
                </label>
                <div className="slug-input">
                  <span className="slug-prefix">/{window.location.host}/</span>
                  <input
                    id="slug"
                    type="text"
                    {...register('slug', { 
                      required: 'Slug is required',
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message: 'Slug can only contain lowercase letters, numbers, and hyphens'
                      }
                    })}
                    className={`form-control ${errors.slug ? 'error' : ''}`}
                    placeholder="post-url-slug"
                  />
                </div>
                {errors.slug && <span className="error-message">{errors.slug.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="excerpt">Excerpt</label>
                <textarea
                  id="excerpt"
                  {...register('excerpt')}
                  className="form-control"
                  rows="3"
                  placeholder="Brief description of the post..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Featured Image</label>
                <ImageUploader
                  currentImage={watch('featured_image_url')}
                  onImageUpload={handleImageUpload}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <RichTextEditor
                  value={watchedContent}
                  onChange={handleContentChange}
                  placeholder="Write your post content here..."
                />
              </div>
            </div>

            <details className="seo-section">
              <summary>SEO Settings</summary>
              <div className="seo-fields">
                <div className="form-group">
                  <label htmlFor="meta_title">Meta Title</label>
                  <input
                    id="meta_title"
                    type="text"
                    {...register('meta_title')}
                    className="form-control"
                    placeholder="SEO title (leave empty to use post title)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="meta_description">Meta Description</label>
                  <textarea
                    id="meta_description"
                    {...register('meta_description')}
                    className="form-control"
                    rows="2"
                    placeholder="SEO description (leave empty to use excerpt)"
                  />
                </div>
              </div>
            </details>
          </form>
        )}
      </div>



      <style jsx="true">{`
        .post-editor {
          max-width: 100%;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px 8px 0 0;
          margin-bottom: 0;
        }

        .editor-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .save-status {
          font-size: 0.875rem;
          color: #6c757d;
        }

        .auto-saving {
          color: #ffc107;
        }

        .last-saved {
          color: #28a745;
        }

        .primary-actions {
          display: flex;
          gap: 0.5rem;
        }

        .editor-content {
          background: white;
          border: 1px solid #e9ecef;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 600px;
        }

        .post-form {
          padding: 2rem;
        }

        .form-row {
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #212529;
        }

        .checking {
          color: #ffc107;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        .form-control {
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
        }

        .form-control.error {
          border-color: #dc3545;
        }

        .slug-input {
          display: flex;
          align-items: center;
          border: 1px solid #ced4da;
          border-radius: 4px;
          overflow: hidden;
        }

        .slug-prefix {
          background: #f8f9fa;
          padding: 0.75rem;
          color: #6c757d;
          font-size: 0.875rem;
          border-right: 1px solid #ced4da;
        }

        .slug-input input {
          border: none;
          flex: 1;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .seo-section {
          margin-top: 2rem;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }

        .seo-section summary {
          padding: 1rem;
          cursor: pointer;
          background: #f8f9fa;
          font-weight: 500;
        }

        .seo-fields {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
          border-color: #1976d2;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1565c0;
          border-color: #1565c0;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
          border-color: #5a6268;
        }

        .btn-outline {
          background: transparent;
          color: #6c757d;
          border-color: #6c757d;
        }

        .btn-outline:hover:not(:disabled) {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .editor-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .primary-actions {
            justify-content: center;
          }

          .post-form {
            padding: 1rem;
          }

          .slug-input {
            flex-direction: column;
          }

          .slug-prefix {
            border-right: none;
            border-bottom: 1px solid #ced4da;
          }
        }
      `}</style>
    </div>
  )
}

export default PostEditor
