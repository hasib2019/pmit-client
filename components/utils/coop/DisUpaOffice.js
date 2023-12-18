
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
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { districtOfficeByuser, upozilaOffice } from '../../../url/coop/ApiList';
import { DocumentDownloadUser } from '../../../url/coop/BackOfficeApi';
import RequiredFile from '../../utils/RequiredFile';
import star from './star';

const DisUpaOffice = ({ takeData, size, getData }) => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [viewReportData, setViewReportData] = useState([]);
  //////////////////////////////////////////////////////////////////////////////////////////
  const [openReport, setOpenReport] = useState(false);
  ////////////////////////////////////////////////////////////////////////////////////////////
  const [districtData, setDistrictData] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [upozillaData, setUpozilaData] = useState([]);
  const [upazilaOfficeId, setUpazilaOfficeId] = useState('');

  ////////////////////////////// select district && upazila office name //////////////////////
  useEffect(() => {
    getDistrict();
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
        setSamityInfo([]);
      } else if (data.length == 1) {
        setUpazilaOfficeId(data[0].id);
        getSamityData(data[0].id);
        setUpozilaData(data);
      } else {
        setUpozilaData(data);
      }
    } catch (error) {
      'error', error;
      errorHandler(error);
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
  //////////////////////////////// select district && upazila office name /////////////////////////////
  const handleChange = async (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'district':
        if (value == 0) {
          setDistrictId('');
          setUpozilaData([]);
          setSamityInfo([]);
          setViewReportData([]);
        } else {
          setDistrictId(value);
          getupazila(value);
          setSamityInfo([]);
          setViewReportData([]);
        }
        break;
      case 'upazilaOfficeId':
        if (value == 0) {
          setUpazilaOfficeId('');
          setSamityInfo([]);
          setViewReportData([]);
        } else {
          setUpazilaOfficeId(value);
          getSamityData(value);
          setViewReportData([]);
        }
        break;
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

export default DisUpaOffice;
