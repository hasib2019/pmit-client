import axios from 'service/AxiosInstance';

import { returnableItemListUrl, nonFixedReturnableItemsUrl } from '../../../url/InventoryApiList';

export const fetchReturnableItems = async () => {
  const returnableItems = await axios.get(returnableItemListUrl);
  return returnableItems.data;
};
export const fetchNonFixedReturnableItems = async () => {
  const nonFixedReturnableItems = await axios.get(nonFixedReturnableItemsUrl);
  return nonFixedReturnableItems.data;
};
