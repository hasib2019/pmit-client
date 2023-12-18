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
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import Title from 'shared/others/Title';
import { unescape } from 'underscore';
import { SamityRegistrationReport } from 'url/ApiList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function SamityCommonRegReport() {
  const router = useRouter();
  ///////////////////////////////////////////////////////////////////////////////////////////
  let getId = localStorageData('getSamityId');
  const samityLevel = localStorageData('samityLevel');
  const checkPageValidation = () => {
    getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/samity-management/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/samity-management/coop/registration' });
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////
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

  useEffect(() => {
    checkPageValidation();
    samityReport();
    registrationFee();
  }, []);

  const samityReport = async () => {
    try {
      const samityData = await axios.get(SamityRegistrationReport + getId);
      const data = samityData.data.data;
      setSamityInfo(data.samityInfo);
      setCommittee(data.committee.committeeMembers);
      setCommitteePerson(data.committee);
      setMembersData(data.members);
      setBudgets(data.budgets);
      setIncomeExpenses(data.incomeExpenses);
      // setMembersFin(data.membersFinancial);
      setWorkingArea(data.workingArea);
      setMemberArea(data.memberArea);
      setElement(data.byLaw);
      let expAmount = 0;
      for (let i = 0; data.incomeExpenses && i < data.incomeExpenses.length; i++) {
        expAmount += data.incomeExpenses[i].expAmt;
      }
      setTotalExpAmt(expAmount);
      let incAmount = 0;
      for (let i = 0; data.incomeExpenses && i < data.incomeExpenses.length; i++) {
        incAmount += data.incomeExpenses[i].incAmt;
      }
      setTotalIncAmt(incAmount);
    } catch (error) {
      errorHandler(error);
    }
  };

  const registrationFee = async () => {
    // const fee = await axios.get(RegFee);
    // const registrationFee = fee.data.data[0].serviceRules.registrationFee[0][toCamelCase(samityLevel)];
    // const registrationVat = fee.data.data[0].serviceRules.registrationVat[0][toCamelCase(samityLevel)];
    // setRegFeeDetails({ ...regFeeDetails, regFee: registrationFee, RegVat: registrationVat });
  };

  const totalIncAmount = (inc) => {
    let incAmount = 0;
    for (let i = 0; inc && i < inc.length; i++) {
      incAmount += inc[i].incAmt;
    }
    return incAmount;
  };
  const totalExpAmtmount = (inc) => {
    let expAmount = 0;
    for (let i = 0; inc && i < inc.length; i++) {
      expAmount += inc[i].expAmt;
    }
    return expAmount;
  };

  //////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <Grid
        item
        md={12}
        xs={12}
        mx={2}
        my={2}
        px={2}
        py={2}
        sx={{ backgroundColor: 'rgb(179 216 245)', borderRadius: '10px' }}
      >
        <Grid container spacing={2.5}>
          {samityLevel == 'P' ? (
            <Grid item md={6} xs={12}>
              <span style={{ fontSize: '20px' }}>প্রকল্পের নাম : </span>
              <span> {samityInfo.projectNameBangla}</span>
            </Grid>
          ) : (
            ''
          )}

          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '20px' }}>সমিতির ধরন : </span>
            <span> {samityInfo.samityTypeName} </span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '20px' }}>সমিতির নাম : </span>
            <span> {samityInfo.samityName}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '20px' }}>সমিতি গঠনের তারিখ : </span>
            <span>
              {' '}
              {samityInfo.samityFormationDate &&
                numberToWord('' + new Date(samityInfo.samityFormationDate).toLocaleDateString() + '')}
            </span>
          </Grid>

          <Grid item md={12} xs={12}>
            <span style={{ fontSize: '20px' }}>সমিতির ঠিকানা : </span>
            <span>
              &nbsp;
              {samityInfo.samityDetailsAddress}, {samityInfo.uniThanaPawNameBangla},&nbsp;
              {samityInfo.upaCityNameBangla}, {samityInfo.officeDistrictNameBangla}
              ,&nbsp;
              {samityInfo.officeDivisionNameBangla}
            </span>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Title>
            <Typography variant="h5">সমিতির এলাকা</Typography>
          </Title>
          <Grid container>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '15%', align: 'left', fontSize: '16px', fontWeight: '600' }}>
                      {' '}
                      ঠিকানা{' '}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '15%', align: 'left', fontSize: '16px', fontWeight: '600' }}>
                      {' '}
                      বিভাগ{' '}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '15%', align: 'left', fontSize: '16px', fontWeight: '600' }}>
                      {' '}
                      জেলা{' '}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '20%', align: 'left', fontSize: '16px', fontWeight: '600' }}>
                      {' '}
                      উপজেলা/সিটি কর্পোরেশন{' '}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '20%', align: 'left', fontSize: '16px', fontWeight: '600' }}>
                      {' '}
                      ইউানয়ন/পৌরসভা/ওয়ার্ড{' '}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '15%', align: 'left', fontSize: '16px', fontWeight: '600' }}>
                      {' '}
                      গ্রাম/মহল্লা{' '}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell> কার্যালয় </StyledTableCell>
                    <StyledTableCell>{samityInfo.officeDivisionNameBangla}</StyledTableCell>
                    <StyledTableCell>{samityInfo.officeDistrictNameBangla}</StyledTableCell>
                    <StyledTableCell>{samityInfo.upaCityNameBangla}</StyledTableCell>
                    <StyledTableCell>{samityInfo.uniThanaPawNameBangla}</StyledTableCell>
                    <StyledTableCell>{samityInfo.samityDetailsAddress}</StyledTableCell>
                  </StyledTableRow>
                  {/* member select area  */}
                  {memberArea &&
                    memberArea.length > 0 &&
                    memberArea.map((member, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row">
                          সদস্য নির্বাচনী এলাকা
                        </StyledTableCell>
                        <StyledTableCell>{member.divisionNameBangla}</StyledTableCell>
                        <StyledTableCell>{member.districtNameBangla}</StyledTableCell>
                        <StyledTableCell>{member.upaCityNameBangla}</StyledTableCell>
                        <StyledTableCell>{member.uniThanaPawNameBangla}</StyledTableCell>
                        <StyledTableCell>{member.detailsAddress}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  {/* member select area  */}
                  {workingArea &&
                    workingArea.map((working) => (
                      <StyledTableRow key={working.divisionName}>
                        <StyledTableCell component="th" scope="row">
                          কর্ম এলাকা
                        </StyledTableCell>
                        <StyledTableCell>{working.divisionNameBangla}</StyledTableCell>
                        <StyledTableCell>{working.districtNameBangla}</StyledTableCell>
                        <StyledTableCell>{working.upaCityNameBangla}</StyledTableCell>
                        <StyledTableCell>{working.uniThanaPawNameBangla}</StyledTableCell>
                        <StyledTableCell>{working.detailsAddress}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Title>
            <Typography variant="h5">সমিতির তথ্যাদি</Typography>
          </Title>
          <Grid container spacing={2.5} px={2}>
            <Grid item md={4} xs={12} pr={5}>
              <span>সদস্যের ভর্তি ফি - {numberToWord('' + samityInfo.memberAdmissionFee + '')} </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>শেয়ার সংখ্যা - {numberToWord('' + samityInfo.noOfShare + '')} </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>বিক্রিত শেয়ার সংখ্যা - {numberToWord('' + samityInfo.soldShare + '')} </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>প্রতিটি শেয়ার মূল্য - {numberToWord('' + samityInfo.sharePrice + '')}</span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>বিক্রিত শেয়ার মূলধন - {numberToWord('' + samityInfo.noOfShare * samityInfo.soldShare + '')}</span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>
                {' '}
                প্রস্তাবিত শেয়ার মূলধন - {numberToWord('' + samityInfo.noOfShare * samityInfo.sharePrice + '')}
              </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>ফোন নং - {numberToWord('' + samityInfo.phone + '')} </span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>ওয়েব সাইট - {samityInfo.website}</span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>মোবাইল নং - {numberToWord('' + samityInfo.mobile + '')}</span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>উদ্যোগী সংস্থার নাম - {samityInfo.orgNameBangla}</span>
            </Grid>
            <Grid item md={4} xs={12}>
              <span>ই - মেইল - ‍{samityInfo.email}</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Title>
            <Typography variant="h5">সদস্যের তালিকা</Typography>
          </Title>
          <Grid container>
            {samityLevel == 'P' ? (
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                    <TableRow>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>ক্রমিক নং</StyledTableCell>
                      <StyledTableCell sx={{ width: '8%', align: 'left' }}>এনআইডি/জন্ম নিবন্ধন</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>জন্মতারিখ</StyledTableCell>
                      <StyledTableCell sx={{ width: '15%', align: 'left' }}>নাম</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%', align: 'left' }}>পেশা</StyledTableCell>
                      <StyledTableCell sx={{ width: '7%', align: 'left' }}>মোবাইল</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>শেয়ার</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>সঞ্চয়</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>ঋণ</StyledTableCell>
                      <StyledTableCell sx={{ width: '20%', align: 'left' }}>ঠিকানা</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>ছবি</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>স্বাক্ষর</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>প্রত্যয়ন</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membersData != undefined
                      ? membersData.map((memb, i) => (
                        <StyledTableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <StyledTableCell component="th" scope="row" sx={{ p: '5px', textAlign: 'center' }}>
                            {' '}
                            {numberToWord('' + (i + 1) + '')}{' '}
                          </StyledTableCell>
                          <StyledTableCell>
                            {memb.nid ? numberToWord('' + memb.nid + '') : numberToWord('' + memb.brn + '')}
                          </StyledTableCell>
                          <StyledTableCell>{numberToWord('' + dateFormat(memb.dob) + '')}</StyledTableCell>
                          <StyledTableCell>{memb.memberNameBangla}</StyledTableCell>
                          <StyledTableCell>{memb.occupationName}</StyledTableCell>
                          <StyledTableCell>{numberToWord('' + memb.mobile + '')}</StyledTableCell>
                          <StyledTableCell>{numberToWord('' + memb.noOfShare + '')}</StyledTableCell>
                          <StyledTableCell>{numberToWord('' + memb.savingsAmount + '')}</StyledTableCell>
                          <StyledTableCell>{numberToWord('' + memb.loanOutstanding + '')}</StyledTableCell>
                          <StyledTableCell>
                            {memb?.address[0]?.detailsAddress}, {memb?.address[0]?.uniThanaPawNameBangla},
                            {memb?.address[0]?.upaCityNameBangla}, {memb?.districtNameBangla}
                          </StyledTableCell>
                          <StyledTableCell>
                            <CardMedia
                              component="img"
                              sx={{ width: 30, textAlign: 'center' }}
                              image={memb.memberPhotoUrl}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <CardMedia
                              component="img"
                              sx={{ width: 30, textAlign: 'center' }}
                              image={memb.memberSignUrl}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            {
                              <CardMedia
                                component="img"
                                sx={{ width: 30, textAlign: 'center' }}
                                image={memb.memberTestimonialUrl}
                              />
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                      : ''}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              ''
            )}
            {samityLevel == 'C' || samityLevel == 'N' ? (
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                    <TableRow>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>ক্রমিক নং</StyledTableCell>
                      <StyledTableCell sx={{ width: '8%', align: 'left' }}>সদস্যের নাম</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>সদস্য কোড</StyledTableCell>
                      <StyledTableCell sx={{ width: '15%', align: 'left' }}>স্বাক্ষরিত ব্যক্তি</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%', align: 'left' }}>ফোন নং</StyledTableCell>

                      <StyledTableCell sx={{ width: '20%', align: 'left' }}>ঠিকানা</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>ছবি</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>স্বাক্ষর</StyledTableCell>
                      <StyledTableCell sx={{ width: '5%', align: 'left' }}>প্রত্যয়ন</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membersData != undefined
                      ? membersData.map((memb, i) => (
                        <StyledTableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <StyledTableCell component="th" scope="row" sx={{ p: '5px', textAlign: 'center' }}>
                            {' '}
                            {numberToWord('' + (i + 1) + '')}{' '}
                          </StyledTableCell>
                          <StyledTableCell>{memb.memberName}</StyledTableCell>
                          <StyledTableCell>{numberToWord('' + memb.memberCode + '')}</StyledTableCell>
                          <StyledTableCell>{memb.samitySignatoryPerson}</StyledTableCell>
                          <StyledTableCell>{numberToWord('' + memb.phone + '')}</StyledTableCell>

                          <StyledTableCell>{memb.samityDetailsAddress}</StyledTableCell>
                          <StyledTableCell>
                            <CardMedia
                              component="img"
                              sx={{ width: 30, textAlign: 'center' }}
                              image={memb.memberPhotoUrl}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <CardMedia
                              component="img"
                              sx={{ width: 30, textAlign: 'center' }}
                              image={memb.memberSignUrl}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            {
                              <CardMedia
                                component="img"
                                sx={{ width: 30, textAlign: 'center' }}
                                image={memb.memberTestimonialUrl}
                              />
                            }
                          </StyledTableCell>
                        </StyledTableRow>
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

      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Title>
            <Typography variant="h5">কমিটির পদ বরাদ্দকরন</Typography>
          </Title>
          <Grid container px={3} sx={{ bgcolor: '#d3d3d3', borderRadius: '4px', py: '6px' }}>
            <Grid item lg={4} md={6} xs={12}>
              <span>সংগঠক - {committeePerson.committeeOrganizer} </span>
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <span>যোগাযোগের ব্যক্তি - {committeePerson.committeeContactPerson} </span>
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <span>স্বাক্ষরিত ব্যক্তি - {committeePerson.committeeSignatoryPerson}</span>
            </Grid>
          </Grid>
          <Grid container pt={2}>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#e6f8f1' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '5%', fontSize: '16px', align: 'left' }}> ক্রমিক নং</StyledTableCell>
                    <StyledTableCell sx={{ width: '50%', fontSize: '16px', align: 'left' }}>
                      {' '}
                      সদস্যের নাম{' '}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '40%', fontSize: '16px', align: 'left' }}> পদবী </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {committee.map((degs, i) => (
                    <StyledTableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <StyledTableCell component="th" scope="row" sx={{ p: '5px', textAlign: 'center' }}>
                        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                        {numberToWord('' + (i + 1) + '')}{' '}
                      </StyledTableCell>
                      <StyledTableCell>{degs.memberNameBangla || degs.memberName}</StyledTableCell>
                      <StyledTableCell>{degs.roleName}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Title>
            <Typography variant="h5">সমিতির জমা খরচের হিসাব</Typography>
          </Title>
          <Grid container spacing={2.5}>
            <Grid item lg={6} md={12} xs={12}>
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                    <TableRow>
                      <StyledTableCell
                        colSpan={3}
                        sx={{ textAlign: 'center', backgroundColor: '#F5F5F5', fontSize: '20px' }}
                      >
                        জমা
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell sx={{ width: '30%', align: 'left', fontSize: '16px' }}>
                        লেজার / হিসাবের আইডি
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: '40%', align: 'left', fontSize: '16px' }}>
                        লেজার / হিসাবের নাম
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: '30%', textAlign: 'right', fontSize: '16px' }}>
                        টাকা{' '}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incomeExpenses.map(
                      (incexps, i) =>
                        incexps.incAmt != 0 && (
                          <StyledTableRow key={i}>
                            <StyledTableCell>
                              {' '}
                              {incexps.incAmt != 0 && numberToWord('' + incexps.glacCode + '')}{' '}
                            </StyledTableCell>
                            <StyledTableCell> {incexps.incAmt != 0 && incexps.glacName} </StyledTableCell>
                            <StyledTableCell sx={{ textAlign: 'right' }}>
                              {incexps.incAmt != 0 && numberToWord('' + incexps.incAmt + '')}
                            </StyledTableCell>
                          </StyledTableRow>
                        ),
                    )}
                    {/* total amount  */}
                    <StyledTableRow>
                      <StyledTableCell colSpan={2} sx={{ textAlign: 'right' }}>
                        সর্বমোট
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'right' }}>
                        {numberToWord('' + totalIncAmt + '')}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item lg={6} md={12} xs={12}>
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                    <TableRow>
                      <StyledTableCell
                        colSpan={3}
                        sx={{ textAlign: 'center', backgroundColor: '#F5F5F5', fontSize: '20px' }}
                      >
                        খরচ
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell sx={{ width: '30%', align: 'left', fontSize: '16px' }}>
                        লেজার / হিসাবের আইডি
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: '40%', align: 'left', fontSize: '16px' }}>
                        লেজার / হিসাবের নাম
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: '30%', textAlign: 'right', fontSize: '16px' }}>
                        টাকা
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incomeExpenses.map(
                      (incexps, i) =>
                        incexps.expAmt != 0 && (
                          <StyledTableRow key={i}>
                            <StyledTableCell>
                              {' '}
                              {incexps.expAmt != 0 && numberToWord('' + incexps.glacCode + '')}{' '}
                            </StyledTableCell>
                            <StyledTableCell> {incexps.expAmt != 0 && incexps.glacName} </StyledTableCell>
                            <StyledTableCell sx={{ textAlign: 'right' }}>
                              {incexps.expAmt != 0 && numberToWord('' + incexps.expAmt + '')}
                            </StyledTableCell>
                          </StyledTableRow>
                        ),
                    )}
                    {/* total amount  */}
                    <StyledTableRow>
                      <StyledTableCell colSpan={2} sx={{ textAlign: 'right' }}>
                        সর্বমোট
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'right' }}>
                        {numberToWord('' + totalExpAmt + '')}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {budgetkey.map((key, i) => (
        <Grid key={i} container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
          <Grid item lg={12} md={12} xs={12}>
            <Title>
              <Typography variant="h5">
                সমিতির বাজেট হিসাব &nbsp;&nbsp;
                {key.toString()
                  ? numberToWord('' + key.substring(0, 4) + '') + '-' + numberToWord('' + key.substring(4, 8) + '')
                  : ''}
              </Typography>
            </Title>
            <Grid container spacing={2.5}>
              <Grid item lg={6} md={12} xs={12}>
                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                      <TableRow>
                        <StyledTableCell
                          colSpan={3}
                          sx={{
                            textAlign: 'center',
                            backgroundColor: '#F5F5F5',
                            fontSize: '20px',
                          }}
                        >
                          আয়
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell sx={{ width: '30%', align: 'left', fontSize: '16px' }}>
                          লেজার / হিসাবের আইডি
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: '40%', align: 'left', fontSize: '16px' }}>
                          লেজার / হিসাবের নাম
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: '30%', textAlign: 'right', fontSize: '16px' }}>
                          টাকা{' '}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {budgets[key].map(
                        (incexps, i) =>
                          incexps.incAmt != 0 && (
                            <StyledTableRow key={i}>
                              <StyledTableCell>
                                {' '}
                                {incexps.incAmt != 0 && numberToWord('' + incexps.glacCode + '')}{' '}
                              </StyledTableCell>
                              <StyledTableCell> {incexps.incAmt != 0 && incexps.glacName} </StyledTableCell>
                              <StyledTableCell sx={{ textAlign: 'right' }}>
                                {incexps.incAmt != 0 && numberToWord('' + incexps.incAmt + '')}
                              </StyledTableCell>
                            </StyledTableRow>
                          ),
                      )}
                      {/* total amount  */}

                      <StyledTableRow>
                        <StyledTableCell colSpan={2} sx={{ textAlign: 'right' }}>
                          সর্বমোট
                        </StyledTableCell>
                        <StyledTableCell sx={{ borderRight: 1, textAlign: 'right' }}>
                          {numberToWord('' + totalIncAmount(budgets[key]) + '')}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item lg={6} md={12} xs={12}>
                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                      <TableRow>
                        <StyledTableCell
                          colSpan={3}
                          sx={{
                            textAlign: 'center',
                            backgroundColor: '#F5F5F5',
                            fontSize: '20px',
                          }}
                        >
                          ব্যয়
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell sx={{ width: '30%', align: 'left', fontSize: '16px' }}>
                          লেজার / হিসাবের আইডি
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: '40%', align: 'left', fontSize: '16px' }}>
                          লেজার / হিসাবের নাম
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: '30%', textAlign: 'right', fontSize: '16px' }}>
                          টাকা
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {budgets[key].map(
                        (incexps, i) =>
                          incexps.expAmt != 0 && (
                            <StyledTableRow key={i}>
                              <StyledTableCell>
                                {' '}
                                {incexps.expAmt != 0 && numberToWord('' + incexps.glacCode + '')}{' '}
                              </StyledTableCell>
                              <StyledTableCell> {incexps.expAmt != 0 && incexps.glacName} </StyledTableCell>
                              <StyledTableCell sx={{ textAlign: 'right' }}>
                                {incexps.expAmt != 0 && numberToWord('' + incexps.expAmt + '')}
                              </StyledTableCell>
                            </StyledTableRow>
                          ),
                      )}
                      {/* total amount  */}
                      <StyledTableRow>
                        <StyledTableCell colSpan={2} sx={{ textAlign: 'right' }}>
                          সর্বমোট
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: 'right' }}>
                          {numberToWord('' + totalExpAmtmount(budgets[key]) + '')}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}

      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Title>
            <Typography variant="h5">লক্ষ্য ও উদ্দেশ্য</Typography>
          </Title>
          <Grid container spacing={2.5} px={2} pt={2} pl={5}>
            {<div dangerouslySetInnerHTML={{ __html: unescape(element) }}></div>}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default SamityCommonRegReport;
