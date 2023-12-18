import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { Button, Grid, TextField, Tooltip } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  GlAcList,
  allDoptor,
  childOffice,
  officeLayer,
  projectList,
  samityByOffice,
  samityReportGet,
  serviceName,
} from '../../../url/coop/ApiList';

import star from 'components/utils/coop/star';
import { Fragment } from 'react';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { componentReportBy } from '../../../url/ReportApi';
import { ReportShowFromData } from './reportShowFromData';
import { urlGenerator } from './reportUrl';

export function ReportG({ reportBunchName }) {
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const DoptorId = getTokenData?.doptorId;
  const [url] = useState();
  const [reportList, setReportList] = useState([]);
  const [reportId, setReportId] = useState(0);
  const [disPlayField, setDisplayField] = useState([]);
  const [report, setReport] = useState();
  const [samity, setSamity] = useState([]);
  const [member, setMember] = useState([]);
  const [doptor, setDoptor] = useState(null);
  const [doptorList, setDoptorList] = useState([]);
  const [layerList, setLayerList] = useState([]);
  const [layerId, setLayerId] = useState(getTokenData?.layerId);
  const [officeList, setOfficeList] = useState([]);
  const [doptorAlive, setDoptorAlive] = useState(false);
  const [samityAlive, setSamityAlive] = useState(false);
  const [userNameAlive, setUserNameAlive] = useState(false);
  const [startDateAlive, setStartDateAlive] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [pdfActive, setPdfActive] = useState(false);
  const [serviceInfoActive, setServiceInfoActive] = useState(false);
  const [serviceInfo, setServiceInfo] = useState([]);
  const [projectId] = useState(null);
  const [projectName, setProjectName] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);
  const [startDate] = useState(new Date());
  const [userName, setUserName] = useState(null);
  const [glType, setGlType] = useState([]);
  const [glTypeAlive, setGlTypeAlive] = useState(false);
  const [officeDisableStatus, setOfficeDisableStatus] = useState(false);

  const config = localStorageData('config');
  const componentName = localStorageData('componentName');

  useEffect(() => {
    getDoptorList();
    getLayerList();
    getOfficeList(getTokenData?.layerId);
    getSamityReport();
    getProject();
  }, []);

  useEffect(() => {
    if (reportId != 1) {
      getSamityReport();
    }
  }, [disPlayField]);

  useEffect(() => {
    setSamity([]);
    setMember([]);
    setDoptorAlive(false);
    setProjectName([]);
    setAccountInfo([]);
    setPdfActive(false);
    getOfficeList(getTokenData?.layerId);
    getProject();
  }, [report]);

  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      userName: userName,
    });
  }, [userNameAlive]);

  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      doptorId: doptor,
    });
  }, [doptorAlive]);

  useEffect(() => {
    setSelectedValue({
      ...selectedValue,
      date: moment(new Date()).format('yyyy-MM-DD'),
    });
  }, [startDateAlive]);

  useEffect(() => {}, [url]);

  useEffect(() => {
    if (samityAlive && selectedValue.officeId) {
      getSamityName();
    }
  }, [selectedValue]);

  useEffect(() => {
    setMember([]);
  }, [projectId]);

  useEffect(() => {
    if (glTypeAlive) {
      getGlType();
    }
  }, [glTypeAlive]);

  useEffect(() => {
    getServiceInfo();
  }, [serviceInfoActive]);

  const parameterBn = {
    samity: 'সমিতির নাম',
    doptor: 'দপ্তর',
    project: 'প্রকল্প',
    office: 'অফিস',
    member: 'সদস্য',
    accountId: 'একাউন্ট নম্বর',
    tranId: 'ট্রান্সাকশন নম্বর',
    date: 'তারিখ',
    glType: 'লেজার / হিসাবের ধরন',
    districtOffice: 'জেলা অফিস',
    serviceInfo: 'সেবাসমূহ',
  };

  const getDoptorList = async () => {
    try {
      const doptorInfo = await axios.get(allDoptor + '/' + componentName, config);
      const doptorInfoData = doptorInfo.data.data;
      setDoptorList(doptorInfoData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getLayerList = async () => {
    try {
      const layerInfo = await axios.get(officeLayer, config);
      const layerInfoData = layerInfo.data.data;
      setLayerList(layerInfoData);
      setOfficeList([]);
      setOfficeDisableStatus(false);
    } catch (err) {
      errorHandler(err);
    }
  };
  const getOfficeList = async (layerId) => {
    try {
      let doptorId = doptor ? doptor : DoptorId;
      const officeInfo = await axios.get(childOffice + '?doptorId=' + doptorId + '&layerId=' + layerId, config);
      const officeInfoData = officeInfo.data.data;
      if (officeInfoData && officeInfoData.length === 1) {
        setSelectedValue({
          ...selectedValue,
          userName,
          officeId: officeInfoData[0]?.id,
          samityId: null,
          memberId: null,
        });
        setOfficeDisableStatus(true);
      }
      setOfficeList(officeInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };

  const getGlType = async () => {
    try {
      const result = await (await axios.get(GlAcList + '?isPagination=false&parentId=0', config))?.data?.data;
      setGlType(result);
    } catch (ex) {
      //
    }
  };

  const getServiceInfo = async () => {
    const serviceNameData = await axios.get(serviceName, config);
    let serviceNames = serviceNameData.data.data;
    let shortserviceName = serviceNames.sort((a, b) => {
      return a.id - b.id;
    });
    setServiceInfo(shortserviceName);
  };

  const getSamityReport = async () => {
    try {
      const samityReportData = await (await axios.get(samityReportGet + reportBunchName, config))?.data?.data[0];
      setDoptor(samityReportData.doptorId);
      setUserName(samityReportData.userName);

      let samityReportName = [];
      for (const element of samityReportData?.data) {
        let parameter = [];
        let jasparParameter = [];
        for (const e of element.parameter) {
          if (e.status == true) {
            parameter.push(e.paramName);
            jasparParameter.push(e.jasparParamName);
          }
        }

        samityReportName.push({
          id: element.id,
          reportName: element.reportFrontNameBn,
          reportFrom: element.reportFrom,
          parameter,
          jasparParameter,
          typeName: element.typeName,
          reportJasperName: element.reportBackName,
          hyperLinkAction: element.hyperLinkAction,
        });
      }

      if (samityReportName.length == 1) {
        setReportId(1);
        setReport(samityReportName[0].reportName);
        samityReportName[0].reportFrom == 'dataBase'
          ? setSelectedValue({
              reportName: samityReportName[0].reportName,
              typeName: samityReportName[0].typeName,
              reportFrom: 'dataBase',
              hyperLinkAction: samityReportName[0].hyperLinkAction,
            })
          : setSelectedValue({
              reportName: samityReportName[0].reportName,
              reportFrom: 'jaspar',
            });

        const pera = [];

        for (const element of samityReportName) {
          if (element.id == 1) {
            for (const p of element.parameter) {
              pera.push(parameterBn[p]);
              if (p == 'samity') {
                setSamityAlive(true);
              }
              if (p == 'doptor') {
                setDoptorAlive(true);
              }
              if (p == 'userName') {
                setUserNameAlive(true);
              }
              if (p == 'date') {
                setStartDateAlive(true);
              }
              if (p == 'glType') {
                setGlTypeAlive(true);
              }
              if (p == 'serviceInfo') {
                setServiceInfoActive(true);
              }
            }
          }
        }
        setDisplayField(pera);
        document?.getElementById('report').setAttribute('disabled', 'true');
      }
      setReportList(samityReportName);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSamityName = async () => {
    try {
      let samityData;
      if (
        (parseInt(selectedValue.officeId) > 0 && parseInt(selectedValue.projectId) == 0) ||
        (parseInt(selectedValue.officeId) > 0 && !selectedValue.projectId)
      ) {
        samityData = await (await axios.get(samityByOffice + selectedValue.officeId, config))?.data?.data;
      } else if (parseInt(selectedValue.officeId) > 0 && parseInt(selectedValue.projectId) > 0) {
        samityData = await (
          await axios.get(samityByOffice + selectedValue.officeId + '&projectId=' + selectedValue.projectId, config)
        )?.data?.data;
      }
      samityData.push({ id: samityData.length + 1, samityName: 'all' });
      setSamity(samityData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getProject = async () => {
    try {
      const project = await axios.get(projectList + 'project?isPagination=false');
      let projectValues = project?.data?.data;
      setProjectName(projectValues);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleInputChangeDoptor = (e) => {
    const { value } = e.target;
    setLayerId(null);
    setLayerList([]);
    setOfficeList([]);
    setSamity([]);
    setMember([]);
    setProjectName([]);
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
      memberId: null,
    });
    setOfficeDisableStatus(false);
    if (value && value != 'নির্বাচন করুন') {
      setDoptor(value);
      getLayerList(value);
      setDoptorAlive(true);
    } else {
      setDoptor(null);
    }
  };

  const handleInputChangeReport = (e) => {
    const { value } = e.target;
    let pera = [];
    if (value == 0) {
      setReport();
      setReportId();
    } else {
      setReportId(value);
      setReport(reportList[parseInt(value) - 1].reportName);
      reportList[parseInt(value) - 1].reportFrom == 'dataBase'
        ? setSelectedValue({
            reportName: reportList[parseInt(value) - 1].reportName,
            typeName: reportList[parseInt(value) - 1].typeName,
            reportFrom: 'dataBase',
            hyperLinkAction: reportList[parseInt(value) - 1].hyperLinkAction,
          })
        : setSelectedValue({
            reportName: reportList[parseInt(value) - 1].reportName,
            reportFrom: 'jaspar',
          });

      for (const element of reportList) {
        if (element.id == value) {
          for (const p of element.parameter) {
            pera.push(parameterBn[p]);
            if (p == 'samity') {
              setSamityAlive(true);
            }
            if (p == 'doptor') {
              setDoptorAlive(true);
            }
            if (p == 'userName') {
              setUserNameAlive(true);
            }
            if (p == 'date') {
              setStartDateAlive(true);
            }
            if (p == 'glType') {
              setGlTypeAlive(true);
            }
            if (p == 'serviceInfo') {
              setServiceInfoActive(true);
            }
          }
        }
      }
      setDisplayField(pera);
    }
    getLayerList();
  };

  const handleInputChangeSamity = (e) => {
    const { value } = e.target;
    if (value != 0) {
      const data = JSON.parse(value);
      const id = data.samityName == 'সকল' ? 0 : data.id;
      setSelectedValue({ ...selectedValue, samityId: parseInt(id) });
    }
  };
  const handleInputChangeDoptorLayer = (e) => {
    setOfficeList([]);
    setOfficeDisableStatus(false);
    setSamity([]);
    setMember([]);
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
      memberId: null,
    });
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setLayerId(value);
      getOfficeList(value);
    }
  };

  const handleInputChangeOffice = (e) => {
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setSelectedValue({
        ...selectedValue,
        officeId: parseInt(value),
      });
      setMember([]);
    }
  };

  const handleInputChangeProject = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, projectId: parseInt(value) });
  };

  const handleInputChangeMember = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, memberId: parseInt(value) });
  };

  const handleInputServiceInfo = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, serviceId: parseInt(value) });
  };

  const handleInputChangeAccountNumber = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, accountId: parseInt(value) });
  };

  const handleInputChangeTranId = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, tranId: value });
  };

  const handleDateChangeEx = (e) => {
    const date = new Date(e);
    setSelectedValue({
      ...selectedValue,
      date: moment(date).format('yyyy-MM-DD'),
    });
  };

  const handleInputChangeGlType = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, glType: value });
  };

  const reportGenerator = async () => {
    if (selectedValue.reportFrom == 'dataBase') {
      setPdfActive(true);
    } else {
      let selectTedReportList;
      for (const element of reportList) {
        if (selectedValue.reportName == element.reportName) {
          selectTedReportList = element;
        }
      }
      const url = urlGenerator(selectedValue, selectTedReportList, componentReportBy);
      try {
        window.open(url);
      } catch (error) {
        //
      }
    }
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <TextField
            fullWidth
            label="রিপোর্ট"
            name="report"
            id="report"
            required
            select
            SelectProps={{ native: true }}
            value={reportId || 0}
            onChange={handleInputChangeReport}
            variant="outlined"
            size="small"
          >
            <option value={0}>- নির্বাচন করুন -</option>
            {reportList.map((option, i) => (
              <option key={i} value={option.id}>
                {option.reportName}
              </option>
            ))}
          </TextField>
        </Grid>

        {DoptorId == 1 && (
          <Grid item lg={4} md={4} sm={6} xs={12} hidden={!disPlayField.includes('অফিস') ? true : false}>
            <TextField
              fullWidth
              label={star('দপ্তরের তালিকা')}
              name="doptor"
              id="doptor"
              select
              SelectProps={{ native: true }}
              onChange={(e) => handleInputChangeDoptor(e)}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
              value={doptor}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {doptorList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
          </Grid>
        )}

        <Grid item lg={4} md={4} sm={6} xs={12} hidden={!disPlayField.includes('অফিস') ? true : false}>
          <TextField
            fullWidth
            label={star('দপ্তর লেয়ার')}
            id="officeLayer"
            name="officeLayer"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeDoptorLayer(e)}
            type="text"
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={layerId != null ? layerId : ' '}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {layerList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameBn}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12} hidden={!disPlayField.includes('অফিস') ? true : false}>
          <TextField
            fullWidth
            label={star('অফিসের তালিকা')}
            id="upozilla"
            name="upazila"
            select
            SelectProps={{ native: true }}
            disabled={officeDisableStatus}
            onChange={(e) => handleInputChangeOffice(e)}
            type="text"
            value={selectedValue?.officeId ? selectedValue.officeId : 'নির্বাচন করুন'}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {officeList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameBn}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12} hidden={!disPlayField.includes('সেবাসমূহ') ? true : false}>
          <TextField
            fullWidth
            label={star('সেবাসমূহ')}
            id="serviceInfo"
            name="serviceInfo"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputServiceInfo(e)}
            type="text"
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {serviceInfo.map((option, i) => (
              <option key={i} value={option.id}>
                {option.serviceName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12} hidden={!disPlayField.includes('প্রকল্প') ? true : false}>
          <TextField
            fullWidth
            label={star('প্রকল্পের  নাম')}
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleInputChangeProject(e)}
            type="text"
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFF' }}
            value={projectId}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projectName.map((option, i) => (
              <option key={i} value={option.id}>
                {option.projectNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
          sx={!disPlayField.includes('সমিতির নাম') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="সমিতির নাম"
            name="serviceId"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeSamity}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {samity?.map((option, i) => (
              <option
                key={i}
                value={JSON.stringify({
                  id: option.id,
                  samityName: option.samityName,
                })}
              >
                {option.samityName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
          sx={!disPlayField.includes('সদস্য') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="সদস্য "
            name="serviceId"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeMember}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {member?.map((option, i) => (
              <option key={i} value={option.id}>
                {option.nameBn}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
          sx={!disPlayField.includes('একাউন্ট নম্বর') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="একাউন্ট নম্বর "
            name="accountNumber"
            id="accountNumber"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeAccountNumber}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {accountInfo?.map((option, i) => (
              <option key={i} value={option.accountId}>
                {option.accountNo}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
          sx={!disPlayField.includes('ট্রান্সাকশন নম্বর') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="ট্রান্সাকশন নম্বর"
            name="tranId"
            id="tranId"
            type="text"
            required
            onChange={handleInputChangeTranId}
            variant="outlined"
            size="small"
          ></TextField>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
          sx={!disPlayField.includes('লেজার / হিসাবের ধরন') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <TextField
            fullWidth
            label="লেজার / হিসাবের ধরন "
            name="glType"
            required
            select
            SelectProps={{ native: true }}
            onChange={handleInputChangeGlType}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {glType.map((option, i) => {
              return (
                <option key={i} value={option.glacType}>
                  {option.glacName}
                </option>
              );
            })}
          </TextField>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
          sx={!disPlayField.includes('তারিখ') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={star('তারিখ')}
              name="startDate"
              value={startDate}
              disabled=""
              onChange={(e) => handleDateChangeEx(e)}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" style={{ backgroundColor: '#FFF' }} />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid
          item
          lg={12}
          md={12}
          xs={12}
          sx={
            ({ textAlign: 'center' },
            disPlayField.length == 0 ? { display: 'none' } : { display: 'visible', mb: 1.5 },
            {
              display: 'flex',
              justifyContent: 'center',
            })
          }
        >
          <Tooltip title="রিপোর্ট দেখুন">
            <Button
              variant="contained"
              className="btn btn-primary"
              target="_blank"
              onClick={reportGenerator}
              startIcon={<WysiwygIcon />}
            >
              {' '}
              রিপোর্ট দেখুন
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      {/* /////////////////////////////////////////// */}
      <Grid container pt={2}>
        {pdfActive && (
          <Grid item xs={12} md={12} sm={12}>
            {selectedValue?.reportFrom == 'dataBase' && (
              <ReportShowFromData
                selectedValue={{
                  ...selectedValue,
                  reportBunchName: reportBunchName,
                }}
              />
            )}
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
}
