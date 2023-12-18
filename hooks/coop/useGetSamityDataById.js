import axios from 'axios';
import { useState } from 'react';
import { localStorageData } from 'service/common';
import { applicationGetById } from '../../url/coop/ApiList';
const useGetSamityDataById = () => {
  const [samityInfo, setSamityInfo] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [imageDocument, setImageDocument] = useState(null);
  const [signatureDocument, setSignatureDocument] = useState(null);
  const [committee, setCommittee] = useState([]);
  const [committeePerson, setCommitteePerson] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [workingArea, setWorkingArea] = useState([]);
  const [memberArea, setMemberArea] = useState([]);
  const [documentInfo, setDocumentInfo] = useState([]);
  const [designationId, setDesignationId] = useState(null);
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    nid: '',
    mobile: '',
    isAuthorizer: true,
  });

  const getSmaityDataById = async (samityId) => {
    if (samityId) {
      const config = localStorageData('config');
      const samityData = await axios.get(applicationGetById + samityId, config);

      // const allData = samityData?.data?.data[0]?.data;
      const data = samityData?.data?.data[0]?.data;
      setDesignationId(samityData?.data?.data[0]?.nextAppDesignationId);
      setSamityInfo(data?.samityInfo);
      setMemberInfo(data?.memberInfo);
      data?.employeeInfo && setEmployeeInfo(data?.employeeInfo);
      data?.imageDocument && setImageDocument(data?.imageDocument);
      data?.signatureDocument && setSignatureDocument(data?.signatureDocument);

      setWorkingArea(data?.workingArea);
      setMemberArea(data?.memberArea);
      setDocumentInfo(data?.documentInfo);
    }
  };

  return {
    getSmaityDataById,
    samityInfo,
    // committee,
    // committeePerson,
    // membersData,
    ...(employeeInfo && { employeeInfo: employeeInfo }),
    ...(imageDocument && { imageDocument: imageDocument }),
    ...(signatureDocument && { signatureDocument: signatureDocument }),
    memberInfo,
    workingArea,
    memberArea,
    documentInfo,
    designationId,
  };
};
export default useGetSamityDataById;
