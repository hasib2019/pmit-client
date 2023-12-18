/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/28 10:13:48
 * @modify date 2022/07/28 10:13:48
 * @desc [description]
 */
import { Grid, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DesktopDate = ({ row, i }) => {
  return (
    <>
      <Grid key={i} item xl={row.xl} lg={row.lg} md={row.md} xs={row.xs} hidden={row.hidden}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            inputFormat={row.dateFormet}
            label={row.labelName}
            value={row.value}
            disableFuture={row.disableFuture}
            onChange={row.onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                sx={{ width: '100%' }}
                error={row.errorMessage ? true : false}
                helperText={row.errorMessage}
              />
            )}
            sx={row.customStyle}
            disabled={row.isDisabled}
            disablePast={row.disablePast}
          />
        </LocalizationProvider>
      </Grid>
    </>
  );
};

export default DesktopDate;
