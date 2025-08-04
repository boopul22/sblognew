#!/usr/bin/env node

/**
 * Interactive R2 Credentials Setup Script
 * Helps you configure Cloudflare R2 credentials in your environment files
 */

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🔧 Cloudflare R2 Credentials Setup')
console.log('=' .repeat(50))

console.log(`
📋 Before running this script, you need to get your Cloudflare R2 credentials:

1. 🌐 Go to Cloudflare Dashboard: https://dash.cloudflare.com
2. 📋 Copy your Account ID from the right sidebar
3. 🗄️  Go to R2 Object Storage
4. 🔑 Click "Manage R2 API Tokens"
5. ➕ Click "Create API Token"
6. ⚙️  Configure:
   - Token name: blog-website-r2-access
   - Permissions: Object Read & Write
   - Account resources: All accounts (or your specific account)
7. 💾 Save the Access Key ID and Secret Access Key

`)

// Function to update environment file
async function updateEnvFile(filePath, credentials) {
  try {
    if (!await fs.pathExists(filePath)) {
      console.log(`⚠️  File ${filePath} does not exist, skipping...`)
      return false
    }

    let content = await fs.readFile(filePath, 'utf8')
    
    // Replace the credential placeholders
    content = content.replace(/CLOUDFLARE_ACCOUNT_ID=.*/, `CLOUDFLARE_ACCOUNT_ID=${credentials.accountId}`)
    content = content.replace(/CLOUDFLARE_R2_ACCESS_KEY_ID=.*/, `CLOUDFLARE_R2_ACCESS_KEY_ID=${credentials.accessKeyId}`)
    content = content.replace(/CLOUDFLARE_R2_SECRET_ACCESS_KEY=.*/, `CLOUDFLARE_R2_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`)
    
    // Update the URLs with the actual account ID
    content = content.replace(/CLOUDFLARE_R2_PUBLIC_URL=.*/, `CLOUDFLARE_R2_PUBLIC_URL=https://pub-${credentials.accountId}.r2.dev/blog-images`)
    content = content.replace(/CLOUDFLARE_R2_ENDPOINT=.*/, `CLOUDFLARE_R2_ENDPOINT=https://${credentials.accountId}.r2.cloudflarestorage.com`)
    
    await fs.writeFile(filePath, content)
    console.log(`✅ Updated ${path.relative(rootDir, filePath)}`)
    return true
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message)
    return false
  }
}

// Function to validate credentials format
function validateCredentials(credentials) {
  const errors = []
  
  if (!credentials.accountId || credentials.accountId.length < 10) {
    errors.push('Account ID should be a long alphanumeric string')
  }
  
  if (!credentials.accessKeyId || credentials.accessKeyId.length < 10) {
    errors.push('Access Key ID should be a long alphanumeric string')
  }
  
  if (!credentials.secretAccessKey || credentials.secretAccessKey.length < 20) {
    errors.push('Secret Access Key should be a long alphanumeric string')
  }
  
  return errors
}

// Function to prompt for credentials (mock implementation)
function getCredentialsFromUser() {
  console.log('🔍 Looking for credentials in environment variables...')
  
  // Check if credentials are already set in environment
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  
  if (accountId && accessKeyId && secretAccessKey && 
      !accountId.includes('your_') && !accessKeyId.includes('your_') && !secretAccessKey.includes('your_')) {
    console.log('✅ Found credentials in environment variables!')
    return { accountId, accessKeyId, secretAccessKey }
  }
  
  console.log(`
⚠️  Credentials not found in environment variables.

To set up your credentials:

1. 📝 Edit your .env.local file manually with your actual credentials:
   
   CLOUDFLARE_ACCOUNT_ID=your_actual_account_id
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_actual_access_key
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_actual_secret_key

2. 🔄 Run this script again: npm run setup:r2

3. 🧪 Test your setup: npm run test:r2

📖 For detailed instructions, see CLOUDFLARE_R2_SETUP.md
`)
  
  return null
}

// Main setup function
async function setupCredentials() {
  console.log('🚀 Starting R2 credentials setup...\n')
  
  const credentials = getCredentialsFromUser()
  
  if (!credentials) {
    console.log('❌ Setup incomplete. Please add your credentials and try again.')
    return false
  }
  
  // Validate credentials
  const errors = validateCredentials(credentials)
  if (errors.length > 0) {
    console.log('❌ Credential validation errors:')
    errors.forEach(error => console.log(`   - ${error}`))
    return false
  }
  
  console.log('✅ Credentials validated successfully!')
  console.log(`📋 Account ID: ${credentials.accountId}`)
  console.log(`🔑 Access Key: ${credentials.accessKeyId.substring(0, 8)}...`)
  console.log(`🔐 Secret Key: ${credentials.secretAccessKey.substring(0, 8)}...\n`)
  
  // Update environment files
  const envFiles = [
    path.join(rootDir, '.env'),
    path.join(rootDir, '.env.local'),
    path.join(rootDir, 'migration', '.env')
  ]
  
  let updated = 0
  for (const envFile of envFiles) {
    if (await updateEnvFile(envFile, credentials)) {
      updated++
    }
  }
  
  console.log(`\n📊 Updated ${updated} environment files`)
  
  if (updated > 0) {
    console.log(`
🎉 R2 credentials setup complete!

✅ Your environment files have been updated with:
   - Account ID: ${credentials.accountId}
   - R2 Access Key ID: ${credentials.accessKeyId.substring(0, 8)}...
   - R2 Secret Access Key: ${credentials.secretAccessKey.substring(0, 8)}...
   - Bucket Name: blog-images
   - Public URL: https://pub-${credentials.accountId}.r2.dev/blog-images
   - Endpoint: https://${credentials.accountId}.r2.cloudflarestorage.com

🧪 Next steps:
1. Test your R2 connection: npm run test:r2
2. Start your development server: npm run dev
3. Try uploading an image in the admin panel

📖 For troubleshooting, see CLOUDFLARE_R2_SETUP.md
`)
    return true
  } else {
    console.log('❌ No environment files were updated. Please check the file paths.')
    return false
  }
}

// Run the setup
setupCredentials()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Setup script error:', error)
    process.exit(1)
  })
