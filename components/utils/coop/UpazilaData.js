

import { TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { geoData } from '../../../url/coop/ApiList';
import { errorHandler } from 'service/errorHandler';

const UpazilaData = (props) => {
  const config = localStorageData('config')
  const { allUpazilaData } = props;
  const { selectedDis, selectedDiv, selectedWDis, selectedWDiv } = props;
  const { flag } = props;
  const { childUpa } = props;
  const { childWUpa } = props;
  const { childPass } = props;
  const [resultOfUpazila, setResultOfUpazila] = useState([]);
  const [resultOfWUpazila, setResultOfWUpazila] = useState([]);
  const [upazilaId, setUpazilaId] = useState('');
  const [wupazilaId, setWUpazilaId] = useState('');

  // new district
  allUpazilaData({
    upazilaId,
    wupazilaId,
  });

  let changeUpazila = (e) => {
    setUpazilaId(e.target.value);
  };

  let wchangeUpazila = (e) => {
    setWUpazilaId(e.target.value);
  };

  var upazila_Id = childUpa ? childUpa : '';
  var upazila_id = childPass ? childPass.upazilaId : '';
  useEffect(() => {
    getUpazila();
  }, [selectedDis, selectedDiv, selectedWDiv, selectedWDis]);

  let getUpazila = async () => {
    try {
      if (flag) {
        if (selectedDis && selectedDiv) {
          let upazilaData = await axios.get(
            geoData + `upazila&districtId=${selectedDis}&divisionId=${selectedDiv}`,
            config,
          );
          setResultOfUpazila(upazilaData.data.data);
        } else if (selectedDis) {
          let upazilaData = await axios.get(geoData + `upazila&districtId=${selectedDis}`, config);
          setResultOfUpazila(upazilaData.data.data);
        } else if (selectedDis == '' && selectedDiv == '') {
          let upazilaData = await axios.get(geoData + 'upazila', config);
          setResultOfUpazila(upazilaData.data.data);
        }
      } else {
        if (selectedWDis && selectedWDiv) {
          let upazilaData = await axios.get(
            geoData + `upazila&districtId=${selectedWDis}&divisionId=${selectedWDiv}`,
            config,
          );
          setResultOfWUpazila(upazilaData.data.data);
        } else if (selectedWDis) {
          let upazilaData = await axios.get(geoData + `upazila&districtId=${selectedWDis}`, config);
          setResultOfWUpazila(upazilaData.data.data);
        } else {
          let upazilaData = await axios.get(geoData + 'upazila', config);
          setResultOfWUpazila(upazilaData.data.data);
        }
      }
    } catch (error) {
      errorHandler(error)
     }
  };
  let wupazila_Id = childWUpa ? childWUpa : '';

  return (
    <>
      {/* <Grid item md={allreplica==6?2:2.4} xs={12}> */}
      {flag ? (
        <TextField
          fullWidth
          label="উপজেলা/সিটি-কর্পোরেশন"
          name="upazila"
          onChange={changeUpazila}
          required
          select
          SelectProps={{ native: true }}
          value={upazila_Id ? upazila_Id : upazilaId || upazila_id}
          variant="outlined"
          size="small"
          sx={{ backgroundColor: '#FFF' }}
        >
          <option>- নির্বাচন করুন -</option>
          {resultOfUpazila.map((option) => (
            <option key={option.id} value={option.id}>
              {option.upazilaNameBangla}
            </option>
          ))}
        </TextField>
      ) : (
        <TextField
          fullWidth
          label="উপজেলা/সিটি-কর্পোরেশন"
          name="wupazila"
          onChange={wchangeUpazila}
          required
          select
          SelectProps={{ native: true }}
          value={wupazila_Id ? wupazila_Id : wupazilaId}
          variant="outlined"
          size="small"
          sx={{ backgroundColor: '#FFF' }}
        >
          <option>- নির্বাচন করুন -</option>
          {resultOfWUpazila.map((option) => (
            <option key={option.id} value={option.id}>
              {option.upazilaNameBangla}
            </option>
          ))}
        </TextField>
      )}

      {/* </Grid> */}
    </>
  );
};

export default UpazilaData;
