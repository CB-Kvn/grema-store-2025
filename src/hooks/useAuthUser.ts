import { useAppSelector } from './useAppSelector';

export const useAuth = () => {
  const { currentUser, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.user
  );

  return {
    user: currentUser,
    isAuthenticated,
    loading,
    error,
    isAdmin: currentUser?.typeUser === 'ADMIN',
    isBuyer: currentUser?.typeUser === 'BUYER',
  };
};
