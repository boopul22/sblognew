/**
 * API Endpoint for Image Deletion from Cloudflare R2
 */

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

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
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { filename } = req.body

    // Validate input
    if (!filename) {
      return res.status(400).json({ error: 'Missing filename' })
    }

    // Check R2 configuration
    if (!R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey || !R2_CONFIG.endpoint) {
      return res.status(500).json({ error: 'R2 not configured' })
    }

    // Create the delete object command
    const command = new DeleteObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: filename
    })

    // Execute the delete command
    await s3Client.send(command)

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      filename
    })

  } catch (error) {
    console.error('Image deletion error:', error)
    return res.status(500).json({ 
      error: 'Failed to delete image',
      details: error.message 
    })
  }
}
