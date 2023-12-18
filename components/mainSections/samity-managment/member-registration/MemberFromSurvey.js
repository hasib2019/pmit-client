/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Close from '@mui/icons-material/Close';
import DehazeIcon from '@mui/icons-material/Dehaze';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
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
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { loanProject, memberFromSurvey } from '../../../../url/ApiList';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MemberFromSurvey = () => {
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const router = useRouter();
  const [samityMember, setSamityMember] = useState([]);
  const [modalData, setModalData] = useState({});
  const [memberInfoArray, setMemberInfoArray] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [modalClicked, setModalClicked] = useState(false);
  const [passBookFee, setPassBookFee] = useState('');
  const [admissionFee, setAdmissionFee] = useState('');
  const config = localStorageData('config');

  useEffect(() => {
    getSamityMemberInfo();
    getAdmissionFee();
  }, []);

  let getAdmissionFee = async () => {
    let base64ConvertedData = atob(router.query.data);
    let result = '';
    if (base64ConvertedData) {
      result = JSON.parse(base64ConvertedData);
    }
    let projectId = result?.projectId;
    try {
      let showData = await axios.get(loanProject + 'projectWithPagination?page=1&id=' + projectId, config);
      setAdmissionFee(showData?.data?.data?.data[0]?.admissionFee);
      setPassBookFee(showData?.data?.data?.data[0]?.passbookFee);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let getSamityMemberInfo = async () => {
    try {
      let showData = await axios.get(memberFromSurvey, config);
      let data = showData.data.data;
      data.map((item) => (item.checked = false));
      'Samity Data are ', data;
      setSamityMember(data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const onPreviousPage = () => {
    // localStorage.setItem("data",base64Data)
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);
    router.push({
      pathname: '/samity-management/samity-registration',
      query: {
        samityLable: 2,
        id: result.id,
      },
    });
  };
  const onNextPage = () => {
    router.push({
      pathname: '/samity-management/samity-registration',
    });
  };
  let onSubmitData = async (e) => {
    e.preventDefault();
    // setLoadingDataSaveUpdate(true);
    let lengthArray = memberInfoArray.length;
    let base64ConvertedData = atob(router.query.data);
    let result = JSON.parse(base64ConvertedData);
    let samityMinMember = result.samityMinMember;
    let samityMaxMember = result.samityMaxMember;
    if (!(lengthArray >= samityMinMember) || !(lengthArray <= samityMaxMember)) {
      if (lengthArray > samityMaxMember) {
        NotificationManager.error(
          `সমিতিতে উল্লেখিত সদস্য অপেক্ষা নির্বাচিত সদস্য বড় হতে পারবে না--সমিতির সর্বনিম্ন সদস্য ${samityMinMember} এবং সমিতির সর্বোচ্চ সদস্য ${samityMaxMember} `,
          '',
          5000,
        );
      } else if (lengthArray < samityMinMember) {
        NotificationManager.error(
          `সমিতিতে উল্লেখিত সদস্য অপেক্ষা নির্বাচিত সদস্য ছোট হতে পারবে না--সমিতির সর্বনিম্ন সদস্য ${samityMinMember} এবং সমিতির সর্বোচ্চ সদস্য ${samityMaxMember}`,
          '',
          5000,
        );
      }
      // setLoadingDataSaveUpdate(false);
      return;
    }
    let payLoadArray = [];

    for (let element of memberInfoArray) {
      payLoadArray.push(
        new Object({
          address: {
            per: {
              districtId: 5104,
              upaCityId: 2753,
              upaCityType: 'UPA',
              uniThanaPawId: 2757,
              uniThanaPawType: 'UNI',
              postCode: 4000,
              village: 'দাকপ',
              wardNo: 1,
              roadNo: 6,
              holdingNo: 110000,
            },
            pre: {
              districtId: 5104,
              upaCityId: 2753,
              upaCityType: 'UPA',
              uniThanaPawId: 2757,
              uniThanaPawType: 'UNI',
              postCode: 4000,
              village: 'দাকপ',
              wardNo: 1,
              roadNo: 6,
              holdingNo: 110000,
            },
          },
          data: {
            nameBn: element.nameBn,
            nameEn: element.nameEn,
            projectId: result.projectId,
            fatherName: element.fatherName,
            motherName: element.motherName,
            birthDate: element.birthDate,
            mobile: element.mobile,
            religion: element.religion,
            gender: element.gender,
            maritalStatus: element.maritalStatus,
            spouseName: element.spouseName,
            education: element.education,
            occupation: element.occupation,
            age: element.age,
            yearlyIncome: element.yearlyIncome,
            familyMemberMale: element.familyMemberMale,
            familyMemberFemale: element.familyMemberFemale,
            familyHead: element.familyHead,
            ownResidence: element.ownResidence,
            residenceRemarks: element.residenceRemarks,
            memberDocuments: [
              {
                documentType: 'NID',
                documentNumber: element.nid,
                documentFront: '',
                documentFrontType: '',
                documentBack: '',
                documentBackType: '',
              },
            ],
            admissionFee: admissionFee ? admissionFee : 0,
            passbookFee: passBookFee ? passBookFee : 0,
          },
        }),
      );
    }
    let payload = {
      memberInfo: payLoadArray,
    };
    try {
      setLoadingDataSaveUpdate(true);
      //Samity Id should be get from Samity Reg from Survey(Remaining Work)
      let memberInfoSurveyResp = await axios.put(memberFromSurvey + '?id=' + result.id, payload, config);
      setLoadingDataSaveUpdate(false);

      NotificationManager.success(memberInfoSurveyResp.data.message, '', 5000);
      onNextPage();
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };
  const handleCheck = (member, event) => {
    let samityMemberArray = [...samityMember];

    let selectedObjIndex = samityMemberArray.findIndex((item) => item.id == member.id);

    samityMemberArray[selectedObjIndex]['checked'] = event.target.checked;

    let indexToRemove = -1;
    let newArray = [...memberInfoArray];
    newArray.map((element, index) => {
      if (member.id == element.id) {
        indexToRemove = index;
      }
    });
    if (indexToRemove !== -1) {
      newArray.splice(indexToRemove, 1);
      setMemberInfoArray(newArray);
    } else {
      newArray.push(member);
    }
    setMemberInfoArray(newArray);
    setSamityMember(samityMemberArray);
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

  const handleSelectAll = (e) => {
    let samityMemberArray = [...samityMember];
    samityMemberArray.map((item) => (item.checked = e.target.checked));
    ({ samityMemberArray });
    setSamityMember(samityMemberArray);
    if (e.target.checked) {
      setMemberInfoArray(samityMemberArray);
    } else {
      setMemberInfoArray([]);
    }
    setIsCheckAll(e.target.checked);
  };
  return (
    <>
      <Grid container>
        <TableContainer className="table-container">
          <Table aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell sx={{ width: '7%' }}>সার্ভে কোড</TableCell>
                <TableCell sx={{ width: '18%' }}>সদস্যের নাম</TableCell>
                <TableCell sx={{ width: '15%' }}>জাতীয় পরিচয়পত্র নম্বর</TableCell>
                <TableCell sx={{ width: '11%' }}>মোবাইল নম্বর</TableCell>
                <TableCell sx={{ width: '9%' }} align="right">
                  মেম্বার ভর্তি ফি (টাকা)
                </TableCell>
                <TableCell sx={{ width: '9%' }} align="right">
                  পাসবুক ফি (টাকা)
                </TableCell>
                <TableCell sx={{ width: '11%' }} className="tbale-data-center">
                  নির্বাচন করুন
                  <Checkbox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    onChange={handleSelectAll}
                    checked={isCheckAll}
                    color="success"
                    sx={{ padding: '0 4px' }}
                  />
                </TableCell>
                <TableCell sx={{ width: '5%' }} align="center">
                  বিস্তারিত
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samityMember &&
                samityMember.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell> {member?.id} </TableCell>
                    <TableCell> {member?.nameBn} </TableCell>
                    <TableCell>{member?.nid}</TableCell>
                    <TableCell>{member?.mobile}</TableCell>
                    <TableCell align="right">{Math.floor(admissionFee)}</TableCell>
                    <TableCell align="right">{Math.floor(passBookFee)}</TableCell>
                    <TableCell align="center">
                      {
                        <Checkbox
                          onChange={(e) => {
                            handleCheck(member, e);
                          }}
                          checked={member.checked}
                        />
                      }
                    </TableCell>
                    <TableCell align="center">
                      <DehazeIcon
                        sx={{ paddingTop: '4px' }}
                        onClick={() => {
                          handleAllInfo(member);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            {modalClicked ? (
              <Dialog
                fullWidth
                maxWidth="md"
                className="diaModal"
                open={modalClicked}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle sx={{ padding: { xs: '1.5rem', md: '1.5rem 3rem ' } }}>
                  <span className="modal-title">সদস্যের বিস্তারিত তথ্য</span>
                  <IconButton className="modal-close" onClick={handleClose}>
                    <Close />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: { xs: '1.5rem', md: '3rem' } }}>
                  <Typography>
                    <span className="label">সদস্যের নাম</span> <span>: {modalData.nameBn}</span>
                  </Typography>
                  <Typography>
                    <span className="label">পিতার নাম</span> <span>: {modalData.fatherName}</span>
                  </Typography>
                  <Typography>
                    <span className="label">মাতার নাম</span> <span>: {modalData.motherName}</span>
                  </Typography>
                  <Typography>
                    <span className="label">মোবাইল নম্বর</span> <span>: {modalData.mobile}</span>
                  </Typography>
                  <Typography>
                    <span className="label">সদস্যের বয়স</span> <span>: {modalData.age}</span>
                  </Typography>
                  <Typography>
                    <span className="label">সদস্যের ইমেইল</span> <span>: {modalData.email}</span>
                  </Typography>
                </DialogContent>
              </Dialog>
            ) : (
              ''
            )}
          </Table>
        </TableContainer>
      </Grid>
      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            "সংরক্ষণ করা হচ্ছে..."
          </LoadingButton>
        ) : (
          <>
            <Tooltip title="পূর্ববর্তী পাতা">
              <Button variant="contained" className="btn btn-primary" onClick={onPreviousPage}>
                <ArrowBackIcon sx={{ mr: '5px' }} />
                <span>পূর্ববর্তী পাতা</span>
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
          </>
        )}
      </Grid>
    </>
  );
};

export default MemberFromSurvey;
