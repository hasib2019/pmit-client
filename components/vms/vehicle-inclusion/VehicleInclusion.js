import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
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
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import star from 'components/mainSections/loan-management/loan-application/utils';
import SubHeading from 'components/shared/others/SubHeading';
import { liveIp } from 'config/IpAddress';
import { NotificationManager } from 'react-notifications';
import axios from 'service/AxiosInstance';
import engToBdNum from 'service/englishToBanglaDigit';
import { errorHandler } from '../../../service/errorHandler';
import { codeMaster, getOfficeLayer } from '../../../url/ApiList';

export default function VehicleInclusion() {
  const column = [
    {
      field: 'index',
      headerName: 'ক্রমিক নং',
      align: 'center',
      renderCell: (index) => {
        return engToBdNum(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      field: 'name',
      headerName: 'নাম',
    },
    {
      field: 'model',
      headerName: 'মডেল',
    },
    {
      field: 'regNum',
      headerName: 'রেজিস্ট্রেশন নম্বর',
      width: 150,
    },
    {
      field: 'paymentTypeId',
      headerName: 'যানবাহনের মূল্যপরিশোধ পদ্ধতি',
      width: 200,
      align: 'center',
      renderCell: (params) => {
        let ptype = vPayType.find((item) => {
          if (item.id == params.row.paymentTypeId) return item;
        });
        return ptype?.displayValue;
      },
    },
    {
      field: 'paymentFrqId',
      headerName: 'মূল্যপরিশোধের ফ্রিকোয়েন্সি',
      width: 200,
      align: 'center',
      renderCell: (params) => {
        let ptype = vPayFre.find((item) => {
          if (item.id == params.row.paymentFrqId) return item;
        });
        return ptype?.displayValue;
      },
    },
    {
      field: 'price',
      headerName: 'মূল্য',
    },
    {
      field: 'cc',
      headerName: 'সিসি',
    },
    {
      field: 'sitNo',
      headerName: 'সিট ধারন ক্ষমতা',
      width: 150,
      align: 'center',
    },
    {
      field: 'purcahseDate',
      headerName: 'ক্রয় তারিখ',
      width: 150,
      align: 'center',
      renderCell: (params) => {
        return moment(params.row.purcahseDate).format('D-MM-YYYY');
      },
    },
    {
      field: 'chassisNum',
      headerName: 'নাচেসিস নম্বরম',
    },
    {
      field: 'fitness',
      headerName: 'ফিটনেস',
    },
    {
      field: 'insuranceNo',
      headerName: 'বীমা',
    },
    {
      field: 'categoryId',
      headerName: 'যানবাহনের ধরন',
      width: 150,
      align: 'center',
      renderCell: (params) => {
        let ptype = vType.find((item) => {
          if (item.id == params.row.categoryId) return item;
        });
        return ptype?.displayValue;
      },
    },
    {
      field: 'fuelTypeId',
      headerName: 'জ্বালানীর ধরন',

      renderCell: (params) => {
        let ptype = vFuelType.find((item) => {
          if (item.id == params.row.fuelTypeId) return item;
        });
        return ptype?.displayValue;
      },
    },
    {
      field: 'statusId',
      headerName: 'স্ট্যাটাস',
      renderCell: (params) => {
        let ptype = vStatus.find((item) => {
          if (item.id == params.row.statusId) return item;
        });
        return ptype?.displayValue;
      },
    },
    {
      field: 'startMile',
      headerName: 'শুরুর কি.মি.',
    },
    {
      field: 'servicingDay',
      headerName: 'সারভিসিং এর সময়',
      width: 150,
      align: 'center',
    },
    {
      field: 'servicingMile',
      headerName: 'সার্ভিসিং কি.মি.',
      width: 150,
      align: 'center',
    },
    {
      field: 'driverId',
      headerName: 'ড্রাইভার সংযুক্তকরণ',
      width: 150,
      align: 'center',
      renderCell: (params) => {
        let ptype = driverList.find((item) => {
          if (item.id == params.row.driverId) return item;
        });
        return ptype?.nameBn;
      },
    },
    {
      field: 'officeId',
      headerName: 'কার্যালয় নির্ধারণ',
      width: 150,
      align: 'center',
      renderCell: (params) => {
        let ptype = vOfficer.find((item) => {
          if (item.id == params.row.officeId) return item;
        });
        return ptype?.nameBn;
      },
    },
    {
      field: 'details',
      headerName: 'বিবরণ',
    },
    {
      field: 'action',
      headerName: '',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      type: 'actions',
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              className="table-icon edit"
              onClick={() => {
                editFunction(params.row.id);
              }}
            />
            <DeleteIcon className="table-icon delete" />
          </>
        );
      },
    },
  ];

  const [dataGrid, setDataGrid] = useState([]);
  const [open, setModal] = useState(false);
  const [vPayType, setVPayType] = useState([]);
  const [vPayFre, setVPayFre] = useState([]);
  const [vType, setVType] = useState([]);
  const [vFuelType, setVFuelType] = useState([]);
  const [vStatus, setVStatus] = useState([]);
  const [vOfficer, setVOfficer] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({
    name: '',
    model: '',
    regNum: '',
    paymentTypeId: '',
    paymentFrqId: '',
    price: '',
    cc: '',
    sitNo: '',
    purcahseDate: null,
    chassisNum: '',
    insuranceNo: '',
    fitness: '',
    categoryId: '',
    fuelTypeId: '',
    statusId: '',
    startMile: '',
    servicingDay: '',
    servicingMile: '',
    driverId: '',
    officeId: '',
    details: ' ',
  });
  const [vehicleErr, setVehicleErr] = useState({
    nameErr: false,
    modelErr: false,
    regNumErr: false,
    paymentTypeIdErr: false,
    paymentFrqIdErr: false,
    priceErr: false,
    ccErr: false,
    sitNoErr: false,
    purcahseDateErr: true,
    chasisNoErr: false,
    insuranceNoErr: false,
    fitnessErr: false,
    categoryIdErr: false,
    fuelTypeIdErr: false,
    statusIdErr: false,
    startMileErr: false,
    servicingDayErr: false,
    servicingMileErr: false,
    driverIdErr: false,
    officeIdErr: false,
  });

  const handleClose = () => {
    setModal(false);
    setEdit(false);
    setVehicleDetails({
      name: '',
      model: '',
      regNum: '',
      paymentTypeId: '',
      paymentFrqId: '',
      price: '',
      cc: '',
      sitNo: '',
      purcahseDate: null,
      chassisNum: '',
      insuranceNo: '',
      fitness: '',
      categoryId: '',
      fuelTypeId: '',
      statusId: '',
      startMile: '',
      servicingDay: '',
      servicingMile: '',
      driverId: '',
      officeId: '',
      details: ' ',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let rePrice, reCC, reSitno
    switch (name) {
      case 'name':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({ ...vehicleErr, nameErr: value == '' ? true : false });
        break;
      case 'model':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({ ...vehicleErr, modelErr: value == '' ? true : false });
        break;
      case 'regNum':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({ ...vehicleErr, regNumErr: value == '' ? true : false });
        break;
      case 'paymentTypeId':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          paymentTypeIdErr: value == 0 ? true : false,
        });
        break;
      case 'paymentFrqId':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          paymentFrqIdErr: value == 0 ? true : false,
        });
        break;
      case 'price':
        rePrice = /(^[0-9 ]*$)/;
        if (rePrice.test(value)) {
          setVehicleDetails({ ...vehicleDetails, [name]: value });
          setVehicleErr({
            ...vehicleErr,
            priceErr: value == '' ? true : false,
          });
        }
        break;
      case 'cc':
        reCC = /(^[0-9 ]*$)/;
        if (reCC.test(value)) {
          setVehicleDetails({ ...vehicleDetails, [name]: Number(value) });
          setVehicleErr({ ...vehicleErr, ccErr: value == '' ? true : false });
        }
        break;
      case 'sitNo':
        reSitno = /(^[0-9 ]*$)/;
        if (reSitno.test(value)) {
          setVehicleDetails({ ...vehicleDetails, [name]: Number(value) });
          setVehicleErr({
            ...vehicleErr,
            sitNoErr: value == '' ? true : false,
          });
        }
        break;
      case 'purcahseDate':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          purcahseDateErr: value == '' ? true : false,
        });
        break;
      case 'chassisNum':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          chasisNoErr: value == '' ? true : false,
        });
        break;
      case 'insuranceNo':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          insuranceNoErr: value == '' ? true : false,
        });
        break;
      case 'fitness':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          fitnessErr: value == '' ? true : false,
        });
        break;
      case 'categoryId':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          categoryIdErr: value == 0 ? true : false,
        });
        break;
      case 'fuelTypeId':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          fuelTypeIdErr: value == 0 ? true : false,
        });
        break;
      case 'statusId':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          statusIdErr: value == 0 ? true : false,
        });
        break;
      case 'startMile':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          startMileErr: value == '' ? true : false,
        });
        break;
      case 'servicingDay':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          servicingDayErr: value == '' ? true : false,
        });
        break;
      case 'servicingMile':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          servicingMileErr: value == '' ? true : false,
        });
        break;
      case 'driverId':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          driverIdErr: value == 0 ? true : false,
        });
        break;
      case 'officeId':
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        setVehicleErr({
          ...vehicleErr,
          officeIdErr: value == 0 ? true : false,
        });
        break;
      case 'details':
        // if (value == '') {
        //   value = ' ';
        // }
        setVehicleDetails({ ...vehicleDetails, [name]: value });
        break;

      default:
      // code block
    }
  };

  const editFunction = (id) => {
    let Editvehicle = dataGrid.find((item) => item.id == id);
    if (Editvehicle.details == '') {
      Editvehicle = { ...Editvehicle, details: ' ' };
    }
    setVehicleDetails(Editvehicle);
    setEdit(true);
    setModal(true);
  };

  const initiateState = () => {
    setEdit(false);
    setModal(false);
    setVehicleDetails({
      name: '',
      model: '',
      regNum: '',
      paymentTypeId: '',
      paymentFrqId: '',
      price: '',
      cc: '',
      sitNo: '',
      purcahseDate: null,
      chassisNum: '',
      insuranceNo: '',
      fitness: '',
      categoryId: '',
      fuelTypeId: '',
      statusId: '',
      startMile: '',
      servicingDay: '',
      servicingMile: '',
      driverId: '',
      officeId: '',
      details: ' ',
    });
  };

  const submitData = () => {
    vehicleDetails.purcahseDate = moment(new Date(vehicleDetails.purcahseDate)).format('DD/MM/YYYY');
    let checkValueArr = Object.values(vehicleDetails);
    if (checkValueArr.includes('') || checkValueArr.includes(0) || checkValueArr.includes(null)) {
      NotificationManager.error('', 'সবগুলো ফিল্ড পুরন করুন', 2000);
    } else {
      axios
        .post(`${liveIp}vms/create-vehicle`, vehicleDetails)
        .then((res) => {
          initiateState();
          setToggle(!toggle);
          NotificationManager.success('', res.data.message, 2000);
        })
        .catch((err) => {
          errorHandler(err);
        });
    }
  };

  const gettingDropdowndata = async () => {
    await axios
      .get(codeMaster + '?codeType=VPM')
      .then((res) => {
        setVPayType(res.data.data);
      })
      .catch((err) => {
        errorHandler(err);
      });
    await axios
      .get(codeMaster + '?codeType=VFQ')
      .then((res) => {
        setVPayFre(res.data.data);
      })
      .catch((err) => {
        errorHandler(err);
      });
    await axios
      .get(codeMaster + '?codeType=VCT')
      .then((res) => {
        setVType(res.data.data);
      })
      .catch((err) => {
        errorHandler(err);
      });
    await axios
      .get(codeMaster + '?codeType=VFT')
      .then((res) => {
        setVFuelType(res.data.data);
      })
      .catch((err) => {
        errorHandler(err);
      });
    await axios
      .get(codeMaster + '?codeType=VST')
      .then((res) => {
        setVStatus(res.data.data);
      })
      .catch((err) => {
        errorHandler(err);
      });
    await axios
      .get(getOfficeLayer)
      .then((res) => {
        setVOfficer(res.data.data);
      })
      .catch((err) => {
        errorHandler(err);
      });
    await axios.get(`${liveIp}vms/get-driverlist`).then((res) => {
      setDriverList(res.data.data);
    });
  };

  const getData = () => {
    axios
      .get(`${liveIp}vms/get-vehicle`)
      .then((res) => {
        setDataGrid(res.data.data);
      })
      .catch((err) => {
        errorHandler(err);
      });
  };

  useEffect(() => {
    gettingDropdowndata();
  }, []);

  useEffect(() => {
    getData();
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
          নতুন যানবাহন অন্তর্ভুক্ত করুন
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
          <span>{edit ? 'যানবাহন হালনাগাদ' : 'যানবাহন অন্তর্ভুক্তিকরন'}</span>{' '}
          <ClearIcon sx={{ cursor: 'pointer', color: 'var(--color-delete)' }} onClick={handleClose} />{' '}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: '5px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star(' নাম')}
                size="small"
                variant="outlined"
                name="name"
                value={vehicleDetails?.name}
                error={vehicleErr?.nameErr}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('মডেল')}
                size="small"
                variant="outlined"
                name="model"
                value={vehicleDetails?.model}
                error={vehicleErr?.modelErr}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('রেজিস্ট্রেশন নম্বর')}
                size="small"
                variant="outlined"
                name="regNum"
                value={vehicleDetails?.regNum}
                error={vehicleErr?.regNumErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{star('যানবাহনের মূল্যপরিশোধ পদ্ধতি')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  className="select"
                  label={star('যানবাহনের মূল্যপরিশোধ পদ্ধতি')}
                  name="paymentTypeId"
                  value={vehicleDetails?.paymentTypeId || 0}
                  error={vehicleErr?.paymentTypeIdErr}
                  onChange={handleChange}
                >
                  {vPayType.length > 0 &&
                    vPayType.map((item, index) => {
                      return (
                        <MenuItem value={item?.id} key={index}>
                          {' '}
                          {item?.displayValue}{' '}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{star('মূল্যপরিশোধের ফ্রিকোয়েন্সি')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label={star('প্রকল্প বা কর্মসূচীর নাম')}
                  className="select"
                  defaultValue="--নির্বাচন করুন--"
                  name="paymentFrqId"
                  value={vehicleDetails?.paymentFrqId || 0}
                  error={vehicleErr?.paymentFrqIdErr}
                  onChange={handleChange}
                >
                  {vPayFre.length > 0 &&
                    vPayFre.map((item, index) => {
                      return (
                        <MenuItem value={item?.id} key={index}>
                          {' '}
                          {item?.displayValue}{' '}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('মূল্য')}
                size="small"
                variant="outlined"
                name="price"
                value={vehicleDetails?.price}
                error={vehicleErr?.priceErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('সিসি')}
                size="small"
                variant="outlined"
                name="cc"
                value={vehicleDetails?.cc}
                error={vehicleErr?.ccErr}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('সিট ধারন ক্ষমতা')}
                size="small"
                variant="outlined"
                name="sitNo"
                value={vehicleDetails?.sitNo}
                error={vehicleErr?.sitNoErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  name="purcahseDate"
                  label={star('ক্রয় তারিখ')}
                  inputFormat="dd\MM\yyyy"
                  value={vehicleDetails?.purcahseDate}
                  onChange={(date) => {
                    setVehicleDetails({
                      ...vehicleDetails,
                      purcahseDate: date,
                    });
                    setVehicleErr({ ...vehicleErr, purcahseDateErr: false });
                  }}
                  renderInput={(props) => <TextField fullWidth {...props} size="small" />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('চেসিস নম্বর')}
                size="small"
                variant="outlined"
                name="chassisNum"
                value={vehicleDetails?.chassisNum}
                error={vehicleErr?.chasisNoErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('বীমা')}
                size="small"
                variant="outlined"
                name="insuranceNo"
                value={vehicleDetails?.insuranceNo}
                error={vehicleErr?.insuranceNoErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('ফিটনেস')}
                size="small"
                variant="outlined"
                name="fitness"
                value={vehicleDetails?.fitness}
                error={vehicleErr?.fitnessErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{star('যানবাহনের ধরন')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label={star('প্রকল্প বা কর্মসূচীর নাম')}
                  className="select"
                  defaultValue="--নির্বাচন করুন--"
                  name="categoryId"
                  value={vehicleDetails?.categoryId || 0}
                  error={vehicleErr?.categoryIdErr}
                  onChange={handleChange}
                >
                  {vType.length > 0 &&
                    vType.map((item, index) => {
                      return (
                        <MenuItem value={item?.id} key={index}>
                          {' '}
                          {item?.displayValue}{' '}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{star('জ্বালানীর ধরন')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label={star('জ্বালানীর ধরন')}
                  className="select"
                  defaultValue="--নির্বাচন করুন--"
                  name="fuelTypeId"
                  value={vehicleDetails?.fuelTypeId || 0}
                  error={vehicleErr?.fuelTypeIdErr}
                  onChange={handleChange}
                >
                  {vFuelType.length > 0 &&
                    vFuelType.map((item, index) => {
                      return (
                        <MenuItem value={item?.id} key={index}>
                          {' '}
                          {item?.displayValue}{' '}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{star('স্ট্যাটাস')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label={star('স্ট্যাটাস')}
                  className="select"
                  defaultValue="--নির্বাচন করুন--"
                  name="statusId"
                  value={vehicleDetails?.statusId || 0}
                  error={vehicleErr?.statusIdErr}
                  onChange={handleChange}
                >
                  {vStatus.length > 0 &&
                    vStatus.map((item, index) => {
                      return (
                        <MenuItem value={item?.id} key={index}>
                          {' '}
                          {item?.displayValue}{' '}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('মূল্যশুরুর কি.মি.')}
                size="small"
                variant="outlined"
                name="startMile"
                value={vehicleDetails?.startMile}
                error={vehicleErr?.startMileErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('সারভিসিং এর সময়')}
                size="small"
                variant="outlined"
                name="servicingDay"
                value={vehicleDetails?.servicingDay}
                error={vehicleErr?.servicingDayErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('সার্ভিসিং কি.মি.')}
                size="small"
                variant="outlined"
                name="servicingMile"
                value={vehicleDetails?.servicingMile}
                error={vehicleErr?.servicingMileErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{star('ড্রাইভার সংযুক্তকরণ')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label={star('ড্রাইভার সংযুক্তকরণ')}
                  className="select"
                  defaultValue="--নির্বাচন করুন--"
                  name="driverId"
                  value={vehicleDetails?.driverId || 0}
                  error={vehicleErr?.driverIdErr}
                  onChange={handleChange}
                >
                  {driverList.length > 0 &&
                    driverList.map((item, index) => {
                      return (
                        <MenuItem key={item?.id + index} value={item?.id}>
                          {' '}
                          {item?.nameBn}{' '}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{star('কার্যালয় নির্ধারণ')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label={star('কার্যালয় নির্ধারণ')}
                  className="select"
                  defaultValue="--নির্বাচন করুন--"
                  name="officeId"
                  value={vehicleDetails?.officeId || 0}
                  error={vehicleErr?.officeIdErr}
                  onChange={handleChange}
                >
                  {vOfficer.length > 0 &&
                    vOfficer.map((item, index) => {
                      return (
                        <MenuItem key={item?.id + index} value={item?.id}>
                          {' '}
                          {item?.nameBn}{' '}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="বিবরণ"
                size="small"
                variant="outlined"
                name="details"
                value={vehicleDetails?.details || ' '}
                onChange={handleChange}
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
