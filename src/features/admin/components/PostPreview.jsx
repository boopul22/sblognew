import { useMemo } from 'react'

const PostPreview = ({ data }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  // Clean HTML content for preview
  const cleanContent = useMemo(() => {
    if (!data.content) return ''
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = data.content
    
    return tempDiv.innerHTML
  }, [data.content])

  // Generate excerpt if not provided
  const displayExcerpt = useMemo(() => {
    if (data.excerpt) return data.excerpt
    
    if (data.content) {
      // Strip HTML and get first 150 characters
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = data.content
      const textContent = tempDiv.textContent || tempDiv.innerText || ''
      return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '')
    }
    
    return 'No excerpt available'
  }, [data.content, data.excerpt])

  return (
    <div className="post-preview">
      <div className="preview-header">
        <h1>Preview Mode</h1>
        <div className="preview-status">
          <span className={`status-badge status-${data.status || 'draft'}`}>
            {data.status || 'draft'}
          </span>
        </div>
      </div>

      <article className="preview-article">
        {/* Featured Image */}
        {data.featured_image_url && (
          <div className="featured-image">
            <img 
              src={data.featured_image_url} 
              alt={data.title || 'Featured image'} 
            />
          </div>
        )}

        {/* Post Header */}
        <header className="post-header">
          <h1 className="post-title">
            {data.title || 'Untitled Post'}
          </h1>
          
          <div className="post-meta">
            <time className="post-date">
              {formatDate(data.published_at || data.created_at)}
            </time>
            {data.slug && (
              <div className="post-url">
                <strong>URL:</strong> /{data.slug}
              </div>
            )}
          </div>

          {displayExcerpt && (
            <div className="post-excerpt">
              {displayExcerpt}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div className="post-content">
          {cleanContent ? (
            <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
          ) : (
            <p className="no-content">No content available</p>
          )}
        </div>

        {/* SEO Preview */}
        {(data.meta_title || data.meta_description) && (
          <div className="seo-preview">
            <h3>SEO Preview</h3>
            <div className="search-result-preview">
              <div className="search-title">
                {data.meta_title || data.title || 'Untitled Post'}
              </div>
              <div className="search-url">
                {window.location.origin}/{data.slug || 'untitled-post'}
              </div>
              <div className="search-description">
                {data.meta_description || displayExcerpt}
              </div>
            </div>
          </div>
        )}
      </article>

      <style jsx="true">{`
        .post-preview {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          background: white;
          min-height: 100vh;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .preview-header h1 {
          margin: 0;
          color: #6c757d;
          font-size: 1.25rem;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-published {
          background: #d4edda;
          color: #155724;
        }

        .status-private {
          background: #f8d7da;
          color: #721c24;
        }

        .preview-article {
          line-height: 1.6;
        }

        .featured-image {
          margin-bottom: 2rem;
          border-radius: 8px;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .post-header {
          margin-bottom: 2rem;
        }

        .post-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          color: #212529;
        }

        .post-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .post-date {
          font-weight: 500;
        }

        .post-url {
          font-family: monospace;
          background: #f8f9fa;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .post-excerpt {
          font-size: 1.125rem;
          color: #6c757d;
          font-style: italic;
          margin-top: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-left: 4px solid #1976d2;
          border-radius: 4px;
        }

        .post-content {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #212529;
        }

        .post-content h1,
        .post-content h2,
        .post-content h3,
        .post-content h4,
        .post-content h5,
        .post-content h6 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .post-content h1 { font-size: 2rem; }
        .post-content h2 { font-size: 1.75rem; }
        .post-content h3 { font-size: 1.5rem; }
        .post-content h4 { font-size: 1.25rem; }
        .post-content h5 { font-size: 1.125rem; }
        .post-content h6 { font-size: 1rem; }

        .post-content p {
          margin-bottom: 1.5rem;
        }

        .post-content blockquote {
          margin: 2rem 0;
          padding: 1rem 2rem;
          border-left: 4px solid #1976d2;
          background: #f8f9fa;
          font-style: italic;
          border-radius: 4px;
        }

        .post-content ul,
        .post-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .post-content li {
          margin-bottom: 0.5rem;
        }

        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .post-content code {
          background: #f8f9fa;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .post-content pre {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .post-content pre code {
          background: none;
          padding: 0;
        }

        .no-content {
          color: #6c757d;
          font-style: italic;
          text-align: center;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .seo-preview {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #e9ecef;
        }

        .seo-preview h3 {
          margin: 0 0 1rem 0;
          color: #495057;
          font-size: 1.125rem;
        }

        .search-result-preview {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .search-title {
          color: #1a0dab;
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          text-decoration: underline;
        }

        .search-url {
          color: #006621;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .search-description {
          color: #545454;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        /* Hindi text support */
        .post-content,
        .post-title,
        .post-excerpt {
          font-family: "Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .post-preview {
            padding: 1rem;
          }

          .preview-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .post-title {
            font-size: 2rem;
          }

          .post-meta {
            font-size: 0.8rem;
          }

          .post-content {
            font-size: 1rem;
          }

          .post-content h1 { font-size: 1.75rem; }
          .post-content h2 { font-size: 1.5rem; }
          .post-content h3 { font-size: 1.25rem; }
        }

        /* Print styles */
        @media print {
          .preview-header {
            display: none;
          }

          .seo-preview {
            display: none;
          }

          .post-preview {
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default PostPreview
