/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2023-01-10 15:47:04
 * @modify date 2023-01-11 15:02:45
 * @desc [description]
 */

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import BalanceTable from '../../migration/BalanceTable';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    fontSize: 15,
    color: '#1A374D',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 17,
    color: '#146356',
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
const updateFieldOfficer = ({ allData }) => {
  const { applicationInfo, history } = allData;

  // const editData = applicationInfo.filter(val => val.id != null);
  // const newData = applicationInfo.filter(val => val.id == null);

  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  return (
    <Grid container>
      <Grid item md={12} sm={12} xs={12}>
        <Paper
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
          }}
        >
          <BalanceTable data={applicationInfo?.data?.glDetails} />

          <TableContainer className="hvr-underline-from-center hvr-shadow" sx={{ marginTop: '20px' }}>
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
                {history
                  ? history.map((v, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>{v.nameBn}</StyledTableCell>
                      <StyledTableCell>{v.actionText}</StyledTableCell>
                      <StyledTableCell>
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
                  ))
                  : ' '}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default updateFieldOfficer;
