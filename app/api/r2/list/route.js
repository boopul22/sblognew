/**
 * API Endpoint for listing files in Cloudflare R2
 */

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const prefix = searchParams.get('prefix') || ''

    // Check R2 configuration
    if (!R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey || !R2_CONFIG.endpoint) {
      return Response.json({ error: 'R2 not configured' }, { status: 500 })
    }

    // Create the list objects command
    const command = new ListObjectsV2Command({
      Bucket: R2_CONFIG.bucketName,
      MaxKeys: limit,
      Prefix: prefix,
    })

    // Execute the list command
    const response = await s3Client.send(command)

    // Format the response to match our interface
    const files = (response.Contents || []).map(obj => ({
      name: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      etag: obj.ETag
    }))

    return Response.json({
      success: true,
      files: files,
      count: files.length,
      isTruncated: response.IsTruncated || false
    })

  } catch (error) {
    console.error('Error listing files from R2:', error)
    return Response.json({
      success: false,
      error: 'Failed to list files',
      files: []
    }, { status: 500 })
  }
}
