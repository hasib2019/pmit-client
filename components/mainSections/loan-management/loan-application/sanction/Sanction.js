/* eslint-disable no-misleading-character-class */
import DehazeIcon from '@mui/icons-material/Dehaze';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  Grid,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
// import { styled } from '@mui/material/styles';
import axios from 'axios';
import { parseInt } from 'lodash';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { bangToEng, engToBang } from 'service/numberConverter';
import { removeSelectedValue } from '../../../../../service/removeSelectedField';
import {
  codeMaster,
  employeeRecordByOffice,
  getDolMember,
  loanProject,
  loanPurposeList,
  memberForGrantor,
  officeName,
  product,
  samityNameRoute,
  sanctionHelper,
  senctionDoc,
  sendApplyLoan,
  serviceChargeRoute,
  specificApplication,
  submittedDoc,
  updateApplication
} from '../../../../../url/ApiList';
import SubHeading from '../../../../shared/others/SubHeading';
import star from '../utils';
import fileCheck from './FileUploadTypeCheck';
import ownValidator, { mandatory } from './validator';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="dowwn" ref={ref} {...props} />;
});

const DynamicDocSectionHeader = dynamic(() => import('./DocSectionHeader'), {
  loading: () => <p>Loading...</p>,
});
const DynamicDocSectionContent = dynamic(() => import('./DocSectionContent'), {
  loading: () => <p>Loading...</p>,
});
const DynamicJamindarSection = dynamic(() => import('./JamindarSection'), {
  loading: () => <p>Loading...</p>,
});

// const Input = styled('input')({
//   display: 'none',
// });
const frequency = [
  {
    value: 'W',
    label: 'সাপ্তাহিক ',
  },
  {
    value: 'M',
    label: 'মাসিক',
  },
  {
    value: 'Q',
    label: 'ত্রৈমাসিক',
  },
  {
    value: 'O',
    label: 'এককালীন',
  },
];

const gracePeriodArray = [
  {
    value: 'EQUAL',
    label: 'সার্ভিস চার্জ সমভাবে বন্টিত',
  },
  {
    value: 'NO',
    label: 'সার্ভিস চার্জ প্রযোজ্য নয়',
  },
];

const interestTypeArray = [
  {
    value: 'F',
    label: 'ফ্ল্যাট',
  },
  {
    value: 'D',
    label: 'ডিক্লাইন',
  },
  {
    value: 'DOC',
    label: 'কাস্টম',
  },
];

const Sanction = () => {
  const config = localStorageData('config');
  const compoName = localStorageData('componentName');
  const officeInfo = localStorageData('officeGeoData');
  const [disableAddDoc, setDisableAddDoc] = useState(false);
  const [submittedDocs, setSubmittedDocs] = useState([]);
  const [modalClicked, setModalClicked] = useState(false);
  const [modalClicked2, setModalClicked2] = useState(false);
  const [customerInfoArray, setCustomerInfoArray] = useState([]);
  const [intialInstallmentNumber] = useState('');
  const [ProjectName, setProjectName] = useState([]);
  const [projectId, setProjectId] = useState('নির্বাচন করুন');
  const [samityName, setSamityName] = useState([]);
  const [samityId, setSamityId] = useState();
  const [loanPurposeId, setLoanPurposeId] = useState('নির্বাচন করুন');
  const [loanPeriod, setLoanPeriod] = useState(null);
  const [productName, setProductName] = useState([]);
  const [productId, setProductId] = useState('নির্বাচন করুন');
  const [member, setMember] = useState([]);
  // const [sanctionMembers, setSanctionMembers] = useState([]);
  const [othersMember, setOthersMember] = useState([]);
  const [selectedMemberName, setSelectedMemberName] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loanPurposeListData, setLoanPurposeListData] = useState([]);
  const [allProductData, setAllProductData] = useState([]);
  const [loanNumber, setLoanNumber] = useState('');
  const [allowGracePeriod, setAllowGracePeriod] = useState(false);
  // const [allowServiceCharge, setAllowServiceCharge] = useState('');
  // const [totalProductData, setTotalProductData] = useState([]);
  // const [nextAppDesignationId, setNextAppDesignationId] = useState(null);
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [deskObj, setDeskObj] = useState({
    id: '',
    label: '',
  });
  const [samityNameObj, setSamityNameObj] = useState({
    id: '',
    samityName: '',
  });
  const [memberNameObj, setMemberNameObj] = useState();
  const [disableProduct, setDisableProduct] = useState('');
  const [officeNames, setOfficeNames] = useState([]);
  const [nextLoanAmount, setNextLoanAmount] = useState(null);
  const [grantorDisabled, setGrantorDisabled] = useState([
    {
      disableGrantor: false,
    },
  ]);
  const [loadingDropdown, setLoadingDropdown] = useState(true);
  const [loanSectionInfo, setLoanSectionInfo] = useState({
    loanAmount: '',
    applyDate: '',
    loanPeriod: '',
    loanPurpose: '',
    serviceCharge: '',
    frequency: '',
    installmentNumber: '',
    profitAmount: '',
    gracePeriod: '',
    numberOfInstallment: '',
    graceAmtRepayIns: '',
    remarks: '',
    projectName: '',
    productId: '',
    interestType: ' ',
    roundingValue: '',
    roundingType: '',
    holidayEffect: '',
    gracePeriodType: '',
    installmentNoArray: [],
    serviceChargeRate: '',
    samity: '',
    customerId: '',
  });

  const router = useRouter();
  ////////////need to convare base 64 ////////////
  let applicationId = router.query.id;
  let itemValue = router.query.status;
  const [formErrors] = useState({});
  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);
  const [formErrorsInGrantor, setFormErrorsInGrantor] = useState([
    {
      grantorName: '',
      fatherName: '',
      motherName: '',
      mobile: '',
      nidNumber: '',
      birthDate: null,
      occupation: '',
      perAddress: '',
      preAddress: '',
      relation: '',
      grantorOrWitness: 'J',
      personType: '',
      personName: '',
      personInfo: [],
    },
  ]);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [documentType, setDocumentType] = useState([]);
  const [hashArray, setHashArray] = useState([]);
  const [occupationList, setOccupationList] = useState([]);
  const [relationList, setRelationList] = useState([]);
  const [deskList, setDeskList] = useState([]);
  const [serviceAmount, setServiceAmount] = useState('');
  const [installmentAmountValue, setInstallmentAmountValue] = useState('');
  const [singleProductInfo, setSingleProductInfo] = useState('');
  const [particularCustomerInfoArray, setParticularCusotmerInfoArray] = useState([]);
  const [calculation, setCalculation] = useState(0);
  const [disableLoanFrequency, setDisableLoanFequency] = useState('');
  const [disableGrantorAdd, setDisableGrantorAdd] = useState(false);
  const [documentList, setDocumentList] = useState([
    {
      documentType: '',
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

  const [grantorInfo, setGrantorInfo] = useState([
    {
      grantorName: '',
      fatherName: '',
      motherName: '',
      mobile: '',
      nidNumber: '',
      birthDate: null,
      occupation: '',
      perAddress: '',
      preAddress: '',
      relation: '',
      grantorOrWitness: 'J',
      personType: 'N',
      personName: '',
      personInfo: [],
    },
  ]);

  useEffect(() => {
    getOfficeName();
    getProject();
    getOccupation();
    getRelation();
    if (officeInfo?.id) {
      setOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
    }
    getDeskId(officeInfo?.id);
  }, []);

  useEffect(() => {
    allProductData.length > 0 && applicationId && getApplicationDetails(allProductData, applicationId);
  }, [applicationId, allProductData]);

  useEffect(() => {
    if (calculation > 0) {
      // totalInstallmentNumber();
      getServiceCharge();
    }
  }, [calculation]);

  useEffect(() => {
    if (samityName.length >= 0 && loanSectionInfo.samity) {
      setSamityNameObj(samityName?.find((samity) => +samity.id === +loanSectionInfo?.samity));

      // getSanctionMembers(loanSectionInfo.samity);
      getMember(loanSectionInfo.samity);
      getMemberLoanDetails(loanSectionInfo.customerId, loanSectionInfo.productId);
    }
  }, [samityName, loanSectionInfo.samity]);
  useEffect(() => {
    if (member.length >= 0 && loanSectionInfo.customerId) {
      setMemberNameObj(member?.find((customer) => +customer.id === +loanSectionInfo?.customerId));
    }
  }, [member, loanSectionInfo.customerId]);

  const handleClose = () => {
    setModalClicked(false);
  };

  const handleClose2 = () => {
    setModalClicked2(false);
  };

  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);

      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      if (error.response) {
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  const getApplicationDetails = async (getAllProductData, applicationId) => {
    let memberData;
    let otherMembers;
    try {
      const applicationDetailsData = await axios.get(specificApplication + applicationId, config);
      const applicationDetails = applicationDetailsData.data.data;
      const singleProduct = getAllProductData.filter(
        (allProductData) => allProductData.id == applicationDetails.productId,
      );
      try {
        const member = await axios.get(
          getDolMember + '?samityId=' + applicationDetails.samityId + '&flag=1&defaultMembers=1',
          config,
        );
        memberData = member.data.data;
        otherMembers = memberData.filter((obj) => obj.id != applicationDetails.customerId);
        setOthersMember(otherMembers);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
      const grantorInfoNew = applicationDetails.grantorInfo.map((obj) => {
        return {
          ...obj,
          personInfo: otherMembers,
        };
      });
      try {
        const documentTypes = await axios.get(
          senctionDoc +
          '?projectId=' +
          applicationDetails.projectId +
          '&productId=' +
          applicationDetails.productId +
          '&customerId=' +
          applicationDetails.customerId,
          config,
        );
        let documentTypeData = documentTypes.data.data;
        setDocumentType(documentTypeData);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }

      setSingleProductInfo(singleProduct[0]?.intRate);
      setProductId(applicationDetails.productId);
      setLoanSectionInfo({
        applyDate: applicationDetails.applyDate,
        loanAmount: applicationDetails.loanAmount,
        installmentNoArray: singleProduct[0].numberOfInstallment,
        loanPeriod: singleProduct[0].loanTerm,
        loanTerm: applicationDetails.loanTerm,
        serviceChargeRate: applicationDetails.interestRate,
        numberOfInstallment: applicationDetails.installmentNumber,
        installmentAmount: applicationDetails.installmentAmount,
        frequency: applicationDetails.frequency,
        serviceCharge: applicationDetails.serviceCharge,
        productId: applicationDetails.productId,
        projectName: applicationDetails.projectId,
        samity: applicationDetails.samityId,
        customerId: applicationDetails.customerId,
        loanPurpose: applicationDetails.loanPurpose,
        grantorInfo: applicationDetails.grantorInfo,
      });
      // setNextAppDesignationId(applicationDetails.nextAppDesinationId);
      setLoanPurposeId(applicationDetails.loanPurpose);
      setGrantorInfo(grantorInfoNew);
      setDocumentList(applicationDetails.documentList);
      setLoadingDropdown(false);
    } catch (error) {
      if (error.response) {
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
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
  //////////////////////// All Handler Function Blocks //////////////////////
  const handleChange = (e) => {
    let { name, value, id } = e.target;
    let resultedValue;

    if (name == 'loanAmount') {
      value = bangToEng(value);
    }
    if (id == 'number') {
      if (value.length == 1 && value == 0) return;
      if (name == 'loanPeriod' && value.length > 2) {
        return;
      }
      if (name == 'installmentNumber' && value.length > 3) {
        return;
      }

      resultedValue = ownValidator(
        id,
        name,
        value,
        formErrors,
        loanSectionInfo,
        intialInstallmentNumber,
        nextLoanAmount,
      );
      if (resultedValue && !resultedValue.status) {
        formErrors[resultedValue.key] = resultedValue.message;
      }
    }
    if (name == 'loanAmount' || name == 'loanPeriod' || name == 'frequency') {
      if (name == 'loanAmount' && value > 0) {
        if (loanPeriod && loanSectionInfo.frequency) {
          setCalculation(calculation + 1);
        }
      } else if (name == 'loanPeriod' && value > 0) {
        if (loanSectionInfo.loanAmount && loanSectionInfo.frequency) {
          setCalculation(calculation + 1);
        }
      } else if (name == 'frequency' && value > 0) {
        if (loanSectionInfo.loanAmount && loanPeriod) {
          setCalculation(calculation + 1);
        }
      }
      if (name == 'loanAmount') {
        const regex = /[০-৯.,0-9]$/;
        if (regex.test(e.target.value) || e.target.value == '') {
          setLoanSectionInfo({
            ...loanSectionInfo,
            [e.target.name]: bangToEng(e.target.value),
          });
        }
      } else {
        setLoanSectionInfo({
          ...loanSectionInfo,
          [e.target.name]: e.target.value.replace(/\D/g, ''),
        });
      }
    }
    if (name == 'installmentNumber') {
      // if (loanSectionInfo.frequency === 'W') {
      //   getServiceChargewithInstallment(value);
      // }
      setLoanSectionInfo({
        ...loanSectionInfo,
        [e.target.name]: e.target.value.replace(/\D/g, ''),
      });
    }

    if (name == 'remarks') {
      setLoanSectionInfo({
        ...loanSectionInfo,
        [name]: value,
      });
    }
  };

  const handleProject = (e) => {
    const { value } = e.target;
    setSamityNameObj();
    setMemberNameObj();
    setGrantorInfo([
      {
        grantorName: '',
        fatherName: '',
        motherName: '',
        mobile: '',
        nidNumber: '',
        birthDate: null,
        occupation: '',
        perAddress: '',
        preAddress: '',
        relation: '',
        grantorOrWitness: 'J',
        personType: '',
        personName: '',
        personInfo: [],
      },
    ]);
    setLoanSectionInfo({
      loanAmount: '',
      applyDate: '',
      loanPeriod: '',
      serviceCharge: '',
      frequency: '',
      installmentNumber: '',
      profitAmount: '',
      installmentAmount: '',
      gracePeriod: '',
      numberOfInstallment: '',
      graceAmtRepayIns: '',
      remarks: '',
      projectName: '',
      interestType: ' ',
    });
    setFormErrorsInGrantor([
      {
        grantorName: '',
        fatherName: '',
        motherName: '',
        mobile: '',
        nidNumber: '',
        birthDate: null,
        occupation: '',
        perAddress: '',
        preAddress: '',
        relation: '',
        grantorOrWitness: 'J',
        personType: '',
        personName: '',
        personInfo: '',
      },
    ]);
    setSubmittedDocs([]);
    setDocumentList([
      {
        documentType: '',
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
    setProjectId(value);
    if (removeSelectedValue(value)) {
      getSamity(value);
      getProduct(value);
      getLoanPurpose(value);
    } else {
      setProductName([]);
      setDisableProduct(false);
    }
  };

  const handleProduct = (e) => {
    const { value } = e.target;

    setProductId(value);
    if (value != 'নির্বাচন করুন') {
      const singleProduct = allProductData.filter((allProductData) => allProductData.id == value);

      setSingleProductInfo(singleProduct[0]?.intRate);
      setLoanSectionInfo({
        ...loanSectionInfo,
        serviceChargeRate: singleProduct[0].intRate,
        loanPeriod: singleProduct[0].loanTerm,
        interestType: singleProduct[0].calType,
        installmentNoArray: singleProduct[0].numberOfInstallment,
        frequency: singleProduct[0].repFrq,
        gracePeriodType: singleProduct[0].graceAmtRepayIns,
        gracePeriod: singleProduct[0].gracePeriod,
        doptorId: singleProduct[0].doptorId,
        holidayEffect: singleProduct[0].holidayEffect,
        roundingType: singleProduct[0].installmentAmountMethod,
        roundingValue: singleProduct[0].installmentDivisionDigit,
      });
      setAllowGracePeriod(singleProduct[0].allowGracePeriod);
      // setAllowServiceCharge(singleProduct[0].serCrgAtGracePeriod);
      setDisableLoanFequency(true);
      if (selectedMember) {
        setLoanNumber('');
        setNextLoanAmount(null);
        setLoanSectionInfo({
          ...loanSectionInfo,
          loanAmount: '',
        });
        getMemberLoanDetails(selectedMember, value);
      }
    }
  };

  const handleLoanPeriod = (e) => {
    const { value } = e.target;
    setLoanPeriod(value);
    if (value && value != 'নির্বাচন করুন') {
      const periodValueIndex = loanSectionInfo.loanPeriod.findIndex((eachPeriodValue) => eachPeriodValue == value);
      if (periodValueIndex != -1)
        setLoanSectionInfo({
          ...loanSectionInfo,
          numberOfInstallment: loanSectionInfo.installmentNoArray[periodValueIndex],
        });
      setDisableLoanFequency(true);
      setCalculation(calculation + 1);
    }
  };

  const getSubmittedDoc = async (value) => {
    if (value != 'নির্বাচন করুন') {
      try {
        const documentTypes = await axios.get(
          submittedDoc + '?projectId=' + projectId + '&productId=' + productId + '&customerId=' + value,
          config,
        );
        let documentTypeData = documentTypes?.data?.data;
        setSubmittedDocs(documentTypeData);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  const handleMember = async (value) => {
    setHashArray([]);
    if (value != 'নির্বাচন করুন') {
      const list = [];
      const otherMembers = member.filter((obj) => obj.id != value);
      setOthersMember(otherMembers);
      list.push({
        grantorName: '',
        fatherName: '',
        motherName: '',
        mobile: '',
        nidNumber: '',
        birthDate: null,
        occupation: '',
        perAddress: '',
        preAddress: '',
        relation: '',
        grantorOrWitness: 'J',
        personType: '',
        personName: '',
        personInfo: otherMembers,
      });
      setDisableAddDoc(false);
      setGrantorInfo(list);
      setSelectedMember(value);
      // getServiceCharge(memberLoanDetailsResult);
      if (value) {
        if (productId != 'নির্বাচন করুন') {
          setLoanNumber('');
          setNextLoanAmount(null);
          setLoanSectionInfo({
            ...loanSectionInfo,
            loanAmount: '',
          });
          await getMemberLoanDetails(value, productId);
        }
        getSubmittedDoc(value);
        getDocumentType(value);
      }
      setDocumentList([
        {
          documentType: '',
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
    } else {
      setSelectedMember(value);
      // NotificationManager.error("প্সদস্য নির্বাচনকরুন", "Warning", 5000);
    }

    if (loanPeriod && loanSectionInfo.frequency && loanSectionInfo.loanAmount) {
      setCalculation(calculation + 1);
    }

    // ownValidator(id, name, value,formErrors,loanSectionInfo,nextLoanAmount);
  };

  let filterArrayOfSelected = async (array, index, id) => {
    array = array.filter((elem, i) => {
      if (i == index) {
        return elem;
      } else {
        return elem.id != id;
      }
    });
    return array;
  };

  const handleGrantorInfo = async (e, index) => {
    const { id, name, value } = e.target;

    let list = [...grantorInfo];
    const otherMembersList = [...othersMember];
    let result;
    let selectedID;
    if (name == 'nidNumber' || name == 'mobile') {
      if (name == 'nidNumber' && value.length == 18) {
        return;
      }
      if (name == 'mobile' && value.length == 12) {
        return;
      }
      result = mandatory(id, name, value, formErrorsInGrantor, index);
      if (!result.status) {
        formErrorsInGrantor[index][result.key] = result.message;
      } else {
        formErrorsInGrantor[index][result.key] = result.message;
      }
      if (value.length == 0) {
        formErrorsInGrantor[index][name] = '';
      }
      list[index][name] = value.replace(/\D/g, '');
      setGrantorInfo(list);
      return;
    }

    if (name == 'grantorName' || name == 'fatherName' || name == 'motherName') {
      let regexResultFunc = (regex, value) => {
        return regex.test(value);
      };

      if (regexResultFunc(/[A-Za-z]/gi, value)) {
        list[index][name] = value.replace(/[^A-Za-z\s-]/gi, '');
        setGrantorInfo(list);
        return;
      } else {
        list[index][name] = value.replace(
          /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09FA -]/gi,
          '',
        );
        setGrantorInfo(list);
        return;
      }
    }

    if (name == 'personType') {
      if (value == 'N') {
        let list = [...grantorInfo];
        let grantorDisable = [...grantorDisabled];
        list[index]['nidNumber'] = '';
        list[index]['birthDate'] = null;
        list[index]['grantorName'] = '';
        list[index]['fatherName'] = '';
        list[index]['motherName'] = '';
        list[index]['mobile'] = '';
        list[index]['occupation'] = '';
        list[index]['perAddress'] = '';
        list[index]['preAddress'] = '';
        list[index]['personName'] = '';
        setGrantorInfo([...grantorInfo, list]);
        grantorDisable[index]['disableGrantor'] = false;
        setGrantorDisabled(grantorDisable);
      }
    }

    if (name == 'personName' && value != 'নির্বাচন করুন') {
      let hashedArray = [...hashArray];
      list = await getMemberInfo(value, index);

      if (!list) {
        return;
      }
      let present = false;
      let selectedIndex;
      hashedArray.map((elem, i) => {
        if (elem.index == index) {
          present = true;
          elem.id = value;
          selectedID = value;
          selectedIndex = i;
        }
      });
      if (!present) {
        hashedArray.push({
          index,
          id: value,
        });
      } else {
        hashedArray = await filterArrayOfSelected(hashedArray, selectedIndex, selectedID);
      }
      setHashArray(hashedArray);
      let selectedIDArray = hashedArray.map((element) => element.id);
      let newlyRemainingIdArray;

      newlyRemainingIdArray = otherMembersList.filter((element) => {
        if (selectedIDArray.indexOf(element.id) == -1) {
          return element;
        }
      });

      let selectedIndexArray = hashedArray.map((element) => element.index);
      list
        ? list.map((obj, index) => {
          if (selectedIndexArray.indexOf(index) == -1) {
            obj['personInfo'] = newlyRemainingIdArray;
          }
        })
        : '';
    }
    list[index][name] = value;
    setGrantorInfo(list);
  };

  const handleLoanPurpose = (e) => {
    const { value } = e.target;
    setLoanPurposeId(value);
  };

  const handleDocumentList = (e, index) => {
    const { name, value } = e.target;
    const list = [...documentList];
    const documentTypeArray = [...documentType];
    if (name == 'documentNumber' && value.length == 20) {
      return;
    }
    switch (name) {
      case 'documentType':
        if (value != 'নির্বাচন করুন') {
          const selectedObj = documentTypeArray.find((elem) => elem.docType == value);

          formErrorsInDocuments[index]['documentNumber'] = '';

          list[index]['documentNumber'] = '';
          list[index]['isDocMandatory'] = selectedObj['isDocNoMandatory'];
          list[index]['docTypeDesc'] = selectedObj['docTypeDesc'];
        }
        break;

      case 'documentNumber':
        if (value.length > 30) {
          return;
        }
        if (list[index]['documentType'] == 'NID' || list[index]['documentType'] == 'GID') {
          if (value.length == 18) {
            return;
          }
          formErrorsInDocuments[index]['documentNumber'] =
            value.length == 10 || value.length == 17 || value.length == 0 ? '' : 'আপনার সঠিক এনআইডি প্রদান করুন';

          list[index][name] = value.replace(/\D/gi, '');
          setDocumentList(list);
          return;
        } else if (list[index]['documentType'] == 'BRN') {
          if (value.length > 19) {
            return;
          }
          list[index][name] = value.replace(/\D/gi, '');
          setDocumentList(list);
          return;
        } else if (list[index]['documentType'] == 'TRN') {
          if (value.length > 19) {
            return;
          }
          list[index][name] = value;
          setDocumentList(list);
        } else if (list[index]['documentType'] == 'COM') {
          if (value.length > 20) {
            return;
          }
          list[index][name] = value;
          setDocumentList(list);
          return;
        }
        // else {
        //   formErrorsInDocuments[index]['documentNumber'] = ""
        // }
        // return;
        break

    }
    // result = documentChecking(index, name, value, documentList[index], formErrorsInDocuments)

    // if (result && !result.status) {
    //   formErrorsInDocuments[index][result.key] = result.message
    // }
    // else if (result && result.status) {
    //   formErrorsInDocuments[index][result.key] = result.message
    // }
    list[index][name] = value;
    setDocumentList(list);
  };

  const handleDateChangeEx = (e, index) => {
    const list = [...grantorInfo];
    list[index]['birthDate'] = new Date(e);
    setGrantorInfo(list);
  };

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
    if (documentList.length + 1 == documentType.length) {
      setDisableAddDoc(true);
    } else {
      setDisableAddDoc(false);
    }
  };

  const handleAddGrantorInfo = () => {
    let otherMembersList = [...othersMember];
    let hashedArray = [...hashArray];
    let selectedIDArray = hashedArray.map((element) => element.id);
    let newlyRemainingIdArray;

    newlyRemainingIdArray = otherMembersList.filter((element) => {
      if (selectedIDArray.indexOf(element.id) == -1) {
        return element;
      }
    });
    setGrantorInfo([
      ...grantorInfo,
      {
        grantorName: '',
        fatherName: '',
        motherName: '',
        mobile: '',
        nidNumber: '',
        occupation: '',
        perAddress: '',
        preAddress: '',
        relation: '',
        birthDate: null,
        personInfo: newlyRemainingIdArray,
        personName: '',
        personType: 'N',
      },
    ]);
    setFormErrorsInGrantor([
      ...formErrorsInGrantor,
      {
        grantorName: '',
        fatherName: '',
        motherName: '',
        mobile: '',
        nidNumber: '',
        birthDate: null,
        occupation: '',
        perAddress: '',
        preAddress: '',
        relation: '',
        grantorOrWitness: 'J',
        personType: '',
        personName: '',
        personInfo: '',
      },
    ]);
    // if (grantorInfo.length == otherMembersList.length - 1) {
    //   setDisableGrantorAdd(true)
    // }
    setGrantorDisabled([
      ...grantorDisabled,
      {
        disableGrantor: false,
      },
    ]);
  };

  const fileSelectedHandler = (event, index) => {
    const { name } = event.target;
    let list = [...documentList];
    list[index][name] = '';
    list[index][name + 'Name'] = '';
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);

        // setProfileImage(base64Image);
        // setProfileImageType(file.type);
        if (typeStatus.showAble && base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = event.target.files[0];
          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not showable') {
          // list[index][name] = base64Image;
          //setDocumentList(list);
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = event.target.files[0];
          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not supported') {
          list[index][name + 'Name'] = 'Invalid File Type';
          setDocumentList(list);
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'File Type is not Supported';
          setDocumentList(list);
        }
      };
      reader.onerror = () => {
        NotificationManager.error('File can not be read', 'Error', 5000);
      };
    }
  };

  ///////////////////////////// All Get Api Calling Blocks/////////////////////

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      if (projectList.length == 1) {
        setProjectId(projectList[0].id);
        getSamity(projectList[0].id);
        getProduct(projectList[0].id);
        getLoanPurpose(projectList[0].id);
      }
      setProjectName(projectList);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getProduct = async (proId) => {
    if (proId != 'নির্বাচন করুন') {
      try {
        const allProduct = await axios.get(product + '?projectId=' + proId + '&productType=A&depositNature=L', config);
        let productList = allProduct.data.data;
        // setTotalProductData(productList);
        if (productList.length == 1) {
          setProductId(productList?.[0].id);
          const singleProduct = productList.filter((allProductData) => allProductData.id == productList?.[0].id);
          setSingleProductInfo(singleProduct[0].intRate);
          setLoanSectionInfo({
            ...loanSectionInfo,
            // frequency: singleProduct?.[0].repFrq,
            // gracePeriod: singleProduct[0].gracePeriod,
            // graceAmtRepayIns: singleProduct[0].graceAmtRepayIns,
            // installmentNumber: singleProduct[0].numberOfInstallment,
            // loanPeriod: singleProduct[0].loanTerm,
            // interestType: singleProduct[0].calType
            serviceChargeRate: singleProduct[0].intRate,
            loanPeriod: singleProduct[0].loanTerm,
            interestType: singleProduct[0].calType,
            installmentNoArray: singleProduct[0].numberOfInstallment,
            frequency: singleProduct[0].repFrq,
            gracePeriodType: singleProduct[0].graceAmtRepayIns,
            gracePeriod: singleProduct[0].gracePeriod,
            doptorId: singleProduct[0].doptorId,
            holidayEffect: singleProduct[0].holidayEffect,
            roundingType: singleProduct[0].installmentAmountMethod,
            roundingValue: singleProduct[0].installmentDivisionDigit,
          });
          setAllowGracePeriod(productList[0].allowGracePeriod);
          // setAllowServiceCharge(singleProduct[0].serCrgAtGracePeriod);
          setDisableLoanFequency(true);
          if (loanSectionInfo.loanAmount && loanPeriod && loanSectionInfo.frequency) {
            getServiceCharge();
          }
          setDisableProduct(true);
        } else {
          setDisableProduct(false);
        }
        setProductName(productList);
        setAllProductData(productList);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  const getMemberInfo = async (value, index) => {
    const list = [...grantorInfo];
    let NID;
    try {
      const member = await axios.get(memberForGrantor + '=' + value, config);
      let memberData = member?.data?.data;
      let memberDoc = member?.data?.data?.documentData?.own;
      let documentObject = memberDoc?.filter((nid) => nid.documentType == 'NID');
      if (documentObject) {
        NID = documentObject[0]?.documentNumber;
      }
      list[index]['nidNumber'] = NID ? NID : '';
      list[index]['birthDate'] = memberData?.birthDate ? memberData.birthDate : null;
      list[index]['grantorName'] = memberData?.nameBn ? memberData.nameBn : '';
      list[index]['fatherName'] = memberData?.motherName ? memberData.fatherName : '';
      list[index]['motherName'] = memberData?.motherName ? memberData.motherName : '';
      list[index]['mobile'] = memberData?.mobile ? memberData.mobile : '';
      list[index]['occupation'] = memberData?.occupation ? memberData.occupation : '';
      list[index]['perAddress'] = memberData?.permanentAddress
        ? memberData.permanentAddress.uniThanaPawNameBangla
          ? memberData.permanentAddress.uniThanaPawNameBangla
          : '' + ',' + memberData.permanentAddress.upaCityNameBangla
            ? memberData.permanentAddress.upaCityNameBangla
            : '' + ',' + memberData.permanentAddress.districtNameBangla
              ? memberData.permanentAddress.districtNameBangla
              : ''
        : '';
      list[index]['preAddress'] = memberData?.presentAddress
        ? memberData.presentAddress.uniThanaPawNameBangla
          ? memberData.presentAddress.uniThanaPawNameBangla
          : '' + ',' + memberData.presentAddress.upaCityNameBangla
            ? memberData.presentAddress.upaCityNameBangla
            : '' + ',' + memberData.presentAddress.districtNameBangla
              ? memberData.presentAddress.districtNameBangla
              : ''
        : '';
      let grantorDisable = [...grantorDisabled];
      grantorDisable[index]['disableGrantor'] = true;
      setGrantorDisabled(grantorDisable);
      return list;
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getSamity = async (project) => {
    if (project != 'নির্বাচন করুন') {
      try {
        const samity = await axios.get(samityNameRoute + '?value=1&project=' + project, config);
        let samityData = samity.data.data;
        setSamityName(samityData);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    } else {
      // NotificationManager.error("প্রজেক্ট নির্বাচনকরুন", "Warning", 5000);
    }
  };

  const getMember = async (samityId) => {
    if (samityId != 'নির্বাচন করুন') {
      try {
        const member = await axios.get(getDolMember + '?samityId=' + samityId + '&flag=1&defaultMembers=1', config);
        let memberData = member.data.data;
        setMember(memberData);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    } else {
      // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
    }
  };

  // const getSanctionMembers = async (samityId) => {
  //   if (samityId != 'নির্বাচন করুন') {
  //     try {
  //       const member = await axios.get(appliedLoanMember + '?type=sanction&samityId=' + samityId, config);
  //       let memberData = member.data.data;
  //       setSanctionMembers(memberData);
  //     } catch (error) {
  //       if (error.response) {
  //         let message = error.response.data.errors[0].message;
  //         NotificationManager.error(message, '', 5000);
  //       } else if (error.request) {
  //         NotificationManager.error('Error Connecting...', '', 5000);
  //       } else if (error) {
  //         NotificationManager.error(error.toString(), '', 5000);
  //       }
  //     }
  //   } else {
  //     // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
  //   }
  // };
  const getDocumentType = async (value) => {
    if (productId != 'নির্বাচন করুন' && projectId != 'নির্বাচন করুন') {
      try {
        const documentTypes = await axios.get(
          senctionDoc + '?projectId=' + projectId + '&productId=' + productId + '&customerId=' + value,
          config,
        );
        let documentTypeData = documentTypes.data.data;
        setDocumentType(documentTypeData);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  const getLoanPurpose = async (value) => {
    try {
      const loanPurposeData = await axios.get(loanPurposeList + '?projectId=' + value, config);

      let purposeData = loanPurposeData.data.data;
      setLoanPurposeListData(purposeData);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getOccupation = async () => {
    try {
      let occupationData = await axios.get(codeMaster + '?codeType=OCC', config);
      const occupationDataList = occupationData.data.data;
      setOccupationList(occupationDataList);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getRelation = async () => {
    try {
      let relationData = await axios.get(codeMaster + '?codeType=RLN', config);
      const relationDataList = relationData.data.data;
      setRelationList(relationDataList);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getDeskId = async (id) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, config);
      const deskData = Data.data.data;
      setDeskList(deskData);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getServiceCharge = async (value) => {
    let chargeCalculator;
    if (loanSectionInfo.frequency != 'নির্বাচন করুন') {
      try {
        chargeCalculator = await axios.get(serviceChargeRoute, {
          ...config,
          params: {
            principal: Math.floor(loanSectionInfo.loanAmount ? loanSectionInfo.loanAmount : value),
            loanTerm: loanPeriod,
            rate: loanSectionInfo.serviceChargeRate,
            interestType: loanSectionInfo.interestType,
            installmentNumber: loanSectionInfo.numberOfInstallment,
            officeId: loanSectionInfo.officeId,
            doptorId: loanSectionInfo.doptorId,
            holidayEffect: loanSectionInfo.holidayEffect,
            weekPosition: loanSectionInfo.weekPosition,
            meetingDay: loanSectionInfo.meetingDay,
            roundingType: loanSectionInfo.roundingType,
            roundingValue: loanSectionInfo.roundingValue,
            ...(allowGracePeriod && {
              gracePeriod: loanSectionInfo.gracePeriod,
            }),
            ...(allowGracePeriod && {
              gracePeriodType: loanSectionInfo.gracePeriodType,
            }),
            ...(!allowGracePeriod && {
              gracePeriodType: 'NO-CHARGE',
            }),
            installmentType: loanSectionInfo.frequency,
          },
        });
        let chargeCalculatorData = chargeCalculator.data.data.serviceCharge;
        let installmentAmountData = chargeCalculator.data.data.installmentAmount;
        setServiceAmount(chargeCalculatorData.toFixed(2));
        setInstallmentAmountValue(installmentAmountData);
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    } else {
      setServiceAmount('');
      setInstallmentAmountValue('');
    }
  };
  const getMemberLoanDetails = async (member, product) => {
    try {
      let Data = await axios.get(
        sanctionHelper + '?id=' + member + '&projectId=' + projectId + '&productId=' + product,
        config,
      );
      const loanHelper = Data.data.data;

      setLoanNumber(loanHelper?.currentLoanNo);
      formErrors['loanAmount'] = '';

      setNextLoanAmount(Math.floor(loanHelper.nextMaxLoanAmount));

      {
        itemValue != 'C' &&
          setLoanSectionInfo({
            ...loanSectionInfo,
            loanAmount: Math.floor(loanHelper.nextMaxLoanAmount),
          });
      }
      return loanHelper.nextMaxLoanAmount;
    } catch (error) {
      setLoanNumber('');
      setNextLoanAmount(null);
      setLoanSectionInfo({
        ...loanSectionInfo,
        loanAmount: '',
      });
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  ////////////////////////// All post Api calling Blocks /////////////////////////

  const onSubmitData = async () => {
    let docList = [...documentList];
    let newDocList = docList.map((obj) => {
      if (!obj.addDoc) {
        return {
          documentType: obj?.documentType,
          documentNumber: obj?.documentNumber ? obj.documentNumber : '',
          documentFront: obj?.documentPictureFront ? obj.documentPictureFront : '',
          documentFrontType: obj?.documentPictureFrontType ? obj.documentPictureFrontType : '',
        };
      } else {
        return {
          documentType: obj.documentType,
          documentNumber: obj.documentNumber ? obj.documentNumber : '',
          documentFront: obj?.documentPictureFront ? obj.documentPictureFront : '',
          documentFrontType: obj?.documentPictureFrontType ? obj.documentPictureFrontType : '',
          documentBack: obj?.documentPictureBack ? obj.documentPictureBack : '',
          documentBackType: obj?.documentPictureBack ? obj.documentPictureBack : '',
        };
      }
    });

    const list = [...grantorInfo];
    const newGrantorInfo = list.map(({ ...keepAttrs }) => keepAttrs);
    let payload;
    payload = {
      projectId: projectId ? parseInt(projectId) : parseInt(loanSectionInfo.projectName),
      samityId: samityId ? parseInt(samityId) : loanSectionInfo.samity,
      nextAppDesignationId: deskObj?.id ? parseInt(deskObj.id) : null,
      data: {
        projectId: projectId ? parseInt(projectId) : parseInt(loanSectionInfo.projectName),
        samityName: samityNameObj.samityName,
        productId: productId ? parseInt(productId) : parseInt(loanSectionInfo.productId),
        customerId: selectedMember ? parseInt(selectedMember) : parseInt(loanSectionInfo.customerId),
        customerName: memberNameObj.nameBn,
        loanAmount: loanSectionInfo.loanAmount ? parseInt(loanSectionInfo.loanAmount) : null,
        applyDate: date,
        loanTerm: loanPeriod ? parseInt(loanPeriod) : parseInt(loanSectionInfo.loanPeriod),
        interestRate: singleProductInfo,
        serviceCharge: serviceAmount ? parseInt(serviceAmount) : parseInt(loanSectionInfo.serviceCharge),
        frequency: loanSectionInfo.frequency ? loanSectionInfo.frequency : null,
        installmentNumber: parseInt(loanSectionInfo.numberOfInstallment),
        loanPurpose: parseInt(loanPurposeId),
        installmentAmount: installmentAmountValue
          ? parseInt(installmentAmountValue)
          : parseInt(loanSectionInfo.installmentAmount),
        remarks: loanSectionInfo.remarks,
        grantorInfo: newGrantorInfo,
        documentList: newDocList,
      },
    };
    if (itemValue == 'C') {
      try {
        setLoadingDataSaveUpdate(true);
        let sanctionAPIResp = await axios.put(updateApplication + 'sanction/' + applicationId, payload, config);
        setLoadingDataSaveUpdate(false);
        NotificationManager.success(sanctionAPIResp.data.message, '', 5000);
        setLoanSectionInfo({
          loanAmount: '',
          applyDate: '',
          loanPeriod: [],
          serviceCharge: '',
          frequency: 'নির্বাচন করুন',
          installmentNumber: '',
          loanPurpose: '',
          profitAmount: '',
          installmentAmount: '',
          remarks: '',
        });
        setDocumentList([
          {
            documentType: 'নির্বাচন করুন',
            documentNumber: '',
            documentPictureFront: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
            documentPictureBack: '',
            documentPictureBackType: '',
            documentPictureBackFile: '',
          },
        ]);
        date = '';
        setGrantorInfo([
          {
            grantorName: '',
            fatherName: '',
            motherName: '',
            mobile: '',
            nidNumber: ' ',
            birthDate: null,
            occupation: 'নির্বাচন করুন',
            perAddress: '',
            preAddress: '',
            relation: 'নির্বাচন করুন',
          },
        ]);
        setSamityNameObj({
          id: '',
          samityName: '',
        });
        setOfficeObj({
          id: '',
          label: '',
        });
        setDeskObj({
          id: '',
          label: '',
        });
        setMemberNameObj();
        setProductId('নির্বাচন করুন');
        setProjectId('নির্বাচন করুন');
        setInstallmentAmountValue('');
        setLoanPurposeId('নির্বাচন করুন');
        setServiceAmount('');
        setSingleProductInfo('');
        setLoanNumber('');
        setNextLoanAmount('');
        //setMember([]);
        setDisableAddDoc(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);

        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('সংযোগে ত্রুটি হয়েছে', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
      router.push({
        pathname: '/dashboard',
      });
    } else {
      try {
        setLoadingDataSaveUpdate(true);
        let sanctionAPIResp = await axios.post(sendApplyLoan + '/' + compoName, payload, config);
        setLoadingDataSaveUpdate(false);
        NotificationManager.success(sanctionAPIResp.data.message, '', 5000);
        setLoanSectionInfo({
          loanAmount: '',
          applyDate: '',
          loanPeriod: '',
          serviceCharge: '',
          frequency: 'নির্বাচন করুন',
          installmentNumber: '',
          loanPurpose: '',
          profitAmount: '',
          installmentAmount: '',
          remarks: '',
        });
        setDocumentList([
          {
            documentType: 'নির্বাচন করুন',
            documentNumber: '',
            documentPictureFront: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
            documentPictureBack: '',
            documentPictureBackType: '',
            documentPictureBackFile: '',
          },
        ]);
        date = '';
        setGrantorInfo([
          {
            grantorName: '',
            fatherName: '',
            motherName: '',
            mobile: '',
            nidNumber: ' ',
            birthDate: null,
            occupation: 'নির্বাচন করুন',
            perAddress: '',
            preAddress: '',
            relation: 'নির্বাচন করুন',
          },
        ]);
        setSamityNameObj({
          id: '',
          label: '',
        });
        setOfficeObj({
          id: '',
          label: '',
        });
        setDeskObj({
          id: '',
          label: '',
        });
        setMemberNameObj();

        setProductId('নির্বাচন করুন');
        setProjectId('নির্বাচন করুন');
        setInstallmentAmountValue('');
        setLoanPurposeId('নির্বাচন করুন');
        setServiceAmount('');
        setSingleProductInfo('');
        setLoanNumber('');
        setNextLoanAmount('');
        //setMember([]);
        setDisableAddDoc(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('সংযোগে ত্রুটি হয়েছে', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };
  const deleteGrantorInfo = (event, index) => {
    let otherMembersList = [...othersMember];
    if (disableGrantorAdd) {
      setDisableGrantorAdd(false);
    }
    const grantorCopy = [...grantorInfo];
    const formErrorCopyGrantor = [...formErrorsInGrantor];
    let selectedPersonId = grantorCopy[index]['personName'];
    let selectedObj = otherMembersList.find((elem) => elem.id == selectedPersonId);
    let hashedArray = [...hashArray];
    hashedArray = hashedArray.filter((elem) => elem.id != selectedObj?.id);
    setHashArray(hashedArray);
    const newFunc = (array) => {
      const newIdArray = array.map((obj) => obj.id);
      if (!newIdArray.includes(selectedObj.id)) {
        array.push(selectedObj);
      }
    };
    const newFunc2 = (array) => {
      const newIdArray = array.map((obj) => obj.id);
      const newArray = otherMembersList.filter((elem) => newIdArray.includes(elem.id));
      return newArray;
    };
    if (selectedObj) {
      grantorCopy.map((obj) => newFunc(obj.personInfo));
      grantorCopy.map((obj) => {
        obj['personInfo'] = newFunc2(obj.personInfo);
      });
    }
    const arr = grantorCopy.filter((g, i) => index !== i);
    const formErrorArrayInGrantor = formErrorCopyGrantor.filter((g, i) => index !== i);
    const disablearr = grantorDisabled.filter((g, i) => index !== i);
    setGrantorDisabled(disablearr);
    setFormErrorsInGrantor(formErrorArrayInGrantor);
    setGrantorInfo(arr);
  };
  const deleteDocumentList = (event, index) => {
    setDisableAddDoc(false);
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);

    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
  };
  ///////////////////////// Installment number calculation function //////////////

  // const totalInstallmentNumber = () => {
  //   if (loanSectionInfo.frequency === "M") {
  //     const number = loanSectionInfo.loanPeriod * 1;
  //     setLoanSectionInfo({
  //       ...loanSectionInfo,
  //       installmentNumber: Math.floor(number),
  //     });
  //   } else {
  //     const number = (loanSectionInfo.loanPeriod / 12) * 52;
  //     setInitialInstallmentNumber(number)
  //     setLoanSectionInfo({
  //       ...loanSectionInfo,
  //       installmentNumber: Math.floor(number),
  //     });
  //   }
  // };

  // const arr = documentList.filter((g, i) => index !== i)
  // setDocumentList(arr)

  ///////////////////////// Installment number calculation function //////////////

  const getDate = (today) => {
    var d = today;

    var date = d.getUTCDate();
    var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
    var year = d.getUTCFullYear();

    var dateStr = date + '/' + month + '/' + year;
    return dateStr;
  };

  var date = getDate(new Date());

  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setDocumentList([...changeAddDoc]);
  };
  const onModalClicked = async (e, status, accountId) => {
    let selected = member.find((obj) => obj.id == selectedMember);
    if (selected) {
      if (selected.nameBn) {
        setSelectedMemberName(selected['nameBn']);
      }
    }
    let customerInfo;
    let customerInfos;
    try {
      if (status == 1) {
        customerInfo = await axios.get(
          specificApplication + 'member/account/credit/rating?customerId=' + selectedMember + '&creditRatingStatus=1',
          config,
        );
        customerInfos = customerInfo.data.data;
        setCustomerInfoArray(customerInfos);
        setModalClicked(true);
      } else {
        customerInfo = await axios.get(
          specificApplication +
          'member/account/credit/rating?customerId=' +
          selectedMember +
          '&creditRatingStatus=2' +
          '&productId=' +
          productId +
          '&accountId=' +
          accountId,
          config,
        );
        customerInfos = customerInfo.data.data;
        setParticularCusotmerInfoArray(customerInfos);
        setModalClicked2(true);
      }
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  // const samityNameOptions = samityName.map((element) => {
  //   return { label: element.samityName, id: element.id };
  // });

  return (
    <>
      <Grid>
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label={star('প্রকল্পের নাম')}
              id="projectId"
              name="projectName"
              onChange={handleProject}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              value={loadingDropdown ? projectId : loanSectionInfo.projectName || ''}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {ProjectName
                ? ProjectName.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.projectNameBangla}
                  </option>
                ))
                : ' '}
            </TextField>
            {projectId == 'নির্বাচন করুন' && <span className="validation">{formErrors.samityName}</span>}
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label={star('প্রোডাক্টের নাম')}
              id="productId"
              name="productName"
              onChange={handleProduct}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              value={loadingDropdown ? productId : loanSectionInfo.productId}
              disabled={disableProduct}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {productName
                ? productName.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.productName}
                  </option>
                ))
                : ''}
            </TextField>
          </Grid>
          <Grid item md={5} xs={12}>
            <Autocomplete
              disablePortal
              name="samityId"
              onChange={(event, value) => {
                if (!value) {
                  setSamityNameObj();
                  setMemberNameObj();
                  setMember([]);
                } else {
                  value && setSamityNameObj(value);
                  setSamityId(value.id);
                  getMember(value.id);
                  // getSanctionMembers(value.id);
                }
              }}
              getOptionLabel={(option) => option?.samityName}
              options={samityName}
              value={samityNameObj}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={samityNameObj?.id === '' ? star(' সমিতির নাম নির্বাচন করুন') : star(' সমিতির নাম')}
                  variant="outlined"
                  size="small"
                />
              )}
            />
            {/* <Autocomplete
              disablePortal
              id="grouped-demo"
              options={samityNameOptions}
              onChange={handleChange}
              defaultValue={samityNameObj}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  label="সমিতির নাম"
                  size="small"
                />
              )}
            /> */}
          </Grid>

          <Grid item md={5} xs={12}>
            <Autocomplete
              disablePortal
              inputProps={{ style: { padding: 0, margin: 0 } }}
              name="memberName"
              key={memberNameObj}
              onChange={(event, value) => {
                if (!value) {
                  setMemberNameObj();
                } else {
                  value && setMemberNameObj(value);
                  {
                    handleMember(value?.id);
                  }
                }
              }}
              getOptionLabel={(option) => option?.nameBn}
              options={member}
              value={memberNameObj}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={memberNameObj?.id === '' ? star('সদস্যের নাম') : star(' সদস্যের নাম')}
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item md={2} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              fullWidth
              disabled={selectedMember ? false : true}
              variant="contained"
              color="primary"
              className="btn btn-primary"
              onClick={(e) => onModalClicked(e, 1)}
            >
              সদস্যের ঋণ বিবরণ
            </Button>
          </Grid>
          {modalClicked ? (
            <div
              style={{
                zIndex: '10',
                position: 'absolute',
              }}
            >
              <Dialog
                className="diaModal"
                open={modalClicked}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                scroll="body"
              >
                <div className="modal">
                  <Grid item md={12} xs={12}>
                    <SubHeading>সদস্যের তথ্য</SubHeading>
                  </Grid>
                  <Grid>
                    <Typography variant="h6">সদস্যের নাম :{selectedMemberName}</Typography>
                    <TableContainer className="table-container">
                      <Table size="small" aria-label="a dense table">
                        <TableHead className="table-head">
                          <TableRow>
                            <TableCell>প্রোডাক্ট নাম</TableCell>
                            <TableCell>অ্যাকাউন্ট নম্বর</TableCell>
                            <TableCell>অ্যাকাউন্ট খোলার তারিখ</TableCell>
                            <TableCell>অ্যাকাউন্ট বন্ধের তারিখ</TableCell>
                            <TableCell className="table-data-center">অ্যাকাউন্ট স্ট্যাটাস</TableCell>
                            <TableCell className="table-data-right">বর্তমান হিসাবনিকাশ</TableCell>
                            <TableCell className="table-data-center">বিস্তারিত</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {customerInfoArray.length > 0
                            ? customerInfoArray.map((row) => (
                              <TableRow key={row.productName}>
                                <TableCell>{row.productName}</TableCell>
                                <TableCell>{engToBang(row.accountNo)}</TableCell>
                                <TableCell>{engToBang(new Date(row.openDate).toLocaleDateString('en-US'))}</TableCell>
                                <TableCell>
                                  {row.closeDate && engToBang(new Date(row.closeDate).toLocaleDateString('en-US'))}
                                </TableCell>
                                <TableCell className="table-data-center">
                                  {row.accountStatus == 'ACT' ? 'সচল' : 'অচল'}
                                </TableCell>
                                <TableCell className="table-data-right">{engToBang(row.currentBalance)}</TableCell>
                                {row.productType == 'A' ? (
                                  <TableCell className="table-data-center">
                                    <DehazeIcon
                                      onClick={(e) => {
                                        onModalClicked(e, 2, row.accountId);
                                      }}
                                    />
                                  </TableCell>
                                ) : (
                                  ''
                                )}
                              </TableRow>
                            ))
                            : ''}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </div>
              </Dialog>
            </div>
          ) : (
            ''
          )}
        </Grid>
        {modalClicked2 ? (
          <Dialog
            className="diaModal"
            open={modalClicked2}
            TransitionComponent={Transition}
            onClose={handleClose2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            scroll="body"
            maxWidth="lg"
          >
            <div className="modal">
              <TableContainer className="table-container">
                <Table size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell className="table-data-center">কিস্তি নম্বর</TableCell>
                      <TableCell>কিস্তি আদায়ের তারিখ</TableCell>
                      <TableCell className="table-data-right">আসল</TableCell>
                      <TableCell className="table-data-right">সার্ভিস চার্জ</TableCell>
                      <TableCell className="table-data-right">সর্বমোট</TableCell>
                      <TableCell className="table-data-right">আদায়কৃত আসল</TableCell>
                      <TableCell className="table-data-right">আদায়কৃত সার্ভিস চার্জ</TableCell>
                      <TableCell className="table-data-right">আদায়কৃত সর্বমোট</TableCell>
                      <TableCell>আদায়ের তারিখ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {particularCustomerInfoArray.length > 0
                      ? particularCustomerInfoArray.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="table-data-center">{engToBang(row.installmentNo)}</TableCell>
                          <TableCell>{engToBang(new Date(row.dueDate).toLocaleDateString('en-US'))}</TableCell>
                          <TableCell className="table-data-right">{engToBang(row.principalAmount)}</TableCell>
                          <TableCell className="table-data-right">{engToBang(row.interestAmount)}</TableCell>
                          <TableCell className="table-data-right">{engToBang(row.totalAmount)}</TableCell>
                          <TableCell className="table-data-right">{engToBang(row.principalPaidAmount)}</TableCell>
                          <TableCell className="table-data-right">{engToBang(row.interestPaidAmount)}</TableCell>
                          <TableCell className="table-data-right">{engToBang(row.totalPaidAmount)}</TableCell>
                          <TableCell>{row.paidDate ? engToBang(dateFormat(row.paidDate)) : ' '}</TableCell>
                        </TableRow>
                      ))
                      : ''}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Dialog>
        ) : (
          ''
        )}
      </Grid>

      <Grid
        container
        className="content"
        sx={{
          border: '1px solid var(--color-warning)',
          boxShadow: '0 0 10px -4px var(--color-error)',
        }}
      >
        <Grid item md={3} xs={12}>
          <span>ঋণ সংখ্যা : </span> <span className="warning"> {engToBang(loanNumber)}</span>
          { }
        </Grid>
        <Grid item md={6} xs={12}>
          <span>পরবর্তী সর্বোচ্চ ঋণের পরিমান (টাকা): </span>{' '}
          <span className="warning"> {engToBang(nextLoanAmount)}</span>
        </Grid>
      </Grid>
      <Grid className="section">
        <Grid container spacing={2.5}>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              id="number"
              label={star('ঋণের পরিমান')}
              name="loanAmount"
              onChange={handleChange}
              value={loanSectionInfo.loanAmount ? engToBang(loanSectionInfo.loanAmount) : ''}
              size="small"
            ></TextField>
            {<span className="validation">{formErrors.loanAmount}</span>}
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label={star('ঋণের উদ্দেশ্য')}
              select
              name="loanPurpose"
              onChange={handleLoanPurpose}
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              value={loadingDropdown ? loanPurposeId : loanSectionInfo.loanPurpose}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {loanPurposeListData
                ? loanPurposeListData.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.purposeName}
                  </option>
                ))
                : ''}
            </TextField>
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label={star('ঋণের মেয়াদ (মাস)')}
              select
              name="loanPeriod"
              onChange={handleLoanPeriod}
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              value={loadingDropdown ? loanPeriod : loanSectionInfo.loanTerm}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {loanSectionInfo?.loanPeriod &&
                loanSectionInfo.loanPeriod.map(
                  (option) =>
                    option && (
                      <option key={option} value={option}>
                        {`${engToBang(option)} মাস`}
                      </option>
                    ),
                )}
            </TextField>
          </Grid>
          {/* <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              id="number"
              label={star("ঋণের মেয়াদ (মাস)")}
              name="loanPeriod"
              // type="number"
              onChange={handleChange}
              disabled={true}
              size="small"
              value={loanSectionInfo.loanPeriod ? loanSectionInfo.loanPeriod : ""}
            ></TextField>
            {<span className='validation'>{formErrors.loanPeriod}</span>}

          </Grid> */}
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label={star('কিস্তির সংখ্যা')}
              name="installmentNumber"
              id="number"
              onChange={handleChange}
              value={loanSectionInfo.numberOfInstallment ? engToBang(loanSectionInfo.numberOfInstallment) : ''}
              type="text"
              disabled={true}
              variant="outlined"
              size="small"
              FormHelperTextProps={{ style: { fontSize: 16 } }}
              error={formErrors.installmentNumber ? true : false}
              helperText={formErrors.installmentNumber}
            ></TextField>
            {/* { <span clsssName='validation'>{formErrors.installmentNumber}</span>} */}
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label={star('কিস্তি আদায়ের ধরণ')}
              name="frequency"
              id="dropdown"
              onChange={handleChange}
              disabled={disableLoanFrequency}
              value={loanSectionInfo.frequency ? loanSectionInfo.frequency : ' '}
              //  onBlur={totalInstallmentNumber}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {frequency
                ? frequency.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))
                : ''}
            </TextField>
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label="সার্ভিস চার্জ"
              name="profitAmount"
              value={
                loanSectionInfo.serviceCharge ? engToBang(loanSectionInfo.serviceCharge) : engToBang(serviceAmount)
              }
              disabled
              type="text"
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          {loanSectionInfo.interestType != 'DOC' && (
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label="কিস্তির পরিমাণ (টাকা)"
                name="installmentAmount"
                value={
                  // installmentAmountValue
                  //   ? engToBang(installmentAmountValue)
                  //   : ""
                  loanSectionInfo.installmentAmount
                    ? engToBang(loanSectionInfo.installmentAmount)
                    : engToBang(installmentAmountValue)
                }
                disabled
                type="text"
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          )}

          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label="আবেদনের তারিখ"
              name=""
              value={loanSectionInfo.applyDate ? engToBang(loanSectionInfo.applyDate) : engToBang(date)}
              disabled
              SelectProps={{ native: true }}
              type="text"
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label="সার্ভিস চার্জের হার(%)"
              name="serviceChargeRate"
              value={
                loanSectionInfo.serviceChargeRate
                  ? engToBang(loanSectionInfo.serviceChargeRate)
                  : engToBang(singleProductInfo)
              }
              disabled
              SelectProps={{ native: true }}
              type="text"
              variant="outlined"
              size="small"
            ></TextField>
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              label="সার্ভিস চার্জের ধরন"
              name="interestType"
              onChange={handleChange}
              disabled
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              value={loanSectionInfo?.interestType ? loanSectionInfo.interestType : ' '}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {interestTypeArray.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            {/* {!loanDetails.interestType && (
                <span className='validation'>{formErrors.ProjecinterestTypetName}</span>
               )} */}
          </Grid>
          {loanSectionInfo.gracePeriod != 0 ? (
            <Grid item md={3} xs={12}>
              <TextField
                label="গ্রেস পিরিয়ড"
                name="gracePeriod"
                value={loanSectionInfo.gracePeriod ? engToBang(loanSectionInfo.gracePeriod) : ''}
                disabled
                type="text"
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          ) : (
            ' '
          )}
          {loanSectionInfo.graceAmtRepayIns && (
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label="গ্রেস পিরিয়ডে সার্ভিস চার্জ"
                name="gracePeriodType"
                id="dropdown"
                disabled
                onChange={handleChange}
                value={loanSectionInfo.graceAmtRepayIns}
                //  onBlur={totalInstallmentNumber}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {gracePeriodArray
                  ? gracePeriodArray.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                  : ''}
              </TextField>
            </Grid>
          )}
          {itemValue != 'C' && (
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="officeName"
                key={officeObj}
                onChange={(event, value) => {
                  setDeskObj({
                    id: '',
                    label: '',
                  });
                  if (value == null) {
                    setOfficeObj({
                      id: '',
                      label: '',
                    });
                    setDeskObj({
                      id: '',
                      label: '',
                    });
                  } else {
                    value &&
                      setOfficeObj({
                        id: value.id,
                        label: value.label,
                      });
                    getDeskId(value.id);
                  }
                }}
                options={officeNames.map((option) => {
                  return {
                    id: option.id,
                    label: option.nameBn,
                  };
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={officeObj.id === '' ? star('কার্যালয়ের নাম নির্বাচন করুন') : star('কার্যালয়')}
                    variant="outlined"
                    size="small"
                  />
                )}
                value={officeObj}
              />
            </Grid>
          )}
          {itemValue != 'C' && (
            <Grid item lg={6} md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="serviceName"
                onChange={(event, value) => {
                  if (value == null) {
                    setDeskObj({
                      id: '',
                      label: '',
                    });
                  } else {
                    value &&
                      setDeskObj({
                        id: value.id,
                        label: value.label,
                      });
                  }
                }}
                options={
                  deskList.map((option) => ({
                    id: option.designationId,
                    label: option.nameBn + '-' + option.designation,
                  }))
                  // .filter((e) => e.id != null && e.label !== null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={
                      deskObj.id === ''
                        ? star('পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন')
                        : star('পর্যবেক্ষক/অনুমোদনকারীর নাম')
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
                value={deskObj}
              />
              {/* {(selectedDesk == "নির্বাচন করুন" || !selectedDesk) && (
                <span style={{ color: "red" }}>{formErrors.selectedDesk}</span>
              )} */}
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="মন্তব্য / সুপারিশ "
              name="remarks"
              onChange={handleChange}
              value={loanSectionInfo.remarks}
              type="text"
              variant="outlined"
              multiline
              size="small"
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
      <DynamicJamindarSection
        handleAddGrantorInfo={handleAddGrantorInfo}
        grantorInfo={grantorInfo}
        occupationList={occupationList}
        relationList={relationList}
        handleGrantorInfo={handleGrantorInfo}
        handleDateChangeEx={handleDateChangeEx}
        deleteGrantorInfo={deleteGrantorInfo}
        formErrors={formErrorsInGrantor}
        grantorDisabled={grantorDisabled}
        disableGrantorAdd={disableGrantorAdd}
      />
      <Grid className="section">
        <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} disableAddDoc={disableAddDoc} />
        <Grid container sx={{ justifyContent: 'center' }}>
          <Typography variant="h6">ইতোমধ্যে প্রাপ্ত ডকুমেন্টের তালিকা :</Typography>
          {submittedDocs.map((elem, index) => (
            <Grid item key={index}>
              <Checkbox checked={elem.isSubmit} disabled />
              {elem.docTypeDesc}
            </Grid>
          ))}
        </Grid>
        <DynamicDocSectionContent
          documentList={documentList}
          documentType={documentType}
          handleDocumentList={handleDocumentList}
          addMoreDoc={addMoreDoc}
          fileSelectedHandler={fileSelectedHandler}
          deleteDocumentList={deleteDocumentList}
          formErrorsInDocuments={formErrorsInDocuments}
          removeDocumentImageFront={removeDocumentImageFront}
          removeDocumentImageBack={removeDocumentImageBack}
        />
      </Grid>
      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            "সংরক্ষণ করা হচ্ছে..."
          </LoadingButton>
        ) : (
          <Tooltip title="সংরক্ষণ করুন">
            <Button
              variant="contained"
              className="btn btn-save"
              onClick={onSubmitData}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              সংরক্ষণ করুন
            </Button>
          </Tooltip>
        )}
      </Grid>
    </>
  );
};
export default Sanction;
