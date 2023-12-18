
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */
import { Grid } from '@mui/material';
import axios from 'axios';
import CenMemberDetailsCorrection from 'components/coop/samity-management/member-details-correction/CenMemberDetailsCorrection';
import MemberDetailsCorrection from 'components/coop/samity-management/member-details-correction/MemberDetailsCorrection';
import NatMemberDetailsCorrection from 'components/coop/samity-management/member-details-correction/NatMemberDetailsCorrection';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import AllApprovedSamity from 'components/utils/coop/AllApprovedSamity';
import { decode } from 'js-base64';
import authentication from 'middleware/Authentication';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { ApproveSamityReportApi } from '../../../../url/coop/ApiList';

const Index = (props) => {
  const router = useRouter();
  const config = localStorageData('config');
  const [approvedSamityLevel, setApprovedSamityLevel] = useState(localStorageData('approvedSamityLevel'));
  const title =
    approvedSamityLevel == 'P'
      ? 'প্রাথমিক সমিতির সদস্যের তথ্য সংশোধন'
      : approvedSamityLevel == 'C'
        ? 'কেন্দ্রিয় সমিতির সদস্যের তথ্য সংশোধন'
        : approvedSamityLevel == 'N'
          ? 'জাতীয় সমিতির সদস্যের তথ্য সংশোধন'
          : 'সদস্যের তথ্য সংশোধন';
  const token = localStorageData('token');
  const userData = tokenData(token);
  const samityInfo = localStorageData('samityInfo');
  const [samityId, setSamityId] = useState(localStorageData('reportsIdPer'));
  const [selectedSamityId, setSelectedSamityId] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [getsamityInfo, setGetSamityInfo] = useState([]);

  useEffect(() => {
    !userData?.type == 'user' && userCheckMemberCorrection();
  }, []);

  useEffect(() => {
    editData(props?.query);
  }, [props?.query?.id]);

  useEffect(() => {
    getApprovedSamityInfo(samityId);
  }, [samityId]);

  const getApprovedSamityInfo = async (id) => {
    if (id) {
      const samityInfo = await axios.get(ApproveSamityReportApi + id, config);
      setGetSamityInfo(samityInfo?.data?.data?.samityInfo);
    }
  };

  const handleApproveSamity = (value) => {
    if (value) {
      localStorage.setItem('reportsIdPer', JSON.stringify(value.id));
      getApprovedSamityInfo(value.id);
      setSamityId(value.id);
      setSelectedSamityId(value.id);
      setApprovedSamityLevel(value.samityLevel);
    } else {
      setSamityId(null);
      setSelectedSamityId(null);
      setApprovedSamityLevel(null);
    }
  };

  const editData = (data) => {
    if (data?.samityId) {
      localStorage.setItem('reportsIdPer', JSON.stringify(decode(data.samityId)));
      setSamityId(parseInt(decode(data.samityId)));
      setSelectedSamityId(parseInt(decode(data.samityId)));
      setApprovedSamityLevel(decode(data.samityLevel));
      setIsDisabled(true);
    }
  };

  const userCheckMemberCorrection = () => {
    if (userData && samityInfo) {
      if (userData.type === 'citizen' && samityInfo.role === 'organizer' && samityInfo.flag === 'temp') {
        NotificationManager.error('সমিতির তথ্য সংশোধন করতে হলে আপনাকে নুন্যতম অনুমোদিত ব্যক্তি হতে হবে', '', 5000);
        router.push({ pathname: '/dashboard' });
      } else if (userData.type === 'citizen' && samityInfo.role === 'organizer' && samityInfo.flag === 'approved') {
        NotificationManager.error('সমিতির তথ্য সংশোধন করতে হলে আপনাকে নুন্যতম অনুমোদিত ব্যক্তি হতে হবে', '', 5000);
        router.push({ pathname: '/dashboard' });
      }
    } else {
      NotificationManager.warning('নিবন্ধিত কোন সমিতি পাওয়া যায়নি !', '', 5000);
      router.push({ pathname: '/dashboard' });
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Grid container className="section" spacing={2.5}>
            {userData?.type == 'user' && (
              <AllApprovedSamity
                {...{
                  labelName: 'সমিতির নাম',
                  name: 'approveSamityName',
                  onChange: handleApproveSamity,
                  value: JSON.stringify({
                    id: samityId,
                    samityLevel: approvedSamityLevel,
                  }),
                  xl: 4,
                  lg: 4,
                  md: 4,
                  sm: 12,
                  xs: 12,
                  isDisabled,
                  customClass: '',
                  customStyle: {},
                  selectedSamityId,
                }}
              />
            )}
          </Grid>
          {approvedSamityLevel == 'P' && <MemberDetailsCorrection {...{ samityPerId: samityId, getsamityInfo }} />}
          {approvedSamityLevel == 'C' && (
            <CenMemberDetailsCorrection samityPerId={samityId} samityLevel={approvedSamityLevel} />
          )}
          {approvedSamityLevel == 'N' && (
            <NatMemberDetailsCorrection samityPerId={samityId} samityLevel={approvedSamityLevel} />
          )}
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
