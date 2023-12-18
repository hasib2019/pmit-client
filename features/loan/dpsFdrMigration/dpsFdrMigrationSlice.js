import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';
import axios from 'service/AxiosInstance';
import { dpsFdrMigrationMemberCheckUrl } from '../../../url/ApiList';
import { fetchProductByProject, fetchProject, fetchSamityByProject } from './dpsFdrMigrationApi';

const initialState = {
  projects: [],
  products: [],
  districtOffices: [],
  upazilaOffices: [],
  samityList: [],
  isLoading: false,
  isError: false,
  isAllMemberExistInTheSamity: false,
};

export const checkIfMemberExistInTheMemory = createAsyncThunk(
  'loan/migration/dps-fdr/checkIfMemberExistInTheSamity',
  async (obj, { rejectWithValue }) => {
    try {
      const response = await axios.post(dpsFdrMigrationMemberCheckUrl + '/member-exist-check', obj);
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);

// eslint-disable-next-line no-unused-vars
export const getProjects = createAsyncThunk('loan/migration/dps-fdr/get-projects', async (_, { rejectWithValue }) => {
  try {
    const result = await fetchProject();
    return result;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error?.response?.data?.errors[0].message);
  }
});
export const getSamityByProject = createAsyncThunk(
  'loan/migration/dps-fdr/get-samity',
  async (projectObj, { rejectWithValue }) => {
    try {
      const result = await fetchSamityByProject(projectObj?.projectId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
export const getProductByProject = createAsyncThunk(
  'loan/migration/dps-fdr/get-product',
  async (projectObj, { rejectWithValue }) => {
    try {
      const result = await fetchProductByProject(projectObj?.projectId);
      return result;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data?.errors[0].message);
    }
  },
);
const dpsFdrMigrationSlice = createSlice({
  name: 'loan/migration/dps-fdr',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.projects = action?.payload?.data;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getSamityByProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getSamityByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.samityList = action?.payload?.data;
      })
      .addCase(getSamityByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(getProductByProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProductByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const depositProducts = action?.payload?.data?.filter(
          (product) => product?.depositNature === 'F' || product?.depositNature === 'C',
        );
        state.products = depositProducts;
      })
      .addCase(getProductByProject.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      })
      .addCase(checkIfMemberExistInTheMemory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(checkIfMemberExistInTheMemory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isAllMemberExistInTheSamity = action?.payload;
      })
      .addCase(checkIfMemberExistInTheMemory.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        NotificationManager.error(action?.payload ? action?.payload : action?.error?.message);
      });
  },
});
export default dpsFdrMigrationSlice.reducer;
// cosnt getDistrictOffices
