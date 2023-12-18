import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Autocomplete, Button, Divider, Grid, Paper, TextField, Tooltip } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import bnLocale from 'date-fns/locale/bn';
import useGetDesignation from 'hooks/coop/employee/useGetAllDesignation';
import moment from 'moment';
import { useEffect, useReducer, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { employeeInfoInitialState, employeeInfoReducer } from 'service/employee/employeeStateAndFurction';
import { errorHandler } from 'service/errorHandler';
import { inputRadioGroup } from 'service/fromInput';
import {
  educationalQualifications,
  EmployeeEntrySubmitApi,
  employeeUpdateApiUrl,
  maritalStatusApiUrl,
  religion,
} from '../../../url/coop/ApiList';
import fileCheck from 'components/shared/others/DocImage/FileUploadTypeCheck';
import SingleImageContentd from 'components/shared/others/DocImage/SingleImageContent';
import RequiredFile from 'components/utils/RequiredFile';
import useGetSamityDataById from 'hooks/coop/useGetSamityDataById';
import useGetSamityName from 'hooks/coop/useGetSamityName';
const EmployeeInformation = () => {
  const userData = tokenData();
  const localData = localStorageData('samityInfo');

  useEffect(() => {
    if (userData?.type === 'citizen') {
      dispatch({
        type: 'employeeInfo',
        fieldName: 'samityId',
        value: localData?.id,
      });
    }
  }, []);

  const [state, dispatch] = useReducer(employeeInfoReducer, employeeInfoInitialState);
  const { getAllDesignation, allDesignation } = useGetDesignation(
    state.employeeInfo.samityId && userData.type === 'user'
      ? state.employeeInfo.samityId.id
      : userData.type === 'user'
      ? null
      : state.employeeInfo.samityId,
  );

  const { allSamity, getSamity } = useGetSamityName();
  const samityId = null;
  const { getSmaityDataById, employeeInfo, imageDocument, signatureDocument } = useGetSamityDataById();

  useEffect(() => {
    if (samityId) {
      dispatch({ type: 'others', fieldName: 'update', value: true });
    }
  }, [samityId]);
  useEffect(() => {
    getSmaityDataById(samityId);
  }, [samityId]);
  useEffect(() => {
    setEmployeeInfoInEditMode();
  }, [employeeInfo]);
  useEffect(() => {
    setImageDocumentInEditdMode();
  }, [imageDocument]);
  useEffect(() => {
    setSignatureDocumentInEditMode();
  }, [signatureDocument]);
  useEffect(() => {
    getEducationalQualifications();
    getReligions();
    getMaritalStatuses();
    if (userData?.type === 'user') {
      getSamity();
    }
  }, []);
  useEffect(
    () => {
      getAllDesignation();
    },
    [
      // userData?.type === "user"
      //   ? state.employeeInfo.samityId?.id
      //   : state.employeeInfo.samityId,
    ],
  );
  const config = localStorageData('config');

  const setEmployeeInfoInEditMode = () => {
    if (employeeInfo) {
      dispatch({ type: 'setEmployeeInfo', value: employeeInfo });
    }
  };
  const setImageDocumentInEditdMode = () => {
    if (imageDocument) {
      dispatch({ type: 'setImageDocument', value: imageDocument });
    }
  };
  const setSignatureDocumentInEditMode = () => {
    if (signatureDocument) {
      dispatch({ type: 'setSignatureDocument', value: signatureDocument });
    }
  };
  // const getSamityData = async () => {
  //   const getData = await axios.get(getSamityDataByUser, config);
  //   dispatch({
  //     type: "apiValues",
  //     apivalueName: "allSamityData",
  //     value: getData.data.data,
  //   });
  // };
  const getMaritalStatuses = async () => {
    try {
      const maritalStatusData = await axios.get(maritalStatusApiUrl, config);

      dispatch({
        type: 'apiValues',
        apivalueName: 'maritalStatuses',
        value: maritalStatusData.data.data,
      });
    } catch (error) {
      'error', error;
      errorHandler(error);
    }
  };
  const getEducationalQualifications = async () => {
    try {
      const educationalQualificationsData = await axios.get(educationalQualifications, config);
      dispatch({
        type: 'apiValues',
        apivalueName: 'educationalQualifications',
        value: educationalQualificationsData.data.data,
      });
    } catch (error) {
      errorHandler(error);
    }
  };
  const getReligions = async () => {
    try {
      const educationalQualificationsData = await axios.get(religion, config);
      dispatch({
        type: 'apiValues',
        apivalueName: 'religions',
        value: educationalQualificationsData.data.data,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const checkMandatoryField = () => {
    let flag = true;
    let newObj = {};
    var a = moment(new Date());
    var b = moment(state.employeeInfo.dob);
    const difference = a.diff(b, 'years');

    if (state.employeeInfo.samityId === '') {
      flag = false;
      newObj.samityIdError = 'সমিতি নির্বাচন করুন';
    }
    if (state.employeeInfo.employeeId === '') {
      flag = false;
      newObj.employeeIdError = 'কর্মকর্তা অথবা কর্মচারীর আইডি প্রদান করুন';
    }
    if (state.employeeInfo.nid) {
      if (
        state.employeeInfo.nid.length !== 10 &&
        state.employeeInfo.nid.length !== 13 &&
        state.employeeInfo.nid.length !== 17
      ) {
        flag = false;
        newObj.nidError = 'এনআইডি নাম্বার ১০, ১৩ অথবা ১৭ ডিজিটের হতে হবে';
      }
    }

    if (state.employeeInfo.brn) {
      if (state.employeeInfo.brn.length !== 17) {
        flag = false;
        newObj.brnError = 'জন্ম নিবন্ধন নম্বর ১৭ ডিজিটের হতে হবে';
      }
    }
    if (!state.employeeInfo.nid) {
      if (!state.employeeInfo.brn) {
        flag = false;
        newObj.brnError = 'জন্ম নিবন্ধন নম্বর প্রদান করুন';
      }
    }
    if (!state.employeeInfo.brn) {
      if (!state.employeeInfo.nid) {
        flag = false;
        newObj.nidError = 'এনআইডি নাম্বার প্রদান করুন';
      }
    }
    if (difference < 18) {
      flag = false;
      newObj.dobError = 'কর্মকর্তার বয়স ১৮ বছরের বেশি হতে হবে';
    } else if (state.employeeInfo.dob === null) {
      flag = false;
      newObj.dobError = 'কর্মকর্তা কর্মচারীর বয়স প্রদান করুন';
    }
    if (state.employeeInfo.name === '') {
      flag = false;
      newObj.nameError = 'কর্মকর্তা কর্মচারীর নাম প্রদান করুন';
    }
    if (state.employeeInfo.fatherName === '') {
      flag = false;
      newObj.fatherNameError = 'পিতার নাম প্রদান করুন';
    }
    if (state.employeeInfo.maritalStatusId === '') {
      flag = false;
      newObj.maritalStatusIdError = 'বৈবাহিক অবস্থা নির্বাচন করুন';
    }
    if (state.employeeInfo.educationalQualification === '') {
      flag = false;
      newObj.educationalQualificationError = 'শিক্ষাগত যোগ্যতা নির্বাচন করুন';
    }
    if (state.employeeInfo.designationId === '') {
      flag = false;
      newObj.designationIdError = 'পদবী নির্বাচন করুন';
    }
    if (state.employeeInfo.religion === '') {
      flag = false;
      newObj.religionError = 'ধর্ম নির্বাচন করুন';
    }
    // if (state.employeeInfo.gender === '') {
    // }
    if (state.employeeInfo.status === '') {
      flag = false;
      newObj.statusError = 'কর্মকর্তার স্টেটাস নির্বাচন করুন';
    }
    if (state.employeeInfo.presentAddress === '') {
      flag = false;
      newObj.presentAddressError = 'বর্তমান ঠিকানা প্রদান করুন ';
    }
    if (!state.employeeInfo.brn && !state.employeeInfo.nid) {
      if (state.employeeInfo.nid === '') {
        flag = false;
        newObj.nidError = 'এনআইডি নাম্বার প্রদান করুন';
      } else if (state.employeeInfo.brn === '') {
        flag = false;
        newObj.brnError = 'জন্ম নিবন্ধন নাম্বার প্রদান করুন';
      }
    }
    if (!state.employeeInfo.nid && !state.employeeInfo.brn) {
      flag = false;
      newObj.nidError = 'এনআইডি নাম্বার প্রদান করুন';
      newObj.brnError = 'অথবা জন্ম নিবন্ধন নম্বর প্রদান করুন';
    }

    setTimeout(() => {
      dispatch({ type: 'setAllFormError', value: newObj });
    }, 1);

    return flag;
  };

  const buildSignatureAndImageObject = (doc, type) => {
    // let docObject = {};
    if (!state.update) {
      let docObject = {};
      docObject.documentPictureFront = doc.documentPictureFront ? doc.documentPictureFront : '';
      docObject.documentPictureFrontName = doc.documentPictureFrontName ? doc.documentPictureFrontName : '';
      docObject.documentPictureFrontType = doc.documentPictureFrontType ? doc.documentPictureFrontType : '';
      docObject.documentPictureFrontFile = doc.documentPictureFrontFile ? doc.documentPictureFrontFile : '';
      return docObject;
    }
    if (state.update) {
      if (type === 'imgDoc') {
        if (imageDocument.documentPictureFrontName !== state.employeeInfo.imageDocuments.documentPictureFrontName) {
          let docObject = {};
          docObject.oldFileName = imageDocument.fileName;
          docObject.documentPictureFrontName = doc.documentPictureFrontName;
          docObject.documentPictureFrontType = doc.documentPictureFrontType;
          docObject.documentPictureFront = state.employeeInfo.imageDocuments.documentPictureFront;
          return docObject;
        }
      }
      if (type === 'sigDoc') {
        if (
          signatureDocument.documentPictureFrontName !== state.employeeInfo.signatureDocuments.documentPictureFrontName
        ) {
          let docObject = {};
          docObject.oldFileName = imageDocument.fileName;
          docObject.documentPictureFrontName = signatureDocument.documentPictureFrontName;
          docObject.documentPictureFrontType = signatureDocument.documentPictureFrontType;
          docObject.documentPictureFront = state.employeeInfo.signatureDocuments.documentPictureFront;
          return docObject;
        }
      }
      let docObject = {};
      docObject.fileName = type === 'imgDoc' ? imageDocument.fileName : signatureDocument.fileName;
      docObject.documentPictureFrontName =
        type === 'imgDoc' ? imageDocument.documentPictureFrontName : signatureDocument.documentPictureFrontName;
      docObject.documentPictureFrontType =
        type === 'imgDoc' ? imageDocument.documentPictureFrontType : signatureDocument.documentPictureFrontType;
      docObject.documentPictureFront =
        type === 'imgDoc' ? imageDocument.documentPictureFront : signatureDocument.documentPictureFront;
      return docObject;
    }
  };

  const onSumbitData = async () => {
    const mandatory = checkMandatoryField();
    if (mandatory) {
      // const samId = state.employeeInfo.samityId;
      let payload = {
        serviceId: 8,
        serviceName: 'employee-information',
        samityId: userData.type === 'user' ? state.employeeInfo.samityId.id : state.employeeInfo.samityId,
        // nextAppDesignationId: 4217,

        data: {
          employeeInfo: {
            samityId: state.employeeInfo.samityId,
            employee_id: state.employeeInfo.employeeId,
            ...(state.employeeInfo.nid && { nid: state.employeeInfo.nid }),

            ...(state.employeeInfo.brn && { brn: state.employeeInfo.brn }),

            dob: state.employeeInfo.dob,
            name: state.employeeInfo.name,
            fatherName: state.employeeInfo.fatherName,
            motherName: state.employeeInfo.motherName,
            maritalStatusId: state.employeeInfo.maritalStatusId,
            spouse_name: state.employeeInfo.spouseName,
            educationalQualification: state.employeeInfo.educationalQualification,
            present_address: state.employeeInfo.presentAddress,
            permanent_address: state.employeeInfo.permanentAddress,
            designation_id: state.employeeInfo.designationId,
            ranking: state.employeeInfo.ranking,
            status: state.employeeInfo.status,
            religion: state.employeeInfo.religion,
            gender: 2,
            experience: state.employeeInfo.experience,
            basic_salary: state.employeeInfo.basic_salary,
            gross_salary: state.employeeInfo.gross_salary,
          },
          imageDocument: buildSignatureAndImageObject(state.employeeInfo.imageDocuments, 'imgDoc'),
          signatureDocument: buildSignatureAndImageObject(state.employeeInfo.signatureDocuments, 'sigDoc'),
        },
      };

      try {
        if (!state.update) {
          const employeeEntryData = await axios.post(EmployeeEntrySubmitApi, payload, config);
          NotificationManager.success(employeeEntryData.data.message, '', 5000);
          dispatch({ type: 'clearState' });
          return;
        } else {
          const employeeEntryData = await axios.put(employeeUpdateApiUrl + samityId, payload, config);
          NotificationManager.success(employeeEntryData?.data?.message, '', 5000);
          dispatch({ type: 'clearState' });
          return;
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const localeMap = {
    bn: bnLocale,
  };

  // const maskMap = {
  //   bn: '__/__/____',
  // };
  const [locale] = useState('bn');

  const fileSelecthandler = (event, type) => {
    let documentObject;
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);

        if (typeStatus.showAble && base64Image) {
          const docObj = {
            documentPictureFrontName: event.target.files[0].name,
            documentPictureFront: base64Image,
            documentPictureFrontType: file.type,
            documentPictureFrontFile: event.target.files[0],
          };

          documentObject = docObj;
          documentObject;
          if (type === 'signature') {
            dispatch({
              type: 'employeeInfo',
              fieldName: 'signatureDocuments',
              value: documentObject,
            });
            // dispatch({ type: "signatureDocuments", value: documentObject });
          } else {
            dispatch({
              type: 'employeeInfo',
              fieldName: 'imageDocuments',
              value: documentObject,
            });
          }
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not showable') {
          if (file.name.includes('.pdf') || file.name.includes('.xlsx') || file.name.includes('.csv')) {
            NotificationManager.error('শুধুমাত্র পিএনজি জেপিজি ফাইল প্রদান করুন');
          }
          const docObj = {
            documentPictureFrontName: file.name,
            documentPictureFront: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: event.target.files[0],
          };
          documentObject = docObj;
          dispatch({
            type: 'employeeInfo',
            fieldName: 'imageDocuments',
            value: documentObject,
          });
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not supportesd') {
          const docObj = {
            documentPictureFrontName: 'Invalid File Type',
            documentPictureFront: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
          };
          documentObject = docObj;
          dispatch({
            type: 'employeeInfo',
            fieldName: 'imageDocuments',
            value: documentObject,
          });
        } else if (!typeStatus.showAble && !base64Image) {
          const docObj = {
            documentPictureFrontName: 'File Type is not Supported',
            documentPictureFront: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
          };
          documentObject = docObj;
          if (type === 'signature') {
            dispatch({
              type: 'employeeInfo',
              fieldName: 'signatureDocuments',
              value: documentObject,
            });
          } else {
            dispatch({
              type: 'employeeInfo',
              fieldName: 'imageDocuments',
              value: documentObject,
            });
          }
        }
      };

      reader.onerror = () => {
        NotificationManager.error('File can not be read', 'Error', 5000);
      };
    }
  };

  return (
    <>
      <Grid container spacing={2.5} className="section">
        <Grid item md={4} lg={4} xl={12} xs={12}>
          {userData?.type === 'citizen' ? (
            <TextField
              fullWidth
              name="samityId"
              size="small"
              style={{ backgroundColor: '#FFF', margin: '5dp' }}
              value={localData?.samityName}
              disabled={true}
            />
          ) : (
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="samityId"
              onChange={(event, value) => {
                if (value) {
                  dispatch({
                    type: 'employeeInfo',
                    fieldName: 'samityId',
                    value: value,
                  });
                }
              }}
              options={allSamity.map((option) => {
                return {
                  id: option.id,
                  label: option.samityName,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={state.employeeInfo.samityId === '' ? RequiredFile('সমিতি নির্বাচন করুন') : 'সমিতি'}
                  onFocus={() => {
                    if (state.employeeInfo.samityName === '') {
                      dispatch({
                        type: 'employeeInfo',
                        fieldName: 'samityId',
                        value: null,
                      });
                    }
                  }}
                  onBlur={() => {
                    if (state.employeeInfo.samityName === null) {
                      dispatch({
                        type: 'employeeInfo',
                        fieldName: 'samityId',
                        value: '',
                      });
                    }
                  }}
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  error={!state.employeeInfo.samityId && Boolean(state.formErrors.samityIdError)}
                  helperText={!state.employeeInfo.samityId && state.formErrors.samityIdError}
                />
              )}
              value={state.employeeInfo.samityId}
            />
          )}
          {/* <span style={{ color: "red" }}>
            {!state.employeeInfo.samityId && state.formErrors.samityIdError}
          </span> */}
        </Grid>
        <Grid item sm={12} md={4} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('কর্মকর্তার আইডি')}
            name="employeeId"
            variant="outlined"
            value={state.employeeInfo.employeeId}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: 'employeeId',
                value: e.target.value,
              });
              // dispatch({ type: "employeeIdError", value: e.target.value });
            }}
            size="small"
            error={!state.employeeInfo.employeeId && state.formErrors.employeeIdError ? true : false}
            helperText={!state.employeeInfo.employeeId && state.formErrors.employeeIdError}
          ></TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('এনআইডি')}
            name="nid"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.nid}
            error={Boolean(
              state.employeeInfo.nid &&
                state.employeeInfo.nid.length !== 10 &&
                state.employeeInfo.nid.length !== 13 &&
                state.employeeInfo.nid.length !== 17,
            )}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
              dispatch({ type: 'nidError', value: e.target.value });
            }}
          ></TextField>
          <span style={{ color: 'red' }}>
            {state.employeeInfo.nid.length !== 10 &&
              state.employeeInfo.nid.length !== 13 &&
              state.employeeInfo.nid.length !== 17 &&
              state.formErrors.nidError}
          </span>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('জন্ম নিবন্ধন')}
            name="brn"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.brn}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
              dispatch({ type: 'brnError', value: e.target.value });
            }}
          ></TextField>
          <span style={{ color: 'red' }}>
            {!state.employeeInfo.brn || (!state.employeeInfo.brn.length !== 17 && state.formErrors.brnError)}
          </span>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
            <DatePicker
              name="dob"
              // mask={maskMap[bnLocale]}
              label={RequiredFile('জন্ম তারিখ')}
              // placeholder="01/01/2022"
              inputFormat="dd-MM-yyyy"
              value={state.employeeInfo.dob}
              onChange={(date) => {
                dispatch({
                  type: 'employeeInfo',
                  fieldName: 'dob',
                  value: new Date(date),
                });
                dispatch({ type: 'dobError', value: new Date(date) });
                // setDate(d);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" style={{ backgroundColor: '#FFF' }} />
              )}
              disableFuture={true}
            />
          </LocalizationProvider>
          <span style={{ color: 'red' }}>{state.formErrors.dobError && state.formErrors.dobError}</span>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('নাম')}
            name="name"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.name}
            error={Boolean(!state.employeeInfo.name && state.formErrors.nameError)}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
              // dispatch({ type: "nameError", value: e.target.value });
            }}
          ></TextField>
          <span style={{ color: 'red' }}>{!state.employeeInfo.name && state.formErrors.nameError}</span>
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('পিতার নাম')}
            name="fatherName"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.fatherName}
            error={Boolean(!state.employeeInfo.fatherName && state.formErrors.fatherNameError)}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
          ></TextField>
          <span style={{ color: 'red' }}>{!state.employeeInfo.fatherName && state.formErrors.fatherNameError}</span>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={'মাতার নাম'}
            name="motherName"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.motherName}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
          ></TextField>
        </Grid>

        <Grid item md={4} lg={4} xl={12} xs={12}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="maritalStatusId"
            onChange={(event, value) => {
              if (value) {
                dispatch({
                  type: 'employeeInfo',
                  fieldName: 'maritalStatusId',
                  value: value,
                });
              }
            }}
            options={state.apivalues?.maritalStatuses.map((option) => {
              return {
                id: option.id,
                label: option.displayValue,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={state.employeeInfo.maritalStatusId === '' ? 'বৈবাহিক অবস্থা নির্বাচন করুন' : 'বৈবাহিক অবস্থা '}
                onFocus={() => {
                  if (state.employeeInfo.maritalStatusId === '') {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'maritalStatusId',
                      value: null,
                    });
                  }
                }}
                onBlur={() => {
                  if (state.employeeInfo.maritalStatusId === null) {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'maritalStatusId',
                      value: '',
                    });
                  }
                }}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF', margin: '5dp' }}
                error={!state.employeeInfo.maritalStatusId && Boolean(state.formErrors.maritalStatusIdError)}
                helperText={!state.employeeInfo.maritalStatusId && state.formErrors.maritalStatusIdError}
              />
            )}
            value={state.employeeInfo.maritalStatusId}
          />
          {/* <span style={{ color: "red" }}>
            {!state.employeeInfo.maritalStatusId &&
              state.formErrors.maritalStatusIdError}
          </span> */}
        </Grid>
        {state.employeeInfo.maritalStatusId?.label === 'বিবাহিত' && (
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <TextField
              fullWidth
              label={RequiredFile('স্বামী/ স্ত্রীর নাম')}
              name="spouseName"
              variant="outlined"
              size="small"
              type="text"
              value={state.employeeInfo.spouseName}
              onChange={(e) => {
                dispatch({
                  type: 'employeeInfo',
                  fieldName: e.target.name,
                  value: e.target.value,
                });
              }}
            ></TextField>
          </Grid>
        )}

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="educationalQualification"
            value={state.employeeInfo.educationalQualification}
            onChange={(event, value) => {
              if (value) {
                dispatch({
                  type: 'employeeInfo',
                  fieldName: 'educationalQualification',
                  value: value,
                });
              }
            }}
            options={state.apivalues.educationalQualifications.map((option) => {
              return {
                id: option.id,
                label: option.displayValue,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={
                  state.employeeInfo.educationalQualification === ''
                    ? 'শিক্ষাগত যোগ্যতা নির্বাচন করুন'
                    : 'শিক্ষাগত যোগ্যতা'
                }
                onFocus={() => {
                  if (state.employeeInfo.educationalQualification === '') {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'educationalQualification',
                      value: null,
                    });
                  }
                }}
                onBlur={() => {
                  if (state.employeeInfo.educationalQualification === null) {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'educationalQualification',
                      value: '',
                    });
                  }
                }}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF', margin: '5dp' }}
                error={Boolean(
                  !state.employeeInfo.educationalQualification && state.formErrors.educationalQualificationError,
                )}
              />
            )}
          />
          <span style={{ color: 'red' }}>
            {!state.employeeInfo.educationalQualification && state.formErrors.educationalQualificationError}
          </span>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="designationId"
            value={state.employeeInfo.designationId}
            onChange={(event, value) => {
              if (value) {
                dispatch({
                  type: 'employeeInfo',
                  fieldName: 'designationId',
                  value: value,
                });
                dispatch({
                  type: 'employeeInfo',
                  fieldName: 'ranking',
                  value: value.id,
                });
              }
            }}
            options={allDesignation.map((option) => {
              return {
                id: option.id,
                label: option.designationName,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={
                  state.employeeInfo.designationId === '' ? RequiredFile('পদবী নির্বাচন করুন') : RequiredFile('পদবী')
                }
                onFocus={() => {
                  if (state.employeeInfo.designationId === '') {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'designationId',
                      value: null,
                    });
                  }
                }}
                onBlur={() => {
                  if (state.employeeInfo.designation_id === null) {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'designationId',
                      value: '',
                    });
                  }
                }}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF', margin: '5dp' }}
                error={Boolean(!state.employeeInfo.designationId && state.formErrors.designationIdError)}
              />
            )}
          />
          <span style={{ color: 'red' }}>
            {!state.employeeInfo.designationId && state.formErrors.designationIdError}
          </span>
        </Grid>

        {/* <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={"পদবী"}
            name="designation_id"
            required
            select
            value={state.employeeInfo.designation_id}
            SelectProps={{ native: true }}
            variant="outlined"
            size="small"
          >
            <option>- নির্বাচন করুন -</option>
          </TextField>
          <span style={{ color: "red" }}>
            {state.formErrors.designationIdError}
          </span>
        </Grid> */}
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            disabled
            fullWidth
            label={RequiredFile('পদমর্যাদাক্রম')}
            name="ranking"
            variant="outlined"
            size="small"
            type="number"
            value={state.employeeInfo.ranking}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: 'ranking',
                value: e.target.value,
              });
            }}
          ></TextField>
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('মূল বেতন')}
            name="basic_salary"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.basic_salary}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
          ></TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('মোট বেতন')}
            name="gross_salary"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.gross_salary}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
          ></TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="religion"
            value={state.employeeInfo.religion}
            onChange={(event, value) => {
              if (value) {
                dispatch({
                  type: 'employeeInfo',
                  fieldName: 'religion',
                  value: value,
                });
              }
            }}
            options={state.apivalues.religions.map((option) => {
              return {
                id: option.id,
                label: option.displayValue,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={state.employeeInfo.religion === '' ? 'ধর্ম নির্বাচন করুন' : 'ধর্ম '}
                onFocus={() => {
                  if (state.employeeInfo.religion === '') {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'religion',
                      value: null,
                    });
                  }
                }}
                onBlur={() => {
                  if (state.employeeInfo.religion === null) {
                    dispatch({
                      type: 'employeeInfo',
                      fieldName: 'religion',
                      value: '',
                    });
                  }
                }}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF', margin: '5dp' }}
                error={Boolean(!state.employeeInfo.religion && state.formErrors.religionError)}
              />
            )}
          />
          <span style={{ color: 'red' }}>{!state.employeeInfo.religion && state.formErrors.religionError}</span>
        </Grid>

        {inputRadioGroup(
          'gender',
          (e) => {
            dispatch({
              type: 'employeeInfo',
              fieldName: 'gender',
              value: e.target.value,
            });
          },
          state.employeeInfo.gender,
          [
            {
              value: 1,
              color: '#007bff',
              rcolor: 'primary',
              label: 'পুরুষ',
            },
            {
              value: 2,
              color: '#FFBF00',
              rColor: 'warning',
              label: 'মহিলা',
            },
            {
              value: 3,
              color: '#28a745',
              rColor: 'success',
              label: 'অন্যান্য ',
            },
          ],
          4,
          4,
          12,
          12,
          false,
        )}

        {inputRadioGroup(
          'status',
          (e) => {
            dispatch({
              type: 'employeeInfo',
              fieldName: 'status',
              value: e.target.value,
            });
          },
          state.employeeInfo.status,
          [
            {
              value: 'A',
              color: '#007bff',
              rcolor: 'primary',
              label: 'সক্রিয়',
            },
            {
              value: 'I',
              color: '#FFBF00',
              rColor: 'warning',
              label: 'নিষ্ক্রিয়',
            },
          ],
          4,
          4,
          12,
          12,
          false,
        )}
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('অভিজ্ঞতা')}
            name="experience"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.experience}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
          ></TextField>
        </Grid>

        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('বর্তমান ঠিকানা')}
            name="presentAddress"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.presentAddress}
            error={Boolean(!state.employeeInfo.presentAddress && state.formErrors.presentAddressError)}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
          ></TextField>
          <span style={{ color: 'red' }}>
            {!state.employeeInfo.presentAddress && state.formErrors.presentAddressError}
          </span>
        </Grid>

        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            fullWidth
            label={'স্থায়ী ঠিকানা'}
            name="permanentAddress"
            variant="outlined"
            size="small"
            type="text"
            value={state.employeeInfo.permanentAddress}
            onChange={(e) => {
              dispatch({
                type: 'employeeInfo',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
          ></TextField>
        </Grid>

        <Grid item sm={12} md={6}>
          <Grid container sx={{ marginTop: '20px' }}>
            <SubHeading>কর্মকর্তা/কর্মচারীর ছবি সংযুক্ত করুন</SubHeading>
          </Grid>
          <Paper sx={{ padding: '40px' }}>
            <Grid container spacing={2.5} direction="column" justifyContent="center" alignItems="center">
              <SingleImageContentd
                md={12}
                lg={12}
                xs={12}
                sm={12}
                onFileSelectHandler={(e) => {
                  fileSelecthandler(e, 'imageDoc');
                }}
                docObj={state.employeeInfo.imageDocuments}
              />
            </Grid>
          </Paper>
        </Grid>
        <Grid item sm={12} md={6}>
          <Grid container sx={{ marginTop: '20px' }}>
            <SubHeading>কর্মকর্তা/কর্মচারীর সাক্ষর সংযুক্ত করুন</SubHeading>
          </Grid>

          <Paper sx={{ padding: '40px' }}>
            <Grid container spacing={2.5} direction="column" justifyContent="center" alignItems="center">
              <SingleImageContentd
                md={12}
                lg={12}
                xs={12}
                sm={12}
                onFileSelectHandler={(e) => {
                  fileSelecthandler(e, 'signature');
                }}
                docObj={state.employeeInfo.signatureDocuments}
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Divider />
      <Grid container className="btn-container">
        {state.update ? (
          <>
            <Tooltip title="হালনাগাদ করুন">
              <Button className="btn btn-save" onClick={onSumbitData} startIcon={<SaveOutlinedIcon />}>
                {' '}
                হালনাগাদ করুন
              </Button>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="সংরক্ষন করুন">
            <Button className="btn btn-save" onClick={onSumbitData} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সংরক্ষন করুন
            </Button>
          </Tooltip>
        )}
      </Grid>
    </>
  );
};
export default EmployeeInformation;
