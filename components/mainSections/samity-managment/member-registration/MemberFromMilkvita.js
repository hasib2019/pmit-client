
import DehazeIcon from '@mui/icons-material/Dehaze';

import { Close } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { engToBang } from 'service/numberConverter';
import { employeeRecordByOffice, memberCreate, milkvitaMember, officeName } from '../../../../url/ApiList';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MemberFromMilkvita = () => {
  const config = localStorageData('config');
  const router = useRouter();
  const [samityMember, setSamityMember] = useState([]);
  const [modalData, setModalData] = useState({});
  const [modalClicked, setModalClicked] = useState(false);
  const [officeNames, setOfficeNames] = useState([]);
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [deskList, setDeskList] = useState([]);
  const [deskObj, setDeskObj] = useState({
    id: '',
    label: '',
  });
  useEffect(() => {
    getSamityMemberInfo();
    getOfficeName();
  }, []);
  const onNextPage = () => {
    router.push({
      pathname: '/samity-management/samity-registration',
    });
  };

  const onPreviousPage = () => {
    // localStorage.setItem("data",base64Data)
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);

    let base64Data = JSON.stringify({
      samityId: result.samityId,
      id: result.id,
      projectId: result.projectId,
      samityLable: 2,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/samity-management/samity-registration',
      query: {
        data: base64Data,
      },
    });
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

  let getSamityMemberInfo = async () => {
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);
    try {
      let showData = await axios.get(milkvitaMember + '?associationId=' + result.samityId, config);
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
  // let onSubmitData = async (e) => {
  //   let result = router.query.projectId;
  //   e.preventDefault();
  //   ({ samityMember });
  //   let payLoadArray = [];
  //   for (let element of samityMember) {

  //     payLoadArray.push(new Object({
  //       //   address: {
  //       //     per: {
  //       //         districtId: element.memberPermanentAddress?element.memberPermanentAddress.districtId:"",
  //       //         upaCityId: element.memberPermanentAddress?element.memberPermanentAddress.upaCityId:"",
  //       //         upaCityType: element.memberPermanentAddress?element.memberPermanentAddress.upaCityType:"",
  //       //         uniThanaPawId: element.memberPermanentAddress? element.memberPermanentAddress.uniThanaPawId:"",
  //       //         uniThanaPawType: element.memberPermanentAddress? element.memberPermanentAddress.uniThanaPawType:"",
  //       //         postCode: 4000,
  //       //         village: 1,
  //       //     },
  //       //   pre: {
  //       //     districtId: element.memberPresentAddress?element.memberPresentAddress.districtId:"",
  //       //     upaCityId: element.memberPresentAddress?element.memberPresentAddress.upaCityId:"",
  //       //     upaCityType:element.memberPresentAddress?element.memberPresentAddress.upaCityType:"",
  //       //     uniThanaPawId: element.memberPresentAddress?element.memberPresentAddress.uniThanaPawId:"",
  //       //     uniThanaPawType:element.memberPresentAddress?element.memberPresentAddress.uniThanaPawType:"",
  //       //         postCode: 4000,
  //       //         village: 70,
  //       //     }
  //       // },
  //       address: {
  //         per: {
  //           districtId: 5104,
  //           upaCityId: 2753,
  //           upaCityType: "UPA",
  //           uniThanaPawId: 2757,
  //           uniThanaPawType: "UNI",
  //           postCode: 4000,
  //           village: "দাকপ",
  //           wardNo: 1,
  //           roadNo: 6,
  //           holdingNo: 110000,
  //         },
  //         pre: {
  //           districtId: 5104,
  //           upaCityId: 2753,
  //           upaCityType: "UPA",
  //           uniThanaPawId: 2757,
  //           uniThanaPawType: "UNI",
  //           postCode: 4000,
  //           village: "দাকপ",
  //           wardNo: 1,
  //           roadNo: 6,
  //           holdingNo: 110000,
  //         },
  //       },

  //       data: {
  //         projectId: result,
  //         nameBn: element.nameBn ? element.nameBn : null,
  //         nameEn: element.nameEn ? element.nameEn : null,
  //         fatherName: element.fatherName ? element.fatherName : null,
  //         motherName: element.motherName ? element.motherName : null,
  //         birthDate: element.birthDate ? element.birthDate : null,
  //         mobile: element.mobile ? element.mobile : null,
  //         religion: element.religion ? element.religion : null,
  //         gender: element.gender ? element.gender : null,
  //         maritalStatus: element.maritalStatus,
  //         spouseName: element.spouse ? element.spouse.bn : null,
  //         //education:element.memberBasicInfo.educationLevelId?element.memberBasicInfo.educationLevelId:null,
  //         occupation: element.occupation ? element.occupation : "",
  //         age: 22,
  //         // yearlyIncome:element.memberBasicInfo.yearlyIncome?element.memberBasicInfo.yearlyIncome:null,

  //         // familyHead:element.memberBasicInfo.familyHead?element.familyHead:null,
  //         // ownResidence: element.memberBasicInfoownResidence,
  //         // residenceRemarks: element.memberBasicInfo.residenceRemarks,
  //         //  memberDocuments:[{
  //         //       documentType: "NID",
  //         //       documentNumber: element.nid? element.nid:"",
  //         //       documentFront: "",
  //         //       documentFrontType: "",
  //         //       documentBack: "",
  //         //       documentBackType: ""}],
  //         memberDocuments: [{
  //           documentType: "NID",
  //           documentNumber: element.nid,
  //           documentFront: "",
  //           documentFrontType: "",
  //           documentBack: "",
  //           documentBackType: ""
  //         }],
  //         customerCode: element.code ? element.code : "",

  //       }
  //     }
  //     ))
  //   }
  //   let payload = {
  //     memberInfo: payLoadArray,
  //     nextAppDesignationId: deskObj.id,
  //   }

  //   try {
  //     let memberInfoCoopResp = await axios.put(memberCreate + "/" + router.query.id, payload, config);
  //     NotificationManager.success(memberInfoCoopResp.data.message, "", 5000);
  //     onNextPage()
  //   } catch (error) {
  //     let message;
  //     if (error.response) {
  //       let length = error.response.data.errors.length;
  //       let count = 1;
  //       for (let i = 0; i < length; i++) {
  //         message = error.response.data.errors[i].message;
  //       }
  //       NotificationManager.error(message, "", 5000);
  //     } else if (error.request) {
  //       NotificationManager.error("Error Connecting...", "", 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), "", 5000);
  //     }
  //   }
  // }
  let onSubmitData = async (e) => {
    e.preventDefault();
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);
    let payLoadArray = [];
    for (let element of samityMember) {
      // let particularDocuments = element.addresses;
      // let newParticularDouments = particularDocuments.map((elem, i) => {
      //   return {
      //     documentType: "NID",
      //     documentNumber: ,
      //     documentFront: elem.fileName,
      //     documentFrontType: "",
      //     documentBack: "",
      //     documentBackType: "",
      //   };
      // });
      let presentAddress = element.addresses.filter((value) => value.address_type == 'PRE');
      let permenentAddress = element.addresses.filter((value) => value.address_type == 'PER');
      payLoadArray.push(
        new Object({
          address: {
            per: {
              districtId: permenentAddress[0].geo_district_id,
              upaCityId: permenentAddress[0].geo_upazila_id,
              upaCityType: 'UPA',
              uniThanaPawId: result.uniThanaPawId,
              uniThanaPawType: result.uniThanaPawIdType.split(',')[1],
              village: permenentAddress[0].detail_address,
            },
            pre: {
              districtId: presentAddress[0].geo_district_id,
              upaCityId: presentAddress[0].geo_upazila_id,
              upaCityType: 'UPA',
              uniThanaPawId: result.uniThanaPawId,
              uniThanaPawType: result.uniThanaPawIdType.split(',')[1],
              village: presentAddress[0].detail_address,
            },
          },

          data: {
            originCustomerId: element?.id,
            nameBn: element?.name?.bn ? element.name.bn : 'N/A',
            nameEn: element?.name?.en ? element.name.en : 'N/A',
            projectId: result.projectId,
            fatherName: element?.father?.bn ? element.father.bn : 'N/A',
            motherName: element?.mother?.bn ? element.mother.bn : 'N/A',
            birthDate: element?.dob ? element.dob : '14/10/1997',
            mobile: '01511142101',
            religion: element?.religion?.id ? element.religion.id : 46,
            gender: element?.gender?.id ? element.gender.id : 4,
            /// 48 = unmarried/////
            maritalStatus: element?.merital_status?.id ? element.merital_status.id : 48,
            spouseName: element?.spouse?.bn ? element.spouse.bn : null,
            education: 64,
            occupation: element?.occupation?.id ? element.occupation.id : 21,
            age: 24,
            memberDocuments: [
              {
                documentType: 'NID',
                documentNumber: element?.document?.nid ? element?.document?.nid : '1793652145',
                documentFront: '',
                documentFrontType: '',
                documentBack: '',
                documentBackType: '',
              },
            ],
            customerCode: element?.code,
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

      NotificationManager.success(memberInfoCoopResp.data.message, '', 5000);
      onNextPage();
    } catch (error) {
      let message;
      if (error.response) {
        let length = error.response.data.errors.length;
        // let count = 1;
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


  const handleAllInfo = (member) => {
    let indexToGet = -1;
    let newArray = [...samityMember];

    newArray.map((element, index) => {
      if (member.id == element.id) {
        indexToGet = index;
      }
    });
    setModalData(samityMember[indexToGet]);
    setModalClicked(true);
  };

  const handleClose = () => {
    setModalClicked(false);
  };

  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12}>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>সদস্য কোড</TableCell>
                  <TableCell>সদস্যের নাম</TableCell>
                  <TableCell>জাতীয় পরিচয় পত্র নম্বর</TableCell>
                  <TableCell>মোবাইলে নম্বর</TableCell>
                  <TableCell>নির্বাচন করুন</TableCell>
                  <TableCell>বিস্তারিত</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samityMember &&
                  samityMember.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.code}</TableCell>
                      <TableCell>{member.name.bn}</TableCell>
                      <TableCell>{member.document.nid}</TableCell>
                      <TableCell>{member.mobile}</TableCell>
                      <TableCell>{<Checkbox checked={true} />}</TableCell>
                      {/* <TableCell>
                      <DehazeIcon
                        onClick={() => { handleAllInfo(member, index) }}
                      />
                      {
                        modalClicked ?
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
                              <DialogContent>
                                <Typography><span className="label">সদস্যের নাম :</span> <span> {modalData.nameBn}</span></Typography>
                                <Typography><span className="label">পিতার নাম :</span> <span> {modalData.fatherName}</span></Typography>
                                <Typography><span className="label">মাতার নাম :</span> <span> {modalData.motherName}</span></Typography>
                                <Typography><span className="label">মোবাইল নম্বর :</span> <span> {engToBang(modalData.mobile)}</span></Typography>
                              </DialogContent>
                            </DialogContent>

                          </Dialog> : ""
                      }
                    </TableCell> */}
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
                      <span className="label">সদস্যের নাম :</span> <span> {modalData?.name?.bn}</span>
                    </Typography>
                    <Typography>
                      <span className="label">পিতার নাম :</span> <span> {modalData?.father?.bn}</span>
                    </Typography>
                    <Typography>
                      <span className="label">মাতার নাম :</span> <span> {modalData?.mother?.bn}</span>
                    </Typography>
                    <Typography>
                      <span className="label">লিঙ্গ :</span> <span> {engToBang(modalData?.gender?.name)}</span>
                    </Typography>
                    <Typography>
                      <span className="label">বৈবাহিক অবস্থা :</span>{' '}
                      <span> {modalData?.maritalStatus == null ? 'অবিবাহিত' : 'বিবাহিত'}</span>
                    </Typography>
                    <Typography>
                      <span className="label">স্বামী/স্ত্রী এর নাম :</span>{' '}
                      <span> {modalData.maritalStatus != null ? modalData?.spouse?.bn : 'নেই'}</span>
                    </Typography>
                    <Typography>
                      <span className="label">পেশা:</span> <span> {modalData?.occupation?.name}</span>
                    </Typography>
                  </DialogContent>
                </Dialog>
              ) : (
                ''
              )}
            </Table>
          </TableContainer>
        </Grid>
        {/* <Grid container spacing={2.5} marginTop="15px">
          <Grid item lg={6} md={6} xs={12}>
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="officeName"
              onChange={(event, value) => {
                if (value == null) {
                  setOfficeObj({
                    id: "",
                    label: "",
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
                    officeObj.id === ""
                      ? star("পর্যবেক্ষনকারীর কার্যালয় নির্বাচন করুন")
                      : star("পর্যবেক্ষনকারীর কার্যালয়")
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
                    id: "",
                    label: "",
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
                    deskObj.id === ""
                      ? star("পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন")
                      : star("পর্যবেক্ষক/অনুমোদনকারীর নাম")
                  }
                  variant="outlined"
                  size="small"
                />
              )}
              value={deskObj}
            />
          </Grid>
        </Grid> */}
        {/* <Grid container className='btn-container' >
          {loadingDataSaveUpdate ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveOutlinedIcon />}
              variant="outlined"
            >
              "সংরক্ষণ করা হচ্ছে..."
            </LoadingButton>) :
            <>
              <Tooltip title="সংরক্ষণ করুন">
                <Button
                  variant="contained"
                  className='btn-save-lg'
                  onClick={onSubmitData}
                  startIcon={<SaveOutlinedIcon />}
                >

                  {" "}সংরক্ষণ করুন
                </Button>
              </Tooltip>
            </>

          }
        </Grid> */}
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
              options={
                deskList.map((option) => ({
                  id: option.designationId,
                  label: option.nameBn + '-' + option.designation,
                }))
                // .filter((e) => e.id != null && e.label !== null)
              }
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

export default MemberFromMilkvita;
