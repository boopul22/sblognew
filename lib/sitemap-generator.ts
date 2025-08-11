// Advanced Sitemap Generator for ShareVault
import { fetchPosts } from '../services/blogService';
import { SEO_CONFIG } from './seo-config';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: Array<{
    url: string;
    title?: string;
    caption?: string;
  }>;
}

// Generate sitemap for static pages
export function generateStaticSitemap(): SitemapEntry[] {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}

// Generate sitemap for category pages
export function generateCategorySitemap(): SitemapEntry[] {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  const categories = [
    { slug: 'love-shayari', priority: 0.9, frequency: 'daily' as const },
    { slug: 'sad-shayari', priority: 0.9, frequency: 'daily' as const },
    { slug: 'friendship-shayari', priority: 0.9, frequency: 'daily' as const },
    { slug: 'motivational-shayari', priority: 0.9, frequency: 'daily' as const },
    { slug: 'romantic-quotes', priority: 0.9, frequency: 'daily' as const },
    { slug: 'birthday-wishes', priority: 0.8, frequency: 'weekly' as const },
    { slug: 'festival-wishes', priority: 0.8, frequency: 'weekly' as const },
    { slug: 'good-morning-shayari', priority: 0.8, frequency: 'daily' as const },
    { slug: 'good-night-shayari', priority: 0.8, frequency: 'daily' as const },
    { slug: 'hindi-quotes', priority: 0.8, frequency: 'daily' as const },
    { slug: 'urdu-shayari', priority: 0.7, frequency: 'weekly' as const },
    { slug: 'bewafa-shayari', priority: 0.7, frequency: 'weekly' as const },
    { slug: 'attitude-status', priority: 0.7, frequency: 'weekly' as const },
    { slug: 'life-quotes', priority: 0.7, frequency: 'weekly' as const },
  ];

  return categories.map(category => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: category.frequency,
    priority: category.priority,
  }));
}

// Generate sitemap for blog posts
export async function generatePostsSitemap(): Promise<SitemapEntry[]> {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  try {
    const posts = await fetchPosts();
    
    if (!posts || posts.length === 0) {
      console.log('No posts found for sitemap generation');
      return [];
    }

    return posts
      .filter(post => post.status === 'published' && post.slug)
      .map(post => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        images: post.featured_image_url ? [{
          url: post.featured_image_url,
          title: post.title,
          caption: post.excerpt || post.title,
        }] : undefined,
      }));
  } catch (error) {
    console.error('Error generating posts sitemap:', error);
    return [];
  }
}

// Generate complete sitemap
export async function generateCompleteSitemap(): Promise<SitemapEntry[]> {
  const staticPages = generateStaticSitemap();
  const categoryPages = generateCategorySitemap();
  const postPages = await generatePostsSitemap();
  
  console.log(`Sitemap generated: ${staticPages.length} static pages, ${categoryPages.length} category pages, ${postPages.length} post pages`);
  
  return [
    ...staticPages,
    ...categoryPages,
    ...postPages,
  ];
}

// Generate XML sitemap string
export function generateXMLSitemap(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
  const urlsetClose = '</urlset>';
  
  const urls = entries.map(entry => {
    let urlXml = `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>`;
    
    // Add image information if available
    if (entry.images && entry.images.length > 0) {
      entry.images.forEach(image => {
        urlXml += `
    <image:image>
      <image:loc>${image.url}</image:loc>`;
        if (image.title) {
          urlXml += `
      <image:title>${escapeXml(image.title)}</image:title>`;
        }
        if (image.caption) {
          urlXml += `
      <image:caption>${escapeXml(image.caption)}</image:caption>`;
        }
        urlXml += `
    </image:image>`;
      });
    }
    
    urlXml += `
  </url>`;
    
    return urlXml;
  }).join('');
  
  return `${xmlHeader}
${urlsetOpen}${urls}
${urlsetClose}`;
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate sitemap index for large sites
export function generateSitemapIndex(): string {
  const baseUrl = SEO_CONFIG.siteUrl;
  const now = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-posts.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// Validate sitemap entries
export function validateSitemapEntry(entry: SitemapEntry): boolean {
  // Check URL format
  try {
    new URL(entry.url);
  } catch {
    console.error(`Invalid URL in sitemap: ${entry.url}`);
    return false;
  }
  
  // Check priority range
  if (entry.priority < 0 || entry.priority > 1) {
    console.error(`Invalid priority for ${entry.url}: ${entry.priority}`);
    return false;
  }
  
  // Check change frequency
  const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  if (!validFrequencies.includes(entry.changeFrequency)) {
    console.error(`Invalid change frequency for ${entry.url}: ${entry.changeFrequency}`);
    return false;
  }
  
  return true;
}
