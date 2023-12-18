/* eslint-disable @next/next/no-img-element */
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { engToBang } from 'service/numberConverter';
import SubHeading from '../../../shared/others/SubHeading';
const LoanShedule = ({ allData }) => {
  const { applicationInfo, transaction, history, memberInfo } = allData;

  const transactionType = transaction.type;
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  return (
    <>
      <Grid container className="section">
        <SubHeading>সদস্যের তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>সদস্যের নাম</TableCell>
                <TableCell>সদস্য কোড</TableCell>
                <TableCell>মোবাইল নং</TableCell>
                <TableCell>সমিতির নাম</TableCell>
                <TableCell>সমিতি কোড</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{memberInfo.nameBn}</TableCell>
                <TableCell>{engToBang(memberInfo.customerCode)}</TableCell>
                <TableCell>{engToBang(memberInfo.mobile)}</TableCell>
                <TableCell>{applicationInfo.samityName}</TableCell>
                <TableCell>{engToBang(applicationInfo.samityCode)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid container className="section">
        <SubHeading>লেনদেন সংক্রান্ত তথ্য</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item md={12} sm={12} xs={12}>
            <TableContainer className="table-container">
              <Table size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="right">ঋণের পরিমান (টাকা)</TableCell>
                    <TableCell align="center">ঋণের মেয়াদ (মাস)</TableCell>
                    <TableCell align="right">কিস্তির পরিমান (টাকা)</TableCell>
                    <TableCell align="center">কিস্তির সংখ্যা</TableCell>
                    <TableCell align="right">পূর্ববর্তী ঋণ বিতরনের পরিমাণ(টাকা)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="right">
                      {applicationInfo.loanAmount ? engToBang(applicationInfo.loanAmount) : ' '}
                    </TableCell>
                    <TableCell align="center">
                      {applicationInfo.loanTerm ? engToBang(applicationInfo.loanTerm) : ' '}
                    </TableCell>
                    <TableCell align="right">
                      {applicationInfo.installmentAmount ? engToBang(applicationInfo.installmentAmount) : ' '}
                    </TableCell>
                    <TableCell align="center">
                      {applicationInfo.installmentNo ? engToBang(applicationInfo.installmentNo) : ' '}
                    </TableCell>
                    <TableCell align="right">
                      {applicationInfo.disbursedAmount ? engToBang(applicationInfo.disbursedAmount) : ' '}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <TableContainer className="table-container">
              <Table size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  {transactionType == 'cheque' && (
                    <TableRow>
                      <TableCell>লেনদেনের ধরন</TableCell>
                      <TableCell>ব্যাংকের নাম</TableCell>
                      <TableCell>ব্রাঞ্চের নাম</TableCell>
                      <TableCell>অ্যাকাউন্ট নাম্বার</TableCell>
                      <TableCell align="right">ঋণ বিতরনের পরিমাণ(টাকা)</TableCell>
                    </TableRow>
                  )}
                  {transactionType == 'cash' && (
                    <TableRow>
                      <TableCell>লেনদেনের ধরন</TableCell>
                      <TableCell>লেনদেনের বিবরণ</TableCell>
                      <TableCell align="right">ঋণ বিতরনের পরিমাণ(টাকা)</TableCell>
                    </TableRow>
                  )}
                </TableHead>
                <TableBody>
                  {transactionType == 'cheque' && (
                    <TableRow>
                      <TableCell>চেক</TableCell>
                      <TableCell>{transaction.bankName}</TableCell>
                      <TableCell>{transaction.branchName}</TableCell>
                      <TableCell>{engToBang(transaction.accountNo)}</TableCell>
                      <TableCell align="right">{engToBang(transaction.disbursedAmount)}</TableCell>
                    </TableRow>
                  )}
                  {transactionType == 'cash' && (
                    <TableRow>
                      <TableCell>নগদ</TableCell>
                      <TableCell>{transaction.narration}</TableCell>
                      <TableCell align="right">{engToBang(transaction.disbursedAmount)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <TableContainer className="table-container">
              <Table size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>মন্তব্যকারীর নাম</TableCell>
                    <TableCell>কার্যক্রম</TableCell>
                    <TableCell>মন্তব্য</TableCell>
                    <TableCell>সংযুক্তি</TableCell>
                    <TableCell>তারিখ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history
                    ? history.map((v, i) => (
                      <TableRow key={i}>
                        <TableCell>{v.nameBn}</TableCell>
                        <TableCell>{v.actionText}</TableCell>
                        <TableCell>
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
                    ))
                    : ' '}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LoanShedule;
