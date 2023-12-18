
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
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
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  acceptDall,
  districtOffice,
  dolReject,
  dollDetails,
  getSamityForReport,
  groupForApprove,
  loanProject,
  upozilaOffice,
} from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="dowwn" ref={ref} {...props} />;
});
const GroupApprove = () => {
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const doptorId = getTokenData?.doptorId;
  const config = localStorageData('config');
  const [districtId, setDistrictId] = useState(null);
  const [upozilaId, setUpozilaId] = useState(null);
  const [samityData, setSamityData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [upozilaData, setUpozilaData] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState([]);
  const [dolData, setDolData] = useState([]);
  const [checkedMemberId, setCheckedMemberId] = useState([]);
  const [rejectedId, setRejectedId] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [modalClicked, setModalClicked] = useState(false);
  const [disableDistrict, setDisableDistrict] = useState(false);
  // const [disableUpa ,setDisableUpa] = useState(false);

  useEffect(() => {
    getProject();
    getDistrict();
  }, []);
  const handleInputChangeProjectName = (e) => {
    const { value } = e.target;
    setProjectId(value);
    if (upozilaId != null) {
      getSamity(upozilaId, value);
    }
    if (doptorId == 4) {
      getSamity(4, value);
    }
    if (doptorId == 8) {
      getSamity(8, value);
    }
  };

  const handleInputChangeDistrict = (e) => {
    setDistrictId(e.target.value);
    getupazila(e.target.value);
  };

  const handleInputChangeUpazila = (e) => {
    const { value } = e.target;
    setUpozilaId(e.target.value);
    if (projectId != null) {
      getSamity(value, projectId);
    }
  };
  const handleInputChangeSamityName = (e) => {
    const { value } = e.target;
    getAllDol(upozilaId, value);
  };

  const handleCheckAccepted = (id, e, index) => {
    const isRejectDisabled = document.getElementsByName(index + 'reject')[0].getAttribute('disabled');
    if (checkedMemberId.indexOf(id) > -1) {
      checkedMemberId.splice(checkedMemberId.indexOf(id), id);
      setCheckedMemberId([...checkedMemberId]);
    } else {
      setCheckedMemberId([...checkedMemberId, id]);
    }
    if (isRejectDisabled) {
      document.getElementsByName(index + 'reject')[0].removeAttribute('disabled');
    } else {
      document.getElementsByName(index + 'reject')[0].setAttribute('disabled', 'true');
    }
  };
  const handleCheckRejected = (id, e, index) => {
    const isAcceptDisabled = document.getElementsByName(index + 'accept')[0].getAttribute('disabled');
    if (rejectedId.indexOf(id) > -1) {
      rejectedId.splice(rejectedId.indexOf(id), id);
      setRejectedId([...rejectedId]);
    } else {
      setRejectedId([...rejectedId, id]);
    }
    if (isAcceptDisabled) {
      document.getElementsByName(index + 'accept')[0].removeAttribute('disabled');
    } else {
      document.getElementsByName(index + 'accept')[0].setAttribute('disabled', 'true');
    }
  };

  const handleAllInfo = async (id) => {
    // ("Id id ", id);
    try {
      const dataget = await axios.get(dollDetails + '?id=' + id + '&value=2&flag=1', config);
      let data = dataget.data.data;
      'All Data set in modal', dataget;
      setModalData(data);
    } catch (error) {
      errorHandler(error)
    }
    setModalClicked(true);
  };

  const handleClose = () => {
    setModalClicked(false);
  };

  const onSubmitData = async () => {
    if (checkedMemberId.length > 0) {
      let body;
      body = {
        dolId: checkedMemberId,
      };
      try {
        let checkedAcceptedIdResp = await axios.post(acceptDall, body, config);
        NotificationManager.success(checkedAcceptedIdResp.data.message, ' ', 5000);
      } catch (error) {
        if (error.response) {
          'Error Data', error.response;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, 'Error', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', 'Error', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), 'Error', 5000);
        }
      }
    }
    if (rejectedId.length > 0) {
      let body;
      body = {
        rejectId: rejectedId,
      };
      try {
        let checkedRejectedResp = await axios.post(dolReject, body, config);
        NotificationManager.success(checkedRejectedResp.data.message, ' ', 5000);
      } catch (error) {
        if (error.response) {
          'Error Data', error.response;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, 'Error', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', 'Error', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), 'Error', 5000);
        }
      }
      'Payload Value is', body;
    }
    if (checkedMemberId.length > 0 || rejectedId.length > 0) {
      setDolData([]);
    }
  };

  const getDistrict = async () => {
    try {
      const district = await axios.get(districtOffice, config);
      let districtList = district.data.data;
      if (districtList.length == 1) {
        setDistrictId(districtList[0].id);
        setDisableDistrict(true);
        getupazila(districtList[0].id);
      }
      // if (districtList.length == 1) {
      //   setDistrictId(districtList[0].id);
      //   document
      //     .getElementById("district")
      //     .setAttribute("disabled", "true");
      //   getupazila(districtList[0].id);
      // }
      setDistrictData(districtList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  let getupazila = async (Disid) => {
    'District Id Is', Disid;
    try {
      let upozila = await axios.get(upozilaOffice + '?districtOfficeId=' + Disid, config);
      let data = upozila.data.data;

      setUpozilaData(data);
    } catch (error) {
      'error message', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      setProjectName(projectList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  let getSamity = async (UpoId, proId) => {
    try {
      let samity = await axios.get(getSamityForReport + '?officeId=' + UpoId + '&projectId=' + proId, config);

      let data = samity.data.data;
      'song data', data;
      setSamityData(data);
    } catch (error) {
      'error message', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getAllDol = async (upoId, samityId) => {
    if (doptorId == 4 || doptorId == 8) {
      try {
        let doll = await axios.get(groupForApprove + '?value=2' + '&samity=' + samityId, config);
        'All Dall Get Data', doll;
        setDolData(doll.data.data);
        // NotificationManager.success(doll.data.message, "Success", 5000);
      } catch (error) {
        errorHandler(error)
      }
    } else {
      try {
        let doll = await axios.get(groupForApprove + '?officeId=' + upoId + '&value=2' + '&samity=' + samityId, config);
        'All Dall Get Data', doll;
        setDolData(doll.data.data);
        // NotificationManager.success(doll.data.message, "Success", 5000);
      } catch (error) {
        if (error.response) {
          errorHandler(error)
        }
      }
    }
  };

  return (
    <>
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
          //  value={memberApporval.upazila}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projectName.map((option) => (
              <option key={option.id} value={option.id}>
                {option.projectNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        {doptorId == 8 || doptorId == 4 ? (
          ''
        ) : (
          <>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label={star('জেলা অফিস')}
                name="district"
                id="district"
                select
                disabled={disableDistrict}
                SelectProps={{ native: true }}
                onChange={(e) => handleInputChangeDistrict(e)}
                variant="outlined"
                size="small"
                value={districtId != null ? districtId : ''}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {districtData.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.officeNameBangla}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label={star('উপজেলা অফিস')}
                id="upozilla"
                name="upazila"
                select
                SelectProps={{ native: true }}
                onChange={(e) => handleInputChangeUpazila(e)}
                type="text"
                variant="outlined"
                size="small"
              // value={memberApporval.upazila}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {upozilaData.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.officeNameBangla}
                  </option>
                ))}
              </TextField>
            </Grid>
          </>
        )}

        <Grid item md={3} xs={12}>
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
          //value={insName}
          // value={memberApporval.upazila}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {samityData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.samityName}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container className="section">
        <SubHeading>দলের তথ্য</SubHeading>

        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>প্রকল্পের নাম</TableCell>
                <TableCell>সমিতির নাম</TableCell>
                <TableCell>দলের নাম</TableCell>
                <TableCell align="center">অনুমোদিত</TableCell>
                <TableCell align="center">বাতিল</TableCell>
                <TableCell align="center">বিস্তারিত</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dolData && dolData.length > 0
                ? dolData.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{data.projectNameBangla}</div>} arrow>
                        <span className="data">{data.projectNameBangla}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{data.samityName}</div>} arrow>
                        <span className="data">{data.samityName}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {data && data.data && (
                        <Tooltip title={<div className="tooltip-title">{data.data.dolName}</div>} arrow>
                          <span className="data">{data.data.dolName}</span>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {
                        <Checkbox
                          name={index + 'accept'}
                          onClick={(e) => {
                            handleCheckAccepted(data.id, e, index);
                          }}
                        />
                      }
                    </TableCell>
                    <TableCell align="center">
                      {
                        <Checkbox
                          name={index + 'reject'}
                          onClick={(e) => {
                            handleCheckRejected(data.id, e, index);
                          }}
                        />
                      }
                    </TableCell>
                    <TableCell align="center">
                      <WysiwygIcon
                        className="view-icon"
                        onClick={() => {
                          handleAllInfo(data.id);
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
              >
                <SubHeading>সদস্যের তালিকা</SubHeading>
                <DialogContent>
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
                      <TableBody>
                        {modalData != null
                          ? modalData.map((data) => (
                            <TableRow key={data.id}>
                              <TableCell>{data.nameBn}</TableCell>
                              <TableCell>{data.fatherName}</TableCell>
                              <TableCell>{data.motherName}</TableCell>
                              <TableCell>{data.mobile}</TableCell>
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

export default GroupApprove;
