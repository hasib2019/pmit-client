import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Autocomplete, Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { bangToEng, engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import ZoomImage from 'service/ZoomImage';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import {
  customerAccountInfo,
  employeeRecordByOffice,
  getDolMember,
  getSingleFdrAccountDetails,
  loanProject,
  memberForGrantor,
  officeName,
  product,
  samityNameRoute,
  specificApplication
} from '../../../../url/ApiList';
import star from '../../../mainSections/loan-management/loan-application/utils';
const Input = styled('input')({
  display: 'none',
});

const FdrClose = () => {
  const config = localStorageData('config');
  const officeInfo = localStorageData('officeGeoData');
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
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
  const [accountsList, setAccountsList] = useState([]);
  const [officeNameData, setOfficeNameData] = useState([]);
  // const [nomineeDocTypeList, setNomineeDocTypeList] = useState([]);
  // const [guardianRelationList, setGuardianRelationList] = useState([]);
  // let handleSign = (e, index) => {
  //   const { name } = e.target;
  //   const list = [...nominiList];
  //   // list[index]["slNo"] = index + 1;
  //   if (e.target.files && e.target.files.length > 0) {
  //     // setSelectedImage(e.target.files[0]);
  //     let file = e.target.files[0];
  //     //("Image Type", file.type);
  //     var reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     list[index][name] = file;
  //     reader.onload = () => {
  //       let base64Image = btoa(reader.result);
  //       list[index]['nomineeSign'] = base64Image;
  //       list[index]['nomineeSignType'] = file.type;
  //       setNominiList(list);
  //     };
  //   }
  // };
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
  // const [nominiList, setNominiList] = useState([
  //   {
  //     nomineeName: '',
  //     relation: '',
  //     docType: '',
  //     docNumber: '',
  //     percentage: '',
  //     nomineeSign: '',
  //     nomineeSignType: '',
  //     nomineePicture: '',
  //     nomineePictureType: '',
  //   },
  // ]);
  // const [nominiError, setNominiError] = useState([
  //   {
  //     nomineeName: '',
  //     relation: '',
  //     docType: '',
  //     docNumber: '',
  //     percentage: '',
  //   },
  // ]);
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
  const [accTitleObj, setAccTitleObj] = useState({
    id: '',
    label: '',
  });
  // const [fdrDurationList, setFdrDuraitionList] = useState([]);
  // const [intRateValue, setIntRateValue] = useState([]);
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
    documentData: {},
  });
  const [adminEmployee, setAdminEmployee] = useState([]);
  // let regexResultFunc = (regex, value) => {
  //   return regex.test(value);
  // };
  const [fdrDetails, setFdrDetails] = useState({});
  const clearField = () => {
    setProjectInfo({
      ...projectInfo,
      id: null,
      label: '',
    });
    setProductInfo({
      ...productInfo,
      id: '',
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
    setFdrDetails({});
    setAccTitleObj({
      id: '',
      label: '',
    });
    setMemberBasicInfo();
    // setNominiList([
    //   {
    //     nomineeName: '',
    //     relation: '',
    //     docType: '',
    //     docNumber: '',
    //     percentage: '',
    //     nomineeSign: '',
    //     nomineeSignType: '',
    //     nomineePicture: '',
    //     nomineePictureType: '',
    //   },
    // ]);
    setProductDetailsInfo();
    setAdminOfficeObj({
      id: officeInfo?.id,
      label: officeInfo?.nameBn,
    });
    setDeskObj({
      id: '',
      label: '',
    });

  };

  // let signatureSetup = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     // setSelectedImage(e.target.files[0]);
  //     let file = e.target.files[0];
  //     //("Image Type", file.type);
  //     var reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     setSignName(file);
  //     reader.onload = () => {
  //       let base64Image = btoa(reader.result);
  //       setSignature((prevState) => ({
  //         ...prevState,
  //         signature: base64Image,
  //         mimetypesignature: file.type,
  //       }));
  //     };
  //   }
  // };
  const handleProductDetails = (e) => {
    let { name, value } = e.target;
    // setFdrDetails({
    //   ...fdrDetails,
    //   [name]:value.replace(/[^0-9.''-\s]/gi, "")
    //   });
    const regex = /[০-৯.,0-9]$/;
    if (regex.test(value) || value == '') {
      setFdrDetails({
        ...fdrDetails,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    // getAllDocument();
    getOfficeName();
    getProject();
    // getGuardianRelationList();
    if (officeInfo?.id) getMemberByAdmin(officeInfo?.id);
  }, []);

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

      // const nomineeInfo = member.data.data.nomineeInfo;

      // const newNomineeInfo = nomineeInfo.map((obj, i) => {
      //   obj.docType = obj.documentType;
      //   obj.docNumber = obj.documentNo;
      //   return obj;
      // });
      // setNominiList(newNomineeInfo);
      // let nominiErrorInfo = [];
      // nomineeInfo.map((elem) =>
      //   nominiErrorInfo.push({
      //     nomineeName: '',
      //     relation: '',
      //     docType: '',
      //     docNumber: '',
      //     percentage: '',
      //   }),
      // );
      // setNominiError([...nominiErrorInfo]);
    } catch (error) {
      errorHandler(error);
    }
  };
  // let getAllDocument = async () => {
  //   try {
  //     let documentInfo = await axios.get(docTypeRoute, config);
  //     let documentListData = documentInfo.data.data;

  //     setNomineeDocTypeList(documentListData);
  //   } catch (err) {
  //     errorHandler(err);
  //   }
  // };
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
  // let getGuardianRelationList = async () => {
  //   try {
  //     let guardianRelationInfo = await axios.get(codeMaster + '?codeType=RLN', config);
  //     let guardianRelationInfoData = guardianRelationInfo.data.data;
  //     setGuardianRelationList(guardianRelationInfoData);
  //   } catch (err) {
  //     errorHandler(err);
  //   }
  // };
  // let getTimePeriod = async (productId, amount) => {
  //   try {
  //     let fdrDuration = await axios.get(
  //       getsevingsProductDetails + '?productId=' + productId + '&installmentAmount=' + amount,
  //       config,
  //     );
  //     let fdrDuralitonList = fdrDuration.data.data;
  //     setFdrDuraitionList(fdrDuralitonList);
  //   } catch (err) {
  //     errorHandler(err);
  //   }
  // };
  // let getTntRate = async (id) => {
  //   try {
  //     let fdrDuration = await axios.get(getsevingsProductDetails + '?productInterestId=' + id, config);
  //     let fdrDuralitonList = fdrDuration.data.data;
  //     setIntRateValue(fdrDuralitonList);
  //   } catch (err) {
  //     errorHandler(err);
  //   }
  // };
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
  const getAccount = async (projectId, samityId, memberId) => {
    try {
      const allAccounts = await axios.get(
        customerAccountInfo +
        '?projectId=' +
        projectId +
        '&samityId=' +
        samityId +
        '&customerId=' +
        memberId +
        '&allAccounts=true',
        config,
      );
      let allAccountData = allAccounts.data.data.filter((value) => value.depositNature == 'F');
      setAccountsList(allAccountData);
      // setAllProductData(productList);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getSingleFdrAccountDetailsData = async (accTitle) => {
    try {
      const accDetailsData = await axios.get(getSingleFdrAccountDetails + '?accountId=' + accTitle, config);
      let accDetails = accDetailsData?.data?.data;
      setProductDetailsInfo(accDetails);
    } catch (error) {
      errorHandler(error);
    }
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    // let result = checkMandatory();
    // const newNominiList = nominiList.map((elem) => ({
    //   nomineeName: elem.nomineeName,
    //   ...(elem.relation != "" && { relation: Number(elem.relation) }),
    //   ...(elem.percentage != "" && { percentage: Number(bangToEng(elem.percentage)) }),
    //   nomineeSign: elem.nomineeSign,
    //   docType: elem.docType,
    //   docNumber: bangToEng(elem.docNumber),
    //   nomineeSignType: elem.nomineeSignType,
    //   nomineePicture: elem.nomineePicture,
    //   nomineePictureType: elem.nomineePictureType,
    // }));
    let payload;
    payload = {
      nextAppDesignationId: deskObj?.id ? parseInt(deskObj.id) : '',
      projectId: projectInfo.id,
      samityId: samityInfo.id,
      data: {
        accountId: accTitleObj.id,
        projectId: projectInfo.id,
        productId: productDetailsInfo.productId,
        samityId: samityInfo.id,
        customerId: memberInfo.id,
        fdrAmount: productDetailsInfo?.fdrAmt,
        givenProfitAmount: bangToEng(fdrDetails.profitAmount),
      },
    };

    try {
      const assignProject = await axios.post(specificApplication + 'fdrClose/loan', payload, config);
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
  };
  return (
    <>
      <Grid container display="flex" spacing={3}>
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
                    setAccTitleObj({
                      id: '',
                      label: '',
                    });
                    setMemberBasicInfo();
                    setProductDetailsInfo();
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
                    setAccTitleObj({
                      id: '',
                      label: '',
                    });
                    setMemberBasicInfo();
                    setProductDetailsInfo();
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
                    setMemberBasicInfo();
                    setAccTitleObj({
                      id: '',
                      label: '',
                    });
                    setProductDetailsInfo();
                  } else {
                    value &&
                      setMemberInfo({
                        ...memberInfo,
                        id: value.id,
                        label: value.label,
                      });
                    getMemberInfo(value.id);
                    getAccount(projectInfo.id, samityInfo.id, value.id);
                    // getSingleDpsAccountDetailsData(value.id);
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
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="accTitle"
                key={accTitleObj}
                onChange={(event, value) => {
                  if (value == null) {
                    setAccTitleObj({
                      id: '',
                      label: '',
                    });
                    setProductDetailsInfo();
                  } else {
                    value &&
                      setAccTitleObj({
                        id: value.id,
                        label: value.label,
                      });
                    getSingleFdrAccountDetailsData(value.id);
                    // getMemberInfo(value.id);
                    // getDocumentType(value.id);
                  }
                }}
                options={
                  accountsList
                    ? accountsList.map((option) => ({
                      id: option.accountId,
                      label: option.productName + '-' + option.accountNo,
                    }))
                    : ''
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={
                      projectInfo?.id === '' ? star('সদস্যের অ্যাকাউন্ট নির্বাচন করুন') : star(' সদস্যের অ্যাকাউন্ট')
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
                value={accTitleObj}
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
            <Grid item md={6} xs={12}>
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
            <Grid item md={12} xs={12} display="flex" justifyContent="space-around">
              <Box className="uploadImage">
                <Typography component="div">
                  <Stack direction="row" alignItems="center" spacing={2.5}>
                    <label htmlFor="contained-button-file3">
                      <Input
                        accept="image/*"
                        id="contained-button-file3"
                        multiple
                        type="file"
                      // onChange={ImageSetup}
                      // onClick={(event) => {
                      //   event.target.value = null;
                      // }}
                      />
                      <ZoomImage
                        src={memberBasicInfo?.documentData?.memberPictureUrl}
                        divStyle={{
                          display: 'flex',
                          justifyContent: 'center',
                          height: '100%',
                          width: '100%',
                        }}
                        imageStyle={{
                          height: '100px',
                          width: '100px',
                        }}
                        key={1}
                        type={imageType(memberBasicInfo?.documentData.memberPicture)}
                      />
                    </label>
                  </Stack>
                </Typography>

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
                        // onChange={signatureSetup}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                      />
                      <ZoomImage
                        src={memberBasicInfo?.documentData?.memberSignUrl}
                        divStyle={{
                          display: 'flex',
                          justifyContent: 'center',
                          height: '100%',
                          width: '100%',
                        }}
                        imageStyle={{
                          height: '100px',
                          width: '100px',
                        }}
                        key={1}
                        type={imageType(memberBasicInfo?.documentData?.memberSign)}
                      />
                    </label>
                  </Stack>
                </Typography>
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                desabled
                fullWidth
                label={star('প্রোডাক্টের নাম')}
                id="numField"
                name="intRate"
                //onChange={handleProductDetails}

                type="text"
                variant="outlined"
                size="small"
                value={(productDetailsInfo?.productName && productDetailsInfo?.productName) || ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('টাকার পরিমান')}
                id="numField"
                name="fdrAmount"
                // onChange={handleProductDetails}

                type="text"
                variant="outlined"
                size="small"
                value={productDetailsInfo?.fdrAmt ? engToBang(productDetailsInfo.fdrAmt) : ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মেয়াদ')}
                id="numField"
                name="fdrTime"
                type="text"
                variant="outlined"
                size="small"
                value={productDetailsInfo?.fdrDuration ? engToBang(productDetailsInfo.fdrDuration / 12) : ' '}
              ></TextField>
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
                value={(productDetailsInfo?.intRate && engToBang(productDetailsInfo.intRate)) || ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('এফডিআর গঠনের তারিখ')}
                id="numField"
                name="expDate"
                //onChange={handleProductDetails}

                type="text"
                variant="outlined"
                size="small"
                value={(productDetailsInfo?.effDate && engToBang(dateFormat(productDetailsInfo.effDate))) || ''}
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
                value={(productDetailsInfo?.expDate && engToBang(dateFormat(productDetailsInfo.expDate))) || ''}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মুনাফা')}
                id="numField"
                name="profitAmount"
                onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={productDetailsInfo?.profitAmount ? engToBang(productDetailsInfo?.profitAmount) : engToBang(0)}
              ></TextField>
            </Grid>
          </Grid>
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
          {/* {(adminOfficeObj.id == "" || !adminOfficeObj.id) && (
            <span style={{ color: "red" }}>{formErrors.officeId}</span>
          )} */}
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
          {/* {(deskObj.id == "" || !deskObj.id) && (
            <span style={{ color: "red" }}>{formErrors.deskId}</span>
          )} */}
        </Grid>
        <Grid item md={3}>
          <Button variant="contained" onClick={onSubmitData} className="btn btn-primary" করুন sx={{ height: '100%' }}>
            <PublishedWithChangesIcon />
            &nbsp;আবেদন জমা দিন
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FdrClose;
