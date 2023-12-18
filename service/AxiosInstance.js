import axios from 'axios';
import { liveIp } from '../config/IpAddress';

const axiosInstance = axios.create({
  baseURL: liveIp,

  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  function (config) {
    let token;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    } else {
      token = 'null';
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;
