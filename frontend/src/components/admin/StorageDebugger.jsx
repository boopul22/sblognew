import { useState, useEffect } from 'react'
import { 
  getStorageStatus, 
  validateStorage, 
  getCurrentProviderName,
  STORAGE_PROVIDERS 
} from '../../lib/storage'
import { validateStorageSetup } from '../../lib/storage/StorageValidator'
import { storageConfig } from '../../lib/storage/StorageConfig'

const StorageDebugger = ({ isVisible = false }) => {
  const [status, setStatus] = useState(null)
  const [validation, setValidation] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [activeTab, setActiveTab] = useState('status')

  useEffect(() => {
    if (isVisible) {
      refreshStatus()
    }
  }, [isVisible])

  const refreshStatus = () => {
    const currentStatus = getStorageStatus()
    const currentValidation = validateStorage()
    
    setStatus(currentStatus)
    setValidation(currentValidation)
  }

  const runTests = async () => {
    setIsRunningTests(true)
    try {
      const results = await validateStorageSetup({
        includeUploadTest: false, // Don't create test files by default
        testImageUrl: null
      })
      setTestResults(results)
      setActiveTab('tests')
    } catch (error) {
      console.error('Error running tests:', error)
    } finally {
      setIsRunningTests(false)
    }
  }

  const switchProvider = (providerName) => {
    const success = storageConfig.switchProvider(providerName)
    if (success) {
      refreshStatus()
    }
  }

  if (!isVisible) return null

  return (
    <div className="storage-debugger">
      <div className="debugger-header">
        <h3>🔧 Storage System Debugger</h3>
        <div className="debugger-tabs">
          <button 
            className={activeTab === 'status' ? 'active' : ''}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
          <button 
            className={activeTab === 'config' ? 'active' : ''}
            onClick={() => setActiveTab('config')}
          >
            Config
          </button>
          <button 
            className={activeTab === 'tests' ? 'active' : ''}
            onClick={() => setActiveTab('tests')}
          >
            Tests
          </button>
        </div>
      </div>

      <div className="debugger-content">
        {activeTab === 'status' && (
          <div className="status-tab">
            <div className="status-section">
              <h4>Current Status</h4>
              {status && (
                <div className="status-info">
                  <div className="status-item">
                    <strong>Active Provider:</strong> 
                    <span className={`provider-badge ${status.current}`}>
                      {status.current || 'None'}
                    </span>
                  </div>
                  <div className="status-item">
                    <strong>Fallback Provider:</strong> 
                    <span className="provider-badge">
                      {status.fallback || 'None'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="providers-section">
              <h4>Available Providers</h4>
              {status && (
                <div className="providers-list">
                  {Object.entries(status.providers).map(([name, info]) => (
                    <div key={name} className={`provider-item ${info.configured ? 'configured' : 'not-configured'}`}>
                      <div className="provider-info">
                        <span className="provider-name">{name}</span>
                        <span className={`status-indicator ${info.configured ? 'configured' : 'not-configured'}`}>
                          {info.configured ? '✅ Configured' : '❌ Not Configured'}
                        </span>
                      </div>
                      {info.configured && name !== status.current && (
                        <button 
                          className="switch-btn"
                          onClick={() => switchProvider(name)}
                        >
                          Switch to {name}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="actions-section">
              <button onClick={refreshStatus} className="refresh-btn">
                🔄 Refresh Status
              </button>
              <button 
                onClick={runTests} 
                className="test-btn"
                disabled={isRunningTests}
              >
                {isRunningTests ? '🧪 Running Tests...' : '🧪 Run Tests'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="config-tab">
            <div className="validation-section">
              <h4>Configuration Validation</h4>
              {validation && (
                <div className={`validation-result ${validation.valid ? 'valid' : 'invalid'}`}>
                  <div className="validation-status">
                    {validation.valid ? '✅ Valid Configuration' : '❌ Configuration Issues'}
                  </div>
                  
                  {validation.errors.length > 0 && (
                    <div className="validation-errors">
                      <strong>Errors:</strong>
                      <ul>
                        {validation.errors.map((error, index) => (
                          <li key={index} className="error">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validation.warnings.length > 0 && (
                    <div className="validation-warnings">
                      <strong>Warnings:</strong>
                      <ul>
                        {validation.warnings.map((warning, index) => (
                          <li key={index} className="warning">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="validation-stats">
                    <span>Configured Providers: {validation.configuredProviders}/{validation.totalProviders}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="env-vars-section">
              <h4>Environment Variables</h4>
              <div className="env-vars-info">
                <p>Check your environment variables for each provider:</p>
                <div className="env-vars-list">
                  <div className="env-var-group">
                    <strong>Supabase:</strong>
                    <ul>
                      <li>VITE_SUPABASE_URL</li>
                      <li>VITE_SUPABASE_ANON_KEY</li>
                    </ul>
                  </div>
                  <div className="env-var-group">
                    <strong>Cloudflare R2:</strong>
                    <ul>
                      <li>VITE_CLOUDFLARE_ACCOUNT_ID</li>
                      <li>VITE_CLOUDFLARE_R2_ACCESS_KEY_ID</li>
                      <li>VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY</li>
                      <li>VITE_CLOUDFLARE_R2_BUCKET_NAME</li>
                      <li>VITE_CLOUDFLARE_R2_PUBLIC_URL</li>
                      <li>VITE_CLOUDFLARE_R2_ENDPOINT</li>
                    </ul>
                  </div>
                  <div className="env-var-group">
                    <strong>General:</strong>
                    <ul>
                      <li>VITE_STORAGE_PROVIDER (optional, defaults to 'supabase')</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="tests-tab">
            <div className="tests-header">
              <h4>Validation Tests</h4>
              {testResults && (
                <div className={`test-summary ${testResults.success ? 'success' : 'failure'}`}>
                  {testResults.passedTests}/{testResults.totalTests} tests passed ({testResults.passRate}%)
                </div>
              )}
            </div>

            {testResults && (
              <div className="test-results">
                {testResults.results.map((result, index) => (
                  <div key={index} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                    <div className="test-header">
                      <span className="test-status">
                        {result.passed ? '✅' : '❌'}
                      </span>
                      <span className="test-name">{result.name}</span>
                    </div>
                    <div className="test-message">{result.message}</div>
                    {result.error && (
                      <div className="test-error">Error: {result.error}</div>
                    )}
                    {result.details && (
                      <details className="test-details">
                        <summary>Details</summary>
                        <pre>{JSON.stringify(result.details, null, 2)}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!testResults && !isRunningTests && (
              <div className="no-tests">
                <p>No test results available. Click "Run Tests" to validate your storage setup.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .storage-debugger {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 400px;
          max-height: 80vh;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-size: 14px;
          overflow: hidden;
        }

        .debugger-header {
          background: #f8f9fa;
          padding: 12px 16px;
          border-bottom: 1px solid #ddd;
        }

        .debugger-header h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .debugger-tabs {
          display: flex;
          gap: 4px;
        }

        .debugger-tabs button {
          padding: 4px 8px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .debugger-tabs button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .debugger-content {
          padding: 16px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .status-section, .providers-section, .validation-section, .env-vars-section, .tests-header {
          margin-bottom: 16px;
        }

        .status-section h4, .providers-section h4, .validation-section h4, .env-vars-section h4, .tests-header h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #333;
        }

        .provider-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
          margin-left: 8px;
        }

        .provider-badge.supabase {
          background: #3ecf8e;
          color: white;
        }

        .provider-badge.cloudflare-r2 {
          background: #f38020;
          color: white;
        }

        .provider-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 4px;
        }

        .provider-item.configured {
          background: #f8fff8;
          border-color: #d4edda;
        }

        .provider-item.not-configured {
          background: #fff8f8;
          border-color: #f5c6cb;
        }

        .status-indicator.configured {
          color: #28a745;
        }

        .status-indicator.not-configured {
          color: #dc3545;
        }

        .switch-btn {
          padding: 4px 8px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        }

        .actions-section {
          display: flex;
          gap: 8px;
        }

        .refresh-btn, .test-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .test-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .validation-result.valid {
          background: #f8fff8;
          border: 1px solid #d4edda;
          padding: 12px;
          border-radius: 4px;
        }

        .validation-result.invalid {
          background: #fff8f8;
          border: 1px solid #f5c6cb;
          padding: 12px;
          border-radius: 4px;
        }

        .validation-errors ul, .validation-warnings ul {
          margin: 4px 0;
          padding-left: 16px;
        }

        .validation-errors .error {
          color: #dc3545;
        }

        .validation-warnings .warning {
          color: #856404;
        }

        .env-vars-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .env-var-group ul {
          margin: 4px 0;
          padding-left: 16px;
          font-family: monospace;
          font-size: 11px;
        }

        .test-summary.success {
          color: #28a745;
          font-weight: bold;
        }

        .test-summary.failure {
          color: #dc3545;
          font-weight: bold;
        }

        .test-result {
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 8px;
        }

        .test-result.passed {
          background: #f8fff8;
          border-color: #d4edda;
        }

        .test-result.failed {
          background: #fff8f8;
          border-color: #f5c6cb;
        }

        .test-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .test-name {
          font-weight: bold;
        }

        .test-error {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
        }

        .test-details pre {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 3px;
          font-size: 10px;
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .storage-debugger {
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            width: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default StorageDebugger
