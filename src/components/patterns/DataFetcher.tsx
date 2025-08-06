import React, { ReactNode, useEffect, useCallback } from 'react'

import { useOptimizedState } from '@/hooks/useOptimizedState'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { safeAsync } from '@/lib/error-handling'

// Data fetcher state
interface DataFetcherState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  refresh: () => Promise<void>
}

// Data fetcher props
interface DataFetcherProps<T> {
  // Fetch function
  fetcher: () => Promise<T>
  
  // Render prop
  children: (state: DataFetcherState<T>) => ReactNode
  
  // Options
  immediate?: boolean
  cacheKey?: string
  cacheDuration?: number
  retryCount?: number
  retryDelay?: number
  
  // Event handlers
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onLoadingChange?: (loading: boolean) => void
}

// Simple in-memory cache
class DataCache {
  private cache = new Map<string, { data: any; timestamp: number; duration: number }>()

  set<T>(key: string, data: T, duration: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration,
    })
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > cached.duration
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  has(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false

    const isExpired = Date.now() - cached.timestamp > cached.duration
    if (isExpired) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

const dataCache = new DataCache()

export function DataFetcher<T>({
  fetcher,
  children,
  immediate = true,
  cacheKey,
  cacheDuration = 5 * 60 * 1000, // 5 minutes
  retryCount = 3,
  retryDelay = 1000,
  onSuccess,
  onError,
  onLoadingChange,
}: DataFetcherProps<T>) {
  const [data, setData] = useOptimizedState<T | null>(null)
  const [loading, setLoading] = useOptimizedState(false)
  const [error, setError] = useOptimizedState<Error | null>(null)
  
  const { handleError } = useErrorHandler({
    showToast: false,
    onError,
  })

  // Fetch data with retry logic
  const fetchData = useCallback(async (useCache = true) => {
    // Check cache first
    if (useCache && cacheKey && dataCache.has(cacheKey)) {
      const cachedData = dataCache.get<T>(cacheKey)
      if (cachedData) {
        setData(cachedData)
        onSuccess?.(cachedData)
        return
      }
    }

    setLoading(true)
    setError(null)
    onLoadingChange?.(true)

    let lastError: Error | null = null

    // Retry logic
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      const [result, fetchError] = await safeAsync(fetcher)

      if (result !== null) {
        // Success
        setData(result)
        setError(null)
        
        // Cache the result
        if (cacheKey) {
          dataCache.set(cacheKey, result, cacheDuration)
        }
        
        onSuccess?.(result)
        break
      } else {
        lastError = fetchError
        
        // Wait before retry (except for last attempt)
        if (attempt < retryCount) {
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * attempt)
          )
        }
      }
    }

    // If all retries failed
    if (lastError) {
      setError(lastError)
      handleError(lastError)
    }

    setLoading(false)
    onLoadingChange?.(false)
  }, [
    fetcher,
    cacheKey,
    cacheDuration,
    retryCount,
    retryDelay,
    onSuccess,
    onLoadingChange,
    handleError,
    setData,
    setLoading,
    setError,
  ])

  // Refetch without cache
  const refetch = useCallback(async () => {
    await fetchData(false)
  }, [fetchData])

  // Refresh (same as refetch but clears cache first)
  const refresh = useCallback(async () => {
    if (cacheKey) {
      dataCache.clear(cacheKey)
    }
    await fetchData(false)
  }, [fetchData, cacheKey])

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [fetchData, immediate])

  // Create state object
  const state: DataFetcherState<T> = {
    data,
    loading,
    error,
    refetch,
    refresh,
  }

  return <>{children(state)}</>
}

// Specialized data fetcher for paginated data
interface PaginatedDataFetcherProps<T> extends Omit<DataFetcherProps<T[]>, 'fetcher'> {
  fetcher: (page: number, limit: number) => Promise<{ data: T[]; total: number; hasMore: boolean }>
  limit?: number
}

export function PaginatedDataFetcher<T>({
  fetcher,
  children,
  limit = 10,
  ...props
}: PaginatedDataFetcherProps<T>) {
  const [page, setPage] = useOptimizedState(1)
  const [allData, setAllData] = useOptimizedState<T[]>([])
  const [hasMore, setHasMore] = useOptimizedState(true)
  const [total, setTotal] = useOptimizedState(0)

  const paginatedFetcher = useCallback(async () => {
    const result = await fetcher(page, limit)
    
    if (page === 1) {
      setAllData(result.data)
    } else {
      setAllData(prev => [...prev, ...result.data])
    }
    
    setHasMore(result.hasMore)
    setTotal(result.total)
    
    return result.data
  }, [fetcher, page, limit, setAllData, setHasMore, setTotal])

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, setPage])

  const reset = useCallback(() => {
    setPage(1)
    setAllData([])
    setHasMore(true)
    setTotal(0)
  }, [setPage, setAllData, setHasMore, setTotal])

  return (
    <DataFetcher fetcher={paginatedFetcher} {...props}>
      {(state) => children({
        ...state,
        data: allData,
        loadMore,
        reset,
        hasMore,
        total,
        page,
      } as any)}
    </DataFetcher>
  )
}

// Hook version of DataFetcher
export function useDataFetcher<T>(
  fetcher: () => Promise<T>,
  options: Omit<DataFetcherProps<T>, 'fetcher' | 'children'> = {}
) {
  const [state, setState] = useOptimizedState<DataFetcherState<T>>({
    data: null,
    loading: false,
    error: null,
    refetch: async () => {},
    refresh: async () => {},
  })

  return (
    <DataFetcher fetcher={fetcher} {...options}>
      {(fetcherState) => {
        setState(fetcherState)
        return null
      }}
    </DataFetcher>
  )
}

// Export cache utilities
export const cacheUtils = {
  clear: (key?: string) => dataCache.clear(key),
  has: (key: string) => dataCache.has(key),
  get: function<T>(key: string) { return dataCache.get<T>(key) },
  set: function<T>(key: string, data: T, duration?: number) { return dataCache.set(key, data, duration) },
}
