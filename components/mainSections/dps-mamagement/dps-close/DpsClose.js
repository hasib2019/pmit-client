import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Autocomplete, Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { parseInt } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import ZoomImage from 'service/ZoomImage';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from '../../../../service/numberConverter';
import {
  customerAccountInfo,
  employeeRecordByOffice,
  getDolMember,
  getSingleDpsAccountDetails,
  loanProject,
  memberForGrantor,
  officeName,
  product,
  samityNameRoute,
  specificApplication
} from '../../../../url/ApiList';
import star from '../../../mainSections/loan-management/loan-application/utils';
const DpsClose = () => {
  const config = localStorageData('config');
  const officeInfo = localStorageData('officeGeoData');
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  const [formErrors, setFormErrors] = useState({});
  const [officeNameData, setOfficeNameData] = useState([]);
  const [projectInfo, setProjectInfo] = useState({
    projectName: [],
    id: null,
    label: '',
    desabled: false,
  });
  const [adminEmployee, setAdminEmployee] = useState([]);
  const [adminOfficeObj, setAdminOfficeObj] = useState({
    id: officeInfo?.id,
    label: officeInfo?.nameBn,
  });
  const [memberBasicInfo, setMemberBasicInfo] = useState();
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
  const [accountsList, setAccountsList] = useState([]);
  const [accTitleObj, setAccTitleObj] = useState({
    id: '',
    label: '',
  });
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
  // const [timePeriod, setTimePeriod] = useState([]);
  const [productDetails, setProductDetails] = useState({
    currentBalance: '',
    maturityAmount: '',
    maturityDate: '',
    paidIns: '',
    totalIns: '',
    unpaidIns: '',
    interestAmounts: null,
  });
  // const [maturityStatus, setMaturityStatus] = useState(false);
  // const [serviceProductDetails, setServiceProductDetails] = useState();
  // const [employeeRecords, setEmployeeRecords] = useState([]);
  // const [memberAccDetails, setMemberAccDetails] = useState([]);

  // const handleChangeOffice = (e, values) => {
  //   setOfficeId(values.id);
  //   getEmployeeName(parseInt(values.id));
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

  useEffect(() => {
    getOfficeName();
    getProject();
    if (officeInfo.id) {
      setAdminOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
      getMemberByAdmin(officeInfo?.id);
    }
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
      formErrors.officeId = 'পর্যবেক্ষক/অনুমোদনকারীর অফিস প্রদান করুন';
    }
    if (deskObj.id == null) {
      result = false;
      formErrors.deskId = 'পর্যবেক্ষক/অনুমোদনকারীর নাম প্রদান করুন';
    }
    if (accTitleObj.id == '') {
      result = false;
      formErrors.accountId = 'সদস্যের অ্যাকাউন্ট নম্বর প্রদান করুন';
    }
    setFormErrors(formErrors);
    return result;
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
        getProduct(projectList[0].id);
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
        return productList;
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  // const getTimePeriod = async (insAmount) => {
  //   try {
  //     const timePeriodDetails = await axios.get(
  //       getsevingsProductDetails + '?productId=' + productInfo.id + '&installmentAmount=' + insAmount,
  //       config,
  //     );
  //     const timeRange = timePeriodDetails.data.data;
  //     const mewTimePeriod = timeRange.map((obj, i) => {
  //       obj['timeId'] = obj['timePeriod'] + ',' + obj['id'];
  //       return obj;
  //     });
  //     setTimePeriod(mewTimePeriod);
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // };
  // const getSeviceProductDetailsData = async (id) => {
  //   try {
  //     const serviceProductDetails = await axios.get(getsevingsProductDetails + '?productInterestId=' + id, config);
  //     const serviceProDetails = serviceProductDetails.data.data;
  //     setServiceProductDetails(serviceProDetails[0].intRate);
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // };
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
        return memberData;
      } catch (error) {
        errorHandler(error);
      }
    } else {
      // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
    }
  };
  const getSingleDpsAccountDetailsData = async (accTitle) => {
    try {
      const accDetailsData = await axios.get(getSingleDpsAccountDetails + '?accountId=' + accTitle, config);

      let accDetails = accDetailsData?.data?.data;
      let unpaidIns = Number(accDetails.totalIns) - Number(accDetails.paidIns);
      let interestAmounts = Number(accDetails.maturityAmount) - Number(accDetails.currentBalance);
      // setProductDetails(accDetails);
      setProductDetails({
        ...accDetails,
        unpaidIns,
      });
      let today = moment(new Date()).format('DD/MM/YYYY');
      let maturityDate = moment(accDetails.maturityDate).format('DD/MM/YYYY');
      let mature = moment(today).isSame(maturityDate);
      mature &&
        setProductDetails({
          ...accDetails,
          interestAmounts,
        })
      // setMaturityStatus(true);
    } catch (error) {
      errorHandler(error);
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
      let allAccountData = allAccounts.data.data.filter((value) => value.depositNature == 'C');
      setAccountsList(allAccountData);
      // setAllProductData(productList);
    } catch (error) {
      errorHandler(error);
    }
  };
  const clearField = () => {
    setProjectInfo({
      projectName: [...projectInfo.projectName],
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
    setProductDetails({
      currentBalance: '',
      maturityAmount: '',
      maturityDate: '',
      paidIns: '',
      totalIns: '',
      unpaidIns: '',
      interestAmounts: '',
    });
    setAccTitleObj({
      id: '',
      label: '',
    });
    setAdminOfficeObj({
      id: officeInfo?.id,
      label: officeInfo?.nameBn,
    });
    setDeskObj({
      id: '',
      label: '',
    });
    // setServiceProductDetails();
    setMemberBasicInfo();
  };
  let onSubmitData = async (e) => {
    e.preventDefault();
    let result = checkMandatory();
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
        customerAcc: accTitleObj.id,
      },
    };
    if (result) {
      try {
        const assignProject = await axios.post(specificApplication + 'dpsClose/loan', payload, config);
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
    } catch (error) {
      errorHandler(error);
    }
  };
  // const getInsAmount = async (proId) => {
  //   if (proId != "নির্বাচন করুন") {
  //     try {
  //       const allProduct = await axios.get(
  //         getInstallmentAmount + "?productId=" + proId,
  //         config
  //       );
  //       let installmentAmount = allProduct.data.data;
  //       setSavingsProductDetails(installmentAmount);
  //     } catch (error) {
  //       errorHandler(error);
  //     }
  //   }
  // };
  const handleProductDetails = (e) => {
    // const regex = /[০-৯.,0-9]$/;
    const { name, value, id } = e.target;
    if (name == 'interestAmounts') {
      // if (regex.test(e.target.value) || e.target.value == "") {
      setProductDetails({
        ...productDetails,
        interestAmounts: bangToEng(e.target.value),
      });
      // }
    }
    if (id == 'numField') {
      setProductDetails({
        ...productDetails,
        [name]: value.replace(/\D/g, ''),
      });
    }
    // setProductDetails({
    //   ...productDetails,
    //   [name]: value,
    // });
  };

  return (
    <>
      <Grid container spacing={2.5} className="section">
        <Grid item md={4} lg={4} xs={4}>
          <Autocomplete
            disablePortal
            // desabled={projectInfo.desabled}
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
                setAccTitleObj({
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
                label={projectInfo?.id === '' ? star(' প্রকল্পের নাম নির্বাচন করুন') : star(' প্রকল্পের নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={projectInfo}
          />
          {(!projectInfo?.id || projectInfo?.id == '') && <span style={{ color: 'red' }}>{formErrors.projectId}</span>}
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
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
              } else {
                value &&
                  setProductInfo({
                    ...productInfo,
                    id: value.id,
                    label: value.label,
                    repFrq: value.repFrq,
                  });
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
                label={projectInfo?.id === '' ? star(' প্রোডাক্ট এর নাম নির্বাচন করুন') : star(' প্রোডাক্ট এর নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={productInfo}
          />
          {(productInfo.id == '' || !productInfo.id) && <span style={{ color: 'red' }}>{formErrors.productId}</span>}
        </Grid>
        <Grid item md={4} lg={4} xs={4}>
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
        <Grid item md={6} lg={6} xs={4}>
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
                setAccTitleObj({
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
                setAccTitleObj({
                  id: '',
                  label: '',
                });
                // getMemberInfo(value.id);
                // getDocumentType(value.id);
                getMemberInfo(value.id);
                getAccount(projectInfo.id, samityInfo.id, value.id);
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
                label={projectInfo?.id === '' ? star('সদস্যের নাম নির্বাচন করুন') : star(' সদস্যের নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={memberInfo}
          />
          {(!memberInfo.id || memberInfo.id == '') && <span style={{ color: 'red' }}>{formErrors.memberId}</span>}
        </Grid>
        <Grid item md={6} lg={6} xs={4}>
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
              } else {
                value &&
                  setAccTitleObj({
                    id: value.id,
                    label: value.label,
                  });
                getSingleDpsAccountDetailsData(value.id);
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
                label={accTitleObj?.id === '' ? star('সদস্যের অ্যাকাউন্ট নির্বাচন করুন') : star(' সদস্যের অ্যাকাউন্ট')}
                variant="outlined"
                size="small"
              />
            )}
            value={accTitleObj}
          />
          {(accTitleObj.id == '' || !accTitleObj.id) && <span style={{ color: 'red' }}>{formErrors.accountId}</span>}
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>সদস্যের সাধারণ তথ্য</SubHeading>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <Box>
            <Typography>
              <span className="label">পিতার নাম : &nbsp;</span>
              {memberBasicInfo && memberBasicInfo.fatherName}
            </Typography>
            <Typography>
              <span className="label">সদস্যের জাতীয় পরিচয়পত্র নং : &nbsp;</span>
              {memberBasicInfo && engToBang(memberBasicInfo.nid)}
            </Typography>
          </Box>

          <Box
            className="uploadImage"
          // sx={{ margin: "0px 0px 0px auto" }}
          >
            {/* <Typography component="div">
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <label htmlFor="contained-button-file4">
                    <Input
                      accept="image/*"
                      id="contained-button-file4"
                      multiple
                      type="file"
                      // onChange={signatureSetup}
                      // onClick={(event) => {
                      //   event.target.value = null;
                      // }}
                    />
                     <ZoomImage
                                  src={memberBasicInfo?.documentData?.memberPictureUrl}
                                  divStyle={{
                                    display: "flex",
                                    justifyContent: "center",
                                    height: "100%",
                                    width: "100%",
                                  }}
                                  imageStyle={{
                                    height: "100px",
                                    width: "100px",
                                  }}
                                  key={1}
                                  type={imageType(memberBasicInfo?.documentData?.memberPicture)}
                                />
                  </label>
                </Stack>
              </Typography> */}
            <Typography component="div">
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <label htmlFor="contained-button-file3">
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
        </Box>
      </Grid>

      <Grid container className="section">
        <SubHeading>সঞ্চয় প্রোডাক্ট এর বিবরণ</SubHeading>
        <Grid item xs={12}>
          <Grid container spacing={2.5}>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('কিস্তির পরিমান')}
                //id="numField"
                disabled
                name="totalInsNumber"
                onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={productDetails?.depositAmt ? engToBang(productDetails.depositAmt) : ''}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সর্বমোট কিস্তির সংখ্যা')}
                //id="numField"
                disabled
                name="totalInsNumber"
                onChange={handleProductDetails}
                type="text"
                variant="outlined"
                size="small"
                value={
                  productDetails?.totalIns || productDetails.totalIns == 0 ? engToBang(productDetails.totalIns) : ''
                }
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('পরিশোধিত কিস্তির সংখ্যা')}
                disabled
                name="maturityDate"
                // onChange={handleProductDetails}
                variant="outlined"
                size="small"
                value={productDetails?.paidIns == 0 || productDetails?.paidIns ? engToBang(productDetails.paidIns) : ''}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('অপরিশোধিত কিস্তির সংখ্যা ')}
                name="installmentFrequency"
                disabled
                //onChange={handleProductDetails}
                variant="outlined"
                size="small"
                value={
                  productDetails?.unpaidIns || productDetails?.unpaidIns == 0 ? engToBang(productDetails.unpaidIns) : ''
                }
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('ম্যাচুরিটি তারিখ')}
                disabled
                name="maturityDate"
                // onChange={handleProductDetails}
                variant="outlined"
                size="small"
                value={productDetails?.maturityDate ? moment(productDetails.maturityDate).format('DD/MM/YYYY') : ''}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('ক্রমযোজিত আসল')}
                id="numField"
                name="interestRate"
                disabled
                // onChange={handleProductDetails}
                variant="outlined"
                size="small"
                value={
                  productDetails?.currentBalance || productDetails?.currentBalance == 0
                    ? engToBang(productDetails.currentBalance)
                    : ''
                }
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('ম্যাচুরিটি পরিমাণ')}
                id="numField"
                name="maturityAmount"
                disabled
                //onChange={handleProductDetails}
                variant="outlined"
                size="small"
                value={
                  productDetails?.maturityAmount || productDetails?.maturityAmount == 0
                    ? engToBang(productDetails.maturityAmount)
                    : ''
                }
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item xs={12}>
          <Grid container spacing={2.5}>
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
              <Button
                variant="contained"
                onClick={onSubmitData}
                className="btn btn-primary"
                startIcon={<PublishedWithChangesIcon />}
              >
                আবেদন জমা দিন
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DpsClose;
