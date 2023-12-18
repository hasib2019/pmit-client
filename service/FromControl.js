/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/17 9:30:00 AM
 * @modify date 2022/07/17
 * @desc [description]
 */
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import bnLocale from 'date-fns/locale/bn';

const FromControl = ({
  labelName,
  name,
  handleChange,
  value,
  size,
  type,
  viewType,
  dateFormet,
  locale,
  disableFuture,
  MinDate,
  optionData,
  optionValue,
  optionName,
  xl,
  lg,
  md,
  xs,
  isDisabled,
  customClass,
  customStyle,
}) => {
  const localeMap = {
    bn: bnLocale,
  };

  const maskMap = {
    bn: '__/__/____',
  };

  function nameFun(params, params1) {
    return params[params1];
  }

  return (
    <>
      {viewType == 'textField' ? (
        <Grid item xl={xl} lg={lg} md={md} xs={xs}>
          <TextField
            fullWidth
            disabled={isDisabled}
            label={labelName}
            name={name}
            onChange={handleChange}
            type={type}
            value={value}
            variant="outlined"
            size={size}
            className={customClass}
            sx={customStyle}
          ></TextField>
          {/* {errors} */}
        </Grid>
      ) : viewType == 'select' ? (
        <Grid item xl={xl} lg={lg} md={md} xs={xs}>
          <TextField
            fullWidth
            disabled={isDisabled}
            label={labelName}
            name={name}
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            value={value}
            variant="outlined"
            size="small"
            sx={customStyle}
          >
            <option value={null}>- নির্বাচন করুন -</option>
            {optionData.map((option, i) => (
              <option key={i} value={nameFun(option, optionValue)}>
                {nameFun(option, optionName)}
              </option>
            ))}
          </TextField>
        </Grid>
      ) : viewType == 'date' ? (
        <Grid item md={md} lg={lg} xl={xl} xs={xs}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
            <DatePicker
              mask={maskMap[bnLocale]}
              inputFormat={dateFormet}
              label={labelName}
              //  name={name}
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              disableFuture={disableFuture}
              min={MinDate}
              sx={customStyle}
            />
          </LocalizationProvider>
        </Grid>
      ) : (
        ''
      )}
    </>
  );
};

export default FromControl;
