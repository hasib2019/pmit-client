import { createSlice } from '@reduxjs/toolkit';

export const PaginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    pageNo: 1,
  },

  reducers: {
    incrementPage: (state) => {
      state.pageNo += 1;
    },

    decrementPage: (state) => {
      state.pageNo -= 1;
    },

    goPageNo: (state, action) => {
      state.pageNo = action.payload;
    },

    decrementByPageNo: (state, action) => {
      state.pageNo -= action.payload;
    },
  },
});

export const { incrementPage, decrementPage, goPageNo, decrementByPageNo } = PaginationSlice.actions;
export default PaginationSlice.reducer;
