import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { liveIp } from 'config/IpAddress';
import { localStorageData } from 'service/common';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: liveIp + 'coop/',
    prepareHeaders: async (headers) => {
      const token = localStorageData('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({}),
});
