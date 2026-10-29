import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock do cliente Supabase
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-supabase-token',
            user: { id: 'user_test_uuid', email: 'teste@sosqr.com.br' },
          },
        },
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
  isSupabaseConfigured: true,
}));

// Mock do contexto de autenticação Supabase
vi.mock('./features/auth/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user_test_uuid', email: 'teste@sosqr.com.br' },
    session: { access_token: 'mock-supabase-token' },
    loading: false,
    isAdmin: false,
    isConfigured: true,
    signIn: vi.fn().mockResolvedValue({ error: null }),
    signUp: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

// Mock legado do Clerk caso algum componente de teste ainda faça referência
vi.mock('@clerk/clerk-react', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  SignedOut: () => null,
  UserButton: () => React.createElement('div', { 'data-testid': 'user-button' }, 'UserButton'),
  RedirectToSignIn: () =>
    React.createElement('div', { 'data-testid': 'redirect-to-signin' }, 'RedirectToSignIn'),
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('mock-token'),
    userId: 'user_test_123',
    isSignedIn: true,
  }),
  useUser: () => ({
    user: { id: 'user_test_123', fullName: 'Cuidador Teste' },
    isSignedIn: true,
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));
