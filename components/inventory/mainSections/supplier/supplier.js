import { Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import useModalOpenClose from 'components/inventory/hooks/useModalOpenClose';
import ModalHeader from 'components/inventory/utils/modalHeader';
import SubHeadingComponent from 'components/inventory/utils/subHeadingComponent';
import star from 'components/mainSections/loan-management/loan-application/utils';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { useFormik } from 'formik';
import lodash from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bangToEng } from 'service/numberConverter';
import * as yup from 'yup';
import { createSupplier, getSupplier, updateSupplier } from '../../../../features/inventory/supplier/supplierSlice';
import {
  dataGridActionColumnName,
  dataGridSerialNumberTitle,
  measurementIsActiveTitle,
  measurementIsInActiveTitle,
  savButtonLabel,
  supplerContactPersonNameErrorMessage,
  supplerPageSubHeadingButtonTitle,
  supplierAddressErrorMessage,
  supplierAddressLengthErrorMessage,
  supplierAddressTextfieldTitle,
  supplierContactPersonNameLengthErrorMessage,
  supplierContactPersonTextFieldTitle,
  supplierDetailsTextfieldTitle,
  supplierEmailErrorMessage,
  supplierEmailTextFieldTitle,
  supplierInvalidEmailErrorMessage,
  supplierInvalidmobileErrorMessage,
  suppliermobileErrorMessage,
  suppliermobileTextfieldTitle,
  supplierModalHeaderTitle,
  supplierNameErrorMessage,
  supplierNameLengthErrorMessage,
  supplierNameTextFieldTitle,
  supplierPageSubHeadingTitle,
  supplierRowEditTitle,
  supplierStatusFieldTitle,
  updateButtonLabel,
} from '../../constants';

const Supplier = () => {
  const dispatch = useDispatch();
  const { allSupplier, isLoading } = useSelector((state) => state.supplier);

  const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();

  const bdmobileRegex = RegExp(/(^(01){1}[3456789]{1}(\d){8})$/);
  const validationSchema = yup.object().shape({
    supplierName: yup.string().max(80, supplierNameLengthErrorMessage).required(supplierNameErrorMessage),
    contactPersonName: yup
      .string()
      .max(50, supplierContactPersonNameLengthErrorMessage)
      .required(supplerContactPersonNameErrorMessage),
    mobileNumber: yup
      .string()
      .matches(bdmobileRegex, supplierInvalidmobileErrorMessage)
      .required(suppliermobileErrorMessage),
    emailId: yup.string().email(supplierInvalidEmailErrorMessage).required(supplierEmailErrorMessage),
    address: yup.string().max(255, supplierAddressLengthErrorMessage).required(supplierAddressErrorMessage),
    // supplierDetails: yup
    //   .string()
    //   .max(255, supplierDetailsLengthErrorMessage)
    //   .required(supplierDetailsErrorMessage),
    isActive: yup.boolean().required(),
  });
  const formik = useFormik({
    initialValues: {
      id: '',
      supplierName: '',
      contactPersonName: '',
      mobileNumber: '',
      emailId: '',
      address: '',
      supplierDetails: '',
      isActive: true,
      isEditMode: false,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      let requestStatus = '';
      values.isEditMode
        ? (requestStatus = await dispatch(updateSupplier(lodash.omit(values, ['isEditMode']))))
        : (requestStatus = await dispatch(createSupplier(lodash.omit(values, ['isEditMode', 'id']))));

      if (requestStatus.meta.requestStatus !== 'rejected') {
        handleModalClose();
        resetForm();
      }
    },
  });

  const columns = [
    {
      headerName: dataGridSerialNumberTitle,
      width: 50,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (index) => {
        return engToBang(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      headerName: supplierNameTextFieldTitle,
      width: 200,
      field: 'supplierName',
      filterable: true,
    },
    {
      headerName: supplierContactPersonTextFieldTitle,
      field: 'contactPersonName',
      width: 200,
      filterable: true,
    },
    {
      headerName: suppliermobileTextfieldTitle,
      width: 150,
      field: 'mobileNumber',
      filterable: true,
    },
    {
      headerName: supplierEmailTextFieldTitle,
      width: 180,
      field: 'emailId',
      filterable: true,
    },
    {
      headerName: supplierDetailsTextfieldTitle,
      width: 200,
      field: 'supplierDetails',
      filterable: false,
    },
    {
      headerName: supplierStatusFieldTitle,
      width: 100,
      field: 'isActive',
      filterable: true,
      valueFormatter: (params) => {
        return params?.value ? measurementIsActiveTitle : measurementIsInActiveTitle;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: dataGridActionColumnName,
      width: 200,

      getActions: ({ row, i }) => {
        return [
          <div key={i} style={{ display: 'flex', justifyCont: 'space-between' }}>
            <Tooltip title={supplierRowEditTitle} placement="top-start">
              <Edit
                className="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  formik.setValues({
                    id: row.id,
                    supplierName: row.supplierName,
                    contactPersonName: row.contactPersonName,
                    mobileNumber: row.mobileNumber,
                    emailId: row.emailId,
                    address: row.address,
                    supplierDetails: row.supplierDetails,
                    isActive: row.isActive,
                    isEditMode: true,
                  });
                  handlModalOpen();
                }}
              ></Edit>
            </Tooltip>
          </div>,
        ];
      },
    },
  ];

  const customToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  };

  useEffect(() => {
    dispatch(getSupplier('?isPagination=false'));
  }, []);
  return (
    <>
      <SubHeadingComponent
        onClickCreateButton={handlModalOpen}
        subHeadingTitle={supplierPageSubHeadingTitle}
        subHeadingButtonTitle={supplerPageSubHeadingButtonTitle}
      />

      <Dialog open={isModalOpen} fullWidth maxWidth="md">
        <ModalHeader
          modalHeaderTitle={supplierModalHeaderTitle}
          onClickCloseIcon={() => {
            formik.resetForm();
            handleModalClose();
          }}
        />
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item md={6} lg={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  id="supplierName"
                  name="supplierName"
                  label={star(supplierNameTextFieldTitle)}
                  value={formik.values.supplierName}
                  onChange={formik.handleChange}
                  error={formik.touched.supplierName && Boolean(formik.errors.supplierName)}
                  helperText={formik.touched.supplierName && formik.errors.supplierName}
                />
              </Grid>
              <Grid item md={6} lg={6} xs={12}>
                <TextField
                  id="contactPersonName"
                  fullWidth
                  size="small"
                  name="contactPersonName"
                  label={star(supplierContactPersonTextFieldTitle)}
                  value={formik.values.contactPersonName}
                  onChange={formik.handleChange}
                  error={formik.touched.contactPersonName && Boolean(formik.errors.contactPersonName)}
                  helperText={formik.touched.contactPersonName && formik.errors.contactPersonName}
                />
              </Grid>
              <Grid item md={6} lg={6} xs={12}>
                <TextField
                  type="tel"
                  id="mobileNumber"
                  fullWidth
                  size="small"
                  name="mobileNumber"
                  label={star(suppliermobileTextfieldTitle)}
                  value={engToBang(formik.values.mobileNumber)}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const mobile = bangToEng(value);
                    formik.setFieldValue(name, mobile.replace(/\D/gi, ''));
                  }}
                  error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                  helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                />
              </Grid>
              <Grid item md={6} lg={6} xs={12}>
                <TextField
                  id="emailId"
                  fullWidth
                  size="small"
                  name="emailId"
                  label={star(supplierEmailTextFieldTitle)}
                  value={formik.values.emailId}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.emailId)}
                  helperText={formik.touched.emailId && formik.errors.emailId}
                />
              </Grid>
              <Grid item md={12} lg={12} xs={12}>
                <TextField
                  id="address"
                  fullWidth
                  size="small"
                  name="address"
                  label={star(supplierAddressTextfieldTitle)}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item md={12} lg={12} xs={12}>
                <TextField
                  id="supplierDetails"
                  fullWidth
                  size="small"
                  name="supplierDetails"
                  label={supplierDetailsTextfieldTitle}
                  value={formik.values.supplierDetails}
                  onChange={formik.handleChange}
                  error={formik.touched.supplierDetails && Boolean(formik.errors.supplierDetails)}
                  helperText={formik.touched.supplierDetails && formik.errors.supplierDetails}
                />
              </Grid>
              {formik.values.isEditMode ? (
                <Grid item md={4} lg={4} xs={12}>
                  <FormControl component="fieldset" size="small">
                    <FormLabel>{supplierStatusFieldTitle}</FormLabel>
                    <RadioGroup row name="isActive" value={formik.values.isActive} onChange={formik.handleChange}>
                      <FormControlLabel value={true} control={<Radio />} label={measurementIsActiveTitle} />
                      <FormControlLabel value={false} control={<Radio />} label={measurementIsInActiveTitle} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              ) : (
                ''
              )}
              <Grid container className="btn-container">
                <Grid item md={12} lg={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <LoadingButton type="submit" className="btn btn-save" loadingPosition="end" disabled={isLoading}>
                    {formik.values.isEditMode ? updateButtonLabel : savButtonLabel}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Grid sx={{ width: '100%' }}>
        {allSupplier.length > 0 ? (
          <DataGrid
            rows={allSupplier}
            columns={columns}
            getRowId={(row) => row.id}
            density="compact"
            localeText={{
              toolbarColumns: '',
              toolbarFilters: '',
              toolbarDensity: '',
              toolbarExport: '',
            }}
            components={{
              Toolbar: customToolbar,
            }}
            autoHeight={true}
          />
        ) : (
          ''
        )}
      </Grid>
    </>
  );
};
export default Supplier;
