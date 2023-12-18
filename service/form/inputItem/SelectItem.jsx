/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/28 10:13:48
 * @modify date 2022/07/28 10:13:48
 * @desc [description]
 */
import { Grid, TextField } from '@mui/material';

const SelectItem = ({ row }) => {
  /////////////////////// only use for select item selection //////////////////////////////
  function nameFun(params, params1) {
    return params[params1];
  }
  /////////////////////// only use for select item selection //////////////////////////////
  return (
    <>
      <Grid item xl={row.xl} lg={row.lg} md={row.md} xs={row.xs} hidden={row.hidden}>
        <TextField
          fullWidth
          disabled={row.isDisabled}
          label={row.labelName}
          name={row.name}
          onChange={row.onChange}
          select
          SelectProps={{ native: true }}
          value={row.value | 0}
          variant="outlined"
          size="small"
          sx={row.customStyle}
          error={row.errorMessage ? true : false}
          helperText={row.errorMessage}
        >
          {row.selectDisable ? '' : <option value={0}>- নির্বাচন করুন -</option>}
          {row.optionData.map((option, i) => (
            <option key={i} value={nameFun(option, row.optionValue)}>
              {nameFun(option, row.optionName)}
            </option>
          ))}
        </TextField>
      </Grid>
    </>
  );
};

export default SelectItem;
