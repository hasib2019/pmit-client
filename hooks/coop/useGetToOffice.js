import axios from 'axios';
import _ from 'lodash';
import { useState } from 'react';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  branchName,
  designationName,
  designationNameCorrection,
  officeLayer,
  ownOfficeNames,
  ownOfficeUrl,
  serviceName
} from '../../url/coop/ApiList';
const useGetToOffice = (idd) => {
  const [applicationName, setApplicationName] = useState('');
  const [serviceNames, setServiceName] = useState([]);
  const [defaultValue, setDefaultValue] = useState('');
  const [isFinalAction, setIsFinalAction] = useState('');
  const [officeNames, setOfficeName] = useState([]);
  const [designationNames, setDesignationName] = useState([]);
  const [noticeText, setNoticeNext] = useState('');
  const [noticeId, setNoticeId] = useState();
  const [branchNames, setBranchName] = useState([]);
  const [approval, setApproval] = useState({
    origin_unit_id: '',
    office_id: '',
    designationId: '',
    officerId: '',
    serviceActionId: '',
  });
  // const [layerList, setLayerList] = useState([]);
  const userData = tokenData();
  const doptorId = userData?.doptorId;

  const config = localStorageData('config');

  const handleChangeSAI = (e) => {
    if (e?.target?.value) {
      let sAID = JSON.parse(e.target.value);
      let id = sAID.id;
      let applicationStatus = sAID.applicationStatus;
      let finalAction = sAID.isFinalAction;
      let name = sAID.name;

      setApplicationName(name);
      setDefaultValue(applicationStatus);
      setIsFinalAction(finalAction);
      setApproval({
        ...approval,
        serviceActionId: id,
      });
      if (applicationStatus == 'C') {
        getDesignationNameNew();
      }
      if (name === 'নোটিশ প্রেরণ') {
        setNoticeNext(sAID.text);
        setNoticeId(sAID.id);
      } else if (name === 'অবসায়ক নিয়োগ') {
        setNoticeNext(sAID.text);
        setNoticeId(sAID.id);
      } else if (name === 'অবসায়কের নোটিশ প্রেরণ') {
        setNoticeNext(sAID.text);
        setNoticeId(sAID.id);
      } else if (name === 'অবসায়নের প্রতিবেদন') {
        setNoticeNext(sAID.text);
        setNoticeId(sAID.id);
      } else if (name === 'নিরীক্ষার নোটিশ প্রেরণ' || name === 'পূনরায় নিরীক্ষার নোটিশ প্রেরণ') {
        setNoticeNext(sAID.text);
        setNoticeId(sAID.id);
      } else {
        setNoticeNext('');
        setNoticeId('');
      }
    }
  };
  const handleChangeOffice = (e, value) => {
    setApproval({
      ...approval,
      origin_unit_id: value && value.id,
    });

    getBranchName(e.target.value ? e.target.value : value ? value.id : '');
  };
  
  const handleChange = (e, officeValue) => {
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
    if (value) {
      let desData = JSON.parse(value);
      let designationIdd = desData.designationId;
      setApproval({
        ...approval,
        designationId: designationIdd,
      });
      return;
    }
    let desData = e.target.value && !e.target.value.includes('- নির্বাচন করুন -') && JSON.parse(e.target.value);
    let designationIdd = desData.designationId;

    setApproval({
      ...approval,
      designationId: designationIdd,
    });
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
        ownOrOthers && ownOrOthers === 'own' ? ownOfficeNames : officeLayer+"?doptorId="+doptorId,
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
      const degData = _.uniqBy(designationNameData.data.data, 'designationId').map((m) => {
        return {
          approvalId: m.approvalId,
          designation: m.designation,
          designationId: m.designationId,
          employeeId: m.employeeId,
          nameBn: m.nameBn,
        };
      });
      const filterDeg = degData?.filter((element) => element?.designationId !== userData?.designationId);
      setDesignationName(filterDeg);
    } catch (error) {
      errorHandler(error);
    }
  };

  return {
    serviceNames,
    defaultValue,
    isFinalAction,
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
    noticeText,
    noticeId,
  };
};
export default useGetToOffice;
