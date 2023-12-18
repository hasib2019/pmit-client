
// Mehedi
import BallotIcon from '@mui/icons-material/Ballot';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { RoleCreate } from '../../../../url/coop/RoleApi';
import FeatureById from './FeatureById';

const useStyles = makeStyles({
  modalStyle: {
    width: '600px',
    position: 'absolute',
    left: 'calc(50% - 300px)',
    top: '20%',
    border: '0px',
    padding: '1rem',
    background: '#fff',
    outline: 0,
    borderRadius: '.5rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
});
const RoleList = ({ updateFunction, roleList }) => {
  const config = localStorageData('config');
  const [open, setOpen] = useState(false);
  const [dataid, setDataid] = useState('');
  const [featuresById, setFeatureById] = useState([]);
  const style = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  let handleModal = async (id) => {
    try {
      let allFeatureById = await axios.get(RoleCreate + id, config);
      const allFeatureByIdData = allFeatureById.data.data;
      setFeatureById(allFeatureByIdData);
      if (allFeatureByIdData) {
        setDataid(id);
        setOpen(true);
      } else {
        NotificationManager.warning('এই রোল এ কোন ফিচার পাওয়া যায়নি, দয়া করে ফিচার যোগ করুন।', '', 5000);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  let handleUpdate = (e, id, name, description, isActive) => {
    updateFunction(id, name, description, isActive);
  };

  return (
    <>
      <Grid container>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell align="center" sx={{ width: '1%' }}>
                  ক্রমিক নং
                </TableCell>
                <TableCell>রোলের নাম</TableCell>
                <TableCell>বর্ননা</TableCell>
                <TableCell width="1%" align="center">
                  অবস্থা
                </TableCell>
                <TableCell width="1%" align="center">
                  ফিচারসমূহ
                </TableCell>
                <TableCell width="1%" align="center">
                  সম্পাদন
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roleList?.map((data, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row" align="center">
                      {engToBang('' + (i + 1) + '')}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{data.roleName}</div>}>
                        <span className="data">{data.roleName}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{data.description}</div>}>
                        <span className="data">{data.description}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{data.isActive ? 'সচল' : 'সচল নয় '}</TableCell>
                    <TableCell align="center">
                      <Avatar sx={{ margin: '0 auto', background: 'transparent' }}>
                        <Tooltip title="ফিচারের তথ্য">
                          <BallotIcon className="table-icon" onClick={() => handleModal(data.id)} />
                        </Tooltip>
                      </Avatar>
                    </TableCell>
                    <TableCell align="center">
                      <Avatar sx={{ margin: '0 auto', background: 'transparent' }}>
                        <Tooltip title="হালনাগাদ করুন">
                          <Button
                            className="button-edit"
                            onClick={(e) => handleUpdate(e, data.id, data.roleName, data.description, data.isActive)}
                          >
                            <EditIcon className="table-icon edit" />
                          </Button>
                        </Tooltip>
                      </Avatar>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          className="diaModal"
        >
          <Box className={style.modalStyle}>
            <SubHeading> ফিচার লিস্ট </SubHeading>

            <FeatureById id={dataid} allFeatureList={featuresById} status={true} />

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
    </>
  );
};

export default RoleList;
