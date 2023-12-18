import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Button, Grid, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from 'service/numberConverter';
import {
  dueLoanAmountInfo,
  employeeRecordByOffice,
  getDolMember,
  loanProject,
  officeName,
  productWiseAccount,
  samityNameRoute,
  specificApplication,
} from '../../../../../url/ApiList';
import star from '../../loan-application/utils';

const Adjustment = () => {
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
  const [savingsAccountsList, setSavingsAccountsList] = useState([]);
  const [loanAccountsList, setLoanAccountsList] = useState([]);

  const [savingsAccount, setSavingsAccount] = useState(null);
  const [loanAccount, setLoanAccount] = useState(null);

  const [savingsAccountInfo, setSavingsAccountInfo] = useState({
    accountId: '',
    balance: '',
    blockAmount: '',
  });

  const [loanAccountInfo, setLoanAccountInfo] = useState({
    accountId: '',
  });

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
  const [savingsAccountDisableStatus, setSavingsAccountDisableStatus] = useState(false);
  const [loanAccountDisableStatus, setLoanAccountDisableStatus] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState(null);
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

  console.log({ loanAmountInfo });
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

  const getAccount = async (samityId, memberId) => {
    if (samityId && memberId) {
      // for get savings account
      try {
        const savingsAccount = await axios.get(
          productWiseAccount + '?samityId=' + samityId + '&customerId=' + memberId + '&productNature=R',
          config,
        );
        let savingsAccountData = savingsAccount.data.data;

        setSavingsAccountsList(savingsAccountData);

        if (savingsAccountData.length === 1) {
          setSavingsAccount(JSON.stringify(savingsAccountData[0]));
          setFormErrors({ ...formErrors, savingsAccount: '' });
          setSavingsAccountInfo({
            accountId: savingsAccountData[0].accountId,
            balance: savingsAccountData[0].currentBalance,
            blockAmount: savingsAccountData[0].blockAmt,
          });

          setSavingsAccountDisableStatus(true);
        }
      } catch (error) {
        errorHandler(error);
      }
      // for get loan account
      try {
        const loanAccounts = await axios.get(
          productWiseAccount + '?samityId=' + samityId + '&customerId=' + memberId + '&productNature=L',
          config,
        );
        let loanAccountData = loanAccounts.data.data;

        setLoanAccountsList(loanAccountData);

        if (loanAccountData.length === 1) {
          setLoanAccount(JSON.stringify(loanAccountData[0]));
          getDueLoanAmountInfo(loanAccountData[0].accountId);
          setFormErrors({ ...formErrors, loanAccount: '' });
          setLoanAccountInfo({
            accountId: loanAccountData[0].accountId,
          });

          setLoanAccountDisableStatus(true);
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  // due loan details
  const getDueLoanAmountInfo = async (accountId) => {
    if (accountId) {
      try {
        const dueLoanInfoApiResponse = await axios.get(dueLoanAmountInfo + '?accountId=' + accountId, config);
        let dueLoanInfo = dueLoanInfoApiResponse.data.data;
        setLoanAmountInfo({
          ...dueLoanInfo,
        });
        // setLoanSectionViewStatus(true);
      } catch (error) {
        // setLoanSectionViewStatus(false);
        errorHandler(error);
      }
    }
  };

  // savings account handle
  const handleSavingsAccount = (e) => {
    let { value } = e.target;
    value = JSON.parse(value);
    setSavingsAccount(JSON.stringify(value));
    setFormErrors({ ...formErrors, savingsAccount: '' });
    setSavingsAccountInfo({
      accountId: value.accountId,
      balance: value.currentBalance,
      blockAmount: value.blockAmt,
    });
  };
  // loan account handle
  const handleLoanAccount = (e) => {
    let { value } = e.target;
    value = JSON.parse(value);
    setLoanAccount(JSON.stringify(value));
    getDueLoanAmountInfo(value.accountId);
    setFormErrors({ ...formErrors, loanAccount: '' });
    setLoanAccountInfo({
      accountId: value.accountId,
    });
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
    setFormErrors({ ...formErrors, project: '', adjustmentAmountRange: '' });
    setProjectId(value);
    setSavingsAccountsList([]);
    setLoanAccountsList([]);
    setSavingsAccountInfo({
      accountId: '',
      balance: '',
      blockAmount: '',
    });
    setLoanAccountInfo({
      accountId: '',
    });
    setAdjustmentAmount(null);
    setNarration(null);
    setMember([]);
    setMemberNameObj({ id: '', label: '' });
    setSamityName([]);
    setSamityNameObj({ id: '', label: '' });
    getSamity(value);
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
    }
  };

  const handleMember = (value) => {
    setFormErrors({ ...formErrors, member: '', adjustmentAmountRange: '' });
    setMemberNameObj({
      id: value.id,
      label: value.label,
    });
    setSavingsAccountsList([]);
    setLoanAccountsList([]);

    setSavingsAccountInfo({
      accountId: '',
      balance: '',
      blockAmount: '',
    });
    setLoanAccountInfo({
      accountId: '',
    });
    setSavingsAccountDisableStatus(false);
    setLoanAccountDisableStatus(false);

    setAdjustmentAmount(null);
    setNarration(null);
    if (samityId && value?.id) {
      getAccount(samityId, value?.id);
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

  const handleadjustmentAmount = (e) => {
    const regex = /[০-৯.,0-9]$/;
    if (regex.test(e.target.value) || e.target.value == '') {
      setAdjustmentAmount(bangToEng(e.target.value));
      setFormErrors({ ...formErrors, adjustmentAmount: '' });
    }
    if (
      String(savingsAccountInfo.balance) &&
      String(savingsAccountInfo.blockAmount) &&
      Number(bangToEng(e.target.value)) > Number(savingsAccountInfo.balance) - Number(savingsAccountInfo.blockAmount)
    ) {
      setFormErrors({
        ...formErrors,
        adjustmentAmount: '',
        adjustmentAmountRange: 'সঞ্চয় হিসাবে পর্যাপ্ত টাকা নেই',
      });
    } else if (Number(loanAmountInfo.totalAmount) < Number(bangToEng(e.target.value))) {
      setFormErrors({
        ...formErrors,
        adjustmentAmount: '',
        adjustmentAmountRange: 'সমন্বয়ের পরিমান সর্বমোট ঋণ বকেয়া থেকে বেশি হতে পারবে না',
      });
    } else {
      setFormErrors({
        ...formErrors,
        adjustmentAmount: '',
        adjustmentAmountRange: '',
      });
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
    if (!savingsAccountInfo.accountId || savingsAccountInfo.accountId == 'নির্বাচন করুন') {
      result = false;
      formErrors.savingsAccount = 'সদস্যের সঞ্চয় হিসাব নির্বাচন করুন';
    }
    if (!loanAccountInfo.accountId || loanAccountInfo.accountId == 'নির্বাচন করুন') {
      result = false;
      formErrors.loanAccount = 'সদস্যের ঋণ হিসাব নির্বাচন করুন';
    }
    if (!adjustmentAmount) {
      result = false;
      formErrors.adjustmentAmount = 'ঋণ সমন্বয়ের পরিমাণ উল্লেখ করুন';
    }
    if (!narration) {
      result = false;
      formErrors.narration = 'মন্তব্য উল্লেখ করুন';
    }
    if (!officeObj.id) {
      result = false;
      formErrors.office = 'অনুমোদনকারীর অফিস নির্বাচন করুন';
    }
    if (!deskObj.id) {
      result = false;
      formErrors.desk = 'অনুমোদনকারী নির্বাচন করুন';
    }
    if (formErrors.adjustmentAmountRange) {
      result = false;
    }
    setFormErrors({ ...formErrors });
    return result;
  };

  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    let loanAdjustment;
    payload = {
      projectId: projectId ? parseInt(projectId) : null,
      samityId: samityNameObj?.id ? parseInt(samityNameObj.id) : null,
      remarks: narration,
      nextAppDesignationId: deskObj?.id ? parseInt(deskObj.id) : null,
      data: {
        projectId: projectId ? parseInt(projectId) : null,
        samityId: samityNameObj?.id ? parseInt(samityNameObj.id) : null,
        customerId: memberNameObj?.id ? parseInt(memberNameObj.id) : null,
        savingsAccountId: savingsAccountInfo?.accountId ? parseInt(savingsAccountInfo.accountId) : null,
        loanAccountId: loanAccountInfo?.accountId ? parseInt(loanAccountInfo.accountId) : null,
        adjustmentAmount: adjustmentAmount ? parseInt(adjustmentAmount) : null,
        remarks: narration,
      },
    };
    if (result) {
      try {
        setLoadingDataSaveUpdate(true);
        loanAdjustment = await axios.post(
          specificApplication + 'loanAdjustment' + '/' + componentName,
          payload,
          config,
        );
        NotificationManager.success(loanAdjustment?.data?.message, '', 5000);
        setLoadingDataSaveUpdate(false);
        setProjectId('নির্বাচন করুন');
        setSamityNameObj({
          id: '',
          label: '',
        });
        setMemberNameObj({
          id: '',
          label: '',
        });
        setAdjustmentAmount(null);
        setFormErrors({ ...formErrors, adjustmentAmountRange: '' });
        setNarration(null);
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
        setSavingsAccountsList([]);
        setLoanAccountsList([]);

        setSavingsAccount(null);
        setLoanAccount(null);

        setSavingsAccountInfo({
          accountId: '',
          balance: '',
          blockAmount: '',
        });
        setLoanAccountInfo({
          accountId: '',
        });

        setSavingsAccountDisableStatus(false);
        setLoanAccountDisableStatus(false);

        setOfficeList([]);
        setDeskList([]);
        getProject();
        getOffice();
        if (officeInfo?.id) {
          setOfficeObj({
            id: officeInfo?.id,
            label: officeInfo?.nameBn,
          });
          getDeskList(officeInfo?.id);
        }
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    }
  };

  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12}>
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
                    setFormErrors({
                      ...formErrors,
                      samity: '',
                      adjustmentAmountRange: '',
                    });

                    setSamityId(value.id);
                    setSavingsAccountsList([]);
                    setLoanAccountsList([]);
                    setSavingsAccountInfo({
                      accountId: '',
                      balance: '',
                      blockAmount: '',
                    });
                    setLoanAccountInfo({
                      accountId: '',
                    });
                    setAdjustmentAmount(null);
                    setNarration(null);
                    setMember([]);
                    setMemberNameObj({ id: '', label: '' });
                    getMember(value.id);
                  }
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
                  if (!value) {
                    // setLoanDetails();
                    setMemberNameObj({
                      id: '',
                      label: '',
                    });
                  } else {
                    handleMember(value);
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
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('সঞ্চয় হিসাবের তালিকা')}
                id="savingsaccountId"
                name="savingsaccount"
                onChange={handleSavingsAccount}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                value={savingsAccount ? savingsAccount : ' '}
                disabled={savingsAccountDisableStatus}
                error={formErrors.savingsAccount ? true : false}
                helperText={formErrors.savingsAccount}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {savingsAccountsList
                  ? savingsAccountsList.map((option) => (
                    <option key={option.accountId} value={JSON.stringify(option)}>
                      {`${option.productName} - ${option.accountNo}`}
                    </option>
                  ))
                  : ''}
              </TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="সঞ্চয়ের স্থিতি (টাকা)"
                name="accountBalance"
                variant="outlined"
                size="small"
                value={savingsAccountInfo?.balance ? engToBang(savingsAccountInfo.balance) : ''}
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="ব্লক এমাউন্ট"
                name="blockAmount"
                variant="outlined"
                size="small"
                value={savingsAccountInfo?.blockAmount ? engToBang(savingsAccountInfo.blockAmount) : ''}
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={star('ঋণ হিসাবের তালিকা')}
                id="loanaccountId"
                name="loanaccount"
                onChange={handleLoanAccount}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                size="small"
                value={loanAccount ? loanAccount : ' '}
                disabled={loanAccountDisableStatus}
                error={formErrors.loanAccount ? true : false}
                helperText={formErrors.loanAccount}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {loanAccountsList
                  ? loanAccountsList.map((option) => (
                    <option key={option.accountId} value={JSON.stringify(option)}>
                      {`${option.productName} - ${option.accountNo}`}
                    </option>
                  ))
                  : ''}
              </TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="বকেয়া আসল (টাকা)"
                name="accountBalance"
                variant="outlined"
                size="small"
                value={loanAmountInfo?.duePrincipal ? engToBang(loanAmountInfo.duePrincipal) : ''}
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="বকেয়া সার্ভিস চার্জ (টাকা)"
                name="accountBalance"
                variant="outlined"
                size="small"
                value={loanAmountInfo?.dueInterest ? engToBang(loanAmountInfo.dueInterest) : ''}
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="সর্বমোট (টাকা)"
                name="accountBalance"
                variant="outlined"
                size="small"
                value={loanAmountInfo?.totalAmount ? engToBang(loanAmountInfo.totalAmount) : ''}
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                label={star('সমন্বয়ের পরিমান (টাকা)')}
                name="adjustmentAmount"
                type="text"
                number
                textAlign="right"
                value={adjustmentAmount ? engToBang(adjustmentAmount) : ''}
                error={formErrors?.adjustmentAmount || formErrors?.adjustmentAmountRange ? true : false}
                helperText={formErrors?.adjustmentAmount || formErrors?.adjustmentAmountRange}
                variant="outlined"
                size="small"
                onChange={(e) => handleadjustmentAmount(e)}
                sx={{ padding: '2px', minWidth: '100%' }}
              ></TextField>
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
            <Grid item md={6} xs={12}>
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
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
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
            </Grid>
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

export default Adjustment;
