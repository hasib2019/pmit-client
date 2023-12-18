import React from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  // Select,
  // FormControl,
  // InputLabel,
  Autocomplete,
  // Button,
  // MenuItem,
} from '@mui/material';
import { useFormikContext, FieldArray } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getStore } from 'features/inventory/item-store/item-store-slice';
import SubHeading from 'components/shared/others/SubHeading';
import { bangToEng, engToBang } from 'service/numberConverter';
const ExcelEntryTable = () => {
  const dispatch = useDispatch();
  const { allStores } = useSelector((state) => state.itemStore);
  const formik = useFormikContext();
  const { values, touched, errors, setFieldValue } = formik;

  useEffect(() => {
    dispatch(getStore());
  }, []);
  return (
    <>
      {values.excelEntryData?.length > 0 ? (
        <>
          <SubHeading>মালামালের তালিকা</SubHeading>
          <FieldArray name="excelEntryData">
            {() => {
              return (
                <TableContainer className="table-container">
                  <Table className="input-table table-alt" aria-label="customized table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">ক্রমিক</TableCell>
                        <TableCell>নাম</TableCell>
                        <TableCell>ক্যাটাগরি</TableCell>
                        <TableCell>গ্রুপ</TableCell>

                        <TableCell align="center">একক</TableCell>
                        <TableCell align="center"> পরিমাণ</TableCell>
                        <TableCell>স্টোরের নাম</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.excelEntryData?.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{engToBang(index + 1)}</TableCell>
                          <TableCell>{values.excelEntryData[index].itemName}</TableCell>
                          <TableCell>{values.excelEntryData[index].categoryName}</TableCell>
                          <TableCell>{values.excelEntryData[index].groupName}</TableCell>

                          <TableCell align="center">{values.excelEntryData[index].unitName}</TableCell>
                          <TableCell className="input-center">
                            <TextField
                              sx={{ width: '80px' }}
                              name="quantity"
                              onChange={(e) => {
                                const { value } = e.target;
                                const obj = values.excelEntryData;
                                const engValue = bangToEng(value);
                                obj[index].quantity = engValue.replace(/\D/gi, '');
                                setFieldValue('excelEntryData', obj);
                              }}
                              value={engToBang(values.excelEntryData[index].quantity)}
                            />
                          </TableCell>
                          <TableCell width="300px">
                            <Autocomplete
                              name={`excelEntryData${index}.storeName`}
                              key={values.excelEntryData[index].storeName}
                              size="small"
                              fullWidth
                              value={values.excelEntryData[index].storeName}
                              onChange={(e, value) => {
                                const obj = values.excelEntryData;

                                obj[index].storeName = value;
                                setFieldValue('excelEntryData', obj);
                              }}
                              options={allStores}
                              getOptionLabel={(option) => option.storeName}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={Boolean(
                                    touched?.excelEntryData &&
                                      errors?.excelEntryData &&
                                      touched?.excelEntryData[index]?.storeName &&
                                      errors?.excelEntryData[index]?.storeName?.id,
                                  )}
                                />
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              );
            }}
          </FieldArray>
        </>
      ) : null}
    </>
  );
};
export default React.memo(ExcelEntryTable);
