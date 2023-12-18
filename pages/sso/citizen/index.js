/* eslint-disable react-hooks/rules-of-hooks */

/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
import Box from '@mui/material/Box';
import axios from 'axios';
import Loader from 'components/shared/others/Loader';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { citizenSignon } from '../../../url/coop/ApiList';

const index = (props) => {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear('');
    deleteCookie('token');
    deleteCookie('type');
    postData();
  }, []);

  const postData = async () => {
    let token = props.query.token;
    let configToken = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const userData = await axios.post(citizenSignon, {}, configToken);
      if (userData.status === 200) {
        const AllFeatureData = userData.data.data;
        const accessToken = AllFeatureData.accessToken;
        const getMenuData = AllFeatureData.menu;

        localStorage.setItem('menu', JSON.stringify(getMenuData));
        localStorage.setItem('token', JSON.stringify(accessToken));
        localStorage.setItem('stepId', JSON.stringify(0));
        localStorage.setItem('componentName', 'coop');
        setCookie('token', accessToken);
        setCookie('type', 'citizen');
        router.push({ pathname: '/dashboard' });
      }
    } catch (error) {
      NotificationManager.warning('লগইন করা সম্ভব হচ্ছে না, দয়া করে পুনরায় চেষ্টা করুন', '', 5000);
      // router.back();
    }
  };

  return (
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
        minHeight: '100%',
      }}
    >
      <Loader />
    </Box>
  );
};

export default index;

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
