import axios from 'components/utils/AxiosIntance';
import { specificApplication } from '../../../url/ApiList';
export const createProduct = async (data) => {
  const response = await axios.post(`${specificApplication}savingsProduct/loan`, data);
  return response.data;
};
export const updateProduct = async (id, data) => {
  const response = await axios.put(`${specificApplication}updateApplication/${data?.route}/${id}`, data?.value);
  return response.data;
};
export const getProductInfoByAppId = async (id) => {
  const response = await axios.get(`${specificApplication}/${id}`);
  return response.data;
};
