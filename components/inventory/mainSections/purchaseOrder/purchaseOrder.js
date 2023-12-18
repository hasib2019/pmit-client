/* eslint-disable react-hooks/rules-of-hooks */
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Grid, Select, MenuItem, FormControl, TextField, InputLabel, Autocomplete } from '@mui/material';
import { savButtonLabel } from '../../constants';
import { LoadingButton } from '@mui/lab';
import SentForApprovalComponent from 'components/inventory/utils/SentForApprovalComponent';
import useSentForApprovalStateAndFunctionalites from 'components/inventory/hooks/useSentForApprovalFunctionalitiesAndState/useSentForApprovalFunctionalitiesAndState';
import PurchaseOrderTable from './purchaseOrderTable';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { emptyCodeMasterTypes, getCodeMasterValue } from 'features/inventory/item/itemSlice';
import { getSupplier } from 'features/inventory/supplier/supplierSlice';
import SubHeading from 'components/shared/others/SubHeading';
import { createApplicationWithWorkflow } from 'features/inventory/storeInWithMigration/storeInMigrationSlice';
import moment from 'moment';
import dynamic from 'next/dynamic';
import UseOwnOfficesLayerAndOfficeObj from 'components/inventory/utils/UseOwnOfficesLayerAndOfficeObj';
// import { NotificationManager } from 'react-notifications';
// import fileCheck from '../../../mainSections/loan-management/loan-application/sanction/FileUploadTypeCheck';
import { getDocumentTypesAccordingToServiceId } from 'features/inventory/purchase-order/purchaseOrderSlice';
import {
  initiallizeDocumentTypeArray,
  onClearDocumentList,
} from 'features/inventory/documentSection/documentSectionSlice';
const DynamicDocSectionHeader = dynamic(() => import('../../../inventory/utils/docSectionHeader'), {
  loading: () => <p>Loading...</p>,
});
const DynamicDocSectionContent = dynamic(() => import('../../../inventory/utils/docSectionContent'), {
  loading: () => <p>Loading...</p>,
});
const PurchaseOrder = () => {
  const { layerObj, officeObj } = UseOwnOfficesLayerAndOfficeObj();

  const dispatch = useDispatch();
  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
  const { allSupplier } = useSelector((state) => state.supplier);
  const { isLoading } = useSelector((state) => state.storeInWithMigration);
  const { documentTypes } = useSelector((state) => state.purchaseOrder);
  const { documentList } = useSelector((state) => state.docSection);

  const validationSchema = yup.object().shape({
    title: yup.string().required('শিরোনাম প্রদান করুন'),
    orderNumber: yup.string().required('কার্যাদেশ নম্বর প্রদান করুন'),
    orderDate: yup.string().required('কার্যাদেশ তারিখ প্রদান করুন'),
    tenderType: yup.object().shape({
      returnValue: yup.string().max(3).required('টেন্ডার এর ধরন নির্বাচন করুন'),
    }),
    supplier: yup.object().shape({
      id: yup.number().required('সরবরাহকারী নির্বাচন করুন'),
    }),
    purchaseOrderArray: yup.array().of(
      yup.object({
        itemId: yup.object().shape({
          id: yup.number().required('আইটেম নির্বাচন করুন'),
        }),
        quantity: yup.string().required('পরিমান প্রদান করুন'),
        pricePerUnit: yup.string().required('মূল্য প্রতি একক  প্রদান করুন '),
      }),
    ),
    layerObj: yup.object().shape({
      id: yup.number().integer().required('লেয়ার নির্বাচন করুন'),
    }),
    officeObj: yup.object().shape({
      id: yup.number().integer().required('অফিস নির্বাচন করুন'),
    }),
    adminEmployeeObj: yup.object().shape({
      designationId: yup.number().integer().required('অনুমোদনকারী নির্বাচন করুন'),
    }),
    documentList: yup.array().of(
      yup.object({
        documentType: yup.string().required('ডকুমেন্টের ধরন নির্বাচন করুন'),
      }),
    ),
  });
  useEffect(() => {
    dispatch(initiallizeDocumentTypeArray(documentTypes));
  }, [documentTypes]);
  useEffect(() => {
    dispatch(getDocumentTypesAccordingToServiceId(23));
    dispatch(getCodeMasterValue('TDT'));
    dispatch(getSupplier('?isPagination=false'));
    return () => {
      dispatch(emptyCodeMasterTypes());
    };
  }, []);
  return (
    <>
      <Formik
        key={[layerObj, officeObj]}
        initialValues={{
          title: '',
          orderNumber: '',
          orderDate: null,
          tenderType: '',
          supplier: null,
          purchaseOrderArray: [
            {
              itemId: null,
              quantity: '',
              pricePerUnit: '',
              total: '',
            },
          ],
          layerObj: layerObj,
          officeObj: officeObj,
          adminEmployeeObj: null,
          documentList: [
            {
              documentType: '',
              documentNumber: '',
              documentPictureFront: '',
              documentPictureFrontName: '',
              documentPictureFrontType: '',
              documentPictureFrontFile: '',

              documentPictureBack: '',
              documentPictureBackName: '',
              documentPictureBackType: '',
              documentPictureBackFile: '',
              addDoc: false,
            },
          ],
          disableAddDoc: false,
        }}
        validateOnChange={true}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          const payload = {
            data: {
              purchaseDetailInfo: {
                title: values.title,
                orderNumber: values.orderNumber,
                orderDate: moment(new Date(values.orderDate)).format('DD/MM/YYYY'),
                tenderType: {
                  typeName: values.tenderType.displayValue,
                  typeCode: values.tenderType.returnValue,
                },
                supplier: {
                  id: values.supplier.id,
                  supplierName: values.supplier.supplierName,
                },
              },
              itemsTobePurchased: values.purchaseOrderArray.map((purchaseItem) => {
                return {
                  itemId: {
                    id: purchaseItem.itemId.id,
                    itemName: purchaseItem.itemId.itemName,
                  },

                  pricePerUnit: purchaseItem.pricePerUnit,
                  total: purchaseItem.total,
                  orderedQuantity: purchaseItem.quantity,
                  assetType: purchaseItem.assetType,
                  approvedQuantity: purchaseItem.quantity,
                  receivedQuantity: '',
                };
              }),
              documentList: values.documentList,
              remarks: values.tenderType.displayValue,
            },
            nextAppDesignationId: +values.adminEmployeeObj.designationId,
            serviceName: 'purchaseOrder',
          };

          dispatch(createApplicationWithWorkflow(payload));
          resetForm();
          setFieldValue('purchaseOrderArray', [
            {
              itemId: null,
              quantity: '',
              pricePerUnit: '',
              total: '',
            },
          ]);
          dispatch(onClearDocumentList());
        }}
      >
        {(props) => {
          const { handlChangeOfficeLayerData, handleChangeOfficeNamesData, handleAdminEmployeeChange } =
            useSentForApprovalStateAndFunctionalites(props);
          const senForApprovalPropsObj = {
            handlChangeOfficeLayerData,
            handleChangeOfficeNamesData,
            handleAdminEmployeeChange,
          };
          const { values, handleChange, touched, errors, setFieldValue } = props;

          useEffect(() => {
            setFieldValue('documentList', documentList);
          }, [documentList]);
          return (
            <Form>
              <Grid container spacing={3}>
                <Grid item md={4} lg={4} xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    name="title"
                    label="শিরোনাম"
                    value={values.title}
                    onChange={handleChange}
                    error={Boolean(touched.title && errors.title)}
                    helperText={errors.title && touched.title && errors.title}
                  />
                </Grid>
                <Grid item md={4} lg={4} xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    name="orderNumber"
                    label="কার্যাদেশ নম্বর"
                    value={values.orderNumber}
                    onChange={handleChange}
                    error={Boolean(touched.orderNumber && errors.orderNumber)}
                    helperText={errors.orderNumber && touched.orderNumber && errors.orderNumber}
                  />
                </Grid>
                <Grid item md={4} lg={4} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      name="orderDate"
                      label="কার্যাদেশ তারিখ"
                      inputFormat="dd/MM/yyyy"
                      disablePast={false}
                      value={values.orderDate}
                      onChange={(date) => setFieldValue('orderDate', date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          error={Boolean(touched.orderDate && errors.orderDate)}
                          helperText={errors.orderDate && touched.orderDate && errors.orderDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={4} lg={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>টেন্ডার এর ধরন</InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      name="tenderType"
                      label="টেন্ডার এর ধরন"
                      value={values.tenderType}
                      onChange={handleChange}
                      error={Boolean(touched.tenderType && errors.tenderType)}
                    >
                      {codeMasterTypes?.map((codeMaster, index) => (
                        <MenuItem key={index} id={codeMaster?.id} value={codeMaster}>
                          {codeMaster?.displayValue}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tenderType?.returnValue && touched.tenderType && (
                      <p style={{ color: 'red', fontSize: '12px' }}>{errors.tenderType?.returnValue}</p>
                    )}
                  </FormControl>
                </Grid>
                <Grid item md={4} lg={4} xs={12}>
                  <Autocomplete
                    key={values.supplier}
                    fullWidth
                    size="small"
                    name="supplier"
                    value={values.supplier}
                    onChange={(e, value) => {
                      if (value) {
                        setFieldValue('supplier', value);
                      }
                    }}
                    options={allSupplier}
                    getOptionLabel={(option) => option.supplierName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="সরবরাহকারী"
                        error={Boolean(touched.supplier && errors.supplier?.id)}
                        helperText={errors.supplier?.id && touched.supplier && errors.supplier?.id}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={12} lg={12} xs={12} sx={{ marginTop: '10px', marginBottom: '0px' }}>
                  <SubHeading>আইটেম সমূহের বিবরণ</SubHeading>
                </Grid>
                <Grid item md={12} lg={12} xs={12}>
                  <PurchaseOrderTable />
                </Grid>

                <DynamicDocSectionHeader />
                {/* <Grid container sx={{ justifyContent: "center" }}>
                    <Typography variant="h6">
                      ইতোমধ্যে প্রাপ্ত ডকুমেন্টের তালিকা :
                    </Typography>
                    {submittedDocs.map((elem, index) => (
                      <Grid item key={elem.id}>
                        <Checkbox checked={elem.isSubmit} disabled />
                        {elem.docTypeDesc}
                      </Grid>
                    ))}
                  </Grid> */}
                <DynamicDocSectionContent />

                <Grid item md={12} lg={12} xs={12}>
                  <SentForApprovalComponent {...senForApprovalPropsObj} />
                </Grid>
                <Grid
                  item
                  md={12}
                  lg={12}
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1%',
                  }}
                >
                  <LoadingButton disabled={isLoading} type="submit" className="btn btn-save" loadingPosition="end">
                    {savButtonLabel}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
export default PurchaseOrder;
