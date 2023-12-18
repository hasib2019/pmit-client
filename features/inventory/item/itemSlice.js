import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';
import { editItem, fetchAllDoptor, fetchcodeMasterTypes, fetchDoptorItemInfo, fetchItem, makeItem } from './itemApi';
const initialState = {
  itemInfo: {
    selectedDoptors: {
      doptorIds: [],
    },
  },
  selectedDoptors: [],
  codeMasterTypes: [],
  allDoptors: [],
  items: [],
  isLoading: false,
  isError: false,
  isEditMode: false,
};

const removeDuplicateObjectFromArray = (array) => {
  return array.filter((ar, index) => {
    const foundIndex = array.findIndex((a) => ar.id == a.id);
    if (index == foundIndex) {
      return ar;
    }
  });
};
export const getDoptorItemInfo = createAsyncThunk(
  'inventory-item/getDoptorInfo',
  async (itemId, { rejectWithValue }) => {
    try {
      const result = await fetchDoptorItemInfo(itemId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);
// eslint-disable-next-line no-empty-pattern
export const getAllDoptors = createAsyncThunk('inventory-item/getAllDoptors', async ({}, { rejectWithValue }) => {
  try {
    const result = await fetchAllDoptor();
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});
export const createItem = createAsyncThunk('invnetory-item/create-item', async (itemData, { rejectWithValue }) => {
  try {
    const result = await makeItem(itemData);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});
export const updateItem = createAsyncThunk('invnetory-item/update-item', async (itemData, { rejectWithValue }) => {
  try {
    const result = await editItem(itemData);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});
export const getItem = createAsyncThunk('invnetory-item/get-item', async (queryValue, { rejectWithValue }) => {
  try {
    const result = await fetchItem(queryValue);
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});
export const getCodeMasterValue = createAsyncThunk(
  'inventory-item/get-goods-type',
  async (queryValue, { rejectWithValue }) => {
    try {
      const result = await fetchcodeMasterTypes(queryValue);
      return result;
    } catch (error) {
      if (!error.response) {
        return error;
      }
      return rejectWithValue(error?.response?.data?.errors[0]?.message);
    }
  },
);

const itemSlice = createSlice({
  name: 'invnetory-item',
  initialState: initialState,
  reducers: {
    onEditModeChange: (state, action) => {
      state.isEditMode = action.payload;
    },
    onDoptorUnSelection: (state, action) => {
      state.itemInfo.selectedDoptors.doptorIds = state.itemInfo?.selectedDoptors?.doptorIds.filter(
        (elm) => elm !== action.payload.value,
      );
    },
    onDoptorSelection: (state, action) => {
      state.itemInfo.selectedDoptors.doptorIds.push(action.payload.value);
    },
    onClearDoptorSection: (state) => {
      state.itemInfo.selectedDoptors.doptorIds = [];
    },
    onSetDoptorSelection: (state, action) => {
      state.itemInfo.selectedDoptors.doptorIds = action.payload;
    },
    onSetItemToEmptyArray: (state) => {
      state.items = [];
    },
    emptyCodeMasterTypes: (state) => {
      state.codeMasterTypes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDoptors.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllDoptors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        state.allDoptors = action.payload.data?.map((doptor) => {
          return {
            doptorId: doptor.id,
            prefix: '',
            slNumberLength: '',
            maxSl: 0,
            isSelected: false,
            nameBn: doptor.nameBn,
          };
        });
        action?.payload?.data?.id ? NotificationManager.success(action?.payload?.message) : '';
      })
      .addCase(getAllDoptors.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action.error.message);
      })
      .addCase(createItem.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.items.push(action.payload.data);
        action?.payload?.data?.id ? NotificationManager.success(action?.payload?.message) : '';
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getItem.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.items = action?.payload?.data;
      })
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const foundIndex = state.items.findIndex((elm) => elm.id == action?.payload?.data?.id);
        state.items[foundIndex] = {
          ...state.items[foundIndex],
          ...action?.payload?.data,
        };
        NotificationManager.success(action?.payload.message);
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action.error?.message);
      })
      .addCase(getCodeMasterValue.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCodeMasterValue.fulfilled, (state, action) => {
        state.codeMasterTypes = removeDuplicateObjectFromArray([...state.codeMasterTypes, ...action?.payload?.data]);
      })
      .addCase(getCodeMasterValue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      });
    // .addCase(getDoptorItemInfo.pending,(state,action)=>{
    //   state.isLoading = true;
    //   state.isError = false;
    // }).addCase(getDoptorItemInfo.fulfilled, (state,action)=>{

    // });
  },
});
export default itemSlice.reducer;
export const {
  onDoptorSelection,
  onDoptorUnSelection,
  onEditModeChange,
  onClearDoptorSection,
  onSetDoptorSelection,
  onSetItemToEmptyArray,
  emptyCodeMasterTypes,
} = itemSlice.actions;
