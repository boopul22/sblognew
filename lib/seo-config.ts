// SEO Configuration for ShareVault
export const SEO_CONFIG = {
  // Site Information
  siteName: 'ShareVault',
  siteUrl: 'https://www.sharevault.in',
  siteDescription: 'India\'s largest collection of Hindi Shayari, Love Quotes, Romantic Poetry, and Festival Wishes. Perfect for WhatsApp, Instagram, and Facebook sharing.',
  
  // Default Meta Tags
  defaultTitle: 'ShareVault | Best Hindi Shayari, Quotes, Status & Wishes Collection',
  titleTemplate: '%s | ShareVault - Best Hindi Shayari, Quotes & Status',
  
  // Keywords for different categories
  keywords: {
    global: [
      'Hindi Shayari',
      'Love Shayari',
      'Sad Shayari',
      'Romantic Quotes',
      'Hindi Status',
      'WhatsApp Status',
      'Instagram Captions',
      'Festival Wishes',
      'Birthday Wishes',
      'Friendship Shayari',
      'Motivational Quotes',
      'Hindi Poetry',
      'Urdu Shayari',
      'ShareVault'
    ],
    love: [
      'Love Shayari',
      'Romantic Shayari',
      'Pyaar Shayari',
      'Mohabbat Shayari',
      'Love Quotes Hindi',
      'Romantic Status',
      'Love Poetry Hindi'
    ],
    sad: [
      'Sad Shayari',
      'Dukh Shayari',
      'Gam Shayari',
      'Broken Heart Shayari',
      'Udas Shayari',
      'Sad Quotes Hindi'
    ],
    friendship: [
      'Dosti Shayari',
      'Friendship Shayari',
      'Yaari Shayari',
      'Best Friend Quotes',
      'Dost Shayari'
    ],
    motivational: [
      'Motivational Shayari',
      'Inspirational Quotes Hindi',
      'Success Shayari',
      'Positive Thinking Quotes'
    ]
  },
  
  // Social Media
  social: {
    twitter: '@ShareVault',
    facebook: 'https://www.facebook.com/sharevault',
    instagram: 'https://www.instagram.com/sharevault',
    youtube: 'https://www.youtube.com/sharevault'
  },

  // Verification Codes
  verification: {
    google: 'xYrL6NXjzcD2Wfu5TxQeBwH_aACAOGPhPj1rEEGX3Oc',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    bing: 'your-bing-verification-code'
  },
  
  // Images
  images: {
    logo: '/logo.png',
    ogImage: '/og-image.jpg',
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png'
  },
  
  // Structured Data Templates
  structuredData: {
    organization: {
      '@type': ['Person', 'Organization'],
      name: 'ShareVault',
      alternateName: 'ShareVault.in',
      url: 'https://www.sharevault.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.sharevault.in/logo.png',
        width: 350,
        height: 70
      }
    },
    website: {
      '@type': 'WebSite',
      name: 'ShareVault',
      alternateName: 'ShareVault - Hindi Shayari & Quotes',
      description: 'India\'s largest collection of Hindi Shayari, Love Quotes, Romantic Poetry, and Festival Wishes',
      inLanguage: 'hi-IN'
    }
  }
};

// Generate meta tags for different page types
export function generateMetaTags(pageType: string, customData?: any) {
  const baseKeywords = SEO_CONFIG.keywords.global;
  let specificKeywords: string[] = [];
  let title = SEO_CONFIG.defaultTitle;
  let description = SEO_CONFIG.siteDescription;
  
  switch (pageType) {
    case 'love':
      specificKeywords = SEO_CONFIG.keywords.love;
      title = 'Love Shayari in Hindi | Romantic Quotes & Status | ShareVault';
      description = 'Best collection of Love Shayari in Hindi, Romantic Quotes, and Pyaar Status. Express your feelings with beautiful Hindi love poetry perfect for WhatsApp and Instagram.';
      break;
      
    case 'sad':
      specificKeywords = SEO_CONFIG.keywords.sad;
      title = 'Sad Shayari in Hindi | Dukh Bhari Shayari | ShareVault';
      description = 'Heart-touching Sad Shayari in Hindi, Dukh Bhari Shayari, and emotional quotes. Perfect for expressing your feelings during tough times.';
      break;
      
    case 'friendship':
      specificKeywords = SEO_CONFIG.keywords.friendship;
      title = 'Dosti Shayari | Friendship Quotes in Hindi | ShareVault';
      description = 'Beautiful Dosti Shayari and Friendship Quotes in Hindi. Celebrate your bond with best friends using these heartfelt messages.';
      break;
      
    case 'motivational':
      specificKeywords = SEO_CONFIG.keywords.motivational;
      title = 'Motivational Shayari | Inspirational Quotes Hindi | ShareVault';
      description = 'Powerful Motivational Shayari and Inspirational Quotes in Hindi to boost your confidence and achieve success in life.';
      break;
      
    case 'post':
      if (customData?.title) {
        title = `${customData.title} | ShareVault`;
        description = customData.excerpt || customData.description || description;
      }
      break;
  }
  
  return {
    title,
    description,
    keywords: [...baseKeywords, ...specificKeywords].join(', '),
    openGraph: {
      title,
      description,
      url: customData?.url || SEO_CONFIG.siteUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: customData?.image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.images.ogImage}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'hi_IN',
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [customData?.image || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.images.ogImage}`],
      creator: SEO_CONFIG.social.twitter,
      site: SEO_CONFIG.social.twitter
    }
  };
}

// Generate structured data for different content types
export function generateStructuredData(type: string, data?: any) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...SEO_CONFIG.structuredData.organization,
        '@id': `${SEO_CONFIG.siteUrl}/#organization`
      },
      {
        ...SEO_CONFIG.structuredData.website,
        '@id': `${SEO_CONFIG.siteUrl}/#website`,
        url: SEO_CONFIG.siteUrl,
        publisher: { '@id': `${SEO_CONFIG.siteUrl}/#organization` }
      }
    ]
  };
  
  if (type === 'article' && data) {
    baseStructure['@graph'].push({
      '@type': 'Article',
      '@id': `${data.url}/#article`,
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedAt,
      dateModified: data.updatedAt,
      author: {
        '@type': 'Organization',
        '@id': `${SEO_CONFIG.siteUrl}/#organization`
      },
      publisher: {
        '@id': `${SEO_CONFIG.siteUrl}/#organization`
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url
      },
      inLanguage: 'hi-IN'
    });
  }
  
  return baseStructure;
}

// SEO-friendly URL generation
export function generateSEOUrl(title: string, type: 'post' | 'category' = 'post'): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
    
  return type === 'category' ? `/category/${slug}` : `/${slug}`;
}

// Breadcrumb generation
export function generateBreadcrumbs(path: string[]) {
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SEO_CONFIG.siteUrl
    }
  ];
  
  path.forEach((item, index) => {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: `${SEO_CONFIG.siteUrl}${item.url}`
    });
  });
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
  };
}
