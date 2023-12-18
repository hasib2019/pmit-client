/* eslint-disable @next/next/no-img-element */
import { Box, Grid } from '@mui/material';
import ZoomImage from 'service/ZoomImage';
import { engToBang } from 'service/numberConverter';
import SubHeading from '../../../shared/others/SubHeading';





const LoanAdjustmentApplication = ({ allData }) => {
  const { applicationInfo } = allData;

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      <Grid container className="section">
        <SubHeading>সমিতি ও সদস্যের তথ্য</SubHeading>

        <Grid container spacing={2.5} sx={{ padding: '0 1rem' }}>
          <Grid item md={6} xs={12}>
            <Box className="modal-box">
              <div className="info">
                <span className="label">প্রকল্পের নাম</span>
                <b>: &nbsp;</b>
                {applicationInfo?.projectInfo?.projectNameBangla}
              </div>
              <div className="info">
                <span className="label">সমিতি কোড</span>
                <b>: &nbsp;</b>
                {engToBang(applicationInfo?.samityMemberInfo?.samityCode)}
              </div>
              <div className="info">
                <span className="label">সমিতির নাম</span>
                <b>: &nbsp;</b>
                {applicationInfo?.samityMemberInfo?.samityName}
              </div>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box className="modal-box">
              <div className="info">
                <span className="label">সদস্যের কোড</span>
                <b>: &nbsp;</b>
                {engToBang(applicationInfo?.samityMemberInfo?.customerCode)}
              </div>
              <div className="info">
                <span className="label">সদস্যের নাম</span>
                <b>: &nbsp;</b>
                {applicationInfo?.samityMemberInfo?.customerName}
              </div>
              <div className="info">
                <span className="label">মোবাইল নম্বর</span>
                <b>: &nbsp;</b>
                {engToBang(applicationInfo?.samityMemberInfo?.mobile)}
              </div>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <div className="info" style={{ border: '2px solid black', textAlign: 'center' }}>
              <span className="label">সদস্যের ছবি</span>
              <ZoomImage
                src={applicationInfo?.documentInfo?.memberPictureUrl}
                divStyle={{
                  display: 'flex',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                }}
                imageStyle={{
                  height: '100px',
                  width: '100px',
                }}
                key={1}
                type={imageType(applicationInfo?.documentInfo?.memberPictureUrl)}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ flexWrap: { md: 'unset', xs: 'wrap' }, gap: '1.5rem' }}>
        <Grid item>
          <Grid container className="section">
            <SubHeading>সঞ্চয় হিসাব সংক্রান্ত তথ্য</SubHeading>
            <Grid container spacing={2} sx={{ padding: '0 1rem' }}>
              <Grid item xs={12}>
                <Box className="modal-box">
                  <div className="info">
                    <span className="label">প্রোডাক্টের নাম</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.depositAccountInfo?.productName
                      ? applicationInfo.depositAccountInfo.productName
                      : ''}
                  </div>
                  <div className="info">
                    <span className="label">হিসাবের শিরোনাম</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.depositAccountInfo?.accountTitle
                      ? applicationInfo.depositAccountInfo.accountTitle
                      : ''}
                  </div>
                  <div className="info">
                    <span className="label">হিসাব নম্বর</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.depositAccountInfo?.accountNo
                      ? `${engToBang(applicationInfo.depositAccountInfo.accountNo)} `
                      : ''}
                  </div>
                  <div className="info">
                    <span className="label">সর্বমোট স্থিতি</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.depositAccountInfo?.currentBalance
                      ? `${engToBang(applicationInfo.depositAccountInfo.currentBalance.toLocaleString('bn-BD'))} টাকা`
                      : `${engToBang('0')} টাকা`}
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container className="section">
            <SubHeading>ঋণ হিসাব সংক্রান্ত তথ্য</SubHeading>
            <Grid container spacing={2} sx={{ padding: '0 1rem' }}>
              <Grid item xs={12}>
                <Box className="modal-box">
                  <div className="info">
                    <span className="label">প্রোডাক্টের নাম</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.loanAccountInfo?.productName ? applicationInfo.loanAccountInfo.productName : ''}
                  </div>
                  <div className="info">
                    <span className="label">হিসাবের শিরোনাম</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.loanAccountInfo?.accountTitle ? applicationInfo.loanAccountInfo.accountTitle : ''}
                  </div>
                  <div className="info">
                    <span className="label">হিসাব নম্বর</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.loanAccountInfo?.accountNo
                      ? `${engToBang(applicationInfo.loanAccountInfo.accountNo)} `
                      : ''}
                  </div>
                  <div className="info">
                    <span className="label">সর্বমোট ঋণ বকেয়া</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.loanAccountInfo?.currentBalance
                      ? `${engToBang(applicationInfo.loanAccountInfo.currentBalance.toLocaleString('bn-BD'))} টাকা`
                      : `${engToBang('0')} টাকা`}
                  </div>
                  <div className="info">
                    <span className="label">সমন্বয়ের পরিমান</span>
                    <b>: &nbsp;</b>
                    {applicationInfo?.adjustmentAmount
                      ? `${engToBang(applicationInfo.adjustmentAmount.toLocaleString('bn-BD'))} টাকা`
                      : `${engToBang('0')} টাকা`}
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LoanAdjustmentApplication;
