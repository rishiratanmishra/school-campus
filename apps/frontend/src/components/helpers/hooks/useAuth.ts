import { useQuery } from '@tanstack/react-query';
import { TokenManager } from '@/lib/callApi';
import { useCurrentUser, useLogoutUser } from '@/service/UserService';

export const useAuth = () => {
  const currentUser = useCurrentUser();
  const logoutMutation = useLogoutUser();
  
  const isAuthenticated = TokenManager.isAuthenticated();
  const isLoading = currentUser.isLoading;
  const user = currentUser.data?.data;

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Even if logout fails, clear tokens locally
      TokenManager.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
  };
};
