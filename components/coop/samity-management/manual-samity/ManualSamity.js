/* eslint-disable no-dupe-else-if */
/* eslint-disable no-misleading-character-class */
/*
 * @email ziaurrahaman939@gmail.com
 * @desc [description]
 * @Modify & Update (Md. Hasibuzzaman) - hasib@erainfotechbd.com
 * @Modify & Update (Md. Saifur Rahman) - saifur@erainfotechbd.com
 */
import { Add } from '@mui/icons-material';
import Clear from '@mui/icons-material/Clear';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import Loader from 'components/Loader';
import fileCheck from 'components/shared/others/DocImage/FileUploadTypeCheck';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import ZoneComponent from 'components/utils/ZoneComponent';
import ZoneContext from 'components/utils/ZoneContext.json';
import GetGeoData from 'components/utils/coop/GetGeoData';
import RefactoredToOfficeSelectItem from 'components/utils/coop/RefactoredToOfficeSelectItem';
import bnLocale from 'date-fns/locale/bn';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import {
  designationSelected,
  fetchBranchNames,
  fetchDesignationNames,
  officeSelected,
  originUnitSelected,
  ownAndOthersSelected,
} from 'redux/feature/approvalOfficeSelectionlSlice';
import { fetchManualSamityById, onUpdateChange } from 'redux/feature/manualSamity/manualSamitySlice';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { formValidator } from 'service/formValidator';
import { inputRadioGroup } from 'service/fromInput';
import { bangToEng, engToBang } from 'service/numberConverter';
import Swal from 'sweetalert2';
import {
  CoopRegSubmitApi,
  MemberAreaInsert,
  SamityMigration,
  SamityType,
  WorkingAreaInsert,
  enterprising,
  memberInfoData,
  projectList,
  serviceRules,
} from '../../../../url/coop/ApiList';
import { getSamityDataByUserLevelCategory } from '../../../../url/coop/BackOfficeApi';

const DynamicDocSectionHeader = dynamic(() => import('components/shared/others/DocImage/DocSectionHeader'), {
  loading: () => <Loader />,
});
const DynamicDocSectionContent = dynamic(() => import('components/shared/others/DocImage/DocSectionContent'), {
  loading: () => <Loader />,
});

const area = [
  {
    value: 1,
    label: 'বিভাগ',
  },
  {
    value: 2,
    label: 'জেলা',
  },
  {
    value: 3,
    label: 'উপজেলা/সিটি-কর্পোরেশন',
  },
  {
    value: 4,
    label: 'ইউনিয়ন/পৌরসভা/থানা',
  },

  {
    value: 5,
    label: 'গ্রাম/মহল্লা',
  },
];

const localeMap = {
  bn: bnLocale,
};

// main section
const ManualSamity = () => {
  const dispatch = useDispatch();
  const {
    originUnitId,
    officeId,
    designationId: desgId,
    // applicationName: appName,
    // defaultValue: defValue,
    ownOrOthers: ownOther,
  } = useSelector((state) => state.officeSelectApproval);
  const { manualSamity, update } = useSelector((state) => state.manualSamity);
  const router = useRouter();
  const samityId = router.query.id;
  const officeGeoCode = localStorageData('officeGeoData');
  const config = localStorageData('config');
  // const [ownOrOthers, setOwnOrOthers] = useState('own');
  const clearState = () => {
    setCommInfo({
      authorizedPersonName: '',
      authorizedPersonNid: '',
      authorizedPersonmobile: '',
    });

    setCoop({
      ...coop,
      samityCode: '',
      samityName: '',
      samityLevel: 'P',
      organizerId: '',
      officeId: '',
      projectId: '',
      samityTypeId: 0,
      purpose: '',
      phone: '',
      mobile: '',
      email: '',
      enterprisingOrg: 0,
      villageArea: '',
      memberAreaType: 5, //use
      workingAreaType: 5,
      samityEffectiveness: 'E',
    });

    setDivisionId('নির্বাচন করুন');
    setDistrictId('নির্বাচন করুন');
    setUpacityIdType('নির্বাচন করুন');
    setUniThanaPawIdType('নির্বাচন করুন');
    setRegDate(null);
    setFormationDate(null);
    setDocumentList([
      {
        documentType: 18,
        documentNumber: '',
        documentPictureFront: '',
        documentPictureFrontName: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',

        documentPictureBack: '',
        documentPictureBackName: '',
        documentPictureBackType: '',
        documentPictureBackFile: '',
        addDoc: false,
      },
    ]);
    ownOther === 'others' && dispatch(originUnitSelected(0));
    ownOther === 'others' && dispatch(officeSelected(0));
    dispatch(designationSelected(0));
  };
  const [workingAreaData] = useState([]);
  // const [primarySamityListAlive, setPrimarySamityListAlive] = useState(false);
  // const [centralSamityListAlive, setCentralSamityListAlive] = useState(false);
  // const [zoneContext, setZoneContext] = useState({});
  const [levelLock, setLevelLock] = useState(false);
  const [coop, setCoop] = useState({
    samityCode: '',
    samityName: '',
    samityLevel: 'P',
    organizerId: '',
    officeId: '',
    projectId: '',
    samityTypeId: '',
    purpose: '',
    enterprisingOrg: '',
    villageArea: '',
    declaration: false,
    samityEffectiveness: 'E',
    memberAreaType: 5,
    workingAreaType: 5,
  });

  const [commInfo, setCommInfo] = useState({
    authorizedPersonName: '',
    authorizedPersonNid: '',
    authorizedPersonBrn: '',
    authorizedPersonmobile: '',
  });

  //State for API Response from DisUpaUni
  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  // const [upazilaId, setUpazilaId] = useState('');
  // const [upazilaIdType, setUpazilaIdType] = useState('');
  // const [unionId, setUnionId] = useState('');
  const [samityType, setSamityType] = useState([]);
  const [projects, setProjects] = useState([]);
  const [enterprisingOrg, setEnterprisingOrg] = useState([]);
  //   const [update, setUpdate] = useState(false);
  const [upacityIdType, setUpacityIdType] = useState('');
  const [uniThanaPawIdType, setUniThanaPawIdType] = useState('');
  const [checkedArea, setCheckedArea] = useState(false);
  const [formErrors, setFormErrors] = useState({
    samityLevel: '',
    samityName: '',
    samityCode: '',
    samityEffectiveness: '',
    regDate: '',
    //formationdDate: "",
    samityTypeId: '',
    divisionId: '',
    districtId: '',
    upacityIdType: '',
    uniThanaPawIdType: '',
    villageArea: '',
    memberUnionArea: '',
    workingUnionArea: '',
    noOfShare: '',
    sharePrice: '',
    soldShare: '',
    occupation: '',
    servicesName: '',
    enterprisingOrg: '',
    authorizedPersonName: '',
    authorizedPersonmobile: '',
    authorizedPersonNid: '',
    designationId: '',
    memberDivisionArea: '',
    documentType: '',
    documentNumber: '',
    documentPictureFront: '',
    memDivision: '',
    memDistrict: '',
    memUpazila: '',
    memUnion: '',
    memDetail: '',
    workDivision: '',
    workDistrict: '',
    workUpazila: '',
    workUnion: '',
    workDetail: '',
    mandatoryDocError: '',
    officeError: '',
    officerError: '',
    originUnitError: '',
    designationError: '',
    nid: '',
    mobile: '',
  });

  const [projectNameBangla, setProjectNameBangla] = useState('');
  const [memberSelectArea, setMemberSelectArea] = useState([
    {
      divisionId: '',
      divisionIdError: '',
      districtId: '',
      districtIdError: '',
      upaCityId: '',
      upaCityIdError: '',
      upaCityType: '',
      uniThanaPawId: '',
      uniThanaPawIdError: '',
      uniThanaPawType: '',
      detailsAddress: '',
      detailsAddressError: '',
      status: 'A',
    },
  ]);
  const [workingArea, setWorkingArea] = useState([
    {
      divisionId: '',
      divisionIdError: '',
      districtId: '',
      districtIdError: '',
      upaCityId: '',
      upaCityIdError: '',
      upaCityType: '',
      uniThanaPawId: '',
      uniThanaPawIdError: '',
      uniThanaPawType: '',
      detailsAddress: '',
      detailsAddressError: '',
      status: 'A',
    },
  ]);
  // const [decActive, setDecActive] = useState(false);
  const [regDate, setRegDate] = useState(null);
  const [formationdDate, setFormationDate] = useState(null);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [allSamityData, setAllSamityData] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const [samityData, setSamityData] = useState({
    samityId: 0,
    samityLevel: '',
  });
  const [cenNatMemberData, setCenNatMemberData] = useState({
    samityId: '',
    memberId: 0,
    memberName: '',
    nid: '',
    mobile: '',
  });

  const [appId, setAppId] = useState('');

  const [documentType, setDocumentType] = useState([]);
  const [imageValidation, setImageValidation] = useState([]);
  const [documentList, setDocumentList] = useState([
    {
      documentType: 18,
      documentNumber: '',
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',
      documentPictureBack: '',
      documentPictureBackName: '',
      documentPictureBackType: '',
      documentPictureBackFile: '',
      addDoc: false,
    },
  ]);
  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);

  const [locale] = useState('bn');

  const handleChangeForZone = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'division_id':
        setDivisionId(value);
        break;

      case 'district_id':
        setDistrictId(value);

        break;
      case 'upaCityIdType':
        setUpacityIdType(value);

        break;
      case 'uniThanaPawIdType':
        setUniThanaPawIdType(value);

        break;
    }
  };
  function giveValueToTextField(index) {
    const ids = [
      divisionId ?? 'নির্বাচন করুন',
      districtId ?? 'নির্বাচন করুন',
      upacityIdType ?? 'নির্বাচন করুন',
      uniThanaPawIdType ?? 'নির্বাচন করুন',
    ];

    return ids[index];
  }
  const handleRegDateChange = (date) => {
    setRegDate(date);
  };

  const handleFormationDateChange = (date) => {
    setFormationDate(date);
  };

  // const ref0 = useRef();
  const setSamityOfficeAndMemberWorkingArea = (officeGeoCode) => {
    setDivisionId(officeGeoCode?.divisionId ?? '');
    if (officeGeoCode.districtId) {
      setDistrictId(officeGeoCode?.districtId ?? '');
    }

    if (officeGeoCode.upazilaId) {
      setUpacityIdType(`${officeGeoCode?.upazilaId}` + ',' + 'UPA');
      // setUpazilaId(officeGeoCode?.upazilaId ?? '');
      // setUpazilaIdType(officeGeoCode?.upaCityType ?? '');
    }

    setMemberSelectArea([
      {
        divisionId: officeGeoCode?.divisionId ?? 'নির্বাচন করুন',
        districtId: officeGeoCode?.districtId ?? 'নির্বাচন করুন',
        upaCityId: officeGeoCode?.upazilaId ?? '',
        upaCityType: officeGeoCode?.upaCityType ?? '',
        uniThanaPawId: '',
        uniThanaPawType: '',
        detailsAddress: '',
        status: 'A',
      },
    ]);
    setWorkingArea([
      {
        divisionId: officeGeoCode?.divisionId ?? 'নির্বাচন করুন',
        districtId: officeGeoCode?.districtId ?? 'নির্বাচন করুন',
        upaCityId: officeGeoCode?.upazilaId ?? '',
        upaCityType: officeGeoCode?.upaCityType ?? '',
        uniThanaPawId: '',
        uniThanaPawType: '',
        detailsAddress: '',
        status: 'A',
      },
    ]);
  };
  useEffect(() => {
    setSamityOfficeAndMemberWorkingArea(officeGeoCode);
  }, [divisionId]);

  useEffect(() => {
    if (samityId) {
      setSamityInfoInEditMode();
    }
  }, [manualSamity]);

  useEffect(() => {
    // setZoneContext(ZoneContext.fields);
    getData();
    getEnterPrisingOrg();
  }, []);

  useEffect(() => {
    if (samityId) {
      dispatch(fetchManualSamityById({ id: parseInt(samityId) }));
    }
  }, [samityId]);

  useEffect(() => {
    getProject(coop.enterprisingOrg);
  }, [coop.enterprisingOrg]);

  useEffect(() => {
    return () => {
      dispatch(originUnitSelected(''));
      dispatch(officeSelected(''));
      dispatch(onUpdateChange(false));
    };
  }, []);

  useEffect(() => {
    serviceInfo();
  }, []);

  const serviceInfo = async () => {
    const serviceNameData = await axios.get(serviceRules + 6, config);

    setDocumentType(serviceNameData.data.data[0].featuresDetails);
  };

  const getSamityData = async (samityLevel, samityTypeId) => {
    try {
      if (samityLevel == 'C' && samityTypeId) {
        const getData = await axios.get(
          getSamityDataByUserLevelCategory + 'P' + '&samityTypeId=' + samityTypeId,
          config,
        );
        setAllSamityData(getData.data.data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSamityMemberData = async (samityId) => {
    try {
      const getMemberData = await axios.get(memberInfoData + samityId, config);
      setMemberData(getMemberData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  let checkName = (value) => {
    let flag = false;
    let samityNameCheck = ['ব্যাংক', 'Bank', 'ব্যাং', 'BANK', 'bank'];
    for (let check = 0; check < samityNameCheck.length; check++) {
      if (value.includes(samityNameCheck[check])) {
        flag = true;
      }
    }

    return flag;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // if (value == 'C') {
    //   setPrimarySamityListAlive(true);
    // }
    // if (value == 'N') {
    //   setCentralSamityListAlive(true);
    // }
    let projectData, nameBangla;
    switch (name) {
      case 'samityName':
        formErrors.samityName = checkName(value) ? 'সমিতির নামের সাথে ব্যাংক লেখা যাবে না ' : '';
        setCoop({ ...coop, [name]: value });
        break;
      case 'samityCode':
        setCoop({ ...coop, [name]: value });
        setFormErrors({
          ...formErrors,
          [name]: value.length > 20 ? 'সমিতির মূল নিবন্ধন নাম্বার ২০ অক্ষরের বেশি হতে পারে না' : '',
        });
        break;
      case 'samityTypeId':
        setCoop({ ...coop, [name]: value });
        getSamityData(coop.samityLevel, value);
        if (value == 0) {
          setCenNatMemberData({
            ...cenNatMemberData,
            memberId: '',
            memberName: '',
            nid: '',
            brn: '',
            mobile: '',
          });
        }
        setMemberData([]);
        break;
      case 'projectId':
        projectData = JSON.parse(e.target.value);
        // id = projectData.id;
        nameBangla = projectData.nameBangla;
        setCoop({
          ...coop,
          projectId: projectData,
        });
        setProjectNameBangla(nameBangla);
        break;
      default:
        setCoop({ ...coop, [name]: value });
        break;
    }
  };

  const handleAddClicksetMemberSelectArea = () => {
    const upacity = upacityIdType.split(',');
    setMemberSelectArea([
      ...memberSelectArea,
      coop.memberAreaType == 1
        ? {
          divisionId: divisionId ? divisionId : '',
          status: 'A',
        }
        : coop.memberAreaType == 2
          ? {
            divisionId: divisionId ? divisionId : '',
            districtId: districtId ? districtId : '',
            status: 'A',
          }
          : coop.memberAreaType == 3
            ? {
              divisionId: divisionId ? divisionId : '',
              districtId: districtId ? districtId : '',
              upaCityId: parseInt(upacity[0]) ? parseInt(upacity[0]) : '',
              upaCityType: upacity[1] ? upacity[1] : '',
              status: 'A',
            }
            : coop.memberAreaType == 4
              ? {
                divisionId: divisionId ? divisionId : '',
                districtId: districtId ? districtId : '',
                upaCityId: parseInt(upacity[0]) ? parseInt(upacity[0]) : '',
                upaCityType: upacity[1] ? upacity[1] : '',
                uniThanaPawId: '',
                uniThanaPawType: '',
                status: 'A',
              }
              : coop.memberAreaType == 5
                ? {
                  divisionId: divisionId ? divisionId : '',
                  districtId: districtId ? districtId : '',
                  upaCityId: parseInt(parseInt(upacity[0])),
                  upaCityType: 'UPA',
                  uniThanaPawId: '',
                  uniThanaPawType: '',
                  detailsAddress: '',
                  status: 'A',
                }
                : '',
    ]);
  };

  let handleRemoveWorkingArea = async (index) => {
    if (workingAreaData[index]) {
      try {
        await Swal.fire({
          title: 'আপনি কি নিশ্চিত?',
          text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ফিরে যান ।',
          confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(WorkingAreaInsert + '/' + workingAreaData[index].id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
              }
            });
          }
        });
      } catch (error) {
        errorHandler(error);
      }
    } else {
      let list = [...workingArea];
      list.splice(index, 1);
      setWorkingArea(list);
    }
  };

  const handleChangeMemberArea = async (e, index) => {
    const { name, value } = e.target;
    const list = [...memberSelectArea];
    let upaData, unionData;
    switch (name) {
      case 'divisionId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['divisionIdError'] = list[index][name] == '' ? 'বিভাগ নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'districtId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['districtIdError'] = list[index][name] == '' ? 'জেলা নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'samityUpaCityIdType':
        upaData = JSON.parse(e.target.value);
        list[index]['upaCityId'] = upaData.upaCityId ? upaData.upaCityId : '';
        list[index]['upaCityType'] = upaData.upaCityType ? upaData.upaCityType : '';
        list[index]['upaCityIdError'] = list[index]['upaCityId'] == '' ? 'উপজেলা/সিটি  নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'samityUniThanaPawIdType':
        unionData = JSON.parse(e.target.value);
        list[index]['uniThanaPawId'] = unionData.uniThanaPawId ? unionData.uniThanaPawId : '';
        list[index]['uniThanaPawType'] = unionData.uniThanaPawType ? unionData.uniThanaPawType : '';
        list[index]['uniThanaPawIdError'] =
          list[index]['uniThanaPawId'] == '' && coop.memberAreaType >= 4 ? 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'detailsAddress':
        list[index][name] = value;
        list[index]['detailsAddressError'] =
          list[index]['detailsAddress'] == '' && coop.memberAreaType == 5 ? 'ঠিকানা লিখুন' : '';
        setMemberSelectArea(list);
        break;
    }
  };

  const handleChangeMemberAndWorkingArea = (e) => {
    const { name, value } = e.target;
    if (value === '0') {
      return;
    }
    switch (name) {
      case 'memberAreaType':
        setCoop({ ...coop, memberAreaType: value });
        if (parseInt(value) === 4) {
          setFormErrors({ ...formErrors, memDetail: '' });
        }
        break;

      case 'workingAreaType':
        setCoop({ ...coop, workingAreaType: parseInt(value) });
        if (parseInt(value) === 4) {
          setFormErrors({ ...formErrors, workDetail: '' });
        }
        break;

      case 'onChecked':
        setCheckedArea(e.target.checked);
        break;

      default:
        setCoop({ ...coop, [name]: value });
    }
  };

  let getData = async () => {
    try {
      let SamityTypeData = await axios.get(SamityType, config);
      setSamityType(SamityTypeData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  let getProject = async (id) => {
    if (id && id !== 'নির্বাচন করুন') {
      try {
        const projectData = await axios.get(projectList + `project?isPagination=false&enterprising_id=${id}`, config);
        setProjects(projectData.data.data);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  let getEnterPrisingOrg = async () => {
    try {
      const enterprisingData = await axios.get(enterprising, config);
      setEnterprisingOrg(enterprisingData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getDocTypeNameBangla = (docId) => {
    if (parseInt(docId) === 18) {
      return 'সমিতির সার্টিফিকেট';
    }
    if (parseInt(docId) === 19) {
      return 'তথ্য স্লিপ';
    }
    if (parseInt(docId) === 29) {
      return 'সমিতির প্রত্যয়ন পত্র';
    }
    if (parseInt(docId) === 30) {
      return 'উপ আইন';
    }
    if (parseInt(docId) === 35) {
      return 'নিয়োগকৃত কমিটি';
    }
  };

  const buildDocumentPayload = (documentList) => {
    let docList = [];
    if (!update) {
      documentList.map((docInfo) => {
        docInfo.documentPictureFrontFile.split;
        docList.push({
          documentId: parseInt(docInfo.documentType),
          documentNo: docInfo.documentNumber ? docInfo.documentNumber.toString() : coop.samityCode,
          documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
          documentName: [
            {
              name: docInfo.documentPictureFrontFile.name
                ? docInfo.documentPictureFrontFile.name
                : docInfo.documentPictureFrontName,
              mimeType: docInfo.documentPictureFrontType,
              base64Image: docInfo.documentPictureFront,
            },
          ],
        });
      });
    } else if (update) {
      const newDocumentInfo = manualSamity[0].data.documentInfo.map((doc) => {
        return doc.documentName[0].fileName;
      });

      documentList.map((docInfo, i) => {
        if (!newDocumentInfo.includes(docInfo.documentPictureFrontName)) {
          docList = [
            ...docList,
            {
              documentId: parseInt(docInfo.documentType),
              documentNo: docInfo.documentNumber.toString(),
              documentName: [
                {
                  oldFileName: newDocumentInfo[i],
                  name: docInfo.documentPictureFrontFile.name
                    ? docInfo.documentPictureFrontFile.name
                    : docInfo.documentPictureFrontName,
                  mimeType: docInfo.documentPictureFrontType,
                  base64Image: docInfo.documentPictureFront,
                },
              ],
              documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
            },
          ];
        } else {
          docList = [
            ...docList,
            {
              documentId: parseInt(docInfo.documentType),
              documentNo: docInfo.documentNumber.toString(),
              documentName: [
                {
                  fileName: docInfo.documentPictureFrontName,
                },
              ],
              documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
            },
          ];
        }
      });
    }
    return docList;
  };

  const handleChangeSamity = async (e) => {
    if (e.target.value == 0) {
      setSamityData({
        samityId: 0,
        samityLevel: '',
      });
      setCenNatMemberData({
        ...cenNatMemberData,
        memberId: 0,
        memberName: '',
        nid: '',
        mobile: '',
      });
      setCenNatMemberData({
        ...cenNatMemberData,
        memberId: '',
        memberName: '',
        nid: '',
        brn: '',
        mobile: '',
      });
    } else {
      const samityDataFind = allSamityData.find((row) => row.id == e.target.value);
      setSamityData({
        ...samityData,
        samityId: samityDataFind.id,
        samityLevel: samityDataFind.samityLevel,
      });
      getSamityMemberData(e.target.value);
      setCenNatMemberData({
        ...cenNatMemberData,
        nid: '',
        brn: '',
        mobile: '',
      });
    }
  };

  const handleChangeSamityData = async (e) => {
    if (e.target.value == 0) {
      setCenNatMemberData({
        ...cenNatMemberData,
        memberId: 0,
        memberName: '',
        nid: '',
        mobile: '',
      });
    } else {
      const cenNatData = memberData.find((element) => element.memberBasicInfo.id == e.target.value);
      setCenNatMemberData({
        ...cenNatMemberData,
        memberId: cenNatData.memberBasicInfo.id,
        memberName: cenNatData.memberBasicInfo.memberNameBangla,
        nid: cenNatData.memberBasicInfo.nid ? cenNatData.memberBasicInfo.nid : cenNatData.memberBasicInfo.brn,
        mobile: cenNatData.memberBasicInfo.mobile,
      });
    }
  };

  const handleChangeForAuthorizedPerson = (e) => {
    const { name, value } = e.target;
    let memberDataNid, memberDataBrn, resultObj;
    switch (name) {
      case 'authorizedPersonNid':
        memberDataNid = formValidator('nid', value);
        memberDataBrn = formValidator('brn', value);
        if (memberDataNid?.status || memberDataBrn?.status) {
          return;
        }
        setCommInfo({
          ...commInfo,
          [name]: bangToEng(value) > 0 ? memberDataNid?.value : memberDataBrn?.value,
        });
        formErrors.authorizedPersonNid = memberDataNid?.error;
        formErrors.authorizedPersonBrn = memberDataBrn?.error;
        break;

      case 'authorizedPersonmobile':
        resultObj = formValidator('mobile', value);
        if (resultObj?.status) {
          return;
        }
        setCommInfo({
          ...commInfo,
          [name]: resultObj?.value,
        });
        formErrors.authorizedPersonmobile = resultObj?.error;

        break;

      default:
        setCommInfo({
          ...commInfo,
          [e.target.name]: e.target.value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
            '',
          ),
        });
        break;
    }
  };

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        documentType: '',
        documentNumber: '',
        documentPictureFront: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        documentPictureBack: '',
        documentPictureBackType: '',
        documentPictureBackFile: '',
      },
    ]);
    setFormErrorsInDocuments([
      ...formErrorsInDocuments,
      {
        documentType: '',
        documentNumber: '',
        documentPictureFrontFile: '',
        documentPictureBackFile: '',
      },
    ]);
  };

  const handleDocumentList = (e, index) => {
    const { name, value } = e.target;
    const validData = documentType.find((row) => row.id == value);
    setImageValidation(validData?.documentProperties);
    const list = [...documentList];
    switch (name) {
      case 'documentNumber':
        list[index][name] = value;
        break;
      default:
        list[index][name] = parseInt(value) ? parseInt(value) : '';
        break;
    }
    setDocumentList(list);
  };

  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setDocumentList([...changeAddDoc]);
  };

  const fileSelectedHandler = (event, index) => {
    const { name } = event.target;
    let list = [...documentList];
    list[index][name] = '';
    list[index][name + 'Name'] = '';
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let fileSize = event.target.files[0].size;
      if (fileSize > 3000000) {
        NotificationManager.error('ফাইল সাইজ 3MB এর বড় হতে পারবে না');
        return;
      }
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);
        if (base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = event.target.files[0];
          if (
            event.target.files[0].name.includes('.jpg') ||
            event.target.files[0].name.includes('.png') ||
            event.target.files[0].name.includes('.JPEG') ||
            event.target.files[0].name.includes('.pdf') ||
            event.target.files[0].name.includes('.jpeg')
          ) {
            setDocumentList(list);
          } else {
            NotificationManager.error('jpg, png, JPEG, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন');
            return;
          }
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'প্রদর্শনযোগ্য নয়') {
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = event.target.files[0];

          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'সমর্থিত নয়') {
          list[index][name + 'Name'] = 'ফাইল টাইপটি বৈধ নয়';
          setDocumentList(list);
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'ফাইলের ধরন সমর্থিত নয়';
          setDocumentList(list);
        }
      };
      reader.onerror = () => {
        NotificationManager.error('ফাইল পড়া যাচ্ছে না', 'Error', 5000);
      };
    }
  };

  const removeDocumentImageFront = (e, index) => {
    const list = [...documentList];
    list[index]['documentPictureFront'] = '';
    list[index]['documentPictureFrontType'] = '';
    setDocumentList(list);
  };

  const removeDocumentImageBack = (e, index) => {
    const list = [...documentList];
    list[index]['documentPictureBack'] = '';
    list[index]['documentPictureBackType'] = '';
    setDocumentList(list);
  };
  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);

    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
  };

  const handleRemoveMemberArea = async (id, index) => {
    if (id) {
      try {
        await Swal.fire({
          title: 'আপনি কি নিশ্চিত?',
          text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ফিরে যান ।',
          confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(MemberAreaInsert + '/' + id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
              }
            });
          }
        });
      } catch (error) {
        errorHandler(error);
      }
    } else {
      let list = [...memberSelectArea];
      list.splice(index, 1);
      setMemberSelectArea(list);
    }
  };
  const handleAddClicksetWorkingArea = () => {
    const upacity = upacityIdType.split(',');
    setWorkingArea([
      ...workingArea,
      coop.workingAreaType == 1
        ? {
          divisionId: divisionId ? divisionId : '',
          status: 'A',
        }
        : coop.workingAreaType == 2
          ? {
            divisionId: divisionId ? divisionId : '',
            districtId: districtId ? districtId : '',
            status: 'A',
          }
          : coop.workingAreaType == 3
            ? {
              divisionId: divisionId ? divisionId : '',
              districtId: districtId ? districtId : '',
              upaCityId: parseInt(upacity[0]) ? parseInt(upacity[0]) : '',
              upaCityType: upacity[1] ? upacity[1] : '',
              status: 'A',
            }
            : coop.workingAreaType == 4
              ? {
                divisionId: divisionId ? divisionId : '',
                districtId: districtId ? districtId : '',
                upaCityId: parseInt(upacity[0]) ? parseInt(upacity[0]) : '',
                upaCityType: upacity[1] ? upacity[1] : '',
                uniThanaPawId: '',
                uniThanaPawType: '',
                status: 'A',
              }
              : coop.workingAreaType == 5
                ? {
                  divisionId: divisionId ? divisionId : '',
                  districtId: districtId ? districtId : '',
                  upaCityId: parseInt(upacity[0]) ? parseInt(upacity[0]) : '',
                  upaCityType: upacity[1] ? upacity[1] : '',
                  uniThanaPawId: '',
                  uniThanaPawType: '',
                  detailsAddress: '',
                  status: 'A',
                }
                : '',
    ]);
  };
  const handleChangeWorkingArea = async (e, index) => {
    const { name, value } = e.target;
    const list = [...workingArea];
    let upaData, unionData;
    switch (name) {
      case 'divisionId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['divisionIdError'] = list[index][name] == '' ? 'বিভাগ নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'districtId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['districtIdError'] = list[index][name] == '' ? 'জেলা নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'samityUpaCityIdType':
        upaData = JSON.parse(e.target.value);
        list[index]['upaCityId'] = upaData.upaCityId ? upaData.upaCityId : '';
        list[index]['upaCityType'] = upaData.upaCityType ? upaData.upaCityType : '';
        list[index]['upaCityIdError'] = list[index]['upaCityId'] == '' ? 'উপজেলা/সিটি  নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'samityUniThanaPawIdType':
        unionData = JSON.parse(e.target.value);
        list[index]['uniThanaPawId'] = unionData.uniThanaPawId ? unionData.uniThanaPawId : '';
        list[index]['uniThanaPawType'] = unionData.uniThanaPawType ? unionData.uniThanaPawType : '';
        list[index]['uniThanaPawIdError'] =
          list[index]['uniThanaPawId'] == '' && coop.workingAreaType >= 4 ? 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'detailsAddress':
        list[index][name] = value;
        list[index]['detailsAddressError'] =
          list[index]['detailsAddress'] == '' && coop.workingAreaType == 5 ? 'ঠিকানা লিখুন' : '';
        setWorkingArea(list);
        break;
    }
  };

  const setSamityInfoInEditMode = () => {
    if (manualSamity.length > 0) {
      setAppId(manualSamity[0].id);
      setProjectNameBangla(manualSamity[0].data.samityInfo.projectNameBangla);
      setCheckedArea(manualSamity[0].data.samityInfo.isMemberAreaAndWorkingAreaSame);

      setFormationDate(
        manualSamity[0].data.samityInfo.samityFormationDate
          ? new Date(
            manualSamity[0].data.samityInfo.samityFormationDate.substr(6, 4),
            manualSamity[0].data.samityInfo.samityFormationDate.substr(3, 2) - 1,
            manualSamity[0].data.samityInfo.samityFormationDate.substr(0, 2),
          )
          : null,
      );

      setRegDate(
        new Date(
          manualSamity[0].data.samityInfo.samityRegistrationDate.substr(6, 4),
          manualSamity[0].data.samityInfo.samityRegistrationDate.substr(3, 2) - 1,
          manualSamity[0].data.samityInfo.samityRegistrationDate.substr(0, 2),
        ),
      );
      setDivisionId(manualSamity[0].data.samityInfo.samityDivisionId);
      setDistrictId(manualSamity[0].data.samityInfo.samityDistrictId);
      // setUpazilaId(manualSamity[0].data.samityInfo.samityUpaCityId);
      // setUnionId(manualSamity[0].data.samityInfo.samityUniThanaPawId);
      setUpacityIdType(
        `${manualSamity[0].data.samityInfo.samityUpaCityId}` +
        `,` +
        `${manualSamity[0].data.samityInfo.samityUpaCityType}`,
      );
      setUniThanaPawIdType(
        `${manualSamity[0].data.samityInfo.samityUniThanaPawId}` +
        `,` +
        `${manualSamity[0].data.samityInfo.samityUniThanaPawType}`,
      );

      setCoop({
        ...coop,
        samityCode: manualSamity[0].data.samityInfo.oldRegistrationNo,
        samityName: manualSamity[0].data.samityInfo.samityName,
        samityLevel: manualSamity[0].data.samityInfo.samityLevel,
        samityTypeId: manualSamity[0].data.samityInfo.samityTypeId,
        enterprisingOrg: manualSamity[0].data.samityInfo.enterprisingId ?? 'নির্বাচন করুন',
        samityEffectiveness: manualSamity[0].data.samityInfo.samityEffectiveness,

        projectId: {
          id: manualSamity[0].data.samityInfo.projectId,
          nameBangla: manualSamity[0].data.samityInfo.projectNameBangla,
        },
        villageArea: manualSamity[0].data.samityInfo.samityDetailsAddress,
        memberAreaType: manualSamity[0].data.samityInfo.memberAreaType,
        workingAreaType: manualSamity[0].data.samityInfo.workingAreaType,
      });
      const memberAreaArray = [];

      for (const [index, element] of manualSamity[0].data.memberArea.entries()) {
        memberAreaArray[index] = {
          ...(coop.memberAreaType >= 1 ? { divisionId: element.divisionId } : ''),
          ...(coop.memberAreaType >= 1 ? { districtId: element.districtId } : ''),
          ...(coop.memberAreaType >= 2 ? { upaCityId: parseInt(element.upaCityId) } : ''),
          ...(coop.memberAreaType >= 2 ? { upaCityType: element.upaCityType } : ''),
          ...(coop.memberAreaType >= 3 ? { uniThanaPawId: parseInt(element.uniThanaPawId) } : ''),
          ...(coop.memberAreaType >= 3 ? { uniThanaPawType: element.uniThanaPawType } : ''),
          ...(coop.memberAreaType >= 4 ? { detailsAddress: element.detailsAddress } : ''),
          status: 'A',
        };
        setMemberSelectArea(memberAreaArray);
      }
      const workingAreaArray = [];

      for (const [index, element] of manualSamity[0].data.workingArea.entries()) {
        workingAreaArray[index] = {
          ...(coop.workingAreaType >= 1 ? { divisionId: element.divisionId } : ''),
          ...(coop.workingAreaType >= 1 ? { districtId: element.districtId } : ''),
          ...(coop.workingAreaType >= 2 ? { upaCityId: parseInt(element.upaCityId) } : ''),
          ...(coop.workingAreaType >= 2 ? { upaCityType: element.upaCityType } : ''),
          ...(coop.workingAreaType >= 3 ? { uniThanaPawId: parseInt(element.uniThanaPawId) } : ''),
          ...(coop.workingAreaType >= 3 ? { uniThanaPawType: element.uniThanaPawType } : ''),
          ...(coop.workingAreaType >= 4 ? { detailsAddress: element.detailsAddress } : ''),
          status: 'A',
        };

        setWorkingArea(workingAreaArray);
        getSamityData('C', manualSamity[0].data.samityInfo.samityTypeId);
        if (
          manualSamity[0]?.data?.samityInfo?.samityLevel == 'P' &&
          manualSamity[0]?.data?.samityInfo?.samityEffectiveness == 'A'
        ) {
          setCommInfo({
            authorizedPersonName: manualSamity[0].data.memberInfo.memberNameBangla,
            authorizedPersonNid: manualSamity[0].data.memberInfo.nid,
            authorizedPersonmobile: manualSamity[0].data.memberInfo.mobile,
          });
        } else if (
          manualSamity[0]?.data?.samityInfo?.samityLevel == 'C' &&
          manualSamity[0]?.data?.samityInfo?.samityEffectiveness == 'E'
        ) {
          getSamityMemberData(manualSamity[0].data.memberInfo.refSamityId);
          setSamityData({
            ...samityData,
            samityId: manualSamity[0].data.memberInfo.refSamityId,
          });
          setCenNatMemberData({
            ...cenNatMemberData,
            samityId: manualSamity[0]?.data?.memberInfo?.samityId,
            memberId: manualSamity[0]?.data?.memberInfo?.id,
            memberName: manualSamity[0]?.data?.memberInfo?.memberNameBangla,
            nid: manualSamity[0]?.data?.memberInfo?.nid
              ? manualSamity[0]?.data?.memberInfo?.nid
              : manualSamity[0]?.data?.memberInfo?.brn,
            mobile: manualSamity[0].data.memberInfo?.mobile,
          });
        }
        setLevelLock(true);
        let docs = [];
        manualSamity[0].data.documentInfo.forEach((data) => {
          docs.push({
            documentType: parseInt(data.documentId),
            documentNumber: data.documentNo,
            documentPictureFront: data.documentName[0]?.fileNameUrl,
            documentPictureFrontName: data.documentName[0]?.fileName,
            documentPictureFrontType: '',
            documentPictureFrontFile: '',

            documentPictureBack: data.documentName[1]?.fileNameUrl,
            documentPictureBackName: data.documentName[1]?.fileName,
            documentPictureBackType: '',
            documentPictureBackFile: '',
            addDoc: data.documentName[1]?.fileNameUrl ? true : false,
          });
        });
        setDocumentList([...docs]);
      }

      // setOwnOrOthers(manualSamity[0].data.approvalInfo.ownOrOthers);
      dispatch(designationSelected(manualSamity[0]?.nextAppDesignationId));
      dispatch(officeSelected(manualSamity[0].data.approvalInfo.branchId));
      dispatch(
        fetchDesignationNames({
          branchId: manualSamity[0].data.approvalInfo.branchId,
        }),
      );
      manualSamity[0].data.approvalInfo.ownOrOthers === 'others' &&
        dispatch(
          fetchBranchNames({
            value: manualSamity[0].data.approvalInfo.officeOriginUnitId,
            ownAndOthers: manualSamity[0].data.approvalInfo.ownOrOthers,
          }),
        );
      dispatch(originUnitSelected(manualSamity[0].data.approvalInfo.officeOriginUnitId));
      dispatch(ownAndOthersSelected(manualSamity[0].data.approvalInfo.ownOrOthers));
    }
  };

  //////////////////////////// check before form submit ////////////////////
  let checkMandatoryForPostAndUpdate = () => {
    let flag = true;
    let newObj = {};
    // var a = moment(regDate);
    if (coop.samityLevel === '') {
      flag = false;
      newObj.samityLevel = 'সমিতির ধরণ নির্বাচন করুন';
    }
    if (coop.samityName == '') {
      flag = false;
      newObj.samityName = 'সমিতির নাম প্রদান করুন';
    }
    if (coop.samityCode == '') {
      flag = false;
      newObj.samityCode = 'সমিতির মূল নিবন্ধন নাম্বার প্রদান করুন';
    }
    if (regDate === null) {
      flag = false;
      newObj.regDate = 'সমিতি নিবন্ধন তারিখ প্রদান করুন';
    }

    if (coop.samityTypeId === '0' || coop.samityTypeId == '' || coop.samityTypeId == 'নির্বাচন করুন') {
      flag = false;
      newObj.samityTypeId = 'সমিতির ধরণ নির্বাচন করুন';
    }
    if (coop.enterprisingOrg == '' || coop.enterprisingOrg === '0' || coop.samityTypeId == 'নির্বাচন করুন') {
      flag = false;
      newObj.enterprisingOrg = 'উদ্যোগী সংস্থা নির্বাচন করুন';
    }
    if (coop.samityEffectiveness === '') {
      flag = false;
      newObj.samityEffectiveness = 'সমিতির স্টেটাস নির্বাচন করুন';
    }
    if (divisionId == '' || divisionId == 'নির্বাচন করুন') {
      flag = false;
      newObj.divisionId = 'বিভাগ সিলেক্ট করুন';
    }
    if (districtId == '' || districtId == 'নির্বাচন করুন') {
      flag = false;
      newObj.districtId = 'জেলা সিলেক্ট করুন';
    }
    if (upacityIdType == '' || upacityIdType == 'নির্বাচন করুন') {
      flag = false;
      newObj.upacityIdType = 'উপজেলা/সিটি কর্পোরেশন সিলেক্ট করুন';
    }

    if (uniThanaPawIdType == '' || uniThanaPawIdType == 'true' || uniThanaPawIdType === 'নির্বাচন করুন') {
      flag = false;
      newObj.uniThanaPawIdType = 'ইউনিয়ন/পৌরসভা/থানা নির্বাচন করুন';
    }
    if (coop.villageArea == '') {
      flag = false;
      newObj.villageArea = 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন';
    }

    documentList.map((x) => {
      if (x.documentType === '' || x.documentType === 'নির্বাচন করুন') {
        flag = false;
        newObj.documentType = 'ডকুমেন্ট এর ধরন উল্লেখ করুন';
      }
    });

    if (coop.samityLevel == 'P' && coop.samityEffectiveness == 'A') {
      if (!commInfo.authorizedPersonName) {
        flag = false;
        newObj.authorizedPersonName = 'অথরাইজড পারসনের নাম উল্লেখ করুন';
      }
      if (
        !commInfo.authorizedPersonNid ||
        (commInfo.authorizedPersonNid.length !== 10 && commInfo.authorizedPersonNid.length !== 17)
      ) {
        flag = false;
        newObj.authorizedPersonNid = !commInfo.authorizedPersonNid
          ? 'অথরাইজড পারসনের জাতীয় পরিচয়পত্র নাম্বার উল্লেখ করুন'
          : 'জাতীয় পরিচয়পত্র নাম্বার ১০ অথবা ১৩ ডিজিট হলে সামনে জন্মসাল দিয়ে ১৭ ডিজিট অবশ্যই হতে হবে';
      }
    } else if (coop.samityLevel == 'C' && coop.samityEffectiveness == 'A') {
      if (!cenNatMemberData.nid || (cenNatMemberData.nid.length !== 10 && cenNatMemberData.nid.length !== 17)) {
        flag = false;
        newObj.nid = !cenNatMemberData.nid
          ? 'অথরাইজড পারসনের জাতীয় পরিচয়পত্র নাম্বার উল্লেখ করুন'
          : 'জাতীয় পরিচয়পত্র নাম্বার ১০ অথবা ১৩ ডিজিট হলে সামনে জন্মসাল দিয়ে ১৭ ডিজিট অবশ্যই হতে হবে';
      }
      const mobileRegex = RegExp(/(^(01){1}[3456789]{1}(\d){8})$/);
      if (!cenNatMemberData.mobile || !mobileRegex.test(cenNatMemberData.mobile)) {
        flag = false;
        newObj.mobile = !cenNatMemberData.mobile ? 'মোবাইল নাম্বার উল্লেখ করুন' : 'আপনার সঠিক মোবাইল নং প্রদান করুন';
      }
    }

    if (update) {
      if (!desgId) {
        flag = false;
        newObj.designationId = 'কর্মকর্তা ও পদবী উল্লেখ করুন';
      }
    }

    for (const element of documentList) {
      if (!element['documentType']) {
        flag = false;
        newObj.documentType = 'ডকুমেন্ট এর ধরণ নির্বাচন করুন';
      }

      if (!element['documentPictureFront']) {
        flag = false;
        newObj.documentPictureFront = 'ডকুমেন্ট এর ছবি দিন ';
      }
    }

    // const firstArray = [...documentType];

    const secondArray = [...documentList];
    const s2 = secondArray
      .map((elm) => {
        if (elm.documentType === 18) {
          return elm.documentType;
        }
      })
      .filter((elm) => elm !== undefined);
    if (!s2.includes(18)) {
      flag = false;
      newObj.mandatoryDocError = 'সমিতির সার্টিফিকেট সংযুক্ত করুন';
      NotificationManager.error('ডকুমেন্ট অংশে সার্টিফিকেট সংযুক্ত করুন');
    }

    if (!officeId) {
      newObj.officeError = 'দপ্তর/অফিস নির্বাচন করুন';
      flag = false;
    }

    if (!originUnitId) {
      flag = false;
      newObj.originUnitError = 'অফিসের ধরণ নির্বাচন করুন';
    }
    if (!desgId) {
      newObj.designationError = 'কর্মকর্তা ও পদবি নির্বাচন করুন';

      flag = false;
    }

    setTimeout(() => {
      setFormErrors(newObj);
    }, 1);

    return flag;
  };
  const areaValidation = (data, type, addressType) => {
    let isDataObjValid = false;
    if (addressType == 'working' && checkedArea) {
      isDataObjValid = false;
    } else {
      for (const element of data) {
        if (type == 1) {
          // বিভাগ
          element.upaCityId = '';
          element.upaCityType = '';
          element.uniThanaPawId = '';
          element.uniThanaPawType = '';
          element.detailsAddress = '';
          element.districtIdError = '';
          element.upaCityIdError = '';
          element.uniThanaPawIdError = '';
          element.detailsAddressError = '';
          if (!element.divisionId) {
            element.divisionIdError = 'বিভাগ নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 2) {
          // জেলা
          element.divisionId = officeGeoCode?.divisionId;
          element.uniThanaPawId = '';
          element.uniThanaPawType = '';
          element.detailsAddress = '';
          element.upaCityIdError = '';
          element.uniThanaPawIdError = '';
          element.detailsAddressError = '';

          if (!element.districtId) {
            element.districtIdError = 'জেলা নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 3) {
          // উপজেলা
          element.divisionId = officeGeoCode?.divisionId;
          element.districtId = officeGeoCode?.districtId;
          element.detailsAddress = '';
          element.uniThanaPawIdError = '';
          element.detailsAddressError = '';

          if (!element.upaCityId) {
            element.upaCityIdError = 'উপজেলা/সিটি  নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 4) {
          // ইউনিয়ন
          element.divisionId = officeGeoCode?.divisionId;
          element.districtId = officeGeoCode?.districtId;
          element.upaCityId = officeGeoCode?.upazilaId;
          element.upaCityType = officeGeoCode?.upaCityType;
          element.detailsAddressError = '';

          if (!element.uniThanaPawId) {
            element.uniThanaPawIdError = 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 5) {
          // ঠিকানা
          // const samityUniThanaPaw = uniThanaPawIdType.split(',');
          element.divisionId = officeGeoCode?.divisionId;
          element.districtId = officeGeoCode?.districtId;
          element.upaCityId = officeGeoCode?.upazilaId;
          element.upaCityType = officeGeoCode?.upaCityType;
          // element.uniThanaPawId = samityUniThanaPaw[0]
          // element.uniThanaPawType = samityUniThanaPaw[1]

          if (!element.uniThanaPawId) {
            element.uniThanaPawIdError = 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন';
            isDataObjValid = true;
          }
          if (!element.detailsAddress) {
            element.detailsAddressError = 'ঠিকানা লিখুন';
            isDataObjValid = true;
          }
        }
      }
    }
    return isDataObjValid;
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    let mandatory = checkMandatoryForPostAndUpdate();
    if (
      mandatory &&
      areaValidation(memberSelectArea, coop.memberAreaType, 'member') == false &&
      areaValidation(workingArea, coop.workingAreaType, 'working') == false
    ) {
      let RegistrationData;
      for (const [index, element] of memberSelectArea.entries()) {
        memberSelectArea[index] = {
          ...(element.divisionId && { divisionId: element.divisionId }),
          ...(element.districtId && { districtId: element.districtId }),
          ...(element.upaCityId && { upaCityId: element.upaCityId }),
          ...(element.upaCityType && { upaCityType: element.upaCityType }),
          ...(element.uniThanaPawId && {
            uniThanaPawId: element.uniThanaPawId,
          }),
          ...(element.uniThanaPawType && {
            uniThanaPawType: element.uniThanaPawType,
          }),
          ...(element.detailsAddress && {
            detailsAddress: element.detailsAddress,
          }),
          status: 'A',
        };
      }
      for (const [index, element] of workingArea.entries()) {
        workingArea[index] = {
          ...(element.divisionId && { divisionId: element.divisionId }),
          ...(element.districtId && { districtId: element.districtId }),
          ...(element.upaCityId && { upaCityId: element.upaCityId }),
          ...(element.upaCityType && { upaCityType: element.upaCityType }),
          ...(element.uniThanaPawId && {
            uniThanaPawId: element.uniThanaPawId,
          }),
          ...(element.uniThanaPawType && {
            uniThanaPawType: element.uniThanaPawType,
          }),
          ...(element.detailsAddress && {
            detailsAddress: element.detailsAddress,
          }),
          status: 'A',
        };
      }
      let docList = new Array();
      documentList.map((docInfo) => {
        docInfo.documentPictureFrontFile.split;
        docList.push({
          documentId: docInfo.documentType,
          documentNo: docInfo.documentNumber,
          documentName: [
            {
              name: docInfo.documentPictureFrontFile.name
                ? docInfo.documentPictureFrontFile.name
                : docInfo.documentPictureFrontName,
              mimeType: docInfo.documentPictureFrontType,
              base64Image: docInfo.documentPictureFront,
            },
          ],
        });
      });

      const samityUniThanaPaw = uniThanaPawIdType.split(',');
      setLoadingDataSaveUpdate(true);
      let payload2 = {
        serviceName: 'samity_migration',
        nextAppDesignationId: desgId,
        data: {
          samityInfo: {
            samityName: coop.samityName,
            samityLevel: coop.samityLevel,
            samityEffectiveness: coop.samityEffectiveness,
            samityDivisionId: parseInt(officeGeoCode?.divisionId),
            samityDistrictId: parseInt(officeGeoCode?.districtId),
            samityUpaCityId: parseInt(officeGeoCode?.upazilaId),
            samityUpaCityType: officeGeoCode?.upaCityType,
            samityUniThanaPawId: samityUniThanaPaw[0],
            samityUniThanaPawType: samityUniThanaPaw[1],
            samityDetailsAddress: coop.villageArea,
            enterprisingId:
              !coop.enterprisingOrg || coop.enterprisingOrg === 'নির্বাচন করুন' ? null : parseInt(coop.enterprisingOrg),
            samityTypeId: parseInt(coop.samityTypeId),
            samityFormationDate: formationdDate ? dateFormat(formationdDate) : null,
            oldRegistrationNo: coop.samityCode,
            samityRegistrationDate: dateFormat(regDate), //moment(regDate).format("DD/MM/YYYY"),
            purpose: 'Office',
            memberAreaType: coop.memberAreaType,
            workingAreaType: coop.workingAreaType,
            ...(coop.projectId && { projectId: coop.projectId.id }),
            ...(coop.projectId && projectNameBangla && { projectNameBangla: projectNameBangla }),
            declaration: coop.declaration,
            isMemberAreaAndWorkingAreaSame: checkedArea,
          },
          memberInfo:
            coop.samityLevel == 'P'
              ? {
                memberNameBangla: commInfo.authorizedPersonName,
                nid: bangToEng(commInfo.authorizedPersonNid),
                mobile: bangToEng(commInfo.authorizedPersonmobile),
                isAuthorizer: true,
              }
              : {
                id: cenNatMemberData.memberId,
                nid: bangToEng(cenNatMemberData.nid ? cenNatMemberData.nid : cenNatMemberData.brn),
                mobile: bangToEng(cenNatMemberData.mobile),
                isAuthorizer: true,
                refSamityId: samityData.samityId,
                memberNameBangla: cenNatMemberData.memberName,
              },
          memberArea: memberSelectArea,
          workingArea: checkedArea ? memberSelectArea : workingArea,
          documentInfo: buildDocumentPayload(documentList),
          approvalInfo: {
            officeOriginUnitId: originUnitId,
            branchId: officeId,
            ownOrOthers: ownOther,
          },
        },
      };

      if (coop.samityLevel == 'N' || coop.samityEffectiveness !== 'A') {
        delete payload2.data.memberInfo;
      }

      try {
        let migrationData;
        if (update) {
          migrationData = await axios.put(SamityMigration + samityId, payload2, config);
        } else {
          RegistrationData = await axios.post(CoopRegSubmitApi, payload2, config);
        }

        NotificationManager.success(update ? migrationData.data.message : RegistrationData.data.message, '', 5000);
        clearState();
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      NotificationManager.warning('বাধ্যতামূলক তথ্য পূরণ করুন', '', 5000);
    }
  };

  return (
    <>
      <Grid container spacing={2.5} className="section">
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <FormControl component="fieldset" fullWidth disabled={levelLock}>
            <RadioGroup
              row
              aria-label="pcn"
              name="samityLevel"
              onChange={handleChange}
              defaultValue="P"
              value={coop.samityLevel}
            >
              <FormControlLabel
                value="P"
                sx={{ color: '#007bff' }}
                control={<Radio color="primary" />}
                label="প্রাথমিক"
              />
              <FormControlLabel
                sx={{ color: '#ed6c02' }}
                value="C"
                control={<Radio color="warning" />}
                label="কেন্দ্রীয়"
              />
              <FormControlLabel sx={{ color: '#28a745' }} value="N" control={<Radio color="success" />} label="জাতীয়" />
            </RadioGroup>
          </FormControl>
          {!coop.samityLevel && <span style={{ color: 'red' }}>{formErrors.samityLevel}</span>}
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('সমিতির নাম')}
            name="samityName"
            onChange={handleChange}
            value={coop.samityName}
            variant="outlined"
            size="small"
            error={formErrors.samityName ? true : false}
            helperText={formErrors.samityName}
          ></TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
            <DatePicker
              label="সমিতি গঠনের তারিখ"
              inputFormat="dd-MM-yyyy"
              value={formationdDate}
              onChange={handleFormationDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" sx={{ width: '100%', backgroundColor: '#FFF' }} />
              )}
              disableFuture={true}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
            <DatePicker
              label={RequiredFile('সমিতি নিবন্ধনের তারিখ')}
              inputFormat="dd-MM-yyyy"
              value={regDate}
              onChange={handleRegDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  error={!regDate && formErrors.regDate ? true : false}
                  helperText={!regDate && formErrors.regDate}
                />
              )}
              disableFuture={true}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('সমিতির মূল নিবন্ধন নম্বর')}
            name="samityCode"
            onChange={handleChange}
            value={coop.samityCode}
            variant="outlined"
            size="small"
            type="text"
            error={formErrors.samityCode ? true : false}
            helperText={formErrors.samityCode}
          ></TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('সমিতির ধরন')}
            name="samityTypeId"
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            value={coop.samityTypeId || 0}
            variant="outlined"
            size="small"
            error={(!coop.samityTypeId || coop.samityTypeId === '0') && formErrors.samityTypeId ? true : false}
            helperText={!coop.samityTypeId && formErrors.samityTypeId}
          >
            <option value={0}>- নির্বাচন করুন -</option>
            {samityType.map((option) => (
              <option key={option.id} value={parseInt(option.id)}>
                {option.typeName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('উদ্দ্যেগী সংস্থার নাম')}
            name="enterprisingOrg"
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            value={coop.enterprisingOrg || 0}
            variant="outlined"
            size="small"
            error={
              !coop.enterprisingOrg && formErrors.enterprisingOrg
                ? true
                : coop.enterprisingOrg === '0' && formErrors.enterprisingOrg
                  ? true
                  : false
            }
            helperText={!coop.enterprisingOrg && formErrors.enterprisingOrg}
          >
            <option value={0}>- নির্বাচন করুন -</option>
            {enterprisingOrg.map((option) => {
              return (
                <option key={option.id} value={option.id}>
                  {option.orgNameBangla}
                </option>
              );
            })}
          </TextField>
        </Grid>
        {projects.length > 0 && (
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              fullWidth
              label="প্রকল্পের নাম"
              name="projectId"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={JSON.stringify(coop.projectId) || 0}
              variant="outlined"
              size="small"
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {projects.map((option) => {
                return (
                  <option
                    key={option.id}
                    value={JSON.stringify({
                      id: option.id,
                      nameBangla: option.projectNameBangla,
                    })}
                  >
                    {option.projectNameBangla}
                  </option>
                );
              })}
            </TextField>
          </Grid>
        )}
        {inputRadioGroup(
          'samityEffectiveness',
          handleChange,
          coop.samityEffectiveness,
          [
            {
              value: 'A',
              color: '#007bff',
              rcolor: 'primary',
              label: 'কার্যকর',
            },
            {
              value: 'E',
              color: '#ed6c02',
              rColor: 'warning',
              label: 'অকার্যকর',
            },
            {
              value: 'I',
              color: '#28a745',
              rColor: 'success',
              label: 'অবসায়নে ন্যাস্ত',
            },
          ],
          4,
          6,
          12,
          12,
          false,
        )}
        {!coop.samityEffectiveness && <span style={{ color: 'red' }}>{formErrors.samityEffectiveness}</span>}
      </Grid>

      <Grid container className="section">
        <SubHeading>সমিতির কার্যালয়ের ঠিকানা</SubHeading>

        <Grid container spacing={2.5}>
          {ZoneContext.fields.map((form, i) => {
            var obj = Object.assign(
              {},
              { ...form },
              { value: giveValueToTextField(i) },
              { onChange: handleChangeForZone },
              {
                division_id: divisionId ? divisionId : 'নির্বাচন করুন',
              },
              {
                district_Id: districtId ? districtId : 'নির্বাচন করুন',
              },
              {
                upa_city_Id_Type: upacityIdType,
              },
              {
                uni_thana_paw_Id_Type: uniThanaPawIdType ? uniThanaPawIdType : 'নির্বাচন করুন',
              },
              { formErrors: formErrors },
              { disabled: true },
              { key: i },
            );

            return (
              <>
                <ZoneComponent {...obj} />
              </>
            );
          })}

          <Grid item lg={12} md={12} xs={12}>
            <TextField
              fullWidth
              name="villageArea"
              variant="outlined"
              size="small"
              value={coop.villageArea}
              label={RequiredFile('বিস্তারিত তথ্য-হোল্ডিং নং, রাস্তা নং, গ্রাম/পাড়া/মহল্লা, ডাকঘর লিখুন')}
              onChange={handleChange}
              error={!coop.villageArea && formErrors.villageArea ? true : false}
              helperText={!coop.villageArea ? formErrors.villageArea : ''}
            ></TextField>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>সদস্য নির্বাচনী এলাকা ও কর্ম এলাকা</SubHeading>

        <Grid container spacing={2.5}>
          {/* //////////////////////////////////////////  সদস্য নির্বাচনী এলাকা ///////////////////////////////////////// */}
          <Grid item md={12} xs={12} sm={12}>
            <Grid container flexDirection={'column'}>
              <Typography
                sx={{
                  textDecoration: 'underline',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '.5rem 3rem .5rem .5rem',
                }}
              >
                সদস্য নির্বাচনী এলাকা :{' '}
              </Typography>
              <FromControlJSON
                arr={[
                  {
                    labelName: '',
                    name: 'memberAreaType',
                    onChange: handleChange,
                    value: coop.memberAreaType,
                    size: 'small',
                    type: 'text',
                    viewType: 'select',
                    optionData: area,
                    optionValue: 'value',
                    optionName: 'label',
                    xl: 4,
                    lg: 4,
                    md: 4,
                    xs: 12,
                    isDisabled: false,
                    customClass: '',
                    customStyle: {},
                    selectDisable: true,
                  },
                ]}
              />
            </Grid>
            {/* ///////////////////////////// Start Member area ////////////////////////////////// */}
            {memberSelectArea.map((row, i) => (
              <Grid container spacing={1.6} pt={2} key={i}>
                {coop.memberAreaType >= 1 ? (
                  <GetGeoData
                    {...{
                      labelName: RequiredFile('বিভাগ'),
                      name: 'divisionId',
                      caseCadingName: 'division',
                      onChange: (e) => handleChangeMemberArea(e, i),
                      value: row.divisionId,
                      isCasCading: true,
                      xl:
                        coop.memberAreaType == 1
                          ? 5
                          : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                              ? 2.5
                              : 2,
                      lg:
                        coop.memberAreaType == 1
                          ? 5
                          : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                              ? 2.5
                              : 2,
                      md:
                        coop.memberAreaType == 1
                          ? 5
                          : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                              ? 2.5
                              : 2,
                      xs: 12,
                      isDisabled: coop.memberAreaType == 1 ? false : true,
                      customClass: '',
                      customStyle: {},
                      errorMessage: row.divisionIdError,
                    }}
                  />
                ) : (
                  ''
                )}
                {coop.memberAreaType >= 1 ? (
                  <GetGeoData
                    {...{
                      labelName: coop.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                      name: 'districtId',
                      caseCadingName: 'district',
                      onChange: (e) => handleChangeMemberArea(e, i),
                      value: row.districtId,
                      isCasCading: true,
                      casCadingValue: row.divisionId,
                      xl:
                        coop.memberAreaType == 1
                          ? 6
                          : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                              ? 2.5
                              : 2,
                      lg:
                        coop.memberAreaType == 1
                          ? 6
                          : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                              ? 2.5
                              : 2,
                      md:
                        coop.memberAreaType == 1
                          ? 6
                          : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                              ? 2.5
                              : 2,
                      xs: 12,
                      isDisabled: coop.memberAreaType == 1 || coop.memberAreaType == 2 ? false : true,
                      customClass: '',
                      errorMessage: row.districtIdError,
                    }}
                  />
                ) : (
                  ''
                )}
                {coop.memberAreaType >= 2 ? (
                  <GetGeoData
                    {...{
                      labelName: coop.memberAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                      name: 'samityUpaCityIdType',
                      caseCadingName: 'upazila',
                      onChange: (e) => handleChangeMemberArea(e, i),
                      isCasCading: true,
                      casCadingValue: row.districtId,
                      showMuiltiple: JSON.stringify({
                        upaCityId: row.upaCityId,
                        upaCityType: row.upaCityType,
                      }),
                      xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                      lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                      md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                      xs: 12,
                      isDisabled: coop.memberAreaType == 2 || coop.memberAreaType == 3 ? false : true,
                      customClass: '',
                      errorMessage: row.upaCityIdError,
                    }}
                  />
                ) : (
                  ''
                )}
                {coop.memberAreaType >= 3 ? (
                  <GetGeoData
                    {...{
                      labelName: coop.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                      name: 'samityUniThanaPawIdType',
                      caseCadingName: 'union',
                      onChange: (e) => handleChangeMemberArea(e, i),
                      value: row.districtId,
                      isCasCading: true,
                      casCadingValue: {
                        upaCityId: row.upaCityId,
                        upaCityType: row.upaCityType,
                      },
                      showMuiltiple: JSON.stringify({
                        uniThanaPawId: row.uniThanaPawId,
                        uniThanaPawType: row.uniThanaPawType,
                      }),
                      casCadingValueDis: row.districtId,
                      xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                      lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                      md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                      xs: 12,
                      isDisabled: false,
                      customClass: '',
                      errorMessage: row.uniThanaPawIdError,
                    }}
                  />
                ) : (
                  ''
                )}
                {coop.memberAreaType >= 4 ? (
                  <FromControlJSON
                    arr={[
                      {
                        labelName: coop.memberAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                        name: 'detailsAddress',
                        onChange: (e) => handleChangeMemberArea(e, i),
                        value: row.detailsAddress,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 3,
                        lg: 3,
                        md: 3,
                        xs: 12,
                        isDisabled: false,
                        placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: row.detailsAddressError,
                      },
                    ]}
                  />
                ) : (
                  ''
                )}

                <Grid
                  item
                  sx={{
                    display: 'flex',
                    jusityContent: 'flex-end',
                    alignItems: 'flex-start',
                  }}
                >
                  <Button
                    variant="outlined"
                    disabled={memberSelectArea.length > 1 ? false : true}
                    color="error"
                    onClick={() => handleRemoveMemberArea(row.id, i)}
                    size="small"
                    className="btn-close"
                  >
                    <Clear />
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Box mt={3}>
              <Button
                className="btn btn-add"
                onClick={handleAddClicksetMemberSelectArea}
                size="small"
                variant="contained"
                endIcon={<Add />}
              >
                একাধিক সদস্য নির্বাচনী এলাকা সংযুক্ত করুন
              </Button>
            </Box>
            {/* //////////////////////////////End Member area //////////////////////////////////// */}
          </Grid>
          {/* ////////////////////////////////////////// //কর্ম এলাকা    //////////////////////////////////////////////*/}
          <Grid item md={12} xs={12} sm={12}>
            <Grid container flexDirection={'column'}>
              <div style={{ display: 'flex' }}>
                <Typography
                  sx={{
                    textDecoration: 'underline',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '.5rem',
                  }}
                >
                  কর্ম এলাকা :{' '}
                </Typography>
                <span>
                  <FormControlLabel
                    control={<Checkbox />}
                    checked={checkedArea}
                    name="onChecked"
                    label="সদস্য নির্বাচনী এলাকা একই"
                    onChange={handleChangeMemberAndWorkingArea}
                  />
                </span>
              </div>
              {checkedArea ? (
                ''
              ) : (
                <FromControlJSON
                  arr={[
                    {
                      labelName: '',
                      name: 'workingAreaType',
                      onChange: handleChange,
                      value: coop.workingAreaType,
                      size: 'small',
                      type: 'text',
                      viewType: 'select',
                      optionData: area,
                      optionValue: 'value',
                      optionName: 'label',
                      xl: 4,
                      lg: 4,
                      md: 4,
                      xs: 12,
                      isDisabled: false,
                      customClass: '',
                      customStyle: {},
                      selectDisable: true,
                    },
                  ]}
                />
              )}
            </Grid>

            {/* //////////////////////// start working area /////////////////// */}
            {checkedArea
              ? memberSelectArea.map((row, i) => (
                <Grid container spacing={1.6} pt={2} key={i}>
                  {coop.memberAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: RequiredFile('বিভাগ'),
                        name: 'divisionId',
                        caseCadingName: 'division',
                        value: row.divisionId,
                        isCasCading: true,
                        xl:
                          coop.memberAreaType == 1
                            ? 5
                            : coop.memberAreaType == 2
                              ? 3.5
                              : coop.memberAreaType == 3
                                ? 2.5
                                : 2,
                        lg:
                          coop.memberAreaType == 1
                            ? 5
                            : coop.memberAreaType == 2
                              ? 3.5
                              : coop.memberAreaType == 3
                                ? 2.5
                                : 2,
                        md:
                          coop.memberAreaType == 1
                            ? 5
                            : coop.memberAreaType == 2
                              ? 3.5
                              : coop.memberAreaType == 3
                                ? 2.5
                                : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        customStyle: {},
                        errorMessage: row.divisionIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                        name: 'districtId',
                        caseCadingName: 'district',
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: row.divisionId,
                        xl:
                          coop.memberAreaType == 1
                            ? 6
                            : coop.memberAreaType == 2
                              ? 3.5
                              : coop.memberAreaType == 3
                                ? 2.5
                                : 2,
                        lg:
                          coop.memberAreaType == 1
                            ? 6
                            : coop.memberAreaType == 2
                              ? 3.5
                              : coop.memberAreaType == 3
                                ? 2.5
                                : 2,
                        md:
                          coop.memberAreaType == 1
                            ? 6
                            : coop.memberAreaType == 2
                              ? 3.5
                              : coop.memberAreaType == 3
                                ? 2.5
                                : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        errorMessage: row.districtIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 2 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.memberAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                        name: 'samityUpaCityIdType',
                        caseCadingName: 'upazila',
                        isCasCading: true,
                        casCadingValue: row.districtId,
                        showMuiltiple: JSON.stringify({
                          upaCityId: row.upaCityId,
                          upaCityType: row.upaCityType,
                        }),
                        xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        errorMessage: row.upaCityIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 3 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                        name: 'samityUniThanaPawIdType',
                        caseCadingName: 'union',
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: {
                          upaCityId: row.upaCityId,
                          upaCityType: row.upaCityType,
                        },
                        showMuiltiple: JSON.stringify({
                          uniThanaPawId: row.uniThanaPawId,
                          uniThanaPawType: row.uniThanaPawType,
                        }),
                        casCadingValueDis: row.districtId,
                        xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        errorMessage: row.uniThanaPawIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 4 ? (
                    <FromControlJSON
                      arr={[
                        {
                          labelName: coop.memberAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                          name: 'detailsAddress',
                          value: row.detailsAddress,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          isDisabled: true,
                          placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                          customClass: '',
                          customStyle: {},
                          errorMessage: row.detailsAddressError,
                        },
                      ]}
                    />
                  ) : (
                    ''
                  )}

                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      jusityContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Button
                      variant="outlined"
                      disabled={true}
                      color="error"
                      onClick={() => handleRemoveMemberArea(row.id, i)}
                      size="small"
                      className="btn-close"
                    >
                      <Clear />
                    </Button>
                  </Grid>
                </Grid>
              ))
              : workingArea.map((row, i) => (
                <Grid container spacing={1.6} pt={2} key={i}>
                  {coop.workingAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: RequiredFile('বিভাগ'),
                        name: 'divisionId',
                        caseCadingName: 'division',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        value: row.divisionId,
                        isCasCading: true,
                        xl:
                          coop.workingAreaType == 1
                            ? 5
                            : coop.workingAreaType == 2
                              ? 3.5
                              : coop.workingAreaType == 3
                                ? 2.5
                                : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 5
                            : coop.workingAreaType == 2
                              ? 3.5
                              : coop.workingAreaType == 3
                                ? 2.5
                                : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 5
                            : coop.workingAreaType == 2
                              ? 3.5
                              : coop.workingAreaType == 3
                                ? 2.5
                                : 2,
                        xs: 12,
                        isDisabled: coop.workingAreaType == 1 ? false : true,
                        customClass: '',
                        customStyle: {},
                        errorMessage: row.divisionIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.workingAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                        name: 'districtId',
                        caseCadingName: 'district',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: row.divisionId,
                        xl:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 3.5
                              : coop.workingAreaType == 3
                                ? 2.5
                                : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 3.5
                              : coop.workingAreaType == 3
                                ? 2.5
                                : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 3.5
                              : coop.workingAreaType == 3
                                ? 2.5
                                : 2,
                        xs: 12,
                        isDisabled: coop.workingAreaType == 1 || coop.workingAreaType == 2 ? false : true,
                        customClass: '',
                        errorMessage: row.districtIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 2 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.workingAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                        name: 'samityUpaCityIdType',
                        caseCadingName: 'upazila',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        isCasCading: true,
                        casCadingValue: row.districtId,
                        showMuiltiple: JSON.stringify({
                          upaCityId: row.upaCityId,
                          upaCityType: row.upaCityType,
                        }),
                        xl:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 4
                              : coop.workingAreaType == 3
                                ? 3
                                : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 4
                              : coop.workingAreaType == 3
                                ? 3
                                : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 4
                              : coop.workingAreaType == 3
                                ? 3
                                : 2,
                        xs: 12,
                        isDisabled: coop.workingAreaType == 2 || coop.workingAreaType == 3 ? false : true,
                        customClass: '',
                        errorMessage: row.upaCityIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 3 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.workingAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                        name: 'samityUniThanaPawIdType',
                        caseCadingName: 'union',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: {
                          upaCityId: row.upaCityId,
                          upaCityType: row.upaCityType,
                        },
                        showMuiltiple: JSON.stringify({
                          uniThanaPawId: row.uniThanaPawId,
                          uniThanaPawType: row.uniThanaPawType,
                        }),
                        casCadingValueDis: row.districtId,
                        xl:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 4
                              : coop.workingAreaType == 3
                                ? 3
                                : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 4
                              : coop.workingAreaType == 3
                                ? 3
                                : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                              ? 4
                              : coop.workingAreaType == 3
                                ? 3
                                : 2,
                        xs: 12,
                        isDisabled: false,
                        customClass: '',
                        errorMessage: row.uniThanaPawIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 4 ? (
                    <FromControlJSON
                      arr={[
                        {
                          labelName: coop.workingAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                          name: 'detailsAddress',
                          onChange: (e) => handleChangeWorkingArea(e, i),
                          value: row.detailsAddress,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          isDisabled: false,
                          placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                          customClass: '',
                          customStyle: {},
                          errorMessage: row.detailsAddressError,
                        },
                      ]}
                    />
                  ) : (
                    ''
                  )}
                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      jusityContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Button
                      variant="outlined"
                      disabled={workingArea.length > 1 ? false : true}
                      color="error"
                      onClick={() => handleRemoveWorkingArea(row.id, i)}
                      size="small"
                      className="btn-close"
                    >
                      <Clear />
                    </Button>
                  </Grid>
                </Grid>
              ))}
            {/* ////////////////////////////// End working area ///////////// */}
            <Box mt={3}>
              {checkedArea ? (
                ''
              ) : (
                <Button
                  className="btn btn-add"
                  onClick={handleAddClicksetWorkingArea}
                  size="small"
                  variant="contained"
                  endIcon={<Add />}
                >
                  একাধিক কর্ম এলাকা সংযুক্ত করুন
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
      
      <Grid container className="section">
        {coop.samityLevel == 'C' && coop.samityEffectiveness == 'A' ? (
          <>
            <SubHeading>অথরাইজড / অনুমোদিত ব্যক্তি</SubHeading>
            <Grid container spacing={2.5} pt={2}>
              <Grid item md={3} lg={3} xl={3} xs={12}>
                <TextField
                  fullWidth
                  label="প্রাথমিক সমিতির নাম"
                  name="samityName"
                  onChange={handleChangeSamity}
                  select
                  SelectProps={{ native: true }}
                  value={samityData.samityId || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  {allSamityData.map((option, i) => (
                    <option key={i} value={option.id}>
                      {option.samityName}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={3} lg={3} xl={3} xs={12}>
                <TextField
                  fullWidth
                  label="অথরাইজড / অনুমোদিত ব্যক্তি (সদস্য)"
                  name="newAuth"
                  onChange={handleChangeSamityData}
                  select
                  SelectProps={{ native: true }}
                  value={cenNatMemberData.memberId || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  {memberData?.map((option, i) => (
                    <>
                      <option key={i} value={option.memberBasicInfo.id}>
                        {option.memberBasicInfo.samitySignatoryPerson
                          ? option.memberBasicInfo.samitySignatoryPerson
                          : option.memberBasicInfo.memberNameBangla}
                      </option>
                    </>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label={cenNatMemberData.nid ? RequiredFile('জাতীয় পরিচয়পত্র') : RequiredFile('জন্ম নিবন্ধন নম্বর')}
                  placeholder="উদাহরন- ২৩৫*******"
                  name="nid"
                  value={engToBang('' + cenNatMemberData.nid || cenNatMemberData.brn || '' + '')}
                  variant="outlined"
                  size="small"
                  SelectProps={{ native: true }}
                ></TextField>
              </Grid>

              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('মোবাইল নম্বর')}
                  placeholder="উদাহরন- ০১৮২৯-******"
                  name="mobile"
                  TextField
                  value={engToBang('' + cenNatMemberData.mobile || '' + '')}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
            </Grid>
          </>
        ) : coop.samityLevel == 'P' && coop.samityEffectiveness == 'A' ? (
          <>
            <SubHeading>অথরাইজড / অনুমোদিত ব্যক্তি</SubHeading>
            <Grid container spacing={2.5}>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('অথরাইজড / অনুমোদিত ব্যক্তির নাম (বাংলায়)')}
                  name="authorizedPersonName"
                  value={commInfo.authorizedPersonName}
                  onChange={handleChangeForAuthorizedPerson}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                  error={!commInfo.authorizedPersonName && formErrors.authorizedPersonName ? true : false}
                  helperText={formErrors.authorizedPersonName ? formErrors.authorizedPersonName : ''}
                ></TextField>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('জাতীয় পরিচয়পত্র')}
                  placeholder="উদাহরন- ২৩৫*******"
                  name="authorizedPersonNid"
                  id="numberWithPercent"
                  value={engToBang('' + commInfo.authorizedPersonNid + '')}
                  onChange={handleChangeForAuthorizedPerson}
                  variant="outlined"
                  size="small"
                  SelectProps={{ native: true }}
                  error={formErrors.authorizedPersonNid ? true : false}
                  helperText={formErrors.authorizedPersonNid ? formErrors.authorizedPersonNid : ''}
                ></TextField>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('মোবাইল নম্বর')}
                  placeholder="উদাহরন- ০১৮২৯-******"
                  name="authorizedPersonmobile"
                  onChange={handleChangeForAuthorizedPerson}
                  TextField
                  value={engToBang('' + commInfo.authorizedPersonmobile || '' + '')}
                  variant="outlined"
                  size="small"
                  error={formErrors.authorizedPersonmobile ? true : false}
                  helperText={formErrors.authorizedPersonmobile ? formErrors.authorizedPersonmobile : ''}
                ></TextField>
              </Grid>
            </Grid>
          </>
        ) : (
          ''
        )}
      </Grid>

      <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
      <DynamicDocSectionContent
        documentList={documentList}
        documentType={documentType}
        imageValidation={imageValidation}
        handleDocumentList={handleDocumentList}
        addMoreDoc={addMoreDoc}
        fileSelectedHandler={fileSelectedHandler}
        deleteDocumentList={deleteDocumentList}
        formErrorsInDocuments={formErrorsInDocuments}
        formErrors={formErrors}
        removeDocumentImageFront={removeDocumentImageFront}
        removeDocumentImageBack={removeDocumentImageBack}
      />
      <span style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>{formErrors.docError}</span>

      {appId && appId > 0 ? (
        ''
      ) : (
        <>
          <SubHeading>পর্যবেক্ষক বা অনুমোদনকারী</SubHeading>
          <RefactoredToOfficeSelectItem formErrors={formErrors} />
        </>
      )}

      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            {update ? 'হালনাগাদ হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
          </LoadingButton>
        ) : (
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
          </Button>
        )}
      </Grid>
    </>
  );
};

export default ManualSamity;
