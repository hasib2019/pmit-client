import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
const StoreInMigrationApprovalDetails = (props) => {
  console.log('prospps10', props);
  const { migratedItems } = props.allData | [];
  return (
    <>
      {migratedItems.length > 0 ? (
        <TableContainer className="table-container">
          <Table className="input-table table-alt" aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">ক্রমিক</TableCell>
                <TableCell>গ্রুপ</TableCell>
                <TableCell>ক্যাটাগরি</TableCell>
                <TableCell>নাম</TableCell>
                <TableCell align="center">একক</TableCell>
                <TableCell align="center"> পরিমাণ</TableCell>
                <TableCell>স্টোরের নাম</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {migratedItems?.map((data, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{data.groupName}</TableCell>
                  <TableCell>{data.categoryName}</TableCell>
                  <TableCell>{data.itemName}</TableCell>
                  <TableCell align="center">{data.unitName}</TableCell>
                  <TableCell>{data.quantity}</TableCell>
                  <TableCell>{data.storeName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </>
  );
};
export default StoreInMigrationApprovalDetails;
