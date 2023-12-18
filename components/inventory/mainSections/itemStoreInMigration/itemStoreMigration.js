/* eslint-disable react-hooks/rules-of-hooks */
import { Formik, Form } from 'formik';
import { Grid, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import star from 'components/utils/coop/star';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { storeInTypeSelectedTitle, storeInTypeUnselectedTitle } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { emptyCodeMasterTypes, getCodeMasterValue } from 'features/inventory/item/itemSlice';
import ExcelEntryTable from './excelEntryTable';
import ManualEntryTable from './manualEntryTable';
import { LoadingButton } from '@mui/lab';
import useModalFunctionalitiesAndValues from 'components/inventory/hooks/itemStoreInMIgration/useModalFunctionalitiesAndValues';
// import AddIcon from '@mui/icons-material/Add';
import ExcelUploadModal from './excelUploadModal';
import SentForApprovalComponent from 'components/inventory/utils/SentForApprovalComponent';
import useSentForApprovalStateAndFunctionalites from 'components/inventory/hooks/useSentForApprovalFunctionalitiesAndState/useSentForApprovalFunctionalitiesAndState';

import { createApplicationWithWorkflow } from 'features/inventory/storeInWithMigration/storeInMigrationSlice';
import { savButtonLabel } from '../../constants';
import UseOwnOfficesLayerAndOfficeObj from 'components/inventory/utils/UseOwnOfficesLayerAndOfficeObj';
// import UseSetSingleArrayAsDefaultValue from 'components/inventory/hooks/useSetSingleArrayAsDefaultValue';
// import { fetchStore } from 'features/inventory/item-store/item-store-api';
import { getStore } from 'features/inventory/item-store/item-store-slice';
const ItmeStoreMigration = () => {
  const { layerObj, officeObj } = UseOwnOfficesLayerAndOfficeObj();
  const dispatch = useDispatch();
  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);

  const { isLoading } = useSelector((state) => state.storeInWithMigration);
  const { allStores } = useSelector((state) => state.itemStore);
  // const { adminEmployees } = useSelector((state) => state.storeInWithMigration);
  const [isManual, setIsManual] = useState(false);

  const [isExcel, setIsExcel] = useState(false);

  const validationSchema = yup.object().shape({
    ...(isExcel && {
      excelEntryData: yup.array().of(
        yup.object().shape({
          storeName: yup.object().shape({
            id: yup.number().integer().required('স্টোরের নাম নির্বাচন করুন'),
          }),
        }),
      ),
    }),
    ...(isManual && {
      manualEntryData: yup.array().of(
        yup.object({
          groupName: yup.object().shape({
            id: yup.number().integer().required('গ্রুপের নাম প্রদান করুন'),
          }),
          categoryName: yup.object().shape({
            id: yup.number().integer().required('ক্যাটাগরির নাম প্রদান করুন'),
          }),
          itemName: yup.object().shape({
            id: yup.number().integer().required('আইটেমের নাম প্রদান করুন'),
          }),
          unitName: yup.object().shape({
            id: yup.number().integer().required('এককের নাম প্রদান করুন'),
          }),
          quantity: yup.number().integer().required('পরিমাণ প্রদান করুন '),
          storeName: yup.object().shape({
            id: yup.number().integer().required('স্টোরের নাম নির্বাচন করুন'),
          }),
        }),
      ),
    }),

    layerObj: yup.object().shape({
      id: yup.number().integer().required('লেয়ার নির্বাচন করুন'),
    }),
    officeObj: yup.object().shape({
      id: yup.number().integer().required('অফিস নির্বাচন করুন'),
    }),
    adminEmployeeObj: yup.object().shape({
      designationId: yup.number().integer().required('অনুমোদনকারী নির্বাচন করুন'),
    }),
  });
  useEffect(() => {
    dispatch(getCodeMasterValue('SIT'));
    dispatch(getStore());
    return () => {
      dispatch(emptyCodeMasterTypes());
    };
  }, []);

  return (
    <Formik
      key={[layerObj, officeObj]}
      initialValues={{
        storeInType: '',
        excelEntryData: [],
        manualEntryData: [],
        layerObj: layerObj,
        officeObj: officeObj,
        adminEmployeeObj: null,
        isExcelEntry: false,
        isManualEntry: false,
      }}
      validationSchema={validationSchema}
      validateOnChange={true}
      onSubmit={async (values, { resetForm }) => {
        let requestStatus = '';
        const payload = values.isExcelEntry
          ? {
              data: {
                itemData: values.excelEntryData.map((data) => {
                  return {
                    groupName: data?.groupName,
                    categoryName: data?.categoryName,
                    unitName: data?.unitName,
                    storeName: data?.storeName?.storeName,
                    storeId: +data?.storeName?.id,
                    itemId: +data?.itemId,
                    itemName: data?.itemName,
                    quantity: +data?.quantity,
                    assetType: data.goodsType,
                    isAsset: data?.isAsset,
                  };
                }),
                storeInType: {
                  id: values.storeInType.id,
                  name: values.storeInType.displayValue,
                },
              },
              nextAppDesignationId: +values.adminEmployeeObj.designationId,
              serviceName: 'storeInMigration',
            }
          : {
              data: {
                itemData: values.manualEntryData.map((data) => {
                  return {
                    groupName: data?.groupName?.groupName,
                    categoryName: data?.categoryName?.categoryName,
                    unitName: data?.unitName?.mouName,
                    storeName: data?.storeName?.storeName,
                    storeId: +data?.storeName?.id,
                    itemId: +data?.itemName?.id,
                    itemName: data?.itemName?.itemName,
                    quantity: +data?.quantity,
                    assetType: data.goodsType,
                    isAsset: data?.itemName?.isAsset,
                  };
                }),
                storeInType: {
                  id: values.storeInType.id,
                  name: values.storeInType.displayValue,
                },
              },
              nextAppDesignationId: +values.adminEmployeeObj.designationId,
              serviceName: 'storeInMigration',
            };

        requestStatus = await dispatch(createApplicationWithWorkflow(payload));

        if (requestStatus.meta.requestStatus !== 'rejected') {
          resetForm();
        }
      }}
    >
      {(props) => {
        const {
          open,
          file,

          handleClickOpen,
          handleClose,
          handleChangeFile,
          handleExcelToJson,
          createWorkbook,
        } = useModalFunctionalitiesAndValues(props);
        const {
          handlChangeOfficeLayerData,
          handleChangeOfficeNamesData,
          handleAdminEmployeeChange,
          layerObj,
          officeObj,
        } = useSentForApprovalStateAndFunctionalites(props);
        const senForApprovalPropsObj = {
          handlChangeOfficeLayerData,
          handleChangeOfficeNamesData,
          handleAdminEmployeeChange,
          layerObj,
          officeObj,
          type: 'storeIn',
        };

        const { values, handleChange } = props;

        if (allStores.length === 0) {
          return null;
        }

        return (
          <>
            <Grid container spacing={3}>
              <Grid item md={12} lg={12} xl={12}>
                <FormControl fullWidth>
                  <InputLabel>
                    {values.storeInType ? star(storeInTypeSelectedTitle) : star(storeInTypeUnselectedTitle)}
                  </InputLabel>
                  <Select
                    size="small"
                    name="storeInType"
                    id="storeInType"
                    value={values?.storeInType}
                    label={values.storeInType ? star(storeInTypeSelectedTitle) : star(storeInTypeUnselectedTitle)}
                    onChange={handleChange}
                  >
                    {codeMasterTypes?.map((type) => (
                      <MenuItem value={type} key={type?.id}>
                        {type?.displayValue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} lg={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <>
                  <Button
                    className="btn btn-primary"
                    sx={{ mr: '5px' }}
                    onClick={async () => {
                      // const stores = await fetchStore();

                      setIsManual(true);
                      setIsExcel(false);
                      props.setFieldValue('isManualEntry', true);
                      props.setFieldValue('');
                      props.setFieldValue('excelEntryData', []);
                      props.setFieldValue('manualEntryData', [
                        {
                          groupName: null,
                          categoryName: null,
                          itemName: null,
                          unitName: null,
                          quantity: '',
                          storeName: allStores?.length === 1 ? allStores[0] : null,
                        },
                      ]);
                      if (props.values.isExcelEntry) {
                        props.setFieldValue('isExcelEntry', false);
                      }
                    }}
                  >
                    ম্যানুয়াল এন্ট্রি
                  </Button>
                  <Button
                    className="btn btn-primary"
                    sx={{ mr: '5px' }}
                    // disabled={}

                    onClick={createWorkbook}
                  >
                    এক্সেল ডাউনলোড
                  </Button>
                  <Button
                    sx={{ mr: '5px' }}
                    className="btn btn-primary"
                    onClick={() => {
                      setIsExcel(true);
                      setIsManual(false);
                      props.setFieldValue('isExcelEntry', true);
                      props.setFieldValue('manualEntryData', []);
                      if (props.values.isManualEntry) {
                        props.setFieldValue('isManualEntry', false);
                      }
                      handleClickOpen();
                    }}
                  >
                    এক্সেল আপলোড
                  </Button>
                </>
              </Grid>
              <Grid item md={12} lg={12} xs={12}>
                <Form>
                  {props.values.isExcelEntry ? <ExcelEntryTable /> : ''}
                  {props.values.isManualEntry ? <ManualEntryTable /> : ''}
                  {(props.values.excelEntryData.length > 0 || props.values.manualEntryData.length > 0) && (
                    <SentForApprovalComponent {...senForApprovalPropsObj} />
                  )}
                  <Grid
                    item
                    md={12}
                    lg={12}
                    xs={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '2%',
                    }}
                  >
                    <LoadingButton
                      disabled={
                        isLoading ||
                        (props.values.isManualEntry && props.values.manualEntryData.length === 0) ||
                        (props.values.isExcelEntry && props.values.excelEntryData.length === 0) ||
                        (props.values.manualEntryData.length === 0 && props.values.excelEntryData.length === 0)
                      }
                      type="submit"
                      className="btn btn-save"
                      loadingPosition="end"
                    >
                      {savButtonLabel}
                    </LoadingButton>
                  </Grid>
                  <ExcelUploadModal
                    open={open}
                    file={file}
                    handleClickOpen={handleClickOpen}
                    handleClose={handleClose}
                    handleChangeFile={handleChangeFile}
                    handleExcelToJson={handleExcelToJson}
                  />
                </Form>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};
export default ItmeStoreMigration;
