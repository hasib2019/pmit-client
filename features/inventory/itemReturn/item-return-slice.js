import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useErrorBoundary } from 'react-error-boundary';
import { NotificationManager } from 'react-notifications';
import { fetchNonFixedReturnableItems, fetchReturnableItems } from './item-return-api';
const initialState = {
  returnableItems: [],
  nonFixedReturnableItems: [],
  isLoading: false,
  isError: false,
  nonFixedReturnedItmes: [
    {
      itemId: null,
      assetType: null,
      assetTypeName: null,
      returnedQuantity: null,
    },
  ],
};
export const getNonFixedReturnableItems = createAsyncThunk(
  'item-return/get-non-fixed-returnable-items',
  // eslint-disable-next-line no-empty-pattern
  async ({ }, { rejectWithValue }) => {
    try {
      const nonFixedReturnableItems = await fetchNonFixedReturnableItems();
      return nonFixedReturnableItems;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
export const getReturnableItems = createAsyncThunk(
  'item-return/get-returnable-items',
  // eslint-disable-next-line no-empty-pattern
  async ({ }, { rejectWithValue }) => {
    try {
      const returnableItems = await fetchReturnableItems();
      return returnableItems;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);

const ItemRetunSlice = createSlice({
  name: 'item-return',
  initialState: initialState,
  reducers: {
    onChangeNonFixedReturnedItems: (state, action) => {
      state.nonFixedReturnedItmes = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReturnableItems.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getReturnableItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.returnableItems = action.payload?.data;
      })
      .addCase(getReturnableItems.rejected, (state, action) => {
        const { showBoundary } = useErrorBoundary();

        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
        showBoundary(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getNonFixedReturnableItems.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getNonFixedReturnableItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.nonFixedReturnableItems = action?.payload?.data;
      })
      .addCase(getNonFixedReturnableItems.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default ItemRetunSlice.reducer;
export const { onChangeNonFixedReturnedItems } = ItemRetunSlice.actions;
