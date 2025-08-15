import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { 
  fetchGlobalDiscounts, 
  selectGlobalDiscounts, 
  selectGlobalDiscountsLoading, 
  selectGlobalDiscountsError,
  selectGlobalDiscountsLastFetched,
  clearGlobalDiscounts,
  clearError
} from '@/store/slices/globalDiscountsSlice';
import { useCallback } from 'react';

export const useGlobalDiscounts = () => {
  const dispatch = useAppDispatch();
  
  const data = useAppSelector(selectGlobalDiscounts);
  const loading = useAppSelector(selectGlobalDiscountsLoading);
  const error = useAppSelector(selectGlobalDiscountsError);
  const lastFetched = useAppSelector(selectGlobalDiscountsLastFetched);

  const fetchGlobalDiscountsAction = useCallback(() => {
    dispatch(fetchGlobalDiscounts());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchGlobalDiscounts());
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearGlobalDiscounts());
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper para verificar si los datos necesitan ser actualizados (ej: cada 5 minutos)
  const shouldRefetch = useCallback((maxAgeMs: number = 5 * 60 * 1000) => {
    if (!lastFetched) return true;
    return Date.now() - lastFetched > maxAgeMs;
  }, [lastFetched]);

  // Auto-refetch si los datos son muy antiguos
  const refetchIfStale = useCallback((maxAgeMs?: number) => {
    if (shouldRefetch(maxAgeMs)) {
      refetch();
    }
  }, [shouldRefetch, refetch]);

  return {
    data,
    loading,
    error,
    lastFetched,
    fetchGlobalDiscounts: fetchGlobalDiscountsAction,
    refetch,
    clear,
    clearError: clearErrorState,
    shouldRefetch,
    refetchIfStale,
  };
};

export default useGlobalDiscounts;