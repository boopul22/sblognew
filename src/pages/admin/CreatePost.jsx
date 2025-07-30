import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PostEditor from '../../components/admin/PostEditor'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (postData, isDraft = false) => {
    setLoading(true)
    try {
      // This will be implemented in the PostEditor component
      const action = isDraft ? 'saved as draft' : 'published'
      toast.success(`Post ${action} successfully!`)
      
      if (!isDraft) {
        navigate('/admin/posts')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/posts')
  }

  return (
    <div className="create-post-page">
      <div className="page-header">
        <h1>Create New Post</h1>
        <p>Write and publish a new blog post</p>
      </div>

      <PostEditor
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
        isEditing={false}
      />

      <style jsx>{`
        .create-post-page {
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
      `}</style>
    </div>
  )
}

export default CreatePost
