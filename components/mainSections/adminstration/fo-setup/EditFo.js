import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Button,
  Checkbox,
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

import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import {
  employeeRecordByOffice,
  getOfficeLayer,
  memberByOffice,
  officeName,
  specificApplication,
} from '../../../../url/ApiList';
import star from '../../loan-management/loan-application/utils';
;

import { localStorageData } from 'service/common';
import engToBdNum from 'service/englishToBanglaDigit';
import SubHeading from '../../../shared/others/SubHeading';

const EditFo = () => {
  // const token = localStorageData('token');
  // const getTokenData = tokenData(token);
  // const officeId = getTokenData?.officeId;
  // const layerId = getTokenData?.layerId;
  const config = localStorageData('config');

  const [employee, setEmployee] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [officeNameData, setOfficeNameData] = useState([]);
  const [adminEmployee, setAdminEmployee] = useState([]);

  const [nextDesk] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const [doptorLayer, setDoptorLayer] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState({
    id: null,
    label: '',
  });
  const [deskObj, setDeskObj] = useState({
    id: null,
    label: '',
  });
  const [officeObj, setOfficeObj] = useState({
    id: null,
    label: '',
  });
  const [adminOfficeObj, setAdminOfficeObj] = useState({
    id: null,
    label: '',
  });

  useEffect(() => {
    getOfficeLayerData();
    // getOfficeName();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleNextDesk = (e) => {
  //   const { name, value } = e.target;
  //   setNextDask(value);
  // };

  let getOfficeLayerData = async () => {
    try {
      let officeData;
      let officeLayerData = await axios.get(getOfficeLayer, config);
      officeData = officeLayerData.data.data;
      // if (officeLayerData && officeLayerData.data.data.length > 0) {
      //   officeData = officeLayerData.data.data.filter(
      //     (elem) => elem.id == layerId
      //   );
      // }
      setDoptorLayer(officeData);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let getOfficeName = async (layerId) => {
    try {
      let offices;
      let officeData = await axios.get(officeName + '?layer=' + layerId, config);
      offices = officeData.data.data;
      // if (officeData && officeData.data.data.length > 0) {
      //   offices = officeData.data.data.filter((elem) => elem.id == officeId);
      // }
      setOfficeNameData(offices);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  const handleCheckAccepted = (id) => {
    let data = employee;
    const item = data.find((d) => d.designationId === id);
    const selectedArray = [...selectedData];
    let filteredArray;
    if (item.isChecked) {
      item.isChecked = false;
      filteredArray = selectedArray.filter((d) => d.designationId != id);
      setSelectedData(filteredArray);
    } else {
      item.isChecked = true;
      selectedArray.push(item);
      setSelectedData(selectedArray);
    }
    setEmployee(data);
  };

  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };
    if (selectedLayer.id == null) {
      result = false;
      formErrors.selectedLayer = 'দপ্তর লেয়ার নির্বাচন করুন';
    }
    if (officeObj.id == null) {
      result = false;
      formErrors.officeName = 'মাঠকর্মীর অফিস নির্বাচন করুন';
    }
    if (adminOfficeObj.id == null) {
      result = false;
      formErrors.observerOffice = 'পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন';
    }
    if (deskObj.id == null || deskObj.id == 'নির্বাচন করুন') {
      result = false;
      formErrors.nextDesk = 'পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন';
    }
    setFormErrors(formErrors);
    return result;
  };

  const getEmployee = async (officeId) => {
    try {
      const employeeData = await axios.get(memberByOffice + officeId + '?allEmployeeStatus=true', config);
      let employeeDataList = employeeData.data.data;

      employeeDataList.map((val) => {
        val.isChecked = val.foStatus;
      });
      setEmployee(employeeDataList);
    } catch (error) {
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

  const getMemberByAdmin = async (officeId) => {
    if (officeId) {
      try {
        const employeeData = await axios.get(employeeRecordByOffice + '?officeId=' + officeId, config);
        let employeeDataList = employeeData.data.data;

        employeeDataList.map((val) => {
          val.isChecked = false;
        });
        setAdminEmployee(employeeDataList);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    payload = {
      nextAppDesignationId: deskObj?.id ? parseInt(deskObj.id) : '',
      projectId: null,
      samityId: null,
      data: {
        fieldOfficerData: employee,
      },
    };
    if (result) {
      try {
        const compoName = localStorageData('componentName');
        const assignProject = await axios.post(
          specificApplication + 'updateFieldOfficer' + '/' + compoName,
          payload,
          config,
        );

        setEmployee([]);
        setAdminOfficeObj({
          id: null,
          label: '',
        });
        setOfficeObj({
          id: null,
          label: '',
        });
        setDeskObj({
          id: null,
          label: '',
        });
        setSelectedLayer({
          id: null,
          label: '',
        });
        NotificationManager.success(assignProject.data.message, '', 5000);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  return (
    <>
      <Grid container mb={5}>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="layerName"
                onChange={(event, value) => {
                  if (value == null) {
                    setSelectedLayer({
                      id: null,
                      label: '',
                    });
                    setEmployee([]);
                  } else {
                    value &&
                      setSelectedLayer({
                        id: value.id,
                        label: value.label,
                      });
                    getOfficeName(value.id);
                  }
                }}
                options={doptorLayer.map((option) => {
                  return {
                    id: option.id,
                    label: option.nameBn,
                  };
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={officeObj.id ? star('দপ্তর লেয়ার ') : star('দপ্তর লেয়ার নির্বাচন করুন ')}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  />
                )}
              />
              {selectedLayer.id == null && <span style={{ color: 'red' }}>{formErrors.selectedLayer}</span>}
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="officeName"
                onChange={(event, value) => {
                  if (value == null) {
                    setOfficeObj({
                      id: null,
                      label: '',
                    });
                    setEmployee([]);
                  } else {
                    value &&
                      setOfficeObj({
                        id: value.id,
                        label: value.label,
                      });
                    getEmployee(value.id);
                  }
                }}
                options={officeNameData.map((option) => {
                  return {
                    id: option.id,
                    label: option.nameBn,
                  };
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={officeObj.id ? star('মাঠকর্মীর অফিস') : star('মাঠকর্মীর অফিস নির্বাচন করুন')}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  />
                )}
              />
              {officeObj.id == null && <span style={{ color: 'red' }}>{formErrors.officeName}</span>}
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="officeName"
                onChange={(event, value) => {
                  if (value == null) {
                    setAdminOfficeObj({
                      id: null,
                      label: '',
                    });
                    setAdminEmployee([]);
                  } else {
                    value &&
                      setAdminOfficeObj({
                        id: value.id,
                        label: value.label,
                      });

                    getMemberByAdmin(value.id);
                  }
                }}
                options={officeNameData.map((option) => {
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
                      adminOfficeObj.id
                        ? star('পর্যবেক্ষক/অনুমোদনকারীর অফিস')
                        : star('পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন')
                    }
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  />
                )}
              />
              {adminOfficeObj.id == null && <span style={{ color: 'red' }}>{formErrors.observerOffice}</span>}
            </Grid>

            <Grid item lg={6} md={4} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="serviceName"
                onChange={(event, value) => {
                  if (value == null) {
                    setDeskObj({
                      id: null,
                      label: '',
                    });
                  } else {
                    value &&
                      setDeskObj({
                        id: value.id,
                        label: value.label,
                      });
                  }
                }}
                options={adminEmployee
                  .map((option) => ({
                    id: option.designationId,
                    label: option.nameBn ? option.nameBn : '' + '-' + option.designation,
                  }))
                  .filter((e) => e.designationId !== null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={
                      deskObj.id === ''
                        ? star('পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন')
                        : star('পর্যবেক্ষক/অনুমোদনকারীর নাম')
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
                value={deskObj}
              />

              {!nextDesk && <span style={{ color: 'red' }}>{formErrors.nextDesk}</span>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item lg={12} md={12} xs={12}>
          <SubHeading>কর্মকর্তা / কর্মচারীর তথ্য</SubHeading>
          <TableContainer className="table-container">
            <Table aria-label="customized table" size="small">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">ক্রমিক নং</TableCell>
                  <TableCell>কর্মকর্তা/কর্মচারীর নাম</TableCell>
                  <TableCell>পদবী</TableCell>
                  <TableCell align="center">মাঠকর্মীর অবস্থা</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee
                  ? employee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell scope="row" align="center">
                        {engToBdNum(page * rowsPerPage + (i + 1))}
                      </TableCell>
                      <TableCell scope="row">
                        <Tooltip title={<div className="tooltip-title">{item.employeeName}</div>} arrow>
                          <span className="data">{item.employeeName}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell scope="row">
                        <Tooltip title={<div className="tooltip-title">{item.designationBn}</div>} arrow>
                          <span className="data">{item.designationBn}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell scope="row" align="center">
                        <Checkbox
                          checked={item.isChecked}
                          onClick={(e) => {
                            handleCheckAccepted(item.designationId, e);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                  : ''}
              </TableBody>
            </Table>
            <TablePagination
              className="sticky-pagination"
              component="div"
              count={employee.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {' '}
            সংরক্ষণ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default EditFo;
