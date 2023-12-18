
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { District, Union, Upazila } from '../../url/ApiList';
const LoanPre = (props) => {
  const config = localStorageData("accessToken")
  // const { allValues } = props;
  const { district, upazila, union, postOffice, village, wardNo, houseNo } = props.data;
  // ("Village value",v);
  const [districtId, setDistrictId] = useState('');
  // const [upazilaId, setUpazilaId] = useState('');
  // const [unionId, setUnionId] = useState('');
  const [resultOfDistrict, setResultOfDistrict] = useState([]);
  const [resultOfUpazila, setResultOfUpazila] = useState([]);
  // const [cityCorpId, setCityCorpId] = useState('');
  const [resultOfUnion, setResultOfUnion] = useState([]);

  //  ("Props Data",postOffice,village,wardNo);
  let changeDistrict = (e) => {
    setDistrictId(e.target.value);
    // getUpazila(e.target.value);
  };

  let changeUpazila = (e) => {
    // ("Upazila ID==========",e.target.value);
    // setUpazilaId(e.target.value);
    // cityCop(divisionId, districtId,e.target.value);
    getUnion(districtId, e.target.value);
  };
  let changeUnion = () => {
    // setUnionId(e.target.value);
  };
  // useEffect(() => {
  //   getData();
  //   findDis();
  //   findUpa();
  // }, [divisionId, districtId, upazilaId, citycorpId, unionId]);
  useEffect(() => {
    getData3();
  }, [district, upazila]);

  //   useEffect(() => {
  //     findDis();
  //   }, []);
  let getData3 = async () => {
    try {
      let districtData = await axios.get(District + '?allDistrict=true', config);
      setResultOfDistrict(districtData.data.data);
      if (district != '') {
        let upazilaData = await axios.get(Upazila + `?district=${district}`, config);
        setResultOfUpazila(upazilaData.data.data);
      }
      // if (district != "" || upazila != "") {
      //   if (district != "" && upazila != "") {
      //     let unionData = await axios.get(
      //       Union + `&districtId=${district}&upazilaId=${upazila}`,
      //       config
      //     );
      //     setResultOfUnion(unionData.data.data);
      //   } else if (upazila != "") {
      if (upazila != '') {
        let unionData = await axios.get(Union + `?upazila=${upazila}`, config);
        setResultOfUnion(unionData.data.data);
      }
    } catch (err) {
      'Error', err;
      'Error', err.response;
    }
  };

  // let getDistrict = async (data) => {
  //   try {
  //     let districtData = await axios.get(District + `&divisionId=${data}`, config);
  //     'DistrictData====>', districtData.data.data;
  //     setResultOfDistrict(districtData.data.data);

  //     // if(divisionId !== "" && districtId !== ""){
  //     //   getUpazila(divisionId, districtId);
  //     // }
  //   } catch (error) {
  //     'Error', error;
  //     'Error', error.response;
  //   }
  // };

  /////////////////////// Get Upazila Start ///////////////////////////

  // let getUpazila = async (data1, data2) => {
  //   try {
  //     let upazilaData = await axios.get(Upazila + `&divisionId=${data1}&districtId=${data2}`, config);

  //     setResultOfUpazila(upazilaData.data.data);

  //     'UpazilaData====>', upazilaData.data.data;
  //   } catch (error) {
  //     'Error =>', error;
  //     'Error =>', error.response;
  //   }
  // };
  /////////////////////// Get Upazila End ///////////////////////////

  let getUnion = async (data1, data2, data3) => {
    try {
      let unionData = await axios.get(Union + `&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`, config);

      setResultOfUnion(unionData.data.data);
    } catch (error) {
      'Error =>', error;
      'Error =>', error.response;
    }
  };

  // let cityCop = async (data1, data2, data3) => {
  //   try {
  //     let citycorpData = await axios.get(
  //       CityCorp + `&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`,
  //       config,
  //     );

  //     setResultOfCitycorp(citycorpData.data.data);
  //   } catch (error) {
  //     'Error =>', error;
  //     'Error =>', error.response;
  //   }
  // };

  // const findDis = async () => {
  //   if (div) {
  //     let districtData = await axios.get(District + '&divisionId=' + div, config);
  //     'dis Data', districtData.data.data;
  //     setResultOfNewDistrict(districtData.data.data);
  //     // setVillage(v);
  //   }
  // };
  // const findUpa = async () => {
  //   if (dis && div) {
  //     let upazilaData = await axios.get(Upazila + `&divisionId=${div}&districtId=${dis}`, config);
  //     'Upazila Data', upazilaData.data.data;
  //     setResultOfNewUpazila(upazilaData.data.data);
  //   }
  // };

  return (
    <>
      <Grid container spacing={1.8}>
        <Grid item md={6} xs={12}>
          <TextField
            disabled
            fullWidth
            label="জেলা"
            name="district"
            onChange={changeDistrict}
            required
            select
            SelectProps={{ native: true }}
            value={district}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfDistrict.length > 0
              ? resultOfDistrict.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))
              : ''}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled
            fullWidth
            label="উপজেলা/থানা"
            name="upazila"
            onChange={changeUpazila}
            select
            SelectProps={{ native: true }}
            value={upazila}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfUpazila.length > 0
              ? resultOfUpazila.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.upazilaNameBangla}
                </option>
              ))
              : ''}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled
            fullWidth
            label="ইউনিয়ন/ওয়ার্ড"
            name="union"
            onChange={changeUnion}
            required
            select
            SelectProps={{ native: true }}
            value={union}
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
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            disabled
            label="পোষ্ট অফিস"
            name="postOffice"
            //   onChange={handleChange}
            value={postOffice}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            disabled
            label="গ্রাম"
            name="village"
            //   onChange={handleChange}
            value={village}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            disabled
            label="ওয়ার্ড নং"
            name="wardNo"
            //   onChange={handleChange}
            value={wardNo}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            disabled
            label="বাড়ী নং"
            name="houseNo"
            //   onChange={handleChange}
            value={houseNo}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          ></TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default LoanPre;
