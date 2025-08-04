#!/usr/bin/env node

/**
 * Development API Server
 * Runs the Cloudflare Pages Functions locally for development
 */

import { createServer } from 'http'
import { parse } from 'url'
import dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const PORT = 3001

// Import API handlers
const apiHandlers = new Map()

// Helper function to load API handler
async function loadApiHandler(path) {
  try {
    const handlerPath = join(projectRoot, 'api', path + '.js')
    const module = await import(handlerPath)
    return module.default
  } catch (error) {
    console.error(`Failed to load API handler for ${path}:`, error.message)
    return null
  }
}

// Initialize API handlers
async function initializeHandlers() {
  const handlers = [
    'r2/presigned-upload',
    'r2/delete',
    'r2/list',
    'r2/metadata',
    'r2/health',
    'download-image'
  ]

  for (const path of handlers) {
    const handler = await loadApiHandler(path)
    if (handler) {
      apiHandlers.set(`/api/${path}`, handler)
      console.log(`✅ Loaded handler: /api/${path}`)
    }
  }
}

// Mock request/response objects for compatibility
function createMockReq(req) {
  const url = parse(req.url, true)
  
  return {
    method: req.method,
    url: req.url,
    query: url.query,
    body: null, // Will be populated for POST requests
    headers: req.headers
  }
}

function createMockRes(res) {
  return {
    status: (code) => {
      res.statusCode = code
      return {
        json: (data) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }
      }
    },
    json: (data) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    }
  }
}

// Parse request body
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        if (body && req.headers['content-type']?.includes('application/json')) {
          resolve(JSON.parse(body))
        } else {
          resolve(body)
        }
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

// Create HTTP server
const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  const url = parse(req.url, true)
  const pathname = url.pathname

  console.log(`${req.method} ${pathname}`)

  // Check if we have a handler for this path
  const handler = apiHandlers.get(pathname)
  
  if (handler) {
    try {
      // Parse request body for POST/PUT requests
      const mockReq = createMockReq(req)
      if (req.method === 'POST' || req.method === 'PUT') {
        mockReq.body = await parseBody(req)
      }

      const mockRes = createMockRes(res)

      // Call the handler
      const result = await handler(mockReq, mockRes)

      // Handle binary responses (for file downloads)
      if (result && result.type === 'binary') {
        // Set headers
        for (const [key, value] of Object.entries(result.headers)) {
          res.setHeader(key, value)
        }

        // Send binary data
        res.end(result.data)
      }

    } catch (error) {
      console.error(`Error handling ${pathname}:`, error)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }))
    }
  } else {
    // 404 for unknown paths
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      success: false,
      error: 'API endpoint not found'
    }))
  }
})

// Start server
async function startServer() {
  console.log('🚀 Starting development API server...')
  console.log('=' .repeat(50))
  
  // Initialize handlers
  await initializeHandlers()
  
  server.listen(PORT, () => {
    console.log(`\n✅ Development API server running on http://localhost:${PORT}`)
    console.log(`📡 Available endpoints:`)
    for (const path of apiHandlers.keys()) {
      console.log(`   ${path}`)
    }
    console.log('\n🔧 Environment variables loaded from .env.local')
    console.log('🌐 CORS enabled for all origins')
    console.log('\n💡 Use Ctrl+C to stop the server')
  })
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development API server...')
  server.close(() => {
    console.log('✅ Server stopped')
    process.exit(0)
  })
})

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start development API server:', error)
  process.exit(1)
})
