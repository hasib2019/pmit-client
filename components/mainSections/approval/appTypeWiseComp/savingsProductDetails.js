/* eslint-disable @next/next/no-img-element */
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import IsoIcon from '@mui/icons-material/Iso';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import { Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { dateFormat } from 'service/dateFormat';
import { engToBang } from '../../samity-managment/member-registration/validator';

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
const SavingsProductDetails = ({ allData }) => {

  const { appHistory } = allData;
  const { productMaster, productInterest, productCharge, neccessaryDocument } =
    allData.savingsProduct;
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
        {productMaster.productDescription && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <AutoAwesomeMotionIcon />
              <div style={styleProductText}>
                <small>প্রোডাক্টের বিবরণ: {productMaster.productDescription}</small>
              </div>
            </Paper>
          </Grid>
        )}

        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <ArrowDownwardIcon />
            <div style={styleProductText}>
              <small>
                সেভিংস টাইপ:{' '}
                {productMaster.savingsType == 'R'
                  ? 'সাধারণ সঞ্চয়'
                  : productMaster.savingsType == 'C'
                    ? 'আবর্তক সঞ্চয়'
                    : 'মেয়াদি সঞ্ছয়'}
              </small>
            </div>
          </Paper>
        </Grid>
        <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
          <Paper sx={styleProductIcon}>
            <ArrowUpwardIcon />
            <div style={styleProductText}>
              <small>প্রোডাক্টের কোড: {engToBang(productMaster.productCode)}</small>
            </div>
          </Paper>
        </Grid>
        {productMaster.profitPostingPeriod && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <AssistantDirectionIcon />
              <div style={styleProductText}>
                <small>
                  মুনাফা পোস্টিং পিরিয়ডের নাম:{' '}
                  {productMaster.profitPostingPeriod == 'Y'
                    ? 'বার্ষিক'
                    : productMaster.profitPostingPeriod == 'MAT'
                      ? 'ম্যাচুরিটি'
                      : 'অর্ধ বার্ষিক'}{' '}
                </small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.fineAllow && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>বিলম্বিত চার্জ {productMaster.fineAllow ? 'হ্যাঁ' : 'না'}</small>
              </div>
            </Paper>
          </Grid>
        )}

        {productMaster.insStartDay && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>কিস্তির শুরুর দিন {engToBang(productMaster.insStartDay)}</small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.insEndDay && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>কিস্তির শেষের দিন {engToBang(productMaster.insEndDay)}</small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.insHolidayConsideration && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>ছুটির দিন বিবেচনা {productMaster.insHolidayConsideration ? 'হ্যাঁ' : 'না'}</small>
              </div>
            </Paper>
          </Grid>
        )}

        {productMaster.maxDefaultInsAllow && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>সর্বোচ্চ ডিফল্ট কিস্তির সংখ্যা {engToBang(productMaster.maxDefaultInsAllow)}</small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.defaultAction && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <AssistantDirectionIcon />
              <div style={styleProductText}>
                <small>ডিফল্টার অ্যাকশন নাম: {productMaster.defaultAction == 'WARN' ? 'সতর্ক করা' : 'ক্লোজ'}</small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.afterMaturityInsMaxAllow && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>মেয়াদপূর্তির পর কিস্তির অনুমতি {productMaster.afterMaturityInsMaxAllow ? 'হ্যাঁ' : 'না'}</small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.maturityMaxDay && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>
                  মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন) {engToBang(productMaster.maturityMaxDay)}
                </small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.maturityAmtInstruction && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <AssistantDirectionIcon />
              <div style={styleProductText}>
                <small>
                  ম্যাচুরিটি প্রক্রিয়ার নাম:{' '}
                  {productMaster.maturityAmtInstruction == 'FA' ? 'নির্দিষ্ট পরিমাণ' : 'মুনাফা হার'}
                </small>
              </div>
            </Paper>
          </Grid>
        )}

        {productMaster.minInsAmt && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>সর্বনিম্ন কিস্তির পরিমাণ: {engToBang(productMaster.minInsAmt)} /-</small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.maxInsAmt && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowUpwardIcon />
              <div style={styleProductText}>
                <small>সর্বোচ্চ কিস্তির পরিমাণ: {engToBang(productMaster.maxInsAmt)} /-</small>
              </div>
            </Paper>
          </Grid>
        )}
        {productMaster.depMultiplyBy && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <ArrowDownwardIcon />
              <div style={styleProductText}>
                <small>কিস্তির হারের গুণিতক: {productMaster.depMultiplyBy}</small>
              </div>
            </Paper>
          </Grid>
        )}

        {productMaster.realizableSavings && (
          <Grid item md={2} sm={4} xs={6} style={styleProductCard}>
            <Paper sx={styleProductIcon}>
              <AssistantDirectionIcon />
              <div style={styleProductText}>
                <small>আদায়যোগ্য সঞ্চয়: {productMaster.realizableSavings}</small>
              </div>
            </Paper>
          </Grid>
        )}
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
            &nbsp;<h3>প্রোডাক্ট মুনাফা</h3>
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
                  <TableCell>কার্যকর তারিখ</TableCell>
                  <TableCell align="center">কিস্তির পরিমাণ</TableCell>
                  <TableCell align="center">মুনাফার হার </TableCell>
                  <TableCell align="center">সময়কাল (মাসিক)</TableCell>
                  <TableCell align="center">ম্যাচুরিটি পরিমাণ</TableCell>
                  <TableCell align="center">সক্রিয় কিনা?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productInterest?.map((val, inx) => (
                  <TableRow key={inx}>
                    <TableCell>{engToBang(dateFormat(val.effectDate))}</TableCell>
                    <TableCell align="center">{engToBang(val.insAmt)}</TableCell>
                    <TableCell align="center">{engToBang(val.profitRate)}</TableCell>
                    <TableCell align="center">{engToBang(val.duration)}</TableCell>
                    <TableCell align="center">{engToBang(val.maturityAmount)}</TableCell>
                    <TableCell align="center">{val.status ? 'হ্যাঁ' : 'না'}</TableCell>
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
            <IsoIcon />
            &nbsp;<h3>প্রোডাক্ট প্রিম্যাচুর সেটআপ</h3>
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
                  <TableCell align="center">মুনাফার হার </TableCell>
                  <TableCell align="center">সময়কাল (মাসিক)</TableCell>
                  <TableCell align="center">ম্যাচুরিটি পরিমাণ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productInterest?.map((val, inx) =>
                  val?.productPreMature?.map((value) => (
                    <TableRow key={inx}>
                      <TableCell align="center">{engToBang(value.profitRate)}</TableCell>
                      <TableCell align="center">{engToBang(value.timePeriod)}</TableCell>
                      <TableCell align="center">{engToBang(value.maturityAmount)}</TableCell>
                    </TableRow>
                  )),
                )}
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
                    <StyledTableCell sx={{ color: 'green' }}>{engToBang(val.chargeCreditGlName)}</StyledTableCell>
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
            <ListAltIcon />
            &nbsp;<h3>ডকুমেন্ট তথ্য</h3>
          </div>
          <Divider />
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="flex-start" mb={3}>
        <Grid item md={12} sm={12} xs={12}>
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
                    {/* <StyledTableCell sx={{ width: "35%" }}>
                      বাধ্যতামূলক নির্দেশ
                    </StyledTableCell> */}
                    <StyledTableCell sx={{ width: '30%' }}>বাধ্যতামূলক?</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {neccessaryDocument?.map((v, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>{v.docFullName}</StyledTableCell>
                      <StyledTableCell>{v.status ? 'হ্যাঁ' : 'না'}</StyledTableCell>
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

export default SavingsProductDetails;
