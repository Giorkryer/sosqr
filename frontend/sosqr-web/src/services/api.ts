import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Instância principal do Axios configurada para o SOSqr
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

let tokenGetter: (() => Promise<string | null>) | null = null;

/**
 * Registra a função customizada de recuperação de token (se necessário).
 */
export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

/**
 * Interceptor de requisições do Axios:
 * Anexa o token JWT de sessão do Supabase no cabeçalho Authorization: Bearer <token>
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      let token: string | null = null;

      if (tokenGetter) {
        token = await tokenGetter();
      }

      if (!token) {
        let { data } = await supabase.auth.getSession();

        // Se a sessão expirou ou vai expirar no próximo minuto, renova automaticamente
        if (data.session?.expires_at && data.session.expires_at * 1000 < Date.now() + 60000) {
          const refreshRes = await supabase.auth.refreshSession();
          if (refreshRes.data.session) {
            data = refreshRes.data;
          }
        }

        token = data.session?.access_token ?? null;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[SOSqr API] Falha ao anexar token do Supabase na requisição:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respostas:
 * Trata erros da API e notifica status 401 e 404
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Ocorreu um erro ao comunicar com os servidores de socorro.';

    if (error.response?.status === 401) {
      console.warn('[SOSqr API] Sessão expirada ou não autorizada (401).');
    } else if (error.response?.status === 404) {
      console.warn('[SOSqr API] Recurso ou ficha médica não localizada (404).');
    }

    return Promise.reject({
      ...error,
      customMessage: message,
      status: error.response?.status,
    });
  }
);

export default api;
