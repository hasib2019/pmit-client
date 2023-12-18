////////////////////////////////Modified by Md.Hasibuzzaman/////////////////////////////////////////
import AccountCircle from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, InputAdornment, Paper, TextField, Tooltip, Typography } from '@mui/material/';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';
import axios from 'axios';
import { deleteCookie, setCookie } from 'cookies-next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { errorHandler } from 'service/errorHandler';
import { inputRadioGroup } from 'service/fromInput';
import { LoanLoginAPI } from '../../url/ApiList';
import { globalCitizenLogin, globalDoptor } from '../../url/LoginApiList';
import star from '../mainSections/loan-management/loan-application/utils';

// const Joi = require('joi');
function Copyright() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '.5rem 1rem',
        background: 'var(--color-bg-topbar)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <b>কারিগরি সহযোগিতায় : আইআইটি জাহাঙ্গীরনগর বিশ্ববিদ্যালয়</b>
        {/* <Image src="/main-logo.png" alt="Logo" width={130} height={25} /> */}
      </span>
      {/* <Typography sx={{ fontSize: "13px", textAlign: "center" }}>
        {"Copyright © "} {new Date().getFullYear()}{" "}
        {"ERA-InfoTech Ltd & Orangebd Ltd."}
      </Typography> */}
    </Box>
  );
}
const componentNameArray = [
  {
    nameBn: 'কোপ',
    value: 'coop',
  },
  // {
  //   nameBn: 'অ্যাকাউন্ট',
  //   value: 'accounts',
  // },
  // {
  //   nameBn: 'লোন',
  //   value: 'loan',
  // },
  // {
  //   nameBn: 'ইনভেন্টরী',
  //   value: 'inventory',
  // },
  // {
  //   nameBn: 'ভিএমএস',
  //   value: 'vms',
  // },
  // {
  //   nameBn: 'প্রোজেক্ট',
  //   value: 'project',
  // },
];

const Login = () => {
  const router = useRouter();
  const theme = createTheme();

  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [allDoptor, setAllDoptor] = useState([]);
  const samityLevelStatus = false;

  useEffect(() => {
    localStorage.clear('');
    deleteCookie('token');
    deleteCookie('type');
    getDoptorInfo();
  }, []);

  const getDoptorInfo = async () => {
    const data = await axios.get(globalDoptor);
    setAllDoptor(data.data.data);
  };

  let [userLogin, setUserLogin] = useState({
    username: '',
    password: '',
    componentName: '',
    isAdmin: '2',
    doptorId: 3,
  });
  const handleChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };
  // const loginSchema = Joi.object({
  //   email: Joi.string().email({ tlds: { allow: false } }),
  //   password: Joi.string().required(),
  // });

  const menuSort = (array) => {
    const compareBySerialNo = (a, b) => a.serialNo - b.serialNo;
    // Sort the main array by serialNo
    array?.length > 1 && array.sort(compareBySerialNo);
    // Sort child arrays by serialNo
    array?.forEach((item) => {
      if (item?.child?.length > 1) {
        item?.child.sort(compareBySerialNo);
      }
      item?.child?.forEach((item) => {
        if (item?.childOfChild?.length > 1) {
          item?.childOfChild?.sort(compareBySerialNo);
        }
      });
    });

    return array;
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
      doptorId: userLogin.doptorId,
    };

    if (userLogin.componentName == 'coop' && userLogin.isAdmin == 1) {
      if (userLogin.isAdmin == 1) {
        try {
          const loginUser = await axios.post(globalCitizenLogin, citizenPayload);

          const getMenuData = menuSort(loginUser.data.data.menu);
          const token = loginUser.data.data.accessToken;
          // sort korte hobe
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
        const menu = menuSort(loginUser.data.data.menu);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('menu', JSON.stringify(menu));
        localStorage.setItem('componentName', userLogin.componentName);
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('officeGeoData', JSON.stringify(officeGeoData));
        // set cookies
        setCookie('token', token);
        setCookie('type', 'user');

        if (loginUser.status == 200) {
          // router.push(`${userLogin.componentName}/dashboard`);
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
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            zIndex: '1201',
            background: 'var(--color-bg-topbar)',
            boxShadow: '0 0 5px -1px rgba(0,0,0,0.4)',
            height: '60px',
            padding: '.5rem 1rem',
          }}
        >
          <Image src="/top-logo/topDoptor3.png" alt="Logo" height="40px" width="200px" />
        </Box>
        <Box display="flex" flex={1}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              flex: 1,
              backgroundImage: 'url(/govt2.png)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
              backgroundSize: '50%',
              backgroundPosition: 'center',
              opacity: '100%',
            }}
          />
          <Box
            component={Paper}
            elevation={6}
            alignSelf="stretch"
            sx={{ maxWidth: { md: '480px', sm: '380px', xs: '100%' } }}
          >
            <Box
              sx={{
                p: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Stack>
                <Avatar
                  sx={{
                    bgcolor: 'var(--color-primary)',
                    margin: '0 auto 1rem',
                  }}
                >
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  সাইন ইন
                </Typography>
              </Stack>
              <Box component="form" noValidate>
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
                  margin="normal"
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
                <Box mb="1rem">
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
                          label: 'ইউজার',
                        },
                      ],
                      samityLevelStatus,
                    )
                    : ''}
                  {userLogin.isAdmin == 1 && (
                    <TextField
                      fullWidth
                      margin="normal"
                      label={star('দপ্তরের নাম')}
                      name="doptorId"
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={userLogin.doptorId || 3}
                      variant="outlined"
                      size="small"
                    >
                      <option value={0}>- নির্বাচন করুন -</option>
                      {allDoptor?.map((option) => (
                        option.id === 3 && (
                          <option key={option.id} value={option.id}>
                            {option.nameBn}
                          </option>
                        )
                      ))}
                    </TextField>
                  )}
                </Box>
                {loadingDataSaveUpdate ? (
                  <LoadingButton
                    loading
                    fullWidth
                    sx={{ marginBottom: '1rem' }}
                    loadingPosition="start"
                    startIcon={<LoginIcon />}
                    variant="outlined"
                  >
                    {'প্রবেশ করার জন্য আপেক্ষা করুন.........'}
                  </LoadingButton>
                ) : (
                  <Tooltip title={'প্রবেশ করুন'}>
                    <Button
                      sx={{ marginBottom: '1rem' }}
                      fullWidth
                      variant="contained"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      <LoginIcon />
                      {'প্রবেশ করুন'}
                    </Button>
                  </Tooltip>
                )}
                {/* <Box margin="normal">
                    <Link href="#" variant="body2">
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>

                    <Link href="#" variant="body2">
                      {"অ্যাকাউন্ট নেই? নিবন্ধন করুন"}
                    </Link>
                  </Box> */}
                <Button
                  margin="normal"
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<LanguageIcon />}
                // onClick={onLink}
                >
                  সমগ্র ওয়েব সাইট
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Copyright />
      </Box>
    </ThemeProvider>
  );
};

export default Login;
