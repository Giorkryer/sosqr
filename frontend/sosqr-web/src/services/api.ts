import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

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
 * Registra a função de recuperação de token do Clerk (getToken).
 * Chamada na inicialização do ciclo React pelo ClerkTokenSync.
 */
export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

/**
 * Interceptor de requisições do Axios:
 * Utiliza o método getToken() do Clerk para anexar o header Authorization: Bearer <token>
 * em todas as requisições autenticadas enviadas ao backend.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      let token: string | null = null;

      if (tokenGetter) {
        token = await tokenGetter();
      }

      if (!token && typeof window !== 'undefined') {
        const clerk = (window as unknown as {
          Clerk?: {
            session?: {
              getToken: () => Promise<string | null>;
            };
          };
        }).Clerk;

        if (clerk?.session?.getToken) {
          token = await clerk.session.getToken();
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[SOSqr API] Falha ao anexar token do Clerk na requisição:', error);
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
