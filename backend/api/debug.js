/**
 * Debug endpoint to check Vercel serverless function environment
 */

export default async function handler(req, res) {
  try {
    // Check environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID ? '✅ Set' : '❌ Missing',
      CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing',
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing',
      CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME || '❌ Missing',
      CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT ? '✅ Set' : '❌ Missing'
    }

    // Check if AWS SDK is available
    let awsSdkStatus = '❌ Not available'
    try {
      const { S3Client } = await import('@aws-sdk/client-s3')
      awsSdkStatus = '✅ Available'
    } catch (error) {
      awsSdkStatus = `❌ Error: ${error.message}`
    }

    // Check Node.js version
    const nodeVersion = process.version

    // Check if we can create S3 client
    let s3ClientStatus = '❌ Cannot create'
    try {
      const { S3Client } = await import('@aws-sdk/client-s3')
      const client = new S3Client({
        region: 'auto',
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        },
      })
      s3ClientStatus = '✅ Created successfully'
    } catch (error) {
      s3ClientStatus = `❌ Error: ${error.message}`
    }

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion,
        platform: process.platform,
        arch: process.arch
      },
      environmentVariables: envVars,
      dependencies: {
        awsSdk: awsSdkStatus,
        s3Client: s3ClientStatus
      },
      vercelInfo: {
        region: process.env.VERCEL_REGION || 'Unknown',
        runtime: 'nodejs18.x'
      }
    })

  } catch (error) {
    console.error('Debug endpoint error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
