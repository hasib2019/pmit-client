import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { dayOpenCloseRoute } from '../../../../../url/ApiList';
import SubHeading from 'components/shared/others/SubHeading';

const DayClose = () => {
  const config = localStorageData('config');

  const [projectInfo, setProjectInfo] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    getProject();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCheckAccepted = (id) => {
    let data = projectInfo;
    const item = data.find((d) => d.projectId === id);
    const selectedArray = [...selectedData];
    let filteredArray;
    if (item.isChecked) {
      item.isChecked = false;
      filteredArray = selectedArray.filter((d) => d.projectId != id);
      setSelectedData(filteredArray);
    } else {
      item.isChecked = true;
      selectedArray.push({ projectId: item.projectId });
      setSelectedData(selectedArray);
    }
    setProjectInfo(data);
  };

  const getProject = async () => {
    try {
      let projectData = await axios.get(dayOpenCloseRoute, config);
      const projectDataList = projectData.data.data;
      projectDataList.map((val) => {
        val.isChecked = false;
      });
      setProjectInfo(projectDataList);
    } catch (error) {
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
    if (selectedData.length > 0) {
      let payload;
      payload = selectedData;
      try {
        const assignProject = await axios.post(dayOpenCloseRoute, payload, config);
        NotificationManager.success(assignProject.data.message, '', 5000);
        setSelectedData([]);
        getProject();
      } catch (error) {
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
      <Grid container>
        <Grid item lg={12} md={12} xs={12}>
          <Box>
            <SubHeading>প্রকল্প সমূহের তালিকা</SubHeading>

            <TableContainer className="table-container">
              <Table aria-label="customized table" size="small">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>প্রকল্পের নাম</TableCell>
                    <TableCell>প্রকল্পের অবস্থান</TableCell>
                    <TableCell>ওপেন ডেট</TableCell>
                    <TableCell>দিন শেষ করুন</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectInfo
                    ? projectInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell scope="row">{item.projectNameBangla}</TableCell>
                        <TableCell scope="row">{item.openCloseFlag == true ? 'ওপেন' : ''}</TableCell>
                        <TableCell scope="row">{dateFormat(item.openCloseDate)}</TableCell>
                        <TableCell scope="row">
                          <Checkbox
                            checked={item.isChecked}
                            onClick={(e) => {
                              handleCheckAccepted(item.projectId, e);
                            }}
                          />
                        </TableCell>
                      </TableRow>
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
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {' '}
            সংরক্ষণ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default DayClose;
