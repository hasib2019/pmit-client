/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/06/08 10:13:48
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { formValidator } from 'service/formValidator';
import { bangToEng, engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import { CoopRegApi, allMemberInfo, memberFinInfo } from '../../../../../url/coop/ApiList';

const MemberExp = () => {
  const router = useRouter();
  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/registration' });
    }
  };
  const config = localStorageData('config');

  const getId = localStorageData('getSamityId');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const stepId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('stepId')) : null;

  const [memberInfo, setMemberInfo] = useState([]);
  // const [memberInfoLength, setMemberInfoLength] = useState();
  const [allFinancalData, setAllFinancalData] = useState([]);
  const [soldShare, setSoldShare] = useState(null);
  const [totalShare, setTotalShare] = useState(null);
  const [sharePrice, setSharePrice] = useState(0);
  const [deactiveData, setDeactiveData] = useState(false);
  const [deactiveError, setDeactiveError] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [fromError, setFromError] = useState([]);

  useEffect(() => {
    checkPageValidation();
    getMemberInfo();
    getMemberFinData();
    samityAllInfo();
  }, []);

  let getMemberInfo = async () => {
    try {
      let memberInformation = await axios.get(allMemberInfo + '?samityId=' + getId, config);
      let memberArray1 = memberInformation.data.data;
      // setMemberInfoLength(memberArray1.length);
      memberArray1.map((element) => {
        element.noOfShare = null;
        element.sharePrice = null;
        element.savings = null;
        element.loan = null;
      });
      setMemberInfo(memberArray1);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getMemberFinData = async () => {
    try {
      const finData = await axios.get(memberFinInfo + '/' + getId, config);

      const finDataCount = finData.data.data.length;
      let data = [];
      for (let index = 0; index < finDataCount; index++) {
        data.push({ noOfShareValidity: '' });
      }
      setFromError(data);

      let allFinData = finData.data.data;
      const totalCount = allFinData.map((datum) => parseInt(datum.noOfShare)).reduce((a, b) => a + b);
      if (totalCount) {
        setTotalAmount(totalCount);
      } else {
        setTotalAmount(0);
      }
      setAllFinancalData(allFinData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...memberInfo];
    memberInfo[index][name] = value;
    setMemberInfo(list);
    changeSharePrice(e.target.value, index);
  };

  let changeSharePrice = (data, index) => {
    // const list = [...memberInfo];
    const name = 'sharePrice';
    memberInfo[index][name] = data * sharePrice;
  };

  const handleChange2 = (e, index) => {
    const { name, value } = e.target;
    const list = [...memberInfo];
    memberInfo[index][name] = value;
    setMemberInfo(list);
  };

  const handleChangeEdit = (e, index) => {
    const { name, value } = e.target;
    let noOfShareBang;
    noOfShareBang = formValidator('number', value);
    if (noOfShareBang?.status) {
      return;
    }
    const list = [...allFinancalData];
    allFinancalData[index][name] = value ? noOfShareBang?.value : 0;
    setAllFinancalData(list);
    changeSharePriceEdit(parseInt(bangToEng(noOfShareBang?.value)), index);
    const totalCount = list.map((datum) => parseInt(bangToEng('' + datum.noOfShare + ''))).reduce((a, b) => a + b);

    if (totalCount) {
      setTotalAmount(totalCount);
    } else {
      setTotalAmount(0);
    }

    if (bangToEng(noOfShareBang?.value) > (totalShare * 20) / 100) {
      const list = [...fromError];
      list[index]['noOfShareValidity'] = 'শেয়ার সংখ্যা মোট শেয়ারের ২০% এর বেশি হবে না';
      setFromError(list);
    } else {
      const list = [...fromError];
      list[index]['noOfShareValidity'] = '';
      setFromError(list);
    }

    if (fromError) {
      for (let index = 0; index < fromError.length; index++) {
        if (fromError[index].noOfShareValidity < 0) {
          setDeactiveError(true);
        } else {
          setDeactiveError(false);
        }
      }
    }

    if (totalCount > soldShare) {
      setDeactiveData(true);
    } else {
      setDeactiveData(false);
    }
  };

  let changeSharePriceEdit = (data, index) => {
    const name = 'shareAmount';
    allFinancalData[index][name] = data ? engToBang(data * sharePrice) : '';
  };

  const handleChangeEditOther = (e, index) => {
    const { name, value } = e.target;
    let AmountBang;
    AmountBang = formValidator('number', value);
    if (AmountBang?.status) {
      return;
    }
    const list = [...allFinancalData];
    allFinancalData[index][name] = AmountBang?.value;
    setAllFinancalData(list);
  };

  // ***********************************  get samity info  *************************************
  const samityAllInfo = async () => {
    try {
      const showSamityInfo = await axios.get(CoopRegApi + '/' + getId, config);
      const soldShare = showSamityInfo.data.data.Samity[0].soldShare;
      const sPrice = showSamityInfo.data.data.Samity[0].sharePrice;
      const allSoldPrice = showSamityInfo.data.data.Samity[0].noOfShare;
      setSoldShare(soldShare);
      setTotalShare(allSoldPrice);
      setSharePrice(sPrice);
    } catch (error) {
      errorHandler(error);
    }
  };
  // *******************************************************************************************

  const onUpdateData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let payloadData = [];
    allFinancalData.map((kew) => {
      payloadData.push(
        new Object({
          id: kew.id,
          memberId: kew.memberId,
          samityId: kew.samityId,
          noOfShare: kew.noOfShare && kew.noOfShare != 0 ? bangToEng('' + kew.noOfShare + '') : null,
          shareAmount: bangToEng('' + kew.shareAmount + ''),
          savingsAmount: kew.savingsAmount ? bangToEng('' + kew.savingsAmount + '') : 0,
          loanOutstanding: bangToEng('' + kew.loanOutstanding + ''),
        }),
      );
    });
    try {
      const financialUpdate = await axios.put(memberFinInfo, payloadData, config);

      router.push({ pathname: '/coop/samity-management/coop/income-expense' });
      setLoadingDataSaveUpdate(false);
      NotificationManager.success(financialUpdate.data.message, '', 5000);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/designation' });
  };
  const onNextPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/income-expense' });
  };
  return (
    <>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <TableContainer className="table-container table-input">
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">ক্রমিক নং</TableCell>
                  <TableCell align="center">সদস্য কোড</TableCell>
                  <TableCell>নাম</TableCell>
                  <TableCell>পিতার নাম</TableCell>
                  <TableCell align="center">শেয়ার সংখ্যা</TableCell>
                  <TableCell align="right">শেয়ার মূলধন</TableCell>
                  <TableCell align="right">সঞ্চয়</TableCell>
                  <TableCell align="right">ঋণ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allFinancalData
                  ? allFinancalData.map((val, index) => (
                      <TableRow key={val.memberId}>
                        <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + (index + 1) + '')}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + val.memberCode + '')}</TableCell>
                        <TableCell>&nbsp;{val.memberNameBangla}</TableCell>
                        <TableCell>&nbsp;{val.fatherName}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <TextField
                            name="noOfShare"
                            onChange={(event) => handleChangeEdit(event, index)}
                            required
                            type="text"
                            variant="outlined"
                            size="small"
                            inputProps={{ style: { textAlign: 'right' } }}
                            value={val.noOfShare == 0 ? '' : engToBang(val.noOfShare)}
                            error={fromError[index].noOfShareValidity ? true : false}
                            helperText={fromError[index].noOfShareValidity}
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            disabled
                            name="shareAmount"
                            required
                            type="text"
                            value={val.shareAmount == 0 ? '' : engToBang(val.shareAmount)}
                            inputProps={{ style: { textAlign: 'right' } }}
                            variant="outlined"
                            size="small"
                            sx={{ bgcolor: '#F1F1F1', color: 'red' }}
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="savingsAmount"
                            onChange={(event) => handleChangeEditOther(event, index)}
                            required
                            type="text"
                            inputProps={{ style: { textAlign: 'right' } }}
                            value={val.savingsAmount == 0 ? '' : engToBang(val.savingsAmount)}
                            variant="outlined"
                            size="small"
                          ></TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="loanOutstanding"
                            onChange={(event) => handleChangeEditOther(event, index)}
                            required
                            inputProps={{ style: { textAlign: 'right' } }}
                            type="text"
                            value={val.loanOutstanding == 0 ? '' : engToBang(val.loanOutstanding)}
                            variant="outlined"
                            size="small"
                          ></TextField>
                        </TableCell>
                      </TableRow>
                    ))
                  : memberInfo.map((val, index) => (
                      <TableRow key={val.memberId}>
                        <TableCell sx={{ p: '5px' }}>{index + 1}</TableCell>
                        <TableCell sx={{ p: '5px' }}>{val.nid}</TableCell>
                        <TableCell sx={{ p: '5px' }}>{val.memberCode}</TableCell>
                        <TableCell sx={{ p: '5px' }}>{val.memberNameBangla}</TableCell>
                        <TableCell sx={{ p: '5px' }}>
                          <TextField
                            name="noOfShare"
                            onChange={(event) => handleChange(event, index)}
                            required
                            autoComplete="off"
                            type="number"
                            variant="outlined"
                            size="small"
                            textAlign="right"
                          ></TextField>
                        </TableCell>
                        <TableCell sx={{ p: '5px' }}>
                          <TextField
                            disabled
                            name="sharePrice"
                            required
                            type="number"
                            value={memberInfo[index].sharePrice}
                            variant="outlined"
                            size="small"
                            sx={{ bgcolor: '#F1F1F1' }}
                          ></TextField>
                        </TableCell>
                        <TableCell sx={{ p: '5px' }}>
                          <TextField
                            name="savings"
                            onChange={(event) => handleChange2(event, index)}
                            required
                            type="number"
                            value={memberInfo.savings}
                            variant="outlined"
                            size="small"
                          ></TextField>
                        </TableCell>
                        <TableCell sx={{ p: '5px' }}>
                          <TextField
                            name="loan"
                            onChange={(event) => handleChange2(event, index)}
                            required
                            type="number"
                            value={memberInfo.loan}
                            variant="outlined"
                            size="small"
                          ></TextField>
                        </TableCell>
                      </TableRow>
                    ))}
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                      padding: '.4rem .9rem !important',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      fontSize: '1rem',
                    },
                  }}
                >
                  <TableCell align="center"> </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>মোট শেয়ারঃ</TableCell>
                  <TableCell>{engToBang(totalAmount)}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container sx={{ color: '#000', fontSize: '18px', fontWeight: 'bold' }}>
        <Grid>
          <span>মোট শেয়ার সংখ্যাঃ- {numberToWord('' + totalShare + '')} টি,</span>
        </Grid>
        <Grid>
          <span>&nbsp;বিক্রিত শেয়ার সংখ্যাঃ- {numberToWord('' + soldShare + '')} টি,</span>
        </Grid>
        <Grid>
          <span>&nbsp;শেয়ার মূল্যঃ- {numberToWord('' + sharePrice + '')} টাকা, </span>
        </Grid>
        <Grid>
          {deactiveData ? (
            <span style={{ color: 'red' }}>
              &nbsp;বিক্রিত শেয়ার সংখ্যাঃ- {numberToWord('' + soldShare + '')} এর কম হতে হবে
            </span>
          ) : (
            <span>&nbsp;অনির্ধারিত শেয়ার সংখ্যাঃ- {numberToWord('' + (soldShare - totalAmount) + '')} টি </span>
          )}
        </Grid>
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            {' '}
            আগের পাতায়
          </Button>
        </Tooltip>
        {allFinancalData ? (
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
                  {stepId == 4 ? 'সংরক্ষন করা হচ্ছে...' : 'হালনাগাদ করা হচ্ছে...'}
                </LoadingButton>
              ) : (
                <Button
                  disabled={deactiveData || deactiveError}
                  className="btn btn-save"
                  onClick={onUpdateData}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  {stepId == 4 ? 'সংরক্ষন করুন' : 'হালনাগাদ করুন'}
                </Button>
              )}
            </Tooltip>
            {stepId > 4 ? (
              <Tooltip title="পরবর্তী পাতা">
                <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
                  পরবর্তী পাতায়{' '}
                </Button>
              </Tooltip>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
      </Grid>
    </>
  );
};

export default MemberExp;
