
"use client";

import React from 'react';
import type { Post } from '../types';
import PostCard from './PostCard';
import { useLanguage } from '../contexts/LanguageContext';

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight text-primary-text dark:text-dark-primary-text sm:text-4xl mb-8 font-serif">
          {t('latestShayari')}
      </h2>
      
      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-surface dark:bg-dark-surface rounded-lg border border-border dark:border-dark-border">
          <h3 className="text-xl font-semibold text-primary-text dark:text-dark-primary-text">{t('noShayariFound')}</h3>
          <p className="mt-2 text-secondary-text dark:text-dark-secondary-text">{t('noShayariFoundDesc')}</p>
        </div>
      )}

      {posts.length > 0 && (
          <div className="mt-12 text-center">
              <button 
                onClick={() => alert('सभी शायरी लोड हो चुकी हैं!')}
                className="border border-primary text-primary dark:border-dark-primary dark:text-dark-primary rounded-full px-6 py-3 text-base font-semibold hover:bg-primary/5 dark:hover:bg-dark-primary/10 transition-colors"
              >
                  {t('loadMore')}
              </button>
          </div>
      )}
    </div>
  );
};

export default PostList;
