import React, { useState, useRef } from 'react';
import type { Shayari } from '../types';
import { HeartIcon, ShareIcon, CopyIcon, DownloadIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { copyToClipboard, nativeShare, trackShare } from '../lib/shareUtils';

interface ShayariDetailCardProps {
    shayari: Shayari;
    onCopy: () => void;
}

const themeClasses = {
    love: 'from-pink-400/80 to-amber-400/80',
    sad: 'from-slate-500/80 to-blue-300/80',
    motivational: 'from-red-400/80 via-pink-400/80 to-yellow-400/80',
    friendship: 'from-emerald-400/80 via-cyan-400/80 to-indigo-400/80',
    life: 'from-sky-400/80 to-emerald-400/80',
};

const ActionButton: React.FC<{onClick: () => void; children: React.ReactNode;}> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 dark:hover:bg-black/30 transition-colors text-sm font-medium"
    >
        {children}
    </button>
);


const ShayariDetailCard: React.FC<ShayariDetailCardProps> = ({ shayari, onCopy }) => {
    const { language, t } = useLanguage();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(shayari.likes);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };
    
    const lines = language === 'hi' ? shayari.lines : shayari.lines_en_hi;
    const author = language === 'hi' ? shayari.author : shayari.author_en_hi;

    const getShayariText = () => `${lines.join('\n')}\n\n- ${author}`;

    const handleCopy = async () => {
        try {
            const success = await copyToClipboard(getShayariText());
            if (success) {
                await trackShare('copy', shayari.id.toString(), 'shayari');
                onCopy();
            } else {
                alert(language === 'hi' ? 'Copy nahi ho saka.' : 'Could not copy to clipboard.');
            }
        } catch (error) {
            console.error('Error copying:', error);
            alert(language === 'hi' ? 'Copy nahi ho saka.' : 'Could not copy to clipboard.');
        }
    };

    const handleDownload = () => {
        const node = cardRef.current;
        if (!node) return;

        // Using html-to-image would be better but avoiding new dependencies.
        alert(language === 'hi' ? 'डाउनलोड फ़ंक्शन जल्द ही उपलब्ध होगा।' : 'Download functionality coming soon.');
    };

    const handleShare = async () => {
        try {
            const shareData = {
                title: language === 'hi' ? 'Dil Ke Jazbaat se Shayari' : 'Shayari from Dil Ke Jazbaat',
                text: getShayariText(),
                url: window.location.href,
            };

            const success = await nativeShare(shareData);
            if (success) {
                await trackShare('native', shayari.id.toString(), 'shayari');
            } else {
                // Fallback to copy
                const copySuccess = await copyToClipboard(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
                if (copySuccess) {
                    await trackShare('copy', shayari.id.toString(), 'shayari');
                    alert(language === 'hi' ? 'Shayari clipboard mein copy ho gayi!' : 'Shayari copied to clipboard!');
                } else {
                    alert(language === 'hi' ? 'Share nahi ho saka.' : 'Could not share the shayari.');
                }
            }
        } catch (error) {
            console.error('Error sharing:', error);
            if (error.name !== 'AbortError') { // User didn't cancel
                alert(language === 'hi' ? 'Share nahi ho saka.' : 'Could not share the shayari.');
            }
        }
    }

    return (
        <div className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
             <div ref={cardRef} className={`relative min-h-[300px] p-6 flex items-center justify-center bg-gradient-to-br ${themeClasses[shayari.theme]}`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-center text-white font-serif max-w-lg">
                    <div className="space-y-3 mb-6">
                        {lines.map((line, index) => (
                            <p key={index} className="text-2xl md:text-3xl font-bold leading-snug" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                                {line}
                            </p>
                        ))}
                    </div>
                    <p className="text-xl italic opacity-90" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>- {author}</p>
                </div>
            </div>
            <div className="bg-white/5 dark:bg-black/10 p-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <ActionButton onClick={handleLike}>
                        <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-400 fill-current' : ''}`} />
                        <span>{likeCount.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
                    </ActionButton>
                    <ActionButton onClick={handleCopy}>
                        <CopyIcon className="w-5 h-5" />
                        <span>{t('copy')}</span>
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

export default ShayariDetailCard;