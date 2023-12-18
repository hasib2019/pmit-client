import { byLawsAmendmentGetApiRedux } from '../../../url/coop/ApiList';
import { apiSlice } from '../api/apiSlice';

export const byLawAmendmentGetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getByLawAmendmentget: builder.query({
      query: (id) => byLawsAmendmentGetApiRedux + id,
    }),
  }),
});

export const { useGetByLawAmendmentgetQuery } = byLawAmendmentGetApi;
