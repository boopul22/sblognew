import { useState, useEffect } from 'react'
import { 
  getStorageStatus, 
  validateStorage, 
  getCurrentProviderName,
  STORAGE_PROVIDERS 
} from '../../lib/storage'
import { storageConfig } from '../../lib/storage/StorageConfig'
import { validateStorageSetup } from '../../lib/storage/StorageValidator'
import { migrateStorageProvider } from '../../lib/storage/StorageMigration'
import StorageDebugger from '../../components/admin/StorageDebugger'
import toast from 'react-hot-toast'

const StorageSettings = () => {
  const [status, setStatus] = useState(null)
  const [validation, setValidation] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationProgress, setMigrationProgress] = useState(null)
  const [showDebugger, setShowDebugger] = useState(false)

  useEffect(() => {
    refreshStatus()
  }, [])

  const refreshStatus = () => {
    const currentStatus = getStorageStatus()
    const currentValidation = validateStorage()
    
    setStatus(currentStatus)
    setValidation(currentValidation)
  }

  const switchProvider = async (providerName) => {
    try {
      const success = storageConfig.switchProvider(providerName)
      if (success) {
        refreshStatus()
        toast.success(`Switched to ${providerName}`)
      } else {
        toast.error(`Failed to switch to ${providerName}. Check configuration.`)
      }
    } catch (error) {
      toast.error(`Switch failed: ${error.message}`)
    }
  }

  const runTests = async () => {
    setIsRunningTests(true)
    try {
      const results = await validateStorageSetup({
        includeUploadTest: false,
        testImageUrl: null
      })
      setTestResults(results)
      
      if (results.success) {
        toast.success(`All tests passed! (${results.passedTests}/${results.totalTests})`)
      } else {
        toast.error(`Some tests failed (${results.passedTests}/${results.totalTests})`)
      }
    } catch (error) {
      toast.error(`Test failed: ${error.message}`)
    } finally {
      setIsRunningTests(false)
    }
  }

  const startMigration = async (fromProvider, toProvider) => {
    if (!confirm(`Are you sure you want to migrate all images from ${fromProvider} to ${toProvider}? This cannot be undone.`)) {
      return
    }

    setIsMigrating(true)
    setMigrationProgress({ total: 0, migrated: 0, errors: 0, progress: 0 })

    try {
      const result = await migrateStorageProvider(fromProvider, toProvider, {
        batchSize: 5,
        dryRun: false,
        onProgress: (progress) => {
          setMigrationProgress(progress)
        }
      })

      if (result.success) {
        toast.success(`Migration completed! ${result.migratedCount}/${result.totalImages} images migrated`)
        if (result.errorCount > 0) {
          toast.error(`${result.errorCount} images failed to migrate`)
        }
      } else {
        toast.error(`Migration failed: ${result.error}`)
      }
    } catch (error) {
      toast.error(`Migration error: ${error.message}`)
    } finally {
      setIsMigrating(false)
      setMigrationProgress(null)
    }
  }

  if (!status) {
    return <div className="loading">Loading storage settings...</div>
  }

  return (
    <div className="storage-settings">
      <div className="settings-header">
        <h1>Storage Settings</h1>
        <p>Manage your image storage configuration and providers</p>
      </div>

      <div className="settings-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'providers' ? 'active' : ''}
          onClick={() => setActiveTab('providers')}
        >
          Providers
        </button>
        <button 
          className={activeTab === 'migration' ? 'active' : ''}
          onClick={() => setActiveTab('migration')}
        >
          Migration
        </button>
        <button 
          className={activeTab === 'testing' ? 'active' : ''}
          onClick={() => setActiveTab('testing')}
        >
          Testing
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="current-status">
              <h2>Current Status</h2>
              <div className="status-card">
                <div className="status-item">
                  <label>Active Provider:</label>
                  <span className={`provider-badge ${status.current}`}>
                    {status.current || 'None'}
                  </span>
                </div>
                <div className="status-item">
                  <label>Fallback Provider:</label>
                  <span className="provider-badge">
                    {status.fallback || 'None'}
                  </span>
                </div>
                <div className="status-item">
                  <label>Configuration Status:</label>
                  <span className={`status-badge ${validation.valid ? 'valid' : 'invalid'}`}>
                    {validation.valid ? '✅ Valid' : '❌ Issues Found'}
                  </span>
                </div>
              </div>
            </div>

            {!validation.valid && (
              <div className="validation-issues">
                <h3>Configuration Issues</h3>
                {validation.errors.length > 0 && (
                  <div className="errors">
                    <h4>Errors:</h4>
                    <ul>
                      {validation.errors.map((error, index) => (
                        <li key={index} className="error">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validation.warnings.length > 0 && (
                  <div className="warnings">
                    <h4>Warnings:</h4>
                    <ul>
                      {validation.warnings.map((warning, index) => (
                        <li key={index} className="warning">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={refreshStatus} className="btn btn-secondary">
                  🔄 Refresh Status
                </button>
                <button 
                  onClick={runTests} 
                  className="btn btn-primary"
                  disabled={isRunningTests}
                >
                  {isRunningTests ? '🧪 Running Tests...' : '🧪 Run Tests'}
                </button>
                <button 
                  onClick={() => setShowDebugger(!showDebugger)} 
                  className="btn btn-secondary"
                >
                  🔧 {showDebugger ? 'Hide' : 'Show'} Debugger
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="providers-tab">
            <h2>Storage Providers</h2>
            <p>Switch between different storage providers for your images.</p>
            
            <div className="providers-grid">
              {Object.entries(status.providers).map(([name, info]) => (
                <div key={name} className={`provider-card ${info.configured ? 'configured' : 'not-configured'} ${name === status.current ? 'active' : ''}`}>
                  <div className="provider-header">
                    <h3>{name}</h3>
                    <span className={`status-indicator ${info.configured ? 'configured' : 'not-configured'}`}>
                      {info.configured ? '✅ Configured' : '❌ Not Configured'}
                    </span>
                  </div>
                  
                  <div className="provider-info">
                    {name === 'supabase' && (
                      <div>
                        <p><strong>Features:</strong></p>
                        <ul>
                          <li>Built-in image optimization</li>
                          <li>Automatic WebP conversion</li>
                          <li>CDN delivery</li>
                          <li>Direct client uploads</li>
                        </ul>
                        {!info.configured && (
                          <div className="config-help">
                            <p><strong>Required:</strong></p>
                            <ul>
                              <li>VITE_SUPABASE_URL</li>
                              <li>VITE_SUPABASE_ANON_KEY</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {name === 'cloudflare-r2' && (
                      <div>
                        <p><strong>Features:</strong></p>
                        <ul>
                          <li>S3-compatible API</li>
                          <li>Global CDN</li>
                          <li>Cost-effective storage</li>
                          <li>High performance</li>
                        </ul>
                        {!info.configured && (
                          <div className="config-help">
                            <p><strong>Required:</strong></p>
                            <ul>
                              <li>VITE_CLOUDFLARE_ACCOUNT_ID</li>
                              <li>VITE_CLOUDFLARE_R2_ACCESS_KEY_ID</li>
                              <li>VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY</li>
                              <li>VITE_CLOUDFLARE_R2_BUCKET_NAME</li>
                              <li>VITE_CLOUDFLARE_R2_PUBLIC_URL</li>
                              <li>VITE_CLOUDFLARE_R2_ENDPOINT</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="provider-actions">
                    {name === status.current ? (
                      <span className="current-badge">Current Provider</span>
                    ) : info.configured ? (
                      <button 
                        onClick={() => switchProvider(name)}
                        className="btn btn-primary"
                      >
                        Switch to {name}
                      </button>
                    ) : (
                      <span className="not-configured-text">Configure in environment variables</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'migration' && (
          <div className="migration-tab">
            <h2>Storage Migration</h2>
            <p>Migrate your images between different storage providers.</p>
            
            {isMigrating && migrationProgress && (
              <div className="migration-progress">
                <h3>Migration in Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${migrationProgress.progress}%` }}
                  ></div>
                </div>
                <div className="progress-stats">
                  <span>Progress: {migrationProgress.progress}%</span>
                  <span>Migrated: {migrationProgress.migrated}/{migrationProgress.total}</span>
                  <span>Errors: {migrationProgress.errors}</span>
                </div>
              </div>
            )}

            <div className="migration-options">
              <h3>Available Migrations</h3>
              {Object.entries(status.providers).map(([fromProvider, fromInfo]) => (
                fromInfo.configured && Object.entries(status.providers).map(([toProvider, toInfo]) => (
                  fromProvider !== toProvider && toInfo.configured && (
                    <div key={`${fromProvider}-${toProvider}`} className="migration-option">
                      <div className="migration-info">
                        <h4>Migrate from {fromProvider} to {toProvider}</h4>
                        <p>This will copy all images from {fromProvider} to {toProvider}.</p>
                      </div>
                      <button 
                        onClick={() => startMigration(fromProvider, toProvider)}
                        className="btn btn-warning"
                        disabled={isMigrating}
                      >
                        {isMigrating ? 'Migration in Progress...' : `Migrate to ${toProvider}`}
                      </button>
                    </div>
                  )
                ))
              ))}
            </div>

            <div className="migration-warning">
              <h3>⚠️ Important Notes</h3>
              <ul>
                <li>Migration copies images to the new provider but doesn't delete from the old one</li>
                <li>Large migrations may take time - don't close this page during migration</li>
                <li>Test with a few images first before migrating everything</li>
                <li>Make sure both providers are properly configured before starting</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="testing-tab">
            <h2>Storage Testing</h2>
            <p>Validate your storage configuration and test functionality.</p>
            
            <div className="test-actions">
              <button 
                onClick={runTests} 
                className="btn btn-primary"
                disabled={isRunningTests}
              >
                {isRunningTests ? '🧪 Running Tests...' : '🧪 Run Validation Tests'}
              </button>
            </div>

            {testResults && (
              <div className="test-results">
                <div className={`test-summary ${testResults.success ? 'success' : 'failure'}`}>
                  <h3>Test Results</h3>
                  <p>{testResults.passedTests}/{testResults.totalTests} tests passed ({testResults.passRate}%)</p>
                </div>

                <div className="test-details">
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <StorageDebugger isVisible={showDebugger} />

      <style jsx="true">{`
        .storage-settings {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .settings-header {
          margin-bottom: 30px;
        }

        .settings-header h1 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .settings-header p {
          margin: 0;
          color: #666;
        }

        .settings-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 30px;
          border-bottom: 1px solid #ddd;
        }

        .settings-tabs button {
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-weight: 500;
        }

        .settings-tabs button.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }

        .settings-tabs button:hover {
          background: #f8f9fa;
        }

        .current-status {
          margin-bottom: 30px;
        }

        .status-card {
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-item label {
          font-weight: 500;
          color: #333;
        }

        .provider-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .provider-badge.supabase {
          background: #3ecf8e;
          color: white;
        }

        .provider-badge.cloudflare-r2 {
          background: #f38020;
          color: white;
        }

        .status-badge.valid {
          color: #28a745;
        }

        .status-badge.invalid {
          color: #dc3545;
        }

        .validation-issues {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .validation-issues .errors ul {
          color: #dc3545;
        }

        .validation-issues .warnings ul {
          color: #856404;
        }

        .quick-actions h3 {
          margin-bottom: 15px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .provider-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          background: white;
        }

        .provider-card.configured {
          border-color: #28a745;
        }

        .provider-card.not-configured {
          border-color: #dc3545;
          opacity: 0.7;
        }

        .provider-card.active {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .provider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .provider-header h3 {
          margin: 0;
          text-transform: capitalize;
        }

        .status-indicator.configured {
          color: #28a745;
        }

        .status-indicator.not-configured {
          color: #dc3545;
        }

        .provider-info ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .config-help {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin-top: 10px;
        }

        .config-help ul {
          font-family: monospace;
          font-size: 12px;
        }

        .provider-actions {
          margin-top: 15px;
        }

        .current-badge {
          background: #007bff;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .not-configured-text {
          color: #666;
          font-style: italic;
        }

        .migration-progress {
          background: #e3f2fd;
          border: 1px solid #2196f3;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin: 10px 0;
        }

        .progress-fill {
          height: 100%;
          background: #2196f3;
          transition: width 0.3s ease;
        }

        .progress-stats {
          display: flex;
          gap: 20px;
          font-size: 14px;
        }

        .migration-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .migration-warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
        }

        .test-summary.success {
          color: #28a745;
        }

        .test-summary.failure {
          color: #dc3545;
        }

        .test-result {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 15px;
          margin-bottom: 10px;
        }

        .test-result.passed {
          background: #f8fff8;
          border-color: #28a745;
        }

        .test-result.failed {
          background: #fff8f8;
          border-color: #dc3545;
        }

        .test-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }

        .test-name {
          font-weight: bold;
        }

        .test-error {
          color: #dc3545;
          font-size: 14px;
          margin-top: 5px;
        }

        .btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
          border-color: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #545b62;
          border-color: #545b62;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
          border-color: #ffc107;
        }

        .btn-warning:hover:not(:disabled) {
          background: #e0a800;
          border-color: #e0a800;
        }

        .loading {
          text-align: center;
          padding: 50px;
          color: #666;
        }

        @media (max-width: 768px) {
          .storage-settings {
            padding: 10px;
          }

          .providers-grid {
            grid-template-columns: 1fr;
          }

          .settings-tabs {
            flex-wrap: wrap;
          }

          .action-buttons {
            flex-direction: column;
          }

          .migration-option {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .status-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  )
}

export default StorageSettings
