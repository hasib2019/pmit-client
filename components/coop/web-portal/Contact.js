import PinDropIcon from '@mui/icons-material/PinDrop';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { PageValue } from '../../../url/coop/PortalApiList';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
  fontSize: '20px',
  fontWeight: 'bolder',
}));

const Contact = () => {
  const config = localStorageData('config');
  const getSamityId = localStorageData('reportsIdPer');

  const [samityAlldata, setSamityAlldata] = useState([]);

  useEffect(() => {
    getPageValue();
  }, []);

  let getPageValue = async () => {
    try {
      const pageValueData = await axios.get(PageValue + getSamityId, config);
      let pageValueList = pageValueData?.data?.data?.data?.samityDataForPageData
        ? pageValueData?.data?.data?.data?.samityDataForPageData
        : pageValueData?.data?.data?.data?.samityRegMainTableValue;
      setSamityAlldata(pageValueList);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ px: 2 }}>
        যোগাযোগ
      </Typography>
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2.5} px={2} py={2}>
          <Grid item lg={12} md={12} xs={12} sm={12}>
            <Item sx={{ backgroundColor: '#ececec' }}>
              <Typography variant="h5" component="div">
                <PinDropIcon />
                <br />~ কার্যালয়ের ঠিকানা ~
              </Typography>
              <br />
              <Typography variant="h6" display="block">
                {samityAlldata?.samityLevel == 'P'
                  ? 'প্রাথমিক সমিতি'
                  : '' || samityAlldata?.samityLevel == 'C'
                  ? 'কেন্দ্রিয় সমিতি'
                  : '' || samityAlldata?.samityLevel == 'N'
                  ? 'জাতীয় সমিতি'
                  : ''}
                <br />
                {samityAlldata?.samityName} <br />
                {numberToWord(samityAlldata?.samityCode)} <br />
                <b>ঠিকানা -</b> {samityAlldata?.officeName}, <br />
                <b>উপজেলা -</b> {samityAlldata?.upazilaNameBangla}, &nbsp;
                <b>জেলা -</b> {samityAlldata?.districtNameBangla}, &nbsp;
                <b>বিভাগ -</b> {samityAlldata?.samityDivisionNameBangla}
                <br />
                যোগাযোগের ব্যক্তি - {samityAlldata?.nameBangla} <br />
                মোবাইল: {numberToWord(samityAlldata?.mobile)}
                <br />
                ইমেইল: {samityAlldata?.email}
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Contact;
