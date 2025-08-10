#!/usr/bin/env node

/**
 * Test script for anonymous user functionality
 * Tests comments, likes, views, and share functionality without authentication
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3002';
const TEST_POST_ID = 'd2396d9d-4886-4b7d-a97f-7da25562d8d6';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}${message ? ' - ' + message : ''}`);
  
  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

async function testAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { response, data, status: response.status };
  } catch (error) {
    return { error, status: 0 };
  }
}

async function testViewTracking() {
  console.log('\n🔍 Testing View Tracking...');
  
  // Test view increment
  const { data, status } = await testAPI(`/api/views/${TEST_POST_ID}`, {
    method: 'POST'
  });
  
  logTest('View increment', status === 200 && data.success, 
    data.counted ? `View count: ${data.viewCount}` : 'Throttled (expected)');
  
  // Test view count retrieval
  const { data: viewData, status: viewStatus } = await testAPI(`/api/views/${TEST_POST_ID}`);
  logTest('View count retrieval', viewStatus === 200 && viewData.success,
    `View count: ${viewData.viewCount}`);
}

async function testLikeFunctionality() {
  console.log('\n❤️ Testing Like Functionality...');
  
  // Get initial like status
  const { data: initialData } = await testAPI(`/api/likes?postId=${TEST_POST_ID}`);
  const initialLiked = initialData.isLiked;
  const initialCount = initialData.likeCount;
  
  logTest('Initial like status retrieval', initialData.success,
    `Liked: ${initialLiked}, Count: ${initialCount}`);
  
  // Toggle like
  const { data: toggleData, status } = await testAPI('/api/likes', {
    method: 'POST',
    body: JSON.stringify({ postId: TEST_POST_ID })
  });
  
  logTest('Like toggle', status === 200 && toggleData.success,
    `New status: ${toggleData.isLiked}, Count: ${toggleData.likeCount}`);
  
  // Verify the toggle worked
  const expectedLiked = !initialLiked;
  const expectedCount = expectedLiked ? initialCount + 1 : initialCount - 1;
  
  logTest('Like toggle correctness', 
    toggleData.isLiked === expectedLiked && toggleData.likeCount === expectedCount);
}

async function testCommentFunctionality() {
  console.log('\n💬 Testing Comment Functionality...');
  
  // Test comment creation
  const testComment = {
    postId: TEST_POST_ID,
    content: 'This is a test comment from the test script',
    authorName: 'Test Script User',
    authorEmail: 'test@example.com'
  };
  
  const { data: commentData, status } = await testAPI('/api/comments', {
    method: 'POST',
    body: JSON.stringify(testComment)
  });
  
  logTest('Comment creation', status === 201 && commentData.success,
    `Comment ID: ${commentData.comment?.id}`);
  
  // Test comment retrieval
  const { data: commentsData, status: commentsStatus } = await testAPI(`/api/comments?postId=${TEST_POST_ID}`);
  
  logTest('Comment retrieval', commentsStatus === 200 && commentsData.success,
    `Total comments: ${commentsData.total}`);
  
  // Test validation
  const { data: validationData, status: validationStatus } = await testAPI('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      postId: TEST_POST_ID,
      content: '',
      authorName: '',
      authorEmail: ''
    })
  });
  
  logTest('Comment validation', validationStatus === 400 && validationData.error,
    'Validation errors caught correctly');
}

async function testShareAnalytics() {
  console.log('\n📤 Testing Share Analytics...');
  
  const shareData = {
    platform: 'copy',
    contentId: TEST_POST_ID,
    contentType: 'post'
  };
  
  const { data, status } = await testAPI('/api/analytics/share', {
    method: 'POST',
    body: JSON.stringify(shareData)
  });
  
  logTest('Share tracking', status === 200 && data.success,
    'Share event recorded');
  
  // Test validation
  const { data: validationData, status: validationStatus } = await testAPI('/api/analytics/share', {
    method: 'POST',
    body: JSON.stringify({
      platform: 'invalid-platform',
      contentId: TEST_POST_ID,
      contentType: 'post'
    })
  });
  
  logTest('Share validation', validationStatus === 400 && validationData.error,
    'Invalid platform rejected');
}

async function testErrorHandling() {
  console.log('\n🚫 Testing Error Handling...');
  
  // Test with non-existent post
  const fakePostId = '00000000-0000-0000-0000-000000000000';
  
  const { data: likeData, status: likeStatus } = await testAPI('/api/likes', {
    method: 'POST',
    body: JSON.stringify({ postId: fakePostId })
  });
  
  logTest('Non-existent post like', likeStatus === 404 && likeData.error,
    'Post not found error returned');
  
  const { data: viewData, status: viewStatus } = await testAPI(`/api/views/${fakePostId}`, {
    method: 'POST'
  });
  
  logTest('Non-existent post view', viewStatus === 404 && viewData.error,
    'Post not found error returned');
  
  const { data: commentData, status: commentStatus } = await testAPI('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      postId: fakePostId,
      content: 'Test comment',
      authorName: 'Test User'
    })
  });
  
  logTest('Non-existent post comment', commentStatus === 404 && commentData.error,
    'Post not found error returned');
}

async function runAllTests() {
  console.log('🧪 Starting Anonymous User Functionality Tests...\n');
  
  try {
    await testViewTracking();
    await testLikeFunctionality();
    await testCommentFunctionality();
    await testShareAnalytics();
    await testErrorHandling();
    
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    
    if (results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.tests.filter(t => !t.passed).forEach(test => {
        console.log(`  - ${test.name}: ${test.message}`);
      });
    }
    
    console.log('\n🎉 All tests completed!');
    process.exit(results.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, testAPI };
