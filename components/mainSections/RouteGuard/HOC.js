import axios from 'axios';
import nextCookie from 'next-cookies';
import { authorizedRoute } from '../../../url/ApiList';
import { verifyLongLivedToken } from './TokenChecking';
export default function requireAuthentication(gssp) {
  return async (context) => {
    const urlArray = ['dashboard', '/loan/dashboard', '/accounts/dashboard', '/router-not-found'];

    const { token } = nextCookie(context);

    if (!token) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }

    const config = {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let decodedTokenResp;
    try {
      try {
        decodedTokenResp = await verifyLongLivedToken(token);
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
      if (context.resolvedUrl.includes('?')) {
        resolvedUrl = context.resolvedUrl.split('?');
        resolvedUrl = resolvedUrl[0];
      }
      if (!urlArray.includes(resolvedUrl)) {
        authorizedResp = await axios.get(authorizedRoute + '?url=' + resolvedUrl, config);
        if (!authorizedResp.data.data) {
          return {
            redirect: {
              permanent: false,
              destination: '/router-not-found',
            },
          };
        }
        if (
          authorizedResp.data.data &&
          (resolvedUrl == '/samity-management/member-registration-coop' ||
            resolvedUrl == '/samity-management/member-registration-survey')
        ) {
          if (resolvedUrl == '/samity-management/member-registration-coop' && decodedTokenResp.doptorId != 3) {
            return {
              redirect: {
                permanent: false,
                destination: '/router-not-found',
              },
            };
          } else if (
            resolvedUrl == '/samity-management/member-registration-survey' &&
            (decodedTokenResp.doptorId == 3 || decodedTokenResp.doptorId == 10)
          ) {
            return {
              redirect: {
                permanent: false,
                destination: '/router-not-found',
              },
            };
          }
        }
      }
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: '/router-not-found',
        },
      };
    }
    return await gssp(context);
  };
}
