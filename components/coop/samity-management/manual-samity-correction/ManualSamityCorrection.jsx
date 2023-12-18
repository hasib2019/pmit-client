/* eslint-disable no-unused-vars */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import RefactoredToOfficeSelectItem from 'components/utils/coop/RefactoredToOfficeSelectItem';
import { FetchWrapper } from 'helpers/fetch-wrapper';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng } from 'service/numberConverter';
import Swal from 'sweetalert2';
import {
  MemberAreaInsert,
  SamityMigrationCorrection,
  SamityMigrationCorrectionApplicationData,
  SamityType,
  WorkingAreaInsert,
  enterprising,
  projectList,
  samityInfo,
} from '../../../../url/coop/ApiList';
import { AreaSelection } from './AreaSelection';
import { CoopInfo } from './CoopInfo';
import { Documents } from './Documents';
import { OfficeAddress } from './OfficeAddress';
import { SamityMemberInfo } from './SamityMemberInfo';

const ManualSamityCorrection = ({ samityId }) => {
  const officeGeoCode = localStorageData('officeGeoData');
  const dispatch = useDispatch();
  const {
    originUnitId,
    officeId,
    designationId: desgId,
    // applicationName: appName,
    // defaultValue: defValue,
    ownOrOthers: ownOther,
  } = useSelector((state) => state.officeSelectApproval);
  const config = localStorageData('config');
  // state part
  const [update, setUpdate] = useState(false);
  const [updateById, setUpdateById] = useState('');
  const [coop, setCoop] = useState({
    samityCode: '',
    samityName: '',
    samityLevel: 'P',
    samityFormationDate: null,
    samityRegistrationDate: null,
    oldRegistrationNo: '',
    organizerId: '',
    officeId: '',
    projectId: '',
    samityTypeId: '',
    purpose: '',
    enterprisingOrg: '',
    villageArea: '',
    declaration: false,
    samityEffectiveness: 'E',
    memberAreaType: 5,
    workingAreaType: 5,
    samityDivisionId: '',
    samityDistrictId: '',
    samityUpaCityId: '',
    samityUpaCityType: '',
    samityUniThanaPawId: '',
    samityUniThanaPawType: '',
    samityDetailsAddress: '',
  });
  const [documentList, setDocumentList] = useState([
    {
      id: '',
      documentType: 18,
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
    samityLevel: '',
    samityName: '',
    samityCode: '',
    samityEffectiveness: '',
    regDate: '',
    //formationdDate: "",
    oldRegistrationNo: '',
    samityTypeId: '',
    divisionId: '',
    districtId: '',
    upacityIdType: '',
    uniThanaPawIdType: '',
    villageArea: '',
    memberUnionArea: '',
    workingUnionArea: '',
    noOfShare: '',
    sharePrice: '',
    soldShare: '',
    occupation: '',
    servicesName: '',
    enterprisingOrg: '',
    authorizedPersonName: '',
    authorizedPersonmobile: '',
    authorizedPersonNid: '',
    designationId: '',
    memberDivisionArea: '',
    documentType: '',
    documentNumber: '',
    documentPictureFront: '',
    memDivision: '',
    memDistrict: '',
    memUpazila: '',
    memUnion: '',
    memDetail: '',
    workDivision: '',
    workDistrict: '',
    workUpazila: '',
    workUnion: '',
    workDetail: '',
    mandatoryDocError: '',
    officeError: '',
    officerError: '',
    originUnitError: '',
    designationError: '',
    nid: '',
    mobile: '',
    detailsAddressError: '',
  });
  const [samityType, setSamityType] = useState([]);
  const [enterprisingOrg, setEnterprisingOrg] = useState([]);
  const [projects, setProjects] = useState([]);
  const [memberSelectArea, setMemberSelectArea] = useState([
    {
      divisionId: '',
      divisionIdError: '',
      districtId: '',
      districtIdError: '',
      upaCityId: '',
      upaCityIdError: '',
      upaCityType: '',
      uniThanaPawId: '',
      uniThanaPawIdError: '',
      uniThanaPawType: '',
      detailsAddress: '',
      detailsAddressError: '',
      status: 'A',
    },
  ]);
  const [workingArea, setWorkingArea] = useState([
    {
      divisionId: '',
      divisionIdError: '',
      districtId: '',
      districtIdError: '',
      upaCityId: '',
      upaCityIdError: '',
      upaCityType: '',
      uniThanaPawId: '',
      uniThanaPawIdError: '',
      uniThanaPawType: '',
      detailsAddress: '',
      detailsAddressError: '',
      status: 'A',
    },
  ]);

  const [checkedArea, setCheckedArea] = useState(false);
  const [workingAreaData] = useState([]);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [samityMemberData, setSamityMemberData] = useState({
    samityAsAMember: {
      samityId: '',
      memberId: 0,
      memberName: '',
      nid: '',
      mobile: '',
      memberNameBangla: '',
    },
    personAsAMember: {
      authorizedPersonName: '',
      authorizedPersonNid: '',
      authorizedPersonmobile: '',
    },
  });
  const [nextAppDesignationId, setNextAppDesignationId] = useState('');
  // Hook part
  useEffect(() => {
    getSamityInfo(samityId);
    getData();
  }, [samityId]);

  // function part
  const getSamityInfo = async (id) => {
    let getApplicationData, samityData;
    getApplicationData = await FetchWrapper.get(SamityMigrationCorrectionApplicationData + id);
    if (getApplicationData?.nextAppDesignationId) {
      samityData = {
        MemberArea: getApplicationData.data.memberArea,
        Samity: [getApplicationData.data.samityInfo],
        SamityDocument: getApplicationData.data.documentInfo,
        WorkingArea: getApplicationData.data.workingArea,
        authorizedPerson: {
          authorizedpersonname: getApplicationData.data.memberInfo.memberNameBangla,
          authorizedpersonnid: getApplicationData.data.memberInfo.nid,
          authorizedpersonmobile: getApplicationData.data.memberInfo.mobile,
        },
      };
      setNextAppDesignationId(getApplicationData?.nextAppDesignationId);
      setUpdateById(getApplicationData?.id);
      setUpdate(true);
    } else {
      samityData = await FetchWrapper.get(samityInfo + id);
      console.log(samityData);
      setUpdate(false);
    }

    setCoop(samityData?.Samity[0]);
    const authorizedPerson = samityData?.authorizedPerson;
    setSamityMemberData((prevData) => ({
      ...prevData,
      personAsAMember: {
        ...prevData.personAsAMember,
        authorizedPersonName: authorizedPerson?.authorizedpersonname,
        authorizedPersonNid: authorizedPerson?.authorizedpersonnid,
        authorizedPersonmobile: authorizedPerson?.authorizedpersonmobile,
      },
    }));
    let memberAreaData = [],
      workingAreaData = [];
    samityData?.MemberArea?.map((row) => {
      return memberAreaData.push({
        detailsAddress: row.detailsAddress,
        districtId: row.districtId,
        divisionId: row.divisionId,
        id: row.id,
        status: row.status,
        uniThanaPawId: row.uniThanaPawId,
        uniThanaPawType: row.uniThanaPawType,
        upaCityId: row.upaCityId,
        upaCityType: row.upaCityType,
      });
    });

    samityData?.WorkingArea?.map((row) => {
      return workingAreaData.push({
        detailsAddress: row.detailsAddress,
        districtId: row.districtId,
        divisionId: row.divisionId,
        id: row.id,
        status: row.status,
        uniThanaPawId: row.uniThanaPawId,
        uniThanaPawType: row.uniThanaPawType,
        upaCityId: row.upaCityId,
        upaCityType: row.upaCityType,
      });
    });
    if (samityData?.Samity[0]?.enterprisingId) {
      getProject(samityData?.Samity[0]?.enterprisingId);
    }
    setCheckedArea(samityData?.Samity[0]?.isMemberAreaAndWorkingAreaSame);
    setMemberSelectArea(memberAreaData);
    setWorkingArea(workingAreaData);
    const getDocument = samityData?.SamityDocument;
    let documentDataList = [];
    getDocument?.map((row) => {
      return documentDataList.push({
        id: row.id,
        documentType: row.document_id,
        documentNumber: row.document_no,
        documentPictureFront: row.document_nameUrl,
        documentPictureFrontName: row.document_name,
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        documentPictureBack: '',
        documentPictureBackName: '',
        documentPictureBackType: '',
        documentPictureBackFile: '',
        addDoc: false,
      });
    });
    setDocumentList(documentDataList);
  };

  const getData = async () => {
    try {
      // for samity Type
      setSamityType(await FetchWrapper.get(SamityType));
      // for enterprisingData
      setEnterprisingOrg(await FetchWrapper.get(enterprising));
      // project data
    } catch (error) {
      errorHandler(error);
    }
  };

  const getProject = async (id) => {
    if (id) {
      try {
        setProjects(await FetchWrapper.get(projectList + `project?isPagination=false&enterprising_id=${id}`));
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'enterprisingId':
        setCoop({ ...coop, [name]: value });
        getProject(value);
        break;
      default:
        setCoop({ ...coop, [name]: value });
        break;
    }
  };

  const handleDateChage = (date, type) => {
    setCoop({ ...coop, [type]: date });
  };
  //**************** */ workding area, member area all function ******************
  const handleChangeMemberArea = async (e, index) => {
    const { name, value } = e.target;
    const list = [...memberSelectArea];
    let upaData, unionData;
    switch (name) {
      case 'divisionId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['divisionIdError'] = list[index][name] == '' ? 'বিভাগ নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'districtId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['districtIdError'] = list[index][name] == '' ? 'জেলা নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'samityUpaCityIdType':
        upaData = JSON.parse(e.target.value);
        list[index]['upaCityId'] = upaData.upaCityId ? upaData.upaCityId : '';
        list[index]['upaCityType'] = upaData.upaCityType ? upaData.upaCityType : '';
        list[index]['upaCityIdError'] = list[index]['upaCityId'] == '' ? 'উপজেলা/সিটি  নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'samityUniThanaPawIdType':
        unionData = JSON.parse(e.target.value);
        list[index]['uniThanaPawId'] = unionData.uniThanaPawId ? unionData.uniThanaPawId : '';
        list[index]['uniThanaPawType'] = unionData.uniThanaPawType ? unionData.uniThanaPawType : '';
        list[index]['uniThanaPawIdError'] =
          list[index]['uniThanaPawId'] == '' && coop.memberAreaType >= 4 ? 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'detailsAddress':
        list[index][name] = value;
        list[index]['detailsAddressError'] =
          list[index]['detailsAddress'] == '' && coop.memberAreaType == 5 ? 'ঠিকানা লিখুন' : '';
        setMemberSelectArea(list);
        break;
    }
  };
  const handleAddClicksetMemberSelectArea = () => {
    setMemberSelectArea([
      ...memberSelectArea,
      coop.memberAreaType == 1
        ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            status: 'A',
          }
        : coop.memberAreaType == 2
        ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
            status: 'A',
          }
        : coop.memberAreaType == 3
        ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
            upaCityId: coop?.samityUpaCityId ? coop?.samityUpaCityId : '',
            upaCityType: coop?.samityUpaCityType ? coop?.samityUpaCityType : '',
            status: 'A',
          }
        : coop.memberAreaType == 4
        ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
            upaCityId: coop?.samityUpaCityId ? coop?.samityUpaCityId : '',
            upaCityType: coop?.samityUpaCityType ? coop?.samityUpaCityType : '',
            uniThanaPawId: '',
            uniThanaPawType: '',
            status: 'A',
          }
        : coop.memberAreaType == 5
        ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
            upaCityId: coop?.samityUpaCityId ? coop?.samityUpaCityId : '',
            upaCityType: coop?.samityUpaCityType ? coop?.samityUpaCityType : '',
            uniThanaPawId: '',
            uniThanaPawType: '',
            detailsAddress: '',
            status: 'A',
          }
        : '',
    ]);
  };
  const handleRemoveMemberArea = async (id, index) => {
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
            axios.delete(MemberAreaInsert + '/' + id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
              }
            });
          }
        });
      } catch (error) {
        errorHandler(error);
      }
    } else {
      let list = [...memberSelectArea];
      list.splice(index, 1);
      setMemberSelectArea(list);
    }
  };
  const handleChangeMemberAndWorkingArea = (e) => {
    const { name, value } = e.target;
    if (value === '0') {
      return;
    }
    switch (name) {
      case 'memberAreaType':
        setCoop({ ...coop, memberAreaType: value });
        if (parseInt(value) === 4) {
          setFormErrors({ ...formErrors, memDetail: '' });
        }
        break;

      case 'workingAreaType':
        setCoop({ ...coop, workingAreaType: parseInt(value) });
        if (parseInt(value) === 4) {
          setFormErrors({ ...formErrors, workDetail: '' });
        }
        break;

      case 'onChecked':
        setCheckedArea(e.target.checked);
        break;

      default:
        setCoop({ ...coop, [name]: value });
    }
  };
  const handleAddClicksetWorkingArea = () => {
    setWorkingArea([
      ...workingArea,
      coop.workingAreaType == 1
        ? {
            divisionId: coop?.samityDivisionId ? coop?.samityDivisionId : '',
            status: 'A',
          }
        : coop.workingAreaType == 2
        ? {
            divisionId: coop?.samityDivisionId ? coop?.samityDivisionId : '',
            districtId: coop?.samityDistrictId ? coop?.samityDistrictId : '',
            status: 'A',
          }
        : coop.workingAreaType == 3
        ? {
            divisionId: coop?.samityDivisionId ? coop?.samityDivisionId : '',
            districtId: coop?.samityDistrictId ? coop?.samityDistrictId : '',
            upaCityId: coop?.samityUpaCityId ? coop?.samityUpaCityId : '',
            upaCityType: coop?.samityUpaCityType ? coop?.samityUpaCityType : '',
            status: 'A',
          }
        : coop.workingAreaType == 4
        ? {
            divisionId: coop?.samityDivisionId ? coop?.samityDivisionId : '',
            districtId: coop?.samityDistrictId ? coop?.samityDistrictId : '',
            upaCityId: coop?.samityUpaCityId ? coop?.samityUpaCityId : '',
            upaCityType: coop?.samityUpaCityType ? coop?.samityUpaCityType : '',
            uniThanaPawId: '',
            uniThanaPawType: '',
            status: 'A',
          }
        : coop.workingAreaType == 5
        ? {
            divisionId: coop?.samityDivisionId ? coop?.samityDivisionId : '',
            districtId: coop?.samityDistrictId ? coop?.samityDistrictId : '',
            upaCityId: coop?.samityUpaCityId ? coop?.samityUpaCityId : '',
            upaCityType: coop?.samityUpaCityType ? coop?.samityUpaCityType : '',
            uniThanaPawId: '',
            uniThanaPawType: '',
            detailsAddress: '',
            status: 'A',
          }
        : '',
    ]);
  };
  const handleChangeWorkingArea = async (e, index) => {
    const { name, value } = e.target;
    const list = [...workingArea];
    let upaData, unionData;
    switch (name) {
      case 'divisionId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['divisionIdError'] = list[index][name] == '' ? 'বিভাগ নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'districtId':
        list[index][name] = value === '0' ? '' : value;
        list[index]['districtIdError'] = list[index][name] == '' ? 'জেলা নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'samityUpaCityIdType':
        upaData = JSON.parse(e.target.value);
        list[index]['upaCityId'] = upaData.upaCityId ? upaData.upaCityId : '';
        list[index]['upaCityType'] = upaData.upaCityType ? upaData.upaCityType : '';
        list[index]['upaCityIdError'] = list[index]['upaCityId'] == '' ? 'উপজেলা/সিটি  নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'samityUniThanaPawIdType':
        unionData = JSON.parse(e.target.value);
        list[index]['uniThanaPawId'] = unionData.uniThanaPawId ? unionData.uniThanaPawId : '';
        list[index]['uniThanaPawType'] = unionData.uniThanaPawType ? unionData.uniThanaPawType : '';
        list[index]['uniThanaPawIdError'] =
          list[index]['uniThanaPawId'] == '' && coop.workingAreaType >= 4 ? 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন' : '';
        setWorkingArea(list);
        break;
      case 'detailsAddress':
        list[index][name] = value;
        list[index]['detailsAddressError'] =
          list[index]['detailsAddress'] == '' && coop.workingAreaType == 5 ? 'ঠিকানা লিখুন' : '';
        setWorkingArea(list);
        break;
    }
  };
  let handleRemoveWorkingArea = async (index) => {
    if (workingAreaData[index]) {
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
            axios.delete(WorkingAreaInsert + '/' + workingAreaData[index].id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
              }
            });
          }
        });
      } catch (error) {
        errorHandler(error);
      }
    } else {
      let list = [...workingArea];
      list.splice(index, 1);
      setWorkingArea(list);
    }
  };
  // ****************************** submit part start ******************************
  let checkMandatoryForPostAndUpdate = () => {
    let flag = true;
    let newObj = {};
    // var a = moment(regDate);
    if (coop.samityLevel === '') {
      flag = false;
      newObj.samityLevel = 'সমিতির ধরণ নির্বাচন করুন';
    }
    if (coop.samityName == '') {
      flag = false;
      newObj.samityName = 'সমিতির নাম প্রদান করুন';
    }
    if (coop.samityCode == '') {
      flag = false;
      newObj.samityCode = 'সমিতির মূল নিবন্ধন নাম্বার প্রদান করুন';
    }
    if (coop.samityRegistrationDate === null) {
      flag = false;
      newObj.regDate = 'সমিতি নিবন্ধন তারিখ প্রদান করুন';
    }

    if (coop.samityTypeId === '0' || coop.samityTypeId == '' || coop.samityTypeId == 'নির্বাচন করুন') {
      flag = false;
      newObj.samityTypeId = 'সমিতির ধরণ নির্বাচন করুন';
    }
    if (coop.enterprisingOrg == '' || coop.enterprisingOrg === '0' || coop.samityTypeId == 'নির্বাচন করুন') {
      flag = false;
      newObj.enterprisingOrg = 'উদ্যোগী সংস্থা নির্বাচন করুন';
    }
    if (coop.samityEffectiveness === '') {
      flag = false;
      newObj.samityEffectiveness = 'সমিতির স্টেটাস নির্বাচন করুন';
    }
    if (coop.samityDivisionId == 0 || coop.samityDivisionId == '' || coop.samityDivisionId == 'নির্বাচন করুন') {
      flag = false;
      newObj.divisionId = 'বিভাগ সিলেক্ট করুন';
    }
    if (coop.samityDistrictId == 0 || coop.samityDistrictId == '' || coop.samityDistrictId == 'নির্বাচন করুন') {
      flag = false;
      newObj.districtId = 'জেলা সিলেক্ট করুন';
    }
    if (coop.samityUpaCityId == 0 || coop.samityUpaCityId == '' || coop.samityUpaCityId == 'নির্বাচন করুন') {
      flag = false;
      newObj.upacityIdType = 'উপজেলা/সিটি কর্পোরেশন সিলেক্ট করুন';
    }

    if (
      coop.samityUniThanaPawId == 0 ||
      coop.samityUniThanaPawId == '' ||
      coop.samityUniThanaPawId == 'নির্বাচন করুন'
    ) {
      flag = false;
      newObj.uniThanaPawIdType = 'ইউনিয়ন/পৌরসভা/থানা নির্বাচন করুন';
    }
    if (coop.villageArea == '') {
      flag = false;
      newObj.villageArea = 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন';
    }

    documentList.map((x) => {
      if (x.documentType === '' || x.documentType === 'নির্বাচন করুন') {
        flag = false;
        newObj.documentType = 'ডকুমেন্ট এর ধরন উল্লেখ করুন';
      }
    });

    // if (coop.samityLevel == 'P' && coop.samityEffectiveness == 'A') {
    //   if (!commInfo.authorizedPersonName) {
    //     flag = false;
    //     newObj.authorizedPersonName = 'অথরাইজড পারসনের নাম উল্লেখ করুন';
    //   }
    //   if (
    //     !commInfo.authorizedPersonNid ||
    //     (commInfo.authorizedPersonNid.length !== 10 && commInfo.authorizedPersonNid.length !== 17)
    //   ) {
    //     flag = false;
    //     newObj.authorizedPersonNid = !commInfo.authorizedPersonNid
    //       ? 'অথরাইজড পারসনের জাতীয় পরিচয়পত্র নাম্বার উল্লেখ করুন'
    //       : 'জাতীয় পরিচয়পত্র নাম্বার ১০ অথবা ১৩ ডিজিট হলে সামনে জন্মসাল দিয়ে ১৭ ডিজিট অবশ্যই হতে হবে';
    //   }
    // } else if (coop.samityLevel == 'C' && coop.samityEffectiveness == 'A') {
    //   if (!cenNatMemberData.nid || (cenNatMemberData.nid.length !== 10 && cenNatMemberData.nid.length !== 17)) {
    //     flag = false;
    //     newObj.nid = !cenNatMemberData.nid
    //       ? 'অথরাইজড পারসনের জাতীয় পরিচয়পত্র নাম্বার উল্লেখ করুন'
    //       : 'জাতীয় পরিচয়পত্র নাম্বার ১০ অথবা ১৩ ডিজিট হলে সামনে জন্মসাল দিয়ে ১৭ ডিজিট অবশ্যই হতে হবে';
    //   }
    //   const mobileRegex = RegExp(/(^(01){1}[3456789]{1}(\d){8})$/);
    //   if (!cenNatMemberData.mobile || !mobileRegex.test(cenNatMemberData.mobile)) {
    //     flag = false;
    //     newObj.mobile = !cenNatMemberData.mobile ? 'মোবাইল নাম্বার উল্লেখ করুন' : 'আপনার সঠিক মোবাইল নং প্রদান করুন';
    //   }
    // }

    // if (update) {
    //   if (!desgId) {
    //     flag = false;
    //     newObj.designationId = 'কর্মকর্তা ও পদবী উল্লেখ করুন';
    //   }
    // }

    for (const element of documentList) {
      if (!element['documentType']) {
        flag = false;
        newObj.documentType = 'ডকুমেন্ট এর ধরণ নির্বাচন করুন';
      }

      if (!element['documentPictureFront']) {
        flag = false;
        newObj.documentPictureFront = 'ডকুমেন্ট এর ছবি দিন ';
      }
    }

    // const firstArray = [...documentType];

    const secondArray = [...documentList];
    const s2 = secondArray
      .map((elm) => {
        if (elm.documentType === 18) {
          return elm.documentType;
        }
      })
      .filter((elm) => elm !== undefined);
    if (!s2.includes(18)) {
      flag = false;
      newObj.mandatoryDocError = 'সমিতির সার্টিফিকেট সংযুক্ত করুন';
      NotificationManager.error('ডকুমেন্ট অংশে সার্টিফিকেট সংযুক্ত করুন');
    }

    if (!officeId && !update) {
      newObj.officeError = 'দপ্তর/অফিস নির্বাচন করুন';
      flag = false;
    }

    if (!originUnitId && !update) {
      flag = false;
      newObj.originUnitError = 'অফিসের ধরণ নির্বাচন করুন';
    }
    if (!desgId && !update) {
      newObj.designationError = 'কর্মকর্তা ও পদবি নির্বাচন করুন';
      flag = false;
    }

    setTimeout(() => {
      setFormErrors(newObj);
    }, 1);

    return flag;
  };
  const areaValidation = (data, type, addressType) => {
    let isDataObjValid = false;
    if (addressType == 'working' && checkedArea) {
      isDataObjValid = false;
    } else {
      for (const element of data) {
        if (type == 1) {
          // বিভাগ
          element.upaCityId = '';
          element.upaCityType = '';
          element.uniThanaPawId = '';
          element.uniThanaPawType = '';
          element.detailsAddress = '';
          element.districtIdError = '';
          element.upaCityIdError = '';
          element.uniThanaPawIdError = '';
          element.detailsAddressError = '';
          if (!element.divisionId) {
            element.divisionIdError = 'বিভাগ নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 2) {
          // জেলা
          element.uniThanaPawId = '';
          element.uniThanaPawType = '';
          element.detailsAddress = '';
          element.upaCityIdError = '';
          element.uniThanaPawIdError = '';
          element.detailsAddressError = '';

          if (!element.districtId) {
            element.districtIdError = 'জেলা নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 3) {
          // উপজেলা
          element.detailsAddress = '';
          element.uniThanaPawIdError = '';
          element.detailsAddressError = '';

          if (!element.upaCityId) {
            element.upaCityIdError = 'উপজেলা/সিটি  নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 4) {
          // ইউনিয়ন
          element.detailsAddressError = '';

          if (!element.uniThanaPawId) {
            element.uniThanaPawIdError = 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 5) {
          // ঠিকানা
          if (!element.uniThanaPawId) {
            element.uniThanaPawIdError = 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন';
            isDataObjValid = true;
          }
          if (!element.detailsAddress) {
            element.detailsAddressError = 'ঠিকানা লিখুন';
            isDataObjValid = true;
          }
        }
      }
    }
    return isDataObjValid;
  };
  // document part start
  const getDocTypeNameBangla = (docId) => {
    if (parseInt(docId) === 18) {
      return 'সমিতির সার্টিফিকেট';
    }
    if (parseInt(docId) === 19) {
      return 'তথ্য স্লিপ';
    }
    if (parseInt(docId) === 29) {
      return 'সমিতির প্রত্যয়ন পত্র';
    }
    if (parseInt(docId) === 30) {
      return 'উপ আইন';
    }
    if (parseInt(docId) === 35) {
      return 'নিয়োগকৃত কমিটি';
    }
  };
  const buildDocumentPayload = (documentList) => {
    let docList = [];
    documentList.map((docInfo) => {
      docInfo.documentPictureFrontFile.split;
      docList.push({
        id: docInfo.id,
        documentId: parseInt(docInfo.documentType),
        documentNo: docInfo.documentNumber ? docInfo.documentNumber.toString() : coop.samityCode,
        documentNameBangla: getDocTypeNameBangla(docInfo.documentType),
        documentName: [
          {
            name: docInfo.documentPictureFrontFile.name
              ? docInfo.documentPictureFrontFile.name
              : docInfo.documentPictureFrontName,
            mimeType: docInfo.documentPictureFrontType,
            isUpdate: docInfo?.documentPictureFrontType && docInfo.id ? true : false,
            base64Image: docInfo.documentPictureFront,
          },
        ],
      });
    });
    return docList;
  };
  // document part end
  let onSubmitData = async (e) => {
    e.preventDefault();
    let mandatory = checkMandatoryForPostAndUpdate();
    if (
      mandatory &&
      areaValidation(memberSelectArea, coop.memberAreaType, 'member') == false &&
      areaValidation(workingArea, coop.workingAreaType, 'working') == false
    ) {
      let RegistrationData;
      for (const [index, element] of memberSelectArea.entries()) {
        memberSelectArea[index] = {
          ...(element.id && { id: element.id }),
          ...(element.divisionId && { divisionId: parseInt(element.divisionId) }),
          ...(element.districtId && { districtId: parseInt(element.districtId) }),
          ...(element.upaCityId && { upaCityId: parseInt(element.upaCityId) }),
          ...(element.upaCityType && { upaCityType: element.upaCityType }),
          ...(element.uniThanaPawId && { uniThanaPawId: parseInt(element.uniThanaPawId) }),
          ...(element.uniThanaPawType && { uniThanaPawType: element.uniThanaPawType }),
          ...(element.detailsAddress && { detailsAddress: element.detailsAddress }),
          status: 'A',
        };
      }
      for (const [index, element] of workingArea.entries()) {
        workingArea[index] = {
          ...(element.id && { id: element.id }),
          ...(element.divisionId && { divisionId: parseInt(element.divisionId) }),
          ...(element.districtId && { districtId: parseInt(element.districtId) }),
          ...(element.upaCityId && { upaCityId: parseInt(element.upaCityId) }),
          ...(element.upaCityType && { upaCityType: element.upaCityType }),
          ...(element.uniThanaPawId && { uniThanaPawId: parseInt(element.uniThanaPawId) }),
          ...(element.uniThanaPawType && { uniThanaPawType: element.uniThanaPawType }),
          ...(element.detailsAddress && {
            detailsAddress: element.detailsAddress,
          }),
          status: 'A',
        };
      }
      let docList = new Array();
      documentList.map((docInfo) => {
        docInfo.documentPictureFrontFile.split;
        docList.push({
          id: docInfo.id,
          documentId: docInfo.documentType,
          documentNo: docInfo.documentNumber,
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
      setLoadingDataSaveUpdate(true);
      let payload = {
        serviceName: 'samity_migration_correction',
        nextAppDesignationId: update ? nextAppDesignationId : desgId,
        samityId,
        data: {
          samityInfo: {
            ...coop,
            workingAreaType: checkedArea ? coop.memberAreaType : coop.workingAreaType,
            isMemberAreaAndWorkingAreaSame: checkedArea,
          },
          memberInfo:
            coop.samityLevel == 'P'
              ? {
                  memberNameBangla: samityMemberData.personAsAMember.authorizedPersonName,
                  nid: bangToEng(samityMemberData.personAsAMember.authorizedPersonNid),
                  mobile: bangToEng(samityMemberData.personAsAMember.authorizedPersonmobile),
                  isAuthorizer: true,
                }
              : {
                  id: samityMemberData.samityAsAMember.id,
                  nid: bangToEng(
                    samityMemberData.samityAsAMember.nid
                      ? samityMemberData.samityAsAMember.nid
                      : samityMemberData.samityAsAMember.brn,
                  ),
                  mobile: bangToEng(samityMemberData.samityAsAMember.mobile),
                  isAuthorizer: true,
                  refSamityId: samityMemberData.samityAsAMember.samityId,
                  memberNameBangla: samityMemberData.samityAsAMember.memberNameBangla,
                },
          memberArea: memberSelectArea,
          workingArea: checkedArea ? memberSelectArea : workingArea,
          documentInfo: buildDocumentPayload(documentList),
          approvalInfo: {
            officeOriginUnitId: originUnitId,
            branchId: officeId,
            ownOrOthers: ownOther,
          },
        },
      };

      if (coop.samityLevel == 'N' || coop.samityEffectiveness !== 'A') {
        delete payload.data.memberInfo;
      }
      try {
        let migrationData;
        if (update) {
          migrationData = await axios.put(SamityMigrationCorrection + '/' + updateById, payload, config);
        } else {
          RegistrationData = await axios.post(SamityMigrationCorrection, payload, config);
        }

        NotificationManager.success(update ? migrationData.data.message : RegistrationData.data.message, '', 5000);
        // clearState();
        setLoadingDataSaveUpdate(false);
        getSamityInfo(samityId);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      NotificationManager.warning('বাধ্যতামূলক তথ্য পূরণ করুন', '', 5000);
    }
  };

  //**************** */ workding area, member area all function /* *****************
  return (
    <Fragment>
      <CoopInfo {...{ handleChange, handleDateChage, coop, formErrors, samityType, enterprisingOrg, projects }} />
      <OfficeAddress
        {...{
          coop,
          setCoop,
          formErrors,
        }}
      />
      <AreaSelection
        {...{
          memberSelectArea,
          workingArea,
          coop,
          setCoop,
          checkedArea,
          handleChangeMemberArea,
          handleAddClicksetMemberSelectArea,
          handleRemoveMemberArea,
          handleChangeMemberAndWorkingArea,
          handleAddClicksetWorkingArea,
          handleChangeWorkingArea,
          handleRemoveWorkingArea,
        }}
      />
      <SamityMemberInfo {...{ samityMemberData, setSamityMemberData, formErrors }} />
      <Documents {...{ documentList, setDocumentList, formErrors }} />

      {!nextAppDesignationId && (
        <>
          <SubHeading>পর্যবেক্ষক বা অনুমোদনকারী</SubHeading>
          <RefactoredToOfficeSelectItem formErrors={formErrors} />
        </>
      )}
      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
            {update ? 'হালনাগাদ হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
          </LoadingButton>
        ) : (
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
          </Button>
        )}
      </Grid>
    </Fragment>
  );
};

export default ManualSamityCorrection;
