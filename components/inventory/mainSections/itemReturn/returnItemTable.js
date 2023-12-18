import {
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SubHeading from 'components/shared/others/SubHeading';
import { engToBang } from 'service/numberConverter';
import React from 'react';

const ReturnItemTable = ({
  returnedItems,
  itemOptionsObj,
  handleChandeForItem,
  formError,
  handleChangeForReturnedQuantity,
  handleChangeForItemStatus,
  codeMasterTypes,
  removeRow,
  onClickAddButton,
  subHeadingTitle,
}) => {
  console.log('hellloChild', formError);
  return (
    <>
      <Grid item lg={12} md={12} xs={12}>
        <SubHeading>{subHeadingTitle}</SubHeading>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <TableContainer className="table-container">
          <Table className="input-table table-alt" aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '50%' }}>মালামালের নাম</TableCell>
                <TableCell sx={{ width: '20%' }} align="center">
                  ধরন
                </TableCell>
                <TableCell sx={{ width: '10%' }} align="center">
                  ফেরতের পরিমাণ
                </TableCell>
                <TableCell sx={{ width: '15%' }} align="center">
                  অবস্থা
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returnedItems?.map((returnedItem, index) => {
                return (
                  <TableRow key={returnedItem?.itemCode ? returnedItem?.itemCode : returnedItem?.itemId?.itemId}>
                    <TableCell>
                      <Autocomplete
                        key={[
                          returnedItem?.itemCode ? returnedItem?.itemCode : returnedItem?.itemId?.itemId,
                          itemOptionsObj[index]?.length,
                        ]}
                        name="itemId"
                        size="small"
                        fullWidth
                        options={itemOptionsObj[index]?.length > 0 ? itemOptionsObj[index] : []}
                        value={returnedItem?.itemId}
                        onChange={(e, value) => {
                          handleChandeForItem(e, value, index);
                        }}
                        getOptionLabel={(option) =>
                          option?.assetCode ? option.itemName + ` ` + `(` + option.assetCode + ` )` : option?.itemName
                        }
                        noOptionsText="কোনো মালামাল নেই"
                        renderInput={(params) => (
                          <TextField {...params} error={Boolean(formError[`${index}-itemId`])} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        name="assetTypeName"
                        value={returnedItem?.assetTypeName}
                        disabled
                        error={Boolean(formError[`${index}-assetTypeName`])}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        disabled={returnedItem?.assetType}
                        name="returnedQuantity"
                        value={engToBang(returnedItem?.returnedQuantity)}
                        onChange={(e) => {
                          handleChangeForReturnedQuantity(e, index);
                        }}
                        error={Boolean(formError[`${index}-returnedQuantity`])}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        fullWidth
                        name="itemStatus"
                        onChange={(e) => {
                          handleChangeForItemStatus(e, index);
                        }}
                        value={+returnedItem?.itemStatus}
                        error={Boolean(formError[`${index}-itemStatus`])}
                      >
                        {codeMasterTypes?.map((code) => {
                          return (
                            <MenuItem key={code.id} value={code.id}>
                              {code.displayValue}
                            </MenuItem>
                          );
                        })}
                      </Select>
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
                              removeRow(index);
                            }}
                          />
                        ) : (
                          ''
                        )}
                        <AddIcon
                          className="table-icon add"
                          onClick={() => {
                            onClickAddButton(index);
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
      </Grid>
    </>
  );
};
export default React.memo(ReturnItemTable);
