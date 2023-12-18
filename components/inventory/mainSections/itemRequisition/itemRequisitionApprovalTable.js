const { Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField } = require('@mui/material');
import { memo } from 'react';
import { bangToEng, engToBang } from 'service/numberConverter';
const regex = /[০-৯.,0-9]$/;
const ItemRequisitionApprovalTable = ({
  itemRequisitionDtlInfo,
  setAppData,
  appData,
  serviceActionId,
  showTextField,
}) => {
  return (
    <Grid item md={12} lg={12} xs={12}>
      <TableContainer className="table-container">
        <Table className="input-table table-alt" aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '25%' }}>মালামালের নাম</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center' }}>মালামালের প্রাপতা</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center' }}>গ্রহনকৃত মালামালের সংখ্যা</TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'center' }}>সর্বশেষ গ্রহণের তারিখ</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center' }}>আবেদনের পরিমাণ</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center' }}>অনুমোদনের পরিমাণ</TableCell>
              {showTextField ? (
                <TableCell sx={{ width: '10%', textAlign: 'center' }}>
                  {serviceActionId === 3 ? 'অনুমোদনের পরিমাণ' : serviceActionId === 4 ? 'প্রদানের পরিমাণ' : null}
                </TableCell>
              ) : null}

              <TableCell sx={{ width: '20%', textAlign: 'center' }}>চাহিদার প্রয়োজনীয়তা</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemRequisitionDtlInfo?.map((requisition, index) => {
              console.log('requistion', requisition);
              return (
                <TableRow key={requisition?.itemId?.itemName}>
                  <TableCell>{requisition?.itemId?.itemName}</TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                    {engToBang(requisition?.allotedQuantity)}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                    {engToBang(requisition?.alreadyReceivedQuantity)}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                    {engToBang(requisition?.alreadyReceivedDate)}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                    {engToBang(requisition?.requestedQuantity)}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                    {' '}
                    {engToBang(requisition?.approvedQuantity)}
                  </TableCell>

                  {showTextField ? (
                    <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                      <TextField
                        name="deliveredQuantity"
                        size="small"
                        fullWidth
                        value={
                          serviceActionId === 4
                            ? engToBang(requisition.deliveredQuantity)
                            : serviceActionId === 3
                            ? engToBang(requisition.approvedQuantity)
                            : ''
                        }
                        onChange={(e) => {
                          const { value } = e.target;
                          const shallowArray = itemRequisitionDtlInfo;

                          if (regex.test(value) || e.target.value == '') {
                            if (serviceActionId === 4) {
                              shallowArray[index].deliveredQuantity = bangToEng(value);
                            } else if (serviceActionId === 3) {
                              shallowArray[index].approvedQuantity = bangToEng(value);
                            }

                            setAppData({
                              ...appData,
                              itemRequisitionDtlInfo: shallowArray,
                            });
                          }
                        }}
                      />
                    </TableCell>
                  ) : null}
                  <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                    {requisition?.requisitionUrgency?.displayValue}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
export default memo(ItemRequisitionApprovalTable);
