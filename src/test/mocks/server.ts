import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock data
const mockPosts = [
  {
    id: 1,
    title: 'Test Post 1',
    slug: 'test-post-1',
    content: 'This is test content',
    excerpt: 'Test excerpt',
    featured_image: 'https://example.com/image1.jpg',
    published: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    author: {
      id: 1,
      name: 'Test Author',
      username: 'testauthor',
      bio: 'Test bio',
    },
    categories: [
      { id: 1, name: 'Test Category', slug: 'test-category' }
    ],
    tags: [
      { id: 1, name: 'Test Tag', slug: 'test-tag' }
    ],
  },
  {
    id: 2,
    title: 'Test Post 2',
    slug: 'test-post-2',
    content: 'This is another test content',
    excerpt: 'Another test excerpt',
    featured_image: 'https://example.com/image2.jpg',
    published: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    author: {
      id: 1,
      name: 'Test Author',
      username: 'testauthor',
      bio: 'Test bio',
    },
    categories: [
      { id: 1, name: 'Test Category', slug: 'test-category' }
    ],
    tags: [
      { id: 2, name: 'Another Tag', slug: 'another-tag' }
    ],
  },
]

const mockAuthors = [
  {
    id: 1,
    name: 'Test Author',
    username: 'testauthor',
    bio: 'Test bio',
    avatar: 'https://example.com/avatar.jpg',
    post_count: 2,
  },
]

const mockCategories = [
  {
    id: 1,
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test category description',
    post_count: 2,
  },
]

const mockTags = [
  {
    id: 1,
    name: 'Test Tag',
    slug: 'test-tag',
    post_count: 1,
  },
  {
    id: 2,
    name: 'Another Tag',
    slug: 'another-tag',
    post_count: 1,
  },
]

// Request handlers
export const handlers = [
  // Posts endpoints
  http.get('*/rest/v1/posts', ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    
    const paginatedPosts = mockPosts.slice(offset, offset + limit)
    
    return HttpResponse.json(paginatedPosts, {
      headers: {
        'Content-Range': `0-${paginatedPosts.length - 1}/${mockPosts.length}`,
      },
    })
  }),

  http.get('*/rest/v1/posts/:slug', ({ params }) => {
    const post = mockPosts.find(p => p.slug === params.slug)
    if (!post) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json([post])
  }),

  // Authors endpoints
  http.get('*/rest/v1/authors', () => {
    return HttpResponse.json(mockAuthors)
  }),

  http.get('*/rest/v1/authors/:username', ({ params }) => {
    const author = mockAuthors.find(a => a.username === params.username)
    if (!author) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json([author])
  }),

  // Categories endpoints
  http.get('*/rest/v1/categories', () => {
    return HttpResponse.json(mockCategories)
  }),

  http.get('*/rest/v1/categories/:slug', ({ params }) => {
    const category = mockCategories.find(c => c.slug === params.slug)
    if (!category) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json([category])
  }),

  // Tags endpoints
  http.get('*/rest/v1/tags', () => {
    return HttpResponse.json(mockTags)
  }),

  http.get('*/rest/v1/tags/:slug', ({ params }) => {
    const tag = mockTags.find(t => t.slug === params.slug)
    if (!tag) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json([tag])
  }),

  // Auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        role: 'admin',
      },
    })
  }),

  http.get('*/auth/v1/user', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'test@example.com',
      role: 'admin',
    })
  }),

  // Error simulation handlers
  http.get('*/rest/v1/error-test', () => {
    return new HttpResponse(null, { status: 500 })
  }),

  http.get('*/rest/v1/network-error-test', () => {
    return HttpResponse.error()
  }),
]

// Setup server
export const server = setupServer(...handlers)
