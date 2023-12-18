import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { indigo } from '@mui/material/colors';

const NewApplication = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textPrimary" variant="h5">
            নতুন আবেদন
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: indigo[600],
              height: 56,
              width: 56,
            }}
          >
            {' '}
            30
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default NewApplication;
