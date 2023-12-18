
import { Autocomplete, Grid, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { geoDataUrl } from '../../../../url/ApiList';
import star from '../../loan-management/loan-application/utils';
const ZoneComponent = ({
  label,
  name,
  type,
  value,
  onChange,
  district_Id,
  upa_city_Id_Type,
  per_district_Id,
  per_upa_city_Id_Type,
  formError,
  member,
}) => {
  const config = localStorageData('config');
  const [zoneData, setZoneData] = React.useState([]);
  React.useEffect(() => {
    let url = generateUrl(type);
    getZone(url);
  }, [district_Id, upa_city_Id_Type, per_district_Id, per_upa_city_Id_Type]);

  function generateUrl(type) {
    let upaCityIdType;
    let perUpaCityIdType;

    // Present Address Cascading Type start //////
    if (type === 'district') {
      const url = geoDataUrl + 'district' + '?allDistrict=true';
      return url;
    }

    if (type === 'upazila' && district_Id) {
      const url = geoDataUrl + type + '?district=' + district_Id + '&address=1';
      return url;
    }

    if (type === 'uni-thana-paurasabha' && upa_city_Id_Type) {
      upaCityIdType = upa_city_Id_Type.split(',');
      const url = geoDataUrl + 'union' + '?upazila=' + upaCityIdType[0] + '&type=' + upaCityIdType[1] + '&address=1';
      return url;
    }

    // Present Address Cascading Type End //////

    // Permanent Address Cascading Type Start///////////////

    if (type === 'per_district') {
      const url = geoDataUrl + 'district' + '?allDistrict=true';
      // ("URL_____________", url);

      return url;
    }

    if (type === 'per_upazila' && per_district_Id !== 'নির্বাচন করুন' && per_district_Id) {
      const url = geoDataUrl + 'upazila' + '?district=' + per_district_Id + '&address=1';

      return url;
    }

    if (type === 'per_uni-thana-paurasabha' && per_upa_city_Id_Type !== 'নির্বাচন করুন' && per_upa_city_Id_Type) {
      perUpaCityIdType = per_upa_city_Id_Type.split(',');

      const url =
        geoDataUrl + 'union' + '?upazila=' + perUpaCityIdType[0] + '&type=' + perUpaCityIdType[1] + '&address=1';
      return url;
    }
  }

  let getZone = async (url) => {
    if (url) {
      try {
        let zone = await axios.get(url, config);
        if (type == 'upazila') {
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
        } else if (type == 'per_upazila') {
          let upazilaArray = zone.data.data;
          let newUpazilaList = upazilaArray.map((obj) => {
            obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
            return obj;
          });
          setZoneData(newUpazilaList);
          return;
        } else if (type == 'per_uni-thana-paurasabha') {
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
          'Error Data', error.message;
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
    } else if (type == 'upazila' || type == 'per_upazila') {
      return data.upaCityIdType;
    }
    else {
      return data.id;
    }
  };
  function getZoneBanglaName(data, type) {
    if (type === 'district') {
      return data.districtNameBangla;
    } else if (type === 'upazila') {
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
  function getDynamicField(data, type) {
    if (type === 'district') {
      return data?.district_id;
    } else if (type === 'upazila') {
      return data?.upazila_id;
    } else if (type === 'uni-thana-paurasabha') {
      return data?.union_id;
    }
  }
  return (
    <Grid item xs={12} md={6}>
      <Autocomplete
        id={name}
        disablePortal
        name={name}
        onChange={(event, value) => {
          if (!value) {
            return;
          } else {
            onChange(event, value), getZone();
          }
        }}
        value={
          zoneData
            .map((data) => {
              return {
                id: getIdForAll(data),
                label: getZoneBanglaName(data, type),
              };
            })
            .find((e) => {
              return e.id.toString() == value;
            })
            ? {
              ...zoneData
                .map((data) => {
                  return {
                    id: getIdForAll(data),
                    label: getZoneBanglaName(data, type),
                  };
                })
                .find((e) => {
                  return e.id.toString() == value;
                }),
            }
            : ''
        }
        options={zoneData.map((data) => {
          return {
            id: getIdForAll(data),
            label: getZoneBanglaName(data, type),
          };
        })}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            label={star(label)}
            error={!getDynamicField(member, type) && getDynamicField(formError, type) ? true : false}
            helperText={getDynamicField(formError, type)}
          />
        )}
      />
    </Grid>
  );
};
export default ZoneComponent;
