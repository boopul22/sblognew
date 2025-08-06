import React, { useRef } from 'react'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    
    // Find the target element
    const target = document.querySelector(href) as HTMLElement
    if (target) {
      // Make target focusable if it isn't already
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
      }
      
      // Focus the target
      target.focus()
      
      // Scroll to target
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className={`
        skip-link
        absolute top-0 left-0 z-50
        px-4 py-2
        bg-blue-600 text-white
        text-sm font-medium
        transform -translate-y-full
        focus:translate-y-0
        transition-transform duration-200
        ${className}
      `}
    >
      {children}
    </a>
  )
}

// Skip links container for multiple skip links
interface SkipLinksProps {
  links: Array<{
    href: string
    label: string
  }>
  className?: string
}

export function SkipLinks({ links, className = '' }: SkipLinksProps) {
  return (
    <nav
      aria-label="Skip navigation"
      className={`skip-links-container ${className}`}
    >
      {links.map((link, index) => (
        <SkipLink key={index} href={link.href}>
          {link.label}
        </SkipLink>
      ))}
    </nav>
  )
}

// Common skip links for typical page layout
export function DefaultSkipLinks() {
  const links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ]

  return <SkipLinks links={links} />
}
