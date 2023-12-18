import {
  Grid,
  Typography,
  TableCell,
  TableRow,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
} from '@mui/material';
import ItemReturnApprovalTable from './itemReturnApprovalTable';
import { tableCellClasses } from '@mui/material/TableCell';
// import { dateFormat } from 'service/dateFormat';
import { styled } from '@mui/material/styles';
import SubHeading from 'components/shared/others/SubHeading';
import { engToBang } from 'service/numberConverter';
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

const ReturnedItemsApprovalDetails = (props) => {
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  return (
    <>
      <Grid
        item
        xs={12}
        className="table-container"
        sx={{ margin: '0rem 0rem 1rem' }}
        // sx={{
        //   boxShadow: "0 0 10px -5px rgba(0,0,0,0.5)",
        //   borderRadius: "10px",
        //   padding: "1rem",
        //   margin: "1rem 0 2rem",
        // }}
      >
        <Grid item md={12} lg={12} xs={12} sx={{ margin: '0.5rem 0.5rem' }}>
          <Typography variant="h8" fontWeight="bold">
            স্টোরে মালামাল ফেরতের অনুরোধ{' '}
          </Typography>
        </Grid>
        <Grid item md={12} lg={12} xs={12} sx={{ margin: '0rem 0.5rem' }}>
          <div>
            <span className="info">আবেদনকারীর নাম :&nbsp;</span>
            {props?.allData?.appData?.userName}
          </div>
        </Grid>
        <Grid item md={12} lg={12} xs={12} sx={{ margin: '0.5rem 0.5rem' }}>
          <div>
            <span className="info">আবেদনকারীর পদবী :&nbsp;</span>
            {props?.allData?.appData?.designation}
          </div>
        </Grid>
      </Grid>
      <ItemReturnApprovalTable {...props} isItemStatusChangable={false} />
      {+props?.allData?.approval?.serviceActionId === 3 ? (
        <div style={{ marginTop: '1rem' }}>
          {' '}
          <ItemReturnApprovalTable {...props} isItemStatusChangable={true} />
        </div>
      ) : (
        ''
      )}
      <Grid item md={12} lg={12} xs={12}>
        <SubHeading>আবেদনের তথ্য</SubHeading>
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
                {props?.allData?.appData?.history?.map((v, i) => (
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
                    <StyledTableCell>{engToBang(v.actionDate)}</StyledTableCell>
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
export default ReturnedItemsApprovalDetails;
