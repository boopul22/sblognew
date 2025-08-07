import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import PostList from '../components/PostList';
import Sidebar from '../components/Sidebar';
import { fetchPosts, getCategories } from '../services/blogService';
import type { Post } from '../types';

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>
}

// Re-validate the page every hour
export const revalidate = 3600;

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const { category: selectedCategory = 'all', q: activeSearch = '' } = resolvedSearchParams;
  
  // Fetch data on the server with optimization for build
  const [allPosts, categories] = await Promise.all([
    fetchPosts(50), // Limit to 50 posts for better performance
    getCategories(),
  ]);

  // Perform filtering on the server
  const filteredPosts = allPosts
    .filter(post => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        return post.post_categories?.some(pc => pc.categories.slug === selectedCategory) || false;
      }
      return true;
    })
    .filter(post => {
      // Search filter (checking both languages)
      if (activeSearch) {
        const lowerCaseQuery = activeSearch.toLowerCase();
        return (
          post.title.toLowerCase().includes(lowerCaseQuery) ||
          post.title_en_hi?.toLowerCase().includes(lowerCaseQuery) ||
          post.excerpt?.toLowerCase().includes(lowerCaseQuery) ||
          post.excerpt_en_hi?.toLowerCase().includes(lowerCaseQuery) ||
          post.users?.display_name?.toLowerCase().includes(lowerCaseQuery) ||
          post.users?.display_name_en_hi?.toLowerCase().includes(lowerCaseQuery)
        );
      }
      return true;
    });

  return (
    <>
      <Hero post={allPosts[0]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-grow">
            <PostList posts={filteredPosts} />
          </main>
          <Sidebar 
            posts={allPosts}
            categories={categories}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </>
  );
}
