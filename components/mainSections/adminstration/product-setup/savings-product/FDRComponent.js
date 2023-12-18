/* eslint-disable no-misleading-character-class */
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { bangToEng, engToBang } from './validator';

import star from 'components/utils/coop/star';
import { useFormikContext } from 'formik';
const FDRComponents = () => {
  const { values, handleChange, touched, errors, handleBlur, setFieldValue } = useFormikContext();
  const {
    projectId,
    productCode,
    productName,
    projectsList,
    profitPostingPeriod,
    lowestInsAmount,
    highestInsAmount,
    installmentRateMultiplier,
    profitPostingPeriodArray,
    maturityProcessArray,
    maturityProcess,
    savingsType,
  } = values;
  const ownHandleChange = (e) => {
    let { name, value } = e.target;
    if (name == 'productName' || name == 'productDescription') {
      value = value.replace(
        /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA-\s]/gi,
        '',
      );
      setFieldValue(name, value);
      return;
    }
    value = bangToEng(value);
    setFieldValue(name, value);
  };
  return (
    <>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {projectId === '' ? star('প্রকল্প/কর্মসূচী নির্বাচন করুন') : star('প্রকল্প/কর্মসূচীর নাম')}
          </InputLabel>
          <Select
            name="projectId"
            id="demo-simple-select"
            value={projectId}
            label={projectId === '' ? star('প্রকল্প/কর্মসূচী নির্বাচন করুন') : star('প্রকল্প/কর্মসূচীর নাম')}
            onChange={handleChange}
            size="small"
            sx={{
              '& .MuiSelect-select': {
                textDecoration: 'none',
              },
            }}
          >
            {projectsList.map((option) => (
              <MenuItem value={option.id} key={option.id}>
                {option.projectNameBangla}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('প্রোডাক্টের কোড')}
          id="productCode"
          name="productCode"
          onChange={ownHandleChange}
          //id="numberWithCharacter"
          onBlur={handleBlur}
          value={productCode}
          variant="outlined"
          size="small"
          error={Boolean(touched.productCode && errors.productCode)}
          helperText={touched.productCode && errors.productCode}
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('প্রোডাক্টের নাম')}
          id="productName"
          name="productName"
          onChange={ownHandleChange}
          onBlur={handleBlur}
          //id="numberWithCharacter"
          value={productName}
          error={Boolean(touched.productName && errors.productName)}
          helperText={touched.productName && errors.productName}
          variant="outlined"
          size="small"
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {profitPostingPeriod === ''
              ? star('মুনাফা পোস্টিং পিরিয়ড নির্বাচন করুন')
              : star('মুনাফা পোস্টিং পিরিয়ডের নাম')}
          </InputLabel>
          <Select
            name="profitPostingPeriod"
            id="demo-simple-select"
            value={profitPostingPeriod}
            label={
              profitPostingPeriod === ''
                ? star('মুনাফা পোস্টিং পিরিয়ড নির্বাচন করুন')
                : star('মুনাফা পোস্টিং পিরিয়ডের নাম')
            }
            onChange={handleChange}
            size="small"
            sx={{
              '& .MuiSelect-select': {
                textDecoration: 'none',
              },
            }}
          >
            {profitPostingPeriodArray
              .filter((profitElement) => (savingsType == 'DPS' ? profitElement.value == 'MAT' : true))
              .map((option) => (
                <MenuItem value={option.value} key={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {maturityProcess === '' ? star('ম্যাচুরিটি প্রক্রিয়া নির্বাচন করুন') : star('ম্যাচুরিটি প্রক্রিয়ার নাম')}
          </InputLabel>
          <Select
            name="maturityProcess"
            id="demo-simple-select"
            value={maturityProcess}
            label={
              maturityProcess === '' ? star('ম্যাচুরিটি প্রক্রিয়া নির্বাচন করুন') : star('ম্যাচুরিটি প্রক্রিয়ার নাম')
            }
            onChange={ownHandleChange}
            size="small"
            sx={{
              '& .MuiSelect-select': {
                textDecoration: 'none',
              },
            }}
          >
            {maturityProcessArray.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('সর্বনিম্ন কিস্তির পরিমাণ')}
          name="lowestInsAmount"
          onChange={ownHandleChange}
          value={engToBang(lowestInsAmount)}
          variant="outlined"
          size="small"
          onBlur={handleBlur}
          error={Boolean(touched.lowestInsAmount && errors.lowestInsAmount)}
          helperText={touched.lowestInsAmount && errors.lowestInsAmount}
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('সর্বোচ্চ কিস্তির পরিমাণ')}
          name="highestInsAmount"
          onChange={ownHandleChange}
          value={engToBang(highestInsAmount)}
          variant="outlined"
          size="small"
          onBlur={handleBlur}
          error={Boolean(touched.highestInsAmount && errors.highestInsAmount)}
          helperText={touched.highestInsAmount && errors.highestInsAmount}
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('কিস্তির হারের গুণিতক')}
          name="installmentRateMultiplier"
          onChange={ownHandleChange}
          value={engToBang(installmentRateMultiplier)}
          variant="outlined"
          size="small"
          onBlur={handleBlur}
          error={Boolean(touched.installmentRateMultiplier && errors.installmentRateMultiplier)}
          helperText={touched.installmentRateMultiplier && errors.installmentRateMultiplier}
        ></TextField>
      </Grid>
    </>
  );
};

export default FDRComponents;
