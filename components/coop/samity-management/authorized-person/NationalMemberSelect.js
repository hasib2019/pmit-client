import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { numberToWord } from 'service/numberToWord';
import { localStorageData } from 'service/common';
import { memberInfoData } from '../../../../url/coop/ApiList';

const NationalMemberSelect = ({ samityId, nationalSamityData, memberId, isAuth }) => {
  const config = localStorageData('config');

  const [getCenSamity, setGetCenSamity] = useState([]);
  const [getPrimarySamity, setGetPrimarySamity] = useState([]);
  const [getPrimarySamityMember, setGetPrimarySamityMember] = useState([]);
  const [nationalSamityInfo, setNationalSamityInfo] = useState({
    nationalMemberId: '',
    nationalSamityId: '',
    centralSamityId: '',
    primaryMemberId: '',
    primarySamityId: '',
    primarySamityMemberId: '',
  });
  useEffect(() => {
    centralSamityData(samityId);
  }, [samityId]);

  useEffect(() => {
    nationalSamityData(nationalSamityInfo);
  }, [nationalSamityInfo]);

  const centralSamityData = async (id) => {
    const CenmemberData = await axios.get(memberInfoData + id, config);
    setGetCenSamity(CenmemberData.data.data);
    setGetPrimarySamity([]);
    setGetPrimarySamityMember([]);
  };
  const primarySamityData = async (id) => {
    const getPrimarySamityData = await axios.get(memberInfoData + id, config);
    setGetPrimarySamity(getPrimarySamityData.data.data);
    setGetPrimarySamityMember([]);
  };
  const primaryMemberData = async (id) => {
    const getMemberData = await axios.get(memberInfoData + id, config);
    setGetPrimarySamityMember(getMemberData.data.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let findData, findPrimaryData;
    switch (name) {
      case 'nationalMemberId':
        findData = getCenSamity.find((element) => element.memberBasicInfo.id == value);
        setNationalSamityInfo({
          ...nationalSamityInfo,
          [name]: value != 0 ? value : '',
          nationalSamityId: findData.memberBasicInfo.nationalSamityId,
          centralSamityId: findData.memberBasicInfo.centralSamityId,
        });
        primarySamityData(findData.memberBasicInfo.centralSamityId);
        break;
      case 'primaryMemberId':
        findPrimaryData = getPrimarySamity.find((element) => element.memberBasicInfo.id == value);
        setNationalSamityInfo({
          ...nationalSamityInfo,
          [name]: value != 0 ? value : '',
          primarySamityId: findPrimaryData.memberBasicInfo.refSamityId,
        });
        primaryMemberData(findPrimaryData.memberBasicInfo.refSamityId);
        break;
      case 'primarySamityMemberId':
        setNationalSamityInfo({
          ...nationalSamityInfo,
          [name]: value != 0 ? value : '',
        });
        break;
    }
  };
  return (
    <>
      {isAuth == 'N' ? (
        <>
          <Grid item xl={4} lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              label="কেন্দ্রীয় সমিতি"
              name="nationalMemberId"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={nationalSamityInfo.nationalMemberId || 0}
              variant="outlined"
              size="small"
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {getCenSamity?.map((option, i) => (
                <>
                  {
                    <option key={i} value={option.memberBasicInfo.id}>
                      {option.memberBasicInfo.memberName +
                        ' - ( ' +
                        option.memberBasicInfo.signatorySamityName +
                        '-' +
                        option.memberBasicInfo.signatoryPersonNameBangla +
                        ' )'}
                    </option>
                  }
                </>
              ))}
            </TextField>
          </Grid>
          <Grid item xl={4} lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              label="প্রাথমিক সমিতি"
              name="primaryMemberId"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={nationalSamityInfo.primaryMemberId || 0}
              variant="outlined"
              size="small"
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {getPrimarySamity?.map((option, i) => (
                <>
                  {
                    <option key={i} value={option.memberBasicInfo.id}>
                      {option.memberBasicInfo.memberName +
                        ' - ( ' +
                        option.memberBasicInfo.samitySignatoryPerson +
                        ' )'}
                    </option>
                  }
                </>
              ))}
            </TextField>
          </Grid>
          <Grid item xl={4} lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              label="নিয়োগকৃত দায়িত্ব প্রাপ্ত ব্যাক্তি (সদস্য)"
              name="primarySamityMemberId"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={nationalSamityInfo.primarySamityMemberId || 0}
              variant="outlined"
              size="small"
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {getPrimarySamityMember?.map((option, i) => (
                <>
                  {memberId ? (
                    <option
                      key={i}
                      value={option.memberBasicInfo.id}
                      disabled={option.memberBasicInfo.id == memberId ? true : false}
                    >
                      {numberToWord(option.memberBasicInfo.memberCode) +
                        ' - ' +
                        option.memberBasicInfo.memberNameBangla}
                      {option.memberBasicInfo.id == memberId ? ' (বর্তমান দায়িত্ব প্রাপ্ত ব্যাক্তি)' : ''}
                    </option>
                  ) : (
                    <option key={i} value={option.memberBasicInfo.id}>
                      {numberToWord(option.memberBasicInfo.memberCode) +
                        ' - ' +
                        option.memberBasicInfo.memberNameBangla}
                    </option>
                  )}
                </>
              ))}
            </TextField>
          </Grid>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default NationalMemberSelect;
