import * as Sentry from '@sentry/nextjs';

// Simple console-based logger for testing
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

// Initialize Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});

// Error handling middleware
export const errorHandler = (err: Error, req: any, res: any, next: any) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Capture error in Sentry
  Sentry.captureException(err);

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
  });
};

// Logging utility functions
export const logError = (error: Error, context?: any) => {
  logger.error('Error:', {
    error: error.message,
    stack: error.stack,
    context,
  });
  Sentry.captureException(error);
};

export const logInfo = (message: string, context?: any) => {
  logger.info(message, { context });
};

export const logWarning = (message: string, context?: any) => {
  logger.warn(message, { context });
};

export default logger; 