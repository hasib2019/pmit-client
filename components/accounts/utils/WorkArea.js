
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { errorHandler } from 'service/errorHandler';
import { CityCorp, District, Division, Union, Upazila } from '../../url/ApiList';
const WorkArea = (props) => {
  let accessToken = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('accessToken')) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const { wallValues } = props;
  const { wdivision, wdistrict, wupazila } = props.wdata;
  let wdiv = wdivision;
  let wdis = wdistrict;
  // let wuni = wunion;
  let wupa = wupazila;
  // let wv = wvill;

  //   ("Village value",v);
  const [wresultOfDivision, setWResultOfDivision] = useState([]);
  const [wdivisionId, setWDivisionId] = useState('');
  const [wresultOfDistrict, setWResultOfDistrict] = useState([]);
  // new district
  const [wresultOfNewDistrict, setWResultOfNewDistrict] = useState([]);
  const [wdistrictId, setWDistrictId] = useState('');
  const [wresultOfUpazila, setWResultOfUpazila] = useState([]);
  //new upazila
  const [wresultOfNewUpazila, setWResultOfNewUpazila] = useState([]);
  const [wupazilaId, setWUpazilaId] = useState('');
  const [wresultOfCitycorp, setWResultOfCitycorp] = useState([]);
  const [wcitycorpId, setWCitycorpId] = useState('');
  const [wresultOfUnion, setWResultOfUnion] = useState([]);
  const [wunionId, setWUnionId] = useState('');
  const [wvillage, setWVillage] = useState('');

  wallValues({
    wdivisionId,
    wdistrictId,
    wupazilaId,
    wcitycorpId,
    wunionId,
    wvillage,
  });

  let wchangeDivision = (e) => {
    setWDivisionId(e.target.value);
    getWDistrict(e.target.value);
  };

  let wchangeDistrict = (e) => {
    setWDistrictId(e.target.value);
    getWUpazila(wdivisionId, e.target.value);
    setWResultOfNewDistrict([]);
  };

  let wchangeUpazila = (e) => {
    setWUpazilaId(e.target.value);
    wcityCop(wdivisionId, wdistrictId, e.target.value);
    getWUnion(wdivisionId, wdistrictId, e.target.value);

    setWResultOfNewUpazila([]);
  };

  let wchangeCitycorp = (e) => {
    setWCitycorpId(e.target.value);
  };

  let wchangeUnion = (e) => {
    setWUnionId(e.target.value);
  };

  let wchangeVillage = (e) => {
    setWVillage(e.target.value);
  };

  useEffect(() => {
    getData();
  }, []);

  let getData = async () => {
    try {
      let divisionData = await axios.get(Division, config);
      setWResultOfDivision(divisionData.data.data);
    } catch (err) {
      errorHandler(err);
    }
  };

  let getWDistrict = async (data) => {
    try {
      let districtData = await axios.get(District + `&divisionId=${data}`, config);
      //   ('DistrictData====>', districtData.data.data);
      setWResultOfDistrict(districtData.data.data);

      // if(divisionId !== "" && districtId !== ""){
      //   getUpazila(divisionId, districtId);
      // }
    } catch (error) {
      errorHandler(error);
    }
  };

  /////////////////////// Get Upazila Start ///////////////////////////

  let getWUpazila = async (data1, data2) => {
    try {
      let upazilaData = await axios.get(Upazila + `&divisionId=${data1}&districtId=${data2}`, config);

      setWResultOfUpazila(upazilaData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  /////////////////////// Get Upazila End ///////////////////////////

  let getWUnion = async (data1, data2, data3) => {
    try {
      let unionData = await axios.get(Union + `&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`, config);

      setWResultOfUnion(unionData.data.data);
    } catch (error) {
      'Error =>', error;
      'Error =>', error.response;
    }
  };

  let wcityCop = async (data1, data2, data3) => {
    try {
      let citycorpData = await axios.get(
        CityCorp + `&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`,
        config,
      );

      setWResultOfCitycorp(citycorpData.data.data);
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
      <Grid container spacing={3} my={0.2}>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="বিভাগ"
            name="wdivision"
            onChange={wchangeDivision}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {wresultOfDivision.map((option) => (
              <option key={option.divisionId} value={option.divisionId} selected={option.divisionId == wdiv}>
                {option.divisionNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="জেলা"
            name="wdistrict"
            onChange={wchangeDistrict}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            {/* selected={option.districtId == dis} */}
            <option>- নির্বাচন করুন -</option>
            {wresultOfDistrict.length > 0
              ? wresultOfDistrict.map((option) => (
                <option key={option.districtId} value={option.districtId}>
                  {option.districtNameBangla}
                </option>
              ))
              : wresultOfNewDistrict.length > 0
                ? wresultOfNewDistrict.map((option) => (
                  <option key={option.districtId} value={option.districtId} selected={option.districtId == wdis}>
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
            name="wupazila"
            onChange={wchangeUpazila}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {wresultOfUpazila.length > 0
              ? wresultOfUpazila.map((option) => (
                <option key={option.upazilaId} value={option.upazilaId}>
                  {option.upazilaNameBangla}
                </option>
              ))
              : wresultOfNewUpazila.length > 0
                ? wresultOfNewUpazila.map((option) => (
                  <option key={option.upazilaId} value={option.upazilaId} selected={option.upazilaId == wupa}>
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
            name="wcityCorp"
            onChange={wchangeCitycorp}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {wresultOfCitycorp.map((option) => (
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
            onChange={wchangeUnion}
            required
            select
            SelectProps={{ native: true }}
            // value={features.position}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {wresultOfUnion.map((option) => (
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
            name="wvillage"
            onChange={wchangeVillage}
            required
            text
            value={wvillage}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          ></TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default WorkArea;
