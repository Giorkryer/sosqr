/**
 * Tipagens do Módulo Administrativo do SOSqr
 */

export interface ScanLogItem {
  id: string | number;
  patient_name: string;
  scanned_at: string;
  ip_address: string;
  user_agent: string;
  patient_id?: number;
  public_token?: string;
}

export interface AdminDashboardData {
  total_patients: number;
  total_scans: number;
  total_caregivers: number;
  scans_today: number;
  recent_scans: ScanLogItem[];
  kpis?: {
    total_patients: number;
    total_scans: number;
    total_caregivers: number;
    scans_today?: number;
  };
}
