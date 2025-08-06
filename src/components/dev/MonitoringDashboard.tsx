import React, { useState, useEffect } from 'react'

import { logger } from '@/lib/logger'
import { getPerformanceMetrics } from '@/hooks/usePerformanceMonitor'
import { isDev } from '@/lib/env'

interface MonitoringDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function MonitoringDashboard({ isOpen, onClose }: MonitoringDashboardProps) {
  const [activeTab, setActiveTab] = useState<'performance' | 'logs' | 'errors'>('performance')
  const [logs, setLogs] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      // Load logs
      setLogs(logger.getStoredLogs().slice(-50)) // Last 50 logs
      
      // Load performance data
      const perfData = getPerformanceMetrics()
      setPerformanceData(perfData)
    }
  }, [isOpen])

  if (!isDev || !isOpen) return null

  const tabs = [
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'logs', label: 'Logs', icon: '📝' },
    { id: 'errors', label: 'Errors', icon: '🚨' },
  ]

  const errorLogs = logs.filter(log => log.level === 3) // ERROR level

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            🔍 Development Monitoring Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.id === 'errors' && errorLogs.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {errorLogs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'performance' && (
            <PerformanceTab data={performanceData} />
          )}
          {activeTab === 'logs' && (
            <LogsTab logs={logs} />
          )}
          {activeTab === 'errors' && (
            <ErrorsTab errors={errorLogs} />
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => {
                logger.clearStoredLogs()
                setLogs([])
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Clear Logs
            </button>
            <button
              onClick={() => {
                const data = logger.exportLogs()
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `logs-${Date.now()}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Export Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PerformanceTab({ data }: { data: any }) {
  if (!data) {
    return <div className="text-gray-500">No performance data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="DOM Content Loaded"
          value={`${data.domContentLoaded?.toFixed(2) || 'N/A'}ms`}
          status={data.domContentLoaded < 1000 ? 'good' : data.domContentLoaded < 2000 ? 'needs-improvement' : 'poor'}
        />
        <MetricCard
          title="Load Complete"
          value={`${data.loadComplete?.toFixed(2) || 'N/A'}ms`}
          status={data.loadComplete < 2000 ? 'good' : data.loadComplete < 4000 ? 'needs-improvement' : 'poor'}
        />
        <MetricCard
          title="Total Time"
          value={`${data.totalTime?.toFixed(2) || 'N/A'}ms`}
          status={data.totalTime < 3000 ? 'good' : data.totalTime < 5000 ? 'needs-improvement' : 'poor'}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Network Timing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>DNS: {data.dns?.toFixed(2) || 'N/A'}ms</div>
          <div>TCP: {data.tcp?.toFixed(2) || 'N/A'}ms</div>
          <div>Request: {data.request?.toFixed(2) || 'N/A'}ms</div>
          <div>Response: {data.response?.toFixed(2) || 'N/A'}ms</div>
        </div>
      </div>
    </div>
  )
}

function LogsTab({ logs }: { logs: any[] }) {
  const [filter, setFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  const filteredLogs = logs.filter(log => {
    const matchesText = log.message.toLowerCase().includes(filter.toLowerCase())
    const matchesLevel = levelFilter === 'all' || log.level.toString() === levelFilter
    return matchesText && matchesLevel
  })

  const getLevelName = (level: number) => {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR']
    return levels[level] || 'UNKNOWN'
  }

  const getLevelColor = (level: number) => {
    const colors = ['text-gray-600', 'text-blue-600', 'text-yellow-600', 'text-red-600']
    return colors[level] || 'text-gray-600'
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">All Levels</option>
          <option value="0">DEBUG</option>
          <option value="1">INFO</option>
          <option value="2">WARN</option>
          <option value="3">ERROR</option>
        </select>
      </div>

      <div className="space-y-2 max-h-96 overflow-auto">
        {filteredLogs.map((log, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className={`font-medium ${getLevelColor(log.level)}`}>
                {getLevelName(log.level)}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-gray-800">{log.message}</div>
            {log.context && (
              <details className="mt-2">
                <summary className="text-gray-600 cursor-pointer">Context</summary>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(log.context, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorsTab({ errors }: { errors: any[] }) {
  if (errors.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        🎉 No errors found! Your app is running smoothly.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {errors.map((error, index) => (
        <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-red-800">{error.message}</h3>
            <span className="text-red-600 text-sm">
              {new Date(error.timestamp).toLocaleString()}
            </span>
          </div>
          {error.context && (
            <pre className="text-sm bg-white p-2 rounded overflow-auto">
              {JSON.stringify(error.context, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}

function MetricCard({ title, value, status }: {
  title: string
  value: string
  status: 'good' | 'needs-improvement' | 'poor'
}) {
  const statusColors = {
    good: 'bg-green-100 text-green-800',
    'needs-improvement': 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
        {status.replace('-', ' ')}
      </span>
    </div>
  )
}
