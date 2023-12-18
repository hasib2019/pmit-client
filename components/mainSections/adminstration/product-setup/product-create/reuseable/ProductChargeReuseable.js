
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, Paper, TextField, Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { chargeTypeListRoute, glListRoute } from '../../../../../../url/ApiList';
import { engToBang, myValidate } from '../../../../samity-managment/member-registration/validator';
import { getApi } from '../../utils/getApi';

const ProductChargeReuseable = (
  {
    idx,
    childData,
    forEdit,
    proName,
    onDeleteData,
    setAllChildData,
    tempComponent,
    setDataForEdit,
    setTempComponent,
  },
  ref,
) => {
  const [chargeTypeList, setChargeTypeList] = useState([]);
  const [glIncomeList, setGlIncomeList] = useState([]);
  const [productCharge, setProductCharge] = useState({
    startDate: new Date(),
    chargeName: '',
    chargeAmount: 0,
    chargeCreditgl: 0,
    chargeActive: false,
  });

  const [formError, setFormError] = useState({
    chargeAmountError: '',
  });

  useEffect(() => {
    childData(productCharge, idx);
  }, [productCharge]);

  useEffect(() => {
    getChargeList();
    getGlIncomeList();
  }, []);

  const getGlIncomeList = async () => {
    let getIncomeList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
    setGlIncomeList(getIncomeList?.data?.data ? getIncomeList?.data?.data : []);
  };
  useImperativeHandle(ref, () => ({
    updateProChargeState: updateProChargeState,
  }));
  const updateProChargeState = () => {
    setProductCharge({
      startDate: new Date(),
      chargeName: '',
      chargeAmount: 0,
      chargeCreditgl: 0,
      chargeActive: false,
    });
    setAllChildData([]);
    setTempComponent([]);
    setDataForEdit([]);
  };

  const getChargeList = async () => {
    let res = await getApi(chargeTypeListRoute, 'get');
    setChargeTypeList(res?.data?.data?.length >= 1 ? res.data.data : []);
  };

  useEffect(() => {
    setProductCharge({
      ...productCharge,
      startDate: forEdit[0] ? forEdit[0].startDate : new Date(),
      chargeName: forEdit[0] ? forEdit[0].chargeName : '',
      chargeAmount: forEdit[0] ? engToBang(forEdit[0].chargeAmount) : '',
      chargeCreditgl: forEdit[0] ? forEdit[0].chargeCreditgl : '',
      chargeActive: forEdit[0] ? forEdit[0].chargeActive : false,
    });
  }, [forEdit[0]]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj;
    if (name == 'chargeAmount') {
      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }

      setProductCharge({
        ...productCharge,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }
    setProductCharge({
      ...productCharge,
      [name]: value,
    });
  };

  const handleDateChangeEx = (e) => {
    setProductCharge({ ...productCharge, startDate: new Date(e) });
  };

  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  const { startDate, chargeName, chargeAmount, chargeCreditgl, chargeActive } = productCharge;
  return (
    <>
      <Paper
        sx={{
          p: '20px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          mb: '20px',
        }}
      >
        <Grid container spacing={2.5} className="section">
          {tempComponent && tempComponent.length > 1 && (
            <Grid item md={12} xs={12} sx={{ textAlign: 'right' }}>
              <Tooltip title="সার্ভিস চার্জ বাদ দিন">
                <Button variant="contained" color="error" onClick={onDeleteData} size="small">
                  <ClearIcon />
                </Button>
              </Tooltip>
            </Grid>
          )}

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              disabled
              id="standard-disabled"
              label={star('প্রোডাক্টের নাম')}
              defaultValue={proName}
              variant="standard"
              size="small"
            />
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('চার্জের নাম')}
              name="chargeName"
              select
              SelectProps={{ native: true }}
              value={chargeName ? chargeName : ' '}
              onChange={handleChange}
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
              id="number"
              label={star('চার্জের পরিমাণ')}
              name="chargeAmount"
              onChange={handleChange}
              number
              value={chargeAmount}
              variant="outlined"
              size="small"
            ></TextField>
            {!productCharge.chargeAmount ? (
              <span style={{ color: '#FFCC00' }}>{formError.chargeAmountError}</span>
            ) : productCharge.chargeAmount.length > 0 ? (
              <span style={{ color: '#FFCC00' }}>{formError.chargeAmountError}</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('চার্জ ক্রেডিট জি.এল.')}
              name="chargeCreditgl"
              select
              SelectProps={{ native: true }}
              value={chargeCreditgl ? chargeCreditgl : ' '}
              onChange={handleChange}
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
                label={star('কার্যকর তারিখ')}
                name="startDate"
                value={startDate}
                disabled=""
                onChange={(e) => handleDateChangeEx(e)}
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
              selected={chargeActive}
              onChange={() => {
                setProductCharge({
                  ...productCharge,
                  chargeActive: !chargeActive,
                });
              }}
              sx={{ height: '40px' }}
            >
              {chargeActive ? (
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
        </Grid>
      </Paper>
    </>
  );
};
const ProductCharge = forwardRef(ProductChargeReuseable);
export default ProductCharge;
