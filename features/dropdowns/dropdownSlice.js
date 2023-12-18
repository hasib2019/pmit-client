import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { build } from 'joi';
import { getOfficeName, getProjects } from './dropdownApi';
import { NotificationManager } from 'react-notifications';
const initialState = {
  officeIsLoading: false,
  officeIseError: false,

  officeNames: [],
  projects: [],
};

export const fetchOfficeNames = createAsyncThunk('dropdowns/fetchOfficeNames', async ({}, { rejectWithValue }) => {
  try {
    const response = await getOfficeName();
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});
export const fetchProjects = createAsyncThunk('dropdowns/fetchProjects', async ({}, { rejectWithValue }) => {
  ('IaminprojectThunk');
  try {
    const response = await getProjects();
    return response;
  } catch (error) {
    if (!error.response) {
      'projectThunkError', error;
      throw error;
    }

    return rejectWithValue(error?.response?.data?.errors[0]?.message);
  }
});

const dropDownSlice = createSlice({
  name: 'dropdown',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfficeNames.fulfilled, (state, action) => {
        state.officeNames = action.payload;
      })
      .addCase(fetchOfficeNames.rejected, (state, action) => {
        NotificationManager.error(action.payload ? action.payload : action.error.message, '', 5000);
        // state.officeErrorMessage = action.payload;
        //   ? action.payload
        //   : action.error.message;
        state.officeIseError = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        ('successfulllllll66');
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        // state.officeErrorMessage = action.payload
        //   ? action.payload
        //   : action.error.message;
        ('projprojError');
        NotificationManager.error(action.payload ? action.payload : action.error.message, '', 5000);
        state.officeIseError = true;
      });
  },
});
export default dropDownSlice.reducer;
