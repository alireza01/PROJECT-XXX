import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_SENTRY_DSN = 'test-sentry-dsn';
process.env.NEXT_PUBLIC_ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

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
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
  metrics: {
    increment: jest.fn(),
  },
  Integrations: {
    BrowserTracing: jest.fn(),
    Http: jest.fn(),
  },
})); 