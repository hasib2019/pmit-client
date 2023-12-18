
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { fetchProjects } from 'features/dropdowns/dropdownSlice';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { bdToNum } from 'service/banglatoenglishNumber';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  codeMaster,
  glListRoute,
  officeName,
  openDayWithOrWithoutProject,
  subGlDataRoute,
  voucherPostingApplicattionRoute,
} from '../../../../../url/AccountsApiLIst';
import VoucherPosting from './voucher-posting/VoucherPosting';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.dropdown);
  const [tabValue, setValue] = useState(0);
  const [glList, setGlList] = useState([]);
  const [counter, setCounter] = useState(4);
  const [allGlList, setAllGlList] = useState([]);
  const [subGlType, setSubGlType] = useState([]);
  const [subGlData, setSubGlData] = useState([]);
  const [transectionTypevalue] = useState('');
  // const [changeState, setChangeState] = useState(false);
  const [description, setDescription] = useState('');
  const [generalRemark] = useState(['']);
  const [allGl, setAllGl] = useState([]);
  const [totalDr, setTotalDr] = useState(0);
  const [totalCr, setTotalCr] = useState(0);
  const [project, setPorject] = useState(0);
  const [openCloseDate, setOpenCloseDate] = useState(null);
  // const [officeDate, setOfficeDate] = useState(null);
  const [formError, setFormError] = useState({
    glNameError: '',
    totalDrCrError: '',
    transactionType: '',
    subGlDataError: '',
    subGlTypeError: '',
    officeIdError: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubGlMandatory, setIsSubGlMandatory] = useState(false);
  const [officeNameData, setOfficeNameData] = useState([]);
  // const [office, setOffice] = useState('');
  const [itemsThatAlreadyHaveDesc, setItemsThatAlreadyHaveDesc] = useState([]);
  const [selectedGls, setSelectedGls] = useState([]);
  const [userOfficeId, setUserOfficeId] = useState('');
  const [projectTextfieldKey, setProjectTextfieldKey] = useState('');
  // const [flag, setFlag] = useState(true);
  const debitRef = useRef(null);
  const creditRef = useRef(null);
  const regex = /[০-৯.,0-9]$/;
  const config = localStorageData('config');

  useEffect(() => {
    getAllGlList();
    getGlList();
    getSubGlType();
    getOfficeName();
    dispatch(fetchProjects());
  }, []);

  useEffect(() => {
    getSubGlType();
  }, []);
  useEffect(() => {
    getOpeneDatWithOrWithoutProject();
  }, [project]);
  const getOpeneDatWithOrWithoutProject = async () => {
    try {
      const openCloseDate = await axios.get(openDayWithOrWithoutProject + project, config);
      // eslint-disable-next-line no-unused-vars
      setOpenCloseDate((prevState) => (openCloseDate.data.data ? openCloseDate.data.data : null));
    } catch (error) {
      errorHandler(error);
    }
  };

  const getOfficeIdFromToken = () => {
    let accessToken = localStorageData('token');
    const tokenDecodeData = tokenData(accessToken);
    const officeId = tokenDecodeData ? tokenDecodeData.officeId : ' ';
    setUserOfficeId(officeId);
    // if (selectedGls[0]) {
    //   selectedGls[0] = { ...selectedGls[0], officeId: parseInt(value.id) };
    // }
    // setOfficeNameData(officeNameData.filter((office) => office.id != officeId));
    selectedGls[0] = { officeId: officeId };
    setSelectedGls([...selectedGls]);
  };
  const generateRandonmIndex = () => {
    let x = Math.floor(Math.random() * 10000 + 1);
    return x;
  };
  const handleChangeOffice = (e, value, i) => {
    if (glList[i]) {
      glList[i].officeId = parseInt(value.id);
      setGlList([...glList]);
    }

    selectedGls[i] = { ...selectedGls[i], officeId: parseInt(value.id) };

    setOfficeNameData(officeNameData.filter((office) => office.id !== value.id));
  };
  const handleAdd = () => {
    setCounter(counter + 1);
    let count = counter;
    let newGlDataList = [...allGlList];

    let objToBeAdded = newGlDataList.find((elem, i) => i == count + 1);
    if (objToBeAdded) {
      let glListCopy = [...glList];
      glListCopy.push(objToBeAdded);

      setGlList(glListCopy);
    }
  };
  const clearRow = (i) => {
    // ("itemmmmmmm194", item, selectedGls);
    // ("I am in row clear", item);
    // const filteredgls = selectedGls.filter((gl, index) => {
    //   ('indexi', index,i)

    //  return index != i});
    selectedGls[i] = null;
    setSelectedGls([...selectedGls]);

    glList[i] = {
      ...allGl[i],
      drAmount: '',
      crAmount: '',
      key: Math.floor(Math.random() * 100000 + 1),
    };
    calculateTotal('cr', glList);
    calculateTotal('dr', glList);
    setGlList(glList);
  };
  const checkValidation = () => {
    let errorObj = {};
    let flag = true;
    const transactionSet = generateTransactionSet();
    transactionSet.forEach((tr) => {
      if (!tr.glacId) {
        flag = false;
        errorObj.glNameError = 'জিএল নির্বাচন করুন';
      }
      if (tabValue == 3) {
        if (!tr.officeId) {
          flag = false;
          errorObj.officeIdError = 'অফিস নির্বাচন করুন';
        }
      }
    });
    if (totalDr === 0 || totalCr === 0) {
      flag = false;
      errorObj.totalDrCrError = `সর্বমোট ক্রেডিট অথবা সর্বমোট ডেবিট শুন্য হতে পারবেনা`;
    }
    if (totalDr !== totalCr) {
      flag = false;
      errorObj.totalDrCrError = 'ডেবিট এবং ক্রেডিট সমান হতে হবে';
    }

    setTimeout(() => {
      setFormError(errorObj);
    }, 1);
    return flag;
  };
  const getVoucherTypeAccordingToTabValue = (tabVal) => {
    if (tabVal === 0) {
      return 'Payment Voucher';
    }
    if (tabVal === 1) {
      return 'Receive Voucher';
    }
    if (tabVal === 2) {
      return 'Journal Voucher';
    }
  };
  const determineDrCrCode = (gl) => {
    if (gl?.drAmount && gl?.drAmount !== 0) {
      return 'D';
    } else if (gl?.crAmount && gl?.crAmount !== 0) {
      return 'C';
    } else {
      return null;
    }
  };

  const resetAllState = () => {
    const gls = [
      { ...allGl[0], drAmount: '', crAmount: '', key: generateRandonmIndex() },
      { ...allGl[1], drAmount: '', crAmount: '', key: generateRandonmIndex() },
      { ...allGl[2], drAmount: '', crAmount: '', key: generateRandonmIndex() },
      { ...allGl[3], drAmount: '', crAmount: '', key: generateRandonmIndex() },
    ];
    setGlList(gls);
    // ("newGlListData", newGlListData);
    setPorject(0);
    setDescription('');

    setValue(0);
    // setTransectionTypeValue("");
    setTotalDr(0);
    setTotalCr(0);
    setProjectTextfieldKey(generateRandonmIndex());
  };
  const determineTransactionType = () => {
    const isCashInHand = selectedGls.filter((gl) => gl != null)?.some((gl) => gl.isCashInHand === true);
    return isCashInHand ? 'CASH' : 'TRANSFER';
  };
  const generateTransactionSet = () => {
    const voucherPostingTransactionSet = selectedGls
      .filter((gl) => gl != null)
      ?.map((gl) => {
        return {
          productId: null,
          accountId: null,
          naration: gl?.drAmount?.desc,
          drcrCode: determineDrCrCode(gl),
          // naration: gl?.desc ? gl?.desc : '',
          glacId: gl?.id,
          subglId: gl?.subGlData ?? null,
          tranAmt: gl?.drAmount ? gl.drAmount : gl?.crAmount,
          tranType: determineTransactionType(),
          ...(project !== 0 && { projectId: project }),
          ...(tabValue == 3 && { officeId: gl?.officeId }),
        };
      });
    return voucherPostingTransactionSet;
  };
  const onSubmitData = async () => {
    const isValidate = checkValidation();

    if (isValidate) {
      const payload = {
        ...(project !== 0 && { projectId: project }),
        tranType: tabValue == 3 ? 'IBT' : 'VOP',

        data: {
          voucherType: getVoucherTypeAccordingToTabValue(tabValue),
          voucherMode: determineTransactionType(),
          transactionSets: generateTransactionSet(),
        },
      };

      try {
        setIsLoading(true);

        const response = await axios.post(voucherPostingApplicattionRoute, payload, config);
        setSelectedGls([]);
        setIsSubGlMandatory(false);
        setIsLoading(false);
        NotificationManager.success(response.data.message);
        let newGlListData = [];
        for (let i = 0; i <= counter; i++) {
          newGlListData.push({ ...allGl[i], key: generateRandonmIndex() });
        }
        resetAllState();
      } catch (error) {
        errorHandler(error);
        setIsLoading(false);
      }
    }
    // setGlList(allGl);
  };
  // const deleteDuplicateObjectFromArrayOfOject = (list) => {
  //   let result = list.filter((gl, index) => index === list.findIndex((other) => gl.id === other.id));
  //   return result;
  // };

  // const [voucherTypeValue, setVoucherTypeValue] = useState('');

  const handleGl = (e, i) => {
    const value = JSON.parse(e.target.value);

    if (glList[i]) {
      glList[i].subGl = value.subGlStatus;
      glList[i].glacName = value.glacName;
      glList[i].subGlType = null;
      glList[i].subGlData = null;
      glList[i].subGlDataName = null;

      setIsSubGlMandatory(value.subGlStatus);
    }

    
    setGlList([...glList]);
    // setSubGlType([]);
  };
  const handleGl2 = (e, value, i) => {
    'selectedGls430', selectedGls;
    if (value) {
      'valueGl', value;
      const gls = [...selectedGls];
      delete value['officeId'];
      gls[i] = { ...selectedGls[i], ...value };
      setSelectedGls(gls);
    }
  };

  // const handleGenelalRemarks = (e) => {
  //   const { name, value } = e.target.value;
  //   setGeneralRemark(value);
  // };

  const handleSubGlType = (e, i) => {
    // eslint-disable-next-line no-empty-pattern
    const { } = e.target;

    const value = JSON.parse(e.target.value);
    selectedGls[i].subGlTypeId = value.id;

    setSubGlData([]);
    subGlList(value.id);
  };

  const handleSubGlData = (e, i) => {
    // eslint-disable-next-line no-empty-pattern
    const { } = e.target;
    const value = JSON.parse(e.target.value);
    selectedGls[i].subGlData = value.id;
    selectedGls[i].subGlDataName = value.subGlDataName;
  };
  const calculateTotal = (type, glList) => {
    const ammounts = glList.map((gl) => {
      return type === 'dr' ? (!gl?.drAmount ? 0 : gl?.drAmount) : !gl?.crAmount ? 0 : gl?.crAmount;
    });
    'ammounts', ammounts;
    if (type === 'dr') {
      const totalDrAmmount = ammounts.reduce((sum, current) => {
        return sum + current;
      }, 0);

      setTotalDr(totalDrAmmount);
    } else if (type === 'cr') {
      const totalCrAmmount = ammounts.reduce((sum, current) => {
        return sum + current;
      }, 0);

      setTotalCr(totalCrAmmount);
    }
  };
  const handleDrAmount = (e, i) => {
    'selectedGls553', bdToNum(e.target.value);
    if (regex.test(e.target.value) || e.target.value == '') {
      const value = bdToNum(e.target.value);
      'engggtobn', value;
      let totalAmount = totalAmount + Number(value);
      'Total Amount are', selectedGls[i];

      if (selectedGls[i]?.hasOwnProperty.drAmount) {
        selectedGls[i].drAmount = Number(value);
      } else {
        const obj = { ...selectedGls[i], drAmount: '' };
        obj.drAmount = Number(value);
        selectedGls[i] = obj;
        calculateTotal('cr', glList);
      }

      if (selectedGls[i].hasOwnProperty.crAmount) {
        selectedGls[i].crAmount = 0;
      } else {
        const obj = { ...selectedGls[i], crAmount: '' };

        selectedGls[i] = obj;
      }
      glList[i].drAmount = selectedGls[i].drAmount;
      glList[i].crAmount = '';
      setGlList([...glList]);
      calculateTotal('dr', glList);
    }
  };

  const handleCrAmount = (e, i) => {
    'selectedGls568', selectedGls;

    'tetregex', regex.test(e.target.value);
    if (regex.test(e.target.value) || e.target.value == '') {
      ('iamcalled');
      const value = bdToNum(e.target.value);
      'engggtobn', value;
      let totalAmount = totalAmount + Number(value);
      'Total Amount are', selectedGls[i];

      if (selectedGls[i]?.hasOwnProperty.crAmount) {
        selectedGls[i].crAmount = Number(value);
      } else {
        const obj = { ...selectedGls[i], crAmount: '' };
        obj.crAmount = Number(value);
        selectedGls[i] = obj;
        calculateTotal('dr', glList);
      }

      if (selectedGls[i].hasOwnProperty.drAmount) {
        selectedGls[i].drAmount = '';
      } else {
        const obj = { ...selectedGls[i], drAmount: '' };

        selectedGls[i] = obj;
      }
      glList[i].crAmount = Number(value);
      glList[i].drAmount = '';

      setGlList([...glList]);
      calculateTotal('cr', glList);
    }
  };

  const handleChangeProject = (event, newValue) => {
    if (newValue) {
      'neValue527', newValue;
      setPorject(newValue.id);
    }
  };

  let getOfficeName = async () => {
    try {
      let officeData = await axios.get(officeName, config);
      setOfficeNameData(officeData.data.data);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        //let message = error.response.data.errors[0].message;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getAllGlList = async () => {
    try {
      const glListResult = await axios.get(glListRoute + '?isPagination=false', config);
      const glDataList = glListResult.data.data;
      const glDataListOfChild = glDataList.filter((elm) => {
        // ("parentChild", elm.isProductGl);
        return elm.parentChild === 'C' && elm.isSavingsProductGl === false && elm.isShareProductGl === false;
      });
      'glDataList', glDataListOfChild;
      setAllGlList(
        glDataListOfChild.filter(
          (glData) =>
            glData.parentChild === 'C' &&
            glData.isSavingsProductGl === false &&
            glData.isShareProductGl === false &&
            (glData.glacType === 'A' || glData.glacType === 'L' || glData.glacType === 'E'),
        ),
      );
      setAllGl(glDataListOfChild);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getGlList = async () => {
    try {
      const glListData = await axios.get(glListRoute + '?isPagination=false', config);
      const glDataList = glListData.data.data;
      const glDataListOfChild = glDataList.filter((elm) => {
        'parentChild', elm.parentChild;
        return elm.parentChild === 'C' && elm.isShareProductGl === false && elm.isSavingsProductGl === false;
      });
      let newGlListData = [];
      for (let i = 0; i < counter; i++) {
        newGlListData.push({
          ...glDataListOfChild[i],
          key: generateRandonmIndex(),
        });
      }

      'newGlListData', newGlListData;
      setGlList(newGlListData);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  const getGlListDataAccordingToTabValueAndTransactionType = (tabValue) => {
    'tabvalue', typeof tabValue;
    // setTransectionTypeValue("");

    if (tabValue === 1) {
      ('hello655');
      const filteredGllist = allGl.filter(
        (glData) =>
          // glData.isCashInHand === true &&
          glData.parentChild === 'C' &&
          glData.isSavingsProductGl === false &&
          glData.isShareProductGl === false &&
          (glData.glacType === 'A' || glData.glacType === 'I' || glData.glacType === 'L' || glData.glacType === 'E'),
      );

      return filteredGllist;
    }

    if (tabValue === 0) {
      ('hello572');
      const filteredGllist = allGl.filter(
        (glData) =>
          // glData.isCashInHand === false &&
          glData.parentChild === 'C' &&
          glData.isSavingsProductGl === false &&
          glData.isShareProductGl === false &&
          (glData.glacType === 'A' || glData.glacType === 'L' || glData.glacType === 'E'),
      );
      'filteredGllist', filteredGllist;
      return filteredGllist;
    }

    if (tabValue === 2) {
      ('hello572');
      const filteredGllist = allGl.filter(
        (glData) =>
          glData.isCashInHand === false &&
          glData.parentChild === 'C' &&
          glData.isSavingsProductGl === false &&
          glData.isShareProductGl === false &&
          glData.isBankBalance === false,
      );
      'filteredGllist', filteredGllist;

      return filteredGllist;
    }
    if (tabValue === 3) {
      ('hello572');
      const filteredGllist = allGl.filter(
        (glData) =>
          glData.isCashInHand === false &&
          glData.parentChild === 'C' &&
          glData.isSavingsProductGl === false &&
          glData.isShareProductGl === false,
      );
      'filteredGllist', filteredGllist;

      return filteredGllist;
    }
    ('iam in return');
  };
  // const getGlListWithStatush = () => {
  //   const gls = [...allGl];
  //   'allGl', allGl;
  //   const glListData = getGlListDataAccordingToTabValueAndTransactionType(tabValue);

  //   const newGlList = glListData.map((item, i) => {
  //     if (i === 0) {
  //       return {
  //         ...item,
  //         drAmount: 0,
  //         crAmount: 0,
  //       };
  //     } else {
  //       return {
  //         ...item,

  //         drAmount: 0,
  //         crAmount: 0,
  //       };
  //     }
  //   });
  //   setAllGlList(glListData);
  //   setGlList(newGlList);
  // };
  const getSubGlType = async () => {
    try {
      const subGlListData = await axios.get(codeMaster + '?codeType=SLG', config);
      const subGlDataList = subGlListData.data.data;
      setSubGlType(subGlDataList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
    let selectGlListCopy = [...selectedGls];
    let glListCopy = [...glList];
    'gllllllll755', glListCopy;
    selectGlListCopy.map((elem, i) => {
      if (selectedGls[i]) {
        if (!itemsThatAlreadyHaveDesc.includes(i)) {
          return (elem.desc = e.target.value);
        }
      }
    });
    glListCopy.map((elem, i) => {
      // if (selectedGls[i]) {
      'selcetedGlsDes', selectedGls;
      if (!itemsThatAlreadyHaveDesc.includes(i) && selectedGls[i]) {
        return (elem.desc = e.target.value);
      }
      // }
    });
    setGlList(glListCopy);
  };
  const handleGrantorInfo = (e, i) => {
    setItemsThatAlreadyHaveDesc([...itemsThatAlreadyHaveDesc, parseInt(i)]);
    let glListCopy = [...glList];
    glListCopy[i].desc = e.target.value;
    if (selectedGls[i]?.hasOwnProperty.desc) {
      selectedGls[i].desc = e.target.value;
    } else {
      const obj = { ...selectedGls[i], desc: '' };
      obj.desc = e.target.value;
      selectedGls[i] = obj;
    }
    // glListCopy.map((elem) => (elem.desc = e.target.value));
    // if (e.target.value.length > 2) {
    //   creditRef.current.focus();
    // }
    setGlList(glListCopy);
  };
  const subGlList = async (id) => {
    try {
      const subGlData = await axios.get(subGlDataRoute + '?subGlType=' + id, config);
      const subGlDataList = subGlData.data.data;
      setSubGlData(subGlDataList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  'transectionTypevalue', transectionTypevalue;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDescription('');
    setItemsThatAlreadyHaveDesc([]);
    setSelectedGls([]);
    setTotalCr(0);
    setTotalDr(0);
    setFormError({
      glNameError: '',
      totalDrCrError: '',
      transactionType: '',
      subGlDataError: '',
      subGlTypeError: '',
      officeIdError: '',
    });

    // if (newValue === 0 || newValue === 1) {
    //   ("ifElse8199");
    //   setFirstValueOfSelectGlList(transectionTypevalue);
    //   const filteredData = getGlListDataAccordingToTabValueAndTransactionType(
    //     newValue,
    //     "C"
    //   );

    //   setGlList([
    //     { ...filteredData[0], drAmount: 0, crAmount: 0 },
    //     { ...filteredData[1], drAmount: 0, crAmount: 0 },
    //     { ...filteredData[2], drAmount: 0, crAmount: 0 },
    //     { ...filteredData[3], drAmount: 0, crAmount: 0 },
    //   ]);
    //   setAllGlList(filteredData);
    // }

    if (newValue == 3) {
      getOfficeIdFromToken();
    }
    ('ifElse');
    'newValue', newValue;
    setFirstValueOfSelectGlList('T');

    const filteredGl = getGlListDataAccordingToTabValueAndTransactionType(newValue, transectionTypevalue);
    setAllGlList(filteredGl);
    let newGlListData = [];
    for (let i = 0; i <= counter; i++) {
      newGlListData.push({ ...filteredGl[i], drAmount: '', crAmount: '' });
    }
    setGlList(newGlListData);
  };

  const setFirstValueOfSelectGlList = (value) => {
    ('iamheree877');
    const firstCashInHandOrBankGlFromGlList =
      value === 'C' ? allGl.find((elm) => elm.isCashInHand === true) : allGl.find((elm) => elm.isBankBalance === true);

    selectedGls[0] = {
      ...firstCashInHandOrBankGlFromGlList,
      drAmount: 0,
      crAmount: 0,
    };
    selectedGls.splice(1);
    return selectedGls;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="পেমেন্ট ভাউচার" {...a11yProps(0)} />
          <Tab label="রিসিভ ভাউচার" {...a11yProps(1)} />
          <Tab label="জার্নাল ভাউচার" {...a11yProps(2)} />
          <Tab label="আন্তঃ অফিস ভাউচার" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0} className="tabData">
        <VoucherPosting
          tableTitle={'পেমেন্ট ভাউচার সম্পর্কিত তথ্য'}
          transectionTypevalue={transectionTypevalue}
          // handleTransectionType={handleTransectionType}
          description={description}
          handleDescription={handleDescription}
          glList={glList}
          allGlList={allGlList}
          handleSubGlType={handleSubGlType}
          subGlType={subGlType}
          handleSubGlData={handleSubGlData}
          subGlData={subGlData}
          handleDrAmount={handleDrAmount}
          handleCrAmount={handleCrAmount}
          handleAdd={handleAdd}
          onSubmitData={onSubmitData}
          tabValue={tabValue}
          handleGl={handleGl}
          handleGl2={handleGl2}
          generalRemark={generalRemark}
          handleGrantorInfo={handleGrantorInfo}
          totalDr={totalDr}
          totalCr={totalCr}
          projects={projects}
          handleChangeProject={handleChangeProject}
          project={project}
          formErrors={formError}
          isLoading={isLoading}
          isSubGlMandatory={isSubGlMandatory}
          determineDrCrCode={determineDrCrCode}
          selectedGls={selectedGls}
          userOfficeId={userOfficeId}
          creditRef={creditRef}
          debitRef={debitRef}
          clearRow={clearRow}
          openDate={openCloseDate}
          projectTextfieldKey={projectTextfieldKey}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1} className="tabData">
        <VoucherPosting
          tableTitle={'রিসিভ ভাউচার সম্পর্কিত তথ্য'}
          transectionTypevalue={transectionTypevalue}
          // handleTransectionType={handleTransectionType}
          description={description}
          handleDescription={handleDescription}
          glList={glList}
          allGlList={allGlList}
          handleSubGlType={handleSubGlType}
          subGlType={subGlType}
          handleSubGlData={handleSubGlData}
          subGlData={subGlData}
          handleDrAmount={handleDrAmount}
          handleCrAmount={handleCrAmount}
          handleAdd={handleAdd}
          onSubmitData={onSubmitData}
          tabValue={tabValue}
          handleGl={handleGl}
          handleGl2={handleGl2}
          generalRemark={generalRemark}
          handleGrantorInfo={handleGrantorInfo}
          totalDr={totalDr}
          totalCr={totalCr}
          projects={projects}
          handleChangeProject={handleChangeProject}
          project={project}
          formErrors={formError}
          isLoading={isLoading}
          isSubGlMandatory={isSubGlMandatory}
          determineDrCrCode={determineDrCrCode}
          selectedGls={selectedGls}
          userOfficeId={userOfficeId}
          creditRef={creditRef}
          debitRef={debitRef}
          clearRow={clearRow}
          openDate={openCloseDate}
          projectTextfieldKey={projectTextfieldKey}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2} className="tabData">
        <VoucherPosting
          tableTitle={'জার্নাল ভাউচার সম্পর্কিত তথ্য'}
          transectionTypevalue={transectionTypevalue}
          // handleTransectionType={handleTransectionType}
          description={description}
          handleDescription={handleDescription}
          glList={glList}
          allGlList={allGlList}
          handleSubGlType={handleSubGlType}
          subGlType={subGlType}
          handleSubGlData={handleSubGlData}
          subGlData={subGlData}
          handleDrAmount={handleDrAmount}
          handleCrAmount={handleCrAmount}
          handleAdd={handleAdd}
          onSubmitData={onSubmitData}
          tabValue={tabValue}
          handleGl={handleGl}
          handleGl2={handleGl2}
          generalRemark={generalRemark}
          handleGrantorInfo={handleGrantorInfo}
          totalDr={totalDr}
          totalCr={totalCr}
          projects={projects}
          handleChangeProject={handleChangeProject}
          project={project}
          formErrors={formError}
          isLoading={isLoading}
          isSubGlMandatory={isSubGlMandatory}
          determineDrCrCode={determineDrCrCode}
          selectedGls={selectedGls}
          userOfficeId={userOfficeId}
          creditRef={creditRef}
          debitRef={debitRef}
          clearRow={clearRow}
          openDate={openCloseDate}
          projectTextfieldKey={projectTextfieldKey}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3} className="tabData">
        <VoucherPosting
          tableTitle={'আন্তঃ অফিস ভাউচার সম্পর্কিত তথ্য'}
          transectionTypevalue={transectionTypevalue}
          // handleTransectionType={handleTransectionType}
          description={description}
          handleDescription={handleDescription}
          glList={glList}
          allGlList={allGlList}
          handleSubGlType={handleSubGlType}
          subGlType={subGlType}
          handleSubGlData={handleSubGlData}
          subGlData={subGlData}
          handleDrAmount={handleDrAmount}
          handleCrAmount={handleCrAmount}
          handleAdd={handleAdd}
          onSubmitData={onSubmitData}
          tabValue={tabValue}
          handleGl={handleGl}
          handleGl2={handleGl2}
          generalRemark={generalRemark}
          handleGrantorInfo={handleGrantorInfo}
          totalDr={totalDr}
          totalCr={totalCr}
          projects={projects}
          handleChangeProject={handleChangeProject}
          project={project}
          formErrors={formError}
          isLoading={isLoading}
          isSubGlMandatory={isSubGlMandatory}
          officeNameData={officeNameData}
          handleChangeOffice={handleChangeOffice}
          determineDrCrCode={determineDrCrCode}
          selectedGls={selectedGls}
          userOfficeId={userOfficeId}
          creditRef={creditRef}
          debitRef={debitRef}
          clearRow={clearRow}
          openDate={openCloseDate}
          projectTextfieldKey={projectTextfieldKey}
        />
      </TabPanel>
    </Box>
  );
}
