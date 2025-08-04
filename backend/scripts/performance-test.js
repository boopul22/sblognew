#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests Core Web Vitals and other performance metrics
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    }
  }
}

const MOBILE_CONFIG = {
  ...LIGHTHOUSE_CONFIG,
  settings: {
    ...LIGHTHOUSE_CONFIG.settings,
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4 * 0.9,
      uploadThroughputKbps: 675 * 0.9
    }
  }
}

class PerformanceTester {
  constructor() {
    this.results = {
      desktop: null,
      mobile: null,
      bundleSize: null,
      timestamp: new Date().toISOString()
    }
  }

  async runTests(url = 'http://localhost:4173') {
    console.log('🚀 Starting Performance Tests...\n')
    
    try {
      // Test bundle size
      await this.testBundleSize()
      
      // Test desktop performance
      console.log('📊 Testing Desktop Performance...')
      this.results.desktop = await this.runLighthouse(url, LIGHTHOUSE_CONFIG, 'desktop')
      
      // Test mobile performance
      console.log('📱 Testing Mobile Performance...')
      this.results.mobile = await this.runLighthouse(url, MOBILE_CONFIG, 'mobile')
      
      // Generate report
      this.generateReport()
      
    } catch (error) {
      console.error('❌ Performance test failed:', error.message)
      process.exit(1)
    }
  }

  async testBundleSize() {
    console.log('📦 Analyzing Bundle Size...')
    
    try {
      // Build the project
      execSync('npm run build', { stdio: 'inherit' })
      
      // Analyze dist folder
      const distPath = path.join(process.cwd(), 'dist')
      const stats = this.analyzeBundleSize(distPath)
      
      this.results.bundleSize = stats
      console.log(`✅ Bundle analysis complete: ${stats.totalSize} KB total\n`)
      
    } catch (error) {
      console.error('❌ Bundle size analysis failed:', error.message)
    }
  }

  analyzeBundleSize(distPath) {
    const stats = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      imageSize: 0,
      files: []
    }

    const analyzeDirectory = (dir) => {
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          analyzeDirectory(filePath)
        } else {
          const sizeKB = Math.round(stat.size / 1024)
          const ext = path.extname(file).toLowerCase()
          
          stats.totalSize += sizeKB
          stats.files.push({ name: file, size: sizeKB, type: ext })
          
          if (ext === '.js') stats.jsSize += sizeKB
          else if (ext === '.css') stats.cssSize += sizeKB
          else if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)) {
            stats.imageSize += sizeKB
          }
        }
      })
    }

    analyzeDirectory(distPath)
    return stats
  }

  async runLighthouse(url, config, device) {
    try {
      const configPath = path.join(process.cwd(), `lighthouse-${device}.json`)
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      
      const outputPath = path.join(process.cwd(), `lighthouse-${device}-report.json`)
      
      const command = `npx lighthouse ${url} --config-path=${configPath} --output=json --output-path=${outputPath} --chrome-flags="--headless --no-sandbox"`
      
      execSync(command, { stdio: 'pipe' })
      
      const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
      
      // Clean up temp files
      fs.unlinkSync(configPath)
      fs.unlinkSync(outputPath)
      
      return this.extractMetrics(report)
      
    } catch (error) {
      console.error(`❌ Lighthouse test failed for ${device}:`, error.message)
      return null
    }
  }

  extractMetrics(report) {
    const audits = report.audits
    
    return {
      performance: report.categories.performance.score * 100,
      accessibility: report.categories.accessibility.score * 100,
      bestPractices: report.categories['best-practices'].score * 100,
      seo: report.categories.seo.score * 100,
      metrics: {
        fcp: audits['first-contentful-paint'].numericValue,
        lcp: audits['largest-contentful-paint'].numericValue,
        cls: audits['cumulative-layout-shift'].numericValue,
        fid: audits['max-potential-fid']?.numericValue || 0,
        ttfb: audits['server-response-time']?.numericValue || 0,
        speedIndex: audits['speed-index'].numericValue,
        totalBlockingTime: audits['total-blocking-time'].numericValue
      },
      opportunities: audits['diagnostics'] ? Object.keys(audits)
        .filter(key => audits[key].details && audits[key].details.type === 'opportunity')
        .map(key => ({
          audit: key,
          savings: audits[key].details.overallSavingsMs || 0,
          description: audits[key].description
        }))
        .filter(opp => opp.savings > 100)
        .sort((a, b) => b.savings - a.savings) : []
    }
  }

  generateReport() {
    console.log('\n📊 PERFORMANCE REPORT')
    console.log('=' .repeat(50))
    
    // Bundle Size Report
    if (this.results.bundleSize) {
      console.log('\n📦 Bundle Size Analysis:')
      console.log(`Total Size: ${this.results.bundleSize.totalSize} KB`)
      console.log(`JavaScript: ${this.results.bundleSize.jsSize} KB`)
      console.log(`CSS: ${this.results.bundleSize.cssSize} KB`)
      console.log(`Images: ${this.results.bundleSize.imageSize} KB`)
      
      // Check bundle size budgets
      if (this.results.bundleSize.totalSize > 1000) {
        console.log('⚠️  Warning: Total bundle size exceeds 1MB')
      }
      if (this.results.bundleSize.jsSize > 500) {
        console.log('⚠️  Warning: JavaScript bundle exceeds 500KB')
      }
    }
    
    // Desktop Performance
    if (this.results.desktop) {
      console.log('\n🖥️  Desktop Performance:')
      this.printMetrics(this.results.desktop)
    }
    
    // Mobile Performance
    if (this.results.mobile) {
      console.log('\n📱 Mobile Performance:')
      this.printMetrics(this.results.mobile)
    }
    
    // Save detailed report
    const reportPath = path.join(process.cwd(), 'performance-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))
    console.log(`\n📄 Detailed report saved to: ${reportPath}`)
  }

  printMetrics(result) {
    console.log(`Performance Score: ${Math.round(result.performance)}/100`)
    console.log(`Accessibility: ${Math.round(result.accessibility)}/100`)
    console.log(`Best Practices: ${Math.round(result.bestPractices)}/100`)
    console.log(`SEO: ${Math.round(result.seo)}/100`)
    
    console.log('\nCore Web Vitals:')
    console.log(`FCP: ${Math.round(result.metrics.fcp)}ms`)
    console.log(`LCP: ${Math.round(result.metrics.lcp)}ms`)
    console.log(`CLS: ${result.metrics.cls.toFixed(3)}`)
    console.log(`TBT: ${Math.round(result.metrics.totalBlockingTime)}ms`)
    
    // Performance warnings
    if (result.metrics.lcp > 2500) {
      console.log('⚠️  LCP needs improvement (>2.5s)')
    }
    if (result.metrics.cls > 0.1) {
      console.log('⚠️  CLS needs improvement (>0.1)')
    }
    if (result.metrics.fcp > 1800) {
      console.log('⚠️  FCP needs improvement (>1.8s)')
    }
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new PerformanceTester()
  const url = process.argv[2] || 'http://localhost:4173'
  tester.runTests(url)
}

export default PerformanceTester
