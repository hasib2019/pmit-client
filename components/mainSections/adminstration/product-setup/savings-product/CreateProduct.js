import CategoryIcon from '@mui/icons-material/Category';
import EvStationIcon from '@mui/icons-material/EvStation';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PercentIcon from '@mui/icons-material/Percent';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllSavingsProduct } from '../../../../../features/loan/savingsProduct/savingsProductSlice';
import InstallmentSetupComponent from './InstallmentSetup/InstallmentSetupComponent';
import NeccessaryDocument from './NeccessaryDocument/NeccessaryDocumentComponent';
import ProductCharge from './ProductCharge/ProductChargeComponent';
import ProductInfo from './ProductInfo';
import ProfitComponent from './ProductProfit/ProfitComponent';
const CustomTab = styled(Tab)({
  '& .MuiTab-root.MuiTab-labelIcon.Mui-selected': {
    color: 'red',
  },

  '& .MuiButtonBase-root-MuiTab-root.Mui-selected': {
    color: 'red',
  },
});

const CreateProduct = () => {
  const [savings, setSavings] = useState('');
  const dispatch = useDispatch();

  const [value, setValue] = React.useState('1');





  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePage = (i) => {
    setValue(i.toString());
  };

  useEffect(() => {
    dispatch(getAllSavingsProduct());
  }, []);
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
                      label="প্রোডাক্টের মুনাফা"
                    />
                  </TabList>
                </Grid>
                {/* {
                  savings != "R" &&
                  <Grid item sx={{ display: "flex", justifyContent: "center" }}>
                    <TabList
                      className="hvr-bounce-to-right"
                      sx={{
                        "& .MuiTab-labelIcon.Mui-selected": {
                          color: "#001975",
                          fontSize: "17px",
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#9cb1ff",
                        },
                      }}
                      onChange={handleChange}
                    >
                      <Tab
                        icon={
                          <Avatar
                            sx={{
                              bgcolor: "#589200",
                              width: 30,
                              height: 30,
                              p: 2,
                            }}
                          >
                            <EmojiSymbolsIcon />
                          </Avatar>
                        }
                        value="3"
                        label="কিস্তি সেটআপ"
                      />
                    </TabList>
                  </Grid>
                } */}

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
                          <ImageSearchIcon />
                        </Avatar>
                      }
                      value="5"
                      label="প্রয়োজনীয় ডকুমেন্ট"
                    />
                  </TabList>
                </Grid>
              </Grid>
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: '2rem 0' }}>
            <ProductInfo handlePage={handlePage} setSavings={setSavings} />
          </TabPanel>
          <TabPanel value="2">
            <ProfitComponent handlePage={handlePage} savings={savings} setSavings={setSavings} />
          </TabPanel>
          <TabPanel value="3">
            <InstallmentSetupComponent handlePage={handlePage} />
          </TabPanel>

          <TabPanel value="4">
            <ProductCharge handlePage={handlePage} />
          </TabPanel>
          <TabPanel value="5">
            <NeccessaryDocument handlePage={handlePage} />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default CreateProduct;
