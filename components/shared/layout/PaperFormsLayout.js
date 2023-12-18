// ****************************************** Developed By Saifur ********************************************
// ****************************************** Modified By Hasibuzzaman ***************************************


import { AppBar, Grid, Paper, Toolbar, Typography } from '@mui/material';

const PaperFormsLayout = (props) => {
  // const router = useRouter();
  // const cancelPage = () => {
  //   router.back();
  // };
  // const pageRefresh = () => {
  //   window.location.reload(false);
  // };

  return (
    <Paper sx={{ display: 'flex', flexWrap: 'wrap', borderRadius: '.5rem' }}>
      <AppBar
        position="relative"
        sx={{
          background: 'var(--color-bg-pageHeader)',
          borderRadius: '.5rem .5rem 0 0',
          boxShadow: 'unset',
        }}
      >
        <Toolbar variant="dense">
          <Grid container>
            <Grid item xs={6}>
              <Typography
                sx={{ color: 'var(--color-heading)', fontSize: '16px', fontWeight: '700', marginTop: '.25rem' }}
              >
                {props.getValue}
              </Typography>
            </Grid>
            {/* <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Tooltip title="তথ্য রিফ্রেশ করুন">
                  <Button
                    className="btn-hover"
                    sx={{ mr: 0.5, backgroundColor: 'var(--color-bg-variant)', color: 'rgba(0,0,0,0.5)' }}
                    size="small"
                    onClick={pageRefresh}
                  >
                    <BrushIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="পিছনে যান">
                  <Button
                    className="btn-hover"
                    sx={{ backgroundColor: 'var(--color-bg-variant)', color: 'rgba(0,0,0,0.5)' }}
                    size="small"
                    onClick={cancelPage}
                  >
                    <BackspaceIcon />
                  </Button>
                </Tooltip>
              </Grid> */}
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container padding={2} sx={{ minHeight: '450px' }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PaperFormsLayout;
