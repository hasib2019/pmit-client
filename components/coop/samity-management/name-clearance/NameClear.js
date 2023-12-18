// ****************************** Developed, Functional, Checked By Saifur *********
// ****************************** Development Functional  By Hasibuzzaman *****************************
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TurnSlightRightIcon from '@mui/icons-material/TurnSlightRight';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
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
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import GetGeoData from 'components/utils/coop/GetGeoData';
import OfficeId from 'components/utils/coop/OfficeId';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { inputRadioGroup } from 'service/fromInput';
import { engToBang } from 'service/numberConverter';
// import Swal from 'sweetalert2';
import { Nameclearance, NameclearanceList, SamityType } from '../../../../url/coop/ApiList';

// main section
const NameClear = (props) => {
  const router = useRouter();
  const { propsData } = props;
  const userData = tokenData();
  const config = localStorageData('config');

  ////////////////////////////////////////*** loading syastem start **//////////////////////////////////////////
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  /////////////////////////////////////////*** loading syastem End **/////////////////////////
  const [divisionId, setDivisionId] = useState(router.query.divisionId ? router.query.divisionId : '');
  const [districtId, setDistrictId] = useState(router.query.districtId ? router.query.districtId : '');
  const [officeId, setOfficeId] = useState('');
  const [samityType, setSamityType] = useState([]);
  const [formErrors, setFormErrors] = useState({
    samityName: '',
  });
  const [officeIdEdit, setOfficeIdEdit] = useState(router.query.officeId ? router.query.officeId : '');
  const [nameClearData, setNameClearData] = useState({
    samityTypeId: router.query.samityTypeId ? router.query.samityTypeId : '',
    samityName: router.query.samityName ? router.query.samityName : '',
    samityLevel: '',
  });

  const [exitAllSamity, setExitAllSamity] = useState([]);
  const [allSamityData, setAllSamityData] = useState([]);
  const [exitMessage, setExitMessage] = useState();
  const [submitDiactive, setSubmitDiactive] = useState();
  const [update, setUpdate] = useState(false);
  // const [status, setStatus] = useState(router.query.status ? router.query.status : '');
  const [applicationId, setApplicationId] = useState(router.query.applicationId ? router.query.applicationId : '');
  const [correction, setCorrection] = useState(false);
  const [catId, setCatId] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [open, setOpen] = useState(false);
  // const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getData();
    getNewRegSamity();
    if (propsData.query) {
      getEditDataFromDashboard(propsData.query);
    }
  }, []);

  useEffect(() => {
    alreadyExitSamity();
  }, [officeId, catId]);

  const getEditDataFromDashboard = (data) => {
    if (data.divisionId) {
      setDivisionId(data.divisionId);
      setDistrictId(data.districtId);
      setOfficeIdEdit(data.officeId);
      alreadyExitSamityCorrection(data.officeId, data.samityTypeId);
      setNameClearData({
        ...nameClearData,
        samityTypeId: data.samityTypeId,
        samityName: data.samityName,
        samityLevel: data.samityLevel,
      });

      // setStatus(data.status);
      setApplicationId(data.applicationId);
      setCorrection(false);
      setUpdate(true);
    }
  };
  // const apiValuesDiv = (a) => {
  //   if (a.divisionId != '') {
  //     setDivisionId(a.divisionId);
  //   }
  // };
  // const apiValuesDis = (a) => {
  //   if (a.districtId != '') {
  //     setDistrictId(a.districtId);
  //   }
  // };
  const apiValuesUpa = (a) => {
    if (a.officeId != '') {
      setOfficeId(a.officeId);
    }
  };

  let checkName = (value) => {
    let flag;
    if (exitMessage.indexOf(value) !== -1) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNameClearData({
      ...nameClearData,
      [name]: value,
    });

    switch (name) {
      case 'samityName':
        if (checkName(value.trim().split(/ +/).join(' ')) === true) {
          setFormErrors({ samityName: 'সমিতিটির নাম বিদ্যমান রয়েছে' });
          setSubmitDiactive(true);
        } else {
          setFormErrors({ samityName: '' });
          setSubmitDiactive(false);
        }
        break;
    }
  };

  const handleChangeOfficeAddress = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'division':
        setDivisionId(value);
        setDistrictId(0);
        setOfficeIdEdit();
        break;
      case 'district':
        setDistrictId(value);
        setOfficeIdEdit();
        break;
      default:
      //
    }
  };

  const handleChangeSamity = (e) => {
    const { name, value } = e.target;
    setNameClearData({
      ...nameClearData,
      [name]: value,
    });
    setCatId(value);
  };

  const alreadyExitSamity = async () => {
    if (officeId && catId && officeId != 0 && catId != 0 && officeId != undefined && catId != undefined) {
      try {
        const allExitData = await axios.get(Nameclearance + `?officeId=${officeId}&samityTypeId=${catId}`, config);
        setExitAllSamity(allExitData.data.data);

        const samityNameArr = [];
        for (const element of allExitData.data.data) {
          samityNameArr.push(element.samityName);
        }
        setExitMessage(samityNameArr);
      } catch (error) {
        errorHandler(error);
      }
    } else {
      setExitMessage([]);
    }
  };

  // function scrollToTop() {
  //   window.scroll({ top: 100, left: 100, behavior: 'smooth' });
  // }
  // const editNameClear = (
  //   divisionId,
  //   districtId,
  //   officeId,
  //   samityName,
  //   samityTypeId,
  //   status,
  //   applicationId,
  //   samityLevel,
  // ) => {
  //   scrollToTop();
  //   setDivisionId(divisionId);
  //   setDistrictId(districtId);
  //   setOfficeIdEdit(officeId);
  //   alreadyExitSamityCorrection(officeId, samityTypeId);
  //   setNameClearData({
  //     ...nameClearData,
  //     samityTypeId: samityTypeId,
  //     samityName: samityName,
  //     samityLevel: samityLevel,
  //   });
  //   // setStatus(status);
  //   setApplicationId(applicationId);
  //   setCorrection(false);
  //   setUpdate(true);
  // };

  // const correctionNameClear = (
  //   divisionId,
  //   districtId,
  //   officeId,
  //   samityName,
  //   samityTypeId,
  //   status,
  //   applicationId,
  //   samityLevel,
  // ) => {
  //   setDivisionId(divisionId);
  //   setDistrictId(districtId);
  //   setOfficeIdEdit(officeId);
  //   setNameClearData({
  //     ...nameClearData,
  //     samityTypeId: samityTypeId,
  //     samityName: samityName,
  //     samityLevel: samityLevel,
  //   });
  //   alreadyExitSamityCorrection(officeId, samityTypeId);
  //   setStatus(status);
  //   setApplicationId(applicationId);
  //   setCorrection(true);
  // };

  const alreadyExitSamityCorrection = async (officeIds, samityTypeIds) => {
    try {
      const allExitData = await axios.get(
        Nameclearance + `?officeId=${officeIds}&samityTypeId=${samityTypeIds}`,
        config,
      );
      setExitAllSamity(allExitData.data.data);

      const samityNameArr = [];
      for (const element of allExitData.data.data) {
        samityNameArr.push(element.samityName);
      }
      setExitMessage(samityNameArr);
    } catch (error) {
      errorHandler(error);
    }
  };

  // const deleteNameClear = async (id) => {
  //   await Swal.fire({
  //     title: 'আপনি কি নিশ্চিত?',
  //     text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     cancelButtonText: 'ফিরে যান ।',
  //     confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axios
  //         .post(NameclearanceArchive + id, null, config)
  //         .then((response) => {
  //           if (response.status === 200) {
  //             Swal.fire('বাতিল হয়েছে!', 'আপনার আবেদনটি বাতিল করা হয়েছে.', 'success');
  //             getNewRegSamity();
  //           } else {
  //             Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'error');
  //             getNewRegSamity();
  //           }
  //         })
  //         .catch((error) => {
  //           Swal.fire(error.response.data.errors[0].message, '', 'error');
  //           getNewRegSamity();
  //         });
  //     }
  //   });
  // };

  let getData = async () => {
    try {
      let SamityTypeData = await axios.get(SamityType, config);
      setSamityType(SamityTypeData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  //method for handling submit event
  let onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    const payload = {
      serviceName: 'name_clearance',
      data: {
        samityName: nameClearData.samityName,
        samityTypeId: parseInt(nameClearData.samityTypeId),
        divisionId: divisionId == 0 ? '' : parseInt(divisionId),
        districtId: districtId == 0 ? '' : parseInt(districtId),
        officeId: officeId == 0 ? '' : parseInt(officeId),
        samityLevel: nameClearData.samityLevel,
        status: 'P',
      },
    };

    try {
      let RegistrationData;
      if (update || correction) {
        RegistrationData = await axios.put(Nameclearance + '/' + applicationId, payload, config);
        setNameClearData({
          samityTypeId: 0,
          samityName: '',
        });
        setDivisionId(0);
        setDistrictId(0);
        setOfficeIdEdit();
        setUpdate(false);
        router.push({ pathname: '/coop/samity-management/name-clearance' });
      } else {
        RegistrationData = await axios.post(Nameclearance, payload, config);
        setNameClearData({
          samityTypeId: 0,
          samityName: '',
        });
        setDivisionId(0);
        setDistrictId(0);
        setOfficeIdEdit();
        setUpdate(false);
      }

      NotificationManager.success(RegistrationData.data.message, '', 5000);
      getNewRegSamity();
      setLoadingDataSaveUpdate(false);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  const getNewRegSamity = async () => {
    try {
      setLoadingData(true);
      const data = await (await axios.get(NameclearanceList, config)).data.data;
      let nameClearData = data.sort((a, b) => b.applicationData.id - a.applicationData.id);

      setAllSamityData(nameClearData);
      setLoadingData(false);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    alreadyExitSamity(officeId, catId);
  };
  const handleClose = () => setOpen(false);

  // const handleOpenModal = () => setOpenModal(true);
  // const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <Grid id="editArea" container className="section" spacing={1.8} pt={2}>
        {inputRadioGroup(
          'samityLevel',
          handleChange,
          nameClearData.samityLevel,
          [
            ...(userData?.doptorId == 2
              ? [
                  {
                    value: 'P',
                    color: '#007bff',
                    rcolor: 'primary',
                    label: 'ইউনিয়ন',
                  },
                ]
              : []),
            ...(userData?.doptorId == 3
              ? [
                  {
                    value: 'P',
                    color: '#007bff',
                    rcolor: 'primary',
                    label: 'প্রাথমিক',
                  },
                  {
                    value: 'C',
                    color: '#ed6c02',
                    rColor: 'warning',
                    label: 'কেন্দ্রীয়',
                  },
                  {
                    value: 'N',
                    color: '#28a745',
                    rColor: 'success',
                    label: 'জাতীয়',
                  },
                ]
              : []),
          ],
          12,
        )}
        <GetGeoData
          {...{
            labelName: RequiredFile('বিভাগ'),
            name: 'division',
            caseCadingName: 'division',
            onChange: handleChangeOfficeAddress,
            value: divisionId,
            isCasCading: false,
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: {},
            isFilter: true,
          }}
        />

        <GetGeoData
          {...{
            labelName: RequiredFile('জেলা'),
            name: 'district',
            caseCadingName: 'district',
            onChange: handleChangeOfficeAddress,
            value: districtId,
            isCasCading: true,
            casCadingValue: divisionId,
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            isFilter: true,
          }}
        />
        <Grid item md={4} xs={12}>
          <OfficeId
            childDisDefault={correction}
            allOfficeData={apiValuesUpa}
            selectedDiv={divisionId}
            selectedDis={districtId}
            flag={true}
            selectOfficeId={officeIdEdit}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('সমিতি ক্যাটাগরি')}
            name="samityTypeId"
            onChange={handleChangeSamity}
            // required
            select
            SelectProps={{ native: true }}
            value={nameClearData.samityTypeId || 0}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          >
            <option value={0}>- নির্বাচন করুন -</option>
            {samityType?.map((option, i) => (
              <option key={i} value={option.id}>
                {option.typeName}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item md={5} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('সমিতির নাম')}
            name="samityName"
            onChange={handleChange}
            // required
            value={nameClearData.samityName}
            variant="outlined"
            size="small"
            sx={{ backgroundColor: '#FFF' }}
          ></TextField>
          {nameClearData && nameClearData.samityName && nameClearData.samityName.length > 0 && (
            <span style={{ color: 'red' }}>{formErrors.samityName}</span>
          )}
        </Grid>

        <Grid item md={3} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={handleOpen}
            variant="outlined"
            size="small"
            fullWidth
            className="btn btn-primary"
            disabled={officeId && catId && officeId != 0 && catId != 0 ? false : true}
            endIcon={<KeyboardDoubleArrowUpIcon />}
          >
            বিদ্যমান সকল সমিতির তালিকা{' '}
          </Button>
        </Grid>
        {/* ====================================================== */}
        <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
          <DialogTitle sx={{ borderBottom: '1px solid var(--color-primary)' }}>
            বিদ্যমান সকল সমিতির তালিকা
            <IconButton className="modal-close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Grid container p={2}>
              <ul>
                {exitAllSamity?.map((row, i) => (
                  <li key={i} style={{ marginLeft: '3rem', paddingLeft: '1rem', marginBottom: '1rem' }}>
                    {row.samityName}
                  </li>
                ))}
              </ul>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="আবেদন করুন">
          {loadingDataSaveUpdate ? (
            <LoadingButton
              loading
              loadingPosition="start"
              sx={{ mr: 1 }}
              startIcon={<SaveOutlinedIcon />}
              variant="outlined"
            >
              {update ? ' হালনাগাদ হচ্ছে...' : ' সংরক্ষন করা হচ্ছে...'}
            </LoadingButton>
          ) : (
            <Button
              className="btn btn-save"
              onClick={onSubmitData}
              disabled={submitDiactive}
              startIcon={<SaveOutlinedIcon />}
            >
              {update ? ' হালনাগাদ করুন' : ' সংরক্ষন করুন'}
            </Button>
          )}
        </Tooltip>
      </Grid>

      <Grid container className="section">
        <SubHeading>নেম ক্লিয়ারেন্স / নামের ছাড়পত্রের তথ্যাদি</SubHeading>
        {loadingData ? (
          <Skeleton sx={{ height: '100%', minHeight: '490px', width: '100%', transformOrigin: '0 0' }} />
        ) : (
          <TableContainer className="table-container" sx={{ maxHeight: 490 }}>
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" stickyHeader>
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>জেলা</TableCell>
                  <TableCell>বিভাগ</TableCell>
                  <TableCell>অফিস নাম</TableCell>
                  <TableCell>সমিতির নাম</TableCell>
                  <TableCell>আবেদনের তারিখ</TableCell>
                  <TableCell>আবেদনের অবস্থান</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allSamityData?.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row">{row?.applicationData?.divisionNameBangla}</TableCell>
                    <TableCell scope="row">{row?.applicationData?.districtNameBangla}</TableCell>
                    <TableCell scope="row">
                      <Tooltip title={<div className="tooltip-title">{row?.applicationData?.officeName}</div>} arrow>
                        <span className="data">{row?.applicationData?.officeName}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row">
                      <Tooltip title={<div className="tooltip-title">{row?.applicationData?.samityName}</div>} arrow>
                        <span className="data">{row?.applicationData?.samityName}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row">{engToBang(dateFormat(row?.applicationData?.createdAt))}</TableCell>
                    <TableCell scope="row">
                      <Tooltip
                        title={<div className="tooltip-title">{row.applicationApprovalData.actionText}</div>}
                        arrow
                      >
                        <span className="data">{row.applicationApprovalData.actionText}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row" align="center">
                      {row.applicationData.status == 'P' && row.applicationData.editEnable == true ? (
                        <Tooltip
                          title={<div className="tooltip-title">নামটির ছাড়পত্রের জন্য আবেদন করা হয়েছে</div>}
                          arrow
                        >
                          <span className="data">
                            <MoreHorizIcon className="table-icon" />
                          </span>
                        </Tooltip>
                      ) : row.applicationData.status == 'A' ? (
                        <Tooltip title={<div className="tooltip-title">নামটির ছাড়পত্র দেওয়া হয়েছে</div>} arrow>
                          <span className="data">
                            <CheckOutlinedIcon className="table-icon success" />
                          </span>
                        </Tooltip>
                      ) : row.applicationData.status == 'C' ? (
                        <Tooltip
                          title={<div className="tooltip-title">নামটির ছাড়পত্র সংশোধনের জন্য প্রেরন করা হয়েছে</div>}
                          arrow
                        >
                          <span className="data">
                            <PriorityHighRoundedIcon className="table-icon priority" />
                          </span>
                        </Tooltip>
                      ) : row.applicationData.status == 'R' ? (
                        <Tooltip title={<div className="tooltip-title">নামটির ছাড়পত্র বাতিল করা হয়েছে</div>} arrow>
                          <span className="data">
                            <CloseIcon className="table-icon error" />
                          </span>
                        </Tooltip>
                      ) : row.applicationData.status == 'P' && row.applicationData.editEnable == false ? (
                        <Tooltip
                          title={<div className="tooltip-title">আপনার আবেদনটি অনুমোদনের জন্য অপেক্ষমান</div>}
                          arrow
                        >
                          <span className="data">
                            <TurnSlightRightIcon className="table-icon purple" />
                          </span>
                        </Tooltip>
                      ) : (
                        ''
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </>
  );
};

export default NameClear;
