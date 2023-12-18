import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  Dialog,
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
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { aplicationDetailRoute, serviceName, updateApplication } from '../../../url/ApiList';
import SubHeading from '../../shared/others/SubHeading';
import star from '../loan-management/loan-application/utils';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="dowwn" ref={ref} {...props} />;
});

const Dashboard = () => {
  const router = useRouter();
  const compoName = localStorageData('componentName');
  const config = localStorageData('config');
  const [serviceList, setServiceList] = useState([]);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [serviceId, setServiceId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [modalClicked, setModalClicked] = useState(false);
  const [singleApplicationData, setSingleApplicationData] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    getApplicationList();
    getApplicationDetails();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setServiceId(value);
    getApplicationDetails(value);
  };

  const handleNeedForCorrection = (e, item) => {
    const singleApplication = applicationDetails.filter((appData) => appData.id == item);
    setSingleApplicationData(singleApplication);
    setServiceId(singleApplication[0].serviceId);
    setApplicationId(item);
    setModalClicked(true);
  };
  const handleClose = () => {
    setModalClicked(false);
  };

  const onSubmitCorrection = async () => {
    let payload;
    switch (serviceId) {
      case 7:
        payload = {
          projectId: singleApplicationData[0].data.projectId ? singleApplicationData[0].data.projectId : null,
          samityId: singleApplicationData[0].samityId ? singleApplicationData[0].samityId : null,
          nextAppDesId: singleApplicationData[0].data.nextAppDesinationId
            ? singleApplicationData[0].data.nextAppDesinationId
            : null,
          data: {
            projectId: singleApplicationData[0]?.data.projectId ? singleApplicationData[0].data.projectId : null,
            productId: singleApplicationData[0]?.data.productId
              ? parseInt(singleApplicationData[0].data.productId)
              : null,
            customerId: singleApplicationData[0]?.data.customerId ? singleApplicationData[0].data.customerId : null,
            loanAmount: singleApplicationData[0]?.data.loanAmount ? singleApplicationData[0].data.loanAmount : null,
            applyDate: singleApplicationData[0]?.applicationDate ? singleApplicationData[0].applicationDate : null,
            loanTerm: singleApplicationData[0]?.data.loanTerm ? singleApplicationData[0].data.loanTerm : null,
            interestRate: singleApplicationData[0]?.data.interestRate
              ? singleApplicationData[0].data.interestRate
              : null,
            serviceCharge: singleApplicationData[0]?.data.serviceCharge
              ? singleApplicationData[0].data.serviceCharge
              : null,
            frequency: singleApplicationData[0].data.frequency ? singleApplicationData[0].data.frequency : null,
            installmentNumber: singleApplicationData[0].data.installmentNumber
              ? singleApplicationData[0].data.installmentNumber
              : null,
            loanPurpose: singleApplicationData[0].data.loanPurpose ? singleApplicationData[0].data.loanPurpose : null,
            installmentAmount: singleApplicationData[0].data.installmentAmount
              ? singleApplicationData[0].data.installmentAmount
              : null,
            remarks: singleApplicationData[0].description ? singleApplicationData[0].description : '',
            grantorInfo: singleApplicationData[0].data.grantorInfo,
            documentList: singleApplicationData[0].data.documentList,
          },
          status: 'P',
          remarks,
        };
        break;
      case 14:
        // payload = {
        //   memberInfo: [
        //     {
        //       data: {
        //         projectId: memberInfo.projectName,
        //         ...(samityLevel == '1' && { samityId: approvedSamityId }),
        //         memberId: memberEditData?.data?.id,
        //         nameBn: memberInfo.memberNameB,
        //         nameEn: memberInfo.memberNameE,
        //         age: bangToEng(age),
        //         fatherName: memberInfo.fatherName,
        //         motherName: memberInfo.motherName,
        //         birthDate: value,
        //         mobile: bangToEng(memberInfo.mobile),
        //         religion: memberInfo.religion,
        //         gender: memberInfo.gender,
        //         maritalStatus: memberInfo.maritalStatus,
        //         ...(memberInfo.spouseName && {
        //           spouseName: memberInfo.spouseName,
        //         }),

        //         occupation: memberInfo.occupation,
        //         ...(doptorId == '4' && { secondaryOccupation: memberInfo.secondaryOccupation }),
        //         yearlyIncome: bangToEng(memberInfo.annualIncome),
        //         email: memberInfo.email,
        //         fatherNid: bangToEng(memberInfo.fatherNid),
        //         motherNid: bangToEng(memberInfo.motherNid),
        //         admissionFee: admissionFee ? bangToEng(admissionFee) : 0,
        //         passbookFee: passBookFee ? bangToEng(passBookFee) : 0,
        //         ...(memberInfo.transactionType && {
        //           transactionType: memberInfo.transactionType,
        //         }),
        //         ...(memberInfo.bankName && { bankId: memberInfo.bankName }),
        //         ...(memberInfo.branchName && { branchId: memberInfo.branchName }),
        //         ...(memberInfo.accName && { accountTitle: memberInfo.accName }),
        //         ...(memberInfo.bankAcc && { accountNo: memberInfo.bankAcc }),
        //         ...(memberInfo.acc && { accountNo: bangToEng(memberInfo.acc) }),
        //         memberDocuments: newDocList,
        //         ...(samityType == 'G' ? { classId: memberInfo?.classType } : { education: memberInfo?.classType }),
        //         ...(samityType == 'G' && { section: memberInfo?.section }),
        //         ...(samityType == 'G' && {
        //           rollNo: bangToEng(memberInfo?.rollNumber),
        //         }),
        //         committeeRoleId: selectedCommitteeRole ? selectedCommitteeRole : null,
        //       },
        //       address: {
        //         pre: {
        //           districtId: memberInfo.district_id != '' ? parseInt(memberInfo.district_id) : null,
        //           upaCityId: memberInfo.upazila_id != '' ? parseInt(memberInfo.upazila_id) : null,
        //           upaCityType: memberInfo.upazila_type != '' ? memberInfo.upazila_type : '',
        //           uniThanaPawId: memberInfo.union_id != '' ? parseInt(memberInfo.union_id) : null,
        //           uniThanaPawType: memberInfo.union_type != '' ? memberInfo.union_type : '',
        //           postCode: bangToEng(memberInfo.postOffice),
        //           village: memberInfo.village,
        //         },

        //         per: permanentAdd,
        //       },
        //       guardianInfo: {
        //         guardianName: memberInfo.vGuardian ? memberInfo.vGuardian : null,
        //         documentNo: memberInfo.vGuardianNid ? bangToEng(memberInfo.vGuardianNid) : null,
        //         occupation:
        //           memberInfo.vGuardianOccupation & (memberInfo.vGuardianOccupation != 'নির্বাচন করুন')
        //             ? memberInfo.vGuardianOccupation
        //             : null,
        //         relation: memberInfo.vGuardianRelation != 'নির্বাচন করুন' ? memberInfo.vGuardianRelation : null,
        //       },
        //       nominee: newNominiList,
        //       memberSign: signature.signature,
        //       memberSignType: signature.mimetypesignature,
        //       memberPicture: image.image,
        //       memberPictureType: image.mimetypeimage,
        //       removedNomineeId: removeIdArray,
        //       memberType: 'update',
        //     },
        //   ],
        //   ...(memberEditData?.index != 'main' && {
        //     index: memberEditData?.index,
        //   }),
        //   ...(memberEditData?.index != 'main' && { operation: 'edit' }),
        // };
        break;
    }
    try {
      let sanctionAPIResp = await axios.put(updateApplication + 'sanction/' + applicationId, payload, config);
      NotificationManager.success(sanctionAPIResp.data.message, '', 5000);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('সংযোগে ত্রুটি হয়েছে', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
    setModalClicked(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getApplicationList = async () => {
    try {
      let showData = await axios.get(serviceName + '/' + compoName + '?isPagination=false&status=user', config);
      const applicationType = showData.data.data;
      setServiceList(applicationType);
    } catch (error) {
      errorHandler(error)
    }
  };

  const handleRemarks = (e) => {
    setRemarks(e.target.value);
  };

  const getApplicationDetails = async (serviceId) => {
    try {
      let showData = await axios.get(
        serviceId != undefined
          ? aplicationDetailRoute + '/' + compoName + '?serviceId=' + serviceId
          : aplicationDetailRoute + '/' + compoName,
        config,
      );
      const appDetails = showData.data.data;
      setApplicationDetails(appDetails);
    } catch (error) {
      errorHandler(error)
    }
  };

  const onRowsPerPageChange = (e) => {
    const { value } = e.target;
    setRowsPerPage(value);
  };

  const handleService = (e, item) => {
    const urlData = {
      id: item.id,
      status: item.status,
      item
    }
    const encryptData = encodeURIComponent(JSON.stringify(urlData));
    router.push({
      pathname: item.pageLink,
      query: {
        data: encryptData,
      },
    });
  };
  // ==============================  TOOLTIP  start ==========================
  // const customeTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  //   ({ theme }) => ({
  //     [`&.${tooltipClasses.tooltip}`]: {
  //       background: 'var(--color-primary)',
  //       color: 'var(--color-text)',
  //       boxShadow: '0 5px 10px  rgba(0,0,0,0.5)',
  //       fontSize: 12,
  //       cursor: 'pointer',
  //       arrow: true,
  //     },
  //   }),
  // );
  // const [tooltipOpen, setTooltipOpen] = React.useState(false);
  // const handleTooltipClose = () => {
  //   setTooltipOpen(false);
  // };
  // const handleTooltipOpen = () => {
  //   setTooltipOpen(true);
  // };
  // ==============================  TOOLTIP  end ==========================
  const determineTableAccordingToComponentName = () => {
    if (compoName === 'loan') {
      return (
        <TableContainer className="table-container">
          <Table sx={{ width: '100%' }}>
            <TableHead className="table-head">
              <TableRow>
                <TableCell>সমিতির নাম</TableCell>
                <TableCell>প্রকল্পের নাম</TableCell>
                <TableCell>সেবার নাম</TableCell>
                <TableCell>বিবরণ</TableCell>
                <TableCell align="center" sx={{ width: '8%' }}>
                  আবেদনের অবস্থা
                </TableCell>
                <TableCell align="center" sx={{ width: '10%' }}>
                  আবেদনের তারিখ
                </TableCell>
                <TableCell align="center" sx={{ width: '5%' }}>
                  সংশোধন
                </TableCell>
                <TableCell align="center" sx={{ width: '5%' }}>
                  প্রেরণ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicationDetails
                ? applicationDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row" className="details">
                      {item.samityName ? (
                        <Tooltip title={<span style={{ fontSize: '14px' }}>{item.samityName}</span>} arrow>
                          <span className="data">{item.samityName}</span>
                        </Tooltip>
                      ) : (
                        ' বিদ্যমান নেই'
                      )}
                    </TableCell>
                    <TableCell scope="row" className="details" style={{ maxWidth: '150px' }}>
                      {item.projectNameBangla ? (
                        <Tooltip title={<span style={{ fontSize: '14px' }}>{item.projectNameBangla}</span>} arrow>
                          <span className="data">{item.projectNameBangla}</span>
                        </Tooltip>
                      ) : (
                        ' বিদ্যমান নেই'
                      )}
                    </TableCell>
                    <TableCell scope="row">{item.serviceName ? item.serviceName : ' বিদ্যমান নেই'}</TableCell>
                    <TableCell scope="row" className="details">
                      {item.description ? '' : ' বিদ্যমান নেই'}
                      <Tooltip
                        title={
                          <span
                            style={{
                              fontSize: '14px',
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {item.description}
                          </span>
                        }
                        arrow
                      >
                        <span className="data">{item.description}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell scope="row" align="center">
                      {item.status == 'A'
                        ? 'অনুমোদিত'
                        : item.status == 'P'
                          ? 'অপেক্ষমান'
                          : item.status == 'C'
                            ? 'সংশোধন'
                            : ' '}
                    </TableCell>
                    <TableCell scope="row" align="center">
                      {item.applicationDate}
                    </TableCell>
                    <TableCell scope="row" align="center">
                      {item.status == 'P' || item.status == 'C' ? (
                        <Tooltip title="সংশোধন" arrow>
                          <Button onClick={(e) => handleService(e, item, item.serviceId)} className="button-edit">
                            <EditIcon className="table-icon" />
                          </Button>
                        </Tooltip>
                      ) : (
                        <Button disabled>
                          <EditIcon className="table-icon" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell scope="row" align="center">
                      {item.status == 'C' ? (
                        <Tooltip title="সংশোধন" arrow>
                          <Button onClick={(e) => handleNeedForCorrection(e, item.id)} className="button-edit">
                            <DownloadDoneIcon className="table-icon" />
                          </Button>
                        </Tooltip>
                      ) : (
                        <Button disabled>
                          <DownloadDoneIcon className="table-icon" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
                : ''}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={applicationDetails.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[15, 25, 50, 100]}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </TableContainer>
      );
    } else if (compoName === 'inventory') {
      return (
        <TableContainer className="table-container">
          <Table sx={{ width: '100%' }}>
            <TableHead className="table-head">
              <TableRow>
                <TableCell>সেবার নাম</TableCell>
                <TableCell>বিবরণ</TableCell>
                <TableCell align="center" sx={{ width: '8%' }}>
                  আবেদনের অবস্থা
                </TableCell>
                <TableCell align="center" sx={{ width: '10%' }}>
                  আবেদনের তারিখ
                </TableCell>
                <TableCell align="center" sx={{ width: '5%' }}>
                  সংশোধন
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicationDetails
                ? applicationDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row">{item.serviceName ? item.serviceName : ' বিদ্যমান নেই'}</TableCell>
                    <TableCell scope="row" className="details">
                      {item.description ? '' : ' বিদ্যমান নেই'}
                      <Tooltip
                        title={
                          <span
                            style={{
                              fontSize: '14px',
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {item.description}
                          </span>
                        }
                        arrow
                      >
                        <span className="data">{item.description}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell scope="row" align="center">
                      {item.status == 'A'
                        ? 'অনুমোদিত'
                        : item.status == 'P'
                          ? 'অপেক্ষমান'
                          : item.status == 'C'
                            ? 'সংশোধন'
                            : ' '}
                    </TableCell>
                    <TableCell scope="row" align="center">
                      {item.applicationDate}
                    </TableCell>
                    <TableCell scope="row" align="center">
                      {item.status == 'P' ? (
                        <Tooltip title="সংশোধন" arrow>
                          <Button onClick={(e) => handleService(e, item, item.serviceId)} className="button-edit">
                            <EditIcon className="table-icon" />
                          </Button>
                        </Tooltip>
                      ) : (
                        <Button disabled>
                          <EditIcon className="table-icon" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
                : ''}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={applicationDetails.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[2, 5, 10, 25, 50]}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </TableContainer>
      );
    }
  };
  return (
    <>
      <Grid container className="section">
        <Grid item md={6}>
          <TextField
            fullWidth
            label={star('সেবা সমূহের তালিকা')}
            name="samityName"
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            variant="outlined"
            size="small"
          >
            <option value="সকল সেবাসমূহ"> সকল সেবাসমূহ </option>
            {serviceList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.serviceName}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>সেবা সমূহের বিবরণ</SubHeading>
        <Grid item lg={12} md={12} xs={12}>
          <Box className="table-wrapper">{determineTableAccordingToComponentName()}</Box>
        </Grid>
      </Grid>

      {modalClicked && (
        <div
          style={{
            zIndex: '10',
            position: 'absolute',
          }}
        >
          <Dialog
            className="diaModal"
            open={modalClicked}
            TransitionComponent={Transition}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            scroll="body"
          >
            <div className="modal">
              <Grid item md={12} xs={12}>
                <SubHeading>মন্তব্য লিখুন</SubHeading>
              </Grid>
              <Grid md={12} xs={12}>
                <TextField
                  id="outlined-multiline-flexible"
                  onChange={handleRemarks}
                  label="মন্তব্য"
                  multiline
                  maxWidth
                  maxRows={4}
                />
              </Grid>
              <Grid container className="btn-container">
                <Tooltip title="সংরক্ষণ করুন">
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={onSubmitCorrection}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {' '}
                    সংরক্ষণ করুন
                  </Button>
                </Tooltip>
              </Grid>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default Dashboard;
