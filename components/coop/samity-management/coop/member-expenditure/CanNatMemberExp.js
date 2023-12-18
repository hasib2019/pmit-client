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
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { steperFunForMemberExpendatureCenNat } from 'service/steper';
import { memberFinInfo } from '../../../../../url/coop/ApiList';

const CanNatMemberExp = () => {
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
  const stepId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('stepId')) : null;
  const samityLevel = localStorageData('samityLevel');
  ///////////////////////////////////////////////////////////////////////////////////
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [allFinancalData, setAllFinancalData] = useState([]);
  const [deactiveData] = useState(false);
  const [deactiveError] = useState(false);

  useEffect(() => {
    checkPageValidation();
    getMemberFinData();
  }, []);

  const getMemberFinData = async () => {
    try {
      if (samityLevel == 'C') {
        const finData = await axios.get(memberFinInfo + '/' + getId + '?getType=centralSamity', config);
        const allFinData = finData.data.data;
        setAllFinancalData(allFinData);
      }
      if (samityLevel == 'N') {
        const finData = await axios.get(memberFinInfo + '/' + getId + '?getType=nationalSamity', config);
        const allFinData = finData.data.data;
        setAllFinancalData(allFinData);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
  //
  // const timer = useRef();
  const onUpdateNext = () => {
    setLoadingDataSaveUpdate(true);
    // timer.current = window.setTimeout(() => {
    // const message = stepId == 4 ? "সংরক্ষন সম্পন্ন হয়েছে" : "হালনাগাদ সম্পন্ন হয়েছে"
    // NotificationManager.success(message, "", 5000);
    // // steperFun(4);
    // const sendData = steperFunForMemberExpendatureCenNat(4);
    // if(sendData.status==200){
    //   router.push({ pathname: "/coop/samity-management/coop/budget" });
    // }
    // setLoadingDataSaveUpdate(false);
    // }, 1000);
    steperFunForMemberExpendatureCenNat(4).then((response) => {
      if (response.status == 200) {
        const message = stepId == 4 ? 'সংরক্ষন সম্পন্ন হয়েছে' : 'হালনাগাদ সম্পন্ন হয়েছে';
        NotificationManager.success(message, '', 5000);
        router.push({ pathname: '/coop/samity-management/coop/income-expense' });
        setLoadingDataSaveUpdate(false);
      }
    });
    setLoadingDataSaveUpdate(false);
  };
  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/designation/' });
  };
  const onNextPage = () => {
    // steperFun(4);
    router.push({ pathname: '/coop/samity-management/coop/income-expense' });
  };
  return (
    <>
      <Grid container className="section">
        <Grid item xs={12}>
          <TableContainer className="table-container">
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">ক্রমিক নং</TableCell>
                  <TableCell>নিবন্ধন নাম্বার</TableCell>
                  <TableCell>সদস্য সমিতির নাম</TableCell>
                  <TableCell align="center">শেয়ার সংখ্যা</TableCell>
                  <TableCell align="right">শেয়ার মূলধন (টাকা)</TableCell>
                  <TableCell align="right">সঞ্চয় (টাকা)</TableCell>
                  <TableCell align="right">ঋণ (টাকা)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allFinancalData.map((val, index) => (
                  <TableRow key={val.memberId}>
                    <TableCell align="center">{engToBang('' + (index + 1) + '')}</TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{engToBang(val.samityCode)}</div>} arrow>
                        <span className="data">{engToBang(val.samityCode)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{val.samityName || val.memberName}</div>} arrow>
                        <span className="data">{val.samityName || val.memberName}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{engToBang(val.samityNoOfShare)}</TableCell>
                    <TableCell align="right">{engToBang(val.samityShareAmount)}</TableCell>
                    <TableCell align="right">{engToBang(val.samitySavingsAmount)}</TableCell>
                    <TableCell align="right">{engToBang(val.samityLoanOutstanding)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Divider />
      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
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
                  onClick={onUpdateNext}
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

export default CanNatMemberExp;
