
import AddIcons from '@mui/icons-material/Add';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import EditIcon from '@mui/icons-material/Edit';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Autocomplete, Button, Grid, TextField, Tooltip } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import {
  employeeRecord,
  loanProject,
  officeName,
  productList,
  productSingle,
  productUpdate,
} from '../../../../../url/ApiList';
import { myValidate } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';
import UpdateNecessaryDoc from './UpdateNecessaryDoc';
import UpdateProductCharge from './UpdateProductCharge';
import UpdateProductMaster from './UpdateProductMaster';
import UpdateProductServiceCharge from './UpdateProductServiceCharge';
import UpdateServiceChargeBivajon from './UpdateServiceChargeBivajon';
import UpdateSlabWiseLoan from './UpdateSlabWiseLoan';

import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng } from '../../../samity-managment/member-registration/validator';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .01)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const ProductList = () => {
  const config = localStorageData('config');
  const [officeNames, setOfficeNames] = useState([]);
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [nextAppDesigId, setNextAppDesigId] = useState('');
  const [projectsName, setProjectsName] = useState([]);
  const [selectedProject, setSelectedProject] = useState(0);
  const [allProduct, setAllProduct] = useState([]);
  const [specificProduct, setSpecificProduct] = useState({});
  const [expanded, setExpanded] = React.useState('panel1');
  const [proName, setProName] = useState('');
  const [proId, setProId] = useState('');
  const [productChargeArray, setProductChargeArray] = useState([]);
  const [productServiceChargeArray, setProductServiceChargeArray] = useState([]);
  const [serviceChargeSegregationArray, setServiceChargeSegregationArray] = useState([]);
  const [productMasterObj, setProductMasterObj] = useState({});
  const [neccessaryDocDataArray, setNeccessaryDocDataArray] = useState([]);
  const [slabWiseLoanArray, setSlabWiseLoanArray] = useState([]);
  const [slabWiseLoanArrayError, setSlabWiseLoanArrayError] = useState([]);

  // const [officeid, setOfficeId] = useState('');
  const [formError, setFormError] = useState('');
  const [earningVal] = useState([
    { value: '1', label: 'প্রথম' },
    { value: '2', label: 'দ্বিতীয়' },
    { value: '3', label: 'তৃতীয়' },
  ]);
  const [valuePod] = useState({
    1: { status: 'NOT_TAKEN', id: null },
    2: { status: 'NOT_TAKEN', id: null },
    3: { status: 'NOT_TAKEN', id: null },
  });
  useEffect(() => {
    getProject();
    getOfficeName();
  }, []);
  useEffect(() => {
    getProduct();
  }, [selectedProject]);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
  };
  const officeNameOptions = officeNames.map((element) => {
    return { label: element.nameBn, id: element.id };
  });
  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
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
  const handleChangeSelect = (e) => {
    if (e.target.value != 'নির্বাচন করুন') {
      let desData = JSON.parse(e.target.value);
      let designationId = desData.designationId;
      // let employeeId = desData.employeeId;

      setNextAppDesigId(designationId);
    }
  };
  const handleChangeOffice = (e, values) => {
    // setOfficeId(values.id);
    getEmployeeName(parseInt(values.id));
  };

  let getEmployeeName = async (value) => {
    try {
      let employeeRecordData = await axios.get(employeeRecord + value, config);
      setEmployeeRecords(employeeRecordData.data.data);
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
  const handleProductChargeArray = async (e, ind) => {
    const productArray = [...productChargeArray];
    let resultObj;
    const { name, value, id } = e.target;

    if (id == 'chargeAmount') {
      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }
      productArray[ind][name] = bangToEng(resultObj?.value);
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }
    productArray[ind][name] = value;
    setProductChargeArray(productArray);
  };
  const saveData = async () => {
    let loanTermCopy = productMasterObj?.loanTerm;
    let numberofInstallmentCopy = productMasterObj?.numberOfInstallment;
    let loanTermCopyArray = [];
    let numberofInstallmentCopyArray = [];
    if (loanTermCopy.length >= 1 && loanTermCopy.includes(',')) {
      loanTermCopyArray = loanTermCopy.split(',');
      let newLoanTermCopyArray = loanTermCopyArray.map((elem) => bangToEng(elem));
      loanTermCopyArray = newLoanTermCopyArray;
    } else if (loanTermCopy.length >= 1) {
      loanTermCopyArray[0] = bangToEng(loanTermCopy);
    }
    if (numberofInstallmentCopy && numberofInstallmentCopy.includes(',')) {
      numberofInstallmentCopyArray = numberofInstallmentCopy.split(',');
      let newNumberofInstallmentCopyArray = numberofInstallmentCopyArray.map((elem) => bangToEng(elem));
      numberofInstallmentCopyArray = newNumberofInstallmentCopyArray;
    } else if (numberofInstallmentCopy) {
      numberofInstallmentCopyArray[0] = bangToEng(numberofInstallmentCopy);
    }
    productServiceChargeArray.forEach((elem) => {
      if (elem.currentdueIntRate != '') {
        elem.currentdueIntRate = parseFloat(elem.currentdueIntRate);
      }
      if (elem.overdueIntrate != '') {
        elem.overdueIntRate = parseFloat(elem.overdueIntRate);
      }
      if (elem.intRate != '') {
        elem.intRate = parseFloat(elem.intRate);
      }
    });
    productChargeArray.forEach((elem) => {
      if (elem.chargeValue != '') {
        elem.chargeValue = parseFloat(elem.chargeValue);
      }
    });

    slabWiseLoanArray.forEach((elem) => {
      if (elem.depositPercent != '') {
        elem.depositPercent = parseFloat(elem.depositPercent);
      }

      if (elem.maxAmount != '') {
        elem.maxAmount = parseFloat(bangToEng(elem.maxAmount));
      }
      if (elem.loanNo != '') {
        elem.loanNo = parseFloat(bangToEng(elem.loanNo));
      }
      if (elem.minAmount != '') {
        elem.minAmount = parseFloat(bangToEng(elem.minAmount));
      }
      if (elem.preDisbInterval != '') {
        elem.preDisbInterval = parseFloat(bangToEng(elem.preDisbInterval));
      }
      if (elem.sharePercent != '') {
        elem.sharePercent = parseFloat(bangToEng(elem.sharePercent));
      }
    });
    serviceChargeSegregationArray.forEach((elem) => {
      if (elem.segregationRate != '') {
        elem.segregationRate = parseFloat(elem.segregationRate);
      }
    });

    let payload = {
      data: {
        productMaster: {
          principalGl: productMasterObj.principalGl,
          serviceChargeGl: productMasterObj.serviceChargeGl,
          productGl: productMasterObj.productGl,
          ...(productMasterObj.allowInsurance && {
            insuranceGl: productMasterObj.insuranceGl,
          }),
          productCode: productMasterObj.productCode,
          ...(productMasterObj.allowGracePeriod && {
            gracePeriod: productMasterObj.gracePeriod ? Number(bangToEng(productMasterObj.gracePeriod)) : '',
          }),
          ...(productMasterObj.serCrgAtGracePeriod && {
            graceAmtRepayIns: productMasterObj.graceAmtRepayIns,
          }),
          ...(productMasterObj.allowInsurance && {
            insuranceGl: Number(productMasterObj.insuranceGl),
          }),
          openDate: formatDate(productMasterObj.openDate),
          realizationSeqOd: productMasterObj.realizationSeqOd,
          realizationSeqService: productMasterObj.realizationSeqService,
          realizationSeqPrincipal: productMasterObj.realizationSeqPrincipal,
          allowGracePeriod: productMasterObj.allowGracePeriod,
          allowInsurance: productMasterObj.allowInsurance,
          loanTerm: loanTermCopyArray,
          numberOfInstallment: numberofInstallmentCopyArray,
          holidayEffect: productMasterObj.holidayEffect,
          ...(productMasterObj.allowGracePeriod && {
            serCrgAtGracePeriod: productMasterObj.serCrgAtGracePeriod,
          }),
          repFrq: productMasterObj.repFrq,
          minLoanAmt: Number(productMasterObj.minLoanAmt),
          maxLoanAmt: Number(productMasterObj.maxLoanAmt),
          calType: productMasterObj.calType,
          isAdvPayBenefit: productMasterObj.isAdvPayBenefit,
          chequeDisbursementFlag: productMasterObj.chequeDisbursementFlag,
          ...(productMasterObj.allowInsurance && {
            insurancePercent: productMasterObj.insurancePercent
              ? Number(bangToEng(productMasterObj.insurancePercent))
              : '',
          }),
        },
        productId: proId,
        projectId: productMasterObj.projectId,
        productCharge: productChargeArray,
        productServiceCharge: productServiceChargeArray,
        slabWiseLoanAmount: slabWiseLoanArray,
        necessaryDocument: neccessaryDocDataArray,
        serviceChargeBivajon: serviceChargeSegregationArray,
      },
      nextAppDesignationId: nextAppDesigId,
      projectId: productMasterObj.projectId,
    };
    try {
      const res = await getApi(productUpdate + '/loan', 'post', payload);
      if (res.data.data) {
        let message = res.data.message;
        NotificationManager.success(message, '', 5000);
        setProductChargeArray([]);
        setProductServiceChargeArray([]);
        setNeccessaryDocDataArray([]);
        setServiceChargeSegregationArray([]);
        setSlabWiseLoanArray([]);
        setProductMasterObj([]);
        setNextAppDesigId('');
        // setOfficeId('');
        setSpecificProduct('');
      }
    } catch (err) {
      errorHandler(err)

    }
  };
  const handleSlabWiseLoanArray = (e, ind) => {
    const { name, value, id } = e.target;
    const slabWiseArray = [...slabWiseLoanArray];
    const slabWiseErrorArray = [...slabWiseLoanArrayError];
    let resultObj;
    if (id == 'numberWithPercent') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }

      slabWiseArray[ind][name] = bangToEng(resultObj?.value);
      slabWiseErrorArray[ind][name] = resultObj?.error;
      setSlabWiseLoanArray(slabWiseArray);
      setSlabWiseLoanArrayError(slabWiseErrorArray);
      return;
    }

    if (id == 'chargeNumber') {
      if (value.length == 1 && value == 0) return;

      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }

      slabWiseArray[ind][name] = resultObj?.value;
      slabWiseErrorArray[ind][name] = resultObj?.error;
      switch (name) {
        case 'maxAmount':
          if (
            slabWiseArray[ind]['minAmount'] &&
            Number(bangToEng(slabWiseArray[ind]['minAmount'])) > Number(bangToEng(value))
          ) {
            slabWiseErrorArray[ind]['maxAmount'] =
              'ঋণের সর্বোচ্চ পরিমাণ ঋণের সর্বনিম্ন পরিমাণ অপেক্ষা ছোট হতে পারবে না';
          } else if (
            slabWiseArray[ind]['minAmount'] &&
            Number(bangToEng(slabWiseArray[ind]['minAmount'])) < Number(bangToEng(value))
          ) {
            slabWiseErrorArray[ind]['maxAmount'] = '';
            slabWiseErrorArray[ind]['minAmount'] = '';
          } else {
            slabWiseArray[ind]['maxAmount'] = '';
          }
          setSlabWiseLoanArray(slabWiseArray);
          setSlabWiseLoanArrayError(slabWiseErrorArray);

          return;
        case 'minAmount':
          if (
            slabWiseArray[ind]['maxAmount'] &&
            Number(bangToEng(slabWiseArray[ind]['maxAmount'])) < Number(bangToEng(value))
          ) {
            slabWiseErrorArray[ind]['minAmount'] =
              'ঋণের সর্বনিম্ন পরিমাণ ঋণের সদস্য সর্বোচ্চ পরিমাণ অপেক্ষা বড় হতে পারবে না';
          } else if (
            slabWiseArray[ind]['maxAmount'] &&
            Number(bangToEng(slabWiseArray[ind]['maxAmount'])) > Number(bangToEng(value))
          ) {
            slabWiseErrorArray[ind]['maxAmount'] = '';
            slabWiseErrorArray[ind]['minAmount'] = '';
          } else {
            slabWiseArray[ind]['minAmonut'] = '';
          }
          setSlabWiseLoanArray(slabWiseArray);
          setSlabWiseLoanArrayError(slabWiseErrorArray);
          return;
      }
    }
    slabWiseArray[ind][name] = value;
    setSlabWiseLoanArray(slabWiseArray);
    setSlabWiseLoanArrayError(slabWiseErrorArray);
  };
  const handleNeccessaryDocDataArray = (e, id) => {
    const { name, value } = e.target;
    const neccessaryDocArray = [...neccessaryDocDataArray];
    neccessaryDocArray[id][name] = value;
    setNeccessaryDocDataArray(neccessaryDocArray);
  };
  const handleProductServiceChargeArray = (e, ind) => {
    const { name, value, id } = e.target;
    const productArray = [...productServiceChargeArray];

    let resultObj;
    if (id == 'numberWithPercent') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }

      productArray[ind][name] = bangToEng(resultObj?.value);
      setProductServiceChargeArray(productArray);
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }

    productArray[ind][name] = value;
    setProductServiceChargeArray(productArray);
  };
  const handleServiceChargeSegregationArray = (e, id) => {
    let { name, value } = e.target;

    value = bangToEng(value);

    const productArray = [...serviceChargeSegregationArray];
    productArray[id][name] = value;
    setServiceChargeSegregationArray(productArray);
  };
  const getProject = async () => {
    let projects = await getApi(loanProject, 'get');
    setProjectsName(projects.data.data ? projects.data.data : []);
  };
  const getProduct = async () => {
    let products = await getApi(productList + '?projectId=' + parseInt(selectedProject) + '&productType=A', 'get');
    setAllProduct(products?.data?.data ? products.data.data : []);
  };
  const handleProductServiceChargeToggle = (e, i) => {
    const arr = [...productServiceChargeArray];
    arr[i]['isActive'] = !arr[i]['isActive'];
    setProductServiceChargeArray(arr);
  };
  const handleSlabWiseLoanToggle = (e, i) => {
    const arr = [...slabWiseLoanArray];
    arr[i]['isActive'] = !arr[i]['isActive'];
    setSlabWiseLoanArray(arr);
  };
  const handleProductChargeToggle = (e, i) => {
    const arr = [...productChargeArray];
    arr[i]['isActive'] = !arr[i]['isActive'];
    setProductChargeArray(arr);
  };
  const handleIsDocNoMandatoryToogle = (e, i) => {
    const arr = [...neccessaryDocDataArray];
    arr[i]['isDocNoMandatory'] = !arr[i]['isDocNoMandatory'];
    setNeccessaryDocDataArray(arr);
  };
  const handleServiceChargeSegregationToggle = (e, i) => {
    const arr = [...serviceChargeSegregationArray];
    arr[i]['isActive'] = !arr[i]['isActive'];
    setServiceChargeSegregationArray(arr);
  };

  const handleGracePeriodAllowedToggle = () => {
    setProductMasterObj((prevState) => ({
      ...prevState,
      allowGracePeriod: !prevState.allowGracePeriod,
    }));
  };

  const handleGracePeriodServiceChargeAllowedToggle = () => {
    setProductMasterObj((prevState) => ({
      ...prevState,
      serCrgAtGracePeriod: !prevState.serCrgAtGracePeriod,
    }));
  };
  const handleGraceInsuranceAllowedToggle = () => {
    setProductMasterObj((prevState) => ({
      ...prevState,
      allowInsurance: !prevState.allowInsurance,
    }));
  };
  const handleChequeDisbursementAllowedToggle = () => {
    setProductMasterObj((prevState) => ({
      ...prevState,
      chequeDisbursementFlag: !prevState.chequeDisbursementFlag,
    }));
  };
  const handleIsAdvPaymentAllowedToggle = () => {
    setProductMasterObj((prevState) => ({
      ...prevState,
      isAdvPayBenefit: !prevState.isAdvPayBenefit,
    }));
  };
  const handleProductMasterDataDate = (e) => {
    setProductMasterObj((prevState) => ({
      ...prevState,
      openDate: new Date(e),
    }));
  };

  const handleNeccessaryDocDataToggle = (i) => {
    const arr = [...neccessaryDocDataArray];
    arr[i]['isMandatory'] = !arr[i]['isMandatory'];
    setNeccessaryDocDataArray(arr);
  };
  const handleChange = (e) => {
    setSelectedProject(e.target.value);
  };
  const handleProductMasterObj = (e) => {
    const { name, value, id } = e.target;
    const newError = {};
    let resultObj = {};
    if (id == 'numberWithPercent') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }
      setFormError(formError);
      setProductMasterObj({
        ...productMasterObj,
        [name]: bangToEng(resultObj?.value),
      });

      return;
    }
    if (id == 'chargeNumber') {
      if (value.length == 1 && value == 0) return;

      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }
      switch (name) {
        case 'maxLoanAmt':
          if (
            productMasterObj.minLoanAmt &&
            Number(bangToEng(productMasterObj.minLoanAmt)) > Number(bangToEng(value))
          ) {
            newError.maxLoanAmt = 'ঋণের সর্বোচ্চ পরিমাণ ঋণের সর্বনিম্ন পরিমাণ অপেক্ষা ছোট হতে পারবে না';
          } else if (
            productMasterObj.minLoanAmt &&
            Number(bangToEng(productMasterObj.minLoanAmt)) < Number(bangToEng(value))
          ) {
            newError.maxLoanAmt = '';
            newError.minLoanAmt = '';
          } else {
            newError.maxLoanAmt = '';
          }
          setFormError(formError);
          setProductMasterObj({
            ...productMasterObj,
            [name]: bangToEng(resultObj?.value),
          });
          return;
        case 'minLoanAmt':
          if (
            productMasterObj.maxLoanAmt &&
            Number(bangToEng(productMasterObj.maxLoanAmt)) < Number(bangToEng(value))
          ) {
            newError.minLoanAmt = 'ঋণের সর্বনিম্ন পরিমাণ ঋণের সদস্য সর্বোচ্চ পরিমাণ অপেক্ষা বড় হতে পারবে না';
          } else if (
            productMasterObj.maxLoanAmt &&
            Number(bangToEng(productMasterObj.maxLoanAmt)) > Number(bangToEng(value))
          ) {
            newError.maxLoanAmt = '';
            newError.minLoanAmt = '';
          } else {
            newError.minLoanAmt = '';
          }
          setFormError({
            ...formError,
            ...newError,
          });
          setProductMasterObj({
            ...productMasterObj,
            [name]: bangToEng(resultObj?.value),
          });
          return;
      }
    }
    setProductMasterObj({
      ...productMasterObj,
      [name]: value,
    });
  };
  const handleChangeAcc = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleProductServiceChargeDate = (e, i) => {
    const arr = [...productServiceChargeArray];
    arr[i]['effectDate'] = new Date(e);
    setProductServiceChargeArray(arr);
  };
  const handleAddProServiceCharge = () => {
    setProductServiceChargeArray([
      ...productServiceChargeArray,
      {
        intRate: '',
        currentdueIntRate: '',
        overdueIntrate: '',
        effectDate: null,
        isActive: false,
      },
    ]);
  };
  const handleAddServiceChargeSegregation = () => {
    setServiceChargeSegregationArray([
      ...serviceChargeSegregationArray,
      {
        isActive: false,
        segregationId: '',
        segregationRate: '',
        glId: '',
      },
    ]);
  };
  const handleAddProductCharge = () => {
    setProductChargeArray([
      ...productChargeArray,
      {
        chargeGl: '',
        isActive: false,
        chargeTypeId: '',
        chargeValue: '',
        effectDate: null,
      },
    ]);
  };
  const handleAddNeccessaryDocData = () => {
    setNeccessaryDocDataArray([
      ...neccessaryDocDataArray,
      {
        docTypeId: '',
        isMandatory: false,
      },
    ]);
  };
  const handleAddSlabWiseLoan = () => {
    setSlabWiseLoanArray([
      ...slabWiseLoanArray,
      {
        depositPercent: '',
        isActive: false,
        loanNo: '',
        maxAmount: '',
        minAmount: '',
        preDisbInterval: '',
        sharePercent: '',
      },
    ]);
    setSlabWiseLoanArrayError([
      ...slabWiseLoanArrayError,
      {
        depositPercent: '',
        isActive: '',
        loanNo: '',
        maxAmount: '',
        minAmount: '',
        preDisbInterval: '',
        sharePercent: '',
      },
    ]);
  };
  const handleProductChargeDate = (e, i) => {
    const arr = [...productChargeArray];
    arr[i]['effectDate'] = new Date(e);
    setProductChargeArray(arr);
  };
  const individualProduct = async (id, name) => {
    setProName(name);
    setProId(id);
    let singleProducts = await getApi(productSingle + '?productId=' + parseInt(id), 'get');
    let loanTermString = '';
    let numberOfInstallmentString = '';
    singleProducts?.data?.data[0]?.productMaster?.loanTerm?.forEach((elem) => {
      if (loanTermString) {
        loanTermString += elem;
      } else {
        loanTermString = elem + ',';
      }
    });
    singleProducts?.data?.data[0]?.productMaster?.numberOfInstallment?.forEach((elem) => {
      if (numberOfInstallmentString) {
        numberOfInstallmentString += elem;
      } else {
        numberOfInstallmentString = elem + ',';
      }
    });
    if (singleProducts) {
      singleProducts.data.data[0].productMaster.loanTerm = loanTermString;
      singleProducts.data.data[0].productMaster.numberOfInstallment = numberOfInstallmentString;
    }

    let errorSlabArray = [];
    if (singleProducts) {
      setSpecificProduct(singleProducts?.data?.data ? singleProducts.data.data[0] : {});
      setProductChargeArray(singleProducts.data.data[0].productCharge);
      setProductServiceChargeArray(singleProducts.data.data[0].productServiceCharge);
      setNeccessaryDocDataArray(singleProducts.data.data[0].productDocuments);
      setServiceChargeSegregationArray(singleProducts.data.data[0].serviceChargeSegregation);
      setSlabWiseLoanArray(singleProducts.data.data[0].productSanctionPolicy);
      setProductMasterObj(singleProducts.data.data[0].productMaster);
      for (let i = 0; i < singleProducts.data.data[0].productSanctionPolicy.length; i++) {
        errorSlabArray.push({
          depositPercent: '',
          isActive: '',
          loanNo: '',
          maxAmount: '',
          minAmount: '',
          preDisbInterval: '',
          sharePercent: '',
        });
      }
      setSlabWiseLoanArrayError(errorSlabArray);
    }
  };

  // ("Slab error Array in Outside----",slabWiseLoanArrayError);

  const styleCardText = {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '16px',
  };



  const deleteProductServiceCharge = (event, index) => {
    const arr = productServiceChargeArray.filter((g, i) => index !== i);

    setProductServiceChargeArray(arr);
  };
  const deleteServiceChargeSegregation = (event, index) => {
    const arr = serviceChargeSegregationArray.filter((g, i) => index !== i);

    setServiceChargeSegregationArray(arr);
  };
  const deleteProductChargeData = (event, index) => {
    const arr = productChargeArray.filter((g, i) => index !== i);

    setProductChargeArray(arr);
  };
  const deleteSlabWiseLoanData = (event, index) => {
    const arr = slabWiseLoanArray.filter((g, i) => index !== i);
    const arrError = slabWiseLoanArrayError.filter((g, i) => index !== i);

    setSlabWiseLoanArray(arr);
    setSlabWiseLoanArrayError(arrError);
  };
  const deleteNeccessaryDocData = (event, index) => {
    const arr = neccessaryDocDataArray.filter((g, i) => index !== i);

    setNeccessaryDocDataArray(arr);
  };
  const showProduct = () => {
    const a = allProduct.map((val, idx) => {
      return (
        <Grid item key={idx} onClick={() => individualProduct(val.id, val.productName)} className="product-edit">
          <Grid>
            <div style={styleCardText}>
              <small>
                <Tooltip title="এডিট করুন">
                  <EditIcon className="edit-icon" />
                </Tooltip>{' '}
                <br />
                <p>{val.productName}</p>
              </small>
            </div>
            {/* <IconButton style={{ color: "#466a5b" }}
              onClick={() => individualProduct(val.id, val.productName)}
              aria-label="upload picture"
              component="label"
            >
              
            </IconButton> */}
          </Grid>
        </Grid>
      );
    });

    return a;
  };

  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  const {
    productMaster,
    productServiceCharge,
    serviceChargeSegregation,
    productCharge,
    productSanctionPolicy,
    productDocuments,
  } = specificProduct;

  return (
    <>
      <Grid container spacing={2.5} className="section">
        <Grid item md={12} xs={12} sm={12}>
          <TextField
            id="projectName"
            fullWidth
            label={star('প্রকল্প নির্বাচন করুন')}
            name="projectName"
            select
            SelectProps={{ native: true }}
            value={selectedProject}
            variant="outlined"
            size="small"
            onChange={handleChange}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projectsName.map((option, idx) => (
              <option key={idx} value={option.id}>
                {option.projectNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', gap: '1rem' }}>
          {showProduct()}
        </Grid>
      </Grid>

      {Object.keys(specificProduct).length !== 0 ? (
        <>
          <Grid container className="section">
            <Grid item xs={12} sm={12} md={12}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  color: 'green',
                  marginBottom: '8px',
                }}
              >
                <RateReviewIcon sx={{ marginRight: '8px' }} />
                <h3>
                  <span
                    style={{
                      color: '#EE5007',
                      fontSize: '17px',
                      textDecoration: 'underline',
                    }}
                  >
                    {proName}
                  </span>{' '}
                  প্রোডাক্টের তথ্য আপডেট করুন
                </h3>
              </div>
            </Grid>
            <Grid>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChangeAcc('panel1')} className="accordion">
                <AccordionSummary className="panel-header" aria-controls="panel1d-content" id="panel1d-header">
                  <Typography>প্রোডাক্টের তথ্য</Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {productMaster && Object.keys(productMaster ? productMaster : {}).length !== 0 ? (
                    <UpdateProductMaster
                      productMasterData={productMasterObj}
                      earningVal={earningVal}
                      valuePod={valuePod}
                      handleProductMaster={handleProductMasterObj}
                      handleGraceInsuranceAllowedToggle={handleGraceInsuranceAllowedToggle}
                      handleGracePeriodAllowedToggle={handleGracePeriodAllowedToggle}
                      handleGracePeriodServiceChargeAllowedToggle={handleGracePeriodServiceChargeAllowedToggle}
                      handleProductMasterDataDate={handleProductMasterDataDate}
                      handleIsAdvPaymentToggle={handleIsAdvPaymentAllowedToggle}
                      handleChequeDisbursementToggle={handleChequeDisbursementAllowedToggle}
                      formError={formError}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleChangeAcc('panel2')} className="accordion">
                <AccordionSummary className="panel-header" aria-controls="panel2d-content" id="panel2d-header">
                  <Typography>প্রোডাক্ট সার্ভিস চার্জ</Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {productServiceChargeArray && productServiceChargeArray.length !== 0 ? (
                    <UpdateProductServiceCharge
                      productServiceCharge={productServiceChargeArray ? productServiceChargeArray : []}
                      prevProductServiceCharge={productServiceCharge}
                      handleProductServiceCharge={handleProductServiceChargeArray}
                      handleToggle={handleProductServiceChargeToggle}
                      handleDate={handleProductServiceChargeDate}
                      deleteProductServiceCharge={deleteProductServiceCharge}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>
                {productServiceCharge.length >= productServiceChargeArray.length ? (
                  <Button
                    className="btn btn-primary"
                    variant="contained"
                    onClick={handleAddProServiceCharge}
                    size="small"
                  >
                    <AddIcons sx={{ display: 'block' }} /> প্রোডাক্ট সার্ভিস চার্জ যোগ করুন
                  </Button>
                ) : (
                  ''
                )}
              </Accordion>
              <Accordion expanded={expanded === 'panel3'} onChange={handleChangeAcc('panel3')} className="accordion">
                <AccordionSummary className="panel-header" aria-controls="panel3d-content" id="panel3d-header">
                  <Typography>সার্ভিস চার্জ বিভাজন</Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {serviceChargeSegregationArray && serviceChargeSegregationArray.length !== 0 ? (
                    <UpdateServiceChargeBivajon
                      prevServiceChargeSegregation={serviceChargeSegregation}
                      serviceChargeSegregation={serviceChargeSegregationArray}
                      handleServiceChargeSegregation={handleServiceChargeSegregationArray}
                      handleToggle={handleServiceChargeSegregationToggle}
                      deleteServiceChargeSegregation={deleteServiceChargeSegregation}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>

                <Button
                  className="btn btn-primary"
                  variant="contained"
                  onClick={handleAddServiceChargeSegregation}
                  size="small"
                >
                  <AddIcons sx={{ display: 'block' }} /> সার্ভিস চার্জ বিভাজন যোগ করুন
                </Button>
              </Accordion>
              <Accordion expanded={expanded === 'panel4'} onChange={handleChangeAcc('panel4')} className="accordion">
                <AccordionSummary className="panel-header" aria-controls="panel4d-content" id="panel4d-header">
                  <Typography>প্রোডাক্ট চার্জ </Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {productChargeArray && productChargeArray.length !== 0 ? (
                    <UpdateProductCharge
                      productChargeData={productChargeArray}
                      prevProductChargeData={productCharge}
                      handleProductCharge={handleProductChargeArray}
                      handleToggle={handleProductChargeToggle}
                      handleDate={handleProductChargeDate}
                      deleteProductChargeData={deleteProductChargeData}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>
                <Button className="btn btn-primary" variant="contained" onClick={handleAddProductCharge} size="small">
                  <AddIcons sx={{ display: 'block' }} /> প্রোডাক্ট চার্জ যোগ করুন
                </Button>
              </Accordion>
              <Accordion className="accordion" expanded={expanded === 'panel5'} onChange={handleChangeAcc('panel5')}>
                <AccordionSummary aria-controls="panel5d-content" id="panel5d-header" className="panel-header">
                  <Typography>স্লাব অনুযায়ী ঋণের তথ্য </Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {slabWiseLoanArray && slabWiseLoanArray.length !== 0 ? (
                    <UpdateSlabWiseLoan
                      slabWiseLoanData={slabWiseLoanArray}
                      prevSlabWiseLoanData={productSanctionPolicy}
                      handleSlabWiseLoanData={handleSlabWiseLoanArray}
                      handleToggle={handleSlabWiseLoanToggle}
                      deleteSlabWiseLoanData={deleteSlabWiseLoanData}
                      slabWiseLoanArrayError={slabWiseLoanArrayError}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>
                <Button className="btn btn-primary" variant="contained" onClick={handleAddSlabWiseLoan} size="small">
                  <AddIcons sx={{ display: 'block' }} /> স্লাব অনুযায়ী ঋণের তথ্য যোগ করুন
                </Button>
              </Accordion>
              <Accordion className="accordion" expanded={expanded === 'panel6'} onChange={handleChangeAcc('panel6')}>
                <AccordionSummary aria-controls="panel6d-content" id="panel6d-header" className="panel-header">
                  <Typography>প্রয়োজনীয় ডকুমেন্ট</Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {neccessaryDocDataArray && neccessaryDocDataArray.length !== 0 ? (
                    <UpdateNecessaryDoc
                      neccessaryDocData={neccessaryDocDataArray}
                      prevNeccessaryDocData={productDocuments}
                      handleNeccessaryDocData={handleNeccessaryDocDataArray}
                      handleToggle={handleNeccessaryDocDataToggle}
                      deleteNeccessaryDocData={deleteNeccessaryDocData}
                      handleIsDocNoMandatoryToogle={handleIsDocNoMandatoryToogle}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>
                <Button
                  className="btn btn-primary"
                  variant="contained"
                  onClick={handleAddNeccessaryDocData}
                  size="small"
                  startIcon={<AddIcons />}
                >
                  {' '}
                  প্রয়োজনীয় ডকুমেন্ট যোগ করুন
                </Button>
              </Accordion>
            </Grid>
          </Grid>
        </>
      ) : (
        ''
      )}
      {Object.keys(specificProduct).length !== 0 ? (
        <Grid container spacing={2.5} className="section" sx={{ marginTop: '2rem' }}>
          <Grid item lg={4} md={4} xs={12}>
            <Autocomplete
              disablePortal
              id="grouped-demo"
              options={officeNameOptions}
              onChange={handleChangeOffice}
              renderInput={(params) => <TextField fullWidth {...params} label="কার্যালয়" size="small" />}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              label="কর্মকর্তা ও পদবী"
              name="officerId"
              onChange={handleChangeSelect}
              required
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {employeeRecords.map((element, index) => (
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
          <Grid item>
            <Button variant="contained" onClick={() => saveData()} className="btn btn-primary" sx={{ height: '100%' }}>
              <PublishedWithChangesIcon />
              &nbsp; তথ্য আপডেট করুন
            </Button>
          </Grid>
        </Grid>
      ) : (
        ''
      )}

      {Object.keys(specificProduct).length !== 0 ? (
        <Grid container>
          <Grid
            item
            xs={5}
            sm={5}
            md={8}
            sx={{
              display: 'flex',
              marginTop: '10px',
              '& .MuiButton-root': {
                color: '#f4f4f4',
                backgroundColor: '#557c55',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',

                '&:hover': {
                  backgroundColor: '#95CD41',
                  color: '#95CD41',
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                },
              },
            }}
          ></Grid>
        </Grid>
      ) : (
        ''
      )}
    </>
  );
};

export default ProductList;
