
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CityCorp } from '../../url/ApiList';
const CityCorpData = (props) => {
  let accessToken = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('accessToken')) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const { allreplica } = props;
  const { allCityCorpData } = props;
  const { childWCityCorp } = props;
  const { childCityCorp } = props;
  // const { childPass } = props;

  const { selectedDis, selectedDiv, selectedWDiv, selectedWDis } = props;
  const { flag } = props;
  const [resultOfCityCorp, setResultOfCityCorp] = useState([]);
  const [resultOfWCityCorp, setResultOfWCityCorp] = useState([]);
  const [cityCorpId, setCityCorpId] = useState('');
  const [wcityCorpId, setWCityCorpId] = useState('');
  // new district

  allCityCorpData({
    cityCorpId,
    wcityCorpId,
  });

  let changeCityCorp = (e) => {
    setCityCorpId(e.target.value);
  };
  let wchangeCityCorp = (e) => {
    setWCityCorpId(e.target.value);
  };
  useEffect(() => {
    getCityCorp();
    // getEditCityCorp();
  }, [selectedDis, selectedDiv, selectedWDiv, selectedWDis]);

  let getCityCorp = async () => {
    try {
      if (flag) {
        if (selectedDis && selectedDiv) {
          let cityCorpData = await axios.get(CityCorp + `&divisionId=${selectedDiv}&districtId=${selectedDis}`, config);
          setResultOfCityCorp(cityCorpData.data.data);
        } else if (selectedDis) {
          let cityCorpData = await axios.get(CityCorp + `&districtId=${selectedDis}`, config);
          setResultOfCityCorp(cityCorpData.data.data);
        } else {
          let cityCorpData = await axios.get(CityCorp, config);
          setResultOfCityCorp(cityCorpData.data.data);
        }
      } else {
        if (selectedWDis && selectedWDiv) {
          let cityCorpData = await axios.get(
            CityCorp + `&divisionId=${selectedWDiv}&districtId=${selectedWDis}`,
            config,
          );
          setResultOfWCityCorp(cityCorpData.data.data);
        } else if (selectedWDis) {
          let cityCorpData = await axios.get(CityCorp + `&districtId=${selectedWDis}`, config);
          setResultOfWCityCorp(cityCorpData.data.data);
        } else {
          let cityCorpData = await axios.get(CityCorp, config);
          setResultOfWCityCorp(cityCorpData.data.data);
        }
      }
      // if(divisionId !== "" && districtId !== ""){
      //   getUpazila(divisionId, districtId);
      // }
    } catch (error) {
      // ("Error", error);
      // ("Error", error.response);
    }
  };
  // let getEditCityCorp = async () => {
  //   try {
  //     if (division_id && district_id) {
  //       let cityCorpData = await axios.get(CityCorp + `&divisionId=${division_id}&districtId=${district_id}`, config);
  //       setResultOfCityCorp(cityCorpData.data.data);
  //     } else if (district_id) {
  //       let cityCorpData = await axios.get(CityCorp + `&districtId=${district_id}`, config);
  //       setResultOfCityCorp(cityCorpData.data.data);
  //     }
  //   } catch (error) {
  //     // ("Error", error);
  //     // ("Error", error.response);
  //   }
  // };
  let wcityCorp_Id = childWCityCorp ? childWCityCorp : '';
  var cityCorp_Id = childCityCorp ? childCityCorp : '';
  // var cityCorp_Id=childPass?childPass.cityCorpId:"";
  return (
    <>
      <Grid item md={allreplica == 6 ? 2 : 4} xs={12}>
        {flag ? (
          <TextField
            fullWidth
            label="সিটি-কর্পোরেশন/পৌরসভা"
            name="cityCorp"
            onChange={changeCityCorp}
            required
            select
            SelectProps={{ native: true }}
            value={cityCorp_Id ? cityCorp_Id : cityCorpId}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfCityCorp.map((option) => (
              <option key={option.cityCorpId} value={option.cityCorpId}>
                {option.cityCorpNameBangla}
              </option>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            label="সিটি-কর্পোরেশন/পৌরসভা"
            name="wcityCorp"
            onChange={wchangeCityCorp}
            required
            select
            SelectProps={{ native: true }}
            value={wcityCorp_Id ? wcityCorp_Id : wcityCorpId}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfWCityCorp.map((option) => (
              <option key={option.cityCorpId} value={option.cityCorpId}>
                {option.cityCorpNameBangla}
              </option>
            ))}
          </TextField>
        )}
      </Grid>
    </>
  );
};

export default CityCorpData;
