/* eslint-disable no-misleading-character-class */

/* eslint-disable react/jsx-no-undef */
import BrushIcon from '@mui/icons-material/Brush';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Paper, TextField, Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import {
  glListRoute,
  loanProject,
  prodcutDataUpdate,
  productSave,
  specificApplication,
} from '../../../../../url/ApiList';
import { bangToEng, engToBang, myValidate } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';

import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
// const loanTermArray = [
//   {
//     value: "12",
//     label: "বার মাস",
//   },
//   {
//     value: "18",
//     label: "আঠারো মাস",
//   },
//   {
//     value: "24",
//     label: "চব্বিশ মাস",
//   },
//   {
//     value: "24",
//     label: "চব্বিশ মাস",
//   },
//   {
//     value: "24",
//     label: "চব্বিশ মাস",
//   },
// ];
const holidayEffectArray = [
  {
    value: 'NWD',
    label: 'পরবর্তী কার্যদিবস',
  },
  {
    value: 'NMD',
    label: 'পরবর্তী মিটিং এর দিন',
  },
  {
    value: 'NO',
    label: 'প্রযোজ্য নয়',
  },
];
const ProductMaster = ({ appId, provideId, provideProName, handleChange2 }) => {
  // const router = useRouter();
  const compoName = localStorageData('componentName');
  // const [tableData] = useState([]);
  // const [dataForEdit, setDataForEdit] = useState(null);
  // const [targetId, setTargetId] = useState(null);
  // const [labelCheck, setLabelCheck] = useState(false);
  const [graceToggle, setGraceToggle] = React.useState(false);
  const [graceServiceChargeToggle, setGraceServiceChargeToggle] = React.useState(false);
  const [insuranceToggle, setInsuranceToggle] = useState(false);
  const [chequeDisbursementFlag, setChequeDisbursementFlag] = useState(false);
  const [isAdvBenfitFlag, setIsAdvBenfitFlag] = useState(false);
  const [isMultipleLoanAllow, setIsMultipleLoanAllow] = useState(false);
  const [isMultipleDisbursementAllowed, setIsMultipleDisbursementAllowed] = useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const handleDateChangeEx = (e) => {
    setStartDate(new Date(e));
  };
  const [productMaster, setProductMaster] = useState({
    projectName: '',
    productCode: '',
    productName: '',
    productStartDate: '',
    lowestLoanAmount: '',
    highestLoanAmount: '',
    repaymentRequency: '',
    calculationMethod: '',
    productGl: '',
    graceToggle: '',
    gracePeriod: '',
    gPServChargeAllowed: '',
    gPServChargeDir: '',
    serviceChargeGl: '',
    capitalGl: '',
    insuranceAllowed: '',
    insuranceGl: '',
    insuPerRate: '',
    sequentialOrderCapital: '',
    sequentialOrderSerCharge: '',
    sequentialOrderDelayCharge: '',
    numberOfInstallment: '',
    activeChequeDisbursement: '',
    loanTerm: '',
    allowPercent: '',
  });
  const [formError, setFormError] = useState({
    minLoanAmount: '',
    maxLoanAmount: '',
    productCodeError: '',
    productNameError: '',
    gracePeriodError: '',
    insuPerRateError: '',
  });

  // const editDataInd = (id) => {
  //   let target = [...tableData];
  //   let filterTarget = target.filter((v, i) => id === i);
  //   setDataForEdit(filterTarget);
  //   setTargetId(id);
  // };

  const [projectsName, setProjectsName] = useState([]);
  const [glAssetList, setGlAssetList] = useState([]);
  const [glIncomeList, setGlIncomeList] = useState([]);

  const [earningVal] = useState([
    { value: '1', label: 'প্রথম' },
    { value: '2', label: 'দ্বিতীয়' },
    { value: '3', label: 'তৃতীয়' },
  ]);

  // const [valuePod] = useState({
  //   1: { status: 'NOT_TAKEN', id: null },
  //   2: { status: 'NOT_TAKEN', id: null },
  //   3: { status: 'NOT_TAKEN', id: null },
  // });
  useEffect(() => {
    getProject();
    // getProjectInfo()
    getGlAssetList();
    getGlIncomeList();
  }, []);
  // let getProjectInfo = async (e) => {
  //   try {
  //     let projectInfos = await axios.get(loanProject, config);
  //     ("project infos----",projectInfos.data.data);
  //     //  const projectArray=projectInfos?.data?.data
  //     //  if(projectArray.length>=1){

  //     // const projectCode=(Number(projectArray[projectArray.length-1].projectCode)+1).toString().padStart(2, '0');

  //     // setProjectInfo({
  //     //   ...projectInfo,
  //     //   projectCode,
  //     // })

  //   } catch (error) {
  //     if (error.response) {
  //     } else if (error.request) {
  //       NotificationManager.error("Error Connecting...");
  //     } else if (error) {
  //       NotificationManager.error(error.toString());
  //     }
  //   }
  // };
  const getProject = async () => {
    let projects = await getApi(loanProject, 'get');
    setProjectsName(projects?.data?.data ? projects?.data?.data : []);
  };

  const getGlAssetList = async () => {
    let getAssetList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=A', 'get');
    setGlAssetList(getAssetList?.data?.data ? getAssetList?.data?.data : []);
  };

  const getGlIncomeList = async () => {
    let getIncomeList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
    setGlIncomeList(getIncomeList?.data?.data ? getIncomeList?.data?.data : []);
  };
  // ("product master info---",productMaster);

  useEffect(() => {
    getProductMasterInfo();
  }, [appId]);
  const getProductMasterInfo = async () => {
    if (appId) {
      try {
        let productMasterInfo = await getApi(specificApplication + appId, 'get');
        const productMaster = productMasterInfo.data.data.productMaster;
        setProductMaster({
          projectName: productMaster?.projectName,
          productCode: productMaster?.productCode,
          productName: productMaster?.productName,
          productStartDate: productMaster?.productStartDate,
          lowestLoanAmount: engToBang(productMaster?.lowestLoanAmount),
          highestLoanAmount: engToBang(productMaster?.highestLoanAmount),
          repaymentRequency: productMaster?.repaymentRequency,
          calculationMethod: productMaster?.calculationMethod,
          productGl: productMaster?.productGl,
          gracePeriod: engToBang(productMaster?.gracePeriod),
          gPServChargeDir: productMaster?.gPServChargeDir,
          serviceChargeGl: productMaster?.serviceChargeGl,
          capitalGl: productMaster?.capitalGl,
          insuranceGl: productMaster?.insuranceGl,
          insuPerRate: engToBang(productMaster?.insuPerRate),
          sequentialOrderCapital: productMaster?.sequentialOrderCapital,
          sequentialOrderSerCharge: productMaster?.sequentialOrderSerCharge,
          sequentialOrderDelayCharge: productMaster?.sequentialOrderDelayCharge,
          numberOfInstallment: engToBang(productMaster?.numberOfInstallment),
          holidayEffect: productMaster?.holidayEffect,
          loanTerm: engToBang(productMaster?.loanTerm),
          allowPercent: engToBang(productMaster?.allowPercent),
        });
        setGraceToggle(productMaster?.gracePeriodAllowed);
        setInsuranceToggle(productMaster?.insuranceAllowed);
        setGraceServiceChargeToggle(productMaster?.gPServChargeAllowed);
        setChequeDisbursementFlag(productMaster?.chequeDisbursementFlag);
        setIsAdvBenfitFlag(productMaster.isAdvPayBenefit);
        setIsMultipleLoanAllow(productMaster?.isMultipleLoanAllow);
      } catch (error) {
        errorHandler(error)
      }
    }
  };

  let regexResultFunc = (regex, value) => {
    return regex.test(value);
  };

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    let resultObj;
    if (name == 'loanTerm') {
      resultObj = myValidate('loanTerm', value);
      if (resultObj?.status) {
        return;
      }

      setProductMaster({
        ...productMaster,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }
    if (name == 'numberOfInstallment') {
      resultObj = myValidate('loanTerm', value);
      if (resultObj?.status) {
        return;
      }

      setProductMaster({
        ...productMaster,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;
    }
    if (id == 'numberWithPercent') {
      if (value.length == 1 && value == 0) return;
      resultObj = myValidate('percentage', value);
      if (resultObj?.status) {
        return;
      }
      setProductMaster({
        ...productMaster,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });
      return;

      // if (name == "insuPerRate" && value.length > 3) {
      //   setProductMaster({
      //     ...productMaster,
      //     [name]: value.substring(0, 3),
      //   })
      //   setFormError({
      //     ...formError,
      //     insuPerRateError: "শতকরা হার ১০০ ও ৩ সংখ্যার বেশি হতে পারবে না"
      //   })
      //   return;
      // }

      // if (name == "insuPerRate" && Number(value) > 100) {
      //   setFormError({
      //     ...formError,
      //     insuPerRateError: "শতকরা হার ১০০ ও ৩ সংখ্যার বেশি হতে পারবে না"
      //   })
      //   return;
      // }

      // if (name == "insuPerRate" && Number(value) > 100) {
      //   setFormError({
      //     ...formError,
      //     insuPerRateError: "শতকরা হার ১০০ ও ৩ সংখ্যার বেশি হতে পারবে না"
      //   })
      //   return;
      // }

      // setProductMaster({
      //   ...productMaster,
      //   [name]: value.replace(/\D/gi, ""),
      // });
      // setFormError({
      //   ...formError,
      //   insuPerRateError: "",
      // });
      // return;
    }

    if (id == 'numberWithCharacter') {
      if (value.length == 1 && value == 0) return;
      switch (name) {
        case 'productCode':
          if (value.length > 3) {
            return;
          } else {
            setTimeout(() => {
              setFormError({
                ...formError,
                productCodeError: '',
              });
            }, 1);
          }
          setProductMaster({
            ...productMaster,
            [name]: value,
          });
          return;
      }
    }
    //     case "productName":

    //       if (value.length > 100) {
    //         setTimeout(() => {
    //           setProductMaster({
    //             ...productMaster,
    //             productName:
    //               value.substring(0, 100),
    //           });
    //           setFormError({
    //             ...formError,
    //             productNameError: "প্রোডাক্ট নাম ১০০ অক্ষরের বেশি হতে পারবে না"
    //           })
    //         }, 1);
    //         return;
    //       }
    //       else {
    //         setTimeout(() => {
    //           setFormError({
    //             ...formError,
    //             productNameError: "",
    //           });
    //         }, 1);
    //       }
    //       break;
    //       if (value.length == 1 && value == 0)
    //         return;
    //       if (value.length > 2) {
    //         setTimeout(() => {
    //           setProductMaster({
    //             ...productMaster,
    //             gracePeriod:
    //               value.substring(0, 2),
    //           });
    //           setFormError({
    //             ...formError,
    //             gracePeriodError: "গ্রেস পিরিয়ড ২ সংখ্যার বেশি হতে পারবে না"
    //           })
    //         }, 1);
    //         return;
    //       }
    //       else {
    //         setTimeout(() => {
    //           setFormError({
    //             ...formError,
    //             gracePeriodError: "",
    //           });
    //         }, 1);
    //       }
    //       break;
    //   }
    //   return
    // }
    // setProductMaster({
    //   ...productMaster,
    //   [name]: value,
    // });
    if (id == 'productName') {
      if (regexResultFunc(/[A-Za-z]/gi, value)) {
        setProductMaster({
          ...productMaster,
          [e.target.name]: e.target.value.replace(/[^A-Za-z\s-]/gi, ''),
        });
        return;
      } else {
        setProductMaster({
          ...productMaster,
          [e.target.name]: e.target.value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
            '',
          ),
        });
        return;
      }
    }
    if (id == 'number') {
      if (value.length == 1 && value == 0) return;

      resultObj = myValidate('number', value);
      if (resultObj?.status) {
        return;
      }

      setProductMaster({
        ...productMaster,
        [name]: resultObj?.value,
      });
      setFormError({
        ...productMaster,
        [name]: resultObj?.error,
      });
      return;
      // if (value.length > 2) {
      //   setTimeout(() => {
      //     setProductMaster({
      //       ...productMaster,
      //       gracePeriod:
      //         value.slice(0, -1),
      //     });
      //     setFormError({
      //       ...formError,
      //       gracePeriodError: "গ্রেস পিরিয়ড ২ সংখ্যার বেশি হতে পারবে না"
      //     })
      //   }, 1);
      //   return;
      // }
      // else {
      //   setTimeout(() => {
      //     setFormError({
      //       ...formError,
      //       gracePeriodError: "",
      //     });
      //   }, 1);
      // }
    }
    if (id == 'chargeNumber') {
      if (value.length == 1 && value == 0) return;
      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }
      setProductMaster({
        ...productMaster,
        [name]: resultObj?.value,
      });
      setFormError({
        ...formError,
        [name]: resultObj?.error,
      });

      switch (name) {
        case 'highestLoanAmount':
          if (
            productMaster.lowestLoanAmount &&
            Number(bangToEng(productMaster.lowestLoanAmount)) > Number(bangToEng(value))
          ) {
            setTimeout(() => {
              setFormError({
                ...formError,
                maxLoanAmount: 'ঋণের সর্বোচ্চ পরিমাণ ঋণের সর্বনিম্ন পরিমাণ অপেক্ষা ছোট হতে পারবে না',
              });
            }, 1);
          } else if (
            productMaster.lowestLoanAmount &&
            Number(bangToEng(productMaster.lowestLoanAmount)) < Number(bangToEng(value))
          ) {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLoanAmount: '',
                maxLoanAmount: '',
              });
            }, 1);
          } else {
            setTimeout(() => {
              setFormError({
                ...formError,
                maxLoanAmount: '',
              });
            }, 1);
          }
          return;
        case 'lowestLoanAmount':
          if (
            productMaster.highestLoanAmount &&
            Number(bangToEng(productMaster.highestLoanAmount)) < Number(bangToEng(value))
          ) {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLoanAmount: 'ঋণের সর্বনিম্ন পরিমাণ ঋণের সদস্য সর্বোচ্চ পরিমাণ অপেক্ষা বড় হতে পারবে না',
              });
            }, 1);
          } else if (
            productMaster.highestLoanAmount &&
            Number(bangToEng(productMaster.highestLoanAmount)) > Number(bangToEng(value))
          ) {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLoanAmount: '',
                maxLoanAmount: '',
              });
            }, 1);
          } else {
            setTimeout(() => {
              setFormError({
                ...formError,
                minLoanAmount: '',
              });
            }, 1);
          }
          return;
      }
    }

    setProductMaster({
      ...productMaster,
      [name]: value,
    });
  };

  const eraningHandleChange = (e) => {
    setProductMaster({
      ...productMaster,
      [e.target.name]: e.target.value,
    });
  };

  // const filteredValue = (option, idx, ownId) => {
  //   if (valuePod[option.value].id === ownId)
  //     return (
  //       <option key={idx} value={option.value}>
  //         {option.label}
  //       </option>
  //     );
  //   else if (valuePod[option.value].status === 'NOT_TAKEN')
  //     return (
  //       <option key={idx} value={option.value}>
  //         {option.label}
  //       </option>
  //     );
  //   else return '';
  // };

  const {
    projectName,
    productCode,
    productName,
    // productStartDate,
    lowestLoanAmount,
    highestLoanAmount,
    repaymentRequency,
    calculationMethod,
    productGl,
    gracePeriod,
    gPServChargeDir,
    serviceChargeGl,
    capitalGl,
    // insuranceAllowed,
    insuranceGl,
    insuPerRate,
    sequentialOrderCapital,
    sequentialOrderSerCharge,
    sequentialOrderDelayCharge,
    numberOfInstallment,
    loanTerm,
    holidayEffect,
    allowPercent,
  } = productMaster;

  const saveData = async () => {
    let loanTermCopy = loanTerm;
    let numberofInstallmentCopy = numberOfInstallment;
    let loanTermCopyArray = [];
    let numberofInstallmentCopyArray = [];
    if (loanTermCopy.includes(',')) {
      loanTermCopyArray = loanTermCopy.split(',');
      let newLoanTermCopyArray = loanTermCopyArray.map((elem) => bangToEng(elem));
      loanTermCopyArray = newLoanTermCopyArray;
    } else if (loanTermCopy) {
      loanTermCopyArray[0] = bangToEng(loanTermCopy);
    }
    if (numberofInstallmentCopy.includes(',')) {
      numberofInstallmentCopyArray = numberofInstallmentCopy.split(',');
      let newNumberofInstallmentCopyArray = numberofInstallmentCopyArray.map((elem) => bangToEng(elem));
      numberofInstallmentCopyArray = newNumberofInstallmentCopyArray;
    } else if (numberOfInstallment) {
      numberofInstallmentCopyArray[0] = bangToEng(numberOfInstallment);
    }
    let payload = {
      projectId: projectName,
      samityId: null,
      data: {
        productMaster: {
          projectName,
          productCode,
          productName,
          productStartDate: startDate ? startDate : new Date(),
          lowestLoanAmount: bangToEng(lowestLoanAmount),
          highestLoanAmount: bangToEng(highestLoanAmount),
          repaymentRequency,
          calculationMethod,
          insuranceAllowed: insuranceToggle ? true : false,
          ...(insuranceToggle && {
            insuPerRate: Number(bangToEng(insuPerRate)),
          }),
          ...(insuranceToggle && { insuranceGl: Number(insuranceGl) }),
          productGl: productGl ? productGl : null,
          gracePeriodAllowed: graceToggle ? true : false,
          ...(graceToggle && { gracePeriod: Number(bangToEng(gracePeriod)) }),
          gPServChargeAllowed: graceServiceChargeToggle ? true : false,
          gPServChargeDir: gPServChargeDir ? gPServChargeDir : null,
          serviceChargeGl: serviceChargeGl ? serviceChargeGl : null,
          capitalGl: capitalGl ? capitalGl : null,
          sequentialOrderCapital,
          sequentialOrderSerCharge,
          sequentialOrderDelayCharge,
          numberOfInstallment: numberofInstallmentCopyArray,
          holidayEffect,
          chequeDisbursementFlag: chequeDisbursementFlag ? chequeDisbursementFlag : false,
          loanTerm: loanTermCopyArray,
          isAdvPayBenefit: isAdvBenfitFlag ? isAdvBenfitFlag : false,
          isMultipleLoanAllow: isMultipleLoanAllow ? isMultipleLoanAllow : false,
          ...(isMultipleLoanAllow && {
            allowPercent: bangToEng(allowPercent),
          }),
          isMultipleDisbursementAllow: isMultipleDisbursementAllowed,
        },
      },
    };
    try {
      let res;
      if (appId) {
        res = await getApi(prodcutDataUpdate + 'product/' + appId, 'put', payload);
      } else {
        res = await getApi(productSave + '/' + compoName, 'post', payload);
      }
      if (res?.data?.data) {
        provideProName(productName, projectName);
        let message = res.data.message;
        NotificationManager.success(message);
        provideId(res.data.data.id ? res.data.data.id : '');
        handleChange2('2');
      }
      //router.push({ pathname: "/" });
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...');
      } else if (error) {
        NotificationManager.error(error.toString());
      }
    }
  };

  const pageRefresh = () => {
    setProductMaster({
      projectName: '- নির্বাচন করুন -',
      productCode: '',
      productName: '',
      productStartDate: '',
      lowestLoanAmount: '',
      highestLoanAmount: '',
      repaymentRequency: '- নির্বাচন করুন -',
      calculationMethod: '- নির্বাচন করুন -',
      productGl: '- নির্বাচন করুন -',
      graceToggle: '',
      gracePeriod: '',
      gPServChargeAllowed: '',
      gPServChargeDir: '',
      serviceChargeGl: '- নির্বাচন করুন -',
      capitalGl: '- নির্বাচন করুন -',
      insuranceAllowed: '',
      insuranceGl: '- নির্বাচন করুন -',
      insuPerRate: '',
      sequentialOrderCapital: '- নির্বাচন করুন -',
      sequentialOrderSerCharge: '- নির্বাচন করুন -',
      sequentialOrderDelayCharge: '- নির্বাচন করুন -',
    });
  };

  // const onNextPage = () => {
  //   router.push({ pathname: '/samity-management/coop/add-by-laws' });
  // };

  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  return (
    <>
      <Paper
        sx={{
          p: '20px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          mb: '20px',
        }}
      >
        <Grid container spacing={2.5} className="section">
          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('প্রকল্প/কর্মসূচীর নাম')}
              name="projectName"
              select
              SelectProps={{ native: true }}
              value={projectName ? projectName : ' '}
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

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রোডাক্ট কোড')}
              name="productCode"
              onChange={handleChange}
              id="numberWithCharacter"
              value={productCode}
              variant="outlined"
              size="small"
            ></TextField>
            {!productMaster.productCode ? (
              <span style={{ color: '#FFCC00' }}>{formError.productCodeError}</span>
            ) : productMaster.productCode.length > 0 ? (
              <span style={{ color: '#FFCC00' }}>{formError.productCodeError}</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রোডাক্টের নাম')}
              id="productName"
              name="productName"
              onChange={handleChange}
              //id="numberWithCharacter"
              value={productName}
              variant="outlined"
              size="small"
            ></TextField>
            {!productMaster.productName ? (
              <span style={{ color: '#FFCC00' }}>{formError.productNameError}</span>
            ) : productMaster.productName.length > 0 ? (
              <span style={{ color: '#FFCC00' }}>{formError.productNameError}</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={star('শুরুর তারিখ')}
                name="startDate"
                value={startDate}
                disableFuture="true"
                onChange={(e) => handleDateChangeEx(e)}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('সর্বনিম্ন ঋণের পরিমান')}
              name="lowestLoanAmount"
              onChange={handleChange}
              id="chargeNumber"
              value={lowestLoanAmount}
              variant="outlined"
              size="small"
            ></TextField>
            {!productMaster.lowestLoanAmount ? (
              <span style={{ color: '#FFCC00' }}>{formError.minLoanAmount}</span>
            ) : productMaster.lowestLoanAmount.length > 0 ? (
              <span style={{ color: '#FFCC00' }}>{formError.minLoanAmount}</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('সর্বোচ্চ ঋণের পরিমান')}
              name="highestLoanAmount"
              onChange={handleChange}
              id="chargeNumber"
              value={highestLoanAmount}
              variant="outlined"
              size="small"
            ></TextField>
            {!productMaster.highestLoanAmount ? (
              <span style={{ color: '#FFCC00' }}>{formError.maxLoanAmount}</span>
            ) : productMaster.highestLoanAmount.length > 0 ? (
              <span style={{ color: '#FFCC00' }}>{formError.maxLoanAmount}</span>
            ) : (
              ''
            )}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="number"
              label={star('ঋণের মেয়াদ')}
              name="loanTerm"
              placeholder="ঋণ টার্ম সংখ্যা একাধিক হলে কমা ব্যবহার করুন"
              onChange={handleChange}
              value={loanTerm}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('কিস্তি আদায়ের ফ্রিকোয়েন্সি')}
              name="repaymentRequency"
              select
              SelectProps={{ native: true }}
              value={repaymentRequency ? repaymentRequency : ' '}
              variant="outlined"
              size="small"
              onChange={handleChange}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {[
                { value: 'W', label: 'সাপ্তাহিক' },
                { value: 'M', label: 'মাসিক' },
              ].map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('কিস্তি আদায়ের সংখ্যা')}
              name="numberOfInstallment"
              placeholder="কিস্তি আদায়ের সংখ্যা একাধিক হলে কমা ব্যবহার করুন"
              onChange={handleChange}
              value={numberOfInstallment}
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('সার্ভিস চার্জ ক্যালকুলেশনের পদ্ধতি')}
              name="calculationMethod"
              id="district"
              disabled=""
              select
              SelectProps={{ native: true }}
              value={calculationMethod ? calculationMethod : ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {[
                { value: 'F', label: 'ফ্লাট' },
                { value: 'D', label: 'ডিক্লাইন' },
                { value: 'DOC', label: 'কাস্টম' },
              ].map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রোডাক্ট জিএল')}
              name="productGl"
              disabled=""
              select
              SelectProps={{ native: true }}
              value={productGl ? productGl : ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {glAssetList.map((option, idx) => (
                <option key={idx} value={option.id}>
                  {option.glacName}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root': {
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                transition: '0.3s ease',
                backgroundColor: '#E8F9FD',
                color: 'green',
                borderRadius: '10px',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#CDF0EA',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                },
              },
              '& .MuiToggleButton-root.Mui-selected': {
                color: 'green',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={graceToggle}
              onChange={() => {
                if (graceToggle == true) {
                  setGraceServiceChargeToggle(false);
                }
                setGraceToggle(!graceToggle);
              }}
              sx={{
                height: '40px',
              }}
            >
              {graceToggle ? (
                <>
                  <CheckCircleIcon /> <h3>হ্যাঁ গ্রেস পিরিয়ড এলাউড</h3>
                </>
              ) : (
                <>
                  <HelpIcon />
                  <h3>গ্রেস পিরিয়ড এলাউড কিনা?</h3>
                </>
              )}
            </ToggleButton>
          </Grid>

          {graceToggle ? (
            <>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={star('গ্রেস পিরিয়ড')}
                  name="gracePeriod"
                  onChange={handleChange}
                  id="number"
                  value={gracePeriod}
                  variant="outlined"
                  size="small"
                ></TextField>
                {!productMaster.gracePeriod ? (
                  <span style={{ color: '#FFCC00' }}>{formError.gracePeriodError}</span>
                ) : productMaster.gracePeriod.length > 0 ? (
                  <span style={{ color: '#FFCC00' }}>{formError.gracePeriodError}</span>
                ) : (
                  ''
                )}
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
                sx={{
                  '& .MuiToggleButton-root': {
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                    transition: '0.3s ease',
                    backgroundColor: '#E8F9FD',
                    color: 'green',
                    borderRadius: '10px',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#CDF0EA',
                      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                    },
                  },
                  '& .MuiToggleButton-root.Mui-selected': {
                    color: 'green',
                    backgroundColor: '#E7FBBE',
                  },
                }}
              >
                <ToggleButton
                  value="check"
                  fullWidth
                  selected={graceServiceChargeToggle}
                  onChange={() => {
                    setGraceServiceChargeToggle(!graceServiceChargeToggle);
                    setProductMaster({ ...productMaster, gPServChargeDir: '' });
                  }}
                  sx={{
                    height: '40px',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    border: 'none',
                  }}
                >
                  {graceServiceChargeToggle ? (
                    <>
                      <CheckCircleIcon /> <h3 className="fonts">হ্যাঁ গ্রেস পিরিয়ডে সার্ভিস চার্জ প্রযোজ্য</h3>
                    </>
                  ) : (
                    <>
                      <HelpIcon />
                      <h3 className="fonts">গ্রেস পিরিয়ডে সার্ভিস চার্জ প্রযোজ্য কিনা?</h3>
                    </>
                  )}
                </ToggleButton>
              </Grid>
              {graceServiceChargeToggle ? (
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label={star('গ্রেস পিরিয়ডে সার্ভিস চার্জ নির্দেশনা')}
                    name="gPServChargeDir"
                    disabled=""
                    select
                    SelectProps={{ native: true }}
                    value={gPServChargeDir || ' '}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {[{ value: 'EQUAL', label: 'সমভাবে বণ্টিত' }].map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('মূলধন/আসল জিএল')}
              name="capitalGl"
              disabled=""
              select
              SelectProps={{ native: true }}
              value={capitalGl ? capitalGl : ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {glAssetList.map((option, idx) => (
                <option key={idx} value={option.id}>
                  {option.glacName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('সার্ভিস চার্জ জিএল')}
              name="serviceChargeGl"
              disabled=""
              select
              SelectProps={{ native: true }}
              value={serviceChargeGl ? serviceChargeGl : ' '}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {glIncomeList.map((option, idx) => (
                <option key={idx} value={option.id}>
                  {option.glacName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root': {
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                transition: '0.3s ease',
                backgroundColor: '#E8F9FD',
                color: 'green',
                borderRadius: '10px',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#CDF0EA',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                },
              },
              '& .MuiToggleButton-root.Mui-selected': {
                color: 'green',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={insuranceToggle}
              onChange={() => {
                setInsuranceToggle(!insuranceToggle);
              }}
              sx={{
                height: '40px',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                border: 'none',
              }}
            >
              {insuranceToggle ? (
                <>
                  <CheckCircleIcon /> <h3 className="fonts">হ্যাঁ ইনস্যুরেন্স এলাউড</h3>
                </>
              ) : (
                <>
                  <HelpIcon />
                  <h3 className="fonts">ইনস্যুরেন্স এলাউড কিনা?</h3>
                </>
              )}
            </ToggleButton>
          </Grid>

          {insuranceToggle ? (
            <>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={star('ইনস্যুরেন্স জিএল')}
                  name="insuranceGl"
                  disabled=""
                  select
                  SelectProps={{ native: true }}
                  value={insuranceGl || ' '}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {glAssetList.map((option, idx) => (
                    <option key={idx} value={option.id}>
                      {option.glacName}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={star('ইনস্যুরেন্সের শতকরা হার(%)')}
                  id="numberWithPercent"
                  name="insuPerRate"
                  onChange={handleChange}
                  value={insuPerRate}
                  variant="outlined"
                  size="small"
                ></TextField>
                {!productMaster.insuPerRate ? (
                  <span style={{ color: '#FFCC00' }}>{formError.insuPerRateError}</span>
                ) : productMaster.insuPerRate.length > 0 ? (
                  <span style={{ color: '#FFCC00' }}>{formError.insuPerRateError}</span>
                ) : (
                  ''
                )}
              </Grid>
            </>
          ) : (
            ''
          )}
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root': {
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                transition: '0.3s ease',
                backgroundColor: '#E8F9FD',
                color: 'green',
                borderRadius: '10px',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#CDF0EA',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                },
              },
              '& .MuiToggleButton-root.Mui-selected': {
                color: 'green',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={chequeDisbursementFlag}
              onChange={() => {
                setChequeDisbursementFlag(!chequeDisbursementFlag);
              }}
              sx={{
                height: '40px',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                border: 'none',
              }}
            >
              {chequeDisbursementFlag ? (
                <>
                  <CheckCircleIcon /> <h3> হ্যাঁ চেক বিতরণ এলাউড</h3>
                </>
              ) : (
                <>
                  <HelpIcon />
                  <h3>চেক বিতরণ এলাউড?</h3>
                </>
              )}
            </ToggleButton>
          </Grid>

          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root': {
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                transition: '0.3s ease',
                backgroundColor: '#E8F9FD',
                color: 'green',
                borderRadius: '10px',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#CDF0EA',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                },
              },
              '& .MuiToggleButton-root.Mui-selected': {
                color: 'green',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={isAdvBenfitFlag}
              onChange={() => {
                setIsAdvBenfitFlag(!isAdvBenfitFlag);
              }}
              sx={{
                height: '40px',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                border: 'none',
              }}
            >
              {isAdvBenfitFlag ? (
                <>
                  <CheckCircleIcon /> <h3> হ্যাঁ অগ্রিম পেমেন্ট প্রযোজ্য</h3>
                </>
              ) : (
                <>
                  <HelpIcon />
                  <h3>অগ্রিম পেমেন্ট প্রযোজ্য?</h3>
                </>
              )}
            </ToggleButton>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('হলিডে ইফেক্ট')}
              name="holidayEffect"
              select
              SelectProps={{ native: true }}
              value={holidayEffect || ' '}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
              onChange={handleChange}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {holidayEffectArray.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('আদায়ের ক্রমানুসার মূলধন')}
              id="d1"
              name="sequentialOrderCapital"
              disabled=""
              select
              SelectProps={{ native: true }}
              value={sequentialOrderCapital ? sequentialOrderCapital : ' '}
              onChange={eraningHandleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>

              {earningVal.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="d2"
              label={star('আদায়ের ক্রমানুসার সার্ভিস চার্জ')}
              name="sequentialOrderSerCharge"
              disabled=""
              select
              SelectProps={{ native: true }}
              value={sequentialOrderSerCharge ? sequentialOrderSerCharge : ' '}
              onChange={eraningHandleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {earningVal.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="d3"
              label={star('আদায়ের ক্রমানুসার বিলম্বিত চার্জ')}
              name="sequentialOrderDelayCharge"
              disabled=""
              select
              SelectProps={{ native: true }}
              value={sequentialOrderDelayCharge ? sequentialOrderDelayCharge : ' '}
              onChange={eraningHandleChange}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {earningVal.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root': {
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                transition: '0.3s ease',
                backgroundColor: '#E8F9FD',
                color: 'green',
                borderRadius: '10px',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#CDF0EA',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                },
              },
              '& .MuiToggleButton-root.Mui-selected': {
                color: 'green',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={isMultipleLoanAllow}
              onChange={() => {
                setProductMaster({
                  ...productMaster,
                  allowPercent: '',
                });
                setIsMultipleLoanAllow(!isMultipleLoanAllow);
              }}
              sx={{
                height: '40px',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                border: 'none',
              }}
            >
              {isMultipleLoanAllow ? (
                <>
                  <CheckCircleIcon /> <h3>হ্যাঁ একাধিক ঋণ সচল</h3>
                </>
              ) : (
                <>
                  <HelpIcon />
                  <h3>একাধিক ঋণ সচল?</h3>
                </>
              )}
            </ToggleButton>
          </Grid>
          {isMultipleLoanAllow ? (
            <>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={star('ঋণ পরিশোধের পরিমাণ(শতকরা %)')}
                  name="allowPercent"
                  onChange={handleChange}
                  id="numberWithPercent"
                  value={allowPercent}
                  variant="outlined"
                  size="small"
                ></TextField>
                {!productMaster.allowPercent ? (
                  <span style={{ color: '#FFCC00' }}>{formError.allowPercent}</span>
                ) : productMaster.allowPercent.length > 0 ? (
                  <span style={{ color: '#FFCC00' }}>{formError.allowPercent}</span>
                ) : (
                  ''
                )}
              </Grid>
            </>
          ) : (
            ''
          )}
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root': {
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                transition: '0.3s ease',
                backgroundColor: '#E8F9FD',
                color: 'green',
                borderRadius: '10px',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#CDF0EA',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                },
              },
              '& .MuiToggleButton-root.Mui-selected': {
                color: 'green',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={isMultipleDisbursementAllowed}
              onChange={() => {
                setIsMultipleDisbursementAllowed(!isMultipleDisbursementAllowed);
              }}
              sx={{
                height: '40px',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                border: 'none',
              }}
            >
              {isMultipleDisbursementAllowed ? (
                <>
                  <CheckCircleIcon /> <h3>হ্যাঁ একাধিক ঋণ বিতরণ প্রযোজ্য</h3>
                </>
              ) : (
                <>
                  <HelpIcon />
                  <h3>একাধিক ঋণ বিতরণ প্রযোজ্য?</h3>
                </>
              )}
            </ToggleButton>
          </Grid>
        </Grid>
      </Paper>

      <Grid container className="btn-container">
        <Tooltip title="তথ্য মুছুন">
          <Button variant="contained" className="btn-warning" onClick={pageRefresh}>
            <BrushIcon />
            &nbsp;তথ্য মুছুন
          </Button>
        </Tooltip>
        <Tooltip title="সংরক্ষণ করুন">
          <Button
            variant="contained"
            className="btn btn-save"
            onClick={() => saveData()}
            startIcon={<SaveOutlinedIcon />}
          >
            {' '}
            সংরক্ষণ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default ProductMaster;
