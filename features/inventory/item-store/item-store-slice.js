/* eslint-disable no-empty-pattern */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';
import {
  editStore,
  fetchAllDoptorLayer,
  fetchAllEmployeeDesignationIdByOfficeId,
  fetchAllOfficeByDoptorLayer,
  fetchAllOfficeUnitByOfficeId,
  fetchStore,
  makeStore,
} from './item-store-api';

const initialState = {
  allStores: [],
  allDoptorLayers: [],
  allOffices: [],
  allOfficeUnits: [],
  allAdmins: [],
  isLoading: false,
  isError: false,
  isEditMode: false,
};

export const getAllDoptorLayers = createAsyncThunk(
  'item-store/get-all-doptor-layers',
  async ({ }, { rejectWithValue }) => {
    try {
      const result = await fetchAllDoptorLayer();
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getAllOfficeByLayer = createAsyncThunk(
  'item-store/get-all-office-by-layer',
  async (layerId, { rejectWithValue }) => {
    try {
      const result = await fetchAllOfficeByDoptorLayer(layerId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getAllDesignationIdByOfficeId = createAsyncThunk(
  'item-store/get-all-designation-id-by-office-id',
  async (officeId, { rejectWithValue }) => {
    try {
      const result = await fetchAllEmployeeDesignationIdByOfficeId(officeId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);

export const getAllOfficeUnitById = createAsyncThunk(
  'item-store/get-all-office-unit-by-office-id',
  async (officeId, { rejectWithValue }) => {
    try {
      const result = await fetchAllOfficeUnitByOfficeId(officeId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getStore = createAsyncThunk('invnetory-item/get-store', async (queryValue, { rejectWithValue }) => {
  try {
    const result = await fetchStore(queryValue);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});
export const createStore = createAsyncThunk('inventory-store/create-store', async (storeData, { rejectWithValue }) => {
  try {
    const result = await makeStore(storeData);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});

export const updateStore = createAsyncThunk('inventory-store/update-store', async (storeData, { rejectWithValue }) => {
  try {
    const result = await editStore(storeData);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});
const itemStoreSlice = createSlice({
  name: 'item-store',
  initialState: initialState,
  reducers: {
    onChangeDropDownValueInEdit: (state, action) => {
      state.allDoptorLayers = action.payload.layers;
      state.allAdmins = action.payload.admins;
      // state.allOffices = action.payload.offices;
      state.allOfficeUnits = action.payload.units;
    },
    onClearStoresCascadingDropDown: (state) => {
      state.allAdmins = [];
      // state.allOffices = [];
      state.allOfficeUnits = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDoptorLayers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllDoptorLayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allDoptorLayers = action?.payload?.data;
      })
      .addCase(getAllDoptorLayers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action.error.message);
      })
      .addCase(getAllOfficeByLayer.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllOfficeByLayer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allOffices = action?.payload?.data;
      })
      .addCase(getAllOfficeByLayer.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action.error.message);
      })
      .addCase(getAllOfficeUnitById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllOfficeUnitById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        state.allOfficeUnits = action?.payload?.data;
      })
      .addCase(getAllOfficeUnitById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getAllDesignationIdByOfficeId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllDesignationIdByOfficeId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allAdmins = action?.payload?.data;
      })
      .addCase(getAllDesignationIdByOfficeId.rejected, (state, action) => {
        (state.isLoading = false), (state.isError = true);
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getStore.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allStores = action?.payload?.data;
      })
      .addCase(getStore.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(createStore.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allStores = [action.payload.data, ...state.allStores];
        action.payload?.data?.id ? NotificationManager.success(action.payload?.message) : '';
      })
      .addCase(createStore.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action.error.message);
      })
      .addCase(updateStore.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const foundIndex = state.allStores.findIndex((elm) => elm.id == action?.payload?.data?.id);
        state.allStores[foundIndex] = {
          ...state.allStores[foundIndex],
          ...action.payload?.data,
        };
        action?.payload?.data?.id ? NotificationManager.success(action?.payload?.message) : '';
      })

      .addCase(updateStore.rejected);
  },
});
export default itemStoreSlice.reducer;
export const { onChangeDropDownValueInEdit, onClearStoresCascadingDropDown } = itemStoreSlice.actions;
