import { api } from '../../../lib/api';
import type { Patient, PatientFormData } from '../types';

export const patientApi = {
  /**
   * Lista todos os pacientes do cuidador autenticado
   */
  async getAll(): Promise<Patient[]> {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },

  /**
   * Obtém um paciente específico pelo ID
   */
  async getById(id: number): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  /**
   * Cadastra um novo perfil com contatos de emergência aninhados
   */
  async create(data: PatientFormData): Promise<Patient> {
    const response = await api.post<Patient>('/patients', { patient: data });
    return response.data;
  },

  /**
   * Atualiza dados do perfil
   */
  async update(id: number, data: Partial<PatientFormData>): Promise<Patient> {
    const response = await api.put<Patient>(`/patients/${id}`, { patient: data });
    return response.data;
  },

  /**
   * Exclui o prontuário do perfil
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/patients/${id}`);
  },
};
