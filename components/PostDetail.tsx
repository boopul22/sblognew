
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { Post, Category } from '../types';
import { EyeIcon } from './Icons';
import ShayariDetailCard from './ShayariDetailCard';
import { useLanguage } from '../contexts/LanguageContext';
import { handleShare as shareUtilsHandleShare, getShareText, trackShare } from '../lib/shareUtils';
import { parseContentWithBlockquotes, renderParsedContent } from '../lib/contentParser';

interface Comment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  parent_id?: string;
  replies?: Comment[];
}

interface PostDetailProps {
  post: Post;
  allPosts: Post[];
}

const PostDetail: React.FC<PostDetailProps> = ({ post, allPosts }) => {
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthorName, setCommentAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [viewCount, setViewCount] = useState(post.view_count || 0);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Load comments and track view on component mount
  useEffect(() => {
    loadComments();
    trackPageView();
  }, [post.id]);

  // API Functions
  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`/api/comments?postId=${post.id}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const trackPageView = async () => {
    try {
      const response = await fetch(`/api/views/${post.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.success && data.counted) {
        setViewCount(data.viewCount);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '' || commentAuthorName.trim() === '') return;

    try {
      setIsSubmittingComment(true);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          content: newComment.trim(),
          authorName: commentAuthorName.trim(),
          authorEmail: authorEmail.trim() || null
        })
      });

      const data = await response.json();

      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment('');
        setCommentAuthorName('');
        setAuthorEmail('');
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async (platform: string) => {
    const shareData = getShareText(post, 'post');

    try {
      await trackShare(platform, post.id, 'post');

      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareData.url);
        setIsModalOpen(true);
        setTimeout(() => setIsModalOpen(false), 2000);
      } else {
        const success = await shareUtilsHandleShare({ platform: platform as any, data: shareData });
        if (!success) {
          console.error('Failed to share');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return language === 'hi' ? 'अभी' : 'Just now';
    } else if (diffInMinutes < 60) {
      return language === 'hi' ? `${diffInMinutes} मिनट पहले` : `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return language === 'hi' ? `${hours} घंटे पहले` : `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return language === 'hi' ? `${days} दिन पहले` : `${days} days ago`;
    }
  };





  const formattedDate = new Date(post.published_at || new Date()).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const title = language === 'hi' ? post.title : (post.title_en_hi || post.title);
  const authorName = language === 'hi' ? (post.users?.display_name || 'Unknown') : (post.users?.display_name_en_hi || post.users?.display_name || 'Unknown');
  const categoryName = language === 'hi' ? post.post_categories?.[0]?.categories.name : (post.post_categories?.[0]?.categories.name_en_hi || post.post_categories?.[0]?.categories.name);
  const categorySlug = post.post_categories?.[0]?.categories.slug;
  const authorAbout = language === 'hi' ? 'Hindi literature ke lover aur shayari ke shaukeen.' : 'A lover of Hindi literature and fond of shayari.';

  // Parse post content to extract blockquotes for special rendering
  const parsedContent = useMemo(() => {
    if (!post.content) return [];
    return parseContentWithBlockquotes(post.content);
  }, [post.content]);

  const handleCopySuccess = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsModalOpen(false), 2000);
  };
  
  const totalLikes = useMemo(() => post.shayariCollection?.reduce((sum, s) => sum + s.likes, 0) || 0, [post.shayariCollection]);
  const totalShares = useMemo(() => post.shayariCollection?.reduce((sum, s) => sum + s.shares, 0) || 0, [post.shayariCollection]);
  const relatedPosts = allPosts.filter(p => p.id !== post.id && p.post_categories?.some(pc => post.post_categories?.map(ppc => ppc.categories.slug).includes(pc.categories.slug))).slice(0, 3);
  const popularCategories = useMemo(() => {
    const allCategories: Category[] = [];
    allPosts.forEach(p => {
        p.post_categories?.forEach(pc => {
            if (!allCategories.find(c => c.id === pc.categories.id)) {
                allCategories.push(pc.categories);
            }
        });
    });
    return allCategories.slice(0, 5);
  }, [allPosts]);


  return (
    <>
      <nav className="bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm sticky top-20 z-30 border-b border-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-secondary-text dark:text-dark-secondary-text truncate">
            <Link href="/" className="hover:text-primary dark:hover:text-dark-primary cursor-pointer">{t('home')}</Link>
            <span className="mx-2">/</span>
            {categorySlug && <Link href={`/?category=${categorySlug}`} className="hover:text-primary dark:hover:text-dark-primary truncate">{categoryName || 'Shayari'}</Link>}
            <span className="mx-2">/</span>
            <span className="font-semibold text-primary-text dark:text-dark-primary-text truncate">{title}</span>
          </div>
        </div>
      </nav>

      <main className="main-content py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Main Content */}
            <article className="w-full lg:w-2/3 xl:w-3/4 bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg">
              {/* Featured Image */}
              {post.featured_image_url && (
                <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-t-xl">
                  <img
                    src={post.featured_image_url}
                    alt={title}
                    className="w-full h-64 md:h-80 lg:h-96 object-contain rounded-t-xl"
                  />
                </div>
              )}

              <header className="p-6 md:p-8 border-b border-border dark:border-dark-border bg-gradient-to-br from-primary/5 to-primary/0 dark:from-dark-primary/10 dark:to-dark-primary/0">
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary-text dark:text-dark-primary-text text-center mb-6">{title}</h1>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
                  <div className="flex items-center gap-4">
                    {post.users?.avatar_url ? (
                      <img src={post.users.avatar_url} alt={authorName} className="w-14 h-14 rounded-full border-2 border-primary/50" />
                    ) : (
                      <div className="w-14 h-14 rounded-full border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                        {authorName?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-primary-text dark:text-dark-primary-text">{authorName}</h3>
                      <p className="text-secondary-text dark:text-dark-secondary-text">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-secondary-text dark:text-dark-secondary-text">
                      <span className="flex items-center gap-1.5"><EyeIcon className="w-4 h-4" /> {post.view_count.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')} {language === 'hi' ? 'बार देखा गया' : 'views'}</span>
                      <span className="flex items-center gap-1.5">❤️ {totalLikes.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')} {language === 'hi' ? 'पसंद' : 'likes'}</span>
                      <span className="flex items-center gap-1.5">💬 {comments.length.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')} {language === 'hi' ? 'टिप्पणियां' : 'comments'}</span>
                      <span className="flex items-center gap-1.5">📤 {totalShares.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')} {language === 'hi' ? 'शेयर' : 'shares'}</span>
                  </div>
                </div>
              </header>

              {/* Tags Section */}
              {post.post_tags && post.post_tags.length > 0 && (
                <div className="px-6 md:px-8 py-4 border-b border-border dark:border-dark-border">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mr-2">
                      {language === 'hi' ? 'टैग:' : 'Tags:'}
                    </span>
                    {post.post_tags.map(pt => (
                      <span
                        key={pt.tags.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200"
                        style={{
                          backgroundColor: `${pt.tags.color}20`,
                          color: pt.tags.color,
                          border: `1px solid ${pt.tags.color}40`
                        }}
                      >
                        #{language === 'hi' ? pt.tags.name : (pt.tags.name_en_hi || pt.tags.name)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Content - Enhanced with BlockquoteCard components */}
              {post.content && (
                <div className="p-6 md:p-8">
                  <div className="post-content">
                    {renderParsedContent(parsedContent)}
                  </div>
                </div>
              )}

              {/* Shayari Collection - Original clean rendering */}
              <div className="p-6 md:p-8 space-y-8">
                {post.shayariCollection?.map(shayari => (
                  <ShayariDetailCard key={shayari.id} shayari={shayari} onCopy={handleCopySuccess} />
                ))}
              </div>

              <section className="p-6 md:p-8 border-t border-border dark:border-dark-border">
                <h3 className="text-2xl font-bold font-serif mb-6">{t('comments')} ({comments.length})</h3>

                {/* Comment Form */}
                <form onSubmit={submitComment} className="mb-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={commentAuthorName}
                      onChange={(e) => setCommentAuthorName(e.target.value)}
                      className="w-full p-3 rounded-lg border border-border dark:border-dark-border bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder={language === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                      required
                    />
                    <input
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      className="w-full p-3 rounded-lg border border-border dark:border-dark-border bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder={language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}
                    />
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border dark:border-dark-border bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder={t('writeCommentPlaceholder')}
                    rows={3}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="px-6 py-2 bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-full hover:bg-primary-hover dark:hover:bg-dark-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingComment ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Posting...') : t('postComment')}
                  </button>
                </form>

                {/* Comments List */}
                {isLoadingComments ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-secondary-text dark:text-dark-secondary-text">
                      {language === 'hi' ? 'टिप्पणियाँ लोड हो रही हैं...' : 'Loading comments...'}
                    </p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-secondary-text dark:text-dark-secondary-text">
                      {language === 'hi' ? 'अभी तक कोई टिप्पणी नहीं है। पहली टिप्पणी करें!' : 'No comments yet. Be the first to comment!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-dark-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-semibold">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3">
                            <h5 className="font-semibold text-primary-text dark:text-dark-primary-text">{comment.author_name}</h5>
                            <span className="text-xs text-secondary-text dark:text-dark-secondary-text">{formatTimeAgo(comment.created_at)}</span>
                          </div>
                          <p className="text-primary-text/90 dark:text-dark-primary-text/90 mt-1">{comment.content}</p>

                          {/* Render replies if any */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 ml-4 space-y-4 border-l-2 border-border dark:border-dark-border pl-4">
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-dark-primary/10 flex-shrink-0 flex items-center justify-center text-primary text-sm font-semibold">
                                    {reply.author_name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                      <h6 className="font-medium text-primary-text dark:text-dark-primary-text text-sm">{reply.author_name}</h6>
                                      <span className="text-xs text-secondary-text dark:text-dark-secondary-text">{formatTimeAgo(reply.created_at)}</span>
                                    </div>
                                    <p className="text-primary-text/90 dark:text-dark-primary-text/90 mt-1 text-sm">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-1/3 xl:w-1/4 space-y-8">
               <div className="p-6 bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg">
                 <h4 className="text-xl font-bold font-serif pb-3 mb-4 border-b border-border dark:border-dark-border">{t('aboutAuthor')}</h4>
                 <div className="text-center">
                    {post.users?.avatar_url ? (
                     <img src={post.users.avatar_url} alt={authorName} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/50"/>
                   ) : (
                     <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                       {authorName?.charAt(0) || '?'}
                     </div>
                   )}
                    <h5 className="font-semibold text-lg">{authorName}</h5>
                    <p className="text-sm text-secondary-text dark:text-dark-secondary-text mt-2">{authorAbout}</p>
                 </div>
               </div>
               
               <div className="p-6 bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg">
                 <h4 className="text-xl font-bold font-serif pb-3 mb-4 border-b border-border dark:border-dark-border">{t('relatedPosts')}</h4>
                 <div className="space-y-4">
                    {relatedPosts.map(rp => (
                        <Link href={`/${rp.slug}`} key={rp.id} className="cursor-pointer group block">
                             <h5 className="font-semibold group-hover:text-primary dark:group-hover:text-dark-primary">
                                {language === 'hi' ? rp.title : (rp.title_en_hi || rp.title)}
                             </h5>
                             <p className="text-sm text-secondary-text dark:text-dark-secondary-text">
                                {language === 'hi' ? (rp.users?.display_name || 'Unknown') : (rp.users?.display_name_en_hi || rp.users?.display_name || 'Unknown')}
                             </p>
                        </Link>
                    ))}
                 </div>
               </div>

               <div className="p-6 bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg">
                 <h4 className="text-xl font-bold font-serif pb-3 mb-4 border-b border-border dark:border-dark-border">{t('popularCategories')}</h4>
                 <div className="flex flex-wrap gap-2">
                    {popularCategories.map(cat => (
                        <Link href={`/?category=${cat.slug}`} key={cat.id} className="px-3 py-1 text-sm bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary rounded-full hover:bg-primary/20">
                            {language === 'hi' ? cat.name : cat.name_en_hi}
                        </Link>
                    ))}
                 </div>
               </div>
            </aside>
          </div>
        </div>
      </main>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-surface dark:bg-dark-surface p-8 rounded-lg shadow-2xl text-center">
                <span className="text-5xl" role="img" aria-label="Success">✅</span>
                <p className="text-lg font-semibold mt-4">{t('copySuccess')}</p>
            </div>
        </div>
      )}
    </>
  );
};

export default PostDetail;
