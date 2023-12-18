
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/28 10:13:48
 * @modify date 2022/07/28 10:13:48
 * @desc [description]
 */
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { memo, useEffect, useState } from 'react';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { geoData } from '../../../url/coop/ApiList';

const GetGeoData = ({
  labelName,
  name,
  caseCadingName,
  onChange,
  value,
  isCasCading,
  casCadingValue,
  showMuiltiple,
  casCadingValueDis,
  xl,
  lg,
  md,
  xs,
  isDisabled,
  customClass,
  customStyle,
  errorMessage,
  isFilter,
}) => {
  const token = localStorageData('token');
  const config = localStorageData('config');
  const userData = tokenData(token);
  const [geoAllData, setGeoAllData] = useState([]);
  useEffect(() => {
    allgeoData(caseCadingName);
  }, [casCadingValue]);

  const allgeoData = async (caseCadingName) => {
    try {
      if (caseCadingName == 'division') {
        if (isFilter) {
          let divisionAllData = await axios.get(geoData + caseCadingName, config);
          let onlinePermittedDoptors = divisionAllData?.data?.data.filter(
            (elem) => elem?.rules?.onlinePermittedDoptor[0] == userData.doptorId,
          );
          setGeoAllData(onlinePermittedDoptors);
        } else {
          const data = await axios.get(geoData + caseCadingName);
          setGeoAllData(data.data.data);
        }
      } else if (caseCadingName == 'district') {
        ////////////////////////////////////////////////////////////////
        if (isCasCading) {
          if (casCadingValue != 0) {
            if (isFilter) {
              let data = await axios.get(geoData + `district&divisionId=${casCadingValue}`, config);
              let onlinePermittedDoptors = data?.data?.data.filter(
                (elem) => elem?.rules?.onlinePermittedDoptor[0] == 3,
              );
              setGeoAllData(onlinePermittedDoptors);
            } else {
              const districtData = await axios.get(geoData + `district&divisionId=${casCadingValue}`);
              setGeoAllData(districtData.data.data);
            }
          } else {
            setGeoAllData([]);
          }
        } else {
          const districtData = await axios.get(geoData + `district`);
          setGeoAllData(districtData.data.data);
        }
        //////////////////////////////////////////////////////////////
      } else if (caseCadingName == 'upazila') {
        ///////////////////////////////////////////////////////////////////
        if (isCasCading) {
          if (casCadingValue) {
            const upazilaData = await axios.get(geoData + `upa-city&districtId=${casCadingValue}`);
            setGeoAllData(upazilaData.data.data);
          }
        } else {
          const upazilaData = await axios.get(geoData + `upa-city`);
          setGeoAllData(upazilaData.data.data);
        }
        //////////////////////////////////////////////////////////////////
      } else if (caseCadingName == 'union') {
        /////////////////////////////////////////////////////////////////////
        if (isCasCading) {
          if (casCadingValue.upaCityId) {
            const unionData = await axios.get(
              geoData +
              `uni-thana-paurasabha&districtId=${casCadingValueDis}&upaCityId=${casCadingValue.upaCityId}&upaCityType=${casCadingValue.upaCityType}`,
            );
            setGeoAllData(unionData.data.data);
          }
        } else {
          const unionData = await axios.get(geoData + `uni-thana-paurasabha`);
          setGeoAllData(unionData.data.data);
        }
        /////////////////////////////////////////////////////////////////
      }
    } catch (error) {
      errorHandler();
    }
  };

  return (
    <>
      <Grid item xl={xl} lg={lg} md={md} xs={xs}>
        <TextField
          fullWidth
          disabled={isDisabled}
          className={customClass}
          label={labelName}
          name={name}
          onChange={onChange}
          select
          SelectProps={{ native: true }}
          value={caseCadingName == 'upazila' || caseCadingName == 'union' ? showMuiltiple || 0 : value | 0}
          variant="outlined"
          size="small"
          sx={customStyle}
          error={errorMessage ? true : false}
          helperText={errorMessage}
        >
          <option value={0}>- নির্বাচন করুন -</option>
          {caseCadingName == 'upazila'
            ? geoAllData.map((option, i) => (
              <option
                key={i}
                value={JSON.stringify({
                  upaCityId: option.upaCityId,
                  upaCityType: option.upaCityType,
                })}
              >
                {option.upaCityNameBangla}
              </option>
            ))
            : caseCadingName == 'union'
              ? geoAllData.map((option, i) => (
                <option
                  key={i}
                  value={JSON.stringify({
                    uniThanaPawId: option.uniThanaPawId,
                    uniThanaPawType: option.uniThanaPawType,
                  })}
                >
                  {option.uniThanaPawNameBangla}
                </option>
              ))
              : geoAllData.map((option, i) => (
                <option key={i} value={option.id}>
                  {option.divisionNameBangla || option.districtNameBangla}
                </option>
              ))}
        </TextField>
      </Grid>
    </>
  );
};

// Note:
////////////////////////////////////////////////////use state section//////////////////////////////////////////
// const [reportData, setReportData] = useState({
//   division: "",
//   district: "",
//   upazila: "",
//   union : ""
// });

// const [upaDefault, setUpaDefault] = useState();
// const [unionDefault, setUnionDefault] = useState();

////////////////////////////////////////////////////Handle change function section//////////////////////////////////////////

// const handleChange = async (e) => {
//   setReportData({ ...reportData, [e.target.name]: e.target.name=='upazila'?JSON.parse(e.target.value):e.target.name=='union'?JSON.parse(e.target.value):e.target.value })
//   if(e.target.name=='upazila'){
//     setUpaDefault(e.target.value)
//   }
//   if(e.target.name=='union'){
//     setUnionDefault(e.target.value)
//   }
// }

///////////////////////////////////////////////// JSX Section //////////////////////////////////////////////////////////////

/* <GetGeoData {...{ labelName: "বিভাগ", name: "division", handleChange, value: reportData.division, isCasCading: true, xl: 4, lg: 4, md:4, xs:12, isDisabled: false, customClass:"" }} />

<GetGeoData {...{ labelName: "জেলা", name: "district", handleChange, value: reportData.district, isCasCading: true, casCadingValue: reportData.division, xl: 4, lg: 4, md:4, xs:12, isDisabled: false, customClass:"" }} /> 

<GetGeoData {...{ labelName: "উপজেলা/থানা", name: "upazila", handleChange, value: reportData.district, isCasCading: true, casCadingValue: reportData.district, showMuiltiple: upaDefault, xl: 4, lg: 4, md:4, xs:12, isDisabled: false, customClass:"" }} />

<GetGeoData {...{ labelName: "ইউনিয়ন", name: "union", handleChange, value: reportData.district, isCasCading: true, casCadingValue: reportData.upazila, showMuiltiple: unionDefault, casCadingValueDis: reportData.district, xl: 4, lg: 4, md:4, xs:12, isDisabled: false, customClass:"" }} /> */

export default memo(GetGeoData);
