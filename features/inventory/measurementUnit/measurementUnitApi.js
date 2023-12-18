import axios from '../../../service/AxiosInstance';
import {
  createMeasurementUnitUrl,
  getMeasurementUnitUrl,
  updateMeasurementUnitUrl,
} from '../../../url/InventoryApiList';

export const makeMeasurementUnit = async (measurementObj) => {
  const result = await axios.post(createMeasurementUnitUrl, measurementObj);
  return result.data;
};
export const editMeasurementUnit = async (measurementUpdateObj) => {
  const result = await axios.put(updateMeasurementUnitUrl, measurementUpdateObj);
  return result.data;
};
export const fetchAllMeasurementUnit = async (queryValue) => {
  const result = await axios.get(getMeasurementUnitUrl + `?isPagination=false${queryValue ? queryValue : ''}`);
  return result.data;
};
