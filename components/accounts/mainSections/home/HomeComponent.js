
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { dateFormat } from 'service/dateFormat';
import { dayOpenCloseRoute } from '../../../../url/AccountsApiLIst';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const HomeComponent = () => {
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  } else {
    token = 'null';
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [projectInfo, setProjectInfo] = useState([]);
  const [officeWiseOpenDates, setOfficeWiseOpenDates] = useState([]);
  'officeWiseOpenDates', officeWiseOpenDates;
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    getProject();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getProject = async () => {
    try {
      let projectData = await axios.get(dayOpenCloseRoute, config);
      const projectDataList = projectData.data.data.projectWiseOpenDates;
      const officeOpenDates = projectData.data.data.officeWiseOpenDates;

      projectDataList.map((val) => {
        val.isChecked = false;
      });
      setOfficeWiseOpenDates(officeOpenDates);
      setProjectInfo(projectDataList);
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

  return (
    <>
      <Paper>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item lg={12} md={12} xs={12}>
            <Box>
              {/* <SubHeading></SubHeading> */}
              <TableContainer>
                <Table aria-label="customized table" size="small">
                  <TableHead sx={{ backgroundColor: '#EFFFFD' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <ArrowCircleDownIcon sx={{ color: '#203239', fontSize: '16px' }} />
                          &nbsp; অফিস / প্রকল্পের নাম
                        </span>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <PublishedWithChangesIcon sx={{ color: '#D82148', fontSize: '16px' }} />
                          &nbsp;ওপেন ডেট
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {officeWiseOpenDates
                      ? officeWiseOpenDates
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item, i) => (
                          <StyledTableRow key={i}>
                            <TableCell scope="row">
                              <span style={{ display: 'flex', padding: '10px' }}>{item.nameBn}</span>
                            </TableCell>
                            <TableCell scope="row">
                              <span style={{ display: 'flex', padding: '10px' }}>
                                {item.openCloseDate ? dateFormat(item.openCloseDate) : ''}
                              </span>
                            </TableCell>
                          </StyledTableRow>
                        ))
                      : ''}
                    {projectInfo
                      ? projectInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                        <StyledTableRow key={i}>
                          <TableCell scope="row">
                            <span style={{ display: 'flex', padding: '10px' }}>{item.projectNameBangla}</span>
                          </TableCell>
                          <TableCell scope="row">
                            <span style={{ display: 'flex', padding: '10px' }}>{dateFormat(item.openCloseDate)}</span>
                          </TableCell>
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
    </>
  );
};

export default HomeComponent;
