import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminDashboardPage } from './AdminDashboardPage';
import { api } from '../services/api';
import type { AdminDashboardData } from '../types/admin';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockDashboardResponse: AdminDashboardData = {
  total_patients: 42,
  total_scans: 156,
  total_caregivers: 28,
  scans_today: 7,
  recent_scans: [
    {
      id: 1,
      patient_name: 'Dona Maria Francisca',
      scanned_at: '2026-09-29T08:00:00Z',
      ip_address: '187.12.***.***',
      user_agent: 'Safari (iPhone)',
      public_token: 'token-1234',
    },
  ],
};

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega e renderiza o cabeçalho, os 4 KPIs e a tabela de escaneamentos', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockDashboardResponse });

    render(<AdminDashboardPage />);

    // Cabeçalho e badge
    expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Modo Administrador')).toBeInTheDocument();

    // Aguarda resolução dos dados
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    // Tabela
    expect(screen.getByText('Dona Maria Francisca')).toBeInTheDocument();
    expect(screen.getByText('187.12.***.***')).toBeInTheDocument();
  });

  it('exibe alerta de erro e permite tentar novamente quando a API falha', async () => {
    const user = userEvent.setup();
    vi.mocked(api.get).mockRejectedValueOnce({
      customMessage: 'Falha de comunicação com o servidor admin.',
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Falha de comunicação com o servidor admin.')
      ).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /tentar novamente/i });
    expect(retryBtn).toBeInTheDocument();

    // Segunda chamada com sucesso
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockDashboardResponse });
    await user.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
    });
    expect(
      screen.queryByText('Falha de comunicação com o servidor admin.')
    ).not.toBeInTheDocument();
  });
});
