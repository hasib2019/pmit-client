import axios from '../../../service/AxiosInstance';
import {
  createItemUrl,
  getAllDoptorUrl,
  getItemUrl,
  codeMasterTypesUrl,
  updateItemUrl,
  doptorItemInfoUrl,
} from '../../../url/InventoryApiList';
export const fetchDoptorItemInfo = async (itemId) => {
  const result = await axios.get(doptorItemInfoUrl + itemId);
  return result.data;
};

export const fetchAllDoptor = async () => {
  const result = await axios.get(getAllDoptorUrl);
  return result.data;
};

export const makeItem = async (itemData) => {
  const result = await axios.post(createItemUrl, itemData);
  return result.data;
};

export const fetchItem = async (queryValue) => {
  const result = await axios.get(
    queryValue ? getItemUrl + '?isPagination=false' + queryValue : getItemUrl + '?isPagination=false',
  );
  return result.data;
};

export const editItem = async (itemObj) => {
  const result = await axios.put(updateItemUrl, itemObj);
  return result.data;
};
export const fetchcodeMasterTypes = async (queryValue) => {
  const result = await axios.get(codeMasterTypesUrl + queryValue);

  return result.data;
};
