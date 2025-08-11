"use client";

import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // In production, you would send this to your analytics service
  // For now, we'll just log it
  console.log('Web Vitals:', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  });

  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      metric_id: metric.id,
    });
  }

  // Example: Send to your own analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(console.error);
  }
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Dynamic import of web-vitals library
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      // Track Core Web Vitals
      onCLS((metric) => {
        const webVitalsMetric: WebVitalsMetric = {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          delta: metric.delta,
          id: metric.id,
        };
        sendToAnalytics(webVitalsMetric);
      });

      // Note: FID is deprecated in favor of INP in newer versions

      onFCP((metric) => {
        const webVitalsMetric: WebVitalsMetric = {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          delta: metric.delta,
          id: metric.id,
        };
        sendToAnalytics(webVitalsMetric);
      });

      onLCP((metric) => {
        const webVitalsMetric: WebVitalsMetric = {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          delta: metric.delta,
          id: metric.id,
        };
        sendToAnalytics(webVitalsMetric);
      });

      onTTFB((metric) => {
        const webVitalsMetric: WebVitalsMetric = {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          delta: metric.delta,
          id: metric.id,
        };
        sendToAnalytics(webVitalsMetric);
      });

      onINP((metric) => {
        const webVitalsMetric: WebVitalsMetric = {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          delta: metric.delta,
          id: metric.id,
        };
        sendToAnalytics(webVitalsMetric);
      });
    }).catch((error) => {
      console.warn('Failed to load web-vitals library:', error);
    });
  }, []);

  // This component doesn't render anything
  return null;
}
