import axios from 'service/AxiosInstance';
import { crateItemGroupUrl, getItemGroupUrl, updateItemGroupUrl } from '../../../url/InventoryApiList';
export const makeItemGroup = async (groupName) => {
  const groupItemCreateResult = await axios.post(crateItemGroupUrl, {
    groupName,
  });
  'eeeeitem', groupItemCreateResult;
  return groupItemCreateResult.data;
};
export const fetchAllItemGroup = async () => {
  const result = await axios.get(getItemGroupUrl + '?isPagination=false');

  return result.data;
};
export const editItemGroup = async (data) => {
  const result = await axios.put(updateItemGroupUrl, data);
  return result.data;
};
