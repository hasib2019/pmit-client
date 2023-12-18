import { createSlice } from '@reduxjs/toolkit';

export const LevelSlice = createSlice({
  name: 'DesigLevel',
  initialState: {
    name: '',
    flow: [],
  },
  reducers: {
    AddLevel: (state) => {
      state.flow.push({
        designation: '',
        level: '',
      });
    },
    DeleteLevel: (state) => {
      state.flow.pop();
    },
    DesigUpdate: (state, action) => {
      const index = action.payload.index;
      state.flow[index][action.payload.name] = action.payload.value;
      state.flow[index].level = index + 1;
    },

    WorkflowNameSet: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
});

// Actions and Reducers===========

export const { AddLevel, DeleteLevel, DesigUpdate, WorkflowNameSet } = LevelSlice.actions;

export default LevelSlice.reducer;
