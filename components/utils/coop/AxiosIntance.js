import axios from 'axios';
import { liveIp } from '../../../config/IpAddress';

const axiosInstance = axios.create({
  baseURL: liveIp + 'coop',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },

  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;
