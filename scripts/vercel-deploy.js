#!/usr/bin/env node

/**
 * Vercel Deployment Helper Script
 * 
 * This script helps prepare and deploy the Sayari Blog to Vercel
 * by checking prerequisites and guiding through the deployment process.
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFile(filePath, description) {
  const exists = existsSync(filePath)
  log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`, exists ? 'green' : 'red')
  return exists
}

function runCommand(command, description) {
  try {
    log(`🔄 ${description}...`, 'blue')
    execSync(command, { stdio: 'inherit' })
    log(`✅ ${description} completed`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red')
    return false
  }
}

function checkEnvironmentVariables() {
  log('\n📋 Checking Environment Variables...', 'cyan')
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  const optionalVars = [
    'VITE_STORAGE_PROVIDER',
    'VITE_CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY'
  ]
  
  log('\nRequired variables (must be set in Vercel):', 'yellow')
  requiredVars.forEach(varName => {
    log(`  - ${varName}`, 'yellow')
  })
  
  log('\nOptional variables (for R2 storage):', 'yellow')
  optionalVars.forEach(varName => {
    log(`  - ${varName}`, 'yellow')
  })
  
  log('\n💡 Set these in Vercel Dashboard → Settings → Environment Variables', 'blue')
}

function main() {
  log('🚀 Vercel Deployment Helper for Sayari Blog', 'bright')
  log('=' .repeat(50), 'cyan')
  
  // Check prerequisites
  log('\n🔍 Checking Prerequisites...', 'cyan')
  
  const checks = [
    checkFile('package.json', 'Package configuration'),
    checkFile('vercel.json', 'Vercel configuration'),
    checkFile('.vercelignore', 'Vercel ignore file'),
    checkFile('vite.config.js', 'Vite configuration'),
    checkFile('src/main.jsx', 'Main application file'),
    checkFile('api/r2/health.js', 'API health endpoint')
  ]
  
  const allChecksPass = checks.every(check => check)
  
  if (!allChecksPass) {
    log('\n❌ Some prerequisites are missing. Please fix the issues above.', 'red')
    process.exit(1)
  }
  
  log('\n✅ All prerequisites met!', 'green')
  
  // Check package.json scripts
  log('\n📦 Checking Build Scripts...', 'cyan')
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const hasVercelScript = packageJson.scripts && packageJson.scripts['build:vercel']
    
    if (hasVercelScript) {
      log('✅ build:vercel script found', 'green')
    } else {
      log('❌ build:vercel script missing', 'red')
      log('💡 Add this to package.json scripts: "build:vercel": "vite build"', 'blue')
    }
  } catch (error) {
    log('❌ Could not read package.json', 'red')
  }
  
  // Test build
  log('\n🔨 Testing Build Process...', 'cyan')
  const buildSuccess = runCommand('npm run build:vercel', 'Building for production')
  
  if (!buildSuccess) {
    log('\n❌ Build failed. Please fix build errors before deploying.', 'red')
    process.exit(1)
  }
  
  // Check build output
  log('\n📁 Checking Build Output...', 'cyan')
  const distExists = checkFile('dist/index.html', 'Build output')
  const assetsExist = checkFile('dist/assets', 'Asset files')
  
  if (!distExists || !assetsExist) {
    log('❌ Build output incomplete', 'red')
    process.exit(1)
  }
  
  // Environment variables check
  checkEnvironmentVariables()
  
  // Deployment instructions
  log('\n🚀 Ready for Deployment!', 'green')
  log('=' .repeat(30), 'green')
  
  log('\nNext Steps:', 'bright')
  log('1. Commit and push your changes:', 'yellow')
  log('   git add .', 'cyan')
  log('   git commit -m "Configure for Vercel deployment"', 'cyan')
  log('   git push origin main', 'cyan')
  
  log('\n2. Deploy to Vercel:', 'yellow')
  log('   Option A - Vercel CLI:', 'blue')
  log('     npm i -g vercel', 'cyan')
  log('     vercel login', 'cyan')
  log('     vercel --prod', 'cyan')
  
  log('   Option B - Vercel Dashboard:', 'blue')
  log('     • Go to vercel.com', 'cyan')
  log('     • Click "New Project"', 'cyan')
  log('     • Import your Git repository', 'cyan')
  log('     • Add environment variables', 'cyan')
  log('     • Deploy', 'cyan')
  
  log('\n3. Configure Environment Variables in Vercel Dashboard', 'yellow')
  log('   See .env.vercel.example for required variables', 'cyan')
  
  log('\n4. Verify Deployment', 'yellow')
  log('   Use VERCEL_CHECKLIST.md for post-deployment verification', 'cyan')
  
  log('\n📚 Documentation:', 'bright')
  log('   • VERCEL_DEPLOYMENT.md - Complete deployment guide', 'cyan')
  log('   • VERCEL_CHECKLIST.md - Deployment checklist', 'cyan')
  log('   • .env.vercel.example - Environment variables template', 'cyan')
  
  log('\n🎉 Good luck with your deployment!', 'green')
}

// Run the script
main()
