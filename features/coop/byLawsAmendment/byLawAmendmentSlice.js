import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byLawAmendment: {},
};

const byLawAmendmentSlice = createSlice({
  name: 'byLawAmendment',
  initialState,
  reducers: {
    getByLawAmendmentData: (state, action) => {
      state.byLawAmendment = action.payload;
    },
  },
});

export const { getByLawAmendmentData } = byLawAmendmentSlice.actions;
export default byLawAmendmentSlice.reducer;
