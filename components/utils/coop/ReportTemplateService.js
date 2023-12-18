/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
// ---------------Developed by Afrina & Mashroor-------------
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import { pendingListByService } from '../../../url/coop/ApiList';

// reportsIdTemp, reportsIdPer, status, config
const ReportTemplateService = ({ officeId, serviceId, config }) => {
  const [servicePendingData, setServicePendingData] = useState([]);

  useEffect(() => {
    pendingReport();
  }, [serviceId]);

  const pendingReport = async () => {
    try {
      const getReportData = await axios.get(pendingListByService + officeId + '/' + serviceId, config);
      const data = getReportData.data.data;
      if (data) {
        setServicePendingData(data);
      } else {
        setServicePendingData([]);
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
                  <TableCell>সমিতির নাম</TableCell>
                  <TableCell>সমিতির কোড</TableCell>
                  <TableCell>সমিতি লেভেল</TableCell>
                  <TableCell>সমিতির ধরণ</TableCell>
                  <TableCell>আবেদনের তারিখ</TableCell>
                  <TableCell>আবেদনকারীর নাম</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicePendingData?.map((row, i) => (
                  <>
                    <TableRow key={row.id}>
                      <TableCell scope="row" sx={{ textAlign: 'center' }}>
                        {numberToWord('' + (i + 1) + '')}
                      </TableCell>
                      <TableCell>{row.samityName}</TableCell>
                      <TableCell>{numberToWord('' + row.samityCode ? row.samityCode : '0' + '')}</TableCell>
                      <TableCell>
                        {row.samityLevel == 'P'
                          ? 'প্রাথমিক'
                          : row.samityLevel == 'C'
                            ? 'কেন্দ্রীয়'
                            : row.samityLevel == 'N'
                              ? 'জাতীয়'
                              : ''}
                      </TableCell>
                      <TableCell>{row.typeName}</TableCell>
                      <TableCell>{numberToWord('' + row.createDate + '')}</TableCell>
                      <TableCell>{row.name ? row.name : row.nameBangla}</TableCell>
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

export default ReportTemplateService;
