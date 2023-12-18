import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { SamityType } from '../../../../../url/coop/ApiList';

const SamityCategory = () => {
  const config = localStorageData('config');

  let samityTypeData;
  const [showDataInTable, setShowDataInTable] = useState([]);
  // const [flag, setFlag] = useState(false);
  const [value, setValue] = React.useState(null);
  //state for this component

  const [samityType, setSamityType] = useState({
    samityTypeName: '',
    samityTypeId: 0,
    // operationDate: "",
    description: '',
  });
  //variable for loading
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  let getData = async () => {
    try {
      let showData = await axios.get('http://10.11.200.30:3000/samity-type', config);
      let data = showData.data.data;
      setShowDataInTable(data);
    } catch (error) {
      errorHandler(error);
    }
  };

  //Method for getting all the details of the data
  let handleDeleteSubmit = (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteData(id),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  let deleteData = async (id) => {
    try {
      let showAcknowledge = await axios.delete(`http://10.11.200.30:3000/samity-type/${id}`, config);
      let successfull = showAcknowledge.data.message;
      NotificationManager.success(successfull, '', 5000);
      // setFlag(show);
      getData();
    } catch (error) {
      // setFlag(show);
      errorHandler(error);
    }
  };

  // const documentsname = [
  //   {
  //     value: 1,
  //     label: 'নাগরিকতের সনদ',
  //   },
  //   {
  //     value: 2,
  //     label: 'জন্ম সনদ',
  //   },
  // ];
  const handleChange = (e) => {
    setSamityType({
      ...samityType,
      [e.target.name]: e.target.value,
    });
  };

  // let handleReset = () => {
  //   setSamityType({
  //     samityTypeName: '',
  //     // operationDate: "",
  //     description: '',
  //   });
  //   setValue(null);
  // };
  //method to handle data edit
  let onEdit = (id, typeName, description, operationDate) => {
    setSamityType({
      samityTypeName: typeName,
      samityTypeId: id,
      description: description,
    });
    setValue(operationDate);
  };
  //Method for updating data
  // let onUpdateData = async (id) => {
  //   // e.preventDefault();
  //   let payload = {
  //     samityTypeName: samityType.samityTypeName,
  //     operationDate: value,
  //     description: samityType.description,
  //   };
  //   try {
  //     setLoading(true);
  //     let userData = await axios.put(`http://10.11.200.30:3000/samity-type/${id}`, payload, config);
  //     NotificationManager.success(userData.data.message, '', 5000);
  //     setLoading(false);
  //     getData();
  //     setSamityType({
  //       samityTypeName: '',
  //       // operationDate: "",
  //       description: '',
  //       samityTypeId: 0,
  //     });
  //     setValue(null);
  //   } catch (error) {
  //     setLoading(false);
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
  //On Submit Data
  let onSubmitData = async (e) => {
    e.preventDefault();

    let payload = {
      samityTypeName: samityType.samityTypeName,
      operationDate: value,
      description: samityType.description,
    };
    try {
      // setLoading(true);
      samityTypeData = await axios.post(SamityType, payload, config);
      NotificationManager.success(samityTypeData.data.message, '', 5000);
      setSamityType({
        samityTypeName: '',
        // operationDate: "",
        description: '',
      });
      setValue(null);
      // setLoading(false);
      getData();
    } catch (error) {
      // setLoading(false);
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  // const [date, setDateValue] = React.useState(null);

  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12} mx={2} mt={1} mb={1} p={2} sx={{ backgroundColor: '#F9F9F9', borderRadius: '10px' }}>
          <Grid container spacing={1.8}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="ধরন"
                name="samityTypeName"
                onChange={handleChange}
                type="text"
                value={samityType.samityTypeName}
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#FFF' }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="অপারেশনের তারিখ"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth size="small" sx={{ backgroundColor: '#FFF' }} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="বর্ণনা"
                name="description"
                onChange={handleChange}
                type="textarea"
                value={samityType.description}
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#FFF' }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container>
        <Grid item xs={12} md={12} sm={12} mx={2} my={2} sx={{ textAlign: 'center' }}>
          <Tooltip title="সংরক্ষন করুন">
            <Button
              variant="contained"
              className="btn btn-save"
              onClick={onSubmitData}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              সংরক্ষন করুন
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container p={3}>
        <Grid item md={12} xs={12}>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>আইডি নং</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>সমিতির ধরন</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>অপারেশনের তারিখ</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>বর্ণনা</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }} align="center">
                    সম্পাদন
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showDataInTable.map((row) => (
                  <TableRow
                    key={row.samityTypeId}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.samityTypeId}
                    </TableCell>
                    <TableCell>{row.typeName}</TableCell>
                    <TableCell>{row.operationDate}</TableCell>
                    <TableCell>{row.description}</TableCell>

                    <TableCell align="center">
                      <Tooltip title="সম্পাদন করুন">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => onEdit(row.samityTypeId, row.typeName, row.description, row.operationDate)}
                        >
                          <EditIcon sx={{ display: 'block' }} /> সম্পাদন করুন
                        </Button>
                      </Tooltip>
                      <Tooltip title="বাতিল করুন">
                        <Button variant="contained" color="error" onClick={() => handleDeleteSubmit(row.samityTypeId)}>
                          <DeleteIcon sx={{ display: 'block' }} />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SamityCategory;
