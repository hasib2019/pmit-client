
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Clear from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Divider,
  Grid,
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
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import ReactQuillEditor from 'service/ReactQuillEditor';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { inputField, inputRadioGroup } from 'service/fromInput';
import { engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import Swal from 'sweetalert2';
import { unescape } from 'underscore';
import { createDocMapping, getAllDocTypeApi } from '../../../../url/coop/BackOfficeApi';

const DocMapping = () => {
  const token = localStorageData('token');
  const config = localStorageData('config');
  const userData = tokenData(token);
  const [docType, setDocType] = useState([]);
  const [allcontantPrimary, setAllcontantPrimary] = useState('');
  const [allcontantCentral, setAllcontantCentral] = useState('');
  const [allcontantNational, setAllcontantNational] = useState('');
  const [getAllDocData, setGetAllDocData] = useState([]);

  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const pageType = [
    {
      type: 1,
      typeName: 'সমিতি',
    },
    {
      type: 2,
      typeName: 'মেম্বার',
    },
  ];
  const [mappingData, setMappingData] = useState({
    typeName: '',
    samityTypeCode: '',
    id: '',
    update: false,
  });
  const [pageMappingData, setPageMappingData] = useState([
    {
      type: '',
      docTypeId: '',
      isMandatory: '',
      samityLevel: 'P',
    },
  ]);
  const [pageMappingDataCentral, setPageMappingDataCentral] = useState([
    {
      type: '',
      docTypeId: '',
      isMandatory: '',
      samityLevel: 'C',
    },
  ]);
  const [pageMappingDataNational, setPageMappingDataNational] = useState([
    {
      type: '',
      docTypeId: '',
      isMandatory: '',
      samityLevel: 'N',
    },
  ]);

  const addDocMap = (type) => {
    switch (type) {
      case 'primary':
        if (mappingData.update) {
          setPageMappingData([
            ...pageMappingData,
            {
              type: null,
              docTypeId: null,
              isMandatory: null,
              samityLevel: 'P',
              id: 0,
            },
          ]);
        } else {
          setPageMappingData([
            ...pageMappingData,
            {
              type: '',
              docTypeId: '',
              isMandatory: '',
              samityLevel: 'P',
            },
          ]);
        }
        break;
      case 'cantral':
        if (mappingData.update) {
          setPageMappingDataCentral([
            ...pageMappingDataCentral,
            {
              type: null,
              docTypeId: null,
              isMandatory: null,
              samityLevel: 'C',
              id: 0,
            },
          ]);
        } else {
          setPageMappingDataCentral([
            ...pageMappingDataCentral,
            {
              type: '',
              docTypeId: '',
              isMandatory: '',
              samityLevel: 'C',
            },
          ]);
        }
        break;
      case 'national':
        if (mappingData.update) {
          setPageMappingDataNational([
            ...pageMappingDataNational,
            {
              type: null,
              docTypeId: null,
              isMandatory: null,
              samityLevel: 'N',
              id: 0,
            },
          ]);
        } else {
          setPageMappingDataNational([
            ...pageMappingDataNational,
            {
              type: '',
              docTypeId: '',
              isMandatory: '',
              samityLevel: 'N',
            },
          ]);
        }
        break;
    }
  };

  const handleRemove = async (e, index, id, type) => {
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
            axios.delete(createDocMapping + '/' + id, config).then((response) => {
              if (response.status === 200) {
                if (response.status === 200) {
                  Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                  if (type == 'primary') {
                    let list = [...pageMappingData];
                    list.splice(index, 1);
                    setPageMappingData(list);
                  } else if (type == 'cantral') {
                    let list = [...pageMappingDataCentral];
                    list.splice(index, 1);
                    setPageMappingDataCentral(list);
                  } else if (type == 'national') {
                    let list = [...pageMappingDataNational];
                    list.splice(index, 1);
                    setPageMappingDataNational(list);
                  }
                } else {
                  Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                  // getCoopInfoEdit();
                }
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                // getCoopInfoEdit();
              }
            });
          }
        });
        // getCoopInfoEdit();
      } catch (error) {
        errorHandler(error);
      }
    } else {
      if (type == 'primary') {
        let list = [...pageMappingData];
        list.splice(index, 1);
        setPageMappingData(list);
      } else if (type == 'cantral') {
        let list = [...pageMappingDataCentral];
        list.splice(index, 1);
        setPageMappingDataCentral(list);
      } else if (type == 'national') {
        let list = [...pageMappingDataNational];
        list.splice(index, 1);
        setPageMappingDataNational(list);
      }
    }
  };

  useEffect(() => {
    getAllDocType();
    getAllDocMapping();
  }, []);

  const getAllDocType = async () => {
    try {
      const docTypeGet = await axios.get(getAllDocTypeApi, config);
      setDocType(docTypeGet.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getAllDocMapping = async () => {
    try {
      const getData = await axios.get(createDocMapping, config);
      let data = getData.data.data;
      let newData = data.filter((row) => row.samityTypeInfo.doptorId == userData.doptorId);
      var obj = [...newData];
      obj.sort((a, b) => a.samityTypeInfo.id - b.samityTypeInfo.id);
      setGetAllDocData(obj);
    } catch (error) {
      errorHandler(error);
    }
  };

  const clearFrom = () => {
    setPageMappingData([
      {
        type: '',
        docTypeId: '',
        isMandatory: '',
      },
    ]);
    setAllcontantCentral('');
    setAllcontantPrimary('');
    setAllcontantNational('');
    setLoadingDataSaveUpdate(false);
    setMappingData({
      typeName: '',
      samityTypeCode: '',
      isMandatory: '',
      id: '',
      update: false,
    });
  };

  const closeFrom = () => {
    setIsSamityOpen(false);
    setPageMappingData([
      {
        type: '',
        docTypeId: '',
        isMandatory: '',
      },
    ]);
    setAllcontantCentral('');
    setAllcontantPrimary('');
    setAllcontantNational('');
    setLoadingDataSaveUpdate(false);
    setMappingData({
      typeName: '',
      samityTypeCode: '',
      isMandatory: '',
      id: '',
      update: false,
    });
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);

    let payload, createDocMappingData, updatePayload;
    payload = {
      samityTypeInfo: {
        typeName: mappingData.typeName,
        doptorId: userData.doptorId,
        samityTypeCode: mappingData.samityTypeCode,
        goal: [
          {
            goal: allcontantPrimary,
            samityLevel: 'P',
          },
          {
            goal: allcontantCentral,
            samityLevel: 'C',
          },
          {
            goal: allcontantNational,
            samityLevel: 'N',
          },
        ],
      },
      docMappingInfo: [...pageMappingData, ...pageMappingDataCentral, ...pageMappingDataNational],
    };

    updatePayload = {
      samityTypeInfo: {
        typeName: mappingData.typeName,
        id: mappingData.id,
        goal: [
          {
            goal: allcontantPrimary,
            samityLevel: 'P',
          },
          {
            goal: allcontantCentral,
            samityLevel: 'C',
          },
          {
            goal: allcontantNational,
            samityLevel: 'N',
          },
        ],
      },
      docMappingInfo: [...pageMappingData, ...pageMappingDataCentral, ...pageMappingDataNational],
    };
    try {
      if (mappingData.update) {
        createDocMappingData = await axios.put(createDocMapping, updatePayload, config);
      } else {
        createDocMappingData = await axios.post(createDocMapping, payload, config);
      }
      setIsSamityOpen(false);
      setPageMappingData([
        {
          type: '',
          docTypeId: '',
          isMandatory: '',
        },
      ]);
      getAllDocMapping();
      setAllcontantCentral('');
      setAllcontantPrimary('');
      setAllcontantNational('');
      setLoadingDataSaveUpdate(false);
      setMappingData({
        typeName: '',
        samityTypeCode: '',
        isMandatory: '',
        id: '',
        update: false,
      });
      NotificationManager.success(createDocMappingData.data.message, '', 5000);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  // const handleEditorChangePrimary = (e) => {
  //   setAllcontantPrimary(e.target.getContent());
  // };

  // const handleEditorChangeCentral = (e) => {
  //   setAllcontantCentral(e.target.getContent());
  // };

  // const handleEditorChangeNational = (e) => {
  //   setAllcontantNational(e.target.getContent());
  // };

  const handleChange = (e) => {
    setMappingData({
      ...mappingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDocMap = (e, index, type) => {
    const { name, value } = e.target;
    let list, cantral, national;
    switch (type) {
      case 'primary':
        list = [...pageMappingData];
        if (name == 'type') {
          list[index][name] = value == 1 ? 'S' : value == 2 ? 'M' : '';
        }
        if (name == 'docTypeId') {
          list[index][name] = parseInt(value);
        }
        if (name == 'isMandatory') {
          list[index][name] = value;
        }
        setPageMappingData(list);
        break;
      case 'cantral':
        cantral = [...pageMappingDataCentral];
        if (name == 'type') {
          cantral[index][name] = value == 1 ? 'S' : value == 2 ? 'M' : '';
        }
        if (name == 'docTypeId') {
          cantral[index][name] = parseInt(value);
        }
        if (name == 'isMandatory') {
          cantral[index][name] = value;
        }
        setPageMappingDataCentral(cantral);
        break;
      case 'national':
        national = [...pageMappingDataNational];
        if (name == 'type') {
          national[index][name] = value == 1 ? 'S' : value == 2 ? 'M' : '';
        }
        if (name == 'docTypeId') {
          national[index][name] = parseInt(value);
        }
        if (name == 'isMandatory') {
          national[index][name] = value;
        }
        setPageMappingDataNational(national);
        break;
    }
  };

  const onEdit = (row) => {
    const id = row?.samityTypeInfo?.id;
    const typeName = row?.samityTypeInfo?.typeName;
    const goal = row?.samityTypeInfo?.goal;
    const docMappingInfo = row?.docMappingInfo;
    const samityTypeCode = row?.samityTypeInfo?.samityTypeCode;

    setMappingData({
      typeName,
      samityTypeCode,
      id,
      update: true,
    });
    // setPageMappingData(docMappingInfo);
    let primary = docMappingInfo.filter((row) => {
      return row?.samityLevel == 'P';
    });

    let central = docMappingInfo.filter((row) => {
      return row?.samityLevel == 'C';
    });
    let national = docMappingInfo.filter((row) => {
      return row?.samityLevel == 'N';
    });
    setPageMappingData(primary);
    setPageMappingDataCentral(central);
    setPageMappingDataNational(national);

    setIsSamityOpen(true);
    if (goal) {
      for (const element of goal) {
        if (element?.samityLevel == 'P') {
          setAllcontantPrimary(element?.goal);
        } else if (element?.samityLevel == 'C') {
          setAllcontantCentral(element?.goal);
        } else if (element?.samityLevel == 'N') {
          setAllcontantNational(element?.goal);
        }
      }
    }
  };

  const [isSamityOpen, setIsSamityOpen] = useState(false);
  const addNewSamity = () => {
    setIsSamityOpen(true);
  };
  return (
    <>
      {isSamityOpen && (
        <Grid container>
          <Grid item xs={12}>
            <Grid container className="section" spacing={1.5}>
              {inputField(
                RequiredFile('সমিতির ধরনের নাম'),
                'typeName',
                'text',
                handleChange,
                mappingData.typeName,
                'small',
                6,
                6,
                6,
                6,
              )}
              {inputField(
                RequiredFile('সমিতি ধরন কোড'),
                'samityTypeCode',
                'text',
                handleChange,
                mappingData.samityTypeCode,
                'small',
                6,
                6,
                6,
                6,
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className="section">
              <Grid item lg={12} md={12} xs={12}>
                <Box className="editor-box">
                  <SubHeading>প্রাথমিক সমিতি</SubHeading>
                  {/* {tinyTextEditor(
                    allcontantPrimary,
                    handleEditorChangePrimary,
                    12,
                    12,
                    12,
                    12,
                    "লক্ষ্য ও উদ্দেশ্য"
                  )} */}
                  <ReactQuillEditor
                    {...{
                      value: allcontantPrimary,
                      setValue: setAllcontantPrimary,
                      xl: 12,
                      lg: 12,
                      md: 12,
                      xs: 12,
                      title: 'লক্ষ্য ও উদ্দেশ্য',
                    }}
                  />
                  <Grid container sx={{ padding: '20px 10px' }}>
                    <Box
                      style={{
                        width: '100%',
                        dispaly: 'flex',
                        justyfContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span className="doc-title">ডকুমেন্ট সেটআপ :</span>
                    </Box>
                    <Grid container spacing={1.8}>
                      {pageMappingData.map((row, i) => (
                        <>
                          <FromControlJSON
                            arr={[
                              {
                                labelName: RequiredFile('ডকুমেন্টের ব্যবহার'),
                                name: 'type',
                                onChange: (e) => handleChangeDocMap(e, i, 'primary'),
                                value: row.type == 'S' ? 1 : row.type == 'M' ? 2 : '',
                                size: 'small',
                                type: 'text',
                                viewType: 'select',
                                optionData: pageType,
                                optionValue: 'type',
                                optionName: 'typeName',
                                xl: 4,
                                lg: 4,
                                md: 4,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                customStyle: {},
                              },
                              {
                                labelName: RequiredFile('ডকুমেন্টের ধরন'),
                                name: 'docTypeId',
                                onChange: (e) => handleChangeDocMap(e, i, 'primary'),
                                value: row.docTypeId,
                                size: 'small',
                                type: 'text',
                                viewType: 'select',
                                optionData: docType,
                                optionValue: 'id',
                                optionName: 'docTypeDesc',
                                xl: 4,
                                lg: 4,
                                md: 4,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                customStyle: {},
                              },
                            ]}
                          />
                          {inputRadioGroup(
                            'isMandatory',
                            (e) => handleChangeDocMap(e, i, 'primary'),
                            row.isMandatory,
                            [
                              {
                                value: 'Y',
                                color: '#ed6c02',
                                rColor: 'warning',
                                label: 'বাধ্যতামূলক',
                              },
                              {
                                value: 'N',
                                color: '#007bff',
                                rcolor: 'primary',
                                label: 'ঐচ্ছিক',
                              },
                            ],
                            3,
                            3,
                            3,
                            12,
                            false,
                            row.isMandatory,
                            '',
                          )}
                          <Grid
                            item
                            sx={{
                              display: 'flex',
                              jusityContent: 'flex-end',
                              alignItems: 'center',
                            }}
                            key={i}
                          >
                            <Button
                              variant="outlined"
                              disabled={pageMappingData.length > 1 ? false : true}
                              color="error"
                              onClick={(e) => handleRemove(e, i, row.id, 'primary')}
                              size="small"
                              className="btn-close"
                            >
                              <Clear />
                            </Button>
                          </Grid>
                        </>
                      ))}
                    </Grid>
                    <Grid item>
                      <Button className="btn btn-add btn-add-lg" onClick={() => addDocMap('primary')} size="small">
                        <span>একাধিক ডকুমেন্ট সেটআপ সংযুক্ত করুন </span>
                        <AddCircleIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item lg={12} md={12} xs={12} mt={2}>
                <Box className="editor-box">
                  <SubHeading>কেন্দ্রিয় সমিতি</SubHeading>
                  {/* {tinyTextEditor(
                    allcontantCentral,
                    handleEditorChangeCentral,
                    12,
                    12,
                    12,
                    12,
                    "লক্ষ্য ও উদ্দেশ্য"
                  )} */}
                  <ReactQuillEditor
                    {...{
                      value: allcontantCentral,
                      setValue: setAllcontantCentral,
                      xl: 12,
                      lg: 12,
                      md: 12,
                      xs: 12,
                      title: 'লক্ষ্য ও উদ্দেশ্য',
                    }}
                  />
                  <Grid container sx={{ padding: '20px 10px' }}>
                    <Box
                      style={{
                        width: '100%',
                        dispaly: 'flex',
                        justyfContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span className="doc-title">ডকুমেন্ট সেটআপ :</span>
                    </Box>
                    <Grid container spacing={1.8}>
                      {pageMappingDataCentral.map((row, i) => (
                        <>
                          <FromControlJSON
                            arr={[
                              {
                                labelName: RequiredFile('ডকুমেন্টের ব্যবহার'),
                                name: 'type',
                                onChange: (e) => handleChangeDocMap(e, i, 'cantral'),
                                value: row.type == 'S' ? 1 : row.type == 'M' ? 2 : '',
                                size: 'small',
                                type: 'text',
                                viewType: 'select',
                                optionData: pageType,
                                optionValue: 'type',
                                optionName: 'typeName',
                                xl: 4,
                                lg: 4,
                                md: 4,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                customStyle: {},
                              },
                              {
                                labelName: RequiredFile('ডকুমেন্টের ধরন'),
                                name: 'docTypeId',
                                onChange: (e) => handleChangeDocMap(e, i, 'cantral'),
                                value: row.docTypeId,
                                size: 'small',
                                type: 'text',
                                viewType: 'select',
                                optionData: docType,
                                optionValue: 'id',
                                optionName: 'docTypeDesc',
                                xl: 4,
                                lg: 4,
                                md: 4,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                customStyle: {},
                              },
                            ]}
                          />
                          {inputRadioGroup(
                            'isMandatory',
                            (e) => handleChangeDocMap(e, i, 'cantral'),
                            row.isMandatory,
                            [
                              {
                                value: 'Y',
                                color: '#ed6c02',
                                rColor: 'warning',
                                label: 'বাধ্যতামূলক',
                              },
                              {
                                value: 'N',
                                color: '#007bff',
                                rcolor: 'primary',
                                label: 'ঐচ্ছিক',
                              },
                            ],
                            3,
                            3,
                            3,
                            12,
                            false,
                            row.isMandatory,
                            '',
                          )}
                          <Grid
                            item
                            sx={{
                              display: 'flex',
                              jusityContent: 'flex-end',
                              alignItems: 'center',
                            }}
                            key={i}
                          >
                            <Button
                              variant="outlined"
                              disabled={pageMappingDataCentral.length > 1 ? false : true}
                              color="error"
                              onClick={(e) => handleRemove(e, i, row.id, 'cantral')}
                              size="small"
                              className="btn-close"
                            >
                              <Clear />
                            </Button>
                          </Grid>
                        </>
                      ))}
                    </Grid>
                    <Grid item>
                      <Button className="btn btn-add btn-add-lg" onClick={() => addDocMap('cantral')} size="small">
                        <span>একাধিক ডকুমেন্ট সেটআপ সংযুক্ত করুন </span>
                        <AddCircleIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item lg={12} md={12} xs={12} mt={2}>
                <Box className="editor-box">
                  <SubHeading>জাতীয় সমিতি</SubHeading>
                  {/* {tinyTextEditor(
                    allcontantNational,
                    handleEditorChangeNational,
                    12,
                    12,
                    12,
                    12,
                    "লক্ষ্য ও উদ্দেশ্য"
                  )} */}
                  <ReactQuillEditor
                    {...{
                      value: allcontantNational,
                      setValue: setAllcontantNational,
                      xl: 12,
                      lg: 12,
                      md: 12,
                      xs: 12,
                      title: 'লক্ষ্য ও উদ্দেশ্য',
                    }}
                  />
                  <Grid container sx={{ padding: '20px 10px' }}>
                    <Box
                      style={{
                        width: '100%',
                        dispaly: 'flex',
                        justyfContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span className="doc-title">ডকুমেন্ট সেটআপ :</span>
                    </Box>
                    <Grid container spacing={1.8}>
                      {pageMappingDataNational.map((row, i) => (
                        <>
                          <FromControlJSON
                            arr={[
                              {
                                labelName: RequiredFile('ডকুমেন্টের ব্যবহার'),
                                name: 'type',
                                onChange: (e) => handleChangeDocMap(e, i, 'national'),
                                value: row.type == 'S' ? 1 : row.type == 'M' ? 2 : '',
                                size: 'small',
                                type: 'text',
                                viewType: 'select',
                                optionData: pageType,
                                optionValue: 'type',
                                optionName: 'typeName',
                                xl: 4,
                                lg: 4,
                                md: 4,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                customStyle: {},
                              },
                              {
                                labelName: RequiredFile('ডকুমেন্টের ধরন'),
                                name: 'docTypeId',
                                onChange: (e) => handleChangeDocMap(e, i, 'national'),
                                value: row.docTypeId,
                                size: 'small',
                                type: 'text',
                                viewType: 'select',
                                optionData: docType,
                                optionValue: 'id',
                                optionName: 'docTypeDesc',
                                xl: 4,
                                lg: 4,
                                md: 4,
                                xs: 12,
                                isDisabled: false,
                                customClass: '',
                                customStyle: {},
                              },
                            ]}
                          />
                          {inputRadioGroup(
                            'isMandatory',
                            (e) => handleChangeDocMap(e, i, 'national'),
                            row.isMandatory,
                            [
                              {
                                value: 'Y',
                                color: '#ed6c02',
                                rColor: 'warning',
                                label: 'বাধ্যতামূলক',
                              },
                              {
                                value: 'N',
                                color: '#007bff',
                                rcolor: 'primary',
                                label: 'ঐচ্ছিক',
                              },
                            ],
                            3,
                            3,
                            3,
                            12,
                            false,
                            row.isMandatory,
                            '',
                          )}
                          <Grid
                            item
                            sx={{
                              display: 'flex',
                              jusityContent: 'flex-end',
                              alignItems: 'center',
                            }}
                            key={i}
                          >
                            <Button
                              variant="outlined"
                              disabled={pageMappingDataNational.length > 1 ? false : true}
                              color="error"
                              onClick={(e) => handleRemove(e, i, row.id, 'national')}
                              size="small"
                              className="btn-close"
                            >
                              <Clear />
                            </Button>
                          </Grid>
                        </>
                      ))}
                    </Grid>
                    <Grid item>
                      <Button className="btn btn-add btn-add-lg" onClick={() => addDocMap('national')} size="small">
                        <span>একাধিক ডকুমেন্ট সেটআপ সংযুক্ত করুন </span>
                        <AddCircleIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Divider />

      <Grid container className="btn-container">
        {isSamityOpen ? (
          loadingDataSaveUpdate ? (
            <LoadingButton
              loading
              sx={{ backgroundColor: 'red', mr: 1 }}
              loadingPosition="start"
              startIcon={<SaveOutlinedIcon />}
              variant="contained"
            >
              {mappingData.update ? 'হালনাগাদ করা হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
            </LoadingButton>
          ) : (
            <>
              <Tooltip title="সংরক্ষন করুন">
                <Button className="btn btn-save" startIcon={<SaveOutlinedIcon />} onClick={onsubmit}>
                  {' '}
                  {mappingData.update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
                </Button>
              </Tooltip>
              <Tooltip title="মুছে ফেলুন" sx={{ float: 'right' }}>
                <Button className="btn btn-warning" onClick={clearFrom} startIcon={<SubtitlesOffIcon />}>
                  {' '}
                  মুছে ফেলুন
                </Button>
              </Tooltip>
              <Tooltip title="বন্ধ করুন" sx={{ float: 'right' }}>
                <Button className="btn btn-delete" onClick={closeFrom} startIcon={<HighlightOffIcon />}>
                  {' '}
                  বন্ধ করুন
                </Button>
              </Tooltip>
            </>
          )
        ) : (
          ''
        )}
        {isSamityOpen ? (
          ''
        ) : (
          <Tooltip title="সমিতির ধরন যোগ করুন">
            <Button
              className="btn btn-primary"
              // startIcon={}
              onClick={addNewSamity}
            >
              {'সমিতির ধরন যোগ করুন'}
              <AddIcon />
            </Button>
          </Tooltip>
        )}
      </Grid>
      {!isSamityOpen && (
        <Grid container className="section">
          <Grid item xs={12}>
            <Box>
              <SubHeading>সমবায় সমিতির ডকুমেন্ট সেটআপ</SubHeading>
              <TableContainer className="table-container">
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                  stickyHeader
                // aria-label="sticky table"
                >
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center' }} width="1%">
                        ক্রমিক নং
                      </TableCell>
                      <TableCell width="10%">সমিতির ধরন</TableCell>
                      <TableCell width="10%">সমিতির কোড</TableCell>
                      <TableCell>সমিতির লক্ষ্য/উদ্দেশ্য</TableCell>
                      <TableCell sx={{ textAlign: 'center' }} width="1%">
                        সম্পাদনা
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="doc-map">
                    {getAllDocData?.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + (i + 1) + '')}</TableCell>
                        <TableCell>{row?.samityTypeInfo?.typeName}</TableCell>
                        <TableCell>{engToBang(row?.samityTypeInfo?.samityTypeCode)}</TableCell>
                        <TableCell>
                          {row?.samityTypeInfo?.goal?.map((rows, index) => (
                            <div key={index}>
                              <div
                                style={{
                                  fontSize: '14px',
                                  color: 'gray',
                                  borderBottom: '1px solid',
                                }}
                              >
                                {rows?.samityLevel == 'P'
                                  ? 'প্রাইমারী সমবায় সমিতির লক্ষ্য ও উদ্দেশ্য'
                                  : rows?.samityLevel == 'C'
                                    ? 'কেন্দ্রীয় সমবায় সমিতির লক্ষ্য ও উদ্দেশ্য'
                                    : rows.samityLevel == 'N'
                                      ? 'জাতীয় সমবায় সমিতির লক্ষ্য ও উদ্দেশ্য'
                                      : ''}
                              </div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: unescape(rows?.goal),
                                }}
                              ></div>
                            </div>
                          ))}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button className="table-icon edit" onClick={() => onEdit(row)}>
                            <EditIcon sx={{ display: 'block' }} />
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
      )}
    </>
  );
};

export default DocMapping;
