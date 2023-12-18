import axios from '../../../service/AxiosInstance';
import { getItemsForExcelUrl, storeAdminInfoUrl } from '../../../url/InventoryApiList';

import { getOfficeLayer, officeName, employeeRecordByOffice, specificApplication } from '../../../url/ApiList';
import lodash from 'lodash';
import { localStorageData } from 'service/common';
export const fetchItemsForExcel = async () => {
  const result = await axios.get(getItemsForExcelUrl);
  return result.data;
};
export const fetchOfficeLayerData = async () => {
  const result = await axios.get(getOfficeLayer);
  return result.data;
};
export const fetchOfficeNames = async (layerId) => {
  const result = await axios.get(officeName + '?layerId=' + layerId);
  return result.data;
};
export const fetchAdminEmployee = async (officeId) => {
  const result = await axios.get(employeeRecordByOffice + '?officeId=' + officeId);
  return result.data;
};
export const makeSotreInItemApplication = async (payload) => {
  const compoName = localStorageData('componentName');
  const result = await axios.post(
    specificApplication + `${payload?.serviceName}` + '/' + compoName,
    lodash.omit(payload, ['serviceName']),
  );
  return result.data;
};
export const fetchStoreAdminInfo = async () => {
  const isStoreAdmin = await axios.get(storeAdminInfoUrl);
  return isStoreAdmin?.data;
};
