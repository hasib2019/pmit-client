
import SyncIcon from '@mui/icons-material/Sync';
import { Button, Grid, TextField, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  GlAcList,
  childOffice,
  officeLayer,
  processGet,
  projectList,
  samityByOffice
} from '../../../url/coop/ApiList';

import {
  associationSyncApi,
  doptorSyncApi,
  geoDataSyncApi,
  masterDataSyncApi,
  roleSyncApi,
} from '../../../url/common/ApiList';

import star from 'components/utils/coop/star';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';

export function Process({ processName }) {
  const [url] = useState();
  const [processList, setProcessList] = useState([]);
  const [disPlayField, setDisplayField] = useState([]);
  const [process, setProcess] = useState();
  const [samity, setSamity] = useState([]);
  const [member, setMember] = useState([]);
  const [doptor, setDoptor] = useState(null);
  // const [project, setProject] = useState(0);
  // const [office, setOffice] = useState([]);
  // const [districtOfficeAlive, setDistrictOfficeAlive] = useState(false);
  // const [officeAlive, setOfficeAlive] = useState(false);
  // const [projectAlive, setProjectAlive] = useState(false);
  const [doptorAlive, setDoptorAlive] = useState(false);
  // const [memberAlive, setMemberAlive] = useState(false);
  const [samityAlive, setSamityAlive] = useState(false);
  const [userNameAlive, setUserNameAlive] = useState(false);
  // const [startDateAlive, setStartDateAlive] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  // const [pdfActive, setPdfActive] = useState(false);
  const [projectId] = useState(null);
  const [projectName, setProjectName] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  // const [upozillaId, setUpozillaId] = useState(null);
  const [upozillaData, setUpozilaData] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);
  const [startDate] = useState(new Date());
  const [userName, setUserName] = useState(null);
  const [glType, setGlType] = useState([]);
  const [glTypeAlive, setGlTypeAlive] = useState(false);
  // const [jioIds, setJioIds] = useState({
  //   districtId: null,
  //   upazillaId: null,
  // });

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  // const handleToggle = () => {
  //   setOpen(!open);
  // };

  const config = localStorageData('config');

  useEffect(() => {
    getProcess();
    getDistrict();
  }, []);

  useEffect(() => {
    getProcess();
  }, [disPlayField]);

  useEffect(() => {
    if (districtData.length > 1) {
      setDistrictData([]);
      setDistrictId(null);
    }
    // setOffice([]);
    setSamity([]);
    // setProject([]);
    setMember([]);
    setDoptorAlive(false);
    setUpozilaData([]);
    setProjectName([]);
    setAccountInfo([]);
    // setPdfActive(false);
    getDistrict();
    getProject();
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

  //   useEffect(() => {
  //     setSelectedValue({
  //       ...selectedValue,
  //       date: moment(new Date()).format("yyyy-MM-DD"),
  //     });
  //   }, [startDateAlive]);

  useEffect(() => { }, [url]);

  useEffect(() => {
    if (samityAlive && selectedValue.officeId) {
      getSamityName();
    }
  }, [selectedValue]);

  useEffect(() => {
    setMember([]);
  }, [projectId]);

  useEffect(() => {
    if (glTypeAlive) {
      getGlType();
    }
  }, [glTypeAlive]);

  const parameterBn = {
    samity: 'সমিতি',
    doptor: 'দপ্তর',
    project: 'প্রকল্প',
    // office: 'অফিস',
    member: 'সদস্য',
    accountId: 'একাউন্ট নম্বর',
    tranId: 'ট্রান্সাকশন নম্বর',
    date: 'তারিখ',
    glType: 'লেজার / হিসাবের ধরন',
    office: 'উপজেলা অফিস',
    districtOffice: 'জেলা অফিস',
    showprocess: 'রিপোর্ট দেখুন ',
  };

  const getProcess = async () => {
    try {
      const processData = await (await axios.get(processGet + processName, config)).data.data[0];

      setDoptor(processData.doptorId);
      setUserName(processData.userName);

      let processConvertedArr = [];

      for (const element of processData.data) {
        let parameter = [];
        for (const e of element.parameter) {
          if (e.status == true) {
            parameter.push(e.paramName);
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
      'error', error;
      errorHandler(error);
    }
  };

  const getSamityName = async () => {
    try {
      let samityData;
      if (
        (parseInt(selectedValue.officeId) > 0 && parseInt(selectedValue.projectId) == 0) ||
        (parseInt(selectedValue.officeId) > 0 && !selectedValue.projectId)
      ) {
        samityData = await (await axios.get(samityByOffice + selectedValue.officeId, config)).data.data;
      } else if (parseInt(selectedValue.officeId) > 0 && parseInt(selectedValue.projectId) > 0) {
        samityData = await (
          await axios.get(samityByOffice + selectedValue.officeId + '&projectId=' + selectedValue.projectId, config)
        ).data.data;
      }

      samityData.push({ id: samityData.length + 1, samityName: 'all' });
      setSamity(samityData);
    } catch (error) {
      'error', error;
      errorHandler(error);
    }
  };

  const getProject = async () => {
    try {
      const project = await axios.get(projectList + 'project?isPagination=false');
      let projectValues = project.data.data;

      setProjectName(projectValues);
    } catch (error) {
      'error', error;
      errorHandler(error);
    }
  };

  const getDistrict = async () => {
    try {
      const districtOffice = await axios.get(officeLayer, config);
      let districtList = districtOffice.data.data;

      if (districtList.length == 1) {
        setDistrictId(districtList[0].id);
        document?.getElementById('district').setAttribute('disabled', 'true');
        getupazila(districtList[0].id);
      }
      setDistrictData(districtList);
    } catch (error) {
      errorHandler(error);
    }
  };
  let getupazila = async (Disid) => {
    try {
      let upozila = await axios.get(childOffice + '?districtOfficeId=' + Disid, config);
      let data = upozila.data.data;

      setUpozilaData(data);
    } catch (error) {
      'error', error;
      errorHandler(error);
    }
  };

  const getGlType = async () => {
    try {
      const result = await (await axios.get(GlAcList + '?isPagination=false&parentId=0', config)).data.data;
      setGlType(result);
    } catch (ex) {
      //
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

    for (const element of processList) {
      if (element.id == value) {
        for (const p of element.parameter) {
          pera.push(parameterBn[p]);
          // if (p == 'districtOffice') {
          //   setDistrictOfficeAlive(true);
          // }
          // if (p == 'office') {
          //   setOfficeAlive(true);
          // }
          if (p == 'samity') {
            setSamityAlive(true);
          }
          // if (p == 'member') {
          //   setMemberAlive(true);
          // }
          if (p == 'doptor') {
            setDoptorAlive(true);
          }
          // if (p == 'project') {
          //   setProjectAlive(true);
          // }
          // if (p == 'accountId') {
          // }

          if (p == 'userName') {
            setUserNameAlive(true);
          }
          // if (p == 'date') {
          //   setStartDateAlive(true);
          // }
          if (p == 'glType') {
            setGlTypeAlive(true);
          }
        }
      }
    }
    setDisplayField(pera);
  };
  const handleInputChangeSamity = (e) => {
    const { value } = e.target;
    const data = JSON.parse(value);

    const id = data.samityName == 'all' ? 0 : data.id;
    setSelectedValue({ ...selectedValue, samityId: parseInt(id) });
  };

  const handleInputChangeOffice = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, officeId: parseInt(value) });
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
    // getUpozilaData(value);
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
    // let selectedProcessList;
    // for (const element of processList) {
    //   if (selectedValue.processName == element.processName) {
    //     selectedProcessList = element;
    //   }
    // }

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
      console.log({ p })
      const result = await callCorrectApiRequestAccordingToProcess(p, config);
      if (result.status == 200) {
        setOpen(false);
        NotificationManager.success(result.data.message, '', 5000);
      }
    } catch (error) {
      'error', error;
      errorHandler(error);
    }
  };

  return (
    <>
      <Grid container my={2} px={2} justifyContent="flex-start">
        <Grid
          lg={4}
          container
          spacing={2.5}
          px={2}
          py={1}
        // sx={{ backgroundColor: "red" }}
        >
          <Grid item lg={12} md={4} xs={12}>
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
        </Grid>
        <Grid lg={4} container px={2} py={1}>
          <Grid item lg={12} md={4} xs={12}>
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
              value={districtId || 0}
              sx={!disPlayField.includes('জেলা অফিস') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {districtData?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={12} md={4} xs={12}>
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
              sx={!disPlayField.includes('উপজেলা অফিস') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {upozillaData.map((option) => (
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
            sx={!disPlayField.includes('লেজার / হিসাবের ধরন') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
          >
            <TextField
              fullWidth
              label="লেজার / হিসাবের ধরন "
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
          <Grid
            item
            xs={12}
            mx={2}
            sx={
              { textAlign: 'center' }
              // disPlayField.length == 0
              //   ? { display: "none" }
              //   : { display: "visible", mb: 1.5 }
            }
          >
            <Tooltip title="প্রক্রিয়া করুন">
              <Button
                variant="contained"
                className="btn btn-primary"
                target="_blank"
                onClick={processGenerator}
                startIcon={<SyncIcon />}
              >
                {' '}
                প্রক্রিয়া করুন
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
