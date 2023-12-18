import CategoryIcon from '@mui/icons-material/Category';
import EmojiSymbolsIcon from '@mui/icons-material/EmojiSymbols';
import EvStationIcon from '@mui/icons-material/EvStation';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PercentIcon from '@mui/icons-material/Percent';
import ScaleIcon from '@mui/icons-material/Scale';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import NecessaryDocument from './NecessaryDocument';
import ProductCharge from './ProductCharge';
import ProductMaster from './ProductMaster';
import ProductServiceCharge from './ProductServiceCharge';
import ServiceChargeBivajon from './ServiceChargeBivajon';
import SlabWiseLoanAmount from './SlabWiseLoanAmount';

const CustomTab = styled(Tab)({
  '& .MuiTab-root.MuiTab-labelIcon.Mui-selected': {
    color: 'red',
  },

  '& .MuiButtonBase-root-MuiTab-root.Mui-selected': {
    color: 'red',
  },
});

const CreateProduct = () => {
  // const tabShadow = 'rgba(0, 0, 0, 0.16) 0px 1px 4px';
  // const mainTabShadow = 'rgba(0, 0, 0, 0.24) 0px 3px 8px';
  const [value, setValue] = React.useState('1');
  const [appId, setAppId] = useState('');
  const [success, setSuccess] = useState({
    successOne: false,
    successTwo: false,
    successThree: false,
    successFour: false,
    successFive: false,
  });

  const [prodName, setProdName] = useState('');
  const [projName, setProjName] = useState('');

  const changeSuccessFlag = (owner) => {
    setSuccess({ ...success, [owner]: !success[owner] });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange2 = (i) => {
    setValue(i);
  };
  const getAppId = (id) => {
    setAppId(id);
  };

  const getProductName = (prodName, projName) => {
    setProdName(prodName);
    setProjName(projName);
  };

  const { successOne, successTwo, successThree, successFour, successFive } = success;
  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box>
            <TabList onChange={handleChange} aria-label="icon label tabs example">
              <Grid container spacing={0} justifyContent="center">
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TabList
                    className="hvr-bounce-to-right"
                    sx={{
                      '& .MuiTab-labelIcon.Mui-selected': {
                        color: '#001975',
                        fontSize: '17px',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#9cb1ff',
                      },
                    }}
                    onChange={handleChange}
                  >
                    <CustomTab
                      icon={
                        <Avatar
                          sx={{
                            bgcolor: '#589200',
                            width: 30,
                            height: 30,
                            p: 2,
                          }}
                        >
                          <CategoryIcon />
                        </Avatar>
                      }
                      value="1"
                      label="প্রোডাক্টের তথ্য"
                    />
                  </TabList>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TabList
                    className="hvr-bounce-to-right"
                    sx={{
                      '& .MuiTab-labelIcon.Mui-selected': {
                        color: '#001975',
                        fontSize: '17px',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#9cb1ff',
                      },
                    }}
                    onChange={handleChange}
                  >
                    <Tab
                      icon={
                        <Avatar sx={{ bgcolor: '#589200', width: 30, height: 30 }}>
                          <PercentIcon />
                        </Avatar>
                      }
                      value="2"
                      label="প্রোডাক্টের সার্ভিস চার্জ"
                    />
                  </TabList>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TabList
                    className="hvr-bounce-to-right"
                    sx={{
                      '& .MuiTab-labelIcon.Mui-selected': {
                        color: '#001975',
                        fontSize: '17px',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#9cb1ff',
                      },
                    }}
                    onChange={handleChange}
                  >
                    <Tab
                      icon={
                        <Avatar
                          sx={{
                            bgcolor: '#589200',
                            width: 30,
                            height: 30,
                            p: 2,
                          }}
                        >
                          <EmojiSymbolsIcon />
                        </Avatar>
                      }
                      value="3"
                      label="সার্ভিস চার্জ বিভাজন"
                    />
                  </TabList>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TabList
                    className="hvr-bounce-to-right"
                    sx={{
                      '& .MuiTab-labelIcon.Mui-selected': {
                        color: '#001975',
                        fontSize: '17px',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#9cb1ff',
                      },
                    }}
                    onChange={handleChange}
                  >
                    <Tab
                      icon={
                        <Avatar
                          sx={{
                            bgcolor: '#589200',
                            width: 30,
                            height: 30,
                            p: 2,
                          }}
                        >
                          <EvStationIcon />
                        </Avatar>
                      }
                      value="4"
                      label="প্রোডাক্টের চার্জ"
                    />
                  </TabList>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TabList
                    className="hvr-bounce-to-right"
                    sx={{
                      '& .MuiTab-labelIcon.Mui-selected': {
                        color: '#001975',
                        fontSize: '17px',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#9cb1ff',
                      },
                    }}
                    onChange={handleChange}
                  >
                    <Tab
                      icon={
                        <Avatar
                          sx={{
                            bgcolor: '#589200',
                            width: 30,
                            height: 30,
                            p: 2,
                          }}
                        >
                          <ScaleIcon />
                        </Avatar>
                      }
                      value="5"
                      label="দফা অনুযায়ী ঋণের পরিমান"
                    />
                  </TabList>
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TabList
                    className="hvr-bounce-to-right"
                    sx={{
                      '& .MuiTab-labelIcon.Mui-selected': {
                        color: '#001975',
                        fontSize: '17px',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#9cb1ff',
                      },
                    }}
                    onChange={handleChange}
                  >
                    <Tab
                      icon={
                        <Avatar
                          sx={{
                            bgcolor: '#589200',
                            width: 30,
                            height: 30,
                            p: 2,
                          }}
                        >
                          <ImageSearchIcon />
                        </Avatar>
                      }
                      value="6"
                      label="প্রয়োজনীয় ডকুমেন্ট"
                    />
                  </TabList>
                </Grid>
              </Grid>
            </TabList>
          </Box>
          <TabPanel value="1">
            <ProductMaster
              resSuccess={successOne}
              appId={appId}
              provideId={getAppId}
              provideProName={getProductName}
              handleChange2={handleChange2}
            />
          </TabPanel>
          <TabPanel value="2">
            <ProductServiceCharge
              appId={appId}
              resSuccess={successTwo}
              afterSuccess={changeSuccessFlag}
              proName={{ prodName, projName }}
              handleChange2={handleChange2}
            />
          </TabPanel>
          <TabPanel value="3">
            <ServiceChargeBivajon
              appId={appId}
              resSuccess={successThree}
              proName={{ prodName, projName }}
              handleChange2={handleChange2}
            />
          </TabPanel>
          <TabPanel value="4">
            <ProductCharge
              appId={appId}
              resSuccess={successThree}
              proName={{ prodName, projName }}
              handleChange2={handleChange2}
            />
          </TabPanel>
          <TabPanel value="5">
            <SlabWiseLoanAmount
              appId={appId}
              resSuccess={successFour}
              proName={{ prodName, projName }}
              handleChange2={handleChange2}
            />
          </TabPanel>
          <TabPanel value="6">
            <NecessaryDocument
              appId={appId}
              resSuccess={successFive}
              proName={{ prodName, projName }}
              handleChange2={handleChange2}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default CreateProduct;
