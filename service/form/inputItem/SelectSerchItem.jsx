/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/28 10:13:48
 * @modify date 2022/07/28 10:13:48
 * @desc [description]
 */
import { Autocomplete, Grid, TextField } from '@mui/material';

const SelectSerchItem = ({ row }) => {
  /////////////////////// only use for select item selection //////////////////////////////
  return (
    <>
      <Grid item xl={row.xl} lg={row.lg} md={row.md} xs={row.xs} hidden={row.hidden}>
        <Autocomplete
          onChange={(e, value) => {
            row.onChange(value);
          }}
          getOptionLabel={(option) => option[row.optionName]}
          options={row.optionData}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              name={row.name}
              disabled={row.isDisabled}
              label={row.labelName}
              variant="outlined"
              size="small"
            />
          )}
        />
      </Grid>
    </>
  );
};

export default SelectSerchItem;
