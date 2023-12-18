/**
 * @author Md Hasibuzzaman
 * @author Md Saifur
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/03 10:13:48
 * @modify date 2021-12-03 10:13:48
 * @desc [description]
 */
import AddIcons from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { formValidator } from 'service/formValidator';
import { bangToEng, engToBang } from 'service/numberConverter';
import { steperFun } from 'service/steper';
import {
  BugetYear,
  GlacList,
  SamityGlTrans,
  imcomeExpBudgetData,
  imcomeExpData,
} from '../../../../../url/coop/ApiList';

const BudgetClone = () => {
  const router = useRouter();
  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
  };
  const config = localStorageData('config');

  const getId = localStorageData('getSamityId');
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [incPutData, setIncPutData] = useState([]);
  const [expPutData, setExpPutData] = useState([]);
  const [fincomeDataRow, setFincomeDataRow] = useState([]);
  const [fexpenseDataRow, setFexpenseDataRow] = useState([]);
  const [pincomeInfo, setPIncomeInfo] = useState([]);
  const [pexpenseInfo, setPExpenseInfo] = useState([]);
  const [fincomeInfo, setFIncomeInfo] = useState([]);
  const [fexpenseInfo, setFExpenseInfo] = useState([]);
  const [budgetYear, setBudgetYear] = useState(null);
  // const [budgetYearError, setBudgetYearError] = useState(false);
  // const [fbudgetYearError, setFBudgetYearError] = useState(false);
  const [budgetFYear, setBudgetFYear] = useState(null);
  const [budgetArray, setBudgetArray] = useState([]);
  const [bugdetCheck, setBugdetCheck] = useState(false);
  const [deleteReload, setDeleteReload] = useState(false);
  const [incomeList, setIncomeList] = useState([{ SLNo: '', id: '', details: '', amount: 0, error: false }]);
  const [expenseList, setExpenseList] = useState([{ SLNo: '', id: '', details: '', amount: 0, error: false }]);
  const [fincomeList, setFIncomeList] = useState([{ SLNo: '', id: '', details: '', amount: 0, error: false }]);
  const [fexpenseList, setFExpenseList] = useState([{ SLNo: '', id: '', details: '', amount: 0, error: false }]);
  const [totalAmountCalculation, setTotalAmountCalculation] = useState({
    pIncome: 0,
    pExpense: 0,
    fIncome: 0,
    fExpense: 0,
  });
  const [onOffButton, setOnOffButton] = useState([]);
  const [incomeExpenseBalance, setIncomeExpenseBalance] = useState(0);

  useEffect(() => {
    checkPageValidation();
    getBudgetYearInfo();
    getPIncome();
    getPExpense();
    getFIncome();
    getFExpense();
    incomeExpenseData();
    presentYear();
    futureYear();
    incomeExpensePreviousData();
  }, [deleteReload]);
  const presentYear = () => {
    const presentearn = incPutData != undefined ? incPutData.financialYear : '';
    return presentearn;
  };
  const futureYear = () => {
    const nextyearn = fincomeDataRow != undefined ? fincomeDataRow.financialYear : '';
    return nextyearn;
  };
  let getBudgetYearInfo = async () => {
    try {
      const budgetInfoResp = await axios.get(BugetYear, config);
      setBudgetArray(budgetInfoResp.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  // handle click event of the Remove button
  const handleRemoveClickIncome = async (index) => {
    const list = [...incomeList];
    if (list[index].id != '') {
      // without notification
      await axios.delete(SamityGlTrans + '/' + list[index].id);
      setDeleteReload(true);
      setDeleteReload(false);
    } else {
      list.splice(index, 1);
      setIncomeList(list);
    }
  };
  // handle click event of the Add button
  const handleAddClickIncome = () => {
    setIncomeList([...incomeList, { SLNo: '', id: '', details: '', amount: 0, error: false }]);
  };
  const AmountCalculation = (Amount) => {
    return Amount.map((datum) =>
      parseFloat(bangToEng('' + datum.amount + '') ? bangToEng('' + datum.amount + '') : 0),
    ).reduce((a, b) => a + b);
  };
  // handle input change
  const handleInputChangeIncome = (e, index) => {
    const { name, value } = e.target;
    let list = [...incomeList];
    let resultAmount;
    switch (name) {
      case 'amount':
        resultAmount = formValidator('number', value);
        if (resultAmount?.status) {
          return;
        }
        list[index][name] = resultAmount?.value; //value;
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setIncomeList(list);
        setTotalAmountCalculation({
          ...totalAmountCalculation,
          pIncome: isNaN(AmountCalculation(list)) ? 0 : AmountCalculation(list),
        });
        break;
      default: //value;
        list[index][name] = parseFloat(value.replace(/\+|-/gi, ''));
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setIncomeList(list);
        break;
    }
  };
  // handle input change
  const handleInputChangeExpense = (e, index) => {
    const { name, value } = e.target;
    let list = [...expenseList];
    let resultAmount;
    switch (name) {
      case 'amount':
        resultAmount = formValidator('number', value);
        if (resultAmount?.status) {
          return;
        }
        list[index][name] = resultAmount?.value; // value;
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setExpenseList(list);
        setTotalAmountCalculation({
          ...totalAmountCalculation,
          pExpense: isNaN(AmountCalculation(list)) ? 0 : AmountCalculation(list),
        });
        break;
      default: // value;
        list[index][name] = value;
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setExpenseList(list);
        break;
    }
  };
  // handle click event of the Remove button
  const handleRemoveClickExpense = async (index) => {
    let list = [...expenseList];
    if (list[index].id != '') {
      // without notification
      await axios.delete(SamityGlTrans + '/' + list[index].id);
      setDeleteReload(true);
      setDeleteReload(false);
    } else {
      list.splice(index, 1);
      setExpenseList(list);
    }
  };
  // handle click event of the Add button
  const handleAddClickExpense = () => {
    setExpenseList([...expenseList, { SLNo: '', id: '', details: '', amount: 0, error: false }]);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'budgetYear':
        if (value == 0) {
          // setBudgetYearError(true);
          setBudgetYear(value);
        } else {
          // setBudgetYearError(false);
          setBudgetYear(value);
          budgetYearPCheck(value);
        }
        break;
      case 'budgetFYear':
        if (value == 0) {
          // setFBudgetYearError(true);
          setBudgetFYear(e.target.value);
        } else {
          // setFBudgetYearError(false);
          setBudgetFYear(e.target.value);
          budgetYearCheck(e.target.value);
        }
        break;
    }
  };
  const budgetYearPCheck = (i) => {
    if (budgetYear != undefined && budgetFYear === i && i != undefined) {
      return setBugdetCheck(true);
    }
    if (budgetYear != undefined && budgetYear != i && i != undefined) {
      return setBugdetCheck(false);
    }
  };
  const budgetYearCheck = (i) => {
    if (budgetYear != undefined && budgetYear === i && i != undefined) {
      return setBugdetCheck(true);
    }
    if (budgetYear != undefined && budgetYear != i && i != undefined) {
      return setBugdetCheck(false);
    }
  };
  // feature budget setup /////////////////////////////////////////   POST   //////////////////////////////////
  const handleInputChangeFIncome = (e, index) => {
    const { name, value } = e.target;
    const list = [...fincomeList];
    let resultAmount;
    switch (name) {
      case 'amount':
        resultAmount = formValidator('number', value);
        if (resultAmount?.status) {
          return;
        }
        list[index][name] = resultAmount?.value; //value;
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setFIncomeList(list);
        setTotalAmountCalculation({
          ...totalAmountCalculation,
          fIncome: isNaN(AmountCalculation(list)) ? 0 : AmountCalculation(list),
        });
        break;
      default: //value;
        list[index][name] = value;
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setFIncomeList(list);
        break;
    }
  };
  // handle click event of the Remove button
  const handleRemoveClickFIncome = async (index) => {
    let list = [...fincomeList];
    if (list[index].id != '') {
      // without notification
      await axios.delete(SamityGlTrans + '/' + list[index].id);
      setDeleteReload(true);
      setDeleteReload(false);
    } else {
      list.splice(index, 1);
      setFIncomeList(list);
    }
  };
  // handle click event of the Add button
  const handleAddClickFIncome = () => {
    setFIncomeList([...fincomeList, { SLNo: '', id: '', details: '', amount: 0, error: false }]);
  };
  // handle input change
  const handleInputChangeFExpense = (e, index) => {
    const { name, value } = e.target;
    const list = [...fexpenseList];
    let resultAmount;
    switch (name) {
      case 'amount':
        resultAmount = formValidator('number', value);
        if (resultAmount?.status) {
          return;
        }
        list[index][name] = resultAmount?.value; //value;
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setFExpenseList(list);
        setTotalAmountCalculation({
          ...totalAmountCalculation,
          fExpense: isNaN(AmountCalculation(list)) ? 0 : AmountCalculation(list),
        });
        break;
      default: //value;
        list[index][name] = value;
        if (value == null || value == 0 || value == undefined) {
          list[index]['error'] = true;
        } else {
          list[index]['error'] = false;
        }
        setFExpenseList(list);
        break;
    }
  };
  // handle click event of the Remove button
  const handleRemoveClickFExpense = async (index) => {
    let list = [...fexpenseList];
    if (list[index].id != '') {
      // without notification
      await axios.delete(SamityGlTrans + '/' + list[index].id);
      setDeleteReload(true);
      setDeleteReload(false);
    } else {
      list.splice(index, 1);
      setFExpenseList(list);
    }
  };
  // handle click event of the Add button
  const handleAddClickFExpense = () => {
    setFExpenseList([...fexpenseList, { SLNo: '', id: '', details: '', amount: 0, error: false }]);
  };
  // End /////////////////////////////////////////////////////////////    POST   ///////////////
  let getPIncome = async () => {
    try {
      let showData = await axios.get(GlacList + 3, config);
      let data = showData.data.data;
      setPIncomeInfo(data);
    } catch (error) {
      errorHandler(error);
    }
  };
  let getFIncome = async () => {
    try {
      let showData = await axios.get(GlacList + 3, config);
      let data = showData.data.data;
      setFIncomeInfo(data);
    } catch (error) {
      errorHandler(error);
    }
  };

  let getPExpense = async () => {
    try {
      let showData = await axios.get(GlacList + 4, config);
      let data = showData.data.data;
      setPExpenseInfo(data);
    } catch (error) {
      errorHandler(error);
    }
  };
  let getFExpense = async () => {
    try {
      let showData = await axios.get(GlacList + 4, config);
      let data = showData.data.data;
      setFExpenseInfo(data);
    } catch (error) {
      errorHandler(error);
    }
  };
  const checkMandatory = (data, type) => {
    let result = true;
    const incomeData = [...data];
    data.map((element, i) => {
      if (element.amount == 0) {
        incomeData[i]['error'] = true;
        result = false;
      } else {
        incomeData[i]['error'] = false;
      }
    });
    if (type == 'income') {
      setIncomeList(incomeData);
    }
    if (type == 'expense') {
      setExpenseList(incomeData);
    }
    if (type == 'fIncome') {
      setFIncomeList(incomeData);
    }
    if (type == 'fExpense') {
      setFExpenseList(incomeData);
    }
    return result;
  };

  const checkBudgetYear = (year) => {
    let result = false;
    if (year == null || year == 0) {
      result = false;
      // if (type == 'present') {
      //   setBudgetYearError(true);
      // }
      // if (type == 'future') {
      //   setFBudgetYearError(true);
      // }
    } else {
      result = true;
      // if (type == 'present') {
      //   setBudgetYearError(false);
      // }
      // if (type == 'future') {
      //   setFBudgetYearError(false);
      // }
    }
    return result;
  };
  //method for handling submit event
  let onSubmitData = async (e) => {
    e.preventDefault();
    // checkMandatory(incomeList, 'income')
    // checkMandatory(expenseList, 'expense')
    // checkMandatory(fincomeList, 'fIncome')
    // checkMandatory(fexpenseList, 'fExpense')
    // checkBudgetYear(budgetYear, "present")
    // checkBudgetYear(budgetFYear, "future")

    if (
      checkMandatory(incomeList, 'income') == true &&
      checkMandatory(expenseList, 'expense') == true &&
      checkMandatory(fincomeList, 'fIncome') == true &&
      checkMandatory(fexpenseList, 'fExpense') == true &&
      checkBudgetYear(budgetYear, 'present') == true &&
      checkBudgetYear(budgetFYear, 'future') == true
    ) {
      setLoadingDataSaveUpdate(true);
      let budgetResp;
      let payload = new Array();
      for (let i = 0; i < incomeList.length; i++) {
        if (incomeList[i].details != null || incomeList[i].amount != null) {
          payload.push(
            new Object({
              samityId: getId,
              orpCode: 'INC',
              glacId: incomeList[i].details,
              incAmt: bangToEng(incomeList[i].amount),
              expAmt: 0,
              financialYear: budgetYear,
              isIeBudget: 'B',
              budgetRole: 'P',
            }),
          );
        }
      }
      for (let i = 0; i < expenseList.length; i++) {
        if (expenseList[i].details != null || expenseList[i].amount != null) {
          payload.push(
            new Object({
              samityId: getId,
              orpCode: 'EXP',
              glacId: expenseList[i].details,
              incAmt: 0,
              expAmt: bangToEng(expenseList[i].amount),
              financialYear: budgetYear,
              isIeBudget: 'B',
              budgetRole: 'P',
            }),
          );
        }
      }
      for (let i = 0; i < fincomeList.length; i++) {
        if (fincomeList[i].details != null || fincomeList[i].amount != null) {
          payload.push(
            new Object({
              samityId: getId,
              glacId: fincomeList[i].details,
              expAmt: 0,
              incAmt: bangToEng(fincomeList[i].amount),
              financialYear: budgetFYear,
              isIeBudget: 'B',
              orpCode: 'INC',
              budgetRole: 'N',
            }),
          );
        }
      }
      for (let i = 0; i < fexpenseList.length; i++) {
        if (fexpenseList[i].details != null || fexpenseList[i].amount != null) {
          payload.push(
            new Object({
              samityId: getId,
              glacId: fexpenseList[i].details,
              expAmt: bangToEng(fexpenseList[i].amount),
              incAmt: 0,
              financialYear: budgetFYear,
              isIeBudget: 'B',
              orpCode: 'EXP',
              budgetRole: 'N',
            }),
          );
        }
      }

      try {
        budgetResp = await axios.post(SamityGlTrans + '/budget', payload, config);
        NotificationManager.success(budgetResp.data.message, '', 5000);
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        steperFun(5);
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        setLoadingDataSaveUpdate(false);
        router.push({ pathname: '/coop/samity-management/coop/required-doc' });
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      if (
        checkMandatory(incomeList, 'income') == false ||
        checkMandatory(expenseList, 'expense') == false ||
        checkMandatory(fincomeList, 'fIncome') == false ||
        checkMandatory(fexpenseList, 'fExpense') == false
      ) {
        NotificationManager.warning('আয়/ব্যয় বাধ্যতামূলক তথ্য নির্বাচন/পূরণ করুন', '', 5000);
      } else if (checkBudgetYear(budgetYear, 'present') == false) {
        NotificationManager.warning('বর্তমান বাজেট বছর নির্বাচন করুন', '', 5000);
      } else if (checkBudgetYear(budgetFYear, 'future') == false) {
        NotificationManager.warning('পরবর্তী বাজেট বছর নির্বাচন করুন', '', 5000);
      }
    }
  };
  // edit data part
  const incomeExpensePreviousData = async () => {
    try {
      let getData = await axios.get(imcomeExpData + getId, config);
      let Amount = getData.data.data;
      const balance =
        Amount.map((datum) => (datum.orpCode == 'INC' ? parseFloat(datum.incAmt) : 0)).reduce((a, b) => a + b) -
        Amount.map((datum) => (datum.orpCode == 'EXP' ? parseFloat(datum.expAmt) : 0)).reduce((a, b) => a + b);
      setIncomeExpenseBalance(balance);
    } catch (error) {
      //
    }
  };
  let incomeExpenseData = async () => {
    try {
      let incExpData = await axios.get(imcomeExpBudgetData + getId, config);
      let incExpAllData = incExpData.data.data;
      const presentYearUniq = _.uniqBy(incExpAllData, 'budgetRole').map((m) => {
        return { budgetRole: m.budgetRole, financialYear: m.financialYear };
      });
      presentYearUniq.map((row) => {
        if (row.budgetRole == 'P') {
          setBudgetYear(row.financialYear);
        } else if (row.budgetRole == 'N') {
          setBudgetFYear(row.financialYear);
        }
      });

      // let presentYear = incExpAllData.some(el => el.username === name)
      // let futureYear

      // default value
      if (incExpAllData.length == 0) {
        const inDataSown = await axios.get(GlacList + 3 + '&isDefault=true', config);
        const expDataSown = await axios.get(GlacList + 4 + '&isDefault=true', config);
        const inDataUse = inDataSown.data.data;
        const expDataUse = expDataSown.data.data;
        // setOnOffButton(incExpAllData);
        let IncomeData = [];
        let ExpenseData = [];
        inDataUse.map((kew) => {
          IncomeData.push(
            new Object({
              slNo: '',
              id: '',
              details: kew.id,
              amount: 0,
            }),
          );
        });
        expDataUse.map((kew) => {
          ExpenseData.push(
            new Object({
              slNo: '',
              id: '',
              details: kew.id,
              amount: 0,
            }),
          );
        });
        setIncomeList(IncomeData);
        setExpenseList(ExpenseData);
        let FIncomeData = [];
        let FExpenseData = [];
        inDataUse.map((key) => {
          FIncomeData.push(
            new Object({
              slNo: '',
              id: '',
              details: key.id,
              amount: 0,
            }),
          );
        });
        expDataUse.map((key) => {
          FExpenseData.push(
            new Object({
              slNo: '',
              id: '',
              details: key.id,
              amount: 0,
            }),
          );
        });
        setFIncomeList(FIncomeData);
        setFExpenseList(FExpenseData);
      }

      // default value end
      setOnOffButton(incExpAllData);
      if (incExpAllData.length != 0) {
        // present year section
        let IncomeGetData = [];
        let ExpenseGetData = [];
        let IncsDataRow = [];
        let ExpsDataRow = [];
        incExpAllData.map((kew) => {
          if (kew.orpCode == 'INC' && kew.budgetRole == 'P') {
            IncomeGetData.push(
              new Object({
                slNo: 1,
                id: kew.id,
                details: kew.glacId,
                amount: engToBang(kew.incAmt),
              }),
            );
            IncsDataRow.push(
              new Object({
                isIeBudget: kew.isIeBudget,
                financialYear: kew.financialYear,
                samityId: kew.samityId,
                orpCode: kew.orpCode,
                tranDate: kew.tranDate,
                expAmt: kew.expAmt,
                budgetRole: kew.budgetRole,
                remarks: kew.remarks,
              }),
            );
          }
          if (kew.orpCode == 'EXP' && kew.budgetRole == 'P') {
            ExpenseGetData.push(
              new Object({
                slNo: 1,
                id: kew.id,
                details: kew.glacId,
                amount: engToBang(kew.expAmt),
              }),
            );
            ExpsDataRow.push(
              new Object({
                isIeBudget: kew.isIeBudget,
                financialYear: kew.financialYear,
                samityId: kew.samityId,
                orpCode: kew.orpCode,
                tranDate: kew.tranDate,
                incAmt: kew.incAmt,
                budgetRole: kew.budgetRole,
                remarks: kew.remarks,
              }),
            );
          }
        });
        setIncomeList(IncomeGetData);
        setExpenseList(ExpenseGetData);
        setIncPutData(IncsDataRow[0]);
        setExpPutData(ExpsDataRow[0]);
        // this section use only data update paylod ------------------ PUT --------------
        // feature year section
        let fIncomeData = [];
        let fExpenseData = [];
        let fIncDataRow = [];
        let fExpDataRow = [];
        incExpAllData.map((kew) => {
          if (kew.orpCode == 'INC' && kew.budgetRole == 'N') {
            fIncomeData.push(
              new Object({
                slNo: 1,
                id: kew.id,
                details: kew.glacId,
                amount: engToBang(kew.incAmt),
              }),
            );
            fIncDataRow.push(
              new Object({
                isIeBudget: kew.isIeBudget,
                financialYear: kew.financialYear,
                samityId: kew.samityId,
                orpCode: kew.orpCode,
                tranDate: kew.tranDate,
                expAmt: kew.expAmt,
                budgetRole: kew.budgetRole,
                remarks: kew.remarks,
              }),
            );
          }
          if (kew.orpCode == 'EXP' && kew.budgetRole == 'N') {
            fExpenseData.push(
              new Object({
                slNo: 1,
                id: kew.id,
                details: kew.glacId,
                amount: engToBang(kew.expAmt),
              }),
            );
            fExpDataRow.push(
              new Object({
                isIeBudget: kew.isIeBudget,
                financialYear: kew.financialYear,
                samityId: kew.samityId,
                orpCode: kew.orpCode,
                tranDate: kew.tranDate,
                incAmt: kew.incAmt,
                budgetRole: kew.budgetRole,
                remarks: kew.remarks,
              }),
            );
          }
        });
        setFIncomeList(fIncomeData);
        setFExpenseList(fExpenseData);
        setFincomeDataRow(fIncDataRow[0]);
        setFexpenseDataRow(fExpDataRow[0]);
        setTotalAmountCalculation({
          ...totalAmountCalculation,
          pIncome: isNaN(AmountCalculation(IncomeGetData)) ? 0 : AmountCalculation(IncomeGetData),
          pExpense: isNaN(AmountCalculation(ExpenseGetData)) ? 0 : AmountCalculation(ExpenseGetData),
          fIncome: isNaN(AmountCalculation(fIncomeData)) ? 0 : AmountCalculation(fIncomeData),
          fExpense: isNaN(AmountCalculation(fExpenseData)) ? 0 : AmountCalculation(fExpenseData),
        });
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  // update function start
  let onSubmitUpdateData = async (e) => {
    e.preventDefault();
    if (
      checkMandatory(incomeList, 'income') == true &&
      checkMandatory(expenseList, 'expense') == true &&
      checkMandatory(fincomeList, 'fIncome') == true &&
      checkMandatory(fexpenseList, 'fExpense') == true &&
      checkBudgetYear(budgetYear, 'present') == true &&
      checkBudgetYear(budgetFYear, 'future') == true
    ) {
      setLoadingDataSaveUpdate(true);
      let updatePayload = new Array();
      let payloadNewInsert = new Array();
      for (let i = 0; i < incomeList.length; i++) {
        if (incomeList[i].details != null || incomeList[i].amount != null) {
          // income present
          if (incomeList[i].id) {
            updatePayload.push(
              new Object({
                id: incomeList[i].id,
                isIeBudget: incPutData.isIeBudget,
                financialYear: budgetYear ? budgetYear : incPutData.financialYear,
                samityId: getId,
                glacId: parseFloat(incomeList[i].details),
                orpCode: 'INC',
                incAmt: bangToEng(incomeList[i].amount),
                expAmt: 0,
                budgetRole: incPutData.budgetRole,
                remarks: null,
              }),
            );
          }
          if (incomeList[i].id == '') {
            payloadNewInsert.push(
              new Object({
                samityId: getId,
                orpCode: 'INC',
                glacId: parseFloat(incomeList[i].details),
                incAmt: bangToEng(incomeList[i].amount),
                expAmt: 0,
                financialYear: budgetYear ? budgetYear : incPutData.financialYear,
                isIeBudget: 'B',
                budgetRole: 'P',
              }),
            );
          }
        }
      }
      // expense present
      for (let i = 0; i < expenseList.length; i++) {
        if (expenseList[i].details != null || expenseList[i].amount != null) {
          if (expenseList[i].id) {
            updatePayload.push(
              new Object({
                id: expenseList[i].id,
                isIeBudget: expPutData.isIeBudget,
                financialYear: budgetYear ? budgetYear : incPutData.financialYear,
                samityId: getId,
                glacId: parseFloat(expenseList[i].details),
                orpCode: 'EXP',
                incAmt: 0,
                expAmt: bangToEng(expenseList[i].amount),
                budgetRole: 'P',
                remarks: null,
              }),
            );
          }
          if (expenseList[i].id == '') {
            payloadNewInsert.push(
              new Object({
                samityId: getId,
                orpCode: 'EXP',
                glacId: parseFloat(expenseList[i].details),
                incAmt: 0,
                expAmt: bangToEng(expenseList[i].amount),
                financialYear: budgetYear ? budgetYear : incPutData.financialYear,
                isIeBudget: 'B',
                budgetRole: 'P',
              }),
            );
          }
        }
      }
      // future year
      for (let i = 0; i < fincomeList.length; i++) {
        if (fincomeList[i].details != null || fincomeList[i].amount != null) {
          if (fincomeList[i].id) {
            updatePayload.push(
              new Object({
                id: fincomeList[i].id,
                isIeBudget: fincomeDataRow.isIeBudget,
                financialYear: budgetFYear ? budgetFYear : fincomeDataRow.financialYear,
                samityId: getId,
                glacId: parseFloat(fincomeList[i].details),
                orpCode: 'INC',
                incAmt: bangToEng(fincomeList[i].amount),
                expAmt: 0,
                budgetRole: fincomeDataRow.budgetRole,
                remarks: null,
              }),
            );
          }
          if (fincomeList[i].id == '') {
            payloadNewInsert.push(
              new Object({
                samityId: getId,
                orpCode: 'INC',
                glacId: parseFloat(fincomeList[i].details),
                incAmt: bangToEng(fincomeList[i].amount),
                expAmt: 0,
                financialYear: budgetFYear ? budgetFYear : fincomeDataRow.financialYear,
                isIeBudget: 'B',
                budgetRole: 'N',
              }),
            );
          }
        }
      }
      // expense feature
      for (let i = 0; i < fexpenseList.length; i++) {
        if (fexpenseList[i].details != null || fexpenseList[i].amount != null) {
          if (fexpenseList[i].id) {
            updatePayload.push(
              new Object({
                id: fexpenseList[i].id,
                isIeBudget: fexpenseDataRow.isIeBudget,
                financialYear: budgetFYear ? budgetFYear : fincomeDataRow.financialYear,
                samityId: getId,
                glacId: parseFloat(fexpenseList[i].details),
                orpCode: 'EXP',
                incAmt: 0,
                expAmt: bangToEng(fexpenseList[i].amount),
                budgetRole: fexpenseDataRow.budgetRole,
                remarks: null,
              }),
            );
          }
          if (fexpenseList[i].id == '') {
            payloadNewInsert.push(
              new Object({
                samityId: getId,
                orpCode: 'EXP',
                glacId: parseFloat(fexpenseList[i].details),
                incAmt: 0,
                expAmt: bangToEng(fexpenseList[i].amount),
                financialYear: budgetFYear ? budgetFYear : fincomeDataRow.financialYear,
                isIeBudget: 'B',
                budgetRole: 'N',
              }),
            );
          }
        }
      }
      try {
        if (payloadNewInsert.length != 0) {
          await axios.post(SamityGlTrans + '/budget', payloadNewInsert, config);
        }
        // update
        let IncomeExpUpdate = await axios.put(SamityGlTrans, updatePayload, config);
        NotificationManager.success(IncomeExpUpdate.data.message, '', 5000);
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        steperFun(5);
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        setDeleteReload(true);
        setDeleteReload(false);
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      if (
        checkMandatory(incomeList, 'income') == false ||
        checkMandatory(expenseList, 'expense') == false ||
        checkMandatory(fincomeList, 'fIncome') == false ||
        checkMandatory(fexpenseList, 'fExpense') == false
      ) {
        NotificationManager.warning('আয়/ব্যয় বাধ্যতামূলক তথ্য নির্বাচন/পূরণ করুন', '', 5000);
      } else if (checkBudgetYear(budgetYear, 'present') == false) {
        NotificationManager.warning('বর্তমান বাজেট বছর নির্বাচন করুন', '', 5000);
      } else if (checkBudgetYear(budgetFYear, 'future') == false) {
        NotificationManager.warning('পরবর্তী বাজেট বছর নির্বাচন করুন', '', 5000);
      }
    }
  };

  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/income-expense' });
  };
  const onNextPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/required-doc' });
  };
  return (
    <>
      <Grid item xs={12}>
        <Grid container sx={{ alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '16px',
              fontWeight: 'bold',
              marginRight: '1rem',
            }}
          >
            বর্তমান বছরের সমিতির বাজেট
          </span>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              name="budgetYear"
              required
              select
              SelectProps={{ native: true }}
              value={budgetYear ? budgetYear : 0}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
              error={bugdetCheck}
              helperText={bugdetCheck ? 'আপনি একই বাজেট বছর সিলেক্ট করেছেন' : ''}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {budgetArray.map((option, i) => (
                <option key={i} value={option.financialYear} selected={option.financialYear == presentYear()}>
                  {engToBang(option.financialYear)}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={1.8}>
          <Grid item md={6} xs={12}>
            <span
              style={{
                fontSize: '16px',
                textDecoration: 'underline',
                fontWeight: 'bold',
                display: 'inline-block',
                padding: '5px 0',
              }}
            >
              আয়
            </span>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" className="table-input">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center" className="minWidth">
                      ক্রমিক
                    </TableCell>
                    <TableCell>লেজার / হিসাবের নাম</TableCell>
                    <TableCell align="right">টাকা</TableCell>
                    <TableCell align="center" className="minWidth">
                      <Button className="table-icon success" onClick={handleAddClickIncome} size="small">
                        <AddIcons sx={{ display: 'block' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomeList.map((x, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell align="center">{engToBang('' + (i + 1) + '')}</TableCell>
                        <TableCell sx={{ display: 'none' }}>
                          <TextField
                            name="id"
                            type="text"
                            value={x.id}
                            onChange={(e) => handleInputChangeIncome(e, i)}
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            name="details"
                            required
                            select
                            SelectProps={{ native: true }}
                            value={x.details}
                            onChange={(e) => handleInputChangeIncome(e, i)}
                            variant="outlined"
                            size="small"
                          >
                            <option>- নির্বাচন করুন -</option>
                            {pincomeInfo.map((option, i) => (
                              <option key={i} value={option.id}>
                                {option.glacName}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell className="amount-input">
                          <TextField
                            id="numberWithPercent"
                            name="amount"
                            required
                            type="text"
                            value={x.amount == 0 ? null : x.amount}
                            inputProps={{ style: { textAlign: 'right' } }}
                            onChange={(e) => handleInputChangeIncome(e, i)}
                            variant="outlined"
                            size="small"
                            error={x.error}
                          ></TextField>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            disabled={incomeList.length > 1 ? false : true}
                            className="table-icon delete"
                            onClick={() => handleRemoveClickIncome(i)}
                          >
                            <HorizontalRuleIcon sx={{ display: 'block' }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      মোট &nbsp;
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                      <TextField
                        fullWidth
                        name="income"
                        type="text"
                        inputProps={{
                          style: {
                            textAlign: 'right',
                            fontSize: '15px',
                            fontWeight: 'bold',
                          },
                          readOnly: true,
                        }}
                        value={engToBang(totalAmountCalculation.pIncome.toFixed(2))}
                        variant="outlined"
                        size="small"
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        textAlign: 'right',
                      }}
                    >
                      আগত তহবিল
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: '15px' }}>
                      <TextField
                        fullWidth
                        type="text"
                        inputProps={{ style: { textAlign: 'right', fontSize: "15px", fontWeight: "bold", textAlign: 'right' }, readOnly: true }}
                        value={engToBang((incomeExpenseBalance).toFixed(2))}
                        variant="outlined"
                        size="small"
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        textAlign: 'right',
                      }}
                    >
                      সর্বমোট &nbsp;
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: '15px' }}>
                      <TextField
                        fullWidth
                        type="text"
                        inputProps={{ style: { textAlign: 'right', fontSize: "15px", fontWeight: "bold", textAlign: 'right' }, readOnly: true }}
                        value={engToBang((totalAmountCalculation.pIncome + incomeExpenseBalance).toFixed(2))}
                        variant="outlined"
                        size="small"
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6} xs={12}>
            <span
              style={{
                fontSize: '16px',
                textDecoration: 'underline',
                fontWeight: 'bold',
                display: 'inline-block',
                padding: '5px 0',
              }}
            >
              ব্যয়
            </span>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" className="table-input">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center" className="minWidth">
                      ক্রমিক
                    </TableCell>
                    <TableCell>লেজার / হিসাবের নাম</TableCell>
                    <TableCell className="amount-input" align="right">
                      টাকা
                    </TableCell>
                    <TableCell align="center" className="minWidth">
                      <Button className="table-icon success" onClick={handleAddClickExpense} size="small">
                        <AddIcons sx={{ display: 'block' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {expenseList.map((x, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell align="center">{engToBang('' + (i + 1) + '')}</TableCell>
                        <TableCell sx={{ display: 'none' }}>
                          <TextField
                            name="id"
                            type="text"
                            value={x.id}
                            onChange={(e) => handleInputChangeExpense(e, i)}
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            name="details"
                            required
                            select
                            SelectProps={{ native: true }}
                            value={x.details}
                            onChange={(e) => handleInputChangeExpense(e, i)}
                            variant="outlined"
                            size="small"
                          >
                            <option>- নির্বাচন করুন -</option>
                            {pexpenseInfo.map((option, i) => (
                              <option key={i} value={option.id}>
                                {option.glacName}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            name="amount"
                            required
                            type="text"
                            value={x.amount == 0 ? null : x.amount}
                            inputProps={{ style: { textAlign: 'right' } }}
                            onChange={(e) => handleInputChangeExpense(e, i)}
                            variant="outlined"
                            size="small"
                            error={x.error}
                          ></TextField>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            disabled={expenseList.length > 1 ? false : true}
                            className="table-icon delete"
                            onClick={() => handleRemoveClickExpense(i)}
                          >
                            <HorizontalRuleIcon sx={{ display: 'block' }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      মোট &nbsp;
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      <TextField
                        fullWidth
                        type="text"
                        inputProps={{
                          style: {
                            textAlign: 'right',
                            fontSize: '15px',
                            fontWeight: 'bold',
                          },
                          readOnly: true,
                        }}
                        value={engToBang(totalAmountCalculation.pExpense.toFixed(2))}
                        variant="outlined"
                        size="small"
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} py={3}>
        <Grid container sx={{ alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '16px',
              fontWeight: 'bold',
              marginRight: '1rem',
            }}
          >
            পরবর্তী বছরের সমিতির বাজেট
          </span>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              name="budgetFYear"
              required
              select
              SelectProps={{ native: true }}
              value={budgetFYear ? budgetFYear : 0}
              onChange={handleChange}
              variant="outlined"
              size="small"
              error={bugdetCheck}
              helperText={bugdetCheck ? 'আপনি একই বাজেট বছর সিলেক্ট করেছেন' : ''}
              sx={{ background: '#FFF' }}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {budgetArray.map((option, i) => (
                <option key={i} value={option.financialYear}>
                  {engToBang(option.financialYear)}
                </option>
              ))}
            </TextField>
            {/* {bugdetCheck == true ? (
               <span style={{ color: "red" }}>
                 {" "}
               </span>
             ) : (
               ""
             )} */}
          </Grid>
        </Grid>
        <Grid container spacing={1.8}>
          <Grid item md={6} xs={12}>
            <span
              style={{
                fontSize: '16px',
                textDecoration: 'underline',
                fontWeight: 'bold',
                display: 'inline-block',
                padding: '5px 0',
              }}
            >
              আয়
            </span>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" className="table-input">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center" className="minWidth">
                      ক্রমিক
                    </TableCell>
                    <TableCell>লেজার / হিসাবের নাম</TableCell>
                    <TableCell align="right" className="amount-input">
                      টাকা
                    </TableCell>
                    <TableCell align="center" className="minWidth">
                      <Button className="table-icon success" onClick={handleAddClickFIncome} size="small">
                        <AddIcons sx={{ display: 'block' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fincomeList.map((x, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell align="center">{engToBang('' + (i + 1) + '')}</TableCell>
                        <TableCell sx={{ display: 'none' }}>
                          <TextField
                            name="id"
                            type="text"
                            value={x.id}
                            onChange={(e) => handleInputChangeFIncome(e, i)}
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            name="details"
                            required
                            select
                            SelectProps={{ native: true }}
                            value={x.details}
                            onChange={(e) => handleInputChangeFIncome(e, i)}
                            variant="outlined"
                            size="small"
                          >
                            <option>- নির্বাচন করুন -</option>
                            {fincomeInfo.map((option, i) => (
                              <option key={i} value={option.id}>
                                {option.glacName}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            fullWidth
                            name="amount"
                            required
                            type="text"
                            value={x.amount == 0 ? null : x.amount}
                            inputProps={{ style: { textAlign: 'right' } }}
                            onChange={(e) => handleInputChangeFIncome(e, i)}
                            variant="outlined"
                            size="small"
                            error={x.error}
                          ></TextField>
                        </TableCell>
                        <TableCell align="center">
                          {fincomeList.length !== 1 && (
                            <Button className="table-icon delete" onClick={() => handleRemoveClickFIncome(i)}>
                              <HorizontalRuleIcon sx={{ display: 'block' }} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      মোট &nbsp;
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      <TextField
                        fullWidth
                        type="text"
                        inputProps={{
                          style: {
                            textAlign: 'right',
                            fontSize: '15px',
                            fontWeight: 'bold',
                          },
                          readOnly: true,
                        }}
                        value={engToBang(totalAmountCalculation.fIncome.toFixed(2))}
                        variant="outlined"
                        size="small"
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6} xs={12}>
            <span
              style={{
                fontSize: '16px',
                textDecoration: 'underline',
                fontWeight: 'bold',
                display: 'inline-block',
                padding: '5px 0',
              }}
            >
              ব্যয়
            </span>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" className="table-input">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center" className="minWidth">
                      ক্রমিক
                    </TableCell>
                    <TableCell>লেজার / হিসাবের নাম</TableCell>
                    <TableCell align="right" className="amount-input">
                      টাকা
                    </TableCell>
                    <TableCell align="center" className="minWidth">
                      <Button className="table-icon success" onClick={handleAddClickFExpense} size="small">
                        <AddIcons sx={{ display: 'block' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fexpenseList.map((x, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell align="center">{engToBang('' + (i + 1) + '')}</TableCell>
                        <TableCell sx={{ display: 'none' }}>
                          <TextField
                            name="id"
                            type="text"
                            value={x.id}
                            onChange={(e) => handleInputChangeFExpense(e, i)}
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            name="details"
                            required
                            select
                            SelectProps={{ native: true }}
                            value={x.details}
                            onChange={(e) => handleInputChangeFExpense(e, i)}
                            variant="outlined"
                            size="small"
                          >
                            <option>- নির্বাচন করুন -</option>
                            {fexpenseInfo.map((option, i) => (
                              <option key={i} value={option.id}>
                                {option.glacName}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            fullWidth
                            name="amount"
                            required
                            type="text"
                            value={x.amount == 0 ? null : x.amount}
                            inputProps={{ style: { textAlign: 'right' } }}
                            onChange={(e) => handleInputChangeFExpense(e, i)}
                            variant="outlined"
                            size="small"
                            error={x.error}
                          ></TextField>
                        </TableCell>
                        <TableCell align="center">
                          {fexpenseList.length !== 1 && (
                            <Button className="table-icon delete" onClick={() => handleRemoveClickFExpense(i)}>
                              <HorizontalRuleIcon sx={{ display: 'block' }} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      মোট &nbsp;
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      <TextField
                        fullWidth
                        type="text"
                        inputProps={{
                          style: {
                            textAlign: 'right',
                            fontSize: '15px',
                            fontWeight: 'bold',
                          },
                          readOnly: true,
                        }}
                        value={engToBang(totalAmountCalculation.fExpense.toFixed(2))}
                        variant="outlined"
                        size="small"
                        error={
                          totalAmountCalculation.fIncome +
                            (totalAmountCalculation.pIncome + incomeExpenseBalance) -
                            totalAmountCalculation.pExpense <
                          totalAmountCalculation.fExpense
                            ? true
                            : false
                        }
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            {' '}
            আগের পাতায়
          </Button>
        </Tooltip>
        {onOffButton != 0 ? (
          <>
            <Tooltip title="update">
              {loadingDataSaveUpdate ? (
                <LoadingButton loading startIcon={<SaveOutlinedIcon />} variant="outlined">
                  হালনাগাদ করা হচ্ছে...
                </LoadingButton>
              ) : (
                <Button
                  className="btn btn-save"
                  onClick={(event) => onSubmitUpdateData(event)}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  হালনাগাদ করুন
                </Button>
              )}
            </Tooltip>
            <Tooltip title="পরবর্তী পাতা">
              <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
                পরবর্তী পাতায়{' '}
              </Button>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="সংরক্ষন করুন">
            {loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                loadingPosition="start"
                sx={{ mr: 1 }}
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
              >
                সংরক্ষন করা হচ্ছে...
              </LoadingButton>
            ) : (
              <Button
                className="btn btn-save"
                onClick={(event) => onSubmitData(event)}
                startIcon={<SaveOutlinedIcon />}
              >
                {' '}
                সংরক্ষন করুন
              </Button>
            )}
          </Tooltip>
        )}
      </Grid>
    </>
  );
};

export default BudgetClone;
