/* eslint-disable react/no-unknown-property */

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import ZoomImage from 'service/ZoomImage';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { numberToWord } from 'service/numberToWord';
import { applicationGetById } from '../../../url/coop/ApiList';

const ApprovalManualSamityCorrection = (props) => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [authorized, setAuthorized] = useState([]);
  // const [committeePerson, setCommitteePerson] = useState([]);
  // const [budgets, setBudgets] = useState([]);
  const [workingArea, setWorkingArea] = useState([]);
  const [memberArea, setMemberArea] = useState([]);
  // const [element, setElement] = useState('');
  // const budgetkey = Object.keys(budgets);

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    samityReport(props.id);
  }, []);

  const samityReport = async (samityId) => {
    const samityData = await axios.get(applicationGetById + samityId, config);
    const data = samityData.data.data[0].data;
    console.log({ data });
    setSamityInfo(data?.samityInfo);
    // setCommitteePerson(data?.committeeRegistration);
    setAuthorized(data?.memberInfo);
    setWorkingArea(data?.workingArea);
    setMemberArea(data?.memberArea);
    // setElement(data?.byLaw);
    setDocuments(data?.documentInfo);
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    } else imageName

  };
  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          boxShadow: '0 0 10px -5px rgba(0,0,0,0.5)',
          borderRadius: '10px',
          padding: '1rem',
          margin: '1rem 0 2rem',
        }}
      >
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নাম :&nbsp;</span>
              {samityInfo.samityName}
            </div>
            <div className="info">
              <span className="label">সমিতির ধরন :&nbsp;</span> {samityInfo.samityTypeName}
            </div>
            <div className="info">
              <span className="label">প্রকল্পের নাম :&nbsp;</span>
              {samityInfo.projectNameBangla}
            </div>
            <div className="info">
              <span className="label">অথরাইজড পারসন :&nbsp;</span>
              {authorized.memberNameBangla}
            </div>
            <div className="info">
              <span className="label">মোবাইল নং :&nbsp;</span>
              {authorized.mobile && numberToWord('' + authorized.mobile + '')}
            </div>
          </Grid>
          <Grid item md={6} xs={12} sx={{ paddingTop: { xs: '0 !important', md: '12px !important' } }}>
            <div className="info">
              <span className="label">সমিতির মূল ‍নিবন্ধন নাম্বার :&nbsp;</span>
              {samityInfo.oldRegistrationNo}
            </div>
            <div className="info">
              <span className="label">সমিতি গঠনের তারিখ :&nbsp;</span>
              {samityInfo.samityFormationDate && numberToWord('' + dateFormat(samityInfo?.samityFormationDate) + '')}
            </div>
            <div className="info">
              <span className="label">সমিতির নিবন্ধন তারিখ :&nbsp;</span>
              {samityInfo.samityRegistrationDate && numberToWord('' + dateFormat(samityInfo?.samityRegistrationDate) + '')}
            </div>
            <div className="info">
              <span className="label">জাতীয় পরিচয়পত্র :&nbsp;</span>
              {authorized.nid && numberToWord('' + authorized.nid + '')}
            </div>
          </Grid>

          <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
            <div className="info">
              <span className="label">সমিতির ঠিকানা :&nbsp;</span>
              {samityInfo.samityDetailsAddress}, {samityInfo.samityUniThanaPawNameBangla},&nbsp;
              {samityInfo.samityUpaCityNameBangla}, {samityInfo.samityDistrictNameBangla},&nbsp;
              {samityInfo.samityDivisionNameBangla}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <SubHeading>সমিতির এলাকা</SubHeading>
          <Grid container>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>বিবরন</TableCell>
                    <TableCell>বিভাগ</TableCell>
                    <TableCell>জেলা</TableCell>
                    <TableCell>উপজেলা/সিটি কর্পোরেশন</TableCell>
                    <TableCell>ইউানয়ন/পৌরসভা/ওয়ার্ড</TableCell>
                    <TableCell>গ্রাম/মহল্লা</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* member select area  */}
                  <TableRow>
                    <TableCell scope="row" rowSpan={memberArea.length + 1}>
                      সদস্য নির্বাচনী এলাকা
                    </TableCell>
                  </TableRow>
                  {memberArea?.map((member, i) => (
                    <TableRow key={i}>
                      <TableCell>{member.divisionNameBangla}</TableCell>
                      <TableCell>{member.districtNameBangla}</TableCell>
                      <TableCell>{member.upaCityNameBangla}</TableCell>
                      <TableCell>{member.uniThanaPawNameBangla}</TableCell>
                      <TableCell>{member.detailsAddress}</TableCell>
                    </TableRow>
                  ))}
                  {/* member select area  */}
                  <TableRow sx={{ background: 'var(--color-white)' }}>
                    <TableCell scope="row" rowSpan={workingArea.length + 1}>
                      কর্ম এলাকা
                    </TableCell>
                  </TableRow>
                  {workingArea?.map((working, i) => (
                    <TableRow key={i} sx={{ background: 'var(--color-white)' }}>
                      <TableCell>{working.divisionNameBangla}</TableCell>
                      <TableCell>{working.districtNameBangla}</TableCell>
                      <TableCell>{working.upaCityNameBangla}</TableCell>
                      <TableCell>{working.uniThanaPawNameBangla}</TableCell>
                      <TableCell>{working.detailsAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <SubHeading>সমিতির ডকুমেন্ট</SubHeading>
          <Grid container>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>ক্রমিক</TableCell>
                    <TableCell>ডকুমেন্টের নাম</TableCell>
                    <TableCell>ডকুমেন্টের নাম্বার</TableCell>
                    <TableCell align="center">ডকুমেন্ট / ছবি</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents?.map((img, i) => (
                    <TableRow key={i}>
                      <TableCell scope="row">&nbsp;&nbsp; {numberToWord('' + (i + 1) + '')}</TableCell>
                      <TableCell>&nbsp;{img?.documentNameBangla}</TableCell>
                      <TableCell>&nbsp;&nbsp;{img?.documentNo}</TableCell>
                      <TableCell align="cnter">
                        <ZoomImage
                          src={img?.documentName[0]?.fileNameUrl}
                          imageStyle={{ width: '40px', height: '40px' }}
                          divStyle={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                          key={img?.documentNo}
                          type={imageType(img?.documentName[0]?.fileName)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ApprovalManualSamityCorrection;
