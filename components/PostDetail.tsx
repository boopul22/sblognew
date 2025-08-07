
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Post, Category } from '../types';
import { EyeIcon } from './Icons';
import ShayariDetailCard from './ShayariDetailCard';
import { useLanguage } from '../contexts/LanguageContext';

interface PostDetailProps {
  post: Post;
  allPosts: Post[];
}

const PostDetail: React.FC<PostDetailProps> = ({ post, allPosts }) => {
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, author: 'अनिल शर्मा', text: 'बहुत ही सुंदर शायरी है! दिल को छू गई।', time: '2 घंटे पहले', likes: 5 },
    { id: 2, author: 'प्रीति कुमारी', text: 'वाह! क्या बात है। हर शायरी दिल की गहराई से लिखी गई है।', time: '4 घंटे पहले', likes: 8 },
  ]);
  const [newComment, setNewComment] = useState('');

  // Enhanced blockquote functionality
  const enhanceBlockquotes = () => {
    const blockquotes = document.querySelectorAll('.post-content blockquote:not(.enhanced)');

    blockquotes.forEach((blockquote, index) => {
      const originalContent = blockquote.innerHTML;
      const randomLikes = Math.floor(Math.random() * 50) + 10;
      const themes = ['love', 'sad', 'motivational', 'friendship', 'life'];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];

      // Extract text content for sharing
      const textContent = blockquote.textContent || '';

      blockquote.className = `${blockquote.className} enhanced theme-${randomTheme}`;
      blockquote.innerHTML = `
        <div class="blockquote-content">
          <div class="blockquote-text">
            ${originalContent}
          </div>
        </div>
        <div class="blockquote-actions">
          <div class="like-counter">
            <svg class="heart-icon" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="like-count">${randomLikes.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
          </div>
          <div class="action-buttons">
            <button class="action-btn copy-btn" title="${t('copy') || 'Copy'}" data-text="${encodeURIComponent(textContent)}">
              <svg class="copy-icon" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
            <button class="action-btn share-btn" title="${t('share') || 'Share'}" data-text="${encodeURIComponent(textContent)}">
              <svg class="share-icon" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
            <button class="action-btn download-btn" title="${t('download') || 'Download'}" data-text="${encodeURIComponent(textContent)}">
              <svg class="download-icon" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      // Add event listeners for the buttons
      const copyBtn = blockquote.querySelector('.copy-btn');
      const shareBtn = blockquote.querySelector('.share-btn');
      const downloadBtn = blockquote.querySelector('.download-btn');

      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(textContent);

            // Show copied animation
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
              <svg class="copy-icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            `;
            copyBtn.style.backgroundColor = '#10b981';
            copyBtn.style.borderColor = '#10b981';
            copyBtn.style.transform = 'scale(0.95)';
            copyBtn.style.transition = 'all 0.2s ease';

            // Reset after 2 seconds
            setTimeout(() => {
              copyBtn.innerHTML = originalHTML;
              copyBtn.style.backgroundColor = '';
              copyBtn.style.borderColor = '';
              copyBtn.style.transform = '';
            }, 2000);

          } catch (error) {
            console.error('Copy failed:', error);
            // Show error animation
            copyBtn.style.backgroundColor = '#ef4444';
            copyBtn.style.borderColor = '#ef4444';
            copyBtn.style.transform = 'scale(0.95)';
            copyBtn.style.transition = 'all 0.2s ease';

            setTimeout(() => {
              copyBtn.style.backgroundColor = '';
              copyBtn.style.borderColor = '';
              copyBtn.style.transform = '';
            }, 1000);
          }
        });
      }

      if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
          try {
            if (navigator.share) {
              await navigator.share({
                title: 'Shayari from Dil Ke Jazbaat',
                text: textContent,
                url: window.location.href,
              });
            } else {
              await navigator.clipboard.writeText(textContent);
              alert(t('shareNotSupported') || 'Share not supported. Text copied to clipboard.');
            }
          } catch (error) {
            console.error('Share failed:', error);
            alert('Share failed. Please try again.');
          }
        });
      }

      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          // Show download animation
          const originalHTML = downloadBtn.innerHTML;
          downloadBtn.innerHTML = `
            <svg class="download-icon" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          `;
          downloadBtn.style.backgroundColor = '#3b82f6';
          downloadBtn.style.borderColor = '#3b82f6';
          downloadBtn.style.transform = 'scale(0.95)';
          downloadBtn.style.transition = 'all 0.2s ease';

          // Reset after 2 seconds
          setTimeout(() => {
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.style.backgroundColor = '';
            downloadBtn.style.borderColor = '';
            downloadBtn.style.transform = '';
          }, 2000);
        });
      }
    });
  };

  // Run enhancement after component mounts and content changes
  React.useEffect(() => {
    if (post.content) {
      // Small delay to ensure DOM is ready
      setTimeout(enhanceBlockquotes, 100);
    }
  }, [post.content, language, t]);

  const formattedDate = new Date(post.published_at || new Date()).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const title = language === 'hi' ? post.title : (post.title_en_hi || post.title);
  const authorName = language === 'hi' ? (post.users?.display_name || 'Unknown') : (post.users?.display_name_en_hi || post.users?.display_name || 'Unknown');
  const categoryName = language === 'hi' ? post.post_categories?.[0]?.categories.name : (post.post_categories?.[0]?.categories.name_en_hi || post.post_categories?.[0]?.categories.name);
  const categorySlug = post.post_categories?.[0]?.categories.slug;
  const authorAbout = language === 'hi' ? 'हिंदी साहित्य के प्रेमी और शायरी के शौकीन।' : 'A lover of Hindi literature and fond of shayari.';

  const handleCopySuccess = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsModalOpen(false), 2000);
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    const comment = {
        id: comments.length + 1,
        author: language === 'hi' ? 'पाठक' : 'Reader',
        text: newComment,
        time: language === 'hi' ? 'अभी' : 'Just now',
        likes: 0,
    };
    setComments([comment, ...comments]);
    setNewComment('');
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

              {/* Post Content - Preserve original formatting from Supabase */}
              {post.content && (
                <div className="p-6 md:p-8">
                  <div
                    className="post-content prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
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
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border dark:border-dark-border bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder={t('writeCommentPlaceholder')} 
                    rows={3}
                  ></textarea>
                  <button type="submit" className="mt-3 px-6 py-2 bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-full hover:bg-primary-hover dark:hover:bg-dark-primary-hover transition-colors">
                    {t('postComment')}
                  </button>
                </form>
                <div className="space-y-6">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-dark-primary/20 flex-shrink-0"></div>
                      <div>
                        <div className="flex items-baseline gap-3">
                          <h5 className="font-semibold text-primary-text dark:text-dark-primary-text">{comment.author}</h5>
                          <span className="text-xs text-secondary-text dark:text-dark-secondary-text">{comment.time}</span>
                        </div>
                        <p className="text-primary-text/90 dark:text-dark-primary-text/90 mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
