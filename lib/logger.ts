import winston from 'winston';
import * as Sentry from '@sentry/nextjs';

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

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