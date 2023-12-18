
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Division } from '../../url/ApiList';
const DivisionData = (props) => {
  let accessToken = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('accessToken')) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const { allreplica } = props;

  const { allDivisionData } = props;
  const { flag } = props;
  const { childDiv } = props;
  const { childPass } = props;
  const [resultOfDivision, setResultOfDivision] = useState([]);
  const [divisionId, setDivisionId] = useState('');
  const [wdivisionId, setWDivisionId] = useState('');
  const { childWDiv } = props;

  allDivisionData({
    divisionId,
    wdivisionId,
  });
  let changeDivision = (e) => {
    setDivisionId(e.target.value);
  };
  let changeWDivision = (e) => {
    setWDivisionId(e.target.value);
  };

  useEffect(() => {
    getDivision();
  }, []);

  let getDivision = async () => {
    try {
      let divisionAllData = await axios.get(Division, config);
      setResultOfDivision(divisionAllData.data.data);
    } catch (err) {
      'Error', err;
      'Error', err.response;
    }
  };
  let wdivision_Id = childWDiv ? childWDiv : '';
  var division_Id = childDiv ? childDiv : '';
  var division_id = childPass ? childPass.divisionId : '';
  return (
    <>
      <Grid item md={allreplica == 6 ? 2 : 4} xs={12}>
        {flag ? (
          <TextField
            fullWidth
            label="বিভাগ"
            name="division"
            onChange={changeDivision}
            required
            select
            SelectProps={{ native: true }}
            value={division_Id ? division_Id : divisionId || division_id}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfDivision.map((option) => (
              <option key={option.divisionId} value={option.divisionId}>
                {option.divisionNameBangla}
              </option>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            label="বিভাগ"
            name="wdivision"
            onChange={changeWDivision}
            required
            select
            SelectProps={{ native: true }}
            value={wdivision_Id ? wdivision_Id : wdivisionId}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfDivision.map((option) => (
              <option key={option.divisionId} value={option.divisionId}>
                {option.divisionNameBangla}
              </option>
            ))}
          </TextField>
        )}
      </Grid>
    </>
  );
};

export default DivisionData;
