import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import {
  RoleCreate,
  allProjectRoute,
  districtOffice,
  getOfficeLayer,
  loanLimitRoute,
  officeName,
  upozilaOffice,
  userRoute,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';
import { errorHandler } from 'service/errorHandler';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.grey,
//     color: theme.palette.common.black,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

const TransectionSanctionLimit = () => {
  const config = localStorageData('config');

  useEffect(() => {
    getProject();
    getAllRole();
    getOfficeLayerData();
  }, []);

  const [formErrors, setFormErrors] = useState({});
  const [samityLable, setSamityLable] = useState(1);
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState([]);
  const [disable, setDisable] = useState(false);
  // const [disDisable, setDisDisable] = useState(false);
  // const [upaDisable, setUpaDisable] = useState(false);
  // const [districtId, setDistrictId] = useState(null);
  // const [districtData, setDistrictData] = useState([]);
  // const [upozillaId, setUpozillaId] = useState(null);
  // const [upozillaData, setUpozillaData] = useState([]);
  const [user, setUser] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  // const [limitRangeData, setLimitRangeData] = useState([]);
  const [loanLimitRange, setLoanLimitRange] = useState([]);
  const [doptorLayer, setDoptorLayer] = useState([]);
  const [layerWiseOfficeName, setLayerWiseOfficeName] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState({
    id: null,
    label: '',
  });
  const [officeObj] = useState({
    id: '',
    label: '',
  });
  const [layerOfficeObj, setlayerOfficeObj] = useState({
    id: null,
    label: '',
  });
  const [deskObj, setDeskObj] = useState({
    id: '',
    label: '',
  });

  const [roleData, setRoleData] = useState([]);
  const [roleName, setRoleName] = useState(null);

  const handleChange = (e) => {
    setDisable(false);
    setSamityLable(e.target.value);
    setLoanLimitRange([]);
    // setDistrictId(null);
    setProjectId(null);
    // setUpozillaId(null);
    setSelectUser(null);
    getProject();
    getDistrictData();
  };
  const handleInputChangeProjectName = (e) => {
    const { value } = e.target;
    setProjectId(value);
    if (selectUser == 'নির্বাচন করুন' || selectUser == null) {
      return;
    } else {
      limitRange(value, selectUser);
    }
  };

  // const handleInputChangeUser = (e) => {
  //   const { name, value } = e.target;
  //   setSelectUser(value);
  //   limitRange(projectId, value);
  // };
  const handleInputChangeRoleName = (e) => {
    setRoleName(null);
    const { value } = e.target;
    roleLimitRange(value);
    setRoleName(value);
  };
  const loanLimit = (e, ind) => {
    let loanLimitRangeArray = [...loanLimitRange];
    const { value } = e.target;
    if (!loanLimitRangeArray[ind]['isFirstTime']) {
      loanLimitRangeArray[ind]['limitAmount'] = '';
      loanLimitRangeArray[ind]['isFirstTime'] = true;
      setLoanLimitRange(loanLimitRangeArray);
      return;
    }
    'value in handlechnage--', value;
    loanLimitRangeArray[ind]['limitAmount'] = value.replace(/\D/g, '');
    setLoanLimitRange(loanLimitRangeArray);
  };
  // const transactionLimit = (e, ind) => {
  //   let transactionLimitRange = [...limitRangeData];
  //   const { name, value } = e.target;
  //   if (!transactionLimitRange[ind]['isFirstTime']) {
  //     transactionLimitRange[ind]['limitAmount'] = ' ';
  //     transactionLimitRange[ind]['isFirstTime'] = true;
  //     setLimitRangeData(transactionLimitRange);
  //     return;
  //   }
  //   transactionLimitRange[ind]['limitAmount'] = e.target.value.replace(/\D/g, '');
  //   setLimitRangeData(transactionLimitRange);
  // };
  let getOfficeLayerData = async () => {
    try {
      let officeLayerData = await axios.get(getOfficeLayer, config);
      setDoptorLayer(officeLayerData.data.data);
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
  let getLayerWiseOffice = async (layerId) => {
    try {
      let officeData = await axios.get(officeName + '?layer=' + layerId, config);
      setLayerWiseOfficeName(officeData.data.data);
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
  const getProject = async () => {
    try {
      const project = await axios.get(allProjectRoute, config);
      let projectList = project.data.data;
      if (projectList.length == 1) {
        setProjectId(projectList[0].id);
        setDisable(true);
      }
      setProjectName(projectList);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getDistrictData = async () => {
    try {
      const district = await axios.get(districtOffice, config);
      let districtList = district.data.data;
      if (districtList.length == 1) {
        // setDistrictId(districtList[0].id);
        // setDisDisable(true);
        getUpozilaData(districtList[0].id);
      }
      // setDistrictData(districtList);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getUpozilaData = async (districtId) => {
    try {
      const upozilla = await axios.get(upozilaOffice + '?districtOfficeId=' + districtId, config);
      let upozillaList = upozilla.data.data;
      if (upozillaList.length == 1) {
        // setUpozillaId([upozillaList[0].id]);
        // setUpaDisable(true);
      }
      // setUpozillaData(upozillaList);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
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
  const getAllRole = async () => {
    try {
      const roleList = await axios.get(RoleCreate + '?user=0', config);
      const roleListData = roleList.data.data;
      setRoleData(roleListData);
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
  const limitRange = async (projectId, user) => {
    try {
      const limitRangeData = await axios.get(
        loanLimitRoute + '?projectId=' + projectId + '&userId=' + user + '&status=2',
        config,
      );
      const limitRangeList = limitRangeData.data.data;
      const newLimitRangeList = limitRangeList.productLoanApprove.map((item) => {
        item.isFirstTime = false;
        return item;
      });
      setLoanLimitRange(newLimitRangeList);
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
  const roleLimitRange = async (roleId) => {
    let role = roleId;
    let project = projectId;
    try {
      const limitRangeData = await axios.get(
        loanLimitRoute + '?projectId=' + project + '&roleId=' + role + '&status=1',
        config,
      );
      const limitRangeList = limitRangeData.data.data;
      const newLimitRangeList = limitRangeList.productLoanApprove.map((item) => {
        item.isFirstTime = false;
        return item;
      });
      setLoanLimitRange(newLimitRangeList);
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

  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };
    if (projectId == null || projectId == 'নির্বাচন করুন') {
      result = false;
      formErrors.projectId = 'প্রকল্প নির্বাচন করুন';
    }
    if (samityLable == 1 && roleName == null) {
      result = false;
      formErrors.roleName = 'রোলের তালিকা নির্বাচন করুন';
    }
    if (samityLable == 2 && layerOfficeObj.id == null) {
      result = false;
      formErrors.officeName = 'ব্যবহারকারীর অফিস নির্বাচন করুন';
    }

    if (samityLable == 2 && selectedLayer.id == null) {
      result = false;
      formErrors.nextDesk = 'দপ্তর লেয়ার নির্বাচন করুন';
    }

    if ((samityLable == 2 && selectUser == null) || selectUser == 'নির্বাচন করুন') {
      result = false;
      formErrors.selectUser = 'ব্যবহারকারী নির্বাচন করুন';
    }
    setFormErrors(formErrors);
    return result;
  };

  const onSubmitData = async () => {
    const productLoanApproveList = loanLimitRange.map((item) => {
      if (item.id == null) {
        delete item['id'];
        delete item['isFirstTime'];
        delete item['productName'];
        item.userId = parseInt(selectUser);
        item.projectId = parseInt(projectId);
        item.limitAmount = item.limitAmount ? parseInt(item.limitAmount) : 0;
        // limitTypeId: parseInt(item.limitTypeId);
      } else {
        delete item['productName'];
        delete item['isFirstTime'];
        item.userId = selectUser;
        item.projectId = projectId;
        item.limitAmount = item.limitAmount ? parseInt(item.limitAmount) : 0;
        // limitTypeId: item.limitTypeId;
      }
      return item;
    });
    let payload;
    payload = {
      saveStatus: samityLable,
      loanApproveLimit: productLoanApproveList,
      roleId: roleName,
    };
    let result = checkMandatory();
    if (result) {
      try {
        let selectedMember = await axios.post(loanLimitRoute, payload, config);
        NotificationManager.success(selectedMember.data.message, ' ', 5000);
        setSelectUser('নির্বাচন করুন');
        setLoanLimitRange([]);
        // setLimitRangeData([]);
        setlayerOfficeObj({
          id: null,
          label: '',
        });
        setSelectedLayer({
          id: null,
          label: '',
        });
        setDeskObj({
          id: null,
          label: '',
        });
      } catch (error) {
        errorHandler(error)
      }
    }
  };

  // let handleFocus = (e, i) => {
  //   let newArray = [...loanLimitRange];
  //   newArray[i]["limitAmount"] = "";
  //   setLoanLimitRange(newArray);
  // };

  return (
    <>
      <Grid container className="section">
        <Grid item md={12} xs={12} sx={{ textAlign: 'center' }}>
          <FormControl component="fieldset">
            <RadioGroup row aria-label="123" name="samityLevel" value={samityLable} onChange={handleChange}>
              <FormControlLabel value="1" control={<Radio />} defaultValue="p" label="রোলের ভিত্তিতে" />
              <FormControlLabel value="2" control={<Radio />} defaultValue="p" label="ব্যবহারকারীর ভিত্তিতে" />
              {/* <FormControlLabel value="3" control={<Radio />} defaultValue="p" label="পদবীর ভিত্তিতে" /> */}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item md={12} xs={12}>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <TextField
                id="projectId"
                fullWidth
                label={star('প্রকল্পের  নাম')}
                select
                disabled={disable}
                SelectProps={{ native: true }}
                onChange={(e) => handleInputChangeProjectName(e)}
                type="text"
                variant="outlined"
                size="small"
                value={projectId ? projectId : ' '}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {projectName.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.projectNameBangla ? option.projectNameBangla : ' '}
                  </option>
                ))}
              </TextField>
              {(projectId == 'নির্বাচন করুন' || !projectId) && (
                <span style={{ color: 'red' }}>{formErrors.projectId}</span>
              )}
            </Grid>
            {samityLable == '1' && (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label={star('রোলের তালিকা')}
                  name="roleName"
                  select
                  SelectProps={{ native: true }}
                  onChange={(e) => handleInputChangeRoleName(e)}
                  variant="outlined"
                  size="small"
                // value={districtId != null ? districtId : ""}
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {roleData.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.roleName}
                    </option>
                  ))}
                </TextField>
                {!roleName && <span style={{ color: 'red' }}>{formErrors.roleName}</span>}
              </Grid>
            )}

            {samityLable && samityLable == '2' ? (
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
                      setLayerWiseOfficeName([]);
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
                      label={officeObj.id ? star('দপ্তর লেয়ার') : star('দপ্তর লেয়ার নির্বাচন করুন')}
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: '#FFF', margin: '5dp' }}
                    />
                  )}
                />
                {selectedLayer.id == null && <span style={{ color: 'red' }}>{formErrors.nextDesk}</span>}
              </Grid>
            ) : (
              ' '
            )}
            {samityLable && samityLable == '2' ? (
              <Grid item md={6} xs={12}>
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
                      label={officeObj.id ? star('ব্যবহারকারীর অফিস') : star('ব্যবহারকারীর অফিস নির্বাচন করুন ')}
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: '#FFF', margin: '5dp' }}
                    />
                  )}
                />
                {!layerOfficeObj.id && <span style={{ color: 'red' }}>{formErrors.officeName}</span>}
              </Grid>
            ) : (
              ''
            )}
            {samityLable && samityLable == '2' ? (
              <Grid item md={6} xs={12}>
                {/* <TextField
                fullWidth
                select
                label={star("ব্যবহারকারী")}
                name="samityName"
                onChange={(e) => handleInputChangeUser(e)}
                SelectProps={{ native: true }}
                type="text"
                variant="outlined"
                size="small"
                value={selectUser ? selectUser : " "}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {user ? user.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.nameBn} -{option.designationBn}
                  </option>
                )) : ""}
              </TextField> */}
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
                      setSelectUser(null);
                    } else {
                      value &&
                        setDeskObj({
                          id: value.id,
                          label: value.label,
                        });
                      //getDeskId(value.id);
                      limitRange(projectId, value.id);
                      setSelectUser(value.id);
                    }
                    // ("VVVVVV",value);
                  }}
                  options={user
                    .map((option) => ({
                      id: option.id,
                      label: option.nameBn,
                    }))
                    .filter((e) => e.id != null && e.employeeId !== null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label={deskObj.id === '' ? star('ব্যবহারকারীর নাম নির্বাচন করুন') : star('ব্যবহারকারীর নাম')}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  value={deskObj}
                />
                {(selectUser == 'নির্বাচন করুন' || !selectUser) && (
                  <span style={{ color: 'red' }}>{formErrors.selectUser}</span>
                )}
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section" spacing={2.5}>
        <Grid item md={12} xs={12}>
          <SubHeading>ঋণ অনুমোদনের সীমা</SubHeading>
          <Grid container>
            <Grid item lg={12} md={12} xs={12}>
              <Box>
                <TableContainer className="table-container">
                  <Table aria-label="customized table" size="small">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell>প্রোডাক্টের নাম</TableCell>
                        <TableCell align="right">পরিমাণ (টাকা)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loanLimitRange && loanLimitRange.length > 0
                        ? loanLimitRange.map((info, i) => (
                          <TableRow key={i}>
                            <TableCell scope="row">{info.productName}</TableCell>
                            <TableCell scope="row" align="right">
                              <TextField
                                className="table-input"
                                name="limitAmount"
                                fullWidth
                                // dir="ltr"
                                onChange={(e) => loanLimit(e, i)}
                                type="text"
                                variant="outlined"
                                size="small"
                                style={{ backgroundColor: '#FFF' }}
                                value={info.limitAmount}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
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

export default TransectionSanctionLimit;
