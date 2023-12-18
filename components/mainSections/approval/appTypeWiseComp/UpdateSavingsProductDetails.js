/* eslint-disable no-prototype-builtins */
/* eslint-disable @next/next/no-img-element */
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import { Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { dateFormat } from 'service/dateFormat';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const labelObj = {
  newIntPostPeriod: 'আবেদনকৃত মুনাফা পোস্টিং পিরিয়ডের নাম',
  oldIntPostPeriod: 'পুরাতন মুনাফা পোস্টিং পিরিয়ডের নাম',

  newInsStartDay: 'আবেদনকৃত কিস্তির শুরুর দিন',
  oldInsStartDay: 'পুরাতন কিস্তির শুরুর দিন',
  newInsEndDay: 'আবেদনকৃত কিস্তির শেষের দিন',
  oldInsEndDay: 'পুরাতন কিস্তির শেষের দিন',
  oldProductCode: 'পুরাতন প্রোডাক্ট কোড',
  newProductCode: 'আবেদনকৃত প্রোডাক্ট কোড',
  oldFineAllow: 'পুরাতন বিলম্বিত চার্জ',
  newFineAllow: 'আবেদনকৃত বিলম্বিত চার্জ',
  oldInsHolidayConsideration: 'পুরাতন ছুটির দিন বিবেচনা',
  newInsHolidayConsideration: 'আবেদনকৃত ছুটির দিন বিবেচনা',
  oldDefaultAction: 'পুরাতন ডিফল্টার অ্যাকশন নাম ',
  newDefaultAction: 'আবেদনকৃত ডিফল্টার অ্যাকশন নাম',
  oldMaxDefaultInsAllow: 'পুরাতন সর্বোচ্চ ডিফল্ট কিস্তির সংখ্যা',
  newMaxDefaultInsAllow: 'আবেদনকৃত সর্বোচ্চ ডিফল্ট কিস্তির সংখ্যা',
  newRealizableSavings: 'আবেদনকৃত আদায়যোগ্য সঞ্চয়',
  oldRealizableSavings: 'পুরাতন আদায়যোগ্য সঞ্চয়',
  oldRepFrq: 'পুরাতন রিপেমেন্ট ফ্রিকোয়েন্সি',
  newRepFrq: 'আবেদনকৃত রিপেমেন্ট ফ্রিকোয়েন্সি',
  oldOpenDate: 'পুরাতন শুরুর তারিখ',
  newOpenDate: 'আবেদনকৃত শুরুর তারিখ',
  oldProductName: 'পুরাতন প্রোডাক্টের নাম',
  newProductName: 'আবেদনকৃত প্রোডাক্টের নাম',
  oldNumberOfInstallment: 'পুরাতন কিস্তি আদায়ের সংখ্যা',
  newNumberOfInstallment: 'আবেদনকৃত কিস্তি আদায়ের সংখ্যা',
  oldMaxInsAmt: 'পুরাতন সর্বোচ্চ কিস্তির পরিমাণ',
  newMaxInsAmt: 'আবেদনকৃত সর্বোচ্চ কিস্তির পরিমাণ',
  oldMinInsAmt: 'পুরাতন সর্বনিম্ন কিস্তির পরিমাণ',
  newMinInsAmt: 'আবেদনকৃত সর্বনিম্ন কিস্তির পরিমাণ',
  oldMaturityMaxDay: 'পুরাতন মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন)',
  newMaturityMaxDay: 'আবেদনকৃত মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন)',
  newMaturityAmtInstruction: 'আবেদনকৃত ম্যাচুরিটি প্রক্রিয়ার নাম',
  oldMaturityAmtInstruction: 'পুরাতন ম্যাচুরিটি প্রক্রিয়ার নাম',
  oldAfterMaturityInsMaxAllow: 'পুরাতন মেয়াদপূর্তির পর কিস্তির অনুমতি',
  newAfterMaturityInsMaxAllow: 'আবেদনকৃত মেয়াদপূর্তির পর কিস্তির অনুমতি',
  oldDepMultiplyBy: 'পুরাতন কিস্তির হারের গুণিতক',
  newDepMultiplyBy: 'আবেদনকৃত কিস্তির হারের গুণিতক',
};
const UpdateSavingsProductDetails = ({ allData }) => {
  // const { appHistory } = allData;
  const { productMaster, productInterest, productCharge, productDocuments, history } =
    allData.updateSavingsProduct;
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  return (
    <>
      <Grid container p={1}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'green',
            }}
          >
            <FactCheckIcon />
            &nbsp;<h3>প্রোডাক্ট মাস্টার</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ marginY: '10px' }}>
        <Grid item md={12} xs={12}>
          {Object.keys(productMaster).length >= 1 &&
            Object.keys(productMaster).map((elem, i) => (
              <Box sx={{ display: 'inline', visibility: 'visible', margin: '10px' }} key={1}>
                {labelObj[elem]} {'-'} {productMaster[elem]}
                {i % 2 == '1' && <br />}
              </Box>
            ))}
        </Grid>
      </Grid>
      <Grid container p={1}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'green',
            }}
          >
            <RuleFolderIcon />
            &nbsp;<h3>প্রোডাক্টের মুনাফা</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>
      <Grid container my={3}>
        <Grid
          item
          md={12}
          sm={10}
          xs={12}
          sx={{
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            padding: '10px',
          }}
        >
          &nbsp;<h4>প্রোডাক্টের মুনাফা(পূর্ববর্তী)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#FEFFE2' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>কার্যকর তারিখ</StyledTableCell>
                  <StyledTableCell sx={{ width: '16%', align: 'left' }}>কিস্তির পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '8%', align: 'left' }}>মুনাফার হার</StyledTableCell>
                  <StyledTableCell sx={{ width: '8%', align: 'left' }}>সময়কাল</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>ম্যাচুরিটি পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সক্রিয় কিনা?</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productInterest.map((val, inx) => (
                  <>
                    {val?.old && (
                      <StyledTableRow key={inx}>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.effectDate ? engToBang(val.old.effectDate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.insAmt ? engToBang(val.old.insAmt) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.intRate ? engToBang(val.old.intRate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.timePeriod ? engToBang(val.old.timePeriod) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.maturityAmount ? engToBang(val.old.maturityAmount) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old.hasOwnProperty('isActive') ? (val.old.status == true ? 'হ্যাঁ' : 'না') : ''}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          &nbsp;<h4>প্রোডাক্টের মুনাফা(পরবর্তী/নতুন)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#FEFFE2' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>কার্যকর তারিখ</StyledTableCell>
                  <StyledTableCell sx={{ width: '16%', align: 'left' }}>কিস্তির পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '8%', align: 'left' }}>মুনাফার হার</StyledTableCell>
                  <StyledTableCell sx={{ width: '8%', align: 'left' }}>সময়কাল</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>ম্যাচুরিটি পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সক্রিয় কিনা?</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productInterest.map((val, inx) => (
                  <>
                    {val?.new && (
                      <StyledTableRow key={inx}>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.new?.effectDate ? engToBang(val.new.effectDate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val.new?.insAmt ? val.new.insAmt : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.new?.intRate ? val.new.intRate : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.new?.timePeriod ? val.new.timePeriod : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.new?.maturityAmount ? val.new.maturityAmount : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.new.hasOwnProperty('isActive') ? (val.new.status == true ? 'হ্যাঁ' : 'না') : ''}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container p={1}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'green',
            }}
          >
            <RuleFolderIcon />
            &nbsp;<h3>প্রোডাক্টের চার্জ</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>
      <Grid container my={3}>
        <Grid
          item
          md={12}
          sm={10}
          xs={12}
          sx={{
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            padding: '10px',
          }}
        >
          &nbsp;<h4>প্রোডাক্ট চার্জ(পূর্ববর্তী)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#FEFFE2' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>কার্যকর তারিখ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>চার্জের নাম</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>চার্জের পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>চার্জ ক্রেডিট জি.এল</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সক্রিয় কিনা?</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productCharge.map((val, inx) => (
                  <>
                    {val?.old && (
                      <StyledTableRow key={inx}>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.effectDate ? engToBang(val.old.effectDate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.chargeName ? engToBang(val.old.chargeName) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val.old?.chargeValue ? engToBang(val.old.chargeValue) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.chargeGlName ? engToBang(val.old.chargeGlName) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old.hasOwnProperty('isActive') ? (val.old.isActive == true ? 'হ্যাঁ' : 'না') : ''}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          &nbsp;<h4>প্রোডাক্ট চার্জ(পরবর্তী/নতুন)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#FEFFE2' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>কার্যকর তারিখ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>চার্জের নাম</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>চার্জের পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>চার্জ ক্রেডিট জি.এল</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সক্রিয় কিনা?</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productCharge.map((val, inx) => (
                  <StyledTableRow key={inx}>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.effectDate ? engToBang(dateFormat(val.new.effectDate)) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.chargeName ? val.new.chargeName : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val.new?.chargeValue ? engToBang(val.new.chargeValue) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.chargeGlName ? val.new.chargeGlName : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new.hasOwnProperty('isActive') ? (val.new.isActive == true ? 'হ্যাঁ' : 'না') : ''}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container p={1}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'green',
            }}
          >
            <ListAltIcon />
            &nbsp;<h3>ডকুমেন্ট তথ্য</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>
      {/* <Grid px={2} container spacing={1} justifyContent="flex-start" mb={3}> */}
      <Grid container my={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Paper
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              padding: '10px',
            }}
          >
            <TableContainer className="hvr-underline-from-center hvr-shadow">
              &nbsp;<h4>ডকুমেন্ট তথ্য(পূর্ববর্তী)</h4>
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#C3E5AE' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '55%' }}>ডকুমেন্টের ধরন</StyledTableCell>
                    <StyledTableCell sx={{ width: '45%' }}>বাধ্যতামূলক?</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDocuments.map((v, i) => (
                    <>
                      {v?.old && (
                        <StyledTableRow key={i}>
                          <StyledTableCell>{v?.old?.docTypeName ? v.old.docTypeName : ''}</StyledTableCell>
                          <StyledTableCell>
                            {v?.old?.hasOwnProperty('isMandatory') ? (v.old.isMandatory == true ? 'হ্যাঁ' : 'না') : ''}
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Paper
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              padding: '10px',
            }}
          >
            <TableContainer className="hvr-underline-from-center hvr-shadow">
              &nbsp;<h4>ডকুমেন্ট তথ্য(পরবর্তী/নতুন)</h4>
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#C3E5AE' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '55%' }}>ডকুমেন্টের ধরন</StyledTableCell>

                    <StyledTableCell sx={{ width: '45%' }}>বাধ্যতামূলক?</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDocuments.map((v, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>{v?.new?.docTypeName ? v.new.docTypeName : ''}</StyledTableCell>
                      <StyledTableCell>
                        {v?.new?.hasOwnProperty('isMandatory') ? (v.new.isMandatory == true ? 'হ্যাঁ' : 'না') : ''}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <Grid container p={1}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'green',
            }}
          >
            <h3>আবেদনের তথ্য</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>

      <Grid item md={12} sm={12} xs={12} mb={2}>
        <Paper
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            padding: '10px',
          }}
        >
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#B8FFF9' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '20%' }}>মন্তব্যকারীর নাম</StyledTableCell>
                  <StyledTableCell sx={{ width: '30%' }}>কার্যক্রম</StyledTableCell>
                  <StyledTableCell sx={{ width: '30%' }}>মন্তব্য</StyledTableCell>
                  <StyledTableCell sx={{ width: '30%' }}>সংযুক্তি</StyledTableCell>
                  <StyledTableCell sx={{ width: '10%' }}>তারিখ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((v, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell>{v.nameBn}</StyledTableCell>
                    <StyledTableCell>{v.actionText}</StyledTableCell>
                    <StyledTableCell>
                      {' '}
                      <div dangerouslySetInnerHTML={createMarkup(v.remarks)} />
                    </StyledTableCell>
                    <StyledTableCell style={{ color: 'blue', fontSize: '16px' }}>
                      <a href={v.attachment.fileNameUrl}>
                        {' '}
                        {v.attachment.fileNameUrl ? 'ডাউনলোড করুন' : 'সংযুক্তি নেই'}{' '}
                      </a>
                    </StyledTableCell>
                    <StyledTableCell>{v.actionDate}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* <Grid container p={1}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              color: "green",
            }}
          >
            <PlagiarismIcon />
            &nbsp;<h3>ডকুমেন্ট তথ্য</h3>
          </div>
          <Divider />
        </Grid>
      </Grid> */}

      {/* <Grid container my={3}>
          <Grid
            item
            md={12}
            sm={10}
            xs={12}
            sx={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              padding: "10px",
            }}
          >
            <TableContainer className="hvr-underline-from-center hvr-shadow">
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: "#D4ECDD" }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: "20%" }}>
                      ডকুমেন্টের ধরন
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "30%" }}>
                      ডকুমেন্টের নাম্বার
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "30%" }}>
                      ডকুমেন্টের ছবি(ফ্রন্ট)
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "20%" }}>
                    ডকুমেন্টের ছবি(ব্যাক)
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documentList.map((v, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>{v.docTypeName}</StyledTableCell>
                      <StyledTableCell>{v.documentNumber}</StyledTableCell>
                      <StyledTableCell>
                        <Paper
                          // className={Styles.subHeader}
                          sx={{
                            border: "5px solid #71DFE7",
                            width: "80px",
                            height: "50px",
                          }}
                        >
                          <img
                            src={
                              v.documentFront
                                ? flag + v.documentFront
                                : "/store.svg"
                            }
                            style={{
                              margin: "auto",
                              cursor: "pointer",
                              width: "70px",
                              height: "40px",
                            }}
                            name="documentFront"
                            id="documentFront"
                            alt=""
                          />
                        </Paper>
                      </StyledTableCell>
                      <StyledTableCell>{v.backFileName}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid> */}
    </>
  );
};

export default UpdateSavingsProductDetails;
