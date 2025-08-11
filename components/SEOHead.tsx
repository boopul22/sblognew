'use client';

import Head from 'next/head';
import { generateMetaTags, generateStructuredData, SEO_CONFIG } from '../lib/seo-config';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedAt,
  updatedAt,
  author,
  category,
  tags = []
}: SEOHeadProps) {
  const pageUrl = url || SEO_CONFIG.siteUrl;
  const pageTitle = title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle;
  const pageDescription = description || SEO_CONFIG.siteDescription;
  const pageImage = image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.images.ogImage}`;
  const allKeywords = [...SEO_CONFIG.keywords.global, ...keywords, ...tags].join(', ');

  // Generate structured data
  const structuredData = type === 'article' ? 
    generateStructuredData('article', {
      title: pageTitle,
      description: pageDescription,
      image: pageImage,
      url: pageUrl,
      publishedAt,
      updatedAt,
      author
    }) : 
    generateStructuredData('website');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author || 'ShareVault Team'} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content="hi_IN" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:site" content={SEO_CONFIG.social.twitter} />
      <meta name="twitter:creator" content={SEO_CONFIG.social.twitter} />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedAt && <meta property="article:published_time" content={publishedAt} />}
          {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="hi-IN" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}

// Hook for easy SEO management
export function useSEO(props: SEOHeadProps) {
  return {
    title: props.title ? `${props.title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle,
    description: props.description || SEO_CONFIG.siteDescription,
    openGraph: {
      title: props.title ? `${props.title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle,
      description: props.description || SEO_CONFIG.siteDescription,
      url: props.url || SEO_CONFIG.siteUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: props.image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.images.ogImage}`,
          width: 1200,
          height: 630,
          alt: props.title || SEO_CONFIG.siteName
        }
      ],
      locale: 'hi_IN',
      type: props.type || 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: props.title ? `${props.title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle,
      description: props.description || SEO_CONFIG.siteDescription,
      images: [props.image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.images.ogImage}`],
      creator: SEO_CONFIG.social.twitter,
      site: SEO_CONFIG.social.twitter
    },
    keywords: [...SEO_CONFIG.keywords.global, ...(props.keywords || []), ...(props.tags || [])].join(', '),
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
    }
  };
}
