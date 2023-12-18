
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  approveSamityList,
  employeeRecord,
  getDolMember,
  loanProject,
  memberCreate,
  officeName,
  permissionRoute,
  samityNameRoute
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';
import EditMemberRegistrationFromNormal from '../edit-member-registration/EditMemberRegistrationFromNormal';
import MemberRegistration from '../member-registration/MemberRegistration';

import { engToBang } from '../member-registration/validator';





const MemberCorrection = () => {
  const token = localStorageData('token');
  const officeInfo = localStorageData('officeGeoData');
  const getTokenData = tokenData(token);
  const config = localStorageData('config');
  const [projectName, setProjectName] = useState([]);
  const [samityName, setSamityName] = useState([]);
  const [member, setMember] = useState([]);
  const [samityData, setSamityData] = useState({
    projectId: '',
    samityLevel: '',
    samityType: '',
  });
  const [adminOfficeObj, setAdminOfficeObj] = useState({
    id: officeInfo?.id,
    label: officeInfo?.nameBn,
  });

  // const [projectId ,setProjectId] = useState(null);
  const [processSamity, setProcessSamity] = useState({
    id: '',
    samityId: '',
    samityName: '',
    memberInfo: [],
  });

  const [approval, setApproval] = useState([]);
  const [officeNames, setOfficeNames] = useState([]);
  const [samityAddUpdateDelete, setSamityAddUpdateDelete] = useState(false);
  const [updateComponent, setUpdateComponent] = useState(false);
  const [addComponent, setAddComponent] = useState(false);
  const [samityTypeSelection, setSamityTypeSelection] = useState(false);
  // const [labelForSamity, setLabelForSamity] = useState('সমিতির নাম');
  const [memberEditData, setMemberEditData] = useState({});
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [samityWaitForApproval, setSamityWaitForApproval] = useState(false);
  const [applicationMember, setApplicationMember] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [approvedApplicationId, setApprovedApplicationId] = useState(null); //approval samity application put/update.
  const [formErrors] = useState('');
  useEffect(() => {
    getProject();
    getOfficeName();
    if (officeInfo.id) {
      setAdminOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
      getEmployeeName(officeInfo?.id);
    }
  }, []);

  // useEffect(() => {
  //   if (props?.id && props?.status == 'C') {
  //     getApplicationDetails(props?.id, props?.status);
  //   }
  // }, [props?.id && props?.status]);

  // const getApplicationDetails = async (applicationId) => {
  //   try {
  //     const applicationDetailsData = await axios.get(specificApplication + applicationId, config);
  //     const applicationDetails = applicationDetailsData.data.data;
  //     onEditMember(applicationDetails, index)
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // };

  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  // const handleChangeOffice = (e, values) => {
  //   setEmployeeRecords([]);
  //   setOfficeId(values?.id);
  //   if (values != null) {
  //     getEmployeeName(parseInt(values?.id));
  //   }
  // };
  const handleChangeSelect = (e) => {
    if (e.target.value != 'নির্বাচন করুন') {
      let desData = JSON.parse(e.target.value);
      let designationId = desData.designationId;
      let employeeId = desData.employeeId;

      setApproval({
        designationId: designationId,
        officerId: employeeId,
      });
    }
  };
  let getEmployeeName = async (value) => {
    try {
      let employeeRecordData = await axios.get(employeeRecord + value, config);
      setEmployeeRecords(employeeRecordData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };


  let onSubmitData = async (e) => {
    e.preventDefault();
    let payload = {
      nextAppDesignationId: approval.designationId ? approval.designationId : null,
    };
    let pendingData;
    try {
      if (samityData.samityLevel == 1) {
        let getAppId = approvedApplicationId ? approvedApplicationId : serviceId;
        if (getAppId) {
          pendingData = await axios.put(memberCreate + '/' + getAppId, payload, config);
          NotificationManager.success(pendingData?.data?.message, '', 5000);
          setSamityData({
            projectId: '',
            samityLevel: '',
            samityType: '',
          });
          setProcessSamity({
            id: '',
            samityId: '',
            samityName: '',
            memberInfo: [],
          });
          setApproval({
            designationId: '',
            officerId: '',
          });
          setApplicationMember([]);
          setMember([]);
        } else {
          NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুণ', '', 5000);
        }
      } else {
        if (processSamity.id) {
          pendingData = await axios.put(memberCreate + '/' + processSamity.id, payload, config);
          NotificationManager.success(pendingData?.data?.message, '', 5000);
          setSamityData({
            projectId: '',
            samityLevel: '',
            samityType: '',
          });
          setProcessSamity({
            id: '',
            samityId: '',
            samityName: '',
            memberInfo: [],
          });
          setApproval({
            designationId: '',
            officerId: '',
          });
          setApplicationMember([]);
          setMember([]);
        } else {
          NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুণ', '', 5000);
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let nomineeStatus;
    switch (name) {
      case 'serviceId':
        setServiceId(value);
        break;
      case 'projectId':
        nomineeStatus = projectName.find((project) => project.id == value)?.nomineeStatus;
        if (value == 0) {
          setSamityData({ ...samityData, [name]: '' });
        } else {
          setSamityData({
            ...samityData,
            [name]: value,
            nomineeStatus,
            samityLevel: '',
            samityType: '',
          });
          getPermission(value);
          setMember([]);
          setSamityName([]);
        }
        break;
      case 'samityLevel':
        setSamityData({ ...samityData, [name]: value });
        setSamityWaitForApproval(false);
        getSamity(value, samityData.projectId, samityData.samityType);
        if (value == 1) {
          setProcessSamity({ ...processSamity, id: '' });
          setProcessSamity({ ...processSamity, memberInfo: [] });
        } else if (value == 2) {
          setProcessSamity({ ...processSamity, id: '' });

          setMember([]);
        }
        setProcessSamity({
          ...processSamity,
          samityName: '',
        });
        break;
      case 'samityType':
        setSamityData({ ...samityData, [name]: value, samityLevel: '' });
        break;
      default:
        setSamityData({ ...samityData, [name]: value });
        break;
    }
  };

  const handleSamity = (e, data) => {
    if (data) {
      //Process Samity----->data we will get from autocomplete particular object
      //We will get particular samity's all member upon find opeartion in samityName state
      //If nextAppDesignation Id found then the disable button logic is done and setted in setSamityWaitForApproval
      //For only id we will get processingSamityId
      //For SamityId we will get ApprovedSamityId
      let findMemberData, findPMemberData
      switch (data.name) {
        case 'processSamity':
          findPMemberData = samityName.find((element) => element.id == data.id);
          setProcessSamity({
            ...processSamity,
            id: data.id,
            samityName: data.label,
            memberInfo: findPMemberData.data.memberInfo,
            samityMemberType: findPMemberData?.samityMemberType,
          });
          setSamityWaitForApproval(findPMemberData.nextAppDesignationId ? true : false);
          break;
        case 'approvedSamity':
          findMemberData = samityName.find((element) => element.id == data.id);
          setProcessSamity({
            ...processSamity,
            id: '',
            samityName: data.label,
            samityId: data.id,
            samityMemberType: findMemberData?.samityMemberType,
          });
          getMember(data.id);
          getApplicationMemberData(data.id);
          break;
      }
    } else {
      setProcessSamity({
        ...processSamity,
        id: '',
        samityId: '',
        samityMemberType: '',
        memberInfo: '',
      });
      setSamityWaitForApproval(false);
      setMember([]);
      setApplicationMember([]);
      setApprovedApplicationId(null);
    }
  };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      // if (projectList.length == 1) {
      //   setProjectId(projectList[0].id);
      //   document
      //     .getElementById("projectId")
      //     ?.setAttribute("disabled", "true");
      //   getSamity(projectList[0].id);
      //   // getMember();
      // }
      setProjectName(projectList);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSamity = async (samityLevel, projectId, samityType, refreshType) => {
    try {
      let samityData;
      if (samityType) {
        if (projectId) {
          samityData = await axios.get(
            samityNameRoute +
            '?value=' +
            samityLevel +
            '&project=' +
            projectId +
            '&coop=0' +
            '&samityType=' +
            samityType,
            config,
          );
        } else {
          samityData = await axios.get(
            samityNameRoute + '?value=' + samityLevel + '&coop=0' + '&samityType=' + samityType,
            config,
          );
        }
      } else {
        if (projectId) {
          samityData = await axios.get(
            samityNameRoute + '?value=' + samityLevel + '&project=' + projectId + '&coop=0',
            config,
          );
        } else {
          samityData = await axios.get(samityNameRoute + '?value=' + samityLevel + '&coop=0', config);
        }
      }
      let samityList = samityData.data.data;
      setSamityName(samityList);
      //refreshType---->
      if (refreshType) {
        if (samityLevel == 1) {
          getApplicationMemberData(processSamity.samityId);
        } else if (samityLevel == 2) {
          // processing samity
          const findMemberData = samityList.find((element) => element.id == processSamity.id);
          setProcessSamity({
            ...processSamity,
            memberInfo: findMemberData.data.memberInfo,
          });
          setSamityWaitForApproval(findMemberData.nextAppDesignationId ? true : false);
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const getMember = async (samityId) => {
    if (samityId != undefined) {
      try {
        const memberData = await axios.get(getDolMember + '?samityId=' + samityId + '&flag=1&defaultMembers=1', config);
        let memberList = memberData.data.data;
        setMember(memberList);
      } catch (error) {
        errorHandler(error);
      }
    } else {
      setMember([]);
    }
  };

  const getApplicationMemberData = async (id) => {
    try {
      const data = await axios.get(approveSamityList + '?samityId=' + id, config);
      setApplicationMember(data?.data?.data?.data?.memberInfo);
      setApprovedApplicationId(data?.data?.data?.id);
    } catch (err) {
      errorHandler(err);
    }
  };

  let getPermission = async (id) => {
    if (id) {
      try {
        let permissionResp = await axios.get(permissionRoute + '?pageName=memberReg&project=' + id, config);
        if (permissionResp?.data?.data[0]?.samityTypeSelection) {
          setSamityTypeSelection(permissionResp?.data?.data[0]?.samityTypeSelection);
        } else {
          setSamityTypeSelection(false);
        }

        // if (!isEmpty) {
        //   setFieldHideShowObj(permissionResp.data.data[0]);
        // } else {
        //   setFieldHideShowObj({});
        // }
        // if (!isEmpty2) {
        //   setLabelObj(permissionResp.data.data[1]);
        // } else {
        //   setLabelObj({});
        // }
        if (permissionResp.data.data.length >= 1) {
          // if (permissionResp.data.data[0].samityType == 'C') {
          //   setLabelForSamity('সমবায় সমিতির নাম');
          // } else if (permissionResp.data.data[0].samityType == 'D') {
          //   setLabelForSamity('দলের নাম');
          // } else if (permissionResp.data.data[0].samityType == 'G') {
          //   setLabelForSamity('সংঘের নাম');
          // } else {
          //   setLabelForSamity('সমিতির নাম');
          // }
        }
        // show();
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  console.log('process samity----', applicationMember);
  const addNewMember = () => {
    setSamityAddUpdateDelete(true);
    setAddComponent(true);
    setUpdateComponent(false);
  };

  const onEditMember = (data, index) => {
    setSamityAddUpdateDelete(true);
    setAddComponent(false);
    setUpdateComponent(true);
    setMemberEditData({ data, index });
  };
  const closeNewMember = () => {
    setSamityAddUpdateDelete(false);
    setAddComponent(false);
    setUpdateComponent(false);
    getSamity(samityData.samityLevel, samityData?.projectId, samityData.samityType, true);
  };
  return (
    <>
      {samityAddUpdateDelete ? (
        addComponent ? (
          <MemberRegistration
            {...{
              closeNewMember,
              samityLevel: samityData.samityLevel,
              applicationId: processSamity?.id,
              approvedSamityId: processSamity.samityId,
              projectId: samityData?.projectId,
              approvedApplicationId,
              samityMemberType: processSamity?.samityMemberType,
              samityType: samityData.samityType,
              nomineeStatus: samityData.nomineeStatus,
            }}
          />
        ) : updateComponent ? (
          <EditMemberRegistrationFromNormal
            {...{
              memberEditData,
              closeNewMember,
              samityLevel: samityData.samityLevel,
              applicationId: processSamity?.id,
              approvedSamityId: processSamity.samityId,
              projectId: samityData?.projectId,
              approvedApplicationId,
              samityType: samityData.samityType,
            }}
          />
        ) : (
          ''
        )
      ) : (
        <>
          <Grid container className="section" spacing={2.5}>
            {getTokenData?.isProjectAllow == true && (
              <Grid item md={samityTypeSelection ? 3 : 4} xs={12}>
                <TextField
                  fullWidth
                  label={star('প্রকল্পের নাম')}
                  name="projectId"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={samityData.projectId || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  {projectName?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.projectNameBangla}
                    </option>
                  ))}
                </TextField>
              </Grid>
            )}
            {samityTypeSelection ? (
              <>
                <Grid item>
                  <FormControl component="samityTypeSelection" margin="auto">
                    <FormLabel
                      id="demo-row-radio-buttons-group-label"
                      style={{
                        transform: 'Scale(0.8)',
                        transformOrigin: 'left top',
                        margin: '-8px 0 -10px',
                      }}
                    >
                      {star('ধরন')}
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-label="samityTypeSelection"
                      name="samityType"
                      value={samityData.samityType}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="S" control={<Radio />} label="সমিতি" />
                      <FormControlLabel value="G" control={<Radio />} label="সংঘ" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </>
            ) : (
              ''
            )}
            <Grid item flexGrow={1}>
              <FormControl component="fieldset">
                <FormLabel
                  id="demo-row-radio-buttons-group-label"
                  style={{
                    transform: 'Scale(0.8)',
                    transformOrigin: 'left top',
                    margin: '-8px 0 -10px',
                  }}
                >
                  {star('সমিতির অবস্থা')}
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="samityType"
                  name="samityLevel"
                  value={samityData.samityLevel}
                  onChange={handleChange}
                >
                  <FormControlLabel value="1" control={<Radio />} label="অনুমোদিত" />
                  <FormControlLabel value="2" control={<Radio />} label="প্রক্রিয়াধীন" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {samityData.samityLevel == 1 ? (
              <Grid item md={samityTypeSelection ? 4 : 4} xs={12}>
                <Autocomplete
                  disablePortal
                  inputProps={{ style: { padding: 0, margin: 0 } }}
                  onChange={(e, data) => handleSamity(e, data)}
                  options={samityName
                    .map((option) => ({
                      id: option.id,
                      name: 'approvedSamity',
                      label: option.samityName,
                    }))
                    .filter((e) => e.id != null && e.employeeId !== null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label={star('অনুমোদিত সমিতির নাম নির্বাচন করুন')}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  value={processSamity.samityName}
                />
              </Grid>
            ) : samityData.samityLevel == 2 ? (
              <Grid item md={4} xs={12}>
                <Autocomplete
                  disablePortal
                  inputProps={{ style: { padding: 0, margin: 0 } }}
                  onChange={(e, data) => handleSamity(e, data)}
                  options={samityName
                    .map((option) => ({
                      label: option.data?.basic?.samityName,
                      id: option.id,
                      name: 'processSamity',
                    }))
                    .filter((e) => e.id != null && e.id !== null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label={star('প্রক্রিয়াধীন সমিতির নাম নির্বাচন করুন')}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  value={processSamity.samityName}
                />
              </Grid>
            ) : (
              ''
            )}
          </Grid>
          {/* /////////////////////// অনিমদিত সমিতির সদস্যের তথ্য ////////////////// */}
          {samityData?.samityLevel == 1 && member?.length > 0 ? (
            <>
              <Grid container className="section">
                <Grid item lg={12} md={12} xs={12}>
                  <Box>
                    <SubHeading>
                      অনুমোদিত সদস্যের তথ্য
                      <Button
                        variant="contained"
                        sx={{ float: 'right' }}
                        className="btn btn-primary"
                        onClick={() => addNewMember()}
                        disabled={processSamity.samityId ? false : true}
                      >
                        <PersonAddAltIcon sx={{ marginRight: '.5rem' }} /> সদস্য যোগ করুন
                      </Button>
                    </SubHeading>

                    <TableContainer className="table-container">
                      <Table size="small" aria-label="a dense table">
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell align="center">ক্রমিক নং</TableCell>
                            <TableCell className="first-td">সদস্যের নাম</TableCell>
                            <TableCell>মোবাইল নম্বর</TableCell>
                            <TableCell>পিতার নাম</TableCell>
                            <TableCell>মাতার নাম</TableCell>
                            <TableCell className="table-data-center" sx={{ width: '5%' }}>
                              সংশোধন
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {member?.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell scope="row" align="center">
                                {engToBang(i + 1)}
                              </TableCell>
                              <TableCell scope="row" className="first-td">
                                {item.nameBn}
                              </TableCell>
                              <TableCell scope="row">{item.mobile}</TableCell>
                              <TableCell scope="row">{item.fatherName}</TableCell>
                              <TableCell scope="row">{item.motherName}</TableCell>
                              <TableCell scope="row" align="center">
                                <EditIcon className="table-icon edit" onClick={() => onEditMember(item, 'main')} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
              {/* //////////////////// application member list//////////////////// */}
              <Grid container className="section">
                <Grid item lg={12} md={12} xs={12}>
                  <Box>
                    <SubHeading>প্রক্রিয়াধীন সদস্যের তথ্য</SubHeading>
                    <TableContainer className="table-container">
                      <Table size="small" aria-label="a dense table">
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell align="center">ক্রমিক নং</TableCell>
                            <TableCell className="first-td">সদস্যের নাম</TableCell>
                            <TableCell>মোবাইল নম্বর</TableCell>
                            <TableCell>পিতার নাম</TableCell>
                            <TableCell>মাতার নাম</TableCell>
                            <TableCell className="table-data-center" sx={{ width: '5%' }}>
                              সংশোধন
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applicationMember?.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell scope="row" align="center">
                                {engToBang(i + 1)}
                              </TableCell>
                              <TableCell scope="row" className="first-td">
                                {item.data.nameBn}
                              </TableCell>
                              <TableCell scope="row">{engToBang(item.data.mobile)}</TableCell>
                              <TableCell scope="row">{item.data.fatherName}</TableCell>
                              <TableCell scope="row">{item.data.motherName}</TableCell>
                              <TableCell scope="row">
                                <IconButton>
                                  <EditIcon className="table-icon edit" onClick={() => onEditMember(item, i)} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* ///////////////////////////////////////////////////////// */}
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : (
            ''
          )}

          {/* /////////////////////// প্রক্রিয়াধীন সমিতির সদস্যের তথ্য ////////////////// */}
          {samityData?.samityLevel == 2 ? (
            <Grid container className="section">
              <Grid item lg={12} md={12} xs={12}>
                <Box>
                  {samityWaitForApproval ? (
                    ''
                  ) : (
                    <SubHeading>
                      <span>প্রক্রিয়াধীন সদস্যের তথ্য</span>
                      <Button
                        variant="contained"
                        className="btn btn-primary"
                        onClick={() => addNewMember()}
                        disabled={processSamity.id ? false : true}
                        startIcon={<PersonAddAltIcon />}
                      >
                        {' '}
                        সদস্য যোগ করুন
                      </Button>
                    </SubHeading>
                  )}
                  {processSamity?.memberInfo ? (
                    <TableContainer className="table-container">
                      <Table size="small" aria-label="a dense table">
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell align="center">ক্রমিক</TableCell>
                            <TableCell>সদস্যের নাম</TableCell>
                            <TableCell>মোবাইল নম্বর</TableCell>
                            <TableCell>পিতার নাম</TableCell>
                            <TableCell>মাতার নাম</TableCell>
                            {samityWaitForApproval ? (
                              ''
                            ) : (
                              <TableCell align="center" sx={{ width: '5%' }}>
                                সংশোধন
                              </TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {processSamity.memberInfo?.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell scope="row" align="center">
                                {engToBang(i + 1)}
                              </TableCell>
                              <TableCell scope="row">{item?.data?.nameBn}</TableCell>
                              <TableCell scope="row">{engToBang(item?.data?.mobile)}</TableCell>
                              <TableCell scope="row">{item?.data?.fatherName}</TableCell>
                              <TableCell scope="row">{item?.data?.motherName}</TableCell>
                              {samityWaitForApproval ? (
                                ''
                              ) : (
                                <TableCell scope="row" align="center">
                                  <EditIcon className="table-icon edit" onClick={() => onEditMember(item, i)} />
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    ''
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          {/* ////////////////////// application submition part //////////// */}
          <Grid container spacing={2.5} className="section" sx={{ marginTop: '2rem' }}>
            {samityWaitForApproval ? (
              <Grid item>
                <Button variant="contained" disabled sx={{ height: '100%' }}>
                  <PublishedWithChangesIcon />
                  &nbsp;আবেদন জমা দেয়া হয়েছে,দয়া করে অনুমোদনের জন্য অপেক্ষা করুন
                </Button>
              </Grid>
            ) : samityData.samityLevel == '1' && !applicationMember ? (
              ''
            ) : (
              <Grid container spacing={2.5} m={1}>
                <>
                  {/* <Grid item lg={3} md={3} xs={12}>
                    <Autocomplete
                      disablePortal
                      id="grouped-demo"
                      options={officeNameOptions}
                      onChange={handleChangeOffice}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          label={star("কার্যালয়")}
                          size="small"
                        />
                      )}
                    />
                  </Grid> */}
                  <Grid item md={3} xs={12}>
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
                        } else {
                          value &&
                            setAdminOfficeObj({
                              id: value.id,
                              label: value.label,
                            });

                          getEmployeeName(value.id);
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
                            adminOfficeObj.id
                              ? star('পর্যবেক্ষক/অনুমোদনকারীর অফিস')
                              : star('পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন')
                          }
                          variant="outlined"
                          size="small"
                          style={{ backgroundColor: '#FFF', margin: '5dp' }}
                        />
                      )}
                      value={adminOfficeObj}
                    />
                    {(adminOfficeObj.id == '' || !adminOfficeObj?.id) && (
                      <span style={{ color: 'red' }}>{formErrors?.officeId}</span>
                    )}
                  </Grid>
                  <Grid item lg={3} md={3} xs={12}>
                    <TextField
                      fullWidth
                      label={star('কর্মকর্তা ও পদবী')}
                      name="officerId"
                      onChange={handleChangeSelect}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      size="small"
                    >
                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                      {employeeRecords.map((element, index) => (
                        <option
                          key={index}
                          value={JSON.stringify({
                            designationId: element.designationId,
                            employeeId: element.employeeId,
                          })}
                        >
                          {element.nameBn} {'-'} {element.designation}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item md={3}>
                    <Button
                      variant="contained"
                      onClick={onSubmitData}
                      className="btn btn-primary"
                      startIcon={<PublishedWithChangesIcon />}
                      sx={{ height: '100%' }}
                    >
                      {' '}
                      সদস্য সংযোজন / সংশোধন জমা দিন
                    </Button>
                  </Grid>
                </>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default MemberCorrection;
