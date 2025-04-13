import { trackMetric, trackUserInteraction, trackError, trackPagePerformance, trackApiPerformance } from '../lib/monitoring';
import * as Sentry from '@sentry/nextjs';

describe('Monitoring Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should track metrics correctly', () => {
    const metricName = 'test.metric';
    const value = 42;
    const tags = { tag1: 'value1' };

    trackMetric(metricName, value, tags);

    expect(Sentry.metrics.increment).toHaveBeenCalledWith(metricName, value, tags);
  });

  it('should track user interactions correctly', () => {
    const eventName = 'test.event';
    const properties = { prop1: 'value1' };

    trackUserInteraction(eventName, properties);

    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      category: 'user',
      message: eventName,
      level: 'info',
      data: properties,
    });
  });

  it('should track errors correctly', () => {
    const error = new Error('Test error');
    const context = { context1: 'value1' };

    trackError(error, context);

    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      contexts: {
        error: context,
      },
    });
  });

  it('should track page performance correctly', () => {
    const pageName = 'test.page';
    const loadTime = 1000;

    trackPagePerformance(pageName, loadTime);

    expect(Sentry.metrics.increment).toHaveBeenCalledWith(
      'page.load_time',
      loadTime,
      { page: pageName }
    );
  });

  it('should track API performance correctly', () => {
    const endpoint = '/api/test';
    const duration = 500;
    const status = 200;

    trackApiPerformance(endpoint, duration, status);

    expect(Sentry.metrics.increment).toHaveBeenCalledWith(
      'api.response_time',
      duration,
      { endpoint, status: '200' }
    );
  });
}); 