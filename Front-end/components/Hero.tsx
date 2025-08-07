
"use client";

import React from 'react';
import Link from 'next/link';
import type { Post } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
    post?: Post;
}

const Hero: React.FC<HeroProps> = ({ post }) => {
    const { t, language } = useLanguage();

    if (!post) {
        // Render a fallback or skeleton if there's no featured post
        return (
             <section className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border animate-pulse">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </section>
        )
    }

    return (
        <section className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/2 w-full">
                        <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="rounded-lg shadow-md w-full h-full object-cover max-h-80 aspect-video md:aspect-auto"
                        />
                    </div>
                    <div className="md:w-1/2 w-full text-center md:text-left">
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary-text dark:text-dark-primary-text leading-tight">
                            {t('todaysSpecial')}
                        </h2>
                        <p className="mt-4 text-lg text-secondary-text dark:text-dark-secondary-text">
                           {language === 'hi' ? post.title : post.title_en_hi}
                        </p>
                        <Link 
                            href={`/${post.slug}`}
                            className="mt-6 inline-block bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-full px-8 py-3 transition-transform hover:scale-105 cursor-pointer"
                        >
                            {t('readNow')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
