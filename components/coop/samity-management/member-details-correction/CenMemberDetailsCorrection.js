/**
 * @author Md Hasibuzzaman
 * @author2 Hrithik
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/06/08 10:13:48
 * @modify date 2022-06-20 10:13:48
 * @desc [description]
 */
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { inputDate } from 'service/fromInput';
import { numberToWord } from 'service/numberToWord';
import Swal from 'sweetalert2';
import {
  ApprovalSamityMemberList,
  approvedDynamicImage,
  cenNatSamityMemberCor,
  deleteApplication,
  GetCorrectonMembrData,
  InsertMemCorrectionData,
  memberInfoCorrectionRequest,
} from '../../../../url/coop/ApiList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const CenMemberDetailsCorrection = (props) => {
  const { samityPerId } = props;
  ///////////////////////////////////////*** page validation & localstorage data ***//////////////////////////////
  const config = localStorageData('config');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [dataEmpty, setDataEmpty] = useState(true);
  ////////////////////////////////////////*** page validation & localstorage End***///////////////////////////////
  const [update, setUpdate] = useState(false);
  const [memberCorrection, setMemberCorrection] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [memberIndex, setMemberIndex] = useState(null);
  //State for this component
  const [locale] = useState('bn');
  const [value, setValue] = useState(null);
  const [samityInfo, setSamityInfo] = useState({
    id: '',
    samityId: '',
    samityCode: '',
    samityName: '',
    samityRegistrationDate: '',
    memberNameBangla: '',
    samityDetailsAddress: '',
    samitySignatoryPerson: '',
    mobile: '',
  });
  const [allSamityData, setAllSamityData] = useState([]);
  const [dynamicImageData, setDynamicImageData] = useState([]);
  let [getCorrectionMemData, setGetCorrectionMemData] = useState([]);
  const [showAllMember, setShowAllMember] = useState([]);
  const [isAddMember, setIsAddMember] = useState(false);
  useEffect(() => {
    getCenNatSamityAllData();
    getImageFormet();
    allMemberShow();
  }, [samityPerId]);

  const addNewMember = () => {
    setIsAddMember(true);
  };

  const allMemberShow = async () => {
    try {
      const showMemeber = await axios.get(ApprovalSamityMemberList + samityPerId, config);
      const data = showMemeber.data.data;

      setShowAllMember(data);
      const showCorrectionMemberData = await axios.get(GetCorrectonMembrData + samityPerId, config);
      setGetCorrectionMemData(
        _.omit(
          showCorrectionMemberData.data.data,
          'createdAt',
          'updatedBy',
          'updatedAt',
          'status',
          'serviceId',
          'isUsed',
          'finalApprove',
          'createdBy',
        ),
      );
    } catch (error) {
      // errorHandler(error);
    }
  };
  const closeFrom = () => {
    setUpdate(false);
    setMemberCorrection(false);
    setIsAddMember(false);
    getCenNatSamityAllData();
    allMemberShow();
    setDynamicImageData([]);
    getImageFormet();
    setSamityInfo({
      id: '',
      samityId: '',
      samityCode: '',
      samityName: '',
      samityRegistrationDate: '',
      memberNameBangla: '',
      samityDetailsAddress: '',
      samitySignatoryPerson: '',
      mobile: '',
    });
    setValue(null);
    setUpdate(false);
    setMemberId('');
    setLoadingDataSaveUpdate(false);
    setDataEmpty(true);
  };
  const clearFrom = () => {
    setUpdate(false);
    setMemberCorrection(false);
    // getCenNatSamityAllData();
    // allMemberShow();
    setDynamicImageData([]);
    getImageFormet();
    setSamityInfo({
      id: '',
      samityId: '',
      samityCode: '',
      samityName: '',
      samityRegistrationDate: '',
      memberNameBangla: '',
      samityDetailsAddress: '',
      samitySignatoryPerson: '',
      mobile: '',
    });
    setValue(null);
    setUpdate(false);
    setMemberId('');
    setLoadingDataSaveUpdate(false);
    setDataEmpty(true);
  };
  //  ************************************************** Image Part Start  ***************************************
  let handleChangeDynamicImage = (e, type, i) => {
    let imageData = [...dynamicImageData];
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      if (
        file.name.includes('.jpg') ||
        file.name.includes('.png') ||
        file.name.includes('.JPEG') ||
        file.name.includes('.pdf')
      ) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        if (imageData[i].docType == 'IMG' || imageData[i].docType == 'SIG') {
          if (file.name.includes('.pdf')) {
            NotificationManager.warning(
              imageData[i].docTypeDesc + ' jpg, png, jpeg এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ',
            );
          } else {
            reader.onload = () => {
              let base64Image = btoa(reader.result);
              imageData[i]['name'] = file.name;
              imageData[i]['mimeType'] = file.type;
              imageData[i]['base64Image'] = base64Image;
              imageData[i]['imageError'] = '';
              setDynamicImageData(imageData);
            };
          }
        } else {
          reader.onload = () => {
            let base64Image = btoa(reader.result);
            imageData[i]['name'] = file.name;
            imageData[i]['mimeType'] = file.type;
            imageData[i]['base64Image'] = base64Image;
            imageData[i]['imageError'] = '';
            setDynamicImageData(imageData);
          };
        }
      } else {
        NotificationManager.warning('jpg, png, jpeg, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ');
      }
    }
  };

  //************************************************ Method for removing image ***************************
  const removeSelectedDynamicImage = (e, i) => {
    const imageData = [...dynamicImageData];
    imageData[i]['name'] = '';
    imageData[i]['mimeType'] = '';
    imageData[i]['base64Image'] = '';
    imageData[i]['fileNameUrl'] = '';
    imageData[i]['imageError'] = imageData[i].isMandatory == 'Y' ? imageData[i].docTypeDesc + ' প্রদান করুন' : '';
    setDynamicImageData(imageData);
  };
  // ******************************************* Get Samity Data *********************************************
  const getCenNatSamityAllData = async () => {
    try {
      // ******************************** get samity data for add *******************************************
      const responsePost = await axios.get(cenNatSamityMemberCor + samityPerId, config);
      let allRespData = responsePost.data.data;
      setAllSamityData(allRespData);
    } catch (error) {
      errorHandler(error);
    }
  };
  // **************************************** All Handle Change part ***************************************

  const handleChangeSamityName = async (e) => {
    if (e.target.value != 0) {
      const found = allSamityData.find((obj) => {
        return obj.id == e.target.value;
      });

      setSamityInfo({
        ...samityInfo,
        id: found.id,
        samityId: found.samityId,
        samityCode: found.samityCode,
        samityName: found.samityName,
        samityRegistrationDate: dateFormat(found.samityRegistrationDate),
        samitySignatoryPerson: found.memberNameBangla,
        memberNameBangla: found.memberNameBangla,
        samityDetailsAddress: found.samityDetailsAddress,
        mobile: found.mobile,
      });
      if (value) {
        setDataEmpty(false);
      } else {
        setDataEmpty(true);
      }
    } else {
      setSamityInfo({
        ...samityInfo,
        id: '',
        samityId: '',
        samityCode: '',
        samityName: '',
        samityRegistrationDate: '',
        memberNameBangla: '',
        samityDetailsAddress: '',
        mobile: '',
      });
    }
  };
  // **************************************** Date of birt **************************************************
  const changeDob = (dob) => {
    setValue(dob);
    if (dob) {
      setDataEmpty(false);
    } else {
      setDataEmpty(true);
    }
  };
  // ******************************************* Dynamic Image *********************************************
  const getImageFormet = async () => {
    try {
      const imageData = await axios.get(approvedDynamicImage + samityPerId, config);
      const data = imageData.data.data;
      for (const [index] of data.entries()) {
        data[index].name = '';
        data[index].mimeType = '';
        data[index].base64Image = '';
        data[index].imageError = '';
      }

      setDynamicImageData(data);
    } catch (error) {
      errorHandler(error);
    }
  };

  // ***************************************************** On edit Samity Lavel C & N Part start  ***************
  const imageCheck = async (secondState) => {
    let firstState;
    const imageData = await axios.get(approvedDynamicImage + samityPerId, config);
    firstState = imageData.data.data;
    for (const [index] of firstState.entries()) {
      firstState[index].name = '';
      firstState[index].mimeType = '';
      firstState[index].base64Image = '';
      firstState[index].imageError = '';
    }

    for (const element of secondState) {
      const index = firstState.findIndex((e) => e.docId == element.docId);
      if (index >= 0) {
        firstState.splice(index, 1, element);
      }
    }
    setDynamicImageData(firstState);
  };
  const onEdit = async (data) => {
    setIsAddMember(true);
    setUpdate(true);
    setSamityInfo({
      ...samityInfo,
      id: data.refSamityId,
      samityId: samityPerId,
      samityCode: data.samityCode,
      samityName: data.memberName,
      samityRegistrationDate: dateFormat(data.samityRegistrationDate),
      memberNameBangla: data.memberName,
      samityDetailsAddress: data.samityDetailsAddress,
      samitySignatoryPerson: data.samitySignatoryPerson,
      mobile: data.mobile,
    });
    // image set start
    if (data.documents) {
      for (const [index] of data.documents.entries()) {
        data.documents[index].name = '';
        data.documents[index].mimeType = '';
        data.documents[index].base64Image = '';
      }
      // setDynamicImageData(data.documents)
      imageCheck(data.documents);
    } else {
      getImageFormet();
    }
    setValue(data.memberAdmissionDate);
    setMemberId(data.id);
    setDataEmpty(false);
    setUpdate(true);
  };
  const removeCorrectionMember = async (index, name) => {
    try {
      await Swal.fire({
        title: 'সদস্য পদ বাতিল',
        text: 'আপনি কি ' + name + ' এর সদস্যপদ বাতিল করতে চান ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ফিরে যান ।',
        confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
      }).then((result) => {
        if (result.isConfirmed) {
          if (getCorrectionMemData.data.membersInfo.length === 1) {
            axios.delete(deleteApplication + getCorrectionMemData.id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার বাতিল করা হয়েছে.', 'success');
                allMemberShow();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                allMemberShow();
              }
            });
          } else {
            let list = { ...getCorrectionMemData };
            list.data.membersInfo.splice(index, 1);
            list = _.omit(list, 'nextAppDesignationId');
            list.serviceName = 'member_information_correction';

            axios.put(InsertMemCorrectionData + '/' + getCorrectionMemData.id, list, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                allMemberShow();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                allMemberShow();
              }
            });
          }
          allMemberShow();
        }
      });
    } catch (error) {
      // errorHandler(error)
    }
  };

  // ***************************************************** Samity Lavel C & N Part End  ***********************

  // ***************************************************** data submit part start *****************************
  let onSubmitData = async (e, isDelete, member) => {
    let insertCorectionData, deletePayload;
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    const exprectedKeys = [
      'id',
      'samityId',
      'memberAdmissionDate',
      'memberName',
      'actionFor',
      'address',
      'documents',
      'samitySignatoryPerson',
      'refSamityId',
      'mobile',
    ];
    const expectedDocumentKeys = ['docTypeDesc', 'fileName', 'docType', 'docId', 'mimeType', 'name', 'base64Image'];
    if (getCorrectionMemData.data?.membersInfo?.length > 0) {
      for (const [index, element] of getCorrectionMemData.data.membersInfo.entries()) {
        Object.keys(element).map((e) => {
          return exprectedKeys.includes(e) || delete getCorrectionMemData.data.membersInfo[index][e];
        });
        if (element?.documents?.length > 0) {
          for (const [i, e] of element.documents.entries()) {
            Object.keys(e).map((val) => {
              return (
                expectedDocumentKeys.includes(val) ||
                delete getCorrectionMemData.data.membersInfo[index].documents[i][val]
              );
            });
          }
        }
      }
    }
    getCorrectionMemData = _.omit(getCorrectionMemData, 'nextAppDesignationId');
    getCorrectionMemData.serviceName = 'member_information_correction';
    // if (isDelete==false) {
    dynamicImageData.forEach((a) => {
      delete a.fileNameUrl;
      if (!a.base64Image) {
        delete a.name;
        delete a.mimeType;
        delete a.base64Image;
      }
      if (a.base64Image) {
        delete a.fileName;
      }
    });

    const imageChecker = (image) => {
      let imageList;
      imageList = image.map((e) => {
        return _.omit(e, 'imageError');
      });
      return imageList;
    };
    // }
    if (isDelete) {
      deletePayload = {
        serviceName: 'member_information_correction',
        samityId: samityPerId,
        data: {
          membersInfo: [
            {
              samityId: samityPerId,
              id: member.memberBasicInfo.id,
              memberName: member.memberBasicInfo.memberName,
              refSamityId: member.memberBasicInfo.refSamityId,
              memberAdmissionDate: dateFormat(member.memberBasicInfo.memberAdmissionDate),
              address: member.memberBasicInfo.samityDetailsAddress,
              samitySignatoryPerson: member.memberBasicInfo.samitySignatoryPerson,
              mobile: member.memberBasicInfo.mobile,
              actionFor: 'deactivate',
              // documents: member.memberBasicInfo.documents,
            },
          ],
        },
      };
    }
    const correctionPayload = {
      serviceName: 'member_information_correction',
      samityId: samityPerId,
      data: {
        membersInfo: [
          {
            samityId: samityPerId,
            memberName: samityInfo.samityName,
            refSamityId: samityInfo.id,
            memberAdmissionDate: dateFormat(value),
            address: samityInfo.samityDetailsAddress,
            samitySignatoryPerson: samityInfo.samitySignatoryPerson,
            mobile: samityInfo.mobile,
            actionFor: isDelete && memberId ? 'deactivate' : memberId ? 'update' : 'create',
            documents: imageChecker(dynamicImageData),
            ...(memberId && { id: memberId }),
          },
        ],
      },
    };
    try {
      if (getCorrectionMemData.id) {
        if (isDelete) {
          // delete update part
          getCorrectionMemData.data.membersInfo.push(deletePayload.data.membersInfo[0]);
          insertCorectionData = await axios.put(
            InsertMemCorrectionData + '/' + getCorrectionMemData.id,
            getCorrectionMemData,
            config,
          );
          const message = ' সদস্যপদ বাতিলের আবেদনটি সফলভাবে সংরক্ষন করা হয়েছে';
          NotificationManager.success(message, '', 5000);
        } else {
          // update part
          if (memberIndex != null) {
            getCorrectionMemData.data.membersInfo[memberIndex] = correctionPayload.data.membersInfo[0];
            insertCorectionData = await axios.put(
              InsertMemCorrectionData + '/' + getCorrectionMemData.id,
              getCorrectionMemData,
              config,
            );
            NotificationManager.success(insertCorectionData.data.message, '', 5000);
          } else {
            getCorrectionMemData.data.membersInfo.push(correctionPayload.data.membersInfo[0]);
            insertCorectionData = await axios.put(
              InsertMemCorrectionData + '/' + getCorrectionMemData.id,
              getCorrectionMemData,
              config,
            );
            const message = 'আবেদনটি সফলভাবে সংরক্ষন করা হয়েছে';
            NotificationManager.success(message, '', 5000);
          }
        }
      } else {
        if (isDelete) {
          insertCorectionData = await axios.post(InsertMemCorrectionData, deletePayload, config);
          NotificationManager.success(insertCorectionData.data.message, '', 5000);
        } else {
          /////////////////////////////////////////// post ////////////////////////////
          insertCorectionData = await axios.post(InsertMemCorrectionData, correctionPayload, config);
          NotificationManager.success(insertCorectionData.data.message, '', 5000);
          /////////////////////////////////////////// post ///////////////////////////////
        }
      }
      setUpdate(false);
      setMemberCorrection(false);
      setIsAddMember(false);
      getCenNatSamityAllData();
      allMemberShow();
      setDynamicImageData([]);
      getImageFormet();
      setSamityInfo({
        id: '',
        samityId: '',
        samityCode: '',
        samityName: '',
        samityRegistrationDate: '',
        memberNameBangla: '',
        samityDetailsAddress: '',
        samitySignatoryPerson: '',
        mobile: '',
      });
      setValue(null);
      setUpdate(false);
      setMemberId('');
      setLoadingDataSaveUpdate(false);
      setDataEmpty(true);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      allMemberShow();
      errorHandler(error);
    }
  };
  // ***************************************************** data submit part End *******************************
  let onEditCorrection = (data, i) => {
    setIsAddMember(true);
    setMemberCorrection(true);
    setSamityInfo({
      ...samityInfo,
      id: data.refSamityId,
      samityId: samityPerId,
      samityCode: data.samityCode,
      samityName: data.memberName,
      samityRegistrationDate: data.samityRegistrationDate,
      memberNameBangla: data.memberName,
      samityDetailsAddress: data.address,
      samitySignatoryPerson: data.samitySignatoryPerson,
      mobile: data.mobile,
    });
    // image set start
    if (data.documents) {
      for (const [index] of data.documents.entries()) {
        data.documents[index].name = '';
        data.documents[index].mimeType = '';
        data.documents[index].base64Image = '';
      }
      // setDynamicImageData(data.documents)
      imageCheck(data.documents);
    } else {
      getImageFormet();
    }
    setValue(data.memberAdmissionDate);
    setMemberIndex(i);
    setMemberId(data.id);
    setDataEmpty(false);
  };
  const sendCorrectionMemberList = async (id) => {
    try {
      const submitCorrectionData = await axios.patch(memberInfoCorrectionRequest + id, '', config);
      allMemberShow();
      NotificationManager.success(submitCorrectionData.data.message, '', 5000);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      {isAddMember ? (
        <>
          <Grid container className="section">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={1.8}>
                <Grid item lg={4} md={4} xl={4} sx={12}>
                  {update || memberCorrection ? (
                    <TextField
                      fullWidth
                      disabled
                      label="সমিতির নাম"
                      required
                      value={samityInfo.samityName}
                      variant="outlined"
                      size="small"
                    ></TextField>
                  ) : (
                    <TextField
                      fullWidth
                      label="সমিতির নাম"
                      name="samityName"
                      onChange={handleChangeSamityName}
                      required
                      value={samityInfo.id ? samityInfo.id : 0}
                      variant="outlined"
                      size="small"
                      select
                      SelectProps={{ native: true }}
                    >
                      <option value={0}>- নির্বাচন করুন -</option>
                      {allSamityData?.map((option, i) => (
                        <option key={i} value={option.id || option.centralSamityId}>
                          {option.samityName || option.centralSamityName}
                        </option>
                      ))}
                    </TextField>
                  )}
                </Grid>
                <Grid item lg={4} md={4} xl={4} sx={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="সমিতির রেজিস্ট্রেশন/ নিবন্ধন নাম্বার"
                    name="samityName"
                    // onChange={handleChangeSamityName}
                    required
                    value={samityInfo.samityCode}
                    variant="outlined"
                    size="small"
                  ></TextField>
                </Grid>
                <Grid item lg={4} md={4} xl={4} sx={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="রেজিস্ট্রেশনের/ নিবন্ধনের তারিখ"
                    name="samityName"
                    // onChange={handleChangeSamityName}
                    required
                    value={samityInfo.samityRegistrationDate}
                    variant="outlined"
                    size="small"
                  ></TextField>
                </Grid>
                <Grid item lg={4} md={4} xl={4} sx={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="কেন্দ্রীয়/জাতীয় সমিতির পক্ষে স্বাক্ষরের ব্যক্তি"
                    name="samityName"
                    // onChange={handleChangeSamityName}
                    required
                    value={samityInfo.samitySignatoryPerson}
                    variant="outlined"
                    size="small"
                  ></TextField>
                </Grid>
                <Grid item lg={4} md={4} xl={4} sx={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="সমিতির কার্যালয়ের ঠিকানা"
                    name="samityName"
                    // onChange={handleChangeSamityName}
                    required
                    value={samityInfo.samityDetailsAddress}
                    variant="outlined"
                    size="small"
                  ></TextField>
                </Grid>
                {inputDate(
                  RequiredFile('সদস্যভুক্তির তারিখ'),
                  changeDob,
                  value,
                  'dd/MM/yyyy',
                  '01-01-1970',
                  locale,
                  true,
                  4,
                  4,
                  4,
                  12,
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid container className="section">
            <Grid item lg={12} md={12} xs={12}>
              <SubHeading>প্রয়োজনীয় ডকুমেন্ট</SubHeading>
              <Grid container>
                {dynamicImageData?.map((element, i) => (
                  <>
                    <FromControlJSON
                      arr={[
                        {
                          onChange: (e) => handleChangeDynamicImage(e, element.mimeType, i),
                          onClickRefresh: (event) => {
                            event.target.value = null;
                          },
                          onClickFun: (e) => removeSelectedDynamicImage(e, i),
                          imageData: element,
                          size: 'small',
                          type: 'file',
                          viewType: 'file',
                          xl: 4,
                          lg: 4,
                          md: 4,
                          xs: 12,
                          index: i,
                          hidden: false,
                          isDisabled: false,
                          customClass: '',
                          imageStyle: { height: '100%', width: '100%' },
                          divStyle: {
                            display: 'flex',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                          },
                        },
                      ]}
                    />
                  </>
                ))}
              </Grid>
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
                {update || memberCorrection ? 'হালনাগাদ করা হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
              </LoadingButton>
            ) : (
              <Button
                disabled={dataEmpty}
                className="btn btn-save"
                onClick={onSubmitData}
                startIcon={<SaveOutlinedIcon />}
              >
                {update || memberCorrection ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
              </Button>
            )}
            <Button className="btn btn-warning" onClick={clearFrom} startIcon={<SubtitlesOffIcon />}>
              মুছে ফেলুন
            </Button>
            <Button className="btn btn-delete" onClick={closeFrom} startIcon={<HighlightOffIcon />}>
              বন্ধ করুন
            </Button>
          </Grid>
        </>
      ) : (
        <Grid container className="btn-container">
          <Button className="btn btn-add" onClick={addNewMember} startIcon={<PersonAddAltIcon />}>
            নতুন সদস্য যোগ করুন
          </Button>
          {getCorrectionMemData?.data?.membersInfo?.length > 0 ? (
            <Tooltip
              title={
                getCorrectionMemData.nextAppDesignationId
                  ? 'আবেদনটি সফলভাবে জমা দেওয়া হয়েছে, দয়া করে অনুমোদনের জন্য অপেক্ষা করুন।'
                  : 'আবেদনটি জমা দিন'
              }
            >
              <Button
                disabled={getCorrectionMemData.nextAppDesignationId ? true : false}
                className="btn btn-save"
                onClick={() => sendCorrectionMemberList(getCorrectionMemData.id)}
                endIcon={<SaveAltIcon />}
              >
                {getCorrectionMemData.nextAppDesignationId
                  ? 'আবেদনটি সফলভাবে জমা দেওয়া হয়েছে, দয়া করে অনুমোদনের জন্য অপেক্ষা করুন।'
                  : 'আবেদনটি জমা দিন'}
              </Button>
            </Tooltip>
          ) : (
            ''
          )}
        </Grid>
      )}

      <Divider style={{ marginBottom: '1rem' }} />

      <Grid container className="section">
        <Grid xs={12}>
          <SubHeading>বিদ্যমান সদস্যের তথ্য</SubHeading>
          <TableContainer className="table-container">
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <StyledTableCell align="center">ক্রমিক নং</StyledTableCell>
                  <StyledTableCell>সমিতির নাম</StyledTableCell>
                  <StyledTableCell>নিবন্ধন নাম্বার</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>নিবন্ধনের তারিখ</StyledTableCell>
                  <StyledTableCell>ঠিকানা</StyledTableCell>
                  <StyledTableCell
                    sx={{
                      whiteSpace: 'initial !important',
                      width: '20%',
                    }}
                  >
                    কেন্দ্রীয়/জাতীয় সমিতির পক্ষে সাক্ষরিত ব্যক্তির নাম
                  </StyledTableCell>
                  <StyledTableCell>মোবাইল নম্বর</StyledTableCell>
                  {getCorrectionMemData.nextAppDesignationId ? (
                    ''
                  ) : (
                    <StyledTableCell sx={{ textAlign: 'center' }}></StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {showAllMember?.map((member, index) => (
                  <TableRow key={index}>
                    <StyledTableCell sx={{ textAlign: 'center' }}>
                      {numberToWord('' + (index + 1) + '')}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title={<div className="tooltip-title">{member?.memberBasicInfo?.memberName}</div>}>
                        <span className="data">{member?.memberBasicInfo?.memberName}</span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={
                          <div className="tooltip-title">
                            {numberToWord(
                              '' +
                              (member?.memberBasicInfo.samityCode || member?.memberBasicInfo.centralSamityCode) +
                              '',
                            )}
                          </div>
                        }
                      >
                        <span className="data">
                          {numberToWord(
                            '' + (member?.memberBasicInfo.samityCode || member?.memberBasicInfo.centralSamityCode) + '',
                          )}
                        </span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: 'center' }}>
                      {numberToWord(dateFormat(member?.memberAdmissionDate))}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={<div className="tooltip-title">{member.memberBasicInfo?.samityDetailsAddress}</div>}
                      >
                        <span className="data">{member.memberBasicInfo?.samityDetailsAddress}</span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={
                          <div className="tooltip-title">
                            {member.memberBasicInfo?.samitySignatoryPerson ||
                              member?.memberBasicInfo.signatoryPersonNameBangla}
                          </div>
                        }
                      >
                        <span className="data">
                          {member.memberBasicInfo?.samitySignatoryPerson ||
                            member?.memberBasicInfo.signatoryPersonNameBangla}
                        </span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>
                      {member?.memberBasicInfo?.mobile ? numberToWord(member.memberBasicInfo?.mobile) : ' '}
                    </StyledTableCell>
                    {getCorrectionMemData.nextAppDesignationId ? (
                      ''
                    ) : (
                      <StyledTableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="সম্পাদন করুন">
                          <Button
                            disabled={member.isEditAble ? false : true}
                            className="table-icon edit"
                            sx={{ transform: 'scale(0.8)' }}
                            onClick={() => onEdit(member?.memberBasicInfo)}
                          >
                            <EditIcon sx={{ display: 'block' }} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="সদস্যপদ বাতিল">
                          <Button
                            disabled={member.isEditAble ? false : true}
                            className="table-icon delete"
                            sx={{ transform: 'scale(0.8)' }}
                            onClick={(e) => onSubmitData(e, true, member)}
                          >
                            <DeleteForeverIcon />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid lg={12} md={12} sm={12} xs={12}>
          <SubHeading>নতুন / বিদ্যমান সদস্যের তথ্য</SubHeading>
          {getCorrectionMemData?.data?.membersInfo?.length > 0 ? (
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <StyledTableCell align="center">ক্রমিক নং</StyledTableCell>
                    <StyledTableCell>সমিতির অবস্থান</StyledTableCell>
                    <StyledTableCell>সমিতির নাম</StyledTableCell>
                    <StyledTableCell sx={{ textAlign: 'center' }}>নিবন্ধনের তারিখ</StyledTableCell>
                    <StyledTableCell>ঠিকানা</StyledTableCell>
                    <StyledTableCell
                      sx={{
                        whiteSpace: 'initial !important',
                        width: '20%',
                      }}
                    >
                      কেন্দ্রীয়/জাতীয় সমিতির পক্ষে সাক্ষরিত ব্যক্তির নাম
                    </StyledTableCell>
                    <StyledTableCell>মোবাইল নম্বর</StyledTableCell>
                    {getCorrectionMemData.nextAppDesignationId ? (
                      ''
                    ) : (
                      <StyledTableCell sx={{ textAlign: 'center' }}></StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCorrectionMemData?.data?.membersInfo?.map((member, index) => (
                    <TableRow key={index}>
                      <StyledTableCell sx={{ textAlign: 'center' }}>
                        {numberToWord('' + (index + 1) + '')}
                      </StyledTableCell>
                      <StyledTableCell>
                        {member.actionFor == 'create'
                          ? 'নতুন সদস্য'
                          : member.actionFor == 'update'
                            ? 'বিদ্যমান সদস্য'
                            : 'সদস্যপদ বাতিল'}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title={<div className="tooltip-title">{member.memberName}</div>} arrow>
                          <span className="data">{member.memberName}</span>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="center"> {numberToWord(member?.memberAdmissionDate)} </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title={<div className="tooltip-title">{member.address}</div>} arrow>
                          <span className="data">{member.address}</span>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title={<div className="tooltip-title">{member.samitySignatoryPerson}</div>} arrow>
                          <span className="data">{member.samitySignatoryPerson}</span>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title={<div className="tooltip-title">{member.mobile}</div>} arrow>
                          <span className="data">{member.mobile}</span>
                        </Tooltip>
                      </StyledTableCell>
                      {getCorrectionMemData.nextAppDesignationId ? (
                        ''
                      ) : (
                        <StyledTableCell align="center">
                          {getCorrectionMemData.editEnable ? (
                            <>
                              <Tooltip title="সম্পাদন করুন">
                                <Button
                                  disabled={member.actionFor == 'deactivate' ? true : false}
                                  className="table-icon edit"
                                  sx={{ transform: 'scale(0.8)' }}
                                  onClick={() => onEditCorrection(member, index)}
                                >
                                  <EditIcon />
                                </Button>
                              </Tooltip>
                              <Tooltip title="সদস্যপদ বাতিল">
                                <Button
                                  className="table-icon delete"
                                  sx={{ transform: 'scale(0.8)' }}
                                  onClick={() => removeCorrectionMember(index, member.memberName)}
                                >
                                  <DeleteForeverIcon />
                                </Button>
                              </Tooltip>
                            </>
                          ) : (
                            <span style={{ color: '#3434b7' }}>আবেদনটি প্রক্রিয়াধীন আছে</span>
                          )}
                        </StyledTableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container>
              <Grid item md={12} sx={{ textAlign: 'center', fontSize: '20px' }} my={5}>
                আপনি কোন সদস্য যোগ করেননি ! নতুন সদস্য যোগ করতে{' '}
                <span style={{ color: '#2e7d32' }} className={'textAnimation'}>
                  ( সদস্য যোগ করুন )
                </span>{' '}
                বাটন ক্লিক করুন
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CenMemberDetailsCorrection;
