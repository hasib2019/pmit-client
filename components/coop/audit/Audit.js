/* eslint-disable no-unused-vars */

/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 * */

import AddIcons from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
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
import { useEffect, useState } from 'react';
import { errorHandler } from 'service/errorHandler';
import {
  AuditSubmitApi,
  allSamityByAudit,
  designationName,
  districtOfficeByuser,
  samityByAudit,
  upozilaOffice
} from '../../../url/coop/ApiList';

import SubHeading from 'components/shared/others/SubHeading';
import star from 'components/utils/coop/star';
import { useRouter } from 'next/router';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { inputRadioGroup } from 'service/fromInput';
import { numberToWord } from 'service/numberToWord';

const AuditDisUpaOffice = ({ takeData, size, getData }) => {
  const router = useRouter();
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [auditSamityInfo, setAuditSamityInfo] = useState([]);
  const [filterSamityInfo, setFilterSamityInfo] = useState([]);
  const [employeeRecord, setEmployeeRecord] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [upozillaData, setUpozilaData] = useState([]);
  const [upazilaOfficeId, setUpazilaOfficeId] = useState('');
  const [loadingDataSaveUpdate] = useState(false);
  const [update] = useState(false);
  const [levelLock] = useState(false);
  const [samityLevel, setSamityLevel] = useState();
  const [samityShare, setSamityShare] = useState();
  const [samityEffectiveness, setSamityEffectiveness] = useState();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [selectedSamityArray, setSelectedSamityArray] = useState([]);
  const [auditor, setAuditor] = useState();
  const [zillaToggle, setZillaToggle] = useState(false);

  const currentMonth = new Date().getMonth();

  var currentYear = new Date().getFullYear();

  let budgetyear

  if (currentMonth <= 6) {
    var previousYear = currentYear - 1;
    budgetyear = previousYear + '-' + currentYear;
  } else {
    var futureYear = currentYear + 1;
    budgetyear = currentYear + '-' + futureYear;
  }

  useEffect(() => {
    getDistrict();
  }, []);

  const getDistrict = async () => {
    try {
      const districtOffice = await axios.get(districtOfficeByuser, config);
      let districtList = districtOffice.data.data;
      if (districtList.length == 1) {
        setDistrictId(districtList[0].id);
        getupazila(districtList[0].id);
      }
      setDistrictData(districtList);
    } catch (error) {
      errorHandler(error);
    }
  };
  let getupazila = async (Disid) => {
    try {
      let upozila = await axios.get(upozilaOffice + '?districtOfficeId=' + Disid, config);
      let data = upozila.data.data;
      if (data.length == 0) {
        setUpozilaData([]);
        setSamityInfo([]);
      } else if (data.length == 1) {
        setUpazilaOfficeId(data[0].id);
        getSamityByAuditData(data[0].id);
        getAllSamityData(data[0].id);
        getEmployeeRecored(data[0].id);
        setUpozilaData(data);
      } else {
        setUpozilaData(data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getEmployeeRecored = async (officeId) => {
    try {
      const employeeData = await axios.get(designationName + officeId + '&status = true', config);
      const employeeInfo = employeeData?.data?.data;
      setEmployeeRecord(employeeInfo);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSamityByAuditData = async (officeId) => {
    try {
      const samityByAuditData = await axios.get(samityByAudit + officeId, config);
      const samityByAuditInfo = samityByAuditData?.data?.data;
      setAuditSamityInfo(samityByAuditInfo);
    } catch (error) {
      errorHandler(error);
    }
  };

  const samityLevelWiseFilter = (samityLevel) =>
    setSamityInfo(filterSamityInfo?.filter((element) => element.samityLevel === samityLevel));

  const samityShareWiseFilter = (samityShare) => {
    if (samityShare == 50000) {
      setZillaToggle(false);
      setSamityInfo(filterSamityInfo?.filter((element) => element.samityshare < samityShare));
    } else {
      setZillaToggle(true);
      setSamityInfo(filterSamityInfo?.filter((element) => element.samityshare > samityShare));
    }
  };

  const getAllSamityData = async (officeId) => {
    try {
      const samityAllData = await axios.get(allSamityByAudit + officeId, config);
      const mainSamityInfo = samityAllData?.data?.data;
      const findSamityInfo = mainSamityInfo.filter((element) => element.status === 'A');
      const mapSamityInfo = findSamityInfo.map((info) => {
        return { ...info, isChecked: false };
      });

      setFilterSamityInfo(mapSamityInfo);
      setSamityInfo(mapSamityInfo.filter((elem) => elem.samityLevel == 'P' && elem.samityshare < 50000));
    } catch (error) {
      errorHandler(error);
    }
  };

  console.log('Samity', samityInfo);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectAll = (e) => {
    let samityInfoArray = [...samityInfo];
    samityInfoArray.map((item) => (item.isChecked = e.target.checked));
    setFilterSamityInfo(samityInfoArray);
    if (e.target.checked) {
      setSelectedSamityArray(samityInfoArray);
    } else {
      setSelectedSamityArray([]);
    }
    setIsCheckAll(e.target.checked);
  };

  const handleCheck = (e, i) => {
    let samityInfoArray = [...samityInfo];
    samityInfoArray[i]['isChecked'] = e.target.checked;
    setFilterSamityInfo(samityInfoArray);
  };

  //////////////////////////////// select district && upazila office name /////////////////////////////
  const handleChange = async (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'district':
        if (value == 0) {
          setDistrictId('');
          setUpozilaData([]);
          setSamityInfo([]);
          setAuditSamityInfo([]);
        } else {
          setDistrictId(value);
          getupazila(value);
          setSamityInfo([]);
          setAuditSamityInfo([]);
        }
        break;
      case 'upazilaOfficeId':
        if (value == 0) {
          setUpazilaOfficeId('');
          setSamityInfo([]);
          setAuditSamityInfo([]);
        } else {
          setUpazilaOfficeId(value);
          getAllSamityData(value);
          getSamityByAuditData(value);
          getEmployeeRecored(value);
        }
        break;
      case 'samityLevel':
        setSamityLevel(value);
        samityLevelWiseFilter(value);
        break;
      case 'samityShare':
        setSamityShare(value);
        samityShareWiseFilter(value);
        break;
      case 'samityEffectiveness':
        setSamityEffectiveness(value);
        break;
      case 'auditor':
        setAuditor(value);
        break;
    }
  };

  const onSubmitData = async () => {
    let auditData;

    const samityDataValue = samityInfo
      .filter((samityInfo) => samityInfo.isChecked !== false)
      .map((elm) => {
        return {
          serviceName: 'audit',
          samityId: elm.id,
          nextAppDesignationId: auditor,
          data: {
            samityInfo: {
              purpose: 'Office',
              doptorId: elm?.doptorId,
              officeId: elm?.officeId,
              samityId: elm?.id,
              samityName: elm?.samityName,
              samityCode: elm?.samityCode,
              samityLevel: elm?.samityLevel,
              samityType: elm?.samityTypeId,
              samityTypeName: elm?.TypeName,
              projectNameBangla: elm?.projectNameBangla,
              samityRegistrationDate: dateFormat(elm?.samityRegistrationDate),
              samityAddress: elm?.samityDetailsAddress,
              samityDivisionId: elm?.samityDivisionId,
              samityDistrictId: elm?.samityDistrictId,
              samityUpaCityId: elm?.samityUpaCityId,
              startYear: previousYear ? previousYear : currentYear,
              endYear: currentYear ? currentYear : futureYear,
            },
          },
        };
      });

    samityDataValue.map(async (samityData) => {
      try {
        auditData = await axios.post(AuditSubmitApi, samityData, config);
      } catch (error) {
        errorHandler(error);
      }
    });
    NotificationManager.success('আবেদনটি সফলভাবে প্রেরণ করা হয়েছে', '', 5000);
    setOpen(false);
    setSamityInfo([]);
    setAuditor();
    setSamityLevel();
    setUpazilaOfficeId();
    router.push({ pathname: '/coop/audit' });
  };

  return (
    <>
      <Grid container spacing={1.5} p={2} sx={{ alignItems: 'center' }}>
        <Grid item md={size} lg={size} xl={size} xs={12}>
          <TextField
            fullWidth
            label={star('জেলা অফিস')}
            name="district"
            select
            disabled={districtData.length == 1 ? true : false}
            SelectProps={{ native: true }}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={districtId || 0}
          >
            <option value={0}>- নির্বাচন করুন -</option>
            {districtData?.map((option, i) => (
              <option key={i} value={option.id}>
                {option.officeNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={5} lg={5} xl={5} xs={12}>
          <TextField
            fullWidth
            label={star('উপজেলা অফিস')}
            name="upazilaOfficeId"
            select
            disabled={upozillaData.length <= 1 ? true : false}
            SelectProps={{ native: true }}
            onChange={(e) => handleChange(e)}
            type="text"
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={upazilaOfficeId || 0}
          >
            <option value={0}>
              {upozillaData.length == 0 ? 'এই জেলা অফিস এ কোন উপজেলা অফিস নেই।' : '- নির্বাচন করুন -'}
            </option>
            {upozillaData.map((option, i) => (
              <option key={i} value={option.id}>
                {option.officeNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item>
          <Button
            className="btn btn-primary btn-subheading"
            onClick={handleClickOpen}
            size="small"
            sx={{ margin: '0px !important' }}
          >
            <AddIcons sx={{ display: 'block' }} />
            নিরীক্ষক বরাদ্ধকরন
          </Button>
        </Grid>
      </Grid>

      <Grid container p={2}>
        <SubHeading>
          <span style={{ fontWeight: 'bold' }}>সমিতির তালিকা</span>
        </SubHeading>
        <>
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md">
            <DialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
              sx={{
                background: 'var(--color-bg-topbar)',
                fontWeight: 'bold',
              }}
            >
              নিরীক্ষক বরাদ্ধ
            </DialogTitle>
            <DialogContent dividers>
              <div style={{ textAlign: 'center' }}>
                {inputRadioGroup(
                  'samityShare',
                  handleChange,
                  samityShare,
                  [
                    {
                      value: 50000,
                      color: '#FF0000',
                      rColor: 'error',
                      label: 'শেয়ার মুল্য ৫০,০০০ টাকার কম',
                    },
                    {
                      value: 50001,
                      color: '#28a745',
                      rColor: 'success',
                      label: 'শেয়ার মুল্য ৫০,০০০ টাকার বেশি ',
                    },
                  ],
                  12,
                  12,
                  12,
                  12,
                  false,
                  50000,
                )}
              </div>

              <Grid container spacing={1} pb={1}>
                <Grid container spacing={1.5} p={2}>
                  {zillaToggle && (
                    <Grid item md={size} lg={size} xl={size} xs={12}>
                      <TextField
                        fullWidth
                        label={star('জেলা অফিস')}
                        name="district"
                        select
                        disabled={districtData.length == 1 ? true : false}
                        SelectProps={{ native: true }}
                        onChange={(e) => handleChange(e)}
                        variant="outlined"
                        size="small"
                        style={{ backgroundColor: '#FFF' }}
                        value={districtId || 0}
                      >
                        <option value={0}>- নির্বাচন করুন -</option>
                        {districtData?.map((option, i) => (
                          <option key={i} value={option.id}>
                            {option.officeNameBangla}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  <Grid item md={size} lg={size} xl={size} xs={12}>
                    <TextField
                      fullWidth
                      label={star('উপজেলা অফিস')}
                      name="upazilaOfficeId"
                      select
                      disabled={upozillaData.length <= 1 ? true : false}
                      SelectProps={{ native: true }}
                      onChange={(e) => handleChange(e)}
                      type="text"
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: '#FFF' }}
                      value={upazilaOfficeId || 0}
                    >
                      <option value={0}>
                        {upozillaData.length == 0 ? 'এই জেলা অফিস এ কোন উপজেলা অফিস নেই।' : '- নির্বাচন করুন -'}
                      </option>
                      {upozillaData.map((option, i) => (
                        <option key={i} value={option.id}>
                          {option.officeNameBangla}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item md={4} lg={4} xl={4} xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label={star('নিরীক্ষকের নাম')}
                      name="auditor"
                      onChange={(e) => handleChange(e)}
                      select
                      SelectProps={{ native: true }}
                      value={auditor}
                      variant="outlined"
                      size="small"
                    >
                      <option value={0}>- নির্বাচন করুন -</option>
                      {employeeRecord?.map((option) => (
                        <option key={option?.designationId} value={parseInt(option?.designationId)}>
                          {option?.nameBn} {option?.designation}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={2} lg={2} xl={2} xs={12} sm={12}>
                    <TextField
                      fullWidth
                      disabled
                      name="budgetYear"
                      label={star('অর্থ বছরের নিরীক্ষা')}
                      value={budgetyear || 0}
                      variant="outlined"
                      size="small"
                    ></TextField>
                  </Grid>

                  {inputRadioGroup(
                    'samityEffectiveness',
                    handleChange,
                    samityEffectiveness,
                    [
                      {
                        value: 'A',
                        color: '#007bff',
                        rcolor: 'primary',
                        label: 'কার্যকর',
                      },
                      {
                        value: 'E',
                        color: '#28a745',
                        rColor: 'success',
                        label: 'অকার্যকর',
                      },
                      {
                        value: 'I',
                        color: '#FF0000',
                        rColor: 'error',
                        label: 'অবসায়নে ন্যাস্ত',
                      },
                    ],
                    6,
                    6,
                    12,
                    12,
                    false,
                    'A',
                  )}
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormControl component="fieldset" fullWidth disabled={levelLock}>
                      <RadioGroup
                        row
                        aria-label="pcn"
                        name="samityLevel"
                        onChange={handleChange}
                        defaultValue="P"
                        value={samityLevel}
                      >
                        <FormControlLabel
                          value="P"
                          sx={{ color: '#007bff' }}
                          control={<Radio color="primary" />}
                          label="প্রাথমিক"
                        />
                        <FormControlLabel
                          sx={{ color: '#ed6c02' }}
                          value="C"
                          control={<Radio color="warning" />}
                          label="কেন্দ্রীয়"
                        />
                        <FormControlLabel
                          sx={{ color: '#28a745' }}
                          value="N"
                          control={<Radio color="success" />}
                          label="জাতীয়"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Box>
                {samityInfo.length > 0 && (
                  <>
                    <SubHeading>সমিতির তালিকা</SubHeading>
                    <TableContainer className="table-container">
                      <Table
                        // sx={{ minWidth: 450 }}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell align="center">নং</TableCell>
                            <TableCell align="center">
                              <Checkbox
                                type="checkbox"
                                name="selectAll"
                                id="selectAll"
                                onChange={handleSelectAll}
                                checked={isCheckAll}
                                color="success"
                              />
                            </TableCell>
                            <TableCell>সমিতির নাম </TableCell>
                            <TableCell>নিবন্ধন নম্বর</TableCell>
                            <TableCell>নিবন্ধন তারিখ </TableCell>
                            <TableCell>শেয়ার পরিমান </TableCell>
                            <TableCell>বিগত নিরীক্ষকের নাম </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {samityInfo?.map((samity, i) =>
                            samity ? (
                              <TableRow key={i}>
                                <TableCell scope="row" align="center">
                                  {numberToWord('' + (i + 1) + '')}
                                </TableCell>
                                <TableCell align="center">
                                  <Checkbox
                                    onChange={(e) => {
                                      handleCheck(e, i);
                                    }}
                                    checked={samity.isChecked}
                                  />
                                </TableCell>
                                <TableCell width="30%">
                                  <Tooltip
                                    title={
                                      <div className="tooltip-title">
                                        {samity?.samityName}{' '}
                                        {samity?.samityLevel == 'P'
                                          ? ' (প্রাথমিক সমিতি)'
                                          : samity?.samityLevel == 'C'
                                            ? ' (কেন্দ্রীয় সমিতি)'
                                            : samity?.samityLevel == 'N'
                                              ? ' (জাতীয় সমিতি)'
                                              : ''}
                                      </div>
                                    }
                                    arrow
                                  >
                                    <span>
                                      {samity?.samityName}{' '}
                                      {samity?.samityLevel == 'P'
                                        ? ' (প্রাথমিক সমিতি)'
                                        : samity?.samityLevel == 'C'
                                          ? ' (কেন্দ্রীয় সমিতি)'
                                          : samity?.samityLevel == 'N'
                                            ? ' (জাতীয় সমিতি)'
                                            : ''}
                                    </span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell width="20%">{numberToWord('' + samity?.samityCode + '')}</TableCell>
                                <TableCell>
                                  {numberToWord('' + dateFormat(samity?.samityRegistrationDate) + '')}
                                </TableCell>
                                <TableCell>
                                  {numberToWord('' + samity?.samityshare + '')
                                    ? numberToWord('' + samity?.samityshare + '')
                                    : 0}
                                </TableCell>
                                <TableCell>{samity?.nameBn}</TableCell>
                              </TableRow>
                            ) : (
                              ''
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Divider />
              <Grid container className="btn-container">
                {loadingDataSaveUpdate ? (
                  <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
                    {update ? 'হালনাগাদ হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={onSubmitData}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
                  </Button>
                )}
              </Grid>
            </DialogActions>
          </Dialog>
        </>

        <Grid item md={12} lg={12} xl={12} xs={12}>
          <Box>
            {auditSamityInfo.length > 0 && (
              <>
                <TableContainer className="table-container">
                  <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell align="center">নং</TableCell>
                        <TableCell>সমিতির নাম </TableCell>
                        <TableCell>নিবন্ধন নম্বর</TableCell>
                        <TableCell>অর্থ বছর</TableCell>
                        <TableCell>শেয়ার পরিমান</TableCell>
                        <TableCell>আয় </TableCell>
                        <TableCell>ব্যয় </TableCell>
                        <TableCell>লাভ/ক্ষতি </TableCell>
                        <TableCell>নিরীক্ষকের নাম</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {auditSamityInfo?.map((option, i) =>
                        option ? (
                          <TableRow key={i}>
                            <TableCell scope="row" align="center">
                              {numberToWord('' + (i + 1) + '')}
                            </TableCell>
                            <TableCell width="30%">
                              <Tooltip
                                title={
                                  <div className="tooltip-title">
                                    {option?.samityName}{' '}
                                    {option?.samityLevel == 'P'
                                      ? ' (প্রাথমিক সমিতি)'
                                      : option?.samityLevel == 'C'
                                        ? ' (কেন্দ্রীয় সমিতি)'
                                        : option?.samityLevel == 'N'
                                          ? ' (জাতীয় সমিতি)'
                                          : ''}
                                  </div>
                                }
                                arrow
                              >
                                <span>
                                  {option?.samityName}{' '}
                                  {option?.samityLevel == 'P'
                                    ? ' (প্রাথমিক সমিতি)'
                                    : option?.samityLevel == 'C'
                                      ? ' (কেন্দ্রীয় সমিতি)'
                                      : option?.samityLevel == 'N'
                                        ? ' (জাতীয় সমিতি)'
                                        : ''}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell width="20%">{numberToWord('' + option?.samityCode + '')}</TableCell>
                            <TableCell>
                              {numberToWord('' + option?.startYear + '')}-{numberToWord('' + option?.endYear + '')}
                            </TableCell>
                            <TableCell>
                              {numberToWord('' + option?.samityshare + '')
                                ? numberToWord('' + option?.samityshare + '')
                                : 0}
                            </TableCell>
                            <TableCell>{numberToWord('' + option?.income + '')}</TableCell>
                            <TableCell>{numberToWord('' + option?.expense + '')}</TableCell>
                            <TableCell>{numberToWord('' + option?.profitLoss + '')}</TableCell>
                            <TableCell>{option?.nameBn}</TableCell>
                          </TableRow>
                        ) : (
                          ''
                        ),
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AuditDisUpaOffice;
