/* eslint-disable react-hooks/rules-of-hooks */

import axios from 'axios';
import Loader from 'components/shared/others/Loader';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { ssoIpRoute } from '../../../url/ApiList';

const index = (props) => {
  let componentName = props.query.componentName;
  const router = useRouter();
  const accessToken = props.query.token;

  const clientIdMapping = {
    accounts: 8,
    coop: 4,
    inventory: 14,
    loan: 3,
    vms: 10,
  };

  const clientId = clientIdMapping[componentName];

  useEffect(() => {
    localStorage.clear('');
    deleteCookie('token');
    deleteCookie('type');
    if (accessToken) {
      localStorage.setItem('ssoToken', JSON.stringify(accessToken));
      setCookie('ssoToken', accessToken);
      ssoLogin(accessToken);
    }
  });

  const ssoLogin = async (tokenData) => {
    localStorage.setItem('ssoToken', JSON.stringify(tokenData));
    try {
      let configToken = {
        headers: {
          Authorization: `Bearer ${tokenData}`,
        },
      };

      const signon = await axios.post(ssoIpRoute + componentName, {}, configToken);
      if (signon.status == 200) {
        if (signon.data.data.type == 'citizen') {
          const AllFeatureData = signon.data.data;
          const accessToken = AllFeatureData.accessToken;
          const getMenuData = AllFeatureData.menu;
          localStorage.setItem('menu', JSON.stringify(getMenuData));
          localStorage.setItem('token', JSON.stringify(accessToken));
          localStorage.setItem('stepId', JSON.stringify(0));
          localStorage.setItem('componentName', 'coop');
          setCookie('token', accessToken);
          setCookie('type', 'citizen');
          router.push({ pathname: '/dashboard' });
        } else {
          const getMenuData = signon.data.data.menu;
          const token = signon.data.data.accessToken;
          const geoCode = signon.data.data.geoCode;
          localStorage.setItem('menu', JSON.stringify(getMenuData));
          localStorage.setItem('accessToken', token);
          localStorage.setItem('componentName', componentName);
          localStorage.setItem('clientId', clientId);
          localStorage.setItem('officeGeoData', JSON.stringify(geoCode)); // added by Hasib
          localStorage.setItem('token', JSON.stringify(token)); // added by Hasib
          setCookie('token', token); // added by Hasib
          setCookie('type', 'user'); // added by Hasib
          router.push('/dashboard');
        }
      } else {
        NotificationManager.warning('লগইন করা সম্ভব হচ্ছে না, দয়া করে পুনরায় চেষ্টা করুন', '', 5000);
      }
    } catch (error) {
      router.push('/dashboard');
      if (error?.response?.data?.errors && error?.response?.data?.errors[0]) {
        NotificationManager.error(error?.response?.data?.errors[0].message);
      } else {
        NotificationManager.warning(
          'কোন মেনু পাওয়া যায়নি, দয়া করে কম্পোনেন্ট সুইচ করুন অথবা অফিসে যোগাযোগ করুন ।',
          '',
          5000,
        );
      }
    }
  };
  return (
    <>
      <Loader />
    </>
  );
};
export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}

export default index;
