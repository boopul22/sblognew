import { useState, useEffect } from 'react'
import { 
  getStorageStatus, 
  validateStorage, 
  getCurrentProviderName 
} from '../../lib/storage'
import { storageConfig } from '../../lib/storage/StorageConfig'
import toast from 'react-hot-toast'

const StorageSettingsCard = ({ className = '' }) => {
  const [status, setStatus] = useState(null)
  const [validation, setValidation] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

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
    setIsSwitching(true)
    try {
      const success = storageConfig.switchProvider(providerName)
      if (success) {
        refreshStatus()
        toast.success(`✅ Switched to ${providerName}`)
      } else {
        toast.error(`❌ Failed to switch to ${providerName}. Check configuration.`)
      }
    } catch (error) {
      toast.error(`Switch failed: ${error.message}`)
    } finally {
      setIsSwitching(false)
    }
  }

  if (!status) {
    return (
      <div className={`storage-settings-card loading ${className}`}>
        <div className="card-content">
          <div className="loading-text">Loading storage settings...</div>
        </div>
      </div>
    )
  }

  const configuredProviders = Object.entries(status.providers)
    .filter(([_, info]) => info.configured)

  return (
    <div className={`storage-settings-card ${className}`}>
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-content">
          <h3>🗄️ Storage Settings</h3>
          <div className="current-provider">
            <span className="label">Current:</span>
            <span className={`provider-badge ${status.current}`}>
              {status.current || 'None'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <span className={`status-indicator ${validation.valid ? 'valid' : 'invalid'}`}>
            {validation.valid ? '✅' : '⚠️'}
          </span>
          <button className="expand-btn">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="card-content">
          {!validation.valid && (
            <div className="validation-alert">
              <div className="alert-header">⚠️ Configuration Issues</div>
              {validation.errors.length > 0 && (
                <ul className="error-list">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="providers-section">
            <h4>Available Providers ({configuredProviders.length})</h4>
            <div className="providers-list">
              {Object.entries(status.providers).map(([name, info]) => (
                <div key={name} className={`provider-item ${info.configured ? 'configured' : 'not-configured'} ${name === status.current ? 'active' : ''}`}>
                  <div className="provider-info">
                    <span className="provider-name">{name}</span>
                    <span className={`provider-status ${info.configured ? 'configured' : 'not-configured'}`}>
                      {info.configured ? '✅' : '❌'}
                    </span>
                  </div>
                  
                  {info.configured && name !== status.current && (
                    <button 
                      className="switch-btn"
                      onClick={() => switchProvider(name)}
                      disabled={isSwitching}
                    >
                      {isSwitching ? '...' : 'Switch'}
                    </button>
                  )}
                  
                  {name === status.current && (
                    <span className="current-label">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="quick-info">
            <div className="info-item">
              <span className="info-label">Configured Providers:</span>
              <span className="info-value">{configuredProviders.length}/2</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fallback Provider:</span>
              <span className="info-value">{status.fallback || 'None'}</span>
            </div>
          </div>

          <div className="card-actions">
            <button onClick={refreshStatus} className="action-btn secondary">
              🔄 Refresh
            </button>
            <button 
              onClick={() => window.open('/admin/storage-settings', '_blank')} 
              className="action-btn primary"
            >
              ⚙️ Advanced Settings
            </button>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .storage-settings-card {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .storage-settings-card.loading {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-text {
          color: #666;
          font-style: italic;
        }

        .card-header {
          padding: 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e1e5e9;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }

        .card-header:hover {
          background: #e9ecef;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .header-content h3 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        .current-provider {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .current-provider .label {
          color: #666;
        }

        .provider-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
          text-transform: capitalize;
        }

        .provider-badge.supabase {
          background: #3ecf8e;
          color: white;
        }

        .provider-badge.cloudflare-r2 {
          background: #f38020;
          color: white;
        }

        .provider-badge:not(.supabase):not(.cloudflare-r2) {
          background: #6c757d;
          color: white;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-indicator.valid {
          color: #28a745;
        }

        .status-indicator.invalid {
          color: #dc3545;
        }

        .expand-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: #666;
          padding: 4px;
        }

        .card-content {
          padding: 16px;
        }

        .validation-alert {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .alert-header {
          font-weight: bold;
          color: #856404;
          margin-bottom: 8px;
        }

        .error-list {
          margin: 0;
          padding-left: 16px;
          color: #856404;
        }

        .error-list li {
          font-size: 14px;
        }

        .providers-section {
          margin-bottom: 16px;
        }

        .providers-section h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #333;
        }

        .providers-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .provider-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #e1e5e9;
          border-radius: 4px;
          font-size: 14px;
        }

        .provider-item.configured {
          background: #f8fff8;
          border-color: #d4edda;
        }

        .provider-item.not-configured {
          background: #fff8f8;
          border-color: #f5c6cb;
          opacity: 0.7;
        }

        .provider-item.active {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .provider-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .provider-name {
          font-weight: 500;
          text-transform: capitalize;
        }

        .provider-status.configured {
          color: #28a745;
        }

        .provider-status.not-configured {
          color: #dc3545;
        }

        .switch-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s;
        }

        .switch-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .switch-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .current-label {
          background: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: bold;
        }

        .quick-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .info-label {
          color: #666;
        }

        .info-value {
          font-weight: 500;
          color: #333;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .action-btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .action-btn.primary:hover {
          background: #0056b3;
          border-color: #0056b3;
        }

        .action-btn.secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .action-btn.secondary:hover {
          background: #545b62;
          border-color: #545b62;
        }

        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .header-actions {
            align-self: flex-end;
          }

          .card-actions {
            flex-direction: column;
          }

          .quick-info {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}

export default StorageSettingsCard
