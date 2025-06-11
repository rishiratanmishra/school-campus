import { useQuery } from '@tanstack/react-query';
import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, QUERY_KEYS } from '.';
import { callApi } from '@/lib/callApi';

const USER_BASE_URL = `${API_BASE_URL}/users`;

export const getUserList = (payload: any) => (axiosInstance: AxiosInstance) =>
  axiosInstance.post(`${USER_BASE_URL}/list`, payload);

export const useGetUserList = (payload: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, payload],
    queryFn: async () => {
      const result = await callApi({
        requestFunction: getUserList(payload),
        showToastOnSuccess: false,
      });
      return result.data;
    },
  });
};
