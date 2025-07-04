import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import { callApi, TokenManager } from '@/lib/callApi';
import { queryClient } from '@/app/(user)/layout';
import { QUERY_KEYS } from '.';

const USER_BASE_URL = '/users'; // Base URL will be added by Axios instance

// 🔐 LOGIN
export const loginUser = (payload: { email: string; password: string }) => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/login`, payload); // Fixed: was just '/login'

export const useLoginUser = () =>
  useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      callApi({ requestFunction: loginUser(payload) }),
    onSuccess: (data) => {
      // Store tokens after successful login
      if (data.tokens) {
        TokenManager.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
  });

// 🔐 LOGOUT
export const logoutUser = (payload: { refreshToken: string }) => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/logout`, payload);

export const useLogoutUser = () =>
  useMutation({
    mutationFn: () => {
      const refreshToken = TokenManager.getRefreshToken();
      return callApi({ 
        requestFunction: logoutUser({ refreshToken: refreshToken || '' })
      });
    },
    onSuccess: () => {
      TokenManager.clearTokens();
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });

// 🔐 REFRESH TOKEN
export const refreshToken = (payload: { refreshToken: string }) => (axios: AxiosInstance) =>
  axios.post(`/auth/refresh`, payload);

export const useRefreshToken = () =>
  useMutation({
    mutationFn: (payload: { refreshToken: string }) =>
      callApi({ requestFunction: refreshToken(payload) }),
    onSuccess: (data) => {
      if (data.tokens) {
        TokenManager.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      }
    },
  });

// 👤 GET CURRENT LOGGED-IN USER
export const getCurrentUser = () => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/details`);

export const useCurrentUser = () =>
  useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    queryFn: () => callApi({ requestFunction: getCurrentUser() }),
    enabled: TokenManager.isAuthenticated(), // Only run if authenticated
  });

// ➕ CREATE NEW USER
export const createNewUser = (payload: any) => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/register`, payload);

export const useCreateNewUser = () =>
  useMutation({
    mutationFn: (payload: any) =>
      callApi({ requestFunction: createNewUser(payload) }),
    onSuccess: (data) => {
      // Store tokens after successful registration
      if (data.tokens) {
        TokenManager.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });

// 📃 GET USER LIST (Admin only)
export const getUserList = (payload: any) => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/list`, payload);

export const useGetUserList = (payload: any) =>
  useQuery({
    queryKey: [QUERY_KEYS.USERS, payload],
    queryFn: () => callApi({ requestFunction: getUserList(payload) }),
    enabled: TokenManager.isAuthenticated(), // Only run if authenticated
  });