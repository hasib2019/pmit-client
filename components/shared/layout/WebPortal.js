/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { PageData, PageInfo, PageValue } from '../../../url/coop/PortalApiList';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const WebPortal = (props) => {
  const config = localStorageData('config');
  const getSamityId = localStorageData('reportsIdPer');

  const [pages, setPages] = useState([]);
  const [samityAlldata, setSamityAlldata] = useState([]);
  const [committeeDuration, setCommitteeDuration] = useState([]);
  const [samityName, setSamityName] = useState([]);
  const [socialLink, setSocialLink] = useState([]);

  const [logo, setLogo] = useState([]);
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    getPage();
    getPageValue();
    getPageDetailsValue();
  }, []);

  let getPage = async () => {
    try {
      const pageData = await axios.get(PageInfo + '?isPagination=false&webEnable=true', config);
      let pageList = pageData.data.data;
      let shortPageList = pageList.sort((a, b) => {
        return a.id - b.id;
      });
      setPages(shortPageList);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  let getPageValue = async () => {
    try {
      const pageValueData = await axios.get(PageValue + getSamityId, config);
      let pageValueList = pageValueData.data.data.data;
      let pageSamityName = pageValueData.data.data;
      setSamityName(pageSamityName.samityName);
      setCommitteeDuration(pageValueList.committeeInfoData);
      setSamityAlldata(pageValueList.committeeMemberWithPhoto);
      setSocialLink(pageSamityName.commonData);
    } catch (error) {
      ('');
    }
  };

  let getPageDetailsValue = async () => {
    try {
      const pageDetailsValueData = await axios.get(PageData + getSamityId, config);
      let pageDetailsValueList = pageDetailsValueData.data.data;
      const newLogo = pageDetailsValueList.filter((obj) => obj.contentId == 1)[0].attachment[0];
      setLogo(newLogo);
      const newBanner = pageDetailsValueList.filter((obj) => obj.contentId == 2)[0].attachment[0];
      setBanner(newBanner);
    } catch (error) {
      // errorHandler(error);
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundImage: "url('/bg_main.jpg')",
          backgroundRepeat: 'repeat',
          height: '100%',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <Container sx={{ width: { xs: '100%', md: '80%' } }}>
          <Paper sx={{ px: { xs: 1, md: 2 } }} elevation={8} square>
            <Grid container>
              <Grid item xs={12}>
                <Grid
                  container
                  sx={{
                    backgroundColor: '#683091',
                    borderBottom: '3px solid #6bb43f',
                    color: '#FFFFFF',
                    padding: '.5rem 1rem',
                  }}
                >
                  <Typography sx={{ fontSize: '18px' }}>
                    {' '}
                    গণপ্রজাতন্ত্রী বাংলাদেশ সরকার - পল্লী উন্নয়ন ও সমবায় বিভাগ - সমবায় অধিদপ্তর
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    py: 7,
                    backgroundImage: 'url(' + banner.fileNameUrl + ')',
                    backgroundPosition: 'left',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    height: '100%',
                    width: '100%',
                    minHeight: '100%',
                  }}
                >
                  <Grid container mx={2} sx={{ gap: '1rem', alignItems: 'center' }}>
                    <Grid
                      item
                      sx={{
                        background: 'white',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        padding: '.5rem',
                        height: '80px',
                        width: '80px',
                      }}
                    >
                      <img
                        src={logo.fileNameUrl}
                        alt={logo.fileName}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'cover',
                          margin: 'auto',
                          display: 'block',
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: '20px',
                          color: '#FFF',
                          background: 'rgba(0,0,0,0.7)',
                          padding: '0 1rem',
                          borderRadius: '3px',
                        }}
                      >
                        {samityName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  py={2}
                  px={1}
                  sx={{
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  {pages.map((option, i) => (
                    <Grid key={i} item>
                      <Typography
                        sx={{
                          color: option.color,
                          textAlign: 'center',
                          fontSize: '20px',
                        }}
                        className="webportal-nav-item"
                      >
                        <Link href={option.pageLink} passHref>
                          <a>{option.pageNameBn}</a>
                        </Link>
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Divider />
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item md={9} xs={12}>
                    {props.children}
                  </Grid>

                  <Grid item md={3} xs={12}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{
                            backgroundColor: '#2e4d02',
                            color: '#FFF',
                            textAlign: 'center',
                            p: '6px',
                            mb: '5px',
                          }}
                        >
                          {committeeDuration?.committeeType == 'S'
                            ? 'অনুমোদিত প্রধম কমিটি'
                            : '' || committeeDuration?.committeeType == 'E'
                              ? 'নির্বাচিত কমিটি'
                              : ''}
                          <br />
                          কমিটির সময়কাল <br />
                          {committeeDuration?.effectDate &&
                            numberToWord('' + new Date(committeeDuration?.effectDate).toLocaleDateString() + '')}{' '}
                          -{' '}
                          {committeeDuration?.expireDate &&
                            numberToWord('' + new Date(committeeDuration?.expireDate).toLocaleDateString() + '')}
                        </Typography>
                        {samityAlldata?.map((row) => {
                          if (
                            row?.status == 'A' &&
                            (row?.committeeRoleId == 1 || row?.committeeRoleId == 2 || row?.committeeRoleId == 6)
                          ) {
                            return (
                              <>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{
                                    backgroundColor: '#609513',
                                    color: '#FFF',
                                    px: '5px',
                                  }}
                                >
                                  {row?.roleName}
                                </Typography>
                                <Box
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 1,
                                  }}
                                >
                                  <Avatar
                                    src={row?.memberPhotoUrl}
                                    sx={{
                                      height: 100,
                                      width: 100,
                                      border: '2px solid #ececec',
                                    }}
                                  />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
                                  {row?.memberNameBangla}
                                </Typography>
                              </>
                            );
                          }
                          if (row?.status == 'A' && (row?.committeeRoleId == 3 || row?.committeeRoleId == 4)) {
                            return (
                              <>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{
                                    backgroundColor: '#609513',
                                    color: '#FFF',
                                    px: '5px',
                                  }}
                                >
                                  {row?.roleName}
                                </Typography>
                                <Box
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 1,
                                  }}
                                >
                                  <Avatar
                                    src={row?.memberPhotoUrl}
                                    sx={{
                                      height: 100,
                                      width: 100,
                                      border: '2px solid #ececec',
                                    }}
                                  />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
                                  {row?.memberNameBangla}
                                </Typography>
                              </>
                            );
                          }
                          if (row?.status == 'A' && row?.committeeRoleId == 5) {
                            return (
                              <>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{
                                    backgroundColor: '#609513',
                                    color: '#FFF',
                                    px: '5px',
                                  }}
                                >
                                  {row?.roleName}
                                </Typography>
                                <Box
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 1,
                                  }}
                                >
                                  <Avatar
                                    src={row?.memberPhotoUrl}
                                    sx={{
                                      height: 100,
                                      width: 100,
                                      border: '2px solid #ececec',
                                    }}
                                  />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
                                  {row?.memberNameBangla}
                                </Typography>
                              </>
                            );
                          }
                        })}

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
                        <Link href="http://dashboard.rdcd.orangebd.com/admin/login" passHref>
                          <Typography
                            variant="body1"
                            component="div"
                            sx={{
                              backgroundColor: '#60951326',
                              color: '#24360b',
                              px: '5px',
                              textAlign: 'center',
                              mb: '5px',
                            }}
                          >
                            অভ্যন্তরীন ই-সেবাসমূহ <br />
                            <img alt="Hot Line" src="/myGov.png" style={{ width: '100%' }} />
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
                          <img alt="Hot Line" src="/hotLine.jpg" />
                        </Box>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            backgroundColor: '#609513',
                            color: '#FFF',
                            px: '5px',
                            my: '5px',
                          }}
                        >
                          সামাজিক যোগাযোগ
                        </Typography>

                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1,
                          }}
                        >
                          <Stack direction="row" spacing={2.5}>
                            <a
                              href={socialLink && socialLink.facebook}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              style={{ margin: '0', padding: '5px' }}
                            >
                              <Avatar alt="Facebook" src="/fb.png" />
                            </a>
                            <a
                              href={socialLink && socialLink.twitter}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              style={{ margin: '0', padding: '5px' }}
                            >
                              <Avatar alt="Skype" src="/tw.png" />
                            </a>
                            <a
                              href={socialLink && socialLink.skype}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              style={{ margin: '0', padding: '5px' }}
                            >
                              <Avatar alt="Twitter" src="/sp.png" />
                            </a>
                            <a
                              href={socialLink && socialLink.messanger}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              style={{ margin: '0', padding: '5px' }}
                            >
                              <Avatar alt="Messanger" src="/mg.png" />
                            </a>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Paper elevation={0}>
            <Grid container>
              <img src={'/footer_top_bg.png'} style={{ width: '100%' }} />
            </Grid>
            <Grid container px={2} py={3} sx={{ backgroundColor: '#ececec' }}>
              <Grid item xl={5.5} lg={5.5} md={5.5} sm={12} xs={12}>
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} mb={2}>
                  <Link href="/web-portal/askme" passHref>
                    <a>
                      <Item>সচরাচর জিজ্ঞাসা</Item>
                    </a>
                  </Link>
                  <Link href="/web-portal/contact" passHref>
                    <a>
                      <Item>যোগাযোগ</Item>
                    </a>
                  </Link>
                </Stack>
                সাইটটি শেষ হাল-নাগাদ করা হয়েছে: ২০-০৪-২০২২
              </Grid>
              <Grid item xl={6.5} lg={6.5} md={6.5} sm={12} xs={12} sx={{ textAlign: 'right' }}>
                পরিকল্পনা ও বাস্তবায়নে: মন্ত্রিপরিষদ বিভাগ, এটুআই, বিসিসি, ডিওআইসিটি ও বেসিস।
                <br />
                <br />
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  কারিগরি সহায়তায়:
                  <img src="/main-logo.png" alt="Logo" width={130} height={25} />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default WebPortal;
