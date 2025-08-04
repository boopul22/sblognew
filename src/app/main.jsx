import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { register as registerSW } from '../utils/serviceWorker'
import { initPerformanceMonitoring } from '../utils/performance'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize performance monitoring
initPerformanceMonitoring()

// Register service worker for caching and offline support
if (import.meta.env.PROD) {
  registerSW({
    onSuccess: () => {
      console.log('App is cached and ready for offline use')
    },
    onUpdate: () => {
      console.log('New content available, please refresh')
    }
  })
}
