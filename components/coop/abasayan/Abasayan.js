/* eslint-disable no-dupe-else-if */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Grid, TextField } from '@mui/material';
import axios from 'axios';
import Loader from 'components/Loader';
import fileCheck from 'components/shared/others/DocImage/FileUploadTypeCheck';
import RequiredFile from 'components/utils/RequiredFile';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import { localStorageData, tokenData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { unescape } from 'underscore';
import { AbasayanSubmitApi, ApproveSamityReportApi, applicationGetById, serviceRules } from '../../../url/coop/ApiList';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import dynamic from 'next/dynamic';
const DynamicDocSectionHeader = dynamic(() => import('components/shared/others/DocImage/DocSectionHeader'), {
  loading: () => <Loader />,
});
const DynamicDocSectionContent = dynamic(() => import('components/shared/others/DocImage/DocSectionContent'), {
  loading: () => <Loader />,
});

const Abasayan = ({ samityId, samityLevel }) => {
  const router = useRouter();
  const config = localStorageData('config');
  const userData = tokenData();
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [documentType, setDocumentType] = useState([]);
  const [imageValidation, setImageValidation] = useState([]);
  const [documentList, setDocumentList] = useState([
    {
      documentType: 12,
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

  const [formErrors] = useState({
    samityName: '',
    soldShare: '',
    noOfShare: '',
    sharePrice: '',
    samityDivisionId: '',
    samityDistrictId: '',
    samityUpaCityId: '',
    samityUniThanaPawId: '',
    samityDetailsAddress: '',
    memberAdmissionFee: '',
    documentType: '',
    documentNumber: '',
    documentPictureFront: '',
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
  const [allcontent, setAllcontent] = useState('');
  const [update, setUpdate] = useState(false);
  const [documentFetch, setDocumentFetch] = useState([]);
  const [abaCause, setAbaCause] = useState([]);

  const appId = router.query.id;

  const clearState = () => {
    setSamityInfo({
      ...samityInfo,
      samityCode: '',
      samityName: '',
      samityTypeId: '',
    });

    setAllcontent();
    setAbasayanCauses();
    setDocumentList([
      {
        documentType: 12,
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
    serviceInfo();
  }, []);

  useEffect(() => {
    if (samityId) {
      samityReport(samityId);
    }
  }, [samityId]);

  const serviceInfo = async () => {
    const serviceNameData = await axios.get(serviceRules + 11, config);
    setDocumentType(serviceNameData.data.data[0].featuresDetails);
    setAbaCause(serviceNameData.data.data[0].serviceRules.abasayanCauses);
  };

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
    const { name } = event.target;
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
    if (parseInt(docId) === 12) {
      return 'সাংগঠনিক সভার রেজুলেশন';
    }
    if (parseInt(docId) === 36) {
      return 'অবসায়নের ডকুমেন্টস';
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
      const newDocumentInfo = documentFetch.map((doc) => {
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

  const [formError, setFormError] = useState({
    abasayanCause: '',
  });

  const [abasayanCauses, setAbasayanCauses] = useState('');

  let handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'abasayanCause':
        if (value == 0) {
          setFormError({
            ...formError,
            abasayanCause: 'অবসায়ন প্রদানের কারন নির্বাচন করুন',
          });
        } else {
          setAbasayanCauses(value);
          setFormError({
            ...formError,
            abasayanCause: '',
          });
        }
        break;
    }
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let abasayanData;

    const current = new Date();
    const currentDate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    let payload = {
      serviceName: 'abasayan',
      samityId: samityId,
      data: {
        documentInfo: buildDocumentPayload(documentList),
        content: unescape(allcontent),
        applyDate: currentDate,
        cause: abasayanCauses ? abasayanCauses : '',
        samityInfo: {
          samityId: samityId,
          samityCode: samityInfo?.samityCode,
          samityName: samityInfo?.samityName,
          samityLevel: samityLevel,
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
      if (update) {
        const abasayanData = await axios.put(AbasayanSubmitApi + '/' + appId, payload, config);
        NotificationManager.success(abasayanData.data.message, '', 5000);
        setUpdate(false);
        clearState();
        router.push({ pathname: '/coop/abasayan' });
      } else {
        abasayanData = await axios.post(AbasayanSubmitApi, payload, config);
        NotificationManager.success(abasayanData.data.message, '', 5000);
        clearState();
        setLoadingDataSaveUpdate(false);
        router.push({ pathname: '/coop/abasayan' });
      }
      clearState();
      setLoadingDataSaveUpdate(false);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  useEffect(() => {
    appnDataInfo(router.query.id);
  }, [router.query.id]);

  const appnDataInfo = async (applicationId) => {
    if (applicationId) {
      try {
        const applicationInfoGetData = await axios.get(applicationGetById + applicationId, config);
        const applicationAllData = applicationInfoGetData.data.data[0];
        setAllcontent(applicationAllData.data.content);
        setDocumentFetch(applicationAllData.data.documentInfo);

        let newEditArray = [];
        let docData = applicationAllData?.data?.documentInfo;
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
        setUpdate(true);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  return (
    <Fragment>
      {loadData ? (
        <Loader />
      ) : (
        <Fragment>
          <Grid container>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              {userData?.type == 'user' ? (
                <>
                  <Grid container>
                    {/* <Grid item lg={8} md={8} xs={12} sm={12}>
                      <SubHeading>{titleBo}</SubHeading>
                    </Grid> */}
                    <Grid item lg={6} md={6} xs={12} sm={12} p={1}>
                      <TextField
                        fullWidth
                        label={RequiredFile('অবসায়ন প্রদানের কারন')}
                        name="abasayanCause"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={abasayanCauses || 0}
                        variant="outlined"
                        size="small"
                        error={formError.abasayanCause ? true : false}
                        helperText={formError.abasayanCause}
                      >
                        <>
                          <option value={0}>- নির্বাচন করুন -</option>
                          {abaCause.map((option, i) => (
                            <option key={i} value={option.id}>
                              {option.text}
                            </option>
                          ))}
                        </>
                      </TextField>
                    </Grid>
                  </Grid>
                </>
              ) : (
                // <SubHeading>{title}</SubHeading>
                ''
              )}
            </Grid>
            <Grid container pb={2}>
              {userData?.type == 'user' ? (
                <>
                  <Grid item lg={4} md={4} xs={12} sm={12} pb={2}></Grid>
                </>
              ) : (
                ''
              )}

              <Grid item lg={12} md={12} xs={12} sm={12}>
                <Box>
                  <ReactQuill theme="snow" value={allcontent} onChange={setAllcontent} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
          <DynamicDocSectionContent
            documentList={documentList}
            documentType={documentType}
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
          <span style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>{formErrors.docError}</span>
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
                {appId ? 'হালনাগাদ হচ্ছে.......' : 'সংরক্ষন করা হচ্ছে...'}
              </LoadingButton>
            ) : (
              <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
                {' '}
                {appId ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
              </Button>
            )}
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Abasayan;
