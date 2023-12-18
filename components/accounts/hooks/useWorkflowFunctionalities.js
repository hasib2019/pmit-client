import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { employeeRecordByOffice, officeName } from '../../../url/AccountsApiLIst';
import { errorHandler } from 'service/errorHandler';
const useWorkFlowFunctionalities = () => {
  const [officeNames, setOfficeNames] = useState([]);
  const [deskList, setDeskList] = useState([]);
  const [selectedDeskId, setSelectedDeskId] = useState('');
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const config = localStorageData('config');
  const getDeskId = async (id) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, config);
      const deskData = Data.data.data;
      setDeskList(deskData);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  useEffect(() => {
    dataGet();
  }, []);

  const dataGet = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleDeskId = useCallback(
    (e) => {
      const { value } = e.target;
      setSelectedDeskId(value);
    },
    [selectedDeskId],
  );
  const handleOffice = useCallback(
    (event, value) => {
      if (value == null) {
        setOfficeObj({
          id: '',
          label: '',
        });
      } else {
        value &&
          setOfficeObj({
            id: value.id,
            label: value.label,
          });
        setSelectedDeskId(' ');
        getDeskId(value.id);
      }
      // ("VVVVVV",value);
    },
    [officeObj.id, officeObj.label],
  );
  return {
    officeNames,
    deskList,
    handleDeskId,
    handleOffice,
    selectedDeskId,
    officeObj,
  };
};
export default useWorkFlowFunctionalities;
