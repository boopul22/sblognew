
"use client";

import React from 'react';
import Link from 'next/link';
import { Category, Post } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface WidgetProps {
    title: string;
    children: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({ title, children }) => (
    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg border border-card-border dark:border-dark-card-border">
        <h4 className="text-xl font-bold font-serif text-primary-text dark:text-dark-primary-text pb-3 mb-4 border-b border-border dark:border-dark-border">
            {title}
        </h4>
        {children}
    </div>
);


interface SidebarProps {
    posts: Post[];
    categories: Category[];
    selectedCategory: string;
}

const Sidebar: React.FC<SidebarProps> = ({ posts, categories, selectedCategory }) => {
    const { language, t } = useLanguage();
    const popularPosts = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);
    
    return (
        <aside className="lg:w-1/3 xl:w-1/4 flex-shrink-0 space-y-8">
            <Widget title={t('popularShayari')}>
                <div className="space-y-4">
                    {popularPosts.map(post => (
                        <div key={post.id} className="pb-4 border-b border-border/50 dark:border-dark-border/50 last:border-b-0">
                            <Link href={`/${post.slug}`} className="font-semibold text-primary-text dark:text-dark-primary-text hover:text-primary dark:hover:text-dark-primary cursor-pointer">
                                {language === 'hi' ? post.title : (post.title_en_hi || post.title)}
                            </Link>
                            <p className="text-sm text-secondary-text dark:text-dark-secondary-text mt-1">
                                {t('authorColon')} {language === 'hi' ? (post.users?.display_name || 'Unknown') : (post.users?.display_name_en_hi || post.users?.display_name || 'Unknown')}
                            </p>
                            <span className="text-sm font-medium text-red-500 dark:text-red-400 mt-1 block">{(post.likes || 0).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')} ❤️</span>
                        </div>
                    ))}
                </div>
            </Widget>

            <Widget title={t('categories')}>
                <div className="flex flex-col space-y-2">
                    <Link
                         href="/"
                         className={`text-left p-3 rounded-md transition-colors text-base cursor-pointer ${selectedCategory === 'all' ? 'bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary font-semibold' : 'hover:bg-primary/5 dark:hover:bg-dark-primary/10 text-primary-text dark:text-dark-primary-text'}`}
                    >
                        {t('allCategories')}
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat.id} 
                            href={`/?category=${cat.slug}`}
                            className={`text-left p-3 rounded-md transition-colors text-base cursor-pointer ${selectedCategory === cat.slug ? 'bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary font-semibold' : 'hover:bg-primary/5 dark:hover:bg-dark-primary/10 text-primary-text dark:text-dark-primary-text'}`}
                        >
                            {language === 'hi' ? cat.name : cat.name_en_hi}
                        </Link>
                    ))}
                </div>
            </Widget>
            
            <Widget title={t('authorSpotlight')}>
                <div className="text-center">
                    <img src="https://i.pravatar.cc/150?u=rahul" alt="Author Spotlight" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/50"/>
                    <h5 className="font-semibold text-primary-text dark:text-dark-primary-text text-lg">
                        {language === 'hi' ? 'राहुल शर्मा' : 'Rahul Sharma'}
                    </h5>
                    <p className="text-sm text-secondary-text dark:text-dark-secondary-text mt-2">{t('authorSpotlightDesc')}</p>
                    <button className="mt-4 text-sm font-semibold text-primary dark:text-dark-primary hover:underline">
                        {t('viewProfile')}
                    </button>
                </div>
            </Widget>

             <Widget title={t('newsletter')}>
                <div>
                    <p className="text-sm text-secondary-text dark:text-dark-secondary-text mb-4">{t('newsletterDesc')}</p>
                    <input type="email" placeholder={t('yourEmail')} className="w-full bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"/>
                    <button className="w-full mt-3 bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-md py-2.5">
                        {t('subscribe')}
                    </button>
                </div>
            </Widget>
        </aside>
    );
};

export default Sidebar;
