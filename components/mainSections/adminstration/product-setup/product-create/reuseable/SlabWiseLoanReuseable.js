
import ClearIcon from '@mui/icons-material/Clear';
import { Button, Grid, Paper, TextField, Tooltip } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { bangToEng, engToBang, myValidate } from '../../../../samity-managment/member-registration/validator';

const SlabWiseLoanReuseable = (
  {
    idx,
    childData,
    forEdit,
    proName,
    onDeleteData,
    tempComponent,
    setTempComponent,
    setAllChildData,
    setDataForEdit,
  },
  ref,
) => {
  const [slabWiseLoan, setSlabWiseLoan] = useState({
    loanNumber: '',
    lowestAmount: '',
    highestAmount: '',
    pastLoanDifference: '',
    perOfSavings: 0,
    perOfShares: 0,
  });
  const [formError, setFormError] = useState({
    minLowestAmount: '',
    maxLowestAmount: '',
  });

  useEffect(() => {
    childData(slabWiseLoan, idx);
  }, [slabWiseLoan]);

  useEffect(() => {
    setSlabWiseLoan({
      ...slabWiseLoan,
      loanNumber: forEdit[0] ? forEdit[0].loanNumber : '',
      lowestAmount: forEdit[0] ? engToBang(forEdit[0].lowestAmount) : '',
      highestAmount: forEdit[0] ? engToBang(forEdit[0].highestAmount) : '',
      pastLoanDifference: forEdit[0] ? engToBang(forEdit[0].pastLoanDifference) : '',
      perOfSavings: forEdit[0] ? engToBang(forEdit[0].perOfSavings) : '',
      perOfShares: forEdit[0] ? engToBang(forEdit[0].perOfShares) : '',
    });
  }, [forEdit[0]]);
  useImperativeHandle(ref, () => ({
    updateProState: updateProState,
  }));
  const updateProState = () => {
    setSlabWiseLoan({
      loanNumber: '',
      lowestAmount: '',
      highestAmount: '',
      pastLoanDifference: '',
      perOfSavings: 0,
      perOfShares: 0,
    });
    setAllChildData([]);
    setTempComponent([]);
    setDataForEdit([]);
  };
  const handleChange = (e) => {
    const { name, value, id } = e.target;
    let resultObj;
    if (id == 'numberWithPercent') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }
      setSlabWiseLoan({
        ...slabWiseLoan,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }

    if (id == 'chargeNumber') {
      if (value.length == 1 && value == 0) return;

      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }

      setSlabWiseLoan({
        ...slabWiseLoan,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });

      switch (name) {
        case 'highestAmount':
          if (slabWiseLoan.lowestAmount && Number(bangToEng(slabWiseLoan.lowestAmount)) > Number(bangToEng(value))) {
            setTimeout(() => {
              setFormError({
                ...formError,
                maxLowestAmount: 'ঋণের সর্বোচ্চ পরিমাণ ঋণের সর্বনিম্ন পরিমাণ অপেক্ষা ছোট হতে পারবে না',
              });
            }, 1);
          } else if (
            slabWiseLoan.lowestAmount &&
            Number(bangToEng(slabWiseLoan.lowestAmount)) < Number(bangToEng(value))
          ) {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLowestAmount: '',
                maxLowestAmount: '',
              });
            }, 1);
          } else {
            setTimeout(() => {
              setFormError({
                ...formError,
                maxLowestAmount: '',
              });
            }, 1);
          }
          break;
        case 'lowestAmount':
          if (slabWiseLoan.highestAmount && Number(bangToEng(slabWiseLoan.highestAmount)) < Number(bangToEng(value))) {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLowestAmount: 'ঋণের সর্বনিম্ন পরিমাণ ঋণের সদস্য সর্বোচ্চ পরিমাণ অপেক্ষা বড় হতে পারবে না',
              });
            }, 1);
          } else if (
            slabWiseLoan.highestAmount &&
            Number(bangToEng(slabWiseLoan.highestAmount)) > Number(bangToEng(e.target.value))
          ) {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLowestAmount: '',
                maxLowestAmount: '',
              });
            }, 1);
          } else {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLowestAmount: '',
              });
            }, 1);
          }
          break;
      }
      return;
    }
    setSlabWiseLoan({
      ...slabWiseLoan,
      [name]: value,
    });
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
      <Paper
        sx={{
          p: '20px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          mb: '20px',
        }}
      >
        {' '}
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
              fullWidth
              label={star('ঋণ নম্বর')}
              name="loanNumber"
              select
              SelectProps={{ native: true }}
              value={slabWiseLoan.loanNumber ? slabWiseLoan.loanNumber : ' '}
              onChange={handleChange}
              disabled=""
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {[
                { value: '1', label: 'ঋণ - ০১' },
                { value: '2', label: 'ঋণ - ০২' },
                { value: '3', label: 'ঋণ - ০৩' },
                { value: '4', label: 'ঋণ - ০৪' },
              ].map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="chargeNumber"
              label={star('সর্বনিম্ন টাকার পরিমাণ')}
              name="lowestAmount"
              onChange={handleChange}
              value={slabWiseLoan.lowestAmount}
              variant="outlined"
              size="small"
            ></TextField>
            {!slabWiseLoan.lowestAmount ? (
              <span style={{ color: '#FFCC00' }}>{formError.minLowestAmount}</span>
            ) : slabWiseLoan.lowestAmount.length > 0 ? (
              <span style={{ color: '#FFCC00' }}>{formError.minLowestAmount}</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="chargeNumber"
              label={star('সর্বোচ্চ টাকার পরিমাণ')}
              name="highestAmount"
              onChange={handleChange}
              number
              value={slabWiseLoan.highestAmount}
              variant="outlined"
              size="small"
            ></TextField>
            {!slabWiseLoan.highestAmount ? (
              <span style={{ color: '#FFCC00' }}>{formError.maxLowestAmount}</span>
            ) : slabWiseLoan.highestAmount.length > 0 ? (
              <span style={{ color: '#FFCC00' }}>{formError.maxLowestAmount}</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="chargeNumber"
              label="পূর্বের দফার ব্যবধান (দিন)"
              name="pastLoanDifference"
              onChange={handleChange}
              number
              value={slabWiseLoan.pastLoanDifference}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="numberWithPercent"
              label="সঞ্চয়ের শতকরা হার(%)"
              name="perOfSavings"
              onChange={handleChange}
              number
              value={slabWiseLoan.perOfSavings}
              variant="outlined"
              size="small"
            ></TextField>
            {<span style={{ color: '#FFCC00' }}>{formError.perOfSavings}</span>}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="numberWithPercent"
              label="শেয়ারের শতকরা হার(%)"
              name="perOfShares"
              onChange={handleChange}
              number
              value={slabWiseLoan.perOfShares}
              variant="outlined"
              size="small"
            ></TextField>
            {<span style={{ color: '#FFCC00' }}>{formError.perOfShares}</span>}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
const SlabWiseLoan = forwardRef(SlabWiseLoanReuseable);
export default SlabWiseLoan;
