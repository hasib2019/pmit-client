import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import star from 'components/mainSections/loan-management/loan-application/utils';
import SubHeading from 'components/shared/others/SubHeading';
import { liveIp } from 'config/IpAddress';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'service/AxiosInstance';
import engToBdNum from 'service/englishToBanglaDigit';
import { errorHandler } from '../../../service/errorHandler';

export default function PetrolPumpInclusion() {
  const [dataGrid, setDataGrid] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [open, setModal] = useState(false);
  const [pump, setPump] = useState({
    name: '',
    address: '',
    contactPerson: '',
    mobNum: '',
  });

  const [pumpErr, setPumpErr] = useState({
    nameErr: false,
    addressErr: false,
    contactPersonErr: false,
    mobileErr: false,
  });

  const handleClose = () => {
    setModal(false);
    setPump({
      name: '',
      address: '',
      contactPerson: '',
      mobNum: '',
    });
    setPumpErr({
      nameErr: false,
      addressErr: false,
      contactPersonErr: false,
      mobileErr: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        setPump({ ...pump, [name]: value });
        setPumpErr({ ...pumpErr, nameErr: value == '' ? true : false });
        break;
      case 'address':
        setPump({ ...pump, [name]: value });
        setPumpErr({ ...pumpErr, addressErr: value == '' ? true : false });
        break;
      case 'contactPerson':
        setPump({ ...pump, [name]: value });
        setPumpErr({
          ...pumpErr,
          contactPersonErr: value == '' ? true : false,
        });
        break;
      case 'mobNum':
        setPump({ ...pump, [name]: value });
        setPumpErr({ ...pumpErr, mobileErr: value == '' ? true : false });
        break;
      default:
        break;
    }
  };

  const handleEdit = (id) => {
    setModal(true);
    const temp = dataGrid.find((item) => {
      if (id == item.id) {
        return item;
      }
    });
    setPump({ ...temp });
  };

  const handleSubmit = () => {
    let errorArr = Object.values(pumpErr);
    let error = Object.values(pump);
    if (error.includes('')) {
      NotificationManager.error('Error message', 'সবগুলা ফিল্ড পুরন করুন', 3000);
      return;
    }
    if (errorArr.includes(true)) {
      NotificationManager.error('Error message', 'সবগুলা ফিল্ড পুরন করুন', 3000);
      return;
    }

    axios
      .post(`${liveIp}vms/create-pump`, pump)
      .then((res) => {
        NotificationManager.success('Success message', res.data.message, 3000);
        setToggle(!toggle);
        handleClose();
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

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
      width: 180,
    },
    {
      field: 'contactPerson',
      headerName: 'যোগাযোগ ব্যক্তি',
      width: 180,
    },
    {
      field: 'mobNum',
      headerName: 'মোবাইল নম্বর',
      width: 180,
    },
    {
      field: 'address',
      headerName: 'ঠিকানা',
      width: 280,
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
                handleEdit(params.row.id);
              }}
            />
            <DeleteIcon className="table-icon delete" />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    axios
      .get(`${liveIp}vms/get-pump`)
      .then((res) => {
        setDataGrid(res.data.data);
      })
      .catch((error) => {
        errorHandler(error);
      });
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
          পেট্রোলপাম্প অন্তর্ভুক্তি
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
          <span>পেট্রোলপাম্প অন্তর্ভুক্তিকরণ</span>{' '}
          <ClearIcon sx={{ cursor: 'pointer', color: 'var(--color-delete)' }} onClick={handleClose} />{' '}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} style={{ marginTop: '1px' }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star(' নাম')}
                size="small"
                variant="outlined"
                name="name"
                value={pump?.name}
                error={pumpErr?.nameErr}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('ঠিকানা')}
                size="small"
                variant="outlined"
                name="address"
                value={pump?.address}
                error={pumpErr?.addressErr}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('যোগাযোগ ব্যক্তি')}
                size="small"
                variant="outlined"
                name="contactPerson"
                value={pump?.contactPerson}
                error={pumpErr?.contactPersonErr}
                onChange={handleChange}
                aria-describedby="component-error-text"
              />
              {/* <FormHelperText id="component-error-text" sx={{color: "red"}}>
                                  {driverError?.nidHelperText}</FormHelperText> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('মোবাইল নম্বর')}
                size="small"
                variant="outlined"
                name="mobNum"
                value={pump?.mobNum}
                error={pumpErr?.mobileErr}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <DialogActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '25px',
            }}
          >
            <Button className="btn btn-primary" onClick={handleSubmit} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সাবমিট করুন
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
