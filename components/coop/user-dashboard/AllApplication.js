import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { red } from '@mui/material/colors';

const AllApplication = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textPrimary" variant="h5">
            সফল আবেদন
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: red[600],
              height: 56,
              width: 56,
            }}
          >
            {' '}
            50
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default AllApplication;
