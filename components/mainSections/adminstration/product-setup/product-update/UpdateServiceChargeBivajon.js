import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, Paper, TextField } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { useEffect, useState } from 'react';
import { glListRoute, sectorList } from '../../../../../url/ApiList';
import { engToBang } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';

const UpdateServiceChargeBivajon = ({
  serviceChargeSegregation,
  handleServiceChargeSegregation,
  handleToggle,
  prevServiceChargeSegregation,
  deleteServiceChargeSegregation,
}) => {



  const [allSecList, setAllSecList] = useState([]);
  const [glList, setGlList] = useState([]);

  useEffect(() => {
    getSectorList();
    getGlList();
  }, []);


  const getSectorList = async () => {
    const secList = await getApi(sectorList, 'get');
    setAllSecList(secList?.data?.data ? secList.data.data : []);
  };
  const getGlList = async () => {
    let res = await getApi(glListRoute + '?isPagination=false&parent_child=C', 'get');
    setGlList(res?.data?.data?.length >= 1 ? res.data.data : []);
  };

  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  return (
    <>
      {serviceChargeSegregation.map((v, i) => (
        <Paper
          sx={{
            padding: '30px 20px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginBottom: '10px',
          }}
          key={i}
        >
          <Grid container spacing={2.5} className="section">
            <Grid item md={3} xs={12}>
              <TextField
                id="sectorName"
                fullWidth
                label={star('খাতের নাম')}
                name="segregationId"
                select
                SelectProps={{ native: true }}
                value={v.segregationId || ' '}
                onChange={(e) => handleServiceChargeSegregation(e, i)}
                disabled=""
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {allSecList.map((option, idx) => (
                  <option key={idx} value={option.id}>
                    {option.segregationSectorName}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label={star('শতকরা হার(%)')}
                name="segregationRate"
                onChange={(e) => handleServiceChargeSegregation(e, i)}
                number
                value={engToBang(v.segregationRate)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={3} xs={12}>
              <TextField
                id="projectName"
                fullWidth
                label={star('লেজারের নাম')}
                name="glId"
                select
                SelectProps={{ native: true }}
                value={v.glId || ' '}
                onChange={(e) => handleServiceChargeSegregation(e, i)}
                disabled=""
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {glList.map((option, idx) => (
                  <option key={idx} value={option.id}>
                    {option.glacName}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid
              item
              md={3}
              xs={12}
              sx={{
                '& .MuiToggleButton-root.Mui-selected': {
                  color: '#357C3C',
                  backgroundColor: '#E7FBBE',
                },
              }}
            >
              <ToggleButton
                value="check"
                fullWidth
                selected={v.isActive}
                onChange={(e) => handleToggle(e, i)}
                sx={{ height: '40px' }}
              >
                {v.isActive ? (
                  <>
                    <CheckCircleIcon /> <h3>সক্রিয়</h3>
                  </>
                ) : (
                  <>
                    <HelpIcon />
                    <h3>সক্রিয়?</h3>
                  </>
                )}
              </ToggleButton>
            </Grid>
            {i >= prevServiceChargeSegregation.length && (
              <Grid item md={4} xs={12}>
                <Button
                  variant="contained"
                  className="buttonCancel"
                  onClick={(e) => deleteServiceChargeSegregation(e, i)}
                >
                  বাতিল করুন
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
    </>
  );
};

export default UpdateServiceChargeBivajon;
