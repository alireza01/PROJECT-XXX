import * as Sentry from '@sentry/nextjs';
import { supabase } from './supabase';

// Error types
export interface ErrorContext {
  service?: string;
  operation?: string;
  [key: string]: any;
}

export type ErrorSeverity = 'error' | 'warning' | 'info';
export type ErrorCategory = 'database' | 'api' | 'auth' | 'validation' | 'performance' | 'other';

// Error interface
export interface AppError extends Error {
  context?: ErrorContext;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  timestamp?: number;
  userId?: string;
}

// Initialize error tracking
export const initErrorTracking = () => {
  if (process.env.NODE_ENV === 'production' && !Sentry.getCurrentHub().getClient()) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      integrations: [
        new Sentry.Integrations.BrowserTracing(),
        new Sentry.Integrations.Http({ tracing: true }),
      ],
    });
  }
};

// Base logger
const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${message}`, meta);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
};

// Create an error object with context
export const createError = (
  message: string,
  context?: ErrorContext,
  severity: ErrorSeverity = 'error',
  category: ErrorCategory = 'other'
): AppError => {
  const error = new Error(message) as AppError;
  error.context = context;
  error.severity = severity;
  error.category = category;
  error.timestamp = Date.now();
  return error;
};

// Handle Supabase errors
export const handleSupabaseError = (error: any, context?: ErrorContext): never => {
  const appError = createError(
    error.message || 'An error occurred while accessing the database',
    { ...context, supabaseError: error },
    'error',
    'database'
  );
  throw appError;
};

// Handle Supabase responses
export const handleSupabaseResponse = <T>(response: { data: T | null; error: any }, context?: ErrorContext): T => {
  if (response.error) {
    handleSupabaseError(response.error, context);
  }
  
  if (!response.data) {
    handleSupabaseError(new Error('No data returned from Supabase'), context);
  }
  
  return response.data;
};

// Consolidated trackError function
export const trackError = (error: Error | AppError, context?: ErrorContext) => {
  try {
    const appError = error as AppError;
    
    // Add breadcrumb for error tracking
    Sentry.addBreadcrumb({
      category: appError.category || 'error',
      message: error.message,
      level: appError.severity || 'error',
      data: { ...appError.context, ...context },
    });

    // Capture error in Sentry
    Sentry.captureException(error, {
      contexts: {
        error: { ...appError.context, ...context },
      },
      tags: {
        category: appError.category,
        severity: appError.severity,
      },
    });

    // Log to console
    logger.error(error.message, { ...appError.context, ...context });

    // Save to database if it's a critical error
    if (appError.severity === 'error') {
      saveErrorToDatabase(appError, context).catch(dbError => {
        logger.error('Failed to save error to database', { error: dbError });
      });
    }
  } catch (sentryError) {
    logger.error('Failed to track error', { 
      originalError: error,
      sentryError,
      context 
    });
  }
};

// Track performance metrics
export const trackPerformance = (
  name: string,
  value: number,
  tags?: Record<string, string>,
  context?: ErrorContext
) => {
  try {
    // Track in Sentry
    Sentry.metrics.increment(name, value, tags);

    // Log to console
    logger.info(`Performance metric: ${name}`, { value, tags, context });

    // Save to database
    savePerformanceMetric(name, value, tags, context).catch(error => {
      logger.error('Failed to save performance metric', { error });
    });
  } catch (error) {
    trackError(createError('Failed to track performance', { name, value, tags, context }), context);
  }
};

// Track page performance
export const trackPagePerformance = (pageName: string, loadTime: number, context?: ErrorContext) => {
  trackPerformance('page.load_time', loadTime, { page: pageName }, context);
};

// Track API performance
export const trackApiPerformance = (
  endpoint: string,
  duration: number,
  status: number,
  context?: ErrorContext
) => {
  trackPerformance(
    'api.response_time',
    duration,
    { endpoint, status: status.toString() },
    context
  );
};

// Save error to database
const saveErrorToDatabase = async (error: AppError, context?: ErrorContext) => {
  try {
    const { error: dbError } = await supabase
      .from('errors')
      .insert({
        message: error.message,
        stack: error.stack,
        context: { ...error.context, ...context },
        severity: error.severity,
        category: error.category,
        user_id: error.userId,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      throw dbError;
    }
  } catch (dbError) {
    logger.error('Failed to save error to database', { error: dbError });
  }
};

// Save performance metric to database
const savePerformanceMetric = async (
  name: string,
  value: number,
  tags?: Record<string, string>,
  context?: ErrorContext
) => {
  try {
    const { error: dbError } = await supabase
      .from('performance_metrics')
      .insert({
        name,
        value,
        tags,
        context,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      throw dbError;
    }
  } catch (dbError) {
    logger.error('Failed to save performance metric', { error: dbError });
  }
};

// Error handling middleware
export const errorHandler = (err: AppError, req: any, res: any, next: any) => {
  trackError(err, {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
  });
};

export function handleError<T>(error: Error, context: ErrorContext): T | null {
  trackError(error, context);
  return null;
} 