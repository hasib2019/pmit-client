/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023-07-17 10:13:48 AM
 * @modify date 2023-07-17
 * @desc [description]
 */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
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
import SubHeading from 'components/shared/others/SubHeading';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { errorHandler } from 'service/errorHandler';
import { formValidator } from 'service/formValidator';
import { bangToEng } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import { useImmer } from 'use-immer';
import { FetchWrapper } from '../../../../helpers/fetch-wrapper';
import { memberfinancedata } from '../../../../url/ApiList';
const MemberFinancialInfo = ({ samityId }) => {
  const [dataGridArr, setDataGridArr] = useImmer([]);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  useEffect(() => {
    getdata(samityId);
  }, [samityId]);

  const prepareMemberFin = (areaData) => {
    const newData = areaData?.map((obj) => {
      const { ...rest } = obj;
      return {
        ...rest,
        deposite: '',
        depositeError: '',
        depositeWithdraw: '',
        depositeWithdrawError: '',
        loanDisbursMent: '',
        loanDisbursMentError: '',
        loanRepayment: '',
        loanRepaymentError: '',
        newShare: '',
        totalSharePrice: '',
        newShareError: '',
      };
    });
    var obj = [...newData];
    obj.sort((a, b) => a.memberCode - b.memberCode);
    return obj;
  };
  const getdata = async (id) => setDataGridArr(prepareMemberFin(await FetchWrapper.get(memberfinancedata + '/' + id)));

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const resultObj = formValidator('number', value);
    if (resultObj?.status) {
      return;
    }
    switch (name) {
      case 'deposite':
        setDataGridArr((draft) => {
          draft[index][name] = resultObj?.value;
          draft[index]['depositeWithdrawError'] =
            parseInt(bangToEng(draft[index]['savingsAmount'])) + parseInt(bangToEng(resultObj?.value)) <
            parseInt(bangToEng(draft[index]['depositeWithdraw']))
              ? 'error'
              : '';
          // notification part
          if (
            parseInt(bangToEng(draft[index]['savingsAmount'])) + parseInt(bangToEng(resultObj?.value)) <
            parseInt(bangToEng(draft[index]['depositeWithdraw']))
          )
            return NotificationManager.warning(
              'মোট (সঞ্চয় ও সঞ্চয় জমা) এর থেকে বেশি টাকা উত্তোলন করা যাবে না',
              '',
              5000,
            );
        });
        break;
      case 'depositeWithdraw':
        setDataGridArr((draft) => {
          draft[index][name] = resultObj?.value;
          draft[index]['depositeWithdrawError'] =
            parseInt(bangToEng(draft[index]['savingsAmount'])) +
              (draft[index]['deposite'] != '' ? parseInt(bangToEng(draft[index]['deposite'])) : 0) <
            parseInt(bangToEng(resultObj?.value))
              ? 'error'
              : '';
          // notification part
          if (
            parseInt(bangToEng(draft[index]['savingsAmount'])) +
              (draft[index]['deposite'] != '' ? parseInt(bangToEng(draft[index]['deposite'])) : 0) <
            parseInt(bangToEng(resultObj?.value))
          )
            return NotificationManager.warning(
              'মোট (সঞ্চয় ও সঞ্চয় জমা) এর থেকে বেশি টাকা উত্তোলন করা যাবে না',
              '',
              5000,
            );
        });
        break;
      case 'newShare':
        setDataGridArr((draft) => {
          draft[index][name] = resultObj?.value;
          draft[index]['totalSharePrice'] = resultObj?.value
            ? draft[index]['sharePrice'] * parseInt(bangToEng(resultObj?.value))
            : '';
        });
        break;
      default:
        setDataGridArr((draft) => {
          draft[index][name] = resultObj?.value;
        });
        break;
    }
  };

  const dataCheckAndResolver = (data) => {
    const checkFormError = data.some((row) => {
      return row.depositeWithdrawError != '';
    });
    if (checkFormError) {
      NotificationManager.warning('মোট (সঞ্চয় ও সঞ্চয় জমা) এর থেকে বেশি টাকা উত্তোলন করা যাবে না', '', 5000);
    }
    return checkFormError;
  };

  const arrayResolver = (data) => {
    const newData = data?.map((rest) => {
      return {
        memberId: rest?.memberId,
        transation: [
          ...(rest?.deposite
            ? [{ tranType: 'DEP', tranAmt: rest?.deposite ? parseInt(bangToEng(rest?.deposite)) : 0 }]
            : []),
          ...(rest?.depositeWithdraw
            ? [{ tranType: 'WDL', tranAmt: rest?.depositeWithdraw ? parseInt(bangToEng(rest?.depositeWithdraw)) : 0 }]
            : []),
          ...(rest?.loanDisbursMent
            ? [{ tranType: 'LDG', tranAmt: rest?.loanDisbursMent ? parseInt(bangToEng(rest?.loanDisbursMent)) : 0 }]
            : []),
          ...(rest?.loanRepayment
            ? [{ tranType: 'REP', tranAmt: rest?.loanRepayment ? parseInt(bangToEng(rest?.loanRepayment)) : 0 }]
            : []),
          ...(rest?.newShare
            ? [{ tranType: 'SHR', tranAmt: rest?.newShare ? parseInt(bangToEng(rest?.newShare)) : 0 }]
            : []),
        ],
        loanOutstanding:
          (rest?.loanOutstanding ? parseInt(bangToEng(rest?.loanOutstanding)) : 0) +
          (rest?.loanDisbursMent ? parseInt(bangToEng(rest?.loanDisbursMent)) : 0) -
          (rest?.loanRepayment ? parseInt(bangToEng(rest?.loanRepayment)) : 0),
        noOfShare:
          (rest?.noOfShare ? parseInt(rest?.noOfShare) : 0) +
          (rest?.newShare ? parseInt(bangToEng(rest?.newShare)) : 0),
        savingsAmount:
          (rest?.savingsAmount ? parseInt(rest?.savingsAmount) : 0) +
          (rest?.deposite ? parseInt(bangToEng(rest?.deposite)) : 0) -
          (rest?.depositeWithdraw ? parseInt(bangToEng(rest?.depositeWithdraw)) : 0),
        shareAmount:
          (rest?.shareAmount ? parseInt(rest?.shareAmount) : 0) +
          (rest?.totalSharePrice ? parseInt(rest?.totalSharePrice) : 0),
      };
    });
    return newData;
  };

  const onSubmitData = async (e) => {
    e.preventDefault();
    if (dataCheckAndResolver(dataGridArr) == false) {
      setLoadingDataSaveUpdate(true);
      const payload = {
        samityId,
        data: arrayResolver(dataGridArr),
      };
      try {
        const result = await FetchWrapper.post(memberfinancedata, payload);
        NotificationManager.success(result.message, '', 5000);
        setDataGridArr([]);
        getdata(samityId);
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    }
  };

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <SubHeading>মেম্বার আর্থিক তথ্য</SubHeading>
      </Box>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <TableContainer className="table-container table-input">
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">কোড</TableCell>
                  <TableCell>সদস্যের নাম</TableCell>
                  <TableCell>সঞ্চয়</TableCell>
                  <TableCell>সঞ্চয় জমা</TableCell>
                  <TableCell>সঞ্চয় উত্তোলন</TableCell>

                  <TableCell>ঋণের পরিমান</TableCell>
                  <TableCell>ঋণ বিতরণ</TableCell>
                  <TableCell>কিস্তি আদায়</TableCell>

                  <TableCell>মোট শেয়ার মূল্য</TableCell>
                  <TableCell>নতুন শেয়ার</TableCell>
                  <TableCell>শেয়ার মূল্য</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataGridArr?.map((val, index) => (
                  <TableRow key={val.index}>
                    <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + val.memberCode + '')}</TableCell>
                    <TableCell>&nbsp;{val.memberNameBangla}&nbsp;</TableCell>
                    {/* saving part  */}
                    <TableCell sx={{ textAlign: 'right' }}>
                      &nbsp;{numberToWord('' + val.savingsAmount + '')}&nbsp;
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <TextField
                        name="deposite"
                        required
                        onChange={(e) => handleChange(e, index)}
                        type="text"
                        variant="outlined"
                        size="small"
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={val.deposite}
                        error={val.depositeError ? true : false}
                        // helperText={val.depositeError}
                      ></TextField>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <TextField
                        name="depositeWithdraw"
                        onChange={(e) => handleChange(e, index)}
                        required
                        type="text"
                        variant="outlined"
                        size="small"
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={val.depositeWithdraw}
                        error={val.depositeWithdrawError ? true : false}
                        // helperText={val.depositeWithdrawError}
                      ></TextField>
                    </TableCell>
                    {/* Loan part  */}
                    <TableCell sx={{ textAlign: 'right' }}>
                      &nbsp;{numberToWord('' + val.loanOutstanding + '')}&nbsp;
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="loanDisbursMent"
                        onChange={(e) => handleChange(e, index)}
                        required
                        type="text"
                        value={val.loanDisbursMent}
                        error={val.loanDisbursMentError ? true : false}
                        // helperText={val.loanDisbursMentError}
                        inputProps={{ style: { textAlign: 'right' } }}
                        variant="outlined"
                        size="small"
                        sx={{ bgcolor: '#F1F1F1', color: 'red' }}
                      ></TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="loanRepayment"
                        onChange={(e) => handleChange(e, index)}
                        required
                        type="text"
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={val.loanRepayment}
                        error={val.loanRepaymentError ? true : false}
                        // helperText={val.loanRepaymentError}
                        variant="outlined"
                        size="small"
                      ></TextField>
                    </TableCell>
                    {/* share part  */}
                    <TableCell sx={{ textAlign: 'right' }}>
                      &nbsp;{numberToWord('' + val.shareAmount + '')}&nbsp;
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="newShare"
                        onChange={(e) => handleChange(e, index)}
                        required
                        inputProps={{ style: { textAlign: 'right' } }}
                        type="text"
                        value={val.newShare}
                        error={val.newShareError ? true : false}
                        // helperText={val.newShareError}
                        variant="outlined"
                        size="small"
                      ></TextField>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      &nbsp;{numberToWord('' + val.totalSharePrice + '')}&nbsp;
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid sx={{ mt: 2, textAlign: 'right' }}>
            {loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                className="btn btn-save"
                sx={{ backgroundColor: 'red', mr: 1 }}
                loadingPosition="start"
                startIcon={<SaveOutlinedIcon />}
                variant="contained"
              >
                {'সংরক্ষন করা হচ্ছে...'}
              </LoadingButton>
            ) : (
              <Tooltip title={'সংরক্ষন করুন ও পরবর্তী পাতায়'}>
                <Button
                  className="btn btn-save"
                  onClick={onSubmitData}
                  // disabled={checkFormError() ? false : true}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  {'সংরক্ষন করুন ও পরবর্তী পাতায়'}
                </Button>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default MemberFinancialInfo;
