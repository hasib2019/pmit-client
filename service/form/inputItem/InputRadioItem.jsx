/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/28 10:13:48
 * @modify date 2022/07/28 10:13:48
 * @desc [description]
 */
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';

const InputRadioItem = ({ row }) => {
  return (
    <>
      <Grid item xl={row.xl} lg={row.lg} md={row.md} xs={row.xs} hidden={row.hidden}>
        <FormControl component="fieldset" disabled={row.isDisabled}>
          <RadioGroup
            row
            defaultValue={row.defaultVal}
            label={row.labelName}
            name={row.name}
            onChange={row.onChange}
            type={row.type}
            value={row.value}
            variant="outlined"
            size={row.size}
            className={row.customClass}
            sx={row.customStyle}
            error={row.errorMessage ? true : false}
            helperText={row.errorMessage}
          >
            {row.inputRadioGroup.map((row, i) => (
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
    </>
  );
};

export default InputRadioItem;
