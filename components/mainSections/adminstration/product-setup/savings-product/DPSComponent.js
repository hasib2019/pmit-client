/* eslint-disable no-misleading-character-class */
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import Switch from '@mui/material/Switch';
import star from 'components/utils/coop/star';
import { useFormikContext } from 'formik';
import { bangToEng, engToBang } from './validator';
const DPSComponent = () => {
  const { values, handleChange, touched, errors, handleBlur, setFieldValue } = useFormikContext();
  const {
    projectId,
    productCode,
    productName,
    projectsList,
    profitPostingPeriod,
    repaymentFrequency,
    installmentStartingDate,
    installmentClosingDate,
    overDueCharge,
    considerationOfHolidays,
    maxNumberOfDefaultInstallments,
    defaulterAction,
    allowInstallmentsAfterMaturity,
    maxLimitAfterMaturity,
    maturityProcess,
    lowestInsAmount,
    highestInsAmount,
    installmentRateMultiplier,
    profitPostingPeriodArray,
    maturityProcessArray,
    savingsType,
    defaulterActionArray,
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
          //id="numberWithCharacter"
          onBlur={handleBlur}
          value={productName}
          variant="outlined"
          size="small"
          error={Boolean(touched.productName && errors.productName)}
          helperText={touched.productName && errors.productName}
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
            onBlur={handleBlur}
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
        <FormHelperText
          error={Boolean(touched.profitPostingPeriod && errors.profitPostingPeriod && !profitPostingPeriod)}
        >
          {touched.profitPostingPeriod && !profitPostingPeriod && errors.profitPostingPeriod}
        </FormHelperText>
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
        </FormControl>
        <FormHelperText error={Boolean(touched.repaymentFrequency && errors.repaymentFrequency && !repaymentFrequency)}>
          {touched.repaymentFrequency && !repaymentFrequency && errors.repaymentFrequency}
        </FormHelperText>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            control={<Switch checked={overDueCharge} onChange={handleChange} name="overDueCharge" />}
            label="বিলম্বিত চার্জ?"
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('কিস্তির শুরুর দিন')}
          name="installmentStartingDate"
          onChange={ownHandleChange}
          onBlur={handleBlur}
          value={engToBang(installmentStartingDate)}
          variant="outlined"
          size="small"
          error={Boolean(touched.installmentStartingDate && errors.installmentStartingDate)}
          helperText={touched.installmentStartingDate && errors.installmentStartingDate}
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('কিস্তির শেষের দিন')}
          name="installmentClosingDate"
          onChange={ownHandleChange}
          value={engToBang(installmentClosingDate)}
          onBlur={handleBlur}
          variant="outlined"
          size="small"
          error={Boolean(touched.installmentClosingDate && errors.installmentClosingDate)}
          helperText={touched.installmentClosingDate && errors.installmentClosingDate}
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            control={
              <Switch checked={considerationOfHolidays} onChange={handleChange} name="considerationOfHolidays" />
            }
            label="ছুটির দিন বিবেচনা?"
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('সর্বোচ্চ ডিফল্ট কিস্তির সংখ্যা')}
          name="maxNumberOfDefaultInstallments"
          onChange={ownHandleChange}
          value={engToBang(maxNumberOfDefaultInstallments)}
          variant="outlined"
          size="small"
          onBlur={handleBlur}
          error={Boolean(touched.maxNumberOfDefaultInstallments && errors.maxNumberOfDefaultInstallments)}
          helperText={touched.maxNumberOfDefaultInstallments && errors.maxNumberOfDefaultInstallments}
        ></TextField>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {defaulterAction === '' ? star('ডিফল্টার অ্যাকশন নির্বাচন করুন') : star('ডিফল্টার অ্যাকশন নাম')}
          </InputLabel>
          <Select
            name="defaulterAction"
            id="demo-simple-select"
            value={defaulterAction}
            label={maturityProcess === '' ? star('ডিফল্টার অ্যাকশন নির্বাচন করুন') : star('ডিফল্টার অ্যাকশন নাম')}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
            sx={{
              '& .MuiSelect-select': {
                textDecoration: 'none',
              },
            }}
          >
            {defaulterActionArray.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={Boolean(touched.defaulterAction && errors.defaulterAction && !defaulterAction)}>
            {touched.defaulterAction && !defaulterAction && errors.defaulterAction}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            control={
              <Switch
                checked={allowInstallmentsAfterMaturity}
                onChange={handleChange}
                name="allowInstallmentsAfterMaturity"
              />
            }
            label="মেয়াদপূর্তির পর কিস্তির অনুমতি?"
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label={star('মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন)')}
          name="maxLimitAfterMaturity"
          placeholder="মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন)"
          onChange={ownHandleChange}
          value={engToBang(maxLimitAfterMaturity)}
          variant="outlined"
          size="small"
          onBlur={handleBlur}
          error={Boolean(touched.maxLimitAfterMaturity && errors.maxLimitAfterMaturity)}
          helperText={touched.maxLimitAfterMaturity && errors.maxLimitAfterMaturity}
        ></TextField>
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
            onChange={handleChange}
            onBlur={handleBlur}
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
          <FormHelperText error={Boolean(touched.maturityProcess && errors.maturityProcess && !maturityProcess)}>
            {touched.maturityProcess && !maturityProcess && errors.maturityProcess}
          </FormHelperText>
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
          onBlur={handleBlur}
          size="small"
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
          onBlur={handleBlur}
          value={engToBang(highestInsAmount)}
          variant="outlined"
          size="small"
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
          onBlur={handleBlur}
          size="small"
          error={Boolean(touched.installmentRateMultiplier && errors.installmentRateMultiplier)}
          helperText={touched.installmentRateMultiplier && errors.installmentRateMultiplier}
        ></TextField>
      </Grid>
    </>
  );
};

export default DPSComponent;
