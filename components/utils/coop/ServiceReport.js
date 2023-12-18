
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 * How to use->Note:
 * const takeData = (samityData, report) => {
 *   setViewReportData(samityData)
 *   setOpenReport(report)
 * }
 * <DisUpaOffice {...{ takeData, size: 4, getData: "all/approved/pending" }} />
 */

import { Autocomplete, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { allDoptor, childOffice, officeLayer, serviceName } from '../../../url/coop/ApiList';
import RequiredFile from '../RequiredFile';
import star from './star';

const ServiceReports = ({ takeData }) => {
  const config = localStorageData('config');
  const componentName = localStorageData('componentName');
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const DoptorId = getTokenData?.doptorId;
  //////////////////////////////////////////////////////////////////////////////////////////
  const [openReport, setOpenReport] = useState(false);
  ////////////////////////////////////////////////////////////////////////////////////////////
  // const [samity, setSamity] = useState([]);
  const [doptor, setDoptor] = useState(null);
  const [doptorList, setDoptorList] = useState([]);
  const [layerList, setLayerList] = useState([]);
  const [layerId, setLayerId] = useState(6);
  const [officeList, setOfficeList] = useState([]);
  const [officeDisableStatus, setOfficeDisableStatus] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [serviceInfo, setServiceInfo] = useState([]);

  ////////////////////////////// select district && upazila office name //////////////////////
  useEffect(() => {
    getDoptorList();
  }, []);

  useEffect(() => {
    getLayerList(DoptorId);
    getOfficeList(6);
    serviceInfoData();
  }, []);

  const getDoptorList = async () => {
    try {
      const doptorInfo = await axios.get(allDoptor + '/' + componentName, config);
      const doptorInfoData = doptorInfo.data.data;
      setDoptorList(doptorInfoData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getLayerList = async (doptorId) => {
    try {
      const layerInfo = await axios.get(officeLayer + '?doptorId=' + doptorId, config);
      const layerInfoData = layerInfo.data.data;
      setLayerList(layerInfoData);
      setOfficeList([]);
      setOfficeDisableStatus(false);
    } catch (err) {
      errorHandler(err);
    }
  };

  const getOfficeList = async (layerId) => {
    try {
      let doptorId = doptor ? doptor : DoptorId;
      const officeInfo = await axios.get(childOffice + '?doptorId=' + doptorId + '&layerId=' + layerId, config);
      const officeInfoData = officeInfo.data.data;
      if (officeInfoData && officeInfoData.length === 1) {
        setSelectedValue({
          ...selectedValue,
          officeId: officeInfoData[0]?.id,
          samityId: null,
        });
        setOfficeDisableStatus(true);
      }
      setOfficeList(officeInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };

  const handleInputChangeDoptor = (e) => {
    const { value } = e.target;
    setLayerId(null);
    setLayerList([]);
    setOfficeList([]);
    // setSamity([]);
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
    });
    setOfficeDisableStatus(false);
    if (value && value != 'নির্বাচন করুন') {
      setDoptor(value);
      getLayerList(value);
    } else {
      setDoptor(null);
    }
  };

  const handleInputChangeDoptorLayer = (e) => {
    setOfficeList([]);
    setOfficeDisableStatus(false);
    // setSamity([]);
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
    });
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setLayerId(value);
      getOfficeList(value);
    }
  };

  const handleInputChangeOffice = (e) => {
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setSelectedValue({
        ...selectedValue,
        officeId: parseInt(value),
      });
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

  useEffect(() => {
    takeData(selectedValue.officeId, serviceId, openReport);
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
      {DoptorId == 1 ? (
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <TextField
            fullWidth
            label={star('দপ্তরের তালিকা')}
            name="doptor"
            id="doptor"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeDoptor(e)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={doptor}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {doptorList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameBn}
              </option>
            ))}
          </TextField>
        </Grid>
      ) : (
        ''
      )}
      <Grid item lg={4} md={4} sm={6} xs={12}>
        <TextField
          fullWidth
          label={star('দপ্তর লেয়ার')}
          id="officeLayer"
          name="officeLayer"
          select
          SelectProps={{ native: true }}
          onChange={(e) => handleInputChangeDoptorLayer(e)}
          type="text"
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#FFF' }}
          value={layerId != null ? layerId : ' '}
        >
          <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
          {layerList.map((option) => (
            <option key={option.id} value={option.id}>
              {option.nameBn}
            </option>
          ))}
        </TextField>
      </Grid>

      <Grid item lg={4} md={4} sm={6} xs={12}>
        <TextField
          fullWidth
          label={star('অফিসের তালিকা')}
          id="upozilla"
          name="upazila"
          select
          SelectProps={{ native: true }}
          disabled={officeDisableStatus}
          onChange={(e) => handleInputChangeOffice(e)}
          type="text"
          value={selectedValue.officeId ? selectedValue.officeId : 'নির্বাচন করুন'}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#FFF' }}
        >
          <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
          {officeList.map((option) => (
            <option key={option.id} value={option.id}>
              {option.nameBn}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item lg={4} md={4} sm={6} xs={12}>
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

export default ServiceReports;
