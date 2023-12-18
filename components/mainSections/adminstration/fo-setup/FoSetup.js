import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Box,
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
import { localStorageData } from 'service/common';
import engToBdNum from '../../../../service/englishToBanglaDigit';
import { employeeRecordByOffice, fieldOfficerApplication, memberByOffice, officeName } from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';





const FoSetup = () => {
  const config = localStorageData('config');
  const [formErrors, setFormErrors] = useState({});
  const [officeNameData, setOfficeNameData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [adminEmployee, setAdminEmployee] = useState([]);
  const [nextDesk, setNextDask] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [adminOfficeObj, setAdminOfficeObj] = useState({
    id: '',
    label: '',
  });

  useEffect(() => {
    getOfficeName();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleNextDesk = (e) => {
    const { value } = e.target;
    setNextDask(value);
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
    // setEmployee(data);
  };

  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };
    if (nextDesk == null || nextDesk == 'নির্বাচন করুন') {
      result = false;
      formErrors.nextDesk = 'পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন';
    }
    setFormErrors(formErrors);
    return result;
  };

  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    const idArray = [...selectedData];
    'selected array length', idArray.length;
    if (result && idArray.length > 0) {
      payload = {
        nextAppDesignationId: nextDesk ? parseInt(nextDesk) : ' ',
        data: {
          fieldOfficerData: idArray,
        },
      };
      'Payload Value ===========', payload;
      try {
        const assignProject = await axios.post(fieldOfficerApplication, payload, config);

        setEmployee([]);
        setSelectedData([]);
        NotificationManager.success(assignProject.data.message, '', 5000);
      } catch (error) {
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
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

  let getOfficeName = async () => {
    try {
      let officeData = await axios.get(officeName, config);
      setOfficeNameData(officeData.data.data);
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

  const getMemberByOffice = async (officeId) => {
    if (officeId) {
      try {
        const employeeData = await axios.get(memberByOffice + officeId, config);
        let employeeDataList = employeeData.data.data;

        employeeDataList.map((val) => {
          val.isChecked = false;
        });
        setEmployee(employeeDataList);
      } catch (error) {
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
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
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
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
  const onRowsPerPageChange = (e) => {
    const { value } = e.target;
    setRowsPerPage(value);
  };

  return (
    <>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <Grid container spacing={2.5}>
            <Grid item md={4} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="officeName"
                onChange={(event, value) => {
                  if (value == null) {
                    setOfficeObj({
                      id: '',
                      label: '',
                    });
                    setEmployee([]);
                  } else {
                    value &&
                      setOfficeObj({
                        id: value.id,
                        label: value.label,
                      });
                    getMemberByOffice(value.id);
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
                    label={officeObj.id ? 'মাঠকর্মীর অফিস' : 'মাঠকর্মীর অফিস নির্বাচন করুন '}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="officeName"
                onChange={(event, value) => {
                  if (value == null) {
                    setAdminOfficeObj({
                      id: '',
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
                      adminOfficeObj.id ? 'পর্যবেক্ষক/অনুমোদনকারীর অফিস' : 'পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন'
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <TextField
                fullWidth
                id="deskId"
                label={star('পর্যবেক্ষক/অনুমোদনকারী')}
                name="serviceId"
                onChange={handleNextDesk}
                select
                SelectProps={{ native: true }}
                value={nextDesk ? nextDesk : ' '}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {adminEmployee
                  ? adminEmployee.map((option) => (
                    <option key={option.designationId} value={option.designationId}>
                      {option.nameBn} - {option.designation}
                    </option>
                  ))
                  : ''}
              </TextField>

              {!nextDesk && <span style={{ color: 'red' }}>{formErrors.nextDesk}</span>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <Box>
            <SubHeading>কর্মকর্তা / কর্মচারীর তথ্য</SubHeading>
            <TableContainer className="table-container">
              <Table aria-label="customized table" size="small">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center">ক্রমিক</TableCell>
                    <TableCell>নাম</TableCell>
                    <TableCell>পদবী</TableCell>
                    <TableCell>ব্যবহারকারীকে বরাদ্দ করুন</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employee
                    ? employee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell scope="row" align="center">
                          {engToBdNum(page * rowsPerPage + (i + 1))}
                        </TableCell>
                        <TableCell scope="row">{item.employeeName}</TableCell>
                        <TableCell scope="row">{item.designationBn}</TableCell>
                        <TableCell scope="row">
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
                rowsPerPageOptions={[2, 5, 10, 25, 50]}
                onRowsPerPageChange={onRowsPerPageChange}
              />
            </TableContainer>
          </Box>
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

export default FoSetup;
