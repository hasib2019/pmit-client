
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Union } from '../../url/ApiList';
const UnionData = (props) => {
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
  const { allUnionData } = props;
  const { selectedDis, selectedUpa, selectedWDis, selectedWUpa } = props;
  const { flag } = props;
  const { childPass } = props;
  const [resultOfUnion, setResultOfUnion] = useState([]);
  const [resultOfWUnion, setResultOfWUnion] = useState([]);
  const [unionId, setUnionId] = useState('');
  const [wunionId, setWUnionId] = useState('');
  const { childWUnion } = props;
  // new district
  // const { childUnion } = props;

  allUnionData({
    unionId,
    wunionId,
  });
  let changeUnion = (e) => {
    setUnionId(e.target.value);
  };

  let wchangeUnion = (e) => {
    setWUnionId(e.target.value);
  };
  useEffect(() => {
    getUnion();
    // getEditUnion();
  }, [selectedDis, selectedUpa, selectedWDis, selectedWUpa]);

  var union_Id = childPass ? childPass.unionId : '';
  let getUnion = async () => {
    try {
      if (flag) {
        // if (selectedDis && selectedUpa) {
        //     let unionData = await axios.get(
        //         Union + `&districtId=${selectedDis}&upazilaId=${selectedUpa}`,
        //         config
        //     );
        //     setResultOfUnion(unionData.data.data);
        // }
        if (selectedUpa) {
          let unionData = await axios.get(Union + `?upazila=${selectedUpa}`, config);
          setResultOfUnion(unionData.data.data);
        } else {
          let unionData = await axios.get(Union + '?allUnion=true', config);
          setResultOfUnion(unionData.data.data);
        }
      } else {
        // if(selectedWDis && selectedWUpa) {
        //     let unionData = await axios.get(
        //         Union + `&districtId=${selectedWDis}&upazilaId=${selectedWUpa}`,
        //         config
        //     );
        //     setResultOfWUnion(unionData.data.data);
        // }
        if (selectedWUpa) {
          let unionData = await axios.get(Union + `?upazila=${selectedWUpa}`, config);
          setResultOfWUnion(unionData.data.data);
        } else {
          let unionData = await axios.get(Union + '?allUnion=true', config);
          setResultOfWUnion(unionData.data.data);
        }
      }
    } catch (error) {
      // ("Error", error);
      // ("Error", error.response);
    }
  };

  let wunion_Id = childWUnion ? childWUnion : '';
  // var union_Id = childUnion ? childUnion : '';
  // var union_Id=childPass?childPass.unionId:"";

  return (
    <>
      {/* <Grid item md={allreplica==6?2:4} xs={12}> */}
      <Grid item md={6} xs={12}>
        {flag ? (
          <TextField
            fullWidth
            label="ইউনিয়ন/ওয়ার্ড"
            name="union"
            onChange={changeUnion}
            required
            select
            SelectProps={{ native: true }}
            value={union_Id ? union_Id : unionId}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {resultOfUnion.map((option) => (
              <option key={option.id} value={option.id}>
                {option.unionNameBangla}
              </option>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            label="ইউনিয়ন/ওয়ার্ড"
            name="wunion"
            onChange={wchangeUnion}
            required
            select
            SelectProps={{ native: true }}
            value={wunion_Id ? wunion_Id : wunionId}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {resultOfWUnion.map((option) => (
              <option key={option.id} value={option.id}>
                {option.unionNameBangla}
              </option>
            ))}
          </TextField>
        )}
      </Grid>
    </>
  );
};

export default UnionData;
