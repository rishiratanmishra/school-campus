import axios, { AxiosInstance } from 'axios';

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type CallApiProps<T> = {
  requestFunction: (axiosInstance: AxiosInstance) => Promise<{ data: ApiResponse<T> }>;
  showToastOnSuccess?: boolean;
  showToastOnError?: boolean;
};

export async function callApi<T>({
  requestFunction,
  showToastOnSuccess = false,
  showToastOnError = true,
}: CallApiProps<T>): Promise<ApiResponse<T>> {
  const axiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: true,
  });

  try {
    const response = await requestFunction(axiosInstance);

    if (showToastOnSuccess) {
      // e.g., toast.success(response.data.message || 'Success!');
    }

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || 'Unknown error';

    if (showToastOnError) {
      // e.g., toast.error(message);
    }

    throw new Error(message);
  }
}
