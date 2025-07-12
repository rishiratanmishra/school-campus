import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import { callApi } from '@/lib/callApi';
import { QUERY_KEYS } from '.';
import { useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectRefreshToken,
} from '@/store/auth/AuthenticationSlice';
import { queryClient } from '@/lib/providers/ReactQueryProvider';

const USER_BASE_URL = '/users';

// --------------------------------------
// LOGIN
// --------------------------------------

export const loginUser =
  (payload: { email: string; password: string }) => (axios: AxiosInstance) =>
    axios.post(`${USER_BASE_URL}/login`, payload);

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      callApi({ requestFunction: loginUser(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
  });
};

// --------------------------------------
// LOGOUT
// --------------------------------------

export const logoutUser =
  (payload: { refreshToken: string }) => (axios: AxiosInstance) =>
    axios.post(`${USER_BASE_URL}/logout`, payload);

export const useLogoutUser = () => {
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);

  return useMutation({
    mutationFn: () =>
      callApi({
        requestFunction: logoutUser({ refreshToken: refreshToken || '' }),
        accessToken,
        refreshToken,
      }),
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
};

// --------------------------------------
// REFRESH TOKEN
// --------------------------------------

const refreshTokenFn =
  (payload: { refreshToken: string }) => (axios: AxiosInstance) =>
    axios.post(`/auth/refresh`, payload);

export const useRefreshToken = () => {
  const refreshToken = useSelector(selectRefreshToken);

  return useMutation({
    mutationFn: () =>
      callApi({
        requestFunction: refreshTokenFn({ refreshToken: refreshToken || '' }),
        refreshToken,
      }),
    onSuccess: (data) => {
      // Dispatch setTokens(data.tokens) if needed
    },
  });
};

// --------------------------------------
// GET CURRENT USER
// --------------------------------------

export const getCurrentUser = () => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/details`);

export const useCurrentUser = () => {
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    queryFn: () =>
      callApi({
        requestFunction: getCurrentUser(),
        accessToken,
        refreshToken,
      }),
    enabled: !!accessToken,
  });
};

// --------------------------------------
// CREATE USER
// --------------------------------------

export const createNewUser = (payload: any) => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/register`, payload);

export const useCreateNewUser = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      callApi({ requestFunction: createNewUser(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
};

// --------------------------------------
// GET USER LIST (Admin only)
// --------------------------------------

export const getUserList = (payload: any) => (axios: AxiosInstance) =>
  axios.post(`${USER_BASE_URL}/list`, payload);

export const useGetUserList = (payload: any) => {
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);

  return useQuery({
    queryKey: [QUERY_KEYS.USERS, payload],
    queryFn: () =>
      callApi({
        requestFunction: getUserList(payload),
        accessToken,
        refreshToken,
      }),
    enabled: !!accessToken,
  });
};
