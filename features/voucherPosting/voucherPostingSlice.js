import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllGl, getSubGlList, getSubglType } from './voucherPostingApi';

const initialState = {
  allGl: [],
  subGlTypes: [],
  subGl: [],
  tabValue: 0,
  isLoading: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
};

export const fetchAllGl = createAsyncThunk('voucherPosting/fetchAllGl', async (queryString, { rejectWithValue }) => {
  try {
    const response = await getAllGl(queryString);
    return response;
  } catch (err) {
    let error = err; // cast the error for access
    if (!error.response) {
      throw err;
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data.errors[0].message);
  }
});
export const fetchSubGlType = createAsyncThunk(
  'voucherPosting/fetchSubGlType',
  async (queryString, { rejectWithValue }) => {
    try {
      const response = await getSubglType(queryString);
      return response;
    } catch (err) {
      let error = err; // cast the error for access
      if (!error.response) {
        throw err;
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data.errors[0].message);
    }
  },
);
export const fetchSubGlList = createAsyncThunk(
  'voucherPosting/fetchSubGlList',
  async ({ id, queryString }, { rejectWithValue }) => {
    try {
      const response = await getSubGlList(id, queryString);
      return response;
    } catch (err) {
      let error = err; // cast the error for access
      if (!error.response) {
        throw err;
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data.errors[0].message);
    }
  },
);

const voucherPostingSlice = createSlice({
  name: 'voucherPosting',
  initialState,
  reducers: {
    onTabSelected: (state, action) => {
      state.tabValue = action.payload;
    },
    assignedValueToAllGl: (state, action) => {
      state.allGl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGl.fulfilled, (state, action) => {
        state.allGl = action.payload;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(fetchAllGl.rejected, (state, action) => {
        'errror', action;
        state.isError = true;
        state.errorMessage = action.payload ? action.payload : action.error.message;
        state.isLoading = false;
      })
      .addCase(fetchSubGlType.fulfilled, (state, action) => {
        state.subGlTypes = action.payload;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(fetchSubGlType.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.error?.message;
        state.isLoading = false;
      })
      .addCase(fetchSubGlList.fulfilled, (state, action) => {
        state.subGl = action.payload;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(fetchSubGlList.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.error?.message;
        state.isLoading = false;
      });
  },
});
export default voucherPostingSlice.reducer;
export const { onTabSelected, assignedValueToAllGl } = voucherPostingSlice.actions;
