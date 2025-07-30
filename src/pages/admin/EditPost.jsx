import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostEditor from '../../components/admin/PostEditor'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error('Post not found')
      }

      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      setError(error.message)
      toast.error('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (postData, isDraft = false) => {
    setSaving(true)
    try {
      // This will be implemented in the PostEditor component
      const action = isDraft ? 'saved as draft' : 'updated'
      toast.success(`Post ${action} successfully!`)
      
      if (!isDraft) {
        navigate('/admin/posts')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/posts')
  }

  if (loading) {
    return (
      <div className="edit-post-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="edit-post-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || 'Post not found'}</p>
          <button onClick={() => navigate('/admin/posts')} className="btn btn-primary">
            Back to Posts
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-post-page">
      <div className="page-header">
        <h1>Edit Post</h1>
        <p>Make changes to "{post.title}"</p>
      </div>

      <PostEditor
        initialData={post}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={saving}
        isEditing={true}
      />

      <style jsx>{`
        .edit-post-page {
          max-width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .page-header h1 {
          margin: 0 0 0.5rem 0;
          color: #212529;
          font-size: 2rem;
          font-weight: 600;
        }

        .page-header p {
          margin: 0;
          color: #6c757d;
          font-size: 1rem;
        }

        .loading-state, .error-state {
          text-align: center;
          padding: 3rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1976d2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state h2 {
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
        }

        .btn-primary:hover {
          background: #1565c0;
        }
      `}</style>
    </div>
  )
}

export default EditPost
