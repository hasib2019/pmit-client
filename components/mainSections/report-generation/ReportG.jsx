import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { Autocomplete, Button, FormControl, FormControlLabel, Grid, Switch, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import FromControlJSON from 'service/form/FormControlJSON';
import {
  customerAccountInfo,
  employeeRecord,
  fieldOffRoute,
  getAllDoptor,
  getMemberBySamity,
  getOfficeLayer,
  loanProject,
  officeName,
  product,
  samityByOffice,
  samityReportGet,
} from '../../../url/ApiList';
import star from '../loan-management/loan-application/utils';
import { ReportShowFromData } from './reportShowFromData';
import { urlGenerator } from './reportUrl';
// import { componentReportBy } from "../../../url/ReportApi";
import { liveIp } from 'config/IpAddress';
import { fetchAllItemCategory } from 'features/inventory/category/categoryApi';
import { fetchAllItemGroup } from 'features/inventory/item-group/ItemGroupApi';
import { fetchStore } from 'features/inventory/item-store/item-store-api';
import { fetchItem } from 'features/inventory/item/itemApi';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
// import { isStoreAdminUrl } from '../../../url/InventoryApiList';

export function ReportG({ reportBunchName }) {
  const [storeList, setStoreList] = useState([]);

  // const [url, setUrl] = useState();
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  // const officeId = getTokenData?.officeId;
  const DoptorId = getTokenData?.doptorId;
  const config = localStorageData('config');
  const [reportList, setReportList] = useState([]);
  const [disPlayField, setDisplayField] = useState([]);
  const [report, setReport] = useState();
  const [samity, setSamity] = useState([]);
  const [member, setMember] = useState([]);
  const [doptor, setDoptor] = useState(null);
  // const [project, setProject] = useState(0);
  // const [office, setOffice] = useState([]);
  // const [officeAlive, setOfficeAlive] = useState(false);
  // const [projectAlive, setProjectAlive] = useState(false);
  // const [doptorAlive, setDoptorAlive] = useState(false);
  // const [memberAlive, setMemberAlive] = useState(false);
  // const [samityAlive, setSamityAlive] = useState(false);
  const [userNameAlive, setUserNameAlive] = useState(false);
  const [startDateAlive, setStartDateAlive] = useState(false);
  const [toDateAlive, setToDateAlive] = useState(false);
  const [fromDateAlive, setFromDateAlive] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const [pdfActive, setPdfActive] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState([]);
  // const [productId, setProductId] = useState('নির্বাচন করুন');
  const [allProductData, setAllProductData] = useState([]);
  // const [disableProduct, setDisableProduct] = useState('');
  // const [upozillaData, setUpozilaData] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [userName, setUserName] = useState(null);
  const [serviceInfo] = useState([]);
  // const [serviceInfoActive, setServiceInfoActive] = useState(false);
  const [reportId, setReportId] = useState(0);
  // const [districtOfficeAlive, setDistrictOfficeAlive] = useState(false);
  const [doptorList, setDoptorList] = useState([]);
  const [layerList, setLayerList] = useState([]);
  const [layerId, setLayerId] = useState(null);
  const [officeList, setOfficeList] = useState([]);
  const [fieldOfficerList, setFieldOfficerList] = useState([]);
  const [accountStatus, setAccountStatus] = useState('নির্বাচন করুন');
  const [officeDisableStatus, setOfficeDisableStatus] = useState(false);
  const [fieldOfficerDisableStatus, setFieldOfficerDisableStatus] = useState(false);
  const [projectDisableStatus, setProjectDisableStatus] = useState(false);
  const [isMigrated, setIsMigrated] = useState(false);
  const [withServiceCharge, setWithServiceCharge] = useState(false);

  const [layerDisableStatus, setLayerDisableStatus] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  // const [isStoreAdmin, setisStoreAdmin] = useState(false);
  const [employeeReacord, setEmployeeReacord] = useState([]);
  const componentName = localStorageData('componentName');
  const [adminDeskObj, setAdminDeskObj] = useState(undefined);
  useEffect(() => {
    getSamityReport();
    getDoptorList();
    if (componentName === 'inventory') {
      getStoreList();
      getGroupList();
      // getStroeAdmin();
    }
  }, []);

  useEffect(() => {
    if (DoptorId != 1 && DoptorId != 4 && DoptorId != 8) {
      getLayerList(DoptorId);
    }
    if (DoptorId == 1) {
      getAllProject(DoptorId);
    } else {
      setProjectDisableStatus(false);
      getProject();
    }
  }, [DoptorId]);
  useEffect(() => {
    if (reportId != 1) {
      getSamityReport();
    }
  }, [disPlayField]);

  useEffect(() => {
    // setOffice([]);
    setSamity([]);
    // setProject([]);
    setMember([]);
    // setUpozilaData([]);
    setProjectName([]);
    setAccountInfo([]);
    // setPdfActive(false);
    setUserNameAlive(false);
    // getDistrict();
    getDoptorList();
    setProjectDisableStatus(false);
    getProject();
  }, [report]);

  useEffect(() => {
    selectedValue.userName = userName;
    setSelectedValue(selectedValue);
  }, [userNameAlive]);

  // useEffect(() => {
  //   getSamityName(isMigrated);
  // }, [officeAlive]);
  // useEffect(() => {}, [projectAlive]);
  // useEffect(() => {
  //   setSelectedValue({
  //     ...selectedValue,
  //     doptorId: doptor && doptor != "নির্বাচন করুন" ? doptor : DoptorId,
  //   });
  // }, [doptorAlive]);

  useEffect(() => {
    if (startDateAlive) {
      setSelectedValue({
        ...selectedValue,
        date: moment(new Date()).format('yyyy-MM-DD'),
      });
    }
  }, [startDateAlive]);

  useEffect(() => {
    if (toDateAlive) {
      setSelectedValue({
        ...selectedValue,
        toDate: moment(new Date()).format('yyyy-MM-DD'),
      });
    }
  }, [toDateAlive]);
  useEffect(() => {
    if (fromDateAlive) {
      setSelectedValue({
        ...selectedValue,
        fromDate: moment(new Date()).format('yyyy-MM-DD'),
      });
    }
  }, [fromDateAlive]);
  // useEffect(() => {}, [memberAlive]);
  // useEffect(() => {}, [samityAlive]);

  // useEffect(() => {}, [pdfActive]);

  // useEffect(() => { }, [url]);

  useEffect(() => {
    getSamityName(isMigrated);
    if (selectedValue.samityId && selectedValue.projectId) {
      getMember();
    }
  }, [selectedValue]);

  useEffect(() => {
    setMember([]);
  }, [projectId]);
  // useEffect(() => {
  //   getServiceInfo();
  // }, [serviceInfoActive]);
  // const getServiceInfo = async () => {
  //   try {
  //     const result = await (await axios.get(serviceName, config)).data.data;
  //     setServiceInfo(result);
  //   } catch (ex) { }
  // };

  const parameterBn = {
    samity: 'সমিতি',
    doptor: 'দপ্তর',
    project: 'প্রকল্প',
    office: 'অফিস',
    fieldOfficer: 'মাঠ সংগঠক',
    member: 'সদস্য',
    accountId: 'হিসাবের নম্বর',
    accountStatus: 'হিসাবের অবস্থা',
    tranId: 'ট্রান্সাকশন নম্বর',
    date: 'তারিখ',
    toDate: 'শেষের তারিখ',
    fromDate: 'শুরুর তারিখ',
    districtOffice: 'জেলা অফিস',
    serviceInfo: 'সেবাসমূহ',
    store: 'ষ্টোর',
    item: 'আইটেম',
    disbursementDate: 'ঋণ বিতরণের তারিখ',
    realizationDate: 'ঋণ আদায়ের তারিখ',
    employeeId: 'কর্মকর্তা',
    isMigrated: 'সমিতির ধরণ',
    withServiceCharge: 'সার্ভিস চার্জ সহ',
    productId: 'প্রোডাক্ট',
  };

  const accountStatusList = [
    { label: 'সচল', value: 'ACT' },
    { label: 'অচল', value: 'CLS' },
  ];
  // const getStroeAdmin = async () => {
  //   const isStoreAdmin = await axiosInstance.get(isStoreAdminUrl);
  //   setisStoreAdmin(isStoreAdmin?.data?.isStoreAdmin);
  // };
  let getEmployeeName = async (value) => {
    try {
      let employeeRecordData = await axios.get(employeeRecord + value, config);
      setEmployeeReacord(employeeRecordData.data.data);
    } catch (error) {
      if (error.response) {
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getSamityReport = async () => {
    try {
      const samityReportData = await (await axios.get(samityReportGet + reportBunchName, config)).data.data[0];

      // setDoptor(samityReportData.doptorId);
      setUserName(samityReportData.userName);
      let samityReportName = [];

      for (const element of samityReportData.data) {
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
          reportJasperName: element.reportBackName ? element.reportBackName : null,
          hyperLinkAction: element.hyperLinkAction,
        });
      }
      let pera = [];

      if (samityReportName.length == 1) {
        setReportId(1);
        setReport(samityReportName[0]);
        samityReportName[0].reportFrom == 'dataBase'
          ? await setSelectedValue({
              reportName: samityReportName[0].reportName,
              typeName: samityReportName[0].typeName,
              reportFrom: 'dataBase',
              hyperLinkAction: samityReportName[0].hyperLinkAction,
            })
          : await setSelectedValue({
              reportName: samityReportName[0].reportName,
              reportFrom: 'jaspar',
            });

        for (const element of samityReportName) {
          if (element.id == 1) {
            for (const p of element.parameter) {
              pera.push(parameterBn[p]);
              // if (p == 'office') {
              //   setOfficeAlive(true);
              // }
              // if (p == 'samity') {
              //   setSamityAlive(true);
              // }
              // if (p == 'member') {
              //   setMemberAlive(true);
              // }
              // if (p == 'doptor') {
              //   setDoptorAlive(true);
              // }
              // if (p == 'project') {
              //   setProjectAlive(true);
              // }
              if (p == 'accountId') {
                setUserNameAlive(true);
              }
              if (p == 'userName') {
                setUserNameAlive(true);
              }
              if (p == 'date') {
                setStartDateAlive(true);
              }
              if (p == 'fromDate') {
                setFromDateAlive(true);
              }
              if (p == 'toDate') {
                setToDateAlive(true);
              }
              // if (p == 'serviceInfo') {
              //   setServiceInfoActive(true);
              // }
            }
          }
        }

        setDisplayField(pera);
      }

      setReportList(samityReportName);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const getSamityName = async (isMigrated) => {
    try {
      let samityData, url;
      if (DoptorId == 4 || DoptorId == 8) {
        if (DoptorId == 4) {
          if (isMigrated == true) {
            url = samityByOffice + 4 + '&isMigrated=' + isMigrated;
          } else {
            url = samityByOffice + 4;
          }
          samityData = await (await axios.get(url, config)).data.data;
        } else if (DoptorId == 8) {
          if (isMigrated == true) {
            url = samityByOffice + 8 + '&isMigrated=' + isMigrated;
          } else {
            url = samityByOffice + 8;
          }
          samityData = await (await axios.get(url, config)).data.data;
        }
        setSamity(samityData);
        return;
      }
      if (
        parseInt(selectedValue.officeId) &&
        parseInt(selectedValue.projectId) &&
        parseInt(selectedValue.officeId) > 0 &&
        parseInt(selectedValue.projectId) > 0
      ) {
        if (isMigrated == true) {
          url =
            samityByOffice +
            selectedValue.officeId +
            '&projectId=' +
            selectedValue.projectId +
            '&isMigrated=' +
            isMigrated;
        } else {
          url = samityByOffice + selectedValue.officeId + '&projectId=' + selectedValue.projectId;
        }

        samityData = await (await axios.get(url, config)).data.data;
        setSamity(samityData);
      } else if (DoptorId == 1 && parseInt(selectedValue.officeId) && parseInt(selectedValue.officeId) > 0) {
        samityData = await (await axios.get(samityByOffice + selectedValue.officeId, config)).data.data;
        setSamity(samityData);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getMember = async () => {
    try {
      if (parseInt(selectedValue.samityId) > 0) {
        const memberData = await (await axios.get(getMemberBySamity + selectedValue.samityId, config)).data.data.data;
        setMember(memberData);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      setProjectName(projectList);
      if (projectList && projectList.length === 1) {
        setProjectId(projectList[0]?.id);
        setProjectDisableStatus(true),
          setSelectedValue({
            ...selectedValue,
            doptorId: doptor && doptor != 'নির্বাচন করুন' ? doptor : DoptorId,
            projectId: parseInt(projectList[0]?.id),
            samityId: null,
            memberId: null,
          });
        getSamityName(isMigrated);
        getProduct(parseInt(projectList[0]?.id));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getAllProject = async (doptorId) => {
    try {
      const project = await axios.get(
        loanProject + '/projectWithPagination?page=1&limit=100&doptorId=' + doptorId,
        config,
      );
      let projectList = project.data.data.data;
      setProjectName(projectList);
      if (projectList && projectList.length === 1) {
        setProjectId(projectList[0]?.id);
        setProjectDisableStatus(true),
          setSelectedValue({
            ...selectedValue,
            doptorId: doptor && doptor != 'নির্বাচন করুন' ? doptor : DoptorId,
            projectId: parseInt(projectList[0]?.id),
            samityId: null,
            memberId: null,
          });
        getSamityName(isMigrated);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getProduct = async (projectId) => {
    if (projectId != 'নির্বাচন করুন') {
      try {
        let allProduct;
        if (DoptorId === 1) {
          allProduct = await axios.get(product + '?doptorId=' + doptor + '&projectId=' + projectId, config);
        } else {
          allProduct = await axios.get(product + '?projectId=' + projectId, config);
        }
        let productList = allProduct.data.data;
        if (productList.length == 1) {
          // setProductId(productList?.[0].id);
          setSelectedValue({
            ...selectedValue,
            productId: productList?.[0].id,
            projectId: projectId,
          });
          // setDisableProduct(true);
        } else {
          // setDisableProduct(false);
        }
        setAllProductData(productList);
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
    }
  };

  const handleInputChangeProduct = (e) => {
    const { value } = e.target;
    // setProductId(value);
    setSelectedValue({
      ...selectedValue,
      productId: value,
      projectId: projectId,
    });
    if (
      value &&
      value != 'নির্বাচন করুন' &&
      selectedValue.officeId &&
      selectedValue.projectId &&
      selectedValue.samityId &&
      selectedValue.memberId
    ) {
      getAccountNumber(
        selectedValue.officeId,
        selectedValue.projectId,
        value,
        selectedValue.samityId,
        selectedValue.memberId,
      );
    }
  };

  const getDoptorList = async () => {
    try {
      const doptorInfo = await axios.get(getAllDoptor + '/' + componentName, config);
      const doptorInfoData = doptorInfo.data.data;
      setDoptorList(doptorInfoData);

      if (doptorInfoData && doptorInfoData.length === 1) {
        setDoptor(doptorInfoData[0]?.id);
        if (doptorInfoData[0]?.id == 4) {
          setSelectedValue({
            ...selectedValue,
            doptorId: doptorInfoData[0]?.id,
            officeId: doptorInfoData[0]?.id,
            samityId: null,
          });
        } else if (doptorInfoData[0]?.id == 8) {
          setSelectedValue({
            ...selectedValue,
            doptorId: doptorInfoData[0]?.id,
            officeId: doptorInfoData[0]?.id,
            samityId: null,
          });
        } else {
          getLayerList(doptorInfoData[0]?.id ? doptorInfoData[0].id : DoptorId);
          setSelectedValue({
            ...selectedValue,
            doptorId: doptorInfoData[0]?.id ? doptorInfoData[0].id : DoptorId,
          });
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getLayerList = async (doptorId) => {
    let url;
    if (DoptorId === 1) {
      url = getOfficeLayer + '?doptorId=' + doptorId;
    } else {
      url = getOfficeLayer;
    }
    try {
      const layerInfo = await axios.get(url, config);
      const layerInfoData = layerInfo.data.data;
      setLayerList(layerInfoData);
      if (layerInfoData && layerInfoData.length === 1) {
        setLayerId(layerInfoData[0]?.id);
        getOfficeList(doptorId, layerInfoData[0]?.id);
        setLayerDisableStatus(true);
      }
    } catch (err) {
      errorHandler(err);
    }
  };
  const getOfficeList = async (doptorId, layerId) => {
    let getOfficeListUrl;
    if (DoptorId === 1) {
      getOfficeListUrl = officeName + '?doptorId=' + doptorId + '&layerId=' + layerId;
    } else {
      getOfficeListUrl = officeName + '?layerId=' + layerId;
    }
    try {
      const officeInfo = await axios.get(getOfficeListUrl, config);
      const officeInfoData = officeInfo.data.data;
      // setOfficeList(officeInfoData);
      if (officeInfoData && officeInfoData.length === 1) {
        setSelectedValue({
          ...selectedValue,
          doptorId: doptorId,
          officeId: officeInfoData[0]?.id,
          projectId: projectId,
          samityId: null,
          memberId: null,
          fieldOfficerId: null,
        });
        getEmployeeName(officeInfoData[0]?.id);
        setOfficeDisableStatus(true);
        setFieldOfficerList([]);
        if (disPlayField.includes('মাঠ সংগঠক')) {
          getFieldOfficerList(officeInfoData[0]?.id);
        }
      }
      setOfficeList(officeInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };

  const getFieldOfficerList = async (officeId) => {
    try {
      const fieldOfficerInfo = await axios.get(fieldOffRoute + '?officeId=' + officeId, config);
      const fieldOfficerInfoData = fieldOfficerInfo.data.data;
      setFieldOfficerList(fieldOfficerInfoData);
      if (fieldOfficerInfoData && fieldOfficerInfoData.length === 1) {
        setSelectedValue({
          ...selectedValue,
          officeId,
          fieldOfficerId: fieldOfficerInfoData[0]?.id,
        });
        setFieldOfficerDisableStatus(true);
      }
    } catch (err) {
      errorHandler(err);
    }
  };
  const getStoreList = async () => {
    const stores = await fetchStore();
    const storesList = stores.data;
    if (storesList?.length === 1) {
      setSelectedValue({ ...selectedValue, storeId: storesList[0].id });
    }
    setStoreList(storesList);
  };
  const getItemList = async (categoryId) => {
    const items = await fetchItem(`&category_id=${categoryId}`);
    const allItemsByCategory = items.data;
    const fixedAssetItems = allItemsByCategory.filter((item) => item.goodsType == 163);
    setItemList(fixedAssetItems);
  };
  const getCategoryList = async (groupId) => {
    const categories = await fetchAllItemCategory(`&group_id=${groupId}`);
    const allCategoriesByGroupId = categories.data;
    setCategoryList(allCategoriesByGroupId);
  };
  const getGroupList = async () => {
    const groups = await fetchAllItemGroup();
    const allItemGroups = groups.data;
    setGroupList(allItemGroups);
  };
  const getAccountNumber = async (officeId, projectId, productId, samityId, customerId) => {
    try {
      let customerAccountData;
      if (DoptorId === 1) {
        customerAccountData = await (
          await axios.get(
            customerAccountInfo +
              `?doptorId=${doptor}&officeId=${selectedValue.officeId}&projectId=${projectId}&productId=${productId}&samityId=${samityId}&customerId=${customerId}`,
            config,
          )
        ).data;
      } else {
        customerAccountData = await (
          await axios.get(
            customerAccountInfo +
              `?officeId=${selectedValue.officeId}&projectId=${projectId}&productId=${productId}&samityId=${samityId}&customerId=${customerId}`,
            config,
          )
        ).data;
      }
      setAccountInfo(customerAccountData.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleInputChangeReport = (e) => {
    getDoptorList();
    setDoptor('নির্বাচন করুন');
    const { value } = e.target;
    let pera = [];
    setAccountStatus('নির্বাচন করুন');
    if (value && value != 'নির্বাচন করুন') {
      setReport(reportList[parseInt(value) - 1].reportName);

      for (const element of reportList) {
        if (element.id == value) {
          for (const p of element.parameter) {
            pera.push(parameterBn[p]);
            // if (p == 'districtOffice') {
            //   setDistrictOfficeAlive(true);
            // }
            // if (p == 'office') {
            //   setOfficeAlive(true);
            // }
            // if (p == 'samity') {
            //   setSamityAlive(true);
            // }
            // if (p == 'member') {
            //   setMemberAlive(true);
            // }
            // if (p == 'doptor') {
            //   setDoptorAlive(true);
            // }
            // if (p == 'project') {
            //   setProjectAlive(true);
            // }
            // if (p == 'accountId') {
            // }

            if (p == 'userName') {
              setUserNameAlive(true);
            }
            if (p == 'date') {
              setStartDateAlive(true);
            }
            // if (p == 'glType') {
            //   setGlTypeAlive(true);
            // }
            // if (p == 'serviceInfo') {
            //   setServiceInfoActive(true);
            // }
          }
        }
      }
      setDisplayField(pera);
      reportList[parseInt(value) - 1].reportFrom == 'dataBase'
        ? setSelectedValue({
            ...selectedValue,
            reportName: reportList[parseInt(value) - 1].reportName,
            typeName: reportList[parseInt(value) - 1].typeName,
            reportFrom: 'dataBase',
            hyperLinkAction: reportList[parseInt(value) - 1].hyperLinkAction,
            ...(pera.includes('সমিতির ধরণ') && {
              isMigrated: isMigrated ? true : false,
            }),
            ...(pera.includes('সার্ভিস চার্জ সহ') && {
              withServiceCharge: withServiceCharge ? true : false,
            }),
          })
        : setSelectedValue({
            ...selectedValue,
            reportName: reportList[parseInt(value) - 1].reportName,
            reportFrom: 'jaspar',
            ...(pera.includes('সমিতির ধরণ') && {
              isMigrated: isMigrated ? true : false,
            }),
            ...(pera.includes('সার্ভিস চার্জ সহ') && {
              withServiceCharge: withServiceCharge ? true : false,
            }),
          });
    }
  };

  const handleInputChangeSamity = (e) => {
    setMember([]);
    setAccountStatus('নির্বাচন করুন');
    const { value } = e.target;
    if ((value && value != 'নির্বাচন করুন') || value == 0) {
      setSelectedValue({ ...selectedValue, samityId: parseInt(value) });
      if (value != 0) {
        getMember();
      }
    } else {
      setSelectedValue({ ...selectedValue, samityId: null });
    }
  };

  const handleInputChangeOffice = (e) => {
    setAccountStatus('নির্বাচন করুন');
    if (reportBunchName == 'reject_application') {
      setPdfActive(false);
    }
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setSelectedValue({
        ...selectedValue,
        officeId: parseInt(value),
        samityId: null,
      });
      setMember([]);
      setFieldOfficerList([]);
      setFieldOfficerDisableStatus(false);
      if (disPlayField.includes('মাঠ সংগঠক')) {
        getFieldOfficerList(value);
      }
    }
  };

  const handleInputChangeFieldOfficer = (e) => {
    const { value } = e.target;
    if (value && value != 'নির্বাচন করুন') {
      setSelectedValue({
        ...selectedValue,
        fieldOfficerId: value,
      });
    }
  };

  const handleInputChangeProject = (e) => {
    setAccountStatus('নির্বাচন করুন');
    if (reportBunchName == 'reject_application') {
      setPdfActive(false);
    }
    const { value } = e.target;
    setSamity([]);
    setMember([]);
    // setProductId('নির্বাচন করুন');
    setAllProductData([]);
    if (value && value != 'নির্বাচন করুন') {
      setProjectId(value);
      setSelectedValue({
        ...selectedValue,
        projectId: parseInt(value),
        samityId: null,
        memberId: null,
      });
      getSamityName(isMigrated);
      getProduct(value);
    } else {
      setSelectedValue({
        ...selectedValue,
        projectId: null,
        samityId: null,
        memberId: null,
      });
    }
  };
  const handleInputChangeMember = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, memberId: parseInt(value) });
  };

  // const handleInputChangeDistrict = (e) => {
  //   const { name, value } = e.target;
  //   setDistrictId(value);
  //   getupazila(value);
  // };

  const handleInputChangeDoptor = (e) => {
    const { value } = e.target;
    setLayerId(null);
    setLayerList([]);
    setOfficeList([]);
    setSamity([]);
    setMember([]);
    setProjectName([]);
    setAccountStatus('নির্বাচন করুন');
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
      memberId: null,
    });
    setLayerDisableStatus(false);
    setOfficeDisableStatus(false);
    if (value && value != 'নির্বাচন করুন') {
      setDoptor(value);
      getLayerList(value);
      // setDoptorAlive(true);
      getAllProject(value);
      setSelectedValue({
        ...selectedValue,
        doptorId: value,
      });
    } else {
      setDoptor(null);
    }
    // getupazila(value);
  };

  const handleInputChangeDoptorLayer = (e) => {
    setOfficeList([]);
    setOfficeDisableStatus(false);
    setFieldOfficerList([]);
    setFieldOfficerDisableStatus(false);
    setSamity([]);
    setMember([]);
    setAccountStatus('নির্বাচন করুন');
    setSelectedValue({
      ...selectedValue,
      officeId: null,
      samityId: null,
      memberId: null,
    });
    setOfficeDisableStatus(false);
    const { value } = e.target;
    // getLayerList(value);
    // getupazila(value);
    if (value && value != 'নির্বাচন করুন') {
      setLayerId(value);
      getOfficeList(doptor ? doptor : DoptorId, value);
    }
  };

  const handleInputChangeAccountNumber = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, accountId: parseInt(value) });
  };
  const handleInputChangeIsMigrated = () => {
    setIsMigrated(!isMigrated);
    setSelectedValue({
      ...selectedValue,
      isMigrated: !isMigrated == true ? true : false,
    });
  };
  const handleInputChangeWithServiceCharge = () => {
    setWithServiceCharge(!withServiceCharge);
    setSelectedValue({
      ...selectedValue,
      withServiceCharge: !withServiceCharge == true ? true : false,
    });
  };

  const handleInputChangeAccountStatus = (e) => {
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, accountStatus: value });
    setAccountStatus(value);
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
    setStartDate(moment(date).format('yyyy-MM-DD'));
  };

  const handleDateChangeDisbursementDate = (e) => {
    const date = new Date(e);
    setSelectedValue({
      ...selectedValue,
      disbursementDate: moment(date).format('yyyy-MM-DD'),
    });
  };

  const handleDateChangeRealizationDate = (e) => {
    const date = new Date(e);
    setSelectedValue({
      ...selectedValue,
      realizationDate: moment(date).format('yyyy-MM-DD'),
    });
  };

  const handleFromDateChangeEx = (e) => {
    setFromDate(moment(e).format('yyyy-MM-DD'));
    setSelectedValue({
      ...selectedValue,
      fromDate: moment(e).format('yyyy-MM-DD'),
    });
  };

  const handleToDateChangeEx = (e) => {
    setToDate(moment(e).format('yyyy-MM-DD'));
    setSelectedValue({
      ...selectedValue,
      toDate: moment(e).format('yyyy-MM-DD'),
    });
  };

  const handleInputServiceInfo = (e) => {
    if (reportBunchName == 'reject_application') {
      setPdfActive(false);
    }
    const { value } = e.target;
    setSelectedValue({ ...selectedValue, serviceId: parseInt(value) });
  };
  const reportGenerator = async (comName) => {
    if (selectedValue.reportFrom == 'dataBase') {
      setPdfActive(true);
    } else {
      let selectTedReportList;
      const selectedValueObj = {
        ...selectedValue,
        ...(reportBunchName === 'inventory_item_use_report' && {
          employeeId: getTokenData?.employeeId,
        }),
      };
      for (const element of reportList) {
        if (selectedValue.reportName == element.reportName) {
          selectTedReportList = element;
        }
      }
      if (
        reportBunchName === 'inventory_item_use_report' &&
        !selectTedReportList?.jasparParameter?.includes('employeeId')
      ) {
        selectTedReportList?.jasparParameter?.push('pEmployeeId');
        selectTedReportList?.parameter?.push('employeeId');
      }
      // if (
      //   selectTedReportList?.jasparParameter?.includes("pEmployeeId") &&
      //   !isStoreAdmin
      // ) {
      //   selectedValueObj["employeeId"] = 18;
      // }
      const componentReportBy = liveIp + 'jasper/' + comName + '/';
      const url = urlGenerator(selectedValueObj, selectTedReportList, componentReportBy);
      setFromDate(null);
      setToDate(null);
      try {
        window.open(url);
      } catch (error) {
        //
      }
    }
  };
  // const handleChangeSelect = (e) => {
  //   if (e.target.value != 'নির্বাচন করুন') {
  //     setSelectedValue({ ...selectedValue, employeeId: e.target.value });
  //   }
  // };
  const handeChangeSelectForAutoComplete = (e, value) => {
    if (value) {
      setAdminDeskObj(value);
      setSelectedValue({ ...selectedValue, employeeId: value?.employeeId });
    }
  };
  // http: return (
  return (
    <>
      <Grid container>
        <Grid container spacing={2.5}>
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              fullWidth
              label={star('রিপোর্টের তালিকা')}
              name="report"
              id="report"
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeReport}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {reportList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.reportName}
                </option>
              ))}
            </TextField>
          </Grid>
          {DoptorId == 4 || DoptorId == 8 ? (
            ''
          ) : (
            <>
              {DoptorId == 1 || localStorageData('componentName') === 'inventory' ? (
                <Grid item sm={6} md={4} xs={12}>
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
              ) : (
                ''
              )}
              {localStorageData('componentName') !== 'inventory' ? (
                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={12}
                  sx={!disPlayField.includes('অফিস') ? { display: 'none' } : { display: 'visible' }}
                >
                  <TextField
                    fullWidth
                    label={star('দপ্তর লেয়ার')}
                    id="officeLayer"
                    name="officeLayer"
                    select
                    SelectProps={{ native: true }}
                    onChange={(e) => handleInputChangeDoptorLayer(e)}
                    disabled={layerDisableStatus}
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
              ) : null}
              {localStorageData('componentName') !== 'inventory' ? (
                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={12}
                  sx={!disPlayField.includes('অফিস') ? { display: 'none' } : { display: 'visible' }}
                >
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
                    // value={memberApporval.upazila}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {officeList.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.nameBn}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              ) : null}
              {localStorageData('componentName') === 'inventory' && disPlayField.includes('কর্মকর্তা') ? (
                <Grid item md={4} sm={6} xs={12}>
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
              ) : null}
              {localStorageData('componentName') === 'inventory' && disPlayField.includes('কর্মকর্তা') ? (
                <Grid item md={4} sm={6} xs={12}>
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
                    // value={memberApporval.upazila}
                  >
                    <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                    {officeList.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.nameBn}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              ) : null}
              {localStorageData('componentName') === 'inventory' && disPlayField.includes('কর্মকর্তা') ? (
                <Grid item lg={4} md={4} xs={12}>
                  <Autocomplete
                    name="officerId"
                    size="small"
                    fullWidth
                    options={employeeReacord}
                    value={adminDeskObj}
                    getOptionLabel={(option) => `${option.nameBn}-${option.designation}`}
                    onChange={handeChangeSelectForAutoComplete}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              ) : null}
            </>
          )}
          {disPlayField.includes('ষ্টোর') ? (
            <Grid item sm={6} md={4} xs={12}>
              <TextField
                name="storeId"
                size="small"
                fullWidth
                select
                SelectProps={{ native: true }}
                value={selectedValue?.storeId ? selectedValue.storeId : 'নির্বাচন করুন'}
                onChange={(e) => {
                  const { value } = e.target;
                  setSelectedValue({ ...selectedValue, storeId: value });
                }}
                variant="outlined"
                style={{ backgroundColor: '#FFF' }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {storeList.map((option) => {
                  return (
                    <option key={option.id} value={option.id}>
                      {option.storeName}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
          ) : null}
          {disPlayField.includes('আইটেম') ? (
            <Grid item sm={6} md={4} xs={12}>
              <TextField
                name="groupId"
                size="small"
                label="গ্রুপ"
                fullWidth
                SelectProps={{ native: true }}
                select
                value={groupId ? groupId : 'নির্বাচন করুন'}
                onChange={(e) => {
                  const { value } = e.target;

                  setGroupId(value);
                  getCategoryList(value);
                  setSelectedValue({ ...selectedValue, itemId: '' });
                }}
                variant="outlined"
                style={{ backgroundColor: '#FFF' }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {groupList.map((option) => {
                  return (
                    <option key={option.id} value={option.id}>
                      {option.groupName}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
          ) : null}
          {disPlayField.includes('আইটেম') ? (
            <Grid item sm={6} md={4} xs={12}>
              <TextField
                name="itemId"
                size="small"
                fullWidth
                select
                SelectProps={{ native: true }}
                label="ক্যাটাগরি"
                value={categoryId ? categoryId : 'নির্বাচন করুন'}
                onChange={(e) => {
                  const { value } = e.target;
                  setCategoryId(value);
                  getItemList(value);
                }}
                variant="outlined"
                style={{ backgroundColor: '#FFF' }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {categoryList.map((option) => {
                  return (
                    <option key={option.id} value={option.id}>
                      {option.categoryName}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
          ) : null}

          {disPlayField.includes('আইটেম') ? (
            <Grid item sm={6} md={4} xs={12}>
              <TextField
                name="itemId"
                size="small"
                fullWidth
                label="নাম"
                select
                SelectProps={{ native: true }}
                value={selectedValue?.itemId ? selectedValue.itemId : 'নির্বাচন করুন'}
                onChange={(e) => {
                  const { value } = e.target;
                  setSelectedValue({ ...selectedValue, itemId: value });
                }}
                variant="outlined"
                style={{ backgroundColor: '#FFF' }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {itemList.map((option) => {
                  return (
                    <option key={option.id} value={option.id}>
                      {option.itemName}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
          ) : null}

          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('মাঠ সংগঠক') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('মাঠ সংগঠকের তালিকা')}
              name="fieldOfficerId"
              select
              SelectProps={{ native: true }}
              value={selectedValue?.fieldOfficerId ? selectedValue.fieldOfficerId : 'নির্বাচন করুন'}
              disabled={fieldOfficerDisableStatus}
              onChange={handleInputChangeFieldOfficer}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {selectedValue && selectedValue?.officeId && <option value="0">সকল মাঠ সংগঠক</option>}
              {fieldOfficerList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            lg={12}
            md={4}
            xs={12}
            sx={!disPlayField.includes('সেবাসমূহ') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
          >
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
              // value={memberApporval.upazila}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {serviceInfo.map((option, i) => (
                <option key={i} value={option.id}>
                  {option.serviceName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('প্রকল্প') ? { display: 'none' } : { display: 'visible', mb: 1.5 }}
          >
            <TextField
              fullWidth
              label={star('প্রকল্পের নাম')}
              select
              SelectProps={{ native: true }}
              onChange={(e) => handleInputChangeProject(e)}
              type="text"
              disabled={projectDisableStatus}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
              value={projectId}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {projectName.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.projectNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('সমিতি') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('সমিতির তালিকা')}
              name="serviceId"
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeSamity}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {selectedValue && selectedValue?.projectId && selectedValue?.officeId && (
                <option value="0">সকল সমিতি</option>
              )}
              {samity.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.samityName}({option.samityCode})
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('সদস্য') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('সদস্যের তালিকা')}
              name="serviceId"
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeMember}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {member.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}({option.customerCode})
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('প্রোডাক্ট') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('প্রোডাক্টের নাম')}
              name="productName"
              id="productName"
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeProduct}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {allProductData.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.productName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('হিসাবের নম্বর') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('হিসাবের নম্বর')}
              name="accountNumber"
              id="accountNumber"
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeAccountNumber}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {accountInfo.map((option) => (
                <option key={option.accountId} value={option.accountId}>
                  {option.accountTitle}- {option.accountNo}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('হিসাবের অবস্থা') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('হিসাবের অবস্থা')}
              name="accountStatus"
              id="accountStatus"
              select
              SelectProps={{ native: true }}
              onChange={handleInputChangeAccountStatus}
              variant="outlined"
              size="small"
              value={accountStatus}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {accountStatusList.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            sm={6}
            md={4}
            xs={12}
            sx={!disPlayField.includes('ট্রান্সাকশন নম্বর') ? { display: 'none' } : { display: 'visible' }}
          >
            <TextField
              fullWidth
              label={star('ট্রান্সাকশন নম্বর')}
              name="tranId"
              id="tranId"
              type="text"
              onChange={handleInputChangeTranId}
              variant="outlined"
              size="small"
              getEmployeeName
            ></TextField>
          </Grid>
          <FromControlJSON
            arr={[
              {
                labelName: star('ঋণ বিতরণের তারিখ'),
                onChange: handleDateChangeDisbursementDate,
                value: selectedValue?.disbursementDate ? selectedValue.disbursementDate : null,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                xl: 12,
                lg: 4,
                md: 4,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('ঋণ বিতরণের তারিখ') ? true : false,

                errorMessage: '',
              },
              {
                labelName: star('ঋণ আদায়ের তারিখ'),
                onChange: handleDateChangeRealizationDate,
                value: selectedValue?.realizationDate ? selectedValue.realizationDate : null,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                xl: 12,
                lg: 4,
                md: 4,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('ঋণ আদায়ের তারিখ') ? true : false,

                errorMessage: '',
              },
              {
                labelName: star('তারিখ'),
                onChange: handleDateChangeEx,
                value: startDate,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                xl: 12,
                lg: 4,
                md: 4,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('তারিখ') ? true : false,

                errorMessage: '',
              },
              {
                labelName: star('শুরুর তারিখ'),
                onChange: handleFromDateChangeEx,
                value: fromDate,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                sm: 6,
                md: 4,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('শুরুর তারিখ') ? true : false,

                errorMessage: '',
              },
              {
                labelName: star('শেষের তারিখ'),
                onChange: handleToDateChangeEx,
                value: toDate,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                sm: 6,
                md: 4,
                xs: 12,
                isDisabled: false,
                customClass: '',
                customStyle: {},
                hidden: !disPlayField.includes('শেষের তারিখ') ? true : false,

                errorMessage: '',
              },
            ]}
          />
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('সমিতির ধরণ') ? { display: 'none' } : { display: 'visible' }}
          >
            <FormControl component="fieldset" variant="standard">
              <FormControlLabel
                control={<Switch checked={isMigrated} onChange={handleInputChangeIsMigrated} name="isMigrated" />}
                label="মাইগ্রেটেড সমিতি ?"
                labelPlacement="start"
              />
            </FormControl>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={!disPlayField.includes('সার্ভিস চার্জ সহ') ? { display: 'none' } : { display: 'visible' }}
          >
            <FormControl component="fieldset" variant="standard">
              <FormControlLabel
                control={
                  <Switch
                    checked={withServiceCharge}
                    onChange={handleInputChangeWithServiceCharge}
                    name="withServiceCharge"
                  />
                }
                label="সার্ভিস চার্জ সহ ?"
                labelPlacement="start"
              />
            </FormControl>
          </Grid>
          <Grid
            item
            className="btn-container"
            xs={12}
            md={12}
            sm={12}
            sx={({ textAlign: 'center' }, disPlayField.length == 0 ? { display: 'none' } : { display: 'visible' })}
          >
            <Tooltip title="রিপোর্ট দেখুন">
              <Button
                variant="contained"
                className="btn btn-primary"
                target="_blank"
                onClick={() => reportGenerator(localStorageData('componentName'))}
                sx={{ marginTop: '1.5rem' }}
                startIcon={<WysiwygIcon />}
              >
                {' '}
                রিপোর্ট দেখুন
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid lg={12} container spacing={2.5} px={2} py={1}>
          <Grid
            item
            xs={12}
            md={12}
            sm={12}
            mx={2}
            my={2}
            sx={({ textAlign: 'center' }, !pdfActive ? { display: 'none' } : { display: 'visible', mb: 1.5 })}
          >
            {pdfActive ? (
              <ReportShowFromData
                selectedValue={{
                  ...selectedValue,
                  reportBunchName: reportBunchName,
                }}
              />
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
