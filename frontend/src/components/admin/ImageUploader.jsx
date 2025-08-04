import { useState, useRef, useCallback } from 'react'
import { uploadImage, deleteImage } from '../../lib/storage'
import { compressImage, generateThumbnail } from '../../utils/imageUtils'
import toast from 'react-hot-toast'

const ImageUploader = ({ currentImage, onImageUpload, maxSize = 5 * 1024 * 1024 }) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileSelect = useCallback(async (files) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    await handleImageUpload(file)
  }, [maxSize])

  const handleImageUpload = async (file) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      // Compress image if needed
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8
      })

      // Upload using storage abstraction layer
      const result = await uploadImage(compressedFile, {
        onProgress: (progress) => {
          setUploadProgress(Math.round(progress))
        }
      })

      if (!result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      onImageUpload(result.url)
      toast.success('Image uploaded successfully!')

    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files)
    handleFileSelect(files)
  }

  const handleRemoveImage = () => {
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-uploader">
      {currentImage ? (
        <div className="current-image">
          <div className="image-preview">
            <img src={currentImage} alt="Featured" />
            <div className="image-overlay">
              <button
                type="button"
                onClick={handleBrowseClick}
                className="btn btn-sm btn-primary"
                disabled={uploading}
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn btn-sm btn-danger"
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          </div>
          <div className="image-info">
            <p className="image-url">{currentImage}</p>
          </div>
        </div>
      ) : (
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <h3>Upload Featured Image</h3>
              <p>Drag and drop an image here, or click to browse</p>
              <p className="upload-hint">
                Supports JPG, PNG, WebP • Max {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      <style jsx="true">{`
        .image-uploader {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #ced4da;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f8f9fa;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover {
          border-color: #1976d2;
          background: #f0f8ff;
        }

        .upload-area.drag-over {
          border-color: #1976d2;
          background: #e3f2fd;
          transform: scale(1.02);
        }

        .upload-area.uploading {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-content h3 {
          margin: 0;
          color: #212529;
          font-size: 1.25rem;
        }

        .upload-content p {
          margin: 0;
          color: #6c757d;
        }

        .upload-hint {
          font-size: 0.875rem;
          color: #adb5bd;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 300px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #1976d2;
          transition: width 0.3s ease;
        }

        .current-image {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        .image-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-preview:hover .image-overlay {
          opacity: 1;
        }

        .image-info {
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .image-url {
          margin: 0;
          font-size: 0.75rem;
          color: #6c757d;
          word-break: break-all;
          font-family: monospace;
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

        .btn-primary {
          background: #1976d2;
          color: white;
          border-color: #1976d2;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1565c0;
          border-color: #1565c0;
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
          .upload-area {
            padding: 1.5rem;
            min-height: 150px;
          }

          .upload-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }

          .upload-content h3 {
            font-size: 1rem;
          }

          .upload-content p {
            font-size: 0.875rem;
          }

          .image-preview img {
            height: 150px;
          }

          .image-overlay {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default ImageUploader
