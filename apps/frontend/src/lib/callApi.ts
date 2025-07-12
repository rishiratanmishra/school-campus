import axios, { AxiosInstance } from 'axios';
import { toast } from 'sonner';
// import { store } from '@/store'; // Uncomment if you want to update tokens in Redux
// import { setTokens } from '@/store/auth/slice'; // Uncomment if you use this

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
  requestFunction: (
    axiosInstance: AxiosInstance
  ) => Promise<{ data: ApiResponse<T> }>;
  showToastOnSuccess?: boolean;
  showToastOnError?: boolean;
  accessToken?: string;
  refreshToken?: string;
};

/**
 * Returns a configured Axios instance with optional tokens
 */
const getAxiosInstance = (
  accessToken?: string,
  refreshToken?: string
): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        refreshToken
      ) {
        originalRequest._retry = true;

        try {
          const refreshRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshRes.data.tokens;

          // Optional: update Redux
          // store.dispatch(setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
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
  accessToken,
  refreshToken,
}: CallApiProps<T>): Promise<ApiResponse<T>> {
  const axiosInstance = getAxiosInstance(accessToken, refreshToken);

  try {
    const response = await requestFunction(axiosInstance);

    if (showToastOnSuccess) {
      toast.success(response.data.message || 'Success!');
    }

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || 'Unknown error';

    if (showToastOnError) {
      toast.error(message);
    }

    throw new Error(message);
  }
}
