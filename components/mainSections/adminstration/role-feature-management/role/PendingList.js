import BallotIcon from '@mui/icons-material/Ballot';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Avatar,
  Box,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { ApproveOrRejectRole, RoleCreate } from '../../../../../url/ApiList';
import FeatureById from './FeatureById';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     color: theme.palette.primary.dark,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

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
    overflow: 'scroll',
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
  // const router = useRouter();
  const config = localStorageData('config');

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
    id;
    setDataid(id);
    setOpen(true);
  };

  // Function Calling Start ////
  let getRoleList = async () => {
    try {
      let roleData = await axios.get(RoleCreate + '?user=0', config);
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
      //("RejectRole", rejectRole.data);
      NotificationManager.success('রোলটি সফলভাবে বাতিল করা হয়েছে');
      getRoleList();
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
      NotificationManager.success('রোলটি সফলভাবে অনুমোদন করা হয়েছে');
      // setFlag(true);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      <Grid container className="section">
        <Grid item xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center" sx={{ width: '5%', minWidth: '60px' }}>
                    ক্রমিক নং
                  </TableCell>
                  <TableCell>রোলের নাম</TableCell>
                  <TableCell>বর্ননা</TableCell>
                  <TableCell>অবস্থান </TableCell>
                  <TableCell align="center">সম্পাদন</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listRole.map((data, i) => (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" align="center">
                      {i + 1}
                    </TableCell>
                    <TableCell>{data.roleName}</TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>
                      {data.approveStatus == 'A' ? 'অনুমোদিত' : data.approveStatus == 'R' ? 'বাতিল' : 'অননুমোদিত'}
                    </TableCell>
                    <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex' }}>
                        <Avatar
                          sx={{
                            marginRight: '5px',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <Tooltip title="ফিচারের তথ্য">
                            <BallotIcon
                              sx={{
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleModal(data.id)}
                            />
                          </Tooltip>
                        </Avatar>

                        <Avatar
                          sx={{
                            marginRight: '5px',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <Tooltip title="বাতিল করুন">
                            <CloseIcon
                              onClick={() => onRejectRole(data.id)}
                              sx={{
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                              }}
                            />
                          </Tooltip>
                        </Avatar>

                        <Avatar
                          sx={{
                            marginRight: '5px',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <Tooltip title="অনুমোদন করুন">
                            <CheckIcon
                              onClick={() => onApproveRole(data.id)}
                              sx={{
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                              }}
                            />
                          </Tooltip>
                        </Avatar>
                      </div>
                    </TableCell>
                  </TableRow>
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
