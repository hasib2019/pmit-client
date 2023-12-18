/* eslint-disable react-hooks/exhaustive-deps */
import AddTaskIcon from '@mui/icons-material/AddTask';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { dayOpenCloseRoute } from '../../../../../../url/AccountsApiLIst';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const DayClose = () => {
  const config = localStorageData('config');

  const [projectInfo, setProjectInfo] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [setOfficeWiseOpenDates] = useState([]);
  useEffect(() => {
    getProject();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCheckAccepted = (id) => {
    'idddofficeOpen', id;
    let data = projectInfo;
    const item = data.find((d) => d.id == id);

    const selectedArray = [...selectedData];
    let filteredArray;
    if (item.isChecked) {
      item.isChecked = false;
      filteredArray = selectedArray.filter((d) => d.id != id);

      'Filtered Array---', filteredArray;

      setSelectedData(filteredArray);
    } else {
      item.isChecked = true;
      selectedArray.push({
        ...(id && { projectId: item.projectId }),
        openCloseDate: moment(item.openCloseDate).format('yyyy-MM-DD'),
        officeId: item.officeId,
        //  moment(item.openCloseDate).format("yyyy-MM-DD"),
      });
      setSelectedData(selectedArray);
    }
    setProjectInfo(data);
  };

  const getProject = async () => {
    try {
      let projectData = await axios.get(dayOpenCloseRoute, config);
      const projectDataList = projectData.data.data.projectWiseOpenDates;
      const officeOpenDates = projectData.data.data.officeWiseOpenDates;
      projectDataList.map((val) => {
        val.isChecked = false;
      });
      officeOpenDates.map((val) => {
        val.isChecked = false;
      });
      setProjectInfo([...projectDataList, ...officeOpenDates]);
      setOfficeWiseOpenDates(officeOpenDates);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const onSubmitData = async () => {
    'selecteddata', selectedData;
    if (selectedData.length > 0) {
      let payload;
      payload = selectedData;
      try {
        setIsLoading(true);
        const assignProject = await axios.post(dayOpenCloseRoute, payload, config);
        setIsLoading(false);
        NotificationManager.success(assignProject.data.message, '', 5000);
        setSelectedData([]);
        getProject();
      } catch (error) {
        setSelectedData([]);
        getProject();
        setIsLoading(false);
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }
  };

  return (
    <>
      <Paper>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item lg={12} md={12} xs={12}>
            <Box>
              <SubHeading>প্রকল্প সমূহের তালিকা</SubHeading>
              <TableContainer>
                <Table aria-label="customized table" size="small">
                  <TableHead sx={{ backgroundColor: '#EFFFFD' }}>
                    <TableRow>
                      <StyledTableCell width="35%" sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <ArrowCircleDownIcon sx={{ color: '#203239', fontSize: '16px' }} />
                          &nbsp;অফিস / প্রকল্পের নাম
                        </span>
                      </StyledTableCell>
                      <StyledTableCell width="25%" sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon sx={{ color: '#D82148', fontSize: '16px' }} />
                          &nbsp;প্রকল্পের অবস্থান
                        </span>
                      </StyledTableCell>
                      <StyledTableCell width="29%" sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <PublishedWithChangesIcon sx={{ color: '#D82148', fontSize: '16px' }} />
                          &nbsp;ওপেন ডেট
                        </span>
                      </StyledTableCell>
                      <StyledTableCell width="32%" sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <AddTaskIcon sx={{ color: '#D82148', fontSize: '16px' }} />
                          &nbsp;দিন শেষ করুন
                        </span>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectInfo
                      ? projectInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                        <StyledTableRow key={i}>
                          <StyledTableCell scope="row">
                            <span style={{ display: 'flex', padding: '10px' }}>
                              {item.projectId ? item.projectNameBangla : item.nameBn}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            <span style={{ display: 'flex', padding: '10px' }}>
                              {item.projectId ? (item.openCloseFlag == true ? 'ওপেন' : '') : ''}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            <span style={{ display: 'flex', padding: '10px' }}>{dateFormat(item.openCloseDate)}</span>
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            <span
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Checkbox
                                checked={item.isChecked}
                                onClick={(e) => {
                                  handleCheckAccepted(item.id, e);
                                }}
                              />
                            </span>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                      : ''}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={projectInfo.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                />
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষন করুন">
          <LoadingButton
            disabled={isLoading}
            loading={isLoading}
            loadingPosition="end"
            variant="contained"
            className="btn btn-save"
            onClick={onSubmitData}
            startIcon={<SaveOutlinedIcon />}
          >
            {' '}
            সংরক্ষন করুন
          </LoadingButton>
        </Tooltip>
      </Grid>
    </>
  );
};

export default DayClose;
