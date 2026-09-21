import { describe, it, expect } from 'vitest';
import { validateCpf, isValidCPF } from './validateCpf';

describe('validateCpf', () => {
  it('deve validar com sucesso CPFs reais válidos (com e sem máscara)', () => {
    // CPFs matematicamente válidos
    const validWithMask1 = '529.982.247-25';
    const validWithoutMask1 = '52998224725';
    const validWithMask2 = '123.456.789-09';
    const validWithoutMask2 = '12345678909';
    const validWithMask3 = '000.000.001-91';
    const validWithoutMask3 = '00000000191';

    expect(validateCpf(validWithMask1)).toBe(true);
    expect(validateCpf(validWithoutMask1)).toBe(true);
    expect(validateCpf(validWithMask2)).toBe(true);
    expect(validateCpf(validWithoutMask2)).toBe(true);
    expect(validateCpf(validWithMask3)).toBe(true);
    expect(validateCpf(validWithoutMask3)).toBe(true);
    expect(isValidCPF(validWithMask1)).toBe(true);
  });

  it('deve rejeitar CPFs com comprimento incorreto', () => {
    expect(validateCpf('123')).toBe(false);
    expect(validateCpf('123.456.789')).toBe(false);
    expect(validateCpf('1234567890')).toBe(false); // 10 dígitos
    expect(validateCpf('123456789012')).toBe(false); // 12 dígitos
    expect(validateCpf('123.456.789-012')).toBe(false);
  });

  it('deve rejeitar CPFs com sequências de dígitos todos iguais', () => {
    expect(validateCpf('111.111.111-11')).toBe(false);
    expect(validateCpf('11111111111')).toBe(false);
    expect(validateCpf('000.000.000-00')).toBe(false);
    expect(validateCpf('00000000000')).toBe(false);
    expect(validateCpf('222.222.222-22')).toBe(false);
    expect(validateCpf('999.999.999-99')).toBe(false);
  });

  it('deve rejeitar CPFs com dígitos verificadores matematicamente inválidos', () => {
    expect(validateCpf('123.456.789-00')).toBe(false);
    expect(validateCpf('12345678900')).toBe(false);
    expect(validateCpf('529.982.247-24')).toBe(false);
    expect(validateCpf('52998224724')).toBe(false);
    expect(validateCpf('000.000.001-90')).toBe(false);
  });

  it('deve lidar adequadamente com valores nulos, vazios ou strings não numéricas', () => {
    expect(validateCpf(null as unknown as string)).toBe(false);
    expect(validateCpf(undefined as unknown as string)).toBe(false);
    expect(validateCpf('')).toBe(false);
    expect(validateCpf('   ')).toBe(false);
    expect(validateCpf('abcdefghijk')).toBe(false);
    expect(validateCpf('!@#$%^&*()_')).toBe(false);
    expect(validateCpf('abc.def.ghi-jk')).toBe(false);
  });
});
