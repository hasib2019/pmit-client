/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2023-02-27 11:43:31
 * @desc [description]
 */

import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import ApproveSamityReport from 'components/shared/common/ApproveSamityReport';
import TempSamityReport from 'components/shared/common/TempSamityReport';
import Title from 'components/shared/others/Title';
import EditComponent from 'components/utils/coop/EditComponentList';
import React, { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import { dashboardSamityInfo, samitySubscribe } from '../../../url/coop/ApiList';
import Audit from './Audit';
import CDFLine from './CdfLine';
import OtherInfo from './OtherInfo';
import ProfitCurve from './ProfitCurve';
import ReturnInfo from './ReturnInfo';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Dashboard = () => {
  const config = localStorageData('config');
  const reportsIdPer = localStorageData('reportsIdPer');
  const samityLocalInfo = localStorageData('samityInfo');
  ///////////////////////////////////////////////////////
  const userData = tokenData();
  // const [isPending, setIsPending] = useState(true);
  const [isSubscribe, setIsSubscribe] = useState();
  const [samityInfoData, setSamityInfoData] = useState([]);
  const [selectSamityInfo, setSelectSamityInfo] = useState({
    flag: '',
    id: '',
    role: '',
    samityLevel: '',
    samityName: '',
  });

  useEffect(() => {
    getSamityInfo();
  }, []);

  const getSamityInfo = async () => {
    try {
      const data = await axios.get(dashboardSamityInfo, config);
      const maindata = data.data.data;
      const samityData = maindata.filter(
        (row) =>
          (row.flag == 'approved' && row.role == 'authorizer') || (row.flag == 'temp' && row.role == 'organizer'),
      );
      if (samityData.length > 0) {
        setSamityInfoData(samityData);
        setSelectSamityInfo({
          ...selectSamityInfo,
          flag: samityData[0]?.flag,
          id: samityData[0]?.id,
          role: samityData[0]?.role,
          samityLevel: samityData[0]?.samityLevel,
          samityName: samityData[0]?.samityName,
        });

        getSubscribeData(samityData[0]?.id);
        if (samityLocalInfo == null) {
          localStorage.setItem('samityInfo', JSON.stringify(samityData[0]));
        }
        const reportsId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('reportsId')) : null;
        const reportsIdPer = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('reportsIdPer')) : null;

        if (samityData?.length != 0) {
          if (reportsId == null) {
            if (samityData[0]?.flag == 'temp') {
              localStorage.setItem('reportsId', JSON.stringify(samityData[0]?.id));
            }
            localStorage.setItem('status', JSON.stringify(samityData[0]?.flag == 'approved' ? 'A' : 'P'));
            localStorage.setItem('approvedSamityLevel', JSON.stringify(samityData[0]?.samityLevel));
          }
          if (reportsIdPer == null) {
            localStorage.setItem('reportsIdPer', JSON.stringify(samityData[0]?.id));
            localStorage.setItem('status', JSON.stringify(samityData[0]?.flag == 'approved' ? 'A' : 'P'));
            localStorage.setItem('approvedSamityLevel', JSON.stringify(samityData[0]?.samityLevel));
          }
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const samitySetupNew = (e) => {
    let obj = samityInfoData.find((elements) => elements.id == e.target.value);
    setSelectSamityInfo({
      ...selectSamityInfo,
      flag: obj.flag,
      id: obj.id,
      role: obj.role,
      samityLevel: obj.samityLevel,
      samityName: obj.samityName,
    });
    localStorage.setItem('samityInfo', JSON.stringify(obj));
    if (obj.flag == 'approved') {
      localStorage.setItem('reportsIdPer', JSON.stringify(obj.id));
      localStorage.setItem('status', JSON.stringify('A'));
    } else {
      localStorage.setItem('reportsId', JSON.stringify(obj.id));
      localStorage.setItem('status', JSON.stringify('P'));
    }
    localStorage.setItem('approvedSamityLevel', JSON.stringify(obj.samityLevel));
    localStorage.setItem('isManual', JSON.stringify(obj.isManual));
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /////////////////////////////////////////////////// menu end ////////////////////////////////////////////////
  /////////////////////////////////////////////////////subscription start ////////////////////////////////////
  const getSubscribeData = async (samityId) => {
    try {
      if (samityId != undefined) {
        const subscribeData = await axios.get(samitySubscribe + samityId, config);
        // setIsPending(true);
        setIsSubscribe(subscribeData.data.data.subscribe);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const subScribe = async (reportsIdPer) => {
    const body = {
      samityId: reportsIdPer,
      subscribe: isSubscribe == false ? true : false,
    };
    const updateSubscribe = await axios.put(samitySubscribe, body, config);
    getSubscribeData(reportsIdPer);
    NotificationManager.success(updateSubscribe.data.message, '', 5000);
  };
  /////////////////////////////////////////////////////subscription end ////////////////////////////////////////

  const onLink = () => {
    window.open('/coop/web-portal', '_blank');
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  return (
    <>
      <Box>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sx={{ display: 'flex', gap: '1rem' }}>
            {samityInfoData.length > 0 && (
              <Fragment>
                <TextField
                  fullWidth
                  name=""
                  onChange={samitySetupNew}
                  select
                  SelectProps={{ native: true }}
                  value={samityLocalInfo?.id}
                  variant="outlined"
                  size="small"
                  sx={{ background: 'white' }}
                >
                  {samityInfoData?.map((option, i) => (
                    <option key={i} value={option.id}>
                      {option.samityName} -{' '}
                      {option.flag == 'approved'
                        ? option.samityLevel == 'P'
                          ? 'অনুমোদিত প্রাথমিক সমিতি'
                          : option.samityLevel == 'C'
                          ? 'অনুমোদিত কেন্দ্রীয় সমিতি'
                          : option.samityLevel == 'N'
                          ? 'অনুমোদিত জাতীয় সমিতি'
                          : ''
                        : option.samityLevel == 'P'
                        ? 'প্রক্রিয়াধীন প্রাথমিক সমিতি'
                        : option.samityLevel == 'C'
                        ? 'প্রক্রিয়াধীন কেন্দ্রীয় সমিতি'
                        : option.samityLevel == 'N'
                        ? 'প্রক্রিয়াধীন জাতীয় সমিতি'
                        : ''}{' '}
                      {option.isManual ? '( অনলাইনকরন সমিতি )' : '( নিবন্ধিত সমিতি )'}
                    </option>
                  ))}
                </TextField>
                <Grid>
                  <Button className="btn btn-primary" startIcon={<DescriptionIcon />} onClick={handleOpenModal}>
                    সমিতির বিস্তারিত তথ্য
                  </Button>
                  <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{ overflowY: 'auto' }}
                  >
                    {selectSamityInfo?.flag == 'approved' ? (
                      <ApproveSamityReport {...{ approvedSamityId: selectSamityInfo?.id }} />
                    ) : (
                      <TempSamityReport {...{ pendingSamityId: selectSamityInfo?.id }} />
                    )}
                  </Modal>
                </Grid>
              </Fragment>
            )}
            <Grid>
              {selectSamityInfo?.flag ? (
                <>
                  <Button className="btn btn-primary" startIcon={<LanguageIcon />} onClick={onLink}>
                    ওয়েব সাইট
                  </Button>
                </>
              ) : (
                ''
              )}
            </Grid>
            <Grid>
              {selectSamityInfo?.flag == 'approved' ? (
                isSubscribe ? (
                  <>
                    <Grid item sx={{ display: 'flex', gap: '.4rem' }}>
                      <Button className="btn btn-subscribed" onClick={() => subScribe(selectSamityInfo?.id)}>
                        SUBSCRIBED
                      </Button>
                      <NotificationsNoneOutlinedIcon
                        id="demo-positioned-button"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ fontSize: '28px', mt: '3px' }}
                      />
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                      >
                        <MenuItem>
                          <NotificationsActiveIcon /> ALL
                        </MenuItem>
                        <MenuItem>
                          <NotificationsNoneIcon /> Personalized
                        </MenuItem>
                        <MenuItem>
                          <NotificationsOffIcon /> None
                        </MenuItem>
                      </Menu>
                    </Grid>
                    <Grid item></Grid>
                  </>
                ) : (
                  <Grid item>
                    <Button className="btn btn-subscribe" onClick={() => subScribe(reportsIdPer)}>
                      SUBSCRIBE
                    </Button>
                  </Grid>
                )
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {userData?.isAuthorizedPerson ? (
        <Box>
          <Grid container spacing={2.5} my={1}>
            <Grid item lg={4} xs={12}>
              <Audit />
            </Grid>
            <Grid item lg={4} xs={12}>
              <ReturnInfo />
            </Grid>

            <Grid item lg={4} xs={12}>
              <OtherInfo />
            </Grid>
          </Grid>
          <Grid container spacing={2.5} my={1}>
            <Grid item lg={6} xs={12}>
              <CDFLine />
            </Grid>
            <Grid item lg={6} xs={12}>
              <ProfitCurve />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box component="main" sx={{ flexGrow: 1, pt: 1 }} xs={12}>
          <Grid item lg={12} md={12} xs={12}>
            <Grid container spacing={2.5} mb={1}>
              <Grid item lg={12} md={12} xs={12}>
                <Paper sx={{ p: { xs: 1, md: 1 } }} rounded="true">
                  <Title>
                    <Stack direction="row">
                      <Typography variant="h5">{userData ? userData.nameBangla : ''}</Typography>
                    </Stack>
                  </Title>
                  <Grid container spacing={1} px={3}>
                    <TableContainer px={2}>
                      <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell sx={{ fontWeight: 'bold' }}>
                              জাতীয় পরিচয়পত্র নাম্বারঃ {numberToWord('' + userData?.nid + '')}
                            </StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold' }}>
                              মোবাইল নাম্বারঃ {numberToWord('' + userData?.mobile + '')}
                            </StyledTableCell>
                          </TableRow>
                          <TableRow>
                            <StyledTableCell sx={{ fontWeight: 'bold' }}>
                              জন্ম তারিখঃ {numberToWord('' + dateFormat(userData?.dob) + '')}
                            </StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold' }}>ই-মেইলঃ {userData?.email}</StyledTableCell>
                          </TableRow>
                        </TableHead>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
      <EditComponent />
    </>
  );
};

export default Dashboard;
