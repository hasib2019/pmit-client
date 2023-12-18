import axios from 'components/utils/coop/AxiosIntance';
import { tokenData } from 'service/common';
import {
  branchName2,
  designationName2,
  designationNameCorrection2,
  officeLayer,
  ownOfficeNames2,
  ownOfficeUrl2,
  serviceName2
} from '../../url/coop/ApiList';

export const getOfficeNames = async (ownOrOthers) => {
  const userData = tokenData();
  const doptorId = userData?.doptorId;
  const officesData = await axios.get(ownOrOthers === 'own' ? ownOfficeNames2 :  officeLayer+"?doptorId="+doptorId);
  return officesData.data.data;
};
export const getServiceName = async (id) => {
  if (id) {
    const serviceNameData = await axios.get(serviceName2 + '&id=' + id);

    return serviceNameData.data.data[0].serviceAction;
  }
};
export const getBranchName = async (value, ownAndOthers) => {
  if (!value && ownAndOthers && ownAndOthers === 'own') {
    const branchNameData = await axios.get(ownOfficeUrl2);
    return branchNameData.data.data;
  } else if (ownAndOthers === 'others' && value) {
    const branchNameData = await axios.get(branchName2 + value);
    return branchNameData.data.data;
  } else if (ownAndOthers === 'others') return [];
};

export const getDesignationName = async (value) => {
  //   if (value) {
  const designationNameData = await axios.get(designationName2 + value + '&status=true');
  return designationNameData.data.data;
  //   }
};

export const getDesignationNameNew = async (approvalInfo) => {
  const designationNameData = await axios.get(designationNameCorrection2 + approvalInfo.id);
  return designationNameData.data.data;
};
