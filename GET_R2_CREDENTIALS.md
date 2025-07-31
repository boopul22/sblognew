# 🔑 How to Get Your Cloudflare R2 Credentials

## Step-by-Step Guide

### 1. 🌐 Access Cloudflare Dashboard
- Go to: https://dash.cloudflare.com
- Log in with your Cloudflare account

### 2. 📋 Get Your Account ID
- On the dashboard, look at the **right sidebar**
- You'll see **"Account ID"** with a long string like: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`
- **Copy this Account ID** - you'll need it for the environment variables

### 3. 🗄️ Navigate to R2 Object Storage
- In the left sidebar, click **"R2 Object Storage"**
- You should see your `blog-images` bucket listed

### 4. 🔑 Create R2 API Token
- Click **"Manage R2 API Tokens"** (usually in the top right)
- Click **"Create API Token"**

### 5. ⚙️ Configure the API Token
Fill out the form:
- **Token name**: `blog-website-r2-access`
- **Permissions**: Select **"Object Read & Write"**
- **Account resources**: Choose **"Include - All accounts"** (or select your specific account)
- **Zone resources**: Leave as **"Include - All zones"** (not critical for R2)

### 6. 💾 Save Your Credentials
- Click **"Continue to summary"**
- Click **"Create Token"**
- **IMPORTANT**: Copy and save these values immediately:
  - **Access Key ID**: Looks like `1a2b3c4d5e6f7g8h9i0j`
  - **Secret Access Key**: Looks like `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z`

⚠️ **Warning**: The Secret Access Key is only shown once! Save it immediately.

## 🔧 Configure Your Environment

### Option 1: Manual Configuration (Recommended)

Edit your `.env.local` file and replace the placeholder values:

```env
# Cloudflare R2 Configuration for Image Storage
CLOUDFLARE_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
CLOUDFLARE_R2_ACCESS_KEY_ID=1a2b3c4d5e6f7g8h9i0j
CLOUDFLARE_R2_SECRET_ACCESS_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
CLOUDFLARE_R2_BUCKET_NAME=blog-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.r2.dev/blog-images
CLOUDFLARE_R2_ENDPOINT=https://1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.r2.cloudflarestorage.com
```

**Replace**:
- `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p` with your actual Account ID
- `1a2b3c4d5e6f7g8h9i0j` with your actual Access Key ID  
- `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z` with your actual Secret Access Key

### Option 2: Using the Setup Script

1. **Set environment variables temporarily**:
   ```bash
   export CLOUDFLARE_ACCOUNT_ID="your_actual_account_id"
   export CLOUDFLARE_R2_ACCESS_KEY_ID="your_actual_access_key"
   export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_actual_secret_key"
   ```

2. **Run the setup script**:
   ```bash
   npm run setup:r2
   ```

## 🧪 Test Your Configuration

After setting up your credentials:

1. **Test R2 connection**:
   ```bash
   npm run test:r2
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Test image upload**:
   - Navigate to your admin panel
   - Try uploading an image
   - Check that it uploads successfully

## 🔍 Troubleshooting

### ❌ "Credentials not configured" error
- Double-check your Account ID, Access Key ID, and Secret Access Key
- Make sure there are no extra spaces or quotes
- Verify the credentials are in the correct environment file

### ❌ "Access denied" error
- Ensure your API token has **"Object Read & Write"** permissions
- Check that the token includes your account in the resources
- Try creating a new API token

### ❌ "Bucket not found" error
- Verify the bucket name is exactly `blog-images`
- Check that the bucket exists in your R2 dashboard
- Ensure you're using the correct account

### ❌ Upload fails with network error
- Check your internet connection
- Verify the R2 endpoint URL is correct
- Try uploading a smaller image file

## 📊 Expected Results

Once configured correctly, you should see:

✅ **Environment Test**: All variables configured  
✅ **R2 Access**: Configuration appears valid  
✅ **Image URLs**: URL generation working  
✅ **File Validation**: Logic working  

## 🔒 Security Notes

- **Never commit** your actual credentials to version control
- **Use `.env.local`** for local development (it's gitignored)
- **Use secure environment variables** in production
- **Rotate your API tokens** periodically for security

## 📞 Need Help?

If you're still having issues:

1. **Check the logs** in your browser's developer console
2. **Verify your credentials** in the Cloudflare dashboard
3. **Test with a simple image** (JPEG, under 1MB)
4. **Review the setup documentation** in `CLOUDFLARE_R2_SETUP.md`

Your R2 integration should work perfectly once the credentials are properly configured! 🎉
