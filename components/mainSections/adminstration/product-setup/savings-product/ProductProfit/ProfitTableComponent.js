import React from 'react';
import { Grid, TableContainer, TableCell, TableHead, TableRow, TableBody, Table, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { dateFormat } from 'service/dateFormat';

const ProfitTableComponent = ({ data, editDataFunc, savings }) => {
  return (
    <>
      {data.length >= 1 && (
        <Grid container className="section">
          <TableContainer className="table-container">
            <Table aria-label="customized table" size="small">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">কার্যকরী তারিখ</TableCell>
                  <TableCell align="center">কিস্তির পরিমাণ</TableCell>
                  <TableCell align="center">মুনাফার হার</TableCell>
                  {(savings == 'C' || savings == 'F') && (
                    <>
                      <TableCell align="center">সময়কাল (মাসিক)</TableCell>
                      <TableCell align="center">ম্যাচুরিটি পরিমাণ</TableCell>
                    </>
                  )}

                  <TableCell align="center">স্ট্যাটাস</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length >= 1 &&
                  data.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell scope="row" align="center">
                        {item?.effectDate === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(dateFormat(item?.effectDate))
                        )}
                      </TableCell>
                      <TableCell scope="row" align="center">
                        {item?.effectDate === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(item?.insAmt)
                        )}
                      </TableCell>
                      <TableCell scope="row" align="center">
                        {item?.profitRate === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(item?.profitRate)
                        )}
                      </TableCell>
                      {(savings == 'C' || savings == 'F') && (
                        <>
                          <TableCell scope="row" align="center">
                            {item?.duration === null ? (
                              <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                            ) : (
                              engToBang(item?.duration)
                            )}
                          </TableCell>
                          <TableCell scope="row" align="center">
                            {item?.maturityAmount === null ? (
                              <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                            ) : (
                              engToBang(item?.maturityAmount)
                            )}
                          </TableCell>
                        </>
                      )}

                      <TableCell scope="row" align="center">
                        {item?.status === true ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
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

export default ProfitTableComponent;
