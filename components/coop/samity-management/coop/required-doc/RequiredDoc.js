import EditIcon from '@mui/icons-material/Edit';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import { makeStyles } from '@mui/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-medium-image-zoom/dist/styles.css';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import { steperFun } from 'service/steper';
import ZoomImage from 'service/ZoomImage';
import ZoomSelectImage from 'service/ZoomSelectImage';
import { CoopRegApi, samityDocument, samityTypeData } from '../../../../../url/coop/ApiList';
const Input = styled('input')({
  display: 'none',
});

// const useStyles = makeStyles({
//   root: {
//     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//     border: 0,
//     borderRadius: 5,
//     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
//     color: 'white',
//     height: 150,
//     padding: '0 30px',
//   },
// });

const RequiredDoc = () => {
  const router = useRouter();
  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
  };
  const config = localStorageData('config');
  const getId = localStorageData('getSamityId');
  const samityLevel = localStorageData('samityLevel');
  ///////////////////////////////////////////////////////////////////////////////////
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [docType, setDocType] = useState([]);
  // const [allDocType, setAllDocType] = useState([]);
  const [reqDoc, setReqDoc] = useState({
    documentTypeId: '',
    docReferenceNo: '',
  });
  const [showDataInTable, setShowDataInTable] = useState([]);
  const [startingValidity, setStartingValidity] = useState(null);
  const [expiringValidity, setExpiringValidity] = useState(null);
  const handleDateChange = (date) => {
    setStartingValidity(new Date(date));
  };
  const handleDateChangeEx = (date) => {
    setExpiringValidity(new Date(date));
  };
  const [docimage, setDocimage] = useState({
    docimage: '',
    mimetype: '',
  });

  const [docName, setDocName] = useState('');
  const [docNameURL, setDocNameURL] = useState('');
  const [stepId, setStepId] = useState(0);

  useEffect(() => {
    checkPageValidation();
    DocumentType();
  }, []);

  useEffect(() => {
    setStepId(localStorage.getItem('stepId'));
  }, [stepId]);

  // let handleDeleteSubmit = (id) => {
  //   confirmAlert({
  //     title: 'Confirm to Delete',
  //     message: 'Are you sure to do this.',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => deleteData(id),
  //       },
  //       {
  //         label: 'No',
  //       },
  //     ],
  //   });
  // };
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  //method to handle data edit
  let onEdit = (id, documentId, documentNo, effectDate, expireDate, documentURL, documentName) => {
    setDocimage({
      docimage: '',
      mimetype: '',
    });
    setDocName('');
    const docNames = imageType(documentName);
    editDocumentType();
    setReqDoc({
      id: id,
      documentTypeId: documentId,
      docReferenceNo: documentNo,
      docNames,
    });
    setUpdate(true);
    setStartingValidity(effectDate);
    setExpiringValidity(expireDate);
    setDocNameURL(documentURL);
  };

  //Method for updating data
  let onUpdateData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let formData = new FormData();
    formData.append('samityId', getId);
    formData.append('documentId', reqDoc.documentTypeId);
    formData.append('documentNo', reqDoc.docReferenceNo);
    if (startingValidity) {
      formData.append('effectDate', dateFormat(startingValidity));
    }
    if (expiringValidity) {
      formData.append('expireDate', dateFormat(expiringValidity));
    }
    formData.append('documentName', docName);
    try {
      let userData = await axios.put(samityDocument + '/' + reqDoc.id, formData, config);
      NotificationManager.success(userData.data.message, '', 5000);
      setReqDoc({
        documentTypeId: 0,
        docReferenceNo: '',
      });
      setDocimage({
        docimage: '',
        mimetype: '',
      });
      setDocNameURL('');
      setDocName('');
      setStartingValidity(null);
      setExpiringValidity(null);
      setUpdate(false);
      setLoadingDataSaveUpdate(false);
      DocumentType();
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };
  // let deleteData = async (id) => {
  //   try {
  //     let showAcknowledge = await axios.delete(samity - document + '/' + id, config);
  //     let successfull = showAcknowledge.data.message;
  //     NotificationManager.success(successfull, '', 5000);
  //     DocumentType();
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // };

  const DocumentType = async () => {
    try {
      const showData = await axios.get(samityDocument + 'samityId=' + getId, config);
      const mainData = showData.data.data;
      setShowDataInTable(mainData);
      const showSamityInfo = await axios.get(CoopRegApi + '/' + getId, config);
      const samityTypeId = showSamityInfo.data.data.Samity[0].samityTypeId;

      if (samityTypeId) {
        const docTypeData = await axios.get(
          samityTypeData + 'samityType=' + samityTypeId + '&samityLevel=' + samityLevel,
          config,
        );
        const data = docTypeData.data.data;
        // setAllDocType(data);
        if (mainData) {
          const newArray = data.filter((row) => !mainData.map((elem) => elem.documentId).includes(row.docTypeId));
          setDocType(newArray);
        } else {
          setDocType(data);
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const editDocumentType = async () => {
    try {
      const showSamityInfo = await axios.get(CoopRegApi + '/' + getId, config);
      let samityTypeId = showSamityInfo.data.data.Samity[0].samityTypeId;
      if (samityTypeId) {
        let docTypeData = await axios.get(
          samityTypeData + 'samityType=' + samityTypeId + '&samityLevel=' + samityLevel,
          config,
        );
        const data = docTypeData.data.data;
        setDocType(data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  let imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // setSelectedImage(e.target.files[0]);
      let file = e.target.files[0];
      if (
        file.name.includes('.jpg') ||
        file.name.includes('.png') ||
        file.name.includes('.JPEG') ||
        file.name.includes('.pdf')
      ) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        setDocName(file);
        reader.onload = () => {
          let base64Image = btoa(reader.result);
          setDocimage((prevState) => ({
            ...prevState,
            docimage: base64Image,
            mimetype: file.type,
          }));
          setDocNameURL('');
        };
      } else {
        NotificationManager.warning('jpg, png, JPEG, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ');
      }
    }
  };

  const removeSelectedImage = () => {
    setDocimage({
      docimage: '',
      mimetype: '',
    });
    setDocNameURL('');
  };

  const handleChange = (e) => {
    // const findId = showDataInTable.some(function(elem) { return elem.documentId == e.target.value })
    setReqDoc({
      ...reqDoc,
      [e.target.name]: e.target.value,
    });
  };
  //method for handling submit event
  let onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let reqDocData;
    const payload = {
      samityId: getId,
      documentId: reqDoc.documentTypeId,
      documentNo: reqDoc.docReferenceNo,
      effectDate: startingValidity ? dateFormat(startingValidity) : '',
      expireDate: expiringValidity ? dateFormat(expiringValidity) : '',
      documentName: docName,
    };
    const formData = new FormData();
    formData.append('samityId', getId);
    formData.append('documentId', reqDoc.documentTypeId);
    formData.append('documentNo', reqDoc.docReferenceNo);
    formData.append('effectDate', payload.effectDate ? payload.effectDate : '');
    formData.append('expireDate', payload.expireDate ? payload.expireDate : '');
    formData.append('documentName', docName);

    try {
      reqDocData = await axios.post(samityDocument, formData, config);
      NotificationManager.success(reqDocData.data.message, '', 5000);
      steperFun(7);
      setReqDoc({
        documentTypeId: 0,
        docReferenceNo: '',
      });
      setDocimage({
        docimage: '',
        mimetype: '',
      });
      setDocNameURL('');
      setDocName('');
      setStartingValidity(null);
      setExpiringValidity(null);
      setLoadingDataSaveUpdate(false);
      DocumentType();
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/budget' });
  };

  const checkMandatory = (data) => {
    const responseData = data.find((row) => row.isMandatory == 'Y');
    if (responseData) {
      NotificationManager.warning(responseData.docTypeDesc + ' প্রদান করুন', '', 5000);
      return false;
    } else {
      return true;
    }
  };

  const onNextPage = () => {
    if (checkMandatory(docType)) {
      router.push({
        pathname: '/coop/samity-management/coop/samity-reg-report',
      });
    }
  };

  return (
    <>
      <Grid item lg={12} md={12} xs={12}>
        <Grid container spacing={2.5}>
          <Grid item lg={7.5} md={7.5} sm={12} xs={12}>
            <Grid container spacing={2.5}>
              <Grid item lg={6} md={12} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('ডকুমেন্ট টাইপ')}
                  name="documentTypeId"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={reqDoc.documentTypeId || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  {docType?.map((option) => (
                    <option key={option.docTypeId} value={option.docTypeId}>
                      {option.docTypeDesc}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item lg={6} md={12} xs={12}>
                <TextField
                  fullWidth
                  label={'ডকুমেন্ট রেফারেন্স নং'}
                  name="docReferenceNo"
                  onChange={handleChange}
                  number
                  value={reqDoc.docReferenceNo}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item lg={6} md={12} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={'মেয়াদ শুরুর তারিখ'}
                    // label={RequiredFile("মেয়াদ শুরুর তারিখ")}
                    value={startingValidity}
                    inputFormat="dd/MM/yyyy"
                    placeholder="01/01/2022"
                    onChange={handleDateChange}
                    disableFuture={true}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" style={{ backgroundColor: '#FFF' }} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item lg={6} md={12} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="মেয়াদ উত্তীর্ণের তারিখ"
                    inputFormat="dd/MM/yyyy"
                    placeholder="01/01/2022"
                    value={expiringValidity}
                    // disablePast={true}
                    onChange={handleDateChangeEx}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" style={{ backgroundColor: '#FFF' }} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>
          {/* ///////////////////////////////////////////////////////////////////// */}
          <Grid item xl={4} lg={4} md={4} xs={12}>
            <Card sx={{ maxWidth: 345 }}>
              <Card
                sx={{
                  height: '250px',
                  borderBottom: 0,
                  borderRadius: '4px 4px 0 0',
                }}
              >
                {docimage.docimage ? (
                  <>
                    <ZoomSelectImage
                      src={docimage.docimage}
                      xs={{ width: '100%', height: '100%' }}
                      key={1}
                      type={docimage?.mimetype === 'application/pdf' ? 'pdf' : ''}
                    />
                  </>
                ) : (
                  <ZoomImage
                    src={docNameURL}
                    divStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                    imageStyle={{ height: '100%', width: '100%' }}
                    key={1}
                    type={imageType(reqDoc?.docName)}
                  />
                )}
              </Card>
              <span style={{ margin: '5px' }}>
                <span>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <label htmlFor={1}>
                      <Input
                        accept="image/*"
                        id={1}
                        multiple
                        type="file"
                        name={1}
                        onChange={imageChange}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        // disabled={row.isDisabled}
                      />
                      <Button
                        variant="contained"
                        component="span"
                        className="btn btn-primary"
                        startIcon={<PhotoCamera />}
                        disabled={false}
                      >
                        {' '}
                        সংযুক্ত করুন
                      </Button>
                    </label>
                  </Stack>
                </span>
                <Button
                  onClick={() => removeSelectedImage()}
                  variant="outlined"
                  color="error"
                  component="span"
                  startIcon={<HighlightOffSharpIcon sx={{ color: 'red' }} />}
                  sx={{ ml: '5px', display: docimage.docimage ? '' : 'none' }}
                >
                  বাতিল
                </Button>
              </span>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            আগের পাতায়
          </Button>
        </Tooltip>
        {update ? (
          <Tooltip title="হালনাগাদ করুন">
            {loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                loadingPosition="start"
                sx={{ mr: 1 }}
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
              >
                হালনাগাদ করা হচ্ছে...
              </LoadingButton>
            ) : (
              <Button className="btn btn-save" onClick={(e) => onUpdateData(e)} startIcon={<SaveOutlinedIcon />}>
                {' '}
                হালনাগাদ করুন
              </Button>
            )}
          </Tooltip>
        ) : (
          <Tooltip title="সংরক্ষন করুন">
            {loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                loadingPosition="start"
                sx={{ mr: 1 }}
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
              >
                সংরক্ষন করা হচ্ছে...
              </LoadingButton>
            ) : (
              <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
                {' '}
                সংরক্ষন করুন
              </Button>
            )}
          </Tooltip>
        )}
        {showDataInTable && showDataInTable.length >= 1 ? (
          <Tooltip title="পরবর্তী পাতা">
            <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
              পরবর্তী পাতায়
            </Button>
          </Tooltip>
        ) : (
          ''
        )}
      </Grid>

      <Grid container>
        <Grid item lg={12} md={12} xs={12}>
          <Box>
            <SubHeading>ডকুমেন্টের তথ্যাদি</SubHeading>
            <Grid container>
              <Grid item lg={12} md={12} xs={12}>
                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell align="center">ক্রমিক নং</TableCell>
                        <TableCell>ডকুমেন্ট নাম</TableCell>
                        <TableCell>ডকুমেন্ট রেফারেন্স নং</TableCell>
                        <TableCell align="center">মেয়াদ শুরুর তারিখ</TableCell>
                        <TableCell align="center">মেয়াদ উত্তীর্ণের তারিখ</TableCell>
                        <TableCell align="center">ডকুমেন্টের ছবি</TableCell>
                        <TableCell>&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {showDataInTable?.map((row, i) => (
                        <TableRow key={row.id}>
                          <TableCell scope="row" sx={{ textAlign: 'center' }}>
                            {numberToWord('' + (i + 1) + '')}
                          </TableCell>
                          <TableCell>{row.documentTypeDesc}</TableCell>
                          <TableCell>{row.documentNo}</TableCell>
                          <TableCell align="center">
                            {row.effectDate ? numberToWord(dateFormat(row.effectDate)) : ''}
                          </TableCell>
                          <TableCell align="center">
                            {row.expireDate ? numberToWord(dateFormat(row.expireDate)) : ''}
                          </TableCell>
                          <TableCell align="center">
                            <ZoomImage
                              src={row?.documentNameUrl}
                              imageStyle={{
                                maxHeight: '40px',
                                border: '1px solid var(--color-primary)',
                              }}
                              divStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                              key={row?.documentId}
                              type={imageType(row?.documentName)}
                            />
                          </TableCell>

                          <TableCell sx={{ textAlign: 'center' }}>
                            <Tooltip title="সম্পাদন করুন">
                              <EditIcon
                                className="table-icon edit"
                                onClick={() =>
                                  onEdit(
                                    row.id,
                                    row.documentId,
                                    row.documentNo,
                                    row.effectDate,
                                    row.expireDate,
                                    row.documentNameUrl,
                                    row.documentName,
                                  )
                                }
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default RequiredDoc;
