import axios, { AxiosInstance } from 'axios';

type CallApiProps<T> = {
  requestFunction: (axiosInstance: AxiosInstance) => Promise<T>;
  showToastOnSuccess?: boolean;
  showToastOnError?: boolean;
};

export async function callApi<T>({
  requestFunction,
  showToastOnSuccess = false,
  showToastOnError = true,
}: CallApiProps<T>): Promise<T> {
  const axiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: true,
  });

  try {
    const response = await requestFunction(axiosInstance);

    if (showToastOnSuccess) {
      // Optional: add toast like toast.success('Success!')
    }

    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || 'Unknown error';

    if (showToastOnError) {
      // Optional: add toast like toast.error(message)
    }

    throw new Error(message);
  }
}
