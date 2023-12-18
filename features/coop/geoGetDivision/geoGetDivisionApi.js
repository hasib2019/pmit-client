import { geoDataRedux } from '../../../url/coop/ApiList';
import { apiSlice } from '../api/apiSlice';

export const geoGetDivisionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeoGetDivision: builder.query({
      query: (data) => geoDataRedux + data,
    }),
  }),
});

export const { useGetGeoGetDivisionQuery } = geoGetDivisionApi;
