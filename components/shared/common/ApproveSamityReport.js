/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/20 05:00:00
 * @modify date 2023-02-27 11:55:01
 * @desc [description]
 */
import LanguageIcon from '@mui/icons-material/Language';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import Title from 'components/shared/others/Title';
import { useEffect, useState } from 'react';
import 'react-medium-image-zoom/dist/styles.css';
import ZoomImage from 'service/ZoomImage';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import { unescape } from 'underscore';
import { ApproveSamityReportApi } from '../../../url/coop/ApiList';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.grey,
//     color: theme.palette.common.black,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

const ApproveSamityReport = ({ approvedSamityId }) => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const config = localStorageData('config');
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  const [samityInfo, setSamityInfo] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [committeePerson, setCommitteePerson] = useState([]);
  const [incomeExpenses, setIncomeExpenses] = useState([]);
  const [totalExpAmt, setTotalExpAmt] = useState('');
  const [totalIncAmt, setTotalIncAmt] = useState('');
  const [membersData, setMembersData] = useState([]);
  const [samityDocuments, setSamityDocuments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [workingArea, setWorkingArea] = useState([]);
  const [memberArea, setMemberArea] = useState([]);
  const [element, setElement] = useState('');
  const [loadData, setLoadData] = useState(false);
  const budgetkey = Object.keys(budgets);
  const [samityLevel, setSamityLevel] = useState(null);

  useEffect(() => {
    samityReport(approvedSamityId);
  }, [approvedSamityId]);

  const samityReport = async (samityId) => {
    try {
      setLoadData(true);
      const samityData = await axios.get(ApproveSamityReportApi + samityId, config);
      const data = samityData.data.data;
      setSamityInfo(data.samityInfo);
      setSamityLevel(data.samityInfo.samityLevel);
      setCommittee(data.committee.committeeMembers);
      setCommitteePerson(data.committee);
      const memberAllData = data.members;
      let filterData = [...memberAllData];
      filterData.sort((a, b) => a.memberCode - b.memberCode);
      setMembersData(filterData);
      setSamityDocuments(data.samityDocuments);
      setBudgets(data.budgets);
      setIncomeExpenses(data.incomeExpenses);
      setWorkingArea(data.workingArea);
      setMemberArea(data.memberArea);
      setElement(data.byLaw);

      let expAmount = 0;
      for (let i = 0; data.incomeExpenses && i < data.incomeExpenses.length; i++) {
        expAmount += parseFloat(data.incomeExpenses[i].expAmt);
      }
      setTotalExpAmt(expAmount.toFixed(2));
      let incAmount = 0;
      for (let i = 0; data.incomeExpenses && i < data.incomeExpenses.length; i++) {
        incAmount += parseFloat(data.incomeExpenses[i].incAmt);
      }
      setTotalIncAmt(incAmount.toFixed(2));
      setLoadData(false);
    } catch (error) {
      errorHandler(error);
      setLoadData(false);
    }
  };
  const cenNatMemName = (memberId, samityLevel) => {
    let memberName = null;
    if (membersData && samityLevel == 'C') {
      memberName = membersData.find((elements) => elements.id == memberId)?.samitySignatoryPerson;
    } else {
      memberName = membersData.find((elements) => elements.id == memberId)?.samitySignatoryPerson;
    }
    return memberName;
  };
  const totalIncAmount = (inc) => {
    let incAmount = 0;
    for (let i = 0; inc && i < inc.length; i++) {
      incAmount += parseFloat(inc[i].incAmt);
    }
    return incAmount.toFixed(2);
  };
  const totalExpAmtmount = (inc) => {
    let expAmount = 0;
    for (let i = 0; inc && i < inc.length; i++) {
      expAmount += parseFloat(inc[i].expAmt);
    }
    return expAmount.toFixed(2);
  };
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  const onLink = () => {
    window.open('/coop/web-portal', '_blank');
  };

  return (
    <>
      {loadData ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            background: 'rgba(0,0,0,0.7)',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, 1%)',
            width: '80%',
            bgcolor: 'var(--color-bg)',
            boxShadow: 8,
            borderRadius: '1rem',
          }}
        >
          <div
            id="modal-modal-title"
            style={{
              textAlign: 'center',
              fontSize: '20px',
              background: 'var(--color-bg-topbar)',
              borderRadius: '1rem 1rem 0 0',
              padding: '1rem 0',
            }}
          >
            সমিতির বিস্তারিত তথ্য
          </div>

          <Grid
            container
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '1rem 1rem 0',
            }}
          >
            <Button className="btn btn-primary" startIcon={<LanguageIcon />} onClick={onLink}>
              ওয়েব সাইট
            </Button>
          </Grid>
          <Box sx={{ padding: '1.5rem 1rem 0' }}>
            <Grid
              item
              xs={12}
              sx={{
                boxShadow: '0 0 10px -5px rgba(0,0,0,0.4)',
                padding: '2rem',
                borderRadius: '.5rem',
                marginBottom: '2rem',
              }}
            >
              <Grid container spacing={2.5}>
                <Grid item md={6} xs={12}>
                  <div className="info">
                    <span className="label">সমিতির নাম :&nbsp;</span>
                    {samityInfo.samityName}{' '}
                    <b>
                      ({' '}
                      {samityInfo.samityLevel == 'P'
                        ? 'প্রাথমিক'
                        : samityInfo.samityLevel == 'C'
                          ? 'কেন্দ্রিয়'
                          : samityInfo.samityLevel == 'N'
                            ? 'জাতীয়'
                            : ''}{' '}
                      )
                    </b>
                  </div>
                  <div className="info">
                    <span className="label">সমিতি গঠনের তারিখ :&nbsp;</span>
                    {samityInfo.samityFormationDate &&
                      numberToWord('' + dateFormat(samityInfo.samityFormationDate) + '')}
                  </div>
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                  sx={{
                    paddingTop: { xs: '0 !important', md: '12px !important' },
                  }}
                >
                  <div className="info">
                    <span className="label">সমিতির ধরন :&nbsp;</span>
                    {samityInfo.samityTypeName}
                  </div>
                  {samityInfo.samityLevel == 'P' ? (
                    <div className="info">
                      <span className="label">প্রকল্পের নাম :&nbsp;</span>
                      {samityInfo.projectNameBangla}
                    </div>
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                  <div className="info">
                    <span className="label">সমিতির ঠিকানা :&nbsp;</span>
                    {samityInfo.samityDetailsAddress}, {samityInfo.uniThanaPawNameBangla},&nbsp;
                    {samityInfo.upaCityNameBangla}, {samityInfo.officeDistrictNameBangla}
                    ,&nbsp;
                    {samityInfo.officeDivisionNameBangla}
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid container className="section">
              <Grid item xs={12}>
                <SubHeading>সমিতির এলাকা</SubHeading>
                <Grid container>
                  <TableContainer className="table-container">
                    <Table sx={{ minWidth: 700 }} size="small" aria-label="a dense table">
                      <TableHead className="table-head">
                        <TableRow>
                          <TableCell>বিবরণ</TableCell>
                          <TableCell>বিভাগ</TableCell>
                          <TableCell>জেলা</TableCell>
                          <TableCell>উপজেলা/সিটি কর্পোরেশন</TableCell>
                          <TableCell>ইউানয়ন/পৌরসভা/ওয়ার্ড</TableCell>
                          <TableCell>গ্রাম/মহল্লা</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* member select area  */}
                        {memberArea?.map((member, i) => (
                          <TableRow key={i}>
                            <TableCell component="th" scope="row">
                              সদস্য নির্বাচনী এলাকা
                            </TableCell>
                            <TableCell>{member.divisionNameBangla}</TableCell>
                            <TableCell>{member.districtNameBangla}</TableCell>
                            <TableCell>{member.upaCityNameBangla}</TableCell>
                            <TableCell>{member.uniThanaPawNameBangla}</TableCell>
                            <TableCell>{member.detailsAddress}</TableCell>
                          </TableRow>
                        ))}
                        {workingArea?.map((working) => (
                          <TableRow key={working.divisionName}>
                            <TableCell component="th" scope="row">
                              কর্ম এলাকা
                            </TableCell>
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

            {samityInfo?.isManual ? (
              ''
            ) : (
              <Grid container className="section">
                <SubHeading>সমিতির তথ্য</SubHeading>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    boxShadow: '0 0 10px -5px rgba(0,0,0,0.4)',
                    padding: '1.5rem',
                    borderRadius: '.5rem',
                    margin: '0',
                  }}
                >
                  <Grid item md={4} xs={12}>
                    <span className="label">সদস্যের ভর্তি ফি :&nbsp;</span>
                    {samityInfo.memberAdmissionFee ? numberToWord('' + samityInfo.memberAdmissionFee + '') : '০'}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">শেয়ার সংখ্যা :&nbsp;</span>
                    {samityInfo.noOfShare ? numberToWord('' + samityInfo.noOfShare + '') : '০'}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">বিক্রিত শেয়ার সংখ্যা :&nbsp;</span>
                    {samityInfo.soldShare ? numberToWord('' + samityInfo.soldShare + '') : '০'}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">প্রতিটি শেয়ার মূল্য :&nbsp;</span>
                    {numberToWord('' + samityInfo.sharePrice + '')}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">বিক্রিত শেয়ার মূলধন :&nbsp;</span>
                    {numberToWord('' + samityInfo.noOfShare * samityInfo.soldShare + '')}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">প্রস্তাবিত শেয়ার মূলধন :&nbsp;</span>
                    {numberToWord('' + samityInfo.noOfShare * samityInfo.sharePrice + '')}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label"> ফোন নং:&nbsp;</span>
                    {numberToWord('' + samityInfo.phone + '')}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">ওয়েব সাইট :&nbsp;</span>
                    {samityInfo.website}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">মোবাইল নং :&nbsp;</span>
                    {numberToWord('' + samityInfo.mobile + '')}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">উদ্যোগী সংস্থার নাম :&nbsp;</span>
                    {samityInfo.orgNameBangla}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <span className="label">ই - মেইল :&nbsp;</span>
                    {samityInfo.email}
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid container className="section">
              <Grid item lg={12} md={12} xs={12}>
                <SubHeading>সদস্যের তালিকা</SubHeading>

                <Grid container>
                  {samityInfo.samityLevel == 'P' ? (
                    <TableContainer className="table-container lg-table">
                      <Table size="small" aria-label="a dense table">
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell align="center">সদস্য কোড</TableCell>
                            <TableCell>এনআইডি/জন্ম নিবন্ধন</TableCell>
                            <TableCell align="center">জন্মতারিখ</TableCell>
                            <TableCell>নাম</TableCell>
                            <TableCell>পেশা</TableCell>
                            <TableCell align="center">মোবাইল নম্বর</TableCell>
                            {samityInfo?.isManual ? (
                              ''
                            ) : (
                              <>
                                <TableCell>শেয়ার</TableCell>
                                <TableCell align="right">সঞ্চয় (টাকা)</TableCell>
                                <TableCell align="right">ঋণ (টাকা)</TableCell>
                              </>
                            )}

                            <TableCell>ঠিকানা</TableCell>
                            <TableCell align="center">সংযুক্তি</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {membersData != undefined
                            ? membersData.map((memb, i) => (
                              <TableRow key={i}>
                                <TableCell align="center">{numberToWord('' + memb.memberCode + '')}</TableCell>
                                <TableCell>
                                  <Tooltip
                                    title={
                                      <div className="tooltip-title">
                                        {memb.nid
                                          ? numberToWord('' + memb.nid + '')
                                          : memb.brn
                                            ? numberToWord('' + memb.brn + '')
                                            : ''}
                                      </div>
                                    }
                                  >
                                    <span className="data">
                                      {memb.nid
                                        ? numberToWord('' + memb.nid + '')
                                        : memb.brn
                                          ? numberToWord('' + memb.brn + '')
                                          : ''}
                                    </span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                  {memb.dob ? numberToWord('' + dateFormat(memb.dob) + '') : ''}
                                </TableCell>
                                <TableCell>
                                  <Tooltip title={<div className="tooltip-title">{memb.memberNameBangla}</div>}>
                                    <span className="data">{memb.memberNameBangla}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Tooltip title={<div className="tooltip-title">{memb.occupationName}</div>}>
                                    <span className="data">{memb.occupationName}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Tooltip
                                    title={<div className="tooltip-title">{numberToWord('' + memb.mobile + '')}</div>}
                                  >
                                    <span className="data">{numberToWord('' + memb.mobile + '')}</span>
                                  </Tooltip>
                                </TableCell>
                                {samityInfo?.isManual ? (
                                  ''
                                ) : (
                                  <>
                                    <TableCell align="center">{numberToWord('' + memb.noOfShare + '')}</TableCell>
                                    <TableCell align="right">{numberToWord('' + memb.savingsAmount + '')}</TableCell>
                                    <TableCell>{numberToWord('' + memb.loanOutstanding + '')}</TableCell>
                                  </>
                                )}

                                <TableCell>
                                  <Tooltip
                                    title={
                                      <div className="tooltip-title">
                                        {memb?.address[0]?.detailsAddress
                                          ? memb?.address[0]?.detailsAddress + ','
                                          : ''}{' '}
                                        {memb?.address[0]?.uniThanaPawNameBangla},
                                        {memb?.address[0]?.upaCityNameBangla}, {memb?.districtNameBangla}
                                      </div>
                                    }
                                  >
                                    <span className="data">
                                      {memb?.address[0]?.detailsAddress ? memb?.address[0]?.detailsAddress + ',' : ''}{' '}
                                      {memb?.address[0]?.uniThanaPawNameBangla},{memb?.address[0]?.upaCityNameBangla},{' '}
                                      {memb?.districtNameBangla}
                                    </span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {memb.documents?.map((img) => (
                                    <ZoomImage
                                      src={img?.fileNameUrl}
                                      imageStyle={{
                                        width: '30px',
                                        height: '30px',
                                      }}
                                      divStyle={{
                                        display: 'flex',
                                        float: 'left',
                                        border: '1px solid gray',
                                        margin: '1px',
                                      }}
                                      key={img?.fileNameUrl}
                                      type={imageType(img?.fileName)}
                                    />
                                  ))}
                                </TableCell>
                              </TableRow>
                            ))
                            : ''}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    ''
                  )}
                  {samityInfo.samityLevel == 'C' || samityInfo.samityLevel == 'N' ? (
                    <TableContainer className="table-container">
                      <Table size="small" aria-label="a dense table">
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell align="center">ক্রমিক নং</TableCell>
                            <TableCell>সদস্যের নাম</TableCell>
                            <TableCell align="center">সদস্য / সমিতি কোড</TableCell>
                            <TableCell>স্বাক্ষরিত ব্যক্তি</TableCell>
                            <TableCell align="center">মোবাইল নম্বর</TableCell>
                            <TableCell>ঠিকানা</TableCell>
                            <TableCell align="center">সংযুক্তিসমূহ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {membersData != undefined
                            ? membersData.map((memb, i) => (
                              <TableRow key={i}>
                                <TableCell scope="row" align="center">
                                  {' '}
                                  {numberToWord('' + (i + 1) + '')}{' '}
                                </TableCell>
                                <TableCell>
                                  <Title title={<div className="tooltip-title">{memb.memberName}</div>} arrow>
                                    <span className="data">{memb.memberName}</span>
                                  </Title>
                                </TableCell>
                                <TableCell align="center">
                                  <Title
                                    title={
                                      <div className="tooltip-title">
                                        {memb.memberCode
                                          ? numberToWord('' + memb.memberCode + '')
                                          : numberToWord('' + memb.centralSamityCode + '')}
                                      </div>
                                    }
                                    arrow
                                  >
                                    <span className="data">
                                      {memb.memberCode
                                        ? numberToWord('' + memb.memberCode + '')
                                        : numberToWord('' + memb.centralSamityCode + '')}
                                    </span>
                                  </Title>
                                </TableCell>
                                <TableCell>
                                  <Title
                                    title={
                                      <div className="tooltip-title">
                                        {memb.samitySignatoryPerson || memb.signatoryPersonNameBangla}
                                      </div>
                                    }
                                    arrow
                                  >
                                    <span className="data">
                                      {memb.samitySignatoryPerson || memb.signatoryPersonNameBangla}
                                    </span>
                                  </Title>
                                </TableCell>
                                <TableCell align="center">
                                  <Title
                                    title={<div className="tooltip-title">{numberToWord('' + memb.phone + '')}</div>}
                                    arrow
                                  >
                                    <span className="data">{numberToWord('' + memb.phone + '')}</span>
                                  </Title>
                                </TableCell>
                                <TableCell>
                                  <Title
                                    title={
                                      <div className="tooltip-title">
                                        {memb.samityDetailsAddress || memb.centralSamityDetailsAddress}
                                      </div>
                                    }
                                    arrow
                                  >
                                    <span className="data">
                                      {memb.samityDetailsAddress || memb.centralSamityDetailsAddress}
                                    </span>
                                  </Title>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {memb.documents.map((img) => (
                                    <ZoomImage
                                      src={img?.fileNameUrl}
                                      imageStyle={{
                                        width: '30px',
                                        height: '30px',
                                      }}
                                      divStyle={{
                                        display: 'flex',
                                        border: '1px solid gray',
                                        margin: '1px',
                                        justifyContent: 'center',
                                      }}
                                      key={img?.fileNameUrl}
                                      type={imageType(img?.fileName)}
                                    />
                                  ))}
                                </TableCell>
                              </TableRow>
                            ))
                            : ''}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid container className="section">
              <Grid item xs={12}>
                <SubHeading>কমিটির পদ বরাদ্দকরন</SubHeading>
                <Grid
                  container
                  sx={{
                    boxShadow: '0 0 10px -5px rgba(0,0,0,0.4)',
                    padding: '1.5rem',
                    borderRadius: '.5rem',
                    margin: '0 0 1rem 0',
                  }}
                >
                  {committeePerson?.committeeOrganizer ? (
                    <Grid item lg={4} md={6} xs={12}>
                      <span className="label">সংগঠক :&nbsp;</span>
                      {committeePerson?.committeeOrganizer}
                    </Grid>
                  ) : (
                    ''
                  )}
                  {committeePerson.committeeContactPerson ? (
                    <Grid item lg={4} md={6} xs={12}>
                      <span className="label">যোগাযোগের ব্যক্তি :&nbsp;</span>
                      {committeePerson?.committeeContactPerson}
                    </Grid>
                  ) : (
                    ''
                  )}
                  {committeePerson.committeeSignatoryPerson ? (
                    <Grid item lg={4} md={6} xs={12}>
                      <span className="label">স্বাক্ষরিত ব্যক্তি :&nbsp;</span>
                      {committeePerson?.committeeSignatoryPerson}
                    </Grid>
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid container>
                  <TableContainer className="table-container">
                    <Table size="small" aria-label="a dense table">
                      <TableHead className="table-head">
                        <TableRow>
                          <TableCell align="center">ক্রমিক নং</TableCell>
                          <TableCell>
                            সদস্যের নাম {samityLevel == 'C' || samityLevel == 'N' ? 'ও স্বাক্ষরিত ব্যক্তি' : ''}
                          </TableCell>
                          <TableCell>পদবী</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {committee?.map((degs, i) => (
                          <TableRow key={i}>
                            <TableCell scope="row" align="center">
                              {numberToWord('' + (i + 1) + '')}
                            </TableCell>
                            <TableCell>
                              {' '}
                              {degs?.memberNameBangla || degs?.memberName}{' '}
                              {samityLevel == 'C' || samityLevel == 'N'
                                ? '- ( ' + cenNatMemName(degs?.memberId, samityLevel) + ' )'
                                : ''}
                            </TableCell>
                            <TableCell>{degs?.roleName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container className="section">
                <SubHeading>ডকুমেন্টের তথ্য</SubHeading>
                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell align="center"> ক্রমিক নং</TableCell>
                        <TableCell>নাম</TableCell>
                        <TableCell>রেফারেন্স নং</TableCell>
                        <TableCell align="center">মেয়াদ শুরুর তারিখ</TableCell>
                        <TableCell align="center">মেয়াদ উত্তীর্ণের তারিখ</TableCell>
                        <TableCell align="center">ছবি</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {samityDocuments?.map((row, i) => (
                        <TableRow key={row.id}>
                          <TableCell scope="row" sx={{ textAlign: 'center' }}>
                            {numberToWord('' + (i + 1) + '')}
                          </TableCell>
                          <TableCell>{row.documentTypeDesc}</TableCell>
                          <TableCell>{row.documentNo ? numberToWord('' + row.documentNo + '') : ''}</TableCell>
                          <TableCell align="center">
                            {row.effectDate ? numberToWord(dateFormat(row.effectDate)) : ''}
                          </TableCell>
                          <TableCell align="center">
                            {row.expireDate ? numberToWord(dateFormat(row.expireDate)) : ''}
                          </TableCell>
                          <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ZoomImage
                              src={row.documentNameUrl}
                              imageStyle={{ width: '30px', height: '30px' }}
                              divStyle={{
                                display: 'flex',
                                float: 'left',
                                border: '1px solid gray',
                                margin: '1px',
                              }}
                              key={row.documentNameUrl}
                              type={imageType(row.documentName)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            {samityInfo?.isManual ? (
              ''
            ) : (
              <Grid container className="section">
                <Grid item xs={12}>
                  <SubHeading>সমিতির জমা খরচের হিসাব</SubHeading>
                  <Grid container spacing={1}>
                    <Grid item lg={6} md={12} xs={12}>
                      <TableContainer className="table-container">
                        <Table size="small" aria-label="a dense table">
                          <TableHead className="table-head">
                            <TableRow>
                              <TableCell colSpan={3} className="table-title">
                                জমা
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>লেজার / হিসাবের আইডি</TableCell>
                              <TableCell>লেজার / হিসাবের নাম</TableCell>
                              <TableCell align="right">টাকা</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {incomeExpenses.map(
                              (incexps, i) =>
                                incexps.incAmt != 0 && (
                                  <TableRow key={i}>
                                    <TableCell>
                                      {incexps.incAmt != 0 && numberToWord('' + incexps.glacCode + '')}
                                    </TableCell>
                                    <TableCell>{incexps.incAmt != 0 && incexps.glacName}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                      {incexps.incAmt != 0 && numberToWord('' + incexps.incAmt + '')}
                                    </TableCell>
                                  </TableRow>
                                ),
                            )}
                            {/* total amount  */}
                            <TableRow>
                              <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                মোট
                              </TableCell>
                              <TableCell sx={{ textAlign: 'right' }}>{numberToWord('' + totalIncAmt + '')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                আগত তহবিল
                              </TableCell>
                              <TableCell sx={{ textAlign: 'right' }}>{numberToWord('' + '0.00' + '')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                সর্বমোট
                              </TableCell>
                              <TableCell sx={{ textAlign: 'right' }}>{numberToWord('' + totalIncAmt + '')}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item lg={6} md={12} xs={12}>
                      <TableContainer className="table-container">
                        <Table size="small" aria-label="a dense table">
                          <TableHead className="table-head">
                            <TableRow>
                              <TableCell colSpan={3} className="table-title">
                                খরচ
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>লেজার / হিসাবের আইডি</TableCell>
                              <TableCell>লেজার / হিসাবের নাম</TableCell>
                              <TableCell align="right">টাকা</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {incomeExpenses.map(
                              (incexps, i) =>
                                incexps.expAmt != 0 && (
                                  <TableRow key={i}>
                                    <TableCell>
                                      {incexps.expAmt != 0 && numberToWord('' + incexps.glacCode + '')}
                                    </TableCell>
                                    <TableCell>{incexps.expAmt != 0 && incexps.glacName}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                      {incexps.expAmt != 0 && numberToWord('' + incexps.expAmt + '')}
                                    </TableCell>
                                  </TableRow>
                                ),
                            )}
                            {/* total amount  */}
                            <TableRow>
                              <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                মোট
                              </TableCell>
                              <TableCell sx={{ textAlign: 'right' }}>{numberToWord('' + totalExpAmt + '')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                মজুদ তহবিল
                              </TableCell>
                              <TableCell sx={{ textAlign: 'right' }}>
                                {numberToWord('' + (totalIncAmt - totalExpAmt).toFixed(2) + '')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                সর্বমোট
                              </TableCell>
                              <TableCell sx={{ textAlign: 'right' }}>{numberToWord('' + totalIncAmt + '')}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {samityInfo?.isManual
              ? ''
              : budgetkey.map((key, i) => (
                <Grid key={i} container>
                  <Grid item xs={12}>
                    <SubHeading>
                      সমিতির বাজেট হিসাব &nbsp;&nbsp;
                      {key.toString()
                        ? numberToWord('' + key.substring(0, 4) + '') +
                        '-' +
                        numberToWord('' + key.substring(4, 8) + '')
                        : ''}
                    </SubHeading>
                    <Grid container spacing={1} className="section">
                      <Grid item lg={6} xs={12}>
                        <TableContainer className="table-container">
                          <Table size="small" aria-label="a dense table">
                            <TableHead className="table-head">
                              <TableRow>
                                <TableCell colSpan={3} className="table-title">
                                  আয়
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>লেজার / হিসাবের আইডি</TableCell>
                                <TableCell>লেজার / হিসাবের নাম</TableCell>
                                <TableCell align="right">টাকা</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {budgets[key].map(
                                (incexps, i) =>
                                  incexps.incAmt != 0 && (
                                    <TableRow key={i}>
                                      <TableCell>
                                        {incexps.incAmt != 0 && numberToWord('' + incexps.glacCode + '')}
                                      </TableCell>
                                      <TableCell>{incexps.incAmt != 0 && incexps.glacName}</TableCell>
                                      <TableCell sx={{ textAlign: 'right' }}>
                                        {incexps.incAmt != 0 && numberToWord('' + incexps.incAmt + '')}
                                      </TableCell>
                                    </TableRow>
                                  ),
                              )}
                              {/* total amount  */}

                              <TableRow>
                                <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                  সর্বমোট
                                </TableCell>
                                <TableCell sx={{ borderRight: 1, textAlign: 'right' }}>
                                  {numberToWord('' + totalIncAmount(budgets[key]) + '')}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <TableContainer className="table-container">
                          <Table size="small" aria-label="a dense table">
                            <TableHead className="table-head">
                              <TableRow>
                                <TableCell colSpan={3} className="table-title">
                                  ব্যয়
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>লেজার / হিসাবের আইডি</TableCell>
                                <TableCell>লেজার / হিসাবের নাম</TableCell>
                                <TableCell align="right">টাকা</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {budgets[key].map(
                                (incexps, i) =>
                                  incexps.expAmt != 0 && (
                                    <TableRow key={i}>
                                      <TableCell>
                                        {incexps.expAmt != 0 && numberToWord('' + incexps.glacCode + '')}
                                      </TableCell>
                                      <TableCell>{incexps.expAmt != 0 && incexps.glacName}</TableCell>
                                      <TableCell sx={{ textAlign: 'right' }}>
                                        {incexps.expAmt != 0 && numberToWord('' + incexps.expAmt + '')}
                                      </TableCell>
                                    </TableRow>
                                  ),
                              )}
                              {/* total amount  */}
                              <TableRow>
                                <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                                  সর্বমোট
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                  {numberToWord('' + totalExpAmtmount(budgets[key]) + '')}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            {/* ========================================================== */}
          </Box>

          {/* ========================================================== */}
          {samityInfo?.isManual ? (
            ''
          ) : (
            <Grid container className="section" sx={{ padding: '0 1rem' }}>
              <Grid item xs={12}>
                <SubHeading>লক্ষ্য ও উদ্দেশ্য</SubHeading>
                <Grid container px={3}>
                  <div dangerouslySetInnerHTML={{ __html: unescape(element) }}></div>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};

export default ApproveSamityReport;
