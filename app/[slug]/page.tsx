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
  const posts = await fetchPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
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
  const description = post.excerpt;
  const imageUrl = post.featured_image_url;

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
