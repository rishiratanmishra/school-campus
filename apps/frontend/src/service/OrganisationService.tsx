import { useMutation, useQuery } from '@tanstack/react-query';
import { Axios, AxiosInstance } from 'axios';
import { API_BASE_URL, QUERY_KEYS } from '.';
import { callApi } from '@/lib/callApi';
import { IOrganisationZS } from 'api-definitions/features/organisation/organisation.zod';
import { queryClient } from '@/lib/providers/ReactQueryProvider';

// ----------------- CONSTANTS ------------------
const ORGANISATION_BASE_URL = `${API_BASE_URL}/organisation`;

// ----------------- GET ORGANISATION DETAILS ------------------

const getOrganisationDetails = (payload: { _id: string }) =>
  (axiosInstance: AxiosInstance) =>
    axiosInstance.post(`${ORGANISATION_BASE_URL}/details`, payload);

export const useGetOrganisationDetails = (payload: { _id: string } | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANISATION, 'details', payload?._id],
    queryFn: async () => {
      if (!payload) return null;
      const data = await callApi<IOrganisationZS>({
        requestFunction: getOrganisationDetails(payload),
        showToastOnSuccess: false,
      });
      return data ?? null;
    },
    enabled: !!payload?._id,
  });
};

// ----------------- GET ORGANISATION LIST ------------------

const getOrganisationList = (payload: any) =>
  (axiosInstance: AxiosInstance) =>
    axiosInstance.post(`${ORGANISATION_BASE_URL}/list`, payload);

export const useGetOrganisationList = (payload: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANISATION, 'list', payload],
    queryFn: async () => {
      const result = await callApi<{ data: IOrganisationZS[] }>({
        requestFunction: getOrganisationList(payload),
        showToastOnSuccess: false,
      });
      return result?.data ?? [];
    },
    enabled: !!payload,
  });
};

// ----------------- CREATE ORGANISATION ------------------

const createOrganisation = (payload: any) =>
  (axiosInstance: AxiosInstance) =>
    axiosInstance.post(`${ORGANISATION_BASE_URL}/`, payload);

export const useCreateOrganisation = () =>
  useMutation({
    mutationFn: async (payload: any) => {
      return callApi({
        requestFunction: createOrganisation(payload),
        showToastOnSuccess: false,
      });
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANISATION],
        });
      }
    },
  });