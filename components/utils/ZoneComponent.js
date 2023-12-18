
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { NotificationManager } from 'react-notifications';
import { geoData } from '../../url/coop/ApiList';
import RequiredFile from './RequiredFile';

const ZoneComponent = ({
  label,
  name,
  type,
  disabled,
  // flag,
  value,
  onChange,
  division_id,
  district_Id,
  upa_city_Id_Type,
  uni_thana_paw_Id_Type,
  // per_district_Id,
  // per_upa_city_Id_Type,
  // per_uni_thana_paw_Id_Type,
  formErrors,
  key,
}) => {
  let token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [zoneData, setZoneData] = React.useState([]);
  // const [nameBangla, setNameBangla] = React.useState([]);
  let url = generateUrl(type);
  React.useEffect(() => {
    url;
    getZone(url);
  }, [district_Id, upa_city_Id_Type, url]);

  function generateUrl(type) {
    let upaCityIdType;
    // let perUpaCityIdType;
    let url;

    // Present Address Cascading Type start //////
    if (type === 'division') {
      url = geoData + 'division';

      return url;
    }

    if (type === 'district' && division_id !== 'নির্বাচন করুন' && division_id) {
      url = geoData + `district&divisionId=` + division_id;

      return url;
    }

    if (
      type === 'upaCityIdType' &&
      district_Id !== 'নির্বাচন করুন' &&
      district_Id &&
      division_id &&
      division_id !== 'নির্বাচন করুন'
    ) {
      const url = geoData + `upa-city&districtId=` + district_Id + `&divisionId=` + division_id;

      return url;
    }

    if (
      type === 'uni-thana-paurasabha' &&
      upa_city_Id_Type !== 'নির্বাচন করুন' &&
      district_Id &&
      district_Id !== 'নির্বাচন করুন' &&
      upa_city_Id_Type
    ) {
      let url;
      upaCityIdType = upa_city_Id_Type.split(',');

      if (district_Id && upaCityIdType[0] && upaCityIdType[1]) {
        url =
          geoData +
          `uni-thana-paurasabha&districtId=` +
          district_Id +
          `&upaCityId=` +
          upaCityIdType[0] +
          `&upaCityType=` +
          upaCityIdType[1];
      } else if (district_Id && district_Id !== 'নির্বাচন করুন') {
        url = geoData + `uni-thana-paurasabha&districtId=` + district_Id;
      }

      return url;
    }
  }

  let getZone = async (url) => {
    // if (value !== "নির্বাচন করুন") {
    if (url) {
      try {
        let zone = await axios.get(url, config);
        if (type == 'upaCityIdType') {
          let upazilaArray = zone.data.data;
          let newUpazilaList = upazilaArray.map((obj) => {
            obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
            return obj;
          });
          setZoneData(newUpazilaList);
          return;
        } else if (type == 'uni-thana-paurasabha') {
          let unionArray = zone.data.data;
          let newUnionList = unionArray.map((obj) => {
            obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
            return obj;
          });
          setZoneData(newUnionList);
          return;
        }

        setZoneData(zone.data.data);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };
  const getIdForAll = (data) => {
    if (type === 'uni-thana-paurasabha' || type === 'per_uni-thana-paurasabha') {
      return data.uniThanaPawIdType;
    } else if (type == 'upaCityIdType' || type == 'per_upazila') {
      return data.upaCityIdType;
    } else if (type == 'per_uni-thana-paurasabha') {
      return data.uniThanaPawId;
    } else {
      return data.id;
    }
  };
  function getZoneBanglaName(data, type) {
    if (type === 'division') {
      return data.divisionNameBangla;
    }
    if (type === 'district') {
      return data.districtNameBangla;
    } else if (type === 'upaCityIdType') {
      return data.upaCityNameBangla;
    } else if (type === 'uni-thana-paurasabha') {
      return data.uniThanaPawNameBangla;
    } else if (type === 'per_district') {
      return data.districtNameBangla;
    } else if (type === 'per_upazila') {
      return data.upaCityNameBangla;
    } else if (type === 'per_uni-thana-paurasabha') {
      return data.uniThanaPawNameBangla;
    }
  }

  const determineErrorTrueFalse = (formErrors) => {
    if (formErrors) {
      if (type === 'division' && formErrors?.divisionId && (value === '' || value == 'নির্বাচন করুন')) {
        return true;
      }
      if (type === 'district' && formErrors?.districtId && (value === '' || value == 'নির্বাচন করুন')) {
        return true;
      }
      if (type === 'upaCityIdType' && formErrors?.upacityIdType && (value === '' || value == 'নির্বাচন করুন')) {
        return true;
      }

      if (
        type === 'uni-thana-paurasabha' &&
        formErrors?.uniThanaPawIdType &&
        uni_thana_paw_Id_Type === 'নির্বাচন করুন'
      ) {
        return true;
      }
      if (type === 'uni-thana-paurasabha' && formErrors?.uniThanaPawIdType && uni_thana_paw_Id_Type === 'true') {
        return true;
      }
    }
    return false;
  };
  const determineErrorMessage = (formErrors) => {
    if (type === 'division' && (value === '' || value == 'নির্বাচন করুন')) {
      return formErrors.divisionId;
    }
    if (type === 'district' && (value === '' || value == 'নির্বাচন করুন')) {
      return formErrors.districtId;
    }
    if (type === 'upaCityIdType' && (value === '' || value == 'নির্বাচন করুন')) {
      return formErrors.upacityIdType;
    }

    if (type === 'uni-thana-paurasabha' && uni_thana_paw_Id_Type === 'নির্বাচন করুন') {
      return formErrors.uniThanaPawIdType;
    }
    if (type === 'uni-thana-paurasabha' && uni_thana_paw_Id_Type === 'true') {
      return formErrors.uniThanaPawIdType;
    }
  };

  // if (type === 'uni-thana-paurasabha') {
  // }
  const determineDisableEnable = (type, disabled) => {
    if (district_Id === 'নির্বাচন করুন' && type === 'district') {
      return false;
    }
    if (upa_city_Id_Type === 'নির্বাচন করুন' && type === 'upaCityIdType') {
      return false;
    }
    if (type !== 'uni-thana-paurasabha' && disabled !== undefined) {
      return disabled;
    } else {
      return false;
    }
  };
  return (
    <Grid item sm={12} md={3} xs={12}>
      <TextField
        key={key}
        disabled={
          determineDisableEnable(type, disabled)
          // type !== "uni-thana-paurasabha" &&
          // disabled !== undefined &&
          // upa_city_Id_Type === "নির্বাচন করুন"
          //   ? disabled
          //   : false
        }
        fullWidth
        label={RequiredFile(label)}
        name={name}
        // required
        select
        SelectProps={{ native: true }}
        variant="outlined"
        size="small"
        value={value || 0}
        onChange={(e) => {
          onChange(e), getZone();
        }}
        error={determineErrorTrueFalse(formErrors)}
        helperText={determineErrorMessage(formErrors)}
      >
        <option value={0}>- নির্বাচন করুন -</option>
        {zoneData.map((data, i) => {
          // if (type === 'uni-thana-paurasabha') {
          // }
          return (
            <option key={i} value={getIdForAll(data)}>
              {getZoneBanglaName(data, type)}
            </option>
          );
        })}
      </TextField>
      {/* {formErrors && showErrorSpan(formErrors)} */}
    </Grid>
  );
};
export default ZoneComponent;
