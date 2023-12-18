import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { useDispatch, useSelector } from 'react-redux';

import { FieldArray, Formik } from 'formik';
import { editProductInfo } from 'redux/feature/savingsProduct/savingsProductSlice';
import * as yup from 'yup';
import ProductChargeForm from './ProductChargeForm';
import ProductChargeTableComponent from './ProductChargeTableComponent';

const ProductChargeComponent = ({ handlePage }) => {
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
    chargeArray: yup.array().of(
      yup.object().shape({
        chargeName: yup.string().required('চার্জের নাম নির্বাচন আবশ্যক'),
        effectDate: yup.date().required('কার্যকরী তারিখ দেওয়া আবশ্যক'),
        chargeCreditgl: yup.string().required('চার্জ ক্রেডিট জি.এল নির্বাচন আবশ্যক'),
        chargeType: yup.string().required('চার্জের ধরণ নির্বাচন আবশ্যক'),
        chargeAmount: yup.string().required('চার্জের পরিমাণ দেওয়া আবশ্যক'),
      }),
    ),
  });
  return (
    <>
      <Formik
        key={1}
        initialValues={{
          chargeArray: [
            {
              chargeActive: true,
              chargeAmount: '',
              effectDate: null,
              chargeName: '',
              chargeCreditgl: '',
              chargeType: '',
            },
          ],
        }}
        validateOnChange={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          let requestStatus = '';
          const { chargeArray } = values;
          let chargeArrayWhole = [];
          let payload;
          if (specificProductInfo?.productCharge) {
            chargeArrayWhole = [...specificProductInfo?.productCharge];
          }
          if (editedId != null) {
            chargeArrayWhole = [...specificProductInfo?.productCharge];
            chargeArrayWhole[editedId] = chargeArray[0];
          } else {
            chargeArrayWhole = [...chargeArrayWhole, ...chargeArray];
          }
          payload = {
            data: {
              productCharge: chargeArrayWhole,
            },
          };
          requestStatus = await dispatch(
            editProductInfo({
              id: appId,
              data: {
                route: 'productCharge',
                value: payload,
              },
            }),
          );
          if (requestStatus.meta.requestStatus !== 'rejected') {
            resetForm();
            handlePage(5);
          }
        }}
      >
        {(props) => {
          const { handleSubmit, setFieldValue } = props;
          const editDataFunc = (idx) => {
            setEditedId(idx);
            setFieldValue('chargeArray', [
              {
                chargeActive: specificProductInfo.productCharge[idx].chargeActive,
                chargeAmount: specificProductInfo.productCharge[idx].chargeAmount,
                effectDate: specificProductInfo.productCharge[idx].effectDate,
                chargeName: specificProductInfo.productCharge[idx].chargeName,
                chargeCreditgl: specificProductInfo.productCharge[idx].chargeCreditgl,
                chargeType: specificProductInfo.productCharge[idx].chargeType,
              },
            ]);
          };
          return (
            <>
              <ProductChargeForm />
              <Grid container className="btn-container">
                <FieldArray name="chargeArray">
                  {(arrayHelpers) => {
                    return (
                      <Tooltip title="প্রোডাক্ট চার্জ যোগ করুন">
                        <Button
                          variant="contained"
                          className="btn btn-primary"
                          onClick={() => {
                            arrayHelpers.push({
                              chargeActive: false,
                              chargeAmount: '',
                              effectDate: null,
                              chargeCreditgl: '',
                              chargeName: '',
                            });
                          }}
                          startIcon={<AddIcon />}
                        >
                          {' '}
                          প্রোডাক্ট চার্জ
                        </Button>
                      </Tooltip>
                    );
                  }}
                </FieldArray>
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
              <ProductChargeTableComponent
                data={specificProductInfo?.productCharge || []}
                editDataFunc={editDataFunc}
              />
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default ProductChargeComponent;
