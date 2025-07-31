import { Outlet, Link, useLocation } from 'react-router-dom'
import { memo } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const AdminLayout = memo(() => {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div className="admin-nav">
          <Link to="/" className="admin-logo">
            ← Back to Blog
          </Link>
          <h1>Admin Panel</h1>
          <div className="admin-user">
            <span>Welcome, {user?.email}</span>
            <button onClick={handleSignOut} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <nav className="admin-sidebar">
          <ul className="admin-menu">
            <li>
              <Link 
                to="/admin/posts" 
                className={isActive('/admin/posts') ? 'active' : ''}
              >
                📝 All Posts
              </Link>
            </li>
            <li>
              <Link
                to="/admin/create"
                className={isActive('/admin/create') ? 'active' : ''}
              >
                ➕ Create New Post
              </Link>
            </li>
            <li>
              <Link
                to="/admin/storage-settings"
                className={isActive('/admin/storage-settings') ? 'active' : ''}
              >
                🗄️ Storage Settings
              </Link>
            </li>
          </ul>
        </nav>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style jsx="true">{`
        .admin-layout {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e9ecef;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .admin-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .admin-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .logout-btn:hover {
          background: #c82333;
        }

        .admin-logo {
          color: #6c757d;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .admin-logo:hover {
          color: #495057;
        }

        .admin-nav h1 {
          margin: 0;
          color: #212529;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .admin-container {
          display: flex;
          min-height: calc(100vh - 80px);
        }

        .admin-sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #e9ecef;
          padding: 2rem 0;
        }

        .admin-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .admin-menu li {
          margin: 0;
        }

        .admin-menu a {
          display: block;
          padding: 0.75rem 2rem;
          color: #6c757d;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .admin-menu a:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .admin-menu a.active {
          background: #e3f2fd;
          color: #1976d2;
          border-left-color: #1976d2;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .admin-container {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
            padding: 1rem 0;
          }

          .admin-menu {
            display: flex;
            overflow-x: auto;
          }

          .admin-menu li {
            flex-shrink: 0;
          }

          .admin-menu a {
            padding: 0.5rem 1rem;
            border-left: none;
            border-bottom: 3px solid transparent;
          }

          .admin-menu a.active {
            border-left: none;
            border-bottom-color: #1976d2;
          }

          .admin-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
})

AdminLayout.displayName = 'AdminLayout'

export default AdminLayout
