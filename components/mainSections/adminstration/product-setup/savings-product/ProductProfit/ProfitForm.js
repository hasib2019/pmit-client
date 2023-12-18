import { FormHelperText, Grid, TextField } from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import star from 'components/utils/coop/star';
import { FieldArray, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { bangToEng, engToBang, myValidate } from '../validator';
let limitObj = {
  lowLimit: '',
  highLimit: '',
  profitRate: '',
  duration: '',
};
const ProfitForm = ({ savings }) => {
  const { specificProductInfo } = useSelector((state) => state.savingsProduct);
  const productName = specificProductInfo?.productMaster?.productName || '';
  const { values, setFieldValue, handleBlur, touched, errors, setFieldTouched } =
    useFormikContext();
  const { productProfitArray } = values;

  console.log('errors---', errors);

  // const [limit,setLimit]=useState(limitObj);
  const ownHandleChange = (e, index, name) => {
    let { value, id } = e.target;
    const productprofitArrayCopy = [...productProfitArray];

    const token = 'number';

    if (id.toLowerCase().includes(token)) {
      let resultObj;
      value = bangToEng(value);
      if (id == 'number') {
        resultObj = myValidate('chargeNumber', value);
        if (resultObj?.status) {
          return;
        }
        limitObj = {
          ...limitObj,
          [name]: resultObj?.value,
        };
      } else if (id == 'numberWithPercent') {
        resultObj = myValidate('percentage', value.replace(/।/g, '.').replace(/[^\d০-৯.]|\.(?=.*\.)|।(?=.*।)/g, ''));
        if (resultObj?.status) {
          return;
        }
        limitObj = {
          ...limitObj,
          [name]: resultObj?.value,
        };
      } else if (id == 'numberWithCharge') {
        if (value.length == 1 && value == 0) return;
        resultObj = myValidate('chargeNumber', value);
        if (resultObj?.status) {
          return;
        }
        limitObj = {
          ...limitObj,
          [name]: resultObj?.value,
        };
      }
      if (limitObj['lowLimit'] && limitObj['highLimit'] && limitObj['profitRate'] && limitObj['duration']) {
        let mainCharge = +limitObj['highLimit'] * +limitObj['duration'];
        let interestCharge = (mainCharge * +limitObj['profitRate']) / 100;
        productprofitArrayCopy[index]['maturityAmount'] = mainCharge + interestCharge;
      } else if (!limitObj['lowLimit'] && !limitObj['highLimit'] && !limitObj['profitRate'] && !limitObj['duration']) {
        productprofitArrayCopy[index]['maturityAmount'] = '';
      }
      productprofitArrayCopy[index][name] = resultObj?.value;

      setFieldValue('productProfitArray', productprofitArrayCopy);
      return;
    }

    productprofitArrayCopy[index][name] = value;
    setFieldValue('productProfitArray', productprofitArrayCopy);
  };
  const handleDateChange = (e, index) => {
    const productprofitArrayCopy = [...productProfitArray];
    productprofitArrayCopy[index]['effectDate'] = new Date(e);
    setFieldValue('productProfitArray', productprofitArrayCopy);
  };
  return (
    <>
      <FieldArray name="productProfitArray">
        {() =>
          productProfitArray.length > 0 &&
          productProfitArray.map((item, index) => {
            return (
              <Grid container spacing={2} className="section" key={index}>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="প্রোডাক্টের নাম"
                    id="productName"
                    name="productName"
                    disabled
                    value={productName}
                    variant="outlined"
                    size="small"
                  ></TextField>
                </Grid>

                <Grid item md={4} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} style={{ width: '100%' }}>
                    <DatePicker
                      label={star('কার্যকরী তারিখ')}
                      value={item?.effectDate}
                      required
                      onChange={(e) => handleDateChange(e, index)}
                      onBlur={() => {
                        setFieldTouched('effectDate', true);
                      }}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />
                  </LocalizationProvider>
                  <FormHelperText
                    error={Boolean(
                      touched.effectDate
                        ? errors?.productProfitArray && errors.productProfitArray[index]?.effectDate
                        : touched.productProfitArray &&
                        errors.productProfitArray &&
                        touched.productProfitArray[index]?.effectDate &&
                        errors.productProfitArray[index]?.effectDate,
                    )}
                  >
                    {touched.effectDate
                      ? errors?.productProfitArray && errors.productProfitArray[index]?.effectDate
                      : touched.productProfitArray &&
                      errors.productProfitArray &&
                      touched.productProfitArray[index]?.effectDate &&
                      errors.productProfitArray[index]?.effectDate}
                  </FormHelperText>
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label={star('কিস্তির পরিমাণ')}
                    name="insAmt"
                    id="numberWithCharge"
                    onChange={(e) => ownHandleChange(e, index, 'insAmt')}
                    value={engToBang(item?.insAmt)}
                    onBlur={handleBlur}
                    variant="outlined"
                    size="small"
                    error={Boolean(
                      touched.insAmt
                        ? errors?.productProfitArray && errors.productProfitArray[index]?.insAmt
                        : touched.productProfitArray &&
                        errors.productProfitArray &&
                        touched.productProfitArray[index]?.insAmt &&
                        errors.productProfitArray[index]?.insAmt,
                    )}
                    helperText={
                      touched.insAmt
                        ? errors?.productProfitArray && errors.productProfitArray[index]?.insAmt
                        : touched.productProfitArray &&
                        errors.productProfitArray &&
                        touched.productProfitArray[index]?.insAmt &&
                        errors.productProfitArray[index]?.insAmt
                    }
                  ></TextField>
                </Grid>

                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label={
                      specificProductInfo?.productMaster?.maturityAmtInstruction != 'F'
                        ? star('মুনাফার হার(%)')
                        : 'মুনাফার হার(%)'
                    }
                    name="profitRate"
                    id="numberWithPercent"
                    onChange={(e) => ownHandleChange(e, index, 'profitRate')}
                    value={engToBang(item?.profitRate)}
                    onBlur={handleBlur}
                    variant="outlined"
                    size="small"
                    error={Boolean(
                      touched.profitRate
                        ? errors?.productProfitArray && errors.productProfitArray[index]?.profitRate
                        : touched.productProfitArray &&
                        errors.productProfitArray &&
                        touched.productProfitArray[index]?.profitRate &&
                        errors.productProfitArray[index]?.profitRate,
                    )}
                    helperText={
                      touched.profitRate
                        ? errors?.productProfitArray && errors.productProfitArray[index]?.profitRate
                        : touched.productProfitArray &&
                        errors.productProfitArray &&
                        touched.productProfitArray[index]?.profitRate &&
                        errors.productProfitArray[index]?.profitRate
                    }
                  ></TextField>
                </Grid>
                {(savings == 'C' || savings == 'F') && (
                  <>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label={star('সময়কাল (মাসিক)')}
                        name="duration"
                        onChange={(e) => ownHandleChange(e, index, 'duration')}
                        onBlur={handleBlur}
                        id="number"
                        value={engToBang(item?.duration)}
                        variant="outlined"
                        size="small"
                        error={Boolean(
                          touched.duration
                            ? errors?.productProfitArray && errors.productProfitArray[index]?.duration
                            : touched.productProfitArray &&
                            errors.productProfitArray &&
                            touched.productProfitArray[index]?.duration &&
                            errors.productProfitArray[index]?.duration,
                        )}
                        helperText={
                          touched.duration
                            ? errors?.productProfitArray && errors.productProfitArray[index]?.duration
                            : touched.productProfitArray &&
                            errors.productProfitArray &&
                            touched.productProfitArray[index]?.duration &&
                            errors.productProfitArray[index]?.duration
                        }
                      ></TextField>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label={
                          specificProductInfo?.productMaster?.maturityAmtInstruction == 'F'
                            ? star('ম্যাচুরিটি পরিমাণ')
                            : 'ম্যাচুরিটি পরিমাণ'
                        }
                        name="maturityAmount"
                        id="number"
                        onChange={(e) => ownHandleChange(e, index, 'maturityAmount')}
                        value={engToBang(item?.maturityAmount)}
                        variant="outlined"
                        size="small"
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.maturityAmount
                            ? errors?.productProfitArray && errors.productProfitArray[index]?.maturityAmount
                            : touched.productProfitArray &&
                            errors.productProfitArray &&
                            touched.productProfitArray[index]?.maturityAmount &&
                            errors.productProfitArray[index]?.maturityAmount,
                        )}
                        helperText={
                          touched.maturityAmount
                            ? errors?.productProfitArray && errors.productProfitArray[index]?.maturityAmount
                            : touched.productProfitArray &&
                            errors.productProfitArray &&
                            touched.productProfitArray[index]?.maturityAmount &&
                            errors.productProfitArray[index]?.maturityAmount
                        }
                      ></TextField>
                    </Grid>
                  </>
                )}
              </Grid>
            );
          })
        }
      </FieldArray>
    </>
  );
};

export default ProfitForm;
