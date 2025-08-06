import React, { createContext, useContext, ReactNode } from 'react'

import { withPerformanceOptimization } from '../hoc/withPerformanceOptimization'

// Card context for sharing state between compound components
interface CardContextValue {
  variant: 'default' | 'elevated' | 'outlined'
  size: 'sm' | 'md' | 'lg'
  interactive: boolean
}

const CardContext = createContext<CardContextValue | null>(null)

// Hook to use card context
function useCardContext() {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error('Card compound components must be used within a Card component')
  }
  return context
}

// Base Card component
interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  className?: string
  onClick?: () => void
}

const CardBase = ({
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  className = '',
  onClick,
}: CardProps) => {
  const baseClasses = 'rounded-lg transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md hover:shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-300',
  }
  
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }
  
  const interactiveClasses = interactive 
    ? 'cursor-pointer hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    : ''

  const contextValue: CardContextValue = {
    variant,
    size,
    interactive,
  }

  return (
    <CardContext.Provider value={contextValue}>
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${interactiveClasses} ${className}`}
        onClick={onClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={interactive ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        } : undefined}
      >
        {children}
      </div>
    </CardContext.Provider>
  )
}

// Card Header component
interface CardHeaderProps {
  children: ReactNode
  className?: string
}

const CardHeaderBase = ({ children, className = '' }: CardHeaderProps) => {
  const { size } = useCardContext()
  
  const sizeClasses = {
    sm: 'mb-2',
    md: 'mb-3',
    lg: 'mb-4',
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

// Card Title component
interface CardTitleProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitleBase = ({ 
  children, 
  className = '', 
  as: Component = 'h3' 
}: CardTitleProps) => {
  const { size } = useCardContext()
  
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
  }

  return (
    <Component className={`text-gray-900 ${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  )
}

// Card Content component
interface CardContentProps {
  children: ReactNode
  className?: string
}

const CardContentBase = ({ children, className = '' }: CardContentProps) => {
  const { size } = useCardContext()
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={`text-gray-600 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

// Card Footer component
interface CardFooterProps {
  children: ReactNode
  className?: string
}

const CardFooterBase = ({ children, className = '' }: CardFooterProps) => {
  const { size } = useCardContext()
  
  const sizeClasses = {
    sm: 'mt-2 pt-2',
    md: 'mt-3 pt-3',
    lg: 'mt-4 pt-4',
  }

  return (
    <div className={`border-t border-gray-200 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

// Card Actions component
interface CardActionsProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

const CardActionsBase = ({ 
  children, 
  className = '', 
  align = 'right' 
}: CardActionsProps) => {
  const { size } = useCardContext()
  
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }
  
  const sizeClasses = {
    sm: 'mt-2 gap-2',
    md: 'mt-3 gap-3',
    lg: 'mt-4 gap-4',
  }

  return (
    <div className={`flex items-center ${alignClasses[align]} ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

// Apply performance optimizations
const Card = withPerformanceOptimization(CardBase, {
  displayName: 'Card',
  monitor: false,
})

const CardHeader = withPerformanceOptimization(CardHeaderBase, {
  displayName: 'Card.Header',
})

const CardTitle = withPerformanceOptimization(CardTitleBase, {
  displayName: 'Card.Title',
})

const CardContent = withPerformanceOptimization(CardContentBase, {
  displayName: 'Card.Content',
})

const CardFooter = withPerformanceOptimization(CardFooterBase, {
  displayName: 'Card.Footer',
})

const CardActions = withPerformanceOptimization(CardActionsBase, {
  displayName: 'Card.Actions',
})

// Compound component with sub-components
const CompoundCard = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
  Footer: CardFooter,
  Actions: CardActions,
})

export { CompoundCard as Card }

// Export individual components for flexibility
export {
  Card as CardRoot,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardActions,
}

// Export types
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardContentProps,
  CardFooterProps,
  CardActionsProps,
}
