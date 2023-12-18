import axios from 'service/AxiosInstance';
import { getItemRequistionPurposeUrl } from '../../../url/InventoryApiList';

export const fetchItemRequisition = async () => {
  const result = await axios.get(getItemRequistionPurposeUrl);
  return result.data;
};
