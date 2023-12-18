import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Grid, Paper } from '@mui/material';
import { engToBang } from 'service/numberConverter';
import { tableCellClasses } from '@mui/material/TableCell';
// import { dateFormat } from 'service/dateFormat';
import { styled } from '@mui/material/styles';
import SubHeading from 'components/shared/others/SubHeading';
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
const StoreInMigrationApprovalDetails = (props) => {
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  // const { migratedItems } = props.allData | [];
  return (
    <>
      {props?.allData?.migratedItems?.length > 0 ? (
        <TableContainer className="table-container">
          <Table className="input-table table-alt" aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">ক্রমিক</TableCell>
                <TableCell>নাম</TableCell>
                <TableCell>ক্যাটাগরি</TableCell>
                <TableCell>গ্রুপ</TableCell>

                <TableCell align="center"> পরিমাণ</TableCell>
                <TableCell align="center">একক</TableCell>
                <TableCell>স্টোরের নাম</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props?.allData?.migratedItems?.map((data, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{engToBang(index + 1)}</TableCell>
                  <TableCell>{data.itemName}</TableCell>
                  <TableCell>{data.categoryName}</TableCell>
                  <TableCell>{data.groupName}</TableCell>

                  <TableCell>{engToBang(data.quantity)}</TableCell>

                  <TableCell align="center">{data.unitName}</TableCell>
                  <TableCell>{data.storeName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
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
export default StoreInMigrationApprovalDetails;
