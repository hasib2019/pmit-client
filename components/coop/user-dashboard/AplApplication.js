import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';

const AplApplication = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textPrimary" variant="h5">
            আপীল আবেদন
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: purple[600],
              height: 56,
              width: 56,
            }}
          >
            {' '}
            10
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default AplApplication;
