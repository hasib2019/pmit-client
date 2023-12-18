import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CopyrightTwoToneIcon from '@mui/icons-material/CopyrightTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/Save';
import TurnSlightRightIcon from '@mui/icons-material/TurnSlightRight';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import TempSamityReport from 'components/shared/common/TempSamityReport';
import SubHeading from 'components/shared/others/SubHeading';
import { encode } from 'js-base64';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { NotificationManager } from 'react-notifications';
import ZoomImage from 'service/ZoomImage';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import Swal from 'sweetalert2';
import { localStorageData, tokenData } from '../../../service/common';
import {
  AllSamityReports,
  ApplicationEdit,
  ConfirmCorrection,
  deleteApplication,
  pendingListServiceId,
  serviceName,
} from '../../../url/coop/ApiList';

const EditComponentList = () => {
  const router = useRouter();
  const userData = tokenData();
  const config = localStorageData('config');

  const [dataId, setDataId] = useState();
  const [allSamityData, setAllSamityData] = useState([]);
  const [filterSamityData, setFilterSamityData] = useState([]);
  const [serviceNames, setServiceName] = useState([]);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState({ comments: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getPendingAll();
    getServiceName();
  }, []);

  const handleOpen = (id) => {
    setOpen(true);
    setDataId(parseInt(id));
  };

  const handleClose = () => setOpen(false);

  const getServiceName = async () => {
    try {
      const serviceNameData = await axios.get(serviceName, config);
      let serviceNames = serviceNameData.data.data;
      let shortserviceName = serviceNames.sort((a, b) => {
        return a.id - b.id;
      });
      setServiceName(shortserviceName);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getPendingAll = async () => {
    try {
      const Alldata = await axios.get(userData?.userId ? pendingListServiceId : AllSamityReports, config);
      const samitydata = Alldata.data.data.sort((a, b) => {
        return b.applicationData.id - a.applicationData.id;
      });
      setAllSamityData(samitydata);
      setFilterSamityData(samitydata);
    } catch (error) {
      errorHandler(error);
    }
  };


  const handleChangeService = (e) => {
    const { value } = e.target;
    if (value != 0) {
      const filterresult = allSamityData.filter((data) => data.applicationData.serviceId === parseInt(value));
      setFilterSamityData([...filterresult]);
    } else {
      setFilterSamityData(allSamityData);
    }
  };

  const editNameClearance = (
    link,
    divisionId,
    districtId,
    officeId,
    samityName,
    samityTypeId,
    status,
    applicationId,
    samityLevel,
  ) => {
    router.push({
      pathname: `${link}`,
      query: {
        divisionId,
        districtId,
        officeId,
        samityName,
        samityTypeId,
        status,
        applicationId,
        samityLevel,
      },
    });
  };

  const editManualSamityData = (link, id) => {
    router.push({
      pathname: `${link}`,
      query: { id },
    });
  };

  const editFlowSamityData = async (samityData) => {
    try {
      const editSamity = await axios.put(ApplicationEdit + samityData.id, {}, config);
      if (editSamity.status == 200) {
        const data = editSamity.data.data;
        localStorage.setItem('stepId', JSON.stringify(data.lastStep));
        localStorage.setItem('storeId', JSON.stringify(data.samityId));
        localStorage.setItem('storeName', JSON.stringify(data.samityName));
        localStorage.setItem('samityLevel', JSON.stringify(data.samityLevel));
        router.push({ pathname: samityData.pageLink });
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const editElectionData = (link, id, samityLevel) => {
    router.push({
      pathname: `${link}`,
      query: { id, samityLevel },
    });
  };

  const editAbasayanData = (link, id) => {
    router.push({
      pathname: `${link}`,
      query: { id },
    });
  };

  const editInvestmentData = (link, id) => {
    router.push({
      pathname: `${link}`,
      query: { id },
    });
  };

  const editMemberCorrection = (link, id, samityId, samityLevel) => {
    router.push({
      pathname: `${link}`,
      query: {
        id: encode(`${id}`),
        samityId: encode(`${samityId}`),
        samityLevel: encode(`${samityLevel}`),
      },
    });
  };

  const viewPage = (samityId) => {
    localStorage.setItem('reportsIdPer', JSON.stringify(samityId));
    window.open('/coop/view-page', '_blank');
  };

  const handleChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    let payload = {
      comment: comment.comments,
    };

    try {
      const finalConfirmCorrection = await axios.put(ConfirmCorrection + dataId, payload, config);
      NotificationManager.success(finalConfirmCorrection.data.message, '', 5000);
      setOpen(false);
      getPendingAll();
      getServiceName();
      router.push({ pathname: '/dashboard' });
    } catch (error) {
      errorHandler(error);
    }
  };

  const deleteNameClear = async (id) => {
    if (id) {
      try {
        await Swal.fire({
          title: 'আপনি কি নিশ্চিত?',
          text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ফিরে যান ।',
          confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(deleteApplication + id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                getPendingAll();
                getServiceName();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
              }
            });
          }
        });
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const confirmEditSamity = (data) => {
    confirmAlert({
      title: 'নিবন্ধিত সমিতি',
      message: 'আপনি কি সমিতিটি এডিট করতে চান ? এডিট করার পর এই লিস্টে সমিতিটি আর পাবেন না !',
      buttons: [
        {
          label: 'হ্যা, এডিট করতে ইচ্ছুক।',
          onClick: () => editFlowSamityData(data),
        },
        {
          label: 'না',
          //onClick: () => alert('Click No')
        },
      ],
    });
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    filterSamityData.length > 0 && (
      <Paper sx={{ mt: 2, p: 2 }}>
        <SubHeading>
          <span style={{ fontWeight: 'bold' }}>সেবাসমূহ</span>
        </SubHeading>
        <Grid container className="section">
          <Grid item lg={12} md={12} xs={12}>
            <Grid item lg={6} md={6} xs={12}>
              <TextField
                fullWidth
                label="সেবাসমূহ"
                name="serviceId"
                onChange={handleChangeService}
                required
                select
                SelectProps={{ native: true }}
                size="small"
              >
                <option value={0}> সকল সেবাসমূহ </option>
                {serviceNames.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.serviceName}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <Box>
          <Grid container>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <editComponent />
              <TableContainer sx={{ maxHeight: 450 }} className="table-container">
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead className="tabla-head">
                    <TableRow>
                      <TableCell align="center">ক্রমিক</TableCell>
                      <TableCell>সেবার নাম</TableCell>
                      <TableCell>সমিতির নাম</TableCell>
                      <TableCell>অবস্থান</TableCell>
                      <TableCell>কার্যক্রম</TableCell>
                      <TableCell>মন্তব্য</TableCell>
                      <TableCell>ডকুমেন্ট</TableCell>
                      <TableCell align="center">আবেদনের তারিখ</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterSamityData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                          <TableCell align="center">{numberToWord('' + (index + 1) + '')}</TableCell>
                          <TableCell>
                            <Tooltip
                              title={<div className="tooltip-title">{row?.applicationData?.serviceName}</div>}
                              arrow
                            >
                              <span className="data">{row?.applicationData?.serviceName}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={
                                <div className="tooltip-title">
                                  {row?.applicationData?.data?.samityName ||
                                    row?.applicationData?.data?.samityInfo?.samityName ||
                                    row?.applicationData?.samityName}
                                </div>
                              }
                              arrow
                            >
                              <span className="data">
                                {row?.applicationData?.data?.samityName ||
                                  row?.applicationData?.data?.samityInfo?.samityName ||
                                  row?.applicationData?.samityName}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={
                                <div className="tooltip-title">
                                  {row?.applicationData?.designationName} - {row?.applicationData?.officeName}
                                </div>
                              }
                              arrow
                            >
                              <span className="data">
                                {row?.applicationData?.designationName} - {row?.applicationData?.officeName}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={<div className="tooltip-title">{row?.applicationApprovalData?.actionText}</div>}
                              arrow
                            >
                              <span className="data">{row?.applicationApprovalData?.actionText}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={
                                <div
                                  className="tooltip-title"
                                  dangerouslySetInnerHTML={{ __html: row?.applicationApprovalData?.remarks }}
                                ></div>
                              }
                              arrow
                            >
                              <span
                                className="data"
                                dangerouslySetInnerHTML={{ __html: row?.applicationApprovalData?.remarks }}
                              ></span>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center" sx={{ padding: '0' }}>
                            <ZoomImage
                              src={row?.applicationApprovalData?.attachmentUrl}
                              imageStyle={{
                                maxHeight: '40px',
                                border: '1px solid var(--color-primary)',
                              }}
                              divStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              key={row?.applicationApprovalData?.id}
                              type={imageType(row?.applicationApprovalData?.attachment)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip
                              title={
                                <div className="tooltip-title">
                                  {' '}
                                  {engToBang(dateFormat(row?.applicationData?.createdAt))}
                                </div>
                              }
                              arrow
                            >
                              <span className="data">{engToBang(dateFormat(row?.applicationData?.createdAt))}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            {row.applicationData.status == 'A' ? (
                              <Tooltip
                                title={
                                  row.applicationData?.serviceId == 1
                                    ? 'নামটির ছাড়পত্র দেওয়া হয়েছে'
                                    : row.applicationData?.serviceId == 2
                                    ? 'সমিতি নিবন্ধিত হয়েছে'
                                    : row.applicationData?.serviceId == 6
                                    ? 'অনলাইনকরন সমিতি নিবন্ধিত হয়েছে'
                                    : row.applicationData?.serviceId == 7
                                    ? 'সদস্যের তথ্য সংযোজন / সংশোধন এর আবেদন অনুমোদন দেওয়া হয়েছে'
                                    : row?.applicationData?.serviceId == 3 ||
                                      row?.applicationData?.serviceId == 4 ||
                                      row?.applicationData?.serviceId == 5 ||
                                      row?.applicationData?.serviceId == 9
                                    ? 'নির্বাচন / নির্বাচিত কমিটি / অন্তবর্তী কমিটি আবেদন নিবন্ধিত হয়েছে'
                                    : row.applicationData?.serviceId == 11
                                    ? 'সমিতিটি অবসায়নের জন্য আবেদন করা হয়েছে'
                                    : row.applicationData?.serviceId == 12
                                    ? 'সমিতিটি বিনিয়োগের জন্য আবেদন করা হয়েছে'
                                    : ''
                                }
                              >
                                {row.applicationData?.serviceId == 2 || row.applicationData?.serviceId == 6 ? (
                                  <WysiwygIcon
                                    className="table-icon"
                                    onClick={() => viewPage(row.applicationData.samityId)}
                                  />
                                ) : (
                                  <CheckOutlinedIcon className="table-icon success" />
                                )}
                              </Tooltip>
                            ) : row.applicationData.status == 'R' ? (
                              <>
                                {row.applicationData.serviceId == 1 ? (
                                  <Tooltip
                                    title={<div className="tooltip-title">নামটির ছাড়পত্র বাতিল করা হয়েছে</div>}
                                    arrow
                                  >
                                    <span className="data">
                                      <CloseIcon className="table-icon error" />
                                    </span>
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 2 ? (
                                  <Tooltip
                                    title={<div className="tooltip-title">সমিতি নিবন্ধন বাতিল করা হয়েছে</div>}
                                    arrow
                                  >
                                    <span className="data">
                                      <CloseIcon className="table-icon error" />
                                    </span>
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 6 ? (
                                  <Tooltip
                                    title={
                                      <div className="tooltip-title">অনলাইনকরন সমিতি নিবন্ধন বাতিল করা হয়েছে</div>
                                    }
                                    arrow
                                  >
                                    <span className="data">
                                      <CloseIcon className="table-icon error" />
                                    </span>
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 7 ? (
                                  <Tooltip
                                    title={
                                      <div className="tooltip-title">
                                        সদস্যের তথ্য সংযোজন / সংশোধন এর আবেদন বাতিল করা হয়েছে
                                      </div>
                                    }
                                    arrow
                                  >
                                    <span className="data">
                                      <CloseIcon className="table-icon error" />
                                    </span>
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 11 ? (
                                  <Tooltip
                                    title={<div className="tooltip-title">সমিতির অবসায়ন প্রত্যাহার করা হয়েছে</div>}
                                    arrow
                                  >
                                    <span className="data">
                                      <CloseIcon className="table-icon error" />
                                    </span>
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 12 ? (
                                  <Tooltip
                                    title={<div className="tooltip-title">সমিতির বিনিয়োগটি প্রত্যাহার করা হয়েছে</div>}
                                    arrow
                                  >
                                    <span className="data">
                                      <CloseIcon className="table-icon error" />
                                    </span>
                                  </Tooltip>
                                ) : (
                                  ''
                                )}
                              </>
                            ) : row.applicationData.status == 'C' ? (
                              <Fragment>
                                <Tooltip title="মন্তব্য লিখুন ও সংশোধিত আবেদনটি জমা দিন">
                                  <CopyrightTwoToneIcon
                                    className="table-icon edit"
                                    onClick={() => handleOpen(row.applicationData.id)}
                                  />
                                </Tooltip>
                                <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
                                  <DialogTitle>
                                    আপনার মন্তব্য লিখুন
                                    <IconButton className="modal-close" onClick={handleClose}>
                                      <CloseIcon />
                                    </IconButton>
                                  </DialogTitle>
                                  <DialogContent>
                                    <TextField
                                      name="comments"
                                      id="outlined-multiline-static"
                                      multiline
                                      fullWidth
                                      rows={3}
                                      onChange={handleChange}
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Tooltip title="মন্তব্য সংরক্ষন করুন">
                                      <Button
                                        variant="contained"
                                        className="btn btn-save"
                                        size="small"
                                        onClick={onSubmitData}
                                        startIcon={<SaveOutlinedIcon />}
                                      >
                                        {' '}
                                        মন্তব্য সংরক্ষন করুন
                                      </Button>
                                    </Tooltip>
                                  </DialogActions>
                                </Dialog>
                              </Fragment>
                            ) : (
                              <Tooltip title="আপনার আবেদনটি অনুমোদনের জন্য অপেক্ষমান">
                                <TurnSlightRightIcon className="table-icon purple" />
                              </Tooltip>
                            )}
                            {row.applicationData.editEnable == true && (
                              <Fragment>
                                {row.applicationData.serviceId == 1 ? (
                                  <Tooltip title="এডিট করুন">
                                    <EditIcon
                                      className="table-icon edit"
                                      onClick={() =>
                                        editNameClearance(
                                          row.applicationData.pageLink,
                                          row.applicationData.data.divisionId,
                                          row.applicationData.data.districtId,
                                          row.applicationData.data.officeId,
                                          row.applicationData.data.samityName,
                                          row.applicationData.data.samityTypeId,
                                          row.applicationData.data.status,
                                          row.applicationData.id,
                                          row.applicationData.data.samityLevel,
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 2 ? (
                                  <>
                                    <Tooltip title="এডিট করুন">
                                      <EditIcon
                                        className="table-icon edit"
                                        onClick={() => confirmEditSamity(row.applicationData)}
                                      />
                                    </Tooltip>
                                    <Tooltip title="বিস্তারিত দেখুন">
                                      <WysiwygIcon className="table-icon" onClick={() => handleOpenModal()} />
                                    </Tooltip>
                                    <Modal
                                      open={openModal}
                                      onClose={handleCloseModal}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                      sx={{ overflowY: 'auto' }}
                                    >
                                      <TempSamityReport
                                        {...{
                                          pendingSamityId: row?.applicationData?.data?.samityId,
                                        }}
                                      />
                                    </Modal>
                                  </>
                                ) : row.applicationData.serviceId == 3 ||
                                  row.applicationData.serviceId == 4 ||
                                  row.applicationData.serviceId == 5 ||
                                  row.applicationData.serviceId == 9 ? (
                                  <Tooltip title="এডিট করুন">
                                    <EditIcon
                                      className="table-icon edit"
                                      onClick={() =>
                                        editElectionData(
                                          row.applicationData.pageLink,
                                          row.applicationData.id,
                                          row.applicationData.samityLevel,
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 6 ? (
                                  <Tooltip title="এডিট করুন">
                                    <EditIcon
                                      className="table-icon edit"
                                      onClick={() =>
                                        editManualSamityData(row?.applicationData?.pageLink, row?.applicationData?.id)
                                      }
                                    />
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 7 ? (
                                  <Tooltip title="এডিট করুন">
                                    <EditIcon
                                      className="table-icon edit"
                                      onClick={() =>
                                        editMemberCorrection(
                                          row.applicationData.pageLink,
                                          row.applicationData.id,
                                          row.applicationData.samityId,
                                          row.applicationData.samityLevel,
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 11 ? (
                                  <Tooltip title="এডিট করুন">
                                    <EditIcon
                                      className="table-icon edit"
                                      onClick={() =>
                                        editAbasayanData(row.applicationData.pageLink, row.applicationData.id)
                                      }
                                    />
                                  </Tooltip>
                                ) : row.applicationData.serviceId == 12 ? (
                                  <Tooltip title="এডিট করুন">
                                    <EditIcon
                                      className="table-icon edit"
                                      onClick={() =>
                                        editInvestmentData(row.applicationData.pageLink, row.applicationData.id)
                                      }
                                    />
                                  </Tooltip>
                                ) : (
                                  ''
                                )}
                                {row.applicationData.status == 'P' && (
                                  <Tooltip title="বাতিল করুন">
                                    <CloseIcon
                                      className="table-icon delete"
                                      onClick={() => deleteNameClear(row.applicationData.id)}
                                    />
                                  </Tooltip>
                                )}
                              </Fragment>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                  component="div"
                  count={filterSamityData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  className="sticky-pagination"
                />
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    )
  );
};

export default EditComponentList;
