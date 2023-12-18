import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import LoadingButton from '@mui/lab/LoadingButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import axios from 'axios';
import { parseInt } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from 'service/numberConverter';
import {
  appliedLoanMember,
  bankInfoRoute,
  employeeRecordByOffice,
  loanDetailsRoute,
  loanProject,
  officeName,
  samityNameRoute,
  specificApplication
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../loan-application/utils';
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

const transactionType = [
  {
    value: 'cash',
    label: 'নগদ প্রদান',
  },
  {
    value: 'cheque',
    label: 'চেক',
  },
];

const LoanDisversment = () => {
  const compoName = localStorageData('componentName');
  const [expanded, setExpanded] = useState(false);
  const [samityNameObj, setSamityNameObj] = useState({
    id: '',
    label: '',
  });
  const officeInfo = localStorageData('officeGeoData');

  const [memberNameObj, setMemberNameObj] = useState({
    id: '',
    label: '',
  });

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const [multipleDisbursemnt, setMultipleDisbursement] = useState(false);
  const [disbursedAmount, setDisbursedAmount] = useState(0);

  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const config = localStorageData('config');

  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [ProjectName, setProjectName] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [productName, setProductName] = useState('');
  const [samityName, setSamityName] = useState([]);
  const [totalInsuranceAmount, setTotalInsuranceAmount] = useState('');
  const [totalInsAmount, setTotalInsAmount] = useState(0);
  const [totalServiceChargeAmount, setTotalServiceChargeAmount] = useState(0);
  const [totalPayableAmount, setTotalPayableAmount] = useState(0);
  const [loanDetails, setLoanDetails] = useState({
    loanTerm: '',
    loanAmount: '',
    loanFrequency: '',
    purposeName: '',
    serviceCharge: '',
    installmentAmount: '',
    installmentNo: '',
    serviceChargeRate: '',
    insurancePercent: '',
    allowInsurance: '',
    insuranceAmount: '',
    schedule: [],
  });

  const [member, setMember] = useState([]);
  const [projectDisable, setProjectDisable] = useState(false);
  const [cash, setCash] = useState(false);
  const [cheque, setCheque] = useState(false);
  const [bankName, setBankName] = useState([]);
  const [bankId, setBankId] = useState(null);
  const [branchName, setBranchName] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [accountDataList, setAccountDataList] = useState([]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);
  const [narration, setNarration] = useState('');
  const [deskList, setDeskList] = useState([]);
  const [chequeNumber, setChequeNumber] = useState('');
  const [deskId, setDeskId] = useState(null);
  const [cashOrCheck, setCashOrCheck] = useState('');
  const [chequeDate, setChequeDate] = useState(null);
  const [officeNames, setOfficeNames] = useState([]);
  const [disbursementAmount, setDisbursementAmount] = useState('');
  const [disbursementError, setDisbursementError] = useState(null);
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [deskObj, setDeskObj] = useState({
    id: '',
    label: '',
  });
  useEffect(() => {
    getProject();
    getBankType();
    getOfficeName();
    if (officeInfo.id) {
      setOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
      getDeskId(officeInfo?.id);
    }
    if (getTokenData?.isProjectAllow == false) getSamity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProject = (e) => {
    const { value } = e.target;
    setProjectId(value);
    getSamity(value);
  };

  const insuranceCalculation = (parsent, loanAmount) => {
    let insuranceAmount = (parseInt(parsent) / parseInt(100)) * parseInt(loanAmount);
    setTotalInsuranceAmount(insuranceAmount);
  };

  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  // const handleProduct = (e) => {
  //   const { name, value } = e.target;
  //   setProductId(value);
  // };

  // const handleSamity = (e) => {
  //   const { name, value } = e.target;
  //   setSamityId(value);
  //   getMember(value);
  // };

  const handleTransactionType = (e) => {
    const { value } = e.target;
    if (value == 'cash') {
      setCash(true);
      setCheque(false);
      setChequeNumber(null);
      setChequeDate(null);
    } else if (value == 'cheque') {
      setCheque(true);
      setCash(false);
      setNarration(null);
    }
    if (projectId != 'নির্বাচন করুন' && projectId && value == 'cheque') {
      getAccountNumber();
    }
    setCashOrCheck(value);
  };

  // const handleDesk = (e) => {
  //   const { name, value } = e.target;
  //   setDeskId(value);
  // };

  const handleBankName = (e) => {
    const { value } = e.target;
    setBankId(value);
    getBranchs(value);
  };

  const handleDateChangeEx = (e) => {
    let expireDate = moment(e).format('MMM Do YY');
    let sysDate = moment(new Date()).format('MMM Do YY');
    if (sysDate > expireDate) {
      setFormErrors({
        ...formErrors,
        chequeDate: ' ',
      });
    }
    setChequeDate(e);
  };

  // ("EEEEEEE=====",chequeDate,typeof(chequeDate));
  const handleBranchName = (e) => {
    const { value } = e.target;
    setBranchId(value);
    // if (projectId && bankId) {
    //   getAccountNumber(projectId);
    // }
  };

  const handleAccountNumber = (e) => {
    const { value } = e.target;
    setSelectedAccountNumber(value);
  };
  const handleDispription = (e) => {
    const { value } = e.target;
    setNarration(value);
  };
  const checkForValue = (value) => {
    const loanAmount = loanDetails.loanAmount;
    const totalInput = Number(value) + Number(disbursedAmount);
    if (totalInput > Number(loanAmount)) {
      setDisbursementError('ঋণ বিতরনের পরিমাণ ঋণ এর পরিমাণ অপেখা বর হতে পারবে না');
    } else {
      setDisbursementError(null);
    }
  };
  const handleDisbursementAmount = (e) => {
    let { value } = e.target;
    const regex = /[0-9]$/;
    let result;
    let returnValue;
    value = bangToEng(value);
    if (value.length > 8) {
      return;
    }
    result = regex.test(value);

    returnValue = result ? value : value.slice(0, -1);

    checkForValue(value);

    setDisbursementAmount(returnValue);
  };
  const handleChequeNumber = (e) => {
    const { value } = e.target;
    if (value.length == 16) {
      return;
    }
    const inputValue = value.replace(/[^A-Za-z0-9]/, '');
    setChequeNumber(inputValue.toUpperCase());
    return;
  };

  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    let loanSchedule;
    payload = {
      projectId: projectId ? parseInt(projectId) : null,
      projectStatus: getTokenData?.isProjectAllow,
      samityId: parseInt(samityNameObj.id),
      // samityId: parseInt(samityId),
      data: {
        customerId: parseInt(memberNameObj.id),
        projectId: projectId ? parseInt(projectId) : null,
        sanctionId: loanDetails.id,
        samityId: parseInt(samityNameObj.id),
        ...(cash && {
          transaction: {
            narration,
            type: cash ? 'cash' : '',
            disbursedAmount: disbursementAmount,
          },
        }),
        ...(cheque && {
          transaction: {
            type: cheque ? 'cheque' : '',
            bankId: parseInt(bankId),
            branchId: parseInt(branchId),
            accountNo: selectedAccountNumber,
            chequeNum: chequeNumber,
            chequeDate: chequeDate,
            disbursedAmount: disbursementAmount,
          },
        }),
      },
      nextAppDesignationId: deskObj.id ? parseInt(deskObj.id) : '',
      // nextAppDesignationId: parseInt(deskId),
    };
    if (result) {
      try {
        setLoadingDataSaveUpdate(true);
        loanSchedule = await axios.post(specificApplication + 'loanSchedule' + '/' + compoName, payload, config);
        NotificationManager.success(loanSchedule?.data?.message, '', 5000);
        setLoadingDataSaveUpdate(false);
        // getMemberByOffice(selectedOffice);
        setSamityNameObj({
          id: '',
          label: '',
        });
        setDeskObj({
          id: '',
          label: '',
        });
        setMemberNameObj({
          id: '',
          label: '',
        });
        setDeskId('নির্বাচন করুন');
        setLoanDetails([]);
        setBankId('নির্বাচন করুন');
        setBranchId('নির্বাচন করুন');
        setSelectedAccountNumber('নির্বাচন করুন');
        setNarration('');
        setCashOrCheck('নির্বাচন করুন');
        setChequeNumber('');
        setChequeDate(null);
        setTotalInsAmount('');
        setTotalPayableAmount('');
        setTotalServiceChargeAmount('');
        setLoanDetails({
          loanTerm: '',
          loanAmount: '',
          loanFrequency: '',
          purposeName: '',
          serviceCharge: '',
          installmentAmount: '',
          installmentNo: '',
          serviceChargeRate: '',
        });
        setDisbursementAmount('');

        setTotalInsuranceAmount('');
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('সংযোগে ত্রুটি হয়েছে', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  let checkMandatory = () => {
    let result = true;
    // if (transactionType == 'cheque') {
    //   let expireDate = moment(chequeDate).format('MMM Do YY');
    //   let sysDate = moment(new Date()).format('MMM Do YY');

    //   // if (sysDate > expireDate) {
    //   //   formErrorsCopy.chequeDate = 'চেক প্রদানের তারিখ আজকের তারিখের চেয়ে ছোট হতে পারবে না';
    //   //   result = false;
    //   // } else {
    //   //   formErrorsCopy.chequeDate = '';
    //   // }
    //   return result;
    // }
    if (multipleDisbursemnt && disbursementAmount == '') {
      setDisbursementError('ঋণ বিতরনের পরিমাণ উল্লেখ করুন');
      result = false;
    } else {
      setDisbursementError('');
    }
    if (disbursementError) {
      result = false;
    }

    // if (projectId == null || projectId == "নির্বাচন করুন") {
    //   result = false;
    //   formErrors.ProjectName = "প্রোজেক্ট নির্বাচন করুন";
    // }
    // if (productId == null || productId == "নির্বাচন করুন") {
    //   result = false;
    //   formErrors.productName = "প্রোডাক্ট নির্বাচন করুন";
    // }
    // if (samityId == null || samityId == "নির্বাচন করুন") {
    //   result = false;
    //   formErrors.samityName = "সমিতি নির্বাচন করুন";
    // }
    // if (memberId == null || memberId == "নির্বাচন করুন") {
    //   result = false;
    //   formErrors.member = "সদস্য নির্বাচন করুন";
    // }
    // if (deskId == null || deskId == "নির্বাচন করুন") {
    //   result = false;
    //   formErrors.deskList = "পর্যবেক্ষক/অনুমোদনকারী নাম নির্বাচন করুন";
    // }/** */
    return result;
  };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      if (projectList.length == 1) {
        setProjectId(projectList[0].id);
        setProjectDisable(true);
        getSamity(projectList[0].id);
      }
      setProjectName(projectList);
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

  // const getProduct = async (proId) => {
  //   if (proId && proId != "নির্বাচন করুন") {
  //     try {
  //       const allProduct = await axios.get(
  //         product + "?projectId=" + proId + "&productType=A"+"&depositNature=L",
  //         config
  //       );

  //       let productList = allProduct.data.data;
  //       if (productList.length == 1) {
  //         setProductId(productList[0].id);
  //         setProductDisable(true);
  //       }
  //       setProductName(productList);
  //     } catch (error) {
  //       if (error.response) {
  //         let message = error.response.data.errors[0].message;
  //         NotificationManager.error(message, "", 5000);
  //       } else if (error.request) {
  //         NotificationManager.error("Error Connecting...", "", 5000);
  //       } else if (error) {
  //         NotificationManager.error(error.toString(), "", 5000);
  //       }
  //     }
  //   } else {
  //     try {
  //       const allProduct = await axios.get(product + "?productType=A", config);

  //       let productList = allProduct.data.data;
  //       if (productList.length == 1) {
  //         setProductId(productList[0].id);
  //         setProductDisable(true);
  //       }
  //       setProductName(productList);
  //     } catch (error) {
  //       if (error.response) {
  //         let message = error.response.data.errors[0].message;
  //         NotificationManager.error(message, "", 5000);
  //       } else if (error.request) {
  //         NotificationManager.error("Error Connecting...", "", 5000);
  //       } else if (error) {
  //         NotificationManager.error(error.toString(), "", 5000);
  //       }
  //     }
  //   }
  // };

  const getSamity = async (project) => {
    if (project && project != 'নির্বাচন করুন') {
      try {
        const samity = await axios.get(samityNameRoute + '?value=1&project=' + project, config);
        let samityData = samity.data.data;
        setSamityName(samityData);
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
    } else {
      try {
        const samity = await axios.get(samityNameRoute + '?value=1', config);
        let samityData = samity.data.data;
        setSamityName(samityData);
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

  const getMember = async (samityId) => {
    if (samityId != 'নির্বাচন করুন') {
      try {
        const member = await axios.get(appliedLoanMember + '?type=disburse&samityId=' + samityId, config);

        let memberData = member.data.data;

        setMember(memberData);
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
    } else {
      // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
    }
  };
  // const getLoanSchedule = async (principal, loanTerm, rate, installmentNumber, installmentType, interestType) => {
  //   try {
  //     const scheduleData = await axios.get(
  //       serviceChargeRoute +
  //       '?principal=' +
  //       principal +
  //       '&rate=' +
  //       rate +
  //       '&interestType=' +
  //       interestType +
  //       '&installmentNumber=' +
  //       installmentNumber +
  //       '&installmentType=' +
  //       installmentType +
  //       '&time=' +
  //       loanTerm,
  //       config,
  //     );

  //     let scheduleList = loanDetails.schedule;

  //     let length = scheduleList.length;
  //     let totalInstallmentPrinciple = 0;
  //     let totalServiceCharge = 0;
  //     let totalChargedAmount = 0;
  //     for (let i = 0; i < length; i++) {
  //       totalInstallmentPrinciple += scheduleList[i].installmentPrincipalAmt
  //         ? Number(scheduleList[i].installmentPrincipalAmt)
  //         : 0;
  //       totalServiceCharge += scheduleList[i].installmentServiceChargeAmt
  //         ? Number(scheduleList[i].installmentServiceChargeAmt)
  //         : 0;
  //       totalChargedAmount += scheduleList[i].total ? Number(scheduleList[i].total) : 0;
  //       setTotalInsAmount(totalInstallmentPrinciple);
  //       setTotalServiceChargeAmount(totalServiceCharge);
  //       setTotalPayableAmount(totalChargedAmount);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, '', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', '', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), '', 5000);
  //     }
  //   }
  // };
  const getMemberLoanDetails = async (customerId) => {
    if (customerId != 'নির্বাচন করুন') {
      try {
        const loanDetails = await axios.get(loanDetailsRoute + '?customerId=' + customerId, config);

        let memberLoanDetails = loanDetails.data.data ? loanDetails.data.data[0] : undefined;
        setLoanDetails(memberLoanDetails);
        setProductName(memberLoanDetails?.productName);
        insuranceCalculation(memberLoanDetails.insurancePercent, memberLoanDetails.loanAmount);
        if (memberLoanDetails) {
          let scheduleList = memberLoanDetails.schedule;
          let length = scheduleList.length;
          let totalInstallmentPrinciple = 0;
          let totalServiceCharge = 0;
          let totalChargedAmount = 0;
          for (let i = 0; i < length; i++) {
            totalInstallmentPrinciple += scheduleList[i].installmentPrincipalAmt
              ? Number(scheduleList[i].installmentPrincipalAmt)
              : 0;
            totalServiceCharge += scheduleList[i].installmentServiceChargeAmt
              ? Number(scheduleList[i].installmentServiceChargeAmt)
              : 0;
            totalChargedAmount += scheduleList[i].total ? Number(scheduleList[i].total) : 0;
          }
          setTotalInsAmount(totalInstallmentPrinciple);
          setTotalServiceChargeAmount(totalServiceCharge);
          setTotalPayableAmount(totalChargedAmount);
          setMultipleDisbursement(memberLoanDetails?.isMultipleDisbursementAllow);
          setDisbursedAmount(memberLoanDetails?.disbursedAmount);
        }
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
    } else {
      // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
    }
  };

  const getDeskId = async (id) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, config);
      const deskData = Data.data.data;

      // if (deskData.length == 1) {
      //   setSelectedDesk(deskData[0].designationId);
      //   document.getElementById("deskId").setAttribute("disabled", "true");
      // }
      setDeskList(deskData);
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

  const getBankType = async () => {
    try {
      let Data = await axios.get(bankInfoRoute + '?type=bank', config);
      const bankType = Data.data.data;
      setBankName(bankType);
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

  const getBranchs = async (bankId) => {
    try {
      let Data = await axios.get(bankInfoRoute + '?type=branch' + '&bankId=' + bankId, config);
      const branchList = Data.data.data;
      setBranchName(branchList);
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
  const getAccountNumber = async () => {
    try {
      let Data = await axios.get(bankInfoRoute + '?type=account' + '&projectId=' + projectId, config);
      const accountList = Data.data.data;
      setAccountDataList(accountList);
      setSelectedAccountNumber(accountList[0]['accountNo']);
      setBankId(accountList[0]['bankId']);

      await getBranchs(accountList[0]['bankId']);
      setBranchId(accountList[0]['branchId']);
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
      <Grid container>
        <Grid item md={12} xs={12}>
          <Grid container spacing={2.5} className="section">
            {getTokenData?.isProjectAllow == true && (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  id="projectId"
                  label={star('প্রকল্পের নাম')}
                  name="projectName"
                  onChange={handleProject}
                  disabled={projectDisable}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                  value={projectId ? projectId : ' '}
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {ProjectName
                    ? ProjectName.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.projectNameBangla}
                      </option>
                    ))
                    : ' '}
                </TextField>
                {!projectId && <span style={{ color: 'red' }}>{formErrors.ProjectName}</span>}
              </Grid>
            )}
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="samityId"
                key={samityNameObj}
                onChange={(event, value) => {
                  if (value == null) {
                    setSamityNameObj({
                      id: '',
                      label: '',
                    });
                  } else {
                    value &&
                      setSamityNameObj({
                        id: value.id,
                        label: value.label,
                      });
                    getMember(value.id);
                  }
                }}
                options={samityName
                  .map((option) => ({
                    id: option.id,
                    label: option.samityName,
                  }))
                  .filter((e) => e.id != null && e.employeeId !== null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={samityNameObj.id === '' ? star(' সমিতির নাম নির্বাচন করুন') : star(' সমিতির নাম')}
                    variant="outlined"
                    size="small"
                  />
                )}
                value={samityNameObj}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="memberName"
                key={memberNameObj}
                onChange={(event, value) => {
                  if (value == null) {
                    setLoanDetails();
                    setMemberNameObj({
                      id: '',
                      label: '',
                    });
                  } else {
                    value &&
                      setMemberNameObj({
                        id: value.id,
                        label: value.label,
                      });
                    value && value?.id && getMemberLoanDetails(value.id);
                  }
                }}
                options={member
                  .map((option) => ({
                    id: option.id,
                    label: option.nameBn,
                  }))
                  .filter((e) => e.id != null && e.employeeId !== null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={memberNameObj.id === '' ? star('সদস্যের নাম নির্বাচন করুন') : star(' সদস্যের নাম')}
                    variant="outlined"
                    size="small"
                  />
                )}
                value={memberNameObj}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container className="section">
            <SubHeading>সদস্যের ঋণ সংক্রান্ত তথ্য</SubHeading>
            <Grid container spacing={2.5}>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="প্রোডাক্টের নাম"
                  variant="outlined"
                  size="small"
                  value={productName}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="ঋণের পরিমাণ (টাকা)"
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.loanAmount) : ' '}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="ঋণের মেয়াদ (মাস)"
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.loanTerm) : ''}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label=" কিস্তি আদায়ের ধরণ "
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={
                    typeof loanDetails != 'undefined'
                      ? loanDetails.installmentFrequency == 'M'
                        ? 'মাসিক'
                        : loanDetails.installmentFrequency == 'W'
                          ? 'সাপ্তাহিক'
                          : ''
                      : ''
                  }
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="ঋণের উদ্দেশ্য"
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={typeof loanDetails != 'undefined' ? loanDetails.purposeName : ''}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="সার্ভিস চার্জ  (টাকা)"
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.serviceCharge) : ''}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="কিস্তির পরিমান (টাকা)"
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.installmentAmount) : ''}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="কিস্তির সংখ্যা"
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.installmentNo) : ''}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="সার্ভিস চার্জের হার (%)"
                  name="loanAmount"
                  variant="outlined"
                  size="small"
                  value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.serviceChargeRate) : ''}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="বীমা / ঝুঁকি তহবিল ( টাকা )"
                  name="InsuranceFund"
                  variant="outlined"
                  size="small"
                  value={totalInsuranceAmount ? engToBang(totalInsuranceAmount) : ''}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="বিতরণকৃত ঋণের পরিমাণ"
                  name="disbursedAmount"
                  variant="outlined"
                  size="small"
                  value={disbursedAmount ? engToBang(disbursedAmount) : ''}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <Grid container className="section">
            <SubHeading>লেনদেন সংক্রান্ত তথ্য</SubHeading>
            <Grid container spacing={2.5}>
              {multipleDisbursemnt && (
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label={star('ঋণ বিতরনের পরিমাণ')}
                    onChange={handleDisbursementAmount}
                    name="disbursementAmount"
                    variant="outlined"
                    size="small"
                    error={disbursementError ? true : false}
                    helperText={disbursementError}
                    value={engToBang(disbursementAmount)}
                  />
                </Grid>
              )}

              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={star('লেনদেনের মাধ্যম')}
                  name="cashOrCheck"
                  onChange={handleTransactionType}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                  value={cashOrCheck ? cashOrCheck : ' '}
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {transactionType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              {cash ? (
                <Grid item md={8} xs={12}>
                  <TextField
                    fullWidth
                    label={star('বিবরণ')}
                    onChange={handleDispription}
                    name="discription"
                    variant="outlined"
                    size="small"
                    value={narration}
                  />
                </Grid>
              ) : (
                ' '
              )}
              {cheque ? (
                <Grid item md={4} xs={6}>
                  <TextField
                    fullWidth
                    label={star('চেক নম্বর')}
                    onChange={handleChequeNumber}
                    name="discription"
                    variant="outlined"
                    size="small"
                    value={chequeNumber}
                  />
                </Grid>
              ) : (
                ''
              )}

              {cheque && (
                <Grid item md={4} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label={star('চেক প্রদানের তারিখ (ইংরেজি)')}
                      name="birthDate"
                      inputFormat="dd/MM/yyyy"
                      value={chequeDate}
                      disablePast
                      onChange={(e) => handleDateChangeEx(e)}
                      renderInput={(params) => (
                        <TextField InputProps={{ readOnly: true }} {...params} fullWidth size="small" />
                      )}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                  {<span style={{ color: 'red' }}>{formErrors.chequeDate}</span>}
                </Grid>
              )}
              {cheque ? (
                <Grid item md={4} xs={6}>
                  <TextField
                    fullWidth
                    label={star('ব্যাংকের নাম')}
                    name="bankName"
                    disabled={true}
                    select
                    onChange={handleBankName}
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                    value={bankId ? bankId : ' '}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {bankName
                      ? bankName.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.bankName}
                        </option>
                      ))
                      : ' '}
                  </TextField>
                </Grid>
              ) : (
                ''
              )}
              {cheque ? (
                <Grid item md={4} xs={6}>
                  <TextField
                    fullWidth
                    label={star('ব্রাঞ্চের নাম')}
                    name="bankName"
                    disabled={true}
                    select
                    onChange={handleBranchName}
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                    value={branchId ? branchId : ' '}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {branchName
                      ? branchName.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.branchName}
                        </option>
                      ))
                      : ' '}
                  </TextField>
                </Grid>
              ) : (
                ' '
              )}
              {cheque ? (
                <Grid item md={4} xs={6}>
                  <TextField
                    fullWidth
                    select
                    label={star('হিসাব নম্বর (ইংরেজি)')}
                    onChange={handleAccountNumber}
                    name="accNumber"
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                    value={selectedAccountNumber ? selectedAccountNumber : ' '}
                    disabled={true}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {accountDataList
                      ? accountDataList.map((option) => (
                        <option key={option.id} value={option.accountNo}>
                          {engToBang(option.accountNo)}
                        </option>
                      ))
                      : ' '}
                  </TextField>
                </Grid>
              ) : (
                ''
              )}
              {cheque || cash ? (
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    disablePortal
                    inputProps={{ style: { padding: 0, margin: 0 } }}
                    name="officeName"
                    onChange={(event, value) => {
                      if (value == null) {
                        setOfficeObj({
                          id: '',
                          label: '',
                        });
                      } else {
                        value &&
                          setOfficeObj({
                            id: value.id,
                            label: value.label,
                          });
                        getDeskId(value.id);
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
                        label={officeObj.id === '' ? star('কার্যালয়ের নাম') : star('কার্যালয়ের নাম')}
                        variant="outlined"
                        size="small"
                      />
                    )}
                    value={officeObj}
                  />
                </Grid>
              ) : (
                ' '
              )}
              {cheque || cash ? (
                <Grid item lg={6} md={6} xs={12}>
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
                    options={
                      deskList.map((option) => ({
                        id: option.designationId,
                        label: option.nameBn + ',' + option.designation,
                      }))
                      // .filter((e) => e.id != null && e.label !== null)
                    }
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
                  {/* {(selectedDesk == "নির্বাচন করুন" || !selectedDesk) && (
                      <span style={{ color: "red" }}>{formErrors.selectedDesk}</span>
                   )} */}

                  {!deskId && <span style={{ color: 'red' }}>{formErrors.deskList}</span>}
                </Grid>
              ) : (
                ' '
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <Accordion expanded={expanded} onChange={handleChange(!expanded)}>
            <AccordionSummary
              className="accordion-head"
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span>ঋণ আদায়ের সময়সূচী</span>
            </AccordionSummary>

            <AccordionDetails sx={{ padding: ' .5rem 0 0' }}>
              <TableContainer className="table-container">
                <Table>
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell align="center">কিস্তি নাম্বার</TableCell>
                      <TableCell>কিস্তির তারিখ</TableCell>
                      <TableCell align="right">আদায় যোগ্য আসল (টাকা)</TableCell>
                      <TableCell align="right">আদায় যোগ্য সার্ভিস চার্জ (টাকা)</TableCell>
                      <TableCell align="right">সর্বমোট (টাকা)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loanDetails && loanDetails?.schedule
                      ? loanDetails.schedule.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell scope="row" align="center">
                            {engToBang(item.scheduleNo)}
                          </TableCell>
                          <TableCell scope="row">
                            {engToBang(new Date(item.installmentDate).toLocaleDateString('en-GB'))}
                          </TableCell>
                          <TableCell scope="row" align="right">
                            {engToBang(item.installmentPrincipalAmt?.toFixed(2))}
                          </TableCell>
                          <TableCell scope="row" align="right">
                            {engToBang(item.installmentServiceChargeAmt?.toFixed(2))}
                          </TableCell>
                          <TableCell scope="row" align="right">
                            {engToBang(item.total?.toFixed(2))}
                          </TableCell>
                        </TableRow>
                      ))
                      : ''}
                    <TableRow
                      sx={{
                        borderTop: '1px solid var(--color-primary)',
                        background: 'white',
                        '&:last-child td': {
                          border: 'none',
                          padding: '1rem .5rem .5rem',
                        },
                      }}
                    >
                      <TableCell scope="row" align="center">
                        সর্বমোট
                      </TableCell>
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row" align="right">
                        {totalInsAmount && engToBang(totalInsAmount?.toFixed(2))}
                      </TableCell>
                      <TableCell scope="row" align="right">
                        {totalServiceChargeAmount && engToBang(totalServiceChargeAmount?.toFixed(2))}
                      </TableCell>
                      <TableCell scope="row" align="right">
                        {totalPayableAmount && engToBang(totalPayableAmount?.toFixed(2))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
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
        </Grid>
      </Grid>
    </>
  );
};

export default LoanDisversment;
