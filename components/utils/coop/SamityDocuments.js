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
import { allDoptor, childOffice, officeLayer } from '../../../url/coop/ApiList';
import { DocumentDownloadUser } from '../../../url/coop/BackOfficeApi';
import RequiredFile from '../RequiredFile';
import star from './star';

const SamityDocuments = ({ takeData, getData }) => {
  const config = localStorageData('config');
  const componentName = localStorageData('componentName');
  const getTokenData = tokenData();
  const DoptorId = getTokenData?.doptorId;
  const [samityInfo, setSamityInfo] = useState([]);
  const [viewReportData, setViewReportData] = useState([]);
  //////////////////////////////////////////////////////////////////////////////////////////
  const [openReport, setOpenReport] = useState(false);
  ////////////////////////////////////////////////////////////////////////////////////////////
  // const [samity, setSamity] = useState([]);
  const [doptor, setDoptor] = useState(null);
  const [doptorList, setDoptorList] = useState([]);
  const [layerList, setLayerList] = useState([]);
  const [layerId, setLayerId] = useState(getTokenData?.layerId);
  const [officeList, setOfficeList] = useState([]);
  const [officeDisableStatus, setOfficeDisableStatus] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  ////////////////////////////// select district && upazila office name //////////////////////
  useEffect(() => {
    getDoptorList();
    getLayerList();
    getOfficeList(getTokenData?.layerId);
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

  const getLayerList = async () => {
    try {
      const layerInfo = await axios.get(officeLayer, config);
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
        getSamityData(officeInfoData[0]?.id);
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
      getSamityData(parseInt(value));
    }
  };

  const getSamityData = async (officeId) => {
    try {
      const samityData = await axios.get(DocumentDownloadUser + 'officeId=' + officeId, config);

      if (getData == 'all') {
        const tempSamityInfo = samityData.data.data[0]?.tempSamityInfo;
        tempSamityInfo?.map((row) => {
          row.flag = 'temp';
          row.fullSamityName =
            row.samityName +
            (row.samityLevel == 'P'
              ? ' (প্রক্রিয়াধীন প্রাথমিক সমিতি)'
              : row.samityLevel == 'C'
              ? ' (প্রক্রিয়াধীন কেন্দ্রীয় সমিতি)'
              : row.samityLevel == 'N'
              ? ' (প্রক্রিয়াধীন জাতীয় সমিতি)'
              : '');
        });

        const mainSamityInfo = samityData?.data?.data[1]?.mainSamityInfo;
        mainSamityInfo?.map((row) => {
          row.flag = 'approved';
          row.fullSamityName =
            row.samityName +
            (row.samityLevel == 'P'
              ? ' (অনুমোদিত প্রাথমিক সমিতি)'
              : row.samityLevel == 'C'
              ? ' (অনুমোদিত কেন্দ্রীয় সমিতি)'
              : row.samityLevel == 'N'
              ? ' (অনুমোদিত জাতীয় সমিতি)'
              : '');
        });
        const newArray = [...tempSamityInfo, ...mainSamityInfo];
        setSamityInfo(newArray);
      } else if (getData == 'approved') {
        const mainSamityInfo = samityData?.data?.data[1]?.mainSamityInfo;
        mainSamityInfo?.map((row) => {
          row.flag = 'approved';
          row.fullSamityName =
            row.samityName +
            (row.samityLevel == 'P'
              ? ' (অনুমোদিত প্রাথমিক সমিতি)'
              : row.samityLevel == 'C'
              ? ' (অনুমোদিত কেন্দ্রীয় সমিতি)'
              : row.samityLevel == 'N'
              ? ' (অনুমোদিত জাতীয় সমিতি)'
              : '');
        });
        setSamityInfo(mainSamityInfo);
      } else if (getData == 'pending') {
        const tempSamityInfo = samityData.data.data[0]?.tempSamityInfo;
        tempSamityInfo?.map((row) => {
          row.flag = 'temp';
          row.fullSamityName =
            row.samityName +
            (row.samityLevel == 'P'
              ? ' (প্রক্রিয়াধীন প্রাথমিক সমিতি)'
              : row.samityLevel == 'C'
              ? ' (প্রক্রিয়াধীন কেন্দ্রীয় সমিতি)'
              : row.samityLevel == 'N'
              ? ' (প্রক্রিয়াধীন জাতীয় সমিতি)'
              : '');
        });
        setSamityInfo(tempSamityInfo);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    takeData(viewReportData, openReport);
  }, [viewReportData]);

  const handleChangeSamity = async (e, data) => {
    if (data) {
      const selectData = {
        id: data.id,
        samityName: data.samityName,
        samityLevel: data.samityLevel,
        flag: data.flag,
        soldShare: data.soldShare,
        noOfShare: data.noOfShare,
        sharePrice: data.sharePrice,
        isManual: data.isManual,
        role: data.role,
      };
      setViewReportData(selectData);
      setOpenReport(true);
      localStorage.setItem('samityInfo', JSON.stringify(selectData));
    } else {
      setOpenReport(false);
      setViewReportData({});
    }
  };
  return (
    <Fragment>
      {DoptorId == 1 && (
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
          options={samityInfo.map((option) => {
            return {
              label: option.fullSamityName,
              id: option.id,
              samityName: option.samityName,
              samityLevel: option.samityLevel,
              flag: option.flag,
              soldShare: option.soldShare,
              noOfShare: option.noOfShare,
              sharePrice: option.sharePrice,
              isManual: option.isManual ? option.isManual : false,
              role: 'user',
            };
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={RequiredFile('সমিতির নাম')}
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

export default SamityDocuments;
