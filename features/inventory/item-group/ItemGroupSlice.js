import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import NotificationManager from 'react-notifications/lib/NotificationManager';
import { makeItemGroup, fetchAllItemGroup, editItemGroup } from './ItemGroupApi';
const initialState = {
  itemGroups: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
};

export const createItemGroup = createAsyncThunk(
  'inventory-itemGroup/createItemGroup',
  async (groupName, { rejectWithValue }) => {
    'grpSlicename', groupName;
    try {
      const result = await makeItemGroup(groupName);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getAllItemGroup = createAsyncThunk(
  'inventory-itemGroup/getAllItemGroup',
  async ({}, { rejectWithValue }) => {
    try {
      const result = await fetchAllItemGroup();
      return result;
    } catch (error) {
      'erroitemg', error;
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const updateItemGroup = createAsyncThunk(
  'inventory-itemGroup/updateItemGroup',
  async (data, { rejectWithValue }) => {
    try {
      const result = await editItemGroup(data);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);

const itemGroupSlice = createSlice({
  name: 'inventory-itemGroup',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createItemGroup.fulfilled, (state, action) => {
        'actpayload', action;
        state.isLoading = false;
        state.itemGroups = [...state.itemGroups, action.payload.data];
        action.payload?.data?.id ? NotificationManager.success(action.payload?.message) : '';
      })
      .addCase(createItemGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action.payload ? action.payload : action.error.message);
      })
      .addCase(createItemGroup.pending, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getAllItemGroup.pending, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getAllItemGroup.fulfilled, (state, action) => {
        'daaattatetet', action.payload.data;
        state.isLoading = false;
        state.itemGroups = action.payload.data;
      })
      .addCase(getAllItemGroup.rejected, (state, action) => {
        NotificationManager.error(action.payload ? action.payload : action.error.message);
        state.isError = true;
        state.isLoading = false;
      })
      .addCase(updateItemGroup.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateItemGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const foundIndex = state.itemGroups.findIndex((elm) => elm.id == action.payload.data.id);
        state.itemGroups[foundIndex] = action.payload.data;
        NotificationManager.success(action.payload?.message);
      })
      .addCase(updateItemGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoading = false;
        NotificationManager.error(action.payload ? action.payload : action.error.message);
      });
  },
});
export default itemGroupSlice.reducer;
