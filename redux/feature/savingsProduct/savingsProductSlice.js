import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createProduct, getProductInfoByAppId, updateProduct } from './savingsProductApi';
import { NotificationManager } from 'react-notifications';

//initial state
const initialState = {
  projectList: [],
  isLoading: false,
  isError: false,
  error: '',
  editingObj: {},
  appId: '',
  productName: '',
  specificProductInfo: {},
};

//async thunk function for communicating with API
// export const fetchJobs=createAsyncThunk('job/fetchJobs',async()=>{
// const fetchJobs=await getJobList();

// return fetchJobs;
// })
export const addSavingsProduct = createAsyncThunk(
  'savingsProduct/createSavingsProduct',
  async (data, { rejectWithValue }) => {
    try {
      const savingsProductInfo = await createProduct(data);
      return savingsProductInfo;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);
export const getProductInfo = createAsyncThunk('savingsProduct/getProductInfo', async (id) => {
  const savingsProductInfo = await getProductInfoByAppId(id);
  return savingsProductInfo;
});

// export const editProductInfo=createAsyncThunk('savingsProduct/editProductInfo',async({id,data})=>{
//     const editProductResp=await updateProduct(id,data);

//     return editProductResp;
// })

export const editProductInfo = createAsyncThunk(
  'savingsProduct/editProductInfo',
  async (params, { rejectWithValue }) => {
    try {
      const { id, data } = params;
      const result = await updateProduct(id, data);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);

//slice for the thunk functions

const savingsProductSlice = createSlice({
  name: 'savingsProduct/savingsProductSlice',
  initialState,
  reducers: {
    refreshState: (state) => {
      (state.projectList = []),
        (state.isLoading = false),
        (state.isError = false),
        (state.error = ''),
        (state.editingObj = {}),
        (state.appId = ''),
        (state.productName = ''),
        (state.specificProductInfo = {});
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSavingsProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = '';
      })
      .addCase(addSavingsProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.specificProductInfo = action.payload?.data?.data;
        state.appId = action.payload?.data?.id;
        NotificationManager.success(action?.payload.message);
      })
      .addCase(addSavingsProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action?.payload?.errors[0]?.message;
        NotificationManager.error(action?.payload?.errors[0]?.message);
      })
      .addCase(getProductInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = '';
      })
      .addCase(getProductInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.specificProductInfo = action.payload?.data?.data;
        state.appId = action.payload.data?.id;
      })
      .addCase(getProductInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action?.payload?.errors[0]?.message;
        NotificationManager.error(action?.payload?.errors[0]?.message);
      })
      .addCase(editProductInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = '';
      })
      .addCase(editProductInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.specificProductInfo = action.payload?.data?.data;
        state.appId = action.payload?.data?.id;
        NotificationManager.success(action?.payload.message);
      })
      .addCase(editProductInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action?.payload?.errors[0]?.message;
        NotificationManager.error(action?.payload?.errors[0]?.message);
      });
  },
});

export default savingsProductSlice.reducer;
export const { refreshState } = savingsProductSlice.actions;
