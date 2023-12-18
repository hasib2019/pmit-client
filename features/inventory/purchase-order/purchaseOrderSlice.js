import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDocumentTypes } from './purchaseOrderApi';
import NotificationManager from 'react-notifications/lib/NotificationManager';
const initialState = {
  documentTypes: [],
  isLoading: false,
  isError: false,
};

export const getDocumentTypesAccordingToServiceId = createAsyncThunk(
  'inventory-purchase-order-get-document-type',

  async (queryValue, { rejectWithValue }) => {
    try {
      const result = await fetchDocumentTypes(queryValue);

      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response.data?.errors[0]?.message);
    }
  },
);

const purchaseOrderSlice = createSlice({
  name: 'inventory-purchase-order',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDocumentTypesAccordingToServiceId.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getDocumentTypesAccordingToServiceId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const types = action?.payload?.data[0].serviceRules?.documents;
        state.documentTypes = types;
      })
      .addCase(getDocumentTypesAccordingToServiceId.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action.payload ? action.payload : action.error.message);
      });
  },
});
export default purchaseOrderSlice.reducer;
