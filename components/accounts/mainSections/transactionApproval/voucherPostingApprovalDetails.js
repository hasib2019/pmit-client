import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import engToBdNum from '../../../../service/englishToBanglaDigit';

import { useDispatch, useSelector } from 'react-redux';
import {
  approveVoucherPostingApplication,
  onModalOpenClose,
  rejectPendingVoucherPostingApplication,
} from '../../../../features/voucherPostingApproval/voucherPostingApprovalSlice';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const VoucherPostingApprovalDetails = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    officeNameBangla,
    projectNameBangla,
    // transactionType,
    voucherMode,
    voucherType,
    transactionSets,
    // errorMessage,
    successMessage,
  } = useSelector((state) => state.transactionApproval);
  'transactionSets60', transactionSets;

  const debitTransactions = transactionSets.tranSets?.filter((tran) => tran.drcrCode === 'D');
  const creditTransactions = transactionSets?.tranSets?.filter((tran) => tran.drcrCode === 'C');
  'arraySets', debitTransactions, creditTransactions;
  const calculateTotal = (transactonsArray) => {
    const total = transactonsArray?.reduce((previous, current) => {
      return previous + current;
    }, 0);
    return total;
  };
  // const showNotificationError = () => {
  //   if (errorMessage) {
  //     NotificationManager.error(errorMessage, "", 5000);
  //   }
  // };
  const onApproveApplication = () => {
    // setTimeout(() => {}, 6000);

    dispatch(approveVoucherPostingApplication(transactionSets));
    if (successMessage) {
      NotificationManager.success(successMessage);
    }
    dispatch(onModalOpenClose(false));
  };
  const onRejectApplication = () => {
    dispatch(rejectPendingVoucherPostingApplication(transactionSets.id));
    dispatch(onModalOpenClose(false));
  };

  'total', calculateTotal(debitTransactions?.map((tran) => tran.tranAmt));
  const getVoucherTypeInBangla = (voucherType) => {
    if (voucherType === 'Payment Voucher') {
      return 'পেমেন্ট ভাউচার';
    }
    if (voucherType === 'Receive Voucher') {
      return 'রিসিভ ভাউচার';
    }
    if (voucherType === 'Journal Voucher') {
      return 'জার্নাল ভাউচার';
    }
    return 'আন্তঃ অফিস ভাউচার';
  };
  return (
    <>
      <Grid item md={12} xs={12} mx={2} my={2} px={2} py={2} sx={{ backgroundColor: '#DDFFE7', borderRadius: '10px' }}>
        <Grid container spacing={1.5} sx={{ color: '#000e73' }}>
          {projectNameBangla && (
            <Grid item md={6} xs={12}>
              <Typography>
                <span style={{ textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>প্রকল্পের নাম : </span> {projectNameBangla}
              </Typography>
            </Grid>
          )}
          <Grid item md={6} xs={12}>
            <Typography>
              <span style={{ textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>অফিসের নাম : </span> {officeNameBangla}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography>
              <span style={{ textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>ভাউচারের ধরণ : </span>{' '}
              {getVoucherTypeInBangla(voucherType)}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography>
              <span style={{ textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>ভাউচারের মোড : </span>{' '}
              {voucherMode === 'CASH' ? 'নগদ' : 'ব্যাংক'}
            </Typography>
          </Grid>

          {/* <Grid item md={12} xs={12}>
            <span sx={{ fontSize: "20px" }}>লেনদেনের ধরণ : </span>
            <span>{transactionType}</span>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Typography variant="h7" sx={{ marginBottom: '10px' }}>
          ডেবিট লেনদেনের তথ্য
        </Typography>
        <Grid container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '15%', textAlign: 'center', padding: '5px' }}>
                    ক্রমিক নং
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '15%', textAlign: 'center', padding: '5px' }}>
                    লেজারের নাম
                  </StyledTableCell>

                  <StyledTableCell sx={{ width: '20%', textAlign: 'center', padding: '5px' }}>বিবরণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '20%', textAlign: 'center', padding: '5px' }}>
                    পরিমান (টাকা)
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debitTransactions?.map((singleTran, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell sx={{ p: '5px', color: '#4BB543', textAlign: 'center' }}>
                        {engToBdNum(i + 1)}
                      </StyledTableCell>
                      <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>{singleTran?.glacName}</StyledTableCell>

                      <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>{singleTran?.naration}</StyledTableCell>
                      <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>
                        {engToBdNum('' + singleTran?.tranAmt + '')}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell sx={{ p: '5px', color: '#4BB543' }}></StyledTableCell>
                  <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}></StyledTableCell>

                  <StyledTableCell sx={{ p: '5px', textAlign: 'left' }}>
                    <Typography sx={{ textAlign: 'right' }}>সর্বমোট</Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>
                    {`${engToBdNum('' + calculateTotal(debitTransactions?.map((tran) => tran.tranAmt)) + '')}`}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Typography variant="h7" sx={{ marginBottom: '10px' }}>
          ক্রেডিট লেনদেনের তথ্য
        </Typography>
        <Grid container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                <TableRow>
                  <StyledTableCell sx={{ width: '15%', textAlign: 'center', padding: '5px' }}>
                    ক্রমিক নং
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '15%', textAlign: 'center', padding: '5px' }}>
                    লেজারের নাম
                  </StyledTableCell>

                  <StyledTableCell sx={{ width: '20%', textAlign: 'center', padding: '5px' }}>বিবরণ</StyledTableCell>
                  <StyledTableCell sx={{ width: '20%', textAlign: 'center', padding: '5px' }}>
                    পরিমান (টাকা)
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creditTransactions?.map((singleTran, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell sx={{ p: '5px', color: '#4BB543', textAlign: 'center' }}>
                        {engToBdNum('' + (i + 1) + '')}
                      </StyledTableCell>
                      <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>{singleTran?.glacName}</StyledTableCell>

                      <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>{singleTran?.naration}</StyledTableCell>
                      <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>
                        {engToBdNum('' + singleTran?.tranAmt + '')}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell sx={{ p: '5px', color: '#4BB543' }}></StyledTableCell>
                  <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}></StyledTableCell>

                  <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>
                    <Typography sx={{ textAlign: 'right' }}>সর্বমোট</Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: '5px', textAlign: 'center' }}>
                    {`${engToBdNum('' + calculateTotal(creditTransactions?.map((tran) => tran.tranAmt)) + '')}`}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container direction="row" sx={{ display: 'flex', justifyContent: 'center', gap: '.8rem' }}>
        <Tooltip title="অনুমোদন দিন">
          <LoadingButton
            disabled={isLoading}
            loading={isLoading}
            loadingPosition="end"
            variant="contained"
            className="btn btn-save"
            onClick={onApproveApplication}
            size="small"
          >
            <CheckBoxIcon sx={{ display: 'block' }} />
            &nbsp;&nbsp;অনুমোদন দিন
          </LoadingButton>
        </Tooltip>
        <Tooltip title="বাতিল করুন">
          <Button variant="contained" className="btn-delete" onClick={onRejectApplication}>
            <DeleteForeverIcon sx={{ display: 'block' }} />
            &nbsp;&nbsp;বাতিল করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default VoucherPostingApprovalDetails;
