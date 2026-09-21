import { api } from '../../../lib/api';
import type { EmergencyProfile } from '../types';

export const emergencyApi = {
  /**
   * Obtém a ficha médica de emergência pelo token público do QR Code
   */
  async getByToken(publicToken: string): Promise<EmergencyProfile> {
    const response = await api.get<EmergencyProfile>(`/emergency/${publicToken}`);
    return response.data;
  },
};
