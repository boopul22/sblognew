import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

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
  const timestamp = Date.now();
  return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}-${timestamp}`;
}

// Validation function for comment content
function validateComment(content, authorName, authorEmail) {
  const errors = [];
  
  if (!content || content.trim().length === 0) {
    errors.push('Comment content is required');
  }
  
  if (content && content.length > 1000) {
    errors.push('Comment content must be less than 1000 characters');
  }
  
  if (!authorName || authorName.trim().length === 0) {
    errors.push('Author name is required');
  }
  
  if (authorName && authorName.length > 100) {
    errors.push('Author name must be less than 100 characters');
  }
  
  if (authorEmail && authorEmail.length > 255) {
    errors.push('Author email must be less than 255 characters');
  }
  
  // Basic email validation if provided
  if (authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
    errors.push('Invalid email format');
  }
  
  return errors;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Create a new comment
      const { postId, content, authorName, authorEmail, parentId } = req.body;
      
      // Validate required fields
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      
      // Validate comment data
      const validationErrors = validateComment(content, authorName, authorEmail);
      if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(', ') });
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
      
      // Create comment
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content: content.trim(),
          author_name: authorName.trim(),
          author_email: authorEmail ? authorEmail.trim() : null,
          parent_id: parentId || null,
          status: 'approved', // Auto-approve for now, can be changed to 'pending' for moderation
          ip_address: ipAddress,
          session_id: sessionId,
          user_agent: userAgent
        })
        .select(`
          id,
          content,
          author_name,
          created_at,
          parent_id
        `)
        .single();
        
      if (commentError) {
        console.error('Error creating comment:', commentError);
        return res.status(500).json({ error: 'Failed to create comment' });
      }
      
      return res.status(201).json({ 
        success: true, 
        comment: {
          ...comment,
          author_email: null // Don't return email in response
        }
      });
      
    } else if (req.method === 'GET') {
      // Get comments for a post
      const { postId } = req.query;
      
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      
      // Fetch comments
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          author_name,
          created_at,
          parent_id
        `)
        .eq('post_id', postId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });
        
      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        return res.status(500).json({ error: 'Failed to fetch comments' });
      }
      
      // Organize comments into a tree structure
      const commentMap = new Map();
      const rootComments = [];
      
      // First pass: create comment objects with replies array
      comments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });
      
      // Second pass: organize into tree structure
      comments.forEach(comment => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });
      
      return res.status(200).json({ 
        success: true, 
        comments: rootComments,
        total: comments.length
      });
      
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
