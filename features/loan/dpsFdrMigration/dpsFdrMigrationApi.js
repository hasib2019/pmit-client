import axios from 'service/AxiosInstance';
import { localStorageData, tokenData } from 'service/common';
import {
  approvedMigratedSamity,
  districtOffice,
  fieldOffRoute,
  loanProject,
  product,
  upozilaOffice,
} from '../../../url/ApiList';

export const fetchProject = async () => {
  const result = await axios.get(loanProject);
  return result?.data;
};
export const fetchFieldOfficer = async () => {
  const result = await axios.get(fieldOffRoute);
  return result?.data;
};
export const fetchDistrictOffices = async () => {
  const result = await axios.get(districtOffice);
  return result?.data;
};
export const fetchUpazilaOfficeByDistrict = async (officeId) => {
  const result = await axios.get(upozilaOffice + `?districtOfficeId=${officeId}`);
  return result?.data;
};
export const fetchSamityByProject = async (project) => {
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  let samity;
  if (getTokenData?.doptorId == 3) {
    samity = await axios.get(
      approvedMigratedSamity + '?isPagination=false&projectId=' + project + '&flag=1&withoutLoanApproved=true',
    );
  } else if (getTokenData?.doptorId == 10) {
    samity = await axios.get(approvedMigratedSamity + '?isPagination=false&projectId=' + project + '&flag=4');
  } else if (getTokenData?.doptorId == 5) {
    samity = await axios.get(
      approvedMigratedSamity +
        '?isPagination=false&projectId=' +
        project +
        '&flag=5&withoutLoanApproved=true&dpsFdrMigration=true',
    );
  } else {
    samity = await axios.get(
      approvedMigratedSamity + '?isPagination=false&projectId=' + project + '&flag=5&withoutLoanApproved=true',
    );
  }
  return samity?.data;
};
export const fetchProductByProject = async (projectId) => {
  if (projectId) {
    const result = await axios.get(product + '?projectId=' + projectId + '&productType=L');
    return result.data;
  }
  return {
    data: [],
  };
};
