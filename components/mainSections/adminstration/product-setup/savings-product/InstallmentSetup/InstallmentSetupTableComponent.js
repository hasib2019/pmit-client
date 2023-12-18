import React from 'react';
import { Grid, TableContainer, TableCell, TableHead, TableRow, TableBody, Table, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';

const InstallmentSetupTableComponent = ({ data, editDataFunc }) => {
  return (
    <>
      {data?.length >= 1 && (
        <Grid container className="section">
          <TableContainer className="table-container">
            <Table aria-label="customized table" size="small">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">কিস্তির পরিমাণ</TableCell>
                  <TableCell align="center">স্ট্যাটাস</TableCell>
                  <TableCell align="center">সম্পাদনা</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length >= 1 &&
                  data.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell scope="row" align="center">
                        {item?.installmentAmount === null ? (
                          <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                        ) : (
                          engToBang(item?.installmentAmount)
                        )}
                      </TableCell>

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

export default InstallmentSetupTableComponent;
