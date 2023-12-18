import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material/';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { PageValue } from '../../../url/coop/PortalApiList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
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

const Financial = () => {
  const config = localStorageData('config');
  const getSamityId = localStorageData('reportsIdPer');
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    getPageValue();
  }, []);

  let getPageValue = async () => {
    try {
      const pageValueData = await axios.get(PageValue + getSamityId, config);
      let pageValueList = pageValueData.data.data.data.mainBudgetData;

      setBudgets(pageValueList);
    } catch (error) {
      //errorHandler(error);
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ px: 2 }}>
        আর্থিক তথ্য
      </Typography>
      <Divider />
      <TableContainer sx={{ px: 1, py: 1 }}>
        <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
            <TableRow>
              <StyledTableCell>ক্রমিক নং</StyledTableCell>
              <StyledTableCell>বাজেট বছর</StyledTableCell>
              <StyledTableCell>জেনারেল লেজার</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'right' }}>পরিমান (টাকা)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets &&
              budgets.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell component="th" scope="row">
                    {numberToWord('' + (i + 1) + '')}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {numberToWord(row.startYear)}-{numberToWord(row.endYear)}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.glacName} - {numberToWord(row.glacCode)}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" sx={{ textAlign: 'right' }}>
                    {numberToWord('' + row.amount + '')}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Financial;
