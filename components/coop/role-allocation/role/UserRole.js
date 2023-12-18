import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { GetAllRole, GetAllUser, GetUserRole, PutUserRole, UserRoleCreate } from '../../../../../url/coop/RoleApi';
import RequiredFile from 'components/utils/RequiredFile';

import {
  Avatar,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.dark,
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

const UserRole = () => {
  const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-type': 'DEV',
    },
  };

  const [allUser, setAllUser] = useState({
    userName: '',
    roleName: '',
  });

  const [userInfo, setUserInfo] = useState([]);
  const [roleInfo, setRoleInfo] = useState([]);

  const [flag] = useState(false);
  const [update, setUpdate] = useState(false);

  const [switchActive, setSwitchActive] = useState(false);
  const [userWithRole, setUserWithRole] = useState([]);

  const toggleSwitch = (e) => {
    setSwitchActive(e.target.checked);
  };

  useEffect(() => {
    getuserInfo();
    getroleInfo();
    getUserWithRole();
  }, [flag]);

  const getuserInfo = async () => {
    try {
      const userData = await axios.get(GetAllUser + '?isPagination=false', config);

      setUserInfo(userData.data.data);
    } catch (error) {
      // errorHandler(error);
    }
  };

  const getUserWithRole = async () => {
    try {
      const userWithRoleData = await (await axios.get(GetUserRole, config)).data.data;
      setUserWithRole(userWithRoleData);
    } catch (error) {
      // errorHandler(error);
    }
  };

  const getroleInfo = async () => {
    try {
      const roleData = await axios.get(GetAllRole + '?isPagination=false', config);
      setRoleInfo(roleData.data.data);
    } catch (error) {
      // errorHandler(error);
    }
  };

  const handleChange = (e) => {
    setAllUser({
      ...allUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: parseInt(allUser.userName),
      roleId: parseInt(allUser.roleName),
      status: switchActive == true ? 'A' : 'R',
    };

    try {
      await axios.post(UserRoleCreate, payload, config);
      NotificationManager.success('ইউজারে রোলটি সফলভাবে সংযুক্ত হয়েছে');

      setAllUser({
        userName: '- নির্বাচন করুন -',
        roleName: '- নির্বাচন করুন -',
      });
      setSwitchActive(false);
      getuserInfo();
      getUserWithRole();
    } catch (error) {
      if (error.response) {
        NotificationManager.error('Wrong');
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let onHandleUpdate = (id, userId, roleId, approveStatus) => {
    setUpdate(true);
    setAllUser({
      id: id,
      userName: userId,
      roleName: roleId,
    });
    setSwitchActive(approveStatus == 'A' ? true : false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      userId: allUser.userName,
      roleId: allUser.roleName,
      status: switchActive == true ? 'A' : 'R',
    };

    try {
      await axios.put(PutUserRole + '/' + allUser.id, payload, config);
      NotificationManager.success('ইউজারে রোলটি সফলভাবে হালনাগাদ হয়েছে');

      setAllUser({
        userName: '- নির্বাচন করুন -',
        roleName: '- নির্বাচন করুন -',
      });

      setSwitchActive(false);
      getuserInfo();
      getUserWithRole();
    } catch (error) {
      if (error.response) {
        NotificationManager.error('Wrong');
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  return (
    <>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item sm={12} md={12} xs={12} lg={12} xl={12} xxl={12}>
          <Grid container spacing={1.6} px={2} pt={2}>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={RequiredFile('ইউজার নাম')}
                name="userName"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={allUser.userName}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {userInfo.map((e, index) => {
                  return (
                    <option key={index} value={e.id}>
                      {e.username}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={RequiredFile('রোল নাম')}
                name="roleName"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={allUser.roleName}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {roleInfo.map((e, index) => {
                  return (
                    <option key={index} value={e.id}>
                      {e.roleName}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item md={2} sm={8} xs={12}>
              <FormControlLabel
                control={<Switch checked={switchActive} onChange={toggleSwitch} color="primary" />}
                label={RequiredFile('সক্রিয়/নিষ্ক্রিয়')}
                labelPlacement="start"
                name="isActive"
              />
            </Grid>
            <Grid item md={2} xs={12}>
              {update ? (
                <Tooltip title="হালনাগাদ করুন">
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={handleUpdate}
                    endIcon={<KeyboardDoubleArrowDownIcon />}
                  >
                    হালনাগাদ{' '}
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="সংরক্ষন করুন">
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={handleSubmit}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {' '}
                    সংরক্ষন করুন
                  </Button>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider />

      <Grid container px={1} py={2}>
        <Grid lg={12} md={12} sm={12} xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                <TableRow>
                  <StyledTableCell>ক্রমিক নং</StyledTableCell>
                  <StyledTableCell>ইউজার নাম</StyledTableCell>
                  <StyledTableCell>অফিস পদবী</StyledTableCell>
                  <StyledTableCell>রোল নাম</StyledTableCell>
                  <StyledTableCell>অবস্থা</StyledTableCell>
                  <StyledTableCell>সম্পাদন</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userWithRole.map((data, i) => (
                  <StyledTableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <StyledTableCell component="th" scope="row">
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell>{data.username}</StyledTableCell>
                    <StyledTableCell>{data.designationBn}</StyledTableCell>
                    <StyledTableCell>{data.roleName}</StyledTableCell>
                    <StyledTableCell>
                      {data.status == 'A' ? 'Active' : data.status == 'R' ? 'Inactive' : ''}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Avatar sx={{ backgroundColor: '#4caf50', textAlign: 'center' }}>
                        <Tooltip title="হালনাগাদ করুন">
                          <EditIcon
                            className="btnBg"
                            size="small"
                            sx={{ color: '#fff', cursor: 'pointer' }}
                            onClick={() => onHandleUpdate(data.id, data.userId, data.roleId, data.status)}
                          />
                        </Tooltip>{' '}
                      </Avatar>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default UserRole;
