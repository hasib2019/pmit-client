import axios from 'service/AxiosInstance';
import { serviceNameUrl } from '../../../url/InventoryApiList';
import { localStorageData } from 'service/common';
export const fetchDocumentTypes = async (seriveceId) => {
  const compoName = localStorageData('componentName');
  const services = await axios.get(serviceNameUrl + '/' + compoName + '?isPagination=false&id=' + seriveceId);
  return services.data;
};
