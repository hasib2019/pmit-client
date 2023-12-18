/**
 * @author Md Hasibuzzaman
 * @author2 Hrithik
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/06/08 10:13:48
 * @modify date 2022-06-20 10:13:48
 * @desc [description]
 */
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { inputDate } from 'service/fromInput';
import { numberToWord } from 'service/numberToWord';
import { steperFun } from 'service/steper';
import {
  CenNatSamityReg,
  CentralNationalSamityData,
  dynamicImage,
  isRequiredMemberPass,
} from '../../../../../url/coop/ApiList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Input = styled('input')({
  display: 'none',
});

const NationalMemberReg = () => {
  const router = useRouter();
  ///////////////////////////////////////*** page validation & localstorage data ***//////////////////////////////
  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    const samityLevel = JSON.parse(localStorage.getItem('samityLevel'))
      ? JSON.parse(localStorage.getItem('samityLevel'))
      : null;
    if (getId == null) {
      router.push({ pathname: '/coop/registration' });
    }
    if (samityLevel == null) {
      router.push({ pathname: '/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/registration' });
    }
  };
  const config = localStorageData('config');

  const getId = localStorageData('getSamityId');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [dataEmpty, setDataEmpty] = useState(true);
  ////////////////////////////////////////*** page validation & localstorage End***///////////////////////////////
  const [update, setUpdate] = useState(false);
  const [memberId, setMemberId] = useState('');
  //State for this component
  const [locale] = useState('bn');
  const [value, setValue] = useState(null);
  const [samityInfo, setSamityInfo] = useState({
    centralSamityId: '',
    centralSamityName: '',
    committeeSignatoryPerson: '',
    memberSamityName: '',
    refSamityId: '',
    samityCode: '',
    samityDetailsAddress: '',
    samityRegistrationDate: '',
    samitySignatoryPerson: '',
  });
  const [allGetSamityData, setAllGetSamityData] = useState([]);
  const [allSamityData, setAllSamityData] = useState([]);
  //State for handling file upload
  const [flagForImage] = useState('data:image/jpg;base64,');
  const [dynamicImageData, setDynamicImageData] = useState([]);
  const [withoutSortSamity, setWithoutSortSamity] = useState([]);

  useEffect(() => {
    checkPageValidation();
    getCenNatSamityAllData();
    getImageFormet();
  }, []);

  const getArray = (allRespData, refSamityId) => {
    if (allRespData) {
      let newlyRemainingIdArray;
      newlyRemainingIdArray = allRespData.filter((element) => {
        if (refSamityId.indexOf(element.centralSamityId) == -1) {
          return element;
        }
      });
      return newlyRemainingIdArray;
    }
  };

  let imageChangeOther = (e, i) => {
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
        reader.onload = () => {
          let base64Image = btoa(reader.result);
          const imageData = [...dynamicImageData];
          imageData[i]['name'] = file.name;
          imageData[i]['mimeType'] = file.type;
          imageData[i]['base64Image'] = base64Image;
          imageData[i]['imageError'] = '';
          setDynamicImageData(imageData);
        };
      } else {
        NotificationManager.warning('jpg, png, JPEG, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন ');
      }
    }
  };
  // ******************************************* Get Samity Data *********************************************
  const getCenNatSamityAllData = async () => {
    try {
      // ******************************** get samity data for add *******************************************
      const responsePost = await axios.get(CentralNationalSamityData + getId + '?getType=post', config);
      let allRespData = responsePost.data.data;
      setWithoutSortSamity(allRespData);
      // ***************************** Save samity data for show ************************************
      const responseShow = await axios.get(CentralNationalSamityData + getId + '?getType=update', config);
      const allRespDataShow = responseShow.data.data;
      setAllGetSamityData(allRespDataShow);
      if (allRespDataShow != undefined) {
        const refSamityId = responseShow.data.data.map((elem) => elem.centralSamityId);
        let returnedArray = getArray(allRespData, refSamityId);
        setAllSamityData(returnedArray);
      } else {
        setAllSamityData(allRespData);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  // **************************************** All Handle Change part ***************************************
  const handleChangeSamityName = async (e) => {
    if (e.target.value != 0) {
      const found = allSamityData.find((obj) => {
        return obj.centralSamityId == e.target.value;
      });
      setSamityInfo({
        ...samityInfo,
        centralSamityId: found.centralSamityId,
        centralSamityName: found.centralSamityName,
        committeeSignatoryPerson: found.committeeSignatoryPerson,
        memberSamityName: found.memberSamityName,
        refSamityId: found.refSamityId,
        samityCode: found.samityCode,
        samityDetailsAddress: found.samityDetailsAddress,
        samityRegistrationDate: found.samityRegistrationDate,
        samitySignatoryPerson: found.samitySignatoryPerson,
      });
      setDataEmpty(false);
    } else {
      setSamityInfo({
        ...samityInfo,
        centralSamityId: '',
        centralSamityName: '',
        committeeSignatoryPerson: '',
        memberSamityName: '',
        refSamityId: '',
        samityCode: '',
        samityDetailsAddress: '',
        samityRegistrationDate: '',
        samitySignatoryPerson: '',
      });
    }
  };
  // **************************************** Date of birt ***********************************************
  const changeDob = (dob) => {
    setValue(dob);
  };
  //  ************************************************** Image Part Start  *******************************
  //************************************************ Method for removing image ***************************
  const removeSelectedImageletter = (e, i) => {
    const imageData = [...dynamicImageData];
    imageData[i]['name'] = '';
    imageData[i]['mimeType'] = '';
    imageData[i]['base64Image'] = '';
    imageData[i]['imageError'] =
      imageData[i]['isMandatory'] == 'Y' ? imageData[i]['docTypeDesc'] + ' নির্বাচন করুন' : '';
    setDynamicImageData(imageData);
  };
  // ***************************************************** imgae part end **********************************
  // ******************************************* Dynamic Image *********************************************
  const getImageFormet = async () => {
    try {
      const imageData = await axios.get(dynamicImage + getId, config);
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
  const onEdit = async (
    id,
    centralSamityId,
    samityCode,
    memberName,
    memberAdmissionDate,
    samityRegistrationDate,
    samitySignatoryPerson,
    samityDetailsAddress,
    documents,
  ) => {
    const found = withoutSortSamity.find((obj) => {
      return obj.samityCode == samityCode;
    });
    allSamityData.push(found);
    if (documents) {
      for (const [index] of documents.entries()) {
        documents[index].name = '';
        documents[index].mimeType = '';
        documents[index].base64Image = '';
      }
      setDynamicImageData(documents);
    } else {
      getImageFormet();
    }
    setSamityInfo({
      id: found.id,
      centralSamityId,
      centralSamityName: memberName,
      committeeSignatoryPerson: '',
      memberSamityName: memberName,
      refSamityId: '',
      samityCode,
      samityDetailsAddress,
      samityRegistrationDate: dateFormat(samityRegistrationDate),
      samitySignatoryPerson,
    });
    setDataEmpty(false);
    setValue(memberAdmissionDate);
    setUpdate(true);
    setMemberId(id);
  };
  // ***************************************************** Samity Lavel C & N Part End  ***********************
  let isMandatoryImgae = (id) => {
    let isMandatory = false;
    let data = [...dynamicImageData];

    for (const element of data) {
      if (id) {
        // for update work
        if (element.fileNameUrl && element.fileName) {
          isMandatory = false;
        } else if (element.isMandatory == 'Y' && element.base64Image == '') {
          element.imageError = element.docTypeDesc + ' প্রদান করুন';
          isMandatory = true;
        }
      } else {
        // post part
        if (element.isMandatory == 'Y' && element.base64Image == '') {
          element.imageError = element.docTypeDesc + ' প্রদান করুন';
          isMandatory = true;
        }
      }
    }
    setDynamicImageData(data);
    return isMandatory;
  };
  // ***************************************************** data submit part start *****************************
  let onSubmitData = async (e) => {
    let memberRegistrationData;

    e.preventDefault();
    if (isMandatoryImgae(memberId)) {
      const message = 'বাধ্যতামূলক তথ্য পূরণ করুন';
      NotificationManager.warning(message, '', 5000);
    } else {
      let newImageData;
      if (memberId) {
        dynamicImageData.forEach((a) => {
          delete a.fileNameUrl;
          if (!a.base64Image) {
            delete a.name;
            delete a.mimeType;
            delete a.base64Image;
            delete a.imageError;
          }
          if (a.base64Image) {
            delete a.fileName;
            delete a.imageError;
          }
        });
      } else {
        newImageData = dynamicImageData.filter(
          (e) => (e.isMandatory == 'N' && e.base64Image != '') || e.isMandatory == 'Y',
        );
        for (let i = 0, len = newImageData.length; i < len; i++) {
          delete newImageData[i].imageError;
          delete newImageData[i].isMandatory;
        }
      }

      const payload = {
        samityId: getId,
        memberName: samityInfo.centralSamityName,
        refSamityId: samityInfo.centralSamityId,
        memberAdmissionDate: dateFormat(value),
        documents: memberId ? dynamicImageData : newImageData,
      };
      try {
        if (memberId) {
          memberRegistrationData = await axios.put(CenNatSamityReg + '/' + memberId, payload, config);
        } else {
          memberRegistrationData = await axios.post(CenNatSamityReg, payload, config);
        }
        getCenNatSamityAllData();
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        steperFun(2);
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        setDynamicImageData([]);
        getImageFormet();
        setUpdate(false);
        setValue(null);
        setSamityInfo({
          centralSamityId: '',
          centralSamityName: '',
          committeeSignatoryPerson: '',
          memberSamityName: '',
          refSamityId: '',
          samityCode: '',
          samityDetailsAddress: '',
          samityRegistrationDate: '',
          samitySignatoryPerson: '',
        });
        // setChangeSaityData(0);
        NotificationManager.success(memberRegistrationData.data.message, '', 5000);
        setDataEmpty(true);
        setUpdate(false);
        setMemberId('');
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    }
  };
  // ***************************************************** data submit part End *******************************

  const previousPage = () => {
    router.push({ pathname: 'add-by-laws' });
  };
  let onNextPage = async () => {
    try {
      const tryNextPage = await axios.get(isRequiredMemberPass + getId, config);
      if (tryNextPage.data.data.isPass == true) {
        router.push({ pathname: 'designation' });
      }
      if (tryNextPage.data.data.isPass == false) {
        const expectedMember = numberToWord('' + tryNextPage.data.data.expectedMember + '');
        const memberCount = numberToWord(tryNextPage.data.data.memberCount);
        NotificationManager.error(
          'আপনি ' + memberCount + ' মেম্বার যোগ করেছেন, কম পক্ষে আপনাকে ' + expectedMember + ' মেম্বার যোগ করতে হবে',
          '',
          5000,
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      <Grid container className="section" spacing={1.8}>
        <Grid item lg={4} md={4} xl={4} sx={12}>
          <TextField
            fullWidth
            label={RequiredFile('সমিতির নাম')}
            name="samityName"
            onChange={handleChangeSamityName}
            value={samityInfo.centralSamityId || 0}
            variant="outlined"
            size="small"
            select
            SelectProps={{ native: true }}
          >
            <option value={0}>- নির্বাচন করুন -</option>
            {allSamityData?.map((option, i) => (
              <option key={i} value={option.centralSamityId}>
                {option.centralSamityName}
              </option>
            ))}
          </TextField>
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
            label="জাতীয় সমিতির পক্ষে স্বাক্ষরের ব্যক্তি"
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

      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <SubHeading>প্রয়োজনীয় ডকুমেন্ট</SubHeading>
          <Grid container>
            {dynamicImageData?.map((element, i) => (
              <Grid key={i} item md={4} xs={12} p={1}>
                <Card
                  sx={{
                    display: 'flex',
                    height: '200px',
                    position: 'relative',
                    border: element.imageError ? '1px solid red' : '',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        {element?.docTypeDesc}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <label htmlFor={i}>
                            <Input
                              accept="image/*, Pdf"
                              id={i}
                              multiple
                              type="file"
                              name={i}
                              onChange={(e) => imageChangeOther(e, i)}
                            />
                            <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                              সংযুক্ত করুন
                            </Button>
                          </label>
                        </Stack>
                      </Typography>
                    </CardContent>
                  </Box>
                  {element?.base64Image && (
                    <>
                      <CardMedia
                        component="img"
                        sx={{ width: '100%' }}
                        image={flagForImage + element?.base64Image}
                        alt="প্রত্যয়নপত্র"
                      />
                      <Button
                        onClick={(e) => removeSelectedImageletter(e, i)}
                        sx={{ position: 'absolute', top: '5px', right: '5px' }}
                      >
                        <HighlightOffSharpIcon sx={{ color: 'red' }} />
                      </Button>
                    </>
                  )}
                  {element.fileNameUrl && (
                    <>
                      <CardMedia component="img" sx={{ width: 200 }} image={element.fileNameUrl} alt="প্রত্যয়নপত্র" />
                    </>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '5px',
                      color: 'red',
                    }}
                  >
                    {element.imageError}
                  </span>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Divider />

      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            আগের পাতায়
          </Button>
        </Tooltip>
        {loadingDataSaveUpdate ? (
          <LoadingButton
            loading
            loadingPosition="start"
            sx={{ mr: 1 }}
            startIcon={<SaveOutlinedIcon />}
            variant="outlined"
          >
            {update ? 'হালনাগাদ করা হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
          </LoadingButton>
        ) : (
          <Tooltip title={update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}>
            <Button
              disabled={dataEmpty}
              className="btn btn-save"
              onClick={onSubmitData}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
            </Button>
          </Tooltip>
        )}
        <Tooltip title="পরবর্তী পাতা">
          <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
            পরবর্তী পাতায়
          </Button>
        </Tooltip>
      </Grid>
      <Divider style={{ marginBottom: '2rem' }} />

      <Grid container className="section">
        <Grid xs={12}>
          <SubHeading>সদস্যের তথ্যাদি</SubHeading>
          <TableContainer className="table-container">
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <StyledTableCell align="center">ক্রমিক নং</StyledTableCell>
                  <StyledTableCell>সমিতির নাম</StyledTableCell>
                  <StyledTableCell>রেজিস্ট্রেশন নাম্বার</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>রেজিস্ট্রেশনের তারিখ</StyledTableCell>
                  <StyledTableCell>ঠিকানা</StyledTableCell>
                  <StyledTableCell sx={{ whiteSpace: 'initial !important' }}>
                    কেন্দ্রীয়/জাতীয় সমিতির পক্ষে স্বাক্ষরিত ব্যক্তির নাম
                  </StyledTableCell>
                  <StyledTableCell>মোবাইল নম্বর</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>সম্পদনা</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allGetSamityData?.map((member, index) => (
                  <TableRow key={index}>
                    <StyledTableCell sx={{ textAlign: 'center' }}>
                      {' '}
                      {numberToWord('' + (index + 1) + '')}{' '}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title={<div className="tooltip-title">{member.memberName}</div>} arrow>
                        <span className="data">{member.memberName}</span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={
                          <div className="tooltip-title">
                            {numberToWord('' + (member.samityCode || member.centralSamityCode) + '')}
                          </div>
                        }
                        arrow
                      >
                        <span className="data">
                          {' '}
                          {numberToWord('' + (member.samityCode || member.centralSamityCode) + '')}
                        </span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: 'center' }}>
                      {' '}
                      {numberToWord(dateFormat(member.memberAdmissionDate))}{' '}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title={<div className="tooltip-title">{member.samityDetailsAddress}</div>} arrow>
                        <span className="data">{member.samityDetailsAddress}</span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={
                          <div className="tooltip-title">
                            {member.samitySignatoryPerson || member.signatoryPersonNameBangla}
                          </div>
                        }
                        arrow
                      >
                        <span className="data">{member.samitySignatoryPerson || member.signatoryPersonNameBangla}</span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={<div className="tooltip-title">{member.mobile ? numberToWord(member.mobile) : ''}</div>}
                        arrow
                      >
                        <span className="data">{member.mobile ? numberToWord(member.mobile) : ''}</span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="সম্পাদন করুন">
                        <Button
                          className="table-icon edit"
                          onClick={() =>
                            onEdit(
                              member.id,
                              member.centralSamityId,
                              member.centralSamityCode,
                              member.memberName,
                              member.memberAdmissionDate,
                              member.samityRegistrationDate,
                              member.signatoryPersonNameBangla,
                              member.centralSamityDetailsAddress,
                              member.documents,
                            )
                          }
                        >
                          <EditIcon sx={{ display: 'block' }} />
                        </Button>
                      </Tooltip>
                    </StyledTableCell>
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

export default NationalMemberReg;
