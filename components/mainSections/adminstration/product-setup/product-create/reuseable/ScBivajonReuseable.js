
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, Paper, TextField, Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { glListRoute, sectorList } from '../../../../../../url/ApiList';
import { engToBang, myValidate } from '../../../../samity-managment/member-registration/validator';
import { getApi } from '../../utils/getApi';
import { errorHandler } from 'service/errorHandler';

const ScBivajonReuseable = (
  {
    idx,
    childData,
    forEdit,
    proName,
    onDeleteData,
    setAllChildData,
    tempComponent,
    setDataForEdit,
    setTempComponent,
  },
  ref,
) => {
  const [formError, setFormError] = useState({});
  const [serviceChargeBivajon, setServiceChargeBivajon] = useState({
    sectorName: '',
    percentage: 0,
    generalLedgerName: '',
    activeToggle: true,
  });
  const [glList, setGlList] = useState([]);
  const [allSecList, setAllSecList] = useState([]);
  useEffect(() => {
    getGlList();
  }, []);

  useImperativeHandle(ref, () => ({
    updateScBijavonState: updateScBijavonState,
  }));
  const updateScBijavonState = () => {
    setServiceChargeBivajon({
      sectorName: '',
      percentage: 0,
      generalLedgerName: '',
      activeToggle: true,
    });
    setAllChildData([]);
    setTempComponent([]);
    setDataForEdit([]);
  };
  useEffect(() => {
    childData(serviceChargeBivajon, idx);
  }, [serviceChargeBivajon]);

  useEffect(() => {
    getSectorList();
  }, []);

  useEffect(() => {
    setServiceChargeBivajon({
      ...serviceChargeBivajon,
      sectorName: forEdit[0] ? forEdit[0].sectorName : '',
      percentage: forEdit[0] ? engToBang(forEdit[0].percentage) : '',
      generalLedgerName: forEdit[0] ? forEdit[0].generalLedgerName : '',
      activeToggle: forEdit[0] ? forEdit[0].activeToggle : false,
    });
  }, [forEdit[0]]);

  const getGlList = async () => {
    try {
      let res = await getApi(glListRoute + '?isPagination=false&parent_child=C', 'get');
      setGlList(res.data.data.length >= 1 ? res.data.data : []);
    } catch (err) {
      errorHandler(err)
     }
  };
  const getSectorList = async () => {
    const secList = await getApi(sectorList, 'get');
    setAllSecList(secList?.data?.data ? secList.data.data : []);
  };

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    let resultObj;
    if (id == 'numberWithPercent') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }

      setServiceChargeBivajon({
        ...serviceChargeBivajon,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }
    setServiceChargeBivajon({
      ...serviceChargeBivajon,
      [name]: value,
    });
  };

  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  const { sectorName, generalLedgerName, activeToggle } = serviceChargeBivajon;

  return (
    <>
      <Paper
        sx={{
          p: '20px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          mb: '20px',
        }}
      >
        <Grid container spacing={2.5} pb={1.5}>
          {tempComponent && tempComponent.length > 1 && (
            <Grid item md={12} xs={12} sx={{ textAlign: 'right' }}>
              <Tooltip title="সার্ভিস চার্জ বাদ দিন">
                <Button variant="contained" color="error" onClick={onDeleteData} size="small">
                  <ClearIcon />
                </Button>
              </Tooltip>
            </Grid>
          )}

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              disabled
              id="standard-disabled"
              label={star('প্রোডাক্টের নাম')}
              defaultValue={proName}
              variant="standard"
            />
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              id="sectorName"
              fullWidth
              label={star('খাতের নাম')}
              name="sectorName"
              select
              SelectProps={{ native: true }}
              value={sectorName ? sectorName : ' '}
              onChange={handleChange}
              disabled=""
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {allSecList.map((option, id) => (
                <option key={id} value={option.id}>
                  {option.segregationSectorName}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="numberWithPercent"
              label={star('শতকরা হার(%)')}
              name="percentage"
              onChange={handleChange}
              value={serviceChargeBivajon.percentage}
              variant="outlined"
              size="small"
            ></TextField>
            {<span style={{ color: '#FFCC00' }}>{formError.percentage}</span>}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('লেজারের নাম')}
              name="generalLedgerName"
              select
              SelectProps={{ native: true }}
              value={generalLedgerName ? generalLedgerName : ' '}
              onChange={handleChange}
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
            md={4}
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
              selected={activeToggle}
              onChange={() => {
                setServiceChargeBivajon({
                  ...serviceChargeBivajon,
                  activeToggle: !activeToggle,
                });
              }}
              sx={{ height: '40px' }}
            >
              {activeToggle ? (
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
        </Grid>
      </Paper>
    </>
  );
};
const ScBivajon = forwardRef(ScBivajonReuseable);
export default ScBivajon;
