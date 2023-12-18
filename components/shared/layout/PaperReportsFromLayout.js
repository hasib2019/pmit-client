
import { AppBar, Grid, Paper, Toolbar, Typography } from '@mui/material';

import { useState } from 'react';

const PaperReportsFromLayout = (props) => {
  // const router = useRouter();
  const [displayOption] = useState('');
  // const onLinkBack = async (e) => {
  //   window.close();
  // };

  // const print = () => {
  //   setDisplayOption('none');
  //   window.print();
  //   setDisplayOption('');
  // };

  return (
    <>
      <Paper
        sx={{ display: 'flex', flexWrap: 'wrap' }}
        // elevation={3}
        // square
        style={{ marginTop: '1%' }}
      >
        <AppBar
          position="static"
          elevation={1}
          sx={{
            backgroundColor: '#F8FCFA',
            display: displayOption,
          }}
        >
          <Toolbar variant="dense">
            <Grid container>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Typography variant="h6" gutterBottom component="div" sx={{ color: '#000000' }}>
                  {' '}
                  {props.getValue}{' '}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {props.children}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default PaperReportsFromLayout;
