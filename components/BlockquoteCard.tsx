import React, { useState, useRef } from 'react';
import { HeartIcon, ShareIcon, CopyIcon, DownloadIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { copyToClipboard, nativeShare, trackShare } from '../lib/shareUtils';

interface BlockquoteCardProps {
    content: string;
    author?: string;
    index: number;
}

const themeClasses = {
    love: 'from-pink-400/80 to-amber-400/80',
    sad: 'from-slate-500/80 to-blue-300/80',
    motivational: 'from-red-400/80 via-pink-400/80 to-yellow-400/80',
    friendship: 'from-emerald-400/80 via-cyan-400/80 to-indigo-400/80',
    life: 'from-sky-400/80 to-emerald-400/80',
};

const themes = Object.keys(themeClasses) as Array<keyof typeof themeClasses>;

const ActionButton: React.FC<{onClick: () => void; children: React.ReactNode;}> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/90 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 transition-colors text-sm font-medium border border-gray-200 dark:border-gray-600 shadow-sm"
    >
        {children}
    </button>
);

const BlockquoteCard: React.FC<BlockquoteCardProps> = ({ content, author, index }) => {
    const { language, t } = useLanguage();
    const [isLiked, setIsLiked] = useState(false);
    const [likeAdjustment, setLikeAdjustment] = useState(0);
    const [copyFeedback, setCopyFeedback] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Generate consistent like count based on index for SSR compatibility
    const baseLikeCount = Math.floor((index * 7 + 13) % 50) + 10;
    const likeCount = baseLikeCount + likeAdjustment;

    // Select theme based on index for consistency
    const theme = themes[index % themes.length];

    const handleLike = () => {
        if (isLiked) {
            setLikeAdjustment(prev => prev - 1);
        } else {
            setLikeAdjustment(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    const getQuoteText = () => {
        const text = content.trim();
        return author ? `${text}\n\n- ${author}` : text;
    };

    const handleCopy = async () => {
        try {
            const success = await copyToClipboard(getQuoteText());
            if (success) {
                await trackShare('copy', `blockquote-${index}`, 'shayari');
                setCopyFeedback(true);
                setTimeout(() => setCopyFeedback(false), 2000);
            } else {
                alert(language === 'hi' ? 'Copy nahi ho saka.' : 'Could not copy to clipboard.');
            }
        } catch (error) {
            console.error('Error copying:', error);
            alert(language === 'hi' ? 'Copy nahi ho saka.' : 'Could not copy to clipboard.');
        }
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            // Dynamically import html2canvas to avoid SSR issues
            const html2canvas = (await import('html2canvas')).default;

            // Create canvas from the card element
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2, // Higher resolution
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: cardRef.current.offsetWidth,
                height: cardRef.current.offsetHeight,
            });

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (!blob) return;

                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `blockquote-${index}-${Date.now()}.png`;

                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up
                URL.revokeObjectURL(url);

                // Track download
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'download', {
                        event_category: 'blockquote',
                        event_label: `blockquote-${index}`,
                        value: 1
                    });
                }

                console.log('Download tracked: download - blockquote:blockquote-' + index);
            }, 'image/png');

        } catch (error) {
            console.error('Download failed:', error);
            alert(language === 'hi' ? 'डाउनलोड में त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Download failed. Please try again.');
        }
    };

    const handleShare = async () => {
        try {
            const shareData = {
                title: language === 'hi' ? 'Dil Ke Jazbaat se Quote' : 'Quote from Dil Ke Jazbaat',
                text: getQuoteText(),
                url: window.location.href,
            };

            const success = await nativeShare(shareData);
            if (success) {
                await trackShare('native', `blockquote-${index}`, 'shayari');
            } else {
                // Fallback to copy
                const copySuccess = await copyToClipboard(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
                if (copySuccess) {
                    await trackShare('copy', `blockquote-${index}`, 'shayari');
                    alert(language === 'hi' ? 'Quote clipboard mein copy ho gayi!' : 'Quote copied to clipboard!');
                } else {
                    alert(language === 'hi' ? 'Share nahi ho saka.' : 'Could not share the quote.');
                }
            }
        } catch (error) {
            console.error('Error sharing:', error);
            if (error.name !== 'AbortError') { // User didn't cancel
                alert(language === 'hi' ? 'Share nahi ho saka.' : 'Could not share the quote.');
            }
        }
    };

    return (
        <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 my-6">
            <div ref={cardRef} className={`relative min-h-[160px] p-8 flex items-center justify-center bg-gradient-to-br ${themeClasses[theme]}`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative text-center text-white font-sans max-w-2xl">
                    <div className="mb-4">
                        <p className="text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line">
                            {content.trim()}
                        </p>
                    </div>
                    {author && (
                        <p className="text-base italic opacity-85 font-normal">
                            - {author}
                        </p>
                    )}
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <ActionButton onClick={handleLike}>
                        <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-400 fill-current' : ''}`} />
                        <span>{likeCount.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
                    </ActionButton>
                    <ActionButton onClick={handleCopy}>
                        <CopyIcon className="w-5 h-5" />
                        <span>{copyFeedback ? (language === 'hi' ? 'Copied!' : 'Copied!') : t('copy')}</span>
                    </ActionButton>
                </div>
                <div className="flex items-center gap-3">
                    <ActionButton onClick={handleShare}>
                        <ShareIcon className="w-5 h-5" />
                        <span>{t('share')}</span>
                    </ActionButton>
                    <ActionButton onClick={handleDownload}>
                        <DownloadIcon className="w-5 h-5" />
                        <span>{t('download')}</span>
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};

export default BlockquoteCard;
