import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

// Mock Next.js router for testing
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Default mock implementation for useRouter
useRouter.mockImplementation(() => ({
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
}));
