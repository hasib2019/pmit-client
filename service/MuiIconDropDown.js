/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023-03-27 10.00 am
 * @modify date 2023-03-27 10.00 am
 * @desc [description]
 */

import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { iconList } from './IconList';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const MuiIconDropDown = ({ handleChange }) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="icon-dropdown-label">আইকন নির্বাচন করুন</InputLabel>
      <Select
        labelId="icon-dropdown-label"
        id="icon-dropdown"
        value={value}
        onChange={handleChange}
        IconComponent={ArrowDropDown}
      >
        {iconList.map((row, i) => (
          <MenuItem key={i} value={row.id}>
            <span style={{ paddingRight: '5px' }}>{row.icon}</span>
            <span>{row.name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MuiIconDropDown;
