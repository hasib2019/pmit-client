// Mehedi
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RoleCreate } from '../../../../../url/coop/RoleApi';
import FeatureById from './FeatureById';
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
import BallotIcon from '@mui/icons-material/Ballot';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { errorHandler } from 'service/errorHandler';
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
const RoleList = () => {
  const router = useRouter();

  const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;

  const [listRole, setListRole] = useState([]);

  const [open, setOpen] = useState(false);
  const [dataid, setDataid] = useState('');

  useEffect(() => {
    getRoleList();
  }, []);

  const style = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  let handleModal = async (id) => {
    setDataid(id);
    setOpen(true);
  };

  let getRoleList = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-type': 'DEV',
      },
      params: { approveStatus: 'A' },
    };

    try {
      let roleData = await axios.get(RoleCreate + '?isPagination=false', config);
      let resData = roleData.data.data;
      setListRole(resData);
    } catch (error) {
      errorHandler(error);
    }
  };

  let handleUpdate = (e, id) => {
    e.preventDefault();
    router.push({
      pathname: '/role-allocation/role/update',
      query: { id: id },
    });
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
                  <StyledTableCell>ফিচারসমূহ</StyledTableCell>
                  <StyledTableCell>অবস্থা</StyledTableCell>
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
                      <Avatar sx={{ backgroundColor: '#C500FA' }}>
                        <Tooltip title="ফিচারের তথ্য">
                          <BallotIcon
                            className="btnBg"
                            sx={{ color: '#fff', cursor: 'pointer' }}
                            onClick={() => handleModal(data.id)}
                          />
                        </Tooltip>
                      </Avatar>
                    </StyledTableCell>
                    <StyledTableCell>{data.approveStatus === 'A' ? 'Active' : 'Inactive'}</StyledTableCell>
                    <StyledTableCell>
                      <Avatar
                        sx={{
                          marginBottom: '10px',
                          backgroundColor: '#4caf50',
                        }}
                      >
                        <Tooltip title="হালনাগাদ করুন">
                          <EditIcon
                            className="btnBg"
                            size="small"
                            sx={{ color: '#fff', cursor: 'pointer' }}
                            onClick={(e) => handleUpdate(e, data.id)}
                          />
                        </Tooltip>{' '}
                      </Avatar>
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

export default RoleList;
