/* eslint-disable no-misleading-character-class */
/* eslint-disable no-useless-escape */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2023-03-22 11:03:57
 * @desc [description]
 */
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { formValidator } from 'service/formValidator';
import { inputField, inputRadioGroup, inputSelect } from 'service/fromInput';
import { bangToEng, engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import { steperFun } from 'service/steper';
import {
  WorkingAreaInsert,
  allMemberInfo,
  dynamicImage,
  geoData,
  isRequiredMemberPass,
  masterData,
} from '../../../../../url/coop/ApiList';

const emailRegex = RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
//Style Object defined for Image Tag

const MemberRegistration = () => {
  const router = useRouter();
  ///////////////////////////////////////*** page validation & localstorage data ***//////////////////////////////
  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    const samityLevel = JSON.parse(localStorage.getItem('samityLevel'))
      ? JSON.parse(localStorage.getItem('samityLevel'))
      : null;
    if (getId == null) {
      router.push({ pathname: '/coop/registration' });
    }
    if (samityLevel == null) {
      router.push({ pathname: '/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/registration' });
    }
  };
  const config = localStorageData('config');
  const getId = localStorageData('getSamityId');
  ////////////////////////////////////////*** page validation & localstorage End***///////////////////////////////
  const [isAddMember, setIsAddMember] = useState(false);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [showAllMember, setShowAllMember] = useState([]);
  const [update, setUpdate] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [memberPreId, setMemberPreId] = useState('');
  const [memberPerId, setMemberPerId] = useState('');
  const [jobType, setJobType] = useState([]);
  const [religion, setReligion] = useState([]);
  const [educationValue, setEducationValue] = useState([]);
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [genderType, setGenderType] = useState([]);
  const [value, setValue] = useState(null);
  const [memberInfo, setMemberInfo] = useState({
    nid: '',
    brn: '',
    memberName: '',
    memberNameBangla: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    occupationId: '',
    mobile: '',
    memberAdmissionDate: null,
    email: '',
    genderId: '',
    educationLevelId: '',
    religionId: '',
    maritalStatusId: '',
    maritalStatusType: '',
    villageArea: '',
    pvillageArea: '',
  });
  const [formErrors] = useState({
    nid: '',
    brn: '',
    memberName: '',
    fatherName: '',
    email: '',
    mobile: '',
    memberAdmissionDate: '',
    memberNameBangla: '',
    religionId: '',
  });
  //State for handling file upload

  // ************************** District division data query *******************************************
  const [resultOfDistrict, setResultOfDistrict] = useState([]);
  const [resultOfUpazila, setResultOfUpazila] = useState([]);
  const [resultOfUnion, setResultOfUnion] = useState([]);
  const [presultOfDistrict, setPresultOfDistrict] = useState([]);
  const [presultOfUpazila, setPresultOfUpazila] = useState([]);
  const [presultOfUnion, setPresultOfUnion] = useState([]);
  const [checked, setChecked] = useState(false);
  //**************************************  present address *********************************************
  const [districtId, setDistrictId] = useState('');
  const [upazilaDetails, setUpazilaDetails] = useState('');
  const [upazilaId, setUpazilaId] = useState('');
  const [upazilaType, setUpazilaType] = useState('');
  const [unionDetails, setUnionDetails] = useState('');
  const [unionId, setUnionId] = useState('');
  const [unionType, setUnionType] = useState('');
  //*************************************** permanent address *********************************************
  const [pdistrictId, setPdistrictId] = useState('');
  const [pupazilaDetails, setPUpazilaDetails] = useState('');
  const [pupazilaId, setPUpazilaId] = useState('');
  const [pupazilaType, setPUpazilaType] = useState('');
  const [punionDetails, setPUnionDetails] = useState('');
  const [punionId, setPUnionId] = useState('');
  const [punionType, setPUnionType] = useState('');
  // ************************************** working unique data setup **************************
  const [wUpaCityId, setWUpaCityId] = useState([]);
  const [wUninonIdType, setWUninonIdType] = useState([]);
  // **************************************************************
  const [selectionNidBrn, setSelectionNidBrn] = useState(1);
  const [dynamicImageData, setDynamicImageData] = useState([]);

  useEffect(() => {
    checkPageValidation();
    allMemberShow();
    allJobTypeShow();
    getMasterData();
    getWorkingArea();
    getImageFormet();
  }, []);

  // **************************************** job type part  ***********************************************
  let allJobTypeShow = async () => {
    try {
      let jotypeResp = await axios.get(masterData + 'occupation?isPagination=false', config);
      let data = jotypeResp.data.data;
      setJobType(data);
      let religionData = await axios.get(masterData + 'religion?isPagination=false', config);
      let Rdata = religionData.data.data;
      setReligion(Rdata);

      const gender = await axios.get(masterData + 'gender?isPagination=false', config);
      setGenderType(gender.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  // **************************************** Education Level part ***************************************
  const getMasterData = async () => {
    try {
      const education = await axios.get(masterData + 'education-level?isPagination=false', config);
      setEducationValue(education.data.data);
      const MaritialStatus = await axios.get(masterData + 'marital-status?isPagination=false', config);
      setMaritalStatus(MaritialStatus.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  // **************************************** All Member Part *********************************************
  const allMemberShow = async () => {
    try {
      const showmMemeber = await axios.get(allMemberInfo + '/' + getId, config);
      const data = showmMemeber.data.data;
      setShowAllMember(data);
    } catch (error) {
      // setLoadData(false);
      // errorHandler(error);
    }
  };

  const addNewMember = () => {
    setIsAddMember(true);
  };

  const clearFrom = () => {
    setMemberPerId('');
    setMemberPreId('');
    setMemberId('');
    setLoadingDataSaveUpdate(false);
    setMemberInfo({
      nid: '',
      brn: '',
      memberName: '',
      memberNameBangla: '',
      fatherName: '',
      motherName: '',
      spouseName: '',
      occupationId: '',
      mobile: '',
      memberAdmissionDate: null,
      email: '',
      genderId: '',
      educationLevelId: '',
      maritalStatusId: '',
    });
    setSelectionNidBrn(1);
    getImageFormet();
    // setPicimage({
    //   picimage: "",
    //   mimetypepic: "",
    // });
    // setSignimage({
    //   signimage: "",
    //   mimetypesign: "",
    // });
    // setLetterimage({
    //   letterimage: "",
    //   mimetypeletter: "",
    // });
    // setPicNameUrl("");
    // setSignNameUrl("");
    // setLetterNameUrl("");
    // setPicName("");
    // setSignName("");
    // setLetterName("");
    setUpdate(false);
    setValue(null);
  };
  const closeFrom = () => {
    setMemberPerId('');
    setMemberPreId('');
    setMemberId('');
    setIsAddMember(false);
    setLoadingDataSaveUpdate(false);
    setMemberInfo({
      nid: '',
      brn: '',
      memberName: '',
      memberNameBangla: '',
      fatherName: '',
      motherName: '',
      spouseName: '',
      occupationId: '',
      mobile: '',
      memberAdmissionDate: null,
      email: '',
      genderId: '',
      educationLevelId: '',
      maritalStatusId: '',
    });
    setSelectionNidBrn(1);
    getImageFormet();
    // setPicimage({
    //   picimage: "",
    //   mimetypepic: "",
    // });
    // setSignimage({
    //   signimage: "",
    //   mimetypesign: "",
    // });
    // setLetterimage({
    //   letterimage: "",
    //   mimetypeletter: "",
    // });
    // setPicNameUrl("");
    // setSignNameUrl("");
    // setLetterNameUrl("");
    // setPicName("");
    // setSignName("");
    // setLetterName("");
    setUpdate(false);
    setValue(null);
  };

  // **************************************** From Error Part **********************************************
  let checkFormError = () => {
    let flag = false;
    for (const key in formErrors) {
      if (formErrors[key].length > 0) {
        flag = true;
      }
    }
    return flag;
  };
  let checkMandatory = () => {
    let obj = {
      nid: memberInfo.nid || memberInfo.brn,
      memberName: memberInfo.memberName,
      memberNameBangla: memberInfo.memberNameBangla,
      fatherName: memberInfo.fatherName,
      motherName: memberInfo.motherName,
      mobile: memberInfo.mobile,
      memberAdmissionDate: memberInfo.memberAdmissionDate == null ? '' : memberInfo.memberAdmissionDate,
      occupationId: memberInfo.occupationId == '0' ? '' : memberInfo.occupationId,
      genderId: memberInfo.genderId == '0' ? '' : memberInfo.genderId,
      maritalStatusId: memberInfo.maritalStatusId == '0' ? '' : memberInfo.maritalStatusId,
      educationLevelId: memberInfo.educationLevelId == '0' ? '' : memberInfo.educationLevelId,
      religionId: memberInfo.religionId == '0' ? '' : memberInfo.religionId,
      dob: dobErrorMessage ? '' : value,
    };
    const data = Object.keys(obj).some((e) => {
      return !obj[e];
    });
    return data;
  };
  // **************************************** All Handle Change part ***************************************
  const handleChangeNidBrn = (e) => {
    setSelectionNidBrn(e.target.value);
    setMemberInfo({
      ...memberInfo,
      nid: '',
      brn: '',
    });
  };
  // ******************************************* Dynamic Image *********************************************
  const getImageFormet = async () => {
    try {
      const imageData = await axios.get(dynamicImage + getId, config);
      const data = imageData.data.data;
      for (const [index] of data.entries()) {
        data[index].name = '';
        data[index].mimeType = '';
        data[index].base64Image = '';
      }
      setDynamicImageData(data);
    } catch (error) {
      errorHandler(error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////
  const changeMemDate = (memberAdmissionDate) => {
    setMemberInfo({ ...memberInfo, memberAdmissionDate });
  };
  let handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj, memberDataNid, nidData, memberDataBrn, brnData, data;
    switch (name) {
      case 'memberNameBangla':
        setMemberInfo({
          ...memberInfo,
          [e.target.name]: value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
            '',
          ),
        });
        formErrors.memberNameBangla =
          value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
            '',
          ) == null
            ? 'বাংলায় নাম লিখুন'
            : '';
        break;
      case 'email':
        formErrors.email = emailRegex.test(value) || value.length == 0 ? '' : 'আপনার সঠিক ইমেইল প্রদান করুন';
        setMemberInfo({
          ...memberInfo,
          [e.target.name]: value,
        });
        break;
      case 'mobile':
        resultObj = formValidator('mobile', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        formErrors.mobile = resultObj?.error;
        break;
      case 'nid':
        memberDataNid = formValidator('nid', value);
        if (memberDataNid?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: bangToEng(value) > 0 ? memberDataNid?.value : '',
        });
        formErrors.nid = memberDataNid?.error;
        nidData = showAllMember.find((e) => e.memberBasicInfo.nid === bangToEng(value));
        if (nidData && nidData.memberBasicInfo.id != memberId) {
          formErrors.nid =
            'এই জাতীয় পরিচয়পত্র নম্বরটি ' + '"' + nidData.memberBasicInfo.memberNameBangla + '"' + ' ব্যবহার করেছে';
        }
        break;
      case 'brn':
        memberDataBrn;
        memberDataBrn = formValidator('brn', value);
        if (memberDataBrn?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: bangToEng(value) > 0 ? memberDataBrn?.value : '',
        });
        formErrors.brn = memberDataBrn?.error;
        brnData = showAllMember.find((e) => e.memberBasicInfo.brn === bangToEng(value));
        if (brnData && brnData.memberBasicInfo.id != memberId) {
          formErrors.brn =
            'এই জন্ম নিবন্ধন নম্বরটি ' + '"' + brnData.memberBasicInfo.memberNameBangla + '"' + ' ব্যবহার করেছে';
        }
        break;
      case 'memberName':
        setMemberInfo({
          ...memberInfo,
          [e.target.name]: value.replace(/[^A-Z\s.-]/gi, '').toUpperCase(),
        });
        break;
      case 'fatherName':
        setMemberInfo({
          ...memberInfo,
          [name]: value.replace(
            /[^A-Za-z\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s.-]/gi,
            '',
          ),
        });
        break;
      case 'motherName':
        setMemberInfo({
          ...memberInfo,
          [name]: value.replace(
            /[^A-Za-z\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s.-]/gi,
            '',
          ),
        });
        break;
      case 'maritalStatusId':
        data = maritalStatus.find((row) => row.id == value);
        if (data.returnValue != 'MAR' || value == '0') {
          setMemberInfo({
            ...memberInfo,
            ['spouseName']: '',
            ['maritalStatusType']: '',
            [name]: value == '0' ? '' : value,
          });
        } else {
          setMemberInfo({
            ...memberInfo,
            [name]: value == '0' ? '' : value,
            ['maritalStatusType']: data.returnValue,
          });
        }
        break;
      default:
        setMemberInfo({
          ...memberInfo,
          [e.target.name]: e.target.value,
        });
    }
  };
  // **************************************** Date of birt **************************************************
  const [dobErrorMessage, setDobErrorMessage] = useState('');
  const changeDob = (dob) => {
    setValue(dob);
    GetAge(dob);
  };

  let GetAge = (birthDate) => {
    if (birthDate) {
      var today = new Date();
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setDobErrorMessage(age >= 18 && age <= 65 ? '' : 'বয়স ১৮-৬৫ এর মধ্যে হতে হবে');
    } else {
      setDobErrorMessage('বয়স নির্বাচন করুন');
    }
  };

  // ****************************************address section **************************************************
  // get working area

  const getWorkingArea = async () => {
    const workingArea = await axios.get(WorkingAreaInsert + '/' + getId, config);
    const workingAreaData = workingArea.data.data;
    const WDistrictId = _.uniqBy(workingAreaData, 'districtId').map((m) => {
      return { districtId: m.districtId };
    });
    getDistrict(WDistrictId);
    pgetDistrict(WDistrictId);
    const wUpaCityData = _.uniqBy(workingAreaData, 'upaCityId', 'upaCityType').map((m) => {
      return { upaCityId: m.upaCityId, upaCityType: m.upaCityType };
    });
    setWUpaCityId(wUpaCityData);
    const wUnionData = _.uniqBy(workingAreaData, 'uniThanaPawId', 'uniThanaPawType').map((m) => {
      return {
        uniThanaPawId: m.uniThanaPawId,
        uniThanaPawType: m.uniThanaPawType,
      };
    });
    setWUninonIdType(wUnionData);
  };

  ///////////////////////////////////////////////   present address /////////////////////////////////////
  const changeDistrict = (e) => {
    if (e.target.value != 0) {
      setDistrictId(e.target.value);
      getUpazila(e.target.value);
    } else {
      setDistrictId('');
      setResultOfUpazila([]);
    }
  };

  const changeUpazila = (e) => {
    if (e.target.value != 0) {
      const data = JSON.parse(e.target.value);
      setUpazilaDetails(e.target.value);
      setUpazilaId(data.upaCityId);
      setUpazilaType(data.upaCityType);
      getUnion(districtId, data.upaCityId, data.upaCityType);
    } else {
      setUpazilaId('');
      setUpazilaType('');
      setUpazilaDetails('');
      setResultOfUnion([]);
    }
  };

  const changeUnion = (e) => {
    if (e.target.value != 0) {
      const data = JSON.parse(e.target.value);
      setUnionDetails(e.target.value);
      setUnionId(data.uniThanaPawId);
      setUnionType(data.uniThanaPawType);
    } else {
      setUnionDetails('');
      setUnionId('');
      setUnionType('');
    }
  };

  const getDistrict = async (disData) => {
    try {
      let districtData = await axios.get(geoData + 'district', config);
      const getAllDistrict = districtData.data.data;
      if (disData) {
        const result = getAllDistrict.filter((element) => {
          return disData.some((e) => {
            return e.districtId === element.id;
          });
        });
        if (result?.length === 1) {
          setDistrictId(result[0]?.id);
          getUpazila(result[0]?.id);
        }
        setResultOfDistrict(result);
      } else {
        setResultOfDistrict(getAllDistrict);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getUpazila = async (districtData) => {
    try {
      const upazilaData = await axios.get(geoData + `upa-city&districtId=${districtData}`, config);
      const getUpdaData = upazilaData.data.data;

      if (wUpaCityId[0]?.upaCityId != null) {
        const result = getUpdaData.filter((element) => {
          return wUpaCityId.some((e) => {
            return e.upaCityId === element.upaCityId && e.upaCityType === element.upaCityType;
          });
        });
        setResultOfUpazila(result);
        if (result.length === 1) {
          setUpazilaDetails(
            JSON.stringify({
              upaCityId: result[0].upaCityId,
              upaCityType: result[0].upaCityType,
            }),
          );
          setUpazilaId(result[0].upaCityId);
          setUpazilaType(result[0].upaCityType);
          getUnion(result[0].districtId, result[0].upaCityId, result[0].upaCityType);
        }
      } else {
        setResultOfUpazila(getUpdaData);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getUnion = async (districtIddata, upaCityId, upaCityType) => {
    try {
      const unionData = await axios.get(
        geoData + `uni-thana-paurasabha&districtId=${districtIddata}&upaCityId=${upaCityId}&upaCityType=${upaCityType}`,
        config,
      );

      const unionDataGet = unionData.data.data;
      if (wUninonIdType[0]?.uniThanaPawId != null) {
        const result = unionDataGet.filter((element) => {
          return wUninonIdType.some((e) => {
            return e.uniThanaPawId === element.uniThanaPawId && e.uniThanaPawType === element.uniThanaPawType;
          });
        });
        setResultOfUnion(result);
        if (result.length === 1) {
          setUnionDetails(
            JSON.stringify({
              uniThanaPawId: result[0].uniThanaPawId,
              uniThanaPawType: result[0].uniThanaPawType,
            }),
          );
          setUnionId(result[0].uniThanaPawId);
          setUnionType(result[0].uniThanaPawType);
        }
      } else {
        setResultOfUnion(unionDataGet);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleChecked = (event) => {
    if (event.target.checked == true) {
      setChecked(event.target.checked);
    } else {
      setChecked(event.target.checked);
      setPdistrictId(0);
      setPUpazilaDetails(0);
      setPUnionDetails(0);
      setMemberInfo({
        ...memberInfo,
        pvillageArea: '',
      });
    }
  };
  ////////////////////////////////////////////// parmanent Address /////////////////////////////////////////
  const pchangeDistrict = (e) => {
    if (e.target.value != 0) {
      setPdistrictId(e.target.value);
      pgetUpazila(e.target.value);
    } else {
      setPdistrictId('');
      setPresultOfUpazila([]);
    }
  };

  const pchangeUpazila = (e) => {
    if (e.target.value != 0) {
      const data = JSON.parse(e.target.value);
      setPUpazilaDetails(e.target.value);
      setPUpazilaId(data.upaCityId);
      setPUpazilaType(data.upaCityType);
      pgetUnion(pdistrictId, data.upaCityId, data.upaCityType);
    } else {
      setPUpazilaDetails('');
      setPUpazilaId('');
      setPUpazilaType('');
      setPresultOfUnion([]);
    }
  };

  const pchangeUnion = (e) => {
    const data = JSON.parse(e.target.value);
    setPUnionDetails(e.target.value);
    setPUnionId(data.uniThanaPawId);
    setPUnionType(data.uniThanaPawType);
  };

  const pgetDistrict = async (disData) => {
    try {
      let districtData = await axios.get(geoData + 'district', config);
      const getAllDistrict = districtData.data.data;
      if (disData) {
        const result = getAllDistrict.filter((element) => {
          return disData.some((e) => {
            return e.districtId === element.id;
          });
        });
        setPresultOfDistrict(result);
      } else {
        setPresultOfDistrict(getAllDistrict);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const pgetUpazila = async (districtData) => {
    try {
      const upazilaData = await axios.get(geoData + `upa-city&districtId=${districtData}`, config);
      const getUpdaData = upazilaData.data.data;
      if (wUpaCityId[0].upaCityId != null) {
        const result = getUpdaData.filter((element) => {
          return wUpaCityId.some((e) => {
            return e.upaCityId === element.upaCityId && e.upaCityType === element.upaCityType;
          });
        });
        setPresultOfUpazila(result);
      } else {
        setPresultOfUpazila(getUpdaData);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const pgetUnion = async (pdistrictIdDtata, upaCityId, upaCityType) => {
    try {
      const punionData = await axios.get(
        geoData +
        `uni-thana-paurasabha&districtId=${pdistrictIdDtata}&upaCityId=${upaCityId}&upaCityType=${upaCityType}`,
        config,
      );

      const unionDataGet = punionData.data.data;
      if (wUninonIdType[0]?.uniThanaPawId != null) {
        const result = unionDataGet.filter((element) => {
          return wUninonIdType.some((e) => {
            return e.uniThanaPawId === element.uniThanaPawId && e.uniThanaPawType === element.uniThanaPawType;
          });
        });
        setPresultOfUnion(result);
      } else {
        setPresultOfUnion(unionDataGet);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  //  ************************************************* Address Sction End ***************************************
  //  ************************************************** Image Part Start  ***************************************
  let handleChangeDynamicImage = (e, type, i) => {
    let imageData = [...dynamicImageData];
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      if (
        file.name.includes('.jpg') ||
        file.name.includes('.png') ||
        file.name.includes('.JPEG') ||
        file.name.includes('.pdf')
      ) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        if (imageData[i].docType == 'IMG' || imageData[i].docType == 'SIG') {
          if (file.name.includes('.pdf')) {
            NotificationManager.warning(
              imageData[i].docTypeDesc + ' jpg, png, jpeg এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ',
            );
          } else {
            reader.onload = () => {
              let base64Image = btoa(reader.result);
              imageData[i]['name'] = file.name;
              imageData[i]['mimeType'] = file.type;
              imageData[i]['base64Image'] = base64Image;
              setDynamicImageData(imageData);
            };
          }
        } else {
          reader.onload = () => {
            let base64Image = btoa(reader.result);
            imageData[i]['name'] = file.name;
            imageData[i]['mimeType'] = file.type;
            imageData[i]['base64Image'] = base64Image;
            imageData[i]['imageError'] = '';
            setDynamicImageData(imageData);
          };
        }
      } else {
        NotificationManager.warning('jpg, png, jpeg, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ');
      }
    }
  };

  //************************************************ Method for removing image ***************************

  const removeSelectedDynamicImage = (e, i) => {
    const imageData = [...dynamicImageData];
    imageData[i]['name'] = '';
    imageData[i]['mimeType'] = '';
    imageData[i]['base64Image'] = '';
    imageData[i]['fileNameUrl'] = '';
    imageData[i]['imageError'] = imageData[i].isMandatory == 'Y' ? imageData[i].docTypeDesc + ' প্রদান করুন' : '';
    setDynamicImageData(imageData);
  };
  // ***************************************************** imgae part end *************************************
  // ***************************************************** data submit part start *****************************
  let onSubmitData = async (e) => {
    let memberRegistrationData, permanentAddress;
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    if (checkMandatory()) {
      const message = 'বাধ্যতামূলক তথ্য পূরণ করুন';
      NotificationManager.warning(message, '', 5000);
      setLoadingDataSaveUpdate(false);
    } else {
      let presentAddress = {
        addressType: 'PRE',
        ...(update && { samityId: getId }),
        ...(memberId != '' && { memberId: memberId }),
        ...(memberPreId != '' && { id: memberPreId }),
        districtId: districtId != '' ? parseInt(districtId) : '',
        upaCityId: upazilaId != '' ? parseInt(upazilaId) : '',
        upaCityType: upazilaType != '' ? upazilaType : '',
        uniThanaPawId: unionId != '' ? parseInt(unionId) : '',
        uniThanaPawType: unionType != '' ? unionType : '',
        detailsAddress: memberInfo.villageArea,
      };
      if (checked) {
        permanentAddress = {
          ...(update && { samityId: getId }),
          ...(memberId != '' && { memberId: memberId }),
          ...(memberPerId != '' && { id: memberPerId }),
          addressType: 'PER',
          districtId: districtId != '' ? parseInt(districtId) : '',
          upaCityId: upazilaId != '' ? parseInt(upazilaId) : '',
          upaCityType: upazilaType != '' ? upazilaType : '',
          uniThanaPawId: unionId != '' ? parseInt(unionId) : '',
          uniThanaPawType: unionType != '' ? unionType : '',
          detailsAddress: memberInfo.villageArea,
        };
      } else {
        permanentAddress = {
          ...(update && { samityId: getId }),
          ...(memberId != '' && { memberId: memberId }),
          ...(memberPerId != '' && { id: memberPerId }),
          addressType: 'PER',
          districtId: pdistrictId != '' ? parseInt(pdistrictId) : '',
          upaCityId: pupazilaId != '' ? parseInt(pupazilaId) : '',
          upaCityType: pupazilaType != '' ? pupazilaType : '',
          uniThanaPawId: punionId != '' ? parseInt(punionId) : '',
          uniThanaPawType: punionType != '' ? punionType : '',
          detailsAddress: memberInfo.pvillageArea,
        };
      }
      if (memberId) {
        dynamicImageData.forEach((a) => {
          delete a.fileNameUrl;
          if (!a.base64Image) {
            delete a.name;
            delete a.mimeType;
            delete a.base64Image;
          }
          if (a.base64Image) {
            delete a.fileName;
          }
        });
      }

      const payload = {
        samityId: getId,
        ...(selectionNidBrn == 1 && { nid: bangToEng(memberInfo.nid) }),
        ...(selectionNidBrn == 2 && { brn: bangToEng(memberInfo.brn) }),
        dob: value ? dateFormat(value) : null,
        memberName: memberInfo.memberName,
        memberNameBangla: memberInfo.memberNameBangla,
        fatherName: memberInfo.fatherName,
        motherName: memberInfo.motherName,
        spouseName: memberInfo.spouseName ? memberInfo.spouseName : null,
        genderId: memberInfo.genderId,
        educationLevelId: memberInfo.educationLevelId,
        occupationId: memberInfo.occupationId,
        religionId: parseInt(memberInfo.religionId),
        maritalStatusId: memberInfo.maritalStatusId,
        mobile: bangToEng(memberInfo.mobile),
        email: memberInfo.email,
        memberAdmissionDate: dateFormat(memberInfo.memberAdmissionDate),
        documents: dynamicImageData.filter((e) => e.base64Image != ''),
        permanentAddress,
        presentAddress,
      };
      try {
        if (memberId) {
          memberRegistrationData = await axios.put(allMemberInfo + '/' + memberId, payload, config);
          setMemberPerId('');
          setMemberPreId('');
          setMemberId('');
        } else {
          memberRegistrationData = await axios.post(allMemberInfo, payload, config);
        }
        setIsAddMember(false);
        setLoadingDataSaveUpdate(false);
        setMemberInfo({
          nid: '',
          brn: '',
          memberName: '',
          memberNameBangla: '',
          fatherName: '',
          motherName: '',
          spouseName: '',
          occupationId: '',
          mobile: '',
          memberAdmissionDate: null,
          email: '',
          genderId: '',
          educationLevelId: '',
          maritalStatusId: '',
          religionId: '',
        });
        setSelectionNidBrn(1);
        setDynamicImageData([]);
        getImageFormet();
        setUpdate(false);
        setValue(null);
        NotificationManager.success(memberRegistrationData.data.message, '', 5000);
        allMemberShow();
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    }
  };

  // ***************************************************** data submit part End *******************************
  // *****************************************************  Edit section  *************************************
  let onEdit = (
    nid,
    brn,
    dob,
    memberName,
    memberNameBangla,
    fatherName,
    motherName,
    spouseName,
    occupationId,
    mobile,
    memberAdmissionDate,
    email,
    gender,
    presentAddress,
    permanentAddress,
    id,
    educationLevelId,
    maritalStatusId,
    religionId,
    documents,
  ) => {
    // image set start
    if (documents) {
      for (const [index] of documents.entries()) {
        documents[index].name = '';
        documents[index].mimeType = '';
        documents[index].base64Image = '';
      }
      setDynamicImageData(documents);
    } else {
      getImageFormet();
    }
    const marStatus = maritalStatus.find((row) => row.id == maritalStatusId);
    // image set end
    setIsAddMember(true);
    setMemberInfo({
      email: email,
      fatherName,
      memberName,
      memberNameBangla,
      nid: nid ? engToBang(nid) : '',
      brn: brn ? engToBang(brn) : '',
      motherName,
      spouseName,
      mobile: engToBang(mobile),
      memberAdmissionDate,
      occupationId,
      genderId: gender,
      educationLevelId,
      maritalStatusId,
      maritalStatusType: marStatus.returnValue,
      religionId,
      villageArea: presentAddress.detailsAddress,
      pvillageArea: permanentAddress.detailsAddress,
    });
    if (nid) {
      setSelectionNidBrn(1);
    }
    if (brn) {
      setSelectionNidBrn(2);
    }
    setUpdate(true);
    setValue(dob);
    setDistrictId(presentAddress.districtId);
    setUpazilaId(presentAddress.upaCityId);
    setUpazilaType(presentAddress.upaCityType);
    let setUpa = JSON.stringify({
      upaCityId: presentAddress.upaCityId,
      upaCityType: presentAddress.upaCityType,
    });
    getUpazila(presentAddress.districtId);
    setUpazilaDetails(setUpa);
    setUnionId(presentAddress.uniThanaPawId);
    setUnionType(presentAddress.uniThanaPawType);
    let unionEditData = JSON.stringify({
      uniThanaPawId: presentAddress.uniThanaPawId,
      uniThanaPawType: presentAddress.uniThanaPawType,
    });
    getUnion(presentAddress.districtId, presentAddress.upaCityId, presentAddress.upaCityType);
    setUnionDetails(unionEditData);
    // parmanent address  section
    setPdistrictId(permanentAddress.districtId);
    setPUpazilaId(permanentAddress.upaCityId);
    setPUpazilaType(permanentAddress.upaCityType);
    let setUnionThana = JSON.stringify({
      upaCityId: permanentAddress.upaCityId,
      upaCityType: permanentAddress.upaCityType,
    });
    pgetUpazila(permanentAddress.districtId);
    setPUpazilaDetails(setUnionThana);
    setPUnionId(permanentAddress.uniThanaPawId);
    setPUnionType(permanentAddress.uniThanaPawType);
    let unionpEditData = JSON.stringify({
      uniThanaPawId: permanentAddress.uniThanaPawId,
      uniThanaPawType: permanentAddress.uniThanaPawType,
    });
    pgetUnion(permanentAddress.districtId, permanentAddress.upaCityId, permanentAddress.upaCityType);
    setPUnionDetails(unionpEditData);
    setMemberPreId(presentAddress.id);
    setMemberPerId(permanentAddress.id);
    setMemberId(id);

    let compare = (permanentAddress, presentAddress) => {
      if (
        permanentAddress.districtId == presentAddress.districtId &&
        permanentAddress.upaCityId == presentAddress.upaCityId &&
        permanentAddress.uniThanaPawId == presentAddress.uniThanaPawId &&
        permanentAddress.detailsAddress == presentAddress.detailsAddress
      ) {
        return true;
      }
    };
    let functionCallValue = compare(permanentAddress, presentAddress);
    if (functionCallValue) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };
  // ***************************************************** Edit section part End *****************************
  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/add-by-laws' });
  };
  let onNextPage = async () => {
    try {
      const tryNextPage = await axios.get(isRequiredMemberPass + getId, config);
      if (tryNextPage.data.data.isPass == true) {
        steperFun(2);
        router.push({ pathname: '/coop/samity-management/coop/designation' });
      } else {
        const expectedMember = numberToWord('' + tryNextPage.data.data.expectedMember + '');
        const memberCount = numberToWord(tryNextPage.data.data.memberCount);
        NotificationManager.warning(
          'আপনি ' + memberCount + ' মেম্বার যোগ করেছেন, কম পক্ষে আপনাকে ' + expectedMember + ' মেম্বার যোগ করতে হবে',
          '',
          5000,
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <Fragment>
      {isAddMember ? (
        <Grid>
          <Grid container className="section">
            <Grid item xs={12} id="editMember">
              <Grid container spacing={2.5}>
                {inputRadioGroup(
                  'NidOrBrn',
                  handleChangeNidBrn,
                  selectionNidBrn,
                  [
                    {
                      value: '1',
                      color: '#007bff',
                      rcolor: 'primary',
                      label: 'জাতীয় পরিচয়পত্র',
                    },
                    {
                      value: '2',
                      color: '#ed6c02',
                      rColor: 'warning',
                      label: 'জন্ম নিবন্ধন',
                    },
                  ],
                  4,
                  4,
                  4,
                  12,
                  false,
                  1,
                )}
                {selectionNidBrn == 1 &&
                  inputField(
                    RequiredFile('জাতীয় পরিচয়পত্র'),
                    'nid',
                    'text',
                    handleChange,
                    memberInfo.nid,
                    'small',
                    4,
                    4,
                    4,
                    12,
                    formErrors.nid.length > 0 && <span style={{ color: 'red' }}>{formErrors.nid}</span>,
                    '',
                  )}
                {selectionNidBrn == 2 &&
                  inputField(
                    RequiredFile('জন্ম নিবন্ধন'),
                    'brn',
                    'text',
                    handleChange,
                    memberInfo.brn,
                    'small',
                    4,
                    4,
                    4,
                    12,
                    formErrors.brn.length > 0 && <span style={{ color: 'red' }}>{formErrors.brn}</span>,
                    '',
                  )}
                <FromControlJSON
                  arr={[
                    {
                      labelName: RequiredFile('জন্ম তারিখ'),
                      onChange: changeDob,
                      value,
                      size: 'small',
                      type: 'date',
                      viewType: 'date',
                      dateFormet: 'dd/MM/yyyy',
                      disableFuture: true,
                      xl: 4,
                      lg: 4,
                      md: 4,
                      xs: 12,
                      isDisabled: false,
                      customClass: '',
                      errorMessage: dobErrorMessage,
                      customStyle: {},
                    },
                  ]}
                />
                {inputField(
                  RequiredFile('সদস্যের নাম ইংরেজিতে ( বড় হাতের )'),
                  'memberName',
                  'text',
                  handleChange,
                  memberInfo.memberName,
                  'small',
                  4,
                  4,
                  4,
                  12,
                )}
                {inputField(
                  RequiredFile('সদস্যের নাম বাংলায়'),
                  'memberNameBangla',
                  'text',
                  handleChange,
                  memberInfo.memberNameBangla,
                  'small',
                  4,
                  4,
                  4,
                  12,
                  formErrors.memberNameBangla.length > 0 && (
                    <span style={{ color: 'red' }}>{formErrors.memberNameBangla}</span>
                  ),
                )}
                {inputField(
                  RequiredFile('পিতার নাম'),
                  'fatherName',
                  'text',
                  handleChange,
                  memberInfo.fatherName,
                  'small',
                  4,
                  4,
                  4,
                  12,
                )}
                {inputField(
                  RequiredFile('মাতার নাম'),
                  'motherName',
                  'text',
                  handleChange,
                  memberInfo.motherName,
                  'small',
                  4,
                  4,
                  4,
                  12,
                )}
                {inputField(
                  RequiredFile('মোবাইল নং'),
                  'mobile',
                  'text',
                  handleChange,
                  memberInfo.mobile,
                  'small',
                  4,
                  4,
                  4,
                  12,
                  formErrors.mobile.length > 0 && <span style={{ color: 'red' }}>{formErrors.mobile}</span>,
                )}
                <FromControlJSON
                  arr={[
                    {
                      labelName: RequiredFile('সদস্য ভর্তির তারিখ'),
                      onChange: changeMemDate,
                      value: memberInfo.memberAdmissionDate,
                      size: 'small',
                      type: 'date',
                      viewType: 'date',
                      dateFormet: 'dd/MM/yyyy',
                      disableFuture: true,
                      xl: 4,
                      lg: 4,
                      md: 4,
                      xs: 12,
                      isDisabled: false,
                      customClass: '',
                      customStyle: {},
                    },
                  ]}
                />
                {inputRadioGroup(
                  'genderId',
                  handleChange,
                  memberInfo.genderId,
                  genderType.map((g, index) => {
                    return {
                      value: g.id,
                      color: ['#007bff', '#ed6c02', '#28a745'][index],
                      rcolor: ['primary', 'warning', 'success'][index],
                      label: g.displayValue,
                    };
                  }),
                  4,
                  4,
                  4,
                  12,
                )}
                {inputField(
                  'ইমেইল',
                  'email',
                  'text',
                  handleChange,
                  memberInfo.email,
                  'small',
                  4,
                  4,
                  4,
                  12,
                  formErrors.email.length > 0 && <span style={{ color: 'red' }}>{formErrors.email}</span>,
                )}
                {inputSelect(
                  RequiredFile('শিক্ষাগত যোগ্যতা'),
                  'educationLevelId',
                  handleChange,
                  memberInfo.educationLevelId,
                  educationValue,
                  'id',
                  'displayValue',
                  4,
                  4,
                  4,
                  12,
                )}
                {inputSelect(
                  RequiredFile('পেশা'),
                  'occupationId',
                  handleChange,
                  memberInfo.occupationId,
                  jobType,
                  'id',
                  'displayValue',
                  4,
                  4,
                  4,
                  12,
                )}
                {inputSelect(
                  RequiredFile('ধর্ম'),
                  'religionId',
                  handleChange,
                  memberInfo.religionId,
                  religion,
                  'id',
                  'displayValue',
                  4,
                  4,
                  4,
                  12,
                )}
                {inputSelect(
                  RequiredFile('বৈবাহিক অবস্থা'),
                  'maritalStatusId',
                  handleChange,
                  memberInfo.maritalStatusId,
                  maritalStatus,
                  'id',
                  'displayValue',
                  4,
                  4,
                  4,
                  12,
                )}
                {memberInfo?.maritalStatusType == 'MAR' && (
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      label="স্বামী/স্ত্রী নাম"
                      name="spouseName"
                      onChange={handleChange}
                      type="text"
                      value={memberInfo.spouseName}
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: '#FFF' }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          {/* **************************************************************************************************
           ************************************* Address Section ************************************************
           ************************************************************************************************** */}
          <Grid container className="section">
            <Grid item xs={12}>
              <Grid container spacing={2.5}>
                <Grid item lg={6} md={12} xs={12}>
                  <SubHeading>বর্তমান ঠিকানা</SubHeading>
                  <Grid container spacing={2.5}>
                    <Grid item lg={6} md={6} xs={12}>
                      <TextField
                        // disabled={defaulsValue}
                        fullWidth
                        label={RequiredFile('জেলা')}
                        name="district"
                        onChange={changeDistrict}
                        select
                        SelectProps={{ native: true }}
                        value={districtId || 0}
                        variant="outlined"
                        size="small"
                        sx={{ backgroundColor: '#FFF' }}
                      >
                        <option value={0}>- নির্বাচন করুন -</option>
                        {resultOfDistrict.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.districtNameBangla}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <TextField
                        fullWidth
                        label={RequiredFile('উপজেলা/সিটি-কর্পোরেশন')}
                        name="upazila"
                        onChange={changeUpazila}
                        select
                        SelectProps={{ native: true }}
                        value={upazilaDetails || 0}
                        variant="outlined"
                        size="small"
                        sx={{ backgroundColor: '#FFF' }}
                        showSearch
                      >
                        <option value={0}>- নির্বাচন করুন -</option>
                        {resultOfUpazila.map((option) =>
                          option.upaCityId != null ? (
                            <option
                              key={option.upaCityId}
                              value={JSON.stringify({
                                upaCityId: option.upaCityId,
                                upaCityType: option.upaCityType,
                              })}
                            >
                              {option.upaCityNameBangla}
                            </option>
                          ) : (
                            ''
                          ),
                        )}
                      </TextField>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <TextField
                        fullWidth
                        label={RequiredFile('ইউনিয়ন/পৌরসভা/থানা')}
                        name="uniThanaPawNameBangla"
                        onChange={changeUnion}
                        select
                        SelectProps={{ native: true }}
                        value={unionDetails || 0}
                        // value={unionId ? unionId : union_Id}
                        variant="outlined"
                        size="small"
                        sx={{ backgroundColor: '#FFF' }}
                      >
                        <option value={0}>- নির্বাচন করুন -</option>
                        {resultOfUnion.map((option) =>
                          option.uniThanaPawId != null ? (
                            <option
                              key={option.uniThanaPawId}
                              value={JSON.stringify({
                                uniThanaPawId: option.uniThanaPawId,
                                uniThanaPawType: option.uniThanaPawType,
                              })}
                            >
                              {option.uniThanaPawNameBangla}
                            </option>
                          ) : (
                            ''
                          ),
                        )}
                      </TextField>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <TextField
                        fullWidth
                        name="villageArea"
                        required
                        variant="outlined"
                        size="small"
                        value={memberInfo.villageArea}
                        placeholder="বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন"
                        onChange={handleChange}
                      ></TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={6} md={12} xs={12}>
                  <SubHeading>
                    <span>স্থায়ী ঠিকানা</span>
                    <FormControlLabel
                      control={<Checkbox />}
                      checked={checked}
                      label="বর্তমান ঠিকানা একই"
                      onChange={handleChecked}
                      sx={{ margin: '-10px 0' }}
                    />
                  </SubHeading>
                  {checked ? (
                    <Grid container spacing={2.5}>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label={RequiredFile('জেলা')}
                          name="district"
                          onChange={changeDistrict}
                          select
                          SelectProps={{ native: true }}
                          value={districtId || 0}
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: '#FFF' }}
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          {resultOfDistrict.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.districtNameBangla}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label={RequiredFile('উপজেলা/সিটি-কর্পোরেশন')}
                          name="upazila"
                          onChange={changeUpazila}
                          select
                          SelectProps={{ native: true }}
                          value={upazilaDetails || 0}
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: '#FFF' }}
                          showSearch
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          {resultOfUpazila.map((option) =>
                            option.upaCityId != null ? (
                              <option
                                key={option.upaCityId}
                                value={JSON.stringify({
                                  upaCityId: option.upaCityId,
                                  upaCityType: option.upaCityType,
                                })}
                              >
                                {option.upaCityNameBangla}
                              </option>
                            ) : (
                              ''
                            ),
                          )}
                        </TextField>
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label={RequiredFile('ইউনিয়ন/পৌরসভা/থানা')}
                          name="uniThanaPawNameBangla"
                          onChange={changeUnion}
                          select
                          SelectProps={{ native: true }}
                          value={unionDetails || 0}
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: '#FFF' }}
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          {resultOfUnion.map((option) =>
                            option.uniThanaPawId != null ? (
                              <option
                                key={option.uniThanaPawId}
                                value={JSON.stringify({
                                  uniThanaPawId: option.uniThanaPawId,
                                  uniThanaPawType: option.uniThanaPawType,
                                })}
                              >
                                {option.uniThanaPawNameBangla}
                              </option>
                            ) : (
                              ''
                            ),
                          )}
                        </TextField>
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          name="villageArea"
                          required
                          variant="outlined"
                          size="small"
                          value={memberInfo.villageArea}
                          placeholder="বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন"
                          onChange={handleChange}
                        ></TextField>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2.5}>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          fullWidth
                          label={RequiredFile('জেলা')}
                          name="district"
                          onChange={pchangeDistrict}
                          select
                          SelectProps={{ native: true }}
                          value={pdistrictId || 0}
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: '#FFF' }}
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          {presultOfDistrict.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.districtNameBangla}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          fullWidth
                          label={RequiredFile('উপজেলা/সিটি-কর্পোরেশন')}
                          name="upazila"
                          onChange={pchangeUpazila}
                          select
                          SelectProps={{ native: true }}
                          value={pupazilaDetails || 0}
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: '#FFF' }}
                          showSearch
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          {presultOfUpazila.map((option) =>
                            option.upaCityId != null ? (
                              <option
                                key={option.upaCityId}
                                value={JSON.stringify({
                                  upaCityId: option.upaCityId,
                                  upaCityType: option.upaCityType,
                                })}
                              >
                                {option.upaCityNameBangla}
                              </option>
                            ) : (
                              ''
                            ),
                          )}
                        </TextField>
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          fullWidth
                          label={RequiredFile('ইউনিয়ন/পৌরসভা/থানা')}
                          name="uniThanaPawNameBangla"
                          onChange={pchangeUnion}
                          select
                          SelectProps={{ native: true }}
                          value={punionDetails || 0}
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: '#FFF' }}
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          {presultOfUnion.map((option) =>
                            option.uniThanaPawId != null ? (
                              <option
                                key={option.uniThanaPawId}
                                value={JSON.stringify({
                                  uniThanaPawId: option.uniThanaPawId,
                                  uniThanaPawType: option.uniThanaPawType,
                                })}
                              >
                                {option.uniThanaPawNameBangla}
                              </option>
                            ) : (
                              ''
                            ),
                          )}
                        </TextField>
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          fullWidth
                          name="pvillageArea"
                          required
                          variant="outlined"
                          size="small"
                          value={memberInfo.pvillageArea}
                          placeholder="বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন"
                          onChange={handleChange}
                        ></TextField>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* ***********************************************************************************************************
           ************************************ Address Section End **************************************************
           *********************************************************************************************************** */}
          <Grid container className="section">
            <Grid item lg={12} md={12} xs={12}>
              <SubHeading>প্রয়োজনীয় ডকুমেন্ট</SubHeading>

              <Grid container>
                {dynamicImageData?.map((element, i) => (
                  <>
                    <FromControlJSON
                      arr={[
                        {
                          onChange: (e) => handleChangeDynamicImage(e, element.mimeType, i),
                          onClickRefresh: (event) => {
                            event.target.value = null;
                          },
                          onClickFun: (e) => removeSelectedDynamicImage(e, i),
                          imageData: element,
                          size: 'small',
                          type: 'file',
                          viewType: 'file',
                          xl: 4,
                          lg: 4,
                          md: 4,
                          xs: 12,
                          index: i,
                          hidden: false,
                          isDisabled: false,
                          customClass: '',
                          customStyle: {},
                          imageStyle: { height: '100%', width: '100%' },
                          divStyle: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                          },
                        },
                      ]}
                    />
                  </>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Divider />

          <Grid container className="btn-container">
            <Tooltip title="আগের পাতায়">
              <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
                {' '}
                আগের পাতায়
              </Button>
            </Tooltip>
            {update ? (
              loadingDataSaveUpdate ? (
                <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
                  হালনাগাদ করা হচ্ছে...
                </LoadingButton>
              ) : (
                <Tooltip title="হালনাগাদ করুন">
                  <Button
                    className="btn btn-save"
                    onClick={onSubmitData}
                    disabled={checkFormError() || checkMandatory()}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {' '}
                    হালনাগাদ করুন
                  </Button>
                </Tooltip>
              )
            ) : loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                loadingPosition="start"
                sx={{ mr: 1 }}
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
              >
                সংরক্ষন করা হচ্ছে...
              </LoadingButton>
            ) : (
              <Tooltip title="সংরক্ষন করুন">
                <Button
                  className="btn btn-save"
                  onClick={onSubmitData}
                  disabled={checkFormError() || checkMandatory()}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  সংরক্ষন করুন
                </Button>
              </Tooltip>
            )}
            <Tooltip title="মুছে ফেলুন" sx={{ float: 'right' }}>
              <Button className="btn btn-warning" onClick={clearFrom} startIcon={<SubtitlesOffIcon />}>
                {' '}
                মুছে ফেলুন
              </Button>
            </Tooltip>
            <Tooltip title="বন্ধ করুন" sx={{ float: 'right' }}>
              <Button className="btn btn-delete" onClick={closeFrom} startIcon={<HighlightOffIcon />}>
                {' '}
                বন্ধ করুন
              </Button>
            </Tooltip>
            {showAllMember ?? showAllMember.length >= 6 ? (
              <Tooltip title="পরবর্তী পাতা">
                <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
                  {' '}
                  পরবর্তী পাতায়
                </Button>
              </Tooltip>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid container className="btn-container">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            আগের পাতায়
          </Button>
          <Button className="btn btn-add" onClick={addNewMember} startIcon={<PersonAddAltOutlinedIcon />}>
            নতুন সদস্য যোগ করুন
          </Button>
          {showAllMember ?? showAllMember.length >= 6 ? (
            <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
              পরবর্তী পাতায়
            </Button>
          ) : (
            ''
          )}
        </Grid>
      )}
      <Grid container className="section">
        <Grid xs={12}>
          <SubHeading>সদস্যের তথ্যাদি</SubHeading>
          {showAllMember.length != 0 ? (
            <TableContainer className="table-container lg-table">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>ক্রমিক</TableCell>
                    <TableCell>এনআইডি/জন্ম নিবন্ধন</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>জন্মতারিখ</TableCell>
                    <TableCell>নাম</TableCell>
                    <TableCell>পিতার নাম</TableCell>
                    <TableCell>মাতার নাম</TableCell>
                    <TableCell>স্বামী/স্ত্রীর নাম</TableCell>
                    <TableCell>পেশা</TableCell>
                    <TableCell>মোবাইল নম্বর</TableCell>
                    <TableCell>সদস্য ভর্তির তারিখ</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showAllMember?.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + (index + 1) + '')}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            <div className="tooltip-title">
                              {member?.memberBasicInfo?.nid ? numberToWord(member?.memberBasicInfo?.nid) : ''}
                              {member?.memberBasicInfo?.brn ? numberToWord(member?.memberBasicInfo?.brn) : ''}
                            </div>
                          }
                          arrow
                        >
                          <span className="data">
                            {member?.memberBasicInfo?.nid ? numberToWord(member?.memberBasicInfo?.nid) : ''}
                            {member?.memberBasicInfo?.brn ? numberToWord(member?.memberBasicInfo?.brn) : ''}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip
                          title={
                            <div className="tooltip-title">
                              {member?.memberBasicInfo?.dob
                                ? numberToWord(dateFormat(member?.memberBasicInfo?.dob))
                                : ''}
                            </div>
                          }
                          arrow
                        >
                          <span className="data">
                            {member?.memberBasicInfo?.dob ? numberToWord(dateFormat(member?.memberBasicInfo?.dob)) : ''}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={<div className="tooltip-title">{member?.memberBasicInfo?.memberNameBangla}</div>}
                          arrow
                        >
                          <span className="data">{member?.memberBasicInfo?.memberNameBangla}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={<div className="tooltip-title">{member?.memberBasicInfo?.fatherName}</div>}
                          arrow
                        >
                          <span className="data">{member?.memberBasicInfo?.fatherName}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={<div className="tooltip-title">{member?.memberBasicInfo?.motherName}</div>}
                          arrow
                        >
                          <span className="data">{member?.memberBasicInfo?.motherName}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={<div className="tooltip-title">{member?.memberBasicInfo?.spouseName}</div>}
                          arrow
                        >
                          <span className="data">{member?.memberBasicInfo?.spouseName}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={<div className="tooltip-title">{member?.memberBasicInfo?.occupationName}</div>}
                          arrow
                        >
                          <span className="data">{member?.memberBasicInfo?.occupationName}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={<div className="tooltip-title">{numberToWord(member?.memberBasicInfo?.mobile)}</div>}
                          arrow
                        >
                          <span className="data">{numberToWord(member?.memberBasicInfo?.mobile)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            <div className="tooltip-title">
                              {numberToWord(dateFormat(member.memberBasicInfo?.memberAdmissionDate))}
                            </div>
                          }
                          arrow
                        >
                          <span className="data">
                            {numberToWord(dateFormat(member.memberBasicInfo?.memberAdmissionDate))}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="সম্পাদন করুন">
                          <a href="#editMember">
                            <EditIcon
                              className="table-icon edit"
                              onClick={() =>
                                onEdit(
                                  member.memberBasicInfo.nid ? member.memberBasicInfo.nid : null,
                                  member.memberBasicInfo.brn ? member.memberBasicInfo.brn : null,
                                  member.memberBasicInfo.dob,
                                  member.memberBasicInfo.memberName,
                                  member.memberBasicInfo.memberNameBangla,
                                  member.memberBasicInfo.fatherName,
                                  member.memberBasicInfo.motherName,
                                  member.memberBasicInfo.spouseName,
                                  member.memberBasicInfo.occupationId,
                                  member.memberBasicInfo.mobile,
                                  member.memberBasicInfo.memberAdmissionDate,
                                  member.memberBasicInfo.email,
                                  member.memberBasicInfo.genderId,
                                  member.memberPresentAddress,
                                  member.memberPermanentAddress,
                                  member.memberBasicInfo.id,
                                  member.memberBasicInfo.educationLevelId,
                                  member.memberBasicInfo.maritalStatusId,
                                  member.memberBasicInfo.religionId,
                                  member.memberBasicInfo.documents,
                                )
                              }
                            />
                          </a>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container>
              <Grid item md={12} sx={{ textAlign: 'center', fontSize: '20px' }} my={5}>
                আপনি কোন সদস্য যোগ করেননি ! নতুন সদস্য যোগ করতে{' '}
                <span style={{ color: '#2e7d32' }} className={'textAnimation'}>
                  ( সদস্য যোগ করুন )
                </span>{' '}
                বাটন ক্লিক করুন
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default MemberRegistration;
