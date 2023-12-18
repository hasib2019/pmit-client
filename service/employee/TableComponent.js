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
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
import { numberToWord } from 'service/numberToWord';
const TableComponent = ({
  columnNames,
  tableData,
  tableDataKeys,
  editFunction,
  tableTitle,

  salaries,
}) => {
  const determineTableBodyCell = (key, i, data) => {
    if (key === 'index') {
      return <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + (i + 1) + '')}</TableCell>;
    } else if (key === 'button') {
      return (
        <TableCell sx={{ textAlign: 'center' }}>
          <Button className="table-icon edit" onClick={() => editFunction(data)}>
            <EditIcon sx={{ display: 'block' }} />
          </Button>
        </TableCell>
      );
    } else if (key === 'textfield') {
      return (
        <TableCell>
          <TextField
            size="small"
            value={salaries[i]?.salary}
            onChange={(e) => {
              editFunction(i, e);
            }}
          />
        </TableCell>
      );
    } else {
      return (
        <TableCell align="center">
          {key === 'status' && data[key] == true
            ? 'সক্রিয়'
            : key === 'status' && data[key] == false
            ? 'নিস্ক্রিয়'
            : data[key]}
        </TableCell>
      );
    }
  };
  if (tableData.length === 0) {
    return null;
  }

  return (
    <>
      <Grid item lg={12} md={12} xs={12}>
        <Box>
          <SubHeading>{tableTitle}</SubHeading>

          <TableContainer className="table-container">
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  {columnNames.map((data, i) => (
                    <>
                      <TableCell sx={{ textAlign: 'center' }}>{data}</TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.map((data, index) => {
                  return (
                    <>
                      <TableRow>
                        {tableDataKeys?.map((key, i) => {
                          return determineTableBodyCell(key, index, data);
                        })}
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </>
  );
};
export default TableComponent;
