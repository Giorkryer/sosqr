import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { EmergencyProfilePage } from './EmergencyProfilePage';

describe('EmergencyProfilePage (Ficha Pública de Emergência)', () => {
  const mockEmergencyData = {
    public_token: 'test-emergency-uuid',
    display_name: 'Dona Francisca',
    full_name: 'Maria Francisca dos Santos',
    age: 74,
    birth_date: '1952-05-10',
    gender: 'Feminino',
    blood_type: 'O+',
    organ_donor: true,
    allergies: ['Penicilina', 'Dipirona'],
    medications_in_use: ['Rivaroxabana (Xarelto)', 'Insulina'],
    chronic_conditions: ['Hipertensão Arterial', 'Diabetes Tipo 2'],
    medical_devices: ['Marcapasso Cardíaco'],
    medical_notes: 'Apresenta marcha instável ao entardecer.',
    health_insurance_name: 'Unimed Fortaleza',
    health_insurance_number: '123456789-0',
    emergency_contacts: [
      {
        name: 'Carlos Santos',
        relationship: 'Filho',
        phone_number: '(85) 99123-4567',
        is_primary: true,
      },
      {
        name: 'Mariana Santos',
        relationship: 'Filha',
        phone_number: '(85) 99234-5678',
        is_primary: false,
      },
    ],
  };

  beforeEach(() => {
    vi.spyOn(axios, 'get').mockResolvedValue({ data: mockEmergencyData });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderEmergencyPage = (token = 'test-emergency-uuid') => {
    return render(
      <MemoryRouter initialEntries={[`/emergency/${token}`]}>
        <Routes>
          <Route path="/emergency/:public_token" element={<EmergencyProfilePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve renderizar com destaque o Tipo Sanguíneo em badge visual de alerta', async () => {
    renderEmergencyPage();

    await waitFor(() => {
      expect(screen.getByText('Maria Francisca dos Santos')).toBeInTheDocument();
    });

    const bloodBadge = screen.getByText('O+');
    expect(bloodBadge).toBeInTheDocument();
    expect(screen.getByText(/Tipo Sanguíneo/i)).toBeInTheDocument();
    expect(screen.getByText('(Positivo)')).toBeInTheDocument();
  });

  it('deve exibir a seção de "ALERGIAS SEVERAS E MEDICAMENTOSAS" com as alergias fornecidas', async () => {
    renderEmergencyPage();

    await waitFor(() => {
      expect(screen.getByText(/ALERGIAS SEVERAS E MEDICAMENTOSAS:/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Penicilina/i)).toBeInTheDocument();
    expect(screen.getByText(/Dipirona/i)).toBeInTheDocument();
  });

  it('deve exibir a seção de "MEDICAMENTOS CRÍTICOS EM USO"', async () => {
    renderEmergencyPage();

    await waitFor(() => {
      expect(
        screen.getByText(/MEDICAMENTOS CRÍTICOS EM USO \(Risco Cirúrgico\/Sangramento\):/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Rivaroxabana \(Xarelto\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Insulina/i)).toBeInTheDocument();
  });

  it('deve renderizar a lista de contatos de emergência com links clicáveis contendo o prefixo href="tel:[telefone]"', async () => {
    renderEmergencyPage();

    await waitFor(() => {
      expect(screen.getByText(/Carlos Santos/i)).toBeInTheDocument();
    });

    const contactLinks = screen.getAllByRole('link', { name: /Ligar para/i });
    expect(contactLinks).toHaveLength(2);

    expect(contactLinks[0]).toHaveAttribute('href', 'tel:85991234567');
    expect(contactLinks[1]).toHaveAttribute('href', 'tel:85992345678');
  });

  it('não deve renderizar documentos civis restritos (como CPF ou RG)', async () => {
    renderEmergencyPage();

    await waitFor(() => {
      expect(screen.getByText('Maria Francisca dos Santos')).toBeInTheDocument();
    });

    // Garante que termos ou campos restritos de documentos civis não estão expostos na ficha pública
    expect(screen.queryByText(/\bCPF\b/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\bRG\b/)).not.toBeInTheDocument();
    expect(screen.queryByText(/123\.456\.789/i)).not.toBeInTheDocument();
  });
});
