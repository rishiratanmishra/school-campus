import { useMutation, useQuery } from '@tanstack/react-query';
import { Axios, AxiosInstance } from 'axios';
import { API_BASE_URL, QUERY_KEYS } from '.';
import { callApi } from '@/lib/callApi';
import { queryClient } from '@/lib/providers/ReactQueryProvider';

const TEACHER_BASE_URL = `${API_BASE_URL}/teachers`;

export const createTeacher = (payload: any) => (axiosInstance: Axios) =>
  axiosInstance.post(`${TEACHER_BASE_URL}/`, payload);

export const useCreateTeacher = () =>
  useMutation({
    mutationFn: async (payload: any) => {
      return callApi({
        requestFunction: createTeacher(payload),
        showToastOnSuccess: false,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] });
      }
    },
  });

export const getTeacherList =
  (payload: any) => (axiosInstance: AxiosInstance) =>
    axiosInstance.post(`${TEACHER_BASE_URL}/list`, payload);

export const useGetTeacherList = (payload: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEACHERS, payload],
    queryFn: async () => {
      const result = await callApi({
        requestFunction: getTeacherList(payload),
        showToastOnSuccess: false,
      });
      return result.data;
    },
  });
};
