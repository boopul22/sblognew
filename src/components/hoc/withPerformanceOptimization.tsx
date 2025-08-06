import React, { memo, forwardRef, ComponentType, ForwardedRef } from 'react'

import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

// Performance optimization options
interface PerformanceOptions {
  // Enable performance monitoring
  monitor?: boolean
  // Custom comparison function for memo
  areEqual?: (prevProps: any, nextProps: any) => boolean
  // Display name for debugging
  displayName?: string
  // Enable dev tools profiling
  enableProfiling?: boolean
}

// Default shallow comparison for objects
function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true
  
  if (typeof obj1 !== 'object' || obj1 === null || 
      typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key) || obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

// HOC for performance optimization
export function withPerformanceOptimization<P extends object>(
  Component: ComponentType<P>,
  options: PerformanceOptions = {}
) {
  const {
    monitor = false,
    areEqual = shallowEqual,
    displayName,
    enableProfiling = false,
  } = options

  const OptimizedComponent = memo(
    forwardRef<any, P>((props, ref) => {
      // Performance monitoring
      usePerformanceMonitor(
        displayName || Component.displayName || Component.name || 'Component',
        monitor
      )

      // Profiling wrapper
      if (enableProfiling && import.meta.env.DEV) {
        const componentName = displayName || Component.displayName || Component.name
        console.time(`${componentName} render`)
        
        const result = <Component {...props} ref={ref} />
        
        console.timeEnd(`${componentName} render`)
        return result
      }

      return <Component {...props} ref={ref} />
    }),
    areEqual
  )

  // Set display name for debugging
  OptimizedComponent.displayName = displayName || 
    `withPerformanceOptimization(${Component.displayName || Component.name || 'Component'})`

  return OptimizedComponent
}

// Specialized HOCs for common patterns

// HOC for components that receive large lists
export function withListOptimization<P extends { items?: any[] }>(
  Component: ComponentType<P>,
  options: Omit<PerformanceOptions, 'areEqual'> = {}
) {
  const listAreEqual = (prevProps: P, nextProps: P) => {
    // Compare items array length and references
    if (prevProps.items?.length !== nextProps.items?.length) {
      return false
    }
    
    // Shallow compare items if they exist
    if (prevProps.items && nextProps.items) {
      for (let i = 0; i < prevProps.items.length; i++) {
        if (prevProps.items[i] !== nextProps.items[i]) {
          return false
        }
      }
    }
    
    // Compare other props
    const { items: prevItems, ...prevOtherProps } = prevProps
    const { items: nextItems, ...nextOtherProps } = nextProps
    
    return shallowEqual(prevOtherProps, nextOtherProps)
  }

  return withPerformanceOptimization(Component, {
    ...options,
    areEqual: listAreEqual,
  })
}

// HOC for form components
export function withFormOptimization<P extends { value?: any; onChange?: Function }>(
  Component: ComponentType<P>,
  options: Omit<PerformanceOptions, 'areEqual'> = {}
) {
  const formAreEqual = (prevProps: P, nextProps: P) => {
    // Always re-render if value changed
    if (prevProps.value !== nextProps.value) {
      return false
    }
    
    // Compare other props except onChange (function references change often)
    const { onChange: prevOnChange, ...prevOtherProps } = prevProps
    const { onChange: nextOnChange, ...nextOtherProps } = nextProps
    
    return shallowEqual(prevOtherProps, nextOtherProps)
  }

  return withPerformanceOptimization(Component, {
    ...options,
    areEqual: formAreEqual,
  })
}

// HOC for components with children
export function withChildrenOptimization<P extends { children?: React.ReactNode }>(
  Component: ComponentType<P>,
  options: Omit<PerformanceOptions, 'areEqual'> = {}
) {
  const childrenAreEqual = (prevProps: P, nextProps: P) => {
    // Compare children separately (React.ReactNode comparison)
    if (prevProps.children !== nextProps.children) {
      return false
    }
    
    // Compare other props
    const { children: prevChildren, ...prevOtherProps } = prevProps
    const { children: nextChildren, ...nextOtherProps } = nextProps
    
    return shallowEqual(prevOtherProps, nextOtherProps)
  }

  return withPerformanceOptimization(Component, {
    ...options,
    areEqual: childrenAreEqual,
  })
}

// HOC for expensive computation components
export function withComputationOptimization<P extends object>(
  Component: ComponentType<P>,
  computationKeys: (keyof P)[],
  options: Omit<PerformanceOptions, 'areEqual'> = {}
) {
  const computationAreEqual = (prevProps: P, nextProps: P) => {
    // Only re-render if computation-related props changed
    for (const key of computationKeys) {
      if (prevProps[key] !== nextProps[key]) {
        return false
      }
    }
    
    return true
  }

  return withPerformanceOptimization(Component, {
    ...options,
    areEqual: computationAreEqual,
    monitor: true, // Always monitor expensive computations
  })
}

// Utility to create a memoized component with custom comparison
export function createMemoComponent<P extends object>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean,
  displayName?: string
) {
  const MemoComponent = memo(Component, areEqual)
  
  if (displayName) {
    MemoComponent.displayName = displayName
  }
  
  return MemoComponent
}

// Utility to wrap component with ref forwarding
export function withRefForwarding<P extends object, R = any>(
  Component: ComponentType<P & { ref?: ForwardedRef<R> }>
) {
  return forwardRef<R, P>((props, ref) => (
    <Component {...props} ref={ref} />
  ))
}
