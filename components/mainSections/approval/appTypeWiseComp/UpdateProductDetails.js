/* eslint-disable no-prototype-builtins */
/* eslint-disable @next/next/no-img-element */
import FactCheckIcon from '@mui/icons-material/FactCheck';
import IsoIcon from '@mui/icons-material/Iso';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
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
  newPrincipalGl: 'আবেদনকৃত আসল এর জি এল',
  oldPrincipalGl: 'পুরাতন আসল এর জি এল',
  newProductGl: 'আবেদনকৃত প্রোডাক্ট এর জি এল',
  oldProductGl: 'পুরাতন প্রোডাক্ট এর জি এল',
  newInsuranceGl: 'আবেদনকৃত ইনস্যুরেন্স এর জি এল',
  oldInsuranceGl: 'পুরাতন ইনস্যুরেন্স এর জি এল',
  newServiceChargeGl: 'আবেদনকৃত সার্ভিস চার্জ এর জি এল',
  oldServiceChargeGl: 'পুরাতন সার্ভিস চার্জ এর জি এল',
  oldProductCode: 'পুরাতন প্রোডাক্ট কোড',
  newProductCode: 'আবেদনকৃত প্রোডাক্ট কোড',
  oldAllowGracePeriod: 'পুরাতন গ্রেস পিরিয়ড প্রযোজ্য',
  newAllowGracePeriod: 'আবেদনকৃত গ্রেস পিরিয়ড প্রযোজ্য',
  oldGracePeriod: 'পুরাতন গ্রেস পিরিয়ড',
  newGracePeriod: 'আবেদনকৃত গ্রেস পিরিয়ড',
  oldSerCrgAtGracePeriod: 'পুরাতন সার্ভিস চার্জ এ গ্রেস পিরিয়ড',
  newSerCrgAtGracePeriod: 'আবেদনকৃত সার্ভিস চার্জ এ গ্রেস পিরিয়ড',
  newGraceAmtRepayIns: 'আবেদনকৃত গ্রেস পিরিয়ডে সার্ভিস চার্জ নির্দেশনা',
  oldGraceAmtRepayIns: 'পুরাতন গ্রেস পিরিয়ডে সার্ভিস চার্জ নির্দেশনা',
  oldMinLoanAmt: 'পুরাতন সর্বনিম্ন ঋণের পরিমান',
  newMinLoanAmt: 'আবেদনকৃত সর্বনিম্ন ঋণের পরিমান',
  oldMaxLoanAmt: 'পুরাতন সর্বোচ্চ ঋণের পরিমান',
  newMaxLoanAmt: 'আবেদনকৃত সর্বোচ্চ ঋণের পরিমান',
  oldRepFrq: 'পুরাতন রিপেমেন্ট ফ্রিকোয়েন্সি',
  newRepFrq: 'আবেদনকৃত রিপেমেন্ট ফ্রিকোয়েন্সি',
  oldOpenDate: 'পুরাতন শুরুর তারিখ',
  newOpenDate: 'আবেদনকৃত শুরুর তারিখ',
  oldProductName: 'পুরাতন প্রোডাক্টের নাম',
  newProductName: 'আবেদনকৃত প্রোডাক্টের নাম',
  oldNumberOfInstallment: 'পুরাতন কিস্তি আদায়ের সংখ্যা',
  newNumberOfInstallment: 'আবেদনকৃত কিস্তি আদায়ের সংখ্যা',
  oldLoanTerm: 'পুরাতন ঋণের মেয়াদ',
  newLoanTerm: 'আবেদনকৃত ঋণের মেয়াদ',
  oldRealizationSeqOd: 'পুরাতন আদায়ের ক্রমানুসার বিলম্বিত চার্জ',
  newRealizationSeqOd: 'আবেদনকৃত আদায়ের ক্রমানুসার বিলম্বিত চার্জ',
  oldRealizationSeqService: 'পুরাতন আদায়ের ক্রমানুসার সার্ভিস চার্জ',
  newRealizationSeqService: 'আবেদনকৃত আদায়ের ক্রমানুসার সার্ভিস চার্জ',
  oldRealizationSeqPrincipal: 'পুরাতন আদায়ের ক্রমানুসার মূলধন',
  newRealizationSeqPrincipal: 'আবেদনকৃত আদায়ের ক্রমানুসার মূলধন',
  oldCalType: 'পুরাতন সার্ভিস চার্জ ক্যালকুলেশনের পদ্ধতি',
  newCalType: 'আবেদনকৃত সার্ভিস চার্জ ক্যালকুলেশনের পদ্ধতি',
  oldAllowInsurance: 'পুরাতন ইনস্যুরেন্স প্রযোজ্য',
  newAllowInsurance: 'আবেদনকৃত ইনস্যুরেন্স প্রযোজ্য',
  oldHolidayEffect: 'পুরাতন হলিডে ইফেক্ট',
  newHolidayEffect: 'আবেদনকৃত হলিডে ইফেক্ট',
  newIsAdvPayBenefit: 'আবেদনকৃত অগ্রিম পেমেন্ট প্রযোজ্য',
  oldIsAdvPayBenefit: 'পুরাতন অগ্রিম পেমেন্ট প্রযোজ্য',
  oldInsurancePercent: 'পুরাতন ইনস্যুরেন্সের শতকরা হার(%)',
  newInsurancePercent: 'আবেদনকৃত ইনস্যুরেন্সের শতকরা হার(%)',
  oldChequeDisbursementFlag: 'পুরাতন চেক বিতরণ প্রযোজ্য',
  newChequeDisbursementFlag: 'আবেদনকৃত চেক বিতরণ প্রযোজ্য',
};
const ProductDetails = ({ allData }) => {
  // const { appHistory } = allData;
  const {
    productMaster,
    productServiceCharge,
    serviceChargeBivajon,
    productCharge,
    slabWiseLoanAmount,
    necessaryDocument,
    history,
  } = allData.updateProduct;
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
            <IsoIcon />
            &nbsp;<h3>প্রোডাক্ট সার্ভিস চার্জ</h3>
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
          &nbsp;<h4>প্রোডাক্ট সার্ভিস চার্জ(পূর্ববর্তী)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#C1FFD7' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সার্ভিস চার্জের হার</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>কার্যকর তারিখ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>বিলম্বিত সার্ভিস চার্জের হার</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>
                    মেয়াদউত্তীর্ণ সার্ভিস চার্জের হার
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সক্রিয় কিনা?</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productServiceCharge.map((val, inx) => (
                  <>
                    {val?.old && (
                      <StyledTableRow key={inx}>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.intRate ? engToBang(val.old.intRate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.effectDate ? engToBang(val.old.effectDate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.currentdueIntRate ? engToBang(val.old.currentdueIntRate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.overdueIntRate ? engToBang(val.old.overdueIntRate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val.old.hasOwnProperty('isActive') ? (val.old.isActive == true ? 'হ্যাঁ' : 'না') : ''}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          &nbsp;<h4>প্রোডাক্ট সার্ভিস চার্জ(পরবর্তী)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#C1FFD7' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সার্ভিস চার্জের হার</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>কার্যকর তারিখ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>বিলম্বিত সার্ভিস চার্জের হার</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>
                    মেয়াদউত্তীর্ণ সার্ভিস চার্জের হার
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সক্রিয় কিনা?</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productServiceCharge.map((val, inx) => (
                  <StyledTableRow key={inx}>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.intRate ? engToBang(val.new.intRate) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.effectDate ? engToBang(dateFormat(val.new.effectDate)) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.currentdueIntRate ? engToBang(val.new.currentdueIntRate) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.overdueIntRate
                        ? val.new?.overdueIntRate
                          ? engToBang(val.new.overdueIntRate)
                          : ''
                        : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val.new.hasOwnProperty('isActive') ? (val.new.isActive == true ? 'হ্যাঁ' : 'না') : ''}
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
            &nbsp;<h3>সার্ভিস চার্জ বিভাজন</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>

      <Grid container my={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Paper
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              padding: '10px',
            }}
          >
            &nbsp;<h4>সার্ভিস চার্জ বিভাজন(পূর্ববর্তী)</h4>
            <TableContainer className="hvr-underline-from-center hvr-shadow">
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#F4EEA9' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '20%' }}>খাতের নাম</StyledTableCell>
                    <StyledTableCell sx={{ width: '20%' }}>শতকরা হার</StyledTableCell>
                    <StyledTableCell sx={{ width: '20%' }}>জিএল এর নাম</StyledTableCell>
                    <StyledTableCell sx={{ width: '20%' }}>সক্রিয় কিনা</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceChargeBivajon.map((val, idx) => (
                    <>
                      {val?.old && (
                        <StyledTableRow key={idx}>
                          <StyledTableCell>
                            {val?.old?.segregationName ? val.old.segregationName : 'হালনাগাদ হয় নি'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {val?.old?.segregationRate ? engToBang(val.old.segregationRate) : 'হালনাগাদ হয় নি'}
                          </StyledTableCell>
                          <StyledTableCell>{val?.old?.glName ? val.old.glName : 'হালনাগাদ হয় নি'}</StyledTableCell>
                          <StyledTableCell>
                            {val.old.hasOwnProperty('isActive') ? (val.old.isActive == true ? 'হ্যাঁ' : 'না') : ''}
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
        <Grid item md={12} sm={12} xs={12}>
          <Paper
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              padding: '10px',
            }}
          >
            &nbsp;<h4>সার্ভিস চার্জ বিভাজন(পরবর্তী/নতুন)</h4>
            <TableContainer className="hvr-underline-from-center hvr-shadow">
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#F4EEA9' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '20%' }}>খাতের নাম</StyledTableCell>
                    <StyledTableCell sx={{ width: '20%' }}>শতকরা হার</StyledTableCell>
                    <StyledTableCell sx={{ width: '20%' }}>জিএল এর নাম</StyledTableCell>
                    <StyledTableCell sx={{ width: '20%' }}>সক্রিয় কিনা</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceChargeBivajon.map((val, idx) => (
                    <StyledTableRow key={idx}>
                      <StyledTableCell>{val?.new?.segregationName ? val.new.segregationName : ''}</StyledTableCell>
                      <StyledTableCell>
                        {val?.new?.segregationRate ? engToBang(val.new.segregationRate) : ''}
                      </StyledTableCell>
                      <StyledTableCell>{val?.new?.glName ? val.new.glName : ''}</StyledTableCell>
                      <StyledTableCell>
                        {val.new.hasOwnProperty('isActive') ? (val.new.isActive == true ? 'হ্যাঁ' : 'না') : ''}
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
            <RuleFolderIcon />
            &nbsp;<h3>প্রোডাক্ট চার্জ</h3>
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
                          {val?.old?.effectDate ? dateFormat(val.old.effectDate) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.chargeName ? val.old.chargeName : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val.old?.chargeValue ? val.old.chargeValue : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.chargeGlName ? val.old.chargeGlName : ''}
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
            <SafetyCheckIcon />
            &nbsp;<h3>স্লাব অনুযায়ী ঋণের পরিমান</h3>
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
          &nbsp;<h4>স্লাব অনুযায়ী ঋণের পরিমান(পূর্ববর্তী)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#F1E9E5' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>ঋণ নাম্বার</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সর্বনিম্ন টাকার পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সর্বোচ্চ টাকার পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>পূর্বের ঋণের ব্যবধান (দিন)</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সঞ্চয়ের শতকরা হার(%)</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>শেয়ারের শতকরা হার(%)</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slabWiseLoanAmount.map((val, inx) => (
                  <>
                    {val?.old && (
                      <StyledTableRow key={inx}>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.loanNo ? engToBang(val.old.loanNo) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.minAmount ? engToBang(val.old.minAmount) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.maxAmount ? engToBang(val.old.maxAmount) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.preDisbInterval ? engToBang(val.old.preDisbInterval) : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.depositPercent == 0 || val?.old?.depositPercent
                            ? engToBang(val.old.depositPercent)
                            : ''}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: 'green' }}>
                          {val?.old?.sharePercent ? engToBang(val.old.sharePercent) : ''}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          &nbsp;<h4>স্লাব অনুযায়ী ঋণের পরিমান(পরবর্তী/নতুন)</h4>
          <TableContainer className="hvr-underline-from-center hvr-shadow">
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#F1E9E5' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>ঋণ নাম্বার</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সর্বনিম্ন টাকার পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সর্বোচ্চ টাকার পরিমাণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>পূর্বের ঋণের ব্যবধান (দিন)</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>সঞ্চয়ের শতকরা হার(%)</StyledTableCell>
                  <StyledTableCell sx={{ width: '12%', align: 'left' }}>শেয়ারের শতকরা হার(%)</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slabWiseLoanAmount.map((val, inx) => (
                  <StyledTableRow key={inx}>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.loanNo ? engToBang(val.new.loanNo) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.minAmount ? engToBang(val.new.minAmount) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.maxAmount ? engToBang(val.new.maxAmount) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.preDisbInterval ? engToBang(val.new.preDisbInterval) : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.depositPercent == 0 || val?.new?.depositPercent
                        ? engToBang(val.new.depositPercent)
                        : ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>
                      {val?.new?.sharePercent ? val.new.sharePercent : ''}
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
                  {necessaryDocument.map((v, i) => (
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
                  {necessaryDocument.map((v, i) => (
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

export default ProductDetails;
