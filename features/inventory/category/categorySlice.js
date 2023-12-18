import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import NotificationManager from 'react-notifications/lib/NotificationManager';
import { makeItemCategory, fetchAllItemCategory, editItemCategory } from './categoryApi';
const initialState = {
  itemCategories: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
};

export const createItemCategory = createAsyncThunk(
  'inventory-item-category/createItemCategory',
  async (itemCategoryData, { rejectWithValue }) => {
    'itemcategoryData', itemCategoryData;
    try {
      const result = await makeItemCategory(itemCategoryData);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getAllItemCategory = createAsyncThunk(
  'inventory-item-category/getAllItemCategory',
  async (queryValue, { rejectWithValue }) => {
    try {
      const result = await fetchAllItemCategory(queryValue);
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
export const updateItemCategory = createAsyncThunk(
  'inventory-item-category/updateItemCategory',
  async (data, { rejectWithValue }) => {
    try {
      const result = await editItemCategory(data);
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
  name: 'inventory-item-category',
  initialState: initialState,
  reducers: {
    onSetCategoryDropDownInItemStoreInEditMode: (state, action) => {
      state.itemCategories = action.payload.itemCategories;
    },
    onClearCaseCadingDropDown: (state, action) => {
      state.itemCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createItemCategory.fulfilled, (state, action) => {
        'actpayload', action;
        state.isLoading = false;
        state.itemCategories = [...state.itemCategories, action.payload.data];
        action.payload?.data?.id ? NotificationManager.success(action.payload?.message) : '';
      })
      .addCase(createItemCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action.payload ? action.payload : action.error.message);
      })
      .addCase(createItemCategory.pending, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getAllItemCategory.pending, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getAllItemCategory.fulfilled, (state, action) => {
        'daaattatetet', action.payload.data;
        state.isLoading = false;
        state.itemCategories = action.payload.data;
      })
      .addCase(getAllItemCategory.rejected, (state, action) => {
        NotificationManager.error(action.payload ? action.payload : action.error.message);
        state.isError = true;
        state.isLoading = false;
      })
      .addCase(updateItemCategory.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateItemCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const foundIndex = state.itemCategories.findIndex((elm) => elm.id == action.payload.data.id);
        state.itemCategories[foundIndex] = action.payload.data;
        NotificationManager.success(action.payload?.message);
      })
      .addCase(updateItemCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoading = false;
        NotificationManager.error(action.payload ? action.payload : action.error.message);
      });
  },
});
export default itemGroupSlice.reducer;
export const { onSetCategoryDropDownInItemStoreInEditMode, onClearCaseCadingDropDown } = itemGroupSlice.actions;
