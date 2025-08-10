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

// Helper function to generate session ID from request
function generateSessionId(req) {
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || '';
  // Create a more stable session ID based on IP and user agent
  const hash = Buffer.from(`${ip}-${userAgent}`).toString('base64').slice(0, 20);
  return hash;
}

// Helper function to check if view should be counted (throttling)
async function shouldCountView(postId, ipAddress, sessionId) {
  // Check if this IP/session viewed this post in the last 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  const { data: recentView, error } = await supabase
    .from('page_views')
    .select('id')
    .eq('post_id', postId)
    .eq('ip_address', ipAddress)
    .eq('session_id', sessionId)
    .gte('created_at', thirtyMinutesAgo)
    .single();
    
  // If there's an error (like no rows found), we should count the view
  // If we found a recent view, we shouldn't count it
  return !recentView;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { postId } = req.query;
  
  if (!postId) {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  try {
    if (req.method === 'POST') {
      // Record a page view
      
      // Check if post exists
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('id, view_count')
        .eq('id', postId)
        .eq('status', 'published')
        .single();
        
      if (postError || !post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      // Get client information
      const ipAddress = getClientIP(req);
      const sessionId = generateSessionId(req);
      const userAgent = req.headers['user-agent'] || '';
      const referrer = req.headers['referer'] || req.headers['referrer'] || '';
      
      // Check if we should count this view (throttling)
      const shouldCount = await shouldCountView(postId, ipAddress, sessionId);
      
      if (!shouldCount) {
        // Return current view count without incrementing
        return res.status(200).json({ 
          success: true, 
          viewCount: post.view_count || 0,
          counted: false,
          message: 'View not counted due to throttling'
        });
      }
      
      // Record the page view
      const { error: viewError } = await supabase
        .from('page_views')
        .insert({
          post_id: postId,
          ip_address: ipAddress,
          session_id: sessionId,
          user_agent: userAgent,
          referrer: referrer
        });
        
      if (viewError) {
        console.error('Error recording page view:', viewError);
        // Don't fail the request if we can't record the detailed view
      }
      
      // Increment the view count in posts table
      const { data: updatedPost, error: updateError } = await supabase
        .from('posts')
        .update({ 
          view_count: (post.view_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select('view_count')
        .single();
        
      if (updateError) {
        console.error('Error updating view count:', updateError);
        return res.status(500).json({ error: 'Failed to update view count' });
      }
      
      return res.status(200).json({ 
        success: true, 
        viewCount: updatedPost.view_count,
        counted: true
      });
      
    } else if (req.method === 'GET') {
      // Get view count for a post
      
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', postId)
        .eq('status', 'published')
        .single();
        
      if (postError || !post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      return res.status(200).json({ 
        success: true, 
        viewCount: post.view_count || 0
      });
      
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
