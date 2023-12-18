import axios from '../../../service/AxiosInstance';
import {
  doptorLayerUrl,
  officeUrl,
  employeeDesignationUrl,
  officeUnitUrl,
  storeGetUrl,
  storeCreateUrl,
  storeUpdateUrl,
  doptorWiseOfficeListUrl,
} from '../../../url/InventoryApiList';

export const fetchAllDoptorLayer = async () => {
  const result = await axios.get(doptorLayerUrl);
  return result.data;
};
export const fetchAllOfficeByDoptorLayer = async (layerId) => {
  const result = await axios.get(layerId ? doptorWiseOfficeListUrl + '?layerId=' + layerId : doptorWiseOfficeListUrl);
  return result.data;
};
export const fetchAllOfficeUnitByOfficeId = async (officeId) => {
  const result = await axios.get(officeId ? officeUnitUrl + '?officeId=' + officeId : officeUnitUrl);
  return result.data;
};
export const fetchAllEmployeeDesignationIdByOfficeId = async (officeId) => {
  const result = await axios.get(officeId ? employeeDesignationUrl + '?officeId=' + officeId : employeeDesignationUrl);
  return result.data;
};

export const fetchStore = async (queryValue) => {
  const result = await axios.get(
    queryValue ? storeGetUrl + '?isPagination=false' + queryValue : storeGetUrl + '?isPagination=false',
  );
  return result.data;
};
export const makeStore = async (storeData) => {
  const result = await axios.post(storeCreateUrl, storeData);
  return result.data;
};
export const editStore = async (storeData) => {
  const result = await axios.put(storeUpdateUrl, storeData);
  return result.data;
};
