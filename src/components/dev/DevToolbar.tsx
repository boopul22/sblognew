import React, { useState, useEffect } from 'react'

import { MonitoringDashboard } from './MonitoringDashboard'
import { isDev } from '@/lib/env'
import { logger } from '@/lib/logger'

export function DevToolbar() {
  const [isVisible, setIsVisible] = useState(false)
  const [showMonitoring, setShowMonitoring] = useState(false)
  const [errorCount, setErrorCount] = useState(0)

  useEffect(() => {
    if (!isDev) return

    // Show toolbar after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000)

    // Listen for keyboard shortcut (Ctrl/Cmd + Shift + D)
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault()
        setShowMonitoring(true)
      }
    }

    // Update error count
    const updateErrorCount = () => {
      const logs = logger.getStoredLogs()
      const errors = logs.filter(log => log.level === 3) // ERROR level
      setErrorCount(errors.length)
    }

    updateErrorCount()
    const interval = setInterval(updateErrorCount, 5000)

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!isDev || !isVisible) return null

  const tools = [
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: '📊',
      badge: errorCount > 0 ? errorCount : undefined,
      onClick: () => setShowMonitoring(true),
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: '⚡',
      onClick: () => {
        const report = sessionStorage.getItem('performance-report')
        if (report) {
          console.group('🚀 Performance Report')
          console.log(JSON.parse(report))
          console.groupEnd()
        } else {
          console.log('No performance report available yet')
        }
      },
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: '💾',
      onClick: () => {
        console.group('💾 Storage Information')
        console.log('LocalStorage:', Object.keys(localStorage).reduce((acc, key) => {
          acc[key] = localStorage.getItem(key)?.slice(0, 100) + '...'
          return acc
        }, {} as Record<string, string>))
        console.log('SessionStorage:', Object.keys(sessionStorage).reduce((acc, key) => {
          acc[key] = sessionStorage.getItem(key)?.slice(0, 100) + '...'
          return acc
        }, {} as Record<string, string>))
        console.groupEnd()
      },
    },
    {
      id: 'network',
      label: 'Network',
      icon: '🌐',
      onClick: () => {
        if ('connection' in navigator) {
          console.group('🌐 Network Information')
          console.log('Connection:', {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
            rtt: (navigator as any).connection.rtt,
            saveData: (navigator as any).connection.saveData,
          })
          console.groupEnd()
        } else {
          console.log('Network API not supported')
        }
      },
    },
    {
      id: 'clear',
      label: 'Clear',
      icon: '🧹',
      onClick: () => {
        console.clear()
        logger.clearStoredLogs()
        sessionStorage.removeItem('performance-report')
        sessionStorage.removeItem('performance-metrics')
        setErrorCount(0)
        logger.info('Development data cleared')
      },
    },
  ]

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 bg-gray-900 text-white rounded-lg shadow-lg p-2 flex items-center space-x-2">
        <div className="text-xs font-medium px-2 py-1 bg-blue-600 rounded">
          DEV
        </div>
        
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={tool.onClick}
            className="relative p-2 hover:bg-gray-700 rounded transition-colors"
            title={`${tool.label} ${tool.id === 'monitoring' ? '(Ctrl/Cmd+Shift+D)' : ''}`}
          >
            <span className="text-lg">{tool.icon}</span>
            {tool.badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tool.badge}
              </span>
            )}
          </button>
        ))}

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400"
          title="Hide toolbar"
        >
          ×
        </button>
      </div>

      <MonitoringDashboard
        isOpen={showMonitoring}
        onClose={() => setShowMonitoring(false)}
      />
    </>
  )
}

// Component to show development info overlay
export function DevInfo() {
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    if (!isDev) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') {
        event.preventDefault()
        setShowInfo(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isDev || !showInfo) return null

  const buildInfo = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio,
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    online: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    language: navigator.language,
    platform: navigator.platform,
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs font-mono max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Development Info</h3>
        <button
          onClick={() => setShowInfo(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        {Object.entries(buildInfo).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="text-gray-400 w-20 flex-shrink-0">{key}:</span>
            <span className="break-all">{String(value)}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
        Press Ctrl/Cmd+Shift+I to toggle
      </div>
    </div>
  )
}
