// Share utilities for social media and copy functionality

export interface ShareData {
  title: string;
  text?: string;
  url: string;
  hashtags?: string[];
}

export interface ShareOptions {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'telegram' | 'copy';
  data: ShareData;
}

// Generate sharing URLs for different platforms
export function generateShareUrl(platform: string, data: ShareData): string {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedText = encodeURIComponent(data.text || data.title);
  const hashtags = data.hashtags?.join(',') || '';
  
  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
      
    case 'twitter':
      const twitterText = data.hashtags?.length 
        ? `${encodedText} ${data.hashtags.map(tag => `%23${tag}`).join(' ')}`
        : encodedText;
      return `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodedUrl}`;
      
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`;
      
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
      
    default:
      return data.url;
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Open share dialog or copy to clipboard
export async function handleShare(options: ShareOptions): Promise<boolean> {
  const { platform, data } = options;
  
  if (platform === 'copy') {
    return await copyToClipboard(data.url);
  }
  
  // For social media platforms, open in new window
  const shareUrl = generateShareUrl(platform, data);
  const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
  
  try {
    window.open(shareUrl, '_blank', windowFeatures);
    return true;
  } catch (error) {
    console.error('Failed to open share window:', error);
    return false;
  }
}

// Check if Web Share API is available
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

// Use native Web Share API if available
export async function nativeShare(data: ShareData): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false;
  }
  
  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error('Native share failed:', error);
    return false;
  }
}

// Generate post URL from slug
export function generatePostUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/post/${slug}`;
}

// Generate shayari URL from ID
export function generateShayariUrl(id: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/shayari/${id}`;
}

// Track share events (optional analytics)
export async function trackShare(platform: string, contentId: string, contentType: 'post' | 'shayari' = 'post'): Promise<void> {
  try {
    // You can implement analytics tracking here
    // For example, send to Google Analytics, Mixpanel, etc.
    console.log(`Share tracked: ${platform} - ${contentType}:${contentId}`);
    
    // Example: Send to your analytics endpoint
    // await fetch('/api/analytics/share', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ platform, contentId, contentType })
    // });
  } catch (error) {
    console.error('Failed to track share:', error);
  }
}

// Get share text for different content types
export function getShareText(content: any, type: 'post' | 'shayari' = 'post'): ShareData {
  if (type === 'shayari') {
    return {
      title: `${content.lines?.join(' | ') || content.title} - ${content.author}`,
      text: `Check out this beautiful shayari by ${content.author}`,
      url: generateShayariUrl(content.id),
      hashtags: ['shayari', 'poetry', 'urdu', 'hindi']
    };
  } else {
    return {
      title: content.title,
      text: content.excerpt || `Read this interesting post: ${content.title}`,
      url: generatePostUrl(content.slug),
      hashtags: content.tags || ['blog', 'article']
    };
  }
}
