import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ZoomImage from 'service/ZoomImage';
import { engToBang } from 'service/numberConverter';
import { getStore } from '../../../../features/inventory/item-store/item-store-slice';
import PurchaseOrderApprovalTable from './purchaseOrderApprovalTable';
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
const PurchaseOrderApprovalDetails = (props) => {
  const dispatch = useDispatch();
  const { allStores } = useSelector((state) => state.itemStore);
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  useEffect(() => {
    dispatch(getStore());
  }, []);
  useEffect(() => {
    if (
      +props?.allData?.approval?.serviceActionId === 4 &&
      allStores?.length > 0 &&
      props?.allData?.appData?.itemsTobePurchased?.length > 0
    ) {
      const itemsWithStore = props?.allData?.appData?.itemsTobePurchased?.map((item) => {
        return {
          ...item,
          storeId: allStores?.length === 1 ? +allStores[0]?.id : '',
        };
      });
      props?.allData?.setAppData({
        ...props?.allData?.appData,
        itemsTobePurchased: itemsWithStore,
      });
    }
  }, [props?.allData?.approval?.serviceActionId, allStores]);

  // const { allStores } = useSelector((state) => state.itemStore);
  // dispatch(getStore());
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
              <span className="label">শিরোনাম :&nbsp;</span>
              {props?.allData?.purchaseDetailInfo?.title}
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">কার্যাদেশ নম্বর :&nbsp;</span>
              {props?.allData?.purchaseDetailInfo?.orderNumber}
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">কার্যাদেশ তারিখ :&nbsp;</span>
              {engToBang(props?.allData?.purchaseDetailInfo?.orderDate)}
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">টেন্ডার এর ধরন :&nbsp;</span>
              {props?.allData?.purchaseDetailInfo?.tenderType?.typeName}
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সরবরাহকারী :&nbsp;</span>
              {props?.allData?.purchaseDetailInfo?.supplier?.supplierName}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <PurchaseOrderApprovalTable
          itemsTobePurchased={props?.allData?.appData?.itemsTobePurchased}
          setAppData={props?.allData?.setAppData}
          showTextField={false}
          allData={props?.allData?.appData}
          serviceActionId={props?.allData?.approval?.serviceActionId}
        />
        <Grid item md={12} lg={12} xs={12}>
          <SubHeading>ডকুমেন্টের তথ্য</SubHeading>
        </Grid>
        <Grid item md={12} lg={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>ডকুমেন্টের ধরন</TableCell>
                  <TableCell>ডকুমেন্ট নম্বর</TableCell>
                  <TableCell align="center">ডকুমেন্টের ছবি (ফ্রন্ট)</TableCell>
                  <TableCell align="center">ডকুমেন্টের ছবি (ব্যাক)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.allData?.documentList?.map((doc, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell className="first-td">{doc.docTypeDesc}</TableCell>
                      <TableCell>{doc.documentNumber ? doc.documentNumber : 'বিদ্যমান নেই'}</TableCell>
                      <TableCell align="center">
                        {doc?.documentFrontUrl ? (
                          <ZoomImage
                            src={doc?.documentFrontUrl}
                            divStyle={{
                              display: 'flex',
                              justifyContent: 'center',
                              height: '100%',
                              width: '100%',
                            }}
                            imageStyle={{
                              height: '50px',
                              width: '50px',
                            }}
                            key={1}
                            type={imageType(doc?.documentFront)}
                          />
                        ) : (
                          'বিদ্যমান নেই'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {doc?.documentBackUrl ? (
                          <ZoomImage
                            src={doc?.documentBackUrl}
                            divStyle={{
                              display: 'flex',
                              justifyContent: 'center',
                              height: '100%',
                              width: '100%',
                            }}
                            imageStyle={{
                              height: '50px',
                              width: '50px',
                            }}
                            key={1}
                            type={imageType(doc?.documentBack)}
                          />
                        ) : (
                          'বিদ্যমান নেই'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {props?.allData?.approval?.serviceActionId === 3 ||
        props?.allData?.approval?.serviceActionId === 4 ||
        props?.allData?.approval?.serviceActionId === 5 ? (
          <PurchaseOrderApprovalTable
            itemsTobePurchased={props?.allData?.appData?.itemsTobePurchased}
            setAppData={props?.allData?.setAppData}
            showTextField={true}
            allData={props?.allData?.appData}
            serviceActionId={props?.allData?.approval?.serviceActionId}
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
export default PurchaseOrderApprovalDetails;
