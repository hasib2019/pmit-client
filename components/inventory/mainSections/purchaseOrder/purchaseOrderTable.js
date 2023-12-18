import { FieldArray, useFormikContext } from 'formik';
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Autocomplete,
  TextField,
  Table,
} from '@mui/material';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getItem } from 'features/inventory/item/itemSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { bangToEng, engToBang } from 'service/numberConverter';
const regex = /[০-৯.,0-9]$/;
const PurchaseOrderTable = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.itemOrProduct);
  const formik = useFormikContext();
  const { values, touched, errors, setFieldValue } = formik;
  const calculateTotalWhenQuantityChange = (index, qunatity) => {
    if (values.purchaseOrderArray[index].itemId && values.purchaseOrderArray[index]?.pricePerUnit && qunatity) {
      return values.purchaseOrderArray[index]?.pricePerUnit * qunatity;
    } else {
      return '';
    }
  };
  const calculateTotalWhenUnitPriceChange = (index, unitPrice) => {
    if (values.purchaseOrderArray[index].itemId && values.purchaseOrderArray[index]?.quantity && unitPrice) {
      return values.purchaseOrderArray[index]?.quantity * unitPrice;
    } else {
      return '';
    }
  };
  useEffect(() => {
    dispatch(getItem());
  }, []);
  return (
    <FieldArray name="purchaseOrderArray">
      {(arrayHelpers) => {
        return (
          <TableContainer className="table-container">
            <Table className="input-table table-alt" aria-label="customized table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '10%', textAlign: 'center' }}>ক্রমিক নং</TableCell>
                  <TableCell sx={{ width: '45%' }}>মালামালের নাম</TableCell>
                  <TableCell sx={{ width: '15%' }}>পরিমাণ</TableCell>
                  <TableCell sx={{ width: '15%' }}>মূল্য (প্রতি একক)</TableCell>
                  <TableCell sx={{ width: '10%' }}>মোট</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.purchaseOrderArray?.map((purchaseOrder, index) => {
                  return (
                    <TableRow key={values.purchaseOrderArray[index].itemId}>
                      <TableCell sx={{ textAlign: 'center' }} key={values.purchaseOrderArray[index].itemId}>
                        {engToBang(index + 1)}
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          key={values.purchaseOrderArray[index].itemId}
                          name={`values.purchaseOrderArray.${index}.itemId`}
                          value={values.purchaseOrderArray[index].itemId}
                          onChange={(e, value) => {
                            if (value) {
                              const purchaseOrderArrayCopy = values.purchaseOrderArray;
                              purchaseOrderArrayCopy[index].itemId = value;
                              purchaseOrderArrayCopy[index].pricePerUnit = value.unitPrice;
                              purchaseOrderArrayCopy[index].assetType = value.isAsset;
                              purchaseOrderArrayCopy[index].quantity = '';
                              purchaseOrderArrayCopy[index].total = '';

                              setFieldValue('purchaseOrderArray', purchaseOrderArrayCopy);
                            }
                          }}
                          options={items}
                          getOptionLabel={(option) => option.itemName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              size="small"
                              error={Boolean(
                                touched.purchaseOrderArray &&
                                  errors.purchaseOrderArray &&
                                  touched.purchaseOrderArray[index]?.itemId &&
                                  errors.purchaseOrderArray[index].itemId?.id,
                              )}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          name={`values.purchaseOrderArray.${index}.quantity`}
                          value={engToBang(values.purchaseOrderArray[index].quantity)}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (regex.test(value) || value == '') {
                              const engValue = bangToEng(value);
                              const purchaseOrderArrayCopy = values.purchaseOrderArray;
                              purchaseOrderArrayCopy[index].quantity = engValue;
                              purchaseOrderArrayCopy[index].total = calculateTotalWhenQuantityChange(index, engValue);
                              setFieldValue('purchaseOrderArray', purchaseOrderArrayCopy);
                            }
                          }}
                          error={Boolean(
                            touched.purchaseOrderArray &&
                              errors.purchaseOrderArray &&
                              touched.purchaseOrderArray[index]?.quantity &&
                              errors.purchaseOrderArray[index]?.quantity,
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          name={`values.purchaseOrderArray.${index}.pricePerUnit`}
                          value={engToBang(values.purchaseOrderArray[index].pricePerUnit)}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (regex.test(value) || value == '') {
                              const engValue = bangToEng(value);
                              const purchaseOrderArrayCopy = values.purchaseOrderArray;
                              purchaseOrderArrayCopy[index].pricePerUnit = engValue;
                              purchaseOrderArrayCopy[index].total = calculateTotalWhenUnitPriceChange(index, engValue);
                              setFieldValue('purchaseOrderArray', purchaseOrderArrayCopy);
                            }
                          }}
                          error={Boolean(
                            touched.purchaseOrderArray &&
                              errors.purchaseOrderArray &&
                              touched.purchaseOrderArray[index]?.pricePerUnit &&
                              errors.purchaseOrderArray[index]?.pricePerUnit,
                          )}
                        />
                      </TableCell>
                      <TableCell>{engToBang(values.purchaseOrderArray[index].total)}</TableCell>
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
                                quantity: '',
                                pricePerUnit: '',
                                total: '',
                              });
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }}
    </FieldArray>
  );
};
export default PurchaseOrderTable;
