import AssignmentIcon from '@mui/icons-material/Assignment';
import { Avatar, Grid, Paper, Typography } from '@mui/material';
import Styles from './DocImage/Sanction.module.css';

const SubHeader = ({ children }) => {
  return (
    <>
      <Grid container sx={{ marginTop: '20px' }}>
        <Grid item sm={12} md={12} xs={12}>
          <Paper
            className={Styles.subHeader}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '2px 10px 2px 10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ marginRight: '5px', backgroundColor: '#F55C47' }}>
                <AssignmentIcon />
              </Avatar>

              <Typography variant="h6">{children}</Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default SubHeader;
