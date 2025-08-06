// Accessibility utilities and helpers

// ARIA live region announcer
class LiveRegionAnnouncer {
  private liveRegion: HTMLElement | null = null

  constructor() {
    this.createLiveRegion()
  }

  private createLiveRegion() {
    if (typeof window === 'undefined') return

    this.liveRegion = document.createElement('div')
    this.liveRegion.setAttribute('aria-live', 'polite')
    this.liveRegion.setAttribute('aria-atomic', 'true')
    this.liveRegion.setAttribute('aria-relevant', 'text')
    this.liveRegion.style.position = 'absolute'
    this.liveRegion.style.left = '-10000px'
    this.liveRegion.style.width = '1px'
    this.liveRegion.style.height = '1px'
    this.liveRegion.style.overflow = 'hidden'
    
    document.body.appendChild(this.liveRegion)
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.liveRegion) return

    this.liveRegion.setAttribute('aria-live', priority)
    this.liveRegion.textContent = message

    // Clear after announcement to allow repeated messages
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = ''
      }
    }, 1000)
  }

  destroy() {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion)
      this.liveRegion = null
    }
  }
}

// Global announcer instance
let announcer: LiveRegionAnnouncer | null = null

export function getAnnouncer(): LiveRegionAnnouncer {
  if (!announcer) {
    announcer = new LiveRegionAnnouncer()
  }
  return announcer
}

// Announce message to screen readers
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = getAnnouncer()
  announcer.announce(message, priority)
}

// Focus management utilities
export const focusUtils = {
  // Get all focusable elements within a container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        const htmlElement = element as HTMLElement
        return htmlElement.offsetWidth > 0 && 
               htmlElement.offsetHeight > 0 && 
               !htmlElement.hidden
      }) as HTMLElement[]
  },

  // Focus first focusable element
  focusFirst(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
      return true
    }
    return false
  },

  // Focus last focusable element
  focusLast(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus()
      return true
    }
    return false
  },

  // Trap focus within container
  trapFocus(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Tab') return

    const focusableElements = this.getFocusableElements(container)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  },

  // Save and restore focus
  saveFocus(): () => void {
    const activeElement = document.activeElement as HTMLElement
    return () => {
      if (activeElement && activeElement.focus) {
        activeElement.focus()
      }
    }
  },
}

// Keyboard navigation utilities
export const keyboardUtils = {
  // Handle arrow key navigation in lists
  handleArrowNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    options: {
      orientation?: 'horizontal' | 'vertical' | 'both'
      wrap?: boolean
      onIndexChange?: (newIndex: number) => void
    } = {}
  ): number {
    const { orientation = 'vertical', wrap = true, onIndexChange } = options
    let newIndex = currentIndex

    switch (event.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : (wrap ? items.length - 1 : currentIndex)
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault()
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (wrap ? 0 : currentIndex)
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : (wrap ? items.length - 1 : currentIndex)
        }
        break
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault()
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (wrap ? 0 : currentIndex)
        }
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = items.length - 1
        break
    }

    if (newIndex !== currentIndex) {
      items[newIndex]?.focus()
      onIndexChange?.(newIndex)
    }

    return newIndex
  },

  // Handle escape key
  handleEscape(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Escape') {
      event.preventDefault()
      callback()
    }
  },

  // Handle enter/space activation
  handleActivation(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  },
}

// Color contrast utilities
export const colorUtils = {
  // Calculate relative luminance
  getRelativeLuminance(color: string): number {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    // Apply gamma correction
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    // Calculate relative luminance
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  },

  // Calculate contrast ratio
  getContrastRatio(color1: string, color2: string): number {
    const l1 = this.getRelativeLuminance(color1)
    const l2 = this.getRelativeLuminance(color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  },

  // Check if contrast meets WCAG standards
  meetsContrastRequirement(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background)
    
    if (level === 'AAA') {
      return size === 'large' ? ratio >= 4.5 : ratio >= 7
    } else {
      return size === 'large' ? ratio >= 3 : ratio >= 4.5
    }
  },
}

// Screen reader utilities
export const screenReaderUtils = {
  // Check if screen reader is likely active
  isScreenReaderActive(): boolean {
    // This is a heuristic and not 100% reliable
    return window.navigator.userAgent.includes('NVDA') ||
           window.navigator.userAgent.includes('JAWS') ||
           window.speechSynthesis?.speaking ||
           false
  },

  // Hide element from screen readers
  hideFromScreenReader(element: HTMLElement): void {
    element.setAttribute('aria-hidden', 'true')
  },

  // Show element to screen readers
  showToScreenReader(element: HTMLElement): void {
    element.removeAttribute('aria-hidden')
  },

  // Set accessible name
  setAccessibleName(element: HTMLElement, name: string): void {
    element.setAttribute('aria-label', name)
  },

  // Set accessible description
  setAccessibleDescription(element: HTMLElement, description: string): void {
    element.setAttribute('aria-describedby', description)
  },
}

// Reduced motion utilities
export const motionUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // Respect reduced motion preference
  respectReducedMotion<T>(normalValue: T, reducedValue: T): T {
    return this.prefersReducedMotion() ? reducedValue : normalValue
  },

  // Get safe animation duration
  getSafeAnimationDuration(duration: number): number {
    return this.prefersReducedMotion() ? 0 : duration
  },
}

// ARIA utilities
export const ariaUtils = {
  // Generate unique ID for ARIA relationships
  generateId(prefix: string = 'aria'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },

  // Set up ARIA relationship
  setAriaRelationship(
    element: HTMLElement,
    relatedElement: HTMLElement,
    relationship: 'describedby' | 'labelledby' | 'controls' | 'owns'
  ): void {
    let id = relatedElement.id
    if (!id) {
      id = this.generateId()
      relatedElement.id = id
    }
    element.setAttribute(`aria-${relationship}`, id)
  },

  // Set expanded state
  setExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString())
  },

  // Set selected state
  setSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString())
  },

  // Set pressed state
  setPressed(element: HTMLElement, pressed: boolean): void {
    element.setAttribute('aria-pressed', pressed.toString())
  },

  // Set disabled state
  setDisabled(element: HTMLElement, disabled: boolean): void {
    if (disabled) {
      element.setAttribute('aria-disabled', 'true')
      element.setAttribute('tabindex', '-1')
    } else {
      element.removeAttribute('aria-disabled')
      element.removeAttribute('tabindex')
    }
  },
}
