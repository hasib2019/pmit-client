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
// import { styled } from '@mui/material/styles';
// import { tableCellClasses } from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import engToBdNum from '../../../../../service/englishToBanglaDigit';
import {
  allProjectRoute,
  employeeRecordByOffice,
  getOfficeLayer,
  officeName,
  projectAssignPostRoute,
  userRoute,
} from '../../../../../url/ApiList';
import SubHeading from '../../../../shared/others/SubHeading';
import star from '../../../loan-management/loan-application/utils';


const ProjectAssignToUser = () => {
  // const token = localStorageData('token');
  // const getTokenData = tokenData(token);
  const officeInfo = localStorageData('officeGeoData');
  // const officeId = getTokenData?.officeId;
  // const layerId = getTokenData?.layerId;
  const config = localStorageData('config');

  const [formErrors, setFormErrors] = useState({});
  const [user, setUser] = useState([]);

  const [allProject, setAllProject] = useState([]);

  const [selectedData, setSelectedData] = useState([]);
  const [deskList, setDeskList] = useState([]);


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [officeNames, setOfficeNames] = useState([]);
  const [layerWiseOfficeName, setLayerWiseOfficeName] = useState([]);
  const [officeObj, setOfficeObj] = useState({
    id: officeInfo?.id,
    label: officeInfo?.nameBn,
  });
  const [userObj, setUserObj] = useState({
    id: null,
    label: '',
  });
  const [deskObj, setDeskObj] = useState({
    id: null,
    label: '',
  });
  const [layerOfficeObj, setlayerOfficeObj] = useState({
    id: null,
    label: '',
  });
  const [doptorLayer, setDoptorLayer] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState({
    id: null,
    label: '',
  });
  useEffect(() => {
    getOfficeLayerData();
    getOfficeName();
    if (officeInfo?.id) getDeskId(officeInfo?.id);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleUser = (e) => {
  //   const { name, value } = e.target;
  //   setSelectUser(value);
  // };
  // const handleDesk = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedDesk(value);
  // };
  const handleCheckAccepted = (id) => {
    let data = allProject;
    const item = data.find((d) => d.id === id);
    const selectedArray = [...selectedData];
    let filteredArray;
    if (item.isChecked) {
      item.isChecked = false;
      filteredArray = selectedArray.filter((d) => d.id != id);
      setSelectedData(filteredArray);
    } else {
      item.isChecked = true;
      selectedArray.push(item);
      setSelectedData(selectedArray);
    }
    setAllProject(data);
  };

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
      if (error.response) {
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      if (error.response) {
        NotificationManager.error(error.message);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...');
      } else if (error) {
        NotificationManager.error(error.toString());
      }
    }
  };

  let getLayerWiseOffice = async (layerId) => {
    try {
      let offices;
      let officeData = await axios.get(officeName + '?layerId=' + layerId, config);
      offices = officeData.data.data;
      // if (officeData && officeData.data.data.length > 0) {
      //   offices = officeData.data.data.filter((elem) => elem.id == officeId);
      // }
      setLayerWiseOfficeName(offices);
    } catch (error) {
      if (error.response) {
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };
    if (selectedLayer.id == null) {
      result = false;
      formErrors.selectedLayer = 'দপ্তর লেয়ার নির্বাচন করুন';
    }
    if (layerOfficeObj.id == null) {
      result = false;
      formErrors.layerOffice = 'ব্যবহারকারীর অফিস নির্বাচন করুন';
    }
    if (officeObj.id == null) {
      result = false;
      formErrors.observerOffice = 'পর্যবেক্ষনকারীর কার্যালয় নির্বাচন করুন';
    }
    if (userObj.id == null) {
      result = false;
      formErrors.selectUser = 'ব্যবহারকারী নির্বাচন করুন';
    }
    if (deskObj.id == null) {
      result = false;
      formErrors.selectedDesk = 'অনুমোদনকারী নির্বাচন করুন';
    }
    setFormErrors(formErrors);
    return result;
  };
  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;

    // const idArray = [...selectedData];
    // idArray = idArray.map((item) => item.id);
    payload = {
      projectId: null,
      samityId: null,
      data: {
        userId: userObj?.id ? parseInt(userObj?.id) : '',
        projects: allProject ? allProject : [],
      },
      nextAppDesignationId: deskObj?.id ? parseInt(deskObj?.id) : '',
    };
    const compoName = localStorageData('componentName');

    if (result) {
      try {
        const assignProject = await axios.post(projectAssignPostRoute + '/' + compoName, payload, config);
        NotificationManager.success(assignProject.data.message, '', 5000);
        setSelectedData([]);
        setOfficeObj({
          id: null,
          label: '',
        });
        setUserObj({
          id: null,
          label: '',
        });
        setDeskObj({
          id: null,
          label: '',
        });
        setlayerOfficeObj({
          id: null,
          label: '',
        });
        setSelectedLayer({
          id: null,
          label: '',
        });
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
  const getUser = async (officeId) => {
    try {
      const userData = await axios.get(userRoute + '?officeId=' + officeId, config);
      const userDataList = userData.data.data;
      setUser(userDataList);
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

  const getProject = async (userId) => {
    try {
      const projectData = await axios.get(allProjectRoute + '?userId=' + userId, config);
      let allProjectData = projectData.data.data;
      allProjectData.map((val) => {
        val.isChecked = val.assignStatus;
      });
      setAllProject(allProjectData);
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

  const getDeskId = async (id) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, config);
      const deskData = Data.data.data;
      // if (deskData.length == 1) {
      //   setSelectedDesk(deskData[0].designationId);
      //   document.getElementById("deskId").setAttribute("disabled", "true");
      // }
      setDeskList(deskData);
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

  const onRowsPerPageChange = (e) => {
    const { value } = e.target;
    setRowsPerPage(value);
  };
  return (
    <>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <Grid container spacing={2.5}>
            <Grid item md={3} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="layerName"
                onChange={(event, value) => {
                  setLayerWiseOfficeName([]);
                  if (value == null) {
                    setSelectedLayer({
                      id: null,
                      label: '',
                    });
                  } else {
                    value &&
                      setSelectedLayer({
                        id: value.id,
                        label: value.label,
                      });
                    getLayerWiseOffice(value.id);
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
                    label={officeObj.id ? star('দপ্তরের লেয়ার ') : star('দপ্তরের লেয়ার নির্বাচন করুন ')}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  />
                )}
                value={selectedLayer}
              />
              {selectedLayer.id == null && <span style={{ color: 'red' }}>{formErrors.selectedLayer}</span>}
            </Grid>
            <Grid item lg={5} md={5} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="officeName"
                onChange={(event, value) => {
                  if (value == null) {
                    setlayerOfficeObj({
                      id: null,
                      label: '',
                    });
                    // setEmployee([]);
                  } else {
                    value &&
                      setlayerOfficeObj({
                        id: value.id,
                        label: value.label,
                      });
                    getUser(value.id);
                  }
                }}
                options={layerWiseOfficeName.map((option) => {
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
                      layerOfficeObj.id == '' ? star('ব্যবহারকারীর অফিস') : star('ব্যবহারকারীর অফিস নির্বাচন করুন ')
                    }
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  />
                )}
                value={layerOfficeObj}
              />
              {layerOfficeObj.id == null && <span style={{ color: 'red' }}>{formErrors.layerOffice}</span>}
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="userName"
                onChange={(event, value) => {
                  if (value == null) {
                    setUserObj({
                      id: null,
                      label: '',
                    });
                    setAllProject([]);
                  } else {
                    value &&
                      setUserObj({
                        id: value.id,
                        label: value.label,
                      });
                    getProject(value.id);
                  }
                  // ("VVVVVV",value);
                }}
                options={user.map((option) => {
                  return {
                    id: option.id,
                    label: option.nameBn,
                  };
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={setUserObj.id === null ? star('ব্যবহারকারীর নাম') : star('ব্যবহারকারীর নাম নির্বাচন করুন')}
                    variant="outlined"
                    size="small"
                  />
                )}
                value={userObj}
              />
              {userObj.id == null && <span style={{ color: 'red' }}>{formErrors.selectUser}</span>}
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
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
                    setDeskList([]);
                  } else {
                    value &&
                      setOfficeObj({
                        id: value.id,
                        label: value.label,
                      });
                    getDeskId(value.id);
                  }
                }}
                options={officeNames.map((option) => {
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
                      officeObj.id === null
                        ? star('পর্যবেক্ষনকারীর কার্যালয় নির্বাচন করুন')
                        : star('পর্যবেক্ষনকারীর কার্যালয় ')
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
                value={officeObj}
              />
              {officeObj.id == null && <span style={{ color: 'red' }}>{formErrors.observerOffice}</span>}
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
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
                options={deskList
                  .filter((e) => e.nameBn != null && e.designationId != null)
                  .map((option) => ({
                    id: option.designationId,
                    label: option.nameBn,
                  }))}
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
              {deskObj.id == null && <span style={{ color: 'red' }}>{formErrors.selectedDesk}</span>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item xs={12}>
          <Box>
            <SubHeading>প্রকল্পের বিস্তারিত তথ্য</SubHeading>
            <TableContainer className="table-container">
              <Table>
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell width="5%">ক্রমিক নং</TableCell>
                    <TableCell>প্রকল্পের নাম</TableCell>
                    <TableCell width="1%">ব্যবহারকারীকে প্রকল্প বরাদ্দ করুন</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allProject.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell scope="row" align="center">
                        {engToBdNum(page * rowsPerPage + (i + 1))}
                      </TableCell>
                      <TableCell scope="row">
                        <Tooltip title={<div className="tooltip-title">{item.projectNameBangla}</div>}>
                          <span className="data">{item.projectNameBangla}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell scope="row" align="center">
                        <span>
                          <Checkbox
                            sx={{ padding: '5px' }}
                            checked={item.isChecked}
                            onClick={(e) => {
                              handleCheckAccepted(item.id, e);
                            }}
                          />
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                className="sticky-pagination"
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={allProject.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
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

export default ProjectAssignToUser;
