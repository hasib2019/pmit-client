import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Grid,
  TextField,
  Tooltip
} from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
const DataSynchronization = () => {

  const [samityTypeList] = useState([
    {
      value: 'office',
      label: 'অফিস ',
    },
    {
      value: 'geoCode',
      label: 'জিও কোড ',
    },
    {
      value: 'masterData',
      label: 'মাস্টার ডাটা ',
    },
  ]);
  const [selectValue, setSelectValue] = useState('');
  const [loadning, setLoadning] = useState();
  //   useEffect(() => {
  //    getDivisionData();
  //   }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSelectValue(value);
  };
  const onSubmitData = () => {
    ('Clicked');
    getroleInfo(selectValue);
  };
  const getroleInfo = async (type) => {
    try {
      switch (type) {
        case 'office':
          setLoadning(true);
          // const officeData = await axios.get(dataSyncGeoRoute, config);
          // setOfficeData(officeData);
          // setLoadning(false)
          break;
        case 'geoCode':
          setLoadning(true)('Geo Code');
          // const geoData = await axios.get(dataSyncGeoRoute, config);
          // setGeoData(geoData);
          break;
        // case 'geoCode':
        //   // const masterData = await axios.get(dataSyncGeoRoute, config);
        //   // setMasterData(masterData);
        //   break;
      }
    } catch (error) {
      setLoadning(false)
      // errorHandle(error);
    }
  };

  return (
    <div style={{ minHeight: '500px' }}>
      <Grid container justifyContent="center" display="flex" alignItems="center" spacing={2.5}>
        <Grid item xs={12} md={3} sm={12}>
          <TextField
            id="master"
            fullWidth
            label="নির্বাচন করুন"
            name="master"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChange(e)}
            type="text"
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          // value={upozillaId != null ? upozillaId : ""}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {samityTypeList.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          {loadning ? (
            <Tooltip title=" সংরক্ষণ করা হচ্ছে">
              <Button disabled variant="contained" sx={{ mr: 1 }} startIcon={<SaveOutlinedIcon />}>
                {' '}
                সংরক্ষণ করা হচ্ছে...
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="সংরক্ষণ করুন">
              <Button
                className="btn btn-save"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={onSubmitData}
              >
                {' '}
                সংরক্ষণ করুন
              </Button>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default DataSynchronization;
