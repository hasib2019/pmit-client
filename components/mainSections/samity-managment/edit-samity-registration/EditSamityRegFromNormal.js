/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';

import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  codeMaster,
  districtRoute,
  employeeRecordByOffice,
  loanProject,
  officeName,
  particularSamityInfoAll,
  permissionRoute,
  samityNameRoute,
  samityRegUpdate,
  sendApplySamityUpdate,
  unionRoute,
  upazilaRoute,
} from '../../../../url/ApiList';
import star from '../../loan-management/loan-application/utils';
import { bangToEng, engToBang, myValidate } from '../member-registration/validator';

// const Input = styled('input')({
//   display: 'none',
// });

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

const SamityRegFromNormal = ({ props }) => {
  const router = useRouter();

  const queryData = props.query.data && JSON.parse(decodeURIComponent(props.query.data))
  const [samityTypeValue, setSamityTypeValue] = useState('');
  const [allsamityName, setAllSamityName] = useState([]);
  // const [samityName, setSamityName] = useState();
  const [disableProject, setDisableProject] = useState('');
  const [disableDistrict, setDisableDistrict] = useState('');
  const [disableUpazila, setDisableUpazila] = useState('');
  //for BRDB feedback
  // const [disableUnion, setDisableUnion] = useState("");
  const [officeNames, setOfficeNames] = useState([]);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);

  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [selectedDesk, setSelectedDesk] = useState('');
  const [day, setDay] = useState('');
  const [deskList, setDeskList] = useState([]);
  const config = localStorageData('config');
  const [samityInfoFromNormal, setSamityInfoFromNormal] = useState({
    samityName: '',
    foCode: '',
    address: '',
    radioValue: '',
    meetingDay: '',
    memberMinAge: '',
    memberMaxAge: '',
    samityMinMember: '',
    samityMaxMember: '',
    groupMinMember: '',
    groupMaxMember: '',
    districtId: '',
    instituteName: '',
    instituteAddress: '',
    instituteCode: '',
    upaCityId: '',
    upaCityType: '',
    upaCityIdType: '',
    uniThanaPawId: '',
    uniThanaPawType: '',
    uniThanaPawIdType: '',
    meetingType: '',
    weeklyType: '',
    samityTextValue: '',
  });
  // const [activeState, setActiveState] = useState('');
  const [formErrors, setFormErrors] = useState({
    projectName: '',
    samityName: '',
    foCode: '',
    district: '',
    upazila: '',
    meetingDay: '',
    memberMinAge: '',
    memberMaxAge: '',
    samityMinMember: '',
    samityMaxMember: '',
    groupMinMember: '',
    groupMaxMember: '',
  });
  const [labelForSamity, setLabelForSamity] = useState('সমিতির নাম*');
  const [permissionArray, setPermissionArray] = useState([]);
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  // const [fieldOfficersList, setFieldOfficersList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [unionList, setUnionList] = useState([]);
  const [districtId] = useState(null);
  const [upazilaId] = useState(null);
  const [unionId] = useState(null);
  const [smeValue, setSmeValue] = useState(null);
  const [samityType, setSamityType] = useState('');
  const [fieldHideShowObj, setFieldHideShowObj] = useState({});
  const [countObj, setCountObj] = useState('');
  const [samityTypeSelection, setSamityTypeSelection] = useState(false);
  let checkMandatory = () => {

    let flag = true;
    let newObj = {};
    let stateObj = { ...samityInfoFromNormal };
    // if (
    //   project.length == 0 ||
    //   project == "নির্বাচন করুন"
    // ) {
    //   flag = false;
    //   newObj.projectName = "প্রকল্প নির্বাচন করুন";
    // } else {
    //   newObj.projectName = "";
    // }

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

    if (samityInfoFromNormal.projectName == '13' && samityType == 'G') {
      if (samityInfoFromNormal.instituteName.length == 0) {
        flag = false;
        newObj.instituteName = 'হাই স্কুল এর নাম উল্লেখ করুন';
      } else {
        newObj.instituteName = '';
      }
    }

    if (samityInfoFromNormal.projectName == '13' && samityType == 'G') {
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
      newObj.memberMaxAge = 'সমিতি এর সর্বোচ্চ বয়স উল্লেখ করুন';
    }
    if (samityInfoFromNormal.memberMinAge.length == 0) {
      flag = false;
      newObj.memberMinAge = 'সমিতি এর সর্বনিম্ন বয়স উল্লেখ করুন';
    }
    if (samityInfoFromNormal.samityName.length == 0) {
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
    setTimeout(() => {
      setSamityInfoFromNormal(stateObj);
    }, 1);
    setTimeout(() => {
      setFormErrors({ ...formErrors, ...newObj });
    }, 1);
    return flag;
  };
  let samityDocument = async (value, projectId) => {
    let samityInfo;
    console.log();
    try {
      //  if(name=="samityTypeValue"){
      //  samityInfo = await axios.get(
      //   samityNameRoute+"?project="+project+"&value="+value+"&coop=0",
      //    config
      //  );
      //  }
      //  else if(name=="projectName"){
      //   samityInfo = await axios.get(
      //     samityNameRoute+"?project="+value+"&value="+samityTypeValue+"&coop=0",
      //     config
      //   );
      //  }
      if (project != 'নির্বাচন করুন' && samityType) {
        samityInfo = await axios.get(
          samityNameRoute + '?project=' + project + '&value=' + value + '&coop=0' + '&samityType=' + samityType,
          config,
        );
      }
      else if (projectId) {
        samityInfo = await axios.get(samityNameRoute + '?project=' + projectId + '&value=' + value + '&coop=0', config);
      }
      else if (project != 'নির্বাচন করুন') {

        samityInfo = await axios.get(samityNameRoute + '?project=' + project + '&value=' + value + '&coop=0', config);
      }

      // setSamityInfoFromNormal({
      //   ...samityInfoFromNormal,
      //   foCode: 'নির্বাচন করুন',
      //   address: '',
      //   radioValue: '',
      //   meetingDay: 'নির্বাচন করুন',
      //   memberMinAge: '',
      //   memberMaxAge: '',
      //   samityMinMember: '',
      //   samityMaxMember: '',
      //   groupMinMember: '',
      //   groupMaxMember: '',
      //   instituteName: '',
      //   instituteAddress: '',
      //   instituteCode: '',
      //   uniThanaPawIdType: 'নির্বাচন করুন',
      //   meetingType: 'নির্বাচন করুন',
      //   weeklyType: 'নির্বাচন করুন',
      //   samityTextValue: '',
      // });

      let samityName = samityInfo?.data?.data;

      setAllSamityName(samityName);
    } catch (error) {
      errorHandler(error)
    }
  };

  let getParticularSamityDetails = async (id, samityTypeValueId) => {

    if (samityTypeValueId) {
      try {
        let particularSamityInfo = await axios.get(
          particularSamityInfoAll + '?value=' + samityTypeValueId + '&id=' + id,
          config,
        );
        let samityName = particularSamityInfo.data.data[0];
        samityName.isSme ? setSmeValue('T') : setSmeValue('F');
        setCountObj({
          maleMemberCount: samityName?.maleMemberCount,
          femaleMemberCount: samityName?.femaleMemberCount,
        });
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          projectName: samityName.projectId,
          samityName: samityName.id,
          samityTextValue: samityName.samityName,
          foCode: 'নির্বাচন করুন',
          address: samityName.address ? samityName.address : '',
          radioValue: samityName.samityMemberType,
          // meetingDay: samityName.weeklyMeetingDay,
          memberMinAge: samityName.memberMinAge ? engToBang(samityName.memberMinAge) : '',
          memberMaxAge: samityName.memberMaxAge ? engToBang(samityName.memberMaxAge) : '',
          samityMinMember: samityName.samityMinMember ? engToBang(samityName.samityMinMember) : '',
          samityMaxMember: samityName.samityMaxMember ? engToBang(samityName.samityMaxMember) : '',
          groupMinMember: samityName.groupMinMember ? engToBang(samityName.groupMinMember) : '',
          groupMaxMember: samityName.groupMaxMember ? engToBang(samityName.groupMaxMember) : '',
          districtId: samityName.districtId,
          upaCityId: samityName.upaCityId,
          upaCityType: samityName.upaCityType,
          upaCityIdType: samityName.upaCityId + ',' + samityName.upaCityType,
          uniThanaPawId: samityName.uniThanaPawId,
          uniThanaPawType: samityName.uniThanaPawType,
          uniThanaPawIdType: samityName.uniThanaPawId + ',' + samityName.uniThanaPawType,
          instituteName: samityName.instituteName ? samityName.instituteName : '',
          instituteAddress: samityName.instituteAddress ? samityName.instituteAddress : '',
          instituteCode: samityName.instituteCode ? samityName.instituteCode : '',
          meetingDay: samityName.meetingDay,
          weeklyType: samityName.weekPosition,
          meetingType: samityName.meetingType,
        });
        getUnion(samityName.upaCityId, samityName.upaCityType);
      } catch (err) {
        errorHandler(err)
      }
    }
    else if (samityTypeValue != 'নির্বাচন করুন') {
      try {
        let particularSamityInfo = await axios.get(
          particularSamityInfoAll + '?value=' + samityTypeValue + '&id=' + id,
          config,
        );
        let samityName = particularSamityInfo.data.data[0];
        samityName.isSme ? setSmeValue('T') : setSmeValue('F');
        setCountObj({
          maleMemberCount: samityName?.maleMemberCount,
          femaleMemberCount: samityName?.femaleMemberCount,
        });
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          projectName: samityName.projectId,
          samityName: samityName.id,
          samityTextValue: samityName.samityName,
          foCode: 'নির্বাচন করুন',
          address: samityName.address ? samityName.address : '',
          radioValue: samityName.samityMemberType,
          // meetingDay: samityName.weeklyMeetingDay,
          memberMinAge: samityName.memberMinAge ? engToBang(samityName.memberMinAge) : '',
          memberMaxAge: samityName.memberMaxAge ? engToBang(samityName.memberMaxAge) : '',
          samityMinMember: samityName.samityMinMember ? engToBang(samityName.samityMinMember) : '',
          samityMaxMember: samityName.samityMaxMember ? engToBang(samityName.samityMaxMember) : '',
          groupMinMember: samityName.groupMinMember ? engToBang(samityName.groupMinMember) : '',
          groupMaxMember: samityName.groupMaxMember ? engToBang(samityName.groupMaxMember) : '',
          districtId: samityName.districtId,
          upaCityId: samityName.upaCityId,
          upaCityType: samityName.upaCityType,
          upaCityIdType: samityName.upaCityId + ',' + samityName.upaCityType,
          uniThanaPawId: samityName.uniThanaPawId,
          uniThanaPawType: samityName.uniThanaPawType,
          uniThanaPawIdType: samityName.uniThanaPawId + ',' + samityName.uniThanaPawType,
          instituteName: samityName.instituteName ? samityName.instituteName : '',
          instituteAddress: samityName.instituteAddress ? samityName.instituteAddress : '',
          instituteCode: samityName.instituteCode ? samityName.instituteCode : '',
          meetingDay: samityName.meetingDay,
          weeklyType: samityName.weekPosition,
          meetingType: samityName.meetingType,
        });
        getUnion(samityName.upaCityId, samityName.upaCityType);
      } catch (err) {
        errorHandler(err)
      }
    }
  };
  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);

      //("Office Name Data-----", officeNameData.data.data);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      if (error.response) {
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...');
      } else if (error) {
        NotificationManager.error(error.toString());
      }
    }
  };
  const getDeskId = async (id) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, config);
      const deskData = Data.data.data;
      if (deskData.length == 1) {
        setSelectedDesk(deskData[0].designationId);
        document.getElementById('deskId').setAttribute('disabled', 'true');
      }
      setDeskList(deskData);
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
  // const handleChangeForSme = (e) => {
  //   setSmeValue(e.target.value);
  // };
  const handleDesk = (e) => {
    const { value } = e.target;
    setSelectedDesk(value);
  };
  const handleProject = (e) => {
    const { value } = e.target;
    setProject(value);
    getPermission(value);
    setSamityTypeValue('');
    setAllSamityName([]);
    setSamityInfoFromNormal({
      ...samityInfoFromNormal,
      samityName: 'নির্বাচন করুন',
      foCode: '',
      address: '',
      radioValue: '',
      meetingDay: '',
      memberMinAge: '',
      memberMaxAge: '',
      samityMinMember: '',
      samityMaxMember: '',
      groupMinMember: '',
      groupMaxMember: '',
      districtId: 'নির্বাচন করুন',
      instituteName: '',
      instituteAddress: '',
      instituteCode: '',
      upaCityId: '',
      upaCityType: '',
      upaCityIdType: 'নির্বাচন করুন',
      uniThanaPawId: '',
      uniThanaPawType: '',
      uniThanaPawIdType: 'নির্বাচন করুন',
      meetingType: '',
      weeklyType: '',
      samityTextValue: '',
    });
    setSamityType('');
    setFormErrors('');
    // if(samityTypeValue){

    //   samityDocument(name,value);
    // }
  };
  const containsSpecialChars = (str) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj;
    const newError = { ...formErrors };
    if (name == 'samityName') {

      setFormErrors(() => {
        return {};
      });
      setSamityInfoFromNormal({
        ...samityInfoFromNormal,
        [name]: value,
      });
      getParticularSamityDetails(value);
      return;
    }
    if (name == 'samityTextValue') {
      const lastValue = value[value.length - 1];
      // const lastValue= value.slice(0, -1);

      const result = containsSpecialChars(lastValue);
      if (result) {
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: value.slice(0, -1),
        });
      } else {
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: value,
        });
      }
      return;
    }
    if (name == 'samityTypeValue') {
      setSamityTypeValue(value);
      samityDocument(value);
    }
    if (name == 'address') {
      formErrors.address = '';
      setSamityInfoFromNormal({ ...samityInfoFromNormal, address: value });
      return;
    }
    if (name == 'instituteCode' || name == 'instituteName' || name == 'instituteAddress') {
      if (name == 'instituteCode') {
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
      setSamityInfoFromNormal({
        ...samityInfoFromNormal,
        [name]: value,
      });
      return;
    }
    let idType;
    let IdTypeThana;
    switch (name) {
      case 'meetingDay':
        if (value == 'নির্বাচন করুন') {
          newError.meetingDay = 'মিটিং দিন নির্বাচনকরুন';
        } else {
          newError.meetingDay = '';
        }
        break;
      case 'foCode':
        if (value == 'নির্বাচন করুন') {
          newError.foCode = 'মাঠ কর্মী নির্বাচনকরুন';
        } else {
          newError.foCode = '';
        }
        break;
      case 'samityName':
        // if (formErrors.samityName.length > 0) {
        //   formErrors.samityName = "";
        // }
        break;
      case 'memberMinAge':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj.value,
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
          samityType != 'G'
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        } else {
          newError.memberMinAge = '';
        }
        if (samityType == 'G' && samityInfoFromNormal.projectName == 13 && Number(bangToEng(value)) > 18) {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ অপেক্ষা বড় হতে পারবে না';
        }

        if (
          bangToEng(samityInfoFromNormal.memberMaxAge) &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) > Number(bangToEng(e.target.value)) &&
          bangToEng(samityInfoFromNormal.projectName) == 13 &&
          samityType === 'G' &&
          Number(bangToEng(samityInfoFromNormal.memberMinAge)) < 18 &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) <= 18
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        }
        if (
          bangToEng(samityInfoFromNormal.memberMaxAge) &&
          Number(bangToEng(samityInfoFromNormal.memberMaxAge)) > Number(bangToEng(e.target.value)) &&
          bangToEng(samityInfoFromNormal.projectName) !== 13 &&
          samityType !== 'G' &&
          samityInfoFromNormal.memberMinAge <= 18 &&
          samityInfoFromNormal.memberMaxAge <= 65
        ) {
          (newError.memberMinAge = ''), (newError.memberMaxAge = '');
        }
        if (Number(bangToEng(value) < 18 || Number(bangToEng(value)) > 65) && value != '' && samityType != 'G') {
          newError.memberMinAge = 'সমিতির সদস্যের সর্বনিম্ন বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }
        if (
          samityInfoFromNormal.memberMaxAge &&
          Number(
            bangToEng(samityInfoFromNormal.memberMaxAge) < 18 ||
            Number(bangToEng(samityInfoFromNormal.memberMaxAge)) > 65,
          ) &&
          value != '' &&
          samityType != 'G'
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
          [name]: resultObj.value,
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
        if (samityType == 'G' && bangToEng(samityInfoFromNormal.projectName) == 13 && Number(bangToEng(value)) > 18) {
          newError.memberMaxAge = 'সমিতির সদস্যের সর্বোচ্চ বয়স ১৮ অপেক্ষা বড় হতে পারবে না';
        }
        if (Number(bangToEng(value) < 18 || Number(bangToEng(value)) > 65) && value != '' && samityType != 'G') {
          newError.memberMaxAge = 'সমিতির সদস্যের সর্বোচ্চ বয়স ১৮ এবং ৬৫ এর ভিতর হতে হবে';
        }
        if (
          samityInfoFromNormal.memberMinAge &&
          Number(
            bangToEng(samityInfoFromNormal.memberMinAge) < 18 ||
            Number(bangToEng(samityInfoFromNormal.memberMinAge)) > 65,
          ) &&
          value != '' &&
          samityType != 'G'
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
          [name]: resultObj.value,
        });
        if (
          bangToEng(samityInfoFromNormal.samityMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.samityMaxMember)) <= Number(bangToEng(e.target.value))
        ) {
          newError.samityMinMember = 'সমিতির সর্বনিম্ন সদস্য সমিতির সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfoFromNormal.samityMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.samityMaxMember)) > Number(bangToEng(e.target.value))
        ) {
          (newError.samityMinMember = ''), (newError.samityMaxMember = '');
        } else {
          newError.samityMinMember = '';
        }
        break;
      case 'samityMaxMember':
        resultObj = myValidate('threeNumber', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj.value,
        });
        if (
          bangToEng(samityInfoFromNormal.samityMinMember) &&
          value &&
          Number(bangToEng(samityInfoFromNormal.samityMinMember)) >= Number(bangToEng(value))
        ) {
          newError.samityMaxMember = 'সমিতির সর্বনিম্ন সদস্য সমিতির সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfoFromNormal.samityMinMember) &&
          Number(bangToEng(samityInfoFromNormal.samityMinMember)) < Number(bangToEng(value))
        ) {
          (newError.samityMaxMember = ''), (newError.samityMinMember = '');
        } else {
          newError.samityMaxMember = '';
        }
        break;

      case 'upazilaId':
        if (value == 'নির্বাচন করুন') {
          newError.upazila = 'নির্বাচনকরুন';
        } else {
          newError.upazila = '';
        }
        idType = value.split(',');
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          ['upaCityId']: idType[0],
          ['upaCityType']: idType[1],
          ['upaCityIdType']: value,
        });
        break;
      case 'unionId':
        if (value == 'নির্বাচন করুন') {
          newError.unionId = 'নির্বাচনকরুন';
        } else {
          newError.unionId = '';
        }
        IdTypeThana = value.split(',');
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          ['uniThanaPawId']: IdTypeThana[0],
          ['uniThanaPawType']: IdTypeThana[1],
          ['uniThanaPawIdType']: value,
        });

        break;
      case 'groupMinMember':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj.value,
        });
        if (
          bangToEng(samityInfoFromNormal.groupMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.groupMaxMember)) <= Number(bangToEng(e.target.value))
        ) {
          newError.groupMinMember =
            'সমিতির দলের সর্বনিম্ন সদস্য সমিতির দলের সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfoFromNormal.groupMaxMember) &&
          Number(bangToEng(samityInfoFromNormal.groupMaxMember)) > Number(bangToEng(e.target.value))
        ) {
          (newError.groupMinMember = ''), (newError.groupMaxMember = '');
        } else {
          newError.groupMinMember = '';
        }
        break;
      case 'groupMaxMember':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: resultObj.value,
        });
        if (
          bangToEng(samityInfoFromNormal.groupMinMember) &&
          value &&
          Number(bangToEng(samityInfoFromNormal.groupMinMember)) >= Number(bangToEng(value))
        ) {
          newError.groupMaxMember =
            'সমিতির দলের সর্বনিম্ন সদস্য সমিতির দলের সর্বোচ্চ সদস্য অপেক্ষা বড় অথবা সমান হতে পারবে না';
        } else if (
          bangToEng(samityInfoFromNormal.groupMinMember) &&
          Number(bangToEng(samityInfoFromNormal.groupMinMember)) < Number(bangToEng(value))
        ) {
          (newError.groupMaxMember = ''), (newError.groupMinMember = '');
        } else {
          newError.groupMaxMember = '';
        }
        break;
      case 'instituteCode':
        if (value.length > 8) {
          return;
        }
        break;
      case 'radioValue':
        if (value == 'F') {
          if (countObj?.maleMemberCount > 0) {
            NotificationManager.error('', 'সমিতিতে ইতিমধ্যে পুরুষ সদস্য রয়েছে', 5000);
          }
        } else if (value == 'M') {
          if (countObj?.femaleMemberCount > 0) {
            NotificationManager.error('', 'সমিতিতে ইতিমধ্যে পুরুষ সদস্য রয়েছে', 5000);
          }
        }
        setSamityInfoFromNormal({
          ...samityInfoFromNormal,
          [name]: value,
        });
        break;
    }

    setFormErrors(newError);
  };
  useEffect(() => {
    // getDivision();
    getDistrict();
    getProject();
    // getFieldOfficers();
    getUpazila();
    getDay();
    getOfficeName();
    getSamityDetail()
  }, []);

  let getSamityDetail = () => {
    setProject(queryData?.item?.projectId)
    if (queryData?.item?.samityId) {

      setSamityTypeValue(1)
      samityDocument(1, queryData?.item?.projectId);

      setSamityInfoFromNormal({
        ...samityInfoFromNormal,
        ["samityName"]: queryData?.item?.samityId,
      });
      getParticularSamityDetails(queryData?.item?.samityId, 1);
    }
    else if (queryData?.id) {
      setSamityTypeValue(2);
      samityDocument(2, queryData?.item?.projectId);
      setSamityInfoFromNormal({
        ...samityInfoFromNormal,
        ["samityName"]: queryData?.id,
      });
      getParticularSamityDetails(queryData?.id, 2);
    }
  }
  let getDay = async () => {
    try {
      let dayInfo = await axios.get(codeMaster + '?codeType=MET', config);
      if (dayInfo.data.data) {
        setDay(dayInfo.data.data);
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

  let getDistrict = async () => {
    try {
      let districtList = await axios.get(districtRoute + '?allDistrict=true', config);
      // if (districtList.data.data.length == 1) {
      //   setDistrictId(districtList.data.data[0].id);
      setDisableDistrict(true);
      //   // document.getElementById("district").setAttribute("disabled", "true");
      // }
      setDistrictList(districtList.data.data);
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
  let getUpazila = async () => {
    try {
      let upazilaList = await axios.get(upazilaRoute + '?allUpazila=true', config);
      let upazilaArray = upazilaList.data.data;
      let newUpazilaList = upazilaArray.map((obj) => {
        obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
        return obj;
      });
      // if (newUpazilaList.length== 1) {
      //   setUpazilaId(newUpazilaList[0].upaCityIdType);
      //   // document.getElementById("upazila").setAttribute("disabled", "true");
      setDisableUpazila(true);
      // }
      setUpazilaList(newUpazilaList);
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

  // ("Form Object", formErrors);
  let getUnion = async (upaCityId, upaCityType) => {
    try {
      let unionList = await axios.get(
        unionRoute + '?upazila=' + upaCityId + '&type=' + upaCityType + '&address=1',
        config,
      );
      let unionArray = unionList.data.data;
      let newUnionList = unionArray.map((obj) => {
        obj['uniThanaPawIdType'] = obj['uniThanaPawId'] + ',' + obj['uniThanaPawType'];
        return obj;
      });
      // if (newUnionList.length == 1) {
      //   setUnionId(unionList.data.data[0].uniThanaPawIdType);

      //for BRDB feedback
      // setDisableUnion(true);
      // }
      setUnionList(newUnionList);
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
        setProject(projectData.data.data[0].id);
        // document.getElementById("projectName").setAttribute("disabled", "true");
        setDisableProject(true);
        getPermission(projectData.data.data[0].id);
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
  // let getFieldOfficers = async () => {
  //   try {
  //     let fieldOffList = await axios.get(fieldOffRoute, config);
  //     if (fieldOffList.data.data) {
  //       setFieldOfficersList(fieldOffList.data.data);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       // let message = error.response.data.errors[0].message;
  //       // NotificationManager.error(message, "Error", 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', '', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), '', 5000);
  //     }
  //   }
  // };
  let handleChangeOfSamityTypeSelect = (e) => {
    setSamityType(e.target.value);
    setSamityTypeValue('');
    setAllSamityName([]);
    setSamityInfoFromNormal({
      ...samityInfoFromNormal,
      samityName: 'নির্বাচন করুন',
      foCode: '',
      address: '',
      radioValue: '',
      meetingDay: '',
      memberMinAge: '',
      memberMaxAge: '',
      samityMinMember: '',
      samityMaxMember: '',
      groupMinMember: '',
      groupMaxMember: '',
      districtId: 'নির্বাচন করুন',
      instituteName: '',
      instituteAddress: '',
      instituteCode: '',
      upaCityId: '',
      upaCityType: '',
      upaCityIdType: 'নির্বাচন করুন',
      uniThanaPawId: '',
      uniThanaPawType: '',
      uniThanaPawIdType: 'নির্বাচন করুন',
      meetingType: '',
      weeklyType: '',
      samityTextValue: '',
    });
    setFormErrors('');
  };
  let getPermission = async (id) => {
    id;
    if (id != 'নির্বাচন করুন') {
      if (formErrors.projectName) {
        formErrors.projectName = '';
      }
      try {
        let permissionResp = await axios.get(permissionRoute + '?pageName=samityReg&project=' + id, config);
        let permissionRespData = permissionResp?.data?.data;

        setFieldHideShowObj(permissionRespData[0]);
        if (permissionResp?.data?.data[0]?.samityTypeSelection) {
          setSamityTypeSelection(permissionRespData[0]?.samityTypeSelection);
        } else {
          setSamityTypeSelection(false);
        }
        if (permissionResp.data.data.length >= 1) {
          if (permissionResp?.data?.data[0]?.samityType == 'C') {
            setLabelForSamity('সমবায় সমিতির নাম*');
          } else if (permissionResp.data.data[0].samityType == 'D') {
            setLabelForSamity('দলের নাম*');
          } else if (permissionResp.data.data[0].samityType == 'G') {
            setLabelForSamity('সঙ্গের নাম*');
          } else {
            setLabelForSamity('সমিতির নাম*');
          }
          setPermissionArray(permissionResp.data.data[0]);
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
  'Samity type selection---', samityTypeSelection;
  // let show = async () => {
  //   permissionArray.map((element) => {
  //     for (const key in element) {
  //       if (element[key] == "instituteName") {
  //         (element.isActive);
  //         setActiveState(element.isActive);
  //       }
  //     }
  //   });
  // };
  const onNextPage = () => {
    const urlData = {
      queryData
    }
    const encryptData = encodeURIComponent(JSON.stringify(urlData));
    router.push({
      pathname: '/samity-management/member-correction',
      query: {
        data: encryptData,
      },
    });
  }
  let onSubmitData = async (e) => {
    let samityData;
    let payload;
    e.preventDefault();
    let mandatory = checkMandatory();
    if (mandatory) {
      if (samityTypeValue == '1') {
        payload = {
          projectId: project ? parseInt(project) : null,
          samityId: samityInfoFromNormal.samityName ? parseInt(samityInfoFromNormal.samityName) : null,
          nextAppDesignationId: selectedDesk ? parseInt(selectedDesk) : null,
          data: {
            ...(samityInfoFromNormal.address != 'undefined' && {
              address: samityInfoFromNormal.address,
            }),
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
            ...(samityInfoFromNormal.meetingDay && {
              meetingDay: samityInfoFromNormal.meetingDay,
            }),
            ...(samityInfoFromNormal.instituteName && {
              instituteName: samityInfoFromNormal.instituteName,
            }),
            ...(samityInfoFromNormal.instituteCode && {
              instituteCode: samityInfoFromNormal.instituteCode,
            }),
            ...(samityInfoFromNormal.instituteAddress && {
              instituteAddress: samityInfoFromNormal.instituteAddress,
            }),
            ...(samityInfoFromNormal.radioValue && {
              samityMemberType: samityInfoFromNormal.radioValue,
            }),
          },
        };
      } else if (samityTypeValue == '2') {
        payload = {
          projectId: project ? parseInt(project) : null,
          nextAppDesignationId: selectedDesk ? parseInt(selectedDesk) : null,
          data: {
            basic: {
              samityName: samityInfoFromNormal.samityTextValue,
              districtId: districtList.length > 1 ? samityInfoFromNormal.districtId : districtId,
              upaCityId:
                upazilaList.length > 1
                  ? samityInfoFromNormal.upaCityId
                  : upaCityIdTypeArray[0]
                    ? upaCityIdTypeArray[0]
                    : '',
              upaCityType:
                upazilaList.length > 1
                  ? samityInfoFromNormal.upaCityType
                  : upaCityIdTypeArray[1]
                    ? upaCityIdTypeArray[1]
                    : '',
              uniThanaPawId: unionList.length > 1 ? samityInfoFromNormal.uniThanaPawId : uniThanaPawTypeArray[0],
              uniThanaPawType: unionList.length > 1 ? samityInfoFromNormal.uniThanaPawType : uniThanaPawTypeArray[1],
              address: samityInfoFromNormal.address,
              meetingDay: parseInt(samityInfoFromNormal.meetingDay),
              meetingType: samityInfoFromNormal.meetingType,
              ...(samityInfoFromNormal.meetingType == 'M' && {
                weekPosition: samityInfoFromNormal.weeklyType,
              }),
              // foCode: samityInfoFromNormal.foCode,
              workPlaceLat: '10.5455',
              workPlaceLong: '20.548',
              workAreaRadius: '50',
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
              ...(samityInfoFromNormal.admissionFee && {
                admissionFee: bangToEng(samityInfoFromNormal.admissionFee),
              }),
              samityMemberType: samityInfoFromNormal.radioValue,
            },
          },
        };
      }
      if (samityTypeValue == '2') {
        try {
          setLoadingDataSaveUpdate(true);

          samityData = await axios.put(
            samityRegUpdate + '/' + samityInfoFromNormal.samityName + '?value=' + samityTypeValue,
            payload,
            config,
          );
          NotificationManager.success(samityData.data.message, '', 5000);
          setSamityInfoFromNormal({
            projectName: 'নির্বাচন করুন',
            samityName: 'নির্বাচন করুন',
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
            samityTextValue: '',
          });
          setSamityType('');
          setAllSamityName([]);
          setSamityTypeValue('');
          setProject('নির্বাচন করুন');
          setLoadingDataSaveUpdate(false);
        } catch (error) {
          setLoadingDataSaveUpdate(false);
          if (error.response) {
            // let message = error.response.data.errors[0].message;
            NotificationManager.error(error.message, '', 5000);
          } else if (error.request) {
            NotificationManager.error('Error Connecting...', '', 5000);
          } else if (error) {
            NotificationManager.error(error.toString(), '', 5000);
          }
        }
      } else if (samityTypeValue == '1') {
        try {
          setLoadingDataSaveUpdate(true);

          samityData = await axios.post(sendApplySamityUpdate + '/loan', payload, config);
          NotificationManager.success(samityData.data.message, '', 5000);
          setSamityInfoFromNormal({
            projectName: 'নির্বাচন করুন',
            samityName: 'নির্বাচন করুন',
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
            samityTextValue: '',
          });
          setSamityType('');
          setAllSamityName([]);
          setSamityTypeValue('');
          setProject('নির্বাচন করুন');
          setLoadingDataSaveUpdate(false);
        } catch (error) {
          setLoadingDataSaveUpdate(false);

          errorHandler(error);
        }
      }
    } else {
      setLoadingDataSaveUpdate(false);
      NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুণ', '', 5000);
    }
  };
  console.log("Project---", project);
  return (
    <>
      <Grid item md={12} xs={12}>
        <Grid container spacing={2.5} className="section">
          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              disabled={disableProject}
              label={star('প্রকল্পের নাম')}
              name="projectName"
              // required
              select
              SelectProps={{ native: true }}
              value={project ? project : ' '}
              onChange={handleProject}
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
          </Grid>
          {samityTypeSelection ? (
            <>
              <Grid item md={3} xs={12}>
                <FormControl component="samityTypeSelection">
                  <RadioGroup
                    row
                    aria-label="samityTypeSelection"
                    name="samityTypeSelection"
                    value={samityType}
                    onChange={handleChangeOfSamityTypeSelect}
                  >
                    <FormControlLabel value="S" control={<Radio />} label="সমিতি" />
                    <FormControlLabel value="G" control={<Radio />} label="সংঘ" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <br />
              {!samityType && <span style={{ color: 'var(--color-error)' }}>{formErrors.samityType}</span>}
            </>
          ) : (
            ''
          )}
          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="samityTypeValue"
                name="samityTypeValue"
                required
                // checked={samityTypeValue}
                onChange={handleChange}
                // defaultChecked
                value={samityTypeValue}
              >
                <FormControlLabel value="1" control={<Radio />} label="বিদ্যমান" />
                <FormControlLabel value="2" control={<Radio />} label="নতুন" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
            <TextField
              fullWidth
              name="samityName"
              onChange={handleChange}
              label={star('সমিতি/সংঘের তালিকা')}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              value={samityInfoFromNormal.samityName ? samityInfoFromNormal.samityName : ' '}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {allsamityName &&
                allsamityName.map((option) => (
                  <option key={option.id} value={option.id}>
                    {samityTypeValue == 1
                      ? option.samityName
                      : samityTypeValue == 2
                        ? option?.data?.basic?.samityName
                        : undefined}
                  </option>
                ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('সমিতির নাম')}
              name="samityTextValue"
              type="text"
              disabled
              onChange={handleChange}
              value={samityInfoFromNormal.samityTextValue}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              // label="জেলা"
              label={star('জেলা')}
              name="districtId"
              id="district"
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
              {districtList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('উপজেলা')}
              name="upazilaId"
              id="upazila"
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
              {upazilaList.map((option) => (
                <option key={option.id} value={option.upaCityIdType}>
                  {option.upaCityNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('ইউনিয়ন')}
              name="unionId"
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
              //for BRDB feedback
              // disabled={disableUnion}
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
          </Grid>
        </Grid>
      </Grid>
      {samityInfoFromNormal.samityName && samityInfoFromNormal.samityName != 'নির্বাচন করুন' && (
        <Grid container spacing={2.5}>
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

          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.address ? (
            ''
          ) : (
            <Grid item md={8} xs={12}>
              <TextField
                fullWidth
                label="বিস্তারিত ঠিকানা"
                name="address"
                //for BRDB feedback
                // disabled={true}
                onChange={handleChange}
                bangToEng
                value={samityInfoFromNormal.address}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          )}
          <Grid item md={4} xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="radioValue"
                name="radioValue"
                required
                value={samityInfoFromNormal.radioValue}
                onChange={handleChange}
                label="radioValue"
              >
                <FormControlLabel value="MAL" control={<Radio />} label="পুরুষ" />
                <FormControlLabel value="FML" control={<Radio />} label="মহিলা" />
                <FormControlLabel value="OTH" control={<Radio />} label="উভয়" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মিটিং এর ধরন')}
              name="meetingType"
              disabled={true}
              onChange={handleChange}
              value={samityInfoFromNormal.meetingType ? samityInfoFromNormal.meetingType : ' '}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {meetingTypeArray.length >= 1 &&
                meetingTypeArray.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </TextField>
            {!samityInfoFromNormal.meetingType && (
              <span style={{ color: 'var(--color-error)' }}>{formErrors.meetingType}</span>
            )}
          </Grid>
          {samityInfoFromNormal.meetingType == 'M' && (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('বার এর অবস্থান')}
                name="weeklyType"
                disabled={true}
                onChange={handleChange}
                value={samityInfoFromNormal.weeklyType ? samityInfoFromNormal.weeklyType : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {weeklyTypeArray.length >= 1 &&
                  weeklyTypeArray.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </TextField>
              {!samityInfoFromNormal.meetingDay && (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.meetingDay}</span>
              )}
            </Grid>
          )}
          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.meetingDay ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('মিটিং এর দিন')}
                name="meetingDay"
                onChange={handleChange}
                disabled={true}
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
              {formErrors.meetingDay && <span style={{ color: 'var(--color-error)' }}>{formErrors.meetingDay}</span>}
            </Grid>
          )}
          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.memberMinAge ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সদস্যের সর্বনিম্ন বয়স')}
                name="memberMinAge"
                onChange={handleChange}
                id="bangToEng"
                value={samityInfoFromNormal.memberMinAge ? samityInfoFromNormal.memberMinAge : ''}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.memberMinAge ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.memberMinAge}</span>
              ) : samityInfoFromNormal.memberMinAge.length > 0 ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.memberMinAge}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.memberMaxAge ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সদস্যের সর্বোচ্চ বয়স ')}
                name="memberMaxAge"
                onChange={handleChange}
                id="bangToEng"
                value={samityInfoFromNormal.memberMaxAge ? samityInfoFromNormal.memberMaxAge : ''}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.memberMaxAge ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.memberMaxAge}</span>
              ) : samityInfoFromNormal.memberMaxAge.length > 0 ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.memberMaxAge}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.samityMinMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সমিতির সবনিম্ন সদস্য ')}
                name="samityMinMember"
                onChange={handleChange}
                value={samityInfoFromNormal.samityMinMember ? samityInfoFromNormal.samityMinMember : ''}
                variant="outlined"
                id="bangToEng"
                size="small"
                type="text"
              ></TextField>
              {!samityInfoFromNormal.samityMinMember ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.samityMinMember}</span>
              ) : samityInfoFromNormal.samityMinMember.length > 0 ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.samityMinMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.samityMaxMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সমিতির সর্বোচ্চ সদস্য ')}
                name="samityMaxMember"
                id="bangToEng"
                type="text"
                onChange={handleChange}
                value={samityInfoFromNormal.samityMaxMember ? samityInfoFromNormal.samityMaxMember : ''}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.samityMaxMember ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.samityMaxMember}</span>
              ) : samityInfoFromNormal.samityMaxMember.length > 0 ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.samityMaxMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}

          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.groupMinMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="দলের সর্বনিম্ন সদস্য "
                name="groupMinMember"
                onChange={handleChange}
                id="bangToEng"
                value={samityInfoFromNormal.groupMinMember ? samityInfoFromNormal.groupMinMember : ''}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.groupMinMember ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.groupMinMember}</span>
              ) : samityInfoFromNormal.groupMinMember.length > 0 ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.groupMinMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {permissionArray.length >= 1 && samityInfoFromNormal.projectName != '' && !permissionArray.groupMaxMember ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="দলের সর্বোচ্চ সদস্য "
                name="groupMaxMember"
                onChange={handleChange}
                id="bangToEng"
                value={samityInfoFromNormal.groupMaxMember ? samityInfoFromNormal.groupMaxMember : ''}
                variant="outlined"
                size="small"
              ></TextField>
              {!samityInfoFromNormal.groupMaxMember ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.groupMaxMember}</span>
              ) : samityInfoFromNormal.groupMaxMember.length > 0 ? (
                <span style={{ color: 'var(--color-error)' }}>{formErrors.groupMaxMember}</span>
              ) : (
                ''
              )}
            </Grid>
          )}
          {Object.keys(fieldHideShowObj).length >= 1 && fieldHideShowObj.samityTypeSelection && samityType == 'G' ? (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="হাই স্কুলের নাম"
                name="instituteName"
                onChange={handleChange}
                value={samityInfoFromNormal.instituteName}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          ) : (
            ''
          )}
          {Object.keys(fieldHideShowObj).length >= 1 && fieldHideShowObj.samityTypeSelection && samityType == 'G' ? (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="হাই স্কুলের কোড নং"
                name="instituteCode"
                onChange={handleChange}
                id=""
                value={samityInfoFromNormal.instituteCode}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          ) : (
            ''
          )}
          {Object.keys(fieldHideShowObj).length >= 1 && fieldHideShowObj.samityTypeSelection && samityType == 'G' ? (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="হাই স্কুলের নাম ঠিকানা"
                name="instituteAddress"
                onChange={handleChange}
                value={samityInfoFromNormal.instituteAddress}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          ) : (
            ''
          )}
          <Grid item md={4} xs={12}>
            <FormControl component="smeValue">
              <RadioGroup
                row
                aria-label="sme"
                name="smeValue"
                required
                // onChange={handleChangeForSme}
                label="smeValue"
                value={smeValue}
                disabled={true}
              >
                <FormLabel component="smeValue" style={{ padding: '6px 6px' }}>
                  সিস্টেম এর প্রয়োজনে?
                </FormLabel>
                <FormControlLabel value="T" control={<Radio />} label="হ্যাঁ" />
                <FormControlLabel value="F" control={<Radio />} label="না" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      )}

      {samityTypeValue == '1' && (
        <Grid container spacing={1} sx={{ marginTop: '8px' }}>
          <Grid item lg={6} md={6} xs={12}>
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="officeName"
              onChange={(event, value) => {
                if (value == null) {
                  setOfficeObj({
                    id: '',
                    label: '',
                  });
                } else {
                  value &&
                    setOfficeObj({
                      id: value.id,
                      label: value.label,
                    });
                  getDeskId(value.id);
                }
                // ("VVVVVV",value);
              }}
              options={officeNames.map((option) => {
                return {
                  id: option.id,
                  label: option.nameBn,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={officeObj.id === '' ? star('পর্যবেক্ষনকারীর কার্যালয়') : star('পর্যবেক্ষনকারীর কার্যালয়')}
                  variant="outlined"
                  size="small"
                />
              )}
              value={officeObj}
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <TextField
              fullWidth
              id="deskId"
              label={star('পর্যবেক্ষক/অনুমোদনকারীর নাম')}
              name="serviceId"
              onChange={handleDesk}
              select
              SelectProps={{ native: true }}
              value={selectedDesk ? selectedDesk : ' '}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {deskList
                ? deskList.map((option) => (
                  <option key={option.id} value={option.designationId}>
                    {option.nameBn} - {option.designation}
                  </option>
                ))
                : ''}
            </TextField>
            {(selectedDesk == 'নির্বাচন করুন' || !selectedDesk) && (
              <span style={{ color: 'red' }}>{formErrors.selectedDesk}</span>
            )}
          </Grid>
        </Grid>
      )}

      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            "হালনাগাদ করা হচ্ছে..."
          </LoadingButton>
        ) : (
          <>
            <Tooltip title="হালনাগাদ করুন">
              <Button
                variant="contained"
                className="btn btn-primary"
                onClick={onSubmitData}
                startIcon={<SaveOutlinedIcon />}
              >
                {' '}
                হালনাগাদ করুন
              </Button>
            </Tooltip>
            <Tooltip title="পরবর্তী পাতা">
              <Button
                variant="contained"
                className="btn btn-primary"
                onClick={onNextPage}
                startIcon={<SaveOutlinedIcon />}
              >
                {' '}
                পরবর্তী পাতা
              </Button>
            </Tooltip>
          </>


        )}
      </Grid>
    </>
  );
};

export default SamityRegFromNormal;
