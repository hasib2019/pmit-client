import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Dialog,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { useDispatch, useSelector } from 'react-redux';
import SubHeading from '../../../../../shared/others/SubHeading';

import CloseIcon from '@mui/icons-material/Close';
import {
  bangToEng,
  engToBang,
  myValidate,
} from 'components/mainSections/samity-managment/member-registration/validator';
import { Formik } from 'formik';
import { editProductInfo } from 'redux/feature/savingsProduct/savingsProductSlice';
import * as yup from 'yup';
import ProfitForm from './ProfitForm';
import ProfitTableComponent from './ProfitTableComponent';

const ProfitComponent = ({ handlePage, setSavings, savings }) => {
  const dispatch = useDispatch();
  const { appId, specificProductInfo } = useSelector((state) => state.savingsProduct);
  const productName = specificProductInfo?.productMaster?.productName;
  const [editedId, setEditedId] = useState(null);
  const [modalClicked, setModalClicked] = useState(false);
  const [preMatureArray, setPreMatureArray] = useState([]);
  // useEffect(() => {
  //   getAppIdNotification();
  // }, []);

  // const handleClose = () => {
  //   setModalClicked(false);
  // };
  const handleClose = () => {
    setModalClicked(false);
  };
  const handleChangeE = (e, index) => {
    let { name, value, id } = e.target;
    let resultObj;
    const preMatureArrayCopy = [...preMatureArray];

    value = bangToEng(value);
    if (id == 'number') {
      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }
    }
    preMatureArrayCopy[index][name] = resultObj?.value;
    setPreMatureArray(preMatureArrayCopy);
  };
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
    productProfitArray: yup.array().of(
      yup.object().shape({
        effectDate: yup.date().required('কার্যকরী তারিখ দেওয়া আবশ্যক'),
        profitRate: yup.string().when('savings', (savings, schema) => {
          if (specificProductInfo?.productMaster?.maturityAmtInstruction != 'F') {
            return schema.required('মুনাফার হার দেওয়া আবশ্যক');
          } else {
            return schema.notRequired();
          }
        }),
        insAmt: yup.string().required('কিস্তির পরিমাণ দেওয়া আবশ্যক'),
        maturityAmount: yup.string().when('savings', (savings, schema) => {
          if (savings == 'C' && specificProductInfo?.productMaster?.maturityAmtInstruction == 'F') {
            return schema.required('ম্যাচুরিটি পরিমাণ দেওয়া আবশ্যক');
          } else {
            return schema.notRequired();
          }
        }),
        duration: yup.string().when('savings', (savings, schema) => {
          if (savings == 'C' || savings == 'F') {
            return schema.required('সময়কাল(মাসিক) দেওয়া আবশ্যক');
          } else {
            return schema.notRequired();
          }
        }),
      }),
    ),
  });

  return (
    <>
      <Formik
        key={1}
        initialValues={{
          productProfitArray: [
            {
              effectDate: null,
              profitRate: '',
              maturityAmount: '',
              duration: '',
              status: true,
              insAmt: '',
              savings: savings,
            },
          ],
        }}
        validationSchema={validationSchema}
        validateOnChange={true}
        onSubmit={async (values, { resetForm }) => {
          let requestStatus = '';
          const { productProfitArray } = values;
          let productProfitArrayWhole = [];
          const preMatureArrayCopy = [];
          if (specificProductInfo?.productInterest) {
            productProfitArrayWhole = [...specificProductInfo?.productInterest];
          }
          let payload;
          if (editedId != null) {
            productProfitArrayWhole = [...specificProductInfo.productInterest];
            productProfitArrayWhole[editedId] = productProfitArray[0];
          } else {
            productProfitArrayWhole.push(productProfitArray[0]);
            if (productProfitArray[0].savings == 'C') {
              const duration = productProfitArray[0].duration / 12 - 1;
              for (let i = 0; i < duration; i++) {
                preMatureArrayCopy.push({
                  insAmt: productProfitArray[0].insAmt,
                  profitRate: '',
                  timePeriod: +(i + 1) * 12,
                  maturityAmount: '',
                });
              }
              setPreMatureArray(preMatureArrayCopy);
              setModalClicked(true);
              return;
            }
          }

          payload = {
            data: {
              productInterest: productProfitArrayWhole,
            },
          };
          requestStatus = await dispatch(
            editProductInfo({
              id: appId,
              data: {
                route: 'productInterest',
                value: payload,
              },
            }),
          );
          if (requestStatus.meta.requestStatus !== 'rejected') {
            resetForm();
            setEditedId(null);
            handlePage('4');
          }
        }}
      >
        {(props) => {
          const { values, handleSubmit, resetForm, setFieldValue } = props;
          const editDataFunc = (idx) => {
            setEditedId(idx);
            // const productArray=[];
            // productArray.push(specificProductInfo.productInterest[idx])
            setFieldValue('productProfitArray', [
              {
                effectDate: specificProductInfo.productInterest[idx]?.effectDate,
                profitRate: specificProductInfo.productInterest[idx]?.profitRate,
                maturityAmount: specificProductInfo.productInterest[idx]?.maturityAmount,
                duration: specificProductInfo.productInterest[idx]?.duration,
                status: specificProductInfo.productInterest[idx]?.status,
                insAmt: specificProductInfo.productInterest[idx]?.insAmt,
              },
            ]);
          };
          const handlePreMature = async () => {
            const { productProfitArray } = values;
            let payload, requestStatus;
            const preMatureArrayCopy = [...preMatureArray];
            preMatureArrayCopy.forEach((elem) => {
              elem.profitRate = bangToEng(elem.profitRate);
              elem.maturityAmount = bangToEng(elem.maturityAmount);
            });
            productProfitArray.forEach((elem) => {
              elem.productPreMature = preMatureArrayCopy;
            });

            payload = {
              data: {
                productInterest: productProfitArray,
              },
            };
            requestStatus = await dispatch(
              editProductInfo({
                id: appId,
                data: {
                  route: 'productInterest',
                  value: payload,
                },
              }),
            );
            if (requestStatus.meta.requestStatus !== 'rejected') {
              resetForm();
              setEditedId(null);
              handlePage('4');
            }
          };

          return (
            <>
              <ProfitForm setSavings={setSavings} savings={savings} />

              <ProfitTableComponent
                data={specificProductInfo?.productInterest || []}
                editDataFunc={editDataFunc}
                setSavings={setSavings}
                savings={savings}
              />
              {modalClicked ? (
                <div
                  style={{
                    zIndex: '10',
                    position: 'absolute',
                  }}
                >
                  <Dialog
                    className="diaModal"
                    open={modalClicked}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    scroll="body"
                  >
                    <div className="modal">
                      <Grid item md={12} xs={12}>
                        <SubHeading>প্রিম্যাচুর সেটআপ করুন</SubHeading>
                        <IconButton
                          aria-label="close"
                          onClick={handleClose}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                      <Grid>
                        <TableContainer className="table-container">
                          <Table size="small" aria-label="a dense table">
                            <TableHead className="table-head">
                              <TableRow>
                                <TableCell>সময়কাল</TableCell>
                                <TableCell>মুনাফার হার</TableCell>
                                <TableCell>ম্যাচুরিটি পরিমাণ</TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {preMatureArray.length > 0
                                ? preMatureArray.map((row, i) => (
                                  <TableRow key={i + 'table'}>
                                    <TableCell>{engToBang(row.timePeriod)}</TableCell>
                                    <TableCell>
                                      <TextField
                                        fullWidth
                                        // label={star("মুনাফার হার(%)")}
                                        name="profitRate"
                                        id="number"
                                        onChange={(e) => handleChangeE(e, i)}
                                        value={engToBang(row?.profitRate)}
                                        variant="outlined"
                                        size="small"
                                      ></TextField>
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        fullWidth
                                        // label={star("মুনাফার হার(%)")}
                                        name="maturityAmount"
                                        onChange={(e) => handleChangeE(e, i)}
                                        id="number"
                                        value={engToBang(row?.maturityAmount)}
                                        variant="outlined"
                                        size="small"
                                      ></TextField>
                                    </TableCell>
                                  </TableRow>
                                ))
                                : ''}
                            </TableBody>
                          </Table>
                          <Grid container className="btn-container">
                            <Tooltip title="সংরক্ষণ করুন">
                              <Button
                                variant="contained"
                                className="btn btn-save"
                                onClick={handlePreMature}
                                startIcon={<SaveOutlinedIcon />}
                              >
                                সংরক্ষণ করুন
                              </Button>
                            </Tooltip>
                          </Grid>
                        </TableContainer>
                      </Grid>
                    </div>
                  </Dialog>
                </div>
              ) : (
                ''
              )}
              <Grid container className="btn-container">
                <Tooltip title="সংরক্ষণ করুন">
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={handleSubmit}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {' '}
                    {savings == 'C' ? 'প্রিম্যাচুর সেটআপ করুন' : 'সংরক্ষণ করুন'}
                  </Button>
                </Tooltip>
              </Grid>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default ProfitComponent;
