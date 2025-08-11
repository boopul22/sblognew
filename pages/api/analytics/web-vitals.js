/**
 * Web Vitals Analytics Endpoint
 * Collects Core Web Vitals metrics for performance monitoring
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, value, rating, delta, id } = req.body;
    
    // Validate required fields
    if (!name || typeof value !== 'number' || !rating || !id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate metric name
    const validMetrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'];
    if (!validMetrics.includes(name)) {
      return res.status(400).json({ error: 'Invalid metric name' });
    }
    
    // Validate rating
    const validRatings = ['good', 'needs-improvement', 'poor'];
    if (!validRatings.includes(rating)) {
      return res.status(400).json({ error: 'Invalid rating' });
    }
    
    // Get client information
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.connection?.remoteAddress || 
                     '127.0.0.1';
    
    // Log the metric (in production, you'd store this in a database)
    console.log('Web Vitals Metric:', {
      name,
      value,
      rating,
      delta,
      id,
      userAgent,
      ipAddress,
      timestamp: new Date().toISOString(),
    });
    
    // Here you could store the metrics in your database
    // For example, with Supabase:
    /*
    const { error } = await supabase
      .from('web_vitals')
      .insert({
        metric_name: name,
        metric_value: value,
        rating,
        delta,
        metric_id: id,
        user_agent: userAgent,
        ip_address: ipAddress,
        created_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error storing web vitals:', error);
    }
    */
    
    return res.status(200).json({ 
      success: true,
      message: 'Web vitals metric recorded'
    });
    
  } catch (error) {
    console.error('Web Vitals API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
