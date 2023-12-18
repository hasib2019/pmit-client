
/* eslint-disable @next/next/link-passhref */
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BalanceIcon from '@mui/icons-material/Balance';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
// import { makeStyles } from '@mui/styles';
import axios from 'axios';
import star from 'components/utils/coop/star';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { loanProject, pendingList, serviceName } from '../../../../url/ApiList';
import AppTitle from '../../../shared/others/AppTitle';

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

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     marginTop: '50px',
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.secondary,
//   },
//   cardHeading: {
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
// }));

const ApprovalData = () => {
  // const classes = useStyles();
  const router = useRouter();
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
  const [projectName, setProjectName] = useState([]);

  const [setAllSamityData] = useState([]);
  const [filterSamityData, setFilterSamityData] = useState([]);
  const [serviceNames, setServiceName] = useState([]);
  // const [service, setService] = useState([]);
  const [approvalInfo, setApprovalInfo] = useState({
    projectName: '',
    serviceId: '',
  });

  useEffect(() => {
    getServiceName();
    getProject();
    getSamityRegister();
  }, []);
  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      'Project List---', project;
      setProjectName(projectList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getServiceName = async () => {
    try {
      const serviceNameData = await axios.get(serviceName, config);
      //("Service Name---", serviceNameData.data.data);
      setServiceName(serviceNameData.data.data);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const getSamityRegister = async () => {
    try {
      const getSamityRegisterData = await axios.get(pendingList, config);
      'All app data', getSamityRegisterData.data.data;
      setAllSamityData(getSamityRegisterData.data.data);
      setFilterSamityData(getSamityRegisterData.data.data);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getSamityRegisterFromProjectSheba = async (name, value) => {
    let getSamityRegisterData;
    try {
      if (name == 'projectName' && !approvalInfo.serviceId) {
        getSamityRegisterData = await axios.get(pendingList + '?projectId=' + Number(value), config);
      } else if (name == 'serviceId' && approvalInfo.projectName) {
        getSamityRegisterData = await axios.get(
          pendingList + '?projectId=' + Number(approvalInfo.projectName) + '&serviceId=' + Number(value),
          config,
        );
      } else if (name == 'serviceId' && !approvalInfo.projectName) {
        getSamityRegisterData = await axios.get(pendingList + '?serviceId=' + Number(value), config);
      } else if (name == 'projectName' && approvalInfo.serviceId) {
        getSamityRegisterData = await axios.get(
          pendingList + '?projectId=' + Number(value) + '&serviceId=' + Number(approvalInfo.serviceId),
          config,
        );
      }

      //("SamityRegisterData", getSamityRegisterData.data.data);

      // setAllSamityData(getSamityRegisterData.data.data);
      setFilterSamityData(getSamityRegisterData.data.data);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value != 'নির্বাচন করুন') {
      getSamityRegisterFromProjectSheba(name, value);
    }

    setApprovalInfo({
      ...approvalInfo,
      [name]: value,
    });
    // let id = parseInt(e.target.value);
    // let filterData = [];
    // let filterresult = allSamityData.filter((data) => data.serviceId === id);
    // ("new filter data", filterresult);
    // setFilterSamityData([...filterresult]);
  };

  const onGoingPage = (payload) => {
    'Every Payload', payload;
    let base64Data = JSON.stringify({
      id: payload.id,
      serviceId: payload.serviceId,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/approval/approvalData',
      query: {
        data: base64Data,
      },
    });
  };

  return (
    <>
      <Grid container spacing={1.5} px={2} py={1}>
        <Grid item md={6} xs={12} sm={12}>
          <TextField
            fullWidth
            label={star('প্রকল্পের নাম')}
            name="projectName"
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={approvalInfo.projectName}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projectName
              ? projectName.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.projectNameBangla}
                </option>
              ))
              : ' '}
          </TextField>
          {/* {projectId=="নির্বাচন করুন" && <span style={{ color: "red" }}>{formErrors.samityName}</span>} */}
        </Grid>
        <Grid item sm={12} md={6} xs={12}>
          <TextField
            fullWidth
            label={star('সেবাসমূহ')}
            name="serviceId"
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            value={approvalInfo.serviceId}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {serviceNames.map((option) => (
              <option key={option.id} value={option.id}>
                {option.serviceName}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container mt={5}>
        <Grid item lg={12} md={12} xs={12}>
          <AppTitle>
            <Typography variant="h6">সেবাসমূহের তালিকা</Typography>
          </AppTitle>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <Table
            sx={{
              width: { xs: '70%', md: '100%' },
              display: 'block',
              overflowX: 'auto',
            }}
            aria-label="customized table"
            size="small"
          >
            <TableHead sx={{ backgroundColor: '#EFFFFD' }}>
              <TableRow>
                <StyledTableCell width="10%" sx={{ fontWeight: 'bold' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FormatListNumberedIcon sx={{ color: '#B91646', fontSize: '16px' }} />
                    &nbsp;প্রকল্পের নাম
                  </span>
                </StyledTableCell>
                <StyledTableCell width="10%" sx={{ fontWeight: 'bold' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <AccessAlarmIcon sx={{ color: '#00C897', fontSize: '16px' }} />
                    &nbsp;সেবাসমূহ
                  </span>
                </StyledTableCell>

                <StyledTableCell width="10%" sx={{ fontWeight: 'bold' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <DriveFileRenameOutlineIcon sx={{ color: '#D82148', fontSize: '16px' }} />
                    &nbsp;সমিতির নাম
                  </span>
                </StyledTableCell>
                <StyledTableCell width="10%" sx={{ fontWeight: 'bold' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BalanceIcon sx={{ color: '#B33030', fontSize: '16px' }} />
                    &nbsp;বর্ণনা
                  </span>
                </StyledTableCell>
                <StyledTableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <DisplaySettingsIcon sx={{ color: '#B3541E', fontSize: '16px' }} />
                    &nbsp;আবেদনের তারিখ
                  </span>
                </StyledTableCell>
                <StyledTableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <DisplaySettingsIcon sx={{ color: '#B3541E', fontSize: '16px' }} />
                    &nbsp;বিস্তারিত
                  </span>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterSamityData &&
                filterSamityData.length > 0 &&
                filterSamityData.map((item, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell scope="row">
                      {item.projectNameBangla === null ? (
                        <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                      ) : (
                        item.projectNameBangla
                      )}
                    </StyledTableCell>
                    <StyledTableCell scope="row">{item.serviceName}</StyledTableCell>

                    <StyledTableCell scope="row">
                      {item.samityName === null ? (
                        <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                      ) : (
                        item.samityName
                      )}
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {item.description === null ? (
                        <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                      ) : (
                        item.description
                      )}
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {item.applicationDate === null ? (
                        <span style={{ color: '#FC4F4F' }}>বিদ্যমান নেই</span>
                      ) : (
                        item.applicationDate
                      )}
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {
                        <Button className="table-icon view" onClick={() => onGoingPage(item)}>
                          <WysiwygIcon />
                        </Button>
                      }
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </>
  );
};

export default ApprovalData;
