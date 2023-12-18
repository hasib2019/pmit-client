/* eslint-disable @next/next/no-img-element */
////////////////////////////////Modified by Md.Hasibuzzaman/////////////////////////////////////////
import AccountCircle from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material/';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { errorHandler } from 'service/errorHandler';
import { inputRadioGroup } from 'service/fromInput';
import { LoanLoginAPI } from '../../../url/ApiList';
import { globalCitizenLogin } from '../../../url/LoginApiList';
import star from '../../mainSections/loan-management/loan-application/utils';

function Copyright() {
  return (
    <Grid item lg={12} md={12} xs={12} mt={3}>
      <Typography sx={{ fontSize: '13px', textAlign: 'center' }}>
        <img src="/main-logo.png" alt="Logo" width={130} height={25} />
        <br />
        {'Copyright © '} {new Date().getFullYear()} {'ERA-InfoTech Ltd & Orangebd Ltd.'}
      </Typography>
    </Grid>
  );
}
const componentNameArray = [
  {
    nameBn: 'কোপ',
    value: 'coop',
  },
  {
    nameBn: 'অ্যাকাউন্ট',
    value: 'accounts',
  },
  {
    nameBn: 'লোন',
    value: 'loan',
  },
  {
    nameBn: 'ইনভেন্টরী',
    value: 'inventory',
  },
  {
    nameBn: 'গাড়িঘোড়া',
    value: 'vehicle',
  },
  {
    nameBn: 'প্রোজেক্ট',
    value: 'project',
  },
];

const Login = () => {
  const samityLevelStatus = false;

  useEffect(() => {
    localStorage.clear('');
    deleteCookie('token');
    deleteCookie('type');
  }, []);

  const router = useRouter();
  const theme = createTheme();
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  let [userLogin, setUserLogin] = useState({
    username: '',
    password: '',
    componentName: '',
    isAdmin: '',
  });
  const handleChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let payload = {
      username: userLogin.username,
      password: userLogin.password,
    };
    let citizenPayload = {
      email: userLogin.username,
      password: userLogin.password,
    };

    if (userLogin.componentName == 'coop' && userLogin.isAdmin == 1) {
      if (userLogin.isAdmin == 1) {
        try {
          const loginUser = await axios.post(globalCitizenLogin, citizenPayload);
          const getMenuData = loginUser.data.data.menu;
          const token = loginUser.data.data.accessToken;

          localStorage.setItem('menu', JSON.stringify(getMenuData));
          localStorage.setItem('token', JSON.stringify(token));
          localStorage.setItem('stepId', JSON.stringify(0));
          localStorage.setItem('componentName', userLogin.componentName);

          setCookie('token', token);
          setCookie('type', 'citizen');
          router.push('/dashboard');
          setLoadingDataSaveUpdate(false);
        } catch (error) {
          setLoadingDataSaveUpdate(false);
          errorHandler(error);
        }
      } else {
        setLoadingDataSaveUpdate(false);
        NotificationManager.error('select citizen or user', '', 5000);
      }
    } else {
      try {
        const loginUser = await axios.post(LoanLoginAPI + '/' + userLogin.componentName, payload);

        const token = loginUser.data.data.accessToken;
        const officeGeoData = loginUser.data.data.geoCode;
        const menu = loginUser.data.data.menu;

        localStorage.setItem('accessToken', token);
        localStorage.setItem('menu', JSON.stringify(menu));
        localStorage.setItem('componentName', userLogin.componentName);
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('officeGeoData', JSON.stringify(officeGeoData));
        // set cookies
        setCookie('token', token);
        setCookie('type', 'user');

        if (loginUser.status == 200) {
          router.push('/dashboard');
        }
        setUserLogin({
          username: '',
          password: '',
        });
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#fedcac',
          backgroundImage: "url('/bg.jpg')",
          backgroundPosition: 'right',
          backgroundRepeat: 'repeat',
          height: '100%',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                পল্লী উন্নয়ন ও সমবায় বিভাগ
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>

        <Grid container component="main">
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={8}
            sx={{
              backgroundImage: 'url(/govt2.png)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
              backgroundSize: '60%',
              backgroundPosition: 'center',
              opacity: '100%',
            }}
          />
          <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 1,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 550,
              }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                সাইন ইন
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  autoComplete="off"
                  name="username"
                  label="ইউজার নাম"
                  size="small"
                  value={userLogin.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  autoComplete="off"
                  required
                  fullWidth
                  value={userLogin.password}
                  name="password"
                  label="পাসওয়ার্ড"
                  type="password"
                  id="password"
                  size="small"
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label={star('কম্পোনেন্টের নাম')}
                  name="componentName"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={userLogin.componentName || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  {componentNameArray?.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.nameBn}
                    </option>
                  ))}
                </TextField>
                {userLogin.componentName == 'coop'
                  ? inputRadioGroup(
                    'isAdmin',
                    handleChange,
                    userLogin.isAdmin,
                    [
                      {
                        value: '1',
                        color: '#007bff',
                        rcolor: 'primary',
                        label: 'ব্যবহারকারী',
                      },
                      {
                        value: '2',
                        color: '#ed6c02',
                        rColor: 'warning',
                        label: 'অ্যাডমিন',
                      },
                    ],
                    12,
                    12,
                    12,
                    12,
                    samityLevelStatus,
                  )
                  : ''}
                {loadingDataSaveUpdate ? (
                  <LoadingButton
                    loading
                    fullWidth
                    loadingPosition="start"
                    startIcon={<LoginIcon />}
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {'প্রবেশ করার জন্য আপেক্ষা করুন.........'}
                  </LoadingButton>
                ) : (
                  <Tooltip title={'প্রবেশ করুন'}>
                    <Button fullWidth className="btn btn-save" onClick={handleSubmit} sx={{ mt: 3, mb: 2 }}>
                      <LoginIcon sx={{ display: 'block' }} />
                      {'প্রবেশ করুন'}
                    </Button>
                  </Tooltip>
                )}
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" pasHref>
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </Grid>

                  <Grid item>
                    <Link href="#" variant="body2" pasHref>
                      {'অ্যাকাউন্ট নেই? নিবন্ধন করুন'}
                    </Link>
                  </Grid>
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{ mt: 3, mb: 1 }}
                  startIcon={<LanguageIcon />}
                // onClick={onLink}
                >
                  সমগ্র ওয়েব সাইট
                </Button>
                <Copyright />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
