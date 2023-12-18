
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Close from '@mui/icons-material/Close';
import DehazeIcon from '@mui/icons-material/Dehaze';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
import star from 'components/mainSections/loan-management/loan-application/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  employeeRecordByOffice,
  memberCreate,
  memberFromCoop,
  officeName
} from '../../../../url/ApiList';
import { engToBang } from './validator';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MemberFromCoop = () => {
  const router = useRouter();
  const officeInfo = localStorageData('officeGeoData');
  const [samityMember, setSamityMember] = useState([]);
  const [modalData, setModalData] = useState({});
  const [modalClicked, setModalClicked] = useState(false);
  const [deskList, setDeskList] = useState([]);
  const [officeNames, setOfficeNames] = useState([]);
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  // const [userObj, setUserObj] = useState({
  //   id: "",
  //   label: "",
  // });
  const [deskObj, setDeskObj] = useState({
    id: '',
    label: '',
  });
  const config = localStorageData('config');

  useEffect(() => {
    getSamityMemberInfo();
    getOfficeName();
    if (officeInfo.id) {
      setOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
      getDeskId(officeInfo?.id);
    }
  }, []);
  const onNextPage = () => {
    router.push({
      pathname: '/samity-management/samity-registration',
    });
  };
  const onPreviousPage = () => {
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);

    let base64Data = JSON.stringify({
      samityId: result.samityId,
      id: result.id,
      projectId: result.projectId,
      samityLable: 1,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/samity-management/samity-registration',
      query: {
        data: base64Data,
      },
    });
  };
  let getSamityMemberInfo = async () => {
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);
    try {
      let showData = await axios.get(memberFromCoop + '/' + result.samityId, config);
      setSamityMember(showData.data.data);
    } catch (error) {
      errorHandler(error)
    }
  };
  const getDeskId = async (id) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, config);
      const deskData = Data.data.data;
      if (deskData.length == 1) {
        // setSelectedDesk(deskData[0].designationId);
        document.getElementById('deskId').setAttribute('disabled', 'true');
      }
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
  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);

      //("Office Name Data-----", officeNameData.data.data);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      if (error.response) {
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...');
      } else if (error) {
        NotificationManager.error(error.toString());
      }
    }
  };
  let onSubmitData = async (e) => {
    e.preventDefault();
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);
    let payLoadArray = [];
    for (let element of samityMember) {
      let particularDocuments = element.memberBasicInfo.documents;
      let newParticularDouments = particularDocuments?.map((elem) => {
        return {
          documentType: elem.docType,
          documentNumber: '',
          documentFront: elem.fileName,
          documentFrontType: '',
          documentBack: '',
          documentBackType: '',
        };
      });
      if (!newParticularDouments || newParticularDouments?.length == 0) {
        newParticularDouments = [];
      }
      payLoadArray.push(
        new Object({
          address: {
            per: {
              districtId: element?.memberPermanentAddress?.districtId ? element.memberPermanentAddress.districtId : '',
              upaCityId: element?.memberPermanentAddress?.upaCityId ? element.memberPermanentAddress.upaCityId : '',
              upaCityType: element?.memberPermanentAddress?.upaCityType
                ? element.memberPermanentAddress.upaCityType
                : '',
              uniThanaPawId: element?.memberPermanentAddress?.uniThanaPawId
                ? element.memberPermanentAddress.uniThanaPawId
                : '',
              uniThanaPawType: element?.memberPermanentAddress?.uniThanaPawType
                ? element.memberPermanentAddress.uniThanaPawType
                : '',
              village: element?.memberPermanentAddress?.detailsAddress
                ? element.memberPermanentAddress.detailsAddress
                : '',
            },
            pre: {
              districtId: element?.memberPresentAddress?.districtId ? element.memberPresentAddress.districtId : '',
              upaCityId: element?.memberPresentAddress?.upaCityId ? element.memberPresentAddress.upaCityId : '',
              upaCityType: element?.memberPresentAddress?.upaCityType ? element.memberPresentAddress.upaCityType : '',
              uniThanaPawId: element?.memberPresentAddress?.uniThanaPawId
                ? element.memberPresentAddress.uniThanaPawId
                : '',
              uniThanaPawType: element?.memberPresentAddress?.uniThanaPawType
                ? element.memberPresentAddress.uniThanaPawType
                : '',
              village: element?.memberPresentAddress?.detailsAddress
                ? element?.memberPresentAddress.detailsAddress
                : '',
            },
          },

          data: {
            originCustomerId: element.memberBasicInfo.id,
            nameBn: element.memberBasicInfo.memberNameBangla ? element.memberBasicInfo.memberNameBangla : null,
            nameEn: element.memberBasicInfo.memberName ? element.memberBasicInfo.memberName : null,
            projectId: result.projectId,
            fatherName: element.memberBasicInfo.fatherName ? element.memberBasicInfo.fatherName : null,
            motherName: element.memberBasicInfo.motherName ? element.memberBasicInfo.motherName : null,
            birthDate: element.memberBasicInfo.dob ? element.memberBasicInfo.dob : null,
            mobile: element.memberBasicInfo.mobile,
            religion: element.memberBasicInfo.religionId ? element.memberBasicInfo.religionId : null,
            gender: element.memberBasicInfo.genderId ? element.memberBasicInfo.genderId : null,
            maritalStatus: element.memberBasicInfo.maritalStatusId ? element.memberBasicInfo.maritalStatusId : null,
            spouseName: element.memberBasicInfo.spouseName ? element.memberBasicInfo.spouseName : null,
            education: element.memberBasicInfo.educationLevelId ? element.memberBasicInfo.educationLevelId : null,
            occupation: element.memberBasicInfo.occupationId,
            age: 22,
            memberDocuments: [
              {
                documentType: element.memberBasicInfo.nid ? 'NID' : 'BRN',
                documentNumber: element.memberBasicInfo.nid ? element.memberBasicInfo.nid : element.memberBasicInfo.brn,
                documentFront: '',
                documentFrontType: '',
                documentBack: '',
                documentBackType: '',
              },
              ...newParticularDouments,
            ],
            customerCode: element.memberBasicInfo.memberCode,
          },
        }),
      );
    }
    let payload = {
      memberInfo: payLoadArray,
      nextAppDesignationId: deskObj.id,
    };
    try {
      let memberInfoCoopResp = await axios.put(memberCreate + '/' + result.id, payload, config);
      // let coopSamityRemoveResp = await axios.patch(coopSamityRemove + result.samityId, '', config);

      NotificationManager.success(memberInfoCoopResp.data.message, '', 5000);
      onNextPage();
    } catch (error) {
      let message;
      if (error.response) {
        let length = error.response.data.errors.length;
        for (let i = 0; i < length; i++) {
          message = error.response.data.errors[i].message;
        }
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  // const handleCheck = (member) => {
  //   let indexToRemove = -1;
  //   let newArray = [...memberInfoArray];
  //   newArray.map((element, index) => {
  //     if (member.id == element.id) {
  //       indexToRemove = index;
  //     }
  //   });
  //   if (indexToRemove !== -1) {
  //     newArray.splice(indexToRemove, 1);
  //     setMemberInfoArray(newArray);
  //   } else {
  //     newArray.push(member);
  //   }
  //   setMemberInfoArray(newArray);
  // };

  const handleAllInfo = (member) => {
    let newArray = [...samityMember];
    let obj = newArray.find((obj) => obj.memberBasicInfo.id == member.memberBasicInfo.id);
    setModalData(obj.memberBasicInfo);
    setModalClicked(true);
  };

  const handleClose = () => {
    setModalClicked(false);
  };
  return (
    <>
      <Grid container className="section">
        <Grid item md={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">সদস্যের কোড</TableCell>
                  <TableCell>সদস্যের নাম</TableCell>
                  <TableCell>জাতীয় পরিচয়পত্র নম্বর/জন্ম নিবন্ধন</TableCell>
                  <TableCell>মোবাইল নম্বর</TableCell>
                  <TableCell align="center">নির্বাচন করুন</TableCell>
                  <TableCell align="center">বিস্তারিত</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samityMember &&
                  samityMember.map((member, index) => (
                    <TableRow key={member?.id}>
                      <TableCell align="center">{engToBang(member?.memberBasicInfo?.memberCode)}</TableCell>
                      <TableCell>{member?.memberBasicInfo?.memberNameBangla}</TableCell>
                      <TableCell>
                        {engToBang(
                          member.memberBasicInfo.brn ? member.memberBasicInfo.brn : member.memberBasicInfo.nid,
                        )}
                      </TableCell>
                      <TableCell>{engToBang(member?.memberBasicInfo?.mobile)}</TableCell>
                      <TableCell align="center">{<Checkbox sx={{ padding: '5px' }} checked={true} />}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => {
                            handleAllInfo(member, index);
                          }}
                        >
                          <DehazeIcon className="table-icon " />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  <DialogTitle>
                    সদস্যের বিস্তারিত তথ্য
                    <IconButton className="modal-close" onClick={handleClose}>
                      <Close className="icon-close" />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      <span className="label">সদস্যের নাম :</span> <span> {modalData.memberNameBangla}</span>
                    </Typography>
                    <Typography>
                      <span className="label">পিতার নাম :</span> <span> {modalData.fatherName}</span>
                    </Typography>
                    <Typography>
                      <span className="label">মাতার নাম :</span> <span> {modalData.motherName}</span>
                    </Typography>
                    <Typography>
                      <span className="label">মোবাইল নম্বর :</span> <span> {engToBang(modalData.mobile)}</span>
                    </Typography>
                  </DialogContent>
                </Dialog>
              ) : (
                ''
              )}
            </Table>
          </TableContainer>
        </Grid>
        <Grid container spacing={2.5} marginTop="15px">
          <Grid item lg={6} md={6} xs={12}>
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
                    officeObj.id === ''
                      ? star('পর্যবেক্ষনকারীর কার্যালয় নির্বাচন করুন')
                      : star('পর্যবেক্ষনকারীর কার্যালয়')
                  }
                  variant="outlined"
                  size="small"
                />
              )}
              value={officeObj}
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="serviceName"
              onChange={(event, value) => {
                if (value == null) {
                  setDeskObj({
                    id: '',
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
                .map((option) => ({
                  id: option.designationId,
                  label: option.nameBn,
                }))
                .filter((e) => e.id != null && e.label !== null)}
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
            {/* {(selectedDesk == "নির্বাচন করুন" || !selectedDesk) && (
                <span style={{ color: "red" }}>{formErrors.selectedDesk}</span>
              )} */}
          </Grid>
        </Grid>
        <Grid container className="btn-container">
          <Tooltip title="পূর্ববর্তী পাতা">
            <Button variant="contained" className="btn btn-primary" onClick={onPreviousPage}>
              <ArrowBackIcon sx={{ mr: '5px' }} />
              পূর্ববর্তী পাতা
            </Button>
          </Tooltip>
          <Tooltip title="সংরক্ষণ করুন">
            <Button
              variant="contained"
              className="btn btn-save"
              onClick={onSubmitData}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              সংরক্ষণ করুন
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

export default MemberFromCoop;
