// Mehedi
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { ApproveOrRejectRole, RoleCreate } from '../../../../../url/coop/RoleApi';
import FeatureById from './FeatureById';

import BallotIcon from '@mui/icons-material/Ballot';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Avatar,
  Box,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { errorHandler } from 'service/errorHandler';

import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { localStorageData } from 'service/common';
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

const useStyles = makeStyles({
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 300,
    backgroundColor: '#eee',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
  },

  cardStyle: {
    margin: '0px 0px 10px 0px',
  },
  cardShadow: {
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 60px 40px -7px;',
    borderRadius: '10px',
  },
  cardContentStyle: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cardText: {
    // margin: '0px 20px 20px 0px',
    width: '220px',
    marginRight: '10px',
    marginBottom: '5px',
  },

  cardBtn: {
    display: 'flex',
    justifyContent: 'center',
  },
  cardSelectText: {
    width: '220px',
    marginRight: '10px',
    marginBottom: '5px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    // minHeight: "80px",
    // fontSize: "18px",
    // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
  },

  cardPaperStyle: {
    padding: '10px 0px',
    display: 'flex',
  },

  cardNewStyle: {
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    // minWidth: "260px",
    // minHeight: "280px",
    marginRight: '1px',
  },

  contentStyle: {
    padding: '10px 20px',
    borderRadius: '20px 20px 0px 0px',
    marginTop: '-15px',
    boxShadow:
      'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px',
  },
  listCardStyle: {
    minHeight: '50px',
    // marginBottom: '10px'
  },

  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
  },
});
const PendingList = () => {
  const token = localStorageData('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-type': 'DEV',
    },
    params: { approveStatus: 'P' },
  };
  const [listRole, setListRole] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataid, setDataid] = useState('');
  // const [flag, setFlag] = useState(false);

  // Use Effect call for initial Rendering Start /////
  useEffect(() => {
    getRoleList();
  }, []);

  // Use Effect call for initial Rendering End /////

  const style = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  let handleModal = async (id) => {
    setDataid(id);
    setOpen(true);
  };

  // Function Calling Start ////
  let getRoleList = async () => {
    try {
      let roleData = await axios.get(RoleCreate, config);
      let resData = roleData.data.data;
      setListRole(resData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const onRejectRole = async (id) => {
    let obj = {
      approveStatus: 'R',
    };
    try {
      let url = ApproveOrRejectRole + id;
      await axios.put(url, obj, config);
      getRoleList();
      NotificationManager.success('Approve Successfull', '', 5000);
      // setFlag(true);
    } catch (error) {
      errorHandler(error);
    }
  };

  const onApproveRole = async (id) => {
    let obj = {
      approveStatus: 'A',
    };
    try {
      let url = ApproveOrRejectRole + id;
      await axios.put(url, obj, config);
      getRoleList();
      NotificationManager.success('Approve Successfull', '', 5000);
      // setFlag(true);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      <Grid container px={1} py={1}>
        <Grid item xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
                <TableRow>
                  <StyledTableCell>ক্রমিক নং</StyledTableCell>
                  <StyledTableCell>রোল নাম</StyledTableCell>
                  <StyledTableCell>বর্ননা</StyledTableCell>
                  <StyledTableCell>সম্পাদন</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listRole.map((data, i) => (
                  <StyledTableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <StyledTableCell component="th" scope="row">
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell>{data.roleName}</StyledTableCell>
                    <StyledTableCell>{data.description}</StyledTableCell>
                    <StyledTableCell>
                      <div style={{ display: 'flex' }}>
                        <Avatar
                          sx={{
                            marginRight: '5px',
                            backgroundColor: '#C500FA',
                          }}
                        >
                          <Tooltip title="ফিচারের তথ্য">
                            <BallotIcon
                              className="btnBg"
                              sx={{ color: '#fff', cursor: 'pointer' }}
                              onClick={() => handleModal(data.id)}
                            />
                          </Tooltip>
                        </Avatar>

                        <Avatar
                          sx={{
                            marginRight: '5px',
                            backgroundColor: '#ff9800',
                          }}
                        >
                          <Tooltip title="বাতিল করুন">
                            <CloseIcon
                              className="btnBg"
                              onClick={() => onRejectRole(data.id)}
                              sx={{ color: '#fff', cursor: 'pointer' }}
                            />
                          </Tooltip>
                        </Avatar>

                        <Avatar
                          sx={{
                            marginRight: '5px',
                            backgroundColor: '#0000FF',
                          }}
                        >
                          <Tooltip title="অনুমোদন করুন">
                            <CheckCircleIcon
                              className="btnBg"
                              onClick={() => onApproveRole(data.id)}
                              sx={{ color: '#fff', cursor: 'pointer' }}
                            />
                          </Tooltip>
                        </Avatar>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box className={style.modalStyle}>
              <h2
                id="parent-modal-title"
                style={{
                  textAlign: 'center',
                  fontSize: '30px',
                  fontWeight: 'bold',
                }}
              >
                {' '}
                ফিচার লিস্ট
              </h2>
              <FeatureById id={dataid} status={true} />

              <HighlightOffIcon
                sx={{
                  fontSize: '30px',
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  cursor: 'pointer',
                }}
                onClick={handleClose}
              />
            </Box>
          </Modal>
        </Grid>
      </Grid>
    </>
  );
};

export default PendingList;
