import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const navigate = useNavigate();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
      redirectOnError?: string;
    } = {}
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      options.onSuccess?.(data);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      setState({ data: null, loading: false, error: errorMessage });
      options.onError?.(error);
      
      if (options.redirectOnError) {
        navigate(options.redirectOnError);
      }
      
      throw error;
    }
  }, [navigate]);

  return {
    ...state,
    execute,
  };
}