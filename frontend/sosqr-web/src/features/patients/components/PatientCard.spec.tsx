import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PatientCard } from './PatientCard';
import type { Patient } from '../types';

const mockPatient: Patient = {
  id: 1,
  clerk_user_id: 'user_123',
  public_token: 'cb11872a-8338-4119-8ca6-f14f7b77aace',
  display_name: 'Dona Francisca',
  full_name: 'Maria Francisca dos Santos',
  birth_date: '1952-05-10',
  gender: 'Feminino',
  blood_type: 'O+',
  allergies: [],
  emergency_contacts: [
    {
      name: 'Carlos',
      phone_number: '(85) 99123-4567',
      relationship: 'Filho',
      is_primary: true,
    },
  ],
  last_scan: {
    scanned_at: '14/09/2026 09:12',
    ip_address: '191.209.45.12',
  },
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-01T10:00:00Z',
};

describe('PatientCard', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date('2026-09-19T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve renderizar o nome do titular e a idade calculada dinamicamente', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );

    expect(screen.getByText('Maria Francisca dos Santos')).toBeInTheDocument();
    expect(screen.getByText(/74 anos/)).toBeInTheDocument();
  });

  it('deve exibir o badge de status "Ativo"', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );

    const activeBadge = screen.getByText('Ativo');
    expect(activeBadge).toBeInTheDocument();
    expect(activeBadge.className).toMatch(/bg-emerald-100/);
  });

  it('deve exibir as informações formatadas do último escaneamento quando disponível', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Último Escaneamento: 14\/09\/2026 09:12 \(IP: 191\.209\.45\.12\)/i)
    ).toBeInTheDocument();
  });

  it('deve exibir texto indicando ausência de escaneamentos prévios quando last_scan for indefinido', () => {
    const patientWithoutScan: Patient = {
      ...mockPatient,
      id: 2,
      last_scan: undefined,
    };

    render(
      <MemoryRouter>
        <PatientCard patient={patientWithoutScan} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/nenhum escaneamento prévio registrado/i)
    ).toBeInTheDocument();
  });

  it('deve conter os botões de ação: "Editar", "QR Code" (sem expor hash/UUID crua como texto) e "Emitir Cartão"', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );

    const editBtn = screen.getByRole('link', { name: /editar/i });
    expect(editBtn).toHaveAttribute('href', `/pacientes/${mockPatient.id}/editar`);

    const qrBtn = screen.getByRole('button', { name: /qr code/i });
    expect(qrBtn).toBeInTheDocument();
    expect(qrBtn).not.toHaveTextContent(mockPatient.public_token);
    expect(screen.queryByText(mockPatient.public_token)).not.toBeInTheDocument();

    const cardBtn = screen.getByRole('link', { name: /emitir cartão/i });
    expect(cardBtn).toHaveAttribute('href', `/pacientes/${mockPatient.id}/cartao`);
  });

  it('clicar no botão "QR Code" deve disparar a abertura do modal de visualização do código', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const handleOpenQr = vi.fn();

    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} onOpenQr={handleOpenQr} />
      </MemoryRouter>
    );

    const qrBtn = screen.getByRole('button', { name: /qr code/i });
    await user.click(qrBtn);

    expect(handleOpenQr).toHaveBeenCalledTimes(1);
    expect(handleOpenQr).toHaveBeenCalledWith(mockPatient);
  });
});
