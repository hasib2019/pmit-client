import { FieldArray, useFormikContext } from 'formik';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Autocomplete,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllItemCategory } from 'features/inventory/category/categorySlice';
import { getItem, onSetItemToEmptyArray } from 'features/inventory/item/itemSlice';
import {
  getAllMeasurementUnit,
  onSetAllMeasurementUnitsToEmptyArray,
} from 'features/inventory/measurementUnit/measurementUnitSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getAllItemGroup } from 'features/inventory/item-group/ItemGroupSlice';
// import { getStore } from 'features/inventory/item-store/item-store-slice';
import SubHeading from 'components/shared/others/SubHeading';
import { fetchAllMeasurementUnit } from 'features/inventory/measurementUnit/measurementUnitApi';
// import UseSetSingleArrayAsDefaultValue from 'components/inventory/hooks/useSetSingleArrayAsDefaultValue';
// import { fetchStore } from 'features/inventory/item-store/item-store-api';
import { bangToEng, engToBang } from 'service/numberConverter';
const ManualEntryTable = () => {
  const dispatch = useDispatch();

  const { itemCategories } = useSelector((state) => state.itemCategory);
  const { items } = useSelector((state) => state.itemOrProduct);
  const { allMeasurementUnits } = useSelector((state) => state.measurementUnit);
  const { itemGroups } = useSelector((state) => state.itemGroup);
  const { allStores } = useSelector((state) => state.itemStore);
  const formik = useFormikContext();

  const { values, touched, errors, setFieldValue } = formik;

  useEffect(() => {
    dispatch(getAllItemGroup());
  }, []);
  if (allStores.length === 0) {
    return null;
  }
  return (
    <>
      <SubHeading>মালামালের তালিকা</SubHeading>
      <TableContainer className="table-container">
        <Table className="input-table table-alt" aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">ক্রমিক</TableCell>
              <TableCell sx={{ minWidth: '250px' }}>গ্রুপ</TableCell>
              <TableCell sx={{ minWidth: '250px' }}>ক্যাটাগরি</TableCell>
              <TableCell sx={{ minWidth: '250px' }}>নাম</TableCell>
              <TableCell align="center">একক</TableCell>
              <TableCell align="center" sx={{ minWidth: '100px' }}>
                পরিমাণ
              </TableCell>
              <TableCell sx={{ minWidth: '250px' }}>স্টোরের নাম</TableCell>
            </TableRow>
          </TableHead>

          <FieldArray name="manualEntryData">
            {(arrayHelpers) => (
              <>
                <TableBody>
                  {values?.manualEntryData?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: 'center' }}>{engToBang(index + 1)}</TableCell>
                      <TableCell>
                        <Autocomplete
                          key={values.manualEntryData[index].groupName}
                          name={`manualEntryData.${index}.groupName`}
                          size="small"
                          fullWidth
                          value={values.manualEntryData[index].groupName}
                          onChange={(e, value) => {
                            if (value) {
                              dispatch(getAllItemCategory(`&group_id=${value.id}`));
                              dispatch(onSetItemToEmptyArray());
                              dispatch(onSetAllMeasurementUnitsToEmptyArray());
                              const obj = values.manualEntryData;
                              obj[index].groupName = value;
                              obj[index].categoryName = undefined;
                              obj[index].itemName = undefined;
                              obj[index].unitName = undefined;
                              setFieldValue('manualEntryData', obj);
                            }
                          }}
                          options={itemGroups}
                          getOptionLabel={(option) => option.groupName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(
                                touched?.manualEntryData &&
                                  errors?.manualEntryData &&
                                  touched?.manualEntryData[index]?.groupName &&
                                  errors?.manualEntryData[index]?.groupName?.id,
                              )}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          name={`manualEntryData.${index}.categoryName`}
                          key={values.manualEntryData[index].categoryName}
                          size="small"
                          fullWidth
                          value={values.manualEntryData[index].categoryName}
                          onChange={(e, value) => {
                            if (value) {
                              dispatch(getItem(`&category_id=${value.id}`));
                              dispatch(onSetAllMeasurementUnitsToEmptyArray());
                              const obj = values.manualEntryData;
                              obj[index].categoryName = value;
                              obj[index].itemName = undefined;
                              obj[index].unitName = undefined;
                              setFieldValue('manualEntryData', obj);
                            }
                          }}
                          options={itemCategories}
                          getOptionLabel={(option) => option.categoryName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(
                                touched?.manualEntryData &&
                                  errors?.manualEntryData &&
                                  touched?.manualEntryData[index]?.categoryName &&
                                  errors?.manualEntryData[index]?.categoryName?.id,
                              )}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          key={values.manualEntryData[index].itemName}
                          size="small"
                          fullWidth
                          name={`manualEntryData.${index}.itemName`}
                          value={values.manualEntryData[index].itemName}
                          onChange={async (e, value) => {
                            const measurementUints = await fetchAllMeasurementUnit(`&id=${value.mouId}`);
                            const measurementUnitObj = measurementUints.data[0];

                            dispatch(getAllMeasurementUnit(`&id=${value.mouId}`));
                            const obj = values.manualEntryData;
                            obj[index].itemName = value;
                            obj[index].unitName = measurementUnitObj;
                            obj[index].goodsType = value.goodsType;
                            setFieldValue('manualEntryData', obj);
                          }}
                          options={items}
                          getOptionLabel={(option) => option.itemName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(
                                touched?.manualEntryData &&
                                  errors?.manualEntryData &&
                                  touched?.manualEntryData[index]?.itemName &&
                                  errors?.manualEntryData[index]?.itemName?.id,
                              )}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell style={{}}>
                        <Autocomplete
                          name={`manualEntryData${index}.unitName`}
                          key={values.manualEntryData[index].unitName}
                          size="small"
                          fullWidth
                          value={values.manualEntryData[index].unitName}
                          disabled={true}
                          // onChange={(e, value) => {
                          //   const obj = values.manualEntryData;
                          //   obj[index].unitName = value;
                          //   setFieldValue("manualEntryData", obj);
                          // }}
                          options={allMeasurementUnits}
                          getOptionLabel={(option) => option.mouName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(
                                touched?.manualEntryData &&
                                  errors?.manualEntryData &&
                                  touched?.manualEntryData[index]?.unitName &&
                                  errors?.manualEntryData[index]?.unitName?.id,
                              )}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell className="input-center">
                        <TextField
                          size="small"
                          fullWidth
                          name={`manualEntryData.${index}.quantity`}
                          value={engToBang(values.manualEntryData[index].quantity)}
                          onChange={(e) => {
                            const obj = values.manualEntryData;
                            const value = bangToEng(e.target.value);
                            obj[index].quantity = value.replace(/\D/gi, '');
                            setFieldValue('manualEntryData', obj);
                          }}
                          error={Boolean(
                            touched?.manualEntryData &&
                              errors?.manualEntryData &&
                              touched?.manualEntryData[index]?.quantity &&
                              errors?.manualEntryData[index]?.quantity,
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          name={`manualEntryData${index}.storeName`}
                          key={values.manualEntryData[index].storeName}
                          size="small"
                          fullWidth
                          value={values.manualEntryData[index].storeName}
                          onChange={(e, value) => {
                            const obj = values.manualEntryData;

                            obj[index].storeName = value;
                            setFieldValue('manualEntryData', obj);
                          }}
                          options={allStores}
                          getOptionLabel={(option) => option.storeName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(
                                touched?.manualEntryData &&
                                  errors?.manualEntryData &&
                                  touched?.manualEntryData[index]?.storeName &&
                                  errors?.manualEntryData[index]?.storeName?.id,
                              )}
                            />
                          )}
                        />
                      </TableCell>

                      {values.isExcel ? (
                        ''
                      ) : (
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
                                if (values.manualEntryData.length > 0) {
                                  arrayHelpers.push({
                                    groupName: undefined,
                                    categoryName: undefined,
                                    itemName: undefined,
                                    unitName: undefined,
                                    quantity: '',
                                    storeName: allStores?.length === 1 ? allStores[0] : undefined,
                                  });
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </FieldArray>
        </Table>
      </TableContainer>
    </>
  );
};
export default React.memo(ManualEntryTable);
