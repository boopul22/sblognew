#!/usr/bin/env node

/**
 * Supabase Posts Data Extraction Script
 * 
 * This script extracts data from the Supabase database and creates a CSV file with:
 * - Post ID
 * - Post Title
 * - Number of images used in the post
 * - Main keyword/primary keyword
 * - Total number of posts (summary)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service key for full access
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Count images in HTML content
 * @param {string} content - HTML content
 * @returns {number} - Number of images found
 */
function countImagesInContent(content) {
  if (!content) return 0;
  
  // Count img tags in the content
  const imgTagMatches = content.match(/<img[^>]*>/gi);
  const imgTagCount = imgTagMatches ? imgTagMatches.length : 0;
  
  // Also count images referenced in other formats (like figure tags with images)
  const figureImgMatches = content.match(/<figure[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/figure>/gi);
  const figureImgCount = figureImgMatches ? figureImgMatches.length : 0;
  
  // Count WordPress image blocks
  const wpImageMatches = content.match(/wp-block-image/gi);
  const wpImageCount = wpImageMatches ? wpImageMatches.length : 0;
  
  // Return the maximum count to avoid double counting
  return Math.max(imgTagCount, figureImgCount, wpImageCount);
}

/**
 * Extract primary keyword from various sources
 * @param {Object} post - Post object
 * @param {Array} postTags - Array of tags for the post
 * @returns {string} - Primary keyword
 */
function extractPrimaryKeyword(post, postTags) {
  // Priority 1: Meta title (often contains primary keyword)
  if (post.meta_title) {
    return post.meta_title.split(' ').slice(0, 3).join(' '); // First 3 words
  }
  
  // Priority 2: First tag (usually the most relevant)
  if (postTags && postTags.length > 0) {
    return postTags[0].name;
  }
  
  // Priority 3: Extract from title (remove common words)
  if (post.title) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'best', 'top', 'new', 'latest'];
    const titleWords = post.title.toLowerCase().split(' ').filter(word => 
      word.length > 2 && !commonWords.includes(word)
    );
    return titleWords.slice(0, 2).join(' '); // First 2 meaningful words
  }
  
  return 'No keyword found';
}

/**
 * Main function to extract data and generate CSV
 */
async function extractPostsData() {
  try {
    console.log('🚀 Starting Supabase posts data extraction...');
    
    // Get all posts with basic information
    console.log('📊 Fetching posts data...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, content, meta_title, meta_description, featured_image_url, created_at, status')
      .order('created_at', { ascending: false });
    
    if (postsError) {
      throw new Error(`Error fetching posts: ${postsError.message}`);
    }
    
    console.log(`✅ Found ${posts.length} posts`);
    
    // Get all post-tag relationships
    console.log('🏷️ Fetching tags data...');
    const { data: postTagsData, error: tagsError } = await supabase
      .from('post_tags')
      .select(`
        post_id,
        tags (
          id,
          name,
          slug
        )
      `);
    
    if (tagsError) {
      console.warn(`⚠️ Warning: Could not fetch tags: ${tagsError.message}`);
    }
    
    // Create a map of post_id to tags
    const postTagsMap = {};
    if (postTagsData) {
      postTagsData.forEach(item => {
        if (!postTagsMap[item.post_id]) {
          postTagsMap[item.post_id] = [];
        }
        if (item.tags) {
          postTagsMap[item.post_id].push(item.tags);
        }
      });
    }
    
    // Process each post
    console.log('🔄 Processing posts data...');
    const processedData = [];
    let totalImages = 0;
    
    for (const post of posts) {
      const imageCount = countImagesInContent(post.content);
      const postTags = postTagsMap[post.id] || [];
      const primaryKeyword = extractPrimaryKeyword(post, postTags);
      
      processedData.push({
        postId: post.id,
        postTitle: post.title || 'Untitled',
        imageCount: imageCount,
        primaryKeyword: primaryKeyword,
        status: post.status,
        createdAt: post.created_at,
        featuredImage: post.featured_image_url ? 'Yes' : 'No'
      });
      
      totalImages += imageCount;
    }
    
    // Generate CSV content
    console.log('📝 Generating CSV file...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `supabase_posts_analysis_${timestamp}.csv`;
    const filepath = path.join(process.cwd(), filename);
    
    // CSV Headers
    const headers = [
      'Post ID',
      'Post Title',
      'Number of Images',
      'Primary Keyword',
      'Status',
      'Created Date',
      'Has Featured Image'
    ];
    
    // CSV Content
    let csvContent = headers.join(',') + '\n';
    
    processedData.forEach(row => {
      const csvRow = [
        `"${row.postId}"`,
        `"${row.postTitle.replace(/"/g, '""')}"`, // Escape quotes in title
        row.imageCount,
        `"${row.primaryKeyword.replace(/"/g, '""')}"`, // Escape quotes in keyword
        `"${row.status}"`,
        `"${row.createdAt}"`,
        `"${row.featuredImage}"`
      ];
      csvContent += csvRow.join(',') + '\n';
    });
    
    // Add summary row
    csvContent += '\n';
    csvContent += `"SUMMARY","Total Posts: ${posts.length}","Total Images: ${totalImages}","Average Images per Post: ${(totalImages / posts.length).toFixed(2)}","","",""\n`;
    
    // Write CSV file
    fs.writeFileSync(filepath, csvContent, 'utf8');
    
    // Generate summary report
    console.log('\n📊 EXTRACTION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Total posts processed: ${posts.length}`);
    console.log(`🖼️ Total images found: ${totalImages}`);
    console.log(`📊 Average images per post: ${(totalImages / posts.length).toFixed(2)}`);
    console.log(`📁 CSV file saved: ${filename}`);
    console.log(`📍 File location: ${filepath}`);
    
    // Show top keywords
    const keywordCounts = {};
    processedData.forEach(post => {
      const keyword = post.primaryKeyword.toLowerCase();
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
    
    const topKeywords = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    console.log('\n🔝 TOP 10 KEYWORDS:');
    topKeywords.forEach(([keyword, count], index) => {
      console.log(`${index + 1}. ${keyword} (${count} posts)`);
    });
    
    console.log('\n✨ Data extraction completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during data extraction:', error.message);
    process.exit(1);
  }
}

// Run the extraction
if (require.main === module) {
  extractPostsData();
}

module.exports = { extractPostsData, countImagesInContent, extractPrimaryKeyword };
