/* eslint-disable @next/next/link-passhref */

/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2023-02-27 11:10:24
 * @desc [description]
 */
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import EditComponent from 'components/utils/coop/EditComponentList';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { dashboardData } from '../../../url/coop/ApiList';
import AllApplication from './AllApplication';
import AplApplication from './AplApplication';
import CancelApplication from './CancelApplication';
import NewApplication from './NewApplication';

const Dashboard = () => {
  const config = localStorageData('config');
  const [applicationData, setApplicationData] = useState({});
  const [stepId] = useState(0);

  useEffect(() => {
    dataStore();
  }, [stepId]);

  useEffect(() => {
    dashboardAllData();
  }, []);

  const dataStore = () => {
    const stepfoundId = localStorage && localStorage.stepId ? localStorage.stepId : null;
    if (stepfoundId == null) {
      localStorage.setItem('stepId', JSON.stringify(stepId));
    }
  };

  const dashboardAllData = async () => {
    try {
      const data = await axios.get(dashboardData, config);
      setApplicationData(data.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  // const editCoop = async (samityId) => {
  //   alert(samityId);
  //   const getCoopData = await axios.get(samityStepReg + '?samityId=' + samityId, config);
  //   localStorage.setItem('stepId', JSON.stringify(getCoopData.data.data[0].lastStep));
  //   localStorage.setItem('storeId', JSON.stringify(getCoopData.data.data[0].samityId));
  //   localStorage.setItem('storeName', JSON.stringify(getCoopData.data.data[0].samityName));
  //   router.push({ pathname: getCoopData.data.data[0].url });
  // };

  // const viewCoop = async (samityId) => {
  //   alert(samityId);
  //   const getCoopReportData = await axios.get(samityStepReg + '?samityId=' + samityId, config);
  //   localStorage.setItem('reportsId', JSON.stringify(getCoopReportData.data.data[0].samityId));
  //   router.push({ pathname: '/reports' });
  // };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
        }}
        xs={12}
      >
        <Grid container spacing={2.5}>
          <Grid item lg={12} md={12} xs={12}>
            <Grid container>
              <Grid item lg={12} md={12} xs={12}>
                <Grid container spacing={2.5}>
                  <Link href="#" pasHref>
                    <Grid item lg={3} md={3} xs={12}>
                      <AllApplication {...{ applicationData }} />
                    </Grid>
                  </Link>
                  <Link href="#" pasHref>
                    <Grid item lg={3} md={3} xs={12}>
                      <NewApplication />
                    </Grid>
                  </Link>
                  <Link href="#" pasHref>
                    <Grid item lg={3} md={3} xs={12}>
                      <AplApplication />
                    </Grid>
                  </Link>
                  <Link href="#" pasHref>
                    <Grid item lg={3} md={3} xs={12}>
                      <CancelApplication />
                    </Grid>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <EditComponent />
    </>
  );
};

export default Dashboard;
