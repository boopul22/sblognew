/**
 * Debug component to help troubleshoot image loading issues
 * Shows original URLs, converted URLs, and loading status
 */

import { useState, useEffect } from 'react'
import { normalizeImageUrl, getThumbnailImage } from '../../../utils/contentUtils'

const ImageDebugger = ({ post, showDebug = false }) => {
  const [debugInfo, setDebugInfo] = useState(null)
  
  useEffect(() => {
    if (!showDebug || !post) return
    
    const originalUrl = post.featured_image_url
    const normalizedUrl = normalizeImageUrl(originalUrl)
    const thumbnailUrl = getThumbnailImage(post.content, post.featured_image_url)

    setDebugInfo({
      originalUrl,
      normalizedUrl,
      thumbnailUrl,
      isSupabaseUrl: originalUrl?.includes('supabase.co'),
      isExternalUrl: originalUrl && !originalUrl.includes('supabase.co'),
      hasImage: !!originalUrl
    })
  }, [post, showDebug])
  
  if (!showDebug || !debugInfo) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '400px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>🐛 Image Debug Info</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Post:</strong> {post.title}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Storage:</strong>
        <span style={{ color: '#4CAF50' }}>
          ✅ Supabase Storage
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Image URL:</strong>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '4px',
          borderRadius: '4px',
          wordBreak: 'break-all',
          fontSize: '10px'
        }}>
          {debugInfo.originalUrl || 'None'}
        </div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Status:</strong>
        {!debugInfo.hasImage && (
          <span style={{ color: '#9e9e9e' }}> ℹ️ No featured image</span>
        )}
        {debugInfo.isSupabaseUrl && (
          <span style={{ color: '#4CAF50' }}> ✅ Supabase Storage URL</span>
        )}
        {debugInfo.isExternalUrl && (
          <span style={{ color: '#2196F3' }}> ℹ️ External URL</span>
        )}
      </div>
      
      {debugInfo.thumbnailUrl && (
        <div style={{ marginTop: '10px' }}>
          <strong>Image Test:</strong>
          <img 
            src={debugInfo.thumbnailUrl} 
            alt="Debug test"
            style={{ 
              width: '100px', 
              height: '60px', 
              objectFit: 'cover',
              border: '1px solid #ccc',
              borderRadius: '4px',
              display: 'block',
              marginTop: '5px'
            }}
            onLoad={() => console.log('✅ Image loaded successfully:', debugInfo.thumbnailUrl)}
            onError={() => console.error('❌ Image failed to load:', debugInfo.thumbnailUrl)}
          />
        </div>
      )}
    </div>
  )
}

export default ImageDebugger
