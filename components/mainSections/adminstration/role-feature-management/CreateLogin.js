////////////////////////////////Modified by Md.Hasibuzzaman/////////////////////////////////////////
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Box, Button, Container, Divider, Grid, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NotificationManager } from 'react-notifications';
//import { LoginAPI } from '../../../url/RoleApi';
import { LoginAPI } from 'url/coop/RoleApi';
import { errorHandle } from '../../../../utils/errorHandle';

function Copyright() {
  return (
    <Grid item lg={12} md={12} xs={12} mt={7}>
      <Typography sx={{ fontSize: '13px', textAlign: 'center' }}>
        <Image src="/top-logo/topDoptor3.png" alt="Logo" width={130} height={25} />
        
        <br />
        {'Copyright © '} {new Date().getFullYear()} {'ERA-InfoTech Ltd & Orangebd Ltd.'}
      </Typography>
    </Grid>
  );
}

const CreateLogin = () => {
  const router = useRouter();

  let [userLogin, setUserLogin] = useState({
    userName: '',
    password: '',
    loginType: 'admin',
  });

  const handleChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      username: userLogin.userName,
      password: userLogin.password,
    };

    try {
      let loginUser = await axios.post(LoginAPI, payload);
      const getMenuData = loginUser.data.data.menu;
      const feature = loginUser.data.data.features;

      localStorage.setItem('token', JSON.stringify(loginUser.data.data.accessToken));
      localStorage.setItem('menu', JSON.stringify(getMenuData));
      localStorage.setItem('features', JSON.stringify(feature));

      let message = loginUser.data.message;

      NotificationManager.success(message, 5000);

      router.push('/dev/dashboard');

      setUserLogin({
        userName: '',
        password: '',
      });
    } catch (error) {
      errorHandle(error);
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <Paper elevation={8} rounded>
          <Box
            sx={{
              px: 3,
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <br />
            <Image src="/login.png" alt="Logo" width={255} height={65} />
            <Typography component="h1" variant="h5">
              ডেভেলপার পোর্টাল সাইন ইন
            </Typography>
            <br />
            <Divider />
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                size="small"
                autoComplete="off"
                name="userName"
                label="ই-মেইল/মোবাইল নং"
                value={userLogin.userName}
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

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
                সাইন ইন
              </Button>
            </Box>
            <Copyright sx={{ mt: 2 }} />
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateLogin;
