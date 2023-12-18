/* eslint-disable no-dupe-else-if */
/* eslint-disable react/no-unknown-property */
import { default as AddIcon, default as AddIcons } from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import StorageIcon from '@mui/icons-material/Storage';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import Loader from 'components/Loader';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import DisUpaOffice from 'components/utils/coop/DisUpaOffice';
import { liveIp } from 'config/IpAddress';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { formValidator } from 'service/formValidator';
import { bangToEng, engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import Swal from 'sweetalert2';
import {
  applicationGetById,
  committeeAddMember,
  committeeApply,
  committeeMemberDeactive,
  committeeMemberList,
  committeeRole,
  memberInfoData,
  samityInfo,
  serviceNameApi
} from '../../../url/coop/ApiList';
import fileCheck from '../../shared/others/DocImage/FileUploadTypeCheck';

const DynamicDocSectionHeader = dynamic(() => import('../../shared/others/DocImage/DocSectionHeader'), {
  loading: () => <Loader />,
});
const DynamicDocSectionContent = dynamic(() => import('../../shared/others/DocImage/DocSectionContent'), {
  loading: () => <Loader />,
});
const ElectionCommittee = [
  {
    value: '0',
    label: '- নির্বাচন করুন -',
  },
  {
    value: '3',
    label: '৩ জন',
  },
];

const Committee = [
  {
    value: '0',
    label: '- নির্বাচন করুন -',
  },
  {
    value: '6',
    label: '৬ জন',
  },
  {
    value: '9',
    label: '৯ জন',
  },
  {
    value: '12',
    label: '১২ জন',
  },
];

const CommSetup = () => {
  const router = useRouter();
  const configtoken = localStorageData('token');
  const config = localStorageData('config');
  const userData = tokenData(configtoken);

  const [isManual, setIsManual] = useState(false);
  const [getSamityId, setGetSamityId] = useState(localStorageData('reportsIdPer'));

  const [getSamityLevel, setGetSamityLevel] = useState(localStorageData('approvedSamityLevel'));

  ///////////////////////////////////*** loading syastem start **//////////////////////////////
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  /////////////////////////////////////////*** loading syastem End **/////////////////////////
  const appId = router.query.id;

  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpenadd(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openAdd, setOpenadd] = useState(false);

  const handleOpenAdd = () => {
    setOpen(false);
    setOpenadd(true);
  };
  const handleCloseAdd = () => {
    setOpenadd(false);
  };

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const [memberSetId, setMemberSetId] = useState(null);

  // const handleMenu = (e, id) => {
  //   setMemberSetId(id);
  // };
  const [modalmemberList, setModalmemberList] = useState([]);
  const [modalCommittee, setModalCommittee] = useState();
  const [commInfo, setCommInfo] = useState({
    servicesName: '',
    electionDate: '',
    effectDate: '',
    expireDate: '',
    committeeDesignation: '',
    memberId: '',
    memberName: '',
    memberNid: '',
    memberBrn: '',
    memberDob: null,
    memberMob: '',
    name: '',
    orgName: '',
    nid: '',
    brn: '',
    mobile: '',
    designation: '',
    degData: '',
  });
  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);
  const [documentList, setDocumentList] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',
      addDoc: false,
      update: false,
    },
  ]);
  const [formError] = useState({
    nid: '',
    brn: '',
    mobile: '',
  });
  const [memberSelectName, setMemberSelectName] = useState(null);
  const [getServiceInfo, setGetServiceInfo] = useState([]);
  const [servicesId, setServicesId] = useState();
  const [serviceName, setServiceName] = useState(null);
  const [servicesNameData, setServicesNameData] = useState([]);
  const [serviceNameBan, setServiceNameBan] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [committeeId, setCommitteeId] = useState('');
  // const [status, setStatus] = useState('');
  // const [committeeType, setCommitteeType] = useState('');
  const [committePerson, setCommittePerson] = useState('');
  const [samityNameInfo, setSamityNameInfo] = useState('');
  const [samityName] = useState('');
  const [checked, setChecked] = useState(false);
  const [meetingDate, setMeetingDate] = useState(null);
  const [electionDate, setElectionDate] = useState(null);
  const [effectDate, setEffectDate] = useState(null);
  const [expireDate, setExpireDate] = useState(null);
  const [registrationDate, setRegistrationDate] = useState(null);
  const [savePayload, setSavePayload] = useState([]);
  const [memDegData, setMemDegData] = useState([]);
  const [memName, setMemName] = useState([]);
  // const [membersdata, setMembersdata] = useState([]);
  const [update, setUpdate] = useState(false);
  // const [allApprovalSamity, setAllApprovalSamity] = useState([]);
  const [totalSharePrice, setTotalSharePrice] = useState('');
  const [documentFetch, setDocumentFetch] = useState([]);

  useEffect(() => {
    appnDataInfo(router.query.id);
  }, [router.query.id]);

  useEffect(() => {
    // getApprovalSamityData();
    getDesigData();
    // setMembersdata([]);
    setSavePayload([]);
    localStorage.removeItem('members');
    // serviceInfo();
  }, []);

  useEffect(() => {
    samityNameData(getSamityId);
    memberListData(getSamityId);
  }, [getSamityId]);

  useEffect(() => {
    serviceInfo();
  }, [isManual]);

  useEffect(() => {
    getDesigData();
  }, [servicesId]);

  useEffect(() => {
    serviceRulesFun(getServiceInfo, servicesId);
  }, [getServiceInfo, servicesId]);

  // const getApprovalSamityData = async () => {
  //   if (userData?.type == 'user') {
  //     try {
  //       const allSamityData = await axios.get(approvedSamityList, config);
  //       setAllApprovalSamity(allSamityData.data.data);
  //     } catch (error) {
  //       errorHandler(error);
  //     }
  //   } else {
  //     setAllApprovalSamity([]);
  //   }
  // };

  let memberListData = async (id) => {
    try {
      if (id) {
        const committeeInfoData = await axios.get(committeeMemberList + id, config);
        // setCommitteeType(committeeInfoData.data.data.committeeInfo.committeeType);
        setCommitteeId(committeeInfoData.data.data.committeeInfo.committeeId);
        // setStatus(committeeInfoData.data.data.committeeInfo.status);
        setModalCommittee(committeeInfoData.data.data.committeeInfo);
        const filterData = committeeInfoData?.data?.data?.membersList?.filter(
          (e) => e.memberStatus == 'A' && e.committeeType == committeeInfoData.data.data.committeeInfo.committeeType,
        );
        setModalmemberList(filterData);
      }
    } catch (error) {
      // setCommitteeType('');
      setCommitteeId('');
      // setStatus('');
      setModalCommittee();
      setModalmemberList([]);
      errorHandler(error);
    }
  };

  const serviceInfo = async () => {
    const serviceNameData = await axios.get(serviceNameApi, config);
    let serviceNames = serviceNameData.data.data;
    let shortserviceName = serviceNames.sort((a, b) => {
      return a.id - b.id;
    });

    setGetServiceInfo(shortserviceName);

    if (isManual) {
      setServicesNameData(shortserviceName.filter((e) => e.id == 3 || e.id == 4 || e.id == 5 || e.id == 9));
    } else {
      setServicesNameData(shortserviceName.filter((e) => e.id == 3 || e.id == 4 || e.id == 5));
    }
  };

  let handleChangeService = async (e) => {
    const { value } = e.target;
    if (value == 0) {
      setServicesId(value);
      setFormErrors({
        ...formErrors,
        servicesId: 'সেবার নাম প্রদান করুন',
      });
    } else {
      setServicesId(value);
      serviceRulesFun(value);
      setFormErrors({
        ...formErrors,
        servicesId,
      });
    }

    if (value == 9) {
      setChecked(true);
      setDisabled(true);
      getMemberInfo(getSamityId);
    } else {
      setDisabled(false);
    }
  };

  let samityNameData = async (id) => {
    try {
      if (id) {
        const samityInfoData = await axios.get(samityInfo + getSamityId, config);
        setGetSamityLevel(samityInfoData?.data?.data?.Samity[0]?.samityLevel);
        setSamityNameInfo(samityInfoData?.data?.data?.Samity[0]?.samityName);
        setRegistrationDate(samityInfoData?.data?.data?.Samity[0]?.samityRegistrationDate);
        setTotalSharePrice(
          samityInfoData?.data?.data?.Samity[0]?.sharePrice * samityInfoData?.data?.data?.Samity[0]?.soldShare,
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const regDate = registrationDate;
  const expDate = moment(regDate).add(2, 'years') - 1;

  let samiteeName = samityNameInfo;
  let samiteeLevel = getSamityLevel;

  const serviceRulesFun = (serviceGetData, id) => {
    if (Array.isArray(serviceGetData) && id !== 0) {
      const serviceData = serviceGetData.find((elm) => elm?.id == id);
      setDocumentType(serviceData?.serviceRules?.documents);
      setServiceNameBan(serviceData?.id);
      setServiceName(serviceData?.serviceNameEnglish);
    } else {
      setDocumentType([]);
      setServiceNameBan([]);
      setServiceName(null);
    }
  };

  let getDesigData = async () => {
    try {
      let memDData = await axios.get(committeeRole + '?isPagination=false', config);
      let roleIds = memDData.data.data;
      if (servicesId) {
        roleIds = roleIds.filter((e) => e.rules.serviceId.includes(parseInt(servicesId)));
      }
      setMemDegData(roleIds);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        documentType: '',
        documentNumber: '',
        documentPictureFront: '',
        documentPictureFrontName: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        update: false,
      },
    ]);
    setFormErrorsInDocuments([
      ...formErrorsInDocuments,
      {
        documentType: '',
        documentNumber: '',
        documentPictureFrontFile: '',
      },
    ]);
  };

  const handleDocumentList = (e, index) => {
    const { name, value } = e.target;
    const list = [...documentList];
    list[index][name] = parseInt(value) ? parseInt(value) : '';
    setDocumentList(list);
  };

  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setDocumentList([...changeAddDoc]);
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

  const fileSelectedHandler = (event, index) => {
    const { name } = event.target;
    let list = [...documentList];
    list[index][name] = '';
    list[index][name + 'Name'] = '';
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      list[index]['update'] = false;
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);

        if (base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = event.target.files[0];

          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'ফরমেটের জন্য ছবিটি দেখা যাচ্ছে না') {
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = event.target.files[0];

          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'ফরমেটের জন্য ছবিটি দেখা যাচ্ছে না') {
          list[index][name + 'Name'] = 'ছবিটির ফরমেট ঠিক নেই';
          setDocumentList(list);
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'ফরমেটের জন্য ছবিটি সাপোর্ট করছে না';
          setDocumentList(list);
        }
      };
      reader.onerror = () => {
        NotificationManager.error('ছবিটি দেখানোর জন্য সাপোর্ট করছে না', '', 5000);
      };
    }
  };

  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);
    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
  };

  const handleSwitch = (e) => {
    setChecked(e.target.checked);
    setCommInfo({
      committeeDesignation: '',
      memberName: '',
      memberNid: '',
      memberDob: null,
      memberMob: '',
      name: '',
      orgName: '',
      nid: '',
      mobile: '',
    });
    setMemberSelectName('');

    if (samityName.samityId) {
      getMemberInfo(samityName.samityId);
    }
    getMemberInfo(getSamityId);
  };

  let getMemberInfo = async (id) => {
    try {
      const memberInformation = await axios.get(memberInfoData + id, config);
      if (memberInformation.data.data.length < 2) {
        NotificationManager.warning(
          'কমিটির জন্য সর্বনিন্ম ৩ জন সদস্য হতে হবে, আপনি সদস্য সংশোধন/সংযোজন মেন্যু থেকে নতুন সদস্য যোগ ও অনুমোদন করে আসুন',
          '',
          5000,
        );
      }
      setMemName(memberInformation.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const roleDesignation = (e) => {
    for (let i = 0; i < memDegData.length; i++) {
      const element = memDegData[i];
      if (element.id == e) {
        let rolename = element.roleName;
        return rolename;
      }
    }
  };

  const handleNameChange = (e) => {
    if (e.target.value == 0) {
      setCommInfo({
        ...commInfo,
        memberId: '',
        memberName: '',
        memberNid: '',
        memberBrn: '',
        memberMob: '',
        memberDob: null,
      });
    } else {
      let data = JSON.parse(e.target.value);
      let myVal = data.val;
      let myName = data.memName;
      let myNid = data.nid ? data.nid : data.brn;
      let myMobile = data.mobile;
      let mydob = data.dob;
      setCommInfo({
        ...commInfo,
        memberId: myVal,
        memberName: myName,
        memberNid: myNid,
        memberMob: myMobile,
        memberDob: mydob,
      });
      setMemberSelectName(e.target.value);
    }
  };

  const handleNameChangeCentralNational = (e) => {
    if (e.target.value == 0) {
      setCommInfo({
        ...commInfo,
        memberId: '',
        memberName: '',
      });
    } else {
      let data = JSON.parse(e.target.value);
      let myVal = data.val;
      let myName = data.memName;
      setCommInfo({
        ...commInfo,
        memberId: myVal,
        memberName: myName,
      });
      setMemberSelectName(e.target.value);
    }
  };

  let handleChange = (e) => {
    const { name, value } = e.target;
    let memberDataNid, memberDataBrn, resultObj, coomData;
    switch (name) {
      case 'mobile':
        resultObj = formValidator('mobile', value);
        if (resultObj?.status) {
          return;
        }
        setCommInfo({
          ...commInfo,
          [name]: resultObj?.value,
        });
        formError.mobile = resultObj?.error;
        break;
      case 'nid':
        memberDataNid = formValidator('nid', value);
        memberDataBrn = formValidator('brn', value);
        if (memberDataNid?.status || memberDataBrn?.status) {
          return;
        }
        setCommInfo({
          ...commInfo,
          [name]: bangToEng(value) > 0 ? memberDataNid?.value : memberDataBrn?.value,
        });
        formError.nid = memberDataNid?.error;
        formError.brn = memberDataBrn?.error;

        break;
      case 'committeeDesignation':
        coomData = memDegData.find((attribute) => attribute.id == value);
        setCommInfo({
          ...commInfo,
          [name]: value,
          degData: coomData,
        });
        break;
      case 'committePerson':
        if (value == 0) {
          setFormErrors({
            ...formErrors,
            committePerson: 'কমিটির সদস্য সংখ্যা নির্বাচন করুন',
          });
        } else {
          setCommittePerson(value);
          setFormErrors({
            ...formErrors,
            committePerson: '',
          });
        }
        break;
      default:
        setCommInfo({
          ...commInfo,
          [name]: value,
        });
    }
  };

  const checkData = (memberList, obj) => {
    const roleId = obj.roleId;
    const memberId = obj.memberId;
    const roleRank = commInfo.degData.roleRank;
    const roleData = memDegData.find((element) => element.id == obj.roleId);
    const noOfMember = roleData.noOfMember;
    const countMemDeg = memberList.filter((element) => element.roleId == roleId).length;
    let isPresent = false;

    if (checked) {
      let message;
      if (memberList.length > 0) {
        isPresent = memberList.some((e) => {
          return e.memberId == memberId;
        });
      }
      if (isPresent) {
        message = 'সদস্যটি বিদ্যমান রয়েছে';
      } else {
        if (roleRank == 1) {
          if (memberList.length > 0) {
            isPresent = memberList.some((e) => {
              return e.roleRank == 1;
            });
            if (isPresent) {
              message = 'সভাপতি, চেয়ারম্যান, ম্যানেজার পদ একের বেশি দেওয়া যাবে না';
            }
          }
        } else {
          if (countMemDeg >= noOfMember) {
            isPresent = true;
            message = 'এই পদবীটি ' + engToBang(noOfMember) + ' বার এর বেশি ব্যবহৃত করা যাবে না';
          } else {
            isPresent = false;
          }
        }
      }
      if (message) {
        NotificationManager.warning(message, '', 5000);
      }
    } else {
      let message;
      if (memberList.length > 0) {
        isPresent = memberList.some((e) => {
          return e.memberNid == obj.memberNid;
        });
      }
      if (isPresent) {
        message = 'সদস্য এনআইডি বিদ্যমান রয়েছে';
      } else {
        if (roleRank == 1) {
          if (memberList.length > 0) {
            isPresent = memberList.some((e) => {
              return e.roleRank == 1;
            });
            if (isPresent) {
              message = 'সভাপতি, চেয়ারম্যান, ম্যানেজার পদ একের বেশি দেওয়া যাবে না';
            }
          }
        } else {
          if (countMemDeg >= noOfMember) {
            isPresent = true;
            message = 'এই পদবীটি ' + engToBang(noOfMember) + ' বার এর বেশি ব্যবহৃত করা যাবে না';
          } else {
            isPresent = false;
          }
        }
      }
      if (message) {
        NotificationManager.warning(message, '', 5000);
      }
    }
    return isPresent;
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    let memObj;
    if (checked) {
      if (getSamityLevel == 'P' && commInfo.committeeDesignation && commInfo.memberId) {
        memObj = {
          roleId: parseInt(commInfo.committeeDesignation),
          isMember: checked,
          memberId: parseInt(commInfo.memberId),
          memberName: commInfo.memberName,
          memberNid: bangToEng(commInfo.memberNid),
          mobile: bangToEng(commInfo.memberMob),
          memberDob: dateFormat(commInfo.memberDob),
          status: 'A',
          roleRank: parseInt(commInfo.degData.roleRank),
        };
      } else if (commInfo.committeeDesignation && commInfo.memberId) {
        memObj = {
          roleId: parseInt(commInfo.committeeDesignation),
          isMember: checked,
          memberId: parseInt(commInfo.memberId),
          memberName: commInfo.memberName,
          status: 'A',
          roleRank: parseInt(commInfo.degData.roleRank),
        };
      } else {
        NotificationManager.warning('সদস্যের নাম ও পদবী প্রদান করুন', '', 5000);
      }
    } else {
      if (commInfo.committeeDesignation && commInfo.nid) {
        memObj = {
          roleId: parseInt(commInfo.committeeDesignation),
          isMember: checked,
          memberId: null,
          memberName: commInfo.name,
          memberNid: bangToEng(commInfo.nid),
          mobile: bangToEng(commInfo.mobile),
          orgName: commInfo.orgName,
          status: 'A',
          roleRank: parseInt(commInfo.degData.roleRank),
        };
      } else {
        NotificationManager.warning('সদস্যের নাম ও পদবী প্রদান করুন', '', 5000);
      }
    }
    const memberList = [...savePayload];
    memberList.push(memObj);
    if (memObj) {
      try {
        if (checkData(savePayload, memObj) == false) {
          localStorage.setItem('members', JSON.stringify(memberList));
          let getData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('members')) : null;
          setSavePayload(getData);
          setCommInfo({
            committeeDesignation: '',
            memberName: '',
            memberNid: '',
            memberDob: null,
            memberMob: '',
            name: '',
            orgName: '',
            nid: '',
            brn: '',
            mobile: '',
          });
          setMemberSelectName(null);
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const handleDeleteMembers = (e, i) => {
    let list = [...savePayload];
    list.splice(i, 1);
    localStorage.setItem('members', JSON.stringify(list));
    let getData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('members')) : null;
    setSavePayload(getData);
  };

  const appnDataInfo = async (applicationId) => {
    if (applicationId) {
      try {
        const applicationInfoGetData = await axios.get(applicationGetById + applicationId, config);
        const applicationAllData = applicationInfoGetData.data.data[0];
        setOpen(true);
        setGetSamityId(applicationAllData.data.samityId);
        setGetSamityLevel(router.query.samityLevel);
        setServicesId(applicationAllData.serviceId);
        setDocumentFetch(applicationAllData.data.documents);
        setIsManual(applicationAllData.isManual);

        switch (applicationAllData.serviceId) {
          case 3:
            setMeetingDate(applicationAllData.data.meetingDate);
            setElectionDate(applicationAllData.data.electionDate);
            break;
          case 4:
            setElectionDate(applicationAllData.data.electionDate);
            setEffectDate(applicationAllData.data.effectDate);
            setExpireDate(applicationAllData.data.expireDate);
            break;
          default:
            setMeetingDate(applicationAllData.data.meetingDate);
            setEffectDate(applicationAllData.data.effectDate);
            setExpireDate(applicationAllData.data.expireDate);
            break;
        }

        let newEditArray = [];
        let docData = applicationAllData?.data?.documents;
        for (let i = 0; i < docData.length; i++) {
          newEditArray.push({
            documentType: docData[i]?.documentId,
            documentNumber: docData[i]?.documentNo ? docData[i]?.documentNo : '',
            documentPictureFront: docData[i]?.documentName[0]?.fileNameUrl,
            documentPictureFrontName: docData[i]?.documentName[0]?.fileName,
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
            update: true,
          });
        }

        setDocumentList(newEditArray);
        setCommittePerson(applicationAllData.data.members.length);

        const memberData = applicationAllData.data.members;
        // setMembersdata(memberData);
        let payload = [];
        memberData &&
          memberData.map((row) =>
            payload.push({
              roleId: parseInt(row.roleId),
              isMember: row?.isMember.toLowerCase() === 'true',
              memberId: parseInt(row.memberId),
              memberName: row.memberName,
              memberNid: engToBang(row.memberNid),
              mobile: engToBang(row.mobile),
              memberDob: row.memberDob,
              orgName: row.orgName,
              status: row.status,
              roleRank: parseInt(row.roleRank),
            }),
          );
        localStorage.setItem('members', JSON.stringify(payload));
        setSavePayload(payload);
        setUpdate(true);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const [formErrors, setFormErrors] = useState({
    servicesId: '',
    committePerson: '',
    meetingDate: '',
    electionDate: '',
    effectDate: '',
  });

  let checkMandatory = () => {
    let flag2 = false;
    let errorObj = {
      servicesId: servicesId ? servicesId : '',
      committePerson: committePerson ? committePerson : '',
      meetingDate:
        servicesId == 3 || servicesId == 5 || servicesId == 9
          ? meetingDate
            ? meetingDate
            : ''
          : 'সভার তারিখ ব্যবহার হয়নি',
      electionDate:
        servicesId == 3 || servicesId == 4 ? (electionDate ? electionDate : '') : 'নির্বাচনের তারিখ ব্যবহার হয়নি',
      effectDate:
        servicesId == 4 || servicesId == 5 || servicesId == 9
          ? effectDate || regDate
            ? effectDate || regDate
            : ''
          : 'মেয়াদ শুরুর তারিখ ব্যবহার হয়নি',
    };
    for (const key in errorObj) {
      if (errorObj[key].length == 0) {
        flag2 = true;
        setFormErrors({
          ...formErrors,
          servicesId: servicesId ? '' : 'সেবার নাম প্রদান করুন',
          committePerson: committePerson ? '' : 'কমিটির সদস্য সংখ্যা নির্বাচন করুন',
          meetingDate: meetingDate ? '' : 'সভার তারিখ প্রদান করুন',
          electionDate: electionDate ? '' : 'নির্বাচনের তারিখ প্রদান করুন',
          effectDate: effectDate || regDate ? '' : 'মেয়াদ শুরুর তারিখ প্রদান করুন',
        });
      }
    }
    return flag2;
  };

  const getDocTypeNameBangla = (docId) => {
    if (parseInt(docId) === 12) {
      return 'সাংগঠনিক সভার রেজুলেশন';
    }
    if (parseInt(docId) === 20) {
      return 'নির্বাচনী নোটিশ';
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
          documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
        });
      });
    } else if (update) {
      const newDocumentInfo = documentFetch.map((doc) => {
        return doc.documentName[0].fileName;
      });

      documentList.map((docInfo, i) => {
        if (!newDocumentInfo.includes(docInfo.documentPictureFrontName)) {
          docList = [
            ...docList,
            {
              documentId: parseInt(docInfo.documentType),
              documentNo: docInfo.documentNumber,
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
              documentNo: docInfo.documentNumber,
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
  const convertQueryParamsToBase64 = (params) => {
    return Buffer.from(params).toString('base64');
  };
  const finalSubmit = async (e) => {
    e.preventDefault();
    if (checkMandatory() == false) {
      setLoadingDataSaveUpdate(true);
      let finalSubmitData;
      const submitPayload = {
        samityId: parseInt(getSamityId),
        serviceName: serviceName ? serviceName : 0,
        data: {
          samityId: parseInt(getSamityId),
          serviceId: parseInt(servicesId),
          samityName: samityNameInfo,
          committeeType: parseInt(servicesId) ? parseInt(servicesId) : serviceNameBan,
          ...(parseInt(servicesId) == 3 && {
            meetingDate: dateFormat(meetingDate),
            electionDate: dateFormat(electionDate),
          }),
          ...(parseInt(servicesId) == 4 && {
            electionDate: dateFormat(electionDate),
            effectDate: dateFormat(effectDate),
            expireDate: dateFormat(expireDate),
          }),
          ...(parseInt(servicesId) == 5 && {
            meetingDate: dateFormat(meetingDate),
            effectDate: dateFormat(effectDate),
            expireDate: dateFormat(expireDate),
          }),
          ...(parseInt(servicesId) == 9 && {
            meetingDate: dateFormat(meetingDate),
            effectDate: dateFormat(regDate),
            expireDate: dateFormat(expDate),
          }),

          documents: buildDocumentPayload(documentList),
          // documents: newDocumentArray,
          members: savePayload,
        },
      };

      try {
        if (update) {
          const finalSubmitData = await axios.put(committeeApply + '/' + appId, submitPayload, config);
          NotificationManager.success(finalSubmitData.data.message, '', 5000);
          setUpdate(false);
          setOpen(false);
          router.push({ pathname: '/coop/committee-setup' });
        } else {
          finalSubmitData = await axios.post(committeeApply, submitPayload, config);
          NotificationManager.success(finalSubmitData.data.message, '', 5000);
          setOpen(false);
          if (servicesId == 3 && totalSharePrice < 50000) {
            return window.open(
              liveIp +
              `jasper/coop/committee_adesh.pdf?id=${convertQueryParamsToBase64(
                `pSamityId=${getSamityId}&pUserName=${userData.nameBangla ? userData.nameBangla : userData.name}`,
              )}`,
            );
            // window.open(
            //   liveIp +
            //   `jasper/committee_adesh.pdf?pSamityId=${getSamityId}&pUserName=${userData.nameBangla ? userData.nameBangla : userData.name}`
            // );
          }
          router.push({ pathname: '/coop/committee-setup' });
        }
        setServicesId('');
        setElectionDate('');
        setEffectDate('');
        setExpireDate('');
        setDocumentList([
          {
            documentType: '',
            documentNumber: '',
            documentPictureFront: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
            update: false,
          },
        ]);
        setMemberSelectName('');
        localStorage.removeItem('members');
        setSavePayload([]);
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      NotificationManager.warning('বাধ্যতামুলক তথ্য প্রদান করুন', '', 5000);
    }
  };

  // const handleApproveSamity = (e) => {
  //   setGetSamityId(e.target.value);
  //   const getDataValue = allApprovalSamity.find((row) => row.id == e.target.value);
  //   setGetSamityLevel(getDataValue.samityLevel);
  //   localStorage.removeItem('members');
  //   getMemberInfo(e.target.value);
  //   setSavePayload([]);
  //   setCommInfo({
  //     ...commInfo,
  //     memberId: '',
  //     memberName: '',
  //     memberNid: '',
  //     memberMob: '',
  //     memberDob: null,
  //     committeeDesignation: '- নির্বাচন করুন -',
  //   });
  //   setMemberSelectName('');
  // };

  const memberDeactive = async (id) => {
    // setAnchorEl(false);
    if (id) {
      try {
        await Swal.fire({
          title: 'আপনি কি নিশ্চিত?',
          text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ফিরে যান ।',
          confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.patch(committeeMemberDeactive + id, '', config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                memberListData(id);
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
              }
            });
          }
        });
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const [modalChecked, setModalchecked] = useState(false);
  const [modalCommInfo, setModalcommInfo] = useState({
    servicesName: '',
    electionDate: '',
    effectDate: '',
    expireDate: '',
    committeeDesignation: '',
    memberId: '',
    memberName: '',
    memberNid: '',
    memberBrn: '',
    member: '',
    memberDob: null,
    memberMob: '',
    name: '',
    orgName: '',
    nid: '',
    brn: '',
    mobile: '',
    designation: '',
    degData: '',
  });

  const [modalformError] = useState({
    nid: '',
    brn: '',
    mobile: '',
  });

  const ModalhandleSwitch = (e) => {
    setModalchecked(e.target.checked);
    setModalcommInfo({
      committeeDesignation: '',
      memberName: '',
      memberNid: '',
      memberBrn: '',
      memberDob: null,
      memberMob: '',
      name: '',
      orgName: '',
      nid: '',
      brn: '',
      mobile: '',
    });
    setMemberSelectName('');
    if (samityName.samityId) {
      getMemberInfo(samityName.samityId);
    }
    getMemberInfo(getSamityId);
  };

  const modalhandleNameChange = (e) => {
    if (e.target.value == 0) {
      setModalcommInfo({
        ...modalCommInfo,
        memberId: '',
        memberName: '',
        memberNid: '',
        memberBrn: '',
        memberMob: '',
        memberDob: null,
      });
    } else {
      let data = JSON.parse(e.target.value);
      let myVal = data.val;
      let myName = data.memName;
      let myNid = data.nid ? data.nid : data.brn;
      let myMobile = data.mobile;
      let mydob = data.dob;
      // let myInd = data.ind;
      setModalcommInfo({
        ...modalCommInfo,
        memberId: myVal,
        memberName: myName,
        memberNid: myNid,
        memberMob: myMobile,
        memberDob: mydob,
      });
      setMemberSelectName(e.target.value);
    }
  };

  let modalhandleChange = (e) => {
    const { name, value } = e.target;
    let resultObj, memberDataNid, memberDataBrn, coomData;

    switch (name) {
      case 'mobile':
        resultObj = formValidator('mobile', value);
        if (resultObj?.status) {
          return;
        }
        setModalcommInfo({
          ...modalCommInfo,
          [name]: resultObj?.value,
        });
        modalformError.mobile = resultObj?.error;
        break;

      case 'nid':
        memberDataNid = formValidator('nid', value);
        memberDataBrn = formValidator('brn', value);
        if (memberDataNid?.status || memberDataBrn?.status) {
          return;
        }
        setModalcommInfo({
          ...modalCommInfo,
          [name]: bangToEng(value) > 0 ? memberDataNid?.value : memberDataBrn?.value,
        });
        modalformError.nid = memberDataNid?.error;
        modalformError.brn = memberDataBrn?.error;
        break;
      case 'committeeDesignation':
        coomData = memDegData.find((attribute) => attribute.id == value);
        setModalcommInfo({
          ...modalCommInfo,
          [name]: value,
          degData: coomData,
        });
        break;
      default:
        setModalcommInfo({
          ...modalCommInfo,
          [name]: value,
        });
    }
  };

  const checkNewMemberValidation = (memberList, obj) => {
    const roleId = obj.committeeRoleId;
    const memberId = obj.memberId;
    const roleData = memDegData.find((element) => element.id == obj.committeeRoleId);
    const noOfMember = roleData.noOfMember;
    const countMemDeg = memberList.filter((element) => element.roleId == roleId).length;

    let roleRank;

    for (const e of memberList) {
      if (e.roleId == roleData.id) {
        roleRank = roleData.roleRank;
        break;
      }
    }

    let isPresent = false;

    if (modalChecked) {
      let message;
      if (memberList.length > 0) {
        isPresent = memberList.some((e) => {
          return e.memberId == memberId;
        });
      }
      if (isPresent) {
        message = 'সদস্যটি বিদ্যমান রয়েছে';
      } else {
        if (roleRank == 1) {
          if (memberList.length > 0) {
            isPresent = memberList.some((e) => {
              return e.roleRank == 1;
            });
            if (isPresent) {
              message = 'সভাপতি, চেয়ারম্যান, ম্যানেজার পদ একের বেশি দেওয়া যাবে না';
            }
          }
        } else {
          if (countMemDeg >= noOfMember) {
            isPresent = true;
            message = 'এই পদবীটি ' + engToBang(noOfMember) + ' বার এর বেশি ব্যবহৃত করা যাবে না';
          } else {
            isPresent = false;
          }
        }
      }
      if (message) {
        NotificationManager.warning(message, '', 5000);
      }
    } else {
      let message;
      if (memberList.length > 0) {
        isPresent = memberList.some((e) => {
          return e.nid == obj.nid;
        });
      }
      if (isPresent) {
        message = 'সদস্য এনআইডি বিদ্যমান রয়েছে';
      } else {
        if (roleRank == 1) {
          if (memberList.length > 0) {
            isPresent = memberList.some((e) => {
              return e.roleRank == 1;
            });
            if (isPresent) {
              message = 'সভাপতি, চেয়ারম্যান, ম্যানেজার পদ একের বেশি দেওয়া যাবে না';
            }
          }
        } else {
          if (countMemDeg >= noOfMember) {
            isPresent = true;
            message = 'এই পদবীটি ' + engToBang(noOfMember) + ' বার এর বেশি ব্যবহৃত করা যাবে না';
          } else {
            isPresent = false;
          }
        }
      }
      if (message) {
        NotificationManager.warning(message, '', 5000);
      }
    }
    return isPresent;
  };

  const newMemberAdd = async (e) => {
    e.preventDefault();
    let memObjModal;
    if (modalChecked) {
      memObjModal = {
        samityId: getSamityId,
        committeeId: parseInt(committeeId),
        committeeRoleId: parseInt(modalCommInfo.committeeDesignation),
        isMember: modalChecked,
        dob: dateFormat(modalCommInfo.memberDob),
        memberId: modalCommInfo.memberId,
        memberName: modalCommInfo.memberName,
        nid: bangToEng(modalCommInfo.memberNid),
        mobile: parseInt(bangToEng(modalCommInfo.memberMob)),
      };
    } else {
      memObjModal = {
        samityId: getSamityId,
        committeeId: parseInt(committeeId),
        committeeRoleId: parseInt(modalCommInfo.committeeDesignation),
        isMember: modalChecked,
        memberName: modalCommInfo.name,
        nid: bangToEng(modalCommInfo.nid),
        mobile: parseInt(bangToEng(modalCommInfo.mobile)),
      };
    }
    try {
      if (checkNewMemberValidation(modalmemberList, memObjModal) == false) {
        const addMember = await axios.post(committeeAddMember, memObjModal, config);
        NotificationManager.success(addMember.data.message, '', 5000);
        setModalcommInfo({
          committeeDesignation: '',
          memberName: '',
          memberNid: '',
          memberBrn: '',
          memberDob: null,
          memberMob: '',
          name: '',
          orgName: '',
          nid: '',
          brn: '',
          mobile: '',
        });
        setMemberSelectName('');
        setOpenadd(false);
        memberListData(getSamityId);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const takeData = (samityData) => {
    setIsManual(samityData.isManual);
    setGetSamityId(samityData.id);
    setGetSamityLevel(samityData.samityLevel);
    setSamityNameInfo(samityData.samityName);
    serviceInfo();
  };

  return (
    <>
      <Grid container spacing={2.5}>
        {userData?.type == 'user' ? <DisUpaOffice {...{ takeData, size: 3.3, getData: 'approved' }} /> : ''}
        <Grid item md={2} xs={12}>
          <Button className="btn btn-primary" onClick={handleClickOpen} size="small">
            <AddIcons /> কমিটি গঠনের আবেদন
          </Button>
          <>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md">
              <DialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
                sx={{
                  background: 'var(--color-bg-topbar)',
                  fontWeight: 'bold',
                }}
              >
                কমিটি গঠনের জন্য আবেদন
              </DialogTitle>
              <DialogContent dividers>
                <>
                  <Grid container spacing={2.5}>
                    <Grid item md={6} xs={12}>
                      <span>
                        <b>
                          {samiteeName}{' '}
                          {samiteeLevel == 'P'
                            ? '(প্রাথমিক সমিতি)'
                            : '' || samiteeLevel == 'C'
                              ? '(কেন্দ্রিয় সমিতি)'
                              : '' || samiteeLevel == 'N'
                                ? '(জাতীয় সমিতি)'
                                : ''}
                        </b>
                      </span>
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <>
                        <TextField
                          fullWidth
                          label={RequiredFile('সেবার নাম')}
                          name="servicesName"
                          onChange={handleChangeService}
                          select
                          SelectProps={{ native: true }}
                          value={servicesId || 0}
                          variant="outlined"
                          size="small"
                          style={{ backgroundColor: '#FFF' }}
                          error={formErrors.servicesId ? true : false}
                          helperText={formErrors.servicesId}
                        >
                          {' '}
                          <option value={0}>- নির্বাচন করুন -</option>
                          {servicesNameData.map((option, i) => (
                            <option key={i} value={option.id}>
                              {option.serviceName}
                            </option>
                          ))}
                        </TextField>
                      </>
                    </Grid>
                    {servicesId == 3 ? (
                      <>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={RequiredFile('ব্যবস্থাপনা কমিটির সভার তারিখ')}
                              name="meetingDate"
                              value={meetingDate}
                              disableFuture={true}
                              onChange={(newValue) => {
                                setMeetingDate(newValue);
                                setFormErrors({
                                  ...formErrors,
                                  meetingDate: '',
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.meetingDate ? true : false}
                                  helperText={formErrors.meetingDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={RequiredFile('নির্বাচনের তারিখ')}
                              name="electionDate"
                              value={electionDate}
                              disablePast={true}
                              onChange={(newValue) => {
                                setElectionDate(newValue);
                                setFormErrors({
                                  ...formErrors,
                                  electionDate: '',
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.electionDate ? true : false}
                                  helperText={formErrors.electionDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </>
                    ) : (
                      ''
                    )}
                    {servicesId == 4 ? (
                      <>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={RequiredFile('নির্বাচনের তারিখ')}
                              name="electionDate"
                              value={electionDate}
                              disableFuture={true}
                              onChange={(newValue) => {
                                setElectionDate(newValue);
                                setFormErrors({
                                  ...formErrors,
                                  electionDate: '',
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.electionDate ? true : false}
                                  helperText={formErrors.electionDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={RequiredFile('মেয়াদ শুরুর তারিখ')}
                              value={effectDate}
                              name="effectDate"
                              disablePast={true}
                              disabled={servicesId === '' ? true : false}
                              onChange={(newValue) => {
                                if (servicesId == 4) {
                                  var expireDate = moment(newValue).add(1095, 'd').toDate();
                                  setEffectDate(newValue);
                                  setExpireDate(expireDate);
                                  setFormErrors({
                                    ...formErrors,
                                    effectDate: '',
                                  });
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.effectDate ? true : false}
                                  helperText={formErrors.effectDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              disabled
                              label={RequiredFile('মেয়াদ শেষের তারিখ')}
                              name="expireDate"
                              value={expireDate}
                              onChange={(newValue) => {
                                setExpireDate(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </>
                    ) : (
                      ''
                    )}
                    {servicesId == 5 ? (
                      <>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={RequiredFile('ব্যবস্থাপনা কমিটির সভার তারিখ')}
                              name="meetingDate"
                              value={meetingDate}
                              inputFormat="dd/MM/yyyy"
                              onChange={(newValue) => {
                                setMeetingDate(newValue);
                                setFormErrors({
                                  ...formErrors,
                                  meetingDate: '',
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.meetingDate ? true : false}
                                  helperText={formErrors.meetingDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={RequiredFile('মেয়াদ শুরুর তারিখ')}
                              value={effectDate}
                              name="effectDate"
                              disabled={servicesId === '' ? true : false}
                              onChange={(newValue) => {
                                if (servicesId == 5) {
                                  var expireDate = moment(newValue).add(120, 'd').toDate();

                                  setEffectDate(newValue);
                                  setExpireDate(expireDate);
                                  setFormErrors({
                                    ...formErrors,
                                    effectDate: '',
                                  });
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.effectDate ? true : false}
                                  helperText={formErrors.effectDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              disabled
                              label={RequiredFile('মেয়াদ শেষের তারিখ')}
                              inputFormat="dd/MM/yyyy"
                              name="expireDate"
                              value={expireDate}
                              onChange={(newValue) => {
                                setExpireDate(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </>
                    ) : (
                      ''
                    )}

                    {servicesId == 9 ? (
                      <>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={RequiredFile('ব্যবস্থাপনা কমিটির সভার তারিখ')}
                              name="meetingDate"
                              value={meetingDate}
                              inputFormat="dd/MM/yyyy"
                              onChange={(newValue) => {
                                setMeetingDate(newValue);
                                setFormErrors({
                                  ...formErrors,
                                  meetingDate: '',
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.meetingDate ? true : false}
                                  helperText={formErrors.meetingDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              disabled
                              label={RequiredFile('মেয়াদ শুরুর তারিখ')}
                              value={regDate}
                              inputFormat="dd/MM/yyyy"
                              name="effectDate"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={formErrors.effectDate ? true : false}
                                  helperText={formErrors.effectDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              disabled
                              label={RequiredFile('মেয়াদ শেষের তারিখ')}
                              value={expDate}
                              inputFormat="dd/MM/yyyy"
                              name="expireDate"
                              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </>
                    ) : (
                      ''
                    )}
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label={RequiredFile('কমিটির সদস্য সংখ্যা')}
                        name="committePerson"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={committePerson || 0}
                        variant="outlined"
                        size="small"
                        error={formErrors.committePerson ? true : false}
                        helperText={formErrors.committePerson}
                      >
                        {servicesId == 3 || servicesId == 5 ? (
                          <>
                            {ElectionCommittee.map((option, i) => (
                              <option key={i} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </>
                        ) : (
                          <>
                            {Committee.map((option, i) => (
                              <option key={i} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </>
                        )}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
                    <DynamicDocSectionContent
                      documentList={documentList}
                      documentType={documentType}
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

                  <Grid item xs={12}>
                    <SubHeading>কমিটির সদস্য সংযুক্তকরন</SubHeading>
                  </Grid>

                  <Grid container spacing={2.5} py={1}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>সদস্যের তথ্য :</span>
                      <FormControlLabel
                        label={RequiredFile('সমবায়ের সদস্য কি?')}
                        labelPlacement="start"
                        name="isActive"
                        control={
                          <Switch
                            checked={checked}
                            onChange={handleSwitch}
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={disabled}
                          />
                        }
                      />
                    </Grid>
                    {checked == true ? (
                      <>
                        {getSamityLevel == 'C' || getSamityLevel == 'N' ? (
                          <>
                            <Grid item md={6} xs={12}>
                              <TextField
                                fullWidth
                                label={RequiredFile('সদস্যের নাম')}
                                name="memberName"
                                onChange={handleNameChangeCentralNational}
                                select
                                SelectProps={{ native: true }}
                                variant="outlined"
                                size="small"
                                style={{ background: '#FFF' }}
                                value={memberSelectName || 0}
                              >
                                {' '}
                                <option value={0}>- নির্বাচন করুন -</option>
                                {memName?.map((opt, i) => (
                                  <option
                                    key={i}
                                    value={JSON.stringify({
                                      val: opt.memberBasicInfo.id,
                                      ind: i,
                                      memName: opt.memberBasicInfo.memberName,
                                    })}
                                  >
                                    {opt.memberBasicInfo.samitySignatoryPerson} -{' '}
                                    {opt.memberBasicInfo.samitySignatoryPerson
                                      ? ' প্রতিনিধি, ' + opt.memberBasicInfo.memberName
                                      : ''}
                                  </option>
                                ))}
                              </TextField>
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid item md={6} xs={12}>
                              <TextField
                                fullWidth
                                label={RequiredFile('সদস্যের নাম')}
                                name="memberName"
                                onChange={handleNameChange}
                                select
                                SelectProps={{ native: true }}
                                variant="outlined"
                                size="small"
                                style={{ backgroundColor: '#FFF' }}
                                value={memberSelectName || 0}
                              >
                                {' '}
                                <option value={0}>- নির্বাচন করুন -</option>
                                {memName?.map((opt, i) => (
                                  <option
                                    key={i}
                                    value={JSON.stringify({
                                      val: opt.memberBasicInfo.id,
                                      ind: i,
                                      memName: opt.memberBasicInfo.memberNameBangla,
                                      nid: opt.memberBasicInfo.nid,
                                      brn: opt.memberBasicInfo.brn,
                                      mobile: opt.memberBasicInfo.mobile,
                                      dob: opt.memberBasicInfo.dob,
                                    })}
                                  >
                                    {opt.memberBasicInfo.memberNameBangla}
                                  </option>
                                ))}
                              </TextField>
                            </Grid>

                            <Grid item md={6} xs={12}>
                              <TextField
                                disabled={true}
                                fullWidth
                                label={RequiredFile('জাতীয় পরিচয়পত্র')}
                                name="memberNid"
                                value={engToBang('' + commInfo.memberNid || commInfo.memberBrn || '' + '')}
                                variant="outlined"
                                size="small"
                              ></TextField>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <TextField
                                fullWidth
                                disabled={true}
                                label={RequiredFile('মোবাইল নাম্বার')}
                                name="memberMob"
                                value={engToBang('' + commInfo.memberMob || '' + '')}
                                variant="outlined"
                                size="small"
                              ></TextField>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  disabled={true}
                                  label={'জন্ম তারিখ'}
                                  name="memberDob"
                                  value={commInfo.memberDob}
                                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                />
                              </LocalizationProvider>
                            </Grid>
                          </>
                        )}
                        <Grid item md={4} xs={12}>
                          <TextField
                            fullWidth
                            label={RequiredFile('পদবী')}
                            name="committeeDesignation"
                            onChange={handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={commInfo.committeeDesignation || 0}
                            variant="outlined"
                            size="small"
                          >
                            <option value={0}>- নির্বাচন করুন -</option>
                            {memDegData?.map((option, i) => (
                              <option key={i} value={option.id}>
                                {option.roleName}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item md={6} xs={12}>
                          <TextField
                            fullWidth
                            label={RequiredFile('সদস্যের নাম')}
                            name="name"
                            onChange={handleChange}
                            TextField
                            value={commInfo.name}
                            variant="outlined"
                            size="small"
                          ></TextField>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            fullWidth
                            label={RequiredFile('জাতীয় পরিচয়পত্র')}
                            placeholder="উদাহরন- ২৩৫*******"
                            name="nid"
                            value={commInfo.nid ? commInfo.nid : commInfo.brn}
                            onChange={handleChange}
                            TextField
                            variant="outlined"
                            size="small"
                            error={formError.nid ? true : false}
                            helperText={formError.nid ? formError.nid : ''}
                          ></TextField>
                        </Grid>

                        <Grid item md={4} xs={12}>
                          <TextField
                            fullWidth
                            label={RequiredFile('মোবাইল নাম্বার')}
                            placeholder="উদাহরন- ০১৮২৯-******"
                            name="mobile"
                            onChange={handleChange}
                            value={commInfo.mobile}
                            TextField
                            variant="outlined"
                            size="small"
                            error={formError.mobile ? true : false}
                            helperText={formError.mobile ? formError.mobile : ''}
                          ></TextField>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            fullWidth
                            label={'সংগঠনের নাম'}
                            name="orgName"
                            value={commInfo.orgName}
                            onChange={handleChange}
                            TextField
                            variant="outlined"
                            size="small"
                          ></TextField>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            fullWidth
                            label={RequiredFile('পদবী')}
                            name="committeeDesignation"
                            onChange={handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={commInfo.committeeDesignation || 0}
                            variant="outlined"
                            size="small"
                          >
                            <option value={0}>- নির্বাচন করুন -</option>
                            {memDegData?.map((option, i) => (
                              <option key={i} value={option.id}>
                                {option.roleName}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid container className="btn-container">
                    <Tooltip title="সদস্য সংরক্ষন করুন">
                      <Button
                        className="btn btn-save"
                        onClick={onSubmitData}
                        startIcon={<StorageIcon />}
                        endIcon={<KeyboardDoubleArrowDownIcon />}
                        disabled={committePerson == savePayload.length ? true : false}
                      >
                        সদস্য সংরক্ষন করুন
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} py={2}>
                      <Box>
                        <TableContainer className="table-container">
                          <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                            <TableHead className="table-head">
                              <TableRow>
                                <TableCell align="center">ক্রমিক নং</TableCell>
                                <TableCell align="center">সদস্য কি?</TableCell>
                                <TableCell>নাম</TableCell>
                                <TableCell>জাতীয় পরিচয়পত্র</TableCell>
                                <TableCell>জন্মতারিখ/সংগঠক</TableCell>
                                <TableCell>মোবাইল</TableCell>
                                <TableCell>পদবী</TableCell>
                                <TableCell>&nbsp;</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {savePayload.map((rows, ind) => (
                                <TableRow key={ind}>
                                  <TableCell scope="row" sx={{ textAlign: 'center' }}>
                                    {numberToWord('' + (ind ? ind + 1 : ind + 1) + '')}
                                  </TableCell>
                                  <TableCell align="center">{rows.isMember == true ? 'হ্যা' : 'না'}</TableCell>
                                  <TableCell>
                                    <Tooltip title={<div className="tooltip-title">{rows.memberName}</div>} arrow>
                                      <span className="data">{rows.memberName}</span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip
                                      title={
                                        <div className="tooltip-title">
                                          {numberToWord('' + rows.memberNid ? rows.memberNid : '' + '')}
                                        </div>
                                      }
                                      arrow
                                    >
                                      <span className="data">
                                        {numberToWord('' + rows.memberNid ? rows.memberNid : '' + '')}
                                      </span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip
                                      title={
                                        <div className="tooltip-title">
                                          {rows.memberDob ? numberToWord('' + rows.memberDob + '') : rows.orgName}
                                        </div>
                                      }
                                      arrow
                                    >
                                      <span className="data">
                                        {rows.memberDob ? numberToWord('' + rows.memberDob + '') : rows.orgName}
                                      </span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip
                                      title={
                                        <div className="tooltip-title">
                                          {numberToWord('' + rows.mobile ? rows.mobile : '' + '')}
                                        </div>
                                      }
                                      arrow
                                    >
                                      <span className="data">
                                        {numberToWord('' + rows.mobile ? rows.mobile : '' + '')}
                                      </span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>{roleDesignation(rows.roleId)}</TableCell>
                                  <TableCell align="center">
                                    <Button className="table-icon delete" onClick={(e) => handleDeleteMembers(e, ind)}>
                                      <ClearIcon />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container className="btn-container">
                    {loadingDataSaveUpdate ? (
                      <LoadingButton
                        loading
                        loadingPosition="start"
                        startIcon={<SaveOutlinedIcon />}
                        variant="contained"
                      >
                        {' '}
                        {update ? 'হালনাগাদ হচ্ছে.......' : 'সংরক্ষন করা হচ্ছে...'}
                      </LoadingButton>
                    ) : (
                      <Button
                        className="btn btn-save"
                        onClick={finalSubmit}
                        disabled={committePerson == savePayload.length && savePayload.length > 0 ? false : true}
                        startIcon={<SaveOutlinedIcon />}
                      >
                        {' '}
                        {update
                          ? 'হালনাগাদ করুন'
                          : committePerson == savePayload.length
                            ? 'সংরক্ষন করুন'
                            : 'নির্ধারিত সদস্য সংখ্যা প্রদান করুন '}
                      </Button>
                    )}
                  </Grid>
                </>
              </DialogContent>
            </Dialog>
          </>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1} mt={1}>
            {modalCommittee?.status == 'A' ? (
              <>
                <Grid item md={12} xs={12} my={1}>
                  <Paper>
                    <Grid container spacing={2.5} px={2} py={1}>
                      <Grid item xs={12}>
                        <span className="label"> সমিতির নাম : &nbsp;</span>
                        <span>
                          {samiteeName}{' '}
                          {samiteeLevel == 'P'
                            ? '(প্রাথমিক সমিতি)'
                            : '' || samiteeLevel == 'C'
                              ? '(কেন্দ্রিয় সমিতি)'
                              : '' || samiteeLevel == 'N'
                                ? '(জাতীয় সমিতি)'
                                : ''}
                        </span>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <span className="label">কমিটির ধরন : &nbsp;</span>
                        <span>
                          {' '}
                          {(modalCommittee?.committeeType == 'E' ? 'নির্বাচিত কমিটি' : '') ||
                            (modalCommittee?.committeeType == 'S' ? 'অনুমোদিত প্রথম কমিটি' : '')}
                        </span>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <span className="label"> কমিটির সদস্য সংখ্যা : &nbsp;</span>
                        <span>{numberToWord('' + modalCommittee?.noOfMember + '')} জন</span>
                      </Grid>

                      {modalCommittee?.committeeType == 'E' ? (
                        <>
                          <Grid item md={4} xs={12}>
                            <span className="label">সমিতির নির্বাচনের তারিখ : &nbsp;</span>
                            <span>
                              &nbsp;
                              {numberToWord('' + dateFormat(modalCommittee?.effectDate) + '')}
                            </span>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <span className="label">মেয়াদ শুরুর তারিখ : &nbsp;</span>
                            <span>
                              &nbsp;
                              {numberToWord('' + dateFormat(modalCommittee?.effectDate) + '')}
                            </span>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <span className="label">মেয়াদ শেষের তারিখ : &nbsp;</span>
                            <span>
                              &nbsp;
                              {numberToWord('' + dateFormat(modalCommittee?.expireDate) + '')}
                            </span>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <span className="label"> কমিটির মেয়াদ : &nbsp;</span>
                            <span> {numberToWord('' + modalCommittee?.duration + '')} বছর</span>
                          </Grid>
                        </>
                      ) : (
                        ''
                      )}
                      {modalCommittee?.committeeType == 'S' ? (
                        <>
                          <Grid item md={4} xs={12}>
                            <span className="label">মেয়াদ শুরুর তারিখ : &nbsp;</span>
                            <span>
                              &nbsp;
                              {numberToWord('' + dateFormat(modalCommittee?.effectDate) + '')}
                            </span>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <span className="label">মেয়াদ শেষের তারিখ : &nbsp;</span>
                            <span>
                              &nbsp;
                              {numberToWord('' + dateFormat(modalCommittee?.expireDate) + '')}
                            </span>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <span className="label"> কমিটির মেয়াদ : &nbsp;</span>
                            <span> {numberToWord('' + modalCommittee?.duration + '')} বছর</span>
                          </Grid>
                        </>
                      ) : (
                        ''
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              </>
            ) : (
              ''
            )}
            <Grid item sm={12} md={12} xs={12} py={1}>
              <SubHeading>
                <span style={{ fontWeight: 'bold' }}>কমিটির সদস্যের তথ্য</span>
                <Button className="btn btn-primary btn-subheading" onClick={handleOpenAdd}>
                  <AddIcons sx={{ display: 'block' }} />
                  কমিটিতে নতুন সদস্য সংযোজন
                </Button>
              </SubHeading>
              <TableContainer className="table-container">
                <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell align="center">ক্রমিক</TableCell>
                      <TableCell>সদস্যের নাম</TableCell>
                      <TableCell>জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন</TableCell>
                      <TableCell>পদবী</TableCell>
                      <TableCell align="center">অবস্থা</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modalmemberList.map((rows, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell scope="row" align="center">
                            {numberToWord('' + (i + 1) + '')}
                          </TableCell>
                          <TableCell>
                            {rows?.memberNameBg
                              ? rows?.memberNameBg
                              : rows?.memberNameNs
                                ? rows?.memberNameNs
                                : rows?.memberNameS}
                          </TableCell>
                          <TableCell>
                            {rows?.memberBrn
                              ? numberToWord('' + rows?.memberBrn + '')
                              : rows?.memberNid
                                ? numberToWord('' + rows?.memberNid + '')
                                : rows?.nid
                                  ? numberToWord('' + rows?.nid + '')
                                  : 'কোন তথ্য নেই'}
                          </TableCell>
                          <TableCell>{rows?.roleName}</TableCell>
                          <TableCell align="center">{rows?.memberStatus == 'A' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</TableCell>
                          <TableCell align="center">
                            {rows?.memberStatus == 'A' && (
                              <div>
                                <Tooltip title="সদস্যের পদবী বাতিল">
                                  <Button className="table-icon delete"
                                  // onClick={(e) => handleMenu(e, rows.id)}
                                  >
                                    <CloseIcon onClick={() => memberDeactive(rows.id)} />
                                  </Button>
                                </Tooltip>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <>
                <Dialog onClose={handleCloseAdd} aria-labelledby="customized-dialog-title" open={openAdd} maxWidth="md">
                  <DialogTitle id="customized-dialog-title" onClose={handleCloseAdd}>
                    কমিটির সদস্য যোগ করুন
                  </DialogTitle>
                  <DialogContent dividers>
                    <Grid container spacing={2.5} py={1}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FormControlLabel
                          label={RequiredFile('সমবায়ের সদস্য কি?')}
                          labelPlacement="start"
                          name="isActive"
                          control={
                            <Switch
                              checked={modalChecked}
                              onChange={ModalhandleSwitch}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          }
                        />
                      </Grid>

                      {modalChecked == true ? (
                        <>
                          {getSamityLevel == 'C' || getSamityLevel == 'N' ? (
                            <>
                              <Grid item lg={9.5} md={9.5} sm={12} xs={12}>
                                <TextField
                                  fullWidth
                                  label={RequiredFile('সদস্যের নাম')}
                                  name="memberName"
                                  onChange={handleNameChangeCentralNational}
                                  select
                                  SelectProps={{ native: true }}
                                  variant="outlined"
                                  size="small"
                                  style={{ backgroundColor: '#FFF' }}
                                  value={memberSelectName || 0}
                                >
                                  {' '}
                                  <option value={0}>- নির্বাচন করুন -</option>
                                  {memName?.map((opt, i) => (
                                    <option
                                      key={i}
                                      value={JSON.stringify({
                                        val: opt.memberBasicInfo.id,
                                        ind: i,
                                        memName: opt.memberBasicInfo.memberName,
                                      })}
                                    >
                                      {opt.memberBasicInfo.samitySignatoryPerson +
                                        ' - ' +
                                        opt.memberBasicInfo.samitySignatoryPerson &&
                                        ' প্রতিনিধি, ' + opt.memberBasicInfo.memberName}
                                    </option>
                                  ))}
                                </TextField>
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid item lg={3} md={3} sm={12} xs={12}>
                                <TextField
                                  fullWidth
                                  label={RequiredFile('সদস্যের নাম')}
                                  name="memberName"
                                  onChange={modalhandleNameChange}
                                  select
                                  SelectProps={{ native: true }}
                                  variant="outlined"
                                  size="small"
                                  style={{ backgroundColor: '#FFF' }}
                                  value={memberSelectName || 0}
                                >
                                  {' '}
                                  <option value={0}>- নির্বাচন করুন -</option>
                                  {memName.map((opt, i) => (
                                    <option
                                      key={i}
                                      value={JSON.stringify({
                                        val: opt.memberBasicInfo.id,
                                        ind: i,
                                        memName: opt.memberBasicInfo.memberNameBangla,
                                        nid: opt.memberBasicInfo.nid,
                                        brn: opt.memberBasicInfo.brn,
                                        mobile: opt.memberBasicInfo.mobile,
                                        dob: opt.memberBasicInfo.dob,
                                      })}
                                    >
                                      {opt.memberBasicInfo.memberNameBangla}
                                    </option>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                                <TextField
                                  fullWidth
                                  label={RequiredFile('জাতীয় পরিচয়পত্র')}
                                  name="memberNid"
                                  value={engToBang('' + modalCommInfo.memberNid || modalCommInfo.memberBrn || '' + '')}
                                  variant="outlined"
                                  size="small"
                                ></TextField>
                              </Grid>
                              <Grid item lg={2} md={2} sm={12} xs={12}>
                                <TextField
                                  fullWidth
                                  label={'মোবাইল নাম্বার'}
                                  name="memberMob"
                                  value={engToBang('' + modalCommInfo.memberMob || '' + '')}
                                  variant="outlined"
                                  size="small"
                                ></TextField>
                              </Grid>
                              <Grid item lg={2} md={2} sm={12} xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    label={'জন্ম তারিখ'}
                                    name="memberDob"
                                    value={modalCommInfo.memberDob}
                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                  />
                                </LocalizationProvider>
                              </Grid>
                            </>
                          )}
                          <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                            <TextField
                              fullWidth
                              label={RequiredFile('পদবী')}
                              name="committeeDesignation"
                              onChange={modalhandleChange}
                              select
                              SelectProps={{ native: true }}
                              value={modalCommInfo.committeeDesignation || 0}
                              variant="outlined"
                              size="small"
                            >
                              <option value={0}>- নির্বাচন করুন -</option>
                              {memDegData?.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.roleName}
                                </option>
                              ))}
                            </TextField>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item lg={3} md={3} sm={12} xs={12}>
                            <TextField
                              fullWidth
                              label={RequiredFile('সদস্যের নাম')}
                              name="name"
                              onChange={modalhandleChange}
                              TextField
                              value={modalCommInfo.name}
                              variant="outlined"
                              size="small"
                            ></TextField>
                          </Grid>
                          <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                            <TextField
                              fullWidth
                              label={RequiredFile('জাতীয় পরিচয়পত্র')}
                              placeholder="উদাহরন- ২৩৫******"
                              name="nid"
                              value={modalCommInfo.nid}
                              onChange={modalhandleChange}
                              TextField
                              variant="outlined"
                              size="small"
                              error={modalformError.nid ? true : false}
                              helperText={modalformError.nid ? modalformError.nid : ''}
                            ></TextField>
                          </Grid>
                          <Grid item lg={2} md={2} sm={12} xs={12}>
                            <TextField
                              fullWidth
                              label={'মোবাইল নাম্বার'}
                              placeholder="উদাহরন- ০১৮২৯-******"
                              name="mobile"
                              onChange={modalhandleChange}
                              value={modalCommInfo.mobile}
                              TextField
                              variant="outlined"
                              size="small"
                              error={modalformError.mobile ? true : false}
                              helperText={modalformError.mobile ? modalformError.mobile : ''}
                            ></TextField>
                          </Grid>
                          <Grid item lg={2} md={2} sm={12} xs={12}>
                            <TextField
                              fullWidth
                              label={'সংগঠনের নাম'}
                              name="orgName"
                              value={modalCommInfo.orgName}
                              onChange={modalhandleChange}
                              TextField
                              variant="outlined"
                              size="small"
                            ></TextField>
                          </Grid>
                          <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                            <TextField
                              fullWidth
                              label={RequiredFile('পদবী')}
                              name="committeeDesignation"
                              onChange={modalhandleChange}
                              select
                              SelectProps={{ native: true }}
                              value={modalCommInfo.committeeDesignation || 0}
                              variant="outlined"
                              size="small"
                            >
                              <option value={0}>- নির্বাচন করুন -</option>
                              {memDegData?.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.roleName}
                                </option>
                              ))}
                            </TextField>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Grid container className="btn-container">
                      <Button
                        variant="contained"
                        className="btn btn-save"
                        onClick={newMemberAdd}
                        startIcon={<AddIcon />}
                      >
                        {' '}
                        সদস্য যোগ করুন
                      </Button>
                    </Grid>
                  </DialogActions>
                </Dialog>
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CommSetup;
