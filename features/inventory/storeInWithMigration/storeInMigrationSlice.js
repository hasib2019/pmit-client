import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';
import {
  fetchAdminEmployee,
  fetchOfficeLayerData,
  fetchOfficeNames,
  fetchStoreAdminInfo,
  makeSotreInItemApplication,
} from './storeInMigrationApi';

const initialState = {
  isLoading: false,
  isError: false,
  itemsForExcel: [],
  officeLayerData: [],
  officeNames: [],
  adminEmployees: [],
  storeAdminDesignationId: '',
};

export const getStoreAdminInfo = createAsyncThunk(
  'store-in-with-migration/get-store-admin-info',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { rejectWithValue }) => {
    try {
      const result = await fetchStoreAdminInfo();
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
export const getOfficeLayerData = createAsyncThunk(
  'store-in-with-migration/get-office-layer-data',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { rejectWithValue }) => {
    try {
      const result = await fetchOfficeLayerData();
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
export const getOfficeNames = createAsyncThunk(
  'store-in-with-migration/get-office-names',
  async (layerId, { rejectWithValue }) => {
    try {
      const result = await fetchOfficeNames(layerId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
export const getAdminEmployee = createAsyncThunk('store-in-with-migration', async (officeId, { rejectWithValue }) => {
  try {
    const result = await fetchAdminEmployee(officeId);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0].message);
  }
});
export const createApplicationWithWorkflow = createAsyncThunk(
  'store-in-with-migration/create-store-in-item-migration-application',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await makeSotreInItemApplication(payload);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
const storeInWithMigrationSlice = createSlice({
  name: 'store-in-with-migration',
  initialState: initialState,
  reducers: {
    onResetOfficeNames: (state) => {
      state.officeNames = [];
    },
    onResetAdminEmployees: (state) => {
      state.adminEmployees = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOfficeLayerData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOfficeLayerData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.officeLayerData = action.payload.data;
      })
      .addCase(getOfficeLayerData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getOfficeNames.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOfficeNames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.officeNames = action?.payload?.data;
      })
      .addCase(getOfficeNames.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getAdminEmployee.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAdminEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.adminEmployees = action?.payload?.data;
      })
      .addCase(getAdminEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(createApplicationWithWorkflow.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createApplicationWithWorkflow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        action?.payload?.data?.id ? NotificationManager.success(action?.payload?.message) : '';
      })
      .addCase(createApplicationWithWorkflow.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getStoreAdminInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getStoreAdminInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.storeAdminDesignationId = action?.payload?.data;
      })
      .addCase(getStoreAdminInfo.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      });
  },
});
export default storeInWithMigrationSlice.reducer;
export const { onResetAdminEmployees, onResetOfficeNames } = storeInWithMigrationSlice.actions;
