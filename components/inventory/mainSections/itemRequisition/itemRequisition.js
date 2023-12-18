import { Formik, Form } from 'formik';
import { Grid, Select, MenuItem, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { emptyCodeMasterTypes, getCodeMasterValue } from 'features/inventory/item/itemSlice';
import { getItemRequisitionPurpose } from 'features/inventory/item-requisition/itemRequisitionSlice';
import moment from 'moment';
import { savButtonLabel } from '../../constants';
import { LoadingButton } from '@mui/lab';
import SentForApprovalComponent from 'components/inventory/utils/SentForApprovalComponent';
import useSentForApprovalStateAndFunctionalites from 'components/inventory/hooks/useSentForApprovalFunctionalitiesAndState/useSentForApprovalFunctionalitiesAndState';
import ItemRequisitionTable from './itemRequisitionTable';
import { createApplicationWithWorkflow } from 'features/inventory/storeInWithMigration/storeInMigrationSlice';
import * as yup from 'yup';
import UseOwnOfficesLayerAndOfficeObj from 'components/inventory/utils/UseOwnOfficesLayerAndOfficeObj';
const ItemRequisition = () => {
  const { layerObj, officeObj } = UseOwnOfficesLayerAndOfficeObj();
  const dispatch = useDispatch();
  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
  const { iteRequisitionPurpose, isLoading } = useSelector((state) => state.itemRequisition);
  const validationSchema = yup.object().shape({
    requisitionType: yup.string().max(3).required('চাহিদাপত্রের প্রকারভেদ নির্বাচন করুন'),
    requistionPurpose: yup.number().integer().required('চাহিদাপত্রের উদ্দেশ্য নির্বাচন করুন'),
    itemRequisitionArray: yup.array().of(
      yup.object({
        itemId: yup.object().shape({
          id: yup.number().integer().required('আইটেম নির্বাচন করুন'),
        }),

        requisitionQuantity: yup.number().integer().required('আইটেমের পরিমাণ প্রদান করুন'),
        requistionUrgency: yup.object().shape({
          id: yup.number().integer().required('আবেদনের গুরুত্ব নির্বাচন করুন'),
        }),
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
  });
  useEffect(() => {
    dispatch(getCodeMasterValue('RQT'));
    dispatch(getItemRequisitionPurpose());
    return () => {
      dispatch(emptyCodeMasterTypes());
    };
  }, []);

  return (
    <>
      <Formik
        key={[layerObj, officeObj]}
        initialValues={{
          layerObj: layerObj,
          officeObj: officeObj,
          adminEmployeeObj: null,
          requisitionType: '',
          requistionPurpose: '',
          itemRequisitionArray: [
            {
              itemId: null,
              allotedQuantity: '',
              alreadyDeliveredQuantity: '',
              alreadyDeliveredDate: null,
              requisitionQuantity: '',
              requistionUrgency: null,
            },
          ],
        }}
        validateOnChange={true}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          const payload = {
            data: {
              itemRequisitionMstInfo: {
                requestType: values.requisitionType,
                requestDate: moment().format('DD/MM/YY'),
                requestPurpose: values.requistionPurpose,
              },
              itemRequisitionDtlInfo: values.itemRequisitionArray.map((itemInfo) => {
                return {
                  itemId: {
                    id: itemInfo?.itemId?.id,
                    itemName: itemInfo?.itemId?.itemName,
                  },
                  allotedQuantity: null,
                  alreadyReceivedQuantity: null,
                  alreadyReceivedDate: null,
                  requisitionUrgency: itemInfo?.requistionUrgency,
                  requestedQuantity: itemInfo?.requisitionQuantity,
                  approvedQuantity: '',
                  deliveredQuantity: '',
                };
              }),
              remarks: codeMasterTypes.find((type) => type.returnValue === values.requisitionType)?.displayValue,
            },
            nextAppDesignationId: +values.adminEmployeeObj.designationId,
            serviceName: 'inventoryItemRequisition',
          };
          dispatch(createApplicationWithWorkflow(payload));
          resetForm();
          setFieldValue('itemRequisitionArray', [
            {
              itemId: null,
              allotedQuantity: '',
              alreadyDeliveredQuantity: '',
              alreadyDeliveredDate: null,
              requisitionQuantity: '',
              requistionUrgency: null,
            },
          ]);
        }}
      >
        {(props) => {
          const { handlChangeOfficeLayerData, handleChangeOfficeNamesData, handleAdminEmployeeChange } =
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useSentForApprovalStateAndFunctionalites(props);
          const senForApprovalPropsObj = {
            handlChangeOfficeLayerData,
            handleChangeOfficeNamesData,
            handleAdminEmployeeChange,
          };
          const { values, handleChange, touched, errors } = props;

          return (
            <Grid container spacing={3}>
              <Grid item md={12} lg={12}>
                <Form>
                  <Grid container spacing={3}>
                    <Grid item md={6} lg={6} xs={12}>
                      <FormControl>
                        <FormLabel>চাহিদার প্রকারভেদ</FormLabel>
                        <RadioGroup row name="requisitionType" value={values?.requisitionType} onChange={handleChange}>
                          {codeMasterTypes
                            ?.filter((type) => {
                              return type.codeType == 'RQT';
                            })
                            .map((type) => (
                              <FormControlLabel
                                key={type.returnValue}
                                value={type?.returnValue}
                                label={type?.displayValue}
                                control={<Radio />}
                              />
                            ))}
                        </RadioGroup>
                        {errors.requisitionType && touched.requisitionType && !values?.requisitionType && (
                          <p style={{ color: 'red', fontSize: '12px' }}>{errors.requisitionType}</p>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item md={6} lg={6} xs={12}>
                      <FormLabel>চাহিদার উদ্দেশ্য</FormLabel>
                      <Select
                        name="requistionPurpose"
                        size="small"
                        fullWidth
                        value={values?.requistionPurpose}
                        onChange={handleChange}
                        error={Boolean(
                          touched.requistionPurpose && !values?.requistionPurpose && errors.requistionPurpose,
                        )}
                      >
                        {iteRequisitionPurpose?.map((purpose) => (
                          <MenuItem key={purpose?.id} value={purpose?.id}>
                            {purpose?.purposeName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.requistionPurpose && touched.requistionPurpose && !values?.requistionPurpose && (
                        <p style={{ color: 'red', fontSize: '12px' }}>{errors.requistionPurpose}</p>
                      )}
                    </Grid>
                    <ItemRequisitionTable />
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
                        marginTop: '2%',
                      }}
                    >
                      <LoadingButton disabled={isLoading} type="submit" className="btn btn-save" loadingPosition="end">
                        {savButtonLabel}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Form>
              </Grid>
            </Grid>
          );
        }}
      </Formik>
    </>
  );
};
export default ItemRequisition;
