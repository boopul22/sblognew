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

export async function POST(request) {
  try {
    const { filename, contentType } = await request.json()

    // Validate input
    if (!filename || !contentType) {
      return Response.json({ error: 'Missing filename or contentType' }, { status: 400 })
    }

    // Validate content type (only images)
    if (!contentType.startsWith('image/')) {
      return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Check R2 configuration
    if (!R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey || !R2_CONFIG.endpoint) {
      return Response.json({ error: 'R2 not configured' }, { status: 500 })
    }

    // Create the put object command
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: filename,
      ContentType: contentType,
    })

    // Generate presigned URL (expires in 10 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 })

    return Response.json({
      success: true,
      url: presignedUrl,
      filename: filename,
      expiresIn: 600
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return Response.json({
      success: false,
      error: 'Failed to generate presigned URL'
    }, { status: 500 })
  }
}
