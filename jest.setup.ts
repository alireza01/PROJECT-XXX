import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_SENTRY_DSN = 'test-sentry-dsn';
process.env.NEXT_PUBLIC_ALLOWED_ORIGINS = 'http://localhost:3000';

// Override NODE_ENV for tests
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return {
      $$typeof: Symbol.for('react.element'),
      type: 'img',
      props: props,
      key: null,
      ref: null
    };
  },
}));

// Mock Sentry
jest.mock('@sentry/nextjs', () => {
  const mockMetrics = {
    increment: jest.fn(),
  };

  return {
    init: jest.fn(),
    captureException: jest.fn(),
    addBreadcrumb: jest.fn(),
    metrics: mockMetrics,
    Integrations: {
      BrowserTracing: jest.fn(),
      Http: jest.fn(),
    },
  };
}); 