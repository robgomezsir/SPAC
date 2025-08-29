import { useState, useCallback } from 'react';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, options?: RequestInit) => Promise<void>;
  reset: () => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (url: string, requestOptions: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        },
        ...requestOptions,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      options.onSuccess?.(responseData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook específico para POST
export function usePost<T = any>(options: UseApiOptions<T> = {}) {
  const api = useApi<T>(options);

  const post = useCallback(async (url: string, body: any) => {
    await api.execute(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, [api]);

  return {
    ...api,
    post,
  };
}

// Hook específico para GET
export function useGet<T = any>(options: UseApiOptions<T> = {}) {
  const api = useApi<T>(options);

  const get = useCallback(async (url: string) => {
    await api.execute(url, {
      method: 'GET',
    });
  }, [api]);

  return {
    ...api,
    get,
  };
}
