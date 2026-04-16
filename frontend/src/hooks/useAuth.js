import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { usuario, accessToken, refreshToken, isAuthenticated, isLoading, isAdmin } = useAuthStore();
  
  return {
    user: usuario,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    isAdmin
  };
};
