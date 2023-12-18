import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';
import { fetchItemRequisition } from './itemRequisitionApi';

const initialState = {
  iteRequisitionPurpose: [],
  isLoading: false,
  isError: false,
};

export const getItemRequisitionPurpose = createAsyncThunk(
  'inventory/item-requisition/get-item-requisition-purpose',
  async () => {
    try {
      const result = await fetchItemRequisition();
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
    }
  },
);

const itemRequisitionSlice = createSlice({
  name: 'inventory/item-requisition',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItemRequisitionPurpose.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getItemRequisitionPurpose.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.iteRequisitionPurpose = action.payload?.data;
      })
      .addCase(getItemRequisitionPurpose.rejected, (state, action) => {
        (state.isLoading = false), (state.isError = true);
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      });
  },
});
export default itemRequisitionSlice.reducer;
