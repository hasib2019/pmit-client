import AddIcons from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
import moment from 'moment';
import { dateFormat } from './dateFormat';
import engToBanglaDigit from './englishToBanglaDigit';
import { engToBang } from './numberConverter';
import { numberToWord } from './numberToWord';
const TableComponent = ({
  columnNames,
  tableData,
  tableDataKeys,
  editFunction,
  tableTitle,
  tableHeaderButtonHandler,
  salaries,
  dataYouWantoShowInBanglaDigit,
  isPaginationTable,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  paginationTableCount,
  plusButtonTitle,
}) => {
  const showCustomizedData = (data, key) => {
    // if (key == 'installmentServiceChargeAmt') {
    // }
    if (key === 'status' && data[key] == true) {
      return 'সক্রিয়';
    } else if (key === 'status' && data[key] == false) {
      return 'নিস্ক্রিয়';
    } else if (key === 'parentChild' && data[key] === 'P') {
      return 'পেরেন্ট';
    } else if (key === 'parentChild' && data[key] === 'C') {
      return 'চাইল্ড';
    } else if (key === 'glNature' && data[key] === 'C') {
      return 'ক্রেডিট';
    } else if (key === 'glNature' && data[key] === 'D') {
      return 'ডেভিট';
    } else if (key === 'openDate') {
      const date = engToBanglaDigit(dateFormat(data[key]));
      return date;
    } else if (key === 'productCode') {
      return engToBanglaDigit(data[key]);
    } else if (key === 'holiday') {
      const date = engToBanglaDigit(moment(data[key]).format('DD-MM-YYYY'));
      return date;
    } else if (key === 'holidayType' && data['holidayType'] === 'PUB') {
      return 'সরকারি ছুটি';
    } else if (key === 'holidayType' && data['holidayType'] === 'WEK1') {
      return 'সাপ্তাহিক ছুটি (শুক্রবার)';
    } else if (key === 'holidayType' && data['holidayType'] === 'WEK2') {
      return 'সাপ্তাহিক ছুটি (শনিবার)';
    } else if (key === 'principalPaidAmount') {
      console.log('testtest', data[key]);
      return engToBang(data[key]?.toString());
    } else if (key === 'interestPaidAmount') {
      return engToBang(data[key]?.toString());
    } else if (key === 'totalPaidAmount') {
      return engToBang(data[key]?.toString());
    } else {
      if (data[key] === 0) {
        return engToBang(data[key].toString());
      }
      if (typeof data[key] === 'number') {
        return engToBang(data[key]);
      }
      const dateString = data[key];
      const dateObject = new Date(dateString);
      if (!isNaN(dateObject)) {
        return engToBang(data[key]);
      }

      return data[key];
    }
  };
  const determineTableBodyCell = (key, i, data) => {
    if (key === 'index') {
      return <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + (i + 1) + '')}</TableCell>;
    } else if (key === 'button') {
      return (
        <TableCell sx={{ textAlign: 'center' }}>
          <EditIcon className="table-icon edit" onClick={() => editFunction(data)} />
        </TableCell>
      );
    } else if (key === 'textfield') {
      return (
        <TableCell sx={{ textAlign: 'left' }}>
          <TextField
            name="paidsalary"
            required
            type="number"
            value={salaries[i]?.salary}
            variant="outlined"
            size="small"
            onChange={(e) => editFunction(i, e)}
            sx={{ paddingBottom: '10px' }}
          ></TextField>
        </TableCell>
      );
    } else {
      return (
        <TableCell
          sx={{
            textAlign:
              key.includes('Name') || key.includes('nameBn') || key.includes('description') ? 'left' : 'center',
          }}
        >
          {showCustomizedData(data, key, dataYouWantoShowInBanglaDigit)}
        </TableCell>
      );
    }
  };

  return (
    <>
      <Grid item lg={12} md={12} xs={12}>
        <Box>
          {isPaginationTable ? (
            <SubHeading>
              <span>{tableTitle}</span>
              <Button className="btn btn-primary" variant="contained" onClick={tableHeaderButtonHandler} size="small">
                <AddIcons sx={{ display: 'block', mr: 1 }} /> {plusButtonTitle}
              </Button>
            </SubHeading>
          ) : (
            ''
          )}
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  {columnNames.map((data) => (
                    <>
                      <TableCell
                        sx={{
                          textAlign: data.includes('নাম') || data.includes('ছুটির বর্ণনা') ? 'left' : 'center',
                        }}
                      >
                        {data}
                      </TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isPaginationTable
                  ? tableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                    return (
                      <>
                        <TableRow>
                          {tableDataKeys.map((key) => {
                            return determineTableBodyCell(key, index, data);
                          })}
                        </TableRow>
                      </>
                    );
                  })
                  : tableData.map((data, index) => {
                    return (
                      <>
                        <TableRow>
                          {tableDataKeys.map((key) => {
                            return determineTableBodyCell(key, index, data);
                          })}
                        </TableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>

            {isPaginationTable ? (
              <TablePagination
                rowsPerPageOptions={[2, 5, 10, 25]}
                component="div"
                count={paginationTableCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
              />
            ) : (
              ''
            )}
          </TableContainer>
        </Box>
      </Grid>
    </>
  );
};
export default TableComponent;
