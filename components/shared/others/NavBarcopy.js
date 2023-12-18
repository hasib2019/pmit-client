/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import TranslateIcon from '@mui/icons-material/Translate';
import { Drawer, Grid, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Clock from 'react-digital-clock';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import iconProvider from 'service/icons';
import { GetFeature } from '../../../url/ApiList';
import Color from './Color';

const useStyles = makeStyles(() => ({
  navBar: {
    zIndex: 100,
    position: 'fixed',
    top: '0',
    left: '0',
  },
  drawer: {
    width: '50%',
  },
  rightMenu: {
    zIndex: '1',
    background: '#707070',
    height: '40px',
    width: '40px',
    position: 'fixed',
    top: '80px',
    left: '97%',
    cursor: 'pointer',
    boxShadow:
      'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
  },
  rOption: {
    zIndex: '1',
    background: '#f4f4f4',
    width: '200px',
    height: '250px',
    padding: '5px',
    position: 'fixed',
    top: '122px',
    right: '0px',
    border: '1px solid #C8C6C6',
    boxShadow:
      'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
  },
}));

const NavBar = () => {
  const router = useRouter();
  const classes = useStyles();
  const [parent, setParent] = useState([]);
  const [rMenu, setRMenu] = useState(false);
  const showRMenu = () => {
    setRMenu(!rMenu);
  };
  // Drawer control section ================
  const [drawerFlag, setDrawerFlag] = useState(false);
  const controlDrawer = () => {
    setDrawerFlag(!drawerFlag);
  };

  // Toggle sections ====================
  // const [checked, setChecked] = useState(false);

  // const handleChange = (event) => {
  //   'Checked', event.target.checked;
  //   setChecked(event.target.checked);
  // };

  // Hidden Menu sections====================
  const [showMenu, setShowMenu] = useState(null);

  const open = Boolean(showMenu);
  const handleClick = (event) => {
    setShowMenu(event.currentTarget);
  };
  const handleClose = () => {
    setShowMenu(null);
  };

  const updatedColor = useSelector((state) => state.ColorSlice.colorBucket);
  //("Update Color",updatedColor)

  useEffect(() => {
    fetchParentFeature();
  }, []);

  const fetchParentFeature = async () => {
    const token = localStorage.getItem('accessToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-type': 'REG',
      },
      params: {
        isRoot: false,
        limit: 100,
        page: 1,
      },
    };

    try {
      let rootFeatures = await axios.get(GetFeature, config);
      'All Features parents', rootFeatures.data.data.data;
      setParent(rootFeatures.data.data.data);
    } catch (error) {
      'Error====>', error.response;
      if (error.response) {
        let message = error.response.data.message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  //("Parent", parent)

  // const showIcon = (id) => {
  //   switch (id) {
  //     case 1:
  //       return <InboxIcon />;

  //     default:
  //       return <MailIcon />;
  //   }
  // };

  const logoutSystem = () => {
    localStorage.clear();
    router.push('/login');
  };

  // const showPage = (id, url) => {
  //     router.push({
  //         pathname: url,
  //         query: { pId: id },
  //     })
  // }

  // const setInSession = (id)=>{
  //     sessionStorage.setItem('parentId', id)
  // }

  return (
    <Box>
      <AppBar className={`${classes.navBar}`} sx={{ backgroundColor: updatedColor }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={controlDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RDCD
          </Typography>

          <Clock />

          <div>
            <Tooltip title="Settings">
              <IconButton onClick={handleClick}>
                <Chip
                  style={{ cursor: 'pointer' }}
                  avatar={<Avatar alt="Mujib" src="/govt1.png" />}
                  label="Hasib"
                  color="primary"
                />
              </IconButton>
            </Tooltip>

            {/*================ For Hidden Menu=========== */}
            <Menu
              anchorEl={showMenu}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 25,
                    height: 25,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={logoutSystem}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <div className={classes.rightMenu} onClick={showRMenu} style={{ backgroundColor: updatedColor }}>
        <MenuIcon sx={{ position: 'relative', top: '5px', left: '7px', color: '#fff' }} />
      </div>
      {rMenu ? (
        <div className={`${classes.rOption} animate__animated animate__fadeInRight animate__faster`}>
          <small style={{ color: '#707070' }}>Choose Color</small>
          <Divider />
          <Grid container spacing={1}>
            {['#3DB2FF', '#1976d2', '#57837B', '#297F87', '#334257'].map((v, i) => (
              <Color color={v} key={i} />
            ))}
          </Grid>
          <Divider sx={{ marginTop: '10px' }} />
          <small style={{ color: '#707070' }}>Choose Language</small>
          <Divider sx={{ marginBottom: '5px' }} />
          {/* <div className="d-flex align-items-center mx-2 px-2" style={{ borderRight: "1px solid #fff" }}>
                <h5 style={{ fontSize: "15px", paddingTop: "5px" }}>B</h5>
                <Tooltip title="Change Language">
                    <Switch color="warning" checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
                </Tooltip>
                <h5 style={{ fontSize: "15px", paddingTop: "5px" }}>E</h5>
            </div> */}
          <div>
            <Chip icon={<TranslateIcon />} size="small" label="Bangla" variant="outlined" />
            <Chip icon={<TranslateIcon />} size="small" label="English" variant="outlined" />
            <Chip icon={<TranslateIcon />} size="small" label="Hindi" variant="outlined" />
            <Chip icon={<TranslateIcon />} size="small" label="Arabic" variant="outlined" />
          </div>
          <Divider sx={{ marginTop: '5px' }} />
          {/* ------------------------------ */}
        </div>
      ) : (
        ''
      )}

      <Drawer anchor="left" open={drawerFlag} onClose={controlDrawer}>
        <div style={{ width: '250px' }} role="presentation" onClick={controlDrawer}>
          <div
            className=""
            style={{
              background: updatedColor,
              padding: '8px 0px 8px 0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* <img
                    src='/mujib.png'
                    width="55px"
                    height="55px"
                /> */}
            <img src="/govt2.png" width="50px" height="50px" />
            <span style={{ color: '#fff', marginLeft: '5px' }}>RDCD</span>
          </div>
          <Divider />

          {/* this area is for parent Feature render */}
          <List>
            {parent.map((val, ind) => (
              // , setId:setInSession(val.id)
              <Link key={ind} href={{ pathname: val.url, query: { pId: val.id } }}>
                <ListItem button>
                  <ListItemIcon>{iconProvider(val.iconId)}</ListItemIcon>
                  <p
                    style={{
                      fontSize: '14px',
                      fontFamily: "'Bangla', sans-serif",
                      margin: '0',
                      padding: '5px',
                    }}
                  >
                    {val.featureNameBan}
                  </p>
                </ListItem>
              </Link>
            ))}
          </List>

          <Divider />
        </div>
      </Drawer>
    </Box>
  );
};

export default NavBar;
