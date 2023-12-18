/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/11/08 10:13:48
 * @modify date 2021-11-08 10:13:48
 * @desc [description]
 */
import AddIcons from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { formValidator } from 'service/formValidator';
import { bangToEng, engToBang } from 'service/numberConverter';
import Swal from 'sweetalert2';
import { GlacList, SamityGlTrans, imcomeExpData } from '../../../url/coop/ApiList';

const IncomeExpenseClone = () => {
  const router = useRouter();
  const checkPageValidation = () => {
    let getId;
    getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
  };
  const token = localStorageData('token');
  const config = localStorageData('config', token);
  const getId = localStorageData('getSamityId');

  const [incomeList, setIncomeList] = useState([{ slNo: '', id: '', details: '', amount: 0, error: false }]);
  const [expenseList, setExpenseList] = useState([{ slNo: '', id: '', details: '', amount: 0, error: false }]);
  const [totalAmountCalculation, setTotalAmountCalculation] = useState({
    pIncome: 0,
    pExpense: 0,
  });
  const [balance, setBalance] = useState({
    income: 0,
    expense: 0,
  });
  const [incomeInfo, setIncomeInfo] = useState([]);
  const [expenseInfo, setExpenseInfo] = useState([]);
  const [incomeDataRow, setIncomeDataRow] = useState([]);
  const [expenseDataRow, setExpenseDataRow] = useState([]);
  const [onOffButton, setOnOffButton] = useState([]);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  useEffect(() => {
    checkPageValidation();
    getIncome();
    getExpense();
    incomeExpenseData();
  }, []);

  let getIncome = async () => {
    try {
      let showData = await axios.get(GlacList + 3, config);
      let data = showData.data.data;
      setIncomeInfo(data);
    } catch (error) {
      errorHandler(error);
    }
  };
  let getExpense = async () => {
    try {
      let showData = await axios.get(GlacList + 4, config);
      let data = showData.data.data;
      setExpenseInfo(data);
    } catch (error) {
      errorHandler(error);
    }
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

  // handle click event of the Remove button
  const handleRemoveClickIncome = async (index) => {
    let list = [...incomeList];
    if (list[index].id != '') {
      // without notification
      try {
        await Swal.fire({
          title: 'আপনি কি নিশ্চিত?',
          text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ফিরে যান ।',
          confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(SamityGlTrans + '/' + list[index].id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                incomeExpenseData();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                incomeExpenseData();
              }
            });
          }
        });
        await Swal.fire({
          title: 'আপনি কি নিশ্চিত?',
          text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ফিরে যান ।',
          confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(SamityGlTrans + '/' + list[index].id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                incomeExpenseData();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                incomeExpenseData();
              }
            });
          }
        });
        incomeExpenseData();
      } catch (error) {
        errorHandler(error);
      }
      // const deleteIncome = await axios.delete(
      //   SamityGlTrans + "/" + list[index].id
      // );
      // setDeleteReload(true);
      // setDeleteReload(false);
    } else {
      list.splice(index, 1);
      setIncomeList(list);
    }
  };

  // handle click event of the Add button
  const handleAddClickIncome = () => {
    setIncomeList([...incomeList, { slNo: '', id: '', details: '', amount: 0 }]);
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
      try {
        await Swal.fire({
          title: 'আপনি কি নিশ্চিত?',
          text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'ফিরে যান ।',
          confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(SamityGlTrans + '/' + list[index].id, config).then((response) => {
              if (response.status === 200) {
                Swal.fire('বাতিল হয়েছে!', 'আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.', 'success');
                incomeExpenseData();
              } else {
                Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
                incomeExpenseData();
              }
            });
          }
        });
        incomeExpenseData();
      } catch (error) {
        errorHandler(error);
      }
      // const deleteIncome = await axios.delete(
      //   SamityGlTrans + "/" + list[index].id
      // );
      // setDeleteReload(true);
      // setDeleteReload(false);
    } else {
      list.splice(index, 1);
      setExpenseList(list);
    }
  };

  // handle click event of the Add button
  const handleAddClickExpense = () => {
    setExpenseList([...expenseList, { slNo: '', id: '', details: '', amount: 0 }]);
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
    return result;
  };
  let onSubmitData = async (e) => {
    e.preventDefault();
    if (checkMandatory(incomeList, 'income') == true && checkMandatory(expenseList, 'expense') == true) {
      setLoadingDataSaveUpdate(true);
      let payload = new Array();
      for (let i = 0; i < incomeList.length; i++) {
        if (incomeList[i].details != '' || incomeList[i].amount != '') {
          payload.push(
            new Object({
              samityId: getId,
              glacId: incomeList[i].details,
              expAmt: 0,
              financialYear: '',
              incAmt: bangToEng(incomeList[i].amount),
              isIeBudget: 'E',
              orpCode: 'INC',
            }),
          );
        }
      }
      for (let i = 0; i < expenseList.length; i++) {
        if (expenseList[i].details != '' || expenseList[i].amount != '') {
          payload.push(
            new Object({
              samityId: getId,
              glacId: expenseList[i].details,
              expAmt: bangToEng(expenseList[i].amount),
              incAmt: 0,
              financialYear: '',
              isIeBudget: 'E',
              orpCode: 'EXP',
            }),
          );
        }
      }
      try {
        const memberIncomeExpense = await axios.post(SamityGlTrans + '/expense', payload, config);
        NotificationManager.success(memberIncomeExpense.data.message, '', 5000);
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        // steperFun(6)
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        setLoadingDataSaveUpdate(false);
        router.push({ pathname: '/coop/samity-management/coop/budget' });
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      if (checkMandatory(incomeList, 'income') == false || checkMandatory(expenseList, 'expense') == false) {
        NotificationManager.warning('আয়/ব্যয় বাধ্যতামূলক তথ্য নির্বাচন/পূরণ করুন', '', 5000);
      }
    }
  };
  // edit data part
  const incomeExpenseData = async () => {
    try {
      let incExpData = await axios.get(imcomeExpData + getId, config);
      let incExpAllData = incExpData.data.data;
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
      }
      // default value end
      setOnOffButton(incExpAllData);
      if (incExpAllData.length != 0) {
        let IncomeData = [];
        let ExpenseData = [];
        incExpAllData.map((kew) => {
          if (kew.orpCode == 'INC') {
            IncomeData.push(
              new Object({
                slNo: 1,
                id: kew.id,
                details: kew.glacId,
                amount: engToBang(kew.incAmt),
              }),
            );
          }
          if (kew.orpCode == 'EXP') {
            ExpenseData.push(
              new Object({
                slNo: 1,
                id: kew.id,
                details: kew.glacId,
                amount: engToBang(kew.expAmt),
              }),
            );
          }
        });
        setIncomeList(IncomeData);
        setExpenseList(ExpenseData);
        let IncomeDataRow = [];
        let ExpenseDataRow = [];
        incExpAllData.map((kew) => {
          if (kew.orpCode == 'INC') {
            IncomeDataRow.push(
              new Object({
                id: kew.id,
                isIeBudget: kew.isIeBudget,
                financialYear: kew.financialYear,
                samityId: kew.samityId,
                glacId: kew.glacId,
                orpCode: kew.orpCode,
                tranDate: kew.tranDate,
                incAmt: kew.incAmt,
                expAmt: kew.expAmt,
                remarks: kew.remarks,
              }),
            );
          }
          if (kew.orpCode == 'EXP') {
            ExpenseDataRow.push(
              new Object({
                id: kew.id,
                isIeBudget: kew.isIeBudget,
                financialYear: kew.financialYear,
                samityId: kew.samityId,
                glacId: kew.glacId,
                orpCode: kew.orpCode,
                tranDate: kew.tranDate,
                incAmt: kew.incAmt,
                expAmt: kew.expAmt,
                remarks: kew.remarks,
              }),
            );
          }
        });
        setIncomeDataRow(IncomeDataRow[0]);
        setExpenseDataRow(ExpenseDataRow[0]);
        setTotalAmountCalculation({
          ...totalAmountCalculation,
          pIncome: isNaN(AmountCalculation(IncomeData)) ? 0 : AmountCalculation(IncomeData),
          pExpense: isNaN(AmountCalculation(ExpenseData)) ? 0 : AmountCalculation(ExpenseData),
        });
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  // edit balnace part
  const handleBalanceChange = (e) => {
    setBalance({ ...balance, [e.target.name]: e.target.value });
  };

  // const TotalIncome =
  //   incomeList.length > 0 ? incomeList.map((datum) => parseFloat(datum.amount)).reduce((a, b) => a + b) : '';
  // const TotalExpense =
  //   expenseList.length > 0 ? expenseList.map((datum) => parseFloat(datum.amount)).reduce((a, b) => a + b) : '';

  let onSubmitUpdateData = async (e) => {
    e.preventDefault();
    if (checkMandatory(incomeList, 'income') == true && checkMandatory(expenseList, 'expense') == true) {
      setLoadingDataSaveUpdate(true);
      let updatePayload = new Array();
      let payloadNewInsert = new Array();
      for (let i = 0; i < incomeList.length; i++) {
        if (incomeList[i].details != '' || incomeList[i].amount != '') {
          if (incomeList[i].id) {
            updatePayload.push(
              new Object({
                id: incomeList[i].id,
                isIeBudget: incomeDataRow.isIeBudget,
                financialYear: '',
                samityId: getId,
                glacId: parseInt(incomeList[i].details),
                orpCode: 'INC',
                tranDate: incomeDataRow.tranDate,
                incAmt: bangToEng(incomeList[i].amount),
                expAmt: 0,
                remarks: null,
              }),
            );
          }
          if (incomeList[i].id == '') {
            if (incomeList[i].details != '' && incomeList[i].amount != '') {
              payloadNewInsert.push(
                new Object({
                  samityId: getId,
                  glacId: parseInt(incomeList[i].details),
                  expAmt: 0,
                  financialYear: '',
                  incAmt: bangToEng(incomeList[i].amount),
                  isIeBudget: 'E',
                  orpCode: 'INC',
                }),
              );
            }
          }
        }
      }
      for (let i = 0; i < expenseList.length; i++) {
        if (expenseList[i].details != '' || expenseList[i].amount != '') {
          if (expenseList[i].id) {
            updatePayload.push(
              new Object({
                id: expenseList[i].id,
                isIeBudget: expenseDataRow.isIeBudget,
                financialYear: '',
                samityId: getId,
                glacId: expenseList[i].details,
                orpCode: 'EXP',
                tranDate: expenseDataRow.tranDate,
                incAmt: 0,
                expAmt: bangToEng(expenseList[i].amount),
                remarks: null,
              }),
            );
          }
          if (expenseList[i].id == '') {
            if (expenseList[i].details != '' || expenseList[i].amount != '') {
              payloadNewInsert.push(
                new Object({
                  samityId: getId,
                  glacId: parseInt(expenseList[i].details),
                  expAmt: bangToEng(expenseList[i].amount),
                  incAmt: 0,
                  financialYear: '',
                  isIeBudget: 'E',
                  orpCode: 'EXP',
                }),
              );
            }
          }
        }
      }
      try {
        // update
        if (payloadNewInsert.length != 0) {
          await axios.post(SamityGlTrans + '/expense', payloadNewInsert, config);
        }
        let IncomeExpUpdate = await axios.put(SamityGlTrans, updatePayload, config);
        NotificationManager.success(IncomeExpUpdate.data.message, '', 5000);
        setLoadingDataSaveUpdate(false);
        // new data added which not includ before
        incomeExpenseData();
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      if (checkMandatory(incomeList, 'income') == false || checkMandatory(expenseList, 'expense') == false) {
        NotificationManager.warning('আয়/ব্যয় বাধ্যতামূলক তথ্য নির্বাচন/পূরণ করুন', '', 5000);
      }
    }
  };

  // const previousPage = () => {
  //   router.push({
  //     pathname: '/coop/samity-management/coop/member-expenditure',
  //   });
  //   // router.push({ pathname: "/coop/samity-management/coop/budget" });
  // };
  const onNextPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/budget' });
    // router.push({ pathname: "/coop/samity-management/coop/required-doc" });
  };
  const calculateBalance = (income, expense) => {
    let balance = 0;
    balance = income - expense;
    if (income < expense) {
      NotificationManager.warning('ব্যয় আয় এর চেয়ে বেশি হওয়া যাবে না।');
      return balance;
    } else {
      return balance;
    }
  };
  return (
    <>
      <Grid item lg={12} md={12} xs={12} mx={2} my={1} py={1}>
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
                      ক্রমিক নং
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
                            {incomeInfo.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.glacName}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right" className="amount-input">
                          <TextField
                            name="amount"
                            required
                            type="text"
                            inputProps={{ style: { textAlign: 'right' } }}
                            value={x.amount == 0 ? null : x.amount}
                            onChange={(e) => handleInputChangeIncome(e, i)}
                            variant="outlined"
                            size="small"
                            error={x.error}
                          ></TextField>
                        </TableCell>
                        <TableCell align="center">
                          {incomeList.length !== 1 && (
                            <Button className="table-icon delete" onClick={() => handleRemoveClickIncome(i)}>
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
                        name="income"
                        required
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
                        error={totalAmountCalculation.pIncome < totalAmountCalculation.pExpense ? true : false}
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      আগত তহবিল &nbsp;
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
                        name="income"
                        // disabled
                        type="text"
                        inputProps={{
                          style: {
                            textAlign: 'right',
                            fontSize: '15px',
                            fontWeight: 'bold',
                          },
                          readOnly: true,
                        }}
                        value={engToBang(balance.income.toFixed(2))}
                        onChange={(e) => handleBalanceChange(e)}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {/* {engToBang((balance.income).toFixed(2))} */}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      সর্বমোট &nbsp;
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
                        required
                        type="text"
                        inputProps={{
                          style: {
                            textAlign: 'right',
                            fontSize: '15px',
                            fontWeight: 'bold',
                          },
                          readOnly: true,
                        }}
                        value={engToBang((totalAmountCalculation.pIncome + parseFloat(balance.income)).toFixed(2))}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {/* {(totalAmountCalculation.pIncome + balance.income)} */}
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
                      ক্রমিক নং
                    </TableCell>
                    <TableCell>লেজার / হিসাবের নাম</TableCell>
                    <TableCell align="right">টাকা</TableCell>
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
                            {expenseInfo.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.glacName}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right" className="amount-input">
                          <TextField
                            name="amount"
                            required
                            type="text"
                            inputProps={{ style: { textAlign: 'right' } }}
                            value={x.amount == 0 ? null : x.amount}
                            onChange={(e) => handleInputChangeExpense(e, i)}
                            variant="outlined"
                            size="small"
                            error={x.error}
                          ></TextField>
                        </TableCell>
                        <TableCell align="center">
                          {expenseList.length !== 1 && (
                            <Button className="table-icon delete" onClick={() => handleRemoveClickExpense(i)}>
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
                        required
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
                        error={totalAmountCalculation.pIncome < totalAmountCalculation.pExpense ? true : false}
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      মজুদ তহবিল &nbsp;
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
                        required
                        type="text"
                        inputProps={{
                          style: {
                            textAlign: 'right',
                            fontSize: '15px',
                            fontWeight: 'bold',
                          },
                          readOnly: true,
                        }}
                        value={engToBang(
                          calculateBalance(totalAmountCalculation.pIncome, totalAmountCalculation.pExpense).toFixed(2),
                        )}
                        variant="outlined"
                        size="small"
                        error={totalAmountCalculation.pIncome < totalAmountCalculation.pExpense ? true : false}
                      ></TextField>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      সর্বমোট &nbsp;
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
                        required
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
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="btn-container">
        {onOffButton.length != 0 ? (
          <>
            <Tooltip title="হালনাগাদ করুন">
              {loadingDataSaveUpdate ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  sx={{ mr: 1 }}
                  startIcon={<SaveOutlinedIcon />}
                  variant="outlined"
                >
                  হালনাগাদ করা হচ্ছে...
                </LoadingButton>
              ) : (
                <Button
                  className="btn btn-save"
                  disabled={totalAmountCalculation.pIncome < totalAmountCalculation.pExpense ? true : false}
                  onClick={(event) => onSubmitUpdateData(event)}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  হালনাগাদ করুন
                </Button>
              )}
            </Tooltip>
            <Tooltip title="পরবর্তী পাতায়">
              <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
                পরবর্তী পাতায়{' '}
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
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
                  disabled={true}
                  onClick={(event) => onSubmitData(event)}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  সংরক্ষন করুন
                </Button>
              )}
            </Tooltip>
          </>
        )}
      </Grid>
    </>
  );
};

export default IncomeExpenseClone;
