
// eslint-disable-next-line react-hooks/exhaustive-deps
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import star from 'components/mainSections/loan-management/loan-application/utils';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { allProjectRoute, docTypeRoute, documentRought, serviceName } from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';

import {
  bangToEng,
  engToBang,
  myValidate,
} from 'components/mainSections/samity-managment/member-registration/validator';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import DynamicDocumentList from './DynamicDocList';
import DynamicNominiList from './DynamicNomineeList';
//import AppTitle from "../../shared/others/AppTitle";

const DocMapping = () => {
  const config = localStorageData('config');
  const compoName = localStorageData('componentName');

  useEffect(() => {
    getProject();
    getDocTypeList();
    getDocInfo();
  }, []);

  const [projectList, setProjectList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [projectId, setProjectId] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [docTypeData, setDocTypeData] = useState([]);
  // const [docMandatory, setDocMandatory] = useState(false);
  const [numMandatory] = useState(false);
  const [docInfoList, setDocInfoList] = useState([]);
  const [documentInfoList, setDocumentInfoList] = useState([
    {
      docTypeId: '',
      docNoLength: [],
      docRadio: '',
      numberRadio: '',
      numMandatory: false,
    },
  ]);
  const [nomineeInfoList, setNomineeInfoList] = useState([
    {
      docTypeId: '',
      docRadio: '',
      numberRadio: '',
      docNoLength: [],
      numMandatory: false,
    },
  ]);

  const handleAddDocumentList = () => {
    setDocumentInfoList([
      ...documentInfoList,
      {
        docTypeId: '',
        docNoLength: [],
        numMandatory: false,
      },
    ]);
  };
  const deleteDocumentList = (event, index) => {
    const arr = documentInfoList.filter((g, i) => index !== i);
    setDocumentInfoList(arr);
  };
  const deleteNomineeList = (event, index) => {
    const arr = documentInfoList.filter((g, i) => index !== i);
    setNomineeInfoList(arr);
  };
  const handleAddNomineeList = () => {
    setNomineeInfoList([
      ...nomineeInfoList,
      {
        docTypeId: '',
        docNoLength: [],
        numMandatory: false,
      },
    ]);
  };

  const handleDocumentList = (e, index) => {
    let resultObj;
    const docArray = [...documentInfoList];
    const { name, value } = e.target;
    if (name == 'numberRadio' && value == 'numM') {
      docArray[index]['numMandatory'] = true;
    }
    if (name == 'numberRadio' && value == 'numOpt') {
      docArray[index]['numMandatory'] = false;
    }
    if (name == 'docNoLength') {
      resultObj = myValidate('docLengthVal', value);
      if (resultObj?.status) {
        return;
      }
      docArray[index][name] = resultObj?.value;
      setDocumentInfoList(docArray);
      return;
    }
    docArray[index][name] = value;
    setDocumentInfoList(docArray);
  };

  const handleNominiList = (e, index) => {
    let resultObj;
    const { name, value } = e.target;
    const nomArray = [...nomineeInfoList];
    if (name == 'numberRadio' && value == 'numM') {
      nomArray[index]['numMandatory'] = true;
    }
    if (name == 'numberRadio' && value == 'numOpt') {
      nomArray[index]['numMandatory'] = false;
    }
    if (name == 'docNoLength') {
      resultObj = myValidate('docLengthVal', value);
      if (resultObj?.status) {
        return;
      }
      nomArray[index][name] = resultObj?.value;
      setNomineeInfoList(nomArray);
      return;
    }
    nomArray[index][name] = value;
    setNomineeInfoList(nomArray);
  };

  const handleProject = (e) => {
    const { value } = e.target;
    setProjectId(value);
  };

  const onEditPage = (id, item) => {
    console.log("items=======",item);
    setProjectId(item.projectId);
    setServiceId(item.serviceId);
    let newList;
    let newDocList;
    newList = item?.serviceRules?.nomineeDocs?.map((ele) => ({
      docTypeId: ele.docTypeId,
      docNoLength: ele.docNoLength,
      numberRadio: ele.isDocNoMandatory ? 'numM' : 'numOpt',
      numMandatory: ele.isDocNoMandatory ? true : false,
      docRadio: ele.isMandatory ? 'docM' : 'docOpt',
    }));
    newDocList = item?.serviceRules?.nomineeDocs?.map((ele) => ({
      docTypeId: ele.docTypeId,
      docNoLength: engToBang(ele.docNoLength),
      numberRadio: ele.isDocNoMandatory ? 'numM' : 'numOpt',
      numMandatory: ele.isDocNoMandatory ? true : false,
      docRadio: ele.isMandatory ? 'docM' : 'docOpt',
    }));
    setNomineeInfoList(newList);
    setDocumentInfoList(newDocList);
  };

  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };
    if (projectId == null || projectId == 'নির্বাচন করুন') {
      result = false;
      formErrors.projectId = 'প্রকল্পের নাম নির্বাচন করুন';
    }
    setFormErrors(formErrors);
    return result;
  };

  const handleService = (e) => {
    const { value } = e.target;
    setServiceId(value);
  };

  let getProject = async () => {
    try {
      let projectTypeData = await axios.get(allProjectRoute, config);
      setProjectList(projectTypeData.data.data);
      getServiceList();
    } catch (err) { 
      // 
    }
  };
  let getServiceList = async () => {
    try {
      let serviceTypeData = await axios.get(serviceName + '/' + compoName + '?isPagination=false&status=user', config);
      setServiceList(serviceTypeData.data.data);
    } catch (err) { 
      // 
    }
  };
  let getDocTypeList = async () => {
    try {
      let docTypeData = await axios.get(docTypeRoute, config);
      setDocTypeData(docTypeData.data.data);
    } catch (err) {
      // 
     }
  };

  let getDocInfo = async () => {
    try {
      let docInfoData = await axios.get(documentRought + '?isPagination=false', config);
      setDocInfoList(docInfoData.data.data);
    } catch {
      // 
     }
  };
 
  let onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    let docNoLengthArray = [];
    documentInfoList.forEach((elem) => {
      if (elem?.docNoLength?.includes(',')) {
        docNoLengthArray = elem.docNoLength.split(',');
        let newdocNoLengthArray = docNoLengthArray.map((elem) => bangToEng(elem));
        elem.docNoLength = newdocNoLengthArray;
      } else if (elem.docNoLength) {
        docNoLengthArray[0] = bangToEng(elem.docNoLength);
        elem.docNoLength = docNoLengthArray;
      }
      docNoLengthArray = [];
    });

    // nomineeInfoList.forEach((elem) => {
    //   if (elem.docNoLength.includes(",")) {
    //     docNoLengthArray = elem.docNoLength.split(",");
    //     elem.docNoLength = docNoLengthArray;
    //   } else if (elem.docNoLength.length >= 1) {
    //     docNoLengthArray[0] = bangToEng(Number(elem.docNoLength));
    //     elem.docNoLength = docNoLengthArray;
    //   }
    // })(nomineeInfoList);

    payload = {
      projectId,
      serviceId,
      serviceRules: {
        memberDocs: documentInfoList,
        nomineeDocs: nomineeInfoList,
      },
    };
    if (result) {
      try {
        let selectedMember = await axios.post(documentRought, payload, config);
        NotificationManager.success(selectedMember.data.message, ' ', 5000);
        setDocumentInfoList([]);
        setNomineeInfoList([]);
        handleAddNomineeList();
        handleAddDocumentList();
        setServiceId(null);
        setProjectId(null);
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  return (
    <>
      <Grid container className="section">
        <Grid item xs={12}>
          <Grid container spacing={2.5}>
            <Grid item lg={4} md={6} xs={12}>
              <TextField
                fullWidth
                label={star('প্রকল্পের নাম')}
                name="projectName"
                onChange={handleProject}
                select
                SelectProps={{ native: true }}
                value={projectId ? projectId : ' '}
                variant="outlined"
                size="small"
              >
                <option value={'নির্বাচন করুন'}>- নির্বাচন করুন -</option>
                {projectList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.projectNameBangla}
                  </option>
                ))}
              </TextField>
              {(projectId == 'নির্বাচন করুন' || !projectId) && (
                <span style={{ color: 'red' }}>{formErrors.projectId}</span>
              )}
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <TextField
                fullWidth
                label={star('সার্ভিসের তালিকা')}
                name="serviceName"
                onChange={handleService}
                select
                SelectProps={{ native: true }}
                value={serviceId ? serviceId : ' '}
                variant="outlined"
                size="small"
              >
                <option value={'নির্বাচন করুন'}>- নির্বাচন করুন -</option>
                {serviceList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.serviceName}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {serviceId && serviceId == '14' && (
        <>
          <Grid container className="section" id="toGo">
            <DynamicDocumentList
              documentInfoList={documentInfoList}
              handleDocumentList={handleDocumentList}
              docTypeData={docTypeData}
              numMandatory={numMandatory}
              handleAddDocumentList={handleAddDocumentList}
              deleteDocumentList={deleteDocumentList}
            />
          </Grid>
          <Grid container className="section">
            <DynamicNominiList
              nomineeInfoList={nomineeInfoList}
              handleNominiList={handleNominiList}
              docTypeData={docTypeData}
              numMandatory={numMandatory}
              handleAddNomineeList={handleAddNomineeList}
              deleteNomineeList={deleteNomineeList}
            />
          </Grid>
        </>
      )}
      <Grid container className="section">
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Tooltip title="সংরক্ষণ করুন">
            <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সংরক্ষণ করুন
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item xs={12}>
          <Box>
            <SubHeading>ডকুমেন্ট ম্যাপিং তথ্য</SubHeading>
            <TableContainer className="table-container">
              <Table size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center">ক্রমিক</TableCell>
                    <TableCell>প্রকল্পের নাম</TableCell>
                    <TableCell>সেবার ধরন</TableCell>
                    <TableCell>প্রয়োজনীয় ডকুমেন্ট</TableCell>
                    <TableCell align="center">সম্পাদন</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {docInfoList
                    ? docInfoList.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell scope="row" align="center">
                          {engToBang(i + 1)}
                        </TableCell>
                        <TableCell scope="row">
                          <Tooltip title={<div className="tooltip-title">{item.projectNameBangla}</div>} arrow>
                            <span className="data">{item.projectNameBangla}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell scope="row">
                          <Tooltip title={<div className="tooltip-title">{item.serviceName}</div>} arrow>
                            <span className="data">{item.serviceName}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell scope="row">
                          {item &&
                            item?.serviceRules &&
                            item?.serviceRules?.memberDocs?.map((data, i) => {
                              const lastIndex = item?.serviceRules?.memberDocs?.length - 1;
                              return <span key={i}>{`${data.docTypeDesc}${lastIndex == i ? '' : ','}`} &nbsp;</span>;
                            })}
                          {item &&
                            item.serviceRules &&
                            item?.serviceRules?.nomineeDocs?.map((data, i) => {
                              const lastIndex = item?.serviceRules?.nomineeDocs?.length - 1;
                              return <span key={i}>{`${data.docTypeDesc}${lastIndex == i ? '' : ','}`} &nbsp;</span>;
                            })}
                        </TableCell>
                        <TableCell scope="row" align="center">
                          <a href="#toGo">
                            <Button onClick={() => onEditPage(item.id, item)}>
                              <EditIcon className="table-icon edit" />
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                    : ''}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default DocMapping;
