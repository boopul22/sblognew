import React from 'react';
import type { Metadata } from 'next';
import { Inter, Lora, Noto_Sans_Devanagari } from 'next/font/google';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';


const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-lora',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--font-devanagari',
});

export const metadata: Metadata = {
  title: {
    template: '%s | दिल के जज़्बात',
    default: 'दिल के जज़्बात | शायरी ब्लॉग',
  },
  description: 'A Hindi and Hinglish shayari blog with a beautiful, clean, and minimal card-based design. Features light and dark modes, and interactive cards for liking, sharing, and downloading poetry.',
  openGraph: {
    title: 'दिल के जज़्बात | शायरी ब्लॉग',
    description: 'The best place to read and share beautiful Hindi and Hinglish shayari.',
    url: 'https://shayari-blog.com', // Replace with your actual domain
    siteName: 'दिल के जज़्बात',
    images: [
      {
        url: 'https://picsum.photos/seed/og/1200/630', // Replace with your default OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'दिल के जज़्बात | शायरी ब्लॉग',
    description: 'A Hindi and Hinglish shayari blog with a beautiful, clean, and minimal card-based design.',
     images: ['https://picsum.photos/seed/og/1200/630'], // Replace with your default OG image
  },
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
      </head>
      <body className="bg-background dark:bg-dark-background text-primary-text dark:text-dark-primary-text font-sans">
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
