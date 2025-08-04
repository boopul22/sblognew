/**
 * API Endpoint for R2 health check
 */

// R2 Configuration
const R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'blog-images',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check if R2 is configured
    const isConfigured = !!(
      R2_CONFIG.accountId &&
      R2_CONFIG.accessKeyId &&
      R2_CONFIG.secretAccessKey &&
      R2_CONFIG.bucketName &&
      R2_CONFIG.endpoint
    )

    if (!isConfigured) {
      return res.status(503).json({
        success: false,
        error: 'R2 not configured',
        configured: false
      })
    }

    res.status(200).json({
      success: true,
      message: 'R2 API is available',
      configured: true,
      bucket: R2_CONFIG.bucketName
    })

  } catch (error) {
    console.error('Error in R2 health check:', error)
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    })
  }
}
