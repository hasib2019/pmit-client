/* eslint-disable @next/next/no-img-element */

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Card,
  Divider,
  Grid,
  Paper,
  // TableCell,
  // TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios';
import { parseInt } from 'lodash';
// import ReactQuill from 'react-quill';
import { applicationTypeBaseData } from 'components/mainSections/approval/appTypeWiseComp/appTypeHandler';
import Styles from 'components/mainSections/loan-management/loan-application/sanction/Sanction.module.css';
import AppTitle from 'components/shared/others/AppTitle';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import {
  designationName,
  doptorDetails,
  employeeRecord,
  finalApproval,
  officeName,
  serviceName,
  specificApplication,
} from '../../../../url/ApiList';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.grey,
//     color: theme.palette.common.black,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// eslint-disable-next-line no-unused-vars
const Approval = ({ approvalData }) => {
  const router = useRouter();
  // ("Approval Data--------------------", approvalData);

  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  } else {
    token = 'null';
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [flag] = useState('data:image/jpeg;base64,');
  // const [samityInfo, setSamityInfo] = useState([]);
  //("samity info", samityInfo);
  // const [workflowInfo, setWorkflowInfo] = useState([]);
  // const [allcontant, setAllcontant] = useState('');
  const [officeNames, setOfficeNames] = useState([]);
  const [employeeReacord, setEmployeeReacord] = useState([]);
  const [setDesignationName] = useState([]);
  const [serviceNames, setServiceName] = useState([]);
  const [setOfficeId] = useState();
  const [defaultValue, setDefaultValue] = useState('');
  const [doptorName, setDoptorName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [projectId, setProjectId] = useState('');

  const [approval, setApproval] = useState({
    origin_unit_id: '',
    office_id: '',
    designationId: '',
    officerId: '',
    serviceActionId: '',
    documentPicture: '',
    documentPictureName: '',
    documentPictureType: '',
  });

  // const [ setPicimage] = useState({
  //   picimage: '',
  //   mimetypepic: '',
  // });

  // const [picNameUrl, setPicNameUrl] = useState('');

  // const [flagForImage, setFlagForImage] = useState('data:image/jpg;base64,');

  const [appHistory, setAppHistory] = useState([]);
  const [memberInfo, setMemberInfo] = useState({});

  const [appData, setAppData] = useState({
    product: {
      productMaster: {},
      productServiceCharge: [],
      serviceChargeBivajon: [],
      productCharge: [],
      slabWiseLoanAmount: [],
      necessaryDocument: [],
      history: [],
    },
    updateProduct: {
      productMaster: {},
      productServiceCharge: [],
      serviceChargeBivajon: [],
      productCharge: [],
      slabWiseLoanAmount: [],
      necessaryDocument: [],
      history: [],
    },
    sanction: {
      grantorInfo: [],
      documentList: [],
      applicationInfos: {},
    },
    projectApp: {
      projectInfo: [],
      userInfo: {
        userName: '',
        designationBangla: '',
        empId: '',
        nameBangla: '',
      },
      appHistory: [],
    },

    loanSchedule: {
      applicationInfo: {},
      transaction: {},
      history: [],
    },
    subGl: {
      applicationInfo: [],
      history: [],
    },
    fieldOfficer: {
      applicationInfo: [],
      history: [],
    },
    updateFieldOfficer: {
      applicationInfo: [],
      history: [],
    },
  });
  'Field Officer Update Data', appData.updateFieldOfficer;
  const [appType, setAppType] = useState('');
  // const [dynamicAppRender, setDynamicAppRender] = useState('');
  const [textEditorValue, setTextEditorValue] = useState('');

  // let checkMandatory = () => {
  //   let result = true;
  //   const formErrors = { ...formErrors };
  //   if (selectedOfficeType == null || selectedOfficeType == 'নির্বাচন করুন') {
  //     result = false;
  //     formErrors.selectedOfficeType = 'অফিসের ধরন নির্বাচন করুন';
  //   }
  //   if (selectedOffice == null || selectedOffice == 'নির্বাচন করুন') {
  //     result = false;
  //     formErrors.selectedOffice = 'অফিসের নাম নির্বাচন করুন';
  //   }
  //   if (nextDesk == null || nextDesk == 'নির্বাচন করুন') {
  //     result = false;
  //     formErrors.nextDesk = 'পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন';
  //   }
  //   setFormErrors(formErrors);
  //   return result;
  // };

  let imageChangepic = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // setSelectedImage(e.target.files[0]);
      let file = e.target.files[0];
      // //("Image Type", file);
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      setApproval({
        ...approval,
        documentPictureName: file,
      });

      reader.onload = () => {
        let base64Image = btoa(reader.result);
        setApproval((prevState) => ({
          ...prevState,
          documentPicture: base64Image,
          documentPictureType: file.type,
        }));
      };
    }
    reader.onerror = () => {
      // //("there are some problems");
      NotificationManager.error('File can not be read', '', 5000);
    };
  };

  // const removeSelectedImagepic = () => {
  //   setPicimage({
  //     picimage: '',
  //     mimetypepic: '',
  //   });
  // };

  useEffect(() => {
    // samityReport();
    getApplicationDetails();

    getOfficeName();
    getServiceName();
    // AppWorkflow();
    getDoptorDetails();
  }, []);

  // const defineAllType = (details) => {
  //   if (details.data.data.sanctionInfo) {
  //     return "sanction";
  //   }
  // };

  const appDataSetting = (res, payload) => {
    switch (res) {
      case 'product':
        setAppData((prevState) => ({
          ...prevState,
          product: {
            ...prevState.product.productMaster,
            ...prevState.product.productServiceCharge,
            ...prevState.product.serviceChargeBivajon,
            ...prevState.product.productCharge,
            ...prevState.product.slabWiseLoanAmount,
            ...prevState.product.necessaryDocument,
            productMaster: payload.data.data.applicationInfo.productMaster
              ? payload.data.data.applicationInfo.productMaster
              : {},
            productServiceCharge: payload.data.data.applicationInfo.productServiceCharge
              ? payload.data.data.applicationInfo.productServiceCharge
              : [],
            serviceChargeBivajon: payload.data.data.applicationInfo.serviceChargeBivajon
              ? payload.data.data.applicationInfo.serviceChargeBivajon
              : [],
            productCharge: payload.data.data.applicationInfo.productCharge
              ? payload.data.data.applicationInfo.productCharge
              : [],
            slabWiseLoanAmount: payload.data.data.applicationInfo.slabWiseLoanAmount
              ? payload.data.data.applicationInfo.slabWiseLoanAmount
              : [],
            necessaryDocument: payload.data.data.applicationInfo.necessaryDocument
              ? payload.data.data.applicationInfo.necessaryDocument
              : [],
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'updateProduct':
        setAppData((prevState) => ({
          ...prevState,
          updateProduct: {
            ...prevState.updateProduct.productMaster,
            ...prevState.updateProduct.productServiceCharge,
            ...prevState.updateProduct.serviceChargeBivajon,
            ...prevState.updateProduct.productCharge,
            ...prevState.updateProduct.slabWiseLoanAmount,
            ...prevState.updateProduct.necessaryDocument,
            productMaster: payload.data.data.applicationInfo.updatedInfo.productMaster
              ? payload.data.data.applicationInfo.updatedInfo.productMaster
              : {},
            productServiceCharge: payload.data.data.applicationInfo.updatedInfo.productServiceCharge
              ? payload.data.data.applicationInfo.updatedInfo.productServiceCharge
              : [],
            serviceChargeBivajon: payload.data.data.applicationInfo.updatedInfo.serviceChargeBivajon
              ? payload.data.data.applicationInfo.updatedInfo.serviceChargeBivajon
              : [],
            productCharge: payload.data.data.applicationInfo.updatedInfo.productCharge
              ? payload.data.data.applicationInfo.updatedInfo.productCharge
              : [],
            slabWiseLoanAmount: payload.data.data.applicationInfo.updatedInfo.slabWiseLoanAmount
              ? payload.data.data.applicationInfo.updatedInfo.slabWiseLoanAmount
              : [],
            necessaryDocument: payload.data.data.applicationInfo.updatedInfo.necessaryDocument
              ? payload.data.data.applicationInfo.updatedInfo.necessaryDocument
              : [],
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'sanctionApply':
        setAppData((prevState) => ({
          ...prevState,
          sanction: {
            ...prevState.sanction.documentList,
            ...prevState.sanction.grantorInfo,
            ...prevState.sanction.sanctionInfo,
            documentList: payload.data.data.applicationInfo.documentList
              ? payload.data.data.applicationInfo.documentList
              : [],
            grantorInfo: payload.data.data.applicationInfo.grantorInfo
              ? payload.data.data.applicationInfo.grantorInfo
              : [],
            applicationInfos: payload.data.data.applicationInfo,
          },
        }));
        // setProjectId(payload.data.data.applicationInfo.projectId ? payload.data.data.applicationInfo.projectId : null);
        // setServiceId(payload.data.data.applicationInfo.serviceId ? payload.data.data.applicationInfo.serviceId : null);

        break;

      case 'projectAssign':
        // eslint-disable-next-line no-case-declarations
        const { projectInfo, designationBn, employeeId, nameBn, username } = payload.data.data.applicationInfo;

        setAppData((prevState) => ({
          ...prevState,
          projectApp: {
            ...prevState.projectApp.projectInfo,
            projectInfo: projectInfo ? projectInfo : [],
            userInfo: {
              // ...prevState.projectApp.userInfo.userName,
              // ...prevState.projectApp.userInfo.designationBangla,
              // ...prevState.projectApp.userInfo.empId,
              // ...prevState.projectApp.userInfo.nameBangla,
              userName: username,
              designationBangla: designationBn,
              empId: employeeId,
              nameBangla: nameBn,
            },
            appHistory: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'loanSchedule':
        setAppData((prevState) => ({
          ...prevState,
          loanSchedule: {
            applicationInfo: payload.data.data.applicationInfo,
            transaction: payload.data.data.applicationInfo.transaction,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'subGl':
        setAppData((prevState) => ({
          ...prevState,
          subGl: {
            applicationInfo: payload.data.data.applicationInfo.appInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;

      case 'fieldOfficer':
        setAppData((prevState) => ({
          ...prevState,
          fieldOfficer: {
            applicationInfo: payload.data.data.applicationInfo.fieldOfficerData,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;

      case 'updateFieldOfficer':
        setAppData((prevState) => ({
          ...prevState,
          updateFieldOfficer: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      default:
    }
  };

  const getApplicationDetails = async () => {
    let base64ConvertedData = atob(router.query.data);
    let resultant = JSON.parse(base64ConvertedData);
    // ("resultant-----------------------", resultant);
    try {
      const details = await axios.get(specificApplication + resultant.serviceId + '/' + resultant.id, config);

      'Application Details-----', details;

      const typeOfApp = details.data.data.type;
      setAppType(typeOfApp);
      appDataSetting(typeOfApp, details);
      setServiceId(details.data.data.applicationInfo.serviceId);
      setProjectId(details.data.data.applicationInfo.projectId);
      setAppHistory(details.data.data.history ? details.data.data.history : []);
      setMemberInfo(details.data.data.memberInfo ? details.data.data.memberInfo : {});
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

  const getDoptorDetails = async () => {
    try {
      const doptorDetail = await axios.get(doptorDetails, config);
      setDoptorName(doptorDetail.data.data[0].nameBn);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == 'office_id') {
      getDesignationName(value);
    }
    setApproval({
      ...approval,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeSAI = (e) => {
    // //(e.target.value)
    let sAID = JSON.parse(e.target.value);
    let id = sAID.id;
    let applicationStatus = sAID.applicationStatus;

    setDefaultValue(applicationStatus);
    setApproval({
      ...approval,
      serviceActionId: id,
    });
  };

  const handleChangeOffice = (e, values) => {
    if (values == null) {
      setOfficeId('');
    } else {
      setOfficeId(values.id);
      getEmployeeName(parseInt(values.id));
    }
    //("event", officeId);
  };

  const handleChangeSelect = (e) => {
    if (e.target.value != 'নির্বাচন করুন') {
      let desData = JSON.parse(e.target.value);
      let designationId = desData.designationId;
      let employeeId = desData.employeeId;

      setApproval({
        ...approval,
        designationId: designationId,
        officerId: employeeId,
      });
    }
  };
  // //('app data', approval);

  // const handleEditorChange = (e) => {
  //   setAllcontant({
  //     ...allcontant,
  //     content: e.target.getContent(),
  //   });
  // };
  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);

      //("Office Name Data-----", officeNameData.data.data);
      setOfficeNames(officeNameData.data.data);
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

  let getEmployeeName = async (value) => {
    try {
      let employeeRecordData = await axios.get(employeeRecord + value, config);
      'kormokortaData-----------', employeeRecordData.data.data;
      setEmployeeReacord(employeeRecordData.data.data);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let getDesignationName = async (value) => {
    try {
      let designationNameData = await axios.get(designationName + value + '&status=true', config);
      setDesignationName(designationNameData.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  let getServiceName = async () => {
    let base64ConvertedData = atob(router.query.data);
    let resultant = JSON.parse(base64ConvertedData);
    'Resultant---', resultant;
    try {
      let serviceNameData = await axios.get(serviceName + '?isPagination=false&id=' + resultant.serviceId, config);
      setServiceName(serviceNameData.data.data[0].serviceAction);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  // ("Approval Id----",approval);

  let onSubmitData = async (e) => {
    e.preventDefault();

    // ("Service Action Id---",approval.serviceActionId);
    let base64ConvertedData = atob(router.query.data);
    let resultant = JSON.parse(base64ConvertedData);

    let formData = new FormData();
    if (defaultValue != 'A') {
      formData.append('nextAppDesignationId', parseInt(approval.designationId));
    } else {
      formData.append('nextAppDesignationId', '');
    }
    formData.append('remarks', textEditorValue);
    formData.append('attachment', approval.documentPictureName);
    formData.append('serviceActionId', approval.serviceActionId);
    formData.append('applicationId', resultant.id);
    formData.append('serviceId', serviceId);
    if (projectId) {
      formData.append('projectId', projectId);
    } else {
      formData.append('projectId', 0);
    }
    // ("payload", payload);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const pendingData = await axios.post(finalApproval, formData, config);
      ('AAAAAAAAAAAAAAA');

      NotificationManager.success(pendingData.data.message, '', 5000);
      router.push({ pathname: '/approval' });
    } catch (error) {
      // ('AAAAAAAAAAAAAAAaaaaaaa',error.response);
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
  // ("Approval---",approval);

  const officeNameOptions = officeNames.map((element) => {
    return { label: element.nameBn, id: element.id };
  });

  // const changeTextEditorValue = () => {
  //   //("changeTextEditorValue", textEditorValue);
  // };

  //("officeNameOptions", textEditorValue);

  // ============= For rendering Dynamic Component based on App Type==============
  const { documentList, grantorInfo, applicationInfos } = appData.sanction;
  //const {productMaster, productServiceCharge, serviceChargeBivajon, productCharge, slabWiseLoanAmount, necessaryDocument} = appData.product;
  const { applicationInfo, transaction, history } = appData.loanSchedule;
  const { product } = appData;
  const { projectApp } = appData;
  'Project App----', projectApp;
  const appCompDataProvider = () => {
    let dynamicComponent = '';
    if (appType === 'projectAssign') {
      const check = applicationTypeBaseData(appType)(projectApp ? projectApp : {});
      dynamicComponent = check;
    }

    if (appType === 'product') {
      const check = applicationTypeBaseData(appType)({
        product: product ? product : {},
        appHistory: appHistory ? appHistory : [],
      });
      dynamicComponent = check;
    }
    if (appType === 'updateProduct') {
      const check = applicationTypeBaseData(appType)({
        updateProduct: appData.updateProduct ? appData.updateProduct : {},
      });
      dynamicComponent = check;
    }

    if (appType === 'sanctionApply') {
      const check = applicationTypeBaseData(appType)({
        documentList,
        grantorInfo,
        applicationInfos,
        appHistory,
        memberInfo,
      });

      dynamicComponent = check;
    }

    if (appType === 'loanSchedule') {
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        transaction,
        memberInfo,
        history,
      });

      dynamicComponent = check;
    }

    if (appType === 'subGl') {
      const { applicationInfo, history } = appData.subGl;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });

      dynamicComponent = check;
    }
    if (appType === 'fieldOfficer') {
      const { applicationInfo, history } = appData.fieldOfficer;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'updateFieldOfficer') {
      const { applicationInfo, history } = appData.updateFieldOfficer;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    return dynamicComponent;
  };

  return (
    <>
      {/*======================== Heading Section =================== */}

      <Grid container>
        <Grid item lg={12} md={12} xs={12} className="hvr-underline-from-center hvr-shadow">
          <AppTitle>
            <Typography
              variant="h5"
              sx={{
                color: '#FFF',
              }}
            >
              সংগঠিত কার্যক্রম
            </Typography>
          </AppTitle>
        </Grid>
      </Grid>
      {appCompDataProvider()}
      <Grid container mt={5}>
        <Grid item lg={12} md={12} xs={12} className="hvr-underline-from-center hvr-shadow">
          <AppTitle>
            <Typography
              variant="h5"
              sx={{
                color: '#FFF',
              }}
            >
              সংযোজন
            </Typography>
          </AppTitle>
        </Grid>
      </Grid>

      {/*========================= Adding Description================== */}
      <Paper
        sx={{
          padding: '10px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}
      >
        <Grid my={2} container spacing={1} justifyContent="space-between" alignItems="center">
          <Grid item md={8} sm={12} xs={12} sx={{ minHeight: '200px' }}>
            {/* <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              <Editor
                init={{
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image",
                    "charmap print preview anchor help",
                    "searchreplace visualblocks code",
                    "insertdatetime media table paste wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help",
                }}
                onChange={handleEditorChange}
              />
            </Typography> */}
            <ReactQuill
              style={{ height: '150px' }}
              theme="snow"
              value={textEditorValue}
              onChange={setTextEditorValue}
            />
          </Grid>
          <Grid className="hvr-float-shadow" item md={4} sm={12} xs={12}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                padding: '12px 0',
              }}
            >
              <Grid item>
                <Paper
                  className={Styles.subHeader}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    border: '5px solid #f5f5f5',
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                  }}
                >
                  <img
                    src={approval['documentPicture'] ? flag + approval['documentPicture'] : '/store.svg'}
                    style={{
                      margin: 'auto',
                      cursor: 'pointer',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                    }}
                    value={approval.documentPicture}
                    name="documentPicture"
                    id="documentPicture"
                    alt=""
                  />
                </Paper>
              </Grid>
              <Grid style={{ marginTop: '10px' }}>
                <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    size="small"
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCamera />}
                    className={Styles.btnOne}
                    onChange={imageChangepic}
                  >
                    <input type="file" name="documentPictureFront" hidden />
                    সংযুক্তি করুন
                  </Button>
                </Paper>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        style={{
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          padding: '30px',
          marginTop: '15px',
        }}
      >
        <Grid container my={2} px={2} justifyContent="space-between" spacing={1.5}>
          <Grid item lg={3} md={3} xs={12}>
            <TextField
              fullWidth
              label="কর্মকান্ড"
              name="serviceActionId"
              onChange={handleChangeSAI}
              required
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option>- নির্বাচন করুন -</option>
              {serviceNames.map((option) => (
                <option
                  key={option.id}
                  value={JSON.stringify({
                    id: option.id,
                    applicationStatus: option.applicationStatus,
                  })}
                >
                  {option.name}
                </option>
              ))}
            </TextField>
          </Grid>
          {defaultValue != 'A' && defaultValue != 'R' ? (
            <>
              <Grid item lg={3} md={3} xs={12}>
                <TextField
                  fullWidth
                  label="দপ্তর/শাখা"
                  name="office_id"
                  value={doptorName}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item lg={3} md={3} xs={12}>
                <Autocomplete
                  disablePortal
                  id="grouped-demo"
                  options={officeNameOptions}
                  onChange={handleChangeOffice}
                  renderInput={(params) => <TextField fullWidth {...params} label="কার্যালয়" size="small" />}
                />
              </Grid>

              <Grid item lg={3} md={3} xs={12}>
                <TextField
                  fullWidth
                  label="কর্মকর্তা ও পদবী"
                  name="officerId"
                  onChange={handleChangeSelect}
                  required
                  select
                  // value={`${approval.officerId}+${approval.designationId}`}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {employeeReacord.map((element, index) => (
                    <option
                      key={index}
                      value={JSON.stringify({
                        designationId: element.designationId,
                        employeeId: element.employeeId,
                      })}
                    >
                      {element.nameBn} {'-'} {element.designation}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </>
          ) : (
            ''
          )}
        </Grid>
      </Paper>

      <Divider />

      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container spacing={1.5} px={2}>
            <Grid item lg={7} md={7} xs={12} sx={{ textAlign: 'right' }}>
              <Tooltip title="সংরক্ষন করুন">
                <Button
                  variant="contained"
                  className="btn btn-save"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={onSubmitData}
                >
                  {' '}
                  সংরক্ষন করুন
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Approval;
