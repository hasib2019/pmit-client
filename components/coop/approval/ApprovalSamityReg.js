/* eslint-disable @next/next/no-img-element */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import {
  CardMedia,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { numberToWord } from 'service/numberToWord';
import { unescape } from 'underscore';
import { SamityRegistrationReport } from '../../../url/coop/ApiList';

const ApprovalSamityReg = (props) => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [committeePerson, setCommitteePerson] = useState([]);
  const [incomeExpenses, setIncomeExpenses] = useState([]);
  const [totalExpAmt, setTotalExpAmt] = useState('');
  const [totalIncAmt, setTotalIncAmt] = useState('');
  const [membersData, setMembersData] = useState([]);
  // const [membersFin, setMembersFin] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [workingArea, setWorkingArea] = useState([]);
  const [memberArea, setMemberArea] = useState([]);
  const [element, setElement] = useState('');
  const budgetkey = Object.keys(budgets);
  const [samityLevel, setSamityLevel] = useState(null);
  const [samityDocuments, setSamityDocuments] = useState([]);

  useEffect(() => {
    samityReport(props.samityId, props.isReportFromArchive);
  }, []);

  const samityReport = async (samityId, isReportFromArchive) => {
    const samityData = isReportFromArchive
      ? await axios.get(SamityRegistrationReport + samityId + `?isReportFromArchive=true`, config)
      : await axios.get(SamityRegistrationReport + samityId, config);
    const data = samityData.data.data;
    setSamityInfo(data.samityInfo);
    setCommittee(data.committee.committeeMembers);
    setCommitteePerson(data.committee);
    setMembersData(data.members);
    setSamityDocuments(data.samityDocuments);
    setBudgets(data.budgets);
    setIncomeExpenses(data.incomeExpenses);
    // setMembersFin(data.membersFinancial);
    setWorkingArea(data.workingArea);
    setMemberArea(data.memberArea);
    setElement(data.byLaw);
    setSamityLevel(data.samityInfo.samityLevel);
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

  return (
    <>
      <Grid item xs={12} className="approve-info">
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নাম :&nbsp;</span>
              {samityInfo.samityName}
            </div>
            <div className="info">
              <span className="label">সমিতি গঠনের তারিখ :&nbsp;</span>
              {samityInfo.samityFormationDate && numberToWord(dateFormat(samityInfo.samityFormationDate))}
            </div>
          </Grid>
          <Grid item md={6} xs={12} sx={{ paddingTop: { xs: '0 !important', md: '12px !important' } }}>
            <div className="info">
              <span className="label">সমিতির ধরন :&nbsp;</span> {samityInfo.samityTypeName}{' '}
              {samityInfo?.samityLevel == 'P'
                ? ' (প্রাথমিক সমিতি)'
                : samityInfo?.samityLevel == 'C'
                ? ' (কেন্দ্রীয় সমিতি)'
                : samityInfo?.samityLevel == 'N'
                ? ' (জাতীয় সমিতি)'
                : ''}
            </div>
            {samityLevel == 'P' && samityInfo.projectNameBangla ? (
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
              {samityInfo.samityDetailsAddress ? samityInfo.samityDetailsAddress + ',' : ''}
              {samityInfo.uniThanaPawNameBangla},&nbsp;
              {samityInfo.upaCityNameBangla}, {samityInfo.officeDistrictNameBangla},&nbsp;
              {samityInfo.officeDivisionNameBangla}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
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
                  {memberArea?.map((member, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        সদস্য নির্বাচনী এলাকা
                      </TableCell>
                      <TableCell>{member.divisionNameBangla}</TableCell>
                      <TableCell>{member.districtNameBangla}</TableCell>
                      <TableCell>{member.upaCityNameBangla}</TableCell>
                      <TableCell>{member.uniThanaPawNameBangla}</TableCell>
                      <TableCell>
                        <Tooltip title={<div className="tooltip-title">{member.detailsAddress}</div>} arrow>
                          <span className="data">{member.detailsAddress}</span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* member select area  */}
                  {workingArea?.map((working) => (
                    <TableRow key={working.divisionName}>
                      <TableCell component="th" scope="row">
                        কর্ম এলাকা
                      </TableCell>
                      <TableCell>{working.divisionNameBangla}</TableCell>
                      <TableCell>{working.districtNameBangla}</TableCell>
                      <TableCell>{working.upaCityNameBangla}</TableCell>
                      <TableCell>{working.uniThanaPawNameBangla}</TableCell>
                      <TableCell>
                        <Tooltip title={<div className="tooltip-title">{working.detailsAddress}</div>} arrow>
                          <span className="data">{working.detailsAddress}</span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>সমিতির তথ্যাদি</SubHeading>
          <Grid container spacing={2.5} px={1}>
            <Grid item md={4} xs={12}>
              <span>
                <span className="label">সদস্যের ভর্তি ফি :&nbsp;</span>
                {numberToWord('' + samityInfo.memberAdmissionFee + '')}{' '}
              </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>
                <span className="label">শেয়ার সংখ্যা :&nbsp;</span>
                {numberToWord('' + samityInfo.noOfShare + '')}{' '}
              </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>
                <span className="label">বিক্রিত শেয়ার সংখ্যা :&nbsp;</span>
                {numberToWord('' + samityInfo.soldShare + '')}{' '}
              </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>
                <span className="label">প্রতিটি শেয়ার মূল্য :&nbsp;</span>
                {numberToWord('' + samityInfo.sharePrice + '')}
              </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>
                {' '}
                <span className="label">প্রস্তাবিত শেয়ার মূলধন :&nbsp;</span>
                {numberToWord('' + samityInfo.noOfShare * samityInfo.sharePrice + '')}
              </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>
                <span className="label">বিক্রিত শেয়ার মূলধন :&nbsp;</span>
                {numberToWord('' + samityInfo.sharePrice * samityInfo.soldShare + '')}
              </span>
            </Grid>

            {samityInfo.phone ? (
              <Grid item md={4} xs={12}>
                <span>
                  <span className="label">ফোন নং :&nbsp;</span>
                  {numberToWord('' + samityInfo.phone + '')}{' '}
                </span>
              </Grid>
            ) : (
              ''
            )}
            {samityInfo.website ? (
              <Grid item md={4} xs={12}>
                <span>
                  <span className="label">ওয়েব সাইট :&nbsp;</span>
                  {samityInfo.website}
                </span>
              </Grid>
            ) : (
              ''
            )}

            <Grid item md={4} xs={12}>
              <span>
                <span className="label">মোবাইল নং :&nbsp;</span>
                {numberToWord('' + samityInfo.mobile + '')}
              </span>
            </Grid>
            {samityInfo.orgNameBangla ? (
              <Grid item md={4} xs={12}>
                <span>
                  <span className="label">উদ্যোগী সংস্থার নাম :&nbsp;</span>
                  {samityInfo.orgNameBangla}
                </span>
              </Grid>
            ) : (
              ''
            )}

            {samityInfo.email ? (
              <Grid item md={4} xs={12}>
                <span>
                  <span className="label">ই - মেইল :&nbsp;</span>
                  {samityInfo.email}
                </span>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>সদস্যের তালিকা</SubHeading>
          <Grid container>
            {samityInfo.samityLevel == 'P' ? (
              <TableContainer className="table-container">
                <Table size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell align="center">ক্রমিক নং</TableCell>
                      <TableCell>এনআইডি/জন্ম নিবন্ধন</TableCell>
                      <TableCell align="center">জন্মতারিখ</TableCell>
                      <TableCell>নাম</TableCell>
                      <TableCell>পেশা</TableCell>
                      <TableCell align="center">মোবাইল</TableCell>
                      <TableCell>শেয়ার</TableCell>
                      <TableCell align="right">সঞ্চয় (টাকা)</TableCell>
                      <TableCell align="right">ঋণ (টাকা)</TableCell>
                      <TableCell>ঠিকানা</TableCell>
                      <TableCell align="center">ছবি</TableCell>
                      <TableCell align="center">স্বাক্ষর</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membersData?.map((memb, i) => (
                      <TableRow key={i}>
                        <TableCell scope="row" align="center">
                          {numberToWord('' + (i + 1) + '')}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              <div className="tooltip-title">
                                {memb.nid ? numberToWord('' + memb.nid + '') : numberToWord('' + memb.brn + '')}
                              </div>
                            }
                            arrow
                          >
                            <span className="data">
                              {memb.nid ? numberToWord('' + memb.nid + '') : numberToWord('' + memb.brn + '')}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={<div className="tooltip-title">{numberToWord('' + dateFormat(memb.dob) + '')}</div>}
                            arrow
                          >
                            <span className="data">{numberToWord('' + dateFormat(memb.dob) + '')}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title"> {memb.memberNameBangla}</div>} arrow>
                            <span className="data">{memb.memberNameBangla}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{memb.occupationName}</TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={<div className="tooltip-title">{numberToWord('' + memb.mobile + '')}</div>}
                            arrow
                          >
                            <span className="data">{numberToWord('' + memb.mobile + '')}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">{numberToWord('' + memb.noOfShare + '')}</TableCell>
                        <TableCell>{numberToWord('' + memb.savingsAmount + '')}</TableCell>
                        <TableCell>{numberToWord('' + memb.loanOutstanding + '')}</TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              <div className="tooltip-title">
                                {memb?.address[0]?.detailsAddress}, {memb?.address[0]?.uniThanaPawNameBangla},
                                {memb?.address[0]?.upaCityNameBangla}, {memb?.districtNameBangla}
                              </div>
                            }
                            arrow
                          >
                            <span className="data">
                              {memb?.address[0]?.detailsAddress}, {memb?.address[0]?.uniThanaPawNameBangla},
                              {memb?.address[0]?.upaCityNameBangla}, {memb?.districtNameBangla}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <CardMedia
                            component="img"
                            sx={{ width: 30, textAlign: 'center' }}
                            image={memb.memberPhotoUrl}
                          />
                        </TableCell>
                        <TableCell>
                          <CardMedia
                            component="img"
                            sx={{ width: 30, textAlign: 'center' }}
                            image={memb.memberSignUrl}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : samityInfo.samityLevel == 'C' || samityInfo.samityLevel == 'N' ? (
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell align="center">ক্রমিক নং</TableCell>
                      <TableCell>সদস্যের নাম</TableCell>
                      <TableCell>সদস্য কোড</TableCell>
                      <TableCell> স্বাক্ষরিত ব্যক্তি</TableCell>
                      <TableCell align="center">ফোন নং</TableCell>
                      <TableCell>ঠিকানা</TableCell>
                      <TableCell align="center">ডকুমেন্টের ছবি</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membersData != undefined
                      ? membersData.map((memb, i) => (
                          <TableRow key={i}>
                            <TableCell cope="row" align="center">
                              {numberToWord('' + (i + 1) + '')}
                            </TableCell>
                            <TableCell>
                              <Tooltip title={<div className="tooltip-title">{memb.memberName}</div>} arrow>
                                <span className="data">{memb.memberName}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip
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
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={<div className="tooltip-title">{memb.samitySignatoryPerson}</div>} arrow>
                                <span className="data">{memb.samitySignatoryPerson}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={<div className="tooltip-title">{numberToWord('' + memb.phone + '')}</div>}
                                arrow
                              >
                                <span className="data">{numberToWord('' + memb.phone + '')}</span>
                              </Tooltip>
                            </TableCell>

                            <TableCell>
                              <Tooltip
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
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              {memb.documents.map((img) => (
                                <Zoom zoomMargin={40} key={img.docId}>
                                  <img
                                    alt={img.docId}
                                    src={img.fileNameUrl}
                                    style={{
                                      width: 30,
                                      textAlign: 'center',
                                      display: 'block',
                                    }}
                                  />
                                </Zoom>
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
          <SubHeading>কমিটির পদ বরাদ্ধকরন</SubHeading>
          <Grid container spacing={2.5} px={1}>
            <Grid item xs={12} className="info-container">
              <div className="info">
                <span className="label">সংগঠক :&nbsp;</span> {committeePerson.committeeOrganizer}
              </div>
              <div className="info">
                <span className="label">যোগাযোগের ব্যক্তি :&nbsp;</span> {committeePerson.committeeContactPerson}
              </div>
              <div className="info">
                <span className="label">স্বাক্ষরিত ব্যক্তি :&nbsp;</span>
                {committeePerson.committeeSignatoryPerson}
              </div>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Grid container>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" className="table-designation">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center" width={'5%'}>
                      ক্রমিক নং
                    </TableCell>
                    <TableCell>
                      সদস্যের নাম {samityLevel == 'C' || samityLevel == 'N' ? 'ও স্বাক্ষরিত ব্যক্তি' : ''}
                    </TableCell>
                    <TableCell>পদবী</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {committee.map((degs, i) => (
                    <TableRow key={i}>
                      <TableCell scope="row" align="center">
                        {numberToWord('' + (i + 1) + '')}
                      </TableCell>
                      <TableCell>
                        {degs.memberNameBangla || degs.memberName}{' '}
                        {samityLevel == 'C' || samityLevel == 'N'
                          ? '- ( ' + cenNatMemName(degs.memberId, samityLevel) + ' )'
                          : ''}{' '}
                      </TableCell>
                      <TableCell>{degs.roleName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>ডকুমেন্টের তথ্যাদি</SubHeading>
          <Grid container>
            <TableContainer className="table-container">
              <Table aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center">ক্রমিক নং</TableCell>
                    <TableCell>ডকুমেন্ট নাম</TableCell>
                    <TableCell>ডকুমেন্ট রেফারেন্স নং</TableCell>
                    <TableCell align="center">মেয়াদ শুরুর তারিখ</TableCell>
                    <TableCell align="center">মেয়াদ উত্তীর্ণের তারিখ</TableCell>
                    <TableCell align="center">ডকুমেন্টের ছবি</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {samityDocuments?.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell scope="row" sx={{ textAlign: 'center' }}>
                        {numberToWord('' + (i + 1) + '')}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={<div className="tooltip-data">{row.documentTypeDesc}</div>} arrow>
                          <span className="data">{row.documentTypeDesc}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{numberToWord('' + row.documentNo + '')}</TableCell>
                      <TableCell align="center">
                        {row.effectDate ? numberToWord(dateFormat(row.effectDate)) : ''}
                      </TableCell>
                      <TableCell align="center">
                        {row.expireDate ? numberToWord(dateFormat(row.expireDate)) : ''}
                      </TableCell>
                      <TableCell align="center">
                        <Zoom zoomMargin={40}>
                          <img alt="that wanaka tree" src={row.documentNameUrl} width="30px" height="30px" />{' '}
                        </Zoom>
                        {/* <ZoomImage src={row?.documentNameUrl} imageStyle={{ width: "40px", height: "40px" }} divStyle={{ display: 'flex', justifyContent: 'center' }} key={row?.documentId} type={imageType(row?.documentName)} />*/}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>সমিতির জমা খরচের হিসাব</SubHeading>
          <Grid container spacing={2.5}>
            <Grid item lg={6} md={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{
                          textAlign: 'center',
                          backgroundColor: '#d6c8fff0',
                          fontSize: '18px',
                        }}
                      >
                        জমা
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ width: '30%', align: 'left' }}>লেজার / হিসাবের আইডি</TableCell>
                      <TableCell sx={{ width: '40%', align: 'left' }}>লেজার / হিসাবের নাম</TableCell>
                      <TableCell sx={{ width: '30%', textAlign: 'right' }}>টাকা </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incomeExpenses.map(
                      (incexps, i) =>
                        incexps.incAmt != 0 && (
                          <TableRow key={i}>
                            <TableCell> {incexps.incAmt != 0 && numberToWord('' + incexps.glacCode + '')} </TableCell>
                            <TableCell> {incexps.incAmt != 0 && incexps.glacName} </TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                              {incexps.incAmt != 0 && numberToWord('' + incexps.incAmt + '')}
                            </TableCell>
                          </TableRow>
                        ),
                    )}
                    {/* total amount  */}
                    {/* <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: "right" }}>
                        সর্বমোট
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        {numberToWord("" + totalIncAmt + "")}
                      </TableCell>
                    </TableRow> */}
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
                      <TableCell sx={{ textAlign: 'right' }}>{numberToWord('0.00')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: 'right', fontWeight: '700' }}>
                        সর্বমোট
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right', fontWeight: '700' }}>
                        {numberToWord('' + totalIncAmt + '')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item lg={6} md={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{
                          textAlign: 'center',
                          backgroundColor: '#d6c8fff0',
                          fontSize: '18px',
                        }}
                      >
                        খরচ
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ width: '30%', align: 'left' }}>লেজার / হিসাবের আইডি</TableCell>
                      <TableCell sx={{ width: '40%', align: 'left' }}>লেজার / হিসাবের নাম</TableCell>
                      <TableCell sx={{ width: '30%', textAlign: 'right' }}>টাকা</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incomeExpenses.map(
                      (incexps, i) =>
                        incexps.expAmt != 0 && (
                          <TableRow key={i}>
                            <TableCell> {incexps.expAmt != 0 && numberToWord('' + incexps.glacCode + '')} </TableCell>
                            <TableCell> {incexps.expAmt != 0 && incexps.glacName} </TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                              {incexps.expAmt != 0 && numberToWord('' + incexps.expAmt + '')}
                            </TableCell>
                          </TableRow>
                        ),
                    )}
                    {/* total amount  */}
                    {/* <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: "right" }}>
                        সর্বমোট
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        {numberToWord("" + totalExpAmt + "")}
                      </TableCell>
                    </TableRow> */}
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
                      <TableCell colSpan={2} sx={{ textAlign: 'right', fontWeight: '700' }}>
                        সর্বমোট
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right', fontWeight: '700' }}>
                        {numberToWord('' + totalIncAmt + '')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {budgetkey.map((key, i) => (
        <Grid key={i} container className="section">
          <Grid item xs={12}>
            <SubHeading>
              সমিতির বাজেট{' '}
              {key.toString()
                ? numberToWord('' + key.substring(0, 4) + '') + '-' + numberToWord('' + key.substring(4, 8) + '')
                : ''}{' '}
              অর্থ বছর
            </SubHeading>

            <Grid container spacing={2.5}>
              <Grid item lg={6} xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                    <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{
                            textAlign: 'center',
                            backgroundColor: '#d6c8fff0',
                            fontSize: '18px',
                          }}
                        >
                          আয়
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ width: '30%', align: 'left' }}>লেজার / হিসাবের আইডি</TableCell>
                        <TableCell sx={{ width: '40%', align: 'left' }}>লেজার / হিসাবের নাম</TableCell>
                        <TableCell sx={{ width: '30%', textAlign: 'right' }}>টাকা </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {budgets[key].map(
                        (incexps, i) =>
                          incexps.incAmt != 0 && (
                            <TableRow key={i}>
                              <TableCell> {incexps.incAmt != 0 && numberToWord('' + incexps.glacCode + '')} </TableCell>
                              <TableCell> {incexps.incAmt != 0 && incexps.glacName} </TableCell>
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
                        <TableCell sx={{ textAlign: 'right' }}>
                          {numberToWord('' + totalIncAmount(budgets[key]) + '')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item lg={6} xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                    <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{
                            textAlign: 'center',
                            backgroundColor: '#d6c8fff0',
                            fontSize: '18px',
                          }}
                        >
                          ব্যয়
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ width: '30%', align: 'left' }}>লেজার / হিসাবের আইডি</TableCell>
                        <TableCell sx={{ width: '40%', align: 'left' }}>লেজার / হিসাবের নাম</TableCell>
                        <TableCell sx={{ width: '30%', textAlign: 'right' }}>টাকা</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {budgets[key].map(
                        (incexps, i) =>
                          incexps.expAmt != 0 && (
                            <TableRow key={i}>
                              <TableCell> {incexps.expAmt != 0 && numberToWord('' + incexps.glacCode + '')} </TableCell>
                              <TableCell> {incexps.expAmt != 0 && incexps.glacName} </TableCell>
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

      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>লক্ষ্য ও উদ্দেশ্য</SubHeading>
          <Grid container spacing={2.5} px={3} mt={2}>
            <div dangerouslySetInnerHTML={{ __html: unescape(element) }}></div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ApprovalSamityReg;
