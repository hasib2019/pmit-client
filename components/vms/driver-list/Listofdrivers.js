/* eslint-disable no-misleading-character-class */
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import star from 'components/mainSections/loan-management/loan-application/utils';
import SubHeading from 'components/shared/others/SubHeading';
import { liveIp } from 'config/IpAddress';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'service/AxiosInstance';
import engToBdNum from 'service/englishToBanglaDigit';
import { formValidator } from 'service/formValidator';
import { errorHandler } from '../../../service/errorHandler';

export default function Listofdrivers() {
  const [dataGrid, setDataGrid] = useState([]);
  const [open, setModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [edit, setEdit] = useState(false);
  const [driverDetails, setdriverdetails] = useState({
    nameBn: '',
    nameEn: '',
    dob: null,
    nid: '',
    licenseNo: '',
    address: '',
  });
  const [driverError, setDriverError] = useState({
    nameBnErr: false,
    nameEnErr: false,
    nidErr: false,
    licenseNoErr: false,
    nidHelperText: '',
  });
  // const [banglaname, setBanglaname] = useState();
  const column = [
    {
      field: 'index',
      headerName: 'ক্রমিক নং',
      align: 'center',
      width: 100,
      renderCell: (index) => {
        return engToBdNum(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      field: 'nameBn',
      headerName: 'নাম(Bn)',
      editable: true,
      width: 200,
    },
    {
      field: 'nameEn',
      headerName: 'নাম(En)',
      editable: true,
      width: 200,
    },
    {
      field: 'dob',
      headerName: 'জন্মতারিখ',
      width: 180,
      renderCell: (params) => {
        return moment(new Date(params.row.dob)).format('DD/MM/YYYY');
      },
    },
    {
      field: 'licenseNo',
      headerName: 'লাইসেন্স নম্বর',
      width: 200,
    },
    {
      field: 'address',
      headerName: 'ঠিকানা',
      width: 300,
    },
    {
      field: 'action',
      headerName: '',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 300,
      type: 'actions',
      align: 'left',
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              className="table-icon edit"
              onClick={() => {
                setModal(true);
                handleEdit(params.row.id);
                setEdit(true);
              }}
            />
            <DeleteIcon className="table-icon delete" />
          </>
        );
      },
    },
  ];

  const handleClose = () => {
    setModal(false);
    setEdit(false);
    setdriverdetails({
      nameBn: '',
      nameEn: '',
      nid: '',
      dob: null,
      licenseNo: '',
      address: '',
    });
    setDriverError({
      nameBnErr: false,
      nameEnErr: false,
      nidErr: false,
      licenseNoErr: false,
      nidHelperText: '',
    });
  };
  const handleEdit = (id) => {
    let editdata = dataGrid.find((item) => item.id == id);
    setdriverdetails(editdata);
  };
  const handleChangeEnglishName = (e) => {
    const { name, value } = e.target;
    const re = /(^[A-Za-z ]*$)/;
    if (re.test(value)) {
      setdriverdetails({ ...driverDetails, [name]: value });
      setDriverError((driverError) => ({
        ...driverError,
        nameEnErr: value == '' ? true : false,
      }));
    }
  };
  const handleChangeBanglaName = (e) => {
    const { name, value } = e.target;
    setdriverdetails({
      ...driverDetails,
      [name]: value.replace(
        /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
        '',
      ),
    });

    setDriverError((driverError) => ({
      ...driverError,
      nameBnErr: value == '' ? true : false,
    }));
  };
  const handleChangeNID = (e) => {
    const { name, value } = e.target;
    let memberDataNid;
    memberDataNid = formValidator('nid', value);
    if (memberDataNid?.status) {
      return;
    }

    if (memberDataNid?.errorValue != '') {
      setDriverError((driverError) => ({
        ...driverError,
        nidHelperText: memberDataNid?.error,
      }));
    } else {
      setDriverError((driverError) => ({
        ...driverError,
        nidHelperText: memberDataNid?.error,
      }));
    }

    setdriverdetails({ ...driverDetails, [name]: memberDataNid?.value });
    setDriverError((driverError) => ({
      ...driverError,
      nidErr: value == '' ? true : false,
    }));
  };
  const handleChangelicenseNo = (e) => {
    const { name, value } = e.target;
    const re = /(^[A-Za-z0-9 ]*$)/;
    if (re.test(value)) {
      setdriverdetails({ ...driverDetails, [name]: value });

      setDriverError((driverError) => ({
        ...driverError,
        licenseNoErr: value == '' ? true : false,
      }));
    }
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setdriverdetails({ ...driverDetails, [name]: value });
  };
  const submitData = () => {
    const { nameBnErr, nameEnErr, nidErr, licenseNoErr, nidHelperText } = driverError;
    const { nameBn, nameEn, nid, dob, licenseNo } = driverDetails;
    if (
      nameBnErr ||
      nameEnErr ||
      nidErr ||
      licenseNoErr ||
      nidHelperText != '' ||
      nameBn == '' ||
      nameEn == '' ||
      nid == '' ||
      dob == '' ||
      licenseNo == ''
    ) {
      NotificationManager.error('', 'সবগুলো ফিল্ড পুরন করুন', 2000);
      return;
    }
    driverDetails.dob = moment(new Date(driverDetails.dob)).format('DD/MM/YYYY');

    axios
      .post(`${liveIp}vms/create-driverlist`, driverDetails)
      .then((res) => {
        NotificationManager.success('', res.data.message, 2000);
        setModal(false);
        setEdit(false);
        setToggle(!toggle);
        setdriverdetails({
          nameBn: '',
          nameEn: '',
          nid: '',
          dob: null,
          licenseNo: '',
          address: '',
        });

        setDriverError({
          nameBnErr: false,
          nameEnErr: false,
          nidErr: false,
          licenseNoErr: false,
          nidHelperText: '',
        });
      })
      .catch((err) => errorHandler(err));
  };
  useEffect(() => {
    axios
      .get(`${liveIp}vms/get-driverlist`)
      .then((res) => {
        setDataGrid(res.data.data);
      })
      .catch((err) => errorHandler(err));
  }, [toggle]);
  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <SubHeading>তালিকা</SubHeading>
        <Button
          className="btn btn-primary"
          onClick={() => {
            setModal(true);
          }}
        >
          নতুন ড্রাইভার অন্তর্ভুক্ত করুন
          <AddIcon sx={{ marginLeft: '.5rem' }} />
        </Button>

        <DataGrid
          // className= "table-container"
          sx={{ marginTop: '2rem' }}
          autoHeight
          rows={dataGrid}
          columns={column}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
          pageSizeOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
          localeText={{
            toolbarColumns: '',
            toolbarFilters: '',
            toolbarDensity: '',
            toolbarExport: '',
          }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{edit ? 'ড্রাইভারের তথ্য পরিবর্তন করুন' : 'ড্রাইভার তথ্য অন্তর্ভুক্ত করুন'}</span>{' '}
          <ClearIcon sx={{ cursor: 'pointer', color: 'var(--color-delete)' }} onClick={handleClose} />{' '}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star(' নাম(ইংরেজি)')}
                size="small"
                variant="outlined"
                name="nameEn"
                value={driverDetails?.nameEn}
                sx={{ width: '100%', marginTop: '25px' }}
                error={driverError?.nameEnErr}
                onChange={(e) => {
                  handleChangeEnglishName(e);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('নাম(বাংলা)')}
                size="small"
                variant="outlined"
                name="nameBn"
                value={driverDetails?.nameBn}
                sx={{ width: '100%', marginTop: '25px' }}
                error={driverError?.nameBnErr}
                onChange={(e) => {
                  handleChangeBanglaName(e);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  name="dob"
                  label={star('জন্মতারিখ')}
                  inputFormat="dd\MM\yyyy"
                  value={driverDetails?.dob}
                  onChange={(date) => {
                    setdriverdetails({ ...driverDetails, dob: date });
                  }}
                  renderInput={(props) => <TextField fullWidth {...props} size="small" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('জাতীয় পরিচয় পত্র নম্বর')}
                size="small"
                variant="outlined"
                name="nid"
                value={driverDetails.nid}
                error={driverError.nidErr}
                onChange={handleChangeNID}
                aria-describedby="component-error-text"
              />
              <FormHelperText id="component-error-text" sx={{ color: 'red' }}>
                {driverError?.nidHelperText}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('লাইসেন্স নম্বর')}
                size="small"
                variant="outlined"
                name="licenseNo"
                value={driverDetails?.licenseNo}
                error={driverError?.licenseNoErr}
                onChange={handleChangelicenseNo}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={'ঠিকানা'}
                size="small"
                variant="outlined"
                name="address"
                value={driverDetails?.address}
                onChange={handleAddressChange}
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button className="btn btn-primary" onClick={submitData} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সাবমিট করুন
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

// export const getServerSideProps = requireAuthentication((context) => {
//     return {
//         props: {
//             query: context.query,
//         }
//     };
// })
