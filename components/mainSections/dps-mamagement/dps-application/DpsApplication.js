/* eslint-disable no-misleading-character-class */

import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { parseInt } from 'lodash';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
// import LoadingButton from "@mui/lab/LoadingButton";
import NomineeSection from 'components/mainSections/samity-managment/edit-member-registration/NomineeInfo';
import SubHeading from 'components/shared/others/SubHeading';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  codeMaster,
  docTypeRoute,
  employeeRecordByOffice,
  getDolMember,
  getInstallmentAmount,
  getsevingsProductDetails,
  loanProject,
  memberForGrantor,
  officeName,
  product,
  samityNameRoute,
  senctionDoc,
  specificApplication,
} from '../../../../url/ApiList';
import star from '../../../mainSections/loan-management/loan-application/utils';
import fileCheck from '../../loan-management/loan-application/sanction/FileUploadTypeCheck';
//import fileCheck from "./FileUploadTypeCheck";
import { documentChecking } from '../../../mainSections/loan-management/loan-application/sanction/validator';
// import { removeSelectedValue } from '../../../../utils/removeSelectedField';
import { bangToEng, engToBang, myValidate } from '../../../mainSections/samity-managment/member-registration/validator';

const DynamicDocSectionHeader = dynamic(() =>
  import('../../loan-management/loan-application/sanction/DocSectionHeader'),
);
const DynamicDocSectionContent = dynamic(() =>
  import('../../loan-management/loan-application/sanction/DocSectionContent'),
);

const Input = styled('input')({
  display: 'none',
});
const DpsApplication = () => {
  let componentName = 'dps';
  const config = localStorageData('config');
  // const myStyledComponentStyles = {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   boxShadow: 'none',
  // };

  const [formErrors, setFormErrors] = useState({});
  const [nomineeDocTypeList, setNomineeDocTypeList] = useState([]);
  const [guardianRelationList, setGuardianRelationList] = useState([]);
  const [flagForImage] = useState('data:image/jpg;base64,');
  // const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  // const [documentType, setDocumentType] = useState([]);
  // const [officeid, setOfficeId] = useState('');
  // const [approval, setApproval] = useState([]);
  // const [officeNames, setOfficeNames] = useState([]);
  const [officeNameData, setOfficeNameData] = useState([]);
  // const [toggle, setToggle] = useState(true);
  const [maturityAmount, setMaturityAmount] = useState(null);
  const [projectInfo, setProjectInfo] = useState({
    projectName: [],
    id: null,
    label: '',
    desabled: false,
  });
  const [adminEmployee, setAdminEmployee] = useState([]);
  const [adminOfficeObj, setAdminOfficeObj] = useState({
    id: null,
    label: '',
  });
  const [deskObj, setDeskObj] = useState({
    id: null,
    label: '',
  });
  const [productInfo, setProductInfo] = useState({
    productName: [],
    id: null,
    label: '',
    repFrq: '',
    desabled: false,
  });

  let handleNominiDate = (value, i) => {
    const list = [...nominiList];
    list[i]['birthDate'] = value;
    setNominiList(list);
  };
  // const [grantorInfo, setGrantorInfo] = useState([
  //   {
  //     grantorName: '',
  //     fatherName: '',
  //     motherName: '',
  //     mobile: '',
  //     nidNumber: '',
  //     birthDate: null,
  //     occupation: '',
  //     perAddress: '',
  //     preAddress: '',
  //     relation: '',
  //     grantorOrWitness: 'J',
  //     personType: '',
  //     personName: '',
  //     personInfo: [],
  //   },
  // ]);
  const [savingsProductDetails, setSavingsProductDetails] = useState([]);
  const [samityInfo, setSamityInfo] = useState({
    samityName: [],
    id: null,
    label: '',
    desabled: false,
  });
  const [memberInfo, setMemberInfo] = useState({
    memberName: [],
    id: null,
    label: '',
    desabled: false,
  });
  const [timePeriod, setTimePeriod] = useState([]);
  const [productDetails, setProductDetails] = useState({
    installmentAmount: null,
    time: null,
    installmentFrequency: '',
    maturityDate: '',
    maturityAmount: null,
  });
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
      dob: null,
    },
  ]);
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
  const [documentTypeList, setDocumentTypeList] = useState([]);
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
  const [serviceProductDetails, setServiceProductDetails] = useState();
  // const [employeeRecords, setEmployeeRecords] = useState([]);
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
        dob: null,
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
  let regexResultFunc = (regex, value) => {
    return regex.test(value);
  };
  // const handleChangeOffice = (e, values) => {
  //   setOfficeId(values.id);
  //   getEmployeeName(parseInt(values.id));
  // };

  const handleNominiList = (e, index) => {
    const { name, value } = e.target;
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
  let handleImage = (e, index) => {
    const { name } = e.target;
    const list = [...nominiList];
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      list[index]['imageUpdate'] = false;
      list[index][name] = file;
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        list[index]['nomineePicture'] = base64Image;
        list[index]['nomineePictureType'] = file.type;
        setNominiList(list);
      };
    }
  };
  const getMemberByAdmin = async (officeId) => {
    if (officeId) {
      try {
        const employeeData = await axios.get(employeeRecordByOffice + '?officeId=' + officeId, config);
        let employeeDataList = employeeData.data.data;

        employeeDataList.map((val) => {
          val.isChecked = false;
        });
        setAdminEmployee(employeeDataList);
      } catch (error) {
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
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

  const deleteNomineeInfo = (event, index) => {
    const arr = nominiList.filter((g, i) => index !== i);
    setNominiList(arr);
    const nominiFormError = nominiError.filter((g, i) => index !== i);
    setNominiError(nominiFormError);
  };

  // const officeNameOptions = officeNames.map((element) => {
  //   return { label: element.nameBn, id: element.id };
  // });

  let getOfficeName = async () => {
    try {
      let officeData = await axios.get(officeName, config);
      const offices = officeData.data.data;
      setOfficeNameData(offices);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let handleSign = (e, index) => {
    const { name } = e.target;
    const list = [...nominiList];
    // list[index]["slNo"] = index + 1;
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      list[index]['signUpdate'] = false;
      list[index][name] = file;
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        list[index]['nomineeSign'] = base64Image;
        list[index]['nomineeSignType'] = file.type;
        setNominiList(list);
      };
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
  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setDocumentList([...changeAddDoc]);
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
  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);
  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);
    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
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
      };
      reader.onerror = () => {
        NotificationManager.error('File can not be read', 'Error', 5000);
      };
    }
  };
  useEffect(() => {
    getAllDocument();
    getOfficeName();
    getProject();
    getGuardianRelationList();
  }, []);
  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };
    if (projectInfo.id == null) {
      result = false;
      formErrors.projectId = 'প্রকল্প নির্বাচন করুন';
    }
    if (productInfo.id == null) {
      result = false;
      formErrors.productId = 'প্রোডাক্ট নির্বাচন করুন';
    }
    if (samityInfo.id == null) {
      result = false;
      formErrors.samityId = 'সমিতি নির্বাচন করুন';
    }
    if (memberInfo.id == null) {
      result = false;
      formErrors.memberId = 'ব্যবহারকারী নির্বাচন করুন';
    }
    if (adminOfficeObj.id == null) {
      result = false;
      formErrors.officeId = 'পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন';
    }
    if (deskObj.id == null) {
      result = false;
      formErrors.deskId = 'পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন';
    }
    if (productDetails.installmentAmount == null || productDetails.installmentAmount == 'নির্বাচন করুন') {
      result = false;
      formErrors.installmentAmount = 'কিস্তির পরিমাণ নির্বাচন করুন';
    }
    if (productDetails.time == null || productDetails.time == 'নির্বাচন করুন') {
      result = false;
      formErrors.time = 'সময়কাল নির্বাচন করুন';
    }
    if (maturityAmount == null) {
      result = false;
      formErrors.maturityAmount = 'ম্যাচুরিটি পরিমাণ প্রদান করুন';
    }
    setFormErrors(formErrors);
    return result;
  };
  // let getEmployeeName = async (value) => {
  //   try {
  //     let employeeRecordData = await axios.get(employeeRecord + value, config);
  //     setEmployeeRecords(employeeRecordData.data.data);
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // };
  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      if (projectList.length == 1) {
        setProjectInfo({
          ...projectInfo,
          id: projectList[0].id,
          desabled: true,
        });
        // getProduct(projectList[0].id);
        //getLoanPurpose(projectList[0].id);
      }
      setProjectInfo({ ...projectInfo, projectName: projectList });
    } catch (error) {
      errorHandler(error);
    }
  };
  const getProduct = async (proId) => {
    if (proId != 'নির্বাচন করুন') {
      try {
        const allProduct = await axios.get(product + '?projectId=' + proId + '&productType=L&depositNature=C', config);
        let productList = allProduct.data.data;
        if (productList.length == 1) {
          setProductInfo({
            ...productInfo,
            id: productList[0].id,
            repFrq: productList[0].repFrq,
            desabled: true,
          });
          productList.filter((allProductData) => allProductData.id == productList?.[0].id);
        }
        setProductInfo({ ...productInfo, productName: productList });
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  const getTimePeriod = async (insAmount) => {
    try {
      const timePeriodDetails = await axios.get(
        getsevingsProductDetails + '?productId=' + productInfo.id + '&installmentAmount=' + insAmount,
        config,
      );
      const timeRange = timePeriodDetails.data.data;
      const mewTimePeriod = timeRange.map((obj) => {
        obj['timeId'] = obj['timePeriod'] + ',' + obj['id'];
        return obj;
      });
      setTimePeriod(mewTimePeriod);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getSeviceProductDetailsData = async (id) => {
    try {
      const serviceProductDetails = await axios.get(getsevingsProductDetails + '?productInterestId=' + id, config);
      const serviceProDetails = serviceProductDetails.data.data;
      setServiceProductDetails(serviceProDetails[0].intRate);
      setMaturityAmount(serviceProDetails[0].maturityAmount);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getSamity = async (project) => {
    if (project != 'নির্বাচন করুন') {
      try {
        const samity = await axios.get(samityNameRoute + '?value=1&project=' + project, config);
        let samityData = samity.data.data;
        setSamityInfo({
          ...samityInfo,
          samityName: samityData,
        });
      } catch (error) {
        errorHandler(error);
      }
    } else {
      // NotificationManager.error("প্রজেক্ট নির্বাচনকরুন", "Warning", 5000);
    }
  };
  const getMember = async (samityId) => {
    if (samityId != 'নির্বাচন করুন') {
      try {
        const member = await axios.get(getDolMember + '?samityId=' + samityId + '&flag=1&defaultMembers=1', config);

        let memberData = member.data.data;

        setMemberInfo({
          ...memberInfo,
          memberName: memberData,
        });
      } catch (error) {
        errorHandler(error);
      }
    } else {
      // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
    }
  };
  const clearField = () => {
    setProjectInfo({
      ...projectInfo,
      id: null,
      label: '',
      desabled: false,
    });
    setProductInfo({
      ...productInfo,
      id: '',
      label: '',
      repFrq: '',
      desabled: false,
    });
    setSamityInfo({
      ...samityInfo,
      id: '',
      label: '',
      desabled: false,
    });
    setMemberInfo({
      ...memberInfo,
      id: '',
      label: '',
      desabled: false,
    });
    setProductDetails({
      installmentAmount: ' ',
      time: ' ',
      installmentFrequency: ' ',
      maturityDate: '',
      maturityAmount: '',
    });
    setNominiList([
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
        dob: null,
      },
    ]);
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
    setAdminOfficeObj({
      id: null,
      label: '',
    });
    setDeskObj({
      id: null,
      label: '',
    });
    setServiceProductDetails();
    setTimePeriod('');
    setMaturityAmount(null);
  };
  let onSubmitData = async (e) => {
    e.preventDefault();
    let result = checkMandatory();
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
      dob: elem.birthDate,
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
    let payload;
    payload = {
      nextAppDesignationId: deskObj?.id ? parseInt(deskObj.id) : '',
      projectId: projectInfo.id,
      samityId: samityInfo.id,
      data: {
        projectId: projectInfo.id,
        productId: productInfo.id,
        samityId: samityInfo.id,
        customerId: memberInfo.id,
        installmentAmount: bangToEng(productDetails.installmentAmount),
        time: bangToEng(productDetails.time),
        installmentFrequency: 'M',
        intRate: bangToEng(serviceProductDetails ? serviceProductDetails : ''),
        maturityDate: bangToEng(productDetails.maturityDate),
        maturityAmount: bangToEng(maturityAmount),
        nomineeInfo: newNominiList,
        documentInfo: newDocList,
      },
    };
    if (result) {
      try {
        const assignProject = await axios.post(specificApplication + 'dpsApplication/loan', payload, config);
        NotificationManager.success(assignProject.data.message, '', 5000);
        clearField();
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
    }
  };
  let getAllDocument = async () => {
    try {
      let documentInfo = await axios.get(docTypeRoute, config);
      let documentListData = documentInfo.data.data;
      documentListData = documentListData.filter(
        (element) =>
          element.id == 3 ||
          element.id == 4 ||
          element.id == 5 ||
          element.id == 6 ||
          element.id == 9 ||
          element.id == 10,
      );
      setNomineeDocTypeList(documentListData);
    } catch (err) {
      errorHandler(err);
    }
  };
  const getDocumentType = async (value) => {
    try {
      const documentTypes = await axios.get(
        senctionDoc + '?projectId=' + projectInfo.id + '&productId=' + productInfo.id + '&customerId=' + value,
        config,
      );
      let documentTypeData = documentTypes.data.data;
      setDocumentTypeList(documentTypeData);
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
  let getGuardianRelationList = async () => {
    try {
      let guardianRelationInfo = await axios.get(codeMaster + '?codeType=RLN', config);
      let guardianRelationInfoData = guardianRelationInfo.data.data;
      setGuardianRelationList(guardianRelationInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };
  const getMemberInfo = async (value) => {
    // const list = [...grantorInfo];
    // let NID;

    try {
      const member = await axios.get(memberForGrantor + '=' + value, config);

      const nomineeInfo = member.data.data.nomineeInfo;
      const newNomineeInfo = nomineeInfo.map((obj) => {
        obj.docType = obj.documentType;
        obj.docNumber = obj.documentNo;
        (obj.nomineePicture = obj.nomineePictureUrl), (obj.nomineeSign = obj.nomineeSignUrl);
        obj.signUpdate = true;
        obj.imageUpdate = true;

        return obj;
      });
      setNominiList(newNomineeInfo);
      let nominiErrorInfo = [];
      nomineeInfo.map(() =>
        nominiErrorInfo.push({
          nomineeName: '',
          relation: '',
          docType: '',
          docNumber: '',
          percentage: '',
        }),
      );
      setNominiError([...nominiErrorInfo]);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getInsAmount = async (proId) => {
    if (proId != 'নির্বাচন করুন') {
      try {
        const allProduct = await axios.get(getInstallmentAmount + '?productId=' + proId, config);
        let installmentAmount = allProduct.data.data;
        setSavingsProductDetails(installmentAmount);
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  const handleProductDetails = (e) => {
    const { name, value, id } = e.target;
    if (name == 'maturityAmount') {
      setMaturityAmount(value);
    }
    if (name == 'installmentAmount' && value != 'নির্বাচন করুন') {
      getTimePeriod(value);
    }
    if (name == 'timeId' && value != 'নির্বাচন করুন') {
      setProductDetails({
        ...productDetails,
        time: '',
        maturityDate: '',
      });
      setServiceProductDetails('');
      const idType = value.split(',');
      getSeviceProductDetailsData(idType[1]);
      let date = moment(new Date())
        .add(Number(idType[0]) + 1, 'M')
        .set('date', 1);
      let formatedDate = moment(date).format('DD/MM/YYYY');
      setProductDetails({
        ...productDetails,
        time: idType[0],
        maturityDate: formatedDate,
        [name]: value,
      });
      return;
    }
    if (id == 'numField') {
      const regex = /[০-৯.,0-9]$/;
      if (regex.test(value) || value == '') {
        setProductDetails({
          ...productDetails,
          [name]: bangToEng(value),
        });
        // setFormErrors({ ...formErrors, withdrawAmount: "" });
      }
      // setProductDetails({
      //   ...productDetails,
      //   [name]: value.replace(/\D/g, ""),
      // });
      return;
    }
    setProductDetails({
      ...productDetails,
      [name]: value,
    });
  };

  useEffect(() => {
    let geodata = localStorage.getItem('officeGeoData');
    geodata = JSON.parse(geodata);
    getMemberByAdmin(geodata.id);
    setAdminOfficeObj({
      id: geodata.id,
      label: geodata.nameBn,
    });
  }, []);

  return (
    <>
      <Grid container spacing={2.5}>
        <Grid item md={3} lg={3} xs={4}>
          <Autocomplete
            disablePortal
            desabled={projectInfo.desabled}
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="projectName"
            key={projectInfo}
            onChange={(event, value) => {
              if (value == null) {
                setProjectInfo({
                  ...projectInfo,
                  id: null,
                  label: '',
                });
                setProductInfo({
                  ...productInfo,
                  id: null,
                  label: '',
                });
                setSamityInfo({
                  ...samityInfo,
                  id: '',
                  label: '',
                });
                setMemberInfo({
                  ...memberInfo,
                  id: '',
                  label: '',
                });
              } else {
                value &&
                  setProjectInfo({
                    ...projectInfo,
                    id: value.id,
                    label: value.label,
                  });

                getProduct(value.id);
                getSamity(value.id);
              }
            }}
            options={
              projectInfo
                ? projectInfo.projectName
                  ?.map((option) => ({
                    id: option.id,
                    label: option.projectNameBangla,
                  }))
                  .filter((e) => e.id != null && e.projectNameBangla !== null)
                : ''
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={projectInfo.id === '' ? star(' প্রকল্পের নাম নির্বাচন করুন') : star(' প্রকল্পের নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={projectInfo}
          />
          {(projectInfo.id == '' || !projectInfo.id) && <span style={{ color: 'red' }}>{formErrors.projectId}</span>}
        </Grid>
        <Grid item md={3} lg={3} xs={4}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="productName"
            key={productInfo}
            onChange={(event, value) => {
              if (value == null) {
                setProductInfo({
                  ...productInfo,
                  id: '',
                  label: '',
                  repFrq: '',
                });
                setSamityInfo({
                  ...samityInfo,
                  id: '',
                  label: '',
                  repFrq: '',
                });
                setMemberInfo({
                  ...memberInfo,
                  id: '',
                  label: '',
                });
              } else {
                value &&
                  setProductInfo({
                    ...productInfo,
                    id: value.id,
                    label: value.label,
                    repFrq: value.repFrq,
                  });
                getInsAmount(value.id);
              }
            }}
            options={
              productInfo
                ? productInfo.productName
                  .map((option) => ({
                    id: option.id,
                    label: option.productName,
                    repFrq: option.repFrq,
                  }))
                  .filter((e) => e.id != null && e.productName !== null)
                : ''
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={projectInfo.id === '' ? star(' প্রোডাক্ট এর নাম নির্বাচন করুন') : star(' প্রোডাক্ট এর নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={productInfo}
          />
          {(productInfo.id == '' || !productInfo.id) && <span style={{ color: 'red' }}>{formErrors.productId}</span>}
        </Grid>
        <Grid item md={3} lg={3} xs={4}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="samityName"
            key={samityInfo}
            onChange={(event, value) => {
              if (value == null) {
                setSamityInfo({
                  ...samityInfo,
                  id: '',
                  label: '',
                });
                setMemberInfo({
                  ...memberInfo,
                  id: '',
                  label: '',
                });
              } else {
                value &&
                  setSamityInfo({
                    ...samityInfo,
                    id: value.id,
                    label: value.label,
                  });
                getMember(value.id);
              }
            }}
            options={
              samityInfo
                ? samityInfo.samityName
                  .map((option) => ({
                    id: option.id,
                    label: option.samityName,
                  }))
                  .filter((e) => e.id != null && e.employeeId !== null)
                : ''
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={samityInfo.id === '' ? star(' সমিতির নাম নির্বাচন করুন') : star(' সমিতির নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={samityInfo}
          />
          {(samityInfo.id == '' || !samityInfo.id) && <span style={{ color: 'red' }}>{formErrors.samityId}</span>}
        </Grid>
        <Grid item md={3} lg={3} xs={4}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="memberName"
            key={memberInfo}
            onChange={(event, value) => {
              if (value == null) {
                setMemberInfo({
                  ...memberInfo,
                  id: '',
                  label: '',
                });
              } else {
                value &&
                  setMemberInfo({
                    ...memberInfo,
                    id: value.id,
                    label: value.label,
                  });
                getMemberInfo(value.id);
                getDocumentType(value.id);
              }
            }}
            options={
              memberInfo
                ? memberInfo.memberName
                  .map((option) => ({
                    id: option.id,
                    label: option.nameBn,
                  }))
                  .filter((e) => e.id != null && e.projectNameBangla !== null)
                : ''
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={projectInfo.id === '' ? star('সদস্যের নাম নির্বাচন করুন') : star(' সদস্যের নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={memberInfo}
          />
          {(memberInfo.id == '' || !memberInfo.id) && <span style={{ color: 'red' }}>{formErrors.memberId}</span>}
        </Grid>
      </Grid>

      <Grid container spacing={2.5} paddingTop={'15px'}>
        <Grid item md={12} lg={12} xs={12}>
          <SubHeading>সঞ্চয় প্রোডাক্ট এর বিবরণ</SubHeading>
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
          <TextField
            fullWidth
            label={star('কিস্তির পরিমাণ')}
            id="numField"
            name="installmentAmount"
            onChange={handleProductDetails}
            select
            SelectProps={{ native: true }}
            type="text"
            variant="outlined"
            size="small"
            value={productDetails ? productDetails.installmentAmount : null}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {savingsProductDetails
              ? savingsProductDetails.map((option) => (
                <option key={option.id} value={option.insAmt}>
                  {engToBang(option.insAmt)}
                </option>
              ))
              : null}
          </TextField>
          {(productDetails.installmentAmount == 'নির্বাচন করুন' || productDetails.installmentAmount == null) && (
            <span style={{ color: 'red' }}>{formErrors.installmentAmount}</span>
          )}
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
          <TextField
            fullWidth
            label={star('সময়কাল (মাস)')}
            id="numField"
            name="timeId"
            onChange={handleProductDetails}
            select
            SelectProps={{ native: true }}
            type="text"
            variant="outlined"
            size="small"
            value={productDetails ? productDetails.timeId : null}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {timePeriod
              ? timePeriod.map((option) => (
                <option key={option.id} value={option.timeId}>
                  {engToBang(option.timePeriod)}
                </option>
              ))
              : null}
          </TextField>
          {(productDetails.time == 'নির্বাচন করুন' || productDetails.time == null) && (
            <span style={{ color: 'red' }}>{formErrors.time}</span>
          )}
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
          <TextField
            fullWidth
            label={star('কিস্তির ফ্রিকোয়েন্সি ')}
            name="installmentFrequency"
            disabled
            //onChange={handleProductDetails}
            variant="outlined"
            size="small"
            value={productInfo.repFrq == 'M' ? 'মাসিক' : productInfo.repFrq == 'W' ? 'সাপ্তাহিক' : ' '}
          ></TextField>
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
          <TextField
            fullWidth
            label={star('ম্যাচুরিটি তারিখ')}
            disabled
            name="maturityDate"
            // onChange={handleProductDetails}
            variant="outlined"
            size="small"
            value={productDetails.maturityDate ? engToBang(productDetails.maturityDate) : ' '}
          ></TextField>
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
          <TextField
            fullWidth
            label={star('মুনাফা হার')}
            id="numField"
            name="interestRate"
            disabled
            // onChange={handleProductDetails}
            variant="outlined"
            size="small"
            value={serviceProductDetails ? engToBang(serviceProductDetails) : ''}
          ></TextField>
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
          <TextField
            fullWidth
            disabled
            label={star('ম্যাচুরিটি পরিমাণ')}
            id="numField"
            name="maturityAmount"
            onChange={handleProductDetails}
            variant="outlined"
            size="small"
            value={maturityAmount ? engToBang(maturityAmount) : ''}
          ></TextField>
          {!maturityAmount && <span style={{ color: 'red' }}>{formErrors.maturityAmount}</span>}
        </Grid>
      </Grid>
      <Grid container spacing={2.5} paddingTop={'15px'}>
        <Grid item md={12} lg={12} xs={12}>
          <NomineeSection
            componentName={componentName}
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
            handleNominiDate={handleNominiDate}
            nominiError={nominiError}
          />
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
      <Grid container spacing={2.5}>
        <Grid item lg={4} md={4} xs={12}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="officeName"
            onChange={(event, value) => {
              if (value == null) {
                setAdminOfficeObj({
                  id: '',
                  label: '',
                });
                setAdminEmployee([]);
              } else {
                value &&
                  setAdminOfficeObj({
                    id: value.id,
                    label: value.label,
                  });
                getMemberByAdmin(value.id);
              }
            }}
            options={officeNameData.map((option) => {
              return {
                id: option.id,
                label: option.nameBn,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={
                  adminOfficeObj.id
                    ? star('পর্যবেক্ষক/অনুমোদনকারীর অফিস')
                    : star('পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন')
                }
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF', margin: '5dp' }}
              />
            )}
            value={adminOfficeObj}
          />
          {(adminOfficeObj.id == '' || !adminOfficeObj.id) && (
            <span style={{ color: 'red' }}>{formErrors.officeId}</span>
          )}
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="serviceName"
            onChange={(event, value) => {
              if (value == null) {
                setDeskObj({
                  id: '',
                  label: '',
                });
              } else {
                value &&
                  setDeskObj({
                    id: value.id,
                    label: value.label,
                  });
              }
            }}
            options={adminEmployee
              .map((option) => ({
                id: option.designationId,
                label: option.nameBn ? option.nameBn : '' + '-' + option.designation,
              }))
              .filter((e) => e.designationId !== null)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={
                  deskObj.id === ''
                    ? star('পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন')
                    : star('পর্যবেক্ষক/অনুমোদনকারীর নাম')
                }
                variant="outlined"
                size="small"
              />
            )}
            value={deskObj}
          />
          {(deskObj.id == '' || !deskObj.id) && <span style={{ color: 'red' }}>{formErrors.deskId}</span>}
        </Grid>
        <Grid item md={3}>
          <Button variant="contained" onClick={onSubmitData} className="btn btn-primary" করুন>
            <PublishedWithChangesIcon />
            &nbsp;আবেদন জমা দিন
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default DpsApplication;
