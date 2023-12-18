import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { WebSearch } from '../../../url/coop/PortalApiList';
import ZoneComponent from '../../utils/ZoneComponent';
import ZoneContext from '../../utils/ZoneContext.json';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

// const StyledTabs = styled((props) => (
//   <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
// ))({
//   '& .MuiTabs-indicator': {
//     display: 'flex',
//     justifyContent: 'center',
//     backgroundColor: 'transparent',
//   },
//   '& .MuiTabs-indicatorSpan': {
//     maxWidth: 40,
//     width: '100%',
//     backgroundColor: '#635ee7',
//   },
// });

// const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
//   textTransform: 'none',
//   fontWeight: theme.typography.fontWeightRegular,
//   fontSize: theme.typography.pxToRem(15),
//   marginRight: theme.spacing(1),
//   color: 'rgba(255, 255, 255, 0.7)',
//   '&.Mui-selected': {
//     color: '#fff',
//   },
//   '&.Mui-focusVisible': {
//     backgroundColor: 'rgba(100, 95, 228, 0.32)',
//   },
// }));

const PublicPortal = () => {
  const token = localStorageData('token');
  const [divisionId, setDivisionId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [upazilaId, setUpazilaId] = useState(null);
  const [upazilaType, setUpazilaType] = useState(null);
  const [unionId, setUnionId] = useState(null);
  const [unionType, setUnionType] = useState(null);
  const [samityFind, setSamityFind] = useState([]);

  function giveValueToTextField(index) {
    const ids = [divisionId, districtId, upazilaType, unionType];
    return ids[index];
  }
  const handleChangeForZone = (e) => {
    let idType;
    const { name, value } = e.target;
    switch (name) {
      case 'division_id':
        setDivisionId(value);
        break;
      case 'district_id':
        setDistrictId(value);
        break;
      case 'upaCityIdType':
        idType = value.split(',');
        setUpazilaType(value);
        setUpazilaId(idType[0]);
        break;
      case 'uniThanaPawIdType':
        idType = value.split(',');
        setUnionType(value);
        setUnionId(idType[0]);
        break;
    }
  };

  const getSamityFind = async () => {
    try {
      let SamityFindData;
      if (divisionId && districtId == null && upazilaId == null && unionId == null) {
        SamityFindData = await axios.get(WebSearch + '&samityDivisionId=' + divisionId);
      } else if (divisionId && districtId && upazilaId == null && unionId == null) {
        SamityFindData = await axios.get(
          WebSearch + '&samityDivisionId=' + divisionId + '&samityDistrictId=' + districtId,
        );
      } else if (divisionId && districtId && upazilaId && unionId == null) {
        SamityFindData = await axios.get(
          WebSearch +
          '&samityDivisionId=' +
          divisionId +
          '&samityDistrictId=' +
          districtId +
          '&samityUpaCityId=' +
          upazilaId,
        );
      } else if (divisionId && districtId && upazilaId && unionId) {
        SamityFindData = await axios.get(
          WebSearch +
          '&samityDivisionId=' +
          divisionId +
          '&samityDistrictId=' +
          districtId +
          '&samityUpaCityId=' +
          upazilaId +
          '&samityUniThanaPawId=' +
          unionId,
        );
      }
      setSamityFind(SamityFindData.data.result);
    } catch (error) {
      //errorHandler(error);
    }
  };

  console.log(samityFind);

  const viewPage = (samityId) => {
    localStorage.setItem('reportsIdPer', JSON.stringify(samityId));
    window.open('/coop/web-portal', '_blank');
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundImage: "url('/bg_main.jpg')",
          backgroundRepeat: 'repeat',
        }}
      >
        <Container sx={{ width: '80%' }}>
          <Paper
            sx={{
              px: { xs: 1, md: 2 },
            }}
            elevation={24}
            square
          >
            <Grid container>
              <Grid item xs={12}>
                <Grid
                  container
                  sx={{
                    flexGrow: 1,
                    backgroundColor: '#683091',
                    borderBottom: '3px solid #6bb43f',
                    color: '#FFFFFF',
                    padding: '7px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h4 style={{ paddingLeft: '8px' }}>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h4>

                  <Grid>
                    {token ? (
                      <Link href="/dashboard" passHref>
                        <Button variant="contained" color="success" size="small" startIcon={<GridViewOutlinedIcon />}>
                          ড্যাশবোর্ড
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/login" passHref>
                        <Button variant="contained" color="success" size="small" startIcon={<LoginIcon />}>
                          ই-সেবায় চলুন
                        </Button>
                      </Link>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} pb={2}>
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    py: 7,
                    backgroundColor: '#fedcac',
                    backgroundImage: "url('/pm.jpg')",
                    backgroundPosition: 'left',
                    backgroundRepeat: 'repeat',
                    height: '100%',
                    width: '100%',
                    minHeight: '100%',
                  }}
                >
                  <Grid container>
                    <Grid item md={1.5} px={2}>
                      <Image src="/govt2.png" alt="RPOB" width={75} height={75} />
                    </Grid>
                    <Grid item md={10.5} pt={1.5}>
                      <Typography
                        sx={{
                          fontSize: '25px',
                          color: '#FFF',
                          textShadow: '1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue',
                        }}
                      >
                        পল্লী উন্নয়ন ও সমবায় বিভাগ <br />
                        সমবায় অধিদপ্তর
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Divider />
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Grid container>
                  <Grid item xl={9} lg={9} md={9} sm={12} xs={12}>
                    <Grid container>
                      <Grid
                        item
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        mr={1}
                        p={1}
                        sx={{ backgroundColor: '#b0b0b0' }}
                      >
                        <marquee>
                          নো মাস্ক নো সার্ভিস। করোনাভাইরাসের বিস্তার রোধে এখনই ডাউনলোড করুন{' '}
                          <a href="https://bit.ly/coronatracerbd">Corona Tracer BD</a> অ্যাপ।
                        </marquee>
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12} mr={1} pt={1}>
                        <Box sx={{ bgcolor: '#2e1534' }}>
                          <Box sx={{ p: 0.5 }} />
                          <Grid
                            item
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            sx={{
                              border: '1px solid #a2a2a2',
                              background: '#f1f1f1',
                              backgroundImage: 'url(/bg_notice_board.png)',
                              backgroundRepeat: 'no-repeat',
                              padding: '10px 0 20px 90px',
                            }}
                          >
                            <Grid container spacing={2.5} px={1} py={2}>
                              {ZoneContext.fields.map((form, i) => {
                                var obj = Object.assign(
                                  {},
                                  { ...form },
                                  { value: giveValueToTextField(i) },
                                  { onChange: handleChangeForZone },
                                  {
                                    division_id: divisionId,
                                  },
                                  {
                                    district_Id: districtId,
                                  },
                                  {
                                    upa_city_Id_Type: upazilaType,
                                  },
                                  {
                                    uni_thana_paw_Id_Type: unionType,
                                  },
                                  { key: i },
                                );
                                return (
                                  <>
                                    <ZoneComponent {...obj} />
                                  </>
                                );
                              })}

                              <Grid item xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  size="small"
                                  startIcon={<SearchIcon />}
                                  onClick={getSamityFind}
                                >
                                  ওয়েব সাইট খুজুন
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            sx={{
                              border: '1px solid #a2a2a2',
                              background: '#f1f1f1',
                            }}
                          >
                            <TableContainer sx={{ px: 1, py: 1 }}>
                              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                                <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                                  <TableRow>
                                    <StyledTableCell>ক্রমিক নং</StyledTableCell>
                                    <StyledTableCell>শ্রেনী</StyledTableCell>
                                    <StyledTableCell>সমিতির নাম</StyledTableCell>
                                    <StyledTableCell>নিবন্ধন নং</StyledTableCell>
                                    <StyledTableCell>ধরন</StyledTableCell>
                                    <StyledTableCell>ওয়েব দেখুন</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {samityFind?.map((row, i) => (
                                    <StyledTableRow key={i}>
                                      <StyledTableCell
                                        component="th"
                                        scope="row"
                                        sx={{ p: '5px', textAlign: 'center' }}
                                      >
                                        {numberToWord('' + (i + 1) + '')}
                                      </StyledTableCell>
                                      <StyledTableCell component="th" scope="row">
                                        {(row.data.samityRegMainTableValue.samityLevel
                                          ? row.data.samityRegMainTableValue.samityLevel
                                          : row.data.samityDataForPageData.samityLevel) == 'P'
                                          ? 'প্রাথমিক'
                                          : '' ||
                                            (row.data.samityRegMainTableValue.samityLevel
                                              ? row.data.samityRegMainTableValue.samityLevel
                                              : row.data.samityDataForPageData.samityLevel) == 'C'
                                            ? 'কেন্দ্রিয়'
                                            : '' ||
                                              (row.data.samityRegMainTableValue.samityLevel
                                                ? row.data.samityRegMainTableValue.samityLevel
                                                : row.data.samityDataForPageData.samityLevel) == 'N'
                                              ? 'জাতীয়'
                                              : ''}
                                      </StyledTableCell>
                                      <StyledTableCell component="th" scope="row">
                                        {row?.data?.samityRegMainTableValue?.samityName
                                          ? row?.data?.samityRegMainTableValue?.samityName
                                          : row?.data?.samityDataForPageData?.samityName}
                                      </StyledTableCell>
                                      <StyledTableCell component="th" scope="row">
                                        {numberToWord(
                                          '' + row?.data?.samityRegMainTableValue?.samityCode
                                            ? row?.data?.samityRegMainTableValue?.samityCode
                                            : row?.data?.samityDataForPageData?.samityCode + '',
                                        )}
                                      </StyledTableCell>
                                      <StyledTableCell component="th" scope="row">
                                        {row?.data?.samityRegMainTableValue?.samiyTypeName
                                          ? row?.data?.samityRegMainTableValue?.samiyTypeName
                                          : row?.data?.samityDataForPageData?.samiyTypeName}
                                      </StyledTableCell>
                                      <StyledTableCell component="th" scope="row">
                                        <Button color="success" sx={{ mr: 1 }} onClick={() => viewPage(row?.samityId)}>
                                          <WysiwygIcon sx={{ display: 'block' }} />
                                        </Button>
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <a
                          href="https://drive.google.com/file/d/1Z2DDAq6vaRwDmn9cogXo2o_LRVByWlid/view"
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                        >
                          {' '}
                          <Typography
                            variant="body1"
                            component="div"
                            sx={{
                              backgroundColor: '#29b260',
                              color: '#FFF',
                              p: '6px',
                              textAlign: 'center',
                              mb: '5px',
                            }}
                          >
                            ব্যবহারকারীর ম্যানুয়াল গাইড
                          </Typography>
                        </a>
                        <a
                          href="https://www.youtube.com/watch?v=Y2N2mRST8Gg&ab_channel=212127TawfiqulIslam"
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                        >
                          {' '}
                          <Typography
                            variant="body1"
                            component="div"
                            sx={{
                              backgroundColor: '#FF0000',
                              color: '#FFF',
                              p: '6px',
                              textAlign: 'center',
                              mb: '5px',
                            }}
                          >
                            ভিডিও টিউটেরিয়াল
                          </Typography>
                        </a>
                        <Link href="http://www.coop.gov.bd/" passHref>
                          <Typography
                            variant="body1"
                            component="div"
                            sx={{
                              backgroundColor: '#2e4d02',
                              color: '#FFF',
                              p: '6px',
                              textAlign: 'center',
                              mb: '5px',
                            }}
                          >
                            সমবায় অধিদপ্তরের ওয়েবসাইট
                          </Typography>
                        </Link>

                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            backgroundColor: '#609513',
                            color: '#FFF',
                            px: '5px',
                          }}
                        >
                          গুরুত্বপূর্ণ লিংক
                        </Typography>

                        <List
                          dense
                          sx={{
                            width: '100%',
                            maxWidth: 500,
                            bgcolor: 'background.paper',
                          }}
                        >
                          <ListItem disablePadding>
                            <ListItemButton
                              sx={{ borderBottom: '1px solid #7b7b7b' }}
                              component="a"
                              href="http://www.pmo.gov.bd/"
                            >
                              <ListItemIcon>
                                <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                              </ListItemIcon>
                              <ListItemText primary="প্রধানমন্ত্রীর কার্যালয়" sx={{ ml: -4 }} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemButton
                              sx={{ borderBottom: '1px solid #7b7b7b' }}
                              component="a"
                              href="https://mopa.gov.bd/"
                            >
                              <ListItemIcon>
                                <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                              </ListItemIcon>
                              <ListItemText primary="জনপ্রশাসন মন্ত্রণালয়" sx={{ ml: -4 }} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemButton
                              sx={{ borderBottom: '1px solid #7b7b7b' }}
                              component="a"
                              href="https://mof.gov.bd/"
                            >
                              <ListItemIcon>
                                <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                              </ListItemIcon>
                              <ListItemText primary="অর্থ মন্ত্রণালয়" sx={{ ml: -4 }} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemButton
                              sx={{ borderBottom: '1px solid #7b7b7b' }}
                              component="a"
                              href="http://www.rdcd.gov.bd/"
                            >
                              <ListItemIcon>
                                <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                              </ListItemIcon>
                              <ListItemText primary="পল্লী উন্নয়ন ও সমবায় বিভাগ" sx={{ ml: -4 }} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemButton
                              sx={{ borderBottom: '1px solid #7b7b7b' }}
                              component="a"
                              href="https://bangladesh.gov.bd/"
                            >
                              <ListItemIcon>
                                <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                              </ListItemIcon>
                              <ListItemText primary="বাংলাদেশ তথ্য ও সেবাসমূহ" sx={{ ml: -4 }} />
                            </ListItemButton>
                          </ListItem>
                        </List>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            backgroundColor: '#609513',
                            color: '#FFF',
                            px: '5px',
                          }}
                        >
                          সরকারী হট লাইন
                        </Typography>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1,
                          }}
                        >
                          <Image alt="Hot Line" src="/hotLine.jpg" />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Image src="/footer_top_bg.png" alt="Logo" width={'100%'} />
              </Grid>
            </Grid>
            <Grid container px={2} py={3} sx={{ backgroundColor: '#ececec' }}>
              <Grid item xl={5.5} lg={5.5} md={5.5} sm={12} xs={12}>
                সাইটটি শেষ হাল-নাগাদ করা হয়েছে: ২০-০৪-২০২২
              </Grid>
              <Grid item xl={6.5} lg={6.5} md={6.5} sm={12} xs={12} sx={{ textAlign: 'right' }}>
                পরিকল্পনা ও বাস্তবায়নে: মন্ত্রিপরিষদ বিভাগ, এটুআই, বিসিসি, ডিওআইসিটি ও বেসিস।
                <br />
                <br />
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  কারিগরি সহায়তায়:
                  <Image src="/main-logo.png" alt="Logo" width={130} height={25} />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default PublicPortal;
