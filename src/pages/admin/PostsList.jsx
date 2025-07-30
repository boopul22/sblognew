import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getPosts, deletePost } from '../../lib/postOperations'
import BulkActions from '../../components/admin/BulkActions'
import toast from 'react-hot-toast'

const PostsList = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPosts, setSelectedPosts] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [searchQuery, statusFilter])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const result = await getPosts({
        search: searchQuery,
        status: statusFilter === 'all' ? null : statusFilter,
        limit: 50 // Show more posts in admin
      })
      setPosts(result.posts || [])
      setSelectedPosts([])
      setSelectAll(false)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId, postTitle) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return
    }

    try {
      await deletePost(postId)
      toast.success('Post deleted successfully')
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const handleStatusChange = async (postId, newStatus) => {
    try {
      const updateData = { status: newStatus }
      if (newStatus === 'published' && !posts.find(p => p.id === postId)?.published_at) {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)

      if (error) {
        throw error
      }

      toast.success(`Post ${newStatus} successfully`)
      fetchPosts()
    } catch (error) {
      console.error('Error updating post status:', error)
      toast.error('Failed to update post status')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { class: 'status-published', text: 'Published' },
      draft: { class: 'status-draft', text: 'Draft' },
      private: { class: 'status-private', text: 'Private' }
    }

    const config = statusConfig[status] || { class: 'status-unknown', text: status }
    return <span className={`status-badge ${config.class}`}>{config.text}</span>
  }

  const handleSelectPost = (postId) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(posts.map(post => post.id))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkActionComplete = () => {
    fetchPosts()
  }

  const handleClearSelection = () => {
    setSelectedPosts([])
    setSelectAll(false)
  }

  return (
    <div className="posts-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1>All Posts</h1>
          <Link to="/admin/create" className="btn btn-primary">
            Create New Post
          </Link>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="private">Private</option>
        </select>
      </div>

      <BulkActions
        selectedPosts={selectedPosts}
        onActionComplete={handleBulkActionComplete}
        onClearSelection={handleClearSelection}
      />

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p>
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first post.'
            }
          </p>
          <Link to="/admin/create" className="btn btn-primary">
            Create New Post
          </Link>
        </div>
      ) : (
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="select-checkbox"
                  />
                </th>
                <th>Title</th>
                <th>Status</th>
                <th>Published</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="select-checkbox"
                    />
                  </td>
                  <td>
                    <div className="post-title">
                      <Link to={`/admin/edit/${post.id}`} className="title-link">
                        {post.title}
                      </Link>
                      <div className="post-slug">/{post.slug}</div>
                    </div>
                  </td>
                  <td>{getStatusBadge(post.status)}</td>
                  <td>
                    {post.published_at ? formatDate(post.published_at) : '—'}
                  </td>
                  <td>{formatDate(post.updated_at)}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/edit/${post.id}`} className="btn btn-sm btn-secondary">
                        Edit
                      </Link>
                      <Link to={`/${post.slug}`} className="btn btn-sm btn-outline" target="_blank">
                        View
                      </Link>
                      {post.status === 'draft' ? (
                        <button
                          onClick={() => handleStatusChange(post.id, 'published')}
                          className="btn btn-sm btn-success"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(post.id, 'draft')}
                          className="btn btn-sm btn-warning"
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .posts-list-page {
          max-width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content h1 {
          margin: 0;
          color: #212529;
          font-size: 2rem;
          font-weight: 600;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-input, .status-filter {
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
        }

        .status-filter {
          min-width: 120px;
        }

        .loading-state, .empty-state {
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

        .posts-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .posts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .posts-table th,
        .posts-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .posts-table th:first-child,
        .posts-table td:first-child {
          width: 40px;
          padding: 1rem 0.5rem;
          text-align: center;
        }

        .select-checkbox {
          cursor: pointer;
          transform: scale(1.2);
        }

        .posts-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .post-title {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .title-link {
          color: #212529;
          text-decoration: none;
          font-weight: 500;
        }

        .title-link:hover {
          color: #1976d2;
        }

        .post-slug {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-published {
          background: #d4edda;
          color: #155724;
        }

        .status-draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-private {
          background: #f8d7da;
          color: #721c24;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.375rem 0.75rem;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          text-align: center;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
          border-color: #1976d2;
        }

        .btn-primary:hover {
          background: #1565c0;
          border-color: #1565c0;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover {
          background: #5a6268;
          border-color: #5a6268;
        }

        .btn-outline {
          background: transparent;
          color: #6c757d;
          border-color: #6c757d;
        }

        .btn-outline:hover {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .btn-success:hover {
          background: #218838;
          border-color: #218838;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
          border-color: #ffc107;
        }

        .btn-warning:hover {
          background: #e0a800;
          border-color: #e0a800;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .btn-danger:hover {
          background: #c82333;
          border-color: #c82333;
        }

        @media (max-width: 768px) {
          .posts-table-container {
            overflow-x: auto;
          }

          .posts-table {
            min-width: 600px;
          }

          .actions {
            flex-direction: column;
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  )
}

export default PostsList
