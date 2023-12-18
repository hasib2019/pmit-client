import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { editSupplier, fetchSupplier, makeSupplier } from './supplierApi';
const initialState = {
  allSupplier: [],
  isLoading: false,
  isError: false,
};

export const createSupplier = createAsyncThunk(
  'inventory/supplier/create/supplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      const result = await makeSupplier(supplierData);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
export const updateSupplier = createAsyncThunk(
  'inventory/supplier/update/supplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      const result = await editSupplier(supplierData);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);

export const getSupplier = createAsyncThunk('inventory/supplier/get/supplier', async (query, { rejectWithValue }) => {
  try {
    const result = await fetchSupplier(query);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0].message);
  }
});
const supplierSlice = createSlice({
  name: 'inventory/supplier',
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createSupplier.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allSupplier = [action.payload?.data, ...state.allSupplier];
        action.payload?.data?.id ? NotificationManager.success(action.payload?.message) : '';
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(updateSupplier.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const foundIndex = state.allSupplier.findIndex((elm) => elm.id == action?.payload?.data?.id);
        state.allSupplier[foundIndex] = action.payload?.data;
        action?.payload?.data?.id ? NotificationManager.success(action.payload?.message) : '';
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getSupplier.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allSupplier = action?.payload?.data;
      })
      .addCase(getSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      });
  },
});
export default supplierSlice.reducer;
