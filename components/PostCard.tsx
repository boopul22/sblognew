
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Post } from '../types';
import Tag from './Tag';
import { HeartIcon, ShareIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { handleShare, getShareText, trackShare } from '../lib/shareUtils';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { language, t } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  const formattedDate = new Date(post.published_at || new Date()).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Load like status on component mount
  useEffect(() => {
    loadLikeStatus();
  }, [post.id]);

  const loadLikeStatus = async () => {
    try {
      const response = await fetch(`/api/likes?postId=${post.id}`);
      const data = await response.json();

      if (data.success) {
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error loading like status:', error);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when liking
    e.stopPropagation();

    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id })
      });

      const data = await response.json();

      if (data.success) {
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when sharing
    e.stopPropagation();

    const shareData = getShareText(post, 'post');

    try {
      await trackShare('native', post.id, 'post');

      if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url
        });
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert(language === 'hi' ? 'लिंक क्लिपबोर्ड में कॉपी हो गया!' : 'Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') { // User didn't cancel
        alert(language === 'hi' ? 'शेयर नहीं हो सका।' : 'Could not share the post.');
      }
    }
  };
  
  const title = language === 'hi' ? post.title : (post.title_en_hi || post.title);
  const fullExcerpt = language === 'hi' ? (post.excerpt || '') : (post.excerpt_en_hi || post.excerpt || '');

  // Truncate excerpt to maintain visual balance (120 characters max)
  const excerpt = fullExcerpt.length > 120
    ? fullExcerpt.substring(0, 120).trim() + '...'
    : fullExcerpt;

  const authorName = language === 'hi' ? (post.users?.display_name || 'Unknown') : (post.users?.display_name_en_hi || post.users?.display_name || 'Unknown');
  const categoryName = language === 'hi' ? post.post_categories?.[0]?.categories.name : (post.post_categories?.[0]?.categories.name_en_hi || post.post_categories?.[0]?.categories.name);

  return (
    <Link href={`/${post.slug}`} className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer h-full">
        {post.featured_image_url && (
          <div className="aspect-16-10 w-full bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <img className="w-full h-full object-contain" src={post.featured_image_url} alt={title} />
          </div>
        )}
        {!post.featured_image_url && (
          <div className="aspect-16-10 w-full bg-gradient-to-br from-primary/10 to-primary/5 dark:from-dark-primary/20 dark:to-dark-primary/10 flex items-center justify-center flex-shrink-0">
            <div className="text-center text-secondary-text dark:text-dark-secondary-text">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm">{t('noImage') || 'No Image'}</div>
            </div>
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow min-h-0">
            <div className="flex-grow flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <div className="flex-wrap gap-2 flex">
                        {post.post_categories?.slice(0, 1).map(pc => (
                            <Tag key={pc.categories.id} name={categoryName || pc.categories.name} />
                        ))}
                    </div>
                    <span className="text-xs text-secondary-text dark:text-dark-secondary-text">{formattedDate}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-serif font-bold text-primary-text dark:text-dark-primary-text mb-2 group-hover:text-primary dark:group-hover:text-dark-primary line-clamp-2 flex-shrink-0">
                    {title}
                </h3>
                <p className="text-secondary-text dark:text-dark-secondary-text text-sm mb-2 flex-shrink-0">{t('authorColon')} {authorName}</p>
                {excerpt && (
                  <p className="text-primary-text dark:text-dark-primary-text text-sm md:text-base line-clamp-3 leading-relaxed flex-grow">
                    {excerpt}
                  </p>
                )}
            </div>
            
            <div className="mt-auto pt-4 border-t border-border dark:border-dark-border flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                          onClick={handleLikeClick}
                          disabled={isLiking}
                          className="flex items-center space-x-1.5 text-secondary-text dark:text-dark-secondary-text hover:text-red-500 dark:hover:text-red-400 transition-colors z-10 relative disabled:opacity-50"
                        >
                            <HeartIcon className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500 dark:text-red-400' : ''} ${isLiking ? 'animate-pulse' : ''}`} />
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
