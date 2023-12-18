import axios from 'service/AxiosInstance';
import { createItemCategoryUrl, getItemCategoryUrl, updateItemCategoryUrl } from '../../../url/InventoryApiList';
export const makeItemCategory = async (categoryData) => {
  const result = await axios.post(createItemCategoryUrl, categoryData);

  return result.data;
};
export const fetchAllItemCategory = async (queryValue) => {
  const result = await axios.get(
    queryValue ? getItemCategoryUrl + '?isPagination=false' + queryValue : getItemCategoryUrl + '?isPagination=false',
  );

  return result.data;
};
export const editItemCategory = async (data) => {
  const result = await axios.put(updateItemCategoryUrl, data);
  return result.data;
};
