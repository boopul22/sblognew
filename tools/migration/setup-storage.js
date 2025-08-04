const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

class StorageSetup {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
    );
  }

  async setupImagesBucket() {
    console.log('Setting up images storage bucket...');

    try {
      // Check if bucket already exists
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        throw listError;
      }

      const existingBucket = buckets.find(bucket => bucket.name === 'images');
      
      if (existingBucket) {
        console.log('Images bucket already exists');
        return existingBucket;
      }

      // Create the bucket
      const { data: bucket, error: createError } = await this.supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: [
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/bmp',
          'image/tiff'
        ],
        fileSizeLimit: 52428800 // 50MB
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }

      console.log('Images bucket created successfully:', bucket);

      // Set up RLS policy for public read access
      await this.setupBucketPolicies();

      return bucket;

    } catch (error) {
      console.error('Failed to setup images bucket:', error);
      throw error;
    }
  }

  async setupBucketPolicies() {
    console.log('Setting up bucket policies...');

    try {
      // Create policy for public read access to images
      const { error: policyError } = await this.supabase.rpc('create_storage_policy', {
        bucket_name: 'images',
        policy_name: 'Public read access',
        definition: 'SELECT',
        check: 'true',
        using: 'true'
      });

      if (policyError) {
        console.warn('Policy creation failed (may already exist):', policyError.message);
      } else {
        console.log('Public read policy created successfully');
      }

    } catch (error) {
      console.warn('Policy setup failed:', error.message);
    }
  }

  async testBucketAccess() {
    console.log('Testing bucket access...');

    try {
      const { data: buckets, error } = await this.supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error accessing buckets:', error);
        return false;
      }

      const imagesBucket = buckets.find(bucket => bucket.name === 'images');
      
      if (imagesBucket) {
        console.log('✅ Images bucket is accessible');
        console.log('Bucket details:', imagesBucket);
        return true;
      } else {
        console.log('❌ Images bucket not found');
        return false;
      }

    } catch (error) {
      console.error('Bucket access test failed:', error);
      return false;
    }
  }
}

// Run setup
async function main() {
  const setup = new StorageSetup();
  
  try {
    await setup.setupImagesBucket();
    await setup.testBucketAccess();
    console.log('✅ Storage setup completed successfully!');
  } catch (error) {
    console.error('❌ Storage setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = StorageSetup;
