/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
import { Grid } from '@mui/material';
import ServiceReport from 'components/utils/coop/ServiceReport';
import ReportTempleteService from 'components/utils/coop/ReportTemplateService';
import { Fragment, useState } from 'react';
import { localStorageData } from 'service/common';

const UserReport = () => {
  const config = localStorageData('config');
  const [serviceId, setServiceId] = useState();
  const [officeId, setOfficeId] = useState();
  const [openReport, setOpenReport] = useState(false);

  const takeData = (officeId, serviceId, report) => {
    setServiceId(serviceId);
    setOfficeId(officeId);
    setOpenReport(report);
  };

  return (
    <Fragment>
      <Grid container spacing={2.5} my={1} px={2}>
        <ServiceReport {...{ takeData, getData: 'all' }} />
      </Grid>
      {openReport ? <ReportTempleteService {...{ officeId, serviceId, config }} /> : ''}
    </Fragment>
  );
};

export default UserReport;
