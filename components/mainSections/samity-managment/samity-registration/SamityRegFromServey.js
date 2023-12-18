/* eslint-disable no-misleading-character-class */
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import {
  codeMaster,
  districtRoute,
  fieldOffRoute,
  loanProject,
  loanSamityReg,
  permissionRoute,
  samityReg,
  unionRoute,
  upazilaRoute,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';
import { bangToEng, engToBang, myValidate } from '../member-registration/validator';

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
const SamityRegFromServey = () => {
  const router = useRouter();
  const config = localStorageData('config');
  const [day, setDay] = useState('');
  const [labelForSamity, setLabelForSamity] = useState('সমিতির নাম');
  const [samityInfo, setSamityInfo] = useState({
    projectName: '',
    samityName: '',
    foCode: '',
    districtId: '',
    village: '',
    address: '',
    radioValue: 'B',
    meetingDay: '',
    memberMinAge: '',
    memberMaxAge: '',
    samityMinMember: '',
    samityMaxMember: '',
    groupMinMember: '',
    groupMaxMember: '',
    isSme: false,
    instituteAddress: '',
    instituteName: '',
    instituteCode: '',
    upaCityId: '',
    upaCityType: '',
    upaCityIdType: '',
    uniThanaPawId: '',
    uniThanaPawType: '',
    uniThanaPawIdType: '',
    meetingType: '',
    weeklyType: '',
  });
  // const [permissionArray, setPermissionArray] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fieldOfficersList, setFieldOfficersList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [unionList, setUnionList] = useState([]);
  const [districtId, setDistrictId] = useState();
  const [upazilaId, setUpazilaId] = useState();
  const [unionId, setUnionId] = useState();
  const [samityTypeSelection, setSamityTypeSelection] = useState(false);
  const [samityTypeValue, setSamityTypeValue] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [disableProject, setDisableProject] = useState('');
  const [disableDistrict, setDisableDistrict] = useState('');
  const [disableUpazila, setDisableUpazila] = useState('');
  const [disableUnion, setDisableUnion] = useState('');
  const [fieldHideShowObj, setFieldHideShowObj] = useState({});
  const [labelObj, setLabelObj] = useState({});
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    getSamityInfo();
  }, []);

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

  let getSamityInfo = async () => {
    try {
      let samityInfo = await axios.get(loanSamityReg + '/samityDetails?value=2&id=' + router.query.id, config);

      let samityObj = samityInfo.data.data[0];
      let objLength = samityObj && Object.keys(samityObj).length;
      if (objLength >= 1) {
        setUpdate(true);
      }
      'Samity Info=====', samityInfo.data.data[0];
      let upaCityIdType = samityObj.upaCityId + ',' + samityObj.upaCityType;

      await getUpazila(samityObj.districtId);
      await getUnion(upaCityIdType);
      setSamityInfo({
        ...samityInfo,
        address: samityObj.address,
        projectId: samityObj.projectId,
        memberMinAge: engToBang(samityObj.memberMinAge),
        memberMaxAge: engToBang(samityObj.memberMaxAge),
        samityMinMember: engToBang(samityObj.samityMinMember),
        samityMaxMember: engToBang(samityObj.samityMaxMember),
        groupMinMember: samityObj.groupMinMember == 0 ? '' : engToBang(samityObj.groupMinMember),
        groupMaxMember: samityObj.groupMinMember == 0 ? '' : engToBang(samityObj.groupMaxMember),
        samityName: samityObj.samityName,
        radioValue: samityObj.samityMemberType,
        meetingDay: samityObj.meetingDay,
        districtId: samityObj.districtId,
        foCode: samityObj.foCode,
        projectName: samityObj.projectId,
        meetingType: samityObj.meetingType,
        isSme: samityObj.isSme,
        upaCityIdType: samityObj.upaCityId + ',' + samityObj.upaCityType,
        uniThanaPawIdType: samityObj.uniThanaPawId + ',' + samityObj.uniThanaPawType,
        upaCityId: samityObj.upaCityId,
        upaCityType: samityObj.upaCityType,
        uniThanaPawId: samityObj.uniThanaPawId,
        uniThanaPawType: samityObj.uniThanaPawType,
        weeklyType: samityObj.weekPosition,
      });

      //  setProjectInfo(projectInfo.data.data.data)
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  let regexResultFunc = (regex, value) => {
    return regex.test(value);
  };

  // const rangeChecking = (value, samityType = 'S') => {
  //   if (samityType == 'G') {
  //     if (value != '' && (Number(value) < 10 || Number(value) > 17)) {
  //       return {
  //         samityType: 'G',
  //         status: false,
  //       };
  //     }
  //     return {
  //       samityType: 'G',
  //       status: true,
  //     };
  //   } else {
  //     'Value inside range checking method---', value;
  //     if (value != '' && (Number(value) < 18 || Number(value) > 65)) {
  //       return {
  //         samityType: 'S',
  //         status: false,
  //       };
  //     }
  //     return {
  //       samityType: 'S',
  //       status: true,
  //     };
  //   }
  // };
  // const minMaxRatioChecking = (minValue, maxValue) => {
  //   const isMinValueValid = rangeChecking(minValue);
  //   const isMaxValueValid = rangeChecking(maxValue);
  //   const resultantObj = {};
  //   if (!isMinValueValid?.status || !isMaxValueValid?.status) {
  //     resultantObj = {
  //       ...resultantObj,
  //       rangeChecking: false,
  //       status: false,
  //     };
  //   }
  //   if (Number(minValue) > Number(maxValue) && minValue != '' && maxValue != '') {
  //     resultantObj = {
  //       ...resultantObj,
  //       minMaxRatio: false,
  //       status: false,
  //     };
  //   }
  //   if (isMinValueValid && isMaxValueValid && Number(minValue) < Number(maxValue))
  //     resultantObj = {
  //       minMaxRatio: false,
  //       status: false,
  //     };
  //   return resultantObj;
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj;
    const newError = { ...formErrors };
    let idType, IdType
    if (name == 'projectName') {
      if (value == 13) {
        setSamityTypeSelection(true);
      } else {
        setSamityTypeSelection(false);
      }
    }
    if (name == 'projectName') {
      getPermission(value);
      setSamityInfo({
        ...samityInfo,
        [name]: value,
        memberMinAge: '',
        memberMaxAge: '',
      });
      setFormErrors({
        ...formErrors,
        memberMaxAge: '',
        memberMinAge: '',
      });
      return;
    }

    switch (name) {
      case 'address':
        formErrors.address = '';
        break;

      case 'projectName':
        if (value == 'নির্বাচন করুন') {
          formErrors.projectName = 'প্রকল্প নির্বাচন করুন';
        } else {
          formErrors.projectName = '';
        }

        break;
      case 'districtId':
        if (value == 'নির্বাচন করুন') {
          formErrors.districtId = ' নির্বাচন করুন';
        } else {
          formErrors.districtId = '';
        }
        getUpazila(value);

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
      case 'instituteCode':
        if (value.length > 8) return;
        setSamityInfo({
          ...samityInfo,
          [name]: value.replace(/\D/gi, ''),
        });
        return;
      case 'upazilaId':
        if (value == 'নির্বাচন করুন') {
          formErrors.upazilaId = 'উপজেলা নির্বাচন করুন';
        } else {
          formErrors.upazilaId = '';
        }
        getUnion(value);
        idType = value.split(',');
        setSamityInfo({
          ...samityInfo,
          ['upaCityId']: idType[0],
          ['upaCityType']: idType[1],
          ['upaCityIdType']: value,
        });

        return;
      case 'unionId':
        if (value == 'নির্বাচন করুন') {
          formErrors.unionId = 'ইউনিয়ন নির্বাচন করুন';
        } else {
          formErrors.unionId = '';
        }
        IdType = value.split(',');
        setSamityInfo({
          ...samityInfo,
          ['uniThanaPawId']: IdType[0],
          ['uniThanaPawType']: IdType[1],
          ['uniThanaPawIdType']: value,
        });
        return;
      case 'samityName':
        formErrors.samityName = '';
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setSamityInfo({
            ...samityInfo,
            [name]: value.replace(/[^A-Za-z\s-]/gi, ''),
          });
          return;
        } else {
          setSamityInfo({
            ...samityInfo,
            [name]: value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      case 'memberMinAge':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfo({
          ...samityInfo,
          [name]: resultObj?.value,
        });
        // setSamityInfo({
        //   ...samityInfo,
        //   [e.target.name]: e.target.value.replace(/\D/g, ""),
        // });
        if (
          bangToEng(samityInfo.memberMaxAge) &&
          Number(bangToEng(samityInfo.memberMaxAge)) <= Number(bangToEng(e.target.value))
        ) {
          newError.memberMinAge =
            'সমিতির সদস্যের সর্বনিম্ন বয়স সমিতির সদস্যের সর্বোচ্চ বয়স অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfo.memberMaxAge) &&
          Number(bangToEng(samityInfo.memberMaxAge)) > Number(bangToEng(e.target.value)) &&
          samityInfo.projectName != 13 &&
          samityTypeValue != 'G'
        ) {
          newError.memberMinAge = '';
          newError.memberMaxAge = '';
        } else {
          newError.memberMinAge = '';
        }
        if (samityTypeValue == 'G' && samityInfo.projectName == 13 && Number(bangToEng(value)) > 18) {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ অপেক্ষা বড় হতে পারবে না';
        }

        if (
          samityInfo.memberMaxAge &&
          Number(bangToEng(samityInfo.memberMaxAge)) > Number(bangToEng(e.target.value)) &&
          Number(bangToEng(samityInfo.projectName)) == 13 &&
          samityTypeValue === 'G' &&
          Number(bangToEng(samityInfo.memberMinAge) < 18 && Number(bangToEng(samityInfo.memberMaxAge)) <= 18)
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        }
        if (
          bangToEng(samityInfo.memberMaxAge) &&
          Number(bangToEng(samityInfo.memberMaxAge)) > Number(bangToEng(e.target.value)) &&
          samityInfo.projectName !== 13 &&
          samityTypeValue !== 'G' &&
          Number(bangToEng(samityInfo.memberMinAge)) <= 18 &&
          Number(bangToEng(samityInfo.memberMaxAge)) <= 65
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        }
        if (Number(bangToEng(value) < 18 || Number(bangToEng(value)) > 65) && value != '' && samityTypeValue != 'G') {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }
        if (
          samityInfo.memberMaxAge &&
          Number(bangToEng(samityInfo.memberMaxAge) < 18 || Number(bangToEng(samityInfo.memberMaxAge)) > 65) &&
          value != '' &&
          samityTypeValue != 'G'
        ) {
          newError.memberMaxAge = 'সমিতির সদস্যের সর্বোচ্চ বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }

        setFormErrors(newError);
        break;
      case 'memberMaxAge':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfo({
          ...samityInfo,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfo.memberMinAge) &&
          value &&
          Number(bangToEng(samityInfo.memberMinAge)) >= Number(bangToEng(value))
        ) {
          newError.memberMaxAge =
            'সমিতির সদস্যের সর্বনিম্ন বয়স সমিতির সদস্যের সর্বোচ্চ বয়স অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfo.memberMinAge) &&
          Number(bangToEng(samityInfo.memberMinAge)) < Number(bangToEng(e.target.value)) &&
          samityInfo.projectName != 13 &&
          samityTypeValue != 'G'
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        } else {
          newError.memberMaxAge = '';
        }
        if (samityTypeValue == 'G' && samityInfo.projectName == 13 && Number(bangToEng(value)) > 18) {
          newError.memberMaxAge = 'সমিতির সদস্যের সর্বোচ্চ বয়স ১৮ অপেক্ষা বড় হতে পারবে না';
        }

        if (Number(bangToEng(value) < 18 || Number(bangToEng(value)) > 65) && value != '' && samityTypeValue != 'G') {
          newError.memberMaxAge = 'সমিতির সদস্যের সর্বোচ্চ বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }
        if (
          samityInfo.memberMinAge &&
          Number(bangToEng(samityInfo.memberMinAge) < 18 || Number(bangToEng(samityInfo.memberMinAge)) > 65) &&
          value != '' &&
          samityTypeValue != 'G'
        ) {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }
        setFormErrors(newError);

        break;
      case 'samityMinMember':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfo({
          ...samityInfo,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfo.samityMaxMember) &&
          Number(bangToEng(samityInfo.samityMaxMember)) <= Number(bangToEng(e.target.value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMinMember: 'সমিতির সর্বনিম্ন সদস্য সমিতির সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 1);
        } else if (
          bangToEng(samityInfo.samityMaxMember) &&
          Number(bangToEng(samityInfo.samityMaxMember)) > Number(bangToEng(value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMinMember: '',
              samityMaxMember: '',
            });
          }, 100);
        } else {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMinMember: '',
            });
          }, 100);
        }
        // myFunc(value);
        break;
      case 'samityMaxMember':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfo({
          ...samityInfo,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfo.samityMinMember) &&
          value &&
          Number(bangToEng(samityInfo.samityMinMember)) >= Number(bangToEng(e.target.value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMaxMember: 'সমিতির সর্বনিম্ন সদস্য সমিতির সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 100);
        } else if (
          bangToEng(samityInfo.samityMinMember) &&
          Number(bangToEng(samityInfo.samityMinMember)) < Number(bangToEng(e.target.value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMaxMember: '',
              samityMinMember: '',
            });
          }, 1);
        } else {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMaxMember: '',
            });
          }, 1);
        }
        break;
      case 'groupMinMember':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfo({
          ...samityInfo,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfo.groupMaxMember) &&
          Number(bangToEng(samityInfo.groupMaxMember)) <= Number(bangToEng(e.target.value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMinMember:
                'সমিতির দলের সর্বনিম্ন সদস্য সমিতির দলের সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 100);
        } else if (
          bangToEng(samityInfo.groupMaxMember) &&
          Number(bangToEng(samityInfo.groupMaxMember)) > Number(bangToEng(e.target.value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMinMember: '',
              groupMaxMember: '',
            });
          }, 100);
        } else {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMinMember: '',
            });
          }, 100);
        }
        return;
      case 'groupMaxMember':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfo({
          ...samityInfo,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfo.groupMinMember) &&
          value &&
          Number(bangToEng(samityInfo.groupMinMember)) >= Number(bangToEng(value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMaxMember:
                'সমিতির দলের সর্বনিম্ন সদস্য সমিতির দলের সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 1);
        } else if (
          bangToEng(samityInfo.groupMinMember) &&
          Number(bangToEng(samityInfo.groupMinMember)) < Number(bangToEng(value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMaxMember: '',
              groupMinMember: '',
            });
          }, 1);
        } else {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMaxMember: '',
            });
          }, 1);
        }
        return;

    }

    if (
      e.target.name != 'memberMinAge' &&
      e.target.name != 'memberMaxAge' &&
      e.target.name != 'samityMinMember' &&
      e.target.name != 'samityMaxMember' &&
      e.target.name != 'groupMinMember' &&
      e.target.name != 'groupMaxMember'
    ) {
      setSamityInfo({
        ...samityInfo,
        [e.target.name]: e.target.value,
      });
    }
  };
  useEffect(() => {
    getDay();
    getDistrict();
    getProject();
    getFieldOfficers();
  }, []);

  let getPermission = async (id) => {
    // (id);
    if (id != 'নির্বাচন করুন') {
      try {
        let permissionResp = await axios.get(permissionRoute + '?pageName=samityReg&project=' + id, config);
        const isEmpty = Object.keys(permissionResp.data.data[0]).length === 0;
        const isEmpty2 = Object.keys(permissionResp.data.data[1]).length === 0;

        if (!isEmpty) {
          setFieldHideShowObj(permissionResp.data.data[0]);
        } else {
          setFieldHideShowObj({});
        }
        if (!isEmpty2) {
          setLabelObj(permissionResp.data.data[1]);
        } else {
          setLabelObj({});
        }
        if (permissionResp.data.data.length >= 1) {
          if (permissionResp.data.data[0].samityType == 'C') {
            setLabelForSamity('সমবায় সমিতির নাম');
          } else if (permissionResp.data.data[0].samityType == 'D') {
            setLabelForSamity('দলের নাম');
          } else if (permissionResp.data.data[0].samityType == 'G') {
            setLabelForSamity('সংঘের নাম');
          } else {
            setLabelForSamity('সমিতির নাম');
          }
          // setPermissionArray(permissionResp.data.data[0]);
        }
        // show();
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
    }
  };

  let getDistrict = async () => {
    try {
      let districtList = await axios.get(districtRoute, config);
      if (districtList.data.data.length == 1) {
        setDistrictId(districtList.data.data[0].id);
        getUpazila(districtList.data.data[0].id);
        // document.getElementById("district").setAttribute("disabled", "true");
        setDisableDistrict(true);
      }
      setDistrictList(districtList.data.data);
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

  let getUpazila = async (districtId) => {
    try {
      let upazilaList = await axios.get(upazilaRoute + '?district=' + districtId + '&address=0', config);
      let upazilaArray = upazilaList.data.data;
      let newUpazilaList = upazilaArray.map((obj) => {
        obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
        return obj;
      });
      if (newUpazilaList.length == 1) {
        setUpazilaId(newUpazilaList[0].upaCityIdType);
        // document.getElementById("upazila").setAttribute("disabled", "true");
        setDisableUpazila(true);
        getUnion(newUpazilaList[0].upaCityIdType);
      }

      setUpazilaList(newUpazilaList);
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

  let getUnion = async (upaCity) => {
    let upacity_id_type = upaCity.split(',');
    try {
      let unionList = await axios.get(
        unionRoute + '?address=1' + '&type=' + upacity_id_type[1] + '&upazila=' + upacity_id_type[0],
        config,
      );
      let unionArray = unionList.data.data;
      let newUnionList = unionArray.map((obj) => {
        obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
        return obj;
      });
      if (newUnionList.length == 1) {
        setUnionId(unionList.data.data[0].uniThanaPawIdType);
        setDisableUnion(true);
      }
      setUnionList(newUnionList);
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

  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);
      if (projectData.data.data.length == 1) {
        // setProject(projectData.data.data[0].id);
        setSamityInfo({
          ...samityInfo,
          projectName: projectData.data.data[0].id,
        });
        getPermission(projectData.data.data[0].id);
        // document.getElementById("projectName").setAttribute("disabled", "true");
        setDisableProject(true);
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

  let checkMandatory = () => {
    let flag = true;

    let newObj = {};
    let stateObj = { ...samityInfo };

    if (samityInfo.projectName.length == 0 || samityInfo.projectName == 'নির্বাচন করুন') {
      flag = false;
      newObj.projectName = 'প্রকল্প নির্বাচন করুন';
    } else {
      newObj.projectName = '';
    }

    if (districtList.length > 1 && (samityInfo.districtId.length == 0 || samityInfo.districtId == 'নির্বাচন করুন')) {
      flag = false;
      newObj.districtId = 'জেলা নির্বাচন করুন';
    } else {
      newObj.districtId = '';
    }
    if (
      upazilaList.length > 1 &&
      (samityInfo.upaCityIdType.length == 0 || samityInfo.upaCityIdType == 'নির্বাচন করুন')
    ) {
      flag = false;
      newObj.upazilaId = 'উপজিলা নির্বাচন করুন';
    } else {
      newObj.upazilaId = '';
    }

    if (samityInfo.uniThanaPawIdType.length == 0 || samityInfo.uniThanaPawIdType == 'নির্বাচন করুন') {
      flag = false;
      newObj.unionId = 'ইউনিয়ন নির্বাচন করুন';
    } else {
      newObj.unionId = '';
    }

    if (samityInfo.samityName.trim().length == 0) {
      flag = false;
      newObj.samityName = labelForSamity + ' উল্লেখ করুন';
      stateObj.samityName = '';
    }

    if (samityInfo.foCode.length == 0 || samityInfo.foCode == 'নির্বাচন করুন') {
      flag = false;
      newObj.foCode = 'মাঠ কর্মী নির্বাচন করুন';
    }
    if (samityInfo.meetingType.length == 0 || samityInfo.meetingType == 'নির্বাচন করুন') {
      flag = false;
      newObj.meetingType = 'মিটিং ধরন নির্বাচন করুন';
    }

    if (samityInfo.meetingDay.length == 0 || samityInfo.meetingDay == 'নির্বাচন করুন') {
      flag = false;
      newObj.meetingDay = 'মিটিং দিন নির্বাচন করুন';
    } else {
      newObj.meetingDay = '';
    }

    if (samityInfo.address.trim().length == 0) {
      flag = false;
      newObj.address = 'ঠিকানা উল্লেখ করুন';
      stateObj.address = '';
    }
    if (samityInfo.projectName == '13' && samityTypeValue == 'G') {
      if (samityInfo.instituteName.length == 0) {
        flag = false;
        newObj.instituteName = 'হাই স্কুল এর নাম উল্লেখ করুন';
      } else {
        newObj.instituteName = '';
      }
    }
    if (samityInfo.projectName == '13' && samityTypeValue == 'G') {
      if (samityInfo.instituteCode.length == 0) {
        flag = false;
        newObj.instituteCode = 'হাই স্কুল এর কোড উল্লেখ করুন';
      } else {
        newObj.instituteCode = '';
      }
    }
    if (samityInfo.projectName == '13' && samityTypeValue == 'G') {
      if (samityInfo.instituteAddress.length == 0) {
        flag = false;
        newObj.instituteAddress = 'হাই স্কুল এর ঠিকানা উল্লেখ করুন';
      } else {
        newObj.instituteAddress = '';
      }
    }
    if (samityInfo.samityMaxMember.length == 0) {
      flag = false;
      newObj.samityMaxMember = 'সমিতি এর সর্বোচ্চ সদস্য সংখ্যা উল্লেখ করুন';
    }

    if (samityInfo.samityMinMember.length == 0) {
      flag = false;
      newObj.samityMinMember = 'সমিতি এর সর্বনিম্ন সদস্য সংখ্যা উল্লেখ করুন';
    }
    if (samityInfo.memberMaxAge.length == 0) {
      flag = false;
      newObj.memberMaxAge = 'সমিতি এর সদস্যের সর্বোচ্চ বয়স উল্লেখ করুন';
    }
    if (samityInfo.memberMinAge.length == 0) {
      flag = false;
      newObj.memberMinAge = 'সমিতি এর সদস্যের সর্বনিম্ন বয়স উল্লেখ করুন';
    }

    // if (samityInfo.groupMaxMember.length == 0) {

    //   flag = false;
    //   newObj.groupMaxMember = "সমিতি এর দলের সর্বোচ্চ সদস্য সংখ্যা উল্লেখ করুন";
    // }
    // if (samityInfo.groupMinMember.length == 0) {

    //   flag = false;
    //   newObj.groupMinMember =
    //     "সমিতি এর দলের সর্বনিম্ন সদস্য সংখ্যা উল্লেখ করুন";
    // }

    //  if(samityInfoFromNormal.meetingDay.length==0||samityInfoFromNormal.meetingDay=="নির্বাচন করুন")
    //  {
    //   flag = false;
    //   newObj.meetingDay="মিটিং দিন নির্বাচন করুন"
    //  }
    for (const key in formErrors) {
      if (formErrors[key]) {
        flag = false;
      }
    }
    setTimeout(() => {
      setFormErrors(newObj);
    }, 1);
    setTimeout(() => {
      setSamityInfo(stateObj);
    }, 1);
    return flag;
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    let result = checkMandatory();
    if (result) {
      let samityData;
      let upaCityIdTypeArray;
      let uniThanaPawTypeArray;
      if (upazilaList.length == 1) {
        upaCityIdTypeArray = upazilaId.split(',');
      }
      if (unionList.length == 1) {
        uniThanaPawTypeArray = unionId.split(',');
      }
      let payload = {
        resourceName: 'samityInfo',
        data: {
          basic: {
            samityName: samityInfo.samityName,
            districtId: districtList.length > 1 ? Number(samityInfo.districtId) : districtId,
            upaCityId:
              upazilaList.length > 1 ? Number(samityInfo.upaCityId) : upazilaId ? Number(upaCityIdTypeArray[0]) : null,
            upaCityType: upazilaList.length > 1 ? samityInfo.upaCityType : upaCityIdTypeArray[1],
            uniThanaPawId:
              unionList.length > 1
                ? Number(samityInfo.uniThanaPawId)
                : unionId
                  ? Number(uniThanaPawTypeArray[0])
                  : null,
            uniThanaPawType: unionList.length > 1 ? samityInfo.uniThanaPawType : uniThanaPawTypeArray[1],
            address: samityInfo.address ? samityInfo.address : null,
            meetingDay: samityInfo.meetingDay,
            ...(samityInfo.meetingType == 'M' && {
              weekPosition: samityInfo.weeklyType,
            }),
            meetingType: samityInfo.meetingType,
            foCode: samityInfo.foCode,
            workPlaceLat: '10.5455',
            workPlaceLong: '20.548',
            workAreaRadius: '50',
            ...(samityInfo.instituteName && {
              instituteName: samityInfo.instituteName,
            }),
            ...(samityInfo.instituteAddress && {
              instituteAddress: samityInfo.instituteAddress,
            }),
            ...(samityInfo.instituteCode && {
              instituteCode: samityInfo.instituteCode,
            }),
            flag: 2,
            isSme: samityInfo.isSme == 'true' ? true : false,
            ...(samityTypeValue && { samityType: samityTypeValue }),
          },
          setup: {
            memberMinAge: bangToEng(samityInfo.memberMinAge),
            memberMaxAge: bangToEng(samityInfo.memberMaxAge),
            samityMinMember: bangToEng(samityInfo.samityMinMember),
            samityMaxMember: bangToEng(samityInfo.samityMaxMember),
            ...(samityInfo.groupMinMember && {
              groupMinMember: bangToEng(samityInfo.groupMinMember),
            }),
            ...(samityInfo.groupMaxMember && {
              groupMaxMember: bangToEng(samityInfo.groupMaxMember),
            }),
            shareAmount: 0,
            samityMemberType: samityInfo.radioValue ? samityInfo.radioValue : null,
          },
          memberInfo: [],
        },
        districtId: districtList.length > 1 ? Number(samityInfo.districtId) : districtId,
        upaCityId:
          upazilaList.length > 1 ? Number(samityInfo.upaCityId) : upazilaId ? Number(upaCityIdTypeArray[0]) : null,
        upaCityType: upazilaList.length > 1 ? samityInfo.upaCityType : upaCityIdTypeArray[1],
        projectId: parseInt(samityInfo.projectName),
      };

      try {
        if (update) {
          samityData = await axios.put(samityReg + '/samityinfo/' + router.query.id + '?value=2', payload, config);
        } else {
          samityData = await axios.post(samityReg, payload, config);
        }

        setSamityInfo({
          ...samityInfo,
          ...(projects.length > 1 && { projectName: 'নির্বাচন করুন' }),
          samityName: '',
          foCode: 'নির্বাচন করুন',
          address: '',
          radioValue: '',
          meetingDay: 'নির্বাচন করুন',
          memberMinAge: '',
          memberMaxAge: '',
          samityMinMember: '',
          samityMaxMember: '',
          groupMinMember: '',
          groupMaxMember: '',
          districtId: 'নির্বাচন করুন',
          upaCityIdType: 'নির্বাচন করুন',
          uniThanaPawIdType: 'নির্বাচন করুন',
          instituteName: '',
          instituteAddress: '',
          instituteCode: '',
          meetingType: 'নির্বাচন করুন',
          weeklyType: 'নির্বাচন করুন',
        });
        onNextPage(
          samityData?.data?.data?.id,
          samityData?.data?.data?.samityMinMember,
          samityData?.data?.data?.samityMaxMember,
          samityData?.data?.data?.projectId,
        );
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors.length >= 1 && error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
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
          NotificationManager.error(message, 'Error', 5000);
          count++;
        }
      }
    }
  };

  const onNextPage = (id, samityMinMember, samityMaxMember, projectId) => {
    let base64Data = JSON.stringify({
      id,
      samityMinMember,
      samityMaxMember,
      projectId,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/samity-management/member-registration-survey',
      query: {
        data: base64Data,
      },
    });
  };

  let handleChangeOfSamityTypeSelect = (e) => {
    setSamityInfo({
      ...samityInfo,
      memberMinAge: '',
      memberMaxAge: '',
    });
    if (formErrors.memberMaxAge || formErrors.memberMinAge) {
      setFormErrors({
        ...formErrors,
        memberMaxAge: '',
        memberMinAge: '',
      });
    }
    setSamityTypeValue(e.target.value);
  };

  return (
    <>
      <Grid contaienr className="section">
        <SubHeading>সার্ভের মাধ্যমে আগত সমিতি/সংঘ/দল নিবন্ধন</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্পের নাম')}
              name="projectName"
              select
              disabled={disableProject}
              SelectProps={{ native: true }}
              value={samityInfo.projectName ? samityInfo.projectName : ' '}
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
            {!samityInfo.projectName && <span style={{ color: 'red' }}>{formErrors.projectName}</span>}
          </Grid>

          {samityTypeSelection ? (
            <Grid item md={3} xs={12}>
              <FormControl component="samityTypeValue" sx={{ width: '100%' }}>
                <RadioGroup
                  row
                  aria-label="samityTypeValue"
                  name="samityTypeValue"
                  required
                  value={samityTypeValue}
                  onChange={handleChangeOfSamityTypeSelect}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <FormControlLabel value="S" control={<Radio />} label="সমিতি" />
                  <FormControlLabel value="G" control={<Radio />} label="সংঘ" />
                </RadioGroup>
              </FormControl>
              {!samityTypeValue && <span style={{ color: 'red' }}>{formErrors.samityTypeValue}</span>}
            </Grid>
          ) : (
            ''
          )}
          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              fullWidth
              label={star('সমিতির নাম')}
              name="samityName"
              onChange={handleChange}
              number
              value={samityInfo.samityName}
              variant="outlined"
              size="small"
            ></TextField>
            {!samityInfo.samityName && <span style={{ color: 'red' }}>{formErrors.samityName}</span>}
          </Grid>
          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              fullWidth
              label={star('মাঠ কর্মী')}
              name="foCode"
              select
              SelectProps={{ native: true }}
              value={samityInfo.foCode ? samityInfo.foCode : ' '}
              variant="outlined"
              size="small"
              onChange={handleChange}
            >
              <option>- নির্বাচন করুন -</option>
              {fieldOfficersList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
            {!samityInfo.foCode && <span style={{ color: 'red' }}>{formErrors.foCode}</span>}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('জেলা')}
              name="districtId"
              id="district"
              disabled={disableDistrict}
              select
              SelectProps={{ native: true }}
              value={districtId != null ? districtId : samityInfo.districtId ? samityInfo.districtId : ' '}
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
            {!samityInfo.districtId && <span style={{ color: 'red' }}>{formErrors.districtId}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('উপজেলা')}
              name="upazilaId"
              disabled={disableUpazila}
              id="upazila"
              select
              SelectProps={{ native: true }}
              value={upazilaId != null ? upazilaId : samityInfo.upaCityIdType ? samityInfo.upaCityIdType : ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {upazilaList.map((option) => (
                <option key={option.id} value={option.upaCityIdType}>
                  {option.upaCityNameBangla}
                </option>
              ))}
            </TextField>
            {!samityInfo.upazilaId && <span style={{ color: 'red' }}>{formErrors.upazilaId}</span>}
            {/* {formErrors.upazila.length > 0 && (
              <span style={{ color: "red" }}>{formErrors.upazila}</span>
            )} */}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              id="union"
              fullWidth
              label={star('ইউনিয়ন')}
              name="unionId"
              disabled={disableUnion}
              select
              SelectProps={{ native: true }}
              value={unionId != null ? unionId : samityInfo.uniThanaPawIdType ? samityInfo.uniThanaPawIdType : ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {unionList.map((option) => (
                <option key={option.id} value={option.uniThanaPawIdType}>
                  {option.uniThanaPawNameBangla}
                </option>
              ))}
            </TextField>
            {!samityInfo.unionId && <span style={{ color: 'red' }}>{formErrors.unionId}</span>}
          </Grid>

          <Grid item md={8} xs={12}>
            <TextField
              fullWidth
              label={star('ঠিকানা')}
              name="address"
              onChange={handleChange}
              number
              value={samityInfo.address}
              variant="outlined"
              size="small"
            ></TextField>
            {!samityInfo.address && <span style={{ color: 'red' }}>{formErrors.address}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl component="gender">
              <RadioGroup
                row
                aria-label="gender"
                name="radioValue"
                value={samityInfo.radioValue}
                onChange={handleChange}
              >
                <FormControlLabel value="M" control={<Radio />} label="পুরুষ" />
                <FormControlLabel value="F" control={<Radio />} label="মহিলা" />
                <FormControlLabel value="B" control={<Radio />} label="উভয়" />
              </RadioGroup>
            </FormControl>
            {!samityInfo.radioValue && <span style={{ color: 'red' }}>{formErrors.radioValue}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মিটিং এর ধরণ')}
              name="meetingType"
              onChange={handleChange}
              value={samityInfo.meetingType ? samityInfo.meetingType : ' '}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option>- নির্বাচন করুন -</option>
              {meetingTypeArray.length >= 1 &&
                meetingTypeArray.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </TextField>
            {!samityInfo.meetingType && <span style={{ color: 'red' }}>{formErrors.meetingType}</span>}
          </Grid>
          {samityInfo.meetingType == 'M' && (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('বার এর অবস্থান')}
                name="weeklyType"
                onChange={handleChange}
                value={samityInfo.weeklyType ? samityInfo.weeklyType : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
              >
                <option>- নির্বাচন করুন -</option>
                {weeklyTypeArray.length >= 1 &&
                  weeklyTypeArray.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </TextField>
              {!samityInfo.meetingDay && <span style={{ color: 'red' }}>{formErrors.meetingDay}</span>}
            </Grid>
          )}
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মিটিং এর দিন')}
              name="meetingDay"
              onChange={handleChange}
              value={samityInfo.meetingDay ? samityInfo.meetingDay : ' '}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option>- নির্বাচন করুন -</option>
              {day.length >= 1 &&
                day.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
            </TextField>
            {!samityInfo.meetingDay && <span style={{ color: 'red' }}>{formErrors.meetingDay}</span>}
          </Grid>
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfo.projectName != '' &&
            !fieldHideShowObj.memberMinAge ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.memberMinAge
                    ? star(labelObj.memberMinAge)
                    : star('সদস্যের সর্বনিম্ন বয়স ')
                }
                name="memberMinAge"
                id="number"
                onChange={handleChange}
                number
                value={samityInfo.memberMinAge}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfo.memberMinAge ? (
                <span style={{ color: 'red' }}>{formErrors.memberMinAge}</span>
              ) : samityInfo.memberMinAge.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.memberMinAge}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfo.projectName != '' &&
            !fieldHideShowObj.memberMaxAge ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.memberMaxAge
                    ? star(labelObj.memberMaxAge)
                    : star('সদস্যের সর্বোচ্চ বয়স ')
                }
                name="memberMaxAge"
                id="number"
                onChange={handleChange}
                number
                value={samityInfo.memberMaxAge}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfo.memberMaxAge ? (
                <span style={{ color: 'red' }}>{formErrors.memberMaxAge}</span>
              ) : samityInfo.memberMaxAge.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.memberMaxAge}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfo.projectName != '' &&
            !fieldHideShowObj.samityMinMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.samityMinMember
                    ? star(labelObj.samityMinMember)
                    : star('সমিতির সবনিম্ন সদস্য')
                }
                name="samityMinMember"
                id="number"
                onChange={handleChange}
                number
                value={samityInfo.samityMinMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfo.samityMinMember ? (
                <span style={{ color: 'red' }}>{formErrors.samityMinMember}</span>
              ) : samityInfo.samityMinMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.samityMinMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}

          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfo.projectName != '' &&
            !fieldHideShowObj.samityMaxMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.samityMaxMember
                    ? star(labelObj.samityMaxMember)
                    : star('সমিতির সর্বোচ্চ সদস্য ')
                }
                name="samityMaxMember"
                onChange={handleChange}
                id="number"
                value={samityInfo.samityMaxMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfo.samityMaxMember ? (
                <span style={{ color: 'red' }}>{formErrors.samityMaxMember}</span>
              ) : samityInfo.samityMaxMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.samityMaxMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}

          {Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfo.projectName != '' &&
            !fieldHideShowObj.groupMinMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.groupMinMember
                    ? labelObj.groupMinMember
                    : 'দলের সর্বনিম্ন সদস্য '
                }
                name="groupMinMember"
                onChange={handleChange}
                id="number"
                value={samityInfo.groupMinMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfo.groupMinMember ? (
                <span style={{ color: 'red' }}>{formErrors.groupMinMember}</span>
              ) : samityInfo.groupMinMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.groupMinMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}

          {Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfo.projectName != '' &&
            !fieldHideShowObj.groupMaxMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.groupMaxMember
                    ? labelObj.groupMaxMember
                    : 'দলের সর্বোচ্চ সদস্য '
                }
                name="groupMaxMember"
                id="number"
                onChange={handleChange}
                number
                value={samityInfo.groupMaxMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfo.groupMaxMember ? (
                <span style={{ color: 'red' }}>{formErrors.groupMaxMember}</span>
              ) : samityInfo.groupMaxMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.groupMaxMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          <Grid item md={4} xs={12}>
            <FormControl component="isSme">
              <RadioGroup row aria-label="isSme" name="isSme" required value={samityInfo.isSme} onChange={handleChange}>
                <FormLabel component="smeValue" style={{ padding: '6px 6px' }}>
                  সিস্টেম এর প্রয়োজনে?
                </FormLabel>
                <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                <FormControlLabel value={false} control={<Radio />} label="না" />
              </RadioGroup>
            </FormControl>
            {!samityInfo.isSme && <span style={{ color: 'red' }}>{formErrors.isSme}</span>}
          </Grid>
          {/* ==============================  school info ============================== */}
          {samityTypeSelection &&
            (fieldHideShowObj.instituteAddress || fieldHideShowObj.instituteName || fieldHideShowObj.instituteCode) &&
            samityTypeValue == 'G' && (
              <Grid item md={12} xs={12}>
                <Grid item container spacing={2.5}>
                  {fieldHideShowObj && Object.keys(fieldHideShowObj).length >= 1 && fieldHideShowObj.instituteName ? (
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label={
                          labelObj && Object.keys(labelObj).length >= 1 && labelObj.instituteName
                            ? labelObj.instituteName
                            : 'হাই স্কুলের নাম'
                        }
                        name="instituteName"
                        onChange={handleChange}
                        number
                        value={samityInfo.instituteName}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {samityInfo.instituteName.length == 0 && (
                        <span style={{ color: 'red' }}>{formErrors.instituteName}</span>
                      )}
                    </Grid>
                  ) : (
                    ''
                  )}
                  {fieldHideShowObj && Object.keys(fieldHideShowObj).length >= 1 && fieldHideShowObj.instituteCode ? (
                    <Grid item md={4} xs={12}>
                      <TextField
                        label={
                          labelObj && Object.keys(labelObj).length >= 1 && labelObj.instituteCode
                            ? labelObj.instituteCode
                            : 'হাই স্কুলের কোড নং'
                        }
                        name="instituteCode"
                        fullWidth
                        onChange={handleChange}
                        number
                        value={samityInfo.instituteCode}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {samityInfo.instituteCode.length == 0 && (
                        <span style={{ color: 'red' }}>{formErrors.instituteCode}</span>
                      )}
                    </Grid>
                  ) : (
                    ''
                  )}
                  {fieldHideShowObj &&
                    Object.keys(fieldHideShowObj).length >= 1 &&
                    fieldHideShowObj.instituteAddress ? (
                    <Grid item md={4} xs={12}>
                      <TextField
                        label={
                          labelObj && Object.keys(labelObj).length >= 1 && labelObj.instituteAddress
                            ? labelObj.instituteAddress
                            : 'হাই স্কুলের নাম ঠিকানা'
                        }
                        fullWidth
                        name="instituteAddress"
                        onChange={handleChange}
                        number
                        value={samityInfo.instituteAddress}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {samityInfo.instituteAddress.length == 0 && (
                        <span style={{ color: 'red' }}>{formErrors.instituteAddress}</span>
                      )}
                    </Grid>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            )}
        </Grid>
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="পরবর্তী পাতা">
          <Button variant="contained" className="btn btn-primary" onClick={onSubmitData}>
            পরবর্তী পাতা
            <ArrowForwardIosIcon />
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default SamityRegFromServey;
