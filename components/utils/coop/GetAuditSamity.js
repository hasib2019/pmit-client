/* eslint-disable no-unused-vars */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/08/22
 * @modify date 2022-08-22 10:13:48
 * @desc [description]
 */
import { Autocomplete, Grid, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import bnLocale from 'date-fns/locale/bn';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { getByUserAudit } from '../../../url/coop/ApiList';
import RequiredFile from '../RequiredFile';

const localeMap = {
  bn: bnLocale,
};

const GetAuditSamity = ({
  labelName,
  name,
  onChange,
  value,
  xl,
  lg,
  md,
  xs,
  isDisabled,
  customClass,
  customStyle,
  selectedSamityId,
  isAmendment,
}) => {
  const config = localStorageData('config');
  const [allApprovalSamity, setAllApprovalSamity] = useState([]);
  const [samityType, setSamityType] = useState(null);
  const [locale] = useState('bn');

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getSamityType(selectedSamityId);
  }, [selectedSamityId]);

  const getData = async () => {
    try {
      const allSamityData = await axios.get(getByUserAudit, config);
      const allGetSamity = allSamityData.data.data;
      allGetSamity?.map((row) => {
        row.fullSamityName =
          row.samityName +
          ' - ' +
          (row.samityLevel == 'P'
            ? row.isManual
              ? 'প্রাথমিক অনলাইনকরন সমিতি'
              : 'প্রাথমিক নিবন্ধিত সমিতি'
            : '' || row.samityLevel == 'C'
              ? row.isManual
                ? 'কেন্দ্রিয় অনলাইনকরন সমিতি'
                : 'কেন্দ্রিয় নিবন্ধিত সমিতি'
              : '' || row.samityLevel == 'N'
                ? row.isManual
                  ? 'জাতীয় অনলাইনকরন সমিতি'
                  : 'জাতীয় নিবন্ধিত সমিতি'
                : '');
      });
      setAllApprovalSamity(allGetSamity);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSamityType = async (id) => {
    if (id) {
      const allSamityData = await axios.get(getByUserAudit, config);
      const allGetSamity = allSamityData.data.data;
      allGetSamity?.map((row) => {
        row.fullSamityName =
          row.samityName +
          ' - ' +
          (row.samityLevel == 'P'
            ? row.isManual
              ? 'প্রাথমিক অনলাইনকরন সমিতি'
              : 'প্রাথমিক নিবন্ধিত সমিতি'
            : '' || row.samityLevel == 'C'
              ? row.isManual
                ? 'কেন্দ্রিয় অনলাইনকরন সমিতি'
                : 'কেন্দ্রিয় নিবন্ধিত সমিতি'
              : '' || row.samityLevel == 'N'
                ? row.isManual
                  ? 'জাতীয় অনলাইনকরন সমিতি'
                  : 'জাতীয় নিবন্ধিত সমিতি'
                : '');
      });
      const data = allGetSamity.find((e) => e.id == id);
      setSamityType(data);
    } else {
      setSamityType();
    }
  };

  const amendmentSamityCode = (amendmentSamityCodeArr) => {
    let samityCodes;
    if (amendmentSamityCodeArr) {
      samityCodes = amendmentSamityCodeArr.map((item) => item.samityCode).join(', ');
    } else {
      samityCodes = 'পূর্বে সমিতির উপ-আইন সংশোধন করা হয়নি!';
    }
    return samityCodes;
  };

  return (
    <>
      <Grid item xl={xl} lg={lg} md={md} xs={xs}>
        <Autocomplete
          disabled={isDisabled}
          inputProps={{ style: { padding: 0, margin: 0 } }}
          onChange={(e, value) => {
            onChange(value);
          }}
          options={allApprovalSamity.map((row) => {
            return {
              label: row.fullSamityName,
              id: row.id,
              samityLevel: row.samityLevel,
            };
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={RequiredFile(labelName)}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF', margin: '5dp' }}
            />
          )}
        />
      </Grid>
      {samityType ? (
        <>
          <Grid item xl={xl} lg={lg} md={md} xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
              <DatePicker
                label="সমিতি নিবন্ধনের তারিখ"
                inputFormat="dd-MM-yyyy"
                value={samityType?.samityRegistrationDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    sx={customStyle}
                    disabled={true}
                    className={customClass}
                  />
                )}
                disableFuture={true}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xl={xl} lg={lg} md={md} xs={6}>
            <TextField
              fullWidth
              disabled={true}
              className={customClass}
              label={'সমিতির নিবন্ধন নাম্বার'}
              typeName={'text'}
              variant="outlined"
              value={samityType?.samityCode}
              size="small"
              sx={customStyle}
            />
          </Grid>
          <Grid item xl={xl} lg={lg} md={md} xs={6}>
            <TextField
              fullWidth
              disabled={true}
              className={customClass}
              label={'সমিতির ধরন'}
              typeName={'text'}
              variant="outlined"
              value={samityType?.typeName}
              size="small"
              sx={customStyle}
            />
          </Grid>
          <Grid item xl={xl} lg={lg} md={md} xs={6}>
            <TextField
              fullWidth
              disabled={true}
              className={customClass}
              label={'প্রকল্পের নাম'}
              typeName={'text'}
              variant="outlined"
              value={samityType?.projectNameBangla ? samityType?.projectNameBangla : 'স্ব-উদ্যোগ'}
              size="small"
              sx={customStyle}
            />
          </Grid>
          <Grid item xl={xl} lg={lg} md={md} xs={6} className={'paddingLeftRight5px'}>
            <TextField
              fullWidth
              disabled={true}
              className={customClass}
              label={'সমিতি বিস্তারিত ঠিকানা'}
              typeName={'text'}
              variant="outlined"
              value={samityType?.samityDetailsAddress + ',' + samityType?.uniThanaPawNameBangla}
              size="small"
              sx={customStyle}
            />
          </Grid>
          {isAmendment && (
            <Grid item xl={12} lg={12} md={12} xs={12} className={'paddingLeftRight5px'}>
              <TextField
                fullWidth
                disabled={true}
                className={customClass}
                label={'সমিতির উপ-আইন সংশোধিত সমিতির নিবন্ধন নাম্বার'}
                typeName={'text'}
                variant="outlined"
                value={amendmentSamityCode(samityType?.amendmentSamityCode) || ' '}
                size="small"
                sx={customStyle}
              />
            </Grid>
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default GetAuditSamity;
