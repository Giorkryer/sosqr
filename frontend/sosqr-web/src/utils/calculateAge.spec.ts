import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateAge, formatAgeDisplay } from './calculateAge';

describe('calculateAge', () => {
  beforeEach(() => {
    // Congela a data atual em 19 de Setembro de 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-19T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve calcular a idade exata com base na data de nascimento e data atual quando o aniversário já ocorreu', () => {
    // Nascido em 10 de maio de 1952 -> já fez aniversário em 2026
    expect(calculateAge('1952-05-10')).toBe(74);
    expect(calculateAge('10/05/1952')).toBe(74);

    // Nascido em 15 de setembro de 1952 -> fez aniversário há 4 dias
    expect(calculateAge('1952-09-15')).toBe(74);

    // Nascido no próprio dia (19 de setembro de 1952)
    expect(calculateAge('1952-09-19')).toBe(74);
  });

  it('deve decrementar 1 ano caso o aniversário ainda não tenha ocorrido no ano corrente', () => {
    // Nascido em 20 de novembro de 1952 -> ainda fará aniversário em 2026
    expect(calculateAge('1952-11-20')).toBe(73);
    expect(calculateAge('20/11/1952')).toBe(73);

    // Nascido em 25 de setembro de 1952 -> fará aniversário em 6 dias
    expect(calculateAge('1952-09-25')).toBe(73);
    expect(calculateAge('25/09/1952')).toBe(73);

    // Nascido em 31 de dezembro de 1990
    expect(calculateAge('1990-12-31')).toBe(35);
  });

  it('deve retornar null ou fallback seguro ("Idade não informada") se a data estiver vazia, indefinida ou for inválida', () => {
    // Retorno padrão null
    expect(calculateAge('')).toBeNull();
    expect(calculateAge('   ')).toBeNull();
    expect(calculateAge(undefined)).toBeNull();
    expect(calculateAge(null)).toBeNull();
    expect(calculateAge('data-invalida')).toBeNull();
    expect(calculateAge('2026-13-45')).toBeNull();
    expect(calculateAge('32/15/1950')).toBeNull();

    // Com fallback seguro fornecido
    expect(calculateAge('', 'Idade não informada')).toBe('Idade não informada');
    expect(calculateAge(null, 'Idade não informada')).toBe('Idade não informada');
    expect(calculateAge(undefined, 'Idade não informada')).toBe('Idade não informada');
    expect(calculateAge('invalido', 'Idade não informada')).toBe('Idade não informada');

    // Helper formatAgeDisplay
    expect(formatAgeDisplay(null)).toBe('Idade não informada');
    expect(formatAgeDisplay('')).toBe('Idade não informada');
    expect(formatAgeDisplay('1952-05-10')).toBe('74 anos');
  });
});
