"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'hi' | 'en_hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define translations
const translations: Record<Language, Record<string, string>> = {
  hi: {
    shayariBlogTitle: 'Shayari Blog',
    home: 'Home',
    categories: 'Categories',
    authors: 'Authors',
    about: 'About Us',
    searchPlaceholder: 'Search karo shayari...',
    langToggle: 'EN',
    latestShayari: 'Latest Shayari',
    noShayariFound: 'Koi shayari nahi mili',
    noShayariFoundDesc: 'Please apna search ya filter change karo.',
    loadMore: 'Aur Load Karo',
    readMore: 'Padho →',
    share: 'Share',
    author: 'Author',
    authorColon: 'Author:',
    postedOn: 'Posted on',
    backToHome: 'Home',
    relatedPosts: 'Related Posts',
    popularCategories: 'Popular Categories',
    aboutAuthor: 'Author ke baare mein',
    comments: 'Comments',
    writeCommentPlaceholder: 'Apna comment likho...',
    postComment: 'Comment Post Karo',
    copySuccess: 'Shayari successfully copy ho gayi!',
    allCategories: 'Saare Categories',
    popularShayari: 'Popular Shayari',
    authorSpotlight: 'Author Spotlight',
    newsletter: 'Newsletter',
    newsletterDesc: 'Daily nayi shayari pao.',
    subscribe: 'Subscribe',
    readNow: 'Abhi Padho',
    todaysSpecial: 'Aaj ki Special Shayari',
    specialDesc: 'Love, sadness aur khushi ki precious shayaris.',
    authorSpotlightDesc: 'Love aur life ki shayari ke famous author.',
    viewProfile: 'Profile Dekho',
    yourEmail: 'Apka email',
    copy: 'Copy',
    download: 'Download',
  },
  en_hi: {
    shayariBlogTitle: 'Shayari Blog',
    home: 'Home',
    categories: 'Categories',
    authors: 'Authors',
    about: 'About Us',
    searchPlaceholder: 'Search for shayari...',
    langToggle: 'हि',
    latestShayari: 'Latest Shayari',
    noShayariFound: 'No shayari found',
    noShayariFoundDesc: 'Please change your search or filter.',
    loadMore: 'Load More',
    readMore: 'Read →',
    share: 'Share',
    author: 'Author',
    authorColon: 'Author:',
    postedOn: 'Posted on',
    backToHome: 'Home',
    relatedPosts: 'Related Posts',
    popularCategories: 'Popular Categories',
    aboutAuthor: 'About The Author',
    comments: 'Comments',
    writeCommentPlaceholder: 'Write your comment...',
    postComment: 'Post Comment',
    copySuccess: 'Shayari copied successfully!',
    allCategories: 'All Categories',
    popularShayari: 'Popular Shayari',
    authorSpotlight: 'Author Spotlight',
    newsletter: 'Newsletter',
    newsletterDesc: 'Get new shayari daily.',
    subscribe: 'Subscribe',
    readNow: 'Read Now',
    todaysSpecial: "Today's Special Shayari",
    specialDesc: 'Precious shayaris of love, sadness, and joy.',
    authorSpotlightDesc: 'Famous author of love and life shayari.',
    viewProfile: 'View Profile',
    yourEmail: 'Your email',
    copy: 'Copy',
    download: 'Download',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en_hi');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'hi' ? 'en_hi' : 'hi'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
