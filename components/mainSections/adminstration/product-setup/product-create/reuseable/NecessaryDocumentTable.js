import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const NecessaryDocumentTable = ({ data, editDataInd }) => {
  return (
    <>
      <Grid container>
        <TableContainer className="table-container">
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell>ডকুমেন্টের নাম</TableCell>
                <TableCell>বাধ্যতামূলক</TableCell>
                <TableCell align="center">সম্পাদনা</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell scope="row">{item?.docFullName === null ? 'বিদ্যমান নেই' : item?.docFullName}</TableCell>
                  <TableCell scope="row">{item?.mendatory === true ? 'বাধ্যতামূলক' : 'বাধ্যতামূলক নয়'}</TableCell>
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

export default NecessaryDocumentTable;
