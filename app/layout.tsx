import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Lora, Noto_Sans_Devanagari } from 'next/font/google';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PerformanceMonitor from '../components/PerformanceMonitor';
import './globals.css';


const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const lora = Lora({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-lora',
  preload: true,
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--font-devanagari',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: '%s | ShareVault - Best Hindi Shayari, Quotes & Status',
    default: 'ShareVault | Best Hindi Shayari, Quotes, Status & Wishes Collection',
  },
  description: 'ShareVault - India\'s largest collection of Hindi Shayari, Love Quotes, Sad Status, Romantic Poetry, Friendship Shayari, and Festival Wishes. Download beautiful DP images and share heartfelt messages in Hindi and Hinglish. Perfect for WhatsApp, Instagram, and Facebook.',
  keywords: [
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
    'Dosti Shayari',
    'Bewafa Shayari',
    'Good Morning Quotes',
    'Good Night Shayari',
    'Love Status',
    'Hindi Quotes',
    'Shayari Collection'
  ],
  authors: [{ name: 'ShareVault Team' }],
  creator: 'ShareVault',
  publisher: 'ShareVault',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.sharevault.in'),
  alternates: {
    canonical: 'https://www.sharevault.in',
    languages: {
      'hi-IN': 'https://www.sharevault.in',
      'en-IN': 'https://www.sharevault.in',
    },
  },
  openGraph: {
    title: 'ShareVault | Best Hindi Shayari, Quotes, Status & Wishes Collection',
    description: 'India\'s largest collection of Hindi Shayari, Love Quotes, Romantic Poetry, and Festival Wishes. Perfect for WhatsApp, Instagram, and Facebook sharing.',
    url: 'https://www.sharevault.in',
    siteName: 'ShareVault',
    images: [
      {
        url: 'https://www.sharevault.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShareVault - Best Hindi Shayari and Quotes Collection',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShareVault | Best Hindi Shayari, Quotes & Status Collection',
    description: 'India\'s largest collection of Hindi Shayari, Love Quotes, and Festival Wishes. Perfect for social media sharing.',
    images: ['https://www.sharevault.in/og-image.jpg'],
    creator: '@ShareVault',
    site: '@ShareVault',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Person", "Organization"],
      "@id": "https://www.sharevault.in/#organization",
      "name": "ShareVault",
      "alternateName": "ShareVault.in",
      "url": "https://www.sharevault.in",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.sharevault.in/#logo",
        "url": "https://www.sharevault.in/logo.png",
        "contentUrl": "https://www.sharevault.in/logo.png",
        "caption": "ShareVault",
        "inLanguage": "hi-IN",
        "width": 350,
        "height": 70
      },
      "image": {
        "@id": "https://www.sharevault.in/#logo"
      },
      "sameAs": [
        "https://www.facebook.com/sharevault",
        "https://www.twitter.com/sharevault",
        "https://www.instagram.com/sharevault",
        "https://www.youtube.com/sharevault"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.sharevault.in/#website",
      "url": "https://www.sharevault.in",
      "name": "ShareVault",
      "alternateName": "ShareVault - Hindi Shayari & Quotes",
      "description": "India's largest collection of Hindi Shayari, Love Quotes, Romantic Poetry, and Festival Wishes",
      "publisher": {
        "@id": "https://www.sharevault.in/#organization"
      },
      "inLanguage": "hi-IN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.sharevault.in/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "CollectionPage",
      "@id": "https://www.sharevault.in/#webpage",
      "url": "https://www.sharevault.in/",
      "name": "ShareVault | Best Hindi Shayari, Quotes, Status & Wishes Collection",
      "description": "India's largest collection of Hindi Shayari, Love Quotes, Romantic Poetry, and Festival Wishes. Perfect for WhatsApp, Instagram, and Facebook sharing.",
      "about": {
        "@id": "https://www.sharevault.in/#organization"
      },
      "isPartOf": {
        "@id": "https://www.sharevault.in/#website"
      },
      "inLanguage": "hi-IN",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Hindi Shayari and Quotes Collection",
        "description": "Curated collection of the best Hindi Shayari, Love Quotes, and Status messages",
        "numberOfItems": "1000+"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${inter.variable} ${lora.variable} ${notoSansDevanagari.variable}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ShareVault" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev" />
        <link rel="preconnect" href="https://r2cdn.perplexity.ai" />
        <link rel="preload" href="https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-background dark:bg-dark-background text-primary-text dark:text-dark-primary-text font-sans">
        <PerformanceMonitor />
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={<div className="h-20 bg-surface/80 dark:bg-dark-surface/80"></div>}>
                <Header />
              </Suspense>
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
