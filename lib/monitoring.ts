/**
 * Monitoring utilities for tracking metrics and user interactions
 */

import { useEffect } from 'react'

// Define a custom Performance type for browser environments
interface BrowserPerformance {
  getEntriesByType(type: string): PerformanceEntry[]
  measure(name: string, startMark?: string, endMark?: string): void
}

// Add type declarations for Performance API types
declare global {
  interface PerformanceEntry {
    readonly startTime: number
    readonly name: string
  }

  interface LayoutShift extends PerformanceEntry {
    readonly value: number
  }

  interface PerformanceEventTiming extends PerformanceEntry {
    readonly processingStart: number
  }

  interface PerformanceResourceTiming extends PerformanceEntry {
    readonly responseStart: number
    readonly requestStart: number
  }

  interface PerformanceNavigationTiming extends PerformanceEntry {
    readonly loadEventEnd: number
  }

  interface Window {
    performance: BrowserPerformance
  }
}

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
}

let performanceMonitor: BrowserPerformance | null = null

export function initPerformanceMonitoring() {
  if (typeof window !== 'undefined' && window.performance) {
    performanceMonitor = window.performance
  }
}

export function getPagePerformanceMetrics(): PerformanceMetrics {
  if (!performanceMonitor) {
    return {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
    }
  }

  const navigation = performanceMonitor.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performanceMonitor.getEntriesByType('paint')
  const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
  const lcp = performanceMonitor.getEntriesByType('largest-contentful-paint')[0]
  const fid = performanceMonitor.getEntriesByType('first-input')[0] as PerformanceEventTiming
  const cls = performanceMonitor.getEntriesByType('layout-shift')[0] as LayoutShift

  return {
    pageLoadTime: navigation ? navigation.loadEventEnd - navigation.startTime : 0,
    firstContentfulPaint: fcp ? fcp.startTime : 0,
    largestContentfulPaint: lcp ? lcp.startTime : 0,
    firstInputDelay: fid ? fid.processingStart - fid.startTime : 0,
    cumulativeLayoutShift: cls ? cls.value : 0,
  }
}

export function trackMetric(name: string, value: number) {
  if (typeof window !== 'undefined' && window.performance) {
    const metric = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`${name}:`, entry)
      }
    })
    metric.observe({ entryTypes: ['measure'] })
    performanceMonitor?.measure(name, undefined, undefined)
  }
}

export function trackUserInteraction(action: string, data?: any) {
  if (typeof window !== 'undefined') {
    console.log('User Interaction:', { action, data, timestamp: Date.now() })
  }
}

export const usePerformanceMonitoring = (callback: (metrics: PerformanceMetrics) => void) => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const metrics: PerformanceMetrics = {
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0
      }

      entries.forEach((entry) => {
        switch (entry.name) {
          case 'first-contentful-paint':
            metrics.firstContentfulPaint = entry.startTime
            break
          case 'largest-contentful-paint':
            metrics.largestContentfulPaint = entry.startTime
            break
          case 'first-input-delay':
            if ('processingStart' in entry) {
              metrics.firstInputDelay = (entry as PerformanceEventTiming).processingStart - entry.startTime
            }
            break
          case 'cumulative-layout-shift':
            if ('value' in entry) {
              metrics.cumulativeLayoutShift = (entry as LayoutShift).value
            }
            break
          case 'time-to-first-byte':
            if ('responseStart' in entry && 'requestStart' in entry) {
              metrics.pageLoadTime = (entry as PerformanceResourceTiming).responseStart - (entry as PerformanceResourceTiming).requestStart
            }
            break
        }
      })

      callback(metrics)
    })

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'resource'] })

    return () => observer.disconnect()
  }, [callback])
}

export const logPerformanceMetrics = (metrics: PerformanceMetrics) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Metrics:', metrics)
  }
  // Here you can add your analytics service integration
  // Example: analytics.track('performance_metrics', metrics)
}

/**
 * Track page performance metrics
 * @param pageName - The name of the page
 * @param metrics - Performance metrics
 */
export function trackPagePerformance(pageName: string, metrics: Record<string, number>) {
  // Implementation for tracking page performance
  console.log(`Page performance tracked for ${pageName}:`, metrics)
} 