import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import AppTitle from '../../../shared/others/AppTitle';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
    fontSize: 15,
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
          <Grid container spacing={2.5} display="flex">
            {/* <Grid item md={6}>
                            <AppTitle>
                                <Typography variant="h6"> পূর্ববর্তী মাঠকর্মীদের তালিকা </Typography>
                            </AppTitle>
                            <TableContainer className="hvr-underline-from-center hvr-shadow">
                                <Table size="small" aria-label="a dense table">
                                    <TableHead sx={{ backgroundColor: "#C0D8C0" }}>
                                        <TableRow>
                                            <StyledTableCell sx={{ width: "20%" }}>
                                                কর্মকর্তা/কর্মচারীর নাম
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ width: "20%" }}>
                                                পদবী
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ width: "30%" }}>
                                                অফিসের নাম
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {applicationInfo &&
                                            applicationInfo.previousFieldOfficer &&
                                            applicationInfo.previousFieldOfficer.map((v, i) => {
                                                return (
                                                    <StyledTableRow key={i}>
                                                        <StyledTableCell>{v.employeeName}</StyledTableCell>
                                                        <StyledTableCell>{v.designationBn}</StyledTableCell>
                                                        <StyledTableCell>{v.officeName}</StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid> */}
            <Grid item md={12}>
              <AppTitle>
                <Typography variant="h6"> সংশোধনের জন্য প্রেরিত মাঠকর্মীদের তালিকা </Typography>
              </AppTitle>
              <TableContainer className="hvr-underline-from-center hvr-shadow">
                <Table size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#C0D8C0' }}>
                    <TableRow>
                      <StyledTableCell sx={{ width: '20%' }}>কর্মকর্তা/কর্মচারীর নাম</StyledTableCell>
                      <StyledTableCell sx={{ width: '20%' }}>পদবী</StyledTableCell>
                      <StyledTableCell sx={{ width: '30%' }}>অফিসের নাম</StyledTableCell>
                      <StyledTableCell sx={{ width: '30%' }}>স্ট্যাটাস</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicationInfo &&
                      applicationInfo.updateFoInfo &&
                      applicationInfo.updateFoInfo.map((list, i) => {
                        return (
                          <StyledTableRow key={i}>
                            <StyledTableCell>{list.employeeName}</StyledTableCell>
                            <StyledTableCell>{list.designationBn}</StyledTableCell>
                            <StyledTableCell>{list.officeName}</StyledTableCell>
                            <StyledTableCell>{list.changeStatus == 'N' ? 'নতুন' : 'বাতিল'}</StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

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
