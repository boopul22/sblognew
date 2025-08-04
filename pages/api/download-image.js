// API handler to proxy image downloads and handle CORS issues
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  try {
    // Validate that it's an image URL from our allowed domains
    const imageUrl = new URL(url)
    const allowedDomains = [
      'pub-fc97d8e973a94b6ab42a5785e3a4130e.r2.dev', // Your Cloudflare R2 domain
      'localhost',
      '127.0.0.1'
    ]

    if (!allowedDomains.some(domain => imageUrl.hostname.includes(domain))) {
      return res.status(403).json({ error: 'Domain not allowed' })
    }

    // Fetch the image
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageDownloader/1.0)',
        'Accept': 'image/*'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    // Extract filename from URL or use default
    const urlPath = imageUrl.pathname
    const filename = urlPath.split('/').pop() || `inspirational-quote-${Date.now()}.jpg`

    // Set proper headers for forced download
    res.setHeader('Content-Type', 'application/octet-stream') // Force download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', buffer.byteLength)
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Send the image data
    res.send(Buffer.from(buffer))

  } catch (error) {
    console.error('Image download proxy error:', error)
    res.status(500).json({ error: 'Failed to download image' })
  }
}
