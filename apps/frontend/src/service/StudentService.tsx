import { useMutation, useQuery } from '@tanstack/react-query';
import { Axios, AxiosInstance } from 'axios';
import { API_BASE_URL, QUERY_KEYS } from '.';
import { callApi } from '@/lib/callApi';
import { queryClient } from '@/app/(user)/layout';

const STUDENT_BASE_URL = `${API_BASE_URL}/students`;

export const createStudent = (payload: any) => (axiosInstance: Axios) =>
  axiosInstance.post(`${STUDENT_BASE_URL}/`, payload);

export const useCreateStudent = () =>
  useMutation({
    mutationFn: async (payload: any) => {
      return callApi({
        requestFunction: createStudent(payload),
        showToastOnSuccess: false,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
      }
    },
  });

export const getStudentList = (payload: any) => (axiosInstance: AxiosInstance) =>
  axiosInstance.post(`${STUDENT_BASE_URL}/list`, payload);

export const useGetStudentList = (payload: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, payload],
    queryFn: async () => {
      const result = await callApi({
        requestFunction: getStudentList(payload),
        showToastOnSuccess: false,
      });
      return result.data;
    },
  });
};
