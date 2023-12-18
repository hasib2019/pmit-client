/* eslint-disable @next/next/no-img-element */
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ZoomImageView from 'service/ZoomImageView';
import { localStorageData } from 'service/common';
import { unescape } from 'underscore';
import { PageData } from '../../../url/coop/PortalApiList';

const Home = () => {
  const token = localStorageData('token');
  const config = localStorageData('config', token);
  const getSamityId = localStorageData('reportsIdPer');

  const [allPic, setAllPic] = useState([]);
  const [allNotice, setAllNotice] = useState([]);

  useEffect(() => {
    getPageDetailsValue();
  }, []);

  let getPageDetailsValue = async () => {
    try {
      const pageDetailsValueData = await axios.get(PageData + getSamityId, config);
      let pageDetailsValueList = pageDetailsValueData.data.data;

      const newArray = pageDetailsValueList.filter((obj) => obj.contentId == 3);
      setAllNotice(newArray);

      const newPicArray = pageDetailsValueList.filter((obj) => obj.contentId == 5);
      const attachment = newPicArray[0]?.attachment;
      setAllPic(attachment);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box>
            <img alt="Hot Line" src="/padmabanner.jpg" style={{ objectFit: 'cover', width: '100%' }} />
          </Box>
        </Grid>
        <Grid item xs={12} p={1} sx={{ backgroundColor: '#b0b0b0', marginBottom: '6px' }}>
          <marquee>
            নো মাস্ক নো সার্ভিস। করোনাভাইরাসের বিস্তার রোধে এখনই ডাউনলোড করুন{' '}
            <a href="https://bit.ly/coronatracerbd">Corona Tracer BD</a> অ্যাপ।
          </marquee>
        </Grid>

        <Grid
          item
          xs={12}
          p={1}
          sx={{
            border: '1px solid #a2a2a2',
            background: '#f1f1f1',
            backgroundImage: 'url(/bg_notice_board.png)',
            backgroundRepeat: 'no-repeat',
            padding: '10px 0 20px 120px',
          }}
        >
          <Typography variant="h6" component="div">
            নোটিশ বোর্ড
          </Typography>
          {allNotice &&
            allNotice?.map((row) => (
              <List dense key={row.id} sx={{ width: '90%', maxWidth: 500 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      borderBottom: '1px solid #f7f7f7',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '0',
                    }}
                  >
                    <ListItemIcon style={{ minWidth: 'max-content', marginRight: '1rem' }}>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <div
                          style={{ display: 'flex' }}
                          dangerouslySetInnerHTML={{
                            __html: row && unescape(row.content),
                          }}
                        ></div>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            ))}
          <Button variant="outlined" size="small">
            সকল
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ marginTop: '0' }}>
        <Grid item md={6} xs={12}>
          <Paper
            variant="outlined"
            elevation={3}
            square
            sx={{
              p: 2,
              border: '1px solid #a2a2a2',
              backgroundColor: '#f1f1f1',
            }}
          >
            <Typography sx={{ fontSize: '16px', marginBottom: '6px', fontWeight: 'bold' }}>প্রকাশনা</Typography>
            <Card sx={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <Box sx={{ width: '30%' }}>
                <CardMedia component="img" sx={{ maxWidth: '115px' }} image="/book.jpg" alt="Book" />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
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
                        href="http://www.coop.gov.bd/site/view/annual_reports/-"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="বার্ষিক প্রতিবেদন" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{ borderBottom: '1px solid #7b7b7b' }}
                        component="a"
                        href="http://www.coop.gov.bd/site/publications/f5bdc429-bde5-48dc-984a-3a5f2308458e/%E0%A6%95%E0%A7%8B-%E0%A6%85%E0%A6%AA%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B6%E0%A6%A8-%E0%A6%9C%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%B2"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="কো-অপারেশন জার্নাল" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{ borderBottom: '1px solid #7b7b7b' }}
                        component="a"
                        href="http://www.coop.gov.bd/site/page/ab48bcc3-58e2-40cf-a1f6-c7ede5357b30/%E0%A6%B8%E0%A6%AE%E0%A6%AC%E0%A6%BE%E0%A7%9F-%E0%A6%AA%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%95%E0%A6%BE"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="সমবায় পত্রিকা" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{ borderBottom: '1px solid #7b7b7b' }}
                        component="a"
                        href="http://www.coop.gov.bd/site/page/909b25eb-5d58-4ced-b1ff-a66bc25a5485/-%E0%A6%B8%E0%A6%AE%E0%A6%AC%E0%A6%BE%E0%A7%9F-%E0%A6%AC%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%A4%E0%A6%BE-"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="সমবায় বার্তা" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </CardContent>
              </Box>
            </Card>
          </Paper>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <Paper
            variant="outlined"
            elevation={3}
            square
            sx={{
              p: 2,
              border: '1px solid #a2a2a2',
              backgroundColor: '#f1f1f1',
            }}
          >
            <Typography sx={{ fontSize: '16px', marginBottom: '6px', fontWeight: 'bold' }}>
              আইন, বিধি ও নীতিমালা
            </Typography>
            <Card sx={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <Box sx={{ width: '30%' }}>
                <CardMedia component="img" image="/law.jpg" alt="Law" style={{ maxWidth: '115px' }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
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
                        href="http://www.coop.gov.bd/site/view/law/%E0%A6%B8%E0%A6%AE%E0%A6%AC%E0%A6%BE%E0%A7%9F-%E0%A6%B8%E0%A6%AE%E0%A6%BF%E0%A6%A4%E0%A6%BF-%E0%A6%86%E0%A6%87%E0%A6%A8-%E0%A6%AC%E0%A6%BF%E0%A6%A7%E0%A6%BF%E0%A6%B8%E0%A6%AE%E0%A7%82%E0%A6%B9-(%E0%A6%B8%E0%A6%82%E0%A6%B6%E0%A7%8B%E0%A6%A7%E0%A6%BF%E0%A6%A4%E0%A6%B8%E0%A6%B9)"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="সমবায় সমিতি আইন" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{ borderBottom: '1px solid #7b7b7b' }}
                        component="a"
                        href="http://www.coop.gov.bd/site/page/15daa38e-3c18-4d86-8fc2-0d15c0908ba1/%E0%A6%B8%E0%A6%AE%E0%A6%AC%E0%A6%BE%E0%A7%9F-%E0%A6%B8%E0%A6%AE%E0%A6%BF%E0%A6%A4%E0%A6%BF-%E0%A6%AC%E0%A6%BF%E0%A6%A7%E0%A6%BF%E0%A6%AE%E0%A6%BE%E0%A6%B2%E0%A6%BE"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="সমিতির বিধিমালা" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{ borderBottom: '1px solid #7b7b7b' }}
                        component="a"
                        href="http://www.coop.gov.bd/site/policies/09a04879-81c0-4136-9a3f-d1e465f264f7/%E0%A6%9C%E0%A6%BE%E0%A6%A4%E0%A7%80%E0%A7%9F-%E0%A6%B8%E0%A6%AE%E0%A6%AC%E0%A6%BE%E0%A7%9F-%E0%A6%A8%E0%A7%80%E0%A6%A4%E0%A6%BF-"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="জাতীয় সমবায় নীতি" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{ borderBottom: '1px solid #7b7b7b' }}
                        component="a"
                        href="http://www.coop.gov.bd/site/page/c21420f9-5078-49e9-8a57-fd10e1f94376/%E0%A6%89%E0%A6%AA-%E0%A6%86%E0%A6%87%E0%A6%A8"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="success" sx={{ height: '20px', width: '20px', ml: -1 }} />
                        </ListItemIcon>
                        <ListItemText primary="উপ আইন" sx={{ ml: -4 }} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </CardContent>
              </Box>
            </Card>
          </Paper>
        </Grid>
      </Grid>
      {getSamityId ? (
        <Grid item xs={12}>
          <ImageList
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              paddingBottom: '8px',
            }}
          >
            <ImageListItem key="Subheader" sx={{ width: '100%' }}>
              <ListSubheader sx={{ fontSize: '18px' }}>সমিতির ছবিসমূহ :</ListSubheader>
            </ImageListItem>
            {allPic?.map((row, i) => (
              <ImageListItem
                key={i}
                sx={{
                  border: '1px solid #ececec',
                  maxWidth: '20%',
                  minWidth: '150px',
                  margin: '8px 4px',
                  padding: '4px',
                }}
                className="webportal-image"
              >
                <Card>
                  <CardActionArea>
                    <ZoomImageView
                      src={row.fileNameUrl}
                      divStyle={{ width: '100%' }}
                      imageStyle={{ height: '100%', width: '100%' }}
                      key={1}
                      type={imageType(row.fileName)}
                    />
                  </CardActionArea>
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <div
            style={{
              width: '100%',
              height: '200px',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {/* <Loader /> */}
            <span
              style={{
                fontSize: '20px',
                display: 'flex',
                justifyContent: 'center',
                color: '#ff0000',
              }}
            >
              কোন সমিতি পাওয়া যায়নি
            </span>
          </div>
        </Grid>
      )}
    </>
  );
};

export default Home;
