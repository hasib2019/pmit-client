import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { Grid, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  codeMaster,
  districtRoute,
  fieldOffRoute,
  loanProject,
  loanSamityReg,
  milkvitaRoute,
  officeIdRoute,
  specificApplication,
  unionRoute,
  upazilaRoute
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';
import { bangToEng, engToBang } from '../member-registration/validator';



const weeklyTypeArray = [
  {
    value: '1',
    label: 'প্রথম সপ্তাহ',
  },
  {
    value: '2',
    label: 'দ্বিতীয় সপ্তাহ',
  },
  {
    value: '3',
    label: 'তৃতীয় সপ্তাহ',
  },
  {
    value: '4',
    label: 'চতুর্থ সপ্তাহ',
  },
];
const meetingTypeArray = [
  {
    value: 'M',
    label: 'মাসিক',
  },
  {
    value: 'W',
    label: 'সাপ্তাহিক',
  },
];

const SamityRegFromMilkvita = () => {
  const config = localStorageData('config');
  const componentName = localStorageData('componentName');
  const [day, setDay] = useState('');
  const router = useRouter();
  const [labelForSamity] = useState('সমিতির নাম');
  // const [permissionArray, setPermissionArray] = useState([]);
  const [projects, setProjects] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [unionList, setUnionList] = useState([]);
  const [district, setDistrict] = useState(null);
  // const [union, setUnion] = useState(null);
  const [samityList, setSamityList] = useState([]);
  const [officeId, setOfficeId] = useState();
  const [disableProject, setDisableProject] = useState('');
  const [disableDistrict, setDisableDistrict] = useState('');
  const [disableUpazila, setDisableUpazila] = useState('');
  // const [disableUnion, setDisableUnion] = useState('');
  const [coopSamityInfo, setCoopSamityInfo] = useState({
    projectName: '',
    samityName: '',
    samityId: '',
    officeName: '',
    district: ' ',
    upaCityId: ' ',
    upaCityType: '',
    upaCityIdType: '',
    uniThanaPawIdType: ' ',
    uniThanaPawId: '',
    village: '',
    address: '',
    meetingDay: '',
    weeklyType: '',
    shareAmount: '',
    sharePrice: '',
    foCode: '',
  });
  // const [update, setUpdate] = useState(false);
  const [fieldOfficersList, setFieldOfficersList] = useState([]);
  const [formErrors] = useState({
    projectName: '',
    samityName: '',
    foCode: '',
    district: '',
    upazila: '',
    meetingDay: '',
  });

  useEffect(() => {
    getOfficeId();
    getDay();
    getSamityList();
    getUpazila();
    getFieldOfficers();
    getDistrict();
    getProject();
  }, []);
  useEffect(() => {
    if (router.query.data) {
      getSamityInfo();
    }
  }, []);
  let getSamityInfo = async () => {
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);
    try {
      //Value=2 For New samity And value=1 For Approved Samity
      let samityInfo = await axios.get(specificApplication + result.id, config);

      let samityObj = samityInfo.data.data.basic;
      let samityObjSetup = samityInfo.data.data.setup;
      let objLength = samityObj && Object.keys(samityObj).length;

      if (objLength >= 1) {
        // setUpdate(true);
        setDisableProject(true);
      }
      await getSamityList();
      await getUnion(samityObj.upaCityId);
      setCoopSamityInfo({
        address: samityObj.address,
        projectName: samityInfo.data.data.projectId,
        samityId: samityObj.originSamityId,
        samityName: samityObj.samityName,
        meetingType: samityObj.meetingType,
        meetingDay: samityObj.meetingDay,
        district: samityObj.districtId,
        foCode: samityObj.foCode,
        isSme: samityObj.isSme,
        upaCityIdType: samityObj.upaCityId + ',' + samityObj.upaCityType,
        uniThanaPawIdType: samityObj.uniThanaPawId + ',' + samityObj.uniThanaPawType,
        upaCityId: samityObj.upaCityId,
        upaCityType: samityObj.upaCityType,
        uniThanaPawId: samityObj.uniThanaPawId,
        uniThanaPawType: samityObj.uniThanaPawType,
        weeklyType: samityObj.weekPosition,
        sharePrice: samityObjSetup.shareAmount,
      });
      //  setProjectInfo(projectInfo.data.data.data)
    } catch (error) {
      if (error.response) {
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  let getDay = async () => {
    try {
      let dayInfo = await axios.get(codeMaster + '?codeType=MET', config);
      if (dayInfo.data.data) {
        setDay(dayInfo.data.data);
      }
    } catch (error) {
      errorHandler(error)
    }
  };

  let getOfficeId = async () => {
    try {
      let officeInfo = await axios.get(officeIdRoute, config);
      if (officeInfo.data.data) {
        setOfficeId(officeInfo.data.data.id);
      }
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getFieldOfficers = async () => {
    try {
      let fieldOffList = await axios.get(fieldOffRoute, config);
      if (fieldOffList.data.data) {
        setFieldOfficersList(fieldOffList.data.data);
      }
    } catch (error) {
      errorHandler(error)
    }
  };
  let getDistrict = async () => {
    try {
      let districtList = await axios.get(districtRoute + '?allDistrict=true', config);
      if (districtList.data.data.length == 1) {
        setDistrict(districtList.data.data[0].id);
        setDisableDistrict(true);
      }
      setDistrictList(districtList.data.data);
    } catch (error) {
      errorHandler(error)
    }
  };

  let getUpazila = async () => {
    try {
      let upazilaList = await axios.get(upazilaRoute + '?allUpazila=true', config);
      let upazilaArray = upazilaList.data.data;
      // let newUpazilaList = upazilaArray.map((obj, i) => {
      //   obj["upaCityIdType"] = obj["upaCityId"] + "," + obj["upaCityType"];
      //   return obj;
      // });
      if (upazilaArray.length == 1) {
        // setUpazila(upazilaArray[0].upaCityId);
        setDisableUpazila(true);
        getUnion(upazilaArray[0].upaCityId);
      }
      setUpazilaList(upazilaArray);
    } catch (error) {
      errorHandler(error)
    }
  };

  let getUnion = async (upaId) => {
    try {
      let unionList = await axios.get(unionRoute + '?upazila=' + upaId + '&type=UPA&address=1', config);
      let unionArray = unionList.data.data;
      let newUnionList = unionArray.map((obj) => {
        obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
        return obj;
      });
      if (newUnionList.length == 1) {
        // setUnion(newUnionList[0].uniThanaPawIdType);
        // setDisableUnion(true);
      }
      setUnionList(newUnionList);
    } catch (error) {
      errorHandler(error)
    }
  };
  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);
      if (projectData.data.data.length == 1) {
        setCoopSamityInfo({
          ...coopSamityInfo,
          projectName: projectData.data.data[0].id,
        });
        setDisableProject(true);
        setTimeout(() => {
          getSamityList(projectData.data.data[0].id, officeId), 5;
        });
      }
      setProjects(projectData.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getSamityList = async () => {
    try {
      let samityRespData = await axios.get(milkvitaRoute, config);

      setSamityList(samityRespData.data.data);
    } catch (error) {
      errorHandler(error)
    }
  };
  //   let checkMandatory = () => {

  //     let flag = true;

  //     let newObj = {}
  //     if (coopSamityInfo.projectName.length == 0 || coopSamityInfo.projectName == "নির্বাচন করুন") {
  //       flag = false;
  //       newObj.projectName = "প্রকল্প নির্বাচন করুন"
  //     }

  //     if (coopSamityInfo.uniThanaPawIdType.length == 0|| coopSamityInfo.uniThanaPawIdType == "নির্বাচন করুন") {
  //       flag = false;
  //       newObj.union = "ইউনিয়ন নির্বাচন করুন"
  //     }

  //     if (coopSamityInfo.samityName.length == 0 || coopSamityInfo.samityName=="নির্বাচন করুন")
  //     {
  //       flag = false;
  //       newObj.samityName = "সমিতি নির্বাচন করুন"
  //     }

  //     if (coopSamityInfo.foCode.length == 0 || coopSamityInfo.foCode == "নির্বাচন করুন") {
  //       flag = false;
  //       newObj.foCode = "মাঠ কর্মী নির্বাচন করুন"
  //     }

  //     if (coopSamityInfo.meetingDay.length == 0 || coopSamityInfo.meetingDay == "নির্বাচন করুন") {
  //       flag = false;
  //       newObj.meetingDay = "মিটিং দিন নির্বাচন করুন"
  //     }

  //     ("New Object=======", newObj);

  //     //  if(coopSamityInfoFromNormal.meetingDay.length==0||coopSamityInfoFromNormal.meetingDay=="নির্বাচন করুন")
  //     //  {
  //     //   flag = false;
  //     //   newObj.meetingDay="মিটিং দিন নির্বাচন করুন"
  //     //  }
  //     for (const key in formErrors) {
  //       if (formErrors[key])
  //         flag = false;
  //     }
  //     setTimeout(() => {
  //       setFormErrors(newObj)
  //     }, 200);
  //     return flag;
  //   };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newList, uniThanaPauName;
    if (name == 'samityId' && value != 'নির্বাচন করুন') {
      newList = samityList.filter((particularSamity) => {
        return particularSamity.id == value;
      });

      setTimeout(function () {
        myTimer(newList);
      }, 1);
    } else {
      setCoopSamityInfo({
        ...coopSamityInfo,
        samityName: '',
        sharePrice: '',
        address: '',
        coopRegNumber: '',
      });
    }
    if (name == 'projectName') {
      if (value != 'নির্বাচন করুন') {
        formErrors.projectName = '';
        getSamityList();
      }
    }

    switch (name) {
      case 'district':
        if (value == 'নির্বাচন করুন') {
          formErrors.meetingDay = 'মিটিং দিন নির্বাচন করুন';
        } else {
          formErrors.meetingDay = '';
        }
        break;
      case 'meetingDay':
        setCoopSamityInfo({
          ...coopSamityInfo,
          ['meetingDay']: value,
        });
        if (value == 'নির্বাচন করুন') {
          formErrors.meetingDay = 'মিটিং দিন নির্বাচন করুন';
        } else {
          formErrors.meetingDay = '';
        }
        break;
      case 'foCode':
        if (value == 'নির্বাচন করুন') {
          formErrors.foCode = 'মাঠ কর্মী নির্বাচন করুন';
        } else {
          formErrors.foCode = '';
        }

        break;
      case 'samityName':
        if (value == 'নির্বাচন করুন') {
          formErrors.samityName = 'সমিতি নির্বাচন করুন';
        } else {
          formErrors.samityName = '';
        }

        break;
      case 'upazila':
        if (value == 'নির্বাচন করুন') {
          formErrors.upazila = 'উপজেলা নির্বাচন করুন';
        } else {
          formErrors.upazila = '';
        }
        setCoopSamityInfo({
          ...coopSamityInfo,
          ['upaCityId']: value,
        });
        return;
      case 'union':
        uniThanaPauName = value.split(',');
        setCoopSamityInfo({
          ...coopSamityInfo,
          ['uniThanaPawType']: uniThanaPauName[1],
          ['uniThanaPawId']: uniThanaPauName[0],
          ['uniThanaPawIdType']: value,
        });
        if (value == 'নির্বাচন করুন') {
          formErrors.union = 'ইউনিয়ন নির্বাচন করুন';
        } else {
          formErrors.union = '';
        }
        return;
      case 'sharePrice':
        setCoopSamityInfo({
          ...coopSamityInfo,
          [e.target.name]: e.target.value.replace(/\D/g, ''),
        });
        break;
    }
    if (e.target.name != 'sharePrice')
      setCoopSamityInfo({
        ...coopSamityInfo,
        [e.target.name]: e.target.value,
      });
  };
  let myTimer = async (newList) => {
    setCoopSamityInfo({
      ...coopSamityInfo,
      samityId: newList[0].id,
      sharePrice: engToBang(newList[0].per_share_price),
      samityName: newList[0].name.bn,
      shareAmount: newList[0].number_of_share,
      address: newList[0].detail_address,
      coopRegNumber: newList[0].code,
      district: newList[0].geo_district_id,
      upaCityId: newList[0].geo_upazila_id,
      upaCityType: 'UPA',
      uniThanaPawIdType: '',
      uniThanaPawId: '',
    });
    getUnion(newList[0].geo_upazila_id);
  };
  // let getPermission = async (id) => {
  //   // (id);
  //   if (id != 'নির্বাচন করুন') {
  //     try {
  //       let permissionResp = await axios.get(permissionRoute + '?pageName=samityReg&project=' + id, config);

  //       setLabelForSamity('মিল্কভিটা সমিতি');

  //       setPermissionArray(permissionResp.data.data[0]);
  //       // show();
  //     } catch (error) {
  //       if (error.response) {
  //         // let message = error.response.data.errors[0].message;
  //         // NotificationManager.error(message, "Error", 5000);
  //       } else if (error.request) {
  //         NotificationManager.error('Error Connecting...', '', 5000);
  //       } else if (error) {
  //         NotificationManager.error(error.toString(), '', 5000);
  //       }
  //     }
  //   }
  // };
  let onSubmitData = async (e) => {
    let samityData;
    e.preventDefault();
    // let result = checkMandatory();
    let upaCityIdTypeArray;
    // let uniThanaPawTypeArray;

    let payload = {
      projectId: parseInt(coopSamityInfo.projectName),
      data: {
        basic: {
          samityName: coopSamityInfo.samityName,
          districtId: districtList.length > 1 ? coopSamityInfo.district : district,
          upaCityId: upazilaList.length > 1 ? coopSamityInfo.upaCityId : upaCityIdTypeArray[0],
          upaCityType: 'UPA',
          uniThanaPawId: coopSamityInfo.uniThanaPawId,
          uniThanaPawType: coopSamityInfo.uniThanaPawType,
          address: coopSamityInfo.address,
          meetingType: coopSamityInfo.meetingType,
          meetingDay: coopSamityInfo.meetingDay,
          foCode: coopSamityInfo.foCode,
          ...(coopSamityInfo.meetingType == 'M' && {
            weekPosition: coopSamityInfo.weeklyType,
          }),
          flag: 4,
          originSamityId: coopSamityInfo.samityId,
        },
        setup: {
          shareAmount: bangToEng(coopSamityInfo.sharePrice),
        },
        memberInfo: [],
      },
    };

    // if (result) {
    try {
      samityData = await axios.post(loanSamityReg + '/' + componentName, payload, config);
      // NotificationManager.success(samityData.data.message, "", 5000);
      setCoopSamityInfo({
        projectName: 'নির্বাচন করুন',
        samityName: 'নির্বাচন করুন',
        foCode: 'নির্বাচন করুন',
        address: '',
        meetingDay: 'নির্বাচন করুন',
        district: 'নির্বাচন করুন',
        upaCityIdType: 'নির্বাচন করুন',
        uniThanaPawIdType: 'নির্বাচন করুন',
        sharePrice: '',
      });
      onNextPage(samityData.data.data.id);
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
  };
  const onNextPage = (id) => {
    let base64Data = JSON.stringify({
      id,
      samityId: coopSamityInfo.samityId,
      projectId: coopSamityInfo.projectName,
      uniThanaPawIdType: coopSamityInfo.uniThanaPawIdType,
      uniThanaPawId: coopSamityInfo.uniThanaPawId,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/samity-management/member-registration-milkvita',
      query: {
        data: base64Data,
      },
    });
  };

  // ("ssamity info",coopSamityInfo);

  return (
    <>
      <Grid container className="section">
        <SubHeading>মিল্কভিটা সমিতি</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('প্রকল্পের নাম')}
              name="projectName"
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.projectName ? coopSamityInfo.projectName : ' '}
              disabled={disableProject}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {projects.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.projectNameBangla}
                </option>
              ))}
            </TextField>
            {!coopSamityInfo.projectName && <span style={{ color: 'red' }}>{formErrors.projectName}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star(labelForSamity)}
              name="samityId"
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.samityId ? coopSamityInfo.samityId : ' '}
              variant="outlined"
              size="small"
              onChange={handleChange}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {samityList &&
                samityList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name.bn}
                  </option>
                ))}
            </TextField>
            {!coopSamityInfo.samityName && <span style={{ color: 'red' }}>{formErrors.samityName}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('জেলা')}
              name="district"
              id="district"
              disabled={disableDistrict}
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.district != null ? coopSamityInfo.district : ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {districtList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))}
            </TextField>
            {!coopSamityInfo.district && <span style={{ color: 'red' }}>{formErrors.district}</span>}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('উপজেলা')}
              name="upazila"
              id="upazila"
              disabled={disableUpazila}
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.upaCityId}
              // onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {upazilaList.map((option) => (
                <option key={option.id} value={option.upaCityId}>
                  {option.upaCityNameBangla}
                </option>
              ))}
            </TextField>
            {!coopSamityInfo.upazila && <span style={{ color: 'red' }}>{formErrors.upazila}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('ইউনিয়ন')}
              name="union"
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.uniThanaPawIdType || ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {unionList.map((option) => (
                <option key={option.id} value={option.uniThanaPawIdType}>
                  {option.uniThanaPawNameBangla}
                </option>
              ))}
            </TextField>
            {!coopSamityInfo.union && <span style={{ color: 'red' }}>{formErrors.union}</span>}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('ফ্যাসিলিটেটর/ এলওফআই')}
              name="foCode"
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.foCode ? coopSamityInfo.foCode : ' '}
              variant="outlined"
              size="small"
              onChange={handleChange}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {fieldOfficersList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
            {!coopSamityInfo.foCode && <span style={{ color: 'red' }}>{formErrors.foCode}</span>}
          </Grid>

          <Grid item md={8} xs={12}>
            <TextField
              fullWidth
              label={star('বিস্তারিত ঠিকানা')}
              name="address"
              onChange={handleChange}
              number
              value={coopSamityInfo.address}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মিটিং এর ধরণ')}
              name="meetingType"
              onChange={handleChange}
              value={coopSamityInfo.meetingType ? coopSamityInfo.meetingType : ' '}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              {meetingTypeArray.length >= 1 &&
                meetingTypeArray.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </TextField>
            {!coopSamityInfo.meetingType && <span style={{ color: 'red' }}>{formErrors.meetingType}</span>}
          </Grid>
          {coopSamityInfo.meetingType == 'M' && (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('বার এর অবস্থান')}
                name="weeklyType"
                onChange={handleChange}
                value={coopSamityInfo.weeklyType ? coopSamityInfo.weeklyType : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF' }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {weeklyTypeArray.length >= 1 &&
                  weeklyTypeArray.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </TextField>
              {!coopSamityInfo.weeklyType && <span style={{ color: 'red' }}>{formErrors.weeklyType}</span>}
            </Grid>
          )}
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মিটিং এর দিন')}
              name="meetingDay"
              onChange={handleChange}
              value={coopSamityInfo.meetingDay ? coopSamityInfo.meetingDay : ' '}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {day.length >= 1 &&
                day.map((option) => (
                  <option key={option.value} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
            </TextField>
            {!coopSamityInfo.meetingDay && <span style={{ color: 'red' }}>{formErrors.meetingDay}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('শেয়ার সংখ্যা')}
              name="sharePrice"
              onChange={handleChange}
              number
              value={coopSamityInfo.sharePrice ? coopSamityInfo.sharePrice : ' '}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} xs={12}>
        <Grid container display="flex" spacing={1}>
          <Grid item md={6} xs={12}>
            <Grid container display="flex" spacing={2.5}></Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button
            variant="contained"
            className="btn btn-save"
            onClick={onSubmitData}
            startIcon={<KeyboardArrowRightIcon />}
          >
            পরবর্তী পাতা{' '}
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default SamityRegFromMilkvita;
