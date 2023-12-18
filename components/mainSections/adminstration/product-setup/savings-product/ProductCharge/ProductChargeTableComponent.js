import React from 'react';
import { Grid, TableContainer, TableCell, TableHead, TableRow, TableBody, Table, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { dateFormat } from 'service/dateFormat';

const ProductChargeTableComponent = ({ data, editDataFunc }) => {
  return (
    <>
      {data?.length >= 1 && (
        <Grid container className="section">
          <TableContainer className="table-container">
            <Table aria-label="customized table" size="small">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">চার্জের নাম</TableCell>
                  <TableCell align="center">কার্যকর তারিখ</TableCell>
                  <TableCell align="center">চার্জের পরিমাণ</TableCell>
                  <TableCell align="center">চার্জের ক্রেডিট জি.এল</TableCell>
                  <TableCell align="center">অবস্থা</TableCell>
                  <TableCell align="center">সম্পাদনা</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length >= 1 &&
                  data.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell scope="row" align="center">
                        {item?.chargeName === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(item?.chargeTypeDesc)
                        )}
                      </TableCell>
                      <TableCell scope="row" align="center">
                        {item?.effectDate === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(dateFormat(item?.effectDate))
                        )}
                      </TableCell>
                      <TableCell scope="row" align="center">
                        {item?.chargeAmount === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(item?.chargeAmount)
                        )}
                      </TableCell>
                      <TableCell scope="row" align="center">
                        {item?.chargeGl === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(item?.glacName)
                        )}
                      </TableCell>
                      <TableCell scope="row" align="center">
                        {item?.chargeActive === true ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </TableCell>

                      <TableCell scope="row" align="center">
                        {
                          <Button className="button-edit" onClick={() => editDataFunc(idx)}>
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
      )}
    </>
  );
};

export default ProductChargeTableComponent;
