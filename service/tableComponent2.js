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

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import SubHeading from 'components/shared/others/SubHeading';
import moment from 'moment';
import { dateFormat } from './dateFormat';
import { default as engToBanglaDigit, default as engToBdNum } from './englishToBanglaDigit';
const TableComponent2 = ({
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
  const showCustomizedData = (data, key, dataYouWantoShowInBanglaDigit) => {
    if (key === 'status' && data[key] == true) {
      return 'সক্রিয়';
    } else if (key === 'status' && data[key] == false) {
      return 'নিস্ক্রিয়';
    } else if (key === 'glacCode') {
      return engToBanglaDigit(data[key]);
    } else if (key === 'parentChild' && data[key] === 'P') {
      return 'প্যারেন্ট';
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
      ('holidayDate');
      const date = engToBanglaDigit(moment(data[key]).format('DD-MM-YYYY'));
      return date;
    } else if (key === 'holidayType' && data['holidayType'] === 'PUB') {
      return 'সরকারি ছুটি';
    } else if (key === 'holidayType' && data['holidayType'] === 'WEK1') {
      return 'সাপ্তাহিক ছুটি (শুক্রবার)';
    } else if (key === 'holidayType' && data['holidayType'] === 'WEK2') {
      return 'সাপ্তাহিক ছুটি (শনিবার)';
    } else {
      if (key.includes('.')) {
        let nestedKeyString = '';
        const nestedKeyArray = key.split('.');
        for (let i = 0; i < nestedKeyArray.length; i++) {
          nestedKeyString += `["${nestedKeyArray[i]}"]`;
        }

        'test', nestedKeyString;
        if (nestedKeyArray.length === 2) {
          if (data[`${nestedKeyArray[0]}`][`${nestedKeyArray[1]}`] === 'Payment Voucher') {
            return 'পেমেন্ট ভাউচার';
          } else if (data[`${nestedKeyArray[0]}`][`${nestedKeyArray[1]}`] === 'Receive Voucher') {
            return 'রিসিভ ভাউচার';
          } else if (data[`${nestedKeyArray[0]}`][`${nestedKeyArray[1]}`] === 'Journal Voucher') {
            return 'জার্নাল ভাউচার';
          } else if (data[`${nestedKeyArray[0]}`][`${nestedKeyArray[1]}`]?.toUpperCase() === 'CASH') {
            return 'নগদ';
          } else if (data[`${nestedKeyArray[0]}`][`${nestedKeyArray[1]}`]?.toUpperCase() === 'TRANSFER') {
            return 'ব্যাংক';
          } else {
            return data[`${nestedKeyArray[0]}`][`${nestedKeyArray[1]}`];
          }
        }
        if (nestedKeyArray.length === 3) {
          return data[`${nestedKeyArray[0]}`][`${nestedKeyArray[1]}`][`${nestedKeyArray[2]}`];
        }

        // return data + nestedKeyString;
      } else {
        return data[key];
      }
    }
  };
  //   glNature
  const determineTableBodyCell = (key, i, data) => {
    if (key === 'index') {
      return <TableCell sx={{ textAlign: 'center' }}>{engToBdNum(i + 1)}</TableCell>;
    } else if (key === 'button') {
      return (
        <TableCell sx={{ textAlign: 'center' }}>
          <EditIcon className="table-icon edit" onClick={() => editFunction(data)} />
        </TableCell>
      );
    } else if (key === 'eyeButton') {
      return (
        <TableCell sx={{ textAlign: 'center' }}>
          <Button variant="outlined" className="table-icon primary" onClick={() => editFunction(data)}>
            <WysiwygIcon sx={{ display: 'block' }} />
          </Button>
        </TableCell>
      );
    } else if (key === 'textfield') {
      return (
        <TableCell sx={{ textAlign: 'center' }}>
          <TextField
            name="paidsalary"
            required
            type="number"
            textAlign="right"
            value={salaries[i]?.salary}
            variant="outlined"
            size="small"
            onChange={(e) => editFunction(i, e)}
            sx={{ paddingBottom: '10px' }}
          ></TextField>
        </TableCell>
      );
    } else if (key === 'deleteButton') {
      return (
        <TableCell sx={{ textAlign: 'center' }}>
          <Button variant="outlined" className="table-icon delete" onClick={() => { }}>
            <RemoveCircleOutlineIcon sx={{ display: 'block' }} />
          </Button>
        </TableCell>
      );
    } else {
      return (
        <TableCell
          sx={{
            textAlign:
              key.includes('Name') || key.includes('name') || key.includes('glacCode') || key.includes('description')
                ? 'left'
                : 'center',
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
          <SubHeading>
            <span>{tableTitle}</span>
            {tableHeaderButtonHandler && (
              <Button
                className="btn btn-primary"
                variant="contained"
                onClick={tableHeaderButtonHandler}
                size="small"
              // disabled={disableGrantorAdd}
              >
                <AddIcons /> {plusButtonTitle}
              </Button>
            )}
          </SubHeading>
          <TableContainer className="table-container">
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  {columnNames.map((data, i) => (
                    <>
                      <TableCell
                        sx={{
                          textAlign:
                            tableDataKeys[i].includes('Name') ||
                              tableDataKeys[i].includes('name') ||
                              tableDataKeys[i].includes('glacCode') ||
                              tableDataKeys[i].includes('description')
                              ? 'left'
                              : 'center',
                        }}
                      >
                        {data}
                      </TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ textAlign: 'center' }}>
                {isPaginationTable
                  ? tableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                    return (
                      <>
                        <TableRow sx={{ textAlign: 'center' }}>
                          {tableDataKeys.map((key, i) => {
                            return determineTableBodyCell(key, index, data);
                          })}
                        </TableRow>
                      </>
                    );
                  })
                  : tableData.map((data, index) => {
                    return (
                      <>
                        <TableRow sx={{ textAlign: 'center' }}>
                          {tableDataKeys.map((key, i) => {
                            return determineTableBodyCell(key, index, data);
                          })}
                        </TableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[2, 5, 10, 25]}
              component="div"
              count={paginationTableCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          </TableContainer>
        </Box>
      </Grid>
    </>
  );
};
export default TableComponent2;
