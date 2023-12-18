import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { memberInfoData } from '../../../../url/coop/ApiList';

const CentralMemberSelect = ({ samityId, centeralSamityInfo, memberId, isAuth }) => {
  const config = localStorageData('config');
  const [getCenSamity, setGetCenSamity] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [centralSamityInfo, setCentralSamityInfo] = useState({
    centralMemberId: '',
    centralSamityId: '',
    refSamityId: '',
    primarySamityMemberId: '',
  });

  useEffect(() => {
    centralSamityData(samityId);
  }, [samityId]);

  useEffect(() => {
    centeralSamityInfo(centralSamityInfo);
  }, [centralSamityInfo]);

  const centralSamityData = async (id) => {
    const CenmemberData = await axios.get(memberInfoData + id, config);
    setGetCenSamity(CenmemberData.data.data);
    setMemberData([]);
  };

  const primarySamityMember = async (id) => {
    const getMemberData = await axios.get(memberInfoData + id, config);
    setMemberData(getMemberData.data.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const findData = getCenSamity.find((element) => element.memberBasicInfo.id == value);
    switch (name) {
      case 'centralMemberId':
        setCentralSamityInfo({
          ...centralSamityInfo,
          [name]: value != 0 ? value : '',
          centralSamityId: findData.memberBasicInfo.samityId,
          refSamityId: findData.memberBasicInfo.refSamityId,
        });
        primarySamityMember(findData.memberBasicInfo.refSamityId);
        break;
      case 'primarySamityMemberId':
        setCentralSamityInfo({
          ...centralSamityInfo,
          [name]: value != 0 ? value : '',
        });
        break;
    }
  };

  return (
    <>
      {isAuth == 'N' ? (
        <>
          <Grid item md={4} lg={4} xl={4} xs={12}>
            <TextField
              fullWidth
              label="প্রাথমিক সমিতি"
              name="centralMemberId"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={centralSamityInfo.centralMemberId || 0}
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
                        option.memberBasicInfo.samitySignatoryPerson +
                        ' )'}
                    </option>
                  }
                </>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} lg={4} xl={4} xs={12}>
            <TextField
              fullWidth
              label="নিয়োগকৃত দায়িত্ব প্রাপ্ত ব্যাক্তি (সদস্য)"
              name="primarySamityMemberId"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={centralSamityInfo.primarySamityMemberId || 0}
              variant="outlined"
              size="small"
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {memberData?.map((option, i) => (
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

export default CentralMemberSelect;
