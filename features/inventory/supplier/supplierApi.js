import axios from 'components/utils/AxiosIntance';
import { supplierCreateUrl, supplierGetUrl, supplierUpdateUrl } from '../../../url/InventoryApiList';

export const makeSupplier = async (supplierData) => {
  const result = await axios.post(supplierCreateUrl, supplierData);
  return result.data;
};
export const editSupplier = async (supplierData) => {
  const result = await axios.put(supplierUpdateUrl, supplierData);
  return result.data;
};
export const fetchSupplier = async (query) => {
  const result = await axios.get(supplierGetUrl + query);
  return result.data;
};
