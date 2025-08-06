import { useState, useCallback, useRef, useMemo } from 'react'

// Optimized state hook that prevents unnecessary re-renders
export function useOptimizedState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue)
  const stateRef = useRef<T>(state)
  
  // Update ref when state changes
  stateRef.current = state

  // Optimized setter that only updates if value actually changed
  const setOptimizedState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevState)
        : newValue
      
      // Only update if value actually changed (shallow comparison)
      if (nextState !== prevState) {
        return nextState
      }
      return prevState
    })
  }, [])

  // Get current state without causing re-render
  const getCurrentState = useCallback(() => stateRef.current, [])

  return [state, setOptimizedState, getCurrentState] as const
}

// Deep comparison state hook for complex objects
export function useDeepState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue)
  
  const setDeepState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevState)
        : newValue
      
      // Deep comparison for objects and arrays
      if (JSON.stringify(nextState) !== JSON.stringify(prevState)) {
        return nextState
      }
      return prevState
    })
  }, [])

  return [state, setDeepState] as const
}

// Batched state updates hook
export function useBatchedState<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const pendingUpdates = useRef<Partial<T>>({})
  const timeoutRef = useRef<NodeJS.Timeout>()

  const batchUpdate = useCallback((updates: Partial<T>) => {
    // Merge with pending updates
    pendingUpdates.current = { ...pendingUpdates.current, ...updates }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Batch updates in next tick
    timeoutRef.current = setTimeout(() => {
      setState(prevState => ({ ...prevState, ...pendingUpdates.current }))
      pendingUpdates.current = {}
    }, 0)
  }, [])

  const updateField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    batchUpdate({ [key]: value } as Partial<T>)
  }, [batchUpdate])

  return [state, batchUpdate, updateField] as const
}

// Stable callback hook that doesn't change reference
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback)
  callbackRef.current = callback

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args)
  }, []) as T
}

// Memoized value hook with custom comparison
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList,
  compare?: (a: T, b: T) => boolean
) {
  const memoizedValue = useMemo(factory, deps)
  const prevValueRef = useRef<T>(memoizedValue)

  if (compare && !compare(prevValueRef.current, memoizedValue)) {
    prevValueRef.current = memoizedValue
  } else if (!compare && prevValueRef.current !== memoizedValue) {
    prevValueRef.current = memoizedValue
  }

  return prevValueRef.current
}

// Debounced state hook
export function useDebouncedState<T>(initialValue: T, delay: number = 300) {
  const [state, setState] = useState<T>(initialValue)
  const [debouncedState, setDebouncedState] = useState<T>(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const setStateWithDebounce = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(newValue)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set debounced value after delay
    timeoutRef.current = setTimeout(() => {
      setDebouncedState(typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(state)
        : newValue
      )
    }, delay)
  }, [delay, state])

  return [state, debouncedState, setStateWithDebounce] as const
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  
  // Store current value in ref
  const previousValue = ref.current
  ref.current = value
  
  return previousValue
}

// Toggle hook with optimized callbacks
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(prev => !prev), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [value, { toggle, setTrue, setFalse, setValue }] as const
}

// Counter hook with optimized operations
export function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount(prev => prev + 1), [])
  const decrement = useCallback(() => setCount(prev => prev - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  const set = useCallback((value: number) => setCount(value), [])

  return [count, { increment, decrement, reset, set }] as const
}

// Array state hook with optimized operations
export function useArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue)

  const push = useCallback((item: T) => {
    setArray(prev => [...prev, item])
  }, [])

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index))
  }, [])

  const removeById = useCallback((id: any, idKey: keyof T = 'id' as keyof T) => {
    setArray(prev => prev.filter(item => item[idKey] !== id))
  }, [])

  const update = useCallback((index: number, item: T) => {
    setArray(prev => prev.map((existingItem, i) => i === index ? item : existingItem))
  }, [])

  const updateById = useCallback((id: any, updates: Partial<T>, idKey: keyof T = 'id' as keyof T) => {
    setArray(prev => prev.map(item => 
      item[idKey] === id ? { ...item, ...updates } : item
    ))
  }, [])

  const clear = useCallback(() => setArray([]), [])

  const reset = useCallback(() => setArray(initialValue), [initialValue])

  return [
    array,
    {
      push,
      remove,
      removeById,
      update,
      updateById,
      clear,
      reset,
      set: setArray,
    }
  ] as const
}
