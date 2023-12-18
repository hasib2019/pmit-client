import { Grid, TableContainer, TableHead, TableBody, TableRow, Paper, Table, TableCell } from '@mui/material';
import { getItemRequisitionPurpose } from 'features/inventory/item-requisition/itemRequisitionSlice';
import { emptyCodeMasterTypes, getCodeMasterValue } from 'features/inventory/item/itemSlice';
// const regex = /[০-৯.,0-9]$/;
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ItemRequisitionApprovalTable from './itemRequisitionApprovalTable';
import { tableCellClasses } from '@mui/material/TableCell';
// import { dateFormat } from 'service/dateFormat';
import { styled } from '@mui/material/styles';
import SubHeading from 'components/shared/others/SubHeading';
import { engToBang } from 'service/numberConverter';
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
const InventoryItemRequisitionApprovalDetails = (props) => {
  const dispatch = useDispatch();

  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
  const { iteRequisitionPurpose } = useSelector((state) => state.itemRequisition);

  const getItemRequisitionPurposeNameBn = () => {
    const foundObject = iteRequisitionPurpose?.find(
      (purpose) => purpose?.id == props?.allData?.itemRequisitionMstInfo?.requestPurpose,
    );
    return foundObject?.purposeName;
  };
  const getItemRequisitionTypeNameBn = () => {
    const foundObject = codeMasterTypes?.find(
      (type) => type.returnValue == props?.allData?.itemRequisitionMstInfo?.requestType,
    );
    return foundObject?.displayValue;
  };
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  useEffect(() => {
    dispatch(getCodeMasterValue('RQT'));
    dispatch(getItemRequisitionPurpose());
    return () => {
      dispatch(emptyCodeMasterTypes());
    };
  }, []);

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          boxShadow: '0 0 10px -5px rgba(0,0,0,0.5)',
          borderRadius: '10px',
          padding: '1rem',
          margin: '1rem 0 2rem',
        }}
      >
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">চাহিদাপত্রের প্রকারভেদ :&nbsp;</span>
              {getItemRequisitionTypeNameBn()}
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">চাহিদাপত্রের উদ্দেশ্য :&nbsp;</span> {getItemRequisitionPurposeNameBn()}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <ItemRequisitionApprovalTable
          itemRequisitionDtlInfo={props?.allData?.appData?.itemRequisitionDtlInfo}
          setAppData={props?.allData?.setAppData}
          appData={props?.allData?.appData}
          serviceActionId={props?.allData?.approval?.serviceActionId}
          showTextField={false}
        />
        {props?.allData?.approval?.serviceActionId === 3 || props?.allData?.approval?.serviceActionId === 4 ? (
          <ItemRequisitionApprovalTable
            itemRequisitionDtlInfo={props?.allData?.appData?.itemRequisitionDtlInfo}
            setAppData={props?.allData?.setAppData}
            appData={props?.allData?.appData}
            serviceActionId={props?.allData?.approval?.serviceActionId}
            showTextField={true}
          />
        ) : null}
        <Grid item md={12} lg={12} xs={12}>
          <SubHeading>আবেদনের তথ্য</SubHeading>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <Paper
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              padding: '10px',
            }}
          >
            <TableContainer className="hvr-underline-from-center hvr-shadow">
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#B8FFF9' }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: '20%' }}>মন্তব্যকারীর নাম</StyledTableCell>
                    <StyledTableCell sx={{ width: '30%' }}>কার্যক্রম</StyledTableCell>
                    <StyledTableCell sx={{ width: '30%' }}>মন্তব্য</StyledTableCell>
                    <StyledTableCell sx={{ width: '30%' }}>সংযুক্তি</StyledTableCell>
                    <StyledTableCell sx={{ width: '10%' }}>তারিখ</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props?.allData?.appData?.history?.map((v, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>{v.nameBn}</StyledTableCell>
                      <StyledTableCell>{v.actionText}</StyledTableCell>
                      <StyledTableCell>
                        {' '}
                        <div dangerouslySetInnerHTML={createMarkup(v.remarks)} />
                      </StyledTableCell>
                      <StyledTableCell style={{ color: 'blue', fontSize: '16px' }}>
                        <a href={v.attachment.fileNameUrl}>
                          {' '}
                          {v.attachment.fileNameUrl ? 'ডাউনলোড করুন' : 'সংযুক্তি নেই'}{' '}
                        </a>
                      </StyledTableCell>
                      <StyledTableCell>{engToBang(v.actionDate)}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default InventoryItemRequisitionApprovalDetails;
