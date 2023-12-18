/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */

import { Autocomplete, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { districtOfficeByuser, serviceName, upozilaOffice } from '../../../url/coop/ApiList';
import RequiredFile from '../RequiredFile';
import star from './star';

const DisUpaOfficeService = ({ takeData, size }) => {
  const config = localStorageData('config');
  const [serviceInfo, setServiceInfo] = useState([]);
  // const [viewReportData, setViewReportData] = useState([]);
  const [openReport, setOpenReport] = useState(false);
  const [districtData, setDistrictData] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [upozillaData, setUpozilaData] = useState([]);
  const [upazilaOfficeId, setUpazilaOfficeId] = useState('');
  const [serviceId, setServiceId] = useState('');
  ////////////////////////////// select district && upazila office name //////////////////////
  useEffect(() => {
    getDistrict();
    serviceInfoData();
  }, []);

  const getDistrict = async () => {
    try {
      const districtOffice = await axios.get(districtOfficeByuser, config);
      let districtList = districtOffice.data.data;
      if (districtList.length == 1) {
        setDistrictId(districtList[0].id);
        getupazila(districtList[0].id);
      }
      setDistrictData(districtList);
    } catch (error) {
      errorHandler(error);
    }
  };
  let getupazila = async (Disid) => {
    try {
      let upozila = await axios.get(upozilaOffice + '?districtOfficeId=' + Disid, config);
      let data = upozila.data.data;
      if (data.length == 0) {
        setUpozilaData([]);
      } else if (data.length == 1) {
        setUpazilaOfficeId(data[0].id);
        setUpozilaData(data);
      } else {
        setUpozilaData(data);
      }
    } catch (error) {
      'error', error;
      errorHandler(error);
    }
  };

  const serviceInfoData = async () => {
    const serviceNameData = await axios.get(serviceName, config);
    let serviceNames = serviceNameData.data.data;
    let shortserviceName = serviceNames.sort((a, b) => {
      return a.id - b.id;
    });
    setServiceInfo(shortserviceName);
  };

  //////////////////////////////// select district && upazila office name /////////////////////////////
  const handleChange = async (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'district':
        if (value == 0) {
          setDistrictId('');
          setUpozilaData([]);
        } else {
          setDistrictId(value);
          getupazila(value);
        }
        break;
      case 'upazilaOfficeId':
        if (value == 0) {
          setUpazilaOfficeId('');
        } else {
          setUpazilaOfficeId(value);
        }
        break;
    }
  };

  useEffect(() => {
    takeData(upazilaOfficeId, serviceId, openReport);
  }, [serviceId]);

  const handleChangeSamity = async (e, data) => {
    if (data) {
      setServiceId(data.id);
      setOpenReport(true);
    } else {
      setOpenReport(false);
    }
  };

  return (
    <Fragment>
      <Grid item md={size} lg={size} xl={size} xs={12}>
        <TextField
          fullWidth
          label={star('জেলা অফিস')}
          name="district"
          select
          disabled={districtData.length == 1 ? true : false}
          SelectProps={{ native: true }}
          onChange={(e) => handleChange(e)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#FFF' }}
          value={districtId || 0}
        >
          <option value={0}>- নির্বাচন করুন -</option>
          {districtData?.map((option, i) => (
            <option key={i} value={option.id}>
              {option.officeNameBangla}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item md={size} lg={size} xl={size} xs={12}>
        <TextField
          fullWidth
          label={star('উপজেলা অফিস')}
          name="upazilaOfficeId"
          select
          disabled={upozillaData.length <= 1 ? true : false}
          SelectProps={{ native: true }}
          onChange={(e) => handleChange(e)}
          type="text"
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#FFF' }}
          value={upazilaOfficeId || 0}
        >
          <option value={0}>
            {upozillaData.length == 0 ? 'এই জেলা অফিস এ কোন উপজেলা অফিস নেই।' : '- নির্বাচন করুন -'}
          </option>
          {upozillaData.map((option, i) => (
            <option key={i} value={option.id}>
              {option.officeNameBangla}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item md={size} lg={size} xl={size} xs={12}>
        <Autocomplete
          inputProps={{ style: { padding: 0, margin: 0 } }}
          onChange={(e, value) => {
            handleChangeSamity(e, value);
          }}
          options={serviceInfo.map((option) => {
            return {
              label: option.serviceName,
              id: option.id,
            };
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={RequiredFile('সেবার নাম')}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF', margin: '5dp' }}
            />
          )}
        />
      </Grid>
    </Fragment>
  );
};

export default DisUpaOfficeService;
