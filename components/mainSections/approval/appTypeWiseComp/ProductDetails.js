import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import IsoIcon from '@mui/icons-material/Iso';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import { dateFormat } from 'service/dateFormat';
import { engToBang } from '../../samity-managment/member-registration/validator';

import { Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

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
const styleProductCard = {
  position: 'relative',
};
const styleProductIcon = {
  padding: '10px',
  color: '#466a5b',
  textAlign: 'center',
  height: '100%',
  '&:hover': {
    boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
  },
};
const styleProductText = {
  display: 'flex',
  justifyContent: 'center',
  color: 'black',
  fontSize: '14px',
  paddingTop: '5px',
};
const ProductDetails = ({ allData }) => {

  const { appHistory } = allData;
  const {
    productMaster,
    productServiceCharge,
    serviceChargeBivajon,
    productCharge,
    slabWiseLoanAmount,
    necessaryDocument,
  } = allData.product;

  function createMarkup(value) {
    return {
      __html: value,
    };
  }


  //Object.entries(productMaster).map(val=>("val", val[0], val[1]))

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
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <AssuredWorkloadIcon />
            <div style={styleProductText}>
              <small>প্রোডাক্টের নাম: {productMaster.productName}</small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <AutoAwesomeMotionIcon />
            <div style={styleProductText}>
              <small>প্রোডাক্ট জিএল: {productMaster.productGl}</small>
            </div>
          </Paper>
        </Grid>

        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <ArrowDownwardIcon />
            <div style={styleProductText}>
              <small>সর্বনিম্ন ঋণের পরিমাণ: {engToBang(productMaster.lowestLoanAmount)} /-</small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <ArrowUpwardIcon />
            <div style={styleProductText}>
              <small>সর্বোচ্চ ঋণের পরিমাণ: {engToBang(productMaster.highestLoanAmount)} /-</small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <AssistantDirectionIcon />
            <div style={styleProductText}>
              <small>রিপেমেন্ট ফ্রিকোয়েন্সি: {productMaster.repaymentRequency == 'M' ? 'মাসিক' : 'সাপ্তাহিক'}</small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <AutoModeIcon />
            <div style={styleProductText}>
              <small>গ্রেস পিরিয়ড: {productMaster.gracePeriod ? productMaster.gracePeriod : 'বিদ্যমান নেই'}</small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <DisplaySettingsIcon />
            <div style={styleProductText}>
              <small>মূলধন জিএল: {productMaster.capitalGl}</small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <DynamicFormIcon />
            <div style={styleProductText}>
              <small>সার্ভিস চার্জ জিএল: {productMaster.serviceChargeGl}</small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <EqualizerIcon />
            <div style={styleProductText}>
              <small>ইনস্যুরেন্স জিএল: {productMaster.insuranceGl ? productMaster.insuranceGl : 'বিদ্যমান নেই'}</small>
            </div>
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
            <IsoIcon />
            &nbsp;<h3>প্রোডাক্ট সার্ভিস চার্জ</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item md={12} sm={10} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">সার্ভিস চার্জের হার</TableCell>
                  <TableCell>কার্যকর তারিখ</TableCell>
                  <TableCell align="center">বিলম্বিত সার্ভিস চার্জের হার</TableCell>
                  <TableCell align="center">মেয়াদউত্তীর্ণ সার্ভিস চার্জের হার</TableCell>
                  <TableCell align="center">সক্রিয় কিনা?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productServiceCharge.map((val, inx) => (
                  <TableRow key={inx}>
                    <TableCell>{engToBang(val.serviceChargeRate)}</TableCell>
                    <TableCell>{engToBang(dateFormat(val.startDate))}</TableCell>
                    <TableCell align="center">{engToBang(val.lateServiceChargeRate)}</TableCell>
                    <TableCell align="center">{engToBang(val.expireServiceChargeRate)}</TableCell>
                    <TableCell align="center">{val.activeToggle ? 'হ্যাঁ' : 'না'}</TableCell>
                  </TableRow>
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
            &nbsp;<h3>সার্ভিস চার্জ বিভাজন ও ডকুমেন্ট তথ্য</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>

      <Grid px={2} container spacing={1} justifyContent="flex-start" mb={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Paper
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              padding: '10px',
            }}
          >
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
                      <StyledTableCell>{engToBang(val.sectorFullName)}</StyledTableCell>
                      <StyledTableCell>{engToBang(val.percentage)}</StyledTableCell>
                      <StyledTableCell>{engToBang(val.generalLedgerName)}</StyledTableCell>
                      <StyledTableCell>{val.activeToggle ? 'হ্যাঁ' : 'না'}</StyledTableCell>
                    </StyledTableRow>
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
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#C3E5AE' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '35%' }}>ডকুমেন্টের ধরন</StyledTableCell>
                    <StyledTableCell sx={{ width: '35%' }}>বাধ্যতামূলক নির্দেশ</StyledTableCell>
                    <StyledTableCell sx={{ width: '30%' }}>বাধ্যতামূলক?</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {necessaryDocument.map((v, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>{v.docFullName}</StyledTableCell>
                      <StyledTableCell>{v.manInsructions}</StyledTableCell>
                      <StyledTableCell>{v.mendatory ? 'হ্যাঁ' : 'না'}</StyledTableCell>
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

      <Grid container>
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
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(dateFormat(val.startDate))}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{val.chargeFullName}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.chargeAmount)}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.chargeCreditgl)}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{val.chargeActive ? 'হ্যাঁ' : 'না'}</StyledTableCell>
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

      <Grid container>
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
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.loanNumber)}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.lowestAmount)}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.highestAmount)}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.pastLoanDifference)}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.perOfSavings)}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.perOfShares)}</StyledTableCell>
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
            <h3>আবেদনের তথ্য</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>

      <Grid item md={12} sm={12} xs={12}>
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
                {appHistory.map((v, i) => (
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
                    <StyledTableCell>{engToBang(dateFormat(v.actionDate))}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
};

export default ProductDetails;
