import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { Grid, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
// import { NotificationManager } from "react-notifications";
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  containerMain: {
    display: 'flex',
    marginTop: '10px',
  },
  paperStyle: {
    // padding: '20px',
    textAlign: 'center',
  },
  fullView: {
    display: 'flex',
    justifyContent: 'center',
  },

  fieldStyle: {
    marginBottom: '22px',
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    marginTop: '15px',
  },

  noticeStyle: {
    background: '#fff',
    color: '#fff',
    minHeight: '50px',
    minWidth: '10px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '0px 10px 0px 10px',
    border: '1px solid #297F87',
  },

  contentStyle: {
    marginLeft: '20px',
    color: '#082032',
  },

  iconStyle: {
    marginLeft: '10px',
    backgroundColor: 'green',
    color: 'fff',
  },
});

function NotifyPage() {
  const style = useStyles();

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.replace('http://rdcd.gov.bd/');
  };

  return (
    <div className={style.containerMain}>
      <Grid container spacing={2.5}>
        <Grid sx={{ mx: 'auto', my: 'auto' }} item xs={12} sm={10} md={6}>
          <Paper elevation={3} className={style.paperStyle}>
            <Paper elevation={3} sx={{ backgroundColor: '#297F87' }}>
              <p
                className=""
                style={{
                  color: '#fff',
                  fontSize: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <NotificationsActiveOutlinedIcon sx={{ marginRight: '10px', fontSize: '30px' }} /> Approval Needed
              </p>
            </Paper>

            <Paper className={style.noticeStyle}>
              <CheckBoxOutlinedIcon className={style.iconStyle} />

              <h3 className={style.contentStyle}>Reason 1</h3>
            </Paper>

            <Paper className={style.noticeStyle}>
              <CheckBoxOutlinedIcon className={style.iconStyle} />

              <h3 className={style.contentStyle}>Reason 1</h3>
            </Paper>

            <Paper className={style.noticeStyle}>
              <CheckBoxOutlinedIcon className={style.iconStyle} />

              <h3 className={style.contentStyle}>Reason 1</h3>
            </Paper>

            <div className={style.btn}>
              <Button size="small" sx={{ backgroundColor: '#297F87' }} onClick={handleSubmit} variant="contained">
                OK
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default NotifyPage;
