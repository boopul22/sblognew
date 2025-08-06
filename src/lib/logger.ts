import { env, isDev, isProd } from './env'

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Log entry interface
interface LogEntry {
  level: LogLevel
  message: string
  timestamp: number
  context?: Record<string, any>
  stack?: string
  url?: string
  userAgent?: string
  userId?: string
}

// Logger configuration
interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableStorage: boolean
  enableRemote: boolean
  remoteEndpoint?: string
  maxStorageEntries: number
  enablePerformanceLogging: boolean
  enableUserInteractionLogging: boolean
}

class Logger {
  private config: LoggerConfig
  private buffer: LogEntry[] = []
  private flushTimer?: NodeJS.Timeout

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: isDev ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: true,
      enableStorage: isDev,
      enableRemote: isProd,
      maxStorageEntries: 1000,
      enablePerformanceLogging: true,
      enableUserInteractionLogging: isDev,
      ...config,
    }

    this.setupGlobalErrorHandling()
    this.setupPerformanceLogging()
    this.setupUserInteractionLogging()
  }

  // Core logging methods
  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    })
  }

  // Main logging method
  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    if (level < this.config.level) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    // Add to buffer
    this.buffer.push(entry)

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry)
    }

    // Storage logging
    if (this.config.enableStorage) {
      this.logToStorage(entry)
    }

    // Remote logging (batched)
    if (this.config.enableRemote) {
      this.scheduleRemoteFlush()
    }
  }

  // Console logging with formatting
  private logToConsole(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toISOString()
    const levelName = LogLevel[entry.level]
    const prefix = `[${timestamp}] ${levelName}:`

    const consoleMethod = this.getConsoleMethod(entry.level)
    
    if (entry.context) {
      consoleMethod(prefix, entry.message, entry.context)
    } else {
      consoleMethod(prefix, entry.message)
    }
  }

  // Get appropriate console method
  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug
      case LogLevel.INFO:
        return console.info
      case LogLevel.WARN:
        return console.warn
      case LogLevel.ERROR:
        return console.error
      default:
        return console.log
    }
  }

  // Local storage logging
  private logToStorage(entry: LogEntry) {
    try {
      const storageKey = 'app-logs'
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]')
      
      existingLogs.push(entry)
      
      // Limit storage size
      if (existingLogs.length > this.config.maxStorageEntries) {
        existingLogs.splice(0, existingLogs.length - this.config.maxStorageEntries)
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingLogs))
    } catch (error) {
      console.warn('Failed to store log entry:', error)
    }
  }

  // Schedule remote logging
  private scheduleRemoteFlush() {
    if (this.flushTimer) return

    this.flushTimer = setTimeout(() => {
      this.flushToRemote()
      this.flushTimer = undefined
    }, 5000) // Batch logs every 5 seconds
  }

  // Send logs to remote endpoint
  private async flushToRemote() {
    if (!this.config.remoteEndpoint || this.buffer.length === 0) return

    const logsToSend = [...this.buffer]
    this.buffer = []

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logsToSend,
          metadata: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          },
        }),
      })
    } catch (error) {
      console.warn('Failed to send logs to remote endpoint:', error)
      // Put logs back in buffer for retry
      this.buffer.unshift(...logsToSend)
    }
  }

  // Setup global error handling
  private setupGlobalErrorHandling() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', new Error(event.reason), {
        type: 'unhandledrejection',
        reason: event.reason,
      })
    })

    // Uncaught errors
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', event.error, {
        type: 'uncaughtError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.warn('Resource loading error', {
          type: 'resourceError',
          element: event.target?.tagName,
          source: (event.target as any)?.src || (event.target as any)?.href,
        })
      }
    }, true)
  }

  // Setup performance logging
  private setupPerformanceLogging() {
    if (!this.config.enablePerformanceLogging) return

    // Navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          this.info('Navigation performance', {
            type: 'navigation',
            loadTime: navigation.loadEventEnd - navigation.navigationStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            firstByte: navigation.responseStart - navigation.navigationStart,
          })
        }
      }, 1000)
    })

    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.info('Largest Contentful Paint', {
          type: 'lcp',
          value: lastEntry.startTime,
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.info('First Input Delay', {
            type: 'fid',
            value: entry.processingStart - entry.startTime,
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // CLS
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.info('Cumulative Layout Shift', {
          type: 'cls',
          value: clsValue,
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  // Setup user interaction logging
  private setupUserInteractionLogging() {
    if (!this.config.enableUserInteractionLogging) return

    // Click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      this.debug('User click', {
        type: 'click',
        element: target.tagName,
        id: target.id,
        className: target.className,
        text: target.textContent?.slice(0, 50),
      })
    })

    // Form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.info('Form submission', {
        type: 'form_submit',
        action: form.action,
        method: form.method,
        id: form.id,
      })
    })
  }

  // Get stored logs
  getStoredLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('app-logs') || '[]')
    } catch {
      return []
    }
  }

  // Clear stored logs
  clearStoredLogs() {
    localStorage.removeItem('app-logs')
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.getStoredLogs(), null, 2)
  }
}

// Create global logger instance
export const logger = new Logger({
  remoteEndpoint: env.VITE_SENTRY_DSN ? '/api/logs' : undefined,
})

// Convenience exports
export const { debug, info, warn, error } = logger
