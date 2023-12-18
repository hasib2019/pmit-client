/* eslint-disable no-misleading-character-class */
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import NomineeSection from 'components/mainSections/samity-managment/edit-member-registration/NomineeInfo';
import {
  bangToEng,
  engToBang,
  myValidate,
} from 'components/mainSections/samity-managment/member-registration/validator';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  codeMaster,
  docTypeRoute,
  employeeRecordByOffice,
  getDolMember,
  getsevingsProductDetails,
  loanProject,
  memberForGrantor,
  officeName,
  product,
  samityNameRoute,
  specificApplication,
} from '../../../../url/ApiList';
import star from '../../../mainSections/loan-management/loan-application/utils';

import moment from 'moment';
import { dateFormat } from 'service/dateFormat';
const Input = styled('input')({
  display: 'none',
});

const FdrApplication = () => {
  const config = localStorageData('config');
  const officeInfo = localStorageData('officeGeoData');
  // const myStyledComponentStyles = {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   boxShadow: 'none',
  // };
  const [projectInfo, setProjectInfo] = useState({
    projectName: [],
    id: null,
    label: '',
    desabled: false,
  });
  const [productInfo, setProductInfo] = useState({
    productName: [],
    id: null,
    label: '',
    repFrq: '',
    desabled: false,
  });
  const [adminOfficeObj, setAdminOfficeObj] = useState({
    id: officeInfo?.id,
    label: officeInfo?.nameBn,
  });
  const [deskObj, setDeskObj] = useState({
    id: '',
    label: '',
  });
  const [productDetailsInfo, setProductDetailsInfo] = useState({
    profitAmount: '',
    expDate: '',
    intRate: '',
    fdrTime: '',
    id: '',
    fdrAmount: '',
  });
  const [officeNameData, setOfficeNameData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [nomineeDocTypeList, setNomineeDocTypeList] = useState([]);
  const [guardianRelationList, setGuardianRelationList] = useState([]);
  const [flagForImage] = useState('data:image/jpg;base64,');
  let handleSign = (e, index) => {
    const { name } = e.target;
    const list = [...nominiList];
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
    // if (
    //   productDetails.installmentAmount == null ||
    //   productDetails.installmentAmount == "নির্বাচন করুন"
    // ) {
    //   result = false;
    //   formErrors.installmentAmount = "কিস্তির পরিমাণ নির্বাচন করুন";
    // }
    // if (productDetails.time == null || productDetails.time == "নির্বাচন করুন") {
    //   result = false;
    //   formErrors.time = "সময়কাল নির্বাচন করুন";
    // }
    // if (productDetails.maturityAmount == null) {
    //   result = false;
    //   formErrors.maturityAmount = "ম্যাচুরিটি পরিমাণ প্রদান করুন";
    // }
    setFormErrors(formErrors);
    return result;
  };
  const [expDate, setExpDate] = useState(' ');
  const [fdrDurationList, setFdrDuraitionList] = useState([]);
  const [intRateValue, setIntRateValue] = useState([]);
  const [memberBasicInfo, setMemberBasicInfo] = useState({
    nid: '',
    fatherName: '',
    motherName: '',
    districtNameBangla: '',
    uniThanaPawNameBangla: '',
    birthDate: null,
    address: '',
    mobile: '',
    intRateValue: '',
  });
  const [adminEmployee, setAdminEmployee] = useState([]);
  let regexResultFunc = (regex, value) => {
    return regex.test(value);
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
      },
    ]);
  };
  let handleImage = (e, index) => {
    const { name } = e.target;
    const list = [...nominiList];
    // list[index]["slNo"] = index + 1;
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
  const clearField = () => {
    setProjectInfo({
      ...projectInfo,
      id: null,
      label: '',
      desabled: false,
    });
    setProductInfo({
      productName: [],
      id: '',
      label: '',
      repFrq: '',
      desabled: false,
    });
    setSamityInfo({
      samityName: [],
      id: '',
      label: '',
      desabled: false,
    });
    setMemberInfo({
      memberName: [],
      id: '',
      label: '',
      desabled: false,
    });
    setMemberBasicInfo();
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
      },
    ]);
    setProductDetailsInfo();
    setAdminOfficeObj({
      id: officeInfo?.id,
      label: officeInfo?.nameBn,
    });
    setDeskObj({
      id: '',
      label: '',
    });
    setExpDate('');
    setIntRateValue({
      intRate: 0,
    });
  };
  const handleProductDetails = (e) => {
    const regex = /[০-৯.,0-9]$/;
    let { name, value } = e.target;
    if (name == 'fdrAmount') {
      if (regex.test(value) || value == '') {
        getTimePeriod(productInfo.id, bangToEng(value));
        setProductDetailsInfo({
          ...productDetailsInfo,
          [name]: bangToEng(value),
        });
      }
    }
    if (name == 'fdrTime') {
      value = JSON.parse(value);
      getTntRate(value.id);
      setProductDetailsInfo({
        ...productDetailsInfo,
        fdrTime: value.fdrTime,
        id: value.id,
      });
      let expDateInfo = moment(new Date()).add(moment(value.fdrTime), 'M').format('DD/MM/YYYY');
      setExpDate(expDateInfo);
    }
    if (name == 'profitAmount') {
      setProductDetailsInfo({
        ...productDetailsInfo,
        [name]: bangToEng(value),
      });
    }
    return;
  };
  useEffect(() => {
    getAllDocument();
    getOfficeName();
    getProject();
    getGuardianRelationList();
    if (officeInfo?.id) {
      setAdminOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
      getMemberByAdmin(officeInfo?.id);
    }
  }, []);

  useEffect(() => {
    getMaturityAmount();
  }, [productDetailsInfo?.fdrTime, intRateValue, productDetailsInfo?.fdrAmount]);

  let getMaturityAmount = () => {
    let maturityAmount = Math.floor(
      Number(productDetailsInfo?.fdrAmount) *
      Number(intRateValue[0]?.intRate / 100) *
      Number(productDetailsInfo?.fdrTime),
    );
    setProductDetailsInfo({
      ...productDetailsInfo,
      profitAmount: maturityAmount,
    });
  };
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
        const allProduct = await axios.get(product + '?projectId=' + proId + '&productType=L&depositNature=F', config);
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
  const getMemberInfo = async (value) => {
    try {
      const member = await axios.get(memberForGrantor + '=' + value, config);

      const memberDetails = member.data.data;

      let nid = memberDetails?.documentData?.own.filter(
        (value) => value.documentType == 'NID' || value.documentType == 'BRN',
      )[0]['documentNumber'];
      setMemberBasicInfo({
        ...memberBasicInfo,
        ...memberDetails,
        nid,
      });
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
  let getAllDocument = async () => {
    try {
      let documentInfo = await axios.get(docTypeRoute, config);
      let documentListData = documentInfo.data.data;
      setNomineeDocTypeList(documentListData);
    } catch (err) {
      errorHandler(err);
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
  let getGuardianRelationList = async () => {
    try {
      let guardianRelationInfo = await axios.get(codeMaster + '?codeType=RLN', config);
      let guardianRelationInfoData = guardianRelationInfo.data.data;
      setGuardianRelationList(guardianRelationInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };
  let getTimePeriod = async (productId, amount) => {
    try {
      let fdrDuration = await axios.get(
        getsevingsProductDetails + '?productId=' + productId + '&installmentAmount=' + amount,
        config,
      );
      let fdrDuralitonList = fdrDuration.data.data;
      setFdrDuraitionList(fdrDuralitonList);
    } catch (err) {
      errorHandler(err);
    }
  };
  let getTntRate = async (id) => {
    try {
      let fdrDuration = await axios.get(getsevingsProductDetails + '?productInterestId=' + id, config);
      let fdrDuralitonList = fdrDuration.data.data;
      setIntRateValue(fdrDuralitonList);
    } catch (err) {
      errorHandler(err);
    }
  };
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
      birthDate: elem.birthDate,
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
        profitAmount: bangToEng(productDetailsInfo.profitAmount),
        fdrAmount: bangToEng(productDetailsInfo.fdrAmount),
        fdrDuration: bangToEng(productDetailsInfo?.fdrTime),
        expDate,
        intRate: bangToEng(intRateValue ? intRateValue[0]?.intRate : ''),
        nomineeInfo: newNominiList,
      },
    };

    if (result) {
      try {
        const assignProject = await axios.post(specificApplication + 'fdrApplication/loan', payload, config);
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

  return (
    <>
      <Grid container display="flex" spacing={3.5}>
        <Grid item md={6}>
          <SubHeading>সদস্যের ব্যক্তিগত তথ্য</SubHeading>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
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
                    // setProductInfo({
                    //   ...productInfo,
                    //   id: null,
                    //   label: "",
                    // });
                    // setSamityInfo({
                    //   ...samityInfo,
                    //   id: "",
                    //   label: "",
                    // });
                    // setMemberInfo({
                    //   ...memberInfo,
                    //   id: "",
                    //   label: "",
                    // });
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
                      .map((option) => ({
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
            </Grid>
            <Grid item md={6} xs={12}>
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
              {/* {(samityInfo.id == "" || !samityInfo.id) && (
            <span style={{ color: "red" }}>{formErrors.samityId}</span>
          )} */}
            </Grid>
            <Grid item md={6} xs={12}>
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
                    // getDocumentType(value.id);
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
              {/* {(memberInfo.id == "" || !memberInfo.id) && (
            <span style={{ color: "red" }}>{formErrors.memberId}</span>
          )} */}
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('জন্ম তারিখ')}
                id="numField"
                name="installmentAmount"
                // onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={(memberBasicInfo?.birthDate && engToBang(dateFormat(memberBasicInfo.birthDate))) || ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('জাতীয় পরিচয়পত্র নম্বর')}
                id="numField"
                name="installmentAmount"
                //  onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={memberBasicInfo?.nid ? engToBang(memberBasicInfo.nid) : ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('পিতার নাম')}
                id="numField"
                name=""
                // onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={memberBasicInfo?.fatherName ? memberBasicInfo.fatherName : ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মাতার নাম')}
                id="numField"
                name="installmentAmount"
                //  onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={memberBasicInfo?.motherName ? memberBasicInfo.motherName : ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মোবাইল নম্বর')}
                id="numField"
                name="installmentAmount"
                //onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={memberBasicInfo?.mobile ? engToBang(memberBasicInfo.mobile) : ''}
              ></TextField>
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label={star('বর্তমান ঠিকানা')}
                id="numField"
                name="address"
                //onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={
                  memberBasicInfo?.presentAddress
                    ? memberBasicInfo?.presentAddress?.uniThanaPawNameBangla +
                    ',' +
                    memberBasicInfo?.presentAddress?.districtNameBangla
                    : ''
                }
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6}>
          <SubHeading>এফ. ডি. আর সংক্রান্ত তথ্য</SubHeading>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                desabled={projectInfo.desabled}
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="productName"
                key={productInfo}
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
                      setProductInfo({
                        ...productInfo,
                        id: value.id,
                        label: value.label,
                      });

                    // getProduct(value.id);
                    // getSamity(value.id);
                  }
                }}
                options={
                  productInfo
                    ? productInfo.productName
                      .map((option) => ({
                        id: option.id,
                        label: option.productName,
                      }))
                      .filter((e) => e.id != null && e.projectNameBangla !== null)
                    : ''
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={projectInfo.id === '' ? star(' প্রোডাক্টের নাম নির্বাচন করুন') : star(' প্রোডাক্টের নাম')}
                    variant="outlined"
                    size="small"
                  />
                )}
                value={productInfo}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('টাকার পরিমান')}
                id="numField"
                name="fdrAmount"
                onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={productDetailsInfo?.fdrAmount ? engToBang(productDetailsInfo.fdrAmount) : ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মেয়াদ')}
                id="numField"
                name="fdrTime"
                onChange={handleProductDetails}
                select
                SelectProps={{ native: true }}
                type="text"
                variant="outlined"
                size="small"
                value={
                  productDetailsInfo?.id && productDetailsInfo?.fdrTime
                    ? JSON.stringify({
                      id: productDetailsInfo.id,
                      fdrTime: productDetailsInfo.fdrTime,
                    })
                    : ' '
                }
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {fdrDurationList
                  ? fdrDurationList.map((option) => (
                    <option
                      key={option.id}
                      value={JSON.stringify({
                        id: option.id,
                        fdrTime: option.timePeriod,
                      })}
                    >
                      {engToBang(option.timePeriod / 12 + ' ' + 'বছর')}
                    </option>
                  ))
                  : ''}
              </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                desabled
                fullWidth
                label={star('মুনাফা রেট')}
                id="numField"
                name="intRate"
                //onChange={handleProductDetails}

                type="text"
                variant="outlined"
                size="small"
                value={(intRateValue && engToBang(intRateValue[0]?.intRate)) || ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মেয়াদ পূরণের তারিখ')}
                id="numField"
                name="expDate"
                //onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={expDate}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মেয়াদান্তে মুনাফা')}
                id="numField"
                name="profitAmount"
                // onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={productDetailsInfo?.profitAmount ? engToBang(productDetailsInfo?.profitAmount) : ''}
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2.5} paddingTop={'15px'}>
        <Grid item md={12} lg={12} xs={12}>
          <NomineeSection
            //  componentName={componentName}
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
      </Grid>
      <Grid container spacing={2.5} m={1}>
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

export default FdrApplication;
