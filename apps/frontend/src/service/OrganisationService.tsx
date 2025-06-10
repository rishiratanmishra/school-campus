import { useMutation, useQuery } from '@tanstack/react-query';
import { Axios, AxiosInstance } from 'axios';
import { API_BASE_URL, QUERY_KEYS } from '.';
import { callApi } from '@/lib/callApi';
import { queryClient } from '@/app/(user)/layout';

const ORGANISATION_BASE_URL = `${API_BASE_URL}/organisation`;

export const createOrganisation = (payload: any) => (axiosInstance: Axios) =>
  axiosInstance.post(`${ORGANISATION_BASE_URL}/`, payload);

export const useCreateOrganisation = () =>
  useMutation({
    mutationFn: async (payload: any) => {
      return callApi({
        requestFunction: createOrganisation(payload),
        showToastOnSuccess: false,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANISATION] });
      }
    },
  });

export const getOrganisationList = (payload: any) => (axiosInstance: AxiosInstance) =>
  axiosInstance.post(`${ORGANISATION_BASE_URL}/list`, payload);

export const useGetOrganisationList = (payload: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANISATION, payload],
    queryFn: async () => {
      const result = await callApi({
        requestFunction: getOrganisationList(payload),
        showToastOnSuccess: false,
      });
      return result.data;
    },
  });
};
