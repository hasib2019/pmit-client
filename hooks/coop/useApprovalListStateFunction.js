
import { TableCell, TableRow } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { errorHandler } from 'service/errorHandler';
import { pendingList, serviceName } from '../../../url/coop/ApiList';
// application/type/pending-approval-list
const useApprovalListStateFunction = (token) => {
  const router = useRouter();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [allSamityData, setAllSamityData] = useState([]);
  const [filterSamityData, setFilterSamityData] = useState([]);
  const [serviceNames, setServiceName] = useState([]);
  const [service, setService] = useState([]);

  useEffect(() => {
    getServiceName();
    getSamityRegister();
  }, []);

  const getServiceName = async () => {
    try {
      const serviceNameData = await axios.get(serviceName, config);
      setServiceName(serviceNameData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSamityRegister = async () => {
    try {
      const getSamityRegisterData = await axios.get(pendingList, config);
      setAllSamityData(getSamityRegisterData.data.data);
      setFilterSamityData(getSamityRegisterData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    let id = parseInt(e.target.value);
    let filterData = [];
    let filterresult = allSamityData.filter((data) => data.serviceId === id);
    setFilterSamityData([...filterresult]);
  };

  const onGoingPage = (id, serviceId, samityName, samityTypeName, serviceName, samityId) => {
    router.push({
      pathname: '/approval/approvalData',
      query: {
        id,
        serviceId,
        samityName,
        samityTypeName,
        serviceName,
        samityId,
      },
    });
  };

  return {
    handleChange: handleChange,
    serviceNames: serviceNames,
    filterSamityData: filterSamityData,
    onGoingPage: onGoingPage,
    TableCell: TableCell,
    TableRow: TableRow,
  };
};
export default useApprovalListStateFunction;
