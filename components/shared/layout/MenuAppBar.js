/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2023-02-28 14:55:32
 * @desc [description]
 */
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MoreIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material/';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { userService } from 'service/userService';
import { notifiationData, readNotificationData } from '../../../url/coop/ApiList';

export default function MenuAppBar() {
  const token = localStorageData('token');
  const config = localStorageData('config');
  const ssoToken = localStorageData('ssoToken');
  const getTokenData = tokenData();
  const [totalNotification, setTotalNotification] = useState([]);
  const [countNotification, setCountNotification] = useState(0);
  const componentName = localStorageData('componentName');
  // const mood = process.env.NODE_ENV
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    notificationAllData();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const logOut = () => {
    userService.logout(getTokenData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      sx={{ mt: '45px' }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {getTokenData?.name && (
        <MenuItem>
          <AdminPanelSettingsOutlinedIcon fontSize="small" />
          &nbsp;&nbsp;{getTokenData?.name}
        </MenuItem>
      )}
      {getTokenData?.designationNameBn && (
        <MenuItem>
          <HomeWorkOutlinedIcon fontSize="small" />
          &nbsp;&nbsp;{getTokenData?.designationNameBn}
        </MenuItem>
      )}
      {!ssoToken && (
        <MenuItem onClick={logOut}>
          <LogoutOutlinedIcon fontSize="small" />
          &nbsp;&nbsp;লগ-আউট
        </MenuItem>
      )}
    </Menu>
  );
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>{getTokenData?.designationNameBn ? getTokenData?.designationNameBn : ''}</MenuItem>
      <MenuItem>
        <Link href={{ pathname: '/dashboard/' }} color="inherit" passHref>
          <a href={'/dashboard/'} rel="noopener noreferrer">
            <Tooltip title="হোম">
              <HomeIcon />
            </Tooltip>
            <span
              style={{
                display: 'flex',
                marginTop: '-26px',
                marginLeft: '27px',
              }}
            >
              হোম
            </span>
          </a>
        </Link>
      </MenuItem>
      {componentName == 'coop' && (
        <MenuItem>
          <Link href={{ pathname: '/coop' }} color="inherit" passHref>
            <a href={'/coop'} rel="noopener noreferrer" target="_blank">
              <Tooltip title="সমবায় অধিদপ্তরের ওয়েবসাইট সমূহ">
                <LanguageIcon />
              </Tooltip>
              <span
                style={{
                  display: 'flex',
                  marginTop: '-26px',
                  marginLeft: '27px',
                }}
              >
                ওয়েবসাইট
              </span>
            </a>
          </Link>
        </MenuItem>
      )}

      {!ssoToken && (
        <MenuItem onClick={logOut}>
          <LogoutOutlinedIcon /> লগ-আউট
        </MenuItem>
      )}
    </Menu>
  );

  // notification
  const notificationAllData = async () => {
    try {
      if (token) {
        const response = await axios.get(notifiationData, config);
        const data = response.data.data;
        let sortByDate = data.sort(
          (b, a) => new Date(...a.createdAt.split('/').reverse()) - new Date(...b.createdAt.split('/').reverse()),
        );
        setTotalNotification(sortByDate);
        // readStatus
        const allData = response.data.data;
        const readData = allData.filter((item) => item.readStatus == false);
        setCountNotification(readData.length);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const readNotification = async (id) => {
    try {
      if (id) {
        await axios.get(readNotificationData + id, config);
        notificationAllData();
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const remainingData = (date) => {
    const date1 = new Date(date);
    const date2 = new Date();
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  };
  const isNotioficationOpen = Boolean(anchorElNotification);

  const handleNotificationMenuOpen = (event) => {
    setAnchorElNotification(event.currentTarget);
    notificationAllData();
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const notificationId = 'primary-notification-menu';
  const renderNotification = (
    <Menu
      sx={{ mt: '1rem', maxHeight: { sm: 'unset', md: '500px' } }}
      anchorEl={anchorElNotification}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      id={notificationId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotioficationOpen}
      onClose={handleNotificationClose}
    >
      {totalNotification.map((row, i) => (
        <Box
          key={i}
          sx={{
            borderBottom: '1px solid #ececec',
            maxWidth: { sm: 'unset', md: '400px' },
          }}
        >
          <MenuItem onClick={() => readNotification(row.id)} sx={{ whiteSpace: 'normal' }}>
            {row.content.message}
            {remainingData(row.createdAt) <= 3 && row.readStatus == false ? (
              <FiberNewOutlinedIcon sx={{ position: 'relative', top: '-8px', color: 'blue' }} />
            ) : (
              ''
            )}
          </MenuItem>
          <Box
            component="span"
            sx={{
              display: 'block',
              color: row.readStatus == false ? 'blue' : '',
              marginLeft: '15px',
              fontSize: '11px',
              paddingBottom: '5px',
            }}
          >
            {moment(row.createdAt).fromNow()}
          </Box>
        </Box>
      ))}
    </Menu>
  );

  return (
    <>
      <Box>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <IconButton size="large" color="inherit" className="topbar-icon">
            <Link href={{ pathname: '/dashboard/' }} color="inherit" passHref>
              <a href={'/dashboard/'} rel="noopener noreferrer">
                <Tooltip title="হোম">
                  <HomeIcon />
                </Tooltip>
              </a>
            </Link>
          </IconButton>
          {componentName == 'coop' && (
            <IconButton size="large" color="inherit" className="topbar-icon">
              <Link href={{ pathname: '/coop' }} color="inherit" passHref>
                <a href={'/coop'} rel="noopener noreferrer" target="_blank">
                  <Tooltip title="সমবায় অধিদপ্তরের ওয়েবসাইট সমূহ">
                    <LanguageIcon />
                  </Tooltip>
                </a>
              </Link>
            </IconButton>
          )}

          <IconButton size="large" color="inherit" className="topbar-icon" onClick={handleNotificationMenuOpen}>
            <Badge badgeContent={countNotification} color="error">
              <Tooltip
                title="নোটিশ"
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={notificationId}
                aria-haspopup="true"
                color="inherit"
              >
                <NotificationsIcon />
              </Tooltip>
            </Badge>
          </IconButton>

          {ssoToken && (
            <IconButton size="large" color="inherit" className="topbar-icon">
              <Tooltip title="ড্যাশবোর্ড">
                <app-switcher style={{ position: 'relative', top: '5px' }} />
              </Tooltip>
            </IconButton>
          )}

          <IconButton
            size="small"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            color="inherit"
            onClick={handleProfileMenuOpen}
            className="topbar-icon user"
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <app-switcher />
          <Button onClick={handleMobileMenuOpen} className="topbar-icon">
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Button>
        </Box>
      </Box>
      {renderMobileMenu}
      {renderMenu}
      {renderNotification}
    </>
  );
}
