import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { AdminGuard } from './AdminGuard';

vi.mock('../../auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AdminGuard', () => {
  it('exibe mensagem de carregamento quando o usuário ainda está carregando', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: true,
      isAdmin: false,
      isConfigured: true,
      user: null,
      session: null,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AdminGuard>
          <div>Conteúdo Protegido</div>
        </AdminGuard>
      </MemoryRouter>
    );

    expect(screen.getByText(/Verificando permissões administrativas/i)).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
  });

  it('redireciona para /dashboard quando o usuário não possui a role admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: false,
      isAdmin: false,
      isConfigured: true,
      user: { id: 'user_123', email: 'cuidador@teste.com' } as any,
      session: {} as any,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <div>Conteúdo Secreto Admin</div>
              </AdminGuard>
            }
          />
          <Route path="/dashboard" element={<div>Página do Cuidador</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página do Cuidador')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo Secreto Admin')).not.toBeInTheDocument();
  });

  it('renderiza os filhos quando o usuário autenticado possui role admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: false,
      isAdmin: true,
      isConfigured: true,
      user: { id: 'admin_123', email: 'admin@sosqr.com.br' } as any,
      session: {} as any,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <div>Conteúdo Secreto Admin</div>
              </AdminGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Conteúdo Secreto Admin')).toBeInTheDocument();
  });
});
