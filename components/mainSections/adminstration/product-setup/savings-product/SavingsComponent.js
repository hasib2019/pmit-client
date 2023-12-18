/* eslint-disable no-misleading-character-class */
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import star from 'components/utils/coop/star';
import { useFormikContext } from 'formik';
import { bangToEng, engToBang } from './validator';
const SavingsComponent = () => {
  const { values, handleChange, errors, touched, handleBlur, setFieldValue } = useFormikContext();
  const {
    projectId,
    repaymentFrequency,
    productCode,
    productDescription,
    realizableSavings,
    productName,
    projectsList,
  } = values;
  const ownHandleChange = (e) => {
    let { value, name } = e.target;
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
            onBlur={handleBlur}
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
        <FormHelperText error={Boolean(touched.projectId && errors.projectId && !projectId)}>
          {touched.projectId && !projectId && errors.projectId}
        </FormHelperText>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('প্রোডাক্টের কোড')}
          id="productCode"
          name="productCode"
          onChange={ownHandleChange}
          onBlur={handleBlur}
          //id="numberWithCharacter"
          value={engToBang(productCode)}
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
          value={productName}
          variant="outlined"
          size="small"
          error={Boolean(touched.productName && errors.productName)}
          helperText={touched.productName && errors.productName}
        ></TextField>
      </Grid>

      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('প্রোডাক্টের বিবরণ')}
          id="productDescription"
          name="productDescription"
          onChange={ownHandleChange}
          onBlur={handleBlur}
          //id="numberWithCharacter"
          value={productDescription}
          variant="outlined"
          size="small"
          error={Boolean(touched.productDescription && errors.productDescription)}
          helperText={touched.productDescription && errors.productDescription}
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {repaymentFrequency == '' ? star('কিস্তির ফ্রিকোয়েন্সি নির্বাচন করুন') : star('কিস্তির ফ্রিকোয়েন্সি')}
          </InputLabel>
          <Select
            name="repaymentFrequency"
            id="demo-simple-select"
            value={repaymentFrequency}
            label={repaymentFrequency == '' ? star('কিস্তির ফ্রিকোয়েন্সি নির্বাচন করুন') : star('কিস্তির ফ্রিকোয়েন্সি')}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
            sx={{
              '& .MuiSelect-select': {
                textDecoration: 'none',
              },
            }}
          >
            {[
              { value: 'W', label: 'সাপ্তাহিক' },
              { value: 'M', label: 'মাসিক' },
            ].map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText
            error={Boolean(touched.repaymentFrequency && errors.repaymentFrequency && !repaymentFrequency)}
          >
            {touched.repaymentFrequency && !repaymentFrequency && errors.repaymentFrequency}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('আদায়যোগ্য সঞ্চয়')}
          name="realizableSavings"
          onChange={ownHandleChange}
          onBlur={handleBlur}
          value={engToBang(realizableSavings)}
          id="numberWithCharge"
          variant="outlined"
          size="small"
          error={Boolean(touched.realizableSavings && errors.realizableSavings)}
          helperText={touched.realizableSavings && errors.realizableSavings}
        ></TextField>
      </Grid>
    </>
  );
};

export default SavingsComponent;
