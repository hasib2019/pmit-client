import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllSavingsProduct } from './savingsProductApi';
import NotificationManager from 'react-notifications/lib/NotificationManager';
const initialState = {
  isEdit: false,
  isLoading: false,
  isError: false,
  appId: '',
  allSavingsProduct: [],
  productInfo: {},
  productServiceChargeInfo: [{}],
  productInstallmentInfo: [{}],
  productNecessaryDocumentInfo: [{}],
  productCharge: [{}],
  errorObj: {},
};

export const getAllSavingsProduct = createAsyncThunk(
  'loan/savings-product/get-all-savings-product',
  async ({}, { rejectWithValue }) => {
    try {
      const result = await fetchAllSavingsProduct(groupName);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);

const savingsProductSlice = createSlice({
  name: 'loan/savings-product',
  initialState,
  reducers: {
    onProductInfoChange: (state, action) => {
      state.productInfo = action.payload;
    },
    onProductServiceChange: (state, acton) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSavingsProduct.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllSavingsProduct.fulfilled, (state, action) => {
        state.allSavingsProduct = action.payload?.data;
      })
      .addCase(getAllSavingsProduct.rejected, (state, action) => {
        state.isError = true;
      });
  },
});
export default savingsProductSlice.reducer;
export const { onProductInfoChange } = savingsProductSlice.actions;
