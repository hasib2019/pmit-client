import axios from '../../../service/AxiosInstance';

export const fetchAllSavingsProduct = async () => {
  const resutl = await axios.get();
  return resutl.data;
};
