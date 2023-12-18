
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { CityCorp, District, Division, Union, Upazila } from '../../url/ApiList';
const PresentAddress = (props) => {
  const config = localStorageData('config');
  const { pallValues } = props;
  const { pdivision, pdistrict, pupazila, punion, pcityCorp, pvill } = props.pdata;
  const [presultOfDivision, setPResultOfDivision] = useState([]);
  const [pdivisionId, setPDivisionId] = useState('');
  const [presultOfDistrict, setPResultOfDistrict] = useState([]);
  // new district
  const [presultOfNewDistrict] = useState([]);
  const [pdistrictId, setPDistrictId] = useState('');
  const [presultOfUpazila, setPResultOfUpazila] = useState([]);
  //new upazila
  const [presultOfNewUpazila] = useState([]);
  const [pupazilaId, setPUpazilaId] = useState('');
  const [presultOfCitycorp, setPResultOfCitycorp] = useState([]);
  const [pcityCorpId, setPCityCorpId] = useState('');
  const [presultOfUnion, setPResultOfUnion] = useState([]);
  const [punionId, setPUnionId] = useState('');
  const [pvillage, setPVillage] = useState('');

  pallValues({
    pdivisionId,
    pdistrictId,
    pupazilaId,
    pcityCorpId,
    punionId,
    pvillage,
  });

  let pchangeDivision = (e) => {
    setPDivisionId(e.target.value);
  };

  let pchangeDistrict = (e) => {
    setPDistrictId(e.target.value);
  };

  let pchangeUpazila = (e) => {
    setPUpazilaId(e.target.value);
  };

  let pchangeCitycorp = (e) => {
    setPCityCorpId(e.target.value);
  };

  let pchangeUnion = (e) => {
    setPUnionId(e.target.value);
  };

  let pchangeVillage = (e) => {
    setPVillage(e.target.value);
  };

  useEffect(() => {
    getInitialData();
  }, []);
  useEffect(() => {
    getData();
  }, [pdivisionId, pdistrictId, pupazilaId]);
  useEffect(() => {
    getEditData();
  }, [pdivision, pdistrict, pupazila]);
  let getInitialData = async () => {
    try {
      let divisionData = await axios.get(Division, config);
      setPResultOfDivision(divisionData.data.data);
      let districtData = await axios.get(District, config);
      setPResultOfDistrict(districtData.data.data);
      let upazilaData = await axios.get(Upazila, config);
      setPResultOfUpazila(upazilaData.data.data);
      let citycorpData = await axios.get(CityCorp, config);
      setPResultOfCitycorp(citycorpData.data.data);
      let unionData = await axios.get(Union, config);
      setPResultOfUnion(unionData.data.data);
    } catch (err) {
      'Error', err;
      'Error', err.response;
    }
  };
  let getData = async () => {
    try {
      if (pdivisionId != '' || pdistrictId != '') {
        if (pdivisionId != '') {
          let districtData = await axios.get(District + `&divisionId=${pdivisionId}`, config);
          setPResultOfDistrict(districtData.data.data);
        }
      }
      if (pdivisionId != '' || pdistrictId != '') {
        if (pdivisionId != '' && pdistrictId != '') {
          let upazilaData = await axios.get(Upazila + `&divisionId=${pdivisionId}&districtId=${pdistrictId}`, config);
          setPResultOfUpazila(upazilaData.data.data);
        } else if (pdistrictId != '') {
          let upazilaData = await axios.get(Upazila + `&districtId=${pdistrictId}`, config);
          setPResultOfUpazila(upazilaData.data.data);
        }
      }
      if (pdivisionId != '' || pdistrictId != '') {
        if (pdivisionId != '' && pdistrictId != '') {
          let citycorpData = await axios.get(CityCorp + `&divisionId=${pdivisionId}&districtId=${pdistrictId}`, config);
          setPResultOfCitycorp(citycorpData.data.data);
        } else if (pdistrictId != '') {
          let citycorpData = await axios.get(CityCorp + `&districtId=${pdistrictId}`, config);
          setPResultOfCitycorp(citycorpData.data.data);
        }
      }
      if (pdistrictId != '' || pupazilaId != '') {
        if (pdistrictId != '' && pupazilaId != '') {
          let unionData = await axios.get(Union + `&districtId=${pdistrictId}&upazilaId=${pupazilaId}`, config);
          setPResultOfUnion(unionData.data.data);
        } else if (pupazilaId != '') {
          let unionData = await axios.get(Union + `&upazilaId=${pupazilaId}`, config);
          setPResultOfUnion(unionData.data.data);
        }
      }
    } catch (err) {
      errorHandler(err);
    }
  };
  let getEditData = async () => {
    try {
      if (pdivision != '') {
        let districtData = await axios.get(District + `&divisionId=${pdivision}`, config);
        setPResultOfDistrict(districtData.data.data);
      }
      if (pdivision != '' || pdistrict != '') {
        if (pdivision != '' && pdistrict != '') {
          let upazilaData = await axios.get(Upazila + `&divisionId=${pdivision}&districtId=${pdistrict}`, config);
          setPResultOfUpazila(upazilaData.data.data);
        } else if (pdistrict != '') {
          let upazilaData = await axios.get(Upazila + `&districtId=${pdistrict}`, config);
          setPResultOfUpazila(upazilaData.data.data);
        }
      }
      if (pdivision != '' || pdistrict != '') {
        if (pdivision != '' && pdistrict != '') {
          let citycorpData = await axios.get(CityCorp + `&divisionId=${pdivision}&districtId=${pdistrict}`, config);
          setPResultOfCitycorp(citycorpData.data.data);
        } else if (pdistrict != '') {
          let citycorpData = await axios.get(CityCorp + `&districtId=${pdistrict}`, config);
          setPResultOfCitycorp(citycorpData.data.data);
        }
      }
      if (pdistrict != '' || pupazila != '') {
        if (pdistrict != '' && pupazila != '') {
          let unionData = await axios.get(Union + `&districtId=${pdistrict}&upazilaId=${pupazila}`, config);
          setPResultOfUnion(unionData.data.data);
        } else if (pupazila != '') {
          let unionData = await axios.get(Union + `&upazilaId=${pupazila}`, config);
          setPResultOfUnion(unionData.data.data);
        }
      }
    } catch (err) {
      'Error', err;
      'Error', err.response;
    }
  };

  // let getPDistrict = async (data) => {
  //   try {
  //     let districtData = await axios.get(District + `&divisionId=${data}`, config);
  //     //   ('DistrictData====>', districtData.data.data);
  //     setPResultOfDistrict(districtData.data.data);

  //     // if(divisionId !== "" && districtId !== ""){
  //     //   getUpazila(divisionId, districtId);
  //     // }
  //   } catch (error) {
  //     'Error', error;
  //     'Error', error.response;
  //   }
  // };

  /////////////////////// Get Upazila Start ///////////////////////////

  // let getPUpazila = async (data1, data2) => {
  //   try {
  //     let upazilaData = await axios.get(Upazila + `&divisionId=${data1}&districtId=${data2}`, config);

  //     setPResultOfUpazila(upazilaData.data.data);
  //   } catch (error) {
  //     'Error =>', error;
  //     'Error =>', error.response;
  //   }
  // };
  /////////////////////// Get Upazila End ///////////////////////////

  // let getPUnion = async (data1, data2, data3) => {
  //   try {
  //     let unionData = await axios.get(Union + `&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`, config);

  //     setPResultOfUnion(unionData.data.data);
  //   } catch (error) {
  //     'Error =>', error;
  //     'Error =>', error.response;
  //   }
  // };

  // let pcityCop = async (data1, data2, data3) => {
  //   try {
  //     let citycorpData = await axios.get(
  //       CityCorp + `&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`,
  //       config,
  //     );

  //     setPResultOfCitycorp(citycorpData.data.data);
  //   } catch (error) {
  //     'Error =>', error;
  //     'Error =>', error.response;
  //   }
  // };

  // const findDis = async () => {
  //   if (pdiv) {
  //     let districtData = await axios.get(District + '&divisionId=' + pdiv, config);
  //     'dis Data', districtData.data.data;
  //     setPResultOfNewDistrict(districtData.data.data);
  //     setPVillage(v);
  //   }
  // };
  // const findUpa = async () => {
  //   if (pdis && pdiv) {
  //     let upazilaData = await axios.get(Upazila + `&divisionId=${pdiv}&districtId=${pdis}`, config);
  //     'Upazila Data', upazilaData.data.data;
  //     setPResultOfNewUpazila(upazilaData.data.data);
  //   }
  // };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="বিভাগ"
            name="pdivision"
            onChange={pchangeDivision}
            required
            select
            SelectProps={{ native: true }}
            value={pdivision ? pdivision : pdivisionId}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {presultOfDivision.map((option) => (
              <option key={option.divisionId} value={option.divisionId}>
                {option.divisionNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="জেলা"
            name="pdistrict"
            onChange={pchangeDistrict}
            required
            select
            SelectProps={{ native: true }}
            value={pdistrict ? pdistrict : pdistrictId}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            {/* selected={option.districtId == dis} */}
            <option>- নির্বাচন করুন -</option>
            {presultOfDistrict.length > 0
              ? presultOfDistrict.map((option) => (
                <option key={option.districtId} value={option.districtId}>
                  {option.districtNameBangla}
                </option>
              ))
              : presultOfNewDistrict.length > 0
                ? presultOfNewDistrict.map((option) => (
                  <option key={option.districtId} value={option.districtId}>
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
            name="pupazila"
            onChange={pchangeUpazila}
            required
            select
            SelectProps={{ native: true }}
            value={pupazila ? pupazila : pupazilaId}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {presultOfUpazila.length > 0
              ? presultOfUpazila.map((option) => (
                <option key={option.upazilaId} value={option.upazilaId}>
                  {option.upazilaNameBangla}
                </option>
              ))
              : presultOfNewUpazila.length > 0
                ? presultOfNewUpazila.map((option) => (
                  <option key={option.upazilaId} value={option.upazilaId}>
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
            name="pcityCorp"
            onChange={pchangeCitycorp}
            required
            select
            SelectProps={{ native: true }}
            value={pcityCorp ? pcityCorp : pcityCorpId}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {presultOfCitycorp.map((option) => (
              <option key={option.citycorpId} value={option.cityCorpId}>
                {option.cityCorpNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="ইউনিয়ন/ওয়ার্ড"
            name="punion"
            onChange={pchangeUnion}
            required
            select
            SelectProps={{ native: true }}
            value={punion ? punion : punionId}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {presultOfUnion.map((option) => (
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
            name="pvillage"
            onChange={pchangeVillage}
            required
            text
            value={pvill ? pvill : pvillage}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          ></TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default PresentAddress;
