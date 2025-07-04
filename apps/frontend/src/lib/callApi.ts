import axios, { AxiosInstance } from 'axios';

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
};

type CallApiProps<T> = {
  requestFunction: (axiosInstance: AxiosInstance) => Promise<{ data: ApiResponse<T> }>;
  showToastOnSuccess?: boolean;
  showToastOnError?: boolean;
};

/**
 * Token management utilities
 */
export const TokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },
  
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!TokenManager.getAccessToken();
  }
};

/**
 * Returns a configured Axios instance with cookies and authorization
 */
const getAxiosInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: true, // Automatically sends and receives cookies
  });

  // Add request interceptor to attach authorization header
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/auth/refresh`,
              { refreshToken }
            );
            
            const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
            TokenManager.setTokens(accessToken, newRefreshToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }
      }
      
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

/**
 * Generic wrapper to handle API calls using Axios
 */
export async function callApi<T>({
  requestFunction,
  showToastOnSuccess = false,
  showToastOnError = true,
}: CallApiProps<T>): Promise<ApiResponse<T>> {
  const axiosInstance = getAxiosInstance();

  try {
    const response = await requestFunction(axiosInstance);

    if (showToastOnSuccess) {
      // toast.success(response.data.message || 'Success!');
    }

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Unknown error';

    if (showToastOnError) {
      // toast.error(message);
    }

    throw new Error(message);
  }
}
