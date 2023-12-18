/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
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
import SubHeading from 'components/shared/others/SubHeading';
import star from 'components/utils/coop/star';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { inputRadioGroup } from 'service/fromInput';
import { engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import {
  AuditSubmitApi,
  BugetYear,
  designationName,
  districtOfficeByuser,
  samityByOffice,
  upozilaOffice,
} from '../../../url/coop/ApiList';

const AuditDisUpaOffice = ({ takeData, size, getData }) => {
  const router = useRouter();
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [filtersamityInfo, setFilterSamityInfo] = useState([]);
  const [employeeRecord, setEmployeeRecord] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [upozillaData, setUpozilaData] = useState([]);
  const [upazilaOfficeId, setUpazilaOfficeId] = useState('');
  const [loadingDataSaveUpdate] = useState(false);
  const [update] = useState(false);
  const [budgetArray, setBudgetArray] = useState([]);
  const [budgetYear, setBudgetYear] = useState();
  const [levelLock] = useState(false);
  const [samityLevel, setSamityLevel] = useState();
  const [samityEffectiveness, setSamityEffectiveness] = useState();

  useEffect(() => {
    getDistrict();
    getBudgetYearInfo();
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
        getSamityData(data[0].id);
        getEmployeeRecored(data[0].id);
        setUpozilaData(data);
      } else {
        setUpozilaData(data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  let getBudgetYearInfo = async () => {
    try {
      const budgetInfoResp = await axios.get(BugetYear, config);
      setBudgetArray(budgetInfoResp.data.data);
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
  // samity level wise filter section
  const samityLevelWiseFilter = (samityData, level) =>
    setSamityInfo(samityData?.filter((element) => element.samityLevel === level));

  const getSamityData = async (officeId) => {
    try {
      const samityData = await axios.get(samityByOffice + officeId, config);
      const mainSamityInfo = samityData?.data?.data?.filter((element) => element.status === 'A');
      const finalSamityINfo = mainSamityInfo.map((info) => {
        return { ...info, auditor: '', budget: '' };
      });

      setFilterSamityInfo(finalSamityINfo);
      samityLevelWiseFilter(finalSamityINfo, 'P');
    } catch (error) {
      errorHandler(error);
    }
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
        } else {
          setDistrictId(value);
          getupazila(value);
          setSamityInfo([]);
        }
        break;
      case 'upazilaOfficeId':
        if (value == 0) {
          setUpazilaOfficeId('');
          setSamityInfo([]);
        } else {
          setUpazilaOfficeId(value);
          getSamityData(value);
          getEmployeeRecored(value);
        }
        break;
      case 'samityShare':
        samityLevelWiseFilter(filtersamityInfo, value);
        break;
      case 'samityLevel':
        setSamityLevel(value);
        samityLevelWiseFilter(filtersamityInfo, value);
        break;
      case 'samityEffectiveness':
        setSamityEffectiveness(value);
        break;
    }
  };

  const handleChangeAuditor = async (e, i) => {
    const { name, value } = e.target;
    const tempArray = [...samityInfo];
    tempArray[i][name] = value;
    setSamityInfo(tempArray);
  };

  const onSubmitData = async () => {
    let auditData;
    const [startYear, endYear] = budgetYear.split('-');

    const samityDataValue = samityInfo
      .filter((samityInfo) => samityInfo.auditor !== '')
      .map((elm) => {
        return {
          serviceName: 'audit',
          samityId: elm.id,
          nextAppDesignationId: elm.auditor,
          data: {
            samityId: elm?.id,
            samityName: elm?.samityName,
            samityCode: elm?.samityCode,
            samityLevel: elm?.samityLevel,
            samityType: elm?.samityTypeId,
            samityFormationDate: dateFormat(elm?.samityFormationDate),
            samityRegistrationDate: dateFormat(elm?.samityRegistrationDate),
            officeId: elm?.officeId,
            samityAddress: elm?.samityDetailsAddress,
            samityDivisionId: elm?.samityDivisionId,
            samityDistrictId: elm?.samityDistrictId,
            samityUpaCityId: elm?.samityUpaCityId,
            soldShare: elm?.soldShare,
            sharePrice: elm?.sharePrice,
            startYear: startYear,
            endYear: endYear,
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
    router.push({ pathname: '/coop/audit' });
  };

  return (
    <>
      <Grid container spacing={1.5} p={2}>
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

        <Grid item md={size} lg={size} xl={size} xs={12}>
          <TextField
            fullWidth
            label={star('অর্থ বছরের নিরীক্ষা')}
            onChange={(e) => setBudgetYear(e.target.value)}
            select
            SelectProps={{ native: true }}
            value={budgetYear || 0}
            variant="outlined"
            size="small"
          >
            <option value={0}>- নির্বাচন করুন -</option>
            {budgetArray?.map((option) => (
              <option key={option?.id} value={option.financialYear}>
                {engToBang(option.financialYear)}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
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
              <FormControlLabel sx={{ color: '#28a745' }} value="N" control={<Radio color="success" />} label="জাতীয়" />
            </RadioGroup>
          </FormControl>
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
          4,
          6,
          12,
          12,
          false,
        )}
      </Grid>

      <Grid container spacing={2} p={2}>
        <Grid item md={12} lg={12} xl={12} xs={12}>
          <SubHeading>সমিতির তালিকা</SubHeading>
          <Box>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center">নং</TableCell>
                    <TableCell>সমিতির নাম </TableCell>
                    <TableCell>নিবন্ধন নম্বর</TableCell>
                    <TableCell>নিবন্ধন তারিখ </TableCell>
                    <TableCell>ঠিকানা </TableCell>
                    <TableCell align="center">নিরীক্ষক</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {samityInfo?.map((option, i) =>
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
                        <TableCell>{numberToWord('' + dateFormat(option?.samityRegistrationDate) + '')}</TableCell>
                        <TableCell>{option?.samityDetailsAddress}</TableCell>
                        <TableCell align="center">
                          <TextField
                            fullWidth
                            name="auditor"
                            onChange={(e) => {
                              handleChangeAuditor(e, i);
                            }}
                            select
                            SelectProps={{ native: true }}
                            value={samityInfo[i].auditor}
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
                        </TableCell>
                      </TableRow>
                    ) : (
                      ''
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>

      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            {update ? 'হালনাগাদ হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
          </LoadingButton>
        ) : (
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
          </Button>
        )}
      </Grid>
    </>
  );
};

export default AuditDisUpaOffice;
