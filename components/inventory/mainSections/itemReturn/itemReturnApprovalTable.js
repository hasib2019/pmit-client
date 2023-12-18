import {
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { emptyCodeMasterTypes, getCodeMasterValue } from 'features/inventory/item/itemSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { engToBang } from 'service/numberConverter';
import lodash from 'lodash';
import { getStore } from 'features/inventory/item-store/item-store-slice';

const ItemReturnApprovalTable = (props) => {
  const { serviceActionId } = props?.allData?.approval;
  const { isItemStatusChangable } = props;

  const dispatch = useDispatch();
  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
  const { allStores } = useSelector((state) => state.itemStore);
  const [itemStatusNameObj, setItemStatusNameObj] = useState({});
  useEffect(() => {
    dispatch(getCodeMasterValue('AST'));
    dispatch(getStore());
    return () => {
      dispatch(emptyCodeMasterTypes());
    };
  }, []);
  useEffect(() => {
    if (Object.values(itemStatusNameObj)?.length === 0) {
      const codeMasterTypesObj = codeMasterTypes?.reduce((finalObj, currentObj) => {
        if (!finalObj[currentObj?.id]) {
          finalObj[currentObj?.id] = currentObj?.displayValue;
        }
        return finalObj;
      }, {});
      setItemStatusNameObj(codeMasterTypesObj);
    }
  }, [codeMasterTypes.length]);
  useEffect(() => {
    if (allStores?.length === 1 && +serviceActionId === 3) {
      const allReturnedItems = lodash.cloneDeep(props?.allData?.appData?.returnedItems);
      const allReturnedItemsWithStore = allReturnedItems?.map((item) => {
        return {
          ...item,
          storeId: allStores[0]?.id,
        };
      });

      props?.allData?.setAppData({
        ...props?.allData?.appData,
        returnedItems: allReturnedItemsWithStore,
      });
    }
  }, [serviceActionId]);

  return (
    <Grid container spacing={3}>
      <Grid item md={12} lg={12} xs={12}>
        <TableContainer className="table-container">
          <Table className="input-table table-alt" aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>মালামালের নাম</TableCell>
                <TableCell>ধরন</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>ফেরতের পরিমাণ </TableCell>
                <TableCell>অবস্থা</TableCell>
                <TableCell>স্টোর</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props?.allData?.appData?.returnedItems?.map((item, index) => {
                return (
                  <TableRow key={item?.itemId?.itemId}>
                    <TableCell>
                      {item?.itemId?.assetCode
                        ? `${item?.itemId?.itemName}` + ` ` + `(${item?.itemId?.assetCode})`
                        : item?.itemId?.itemName}
                    </TableCell>
                    <TableCell>{item?.assetTypeName}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{engToBang(item?.returnedQuantity)}</TableCell>
                    {isItemStatusChangable ? (
                      <TableCell>
                        <Select
                          name="itemStatus"
                          fullWidth
                          size="small"
                          value={item?.itemStatus}
                          onChange={(e) => {
                            const { value } = e.target;
                            const returnedItemsCopy = lodash.cloneDeep(props?.allData?.appData?.returnedItems);
                            returnedItemsCopy[index] = {
                              ...returnedItemsCopy[index],
                              itemStatus: +value,
                            };
                            props?.allData?.setAppData({
                              ...props?.allData?.appData,
                              returnedItems: returnedItemsCopy,
                            });
                          }}
                        >
                          {codeMasterTypes.map((type) => (
                            <MenuItem key={type?.id} value={type?.id}>
                              {type?.displayValue}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    ) : (
                      <TableCell>{itemStatusNameObj[props?.allData?.returnedItems?.[index]?.itemStatus]}</TableCell>
                    )}
                    {isItemStatusChangable ? (
                      <TableCell>
                        <Select
                          name="storeId"
                          fullWidth
                          size="small"
                          value={item?.storeId ? item?.storeId : ''}
                          onChange={(e) => {
                            const { value } = e.target;
                            const returnedItemsCopy = lodash.cloneDeep(props?.allData?.appData?.returnedItems);
                            returnedItemsCopy[index] = {
                              ...returnedItemsCopy[index],
                              storeId: +value,
                            };
                            props?.allData?.setAppData({
                              ...props?.allData?.appData,
                              returnedItems: returnedItemsCopy,
                            });
                          }}
                        >
                          {allStores.map((store) => (
                            <MenuItem key={store?.id} value={store?.id}>
                              {store?.storeName}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    ) : (
                      <TableCell>{itemStatusNameObj[props?.allData?.returnedItems?.[index]?.itemStatus]}</TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
export default ItemReturnApprovalTable;
