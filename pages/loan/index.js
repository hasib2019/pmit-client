
import axios from 'axios';
import Loader from 'components/shared/others/Loader';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { ssoIpRoute } from '../../url/ApiList';

const Index = (props) => {
  const router = useRouter();

  useEffect(() => {
    signon(props.query.token);
  }, []);

  const signon = async (ssoToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${ssoToken}`,
      },
    };

    try {
      const response = await axios.post(ssoIpRoute, null, config);
      const payload = response.data.data;

      if (payload.needPermission) {
        // redirect to approval needed page
        router.replace('/loan/notify');
      } else {
        // set token and redirect to dashboard
        localStorage.setItem('accessToken', payload.accessToken);
        localStorage.setItem('features', JSON.stringify(payload.features));
        router.replace('/');
      }
    } catch (error) {
      // ("Error====>", error.response);
      if (error.response) {
        let message = error.response.data.message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
      setTimeout(() => {
        router.replace('http://rdcd.gov.bd/');
      }, 5000);
    }
    // const payload = response.data.data;

    // if (payload.needPermission) {
    //   // redirect to approval needed page
    //   router.replace("/loan/notify");
    // }
    // else {
    //   // set token and redirect to dashboard
    //   router.replace()
    // }
  };

  return (
    <div>
      <Loader></Loader>
    </div>
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
