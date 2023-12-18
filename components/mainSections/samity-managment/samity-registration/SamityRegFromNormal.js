/* eslint-disable no-misleading-character-class */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import {
  bangToEng,
  engToBang,
  myValidate,
} from 'components/mainSections/samity-managment/member-registration/validator';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  codeMaster,
  districtRoute,
  fieldOffRoute,
  loanProject,
  loanSamityReg,
  permissionRoute,
  unionRoute,
  upazilaRoute,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';


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
const SamityRegFromNormal = () => {
  const config = localStorageData('config');
  const compoName = localStorageData('componentName');
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const [samityInfoFromNormal, setSamityInfoFromNormal] = useState({
    projectName: '',
    samityName: '',
    foCode: '',
    address: '',
    radioValue: 'OTH',
    meetingDay: '',
    memberMinAge: '',
    memberMaxAge: '',
    samityMinMember: '',
    samityMaxMember: '',
    groupMinMember: '',
    groupMaxMember: '',
    districtId: '',
    upaCityId: '',
    upaCityType: '',
    upaCityIdType: '',
    uniThanaPawId: '',
    uniThanaPawType: '',
    uniThanaPawIdType: '',
    instituteName: '',
    instituteAddress: '',
    instituteCode: '',
    isSme: false,
    meetingType: '',
    weeklyType: '',
  });
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [day, setDay] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [labelForSamity, setLabelForSamity] = useState('সমিতির নাম');
  const [fieldHideShowObj, setFieldHideShowObj] = useState({});
  const [projects, setProjects] = useState([]);
  const [fieldOfficersList, setFieldOfficersList] = useState([]);
  const [districtIdList, setDistrictIdList] = useState([]);
  const [upazilaIdList, setUpazilaIdList] = useState([]);
  const [unionIdList, setUnionIdList] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [upazilaId, setUpazilaId] = useState(null);
  const [unionId, setUnionId] = useState(null);
  const [samityTypeSelection, setSamityTypeSelection] = useState(false);
  const [disableProject, setDisableProject] = useState('');
  const [disableDistrict, setDisableDistrict] = useState('');
  const [disableUpazila, setDisableUpazila] = useState('');
  const [disableUnion, setDisableUnion] = useState('');
  const [labelObj, setLabelObj] = useState({});
  const [passBookFee, setPassBookFee] = useState('');
  const [admissionFee, setAdmissionFee] = useState('');
  const [samityTypeValue, setSamityTypeValue] = useState();

  let checkMandatory = () => {
    let flag = true;

    let newObj = {};
    let stateObj = { ...samityInfoFromNormal };
    if (samityInfoFromNormal.projectName.length == 0 || samityInfoFromNormal.projectName == 'নির্বাচন করুন') {
      flag = false;
      newObj.projectName = 'প্রকল্প নির্বাচন করুন';
    } else {
      newObj.projectName = '';
    }
    if (
      samityInfoFromNormal.uniThanaPawIdType.length == 0 ||
      samityInfoFromNormal.uniThanaPawIdType == 'নির্বাচন করুন'
    ) {
      flag = false;
      newObj.unionId = 'ইউনিয়ন নির্বাচন করুন';
    } else {
      newObj.unionId = '';
    }

    if (samityInfoFromNormal.foCode.length == 0 || samityInfoFromNormal.foCode == 'নির্বাচন করুন') {
      flag = false;
      newObj.foCode = 'মাঠ কর্মী নির্বাচন করুন';
    }
    if (samityInfoFromNormal.meetingType.length == 0 || samityInfoFromNormal.meetingType == 'নির্বাচন করুন') {
      flag = false;
      newObj.meetingType = 'মিটিং  নির্বাচন করুন';
    }

    if (samityInfoFromNormal.meetingDay.length == 0 || samityInfoFromNormal.meetingDay == 'নির্বাচন করুন') {
      flag = false;
      newObj.meetingDay = 'মিটিং দিন নির্বাচন করুন';
    }

    if (samityInfoFromNormal.projectName == '13' && samityTypeValue == 'G') {
      if (samityInfoFromNormal.instituteAddress.length == 0) {
        flag = false;
        newObj.instituteAddress = 'হাই স্কুল এর ঠিকানা উল্লেখ করুন';
      } else {
        newObj.instituteAddress = '';
      }
    }

    if (samityInfoFromNormal.projectName == '13' && samityTypeValue == 'G') {
      if (samityInfoFromNormal.instituteName.length == 0) {
        flag = false;
        newObj.instituteName = 'হাই স্কুল এর নাম উল্লেখ করুন';
      } else {
        newObj.instituteName = '';
      }
    }

    if (samityInfoFromNormal.projectName == '13' && samityTypeValue == 'G') {
      if (samityInfoFromNormal.instituteCode.length == 0) {
        flag = false;
        newObj.instituteCode = 'হাই স্কুল এর কোড উল্লেখ করুন';
      } else {
        newObj.instituteCode = '';
      }
    }

    if (samityInfoFromNormal.samityMaxMember.length == 0) {
      flag = false;
      newObj.samityMaxMember = 'সমিতি এর সর্বোচ্চ সদস্য সংখ্যা উল্লেখ করুন';
    }
    if (samityInfoFromNormal.samityMinMember.length == 0) {
      flag = false;
      newObj.samityMinMember = 'সমিতি এর সর্বনিম্ন সদস্য সংখ্যা উল্লেখ করুন';
    }
    if (samityInfoFromNormal.memberMaxAge.length == 0) {
      flag = false;
      newObj.memberMaxAge = 'সমিতি এর সদস্যের সর্বোচ্চ বয়স উল্লেখ করুন';
    }
    if (samityInfoFromNormal.memberMinAge.length == 0) {
      flag = false;
      newObj.memberMinAge = 'সমিতি এর সদস্যের সর্বনিম্ন বয়স উল্লেখ করুন';
    }
    if (samityInfoFromNormal.samityName.trim().length == 0) {
      flag = false;
      newObj.samityName = labelForSamity + ' উল্লেখ করুন';
      stateObj.samityName = '';
    }
    if (samityInfoFromNormal.address.trim().length == 0) {
      flag = false;
      newObj.address = 'ঠিকানা উল্লেখ করুন';
      stateObj.address = '';
    }

    for (const key in formErrors) {
      if (formErrors[key]) {
        flag = false;
      }
    }
    // setTimeout(() => {
    //   setSamityInfoFromNormal(stateObj);
    // }, 1);
    setTimeout(() => {
      setFormErrors(newObj);
    }, 1);
    return flag;
  };
  let regexResultFunc = (regex, value) => {
    return regex.test(value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj, idType, IdType;
    const newError = { ...formErrors };
    if (name == 'projectName') {
      formErrors.projectName = '';
      if (value == 13) {
        setSamityTypeSelection(true);
      } else {
        setSamityTypeSelection(false);
      }
    }
    if (name == 'projectName') {
      getPermission(value);
      getAdmissionFee(value);
      setSamityInfoFromNormal({
        ...samityInfoFromNormal,
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
      case 'districtId':
        if (value == 'নির্বাচন করুন') {
          formErrors.districtId = 'নির্বাচন করুন';
        } else {
          formErrors.districtId = '';
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          districtId: value,
        });
        getupazilaId(value);
        return;
      case 'upazilaId':
        if (value == 'নির্বাচন করুন') {
          formErrors.upazilaId = 'নির্বাচন করুন';
        } else {
          formErrors.upazilaId = '';
        }
        setUpazilaId(value);
        getunionId(value);
        idType = value.split(',');
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          ['upaCityId']: idType[0],
          ['upaCityType']: idType[1],
          ['upaCityIdType']: value,
        });

        return;
      case 'unionId':
        if (value == 'নির্বাচন করুন') {
          formErrors.unionId = 'নির্বাচন করুন';
        } else {
          formErrors.unionId = '';
        }
        IdType = value.split(',');
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          ['uniThanaPawId']: IdType[0],
          ['uniThanaPawType']: IdType[1],
          ['uniThanaPawIdType']: value,
        });

        return;
      case 'samityName':
        formErrors.samityName = '';
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setSamityInfoFromNormal({
            ...samityInfoFromNormal,
            [name]: value.replace(/[^A-Za-z0-9.''-\s]/gi, ''),
          });
          return;
        } else {
          setSamityInfoFromNormal({
            ...samityInfoFromNormal,
            [name]: value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      case 'address':
        formErrors.address = '';
        break;

      case 'memberMinAge':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfoFromNormal.memberMaxAge) &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) <= Number(bangToEng(e.target.value))
        ) {
          newError.memberMinAge =
            'সমিতির সদস্যের সর্বনিম্ন বয়স সমিতির সদস্যের সর্বোচ্চ বয়স অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfoFromNormal.memberMaxAge) &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) > Number(bangToEng(value)) &&
          Number(bangToEng(samityInfoFromNormal.projectName)) != 13 &&
          samityTypeValue != 'G'
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        } else {
          newError.memberMinAge = '';
        }
        if (samityTypeValue == 'G' && samityInfoFromNormal.projectName == 13 && Number(bangToEng(value)) > 18) {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ অপেক্ষা বড় হতে পারবে না';
        }

        if (
          bangToEng(samityInfoFromNormal.memberMaxAge) &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) > Number(bangToEng(e.target.value)) &&
          bangToEng(samityInfoFromNormal.projectName) == 13 &&
          samityTypeValue === 'G' &&
          Number(bangToEng(samityInfoFromNormal.memberMinAge)) < 18 &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) <= 18
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        }
        if (
          bangToEng(samityInfoFromNormal.memberMaxAge) &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) > Number(bangToEng(e.target.value)) &&
          bangToEng(samityInfoFromNormal.projectName) !== 13 &&
          samityTypeValue !== 'G' &&
          samityInfoFromNormal.memberMinAge <= 18 &&
          samityInfoFromNormal.memberMaxAge <= 65
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        }
        if (Number(bangToEng(value) < 18 || Number(bangToEng(value)) > 65) && value != '' && samityTypeValue != 'G') {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }
        if (
          samityInfoFromNormal.memberMaxAge &&
          Number(
            bangToEng(samityInfoFromNormal.memberMaxAge) < 18 ||
            Number(bangToEng(samityInfoFromNormal.memberMaxAge)) > 65,
          ) &&
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
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfoFromNormal.memberMinAge) &&
          value &&
          Number(bangToEng(samityInfoFromNormal.memberMinAge)) >= Number(bangToEng(e.target.value))
        ) {
          newError.memberMaxAge =
            'সমিতির সদস্যের সর্বনিম্ন বয়স সমিতির সদস্যের সর্বোচ্চ বয়স অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfoFromNormal.memberMinAge) &&
          Number(bangToEng(samityInfoFromNormal.memberMinAge)) < Number(bangToEng(e.target.value)) &&
          Number(bangToEng(samityInfoFromNormal.projectName)) != 13
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        } else {
          newError.memberMaxAge = '';
        }
        if (
          samityTypeValue == 'G' &&
          bangToEng(samityInfoFromNormal.projectName) == 13 &&
          Number(bangToEng(value)) > 18
        ) {
          newError.memberMaxAge = 'সমিতির সদস্যের সর্বোচ্চ বয়স ১৮ অপেক্ষা বড় হতে পারবে না';
        }
        if (Number(bangToEng(value) < 18 || Number(bangToEng(value)) > 65) && value != '' && samityTypeValue != 'G') {
          newError.memberMaxAge = 'সমিতির সদস্যের সর্বোচ্চ বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }
        if (
          samityInfoFromNormal.memberMinAge &&
          Number(
            bangToEng(samityInfoFromNormal.memberMinAge) < 18 ||
            Number(bangToEng(samityInfoFromNormal.memberMinAge)) > 65,
          ) &&
          value != '' &&
          samityTypeValue != 'G'
        ) {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }

        setFormErrors(newError);
        break;
      case 'samityMinMember':
        resultObj = myValidate('threeNumber', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfoFromNormal.samityMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.samityMaxMember)) <= Number(bangToEng(e.target.value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMinMember: 'সমিতির সর্বনিম্ন সদস্য সমিতির সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 100);
        } else if (
          bangToEng(samityInfoFromNormal.samityMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.samityMaxMember)) > Number(bangToEng(e.target.value))
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
        break;
      case 'samityMaxMember':
        resultObj = myValidate('threeNumber', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfoFromNormal.samityMinMember) &&
          value &&
          Number(bangToEng(samityInfoFromNormal.samityMinMember)) >= Number(bangToEng(value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMaxMember: 'সমিতির সর্বনিম্ন সদস্য সমিতির সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 100);
        } else if (
          bangToEng(samityInfoFromNormal.samityMinMember) &&
          Number(bangToEng(samityInfoFromNormal.samityMinMember)) < Number(bangToEng(value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMaxMember: '',
              samityMinMember: '',
            });
          }, 100);
        } else {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              samityMaxMember: '',
            });
          }, 100);
        }
        break;
      case 'groupMinMember':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj?.value,
        });
        if (
          bangToEng(samityInfoFromNormal.groupMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.groupMaxMember)) <= Number(bangToEng(e.target.value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMinMember:
                'সমিতির দলের সর্বনিম্ন সদস্য সমিতির দলের সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 100);
        } else if (
          bangToEng(samityInfoFromNormal.groupMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.groupMaxMember)) > Number(bangToEng(value))
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
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj?.value,
        });
        if (
          samityInfoFromNormal.groupMinMember &&
          value &&
          Number(bangToEng(samityInfoFromNormal.groupMinMember)) >= Number(bangToEng(value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMaxMember:
                'সমিতির দলের সর্বনিম্ন সদস্য সমিতির দলের সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না',
            });
          }, 100);
        } else if (
          samityInfoFromNormal.groupMinMember &&
          Number(bangToEng(samityInfoFromNormal.groupMinMember)) < Number(bangToEng(value))
        ) {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMaxMember: '',
              groupMinMember: '',
            });
          }, 100);
        } else {
          setTimeout(() => {
            setFormErrors({
              ...formErrors,
              groupMaxMember: '',
            });
          }, 100);
        }
        return;

      case 'instituteCode':
        resultObj = myValidate('fourNumber', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj?.value,
        });
        return;
    }

    if (
      e.target.name != 'memberMinAge' &&
      e.target.name != 'memberMaxAge' &&
      e.target.name != 'samityMinMember' &&
      e.target.name != 'samityMaxMember'
    ) {
      setSamityInfoFromNormal({
        ...samityInfoFromNormal,
        [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    getDay();
    getdistrictId();
    getProject();
    getFieldOfficers();
  }, []);
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
  let getAdmissionFee = async (value) => {
    try {
      let showData = await axios.get(loanProject + 'projectWithPagination?page=1&id=' + value, config);
      setAdmissionFee(engToBang(showData?.data?.data?.data[0]?.admissionFee ?? ''));
      setPassBookFee(engToBang(showData?.data?.data?.data[0]?.passbookFee ?? ''));
    } catch (error) {
      errorHandler(error)
    }
  };
  let getdistrictId = async () => {
    try {
      let districtIdList;
      if (getTokenData.doptorId == 4 || getTokenData.doptorId == 8)
        districtIdList = await axios.get(districtRoute + '?allDistrict=true', config);
      else districtIdList = await axios.get(districtRoute, config);
      if (districtIdList.data.data.length == 1) {
        setDistrictId(districtIdList.data.data[0].id);
        setDisableDistrict(true);
        getupazilaId(districtIdList.data.data[0].id, true);
      }
      setDistrictIdList(districtIdList.data.data);
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
  let getupazilaId = async (districtId, disableDistrict) => {
    try {
      let upazilaList;
      //DoptorId==4(BARD) & DoptorId==8(RDA)--->All distrcit and upazila should be opened because of they can create samity all over the country
      if (getTokenData.doptorId == 4 || getTokenData.doptorId == 8)
        upazilaList = await axios.get(upazilaRoute + '?district=' + districtId + '&address=1', config);
      else if (!disableDistrict) {
        upazilaList = await axios.get(upazilaRoute + '?district=' + districtId + '&address=1', config);
      }
      //0--->token permitted zone and 1->for all
      else upazilaList = await axios.get(upazilaRoute + '?district=' + districtId + '&address=0', config);
      let upazilaArray = upazilaList.data.data;
      let newUpazilaList = upazilaArray.map((obj) => {
        obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
        return obj;
      });
      if (newUpazilaList.length == 1) {
        setUpazilaId(newUpazilaList[0].upaCityIdType);
        setDisableUpazila(true);
        getunionId(newUpazilaList[0].upaCityIdType);
      }
      setUpazilaIdList(newUpazilaList);
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
  let getunionId = async (upaCity) => {
    let upacity_id_type = upaCity.split(',');
    try {
      let unionList = await axios.get(
        unionRoute + '?type=' + upacity_id_type[1] + '&address=1&upazila=' + upacity_id_type[0],
        config,
      );
      let unionArray = unionList.data.data;
      let newUnionList = unionArray.map((obj) => {
        obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
        return obj;
      });
      if (newUnionList.length == 1) {
        setUnionId(newUnionList[0].uniThanaPawIdType);
        setSamityInfoFromNormal({ ...samityInfoFromNormal, uniThanaPawIdType: newUnionList[0].uniThanaPawIdType });
        // document.getElementById("union").setAttribute("disabled", "true");
        setDisableUnion(true);
      }
      if (newUnionList.length > 1) {
        setDisableUnion(false);
      }
      setUnionIdList(newUnionList);
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

  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);
      if (projectData.data.data.length == 1) {
        if (projectData.data.data[0].id == 13) {
          setSamityTypeSelection(true);
        } else {
          setSamityTypeSelection(false);
        }
        // setProject(projectData.data.data[0].id);
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          projectName: projectData.data.data[0].id,
        });
        getPermission(projectData.data.data[0].id);
        getAdmissionFee(projectData.data.data[0].id);
        setDisableProject(true);
        // document.getElementById("projectName").setAttribute("disabled", "true");
      }
      setProjects(projectData.data.data);
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
  let getFieldOfficers = async () => {
    try {
      let fieldOffList = await axios.get(fieldOffRoute, config);
      if (fieldOffList.data.data) {
        setFieldOfficersList(fieldOffList.data.data);
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
  let getPermission = async (id) => {
    if (id != 'নির্বাচন করুন') {
      if (formErrors.projectName) {
        formErrors.projectName = '';
      }
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
        }
        // show();
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
    }
  };


  let handleChangeOfSamityTypeSelect = (e) => {
    setSamityTypeValue(e.target.value);
    setSamityInfoFromNormal({
      ...samityInfoFromNormal,
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
  };

  let onSubmitData = async () => {
    let samityData;
    // e.preventDefault();
    let upaCityIdTypeArray;
    let uniThanaPawTypeArray;
    if (upazilaIdList.length == 1) {
      upaCityIdTypeArray = upazilaId.split(',');
    }
    if (unionIdList.length == 1) {
      uniThanaPawTypeArray = unionId.split(',');
    }
    let mandatory = checkMandatory();
    if (mandatory) {
      let payload = {
        projectId: parseInt(samityInfoFromNormal.projectName),
        data: {
          basic: {
            samityName: samityInfoFromNormal.samityName,
            districtId: districtIdList.length > 1 ? samityInfoFromNormal.districtId : districtId,
            upaCityId:
              upazilaIdList.length > 1
                ? samityInfoFromNormal.upaCityId
                : upaCityIdTypeArray[0]
                  ? upaCityIdTypeArray[0]
                  : '',
            upaCityType:
              upazilaIdList.length > 1
                ? samityInfoFromNormal.upaCityType
                : upaCityIdTypeArray[1]
                  ? upaCityIdTypeArray[1]
                  : '',
            uniThanaPawId:
              unionIdList.length > 1
                ? samityInfoFromNormal.uniThanaPawId
                : uniThanaPawTypeArray && uniThanaPawTypeArray[0]
                  ? uniThanaPawTypeArray[0]
                  : null,
            uniThanaPawType:
              unionIdList.length > 1
                ? samityInfoFromNormal.uniThanaPawType
                : uniThanaPawTypeArray && uniThanaPawTypeArray[1]
                  ? uniThanaPawTypeArray[1]
                  : null,
            address: samityInfoFromNormal.address,
            meetingDay: samityInfoFromNormal.meetingDay,
            ...(samityInfoFromNormal.meetingType == 'M' && {
              weekPosition: samityInfoFromNormal.weeklyType,
            }),
            meetingType: samityInfoFromNormal.meetingType,
            foCode: samityInfoFromNormal.foCode,

            isSme: samityInfoFromNormal.isSme == 'true' ? true : false,
            ...(samityInfoFromNormal.instituteName && {
              instituteName: samityInfoFromNormal.instituteName,
            }),
            ...(samityInfoFromNormal.instituteAddress && {
              instituteAddress: samityInfoFromNormal.instituteAddress,
            }),
            ...(samityInfoFromNormal.instituteCode && {
              instituteCode: samityInfoFromNormal.instituteCode,
            }),
            flag: 3,
            ...(samityTypeValue && { samityType: samityTypeValue }),
          },
          setup: {
            ...(samityInfoFromNormal.memberMinAge && {
              memberMinAge: bangToEng(samityInfoFromNormal.memberMinAge),
            }),
            ...(samityInfoFromNormal.memberMaxAge && {
              memberMaxAge: bangToEng(samityInfoFromNormal.memberMaxAge),
            }),
            ...(samityInfoFromNormal.samityMinMember && {
              samityMinMember: bangToEng(samityInfoFromNormal.samityMinMember),
            }),
            ...(samityInfoFromNormal.samityMaxMember && {
              samityMaxMember: bangToEng(samityInfoFromNormal.samityMaxMember),
            }),
            ...(samityInfoFromNormal.groupMinMember && {
              groupMinMember: bangToEng(samityInfoFromNormal.groupMinMember),
            }),
            ...(samityInfoFromNormal.groupMaxMember && {
              groupMaxMember: bangToEng(samityInfoFromNormal.groupMaxMember),
            }),
            samityMemberType: samityInfoFromNormal.radioValue,
          },
          memberInfo: [],
        },
      };
      try {
        setLoadingDataSaveUpdate(true);
        samityData = await axios.post(loanSamityReg + '/' + compoName, payload, config);
        NotificationManager.success(samityData.data.message, '', 5000);
        setLoadingDataSaveUpdate(false);
        setSamityInfoFromNormal({
          // ...samityInfoFromNormal,
          // ...(projects.length > 1 && { projectName: "নির্বাচন করুন" }),
          projectName: 'নির্বাচন করুন',
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
          isSme: false,
          meetingType: 'নির্বাচন করুন',
          weeklyType: 'নির্বাচন করুন',
        });
        // setUnionId()
      } catch (error) {
        setLoadingDataSaveUpdate(false);

        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };
  return (
    <>
      <Grid container className="section">
        <SubHeading>ম্যানুয়াল সমিতি/সংঘ/দল নিবন্ধন</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('প্রকল্পের নাম')}
              name="projectName"
              disabled={disableProject}
              select
              SelectProps={{ native: true }}
              value={samityInfoFromNormal.projectName ? samityInfoFromNormal.projectName : ' '}
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
            {(samityInfoFromNormal.projectName == 'নির্বাচন করুন' || !samityInfoFromNormal.projectName) && (
              <span style={{ color: 'red' }}>{formErrors.projectName}</span>
            )}
          </Grid>
          {samityTypeSelection ? (
            <>
              <Grid item md={3} xs={12}>
                <FormControl component="samityTypeValue">
                  <RadioGroup
                    row
                    aria-label="samityTypeValue"
                    name="samityTypeValue"
                    value={samityTypeValue}
                    onChange={handleChangeOfSamityTypeSelect}
                  >
                    <FormControlLabel value="S" control={<Radio />} label="সমিতি" />
                    <FormControlLabel value="G" control={<Radio />} label="সংঘ" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <br />
              {!samityTypeValue && <span style={{ color: 'red' }}>{formErrors.samityTypeValue}</span>}
            </>
          ) : (
            ''
          )}

          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              fullWidth
              label={star(labelForSamity)}
              name="samityName"
              onChange={handleChange}
              bangToEng
              value={samityInfoFromNormal.samityName}
              variant="outlined"
              size="small"
            ></TextField>
            {!samityInfoFromNormal.samityName && <span style={{ color: 'red' }}>{formErrors.samityName}</span>}
          </Grid>

          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              fullWidth
              label={star('মাঠ কর্মী')}
              name="foCode"
              select
              SelectProps={{ native: true }}
              value={samityInfoFromNormal.foCode ? samityInfoFromNormal.foCode : ' '}
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
            {!samityInfoFromNormal.foCode && <span style={{ color: 'red' }}>{formErrors.foCode}</span>}
          </Grid>
          {/* )} */}
          {/* <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="বিভাগ"
              name="division"
              required
              id="division"
              select
              SelectProps={{ native: true }}
              value={
                division != null ? division : samityInfoFromNormal.division
              }
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: "#FFF" }}
            >
              <option>- নির্বাচন করুন -</option>
              {divisionList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.divisionNameBangla}
                </option>
              ))}
            </TextField>
          </Grid> */}

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('জেলা')}
              name="districtId"
              id="districtId"
              disabled={disableDistrict}
              select
              SelectProps={{ native: true }}
              value={
                districtId != null
                  ? districtId
                  : samityInfoFromNormal.districtId
                    ? samityInfoFromNormal.districtId
                    : ' '
              }
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {districtIdList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('উপজেলা/সিটি কর্পোরেশন')}
              name="upazilaId"
              id="upazilaId"
              disabled={disableUpazila}
              select
              SelectProps={{ native: true }}
              value={
                upazilaId != null
                  ? upazilaId
                  : samityInfoFromNormal.upaCityIdType
                    ? samityInfoFromNormal.upaCityIdType
                    : ' '
              }
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {upazilaIdList.map((option) => (
                <option key={option.id} value={option.upaCityIdType}>
                  {option.upaCityNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('ইউনিয়ন/থানা/পৌরসভা')}
              name="unionId"
              disabled={disableUnion}
              select
              SelectProps={{ native: true }}
              value={
                unionId != null
                  ? unionId
                  : samityInfoFromNormal.uniThanaPawIdType
                    ? samityInfoFromNormal.uniThanaPawIdType
                    : ' '
              }
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {unionIdList.map((option) => (
                <option key={option.id} value={option.uniThanaPawIdType}>
                  {option.uniThanaPawNameBangla}
                </option>
              ))}
            </TextField>
            {!samityInfoFromNormal.unionId && <span style={{ color: 'red' }}>{formErrors.unionId}</span>}
          </Grid>

          <Grid item md={8} xs={12}>
            <TextField
              fullWidth
              label={star('বিস্তারিত ঠিকানা')}
              name="address"
              onChange={handleChange}
              bangToEng
              value={samityInfoFromNormal.address}
              variant="outlined"
              size="small"
            ></TextField>

            {!samityInfoFromNormal.address && <span style={{ color: 'red' }}>{formErrors.address}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="gender"
                name="radioValue"
                required
                value={samityInfoFromNormal.radioValue}
                onChange={handleChange}
              >
                <FormControlLabel value="MAL" control={<Radio />} label="পুরুষ" />
                <FormControlLabel value="FML" control={<Radio />} label="মহিলা" />
                <FormControlLabel value="OTH" control={<Radio />} label="উভয়" />
              </RadioGroup>
            </FormControl>
            <br />
            {!samityInfoFromNormal.radioValue && <span style={{ color: 'red' }}>{formErrors.radioValue}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মিটিং এর ধরণ')}
              name="meetingType"
              onChange={handleChange}
              value={samityInfoFromNormal.meetingType ? samityInfoFromNormal.meetingType : ' '}
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
            {!samityInfoFromNormal.meetingType && <span style={{ color: 'red' }}>{formErrors.meetingType}</span>}
          </Grid>
          {samityInfoFromNormal.meetingType == 'M' && (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('বার এর অবস্থান')}
                name="weeklyType"
                onChange={handleChange}
                value={samityInfoFromNormal.weeklyType ? samityInfoFromNormal.weeklyType : ' '}
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
              {!samityInfoFromNormal.meetingDay && <span style={{ color: 'red' }}>{formErrors.meetingDay}</span>}
            </Grid>
          )}
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মিটিং এর দিন')}
              name="meetingDay"
              onChange={handleChange}
              value={samityInfoFromNormal.meetingDay ? samityInfoFromNormal.meetingDay : ' '}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {day.length >= 1 &&
                day.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
            </TextField>
            {!samityInfoFromNormal.meetingDay && <span style={{ color: 'red' }}>{formErrors.meetingDay}</span>}
          </Grid>
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfoFromNormal.projectName != '' &&
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
                onChange={handleChange}
                bangToEng
                value={samityInfoFromNormal.memberMinAge}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.memberMinAge ? (
                <span style={{ color: 'red' }}>{formErrors.memberMinAge}</span>
              ) : samityInfoFromNormal.memberMinAge.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.memberMinAge}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfoFromNormal.projectName != '' &&
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
                onChange={handleChange}
                bangToEng
                value={samityInfoFromNormal.memberMaxAge}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.memberMaxAge ? (
                <span style={{ color: 'red' }}>{formErrors.memberMaxAge}</span>
              ) : samityInfoFromNormal.memberMaxAge.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.memberMaxAge}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfoFromNormal.projectName != '' &&
            !fieldHideShowObj.samityMinMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.samityMinMember
                    ? star(labelObj.samityMinMember)
                    : star('সমিতির সর্বনিম্ন সদস্য ')
                }
                name="samityMinMember"
                onChange={handleChange}
                bangToEng
                value={samityInfoFromNormal.samityMinMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.samityMinMember ? (
                <span style={{ color: 'red' }}>{formErrors.samityMinMember}</span>
              ) : samityInfoFromNormal.samityMinMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.samityMinMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfoFromNormal.projectName != '' &&
            !fieldHideShowObj.samityMaxMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={
                  labelObj && Object.keys(labelObj).length >= 1 && labelObj.samityMaxMember
                    ? star(labelObj.samityMaxMember)
                    : star('সমিতির সর্বোচ্চ সদস্য')
                }
                name="samityMaxMember"
                onChange={handleChange}
                bangToEng
                value={samityInfoFromNormal.samityMaxMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.samityMaxMember ? (
                <span style={{ color: 'red' }}>{formErrors.samityMaxMember}</span>
              ) : samityInfoFromNormal.samityMaxMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.samityMaxMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfoFromNormal.projectName != '' &&
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
                bangToEng
                value={samityInfoFromNormal.groupMinMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.groupMinMember ? (
                <span style={{ color: 'red' }}>{formErrors.groupMinMember}</span>
              ) : samityInfoFromNormal.groupMinMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.groupMinMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            samityInfoFromNormal.projectName != '' &&
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
                onChange={handleChange}
                bangToEng
                value={samityInfoFromNormal.groupMaxMember}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.groupMaxMember ? (
                <span style={{ color: 'red' }}>{formErrors.groupMaxMember}</span>
              ) : samityInfoFromNormal.groupMaxMember.length > 0 ? (
                <span style={{ color: 'red' }}>{formErrors.groupMaxMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সদস্য ভর্তি ফি(টাকা)"
              name="admissionFee"
              onChange={handleChange}
              bangToEng
              value={admissionFee}
              disabled={true}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="পাসবুক ফি (টাকা)"
              name="passbookFee"
              onChange={handleChange}
              disabled={true}
              value={passBookFee}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl component="isSme">
              <RadioGroup
                row
                aria-label="isSme"
                name="isSme"
                required
                value={samityInfoFromNormal.isSme}
                onChange={handleChange}
              >
                <FormLabel component="smeValue" style={{ padding: '6px 6px' }}>
                  সিস্টেম এর প্রয়োজনে?
                </FormLabel>
                <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                <FormControlLabel value={false} control={<Radio />} label="না" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <Grid item md={12} xs={12}>
        {samityTypeSelection &&
          (fieldHideShowObj.instituteAddress || fieldHideShowObj.instituteName || fieldHideShowObj.instituteCode) &&
          samityTypeValue == 'G' && (
            <Grid container display="flex" spacing={1}>
              <Grid item md={12} xs={12}>
                <Paper>
                  <Grid container display="flex" spacing={1.6}>
                    {fieldHideShowObj && Object.keys(fieldHideShowObj).length >= 1 && fieldHideShowObj.instituteName ? (
                      <Grid item md={8} xs={12}>
                        <TextField
                          fullWidth
                          label={
                            labelObj && Object.keys(labelObj).length >= 1 && labelObj.instituteName
                              ? star(labelObj.instituteName)
                              : star('হাই স্কুলের নাম')
                          }
                          name="instituteName"
                          onChange={handleChange}
                          bangToEng
                          value={samityInfoFromNormal.instituteName}
                          variant="outlined"
                          size="small"
                        ></TextField>
                        {!samityInfoFromNormal.instituteName && (
                          <span style={{ color: 'red' }}>{formErrors.instituteName}</span>
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}
                    {fieldHideShowObj && Object.keys(fieldHideShowObj).length >= 1 && fieldHideShowObj.instituteCode ? (
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          label={
                            labelObj && Object.keys(labelObj).length >= 1 && labelObj.instituteCode
                              ? star(labelObj.instituteCode)
                              : star('হাই স্কুলের কোড নং')
                          }
                          name="instituteCode"
                          onChange={handleChange}
                          bangToEng
                          value={samityInfoFromNormal.instituteCode}
                          variant="outlined"
                          size="small"
                        ></TextField>
                        {!samityInfoFromNormal.instituteCode && (
                          <span style={{ color: 'red' }}>{formErrors.instituteCode}</span>
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}
                    {fieldHideShowObj &&
                      Object.keys(fieldHideShowObj).length >= 1 &&
                      fieldHideShowObj.instituteAddress ? (
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          label={
                            labelObj && Object.keys(labelObj).length >= 1 && labelObj.instituteAddress
                              ? star(labelObj.instituteAddress)
                              : star('হাই স্কুলের নাম ঠিকানা')
                          }
                          name="instituteAddress"
                          onChange={handleChange}
                          bangToEng
                          value={samityInfoFromNormal.instituteAddress}
                          variant="outlined"
                          size="small"
                        ></TextField>
                        {!samityInfoFromNormal.instituteAddress && (
                          <span style={{ color: 'red' }}>{formErrors.instituteAddress}</span>
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
      </Grid>
      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            "সংরক্ষণ করা হচ্ছে..."
          </LoadingButton>
        ) : (
          <Tooltip title="সংরক্ষণ করুন">
            <Button
              variant="contained"
              className="btn btn-save"
              onClick={onSubmitData}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              সংরক্ষণ করুন
            </Button>
          </Tooltip>
        )}
      </Grid>
    </>
  );
};

export default SamityRegFromNormal;
