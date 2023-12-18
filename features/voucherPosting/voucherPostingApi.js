import axios from '../../service/AxiosInstance';
import { glListRoute2, GlType2, subGlDataRoute2 } from '../../url/AccountsApiLIst';

export const getAllGl = async (queryString) => {
  const allGl = await axios.get(glListRoute2 + queryString ?? '');
  return allGl.data.data;
};
export const getSubglType = async (queryString) => {
  const subGldata = await axios.get(GlType2 + queryString ?? '');
  return subGldata.data.data;
};

export const getSubGlList = async (id, queryString) => {
  const subGlList = await axios.get(subGlDataRoute2 + id + queryString ?? '');
  return subGlList.data.data;
};
