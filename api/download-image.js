// API handler to proxy image downloads and handle CORS issues
// This handler works with the custom dev-api-server.js mock response object
export default async function handler(req, mockRes) {
  console.log(`Download image request: ${req.method} ${req.url}`)

  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method)
    return mockRes.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.query

  if (!url) {
    console.log('No URL provided')
    return mockRes.status(400).json({ error: 'URL parameter is required' })
  }

  console.log('Downloading image from:', url)

  try {
    // Validate that it's an image URL from our allowed domains
    const imageUrl = new URL(url)
    const allowedDomains = [
      'pub-fc97d8e973a94b6ab42a5785e3a4130e.r2.dev', // Your Cloudflare R2 domain
      'localhost',
      '127.0.0.1'
    ]

    if (!allowedDomains.some(domain => imageUrl.hostname.includes(domain))) {
      console.log('Domain not allowed:', imageUrl.hostname)
      return mockRes.status(403).json({ error: 'Domain not allowed' })
    }

    console.log('Fetching image from:', url)

    // Fetch the image
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageDownloader/1.0)',
        'Accept': 'image/*'
      }
    })

    if (!response.ok) {
      console.log('Failed to fetch image:', response.status, response.statusText)
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    console.log('Image fetched successfully, size:', buffer.byteLength, 'bytes')

    // Extract filename from URL or use default
    const urlPath = imageUrl.pathname
    const filename = urlPath.split('/').pop() || `inspirational-quote-${Date.now()}.jpg`

    console.log('Sending image as download:', filename)

    // For the custom server, we need to return a special response
    // that indicates this is a binary download
    return {
      type: 'binary',
      data: Buffer.from(buffer),
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }

  } catch (error) {
    console.error('Image download proxy error:', error)
    return mockRes.status(500).json({ error: 'Failed to download image' })
  }
}
