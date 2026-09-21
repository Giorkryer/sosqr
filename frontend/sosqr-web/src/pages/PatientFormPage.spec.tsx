import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PatientFormPage } from './PatientFormPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('PatientFormPage (Formulário do Perfil)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNewPatientForm = () => {
    return render(
      <MemoryRouter initialEntries={['/pacientes/novo']}>
        <Routes>
          <Route path="/pacientes/novo" element={<PatientFormPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('ao iniciar um novo cadastro, os campos de tags/chips (alergias, condições e remédios) devem iniciar como arrays vazios ([]), sem valores mockados residuais', () => {
    renderNewPatientForm();

    expect(screen.getByText('Nenhuma alergia adicionada')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma condição cadastrada')).toBeInTheDocument();
    expect(screen.getByText('Nenhum medicamento adicionado')).toBeInTheDocument();

    expect(screen.queryByText('Penicilina e Dipirona')).not.toBeInTheDocument();
    expect(screen.queryByText('Penicilina')).not.toBeInTheDocument();
    expect(screen.queryByText('Dipirona')).not.toBeInTheDocument();
    expect(screen.queryByText('Rivaroxabana (Xarelto)')).not.toBeInTheDocument();
    expect(screen.queryByText('Insulina')).not.toBeInTheDocument();
    expect(screen.queryByText('Hipertensão Arterial')).not.toBeInTheDocument();
    expect(screen.queryByText('Diabetes Tipo 2')).not.toBeInTheDocument();
  });

  it('ao digitar um CPF inválido (ex.: 111.111.111-11), deve exibir mensagem de erro visual ("CPF inválido") e desabilitar/bloquear a submissão do formulário', async () => {
    const user = userEvent.setup();
    renderNewPatientForm();

    const cpfInput = screen.getByPlaceholderText('123.456.789-01');
    const submitButton = screen.getByRole('button', { name: /salvar perfil|gerar qr code|processando/i });

    expect(submitButton).toBeDisabled();

    await user.type(cpfInput, '11111111111');

    expect(screen.getByText('CPF inválido')).toBeInTheDocument();
    expect(cpfInput).toHaveAttribute('aria-invalid', 'true');

    expect(submitButton).toBeDisabled();

    await user.click(submitButton);
    expect(api.post).not.toHaveBeenCalled();
    expect(api.put).not.toHaveBeenCalled();
  });
});
