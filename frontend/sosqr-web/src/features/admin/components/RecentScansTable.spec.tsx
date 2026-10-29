import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecentScansTable } from './RecentScansTable';
import type { ScanLogItem } from '../../../types/admin';

const mockScans: ScanLogItem[] = [
  {
    id: 1,
    patient_name: 'Antônio da Silva',
    scanned_at: '2026-09-29T10:30:00Z',
    ip_address: '191.209.***.***',
    user_agent: 'Chrome (Windows)',
    public_token: 'uuid-1234-5678',
  },
  {
    id: 2,
    patient_name: 'Helena Ribeiro',
    scanned_at: '2026-09-28T15:45:00Z',
    ip_address: '187.12.***.***',
    user_agent: 'Safari (iPhone)',
    public_token: 'uuid-9876-5432',
  },
  {
    id: 3,
    patient_name: 'Perfil Desativado',
    scanned_at: '2026-09-27T08:00:00Z',
    ip_address: '200.100.***.***',
    user_agent: 'Firefox (Linux)',
  },
];

describe('RecentScansTable', () => {
  it('renderiza os registros com nome, data formatada, IP mascarado e dispositivo', () => {
    render(<RecentScansTable scans={mockScans} />);

    expect(screen.getByText('Antônio da Silva')).toBeInTheDocument();
    expect(screen.getByText('Helena Ribeiro')).toBeInTheDocument();
    expect(screen.getByText('Perfil Desativado')).toBeInTheDocument();

    expect(screen.getByText('191.209.***.***')).toBeInTheDocument();
    expect(screen.getByText('Chrome (Windows)')).toBeInTheDocument();
  });

  it('permite filtrar registros em tempo real por nome do titular', async () => {
    const user = userEvent.setup();
    render(<RecentScansTable scans={mockScans} />);

    const searchInput = screen.getByPlaceholderText(/buscar por nome do titular/i);
    await user.type(searchInput, 'Antônio');

    expect(screen.getByText('Antônio da Silva')).toBeInTheDocument();
    expect(screen.queryByText('Helena Ribeiro')).not.toBeInTheDocument();
  });

  it('exibe estado vazio amigável quando a busca não traz resultados', async () => {
    const user = userEvent.setup();
    render(<RecentScansTable scans={mockScans} />);

    const searchInput = screen.getByPlaceholderText(/buscar por nome do titular/i);
    await user.type(searchInput, 'NomeInexistente');

    expect(
      screen.getByText(/Nenhum escaneamento encontrado para "NomeInexistente"/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Limpar busca')).toBeInTheDocument();
  });

  it('exibe skeleton de loading quando loading=true', () => {
    const { container } = render(<RecentScansTable scans={[]} loading={true} />);

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
