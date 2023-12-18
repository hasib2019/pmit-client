import SyncIcon from '@mui/icons-material/Sync';
import { Autocomplete, Button, FormControl, FormControlLabel, Grid, Switch, TextField, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getOfficeLayer, officeName, processGetByTypeApi, upozilaOffice } from '../../../url/ApiList';

import {
  associationSyncApi,
  doptorSyncApi,
  geoDataSyncApi,
  masterDataSyncApi,
  roleSyncApi,
} from '../../../url/common/ApiList';

import star from 'components/mainSections/loan-management/loan-application/utils';
import { errorHandler } from 'service/errorHandler';

import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';

export function Process({ processName }) {
  const [processList, setProcessList] = useState([]);
  const [disPlayField, setDisplayField] = useState([]);
  const [process, setProcess] = useState();
  const [samity, setSamity] = useState([]);
  const [member, setMember] = useState([]);
  const [doptor, setDoptor] = useState(null);
  const [doptorAlive, setDoptorAlive] = useState(false);
  const [userNameAlive, setUserNameAlive] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [projectId] = useState(null);
  const [projectName, setProjectName] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [upozillaData, setUpozilaData] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);
  const [startDate] = useState(new Date());
  const [userName, setUserName] = useState(null);
  const [glType] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSingleOfficeSync, setIsSingleOfficeSync] = useState(false);
  const [layerList, setLayerList] = useState([]);
  const [layerId, setLayerId] = useState(null);
  const [layerDisableStatus, setLayerDisableStatus] = useState(false);
  const [singleOfficeSyncDisableStatus, setSingleOfficeSyncDisableStatus] = useState(false);
  const [submitButtonStatus, setSubmitButtonStatus] = useState(false);
  const [officeList, setOfficeList] = useState([]);
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [officeDisableStatus, setOfficeDisableStatus] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const config = localStorageData('config');
  const userLayerId = tokenData()?.layerId;

  useEffect(() => {
    getProcess();
  }, []);

  useEffect(() => {
    getProcess();
  }, [disPlayField]);

  useEffect(() => {
    if (districtData.length > 1) {
      setDistrictData([]);
      setDistrictId(null);
    }
    setSamity([]);
    setMember([]);
    setDoptorAlive(false);
    setUpozilaData([]);
    setProjectName([]);
    setAccountInfo([]);
  }, [process]);

  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      userName: userName,
    });
  }, [userNameAlive]);

  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      doptorId: doptor,
    });
  }, [doptorAlive]);

  //   if (samityAlive && selectedValue.officeId) {
  //     // getSamityName();
  //   }
  // }, [selectedValue]);

  // useEffect(() => {
  //   // setMember([]);
  // }, [projectId]);

  // useEffect(() => {
  //   if (glTypeAlive) {
  //     // getGlType();
  //   }
  // }, [glTypeAlive]);

  const parameterBn = {
    samity: 'সমিতি',
    doptor: 'দপ্তর',
    isSingleOfficeSync: 'একটি অফিস',
    project: 'প্রকল্প',
    member: 'সদস্য',
    accountId: 'একাউন্ট নম্বর',
    tranId: 'ট্রান্সাকশন নম্বর',
    date: 'তারিখ',
    glType: 'জিএল এর ধরন',
    office: 'উপজেলা অফিস',
    districtOffice: 'জেলা অফিস',
    showprocess: 'রিপোর্ট দেখুন ',
  };

  const getProcess = async () => {
    const compoName = localStorageData('componentName');
    try {
      const processData = await (
        await axios.get(processGetByTypeApi + compoName + '/' + processName, config)
      ).data.data;

      setDoptor(processData.doptorId);

      setUserName(processData.userName);

      let processConvertedArr = [];

      for (const element of processData.data) {
        let parameter = [];
        if (element?.parameter && element.parameter.length > 0) {
          for (const e of element.parameter) {
            if (e.status == true) {
              parameter.push(e.paramName);
            }
          }
        }

        processConvertedArr.push({
          id: element.id,
          processName: element.processFrontNameBn,
          parameter,
          typeName: element.typeName,
        });
      }

      setProcessList(processConvertedArr);
    } catch (error) {
      errorHandler(error);
    }
  };

  let getupazila = async (Disid) => {
    try {
      let upozila = await axios.get(upozilaOffice + '?districtOfficeId=' + Disid, config);
      let data = upozila.data.data;

      setUpozilaData(data);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getLayerList = async (doptorId) => {
    try {
      const layerInfo = await axios.get(getOfficeLayer, config);
      const layerInfoData = layerInfo.data.data;
      setLayerList(layerInfoData);
      if (layerInfoData && layerInfoData.length === 1) {
        setLayerId(layerInfoData[0]?.id);
        getOfficeList(doptorId, layerInfoData[0]?.id);
        setLayerDisableStatus(true);
        setIsSingleOfficeSync(true);
        if (officeObj?.id && layerInfoData[0]?.id) {
          setSubmitButtonStatus(false);
        } else {
          setSubmitButtonStatus(true);
        }
      }
    } catch (err) {
      errorHandler(err);
    }
  };
  const getOfficeList = async (doptorId, layerId) => {
    let getOfficeListUrl;
    getOfficeListUrl = officeName + '?layerId=' + layerId;

    try {
      const officeInfo = await axios.get(getOfficeListUrl, config);
      const officeInfoData = officeInfo.data.data;
      if (officeInfoData && officeInfoData.length === 1) {
        setOfficeObj({
          id: officeInfoData[0]?.id,
          label: officeInfoData[0]?.nameBn,
        });
        setSelectedValue({
          ...selectedValue,
          doptorId: doptorId,
          officeId: officeInfoData[0]?.id,
        });
        setOfficeDisableStatus(true);
        setSingleOfficeSyncDisableStatus(true);
        if (layerId && officeInfoData[0]?.id) {
          setSubmitButtonStatus(false);
        }
      } else {
        setSubmitButtonStatus(true);
      }
      setOfficeList(officeInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };

  const handleInputChangeprocess = (e) => {
    const { value } = e.target;
    let pera = [];
    setProcess(processList[parseInt(value) - 1].processName);

    setSelectedValue({
      processName: processList[parseInt(value) - 1].processName,
      typeName: processList[parseInt(value) - 1].typeName,
    });
    setIsSingleOfficeSync(false);
    for (const element of processList) {
      if (element.id == value) {
        if (element.processName == 'ড্যাসবোর্ড থেকে দপ্তরের অফিস, কর্মচারী এবং পদবীর   ডাটা প্রসেস') {
          getLayerList(doptor);
          //for doptor head office user who can update the whole doptor data
          if (userLayerId == 4 || userLayerId == 7 || userLayerId == 15 || userLayerId == 16)
            setIsSingleOfficeSync(false);
          else {
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
            setIsSingleOfficeSync(true);
            setSingleOfficeSyncDisableStatus(true);
            setSubmitButtonStatus(true);
          }
        }
        for (const p of element.parameter) {
          pera.push(parameterBn[p]);
          if (p == 'doptor') {
            setDoptorAlive(true);
          }
          if (p == 'userName') {
            setUserNameAlive(true);
          }
        }
      }
    }

    setDisplayField(pera);
  };
  const handleInputChangeIsSingleOfficeSync = () => {
    setIsSingleOfficeSync(!isSingleOfficeSync);
    if (isSingleOfficeSync) setSelectedValue(lodash.omit(selectedValue, 'officeId'));
  };
  const handleInputChangeDoptorLayer = (e) => {
    setOfficeList([]);
    setOfficeObj({ id: '', label: '' });
    setOfficeDisableStatus(false);
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setSubmitButtonStatus(true);
      setLayerId(value);
      getOfficeList(doptor, value);
      if (officeObj.id) {
        setSubmitButtonStatus(false);
      } else {
        setSubmitButtonStatus(true);
      }
    } else {
      setSubmitButtonStatus(true);
    }
  };

  const handleInputChangeSamity = (e) => {
    const { value } = e.target;
    const data = JSON.parse(value);

    const id = data.samityName == 'all' ? 0 : data.id;
    setSelectedValue({ ...selectedValue, samityId: parseInt(id) });
  };

  const handleInputChangeOffice = (e) => {
    const { value } = e.target;
    setSelectedValue({
      ...selectedValue,
      officeId: value == 'ALL' ? value : parseInt(value),
    });
  };
  const handleInputChangeProject = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, projectId: parseInt(value) });
  };
  const handleInputChangeMember = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, memberId: parseInt(value) });
  };

  const handleInputChangeDistrict = (e) => {
    const { value } = e.target;
    setDistrictId(value);
    getupazila(value);
  };

  const handleInputChangeAccountNumber = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, accountId: parseInt(value) });
  };

  const handleInputChangeTranId = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, tranId: value });
  };

  const handleDateChangeEx = (e) => {
    const date = new Date(e);
    setSelectedValue({
      ...selectedValue,
      date: moment(date).format('yyyy-MM-DD'),
    });
  };

  const handleInputChangeGlType = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, glType: value });
  };

  const selectApiUrlAccordingToProcessName = () => {
    const compoName = localStorageData('componentName');
    if (process == 'ড্যাসবোর্ড থেকে দপ্তরের অফিস, কর্মচারী এবং পদবীর   ডাটা প্রসেস') {
      return doptorSyncApi + '/' + compoName;
    } else if (process == 'ড্যাসবোর্ড থেকে জিও ডাটা প্রসেস') {
      return geoDataSyncApi + '/' + compoName;
    } else if (process == 'ড্যাশবোর্ড এ রোল প্রেরন') {
      return roleSyncApi + '/' + compoName;
    } else if (process == 'সমিতি ড্যাশবোর্ড এ প্রেরণ') {
      return associationSyncApi + '/' + compoName;
    } else if (process == 'মাস্টার ডাটা সিঙ্ক') {
      return masterDataSyncApi + '/' + compoName;
    }
  };

  const callCorrectApiRequestAccordingToProcess = async (p, config) => {
    if (process == 'ড্যাসবোর্ড থেকে দপ্তরের অফিস, কর্মচারী এবং পদবীর   ডাটা প্রসেস') {
      return await axios.get(p, '', config);
    } else if (process == 'ড্যাসবোর্ড থেকে জিও ডাটা প্রসেস') {
      return await axios.get(p, '', config);
    } else if (process == 'ড্যাশবোর্ড এ রোল প্রেরন') {
      return await axios.get(p, '', config);
    } else if (process == 'সমিতি ড্যাশবোর্ড এ প্রেরণ') {
      return axios.post(p, '', config);
    } else if (process == 'মাস্টার ডাটা সিঙ্ক') {
      return axios.get(p, config);
    }
  };
  const processGenerator = async () => {
    setOpen(true);
    try {
      let p = selectApiUrlAccordingToProcessName();
      let keys = Object.keys(selectedValue);
      let count = 0;

      for (const element of keys) {
        if (element == 'processName') {
          //
        } else if (element == 'typeName') {
          //
        } else {
          count == 0
            ? (p = p + `?${element}=${selectedValue[element]}`)
            : (p = p + `&${element}=${selectedValue[element]}`);
          count = count + 1;
        }
      }
      const result = await callCorrectApiRequestAccordingToProcess(p, config);
      if (result.status == 200 || result.status == 201) {
        setOpen(false);
        NotificationManager.success(result.data.message, '', 5000);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <Grid
      lg={12}
      container
      spacing={2.5}
      // px={2}
      // py={1}
      // sx={{ backgroundColor: "red" }}
    >
      <Grid item md={4} sm={6} xs={12}>
        <TextField
          fullWidth
          label="প্রসেস"
          name="process"
          required
          select
          SelectProps={{ native: true }}
          onChange={handleInputChangeprocess}
          variant="outlined"
          size="small"
        >
          <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
          {processList.map((option) => (
            <option key={option.id} value={option.id}>
              {option.processName}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid
        item
        sm={6}
        md={4}
        xs={12}
        sx={!disPlayField.includes('একটি অফিস') ? { display: 'none' } : { display: 'visible' }}
      >
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            control={
              <Switch
                checked={isSingleOfficeSync}
                onChange={handleInputChangeIsSingleOfficeSync}
                name="isSingleOfficeSync"
                disabled={singleOfficeSyncDisableStatus}
              />
            }
            label="শুধুমাত্র একটি অফিসের ডাটা প্রসেস ?"
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      {isSingleOfficeSync ? (
        <>
          <Grid item sm={6} md={4} xs={12}>
            <TextField
              fullWidth
              label={star('দপ্তর লেয়ার')}
              id="officeLayer"
              name="officeLayer"
              select
              SelectProps={{ native: true }}
              onChange={(e) => handleInputChangeDoptorLayer(e)}
              disabled={layerDisableStatus}
              type="text"
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
              value={layerId != null ? layerId : ' '}
            >
              {/* <option value="নির্বাচন করুন">- নির্বাচন করুন -</option> */}
              {layerList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item sm={6} md={4} xs={12} key="office">
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="officeName"
              onChange={(event, value) => {
                if (!value) {
                  setOfficeObj({
                    id: '',
                    label: '',
                  });
                } else {
                  value &&
                    value?.id &&
                    setOfficeObj({
                      id: value.id,
                      label: value.label,
                    });
                  setSelectedValue({
                    ...selectedValue,
                    officeId: parseInt(value.id),
                  });
                  layerId && setSubmitButtonStatus(false);
                  !value?.id && setSubmitButtonStatus(true);
                }
              }}
              options={officeList.map((option) => {
                return {
                  id: option.id,
                  label: option.nameBn,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={officeObj.id === '' ? star('অফিসের নাম') : star('অফিসের নাম')}
                  variant="outlined"
                  size="small"
                />
              )}
              value={officeObj}
              disabled={officeDisableStatus}
            />
          </Grid>
        </>
      ) : (
        ''
      )}

      <Grid lg={12} container px={2} py={1}>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('জেলা অফিস') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label={star('জেলা অফিস')}
            name="district"
            id="district"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeDistrict(e)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={districtId != null ? districtId : ''}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {districtData?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.officeNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('উপজেলা অফিস') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label={star('উপজেলা অফিস')}
            id="upozilla"
            name="upazila"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeOffice(e)}
            type="text"
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            // value={memberApporval.upazila}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            <option value="ALL">সকল অফিস</option>
            {upozillaData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.officeNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('প্রকল্প') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label={star('প্রকল্পের  নাম')}
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeProject(e)}
            type="text"
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={projectId}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projectName.map((option) => (
              <option key={option.id} value={option.id}>
                {option.projectNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('সমিতি') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="সমিতি"
            name="serviceId"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeSamity}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {samity?.map((option) => (
              <option
                key={option.id}
                value={JSON.stringify({
                  id: option.id,
                  samityName: option.samityName,
                })}
              >
                {option.samityName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('সদস্য') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="সদস্য "
            name="serviceId"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeMember}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {member?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameBn}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('একাউন্ট নম্বর') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="একাউন্ট নম্বর "
            name="accountNumber"
            id="accountNumber"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeAccountNumber}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {accountInfo?.map((option) => (
              <option key={option.accountId} value={option.accountId}>
                {option.accountNo}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('ট্রান্সাকশন নম্বর') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="ট্রান্সাকশন নম্বর"
            name="tranId"
            id="tranId"
            type="text"
            required
            onChange={handleInputChangeTranId}
            variant="outlined"
            size="small"
          ></TextField>
        </Grid>

        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('জিএল এর ধরন') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="জিএল এর ধরন "
            name="glType"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeGlType}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {glType.map((option) => {
              return (
                <option key={option.id} value={option.glacType}>
                  {option.glacName}
                </option>
              );
            })}
          </TextField>
        </Grid>
        <Grid
          item
          lg={12}
          md={4}
          xs={12}
          sx={!disPlayField.includes('তারিখ') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={star('তারিখ')}
              name="startDate"
              value={startDate}
              disabled=""
              onChange={(e) => handleDateChangeEx(e)}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" style={{ backgroundColor: '#FFF' }} />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item sx={!open ? { display: 'none' } : { display: 'visible', mb: 1.5 }}>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
        <Grid item className="btn-container" xs={12} md={12} sm={12} sx={{ textAlign: 'center' }}>
          <Tooltip title="সংরক্ষন করুন">
            <Button
              disabled={submitButtonStatus}
              variant="contained"
              className="btn btn-primary"
              target="_blank"
              sx={{ mr: 1 }}
              onClick={processGenerator}
            >
              <SyncIcon sx={{ display: 'block' }} />
              &nbsp;&nbsp;প্রসেস করুন
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
}
