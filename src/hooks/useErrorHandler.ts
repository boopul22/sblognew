import { useCallback } from 'react'

import { errorReporter, ApiError, ValidationError, NetworkError } from '@/lib/error-handling'

export interface UseErrorHandlerOptions {
  showToast?: boolean
  customMessage?: string
  onError?: (error: Error) => void
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { showToast = true, customMessage, onError } = options

  const handleError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      // Call custom error handler if provided
      onError?.(error)

      // Report error with or without toast
      if (showToast) {
        errorReporter.reportWithToast(error, customMessage, context)
      } else {
        errorReporter.report(error, context)
      }
    },
    [showToast, customMessage, onError]
  )

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: Record<string, any>
    ): Promise<T | null> => {
      try {
        return await asyncFn()
      } catch (error) {
        handleError(error as Error, context)
        return null
      }
    },
    [handleError]
  )

  const createErrorHandler = useCallback(
    (context?: Record<string, any>) => {
      return (error: Error) => handleError(error, context)
    },
    [handleError]
  )

  return {
    handleError,
    handleAsyncError,
    createErrorHandler,
  }
}

// Specialized hooks for different error types
export function useApiErrorHandler() {
  return useErrorHandler({
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        // Handle unauthorized errors - redirect to login
        window.location.href = '/admin/login'
      }
    },
  })
}

export function useValidationErrorHandler() {
  return useErrorHandler({
    showToast: true,
    onError: (error) => {
      if (error instanceof ValidationError) {
        console.warn('Validation error:', error.field, error.message)
      }
    },
  })
}

export function useNetworkErrorHandler() {
  return useErrorHandler({
    showToast: true,
    customMessage: 'Network error. Please check your connection and try again.',
    onError: (error) => {
      if (error instanceof NetworkError) {
        console.warn('Network error detected:', error.message)
      }
    },
  })
}
