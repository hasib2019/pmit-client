/* eslint-disable no-misleading-character-class */
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
//For using the date picker
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import Joi from 'joi-browser';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { glListRoute, loanProject } from '../../../../../url/ApiList';
import star from '../../../loan-management/loan-application/utils';

import {
  bangToEng,
  engToBang,
  myValidate,
} from 'components/mainSections/samity-managment/member-registration/validator';
import { localStorageData } from 'service/common';
import { getApi } from '../../product-setup/utils/getApi';
const EditProject = () => {
  const config = localStorageData('config');
  const router = useRouter();
  const [samityTypeError, setSamityTypeError] = useState('');

  //let getId = typeof window !== 'undefined' ? JSON.parse(localStorage.storeId) : null;
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    projectNameBangla: '',
    projectCode: '',
    projectPhase: '',
    projectDirector: '',
    description: '',
    projectDuration: '',
    estimatedExp: '',
    fundSource: '',
  });
  const [checkboxValues, setCheckboxValues] = useState([]);

  const [extraProjectInfo, setExtraProjectInfo] = useState({
    memberAdmissionFee: '',
    memberPassBookFee: '',
    defaultSavingsProduct: '',
    defaultShareProduct: '',
  });
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);

  const [readOnlyForValue, setReadOnlyForValue] = useState(false);
  const [disabledForProjectPhase, setDisabledForProjectPhase] = useState(false);
  // const [expireDate, setExpireDate] = useState(null);

  const [glList, setGlList] = useState([]);
  const [samityTypeList] = useState([
    {
      value: 'C',
      label: 'সমবায় সমিতি',
    },
    {
      value: 'D',
      label: 'দল',
    },
    {
      value: 'G',
      label: 'সংঘ',
    },
    {
      value: 'S',
      label: 'সমিতি',
    },
  ]);
  useEffect(() => {
    getProjectInfo();
  }, []);
  const bengaliRegex = /[০-৯]+(\.[০-৯]*)?$/;
  // const [areaList, setAreaList] = useState([{ division: '', district: '', upazila: '' }]);
  // const [divisionId, setDivisionId] = useState([]);
  // const [resultOfDivision, setResultOfDivision] = useState([]);
  // const [resultOfUpazila, setResultOfUpazila] = useState([]);
  // const [resultOfDistrict, setResultOfDistrict] = useState([]);
  const [dateValue, setDateValue] = useState(null);
  // const [projectInitiateDate, setProjectInitiateDate] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [admissionFeeObj, setAdmissionFeeObj] = useState({
    label: '',
    id: '',
  });
  const [passBookGlObj, setPassBookGlObj] = useState({
    label: '',
    id: '',
  });
  const getGlList = async () => {
    let getList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
    setGlList(getList.data.data ? getList.data.data : []);
    return getList?.data?.data || [];
  };

  const handleExtraProjectInfo = (e) => {
    const { name, value, id } = e.target;
    let resultObj;
    switch (name) {
      case 'memberAdmissionFee':
        formErrors.memberAdmissionFee = '';
        resultObj = myValidate('threeNumber', value);
        if (resultObj?.status) {
          return;
        }
        setExtraProjectInfo({
          ...extraProjectInfo,
          [name]: resultObj?.value,
        });
        formErrors.admissionFeeError = resultObj?.error;
        break;
      case 'memberPassBookFee':
        formErrors.memberPassBookFee = '';

        resultObj = myValidate('threeNumber', value);
        if (resultObj?.status) {
          return;
        }
        setExtraProjectInfo({
          ...extraProjectInfo,
          [name]: resultObj?.value,
        });
        formErrors.memberPassBookFeeError = resultObj?.error;
        break;
    }
    if (id != 'number') {
      setExtraProjectInfo({
        ...extraProjectInfo,
        [name]: value,
      });
      return;
    }
  };
  // const handleToggle = () => {
  //   setExtraProjectInfo({
  //     ...extraProjectInfo,
  //     isDefaultProduct: !extraProjectInfo.isDefaultProduct,
  //   });
  // };
  let getProjectInfo = async () => {
    try {
      let base64ConvertedData = atob(router.query.data);
      let result = JSON.parse(base64ConvertedData);

      let projectInfos = await axios.get(loanProject + '/projectWithPagination?page=1&id=' + result.id, config);

      const glListArray = await getGlList();
      const admissionFeeGlObject = glListArray.find((gl) => gl?.id == projectInfos?.data?.data?.data[0]?.admissionGlId);
      const passBookGlObject = glListArray.find((gl) => gl?.id == projectInfos?.data?.data?.data[0]?.passbookGlId);
      setPassBookGlObj(
        passBookGlObject?.id && passBookGlObject?.glacName
          ? {
            id: passBookGlObject?.id,
            label: passBookGlObject?.glacName,
          }
          : undefined,
      );
      setAdmissionFeeObj(
        admissionFeeGlObject?.id && admissionFeeGlObject?.glacName
          ? {
            id: admissionFeeGlObject?.id,
            label: admissionFeeGlObject?.glacName,
          }
          : undefined,
      );
      // setProjectInitiateDate(projectInfos?.data?.data?.data[0]?.initiateDate);
      setCheckboxValues(projectInfos?.data?.data?.data[0]?.samityType);
      setProjectInfo({
        projectName: projectInfos?.data?.data?.data[0]?.projectName,
        projectNameBangla: projectInfos?.data?.data?.data[0]?.projectNameBangla,
        projectCode: engToBang(projectInfos.data?.data?.data[0]?.projectCode),
        projectPhase: projectInfos?.data?.data?.data[0]?.projectPhase,
        projectDirector: projectInfos?.data?.data?.data[0]?.projectDirector,
        description: projectInfos?.data?.data?.data[0]?.description,
        projectDuration: engToBang(projectInfos?.data?.data?.data[0]?.projectDuration),
        estimatedExp: engToBang(projectInfos?.data?.data?.data[0]?.estimatedExp),
        fundSource: projectInfos?.data?.data?.data[0]?.fundSource,
      });
      setExtraProjectInfo({
        memberAdmissionFee: engToBang(projectInfos?.data?.data?.data[0]?.admissionFee),
        memberPassBookFee: engToBang(projectInfos?.data?.data?.data[0]?.passbookFee),
        defaultSavingsProduct: projectInfos?.data?.data?.data[0]?.isDefaultSavingsProduct,
        defaultShareProduct: projectInfos?.data?.data?.data[0]?.isDefaultShareProduct,
      });
      setDateValue(projectInfos.data.data.data[0].expireDate);
      setReadOnlyForValue(true);
      if (projectInfos.data.data.data[0].projectPhase == 'C') {
        setDisabledForProjectPhase(true);
      } else {
        setDisabledForProjectPhase(false);
      }
    } catch (error) {
      if (error.response) {
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const handleSavingsToggle = () => {
    setExtraProjectInfo({
      ...extraProjectInfo,
      defaultSavingsProduct: !extraProjectInfo.defaultSavingsProduct,
    });
  };
  const handleShareToggle = () => {
    setExtraProjectInfo({
      ...extraProjectInfo,
      defaultShareProduct: !extraProjectInfo.defaultShareProduct,
    });
  };

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    let resultObj;

    let regexResultFunc = (regex, value) => {
      return regex.test(value);
    };
    let expDate, sysDate, date, dateValue, initialDate, expireDate;
    switch (name) {
      case 'projectName':
        formErrors.projectName = '';
        setProjectInfo({
          ...projectInfo,
          [e.target.name]: e.target.value.replace(/[^A-Za-z0-9\w\s.-]/gi, ''),
        });
        return;
      case 'projectNameBangla':
        formErrors.projectNameBangla = '';
        setProjectInfo({
          ...projectInfo,
          [e.target.name]: e.target.value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
            '',
          ),
        });
        return;
      case 'projectDirector':
        formErrors.projectDirector = '';
        if (bengaliRegex.test(e.target.value)) {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.slice(0, -1),
          });
          return;
        }
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.replace(/[^A-Za-z\s-]/gi, ''),
          });
          return;
        } else {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      case 'fundSource':
        formErrors.fundSource = '';
        if (bengaliRegex.test(e.target.value)) {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.slice(0, -1),
          });
          return;
        }
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.replace(/[^A-Za-z\s-]/gi, ''),
          });
          return;
        } else {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      // break;
      case 'description':
        formErrors.description = '';
        if (regexResultFunc(/[A-Za-z]/gi, value)) {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.replace(/[^A-Za-z0-9\s]/gi, ''),
          });
          return;
        } else {
          setProjectInfo({
            ...projectInfo,
            [e.target.name]: e.target.value.replace(
              /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
              '',
            ),
          });
          return;
        }
      case 'projectPhase':
        expDate = new Date(Date.parse(dateValue));
        sysDate = new Date();
        if (value == 'K' && sysDate < expDate) {
          setFormErrors({
            ...formErrors,
            projectPhase: 'চলমান প্রকল্প কখনো কর্মসূচীতে পরিবর্তন সম্ভব না',
          });
        } else {
          setFormErrors({
            ...formErrors,
            projectPhase: '',
          });
        }

        break;
      case 'projectDuration':
        resultObj = myValidate('number', value);
        if (resultObj?.status) {
          return;
        }

        setProjectInfo({
          ...projectInfo,
          [name]: resultObj?.value,
        });

        formErrors.estimatedExp = resultObj?.error;

        date = new Date();
        dateValue = Number(bangToEng(value));
        initialDate = new Date(date.setMonth(date.getMonth() + dateValue));
        expireDate = new Date(initialDate.setDate(initialDate.getDate() - 1));
        setDateValue(expireDate);
        formErrors.projectDuration = '';
        break;
      case 'estimatedExp':
        resultObj = myValidate('annualIncome', value);
        if (resultObj?.status) {
          return;
        }
        setProjectInfo({
          ...projectInfo,
          [name]: resultObj?.value,
        });
        formErrors.estimatedExp = resultObj?.error;
        break;
    }
    if (id != 'number') {
      setProjectInfo({
        ...projectInfo,
        [e.target.name]: e.target.value,
      });
    }
  };

  //     const { name, value,id} = e.target;
  //     if (id == 'number') {
  //       if (value.length == 1 && value == 0)
  //           return;
  //          if(name=="projectDuration"){
  //              setProjectInfo({
  //                 ...projectInfo,
  //                 [name]: value.replace(/\D/g, ""),
  //               });
  //               let date = new Date(projectInitiateDate);
  //               let initialDate = new Date(date.setMonth(date.getMonth() + Number(value)))
  //               let expireDate =  new Date(initialDate.setDate(initialDate.getDate()-1))
  //               setDateValue(expireDate)
  //               formErrors.projectDuration = "";
  //              return;
  //             }
  //                   if (name == "estimatedExp" && value.length >15){
  //                     setProjectInfo({
  //                 ...projectInfo,
  //                 estimatedExp:
  //                   value.substring(0, 15),
  //               });
  //               return;
  // }

  // setProjectInfo({
  //   ...projectInfo,
  //   [name]: value.replace(/\D/gi, ""),
  // });
  // return;
  // }
  //     switch(name)
  //     {
  //       case "projectPhase":
  //         let expireDate = new Date(Date.parse(dateValue));
  //        let sysDate=new Date();
  //        if(sysDate<expireDate)
  //        {
  //           setFormErrors({
  //             ...formErrors,
  //              "projectPhase":"চলমান প্রকল্প কখনো কর্মসূচীতে পরিবর্তন সম্ভব না"
  //           })
  //        }
  //        else{
  //         setFormErrors({
  //           ...formErrors,
  //            "projectPhase":""
  //         })
  //        }
  //     break;
  //       case "projectDuration":
  //         setProjectInfo({
  //           ...projectInfo,
  //           [e.target.name]: e.target.value.replace(/\D/g, ""),
  //         });
  //         break;
  //         case "estimatedExp":
  //           setProjectInfo({
  //             ...projectInfo,
  //             [e.target.name]: e.target.value.replace(/\D/g, ""),
  //           });
  //           break;
  //     }
  //     if(formErrors[name])
  //     {
  //       setFormErrors({...formErrors,
  //       [name]:""})
  //     }
  //     if(e.target.name != "projectDuration" && e.target.name!="estimatedExp"){
  //     setProjectInfo({
  //       ...projectInfo,
  //       [e.target.name]: e.target.value,
  //     });
  //   }
  //   }
  // handle input change

  // const handleInputChangeDivision = (e, index) => {
  //   const { name, value } = e.target;
  //   const list = [...areaList];
  //   list[index][name] = value;
  //   setAreaList(list);
  //   setDivisionId(e.target.value);
  //   getDistrictData(e.target.value, index);
  // };
  // const handleInputChangeDistrict = (e, index) => {
  //   const { name, value } = e.target;
  //   const list = [...areaList];
  //   list[index][name] = value;
  //   setAreaList(list);
  //   getUpazila(divisionId, e.target.value, index);
  // };
  // const handleInputChangeUpazila = (e, index) => {
  //   const { name, value } = e.target;
  //   const list = [...areaList];
  //   list[index][name] = value;
  //   setAreaList(list);
  // };
  // handle click event of the Remove button
  // const handleRemoveClickArea = async (index) => {
  //   let list = [...areaList];
  //   list.splice(index, 1);
  //   setAreaList(list);
  // };
  // handle click event of the Add button
  // const handleAddClickArea = () => {
  //   setAreaList([...areaList, { division: '', district: '', upazila: '' }]);
  // };

  /////////////////////// Get Upazila Start ///////////////////////////

  // let getUpazila = async (data1, data2, index) => {
  //   try {
  //     let upazilaData = await axios.get(Upazila + `&divisionId=${data1}&districtId=${data2}`, config);
  //     let list = [...resultOfUpazila];
  //     list[index] = upazilaData.data.data;
  //     setResultOfUpazila(list);
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
  /////////////////////// Get Upazila End ///////////////////////////
  ////////////////////////////////////////

  const schema = {
    projectName: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রকল্পের নাম / কর্মসূচী নাম উল্লেখ করুন',
        };
      }),
    projectNameBangla: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রকল্পের নাম/কর্মসূচী বাংলা নাম উল্লেখ করুন',
        };
      }),
    projectCode: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রকল্পের কোড/কর্মসূচী কোড উল্লেখ করুন',
        };
      }),
    projectPhase: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রকল্পের নাম/কর্মসূচী টাইপ উল্লেখ করুন',
        };
      }),
    projectDirector: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রকল্প পরিচালক নাম উল্লেখ করুন',
        };
      }),
    description: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রকল্পের নাম / কর্মসূচী বিস্তারিত উল্লেখ করুন',
        };
      }),
    projectDuration: Joi.required().error(() => {
      return {
        message: 'প্রকল্পের/কর্মসূচীর মেয়াদ(একক-মাস) নাম উল্লেখ করুন',
      };
    }),
    estimatedExp: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রাক্কলিত ব্যয়/ কর্মসূচীর ব্যয় উল্লেখ করুন',
        };
      }),
    fundSource: Joi.string()
      .required()
      .error(() => {
        return {
          message: 'প্রকল্পের/কর্মসূচীর অর্থের উৎস উল্লেখ করুন',
        };
      }),
  };

  const validate = () => {
    let flag = true;

    const result = Joi.validate(projectInfo, schema, { abortEarly: false });

    let { error } = result;
    const errors = {};
    if (error) {
      flag = false;
      for (let item of error.details) {
        errors[item.path[0]] = item.message;
      }
    }
    if (extraProjectInfo.memberAdmissionFee && !admissionFeeObj?.id) {
      errors['memberAdmissionFeeGl'] = 'সদস্য ভর্তি ফি জিএল নির্বাচন করুন';
      flag = false;
    }
    if (admissionFeeObj?.id && !extraProjectInfo.memberAdmissionFee) {
      errors['memberAdmissionFee'] = 'সদস্য ভর্তি ফি উল্লেখ করুন';
      flag = false;
    }
    if (extraProjectInfo.memberPassBookFee && !passBookGlObj?.id) {
      errors['memberPassBookFeeGl'] = 'পাশবুক ফি জিএল নির্বাচন করুন';
      flag = false;
    }
    if (passBookGlObj?.id && !extraProjectInfo.memberPassBookFee) {
      errors['memberPassBookFee'] = 'পাশবুক ফি উল্লেখ করুন';
      flag = false;
    }
    let newObj = { ...formErrors };
    if (Object.keys(newObj).length > 0) {
      for (const item in newObj) {
        if (newObj[item]) {
          flag = false;
          errors[item] = newObj[item];
        }
      }
    }

    setFormErrors(errors);
    return flag;
  };
  let onSubmitData = async (e) => {
    e.preventDefault();
    let base64ConvertedData = atob(router.query.data);
    let resultant = JSON.parse(base64ConvertedData);
    let result = validate();
    if (checkboxValues.length < 1) {
      result = false;
      setSamityTypeError('সমিতি টাইপ নির্বাচন করুন');
    }

    let payload = {
      projectCode: bangToEng(projectInfo.projectCode),
      projectPhase: projectInfo.projectPhase,
      projectDirector: projectInfo.projectDirector,
      projectDuration: bangToEng(projectInfo.projectDuration),
      expireDate: dateValue,
      description: projectInfo.description,
      fundSource: projectInfo.fundSource,
      estimatedExp: bangToEng(projectInfo.estimatedExp),
      samityType: checkboxValues,
      admissionFee: bangToEng(extraProjectInfo?.memberAdmissionFee ? extraProjectInfo.memberAdmissionFee : 0),
      passbookFee: bangToEng(extraProjectInfo.memberPassBookFee ? extraProjectInfo.memberPassBookFee : 0),
      passbookGlId: passBookGlObj?.id ? passBookGlObj.id : null,
      admissionGlId: admissionFeeObj?.id ? admissionFeeObj.id : null,
      isDefaultSavingsProduct: extraProjectInfo.defaultSavingsProduct,
      isDefaultShareProduct: extraProjectInfo.defaultShareProduct,
    };

    if (result) {
      try {
        setLoadingDataSaveUpdate(true);

        let proejctInfoData = await axios.put(loanProject + '/' + resultant.id, payload, config);
        NotificationManager.success(proejctInfoData.data.message, '', 3000);
        setProjectInfo({
          projectName: '',
          projectNameBangla: '',
          projectCode: '',
          projectPhase: '',
          projectDirector: '',
          description: '',
          projectDuration: '',
          estimatedExp: '',
          fundSource: '',
        });
        setDateValue(null);
        setExtraProjectInfo({
          admissionFee: null,
          admissionGlId: 'নির্বাচন করুন',
          passbookFee: null,
          passbookGlId: 'নির্বাচন করুন',
          isDefaultProduct: true,
        });
        setLoadingDataSaveUpdate(false);

        onNextPage();
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 3000);
        } else if (error.request) {
          NotificationManager.error('নেটওয়ার্ক সংযোগে ত্রুটি', '', 3000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 3000);
        }
      }
    } else {
      setLoadingDataSaveUpdate(false);
      NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুণ', '', 5000);
      // for (let item in formErrors) {
      //   let message = formErrors[item];
      //   ("Message----",message);
      //   NotificationManager.error(message, "", 3000);
      // }
    }
  };

  const onNextPage = () => {
    router.push({
      pathname: '/adminstration/project-setup/project-info',
    });
  };

  return (
    <>
      <Grid item md={12} xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          style={{
            color: '#1976d2',
            textAlign: 'center',
            padding: '5px',
            textShadow: '1px 1px #FF0000',
          }}
        ></Typography>
        <Grid container spacing={2.5}>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্প/কর্মসূচীর নাম(ইংরেজি)')}
              name="projectName"
              // onChange={handleChange}
              number
              disabled
              value={projectInfo.projectName}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectName && <span style={{ color: 'red' }}>{formErrors.projectName}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্প/কর্মসূচীর নাম(বাংলা)')}
              name="projectNameBangla"
              // onChange={handleChange}
              number
              disabled
              value={projectInfo.projectNameBangla}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectNameBangla && <span style={{ color: 'red' }}>{formErrors.projectNameBangla}</span>}
          </Grid>
          <Grid item md={4} xs={12} sx={{ textAlign: 'center' }}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="pcn"
                onChange={handleChange}
                name="projectPhase"
                required
                value={projectInfo.projectPhase}
              >
                <FormControlLabel value="P" control={<Radio />} defaultValue="P" label="প্রকল্প" />
                <FormControlLabel value="K" control={<Radio />} disabled={disabledForProjectPhase} label="কর্মসূচি" />
              </RadioGroup>
            </FormControl>
            <br />
            {(!projectInfo.projectPhase || (formErrors.projectPhase && formErrors.projectPhase.length > 0)) && (
              <span style={{ color: 'red' }}>{formErrors.projectPhase}</span>
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="প্রকল্পের কোড / কর্মসূচী কোড"
              name="projectCode"
              disabled
              // onChange={handleChange}
              number
              value={projectInfo.projectCode}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectCode && <span style={{ color: 'red' }}>{formErrors.projectCode}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্প পরিচালক')}
              name="projectDirector"
              onChange={handleChange}
              text
              value={projectInfo.projectDirector}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectDirector && <span style={{ color: 'red' }}>{formErrors.projectDirector}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="number"
              label={star('প্রকল্পের/ কর্মসূচীর মেয়াদ(একক-মাস)')}
              name="projectDuration"
              onChange={handleChange}
              text
              value={projectInfo.projectDuration}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectDuration && <span style={{ color: 'red' }}>{formErrors.projectDuration}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্পের/ কর্মসূচীর অর্থের উৎস')}
              name="fundSource"
              onChange={handleChange}
              text
              value={projectInfo.fundSource}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.fundSource && <span style={{ color: 'red' }}>{formErrors.fundSource}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="number"
              label={star('প্রাক্কলিত ব্যয়/ কর্মসূচীর ব্যয়')}
              name="estimatedExp"
              onChange={handleChange}
              text
              value={projectInfo?.estimatedExp}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.estimatedExp && <span style={{ color: 'red' }}>{formErrors.estimatedExp}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} style={{ width: '100%' }}>
              <DatePicker
                label={star('মেয়াদ উত্তীর্ণের তারিখ')}
                value={dateValue}
                readOnly={readOnlyForValue}
                required
                onChange={(newValue) => {
                  setDateValue(newValue);
                }}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              // maxDate={new Date()}
              />
            </LocalizationProvider>
            {!dateValue && <span style={{ color: 'red' }}>{formErrors.date}</span>}
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্পের/ কর্মসূচীর বর্ণনা')}
              name="description"
              onChange={handleChange}
              text
              value={projectInfo.description}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.description && <span style={{ color: 'red' }}>{formErrors.description}</span>}
          </Grid>
          <Grid item md={12} xs={12}>
            {
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormLabel sx={{ paddingTop: '9px', fontWeight: 'bold' }}>{star('সমিতির ধরণ')}</FormLabel>

                  {samityTypeList.map((option, i) => (
                    <FormControlLabel key={i}
                      value="start"
                      control={
                        <Checkbox
                          value={option.value}
                          checked={checkboxValues?.length >= 1 && checkboxValues.includes(option.value)}
                          onChange={(event) => {
                            setSamityTypeError('');
                            const value = event.target.value;
                            if (checkboxValues.length >= 1 && checkboxValues.includes(value)) {
                              setCheckboxValues(checkboxValues.filter((v) => v !== value));
                            } else {
                              setCheckboxValues([...checkboxValues, value]);
                            }
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label={option.label}
                      labelPlacement="start"
                    />
                  ))}
                </FormGroup>
                {<span className="validation">{samityTypeError}</span>}
              </FormControl>
            }
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="number"
              label="সদস্যের ভর্তি ফি"
              name="memberAdmissionFee"
              onChange={handleExtraProjectInfo}
              type="text"
              value={extraProjectInfo.memberAdmissionFee}
              variant="outlined"
              size="small"
            ></TextField>
            <span className="validation">{formErrors.memberAdmissionFee}</span>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="admissionFeeGL"
              onChange={(event, value) => {
                if (value == null) {
                  setAdmissionFeeObj({
                    id: '',
                    label: '',
                  });
                } else {
                  value &&
                    setAdmissionFeeObj({
                      id: value.id,
                      label: value.label,
                    });
                }
                formErrors.memberAdmissionFeeGl = '';
              }}
              options={glList.map((option) => {
                return {
                  id: option.id,
                  label: option.glacName,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={
                    setAdmissionFeeObj.id === ''
                      ? star('সদস্যের ভর্তি ফি জিএল নির্বাচন করুন')
                      : star('সদস্যের ভর্তি ফি জিএল')
                  }
                  variant="outlined"
                  size="small"
                />
              )}
              value={admissionFeeObj}
            />
            <span className="validation">{formErrors.memberAdmissionFeeGl}</span>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="number"
              label="সদস্যের পাশবুক ফি"
              name="memberPassBookFee"
              onChange={handleExtraProjectInfo}
              text
              value={extraProjectInfo.memberPassBookFee}
              variant="outlined"
              size="small"
            ></TextField>
            <span className="validation">{formErrors.memberPassBookFee}</span>
          </Grid>
          <Grid item md={4} xs={12}>
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="userName"
              onChange={(event, value) => {
                if (value == null) {
                  setPassBookGlObj({
                    id: '',
                    label: '',
                  });
                } else {
                  value &&
                    setPassBookGlObj({
                      id: value.id,
                      label: value.label,
                    });
                }
                formErrors.memberPassBookFeeGl = '';
              }}
              options={glList.map((option) => {
                return {
                  id: option.id,
                  label: option.glacName,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={
                    setPassBookGlObj.id === ''
                      ? star('সদস্যের পাশবুক ফি জিএল এর নাম নির্বাচন করুন')
                      : star('সদস্যের পাশবুক ফি জিএল')
                  }
                  variant="outlined"
                  size="small"
                />
              )}
              value={passBookGlObj}
            />
            <span className="validation">{formErrors.memberPassBookFeeGl}</span>
          </Grid>
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root.Mui-selected': {
                color: '#357C3C',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={extraProjectInfo.defaultSavingsProduct}
              onChange={handleSavingsToggle}
              sx={{ height: '40px' }}
            >
              {extraProjectInfo.defaultSavingsProduct ? (
                <>
                  সঞ্চয় প্রোডাক্ট &nbsp;
                  <CheckCircleIcon />
                  &nbsp;<h3>হ্যাঁ</h3>
                </>
              ) : (
                <>
                  সঞ্চয় প্রোডাক্ট &nbsp;
                  <HelpIcon />
                  &nbsp;<h3>না</h3>
                </>
              )}
            </ToggleButton>
          </Grid>
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              '& .MuiToggleButton-root.Mui-selected': {
                color: '#357C3C',
                backgroundColor: '#E7FBBE',
              },
            }}
          >
            <ToggleButton
              value="check"
              fullWidth
              selected={extraProjectInfo.defaultShareProduct}
              onChange={handleShareToggle}
              sx={{ height: '40px' }}
            >
              {extraProjectInfo.defaultShareProduct ? (
                <>
                  শেয়ার প্রোডাক্ট &nbsp;
                  <CheckCircleIcon />
                  &nbsp;<h3>হ্যাঁ</h3>
                </>
              ) : (
                <>
                  শেয়ার প্রোডাক্ট &nbsp;
                  <HelpIcon />
                  &nbsp;<h3>না</h3>
                </>
              )}
            </ToggleButton>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            "সংরক্ষণ করা হচ্ছে..."
          </LoadingButton>
        ) : (
          <Tooltip title=" করুন">
            <Button
              variant="contained"
              className="btn btn-save"
              onClick={onSubmitData}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              হালনাাগাদ করুন
            </Button>
          </Tooltip>
        )}
      </Grid>
    </>
  );
};

export default EditProject;
