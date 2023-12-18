
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { reverseRequestInfo } from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';

import axios from 'axios';
const ReverseTranApplication = ({ allData }) => {
  const [reverseMainTran, setReverseMainTran] = useState([]);
  let { applicationInfo, history } = allData;

  function createMarkup(value) {
    return {
      __html: value,
    };
  }

  const config = localStorageData('config');
  //Reverse Main tran Data API
  const getReverseMainTran = async (tranNumber, tranDate) => {
    if (tranNumber && tranDate) {
      try {
        const ReverseMainTranInfo = await axios.get(
          reverseRequestInfo + '?tranNumber=' + tranNumber + '&tranDate=' + tranDate,
          config,
        );
        setReverseMainTran(ReverseMainTranInfo.data.data.reverseRequstData);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  useEffect(() => {
    getReverseMainTran(applicationInfo?.tranNum, dateFormat(applicationInfo?.tranDate));
  }, [allData]);
  return (
    <Grid container>
      <Grid container className="section">
        <SubHeading>মূল লেনদেনের তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table" className="table-alter">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>লেনদেনের তারিখ</TableCell>
                <TableCell>লেনদেনের নম্বর</TableCell>
                <TableCell>হিসাব নম্বর</TableCell>
                <TableCell>জিএল এর নাম</TableCell>
                <TableCell>ক্রেডিট/ডেবিট</TableCell>
                <TableCell>লেনদেনের পরিমাণ (টাকা)</TableCell>
                <TableCell>মন্তব্য</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reverseMainTran?.map((element, i) => (
                <TableRow key={'reverse' + i}>
                  <TableCell>{engToBang(dateFormat(element?.tranDate))}</TableCell>
                  <TableCell>{element?.tranNum}</TableCell>
                  <TableCell>{element?.accountTitle}</TableCell>
                  <TableCell>{element?.glacName}</TableCell>
                  <TableCell>{element?.drcrCode}</TableCell>
                  <TableCell>{engToBang(element?.tranAmt)}</TableCell>
                  <TableCell>
                    <Tooltip title={<div className="tooltip-title">{element?.naration}</div>} arrow>
                      <span className="data">{element?.naration}</span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>মন্তব্যকারীর নাম</TableCell>
                <TableCell>কার্যক্রম</TableCell>
                <TableCell>মন্তব্য</TableCell>
                <TableCell>সংযুক্তি</TableCell>
                <TableCell>তারিখ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.nameBn}</TableCell>
                  <TableCell>{v.actionText}</TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={createMarkup(v.remarks)} />
                  </TableCell>
                  <TableCell style={{ color: 'blue', fontSize: '16px' }}>
                    <a href={v.attachment.fileNameUrl}>
                      {' '}
                      {v.attachment.fileNameUrl ? 'ডাউনলোড করুন' : 'সংযুক্তি নেই'}{' '}
                    </a>
                  </TableCell>
                  <TableCell>{v.actionDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ReverseTranApplication;
