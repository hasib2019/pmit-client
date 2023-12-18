
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getManualSamityById } from './manualSamityApi';

const initialState = {
  manualSamity: [],
  isGetManualSamityError: false,
  isGetManualSamityLoading: false,
  getManualSamityErrorMessage: '',
  update: false,
};

export const fetchManualSamityById = createAsyncThunk('manualSamity/fetchManualSamityById', async ({ id }) => {
  const response = await getManualSamityById(id);
  return response;
});

export const manualSamitySlice = createSlice({
  name: 'manualSamity',
  initialState,
  reducers: {
    onUpdateChange: (state, action) => {
      state.update = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchManualSamityById.fulfilled, (state, action) => {
        state.manualSamity = action.payload;
        state.update = true;
      })
      .addCase(fetchManualSamityById.rejected, (state, action) => {
        state.manualSamity = [];
        state.isGetManualSamityError = true;
        state.getManualSamityErrorMessage = action.error?.message;
        state.update = false;
      });
  },
});

export default manualSamitySlice.reducer;
export const { onUpdateChange } = manualSamitySlice.actions;
