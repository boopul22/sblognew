
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import type { Post } from '../types';
import Tag from './Tag';
import { HeartIcon, ShareIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { language, t } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const formattedDate = new Date(post.published_at || new Date()).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when liking
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when sharing
    e.stopPropagation();
    const shareData = {
      title: language === 'hi' ? post.title : (post.title_en_hi || post.title),
      text: `${language === 'hi' ? (post.excerpt || '') : (post.excerpt_en_hi || post.excerpt || '')}\n\n- ${language === 'hi' ? (post.users?.display_name || 'Unknown') : (post.users?.display_name_en_hi || post.users?.display_name || 'Unknown')}`,
      url: `${window.location.origin}/${post.slug}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        alert('शायरी क्लिपबोर्ड में कॉपी हो गई!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Could not share the post.');
    }
  };
  
  const title = language === 'hi' ? post.title : (post.title_en_hi || post.title);
  const excerpt = language === 'hi' ? (post.excerpt || '') : (post.excerpt_en_hi || post.excerpt || '');
  const authorName = language === 'hi' ? (post.users?.display_name || 'Unknown') : (post.users?.display_name_en_hi || post.users?.display_name || 'Unknown');
  const categoryName = language === 'hi' ? post.post_categories?.[0]?.categories.name : (post.post_categories?.[0]?.categories.name_en_hi || post.post_categories?.[0]?.categories.name);

  return (
    <Link href={`/${post.slug}`} className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer">
        {post.featured_image_url && (
          <img className="h-56 w-full object-cover" src={post.featured_image_url} alt={title} />
        )}
        {!post.featured_image_url && (
          <div className="h-56 w-full bg-gradient-to-br from-primary/10 to-primary/5 dark:from-dark-primary/20 dark:to-dark-primary/10 flex items-center justify-center">
            <div className="text-center text-secondary-text dark:text-dark-secondary-text">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm">{t('noImage') || 'No Image'}</div>
            </div>
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex-wrap gap-2 flex">
                        {post.post_categories?.slice(0, 1).map(pc => (
                            <Tag key={pc.categories.id} name={categoryName || pc.categories.name} />
                        ))}
                    </div>
                    <span className="text-xs text-secondary-text dark:text-dark-secondary-text">{formattedDate}</span>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-primary-text dark:text-dark-primary-text mb-2 group-hover:text-primary dark:group-hover:text-dark-primary">
                    {title}
                </h3>
                <p className="text-secondary-text dark:text-dark-secondary-text text-sm mb-1">{t('authorColon')} {authorName}</p>
                <p className="text-primary-text dark:text-dark-primary-text text-base mb-4">{excerpt}</p>
            </div>
            
            <div className="mt-auto pt-4 border-t border-border dark:border-dark-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={handleLikeClick} className="flex items-center space-x-1.5 text-secondary-text dark:text-dark-secondary-text hover:text-red-500 dark:hover:text-red-400 transition-colors z-10 relative">
                            <HeartIcon className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500 dark:text-red-400' : ''}`} />
                            <span className="text-sm font-medium">{likeCount}</span>
                        </button>
                        <button onClick={handleShareClick} className="flex items-center space-x-1.5 text-secondary-text dark:text-dark-secondary-text hover:text-primary dark:hover:text-dark-primary transition-colors z-10 relative">
                            <ShareIcon className="h-5 w-5" />
                            <span className="text-sm font-medium">{t('share')}</span>
                        </button>
                    </div>
                    <div className="text-sm font-semibold text-primary dark:text-dark-primary group-hover:text-primary-hover dark:group-hover:text-dark-primary-hover">
                        {t('readMore')}
                    </div>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default PostCard;
