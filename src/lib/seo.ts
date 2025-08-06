import { env } from './env'

// SEO metadata interface
export interface SEOMetadata {
  title?: string
  description?: string
  keywords?: string[]
  author?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  locale?: string
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  canonical?: string
  robots?: string
  viewport?: string
}

// Default SEO configuration
const DEFAULT_SEO: Required<Pick<SEOMetadata, 'siteName' | 'type' | 'locale' | 'twitterCard' | 'robots' | 'viewport'>> = {
  siteName: env.VITE_APP_NAME,
  type: 'website',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
}

// Generate meta tags
export function generateMetaTags(metadata: SEOMetadata): string {
  const {
    title,
    description,
    keywords,
    author,
    image,
    url,
    type = DEFAULT_SEO.type,
    publishedTime,
    modifiedTime,
    section,
    tags,
    locale = DEFAULT_SEO.locale,
    siteName = DEFAULT_SEO.siteName,
    twitterCard = DEFAULT_SEO.twitterCard,
    twitterSite,
    twitterCreator,
    canonical,
    robots = DEFAULT_SEO.robots,
    viewport = DEFAULT_SEO.viewport,
  } = metadata

  const metaTags: string[] = []

  // Basic meta tags
  if (title) {
    metaTags.push(`<title>${escapeHtml(title)}</title>`)
    metaTags.push(`<meta property="og:title" content="${escapeHtml(title)}" />`)
    metaTags.push(`<meta name="twitter:title" content="${escapeHtml(title)}" />`)
  }

  if (description) {
    metaTags.push(`<meta name="description" content="${escapeHtml(description)}" />`)
    metaTags.push(`<meta property="og:description" content="${escapeHtml(description)}" />`)
    metaTags.push(`<meta name="twitter:description" content="${escapeHtml(description)}" />`)
  }

  if (keywords && keywords.length > 0) {
    metaTags.push(`<meta name="keywords" content="${keywords.map(escapeHtml).join(', ')}" />`)
  }

  if (author) {
    metaTags.push(`<meta name="author" content="${escapeHtml(author)}" />`)
  }

  // Open Graph tags
  metaTags.push(`<meta property="og:type" content="${type}" />`)
  metaTags.push(`<meta property="og:locale" content="${locale}" />`)
  metaTags.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}" />`)

  if (url) {
    metaTags.push(`<meta property="og:url" content="${escapeHtml(url)}" />`)
  }

  if (image) {
    metaTags.push(`<meta property="og:image" content="${escapeHtml(image)}" />`)
    metaTags.push(`<meta name="twitter:image" content="${escapeHtml(image)}" />`)
  }

  // Article-specific tags
  if (type === 'article') {
    if (publishedTime) {
      metaTags.push(`<meta property="article:published_time" content="${publishedTime}" />`)
    }
    if (modifiedTime) {
      metaTags.push(`<meta property="article:modified_time" content="${modifiedTime}" />`)
    }
    if (section) {
      metaTags.push(`<meta property="article:section" content="${escapeHtml(section)}" />`)
    }
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        metaTags.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`)
      })
    }
    if (author) {
      metaTags.push(`<meta property="article:author" content="${escapeHtml(author)}" />`)
    }
  }

  // Twitter Card tags
  metaTags.push(`<meta name="twitter:card" content="${twitterCard}" />`)
  if (twitterSite) {
    metaTags.push(`<meta name="twitter:site" content="${escapeHtml(twitterSite)}" />`)
  }
  if (twitterCreator) {
    metaTags.push(`<meta name="twitter:creator" content="${escapeHtml(twitterCreator)}" />`)
  }

  // Other meta tags
  if (canonical) {
    metaTags.push(`<link rel="canonical" href="${escapeHtml(canonical)}" />`)
  }

  metaTags.push(`<meta name="robots" content="${robots}" />`)
  metaTags.push(`<meta name="viewport" content="${viewport}" />`)

  return metaTags.join('\n')
}

// Generate structured data (JSON-LD)
export function generateStructuredData(data: any): string {
  const structuredData = {
    '@context': 'https://schema.org',
    ...data,
  }

  return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
}

// Generate article structured data
export function generateArticleStructuredData(article: {
  title: string
  description: string
  image?: string
  url: string
  author: {
    name: string
    url?: string
  }
  publishedTime: string
  modifiedTime?: string
  category?: string
  tags?: string[]
}): string {
  const structuredData = {
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: env.VITE_APP_NAME,
      url: env.VITE_APP_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }

  if (article.category) {
    structuredData['articleSection'] = article.category
  }

  if (article.tags && article.tags.length > 0) {
    structuredData['keywords'] = article.tags.join(', ')
  }

  return generateStructuredData(structuredData)
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{
  name: string
  url: string
}>): string {
  const structuredData = {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }

  return generateStructuredData(structuredData)
}

// Generate website structured data
export function generateWebsiteStructuredData(): string {
  const structuredData = {
    '@type': 'WebSite',
    name: env.VITE_APP_NAME,
    url: env.VITE_APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${env.VITE_APP_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return generateStructuredData(structuredData)
}

// Generate organization structured data
export function generateOrganizationStructuredData(organization: {
  name: string
  url: string
  logo?: string
  description?: string
  contactPoint?: {
    telephone?: string
    email?: string
    contactType?: string
  }
  sameAs?: string[]
}): string {
  const structuredData = {
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    logo: organization.logo,
    description: organization.description,
    contactPoint: organization.contactPoint ? {
      '@type': 'ContactPoint',
      ...organization.contactPoint,
    } : undefined,
    sameAs: organization.sameAs,
  }

  return generateStructuredData(structuredData)
}

// Utility functions
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Generate sitemap entry
export function generateSitemapEntry(url: string, options: {
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
} = {}): string {
  const { lastmod, changefreq = 'weekly', priority = 0.5 } = options

  let entry = `  <url>\n    <loc>${escapeHtml(url)}</loc>\n`
  
  if (lastmod) {
    entry += `    <lastmod>${lastmod}</lastmod>\n`
  }
  
  entry += `    <changefreq>${changefreq}</changefreq>\n`
  entry += `    <priority>${priority}</priority>\n`
  entry += `  </url>`

  return entry
}

// Generate robots.txt content
export function generateRobotsTxt(options: {
  allowAll?: boolean
  disallowPaths?: string[]
  sitemapUrl?: string
  crawlDelay?: number
} = {}): string {
  const {
    allowAll = true,
    disallowPaths = [],
    sitemapUrl,
    crawlDelay,
  } = options

  let robotsTxt = 'User-agent: *\n'

  if (allowAll) {
    robotsTxt += 'Allow: /\n'
  }

  disallowPaths.forEach(path => {
    robotsTxt += `Disallow: ${path}\n`
  })

  if (crawlDelay) {
    robotsTxt += `Crawl-delay: ${crawlDelay}\n`
  }

  if (sitemapUrl) {
    robotsTxt += `\nSitemap: ${sitemapUrl}\n`
  }

  return robotsTxt
}
