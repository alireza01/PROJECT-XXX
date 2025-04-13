import * as Sentry from '@sentry/nextjs';
import { logInfo, logError } from './logger';

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      integrations: [
        new Sentry.Integrations.BrowserTracing(),
        new Sentry.Integrations.Http({ tracing: true }),
      ],
    });
  }
};

// Track custom metrics
export const trackMetric = (name: string, value: number, tags?: Record<string, string>) => {
  Sentry.metrics.increment(name, value, tags);
  logInfo(`Metric tracked: ${name}`, { value, tags });
};

// Track user interactions
export const trackUserInteraction = (eventName: string, properties?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'user',
    message: eventName,
    level: 'info',
    data: properties,
  });
  logInfo(`User interaction: ${eventName}`, properties);
};

// Track errors with context
export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: {
      error: context,
    },
  });
  logError(error, context);
};

// Track page performance
export const trackPagePerformance = (pageName: string, loadTime: number) => {
  trackMetric('page.load_time', loadTime, { page: pageName });
  logInfo(`Page performance: ${pageName}`, { loadTime });
};

// Track API performance
export const trackApiPerformance = (endpoint: string, duration: number, status: number) => {
  trackMetric('api.response_time', duration, { endpoint, status: status.toString() });
  logInfo(`API performance: ${endpoint}`, { duration, status });
}; 