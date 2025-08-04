#!/usr/bin/env node

/**
 * Website Integration Test Script
 * 
 * This script tests the website functionality with the migrated Supabase data
 * to ensure everything is working correctly.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

class WebsiteIntegrationTest {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Missing Supabase configuration. Check your .env file.');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting Website Integration Tests');
    console.log('=' .repeat(60));
    
    try {
      // Test data fetching functionality
      await this.testPostsFetching();
      await this.testCategoriesFetching();
      await this.testTagsFetching();
      await this.testUsersFetching();
      
      // Test relationships
      await this.testPostCategoryRelationships();
      await this.testPostTagRelationships();
      
      // Test specific post functionality
      await this.testSinglePostFetching();
      await this.testPostsByCategory();
      await this.testPostsByAuthor();
      
      // Test search functionality
      await this.testSearchFunctionality();
      
      // Test pagination
      await this.testPagination();
      
      this.printTestResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      throw error;
    }
  }

  async testPostsFetching() {
    await this.runTest('Posts Fetching', async () => {
      const { data, error } = await this.supabase
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
          users:author_id (
            id,
            username,
            display_name
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No published posts found');
      }
      
      // Validate post structure
      const post = data[0];
      if (!post.title || !post.slug || !post.content) {
        throw new Error('Post missing required fields');
      }
      
      return `Found ${data.length} published posts`;
    });
  }

  async testCategoriesFetching() {
    await this.runTest('Categories Fetching', async () => {
      const { data, error } = await this.supabase
        .from('categories')
        .select('id, name, slug, description')
        .order('name');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No categories found');
      }
      
      return `Found ${data.length} categories`;
    });
  }

  async testTagsFetching() {
    await this.runTest('Tags Fetching', async () => {
      const { data, error } = await this.supabase
        .from('tags')
        .select('id, name, slug, description')
        .order('name');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No tags found');
      }
      
      return `Found ${data.length} tags`;
    });
  }

  async testUsersFetching() {
    await this.runTest('Users Fetching', async () => {
      const { data, error } = await this.supabase
        .from('users')
        .select('id, username, display_name, email')
        .order('display_name');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No users found');
      }
      
      return `Found ${data.length} users`;
    });
  }

  async testPostCategoryRelationships() {
    await this.runTest('Post-Category Relationships', async () => {
      const { data, error } = await this.supabase
        .from('posts')
        .select(`
          id,
          title,
          post_categories (
            categories (
              id,
              name,
              slug
            )
          )
        `)
        .eq('status', 'published')
        .limit(5);
      
      if (error) throw error;
      
      const postsWithCategories = data.filter(post => 
        post.post_categories && post.post_categories.length > 0
      );
      
      if (postsWithCategories.length === 0) {
        throw new Error('No posts with categories found');
      }
      
      return `Found ${postsWithCategories.length} posts with categories`;
    });
  }

  async testPostTagRelationships() {
    await this.runTest('Post-Tag Relationships', async () => {
      const { data, error } = await this.supabase
        .from('posts')
        .select(`
          id,
          title,
          post_tags (
            tags (
              id,
              name,
              slug
            )
          )
        `)
        .eq('status', 'published')
        .limit(5);
      
      if (error) throw error;
      
      const postsWithTags = data.filter(post => 
        post.post_tags && post.post_tags.length > 0
      );
      
      if (postsWithTags.length === 0) {
        throw new Error('No posts with tags found');
      }
      
      return `Found ${postsWithTags.length} posts with tags`;
    });
  }

  async testSinglePostFetching() {
    await this.runTest('Single Post Fetching', async () => {
      // First get a post slug
      const { data: posts, error: postsError } = await this.supabase
        .from('posts')
        .select('slug')
        .eq('status', 'published')
        .limit(1);
      
      if (postsError) throw postsError;
      if (!posts || posts.length === 0) throw new Error('No posts found');
      
      const slug = posts[0].slug;
      
      // Now fetch the full post
      const { data, error } = await this.supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          author_id,
          published_at,
          users:author_id (
            id,
            username,
            display_name
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      
      if (!data.title || !data.content) {
        throw new Error('Post missing required fields');
      }
      
      return `Successfully fetched post: ${data.title}`;
    });
  }

  async testPostsByCategory() {
    await this.runTest('Posts by Category', async () => {
      // Get a category first
      const { data: categories, error: catError } = await this.supabase
        .from('categories')
        .select('id, slug')
        .limit(1);
      
      if (catError) throw catError;
      if (!categories || categories.length === 0) throw new Error('No categories found');
      
      const categoryId = categories[0].id;
      
      // Get posts in this category
      const { data, error } = await this.supabase
        .from('posts')
        .select(`
          id,
          title,
          post_categories!inner (
            category_id
          )
        `)
        .eq('status', 'published')
        .eq('post_categories.category_id', categoryId);
      
      if (error) throw error;
      
      return `Found ${data.length} posts in category`;
    });
  }

  async testPostsByAuthor() {
    await this.runTest('Posts by Author', async () => {
      // Get an author first
      const { data: users, error: userError } = await this.supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (userError) throw userError;
      if (!users || users.length === 0) throw new Error('No users found');
      
      const authorId = users[0].id;
      
      // Get posts by this author
      const { data, error } = await this.supabase
        .from('posts')
        .select('id, title, author_id')
        .eq('status', 'published')
        .eq('author_id', authorId);
      
      if (error) throw error;
      
      return `Found ${data.length} posts by author`;
    });
  }

  async testSearchFunctionality() {
    await this.runTest('Search Functionality', async () => {
      const searchTerm = 'love';
      
      const { data, error } = await this.supabase
        .from('posts')
        .select('id, title, excerpt')
        .eq('status', 'published')
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      
      if (error) throw error;
      
      return `Search for "${searchTerm}" returned ${data.length} results`;
    });
  }

  async testPagination() {
    await this.runTest('Pagination', async () => {
      const pageSize = 10;
      
      // Get first page
      const { data: page1, error: error1 } = await this.supabase
        .from('posts')
        .select('id, title')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(0, pageSize - 1);
      
      if (error1) throw error1;
      
      // Get second page
      const { data: page2, error: error2 } = await this.supabase
        .from('posts')
        .select('id, title')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(pageSize, (pageSize * 2) - 1);
      
      if (error2) throw error2;
      
      // Ensure no overlap
      const page1Ids = page1.map(p => p.id);
      const page2Ids = page2.map(p => p.id);
      const overlap = page1Ids.filter(id => page2Ids.includes(id));
      
      if (overlap.length > 0) {
        throw new Error('Pagination overlap detected');
      }
      
      return `Page 1: ${page1.length} posts, Page 2: ${page2.length} posts`;
    });
  }

  async runTest(testName, testFunction) {
    try {
      const result = await testFunction();
      this.testResults.passed++;
      this.testResults.tests.push({
        name: testName,
        status: 'PASSED',
        message: result
      });
      console.log(`✅ ${testName}: ${result}`);
    } catch (error) {
      this.testResults.failed++;
      this.testResults.tests.push({
        name: testName,
        status: 'FAILED',
        message: error.message
      });
      console.log(`❌ ${testName}: ${error.message}`);
    }
  }

  printTestResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.testResults.passed + this.testResults.failed}`);
    console.log(`Passed: ${this.testResults.passed}`);
    console.log(`Failed: ${this.testResults.failed}`);
    console.log(`Success Rate: ${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)}%`);
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.message}`);
        });
    }
    
    console.log('='.repeat(60));
    
    if (this.testResults.failed === 0) {
      console.log('🎉 All tests passed! Website integration is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new WebsiteIntegrationTest();
  tester.runAllTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = WebsiteIntegrationTest;
