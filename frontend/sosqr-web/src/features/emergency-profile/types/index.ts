import type { BloodType, ContactRelationship } from '../../../types';

export interface PublicEmergencyContact {
  id?: number;
  name: string;
  phone_number: string;
  relationship: ContactRelationship | string;
  is_primary?: boolean;
}

/**
 * Ficha Médica Pública de Emergência (LGPD-Safe)
 * Acessível via leitura de QR Code sem expor CPF, RG, SUS ou anotações confidenciais.
 */
export interface EmergencyProfile {
  public_token: string;
  display_name: string;
  full_name?: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  blood_type: BloodType;
  medical_devices: string[];
  health_insurance_name?: string;
  health_insurance_number?: string;
  allergies: string[];
  chronic_conditions: string[];
  medications_in_use: string[];
  medical_notes?: string;
  organ_donor?: boolean;
  emergency_contacts: PublicEmergencyContact[];
}
