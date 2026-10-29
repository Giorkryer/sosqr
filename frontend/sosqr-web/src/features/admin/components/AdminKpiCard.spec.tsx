import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import { AdminKpiCard } from './AdminKpiCard';

describe('AdminKpiCard', () => {
  it('renderiza o rótulo, valor numérico formatado e badge com sucesso', () => {
    render(
      <AdminKpiCard
        label="Perfis Cadastrados"
        value={1250}
        icon={Users}
        badgeText="Perfis ativos"
        colorScheme="teal"
      />
    );

    expect(screen.getByText('Perfis Cadastrados')).toBeInTheDocument();
    expect(screen.getByText('1.250')).toBeInTheDocument();
    expect(screen.getByText('Perfis ativos')).toBeInTheDocument();
  });

  it('exibe skeleton de loading quando loading=true', () => {
    render(
      <AdminKpiCard
        label="Total de Scans"
        value={340}
        icon={Users}
        loading={true}
      />
    );

    expect(screen.getByText('Total de Scans')).toBeInTheDocument();
    expect(screen.queryByText('340')).not.toBeInTheDocument();
  });
});
