import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock AuthContext for tests
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
  }

  return (
    <AuthProvider value={mockAuthValue}>
      {children}
    </AuthProvider>
  )
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <MockAuthProvider>
        {children}
      </MockAuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Custom render for components that don't need providers
export const renderWithoutProviders = (
  ui: ReactElement,
  options?: RenderOptions
) => render(ui, options)

// Render with only Router
export const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: BrowserRouter, ...options })

// Mock user for authenticated tests
export const mockAuthenticatedUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  role: 'admin',
  created_at: '2024-01-01T00:00:00Z',
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Helper to create mock functions with proper typing
export const createMockFn = <T extends (...args: any[]) => any>(
  implementation?: T
): vi.MockedFunction<T> => {
  return vi.fn(implementation) as vi.MockedFunction<T>
}

// Helper to mock console methods
export const mockConsole = () => {
  const originalConsole = { ...console }
  
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  return originalConsole
}

// Helper to mock window methods
export const mockWindow = () => {
  const originalWindow = { ...window }
  
  const mockLocation = {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: vi.fn(),
    assign: vi.fn(),
    replace: vi.fn(),
  }
  
  const mockHistory = {
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    pushState: vi.fn(),
    replaceState: vi.fn(),
  }
  
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    })
    
    Object.defineProperty(window, 'history', {
      value: mockHistory,
      writable: true,
    })
  })
  
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindow.location,
      writable: true,
    })
    
    Object.defineProperty(window, 'history', {
      value: originalWindow.history,
      writable: true,
    })
  })
  
  return { mockLocation, mockHistory }
}

// Helper to create test data
export const createTestPost = (overrides = {}) => ({
  id: 1,
  title: 'Test Post',
  slug: 'test-post',
  content: 'Test content',
  excerpt: 'Test excerpt',
  featured_image: 'https://example.com/image.jpg',
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
  ...overrides,
})

export const createTestAuthor = (overrides = {}) => ({
  id: 1,
  name: 'Test Author',
  username: 'testauthor',
  bio: 'Test bio',
  avatar: 'https://example.com/avatar.jpg',
  post_count: 5,
  ...overrides,
})

export const createTestCategory = (overrides = {}) => ({
  id: 1,
  name: 'Test Category',
  slug: 'test-category',
  description: 'Test category description',
  post_count: 10,
  ...overrides,
})

export const createTestTag = (overrides = {}) => ({
  id: 1,
  name: 'Test Tag',
  slug: 'test-tag',
  post_count: 3,
  ...overrides,
})
