
// Mehedi
import BallotIcon from '@mui/icons-material/Ballot';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { localStorageData } from 'service/common';
import engToBdNum from 'service/englishToBanglaDigit';
import { errorHandler } from 'service/errorHandler';
import { RoleCreate } from '../../../../../url/ApiList';
import FeatureById from './FeatureById';

const RoleList = ({ updateFunction, roleList }) => {
  const config = localStorageData('config');
  // ("listRole",listRole);
  // const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dataid, setDataid] = useState('');
  const [featuresById, setFeatureById] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  let handleModal = async (id) => {
    try {
      let allFeatureById = await axios.get(RoleCreate + id, config);
      const allFeatureByIdData = allFeatureById.data.data;
      setFeatureById(allFeatureByIdData);
    } catch (error) {
      errorHandler(error);
    }
    id;
    setDataid(id);
    setOpen(true);
  };

  let handleUpdate = (e, id) => {
    updateFunction(id);
  };

  return (
    <>
      <Grid container>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell align="center" sx={{ width: '1%' }}>
                  ক্রমিক
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
                'roleInfoPerRow', data;
                return (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row" align="center">
                      {engToBdNum(i + 1)}
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
                      <Tooltip title="ফিচারের তথ্য">
                        <Button>
                          <BallotIcon className="table-icon view" onClick={() => handleModal(data.id)} />
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="হালনাগাদ করুন">
                        <Button onClick={(e) => handleUpdate(e, data.id)}>
                          <EditIcon className="table-icon edit" />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
          <DialogTitle>ফিচার লিস্ট</DialogTitle>
          <DialogContent dividers>
            <FeatureById id={dataid} allFeatureList={featuresById} status={true} />
          </DialogContent>
        </Dialog>
        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          className="diaModal"
        >
          <Box >
            <SubHeading> ফিচার লিস্ট </SubHeading>

            <FeatureById
              id={dataid}
              allFeatureList={featuresById}
              status={true}
            />

            <HighlightOffIcon
              sx={{
                fontSize: "30px",
                position: "absolute",
                top: "0",
                right: "0",
                cursor: "pointer",
              }}
              onClick={handleClose}
            />
          </Box>
        </Modal> */}
      </Grid>
    </>
  );
};

export default RoleList;
