import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
// import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { engToBang } from 'service/numberConverter';
import {
  codeMaster,
  loanProject,
  product,
  serviceChargeRoute
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
const frequency = [
  {
    value: 'W',
    label: 'সাপ্তাহিক ',
  },
  {
    value: 'M',
    label: 'মাসিক',
  },
  {
    value: 'Q',
    label: 'ত্রৈমাসিক',
  },
  {
    value: 'O',
    label: 'এককালীন',
  },
];
const gracePeriodArray = [
  {
    value: 'EQUAL',
    label: 'সার্ভিস চার্জ সমভাবে বন্টিত',
  },
  // {
  //   value: "NO-CHARGE",
  //   label: "সার্ভিস চার্জ প্রযোজ্য নয়",
  // },
];
const interestTypeArray = [
  {
    value: 'F',
    label: 'ফ্ল্যাট',
  },
  {
    value: 'D',
    label: 'ডিক্লাইন',
  },
  {
    value: 'DOC',
    label: 'কাস্টম',
  },
  {
    value: 'DOC-MILK',
    label: 'গাভী ঋণ-মেহেরপুর,যশোর',
  },
];
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// const transactionType = [
//   {
//     value: 'cash',
//     label: 'নগদ প্রদান',
//   },
//   {
//     value: 'cheque',
//     label: 'চেক',
//   },
// ];

const weekPosition = [
  {
    lebel: '১ম সপ্তাহ',
    value: '1',
  },
  {
    lebel: '২য় সপ্তাহ',
    value: '2',
  },
  {
    lebel: '৩য় সপ্তাহ',
    value: '3',
  },
  {
    lebel: '৪র্থ সপ্তাহ',
    value: '4',
  },
];

const LoanCalculator = () => {
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const officeId = getTokenData?.officeId;
  const config = localStorageData('config');

  const [disableProduct, setDisableProduct] = useState(false);
  const [allowGracePeriod, setAllowGracePeriod] = useState(false);
  const [formErrors] = useState({});
  const [ProjectName, setProjectName] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [productName, setProductName] = useState([]);
  const [productId, setProductId] = useState(null);
  const [day, setDay] = useState([]);
  const [loanDetails, setLoanDetails] = useState({
    loanAmount: '',
    frequency: '',
    time: '',
    purposeName: '',
    gracePeriod: '',
    gracePeriodType: '',
    installmentNoArray: [],
    installmentNo: '',
    disbursementDate: '',
    serviceChargeRate: '',
    interestType: '',
    officeId: '',
    doptorId: '',
    weekPosition: '',
    meetingDay: '',
    holidayEffect: '',
    roundingValue: '',
    roundingType: '',
    rate: '',
    loanPeriod: [],
  });

  const [principalBalance, setPrincipalBalance] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [totalInstallment, setTotalInstallment] = useState('');
  const [scheduleListData, setScheduleListData] = useState([]);
  // const [scheduleListObj, setScheduleListObj] = useState('');
  // const [bankName, setBankName] = useState([]);
  // const [bankId, setBankId] = useState(null);
  // const [branchName, setBranchName] = useState([]);
  // const [branchId, setBranchId] = useState(null);
  // const [accountDataList, setAccountDataList] = useState([]);
  // const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);
  // const [narration, setNarration] = useState('');
  // const [deskList, setDeskList] = useState([]);
  // const [chequeNumber, setChequeNumber] = useState([]);
  // const [deskId, setDeskId] = useState(null);
  // const [cashOrCheck, setCashOrCheck] = useState('');
  // const [chequeDate, setChequeDate] = useState(null);
  const [inputValue, setInputValue] = useState('M');
  const [loanDuration, setLoanDuration] = useState();
  const [loanDurationArray, setLoanDurationArray] = useState();
  console.log({ loanDurationArray });
  const [disableFromProduct] = useState(false);
  const [allowServiceCharge, setAllowServiceCharge] = useState('');

  useEffect(() => {
    getProject();
    // getDesk();
    // getBankType();
    getDay();
  }, []);

  const handleProject = (e) => {
    const { value } = e.target;
    setProjectId(value);
    getProduct(value);
    // getSamity(value);
  };

  const handleProduct = (e) => {
    let Office = officeId;

    let allProductData = productName;
    const { value } = e.target;
    setProductId(value);
    const singleProduct = allProductData.filter((allProductData) => allProductData.id == value);
    if (singleProduct && singleProduct.length > 0) {
      setLoanDetails({
        ...loanDetails,
        serviceChargeRate: singleProduct[0].intRate,
        loanPeriod: singleProduct[0].loanTerm,
        interestType: singleProduct[0].calType,
        installmentNoArray: singleProduct[0].numberOfInstallment,
        frequency: singleProduct[0].repFrq,
        gracePeriodType: singleProduct[0].graceAmtRepayIns,
        gracePeriod: singleProduct[0].gracePeriod,
        doptorId: singleProduct[0].doptorId,
        holidayEffect: singleProduct[0].holidayEffect,
        roundingType: singleProduct[0].installmentAmountMethod,
        roundingValue: singleProduct[0].installmentDivisionDigit,
        officeId: Office,
      });
      setAllowGracePeriod(singleProduct[0].allowGracePeriod);
      setAllowServiceCharge(singleProduct[0].serCrgAtGracePeriod);
      setLoanDurationArray(singleProduct[0].loanTerm);

    }
  };
  console.log("LOAN DETAILTS----", loanDetails);

  // const handleSamity = (e) => {
  //   const { name, value } = e.target;
  //   setSamityId(value);
  //   getMember(value);
  // };

  // const handleTransactionType = (e) => {
  //   const { name, value } = e.target;
  //   if (value == 'cash') {
  //     setCash(true);
  //     setCheque(false);
  //   } else if (value == 'cheque') {
  //     setCheque(true);
  //     setCash(false);
  //   }
  //   if (projectId != 'নির্বাচন করুন' && projectId) {
  //     getAccountNumber();
  //   }
  //   setCashOrCheck(value);
  // };

  // const handleMember = (e) => {
  //   const { name, value } = e.target;
  //   setMemberId(value);
  //   getMemberLoanDetails(value);
  // };
  // const handleDesk = (e) => {
  //   const { name, value } = e.target;
  //   setDeskId(value);
  // };

  // const handleBankName = (e) => {
  //   const { name, value } = e.target;
  //   setBankId(value);
  //   getBranchs(value);
  // };
  // const handleDateChangeEx = (e) => {
  //   setChequeDate(e);
  //   // const list = [...grantorInfo];
  //   // list[index]["birthDate"] = new Date(e);
  //   // setGrantorInfo(list);
  // };

  // const handleBranchName = (e) => {
  //   const { name, value } = e.target;
  //   setBranchId(value);
  //   // if (projectId && bankId) {
  //   //   getAccountNumber(projectId);
  //   // }
  // };

  // const handleAccountNumber = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedAccountNumber(value);
  // };

  // const handleDispription = (e) => {
  //   const { name, value } = e.target;
  //   setNarration(value);
  // };

  // const handleChequeNumber = (e) => {
  //   const { name, value } = e.target;
  //   setChequeNumber(value);
  // };

  // const totalInstallmentNumber = () => {
  //   if (loanDetails.frequency === "M") {
  //     const number = loanDetails.loanPeriod * 1;
  //     setLoanDetails({
  //       ...loanDetails,
  //       installmentNo: Math.floor(number),
  //     });
  //   } else {
  //     const number = (loanDetails.loanPeriod / 12) * 52;
  //     // setInitialInstallmentNumber(number);
  //     setLoanDetails({
  //       ...loanDetails,
  //       installmentNo: Math.floor(number),
  //     });
  //   }
  // };

  // const onSubmitData = async (e) => {
  //   // let result = checkMandatory();
  //   let result = true;
  //   let payload;
  //   let loanSchedule;
  //   payload = {
  //     ...(cheque && { projectId: parseInt(projectId) }),
  //     // projectId: parseInt(projectId),
  //     ...(cheque && { samityId: parseInt(samityId) }),
  //     // samityId: parseInt(samityId),
  //     data: {
  //       productId: parseInt(productId),
  //       customerId: parseInt(memberId),
  //       projectId: parseInt(projectId),
  //       samityId: parseInt(samityId),
  //       ...(cash && { transaction: { narration, type: cash ? "cash" : "" } }),
  //       ...(cheque && {
  //         transaction: {
  //           type: cheque ? "cheque" : "",
  //           bankId: parseInt(bankId),
  //           branchId: parseInt(branchId),
  //           accountNo: selectedAccountNumber,
  //           chequeNum: chequeNumber,
  //           chequeDate: chequeDate,
  //         },
  //       }),
  //     },
  //     ...(cheque && { nextAppDesignationId: parseInt(deskId) }),
  //     // nextAppDesignationId: parseInt(deskId),
  //   };
  //   ("Payload value is", payload);
  //   if (result) {
  //     // ("SSS");
  //     try {
  //       if (cash) {
  //         loanSchedule = await axios.post(schedules, payload, config);
  //       } else if (cheque) {
  //         loanSchedule = await axios.post(
  //           specificApplication + "loanSchedule",
  //           payload,
  //           config
  //         );
  //       }
  //       // getMemberByOffice(selectedOffice);

  //       NotificationManager.success(loanSchedule.data.message, "", 5000);
  //       setProjectId("নির্বাচন করুন");
  //       setProductId("নির্বাচন করুন");
  //       setSamityId("নির্বাচন করুন");
  //       setMemberId("নির্বাচন করুন");
  //       setDeskId("নির্বাচন করুন");
  //       setLoanDetails([]);
  //       setBankId("নির্বাচন করুন");
  //       setBranchId("নির্বাচন করুন");
  //       setSelectedAccountNumber("নির্বাচন করুন");
  //       setScheduleListData([]);
  //       setNarration("");
  //       setCashOrCheck("নির্বাচন করুন");
  //       setChequeNumber("");
  //       setChequeDate(null);
  //       setLoanDetails({
  //         loanPeriod: "",
  //         loanAmount: "",
  //         frequency: "",
  //         purposeName: "",
  //         serviceCharge: "",
  //         installmentAmount: "",
  //         installmentNo: "",
  //         serviceChargeRate: "",
  //       });
  //     } catch (error) {
  //       ("error found", error.message);
  //       if (error.response) {
  //         ("error found", error.response.data);
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

  // let checkMandatory = () => {
  //   let result = true;
  //   const formErrors = { ...formErrors };
  //   if (projectId == null || projectId == 'নির্বাচন করুন') {
  //     result = false;
  //     formErrors.ProjectName = 'প্রোজেক্ট নির্বাচন করুন';
  //   }
  //   if (productId == null || productId == 'নির্বাচন করুন') {
  //     result = false;
  //     formErrors.productName = 'প্রোডাক্ট নির্বাচন করুন';
  //   }
  //   setFormErrors(formErrors);
  //   return result;
  // };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      setProjectName(projectList);
    } catch (error) {
      'error found', error.message;
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

  const getProduct = async (proId) => {
    let Office = officeId;
    if (proId != 'নির্বাচন করুন') {
      try {
        const allProduct = await axios.get(
          product + '?projectId=' + proId + '&productType=A' + '&depositNature=L',
          config,
        );
        let productList = allProduct.data.data;
        if (productList.length == 1) {
          setProductId(productList[0].id);
          setLoanDetails({
            ...loanDetails,
            serviceChargeRate: productList[0].intRate,
            interestType: productList[0].calType,
            frequency: productList[0].repFrq,
            loanPeriod: productList[0].loanTerm,
            installmentNoArray: productList[0].numberOfInstallment,
            gracePeriodType: productList[0].graceAmtRepayIns,
            gracePeriod: productList[0].gracePeriod,
            doptorId: productList[0].doptorId,
            holidayEffect: productList[0].holidayEffect,
            officeId: Office,
            roundingType: productList[0].installmentAmountMethod,
            roundingValue: productList[0].installmentDivisionDigit,
          });
          setAllowGracePeriod(productList[0].allowGracePeriod);
          setAllowServiceCharge(productList[0].serCrgAtGracePeriod);
          setProductName(productList);
          setLoanDurationArray(productList[0].loanTerm);
          setDisableProduct(true);
          return;
        }
        setDisableProduct(false);
        setProductName(productList);
      } catch (error) {
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
  // const getMember = async (samityId) => {
  //   if (samityId != 'নির্বাচন করুন') {
  //     try {
  //       const member = await axios.get(appliedLoanMember + '?samityId=' + samityId, config);

  //       let memberData = member.data.data;

  //       setMember(memberData);
  //     } catch (error) {
  //       if (error.response) {
  //         'error found', error.response.data;
  //         let message = error.response.data.errors[0].message;
  //         NotificationManager.error(message, '', 5000);
  //       } else if (error.request) {
  //         NotificationManager.error('Error Connecting...', '', 5000);
  //       } else if (error) {
  //         NotificationManager.error(error.toString(), '', 5000);
  //       }
  //     }
  //   } else {
  //     // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
  //   }
  // };

  // const getMemberLoanDetails = async (customerId) => {
  //   if (customerId != 'নির্বাচন করুন') {
  //     try {
  //       const loanDetails = await axios.get(loanDetailsRoute + '?customerId=' + customerId, config);

  //       let memberLoanDetails = loanDetails.data.data ? loanDetails.data.data[0] : undefined;
  //       setLoanDetails(memberLoanDetails);
  //       if (memberLoanDetails) {
  //         getLoanSchedule(
  //           memberLoanDetails.loanAmount,
  //           memberLoanDetails.loanPeriod,
  //           memberLoanDetails.serviceChargeRate,
  //         );
  //       }
  //     } catch (error) {
  //       'error found', error.message;
  //       if (error.response) {
  //         'error found', error.response.data;
  //         let message = error.response.data.errors[0].message;
  //         NotificationManager.error(message, '', 5000);
  //       } else if (error.request) {
  //         NotificationManager.error('Error Connecting...', '', 5000);
  //       } else if (error) {
  //         NotificationManager.error(error.toString(), '', 5000);
  //       }
  //     }
  //   } else {
  //     // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
  //   }
  // };

  // const getDesk = async () => {
  //   try {
  //     let Data = await axios.get(employeeRecordByOffice, config);
  //     const deskData = Data.data.data;

  //     // if (deskData.length == 1) {
  //     //   setSelectedDesk(deskData[0].designationId);
  //     //   document.getElementById("deskId").setAttribute("disabled", "true");
  //     // }
  //     setDeskList(deskData);
  //   } catch (error) {
  //     if (error.response) {
  //       'Error Data', error.response;
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, '', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', '', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), '', 5000);
  //     }
  //   }
  // };
  const getDay = async () => {
    try {
      let Data = await axios.get(codeMaster + '?codeType=MET', config);
      const dayData = Data.data.data;
      setDay(dayData);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  // const getBankType = async () => {
  //   try {
  //     let Data = await axios.get(bankInfoRoute + '?type=bank', config);
  //     const bankType = Data.data.data;
  //     setBankName(bankType);
  //   } catch (error) {
  //     if (error.response) {
  //       'Error Data', error.response;
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, '', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', '', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), '', 5000);
  //     }
  //   }
  // };
  // const deb=useCallback(,[])
  // const getBranchs = async (bankId) => {
  //   try {
  //     let Data = await axios.get(bankInfoRoute + '?type=branch' + '&bankId=' + bankId, config);
  //     const branchList = Data.data.data;
  //     setBranchName(branchList);
  //   } catch (error) {
  //     if (error.response) {
  //       'Error Data', error.response;
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, '', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', '', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), '', 5000);
  //     }
  //   }
  // };
  // const getAccountNumber = async () => {
  //   try {
  //     let Data = await axios.get(bankInfoRoute + '?type=account' + '&projectId=' + projectId, config);
  //     const accountList = Data.data.data;
  //     setAccountDataList(accountList);
  //     setSelectedAccountNumber(accountList[0]['accountNo']);
  //     setBankId(accountList[0]['bankId']);

  //     await getBranchs(accountList[0]['bankId']);
  //     setBranchId(accountList[0]['branchId']);
  //   } catch (error) {
  //     if (error.response) {
  //       'Error Data', error.response;
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, '', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', '', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), '', 5000);
  //     }
  //   }
  // };

  const clearState = () => {
    setLoanDetails({
      loanPeriod: '',
      loanAmount: '',
      frequency: 'নির্বাচন করুন',
      purposeName: '',
      gracePeriod: '',
      gracePeriodType: 'নির্বাচন করুন',
      installmentNo: '',
      installmentNoArray: [],
      interestType: 'নির্বাচন করুন',
      serviceChargeRate: '',
    });
    setLoanDuration('নির্বাচন করুন');
    setLoanDurationArray([]);
    setProductId('নির্বাচন করুন');
    setProjectId('নির্বাচন করুন');
    setScheduleListData([]);
    setAllowGracePeriod(false);
    setPrincipalBalance('');
    setServiceCharge('');
    setTotalInstallment('');
  };

  const handleInputValue = (e) => {
    setInputValue(e.target.value);
    clearState();
  };
  const handleChange = (e) => {
    const { name, value, id } = e.target;
    setLoanDetails({
      ...loanDetails,
      [name]: value,
    });
    if (inputValue == 'P' && name == 'loanPeriod' && value != "নির্বাচন করুন") {
      setLoanDuration(value);
      const periodValueIndex = loanDetails.loanPeriod.findIndex((eachPeriodValue) => eachPeriodValue == value);
      if (periodValueIndex != -1)
        setLoanDetails({
          ...loanDetails,
          installmentNo: loanDetails.installmentNoArray[periodValueIndex],
          loanPeriod: value,
        });
      if (id == 'numField') {
        setLoanDetails({
          ...loanDetails,
          [name]: value.replace(/\D/g, ''),
        });
        return;
      }
    }
  };
  const generateSchedule = async () => {
    if (inputValue == 'P' && loanDetails.doptorId == '8') {
      try {
        const scheduleResp = await axios.get(
          serviceChargeRoute,
          {
            params: {
              principal: loanDetails.loanAmount,
              loanTerm: loanDuration,
              rate: loanDetails.serviceChargeRate,
              interestType: loanDetails.interestType,
              installmentNumber: loanDetails.installmentNo,
              officeId: loanDetails.officeId,
              doptorId: loanDetails.doptorId,
              holidayEffect: loanDetails.holidayEffect,
              weekPosition: loanDetails.weekPosition,
              meetingDay: loanDetails.meetingDay,
              roundingType: loanDetails.roundingType,
              roundingValue: loanDetails.roundingValue,
              ...(allowGracePeriod && {
                gracePeriod: loanDetails.gracePeriod,
              }),
              ...(allowServiceCharge && {
                gracePeriodType: loanDetails.gracePeriodType,
              }),
              ...(!allowServiceCharge && {
                gracePeriodType: 'NO-CHARGE',
              }),
              installmentType: loanDetails.frequency,
            },
          },
          config,
        );
        let scheduleRespData = scheduleResp.data.data;
        setScheduleListData(scheduleRespData.schedule);
        let principalBalance = 0;
        let serviceCharge = 0;
        let totalInstallmentNumber = 0;
        let length = scheduleRespData.schedule.length;
        let scheduleArray = scheduleRespData.schedule;
        for (let i = 0; i < length; i++) {
          principalBalance += scheduleArray[i].installmentPrincipalAmt
            ? Number(scheduleArray[i].installmentPrincipalAmt)
            : 0;
          serviceCharge += scheduleArray[i].installmentServiceChargeAmt
            ? Number(scheduleArray[i].installmentServiceChargeAmt)
            : 0;
          totalInstallmentNumber += scheduleArray[i].total ? Number(scheduleArray[i].total) : 0;
        }
        setTotalInstallment(totalInstallmentNumber);
        setServiceCharge(serviceCharge);
        setPrincipalBalance(principalBalance);
      } catch (error) {
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
    if (inputValue == 'P' && loanDetails.doptorId != '8') {
      try {
        const scheduleResp = await axios.get(
          serviceChargeRoute,
          {
            params: {
              principal: loanDetails.loanAmount,
              loanTerm: loanDuration,
              rate: loanDetails.serviceChargeRate,
              interestType: loanDetails.interestType,
              installmentNumber: loanDetails.installmentNo,
              officeId: loanDetails.officeId,
              doptorId: loanDetails.doptorId,
              holidayEffect: loanDetails.holidayEffect,
              weekPosition: loanDetails.weekPosition,
              meetingDay: loanDetails.meetingDay,
              roundingType: loanDetails.roundingType,
              roundingValue: loanDetails.roundingValue,
              ...(allowGracePeriod && {
                gracePeriod: loanDetails.gracePeriod,
              }),
              ...(allowServiceCharge && {
                gracePeriodType: loanDetails.gracePeriodType,
              }),
              ...(!allowServiceCharge && {
                gracePeriodType: 'NO-CHARGE',
              }),
              installmentType: loanDetails.frequency,
            },
          },
          config,
        );
        let scheduleRespData = scheduleResp.data.data;
        // setScheduleListObj(scheduleRespData);
        setScheduleListData(scheduleRespData.schedule);

        let principalBalance = 0;
        let serviceCharge = 0;
        let totalInstallmentNumber = 0;
        let length = scheduleRespData.schedule.length;
        let scheduleArray = scheduleRespData.schedule;
        for (let i = 0; i < length; i++) {
          principalBalance += scheduleArray[i].installmentPrincipalAmt
            ? Number(scheduleArray[i].installmentPrincipalAmt)
            : 0;
          serviceCharge += scheduleArray[i].installmentServiceChargeAmt
            ? Number(scheduleArray[i].installmentServiceChargeAmt)
            : 0;

          totalInstallmentNumber += scheduleArray[i].total ? Number(scheduleArray[i].total) : 0;
        }
        setTotalInstallment(totalInstallmentNumber);
        setServiceCharge(serviceCharge);
        setPrincipalBalance(principalBalance);
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
    if (inputValue != 'P') {
      try {
        const scheduleResp = await axios.get(
          serviceChargeRoute,
          {
            params: {
              principal: loanDetails.loanAmount,
              loanTerm: loanDetails.loanPeriod,
              rate: loanDetails.serviceChargeRate,
              interestType: loanDetails.interestType,
              installmentNumber: loanDetails.installmentNo,
              ...(allowGracePeriod && {
                gracePeriod: loanDetails.gracePeriod,
              }),
              ...(allowServiceCharge && {
                gracePeriodType: loanDetails.gracePeriodType,
              }),
              ...(!allowServiceCharge && {
                gracePeriodType: 'NO-CHARGE',
              }),
              installmentType: loanDetails.frequency,
            },
          },
          config,
        );
        let scheduleRespData = scheduleResp.data.data;
        // setScheduleListObj(scheduleRespData);
        setScheduleListData(scheduleRespData.schedule);

        let principalBalance = 0;
        let serviceCharge = 0;
        let totalInstallmentNumber = 0;
        let length = scheduleRespData.schedule.length;
        let scheduleArray = scheduleRespData.schedule;
        for (let i = 0; i < length; i++) {
          principalBalance += scheduleArray[i].installmentPrincipalAmt
            ? Number(scheduleArray[i].installmentPrincipalAmt)
            : 0;
          serviceCharge += scheduleArray[i].installmentServiceChargeAmt
            ? Number(scheduleArray[i].installmentServiceChargeAmt)
            : 0;

          totalInstallmentNumber += scheduleArray[i].total ? Number(scheduleArray[i].total) : 0;
        }
        setTotalInstallment(totalInstallmentNumber);
        setServiceCharge(serviceCharge);
        setPrincipalBalance(principalBalance);
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
  const handleSwitch = (e) => {
    setAllowGracePeriod(e.target.checked);
  };
  const handleSwitch2 = (e) => {
    setAllowServiceCharge(e.target.checked);
  };
  return (
    <>
      <Grid container>
        <Grid container className="section">
          <Grid item md={12} xs={12}>
            <FormControl component="isSme">
              <RadioGroup row aria-label="isSme" name="isSme" required value={inputValue} onChange={handleInputValue}>
                <FormLabel component="smeValue" style={{ padding: '6px 6px' }}></FormLabel>
                <FormControlLabel value={'M'} control={<Radio />} label="ম্যানুয়াল ইনপুট" />
                <FormControlLabel value={'P'} control={<Radio />} label="প্রোডাক্ট থেকে নির্বাচন" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {inputValue == 'P' && (
            <Grid container spacing={2.5}>
              <Grid item md={3} xs={6}>
                <TextField
                  fullWidth
                  label={star('প্রকল্পের নাম')}
                  name="projectName"
                  onChange={handleProject}
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
              <Grid item md={3} xs={6}>
                <TextField
                  fullWidth
                  label={star('প্রোডাক্টের নাম')}
                  // id="productId"
                  disabled={disableProduct}
                  name="productName"
                  onChange={handleProduct}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                  value={productId ? productId : ' '}
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {productName
                    ? productName.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.productName}
                      </option>
                    ))
                    : ''}
                </TextField>
                {!productId && <span style={{ color: 'red' }}>{formErrors.productName}</span>}
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid container className="section">
          <Grid item lg={12} md={12} xs={12}>
            <SubHeading>ঋণ সংক্রান্ত তথ্য</SubHeading>
            {loanDetails.doptorId == '8' ? (
              <Grid container spacing={2.5}>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="ঋণের পরিমাণ (টাকা)"
                    name="loanAmount"
                    id="numField"
                    variant="outlined"
                    size="small"
                    value={typeof loanDetails != 'undefined' ? loanDetails.loanAmount : ' '}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  {inputValue == 'M' && (
                    <TextField
                      fullWidth
                      label="ঋণের মেয়াদ (মাস)"
                      name="loanPeriod"
                      id="numField"
                      variant="outlined"
                      size="small"
                      value={typeof loanDetails != 'undefined' ? loanDetails.loanPeriod : ''}
                      onChange={handleChange}
                    // onBlur={totalInstallmentNumber}
                    />
                  )}

                  {inputValue == 'P' && (
                    <TextField
                      fullWidth
                      label={star('ঋণের মেয়াদ (মাস)')}
                      name="loanPeriod"
                      id="numField"
                      onChange={handleChange}
                      value={loanDuration ? loanDuration : ''}
                      // onBlur={totalInstallmentNumber}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      size="small"
                    >
                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                      {loanDurationArray
                        ? loanDurationArray.map((option) => (
                          <option key={option} value={option}>
                            {`${engToBang(option)} মাস`}
                          </option>
                        ))
                        : ''}
                    </TextField>
                  )}
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label={star('কিস্তি আদায়ের ধরণ')}
                    diabled={disableFromProduct}
                    name="frequency"
                    id="dropdown"
                    onChange={handleChange}
                    value={loanDetails.frequency ? loanDetails.frequency : ' '}
                    // onBlur={totalInstallmentNumber}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {frequency
                      ? frequency.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))
                      : ''}
                  </TextField>
                </Grid>

                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="কিস্তির সংখ্যা"
                    diabled={disableFromProduct}
                    name="installmentNo"
                    variant="outlined"
                    id="numField"
                    size="small"
                    value={typeof loanDetails != 'undefined' ? loanDetails.installmentNo : ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    diabled={disableFromProduct}
                    label="সার্ভিস চার্জের হার (%)"
                    name="serviceChargeRate"
                    variant="outlined"
                    id="numField"
                    size="small"
                    value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.serviceChargeRate) : ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label={star('সার্ভিস চার্জের ধরন')}
                    name="interestType"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                    value={loanDetails.interestType}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {interestTypeArray.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                {
                  loanDetails.frequency == "O" || loanDetails.frequency == "Q" ? <></> : <>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label={star('সপ্তাহের ধরণ')}
                        name="weekPosition"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined"
                        size="small"
                      // value={loanDetails.interestType}
                      >
                        <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                        {weekPosition.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.lebel}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label={star('মিটিং এর দিন')}
                        name="meetingDay"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined"
                        size="small"
                        value={loanDetails.meetingDay ? loanDetails.meetingDay : ' '}
                      >
                        <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                        {day.map((option) => (
                          <option key={option.id} value={option.returnValue}>
                            {option.displayValue}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </>
                }

                <Grid item md={3} xs={12} justifyItems="center">
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#000',
                      textShadow: '1px 1px #FFF',
                      fontWeight: 'bold',
                    }}
                  >
                    গ্রেস পিরিয়ড প্রযোজ্য
                    <Switch sx={{}} onChange={handleSwitch} checked={allowGracePeriod} />
                  </Typography>
                </Grid>
                {allowGracePeriod && (
                  <>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label={star('গ্রেস পিরিয়ড')}
                        name="gracePeriod"
                        id="numField"
                        variant="outlined"
                        size="small"
                        value={typeof loanDetails != 'undefined' ? loanDetails.gracePeriod : ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={3} xs={12} justifyItems="center">
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#000',
                          textShadow: '1px 1px #FFF',
                          fontWeight: 'bold',
                        }}
                      >
                        সার্ভিস চার্জ প্রযোজ্য
                        <Switch sx={{}} onChange={handleSwitch2} checked={allowServiceCharge} />
                      </Typography>
                    </Grid>
                  </>
                )}
                {allowServiceCharge && (
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      label="গ্রেস পিরিয়ডে সার্ভিস চার্জ"
                      name="gracePeriodType"
                      id="dropdown"
                      onChange={handleChange}
                      value={loanDetails.gracePeriodType}
                      //  onBlur={totalInstallmentNumber}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      size="small"
                    >
                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                      {gracePeriodArray
                        ? gracePeriodArray.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                        : ''}
                    </TextField>
                  </Grid>
                )}

                <Grid item md={3} xs={12}>
                  <Tooltip title="ঋণ সিদিউল তৈরি করুন">
                    <Button variant="contained" className="btn btn-primary" onClick={generateSchedule}>
                      ঋণ আদায়ের সময়সূচী
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2.5}>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="ঋণের পরিমাণ (টাকা)"
                    name="loanAmount"
                    id="numField"
                    variant="outlined"
                    size="small"
                    value={typeof loanDetails != 'undefined' ? loanDetails.loanAmount : ' '}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  {inputValue == 'M' && (
                    <TextField
                      fullWidth
                      label="ঋণের মেয়াদ(মাস)"
                      name="loanPeriod"
                      id="numField"
                      variant="outlined"
                      size="small"
                      value={typeof loanDetails != 'undefined' ? loanDetails.loanPeriod : ''}
                      onChange={handleChange}
                    // onBlur={totalInstallmentNumber}
                    />
                  )}
                  {inputValue == 'P' && (
                    <TextField
                      fullWidth
                      label={star('ঋণের মেয়াদ (মাস)')}
                      name="loanPeriod"
                      // id="numField"
                      onChange={handleChange}
                      value={loanDuration ? loanDuration : ' '}
                      // onBlur={totalInstallmentNumber}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      size="small"
                    >
                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                      {loanDurationArray
                        ? loanDurationArray.map((option) => (
                          <option key={option} value={option}>
                            {`${engToBang(option)} মাস`}
                          </option>
                        ))
                        : ''}
                    </TextField>
                  )}
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label={star('কিস্তি আদায়')}
                    diabled={disableFromProduct}
                    name="frequency"
                    id="dropdown"
                    onChange={handleChange}
                    value={loanDetails.frequency ? loanDetails.frequency : ' '}
                    // onBlur={totalInstallmentNumber}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {frequency
                      ? frequency.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))
                      : ''}
                  </TextField>
                </Grid>

                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="কিস্তির সংখ্যা"
                    diabled={disableFromProduct}
                    name="installmentNo"
                    variant="outlined"
                    id="numField"
                    size="small"
                    value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.installmentNo) : ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    diabled={disableFromProduct}
                    label="সার্ভিস চার্জের হার"
                    name="serviceChargeRate"
                    variant="outlined"
                    id="numField"
                    size="small"
                    value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.serviceChargeRate) : ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label={star('সার্ভিস চার্জের ধরন')}
                    name="interestType"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    size="small"
                    value={loanDetails.interestType ? loanDetails.interestType : ' '}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {interestTypeArray.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  {/* {!loanDetails.interestType && (
            <span style={{ color: "red" }}>{formErrors.ProjecinterestTypetName}</span>
            )} */}
                </Grid>
                <Grid item md={3} xs={12} justifyItems="center">
                  <Typography>
                    গ্রেস পিরিয়ড প্রযোজ্য
                    <Switch sx={{}} onChange={handleSwitch} checked={allowGracePeriod} />
                  </Typography>
                </Grid>
                {allowGracePeriod && (
                  <>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label={star('গ্রেস পিরিয়ড')}
                        name="gracePeriod"
                        id="numField"
                        variant="outlined"
                        size="small"
                        value={typeof loanDetails != 'undefined' ? engToBang(loanDetails.gracePeriod) : ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={3} xs={12} justifyItems="center">
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#000',
                          textShadow: '1px 1px #FFF',
                          fontWeight: 'bold',
                        }}
                      >
                        সার্ভিস চার্জ প্রযোজ্য
                        <Switch sx={{}} onChange={handleSwitch2} checked={allowServiceCharge} />
                      </Typography>
                    </Grid>
                  </>
                )}
                {allowServiceCharge && (
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      label="গ্রেস পিরিয়ডে সার্ভিস চার্জ"
                      name="gracePeriodType"
                      id="dropdown"
                      onChange={handleChange}
                      value={loanDetails.gracePeriodType}
                      //  onBlur={totalInstallmentNumber}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      size="small"
                    >
                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                      {gracePeriodArray
                        ? gracePeriodArray.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                        : ''}
                    </TextField>
                  </Grid>
                )}

                <Grid item md={3} xs={12}>
                  <Tooltip title="ঋণ সিদিউল তৈরি করুন">
                    <Button variant="contained" className="btn btn-primary" onClick={generateSchedule}>
                      ঋণ আদায়ের সময়সূচী
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid container className="section">
          <SubHeading>ঋণ আদায়ের সময়সূচী</SubHeading>
          <TableContainer className="table-container">
            <Table aria-label="customized table" size="small">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center" sx={{ width: '8%' }}>
                    কিস্তি নাম্বার
                  </TableCell>
                  <TableCell>কিস্তির তারিখ</TableCell>
                  <TableCell align="right">আসল (টাকা)</TableCell>
                  <TableCell align="right">সার্ভিস চার্জ (টাকা)</TableCell>
                  <TableCell align="right">কিস্তির পরিমাণ (টাকা)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleListData && scheduleListData.length >= 1
                  ? scheduleListData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell scope="row" align="center">
                        {item.scheduleNo}
                      </TableCell>
                      <TableCell scope="row">{new Date(item.installmentDate).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell scope="row" align="right">
                        {item.installmentPrincipalAmt.toFixed(2)}
                      </TableCell>
                      <TableCell scope="row" align="right">
                        {item.installmentServiceChargeAmt?.toFixed(2)}
                      </TableCell>
                      <TableCell scope="row" align="right">
                        {item.total?.toFixed(2)}
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
                  <TableCell scope="row">সর্বমোট</TableCell>
                  <TableCell scope="row"></TableCell>
                  <TableCell scope="row" align="right">
                    {principalBalance}
                  </TableCell>
                  <TableCell scope="row" align="right">
                    {serviceCharge}
                  </TableCell>
                  <TableCell scope="row" align="right">
                    {totalInstallment}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default LoanCalculator;
