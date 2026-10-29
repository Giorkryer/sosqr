import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthPage } from './AuthPage';
import * as AuthContextModule from './AuthContext';

describe('AuthPage - Autenticação e Google OAuth', () => {
  const mockSignIn = vi.fn();
  const mockSignUp = vi.fn();
  const mockSignInWithOAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
      isConfigured: true,
      signIn: mockSignIn,
      signUp: mockSignUp,
      signOut: vi.fn(),
      signInWithOAuth: mockSignInWithOAuth,
    });
  });

  it('deve renderizar os elementos da página de login e botão do Google', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthPage initialMode="sign-in" />
      </MemoryRouter>
    );

    expect(screen.getByText('Continuar com o Google')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar no sosqr/i })).toBeInTheDocument();
  });

  it('deve acionar signInWithOAuth com "google" ao clicar no botão do Google', async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({ error: null });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthPage initialMode="sign-in" />
      </MemoryRouter>
    );

    const googleBtn = screen.getByText('Continuar com o Google').closest('button')!;
    fireEvent.click(googleBtn);

    expect(mockSignInWithOAuth).toHaveBeenCalledWith('google');
  });

  it('deve exibir mensagem clara se o provedor Google não estiver ativado no Supabase', async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({
      error: {
        name: 'AuthError',
        message: 'Unsupported provider: provider is not enabled (validation_failed)',
      },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthPage initialMode="sign-in" />
      </MemoryRouter>
    );

    const googleBtn = screen.getByText('Continuar com o Google').closest('button')!;
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/O login com Google não está ativado no Supabase/i)
      ).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro se a URL contiver parâmetros de erro do OAuth', () => {
    render(
      <MemoryRouter initialEntries={['/login?error=validation_failed&error_description=Unsupported+provider%3A+provider+is+not+enabled']}>
        <AuthPage initialMode="sign-in" />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/O login com Google ainda não está ativado no painel do Supabase/i)
    ).toBeInTheDocument();
  });
});
