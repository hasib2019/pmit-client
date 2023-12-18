
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { District } from '../../url/ApiList';
const DistrictData = (props) => {
  let accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const { allDistrictData } = props;
  const { selectedDiv } = props;
  const { selectedWDiv } = props;
  const { childPass } = props;
  const { flag } = props;
  const [resultOfDistrict, setResultOfDistrict] = useState([]);
  const [resultOfWDistrict, setWResultOfDistrict] = useState([]);
  const [districtId, setDistrictId] = useState('');
  const [wdistrictId, setWDistrictId] = useState('');
  const { childDis } = props;
  const { childWDis } = props;
  allDistrictData({
    districtId,
    wdistrictId,
  });
  var district_Id = childDis ? childDis : '';

  let wdistrict_Id = childWDis ? childWDis : '';
  var district_id = childPass ? childPass.districtId : '';

  let changeDistrict = (e) => {
    setDistrictId(e.target.value);
  };
  let wchangeDistrict = (e) => {
    setWDistrictId(e.target.value);
  };
  useEffect(() => {
    getDistrict();
  }, [selectedDiv, selectedWDiv]);

  let getDistrict = async () => {
    try {
      if (flag) {
        if (selectedDiv) {
          let districtData = await axios.get(District + `&divisionId=${selectedDiv}`, config);
          setResultOfDistrict(districtData.data.data);
        } else {
          let districtData = await axios.get(District + '?allDistrict=true', config);
          setResultOfDistrict(districtData.data.data);
        }
      } else {
        if (selectedWDiv) {
          //  ("Selected Working Div and Dis",selectedWDiv,wdistrictId);
          let districtData = await axios.get(District + `&divisionId=${selectedWDiv}`, config);
          setWResultOfDistrict(districtData.data.data);
        } else {
          let districtData = await axios.get(District + '?allDistrict=true', config);
          setWResultOfDistrict(districtData.data.data);
        }
      }
    } catch (error) {
      // ("Error", error);
      'Error', error.response;
    }
  };
  // let getEditDistrict = async () => {
  //   try {
  //     if (flag) {
  //       if (division_id) {
  //         let districtData = await axios.get(District + `&divisionId=${division_id}`, config);
  //         setResultOfDistrict(districtData.data.data);
  //       } else {
  //         let districtData = await axios.get(District, config);
  //         setResultOfDistrict(districtData.data.data);
  //       }
  //     }
  //     // else if(flag==false)
  //     // {
  //     //     if(selectedWDiv){
  //     //         let districtData = await axios.get(District + `&divisionId=${selectedWDiv}`, config);
  //     //         setWResultOfDistrict(districtData.data.data);
  //     //         }
  //     //         else{
  //     //         let districtData = await axios.get(District, config);
  //     //         setWResultOfDistrict(districtData.data.data);

  //     // }
  //     // }
  //   } catch (error) {
  //     // ("Error", error);
  //     // ("Error", error.response);
  //   }
  // };

  return (
    <>
      <Grid item md={6} xs={12}>
        {flag ? (
          <TextField
            fullWidth
            label="জেলা"
            name="district"
            onChange={changeDistrict}
            required
            select
            SelectProps={{ native: true }}
            value={district_Id ? district_Id : districtId || district_id}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {resultOfDistrict.map((option) => (
              <option key={option.id} value={option.id}>
                {option.districtNameBangla}
              </option>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            label="জেলা"
            name="wdistrict"
            onChange={wchangeDistrict}
            required
            select
            SelectProps={{ native: true }}
            value={wdistrict_Id ? wdistrict_Id : wdistrictId}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {resultOfWDistrict.map((option) => (
              <option key={option.id} value={option.id}>
                {option.districtNameBangla}
              </option>
            ))}
          </TextField>
        )}
      </Grid>
    </>
  );
};

export default DistrictData;
