/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023/05/31 10:13:48
 * @modify date 2023/05/31 10:13:48
 * @desc [description]
 */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Grid } from '@mui/material';
import axios from 'axios';
import Loader from 'components/Loader';
import SubHeading from 'components/shared/others/SubHeading';
import { now } from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { bangToEng, engToBang } from 'service/numberConverter';
import { useImmer } from 'use-immer';
import { BugetYear, GlAcList, GlacList, auditAccountApi, auditAccountGetApi } from '../../../../url/coop/ApiList';
import DynamicLedger from './accounts/DynamicLedger';

const AuditAccountsInformation = ({ samityId, isApproval }) => {
  const config = localStorageData('config');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [getBudgetYear, setGetBudgetYear] = useState([]);
  const [selectBudgetYear, setSelectBudgetYear] = useState({
    budgetYearId: '',
    presentYear: '',
    futureYear: '',
  });
  const [applicationId, setApplicationId] = useState('');
  // default value set for use any time
  const defaultData = {
    debits: {
      samityId,
      glacId: '',
      glacIdError: false,
      returnType: '',
      tranDate: '',
      tranAmount: 0,
      tranAmountError: false,
      drcrCode: 'D',
      status: 'A',
    },
    credits: {
      samityId,
      glacId: '',
      glacIdError: false,
      returnType: '',
      tranDate: '',
      tranAmount: 0,
      tranAmountError: false,
      drcrCode: 'C',
      status: 'A',
    },
  };
  const [asset, setAsset] = useImmer([defaultData.debits]);
  const [libality, setLibality] = useImmer([defaultData.credits]);
  const [income, setIncome] = useImmer([defaultData.credits]);
  const [expense, setExpense] = useImmer([defaultData.debits]);

  // *********** get application data if found then set there state ***********
  useEffect(() => {
    getBudgetYearInfo();
    getExistingData(samityId);
    getSavingShareAmount(samityId);
  }, [samityId]);

  const getBudgetYearInfo = async () => {
    try {
      const budgetInfoResp = await axios.get(BugetYear, config);
      setGetBudgetYear(budgetInfoResp.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getDataResolver = (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].tranAmount = engToBang(data[i].tranAmount);
    }
    return data;
  };

  const getExistingData = async (samityId) => {
    setLoadData(true);
    try {
      const getAuditData = await axios.get(auditAccountGetApi + samityId, config);
      const auditAccountData = getAuditData.data.data;
      if (Object.keys(auditAccountData).length != 0) {
        setAsset(getDataResolver(auditAccountData?.data?.asset));
        setLibality(getDataResolver(auditAccountData?.data?.libality));
        setIncome(getDataResolver(auditAccountData?.data?.income));
        setExpense(getDataResolver(auditAccountData?.data?.expense));
        setApplicationId(auditAccountData?.id);
      } else {
        setAsset(await defaultSetData(1, samityId, 'D'));
        setLibality(await savingsShareSet(await defaultSetData(2, samityId, 'C'), samityId));
        setIncome(await defaultSetData(3, samityId, 'C'));
        setExpense(await defaultSetData(4, samityId, 'D'));
      }
      setLoadData(false);
    } catch (error) {
      errorHandler(error);
      setLoadData(false);
    }
  };

  const getSavingShareAmount = async (id) => {
    try {
      const getData = await axios.get(GlAcList + `/share_amount-savings_amount/${id}`, config);
      return getData.data.data;
    } catch (error) {
      errorHandler(error);
    }
  };

  const savingsShareSet = async (libalityData, id) => {
    const shareAmt = await getSavingShareAmount(id);
    libalityData?.forEach((item) => {
      if (item.glacId === 238) {
        item.tranAmount = engToBang(shareAmt?.shareAmount) || null;
      } else if (item.glacId === 240) {
        item.tranAmount = engToBang(shareAmt?.savingsAmount) || null;
      }
    });
    return libalityData;
  };

  const defaultSetData = async (type, samityId, drcrCode) => {
    setLoadData(true);
    let inDataSown;
    try {
      inDataSown = await axios.get(GlacList + type + '&isDefault=true', config);
    } catch (error) {
      setLoadData(false);
      errorHandler(error);
    }

    const newArray = inDataSown?.data?.data.map((item) => ({
      samityId,
      glacId: item.id,
      glacIdError: false,
      returnType: '',
      tranDate: '',
      tranAmount: 0,
      tranAmountError: false,
      drcrCode,
      status: 'A',
    }));
    setLoadData(false);
    return newArray;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    let year = getBudgetYear.find((row) => row.id == value)?.financialYear;
    const [presentYear, futureYear] = year?.split('-').map(Number);
    setSelectBudgetYear({ ...selectBudgetYear, [name]: parseInt(value), presentYear, futureYear });
  };

  // *********** get application data if found then set there state ***********
  // ********************* Submit region start ***************************
  const findDuplicateGlacIdsWithIndex = (transactions) => {
    const uniqueIds = new Set();
    const duplicateIndices = [];

    transactions.forEach((transaction, index) => {
      if (uniqueIds.has(transaction.glacId)) {
        duplicateIndices.push(index);
      } else {
        uniqueIds.add(transaction.glacId);
      }
    });
    return duplicateIndices;
  };
  const checkedMandatory = (data, setData, type) => {
    let mandatory = true;
    const updatedData = data.map((obj) => {
      if (obj.glacId === '') {
        NotificationManager.warning('লেজার / হিসাবের নির্বাচন করুন');
        mandatory = false;
        return {
          ...obj,
          glacIdError: true,
        };
      } else if (obj.tranAmount === 0) {
        NotificationManager.warning('টাকার পরিমান লিখুন');
        mandatory = false;
        return {
          ...obj,
          tranAmountError: true,
        };
      }
      return obj;
    });
    const checkDuplicateGlacId = findDuplicateGlacIdsWithIndex(data);
    if (checkDuplicateGlacId.length > 0) {
      checkDuplicateGlacId.map((row) => {
        NotificationManager.warning(engToBang(row + 1) + ' নং ' + type + ' একাধিকবার ব্যবহৃত হয়েছে', '', 5000);
      });
      mandatory = false;
    } else {
      mandatory = true;
    }
    setData(updatedData);
    return mandatory;
  };
  // const getBudgetYearFromDate = (dateStr) => {
  //     const date = new Date(dateStr);
  //     const year = date.getFullYear();
  //     const month = date.getMonth() + 1; // January is month 0, so we add 1
  //     const startYear = month >= 7 ? year : year - 1;
  //     const endYear = startYear + 1;
  //     return { startYear, endYear };
  // }

  const arrayResolver = (array) => {
    // const { startYear, endYear } = getBudgetYearFromDate(now());
    const newData = array?.map((obj) => {
      const { ...rest } = obj;
      return {
        ...rest,
        samityId,
        tranAmount: obj?.tranAmount && parseInt(bangToEng(obj?.tranAmount)),
        tranDate: dateFormat(now()),
        returnType: '',
        startYear: selectBudgetYear.presentYear,
        endYear: selectBudgetYear.futureYear,
      };
    });
    return newData;
  };

  const totalAmountCalculation = (arrayData) => {
    let sum = 0;
    for (let i = 0; i < arrayData.length; i++) {
      sum += arrayData[i]?.tranAmount && parseInt(bangToEng(arrayData[i]?.tranAmount));
    }
    return sum;
  };

  const finalCheck = (getAsset, getExpense, getLibality, getIncome) => {
    if (
      totalAmountCalculation(getAsset) + totalAmountCalculation(getExpense) ===
      totalAmountCalculation(getLibality) + totalAmountCalculation(getIncome)
    ) {
      return true;
    } else {
      NotificationManager.warning('চূড়ান্ত জমার ক্ষেত্রে (সম্পদ + ব্যয়) সমান (দায় + আয়) হতে হবে');
      return false;
    }
  };

  const onSubmitData = async (e) => {
    e.preventDefault();
    let audidAccounts;
    if (
      checkedMandatory(asset, setAsset, 'সম্পদ') &&
      checkedMandatory(libality, setLibality, 'দায়') &&
      checkedMandatory(expense, setExpense, 'ব্যয়') &&
      checkedMandatory(income, setIncome, 'আয়')
    ) {
      if (finalCheck(asset, expense, libality, income)) {
        const payload = {
          serviceName: 'audit_accounts',
          samityId,
          data: {
            asset: arrayResolver(asset),
            libality: arrayResolver(libality),
            income: arrayResolver(income),
            expense: arrayResolver(expense),
          },
        };

        try {
          if (applicationId) {
            audidAccounts = await axios.put(auditAccountApi + `/${applicationId}`, payload, config);
          } else {
            audidAccounts = await axios.post(auditAccountApi, payload, config);
          }
          getExistingData(samityId);
          NotificationManager.success(audidAccounts?.data?.message, '', 5000);
          setAsset([defaultData.debits]);
          setLibality([defaultData.credits]);
          setIncome([defaultData.credits]);
          setExpense([defaultData.debits]);
          setLoadingDataSaveUpdate(false);
        } catch (error) {
          setLoadingDataSaveUpdate(false);
          errorHandler(error);
        }
      }
    }
  };
  // ********************* Submit region end ***************************
  return (
    <Fragment>
      {loadData ? (
        <Loader />
      ) : (
        <Fragment>
          <Grid container>
            <Grid item sm={12} md={12} xs={12}>
              <SubHeading>
                <span>
                  হিসাবের তথ্য সংযোজন <b style={{ color: '#FF0000' }}>*</b>
                </span>
              </SubHeading>
            </Grid>
            <FromControlJSON
              arr={[
                {
                  labelName: 'বাজেট বছর নির্বাচন করুন',
                  name: 'budgetYearId',
                  onChange,
                  value: selectBudgetYear.budgetYearId,
                  size: 'small',
                  type: 'text',
                  viewType: 'select',
                  optionData: getBudgetYear,
                  optionValue: 'id',
                  optionName: 'financialYear',
                  xl: 4,
                  lg: 4,
                  md: 4,
                  xs: 12,
                  isDisabled: isApproval,
                  customClass: '',
                  customStyle: { marginLeft: '25px', display: isApproval && 'none' },
                },
              ]}
            />
            <Grid container spacing={1} pb={2} px={3}>
              <DynamicLedger
                {...{
                  listData: asset,
                  setListData: setAsset,
                  accountsName: 'সম্পদ',
                  glacType: 1,
                  returnType: '',
                  drcrCode: 'D',
                  isApproval,
                }}
              />
              <DynamicLedger
                {...{
                  listData: libality,
                  setListData: setLibality,
                  accountsName: 'দায়',
                  glacType: 2,
                  returnType: '',
                  drcrCode: 'C',
                  isApproval,
                }}
              />
              <DynamicLedger
                {...{
                  listData: expense,
                  setListData: setExpense,
                  accountsName: 'ব্যয়',
                  glacType: 4,
                  returnType: '',
                  drcrCode: 'D',
                  isApproval,
                }}
              />
              <DynamicLedger
                {...{
                  listData: income,
                  setListData: setIncome,
                  accountsName: 'আয়',
                  glacType: 3,
                  returnType: '',
                  drcrCode: 'C',
                  isApproval,
                }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid container className="btn-container" sx={{ display: isApproval && 'none' }}>
            {loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                loadingPosition="start"
                sx={{ mr: 1 }}
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
              >
                &nbsp;&nbsp;{applicationId ? 'হালনাগাদ হচ্ছে.......' : 'সংরক্ষন করা হচ্ছে...'}
              </LoadingButton>
            ) : (
              <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
                &nbsp;&nbsp;{applicationId ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
              </Button>
            )}
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuditAccountsInformation;
