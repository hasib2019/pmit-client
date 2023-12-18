/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/09/14
 * @modify
 * @desc [all common services]
 */
import { dashboardUrl, logOutAuthorizedCitizen, logoutCitizen, logOutUser } from 'config/IpAddress';
import { deleteCookie } from 'cookies-next';
import Router from 'next/router';

export const userService = {
  logout,
  switcherFun,
};

function logout(getTokenData) {
  deleteCookie('token');
  deleteCookie('type');
  localStorage.clear();

  if (getTokenData && getTokenData.type == 'citizen') {
    if (getTokenData.isAuthorizedPerson) {
      Router.push(logOutAuthorizedCitizen);
    } else {
      Router.push(logoutCitizen);
    }
  } else if (getTokenData && getTokenData.type == 'user') {
    Router.push(logOutUser);
  } else {
    Router.push(logoutCitizen);
  }
}

function switcherFun(accessToken, clientId) {
  if (window && accessToken && window.AppSwitcher && window.AppSwitcher.serve) {
    window.AppSwitcher.serve({
      token: accessToken,
      dashboard_url: dashboardUrl,
      client_id: clientId,
      onSwitch: (module) => {
        Router.push({
          pathname: module.login_handler,
          query: {
            token: accessToken,
          },
        });
      },
      onLogout: (response) => {
        localStorage.clear();
        deleteCookie('token');
        deleteCookie('type');
        if (response) {
          Router.replace(response.redirect_url);
        } else {
          logout();
        }
      },
    });
  }
}
