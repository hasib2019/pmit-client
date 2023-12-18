
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, TextField, Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { engToBang, myValidate } from '../../../../samity-managment/member-registration/validator';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const PscReuseable = (
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
  const [proServiceCharge, setProServiceCharge] = useState({
    serviceChargeRate: '',
    startDate: new Date(),
    lateServiceChargeRate: '',
    expireServiceChargeRate: '',
    activeToggle: true,
  });
  useImperativeHandle(ref, () => ({
    updateProState: updateProState,
  }));
  const updateProState = () => {
    setProServiceCharge({
      serviceChargeRate: '',
      startDate: new Date(),
      lateServiceChargeRate: '',
      expireServiceChargeRate: '',
      activeToggle: true,
    });
    setAllChildData([]);
    setTempComponent([]);
    setDataForEdit([]);
  };
  const [formError, setFormError] = useState({});
  useEffect(() => {
    childData(proServiceCharge, idx);
  }, [proServiceCharge]);

  useEffect(() => {
    setProServiceCharge({
      ...proServiceCharge,
      serviceChargeRate: forEdit[0] ? engToBang(forEdit[0].serviceChargeRate) : '',
      startDate: forEdit[0] ? forEdit[0].startDate : new Date(),
      lateServiceChargeRate: forEdit[0] ? engToBang(forEdit[0].lateServiceChargeRate) : '',
      expireServiceChargeRate: forEdit[0] ? engToBang(forEdit[0].expireServiceChargeRate) : '',
      activeToggle: forEdit[0] ? forEdit[0].activeToggle : true,
    });
  }, [forEdit[0]]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
  };
  const handleDateChangeEx = (e) => {
    setProServiceCharge({ ...proServiceCharge, startDate: formatDate(e) });
  };

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    let resultObj;
    if (id == 'numberWithPercent') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }

      setProServiceCharge({
        ...proServiceCharge,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }
    // if (id == 'numberWithPercent') {
    //   if (value.length == 1 && value == 0)
    //     return;

    //   if (value.length > 3) {
    //     setProServiceCharge({
    //       ...proServiceCharge,
    //       [name]: value.substring(0, 3),
    //     })
    //     setFormError({
    //       ...formError,
    //       [name]: "শতকরা হার ১০০ ও ৩ সংখ্যার বেশি হতে পারবে না"
    //     })
    //     return;
    //   }

    //   if (Number(value) > 100) {
    //     setFormError({
    //       ...formError,
    //       [name]: "শতকরা হার ১০০ ও ৩ সংখ্যার বেশি হতে পারবে না"
    //     })
    //     return;
    //   }
  };

  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  const { serviceChargeRate, startDate, lateServiceChargeRate, expireServiceChargeRate, activeToggle } =
    proServiceCharge;

  return (
    <>
      <Grid container spacing={2.5} className="section">
        {tempComponent.length > 1 && (
          <Grid item md={12} xs={12} sx={{ textAlign: 'right' }}>
            <Tooltip title="সার্ভিস চার্জ বাদ দিন">
              <Button variant="contained" className="btn-delete" onClick={() => onDeleteData(5)} size="small">
                {/* <ClearIcon />  */}
                সার্ভিস চার্জ বাদ দিন
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
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="numberWithPercent"
            label={star('সার্ভিস চার্জের হার(%)')}
            name="serviceChargeRate"
            onChange={handleChange}
            number
            value={serviceChargeRate}
            variant="outlined"
            size="small"
          ></TextField>
          {<span style={{ color: '#FFCC00' }}>{formError.serviceChargeRate}</span>}
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="numberWithPercent"
            label="বিলম্বিত সার্ভিস চার্জের হার(%)"
            name="lateServiceChargeRate"
            onChange={handleChange}
            number
            value={lateServiceChargeRate}
            variant="outlined"
            size="small"
          ></TextField>
          {<span style={{ color: '#FFCC00' }}>{formError.lateServiceChargeRate}</span>}
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="numberWithPercent"
            label="মেয়াদউত্তীর্ণ সার্ভিস চার্জের হার(%)"
            name="expireServiceChargeRate"
            onChange={handleChange}
            number
            value={expireServiceChargeRate}
            variant="outlined"
            size="small"
          ></TextField>
          {<span style={{ color: '#FFCC00' }}>{formError.expireServiceChargeRate}</span>}
        </Grid>
        <Grid item md={4} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={star('কার্যকরের তারিখ')}
              name="startDate"
              disablePast="true"
              value={startDate}
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
            selected={activeToggle}
            onChange={() => {
              setProServiceCharge({
                ...proServiceCharge,
                activeToggle: !activeToggle,
              });
            }}
            sx={{ height: '40px' }}
          >
            {activeToggle ? (
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
    </>
  );
};
const forwardComp = forwardRef(PscReuseable);
export default forwardComp;
