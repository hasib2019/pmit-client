import React from 'react';
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

const CancelApplication = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textPrimary" variant="h5">
            বাতিল আবেদন
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: blue[600],
              height: 56,
              width: 56,
            }}
          >
            {' '}
            5
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default CancelApplication;
