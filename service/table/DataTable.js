import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { numberToWord } from 'service/numberToWord';

export default function DataTable(props) {
  const { columns, rows, rowsName } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function getDescendantProp(obj, name) {
    let desc = '';
    const v = Object.values(name);
    for (const [index, element] of v.entries()) {
      if (index == v.length - 1) {
        desc = desc + element;
      } else {
        desc = desc + element + '.';
      }
    }
    var arr = desc.split('.');
    while (arr.length && (obj = obj[arr.shift()]));

    return obj;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{numberToWord('' + (index + 1) + '')}</TableCell>
                  {rowsName.map((name, i) => (
                    <TableCell key={i} align={columns[i].align} sx={{ minWidth: columns[i].minWidth }}>
                      {getDescendantProp(row, name)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

////////////////////////////////////// Note How to use Reusable Data Table ///////////////////////////

// const columns = [
//     {   id: 0,
//         label: 'ক্রমিক',
//         minWidth: 30,
//         align: 'left',
//     },
//     {   id: 1,
//         label: 'সেবার নাম',
//         minWidth: '100px',
//         align: 'left',
//     },
//     {
//         id: 2,
//         label: 'অবস্থান',
//         minWidth: 170,
//         align: 'left',
//         // format: (value) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 3,
//         label: 'মন্তব্য',
//         minWidth: 170,
//         align: 'left',
//         // format: (value) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 4,
//         label: '',
//         minWidth: 170,
//         align: 'right',
//         // format: (value) => value.toFixed(2),
//     },
//   ]

//   const rowsName = [
//     {
//       0: 'applicationData',
//       1: 'serviceName'
//     }, {
//       0: 'applicationData',
//       1: 'designationName',
//     }
//   ]

// rows = table data array

{
  /* <DataTable columns={columns} rows={filterSamityData} rowsName={rowsName}/> */
}
