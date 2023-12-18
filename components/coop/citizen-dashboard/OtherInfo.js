/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const OtherInfo = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container gap={2} sx={{ justifyContent: 'space-around', flexDirection: 'column', paddingTop: '.5rem' }}>
        <Item className="other-info">পরবর্তী নির্বাচনের তারিখ- ২২-০২-২০২৫</Item>
        <Item className="other-info">বর্তমান মূলধনের পরিমাণ- ১৬৩ কোটি</Item>
        <Item className="other-info">বর্তমান সক্রিয় সদস্য সংখ্যা- ১৬৩০০</Item>
        <Item className="other-info">প্রজেক্ট ডিটেইলস</Item>
      </Grid>
    </Box>
  );
};

export default OtherInfo;
