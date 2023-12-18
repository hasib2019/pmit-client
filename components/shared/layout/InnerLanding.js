/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import axios from 'axios';
import IdleTimerComponent from 'components/IdleTimerComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import iconProvider from 'service/icons';
import { userService } from 'service/userService';
import { masterData } from '../../../url/coop/ApiList';
import Footer from '../others/Footer';
import MenuAppBar from './MenuAppBar';
import Image from 'next/image';

function ResponsiveDrawer(props) {
  const router = useRouter();
  const token = localStorageData('token');
  const officeGeoData = localStorageData('officeGeoData');
  const userData = tokenData();
  const config = localStorageData('config');
  const ssoToken = localStorageData('ssoToken');
  const clientId = localStorageData('clientId');
  ///////////////////////////////////////// Activator menu //////////////////////////////////////
  const [mobileOpen, setMobileOpen] = useState(false);
  const [allMenu, setAllMenu] = useState([]);
  const [doptorInfo, setDoptorInfo] = useState({});
  const [isActive, setIsActive] = useState(false);
  ////////////////////////// new system update /////////////////////////////
  const allMenuLocalStorage = localStorageData('menu');
  const [activeMenuItem, setActiveMenuItem] = useState({
    parent: '',
    child: '',
    subchild: '',
  });
  const [showMenuItem, setShowMenuItem] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsActive(true);
    }
  }, []);

  useEffect(() => {
    userService.switcherFun(ssoToken, clientId);
  }, [ssoToken]);

  useEffect(() => {
    const pathSegments = router.asPath;
    allMenuLocalStorage && dynamicMenuActive(allMenuLocalStorage, pathSegments);
  }, [router.asPath]);

  useEffect(() => {
    setShowMenuItem(menuCount(allMenuLocalStorage) < 10 ? true : false);
    getMenuFromLocalstorage();
    getUserDoptor();
  }, []);

  // ================== Create left menu activation =========//
  const dynamicMenuActive = (allMenuLocalStorage, pathSegments) => {
    let flattenArray;
    const flatten = (data) => {
      return data.reduce((r, { child, ...rest }) => {
        r.push(rest);
        if (child) r.push(...flatten(child));
        return r;
      }, []);
    };
    flattenArray = flatten(allMenuLocalStorage);
    for (let index = 0; index < flattenArray.length; index++) {
      const findChildData = flattenArray.find((item) => item.url == pathSegments);
      if (findChildData) {
        if (findChildData.parentId) {
          setActiveMenuItem({
            ...activeMenuItem,
            parent: findChildData.parentId,
            child: findChildData.id,
            subchild: '',
          });
        } else {
          setActiveMenuItem({
            ...activeMenuItem,
            parent: findChildData.id,
            child: '',
            subchild: '',
          });
        }
        break;
      } else {
        const childOfChild = flattenArray[index]?.childOfChild?.find((item) => item.url == pathSegments);
        if (childOfChild) {
          setActiveMenuItem({
            ...activeMenuItem,
            parent: flattenArray[index].parentId,
            child: childOfChild.parentId,
            subchild: childOfChild.id,
          });
        }
      }
    }
  };

  // ================== menu count start =====================//
  const menuCount = (menuData) => {
    let count = 0;
    menuData?.map((key, i) =>
      menuData[i].child.length === 0
        ? count++
        : menuData[i]?.child?.map((child, ind) =>
          child.type === 'C' ? count++ : menuData[i]?.child[ind]?.childOfChild?.map(() => count++),
        ),
    );
    return count;
  };

  // =================== Set Menu from localstorage ============//
  const getMenuFromLocalstorage = () => {
    let menuItems = JSON?.parse(localStorage.getItem('menu'));
    menuItems = menuItems?.map((e) => ({
      ...e,
      child: e.child.filter((e) => e.position != 'CONT'),
    }));
    setAllMenu(menuItems);
  };

  // =================== Get Doptop Data ======================//
  const getUserDoptor = async () => {
    try {
      if (token) {
        const doptorInfoData = await axios.get(masterData + 'userDoptorInfo', config);
        setDoptorInfo(doptorInfoData.data.data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  // =================== Dower handler ======================//
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setIsActive(!isActive);
  };

  // ============== click to child menu expant  ===============//
  const handleClick = (pid) => {
    setActiveMenuItem({
      ...activeMenuItem,
      parent: activeMenuItem.parent == pid ? '' : pid,
      child: '',
      subchild: '',
    });
  };
  // ============= click to sub child menu expant  =============//
  const handleClickSubChild = (parent, subChild) => {
    setActiveMenuItem({
      ...activeMenuItem,
      parent: parent,
      child: activeMenuItem.child == subChild ? '' : subChild,
      subchild: '',
    });
  };
  //==================== menu =============================//
  const drawer = (
    <List className="side-nav">
      {allMenu?.map((key, i) => (
        <>
          {allMenu[i].child.length === 0 ? (
            <Link key={i} href={{ pathname: key.url }} color="inherit" passHref>
              <div
                className={activeMenuItem.parent == key.id ? 'nav-item-active nav-item-wrapper' : 'nav-item-wrapper'}
              >
                <a href={key.url} rel="noopener noreferrer">
                  <ListItemButton className="nav-item">
                    <ListItemIcon className="nav-item-icon">{iconProvider(key.iconId)}</ListItemIcon>
                    <ListItemText className="nav-item-text" primary={key.featureNameBan} />
                  </ListItemButton>
                </a>
              </div>
            </Link>
          ) : (
            <div className={activeMenuItem.parent == key.id ? 'nav-item-wrapper nav-item-expand' : 'nav-item-wrapper'}>
              <ListItemButton onClick={(e) => handleClick(key.id, e)} className="nav-item">
                <ListItemIcon className="nav-item-icon"> {iconProvider(key.iconId)} </ListItemIcon>
                <ListItemText className="nav-item-text" primary={key.featureNameBan} />
                <div className="dropdown-arrow">
                  {showMenuItem ? '' : activeMenuItem.parent == key.id ? <ExpandLess /> : <ExpandMore />}
                </div>
              </ListItemButton>
              <Collapse
                in={activeMenuItem.parent == key.id || showMenuItem ? true : false}
                timeout="auto"
                unmountOnExit
                style={{
                  borderRadius: '10px 0 0 10px',
                  background: '',
                }}
              >
                {/* child  */}
                {allMenu[i]?.child?.map((child, ind) => (
                  <>
                    {child.type === 'C' ? (
                      <>
                        {child.position === 'SIDE' && (
                          <Link key={ind} href={{ pathname: child.url }} passHref>
                            <div
                              className={
                                activeMenuItem.child == child.id
                                  ? 'nav-item-wrapper nav-item-active'
                                  : 'nav-item-wrapper'
                              }
                            >
                              <a href={child.url} rel="noopener noreferrer">
                                <ListItemButton
                                  className="nav-item"
                                  style={{
                                    background: activeMenuItem.child == child.id ? '#c2ddff' : '',
                                  }}
                                >
                                  <ListItemIcon className="nav-item-icon">{iconProvider(child.iconId)}</ListItemIcon>
                                  <ListItemText className="nav-item-text" primary={child.featureNameBan} />
                                </ListItemButton>
                              </a>
                            </div>
                          </Link>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="nav-item-wrapper">
                          <ListItemButton
                            key={ind}
                            onClick={(e) => handleClickSubChild(key.id, child.id, e)}
                            className="nav-item"
                          >
                            <ListItemIcon className="nav-item-icon">{iconProvider(child.iconId)}</ListItemIcon>
                            <ListItemText className="nav-item-text" primary={child.featureNameBan} />
                            <div className="dropdown-arrow">
                              {showMenuItem ? '' : activeMenuItem.child == child.id ? <ExpandLess /> : <ExpandMore />}
                            </div>
                          </ListItemButton>
                          <Collapse
                            in={activeMenuItem.child == child.id || showMenuItem ? true : false}
                            timeout="auto"
                            unmountOnExit
                            style={{
                              background: '#fff',
                            }}
                          >
                            {/* sub child  */}
                            {allMenu[i]?.child[ind]?.childOfChild?.map((subchild, index) => (
                              <div className="nav-item-wrapper" key={index}>
                                <Link key={index} href={{ pathname: subchild.url }} passHref>
                                  <div>
                                    <a href={subchild.url} rel="noopener noreferrer">
                                      <List component="div" disablePadding key={index}>
                                        <ListItemButton
                                          className="nav-item"
                                          style={{
                                            background: activeMenuItem.subchild == subchild.id ? '#c2ddff' : '',
                                          }}
                                        >
                                          <ListItemIcon className="nav-item-icon">
                                            {iconProvider(subchild.iconId)}
                                          </ListItemIcon>
                                          <ListItemText className="nav-item-text" primary={subchild.featureNameBan} />
                                        </ListItemButton>
                                      </List>
                                    </a>
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </Collapse>
                        </div>
                      </>
                    )}
                  </>
                ))}
              </Collapse>
            </div>
          )}
        </>
      ))}
    </List>
  );
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        background: '#FBFDFF',
        backgroundPosition: 'right',
        backgroundRepeat: 'repeat',
        height: '100%',
        width: '100%',
        minHeight: '91vh',
      }}
    > <IdleTimerComponent />
      <Box>
        <AppBar
          position="fixed"
          sx={{
            zIndex: '1201',
            background: 'var(--color-bg-topbar)',
            boxShadow: '0 0 5px -1px rgba(0,0,0,0.4)',
          }}
        >
          <Grid
            sx={{
              height: '52px',
              alignItems: 'center',
              display: 'flex',
              padding: '0 15px',
            }}
          >
            <Grid sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className="topbar-icon"
              >
                <MenuIcon />
              </IconButton>
              {/* top left logo  */}
              <Box className="logo">
                <Image src="/top-logo/topDoptor3.png" alt="Logo" width={220} height={45} />
              </Box>

              <Box
                sx={{
                  margin: '0 0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Typography className="doptorname" sx={{ display: { xs: 'none', md: 'flex', fontSize: '14px' } }}>
                    {userData?.type == 'user' && 'কো-অপারেটিভ সোসাইটি ম্যানেজমেন্ট সিস্টেম'}
                  </Typography>

                  <Typography className="doptorname" sx={{ display: { xs: 'none', md: 'flex', fontSize: '12px' } }}>
                    {userData?.type == 'user' ? officeGeoData?.nameBn : doptorInfo?.nameBn}
                  </Typography>
                </div>

                <MenuAppBar notification={9} message={1} />
              </Box>
            </Grid>
          </Grid>
        </AppBar>
        <div style={{ paddingTop: '50px', display: 'flex', overflow: 'hidden' }}>
          <div className={isActive ? 'drawerClass drawer' : 'drawer'}>{drawer}</div>
          <Grid
            item
            flexGrow={1}
            sx={{
              transition: 'all .3s ease !important',
              padding: '1rem',
              width: '100%',
              height: 'calc(95vh - 56px)',
              overflowY: 'auto',
            }}
          >
            {props.children}
          </Grid>
        </div>
      </Box>
      <Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
