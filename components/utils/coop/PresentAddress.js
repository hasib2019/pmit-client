
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { geoData } from '../../../url/coop/ApiList';
import { errorHandler } from 'service/errorHandler';

const PresentAddress = (props) => {
  let token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { pallValues } = props;
  const { pdivision, pdistrict, pupazila, pvill } = props.pdata;
  // const [presultOfDivision, setPResultOfDivision] = useState([]);
  const [pdivisionId] = useState('');
  const [presultOfDistrict, setPResultOfDistrict] = useState([]);
  // new district
  const [presultOfNewDistrict] = useState([]);
  const [pdistrictId, setPDistrictId] = useState('');
  const [presultOfUpazila, setPResultOfUpazila] = useState([]);
  //new upazila
  // const [presultOfNewUpazila, setPResultOfNewUpazila] = useState([]);
  const [pupazilaId, setPUpazilaId] = useState('');
  const [newUpaId, setNewUpaId] = useState('');
  const [newUpaType, setNewUpaType] = useState('');
  // const [presultOfCitycorp, setPResultOfCitycorp] = useState([]);
  // const [pcityCorpId, setPCityCorpId] = useState('');
  const [presultOfUnion, setPResultOfUnion] = useState([]);
  // const [punionId, setPUnionId] = useState('');
  const [newUnionId, setNewUnionId] = useState('');
  const [newUnionType, setNewUnionType] = useState('');
  const [pvillage, setPVillage] = useState('');

  pallValues({
    pdistrictId,
    newUpaId,
    newUpaType,
    newUnionId,
    newUnionType,
    pvillage,
  });

  // let pchangeDivision = (e) => {
  //   setPDivisionId(e.target.value);
  // };

  let pchangeDistrict = (e) => {
    setPDistrictId(e.target.value);
  };

  let pchangeUpazila = (e) => {
    let data = JSON.parse(e.target.value);
    setPUpazilaId(e.target.value);
    setNewUpaId(data.upaCityId);
    setNewUpaType(data.upaCityType);
  };

  let pchangeUnion = (e) => {
    let data = JSON.parse(e.target.value);
    // setPUnionId(e.target.value);
    // setPUnionId(e.target.value);
    setNewUnionId(data.uniThanaPawId);
    setNewUnionType(data.uniThanaPawType);
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
      // let divisionData = await axios.get(geoData + 'division', config);
      // setPResultOfDivision(divisionData.data.data);
      let districtData = await axios.get(geoData + 'district', config);
      setPResultOfDistrict(districtData.data.data);
      let upazilaData = await axios.get(geoData + 'upa-city', config);
      setPResultOfUpazila(upazilaData.data.data);
      let unionData = await axios.get(geoData + 'uni-thana-paurasabha', config);
      setPResultOfUnion(unionData.data.data);
    } catch (err) { 
      errorHandler(err)
    }
  };
  let getData = async () => {
    try {
      if (pdivisionId != '' || pdistrictId != '') {
        if (pdivisionId != '') {
          let districtData = await axios.get(geoData + `district&divisionId=${pdivisionId}`, config);
          setPResultOfDistrict(districtData.data.data);
        }
      }
      if (pdivisionId != '' || pdistrictId != '') {
        if (pdivisionId != '' && pdistrictId != '') {
          let upazilaData = await axios.get(
            geoData + `upa-city&divisionId=${pdivisionId}&districtId=${pdistrictId}`,
            config,
          );
          setPResultOfUpazila(upazilaData.data.data);
        } else if (pdistrictId != '') {
          let upazilaData = await axios.get(geoData + `upa-city&districtId=${pdistrictId}`, config);
          setPResultOfUpazila(upazilaData.data.data);
        }
      }

      if (pdistrictId != '' || pdivisionId != '') {
        if (pdistrictId != '' && pdivisionId != '') {
          let unionData = await axios.get(
            geoData + `uni-thana-paurasabha&districtId=${pdistrictId}&upazilaId=${pdivisionId}`,
            config,
          );
          setPResultOfUnion(unionData.data.data);
        } else if (pdistrictId != '') {
          let unionData = await axios.get(geoData + `uni-thana-paurasabha&districtId=${pdistrictId}`, config);
          setPResultOfUnion(unionData.data.data);
        }
      }
    } catch (err) { 
      errorHandler(err)
    }
  };
  let getEditData = async () => {
    try {
      if (pdivision != '') {
        let districtData = await axios.get(geoData + `district&divisionId=${pdivision}`, config);
        setPResultOfDistrict(districtData.data.data);
      }
      if (pdivision != '' || pdistrict != '') {
        if (pdivision != '' && pdistrict != '') {
          let upazilaData = await axios.get(
            geoData + `upa-city&divisionId=${pdivision}&districtId=${pdistrict}`,
            config,
          );
          setPResultOfUpazila(upazilaData.data.data);
        } else if (pdistrict != '') {
          let upazilaData = await axios.get(geoData + `upa-city&districtId=${pdistrict}`, config);
          setPResultOfUpazila(upazilaData.data.data);
        }
      }
      if (pdistrict != '' || pupazila != '') {
        if (pdistrict != '' && pupazila != '') {
          let unionData = await axios.get(
            geoData + `uni-thana-paurasabha&districtId=${pdistrict}&upazilaId=${pupazila}`,
            config,
          );
          setPResultOfUnion(unionData.data.data);
        } else if (pdistrict != '') {
          let unionData = await axios.get(geoData + `uni-thana-paurasabha&upazilaId=${pdistrict}`, config);
          setPResultOfUnion(unionData.data.data);
        }
      }
    } catch (err) { 
      errorHandler(err)
    }
  };

  // let getPDistrict = async (data) => {
  //   try {
  //     let districtData = await axios.get(geoData + `district&divisionId=${data}`, config);
  //     setPResultOfDistrict(districtData.data.data);

  //     // if(divisionId !== "" && districtId !== ""){
  //     //   getUpazila(divisionId, districtId);
  //     // }
  //   } catch (error) { }
  // };

  /////////////////////// Get Upazila Start ///////////////////////////

  // let getPUpazila = async (data1, data2) => {
  //   try {
  //     let upazilaData = await axios.get(geoData + `upazila&divisionId=${data1}&districtId=${data2}`, config);

  //     setPResultOfUpazila(upazilaData.data.data);
  //   } catch (error) { }
  // };
  /////////////////////// Get Upazila End ///////////////////////////

  // let getPUnion = async (data1, data2, data3) => {
  //   try {
  //     let unionData = await axios.get(
  //       geoData + `union&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`,
  //       config,
  //     );

  //     setPResultOfUnion(unionData.data.data);
  //   } catch (error) { }
  // };

  // let pcityCop = async (data1, data2, data3) => {
  //   try {
  //     let citycorpData = await axios.get(
  //       geoData + `cityCorp&divisionId=${data1}&districtId=${data2}&upazilaId=${data3}`,
  //       config,
  //     );

  //     setPResultOfCitycorp(citycorpData.data.data);
  //   } catch (error) {
  //     errorHandler(error)
  //    }
  // };

  // const findDis = async () => {
  //   if (pdiv) {
  //     let districtData = await axios.get(geoData + 'district&divisionId=' + pdiv, config);
  //     setPResultOfNewDistrict(districtData.data.data);
  //     setPVillage(v);
  //   }
  // };
  // const findUpa = async () => {
  //   if (pdis && pdiv) {
  //     let upazilaData = await axios.get(geoData + `upazila&divisionId=${pdiv}&districtId=${pdis}`, config);
  //     setPResultOfNewUpazila(upazilaData.data.data);
  //   }
  // };

  return (
    <>
      <Grid container spacing={1.6}>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            fullWidth
            label="জেলা"
            name="pdistrict"
            onChange={pchangeDistrict}
            required
            select
            SelectProps={{ native: true }}
            // value={pdistrictId?pdistrictId:pdistrict}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            {/* selected={option.districtId == dis} */}
            <option>- নির্বাচন করুন -</option>
            {presultOfDistrict.length > 0
              ? presultOfDistrict.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))
              : presultOfNewDistrict.length > 0
                ? presultOfNewDistrict.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.districtNameBangla}
                  </option>
                ))
                : ''}
          </TextField>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            fullWidth
            label="উপজেলা/সিটি-কর্পোরেশন"
            name="pupazila"
            onChange={pchangeUpazila}
            required
            select
            SelectProps={{ native: true }}
            // value={pupazilaId?pupazilaId:pupazila}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {presultOfUpazila.map((option) => (
              <option
                key={option.id}
                value={JSON.stringify({
                  upaCityId: option.upaCityId,
                  upaCityType: option.upaCityType,
                })}
              >
                {option.upaCityNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item lg={6} md={6} xs={12}>
          <TextField
            fullWidth
            label="ইউনিয়ন/পৌরসভা/থানা"
            name="punion"
            onChange={pchangeUnion}
            required
            select
            SelectProps={{ native: true }}
            // value={punion?punion:punionId}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option>- নির্বাচন করুন -</option>
            {presultOfUnion.map((option) => (
              <option
                key={option.id}
                value={JSON.stringify({
                  uniThanaPawId: option.uniThanaPawId,
                  uniThanaPawType: option.uniThanaPawType,
                })}
              >
                {option.uniThanaPawNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            fullWidth
            placeholder="বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন"
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
