
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingApplications,
  onModalOpenClose,
  onSetOfficeNameBangla,
  onSetProjectNameBangla,
  onSetTransactionSets,
  onSetTransactionType,
  onSetVoucherMode,
  onSetVoucherType,
} from '../../../../../features/voucherPostingApproval/voucherPostingApprovalSlice';
import TableComponent from '../../../../../service/tableComponent2';
import VoucherPostingApprovalDetails from '../../transactionApproval/voucherPostingApprovalDetails';
const TransactionApproval = () => {
  const dispatch = useDispatch();
  const { pendingApplications, isModalOpen } = useSelector((state) => state.transactionApproval);

  useEffect(() => {
    dispatch(fetchPendingApplications());
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columnNames = ['ক্রমিক নং', 'অফিসের নাম', 'প্রকল্পের নাম', 'ভাউচারের ধরণ', 'ভাউচারের মোড', ''];
  const tableDataKeys = [
    'index',
    'name_bn',
    'project_name_bangla',
    'data.voucherType',
    'data.voucherMode',
    'eyeButton',
  ];

  return (
    <>
      <TableComponent
        columnNames={columnNames}
        tableData={pendingApplications}
        tableDataKeys={tableDataKeys}
        editFunction={(row) => {
          'row6616161', row;
          dispatch(onModalOpenClose(true));
          dispatch(onSetOfficeNameBangla(row.name_bn));
          dispatch(onSetProjectNameBangla(row.project_name_bangla));
          dispatch(onSetTransactionType(row.tran_type));
          dispatch(onSetVoucherMode(row.data.voucherMode));
          dispatch(onSetVoucherType(row.data.voucherType));
          dispatch(
            onSetTransactionSets({
              ...(row?.project_id && { projectId: row?.project_id }),
              tranSets: row.data.transactionSets,
              id: row.id,
              officeId: row.office_id,
            }),
          );
        }}
        tableTitle="অনুমোদনের জন্য অপেক্ষমান তালিকা"
        salaries={[]}
        // tableHeaderButtonHandler={() => {}}
        dataYouWantoShowInBanglaDigit={''}
        isPaginationTable={true}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(event.target.value, 10);
          setPage(0);
        }}
        paginationTableCount={pendingApplications?.length}
      />
      <Dialog
        maxWidth="lg"
        open={isModalOpen}
        onClose={() => {
          dispatch(onModalOpenClose(false));
        }}
        onBackdropClick={() => {
          dispatch(onModalOpenClose(false));
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle></DialogTitle>
          <CloseIcon
            sx={{ margin: '10px', cursor: 'pointer' }}
            onClick={() => {
              dispatch(onModalOpenClose(false));
            }}
          />
        </div>
        <DialogContent>
          <VoucherPostingApprovalDetails />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionApproval;
