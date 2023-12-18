/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
///////////////////////////////////// *********** Date *******//////////////////////////
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import bnLocale from 'date-fns/locale/bn';
/////////////////////////////////////*** Input Radio Group ***///////////////////////
export const inputRadioGroup = (
  name,
  handleChange,
  inputVlue,
  optionValue,
  sizeMd,
  sizelg,
  sizexl,
  sizeXs,
  disableddata,
  defaultVal,
  customClass,
  hideen,
) => {
  return (
    <Grid item md={sizeMd} lg={sizelg} xl={sizexl} xs={sizeXs} hidden={hideen}>
      <FormControl component="fieldset" disabled={disableddata}>
        <RadioGroup
          row
          // aria-label="pcn"
          name={name}
          onChange={handleChange}
          defaultValue={defaultVal}
          value={inputVlue}
          className={customClass}
        >
          {optionValue.map((row, i) => (
            <FormControlLabel
              key={i}
              sx={{ color: row.color }}
              value={row.value}
              control={<Radio color={row.rColor} />}
              label={row.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};
function nameFun(params, params1) {
  return params[params1];
}
///////////////////////////////////////*** input Select ***//////////////////
export const inputSelect = (
  labelName,
  inputName,
  handleChange,
  values,
  optionData,
  optionValue,
  optionName,
  sizeMd,
  sizelg,
  sizexl,
  sizeXs,
  customClass,
  disabled,
) => {
  return (
    <Grid item md={sizeMd} lg={sizelg} xl={sizexl} xs={sizeXs} className={customClass}>
      <TextField
        fullWidth
        disabled={disabled}
        label={labelName}
        name={inputName}
        onChange={handleChange}
        select
        SelectProps={{ native: true }}
        value={values | 0}
        variant="outlined"
        size="small"
      >
        <option value={0}>- নির্বাচন করুন -</option>
        {optionData.map((option, i) => (
          <option key={i} value={nameFun(option, optionValue)}>
            {nameFun(option, optionName)}
          </option>
        ))}
      </TextField>
    </Grid>
  );
};

export const inputField = (
  labelName,
  inputName,
  inputType,
  handleChange,
  values,
  inputSize,
  sizeMd,
  sizelg,
  sizexl,
  sizeXs,
  errors,
  customClass,
  disabled,
  hidden,
) => {
  return (
    <Grid item xl={sizexl} lg={sizelg} md={sizeMd} xs={sizeXs} hidden={hidden}>
      <TextField
        fullWidth
        disabled={disabled}
        label={labelName}
        name={inputName}
        onChange={handleChange}
        type={inputType}
        value={values}
        variant="outlined"
        size={inputSize}
        className={customClass}
        error={errors ? true : false}
        helperText={errors}
      ></TextField>
      {/* {errors} */}
    </Grid>
  );
};

const localeMap = {
  bn: bnLocale,
};

const maskMap = {
  bn: '__/__/____',
};
export const inputDate = (
  labelName,
  handleChange,
  values,
  dateFormet,
  MinDate,
  locale,
  disFuture,
  sizeMd,
  sizelg,
  sizexl,
  sizeXs,
  errorMessage,
) => {
  return (
    <Grid item md={sizeMd} lg={sizelg} xl={sizexl} xs={sizeXs}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
        <DatePicker
          mask={maskMap[bnLocale]}
          inputFormat={dateFormet}
          label={labelName}
          value={values}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              size="small"
              sx={{ width: '100%' }}
              error={errorMessage ? true : false}
              helperText={errorMessage}
            />
          )}
          disableFuture={disFuture}
          min={MinDate}
        />
      </LocalizationProvider>
    </Grid>
  );
};
