import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { dateFormat } from 'service/dateFormat';
import { engToBang } from '../../../../samity-managment/member-registration/validator';

const ProductChargeTable = ({ data, editDataInd }) => {
  return (
    <>
      <Grid container>
        <TableContainer className="table-container">
          <Table aria-label="customized table" size="small">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>চার্জের নাম</TableCell>
                <TableCell align="right" width="1%">
                  চার্জের পরিমাণ (টাকা){' '}
                </TableCell>
                <TableCell>চার্জ ক্রেডিট জি. এল.</TableCell>
                <TableCell align="center" width="1%">
                  কার্যকরের তারিখ
                </TableCell>
                <TableCell align="center">অবস্থা</TableCell>
                <TableCell align="center" width="1%">
                  সম্পাদনা
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell scope="row">
                    {item?.chargeFullName === null ? (
                      'বিদ্যমান নেই'
                    ) : (
                      <Tooltip title={<div className="tooltip-title">{item?.chargeFullName}</div>}>
                        <span className="data">{item?.chargeFullName}</span>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell scope="row" align="right">
                    {item?.chargeAmount === null ? 'বিদ্যমান নেই' : engToBang(item?.chargeAmount)}
                  </TableCell>
                  <TableCell scope="row">
                    {item?.chargeCreditGlName === null ? (
                      'বিদ্যমান নেই'
                    ) : (
                      <Tooltip title={<div className="tooltip-title">{item?.chargeCreditGlName}</div>}>
                        <span className="data">{item?.chargeCreditGlName}</span>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.startDate === null ? 'বিদ্যমান নেই' : item?.startDate ? dateFormat(item.startDate) : ''}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.chargeActive === true ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
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

export default ProductChargeTable;
