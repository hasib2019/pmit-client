
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, Paper, TextField } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { engToBang } from '../../../samity-managment/member-registration/validator';


const UpdateProductServiceCharge = ({
  productServiceCharge,
  prevProductServiceCharge,
  handleProductServiceCharge,
  handleToggle,
  handleDate,
  deleteProductServiceCharge,
}) => {
  // const [disableState,setDisableState]=useState(true);
  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  return (
    <>
      {productServiceCharge.map((v, i) => (
        <Paper
          sx={{
            padding: '30px 20px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginBottom: '10px',
          }}
          key={i}
        >
          <Grid container spacing={2.5} className="section">
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সার্ভিস চার্জের হার')}
                id="numberWithPercent"
                name="intRate"
                onChange={(e) => handleProductServiceCharge(e, i)}
                number
                disabled={prevProductServiceCharge.length > i}
                value={engToBang(v.intRate)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="বিলম্বিত সার্ভিস চার্জের হার"
                name="currentdueIntRate"
                id="numberWithPercent"
                onChange={(e) => handleProductServiceCharge(e, i)}
                number
                disabled={prevProductServiceCharge.length > i}
                value={engToBang(v.currentdueIntRate)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="মেয়াদউত্তীর্ণ সার্ভিস চার্জের হার"
                name="overdueIntRate"
                id="numberWithPercent"
                onChange={(e) => handleProductServiceCharge(e, i)}
                number
                disabled={prevProductServiceCharge.length > i}
                value={engToBang(v.overdueIntRate)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={star('কার্যকরের তারিখ')}
                  name="effectDate"
                  value={v.effectDate}
                  minDate={prevProductServiceCharge.length > i ? '' : new Date()}
                  disabled={prevProductServiceCharge.length > i}
                  onChange={(e) => handleDate(e, i)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid
              item
              md={4}
              xs={12}
              sx={{
                '& .MuiToggleButton-root.Mui-selected': {
                  color: '#357C3C',
                  backgroundColor: '#E7FBBE',
                },
              }}
            >
              <ToggleButton
                value="check"
                fullWidth
                selected={v.isActive}
                onChange={(e) => handleToggle(e, i)}
                sx={{ height: '40px' }}
              >
                {v.isActive ? (
                  <>
                    <CheckCircleIcon /> <h3>সক্রিয়</h3>
                  </>
                ) : (
                  <>
                    <HelpIcon />
                    <h3>সক্রিয়?</h3>
                  </>
                )}
              </ToggleButton>
            </Grid>
            {i >= prevProductServiceCharge.length && (
              <Grid item md={4} xs={12}>
                <Button variant="contained" className="buttonCancel" onClick={(e) => deleteProductServiceCharge(e, i)}>
                  বাতিল করুন
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
    </>
  );
};

export default UpdateProductServiceCharge;
