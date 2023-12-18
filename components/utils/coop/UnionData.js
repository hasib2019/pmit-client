
import { TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { geoData } from '../../../url/coop/ApiList';
import { errorHandler } from 'service/errorHandler';

const UnionData = (props) => {
  let token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { allUnionData } = props;
  const { selectedDis, selectedUpa, selectedWDis, selectedWUpa } = props;
  const { flag } = props;
  const [resultOfUnion, setResultOfUnion] = useState([]);
  const [resultOfWUnion, setResultOfWUnion] = useState([]);
  const [unionId, setUnionId] = useState('');
  const [wunionId, setWUnionId] = useState('');
  const { childWUnion } = props;
  // new district
  const { childUnion } = props;

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

  let getUnion = async () => {
    try {
      if (flag) {
        if (selectedDis && selectedUpa) {
          let unionData = await axios.get(
            // union&districtId=8&upazilaId=50
            geoData + `union&districtId=${selectedDis}&upazilaId=${selectedUpa}`,
            config,
          );
          setResultOfUnion(unionData.data.data);
        } else if (selectedUpa) {
          let unionData = await axios.get(geoData + `union&upazilaId=${selectedUpa}`, config);
          setResultOfUnion(unionData.data.data);
        } else {
          let unionData = await axios.get(geoData + 'union', config);
          setResultOfUnion(unionData.data.data);
        }
      } else {
        if (selectedWDis && selectedWUpa) {
          let unionData = await axios.get(
            geoData + `union&districtId=${selectedWDis}&upazilaId=${selectedWUpa}`,
            config,
          );
          setResultOfWUnion(unionData.data.data);
        } else if (selectedWUpa) {
          let unionData = await axios.get(geoData + `union&upazilaId=${selectedWUpa}`, config);
          setResultOfWUnion(unionData.data.data);
        } else if (selectedWDis == '' && selectedWUpa == '') {
          let unionData = await axios.get(geoData + 'union', config);
          setResultOfWUnion(unionData.data.data);
        }
      }
    } catch (error) {
      errorHandler(error)
     }
  };

  let wunion_Id = childWUnion ? childWUnion : '';
  var union_Id = childUnion ? childUnion : '';
  // var union_Id=childPass?childPass.unionId:"";

  return (
    <>
      {/* <Grid item md={allreplica==6?2:2.4} xs={12}> */}
      {flag ? (
        <TextField
          fullWidth
          label="ইউনিয়ন/পৌরসভা/থানা"
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
          <option>- নির্বাচন করুন -</option>
          {resultOfUnion.map((option) => (
            <option key={option.id} value={option.id}>
              {option.unionNameBangla}
            </option>
          ))}
        </TextField>
      ) : (
        <TextField
          fullWidth
          label="ইউনিয়ন/পৌরসভা/থানা"
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
          <option>- নির্বাচন করুন -</option>
          {resultOfWUnion.map((option) => (
            <option key={option.id} value={option.id}>
              {option.unionNameBangla}
            </option>
          ))}
        </TextField>
      )}

      {/* </Grid> */}
    </>
  );
};

export default UnionData;
