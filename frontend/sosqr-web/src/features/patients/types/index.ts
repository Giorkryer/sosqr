import type { BloodType, ContactRelationship } from '../../../types';

export interface EmergencyContact {
  id?: number;
  patient_id?: number;
  name: string;
  phone_number: string;
  relationship: ContactRelationship | string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ScanLog {
  id: number;
  patient_id: number;
  ip_address?: string;
  user_agent?: string;
  scanned_at: string;
  created_at: string;
}

export interface Patient {
  id: number;
  clerk_user_id?: string;
  public_token: string;
  display_name: string;
  full_name: string;
  cpf?: string;
  rg?: string;
  sus_number?: string;
  birth_date?: string;
  age?: number;
  gender?: 'Masculino' | 'Feminino' | 'Outro' | string;
  blood_type: BloodType;
  avatar_url?: string;
  medical_devices?: string[];
  health_insurance_name?: string;
  health_insurance_number?: string;
  allergies: string[];
  chronic_conditions?: string[];
  medications_in_use?: string[];
  medical_notes?: string;
  organ_donor?: boolean;
  private_notes?: string;
  emergency_contacts: EmergencyContact[];
  last_scan?: {
    date?: string;
    scanned_at?: string;
    ip_address?: string;
    ip?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export type PatientFormData = Omit<
  Patient,
  'id' | 'clerk_user_id' | 'public_token' | 'created_at' | 'updated_at' | 'age'
>;
