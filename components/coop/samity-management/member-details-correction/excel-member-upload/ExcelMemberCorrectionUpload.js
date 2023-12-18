import DownloadIcon from '@mui/icons-material/Download';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/system';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Fragment, useCallback, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from 'service/numberConverter';
import _ from 'underscore';
import { read, utils, writeFileXLSX } from 'xlsx';
import { InsertMemCorrectionData } from '../../../../../url/coop/ApiList';

const Input = styled('input')({
  display: 'none',
});

const ExcelMemberCorrectionUpload = ({
  closeExcel,
  educationValue,
  jobType,
  maritalStatus,
  religion,
  genderType,
  getCorrectionMemData,
  maxMemberCode,
  getsamityInfo,
}) => {
  const {
    id,
    samityDistrictId,
    samityUpaCityId,
    samityUpaCityType,
    samityUniThanaPawId,
    samityUniThanaPawType,
    samityDetailsAddress,
    isManual,
  } = getsamityInfo;
  const config = localStorageData('config');
  const [pres, setPres] = useState([]);
  const [loadData, setLoadData] = useState(false);
  const [uploadButtonHide, setUploadButtonHide] = useState(true);
  const [sendButton, setSendButton] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  //////////////////////////////// Excel file upload section //////////////////////////////
  const columns = [
    {
      headerName: 'মেম্বার কোড',
      filterable: true,
      field: 'memberCode',
      width: 100,
      // renderCell: (index) => index.api.getRowIndex(index.row.memberCode),
      editable: true,
      dataType: 'number',
      format: 'number',
    },
    {
      headerName: 'এনআইডি',
      field: 'nid',
      width: 170,
      editable: true,
      dataType: 'number',
      format: 'number',
    },
    {
      headerName: 'জন্ম নিবন্ধন',
      field: 'brn',
      width: 170,
      editable: true,
      dataType: 'number',
      format: 'number',
    },
    {
      headerName: 'জন্মতারিখ',
      field: 'dob',
      width: 130,
      editable: true,
      type: 'date',
      valueFormatter: (params) => {
        // params.value contains the date value
        if (params.value) {
          const date = new Date(params.value);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
        return '';
      },
    },
    {
      headerName: 'নাম (ইংরেজিতে)',
      field: 'memberName',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'নাম (বাংলায়)',
      field: 'memberNameBangla',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'পিতার নাম',
      field: 'fatherName',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'মাতার নাম',
      field: 'motherName',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'মোবাইল নং',
      field: 'mobile',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'সদস্য ভর্তির তারিখ',
      field: 'memberAdmissionDate',
      width: 130,
      editable: true,
      type: 'date',
      valueFormatter: (params) => {
        // params.value contains the date value
        if (params.value) {
          const date = new Date(params.value);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
        return '';
      },
    },
    {
      headerName: 'ই-মেইল',
      field: 'email',
      width: 130,
      editable: true,
      type: 'email',
    },
    {
      headerName: 'লিঙ্গ',
      field: 'genderId',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: () => {
        return genderType.map((f) => {
          return {
            label: f.displayValue,
            value: f.id,
          };
        });
      },
      valueFormatter: (params) => {
        if (params.value) {
          const data = genderType.find((f) => f.id == params.value);
          return data ? data.displayValue : '';
        }
      },
    },
    {
      headerName: 'শিক্ষাগত যোগ্যতা',
      field: 'educationLevelId',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: () => {
        return educationValue.map((f) => {
          return {
            label: f.displayValue,
            value: f.id,
          };
        });
      },
      valueFormatter: (params) => {
        if (params.value) {
          const data = educationValue.find((f) => f.id == params.value);
          return data ? data.displayValue : '';
        }
      },
    },
    {
      headerName: 'পেশা',
      field: 'occupationId',
      width: 130,
      editable: true,
      type: 'singleSelect',

      valueOptions: () => {
        return jobType.map((f) => {
          return {
            label: f.displayValue,
            value: f.id,
          };
        });
      },
      valueFormatter: (params) => {
        if (params.value) {
          const data = jobType.find((f) => f.id == params.value);
          return data ? data.displayValue : '';
        }
      },
    },
    {
      headerName: 'বৈবাহিক অবস্থা',
      field: 'maritalStatusId',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: () => {
        return maritalStatus.map((f) => {
          return {
            label: f.displayValue,
            value: f.id,
          };
        });
      },
      valueFormatter: (params) => {
        if (params.value) {
          const data = maritalStatus.find((f) => f.id == params.value);
          return data ? data.displayValue : '';
        }
      },
    },
    {
      headerName: 'স্বামী/স্ত্রীর নাম',
      field: 'spouseName',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'ধর্ম',
      field: 'religionId',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: () => {
        return religion.map((f) => {
          return {
            label: f.displayValue,
            value: f.id,
          };
        });
      },
      valueFormatter: (params) => {
        if (params.value) {
          const data = religion.find((f) => f.id == params.value);
          return data ? data.displayValue : '';
        }
      },
    },
    {
      headerName: 'শেয়ার জমা',
      field: 'shareAmount',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'সঞ্চয় জমা',
      field: 'savingsAmount',
      width: 130,
      editable: true,
      type: 'string',
    },
    {
      headerName: 'ঋণ ব্যালেন্স',
      field: 'loanOutstanding',
      width: 130,
      editable: true,
      type: 'string',
    },
  ];

  const processId = (data, value) => {
    const process = data.find((row) => row?.displayValue == value);
    return process?.id ? process?.id : '';
  };

  const headerMapping = {
    'এন আই ডি': 'nid',
    'জন্ম-নিবন্ধন': 'brn',
    'জন্ম তারিখ': 'dob',
    নাম: 'memberName',
    'নাম(বাংলায়)': 'memberNameBangla',
    'পিতার নাম': 'fatherName',
    'মাতার নাম': 'motherName',
    মোবাইল: 'mobile',
    'সদস্য ভর্তির তারিখ': 'memberAdmissionDate',
    ইমেইল: 'email',
    লিঙ্গ: 'genderId',
    'শিক্ষাগত যোগ্যতা': 'educationLevelId',
    পেশা: 'occupationId',
    'বৈবাহিক অবস্থা': 'maritalStatusId',
    'স্বামী/স্ত্রীর নাম': 'spouseName',
    ধর্ম: 'religionId',
    'শেয়ার জমা': 'shareAmount',
    'সঞ্চয় জমা': 'savingsAmount',
    'ঋণ ব্যালেন্স': 'loanOutstanding',
  };

  const excelSerialNumberToDate = (serialNumber) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const offsetDays = serialNumber;
    const date = new Date(excelEpoch.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    return date;
  };

  const excelUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      var file = e.target.files[0];
      if (file.name.includes('.xlsx')) {
        setLoadData(true);
        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
          let wb = read(data); // parse the array buffer
          let ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
          let getData = utils.sheet_to_json(ws); // generate objects
          // ***************** set bangla name to english key name ***********************
          const Finaldata = getData.map((item) => {
            const newItem = {};
            for (const [key, value] of Object.entries(item)) {
              if (key in headerMapping) {
                newItem[headerMapping[key]] = value;
              } else {
                newItem[key] = value;
              }
            }
            return newItem;
          });
          //*********************  set  final  data  on  a  new  state  **************************
          Finaldata?.map((element, index) => {
            element.id = index + 1;
            element.nid = element.nid ? bangToEng(element.nid) : null;
            element.brn = element.brn ? bangToEng(element.brn) : null;
            element.dob = element.dob && excelSerialNumberToDate(element.dob);
            element.memberName = element.memberName && element.memberName;
            element.memberNameBangla = element.memberNameBangla && element.memberNameBangla;
            element.fatherName = element.fatherName && element.fatherName;
            element.motherName = element.motherName && element.motherName;
            element.mobile = element.mobile && bangToEng(element.mobile);
            element.memberAdmissionDate =
              element.memberAdmissionDate && excelSerialNumberToDate(element.memberAdmissionDate);
            element.shareAmount = element.shareAmount && bangToEng(element.shareAmount);
            element.savingsAmount = element.savingsAmount && bangToEng(element.savingsAmount);
            element.loanOutstanding = element.loanOutstanding && bangToEng(element.loanOutstanding);
            element.email = element.email ? element.email : '';
            element.memberCode = maxMemberCode + (index + 1);
            element.spouseName = element.spouseName ? element.spouseName : '';
            element.genderId = processId(genderType, element.genderId);
            element.educationLevelId = processId(educationValue, element.educationLevelId);
            element.occupationId = processId(jobType, element.occupationId);
            element.maritalStatusId = processId(maritalStatus, element.maritalStatusId);
            element.religionId = processId(religion, element.religionId);
            element.memberDataFrom = 'csv';
            element.actionFor = 'create';
            element.samityId = id;
            element.documents = [];
            element.permanentAddress = {
              samityId: id,
              addressType: 'PER',
              districtId: samityDistrictId,
              upaCityId: samityUpaCityId,
              upaCityType: samityUpaCityType,
              uniThanaPawId: samityUniThanaPawId,
              uniThanaPawType: samityUniThanaPawType,
              detailsAddress: samityDetailsAddress,
            };
            element.presentAddress = {
              samityId: id,
              addressType: 'PRE',
              districtId: samityDistrictId,
              upaCityId: samityUpaCityId,
              upaCityType: samityUpaCityType,
              uniThanaPawId: samityUniThanaPawId,
              uniThanaPawType: samityUniThanaPawType,
              detailsAddress: samityDetailsAddress,
            };
          });

          const newArray = Finaldata.filter((element) => {
            return element.nid || (element.brn && element);
          });

          const modifiedKeysArray = newArray.map((item) =>
            _.pick(item, [
              'nid',
              'brn',
              'dob',
              'memberName',
              'memberNameBangla',
              'fatherName',
              'motherName',
              'mobile',
              'memberAdmissionDate',
              'shareAmount',
              'savingsAmount',
              'loanOutstanding',
              'id',
              'email',
              'memberCode',
              'spouseName',
              'genderId',
              'educationLevelId',
              'occupationId',
              'maritalStatusId',
              'religionId',
              'memberDataFrom',
              'actionFor',
              'samityId',
              'documents',
              'permanentAddress',
              'presentAddress',
            ]),
          );

          setPres(modifiedKeysArray);
          setLoadData(false);
          setUploadButtonHide(false);
        };
        reader.readAsArrayBuffer(file);
        setSendButton(true);
      } else {
        setLoadData(false);
        setSendButton(false);
        NotificationManager.warning('XLSX এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ');
      }
    }
  };
  //////////////////////////////// Excel file upload section //////////////////////////////
  /////////////////////////// Data table row update start //////////////////////////////////
  const processRowUpdate = (newState) => {
    let data = [...pres];
    const oldDataIndex = data.findIndex((d) => d.id == newState.id);
    data[oldDataIndex] = newState;
    setPres(data);
    return newState;
  };
  ////////////////////////// Data Table row update End //////////////////////////////////////
  //////////////////////////////// on submit & Mandatory field check start //////////////////////////
  // const isMandatory = (data) => {
  //   const error = data
  //     .map((row) =>
  //       Object.keys(row).some((e, i, self) => {
  //         if (e == "nid") {
  //           if (self.includes("brn") && !row.brn) {
  //             return !row[e];
  //           }
  //         } else if (e == "brn") {
  //           if (self.includes("nid") && !row.nid) {
  //             return !row[e];
  //           }
  //         } else if (e == "dob") {
  //           if (e == "" || e == "Invalid date") {
  //             return !row[e];
  //           }
  //         } else if (e == "email") {
  //           if (e == "") {
  //             return !row[e];
  //           }
  //         } else if (e == "spouseName") {
  //           if (e == "") {
  //             return !row[e];
  //           }
  //         } else if (e == "shareAmount") {
  //           if (e == "") {
  //             return !row[e];
  //           }
  //         } else if (e == "savingsAmount") {
  //           if (e == "") {
  //             return !row[e];
  //           }
  //         } else if (e == "loanOutstanding") {
  //           if (e == "") {
  //             return !row[e];
  //           }
  //         } else {
  //           return !row[e];
  //         }
  //       })
  //     )
  //     .some((e) => {
  //       return e == true;
  //     });
  //   return error;
  // };

  const isMandatory = (data) => {
    const errorMessages = [];
    data.forEach((entry, index) => {
      if (!entry.brn && !entry.nid) {
        errorMessages.push(
          `মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))}  এন আই ডি অথবা জন্ম-নিবন্ধন যে কোন একটি দিতে হবে`,
        );
      }
      if (!entry.dob || entry.dob == 'Invalid date') {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর জন্ম তারিখ দিতে হবে`);
      }
      if (!entry.memberName) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর নাম দিতে হবে`);
      }
      if (!entry.memberNameBangla) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর নাম(বাংলায়) দিতে হবে`);
      }
      if (!entry.fatherName) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর পিতার নাম দিতে হবে`);
      }
      if (!entry.motherName) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর মাতার নাম দিতে হবে`);
      }
      if (!entry.mobile) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর মোবাইল নাম্বার দিতে হবে`);
      }
      if (!entry.genderId) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর লিঙ্গ নির্বাচন করুন`);
      }
      if (!entry.educationLevelId) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর শিক্ষাগত যোগ্যতা দিতে হবে`);
      }
      if (!entry.occupationId) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর পেশা দিতে হবে`);
      }
      if (!entry.maritalStatusId) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর বৈবাহিক অবস্থা দিতে হবে`);
      }
      if (!entry.religionId) {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর ধর্ম দিতে হবে`);
      }
      if (entry.memberAdmissionDate == 'Invalid date') {
        errorMessages.push(`মেম্বার কোড ${engToBang(maxMemberCode + (index + 1))} এর সদস্য ভর্তির তারিখ দিতে হবে`);
      }
    });

    if (errorMessages.length > 0) {
      // Handle error messages, for example:
      errorMessages.forEach((errorMessage) => {
        // console.error(errorMessage);
        NotificationManager.warning(errorMessage, '', 5000);
        return true;
      });
    } else {
      return false;
    }
  };

  const removeId = (data) => {
    const newData = cloneDeep(data);
    return _.map(newData, (obj) => {
      const newObj = _.omit(obj, 'id');
      // Format the "dob" property using the dateFormat function
      newObj.dob = dateFormat(newObj.dob) != 'Invalid date' ? dateFormat(newObj.dob) : newObj.dob; // Make sure dateFormat is a valid function
      return newObj;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let insertCorectionData;
    setIsSubmit(true);
    if (isMandatory(pres) == false) {
      try {
        if (getCorrectionMemData?.id) {
          const payload = {
            id: getCorrectionMemData?.id,
            doptorId: getCorrectionMemData?.doptorId,
            samityId: getCorrectionMemData?.samityId,
            data: {
              userId: getCorrectionMemData?.data.userId,
              userType: getCorrectionMemData?.data.userType,
              createdAt: getCorrectionMemData?.data?.createdAt,
              isManual,
              membersInfo: [...getCorrectionMemData?.data.membersInfo, ...removeId(pres)],
            },
            serviceName: 'member_information_correction',
            editEnable: true,
          };
          /////////////////////////// put request ///////////////////////////
          insertCorectionData = await axios.put(
            InsertMemCorrectionData + '/' + getCorrectionMemData.id,
            payload,
            config,
          );
          const message = 'সকল সদস্য আপলোডের, আবেদনটি সফলভাবে সংরক্ষন করা হয়েছে';
          NotificationManager.success(message, '', 5000);
          closeExcel();
        } else {
          const correctionPayload = {
            serviceName: 'member_information_correction',
            samityId: id,
            data: {
              membersInfo: removeId(pres),
            },
          };
          /////////////////////////////////////////// post request ////////////////////////////
          insertCorectionData = await axios.post(InsertMemCorrectionData, correctionPayload, config);
          closeExcel();
          NotificationManager.success(insertCorectionData.data.message, '', 5000);
          /////////////////////////////////////////// post request ///////////////////////////////
        }
        setIsSubmit(false);
      } catch (err) {
        setIsSubmit(false);
        errorHandler(err);
      }
    } else {
      setIsSubmit(false);
      // NotificationManager.warning("বাধ্যতামূলক তথ্য পূরণ করন।", "", 5000);
    }
  };
  //////////////////////////////////////// on submit end ////////////////////////////

  ////////////////////////////////////exportFile start////////////////////////////////
  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(pres);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, 'SheetJSReactAoO.xlsx');
  }, [pres]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        {/* <GridToolbarExport /> */}
      </GridToolbarContainer>
    );
  }
  /////////////////////////////////////// export File end ///////////////////////////////
  return (
    <Fragment>
      <Grid container mt={6} className="section">
        <div
          style={{
            color: '#004085',
            backgroundColor: '#cce5ff',
            borderColor: '#b8daff',
            marginBottom: '0',
            marginTop: '10px',
            padding: '10px',
            width: '100%',
          }}
        >
          <strong>ধাপে ধাপে কাজ করুন</strong>
          <p>১. এক্সেল ফাইলটি ডাউনলোড করুন এবং সঠিক ডেটা দিয়ে এটি পূরণ করুন</p>
          <p>২. কীভাবে ডেটা পূরণ করতে হবে তা বুঝতে আপনি উদাহরণ ফাইলটি ডাউনলোড করতে পারেন।</p>
          <p>
            ৩. একবার আপনি এক্সেল ফাইলটি ডাউনলোড এবং পূরণ করার পরে, এটি নীচের এক্সেল আপলোড করুন বাটন এ ক্লিক করে আপলোড
            করুন এবং জমা দিন।
          </p>
          <Button component="span" startIcon={<SaveAsIcon />} variant="outlined" sx={{ mt: '10px' }}>
            <a href="/excel/LiveMemberDetails.xlsx" download="LiveMemberDetails.xlsx">
              {' '}
              স্যাম্পল এক্সেল ডাউনলোড করুন
            </a>
          </Button>
        </div>
      </Grid>
      <Grid container mt={6} className="section">
        <Grid
          xs={12}
          item
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {isSubmit ? (
            <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
              জমা হচ্ছে...
            </LoadingButton>
          ) : (
            <Button
              component="span"
              startIcon={<SaveAsIcon />}
              variant="outlined"
              onClick={(e) => onSubmit(e)}
              sx={{ display: sendButton == false && 'none' }}
            >
              জমা দিন
            </Button>
          )}

          {uploadButtonHide ? (
            <Stack direction="row" alignItems="center">
              <label>
                <Input accept="any" multiple type="file" onChange={excelUpload} />
                <Button variant="contained" component="span" className="btn btn-primary" startIcon={<UploadFileIcon />}>
                  এক্সেল আপলোড করুন
                </Button>
              </label>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center">
              <Button
                variant="contained"
                component="span"
                startIcon={<DownloadIcon />}
                className={'btn btn-subscribed'}
                onClick={exportFile}
              >
                এক্সেল ডাউনলোড করুন
              </Button>
            </Stack>
          )}

          <Button
            variant="contained"
            component="span"
            className="btn btn-delete"
            startIcon={<UndoIcon />}
            onClick={() => closeExcel()}
          >
            বন্ধ করুন
          </Button>
        </Grid>
      </Grid>
      <div style={{ width: '100%' }}>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={pres}
            columns={columns}
            getRowId={(row) => row.memberCode}
            density="compact"
            loading={loadData}
            experimentalFeatures={{
              newEditingApi: true,
            }}
            initialState={{ pinnedColumns: { left: ['id'] } }}
            processRowUpdate={processRowUpdate}
            localeText={{
              toolbarColumns: 'কলাম ফিল্টার করুন',
              toolbarFilters: 'ফিল্টার করুন',
              toolbarDensity: 'টেবিলের আকার পরিবর্তন করুন',
              toolbarExport: 'এক্সপোর্ট করুন',
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ExcelMemberCorrectionUpload;
