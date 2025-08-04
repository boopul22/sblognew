#!/usr/bin/env node

/**
 * Build-time data fetching script for SSG
 * Fetches all data from Supabase and generates static JSON files
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ktxhnxmdbfkswmkikgum.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eGhueG1kYmZrc3dta2lrZ3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjE5OTksImV4cCI6MjA2OTUzNzk5OX0.5uWgEIlaGqHQupdBEsu76kzPDN3vzq4UFEknmKSpmHg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Output directory for static data
const STATIC_DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'static')

class StaticDataBuilder {
  constructor() {
    this.data = {
      posts: [],
      authors: [],
      categories: [],
      tags: [],
      routes: []
    }
  }

  async init() {
    console.log('🚀 Starting static data generation...')
    
    // Ensure output directory exists
    await fs.ensureDir(STATIC_DATA_DIR)
    
    try {
      // Fetch all data in parallel for better performance
      await Promise.all([
        this.fetchPosts(),
        this.fetchAuthors(),
        this.fetchCategories(),
        this.fetchTags()
      ])

      // Generate route manifest
      this.generateRoutes()

      // Write all data files
      await this.writeDataFiles()

      console.log('✅ Static data generation completed successfully!')
      this.printStats()
      
    } catch (error) {
      console.error('❌ Static data generation failed:', error)
      process.exit(1)
    }
  }

  async fetchPosts() {
    console.log('📄 Fetching posts...')
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        author_id,
        published_at,
        status,
        featured_image_url,
        authors:author_id (
          id,
          username,
          display_name
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    // Fetch categories and tags for each post
    for (const post of posts) {
      // Fetch categories
      const { data: categoryData } = await supabase
        .from('post_categories')
        .select(`
          categories (
            id,
            name,
            slug,
            description
          )
        `)
        .eq('post_id', post.id)

      post.categories = categoryData?.map(pc => pc.categories).filter(Boolean) || []

      // Fetch tags
      const { data: tagData } = await supabase
        .from('post_tags')
        .select(`
          tags (
            id,
            name,
            slug,
            description
          )
        `)
        .eq('post_id', post.id)

      post.tags = tagData?.map(pt => pt.tags).filter(Boolean) || []
    }

    this.data.posts = posts
    console.log(`✓ Fetched ${posts.length} posts`)
  }

  async fetchAuthors() {
    console.log('👥 Fetching authors...')
    
    const { data: authors, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        display_name,
        registered_at
      `)
      .order('display_name')

    if (error) {
      throw new Error(`Failed to fetch authors: ${error.message}`)
    }

    // Count posts for each author
    for (const author of authors) {
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact' })
        .eq('author_id', author.id)
        .eq('status', 'published')

      author.post_count = count || 0
    }

    // Filter authors with at least one post
    this.data.authors = authors.filter(author => author.post_count > 0)
    console.log(`✓ Fetched ${this.data.authors.length} authors`)
  }

  async fetchCategories() {
    console.log('📂 Fetching categories...')
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .order('name')

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    // Count posts for each category
    for (const category of categories) {
      const { count } = await supabase
        .from('post_categories')
        .select('post_id', { count: 'exact' })
        .eq('category_id', category.id)

      category.post_count = count || 0
    }

    // Filter categories with at least one post
    this.data.categories = categories.filter(category => category.post_count > 0)
    console.log(`✓ Fetched ${this.data.categories.length} categories`)
  }

  async fetchTags() {
    console.log('🏷️ Fetching tags...')
    
    const { data: tags, error } = await supabase
      .from('tags')
      .select('id, name, slug, description')
      .order('name')

    if (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`)
    }

    // Count posts for each tag
    for (const tag of tags) {
      const { count } = await supabase
        .from('post_tags')
        .select('post_id', { count: 'exact' })
        .eq('tag_id', tag.id)

      tag.post_count = count || 0
    }

    // Filter tags with at least one post
    this.data.tags = tags.filter(tag => tag.post_count > 0)
    console.log(`✓ Fetched ${this.data.tags.length} tags`)
  }

  generateRoutes() {
    console.log('🗺️ Generating route manifest...')
    
    const routes = [
      { path: '/', type: 'home' },
      { path: '/authors', type: 'authors' }
    ]

    // Add post routes
    this.data.posts.forEach(post => {
      routes.push({
        path: `/${post.slug}`,
        type: 'post',
        slug: post.slug,
        id: post.id
      })
    })

    // Add author routes
    this.data.authors.forEach(author => {
      routes.push({
        path: `/author/${author.user_login}`,
        type: 'author',
        username: author.user_login,
        id: author.id
      })
    })

    // Add category routes
    this.data.categories.forEach(category => {
      routes.push({
        path: `/category/${category.slug}`,
        type: 'category',
        slug: category.slug,
        id: category.id
      })
    })

    // Add tag routes
    this.data.tags.forEach(tag => {
      routes.push({
        path: `/tag/${tag.slug}`,
        type: 'tag',
        slug: tag.slug,
        id: tag.id
      })
    })

    this.data.routes = routes
    console.log(`✓ Generated ${routes.length} routes`)
  }

  async writeDataFiles() {
    console.log('💾 Writing data files...')
    
    const files = [
      { name: 'posts.json', data: this.data.posts },
      { name: 'authors.json', data: this.data.authors },
      { name: 'categories.json', data: this.data.categories },
      { name: 'tags.json', data: this.data.tags },
      { name: 'routes.json', data: this.data.routes },
      { name: 'manifest.json', data: {
        generated_at: new Date().toISOString(),
        counts: {
          posts: this.data.posts.length,
          authors: this.data.authors.length,
          categories: this.data.categories.length,
          tags: this.data.tags.length,
          routes: this.data.routes.length
        }
      }}
    ]

    await Promise.all(
      files.map(file => 
        fs.writeJSON(
          path.join(STATIC_DATA_DIR, file.name),
          file.data,
          { spaces: 2 }
        )
      )
    )

    console.log('✓ All data files written successfully')
  }

  printStats() {
    console.log('\n📊 Generation Statistics:')
    console.log(`   Posts: ${this.data.posts.length}`)
    console.log(`   Authors: ${this.data.authors.length}`)
    console.log(`   Categories: ${this.data.categories.length}`)
    console.log(`   Tags: ${this.data.tags.length}`)
    console.log(`   Total Routes: ${this.data.routes.length}`)
    console.log(`   Data Directory: ${STATIC_DATA_DIR}`)
  }
}

// Run the builder
const builder = new StaticDataBuilder()
builder.init()
