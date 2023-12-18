import { FieldArray, useFormikContext } from 'formik';
import {
  Grid,
  // Select,
  // MenuItem,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Autocomplete,
  TextField,
  Table,
} from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getCodeMasterValue, getItem } from 'features/inventory/item/itemSlice';
import { getItemRequisitionPurpose } from 'features/inventory/item-requisition/itemRequisitionSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { bangToEng, engToBang } from 'service/numberConverter';
// const itemRequisitionInfoObj = {
//   27: {
//     itemId: 27,
//     allotedQuantity: 2,
//     alreadyDeliveredQuantity: 1,
//     alreadyDeliveredDate: '5-04-2023',
//   },
//   28: {
//     itemId: 28,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   29: {
//     itemId: 29,
//     allotedQuantity: 2,
//     alreadyDeliveredQuantity: 1,
//     alreadyDeliveredDate: '5-04-2023',
//   },
//   30: {
//     itemId: 30,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   31: {
//     itemId: 31,
//     allotedQuantity: 2,
//     alreadyDeliveredQuantity: 1,
//     alreadyDeliveredDate: '5-04-2023',
//   },
//   32: {
//     itemId: 32,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   33: {
//     itemId: 33,
//     allotedQuantity: 2,
//     alreadyDeliveredQuantity: 1,
//     alreadyDeliveredDate: '5-04-2023',
//   },
//   34: {
//     itemId: 34,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   35: {
//     itemId: 35,
//     allotedQuantity: 2,
//     alreadyDeliveredQuantity: 1,
//     alreadyDeliveredDate: '5-04-2023',
//   },
//   36: {
//     itemId: 36,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   37: {
//     itemId: 37,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   38: {
//     itemId: 38,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   39: {
//     itemId: 39,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   40: {
//     itemId: 40,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   41: {
//     itemId: 41,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   42: {
//     itemId: 42,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   43: {
//     itemId: 43,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   44: {
//     itemId: 44,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   45: {
//     itemId: 45,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   46: {
//     itemId: 46,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   47: {
//     itemId: 47,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   48: {
//     itemId: 48,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   49: {
//     itemId: 49,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   50: {
//     itemId: 50,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   51: {
//     itemId: 51,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   52: {
//     itemId: 52,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   53: {
//     itemId: 53,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   54: {
//     itemId: 54,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   55: {
//     itemId: 55,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   56: {
//     itemId: 56,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   57: {
//     itemId: 57,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   58: {
//     itemId: 58,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   59: {
//     itemId: 59,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   60: {
//     itemId: 60,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   61: {
//     itemId: 61,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   62: {
//     itemId: 62,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   63: {
//     itemId: 63,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   64: {
//     itemId: 64,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   65: {
//     itemId: 65,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   66: {
//     itemId: 66,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   67: {
//     itemId: 67,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   67: {
//     itemId: 67,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   68: {
//     itemId: 68,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   69: {
//     itemId: 69,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   70: {
//     itemId: 70,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   81: {
//     itemId: 71,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   80: {
//     itemId: 72,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
//   77: {
//     itemId: 76,
//     allotedQuantity: 6,
//     alreadyDeliveredQuantity: 4,
//     alreadyDeliveredDate: '5-03-2023',
//   },
// };
const regex = /[০-৯.,0-9]$/;
const ItemRequisitionTable = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.itemOrProduct);
  // const { iteRequisitionPurpose } = useSelector((state) => state.itemRequisition);
  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
  const formik = useFormikContext();
  const { values, touched, errors, setFieldValue } = formik;
  useEffect(() => {
    dispatch(getCodeMasterValue('URR'));
    dispatch(getItem());
    dispatch(getItemRequisitionPurpose());
    // return () => {
    //   dispatch(emptyCodeMasterTypes());
    // };
  }, []);
  return (
    <>
      <Grid item md={12} lg={12} xs={12}>
        <SubHeading>ইনভেন্টরি অনুরোধ</SubHeading>
      </Grid>
      <Grid item md={12} lg={12} xs={12}>
        <FieldArray name="itemRequisitionArray">
          {(arrayHelpers) => {
            return (
              <>
                <TableContainer className="table-container">
                  <Table className="input-table table-alt" aria-label="customized table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '25%' }}>মালামালের নাম</TableCell>
                        <TableCell sx={{ width: '10%' }}>মালামালের প্রাপতা</TableCell>
                        <TableCell sx={{ width: '10%' }}>গ্রহনকৃত মালামালের সংখ্যা</TableCell>
                        <TableCell sx={{ width: '20%' }}>গ্রহনের তারিখ</TableCell>
                        <TableCell sx={{ width: '10%' }}>পরিমাণ</TableCell>
                        <TableCell sx={{ width: '20%' }}>চাহিদার প্রয়োজনীয়তা</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.itemRequisitionArray?.map((requisition, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Autocomplete
                              key={values.itemRequisitionArray[index].itemId}
                              size="small"
                              fullWidth
                              name={`values.itemRequisitionArray.${index}.itemId`}
                              value={values.itemRequisitionArray[index].itemId}
                              options={items}
                              getOptionLabel={(option) => option?.itemName}
                              onChange={(e, value) => {
                                const arr = values.itemRequisitionArray;
                                arr[index].itemId = value;
                                arr[index].allotedQuantity = null;
                                arr[index].alreadyDeliveredQuantity = null;
                                arr[index].alreadyDeliveredDate = null;
                                setFieldValue('itemRequisitionArray', arr);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={Boolean(
                                    touched.itemRequisitionArray &&
                                      errors.itemRequisitionArray &&
                                      touched.itemRequisitionArray[index]?.itemId &&
                                      errors.itemRequisitionArray[index]?.itemId,
                                  )}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              disabled
                              size="small"
                              fullWidth
                              name={`values.itemRequisitionArray.${index}.allotedQuantity`}
                              value={values.itemRequisitionArray[index]?.allotedQuantity}
                              onChange={(e) => {
                                const { value } = e.target;
                                const arr = values.itemRequisitionArray;
                                arr[index].allotedQuantity = value;
                                setFieldValue('itemRequisitionArray', arr);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              disabled
                              size="small"
                              fullWidth
                              name={`values.itemRequisitionArray.${index}.alreadyDeliveredQuantity`}
                              value={values.itemRequisitionArray[index].alreadyDeliveredQuantity}
                              onChange={(e) => {
                                const { value } = e.target;
                                const arr = values.itemRequisitionArray;
                                arr[index].alreadyDeliveredQuantity = value;
                                setFieldValue('itemRequisitionArray', arr);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                disabled
                                name={`values.itemRequisitionArray.${index}.alreadyDeliveredDate`}
                                inputFormat="dd/MM/yyyy"
                                disablePast="true"
                                value={values.itemRequisitionArray[index].alreadyDeliveredDate}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  const arr = values.itemRequisitionArray;
                                  arr[index].alreadyDeliveredDate = value;
                                  setFieldValue('itemRequisitionArray', arr);
                                }}
                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                              />
                            </LocalizationProvider>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              name={`values.itemRequisitionArray.${index}.requisitionQuantity`}
                              value={engToBang(values.itemRequisitionArray[index].requisitionQuantity)}
                              onChange={(e) => {
                                const { value } = e.target;
                                if (regex.test(value) || value == '') {
                                  const engValue = bangToEng(value);
                                  const arr = values.itemRequisitionArray;
                                  arr[index].requisitionQuantity = engValue;
                                  setFieldValue('itemRequisitionArray', arr);
                                }
                              }}
                              error={Boolean(
                                touched.itemRequisitionArray &&
                                  errors.itemRequisitionArray &&
                                  touched.itemRequisitionArray[index]?.requisitionQuantity &&
                                  errors.itemRequisitionArray[index]?.requisitionQuantity,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              key={values.itemRequisitionArray[index].requistionUrgency}
                              size="small"
                              fullWidth
                              name={`values.itemRequisitionArray.${index}.requistionUrgency`}
                              value={values.itemRequisitionArray[index].requistionUrgency}
                              onChange={(e, value) => {
                                const arr = values.itemRequisitionArray;
                                arr[index].requistionUrgency = value;
                                setFieldValue('itemRequisitionArray', arr);
                              }}
                              options={codeMasterTypes?.filter((type) => {
                                return type.codeType == 'URR';
                              })}
                              getOptionLabel={(option) => option.displayValue}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={Boolean(
                                    touched.itemRequisitionArray &&
                                      errors.itemRequisitionArray &&
                                      touched.itemRequisitionArray[index]?.requistionUrgency &&
                                      errors.itemRequisitionArray[index]?.requistionUrgency,
                                  )}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                              }}
                            >
                              {index !== 0 ? (
                                <RemoveIcon
                                  className="table-icon delete"
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                />
                              ) : (
                                ''
                              )}
                              <AddIcon
                                className="table-icon add"
                                onClick={() => {
                                  arrayHelpers.push({
                                    itemId: null,
                                    allotedQuantity: '',
                                    alreadyDeliveredQuantity: '',
                                    alreadyDeliveredDate: null,
                                    requisitionQuantity: '',
                                    requistionUrgency: null,
                                  });
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            );
          }}
        </FieldArray>
      </Grid>
    </>
  );
};
export default ItemRequisitionTable;
