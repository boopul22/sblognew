import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         '127.0.0.1';
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform, contentId, contentType = 'post' } = req.body;
    
    // Validate required fields
    if (!platform || !contentId) {
      return res.status(400).json({ error: 'Platform and content ID are required' });
    }
    
    // Validate platform
    const validPlatforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'copy', 'native'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }
    
    // Validate content type
    const validContentTypes = ['post', 'shayari'];
    if (!validContentTypes.includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    
    // Get client information
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || '';
    
    // Record the share event
    const { error: shareError } = await supabase
      .from('shares')
      .insert({
        content_id: contentId,
        content_type: contentType,
        platform: platform,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer
      });
      
    if (shareError) {
      console.error('Error recording share:', shareError);
      // Don't fail the request if we can't record the share
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Share tracked successfully'
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
