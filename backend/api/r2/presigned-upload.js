/**
 * API Endpoint for generating presigned upload URLs for Cloudflare R2
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { filename, contentType } = req.body

    // Validate input
    if (!filename || !contentType) {
      return res.status(400).json({ error: 'Missing filename or contentType' })
    }

    // Validate content type (only images)
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed' })
    }

    // Check R2 configuration
    if (!R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey || !R2_CONFIG.endpoint) {
      return res.status(500).json({ error: 'R2 not configured' })
    }

    // Create the put object command
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: filename,
      ContentType: contentType,
    })

    // Generate presigned URL (expires in 10 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 })

    res.status(200).json({
      success: true,
      url: presignedUrl,
      filename: filename,
      expiresIn: 600
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate presigned URL'
    })
  }
}
