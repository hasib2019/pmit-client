/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/6/30 10:01:48AM
 * @modify date 2022/11/03 11.31 AM
 * @desc [Authorination creation for samity]
 */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Button, Grid, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import RequiredFile from 'components/utils/RequiredFile';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { inputField, inputRadioGroup } from 'service/fromInput';
import { numberToWord } from 'service/numberToWord';
import { memberInfoData } from '../../../../url/coop/ApiList';
import { getAuthorizer, getSamityDataByUser } from '../../../../url/coop/BackOfficeApi';
import CentralMemberSelect from './CentralMemberSelect';
import NationalMemberSelect from './NationalMemberSelect';

const AuthorizedPerson = () => {
  const config = localStorageData('config');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [allSamityData, setAllSamityData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [samityData, setSamityData] = useState({
    samityId: '',
    samityType: '',
    samityAddress: '',
    samityName: {},
    newAuth: '',
    isAuth: 'N',
  });
  const [centralData, setCentralData] = useState({});
  const [nationalData, setNationalData] = useState({});
  const [presentAuthData, setPresentAuthData] = useState({
    presentAuthId: '',
    presentAuthName: '',
    memberId: '',
  });

  useEffect(() => {
    getSamityData();
  }, []);

  const getSamityData = async () => {
    const getData = await axios.get(getSamityDataByUser, config);
    const newSamityData = getData.data.data;
    newSamityData.map(
      (option) =>
        (option.samityFullName =
          option.samityName +
          (option.samityLevel == 'P'
            ? '-(প্রাথমিক '
            : option.samityLevel == 'C'
            ? '-(কেন্দ্রিয় '
            : option.samityLevel == 'N'
            ? '-(জাতীয় '
            : '') +
          (option.isManual ? 'অনলাইনকরন সমিতি)' : 'নিবন্ধিত সমিতি)')),
    );
    setAllSamityData(newSamityData);
  };

  const handleChange = async (e) => {
    setSamityData({ ...samityData, [e.target.name]: e.target.value });
  };

  const handleChangeSamity = async (e, data) => {
    if (data) {
      setSamityData({
        ...samityData,
        samityId: data.id,
        ['samityName']: {
          id: data.id,
          address: data.address,
          samityType: data.samityType,
          samityLevel: data.samityLevel,
        },
      });
      getSamityMemberData(data.id, data.samityLevel);
    } else {
      setPresentAuthData({
        presentAuthId: '',
        presentAuthName: '',
        memberId: '',
      });
      setSamityData({
        samityName: 0,
        samityType: '',
        samityAddress: '',
        newAuth: 0,
        isAuth: 'N',
      });
      setMemberData([]);
    }
  };

  const getSamityMemberData = async (samityId) => {
    try {
      const memberData = await axios.get(memberInfoData + samityId, config);
      setMemberData(memberData.data.data);
      const getPresentAuthData = await axios.get(getAuthorizer + samityId, config);
      const data = getPresentAuthData.data.data;
      setPresentAuthData({
        presentAuthId: data.id,
        presentAuthName: data.authorizePersonNameBangla,
        memberId: data.memberId,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let payload;
    // for new assign
    if (presentAuthData.presentAuthName) {
      if (samityData.isAuth == 'N') {
        // assign new auth
        payload = [
          {
            id: 0,
            samityId: samityData.samityName.id
              ? samityData.samityName.id
              : centralData.centralSamityId
              ? centralData.centralSamityId
              : nationalData.nationalSamityId
              ? nationalData.nationalSamityId
              : null,
            memberId:
              parseInt(samityData.newAuth) ||
              parseInt(centralData.primarySamityMemberId) ||
              parseInt(nationalData.primarySamityMemberId),
            status: true,
          },
          {
            id: presentAuthData.presentAuthId,
            status: false,
          },
        ];
      } else {
        // stop auth
        payload = [
          {
            id: presentAuthData.presentAuthId,
            status: false,
          },
        ];
      }
    } else {
      // new assign when samity no auth
      payload = [
        {
          id: 0,
          samityId: samityData.samityName.id
            ? samityData.samityName.id
            : centralData.centralSamityId
            ? centralData.centralSamityId
            : nationalData.nationalSamityId
            ? nationalData.nationalSamityId
            : null,
          memberId:
            parseInt(samityData.newAuth) ||
            parseInt(centralData.primarySamityMemberId) ||
            parseInt(nationalData.primarySamityMemberId),
          status: true,
        },
      ];
    }
    try {
      await axios.post(getAuthorizer, payload, config);
      if (presentAuthData.presentAuthName) {
        if (samityData.isAuth == 'N') {
          const message = 'সফলভাবে দায়িত্ব স্থগিত ও অথোরাইজড পারসন নিয়োগ করা হয়েছে';
          NotificationManager.success(message, '', 5000);
        } else {
          const message = 'সফলভাবে দায়িত্ব স্থগিত করা হয়েছে';
          NotificationManager.success(message, '', 5000);
        }
      } else {
        const message = 'সফলভাবে অথোরাইজড পারসন নিয়োগ করা হয়েছে';
        NotificationManager.success(message, '', 5000);
      }

      setLoadingDataSaveUpdate(false);
      setPresentAuthData({
        presentAuthId: '',
        presentAuthName: '',
        memberId: '',
      });
      setSamityData({
        samityName: {},
        samityType: '',
        samityAddress: '',
        newAuth: 0,
        isAuth: 'N',
      });
      setMemberData([]);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  const getCenSamityInfo = (props) => {
    setCentralData(props);
  };

  const getNetSamityInfo = (props) => {
    setNationalData(props);
  };
  return (
    <Fragment>
      {allSamityData.length > 0 ? (
        <Fragment>
          <Grid container spacing={2.5} my={2} px={2}>
            <Grid item md={4} lg={4} xl={4} xs={12}>
              <Autocomplete
                inputProps={{ style: { padding: 0, margin: 0 } }}
                onChange={(e, value) => {
                  handleChangeSamity(e, value);
                }}
                options={allSamityData.map((option) => {
                  return {
                    label: option.samityFullName,
                    id: option.id,
                    address: option.uniThanaPawNameBangla + ',' + option.samityDetailsAddress,
                    samityType: option.typeName,
                    samityLevel: option.samityLevel,
                  };
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={RequiredFile('নির্বাচন করুন')}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  />
                )}
              />
            </Grid>

            {inputField(
              'সমিতির ধরন',
              'samityType',
              'text',
              handleChange,
              samityData.samityName.samityType ? samityData.samityName.samityType : ' ',
              'small',
              4,
              4,
              4,
              12,
              '',
              '',
              true,
            )}

            {inputRadioGroup(
              'isAuth',
              (e) => handleChange(e),
              samityData.isAuth,
              [
                {
                  value: 'Y',
                  color: '#ed6c02',
                  rColor: 'warning',
                  label: 'দায়িত্ব স্থগিত',
                },
                {
                  value: 'N',
                  color: '#007bff',
                  rcolor: 'primary',
                  label: 'দায়িত্ব স্থগিত ও নতুন সংযোজন',
                },
              ],
              4,
              4,
              4,
              12,
              false,
              samityData.auth,
              '',
              presentAuthData.memberId ? false : true,
            )}

            {inputField(
              'সমিতির ঠিকানা',
              'samityAddress',
              'text',
              handleChange,
              samityData.samityName.address ? samityData.samityName.address : ' ',
              'small',
              4,
              4,
              4,
              12,
              '',
              '',
              true,
            )}

            {inputField(
              'বর্তমান দায়িত্ব প্রাপ্ত ব্যাক্তি (সদস্য)',
              'presentAuthName',
              'text',
              handleChange,
              presentAuthData.presentAuthName ? presentAuthData.presentAuthName : ' ',
              'small',
              4,
              4,
              4,
              12,
              '',
              '',
              true,
              presentAuthData.presentAuthName ? false : true,
            )}

            <Grid
              item
              xl={4}
              md={4}
              lg={4}
              xs={12}
              hidden={samityData.isAuth == 'N' && samityData.samityName.samityLevel == 'P' ? false : true}
            >
              <TextField
                fullWidth
                label="নিয়োগকৃত দায়িত্ব প্রাপ্ত ব্যাক্তি (সদস্য)"
                name="newAuth"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={samityData.newAuth || 0}
                variant="outlined"
                size="small"
              >
                <option value={0}>- নির্বাচন করুন -</option>

                {memberData?.map((option, i) => (
                  <option
                    key={i}
                    value={option.memberBasicInfo.id}
                    disabled={option.memberBasicInfo.id == presentAuthData.memberId ? true : false}
                  >
                    {numberToWord(option.memberBasicInfo.memberCode) + ' - ' + option.memberBasicInfo.memberNameBangla}
                    {option.memberBasicInfo.id == presentAuthData.memberId ? ' (বর্তমান দায়িত্ব প্রাপ্ত ব্যাক্তি)' : ''}
                  </option>
                ))}
              </TextField>
            </Grid>
            {/* for central part  */}
            {samityData.samityName.samityLevel == 'C' ? (
              <CentralMemberSelect
                samityId={samityData.samityId}
                centeralSamityInfo={getCenSamityInfo}
                memberId={presentAuthData.memberId}
                isAuth={samityData.isAuth}
              />
            ) : samityData.samityName.samityLevel == 'N' ? (
              <NationalMemberSelect
                samityId={samityData.samityId}
                nationalSamityData={getNetSamityInfo}
                memberId={presentAuthData.memberId}
                isAuth={samityData.isAuth}
              />
            ) : (
              ''
            )}
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              {loadingDataSaveUpdate ? (
                <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="contained">
                  {'সংরক্ষন করা হচ্ছে...'}
                </LoadingButton>
              ) : (
                <Tooltip title="সংরক্ষন করুন">
                  <Button
                    disabled={samityData.samityName ? false : true}
                    variant="contained"
                    className="btn btn-save"
                    startIcon={<SaveOutlinedIcon />}
                    onClick={onsubmit}
                  >
                    {' '}
                    {'সংরক্ষন করুন'}
                  </Button>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Fragment>
      ) : (
        <div>
          <span
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#3678e1',
              fontSize: '18px',
            }}
          >
            আবেদিত কোন সমিতি নেই।
          </span>
        </div>
      )}
    </Fragment>
  );
};

export default AuthorizedPerson;
