/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/28 10:13:48
 * @modify date 2022/07/28 10:13:48
 * @desc [description]
 */
import { Grid, TextField } from '@mui/material';

const TextFieldItem = ({ row, i }) => {
  return (
    <>
      <Grid key={i} item xl={row.xl} lg={row.lg} md={row.md} xs={row.xs} hidden={row.hidden}>
        <TextField
          fullWidth
          disabled={row.isDisabled}
          label={row.labelName}
          name={row.name}
          inputMode="numeric"
          onChange={row.onChange}
          placeholder={row.placeholder}
          type={row.type}
          value={row.value}
          variant="outlined"
          autoComplete={row.autoComplete}
          size={row.size}
          className={row.customClass}
          sx={row.customStyle}
          error={row.errorMessage ? true : false}
          helperText={row.errorMessage}
        ></TextField>
      </Grid>
    </>
  );
};

export default TextFieldItem;
