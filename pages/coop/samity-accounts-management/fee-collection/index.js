/**
 * @author Md Saifur Rahman
 * @email saifur1985bd@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import FeeCollection from 'components/coop/samity-accounts-management/audit-accounts-information/FeeCollection';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import RequiredFile from 'components/utils/RequiredFile';
import GetAuditSamity from 'components/utils/coop/GetAuditSamity';
import authentication from 'middleware/Authentication';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { serviceRules } from '../../../../url/coop/ApiList';

const Index = () => {
  const router = useRouter();
  const title = 'ফি প্রদানের আবেদন';
  const userData = tokenData();
  const samityInfo = localStorageData('samityInfo');
  const config = localStorageData('config');
  const [samityId, setSamityId] = useState('');
  const [approvedSamityLevel, setApprovedSamityLevel] = useState(localStorageData('approvedSamityLevel'));
  const [selectedSamityId, setSelectedSamityId] = useState();
  const [isDisabled] = useState(false);
  const [documentType, setDocumentType] = useState([]);
  const [docTypeName, setDocTypeName] = useState('');
  const [auditFee, setAuditFee] = useState([]);
  const [cdfFee, setCdfFee] = useState([]);
  const [feeTypes, setFeeTypes] = useState('');

  const handleApproveSamity = (value) => {
    if (value) {
      setSamityId(value.id);
      setSelectedSamityId(value.id);
      setApprovedSamityLevel(value.samityLevel);
    } else {
      setSamityId();
      setSelectedSamityId();
      setApprovedSamityLevel();
    }
  };

  useEffect(() => {
    if (userData?.type === 'citizen') {
      if (samityInfo?.role === 'authorizer' && samityInfo?.flag === 'approved') {
        setSamityId(samityInfo?.id);
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
  }, [samityInfo, userData]);

  useEffect(() => {
    serviceInfo();
  }, []);

  const serviceInfo = async () => {
    const serviceNameData = await axios.get(serviceRules + 15, config);
    setDocumentType(serviceNameData.data.data[0].serviceRules.documents);
    setAuditFee(serviceNameData.data.data[0].serviceRules.auditFeeRate);
    setCdfFee(serviceNameData.data.data[0].serviceRules.cdfFeeRate);
  };

  const docTrueType = documentType.filter((doc) => doc.isDocument === true);

  const docFalseType = documentType.filter((doc) => doc.isDocument === false);

  const handleChange = async (e) => {
    setFeeTypes(e.target.value);
    const docT = docFalseType.find((elm) => elm.docId == e.target.value);
    setDocTypeName(docT.docTypeDesc);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Grid container className="section" spacing={2.5}>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <TextField
                fullWidth
                label={RequiredFile('ফি এর ধরন')}
                name="feeType"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={feeTypes || 0}
                variant="outlined"
                size="small"
              >
                <option value={0}>- নির্বাচন করুন -</option>
                {docFalseType?.map((option, i) => (
                  // option.isDocument === false &&
                  <option key={i} value={option?.docId}>
                    {option?.docTypeDesc}
                  </option>
                ))}
              </TextField>
            </Grid>
            {userData?.type == 'user' && (
              <GetAuditSamity
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
          {samityId && approvedSamityLevel && feeTypes && (
            <FeeCollection
              {...{
                samityId,
                approvedSamityLevel,
                feeTypes,
                documentTrueList: docTrueType,
                docTypeName,
                auditFeeList: auditFee,
                cdfFeeList: cdfFee,
                isApproval: false,
              }}
            />
          )}
        </PaperFormsLayout>
      </InnerLanding>
    </>
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
