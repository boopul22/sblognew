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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Toggle like for a post
      const { postId } = req.body;
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      
      // Check if post exists
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('id')
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
      
      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('ip_address', ipAddress)
        .eq('session_id', sessionId)
        .is('user_id', null)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing like:', checkError);
        return res.status(500).json({ error: 'Failed to check like status' });
      }
      
      let isLiked = false;
      
      if (existingLike) {
        // Unlike - remove the like
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
          
        if (deleteError) {
          console.error('Error removing like:', deleteError);
          return res.status(500).json({ error: 'Failed to remove like' });
        }
        
        isLiked = false;
      } else {
        // Like - add the like
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            ip_address: ipAddress,
            session_id: sessionId,
            user_agent: userAgent
          });
          
        if (insertError) {
          console.error('Error adding like:', insertError);
          return res.status(500).json({ error: 'Failed to add like' });
        }
        
        isLiked = true;
      }
      
      // Get updated like count
      const { count: likeCount, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
        
      if (countError) {
        console.error('Error getting like count:', countError);
        return res.status(500).json({ error: 'Failed to get like count' });
      }
      
      return res.status(200).json({ 
        success: true, 
        isLiked,
        likeCount: likeCount || 0
      });
      
    } else if (req.method === 'GET') {
      // Get like count and user's like status for a post
      const { postId } = req.query;
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      
      // Get total like count
      const { count: likeCount, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
        
      if (countError) {
        console.error('Error getting like count:', countError);
        return res.status(500).json({ error: 'Failed to get like count' });
      }
      
      // Check if current user liked this post
      const ipAddress = getClientIP(req);
      const sessionId = generateSessionId(req);
      
      const { data: userLike, error: userLikeError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('ip_address', ipAddress)
        .eq('session_id', sessionId)
        .is('user_id', null)
        .single();
        
      const isLiked = !userLikeError && userLike;
      
      return res.status(200).json({ 
        success: true, 
        likeCount: likeCount || 0,
        isLiked: !!isLiked
      });
      
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
