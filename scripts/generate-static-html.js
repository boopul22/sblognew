#!/usr/bin/env node

/**
 * Static HTML generator for SSG
 * Generates static HTML files for all routes
 */

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const STATIC_DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'static')
const DIST_DIR = path.join(__dirname, '..', 'dist')
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html')

class StaticHTMLGenerator {
  constructor() {
    this.template = ''
    this.routes = []
    this.posts = []
    this.authors = []
    this.categories = []
    this.tags = []
  }

  async init() {
    console.log('🏗️ Starting static HTML generation...')
    
    try {
      // Load template and data
      await this.loadTemplate()
      await this.loadStaticData()
      
      // Generate HTML files for all routes
      await this.generateAllPages()
      
      console.log('✅ Static HTML generation completed successfully!')
      
    } catch (error) {
      console.error('❌ Static HTML generation failed:', error)
      process.exit(1)
    }
  }

  async loadTemplate() {
    console.log('📄 Loading HTML template...')
    
    if (!await fs.pathExists(TEMPLATE_PATH)) {
      throw new Error(`Template not found at ${TEMPLATE_PATH}. Run 'npm run build' first.`)
    }
    
    this.template = await fs.readFile(TEMPLATE_PATH, 'utf-8')
    console.log('✓ Template loaded')
  }

  async loadStaticData() {
    console.log('📊 Loading static data...')
    
    const dataFiles = ['routes.json', 'posts.json', 'authors.json', 'categories.json', 'tags.json']
    
    for (const file of dataFiles) {
      const filePath = path.join(STATIC_DATA_DIR, file)
      if (await fs.pathExists(filePath)) {
        const data = await fs.readJSON(filePath)
        const key = file.replace('.json', '')
        this[key] = data
      }
    }
    
    console.log(`✓ Loaded data: ${this.routes.length} routes, ${this.posts.length} posts`)
  }

  async generateAllPages() {
    console.log('🔨 Generating static pages...')
    
    let generatedCount = 0
    
    for (const route of this.routes) {
      try {
        await this.generatePage(route)
        generatedCount++
        
        if (generatedCount % 50 === 0) {
          console.log(`   Generated ${generatedCount}/${this.routes.length} pages...`)
        }
      } catch (error) {
        console.error(`Failed to generate page for route ${route.path}:`, error)
      }
    }
    
    console.log(`✓ Generated ${generatedCount} static pages`)
  }

  async generatePage(route) {
    const pageData = this.getPageData(route)
    const html = this.injectPageData(this.template, pageData)
    
    // Determine output path
    let outputPath
    if (route.path === '/') {
      outputPath = path.join(DIST_DIR, 'index.html')
    } else {
      // Create directory structure for clean URLs
      const routePath = route.path.startsWith('/') ? route.path.slice(1) : route.path
      const dirPath = path.join(DIST_DIR, routePath)
      await fs.ensureDir(dirPath)
      outputPath = path.join(dirPath, 'index.html')
    }
    
    await fs.writeFile(outputPath, html, 'utf-8')
  }

  getPageData(route) {
    const baseData = {
      title: 'Sayari Blog - Hindi Shayari, Quotes & Wishes',
      description: 'Discover beautiful Hindi Shayari, inspiring quotes, and heartfelt wishes. Express your emotions with our collection of poetry and thoughts.',
      url: `https://sayari-blog.pages.dev${route.path}`,
      type: 'website',
      image: 'https://sayari-blog.pages.dev/og-image.jpg'
    }

    switch (route.type) {
      case 'post':
        return this.getPostPageData(route, baseData)
      case 'author':
        return this.getAuthorPageData(route, baseData)
      case 'category':
        return this.getCategoryPageData(route, baseData)
      case 'tag':
        return this.getTagPageData(route, baseData)
      case 'authors':
        return {
          ...baseData,
          title: 'Authors - Sayari Blog',
          description: 'Meet our talented authors who create beautiful Hindi Shayari, quotes, and wishes.',
          type: 'website'
        }
      default:
        return baseData
    }
  }

  getPostPageData(route, baseData) {
    const post = this.posts.find(p => p.slug === route.slug)
    if (!post) return baseData

    return {
      ...baseData,
      title: `${post.title} - Sayari Blog`,
      description: post.excerpt || post.title,
      url: `https://sayari-blog.pages.dev/${post.slug}`,
      type: 'article',
      image: post.featured_image_url || baseData.image,
      publishedTime: post.published_at,
      author: post.authors?.display_name || 'Sayari Blog',
      tags: post.tags?.map(tag => tag.name).join(', ') || ''
    }
  }

  getAuthorPageData(route, baseData) {
    const author = this.authors.find(a => a.user_login === route.username)
    if (!author) return baseData

    const authorPosts = this.posts.filter(p => p.author_id === author.id)

    return {
      ...baseData,
      title: `${author.display_name} - Author at Sayari Blog`,
      description: `Read all posts by ${author.display_name}. ${authorPosts.length} posts about Hindi Shayari, quotes, and wishes.`,
      url: `https://sayari-blog.pages.dev/author/${author.user_login}`,
      type: 'profile'
    }
  }

  getCategoryPageData(route, baseData) {
    const category = this.categories.find(c => c.slug === route.slug)
    if (!category) return baseData

    return {
      ...baseData,
      title: `${category.name} - Category at Sayari Blog`,
      description: category.description || `Browse all posts in ${category.name} category.`,
      url: `https://sayari-blog.pages.dev/category/${category.slug}`,
      type: 'website'
    }
  }

  getTagPageData(route, baseData) {
    const tag = this.tags.find(t => t.slug === route.slug)
    if (!tag) return baseData

    return {
      ...baseData,
      title: `${tag.name} - Tag at Sayari Blog`,
      description: tag.description || `Browse all posts tagged with ${tag.name}.`,
      url: `https://sayari-blog.pages.dev/tag/${tag.slug}`,
      type: 'website'
    }
  }

  injectPageData(template, pageData) {
    let html = template

    // Replace meta tags
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${this.escapeHtml(pageData.title)}</title>`
    )

    // Inject meta tags in head
    const metaTags = this.generateMetaTags(pageData)
    html = html.replace(
      '</head>',
      `${metaTags}\n</head>`
    )

    // Inject structured data
    const structuredData = this.generateStructuredData(pageData)
    html = html.replace(
      '</head>',
      `${structuredData}\n</head>`
    )

    return html
  }

  generateMetaTags(pageData) {
    return `
    <!-- SEO Meta Tags -->
    <meta name="description" content="${this.escapeHtml(pageData.description)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${pageData.url}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${this.escapeHtml(pageData.title)}">
    <meta property="og:description" content="${this.escapeHtml(pageData.description)}">
    <meta property="og:url" content="${pageData.url}">
    <meta property="og:type" content="${pageData.type}">
    <meta property="og:image" content="${pageData.image}">
    <meta property="og:site_name" content="Sayari Blog">
    ${pageData.publishedTime ? `<meta property="article:published_time" content="${pageData.publishedTime}">` : ''}
    ${pageData.author ? `<meta property="article:author" content="${this.escapeHtml(pageData.author)}">` : ''}
    ${pageData.tags ? `<meta property="article:tag" content="${this.escapeHtml(pageData.tags)}">` : ''}
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${this.escapeHtml(pageData.title)}">
    <meta name="twitter:description" content="${this.escapeHtml(pageData.description)}">
    <meta name="twitter:image" content="${pageData.image}">
    `
  }

  generateStructuredData(pageData) {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sayari Blog",
      "url": "https://sayari-blog.pages.dev",
      "description": "Hindi Shayari, Quotes & Wishes",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sayari-blog.pages.dev/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }

    if (pageData.type === 'article') {
      const post = this.posts.find(p => p.title === pageData.title.replace(' - Sayari Blog', ''))
      if (post) {
        const articleData = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt || post.title,
          "url": pageData.url,
          "datePublished": post.published_at,
          "author": {
            "@type": "Person",
            "name": post.authors?.display_name || "Sayari Blog"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Sayari Blog",
            "url": "https://sayari-blog.pages.dev"
          }
        }
        
        return `<script type="application/ld+json">${JSON.stringify([baseStructuredData, articleData])}</script>`
      }
    }

    return `<script type="application/ld+json">${JSON.stringify(baseStructuredData)}</script>`
  }

  escapeHtml(text) {
    if (!text) return ''
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}

// Run the generator
const generator = new StaticHTMLGenerator()
generator.init()
