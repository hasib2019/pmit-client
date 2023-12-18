/* eslint-disable no-dupe-else-if */
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import fileCheck from 'components/shared/others/DocImage/FileUploadTypeCheck';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import ZoomImage from 'service/ZoomImage';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import { ContentParamInfo, PageData, PageInfo } from '../../../url/coop/PortalApiList';

const DynamicDocSectionHeader = dynamic(() => import('components/shared/others/DocImage/DocSectionHeader'), {
  loading: () => <Loader />,
});
const DynamicDocSectionContent = dynamic(() => import('components/shared/others/DocImage/DocContent'), {
  loading: () => <Loader />,
});

import Loader from 'components/Loader';
import AllApprovedSamity from 'components/utils/coop/AllApprovedSamity';
import 'react-quill/dist/quill.snow.css';
import { unescape } from 'underscore';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function createMarkup(value) {
  return {
    __html: value,
  };
}

const WebSetup = () => {
  const token = localStorageData('token');
  const config = localStorageData('config');
  const userData = tokenData(token);

  const [getSamityId, setGetSamityId] = useState(localStorageData('reportsIdPer'));

  const [getSamityLevel, setGetSamityLevel] = useState('');

  const [allcontent, setAllcontent] = useState('');
  const [ids, setIds] = useState('');
  const [pages, setPages] = useState([]);
  const [pageValue, setPageValue] = useState([]);
  const [contents, setContents] = useState([]);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [dropvalue, setDropvalue] = useState({
    pageId: 0,
    contentId: 0,
  });
  const [socialLink, setSocialLink] = useState({
    facebook: '',
    twitter: '',
    skype: '',
    messanger: '',
  });

  useEffect(() => {
    getPage();
  }, []);

  useEffect(() => {
    contentPage();
  }, [dropvalue]);

  useEffect(() => {
    getPageData(getSamityId);
  }, [getSamityId]);

  let getPage = async () => {
    try {
      const pageInfoData = await axios.get(PageInfo + '?isPagination=false&status=true', config);
      let pageList = pageInfoData.data.data;
      let shortPageList = pageList.sort((a, b) => {
        return a.id - b.id;
      });
      setPages(shortPageList);
    } catch (error) {
      errorHandler(error);
    }
  };

  let contentPage = async () => {
    try {
      if (dropvalue.pageId > 0) {
        const contentData = await axios.get(ContentParamInfo + dropvalue.pageId, config);
        let contentList = contentData.data.data;
        let shortContentList = contentList.sort((a, b) => {
          return a.id - b.id;
        });
        setContents(shortContentList);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  let getPageData = async (id) => {
    try {
      if (id) {
        const pageDataValue = await axios.get(PageData + id, config);
        let pageListValue = pageDataValue.data.data;
        let shortPageListValue = pageListValue.sort((a, b) => {
          return a.id - b.id;
        });
        setPageValue(shortPageListValue);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name == 'pageId') {
      setDropvalue({
        [e.target.name]: parseInt(e.target.value),
      });
    } else {
      setDropvalue({
        ...dropvalue,
        [e.target.name]: parseInt(e.target.value),
      });
    }
  };

  const handleChangeSocial = (e) => {
    setSocialLink({
      ...socialLink,
      [e.target.name]: e.target.value,
    });
  };

  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);

  const [documentList, setDocumentList] = useState([
    {
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',
      update: false,
    },
  ]);

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        documentPictureFront: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        update: false,
      },
    ]);
    setFormErrorsInDocuments([
      ...formErrorsInDocuments,
      {
        documentPictureFrontFile: '',
      },
    ]);
  };

  const handleDocumentList = (e, index) => {
    const { name, value } = e.target;
    const list = [...documentList];
    list[index][name] = value;
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

  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);
    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
  };

  const removeDocumentImageFront = (event, index) => {
    const list = [...documentList];
    list[index]['documentPictureFront'] = '';
    list[index]['documentPictureFrontType'] = '';
    setDocumentList(list);
  };
  const onEdit = (id, pId, cId, content, attachment) => {
    setIds(id);

    setDropvalue({
      pageId: pId,
      contentId: cId,
    });

    setAllcontent(unescape(content));

    let newEditArray = [];
    let newEditLength = attachment?.length;
    for (let i = 0; i < newEditLength; i++) {
      newEditArray.push({
        base64Image: attachment[i]?.fileNameUrl,
        name: attachment[i]?.fileName,
        oldFileName: attachment[i].fileName,
        update: true,
      });
    }
    setDocumentList(newEditArray);
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let payload, PageDetailsData;
    let newDocumentArray = [];
    let newLength = documentList.length;
    for (let i = 0; i < newLength; i++) {
      newDocumentArray.push({
        ...(!documentList[i].update && {
          name: documentList[i].documentPictureFrontFile.name,
        }),
        ...(!documentList[i].update && {
          base64Image: documentList[i].documentPictureFront,
        }),
        ...(documentList[i].update && { name: documentList[i].name }),
        ...(!documentList[i].update && {
          oldFileName: documentList[i].oldFileName,
        }),
      });
    }

    /////////// Social Link ////////////////
    if (parseInt(dropvalue.pageId) == 1 && parseInt(dropvalue.contentId) == 4) {
      payload = {
        pageId: parseInt(dropvalue.pageId),
        contentId: parseInt(dropvalue.contentId) ? parseInt(dropvalue.contentId) : 0,
        commonData: socialLink,
      };
    } else {
      //////////// Picturs ////////////////
      if (
        parseInt(dropvalue.contentId) == 1 ||
        parseInt(dropvalue.contentId) == 2 ||
        parseInt(dropvalue.contentId) == 5
      ) {
        payload = {
          samityId: parseInt(getSamityId),
          pageId: parseInt(dropvalue.pageId),
          contentId: parseInt(dropvalue.contentId) ? parseInt(dropvalue.contentId) : 0,
          documents: newDocumentArray,
        };
      }
      ////////////Ours, Services, Ask////////////
      else if (
        parseInt(dropvalue.pageId) == 2 ||
        parseInt(dropvalue.pageId) == 8 ||
        parseInt(dropvalue.contentId) == 3
      ) {
        payload = {
          samityId: parseInt(getSamityId),
          pageId: parseInt(dropvalue.pageId),
          contentId: parseInt(dropvalue.contentId) ? parseInt(dropvalue.contentId) : 0,
          content: unescape(allcontent),
        };
      }
      ///////////Projects////////////////////
      else if (parseInt(dropvalue.pageId) == 4 || parseInt(dropvalue.pageId) == 5) {
        payload = {
          samityId: parseInt(getSamityId),
          pageId: parseInt(dropvalue.pageId),
          contentId: parseInt(dropvalue.contentId) ? parseInt(dropvalue.contentId) : 0,
          content: unescape(allcontent),
          documents: newDocumentArray,
        };
      } else {
        payload = {
          samityId: parseInt(getSamityId),
          pageId: dropvalue.pageId ? parseInt(dropvalue.pageId) : null,
        };
      }
    }

    const idInput = ids;

    try {
      //////////////Common Data Patch//////////////////
      if (parseInt(dropvalue.pageId) == 1 && parseInt(dropvalue.contentId) == 4) {
        PageDetailsData = await axios.patch(PageData + getSamityId, payload, config);
        NotificationManager.success(PageDetailsData.data.message, '', 5000);
      }
      //////////////Edit//////////////////
      else if (idInput) {
        let isDocumentValid;
        if (newDocumentArray.length > 0) {
          for (const element of newDocumentArray) {
            if (!element.name || element.base64Image == '') {
              isDocumentValid = false;
            } else {
              isDocumentValid = true;
            }
          }
        }
        if (payload.contentId == 5) {
          if (isDocumentValid) {
            PageDetailsData = await axios.put(PageData + idInput, payload, config);
            NotificationManager.success(PageDetailsData.data.message, '', 5000);
          } else {
            NotificationManager.error('ছবিসমূহ সংযুক্ত করুন', '', 5000);
          }
        } else {
          PageDetailsData = await axios.put(PageData + idInput, payload, config);
          NotificationManager.success(PageDetailsData.data.message, '', 5000);
        }
      }
      //////////////Save//////////////////
      else {
        let isDocumentValid;
        if (newDocumentArray.length > 0) {
          for (const element of newDocumentArray) {
            if (!element.name || element.base64Image == '') {
              isDocumentValid = false;
            } else {
              isDocumentValid = true;
            }
          }
        }
        let isArticleValue;
        if (allcontent.length > 0) {
          for (const element of allcontent) {
            if (!element.name == '') {
              isArticleValue = false;
            } else {
              isArticleValue = true;
            }
          }
        }
        if (payload.contentId == 1 || payload.contentId == 2 || payload.contentId == 5) {
          if (isDocumentValid) {
            PageDetailsData = await axios.post(PageData, payload, config);
          } else {
            if (payload.contentId == 1) {
              NotificationManager.error('লোগো সংযুক্ত করুন', '', 5000);
            } else if (payload.contentId == 2) {
              NotificationManager.error('ব্যানার সংযুক্ত করুন', '', 5000);
            } else {
              NotificationManager.error('ছবিসমূহ সংযুক্ত করুন', '', 5000);
            }
          }
        } else if (payload.pageId == 2 || payload.pageId == 8 || payload.contentId == 3) {
          if (isArticleValue && payload.content != '<p><br></p>') {
            PageDetailsData = await axios.post(PageData, payload, config);
          } else {
            if (payload.pageId == 2) {
              NotificationManager.error('আমাদের সম্পর্কে অনুচ্ছেদ সংযুক্ত করুন', '', 5000);
            } else if (payload.pageId == 8) {
              NotificationManager.error('সচরাচর জিঞ্জাসা অনুচ্ছেদ সংযুক্ত করুন', '', 5000);
            } else if (payload.contentId == 3) {
              NotificationManager.error('নোটিশ অনুচ্ছেদ সংযুক্ত করুন', '', 5000);
            } else {
              NotificationManager.error('অনুচ্ছেদ সংযুক্ত করুন', '', 5000);
            }
          }
        } else if (payload.pageId == 4 || payload.pageId == 5) {
          if ((isArticleValue && payload.content != '<p><br></p>') || isDocumentValid) {
            PageDetailsData = await axios.post(PageData, payload, config);
          } else {
            if (payload.pageId == 4) {
              NotificationManager.error('সেবাসমূহের ডকুমেন্ট অথবা অনুচ্ছেদ সংযুক্ত করুন', '', 5000);
            } else if (payload.pageId == 5) {
              NotificationManager.error('প্রকল্প / কর্মসূচী এর ডকুমেন্ট অথবা অনুচ্ছেদ সংযুক্ত করুন', '', 5000);
            } else {
              NotificationManager.error('ডকুমেন্ট অথবা অনুচ্ছেদ সংযুক্ত করুন', '', 5000);
            }
          }
        } else {
          PageDetailsData = await axios.post(PageData, payload, config);
        }
        NotificationManager.success(PageDetailsData.data.message, '', 5000);
      }

      setDropvalue({
        pageId: 0,
        contentId: 0,
      });
      setIds('');
      setAllcontent('');
      setDocumentList([
        {
          documentPictureFront: '',
          documentPictureFrontName: '',
          documentPictureFrontType: '',
          documentPictureFrontFile: '',
          update: false,
        },
      ]);
      contentPage();
      getPage();
      getPageData(getSamityId);
      setSocialLink({
        facebook: '',
        twitter: '',
        skype: '',
        messanger: '',
      });
      setLoadingDataSaveUpdate(false);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  // const handleApproveSamity = (e) => {
  //   const { name, value } = e.target;
  //   const data = JSON.parse(value);
  //   setGetSamityId(data.id);
  //   setGetSamityLevel(data.samityLevel);
  // };

  const handleApproveSamity = (value) => {
    if (value) {
      setGetSamityId(value.id);
      setGetSamityLevel(value.samityLevel);
    } else {
      setGetSamityId();
      setGetSamityLevel();
    }
  };

  const imageType = (imageName) => {
    const lastWord = imageName.split('.').pop();
    return lastWord;
  };

  return (
    <>
      <Grid container className="section">
        <Grid item xs={12}>
          <Grid container spacing={2.5} pb={2}>
            {userData?.type == 'user' ? (
              <AllApprovedSamity
                {...{
                  labelName: 'সমিতির নাম',
                  name: 'approveSamityName',
                  onChange: handleApproveSamity,
                  value: JSON.stringify({
                    id: getSamityId,
                    samityLevel: getSamityLevel,
                  }),
                  xl: 4,
                  lg: 4,
                  sm: 12,
                  xs: 12,
                  isDisabled: false,
                  customClass: '',
                  customStyle: {},
                }}
              />
            ) : (
              ''
            )}
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={RequiredFile('পেইজ নাম')}
                name="pageId"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={dropvalue.pageId ? dropvalue.pageId : 0}
                variant="outlined"
                size="small"
              >
                <option value={0}>- নির্বাচন করুন -</option>
                {pages.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.pageNameBn}
                  </option>
                ))}
              </TextField>
            </Grid>

            {dropvalue.pageId == 1 ? (
              <>
                <Grid item xl={4} lg={4} md={4} xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label={RequiredFile('কনটেন্ট নাম')}
                    name="contentId"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={dropvalue.contentId ? dropvalue.contentId : 0}
                    variant="outlined"
                    size="small"
                  >
                    <option value={0}>- নির্বাচন করুন -</option>
                    {contents.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.contentNameBn}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </>
            ) : (
              ''
            )}
          </Grid>
        </Grid>

        {dropvalue.contentId == 1 || dropvalue.contentId == 2 ? (
          <>
            <SubHeading>প্রয়োজনীয় ডকুমেন্ট</SubHeading>
            <DynamicDocSectionContent
              documentList={documentList}
              handleDocumentList={handleDocumentList}
              fileSelectedHandler={fileSelectedHandler}
              deleteDocumentList={deleteDocumentList}
              removeDocumentImageFront={removeDocumentImageFront}
              formErrorsInDocuments={formErrorsInDocuments}
            />
          </>
        ) : (
          ''
        )}

        {dropvalue.pageId == 2 || dropvalue.pageId == 8 || dropvalue.contentId == 3 ? (
          <>
            <Grid item lg={12} md={12} xs={7} sm={7}>
              <Box>
                <ReactQuill theme="snow" value={allcontent} onChange={setAllcontent} />
              </Box>
            </Grid>
          </>
        ) : (
          ''
        )}

        {dropvalue.contentId == 4 ? (
          <>
            <Grid container spacing={2.5}>
              <Grid item lg={6} md={6} xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="ফেইসবুক লিংক"
                  name="facebook"
                  onChange={handleChangeSocial}
                  value={socialLink.facebook}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item lg={6} md={6} xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="টুইটার লিংক"
                  name="twitter"
                  onChange={handleChangeSocial}
                  value={socialLink.twitter}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item lg={6} md={6} xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="স্কাইপি লিংক"
                  name="skype"
                  onChange={handleChangeSocial}
                  value={socialLink.skype}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item lg={6} md={6} xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="ম্যাসেন্জার লিংক"
                  name="messanger"
                  onChange={handleChangeSocial}
                  value={socialLink.messanger}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
            </Grid>
          </>
        ) : (
          ''
        )}

        {dropvalue.contentId == 5 ? (
          <>
            <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
            <Grid container>
              <Grid item md={12} sx={{ textAlign: 'center', fontSize: '20px' }} my={1}>
                একাধিক ডকুমেন্ট / ছবি যোগ করতে{' '}
                <span style={{ color: '#2e7d32' }} className={'textAnimation'}>
                  ( ডকুমেন্ট / ছবি যোগ করুন )
                </span>{' '}
                বাটন ক্লিক করুন
              </Grid>
            </Grid>
            <DynamicDocSectionContent
              documentList={documentList}
              handleDocumentList={handleDocumentList}
              fileSelectedHandler={fileSelectedHandler}
              deleteDocumentList={deleteDocumentList}
              removeDocumentImageFront={removeDocumentImageFront}
              formErrorsInDocuments={formErrorsInDocuments}
            />
          </>
        ) : (
          ''
        )}

        {dropvalue.pageId == 4 || dropvalue.pageId == 5 ? (
          <>
            <Grid item lg={12} md={12} xs={7} sm={7}>
              <Box>
                <ReactQuill theme="snow" value={allcontent} onChange={setAllcontent} />
              </Box>
            </Grid>

            <Grid container sx={{ marginTop: '10px' }}>
              <SubHeading>প্রয়োজনীয় ডকুমেন্ট</SubHeading>
            </Grid>
            <DynamicDocSectionContent
              documentList={documentList}
              handleDocumentList={handleDocumentList}
              addMoreDoc={addMoreDoc}
              fileSelectedHandler={fileSelectedHandler}
              deleteDocumentList={deleteDocumentList}
              removeDocumentImageFront={removeDocumentImageFront}
              formErrorsInDocuments={formErrorsInDocuments}
            />
          </>
        ) : (
          ''
        )}
      </Grid>
      <Grid container className="btn-container">
        {loadingDataSaveUpdate ? (
          <LoadingButton
            loading
            loadingPosition="start"
            sx={{ mr: 1 }}
            startIcon={<SaveOutlinedIcon />}
            variant="outlined"
          >
            &nbsp;&nbsp;{ids ? 'হালনাগাদ হচ্ছে.......' : 'সংরক্ষন করা হচ্ছে...'}
          </LoadingButton>
        ) : (
          <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {' '}
            {ids ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
          </Button>
        )}
      </Grid>
      <Grid container className="section">
        <Grid xs={12}>
          <SubHeading>সেটআপ তথ্যাদি</SubHeading>
          <TableContainer className="table-container">
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">ক্রমিক নং</TableCell>
                  <TableCell>পেইজ নাম</TableCell>
                  <TableCell>কনটেন্ট নাম</TableCell>
                  <TableCell>কনটেন্ট</TableCell>
                  <TableCell align="center">সংযুক্তি</TableCell>
                  <TableCell align="center">সম্পাদন</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageValue?.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row" sx={{ textAlign: 'center' }}>
                      {numberToWord('' + (i + 1) + '')}
                    </TableCell>
                    <TableCell scope="row">{row.pageNameBn}</TableCell>
                    <TableCell scope="row">{row.contentNameBn}</TableCell>
                    <TableCell scope="row">
                      <Tooltip
                        title={
                          <div className="tooltip-title">
                            <div dangerouslySetInnerHTML={createMarkup(row && unescape(row.content))} />
                          </div>
                        }
                        arrow
                      >
                        <span className="data data-html">
                          <div dangerouslySetInnerHTML={createMarkup(row && unescape(row.content))} />
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row" align="center">
                      {row?.attachment?.map((img, ind) => (
                        <>
                          <ZoomImage
                            src={img?.fileNameUrl}
                            imageStyle={{ width: '50px', height: '40px' }}
                            divStyle={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                            key={ind}
                            type={imageType(img?.fileName)}
                          />
                        </>
                      ))}
                    </TableCell>
                    <TableCell scope="row" align="center">
                      <EditIcon
                        className="table-icon edit"
                        onClick={() => onEdit(row.id, row.pageId, row.contentId, row.content, row.attachment)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default WebSetup;
