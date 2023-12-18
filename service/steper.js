/**
 * @author Md Saifur Rahman
 * @Modifier Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
import axios from 'axios';
import { samityStepReg } from '../url/coop/ApiList';
import { localStorageData } from './common';

const pageLink = (data) => {
  if (data == 1) {
    return '/coop/samity-management/coop/add-by-laws';
  } else if (data == 2) {
    return '/coop/samity-management/coop/member-registration';
  } else if (data == 3) {
    return '/coop/samity-management/coop/designation';
  } else if (data == 4) {
    return '/coop/samity-management/coop/member-expenditure';
  } else if (data == 5) {
    return '/coop/samity-management/coop/budget';
  } else if (data == 6) {
    return '/coop/samity-management/coop/income-expense';
  } else if (data == 7) {
    return '/coop/samity-management/coop/required-doc';
  } else if (data == 8) {
    return '/coop/samity-management/coop/samity-reg-report';
  }
};
export const steperFun = async (data) => {
  const getId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('storeId')) : null;
  const token = localStorageData('token');
  const config = localStorageData('config', token);

  const getRedirectUrl = await axios.get(samityStepReg + '/' + getId, config);
  const redirectmainData = getRedirectUrl.data.data;
  if (redirectmainData.lastStep - 1 == data) {
    localStorage.setItem('stepId', JSON.stringify(data + 1));
    localStorage.setItem('storeId', JSON.stringify(redirectmainData.samityId));
    localStorage.setItem('storeName', JSON.stringify(redirectmainData.samityName));
  }
};
export const steperFunForMemberExpendatureCenNat = async (data) => {
  let dataStoreId;
  const getId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('storeId')) : null;
  const token = localStorageData('token');
  const config = localStorageData('config', token);

  const getRedirectUrl = await axios.get(samityStepReg + '/' + getId, config);
  const redirectmainData = getRedirectUrl.data.data;
  if (redirectmainData.lastStep == data) {
    let payLoadOfStep = {
      id: redirectmainData.id,
      samityId: redirectmainData.samityId,
      userId: redirectmainData.userId,
      status: 'P',
      lastStep: data + 1,
      url: pageLink(data + 1),
      samityName: redirectmainData.samityName,
    };
    dataStoreId = await axios.put(samityStepReg, payLoadOfStep, config);
    localStorage.setItem('stepId', JSON.stringify(data + 1));
    localStorage.setItem('storeId', JSON.stringify(redirectmainData.samityId));
    localStorage.setItem('storeName', JSON.stringify(redirectmainData.samityName));
  }
  return dataStoreId;
};
