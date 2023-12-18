import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPendingApplications, approveVoucherPosting, rejectPendingApplication } from './voucherPostingApprovalApi';
import NotificationManager from 'react-notifications/lib/NotificationManager';
const initialState = {
  isLoading: false,
  isError: false,

  pendingApplications: [],
  officeNameBangla: '',
  projectNameBangla: '',
  transactionType: '',
  voucherMode: '',
  voucherType: '',
  transactionSets: {},
  isModalOpen: false,
};
export const fetchPendingApplications = createAsyncThunk(
  'voucherPostingApproval/fetchPendingApplications',
  async ({}, { rejectWithValue }) => {
    try {
      const pendingApplications = await getPendingApplications();
      return pendingApplications;
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

export const approveVoucherPostingApplication = createAsyncThunk(
  'voucherPostingApproval/approveVoucherPostingApplication',
  async (data, { rejectWithValue }) => {
    try {
      const approveApplication = await approveVoucherPosting(data);
      return approveApplication;
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
export const rejectPendingVoucherPostingApplication = createAsyncThunk(
  'voucherPostingApproval/rejectVoucherPostingApplication',
  async (id, { rejectWithValue }) => {
    try {
      const rejectApplication = await rejectPendingApplication(id);
      return rejectApplication;
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

const pendingVoucherPostingApplicationSlice = createSlice({
  name: 'voucherPostingApproval',
  initialState,
  reducers: {
    onSetOfficeNameBangla: (state, action) => {
      state.officeNameBangla = action.payload;
    },
    onSetProjectNameBangla: (state, action) => {
      state.projectNameBangla = action.payload;
    },
    onSetTransactionType: (state, action) => {
      state.transactionType = action.payload;
    },
    onSetVoucherMode: (state, action) => {
      state.voucherMode = action.payload;
    },
    onSetVoucherType: (state, action) => {
      state.voucherType = action.payload;
    },
    onSetTransactionSets: (state, action) => {
      state.transactionSets = action.payload;
    },
    onModalOpenClose: (state, action) => {
      state.isModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        'dfdfsdaglsdklgdlg', action.payload;
        state.pendingApplications = action.payload?.data;
      })
      .addCase(fetchPendingApplications.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;

        state.pendingApplications = [];
        NotificationManager.error(action.payload ? action.payload : action.error.message);
      })
      .addCase(approveVoucherPostingApplication.fulfilled, (state, action) => {
        state.isLoading = false;

        state.pendingApplications = state.pendingApplications.filter(
          (application) => application.id !== state.transactionSets.id,
        );
        if (action.payload?.data?.length > 0) {
          NotificationManager.success(action.payload?.message);
        }
      })
      .addCase(approveVoucherPostingApplication.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;

        NotificationManager.error(action.payload ? action.payload : action.error.message);
      })
      .addCase(approveVoucherPostingApplication.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(rejectPendingVoucherPostingApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingApplications = state.pendingApplications.filter(
          (application) => application.id !== state.transactionSets.id,
        );
        NotificationManager.success(action.payload?.message);
      })
      .addCase(rejectPendingVoucherPostingApplication.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;

        NotificationManager.error(action.payload ? action.payload : action.error.message);
      })
      .addCase(rejectPendingVoucherPostingApplication.pending, (state, action) => {
        state.isLoading = true;
      });
  },
});

export default pendingVoucherPostingApplicationSlice.reducer;
export const {
  onSetOfficeNameBangla,
  onSetProjectNameBangla,
  onSetTransactionType,
  onSetVoucherMode,
  onSetVoucherType,
  onSetTransactionSets,
  onModalOpenClose,
} = pendingVoucherPostingApplicationSlice.actions;
