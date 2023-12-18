import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Box, Button, Grid, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from 'service/numberConverter';
import {
  customerAccountInfo,
  dueLoanAmountInfo,
  employeeRecordByOffice,
  getDolMember,
  loanProject,
  officeName,
  samityNameRoute,
  specificApplication,
  transactionOfMember,
} from '../../../../url/ApiList';
import star from '../loan-application/utils';

import Swal from 'sweetalert2';

const LoanSettlement = () => {
  const componentName = localStorageData('componentName');
  const config = localStorageData('config');
  const officeInfo = localStorageData('officeGeoData');

  const [ProjectName, setProjectName] = useState([]);
  const [projectId, setProjectId] = useState('নির্বাচন করুন');
  const [projectDisable, setProjectDisable] = useState(false);
  const [samityNameObj, setSamityNameObj] = useState({
    id: '',
    label: '',
  });
  const [samityName, setSamityName] = useState([]);
  const [samityId, setSamityId] = useState(null);
  const [member, setMember] = useState([]);
  const [memberNameObj, setMemberNameObj] = useState({
    id: '',
    label: '',
  });
  // const [memberId, setMemberId] = useState(null);
  const [accountsList, setAccountsList] = useState([]);
  const [loanAmountInfo, setLoanAmountInfo] = useState({
    productId: '',
    productName: '',
    balancedPrincipal: '',
    balancedInterest: '',
    balancedTotal: '',
    loanAmount: '',
    interestAmount: '',
    principalPaidAmount: '',
    interestPaidAmount: '',
    duePrincipal: '',
    dueInterest: '',
    interestRebateAmount: '',
    totalAmount: '',
  });
  const [selectedAccount, setSelectedAccount] = useState('নির্বাচন করুন');
  const [repayAmount, setRepayAmount] = useState(null);
  const [narration, setNarration] = useState(null);
  const [officeList, setOfficeList] = useState([]);
  const [officeObj, setOfficeObj] = useState({
    id: officeInfo?.id,
    label: officeInfo?.nameBn,
  });
  const [deskObj, setDeskObj] = useState({
    id: '',
    label: '',
  });
  const [deskList, setDeskList] = useState([]);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [loanSectionViewStatus, setLoanSectionViewStatus] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    getProject();
    getOffice();
    if (officeInfo?.id) getDeskList(officeInfo?.id);
  }, []);

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      if (projectList.length == 1) {
        setProjectId(projectList[0].id);
        setProjectDisable(true);
        getSamity(projectList[0].id);
      }
      setProjectName(projectList);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getAccount = async (projectId, samityId, memberId) => {
    if (projectId && projectId != 'নির্বাচন করুন' && samityId && memberId) {
      try {
        const allAccounts = await axios.get(
          customerAccountInfo +
          '?projectId=' +
          projectId +
          '&samityId=' +
          samityId +
          '&customerId=' +
          memberId +
          '&allAccounts=true',
          config,
        );
        let allAccountData = allAccounts.data.data.filter(
          (value) => value.productType == 'A' && value.depositNature == 'L',
        );
        setAccountsList(allAccountData);
        // setAllProductData(productList);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const getDueLoanAmountInfo = async (accountId) => {
    if (accountId) {
      try {
        const dueLoanInfoApiResponse = await axios.get(dueLoanAmountInfo + '?accountId=' + accountId, config);
        let dueLoanInfo = dueLoanInfoApiResponse.data.data;
        setLoanAmountInfo({
          ...dueLoanInfo,
        });
        setLoanSectionViewStatus(true);
      } catch (error) {
        setLoanSectionViewStatus(false);
        errorHandler(error);
      }
    }
  };

  const handleAccountList = (e) => {
    const { value } = e.target;
    if (value != 'নির্বাচন করুন' && Number(value)) {
      setFormErrors({ ...formErrors, account: '', repayAmountRange: '' });
      setSelectedAccount(value);
      setLoanAmountInfo({
        productId: '',
        productName: '',
        balancedPrincipal: '',
        balancedInterest: '',
        balancedTotal: '',
        loanAmount: '',
        interestAmount: '',
        principalPaidAmount: '',
        interestPaidAmount: '',
        duePrincipal: '',
        dueInterest: '',
        interestRebateAmount: '',
        totalAmount: '',
      });
      setNarration(null);
      getDueLoanAmountInfo(value);
      setRepayAmount(null);
    } else {
      setSelectedAccount('নির্বাচন করুন');
      setLoanSectionViewStatus(false);
      setLoanAmountInfo({
        productId: '',
        productName: '',
        balancedPrincipal: '',
        balancedInterest: '',
        balancedTotal: '',
        loanAmount: '',
        interestAmount: '',
        principalPaidAmount: '',
        interestPaidAmount: '',
        duePrincipal: '',
        dueInterest: '',
        interestRebateAmount: '',
        totalAmount: '',
      });
      setNarration(null);
      setRepayAmount(null);
    }
  };

  const getSamity = async (project) => {
    if (project && project != 'নির্বাচন করুন') {
      try {
        const samity = await axios.get(samityNameRoute + '?value=1&project=' + project, config);
        let samityData = samity.data.data;
        setSamityName(samityData);
      } catch (error) {
        errorHandler(error);
      }
    } else {
      try {
        const samity = await axios.get(samityNameRoute + '?value=1', config);
        let samityData = samity.data.data;
        setSamityName(samityData);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const handleProject = (e) => {
    const { value } = e.target;
    setSamityNameObj({
      id: '',
      label: '',
    });
    setMemberNameObj({
      id: '',
      label: '',
    });
    setAccountsList([]);
    setSelectedAccount('নির্বাচন করুন');
    setLoanSectionViewStatus(false);
    setLoanAmountInfo({
      productId: '',
      productName: '',
      balancedPrincipal: '',
      balancedInterest: '',
      balancedTotal: '',
      loanAmount: '',
      interestAmount: '',
      principalPaidAmount: '',
      interestPaidAmount: '',
      duePrincipal: '',
      dueInterest: '',
      interestRebateAmount: '',
      totalAmount: '',
    });
    setRepayAmount(null);
    setNarration(null);
    setMember([]);
    if (value) {
      setProjectId(value);
      setFormErrors({ ...formErrors, project: '', repayAmountRange: '' });
      getSamity(value);
    }
  };

  const getMember = async (samityId) => {
    if (samityId) {
      try {
        const member = await axios.get(getDolMember + '?samityId=' + samityId + '&flag=1&defaultMembers=1', config);
        let memberData = member.data.data;
        setMember(memberData);
      } catch (error) {
        errorHandler(error);
      }
    } else {
      // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
    }
  };

  const handleMember = (value) => {
    setAccountsList([]);
    setSelectedAccount('নির্বাচন করুন');
    setLoanSectionViewStatus(false);
    setLoanAmountInfo({
      productId: '',
      productName: '',
      balancedPrincipal: '',
      balancedInterest: '',
      balancedTotal: '',
      loanAmount: '',
      interestAmount: '',
      principalPaidAmount: '',
      interestPaidAmount: '',
      duePrincipal: '',
      dueInterest: '',
      interestRebateAmount: '',
      totalAmount: '',
    });
    setNarration(null);
    setRepayAmount(null);
    if (projectId && samityId && value) {
      getAccount(projectId, samityId, value);
    }
  };

  const handleNarration = (e) => {
    const { value } = e.target;
    setNarration(value);
    setFormErrors({ ...formErrors, narration: '' });
  };

  let getOffice = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);
      setOfficeList(officeNameData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getDeskList = async (officeId) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + officeId, config);
      const deskData = Data.data.data;
      setDeskList(deskData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleRepayAmount = (e) => {
    const regex = /[০-৯.,0-9]$/;
    if (regex.test(e.target.value) || e.target.value == '') {
      setRepayAmount(bangToEng(e.target.value));
      setFormErrors({ ...formErrors, repayAmount: '' });
    }

    if (Number(bangToEng(e.target.value)) > Number(loanAmountInfo.totalAmount)) {
      setFormErrors({
        ...formErrors,
        repayAmount: '',
        repayAmountRange: `সর্বমোট ঋণ বকেয়ার পরিমাণ ${engToBang(loanAmountInfo.totalAmount)} টাকা`,
      });
    } else {
      setFormErrors({ ...formErrors, repayAmount: '', repayAmountRange: '' });
    }
  };
  let checkMandatory = () => {
    let result = true;
    // const formErrors = { ...formErrors };
    if (!projectId || projectId == 'নির্বাচন করুন') {
      result = false;
      formErrors.project = 'প্রকল্প নির্বাচন করুন';
    }
    if (!samityNameObj.id) {
      result = false;
      formErrors.samity = 'সমিতি নির্বাচন করুন';
    }
    if (!memberNameObj.id) {
      result = false;
      formErrors.member = 'সদস্য নির্বাচন করুন';
    }
    if (!selectedAccount || selectedAccount == 'নির্বাচন করুন') {
      result = false;
      formErrors.account = 'সদস্যের অ্যাকাউন্ট নির্বাচন করুন';
    }

    if (!narration) {
      result = false;
      formErrors.narration = 'মন্তব্য উল্লেখ করুন';
    }
    if (
      repayAmount &&
      loanAmountInfo?.totalAmount &&
      parseInt(repayAmount) === parseInt(loanAmountInfo.totalAmount) &&
      !officeObj.id
    ) {
      result = false;
      formErrors.office = 'অনুমোদনকারীর অফিস নির্বাচন করুন';
    }
    if (
      repayAmount &&
      loanAmountInfo?.totalAmount &&
      parseInt(repayAmount) === parseInt(loanAmountInfo.totalAmount) &&
      !deskObj.id
    ) {
      result = false;
      formErrors.desk = 'অনুমোদনকারী নির্বাচন করুন';
    }
    if (formErrors.repayAmountRange) {
      result = false;
    }
    setFormErrors({ ...formErrors });
    return result;
  };
  const clearStates = () => {
    setSamityNameObj({
      id: '',
      label: '',
    });
    setMemberNameObj({
      id: '',
      label: '',
    });
    setNarration('');
    setOfficeObj({
      id: '',
      label: '',
    });
    setDeskObj({
      id: '',
      label: '',
    });
    setProjectName([]);
    setProjectDisable(false);
    setSamityName([]);
    setMember([]);
    setAccountsList([]);
    setSelectedAccount('নির্বাচন করুন');
    setRepayAmount(null);
    setOfficeList([]);
    setDeskList([]);
    setLoanSectionViewStatus(false);
    setLoanAmountInfo({
      productId: '',
      productName: '',
      balancedPrincipal: '',
      balancedInterest: '',
      balancedTotal: '',
      loanAmount: '',
      interestAmount: '',
      principalPaidAmount: '',
      interestPaidAmount: '',
      duePrincipal: '',
      dueInterest: '',
      interestRebateAmount: '',
      totalAmount: '',
    });
    getProject();
    getOffice();
    if (officeInfo?.id) {
      setOfficeObj({
        id: officeInfo?.id,
        label: officeInfo?.nameBn,
      });
      getDeskList(officeInfo?.id);
    }
  };
  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    if (parseInt(repayAmount) === parseInt(loanAmountInfo.totalAmount)) {
      payload = {
        projectId: projectId ? parseInt(projectId) : null,
        samityId: samityNameObj?.id ? parseInt(samityNameObj.id) : null,
        remarks: narration,
        nextAppDesignationId: deskObj?.id ? parseInt(deskObj.id) : null,
        data: {
          projectId: projectId ? parseInt(projectId) : null,
          samityId: samityNameObj?.id ? parseInt(samityNameObj.id) : null,
          customerId: memberNameObj?.id ? parseInt(memberNameObj.id) : null,
          accountId: parseInt(selectedAccount),
          repayAmount: parseInt(repayAmount),
          remarks: narration,
        },
      };
    } else if (parseInt(repayAmount) < parseInt(loanAmountInfo.totalAmount)) {
      payload = {
        ...(projectId && { projectId: projectId }),
        productDetails: [
          {
            productId: loanAmountInfo.productId,
            accountId: parseInt(selectedAccount),
            tranAmt: parseInt(repayAmount),
          },
        ],
      };
    }
    if (result) {
      setLoadingDataSaveUpdate(true);
      await Swal.fire({
        title: 'আপনি কি নিশ্চিত?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ফিরে যান ।',
        confirmButtonText: 'হ্যাঁ, নিশ্চিত করুন!',
      }).then((result) => {
        if (result.isConfirmed) {
          if (parseInt(repayAmount) === parseInt(loanAmountInfo.totalAmount)) {
            axios
              .post(specificApplication + 'loanSettlement' + '/' + componentName, payload, config)
              .then((response) => {
                Swal.fire({
                  title: 'সফল হয়েছে!',
                  text: response?.data?.message,
                  icon: 'success',
                  // showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  // cancelButtonColor: "#d33",
                  // cancelButtonText: "ফিরে যান ।",
                  confirmButtonText: 'ঠিক আছে!',
                });
                clearStates();
                setLoadingDataSaveUpdate(false);
              })
              .catch((error) => {
                console.log({ error });
                setLoadingDataSaveUpdate(false);
                Swal.fire({
                  title: 'ব্যর্থ হয়েছে!',
                  text: error?.response?.data?.errors[0]?.message,
                  icon: 'error',
                  showCancelButton: true,
                  showConfirmButton: false,
                  // confirmButtonColor: "#3085d6",
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'ফিরে যান ।',
                  // confirmButtonText: "ঠিক আছে!",
                });
              });
          } else if (parseInt(repayAmount) < parseInt(loanAmountInfo.totalAmount)) {
            axios
              .post(transactionOfMember, payload, config)
              .then((response) => {
                Swal.fire({
                  title: 'সফল হয়েছে!',
                  text: response?.data?.message,
                  icon: 'success',
                  // showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  // cancelButtonColor: "#d33",
                  // cancelButtonText: "ফিরে যান ।",
                  confirmButtonText: 'ঠিক আছে!',
                });
                clearStates();
                setLoadingDataSaveUpdate(false);
              })
              .catch((error) => {
                console.log({ error });
                setLoadingDataSaveUpdate(false);
                Swal.fire({
                  title: 'ব্যর্থ হয়েছে!',
                  text: error?.response?.data?.errors[0]?.message,
                  icon: 'error',
                  showCancelButton: true,
                  showConfirmButton: false,
                  // confirmButtonColor: "#3085d6",
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'ফিরে যান ।',
                  // confirmButtonText: "ঠিক আছে!",
                });
              });
          }
        }
        if (result.isDismissed) {
          setLoadingDataSaveUpdate(false);
        }
      });
    }
  };

  // }).catch((error) => {
  //     console.log({ error });
  //     setLoadingDataSaveUpdate(false);
  //     Swal.fire("ব্যর্থ হয়েছে!", error?.response?.data?.errors[0]?.message, "error");
  // });

  // NotificationManager.success(loanSettlement?.data?.message, "", 5000);
  // setLoadingDataSaveUpdate(false);
  // setProjectId("নির্বাচন করুন");
  //  catch (error) {
  //     setLoadingDataSaveUpdate(false);
  //     errorHandler(error);
  //   }

  return (
    <>
      <Grid container>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container spacing={2} className="section">
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                id="projectId"
                label={star('প্রকল্পের নাম')}
                name="projectName"
                onChange={handleProject}
                disabled={projectDisable}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                value={projectId ? projectId : ' '}
                error={formErrors.project ? true : false}
                helperText={formErrors.project}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {ProjectName
                  ? ProjectName.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.projectNameBangla}
                    </option>
                  ))
                  : ' '}
              </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="samityId"
                key={samityNameObj}
                onChange={(event, value) => {
                  if (value == null) {
                    setSamityNameObj({
                      id: '',
                      label: '',
                    });
                  } else {
                    value &&
                      setSamityNameObj({
                        id: value.id,
                        label: value.label,
                      });
                    setFormErrors({ ...formErrors, samity: '', repayAmountRange: '' });

                    setSamityId(value.id);
                    setMemberNameObj({
                      id: '',
                      label: '',
                    });
                    setAccountsList([]);
                    setSelectedAccount('নির্বাচন করুন');
                    setLoanSectionViewStatus(false);
                    setLoanAmountInfo({
                      productId: '',
                      productName: '',
                      balancedPrincipal: '',
                      balancedInterest: '',
                      balancedTotal: '',
                      loanAmount: '',
                      interestAmount: '',
                      principalPaidAmount: '',
                      interestPaidAmount: '',
                      duePrincipal: '',
                      dueInterest: '',
                      interestRebateAmount: '',
                      totalAmount: '',
                    });
                    setRepayAmount(null);
                    setNarration(null);
                    setMember([]);
                    getMember(value.id);
                  }
                  // ("VVVVVV",value);
                }}
                options={samityName.map((option) => ({
                  id: option.id,
                  label: option.samityName,
                }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={samityNameObj.id === '' ? star(' সমিতির নাম নির্বাচন করুন') : star(' সমিতির নাম')}
                    variant="outlined"
                    error={formErrors.samity ? true : false}
                    helperText={formErrors.samity}
                    size="small"
                  />
                )}
                value={samityNameObj}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="memberName"
                key={memberNameObj}
                onChange={(event, value) => {
                  if (value == null) {
                    setMemberNameObj({
                      id: '',
                      label: '',
                    });
                  } else {
                    value &&
                      setMemberNameObj({
                        id: value.id,
                        label: value.label,
                      });
                    setFormErrors({ ...formErrors, member: '', repayAmountRange: '' });

                    {
                      handleMember(value.id);
                    }
                  }
                }}
                options={member.map((option) => ({
                  id: option.id,
                  label: option.nameBn,
                }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={memberNameObj.id === '' ? star('সদস্যের নাম নির্বাচন করুন') : star(' সদস্যের নাম')}
                    variant="outlined"
                    error={formErrors.member ? true : false}
                    helperText={formErrors.member}
                    size="small"
                  />
                )}
                value={memberNameObj}
              />
              {/* {!memberNameObj?.id && (
                              <span style={{ color: "red" }}>{formErrors.member}</span>
                          )} */}
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('অ্যাকাউন্টের তালিকা')}
                id="accountId"
                name="account"
                onChange={handleAccountList}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                value={selectedAccount ? selectedAccount : 'নির্বাচন করুন'}
                error={formErrors.account ? true : false}
                helperText={formErrors.account}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {accountsList
                  ? accountsList.map((option) => (
                    <option key={option.accountId} value={option.accountId}>
                      {`${option.productName} - ${option.accountNo}`}
                    </option>
                  ))
                  : ''}
              </TextField>
            </Grid>
            {loanSectionViewStatus ? (
              <Grid item md={12} xs={12}>
                <Grid container className="section">
                  <SubHeading>সদস্যের ঋণ সংক্রান্ত তথ্য</SubHeading>
                  <Grid container spacing={2.5}>
                    <Grid item md={6} xs={12}>
                      <Box className="modal-box">
                        <div className="info">
                          <span className="label">প্রোডাক্টের নাম</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.productName ? loanAmountInfo.productName : ''}
                        </div>
                        <div className="info">
                          <span className="label">ঋণের পরিমাণ</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.loanAmount
                            ? `${engToBang(loanAmountInfo.loanAmount.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                        <div className="info">
                          <span className="label">সর্বমোট পরিশোধিত ঋণ</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.principalPaidAmount
                            ? `${engToBang(loanAmountInfo.principalPaidAmount.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                        <div className="info">
                          <span className="label">বকেয়া আসল</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.duePrincipal
                            ? `${engToBang(loanAmountInfo.duePrincipal.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Box className="modal-box">
                        <div className="info">
                          <span className="label">সার্ভিস চার্জ</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.interestAmount
                            ? `${engToBang(loanAmountInfo.interestAmount.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                        <div className="info">
                          <span className="label">পরিশোধিত সার্ভিস চার্জ</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.interestPaidAmount
                            ? `${engToBang(loanAmountInfo.interestPaidAmount.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                        <div className="info">
                          <span className="label">বকেয়া সার্ভিস চার্জ</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.dueInterest
                            ? `${engToBang(loanAmountInfo.dueInterest.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                        <div className="info">
                          <span className="label">মওকুফকৃত সার্ভিস চার্জ</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.interestRebateAmount
                            ? `${engToBang(loanAmountInfo.interestRebateAmount.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                        <div className="info">
                          <span className="label">সর্বমোট</span>
                          <b>: &nbsp;</b>
                          {loanAmountInfo?.totalAmount
                            ? `${engToBang(loanAmountInfo.totalAmount.toLocaleString('bn-BD'))} টাকা`
                            : `${engToBang('0')} টাকা`}
                        </div>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              ''
            )}
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('জমার পরিমাণ')}
                onChange={handleRepayAmount}
                name="advanceRepayAmount"
                variant="outlined"
                size="small"
                value={repayAmount ? engToBang(repayAmount) : ''}
                error={formErrors.repayAmount || formErrors.repayAmountRange ? true : false}
                helperText={formErrors.repayAmount || formErrors.repayAmountRange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('মন্তব্য')}
                onChange={handleNarration}
                name="discription"
                variant="outlined"
                size="small"
                value={narration ? narration : ''}
                error={formErrors.narration ? true : false}
                helperText={formErrors.narration}
              />
            </Grid>
            {repayAmount &&
              loanAmountInfo?.totalAmount &&
              parseInt(repayAmount) === parseInt(loanAmountInfo.totalAmount)
              ? [
                <Grid item md={6} xs={12} key="office">
                  <Autocomplete
                    disablePortal
                    inputProps={{ style: { padding: 0, margin: 0 } }}
                    name="officeName"
                    onChange={(event, value) => {
                      if (!value) {
                        setOfficeObj({
                          id: '',
                          label: '',
                        });
                        setDeskObj({
                          id: '',
                          label: '',
                        });
                      } else {
                        value &&
                          setOfficeObj({
                            id: value.id,
                            label: value.label,
                          });
                        setFormErrors({ ...formErrors, office: '' });
                        setDeskObj({
                          id: '',
                          label: '',
                        });
                        getDeskList(value.id);
                      }
                    }}
                    options={officeList.map((option) => {
                      return {
                        id: option.id,
                        label: option.nameBn,
                      };
                    })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={officeObj.id === '' ? star('কার্যালয়ের নাম') : star('কার্যালয়ের নাম')}
                        variant="outlined"
                        error={formErrors.office ? true : false}
                        helperText={formErrors.office}
                        size="small"
                      />
                    )}
                    value={officeObj}
                  />
                </Grid>,
                <Grid item lg={6} md={6} xs={12} key="desk">
                  <Autocomplete
                    disablePortal
                    inputProps={{ style: { padding: 0, margin: 0 } }}
                    name="employee"
                    onChange={(event, value) => {
                      if (value == null) {
                        setDeskObj({
                          id: '',
                          label: '',
                        });
                      } else {
                        value &&
                          setDeskObj({
                            id: value.id,
                            label: value.label,
                          });
                        setFormErrors({ ...formErrors, desk: '' });
                      }
                    }}
                    options={deskList.map((option) => ({
                      id: option.designationId,
                      label: option.nameBn + '-' + option.designation,
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={
                          deskObj.id === ''
                            ? star('পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন')
                            : star('পর্যবেক্ষক/অনুমোদনকারীর নাম')
                        }
                        variant="outlined"
                        size="small"
                        error={formErrors.desk ? true : false}
                        helperText={formErrors.desk}
                      />
                    )}
                    value={deskObj}
                  />

                  {/* {!deskObj?.id && (
                              <span style={{ color: "red" }}>{formErrors.desk}</span>
                          )} */}
                </Grid>,
              ]
              : ''}

            <Grid container className="btn-container">
              {loadingDataSaveUpdate ? (
                <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
                  "সংরক্ষণ করা হচ্ছে..."
                </LoadingButton>
              ) : (
                <Tooltip title="সংরক্ষণ করুন">
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={onSubmitData}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {' '}
                    সংরক্ষণ করুন
                  </Button>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LoanSettlement;
