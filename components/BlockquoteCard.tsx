import React, { useState, useRef } from 'react';
import { HeartIcon, ShareIcon, CopyIcon, DownloadIcon, WhatsAppIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { downloadElementAsImage, shareOnWhatsApp, copyToClipboard } from '../utils/downloadUtils';

interface BlockquoteCardProps {
  content: string;
  theme?: 'love' | 'sad' | 'motivational' | 'friendship' | 'life';
  onCopy?: () => void;
  initialLikes?: number;
}

const themeClasses = {
  love: 'from-pink-400/80 to-amber-400/80',
  sad: 'from-slate-500/80 to-blue-300/80',
  motivational: 'from-red-400/80 via-pink-400/80 to-yellow-400/80',
  friendship: 'from-emerald-400/80 via-cyan-400/80 to-indigo-400/80',
  life: 'from-sky-400/80 to-emerald-400/80',
};

const ActionButton: React.FC<{onClick: () => void; children: React.ReactNode; title?: string;}> = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-200 hover:scale-105"
  >
    {children}
  </button>
);

const BlockquoteCard: React.FC<BlockquoteCardProps> = ({ 
  content, 
  theme = 'love', 
  onCopy,
  initialLikes = Math.floor(Math.random() * 50) + 10 
}) => {
  const { language, t } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      onCopy?.();
    } catch (error) {
      console.error('Failed to copy:', error);
      alert(t('copyError') || 'Failed to copy text');
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const timestamp = new Date().getTime();
      const filename = `shayari-${timestamp}.png`;
      await downloadElementAsImage(cardRef.current, filename);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shayari from Dil Ke Jazbaat',
          text: content,
          url: window.location.href,
        });
      } else {
        // Fallback to copy to clipboard
        await copyToClipboard(`${content}\n\n${window.location.href}`);
        alert(t('shareViaCopy') || 'Content copied to clipboard for sharing!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') {
        alert(t('shareError') || 'Could not share the content.');
      }
    }
  };

  const handleWhatsAppShare = () => {
    shareOnWhatsApp(content, window.location.href);
  };

  // Parse content to extract text and potential author
  const parseContent = (htmlContent: string) => {
    // Remove HTML tags and get clean text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Split into lines and filter out empty ones
    const lines = textContent.split('\n').filter(line => line.trim());
    
    // Check if last line looks like an author attribution (starts with -, —, or ~)
    const lastLine = lines[lines.length - 1]?.trim();
    let author = '';
    let contentLines = lines;
    
    if (lastLine && (lastLine.startsWith('-') || lastLine.startsWith('—') || lastLine.startsWith('~'))) {
      author = lastLine.replace(/^[-—~]\s*/, '');
      contentLines = lines.slice(0, -1);
    }
    
    return { contentLines, author };
  };

  const { contentLines, author } = parseContent(content);

  return (
    <div className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 my-8">
      <div 
        ref={cardRef} 
        className={`relative min-h-[300px] p-6 flex items-center justify-center bg-gradient-to-br ${themeClasses[theme]}`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative text-center text-white font-serif max-w-lg">
          <div className="space-y-3 mb-6">
            {contentLines.map((line, index) => (
              <p 
                key={index} 
                className="text-xl md:text-2xl font-bold leading-snug" 
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
              >
                {line.trim()}
              </p>
            ))}
          </div>
          {author && (
            <p 
              className="text-lg italic opacity-90" 
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}
            >
              - {author}
            </p>
          )}
        </div>
      </div>
      
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            <span className="text-sm font-medium">
              {likeCount.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ActionButton onClick={handleLike} title={t('like') || 'Like'}>
            <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-400 fill-current' : ''}`} />
          </ActionButton>
          
          <ActionButton onClick={handleCopy} title={t('copy') || 'Copy'}>
            <CopyIcon className="w-5 h-5" />
          </ActionButton>
          
          <ActionButton onClick={handleShare} title={t('share') || 'Share'}>
            <ShareIcon className="w-5 h-5" />
          </ActionButton>
          
          <ActionButton onClick={handleWhatsAppShare} title="Share on WhatsApp">
            <WhatsAppIcon className="w-5 h-5" />
          </ActionButton>
          
          <ActionButton 
            onClick={handleDownload} 
            title={t('download') || 'Download'}
          >
            {isDownloading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <DownloadIcon className="w-5 h-5" />
            )}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default BlockquoteCard;
