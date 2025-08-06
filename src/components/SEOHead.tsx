import { useEffect } from 'react'

import { SEOMetadata, generateMetaTags, generateStructuredData } from '@/lib/seo'
import { env } from '@/lib/env'

interface SEOHeadProps extends SEOMetadata {
  structuredData?: any
  children?: React.ReactNode
}

export function SEOHead({
  title,
  description,
  keywords,
  author,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags,
  locale = 'en_US',
  siteName = env.VITE_APP_NAME,
  twitterCard = 'summary_large_image',
  twitterSite,
  twitterCreator,
  canonical,
  robots = 'index, follow',
  viewport = 'width=device-width, initial-scale=1',
  structuredData,
  children,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Generate and inject meta tags
    const metadata: SEOMetadata = {
      title,
      description,
      keywords,
      author,
      image,
      url,
      type,
      publishedTime,
      modifiedTime,
      section,
      tags,
      locale,
      siteName,
      twitterCard,
      twitterSite,
      twitterCreator,
      canonical,
      robots,
      viewport,
    }

    const metaTagsHtml = generateMetaTags(metadata)
    
    // Remove existing SEO meta tags
    const existingTags = document.querySelectorAll('[data-seo]')
    existingTags.forEach(tag => tag.remove())

    // Create a temporary container to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = metaTagsHtml

    // Add new meta tags to head
    Array.from(tempDiv.children).forEach(element => {
      element.setAttribute('data-seo', 'true')
      document.head.appendChild(element)
    })

    // Add structured data if provided
    if (structuredData) {
      const existingStructuredData = document.querySelector('[data-structured-data]')
      if (existingStructuredData) {
        existingStructuredData.remove()
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-structured-data', 'true')
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        ...structuredData,
      }, null, 2)
      document.head.appendChild(script)
    }

    // Cleanup function
    return () => {
      const seoTags = document.querySelectorAll('[data-seo]')
      seoTags.forEach(tag => tag.remove())
      
      const structuredDataScript = document.querySelector('[data-structured-data]')
      if (structuredDataScript) {
        structuredDataScript.remove()
      }
    }
  }, [
    title,
    description,
    keywords,
    author,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    section,
    tags,
    locale,
    siteName,
    twitterCard,
    twitterSite,
    twitterCreator,
    canonical,
    robots,
    viewport,
    structuredData,
  ])

  return <>{children}</>
}

// Specialized SEO components for different page types

interface ArticleSEOProps {
  title: string
  description: string
  author: {
    name: string
    url?: string
  }
  publishedTime: string
  modifiedTime?: string
  image?: string
  url: string
  category?: string
  tags?: string[]
  keywords?: string[]
}

export function ArticleSEO({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
  category,
  tags,
  keywords,
}: ArticleSEOProps) {
  const structuredData = {
    '@type': 'Article',
    headline: title,
    description,
    image,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: env.VITE_APP_NAME,
      url: env.VITE_APP_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    keywords: tags?.join(', '),
  }

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords || tags}
      author={author.name}
      image={image}
      url={url}
      type="article"
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
      section={category}
      tags={tags}
      canonical={url}
      structuredData={structuredData}
    />
  )
}

interface ProfileSEOProps {
  name: string
  description: string
  image?: string
  url: string
  username?: string
}

export function ProfileSEO({
  name,
  description,
  image,
  url,
  username,
}: ProfileSEOProps) {
  const structuredData = {
    '@type': 'Person',
    name,
    description,
    image,
    url,
    alternateName: username,
  }

  return (
    <SEOHead
      title={`${name} - ${env.VITE_APP_NAME}`}
      description={description}
      author={name}
      image={image}
      url={url}
      type="profile"
      canonical={url}
      structuredData={structuredData}
    />
  )
}

interface CategorySEOProps {
  name: string
  description: string
  url: string
  postCount?: number
}

export function CategorySEO({
  name,
  description,
  url,
  postCount,
}: CategorySEOProps) {
  const title = `${name} - ${env.VITE_APP_NAME}`
  const enhancedDescription = postCount 
    ? `${description} (${postCount} posts)`
    : description

  return (
    <SEOHead
      title={title}
      description={enhancedDescription}
      url={url}
      type="website"
      canonical={url}
    />
  )
}

interface HomeSEOProps {
  description?: string
  keywords?: string[]
}

export function HomeSEO({
  description = `Welcome to ${env.VITE_APP_NAME} - Your source for quality content`,
  keywords = ['blog', 'articles', 'content'],
}: HomeSEOProps) {
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

  return (
    <SEOHead
      title={env.VITE_APP_NAME}
      description={description}
      keywords={keywords}
      url={env.VITE_APP_URL}
      type="website"
      canonical={env.VITE_APP_URL}
      structuredData={structuredData}
    />
  )
}

// Hook for dynamic SEO updates
export function useSEO(metadata: SEOMetadata & { structuredData?: any }) {
  useEffect(() => {
    // This will trigger the SEOHead component's useEffect
    // You can also implement direct DOM manipulation here if needed
  }, [metadata])

  return null
}
