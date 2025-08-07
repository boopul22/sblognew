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
    shayariBlogTitle: 'शायरी ब्लॉग',
    home: 'होम',
    categories: 'श्रेणियाँ',
    authors: 'लेखक',
    about: 'हमारे बारे में',
    searchPlaceholder: 'शायरी खोजें...',
    langToggle: 'EN',
    latestShayari: 'नवीनतम शायरी',
    noShayariFound: 'कोई शायरी नहीं मिली',
    noShayariFoundDesc: 'कृपया अपनी खोज या फ़िल्टर बदलें।',
    loadMore: 'और लोड करें',
    readMore: 'पढ़ें →',
    share: 'शेयर',
    author: 'लेखक',
    authorColon: 'लेखक:',
    postedOn: 'Posted on',
    backToHome: 'होम',
    relatedPosts: 'संबंधित पोस्ट',
    popularCategories: 'लोकप्रिय श्रेणियां',
    aboutAuthor: 'लेखक के बारे में',
    comments: 'टिप्पणियां',
    writeCommentPlaceholder: 'अपनी टिप्पणी लिखें...',
    postComment: 'टिप्पणी पोस्ट करें',
    copySuccess: 'शायरी सफलतापूर्वक कॉपी हो गई!',
    allCategories: 'सभी श्रेणियाँ',
    popularShayari: 'लोकप्रिय शायरी',
    authorSpotlight: 'लेखक स्पॉटलाइट',
    newsletter: 'न्यूज़लेटर',
    newsletterDesc: 'रोज़ाना नई शायरी पाएं।',
    subscribe: 'सब्सक्राइब',
    readNow: 'अभी पढ़ें',
    todaysSpecial: 'आज की खास शायरी',
    specialDesc: 'प्रेम, दुख, खुशी की अनमोल शायरियाँ',
    authorSpotlightDesc: 'प्रेम और जिंदगी की शायरी के मशहूर लेखक।',
    viewProfile: 'प्रोफ़ाइल देखें',
    yourEmail: 'आपका ईमेल',
    copy: 'कॉपी',
    download: 'डाउनलोड',
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
  const [language, setLanguage] = useState<Language>('hi');

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
