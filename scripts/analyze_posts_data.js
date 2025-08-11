#!/usr/bin/env node

/**
 * Advanced Posts Data Analysis Script
 * 
 * This script provides detailed analysis of the extracted posts data
 */

const fs = require('fs');
const path = require('path');

/**
 * Analyze the CSV data and provide insights
 */
function analyzePostsData() {
  try {
    // Find the most recent CSV file
    const files = fs.readdirSync(process.cwd());
    const csvFiles = files.filter(file => file.startsWith('supabase_posts_analysis_') && file.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      console.error('❌ No CSV file found. Please run the extraction script first.');
      return;
    }
    
    // Get the most recent file
    const csvFile = csvFiles.sort().reverse()[0];
    const csvPath = path.join(process.cwd(), csvFile);
    
    console.log(`📊 Analyzing data from: ${csvFile}`);
    console.log('='.repeat(60));
    
    // Read and parse CSV
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    // Parse data rows (excluding header and summary)
    const dataRows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('SUMMARY') || !line.trim()) continue;
      
      // Simple CSV parsing (handles quoted fields)
      const row = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      row.push(current.trim());
      
      if (row.length >= 6) {
        dataRows.push({
          postId: row[0].replace(/"/g, ''),
          title: row[1].replace(/"/g, ''),
          imageCount: parseInt(row[2]) || 0,
          keyword: row[3].replace(/"/g, ''),
          status: row[4].replace(/"/g, ''),
          createdDate: row[5].replace(/"/g, ''),
          hasFeaturedImage: row[6].replace(/"/g, '') === 'Yes'
        });
      }
    }
    
    console.log(`\n📈 DETAILED ANALYSIS`);
    console.log('='.repeat(40));
    
    // Basic statistics
    const totalPosts = dataRows.length;
    const totalImages = dataRows.reduce((sum, post) => sum + post.imageCount, 0);
    const avgImages = (totalImages / totalPosts).toFixed(2);
    
    console.log(`📝 Total Posts: ${totalPosts}`);
    console.log(`🖼️ Total Images: ${totalImages}`);
    console.log(`📊 Average Images per Post: ${avgImages}`);
    
    // Status distribution
    const statusCounts = {};
    dataRows.forEach(post => {
      statusCounts[post.status] = (statusCounts[post.status] || 0) + 1;
    });
    
    console.log(`\n📋 POST STATUS DISTRIBUTION:`);
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = ((count / totalPosts) * 100).toFixed(1);
      console.log(`   ${status}: ${count} posts (${percentage}%)`);
    });
    
    // Image analysis
    const postsWithImages = dataRows.filter(post => post.imageCount > 0);
    const postsWithoutImages = dataRows.filter(post => post.imageCount === 0);
    const postsWithFeaturedImage = dataRows.filter(post => post.hasFeaturedImage);
    
    console.log(`\n🖼️ IMAGE ANALYSIS:`);
    console.log(`   Posts with images: ${postsWithImages.length} (${((postsWithImages.length / totalPosts) * 100).toFixed(1)}%)`);
    console.log(`   Posts without images: ${postsWithoutImages.length} (${((postsWithoutImages.length / totalPosts) * 100).toFixed(1)}%)`);
    console.log(`   Posts with featured image: ${postsWithFeaturedImage.length} (${((postsWithFeaturedImage.length / totalPosts) * 100).toFixed(1)}%)`);
    
    // Top posts by image count
    const topImagePosts = dataRows
      .filter(post => post.imageCount > 0)
      .sort((a, b) => b.imageCount - a.imageCount)
      .slice(0, 10);
    
    console.log(`\n🏆 TOP 10 POSTS BY IMAGE COUNT:`);
    topImagePosts.forEach((post, index) => {
      const title = post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title;
      console.log(`   ${index + 1}. ${title} (${post.imageCount} images)`);
    });
    
    // Keyword analysis
    const keywordCounts = {};
    dataRows.forEach(post => {
      if (post.keyword && post.keyword.trim()) {
        const keyword = post.keyword.toLowerCase().trim();
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      }
    });
    
    const topKeywords = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15);
    
    console.log(`\n🔑 TOP 15 KEYWORDS:`);
    topKeywords.forEach(([keyword, count], index) => {
      console.log(`   ${index + 1}. "${keyword}" (${count} posts)`);
    });
    
    // Monthly posting analysis
    const monthlyPosts = {};
    dataRows.forEach(post => {
      try {
        const date = new Date(post.createdDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyPosts[monthKey] = (monthlyPosts[monthKey] || 0) + 1;
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    const sortedMonths = Object.entries(monthlyPosts)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 12);
    
    console.log(`\n📅 MONTHLY POSTING ACTIVITY (Last 12 months):`);
    sortedMonths.forEach(([month, count]) => {
      console.log(`   ${month}: ${count} posts`);
    });
    
    // Content quality insights
    const postsWithKeywords = dataRows.filter(post => post.keyword && post.keyword.trim() && post.keyword !== 'No keyword found');
    const avgImagesForPublished = dataRows
      .filter(post => post.status === 'published')
      .reduce((sum, post, _, arr) => sum + post.imageCount / arr.length, 0);
    
    console.log(`\n💡 CONTENT QUALITY INSIGHTS:`);
    console.log(`   Posts with identifiable keywords: ${postsWithKeywords.length} (${((postsWithKeywords.length / totalPosts) * 100).toFixed(1)}%)`);
    console.log(`   Average images in published posts: ${avgImagesForPublished.toFixed(2)}`);
    
    // Recommendations
    console.log(`\n🎯 RECOMMENDATIONS:`);
    if (postsWithoutImages.length > totalPosts * 0.2) {
      console.log(`   ⚠️ ${postsWithoutImages.length} posts have no images - consider adding visual content`);
    }
    if (statusCounts.private > statusCounts.published) {
      console.log(`   📝 You have more private posts (${statusCounts.private}) than published (${statusCounts.published || 0}) - consider publishing quality content`);
    }
    if (postsWithKeywords.length < totalPosts * 0.8) {
      console.log(`   🔍 Consider improving SEO by adding better keywords/tags to posts`);
    }
    
    console.log(`\n✨ Analysis completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  }
}

// Run the analysis
if (require.main === module) {
  analyzePostsData();
}

module.exports = { analyzePostsData };
