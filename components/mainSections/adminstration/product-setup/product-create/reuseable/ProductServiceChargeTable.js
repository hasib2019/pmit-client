import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { dateFormat } from 'service/dateFormat';
import { engToBang } from '../../../../samity-managment/member-registration/validator';

const ProductServiceChargeTable = ({ data, editDataInd }) => {
  return (
    <>
      <Grid container className="section">
        <TableContainer className="table-container">
          <Table aria-label="customized table" size="small">
            <TableHead className="table-head">
              <TableRow>
                <TableCell align="center">সার্ভিস চার্জ (%)</TableCell>
                <TableCell align="center">বিলম্বিত চার্জ (%)</TableCell>
                <TableCell align="center">মেয়াদত্তীর্ন চার্জ (%)</TableCell>
                <TableCell align="center">কার্যকরের তারিখ</TableCell>
                <TableCell align="center">অবস্থা</TableCell>
                <TableCell align="center">সম্পাদনা</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell scope="row" align="center">
                    {item?.serviceChargeRate === null ? (
                      <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                    ) : (
                      engToBang(item?.serviceChargeRate)
                    )}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.lateServiceChargeRate === null ? (
                      <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                    ) : (
                      engToBang(item?.lateServiceChargeRate)
                    )}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.expireServiceChargeRate === null ? (
                      <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                    ) : (
                      engToBang(item?.expireServiceChargeRate)
                    )}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {item?.startDate === null ? (
                      <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                    ) : item?.startDate ? (
                      dateFormat(item.startDate)
                    ) : (
                      ''
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

export default ProductServiceChargeTable;
