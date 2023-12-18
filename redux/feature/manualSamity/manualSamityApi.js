import axios from 'components/utils/AxiosIntance';
import { applicationGetById } from '../../../url/coop/ApiList';

export const getManualSamityById = async (id) => {
  const manualSamity = await axios.get(applicationGetById + id);
  return manualSamity.data.data;
};
