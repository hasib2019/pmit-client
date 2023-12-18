import axios from 'axios';
import { getCookies } from 'cookies-next';
import { authorizedRoute } from '../url/coop/ApiList';
import { verifyLongLivedToken } from './TokenChecking';
export default function authentication(gssp) {
  return async (context) => {
    const urlArray = ['/dashboard'];
    const { token } = getCookies(context);
    const { ssoToken } = getCookies(context);
    const { type } = getCookies(context);

    if (ssoToken && !token) {
      return await gssp(context);
    }
    if (!token) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      try {
        await verifyLongLivedToken(token, type);
      } catch (error) {
        return {
          redirect: {
            permanent: false,
            destination: '/login',
          },
        };
      }
      let authorizedResp,
        resolvedUrl = context.resolvedUrl;
      ({ resolvedUrl });
      if (context.resolvedUrl.includes('?')) {
        resolvedUrl = context.resolvedUrl.split('?');
        resolvedUrl = resolvedUrl[0];
      }
      if (!urlArray.includes(resolvedUrl)) {
        'work', authorizedRoute + '?url=' + resolvedUrl, config;
        authorizedResp = await axios.get(authorizedRoute + '?url=' + resolvedUrl, config);
        ({ authorizedResp });

        if (!authorizedResp.data.data) {
          return {
            redirect: {
              permanent: false,
              destination: '/404',
            },
          };
        }
      }
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        },
      };
    }
    return await gssp(context);
  };
}
