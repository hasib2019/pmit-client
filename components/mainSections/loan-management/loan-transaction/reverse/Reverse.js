import CloseIcon from '@mui/icons-material/Close';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import {
  Box,
  Button,
  Dialog,
  FormHelperText,
  Grid,
  IconButton,
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
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { localStorageData } from '../../../../../service/common';
import {
  codeMaster,
  employeeRecordByOffice,
  officeName,
  reverseRequestInfo,
  specificApplication,
} from '../../../../../url/ApiList';
import star from '../../../../mainSections/loan-management/loan-application/utils';

const Reverse = () => {
  //tran type
  const [tranTypeList, setTranTypeList] = useState([]);
  // transaction Date
  //employee office
  const officeInfo = localStorageData('officeGeoData');
  const [officeListObj, setOfficeListObj] = useState({
    id: officeInfo?.id,
    label: officeInfo?.nameBn,
  });
  const [officeList, setOfficeList] = useState([]);
  //employee desk list
  const [deskListObj, setDeskListObj] = useState({
    id: null,
    label: '',
  });
  const [deskList, setDeskList] = useState([]);
  const [reverseMainTran, setReverseMainTran] = useState([]);

  //Mendatory error check Error
  const [formErrors, setFormErrors] = useState({});
  //for modal page
  const [clickModal, setClickModal] = useState(false);

  //parameter list
  const [parameterList, setParameterList] = useState({
    // projectId: "",
    tranTypeId: '',
    tranNumber: '',
    tranDate: '',
    remarks: '',
  });

  useEffect(() => {
    // getProjectList();
    getTranType();
    getOffice();
    if (officeInfo?.id) getDesk(officeInfo?.id);
  }, []);

  const config = localStorageData('config');
  const handleChange = (e) => {
    const { name, value } = e.target;

    setParameterList({
      ...parameterList,
      [name]: value,
    });
    // for remove error outline after getting value
    setFormErrors({ ...formErrors, [name]: '' });
  };
  // data handle change
  const handleDateChangeEx = (e) => {
    if (e) {
      setParameterList({
        ...parameterList,
        tranDate: moment(e).format('DD/MM/YYYY'),
      });
      setFormErrors({ ...formErrors, tranDate: '' });
    } else
      setFormErrors({
        ...formErrors,
        tranDate: 'লেনদেনের তারিখ নির্বাচন করুন',
      });
  };
  //for modal open & close
  const handleOpen = async (searchCriteria) => {
    let result = checkMandatory(searchCriteria); // for validation

    if (result) {
      getReverseMainTran(parameterList.tranNumber, dateFormat(parameterList.tranDate));
    }
  };

  const handleClose = () => {
    setClickModal(false);
  };
  //Mendatory validation check
  let checkMandatory = (searchCriteria) => {
    let result = true;
    const formErrors = { ...formErrors };

    if (!parameterList.tranTypeId && searchCriteria == true) {
      result = false;
      formErrors.tranTypeId = 'লেনদেনের ধরণ নির্বাচন করুন';
    }
    if (!parameterList.tranNumber) {
      result = false;
      formErrors.tranNumber = 'লেনদেনের নম্বর উল্লেখ করুন';
    }
    if (!parameterList.tranDate) {
      result = false;
      formErrors.tranDate = 'লেনদেনের তারিখ নির্বাচন করুন';
    }
    if (!parameterList.remarks && searchCriteria == true) {
      result = false;
      formErrors.remarks = 'মন্তব্য উল্লেখ করুন';
    }
    if (!officeListObj.id && searchCriteria == true) {
      result = false;
      formErrors.officeId = 'অনুমোদনকারীর অফিস নির্বাচন করুন';
    }
    if (!deskListObj.id && searchCriteria == true) {
      result = false;
      formErrors.deskId = 'অনুমোদনকারী নির্বাচন করুন';
    }

    setFormErrors(formErrors);
    return result;
  };
  //Clear Field data
  const clearField = () => {
    setParameterList({
      tranTypeId: '',
      tranNumber: '',
      tranDate: '',
      remarks: '',
    });

    //office
    setOfficeListObj({
      id: null,
      label: '',
    });
    //desk
    setDeskListObj({
      id: null,
      label: '',
    });
    //modal
    setReverseMainTran([]);
  };
  // On Submit Process
  let onSubmitData = async (e, searchCriteria) => {
    e.preventDefault();

    let result = checkMandatory(searchCriteria); // for validation
    let payload;
    payload = {
      nextAppDesignationId: deskListObj?.id ? parseInt(deskListObj.id) : null,

      data: {
        tranTypeId: parameterList.tranTypeId ? parseInt(parameterList.tranTypeId) : null,
        tranNumber: parameterList.tranNumber,
        tranDate: dateFormat(parameterList.tranDate),
        remarks: parameterList.remarks,
        officeId: officeListObj.id ? parseInt(officeListObj.id) : null,
        deskId: deskListObj.id ? parseInt(deskListObj.id) : null,
      },
    };

    if (result) {
      try {
        const reverseTransaction = await axios.post(specificApplication + 'reverseTransaction/loan', payload, config);
        NotificationManager.success(reverseTransaction.data.message, '', 5000);
        clearField();
        getOffice();
        if (officeInfo?.id) {
          setOfficeListObj({
            id: officeInfo?.id,
            label: officeInfo?.nameBn,
          });
          getDesk(officeInfo?.id);
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  // ***************** API Calling *****************

  //Tran Type API
  const getTranType = async () => {
    try {
      const tranTypeInfo = await axios.get(codeMaster + '?codeType=TRP', config);
      const tranTypeInfoData = tranTypeInfo.data.data;
      setTranTypeList(tranTypeInfoData);
    } catch (error) {
      errorHandler(error);
    }
  };
  //Office API
  const getOffice = async () => {
    try {
      let officeInfo = await axios.get(officeName, config);
      const officeInfoData = officeInfo.data.data;
      setOfficeList(officeInfoData);
    } catch (error) {
      errorHandler(error);
    }
  };
  //Desk API
  const getDesk = async (officeId) => {
    try {
      const deskInfo = await axios.get(employeeRecordByOffice + '?officeId=' + officeId, config);
      const deskInfoData = deskInfo.data.data;
      setDeskList(deskInfoData);
    } catch (error) {
      errorHandler(error);
    }
  };
  //Reverse Main tran Data API
  const getReverseMainTran = async (tranNumber, tranDate) => {
    if (tranNumber && tranDate) {
      try {
        const ReverseMainTranInfo = await axios.get(
          reverseRequestInfo + '?tranNumber=' + tranNumber + '&tranDate=' + tranDate,
          config,
        );
        const ReverseMainTranData = ReverseMainTranInfo.data.data;

        if (Object.keys(ReverseMainTranData.reverseRequstData).length > 0) {
          setReverseMainTran(ReverseMainTranData.reverseRequstData);
          setParameterList({ ...parameterList, tranTypeId: ReverseMainTranData.tranTypeId });
          setClickModal(true);
        } else {
          // setClickModal(false)
          errorHandler('প্রদত্ত লেনদেনের তারিখ ও লেনদেনের নম্বরের কোনো তথ্য পাওয়া যায়নি।');
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  // ***************** END API calling *****************
  return (
    <Grid container spacing={2.5} className="section">
      <Grid item md={6} xs={12}>
        <TextField
          id="tranNumber"
          fullWidth
          label={star('লেনদেনের নম্বর')}
          name="tranNumber"
          onChange={handleChange}
          value={parameterList.tranNumber}
          variant="outlined"
          size="small"
          error={formErrors.tranNumber ? true : false}
          helperText={formErrors.tranNumber}
        ></TextField>
      </Grid>
      <Grid item md={6} xs={12}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={star('লেনদেনের তারিখ')}
            name="tranDate"
            inputFormat="dd/MM/yyyy"
            value={parameterList?.tranDate || null}
            onChange={handleDateChangeEx}
            renderInput={(params) => (
              <TextField
                {...params}
                error={formErrors.tranDate ? true : false}
                helperText={formErrors.tranDate}
                size="small"
                fullWidth
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item md={6} xs={12}>
        <FormControl fullWidth sx={{ background: 'white' }} size="small">
          <InputLabel id="tran-type-list-label"> {star('লেনদেনের ধরণ')}</InputLabel>
          <Select
            disabled={true}
            name="tranTypeId"
            value={parameterList.tranTypeId}
            label="লেনদেনের ধরণ"
            onChange={handleChange}
            error={formErrors.tranTypeId ? true : false}
          >
            {tranTypeList.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {' '}
                {option.displayValue}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={formErrors.tranTypeId ? true : false}>{formErrors.tranTypeId}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          id="remarks"
          fullWidth
          label={star('মন্তব্য')}
          name="remarks"
          onChange={handleChange}
          value={parameterList.remarks}
          variant="outlined"
          size="small"
          error={formErrors.remarks ? true : false}
          helperText={formErrors.remarks}
        ></TextField>
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <Autocomplete
          disablePortal
          inputProps={{ style: { padding: 0, margin: 0 } }}
          name="officeId"
          value={officeListObj}
          onChange={(event, value) => {
            if (!value) {
              setOfficeListObj({
                id: '',
                label: '',
              });
              setDeskListObj({
                id: '',
                label: '',
              });
            } else {
              value &&
                setOfficeListObj({
                  id: value.id,
                  label: value.label,
                });

              // for remove error outline after getting value
              setFormErrors({ ...formErrors, officeId: '' });
              setDeskListObj({
                id: '',
                label: '',
              });
              getDesk(value.id);
            }
          }}
          options={officeList.map((option) => {
            return {
              id: option.id,
              label: option.nameBn,
            };
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={
                officeListObj.id
                  ? star('পর্যবেক্ষক/অনুমোদনকারীর অফিস')
                  : star('পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন')
              }
              variant="outlined"
              error={formErrors.officeId ? true : false}
              helperText={formErrors.officeId}
              size="small"
              style={{ backgroundColor: '#FFF', margin: '5dp' }}
            />
          )}
        />
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <Autocomplete
          disablePortal
          inputProps={{ style: { padding: 0, margin: 0 } }}
          name="deskId"
          value={deskListObj}
          onChange={(event, value) => {
            if (value == null) {
              setDeskListObj({
                id: '',
                label: '',
              });
            } else {
              value &&
                setDeskListObj({
                  id: value.id,
                  label: value.label,
                });
              setFormErrors({ ...formErrors, deskId: '' });
            }
          }}
          options={deskList.map((option) => ({
            id: option.designationId,
            label: option.nameBn ? option.nameBn : '' + '-' + option.designation,
          }))}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={
                deskListObj.id === ''
                  ? star('পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন')
                  : star('পর্যবেক্ষক/অনুমোদনকারীর নাম')
              }
              variant="outlined"
              error={formErrors.deskId ? true : false}
              helperText={formErrors.deskId}
              size="small"
            />
          )}
        />
      </Grid>
      <Grid item md="4" xs="12">
        <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={(e) => handleOpen(e, false)}
            className="btn btn-outlined"
            startIcon={<PublishedWithChangesIcon />}
          >
            অনুসন্ধান
          </Button>
          <Button
            disabled={parameterList.tranTypeId ? false : true}
            variant="contained"
            onClick={(e) => onSubmitData(e, true)}
            className="btn btn-primary"
            startIcon={<PublishedWithChangesIcon />}
          >
            আবেদন জমা দিন
          </Button>
        </Box>
      </Grid>

      {/* for modal page view */}
      <Dialog
        fullWidth
        open={clickModal}
        onClose={handleClose}
        maxWidth="md"
        // TransitionComponent={Transition}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ minHeight: '300px' }}>
          <IconButton aria-label="close" onClick={handleClose} className="modal-close">
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h5" sx={{ margin: '1.5rem 3rem 0rem' }}>
            মূল লেনদেনের তথ্য
          </Typography>
          <Typography id="modal-modal-description" sx={{ margin: '2rem 3rem' }}>
            <Box className="modal-box" sx={{ marginBottom: '1rem' }}>
              <div className="info">
                <span className="label">লেনদেনের তারিখ</span>
                <b>: &nbsp;</b>
                {engToBang(dateFormat(reverseMainTran[0]?.tranDate))}
              </div>
              <div className="info">
                <span className="label">লেনদেনের নম্বর</span>
                <b>: &nbsp;</b>
                {reverseMainTran[0]?.tranNum}
              </div>
            </Box>
            <Grid container className="section">
              <TableContainer className="table-container">
                <Table size="small" aria-label="a dense table" className="table-alter">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell>হিসাব নম্বর</TableCell>
                      <TableCell>জিএল এর নাম</TableCell>
                      <TableCell>ক্রেডিট/ডেবিট</TableCell>
                      <TableCell>লেনদেনের পরিমাণ (টাকা)</TableCell>
                      <TableCell>মন্তব্য</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reverseMainTran?.map((element, i) => (
                      <TableRow key={'reverse' + i}>
                        <TableCell>{element?.accountTitle}</TableCell>
                        <TableCell>{element?.glacName}</TableCell>
                        <TableCell>{element?.drcrCode}</TableCell>
                        <TableCell>{engToBang(element?.tranAmt)}</TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{element?.naration}</div>} arrow>
                            <span className="data">{element?.naration}</span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Typography>
        </Box>
      </Dialog>
    </Grid>
  );
};

export default Reverse;
