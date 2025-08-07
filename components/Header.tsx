
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon, SunIcon, MoonIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams?.get('q') || '');
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm sticky top-0 z-40 border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-3xl font-bold text-primary dark:text-dark-primary font-serif">
                {t('shayariBlogTitle')}
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium text-primary-text dark:text-dark-primary-text hover:text-primary dark:hover:text-dark-primary transition-colors">{t('home')}</Link>
            <Link href="/?category=all" className="font-medium text-primary-text dark:text-dark-primary-text hover:text-primary dark:hover:text-dark-primary transition-colors">{t('categories')}</Link>
            <Link href="/authors" className="font-medium text-primary-text dark:text-dark-primary-text hover:text-primary dark:hover:text-dark-primary transition-colors">{t('authors')}</Link>
            <Link href="/about" className="font-medium text-primary-text dark:text-dark-primary-text hover:text-primary dark:hover:text-dark-primary transition-colors">{t('about')}</Link>
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
             <div className="relative">
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-full py-2 pl-4 pr-10 w-32 md:w-56 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-primary-text dark:text-dark-primary-text"
                />
                <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text dark:text-dark-secondary-text">
                    <SearchIcon className="w-5 h-5" />
                </button>
            </div>
            <button 
              onClick={toggleLanguage}
              className="border border-primary text-primary dark:border-dark-primary dark:text-dark-primary rounded-full px-3 py-2 text-sm font-semibold hover:bg-primary/5 dark:hover:bg-dark-primary/10 transition-colors"
            >
                {t('langToggle')}
            </button>
            <button 
              onClick={toggleTheme}
              className="text-secondary-text dark:text-dark-secondary-text hover:text-primary dark:hover:text-dark-primary transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
