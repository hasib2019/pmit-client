/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
import { Grid } from '@mui/material';
import SamityDocuments from 'components/utils/coop/SamityDocuments';
import ReportTemplete from 'components/utils/coop/ReportTemplete';
import { Fragment, useState } from 'react';
import { localStorageData } from 'service/common';

const UserReport = () => {
  const config = localStorageData('config');
  const [openReport, setOpenReport] = useState(false);
  const [viewReportData, setViewReportData] = useState([]);
  const takeData = (samityData, report) => {
    setViewReportData(samityData);
    setOpenReport(report);
  };

  return (
    <Fragment>
      <Grid container spacing={2.5} my={1} px={2}>
        <SamityDocuments {...{ takeData, getData: 'all' }} />
      </Grid>

      {openReport ? <ReportTemplete {...{ samityReportId: viewReportData, config }} /> : ''}
    </Fragment>
  );
};

export default UserReport;
