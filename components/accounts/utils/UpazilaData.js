
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Upazila } from '../../url/ApiList';
// import UnionData from './UnionData';
const UpazilaData = (props) => {
  let accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  // let accessToken=typeof window !== "undefined"? JSON.parse(localStorage.getItem("accessToken")): null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  // const {allreplica} = props;
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
        // if(selectedDis && selectedDiv){
        //     let upazilaData = await axios.get(
        //         Upazila + `&divisionId=${selectedDiv}&districtId=${selectedDis}`,
        //         config
        //       );
        //       setResultOfUpazila(upazilaData.data.data);
        // }
        if (selectedDis) {
          let upazilaData = await axios.get(Upazila + `?district=${selectedDis}`, config);
          setResultOfUpazila(upazilaData.data.data);
        } else {
          let upazilaData = await axios.get(Upazila + '?allUpazila=true', config);
          setResultOfUpazila(upazilaData.data.data);
        }
      } else {
        // if(selectedWDis && selectedWDiv){
        //     let upazilaData = await axios.get(
        //         Upazila + `&divisionId=${selectedWDiv}&districtId=${selectedWDis}`,
        //         config
        //       );
        //       setResultOfWUpazila(upazilaData.data.data);
        // }
        if (selectedWDis) {
          let upazilaData = await axios.get(Upazila + `?district=${selectedWDis}`, config);
          setResultOfWUpazila(upazilaData.data.data);
        } else {
          let upazilaData = await axios.get(Upazila + '?allUpazila=true', config);
          setResultOfWUpazila(upazilaData.data.data);
        }
      }
    } catch (error) {
      // ("Error", error);
      // ("Error", error.response);
    }
  };
  let wupazila_Id = childWUpa ? childWUpa : '';

  return (
    <>
      {/* <Grid item md={allreplica==6?2:4} xs={12}> */}
      <Grid item md={6} xs={12}>
        {flag ? (
          <TextField
            fullWidth
            label="উপজেলা/থানা"
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
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {resultOfUpazila.map((option) => (
              <option key={option.id} value={option.id}>
                {option.upazilaNameBangla}
              </option>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            label="উপজেলা/থানা"
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
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {resultOfWUpazila.map((option) => (
              <option key={option.id} value={option.id}>
                {option.upazilaNameBangla}
              </option>
            ))}
          </TextField>
        )}
      </Grid>
    </>
  );
};

export default UpazilaData;
