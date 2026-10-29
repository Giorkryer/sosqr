import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, setAuthTokenGetter } from './api';
import { supabase } from './supabase';

describe('Camada de Integração / API (api.ts)', () => {
  beforeEach(() => {
    setAuthTokenGetter(null as unknown as () => Promise<string | null>);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve validar se a instância do Axios está configurada com a baseURL correta', () => {
    const expectedBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    expect(api.defaults.baseURL).toBe(expectedBaseUrl);
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('deve injetar o cabeçalho Authorization: Bearer <token> quando houver token disponível via setAuthTokenGetter', async () => {
    const mockToken = 'jwt-supabase-token-custom-123';
    setAuthTokenGetter(async () => mockToken);

    const handlers = (
      api.interceptors.request as unknown as {
        handlers: Array<{ fulfilled: (config: unknown) => Promise<unknown> }>;
      }
    ).handlers;
    const requestInterceptor = handlers[0]?.fulfilled;

    expect(requestInterceptor).toBeDefined();

    const initialConfig = {
      headers: {},
    };

    const updatedConfig = (await requestInterceptor(initialConfig)) as {
      headers: { Authorization?: string };
    };

    expect(updatedConfig.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('deve utilizar o access_token de supabase.auth.getSession() quando tokenGetter não estiver registrado', async () => {
    const mockSupabaseToken = 'token-from-supabase-session-xyz';
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          access_token: mockSupabaseToken,
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'refresh-xyz',
          user: { id: 'u1', email: 'test@sosqr.com' } as any,
        },
      },
      error: null,
    });

    const handlers = (
      api.interceptors.request as unknown as {
        handlers: Array<{ fulfilled: (config: unknown) => Promise<unknown> }>;
      }
    ).handlers;
    const requestInterceptor = handlers[0]?.fulfilled;

    const initialConfig = {
      headers: {},
    };

    const updatedConfig = (await requestInterceptor(initialConfig)) as {
      headers: { Authorization?: string };
    };

    expect(updatedConfig.headers.Authorization).toBe(`Bearer ${mockSupabaseToken}`);
  });

  it('deve prosseguir sem o header Authorization quando não houver sessão no Supabase', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: null,
    });

    const handlers = (
      api.interceptors.request as unknown as {
        handlers: Array<{ fulfilled: (config: unknown) => Promise<unknown> }>;
      }
    ).handlers;
    const requestInterceptor = handlers[0]?.fulfilled;

    const initialConfig = {
      headers: {},
    };

    const updatedConfig = (await requestInterceptor(initialConfig)) as {
      headers: { Authorization?: string };
    };

    expect(updatedConfig.headers.Authorization).toBeUndefined();
  });
});
