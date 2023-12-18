

import { useState } from 'react';

import axios from 'components/utils/AxiosIntance';

import { NotificationManager } from 'react-notifications';
import { getSamityDataByUser } from '../../url/coop/BackOfficeApi';

const useGetSamityName = () => {
  const [allSamityName, setAllSamityName] = useState([]);
  let getSamityData;
  try {
    getSamityData = async () => {
      const getData = await axios.get(getSamityDataByUser);
      setAllSamityName(getData.data.data);
    };
  } catch (error) {
    NotificationManager.error(error);
  }

  return {
    allSamity: allSamityName,
    getSamity: getSamityData,
  };
};
export default useGetSamityName;
