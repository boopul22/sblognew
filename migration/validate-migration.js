#!/usr/bin/env node

/**
 * Migration Validation and Testing Script
 * 
 * This script validates the migration results and tests data integrity
 * between WordPress and Supabase data.
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

class MigrationValidator {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Check your .env file.');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseServiceKey);
    this.extractedDataPath = path.join(__dirname, 'extracted-data');
    
    this.validationResults = {
      summary: {},
      details: {},
      errors: []
    };
  }

  async validate() {
    console.log('🔍 Starting migration validation...');
    console.log('=' .repeat(60));
    
    try {
      // Load extracted data
      await this.loadExtractedData();
      
      // Validate each data type
      await this.validateUsers();
      await this.validateCategories();
      await this.validateTags();
      await this.validatePosts();
      await this.validateRelationships();
      
      // Generate validation report
      await this.generateValidationReport();
      
      console.log('\n✅ Validation completed!');
      this.printValidationSummary();
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      throw error;
    }
  }

  async loadExtractedData() {
    console.log('📊 Loading extracted WordPress data...');
    
    this.extractedData = {};
    
    const dataFiles = [
      'users.json',
      'categories.json',
      'tags.json',
      'posts.json',
      'postCategories.json',
      'postTags.json'
    ];
    
    for (const file of dataFiles) {
      const filePath = path.join(this.extractedDataPath, file);
      const tableName = file.replace('.json', '');
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        this.extractedData[tableName] = JSON.parse(content);
        console.log(`✅ Loaded ${this.extractedData[tableName].length} ${tableName} records`);
      } catch (error) {
        console.log(`⚠️  Could not load ${file}: ${error.message}`);
        this.extractedData[tableName] = [];
      }
    }
  }

  async validateUsers() {
    console.log('\n👥 Validating users...');
    
    const extractedUsers = this.extractedData.users;
    const { data: supabaseUsers, error } = await this.supabase
      .from('users')
      .select('*');
    
    if (error) {
      this.addError('users', 'Failed to fetch users from Supabase', error);
      return;
    }
    
    const validation = {
      extracted: extractedUsers.length,
      migrated: supabaseUsers.length,
      missing: [],
      extra: [],
      dataIntegrity: []
    };
    
    // Check for missing users
    for (const extractedUser of extractedUsers) {
      const migratedUser = supabaseUsers.find(u => u.wp_id === extractedUser.wp_id);
      if (!migratedUser) {
        validation.missing.push(extractedUser.wp_id);
      } else {
        // Validate data integrity
        if (migratedUser.username !== extractedUser.username) {
          validation.dataIntegrity.push({
            wp_id: extractedUser.wp_id,
            field: 'username',
            expected: extractedUser.username,
            actual: migratedUser.username
          });
        }
        if (migratedUser.email !== extractedUser.email) {
          validation.dataIntegrity.push({
            wp_id: extractedUser.wp_id,
            field: 'email',
            expected: extractedUser.email,
            actual: migratedUser.email
          });
        }
      }
    }
    
    // Check for extra users
    for (const supabaseUser of supabaseUsers) {
      if (supabaseUser.wp_id && !extractedUsers.find(u => u.wp_id === supabaseUser.wp_id)) {
        validation.extra.push(supabaseUser.wp_id);
      }
    }
    
    this.validationResults.details.users = validation;
    
    console.log(`   Extracted: ${validation.extracted}, Migrated: ${validation.migrated}`);
    console.log(`   Missing: ${validation.missing.length}, Extra: ${validation.extra.length}`);
    console.log(`   Data integrity issues: ${validation.dataIntegrity.length}`);
  }

  async validateCategories() {
    console.log('\n📂 Validating categories...');
    
    const extractedCategories = this.extractedData.categories;
    const { data: supabaseCategories, error } = await this.supabase
      .from('categories')
      .select('*');
    
    if (error) {
      this.addError('categories', 'Failed to fetch categories from Supabase', error);
      return;
    }
    
    const validation = {
      extracted: extractedCategories.length,
      migrated: supabaseCategories.length,
      missing: [],
      hierarchyIssues: []
    };
    
    // Check for missing categories
    for (const extractedCategory of extractedCategories) {
      const migratedCategory = supabaseCategories.find(c => c.wp_id === extractedCategory.wp_id);
      if (!migratedCategory) {
        validation.missing.push(extractedCategory.wp_id);
      }
    }
    
    // Validate hierarchy
    for (const supabaseCategory of supabaseCategories) {
      if (supabaseCategory.parent_id) {
        const parentExists = supabaseCategories.find(c => c.id === supabaseCategory.parent_id);
        if (!parentExists) {
          validation.hierarchyIssues.push({
            category_id: supabaseCategory.id,
            wp_id: supabaseCategory.wp_id,
            missing_parent_id: supabaseCategory.parent_id
          });
        }
      }
    }
    
    this.validationResults.details.categories = validation;
    
    console.log(`   Extracted: ${validation.extracted}, Migrated: ${validation.migrated}`);
    console.log(`   Missing: ${validation.missing.length}`);
    console.log(`   Hierarchy issues: ${validation.hierarchyIssues.length}`);
  }

  async validateTags() {
    console.log('\n🏷️  Validating tags...');
    
    const extractedTags = this.extractedData.tags;
    const { data: supabaseTags, error } = await this.supabase
      .from('tags')
      .select('*');
    
    if (error) {
      this.addError('tags', 'Failed to fetch tags from Supabase', error);
      return;
    }
    
    const validation = {
      extracted: extractedTags.length,
      migrated: supabaseTags.length,
      missing: []
    };
    
    // Check for missing tags
    for (const extractedTag of extractedTags) {
      const migratedTag = supabaseTags.find(t => t.wp_id === extractedTag.wp_id);
      if (!migratedTag) {
        validation.missing.push(extractedTag.wp_id);
      }
    }
    
    this.validationResults.details.tags = validation;
    
    console.log(`   Extracted: ${validation.extracted}, Migrated: ${validation.migrated}`);
    console.log(`   Missing: ${validation.missing.length}`);
  }

  async validatePosts() {
    console.log('\n📝 Validating posts...');
    
    const extractedPosts = this.extractedData.posts;
    const { data: supabasePosts, error } = await this.supabase
      .from('posts')
      .select('*');
    
    if (error) {
      this.addError('posts', 'Failed to fetch posts from Supabase', error);
      return;
    }
    
    const validation = {
      extracted: extractedPosts.length,
      migrated: supabasePosts.length,
      missing: [],
      contentIssues: []
    };
    
    // Check for missing posts
    for (const extractedPost of extractedPosts) {
      const migratedPost = supabasePosts.find(p => p.wp_id === extractedPost.wp_id);
      if (!migratedPost) {
        validation.missing.push(extractedPost.wp_id);
      } else {
        // Basic content validation
        if (!migratedPost.title || migratedPost.title.trim() === '') {
          validation.contentIssues.push({
            wp_id: extractedPost.wp_id,
            issue: 'Empty title'
          });
        }
        if (!migratedPost.content || migratedPost.content.trim() === '') {
          validation.contentIssues.push({
            wp_id: extractedPost.wp_id,
            issue: 'Empty content'
          });
        }
      }
    }
    
    this.validationResults.details.posts = validation;
    
    console.log(`   Extracted: ${validation.extracted}, Migrated: ${validation.migrated}`);
    console.log(`   Missing: ${validation.missing.length}`);
    console.log(`   Content issues: ${validation.contentIssues.length}`);
  }

  async validateRelationships() {
    console.log('\n🔗 Validating relationships...');
    
    // Validate post-category relationships
    const { data: postCategories, error: pcError } = await this.supabase
      .from('post_categories')
      .select('*');
    
    if (pcError) {
      this.addError('relationships', 'Failed to fetch post-category relationships', pcError);
    } else {
      console.log(`   Post-Category relationships: ${postCategories.length}`);
    }
    
    // Validate post-tag relationships
    const { data: postTags, error: ptError } = await this.supabase
      .from('post_tags')
      .select('*');
    
    if (ptError) {
      this.addError('relationships', 'Failed to fetch post-tag relationships', ptError);
    } else {
      console.log(`   Post-Tag relationships: ${postTags.length}`);
    }
  }

  addError(category, message, error) {
    this.validationResults.errors.push({
      category,
      message,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    console.log(`   ❌ ${message}: ${error.message}`);
  }

  async generateValidationReport() {
    const reportPath = path.join(__dirname, `validation-report-${Date.now()}.json`);
    
    try {
      await fs.writeFile(reportPath, JSON.stringify(this.validationResults, null, 2));
      console.log(`\n📝 Validation report saved: ${reportPath}`);
    } catch (error) {
      console.error('Failed to save validation report:', error.message);
    }
  }

  printValidationSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(60));
    
    for (const [tableName, details] of Object.entries(this.validationResults.details)) {
      if (details.extracted !== undefined) {
        const migrationRate = details.migrated > 0 ? 
          ((details.migrated / details.extracted) * 100).toFixed(1) : '0.0';
        
        console.log(`${tableName.padEnd(15)} | ${details.migrated}/${details.extracted} (${migrationRate}%)`);
        
        if (details.missing && details.missing.length > 0) {
          console.log(`${''.padEnd(15)} | Missing: ${details.missing.length}`);
        }
      }
    }
    
    if (this.validationResults.errors.length > 0) {
      console.log(`\n❌ Total Errors: ${this.validationResults.errors.length}`);
    } else {
      console.log('\n✅ No validation errors found');
    }
    
    console.log('='.repeat(60));
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MigrationValidator();
  validator.validate().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = MigrationValidator;
