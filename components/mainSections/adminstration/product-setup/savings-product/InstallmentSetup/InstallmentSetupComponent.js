import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { useDispatch, useSelector } from 'react-redux';

import { Formik } from 'formik';
import { editProductInfo } from 'redux/feature/savingsProduct/savingsProductSlice';
import * as yup from 'yup';
import InstallmentForm from './InstallmentSetupForm';
import InstallmentSetupTableComponent from './InstallmentSetupTableComponent';
const InstallmentSetupComponent = ({ handlePage }) => {
  const dispatch = useDispatch();
  const [editedId, setEditedId] = useState(null);

  const { appId, specificProductInfo } = useSelector((state) => state.savingsProduct);
  const productName = specificProductInfo?.productMaster?.productName;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAppIdNotification(productName);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [productName]);

  const getAppIdNotification = (foundProduct) => {
    if (!foundProduct) {
      NotificationManager.warning('অনুগ্রহ করে প্রোডাক্ট মাস্টার পেইজ প্ৰথমে সম্পূন্ন করুন।', 'সতর্কতা', 5000);
    }
  };
  const validationSchema = yup.object({
    installmentArray: yup.array().of(
      yup.object().shape({
        installmentAmount: yup.number().required('কিস্তির পরিমাণ দেওয়া আবশ্যক'),
      }),
    ),
  });
  return (
    <>
      <Formik
        key={1}
        initialValues={{
          installmentArray: [
            {
              status: false,
              installmentAmount: '',
            },
          ],
        }}
        validateOnChange={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const { installmentArray } = values;
          let installmentArrayWhole = [];
          let payload;
          if (specificProductInfo?.productInstallment) {
            installmentArrayWhole = [...specificProductInfo?.productInstallment];
          }
          if (editedId != null) {
            installmentArrayWhole = [...specificProductInfo?.productInstallment];
            installmentArrayWhole[editedId] = installmentArray[0];
          } else {
            installmentArrayWhole.push(installmentArray[0]);
          }
          payload = {
            data: {
              productInstallment: installmentArrayWhole,
            },
          };
          dispatch(
            editProductInfo({
              id: appId,
              data: {
                route: 'productInstallment',
                value: payload,
              },
            }),
          );
          resetForm();
          setEditedId(null);
          handlePage(4);
        }}
      >
        {(props) => {
          const { handleSubmit, setFieldValue } = props;
          const editDataFunc = (idx) => {
            setEditedId(idx);
            setFieldValue('installmentArray', [
              {
                status: specificProductInfo.productInstallment[idx].status,
                installmentAmount: specificProductInfo.productInstallment[idx].installmentAmount,
              },
            ]);
          };
          return (
            <>
              <InstallmentForm />
              <Grid container className="btn-container">
                <Tooltip title="সংরক্ষণ করুন">
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={handleSubmit}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {' '}
                    সংরক্ষণ করুন
                  </Button>
                </Tooltip>
              </Grid>
              <InstallmentSetupTableComponent
                data={specificProductInfo?.productInstallment || []}
                editDataFunc={editDataFunc}
              />
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default InstallmentSetupComponent;
