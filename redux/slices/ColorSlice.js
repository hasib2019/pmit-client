import { createSlice } from '@reduxjs/toolkit';

export const ColorSlice = createSlice({
  name: 'color',
  initialState: {
    colorBucket: '#297f87',
  },

  reducers: {
    colorChange: (state, action) => {
      // ("Color Action", action.payload)
      state.colorBucket = action.payload;
    },
  },
});

export const { colorChange } = ColorSlice.actions;
export default ColorSlice.reducer;
