/* eslint-disable no-dupe-else-if */
/* eslint-disable no-unused-vars */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Loader from 'components/Loader';
import fileCheck from 'components/shared/others/DocImage/FileUploadTypeCheck';
import RequiredFile from 'components/utils/RequiredFile';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { bangToEng, engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import {
  ApproveSamityReportApi,
  BugetYear,
  FeeCollectionSubmitApi,
  samityCorrection1 as application,
  auditInfoBySamity,
} from '../../../../url/coop/ApiList';

import dynamic from 'next/dynamic';
import { formValidator } from 'service/formValidator';
const DynamicDocSectionHeader = dynamic(() => import('components/shared/others/DocImage/DocSectionHeader'), {
  loading: () => <Loader />,
});
const DynamicDocSectionContent = dynamic(() => import('components/shared/others/DocImage/DocSectionContent'), {
  loading: () => <Loader />,
});

const FeeCollection = ({
  samityId,
  approvedSamityLevel,
  feeTypes,
  documentTrueList,
  docTypeName,
  auditFeeList,
  cdfFeeList,
  isApproval,
}) => {
  const router = useRouter();
  const token = localStorageData('token');
  const config = localStorageData('config');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [documentType, setDocumentType] = useState([]);
  const [imageValidation, setImageValidation] = useState([]);
  const [documentList, setDocumentList] = useState([
    {
      documentType: 14,
      documentNumber: '',
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',
      documentPictureBack: '',
      documentPictureBackName: '',
      documentPictureBackType: '',
      documentPictureBackFile: '',
      addDoc: false,
    },
  ]);

  const [formErrors, setFormErrors] = useState({
    paidFee: '',
  });

  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);

  const [loadData, setLoadData] = useState(false);
  const [samityInfo, setSamityInfo] = useState({
    samityCode: '',
    samityName: '',
    samityTypeId: '',
  });
  const [invoiceInfo, setInvoiceInfo] = useState({
    invoiceNo: '',
    paidFee: '',
    chequeNo: '',
    bankName: '',
    budgetYear: '',
  });
  const [auditInfo, setAuditInfo] = useState([]);
  const [auditFee, setAuditFee] = useState([]);
  const [cdfFee, setCdfFee] = useState([]);
  const [update, setUpdate] = useState(false);
  const [documentFetch, setDocumentFetch] = useState([]);
  const [applicationId, setApplicationId] = useState('');
  const [budgetArray, setBudgetArray] = useState([]);

  const [financeData, setFinanceData] = useState([]);

  const appId = router.query.id;

  const clearState = () => {
    setSamityInfo({
      ...samityInfo,
      samityCode: '',
      samityName: '',
      samityTypeId: '',
    });
    setInvoiceInfo({
      ...invoiceInfo,
      invoiceNo: '',
      paidFee: '',
      chequeNo: '',
      bankName: '',
      budgetYear: '',
    });

    setFinanceData();

    setDocumentList([
      {
        documentType: 14,
        documentNumber: '',
        documentPictureFront: '',
        documentPictureFrontName: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        documentPictureBack: '',
        documentPictureBackName: '',
        documentPictureBackType: '',
        documentPictureBackFile: '',
        addDoc: false,
      },
    ]);
  };

  useEffect(() => {
    getBudgetYearInfo();
    if (samityId) {
      samityReport(samityId);
      auditBySamity(samityId);
    }
  }, [samityId]);

  const samityReport = async () => {
    try {
      setLoadData(true);
      const samityData = await axios.get(ApproveSamityReportApi + samityId, config);
      const data = samityData?.data?.data;
      setSamityInfo(data?.samityInfo);
      setLoadData(false);
    } catch (error) {
      errorHandler(error);
      setLoadData(false);
    }
  };

  const auditBySamity = async () => {
    try {
      setLoadData(true);
      const auditData = await axios.get(auditInfoBySamity + samityId, config);
      const data = auditData?.data?.data;
      setApplicationId(data?.applicationId);
      setAuditInfo(data);
      // setAuditFee(auditFeeList);
      // setCdfFee(cdfFeeList);
      setLoadData(false);
    } catch (error) {
      errorHandler(error);
      setLoadData(false);
    }
  };

  let getBudgetYearInfo = async () => {
    try {
      const budgetInfoResp = await axios.get(BugetYear, config);
      setBudgetArray(budgetInfoResp.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  // if (feeTypes == "40") {
  //   const audit = auditFee.find((rate) => rate.level === approvedSamityLevel);
  //   if (audit) {
  //     const auditValue = audit.value;
  //     var auditFeeValue = (auditInfo.profitLoss * auditValue) / 100;
  //   }
  // } else {
  //   const cdf = cdfFee.find((rate) => rate.level === approvedSamityLevel);
  //   if (cdf) {
  //     const cdfValue = cdf.value;
  //     var cdfFeeValue = (auditInfo.profitLoss * cdfValue) / 100;
  //   }
  // }

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        documentType: '',
        documentNumber: '',
        documentPictureFront: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        documentPictureBack: '',
        documentPictureBackType: '',
        documentPictureBackFile: '',
      },
    ]);
    setFormErrorsInDocuments([
      ...formErrorsInDocuments,
      {
        documentType: '',
        documentNumber: '',
        documentPictureFrontFile: '',
        documentPictureBackFile: '',
      },
    ]);
  };

  const handleDocumentList = (e, index) => {
    const { name, value } = e.target;
    const validData = documentType.find((row) => row.id == value);
    setImageValidation(validData?.documentProperties);
    const list = [...documentList];
    switch (name) {
      case 'documentNumber':
        list[index][name] = value;
        break;
      default:
        list[index][name] = parseInt(value) ? parseInt(value) : '';
        break;
    }
    setDocumentList(list);
  };

  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setDocumentList([...changeAddDoc]);
  };

  const fileSelectedHandler = (event, index) => {
    const { name, value } = event.target;
    let list = [...documentList];
    list[index][name] = '';
    list[index][name + 'Name'] = '';
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let fileSize = event.target.files[0].size;
      if (fileSize > 3000000) {
        NotificationManager.error('ফাইল সাইজ 3MB এর বড় হতে পারবে না');
        return;
      }
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);
        if (base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = event.target.files[0];
          if (
            event.target.files[0].name.includes('.jpg') ||
            event.target.files[0].name.includes('.png') ||
            event.target.files[0].name.includes('.JPEG') ||
            event.target.files[0].name.includes('.pdf') ||
            event.target.files[0].name.includes('.jpeg')
          ) {
            setDocumentList(list);
          } else {
            NotificationManager.error('jpg, png, JPEG, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন');
            return;
          }
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'প্রদর্শনযোগ্য নয়') {
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = event.target.files[0];
          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'সমর্থিত নয়') {
          list[index][name + 'Name'] = 'ফাইল টাইপটি বৈধ নয়';
          setDocumentList(list);
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'ফাইলের ধরন সমর্থিত নয়';
          setDocumentList(list);
        }
      };
      reader.onerror = () => {
        NotificationManager.error('ফাইল পড়া যাচ্ছে না', 'Error', 5000);
      };
    }
  };

  const removeDocumentImageFront = (e, index) => {
    const list = [...documentList];
    list[index]['documentPictureFront'] = '';
    list[index]['documentPictureFrontType'] = '';
    setDocumentList(list);
  };

  const removeDocumentImageBack = (e, index) => {
    const list = [...documentList];
    list[index]['documentPictureBack'] = '';
    list[index]['documentPictureBackType'] = '';
    setDocumentList(list);
  };
  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);
    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
  };

  const getDocTypeNameBangla = (docId) => {
    if (parseInt(docId) === 14) {
      return 'চালান কপি';
    }
    if (parseInt(docId) === 33) {
      return 'চেক';
    }
  };

  const buildDocumentPayload = (documentList) => {
    let docList = [];
    if (!update) {
      documentList.map((docInfo) => {
        docInfo.documentPictureFrontFile.split;
        docList.push({
          documentId: parseInt(docInfo.documentType),
          ...(docInfo.documentNumber && {
            documentNo: docInfo.documentNumber.toString(),
            documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
          }),

          documentName: [
            {
              name: docInfo.documentPictureFrontFile.name
                ? docInfo.documentPictureFrontFile.name
                : docInfo.documentPictureFrontName,
              mimeType: docInfo.documentPictureFrontType,
              base64Image: docInfo.documentPictureFront,
            },
          ],
        });
      });
    } else if (update) {
      const newDocumentInfo = documentFetch.map((doc, i) => {
        return doc.documentName[0].fileName;
      });

      documentList.map((docInfo, i) => {
        if (!newDocumentInfo.includes(docInfo.documentPictureFrontName)) {
          docList = [
            ...docList,
            {
              documentId: parseInt(docInfo.documentType),
              documentNo: docInfo.documentNumber.toString(),
              documentName: [
                {
                  oldFileName: newDocumentInfo[i],
                  name: docInfo.documentPictureFrontFile.name
                    ? docInfo.documentPictureFrontFile.name
                    : docInfo.documentPictureFrontName,
                  mimeType: docInfo.documentPictureFrontType,
                  base64Image: docInfo.documentPictureFront,
                },
              ],
              documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
            },
          ];
        } else {
          docList = [
            ...docList,
            {
              documentId: parseInt(docInfo.documentType),
              documentNo: docInfo.documentNumber.toString(),
              documentName: [
                {
                  fileName: docInfo.documentPictureFrontName,
                },
              ],
              documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
            },
          ];
        }
      });
    }
    return docList;
  };

  const [regDate, setRegDate] = useState(null);

  let handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj;
    switch (name) {
      case 'invoiceNo':
        setInvoiceInfo({
          ...invoiceInfo,
          [name]: value,
        });
        break;
      case 'paidFee':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setInvoiceInfo({
          ...invoiceInfo,
          [name]: resultObj?.value,
        });
        setFormErrors({
          ...formErrors,
          [name]:
            parseInt(bangToEng(resultObj?.value)) > financeData.audit_fee
              ? 'প্রদানকৃত ফি অডিট ফি হইতে বড় হতে পারবেন না'
              : parseInt(bangToEng(resultObj?.value)) == 0
                ? 'প্রদানকৃত ফি কখনই ০(শূন্য) এর ছোট হবে না'
                : '',
        });
        break;
      case 'invoiceDate':
        setInvoiceInfo({
          ...invoiceInfo,
          [name]: value,
        });
        break;
      case 'chequeNo':
        setInvoiceInfo({
          ...invoiceInfo,
          [name]: value,
        });
        break;
      case 'bankName':
        setInvoiceInfo({
          ...invoiceInfo,
          [name]: value,
        });
        break;
      case 'budgetYear':
        setInvoiceInfo({
          ...invoiceInfo,
          [name]: value,
        });
        getDateRange(value);
        break;
      default:
        setInvoiceInfo({
          ...invoiceInfo,
          [name]: value,
        });
    }
  };

  const getDateRange = async (inputYearRange) => {
    var year = inputYearRange.split('-');
    var startYear = parseInt(year[0]);
    var endYear = parseInt(year[1]);

    var startDate = startYear + '-07-01'; //2022-07-01
    var endDate = endYear + '-06-30'; //2023-06-30

    financeYearly(samityId, startDate, endDate);
  };

  //financeYearly(samityId, startDates, endDates);

  const financeYearly = async (samityId, startDate, endDate) => {
    try {
      setLoadData(true);
      const financeData = await axios.get(
        application +
        '?samityId=' +
        samityId +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate +
        '&type=feeCollection',
        config,
      );
      const data = financeData?.data?.data;
      setFinanceData(data);
      setLoadData(false);
    } catch (error) {
      errorHandler(error);
      setLoadData(false);
    }
  };

  const handleRegDateChange = (e) => {
    setRegDate(e);
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let feeCollectionData;

    const current = new Date();
    const currentDate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    let payload = {
      serviceName: 'feeCollection',
      samityId: samityId,
      data: {
        documentInfo: buildDocumentPayload(documentList),
        refAppId: applicationId,
        feeType: feeTypes,
        feeTypeName: docTypeName,
        applyDate: currentDate,
        income: financeData.cr_amount,
        expense: financeData.dr_amount,
        feeInfo: {
          ...(parseInt(feeTypes) == 40
            ? {
              auditFee: financeData.audit_fee,
              auditFeeCollection: bangToEng(invoiceInfo.paidFee),
              auditFeeWaiver: 0,
              invoiceNo: invoiceInfo.invoiceNo,
              invoiceDate: dateFormat(regDate),
            }
            : {
              cdfFee: financeData.cdf_fee,
              cdfFeeCollection: bangToEng(invoiceInfo.paidFee),
              cdfFeeWaiver: 0,
              chequeNo: invoiceInfo.chequeNo,
              bankName: invoiceInfo.bankName,
              chequeDate: dateFormat(regDate),
            }),
        },
        samityInfo: {
          samityId: samityId,
          samityCode: samityInfo?.samityCode,
          samityName: samityInfo?.samityName,
          samityLevel: approvedSamityLevel,
          samityRegDate: dateFormat(samityInfo?.samityRegistrationDate),
          samityTypeName: samityInfo?.samityTypeName,
          projectName: samityInfo?.projectName,
          samityAddress: samityInfo?.samityDetailsAddress,
          unionName: samityInfo?.uniThanaPawNameBangla,
          upazilaName: samityInfo?.upaCityNameBangla,
          districtName: samityInfo?.officeDistrictNameBangla,
          divisionName: samityInfo?.officeDivisionNameBangla,
        },
      },
    };

    try {
      feeCollectionData = await axios.post(FeeCollectionSubmitApi, payload, config);
      NotificationManager.success(feeCollectionData.data.message, '', 5000);
      clearState();
      setLoadingDataSaveUpdate(false);
      // router.push({ pathname: "coop/samity-accounts-management/fee-collection" });
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  // useEffect(() => {
  //     appnDataInfo(router.query.id);
  // }, [router.query.id]);

  // const appnDataInfo = async (applicationId) => {
  //     if (applicationId) {
  //         try {
  //             const applicationInfoGetData = await axios.get(
  //                 applicationGetById + applicationId,
  //                 config
  //             );
  //             const applicationAllData = applicationInfoGetData.data.data[0];
  //             setAllcontent(applicationAllData.data.content);
  //             setDocumentFetch(applicationAllData.data.documentInfo);

  //             let newEditArray = [];
  //             let docData = applicationAllData?.data?.documentInfo;
  //             for (let i = 0; i < docData.length; i++) {
  //                 newEditArray.push({
  //                     documentType: docData[i]?.documentId,
  //                     documentNumber: docData[i]?.documentNo
  //                         ? docData[i]?.documentNo
  //                         : "",
  //                     documentPictureFront: docData[i]?.documentName[0]?.fileNameUrl,
  //                     documentPictureFrontName: docData[i]?.documentName[0]?.fileName,
  //                     documentPictureFrontType: "",
  //                     documentPictureFrontFile: "",
  //                     update: true,
  //                 });
  //             }
  //             setDocumentList(newEditArray);
  //             setUpdate(true);
  //         } catch (error) {
  //             errorHandler(error);
  //         }
  //     }
  // };

  return (
    <Fragment>
      {loadData ? (
        <Loader />
      ) : (
        <Fragment>
          <Grid container spacing={2} px={1.5} pb={2}>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              <TextField
                fullWidth
                label={RequiredFile('অর্থবছর')}
                name="budgetYear"
                select
                SelectProps={{ native: true }}
                value={invoiceInfo.budgetYear ? invoiceInfo.budgetYear : 0}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#FFF' }}
              >
                <option value={0}>- নির্বাচন করুন -</option>
                {budgetArray.map((option, i) => (
                  <option key={i} value={option.financialYear}>
                    {engToBang(option.financialYear)}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              <div className="info">
                <span className="label">আয় :&nbsp;</span>
                {numberToWord(
                  '' + financeData?.cr_amount
                    ? financeData?.cr_amount
                    : auditInfo?.income
                      ? auditInfo?.income
                      : '0' + '',
                )}{' '}
                টাকা
              </div>
            </Grid>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              <div className="info">
                <span className="label">ব্যয় :&nbsp;</span>
                {numberToWord(
                  '' + financeData?.dr_amount
                    ? financeData?.dr_amount
                    : auditInfo?.expense
                      ? auditInfo?.expense
                      : '0' + '',
                )}{' '}
                টাকা
              </div>
            </Grid>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              <div className="info">
                <span className="label">লাভ/ক্ষতি :&nbsp;</span>
                {numberToWord('' + financeData?.profit ? financeData?.profit : '0' + '')} টাকা
              </div>
            </Grid>
            {feeTypes == '40' ? (
              <>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">নিরীক্ষা ফি :&nbsp;</span>
                    {numberToWord(
                      '' + financeData?.audit_fee
                        ? financeData?.audit_fee
                        : auditInfo?.audit_fee
                          ? auditInfo?.audit_fee
                          : '0' + '',
                    )}{' '}
                    টাকা
                    <span>
                      {' '}
                      &nbsp;( বিঃদ্রঃ মোট লাভের শতক বা তার কম হলে ১০ টাকা হারে প্রাথমিক হলে সর্বোচ্চ ১০০০০ টাকা,
                      কেন্দ্রীয় ও জাতীয় হলে সর্বোচ্চ ৩০০০০ টাকা )
                    </span>
                  </div>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">আদায় :&nbsp;</span>
                    {numberToWord('' + auditInfo?.auditFeeCollection + '')} টাকা
                  </div>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">মওকুফ :&nbsp;</span>
                    {numberToWord('' + auditInfo?.auditFeeWaiver + '')} টাকা
                  </div>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">বকেয়া :&nbsp;</span>
                    {numberToWord('' + auditInfo?.auditFeeOutstanding + '')} টাকা
                  </div>
                </Grid>
              </>
            ) : (
              <>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">সিডিএফ ফি :&nbsp;</span>
                    {numberToWord(
                      '' + financeData?.cdf_fee
                        ? financeData?.cdf_fee
                        : auditInfo?.cdf_fee
                          ? auditInfo?.cdf_fee
                          : '0' + '',
                    )}{' '}
                    টাকা
                    <span> &nbsp;( বিঃদ্রঃ মোট লাভের শতক বা তার কম হলে ৩ টাকা হারে )</span>
                  </div>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">আদায় :&nbsp;</span>
                    {numberToWord('' + auditInfo?.cdfFeeCollection + '')} টাকা
                  </div>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">মওকুফ :&nbsp;</span>
                    {numberToWord('' + auditInfo?.cdfFeeWaiver + '')} টাকা
                  </div>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <div className="info">
                    <span className="label">বকেয়া :&nbsp;</span>
                    {numberToWord('' + auditInfo?.cdfFeeOutstanding + '')} টাকা
                  </div>
                </Grid>
              </>
            )}
          </Grid>
          <Grid container>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography variant="body1" gutterBottom p={2}>
                <b>১) অনলাইনে ফি প্রদান:</b>
                <br />
                একপে এর মাধ্যমে (VISA, Master Card, American Express, bKash, Nagad, Rocket, Upay, Dmoney, OK Wallet,
                Bank Asia, Brack Bank, EBL, City Bank, UCB, AB Bank, DBBL, Midland Bank, MBL Rainbow) অনলাইন ফি প্রদান
                করা যাবে।
                <br />
                <div
                  style={{
                    color: '#0021f3',
                    textAlign: 'center',
                    marginTop: '5px',
                  }}
                >
                  <a href="#">অনলাইন ফি প্রদান করতে এখানে ক্লিক করুন</a>
                </div>
              </Typography>
            </Grid>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography variant="body1" gutterBottom p={2}>
                <b>২) ম্যানুয়াল/অফলাইনে ফি প্রদান:</b>
              </Typography>
              <Grid container spacing={2} px={4} pb={1}>
                {feeTypes == '40' ? (
                  <>
                    <FromControlJSON
                      arr={[
                        {
                          labelName: RequiredFile('প্রদান ফি'),
                          name: 'paidFee',
                          onChange: handleChange,
                          value: invoiceInfo.paidFee,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 4,
                          lg: 4,
                          md: 4,
                          xs: 12,
                          autoComplete: 'off',
                          isDisabled: false,
                          placeholder: 'প্রদান ফি টাইপ করুন',
                          customClass: '',
                          errorMessage: formErrors.paidFee,
                        },
                        {
                          labelName: RequiredFile('চালান নং'),
                          name: 'invoiceNo',
                          onChange: handleChange,
                          value: invoiceInfo.invoiceNo,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 4,
                          lg: 4,
                          md: 4,
                          xs: 12,
                          autoComplete: 'off',
                          isDisabled: false,
                          placeholder: 'চালান নং টাইপ করুন',
                          customClass: '',
                        },
                        {
                          labelName: RequiredFile('চালান জমার তারিখ'),
                          name: 'invoiceDate',
                          onChange: handleRegDateChange,
                          value: regDate,
                          size: 'small',
                          type: 'date',
                          viewType: 'date',
                          dateFormet: 'dd/MM/yyyy',
                          disableFuture: true,
                          MinDate: '01-01-1970',
                          xl: 4,
                          lg: 4,
                          md: 4,
                          xs: 12,
                          isDisabled: false,
                          customClass: '',
                        },
                      ]}
                    />
                  </>
                ) : (
                  <>
                    <FromControlJSON
                      arr={[
                        {
                          labelName: RequiredFile('প্রদান ফি'),
                          name: 'paidFee',
                          onChange: handleChange,
                          value: invoiceInfo.paidFee,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          autoComplete: 'off',
                          isDisabled: false,
                          placeholder: 'প্রদান ফি টাইপ করুন',
                          customClass: '',
                          errorMessage: formErrors.paidFee,
                        },
                        {
                          labelName: RequiredFile('চেক নং'),
                          name: 'chequeNo',
                          onChange: handleChange,
                          value: invoiceInfo.chequeNo,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          autoComplete: 'off',
                          isDisabled: false,
                          placeholder: 'চেক নং টাইপ করুন',
                          customClass: '',
                        },
                        {
                          labelName: RequiredFile('ব্যাংক ও ব্রাঞ্চ নাম'),
                          name: 'bankName',
                          onChange: handleChange,
                          value: invoiceInfo.bankName,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          autoComplete: 'off',
                          isDisabled: false,
                          placeholder: 'ব্যাংক ও ব্রাঞ্চ নাম টাইপ করুন',
                          customClass: '',
                        },
                        {
                          labelName: RequiredFile('চেক জমার তারিখ'),
                          name: 'chequeDate',
                          onChange: handleRegDateChange,
                          value: regDate,
                          size: 'small',
                          type: 'date',
                          viewType: 'date',
                          dateFormet: 'dd/MM/yyyy',
                          disableFuture: true,
                          MinDate: '01-01-1970',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          isDisabled: false,
                          customClass: '',
                        },
                      ]}
                    />
                  </>
                )}
              </Grid>

              <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
              <DynamicDocSectionContent
                documentList={documentList}
                documentType={documentTrueList}
                imageValidation={imageValidation}
                handleDocumentList={handleDocumentList}
                addMoreDoc={addMoreDoc}
                fileSelectedHandler={fileSelectedHandler}
                deleteDocumentList={deleteDocumentList}
                formErrorsInDocuments={formErrorsInDocuments}
                formErrors={formErrors}
                removeDocumentImageFront={removeDocumentImageFront}
                removeDocumentImageBack={removeDocumentImageBack}
              />
            </Grid>
          </Grid>

          <Divider />
          <Grid container className="btn-container">
            {loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                loadingPosition="start"
                sx={{ mr: 1 }}
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
              >
                &nbsp;&nbsp;
                {appId ? 'ফি হালনাগাদ হচ্ছে.......' : 'ফি প্রদান করা হচ্ছে...'}
              </LoadingButton>
            ) : (
              <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
                {' '}
                {appId ? 'ফি হালনাগাদ করুন' : 'ফি প্রদান করুন'}
              </Button>
            )}
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

export default FeeCollection;
