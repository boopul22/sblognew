import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchSinglePost } from '../../../lib/api/queries'
import '../styles/PostPage.css'

// Enhanced HTML Content Component with Interactive Elements
const EnhancedHTMLContent = ({ content, onCopy, onShare }) => {
  const [copiedQuote, setCopiedQuote] = useState(null)
  const [shareDropdown, setShareDropdown] = useState(null)
  const contentRef = useRef(null)

  // Social platforms for sharing
  const socialPlatforms = {
    whatsapp: {
      name: "WhatsApp",
      icon: "📱",
      getUrl: (text) => `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + window.location.href)}`
    },
    facebook: {
      name: "Facebook",
      icon: "📘",
      getUrl: (text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
    },
    twitter: {
      name: "Twitter",
      icon: "🐦",
      getUrl: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
    },
    instagram: {
      name: "Instagram",
      icon: "📷",
      getUrl: (text) => `https://www.instagram.com/` // Instagram doesn't support direct sharing URLs
    }
  }

  // Handle copy quote
  const handleCopyQuote = useCallback(async (quoteText, quoteId) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(quoteText)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = quoteText
        textArea.style.cssText = 'position: fixed; top: -9999px; left: -9999px; opacity: 0;'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setCopiedQuote(quoteId)
      setTimeout(() => setCopiedQuote(null), 2000)
      onCopy?.(quoteText)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }, [onCopy])

  // Handle share quote
  const handleShareQuote = useCallback((platform, quoteText) => {
    try {
      const platformData = socialPlatforms[platform]
      if (platformData) {
        const shareUrl = platformData.getUrl(quoteText)
        if (platform === 'instagram') {
          // For Instagram, just open the app/website since they don't support direct sharing
          window.open(shareUrl, '_blank')
          // Also copy the text to clipboard for Instagram
          navigator.clipboard?.writeText(quoteText).catch(() => {})
        } else {
          window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
        }
        onShare?.(platform, quoteText)
      }
      setShareDropdown(null)
    } catch (error) {
      console.error('Share error:', error)
    }
  }, [onShare])

  // Process HTML content to add interactive elements
  useEffect(() => {
    if (!contentRef.current || !content) return

    const container = contentRef.current
    container.innerHTML = content

    // Process blockquotes to add action buttons
    const blockquotes = container.querySelectorAll('blockquote')
    blockquotes.forEach((blockquote, index) => {
      const quoteId = `quote-${index}`
      const quoteText = blockquote.textContent.trim()

      if (quoteText) {
        // Create actions container
        const actionsContainer = document.createElement('div')
        actionsContainer.className = 'quote-actions'

        // Copy button
        const copyBtn = document.createElement('button')
        copyBtn.className = 'quote-action-btn quote-copy-btn'
        copyBtn.innerHTML = `<span class="btn-icon">📋</span><span class="btn-text">कॉपी</span>`
        copyBtn.setAttribute('aria-label', 'Quote copy करें')
        copyBtn.onclick = () => handleCopyQuote(quoteText, quoteId)

        // WhatsApp button
        const whatsappBtn = document.createElement('button')
        whatsappBtn.className = 'quote-action-btn quote-whatsapp-btn'
        whatsappBtn.innerHTML = `<span class="btn-icon">📱</span><span class="btn-text">WhatsApp</span>`
        whatsappBtn.setAttribute('aria-label', 'WhatsApp पर share करें')
        whatsappBtn.onclick = () => handleShareQuote('whatsapp', quoteText)

        // Facebook button
        const facebookBtn = document.createElement('button')
        facebookBtn.className = 'quote-action-btn quote-facebook-btn'
        facebookBtn.innerHTML = `<span class="btn-icon">📘</span><span class="btn-text">Facebook</span>`
        facebookBtn.setAttribute('aria-label', 'Facebook पर share करें')
        facebookBtn.onclick = () => handleShareQuote('facebook', quoteText)

        // Twitter button
        const twitterBtn = document.createElement('button')
        twitterBtn.className = 'quote-action-btn quote-twitter-btn'
        twitterBtn.innerHTML = `<span class="btn-icon">🐦</span><span class="btn-text">Twitter</span>`
        twitterBtn.setAttribute('aria-label', 'Twitter पर share करें')
        twitterBtn.onclick = () => handleShareQuote('twitter', quoteText)

        actionsContainer.appendChild(copyBtn)
        actionsContainer.appendChild(whatsappBtn)
        actionsContainer.appendChild(facebookBtn)
        actionsContainer.appendChild(twitterBtn)

        // Add copied indicator
        if (copiedQuote === quoteId) {
          const copiedIndicator = document.createElement('span')
          copiedIndicator.className = 'quote-copied-indicator'
          copiedIndicator.textContent = '✅ कॉपी हो गया!'
          actionsContainer.appendChild(copiedIndicator)
        }

        blockquote.appendChild(actionsContainer)
      }
    })

    // Process images to add click-to-expand functionality
    const images = container.querySelectorAll('img')
    images.forEach((img) => {
      img.style.cursor = 'pointer'
      img.onclick = () => {
        // Create modal for image expansion
        const modal = document.createElement('div')
        modal.className = 'image-modal'
        modal.innerHTML = `
          <div class="image-modal-backdrop"></div>
          <div class="image-modal-content">
            <img src="${img.src}" alt="${img.alt}" class="image-modal-img">
            <button class="image-modal-close">✕</button>
          </div>
        `

        // Close modal functionality
        const closeModal = () => document.body.removeChild(modal)
        modal.querySelector('.image-modal-close').onclick = closeModal
        modal.querySelector('.image-modal-backdrop').onclick = closeModal

        document.body.appendChild(modal)
      }
    })

  }, [content, copiedQuote, shareDropdown, handleCopyQuote, handleShareQuote])

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShareDropdown(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div
      ref={contentRef}
      className="enhanced-html-content"
      role="article"
      aria-label="Post content"
    />
  )
}

// Self-contained Adaptive Image Component for PostPage
const AdaptiveImage = ({ src, alt, className = '', style = {}, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [orientation, setOrientation] = useState('')
  const [aspectRatio, setAspectRatio] = useState(null)
  const imgRef = useRef(null)

  const handleImageLoad = useCallback((event) => {
    const img = event.target
    const imgAspectRatio = img.naturalWidth / img.naturalHeight
    setAspectRatio(imgAspectRatio)

    // Determine orientation based on aspect ratio
    let detectedOrientation = ''
    if (imgAspectRatio > 2.1) {
      detectedOrientation = 'wide' // Ultra-wide images (21:9 or wider)
    } else if (imgAspectRatio > 1.5) {
      detectedOrientation = 'landscape' // Landscape images (16:9, 3:2, etc.)
    } else if (imgAspectRatio > 0.9 && imgAspectRatio < 1.1) {
      detectedOrientation = 'square' // Square images (1:1)
    } else if (imgAspectRatio < 0.9) {
      detectedOrientation = 'portrait' // Portrait images (3:4, 9:16, etc.)
    } else {
      detectedOrientation = 'landscape' // Default to landscape
    }

    setOrientation(detectedOrientation)
    setIsLoaded(true)

    if (onLoad) {
      onLoad(imgAspectRatio, detectedOrientation)
    }
  }, [onLoad])

  const handleImageError = useCallback(() => {
    console.warn('Image failed to load:', src)
  }, [src])

  return (
    <div
      className={`adaptive-image-container ${orientation} ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        aspectRatio: aspectRatio || 'auto',
        minHeight: '200px',
        maxHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      data-orientation={orientation}
      data-aspect-ratio={aspectRatio}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: orientation === 'portrait' || orientation === 'square' ? 'contain' : 'cover',
          objectPosition: 'center',
          borderRadius: '8px',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px'
        }}>
          Loading...
        </div>
      )}
    </div>
  )
}

const PostPage = ({
  postSlug,
  onLike,
  onShare,
  onCopy,
  onDownload,
  onCommentSubmit,
  comments = []
}) => {
  // State management
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [likedShayari, setLikedShayari] = useState(new Set())
  const [openShareDropdown, setOpenShareDropdown] = useState(null)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Refs for accessibility and interaction
  const shareDropdownRefs = useRef({})
  const searchInputRef = useRef(null)
  const commentTextareaRef = useRef(null)

  // Fetch post data from Supabase
  useEffect(() => {
    const loadPost = async () => {
      if (!postSlug) return

      try {
        setLoading(true)
        setError(null)
        const postData = await fetchSinglePost(postSlug)
        setPost(postData)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [postSlug])

  // Parse HTML content to extract individual shayaris with images and all content
  const parseShayaris = useCallback((htmlContent) => {
    if (!htmlContent) return []

    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent

    // Get all child elements (paragraphs, blockquotes, figures, headings, etc.)
    const allElements = Array.from(tempDiv.children)
    const shayaris = []
    let shayariIndex = 0

    allElements.forEach((element) => {
      if (element.tagName === 'FIGURE') {
        // Extract the image and create a separate image card
        const images = Array.from(element.querySelectorAll('img'))
        if (images.length > 0) {
          const imageCard = {
            id: ++shayariIndex,
            theme: 'general',
            lines: [], // No text for image-only cards
            images: [{
              src: images[0].src,
              alt: images[0].alt || '',
              title: images[0].title || ''
            }],
            author: post?.users?.display_name || post?.users?.username || "अज्ञात",
            likes: Math.floor(Math.random() * 50) + 10,
            views: Math.floor(Math.random() * 500) + 100,
            shares: Math.floor(Math.random() * 20) + 5,
            category: post?.post_categories?.[0]?.categories?.name || "शायरी",
            createdAt: post?.published_at || new Date().toISOString(),
            isImageCard: true // This is an image-only card
          }
          shayaris.push(imageCard)
        }

      } else if (element.tagName === 'P' && element.querySelector('img')) {
        // This is a paragraph containing an image - create separate image card
        const images = Array.from(element.querySelectorAll('img'))
        if (images.length > 0) {
          const imageCard = {
            id: ++shayariIndex,
            theme: 'general',
            lines: [], // No text for image-only cards
            images: [{
              src: images[0].src,
              alt: images[0].alt || '',
              title: images[0].title || ''
            }],
            author: post?.users?.display_name || post?.users?.username || "अज्ञात",
            likes: Math.floor(Math.random() * 50) + 10,
            views: Math.floor(Math.random() * 500) + 100,
            shares: Math.floor(Math.random() * 20) + 5,
            category: post?.post_categories?.[0]?.categories?.name || "शायरी",
            createdAt: post?.published_at || new Date().toISOString(),
            isImageCard: true // This is an image-only card
          }
          shayaris.push(imageCard)
        }

      } else if (element.tagName === 'BLOCKQUOTE') {
        // Process each blockquote as an individual text-only card
        const text = element.textContent || element.innerText
        if (text.trim()) {
          // Clean the text and split by line breaks
          const lines = text.split('\n').filter(line => line.trim())

          // Determine theme based on content keywords
          const lowerText = text.toLowerCase()
          let theme = 'general'
          if (lowerText.includes('प्रेम') || lowerText.includes('प्यार') || lowerText.includes('मोहब्बत') || lowerText.includes('इश्क') || lowerText.includes('love')) {
            theme = 'love'
          } else if (lowerText.includes('दुख') || lowerText.includes('गम') || lowerText.includes('आंसू') || lowerText.includes('टूटे') || lowerText.includes('sad')) {
            theme = 'sad'
          } else if (lowerText.includes('प्रेरणा') || lowerText.includes('सफलता') || lowerText.includes('मेहनत') || lowerText.includes('motivat') || lowerText.includes('inspir') || lowerText.includes('success')) {
            theme = 'motivational'
          } else if (lowerText.includes('दोस्त') || lowerText.includes('मित्र') || lowerText.includes('friend')) {
            theme = 'friendship'
          }

          // Create individual text-only card for each blockquote
          const newShayari = {
            id: ++shayariIndex,
            theme,
            lines,
            images: [], // No images for text-only cards
            author: post?.users?.display_name || post?.users?.username || "अज्ञात",
            likes: Math.floor(Math.random() * 50) + 10,
            views: Math.floor(Math.random() * 500) + 100,
            shares: Math.floor(Math.random() * 20) + 5,
            category: post?.post_categories?.[0]?.categories?.name || "शायरी",
            createdAt: post?.published_at || new Date().toISOString(),
            isCombinedCard: false // This is a text-only card
          }
          shayaris.push(newShayari)
        }

      } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
        // Process headings as content cards
        const text = element.textContent || element.innerText
        if (text.trim()) {
          const headingCard = {
            id: ++shayariIndex,
            theme: 'general',
            lines: [text.trim()],
            images: [],
            author: post?.users?.display_name || post?.users?.username || "अज्ञात",
            likes: Math.floor(Math.random() * 30) + 5,
            views: Math.floor(Math.random() * 300) + 50,
            shares: Math.floor(Math.random() * 15) + 2,
            category: post?.post_categories?.[0]?.categories?.name || "शायरी",
            createdAt: post?.published_at || new Date().toISOString(),
            isHeading: true,
            headingLevel: element.tagName.toLowerCase()
          }
          shayaris.push(headingCard)
        }

      } else if (element.tagName === 'P' && !element.querySelector('img')) {
        // Process regular paragraphs (without images) as content cards
        const text = element.textContent || element.innerText
        if (text.trim() && text.trim().length > 10) { // Only include substantial paragraphs
          const paragraphCard = {
            id: ++shayariIndex,
            theme: 'general',
            lines: [text.trim()],
            images: [],
            author: post?.users?.display_name || post?.users?.username || "अज्ञात",
            likes: Math.floor(Math.random() * 25) + 3,
            views: Math.floor(Math.random() * 200) + 30,
            shares: Math.floor(Math.random() * 10) + 1,
            category: post?.post_categories?.[0]?.categories?.name || "शायरी",
            createdAt: post?.published_at || new Date().toISOString(),
            isParagraph: true
          }
          shayaris.push(paragraphCard)
        }
      }
    })

    return shayaris.filter(shayari => shayari.lines.length > 0 || shayari.images.length > 0)
  }, [post])

  // Get shayari collection from parsed content
  const shayariCollection = useMemo(() => {
    if (!post?.content) return []
    return parseShayaris(post.content)
  }, [post?.content, parseShayaris])

  // Enhanced social platforms with better sharing capabilities
  const socialPlatforms = useMemo(() => ({
    whatsapp: {
      name: "WhatsApp",
      icon: "📱",
      baseUrl: "https://wa.me/?text=",
      ariaLabel: "WhatsApp पर शेयर करें"
    },
    facebook: {
      name: "Facebook",
      icon: "📘",
      baseUrl: "https://www.facebook.com/sharer/sharer.php?u=",
      ariaLabel: "Facebook पर शेयर करें"
    },
    twitter: {
      name: "Twitter",
      icon: "🐦",
      baseUrl: "https://twitter.com/intent/tweet?text=",
      ariaLabel: "Twitter पर शेयर करें"
    },
    instagram: {
      name: "Instagram",
      icon: "📷",
      baseUrl: "https://www.instagram.com/",
      ariaLabel: "Instagram पर शेयर करें"
    }
  }), [])

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "आज"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "आज"
      }

      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      }

      // Format in Hindi
      const formatter = new Intl.DateTimeFormat('hi-IN', options)
      return formatter.format(date)
    } catch (error) {
      console.error('Date formatting error:', error)
      return "आज"
    }
  }, [])

  // Post metadata from Supabase data
  const postMetadata = useMemo(() => ({
    title: post?.title || "शायरी संग्रह",
    author: post?.users?.display_name || post?.users?.username || "अज्ञात",
    publishDate: post?.published_at ? formatDate(post.published_at) : "आज",
    category: post?.post_categories?.[0]?.categories?.name || "शायरी",
    views: post?.view_count || 0,
    likes: shayariCollection.reduce((total, shayari) => total + shayari.likes, 0),
    comments: comments.length || 0,
    shares: shayariCollection.reduce((total, shayari) => total + shayari.shares, 0),
    description: post?.excerpt || "हृदय की गहराइयों से निकली भावनाओं की अभिव्यक्ति"
  }), [post, shayariCollection, comments])

  // Enhanced toast system
  const showToastMessage = useCallback((message, type = 'success') => {
    setToastMessage(message)
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
      setTimeout(() => setToastMessage(''), 300)
    }, 3000)
  }, [])

  // Enhanced event handlers with better error handling and accessibility
  const handleLike = useCallback((shayariId) => {
    try {
      setLikedShayari(prev => {
        const newSet = new Set(prev)
        if (newSet.has(shayariId)) {
          newSet.delete(shayariId)
          showToastMessage('पसंद हटाई गई')
        } else {
          newSet.add(shayariId)
          showToastMessage('पसंद की गई!')
        }
        return newSet
      })
      onLike?.(shayariId)
    } catch (error) {
      console.error('Like error:', error)
      showToastMessage('कुछ गलत हुआ है', 'error')
    }
  }, [onLike, showToastMessage])

  const handleShareToggle = useCallback((shayariId, event) => {
    event.stopPropagation()
    event.preventDefault()
    setOpenShareDropdown(prev => prev === shayariId ? null : shayariId)
  }, [])

  const handleShare = useCallback((platform, shayariId) => {
    try {
      const shayari = shayariCollection.find(s => s.id === shayariId)
      if (!shayari) {
        showToastMessage('शायरी नहीं मिली', 'error')
        return
      }

      const text = shayari.lines.join('\n') + '\n\n- ' + shayari.author
      const platformData = socialPlatforms[platform]

      if (platformData) {
        const shareUrl = platformData.baseUrl + encodeURIComponent(text)
        const popup = window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')

        if (popup) {
          showToastMessage(`${platformData.name} पर शेयर किया गया!`)
        } else {
          showToastMessage('पॉप-अप ब्लॉक हो गया', 'error')
        }
      }

      setOpenShareDropdown(null)
      onShare?.(platform, shayariId)
    } catch (error) {
      console.error('Share error:', error)
      showToastMessage('शेयर करने में त्रुटि', 'error')
      setOpenShareDropdown(null)
    }
  }, [shayariCollection, socialPlatforms, onShare, showToastMessage])

  const handleCopy = useCallback(async (shayariId) => {
    try {
      const shayari = shayariCollection.find(s => s.id === shayariId)
      if (!shayari) {
        showToastMessage('शायरी नहीं मिली', 'error')
        return
      }

      let text = ''
      if (shayari.lines && shayari.lines.length > 0) {
        text = shayari.lines.join('\n') + '\n\n- ' + shayari.author
      } else if (shayari.isImageCard && shayari.images && shayari.images.length > 0) {
        text = `Image: ${shayari.images[0].alt || 'Inspirational Image'}\n\n- ${shayari.author}`
      } else {
        text = `- ${shayari.author}`
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Enhanced fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.cssText = `
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        `
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)

        if (!successful) {
          throw new Error('Copy command failed')
        }
      }

      setShowCopyModal(true)
      setTimeout(() => setShowCopyModal(false), 2000)
      onCopy?.(shayariId)
    } catch (err) {
      console.error('Copy failed:', err)
      showToastMessage('कॉपी करने में त्रुटि हुई!', 'error')
    }
  }, [shayariCollection, onCopy, showToastMessage])

  const handleDownload = useCallback((shayariId) => {
    try {
      const shayari = shayariCollection.find(s => s.id === shayariId)
      if (!shayari) {
        showToastMessage('शायरी नहीं मिली', 'error')
        return
      }

      // If it's an image-only card, download the actual image
      if (shayari.isImageCard && shayari.images && shayari.images.length > 0) {
        downloadActualImage(shayari.images[0])
      } else {
        // For text cards or combined cards, generate image with text
        generateImageDownload(shayari)
      }

      onDownload?.(shayariId)
    } catch (error) {
      console.error('Download error:', error)
      showToastMessage('डाउनलोड में त्रुटि', 'error')
    }
  }, [shayariCollection, onDownload, showToastMessage])

  const downloadActualImage = useCallback(async (image) => {
    try {
      // Method 1: Use our download proxy API (most reliable)
      const apiPort = import.meta.env.DEV ? '3001' : '3000'
      const proxyUrl = `http://localhost:${apiPort}/api/download-image?url=${encodeURIComponent(image.src)}`

      // Create a temporary link that points to our proxy
      const link = document.createElement('a')
      link.href = proxyUrl
      link.download = `inspirational-quote-${Date.now()}.jpg`
      link.style.display = 'none'
      link.target = '_blank'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showToastMessage('इमेज डाउनलोड शुरू हो गई!', 'success')

    } catch (error) {
      console.error('Image download error:', error)

      // Fallback: Try direct download
      try {
        const link = document.createElement('a')
        link.href = image.src
        link.download = `inspirational-quote-${Date.now()}.jpg`
        link.style.display = 'none'
        link.target = '_blank'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        showToastMessage('इमेज डाउनलोड शुरू हो गई!', 'success')
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError)
        showToastMessage('इमेज डाउनलोड में त्रुटि। कृपया इमेज पर राइट-क्लिक करके "Save Image As" का उपयोग करें।', 'error')
      }
    }
  }, [showToastMessage])



  const generateImageDownload = useCallback((shayari) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      canvas.width = 800
      canvas.height = 600

      // Enhanced background gradient based on theme
      const gradients = {
        love: ['#ff6b9d', '#c44569', '#f8b500'],
        sad: ['#485563', '#29323c', '#74b9ff'],
        motivational: ['#ff7675', '#fd79a8', '#fdcb6e'],
        friendship: ['#00b894', '#00cec9', '#6c5ce7'],
        default: ['#667eea', '#764ba2', '#f093fb']
      }

      const themeColors = gradients[shayari.theme] || gradients.default
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, themeColors[0])
      gradient.addColorStop(0.5, themeColors[1])
      gradient.addColorStop(1, themeColors[2])

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add overlay for better text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Enhanced text properties
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 32px "Noto Sans Devanagari", Arial, sans-serif'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Calculate text positioning
      const lineHeight = 60
      const totalTextHeight = shayari.lines.length * lineHeight
      const startY = (canvas.height - totalTextHeight) / 2

      // Draw shayari lines with better spacing (only if lines exist)
      if (shayari.lines && shayari.lines.length > 0) {
        shayari.lines.forEach((line, index) => {
          ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight))
        })
      } else {
        // For image-only cards, add a placeholder text
        ctx.fillText('Inspirational Image', canvas.width / 2, startY)
      }

      // Draw author with different styling
      ctx.font = 'italic 24px "Noto Sans Devanagari", Arial, sans-serif'
      ctx.fillText('- ' + shayari.author, canvas.width / 2, startY + totalTextHeight + 60)

      // Add watermark
      ctx.font = '16px Arial'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.fillText('शायरी संग्रह', canvas.width - 100, canvas.height - 20)

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob')
        }

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `shayari-${shayari.id}-${Date.now()}.png`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        showToastMessage('शायरी डाउनलोड हो गई!')
      }, 'image/png', 0.9)
    } catch (error) {
      console.error('Image generation error:', error)
      showToastMessage('इमेज बनाने में त्रुटि', 'error')
    }
  }, [showToastMessage])

  const handleCommentSubmit = useCallback(async (event) => {
    event.preventDefault()

    if (!newComment.trim()) {
      showToastMessage('कृपया टिप्पणी लिखें', 'error')
      commentTextareaRef.current?.focus()
      return
    }

    if (newComment.trim().length < 3) {
      showToastMessage('टिप्पणी कम से कम 3 अक्षर की होनी चाहिए', 'error')
      return
    }

    setIsSubmittingComment(true)

    try {
      await onCommentSubmit?.(newComment.trim())
      setNewComment('')
      showToastMessage('टिप्पणी जोड़ी गई!')
      commentTextareaRef.current?.focus()
    } catch (error) {
      console.error('Comment submission error:', error)
      showToastMessage('टिप्पणी जोड़ने में त्रुटि', 'error')
    } finally {
      setIsSubmittingComment(false)
    }
  }, [newComment, onCommentSubmit, showToastMessage])

  const handleSearch = useCallback((event) => {
    if (event) {
      event.preventDefault()
    }

    const query = searchQuery.trim()
    if (!query) {
      showToastMessage('कृपया खोज शब्द दर्ज करें', 'error')
      searchInputRef.current?.focus()
      return
    }

    if (query.length < 2) {
      showToastMessage('कम से कम 2 अक्षर दर्ज करें', 'error')
      return
    }

    showToastMessage(`"${query}" के लिए खोज परिणाम`)
    // In real app, this would trigger search functionality
  }, [searchQuery, showToastMessage])

  const handleKeyPress = useCallback((event, action) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      action()
    }
  }, [])

  // Enhanced effects for better UX and accessibility
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.share-dropdown')) {
        setOpenShareDropdown(null)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setOpenShareDropdown(null)
        setShowCopyModal(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  // Focus management for accessibility
  useEffect(() => {
    if (showCopyModal) {
      // Trap focus in modal
      const modal = document.querySelector('.modal')
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length > 0) {
          focusableElements[0].focus()
        }
      }
    }
  }, [showCopyModal])



  // Loading and error states
  if (loading) {
    return (
      <div className="post-page loading-state">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>लोड हो रहा है...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="post-page error-state">
        <div className="container">
          <div className="error-message">
            <h2>कुछ गलत हुआ है</h2>
            <p>{error.message || 'पेज लोड करने में त्रुटि'}</p>
            <button
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              पुनः प्रयास करें
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="post-page" lang="hi">


      {/* Enhanced Breadcrumb Navigation */}
      <nav className="breadcrumb" role="navigation" aria-label="ब्रेडक्रम्ब नेवीगेशन">
        <div className="container container--full desktop-full-width">
          <ol className="breadcrumb-list">
            <li>
              <Link to="/" className="breadcrumb-link" aria-label="होम पेज पर जाएं">
                होम
              </Link>
            </li>
            <li>
              <Link to="/posts" className="breadcrumb-link" aria-label="सभी शायरी देखें">
                शायरी
              </Link>
            </li>
            <li>
              <span className="breadcrumb-current" aria-current="page">
                {postMetadata.title}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Enhanced Main Content */}
      <main className="main-content" role="main">
        <div className="container container--full desktop-full-width">
          <div className="post-layout">
            {/* Enhanced Post Content */}
            <article className="post-content" itemScope itemType="https://schema.org/BlogPosting">
              {/* Enhanced Post Header */}
              <header className="post-header">
                <h1 className="post-title" itemProp="headline">
                  {postMetadata.title}
                </h1>

                <div className="post-meta">
                  <div className="author-info" itemScope itemType="https://schema.org/Person">
                    <div
                      className="author-avatar"
                      role="img"
                      aria-label={`${postMetadata.author} की तस्वीर`}
                    ></div>
                    <div className="author-details">
                      <h3 itemProp="author">{postMetadata.author}</h3>
                      <p className="post-date">
                        <time
                          dateTime={post?.publishDate || "2024-11-15"}
                          itemProp="datePublished"
                        >
                          {formatDate(postMetadata.publishDate)}
                        </time>
                      </p>
                    </div>
                  </div>

                  <div className="post-stats" role="group" aria-label="पोस्ट आंकड़े">
                    <span className="stat-item" aria-label={`${postMetadata.views} बार देखा गया`}>
                      <span aria-hidden="true">👁️</span> {postMetadata.views} बार देखा गया
                    </span>
                    <span className="stat-item" aria-label={`${postMetadata.likes} पसंद`}>
                      <span aria-hidden="true">❤️</span> {postMetadata.likes} पसंद
                    </span>
                    <span className="stat-item" aria-label={`${postMetadata.comments} टिप्पणियां`}>
                      <span aria-hidden="true">💬</span> {postMetadata.comments} टिप्पणियां
                    </span>
                    <span className="stat-item" aria-label={`${postMetadata.shares} शेयर`}>
                      <span aria-hidden="true">📤</span> {postMetadata.shares} शेयर
                    </span>
                  </div>
                </div>

                <div className="post-category">
                  <span className="category-tag" itemProp="articleSection">
                    {postMetadata.category}
                  </span>
                </div>
              </header>

              {/* Enhanced Post Content - Traditional Blog Layout */}
              <div className="post-content-body" role="group" aria-label="पोस्ट सामग्री">
                <EnhancedHTMLContent
                  content={post?.content || ''}
                  onCopy={(text) => {
                    setShowCopyModal(true)
                    setTimeout(() => setShowCopyModal(false), 2000)
                  }}
                  onShare={(platform, text) => {
                    console.log(`Shared on ${platform}:`, text)
                  }}
                />
              </div>

              {/* Enhanced Comments Section */}
              <CommentsSection
                comments={comments}
                newComment={newComment}
                onCommentChange={setNewComment}
                onCommentSubmit={handleCommentSubmit}
                isSubmitting={isSubmittingComment}
                textareaRef={commentTextareaRef}
              />
            </article>

            {/* Enhanced Sidebar */}
            <Sidebar
              relatedPosts={relatedPosts}
              author={postMetadata.author}
              category={postMetadata.category}
            />
          </div>
        </div>
      </main>

      {/* Enhanced Copy Success Modal */}
      {showCopyModal && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setShowCopyModal(false)}
        >
          <div className="modal-backdrop" aria-hidden="true"></div>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <div className="modal-body">
              <div className="success-message">
                <span className="success-icon" aria-hidden="true">✅</span>
                <p id="modal-title">शायरी सफलतापूर्वक कॉपी हो गई!</p>
                <button
                  className="btn btn--sm btn--secondary"
                  onClick={() => setShowCopyModal(false)}
                  aria-label="मॉडल बंद करें"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Toast Notification */}
      {showToast && toastMessage && (
        <div
          className={`toast ${showToast ? 'toast--show' : ''}`}
          role="alert"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}


    </div>
  )
}

// Enhanced ShayariCard component with better accessibility and features
const ShayariCard = React.memo(({
  shayari,
  index,
  isLiked,
  isShareOpen,
  onLike,
  onShareToggle,
  onShare,
  onCopy,
  onDownload,
  socialPlatforms
}) => {
  const themeClass = `${shayari.theme}-bg`
  const cardRef = useRef(null)

  // Handle aspect ratio detection for adaptive images
  const handleAspectRatioDetected = useCallback((aspectRatio, orientation) => {
    // Optional: Add any additional logic here if needed
    console.log(`Image detected: ${orientation} (${aspectRatio.toFixed(2)})`)
  }, [])

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onLike()
    }
  }, [onLike])

  return (
    <div
      ref={cardRef}
      className="shayari-card"
      data-theme={shayari.theme}
      role="article"
      aria-labelledby={`shayari-${shayari.id}-title`}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div className={`shayari-background ${themeClass}`}>
        <div className="shayari-overlay">
          {/* Combined content for cards with both images and text */}
          {shayari.isCombinedCard && (
            <div className="shayari-combined-content">
              {/* Render images first */}
              {shayari.images && shayari.images.length > 0 && (
                <div className="shayari-image-section">
                  {shayari.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="shayari-image-container">
                      <AdaptiveImage
                        src={image.src}
                        alt={image.alt || `शायरी चित्र ${imageIndex + 1}`}
                        className="shayari-image"
                        onLoad={handleAspectRatioDetected}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Render text content below images */}
              {shayari.lines && shayari.lines.length > 0 && (
                <div className="shayari-text-section">
                  <div
                    className="shayari-text"
                    id={`shayari-${shayari.id}-title`}
                    role="group"
                    aria-label={`शायरी ${index + 1}`}
                  >
                    {shayari.lines.map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="shayari-line"
                        role="text"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="shayari-author"
                role="text"
                aria-label={`लेखक: ${shayari.author}`}
              >
                - {shayari.author}
              </div>
            </div>
          )}

          {/* Image content for image-only cards */}
          {shayari.isImageCard && !shayari.isCombinedCard && shayari.images && shayari.images.length > 0 && (
            <div className="shayari-image-content">
              {shayari.images.map((image, imageIndex) => (
                <div key={imageIndex} className="shayari-image-container">
                  <AdaptiveImage
                    src={image.src}
                    alt={image.alt || `शायरी चित्र ${imageIndex + 1}`}
                    className="shayari-image"
                    onLoad={handleAspectRatioDetected}
                  />
                </div>
              ))}
              <div
                className="shayari-author"
                role="text"
                aria-label={`लेखक: ${shayari.author}`}
              >
                - {shayari.author}
              </div>
            </div>
          )}

          {/* Text content for text-only cards */}
          {!shayari.isImageCard && !shayari.isCombinedCard && (
            <div className="shayari-content">
              {/* Render text content if it exists */}
              {shayari.lines && shayari.lines.length > 0 && (
                <div
                  className={`shayari-text ${shayari.isHeading ? 'shayari-heading' : ''} ${shayari.isParagraph ? 'shayari-paragraph' : ''}`}
                  id={`shayari-${shayari.id}-title`}
                  role="group"
                  aria-label={shayari.isHeading ? `शीर्षक ${index + 1}` : shayari.isParagraph ? `पैराग्राफ ${index + 1}` : `शायरी ${index + 1}`}
                >
                  {shayari.lines.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`shayari-line ${shayari.isHeading ? `heading-${shayari.headingLevel}` : ''} ${shayari.isParagraph ? 'paragraph-text' : ''}`}
                      role="text"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}

              <div
                className="shayari-author"
                role="text"
                aria-label={`लेखक: ${shayari.author}`}
              >
                - {shayari.author}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shayari-actions" role="group" aria-label="शायरी एक्शन">
        <button
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={onLike}
          aria-pressed={isLiked}
          aria-label={`${isLiked ? 'पसंद हटाएं' : 'पसंद करें'} (वर्तमान में ${shayari.likes + (isLiked ? 1 : 0)} पसंद)`}
        >
          <span className="btn-icon" aria-hidden="true">❤️</span>
          <span className="like-count">{shayari.likes + (isLiked ? 1 : 0)}</span>
        </button>

        <div className="share-dropdown">
          <button
            className="action-btn share-btn"
            onClick={onShareToggle}
            aria-expanded={isShareOpen}
            aria-haspopup="menu"
            aria-label="शेयर विकल्प खोलें"
          >
            <span className="btn-icon" aria-hidden="true">📤</span>
            शेयर करें
          </button>
          <div
            className={`share-menu ${isShareOpen ? '' : 'hidden'}`}
            role="menu"
            aria-label="शेयर विकल्प"
          >
            {Object.entries(socialPlatforms).map(([platform, data]) => (
              <button
                key={platform}
                className="share-option"
                onClick={() => onShare(platform)}
                role="menuitem"
                aria-label={data.ariaLabel}
              >
                <span className="share-icon" aria-hidden="true">{data.icon}</span>
                {data.name}
              </button>
            ))}
          </div>
        </div>

        <button
          className="action-btn copy-btn"
          onClick={onCopy}
          aria-label="शायरी कॉपी करें"
        >
          <span className="btn-icon" aria-hidden="true">📋</span>
          कॉपी करें
        </button>

        <button
          className="action-btn download-btn"
          onClick={onDownload}
          aria-label="शायरी इमेज डाउनलोड करें"
        >
          <span className="btn-icon" aria-hidden="true">⬇️</span>
          डाउनलोड
        </button>
      </div>

      <div className="shayari-stats" role="group" aria-label="शायरी आंकड़े">
        <span aria-label={`${shayari.views} बार देखा गया`}>
          <span aria-hidden="true">👁️</span> {shayari.views} views
        </span>
        <span aria-label={`${shayari.likes} पसंद`}>
          <span aria-hidden="true">❤️</span> {shayari.likes} likes
        </span>
        <span aria-label={`${shayari.shares} बार शेयर किया गया`}>
          <span aria-hidden="true">📤</span> {shayari.shares} shares
        </span>
      </div>
    </div>
  )
})

const CommentsSection = React.memo(({
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
  isSubmitting,
  textareaRef
}) => {
  const [commentLikes, setCommentLikes] = useState(new Set())

  const handleCommentLike = useCallback((commentId) => {
    setCommentLikes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }, [])

  const formatRelativeTime = useCallback((timeString) => {
    try {
      const date = new Date(timeString)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))

      if (diffInMinutes < 1) return 'अभी'
      if (diffInMinutes < 60) return `${diffInMinutes} मिनट पहले`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} घंटे पहले`
      return `${Math.floor(diffInMinutes / 1440)} दिन पहले`
    } catch {
      return timeString
    }
  }, [])

  return (
    <section className="comments-section" role="region" aria-labelledby="comments-heading">
      <h3 id="comments-heading" className="comments-title">
        टिप्पणियां ({comments.length})
      </h3>

      <form
        className="comment-form"
        onSubmit={onCommentSubmit}
        aria-label="नई टिप्पणी जोड़ें"
      >
        <div className="form-group">
          <label htmlFor="comment-textarea" className="sr-only">
            अपनी टिप्पणी लिखें
          </label>
          <textarea
            id="comment-textarea"
            ref={textareaRef}
            className="form-control comment-input"
            placeholder="अपनी टिप्पणी लिखें..."
            rows="3"
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            disabled={isSubmitting}
            aria-describedby="comment-help"
            maxLength={500}
          />
          <div id="comment-help" className="form-help">
            {newComment.length}/500 अक्षर
          </div>
        </div>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={isSubmitting || !newComment.trim()}
          aria-label={isSubmitting ? 'टिप्पणी पोस्ट हो रही है...' : 'टिप्पणी पोस्ट करें'}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner" aria-hidden="true"></span>
              पोस्ट हो रही है...
            </>
          ) : (
            'टिप्पणी पोस्ट करें'
          )}
        </button>
      </form>

      <div className="comments-list" role="list">
        {comments.length === 0 ? (
          <div className="no-comments" role="status">
            <p>अभी तक कोई टिप्पणी नहीं है। पहली टिप्पणी करें!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="comment"
              role="listitem"
              aria-labelledby={`comment-${comment.id}-author`}
            >
              <div
                className="comment-avatar"
                role="img"
                aria-label={`${comment.author} की तस्वीर`}
              ></div>
              <div className="comment-content">
                <div className="comment-header">
                  <h5
                    id={`comment-${comment.id}-author`}
                    className="comment-author"
                  >
                    {comment.author}
                  </h5>
                  <time
                    className="comment-time"
                    dateTime={comment.time}
                    title={new Date(comment.time).toLocaleString('hi-IN')}
                  >
                    {formatRelativeTime(comment.time)}
                  </time>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-actions" role="group" aria-label="टिप्पणी एक्शन">
                  <button
                    className={`comment-like-btn ${commentLikes.has(comment.id) ? 'liked' : ''}`}
                    onClick={() => handleCommentLike(comment.id)}
                    aria-pressed={commentLikes.has(comment.id)}
                    aria-label={`टिप्पणी को ${commentLikes.has(comment.id) ? 'नापसंद' : 'पसंद'} करें`}
                  >
                    <span aria-hidden="true">👍</span>
                    पसंद ({comment.likes + (commentLikes.has(comment.id) ? 1 : 0)})
                  </button>
                  <button
                    className="comment-reply-btn"
                    aria-label={`${comment.author} को जवाब दें`}
                  >
                    जवाब दें
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
})

const Sidebar = React.memo(({ relatedPosts, author, category }) => {
  const popularCategories = useMemo(() => [
    { name: 'प्रेम शायरी', count: 45, slug: 'love' },
    { name: 'दुःख शायरी', count: 32, slug: 'sad' },
    { name: 'प्रेरणादायक', count: 28, slug: 'motivational' },
    { name: 'दोस्ती', count: 21, slug: 'friendship' },
    { name: 'जीवन', count: 18, slug: 'life' },
    { name: 'प्रकृति', count: 15, slug: 'nature' }
  ], [])

  return (
    <aside className="sidebar" role="complementary" aria-label="साइडबार">
      {/* Enhanced Related Posts Widget */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="widget" role="region" aria-labelledby="related-posts-title">
          <h4 id="related-posts-title" className="widget-title">संबंधित पोस्ट</h4>
          <div className="related-posts" role="list">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.slug || post.id}`}
                className="related-post"
                role="listitem"
                aria-label={`${post.title} पढ़ें`}
              >
                <div className="related-post-content">
                  <h5>{post.title}</h5>
                  <p className="related-author">लेखक: {post.author}</p>
                  <span className="related-category">{post.category}</span>
                  <div className="related-meta">
                    <span className="related-date">
                      {new Date(post.publishDate).toLocaleDateString('hi-IN')}
                    </span>
                    <span className="related-views">
                      <span aria-hidden="true">👁️</span> {post.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Author Widget */}
      <div className="widget author-widget" role="region" aria-labelledby="author-title">
        <h4 id="author-title" className="widget-title">लेखक के बारे में</h4>
        <div
          className="author-avatar-large"
          role="img"
          aria-label={`${author} की तस्वीर`}
        ></div>
        <h5>{author}</h5>
        <p>हिंदी साहित्य के प्रेमी और शायरी के शौकीन। 10 सालों से शायरी लिख रहे हैं।</p>
        <div className="author-stats" role="group" aria-label="लेखक आंकड़े">
          <span aria-label="150 से अधिक शायरी">
            <span aria-hidden="true">📝</span> 150+ शायरी
          </span>
          <span aria-label="5.2 हजार फॉलोअर्स">
            <span aria-hidden="true">👥</span> 5.2K फॉलोअर्स
          </span>
        </div>
        <Link
          to={`/author/${author.toLowerCase().replace(/\s+/g, '-')}`}
          className="btn btn--outline btn--sm"
          aria-label={`${author} की सभी शायरी देखें`}
        >
          सभी शायरी देखें
        </Link>
      </div>

      {/* Enhanced Popular Categories Widget */}
      <div className="widget" role="region" aria-labelledby="categories-title">
        <h4 id="categories-title" className="widget-title">लोकप्रिय श्रेणियां</h4>
        <div className="popular-categories" role="list">
          {popularCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`category-badge ${category === cat.name ? 'active' : ''}`}
              role="listitem"
              aria-label={`${cat.name} श्रेणी में ${cat.count} शायरी देखें`}
            >
              {cat.name}
              <span className="category-count" aria-hidden="true">({cat.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription Widget */}
      <div className="widget newsletter-widget" role="region" aria-labelledby="newsletter-title">
        <h4 id="newsletter-title" className="widget-title">न्यूज़लेटर</h4>
        <p>नई शायरी की जानकारी पाने के लिए सब्सक्राइब करें</p>
        <form className="newsletter-form" aria-label="न्यूज़लेटर सब्सक्रिप्शन">
          <div className="form-group">
            <label htmlFor="newsletter-email" className="sr-only">
              ईमेल पता
            </label>
            <input
              id="newsletter-email"
              type="email"
              className="form-control"
              placeholder="आपका ईमेल"
              required
              aria-describedby="newsletter-help"
            />
            <div id="newsletter-help" className="form-help">
              हम आपकी जानकारी सुरक्षित रखते हैं
            </div>
          </div>
          <button type="submit" className="btn btn--primary btn--sm btn--full-width">
            सब्सक्राइब करें
          </button>
        </form>
      </div>
    </aside>
  )
})



export default PostPage
