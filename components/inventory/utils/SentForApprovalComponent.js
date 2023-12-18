import { Autocomplete, Grid, TextField } from '@mui/material';
import star from 'components/mainSections/loan-management/loan-application/utils';
import { getOfficeLayerData } from 'features/inventory/storeInWithMigration/storeInMigrationSlice';
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SentForApprovalComponent = ({
  handlChangeOfficeLayerData,
  handleChangeOfficeNamesData,
  handleAdminEmployeeChange,
  layerObj,
  officeObj,
  adminEmployeeObj,
  formError,
  type,
}) => {
  const dispatch = useDispatch();
  const formik = useFormikContext();

  const { officeLayerData, officeNames, adminEmployees } = useSelector((state) => state.storeInWithMigration);
  const { storeAdminDesignationId } = useSelector((state) => state.storeInWithMigration);
  const getDoptorFieldLabel = () => {
    if (formik) {
      if (formik?.values.layerObj?.id) {
        return star('দপ্তর লেয়ার ');
      } else {
        return star('দপ্তর লেয়ার নির্বাচন করুন ');
      }
    } else {
      if (layerObj?.id) {
        return star('দপ্তর লেয়ার ');
      } else {
        return star('দপ্তর লেয়ার নির্বাচন করুন ');
      }
    }
  };
  const getOfficeFieldLabel = () => {
    if (formik) {
      if (formik.values.officeObj?.id) {
        return star('পর্যবেক্ষক/অনুমোদনকারীর অফিস');
      } else {
        return star('পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন');
      }
    } else {
      if (officeObj?.id) {
        return star('পর্যবেক্ষক/অনুমোদনকারীর অফিস');
      } else {
        return star('পর্যবেক্ষক/অনুমোদনকারীর অফিস নির্বাচন করুন');
      }
    }
  };
  const getEmployeeFieldLabel = () => {
    if (formik) {
      if (formik?.values?.adminEmployeeObj?.designationId) {
        return star('পর্যবেক্ষক/অনুমোদনকারীর নাম');
      } else {
        return star('পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন');
      }
    } else {
      if (adminEmployeeObj) {
        return star('পর্যবেক্ষক/অনুমোদনকারীর নাম');
      } else {
        return star('পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন');
      }
    }
  };
  useEffect(() => {
    dispatch(getOfficeLayerData());
  }, []);
  useEffect(() => {
    if (
      !formik?.values.adminEmployeeObj?.designationId &&
      adminEmployees?.length > 0 &&
      type &&
      type === 'storeIn' &&
      formik
    ) {
      formik?.setFieldValue(
        'adminEmployeeObj',
        adminEmployees?.find((admin) => admin?.designationId === storeAdminDesignationId),
      );
    }
  }, [adminEmployees?.length]);
  return (
    <Grid container spacing={2.5} sx={{ marginTop: '20px' }}>
      {officeLayerData?.length > 1 ? (
        <Grid item md={4} lg={4} xs={12}>
          <Autocomplete
            name="layerObj"
            key={formik?.values?.layerObj ? formik?.values?.layerObj : layerObj}
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            onChange={handlChangeOfficeLayerData}
            options={officeLayerData}
            value={formik?.values?.layerObj ? formik?.values?.layerObj : layerObj}
            getOptionLabel={(option) => option.nameBn}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={getDoptorFieldLabel()}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF', margin: '5dp' }}
                error={
                  formik
                    ? Boolean(formik.touched?.layerObj && formik.errors?.layerObj?.id && !formik.values.layerObj)
                    : Boolean(formError?.layerObj)
                }
                helperText={
                  formik
                    ? formik.touched.layerObj && !formik.values.layerObj && formik.errors?.layerObj?.id
                    : formError?.layerObj
                }
              />
            )}
          />
        </Grid>
      ) : null}

      {officeNames?.length > 1 ? (
        <Grid item md={4} lg={4} xs={12}>
          <Autocomplete
            name="officeObj"
            key={formik?.values?.officeObj ? formik?.values?.officeObj : officeObj}
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            onChange={handleChangeOfficeNamesData}
            options={officeNames}
            getOptionLabel={(option) => option.nameBn}
            value={formik?.values?.officeObj ? formik?.values?.officeObj : officeObj}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={getOfficeFieldLabel()}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF', margin: '5dp' }}
                error={
                  formik
                    ? Boolean(formik.touched?.officeObj && formik.errors?.officeObj?.id && !formik.values.officeObj)
                    : Boolean(formError?.officeObj)
                }
                helperText={
                  formik
                    ? formik.touched?.officeObj && !formik.values.officeObj && formik.errors?.officeObj?.id
                    : formError?.officeObj
                }
              />
            )}
          />
        </Grid>
      ) : null}
      <Grid item lg={4} md={4} xs={12}>
        <Autocomplete
          name="adminEmployeeObj"
          key={formik?.values?.adminEmployeeObj ? formik?.values?.adminEmployeeObj : adminEmployeeObj}
          disablePortal
          inputProps={{ style: { padding: 0, margin: 0 } }}
          onChange={handleAdminEmployeeChange}
          options={adminEmployees?.filter((e) => e.designationId !== null)}
          getOptionLabel={(option) => {
            return option.nameBn + '-' + option.designation;
          }}
          value={formik?.values?.adminEmployeeObj ? formik?.values?.adminEmployeeObj : adminEmployeeObj}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={getEmployeeFieldLabel()}
              variant="outlined"
              size="small"
              error={
                formik
                  ? Boolean(
                    formik.touched?.adminEmployeeObj &&
                    formik.errors?.adminEmployeeObj?.designationId &&
                    !formik.values.adminEmployeeObj,
                  )
                  : Boolean(formError?.adminEmployeeObj && !adminEmployeeObj)
              }
              helperText={
                formik
                  ? formik.touched?.adminEmployeeObj &&
                  !formik.values.adminEmployeeObj &&
                  formik.errors?.adminEmployeeObj?.designationId
                  : formError?.adminEmployeeObj && !adminEmployeeObj
                    ? formError?.adminEmployeeObj
                    : ''
              }
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
export default React.memo(SentForApprovalComponent);
