/* eslint-disable no-misleading-character-class */

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import engToBdNum from '../../../../service/englishToBanglaDigit';
import {
  districtRoute,
  getDolMember,
  getSamityByZone,
  groupForApprove,
  loanProject,
  upazilaRoute,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';





const GroupRegistration = () => {
  const config = localStorageData('config');

  useEffect(() => {
    getDistrictData();
    getProject();
  }, []);

  const [formErrors, setFormErrors] = useState({});
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState([]);

  const [districtId, setDistrictId] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [upozillaId, setUpozillaId] = useState(null);
  const [upaCityType, setUpaCityType] = useState(null);

  const [upozillaData, setUpozillaData] = useState([]);
  const [samityId, setSamityId] = useState(null);
  const [samityData, setSamityData] = useState([]);
  const [memberInfo, setMemberInfo] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [value] = useState(true);
  const [groupInfo, setGroupInfo] = useState({
    dolName: '',
    value: true,
  });

  const [samityNameObj, setSamityNameObj] = useState({
    id: '',
    label: '',
  });

  let regexResultFunc = (regex, value) => {
    return regex.test(value);
  };
  const handleChange = (e) => {
    const { value } = e.target;
    //setValue(checked);
    // setGroupInfo({
    //   ...groupInfo,
    //   [e.target.name]: e.target.value,
    // });
    if (regexResultFunc(/[A-Za-z]/gi, value)) {
      setGroupInfo({
        ...groupInfo,
        [e.target.name]: e.target.value.replace(/[^A-Za-z0-9\s-]/gi, ''),
      });
      return;
    } else {
      setGroupInfo({
        ...groupInfo,
        [e.target.name]: e.target.value.replace(
          /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA -]/gi,
          '',
        ),
      });
      return;
    }
  };

  const handleInputChangeDistrict = (e) => {
    const { value } = e.target;
    setDistrictId(value);
    getUpozilaData(value);
  };

  const handleInputChangeUpazila = (e) => {
    const { value } = e.target;
    const idType = value.split(',');
    setUpozillaId(idType[0]);
    setUpaCityType(idType[1]);
    getSamity(projectId, districtId, idType[0]);
  };

  const handleInputChangeProjectName = (e) => {
    let upazilla = upozillaId;
    const { value } = e.target;
    setProjectId(value);
    if (upazilla && upazilla.length == 1) {
      let id = upazilla[0].split(',');
      getSamity(value, districtId, id[0]);
    } else {
      getSamity(value, districtId, upozillaId);
    }
    setMemberInfo([]);
    setSelectedData([]);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCheckAccepted = (id) => {
    let data = memberInfo;
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
    setMemberInfo(data);
  };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
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
      const district = await axios.get(districtRoute, config);

      let districtList = district.data.data;
      if (districtList.length == 1) {
        setDistrictId(districtList[0].id);
        document.getElementById('districtId').setAttribute('disabled', 'true');
        getUpozilaData(districtList[0].id);
      }
      setDistrictData(districtList);
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
      const upozilla = await axios.get(upazilaRoute + '?district=' + districtId, config);
      let upozillaList = upozilla.data.data;
      let newUpazilaList = upozillaList.map((obj) => {
        obj['upaCityIdType'] = obj['upaCityId'] + ',' + obj['upaCityType'];
        return obj;
      });

      if (newUpazilaList.length == 1) {
        setUpozillaId([newUpazilaList[0].upaCityIdType]);
        setUpaCityType(newUpazilaList[0].upaCityType);
        document.getElementById('upozillaId').setAttribute('disabled', 'true');
      }
      setUpozillaData(newUpazilaList);
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
  const getSamity = async (projectId, disId, upaId) => {
    if (projectId != null) {
      try {
        const samity = await axios.get(
          getSamityByZone +
          '?districtId=' +
          disId +
          '&upazilaId=' +
          upaId +
          '&projectId=' +
          projectId +
          '&value=1' +
          '&upaCityType=' +
          upaCityType,
          config,
        );

        let samityList = samity.data.data;
        setSamityData(samityList);
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
    }
  };

  const getAllMember = async (samityId) => {
    try {
      const data = await axios.get(getDolMember + '?samityId=' + samityId + '&flag=2', config);
      data;
      let allData = data.data.data;
      allData.map((val) => {
        val.isChecked = false;
      });
      setMemberInfo(allData);
    } catch (error) {
      if (error.response) {
        let message = error.response.message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  let checkMandatory = () => {
    let result = true;
    let newObj = {};
    if (groupInfo.dolName == '') {
      result = false;
      newObj.selectUser = 'দলের নাম প্রদান করুন';
    }
    if (projectId == null || projectId == 'নির্বাচন করুন') {
      result = false;
      newObj.projectId = 'প্রকল্প নির্বাচন করুন';
    }
    if (districtId == null || districtId == 'নির্বাচন করুন') {
      result = false;
      newObj.districtId = 'জেলা নির্বাচন করুন';
    }
    if (upozillaId == '' || upozillaId == 'নির্বাচন করুন') {
      result = false;
      newObj.upozillaId = 'উপজেলা নির্বাচন করুন';
    }
    if (samityNameObj.id == '' || samityNameObj.id == 'নির্বাচন করুন') {
      ('Samity Id Not found!');
      result = false;
      newObj.samityId = 'সমিতি নির্বাচন করুন';
    }
    setTimeout(() => {
      setFormErrors(newObj);
    }, 200);
    return result;
  };

  const onSubmitData = async () => {
    let idArray = [...selectedData];
    const upaCityIdArray = upozillaId;
    let id = upaCityIdArray[0].split(',');
    let result = checkMandatory();
    idArray = idArray.map((item) => item.id);
    let payload;
    payload = {
      resourceName: 'dol info',
      projectId: projectId,
      data: {
        samityId: samityId,
        dolName: groupInfo.dolName,
        isActive: value,
        memberId: idArray,
      },
      districtId: districtId,
      upaCityId: id[0],
      upaCityType: id[1],
    };
    if (result) {
      try {
        let selectedMember = await axios.post(groupForApprove, payload, config);
        NotificationManager.success(selectedMember.data.message, ' ');
        setGroupInfo({
          dolName: '',
        });
        setSelectedData('');
        setMemberInfo([]);
        setSamityId('নির্বাচন করুন');
        setProjectId('নির্বাচন করুন');
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message);
        } else if (error.request) {
          NotificationManager.error('সংযোগে ত্রুটি দেখা দিচ্ছে...');
        } else if (error) {
          NotificationManager.error(error.toString());
        }
      }
    }
  };

  const onRowsPerPageChange = (e) => {
    const { value } = e.target;
    setRowPerPage(value);
  };

  return (
    <>
      <Grid container>
        <Grid container spacing={2.5} className="section">
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্পের  নাম')}
              select
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
                  {option.projectNameBangla}
                </option>
              ))}
            </TextField>
            {!projectId && <span style={{ color: 'red' }}>{formErrors.projectId}</span>}
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label={star('জেলা')}
              id="districtId"
              name="district"
              select
              SelectProps={{ native: true }}
              onChange={(e) => handleInputChangeDistrict(e)}
              variant="outlined"
              size="small"
              value={districtId != null ? districtId : ' '}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {districtData.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))}
            </TextField>
            {!districtId && <span style={{ color: 'red' }}>{formErrors.selectUser}</span>}
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label={star('উপজেলা')}
              id="upozillaId"
              name="upazila"
              select
              SelectProps={{ native: true }}
              onChange={(e) => handleInputChangeUpazila(e)}
              type="text"
              variant="outlined"
              size="small"
              value={upozillaId != null ? upozillaId : ' '}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {upozillaData.map((option) => (
                <option key={option.id} value={option.upaCityIdType}>
                  {option.upaCityNameBangla}
                </option>
              ))}
            </TextField>
            {!upozillaId && <span style={{ color: 'red' }}>{formErrors.upozillaId}</span>}
          </Grid>
          <Grid item md={3} xs={12}>
            {/* <TextField
              fullWidth
              select
              label={star("সমিতির নাম")}
              name="samityName"
              onChange={(e) => handleInputChangeSamityName(e)}
              SelectProps={{ native: true }}
              type="text"
              variant="outlined"
              size="small"
              value={samityId ? samityId : " "}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {samityData.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.samityName}
                </option>
              ))}
            </TextField> */}
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="samityId"
              key={samityNameObj}
              onChange={(event, value) => {
                if (value == null) {
                  setSamityNameObj({
                    id: '',
                    label: '',
                  });
                } else {
                  value &&
                    setSamityNameObj({
                      id: value.id,
                      label: value.label,
                    });
                  // setSamityId(value.id);
                  // getMember(value.id);
                  setSamityId(value.id);
                  getAllMember(value.id);
                  setSelectedData([]);
                }
              }}
              options={samityData
                .map((option) => ({
                  id: option.id,
                  label: option.samityName,
                }))
                .filter((e) => e.id != null && e.label !== null)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={samityNameObj.id === '' ? star(' সমিতির নাম নির্বাচন করুন') : star(' সমিতির নাম')}
                  variant="outlined"
                  size="small"
                />
              )}
              value={samityNameObj}
            />
            {samityNameObj.id == '' && <span style={{ color: 'red' }}>{formErrors.samityId}</span>}
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <SubHeading>দলের তথ্য</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              id="onlyText"
              label={star('দলের নাম')}
              name="dolName"
              onChange={handleChange}
              type="text"
              variant="outlined"
              size="small"
              value={groupInfo.dolName ? groupInfo.dolName : ' '}
            ></TextField>
            {!groupInfo.dolName && <span style={{ color: 'red' }}>{formErrors.selectUser}</span>}
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography
              variant="h6"
              sx={{
                color: '#000',
                textShadow: '1px 1px #FFF',
                fontWeight: 'bold',
              }}
            >
              স্ট্যাটাস <Switch onChange={handleChange} checked={value} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>দলে সদস্যের সংযুক্তি</SubHeading>
        <Grid container>
          <TableContainer className="table-container">
            <Table aria-label="customized table" size="small">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center" sx={{ width: '6%', minWidth: '60px' }}>
                    ক্রমিক নং
                  </TableCell>
                  <TableCell>সদস্য কোড</TableCell>
                  <TableCell>সদস্যের নাম</TableCell>
                  <TableCell>মোবাইল নম্বর</TableCell>
                  <TableCell align="center">যুক্ত করুন</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberInfo && memberInfo.length > 0
                  ? memberInfo.slice(page * rowPerPage, page * rowPerPage + rowPerPage).map((member, i) => (
                    <TableRow key={i}>
                      <TableCell scope="row" align="center">
                        {engToBdNum(page * rowPerPage + (i + 1))}
                      </TableCell>
                      <TableCell scope="row">{engToBdNum(member.customerCode)}</TableCell>
                      <TableCell scope="row">{member.nameBn}</TableCell>
                      <TableCell scope="row">{engToBdNum(member.mobile)}</TableCell>
                      <TableCell scope="row" align="center">
                        <Checkbox
                          checked={member.isChecked}
                          onClick={(e) => {
                            handleCheckAccepted(member.id, e, i);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                  : ''}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={memberInfo.length}
              rowsPerPage={rowPerPage}
              labelRowsPerPage={' '}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[2, 5, 10, 25, 50]}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>দলে সংযুক্ত সদস্যের তালিকা</SubHeading>
        <Grid container>
          <Grid item lg={12} md={12} xs={12}>
            <Box>
              <TableContainer className="table-container">
                <Table aria-label="customized table" size="small">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell align="center" sx={{ width: '6%', minWidth: '60px' }}>
                        ক্রমিক নং
                      </TableCell>
                      <TableCell>সদস্য কোড</TableCell>
                      <TableCell>সদস্যের নাম</TableCell>
                      <TableCell>মোবাইল নম্বর</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedData && selectedData.length > 0
                      ? selectedData.map((member, i) => (
                        <TableRow key={i}>
                          <TableCell scope="row" align="center">
                            {engToBdNum(i + 1)}
                          </TableCell>
                          <TableCell scope="row">{engToBdNum(member.customerCode)}</TableCell>
                          <TableCell scope="row">{member.nameBn}</TableCell>
                          <TableCell scope="row">{engToBdNum(member.mobile)}</TableCell>
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

export default GroupRegistration;
