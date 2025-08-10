import React from 'react';
import Link from 'next/link';
import { fetchAuthors } from '../../services/blogService';

// Re-validate the page every hour
export const revalidate = 3600;

interface Author {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  created_at: string;
  postCount: number;
  totalViews: number;
  latestPost: any;
}

export default async function AuthorsPage() {
  const authors = await fetchAuthors();

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-4">
            Authors / Lekhak
          </h1>
          <p className="text-lg text-secondary-text dark:text-dark-secondary-text max-w-2xl mx-auto">
            Hamare talented authors se milo jo apni shayari aur poetry se dilon ko chhute hain.
          </p>
          <p className="text-lg text-secondary-text dark:text-dark-secondary-text max-w-2xl mx-auto mt-2">
            Meet our talented authors who touch hearts with their shayari and poetry.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author: Author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>

        {authors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-secondary-text dark:text-dark-secondary-text">
              No authors found / Koi author nahi mila
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AuthorCard({ author }: { author: Author }) {
  const formatDate = (dateString: string, language: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        {/* Author Avatar and Basic Info */}
        <div className="text-center mb-6">
          {author.avatar_url ? (
            <img 
              src={author.avatar_url} 
              alt={author.display_name || 'Author'} 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-2xl font-bold group-hover:border-primary/40 transition-colors">
              {(author.display_name || author.username || '?').charAt(0).toUpperCase()}
            </div>
          )}
          
          <h3 className="text-xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-2">
            {author.display_name || author.username || 'Unknown Author'}
          </h3>
          
          {author.bio && (
            <p className="text-sm text-secondary-text dark:text-dark-secondary-text line-clamp-2 mb-4">
              {author.bio}
            </p>
          )}
        </div>

        {/* Author Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-background dark:bg-dark-background rounded-lg">
            <div className="text-2xl font-bold text-primary dark:text-dark-primary">
              {author.postCount}
            </div>
            <div className="text-sm text-secondary-text dark:text-dark-secondary-text">
              Posts
            </div>
          </div>
          <div className="text-center p-3 bg-background dark:bg-dark-background rounded-lg">
            <div className="text-2xl font-bold text-primary dark:text-dark-primary">
              {author.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-text dark:text-dark-secondary-text">
              Views
            </div>
          </div>
        </div>

        {/* Latest Post */}
        {author.latestPost && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-secondary-text dark:text-dark-secondary-text mb-2">
              Latest Post:
            </h4>
            <p className="text-sm text-primary-text dark:text-dark-primary-text line-clamp-1">
              {author.latestPost.title}
            </p>
          </div>
        )}

        {/* Member Since */}
        <div className="text-center text-sm text-secondary-text dark:text-dark-secondary-text mb-6">
          Member since: {formatDate(author.created_at, 'en')}
        </div>

        {/* View Profile Button */}
        <Link
          href={`/?author=${author.id}`}
          className="block w-full text-center bg-primary dark:bg-dark-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 dark:hover:bg-dark-primary/90 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
