import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { engToBang } from '../../../../samity-managment/member-registration/validator';

const SlabWiseLoanTable = ({ data, editDataInd }) => {
  return (
    <>
      <Grid container>
        <TableContainer className="table-container">
          <Table aria-label="customized table" size="small">
            <TableHead className="table-head">
              <TableRow>
                <TableCell align="center">ঋণ নম্বর</TableCell>
                <TableCell align="right">সর্বনিম্ন টাকা</TableCell>
                <TableCell align="right">সর্বোচ্চ টাকা</TableCell>
                <TableCell align="center">পূর্বের ঋণের ব্যাবধান (দিন)</TableCell>
                <TableCell align="center">সঞ্চয়ের শতকরা হার</TableCell>
                <TableCell align="center">শেয়ারের শতকরা হার</TableCell>
                <TableCell align="center">সম্পাদনা</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell scope="row" align="center">
                    {item?.loanNumber === null ? 'বিদ্যমান নেই' : engToBang(item?.loanNumber)}
                  </TableCell>
                  <TableCell scope="row" align="right">
                    {' '}
                    {item?.lowestAmount === null ? 'বিদ্যমান নেই' : engToBang(item?.lowestAmount)}
                  </TableCell>
                  <TableCell scope="row" align="right">
                    {item?.highestAmount === null ? 'বিদ্যমান নেই' : engToBang(item?.highestAmount)}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.pastLoanDifference === null ? 'বিদ্যমান নেই' : engToBang(item?.pastLoanDifference)}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.perOfSavings === null ? 'বিদ্যমান নেই' : engToBang(item?.perOfSavings)}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.perOfShares === null ? 'বিদ্যমান নেই' : engToBang(item?.perOfShares)}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {
                      <Button className="button-edit" onClick={() => editDataInd(idx)}>
                        <EditIcon className="edit-icon" />
                      </Button>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default SlabWiseLoanTable;
