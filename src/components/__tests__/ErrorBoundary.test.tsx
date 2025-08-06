import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorBoundary, AsyncErrorBoundary, RouteErrorBoundary } from '../ErrorBoundary'
import { renderWithoutProviders } from '@/test/utils'

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    renderWithoutProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithoutProviders(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const customFallback = <div>Custom error message</div>

    renderWithoutProviders(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('calls onError callback when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = vi.fn()

    renderWithoutProviders(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )

    consoleSpy.mockRestore()
  })

  it('refreshes page when refresh button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    })

    const user = userEvent.setup()

    renderWithoutProviders(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const refreshButton = screen.getByRole('button', { name: /refresh page/i })
    await user.click(refreshButton)

    expect(reloadSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})

describe('AsyncErrorBoundary', () => {
  it('renders children when there is no error', () => {
    renderWithoutProviders(
      <AsyncErrorBoundary>
        <ThrowError shouldThrow={false} />
      </AsyncErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders async error fallback when there is an error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithoutProviders(
      <AsyncErrorBoundary>
        <ThrowError />
      </AsyncErrorBoundary>
    )

    expect(screen.getByText('Failed to load content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})

describe('RouteErrorBoundary', () => {
  it('renders children when there is no error', () => {
    renderWithoutProviders(
      <RouteErrorBoundary>
        <ThrowError shouldThrow={false} />
      </RouteErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders route error fallback when there is an error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithoutProviders(
      <RouteErrorBoundary>
        <ThrowError />
      </RouteErrorBoundary>
    )

    expect(screen.getByText('Page Error')).toBeInTheDocument()
    expect(screen.getByText(/This page encountered an error/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('navigates back when go back button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const backSpy = vi.fn()
    Object.defineProperty(window, 'history', {
      value: { back: backSpy },
      writable: true,
    })

    const user = userEvent.setup()

    renderWithoutProviders(
      <RouteErrorBoundary>
        <ThrowError />
      </RouteErrorBoundary>
    )

    const backButton = screen.getByRole('button', { name: /go back/i })
    await user.click(backButton)

    expect(backSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('navigates home when go home button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const originalLocation = window.location
    delete (window as any).location
    window.location = { ...originalLocation, href: '' }

    const user = userEvent.setup()

    renderWithoutProviders(
      <RouteErrorBoundary>
        <ThrowError />
      </RouteErrorBoundary>
    )

    const homeButton = screen.getByRole('button', { name: /go home/i })
    await user.click(homeButton)

    expect(window.location.href).toBe('/')

    window.location = originalLocation
    consoleSpy.mockRestore()
  })
})
