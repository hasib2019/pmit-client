
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SearchIcon from '@mui/icons-material/Search';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Grid,
  Slide,
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
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  districtOffice,
  memberApproval,
  memberCorrection,
  memberRegSamity,
  memberRejection,
  samityAndMember,
  upozilaOffice,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import Title from '../../../shared/others/Title';
import star from '../../loan-management/loan-application/utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="dowwn" ref={ref} {...props} />;
});

const Index = () => {
  // const token = localStorageData('token');
  // const getTokenData = tokenData(token);
  // const officeId = getTokenData?.officeId;
  // const layerId = getTokenData?.layerId;
  const config = localStorageData('config');
  const [modalClicked, setModalClicked] = useState(false);
  const [samityMember, setSamityMember] = useState([]);
  const [checkedMemberId, setCheckedMemberId] = useState([]);
  const [rejectedId, setRejectedId] = useState([]);
  const [correctionId, setCorrectionId] = useState([]);
  const [modalData, setModalData] = useState({});
  const [districtList, setDistrictList] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedUpazilaId, setSelectedUpazilaId] = useState(null);
  const [upazilaList, setUpazilaList] = useState([]);

  ////////////////////////// Comment's State///////////////

  const [payLoadArray, setPayLoadArray] = useState([]);
  const [memberwithoutSamity, setMemberwithoutSamity] = useState([]);
  const [samityState, setSamityState] = useState(false);
  let doptorId = "";
  useEffect(() => {
    ///////////// Call samityMemberInfo get Api/////////
    getDistrict();
    if (doptorId == 8 || doptorId == 4) {
      handleSearch();
    }
  }, []);

  let findComments = (id, value) => {
    payLoadArray.map((element) => {
      if (element.id == id) {
        element.remarks = value;
      }
    });
  };

  const handleComments = (e, index, id) => {
    const { value } = e.target;
    findComments(id, value);
  };

  /////////////////// District Upazila data get/////////////
  let getDistrict = async () => {
    try {
      let district = await axios.get(districtOffice, config);
      const districtData = district.data.data;
      if (districtData.length == 1) {
        setSelectedDistrictId(districtData[0].id);
        document.getElementById('districtId').setAttribute('disabled', 'true');
        getUpazila(districtData[0].id);
      }
      setDistrictList(districtData);
    } catch (error) {
      errorHandler(error);
    }
  };

  let getUpazila = async (districtId) => {
    try {
      let upazilaList = await axios.get(upozilaOffice + '?districtOfficeId=' + districtId, config);
      const upazilaData = upazilaList.data.data;
      if (upazilaData.length == 1) {
        setSelectedUpazilaId(upazilaData[0].id);
        document.getElementById('upazilaId').setAttribute('disabled', 'true');
      }
      setUpazilaList(upazilaData);
    } catch (error) {
      errorHandler(error);
    }
  };
  ////////////////// SamityMember Info Function/////////////
  const handleSearch = async () => {
    if (selectedUpazilaId) {
      try {
        let showData = await axios.get(samityAndMember + '?officeId=' + selectedUpazilaId + '&type=samityInfo', config);
        let data = showData.data.data;
        data.map((val) => {
          val.isAccepted = false;
          val.isRejected = false;
          val.isCorrected = false;
          val.acceptDisabled = false;
          val.rejectDisabled = false;
          val.correctDisabled = false;
        });
        if (data.length == 0) {
          setSamityState(true);
        } else {
          setSamityState(false);
        }
        setSamityMember(data);
        getMemberAdd();
      } catch (error) {
        if (error.response) {
          'Error Data', error.response;
          let message = error.response.data.errors && error.response.data.errors[0].message;
          NotificationManager.error(message, 'Error', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    } else {
      try {
        let showData = await axios.get(samityAndMember + '?type=samityInfo', config);
        let data = showData.data.data;
        data.map((val) => {
          val.isAccepted = false;
          val.isRejected = false;
          val.isCorrected = false;
          val.acceptDisabled = false;
          val.rejectDisabled = false;
          val.correctDisabled = false;
        });
        if (data.length == 0) {
          setSamityState(true);
        } else {
          setSamityState(false);
        }
        setSamityMember(data);
        getMemberAdd();
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  //   //////////// Store Checked Id in an Array //////////////
  const handleCheckAccepted = (id, e, index) => {
    const { name } = e.target;
    let samityMembers = [...samityMember];
    let memberWithoutSamity = [...memberwithoutSamity];
    if (name == 'samityMember') {
      samityMembers[index]['isAccepted'] = e.target.checked;
      // setSamityMember(samityMembers)
      if (e.target.checked) {
        setCheckedMemberId([...checkedMemberId, parseInt(id)]);
        samityMembers[index]['rejectDisabled'] = true;
        samityMembers[index]['correctDisabled'] = true;
        setSamityMember(samityMembers);
      } else {
        let newCheckedArray = [...checkedMemberId];
        newCheckedArray = newCheckedArray.filter((element) => element != id);
        setCheckedMemberId(newCheckedArray);
        samityMembers[index]['rejectDisabled'] = false;
        samityMembers[index]['correctDisabled'] = false;
        setSamityMember(samityMembers);
      }
    } else if (name == 'notSamityMember') {
      memberWithoutSamity[index]['isAccepted'] = e.target.checked;
      // setSamityMember(samityMembers)
      if (e.target.checked) {
        setCheckedMemberId([...checkedMemberId, parseInt(id)]);
        memberWithoutSamity[index]['rejectDisabled'] = true;
        memberWithoutSamity[index]['correctDisabled'] = true;
        setSamityMember(samityMembers);
      } else {
        let newCheckedArray = [...checkedMemberId];
        newCheckedArray = newCheckedArray.filter((element) => element != id);
        setCheckedMemberId(newCheckedArray);
        memberWithoutSamity[index]['rejectDisabled'] = false;
        memberWithoutSamity[index]['correctDisabled'] = false;
        setMemberwithoutSamity(memberWithoutSamity);
      }
    }
  };

  const handleCheckRejected = (id, e, index) => {
    const { name } = e.target;
    let samityMembers = [...samityMember];
    let memberWithoutSamity = [...memberwithoutSamity];
    if (name == 'samityMember') {
      samityMembers[index]['isRejected'] = e.target.checked;
      if (e.target.checked) {
        setRejectedId([...rejectedId, parseInt(id)]);
        samityMembers[index]['acceptDisabled'] = true;
        samityMembers[index]['correctDisabled'] = true;
        setSamityMember(samityMembers);
      } else {
        let newRejectedArray = [...rejectedId];
        newRejectedArray = newRejectedArray.filter((element) => element != id);
        setRejectedId(newRejectedArray);
        samityMembers[index]['acceptDisabled'] = false;
        samityMembers[index]['correctDisabled'] = false;
        setSamityMember(samityMembers);
      }
    } else if (name == 'notSamityMember') {
      memberWithoutSamity[index]['isRejected'] = e.target.checked;
      if (e.target.checked) {
        setRejectedId([...rejectedId, parseInt(id)]);
        memberWithoutSamity[index]['acceptDisabled'] = true;
        memberWithoutSamity[index]['correctDisabled'] = true;
        setMemberwithoutSamity(memberWithoutSamity);
      } else {
        let newRejectedArray = [...rejectedId];
        newRejectedArray = newRejectedArray.filter((element) => element != id);
        setRejectedId(newRejectedArray);
        memberWithoutSamity[index]['acceptDisabled'] = false;
        memberWithoutSamity[index]['correctDisabled'] = false;
        setMemberwithoutSamity(memberWithoutSamity);
      }
    }
  };
  const handleCheckCorrection = (id, e, index) => {
    const { name } = e.target;

    let samityMembers = [...samityMember];
    let memberWithoutSamity = [...memberwithoutSamity];

    if (name == 'samityMember') {
      samityMembers[index]['isCorrected'] = e.target.checked;

      if (e.target.checked) {
        document.getElementsByName(index + 'commentSamityMember')[0].focus();
        samityMembers[index]['acceptDisabled'] = true;
        samityMembers[index]['rejectDisabled'] = true;
        setCorrectionId([...correctionId, parseInt(id)]);
        payLoadArray.push(
          new Object({
            id: id,
            remarks: '',
          }),
        );
      } else {
        let newCorretedArray = [...correctionId];
        newCorretedArray = newCorretedArray.filter((element) => element != id);
        setCorrectionId(newCorretedArray);
        samityMembers[index]['acceptDisabled'] = false;
        samityMembers[index]['rejectDisabled'] = false;
        let array = [...payLoadArray];

        array = array.filter((element) => element.id != id);
        setPayLoadArray(array);
      }
    } else if (name == 'notSamityMember') {
      memberWithoutSamity[index]['isCorrected'] = e.target.checked;

      if (e.target.checked) {
        document.getElementsByName(index + 'commentNotSamityMember')[0].focus();
        memberWithoutSamity[index]['acceptDisabled'] = true;
        memberWithoutSamity[index]['rejectDisabled'] = true;
        setCorrectionId([...correctionId, parseInt(id)]);
        payLoadArray.push(
          new Object({
            id: id,
            remarks: '',
          }),
        );
      } else {
        let newCorretedArray = [...correctionId];
        newCorretedArray = newCorretedArray.filter((element) => element != id);
        setCorrectionId(newCorretedArray);
        memberWithoutSamity[index]['acceptDisabled'] = false;
        memberWithoutSamity[index]['rejectDisabled'] = false;
        let array = [...payLoadArray];

        array = array.filter((element) => element.id != id);
        setPayLoadArray(array);
      }
    }
  };
  //////////// Handle Modal //////////////
  const handleAllInfo = async (id) => {
    // ("Id id ", id);
    try {
      const dataget = await axios.get(memberRegSamity + '?id=' + id, config);
      let data = dataget.data.data.data;
      setModalData(data);

      setModalClicked(true);
    } catch (error) {
      errorHandler(error)
    }
  };

  // const handleComments = (e) => {
  //     setComments({
  //          [e.target.name]: e.target.value,
  //     })

  // }

  const handleClose = () => {
    setModalClicked(false);
  };

  const handleDistrict = (e) => {
    const { value } = e.target;
    setSelectedDistrictId(value);
    getUpazila(value);
  };

  const handleUpazilla = (e) => {
    const { value } = e.target;
    setSelectedUpazilaId(value);
    //getMemberAdd(value);
  };

  const getMemberAdd = async () => {
    if (selectedUpazilaId) {
      try {
        let showData = await axios.get(samityAndMember + '?officeId=' + selectedUpazilaId + '&type=memberInfo', config);

        let data = showData.data.data;
        data.map((val) => {
          val.isAccepted = false;
          val.isRejected = false;
          val.isCorrected = false;
          val.acceptDisabled = false;
          val.rejectDisabled = false;
          val.correctDisabled = false;
        });
        setMemberwithoutSamity(data);

      } catch (error) {
        if (error.response) {
          'Error Data', error.response;
          let message = error.response.data.errors && error.response.data.errors[0].message;
          NotificationManager.error(message, 'Error', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  const onSubmitData = async () => {
    let successStatus = true;
    if (checkedMemberId.length > 0) {
      let payload;
      payload = {
        approveId: checkedMemberId,
      };
      try {
        let checkedAcceptedIdResp = await axios.post(memberApproval, payload, config);
        NotificationManager.success(checkedAcceptedIdResp.data.message, '', 5000);
        setCheckedMemberId([]);
        handleSearch();
      } catch (error) {
        successStatus = false;
        if (error.response) {
          'Error Data', error.response;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
    if (rejectedId.length > 0) {
      let payload;
      payload = {
        rejectId: rejectedId,
      };
      try {
        let checkedRejectedResp = await axios.post(memberRejection, payload, config);
        NotificationManager.success(checkedRejectedResp.data.message, '', 5000);
        setRejectedId([]);
        handleSearch();
      } catch (error) {
        successStatus = false;
        if (error.response) {
          'Error Data', error.response;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
    if (payLoadArray.length > 0) {
      let payload;
      payload = {
        correction: payLoadArray,
      };
      try {
        let checkedCommentsResp = await axios.put(memberCorrection, payload, config);
        NotificationManager.success(checkedCommentsResp.data.message, '', 5000);
        setPayLoadArray([]);
        handleSearch();
      } catch (error) {
        successStatus = false;
        if (error.response) {
          'Error Data', error.response;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
    if (successStatus) {
      let samityData = [...samityMember];
      samityData.map((val) => {
        val.isAccepted = false;
        val.isRejected = false;
        val.isCorrected = false;
      });
      setSamityMember(samityData);
      handleSearch();
    }
  };

  return (
    <>
      <Grid container className="section" spacing={2.5}>
        {doptorId == 8 || doptorId == 4 ? (
          ''
        ) : (
          <>
            <Grid item md={5} xs={12}>
              <TextField
                fullWidth
                id="districtId"
                label={star('জেলা অফিস')}
                name="district"
                onChange={handleDistrict}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                value={selectedDistrictId}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {districtList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.officeNameBangla}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={5} xs={12}>
              <TextField
                fullWidth
                id="upazilaId"
                label={star('উপজেলা অফিস')}
                name="upazila"
                onChange={handleUpazilla}
                select
                SelectProps={{ native: true }}
                type="text"
                variant="outlined"
                size="small"
                value={selectedUpazilaId}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {upazilaList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.officeNameBangla}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button variant="contained" className="btn btn-primary" onClick={() => handleSearch()} size="small">
                <SearchIcon /> অনুসন্ধান
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container className="section">
        <SubHeading>সমিতি ও সদস্য অনুমোদন</SubHeading>
        <Grid item md={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>সমিতির নাম</TableCell>
                  <TableCell>ঠিকানা</TableCell>
                  <TableCell>মন্তব্য</TableCell>
                  <TableCell align="center">অনুমোদন</TableCell>
                  <TableCell align="center">বাতিল</TableCell>
                  <TableCell align="center">সংশোধন</TableCell>
                  <TableCell align="center">বিস্তারিত</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samityMember && samityMember.length > 0
                  ? samityMember.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {' '}
                        {member && member.data && member.data.basic && (
                          <Tooltip title={<div className="tooltip-title">{member.data.basic.samityName}</div>} arrow>
                            <span className="data">{member.data.basic.samityName}</span>
                          </Tooltip>
                        )}{' '}
                      </TableCell>
                      <TableCell>
                        {' '}
                        {member && member.data && member.data.basic && (
                          <Tooltip title={<div className="tooltip-title">{member.data.basic.address}</div>} arrow>
                            <span className="data">{member.data.basic.address}</span>
                          </Tooltip>
                        )}{' '}
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          name={index + 'commentSamityMember'}
                          onChange={(e) => handleComments(e, index, member.id)}
                          variant="outlined"
                          size="small"
                          multiline
                        ></TextField>
                      </TableCell>
                      <TableCell align="center">
                        {
                          <Checkbox
                            name="samityMember"
                            onClick={(e) => {
                              handleCheckAccepted(member.id, e, index);
                            }}
                            checked={member.isAccepted}
                            disabled={member.acceptDisabled}
                          />
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          <Checkbox
                            name="samityMember"
                            onClick={(e) => {
                              handleCheckRejected(member.id, e, index);
                            }}
                            checked={member.isRejected}
                            disabled={member.rejectDisabled}
                          />
                        }
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          // name={index + "correction"}
                          name="samityMember"
                          onClick={(e) => {
                            handleCheckCorrection(member.id, e, index);
                          }}
                          checked={member.isCorrected}
                          disabled={member.correctDisabled}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <WysiwygIcon
                          className="view-icon"
                          onClick={() => {
                            handleAllInfo(member.id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                  : ' '}
              </TableBody>

              {modalClicked ? (
                <Dialog
                  className="diaModal"
                  open={modalClicked}
                  TransitionComponent={Transition}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  scroll="body"
                  maxWidth="lg"
                // sx={{opacity:"0"}}
                >
                  <Grid container sx={{ padding: { xs: '.5rem', md: '1rem' } }}>
                    <SubHeading>সমিতির বিস্তারিত</SubHeading>
                  </Grid>
                  <DialogContent>
                    <Grid container spacing={2.5} className="modal-head">
                      <Typography sx={{ width: { xs: '100%', md: '50%' } }}>
                        <span className="label">সমিতির নাম </span>
                        <span className="label-clone">:</span>
                        {modalData && modalData.basic && modalData.basic.samityName}
                      </Typography>
                      <Typography sx={{ width: { xs: '100%', md: '50%' } }}>
                        <span className="label">সমিতির ঠিকানা </span>
                        <span className="label-clone">:</span>
                        {modalData && modalData.basic && modalData.basic.address}
                      </Typography>
                      <Typography sx={{ width: { xs: '100%', md: '50%' } }}>
                        <span className="label">মাঠ কর্মী </span>
                        <span className="label-clone">:</span>
                        {modalData && modalData.basic && modalData.basic.foName}
                      </Typography>
                      <Typography sx={{ width: { xs: '100%', md: '50%' } }}>
                        <span className="label">মিটিং এর দিন </span>
                        <span className="label-clone">:</span>
                        {modalData && modalData.basic && modalData.basic.meetingDayName}
                      </Typography>
                    </Grid>
                    <TableContainer className="table-container">
                      <Table size="small" aria-label="a dense table">
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell>সদস্যের নাম</TableCell>
                            <TableCell>পিতার নাম</TableCell>
                            <TableCell>মাতার নাম</TableCell>
                            <TableCell>মোবাইল নম্বর</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody style={{}}>
                          {modalData != null
                            ? modalData.memberInfo.map((row) => (
                              <TableRow key={row.address}>
                                <TableCell> {row && row.data && row.data.nameBn} </TableCell>
                                <TableCell> {row && row.data && row.data.fatherName} </TableCell>
                                <TableCell> {row && row.data && row.data.motherName} </TableCell>
                                <TableCell> {row && row.data && engToBang(row.data.mobile)} </TableCell>
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
            </Table>
          </TableContainer>
          {samityMember.length == 0 && samityState && <p style={{ color: 'red' }}>কোন তথ্য পাওয়া যায়নি</p>}
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>নিবন্ধিত সমিতির সদস্য অনুমোদন</SubHeading>
        <Grid item md={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>সমিতির নাম</TableCell>
                  <TableCell>সদস্যের নাম</TableCell>
                  <TableCell>মোবাইল নম্বর</TableCell>
                  <TableCell>মন্তব্য</TableCell>
                  <TableCell align="center">অনুমোদন</TableCell>
                  <TableCell align="center">বাতিল</TableCell>
                  <TableCell align="center">সংশোধন</TableCell>
                  <TableCell align="center">বিস্তারিত</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberwithoutSamity && memberwithoutSamity.length > 0
                  ? memberwithoutSamity.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {' '}
                        {member && member.data && member.data.memberInfo[0].data && (
                          <Tooltip
                            title={<div className="tooltip-title">{member.data.memberInfo[0].data.samityName}</div>}
                            arrow
                          >
                            <span className="data">{member.data.memberInfo[0].data.samityName}</span>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {' '}
                        {member && member.data && member.data.memberInfo[0].data && (
                          <Tooltip
                            title={<div className="tooltip-title">{member.data.memberInfo[0].data.nameBn}</div>}
                            arrow
                          >
                            <span className="data">{member.data.memberInfo[0].data.nameBn}</span>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {' '}
                        {member &&
                          member.data &&
                          member.data.memberInfo[0].data &&
                          member.data.memberInfo[0].data.mobile}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          fullWidth
                          name={index + 'commentNotSamityMember'}
                          onChange={(e) => handleComments(e, index, member.id)}
                          variant="outlined"
                          size="small"
                          multiline
                        ></TextField>
                      </TableCell>
                      <TableCell align="center">
                        {
                          <Checkbox
                            name="notSamityMember"
                            onClick={(e) => {
                              handleCheckAccepted(member.id, e, index);
                            }}
                            checked={member.isAccepted}
                            disabled={member.acceptDisabled}
                          />
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          <Checkbox
                            name="notSamityMember"
                            onClick={(e) => {
                              handleCheckRejected(member.id, e, index);
                            }}
                            checked={member.isRejected}
                            disabled={member.rejectDisabled}
                          />
                        }
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          name="notSamityMember"
                          onClick={(e) => {
                            handleCheckCorrection(member.id, e, index);
                          }}
                          checked={member.isCorrected}
                          disabled={member.correctDisabled}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <WysiwygIcon
                          className="view-icon"
                          onClick={() => {
                            handleAllInfo(member.id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                  : ' '}
              </TableBody>
              {/* Modal Clicked this modal  */}
              {modalClicked ? (
                <Dialog
                  className="diaModal"
                  open={modalClicked}
                  TransitionComponent={Transition}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  maxWidth="lg"
                  sx={{ opacity: '0', display: 'none' }}
                >
                  <Grid item md={12} xs={12}>
                    <Grid item md={12} xs={12}>
                      <Title>
                        <Grid item md={12} xs={12}>
                          <Typography>সমিতির বিস্তারিত</Typography>
                        </Grid>
                      </Title>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12}>
                          <Typography variant="h6">
                            <span>
                              সমিতির নাম:
                              {modalData && modalData.basic && modalData.basic.samityName}
                            </span>
                          </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Typography variant="h6">
                            সমিতির ঠিকানা:
                            {modalData && modalData.basic && modalData.basic.address}
                          </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Typography variant="h6">
                            মাঠ কর্মী:
                            {modalData && modalData.basic && modalData.basic.foName}
                          </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Typography variant="h6">
                            মিটিং এর দিন:
                            {modalData && modalData.basic && modalData.basic.meetingDayName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <DialogContent>
                    <TableContainer>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>সদস্যের নাম</TableCell>
                            <TableCell>পিতার নাম</TableCell>
                            <TableCell>মাতার নাম</TableCell>
                            <TableCell>মোবাইল নম্বর</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {modalData != null
                            ? modalData.memberInfo.map((row) => (
                              <TableRow key={row.address}>
                                <TableCell> {row && row.data && row.data.nameBn} </TableCell>
                                <TableCell> {row && row.data && row.data.fatherName} </TableCell>
                                <TableCell> {row && row.data && row.data.motherName} </TableCell>
                                <TableCell> {row && row.data && row.data.mobile} </TableCell>
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
            </Table>
          </TableContainer>
          {memberwithoutSamity.length == 0 && memberwithoutSamity && (
            <p style={{ color: 'red' }}>কোন তথ্য পাওয়া যায়নি</p>
          )}
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

export default Index;
