/* eslint-disable no-useless-escape */
import AddIcon from '@mui/icons-material/Add';
import Clear from '@mui/icons-material/Clear';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Checkbox, FormControlLabel, Grid, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { default as SubHeading } from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import GetGeoData from 'components/utils/coop/GetGeoData';
import { FetchWrapper } from 'helpers/fetch-wrapper';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { formValidator } from 'service/formValidator';
import { bangToEng, engToBang } from 'service/numberConverter';
import Swal from 'sweetalert2';
import {
  CoopRegApi,
  MemberAreaInsert,
  NameclearanceCitizen,
  SamityType,
  WorkingAreaInsert,
  enterprisingApi,
  projectList,
} from '../../../../../url/coop/ApiList';

import PendingCoop from './PendingCoop';

const emailRegex = RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
const websiteRegex = RegExp(
  /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
);
const area = [
  {
    value: 1,
    label: 'বিভাগ',
  },
  {
    value: 2,
    label: 'জেলা',
  },
  {
    value: 3,
    label: 'উপজেলা/সিটি-কর্পোরেশন',
  },
  {
    value: 4,
    label: 'ইউনিয়ন/পৌরসভা/থানা',
  },

  {
    value: 5,
    label: 'গ্রাম/মহল্লা',
  },
];

const CoopReg = (props) => {
  const router = useRouter();
  const userData = tokenData();
  const config = localStorageData('config');
  const getId = localStorageData('getSamityId');
  ///////////////////////////////////////////////////////////////////////////
  const [samityNameInfo, setSamityNameInfo] = useState([]);
  const [upaDefault, setUpaDefault] = useState();
  // const [workingUpaDefault, setWorkingUpaDefault] = useState();
  // const [memberUpaDefault, setMemberUpaDefault] = useState();
  const [unionDefault, setUnionDefault] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [checkedArea, setCheckedArea] = useState(false);
  const [enterPrising, setEnterPrising] = useState([]);
  const [projects, setProjects] = useState([]);
  const [samityType, setSamityType] = useState([]);
  const [coop, setCoop] = useState({
    samityName: '', //use
    samityLevel: '', //use
    officeId: '', //use
    samityDivisionId: '', //use
    samityDistrictId: '', //use
    samityUpaCityId: '', //use
    samityUpaCityType: '', //use
    samityUniThanaPawId: '', //use
    samityUniThanaPawType: '', //use
    samityDetailsAddress: '', //use
    enterprisingId: '', //use
    samityTypeId: '', //use
    purpose: 'Office',
    noOfShare: '', //use
    sharePrice: '', //use
    proposedShareCapital: '', //use
    soldShare: '', //use
    soldShareCapital: '', //use
    phone: '', //use
    mobile: '', //use
    email: '', //use
    website: '', //use
    memberAreaType: 5, //use
    workingAreaType: 5, //use
    projectId: '', //use
    doptorId: 12,
    certificateGetBy: 'string',
    samityFormationDate: '', //use
    oldRegistrationNo: ' string',
    samityRegistrationDate: new Date(),
    accountType: 'savings',
    accountNo: 12987654,
    accountTitle: 'Somobai',
    memberAdmissionFee: '', //use
    applicationId: '', //use
  });

  const [selectDefatultSamity, setSelectDefatultSamity] = useState({
    samityDivisionId: false,
    samityDistrictId: false,
    samityUpaCityIdType: false,
  });
  const [formErrors, setFormErrors] = useState({
    samityName: '',
    email: '',
    mobile: '',
    soldShare: '',
    noOfShare: '',
    sharePrice: '',
    website: '',
    samityDivisionId: '',
    samityDistrictId: '',
    samityUpaCityId: '',
    samityUniThanaPawId: '',
    samityDetailsAddress: '',
    memberAdmissionFee: '',
    samityFormationDate: '',
    enterprisingId: '',
  });
  // area section
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
  const handleAddClicksetMemberSelectArea = () => {
    setMemberSelectArea([
      ...memberSelectArea,
      coop.memberAreaType == 1
        ? {
          divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
          divisionIdError: '',
          status: 'A',
        }
        : coop.memberAreaType == 2
          ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            divisionIdError: '',
            districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
            districtIdError: '',
            status: 'A',
          }
          : coop.memberAreaType == 3
            ? {
              divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
              divisionIdError: '',
              districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
              districtIdError: '',
              upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
              upaCityIdError: '',
              upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
              status: 'A',
            }
            : coop.memberAreaType == 4
              ? {
                divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
                divisionIdError: '',
                districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
                districtIdError: '',
                upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
                upaCityIdError: '',
                upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
                uniThanaPawId: '',
                uniThanaPawIdError: '',
                uniThanaPawType: '',
                status: 'A',
              }
              : coop.memberAreaType == 5
                ? {
                  divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
                  divisionIdError: '',
                  districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
                  districtIdError: '',
                  upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
                  upaCityIdError: '',
                  upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
                  uniThanaPawId: '',
                  uniThanaPawIdError: '',
                  uniThanaPawType: '',
                  detailsAddress: '',
                  status: 'A',
                }
                : '',
    ]);
  };
  const handleChangeMemberArea = async (e, index) => {
    const { name, value } = e.target;
    const list = [...memberSelectArea];
    let upaData, unionData;
    switch (name) {
      case 'divisionId':
        list[index][name] = value == '0' ? '' : value;
        list[index]['divisionIdError'] = list[index][name] == '' ? 'বিভাগ নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'districtId':
        list[index][name] = value == '0' ? '' : value;
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
                getEditSamity();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                getEditSamity();
              }
            });
          }
        });
        getEditSamity();
      } catch (error) {
        errorHandler(error);
      }
    } else {
      let list = [...memberSelectArea];
      list.splice(index, 1);
      setMemberSelectArea(list);
    }
  };
  const handleRemoveWorkingArea = async (id, index) => {
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
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const deleteResult = await axios.delete(WorkingAreaInsert + '/' + id, config);
              if (deleteResult.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                getEditSamity();
              }
            } catch (error) {
              const message = error.response.data.errors[0].message;
              Swal.fire(' অকার্যকর হয়েছে!', message, 'error');
              getEditSamity();
            }
          }
        });
        getEditSamity();
      } catch (error) {
        errorHandler(error);
      }
    } else {
      let list = [...workingArea];
      list.splice(index, 1);
      setWorkingArea(list);
    }
  };
  const handleAddClicksetWorkingArea = () => {
    setWorkingArea([
      ...workingArea,
      coop.workingAreaType == 1
        ? {
          divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
          divisionIdError: '',
          status: 'A',
        }
        : coop.workingAreaType == 2
          ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            divisionIdError: '',
            districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
            districtIdError: '',
            status: 'A',
          }
          : coop.workingAreaType == 3
            ? {
              divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
              divisionIdError: '',
              districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
              districtIdError: '',
              upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
              upaCityIdError: '',
              upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
              status: 'A',
            }
            : coop.workingAreaType == 4
              ? {
                divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
                divisionIdError: '',
                districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
                districtIdError: '',
                upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
                upaCityIdError: '',
                upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
                uniThanaPawId: '',
                uniThanaPawIdError: '',
                uniThanaPawType: '',
                status: 'A',
              }
              : coop.workingAreaType == 5
                ? {
                  divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
                  divisionIdError: '',
                  districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
                  districtIdError: '',
                  upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
                  upaCityIdError: '',
                  upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
                  uniThanaPawId: '',
                  uniThanaPawIdError: '',
                  uniThanaPawType: '',
                  detailsAddress: '',
                  detailsAddressError: '',
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

  useEffect(() => {
    getData();
    getEditSamity();
  }, []);
  ////////////////////////////// Get Arrey Section //////////////////////////
  const getData = async () => {
    const enterPrisingData = await FetchWrapper.get(enterprisingApi);
    setEnterPrising(enterPrisingData);
  };

  const getSamityType = async () => {
    const SamityTypeData = await FetchWrapper.get(SamityType);
    setSamityType(SamityTypeData);
  };

  const samityInfo = async (samityLevel) => {
    const samityInfoData = await FetchWrapper.get(NameclearanceCitizen + samityLevel);
    setSamityNameInfo(samityInfoData);
  };

  const getProject = async (enterpriseId) => {
    const projectData = await FetchWrapper.get(
      projectList + 'project?isPagination=false&enterprising_id=' + enterpriseId,
    );
    setProjects(projectData);
  };

  ///////////////////////////handle change function section///////////////////////////////////
  const handleChange = (e) => {
    const { name, value } = e.target;
    let resultObj, soldShareBang, sharePriceBang;
    switch (name) {
      case 'samityName':
        if (value != '0') {
          let data = JSON.parse(e.target.value);
          setCoop({
            ...coop,
            samityName: data.samityName,
            samityDivisionId: data.divisionId,
            samityDistrictId: data.districtId,
            samityUpaCityId: data.upazilaId,
            samityUpaCityType: data.upaCityType,
            samityTypeId: data.samityTypeId,
            officeId: data.officeId,
            applicationId: data.applicationId,
          });
          setUpaDefault(
            JSON.stringify({
              upaCityId: data.upazilaId,
              upaCityType: data.upaCityType,
            }),
          );
          setSelectDefatultSamity({
            samityDivisionId: true,
            samityDistrictId: true,
            samityUpaCityIdType: true,
          });
          // setMemberUpaDefault(
          //   JSON.stringify({
          //     upaCityId: data.upazilaId,
          //     upaCityType: data.upaCityType,
          //   }),
          // );
          setMemberSelectArea([
            {
              divisionId: data.divisionId,
              districtId: data.districtId,
              upaCityId: data.upazilaId,
              upaCityType: data.upaCityType,
              uniThanaPawId: '',
              uniThanaPawType: '',
              detailsAddress: '',
              status: 'A',
            },
          ]);
          // setWorkingUpaDefault(
          //   JSON.stringify({
          //     upaCityId: data.upazilaId,
          //     upaCityType: data.upaCityType,
          //   }),
          // );
          setWorkingArea([
            {
              divisionId: data.divisionId,
              districtId: data.districtId,
              upaCityId: data.upazilaId,
              upaCityType: data.upaCityType,
              uniThanaPawId: '',
              uniThanaPawType: '',
              detailsAddress: '',
              status: 'A',
            },
          ]);
          setFormErrors({
            ...formErrors,
            samityDivisionId: data.divisionId ? '' : 'বিভাগ নির্বাচন করুন',
            samityDistrictId: data.districtId ? '' : 'জেলা নির্বাচন করুন',
            samityUpaCityId: data.upazilaId ? '' : 'উপজেলা/সিটি নির্বাচন করুন',
          });
          getSamityType();
        } else {
          setCoop({
            ...coop,
            samityName: '',
            samityDivisionId: '',
            samityDistrictId: '',
            samityUpaCityId: '',
            samityUpaCityType: '',
            samityTypeId: '',
            officeId: '',
            applicationId: '',
          });
          setUpaDefault(
            JSON.stringify({
              upaCityId: '',
              upaCityType: '',
            }),
          );
          setSelectDefatultSamity({
            samityDivisionId: false,
            samityDistrictId: false,
            samityUpaCityIdType: false,
          });
          setMemberSelectArea([
            {
              divisionId: '',
              districtId: '',
              upaCityId: '',
              upaCityType: '',
              uniThanaPawId: '',
              uniThanaPawType: '',
              detailsAddress: '',
              status: '',
            },
          ]);
          // setWorkingUpaDefault(
          //   JSON.stringify({
          //     upaCityId: '',
          //     upaCityType: '',
          //   }),
          // );
          setWorkingArea([
            {
              divisionId: '',
              districtId: '',
              upaCityId: '',
              upaCityType: '',
              uniThanaPawId: '',
              uniThanaPawType: '',
              detailsAddress: '',
              status: '',
            },
          ]);
        }
        break;
      case 'samityLevel':
        samityInfo(value);
        setCoop({ ...coop, samityLevel: value });
        break;
      case 'enterprisingId':
        if (value != '0') {
          getProject(value);
          setCoop({ ...coop, enterprisingId: value });
          setFormErrors({ ...formErrors, enterprisingId: '' });
        } else {
          setCoop({ ...coop, enterprisingId: '' });
          setProjects([]);
          setFormErrors({
            ...formErrors,
            enterprisingId: value ? '' : 'উদ্দ্যেগী সংস্থার নাম নির্বাচন করুন',
          });
        }
        break;
      case 'projectId':
        if (value != '0') {
          setCoop({ ...coop, projectId: value });
          setFormErrors({ ...formErrors, projectId: '' });
        } else {
          setCoop({ ...coop, projectId: '' });
          setFormErrors({
            ...formErrors,
            projectId: value ? '' : 'প্রকল্পের নাম নির্বাচন করুন',
          });
        }
        break;
      case 'email':
        formErrors.email = emailRegex.test(value) || value.length == 0 ? '' : 'আপনার সঠিক ইমেইল প্রদান করুন';
        setCoop({ ...coop, email: value });
        break;
      case 'mobile':
        resultObj = formValidator('mobile', value);
        if (resultObj?.status) {
          return;
        }
        setCoop({
          ...coop,
          [name]: resultObj?.value,
        });
        formErrors.mobile = resultObj?.error;
        break;

      case 'phone':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setCoop({
          ...coop,
          [name]: resultObj?.value,
        });
        break;

      case 'website':
        formErrors.website = websiteRegex.test(value) || value.length == 0 ? '' : 'আপনার সঠিক ওয়েব সাইট প্রদান করুন';
        setCoop({ ...coop, website: value });
        break;

      case 'noOfShare':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setCoop({
          ...coop,
          noOfShare: resultObj?.value,
          proposedShareCapital:
            coop.sharePrice != ''
              ? engToBang(bangToEng(coop.sharePrice) * bangToEng(resultObj?.value))
              : resultObj?.value,
        });

        userData?.doptorId == 3 &&
          setFormErrors({
            ...formErrors,
            noOfShare:
              resultObj?.value == ''
                ? 'শেয়ার সংখ্যা টাইপ করুন'
                : bangToEng(resultObj?.value) < bangToEng(coop.soldShare)
                  ? 'শেয়ার সংখ্যা বিক্রিত শেয়ার সংখ্যার বড় হতে হবে'
                  : resultObj?.value == 0
                    ? 'শেয়ার সংখ্যা কখনই ০(শূন্য) এর ছোট হবে না'
                    : '',
          });
        break;

      case 'sharePrice':
        sharePriceBang;
        sharePriceBang = formValidator('number', value);
        if (sharePriceBang?.status) {
          return;
        }

        setCoop({
          ...coop,
          sharePrice: sharePriceBang?.value,
          proposedShareCapital:
            coop.noOfShare != ''
              ? engToBang(bangToEng(coop.noOfShare) * bangToEng(sharePriceBang?.value))
              : sharePriceBang?.value,
          soldShareCapital: coop.soldShare
            ? engToBang(bangToEng(coop.soldShare) * bangToEng(sharePriceBang?.value))
            : sharePriceBang?.value,
        });

        userData?.doptorId == 3 &&
          setFormErrors({
            ...formErrors,
            sharePrice:
              value == ''
                ? 'শেয়ার মূল্য টাইপ করুন'
                : bangToEng(sharePriceBang?.value) == 0
                  ? 'শেয়ার মূল্য কখনই ০(শূন্য) এর ছোট হবে না'
                  : '',
          });
        break;

      case 'soldShare':
        soldShareBang;
        soldShareBang = formValidator('number', value);
        if (soldShareBang?.status) {
          return;
        }
        setCoop({
          ...coop,
          soldShare: soldShareBang?.value,
          soldShareCapital: engToBang(bangToEng(coop.sharePrice) * bangToEng(soldShareBang?.value)),
        });
        userData?.doptorId == 3 &&
          setFormErrors({
            ...formErrors,
            soldShare:
              parseInt(bangToEng(soldShareBang?.value)) > parseInt(bangToEng(coop.noOfShare))
                ? 'বিক্রিত শেয়ার সংখ্যা শেয়ার সংখ্যার ছোট হতে হবে'
                : '',
          });
        break;

      case 'memberAdmissionFee':
        resultObj = formValidator('number', value);
        if (resultObj?.status) {
          return;
        }
        setCoop({ ...coop, memberAdmissionFee: resultObj?.value });
        setFormErrors({
          ...formErrors,
          memberAdmissionFee: value ? '' : 'ভর্তি ফী প্রদান করুন',
        });
        break;

      case 'memberAreaType':
        setCoop({ ...coop, [name]: parseInt(value) });
        areaValidation(memberSelectArea, parseInt(value), 'member');
        break;

      case 'workingAreaType':
        setCoop({ ...coop, [name]: parseInt(value) });
        checkedArea == false ? areaValidation(workingArea, parseInt(value), 'working') == false : '';
        break;

      case 'samityDetailsAddress':
        setCoop({ ...coop, samityDetailsAddress: value });
        setFormErrors({
          ...formErrors,
          samityDetailsAddress: value ? '' : 'কার্যালয়ের ঠিকানা লিখুন',
        });
        break;

      case 'onChecked':
        setCheckedArea(e.target.checked);
        break;

      default:
        setCoop({ ...coop, [name]: value });
    }
  };
  const getEditSamity = async () => {
    try {
      if (getId) {
        setLoadingData(true);
        const data = await FetchWrapper.get(CoopRegApi + '/' + getId);
        if (data) {
          setCoop({
            samityName: data.Samity[0].samityName, //use
            samityLevel: data.Samity[0].samityLevel, //use
            officeId: data.Samity[0].officeId, //use
            samityDivisionId: data.Samity[0].samityDivisionId, //use
            samityDistrictId: data.Samity[0].samityDistrictId, //use
            samityUpaCityId: data.Samity[0].samityUpaCityId, //use
            samityUpaCityType: data.Samity[0].samityUpaCityType, //use
            samityUniThanaPawId: data.Samity[0].samityUniThanaPawId, //use
            samityUniThanaPawType: data.Samity[0].samityUniThanaPawType, //use
            samityDetailsAddress: data.Samity[0].samityDetailsAddress, //use
            enterprisingId: data.Samity[0].enterprisingId, //use
            samityTypeId: data.Samity[0].samityTypeId, //use
            purpose: 'Office',
            noOfShare: engToBang(data.Samity[0].noOfShare), //use
            sharePrice: engToBang(data.Samity[0].sharePrice), //use
            proposedShareCapital: engToBang(data.Samity[0].noOfShare * data.Samity[0].sharePrice), //use
            soldShare: engToBang(data.Samity[0].soldShare), //use
            soldShareCapital: engToBang(data.Samity[0].sharePrice * data.Samity[0].soldShare), //use
            phone: engToBang(data.Samity[0].phone), //use
            mobile: engToBang(data.Samity[0].mobile), //use
            email: data.Samity[0].email, //use
            website: data.Samity[0].website, //use
            memberAreaType: data.Samity[0].memberAreaType, //use
            workingAreaType: data.Samity[0].workingAreaType, //use
            projectId: data.Samity[0].projectId, //use
            doptorId: 12,
            certificateGetBy: 'string',
            samityFormationDate: data.Samity[0].samityFormationDate, //use
            oldRegistrationNo: ' string',
            samityRegistrationDate: new Date(),
            accountType: 'savings',
            accountNo: 12987654,
            accountTitle: 'Somobai',
            memberAdmissionFee: engToBang(data.Samity[0].memberAdmissionFee), //use
            applicationId: data.Samity[0].applicationId, //use
          });
          getProject(data.Samity[0].enterprisingId);
          setUpaDefault(
            JSON.stringify({
              upaCityId: data.Samity[0].samityUpaCityId,
              upaCityType: data.Samity[0].samityUpaCityType,
            }),
          );
          setUnionDefault(
            JSON.stringify({
              uniThanaPawId: data.Samity[0].samityUniThanaPawId,
              uniThanaPawType: data.Samity[0].samityUniThanaPawType,
            }),
          );
          ///////////////////////// set member are ////////////////
          for (const [index, element] of data.MemberArea.entries()) {
            data.MemberArea[index] = _.omit(element, ['samityId', 'updatedBy', 'updatedAt', 'createdBy', 'createdAt']);

            data.MemberArea[index] = {
              id: element.id,
              divisionId: element.divisionId,
              districtId: element.districtId,
              upaCityId: element.upaCityId,
              upaCityType: element.upaCityType,
              uniThanaPawId: element.uniThanaPawId,
              uniThanaPawType: element.uniThanaPawType,
              detailsAddress: element.detailsAddress,
              status: 'A',
            };
          }
          setMemberSelectArea(data.MemberArea);
          ////////////////////////// set working area //////////////
          for (const [index, element] of data.WorkingArea.entries()) {
            data.WorkingArea[index] = _.omit(element, ['samityId', 'updatedBy', 'updatedAt', 'createdBy', 'createdAt']);
            data.WorkingArea[index] = {
              id: element.id,
              divisionId: element.divisionId,
              districtId: element.districtId,
              upaCityId: element.upaCityId,
              upaCityType: element.upaCityType,
              uniThanaPawId: element.uniThanaPawId,
              uniThanaPawType: element.uniThanaPawType,
              detailsAddress: element.detailsAddress,
              status: 'A',
            };
          }
          setWorkingArea(data.WorkingArea);
          /////////////////////////////////////////////////////////
          setUpdate(true);
          ////////////////////////// set default value ////////////
          setSelectDefatultSamity({
            samityDivisionId: true,
            samityDistrictId: true,
            samityUpaCityIdType: true,
          });
          getSamityType();
          setLoadingData(false);
        } else {
          setLoadingData(false);
          NotificationManager.warning('কোন সমিতি পাওয়া যায়নি, নেম ক্লিয়ারেন্স করে আসুন।', '', 5000);
          router.push('/coop/samity-management/name-clearance');
          localStorage.setItem('stepId', JSON.stringify(0));
          localStorage.removeItem('storeId');
          localStorage.removeItem('activePage');
          localStorage.removeItem('storeName');
          localStorage.removeItem('samityLevel');
        }
      }
    } catch (error) {
      setLoadingData(false);
      errorHandler(error);
    }
  };

  //////////////////////////// check before form submit ////////////////////
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
          element.divisionId = coop.samityDivisionId;
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
          element.divisionId = coop.samityDivisionId;
          element.districtId = coop.samityDistrictId;
          element.detailsAddress = '';
          element.uniThanaPawIdError = '';
          element.detailsAddressError = '';

          if (!element.upaCityId) {
            element.upaCityIdError = 'উপজেলা/সিটি  নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 4) {
          // ইউনিয়ন
          element.divisionId = coop.samityDivisionId;
          element.districtId = coop.samityDistrictId;
          element.upaCityId = coop.samityUpaCityId;
          element.upaCityType = coop.samityUpaCityType;
          element.detailsAddressError = '';

          if (!element.uniThanaPawId) {
            element.uniThanaPawIdError = 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন';
            isDataObjValid = true;
          }
        } else if (type == 5) {
          // ঠিকানা
          element.divisionId = coop.samityDivisionId;
          element.districtId = coop.samityDistrictId;
          element.upaCityId = coop.samityUpaCityId;
          element.upaCityIdType = coop.samityUpaCityType;
          element.uniThanaPawId = coop.samityUniThanaPawId;
          element.uniThanaPawType = coop.samityUniThanaPawType;

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

  let checkFormError = () => {
    let flag = true;
    for (const key in formErrors) {
      if (formErrors[key].length > 0) {
        flag = false;
      }
    }
    return flag;
  };

  let checkMandatory = () => {
    let flag2 = false;
    let errorObj = {
      noOfShare: coop.noOfShare,
      sharePrice: coop.sharePrice,
      soldShare: coop.soldShare,
      mobile: coop.mobile,
      samityDivisionId: coop.samityDivisionId,
      samityDistrictId: coop.samityDistrictId,
      samityUpaCityId: coop.samityUpaCityId,
      samityUniThanaPawId: coop.samityUniThanaPawId,
      samityDetailsAddress: coop.samityDetailsAddress,
      memberAdmissionFee: coop.memberAdmissionFee,
      samityFormationDate: coop.samityFormationDate,
      enterprisingId: coop.enterprisingId,
      projectId:
        projects.length > 0
          ? coop.enterprisingId
            ? coop.projectId == null || coop.projectId == ''
              ? ''
              : coop.projectId
            : 'data not found'
          : 'data not found',
      // projectId: coop.enterprisingId ? coop.projectId == null || coop.projectId == "" ? "" : coop.projectId : "data not found",
    };
    // };

    areaValidation(memberSelectArea, coop.memberAreaType, 'member');
    checkedArea == false ? areaValidation(workingArea, coop.workingAreaType, 'working') == false : '';

    for (const key in errorObj) {
      if (errorObj[key].length == 0) {
        flag2 = true;
        if (
          key == 'noOfShare' ||
          key == 'sharePrice' ||
          key == 'soldShare' ||
          key == 'mobile' ||
          key == 'samityDivisionId' ||
          key == 'samityDistrictId' ||
          key == 'samityUpaCityId' ||
          key == 'samityUniThanaPawId' ||
          key == 'samityDetailsAddress' ||
          key == 'memberAdmissionFee' ||
          key == 'samityFormationDate' ||
          key == 'enterprisingId' ||
          key == 'projectId'
        ) {
          setFormErrors({
            ...formErrors,
            noOfShare: coop.noOfShare == '' && userData?.doptorId == 3 ? 'শেয়ার সংখ্যা প্রদান করুন' : '',
            sharePrice: coop.sharePrice == '' && userData?.doptorId == 3 ? 'শেয়ার মূল্য প্রদান করুন' : '',
            soldShare: coop.soldShare == '' && userData?.doptorId == 3 ? 'বিক্রিত শেয়ার সংখ্যা প্রদান করুন' : '',
            mobile: coop.mobile == '' ? 'মোবাইল নম্বর প্রদান করুন' : '',
            samityDivisionId: coop.samityDivisionId == '' ? 'বিভাগ নির্বাচন করুন' : '',
            samityDistrictId: coop.samityDistrictId == '' ? 'জেলা নির্বাচন করুন' : '',
            samityUpaCityId: coop.samityUpaCityId == '' ? 'উপজেলা/সিটি নির্বাচন করুন' : '',
            samityUniThanaPawId: coop.samityUniThanaPawId == '' ? 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন' : '',
            samityDetailsAddress: coop.samityDetailsAddress == '' ? 'কার্যালয়ের ঠিকানা লিখুন' : '',
            memberAdmissionFee: coop.memberAdmissionFee == '' ? 'ভর্তি ফী প্রদান করুন' : '',
            samityFormationDate:
              coop.samityFormationDate == '' ||
                coop.samityFormationDate == null ||
                coop.samityFormationDate == undefined
                ? 'সমিতি গঠনের তারিখ প্রদান করুন'
                : '',
            enterprisingId: coop.enterprisingId == '' ? 'উদ্দ্যেগী সংস্থার নাম নির্বাচন করুন' : '',
            projectId:
              (coop.enterprisingId && coop.projectId == '') || coop.projectId == null
                ? 'প্রকল্পের নাম নির্বাচন করুন'
                : '',
          });
        }
      }
    }
    return flag2;
  };

  const onSubmitData = async (e) => {
    let mandatory = checkMandatory();
    if (
      mandatory == false &&
      areaValidation(memberSelectArea, coop.memberAreaType, 'member') == false &&
      areaValidation(workingArea, coop.workingAreaType, 'working') == false
    ) {
      e.preventDefault();
      setLoadingDataSaveUpdate(true);
      // if(update){
      // new update member area

      for (const [index, element] of memberSelectArea.entries()) {
        memberSelectArea[index] = {
          ...(element.divisionId && { divisionId: element.divisionId }),
          ...(element.districtId && { districtId: element.districtId }),
          ...(element.upaCityId && { upaCityId: element.upaCityId }),
          ...(element.upaCityType && { upaCityType: element.upaCityType }),
          ...(element.uniThanaPawId && {
            uniThanaPawId: element.uniThanaPawId,
          }),
          ...(element.uniThanaPawType && {
            uniThanaPawType: element.uniThanaPawType,
          }),
          ...(element.detailsAddress && {
            detailsAddress: element.detailsAddress,
          }),
          status: 'A',
        };
      }
      // new update working area
      for (const [index, element] of workingArea.entries()) {
        workingArea[index] = {
          ...(element.divisionId && { divisionId: element.divisionId }),
          ...(element.districtId && { districtId: element.districtId }),
          ...(element.upaCityId && { upaCityId: element.upaCityId }),
          ...(element.upaCityType && { upaCityType: element.upaCityType }),
          ...(element.uniThanaPawId && {
            uniThanaPawId: element.uniThanaPawId,
          }),
          ...(element.uniThanaPawType && {
            uniThanaPawType: element.uniThanaPawType,
          }),
          ...(element.detailsAddress && {
            detailsAddress: element.detailsAddress,
          }),
          status: 'A',
        };
      }

      let payload = {
        samityName: coop.samityName,
        samityLevel: coop.samityLevel,
        officeId: parseInt(coop.officeId),
        samityDivisionId: parseInt(coop.samityDivisionId),
        samityDistrictId: parseInt(coop.samityDistrictId),
        samityUpaCityId: parseInt(coop.samityUpaCityId),
        samityUpaCityType: coop.samityUpaCityType,
        samityUniThanaPawId: parseInt(coop.samityUniThanaPawId),
        samityUniThanaPawType: coop.samityUniThanaPawType,
        samityDetailsAddress: coop.samityDetailsAddress,
        samityTypeId: parseInt(coop.samityTypeId),
        purpose: 'Office',
        noOfShare: bangToEng(coop.noOfShare),
        sharePrice: bangToEng(coop.sharePrice),
        soldShare: bangToEng(coop.soldShare),
        phone: bangToEng(coop.phone),
        mobile: bangToEng(coop.mobile),
        email: coop.email,
        enterprisingId: parseInt(coop.enterprisingId),
        website: coop.website,
        memberAreaType: parseInt(coop.memberAreaType),
        workingAreaType: checkedArea ? parseInt(coop.memberAreaType) : parseInt(coop.workingAreaType),
        memberArea: memberSelectArea,
        workingArea: checkedArea ? memberSelectArea : workingArea,
        projectId: parseInt(coop.projectId),
        certificateGetBy: 'string',
        samityFormationDate: dateFormat(coop.samityFormationDate),
        oldRegistrationNo: ' string',
        samityRegistrationDate: '10/11/2021',
        accountType: 'savings',
        accountNo: 12987654,
        accountTitle: 'Somobai',
        memberAdmissionFee: bangToEng(coop.memberAdmissionFee),
        ...(update ? '' : { applicationId: coop.applicationId }),
      };
      try {
        let RegistrationData;
        if (update) {
          RegistrationData = await axios.put(CoopRegApi + '/' + getId, payload, config);
          setLoadingDataSaveUpdate(false);
          getEditSamity();
        } else {
          RegistrationData = await axios.post(CoopRegApi + '/', payload, config);
          const id = RegistrationData.data.data.samity.id;
          const name = RegistrationData.data.data.samity.samityName;
          const samityLevel = RegistrationData.data.data.samity.samityLevel;
          localStorage.setItem('samityLevel', JSON.stringify(samityLevel));
          localStorage.setItem('stepId', JSON.stringify(1));
          localStorage.setItem('storeId', JSON.stringify(id));
          localStorage.setItem('storeName', JSON.stringify(name));
          setCoop({
            samityName: '', //use
            samityLevel: '', //use
            officeId: '', //use
            samityDivisionId: '', //use
            samityDistrictId: '', //use
            samityUpaCityId: '', //use
            samityUpaCityType: '', //use
            samityUniThanaPawId: '', //use
            samityUniThanaPawType: '', //use
            samityDetailsAddress: '', //use
            enterprisingId: '', //use
            samityTypeId: '', //use
            purpose: 'Office',
            noOfShare: '', //use
            sharePrice: '', //use
            proposedShareCapital: '', //use
            soldShare: '', //use
            soldShareCapital: '', //use
            phone: '', //use
            mobile: '', //use
            email: '', //use
            website: '', //use
            memberAreaType: 5, //use
            workingAreaType: 5, //use
            projectId: '', //use
            certificateGetBy: 'string',
            samityFormationDate: new Date(), //use
            oldRegistrationNo: ' string',
            samityRegistrationDate: new Date(),
            accountType: 'savings',
            accountNo: 12987654,
            accountTitle: 'Somobai',
            memberAdmissionFee: '', //use
            applicationId: '', //use
          });
          setLoadingDataSaveUpdate(false);
          router.push({ pathname: '/coop/samity-management/coop/add-by-laws' });
        }
        NotificationManager.success(RegistrationData.data.message, '', 5000);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      setLoadingDataSaveUpdate(false);
      NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুন', '', 5000);
    }
  };

  const handleChangeSamityRegDate = (regDate) => {
    setCoop({ ...coop, samityFormationDate: regDate });

    if (regDate == null || regDate == 'Invalid Date') {
      setFormErrors({
        ...formErrors,
        samityFormationDate: 'সমিতি গঠনের তারিখ প্রদান করুন',
      });
    } else {
      setFormErrors({ ...formErrors, samityFormationDate: '' });
    }
  };
  ///////////////////////////handle change offie Address section///////////////////////////////////
  const handleChangeOfficeAddress = (e) => {
    const { name, value } = e.target;
    let data, unionData;
    switch (name) {
      case 'samityUpaCityIdType':
        setUpaDefault(value);
        data = JSON.parse(value);
        setCoop({
          ...coop,
          samityUpaCityId: data.upaCityId,
          samityUpaCityType: data.upaCityType,
        });
        if (value == '0') {
          setFormErrors({
            ...formErrors,
            samityUpaCityId: 'উপজেলা/সিটি নির্বাচন করুন',
          });
        } else {
          setFormErrors({ ...formErrors, samityUpaCityId: '' });
        }
        break;
      case 'samityUniThanaPawIdType':
        setUnionDefault(value);
        unionData = JSON.parse(value);
        setCoop({
          ...coop,
          samityUniThanaPawId: unionData.uniThanaPawId,
          samityUniThanaPawType: unionData.uniThanaPawType,
        });
        if (value == '0') {
          setFormErrors({
            ...formErrors,
            samityUniThanaPawId: 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন',
          });
        } else {
          setFormErrors({ ...formErrors, samityUniThanaPawId: '' });
        }
        break;
      case 'samityDivisionId':
        setCoop({ ...coop, [name]: value });
        if (value == '0') {
          setFormErrors({ ...formErrors, [name]: 'বিভাগ নির্বাচন করুন' });
        } else {
          setFormErrors({ ...formErrors, [name]: '' });
        }
        break;
      case 'samityDistrictId':
        setCoop({ ...coop, [name]: value });
        if (value == '0') {
          setFormErrors({ ...formErrors, [name]: 'জেলা নির্বাচন করুন' });
        } else {
          setFormErrors({ ...formErrors, [name]: '' });
        }
        break;
      default:
        setCoop({ ...coop, [name]: value });
    }
  };
  const onNextPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/add-by-laws' });
  };
  return (
    <>
      <Grid container className="section">
        {/* //////////////////////// পেন্ডিং লিস্ট //////////////// */}
        {props.pageHideShow != '' && <PendingCoop pendingCoopData={props.coopNewData} />}

        <Fragment>
          {/* ///////////////////////////   সমিতির  /////////////////// */}
          <Grid item xs={12}>
            {loadingData ? (
              <Skeleton sx={{ height: '60px', width: { xs: '100%', md: '70%' } }} />
            ) : (
              <Grid container spacing={2.5} className="section">
                <FromControlJSON
                  arr={[
                    {
                      labelName: 'samityLevel',
                      name: 'samityLevel',
                      onChange: handleChange,
                      value: coop.samityLevel,
                      size: 'small',
                      type: 'text',
                      viewType: 'inputRadio',
                      inputRadioGroup: [
                        ...(userData?.doptorId == 2
                          ? [
                            {
                              value: 'P',
                              color: '#007bff',
                              rcolor: 'primary',
                              label: 'ইউনিয়ন',
                            },
                          ]
                          : []),
                        ...(userData?.doptorId == 3
                          ? [
                            {
                              value: 'P',
                              color: '#007bff',
                              rcolor: 'primary',
                              label: 'প্রাথমিক',
                            },
                            {
                              value: 'C',
                              color: '#ed6c02',
                              rColor: 'warning',
                              label: 'কেন্দ্রীয়',
                            },
                            {
                              value: 'N',
                              color: '#28a745',
                              rColor: 'success',
                              label: 'জাতীয়',
                            },
                          ]
                          : []),
                      ],
                      defaultVal: '',
                      md: 4,
                      xs: 12,
                      isDisabled: update ? true : false,
                      customClass: '',
                      customStyle: {},
                    },
                  ]}
                />
                {/* ////////////////////////// samity   */}
                <Grid item md={4} xs={12}>
                  {update == false ? (
                    <TextField
                      fullWidth
                      label={RequiredFile('সমিতির নাম')}
                      name="samityName"
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      // value={samityNameShow}
                      variant="outlined"
                      size="small"
                    >
                      <option value={'select'}>- নির্বাচন করুন -</option>
                      {samityNameInfo.map((option, i) =>
                        option.status == 'A' ? (
                          <option
                            key={i}
                            value={JSON.stringify({
                              divisionId: option.divisionId,
                              districtId: option.districtId,
                              samityTypeId: option.samityTypeId,
                              samityName: option.samityName,
                              officeId: option.officeId,
                              applicationId: option.applicationId,
                              upazilaId: option.upazilaId,
                              upaCityType: option.upaCityType,
                            })}
                          >
                            {option.samityName}
                          </option>
                        ) : (
                          ''
                        ),
                      )}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      disabled
                      label={RequiredFile('সমিতির নাম')}
                      name="samityName"
                      // onChange={handleChangeSamityName}
                      value={coop.samityName}
                      variant="outlined"
                      size="small"
                    ></TextField>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
          {/* //////////////////////////// সমিতির কার্যালয়ের ঠিকানা ////////////////////////  */}
          <Grid container className="section">
            <Grid item xs={12}>
              <SubHeading>সমিতির কার্যালয়ের ঠিকানা</SubHeading>
              {loadingData ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <Skeleton sx={{ height: '60px', flex: '1' }} />
                  <Skeleton sx={{ height: '60px', flex: '1' }} />
                  <Skeleton sx={{ height: '60px', flex: '1' }} />
                </Box>
              ) : (
                <Grid container spacing={2} paddingTop={1}>
                  <GetGeoData
                    {...{
                      labelName: RequiredFile('বিভাগ'),
                      name: 'samityDivisionId',
                      caseCadingName: 'division',
                      onChange: handleChangeOfficeAddress,
                      value: coop.samityDivisionId,
                      isCasCading: false,
                      xl: 2,
                      lg: 2,
                      md: 2,
                      xs: 12,
                      isDisabled: selectDefatultSamity.samityDivisionId,
                      customClass: '',
                      customStyle: {},
                      errorMessage: formErrors.samityDivisionId,
                    }}
                  />

                  <GetGeoData
                    {...{
                      labelName: RequiredFile('জেলা'),
                      name: 'samityDistrictId',
                      caseCadingName: 'district',
                      onChange: handleChangeOfficeAddress,
                      value: coop.samityDistrictId,
                      isCasCading: true,
                      casCadingValue: coop.samityDivisionId,
                      xl: 2,
                      lg: 2,
                      md: 2,
                      xs: 12,
                      isDisabled: selectDefatultSamity.samityDistrictId,
                      customClass: '',
                      errorMessage: formErrors.samityDistrictId,
                    }}
                  />

                  <GetGeoData
                    {...{
                      labelName: RequiredFile('উপজেলা/থানা'),
                      name: 'samityUpaCityIdType',
                      caseCadingName: 'upazila',
                      onChange: handleChangeOfficeAddress,
                      value: coop.samityDistrictId,
                      isCasCading: true,
                      casCadingValue: coop.samityDistrictId,
                      showMuiltiple: upaDefault,
                      xl: 2,
                      lg: 2,
                      md: 2,
                      xs: 12,
                      isDisabled: selectDefatultSamity.samityUpaCityIdType,
                      customClass: '',
                      errorMessage: formErrors.samityUpaCityId,
                    }}
                  />

                  <GetGeoData
                    {...{
                      labelName: RequiredFile('ইউনিয়ন'),
                      name: 'samityUniThanaPawIdType',
                      caseCadingName: 'union',
                      onChange: handleChangeOfficeAddress,
                      value: coop.samityDistrictId,
                      isCasCading: true,
                      casCadingValue: {
                        upaCityId: coop.samityUpaCityId,
                        upaCityType: coop.samityUpaCityType,
                      },
                      showMuiltiple: unionDefault,
                      casCadingValueDis: coop.samityDistrictId,
                      xl: 2,
                      lg: 2,
                      md: 2,
                      xs: 12,
                      isDisabled: false,
                      customClass: '',
                      errorMessage: formErrors.samityUniThanaPawId,
                    }}
                  />

                  <FromControlJSON
                    arr={[
                      {
                        labelName: RequiredFile('ঠিকানা'),
                        name: 'samityDetailsAddress',
                        onChange: handleChange,
                        value: coop.samityDetailsAddress,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.samityDetailsAddress,
                      },
                    ]}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          {/* //////////////////////////// সমিতির ঠিকানা ////////////////////////  */}
          <Grid container className="section">
            <Grid item xs={12}>
              <SubHeading>সদস্য নির্বাচনী এলাকা ও কর্ম এলাকা</SubHeading>
              <Grid container spacing={2.5}>
                {/* //////////////////////////////////////////  সদস্য নির্বাচনী এলাকা ///////////////////////////////////////// */}
                <Grid item xs={12}>
                  <Grid container flexDirection={'column'}>
                    <Typography
                      sx={{
                        textDecoration: 'underline',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        padding: '.5rem 3rem .5rem .5rem',
                      }}
                    >
                      সদস্য নির্বাচনী এলাকা :{' '}
                    </Typography>
                    {loadingData ? (
                      <Box>
                        <Skeleton sx={{ height: '60px', width: '300px' }} />
                      </Box>
                    ) : (
                      <FromControlJSON
                        arr={[
                          {
                            labelName: '',
                            name: 'memberAreaType',
                            onChange: handleChange,
                            value: coop.memberAreaType,
                            size: 'small',
                            type: 'text',
                            viewType: 'select',
                            optionData: area,
                            optionValue: 'value',
                            optionName: 'label',
                            xl: 4,
                            lg: 4,
                            md: 4,
                            xs: 12,
                            isDisabled: false,
                            customClass: '',
                            customStyle: { padding: '.5rem 0 0' },
                            selectDisable: true,
                          },
                        ]}
                      />
                    )}
                  </Grid>
                  {/* ///////////////////////////// Start Member area ////////////////////////////////// */}
                  {loadingData ? (
                    <Skeleton sx={{ height: '60px' }} />
                  ) : (
                    <>
                      {memberSelectArea.map((row, i) => (
                        <Grid container spacing={1.5} key={i} my={1}>
                          {coop.memberAreaType >= 1 ? (
                            <GetGeoData
                              {...{
                                labelName: RequiredFile('বিভাগ'),
                                name: 'divisionId',
                                caseCadingName: 'division',
                                onChange: (e) => handleChangeMemberArea(e, i),
                                value: row.divisionId,
                                isCasCading: true,
                                xl:
                                  coop.memberAreaType == 1
                                    ? 5
                                    : coop.memberAreaType == 2
                                      ? 3.5
                                      : coop.memberAreaType == 3
                                        ? 2.5
                                        : 2,
                                lg:
                                  coop.memberAreaType == 1
                                    ? 5
                                    : coop.memberAreaType == 2
                                      ? 3.5
                                      : coop.memberAreaType == 3
                                        ? 2.5
                                        : 2,
                                md:
                                  coop.memberAreaType == 1
                                    ? 5
                                    : coop.memberAreaType == 2
                                      ? 3.5
                                      : coop.memberAreaType == 3
                                        ? 2.5
                                        : 2,
                                xs: 12,
                                isDisabled: coop.memberAreaType == 1 ? false : true,
                                customClass: '',
                                customStyle: {},
                                errorMessage: row.divisionIdError,
                              }}
                            />
                          ) : (
                            ''
                          )}
                          {coop.memberAreaType >= 1 ? (
                            <GetGeoData
                              {...{
                                labelName: coop.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                                name: 'districtId',
                                caseCadingName: 'district',
                                onChange: (e) => handleChangeMemberArea(e, i),
                                value: row.districtId,
                                isCasCading: true,
                                casCadingValue: row.divisionId,
                                xl:
                                  coop.memberAreaType == 1
                                    ? 6
                                    : coop.memberAreaType == 2
                                      ? 3.5
                                      : coop.memberAreaType == 3
                                        ? 2.5
                                        : 2,
                                lg:
                                  coop.memberAreaType == 1
                                    ? 6
                                    : coop.memberAreaType == 2
                                      ? 3.5
                                      : coop.memberAreaType == 3
                                        ? 2.5
                                        : 2,
                                md:
                                  coop.memberAreaType == 1
                                    ? 6
                                    : coop.memberAreaType == 2
                                      ? 3.5
                                      : coop.memberAreaType == 3
                                        ? 2.5
                                        : 2,
                                xs: 12,
                                isDisabled: coop.memberAreaType == 1 || coop.memberAreaType == 2 ? false : true,
                                customClass: '',
                                errorMessage: row.districtIdError,
                              }}
                            />
                          ) : (
                            ''
                          )}
                          {coop.memberAreaType >= 2 ? (
                            <GetGeoData
                              {...{
                                labelName: coop.memberAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                                name: 'samityUpaCityIdType',
                                caseCadingName: 'upazila',
                                onChange: (e) => handleChangeMemberArea(e, i),
                                isCasCading: true,
                                casCadingValue: row.districtId,
                                showMuiltiple: JSON.stringify({
                                  upaCityId: row.upaCityId,
                                  upaCityType: row.upaCityType,
                                }),
                                xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                xs: 12,
                                isDisabled: coop.memberAreaType == 2 || coop.memberAreaType == 3 ? false : true,
                                customClass: '',
                                errorMessage: row.upaCityIdError,
                              }}
                            />
                          ) : (
                            ''
                          )}
                          {coop.memberAreaType >= 3 ? (
                            <GetGeoData
                              {...{
                                labelName: coop.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                                name: 'samityUniThanaPawIdType',
                                caseCadingName: 'union',
                                onChange: (e) => handleChangeMemberArea(e, i),
                                value: row.districtId,
                                isCasCading: true,
                                casCadingValue: {
                                  upaCityId: row.upaCityId,
                                  upaCityType: row.upaCityType,
                                },
                                showMuiltiple: JSON.stringify({
                                  uniThanaPawId: row.uniThanaPawId,
                                  uniThanaPawType: row.uniThanaPawType,
                                }),
                                casCadingValueDis: row.districtId,
                                xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                errorMessage: row.uniThanaPawIdError,
                              }}
                            />
                          ) : (
                            ''
                          )}
                          {coop.memberAreaType >= 4 ? (
                            <FromControlJSON
                              arr={[
                                {
                                  labelName: coop.memberAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                                  name: 'detailsAddress',
                                  onChange: (e) => handleChangeMemberArea(e, i),
                                  value: row.detailsAddress,
                                  size: 'small',
                                  type: 'text',
                                  viewType: 'textField',
                                  xl: 3,
                                  lg: 3,
                                  md: 3,
                                  xs: 12,
                                  isDisabled: false,
                                  placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                                  customClass: '',
                                  customStyle: {},
                                  errorMessage: row.detailsAddressError,
                                },
                              ]}
                            />
                          ) : (
                            ''
                          )}

                          <Grid
                            item
                            sx={{
                              display: 'flex',
                              jusityContent: 'flex-end',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Button
                              variant="outlined"
                              disabled={memberSelectArea.length > 1 ? false : true}
                              color="error"
                              onClick={() => handleRemoveMemberArea(row.id, i)}
                              size="small"
                              className="btn-close"
                            >
                              <Clear />
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                    </>
                  )}
                  <Button
                    className="btn btn-add"
                    onClick={handleAddClicksetMemberSelectArea}
                    size="small"
                    endIcon={<AddIcon />}
                    sx={{ marginTop: '1rem' }}
                  >
                    একাধিক সদস্য নির্বাচনী এলাকা সংযুক্ত করুন{' '}
                  </Button>
                  {/* //////////////////////////////End Member area //////////////////////////////////// */}
                </Grid>
                {/* ////////////////////////////////////////// //কর্ম এলাকা    //////////////////////////////////////////////*/}
                <Grid item xs={12}>
                  <Grid container flexDirection={'column'}>
                    <div style={{ display: 'flex' }}>
                      <Typography
                        sx={{
                          textDecoration: 'underline',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          padding: '.5rem',
                        }}
                      >
                        কর্ম এলাকা :{' '}
                      </Typography>
                      <span>
                        <FormControlLabel
                          control={<Checkbox />}
                          checked={checkedArea}
                          name="onChecked"
                          label="সদস্য নির্বাচনী এলাকা একই"
                          onChange={handleChange}
                        />
                      </span>
                    </div>
                    {checkedArea ? (
                      ''
                    ) : (
                      <>
                        {loadingData ? (
                          <Skeleton sx={{ height: '60px', width: '300px' }} />
                        ) : (
                          <FromControlJSON
                            arr={[
                              {
                                labelName: '',
                                name: 'workingAreaType',
                                onChange: handleChange,
                                value: coop.workingAreaType,
                                size: 'small',
                                type: 'text',
                                viewType: 'select',
                                optionData: area,
                                optionValue: 'value',
                                optionName: 'label',
                                xl: 4,
                                lg: 4,
                                md: 4,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                customStyle: {},
                                selectDisable: true,
                              },
                            ]}
                          />
                        )}
                      </>
                    )}
                  </Grid>

                  {/* //////////////////////// start working area /////////////////// */}
                  {loadingData ? (
                    <Skeleton sx={{ height: '60px' }} />
                  ) : (
                    <>
                      {checkedArea
                        ? memberSelectArea.map((row, i) => (
                          <Grid container spacing={1.5} my={1} key={i}>
                            {coop.memberAreaType >= 1 ? (
                              <GetGeoData
                                {...{
                                  labelName: RequiredFile('বিভাগ'),
                                  name: 'divisionId',
                                  caseCadingName: 'division',
                                  // onChange: (e) => handleChangeMemberArea(e, i),
                                  value: row.divisionId,
                                  isCasCading: true,
                                  xl:
                                    coop.memberAreaType == 1
                                      ? 5
                                      : coop.memberAreaType == 2
                                        ? 3.5
                                        : coop.memberAreaType == 3
                                          ? 2.5
                                          : 2,
                                  lg:
                                    coop.memberAreaType == 1
                                      ? 5
                                      : coop.memberAreaType == 2
                                        ? 3.5
                                        : coop.memberAreaType == 3
                                          ? 2.5
                                          : 2,
                                  md:
                                    coop.memberAreaType == 1
                                      ? 5
                                      : coop.memberAreaType == 2
                                        ? 3.5
                                        : coop.memberAreaType == 3
                                          ? 2.5
                                          : 2,
                                  xs: 12,
                                  isDisabled: true,
                                  customClass: '',
                                  customStyle: {},
                                  errorMessage: row.divisionIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.memberAreaType >= 1 ? (
                              <GetGeoData
                                {...{
                                  labelName: coop.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                                  name: 'districtId',
                                  caseCadingName: 'district',
                                  // onChange: (e) => handleChangeMemberArea(e, i),
                                  value: row.districtId,
                                  isCasCading: true,
                                  casCadingValue: row.divisionId,
                                  xl:
                                    coop.memberAreaType == 1
                                      ? 6
                                      : coop.memberAreaType == 2
                                        ? 3.5
                                        : coop.memberAreaType == 3
                                          ? 2.5
                                          : 2,
                                  lg:
                                    coop.memberAreaType == 1
                                      ? 6
                                      : coop.memberAreaType == 2
                                        ? 3.5
                                        : coop.memberAreaType == 3
                                          ? 2.5
                                          : 2,
                                  md:
                                    coop.memberAreaType == 1
                                      ? 6
                                      : coop.memberAreaType == 2
                                        ? 3.5
                                        : coop.memberAreaType == 3
                                          ? 2.5
                                          : 2,
                                  xs: 12,
                                  isDisabled: true,
                                  customClass: '',
                                  errorMessage: row.districtIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.memberAreaType >= 2 ? (
                              <GetGeoData
                                {...{
                                  labelName: coop.memberAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                                  name: 'samityUpaCityIdType',
                                  caseCadingName: 'upazila',
                                  // onChange: (e) => handleChangeMemberArea(e, i),
                                  isCasCading: true,
                                  casCadingValue: row.districtId,
                                  showMuiltiple: JSON.stringify({
                                    upaCityId: row.upaCityId,
                                    upaCityType: row.upaCityType,
                                  }),
                                  xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                  lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                  md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                  xs: 12,
                                  isDisabled: true,
                                  customClass: '',
                                  errorMessage: row.upaCityIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.memberAreaType >= 3 ? (
                              <GetGeoData
                                {...{
                                  labelName: coop.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                                  name: 'samityUniThanaPawIdType',
                                  caseCadingName: 'union',
                                  // onChange: (e) => handleChangeMemberArea(e, i),
                                  value: row.districtId,
                                  isCasCading: true,
                                  casCadingValue: {
                                    upaCityId: row.upaCityId,
                                    upaCityType: row.upaCityType,
                                  },
                                  showMuiltiple: JSON.stringify({
                                    uniThanaPawId: row.uniThanaPawId,
                                    uniThanaPawType: row.uniThanaPawType,
                                  }),
                                  casCadingValueDis: row.districtId,
                                  xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                  lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                  md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                                  xs: 12,
                                  isDisabled: true,
                                  customClass: '',
                                  errorMessage: row.uniThanaPawIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.memberAreaType >= 4 ? (
                              <FromControlJSON
                                arr={[
                                  {
                                    labelName: '',
                                    name: 'detailsAddress',
                                    // onChange: (e) => handleChangeMemberArea(e, i),
                                    value: row.detailsAddress,
                                    size: 'small',
                                    type: 'text',
                                    viewType: 'textField',
                                    xl: 3,
                                    lg: 3,
                                    md: 3,
                                    xs: 12,
                                    isDisabled: true,
                                    placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                                    customClass: '',
                                    customStyle: {},
                                    errorMessage: row.detailsAddressError,
                                  },
                                ]}
                              />
                            ) : (
                              ''
                            )}

                            <Grid
                              item
                              sx={{
                                display: 'flex',
                                jusityContent: 'flex-end',
                                alignItems: 'flex-start',
                              }}
                            >
                              <Button
                                variant="outlined"
                                disabled={true}
                                color="error"
                                onClick={() => handleRemoveMemberArea(row.id, i)}
                                size="small"
                                className="btn-close"
                              >
                                <Clear />
                              </Button>
                            </Grid>
                          </Grid>
                        ))
                        : workingArea.map((row, i) => (
                          <Grid container spacing={1.5} my={1} key={i}>
                            {coop.workingAreaType >= 1 ? (
                              <GetGeoData
                                {...{
                                  labelName: RequiredFile('বিভাগ'),
                                  name: 'divisionId',
                                  caseCadingName: 'division',
                                  onChange: (e) => handleChangeWorkingArea(e, i),
                                  value: row.divisionId,
                                  isCasCading: true,
                                  xl:
                                    coop.workingAreaType == 1
                                      ? 5
                                      : coop.workingAreaType == 2
                                        ? 3.5
                                        : coop.workingAreaType == 3
                                          ? 2.5
                                          : 2,
                                  lg:
                                    coop.workingAreaType == 1
                                      ? 5
                                      : coop.workingAreaType == 2
                                        ? 3.5
                                        : coop.workingAreaType == 3
                                          ? 2.5
                                          : 2,
                                  md:
                                    coop.workingAreaType == 1
                                      ? 5
                                      : coop.workingAreaType == 2
                                        ? 3.5
                                        : coop.workingAreaType == 3
                                          ? 2.5
                                          : 2,
                                  xs: 12,
                                  isDisabled: coop.workingAreaType == 1 ? false : true,
                                  customClass: '',
                                  customStyle: {},
                                  errorMessage: row.divisionIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.workingAreaType >= 1 ? (
                              <GetGeoData
                                {...{
                                  labelName: coop.workingAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                                  name: 'districtId',
                                  caseCadingName: 'district',
                                  onChange: (e) => handleChangeWorkingArea(e, i),
                                  value: row.districtId,
                                  isCasCading: true,
                                  casCadingValue: row.divisionId,
                                  xl:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 3.5
                                        : coop.workingAreaType == 3
                                          ? 2.5
                                          : 2,
                                  lg:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 3.5
                                        : coop.workingAreaType == 3
                                          ? 2.5
                                          : 2,
                                  md:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 3.5
                                        : coop.workingAreaType == 3
                                          ? 2.5
                                          : 2,
                                  xs: 12,
                                  isDisabled: coop.workingAreaType == 1 || coop.workingAreaType == 2 ? false : true,
                                  customClass: '',
                                  errorMessage: row.districtIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.workingAreaType >= 2 ? (
                              <GetGeoData
                                {...{
                                  labelName: coop.workingAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                                  name: 'samityUpaCityIdType',
                                  caseCadingName: 'upazila',
                                  onChange: (e) => handleChangeWorkingArea(e, i),
                                  isCasCading: true,
                                  casCadingValue: row.districtId,
                                  showMuiltiple: JSON.stringify({
                                    upaCityId: row.upaCityId,
                                    upaCityType: row.upaCityType,
                                  }),
                                  xl:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 4
                                        : coop.workingAreaType == 3
                                          ? 3
                                          : 2,
                                  lg:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 4
                                        : coop.workingAreaType == 3
                                          ? 3
                                          : 2,
                                  md:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 4
                                        : coop.workingAreaType == 3
                                          ? 3
                                          : 2,
                                  xs: 12,
                                  isDisabled: coop.workingAreaType == 2 || coop.workingAreaType == 3 ? false : true,
                                  customClass: '',
                                  errorMessage: row.upaCityIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.workingAreaType >= 3 ? (
                              <GetGeoData
                                {...{
                                  labelName: coop.workingAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                                  name: 'samityUniThanaPawIdType',
                                  caseCadingName: 'union',
                                  onChange: (e) => handleChangeWorkingArea(e, i),
                                  value: row.districtId,
                                  isCasCading: true,
                                  casCadingValue: {
                                    upaCityId: row.upaCityId,
                                    upaCityType: row.upaCityType,
                                  },
                                  showMuiltiple: JSON.stringify({
                                    uniThanaPawId: row.uniThanaPawId,
                                    uniThanaPawType: row.uniThanaPawType,
                                  }),
                                  casCadingValueDis: row.districtId,
                                  xl:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 4
                                        : coop.workingAreaType == 3
                                          ? 3
                                          : 2,
                                  lg:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 4
                                        : coop.workingAreaType == 3
                                          ? 3
                                          : 2,
                                  md:
                                    coop.workingAreaType == 1
                                      ? 6
                                      : coop.workingAreaType == 2
                                        ? 4
                                        : coop.workingAreaType == 3
                                          ? 3
                                          : 2,
                                  xs: 12,
                                  isDisabled: false,
                                  customClass: '',
                                  errorMessage: row.uniThanaPawIdError,
                                }}
                              />
                            ) : (
                              ''
                            )}
                            {coop.workingAreaType >= 4 ? (
                              <FromControlJSON
                                arr={[
                                  {
                                    labelName:
                                      coop.workingAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                                    name: 'detailsAddress',
                                    onChange: (e) => handleChangeWorkingArea(e, i),
                                    value: row.detailsAddress,
                                    size: 'small',
                                    type: 'text',
                                    viewType: 'textField',
                                    xl: 3,
                                    lg: 3,
                                    md: 3,
                                    xs: 12,
                                    isDisabled: false,
                                    placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                                    customClass: '',
                                    customStyle: {},
                                    errorMessage: row.detailsAddressError,
                                  },
                                ]}
                              />
                            ) : (
                              ''
                            )}
                            <Grid
                              item
                              sx={{
                                display: 'flex',
                                jusityContent: 'flex-end',
                                alignItems: 'flex-start',
                              }}
                            >
                              <Button
                                variant="outlined"
                                disabled={workingArea.length > 1 ? false : true}
                                color="error"
                                onClick={() => handleRemoveWorkingArea(row.id, i)}
                                size="small"
                                className="btn-close"
                              >
                                <Clear />
                              </Button>
                            </Grid>
                          </Grid>
                        ))}
                    </>
                  )}

                  {/* ////////////////////////////// End working area ///////////// */}
                  <Grid item>
                    {checkedArea ? (
                      ''
                    ) : (
                      <Button
                        className="btn btn-add"
                        onClick={handleAddClicksetWorkingArea}
                        size="small"
                        endIcon={<AddIcon />}
                        sx={{ marginTop: '1rem' }}
                      >
                        একাধিক কর্ম এলাকা সংযুক্ত করুন{' '}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* //////////////////////////////// সমিতির তথ্যাদি //////////////////////////////// */}
          <Grid container className="section">
            <Grid item xs={12}>
              <SubHeading>সমিতির তথ্যাদি</SubHeading>
              {loadingData ? (
                <Grid container gap={'0 20px'} flexWrap="wrap">
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                </Grid>
              ) : (
                <Grid container spacing={2.5}>
                  <FromControlJSON
                    arr={[
                      {
                        labelName: 'সমিতির ধরন',
                        name: 'samityTypeId',
                        onChange: handleChange,
                        value: coop.samityTypeId,
                        size: 'small',
                        type: 'text',
                        viewType: 'select',
                        optionData: samityType,
                        optionValue: 'id',
                        optionName: 'typeName',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        customStyle: {},
                      },
                      {
                        labelName: RequiredFile('সমিতি গঠনের তারিখ'),
                        onChange: handleChangeSamityRegDate,
                        value: coop.samityFormationDate,
                        size: 'small',
                        type: 'date',
                        viewType: 'date',
                        dateFormet: 'dd/MM/yyyy',
                        disableFuture: true,
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.samityFormationDate,
                      },
                      {
                        labelName: RequiredFile('সদস্য ভর্তি ফি'),
                        name: 'memberAdmissionFee',
                        onChange: handleChange,
                        value: coop.memberAdmissionFee,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        autoComplete: 'off',
                        isDisabled: false,
                        placeholder: 'সদস্য ভর্তি ফি টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.memberAdmissionFee,
                      },
                      {
                        labelName: userData?.doptorId == 2 ? 'শেয়ার সংখ্যা' : RequiredFile('শেয়ার সংখ্যা'),
                        name: 'noOfShare',
                        onChange: handleChange,
                        value: coop.noOfShare,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 2.5,
                        lg: 2.5,
                        md: 2.5,
                        xs: 12,
                        autoComplete: 'off',
                        isDisabled: false,
                        placeholder: 'শেয়ার সংখ্যা টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.noOfShare,
                      },
                      {
                        labelName:
                          userData?.doptorId == 2 ? 'প্রতিটি শেয়ারের মূল্য' : RequiredFile('প্রতিটি শেয়ারের মূল্য'),
                        name: 'sharePrice',
                        onChange: handleChange,
                        value: coop.sharePrice,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 2.5,
                        lg: 2.5,
                        md: 2.5,
                        xs: 12,
                        autoComplete: 'off',
                        isDisabled: false,
                        placeholder: 'প্রতিটি শেয়ারের মূল্য টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.sharePrice,
                      },
                      {
                        labelName: 'প্রস্তাবিত শেয়ার মূলধন',
                        name: 'proposedShareCapital',
                        onChange: handleChange,
                        value: coop.proposedShareCapital,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 2.5,
                        lg: 2.5,
                        md: 2.5,
                        xs: 12,
                        isDisabled: true,
                        placeholder: 'প্রস্তাবিত শেয়ার মূলধন টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: '',
                      },
                      {
                        labelName:
                          userData?.doptorId == 2 ? 'বিক্রিত শেয়ার সংখ্যা' : RequiredFile('বিক্রিত শেয়ার সংখ্যা'),
                        name: 'soldShare',
                        onChange: handleChange,
                        value: coop.soldShare,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 2,
                        lg: 2,
                        md: 2,
                        xs: 12,
                        autoComplete: 'off',
                        isDisabled: false,
                        placeholder: 'বিক্রিত শেয়ার সংখ্যা টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.soldShare,
                      },
                      {
                        labelName: 'বিক্রিত শেয়ার মূলধন',
                        name: 'soldShareCapital',
                        onChange: handleChange,
                        value: coop.soldShareCapital,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 2.5,
                        lg: 2.5,
                        md: 2.5,
                        xs: 12,
                        isDisabled: true,
                        placeholder: 'বিক্রিত শেয়ার মূলধন টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: '',
                      },
                    ]}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          {/* /////////////////////////////// সমিতির অন্যান্য তথ্যাদি ////////////////////////// */}
          <Grid container className="section">
            <Grid item xs={12}>
              <SubHeading>সমিতির অন্যান্য তথ্যাদি</SubHeading>
              {loadingData ? (
                <Grid container gap={'0 20px'} flexWrap="wrap">
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                  <Skeleton sx={{ height: '60px', flex: 1, minWidth: { xs: '100%', md: '20%' } }} />
                </Grid>
              ) : (
                <Grid container spacing={2.5}>
                  <FromControlJSON
                    arr={[
                      {
                        labelName: 'ফোন নং',
                        name: 'phone',
                        onChange: handleChange,
                        value: coop.phone,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        placeholder: 'ফোন নং টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                      },
                      {
                        labelName: RequiredFile('মোবাইল নং'),
                        name: 'mobile',
                        onChange: handleChange,
                        value: coop.mobile,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        placeholder: 'মোবাইল নং টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.mobile,
                      },
                      {
                        labelName: 'ই-মেইল',
                        name: 'email',
                        onChange: handleChange,
                        value: coop.email,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        placeholder: 'ই-মেইল টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.email,
                      },
                      {
                        labelName: RequiredFile(
                          userData?.doptorId == 2 ? 'উদ্দ্যেগী প্রকল্প/ কর্মসূচির নাম' : 'উদ্দ্যেগী সংস্থার নাম',
                        ),
                        name: 'enterprisingId',
                        onChange: handleChange,
                        value: coop.enterprisingId,
                        size: 'small',
                        type: 'text',
                        viewType: 'select',
                        optionData: enterPrising,
                        optionValue: 'id',
                        optionName: 'orgNameBangla',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.enterprisingId,
                      },
                      {
                        labelName: RequiredFile('প্রকল্পের নাম'),
                        name: 'projectId',
                        onChange: handleChange,
                        value: coop.projectId,
                        size: 'small',
                        type: 'text',
                        viewType: 'select',
                        optionData: projects,
                        optionValue: 'id',
                        optionName: 'projectNameBangla',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        customClass: '',
                        customStyle: {},
                        hidden: projects.length > 0 ? false : true,
                        errorMessage: formErrors.projectId,
                      },
                      {
                        labelName: 'ওয়েব সাইট',
                        name: 'website',
                        onChange: handleChange,
                        value: coop.website,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 4,
                        lg: 4,
                        md: 4,
                        xs: 12,
                        isDisabled: false,
                        placeholder: 'ওয়েব সাইট টাইপ করুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.website,
                      },
                    ]}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Fragment>
      </Grid>

      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton
            loading
            className="btn btn-save"
            sx={{ backgroundColor: 'red', mr: 1 }}
            loadingPosition="start"
            startIcon={<SaveOutlinedIcon />}
            variant="contained"
          >
            {update ? 'হালনাগাদ করা হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
          </LoadingButton>
        ) : (
          <Tooltip title={update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন ও পরবর্তী পাতায়'}>
            <Button
              className="btn btn-save"
              onClick={onSubmitData}
              disabled={checkFormError() ? false : true}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন ও পরবর্তী পাতায়'}
            </Button>
          </Tooltip>
        )}
        {update ? (
          <Tooltip title="পরবর্তী পাতা">
            <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
              পরবর্তী পাতায়
            </Button>
          </Tooltip>
        ) : (
          ''
        )}
      </Grid>
    </>
  );
};

export default CoopReg;
