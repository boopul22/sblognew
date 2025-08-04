/**
 * API Endpoint for getting file metadata from Cloudflare R2
 */

import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3'

// R2 Configuration
const R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'blog-images',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT
}

// Create S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_CONFIG.endpoint,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
})

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { filename } = req.query

    // Validate input
    if (!filename) {
      return res.status(400).json({ error: 'Missing filename parameter' })
    }

    // Check R2 configuration
    if (!R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey || !R2_CONFIG.endpoint) {
      return res.status(500).json({ error: 'R2 not configured' })
    }

    // Create the head object command
    const command = new HeadObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: filename
    })

    // Execute the head command
    const response = await s3Client.send(command)

    // Format the response
    const metadata = {
      name: filename,
      size: response.ContentLength,
      contentType: response.ContentType,
      lastModified: response.LastModified,
      etag: response.ETag,
      metadata: response.Metadata || {}
    }

    res.status(200).json({
      success: true,
      metadata: metadata
    })

  } catch (error) {
    console.error('Error getting file metadata from R2:', error)
    
    // Handle file not found
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get file metadata'
    })
  }
}
