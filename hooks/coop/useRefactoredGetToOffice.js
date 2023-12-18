import axios from 'axios';
import { useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  branchName,
  designationName,
  designationNameCorrection,
  officeNamesUrl,
  ownOfficeNames,
  ownOfficeUrl,
  serviceName,
} from '../../../url/coop/ApiList';
const useGetToOffice = (idd) => {
  const [officeValue, setOfficeValue] = useState('');
  const [applicationName, setApplicationName] = useState('');
  const [serviceNames, setServiceName] = useState([]);
  const [defaultValue, setDefaultValue] = useState('');
  const [officeNames, setOfficeName] = useState([]);
  const [designationNames, setDesignationName] = useState([]);
  const [branchNames, setBranchName] = useState([]);
  const [approval, setApproval] = useState({
    origin_unit_id: '',
    office_id: '',
    designationId: '',
    officerId: '',
    serviceActionId: '',
  });
  const config = localStorageData('config');
  //   const [officeNames, setOfficeName] = useState([]);
  const handleChangeSAI = (e) => {
    if (e?.target?.value) {
      let sAID = JSON.parse(e.target.value);
      let id = sAID.id;
      let applicationStatus = sAID.applicationStatus;
      let name = sAID.name;
      setApplicationName(name);
      setDefaultValue(applicationStatus);
      setApproval({
        ...approval,
        serviceActionId: id,
      });
      if (applicationStatus == 'C') {
        getDesignationNameNew();
      }
    }
  };
  const handleChangeOffice = (e, value) => {
    setOfficeValue(value ? value.id : e.target.value);
    setApproval({
      ...approval,
      origin_unit_id: value && value.id,
    });

    getBranchName(e.target.value ? e.target.value : value ? value.id : '');
  };
  const handleChange = (e, officeValue) => {
    //    if (e?.target?.value === "0") {
    //   setApproval({
    //     ...approval,
    //     designationId: null,
    //   });
    //   return;
    // }
    const { name, value } = e.target;

    if (name == 'office_id') {
      getDesignationName(officeValue ? officeValue.id : value);
    }
    setApproval({
      ...approval,
      office_id: officeValue ? officeValue.id : value,
    });
    getDesignationName(officeValue ? officeValue.id : value);
  };
  const handleChangeSelect = (e, value) => {
    // if (e.target.value && value) {

    if (value) {
      let desData = JSON.parse(value);
      let designationIdd = desData.designationId;
      // let employeeId = desData.employeeId;

      setApproval({
        ...approval,
        designationId: designationIdd,
        // officerId: employeeId,
      });
      return;
    }
    let desData = e.target.value && !e.target.value.includes('- নির্বাচন করুন -') && JSON.parse(e.target.value);
    let designationIdd = desData.designationId;
    // let employeeId = desData.employeeId;

    setApproval({
      ...approval,
      designationId: designationIdd,
      // officerId: employeeId,
    });
    // }
  };
  let getServiceName = async (id) => {
    if (id) {
      try {
        let serviceNameData = await axios.get(serviceName + '&id=' + id, config);
        setServiceName(serviceNameData.data.data[0].serviceAction);
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  let getOfficeName = async (ownOrOthers) => {
    try {
      let officeNameData = await axios.get(
        ownOrOthers && ownOrOthers === 'own' ? ownOfficeNames : officeNamesUrl,
        config,
      );
      setOfficeName(officeNameData.data.data);

      if (ownOrOthers && ownOrOthers === 'own') {
        setApproval({
          ...approval,

          origin_unit_id: officeNameData.data.data.id,
        });

        getBranchName(null, ownOrOthers, officeNameData.data.data.id);
      }
      if (ownOrOthers && ownOrOthers === 'others') {
        setApproval({
          designationId: '',
          office_id: '',
          officerId: '',
          origin_unit_id: '',
          serviceActionId: '',
        });
        getDesignationName(null);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  let getBranchName = async (value, ownAndOthers, origin_unit_id) => {
    if (!value && ownAndOthers && ownAndOthers === 'own' && origin_unit_id) {
      try {
        let branchNameData = await axios.get(ownOfficeUrl, config);
        setBranchName(branchNameData.data.data);
        setApproval({
          ...approval,
          origin_unit_id: origin_unit_id,

          office_id: branchNameData.data.data[0].id,
        });
        if (branchNameData.data.data[0].id) {
          getDesignationName(branchNameData.data.data[0].id);
        }
        return;
      } catch (error) {
        errorHandler(error);
      }
    } else if (!value) {
      return;
    }
    try {
      let branchNameData = await axios.get(branchName + value, config);
      setBranchName(branchNameData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  let getDesignationName = async (value) => {
    if (!value) {
      setDesignationName([]);
    }
    if (value) {
      try {
        let designationNameData = await axios.get(designationName + value + '&status=true', config);
        setDesignationName(designationNameData.data.data);
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  const getDesignationNameNew = async () => {
    try {
      const designationNameData = await axios.get(designationNameCorrection + idd.id, config);
      setDesignationName(designationNameData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  return {
    serviceNames,
    defaultValue,
    officeNames,
    designationNames,
    handleChangeSAI,
    handleChangeOffice,
    handleChange,
    handleChangeSelect,
    getServiceName,
    getOfficeName,
    getBranchName,
    approval,
    branchNames,
    applicationName,
    setApproval,
  };
};
export default useGetToOffice;
