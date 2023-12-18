
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Divider, Grid, TextField, Tooltip } from '@mui/material';
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
  officeIdRoute,
  samityGetRouteFromCoop,
  specificApplication,
  unionRoute,
  upazilaRoute,
  updateApplication,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';
import { bangToEng, engToBang } from '../member-registration/validator';




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
const SamityRegFromCoop = () => {
  //Coop samity member type---->"OTH" Because the samity gets created with both the
  const config = localStorageData('config');
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

  const [day, setDay] = useState('');
  const router = useRouter();
  const compoName = localStorageData('componentName');
  const [labelForSamity] = useState('সমিতির নাম');
  const [projects, setProjects] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [unionList, setUnionList] = useState([]);
  const [district, setDistrict] = useState(null);
  const [upazila, setUpazila] = useState(null);
  const [union, setUnion] = useState(null);
  const [samityList, setSamityList] = useState([]);
  const [officeId, setOfficeId] = useState();

  const [update, setUpdate] = useState(false);
  const [samityNameValue, setSamityNameValue] = useState('');
  const [coopSamityInfo, setCoopSamityInfo] = useState({
    samityRegNo: '',
    projectName: '',
    samityId: '',
    officeName: '',
    district: '',
    upaCityId: '',
    upaCityType: '',
    upaCityIdType: '',
    uniThanaPawId: '',
    uniThanaPawType: '',
    uniThanaPawIdType: '',
    village: '',
    address: '',
    meetingDay: '',
    shareAmount: '',
    latitude: '10.2568',
    longlitude: '30.5869',
    sharePrice: '',
    foCode: '',
    coopRegNumber: '',
    meetingType: '',
    weeklyType: '',
  });
  const [fieldOfficersList, setFieldOfficersList] = useState([]);
  const [formErrors, setFormErrors] = useState({
    projectName: '',
    samityName: '',
    foCode: '',
    district: '',
    upazila: '',
    meetingDay: '',
    weeklyType: '',
    meetingType: '',
  });
  useEffect(() => {
    if (router.query.data) {
      getSamityInfo();
    }
  }, []);
  useEffect(() => {
    getOfficeId();
    getDay();
    getUpazila();
    getFieldOfficers();
    getDistrict();
    getProject();
    getUnion();
  }, []);
  let getOfficeId = async () => {
    try {
      let officeInfo = await axios.get(officeIdRoute, config);
      if (officeInfo.data.data) {
        setOfficeId(officeInfo.data.data.id);
      }
    } catch (error) {
      if (error.response) {
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
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
        setUpdate(true);
      }
      getSamityList(samityInfo?.data?.data?.projectId, samityInfo?.data?.data?.officeId);
      setCoopSamityInfo({
        address: samityObj.address,
        projectName: samityInfo.data.data.projectId,
        samityName: samityObj.originSamityId,
        coopRegNumber: samityObj.coopRegNumber,
        radioValue: samityObj.samityMemberType,
        meetingDay: samityObj.meetingDay,
        district: samityObj.districtId,
        foCode: samityObj.foCode,
        meetingType: samityObj.meetingType,
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
      setSamityNameValue(samityObj.samityName);
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
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
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
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getDistrict = async () => {
    try {
      let districtList = await axios.get(districtRoute + '?allDistrict=true', config);
      if (districtList.data.data.length == 1) {
        setDistrict(districtList.data.data[0].id);
        // document.getElementById("district").setAttribute("disabled", "true");
      }
      setDistrictList(districtList.data.data);
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
  let getUpazila = async () => {
    try {
      let upazilaList = await axios.get(upazilaRoute + '?allUpazila=true', config);
      let upazilaArray = upazilaList.data.data;
      let newUpazilaList = upazilaArray.map((obj) => {
        obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
        return obj;
      });
      if (newUpazilaList.length == 1) {
        setUpazila(newUpazilaList[0].upaCityIdType);
        getUnion(newUpazilaList[0].upaCityIdType);
      }
      setUpazilaList(newUpazilaList);
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
  let getUnion = async () => {
    try {
      let unionList = await axios.get(unionRoute + '?allUnion=true', config);
      let unionArray = unionList.data.data;
      let newUnionList = unionArray.map((obj) => {
        obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
        return obj;
      });
      if (newUnionList.length == 1) {
        setUnion(newUnionList[0].uniThanaPawIdType);
      }

      setUnionList(newUnionList);
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
  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);
      if (projectData.data.data.length == 1) {
        // setProject(projectData.data.data[0].id);
        setCoopSamityInfo({
          ...coopSamityInfo,
          projectName: projectData.data.data[0].id,
        });
        setTimeout(() => {
          getSamityList(projectData.data.data[0].id, officeId), 5000;
        });
        // document.getElementById("projectName").setAttribute("disabled", "true");
      }
      setProjects(projectData.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getSamityList = async (projectId, officeId) => {
    try {
      let samityRespData = await axios.get(
        samityGetRouteFromCoop + officeId + '&projectId=' + projectId + '&usedForLoan=' + false + '&samityLevel=P',
      );
      setSamityList(samityRespData.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let checkMandatory = () => {
    let flag = true;

    let newObj = {};
    if (coopSamityInfo.projectName.length == 0 || coopSamityInfo.projectName == 'নির্বাচন করুন') {
      flag = false;
      newObj.projectName = 'প্রকল্প নির্বাচন করুন';
    }

    if (coopSamityInfo.uniThanaPawIdType.length == 0 || coopSamityInfo.uniThanaPawIdType == 'নির্বাচন করুন') {
      flag = false;
      newObj.union = 'ইউনিয়ন নির্বাচন করুন';
    }

    if (coopSamityInfo?.samityName?.length == 0 || coopSamityInfo?.samityName == 'নির্বাচন করুন') {
      flag = false;
      newObj.samityName = 'সমিতি নির্বাচন করুন';
    }

    if (coopSamityInfo.foCode.length == 0 || coopSamityInfo.foCode == 'নির্বাচন করুন') {
      flag = false;
      newObj.foCode = 'মাঠ কর্মী নির্বাচন করুন';
    }

    if (coopSamityInfo.meetingType.length == 0 || coopSamityInfo.meetingType == 'নির্বাচন করুন') {
      flag = false;
      newObj.meetingType = 'মিটিং ধরন নির্বাচন করুন';
    }

    if (coopSamityInfo.meetingDay.length == 0 || coopSamityInfo.meetingDay == 'নির্বাচন করুন') {
      flag = false;
      newObj.meetingDay = 'মিটিং দিন নির্বাচন করুন';
    } else {
      newObj.meetingDay = '';
    }
    if (coopSamityInfo.meetingType == 'M') {
      if (coopSamityInfo.weeklyType.length == 0 || coopSamityInfo.weeklyType == 'নির্বাচন করুন') {
        flag = false;
        newObj.weeklyType = 'বার এর অবস্থান নির্বাচন করুন';
      } else {
        newObj.weeklyType = '';
      }
    }

    //  if(coopSamityInfoFromNormal.meetingDay.length==0||coopSamityInfoFromNormal.meetingDay=="নির্বাচন করুন")
    //  {
    //   flag = false;
    //   newObj.meetingDay="মিটিং দিন নির্বাচন করুন"
    //  }
    for (const key in formErrors) {
      if (formErrors[key]) flag = false;
    }
    setTimeout(() => {
      setFormErrors(newObj);
    }, 1);
    return flag;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newList;
    if (name == 'samityName' && value != 'নির্বাচন করুন') {
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
        setCoopSamityInfo({
          samityRegNo: '',
          projectName: '',
          samityName: '',
          officeName: '',
          district: '',
          upaCityId: '',
          upaCityType: '',
          upaCityIdType: '',
          uniThanaPawId: '',
          uniThanaPawType: '',
          uniThanaPawIdType: '',
          village: '',
          address: '',
          meetingDay: '',
          shareAmount: '',
          latitude: '10.2568',
          longlitude: '30.5869',
          sharePrice: '',
          foCode: '',
          coopRegNumber: '',
          meetingType: '',
          weeklyType: '',
        });
        getSamityList(value, officeId);
      }
    }
    let IdType = "", idType
    switch (name) {
      case 'meetingType':
        if (value == 'নির্বাচন করুন') {
          formErrors.meetingType = 'মিটিং ধরণ নির্বাচন করুন';
        } else {
          formErrors.meetingType = '';
        }
        break;
      case 'weeklyType':
        if (value == 'নির্বাচন করুন') {
          formErrors.weeklyType = 'বার এর অবস্থান নির্বাচন করুন';
        } else {
          formErrors.weeklyType = '';
        }
        break;
      case 'meetingDay':
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
        // getUnion(value)
        idType = value.split(',');
        setCoopSamityInfo({
          ...coopSamityInfo,
          ['upaCityId']: idType[0],
          ['upaCityType']: idType[1],
          ['upaCityIdType']: value,
        });
        return;
      case 'union':
        if (value == 'নির্বাচন করুন') {
          formErrors.union = 'ইউনিয়ন নির্বাচন করুন';
        } else {
          formErrors.union = '';
        }
        IdType = value.split(',');
        setCoopSamityInfo({
          ...coopSamityInfo,
          ['uniThanaPawId']: IdType[0],
          ['uniThanaPawType']: IdType[1],
          ['uniThanaPawIdType']: value,
        });

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
      samityName: newList[0].id,
      sharePrice: engToBang(newList[0].noOfShare),
      address: newList[0].samityDetailsAddress,
      coopRegNumber: newList[0].samityCode,
      district: newList[0].districtId,
      upaCityIdType: newList[0].samityUpaCityId + ',' + newList[0].samityUpaCityType,
      upaCityId: newList[0].samityUpaCityId,
      upaCityType: newList[0].samityUpaCityType,
      uniThanaPawIdType: newList[0].samityUniThanaPawId + ',' + newList[0].samityUniThanaPawType,
      uniThanaPawId: newList[0].samityUniThanaPawId,
      uniThanaPawType: newList[0].samityUniThanaPawType,
    });
    setSamityNameValue(newList[0].samityName);
    setFormErrors({
      ...formErrors,
      union: '',
      upazila: '',
    });
  };


  let onSubmitData = async (e) => {
    let samityData;
    e.preventDefault();
    let base64ConvertedData, resultJSON;
    if (router.query.data) {
      base64ConvertedData = atob(router.query.data);
      resultJSON = JSON.parse(base64ConvertedData);
    }
    let result = checkMandatory();
    let samityId = coopSamityInfo.samityName;
    let upaCityIdTypeArray;
    let uniThanaPawTypeArray;
    if (upazilaList.length == 1) {
      upaCityIdTypeArray = upazila.split(',');
    }
    if (unionList.length == 1) {
      uniThanaPawTypeArray = union.split(',');
    }
    let payload = {
      projectId: coopSamityInfo.projectName,
      data: {
        basic: {
          coopRegNumber: coopSamityInfo.coopRegNumber,
          samityName: samityNameValue,
          originSamityId: coopSamityInfo.samityName,
          districtId: districtList.length > 1 ? coopSamityInfo.district : district,
          upaCityId: upazilaList.length > 1 ? coopSamityInfo.upaCityId : upaCityIdTypeArray[0],
          upaCityType: upazilaList.length > 1 ? coopSamityInfo.upaCityType : upaCityIdTypeArray[1],
          uniThanaPawId: unionList.length > 1 ? coopSamityInfo.uniThanaPawId : uniThanaPawTypeArray[0],
          uniThanaPawType: unionList.length > 1 ? coopSamityInfo.uniThanaPawType : uniThanaPawTypeArray[1],
          address: coopSamityInfo.address,
          meetingDay: coopSamityInfo.meetingDay,
          foCode: coopSamityInfo.foCode,
          meetingType: coopSamityInfo.meetingType,
          ...(coopSamityInfo.meetingType == 'M' && {
            weekPosition: coopSamityInfo.weeklyType,
          }),

          ...(coopSamityInfo.instituteName && {
            instituteNname: coopSamityInfo.instituteName,
          }),
          ...(coopSamityInfo.instituteAddress && {
            instituteAddress: coopSamityInfo.instituteAddress,
          }),
          ...(coopSamityInfo.instituteCode && {
            instituteCode: coopSamityInfo.instituteCode,
          }),
          flag: 1,
        },
        setup: {
          shareAmount: bangToEng(coopSamityInfo.sharePrice),
          samityMemberType: 'OTH',
        },
        memberInfo: [],
      },
    };
    if (result) {
      try {
        if (update) {
          samityData = await axios.put(updateApplication + 'samityCreate/' + resultJSON.id, payload, config);
        } else {
          samityData = await axios.post(loanSamityReg + '/' + compoName, payload, config);
        }

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
          meetingType: 'নির্বাচন করুন',
          weeklyType: 'নির্বাচন করুন',
        });
        onNextPage(samityData.data.data.id, samityId);
      } catch (error) {
        errorHandler(error);
      }
    } else {
      let count = 1;
      let message;
      for (let item in formErrors) {
        if (count == 3) {
          break;
        }
        if (formErrors[item]) {
          message = formErrors[item];
          NotificationManager.error(message, '', 5000);
          count++;
        }
      }
    }
  };
  const onNextPage = (id, samityId) => {
    let base64Data = JSON.stringify({
      id,
      samityId,
      projectId: coopSamityInfo.projectName,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/samity-management/member-registration-coop',
      query: {
        data: base64Data,
      },
    });
  };

  return (
    <>
      <Grid container className="section">
        <SubHeading>নিবন্ধিত সমবায় সমিতি</SubHeading>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('প্রকল্পের নাম')}
              name="projectName"
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.projectName ? coopSamityInfo.projectName : ' '}
              // disabled={disableProject}
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
              name="samityName"
              select
              // disabled={update}
              SelectProps={{ native: true }}
              value={coopSamityInfo.samityName}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
              onChange={handleChange}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {samityList &&
                samityList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.samityName}
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
              disabled={true}
              select
              SelectProps={{ native: true }}
              value={district != null ? district : coopSamityInfo.district ? coopSamityInfo.district : ' '}
              // onChange={handleChange}
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
              disabled={true}
              select
              SelectProps={{ native: true }}
              value={upazila != null ? upazila : coopSamityInfo.upaCityIdType ? coopSamityInfo.upaCityIdType : ' '}
              // onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {upazilaList.map((option) => (
                <option key={option.id} value={option.upaCityIdType}>
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
              disabled={true}
              select
              SelectProps={{ native: true }}
              value={union != null ? union : coopSamityInfo.uniThanaPawIdType ? coopSamityInfo.uniThanaPawIdType : ' '}
              // onChange={handleChange}
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
              sx={{ backgroundColor: '#FFF' }}
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
              // onChange={handleChange}
              number
              value={coopSamityInfo.address}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
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
              error={formErrors.meetingType ? true : false}
              helperText={formErrors.meetingType}
            >
              <option value={'নির্বাচন করুন'}>- নির্বাচন করুন -</option>
              {meetingTypeArray.length >= 1 &&
                meetingTypeArray.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </TextField>
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
                error={formErrors.weeklyType ? true : false}
                helperText={formErrors.weeklyType}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {weeklyTypeArray.length >= 1 &&
                  weeklyTypeArray.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </TextField>
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
              style={{ backgroundColor: '#FFF' }}
              error={formErrors.meetingDay ? true : false}
              helperText={formErrors.meetingDay}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {day.length >= 1 &&
                day.map((option) => (
                  <option key={option.value} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="শেয়ার সংখ্যা"
              name="sharePrice"
              disabled={true}
              // onChange={handleChange}
              number
              value={coopSamityInfo.sharePrice ? engToBang(coopSamityInfo.sharePrice) : ''}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container className="btn-container">
        <Tooltip title="পরবর্তী পাতা">
          <Button
            variant="contained"
            className="btn btn-save"
            onClick={onSubmitData}
            endIcon={<KeyboardArrowRightIcon />}
          >
            পরবর্তী পাতা
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default SamityRegFromCoop;
