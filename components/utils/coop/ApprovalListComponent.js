
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { pendingList, serviceName } from '../../../url/coop/ApiList';
import Loader from '../../Loader';

const ApprovalListComponent = () => {
  const router = useRouter();
  const config = localStorageData('config');
  const [allSamityData, setAllSamityData] = useState([]);
  const [filterSamityData, setFilterSamityData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [serviceNames, setServiceName] = useState([]);
  useEffect(() => {
    getServiceName();
    getSamityRegister();
  }, []);

  const getServiceName = async () => {
    try {
      const serviceNameData = await axios.get(serviceName, config);
      let serviceNames = serviceNameData.data.data;
      let shortserviceName = serviceNames.sort((a, b) => {
        return a.id - b.id;
      });
      setServiceName(shortserviceName);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSamityRegister = async () => {
    try {
      setLoadingData(true);
      const getSamityRegisterData = await axios.get(pendingList + '?isPagination=false', config);
      const data = getSamityRegisterData.data.data;
      const filterData = data
        ?.filter((row) => row.status == 'P')
        ?.sort((a, b) => {
          return b.id - a.id;
        });
      setAllSamityData(filterData);
      setFilterSamityData(filterData);
      setLoadingData(false);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value != 0) {
      const filterresult = allSamityData.filter((data) => data.serviceId === parseInt(value));
      setFilterSamityData([...filterresult]);
    } else {
      setFilterSamityData(allSamityData);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onGoingPage = (id, serviceId, samityName, samityTypeName, serviceName, samityId) => {
    const data = {
      id,
      serviceId,
      samityName,
      samityTypeName,
      serviceName,
      samityId,
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));

    router.push({
      pathname: '/coop/approval/approvalData',
      query: {
        data: encodedData,
      },
    });
  };

  return (
    <>
      <Grid container className="section">
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="সেবাসমূহ"
            name="serviceId"
            onChange={handleChange}
            required
            select
            SelectProps={{ native: true }}
            //value={coop.projectId}
            variant="outlined"
            size="small"
          >
            <option value={0}> সকল সেবাসমূহ </option>
            {serviceNames.map((option) => (
              <option key={option.id} value={option.id}>
                {option.serviceName}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box>
            {/* <SubHeading>সেবাসমূহের তালিকা</SubHeading> */}
            {filterSamityData.length > 0 ? (
              <TableContainer className="table-container">
                {loadingData ? (
                  <Loader />
                ) : (
                  <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell>সেবাসমূহ</TableCell>
                        <TableCell>সমিতির নাম</TableCell>
                        <TableCell>সমিতির ধরণ</TableCell>
                        <TableCell align="center">আবেদনের তারিখ</TableCell>
                        <TableCell align="center">বিস্তারিত</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterSamityData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => {
                        return item.status == 'P' ? (
                          <TableRow key={i}>
                            <TableCell scope="row">
                              {
                                <Tooltip title={<div className="tooltip-title">{item?.serviceName}</div>} arrow>
                                  <span className="data">{item?.serviceName}</span>
                                </Tooltip>
                              }
                            </TableCell>
                            <TableCell scope="row">
                              {
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {item?.data?.samityName || item?.samityName || item?.data?.samityInfo?.samityName}
                                    </div>
                                  }
                                  arrow
                                >
                                  <span className="data">
                                    {item?.data?.samityName || item?.samityName || item?.data?.samityInfo?.samityName}
                                  </span>
                                </Tooltip>
                              }
                            </TableCell>
                            <TableCell scope="row">
                              {
                                <Tooltip
                                  title={
                                    <div className="tooltip-title">
                                      {item?.data?.samityTypeName ||
                                        item?.samityTypeName ||
                                        item?.data?.samityInfo?.samityTypeName}
                                    </div>
                                  }
                                  arrow
                                >
                                  <span className="data">
                                    {item?.data?.samityTypeName ||
                                      item?.samityTypeName ||
                                      item?.data?.samityInfo?.samityTypeName}
                                  </span>
                                </Tooltip>
                              }
                            </TableCell>
                            <TableCell scope="row" align="center">
                              {engToBang(dateFormat(item?.data?.createdAt))}
                            </TableCell>
                            <TableCell scope="row" sx={{ textAlign: 'center' }}>
                              {
                                <WysiwygIcon
                                  className="table-icon"
                                  onClick={() =>
                                    onGoingPage(
                                      item?.id,
                                      item?.serviceId,
                                      item?.data?.samityName || item?.samityName || item?.data?.samityInfo?.samityName,
                                      item?.data?.samityTypeName ||
                                      item?.samityTypeName ||
                                      item.data?.samityInfo?.samityTypeId,
                                      item?.serviceName,
                                      item?.data?.samityId || item?.samityId,
                                    )
                                  }
                                />
                              }
                            </TableCell>
                          </TableRow>
                        ) : (
                          ''
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                  component="div"
                  count={filterSamityData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  className="sticky-pagination"
                />
              </TableContainer>
            ) : (
              <div>
                <span
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    color: '#3678e1',
                    fontSize: '18px',
                  }}
                >
                  আবেদিত কোন সেবা নেই।
                </span>
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default ApprovalListComponent;
