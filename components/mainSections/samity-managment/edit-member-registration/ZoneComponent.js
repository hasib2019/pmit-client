/* eslint-disable no-unused-vars */

// / eslint-disable react-hooks/exhaustive-deps /
import star from '../../loan-management/loan-application/utils';

import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { geoDataUrl } from '../../../../url/ApiList';
const ZoneComponent = ({
  label,
  name,
  type,
  value,
  onChange,
  district_Id,
  upa_city_Id_Type,
  uni_thana_paw_Id_Type,
  per_district_Id,
  per_upa_city_Id_Type,
  per_uni_thana_paw_Id_Type,
}) => {
  const config = localStorageData('config');
  const [zoneData, setZoneData] = React.useState([]);
  const [nameBangla, setNameBangla] = React.useState([]);

  React.useEffect(() => {
    let url = generateUrl(type);
    getZone(url);
  }, [district_Id, upa_city_Id_Type, per_district_Id, per_upa_city_Id_Type]);

  function generateUrl(type) {
    let upaCityIdType;
    let perUpaCityIdType;
    // ("perUpacityIdType", per_upa_city_Id);

    // Present Address Cascading Type start //////
    if (type === 'district' && district_Id !== 'নির্বাচন করুন') {
      const url = geoDataUrl + 'district' + '?allDistrict=true';
      // ("URL_____________", url);

      return url;
    }

    if (type === 'upazila' && district_Id !== 'নির্বাচন করুন' && district_Id) {
      const url = geoDataUrl + type + '?district=' + district_Id + '&address=1';

      return url;
    }

    if (type === 'uni-thana-paurasabha' && upa_city_Id_Type !== 'নির্বাচন করুন' && upa_city_Id_Type) {
      upaCityIdType = upa_city_Id_Type.split(',');
      const url = geoDataUrl + 'union' + '?upazila=' + upaCityIdType[0] + '&type=' + upaCityIdType[1] + '&address=1';
      return url;
    }

    // Present Address Cascading Type End //////

    // Permanent Address Cascading Type Start///////////////

    if (type === 'per_district' && per_district_Id !== 'নির্বাচন করুন') {
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

    // Permanent Address Cascading Type End///////////////

    // if (
    //   type === "district" &&
    //   district_Id !== "" &&
    //   district_Id !== "নির্বাচন করুন"
    // ) {
    //   const url = geoDataUrl + "&type=district" + "&district_Id=" + district_Id;

    //   return url;
    // }
    // if (type === "district" && division_Id === "নির্বাচন করুন") {
    //   const url = geoDataUrl + "&type=district" + "&divisionId=" + "";

    //   return url;
    // }
    // if (
    //   type === "cityCorp" &&
    //   division_Id !== "" &&
    //   district_Id !== "" &&
    //   district_Id !== "নির্বাচন করুন"
    // ) {
    //   const url =
    //     geoDataUrl +
    //     "&type=cityCorp" +
    //     "&divisionId=" +
    //     division_Id +
    //     "&districtId=" +
    //     district_Id;

    //   return url;
    // }
    // if (
    //   type === "cityCorp" &&
    //   division_Id === "নির্বাচন করুন" &&
    //   district_Id === "নির্বাচন করুন"
    // ) {
    //   const url =
    //     geoDataUrl +
    //     "&type=cityCorp" +
    //     "&divisionId=" +
    //     "" +
    //     "&districtId=" +
    //     "";

    //   return url;
    // }
    // if (
    //   type === "uni-thana-paurasabha" &&
    //   district_Id !== "নির্বাচন করুন" &&
    //   division_Id !== "নির্বাচন করুন" &&
    //   upa_city_Id !== "নির্বাচন করুন"
    // ) {
    //   const url =
    //     geoDataUrl +
    //     "&type=uni-thana-paurasabha" +
    //     "&divisionId=" +
    //     division_Id +
    //     "&districtId=" +
    //     district_Id +
    //     (upa_city_Id ? "&upaCityId=" + upa_city_Id : "");

    //   return url;
    // }
    // if (
    //   type === "uni-thana-paurasabha" &&
    //   division_Id === "নির্বাচন করুন" &&
    //   district_Id === "নির্বাচন করুন" &&
    //   upa_city_Id === "নির্বাচন করুন"
    // ) {
    //   const url =
    //     geoDataUrl +
    //     "&type=uni-thana-paurasabha" +
    //     "&divisionId=" +
    //     "" +
    //     "&districtId=" +
    //     "" +
    //     "&upaCityId=" +
    //     "";

    //   return url;
    // }
  }

  let getZone = async (url) => {
    // if (value !== "নির্বাচন করুন") {
    if (url) {
      try {
        let zone = await axios.get(url, config);
        if (type == 'upazila') {
          let upazilaArray = zone.data.data;
          let newUpazilaList = upazilaArray.map((obj, i) => {
            obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
            return obj;
          });
          setZoneData(newUpazilaList);
          return;
        } else if (type == 'uni-thana-paurasabha') {
          let unionArray = zone.data.data;
          let newUnionList = unionArray.map((obj, i) => {
            obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
            return obj;
          });
          setZoneData(newUnionList);
          return;
        } else if (type == 'per_upazila') {
          let upazilaArray = zone.data.data;
          let newUpazilaList = upazilaArray.map((obj, i) => {
            obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
            return obj;
          });
          setZoneData(newUpazilaList);
          return;
        } else if (type == 'per_uni-thana-paurasabha') {
          let unionArray = zone.data.data;
          let newUnionList = unionArray.map((obj, i) => {
            obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
            return obj;
          });
          setZoneData(newUnionList);
          return;
        }
        setZoneData(zone.data.data);
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  const getIdForAll = (data) => {
    if (type === 'uni-thana-paurasabha' || type === 'per_uni-thana-paurasabha') {
      return data.uniThanaPawIdType;
    } else if (type == 'upazila' || type == 'per_upazila') {
      return data.upaCityIdType;
    } else if (type == 'per_uni-thana-paurasabha') {
      return data.uniThanaPawId;
    } else {
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

  return (
    <Grid item xs={12} md={6} sm={12}>
      <TextField
        fullWidth
        label={star(label)}
        name={name}
        select
        SelectProps={{ native: true }}
        variant="outlined"
        size="small"
        value={value ? value : ' '}
        onChange={(e) => {
          onChange(e), getZone();
        }}
      >
        <option>- নির্বাচন করুন -</option>
        {zoneData.map((data, i) => {
          // ("name ", getZoneBanglaName(data, type));
          // ("Id", data);
          return (
            <option key={i} value={getIdForAll(data)}>
              {getZoneBanglaName(data, type)}
            </option>
          );
        })}
      </TextField>

      {/* <Autocomplete
        disablePortal
        inputProps={{ style: { padding: 0, margin: 0 } }}
        name="samityId"
        key={samityNameObj}
        onChange={(event, value) => {
          if (value == null) {
            setSamityNameObj({
              id: "",
              label: ""
            })
          } else {
            value && setSamityNameObj({
              id: value.id,
              label: value.label
            })
            getMemberDetails(value.id);
          }
          // ("VVVVVV",value);


        }}
        options={samityInfo.map((option) =>

        ({
          id: option.id,
          label: option.samityName,
        })

        ).filter((e) => e.id != null && e.employeeId !== null)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={
              samityNameObj.id === ""
                ? star({label})
                : star({label})
            }
            variant="outlined"
            size="small"
          />
        )}
        value={samityNameObj}
      /> */}
    </Grid>
  );
};
export default ZoneComponent;
