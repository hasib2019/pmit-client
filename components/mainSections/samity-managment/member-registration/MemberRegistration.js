/* eslint-disable no-misleading-character-class */
/* eslint-disable no-useless-escape */
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
//For using the date picker
import { Box, CardMedia, Grid, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
//For using radiobutton
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import LocalizationProvider from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
//For using Notification Manager
import { NotificationManager } from 'react-notifications';
import {
  approvedMemberCreate,
  bankInfoRoute,
  codeMaster,
  committeeRole,
  documentListRoute,
  loanProject,
  memberCreate,
  permissionRoute,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import fileCheck from '../../loan-management/loan-application/sanction/FileUploadTypeCheck';
import { documentChecking } from '../../loan-management/loan-application/sanction/validator';
import star from '../../loan-management/loan-application/utils';
import NomineeSection from './NomineeInfo';
import ZoneComponent from './ZoneComponent';
import ZoneJson from './ZoneComponent.json';

import { Delete } from '@mui/icons-material';
import moment from 'moment';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang, myValidate } from './validator';

const Input = styled('input')({
  display: 'none',
});
const DynamicDocSectionHeader = dynamic(() =>
  import('../../loan-management/loan-application/sanction/DocSectionHeader'),
);
const DynamicDocSectionContent = dynamic(() =>
  import('../../loan-management/loan-application/sanction/DocSectionContent'),
);
const emailRegex = RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
// const mobileRegex = RegExp(/(^(01){1}[3456789]{1}(\d){8})$/);
// const mobileRegexBang = RegExp(/(^(০১){1}[৩৪৫৬৭৮৯]{8})$/);
// const regex = /[০-৯]$/
const MemberRegistration = ({
  closeNewMember,
  samityLevel,
  applicationId,
  approvedSamityId,
  projectId,
  approvedApplicationId,
  samityMemberType,
  samityType,
  nomineeStatus,
}) => {
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const doptorId = getTokenData?.doptorId;
  const config = localStorageData('config');
  const compoName = localStorageData('componentName');
  let memReg;
  //state defined for saving the input field of document category
  const [value, setValue] = useState(null);

  // const [allsamityName, setAllSamityName] = useState([]);
  const [religionList, setReligionList] = useState([]);
  const [marriageList, setMarriageList] = useState([]);
  // const [educationList, setEducationList] = useState([]);
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const [nomineeDocTypeList, setNomineeDocTypeList] = useState([]);
  const [classTypeList, setClassTypeList] = useState([]);
  const [occupationList, setOccupationList] = useState([]);
  const [guardianRelationList, setGuardianRelationList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [guardianOccupationList, setGuardianOccupationList] = useState([]);
  const [samityTypeValue, setSamityTypeValue] = useState('');
  const [fieldHideShowObj, setFieldHideShowObj] = useState({});
  const [labelObj, setLabelObj] = useState({});
  // const [labelForSamity, setLabelForSamity] = useState('সমিতির নাম');
  const [passBookFee, setPassBookFee] = useState('');
  const [admissionFee, setAdmissionFee] = useState('');
  // const [cssFlag, setCSSFlag] = useState(false);
  // const [documentType, setDocumentType] = useState([]);
  // const [samityTypeSelection, setSamityTypeSelection] = useState(false);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [committeeRoleData, setCommitteRoleData] = useState([]);
  const [selectedCommitteeRole, setSelectedCommitteeRole] = useState(null);
  const [nominiList, setNominiList] = useState([
    {
      nomineeName: '',
      relation: '',
      docType: '',
      docNumber: '',
      percentage: '',
      nomineeSign: '',
      nomineeSignType: '',
      nomineePicture: '',
      nomineePictureType: '',
      birthDate: null,
    },
  ]);
  const [gender, setGender] = useState(samityMemberType);
  const [nominiError, setNominiError] = useState([
    {
      nomineeName: '',
      relation: '',
      docType: '',
      docNumber: '',
      percentage: '',
      birthDate: null,
    },
  ]);

  let getAdmissionFee = async () => {
    if (projectId) {
      try {
        let showData = await axios.get(loanProject + 'projectWithPagination?page=1&id=' + projectId, config);
        setAdmissionFee(engToBang(showData?.data?.data?.data[0]?.admissionFee));
        setPassBookFee(engToBang(showData?.data?.data?.data[0]?.passbookFee));
      } catch (error) {
        if (error.response) {
          // ("Error Data", error.response);
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
  let getCommitteeRole = async () => {
    try {
      let showData = await axios.get(committeeRole + '?isPagination=false', config);
      let committeeRoleData = showData.data.data;
      let filterCommitteeRoleData = committeeRoleData.filter((value) => value.doptorId == doptorId);
      setCommitteRoleData(filterCommitteeRoleData);
    } catch (error) {
      if (error.response) {
        // ("Error Data", error.response);
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const [flagForImage] = useState('data:image/jpg;base64,');

  // const [districtId, setDistrictId] = useState(null);
  // const [upazilaId, setUpazilaId] = useState(null);
  // const [unionId, setUnionId] = useState(null);
  // const [perDistrictId, setPerDistrictId] = useState(null);
  // const [perUpazilaId, setPerUpazilaId] = useState(null);
  // const [perUnionId, setPerUnionId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [age, setAge] = useState('');

  // const [docImageFront, setDocImageFront] = useState({
  //   docimagefront: '',
  //   mimetypefront: '',
  // });
  // const [samityNameObj, setSamityNameObj] = useState({
  //   id: '',
  //   label: '',
  // });
  // const [docImageBack, setDocImageBack] = useState({
  //   docimageback: '',
  //   mimetypeback: '',
  // });
  const [signature, setSignature] = useState({
    signature: '',
    mimetypesignature: '',
  });
  const [image, setImage] = useState({
    image: '',
    mimetypeimage: '',
  });
  // const [docNameFront, setDocNameFront] = useState('');
  // const [docNameBack, setDocNameBack] = useState('');
  // const [selectedDocumentName, setSelectedDocumentName] = useState('');

  // const [signName, setSignName] = useState('');
  // const [imageName, setImageName] = useState('');
  // const [project, setProject] = useState(null);
  // const [projects, setProjects] = useState([]);
  const [genderList, setgenderList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [documentList, setDocumentList] = useState([
    {
      documentType: '',
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
  // const [hashArray, setHashArray] = useState([]);
  const [memberInfo, setMemberInfo] = useState({
    samityName: '',
    projectName: '',
    memberNameB: '',
    memberNameE: '',
    nid: '',
    birthDate: '',
    fatherName: '',
    motherName: '',
    fatherNid: '',
    motherNid: '',
    address: '',
    maritalStatus: '',
    spouseName: '',
    qualification: '',
    religion: '',
    gender: '',
    occupation: '',
    annualIncome: '',
    mobile: '',
    email: '',
    meritOrder: '',
    bankName: '',
    branchName: '',
    bankAcc: '',
    acc: '',
    wardNo: '',
    houseNo: '',
    village: '',
    postOffice: '',
    perWardNo: '',
    perHouseNo: '',
    perVillage: '',
    perPostOffice: '',
    classType: '',
    docType: '',
    transactionType: '',
    docNumber: '',
    vGuardian: '',
    vGuardianRelation: '',
    vGuardianNid: '',
    vGuardianOccupation: '',
    accName: '',
    district_id: '',
    upazila_id: '',
    upazila_type: '',
    upaCityIdType: '',
    union_id: '',
    union_type: '',
    uniThanaPawIdType: '',
    per_district_id: '',
    per_upazila_id: '',
    per_upazila_type: '',
    per_upaCityIdType: '',
    per_union_id: '',
    per_union_type: '',
    per_uniThanaPawIdType: '',
    secondaryOccupation: '',
  });
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
        addDoc: false,
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
  const [formErrors, setFormErrors] = useState({
    docType: '',
    email: '',
    mobile: '',
    age: '',
    date: '',
    projectName: '',
    samityName: '',
    samityTypeValue: '',
    fatherName: '',
    motherName: '',
    occupation: '',
    classType: '',
    religion: '',
    annualIncome: '',
    maritalStatus: '',
    district_id: '',
    upazila_id: '',
    union_id: '',
    per_district_id: '',
    per_upazila_id: '',
    per_union_id: '',
    vGuardianNid: '',
    acc: '',
  });
  const handleChecked = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    // samityDocument();
    getReligionList();
    getMarriageList();
    getEducationList();
    getDocumentTypeList();
    getOccupationList();
    getGuardianRelationList();
    getTransactionList();
    getGenderList();
    getBankList();
    getBranchList();
    getPermission();
    getAdmissionFee();
    getCommitteeRole();
  }, []);

  const handleAddFNominiList = () => {
    setNominiList([
      ...nominiList,
      {
        nomineeName: '',
        relation: '',
        percentage: '',
        nomineeSign: '',
        docType: '',
        docNumber: '',
        nomineeSignType: '',
        nomineePicture: '',
        nomineePictureType: '',
        birthDate: null,
      },
    ]);
    setNominiError([
      ...nominiError,
      {
        nomineeName: '',
        relation: '',
        docType: '',
        docNumber: '',
        percentage: '',
        birthDate: null,
      },
    ]);
  };

  let getDocumentTypeList = async () => {
    if (projectId) {
      try {
        let documentInfo = await axios.get(documentListRoute + '?serviceId=14&projectId=' + projectId, config);
        let documentListData = documentInfo.data.data;

        setDocumentTypeList(documentListData?.memberDocs);
        setNomineeDocTypeList(documentListData?.nomineeDocs);
      } catch (err) {
        // (err.response);
      }
    }
  };

  const handleDocumentList = (e, index) => {
    const { name, value } = e.target;
    let resultObj;
    const list = [...documentList];
    const documentTypeArray = [...documentTypeList];

    let result;
    // ("name & value===", name, value);
    if (name == 'documentNumber' && value.length > 30) {
      return;
    }
    let selectedObj;
    switch (name) {
      case 'documentType':
        formErrorsInDocuments[index]['documentNumber'] = '';
        list[index]['documentNumber'] = '';
        selectedObj = documentTypeArray?.find((elem) => elem.docType == value);

        list[index]['isDocMandatory'] = selectedObj['isDocNoMandatory'];
        list[index]['docTypeDesc'] = selectedObj['docTypeDesc'];
        break;
      case 'documentNumber':
        if (value.length > 30) {
          return;
        }
        if (list[index]['documentType'] == 'NID') {
          resultObj = myValidate('nid', value);
          if (resultObj?.status) {
            return;
          }
          formErrorsInDocuments[index]['documentNumber'] = resultObj?.error;
          list[index][name] = resultObj?.value;
          setDocumentList(list);
          return;
        } else if (list[index]['documentType'] == 'BRN') {
          resultObj = myValidate('brn', value);
          if (resultObj?.status) {
            return;
          }
          list[index][name] = resultObj?.value;
          formErrorsInDocuments[index]['documentNumber'] = resultObj?.error;
          setDocumentList(list);
          return;
        } else if (list[index]['documentType'] == 'COM') {
          if (value.length > 20) {
            return;
          }
          list[index][name] = value;
          setDocumentList(list);
        } else {
          formErrorsInDocuments[index]['documentNumber'] = '';
        }
        return;
    }
    result = documentChecking(index, name, value, documentList[index], formErrorsInDocuments);
    if (result && !result.status) {
      formErrorsInDocuments[index][result.key] = result.message;
    } else if (result && result.status) {
      formErrorsInDocuments[index][result.key] = result.message;
    }
    list[index][name] = value;
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
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);

        // setProfileImage(base64Image);
        // setProfileImageType(file.type);
        if (typeStatus.showAble && base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = event.target.files[0];
          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not showable') {
          // list[index][name] = base64Image;
          //setDocumentList(list);
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = event.target.files[0];
          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not supported') {
          list[index][name + 'Name'] = 'Invalid File Type';
          setDocumentList(list);
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'File Type is not Supported';
          setDocumentList(list);
        }

        //("ImageData", this.state.profileImage)
        // this.props.handleState("NidFront", base64Image);

        // this.props.handleState("NidFrontType", file.type);
      };
      reader.onerror = () => {
        // ("there are some problems");
        NotificationManager.error('File can not be read', 'Error', 5000);
      };
    }
  };
  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);

    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
  };
  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);
  let getReligionList = async () => {
    // ("config", config)
    try {
      let religionInfo = await axios.get(codeMaster + '?codeType=REL', config);
      let religionListData = religionInfo.data.data;
      // ("Religion Info", religionListData);
      setReligionList(religionListData);
    } catch (error) {
      if (error.response) {
        // ("Error Data", error.response);
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getTransactionList = async () => {
    // ("config", config)
    try {
      let transactionInfo = await axios.get(codeMaster + '?codeType=TRN', config);
      let transactionListData = transactionInfo.data.data;
      // ("Religion Info", religionListData);
      setTransactionList(transactionListData);
    } catch (err) {
      // (err);
    }
  };
  let getOccupationList = async () => {
    // ("config", config)
    try {
      let occupationInfo = await axios.get(codeMaster + '?codeType=OCC', config);
      let occupationInfoData = occupationInfo.data.data;
      setOccupationList(occupationInfoData);
      setGuardianOccupationList(occupationInfoData);
    } catch (err) {
      // (err);
    }
  };
  let getGenderList = async () => {
    // ("config", config)
    try {
      let genderInfo = await axios.get(codeMaster + '?codeType=GEN', config);

      let genderInfoData = genderInfo.data.data;
      setgenderList(genderInfoData);
    } catch (err) {
      // (err);
    }
  };

  let getBankList = async () => {
    // ("config", config)
    try {
      let bankInfo = await axios.get(bankInfoRoute + '?type=bank', config);
      // ("Bank Info----", bankInfo);
      let bankInfoData = bankInfo.data.data;
      setBankList(bankInfoData);
    } catch (error) {
      if (error.response) {
        // ("Error Data", error.response);
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getBranchList = async (id) => {
    // ("config", config)
    try {
      let branchInfo = await axios.get(bankInfoRoute + '?type=branch&bankId=' + id, config);
      // ("Branch Info----", branchInfo);
      let branchInfoData = branchInfo.data.data;
      setBranchList(branchInfoData);
    } catch (error) {
      if (error.response) {
        // ("Error Data", error.response);
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let getGuardianRelationList = async () => {
    // ("config", config)
    try {
      let guardianRelationInfo = await axios.get(codeMaster + '?codeType=RLN', config);
      let guardianRelationInfoData = guardianRelationInfo.data.data;
      setGuardianRelationList(guardianRelationInfoData);
    } catch (err) {
      // (err);
    }
  };

  //Props Function for UpazilaData

  // let _myClasses = `display:${checked ? 'none' : ''}`;
  let getPermission = async () => {
    try {
      if (projectId) {
        let permissionResp = await axios.get(permissionRoute + '?pageName=memberReg&project=' + projectId, config);
        const isEmpty = Object.keys(permissionResp.data.data[0]).length === 0;
        const isEmpty2 = Object.keys(permissionResp.data.data[1]).length === 0;
        // if (permissionResp?.data?.data[0]?.samityTypeSelection) {
        //   setSamityTypeSelection(permissionResp?.data?.data[0]?.samityTypeSelection);
        // } else {
        //   setSamityTypeSelection(false);
        // }

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
        // if (permissionResp.data.data.length >= 1) {
        //   // ("Permission Resp=====", permissionResp.data.data[0]);
        //   if (permissionResp.data.data[0].samityType == 'C') {
        //     setLabelForSamity('সমবায় সমিতির নাম');
        //   } else if (permissionResp.data.data[0].samityType == 'D') {
        //     setLabelForSamity('দলের নাম');
        //   } else if (permissionResp.data.data[0].samityType == 'G') {
        //     setLabelForSamity('সংঘের নাম');
        //   } else {
        //     setLabelForSamity('সমিতির নাম');
        //   }
        // }
      }
      // show();
    } catch (error) {
      if (error.response) {
        // ("Error Data", error.response);
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getMarriageList = async () => {
    // ("config", config)
    try {
      let marriageInfo = await axios.get(codeMaster + '?codeType=MST', config);
      let marriageList = marriageInfo.data.data;
      // ("Marriage Info", marriageList);
      setMarriageList(marriageList);
    } catch (err) {
      // (err);
    }
  };
  let getEducationList = async () => {
    // ("config", config)
    try {
      let educationInfo = await axios.get(codeMaster + '?codeType=EDT', config);
      let educationList = educationInfo.data.data;
      // ("Education Info", educationList);
      // setEducationList(educationList);
      setClassTypeList(educationList);
    } catch (err) {
      // (err);
    }
  };
  // const myStyledComponentStyles = {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   boxShadow: 'none',
  // };
  let handleNominiDate = (value, i) => {
    const list = [...nominiList];
    list[i]['birthDate'] = value;
    setNominiList(list);
  };
  // let samityDocument = async (value) => {
  //   let samityInfo;
  //   try {
  //     if (memberInfo.projectName != 'নির্বাচন করুন' && samityType) {
  //       samityInfo = await axios.get(
  //         samityNameRoute +
  //         '?project=' +
  //         memberInfo.projectName +
  //         '&value=' +
  //         value +
  //         '&coop=0' +
  //         '&samityType=' +
  //         samityType,
  //         config,
  //       );
  //     } else if (memberInfo.projectName != 'নির্বাচন করুন') {
  //       samityInfo = await axios.get(
  //         samityNameRoute + '?project=' + memberInfo.projectName + '&value=' + value + '&coop=0',
  //         config,
  //       );
  //     }
  //     // let samityName = samityInfo.data.data;
  //     // setAllSamityName(samityName);
  //   } catch (error) {
  //     if (error.response) {
  //       // ("Error Data", error.response);
  //       // let message = error.response.data.errors[0].message;
  //       // NotificationManager.error(message, "Error", 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', '', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), '', 5000);
  //     }
  //   }
  // };
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
  const deleteNomineeInfo = (event, index) => {
    const arr = nominiList.filter((g, i) => index !== i);
    setNominiList(arr);
    const nominiFormError = nominiError.filter((g, i) => index !== i);
    setNominiError(nominiFormError);
  };

  let regexResultFunc = (regex, value) => {
    return regex.test(value);
  };
  //method for handling input field change eventco
  const handleChangeForZone = (event, value) => {
    // let result;
    let idType;
    if (event.target.name == 'districtId') {
      formErrors.district_id = '';
    }
    switch (event.target.id.split('-')[0]) {
      case 'upaCityIdType':
        idType = value.id.split(',');
        setMemberInfo({
          ...memberInfo,
          ['upazila_id']: idType[0],
          ['upazila_type']: idType[1],
          ['upaCityIdType']: value.id,
        });
        formErrors.upazila_id = '';
        return;
      case 'uniThanaPawIdType':
        idType = value.id.split(',');
        setMemberInfo({
          ...memberInfo,
          ['union_id']: idType[0],
          ['union_type']: idType[1],
          ['uniThanaPawIdType']: value.id,
        });
        formErrors.union_id = '';
        return;

      case 'per_upaCityIdType':
        idType = value.id.split(',');
        setMemberInfo({
          ...memberInfo,
          ['per_upazila_id']: idType[0],
          ['per_upazila_type']: idType[1],
          ['per_upaCityIdType']: value.id,
        });

        return;
      case 'per_uniThanaPawIdType':
        idType = value.id.split(',');
        setMemberInfo({
          ...memberInfo,
          ['per_union_id']: idType[0],
          ['per_union_type']: idType[1],
          ['per_uniThanaPawIdType']: value.id,
        });

        return;
    }

    setMemberInfo((prevState) => ({
      ...prevState,
      [event.target.id.split('-')[0]]: value?.id,
    }));
  };
  const handleChange = (e) => {
    const { name, value, id } = e.target;
    // ("name value",name,value,id);
    let resultObj;
    // let result;
    // let idType;
    if (name == 'samityTypeValue') {
      setSamityTypeValue(value);
      // samityDocument(value);
    }

    if (name == 'maritalStatus') {
      if (value == 48) {
        memberInfo.spouseName = '';
        document.getElementById('spouseName').setAttribute('disabled', 'true');
      } else {
        document.getElementById('spouseName').removeAttribute('disabled');
      }
    }
    switch (name) {
      case 'projectName':
        setSamityTypeValue('');
        // setAllSamityName('');
        if (memberInfo.projectName == '') {
          formErrors.projectName = 'প্রকল্প নির্বাচনকরুন';
        } else {
          formErrors.projectName = '';
        }
        getPermission(value);
        getAdmissionFee(value);
        getDocumentTypeList(value);
        break;

      case 'committeeRole':
        setSelectedCommitteeRole(value);
        break;
      case 'memberNameB':
        formErrors.memberNameB = '';
        setMemberInfo({
          ...memberInfo,
          [e.target.name]: e.target.value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
            '',
          ),
        });
        return;
      case 'memberNameE':
        formErrors.memberNameE = '';
        setMemberInfo({
          ...memberInfo,
          [e.target.name]: e.target.value.replace(/[^A-Za-z09-\w\s]/gi, ''),
        });
        return;
      // case "docType":
      //   formErrors.docNumber = " ";
      //   memberInfo.docNumber = "";
      //   break
      case 'bankName':
        getBranchList(value);
        break;
      case 'annualIncome':
        resultObj = myValidate('annualIncome', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        formErrors.annualIncome = resultObj?.error;
        break;
      case 'fatherName':
        if (formErrors.fatherName) {
          formErrors.fatherName = '';
        }
        if (value.length > 30) {
          return;
        }
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setMemberInfo({
            ...memberInfo,
            [e.target.name]: e.target.value.replace(/[^A-Za-z\s-]/gi, ''),
          });
          return;
        } else {
          setMemberInfo({
            ...memberInfo,
            [e.target.name]: e.target.value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      case 'fatherNid':
        resultObj = myValidate('nid', value);
        if (resultObj?.status) {
          return;
        }

        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        formErrors.fatherNid = resultObj?.error;
        break;
      case 'rollNumber':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }

        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        formErrors.fatherNid = resultObj?.error;
        break;
      case 'motherName':
        if (formErrors.motherName) {
          formErrors.motherName = '';
        }
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setMemberInfo({
            ...memberInfo,
            [e.target.name]: e.target.value.replace(/[^A-Za-z\s-]/gi, ''),
          });
          return;
        } else {
          setMemberInfo({
            ...memberInfo,
            [e.target.name]: e.target.value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      case 'motherNid':
        resultObj = myValidate('nid', value);
        if (resultObj?.status) {
          return;
        }

        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        formErrors.motherNid = resultObj?.error;

        break;
      case 'vGuardian':
        if (value.length > 30) {
          break;
        }
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setMemberInfo({
            ...memberInfo,
            [e.target.name]: e.target.value.replace(/[^A-Za-z\s-]/gi, ''),
          });
          return;
        } else {
          setMemberInfo({
            ...memberInfo,
            [e.target.name]: e.target.value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      case 'vGuardianNid':
        resultObj = myValidate('nid', value);
        if (resultObj?.status) {
          return;
        }

        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        formErrors.vGuardianNid = resultObj?.error;

        break;
      case 'occupation':
        if (value == 'নির্বাচন করুন') {
          formErrors.occupation = 'পেশা নির্বাচনকরুন';
        } else {
          formErrors.occupation = '';
        }
        break;

      case 'maritalStatus':
        if (value == 'নির্বাচন করুন') {
          formErrors.maritalStatus = 'বৈবাহিক অবস্থা নির্বাচনকরুন';
        } else {
          formErrors.maritalStatus = '';
        }
        break;
      case 'religion':
        if (value == 'নির্বাচন করুন') {
          formErrors.religion = 'ধর্ম নির্বাচনকরুন';
        } else {
          formErrors.religion = '';
        }
        break;

      case 'email':
        setMemberInfo({
          ...memberInfo,
          [e.target.name]: e.target.value.replace(/[^A-Za-z09-\w\s.@]/gi, ''),
        });
        formErrors.email = emailRegex.test(value) || value.length == 0 ? '' : 'আপনার সঠিক ইমেইল প্রদান করুন';
        return;
      case 'mobile':
        resultObj = myValidate('mobile', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
          // [name]:value.replace(/[\u09E6-\u09EF]$/,"")
        });

        formErrors.mobile = resultObj?.error;
        break;
      case 'classType':
        if (value == 'নির্বাচন করুন') {
          let educationString = samityType == 'G' ? labelObj.classType : 'শিক্ষাগত যোগ্যতা';
          formErrors.classType = `${educationString} নির্বাচন করুন`;
        } else {
          formErrors.classType = '';
        }
        break;
      case 'transactionType':
        formErrors.acc = '';
        formErrors.bankAcc = '';
        setMemberInfo({
          ...memberInfo,
          bankAcc: '',
          acc: '',
          bankName: '',
          accName: '',
          branchName: '',
        });
        break;
      case 'acc':
        if (memberInfo.transactionType == 'BKS' || memberInfo.transactionType == 'NGD') {
          resultObj = myValidate('mobile', value);
          if (resultObj?.status) {
            return;
          }
          setMemberInfo({
            ...memberInfo,
            [name]: resultObj?.value,
            // [name]:value.replace(/[\u09E6-\u09EF]$/,"")
          });

          formErrors.acc = resultObj?.error;
          break;
        }
        break;
      case 'accName':
        if (value.length > 30) {
          return;
        }
        if (memberInfo.transactionType == 'BNK') {
          setMemberInfo({
            ...memberInfo,
            [e.target.name]: e.target.value.replace(/[^A-Za-z09-\w\s]/gi, ''),
          });
          return;
        }
        break;
      case 'bankAcc':
        resultObj = myValidate('bankAcc', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });

        formErrors.bankAcc = resultObj?.error;
        break;

      case 'postOffice':
        resultObj = myValidate('postOffice', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
          // [name]:value.replace(/[\u09E6-\u09EF]$/,"")
        });
        break;

      case 'perPostOffice':
        resultObj = myValidate('postOffice', value);
        if (resultObj?.status) {
          return;
        }
        setMemberInfo({
          ...memberInfo,
          [name]: resultObj?.value,
        });
        break;
      case 'spouseName':
        if (id == 'spouseName') {
          if (value.length > 30) {
            return;
          }
          if (regexResultFunc(/[A-Za-z]/gi, value)) {
            setMemberInfo({
              ...memberInfo,
              [e.target.name]: e.target.value.replace(/[^A-Za-z\s-]/gi, ''),
            });
            return;
          } else {
            setMemberInfo({
              ...memberInfo,
              [e.target.name]: e.target.value.replace(
                /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
                '',
              ),
            });
            return;
          }
        }
    }
    if (id != 'number') {
      setMemberInfo((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleNominiList = (e, index) => {
    const { name, value } = e.target;
    // let result;
    let resultObj;
    const list = [...nominiList];
    const newFormError = [...nominiError];
    if (name == 'docType') {
      if (list[index]['docNumber']) {
        list[index]['docNumber'] = '';
        newFormError[index]['docNumber'] = '';
        setNominiError(newFormError);
      }
    }
    if (name == 'docNumber' && list[index].docType == 'NID') {
      resultObj = myValidate('nid', value);
      if (resultObj?.status) {
        return;
      }

      list[index][name] = resultObj?.value;

      setNominiList(list);
      nominiError[index][name] = resultObj?.error;
      return;
    } else {
      nominiError[index][name] = '';
    }
    if (name == 'docNumber' && list[index].docType == 'BRN') {
      resultObj = myValidate('brn', value);
      if (resultObj?.status) {
        return;
      }

      list[index][name] = resultObj?.value;
      setNominiList(list);
      nominiError[index][name] = resultObj?.error;
      return;
    }

    if (name == 'docNumber' && list[index].docType == 'COM') {
      if (value.length == 26) {
        return;
      }
      list[index][name] = value.replace(/[^A-Za-z09-\w\s]/, '');
      setNominiList(list);
      return;
    }

    if (name == 'docNumber' && list[index].docType == 'COM') {
      if (value.length == 26) {
        return;
      }
      list[index][name] = value.replace(/[^A-Za-z0-9]/, '');
      setNominiList(list);
      return;
    }

    if (name == 'docNumber' && list[index].docType == 'DPN') {
      if (value.length == 26) {
        return;
      }
      list[index][name] = value.replace(/[^A-Za-z0-9]/, '');
      setNominiList(list);
      return;
    }

    if (name == 'percentage') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }

      list[index][name] = resultObj?.value;

      setNominiList(list);
      nominiError[index][name] = resultObj?.error;
      return;
    }

    if (name == 'nomineeName') {
      if (value.length > 30) {
        return;
      }
      if (regexResultFunc(/[A-Za-z]/gi, value)) {
        list[index][name] = value.replace(/[^A-Za-z\s-]/gi, '');
        setNominiList(list);
        return;
      } else {
        list[index][name] = value.replace(
          /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
          '',
        );
        setNominiList(list);
        return;
      }
    }

    list[index][name] = value;
    setNominiList(list);
  };

  //   setCSSFlag(true);
  //   if (e.target.files && e.target.files.length > 0) {
  //     // ("Resulted Base in Image-----", base);
  //     // setSelectedImage(e.target.files[0]);
  //     let file = e.target.files[0];
  //     //("Image Type", file.type);
  //     var reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     setDocNameFront(file);
  //     reader.onload = () => {
  //       // let base64Image = btoa(reader.result);
  //       setDocImageFront((prevState) => ({
  //         ...prevState,
  //         docimagefront: base,
  //         mimetypefront: file.type,
  //       }));
  //     };
  //   }
  // };
  // let handleChangeOfSamityTypeSelect = (e) => {
  //   const newError = { ...formErrors };

  //   newError = {
  //     ...formErrors,
  //     age: '',
  //   };
  //   setFormErrors(newError);
  //   setSamityTypeValue('');
  //   setAge('');
  //   setValue(null);
  //   // setAllSamityName('');
  // };
  let handleImage = (e, index) => {
    const list = [...nominiList];
    // list[index]["slNo"] = index + 1;
    if (e.target.files && e.target.files.length > 0) {
      // setSelectedImage(e.target.files[0]);
      let file = e.target.files[0];
      //("Image Type", file.type);
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        // list[index]["nomineePictureRes"] = {
        //   image: base64Image,
        //   mimetype: file.type,
        // };
        list[index]['nomineePicture'] = base64Image;
        list[index]['nomineePictureType'] = file.type;
        setNominiList(list);
      };
    }
  };
  // ("Nominee Image---", nominiList);
  let handleSign = (e, index) => {
    const { name } = e.target;
    const list = [...nominiList];
    // list[index]["slNo"] = index + 1;
    if (e.target.files && e.target.files.length > 0) {
      // setSelectedImage(e.target.files[0]);
      let file = e.target.files[0];
      //("Image Type", file.type);
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      list[index][name] = file;
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        list[index]['nomineeSign'] = base64Image;
        list[index]['nomineeSignType'] = file.type;
        setNominiList(list);
      };
    }
  };
  let handleGenderChange = (e) => {
    const { value } = e.target;
    setGender(value);
  };
  // let docTypeBack = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     // setSelectedImage(e.target.files[0]);
  //     let file = e.target.files[0];
  //     //("Image Type", file.type);
  //     var reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     setDocNameBack(file);
  //     reader.onload = () => {
  //       let base64Image = btoa(reader.result);
  //       setDocImageBack((prevState) => ({
  //         ...prevState,
  //         docimageback: base64Image,
  //         mimetypeback: file.type,
  //       }));
  //     };
  //   }
  // };
  let ImageSetup = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // setSelectedImage(e.target.files[0]);
      let file = e.target.files[0];
      //("Image Type", file.type);

      var reader = new FileReader();
      reader.readAsBinaryString(file);
      // setImageName(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        setImage((prevState) => ({
          ...prevState,
          image: base64Image,
          mimetypeimage: file.type,
        }));
      };
    }
  };
  let signatureSetup = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // setSelectedImage(e.target.files[0]);
      let file = e.target.files[0];
      //("Image Type", file.type);
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      // setSignName(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        setSignature((prevState) => ({
          ...prevState,
          signature: base64Image,
          mimetypesignature: file.type,
        }));
      };
    }
  };
  // const removeSelectedDocImageFront = (e) => {
  //   setDocImageFront({
  //     docimagefront: '',
  //     mimetypefront: '',
  //   });
  // };
  // const removeSelectedDocImageBack = () => {
  //   setDocImageBack({
  //     docimageback: '',
  //     mimetypeback: '',
  //   });
  // };
  const removeSelectedImage = () => {
    setImage({
      image: '',
      mimetypeimage: '',
    });
  };
  const removeSelectedSignature = () => {
    setSignature({
      signature: '',
      mimetypesignature: '',
    });
  };
  const removeNomineeImage = (e, index) => {
    const list = [...nominiList];
    list[index]['nomineePicture'] = '';
    list[index]['nomineePictureType'] = '';
    setNominiList(list);
  };
  const removeNomineeSign = (e, index) => {
    const list = [...nominiList];
    list[index]['nomineeSign'] = '';
    list[index]['nomineeSignType'] = '';
    setNominiList(list);
  };
  // let docTypeFront = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     // setSelectedImage(e.target.files[0]);
  //     let file = e.target.files[0];
  //     //("Image Type", file.type);
  //     var reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     setDocNameFront(file);
  //     reader.onload = () => {
  //       let base64Image = btoa(reader.result);
  //       setDocImageFront((prevState) => ({
  //         ...prevState,
  //         docimagefront: base64Image,
  //         mimetypefront: file.type,
  //       }));
  //     };
  //   }
  // };
  let giveValueToTextField = (index) => {
    const ids = [memberInfo.district_id, memberInfo.upaCityIdType, memberInfo.uniThanaPawIdType];
    return ids[index];
  };
  let giveValueToTextFieldPer = (index) => {
    const ids = [memberInfo.per_district_id, memberInfo.per_upaCityIdType, memberInfo.per_uniThanaPawIdType];
    return ids[index];
  };
  let validateAge = (result) => {
    if (samityType == 'G') {
      if (Number(result) > 18) {
        setFormErrors({
          ...formErrors,
          ['age']: 'বয়স ১৮ এর চেয়ে বড় হতে পারবে না',
        });
      } else if (result == '') {
        setFormErrors({
          ...formErrors,
          ['age']: 'বয়স ০-১৮ এর মধ্যে হতে হবে',
        });
      } else {
        setTimeout(() => {
          setFormErrors({
            ...formErrors,
            ['age']: '',
          });
        }, 1);
      }
      return;
    }
    if (Number(result) < 18 || Number(result) > 65) {
      setTimeout(() => {
        setFormErrors({
          ...formErrors,
          ['age']: 'বয়স ১৮-৬৫ এর মধ্যে হতে হবে',
        });
      }, 1);
    } else {
      setTimeout(() => {
        setFormErrors({
          ...formErrors,
          ['age']: '',
        });
      }, 1);
    }
  };

  //method for handling save button onClick events

  let checkMandatory = () => {
    let flag = true;
    let newObj = {};
    if (memberInfo.district_id.length == 0 || memberInfo.district_id == 'নির্বাচন করুন') {
      flag = false;
      newObj.district_id = 'জেলা নির্বাচন করুন';
    }
    if (memberInfo.upazila_id.length == 0 || memberInfo.upazila_id == 'নির্বাচন করুন') {
      flag = false;
      newObj.upazila_id = 'উপজেলা নির্বাচন করুন';
    }
    if (memberInfo.union_id.length == 0 || memberInfo.union_id == 'নির্বাচন করুন') {
      flag = false;
      newObj.union_id = 'ইউনিয়ন নির্বাচন করুন';
    }
    if (!value) {
      flag = false;
      newObj.date = ' জন্মতারিখ নির্বাচন করুন';
    }

    if (memberInfo.memberNameB.length == 0) {
      flag = false;
      newObj.memberNameB = 'মেম্বার এর নাম বাংলায় উল্লেখ করুন';
    }
    if (memberInfo.memberNameE.length == 0) {
      flag = false;
      newObj.memberNameE = 'মেম্বার এর নাম ইংরেজিতে উল্লেখ করুন';
    }

    if (memberInfo.mobile.length == 0) {
      flag = false;
      newObj.mobile = 'মোবাইল নম্বর উল্লেখ করুন';
    }
    if (memberInfo.fatherName.length == 0) {
      flag = false;
      newObj.fatherName = 'মেম্বার এর পিতার নাম বাংলায় উল্লেখ করুন';
    }
    if (memberInfo.motherName.length == 0) {
      flag = false;
      newObj.motherName = 'মেম্বার এর  মাতার নাম বাংলায় উল্লেখ করুন';
    }
    if (memberInfo.maritalStatus.length == 0 || memberInfo.maritalStatus == 'নির্বাচন করুন') {
      flag = false;
      newObj.maritalStatus = 'বৈবাহিক অবস্থা নির্বাচন করুন';
    }
    if (memberInfo.occupation.length == 0 || memberInfo.occupation == 'নির্বাচন করুন') {
      flag = false;
      newObj.occupation = 'পেশা নির্বাচন করুন';
    }
    if (memberInfo.classType.length == 0 || memberInfo.classType == 'নির্বাচন করুন') {
      flag = false;
      let educationString = samityType == 'G' ? labelObj.classType : 'শিক্ষাগত যোগ্যতা';
      newObj.classType = `${educationString} নির্বাচন করুন`;
    }
    if (memberInfo.religion.length == 0 || memberInfo.religion == 'নির্বাচন করুন') {
      flag = false;
      newObj.religion = 'ধর্ম নির্বাচন করুন';
    }
    if (memberInfo.annualIncome.length == 0) {
      flag = false;
      newObj.annualIncome = 'বার্ষিক আয় নির্বাচন করুন';
    }
    if (memberInfo.transactionType != 'নির্বাচন করুন' && memberInfo.transactionType == 'BNK' && !memberInfo.bankAcc) {
      newObj.bankAcc = 'হিসাব নম্বর প্রদান করুন';
      flag = false;
    }
    if (
      memberInfo.transactionType != 'নির্বাচন করুন' &&
      (memberInfo.transactionType == 'BKS' || memberInfo.transactionType == 'NGD') &&
      !memberInfo.acc
    ) {
      newObj.acc = 'হিসাব নম্বর প্রদান করুন';
      flag = false;
    }
    if (memberInfo.vGuardianNid) {
      if (memberInfo.vGuardianNid.length != 17) {
        if (memberInfo.vGuardianNid.length != 10) {
          flag = false;
          newObj.vGuardianNid = 'আপনার সঠিক এনআইডি প্রদান করুন';
        }
      }
    }
    for (const key in formErrors) {
      if (formErrors[key].trim()) {
        flag = false;
      }
    }
    setTimeout(() => {
      setFormErrors({ ...formErrors, ...newObj });
    }, 1);
    return flag;
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    const newNominiList = nominiList.map((elem) => ({
      nomineeName: elem.nomineeName,
      ...(elem.relation != '' && { relation: Number(elem.relation) }),
      ...(elem.percentage != '' && {
        percentage: Number(bangToEng(elem.percentage)),
      }),
      nomineeSign: elem.nomineeSign,
      docType: elem.docType,
      docNumber: bangToEng(elem.docNumber),
      nomineeSignType: elem.nomineeSignType,
      nomineePicture: elem.nomineePicture,
      nomineePictureType: elem.nomineePictureType,
      birthDate: elem.birthDate,
    }));
    const newDocList = documentList.map((elem) => ({
      documentFront: elem.documentPictureFront,

      documentFrontType: elem.documentPictureFrontType,

      documentBackType: elem.documentPictureBackType,
      documentBack: elem.documentPictureBack,
      documentType: elem.documentType,
      documentNumber: bangToEng(elem.documentNumber),
      isDocNoMandatory: elem.isDocMandatory,
    }));

    let permanentAdd;
    let result = checkMandatory();
    setLoadingDataSaveUpdate(true);
    if (result) {
      if (checked) {
        permanentAdd = {
          districtId: memberInfo.district_id != '' ? parseInt(memberInfo.district_id) : null,
          upaCityId: memberInfo.upazila_id != '' ? parseInt(memberInfo.upazila_id) : null,
          upaCityType: memberInfo.upazila_type != '' ? memberInfo.upazila_type : '',
          uniThanaPawId: memberInfo.union_id != '' ? parseInt(memberInfo.union_id) : null,
          uniThanaPawType: memberInfo.union_type != '' ? memberInfo.union_type : '',
          postCode: bangToEng(memberInfo.postOffice),
          village: memberInfo.village,
        };
      } else {
        permanentAdd = {
          districtId: memberInfo.per_district_id != '' ? parseInt(memberInfo.per_district_id) : null,
          upaCityId: memberInfo.per_upazila_id != '' ? parseInt(memberInfo.per_upazila_id) : null,
          upaCityType: memberInfo.per_upazila_type != '' ? memberInfo.per_upazila_type : '',
          uniThanaPawId: memberInfo.per_union_id ? parseInt(memberInfo.per_union_id) : null,
          uniThanaPawType: memberInfo.per_union_type != '' ? memberInfo.per_union_type : '',
          postCode: bangToEng(memberInfo.perPostOffice),
          village: memberInfo.perVillage,
        };
      }

      let payload = {
        memberInfo: [
          {
            data: {
              samityLevel,
              ...(approvedSamityId && { samityId: approvedSamityId }),
              nameBn: memberInfo.memberNameB,
              nameEn: memberInfo.memberNameE,
              projectId,
              age: bangToEng(age),
              fatherName: memberInfo.fatherName,
              motherName: memberInfo.motherName,
              birthDate: value,
              mobile: bangToEng(memberInfo.mobile),
              religion: memberInfo.religion,
              gender: gender,
              maritalStatus: memberInfo.maritalStatus,
              ...(memberInfo.spouseName && {
                spouseName: memberInfo.spouseName,
              }),
              ...(samityType == 'G' ? { classId: memberInfo.classType } : { education: memberInfo.classType }),
              occupation: memberInfo.occupation,

              ...(doptorId == '4' && {
                secondaryOccupation: memberInfo.secondaryOccupation,
              }),
              yearlyIncome: bangToEng(memberInfo.annualIncome),
              email: memberInfo.email ? memberInfo.email : null,
              fatherNid: bangToEng(memberInfo.fatherNid),
              motherNid: bangToEng(memberInfo.motherNid),
              admissionFee: admissionFee ? bangToEng(admissionFee) : 0,
              passbookFee: passBookFee ? bangToEng(passBookFee) : 0,
              ...(memberInfo.transactionType != 'নির্বাচন করুন' &&
                memberInfo.transactionType && {
                transactionType: memberInfo.transactionType,
              }),
              ...(memberInfo.bankName && { bankId: memberInfo.bankName }),
              ...(memberInfo.branchName && { branchId: memberInfo.branchName }),
              ...(memberInfo.accName && { accountTitle: memberInfo.accName }),
              ...(memberInfo.acc && { accountNo: bangToEng(memberInfo.acc) }),
              ...(memberInfo.bankAcc && {
                accountNo: bangToEng(memberInfo.bankAcc),
              }),
              memberDocuments: newDocList,
              ...(samityType == 'G' && { section: memberInfo?.section }),
              ...(samityType == 'G' && {
                rollNo: bangToEng(memberInfo?.rollNumber),
              }),
              committeeRoleId: selectedCommitteeRole ? selectedCommitteeRole : null,
            },
            memberType: 'new',
            address: {
              pre: {
                districtId: memberInfo.district_id != '' ? parseInt(memberInfo.district_id) : null,
                upaCityId: memberInfo.upazila_id != '' ? parseInt(memberInfo.upazila_id) : null,
                upaCityType: memberInfo.upazila_type != '' ? memberInfo.upazila_type : '',
                uniThanaPawId: memberInfo.union_id != '' ? parseInt(memberInfo.union_id) : null,
                uniThanaPawType: memberInfo.union_type != '' ? memberInfo.union_type : '',
                postCode: bangToEng(memberInfo.postOffice),
                village: memberInfo.village,
              },

              per: permanentAdd,
            },
            guardianInfo: {
              guardianName: memberInfo.vGuardian ? memberInfo.vGuardian : null,
              documentNo: memberInfo.vGuardianNid ? bangToEng(memberInfo.vGuardianNid) : null,
              occupation:
                memberInfo.vGuardianOccupation && memberInfo.vGuardianOccupation != 'নির্বাচন করুন'
                  ? memberInfo.vGuardianOccupation
                  : null,
              relation:
                memberInfo.vGuardianRelation && memberInfo.vGuardianRelation != 'নির্বাচন করুন'
                  ? memberInfo.vGuardianRelation
                  : null,
            },
            nominee: newNominiList,
            memberSign: signature.signature,
            memberSignType: signature.mimetypesignature,
            memberPicture: image.image,
            memberPictureType: image.mimetypeimage,
          },
        ],
        ...(samityTypeValue == 1 && { projectId: memberInfo.projectName }),
      };

      try {
        let MemberData;
        if (samityLevel == 1) {
          if (approvedApplicationId) {
            MemberData = await axios.put(memberCreate + '/' + approvedApplicationId, payload, config);
            const message = 'আবেদনটি সফল ভাবে সংরক্ষণ করা হয়েছে। ';
            NotificationManager.success(message, '', 5000);
          } else {
            MemberData = await axios.post(approvedMemberCreate + '/' + compoName, payload, config);
            const message = 'আবেদনটি সফল ভাবে সংরক্ষণ করা হয়েছে। ';
            NotificationManager.success(message, '', 5000);
          }
        } else if (samityLevel == 2) {
          MemberData = await axios.put(memberCreate + '/' + applicationId, payload, config);
          NotificationManager.success(MemberData.data.message, '', 5000);
        }
        setLoadingDataSaveUpdate(false);
        setMemberInfo({
          ...memberInfo,
          samityName: 'নির্বাচন করুন',
          // ...(projects.length > 1 && { projectName: 'নির্বাচন করুন' }),
          memberNameB: '',
          memberNameE: '',
          nid: '',
          birthDate: '',
          fatherName: '',
          motherName: '',
          fatherNid: '',
          motherNid: '',
          address: '',
          maritalStatus: 'নির্বাচন করুন',
          spouseName: '',
          qualification: '',
          religion: 'নির্বাচন করুন',
          occupation: 'নির্বাচন করুন',
          annualIncome: '',
          mobile: '',
          email: '',
          meritOrder: '',
          bankName: '',
          branch: '',
          acc: '',
          accName: '',
          wardNo: '',
          houseNo: '',
          village: '',
          postOffice: '',
          perWardNo: '',
          perHouseNo: '',
          perVillage: '',
          perPostOffice: '',
          classType: 'নির্বাচন করুন',
          docType: 'নির্বাচন করুন',
          transactionType: 'নির্বাচন করুন',
          vGuardian: '',
          vGuardianNid: '',
          vGuardianOccupation: 'নির্বাচন করুন',
          vGuardianRelation: 'নির্বাচন করুন',
          docNumber: '',
          district_id: '',
          upazila_id: '',
          upazila_type: '',
          upaCityIdType: '',
          union_id: '',
          union_type: '',
          uniThanaPawIdType: '',
          per_district_id: '',
          per_upazila_id: '',
          per_upazila_type: '',
          per_upaCityIdType: '',
          per_union_id: '',
          per_union_type: '',
          per_uniThanaPawIdType: '',
        });
        setAge('');
        setGender('নির্বাচন করুন');
        setChecked(false);
        setNominiList([
          {
            nomineeName: '',
            docType: 'নির্বাচন করুন',
            docNumber: '',
            relation: 'নির্বাচন করুন',
            percentage: '',
            nomineePicture: '',
            nomineePictureType: '',
            nomineeSign: '',
            nomineeSignType: '',
          },
        ]);

        setSignature({
          signature: '',
          mimetypesignature: '',
        });
        setImage({
          image: '',
          mimetypeimage: '',
        });
        setDocumentList([
          {
            documentType: '',
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
        // setDistrictId('');
        // setUpazilaId('');
        // setUnionId('');
        // setPerDistrictId('');
        // setPerUpazilaId('');
        // setPerUnionId('');
        setValue(null);
        setSamityTypeValue('');
        closeNewMember();
      } catch (error) {
        setLoadingDataSaveUpdate(false);

        errorHandler(error);
      }
    } else {
      setLoadingDataSaveUpdate(false);
    }
  };

  return (
    <>
      <Grid container className="section">
        <SubHeading>সদস্যের সাধারণ তথ্য </SubHeading>

        <Grid container spacing={2.5}>
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.memberNameB != '' &&
            !fieldHideShowObj.memberNameB ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সদস্যের নাম (বাংলা) ')}
                name="memberNameB"
                onChange={handleChange}
                value={memberInfo.memberNameB}
                variant="outlined"
                size="small"
              ></TextField>
              {!memberInfo.memberNameB && <span style={{ color: 'red' }}>{formErrors.memberNameB}</span>}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.memberNameE != '' &&
            !fieldHideShowObj.memberNameE ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সদস্যের নাম (ইংরেজি) ')}
                name="memberNameE"
                onChange={handleChange}
                value={memberInfo.memberNameE}
                variant="outlined"
                size="small"
              ></TextField>
              {!memberInfo.memberNameE && <span style={{ color: 'red' }}>{formErrors.memberNameE}</span>}
            </Grid>
          )}
          <Grid item md={4} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={star('জন্ম তারিখ(ইংরেজি)')}
                name="birthDate"
                inputFormat="dd/MM/yyyy"
                value={value}
                onChange={(newValue) => {
                  formErrors.date = '';
                  setValue(newValue);
                  function GetAge(birthDate) {
                    if (birthDate) {
                      let age = moment(moment()).diff(birthDate, 'years');
                      return age ? age : '';
                    }
                  }
                  let result = GetAge(newValue);
                  let bangResult;
                  if (!isNaN(result)) {
                    bangResult = engToBang(result);
                    setAge(bangResult);
                  } else {
                    setAge('');
                  }
                  validateAge(result);
                }}
                maxDate={new Date()}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </LocalizationProvider>

            {!value && <span style={{ color: 'red' }}>{formErrors.date}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('বয়স')}
              name="age"
              InputProps={{
                readOnly: true,
              }}
              type="text"
              variant="outlined"
              size="small"
              value={age}
              onChange={handleChange}
            ></TextField>
            {<span style={{ color: 'red' }}>{formErrors.age}</span>}
          </Grid>

          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.classType != '' &&
            !fieldHideShowObj.classType ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star(samityType == 'G' ? labelObj.classType : 'শিক্ষাগত যোগ্যতা')}
                name="classType"
                onChange={handleChange}
                value={memberInfo.classType ? memberInfo.classType : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {classTypeList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
              </TextField>
              {!memberInfo.classType && <span style={{ color: 'red' }}>{formErrors.classType}</span>}
            </Grid>
          )}
          {samityType == 'G' ? (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সেকশন')}
                name="section"
                onChange={handleChange}
                type="text"
                value={memberInfo.section}
                variant="outlined"
                size="small"
              />
            </Grid>
          ) : (
            ''
          )}

          {samityType == 'G' ? (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('রোল নম্বর')}
                name="rollNumber"
                onChange={handleChange}
                type="text"
                id="number"
                value={memberInfo.rollNumber}
                variant="outlined"
                size="small"
              />
            </Grid>
          ) : (
            ''
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.fatherName != '' &&
            !fieldHideShowObj.fatherName ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('পিতার নাম')}
                name="fatherName"
                id="number"
                onChange={handleChange}
                type="text"
                value={memberInfo.fatherName}
                variant="outlined"
                size="small"
              />
              {!memberInfo.fatherName && <span style={{ color: 'red' }}>{formErrors.fatherName}</span>}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.fatherNid != '' &&
            !fieldHideShowObj.fatherNid ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="পিতার জাতীয় পরিচয়পত্র নম্বর"
                name="fatherNid"
                id="number"
                onChange={handleChange}
                type="text"
                value={memberInfo.fatherNid}
                variant="outlined"
                size="small"
              />
              {(memberInfo.fatherNid.length > 0 || !memberInfo.fatherNid) && (
                <span style={{ color: 'red' }}>{formErrors.fatherNid}</span>
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.motherName != '' &&
            !fieldHideShowObj.motherName ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('মাতার নাম')}
                id="number"
                name="motherName"
                onChange={handleChange}
                type="text"
                value={memberInfo.motherName}
                variant="outlined"
                size="small"
              />
              {!memberInfo.motherName && <span style={{ color: 'red' }}>{formErrors.motherName}</span>}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.motherNid != '' &&
            !fieldHideShowObj.motherNid ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="মাতার জাতীয় পরিচয়পত্র নম্বর"
                name="motherNid"
                onChange={handleChange}
                type="text"
                id="number"
                value={memberInfo.motherNid}
                variant="outlined"
                size="small"
              />
              {(memberInfo.motherNid.length > 0 || !memberInfo.motherNid) && (
                <span style={{ color: 'red' }}>{formErrors.motherNid}</span>
              )}
            </Grid>
          )}
          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.motherNid != '' &&
            !fieldHideShowObj.motherNid ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('ধর্ম')}
                name="religion"
                onChange={handleChange}
                value={memberInfo.religion ? memberInfo.religion : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {religionList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
              </TextField>
              {<span style={{ color: 'red' }}>{formErrors.religion}</span>}
            </Grid>
          )}

          {fieldHideShowObj &&
            Object.keys(fieldHideShowObj).length >= 1 &&
            memberInfo.gender != '' &&
            !fieldHideShowObj.gender ? (
            ''
          ) : (
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('লিঙ্গ')}
                name="gender"
                onChange={handleGenderChange}
                value={gender ? gender : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                disabled={samityMemberType != '4' && true}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {genderList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('পেশা')}
              name="occupation"
              onChange={handleChange}
              value={memberInfo.occupation ? memberInfo.occupation : ' '}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {occupationList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayValue}
                </option>
              ))}
            </TextField>
            {<span style={{ color: 'red' }}>{formErrors.occupation}</span>}
          </Grid>
          {doptorId == '4' && (
            <>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="দ্বিতীয় পেশা"
                  name="secondaryOccupation"
                  onChange={handleChange}
                  value={memberInfo.secondaryOccupation ? memberInfo.secondaryOccupation : ' '}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {occupationList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.displayValue}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </>
          )}

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('বার্ষিক আয়')}
              name="annualIncome"
              onChange={handleChange}
              type="text"
              id="number"
              value={memberInfo.annualIncome}
              variant="outlined"
              size="small"
            />
            {!memberInfo.annualIncome && <span style={{ color: 'red' }}>{formErrors.annualIncome}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('বৈবাহিক অবস্থা')}
              name="maritalStatus"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={memberInfo.maritalStatus ? memberInfo.maritalStatus : ' '}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {marriageList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayValue}
                </option>
              ))}
            </TextField>
            {!memberInfo.maritalStatus && <span style={{ color: 'red' }}>{formErrors.maritalStatus}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="spouseName"
              label="স্বামী/ স্ত্রী নাম"
              name="spouseName"
              onChange={handleChange}
              type="text"
              value={memberInfo.spouseName}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="ই-মেইল (ইংরেজি)"
              name="email"
              onChange={handleChange}
              type="text"
              value={memberInfo.email}
              variant="outlined"
              size="small"
            />
            {formErrors.email && formErrors.email.length > 0 && (
              <span style={{ color: 'red' }}>{formErrors.email}</span>
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মোবাইল নম্বর')}
              name="mobile"
              onChange={handleChange}
              type="text"
              id="number"
              value={memberInfo.mobile}
              variant="outlined"
              size="small"
            />
            {(memberInfo.mobile.length > 0 || !memberInfo.mobile) && (
              <span style={{ color: 'red' }}>{formErrors.mobile}</span>
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সদস্য ভর্তি ফি"
              type="text"
              disabled="true"
              value={admissionFee ? admissionFee : 0}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সদস্যের পাশবুক ফি"
              type="text"
              disabled="true"
              value={passBookFee ? passBookFee : 0}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={'কমিটিতে পদবী'}
              name="committeeRole"
              onChange={handleChange}
              value={selectedCommitteeRole ? selectedCommitteeRole : null}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {committeeRoleData.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.roleName}
                </option>
              ))}
            </TextField>
            {!memberInfo.classType && <span style={{ color: 'red' }}>{formErrors.classType}</span>}
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section" spacing={2.5}>
        <Grid item md={6} xs={12}>
          <SubHeading>বর্তমান ঠিকানা</SubHeading>
          <Grid container spacing={2.5}>
            {ZoneJson.fields.map((form, i) => {
              var obj = Object.assign(
                {},
                { ...form },
                { value: giveValueToTextField(i) },
                { onChange: handleChangeForZone },
                {
                  district_Id: memberInfo.district_id,
                },
                {
                  upa_city_Id_Type: memberInfo.upaCityIdType,
                },
                {
                  uni_thana_paw_Id_Type: memberInfo.uniThanaPawIdType,
                },
                {
                  formError: formErrors,
                },
                {
                  member: memberInfo,
                },
              );

              return (
                <>
                  <ZoneComponent {...obj} />
                </>
              );
            })}

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="পোষ্ট কোড"
                id="number"
                name="postOffice"
                onChange={handleChange}
                value={memberInfo.postOffice}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="বিস্তারিত ঠিকানা"
                name="village"
                onChange={handleChange}
                value={memberInfo.village}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12} className="subSection">
          <SubHeading>
            <span> স্থায়ী ঠিকানা </span>
            <span>
              (একই
              <Switch
                sx={{ margin: '-15px -8px -13px -4px' }}
                checked={checked}
                onChange={handleChecked}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              )
            </span>
          </SubHeading>
          {checked ? (
            <Grid container spacing={2.5}>
              {ZoneJson.fields.map((form, i) => {
                var obj = Object.assign(
                  {},
                  { ...form },
                  { value: giveValueToTextField(i) },
                  { onChange: handleChangeForZone },
                  {
                    district_Id: memberInfo.district_id,
                  },
                  {
                    upa_city_Id_Type: memberInfo.upaCityIdType,
                  },
                  {
                    uni_thana_paw_Id_Type: memberInfo.uniThanaPawIdType,
                  },
                  {
                    formError: formErrors,
                  },
                  {
                    member: memberInfo,
                  },
                );
                return (
                  <>
                    <ZoneComponent {...obj} />
                  </>
                );
              })}

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="পোষ্ট কোড"
                  name="postOffice"
                  id="number"
                  onChange={handleChange}
                  value={memberInfo.postOffice ? memberInfo.postOffice : ' '}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="বিস্তারিত ঠিকানা"
                  name="village"
                  onChange={handleChange}
                  value={memberInfo.village}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2.5}>
              {ZoneJson.fields2.map((form, i) => {
                var obj = Object.assign(
                  {},
                  { ...form },
                  { value: giveValueToTextFieldPer(i) },
                  { onChange: handleChangeForZone },
                  {
                    per_district_Id: memberInfo.per_district_id,
                  },
                  {
                    per_upa_city_Id_Type: memberInfo.per_upaCityIdType,
                  },
                  {
                    per_uni_thana_paw_Id_Type: memberInfo.per_uniThanaPawIdType,
                  },
                  {
                    formError: formErrors,
                  },
                  {
                    member: memberInfo,
                  },
                );
                return (
                  <>
                    <ZoneComponent {...obj} />
                  </>
                );
              })}

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="পোষ্ট কোড"
                  id="number"
                  name="perPostOffice"
                  onChange={handleChange}
                  value={memberInfo.perPostOffice ? memberInfo.perPostOffice : ''}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="বিস্তারিত ঠিকানা"
                  name="perVillage"
                  onChange={handleChange}
                  value={memberInfo.perVillage}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid container className="section" spacing={2.5}>
        <Grid item sm={12} md={6} xs={12}>
          <SubHeading>বৈধ অভিভাবক/খানা প্রধান(প্রযোজ্য ক্ষেত্রে )</SubHeading>
          <Grid container spacing={2.5}>
            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                label="নাম"
                name="vGuardian"
                id="number"
                onChange={handleChange}
                SelectProps={{ native: true }}
                value={memberInfo.vGuardian}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={5} xs={12}>
              <TextField
                fullWidth
                label="সম্পর্ক"
                name="vGuardianRelation"
                onChange={handleChange}
                value={memberInfo.vGuardianRelation ? memberInfo.vGuardianRelation : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {guardianRelationList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                label="জাতীয় পরিচয়পত্র নম্বর"
                name="vGuardianNid"
                onChange={handleChange}
                id="number"
                SelectProps={{ native: true }}
                value={memberInfo.vGuardianNid}
                variant="outlined"
                size="small"
              ></TextField>
              {(memberInfo.vGuardianNid.length > 0 || !memberInfo.vGuardianNid) && (
                <span style={{ color: 'red' }}>{formErrors.vGuardianNid}</span>
              )}
            </Grid>
            <Grid item md={5} xs={12}>
              <TextField
                fullWidth
                label="পেশা"
                name="vGuardianOccupation"
                onChange={handleChange}
                value={memberInfo.vGuardianOccupation ? memberInfo.vGuardianOccupation : ' '}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {guardianOccupationList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} md={6} xs={12}>
          <SubHeading>লেনদেনের মাধ্যম</SubHeading>
          <Grid container spacing={2.5}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="লেনদেনের মাধ্যম"
                name="transactionType"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                value={memberInfo.transactionType ? memberInfo.transactionType : ' '}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {transactionList.map((option) => (
                  <option key={option.id} value={option.returnValue}>
                    {option.displayValue}
                  </option>
                ))}
              </TextField>
            </Grid>
            {memberInfo.transactionType == 'BNK' ? (
              <>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="ব্যাংক এর নাম"
                    name="bankName"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                    value={memberInfo.bankName ? memberInfo.bankName : ' '}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {bankList.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.bankName}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="ব্রাঞ্চ এর নাম"
                    name="branchName"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                    value={memberInfo.branchName ? memberInfo.branchName : ' '}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {branchList.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.branchName}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label={star('হিসাব নম্বর')}
                    id="number"
                    name="bankAcc"
                    onChange={handleChange}
                    value={memberInfo.bankAcc}
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                  />

                  <span style={{ color: 'red' }}>{formErrors.bankAcc}</span>
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id="number"
                    label={star('হিসাবের শিরোনাম(ইংরেজি)')}
                    name="accName"
                    onChange={handleChange}
                    value={memberInfo.accName}
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </>
            ) : (
              ' '
            )}
            {memberInfo.transactionType == 'BKS' ||
              (memberInfo.transactionType == 'NGD') & (memberInfo.transactionType != 'BNK') ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label={star('হিসাব নম্বর')}
                  name="acc"
                  id="number"
                  onChange={handleChange}
                  value={memberInfo.acc}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                />

                <span style={{ color: 'red' }}>{formErrors.acc}</span>
              </Grid>
            ) : (
              ' '
            )}
          </Grid>
        </Grid>
      </Grid>
      {nomineeStatus && (
        <Grid container className="section">
          <NomineeSection
            componentName={memReg}
            handleNominiList={handleNominiList}
            handleAddFNominiList={handleAddFNominiList}
            nominiList={nominiList}
            documentTypeList={nomineeDocTypeList}
            guardianRelationList={guardianRelationList}
            // myStyledComponentStyles={myStyledComponentStyles}
            Input={Input}
            handleImage={handleImage}
            flagForImage={flagForImage}
            handleSign={handleSign}
            removeNomineeImage={removeNomineeImage}
            removeNomineeSign={removeNomineeSign}
            deleteNomineeInfo={deleteNomineeInfo}
            nominiError={nominiError}
            handleNominiDate={handleNominiDate}
          />
        </Grid>
      )}

      <Grid container className="section">
        <SubHeading>সদস্যের ছবি এবং স্বাক্ষর </SubHeading>
        <Grid item sm={12} md={12} xs={12}>
          <Grid container gap={2.5}>
            <Box className="uploadImage">
              <Typography component="div">
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <label htmlFor="contained-button-file3">
                    <Input
                      accept="image/*"
                      id="contained-button-file3"
                      multiple
                      type="file"
                      onChange={ImageSetup}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<PhotoCamera />}
                      className="btn btn-primary"
                    >
                      সদস্যের ছবি
                    </Button>
                  </label>
                </Stack>
              </Typography>
              {image.image && (
                <div className="img">
                  <CardMedia component="img" image={flagForImage + image.image} alt="স্বাক্ষর" name="signature" />
                  <CancelIcon onClick={removeSelectedImage} className="imgCancel" />
                </div>
              )}
            </Box>
            <Box className="uploadImage">
              <Typography component="div">
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <label htmlFor="contained-button-file4">
                    <Input
                      accept="image/*"
                      id="contained-button-file4"
                      multiple
                      type="file"
                      onChange={signatureSetup}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<PhotoCamera />}
                      className="btn btn-primary"
                    >
                      সদস্যের স্বাক্ষর
                    </Button>
                  </label>
                </Stack>
              </Typography>
              {signature.signature && (
                <div className="img">
                  <CardMedia component="img" image={flagForImage + signature.signature} alt="স্বাক্ষর" />
                  <CancelIcon onClick={removeSelectedSignature} className="imgCancel" />
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
      <DynamicDocSectionContent
        documentList={documentList}
        documentType={documentTypeList}
        handleDocumentList={handleDocumentList}
        addMoreDoc={addMoreDoc}
        fileSelectedHandler={fileSelectedHandler}
        deleteDocumentList={deleteDocumentList}
        formErrorsInDocuments={formErrorsInDocuments}
        removeDocumentImageFront={removeDocumentImageFront}
        removeDocumentImageBack={removeDocumentImageBack}
      />
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
        <Tooltip title="বন্ধ করুন">
          <Button variant="contained" className="btn btn-delete" onClick={closeNewMember}>
            <Delete sx={{ marginRight: '4px' }} />
            বন্ধ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default MemberRegistration;
