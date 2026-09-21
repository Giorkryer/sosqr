import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, setAuthTokenGetter } from './api';

describe('Camada de Integração / API (api.ts)', () => {
  const originalClerk = (window as unknown as { Clerk?: unknown }).Clerk;

  beforeEach(() => {
    setAuthTokenGetter(null as unknown as () => Promise<string | null>);
    delete (window as unknown as { Clerk?: unknown }).Clerk;
  });

  afterEach(() => {
    (window as unknown as { Clerk?: unknown }).Clerk = originalClerk;
    vi.restoreAllMocks();
  });

  it('deve validar se a instância do Axios está configurada com a baseURL correta', () => {
    const expectedBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    expect(api.defaults.baseURL).toBe(expectedBaseUrl);
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('deve injetar o cabeçalho Authorization: Bearer <token> quando houver token do Clerk disponível via setAuthTokenGetter', async () => {
    const mockToken = 'jwt-clerk-token-abc-123';
    setAuthTokenGetter(async () => mockToken);

    const handlers = (api.interceptors.request as unknown as { handlers: Array<{ fulfilled: (config: unknown) => Promise<unknown> }> }).handlers;
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

  it('deve prosseguir sem o header Authorization quando não houver token do Clerk disponível', async () => {
    setAuthTokenGetter(async () => null);

    const handlers = (api.interceptors.request as unknown as { handlers: Array<{ fulfilled: (config: unknown) => Promise<unknown> }> }).handlers;
    const requestInterceptor = handlers[0]?.fulfilled;

    const initialConfig = {
      headers: {},
    };

    const updatedConfig = (await requestInterceptor(initialConfig)) as {
      headers: { Authorization?: string };
    };

    expect(updatedConfig.headers.Authorization).toBeUndefined();
  });

  it('deve utilizar fallback de window.Clerk.session.getToken quando tokenGetter não estiver registrado', async () => {
    const mockWindowToken = 'token-from-global-window-clerk';
    (window as unknown as {
      Clerk?: { session?: { getToken: () => Promise<string | null> } };
    }).Clerk = {
      session: {
        getToken: vi.fn().mockResolvedValue(mockWindowToken),
      },
    };

    const handlers = (api.interceptors.request as unknown as { handlers: Array<{ fulfilled: (config: unknown) => Promise<unknown> }> }).handlers;
    const requestInterceptor = handlers[0]?.fulfilled;

    const initialConfig = {
      headers: {},
    };

    const updatedConfig = (await requestInterceptor(initialConfig)) as {
      headers: { Authorization?: string };
    };

    expect(updatedConfig.headers.Authorization).toBe(`Bearer ${mockWindowToken}`);
  });
});
