import { Button, Grid, Paper, TextField } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import ToggleButton from '@mui/material/ToggleButton';
import { engToBang } from '../../../samity-managment/member-registration/validator';
const loanArray = [
  { value: '1', label: 'ঋণ - ০১' },
  { value: '2', label: 'ঋণ - ০২' },
  { value: '3', label: 'ঋণ - ০৩' },
  { value: '4', label: 'ঋণ - ০৪' },
];
const UpdateSlabWiseLoan = ({
  slabWiseLoanData,
  handleSlabWiseLoanData,
  prevSlabWiseLoanData,
  deleteSlabWiseLoanData,
  handleToggle,
  slabWiseLoanArrayError,
}) => {
  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  return (
    <>
      {slabWiseLoanData?.map((v, i) => (
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
                label={star('ঋণ নম্বর')}
                name="loanNo"
                select
                SelectProps={{ native: true }}
                value={v.loanNo || ' '}
                onChange={(e) => handleSlabWiseLoanData(e, i)}
                disabled=""
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {loanArray.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সর্বনিম্ন টাকার পরিমাণ')}
                name="minAmount"
                number
                id="chargeNumber"
                value={engToBang(v.minAmount)}
                variant="outlined"
                onChange={(e) => handleSlabWiseLoanData(e, i)}
                size="small"
              ></TextField>
              {!slabWiseLoanData[i]?.minAmount ? (
                <span style={{ color: '#FFCC00' }}>{slabWiseLoanArrayError[i].minAmount}</span>
              ) : slabWiseLoanData[i]?.minAmount.length > 0 ? (
                <span style={{ color: '#FFCC00' }}>{slabWiseLoanArrayError[i]?.minAmount}</span>
              ) : (
                ''
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সর্বোচ্চ টাকার পরিমাণ')}
                name="maxAmount"
                onChange={(e) => handleSlabWiseLoanData(e, i)}
                number
                id="chargeNumber"
                value={engToBang(v.maxAmount)}
                variant="outlined"
                size="small"
              ></TextField>
              {!slabWiseLoanData[i].maxAmount ? (
                <span style={{ color: '#FFCC00' }}>{slabWiseLoanArrayError[i].maxAmount}</span>
              ) : slabWiseLoanData[i].maxAmount.length > 0 ? (
                <span style={{ color: '#FFCC00' }}>{slabWiseLoanArrayError[i].maxAmount}</span>
              ) : (
                ''
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="পূর্বের ঋণের ব্যবধান (দিন)"
                name="preDisbInterval"
                id="chargeNumber"
                onChange={(e) => handleSlabWiseLoanData(e, i)}
                number
                value={engToBang(v.preDisbInterval)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="সঞ্চয়ের শতকরা হার(%)"
                name="depositPercent"
                id="numberWithPercent"
                onChange={(e) => handleSlabWiseLoanData(e, i)}
                number
                value={engToBang(v.depositPercent)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="শেয়ারের শতকরা হার(%)"
                name="sharePercent"
                id="numberWithPercent"
                onChange={(e) => handleSlabWiseLoanData(e, i)}
                number
                value={engToBang(v.sharePercent)}
                variant="outlined"
                size="small"
              ></TextField>
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
            {i >= prevSlabWiseLoanData.length && (
              <Grid item md={4} xs={12}>
                <Button variant="contained" className="buttonCancel" onClick={(e) => deleteSlabWiseLoanData(e, i)}>
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

export default UpdateSlabWiseLoan;
