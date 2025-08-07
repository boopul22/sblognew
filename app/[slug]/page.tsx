import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { fetchPosts, fetchPostBySlug } from '../../services/blogService';
import PostDetail from '../../components/PostDetail';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static pages for all posts at build time
export async function generateStaticParams() {
  try {
    console.log('Attempting to fetch posts for static generation...');
    const posts = await fetchPosts();

    if (!posts || posts.length === 0) {
      console.warn('No posts found during static generation, returning empty array');
      return [];
    }

    console.log(`Successfully fetched ${posts.length} posts for static generation`);
    return posts.map(post => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to fetch posts during static generation:', error);

    // Return empty array to allow build to continue
    // Pages will be generated on-demand when requested
    console.warn('Falling back to on-demand generation for post pages');
    return [];
  }
}

// Generate dynamic metadata for each post page
export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.title;
  const description = post.excerpt || '';
  const imageUrl = post.featured_image_url || '';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
        },
      ],
    },
    twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [imageUrl],
    }
  };
}


export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await fetchPostBySlug(resolvedParams.slug);
  const allPosts = await fetchPosts(); // For related posts sidebar

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} allPosts={allPosts} />;
}
