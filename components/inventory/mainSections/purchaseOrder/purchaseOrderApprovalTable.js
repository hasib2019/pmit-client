import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { bangToEng, engToBang } from 'service/numberConverter';
const regex = /[০-৯.,0-9]$/;
const PurchaseOrderApprovalTable = ({ itemsTobePurchased, setAppData, showTextField, allData, serviceActionId }) => {
  const { allStores } = useSelector((state) => state.itemStore);
  return (
    <Grid item md={12} lg={12} xs={12}>
      <TableContainer className="table-container">
        <Table className="input-table table-alt" aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '25%' }}>মালামালের নাম</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center' }}>আবেদনের পরিমাণ</TableCell>

              <TableCell sx={{ width: '5%', textAlign: 'center' }}>অনুমোদিত পরিমাণ</TableCell>

              <TableCell sx={{ width: '10%', textAlign: 'right' }}>মূল্য (প্রতি একক)</TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'right' }}>মোট</TableCell>

              {showTextField ? (
                <TableCell sx={{ width: '10%' }}>
                  {serviceActionId === 3
                    ? 'অনুমোদনের পরিমাণ'
                    : serviceActionId === 4 || serviceActionId === 5
                    ? 'গ্রহণের পরিমাণ'
                    : ''}
                </TableCell>
              ) : null}
              {serviceActionId === 4 || serviceActionId === 5 ? (
                <TableCell sx={{ width: '30%' }}>স্টোরের নাম</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsTobePurchased?.map((purchaseItem, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{purchaseItem?.itemId?.itemName}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{engToBang(purchaseItem?.orderedQuantity)}</TableCell>

                  <TableCell sx={{ textAlign: 'center' }}>{engToBang(purchaseItem?.approvedQuantity)}</TableCell>

                  <TableCell sx={{ textAlign: 'right' }}>{engToBang(purchaseItem?.pricePerUnit)}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{engToBang(purchaseItem?.total)}</TableCell>
                  {showTextField ? (
                    <TableCell>
                      <TextField
                        name="receivedQuantity"
                        size="small"
                        fullWidth
                        value={
                          serviceActionId === 3 && purchaseItem?.approvedQuantity
                            ? engToBang(purchaseItem?.approvedQuantity)
                            : (serviceActionId === 4 || serviceActionId === 5) && purchaseItem?.receivedQuantity
                            ? engToBang(purchaseItem?.receivedQuantity)
                            : ''
                        }
                        onChange={(e) => {
                          const { value } = e.target;
                          if (regex.test(value) || e.target.value == '') {
                            const shallowArray = [...itemsTobePurchased];
                            if (serviceActionId === 3) {
                              shallowArray[index].approvedQuantity = bangToEng(value);
                            }
                            if (serviceActionId === 4 || serviceActionId === 5) {
                              shallowArray[index].receivedQuantity = bangToEng(value);
                            }

                            setAppData({
                              ...allData,
                              itemsTobePurchased: shallowArray,
                            });
                          }
                        }}
                      />
                    </TableCell>
                  ) : null}
                  {serviceActionId === 4 || serviceActionId === 5 ? (
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          size="small"
                          fullWidth
                          value={+purchaseItem?.storeId}
                          onChange={(e) => {
                            const shallowArray = [...itemsTobePurchased];
                            shallowArray[index].storeId = e.target.value;
                            setAppData({
                              ...allData,
                              itemsTobePurchased: shallowArray,
                            });
                          }}
                        >
                          {allStores?.map((store) => (
                            <MenuItem key={store?.id} value={+store?.id}>
                              {store?.storeName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
export default memo(PurchaseOrderApprovalTable);
