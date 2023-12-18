/* eslint-disable @next/next/no-img-element */
import { Box, Grid } from '@mui/material';
import ZoomImage from 'service/ZoomImage';
import { engToBang } from 'service/numberConverter';
import SubHeading from '../../../shared/others/SubHeading';





const LoanSettlementApplication = ({ allData }) => {
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

        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            {/* <Typography>
              <span className="label">প্রকল্পের নাম &nbsp;&nbsp;: &nbsp;</span>{" "}
              {applicationInfo?.projectNameBangla}{" "}
            </Typography>
            <Typography>
              <span className="label">সমিতি কোড &nbsp;&nbsp; : &nbsp;</span>{" "}
              {engToBang(applicationInfo?.samityCode)}{" "}
            </Typography>
            <Typography>
              <span className="label">সমিতির নাম &nbsp;&nbsp; : &nbsp;</span>{" "}
              {applicationInfo?.samityName}{" "}
            </Typography> */}
            <Box className="modal-box">
              <div className="info">
                <span className="label">প্রকল্পের নাম</span>
                <b>: &nbsp;</b>
                {applicationInfo?.projectNameBangla}
              </div>
              <div className="info">
                <span className="label">সমিতি কোড</span>
                <b>: &nbsp;</b>
                {engToBang(applicationInfo?.samityCode)}
              </div>
              <div className="info">
                <span className="label">সমিতির নাম</span>
                <b>: &nbsp;</b>
                {applicationInfo?.samityName}
              </div>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            {/* <Typography>
              <span className="label">সদস্যের কোড &nbsp;&nbsp;: &nbsp;</span>{" "}
              {engToBang(applicationInfo?.customerCode)}{" "}
            </Typography>
            <Typography>
              <span className="label">
                সদস্যের নাম &nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;
              </span>{" "}
              {applicationInfo?.customerName}{" "}
            </Typography>
            <Typography>
              <span className="label">মোবাইল নম্বর &nbsp;&nbsp; : &nbsp;</span>{" "}
              {engToBang(applicationInfo?.mobile)}{" "}
            </Typography> */}
            <Box className="modal-box">
              <div className="info">
                <span className="label">সদস্যের কোড</span>
                <b>: &nbsp;</b>
                {engToBang(applicationInfo?.customerCode)}
              </div>
              <div className="info">
                <span className="label">সদস্যের নাম</span>
                <b>: &nbsp;</b>
                {applicationInfo?.customerName}
              </div>
              <div className="info">
                <span className="label">মোবাইল নম্বর</span>
                <b>: &nbsp;</b>
                {engToBang(applicationInfo?.mobile)}
              </div>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <div className="info" style={{ border: '2px solid black', textAlign: 'center' }}>
              <span className="label">সদস্যের ছবি</span>
              <ZoomImage
                src={applicationInfo?.memberPictureUrl}
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
                type={imageType(applicationInfo?.memberPictureUrl)}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>ঋণ সংক্রান্ত তথ্য</SubHeading>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Box className="modal-box">
              <div className="info">
                <span className="label">প্রোডাক্টের নাম</span>
                <b>: &nbsp;</b>
                {applicationInfo?.productName ? applicationInfo.productName : ''}
              </div>
              <div className="info">
                <span className="label">ঋণের পরিমাণ</span>
                <b>: &nbsp;</b>
                {applicationInfo?.loanAmount
                  ? `${engToBang(applicationInfo.loanAmount.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
              <div className="info">
                <span className="label">সর্বমোট পরিশোধিত ঋণ</span>
                <b>: &nbsp;</b>
                {applicationInfo?.principalPaidAmount
                  ? `${engToBang(applicationInfo.principalPaidAmount.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
              <div className="info">
                <span className="label">বকেয়া আসল</span>
                <b>: &nbsp;</b>
                {applicationInfo?.duePrincipal
                  ? `${engToBang(applicationInfo.duePrincipal.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box className="modal-box">
              <div className="info">
                <span className="label">সার্ভিস চার্জ</span>
                <b>: &nbsp;</b>
                {applicationInfo?.interestAmount
                  ? `${engToBang(applicationInfo.interestAmount.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
              <div className="info">
                <span className="label">পরিশোধিত সার্ভিস চার্জ</span>
                <b>: &nbsp;</b>
                {applicationInfo?.interestPaidAmount
                  ? `${engToBang(applicationInfo.interestPaidAmount.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
              <div className="info">
                <span className="label">বকেয়া সার্ভিস চার্জ</span>
                <b>: &nbsp;</b>
                {applicationInfo?.dueInterest
                  ? `${engToBang(applicationInfo.dueInterest.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
              <div className="info">
                <span className="label">মওকুফকৃত সার্ভিস চার্জ</span>
                <b>: &nbsp;</b>
                {applicationInfo?.interestRebateAmount
                  ? `${engToBang(applicationInfo.interestRebateAmount.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
              <div className="info">
                <span className="label">সর্বমোট</span>
                <b>: &nbsp;</b>
                {applicationInfo?.totalAmount
                  ? `${engToBang(applicationInfo.totalAmount.toLocaleString('bn-BD'))} টাকা`
                  : `${engToBang('0')} টাকা`}
              </div>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LoanSettlementApplication;
