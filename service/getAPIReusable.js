import axios from 'axios';
import { liveIp } from '../config/IpAddress';
import { errorHandler } from './errorHandler';

const getAPIReusable = async (...varArgs) => {
  let accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const apiInfo = varArgs[0];
  apiInfo;

  let result = '';
  try {
    let apiDataResp = await axios.get(liveIp + apiInfo['url'], config);
    result = apiDataResp.data.data;
  } catch (error) {
    errorHandler(error)
  }

  return result;
};
export default getAPIReusable;
