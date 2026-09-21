/**
 * Tipos e interfaces compartilhados globalmente na aplicação SOSqr
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
  status?: number;
}

export type BloodType =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type ContactRelationship =
  | 'Filho(a)'
  | 'Cônjuge'
  | 'Irmão/Irmã'
  | 'Neto(a)'
  | 'Cuidador(a)'
  | 'Médico(a)'
  | 'Vizinho(a)'
  | 'Outro';
