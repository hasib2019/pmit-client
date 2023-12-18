import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { Button, Grid, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import DatePicker from '@mui/lab/DatePicker';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';
import {
  // districtRoute,
  // upazilaRoute,
  // doptorDetails,
  // upozilaOffice,
  // districtOffice,
  customerAccountInfo,
  getAllSamity,
  getMemberBySamity,
  // getJasperReport,
  glListRoute,
  loanProject2,
  // officeByUserToken,
  samityByOffice,
  samityReportGet,
} from '../../../../url/AccountsApiLIst';

import star from 'components/utils/coop/star';
import { urlGenerator } from './reportUrl';
// import { date } from 'joi';
// import { componentReportBy } from "../../../../url/ReportApi";
import { liveIp } from 'config/IpAddress';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { getAllDoptor, getOfficeLayer, officeName } from '../../../../url/ApiList';
export function ReportG({ reportBunchName }) {
  const [url] = useState();
  const [reportList, setReportList] = useState([]);
  // const [parameter, setParameter] = useState([]);
  const [disPlayField, setDisplayField] = useState([]);
  const [report, setReport] = useState();
  const [samity, setSamity] = useState([]);
  const [member, setMember] = useState([]);
  const [doptor, setDoptor] = useState(null);
  const [setProject] = useState(0);
  const [setOffice] = useState([]);
  const [setOfficeAlive] = useState(false);
  const [setUpazilaOfficeAlive] = useState(false);
  const [setProjectAlive] = useState(false);
  const [doptorAlive, setDoptorAlive] = useState(false);
  const [setMemberAlive] = useState(false);
  const [setSamityAlive] = useState(false);
  const [userNameAlive, setUserNameAlive] = useState(false);
  const [startDateAlive, setStartDateAlive] = useState(false);
  const [toDateAlive, setToDateAlive] = useState(false);
  const [fromDateAlive, setFromDateAlive] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [pdfActive, setPdfActive] = useState(false);
  const [projectId] = useState(null);
  const [projectName, setProjectName] = useState([]);
  // const [ setDistrictId] = useState(null);
  // const [ setDistrictData] = useState([]);
  // const [upozillaId, setUpozillaId] = useState(null);
  const [setUpozilaData] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);
  const [startDate, setStartDate] = useState();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [userName, setUserName] = useState(null);
  const [glType, setGlType] = useState([]);
  const [glTypeAlive, setGlTypeAlive] = useState(false);
  const [setTransactionDateAlive] = useState(false);
  const [setTransactionIdAlive] = useState(false);
  const [setDoptorId] = useState('');
  const [doptorList, setDoptorList] = useState([]);
  const [layerList, setLayerList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [layerId, setLayerId] = useState(null);

  const [officeDisableStatus, setOfficeDisableStatus] = useState(false);
  // const [projectDisableStatus, setProjectDisableStatus] = useState(false);
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  // const officeId = getTokenData?.officeId;
  const DoptorId = getTokenData?.doptorId;
  const config = localStorageData('config');
  const componentName = localStorageData('componentName');

  useEffect(() => {
    setDoptorId(DoptorId);
    if (DoptorId !== 1) {
      getLayerList(DoptorId);
    }
  }, [DoptorId]);

  useEffect(() => {
    getSamityReport();
    getProject();
  }, []);

  useEffect(() => {
    getSamityReport();
  }, [disPlayField]);

  useEffect(() => {
    setOffice([]);
    setSamity([]);
    setProject([]);
    setMember([]);
    setUpozilaData([]);
    setProjectName([]);
    setAccountInfo([]);
    setStartDateAlive(false);
    setUserNameAlive(false);
    setDoptorAlive(false);
    setStartDate(null);
    getDoptorList();
    getProject();
  }, [report]);

  useEffect(() => {
    selectedValue.userName = userName;
    setSelectedValue(selectedValue);
  }, [userNameAlive]);

  // useEffect(() => {
  //   getSamityName();
  // }, [officeAlive]);
  // useEffect(() => {}, [projectAlive]);
  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      date: moment(new Date()).format('yyyy-MM-DD'),
    });
  }, [startDateAlive]);

  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      doptorId: doptor,
    });
  }, [doptorAlive]);

  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      fromDate: moment(new Date()).format('yyyy-MM-DD'),
    });
  }, [fromDateAlive]);
  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      toDate: moment(new Date()).format('yyyy-MM-DD'),
    });
  }, [toDateAlive]);
  // useEffect(() => {}, [memberAlive]);
  // useEffect(() => {}, [samityAlive]);

  // useEffect(() => {}, [pdfActive]);

  useEffect(() => {}, [url]);

  useEffect(() => {
    getSamityName();
    getMember();
    if (selectedValue.samityId && selectedValue.projectId && selectedValue.memberId) {
      getAccountNumber(selectedValue.projectId, selectedValue.samityId, selectedValue.memberId);
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
    office: 'অফিস',
    member: 'সদস্য',
    accountId: 'একাউন্ট নম্বর',
    tranId: 'ট্রান্সাকশন নম্বর',
    date: 'তারিখ',
    toDate: 'শেষের তারিখ',
    fromDate: 'শুরুর তারিখ',
    glType: 'জিএল এর ধরন',
    upazilaOffice: 'উপজেলা অফিস',
  };

  const getSamityReport = async () => {
    try {
      const samityReportData = await (await axios.get(samityReportGet + reportBunchName, config)).data.data[0];

      setDoptor(samityReportData.doptorId);
      setUserName(samityReportData.userName);

      let samityReportName = [];

      for (const element of samityReportData.data) {
        let parameter = [];
        let jasparParameter = [];
        for (const e of element.parameter) {
          if (e.status == true) {
            parameter.push(e.paramName);
            jasparParameter.push(e.jasparParamName);
          }
        }

        samityReportName.push({
          id: element.id,
          reportName: element.reportFrontNameBn,
          parameter,
          jasparParameter,
          reportJasperName: element.reportBackName,
        });
      }

      setReportList(samityReportName);
      getDoptorList();
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  // const getDoptor = async () => {
  //   try {
  //     const doptor = await (await axios.get(doptorDetails, config)).data?.data;
  //     (doptor);
  //     setDoptor(doptor);
  //   } catch (ex) {
  //     ("error", ex);
  //   }
  // };
  const getDoptorList = async () => {
    try {
      const doptorInfo = await axios.get(getAllDoptor + '/' + componentName, config);
      const doptorInfoData = doptorInfo.data.data;
      setDoptorList(doptorInfoData);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getLayerList = async (doptorId) => {
    try {
      const layerInfo = await axios.get(getOfficeLayer + '?doptorId=' + doptorId, config);
      const layerInfoData = layerInfo.data.data;
      setLayerList(layerInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };
  const getOfficeList = async (layerId) => {
    try {
      const officeInfo = await axios.get(officeName + '?doptorId=' + doptor + '&layerId=' + layerId, config);
      const officeInfoData = officeInfo.data.data;
      setOfficeList(officeInfoData);
      if (officeInfoData && officeInfoData.length === 1) {
        setSelectedValue({ ...selectedValue, officeId: officeInfoData[0]?.id });
        setOfficeDisableStatus(true);
      }
    } catch (err) {
      errorHandler(err);
    }
  };
  // const getOffice = async () => {
  //   try {
  //     const result = await (
  //       await axios.get(officeByUserToken, config)
  //     ).data.data;

  //     setOffice(result);
  //   } catch (ex) {
  //     `error:${ex}`;
  //   }
  // };

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
      } else {
        samityData = await (await axios.get(getAllSamity, config)).data.data;
      }
      setSamity(samityData);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const getMember = async () => {
    try {
      if (parseInt(selectedValue.samityId) > 0) {
        const memberData = await (await axios.get(getMemberBySamity + selectedValue.samityId, config)).data.data.data;
        setMember(memberData);
      }
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject2, config);
      let projectList = project.data.data;
      setProjectName(projectList);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  // const getDistrict = async () => {
  //   try {
  //     const district = await axios.get(districtOffice, config);
  //     let districtList = district.data.data;
  //     if (districtList.length == 1) {
  //       setDistrictId(districtList[0].id);
  //       document.getElementById('district').setAttribute('disabled', 'true');
  //       getupazila(districtList[0].id);
  //     }
  //     setDistrictData(districtList);
  //   } catch (error) {
  //     if (error.response) {
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, 'Error', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', 'Error', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), 'Error', 5000);
  //     }
  //   }
  // };
  // let getupazila = async (Disid) => {
  //   try {
  //     let upozila = await axios.get(upozilaOffice, config);
  //     let data = upozila.data.data;

  //     setUpozilaData(data);
  //   } catch (error) {
  //     if (error.response) {
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, 'Error', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', 'Error', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), 'Error', 5000);
  //     }
  //   }
  // };

  const getAccountNumber = async (projectId, samityId, customerId) => {
    try {
      const customerAccountData = await (
        await axios.get(
          customerAccountInfo + `?projectId=${projectId}&samityId=${samityId}&customerId=${customerId}`,
          config,
        )
      ).data;
      setAccountInfo(customerAccountData.data);

      // if (customerAccountData.data.length == 1) {
      //   document
      //     .getElementById("accountNumber")
      //     .setAttribute("disabled", "true");
      // }
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const getGlType = async () => {
    try {
      const result = await (await axios.get(glListRoute + '?isPagination=false&parentId=0', config)).data.data;
      setGlType(result);
    } catch (ex) {
      `error:${ex}`;
    }
  };
  const handleInputChangeDoptor = (e) => {
    const { value } = e.target;
    setLayerId(null);
    setLayerList([]);
    setOfficeList([]);
    setSamity([]);
    setMember([]);
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
      memberId: null,
    });
    setOfficeDisableStatus(false);
    if (value && value != 'নির্বাচন করুন') {
      setDoptor(value);
      getLayerList(value);
      setDoptorAlive(true);
    } else {
      setDoptor(null);
    }
    // getupazila(value);
  };
  const handleInputChangeDoptorLayer = (e) => {
    setOfficeList([]);
    setSamity([]);
    setMember([]);
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
      memberId: null,
    });
    setOfficeDisableStatus(false);
    const { value } = e.target;
    // getLayerList(value);
    // getupazila(value);
    if (value && value != 'নির্বাচন করুন') {
      setLayerId(value);
      getOfficeList(value);
    }
  };
  const handleInputChangeOffice = (e) => {
    if (reportBunchName == 'reject_application') {
      setPdfActive(false);
    }
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setSelectedValue({
        ...selectedValue,
        officeId: parseInt(value),
        samityId: null,
      });
      setMember([]);
    }
  };
  const handleInputChangeReport = (e) => {
    const { value } = e.target;
    let pera = [];

    setReport(reportList[parseInt(value) - 1].reportName);
    setSelectedValue({
      reportName: reportList[parseInt(value) - 1].reportName,
    });
    for (const element of reportList) {
      if (element.id == value) {
        for (const p of element.parameter) {
          pera.push(parameterBn[p]);
          if (p == 'office') {
            setOfficeAlive(true);
          }
          if (p == 'upazilaOffice') {
            setUpazilaOfficeAlive(true);
          }
          if (p == 'samity') {
            setSamityAlive(true);
          }
          if (p == 'member') {
            setMemberAlive(true);
          }
          if (p == 'doptor') {
            setDoptorAlive(true);
          }
          if (p == 'project') {
            setProjectAlive(true);
          }
          // if (p == 'accountId') {
          // }

          if (p == 'userName') {
            setUserNameAlive(true);
          }
          if (p == 'date') {
            setStartDateAlive(true);
          }
          if (p == 'fromDate') {
            setFromDateAlive(true);
          }
          if (p == 'toDate') {
            setToDateAlive(true);
          }
          if (p == 'glType') {
            setGlTypeAlive(true);
          }
          if (p == 'tranId') {
            setTransactionIdAlive(true);
          }
          if (p == 'date') {
            setTransactionDateAlive(true);
          }
        }
      }
    }
    setDisplayField(pera);
  };
  const handleInputChangeSamity = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, samityId: parseInt(value) });
  };
  // const handleInputChangeDoptor = (e) => {
  //   const { name, value } = e.target;
  //   ("doptorValue", selectedValue);
  //   setSelectedValue({ ...selectedValue, doptorId: parseInt(value) });
  // };
  // const handleInputChangeOffice = (e) => {
  //   const { name, value } = e.target;
  //   "officeId", value;
  //   setSelectedValue({ ...selectedValue, officeId: parseInt(value) });
  // };
  const handleInputChangeProject = (e) => {
    const { value } = e.target;
    // setProjectId(value);
    setSelectedValue({ ...selectedValue, projectId: parseInt(value) });
  };
  const handleInputChangeMember = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, memberId: parseInt(value) });
  };

  // const handleInputChangeProjectName = (e) => {
  //   const { name, value } = e.target;
  //   setProjectId(value);
  // };

  // const handleInputChangeDistrict = (e) => {
  //   const { name, value } = e.target;
  //   setDistrictId(value);
  //   // getUpozilaData(value);
  // };

  const handleInputChangeAccountNumber = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, accountId: parseInt(value) });

    // getSamity(projectId, districtId, value);
  };

  const handleInputChangeTranId = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, tranId: value });
  };

  const handleDateChangeEx = (e) => {
    // const { name, value } = e.target;

    const date = new Date(e);
    // setStartDate(new Date(e));

    setSelectedValue({
      ...selectedValue,
      date: moment(date).format('yyyy-MM-DD'),
    });
    setStartDate(moment(date).format('yyyy-MM-DD'));
  };

  const handleFromDateChangeEx = (e) => {
    // const { name, value } = e.target;
    // ("e", e);

    // const date = new Date(e);
    // // setStartDate(new Date(e));

    setFromDate(moment(e).format('yyyy-MM-DD'));

    setSelectedValue({
      ...selectedValue,
      fromDate: moment(e).format('yyyy-MM-DD'),
    });
  };

  const handleToDateChangeEx = (e) => {
    // const { name, value } = e.target;

    // const date = new Date(e);
    // // setStartDate(new Date(e));

    setToDate(moment(e).format('yyyy-MM-DD'));

    setSelectedValue({
      ...selectedValue,
      toDate: moment(e).format('yyyy-MM-DD'),
    });
  };

  const handleInputChangeGlType = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, glType: value });
  };

  const reportGenerator = async (comName) => {
    let selectTedReportList;
    for (const element of reportList) {
      if (selectedValue.reportName == element.reportName) {
        selectTedReportList = element;
      }
    }
    const componentReportBy = liveIp + 'jasper/' + comName + '/';
    const url = urlGenerator(selectedValue, selectTedReportList, componentReportBy);
    setFromDate(null);
    setToDate(null);
    try {
      window.open(url);
    } catch (error) {
      //
    }
  };

  return (
    <>
      <Grid container>
        <Grid container spacing={2.5} my={2} px={2} justifyContent="flex-start">
          <Grid item sm={6} md={4} xs={12}>
            <TextField
              fullWidth
              label={star('রিপোর্ট')}
              name="report"
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeReport}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {reportList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.reportName}
                </option>
              ))}
            </TextField>
          </Grid>

          {DoptorId == 4 || DoptorId == 8 ? (
            ''
          ) : (
            <>
              {/* <Grid item sm={6} md={4} xs={12}>
                <TextField
                  fullWidth
                  label={star("জেলা অফিস")}
                  name="district"
                  id="district"
                  select
                  SelectProps={{ native: true }}
                  onChange={(e) => handleInputChangeDistrict(e)}
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: "#FFF" }}
                  value={districtId != null ? districtId : " "}
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {districtData.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.officeNameBangla}
                    </option>
                  ))}
                </TextField>
              </Grid> */}
              {DoptorId == 1 ? (
                <Grid item sm={6} md={4} xs={12}>
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
                    value={doptor != null ? doptor : ' '}
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
              <Grid
                item
                md={4}
                sm={6}
                xs={12}
                sx={!disPlayField.includes('উপজেলা অফিস') ? { display: 'none' } : { display: 'visible' }}
              >
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
              <Grid
                item
                md={4}
                sm={6}
                xs={12}
                sx={!disPlayField.includes('উপজেলা অফিস') ? { display: 'none' } : { display: 'visible' }}
              >
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
                  value={selectedValue?.officeId ? selectedValue.officeId : 'নির্বাচন করুন'}
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: '#FFF' }}
                  // value={memberApporval.upazila}
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {officeList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.nameBn}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </>
          )}
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('প্রকল্প') ? { display: 'none' } : { display: 'visible' }}
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
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('সমিতি') ? { display: 'none' } : { display: 'visible' }}
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
              {samity.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.samityName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('সদস্য') ? { display: 'none' } : { display: 'visible' }}
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
              {member.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('একাউন্ট নম্বর') ? { display: 'none' } : { display: 'visible' }}
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
              {accountInfo.map((option) => (
                <option key={option.accountId} value={option.accountId}>
                  {option.accountNo}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('ট্রান্সাকশন নম্বর') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('ট্রান্সাকশন নম্বর')}
              name="tranId"
              id="tranId"
              type="text"
              onChange={handleInputChangeTranId}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('জিএল এর ধরন') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('লেজারের ধরন')}
              name="glType"
              // required
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeGlType}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {glType.map((option) => {
                'option', option;
                return (
                  <option key={option.id} value={option.glacType}>
                    {option.glacName}
                  </option>
                );
              })}
            </TextField>
          </Grid>
          <FromControlJSON
            arr={[
              {
                labelName: star('তারিখ'),
                onChange: handleDateChangeEx,
                value: startDate,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                md: 4,
                sm: 6,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('তারিখ') ? true : false,

                errorMessage: '',
              },
              {
                labelName: star('শুরুর তারিখ'),
                onChange: handleFromDateChangeEx,
                value: fromDate,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                xl: 12,
                lg: 12,
                md: 4,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('শুরুর তারিখ') ? true : false,

                errorMessage: '',
              },
              {
                labelName: star('শেষের তারিখ'),
                onChange: handleToDateChangeEx,
                value: toDate,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                xl: 12,
                lg: 12,
                md: 4,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('শেষের তারিখ') ? true : false,

                errorMessage: '',
              },
            ]}
          />
          <Grid
            item
            xs={12}
            md={12}
            sm={12}
            mx={2}
            my={2}
            sx={({ textAlign: 'center' }, disPlayField.length == 0 ? { display: 'none' } : { display: 'visible' })}
          >
            <Tooltip title="সংরক্ষন করুন">
              <Button
                variant="contained"
                className="btn btn-primary"
                target="_blank"
                sx={{ mr: 1 }}
                onClick={() => reportGenerator(localStorageData('componentName'))}
                startIcon={<WysiwygIcon />}
              >
                {' '}
                রিপোর্ট দেখুন
              </Button>
            </Tooltip>
          </Grid>
          <Grid lg={12} container spacing={1.5} px={2} py={1}>
            <Grid
              item
              xs={12}
              md={12}
              sm={12}
              mx={2}
              my={2}
              sx={({ textAlign: 'center' }, !pdfActive ? { display: 'none' } : { display: 'visible' })}
            >
              {/* <iframe
              src={baseData}
              frameBorder="0"
              width="100%"
              height="650px"
              allow="fullscreen"
            ></iframe> */}

              {/* <object
              data={"data:application/pdf;base64," + baseData}
              width="300"
              height="200"
            ></object> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
