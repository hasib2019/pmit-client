/* eslint-disable no-case-declarations */
/* eslint-disable @next/next/no-img-element */

import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Autocomplete, Box, CardMedia, Grid, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { parseInt } from 'lodash';
// import ReactQuill from 'react-quill';
import { liveIp } from 'config/IpAddress';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  doptorDetails,
  employeeRecord,
  finalApproval,
  officeName,
  serviceName,
  specificApplication
} from '../../../url/ApiList';
import SubHeading from '../../shared/others/SubHeading';
import star from '../loan-management/loan-application/utils';
import { urlGenerator } from '../report-generation/reportUrl';
import { applicationTypeBaseData } from './appTypeWiseComp/appTypeHandler';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });





import Swal from 'sweetalert2';

const Approval = () => {
  const router = useRouter();
  const compoName = localStorageData('componentName');

  // ("approvalData", approvalData);


  const config = localStorageData('config');
  const flag = useState('data:image/jpeg;base64,');
  const [officeNames, setOfficeNames] = useState([]);
  const [employeeReacord, setEmployeeReacord] = useState([]);
  const [serviceNames, setServiceName] = useState([]);
  const [defaultValue, setDefaultValue] = useState('');
  const [doptorName, setDoptorName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [adminOfficeObj, setAdminOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [designationName, setDesignationName] = useState("")
  const [approval, setApproval] = useState({
    origin_unit_id: '',
    office_id: '',
    designationId: '',
    officerId: '',
    serviceActionId: '',
    documentPicture: '',
    documentPictureName: '',
    documentPictureType: '',
    adminDeskObj: undefined,
  });

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

    savingsProduct: {
      productMaster: {},
      productInterest: [],
      productCharge: [],
      productInstallment: [],
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
    updateSavingsProduct: {
      productMaster: {},
      productInterest: [],
      productInstallment: [],
      productCharge: [],
      productDocuments: [],
      history: [],
    },

    sanction: {
      grantorInfo: [],
      documentList: [],
      applicationInfos: {},
    },

    projectAssign: {
      projectInfo: [],
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

    loanInfoMigration: {
      samityInfo: {},
      loanInfo: {},
    },

    samityCreate: {
      applicationInfo: [],
      history: [],
    },

    samityUpdate: {
      applicationInfo: [],
      history: [],
    },
    memberCreate: {
      applicationInfo: [],
      history: [],
    },

    memberUpdate: {
      applicationInfo: [],
      history: [],
    },

    balanceMigration: {
      applicationInfo: [],
      history: [],
    },
    dpsApplication: {
      applicationInfo: [],
      history: [],
    },
    dpsClose: {
      applicationInfo: [],
      history: [],
    },
    cashWithdraw: {
      applicationInfo: [],
      history: [],
    },
    reverseTran: {
      applicationInfo: [],
      history: [],
    },
    fdrApplication: {
      applicationInfo: [],
      history: [],
    },
    loanSettlement: {
      applicationInfo: [],
      history: [],
    },
    fdrClose: {
      applicationInfo: [],
      history: [],
    },
    loanAdjustment: {
      applicationInfo: [],
      history: [],
    },
  });
  const [appType, setAppType] = useState('');
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
      let file = e.target.files[0];
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
      NotificationManager.error('File can not be read', '', 5000);
    };
  };
  const removeSelectedImagepic = () => {
    setApproval({
      ...approval,
      documentPicture: '',
      documentPictureType: '',
    });
  };
  useEffect(() => {
    getApplicationDetails();
    getOfficeName();
    getServiceName();
    getDoptorDetails();
  }, []);

  const appDataSetting = (res, payload) => {
    switch (res) {
      case 'product':
        setAppData((prevState) => ({
          ...prevState,
          product: {
            productMaster: payload?.data?.data?.applicationInfo?.productMaster
              ? payload.data.data.applicationInfo.productMaster
              : {},
            productServiceCharge: payload?.data?.data?.applicationInfo?.productServiceCharge
              ? payload.data.data.applicationInfo.productServiceCharge
              : [],
            serviceChargeBivajon: payload?.data?.data?.applicationInfo?.serviceChargeBivajon
              ? payload.data.data.applicationInfo.serviceChargeBivajon
              : [],
            productCharge: payload?.data?.data?.applicationInfo?.productCharge
              ? payload.data.data.applicationInfo.productCharge
              : [],
            slabWiseLoanAmount: payload?.data?.data?.applicationInfo?.slabWiseLoanAmount
              ? payload.data.data.applicationInfo.slabWiseLoanAmount
              : [],
            necessaryDocument: payload?.data?.data?.applicationInfo?.necessaryDocument
              ? payload.data.data.applicationInfo.necessaryDocument
              : [],
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'savingsProduct':
        setAppData((prevState) => ({
          ...prevState,
          savingsProduct: {
            productMaster: payload?.data?.data?.applicationInfo?.productMaster
              ? payload.data.data.applicationInfo.productMaster
              : {},
            productInterest: payload?.data?.data?.applicationInfo?.productInterest
              ? payload.data.data.applicationInfo.productInterest
              : [],
            productCharge: payload?.data?.data?.applicationInfo?.productCharge
              ? payload.data.data.applicationInfo.productCharge
              : [],
            neccessaryDocument: payload?.data?.data?.applicationInfo?.neccessaryDocument
              ? payload.data.data.applicationInfo.neccessaryDocument
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
            productMaster: payload.data.data.applicationInfo?.productMaster
              ? payload.data.data.applicationInfo.productMaster
              : {},
            productServiceCharge: payload?.data?.data?.applicationInfo?.productServiceCharge
              ? payload.data.data.applicationInfo.productServiceCharge
              : [],
            serviceChargeBivajon: payload?.data?.data?.applicationInfo?.serviceChargeBivajon
              ? payload.data.data.applicationInfo.serviceChargeBivajon
              : [],
            productCharge: payload?.data?.data?.applicationInfo?.productCharge
              ? payload.data.data.applicationInfo.productCharge
              : [],
            slabWiseLoanAmount: payload?.data?.data?.applicationInfo?.slabWiseLoanAmount
              ? payload.data.data.applicationInfo.slabWiseLoanAmount
              : [],
            necessaryDocument: payload?.data?.data?.applicationInfo?.necessaryDocument
              ? payload.data.data.applicationInfo.necessaryDocument
              : [],
            history: payload?.data?.data?.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'savingsProductUpdate':
        setAppData((prevState) => ({
          ...prevState,
          updateSavingsProduct: {
            ...prevState.updateSavingsProduct.productMaster,
            ...prevState.updateSavingsProduct.productInterest,
            ...prevState.updateSavingsProduct.productInstallment,
            ...prevState.updateSavingsProduct.productCharge,
            ...prevState.updateSavingsProduct.necessaryDocument,
            productMaster: payload.data.data.applicationInfo?.productMaster
              ? payload.data.data.applicationInfo.productMaster
              : {},
            productInterest: payload?.data?.data?.applicationInfo?.productInterest
              ? payload.data.data.applicationInfo.productInterest
              : [],
            productInstallment: payload?.data?.data?.applicationInfo?.productInstallment
              ? payload.data.data.applicationInfo.productInstallment
              : [],
            productCharge: payload?.data?.data?.applicationInfo?.productCharge
              ? payload.data.data.applicationInfo.productCharge
              : [],
            productDocuments: payload?.data?.data?.applicationInfo?.productDocuments
              ? payload.data.data.applicationInfo.productDocuments
              : [],
            history: payload?.data?.data?.history ? payload.data.data.history : [],
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
        break;
      case 'projectAssign':
        const {
          applicationInfo: appInfo,
        } = payload.data.data;
        const projectAssign = {
          appInfo,
          history: payload.data.data.history ? payload.data.data.history : [],
        };
        setAppData((prevState) => ({
          ...prevState,
          projectAssign,
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
      case 'balanceMigration':
        setAppData((prevState) => ({
          ...prevState,
          balanceMigration: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'samityCreate':
        setAppData((prevState) => ({
          ...prevState,
          samityCreate: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'memberUpdate':
        setAppData((prevState) => ({
          ...prevState,
          memberUpdate: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'memberCreate':
        setAppData((prevState) => ({
          ...prevState,
          memberCreate: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'loanInfoMigration':
        setAppData((prevState) => ({
          ...prevState,
          loanInfoMigration: {
            applicationInfo: payload.data.data,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'samityUpdate':
        setAppData((prevState) => ({
          ...prevState,
          samityUpdate: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'dpsApplication':
        setAppData((prevState) => ({
          ...prevState,
          dpsApplication: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'dpsClose':
        setAppData((prevState) => ({
          ...prevState,
          dpsClose: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'storeInMigration':
        console.log('histoStoreIN', payload.data.data?.history);
        setAppData((prevState) => ({
          ...prevState,
          migratedItems: payload.data.data.data.itemData ? payload.data.data.data.itemData : [],
          history: payload.data.data?.history,
        }));
        break;

      case 'inventoryItemRequisition':
        setAppData((prevState) => ({
          ...prevState,
          itemRequisitionDtlInfo: payload?.data?.data?.data?.itemRequisitionDtlInfo
            ? payload?.data?.data?.data?.itemRequisitionDtlInfo
            : [],
          itemRequisitionMstInfo: payload?.data?.data?.data?.itemRequisitionMstInfo,
          history: payload?.data?.data?.history,
        }));
        break;

      case 'purchaseOrder':
        console.log('purchasePyaload', payload?.data?.data?.history);
        setAppData((prevState) => ({
          ...prevState,
          itemsTobePurchased: payload?.data?.data?.data?.itemsTobePurchased
            ? payload?.data?.data?.data?.itemsTobePurchased
            : [],
          purchaseDetailInfo: payload?.data?.data?.data?.purchaseDetailInfo,
          documentList: payload?.data?.data?.data?.documentList,
          history: payload?.data?.data?.history ? payload?.data?.data?.history : [],
        }));
        break;

      case 'inventoryItemReturn':
        console.log('itemReturn', payload?.data?.data);
        setAppData((prevState) => ({
          ...prevState,
          returnedItems: payload?.data?.data?.data?.returnedItems,
          userName: payload?.data?.data?.name,
          designation: payload?.data?.data?.designation,
          history: payload?.data?.data?.history,
        }));
        break;
      case 'cashWithdraw':
        setAppData((prevState) => ({
          ...prevState,
          cashWithdraw: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'reverseTransaction':
        setAppData((prevState) => ({
          ...prevState,
          reverseTran: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'fdrApplication':
        setAppData((prevState) => ({
          ...prevState,
          fdrApplication: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'loanSettlement':
        setAppData((prevState) => ({
          ...prevState,
          loanSettlement: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'fdrClose':
        setAppData((prevState) => ({
          ...prevState,
          fdrClose: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      case 'loanAdjustment':
        setAppData((prevState) => ({
          ...prevState,
          loanAdjustment: {
            applicationInfo: payload.data.data.applicationInfo,
            history: payload.data.data.history ? payload.data.data.history : [],
          },
        }));
        break;
      default:
    }
  };

  const getApplicationDetails = async () => {
    // let base64ConvertedData = Buffer(router.query.data, "base64").toString(
    //   "ascii"
    // );
    let resultant = JSON.parse(decodeURIComponent(router.query.data));
    console.log('resultant677', resultant);
    try {
      const details = await axios.get(
        specificApplication +
        // resultant?.serviceId +
        // "/" +
        // resultant.id +
        // "/" +
        // compoName +
        // `${resultant.isReportFromDatabase ? "?isDataFromArchive=true" : ""}`,
        resultant?.serviceId +
        '/' +
        resultant.id +
        '/' +
        compoName,
        // `${resultant.isReportFromDatabase ? "?isDataFromArchive=true" : ""}`,
        config,
      );
      console.log('details', details.data.data);
      const typeOfApp = details.data.data.type;
      setAppType(typeOfApp);
      appDataSetting(typeOfApp, details);

      if (details.data.data?.serviceId) {
        setServiceId(details.data.data?.serviceId);
      }
      if (details.data.data?.applicationInfo?.serviceId) {
        setServiceId(details.data.data?.applicationInfo?.serviceId);
      }
      if (details?.data?.data?.serviceId) {
        setServiceId(details?.data?.data?.serviceId);
      }
      // setServiceId(details?.data?.data?.serviceId);
      // resultant?.serviceId == 17
      //   ? setServiceId(details.data.data?.serviceId)
      //   : setServiceId(details.data.data?.applicationInfo?.serviceId);

      resultant?.serviceId == 17
        ? setProjectId(details.data.data.samityInfo?.projectId)
        : setProjectId(details.data.data.applicationInfo?.projectId);
      setAppHistory(details.data.data.history ? details.data.data.history : []);
      setMemberInfo(details.data.data.memberInfo ? details.data.data.memberInfo : {});
    } catch (error) {
      console.log('errorapploval', error);
      errorHandler(error);
    }
  };

  const getDoptorDetails = async () => {
    try {
      const doptorDetail = await axios.get(doptorDetails, config);
      setDoptorName(doptorDetail.data.data[0].nameBn);
    } catch (error) {
      if (error.response) {
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
    if (e.target.value != 'নির্বাচন করুন') {
      let sAID = JSON.parse(e.target.value);
      let id = sAID.id;
      let applicationStatus = sAID.applicationStatus;
      setDefaultValue(applicationStatus);
      setApproval({
        ...approval,
        serviceActionId: id,
      });
    }
  };
  const handleChangeSelectForAutoComplete = (e, value) => {
    console.log('valueEmployeee', value);
    if (value) {
      setApproval({
        ...approval,
        designationId: value?.designationId,
        officerId: value?.employeeId,
        adminDeskObj: value,
      });
    }
  };

  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);

      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      if (error.response) {
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
      setEmployeeReacord(employeeRecordData.data.data);
    } catch (error) {
      if (error.response) {
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
      errorHandler(err)
    }
  };
  let getServiceName = async () => {
    // let base64ConvertedData = atob(router.query.data);
    let resultant = JSON.parse(decodeURIComponent(router.query.data));
    try {
      let serviceNameData = await axios.get(
        serviceName + '/' + compoName + '?isPagination=false&id=' + resultant?.serviceId,
        config,
      );
      setServiceName(serviceNameData.data.data[0].serviceAction);
    } catch (error) {
      if (error.response) {
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  let getJasperReport = async (response) => {
    const componentReportBy = liveIp + 'jasper/' + localStorageData('componentName') + '/';
    const url = urlGenerator(
      {
        doptorId: response?.data?.data?.doptorId,
        tranNum: response.data.data.tranNumber,
      },
      {
        id: 3,
        status: true,
        parameter: ['doptor', 'tranNum', 'userName'],
        jasparParameter: ['pDoptorId', 'pTranNum', 'pUserName'],
        reportJasperName: 'withdrawSlip.pdf',
      },
      componentReportBy,
    );
    // router.push({ pathname: "/approval" });
    console.log({ url });
    window.open(url);
  };
  let onSubmitData = async (e) => {
    e.preventDefault();

    // let base64ConvertedData = JSON.parse(decodeURIComponent(router.query.data));
    let resultant = JSON.parse(decodeURIComponent(router.query.data));

    let formData = new FormData();
    if (defaultValue !== 'A' && defaultValue !== 'R' && defaultValue !== 'O') {
      formData.append('nextAppDesignationId', parseInt(approval.designationId));
    } else {
      formData.append('nextAppDesignationId', '');
    }
    formData.append('remarks', textEditorValue);
    formData.append('attachment', approval.documentPictureName);
    formData.append('serviceActionId', approval.serviceActionId);
    formData.append('applicationId', resultant.id);
    formData.append('serviceId', serviceId);
    if (appType === 'inventoryItemRequisition' && compoName === 'inventory') {
      formData.append(
        'payload',
        JSON.stringify({
          itemRequisitionDtlInfo: appData?.itemRequisitionDtlInfo,
          itemRequisitionMstInfo: appData?.itemRequisitionMstInfo,
        }),
      );
    } else if (appType === 'purchaseOrder' && compoName === 'inventory') {
      formData.append(
        'payload',
        JSON.stringify({
          itemsTobePurchased: appData?.itemsTobePurchased,
          purchaseDetailInfo: appData?.purchaseDetailInfo,
          documentList: appData?.documentList,
          willReceivedPurchasedProductAgain: appData?.willReceivedPurchasedProductAgain,
        }),
      );
    } else if (appType === 'inventoryItemReturn' && compoName === 'inventory') {
      formData.append(
        'payload',
        JSON.stringify({
          returnedItems: appData?.returnedItems,
        }),
      );
    }
    if (projectId) {
      formData.append('projectId', projectId);
    } else {
      formData.append('projectId', 0);
    }
    await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ফিরে যান ।',
      confirmButtonText: 'হ্যাঁ, নিশ্চিত করুন!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(finalApproval, formData, config)
          .then((response) => {
            console.log({ response: response.data.data });
            if (
              response?.data?.data?.serviceId &&
              response?.data?.data?.serviceId == 25 &&
              response?.data?.data?.tranNumber
            ) {
              Swal.fire({
                title: 'সফল হয়েছে!',
                text: response?.data?.message?.component?.message,
                icon: 'success',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                // cancelButtonColor: "#d33",
                // cancelButtonText: "ফিরে যান ।",
                confirmButtonText: 'ঠিক আছে!',
              });
              router.push({ pathname: '/approval' });
            } else {
              Swal.fire({
                title: 'সফল হয়েছে!',
                text: response?.data?.message?.component?.message,
                icon: 'success',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                // cancelButtonColor: "#d33",
                // cancelButtonText: "ফিরে যান ।",
                confirmButtonText: 'ঠিক আছে!',
              });
              router.push({ pathname: '/approval' });
            }
            if (response?.data?.data?.serviceId == 24 && approval.serviceActionId == 1) {
              getJasperReport(response);
            }
          })
          .catch((error) => {
            Swal.fire({
              title: 'ব্যর্থ হয়েছে!',
              text: error?.response?.data?.errors[0]?.message,
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              // confirmButtonColor: "#3085d6",
              cancelButtonColor: '#d33',
              cancelButtonText: 'ফিরে যান ।',
              // confirmButtonText: "ঠিক আছে!",
            });
          });
      }

    });
  };

  // let message;
  //     message =
  //       pendingData.data.message +
  //       "এবং আপনার লেনদেন নম্বরটি হলো : " +
  //       pendingData?.data?.data?.tranNumber;
  //   } else {
  //     message = pendingData?.data?.message;
  //   }
  //   NotificationManager.success(message, "", 5000);
  //   router.push({ pathname: "/approval" });
  // } catch (error) {
  //   if (error.response) {
  //     let message = error.response.data.errors[0].message;
  //     NotificationManager.error(message, "", 5000);
  //   } else if (error.request) {
  //     NotificationManager.error("Error Connecting...", "", 5000);
  //   } else if (error) {
  //     NotificationManager.error(error.toString(), "", 5000);
  //   }
  // }
  // const officeNameOptions = officeNames.map((element) => {
  //   return { label: element.nameBn, id: element.id };
  // });


  // ============= For rendering Dynamic Component based on App Type==============
  const { documentList, grantorInfo, applicationInfos } = appData.sanction;
  //const {productMaster, productServiceCharge, serviceChargeBivajon, productCharge, slabWiseLoanAmount, necessaryDocument} = appData.product;
  const { applicationInfo, transaction, history } = appData.loanSchedule;
  const { product, savingsProduct } = appData;
  const appCompDataProvider = () => {
    let dynamicComponent = '';

    if (appType === 'projectAssign') {
      const projectInfo = appData.projectAssign;
      const check = applicationTypeBaseData(appType)(projectInfo ? projectInfo : {});
      dynamicComponent = check;
    }
    if (appType === 'product') {
      const check = applicationTypeBaseData(appType)({
        product: product ? product : {},
        appHistory: appHistory ? appHistory : [],
      });
      dynamicComponent = check;
    }
    if (appType === 'savingsProduct') {
      const check = applicationTypeBaseData(appType)({
        savingsProduct: savingsProduct ? savingsProduct : {},
        appHistory: appHistory ? appHistory : [],
      });
      dynamicComponent = check;
    }
    if (appType === 'updateProduct') {
      const check = applicationTypeBaseData(appType)({
        updateProduct: appData.updateProduct ? appData.updateProduct : {},
        appHistory: appHistory ? appHistory : [],
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
    if (appType === 'savingsProductUpdate') {
      const check = applicationTypeBaseData(appType)({
        updateSavingsProduct: appData.updateSavingsProduct ? appData.updateSavingsProduct : {},
        appHistory: appHistory ? appHistory : [],
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
    if (appType === 'samityCreate') {
      const { applicationInfo, history } = appData.samityCreate;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });

      dynamicComponent = check;
    }
    if (appType === 'loanInfoMigration') {
      const loanInfo = appData.loanInfoMigration.applicationInfo?.details?.data;
      const samityInfo = appData.loanInfoMigration.applicationInfo?.samityInfo;
      const applicationId = appData.loanInfoMigration.applicationInfo?.details?.applicationId;

      const check = applicationTypeBaseData(appType)({
        samityInfo,
        loanInfo,
        applicationId,
      });
      dynamicComponent = check;
    }
    if (appType === 'balanceMigration') {
      const { applicationInfo, history } = appData.balanceMigration;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'memberUpdate') {
      const { applicationInfo, history } = appData.memberUpdate;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'memberCreate') {
      const { applicationInfo, history } = appData.memberCreate;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'samityUpdate') {
      const { applicationInfo, history } = appData.samityUpdate;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'dpsApplication') {
      const { applicationInfo, history } = appData.dpsApplication;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'dpsClose') {
      const { applicationInfo, history } = appData.dpsClose;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'storeInMigration') {
      const { migratedItems } = appData;
      const check = applicationTypeBaseData(appType)({
        migratedItems,
        appData,
      });
      dynamicComponent = check;
    }
    if (appType === 'inventoryItemRequisition') {
      const { itemRequisitionDtlInfo, itemRequisitionMstInfo } = appData;
      const check = applicationTypeBaseData(appType)({
        itemRequisitionDtlInfo,
        itemRequisitionMstInfo,
        setAppData,
        appData,
        approval,
      });
      dynamicComponent = check;
    }
    if (appType === 'purchaseOrder') {
      const { itemsTobePurchased, purchaseDetailInfo, documentList } = appData;
      const check = applicationTypeBaseData(appType)({
        itemsTobePurchased,
        purchaseDetailInfo,
        documentList,
        appData,
        setAppData,
        defaultValue,
        approval,
      });
      dynamicComponent = check;
    }
    if (appType === 'inventoryItemReturn') {
      const { returnedItems } = appData;
      const check = applicationTypeBaseData(appType)({
        returnedItems,
        appData,
        setAppData,
        defaultValue,
        approval,
      });
      dynamicComponent = check;
    }
    if (appType === 'cashWithdraw') {
      const { applicationInfo, history } = appData.cashWithdraw;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'loanSettlement') {
      const { applicationInfo, history } = appData.loanSettlement;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'reverseTransaction') {
      const { applicationInfo, history } = appData.reverseTran;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'fdrApplication') {
      const { applicationInfo, history } = appData.fdrApplication;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'fdrClose') {
      const { applicationInfo, history } = appData.fdrClose;
      const check = applicationTypeBaseData(appType)({
        applicationInfo,
        history,
      });
      dynamicComponent = check;
    }
    if (appType === 'loanAdjustment') {
      const { applicationInfo, history } = appData.loanAdjustment;
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

      {/* <Grid container >
        <SubHeading>সংগঠিত কার্যক্রম</SubHeading>
      </Grid> */}
      {appCompDataProvider()}

      <Grid container className="section">
        <SubHeading>সংযোজন</SubHeading>

        {/*========================= Adding Description================== */}
        <Grid container spacing={1} justifyContent="space-between" alignItems="center">
          <Grid item md={8} sm={12} xs={12} sx={{ minHeight: '200px' }}>
            <ReactQuill
              style={{ height: '150px' }}
              theme="snow"
              value={textEditorValue}
              onChange={setTextEditorValue}
            />
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
            <Grid container justifyContent="center" alingItems="center">
              <Box className="uploadImage">
                <Button
                  size="small"
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  className="btn btn-primary"
                  onChange={imageChangepic}
                >
                  <input type="file" name="documentPictureFront" hidden />
                  সংযুক্তি
                </Button>

                {approval.documentPicture && (
                  <div className="img">
                    <CardMedia
                      component="img"
                      image={flag + approval.documentPicture}
                      alt="নথি"
                      value={approval.documentPicture}
                      name="documentPicture"
                      id="documentPicture"
                    />
                    <CancelIcon onClick={removeSelectedImagepic} className="imgCancel" />
                  </div>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <SubHeading>অনুমোদন সম্পর্কিত তথ্য</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item lg={3} md={3} xs={12}>
            <TextField
              fullWidth
              label={star('কর্মকান্ড')}
              name="serviceActionId"
              onChange={handleChangeSAI}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option values="নির্বাচন করুন">নির্বাচন করুন</option>
              {serviceNames.map((option) => (
                <option
                  key={option.id}
                  value={JSON.stringify({
                    id: option.id,
                    applicationStatus: option.applicationStatus,
                    isFinal: option.isFinal,
                  })}
                >
                  {option.name}
                </option>
              ))}
            </TextField>
          </Grid>
          {defaultValue !== 'A' && defaultValue !== 'R' && defaultValue !== 'C' && defaultValue !== 'O' ? (
            <>
              <Grid item lg={3} md={3} xs={12}>
                <TextField
                  fullWidth
                  label={star('দপ্তর/শাখা')}
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
                  inputProps={{ style: { padding: 0, margin: 0 } }}
                  name="officeName"
                  onChange={(event, value) => {
                    if (value == null) {
                      setAdminOfficeObj({
                        id: '',
                        label: '',
                      });
                      setEmployeeReacord([]);
                    } else {
                      value &&
                        setAdminOfficeObj({
                          id: value.id,
                          label: value.label,
                        });
                      getEmployeeName(parseInt(value?.id));
                    }
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
                      label={adminOfficeObj.id ? star('কার্যালয়') : star('কার্যালয় নির্বাচন করুন')}
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: '#FFF', margin: '5dp' }}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={3} md={3} xs={12}>
                <Autocomplete
                  key={approval?.designationId}
                  size="small"
                  name="officerId"
                  fullWidth
                  options={employeeReacord}
                  value={approval?.adminDeskObj}
                  getOptionLabel={(option) => `${option?.nameBn}-${option?.designation}`}
                  onChange={handleChangeSelectForAutoComplete}
                  renderInput={(params) => <TextField {...params} label={star('কর্মকর্তা ও পদবী')} />}
                />
              </Grid>
            </>
          ) : (
            ''
          )}
        </Grid>
      </Grid>

      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button variant="contained" className="btn btn-save" startIcon={<SaveOutlinedIcon />} onClick={onSubmitData}>
            {' '}
            সংরক্ষণ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default Approval;
