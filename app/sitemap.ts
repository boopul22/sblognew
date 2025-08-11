import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '../lib/seo-config'
import { fetchPosts } from '../services/blogService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Category pages
  const categoryPages = [
    {
      url: `${baseUrl}/category/love-shayari`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/sad-shayari`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/friendship-shayari`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/motivational-shayari`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/romantic-quotes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/birthday-wishes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/festival-wishes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic post pages from database
  let postPages: any[] = [];
  try {
    console.log('Fetching posts for sitemap generation...');
    const posts = await fetchPosts();

    if (posts && posts.length > 0) {
      postPages = posts
        .filter(post => post.status === 'published' && post.slug)
        .map(post => ({
          url: `${baseUrl}/${post.slug}`,
          lastModified: new Date(post.updated_at || post.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      console.log(`Added ${postPages.length} posts to sitemap`);
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    // Continue without post pages if there's an error
  }

  // Additional important pages
  const additionalPages = [
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  return [
    ...staticPages,
    ...categoryPages,
    ...additionalPages,
    ...postPages,
  ];
}
