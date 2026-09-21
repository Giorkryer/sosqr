import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

vi.mock('@clerk/clerk-react', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  SignedOut: () => null,
  UserButton: () => React.createElement('div', { 'data-testid': 'clerk-user-button' }, 'UserButton'),
  RedirectToSignIn: () => React.createElement('div', { 'data-testid': 'clerk-redirect' }, 'RedirectToSignIn'),
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('mock-clerk-token'),
    userId: 'user_test_123',
    isSignedIn: true,
  }),
  useUser: () => ({
    user: { id: 'user_test_123', fullName: 'Cuidador Teste' },
    isSignedIn: true,
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));
