import axios from 'components/utils/AxiosIntance';
import { allotmentInfoUrl, officeOriginUrl, officeUnitsUrl, upsertAllotmentUrl } from '../../../url/InventoryApiList';

export const fetchAllotmentInfo = async (layerId, unitId) => {
  const result = await axios.get(allotmentInfoUrl + layerId + '/' + unitId);
  return result.data;
};
export const fetchOfficeOrigin = async () => {
  const result = await axios.get(officeOriginUrl);
  return result.data;
};
export const fetchOfficeUnits = async () => {
  const result = await axios.get(officeUnitsUrl);
  return result.data;
};
export const insertUpdateAllotment = async (payload) => {
  const result = await axios.post(upsertAllotmentUrl, payload);
  return result.data;
};
