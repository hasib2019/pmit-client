import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, Paper, TextField } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';
import { chargeTypeListRoute, glListRoute } from '../../../../../url/ApiList';
import { engToBang } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';
const UpdateProductCharge = ({
  productChargeData,
  handleProductCharge,
  handleToggle,
  handleDate,
  prevProductChargeData,
  deleteProductChargeData,
}) => {
  const [chargeTypeList, setChargeTypeList] = useState([]);
  const [glIncomeList, setGlIncomeList] = useState([]);

  useEffect(() => {
    getChargeList();
    getGlIncomeList();
  }, []);

  const getGlIncomeList = async () => {
    let getIncomeList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
    setGlIncomeList(getIncomeList?.data?.data ? getIncomeList?.data?.data : []);
  };
  const getChargeList = async () => {
    let res = await getApi(chargeTypeListRoute, 'get');
    setChargeTypeList(res?.data?.data?.length >= 1 ? res.data.data : []);
  };



  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  return (
    <>
      {productChargeData.map((v, i) => (
        <Paper
          sx={{
            padding: '30px 20px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginBottom: '10px',
          }}
          key={i}
        >
          <Grid container spacing={2.5}>
            <Grid item md={4} xs={12}>
              <TextField
                id="projectName"
                fullWidth
                label={star('চার্জের নাম')}
                name="chargeTypeId"
                select
                SelectProps={{ native: true }}
                value={v.chargeTypeId || ' '}
                onChange={(e) => handleProductCharge(e, i)}
                disabled=""
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {chargeTypeList.map((option, idx) => (
                  <option key={idx} value={option.id}>
                    {option.chargeTypeDesc}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('চার্জের পরিমাণ')}
                name="chargeValue"
                onChange={(e) => handleProductCharge(e, i)}
                number
                id="chargeAmount"
                value={engToBang(v.chargeValue)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                // id="projectName"
                fullWidth
                label={star('চার্জ ক্রেডিট জি.এল.')}
                name="chargeGl"
                select
                SelectProps={{ native: true }}
                value={v.chargeGl || ' '}
                onChange={(e) => handleProductCharge(e, i)}
                disabled=""
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {glIncomeList.map((option, idx) => (
                  <option key={idx} value={option.id}>
                    {option.glacName}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={star('কার্যকরের তারিখ')}
                  name="effecDate"
                  value={v.effectDate}
                  disabled=""
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
                sx={{ height: '40px' }}
                selected={v.isActive}
                onChange={(e) => handleToggle(e, i)}
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
            {i >= prevProductChargeData.length && (
              <Grid item md={4} xs={12}>
                <Button variant="contained" className="buttonCancel" onClick={(e) => deleteProductChargeData(e, i)}>
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

export default UpdateProductCharge;
