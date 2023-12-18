
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loader from 'components/shared/others/Loader';
import { ssoIpRoute } from '../../../url/ApiList';
import { errorHandler } from 'service/errorHandler';

const Index = (props) => {
  const router = useRouter();
  const accessToken = props.query.token;

  useEffect(() => {
    ssoLogin(accessToken);
    if (accessToken) {
      localStorage.setItem('ssoToken', JSON.stringify(accessToken));
      ssoLogin(accessToken);
    }
  });

  const ssoLogin = async (tokenData) => {
    try {
      let configToken = {
        headers: {
          Authorization: `Bearer ${tokenData}`,
        },
      };

      const signon = await axios.post(ssoIpRoute, {}, configToken);
      if (signon.status == 200) {
        const getMenuData = signon.data.data.menu;
        const token = signon.data.data.accessToken;
        const feature = signon.data.data.featureCodes;
        const userName = signon.data.data.username;
        const officeName = signon.data.data.geoCode.nameBn;
        const doptorId = signon.data.data.doptorId;
        localStorage.setItem('doptorId', JSON.stringify(doptorId));
        localStorage.setItem('menu', JSON.stringify(getMenuData));
        localStorage.setItem('userName', userName);
        localStorage.setItem('officeName', officeName);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('features', JSON.stringify(feature));
        router.push('/home');
      }
    } catch (error) {
      errorHandler(error)
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

export default Index;
