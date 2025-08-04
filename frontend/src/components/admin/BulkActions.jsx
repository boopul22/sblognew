import { useState } from 'react'
import { bulkUpdatePostStatus, deletePost } from '../../lib/postOperations'
import toast from 'react-hot-toast'

const BulkActions = ({ selectedPosts, onActionComplete, onClearSelection }) => {
  const [loading, setLoading] = useState(false)

  const handleBulkAction = async (action) => {
    if (selectedPosts.length === 0) {
      toast.error('Please select posts to perform bulk action')
      return
    }

    const confirmMessage = getBulkActionConfirmMessage(action, selectedPosts.length)
    if (!confirm(confirmMessage)) {
      return
    }

    setLoading(true)
    try {
      let result
      switch (action) {
        case 'publish':
          result = await bulkUpdatePostStatus(selectedPosts, 'published')
          toast.success(`${result} posts published successfully`)
          break
        case 'draft':
          result = await bulkUpdatePostStatus(selectedPosts, 'draft')
          toast.success(`${result} posts moved to draft`)
          break
        case 'private':
          result = await bulkUpdatePostStatus(selectedPosts, 'private')
          toast.success(`${result} posts made private`)
          break
        case 'delete':
          result = await bulkDeletePosts(selectedPosts)
          toast.success(`${result} posts deleted successfully`)
          break
        default:
          throw new Error('Invalid bulk action')
      }

      onActionComplete()
      onClearSelection()
    } catch (error) {
      console.error('Bulk action failed:', error)
      toast.error(`Failed to ${action} posts. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const bulkDeletePosts = async (postIds) => {
    let deletedCount = 0
    for (const postId of postIds) {
      try {
        await deletePost(postId)
        deletedCount++
      } catch (error) {
        console.error(`Failed to delete post ${postId}:`, error)
      }
    }
    return deletedCount
  }

  const getBulkActionConfirmMessage = (action, count) => {
    const postText = count === 1 ? 'post' : 'posts'
    switch (action) {
      case 'publish':
        return `Are you sure you want to publish ${count} ${postText}?`
      case 'draft':
        return `Are you sure you want to move ${count} ${postText} to draft?`
      case 'private':
        return `Are you sure you want to make ${count} ${postText} private?`
      case 'delete':
        return `Are you sure you want to delete ${count} ${postText}? This action cannot be undone.`
      default:
        return `Are you sure you want to perform this action on ${count} ${postText}?`
    }
  }

  if (selectedPosts.length === 0) {
    return null
  }

  return (
    <div className="bulk-actions">
      <div className="bulk-info">
        <span className="selected-count">
          {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
        </span>
        <button
          type="button"
          onClick={onClearSelection}
          className="clear-selection"
          disabled={loading}
        >
          Clear Selection
        </button>
      </div>

      <div className="bulk-buttons">
        <button
          type="button"
          onClick={() => handleBulkAction('publish')}
          className="btn btn-sm btn-success"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Publish'}
        </button>
        <button
          type="button"
          onClick={() => handleBulkAction('draft')}
          className="btn btn-sm btn-warning"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Move to Draft'}
        </button>
        <button
          type="button"
          onClick={() => handleBulkAction('private')}
          className="btn btn-sm btn-secondary"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Make Private'}
        </button>
        <button
          type="button"
          onClick={() => handleBulkAction('delete')}
          className="btn btn-sm btn-danger"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Delete'}
        </button>
      </div>

      <style jsx="true">{`
        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .bulk-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .selected-count {
          font-weight: 500;
          color: #495057;
        }

        .clear-selection {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          text-decoration: underline;
          font-size: 0.875rem;
        }

        .clear-selection:hover:not(:disabled) {
          color: #495057;
        }

        .clear-selection:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bulk-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.375rem 0.75rem;
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

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .btn-success {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .btn-success:hover:not(:disabled) {
          background: #218838;
          border-color: #218838;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
          border-color: #ffc107;
        }

        .btn-warning:hover:not(:disabled) {
          background: #e0a800;
          border-color: #e0a800;
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

        .btn-danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
          border-color: #c82333;
        }

        @media (max-width: 768px) {
          .bulk-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .bulk-info {
            justify-content: space-between;
          }

          .bulk-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default BulkActions
