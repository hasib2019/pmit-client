/* eslint-disable no-unused-vars */
/**
 * @author Md Md. Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023/07/20 04:31:48 PM
 * @modify date 2023-07-20
 * @desc [description]
 */

import { Grid } from '@mui/material';
import AllApprovedSamity from 'components/utils/coop/AllApprovedSamity';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';

const SelectManualSamity = ({ samityId, setSamityId, samityLevel, setSamityLevel }) => {
  const router = useRouter();
  const userData = tokenData();
  const samityInfo = localStorageData('samityInfo');
  const [selectedSamityId, setSelectedSamityId] = useState();
  const [isDisabled] = useState(false);

  const handleApproveSamity = (value) => {
    if (value) {
      setSamityId(value.id);
      setSelectedSamityId(value.id);
      setSamityLevel(value.samityLevel);
    } else {
      setSamityId();
      setSelectedSamityId();
      setSamityLevel();
    }
  };

  useEffect(() => {
    if (userData?.type === 'citizen') {
      if (samityInfo?.role === 'authorizer' && samityInfo?.flag === 'approved') {
        setSamityId(samityInfo?.id);
        setSamityLevel(samityInfo?.samityLevel);
      } else {
        NotificationManager.warning(
          samityInfo?.flag === 'temp'
            ? 'সমিতিটি প্রক্রিয়াধীন রয়েছে!'
            : 'সমিতির হিসাবের তথ্য সংশোধন করতে হলে আপনাকে নুন্যতম অনুমোদিত ব্যক্তি হতে হবে',
          '',
          5000,
        );
        router.back();
      }
    }
  }, [samityInfo, userData, router, setSamityLevel, setSamityId]);
  return (
    <Fragment>
      <Grid container className="section" spacing={2.5}>
        {userData?.type == 'user' && (
          <AllApprovedSamity
            {...{
              labelName: 'সমিতির নাম',
              name: 'approveSamityName',
              onChange: handleApproveSamity,
              xl: 4,
              lg: 4,
              md: 4,
              sm: 12,
              xs: 12,
              isDisabled,
              customClass: '',
              customStyle: {},
              selectedSamityId,
              isManual:true
            }}
          />
        )}
      </Grid>
      {samityId && (
        <div
          style={{
            borderBottom: '1px solid #f1f1f1',
            marginBottom: '10px',
            marginTop: '-15px',
          }}
        ></div>
      )}
    </Fragment>
  );
};

export default SelectManualSamity;
