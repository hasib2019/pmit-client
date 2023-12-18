import { Satellite } from '@mui/icons-material';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { makeMeasurementUnit, editMeasurementUnit, fetchAllMeasurementUnit } from './measurementUnitApi';
const initialState = {
  allMeasurementUnits: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
};
export const createMeasurementUnit = createAsyncThunk(
  'inventory-measurement-unit/create-measurement-unit',
  async (measurementObj, { rejectWithValue }) => {
    try {
      const result = await makeMeasurementUnit(measurementObj);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
export const updataeMeasurementUnit = createAsyncThunk(
  'inventory-measurement-unit/update-measurement-unit',
  async (measurementUpdateObj, { rejectWithValue }) => {
    try {
      const result = await editMeasurementUnit(measurementUpdateObj);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getAllMeasurementUnit = createAsyncThunk(
  'inventory-measurement-unit/get-all-measurement-unit',
  async (queryValue, { rejectWithValue }) => {
    try {
      const result = await fetchAllMeasurementUnit(queryValue);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response.data?.errors[0]?.message);
    }
  },
);

const measurementUnitSlice = createSlice({
  name: 'inventory-measurement-unit',
  initialState: initialState,
  reducers: {
    onSetAllMeasurementUnitsToEmptyArray: (state, action) => {
      state.allMeasurementUnits = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeasurementUnit.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createMeasurementUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allMeasurementUnits.push(action.payload.data);
        action?.payload?.data?.id ? NotificationManager.success(action.payload?.message) : '';
      })
      .addCase(createMeasurementUnit.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action.payload ? action.payload : action.error.message);
      })
      .addCase(updataeMeasurementUnit.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updataeMeasurementUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const foundIndex = state.allMeasurementUnits.findIndex((elm) => elm.id == action?.payload?.data?.id);

        state.allMeasurementUnits[foundIndex] = action.payload?.data;
        NotificationManager.success(action?.payload?.message);
      })
      .addCase(updataeMeasurementUnit.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action.payload ? action.payload : action.error?.message);
      })
      .addCase(getAllMeasurementUnit.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllMeasurementUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allMeasurementUnits = action.payload.data;
      })
      .addCase(getAllMeasurementUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action.payload ? action.payload : action.error?.message);
      });
  },
});
export default measurementUnitSlice.reducer;
export const { onSetAllMeasurementUnitsToEmptyArray } = measurementUnitSlice.actions;
