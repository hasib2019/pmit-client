import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ZoomImage from 'service/ZoomImage';
import { dateFormat } from 'service/dateFormat';
import SubHeading from '../../../shared/others/SubHeading';
import { engToBang } from '../../samity-managment/member-registration/validator';

const DpsClose = ({ allData }) => {
  const { applicationInfo, history } = allData;
  function createMarkup(value) {
    return {
      __html: value,
    };
  }

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  return (
    <>
      <SubHeading>সাধারণ তথ্য</SubHeading>
      <Grid container display="flex">
        <Grid item md={8} xs={12} className="app-details-box">
          <Typography>
            <span className="label">প্রকল্পের নাম : &nbsp;</span>
            {applicationInfo && applicationInfo.projectNameBangla}
          </Typography>
          <Typography>
            <span className="label">প্রোডাক্টের নাম : &nbsp;</span>
            {applicationInfo && applicationInfo.productName}
          </Typography>
          <Typography>
            <span className="label">সমিতির নাম: &nbsp;</span> {applicationInfo && applicationInfo.samityName}{' '}
          </Typography>
          <Typography>
            <span className="label">সদস্যের নাম:&nbsp;</span> {applicationInfo && applicationInfo.nameBn}
          </Typography>
          <Typography>
            <span className="label">পিতার নাম:&nbsp;</span> {applicationInfo && applicationInfo.fatherName}
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
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
            type={imageType(applicationInfo?.memberPicture)}
          />
        </Grid>
      </Grid>

      {/* <Grid container display="flex">
        <SubHeading>সদস্যের হিসাব সংক্রান্ত তথ্য</SubHeading>
        <Grid item md={6} xs={12}>
        <Typography>
              <span className="label">প্রকল্পের নাম : &nbsp;</span>
              {applicationInfo && applicationInfo.projectNameBangla}
            </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
        <Typography>
              <span className="label">প্রকল্পের নাম : &nbsp;</span>
              {applicationInfo && applicationInfo.projectNameBangla}
            </Typography>
        </Grid>
      </Grid> */}
      <Grid container className="section" spacing={1}>
        <Grid item md={12} sm={12} xs={12}>
          <SubHeading>লেনদেন সংক্রান্ত তথ্য</SubHeading>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="right">টাকার পরিমান (টাকা)</TableCell>
                  <TableCell align="center">কিস্তির সংখ্যা</TableCell>
                  <TableCell align="center"> পরিশোধিত কিস্তির সংখ্যা </TableCell>
                  <TableCell align="center">ম্যাচুরিটির সময়</TableCell>
                  <TableCell align="right">ম্যাচুরিটি পরিমাণ (টাকা)</TableCell>
                  {/* <TableCell align="center">মুনাফার হার (%)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className="table-data-right">
                    {applicationInfo.currentBalance ? engToBang(applicationInfo.currentBalance) : ' '}
                  </TableCell>
                  <TableCell className="table-data-center">
                    {applicationInfo.totalIns ? engToBang(applicationInfo.totalIns) : ' '}
                  </TableCell>
                  <TableCell className="table-data-center">{engToBang(applicationInfo.paidIns)}</TableCell>
                  <TableCell align="center">
                    {applicationInfo.maturityDate ? engToBang(dateFormat(applicationInfo.maturityDate)) : ' '}
                  </TableCell>
                  <TableCell className="table-data-right">
                    {applicationInfo.maturityAmount ? engToBang(applicationInfo.maturityAmount) : ' '}
                  </TableCell>
                  {/* <TableCell align="center">
                    {applicationInfo.intRate
                      ? engToBang(applicationInfo.intRate)
                      : " "}
                  </TableCell> */}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <TableContainer className="hvr-underline-from-center hvr-shadow" sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <Table size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: '#B8FFF9' }}>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>মন্তব্যকারীর নাম</TableCell>
              <TableCell sx={{ width: '30%' }}>কার্যক্রম</TableCell>
              <TableCell sx={{ width: '30%' }}>মন্তব্য</TableCell>
              <TableCell sx={{ width: '30%' }}>সংযুক্তি</TableCell>
              <TableCell sx={{ width: '10%' }}>তারিখ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(history) &&
              history.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.nameBn}</TableCell>
                  <TableCell>{v.actionText}</TableCell>
                  <TableCell>
                    {' '}
                    <div dangerouslySetInnerHTML={createMarkup(v.remarks)} />
                  </TableCell>
                  <TableCell style={{ color: 'blue', fontSize: '16px' }}>
                    <a href={v.attachment.fileNameUrl}>
                      {' '}
                      {v.attachment.fileNameUrl ? 'ডাউনলোড করুন' : 'সংযুক্তি নেই'}{' '}
                    </a>
                  </TableCell>
                  <TableCell>{v.actionDate}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DpsClose;
