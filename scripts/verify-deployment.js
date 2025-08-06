#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the build artifacts are ready for deployment
 */

import { existsSync, statSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 Verifying deployment readiness...\n')

// Check required files and directories
const requiredPaths = [
  'dist/index.html',
  'dist/assets',
  'src/data/static',
  'package.json',
  'vercel.json'
]

let allChecksPass = true

console.log('📁 Checking required files and directories:')
for (const path of requiredPaths) {
  const fullPath = join(projectRoot, path)
  const exists = existsSync(fullPath)
  const status = exists ? '✅' : '❌'
  console.log(`   ${status} ${path}`)
  
  if (!exists) {
    allChecksPass = false
  }
}

// Check build artifacts
console.log('\n🏗️ Checking build artifacts:')
const distPath = join(projectRoot, 'dist')
if (existsSync(distPath)) {
  const stats = statSync(distPath)
  console.log(`   ✅ dist/ directory exists (modified: ${stats.mtime.toISOString()})`)
  
  // Check for essential assets
  const assetsPath = join(distPath, 'assets')
  if (existsSync(assetsPath)) {
    console.log('   ✅ Assets directory exists')
  } else {
    console.log('   ❌ Assets directory missing')
    allChecksPass = false
  }
} else {
  console.log('   ❌ dist/ directory missing - run npm run build')
  allChecksPass = false
}

// Check static data
console.log('\n📊 Checking static data:')
const staticDataPath = join(projectRoot, 'src/data/static')
if (existsSync(staticDataPath)) {
  const postsFile = join(staticDataPath, 'posts.json')
  const authorsFile = join(staticDataPath, 'authors.json')
  const routesFile = join(staticDataPath, 'routes.json')
  
  if (existsSync(postsFile)) {
    const posts = JSON.parse(readFileSync(postsFile, 'utf8'))
    console.log(`   ✅ Posts data: ${posts.length} posts`)
  } else {
    console.log('   ❌ Posts data missing')
    allChecksPass = false
  }
  
  if (existsSync(authorsFile)) {
    const authors = JSON.parse(readFileSync(authorsFile, 'utf8'))
    console.log(`   ✅ Authors data: ${authors.length} authors`)
  } else {
    console.log('   ❌ Authors data missing')
    allChecksPass = false
  }
  
  if (existsSync(routesFile)) {
    const routes = JSON.parse(readFileSync(routesFile, 'utf8'))
    console.log(`   ✅ Routes data: ${routes.length} routes`)
  } else {
    console.log('   ❌ Routes data missing')
    allChecksPass = false
  }
} else {
  console.log('   ❌ Static data directory missing - run npm run build:data')
  allChecksPass = false
}

// Check package.json for deployment-ready scripts
console.log('\n📦 Checking package.json configuration:')
const packageJsonPath = join(projectRoot, 'package.json')
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  
  // Check for required scripts
  const requiredScripts = ['build', 'build:vercel']
  for (const script of requiredScripts) {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✅ Script "${script}" exists`)
    } else {
      console.log(`   ❌ Script "${script}" missing`)
      allChecksPass = false
    }
  }
  
  // Check for CI-friendly prepare script
  if (packageJson.scripts && packageJson.scripts.prepare) {
    const prepareScript = packageJson.scripts.prepare
    if (prepareScript.includes('is-ci') || prepareScript.includes('|| true')) {
      console.log('   ✅ Prepare script is CI-friendly')
    } else {
      console.log('   ⚠️  Prepare script may cause CI issues')
    }
  }
} else {
  console.log('   ❌ package.json missing')
  allChecksPass = false
}

// Check environment variables
console.log('\n🔧 Checking environment configuration:')
const envExamplePath = join(projectRoot, '.env.example')
if (existsSync(envExamplePath)) {
  console.log('   ✅ .env.example exists for reference')
} else {
  console.log('   ⚠️  .env.example missing - consider adding for documentation')
}

// Final result
console.log('\n' + '='.repeat(50))
if (allChecksPass) {
  console.log('🎉 All deployment checks passed!')
  console.log('✅ Ready for deployment to Vercel')
  console.log('\nNext steps:')
  console.log('1. Commit your changes: git add . && git commit -m "Deploy optimizations"')
  console.log('2. Push to repository: git push')
  console.log('3. Vercel will automatically deploy')
  process.exit(0)
} else {
  console.log('❌ Some deployment checks failed!')
  console.log('Please fix the issues above before deploying.')
  console.log('\nCommon fixes:')
  console.log('- Run: npm run build')
  console.log('- Check your .env.local file')
  console.log('- Ensure all required dependencies are installed')
  process.exit(1)
}
