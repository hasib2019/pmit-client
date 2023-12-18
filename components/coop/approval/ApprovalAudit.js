/**
 * @author2 Md Saifur Rahman
 * @email saifur1985bd@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Grid } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { applicationGetById } from '../../../url/coop/ApiList';

const ApprovalAudit = (props) => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  // const [auditInfos, setAuditInfos] = useState([]);

  useEffect(() => {
    samityReport(props.id);
    // auditInfo(props.id);
  }, []);

  const samityReport = async (id) => {
    const samityData = await axios.get(applicationGetById + id, config);
    const data = samityData?.data?.data[0]?.data;
    setSamityInfo(data?.samityInfo);
  };

  // const auditInfo = async (id) => {
  //   const auditData = await axios.get(auditInfoById + id, config);
  //   const data = auditData?.data?.data;
  //   setAuditInfos(data);
  // };

  return (
    <>
      <Grid item xs={12} className="approve-info">
        <Grid container>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নাম :&nbsp;</span>
              {samityInfo?.samityName}
            </div>
            <div className="info">
              <span className="label">সমিতির ধরন :&nbsp;</span>{' '}
              {samityInfo?.samityLevel == 'P'
                ? ' প্রাথমিক সমিতি'
                : samityInfo?.samityLevel == 'C'
                ? ' কেন্দ্রীয় সমিতি'
                : samityInfo?.samityLevel == 'N'
                ? ' জাতীয় সমিতি'
                : ''}
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নিবন্ধনের তারিখ :&nbsp;</span>{' '}
              {samityInfo?.samityRegistrationDate && numberToWord('' + samityInfo?.samityRegistrationDate + '')}
            </div>
            <div className="info">
              <span className="label">সমিতির নিবন্ধন নম্বর :&nbsp;</span>{' '}
              {samityInfo?.samityCode && numberToWord('' + samityInfo?.samityCode + '')}
            </div>
          </Grid>
        </Grid>
      </Grid>

      {/* {auditInfos ?
        <>
          <Grid item xs={12} className="approve-info">
            <Grid container>
              <Grid item md={4} xs={12}>
                <div className="info">
                  <span className="label">আয় :&nbsp;</span>
                  {numberToWord("" + auditInfos?.income + "")} টাকা
                </div>
              </Grid>
              <Grid item md={4} xs={12}>
                <div className="info">
                  <span className="label">ব্যয় :&nbsp;</span>{" "}
                  {numberToWord("" + auditInfos?.expense + "")} টাকা
                </div>
              </Grid>
              <Grid item md={4} xs={12}>
                <div className="info">
                  <span className="label">লাভ/ক্ষতি পরিমান :&nbsp;</span>{" "}
                  {numberToWord("" + auditInfos?.profit_loss + "")} টাকা
                </div>
              </Grid>
              <Grid item md={4} xs={12}>
                <div className="info">
                  <span className="label">অডিট ফি :&nbsp;</span>{" "}
                  {numberToWord("" + auditInfos?.audit_fee + "")} টাকা
                </div>
              </Grid>
              <Grid item md={4} xs={12}>
                <div className="info">
                  <span className="label">সিডিএফ ফি :&nbsp;</span>{" "}
                  {numberToWord("" + auditInfos?.cdf_fee + "")} টাকা
                </div>
              </Grid>
            </Grid>
          </Grid>
        </>
        : ""} */}
    </>
  );
};

export default ApprovalAudit;
