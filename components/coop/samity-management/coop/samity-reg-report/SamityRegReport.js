/* eslint-disable @next/next/no-img-element */
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PrintIcon from '@mui/icons-material/Print';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
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
import RequiredFile from 'components/utils/RequiredFile';
import { toCamelCase } from 'keys-transform';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { NotificationManager } from 'react-notifications';
import ZoomImage from 'service/ZoomImage';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { formValidator } from 'service/formValidator';
import { bangToEng } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import { unescape } from 'underscore';
import {
  ApplicationSubmit,
  CoopRegApi,
  RegFee,
  RegFeeSubmit,
  SamityRegistrationReport,
  samityStepReg,
} from '../../../../../url/coop/ApiList';

const SamityRegReport = () => {
  const router = useRouter();
  ///////////////////////////////////////////////////////////////////////////////////////////
  const config = localStorageData('config');
  const getId = localStorageData('getSamityId');
  const samityName = localStorageData('getSamityName');
  const samityLevel = localStorageData('samityLevel');
  getId;
  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
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
  const [checked, setChecked] = useState('');
  const [finalDeclaration, setFinalDeclaration] = useState();
  const [regFeeDetails, setRegFeeDetails] = useState({
    regFee: '',
    RegVat: '',
  });
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: '',
    invoiceDate: null,
  });
  const [errorInvoiceDetails, setErrorInvoiceDetails] = useState({
    invoiceNo: '',
    invoiceDate: '',
  });
  const handleChange = (e) => {
    setChecked(e.target.value);
    if (e.target.name == 'declaration') {
      setFinalDeclaration(e.target.checked);
    }
  };

  const handleChangeRegFee = (e) => {
    const { name, value } = e.target;
    let resultObj;
    resultObj = formValidator('number', value);
    if (resultObj?.status) {
      return;
    }
    setInvoiceDetails({ ...invoiceDetails, [name]: resultObj?.value });
    setErrorInvoiceDetails({
      ...errorInvoiceDetails,
      [name]: resultObj?.value ? '' : 'চালান নং প্রদান করুন',
    });
  };
  const handleChangeRegFeeDate = (e) => {
    setInvoiceDetails({ ...invoiceDetails, invoiceDate: e });
    setErrorInvoiceDetails({
      ...errorInvoiceDetails,
      invoiceDate: e ? '' : 'চালান জমার তারিখ প্রদান করুন',
    });
  };

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
      const memberAllData = data.members;
      let filterData = [...memberAllData];
      filterData.sort((a, b) => a.memberCode - b.memberCode);
      setMembersData(filterData);
      setSamityDocuments(data.samityDocuments);
      setBudgets(data.budgets);
      setIncomeExpenses(data.incomeExpenses);
      setWorkingArea(data.workingArea);
      setMemberArea(data.memberArea);
      setElement(unescape(data.byLaw));

      let incAmount = 50;
      let expAmount = 60;
      for (let i = 0; data.incomeExpenses && i < data.incomeExpenses.length; i++) {
        incAmount += parseFloat(data.incomeExpenses[i].incAmt);
      }
      for (let i = 0; data.incomeExpenses && i < data.incomeExpenses.length; i++) {
        expAmount += parseFloat(data.incomeExpenses[i].expAmt);
      }
      setTotalIncAmt(incAmount.toFixed(2));
      setTotalExpAmt(expAmount.toFixed(2));

      if (data?.samityInfo?.chalanNumber) {
        let resultObj;
        resultObj = formValidator('number', data?.samityInfo?.chalanNumber);
        if (resultObj?.status) {
          return;
        }

        setInvoiceDetails({
          ...invoiceDetails,
          invoiceNo: resultObj?.value,
          invoiceDate: data?.samityInfo?.chalanDate,
        });
      }
    } catch (error) {
      errorHandler(error);
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
  const registrationFee = async () => {
    const fee = await axios.get(RegFee, config);
    const registrationFee = fee.data.data[0].serviceRules.registrationFee[0][toCamelCase(samityLevel)];
    const registrationVat = fee.data.data[0].serviceRules.registrationVat[0][toCamelCase(samityLevel)];
    setRegFeeDetails({
      ...regFeeDetails,
      regFee: registrationFee,
      RegVat: registrationVat,
    });
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

  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/required-doc' });
  };

  const printPage = () => {
    const contentToPrint = document.getElementById('contentToPrint').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = contentToPrint;
    window.print();
    document.body.innerHTML = originalContent;
  };

  let checkMandatory = () => {
    let result = false;
    let errorObj = {
      invoiceNo: invoiceDetails.invoiceNo,
      invoiceDate: invoiceDetails.invoiceDate == null ? '' : invoiceDetails.invoiceDate,
    };
    for (const key in errorObj) {
      if (errorObj[key].length == 0) {
        result = true;
        if (key == 'invoiceNo' || key == 'invoiceDate') {
          setErrorInvoiceDetails({
            ...errorInvoiceDetails,
            invoiceNo: invoiceDetails.invoiceNo == '' ? 'চালান নং প্রদান করুন' : '',
            invoiceDate: invoiceDetails.invoiceDate == null ? 'চালান জমার তারিখ প্রদান করুন' : '',
          });
        }
      }
    }
    return result;
  };
  const finalSubmit = async (e) => {
    let mandatory = checkMandatory();
    if (mandatory == false) {
      e.preventDefault();
      setLoadingDataSaveUpdate(true);
      const payload = {
        certificateGetBy: checked,
        declaration: finalDeclaration,
      };

      const regFeePayload = {
        registrationFee: parseInt(regFeeDetails.regFee),
        registrationFeeVat: regFeeDetails.RegVat,
        chalanDate: dateFormat(invoiceDetails.invoiceDate),
        chalanNumber: parseInt(bangToEng(invoiceDetails.invoiceNo)),
      };
      const samityInfoData = {
        flag: 'temp',
        id: getId,
        role: 'organizer',
        samityLevel,
        samityName,
      };
      //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
      const payloadData = {};
      try {
        //////////////////////////////////////////   patch update  ////////////////////////////////////
        await axios.patch(RegFeeSubmit + getId, regFeePayload, config);
        const certicateGetBy = await axios.patch(
          CoopRegApi + '/' + 'certificate-get-by' + '/' + getId,
          payload,
          config,
        );

        if (certicateGetBy.status == 200) {
          // ///////////////////////////////Data Inputed to Application Table //////////////////////////
          const ApplicationSubmitData = await axios.post(ApplicationSubmit + getId, payloadData, config);
          //////////////////////////////// Set localstorage data //////////////////////////////////////////
          localStorage.setItem('samityInfo', JSON.stringify(samityInfoData));
          if (ApplicationSubmitData.status == 200) {
            const getRedirectUrl = await axios.get(samityStepReg + '/' + getId, config);
            const redirectmainData = getRedirectUrl.data.data.samityId;
            localStorage.setItem('stepId', JSON.stringify(0));
            localStorage.setItem('status', JSON.stringify('P'));
            localStorage.removeItem('storeId');
            localStorage.removeItem('activePage');
            localStorage.removeItem('storeName');
            localStorage.removeItem('samityLevel');
            localStorage.setItem('reportsId', JSON.stringify(redirectmainData));
            NotificationManager.success('সমিতি সফল ভাবে তৈরি হয়েছে! সমিতি অনুমোদনের জন্য অপেক্ষা করুন।', '', 5000);
            router.push({
              pathname: '/coop/reports/basic-report/document-download',
            });
          }
        }
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      NotificationManager.warning('বাধ্যতামূলক তথ্য পূরণ করুন', '', 5000);
      setLoadingDataSaveUpdate(false);
    }
  };
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  //////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <div id="contentToPrint">
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
            {samityLevel == 'P' && samityInfo?.projectNameBangla ? (
              <Grid item md={6} xs={12}>
                <span style={{ fontSize: '20px' }}>প্রকল্পের নাম : </span>
                <span> {samityInfo.projectNameBangla} </span>
              </Grid>
            ) : (
              ''
            )}

            <Grid item md={6} xs={12}>
              <span style={{ fontSize: '20px' }}>সমিতির ধরন : </span>
              <span>
                {' '}
                {samityInfo.samityTypeName}{' '}
                {samityInfo?.samityLevel == 'P'
                  ? ' (প্রাথমিক সমিতি)'
                  : samityInfo?.samityLevel == 'C'
                    ? ' (কেন্দ্রীয় সমিতি)'
                    : samityInfo?.samityLevel == 'N'
                      ? ' (জাতীয় সমিতি)'
                      : ''}
              </span>
            </Grid>
            <Grid item md={6} xs={12}>
              <span style={{ fontSize: '20px' }}>সমিতির নাম : </span>
              <span> {samityInfo.samityName}</span>
            </Grid>
            <Grid item md={6} xs={12}>
              <span style={{ fontSize: '20px' }}>সমিতি গঠনের তারিখ : </span>
              <span> {samityInfo.samityFormationDate && numberToWord(dateFormat(samityInfo.samityFormationDate))}</span>
            </Grid>

            <Grid item md={12} xs={12}>
              <span style={{ fontSize: '20px' }}>সমিতির ঠিকানা : </span>
              <span>
                &nbsp;
                {samityInfo.samityDetailsAddress}
                {samityInfo.samityDetailsAddress ? ' ,' : ''}
                {samityInfo.uniThanaPawNameBangla},&nbsp;
                {samityInfo.upaCityNameBangla}, {samityInfo.officeDistrictNameBangla}
                ,&nbsp;
                {samityInfo.officeDivisionNameBangla}
              </span>
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
                      <TableCell>ঠিকানা</TableCell>
                      <TableCell>বিভাগ</TableCell>
                      <TableCell>জেলা</TableCell>
                      <TableCell>উপজেলা/সিটি কর্পোরেশন</TableCell>
                      <TableCell>ইউানয়ন/পৌরসভা/ওয়ার্ড</TableCell>
                      <TableCell>গ্রাম/মহল্লা</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {memberArea &&
                      memberArea.length > 0 &&
                      memberArea.map((member, i) => (
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
                    {/* member select area  */}
                    {workingArea &&
                      workingArea.map((working) => (
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
        <Grid container className="section">
          <Grid item xs={12}>
            <SubHeading>সমিতির তথ্য</SubHeading>
            <Grid container spacing={2.5} px={1}>
              <Grid item md={4} xs={12}>
                <span>সদস্যের ভর্তি ফি : {numberToWord('' + samityInfo?.memberAdmissionFee + '')} </span>
              </Grid>
              <Grid item md={4} xs={12}>
                <span>শেয়ার সংখ্যা : {numberToWord('' + samityInfo?.noOfShare + '')} </span>
              </Grid>
              <Grid item md={4} xs={12}>
                <span>বিক্রিত শেয়ার সংখ্যা : {numberToWord('' + samityInfo?.soldShare + '')} </span>
              </Grid>
              <Grid item md={4} xs={12}>
                <span>প্রতিটি শেয়ার মূল্য : {numberToWord('' + samityInfo?.sharePrice + '')}</span>
              </Grid>
              <Grid item md={4} xs={12}>
                <span>
                  {' '}
                  প্রস্তাবিত শেয়ার মূলধন : {numberToWord('' + samityInfo?.noOfShare * samityInfo?.sharePrice + '')}
                </span>
              </Grid>
              <Grid item md={4} xs={12}>
                <span>
                  বিক্রিত শেয়ার মূলধন : {numberToWord('' + samityInfo.sharePrice * samityInfo.soldShare + '')}
                </span>
              </Grid>
              {samityInfo.phone ? (
                <Grid item md={4} xs={12}>
                  <span>ফোন নং : {numberToWord('' + samityInfo.phone + '')} </span>
                </Grid>
              ) : (
                ''
              )}
              {samityInfo.website ? (
                <Grid item md={4} xs={12}>
                  <span>ওয়েব সাইট : {samityInfo.website}</span>
                </Grid>
              ) : (
                ''
              )}

              <Grid item md={4} xs={12}>
                <span>মোবাইল নং : {numberToWord('' + samityInfo.mobile + '')}</span>
              </Grid>
              {samityInfo.orgNameBangla ? (
                <Grid item md={4} xs={12}>
                  <span>উদ্যোগী সংস্থার নাম : {samityInfo.orgNameBangla}</span>
                </Grid>
              ) : (
                ''
              )}

              {samityInfo.email ? (
                <Grid item md={4} xs={12}>
                  <span>ই - মেইল : ‍{samityInfo.email}</span>
                </Grid>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid container className="section">
          <Grid item xs={12}>
            <SubHeading>লক্ষ্য ও উদ্দেশ্য</SubHeading>
            <Grid px={1}>
              <div dangerouslySetInnerHTML={{ __html: unescape(element) }}></div>
            </Grid>
          </Grid>
        </Grid>

        {/* ==============================NEED to FIX=========================== */}
        <Grid container className="section">
          <Grid item xs={12}>
            <SubHeading>সদস্যের তালিকা ও আর্থিক তথ্য</SubHeading>
            <Grid container>
              {samityLevel == 'P' ? (
                <TableContainer className="table-container lg-table">
                  <Table aria-label="simple table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell align="center">সদস্য কোড</TableCell>
                        <TableCell>এনআইডি/জন্ম নিবন্ধন</TableCell>
                        <TableCell align="center">জন্মতারিখ</TableCell>
                        <TableCell>নাম</TableCell>
                        <TableCell>পেশা</TableCell>
                        <TableCell align="center">মোবাইল</TableCell>
                        <TableCell align="center">শেয়ার</TableCell>
                        <TableCell align="right">সঞ্চয় (টাকা)</TableCell>
                        <TableCell align="right">ঋণ (টাকা)</TableCell>
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
                                  <div className="tootlip-title">
                                    {memb.nid ? numberToWord('' + memb.nid + '') : numberToWord('' + memb.brn + '')}
                                  </div>
                                }
                              >
                                <span className="data">
                                  {memb.nid ? numberToWord('' + memb.nid + '') : numberToWord('' + memb.brn + '')}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">{numberToWord('' + dateFormat(memb.dob) + '')}</TableCell>
                            <TableCell>{memb.memberNameBangla}</TableCell>
                            <TableCell>{memb.occupationName}</TableCell>
                            <TableCell align="center">{numberToWord('' + memb.mobile + '')}</TableCell>
                            <TableCell align="center">{numberToWord('' + memb.noOfShare + '')}</TableCell>
                            <TableCell align="right">{numberToWord('' + memb.savingsAmount + '')}</TableCell>
                            <TableCell align="right">{numberToWord('' + memb.loanOutstanding + '')}</TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  <div className="tootlip-title">
                                    {memb?.address[0]?.detailsAddress}
                                    {memb?.address[0]?.detailsAddress ? ' ,' : ''}
                                    {memb?.address[0]?.uniThanaPawNameBangla},{memb?.address[0]?.upaCityNameBangla},{' '}
                                    {memb?.districtNameBangla}
                                  </div>
                                }
                              >
                                <span className="data">
                                  {memb?.address[0]?.detailsAddress}
                                  {memb?.address[0]?.detailsAddress ? ' ,' : ''}
                                  {memb?.address[0]?.uniThanaPawNameBangla},{memb?.address[0]?.upaCityNameBangla},{' '}
                                  {memb?.districtNameBangla}
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
                                      maxHeight: '40px',
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
              {samityLevel == 'C' || samityLevel == 'N' ? (
                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table" className="lg-table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell align="center">ক্রমিক নং</TableCell>
                        <TableCell>সদস্যের নাম</TableCell>
                        <TableCell align="center">সদস্য / সমিতি কোড</TableCell>
                        <TableCell>স্বাক্ষরিত ব্যক্তি</TableCell>
                        <TableCell align="center">ফোন নং</TableCell>
                        <TableCell>ঠিকানা</TableCell>
                        <TableCell align="center">সংযুক্তি</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {membersData != undefined
                        ? membersData.map((memb, i) => (
                          <TableRow key={i}>
                            <TableCell align="center">{numberToWord('' + (i + 1) + '')}</TableCell>
                            <TableCell>{memb.memberName}</TableCell>
                            <TableCell align="center">
                              {/* {numberToWord("" + memb.memberCode + "")} */}
                              {memb.memberCode
                                ? numberToWord('' + memb.memberCode + '')
                                : numberToWord('' + memb.centralSamityCode + '')}
                            </TableCell>
                            <TableCell>{memb.samitySignatoryPerson}</TableCell>
                            <TableCell align="center">{numberToWord('' + memb.phone + '')}</TableCell>

                            <TableCell>{memb.samityDetailsAddress || memb.centralSamityDetailsAddress}</TableCell>
                            <TableCell align="center">
                              {memb.documents.map((img) => (
                                <Zoom zoomMargin={40} key={img.docId}>
                                  <img
                                    alt={img.docId}
                                    src={img.fileNameUrl}
                                    style={{
                                      maxHeight: '40px',
                                      border: '1px solid var(--color-primary)',
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
          <Grid item lg={12} md={12} xs={12}>
            <SubHeading>কমিটির পদ বরাদ্দকরন</SubHeading>
            <Grid
              container
              sx={{
                bgcolor: '#d3d3d3',
                borderRadius: '4px',
                p: '1rem',
                flexDirection: 'column',
              }}
            >
              <Grid item xs={12}>
                <span className="label">সংগঠক : {committeePerson.committeeOrganizer} </span>
              </Grid>
              <Grid item xs={12}>
                <span>যোগাযোগের ব্যক্তি : {committeePerson.committeeContactPerson} </span>
              </Grid>
              <Grid item xs={12}>
                <span>স্বাক্ষরিত ব্যক্তি : {committeePerson.committeeSignatoryPerson}</span>
              </Grid>
            </Grid>
            <Grid container pt={2}>
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
                    {committee.map((degs, i) => (
                      <TableRow key={i}>
                        <TableCell align="center" scope="row">
                          {numberToWord('' + (i + 1) + '')}{' '}
                        </TableCell>
                        <TableCell>
                          {degs.memberNameBangla || degs.memberName}
                          {samityLevel == 'C' || samityLevel == 'N'
                            ? '- ( ' + cenNatMemName(degs.memberId, samityLevel) + ' )'
                            : ''}
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
            <SubHeading>ডকুমেন্টের তথ্য</SubHeading>
            <Grid container>
              <TableContainer className="table-container">
                <Table aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell align="center">ক্রমিক নং</TableCell>
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
                        <TableCell>{numberToWord('' + row.documentNo + '')}</TableCell>
                        <TableCell align="center">
                          {row.effectDate ? numberToWord(dateFormat(row.effectDate)) : ''}
                        </TableCell>
                        <TableCell align="center">
                          {row.expireDate ? numberToWord(dateFormat(row.expireDate)) : ''}
                        </TableCell>
                        <TableCell align="center" sx={{ padding: '0' }}>
                          <ZoomImage
                            src={row?.documentNameUrl}
                            imageStyle={{
                              maxHeight: '40px',
                              border: '1px solid var(--color-primary)',
                            }}
                            divStyle={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            key={row?.documentId}
                            type={imageType(row?.documentName)}
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

        <Grid container className="section">
          <Grid item lg={12} md={12} xs={12}>
            <SubHeading>সমিতির আয়-ব্যয় হিসাব</SubHeading>
            <Grid container spacing={2.5}>
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
                        <TableCell sx={{ width: '30%' }}>লেজার / হিসাবের কোড</TableCell>
                        <TableCell sx={{ width: '40%' }}>লেজার / হিসাবের নাম</TableCell>
                        <TableCell
                          sx={{
                            width: '30%',
                            textAlign: 'right',
                          }}
                        >
                          টাকা
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {incomeExpenses?.map(
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
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                          মোট
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>{numberToWord('' + totalIncAmt + '')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: 'right', paddingRight: '5px' }}>
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
                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell colSpan={3} className="table-title">
                          খরচ
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ width: '30%' }}>লেজার / হিসাবের কোড</TableCell>
                        <TableCell sx={{ width: '40%' }}>লেজার / হিসাবের নাম</TableCell>
                        <TableCell
                          sx={{
                            width: '30%',
                            textAlign: 'right',
                          }}
                        >
                          টাকা
                        </TableCell>
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
        {/* //////////////////////////// Bugdet part ////////////////////////////// */}
        {budgetkey.map((key, i) => (
          <Grid key={i} container className="section">
            <Grid item lg={12} md={12} xs={12}>
              <SubHeading>
                সমিতির বাজেট বছর &nbsp;&nbsp;
                {key.toString()
                  ? numberToWord('' + key.substring(0, 4) + '') + '-' + numberToWord('' + key.substring(4, 8) + '')
                  : ''}
              </SubHeading>
              <Grid container spacing={2.5}>
                <Grid item lg={6} md={12} xs={12}>
                  <TableContainer className="table-container">
                    <Table size="small" aria-label="a dense table">
                      <TableHead className="table-head">
                        <TableRow>
                          <TableCell colSpan={3} className="table-title">
                            আয়
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ width: '30%' }}>লেজার / হিসাবের কোড</TableCell>
                          <TableCell sx={{ width: '40%' }}>লেজার / হিসাবের নাম</TableCell>
                          <TableCell
                            sx={{
                              width: '30%',
                              textAlign: 'right',
                            }}
                          >
                            টাকা{' '}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {budgets[key].map(
                          (incexps, i) =>
                            incexps.incAmt != 0 && (
                              <TableRow key={i}>
                                <TableCell>
                                  {' '}
                                  {incexps.incAmt != 0 && numberToWord('' + incexps.glacCode + '')}{' '}
                                </TableCell>
                                <TableCell> {incexps.incAmt != 0 && incexps.glacName} </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                  {incexps.incAmt != 0 && numberToWord('' + incexps.incAmt + '')}
                                </TableCell>
                              </TableRow>
                            ),
                        )}
                        {/* total amount  */}
                        <TableRow>
                          <TableCell colSpan={2} sx={{ textAlign: 'right', fontWeight: '700' }}>
                            মোট
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right', fontWeight: '700' }}>
                            {numberToWord('' + totalIncAmount(budgets[key]) + '')}
                          </TableCell>
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
                            ব্যয়
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ width: '30%' }}>লেজার / হিসাবের কোড</TableCell>
                          <TableCell sx={{ width: '40%' }}>লেজার / হিসাবের নাম</TableCell>
                          <TableCell
                            sx={{
                              width: '30%',
                              textAlign: 'right',
                            }}
                          >
                            টাকা
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {budgets[key].map(
                          (incexps, i) =>
                            incexps.expAmt != 0 && (
                              <TableRow key={i}>
                                <TableCell>
                                  {' '}
                                  {incexps.expAmt != 0 && numberToWord('' + incexps.glacCode + '')}{' '}
                                </TableCell>
                                <TableCell> {incexps.expAmt != 0 && incexps.glacName} </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                  {incexps.expAmt != 0 && numberToWord('' + incexps.expAmt + '')}
                                </TableCell>
                              </TableRow>
                            ),
                        )}
                        {/* total amount  */}
                        <TableRow>
                          <TableCell colSpan={2} sx={{ textAlign: 'right', fontWeight: '700' }}>
                            মোট
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right', fontWeight: '700' }}>
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
          <Grid item lg={12} md={12} xs={12}>
            <SubHeading>সমিতি রেজিস্ট্রেশন ফি তথ্য</SubHeading>
            <Grid container spacing={2.5} px={1}>
              <Grid item xl={3} lg={3} md={3} xs={6}>
                সমিতির ধরন
              </Grid>
              <Grid item xl={9} lg={9} md={9} xs={6}>
                :{' '}
                {samityLevel == 'P'
                  ? ' প্রাথমিক'
                  : samityLevel == 'C'
                    ? ' কেন্দ্রীয়'
                    : samityLevel == 'N'
                      ? ' জাতীয়'
                      : ''}
              </Grid>

              <Grid item xl={3} lg={3} md={3} xs={6}>
                সমিতি রেজিস্ট্রেশন ফি{' '}
              </Grid>
              <Grid item xl={9} lg={9} md={9} xs={6}>
                {' '}
                : {numberToWord('' + regFeeDetails.regFee + '')} টাকা
              </Grid>

              <Grid item xl={3} lg={3} md={3} xs={6}>
                সমিতি রেজিস্ট্রেশন ফির ভ্যাট {numberToWord('' + regFeeDetails.RegVat + '')}%
              </Grid>
              <Grid item xl={9} lg={9} md={9} xs={6}>
                {' '}
                : {numberToWord('' + (regFeeDetails.regFee * regFeeDetails.RegVat) / 100 + '')} টাকা
              </Grid>

              <Grid item xl={3} lg={3} md={3} xs={6}>
                মোট
              </Grid>
              <Grid item xl={9} lg={9} md={9} xs={6}>
                {' '}
                : {numberToWord(
                  '' + ((regFeeDetails.regFee * regFeeDetails.RegVat) / 100 + regFeeDetails.regFee) + '',
                )}{' '}
                টাকা
              </Grid>
            </Grid>

            <Grid container spacing={2.5} pt={2}>
              <FromControlJSON
                arr={[
                  {
                    labelName: RequiredFile('চালান নং'),
                    name: 'invoiceNo',
                    onChange: handleChangeRegFee,
                    value: invoiceDetails.invoiceNo,
                    size: 'small',
                    type: 'text',
                    viewType: 'textField',
                    xl: 6,
                    lg: 6,
                    md: 6,
                    xs: 12,
                    autoComplete: 'off',
                    isDisabled: false,
                    placeholder: 'চালান নং টাইপ করুন',
                    customClass: '',
                    customStyle: {},
                    errorMessage: errorInvoiceDetails.invoiceNo,
                  },
                  {
                    labelName: RequiredFile('চালান জমার তারিখ'),
                    onChange: handleChangeRegFeeDate,
                    value: invoiceDetails.invoiceDate,
                    size: 'small',
                    type: 'date',
                    viewType: 'date',
                    dateFormet: 'dd/MM/yyyy',
                    disableFuture: true,
                    MinDate: '01-01-1970',
                    xl: 6,
                    lg: 6,
                    md: 6,
                    xs: 12,
                    isDisabled: false,
                    customClass: '',
                    errorMessage: errorInvoiceDetails.invoiceDate,
                    customStyle: {},
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '1rem' }}>সনদপত্র কিভাবে পেতে চান?</span>

            <FormControl component="fieldset">
              <RadioGroup row aria-label="via" name="viaDocuments" onChange={handleChange}>
                <FormControlLabel
                  value="e"
                  sx={{ color: '#007bff' }}
                  control={<Radio color="primary" />}
                  label="ইমেইল মাধ্যমে"
                />
                <FormControlLabel
                  sx={{ color: '#9c27b0' }}
                  value="u"
                  control={<Radio color="secondary" />}
                  label="উপজেলা অফিসের মাধ্যমে"
                />
                <FormControlLabel
                  sx={{ color: '#28a745' }}
                  value="p"
                  control={<Radio color="success" />}
                  label="পোস্ট অফিস মাধ্যমে"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid itemxs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox sx={{ backgroundColor: '#FFF' }} />}
                label="আমি স্বীকার করিতেছি যে, উপরোক্ত সকল তথ্য জানিয়া ও বুঝিয়া স্বজ্ঞানে প্রদান করিয়াছি"
                name="declaration"
                onChange={handleChange}
                checked={finalDeclaration}
                required
              />
            </FormGroup>
          </Grid>
        </Grid>
      </div>

      <Divider />
      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            আগের পাতায়
          </Button>
        </Tooltip>
        <Tooltip title="প্রিন্ট করুন">
          <Button className="btn btn-primary" startIcon={<PrintIcon />} onClick={printPage}>
            প্রিন্ট করুন
          </Button>
        </Tooltip>
        <Tooltip title="আবেদনের চূড়ান্ত জমা">
          {loadingDataSaveUpdate ? (
            <LoadingButton
              loading
              loadingPosition="start"
              sx={{ mr: 1 }}
              startIcon={<SaveOutlinedIcon />}
              variant="outlined"
            >
              আবেদনের চূড়ান্ত জমা করা হচ্ছে...
            </LoadingButton>
          ) : (
            <Button className="btn btn-save" onClick={finalSubmit} startIcon={<SaveOutlinedIcon />}>
              {' '}
              আবেদনের চূড়ান্ত জমা
            </Button>
          )}
        </Tooltip>
      </Grid>
    </>
  );
};

export default SamityRegReport;
