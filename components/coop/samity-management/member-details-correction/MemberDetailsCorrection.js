/* eslint-disable no-misleading-character-class */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-12 10:13:48
 * @desc [description]
 */
import AddIcon from '@mui/icons-material/Add';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
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
import _, { cloneDeep } from 'lodash';
import moment from 'moment/moment';
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
import Swal from 'sweetalert2';
import {
  ApprovalSamityMemberList,
  CoopWorkingArea,
  GetCorrectonMembrData,
  InsertMemCorrectionData,
  approvedDynamicImage,
  deleteApplication,
  geoData,
  masterData,
  memberInfoCorrectionRequest,
} from '../../../../url/coop/ApiList';
import ExcelMemberCorrectionUpload from './excel-member-upload/ExcelMemberCorrectionUpload';

// eslint-disable-next-line no-useless-escape
const emailRegex = RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);

const MemberDetailsCorrection = ({ getsamityInfo }) => {
  const { id: approveSamityId, isManual } = getsamityInfo;
  ///////////////////////////////////////*** page validation & localstorage data
  const config = localStorageData('config');
  // const approveSamityId = localStorageData("reportsIdPer");
  ////////////////////////////////////////*** page validation & localstorage End***///////////////////////////////
  const [isAddMember, setIsAddMember] = useState(false);
  const [excelPage, setExcelPage] = useState(false);
  const [maxMemberCode, setMaxMemberCode] = useState(0);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [showAllMember, setShowAllMember] = useState([]);
  const [update, setUpdate] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [memberPreId, setMemberPreId] = useState('');
  const [memberPerId, setMemberPerId] = useState('');
  const [jobType, setJobType] = useState([]);
  const [genderType, setGenderType] = useState([]);
  const [educationValue, setEducationValue] = useState([]);
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [religion, setReligion] = useState([]);
  let [getCorrectionMemData, setGetCorrectionMemData] = useState([]);
  const [memberIndex, setMemberIndex] = useState(null);
  const [memberInfo, setMemberInfo] = useState({
    nid: '',
    brn: '',
    dob: null,
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
    memberCode: '',
    educationLevelId: '',
    religionId: '',
    maritalStatusId: '',
    maritalStatusType: '',
    villageArea: '',
    pvillageArea: '',
  });
  const formErrors = {
    nid: '',
    brn: '',
    dob: '',
    memberName: '',
    fatherName: '',
    memberNameBangla: '',
    email: '',
    mobile: '',
    memberCode: '',
    religionId: '',
  };
  const [dobErrorMessage, setDobErrorMessage] = useState('');
  const [allMemberCode, setAllMemberCode] = useState([]);
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
  const [viewActionFor, setViewActionFor] = useState();
  // ***********************************************************************************************************
  // ***************************************************** working unique data setup **************************
  const [wUpaCityId, setWUpaCityId] = useState([]);
  const [wUninonIdType, setWUninonIdType] = useState([]);
  // **********************************************************************************************************
  const [selectionNidBrn, setSelectionNidBrn] = useState(1);
  const [dynamicImageData, setDynamicImageData] = useState([]);

  useEffect(() => {
    if (approveSamityId) {
      allMemberShow();
      getMasterData();
      getWorkingArea();
      getImageFormet();
    }
  }, [approveSamityId]);

  useEffect(() => {
    createMemberCode(showAllMember, getCorrectionMemData);
  }, [showAllMember, getCorrectionMemData]);

  const addNewMember = () => {
    setIsAddMember(true);
    setViewActionFor('create');
    if (allMemberCode) {
      const newMemberCode = formValidator('number', Math.max(...allMemberCode) + 1)?.value;
      setMemberInfo({ ...memberInfo, memberCode: newMemberCode });
    }
  };

  const clearFrom = () => {
    setMemberIndex(null);
    setMemberPerId('');
    setMemberPreId('');
    setMemberId('');
    setLoadingDataSaveUpdate(false);
    setMemberInfo({
      nid: '',
      brn: '',
      dob: null,
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
      memberCode: '',
      educationLevelId: '',
      religionId: '',
      maritalStatusId: '',
    });
    setSelectionNidBrn(1);
    setUpdate(false);
  };

  const closeFrom = () => {
    setMemberIndex(null);
    setMemberPerId('');
    setMemberPreId('');
    setMemberId('');
    setIsAddMember(false);
    setLoadingDataSaveUpdate(false);
    setMemberInfo({
      nid: '',
      brn: '',
      dob: null,
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
      memberCode: '',
      educationLevelId: '',
      religionId: '',
      maritalStatusId: '',
    });
    setSelectionNidBrn(1);
    setUpdate(false);
  };

  // ******************************************* Dynamic Image *********************************************
  const getImageFormet = async () => {
    try {
      const imageData = await axios.get(approvedDynamicImage + approveSamityId, config);
      const data = imageData.data.data;
      for (const [index] of data.entries()) {
        data[index].name = '';
        data[index].mimeType = '';
        data[index].base64Image = '';
        data[index].imageError = '';
      }

      setDynamicImageData(data);
    } catch (error) {
      errorHandler(error);
    }
  };

  // **************************************** Master Data Part ***************************************
  const getMasterData = async () => {
    try {
      const jotypeResp = await axios.get(masterData + 'occupation?isPagination=false', config);
      setJobType(jotypeResp.data.data);
      const gender = await axios.get(masterData + 'gender?isPagination=false', config);
      setGenderType(gender.data.data);
      const religionData = await axios.get(masterData + 'religion?isPagination=false', config);
      setReligion(religionData.data.data);
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
      const showMemeber = await axios.get(ApprovalSamityMemberList + approveSamityId, config);
      const data = showMemeber.data.data;
      setShowAllMember(data);
      const showCorrectionMemberData = await axios.get(GetCorrectonMembrData + approveSamityId, config);
      const allData = showCorrectionMemberData.data.data;
      if (allData) {
        setGetCorrectionMemData(
          _.omit(
            allData,
            'createdAt',
            'updatedBy',
            'updatedAt',
            'status',
            'serviceId',
            'isUsed',
            'finalApprove',
            'createdBy',
          ),
        );
      } else {
        setGetCorrectionMemData([]);
      }
    } catch (error) {
      //  errorHandler(error);
    }
  };

  // correction list fetch 2 time
  const allCorrectionDataFetch = async () => {
    try {
      setGetCorrectionMemData([]);
      const showCorrectionMemberData = await axios.get(GetCorrectonMembrData + approveSamityId, config);
      setGetCorrectionMemData(showCorrectionMemberData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  // **************************************** All Handle Change part ********************************
  const handleChangeNidBrn = (e) => {
    setSelectionNidBrn(e.target.value);
    setMemberInfo({
      ...memberInfo,
      nid: '',
      brn: '',
    });
  };

  let handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj;
    let newMemberData;
    let filteredArray;
    let allmemberCheck;
    let newMemberDatabrn;
    let allmemberCheckbrn;
    let maritalStatusList;
    switch (name) {
      case 'email':
        formErrors.email = emailRegex.test(value) || value.length == 0 ? '' : 'আপনার সঠিক ইমেইল প্রদান করুন';
        setMemberInfo({ ...memberInfo, [name]: value });
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
      case 'memberCode':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        filteredArray = allMemberCode.filter((number) => number === parseInt(bangToEng(resultObj?.value)));
        formErrors.memberCode =
          filteredArray.length >= 1
            ? 'মেম্বার কোডটি বিদ্যমান রয়েছে'
            : parseInt(bangToEng(resultObj?.value)) === 0
              ? 'মেম্বার কোড ০ দেওয়া যাবে না'
              : '';
        break;
      case 'nid':
        resultObj = formValidator('nid', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        // check nid if any table already exit
        if (getCorrectionMemData && getCorrectionMemData?.data?.membersInfo?.length > 0) {
          const saveData = getCorrectionMemData.data.membersInfo;
          newMemberData = saveData.some((row, i) => {
            return row.nid == bangToEng(resultObj?.value) && i != memberIndex;
          });
        }
        allmemberCheck = showAllMember.some((row) => {
          return row.memberBasicInfo.nid == bangToEng(resultObj?.value) && row.memberBasicInfo.id != memberId;
        });
        if (allmemberCheck) {
          formErrors.nid = 'এনআইডি বিদ্যমান রয়েছে';
          formErrors.brn = '';
        } else if (newMemberData) {
          formErrors.nid = 'এনআইডি বিদ্যমান রয়েছে';
          formErrors.brn = '';
        } else {
          formErrors.nid = resultObj?.error;
          formErrors.brn = '';
        }

        break;

      case 'brn':
        resultObj = formValidator('brn', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        // check already exit brn
        if (getCorrectionMemData && getCorrectionMemData?.data?.membersInfo?.length > 0) {
          const saveData = getCorrectionMemData.data.membersInfo;
          newMemberDatabrn = saveData.some((row, i) => {
            return row.nid == bangToEng(resultObj?.value) && i != memberIndex;
          });
        }
        allmemberCheckbrn = showAllMember.some((row) => {
          return row.memberBasicInfo.brn == bangToEng(resultObj?.value) && row.memberBasicInfo.id != memberId;
        });
        if (allmemberCheckbrn) {
          formErrors.brn = 'জন্ম নিবন্ধন বিদ্যমান রয়েছে';
          formErrors.nid = '';
        } else if (newMemberDatabrn) {
          formErrors.brn = 'জন্ম নিবন্ধন বিদ্যমান রয়েছে';
          formErrors.nid = '';
        } else {
          formErrors.brn = resultObj?.error;
          formErrors.nid = '';
        }
        break;

      case 'maritalStatusId':
        maritalStatusList = maritalStatus.find((row) => row.id == parseInt(value));
        if (maritalStatusList.returnValue != 'MAR' || value == '0') {
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
            ['maritalStatusType']: maritalStatusList.returnValue,
          });
        }
        break;

      case 'memberName':
        setMemberInfo({
          ...memberInfo,
          [name]: value.replace(/[^A-Z\s.-]/gi, '').toUpperCase(),
        });
        break;

      case 'memberNameBangla':
        setMemberInfo({
          ...memberInfo,
          [name]: value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
            '',
          ),
        });
        formErrors.memberNameBangla = value == null ? 'বাংলায় নাম লিখুন' : '';
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
      case 'shareAmount':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        break;
      case 'savingsAmount':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        break;
      case 'loanOutstanding':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        break;
      default:
        setMemberInfo({
          ...memberInfo,
          [name]: value == '0' ? '' : value,
        });
    }
  };
  // **************************************** Date of birt ******************************************
  const changeDob = (dob) => {
    setMemberInfo({ ...memberInfo, dob });
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
  const changeMemDate = (memberAdmissionDate) => {
    setMemberInfo({ ...memberInfo, memberAdmissionDate });
  };
  // ============================= address section  ======================================
  // ============================= get working area ======================================

  const getWorkingArea = async () => {
    try {
      if (approveSamityId) {
        const workingArea = await axios.get(CoopWorkingArea + '/' + approveSamityId, config);
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
      }
    } catch (error) {
      // errorHandler(error)
    }
  };
  // ============================= present address =======================================
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

      if (wUpaCityId.length > 0 && wUpaCityId[0].upaCityId) {
        const result = getUpdaData.filter((element) => {
          return wUpaCityId.some((e) => {
            return e.upaCityId === element.upaCityId && e.upaCityType === element.upaCityType;
          });
        });
        setResultOfUpazila(result);
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
      if (wUninonIdType.length > 0 && wUninonIdType[0].uniThanaPawId) {
        const result = unionDataGet.filter((element) => {
          return wUninonIdType.some((e) => {
            return e.uniThanaPawId === element.uniThanaPawId && e.uniThanaPawType === element.uniThanaPawType;
          });
        });
        setResultOfUnion(result);
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
    if (e.target.value != 0) {
      const data = JSON.parse(e.target.value);
      setPUnionDetails(e.target.value);
      setPUnionId(data.uniThanaPawId);
      setPUnionType(data.uniThanaPawType);
    } else {
      setPUnionDetails('');
      setPUnionId('');
      setPUnionType('');
    }
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
      if (wUpaCityId.length > 0 && wUpaCityId[0].upaCityId) {
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
      if (wUninonIdType.length > 0 && wUninonIdType[0].uniThanaPawId) {
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
  // ====================================== Address Sction End =================================
  // ====================================== From Error Part ====================================
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
      ...(memberInfo.nid ? { nid: memberInfo.nid } : ''),
      ...(memberInfo.brn ? { brn: memberInfo.brn } : ''),
      memberName: memberInfo.memberName,
      memberNameBangla: memberInfo.memberNameBangla,
      fatherName: memberInfo.fatherName,
      motherName: memberInfo.motherName,
      mobile: memberInfo.mobile,
      occupationId: memberInfo.occupationId,
      genderId: memberInfo.genderId,
      memberCode: memberInfo.memberCode,
      maritalStatusId: memberInfo.maritalStatusId,
      educationLevelId: memberInfo.educationLevelId,
      districtId,
      upazilaId,
      unionId,
      pdistrictId: checked ? districtId : pdistrictId,
      pupazilaId: checked ? upazilaId : pupazilaId,
      punionId: checked ? unionId : punionId,
      religionId: memberInfo.religionId == '0' ? '' : memberInfo.religionId,
      dob: dobErrorMessage ? '' : memberInfo.dob == null ? '' : memberInfo.dob,
    };
    const data = Object.keys(obj).some((e) => {
      return !obj[e];
    });
    return data;
  };

  let isMandatoryImgae = (isDelete, id) => {
    let isMandatory = true;
    let data = [...dynamicImageData];

    for (const element of data) {
      // check for delete data
      if (isDelete) {
        isMandatory = true;
      } else {
        if (id) {
          // for update work
          if (element.fileNameUrl || element.fileName) {
            isMandatory = true;
          } else if (element.isMandatory == 'Y' && element.base64Image == '' && isManual == false) {
            element.imageError = element.docTypeDesc + ' প্রদান করুন';
            isMandatory = false;
          }
        } else {
          // post part
          if (element.isMandatory == 'Y' && element.base64Image == '' && isManual == false) {
            element.imageError = element.docTypeDesc + ' প্রদান করুন';
            isMandatory = false;
          }
        }
      }
    }
    setDynamicImageData(data);
    return isMandatory;
  };

  let createPureDataSet = () => {
    let allCorrectionData = { ...getCorrectionMemData };
    let exprectedKeys = [
      'id',
      'memberName',
      'memberNameBangla',
      'samityId',
      'nid',
      'brn',
      'dob',
      'fatherName',
      'motherName',
      'spouseName',
      'occupationId',
      'genderId',
      'memberCode',
      'mobile',
      'memberAdmissionDate',
      'email',
      'permanentAddress',
      'presentAddress',
      'educationLevelId',
      'religionId',
      'maritalStatusId',
      'refSamityId',
      'actionFor',
      'memberPhoto',
      'memberSign',
      'documents',
      'memberDataFrom',
      'shareAmount',
      'savingsAmount',
      'loanOutstanding',
    ];
    let expectedDocumentKeys = ['docTypeDesc', 'fileName', 'docType', 'docId', 'mimeType', 'name', 'base64Image'];

    if (allCorrectionData?.data?.membersInfo?.length > 0) {
      for (const [index, element] of allCorrectionData?.data?.membersInfo?.entries()) {
        Object.keys(element).map((e) => {
          return exprectedKeys.includes(e) || delete allCorrectionData.data.membersInfo[index][e];
        });

        if (element?.documents && element?.documents.length > 0) {
          for (const [i, e] of element.documents.entries()) {
            Object.keys(e).map((val) => {
              return (
                expectedDocumentKeys.includes(val) || delete allCorrectionData.data.membersInfo[index].documents[i][val]
              );
            });
          }
        }
      }
    }
    setGetCorrectionMemData(allCorrectionData);
    // work here
  };
  // =================================== Image Part Start ======================================
  let handleChangeDynamicImage = (e, type, i) => {
    let imageData = [...dynamicImageData];
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      let fileSize = e.target.files[0].size;
      if (fileSize > 3000000) {
        NotificationManager.error('ফাইল সাইজ 3MB এর বড় হতে পারবে না');
        return;
      }
      if (
        file.name.includes('.jpg') ||
        file.name.includes('.png') ||
        file.name.includes('.JPEG') ||
        file.name.includes('.pdf')
      ) {
        if (imageData[i].docType == 'IMG' || imageData[i].docType == 'SIG') {
          if (file.name.includes('.pdf')) {
            NotificationManager.warning(
              imageData[i].docTypeDesc + ' jpg, png, jpeg এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ',
            );
          } else {
            let reader = new FileReader();
            reader.readAsBinaryString(file);
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
          let reader = new FileReader();
          reader.readAsBinaryString(file);
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

  // ============================================== data submit part start ===============================
  const onSubmitData = async (e, isDelete, member) => {
    e.preventDefault();
    // return
    const isNewDelete = isDelete ? false : true;
    if (checkMandatory() && isNewDelete == true) {
      const message = 'বাধ্যতামূলক তথ্য পূরণ করুন';
      NotificationManager.warning(message, '', 5000);
    } else {
      // image checke start
      if (isMandatoryImgae(isDelete, memberId)) {
        setLoadingDataSaveUpdate(true);
        createPureDataSet();
        let insertCorectionData, perAdd, deletePayload;
        ////////////////////////////////////// Delete Member Payload //////////////////////////////

        let preAdd = {
          ...(memberPreId != '' && { id: memberPreId }),
          samityId: approveSamityId,
          addressType: 'PRE',
          districtId: districtId != '' ? parseInt(districtId) : '',
          upaCityId: upazilaId != '' ? parseInt(upazilaId) : '',
          upaCityType: upazilaType != '' ? upazilaType : '',
          uniThanaPawId: unionId != '' ? parseInt(unionId) : '',
          uniThanaPawType: unionType != '' ? unionType : '',
          ...(memberInfo.villageArea ? { detailsAddress: memberInfo.villageArea } : ''),
        };

        if (checked) {
          perAdd = {
            ...(memberPerId != '' && { id: memberPerId }),
            samityId: approveSamityId,
            addressType: 'PER',
            districtId: districtId != '' ? parseInt(districtId) : '',
            upaCityId: upazilaId != '' ? parseInt(upazilaId) : '',
            upaCityType: upazilaType != '' ? upazilaType : '',
            uniThanaPawId: unionId != '' ? parseInt(unionId) : '',
            uniThanaPawType: unionType != '' ? unionType : '',
            ...(memberInfo.villageArea ? { detailsAddress: memberInfo.villageArea } : ''),
          };
        } else {
          perAdd = {
            ...(memberPerId != '' && { id: memberPerId }),
            samityId: approveSamityId,
            addressType: 'PER',
            districtId: pdistrictId != '' ? parseInt(pdistrictId) : '',
            upaCityId: pupazilaId != '' ? parseInt(pupazilaId) : '',
            upaCityType: pupazilaType != '' ? pupazilaType : '',
            uniThanaPawId: punionId != '' ? parseInt(punionId) : '',
            uniThanaPawType: punionType != '' ? punionType : '',
            ...(memberInfo.pvillageArea ? { detailsAddress: memberInfo.pvillageArea } : ''),
          };
        }

        getCorrectionMemData = _.omit(getCorrectionMemData, 'nextAppDesignationId');
        getCorrectionMemData.serviceName = 'member_information_correction';

        dynamicImageData.forEach((a) => {
          delete a.fileNameUrl;
          if (!a.base64Image) {
            delete a.name;
            delete a.mimeType;
            delete a.base64Image;
            delete a.isMandatory;
            delete a.imageError;
          }
          if (a.base64Image) {
            delete a.fileName;
            delete a.isMandatory;
            delete a.imageError;
          }
        });
        if (isDelete) {
          deletePayload = {
            serviceName: 'member_information_correction',
            samityId: approveSamityId,
            data: {
              membersInfo: [
                {
                  memberName: member.memberBasicInfo.memberName,
                  memberNameBangla: member.memberBasicInfo.memberNameBangla,
                  samityId: member.memberBasicInfo.samityId,
                  ...(member.memberBasicInfo.nid && {
                    nid: member.memberBasicInfo.nid,
                  }),
                  ...(member.memberBasicInfo.brn && {
                    brn: member.memberBasicInfo.brn,
                  }),
                  dob: dateFormat(member.memberBasicInfo.dob),
                  fatherName: member.memberBasicInfo.fatherName,
                  motherName: member.memberBasicInfo.motherName,
                  spouseName: member.memberBasicInfo.spouseName,
                  occupationId: member.memberBasicInfo.occupationId,
                  genderId: member.memberBasicInfo.genderId,
                  memberCode: member.memberBasicInfo.memberCode,
                  mobile: member.memberBasicInfo.mobile,
                  email: member.memberBasicInfo.email,
                  memberAdmissionDate: member?.memberBasicInfo?.memberAdmissionDate
                    ? dateFormat(member.memberBasicInfo.memberAdmissionDate)
                    : null,
                  permanentAddress: _.omit(
                    member.memberPermanentAddress,
                    'updatedBy',
                    'updatedAt',
                    'createdBy',
                    'createdAt',
                  ),
                  presentAddress: _.omit(
                    member.memberPresentAddress,
                    'updatedBy',
                    'updatedAt',
                    'createdBy',
                    'createdAt',
                  ),
                  educationLevelId: member.memberBasicInfo.educationLevelId,
                  religionId: member.memberBasicInfo.religionId,
                  maritalStatusId: member.memberBasicInfo.maritalStatusId,
                  refSamityId: null,
                  actionFor: 'deactivate',
                  id: member.memberBasicInfo.id,
                  documents: member.memberBasicInfo.documents ? member.memberBasicInfo.documents : [],
                },
              ],
            },
          };
        }
        ////////////////////////////////////////////////////Member Correction section ////////////////////////////
        const correctionPayload = {
          serviceName: 'member_information_correction',
          samityId: approveSamityId,
          data: {
            membersInfo: [
              {
                memberName: memberInfo.memberName,
                memberNameBangla: memberInfo.memberNameBangla,
                samityId: approveSamityId,
                ...(memberInfo.brn ? { brn: bangToEng(memberInfo.brn) } : ''),
                ...(memberInfo.nid ? { nid: bangToEng(memberInfo.nid) } : ''),
                dob: dateFormat(memberInfo.dob) != 'Invalid date' ? dateFormat(memberInfo.dob) : memberInfo.dob,
                fatherName: memberInfo.fatherName,
                motherName: memberInfo.motherName,
                spouseName: memberInfo.spouseName,
                occupationId: memberInfo.occupationId,
                genderId: memberInfo.genderId,
                mobile: bangToEng(memberInfo.mobile),
                email: memberInfo.email,
                memberCode: bangToEng(memberInfo.memberCode),
                memberAdmissionDate:
                  dateFormat(memberInfo.memberAdmissionDate) != 'Invalid date'
                    ? dateFormat(memberInfo.memberAdmissionDate)
                    : null,
                permanentAddress: perAdd,
                presentAddress: preAdd,
                educationLevelId: memberInfo.educationLevelId,
                religionId: parseInt(memberInfo.religionId),
                maritalStatusId: memberInfo.maritalStatusId,
                refSamityId: null,
                actionFor: isDelete && memberId ? 'deactivate' : memberId ? 'update' : 'create',
                documents: dynamicImageData,
                ...(memberId && { id: memberId }),
                ...(memberInfo.shareAmount && {
                  shareAmount: bangToEng(memberInfo.shareAmount),
                }),
                ...(memberInfo.savingsAmount && {
                  savingsAmount: bangToEng(memberInfo.savingsAmount),
                }),
                ...(memberInfo.loanOutstanding && {
                  loanOutstanding: bangToEng(memberInfo.loanOutstanding),
                }),
              },
            ],
          },
        };
        //////////////////////////////////// Member Correction Section //////////////////////
        try {
          if (getCorrectionMemData.id) {
            if (isDelete) {
              // delete update part
              getCorrectionMemData.data.membersInfo.push(deletePayload.data.membersInfo[0]);
              insertCorectionData = await axios.put(
                InsertMemCorrectionData + '/' + getCorrectionMemData.id,
                getCorrectionMemData,
                config,
              );
              const message = ' সদস্যপদ বাতিলের আবেদনটি সফলভাবে সংরক্ষন করা হয়েছে';
              NotificationManager.success(message, '', 5000);
            } else {
              // update part
              if (memberIndex != null) {
                getCorrectionMemData.data.membersInfo[memberIndex] = correctionPayload.data.membersInfo[0];
                insertCorectionData = await axios.put(
                  InsertMemCorrectionData + '/' + getCorrectionMemData.id,
                  getCorrectionMemData,
                  config,
                );
                NotificationManager.success(insertCorectionData.data.message, '', 5000);
              } else {
                getCorrectionMemData.data.membersInfo.push(correctionPayload.data.membersInfo[0]);
                insertCorectionData = await axios.put(
                  InsertMemCorrectionData + '/' + getCorrectionMemData.id,
                  getCorrectionMemData,
                  config,
                );
                const message = 'আবেদনটি সফলভাবে সংরক্ষন করা হয়েছে';
                NotificationManager.success(message, '', 5000);
              }
            }
          } else {
            if (isDelete) {
              insertCorectionData = await axios.post(InsertMemCorrectionData, deletePayload, config);
              NotificationManager.success(insertCorectionData.data.message, '', 5000);
            } else {
              /////////////////////////////////////////// post ////////////////////////////
              insertCorectionData = await axios.post(InsertMemCorrectionData, correctionPayload, config);
              NotificationManager.success(insertCorectionData.data.message, '', 5000);
              /////////////////////////////////////////// post ///////////////////////////////
            }
          }
          setIsAddMember(false);
          setLoadingDataSaveUpdate(false);
          setDynamicImageData([]);
          allMemberShow();
          getImageFormet();
          setMemberInfo({
            nid: '',
            brn: '',
            dob: null,
            memberName: '',
            memberNameBangla: '',
            fatherName: '',
            motherName: '',
            spouseName: '',
            jobType: '',
            occupationId: '',
            mobile: '',
            memberAdmissionDate: null,
            email: '',
            memberCode: '',
            genderId: '',
            educationLevelId: '',
            religionId: '',
            maritalStatusId: '',
          });
          setMemberIndex(null);
          setSelectionNidBrn(1);
          setUpdate(false);
          allCorrectionDataFetch();
          setMemberId('');
          setLoadingDataSaveUpdate(false);
        } catch (error) {
          setLoadingDataSaveUpdate(false);
          allMemberShow();
          errorHandler(error);
        }
        // image check pass after work main flow end
      } else {
        const message = 'বাধ্যতামূলক তথ্য পূরণ করুন';
        NotificationManager.warning(message, '', 5000);
      }
    }
  };
  // ************************************** data submit part End *******************************

  // ********************************** Edit section part start *****************************
  const imageCheck = async (secondState) => {
    let firstState;
    const imageData = await axios.get(approvedDynamicImage + approveSamityId, config);
    firstState = imageData.data.data;
    for (const [index] of firstState.entries()) {
      firstState[index].name = '';
      firstState[index].mimeType = '';
      firstState[index].base64Image = '';
      firstState[index].imageError = '';
    }

    for (const element of secondState) {
      const index = firstState.findIndex((e) => e.docId == element.docId);
      if (index >= 0) {
        firstState.splice(index, 1, element);
      }
    }
    setDynamicImageData(firstState);
  };
  // ***************************************************** Edit section part start *****************************
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
    genderId,
    memberCode,
    presentAddress,
    permanentAddress,
    id,
    educationLevelId,
    religionId,
    maritalStatusId,
    documents,
  ) => {
    // image set start
    if (documents) {
      for (const [index] of documents.entries()) {
        documents[index].name = '';
        documents[index].mimeType = '';
        documents[index].base64Image = '';
      }
      imageCheck(documents);
    } else {
      getImageFormet();
    }
    const marStatus = maritalStatus.find((row) => row.id == maritalStatusId);
    setIsAddMember(true);
    setMemberInfo({
      email,
      fatherName,
      memberName: memberName ? memberName.replace(/[^A-Z\s.-]/gi, '').toUpperCase() : '',
      memberNameBangla: memberNameBangla
        ? memberNameBangla.replace(
          /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
          '',
        )
        : '',
      nid: nid ? formValidator('nid', nid)?.value : '',
      brn: brn ? formValidator('brn', brn)?.value : '',
      dob: dob ? dob : '',
      motherName,
      spouseName,
      mobile: mobile ? formValidator('mobile', mobile)?.value : '',
      memberAdmissionDate: memberAdmissionDate ? memberAdmissionDate : '',
      occupationId,
      genderId,
      memberCode: formValidator('number', memberCode)?.value,
      educationLevelId,
      religionId,
      maritalStatusId,
      maritalStatusType: marStatus?.returnValue ? marStatus?.returnValue : '',
      villageArea: presentAddress ? presentAddress.detailsAddress : null,
      pvillageArea: permanentAddress ? permanentAddress.detailsAddress : null,
    });
    if (nid) {
      setSelectionNidBrn(1);
    }
    if (brn) {
      setSelectionNidBrn(2);
    }
    setUpdate(true);
    // present address
    if (presentAddress) {
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
    }

    // parmanent address  section
    if (permanentAddress) {
      setPdistrictId(permanentAddress.districtId);
      setPUpazilaId(permanentAddress.upaCityId);
      setPUpazilaType(permanentAddress.upaCityType);
      let setUnionThana = JSON.stringify({
        upaCityId: permanentAddress?.upaCityId,
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
    }

    setMemberId(id);
    if (presentAddress && permanentAddress) {
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
    }
  };
  // ***************************************************** Edit section part End *****************************
  //  **************************************************** Edit correction Member List ***********************
  let onEditCorrection = (member, index) => {
    const {
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
      memberCode,
      genderId,
      presentAddress,
      permanentAddress,
      educationLevelId,
      religionId,
      maritalStatusId,
      id: oldMemberId,
      documents,
      shareAmount,
      savingsAmount,
      loanOutstanding,
      actionFor,
    } = member;
    setViewActionFor(actionFor);
    setUpdate(true);
    if (documents) {
      for (const [index] of documents.entries()) {
        documents[index].name = '';
        documents[index].mimeType = '';
        documents[index].base64Image = '';
      }
      imageCheck(documents);
    } else {
      getImageFormet();
    }
    setIsAddMember(true);
    const marStatus = maritalStatus.find((row) => row.id == maritalStatusId);

    setMemberInfo({
      email,
      fatherName,
      memberName,
      memberNameBangla,
      nid: nid ? formValidator('nid', nid)?.value : '',
      brn: brn ? formValidator('brn', brn)?.value : '',
      dob: moment(dob, 'DD/MM/YYYY').toDate(),
      motherName,
      spouseName,
      mobile: formValidator('mobile', mobile)?.value,
      memberAdmissionDate: moment(memberAdmissionDate, 'DD/MM/YYYY').toDate(),
      occupationId,
      genderId,
      memberCode: formValidator('number', memberCode)?.value,
      educationLevelId,
      religionId,
      maritalStatusId,
      maritalStatusType: marStatus?.returnValue,
      villageArea: presentAddress?.detailsAddress || null,
      pvillageArea: permanentAddress?.detailsAddress || null,
      shareAmount: shareAmount && engToBang(shareAmount),
      savingsAmount: savingsAmount && engToBang(savingsAmount),
      loanOutstanding: loanOutstanding && engToBang(loanOutstanding),
    });
    if (nid) {
      setSelectionNidBrn(1);
    }
    if (brn) {
      setSelectionNidBrn(2);
    }
    // present address
    setDistrictId(presentAddress?.districtId);
    setUpazilaId(presentAddress?.upaCityId);
    setUpazilaType(presentAddress?.upaCityType);
    let setUpa = JSON.stringify({
      upaCityId: presentAddress?.upaCityId,
      upaCityType: presentAddress?.upaCityType,
    });
    if (presentAddress?.districtId) {
      getUpazila(presentAddress?.districtId);
    }
    setUpazilaDetails(setUpa);
    setUnionId(presentAddress?.uniThanaPawId);
    setUnionType(presentAddress?.uniThanaPawType);
    let unionEditData = JSON.stringify({
      uniThanaPawId: presentAddress?.uniThanaPawId,
      uniThanaPawType: presentAddress?.uniThanaPawType,
    });
    if (presentAddress?.districtId && presentAddress?.upaCityId && presentAddress?.upaCityType) {
      getUnion(presentAddress?.districtId, presentAddress?.upaCityId, presentAddress?.upaCityType);
    }
    setUnionDetails(unionEditData);
    // parmanent address  section
    setPdistrictId(permanentAddress?.districtId);
    setPUpazilaId(permanentAddress?.upaCityId);
    setPUpazilaType(permanentAddress?.upaCityType);
    let setUnionThana = JSON.stringify({
      upaCityId: permanentAddress?.upaCityId,
      upaCityType: permanentAddress?.upaCityType,
    });
    if (permanentAddress?.districtId) {
      pgetUpazila(permanentAddress?.districtId);
    }
    setPUpazilaDetails(setUnionThana);
    setPUnionId(permanentAddress?.uniThanaPawId);
    setPUnionType(permanentAddress?.uniThanaPawType);
    let unionpEditData = JSON.stringify({
      uniThanaPawId: permanentAddress?.uniThanaPawId,
      uniThanaPawType: permanentAddress?.uniThanaPawType,
    });
    if (permanentAddress?.districtId && permanentAddress?.upaCityId && permanentAddress?.upaCityType) {
      pgetUnion(permanentAddress?.districtId, permanentAddress?.upaCityId, permanentAddress?.upaCityType);
    }
    setPUnionDetails(unionpEditData);
    setMemberPreId(presentAddress?.id);
    setMemberPerId(permanentAddress?.id);
    setMemberIndex(index);
    setMemberId(oldMemberId);

    let compare = (permanentAddress, presentAddress) => {
      if (
        permanentAddress?.districtId == presentAddress?.districtId &&
        permanentAddress?.upaCityId == presentAddress?.upaCityId &&
        permanentAddress?.uniThanaPawId == presentAddress?.uniThanaPawId &&
        permanentAddress?.detailsAddress == presentAddress?.detailsAddress
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
  // ***************************************************** Edit correction Member List ***********************
  const addressBan = (item) => {
    if (item == 'districtId') {
      return 'জেলা';
    } else if (item == 'upaCityId') {
      return 'উপজেলা';
    } else if (item == 'upaCityType') {
      return 'উপজেলা';
    } else if (item == 'uniThanaPawId') {
      return 'ইউনিয়ন';
    } else if (item == 'uniThanaPawType') {
      return 'ইউনিয়ন';
    }
  };
  const memberCheck = (data) => {
    let exit = false;
    if (!exit) {
      for (const element of data) {
        if (element?.documents && element?.documents?.length == 0 && isManual == false) {
          NotificationManager.warning(`${element.memberNameBangla} এর ডকুমেন্ট পাওয়া যায় নি `, '', 5000);
          exit = true;
          break;
        }
        let isBreak = false;
        const keysOfAddress = [
          'districtId',
          'upaCityId',
          'addressType',
          'upaCityType',
          'uniThanaPawId',
          'uniThanaPawType',
        ];
        for (const e of keysOfAddress) {
          if (!element.presentAddress[e]) {
            NotificationManager.warning(
              `${element.memberNameBangla} বর্তমান ${addressBan(e)} এর তথ্য  পাওয়া যায় ন`,
              '',
              5000,
            );
            exit = true;
            isBreak = true;
            break;
          }
          if (!element.permanentAddress[e]) {
            NotificationManager.warning(
              `${element.memberNameBangla} স্থায়ী ${addressBan(e)} এর তথ্য  পাওয়া যায় ন`,
              '',
              5000,
            );
            exit = true;
            isBreak = true;
            break;
          }
        }
        if (isBreak) {
          break;
        }
      }
    }
    return exit;
  };
  const sendCorrectionMemberList = async (correctionMemData) => {
    const totalMemberData = cloneDeep(correctionMemData?.data?.membersInfo);
    const newCreateData = _.map(totalMemberData, (obj) =>
      _.omit(
        obj,
        'actionFor',
        'dob',
        'brn',
        'educationLevelId',
        'email',
        'fatherName',
        'genderId',
        'maritalStatusId',
        'memberAdmissionDate',
        'memberDataFrom',
        'memberName',
        'mobile',
        'motherName',
        'nid',
        'occupationId',
        'religionId',
        'samityId',
        'spouseName',
      ),
    );
    if (memberCheck(newCreateData) == false) {
      try {
        const submitCorrectionData = await axios.patch(memberInfoCorrectionRequest + correctionMemData.id, '', config);
        allMemberShow();
        NotificationManager.success(submitCorrectionData.data.message, '', 5000);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const removeCorrectionMember = async (index, name) => {
    try {
      await Swal.fire({
        title: 'সদস্য পদ বাতিল',
        text: 'আপনি কি ' + name + ' এর সদস্যপদ বাতিল করতে চান ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ফিরে যান ।',
        confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
      }).then((result) => {
        if (result.isConfirmed) {
          if (getCorrectionMemData.data.membersInfo.length === 1) {
            axios.delete(deleteApplication + getCorrectionMemData.id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার বাতিল করা হয়েছে.', 'success');
                allMemberShow();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                allMemberShow();
              }
            });
          } else {
            let list = { ...getCorrectionMemData };
            list.data.membersInfo.splice(index, 1);
            list = _.omit(list, 'nextAppDesignationId');
            list.serviceName = 'member_information_correction';

            axios.put(InsertMemCorrectionData + '/' + getCorrectionMemData.id, list, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                allMemberShow();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                allMemberShow();
              }
            });
          }
          allMemberShow();
        }
      });
    } catch (error) {
      // errorHandler(error)
    }
  };
  const createMemberCode = (allMemberData, correctionMemberData) => {
    const memberCodeArray = [];
    if (allMemberData) {
      allMemberData.map((row) => memberCodeArray.push(parseInt(row?.memberBasicInfo?.memberCode)));
    }
    if (correctionMemberData?.data?.membersInfo) {
      correctionMemberData?.data?.membersInfo.map((row) => memberCodeArray.push(parseInt(row?.memberCode)));
    }
    setAllMemberCode(memberCodeArray);
  };
  const uploadExcel = () => {
    setExcelPage(true);
    if (allMemberCode.length > 0) {
      setMaxMemberCode(Math.max(...allMemberCode));
    } else {
      setMaxMemberCode(0);
    }
  };
  const closeExcel = () => {
    setExcelPage(false);
    allMemberShow();
  };

  return (
    <Fragment>
      {approveSamityId ? (
        excelPage ? (
          <ExcelMemberCorrectionUpload
            {...{
              closeExcel,
              educationValue,
              jobType,
              maritalStatus,
              religion,
              genderType,
              getCorrectionMemData,
              maxMemberCode,
              getsamityInfo,
            }}
          />
        ) : (
          <Fragment>
            {isAddMember ? (
              <Grid id="toGo">
                <Grid container className="section">
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={2.5} pt={1}>
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
                            label: 'জন্ম নিবন্ধন নাম্বার',
                          },
                        ],
                        4,
                        4,
                        4,
                        12,
                        false,
                        1,
                      )}
                      {selectionNidBrn == 1
                        ? inputField(
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
                        )
                        : ''}
                      {selectionNidBrn == 2
                        ? inputField(
                          RequiredFile('জন্ম নিবন্ধন নাম্বার'),
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
                        )
                        : ''}
                      <FromControlJSON
                        arr={[
                          {
                            labelName: RequiredFile('জন্ম তারিখ'),
                            onChange: changeDob,
                            value: memberInfo.dob,
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
                      {inputSelect(
                        RequiredFile('লিঙ্গ'),
                        'genderId',
                        handleChange,
                        memberInfo.genderId,
                        genderType,
                        'id',
                        'displayValue',
                        2,
                        2,
                        2,
                        6,
                      )}
                      {inputField(
                        RequiredFile('মেম্বার কোড'),
                        'memberCode',
                        'text',
                        handleChange,
                        memberInfo.memberCode,
                        'small',
                        2,
                        2,
                        2,
                        6,
                        formErrors.memberCode,
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
                      {memberInfo.maritalStatusType == 'MAR' && (
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
                      {viewActionFor == 'create' && (
                        <FromControlJSON
                          arr={[
                            {
                              labelName: 'শেয়ার মূল্য',
                              name: 'shareAmount',
                              onChange: handleChange,
                              value: memberInfo.shareAmount,
                              size: 'small',
                              type: 'text',
                              viewType: 'textField',
                              xl: 4,
                              lg: 4,
                              md: 4,
                              xs: 12,
                              isDisabled: false,
                              placeholder: 'শেয়ার মূল্য লিখুন',
                              customClass: '',
                              customStyle: {},
                              errorMessage: '',
                            },
                            {
                              labelName: 'সঞ্চয়ের পরিমান',
                              name: 'savingsAmount',
                              onChange: handleChange,
                              value: memberInfo.savingsAmount,
                              size: 'small',
                              type: 'text',
                              viewType: 'textField',
                              xl: 4,
                              lg: 4,
                              md: 4,
                              xs: 12,
                              isDisabled: false,
                              placeholder: 'সঞ্চয়ের পরিমান লিখুন',
                              customClass: '',
                              customStyle: {},
                              errorMessage: '',
                            },
                            {
                              labelName: 'ঋণ ব্যালেন্স',
                              name: 'loanOutstanding',
                              onChange: handleChange,
                              value: memberInfo.loanOutstanding,
                              size: 'small',
                              type: 'text',
                              viewType: 'textField',
                              xl: 4,
                              lg: 4,
                              md: 4,
                              xs: 12,
                              isDisabled: false,
                              placeholder: 'ঋণ ব্যালেন্স লিখুন',
                              customClass: '',
                              customStyle: {},
                              errorMessage: '',
                            },
                          ]}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                {/* ********************** Address Section ******************* */}
                <Grid container className="section">
                  <Grid item lg={12} md={12} xs={12}>
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
                              label={'ঠিকানা'}
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
                          <span>স্থায়ী ঠিকানা </span>{' '}
                          <span>
                            <FormControlLabel
                              control={<Checkbox sx={{ margin: '-12px 0 -6px' }} />}
                              checked={checked}
                              label="বর্তমান ঠিকানা একই"
                              onChange={handleChecked}
                            />
                          </span>
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
                                value={upazilaDetails}
                                variant="outlined"
                                size="small"
                                sx={{ backgroundColor: '#FFF' }}
                                showSearch
                              >
                                <option>- নির্বাচন করুন -</option>
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
                                label={'ঠিকানা'}
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
                {/* ******************* Address Section End *************** */}
                <Grid container className="section">
                  <Grid item xs={12}>
                    <SubHeading>সদস্যের প্রয়োজনীয় ডকুমেন্ট</SubHeading>
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
                                imageStyle: { height: '100%', width: '100%' },
                                divStyle: {
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: '100%',
                                  width: '100%',
                                  margin: '5px',
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
                  {loadingDataSaveUpdate ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveOutlinedIcon />}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      {update ? 'হালনাগাদ করা হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
                    </LoadingButton>
                  ) : (
                    <Tooltip title={update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}>
                      <Button
                        className="btn btn-save"
                        onClick={(e) => onSubmitData(e, false)}
                        disabled={checkFormError() || checkMandatory()}
                        startIcon={<SaveOutlinedIcon />}
                      >
                        {' '}
                        {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip title="মুছে ফেলুন" sx={{ float: 'right' }}>
                    <Button className="btn btn-warning" onClick={clearFrom} startIcon={<SubtitlesOffIcon />}>
                      {' '}
                      মুছে ফেলুন
                    </Button>
                  </Tooltip>
                  <Tooltip title="বন্ধ করুন">
                    <Button className="btn btn-delete" onClick={closeFrom} startIcon={<HighlightOffIcon />}>
                      {' '}
                      বন্ধ করুন
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            ) : (
              <Grid container className="btn-container">
                {getCorrectionMemData.editEnable || getCorrectionMemData.length == 0 ? (
                  <>
                    <Button className="btn btn-add" onClick={addNewMember} startIcon={<AddIcon />}>
                      নতুন সদস্য যোগ করুন
                    </Button>
                    <Button className="btn btn-primary" onClick={uploadExcel} startIcon={<CloudSyncIcon />}>
                      এক্সেল আপলোড
                    </Button>
                    <Button
                      disabled={getCorrectionMemData.editEnable ? false : true}
                      className="btn btn-save"
                      onClick={() => sendCorrectionMemberList(getCorrectionMemData)}
                      endIcon={getCorrectionMemData.nextAppDesignationId ? '' : <SaveAltIcon />}
                    >
                      {getCorrectionMemData.editEnable
                        ? getCorrectionMemData.nextAppDesignationId
                          ? 'আবেদনটি জমা দেওয়া হয়েছে পুনরায় জমা দিন'
                          : 'আবেদনটি জমা দিন'
                        : getCorrectionMemData.length == 0
                          ? 'কোন আবেদন পাওয়া যায়নি'
                          : 'আবেদনটি সফলভাবে জমা দেওয়া হয়েছে, দয়া করে অনুমোদনের জন্য অপেক্ষা করুন।'}
                    </Button>
                  </>
                ) : (
                  ''
                )}
              </Grid>
            )}
            <Divider />
            <Grid container className="section" sx={{ marginTop: '2rem' }}>
              <Grid lg={12} md={12} sm={12} xs={12}>
                <SubHeading>বিদ্যমান সদস্যের তথ্য</SubHeading>
                {showAllMember?.length != 0 ? (
                  <TableContainer className="table-container lg-table" sx={{ maxHeight: 470, width: '100%' }}>
                    <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" stickyHeader>
                      <TableHead className="table-head">
                        <TableRow>
                          <TableCell>সদস্য কোড</TableCell>
                          <TableCell>এনআইডি/জন্ম নিবন্ধন</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>জন্মতারিখ</TableCell>
                          <TableCell>নাম</TableCell>
                          <TableCell>পিতার নাম</TableCell>
                          <TableCell>মাতার নাম</TableCell>
                          <TableCell>স্বামী/স্ত্রীর নাম</TableCell>
                          <TableCell>পেশা</TableCell>
                          <TableCell>অবস্থা</TableCell>
                          {getCorrectionMemData.editEnable ? <TableCell></TableCell> : ''}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {showAllMember
                          ?.sort((a, b) => a?.memberBasicInfo?.memberCode - b?.memberBasicInfo?.memberCode)
                          ?.map((member) => (
                            <TableRow key={member?.memberCode}>
                              <TableCell sx={{ textAlign: 'center' }}>
                                {numberToWord('' + member?.memberBasicInfo?.memberCode + '')}
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {member?.memberBasicInfo?.nid
                                        ? numberToWord(member?.memberBasicInfo?.nid)
                                        : numberToWord(member?.memberBasicInfo?.brn)}
                                    </div>
                                  }
                                >
                                  <span className="data">
                                    {member?.memberBasicInfo?.nid
                                      ? numberToWord(member?.memberBasicInfo?.nid)
                                      : numberToWord(member?.memberBasicInfo?.brn)}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>
                                {member?.memberBasicInfo.dob
                                  ? numberToWord('' + dateFormat(member?.memberBasicInfo?.dob) + '')
                                  : ''}
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">{member?.memberBasicInfo?.memberNameBangla}</div>
                                  }
                                >
                                  <span className="data">{member?.memberBasicInfo?.memberNameBangla}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={<div className="tooltip-title">{member?.memberBasicInfo?.fatherName}</div>}
                                >
                                  <span className="data">{member?.memberBasicInfo?.fatherName}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={<div className="tooltip-title">{member?.memberBasicInfo?.motherName}</div>}
                                >
                                  <span className="data">{member?.memberBasicInfo?.motherName}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={<div className="tooltip-title">{member?.memberBasicInfo?.spouseName}</div>}
                                >
                                  <span className="data">{member?.memberBasicInfo?.spouseName}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title"> {member?.memberBasicInfo?.occupationName}</div>
                                  }
                                >
                                  <span className="data"> {member?.memberBasicInfo?.occupationName}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>{member?.isEditAble ? 'সক্রিয়' : 'আবেদিত'}</TableCell>
                              <TableCell align="center" sx={{ maxWidth: '250px !important' }}>
                                {getCorrectionMemData?.editEnable || getCorrectionMemData?.length == 0 ? (
                                  <>
                                    {member.isEditAble && (
                                      <>
                                        <Tooltip title="এডিট করুন">
                                          <a href="#toGo">
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
                                                  member.memberBasicInfo.memberCode,
                                                  member.memberPresentAddress,
                                                  member.memberPermanentAddress,
                                                  member.memberBasicInfo.id,
                                                  member.memberBasicInfo.educationLevelId,
                                                  member.memberBasicInfo.religionId,
                                                  member.memberBasicInfo.maritalStatusId,
                                                  member.memberBasicInfo.documents,
                                                )
                                              }
                                            />
                                          </a>
                                        </Tooltip>
                                        <Tooltip title="সদস্যপদ বাতিল">
                                          <DeleteForeverIcon
                                            className="table-icon delete"
                                            onClick={(e) => onSubmitData(e, true, member)}
                                          />
                                        </Tooltip>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <span style={{ color: 'red' }}>আবেদনটি বাতিল করা হয়েছে</span>
                                )}
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
            <Grid container className="section">
              <Grid xs={12}>
                <SubHeading>সংরক্ষনকৃত / আবেদিত সদস্যের তথ্য </SubHeading>
                {getCorrectionMemData.length != 0 ? (
                  <TableContainer className="table-container lg-table" sx={{ maxHeight: 470, width: '100%' }}>
                    <Table size="small" aria-label="a dense table" stickyHeader>
                      <TableHead className="table-head">
                        <TableRow>
                          <TableCell>সদস্য কোড</TableCell>
                          <TableCell>আবেদনের ধরন</TableCell>
                          <TableCell>এনআইডি/জন্ম নিবন্ধন</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>জন্মতারিখ</TableCell>
                          <TableCell>নাম</TableCell>
                          <TableCell>পিতার নাম</TableCell>
                          <TableCell>মাতার নাম</TableCell>
                          {/* <TableCell>লিঙ্গ</TableCell> */}
                          <TableCell>স্বামী/স্ত্রীর নাম</TableCell>
                          {/* <TableCell>পেশা</TableCell>
                          <TableCell>সদস্য ভর্তির তারিখ</TableCell>
                          <TableCell>মোবাইল নম্বর</TableCell> */}
                          {getCorrectionMemData?.editEnable && <TableCell></TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getCorrectionMemData?.data?.membersInfo
                          ?.sort((a, b) => a.memberCode - b.memberCode)
                          .map((member, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ textAlign: 'center' }}>
                                {numberToWord('' + member?.memberCode + '')}
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>
                                {member?.actionFor == 'create'
                                  ? 'নতুন সদস্য'
                                  : member?.actionFor == 'update'
                                    ? 'বিদ্যমান সদস্য'
                                    : 'সদস্যপদ বাতিল'}
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {member.nid
                                        ? numberToWord('' + member.nid + '')
                                        : numberToWord('' + member.brn + '')}
                                    </div>
                                  }
                                >
                                  <span className="data">
                                    {member.nid
                                      ? numberToWord('' + member.nid + '')
                                      : numberToWord('' + member.brn + '')}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + member?.dob + '')}</TableCell>
                              <TableCell>
                                <Tooltip title={<div className="tooltip-title">{member?.memberNameBangla}</div>}>
                                  <span className="data">{member?.memberNameBangla}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={<div className="tooltip-title">{member?.fatherName}</div>}>
                                  <span className="data">{member?.fatherName}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={<div className="tooltip-title">{member?.motherName}</div>}>
                                  <span className="data">{member?.motherName}</span>
                                </Tooltip>
                              </TableCell>
                              {/* <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {findDisplayValue(genderType, member?.genderId)}
                                    </div>
                                  }
                                >
                                  <span className="data">
                                    {findDisplayValue(genderType, member?.genderId)}
                                  </span>
                                </Tooltip>
                              </TableCell> */}
                              <TableCell>
                                <Tooltip title={<div className="tooltip-title">{member?.spouseName}</div>}>
                                  <span className="data">{member?.spouseName}</span>
                                </Tooltip>
                              </TableCell>
                              {/* <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {findDisplayValue(jobType, member?.occupationId)}
                                    </div>
                                  }
                                >
                                  <span className="data">
                                    {findDisplayValue(jobType, member?.occupationId)}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {numberToWord(
                                        "" + member?.memberAdmissionDate + ""
                                      )}
                                    </div>
                                  }
                                >
                                  <span className="data">
                                    {numberToWord(
                                      "" + member?.memberAdmissionDate + ""
                                    )}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {numberToWord(member.mobile)}
                                    </div>
                                  }
                                >
                                  <span className="data">
                                    {numberToWord(member.mobile)}
                                  </span>
                                </Tooltip>
                              </TableCell> */}

                              <TableCell align="center" sx={{ maxWidth: '250px !important' }}>
                                {getCorrectionMemData.editEnable ? (
                                  <>
                                    {member.actionFor == 'deactivate' || (
                                      <>
                                        <Tooltip title="এডিট করুন">
                                          <a href="#toGo">
                                            <EditIcon
                                              className="table-icon edit"
                                              onClick={() => onEditCorrection(member, index)}
                                            />
                                          </a>
                                        </Tooltip>
                                        <Tooltip title="সদস্যপদ বাতিল">
                                          <DeleteForeverIcon
                                            className="table-icon delete"
                                            onClick={() => removeCorrectionMember(index, member.memberNameBangla)}
                                          />
                                        </Tooltip>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <span style={{ color: 'red' }}>আবেদনটি বাতিল করা হয়েছে</span>
                                )}
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
        )
      ) : (
        'আপনি প্রক্রিয়াধীন সমিতি টিক দিয়েছেন'
      )}
    </Fragment>
  );
};

export default MemberDetailsCorrection;
