/**
 * @author Md Saifur Rahman
 * @email saifur1985bd@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import { divisionSamiteeSummary } from '../../../url/coop/ApiList';
import { NotificationManager } from 'react-notifications';

// reportsIdTemp, reportsIdPer, status, config
const ReportTemplateDivision = ({ userData }) => {
  console.log({ userData });
  const config = localStorageData('config');

  const [divisionSamiteeData, setDivisionSamiteeData] = useState([]);

  useEffect(() => {
    divisionSamiteeReport();
  }, [userData?.officeId]);

  const divisionSamiteeReport = async () => {
    try {
      const getReportData = await axios.get(divisionSamiteeSummary + userData?.officeId, config);

      console.log('getReportData', getReportData);

      const data = getReportData.data.data;

      if (data) {
        setDivisionSamiteeData(data);
      } else {
        setDivisionSamiteeData([]);
        NotificationManager.warning('সমিতির কোন রিপোর্ট পাওয়া যায়নি', '', 5000);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      <Grid container px={2} py={2}>
        <Grid item lg={12} md={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">নং</TableCell>
                  <TableCell>বিভাগের নাম</TableCell>
                  <TableCell>প্রাথমিক সমিতির সংখ্যা</TableCell>
                  <TableCell>প্রাথমিক সমিতির সদস্য</TableCell>
                  <TableCell>কেন্দ্রিয় সমিতির সংখ্যা</TableCell>
                  <TableCell>কেন্দ্রিয় সমিতির সদস্য</TableCell>
                  <TableCell>জাতীয় সমিতির সংখ্যা</TableCell>
                  <TableCell>জাতীয় সমিতির সদস্য</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {divisionSamiteeData?.map((row, i) => (
                  <>
                    <TableRow key={row?.id}>
                      <TableCell scope="row" sx={{ textAlign: 'center' }}>
                        {numberToWord('' + (i + 1) + '')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{engToBang('' + row?.divisionNameBangla + '')}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {engToBang('' + row?.primarySamityApprove + '')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {engToBang('' + row?.primarySamityMember + '')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {engToBang('' + row?.kendrioSamityApprove + '')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {engToBang('' + row?.kendrioSamityMember + '')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {engToBang('' + row?.nationalSamityApprove + '')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {engToBang('' + row?.nationalSamityMember + '')}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportTemplateDivision;
