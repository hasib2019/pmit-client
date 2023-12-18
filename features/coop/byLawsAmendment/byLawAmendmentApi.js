import { ApproveSamityReportRedux } from '../../../url/coop/ApiList';
import { apiSlice } from '../api/apiSlice';

export const byLawAmendmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getByLawAmendment: builder.query({
      query: (id) => ApproveSamityReportRedux + id,
    }),
  }),
});

export const { useGetByLawAmendmentQuery } = byLawAmendmentApi;
