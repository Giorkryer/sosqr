/**
 * Utilitários para manipulação e cálculo de datas na plataforma SOSqr.
 */

/**
 * Calcula a idade exata baseada na data de nascimento e na data atual.
 * 
 * Suporta formatos:
 * - ISO: 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:mm:ss.sssZ'
 * - Padrão Brasileiro: 'DD/MM/YYYY'
 * 
 * @param birthDateString String contendo a data de nascimento
 * @param fallback Valor de retorno opcional quando a data for inválida ou vazia (padrão: null)
 * @returns Idade calculada em anos (número inteiro >= 0), ou null / fallback caso inválido.
 */
export function calculateAge<T = null>(
  birthDateString?: string | null,
  fallback: T = null as unknown as T
): number | T {
  if (!birthDateString || typeof birthDateString !== 'string') {
    return fallback;
  }

  const trimmed = birthDateString.trim();
  if (!trimmed) {
    return fallback;
  }

  let birthDate: Date;

  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);
      birthDate = new Date(year, month, day);
      if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month ||
        birthDate.getDate() !== day
      ) {
        return fallback;
      }
    } else {
      birthDate = new Date(trimmed);
    }
  } else {
    const cleanDate = trimmed.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      birthDate = new Date(year, month, day);
      if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month ||
        birthDate.getDate() !== day
      ) {
        return fallback;
      }
    } else {
      birthDate = new Date(trimmed);
    }
  }

  if (isNaN(birthDate.getTime())) {
    return fallback;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Decrementa 1 ano caso o aniversário ainda não tenha ocorrido no ano corrente
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? age : fallback;
}

/**
 * Retorna a idade formatada para exibição em cards e telas (ex.: "74 anos" ou "Idade não informada").
 */
export function formatAgeDisplay(
  birthDateString?: string | null,
  fallbackAge?: number | null
): string {
  const age = calculateAge(birthDateString);
  if (age !== null && typeof age === 'number') {
    return `${age} anos`;
  }
  if (fallbackAge !== undefined && fallbackAge !== null && typeof fallbackAge === 'number') {
    return `${fallbackAge} anos`;
  }
  return 'Idade não informada';
}
