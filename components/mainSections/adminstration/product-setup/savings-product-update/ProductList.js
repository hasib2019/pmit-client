
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
  getApprovedSavingsProduct,
  loanProject,
  officeName,
  productList,
  savingsProductUpdate
} from '../../../../../url/ApiList';
import { myValidate } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';
import UpdateNecessaryDoc from './UpdateNecessaryDoc';
import UpdateProductCharge from './UpdateProductCharge';
import UpdateProductInterest from './UpdateProductInterest';
import UpdateProductMaster from './UpdateProductMaster';

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
  const [productInstallmentArray, setProductInstallmentArray] = useState([]);
  const officeInfo = localStorageData('officeGeoData');
  const [productInterestError, setProductInterestError] = useState('');
  const [officeObj, setOfficeObj] = useState('');
  const [productMasterObj, setProductMasterObj] = useState({});
  const [neccessaryDocDataArray, setNeccessaryDocDataArray] = useState([]);
  const [productInterestArray, setProductInterestArray] = useState([]);

  // const [officeid, setOfficeId] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getProject();
    getOfficeName();
    if (officeInfo.id) {
      setOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
      getEmployeeName(officeInfo?.id);
    }
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

      setNextAppDesigId(designationId);
    }
  };
  const handleChangeOffice = (e, values) => {
    // setOfficeId(values.id);
    setOfficeObj(values);
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
    const { name, value, id, checked } = e.target;

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
    if (name == 'chargeActive') {
      productArray[ind][name] = checked;
      setProductChargeArray(productArray);
      return;
    }
    productArray[ind][name] = value;
    setProductChargeArray(productArray);
  };
  const saveData = async () => {
    // productServiceChargeArray.forEach((elem) => {
    //   if (elem.currentdueIntRate != "") {
    //     elem.currentdueIntRate = parseFloat(elem.currentdueIntRate);
    //   }
    //   if (elem.overdueIntrate != "") {
    //     elem.overdueIntRate = parseFloat(elem.overdueIntRate);
    //   }
    //   if (elem.intRate != "") {
    //     elem.intRate = parseFloat(elem.intRate);
    //   }
    // });
    // productChargeArray.forEach((elem) => {
    //   if (elem.chargeValue != "") {
    //     elem.chargeValue = parseFloat(elem.chargeValue);
    //   }
    // });

    // slabWiseLoanArray.forEach((elem) => {
    //   if (elem.depositPercent != "") {
    //     elem.depositPercent = parseFloat(elem.depositPercent);
    //   }

    //   if (elem.maxAmount != "") {
    //     elem.maxAmount = parseFloat(bangToEng(elem.maxAmount));
    //   }
    //   if (elem.loanNo != "") {
    //     elem.loanNo = parseFloat(bangToEng(elem.loanNo));
    //   }
    //   if (elem.minAmount != "") {
    //     elem.minAmount = parseFloat(bangToEng(elem.minAmount));
    //   }
    //   if (elem.preDisbInterval != "") {
    //     elem.preDisbInterval = parseFloat(bangToEng(elem.preDisbInterval));
    //   }
    //   if (elem.sharePercent != "") {
    //     elem.sharePercent = parseFloat(bangToEng(elem.sharePercent));
    //   }
    // });
    // serviceChargeSegregationArray.forEach((elem) => {
    //   if (elem.segregationRate != "") {
    //     elem.segregationRate = parseFloat(elem.segregationRate);
    //   }
    // });
    productInterestArray.forEach((v) => {
      (v.maturityAmount = bangToEng(v.maturityAmount)), (v.insAmt = bangToEng(v.insAmt));
      v.intRate = bangToEng(v.intRate);
      v.timePeriod = bangToEng(v.timePeriod);
    });
    let payload = {
      data: {
        productMaster: {
          productCode: productMasterObj.productCode,
          productName: productMasterObj.productName,
          ...(productMasterObj.depositNature == 'R' && {
            realizableSavings: productMasterObj.realizableSavings,
          }),
          ...(productMasterObj.depositNature == 'C' && {
            maturityMaxDay: productMasterObj.maturityMaxDay,
          }),
          repFrq: productMasterObj.repFrq,
          ...(productMasterObj.depositNature == 'C' && {
            insStartDay: bangToEng(productMasterObj?.insStartDay),
          }),
          ...(productMasterObj.depositNature == 'C' && {
            insEndDay: bangToEng(productMasterObj?.insEndDay),
          }),
          openDate: formatDate(productMasterObj.openDate),
          ...(productMasterObj.depositNature == 'C' && {
            minLoanAmt: Number(bangToEng(productMasterObj?.minLoanAmt)),
          }),
          ...(productMasterObj.depositNature == 'C' && {
            maxLoanAmt: Number(bangToEng(productMasterObj?.maxLoanAmt)),
          }),
          ...(productMasterObj.depositNature == 'C' && {
            fineAllow: productMasterObj?.fineAllow,
          }),
          ...(productMasterObj.depositNature == 'C' && {
            insHolidayConsideration: productMasterObj?.insHolidayConsideration,
          }),
          ...(productMasterObj.depositNature == 'C' && {
            afterMaturityInsAllow: productMasterObj.afterMaturityInsAllow,
          }),
          ...(productMasterObj.depositNature == 'C' && {
            intPostPeriod: productMasterObj.intPostPeriod,
          }),
          ...(productMasterObj.depositNature == 'C' && {
            defaultAction: productMasterObj.defaultAction,
          }),
          ...(productMasterObj.depositNature == 'C' && {
            maxDefaultInsAllow: productMasterObj.maxDefaultInsAllow,
          }),
          ...(productMasterObj.depositNature == 'C' && {
            maturityAmtInstruction: productMasterObj.maturityAmtInstruction,
          }),
        },
        productId: proId,
        projectId: productMasterObj.projectId,
        productCharge: productChargeArray,
        productInterest: productInterestArray,
        productDocuments: neccessaryDocDataArray,
      },
      nextAppDesignationId: nextAppDesigId,
      projectId: productMasterObj.projectId,
    };
    try {
      const res = await getApi(savingsProductUpdate + '/loan', 'post', payload);
      if (res.data.data) {
        let message = res.data.message;
        NotificationManager.success(message, '', 5000);
        setProductChargeArray([]);
        setProductInstallmentArray([]);
        setProductInterestArray([]);
        setNeccessaryDocDataArray([]);
        setProductMasterObj([]);
        setNextAppDesigId('');
        // setOfficeId('');
        setSpecificProduct('');
      }
    } catch (err) {
      errorHandler(err)

    }
  };
  const handleProductInterest = (e, ind) => {
    let { name, value, id, checked } = e.target;

    const productInterestArrayCopy = [...productInterestArray];
    const productInterestErrorCopy = [...productInterestError];
    let resultObj;
    if (name == 'isActive') {
      productInterestArrayCopy[ind][name] = checked;
      setProductInterestArray(productInterestArrayCopy);
      return;
    }
    value = bangToEng(value);
    if (id == 'number') {
      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }
    } else if (id == 'chargeNumber') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }
    }

    productInterestArrayCopy[ind][name] = bangToEng(resultObj?.value);
    setProductInterestArray(productInterestArrayCopy);
    setProductInterestError(productInterestErrorCopy);
  };
  const handleNeccessaryDocDataArray = (e, id) => {
    const { name, value, checked } = e.target;
    const neccessaryDocArray = [...neccessaryDocDataArray];
    if (name == 'isMandatory' || name == 'isActive') {
      neccessaryDocArray[id][name] = checked;
      setNeccessaryDocDataArray(neccessaryDocArray);
      return;
    }
    neccessaryDocArray[id][name] = value;
    setNeccessaryDocDataArray(neccessaryDocArray);
  };
  const handleProductInstallmentArray = (e, ind) => {
    let { name, value, id, checked } = e.target;
    value = bangToEng(value);
    const productArray = [...productInstallmentArray];

    let resultObj;
    if (id == 'numberWithPercent') {
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }

      productArray[ind][name] = bangToEng(resultObj?.value);
      setProductInstallmentArray(productArray);
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }
    if (name == 'isActive') {
      productArray[ind][name] = checked;
      setProductInstallmentArray(productArray);
      return;
    }

    productArray[ind][name] = value;
    setProductInstallmentArray(productArray);
  };
  const getProject = async () => {
    let projects = await getApi(loanProject, 'get');
    setProjectsName(projects.data.data ? projects.data.data : []);
  };
  const getProduct = async () => {
    let products = await getApi(productList + '?projectId=' + parseInt(selectedProject) + '&productType=L', 'get');
    setAllProduct(products?.data?.data ? products.data.data : []);
  };
  const handleProductMasterDataDate = (e) => {
    setProductMasterObj((prevState) => ({
      ...prevState,
      openDate: new Date(e),
    }));
  };

  const handleChange = (e) => {
    setSelectedProject(e.target.value);
  };
  const handleProductMasterObj = (e) => {
    const { name, value, id, checked } = e.target;
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
    if (name == 'fineAllow' || name === 'insHolidayConsideration' || name == 'afterMaturityInsAllow') {
      setProductMasterObj({
        ...productMasterObj,
        [name]: checked,
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

  const handleAddProductCharge = () => {
    setProductChargeArray([
      ...productChargeArray,
      {
        chargeGl: '',
        isActive: true,
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
        isActive: true,
      },
    ]);
  };
  const handleAddProductInterest = () => {
    setProductInterestArray([
      ...productInterestArray,
      {
        effectDate: null,
        intRate: '',
        maturityAmount: '',
        timePeriod: '',
        isActive: true,
        insAmt: '',
        productPreMature: [],
      },
    ]);
    setProductInterestError([
      ...productInterestError,
      {
        effectDate: null,
        intRate: '',
        maturityAmount: '',
        timePeriod: '',
        isActive: false,
        insAmt: '',
      },
    ]);
  };
  const handleProductInterestDate = (e, i) => {
    const arr = [...productInterestArray];
    arr[i]['effectDate'] = new Date(e);
    setProductInterestArray(arr);
  };
  const handleProductChargeDate = (e, i) => {
    const arr = [...productChargeArray];
    arr[i]['effectDate'] = new Date(e);
    setProductChargeArray(arr);
  };
  const individualProduct = async (id, name) => {
    setProName(name);
    setProId(id);
    let singleProducts = await getApi(getApprovedSavingsProduct + '/' + parseInt(id), 'get');
    if (singleProducts) {
      singleProducts.data.data.productMaster['realizableSavings'] =
        singleProducts.data.data.productMaster['defaultAmt'];

      setSpecificProduct(singleProducts?.data?.data ? singleProducts.data.data : {});
      setProductChargeArray(singleProducts?.data?.data?.productCharge || []);

      setNeccessaryDocDataArray(singleProducts?.data?.data?.productDocuments || []);

      const productPreMatureArray = singleProducts?.data?.data?.productPreMature;

      const productInterestArray = singleProducts?.data?.data?.productInterest;

      // for(let i=0;i<productInterestArray.length;i++){
      //   if(Object.values(productPreMatureArray[i])){
      //   productInterestArray[i].productPreMature=productPreMatureArray[i];
      //   }else{
      //     productInterestArray[i].productPreMature=[];
      //   }
      // }

      productInterestArray.forEach((elem) => {
        const intId = elem.id;
        const productPreMature = productPreMatureArray.filter((element) => element.interestId == intId);
        elem.productPreMature = productPreMature;
      });

      setProductInstallmentArray(singleProducts?.data?.data?.productPreMature || []);
      setProductInterestArray(productInterestArray || []);

      setProductMasterObj(singleProducts?.data?.data?.productMaster);
      // for (
      //   let i = 0;
      //   i < singleProducts.data.data[0].productSanctionPolicy.length;
      //   i++
      // ) {
      //   errorSlabArray.push({
      //     depositPercent: "",
      //     isActive: "",
      //     loanNo: "",
      //     maxAmount: "",
      //     minAmount: "",
      //     preDisbInterval: "",
      //     sharePercent: "",
      //   });
      // }
      // setSlabWiseLoanArrayError(errorSlabArray);
    }
  };

  const styleCardText = {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '16px',
  };


  const deleteProductChargeData = (event, index) => {
    const arr = productChargeArray.filter((g, i) => index !== i);

    setProductChargeArray(arr);
  };
  const deleteProductInterest = (event, index) => {
    const arr = productInterestArray.filter((g, i) => index !== i);
    const arrError = productInterestError.filter((g, i) => index !== i);

    setProductInterestArray(arr);
    setProductInterestError(arrError);
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

  const { productMaster, productPreMature, productInterest, productCharge, productDocuments } = specificProduct;
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
                  সঞ্চয়ী প্রোডাক্টের তথ্য আপডেট করুন
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
                      handleProductMaster={handleProductMasterObj}
                      handleProductMasterDataDate={handleProductMasterDataDate}
                      formError={formError}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel3'} onChange={handleChangeAcc('panel3')} className="accordion">
                <AccordionSummary className="panel-header" aria-controls="panel3d-content" id="panel3d-header">
                  <Typography>প্রোডাক্ট মুনাফা</Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {productInterestArray && productInterestArray.length !== 0 ? (
                    <UpdateProductInterest
                      productInterest={productInterestArray}
                      prevProductInterest={productInterest}
                      handleProductInterest={handleProductInterest}
                      deleteProductInterest={deleteProductInterest}
                      productInterestError={productInterestError}
                      handleProductInterestDate={handleProductInterestDate}
                      productInstallment={productInstallmentArray ? productInstallmentArray : []}
                      prevProductInstallment={productPreMature}
                      handleProductInstallment={handleProductInstallmentArray}
                      setProductInterest={setProductInterestArray}
                    />
                  ) : (
                    ''
                  )}
                </AccordionDetails>

                <Button className="btn btn-primary" variant="contained" onClick={handleAddProductInterest} size="small">
                  <AddIcons sx={{ display: 'block' }} />
                  প্রোডাক্ট মুনাফা যোগ করুন
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
                  <Typography>প্রয়োজনীয় ডকুমেন্ট</Typography>
                </AccordionSummary>
                <AccordionDetails className="panel-body">
                  {neccessaryDocDataArray && neccessaryDocDataArray.length !== 0 ? (
                    <UpdateNecessaryDoc
                      neccessaryDocData={neccessaryDocDataArray}
                      prevNeccessaryDocData={productDocuments}
                      handleNeccessaryDocData={handleNeccessaryDocDataArray}
                      deleteNeccessaryDocData={deleteNeccessaryDocData}
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
              defaultValue={officeObj}
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
