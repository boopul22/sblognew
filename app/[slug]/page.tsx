import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { fetchPosts, fetchPostBySlug } from '../../services/blogService';
import PostDetail from '../../components/PostDetail';
import { notFound } from 'next/navigation';
import { generateMetaTags, generateStructuredData, SEO_CONFIG } from '../../lib/seo-config';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static pages for all posts at build time
export async function generateStaticParams() {
  try {
    console.log('Attempting to fetch posts for static generation...');
    const posts = await fetchPosts();

    if (!posts || posts.length === 0) {
      console.warn('No posts found during static generation, returning empty array');
      return [];
    }

    console.log(`Successfully fetched ${posts.length} posts for static generation`);
    return posts.map(post => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to fetch posts during static generation:', error);

    // Return empty array to allow build to continue
    // Pages will be generated on-demand when requested
    console.warn('Falling back to on-demand generation for post pages');
    return [];
  }
}

// Generate dynamic metadata for each post page
export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | ShareVault',
      description: 'The requested post could not be found on ShareVault.',
    };
  }

  const postUrl = `${SEO_CONFIG.siteUrl}/${post.slug}`;
  const postTitle = post.title;
  const postDescription = post.meta_description || post.excerpt || `Read "${post.title}" - Beautiful Hindi Shayari and Quotes on ShareVault. Perfect for WhatsApp, Instagram, and Facebook sharing.`;
  const postImage = post.featured_image_url || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.images.ogImage}`;

  // Generate SEO-optimized keywords based on content
  const postKeywords = [
    ...(post.tags || []),
    'Hindi Shayari',
    'Quotes',
    'Status',
    'ShareVault'
  ];

  // Add category-specific keywords
  let categoryKeywords: string[] = [];

  // Get category name from post_categories relationship or fallback
  const categoryName = post.post_categories?.[0]?.categories?.name ||
                      post.post_categories?.[0]?.categories?.slug ||
                      '';

  if (categoryName) {
    const category = categoryName.toLowerCase();
    if (category.includes('love') || category.includes('romantic') || category.includes('pyaar')) {
      categoryKeywords = SEO_CONFIG.keywords.love;
    } else if (category.includes('sad') || category.includes('dukh') || category.includes('gam')) {
      categoryKeywords = SEO_CONFIG.keywords.sad;
    } else if (category.includes('friend') || category.includes('dosti') || category.includes('yaari')) {
      categoryKeywords = SEO_CONFIG.keywords.friendship;
    } else if (category.includes('motivational') || category.includes('inspirational') || category.includes('success')) {
      categoryKeywords = SEO_CONFIG.keywords.motivational;
    }
  }

  const allKeywords = [...SEO_CONFIG.keywords.global, ...categoryKeywords, ...postKeywords];

  return {
    title: `${postTitle} | ShareVault`,
    description: postDescription,
    keywords: allKeywords,
    authors: [{ name: post.users?.display_name || post.users?.full_name || 'ShareVault Team' }],
    creator: 'ShareVault',
    publisher: 'ShareVault',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: postTitle,
      description: postDescription,
      url: postUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: postTitle,
        },
      ],
      locale: 'hi_IN',
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.users?.display_name || post.users?.full_name || 'ShareVault Team'],
      section: categoryName || 'Shayari',
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: postTitle,
      description: postDescription,
      images: [postImage],
      creator: SEO_CONFIG.social.twitter,
      site: SEO_CONFIG.social.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:published_time': post.created_at,
      'article:modified_time': post.updated_at,
      'article:author': post.users?.display_name || post.users?.full_name || 'ShareVault Team',
      'article:section': categoryName || 'Shayari',
      'article:tag': post.tags?.join(', ') || 'Hindi Shayari',
    },
  };
}


export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await fetchPostBySlug(resolvedParams.slug);
  const allPosts = await fetchPosts(); // For related posts sidebar

  if (!post) {
    notFound();
  }

  // Generate structured data for the post
  const structuredData = generateStructuredData('article', {
    title: post.title,
    description: post.meta_description || post.excerpt,
    image: post.featured_image_url,
    url: `${SEO_CONFIG.siteUrl}/${post.slug}`,
    publishedAt: post.created_at,
    updatedAt: post.updated_at,
    author: post.users?.display_name || post.users?.full_name || 'ShareVault Team'
  });

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Content */}
      <PostDetail post={post} allPosts={allPosts} />
    </>
  );
}
