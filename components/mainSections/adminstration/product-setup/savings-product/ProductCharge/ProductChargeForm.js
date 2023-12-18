import ClearIcon from '@mui/icons-material/Clear';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import star from 'components/utils/coop/star';
import { FieldArray, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { chargeTypeListRoute, glListRoute } from '../../../../../../url/ApiList';
import { getApi } from '../../utils/getApi';
import { bangToEng, engToBang, myValidate } from '../validator';

const chargeTypeArray = [
  {
    value: 'F',
    display: 'ফিক্সড',
  },
  {
    value: 'P',
    display: 'শতকরা',
  },
];
const InstallmentSetupForm = () => {
  const [chargeTypeList, setChargeTypeList] = useState([]);
  const [glIncomeList, setGlIncomeList] = useState([]);

  const { specificProductInfo } = useSelector((state) => state.savingsProduct);
  const productName = specificProductInfo?.productMaster?.productName;
  const { values, setFieldValue, touched, errors, handleBlur } = useFormikContext();
  const { chargeName } = values;
  const { chargeArray } = values;
  const ownHandleChange = (e, index, name) => {
    let { value, id } = e.target;

    const chargeArrayCopy = [...chargeArray];
    if (name == 'chargeType') {
      chargeArrayCopy[index]['chargeAmount'] = '';
    }
    if (chargeArrayCopy[index]['chargeType'] && id == 'chargeAmount') {
      let resultObj;
      value = bangToEng(value);
      if (chargeArrayCopy[index]['chargeType'] == 'P') {
        resultObj = myValidate('percentage', value);
        if (resultObj?.status) {
          return;
        }
      } else if (chargeArrayCopy[index]['chargeType'] == 'F') {
        resultObj = myValidate('chargeNumber', value);
        if (resultObj?.status) {
          return;
        }
      }
      chargeArrayCopy[index][name] = resultObj?.value;

      setFieldValue('chargeArray', chargeArrayCopy);
      return;
    }
    if (name == 'chargeName' || name == 'chargeCreditgl') {
      const targetObj =
        name == 'chargeName'
          ? chargeTypeList.find((chargeType) => chargeType.id == value)
          : glIncomeList.find((glLincome) => glLincome.id == value);
      let description = name == 'chargeName' ? 'chargeTypeDesc' : 'glacName';
      chargeArrayCopy[index][description] = targetObj.chargeTypeDesc || targetObj.glacName;
    }
    chargeArrayCopy[index][name] = value;
    setFieldValue('chargeArray', chargeArrayCopy);
  };
  const getChargeList = async () => {
    let res = await getApi(chargeTypeListRoute, 'get');
    setChargeTypeList(res?.data?.data?.length >= 1 ? res.data.data : []);
  };
  const getGlIncomeList = async () => {
    let getIncomeList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
    setGlIncomeList(getIncomeList?.data?.data ? getIncomeList?.data?.data : []);
  };
  const handleDateChange = (e, index) => {
    const chargeArrayCopy = [...chargeArray];
    chargeArrayCopy[index]['effectDate'] = new Date(e);
    setFieldValue('chargeArray', chargeArrayCopy);
  };
  useEffect(() => {
    getChargeList();
    getGlIncomeList();
  }, []);
  return (
    <>
      <FieldArray name="chargeArray">
        {(arrayHelpers) =>
          chargeArray.length > 0 &&
          chargeArray.map((item, index) => {
            return (
              <Grid container spacing={2} className="section" key={index}>
                {chargeArray && chargeArray.length > 1 && (
                  <Grid item md={12} xs={12} sx={{ textAlign: 'right' }}>
                    <Tooltip title="প্রোডাক্ট চার্জ বাদ দিন">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}
                        size="small"
                      >
                        <ClearIcon />
                      </Button>
                    </Tooltip>
                  </Grid>
                )}
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
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      {chargeName == '' ? star('চার্জের নাম নির্বাচন করুন') : star('চার্জের নাম')}
                    </InputLabel>
                    <Select
                      name="chargeName"
                      id="demo-simple-select"
                      value={item?.chargeName}
                      label={chargeName == '' ? star('চার্জের নাম নির্বাচন করুন') : star('চার্জের নাম')}
                      onChange={(e) => ownHandleChange(e, index, 'chargeName')}
                      onBlur={handleBlur}
                      size="small"
                      sx={{
                        '& .MuiSelect-select': {
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {chargeTypeList.map((option) => (
                        <MenuItem value={option.id} key={option.id}>
                          {option.chargeTypeDesc}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText
                    error={Boolean(
                      touched.chargeName
                        ? errors?.chargeArray && errors.chargeArray[index]?.chargeName
                        : touched.chargeArray &&
                        errors.chargeArray &&
                        touched.chargeArray[index]?.chargeName &&
                        errors.chargeArray[index]?.chargeName,
                    )}
                  >
                    {touched.chargeName
                      ? errors?.chargeArray && errors.chargeArray[index]?.chargeName
                      : touched.chargeArray &&
                      errors.chargeArray &&
                      touched.chargeArray[index]?.chargeName &&
                      errors.chargeArray[index]?.chargeName}
                  </FormHelperText>
                </Grid>

                <Grid item md={4} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} style={{ width: '100%' }}>
                    <DatePicker
                      label={star('কার্যকরী তারিখ')}
                      value={item?.effectDate}
                      required
                      onBlur={handleBlur}
                      onChange={(e) => handleDateChange(e, index)}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />
                  </LocalizationProvider>
                  <FormHelperText
                    error={Boolean(
                      touched.effectDate
                        ? errors?.chargeArray && errors.chargeArray[index]?.effectDate
                        : touched.chargeArray &&
                        errors.chargeArray &&
                        touched.chargeArray[index]?.effectDate &&
                        errors.chargeArray[index]?.effectDate,
                    )}
                  >
                    {touched.effectDate
                      ? errors?.chargeArray && errors.chargeArray[index]?.effectDate
                      : touched.chargeArray &&
                      errors.chargeArray &&
                      touched.chargeArray[index]?.effectDate &&
                      errors.chargeArray[index]?.effectDate}
                  </FormHelperText>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      {item?.chargeType == '' ? star('চার্জের ধরণ নির্বাচন করুন') : star('চার্জের ধরণ')}
                    </InputLabel>
                    <Select
                      name="chargeType"
                      id="demo-simple-select"
                      value={item?.chargeType}
                      label={item?.chargeType == '' ? star('চার্জের ধরণ নির্বাচন করুন') : star('চার্জের ধরণ')}
                      onChange={(e) => ownHandleChange(e, index, 'chargeType')}
                      onBlur={handleBlur}
                      size="small"
                      sx={{
                        '& .MuiSelect-select': {
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {chargeTypeArray.map((option) => (
                        <MenuItem value={option.value} key={option.value}>
                          {option.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText
                    error={Boolean(
                      touched.chargeType
                        ? errors?.chargeArray && errors.chargeArray[index]?.chargeType
                        : touched.chargeArray &&
                        errors.chargeArray &&
                        touched.chargeArray[index]?.chargeType &&
                        errors.chargeArray[index]?.chargeType,
                    )}
                  >
                    {touched.chargeType
                      ? errors?.chargeArray && errors.chargeArray[index]?.chargeType
                      : touched.chargeArray &&
                      errors.chargeArray &&
                      touched.chargeArray[index]?.chargeType &&
                      errors.chargeArray[index]?.chargeType}
                  </FormHelperText>
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label={star('চার্জের পরিমাণ')}
                    id="chargeAmount"
                    name="chargeAmount"
                    onChange={(e) => ownHandleChange(e, index, 'chargeAmount')}
                    value={engToBang(item?.chargeAmount)}
                    onBlur={handleBlur}
                    variant="outlined"
                    size="small"
                    error={Boolean(
                      touched.chargeAmount
                        ? errors?.chargeArray && errors.chargeArray[index]?.chargeAmount
                        : touched.chargeArray &&
                        errors.chargeArray &&
                        touched.chargeArray[index]?.chargeAmount &&
                        errors.chargeArray[index]?.chargeAmount,
                    )}
                    helperText={
                      touched.chargeAmount
                        ? errors?.chargeArray && errors.chargeArray[index]?.chargeAmount
                        : touched.chargeArray &&
                        errors.chargeArray &&
                        touched.chargeArray[index]?.chargeAmount &&
                        errors.chargeArray[index]?.chargeAmount
                    }
                  ></TextField>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      {item?.chargeCreditgl == ''
                        ? star('চার্জ ক্রেডিট জি.এল নির্বাচন করুন')
                        : star('চার্জ ক্রেডিট জি.এল')}
                    </InputLabel>
                    <Select
                      name="chargeCreditgl"
                      id="demo-simple-select"
                      value={item?.chargeCreditgl}
                      label={
                        item?.chargeCreditgl == ''
                          ? star('চার্জ ক্রেডিট জি.এল নির্বাচন করুন')
                          : star('চার্জ ক্রেডিট জি.এল')
                      }
                      onBlur={handleBlur}
                      onChange={(e) => ownHandleChange(e, index, 'chargeCreditgl')}
                      size="small"
                      sx={{
                        '& .MuiSelect-select': {
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {glIncomeList.map((option) => (
                        <MenuItem value={option.id} key={option.id}>
                          {option.glacName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText
                    error={Boolean(
                      touched.chargeCreditgl
                        ? errors?.chargeArray && errors.chargeArray[index]?.chargeCreditgl
                        : touched.chargeArray &&
                        errors.chargeArray &&
                        touched.chargeArray[index]?.chargeCreditgl &&
                        errors.chargeArray[index]?.chargeCreditgl,
                    )}
                  >
                    {touched.chargeCreditgl
                      ? errors?.chargeArray && errors.chargeArray[index]?.chargeCreditgl
                      : touched.chargeArray &&
                      errors.chargeArray &&
                      touched.chargeArray[index]?.chargeCreditgl &&
                      errors.chargeArray[index]?.chargeCreditgl}
                  </FormHelperText>
                </Grid>
              </Grid>
            );
          })
        }
      </FieldArray>
    </>
  );
};

export default InstallmentSetupForm;
