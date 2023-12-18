import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { localStorageData, tokenData } from 'service/common';
import { getBranchName, getDesignationName, getDesignationNameNew, getOfficeNames, getServiceName } from './approvalOfficeSelectionApi';

const initialState = {
  originUnitId: '',
  officeId: 0,
  designationId: 0,
  officerId: '',
  serviceActionId: '',
  applicationName: '',
  defaultValue: '',
  ownOrOthers: 'own',
  serviceNames: [],
  officeNames: [],
  designationNames: [],
  branchNames: [],
  isSeviceNamesLoading: false,
  isServiceNamesError: false,
  serviceNamesErrorMessage: '',
  isOfficeNamesLoading: false,
  isOfficeNamesError: false,
  officeNamesErrorMessage: '',
  isDesignationsLoading: false,
  isDesignationsError: false,
  designationErrorMessage: '',
  isBranchNamesLoading: false,
  isBranchNamesError: false,
  branchNamesErrorMessage: '',
};

export const fetchServiceNames = createAsyncThunk('approvalOfficeSelection/fetchServiceNames', async ({ id }) => {
  const response = await getServiceName(id);
  return response;
});
export const fetchOfficeNames = createAsyncThunk(
  'approvalOfficeSelection/fetchOfficeNames',
  async ({ ownOrOthers }) => {
    const response = await getOfficeNames(ownOrOthers);
    return response;
  },
);
export const fetchDesignationNames = createAsyncThunk(
  'approvalOfficeSelection/fetchDesignationNames',
  async ({ branchId }) => {
    const token = localStorageData('token');
    const userData = tokenData(token);
    const response = await getDesignationName(branchId);
    const newData = response.filter((row) => row?.designationId != userData?.designationId);
    return newData;
  },
);
export const fetchBranchNames = createAsyncThunk(
  'approvalOfficeSelection/fetchBranchNames',
  async ({ value, ownAndOthers }) => {
    const response = await getBranchName(value, ownAndOthers);
    return response;
  },
);

export const fetchDesignationNameNew = createAsyncThunk('getDesignationNameNew', async ({ approvalInfo }) => {
  const response = await getDesignationNameNew(approvalInfo);
  return response;
});

export const apporvalOfficeSelectSlice = createSlice({
  name: 'approvalOfficeSelection',
  initialState,
  reducers: {
    originUnitSelected: (state, action) => {
      state.originUnitId = action.payload;
    },
    officeSelected: (state, action) => {
      state.officeId = action.payload;
    },
    officerIdSelected: (state, action) => {
      state.officerId = action.payload;
    },
    serviceSelected: (state, action) => {
      state.serviceActionId = action.payload;
    },
    servicActionIdSelected: (state, action) => {
      state.serviceActionId = action.payload;
    },
    designationSelected: (state, action) => {
      state.designationId = action.payload;
    },
    applicationNameSelected: (state, action) => {
      state.applicationName = action.payload;
    },
    defaultValueSelected: (state, action) => {
      state.defaultValue = action.payload;
    },
    ownAndOthersSelected: (state, action) => {
      state.ownOrOthers = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceNames.fulfilled, (state, action) => {
        state.serviceNames = action.payload;
        state.isServiceNamesError = false;
      })
      .addCase(fetchServiceNames.rejected, (state, action) => {
        state.serviceNames = [];
        state.isServiceNamesError = true;
        state.serviceNamesErrorMessage = action.error?.message;
      })
      .addCase(fetchOfficeNames.fulfilled, (state, action) => {
        state.officeNames = action.payload;
        state.isOfficeNamesError = false;
        if (state.ownOrOthers === 'own') {
          state.originUnitId = action.payload?.id;
        }
      })
      .addCase(fetchOfficeNames.rejected, (state, action) => {
        state.officeNames = [];
        state.isOfficeNamesError = true;
        state.officeNamesErrorMessage = action.error?.message;
      })
      .addCase(fetchDesignationNames.fulfilled, (state, action) => {
        state.designationNames = action.payload;
        state.isDesignationsError = false;
      })
      .addCase(fetchDesignationNames.rejected, (state, action) => {
        state.designationNames = [];
        state.isDesignationsError = true;
        state.designationErrorMessage = action.error?.message;
      })
      .addCase(fetchBranchNames.fulfilled, (state, action) => {
        state.branchNames = action.payload;
        state.isBranchNamesError = false;
        if (state.ownOrOthers === 'own') {
          state.officeId = action.payload[0].id;
        }
      })
      .addCase(fetchBranchNames.rejected, (state, action) => {
        state.branchNames = [];

        state.isBranchNamesError = true;
        state.branchNamesErrorMessage = action.error?.message;
      })
      .addCase(fetchDesignationNameNew.fulfilled, (state, action) => {
        state.designationNames = action.payload;
        state.isDesignationsError = false;
      })
      .addCase(fetchDesignationNameNew.rejected, (state, action) => {
        state.designationNames = [];
        state.isDesignationsError = true;
        state.designationErrorMessage = action.error?.message;
      });
  },
});

export default apporvalOfficeSelectSlice.reducer;
export const {
  originUnitSelected,
  officeSelected,
  serviceSelected,
  designationSelected,
  applicationNameSelected,
  defaultValueSelected,
  ownAndOthersSelected,
  officerIdSelected,
  servicActionIdSelected,
} = apporvalOfficeSelectSlice.actions;
