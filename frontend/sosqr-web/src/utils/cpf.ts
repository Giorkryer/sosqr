/**
 * Utilitários de validação e formatação de CPF para a plataforma SOSqr.
 */

/**
 * Valida o algoritmo dos dígitos verificadores de um CPF segundo as regras da Receita Federal.
 * 
 * Critérios:
 * 1. Deve possuir 11 dígitos numéricos.
 * 2. Rejeita sequências com todos os dígitos repetidos (ex.: '111.111.111-11').
 * 3. Valida os cálculos do 1º e 2º dígitos verificadores.
 * 
 * @param cpf String contendo CPF formatado ou apenas números
 * @returns true se o CPF for algorítmicamente válido, false caso contrário
 */
export function isValidCPF(cpf?: string | null): boolean {
  if (!cpf || typeof cpf !== 'string') {
    return false;
  }

  const clean = cpf.replace(/\D/g, '');

  if (clean.length !== 11) {
    return false;
  }

  // Rejeita padrões com todos os dígitos iguais (ex: 000.000.000-00, 111.111.111-11)
  if (/^(\d)\1{10}$/.test(clean)) {
    return false;
  }

  // Validação do 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i], 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(clean[9], 10)) {
    return false;
  }

  // Validação do 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean[i], 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(clean[10], 10)) {
    return false;
  }

  return true;
}

export const validateCpf = isValidCPF;
export const validateCPF = isValidCPF;

/**
 * Aplica máscara de formatação padrão brasileira para CPF: 000.000.000-00
 * 
 * @param val Valor digitado pelo usuário
 * @returns String formatada com máscara de CPF
 */
export function formatCPF(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}
