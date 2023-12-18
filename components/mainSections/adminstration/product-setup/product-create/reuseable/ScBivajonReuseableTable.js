import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { engToBang } from '../../../../samity-managment/member-registration/validator';

const ScBivajonReuseableTable = ({ data, editDataInd }) => {
  return (
    <>
      <Grid container>
        <TableContainer className="table-container">
          <Table aria-label="customized table" size="small">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>খাতের নাম</TableCell>
                <TableCell align="center">শতকরা হার(%)</TableCell>
                <TableCell>জেনারেল লেজার নাম</TableCell>
                <TableCell align="center">সক্রিয় কিনা?</TableCell>
                <TableCell align="center">সম্পাদনা</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell scope="row">
                    {item?.sectorFullName === null ? (
                      'বিদ্যমান নেই'
                    ) : (
                      <Tooltip title={<div className="tooltip-title">{item?.sectorFullName}</div>}>
                        <span className="data">{item?.sectorFullName}</span>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.percentage === null ? 'বিদ্যমান নেই' : engToBang(item?.percentage)}
                  </TableCell>
                  <TableCell scope="row">
                    {item?.generalLedgerFullName === null ? (
                      'বিদ্যমান নেই'
                    ) : (
                      <Tooltip title={<div className="tooltip-title">{item?.generalLedgerFullName}</div>}>
                        <span className="data">{item?.generalLedgerFullName}</span>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.activeToggle === true ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
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

export default ScBivajonReuseableTable;
