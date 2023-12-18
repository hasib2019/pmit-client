
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Slide,
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
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  dalEdit,
  districtRoute,
  dollDetails,
  getDolMember,
  groupForApprove,
  loanProject,
  samityNameRoute,
  upazilaRoute,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="dowwn" ref={ref} {...props} />;
});
const GroupRegistration = () => {
  const config = localStorageData('config');

  useEffect(() => {
    getDistrictData();
    getProject();
  }, []);

  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState([]);

  const [districtId, setDistrictId] = useState(null);
  const [districtData, setDistrictData] = useState([]);

  const [upozillaId, setUpozillaId] = useState(null);
  // const [upaCityType, setUpaCityType] = useState(null);
  const [upozillaData, setUpozillaData] = useState([]);

  const [samityId, setSamityId] = useState([]);
  const [samityData, setSamityData] = useState([]);

  const [dolData, setDolData] = useState([]);
  const [dalId, setDalId] = useState([]);
  const [checkedMemberId, setCheckedMemberId] = useState([]);
  const [memberInfo, setMemberInfo] = useState([]);
  const [member, setMember] = useState([]);
  const [apiGetMember, setApiGetMember] = useState([]);
  const [modalClicked, setModalClicked] = useState(false);
  const [value, setValue] = useState(false);
  const [groupInfo, setGroupInfo] = useState({
    dolName: '',
  });

  const handleChange = (e) => {
    const { checked } = e.target;
    setValue(checked);
    setGroupInfo({
      ...groupInfo,
      [e.target.name]: e.target.value,
    });
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
    // setUpaCityType(idType[1]);
    getSamity(projectId);
  };

  const handleInputChangeProjectName = (e) => {
    const { value } = e.target;
    const upaId = upozillaId;
    const idType = upaId[0].split(',');
    // setUpozillaId(idType[0]);
    //setUpaCityType(idType[1]);
    setProjectId(value);
    getSamity(value, districtId, idType[0]);
  };

  const handleInputChangeSamityName = (e) => {
    const { value } = e.target;
    setSamityId(value);
    getDoll(value);

    // handlePageChange();
  };

  const handleInputChangeDollName = (e) => {
    const { value } = e.target;
    setDalId(value);
    getDolDetails(value);
  };

  const handleCheckRejected = (index, singleMember) => {
    let waitingMember = [...member];
    waitingMember.push(singleMember);
    setMember(waitingMember);
    let memberInfoArray = [...memberInfo];
    setCheckedMemberId([...checkedMemberId, parseInt(singleMember.id)]);
    memberInfoArray = memberInfoArray.filter((obj) => obj.id != singleMember.id);
    setMemberInfo(memberInfoArray);
  };

  const handleAddMember = (index, id, e, memberData) => {
    memberInfo.push(memberData);
    let newArray = [...apiGetMember];
    newArray = newArray.filter((res) => res.id != id);

    setApiGetMember(newArray);
    setMember(newArray);
    // ("New Member array array", newArray);
    // newArray.map((element, index) => {
    //   if (id == element.id) {
    //     indexToRemove = index;
    //   }
    // });
    // if (indexToRemove !== -1) {
    //   newArray.splice(indexToRemove, 1);
    //   setApiGetMember(newArray);
    // }
  };

  const handleClose = () => {
    setModalClicked(false);
  };
  // let checkMandatory = () => {
  //   let result = true;
  //   let newObj = {};
  //   if (groupInfo.dolName == '' || selectUser == 'নির্বাচন করুন') {
  //     result = false;
  //     newObj.selectUser = 'ব্যবহারকারী নির্বাচন করুন';
  //   }
  //   if (selectedDesk == '' || selectedDesk == 'নির্বাচন করুন') {
  //     result = false;
  //     newObj.selectedDesk = 'অনুমোদনকারী নির্বাচন করুন';
  //   }
  //   setnewObj(newObj);
  //   return result;
  // };
  const onSubmitData = async () => {
    let idArray = [];
    idArray = memberInfo.map((element) => {
      return element.id;
    });
    if (idArray.length > 0) {
      let payload;
      payload = {
        dolName: groupInfo.dolName,
        isActive: value,
        memberList: idArray,
        removeList: checkedMemberId,
      };
      try {
        let selectedMember = await axios.put(dalEdit + '/' + dalId, payload, config);
        NotificationManager.success(selectedMember.data.message, ' ');
        setMemberInfo([]);
        setProjectId('নির্বাচন করুন');
        setSamityId('নির্বাচন করুন');
      } catch (error) {
        errorHandler(error)
      }
    }
  };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      if (projectList.length == 1) {
        setProjectId(projectList[0].id);
        document.getElementById('projectId').setAttribute('disabled', 'true');
      }
      getSamity(projectList[0].id);
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
        // setUpaCityType(newUpazilaList[0].upaCityType);
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
  const getSamity = async (projectId) => {
    try {
      const samity = await axios.get(samityNameRoute + '?project=' + projectId + '&value=1', config);
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
  };
  // const getSamity = async (projectId, disId, upaId) => {
  //   try {
  //     const samity = await axios.get(
  //       getSamityByZone +
  //       "?districtId=" +
  //       disId +
  //       "&upazilaId=" +
  //       upaId +
  //       "&projectId=" +
  //       projectId +
  //       "&value=1" + "&upaCityType=" + upaCityType,
  //       config
  //     );

  //     let samityList = samity.data.data;
  //     // ("Samity Data", samityList);
  //     setSamityData(samityList);
  //   } catch (error) {
  //     ("error found", error.message);
  //     if (error.response) {
  //       ("error found", error.response.data);
  //       let message = error.response.data.errors[0].message;
  //       NotificationManager.error(message, "Error", 5000);
  //     } else if (error.request) {
  //       NotificationManager.error("Error Connecting...", "Error", 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), "Error", 5000);
  //     }
  //   }
  // };
  const getDoll = async (samityId) => {
    try {
      const data = await axios.get(
        groupForApprove + '?district=' + districtId + '&upazila=' + upozillaId + '&value=1' + '&samity=' + samityId,
        config,
      );
      let allData = data.data.data;
      setDolData(allData);
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

  const getDolDetails = async (dalId) => {
    try {
      const data = await axios.get(dollDetails + '?id=' + dalId + '&value=1&flag=2', config);
      setMemberInfo(data.data.data);
      setGroupInfo({
        dolName: data.data.dolName,
      });
      setValue(data.data.isActive);
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

  const getAddMember = async () => {
    setApiGetMember([]);
    try {
      const data = await axios.get(getDolMember + '?samityId=' + samityId + '&flag=2', config);
      setApiGetMember([...member, ...data.data.data]);
      setModalClicked(true);
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

  return (
    <>
      <Grid container spacing={2.5} className="section">
        <Grid item md={4} xs={12}>
          <TextField
            id="projectId"
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
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            id="districtId"
            fullWidth
            label={star('জেলা')}
            name="district"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeDistrict(e)}
            variant="outlined"
            size="small"
            value={districtId != null ? districtId : ''}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {districtData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.districtNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            id="upozillaId"
            fullWidth
            label={star('উপজেলা')}
            name="upazila"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeUpazila(e)}
            type="text"
            variant="outlined"
            size="small"
            value={upozillaId != null ? upozillaId : ''}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {upozillaData.map((option) => (
              <option key={option.id} value={option.upaCityIdType}>
                {option.upaCityNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            select
            label={star('সমিতির নাম')}
            name="samityName"
            onChange={(e) => handleInputChangeSamityName(e)}
            SelectProps={{ native: true }}
            type="text"
            variant="outlined"
            size="small"
          //  value={}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {samityData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.samityName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="samityTypeValue"
              name="samityTypeValue"

            //value={samityTypeValue}
            // onChange={handleChange}

            // defaultChecked
            >
              <FormControlLabel value="1" control={<Radio checked />} label="বিদ্যমান" />
              <FormControlLabel value="2" disabled control={<Radio />} label="নতুন" />
            </RadioGroup>
          </FormControl>
          {/* {!samityTypeValue && (
            <span style={{ color: "red" }}>
              {newObj.samityTypeValue}
            </span>
          )} */}
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            id="dalName"
            fullWidth
            select
            label={star('দলের নাম')}
            name="dollName"
            onChange={(e) => handleInputChangeDollName(e)}
            SelectProps={{ native: true }}
            type="text"
            variant="outlined"
            size="small"
          // value={memberApporval.upazila}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {dolData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.dolName}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container className="section">
        <SubHeading>দলের তথ্য</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label={star('দলের নাম')}
              value={groupInfo.dolName}
              name="dolName"
              onChange={handleChange}
              type="text"
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={6} xs={12} justifyItems="center">
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
        <SubHeading>
          অনুমোদিত সদস্যের তথ্য{' '}
          <Tooltip title="সদস্য যুক্ত করুন">
            <Button variant="contained" className="btn btn-primary" onClick={getAddMember}>
              <AddCircleIcon />
              &nbsp;&nbsp;সদস্য যুক্ত করুন
            </Button>
          </Tooltip>
        </SubHeading>
        <TableContainer item className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>সদস্যের কোড</TableCell>
                <TableCell>সদস্যের নাম</TableCell>
                <TableCell align="center">মোবাইল নম্বর</TableCell>
                <TableCell align="center">বাদ দিন</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberInfo && memberInfo.length > 0
                ? memberInfo.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.customerCode ? member.customerCode : ''}</TableCell>
                    <TableCell>{member.nameBn}</TableCell>
                    <TableCell align="center">{member.mobile}</TableCell>
                    <TableCell align="center">
                      {
                        <RemoveCircleIcon
                          className="btn-cancel"
                          fontSize="medium"
                          onClick={() => {
                            handleCheckRejected(index, member);
                          }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                ))
                : ' '}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {modalClicked ? (
        <Dialog
          className="diaModal"
          open={modalClicked}
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#21b6c9' }}>
                  <TableRow>
                    <TableCell>সদস্যের নাম</TableCell>
                    <TableCell>পিতার নাম</TableCell>
                    <TableCell>মাতার নাম</TableCell>
                    <TableCell align="center">মোবাইল নম্বর</TableCell>
                    <TableCell align="center">সদস্য যুক্ত করুন</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiGetMember != null
                    ? apiGetMember.map((data, index) => (
                      <TableRow key={data.id}>
                        <TableCell>{data.nameBn}</TableCell>
                        <TableCell>{data.fatherName}</TableCell>
                        <TableCell>{data.motherName}</TableCell>
                        <TableCell align="center">{data.mobile}</TableCell>
                        <TableCell align="center">
                          {
                            <AddCircleIcon
                              className="table-icon add"
                              fontSize="medium"
                              onClick={(e) => {
                                handleAddMember(index, data.id, e, data);
                              }}
                            />
                          }
                        </TableCell>
                      </TableRow>
                    ))
                    : ''}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      ) : (
        ''
      )}
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {' '}
            হালনাগাদ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default GroupRegistration;
