
/* eslint-disable react/jsx-no-undef */

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import star from 'components/utils/coop/star';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSavingsProduct } from 'redux/feature/savingsProduct/savingsProductSlice';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import * as yup from 'yup';
import { loanProject } from '../../../../../url/ApiList';
import DPSComponent from './DPSComponent';
import FDRComponent from './FDRComponent';
import SavingsComponent from './SavingsComponent';
const defaulterActionArray = [
  {
    value: 'C',
    label: 'ক্লোজ',
  },
  {
    value: 'W',
    label: 'সতর্ক করা',
  },
];

const maturityProcessArray = [
  {
    value: 'F',
    label: 'নির্দিষ্ট পরিমাণ',
  },
  {
    value: 'P',
    label: 'মুনাফা হার',
  },
];
const savingsTypeArray = [
  {
    value: 'R',
    label: 'সাধারণ সঞ্চয়',
  },
  {
    value: 'C',
    label: 'আবর্তক সঞ্চয়(ডি.পি.এস)',
  },
  {
    value: 'F',
    label: 'মেয়াদী সঞ্চয়(এফ.ডি.আর)',
  },
];
const profitPostingPeriodArray = [
  {
    value: 'H',
    label: 'অর্ধ বার্ষিক',
  },
  {
    value: 'Y',
    label: 'বার্ষিক',
  },
  {
    value: 'M',
    label: 'ম্যাচুরিটি',
  },
];

const ProductInfo = ({ handlePage, setSavings }) => {
  const dispatch = useDispatch();
  const { specificProductInfo, appId } = useSelector((state) => state.savingsProduct);

  const config = localStorageData('config');


  const [projectsList, setProjectsList] = useState([]);
  // const [glAssetList, setGlAssetList] = useState([]);
  // const [glIncomeList, setGlIncomeList] = useState([]);

  useEffect(() => {
    getProject();
    // getProjectInfo()
    // getGlAssetList();
    // getGlIncomeList();
  }, []);
  let getProject = async () => {
    try {
      const response = await axios.get(`${loanProject}`, config);
      setProjectsList(response.data.data || []);
    } catch (err) {
      errorHandler(err);
    }
  };

  // const getGlAssetList = async () => {
  //   let getAssetList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=A', 'get');
  //   setGlAssetList(getAssetList?.data?.data ? getAssetList?.data?.data : []);
  // };

  // const getGlIncomeList = async () => {
  //   let getIncomeList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
  //   setGlIncomeList(getIncomeList?.data?.data ? getIncomeList?.data?.data : []);
  // };

  const validationSchema = yup.object({
    productName: yup
      .string()
      .max(30, 'প্রোডাক্টের নাম ৩০ অক্ষরের চেয়ে বড় হতে পারবে না')
      .required('প্রোডাক্টের নাম দেওয়া আবশ্যক'),
    productCode: yup
      .string()
      .max(3, 'প্রোডাক্টের কোড ৩ অক্ষরের চেয়ে বড় হতে পারবে না')
      .required('প্রোডাক্টের কোড দেওয়া আবশ্যক'),
    productDescription: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'R') {
        return schema.required('প্রোডাক্টের বিবরণ দেওয়া আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),

    repaymentFrequency: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'R' || savingsType == 'C') {
        return schema.required('কিস্তির ফ্রিকোয়েন্সি নির্বাচন আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),
    // .required("কিস্তির ফ্রিকোয়েন্সি নির্বাচন আবশ্যক"),
    projectId: yup.string().required('প্রকল্প/কর্মসূচী নির্বাচন আবশ্যক'),
    realizableSavings: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'R') {
        return schema.required('আদায়যোগ্য সঞ্চয় দেওয়া আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),
    profitPostingPeriod: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C') {
        return schema.required('মুনাফা পোস্টিং পিরিয়ড নির্বাচন আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),
    installmentStartingDate: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C') {
        return schema
          .required('কিস্তির শুরুর দিন দেওয়া আবশ্যক')
          .test('installmentStartingDate-range', 'কিস্তির শুরুর দিন ৩০ চেয়ে বড় হতে পারবে না', function (value) {
            if (parseInt(value) <= 31) {
              return true;
            }
            return false;
          })
          .test(
            'installmentStartingDate-validation',
            'কিস্তির শুরুর দিন কিস্তির শেষের দিন অপেক্ষা বড় হতে পারবে না',
            function (value) {
              const installmentClosingDate = this.parent.installmentClosingDate;
              return parseInt(value) <= parseInt(installmentClosingDate);
            },
          );
      } else {
        return schema.notRequired();
      }
    }),
    installmentClosingDate: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C') {
        return schema
          .required('কিস্তির শেষের দিন দেওয়া আবশ্যক')
          .test('installmentClosingDate-range', 'কিস্তির শেষের দিন ৩০ চেয়ে বড় হতে পারবে না', function (value) {
            if (parseInt(value) <= 31) {
              return true;
            }
            return false;
          })
          .test(
            'installmentClosingDate-validation',
            'কিস্তির শেষের দিন কিস্তির শুরুর দিন অপেক্ষা ছোট হতে পারবে না',
            function (value) {
              const installmentStartingDate = this.parent.installmentStartingDate;
              return parseInt(value) >= parseInt(installmentStartingDate);
            },
          );
      } else {
        return schema.notRequired();
      }
    }),
    lowestInsAmount: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C' || savingsType == 'F') {
        return schema
          .required('সর্বনিম্ন কিস্তির পরিমাণ দেওয়া আবশ্যক')
          .test(
            'lowestInsAmount-validation',
            'সর্বনিম্ন কিস্তির পরিমাণ সর্বোচ্চ কিস্তির পরিমাণ অপেক্ষা বড় হতে পারবে না',
            function (value) {
              const highestInsAmount = this.parent.highestInsAmount;
              return parseInt(value) <= parseInt(highestInsAmount);
            },
          );
      } else {
        return schema.notRequired();
      }
    }),
    highestInsAmount: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C' || savingsType == 'F') {
        return schema
          .required('সর্বোচ্চ কিস্তির পরিমাণ দেওয়া আবশ্যক')
          .test(
            'highestInsAmount-validation',
            'সর্বোচ্চ কিস্তির পরিমাণ সর্বনিম্ন কিস্তির পরিমাণ অপেক্ষা ছোট হতে পারবে না',
            function (value) {
              const lowestInsAmount = this.parent.lowestInsAmount;
              return parseInt(value) >= parseInt(lowestInsAmount);
            },
          );
      } else {
        return schema.notRequired();
      }
    }),
    installmentRateMultiplier: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C' || savingsType == 'F') {
        return schema.required('কিস্তির হারের গুণিতক দেওয়া আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),
    maturityProcess: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C') {
        return schema.required('ম্যাচুরিটি প্রক্রিয়া নির্বাচন আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),
    maxLimitAfterMaturity: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C') {
        return schema.required('মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন) দেওয়া আবশ্যক');
        // .test(
        //   'maxLimitAfterMaturity-validation',
        //   'মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা ১০,০০০ এর চেয়ে বেশি হতে পারবে না',
        //   function (value) {
        //     return parseInt(value) <= 10000;
        //   }
        // )
      } else {
        return schema.notRequired();
      }
    }),
    maxNumberOfDefaultInstallments: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C') {
        return schema.required('সর্বোচ্চ ডিফল্ট কিস্তির সংখ্যা দেওয়া আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),
    defaulterAction: yup.string().when('savingsType', (savingsType, schema) => {
      if (savingsType == 'C') {
        return schema.required('ডিফল্টার অ্যাকশন নির্বাচন আবশ্যক');
      } else {
        return schema.notRequired();
      }
    }),
  });

  return (
    <>
      <Formik
        key={[appId, projectsList.length]}
        initialValues={{
          projectId: specificProductInfo?.productMaster?.projectId || '',
          productCode: specificProductInfo?.productMaster?.productCode || '',
          productDescription: specificProductInfo?.productMaster?.productDescription || '',
          repaymentFrequency: specificProductInfo?.productMaster?.repaymentFrequency || '',
          realizableSavings: specificProductInfo?.productMaster?.realizableSavings || '',
          productName: specificProductInfo?.productMaster?.productName || '',
          projectsList: projectsList || [],
          profitPostingPeriodArray,
          maturityProcessArray,
          savingsType: specificProductInfo?.productMaster?.savingsType,
          defaulterActionArray,
          overDueCharge: specificProductInfo?.productMaster?.fineAllow || false,
          considerationOfHolidays: specificProductInfo?.productMaster?.insHolidayConsideration || false,
          allowInstallmentsAfterMaturity: specificProductInfo?.productMaster?.afterMaturityInsMaxAllow || false,
          profitPostingPeriod: specificProductInfo?.productMaster?.profitPostingPeriod || null,
          defaulterAction: specificProductInfo?.productMaster?.defaultAction || null,
          maturityProcess: specificProductInfo?.productMaster?.maturityAmtInstruction || null,
          installmentStartingDate: specificProductInfo?.productMaster?.insStartDay || null,
          installmentClosingDate: specificProductInfo?.productMaster?.insEndDay || null,
          maxLimitAfterMaturity: specificProductInfo?.productMaster?.maturityMaxDay || '',
          maxNumberOfDefaultInstallments: specificProductInfo?.productMaster?.maxDefaultInsAllow || '',
          lowestInsAmount: specificProductInfo?.productMaster?.minInsAmt || null,
          highestInsAmount: specificProductInfo?.productMaster?.maxInsAmt || null,
          installmentRateMultiplier: specificProductInfo?.productMaster?.depMultiplyBy || '',
        }}
        validationSchema={validationSchema}
        validateOnChange={true}
        onSubmit={async (values, { resetForm }) => {
          let requestStatus = '';
          const {
            projectId,
            repaymentFrequency,
            productCode,
            productDescription,
            realizableSavings,
            productName,
            savingsType,
            profitPostingPeriod,
            maturityProcess,
            installmentRateMultiplier,
            maxLimitAfterMaturity,
            defaulterAction,
            maxNumberOfDefaultInstallments,
            considerationOfHolidays,
            allowInstallmentsAfterMaturity,
            overDueCharge,
            installmentClosingDate,
            installmentStartingDate,
            lowestInsAmount,
            highestInsAmount,
          } = values;
          let payloadObj;
          if (savingsType == 'R') {
            payloadObj = {
              projectId,
              productCode,
              productName,
              repaymentFrequency,
              productDescription,
              realizableSavings,
              savingsType,
            };
          } else if (savingsType == 'C') {
            payloadObj = {
              projectId,
              productCode,
              productName,
              repaymentFrequency,
              productDescription,
              realizableSavings,
              savingsType,
              profitPostingPeriod,
              minInsAmt: lowestInsAmount,
              maxInsAmt: highestInsAmount,
              depMultiplyBy: installmentRateMultiplier,
              maturityAmtInstruction: maturityProcess,
              maturityMaxDay: maxLimitAfterMaturity,
              defaultAction: defaulterAction,
              maxDefaultInsAllow: maxNumberOfDefaultInstallments,
              insHolidayConsideration: considerationOfHolidays,
              afterMaturityInsMaxAllow: allowInstallmentsAfterMaturity,
              fineAllow: overDueCharge,
              insStartDay: installmentStartingDate,
              insEndDay: installmentClosingDate,
            };
          } else if (savingsType == 'F') {
            payloadObj = {
              projectId,
              productCode,
              productName,
              profitPostingPeriod,
              minInsAmt: lowestInsAmount,
              maxInsAmt: highestInsAmount,
              depMultiplyBy: installmentRateMultiplier,
              maturityAmtInstruction: maturityProcess,
              savingsType,
            };
          }

          let payload = {
            projectId,
            samityId: null,
            data: {
              productMaster: {
                ...payloadObj,
              },
            },
          };
          requestStatus = await dispatch(addSavingsProduct(payload));
          if (requestStatus.meta.requestStatus != 'rejected') {
            resetForm();
            handlePage(2);
          }
        }}
      >
        {(props) => {
          const { values, handleSubmit, setFieldValue, resetForm } = props;
          const { savingsType } = values;
          const ownHandleChange = (e) => {
            const { value } = e.target;
            resetForm();
            setFieldValue('savingsType', value);
            setSavings(value);
          };

          return (
            <>
              <Grid container spacing={2} className="section">
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      {savingsType == '' ? star('সঞ্চয়ের ধরণ নির্বাচন করুন') : star('সঞ্চয়ের ধরণ')}
                    </InputLabel>
                    <Select
                      name="savingsType"
                      id="demo-simple-select"
                      value={savingsType}
                      label={savingsType == '' ? star('সঞ্চয়ের ধরণ নির্বাচন করুন') : star('সঞ্চয়ের ধরণ')}
                      onChange={ownHandleChange}
                      sx={{
                        '& .MuiSelect-select': {
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {savingsTypeArray.map((option) => (
                        <MenuItem value={option.value} key={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {savingsType == 'R' && <SavingsComponent />}
                {savingsType == 'C' && <DPSComponent />}
                {savingsType == 'F' && <FDRComponent />}
              </Grid>

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
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default ProductInfo;
