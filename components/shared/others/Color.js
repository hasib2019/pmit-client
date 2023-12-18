import { Grid, Paper } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { colorChange } from '../../../redux/slices/ColorSlice';

const Color = ({ color }) => {
  const dispatch = useDispatch();
  const onColorChanging = (val) => {
    dispatch(colorChange(val));
  };
  return (
    <>
      <Grid item xs={1} sm={1} md={1} sx={{ width: '30px', height: '30px', margin: '10px' }}>
        <Paper
          onClick={() => onColorChanging(color)}
          sx={{
            width: '30px',
            height: '30px',
            border: `1px solid ${color}`,
            cursor: 'pointer',
            background: `${color}`,
          }}
        ></Paper>
      </Grid>
    </>
  );
};

export default Color;
