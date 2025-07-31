#!/usr/bin/env node

/**
 * Create R2 API Token using Cloudflare API
 * This script uses your existing Cloudflare API token to create R2 storage credentials
 */

const CLOUDFLARE_API_TOKEN = 'boS_BYO322iNLiPFIb8fN-_b2HA29Zo7uyJrCaZs'
const ACCOUNT_ID = 'ab54ca2d01df4886aa0c3f240ace806d'
const BUCKET_NAME = 'boopul'

async function createR2Token() {
  console.log('🔑 Creating R2 API Token...\n')

  try {
    // First, let's verify the token works
    console.log('1. Verifying Cloudflare API token...')
    const verifyResponse = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!verifyResponse.ok) {
      throw new Error(`Token verification failed: ${verifyResponse.statusText}`)
    }

    const verifyData = await verifyResponse.json()
    console.log('✅ Token verified successfully')
    console.log(`   User: ${verifyData.result.id}`)

    // Create R2 API token
    console.log('\n2. Creating R2 API token...')
    
    const tokenPayload = {
      name: 'blog-r2-access',
      policies: [
        {
          effect: 'allow',
          resources: {
            [`com.cloudflare.edge.r2.bucket.${ACCOUNT_ID}_default_${BUCKET_NAME}`]: '*'
          },
          permission_groups: [
            {
              id: 'c8fed203ed3043cba015a93ad1616f1f', // Workers R2 Storage Bucket Item Write
              name: 'Workers R2 Storage Bucket Item Write'
            }
          ]
        }
      ]
    }

    const createResponse = await fetch('https://api.cloudflare.com/client/v4/user/tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tokenPayload)
    })

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      throw new Error(`Failed to create R2 token: ${JSON.stringify(errorData, null, 2)}`)
    }

    const createData = await createResponse.json()
    
    if (createData.success) {
      console.log('✅ R2 API token created successfully!')
      console.log('\n📋 Your R2 Credentials:')
      console.log(`Access Key ID: ${createData.result.id}`)
      console.log(`Secret Access Key: ${createData.result.value}`)
      
      console.log('\n🔧 Add these to your .env.local file:')
      console.log(`VITE_CLOUDFLARE_R2_ACCESS_KEY_ID=${createData.result.id}`)
      console.log(`VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY=${createData.result.value}`)
      console.log(`CLOUDFLARE_R2_ACCESS_KEY_ID=${createData.result.id}`)
      console.log(`CLOUDFLARE_R2_SECRET_ACCESS_KEY=${createData.result.value}`)
      
      console.log('\n⚠️  Important: Save these credentials now! The secret key will not be shown again.')
      
    } else {
      throw new Error(`API returned success=false: ${JSON.stringify(createData, null, 2)}`)
    }

  } catch (error) {
    console.error('❌ Error creating R2 token:', error.message)
    
    console.log('\n🔧 Alternative: Manual Creation')
    console.log('1. Go to: https://dash.cloudflare.com/ab54ca2d01df4886aa0c3f240ace806d/r2')
    console.log('2. Look for "Manage R2 API tokens" or "API tokens" button')
    console.log('3. Create a new token with "Object Read & Write" permissions')
    console.log('4. Select your "boopul" bucket')
    console.log('5. Copy the Access Key ID and Secret Access Key')
  }
}

// Run the script
createR2Token()
