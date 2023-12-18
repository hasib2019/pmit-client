/* eslint-disable no-misleading-character-class */
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';


import LoadingButton from '@mui/lab/LoadingButton';
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
  Tooltip
} from '@mui/material';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { bangToEng, engToBang, myValidate } from 'components/mainSections/samity-managment/member-registration/validator';
import Joi from 'joi-browser';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { allProjectRoute, glListRoute, loanProject } from '../../../../../url/ApiList';
import star from '../../../loan-management/loan-application/utils';
import { getApi } from '../../product-setup/utils/getApi';
const bengaliRegex = /[০-৯]+(\.[০-৯]*)?$/;
const ProjectSetup = () => {
  const config = localStorageData('config');
  const [checkboxValues, setCheckboxValues] = useState([]);

  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    projectNameBangla: '',
    projectCode: '',
    projectPhase: 'P',
    projectDirector: '',
    description: '',
    projectDuration: '',
    fundSource: '',
    samityType: '',
    estimatedExp: '',
  });
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);

  const [extraProjectInfo, setExtraProjectInfo] = useState({
    memberAdmissionFee: '',
    memberPassBookFee: '',
    defaultSavingsProduct: false,
    defaultShareProduct: false,
    memberAdmissionFeeGl: '',
    memberPassBookFeeGl: '',
  });
  const [admissionFeeObj, setAdmissionFeeObj] = useState({
    label: '',
    id: '',
  });
  const [passBookGlObj, setPassBookGlObj] = useState({
    label: '',
    id: '',
  });
  const [samityTypeError, setSamityTypeError] = useState('');
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
  let regexResultFunc = (regex, value) => {
    return regex.test(value);
  };
  const [glList, setGlList] = useState([]);
  const [value, setValue] = useState(null);
  const [formErrors, setFormErrors] = useState({
    admissionFeeError: '',
    memberPassBookFeeError: '',
  });
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
        formErrors.memberPassBookFeeError = '';

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
    switch (name) {
      case 'samityType':
        if (value == 'নির্বাচন করুন') {
          formErrors.samityType = 'সমিটি নির্বাচনকরুন';
        } else {
          formErrors.meetingDay = '';
        }
        break;

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
            // eslint-disable-next-line no-misleading-character-class
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA-\s]/gi,
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
            [e.target.name]: e.target.value.replace(/[^A-Za-z- ]/gi, ''),
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
        formErrors.projectPhase = '';

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
        if (resultObj?.value != '') {
          let date = new Date();
          let dateValue = Number(bangToEng(value));
          let initialDate = new Date(date.setMonth(date.getMonth() + dateValue));
          let expireDate = new Date(initialDate.setDate(initialDate.getDate() - 1));
          setValue(expireDate);
        }
        if (resultObj?.value == '') {
          setValue(null);
        }

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
  useEffect(() => {
    getGlList();
    getProjectInfo();
  }, []);
  // let getTableRow = () => {
  //   return (
  //     <TableHead className="table-head">
  //       <TableRow>
  //         <TableCell sx={{ width: '7%' }} align="center">
  //           ক্রমিক নং
  //         </TableCell>
  //         <TableCell>প্রকল্পের নাম</TableCell>
  //         <TableCell>প্রকল্প পরিচালকের নাম</TableCell>
  //         <TableCell>মেয়াদ (মাস)</TableCell>
  //         <TableCell align="center">মেয়াদ উত্তীর্ণের তারিখ</TableCell>
  //         <TableCell align="right">প্রাকল্লিত ব্যয় (টাকা)</TableCell>
  //         <TableCell align="center">সম্পাদনা</TableCell>
  //       </TableRow>
  //     </TableHead>
  //   );
  // };
  let getProjectInfo = async () => {
    try {
      let projectInfos = await axios.get(allProjectRoute, config);
      const projectArray = projectInfos?.data?.data;
      if (projectArray.length >= 1) {
        const projectCode = engToBang(Number(projectArray[projectArray.length - 1].projectCode) + 1)
          .toString()
          .padStart(2, '0');

        setProjectInfo({
          ...projectInfo,
          projectCode,
        });
      }
    } catch (error) {
      errorHandler(error)
    }
  };
  const getGlList = async () => {
    let getList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
    getList?.data?.data.unshift({
      glacName: 'জিএল এর নাম',
      glacCode: 'জি এল অ্যাকাউন্ট নম্বর',
      glacType: 'জি এল এর ধরন',
      levelCode: 'লেভেল কোড',
      disabled: true,
    });
    setGlList(getList?.data?.data ? getList?.data?.data : []);
  };
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
    // projectDuration: Joi.number().required().error(() => {
    //   return {
    //     message: 'প্রকল্পের/কর্মসূচীর মেয়াদ(একক-মাস) নাম উল্লেখ করুন',
    //   };
    // }),
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
    const result = Joi.validate(projectInfo, schema, {
      abortEarly: false,
      allowUnknown: true,
    });
    let { error } = result;
    if (!error) {
      return flag;
    } else {
      flag = false;
    }
    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    for (const key in formErrors) {
      if (formErrors[key]) {
        flag = false;
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
    setFormErrors(errors);

    return flag;
  };
  let onSubmitData = async (e) => {
    e.preventDefault();
    let result = validate();
    if (checkboxValues.length < 1) {
      result = false;
      setSamityTypeError('সমিতি টাইপ নির্বাচন করুন');
    }
    let payload = {
      projectName: projectInfo?.projectName,
      projectNameBangla: projectInfo?.projectNameBangla,
      projectCode: bangToEng(projectInfo?.projectCode),
      projectPhase: projectInfo?.projectPhase,
      projectDirector: projectInfo?.projectDirector,
      projectDuration: bangToEng(projectInfo?.projectDuration),
      initiateDate: new Date(),
      expireDate: value,
      description: projectInfo?.description,
      fundSource: projectInfo?.fundSource,
      estimatedExp: bangToEng(projectInfo?.estimatedExp ? projectInfo?.estimatedExp : 0),
      samityType: checkboxValues,
      admissionFee: bangToEng(extraProjectInfo?.memberAdmissionFee ? extraProjectInfo.memberAdmissionFee : 0),
      passbookFee: bangToEng(extraProjectInfo.memberPassBookFee ? extraProjectInfo.memberPassBookFee : 0),
      passbookGlId: passBookGlObj.id ? passBookGlObj.id : null,
      admissionGlId: admissionFeeObj.id ? admissionFeeObj.id : null,
      isDefaultSavingsProduct: extraProjectInfo?.defaultSavingsProduct ? extraProjectInfo.defaultSavingsProduct : false,
      isDefaultShareProduct: extraProjectInfo?.defaultShareProduct ? extraProjectInfo.defaultShareProduct : false,
    };
    if (result) {
      try {
        setLoadingDataSaveUpdate(true);
        let proejctInfoData = await axios.post(loanProject, payload, config);
        NotificationManager.success(proejctInfoData.data.message, '', 3000);
        const projectCode = (Number(bangToEng(projectInfo.projectCode)) + 1).toString().padStart(2, '0');
        setProjectInfo({
          projectName: '',
          projectNameBangla: '',
          projectCode: engToBang(projectCode),
          projectPhase: '',
          projectDirector: '',
          description: '',
          projectDuration: '',
          fundSource: '',
          samityType: 'নির্বাচন করুন',
          estimatedExp: '',
        });
        setExtraProjectInfo({
          memberAdmissionFee: '',
          memberPassBookFee: '',
          defaultProduct: true,
          memberAdmissionFeeGl: '',
          memberPassBookFeeGl: 'নির্বাচন করুন',
        });
        setValue(null);
        setFormErrors({});
        setAdmissionFeeObj({
          id: '',
          label: '',
        });
        setPassBookGlObj({
          id: '',
          label: '',
        });
        setLoadingDataSaveUpdate(false);
        setCheckboxValues([]);
      } catch (error) {
        setLoadingDataSaveUpdate(false);

        errorHandler(error)
      }
    } else {
      setLoadingDataSaveUpdate(false);
      NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুণ', '', 5000);
    }
  };
  return (
    <>
      <Grid item md={12} xs={12} pb={2}>
        <Grid container spacing={2.5}>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্প/কর্মসূচীর/তহবিলের নাম(ইংরেজি)')}
              name="projectName"
              onChange={handleChange}
              number
              value={projectInfo.projectName}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectName && <span className="validation">{formErrors.projectName}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্প/কর্মসূচীর/তহবিলের নাম(বাংলা)')}
              name="projectNameBangla"
              onChange={handleChange}
              number
              value={projectInfo.projectNameBangla}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectNameBangla && <span className="validation">{formErrors.projectNameBangla}</span>}
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
                <FormControlLabel
                  value="K"
                  control={<Radio />}
                  label="কর্মসূচি
                "
                />
              </RadioGroup>
            </FormControl>
            <br />
            {!projectInfo.projectPhase && <span className="validation">{formErrors.projectPhase}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="প্রকল্পের কোড/কর্মসূচী কোড"
              id="number"
              disabled="true"
              name="projectCode"
              // onChange={handleChange}
              number
              value={projectInfo.projectCode}
              variant="outlined"
              size="small"
            ></TextField>
            {(!projectInfo.projectCode || projectInfo.projectCode.length > 50) && (
              <span className="validation">{formErrors.projectCode}</span>
            )}
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
            {!projectInfo.projectDirector && <span className="validation">{formErrors.projectDirector}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="number"
              label={star('প্রকল্পের/ কর্মসূচীর মেয়াদ (একক-মাস)')}
              name="projectDuration"
              onChange={handleChange}
              text
              value={projectInfo.projectDuration}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.projectDuration && <span className="validation">{formErrors.projectDuration}</span>}
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
            {!projectInfo.fundSource && <span className="validation">{formErrors.fundSource}</span>}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="number"
              label={star('প্রাক্কলিত ব্যয়/ কর্মসূচীর ব্যয়')}
              name="estimatedExp"
              onChange={handleChange}
              value={projectInfo.estimatedExp}
              variant="outlined"
              size="small"
            ></TextField>
            {!projectInfo.estimatedExp ? (
              <span className="validation">{!projectInfo.estimatedExp && formErrors.estimatedExp}</span>
            ) : projectInfo.estimatedExp.length > 0 ? (
              <span className="validation">{!projectInfo.estimatedExp && formErrors.estimatedExp}</span>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} style={{ width: '100%' }}>
              <DatePicker
                label={star('মেয়াদ উত্তীর্ণের তারিখ')}
                value={value}
                disabled={true}
                required
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </LocalizationProvider>
            {!value && <span className="validation">{formErrors.date}</span>}
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
            {!projectInfo.description && <span className="validation">{formErrors.description}</span>}
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
                          checked={checkboxValues.includes(option.value)}
                          onChange={(event) => {
                            setSamityTypeError('');
                            const value = event.target.value;
                            if (checkboxValues.includes(value)) {
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
              label="সদস্যের ভর্তি ফি"
              id="number"
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
                  label={setAdmissionFeeObj.id === '' ? 'সদস্যের ভর্তি ফি জিএল নির্বাচন করুন' : 'সদস্যের ভর্তি ফি জিএল'}
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
                  label={setPassBookGlObj.id === '' ? 'সদস্যের পাশবুক ফি জিএল নির্বাচন করুন' : 'সদস্যের পাশবুক ফি জিএল'}
                  variant="outlined"
                  size="small"
                />
              )}
              value={passBookGlObj}
            />
            <span className="validation">{formErrors.memberPassBookFeeGl}</span>
          </Grid>

          {/* <Grid item md={4} xs={12} >
            <TextField
              fullWidth
              label="পাশবুক ফি জিএল"
              name="memberPassBookFeeGl"
              select
              SelectProps={{ native: true }}
              value={extraProjectInfo.memberPassBookFeeGl || 'নির্বাচন করুন'}
              onChange={handleExtraProjectInfo}
              variant="outlined"
              size="small"
            >
              <option >- নির্বাচন করুন -</option>
              {glList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.glacName}
                </option>
              ))}
            </TextField>
          </Grid> */}
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
    </>
  );
};

export default ProjectSetup;
