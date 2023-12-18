/* eslint-disable no-empty-pattern */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { fetchAllotmentInfo, fetchOfficeOrigin, fetchOfficeUnits, insertUpdateAllotment } from './allotmentApi';

const initialState = {
  officeUnits: [],
  officeOrigins: [],
  allotmentInfos: [],
  isLoading: false,
  isError: false,
};

export const getAllotmentInfo = createAsyncThunk(
  'inventory/allotment/get-allotment',
  async (params, { rejectWithValue }) => {
    try {
      const { layerId, unitId } = params;
      const result = await fetchAllotmentInfo(layerId, unitId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.respsonse?.data?.errors[0]?.message);
    }
  },
);
export const getOfficeOrigin = createAsyncThunk(
  'inventory/allotment/get-office-origin',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { rejectWithValue }) => {
    try {
      const result = await fetchOfficeOrigin();
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getOfficeUnits = createAsyncThunk(
  'inventory/allotment/get-office-units',
  async ({}, { rejectWithValue }) => {
    try {
      const result = await fetchOfficeUnits();
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const upsertAllotment = createAsyncThunk('inventory/upsert-allotment', async (payload, { rejectWithValue }) => {
  try {
    const result = await insertUpdateAllotment(payload);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});

const allotmentSlice = createSlice({
  name: 'inventory/allotment',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllotmentInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllotmentInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        state.allotmentInfos = action.payload?.data;
      })
      .addCase(getAllotmentInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        Notification.error(action?.payload ? action.payload : action.error?.message);
      })
      .addCase(getOfficeOrigin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOfficeOrigin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.officeOrigins = action.payload?.data;
      })
      .addCase(getOfficeOrigin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        Notification.error(action.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getOfficeUnits.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOfficeUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.officeUnits = action?.payload?.data;
      })
      .addCase(getOfficeUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(upsertAllotment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(upsertAllotment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        action?.payload?.data.length > 0 ? NotificationManager.success(action?.payload?.message) : '';
      })
      .addCase(upsertAllotment.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      });
  },
});
export default allotmentSlice.reducer;
