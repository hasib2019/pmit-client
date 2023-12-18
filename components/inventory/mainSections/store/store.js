/* eslint-disable no-unused-vars */
import { useFormik } from 'formik';
import {
  dataGridActionColumnName,
  dataGridSerialNumberTitle,
  itemRowEditTitle,
  measurementIsActiveTitle,
  measurementIsInActiveTitle,
  savButtonLabel,
  storeAdminFieldErrorMessage,
  storeAdminFieldTitle,
  storeDescriptionFieldTitle,
  storeModalHeaderTitle,
  storeNameFieldErrorMessage,
  storeNameFieldTitle,
  storeOfficeFieldErrorMessage,
  storeOfficeFieldTitle,
  storeStatusTitle,
  storeSubHeadingButtonTitle,
  storeSubHeadingTitle,
  storeUnitFieldTitle,
  updateButtonLabel,
} from '../../constants';

import { Edit } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete,
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
import {
  createStore,
  getAllDesignationIdByOfficeId,
  getAllDoptorLayers,
  getAllOfficeByLayer,
  getStore,
  onClearStoresCascadingDropDown,
  updateStore,
} from 'features/inventory/item-store/item-store-slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import {
  fetchAllDoptorLayer,
  fetchAllEmployeeDesignationIdByOfficeId,
  fetchAllOfficeByDoptorLayer,
  fetchAllOfficeUnitByOfficeId,
} from 'features/inventory/item-store/item-store-api';
import { onChangeDropDownValueInEdit } from 'features/inventory/item-store/item-store-slice';
const StoreComponent = () => {
  const dispatch = useDispatch();
  const { allStores, allOffices, allOfficeUnits, allAdmins } = useSelector((state) => state.itemStore);
  const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();
  const validationSchema = yup.object().shape({
    storeName: yup.string().required(storeNameFieldErrorMessage),
    // doptorId: yup
    //   .object()
    //   .required(storeDoptorLayerFieldErrorMessage)
    //   .shape({
    //     id: yup.number().required(storeDoptorLayerFieldErrorMessage),
    //   }),

    officeId: yup
      .object()
      .required(storeOfficeFieldErrorMessage)
      .shape({
        id: yup.number().required(storeOfficeFieldErrorMessage),
      }),
    // storeDetails: yup
    //   .string()
    //   .max(255, "")
    //   .required(storeDescriptionFieldErrorMessage),
    adminDeskId: yup
      .object()
      .required(storeAdminFieldErrorMessage)
      .shape({
        designationId: yup.number().required(storeAdminFieldErrorMessage),
      }),
  });
  const formik = useFormik({
    initialValues: {
      id: '',
      storeName: '',
      unitId: null,
      doptorId: null,
      officeId: null,
      storeDetails: '',
      adminDeskId: null,

      isActive: true,
      isEditMode: false,
    },
    validateOnChange: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let requestStatus = '';
      values.isEditMode
        ? (requestStatus = await dispatch(
            updateStore({
              id: formik.values.id,
              storeName: formik.values.storeName,
              unitId: formik.values.unitId?.id ? formik.values.unitId?.id : null,
              // doptorId: formik.values.doptorId?.id
              //   ? formik.values.doptorId?.id
              //   : formik.values.doptorId,
              officeId: formik.values.officeId.id,
              ...(formik.values.storeDetails && {
                storeDetails: formik.values.storeDetails,
              }),
              adminDeskId: formik.values.adminDeskId.designationId,

              isActive: formik.values.isActive,
            }),
          ))
        : (requestStatus = await dispatch(
            createStore({
              storeName: formik.values.storeName,
              unitId: formik.values.unitId?.id ? formik.values.unitId?.id : null,
              // doptorId: formik.values.doptorId?.id
              //   ? formik.values.doptorId?.id
              //   : formik.values.doptorId,
              officeId: formik.values.officeId.id,
              ...(formik.values.storeDetails && {
                storeDetails: formik.values.storeDetails,
              }),
              adminDeskId: formik.values.adminDeskId.designationId,

              isActive: formik.values.isActive,
            }),
          ));

      if (requestStatus.meta.requestStatus !== 'rejected') {
        resetForm();
        dispatch(onClearStoresCascadingDropDown());
        // setRowData('');
        handleModalClose();
      }
    },
  });

  // const [ setRowData] = useState('');

  const [columns] = useState([
    {
      headerName: dataGridSerialNumberTitle,
      width: 80,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (index) => {
        return engToBang(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      headerName: storeNameFieldTitle,
      field: 'storeName',
      width: 280,
      filterable: true,
    },
    // {
    //   headerName: storeDoptorLayerFieldTitle,
    //   field: "doptorNameBangla",
    //   width: 250,
    //   filterable: true,
    //   // valueFormatter: (params) => {
    //   //   ("parmas3", params);
    //   // },
    // },
    {
      headerName: storeOfficeFieldTitle,
      field: 'officeNameBangla',
      width: 250,
      filterable: true,
    },
    {
      headerName: storeUnitFieldTitle,
      field: 'unitNameBangla',
      width: 100,
      filterable: true,
      valueFormatter: (params) => {
        return params.value ? params.value : 'সকল ইউনিট';
      },
    },
    {
      headerName: storeAdminFieldTitle,
      field: 'designationNameBangla',
      width: 260,
      filterable: true,
      // valueFormatter: (params) => {},
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: dataGridActionColumnName,
      width: 80,

      getActions: ({ row }) => {
        return [
          <div key={row} style={{ display: 'flex', justifyCont: 'space-between' }}>
            <Tooltip title={itemRowEditTitle} placement="top-start">
              <Edit
                className="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  const allLayers = await fetchAllDoptorLayer();
                  const allOfficesByLayer = await fetchAllOfficeByDoptorLayer(row.doptorId);
                  const allDesignationByOffecId = await fetchAllEmployeeDesignationIdByOfficeId(row.officeId);
                  const allOfficeUnitsId = await fetchAllOfficeUnitByOfficeId(row.officeId);
                  dispatch(
                    onChangeDropDownValueInEdit({
                      offices: allOfficesByLayer?.data,
                      admins: allDesignationByOffecId?.data,
                      layers: allLayers?.data,
                      units: allOfficeUnitsId?.data,
                    }),
                  );
                  formik.setValues({
                    id: row.id,
                    storeName: row.storeName,
                    unitId: allOfficeUnitsId.data.find((elm) => elm.id == row.unitId)
                      ? allOfficeUnitsId.data.find((elm) => elm.id == row.unitId)
                      : {
                          id: null,
                          nameEn: 'AllUnit',
                          nameBn: 'সকল ইউনিট',
                        },

                    officeId: allOfficesByLayer.data.find((elm) => elm.id == row.officeId),
                    storeDetails: row.storeDetails,
                    adminDeskId: allDesignationByOffecId.data.find((elm) => {
                      return elm.designationId === row.deskId;
                    }),

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
  ]);

  useEffect(() => {
    dispatch(getAllDoptorLayers());
    dispatch(getStore());
    dispatch(getAllOfficeByLayer());
  }, []);

  function CustomToolbar() {
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
  }

  if (allOffices.length === 0) {
    return null;
  }
  return (
    <>
      <SubHeadingComponent
        onClickCreateButton={handlModalOpen}
        subHeadingTitle={storeSubHeadingTitle}
        subHeadingButtonTitle={storeSubHeadingButtonTitle}
      />
      <Dialog open={isModalOpen} fullWidth maxWidth="md">
        <ModalHeader
          modalHeaderTitle={storeModalHeaderTitle}
          onClickCloseIcon={() => {
            handleModalClose();
            formik.resetForm();
            dispatch(onClearStoresCascadingDropDown());
            // setRowData('');
          }}
        />
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  id="storeName"
                  name="storeName"
                  onChange={formik.handleChange}
                  value={formik.values.storeName}
                  label={star(storeNameFieldTitle)}
                  size="small"
                  fullWidth
                  error={formik.touched.storeName && Boolean(formik.errors.storeName)}
                  helperText={formik.touched.storeName && formik.errors.storeName}
                />
              </Grid>

              {/* <Grid item md={4} lg={4} xs={12}>
                <Autocomplete
                  name="doptorId"
                  id="doptorId"
                  options={allDoptorLayers}
                  value={formik.values.doptorId}
                  onChange={(event, value, name) => {
                    if (value) {
                      formik.setFieldValue("doptorId", value);
                      formik.setFieldValue("officeId", null);
                      formik.setFieldValue("adminDeskId", null);
                      dispatch(getAllOfficeByLayer(value.id));
                    }
                  }}
                  getOptionLabel={(option) => option?.nameBn}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={star(storeDoptorLayerFieldTitle)}
                      size="small"
                      fullWidth
                      error={
                        formik.touched.doptorId &&
                        Boolean(formik.errors.doptorId?.id)
                      }
                      helperText={
                        formik.touched.doptorId && formik.errors.doptorId?.id
                      }
                    />
                  )}
                />
              </Grid> */}
              <Grid item md={6} lg={6} xs={12}>
                <Autocomplete
                  key={formik.values.officeId}
                  id="officeId"
                  name="officeId"
                  disableClearable={true}
                  onChange={(e, value) => {
                    if (value) {
                      formik.setFieldValue('officeId', value);
                      formik.setFieldValue('adminDeskId', null);
                      dispatch(getAllDesignationIdByOfficeId(value.id));
                    }
                  }}
                  options={allOffices}
                  value={formik.values.officeId}
                  getOptionLabel={(option) => option?.nameBn}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={star(storeOfficeFieldTitle)}
                      size="small"
                      fullWidth
                      error={formik.touched.officeId && Boolean(formik.errors.officeId?.id)}
                      helperText={formik.touched.officeId && formik.errors?.officeId?.id}
                      // error={Boolean(
                      //   formik.touched.officeId && formik.errors.officeId?.id
                      // )}
                      // helperText={
                      //   formik.touched.officeId &&
                      //   formik.errors.officeId &&
                      //   formik.errors.officeId?.id
                      // }
                    />
                  )}
                />
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                <Autocomplete
                  id="unitId"
                  name="unitId"
                  value={formik.values.unitId}
                  onChange={(e, value) => {
                    formik.setFieldValue('unitId', value);
                  }}
                  options={[
                    {
                      id: null,
                      nameEn: 'AllUnit',
                      nameBn: 'সকল ইউনিট',
                    },
                    ...allOfficeUnits,
                  ]}
                  getOptionLabel={(option) => option?.nameBn}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={star(storeUnitFieldTitle)}
                      size="small"
                      fullWidth
                      error={formik.touched.unitId && Boolean(formik.errors.unitId?.id)}
                      helperText={formik.touched.unitId && formik.errors.unitId?.id}
                    />
                  )}
                />
              </Grid>

              <Grid item md={6} lg={6} xs={12}>
                <Autocomplete
                  key={formik.values.adminDeskId}
                  id="adminDeskId"
                  name="adminDeskId"
                  options={allAdmins}
                  value={formik.values.adminDeskId}
                  onChange={(e, value) => {
                    formik.setFieldValue('adminDeskId', value);
                  }}
                  getOptionLabel={(option) => option.nameBn + ' ' + '-' + ' ' + option.designation}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={star(storeAdminFieldTitle)}
                      size="small"
                      fullWidth
                      error={formik.touched.adminDeskId && Boolean(formik.errors.adminDeskId?.designationId)}
                      helperText={formik.touched.adminDeskId && formik.errors?.adminDeskId?.designationId}
                    />
                  )}
                />
              </Grid>

              <Grid item md={12} lg={12} xs={12}>
                <TextField
                  id="storeDetails"
                  name="storeDetails"
                  label={storeDescriptionFieldTitle}
                  onChange={formik.handleChange}
                  value={formik.values.storeDetails}
                  size="small"
                  fullWidth
                  error={formik.touched.storeDetails && Boolean(formik.errors.storeDetails)}
                  helperText={formik.touched.storeDetails && formik.errors.storeDetails}
                />
              </Grid>

              {formik.values.isEditMode ? (
                <Grid item md={4} lg={4} xs={12}>
                  <FormControl component="fieldset" size="small">
                    <FormLabel>{star(storeStatusTitle)}</FormLabel>
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
                  <LoadingButton type="submit" className="btn btn-save" loadingPosition="end">
                    {formik.values.isEditMode ? updateButtonLabel : savButtonLabel}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Grid sx={{ width: '100%' }}>
        {allStores.length > 0 ? (
          <DataGrid
            rows={allStores?.map((elm) => {
              return {
                id: elm.id,
                doptorId: elm.doptorId,
                officeId: elm.officeId,
                unitId: elm.unitId,
                adminDeskId: elm.adminName,
                deskId: elm.adminDeskId,
                storeName: elm.storeName,
                storeDetails: elm.storeDetails,
                isActive: elm.isActive,
                doptorNameBangla: elm.doptorNameBangla,
                officeNameBangla: elm.officeNameBangla,
                unitNameBangla: elm.unitNameBangla,
                designationNameBangla: elm.adminName + '-' + elm.designationNameBangla,
              };
            })}
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
              Toolbar: CustomToolbar,
            }}
            autoHeight={true}
          ></DataGrid>
        ) : (
          ''
        )}
      </Grid>
    </>
  );
};
export default StoreComponent;
