
import axios from 'axios';
import { useCallback, useState } from 'react';
import { localStorageData } from 'service/common';
import { employeeDesignationGetApiUrl } from '../../../url/coop/ApiList';

const useGetDesignation = () => {
  const config = localStorageData('config');
  const [allDesignation, setAllDesignation] = useState([]);
  const getAllDesignation = useCallback(async () => {
    const designationData = await axios.get(employeeDesignationGetApiUrl, config);
    setAllDesignation(designationData.data.data);
  }, []);

  return {
    getAllDesignation: getAllDesignation,
    allDesignation,
  };
};
export default useGetDesignation;
