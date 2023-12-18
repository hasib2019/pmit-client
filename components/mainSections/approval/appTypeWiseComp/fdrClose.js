import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
import { dateFormat } from 'service/dateFormat';
import { engToBang } from 'service/numberConverter';
const FdrClose = ({ allData }) => {
  const { applicationInfo } = allData;

  return (
    <>
      <Grid container className="section" display="flex">
        <Grid item md={12} sm={12} xs={12}>
          <SubHeading>সদস্যের সাধারণ তথ্য</SubHeading>
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography>
            <span className="label">সদস্যের নাম : &nbsp;</span>
            {applicationInfo && applicationInfo.nameBn}
          </Typography>
          <Typography>
            <span className="label">সমিতির নাম : &nbsp;</span>
            {applicationInfo && applicationInfo.samityName}
          </Typography>
          <Typography>
            <span className="label">প্রকল্পের নাম: &nbsp;</span> {applicationInfo && applicationInfo.projectNameBangla}{' '}
          </Typography>
          <Typography>
            <span className="label">প্রোডাক্টের নাম:&nbsp;</span> {applicationInfo && applicationInfo.productName}
          </Typography>
        </Grid>
      </Grid>
      <Grid container className="section" spacing={1}>
        <Grid item md={12} sm={12} xs={12}>
          <SubHeading>লেনদেন সংক্রান্ত তথ্য</SubHeading>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="right">অ্যাকাউন্ট নম্বর</TableCell>
                  <TableCell align="center">এফডিআর এর পরিমাণ</TableCell>
                  <TableCell align="center">এফডিআর এর মেয়াদ (বছর)</TableCell>
                  <TableCell align="center">এফডিআর শুরুর তারিখ</TableCell>
                  <TableCell align="center">এফডিআর ক্লোজের তারিখ</TableCell>
                  <TableCell align="right">মুনাফার পরিমাণ (টাকা)</TableCell>
                  <TableCell align="center">মুনাফার হার (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className="table-data-right">
                    {applicationInfo.accountNo ? engToBang(applicationInfo.accountNo) : ' '}
                  </TableCell>
                  <TableCell className="table-data-center">
                    {applicationInfo.fdrAmt ? engToBang(applicationInfo.fdrAmt) : ' '}
                  </TableCell>
                  <TableCell className="table-data-center">
                    {applicationInfo.fdrDuration ? engToBang(applicationInfo.fdrDuration / 12) : ''}
                  </TableCell>
                  <TableCell align="center">
                    {applicationInfo.effDate ? dateFormat(applicationInfo.effDate) : ''}
                  </TableCell>
                  <TableCell className="table-data-right">
                    {applicationInfo.expDate ? dateFormat(applicationInfo.expDate) : ''}
                  </TableCell>
                  <TableCell align="center">
                    {applicationInfo.profitAmount ? engToBang(applicationInfo.profitAmount) : ' '}
                  </TableCell>
                  <TableCell align="center">
                    {applicationInfo.intRate ? engToBang(applicationInfo.intRate) : ' '}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default FdrClose;
