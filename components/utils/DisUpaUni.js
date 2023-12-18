
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CityCorp, District, Division, Union, Upazila } from '../../url/ApiList';
import { localStorageData } from 'service/common';

const DisUpaUni = (props) => {
  const config = localStorageData('accessToken')
  const { allValues } = props;
  const { division, district, upazila } = props.data;
  let div = division;
  let dis = district;
  let upa = upazila;
  // let v = vill;
  const [resultOfDivision, setResultOfDivision] = useState([]);
  const [divisionId, setDivisionId] = useState('');
  const [resultOfDistrict, setResultOfDistrict] = useState([]);
  // new district
  const [resultOfNewDistrict, setResultOfNewDistrict] = useState([]);
  const [districtId, setDistrictId] = useState('');
  const [resultOfUpazila, setResultOfUpazila] = useState([]);
  //new upazila
  const [resultOfNewUpazila, setResultOfNewUpazila] = useState([]);
  const [upazilaId, setUpazilaId] = useState('');
  const [resultOfCitycorp, setResultOfCitycorp] = useState([]);
  const [citycorpId, setCitycorpId] = useState('');
  const [resultOfUnion, setResultOfUnion] = useState([]);
  const [unionId, setUnionId] = useState('');
  const [village, setVillage] = useState('');

  allValues({
    divisionId,
    districtId,
    upazilaId,
    citycorpId,
    unionId,
    village,
  });
  let changeDivision = (e) => {
    'Selected ==== > ', e.target.value;
    setDivisionId(e.target.value);
    getDistrict(e.target.value);
  };

  let changeDistrict = (e) => {
    setDistrictId(e.target.value);
    getUpazila(divisionId, e.target.value);
    setResultOfNewDistrict([]);
  };

  let changeUpazila = (e) => {
    'Upazila ID==========', e.target.value;
    setUpazilaId(e.target.value);
    cityCop(divisionId, districtId, e.target.value);
    getUnion(divisionId, districtId, e.target.value);

    setResultOfNewUpazila([]);
  };

  let changeCitycorp = (e) => {
    setCitycorpId(e.target.value);
  };

  let changeUnion = (e) => {
    setUnionId(e.target.value);
  };

  let changeVillage = (e) => {
    setVillage(e.target.value);
  };

  // useEffect(() => {
  //   getData();
  //   findDis();
  //   findUpa();
  // }, [divisionId, districtId, upazilaId, citycorpId, unionId]);
  useEffect(() => {
    getData();
  }, []);

  let getData = async () => {
    try {
      let divisionData = await axios.get(Division, config);
      setResultOfDivision(divisionData.data.data);
      'divisionData', divisionData.data.data;

      // let districtData = await axios.get(
      //   District + `&divisionId=${divisionId}`,
      //   config
      // );
      // ('Data', districtData.data.data);
      // setResultOfDistrict(districtData.data.data);

      // // find district id

      // let upazilaData = await axios.get(
      //   Upazila + `&divisionId=${divisionId}&districtId=${districtId}`,
      //   config
      // );

      // setResultOfUpazila(upazilaData.data.data);

      // let citycorpData = await axios.get(
      //   CityCorp +
      //     `&divisionId=${divisionId}&districtId=${districtId}&upazilaId=${upazilaId}`,
      //   config
      // );

      // setResultOfCitycorp(citycorpData.data.data);

      // let unionData = await axios.get(
      //   Union +
      //     `&divisionId=${divisionId}&districtId=${districtId}&upazilaId=${upazilaId}`,
      //   config
      // );

      // setResultOfUnion(unionData.data.data);
    } catch (err) {
      'Error', err;
      'Error', err.response;
    }
  };

  let getDistrict = async (data) => {
    try {
      let districtData = await axios.get(District + `&divisionId=${data}`, config);
      'DistrictData====>', districtData.data.data;
      setResultOfDistrict(districtData.data.data);

      // if(divisionId !== "" && districtId !== ""){
      //   getUpazila(divisionId, districtId);
      // }
    } catch (error) {
      'Error', error;
      'Error', error.response;
    }
  };

  /////////////////////// Get Upazila Start ///////////////////////////

  let getUpazila = async (data1, data2) => {
    try {
      let upazilaData = await axios.get(Upazila + `&divisionId=${data1}&districtId=${data2}`, config);

      setResultOfUpazila(upazilaData.data.data);

      'UpazilaData====>', upazilaData.data.data;
    } catch (error) {
      'Error =>', error;
      'Error =>', error.response;
    }
  };
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

  let cityCop = async (data1, data2, data3) => {
    try {
      let citycorpData = await axios.get(
        CityCorp + `&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`,
        config,
      );

      setResultOfCitycorp(citycorpData.data.data);
    } catch (error) {
      'Error =>', error;
      'Error =>', error.response;
    }
  };

  // const findDis = async () => {
  //   if (div) {
  //     let districtData = await axios.get(District + '&divisionId=' + div, config);
  //     'dis Data', districtData.data.data;
  //     setResultOfNewDistrict(districtData.data.data);
  //     setVillage(v);
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
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="বিভাগ"
            name="division"
            onChange={changeDivision}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfDivision.map((option) => (
              <option key={option.divisionId} value={option.divisionId} selected={option.divisionId == div}>
                {option.divisionNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="জেলা"
            name="district"
            onChange={changeDistrict}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            {/* selected={option.districtId == dis} */}
            <option>- নির্বাচন করুন -</option>
            {resultOfDistrict.length > 0
              ? resultOfDistrict.map((option) => (
                <option key={option.districtId} value={option.districtId}>
                  {option.districtNameBangla}
                </option>
              ))
              : resultOfNewDistrict.length > 0
                ? resultOfNewDistrict.map((option) => (
                  <option key={option.districtId} value={option.districtId} selected={option.districtId == dis}>
                    {option.districtNameBangla}
                  </option>
                ))
                : ''}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="উপজেলা/থানা"
            name="upazila"
            onChange={changeUpazila}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfUpazila.length > 0
              ? resultOfUpazila.map((option) => (
                <option key={option.upazilaId} value={option.upazilaId}>
                  {option.upazilaNameBangla}
                </option>
              ))
              : resultOfNewUpazila.length > 0
                ? resultOfNewUpazila.map((option) => (
                  <option key={option.upazilaId} value={option.upazilaId} selected={option.upazilaId == upa}>
                    {option.upazilaNameBangla}
                  </option>
                ))
                : ''}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="সিটি-কর্পোরেশন/পৌরসভা"
            name="cityCorp"
            onChange={changeCitycorp}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfCitycorp.map((option) => (
              <option key={option.citycorpId} value={option.citycorpId}>
                {option.cityCorpNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="ইউনিয়ন/ওয়ার্ড"
            name="union"
            onChange={changeUnion}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {resultOfUnion.map((option) => (
              <option key={option.unionId} value={option.unionId}>
                {option.unionNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন"
            name="village"
            onChange={changeVillage}
            required
            text
            value={village}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          ></TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default DisUpaUni;
