import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Button, Grid, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from 'service/numberConverter';
import {
  customerAccountInfo,
  employeeRecordByOffice,
  getDolMember,
  loanProject,
  officeName,
  samityNameRoute,
  specificApplication,
} from '../../../../../url/ApiList';
import star from '../../loan-application/utils';

import Swal from 'sweetalert2';

const Withdraw = () => {
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
  const [account, setAccount] = useState(null);
  const [accountInfo, setAccountInfo] = useState({
    accountId: '',
    balance: '',
    blockAmount: '',
    nomineeInfo: [],
  });

  const [nomineeSectionViewStatus, setNomineeSectionViewStatus] = useState(false);
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
  const [accountListDisableStatus, setAccountListDisableStatus] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
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
        let allAccountData = allAccounts.data.data.filter((value) => value.alltrn == 'D' || value.alltrn == 'B');
        setAccountsList(allAccountData);
        if (allAccountData.length === 1) {
          setAccount(JSON.stringify(allAccountData[0]));
          setFormErrors({ ...formErrors, account: '' });
          setAccountInfo({
            accountId: allAccountData[0].accountId,
            balance: allAccountData[0].currentBalance,
            blockAmount: allAccountData[0].blockAmt,
            nomineeInfo: allAccountData[0].nomineeInfo,
          });
          if (allAccountData[0]?.nomineeInfo && allAccountData[0].nomineeInfo.length > 0) {
            setNomineeSectionViewStatus(true);
          } else {
            setNomineeSectionViewStatus(false);
          }
          setAccountListDisableStatus(true);
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const handleAccountList = (e) => {
    let { value } = e.target;
    value = JSON.parse(value);
    setAccount(JSON.stringify(value));
    setFormErrors({ ...formErrors, account: '' });
    setAccountInfo({
      accountId: value.accountId,
      balance: value.currentBalance,
      blockAmount: value.blockAmt,
      nomineeInfo: value.nomineeInfo,
    });
    if (value?.nomineeInfo && value.nomineeInfo.length > 0) {
      setNomineeSectionViewStatus(true);
    } else {
      setNomineeSectionViewStatus(false);
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
    setFormErrors({ ...formErrors, project: '', withdrawAmountRange: '' });
    setProjectId(value);
    setAccountsList([]);
    setAccountInfo({
      accountId: '',
      balance: '',
      blockAmount: '',
    });
    setWithdrawAmount(null);
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
    } else {
      // NotificationManager.error("সমিতি নির্বাচনকরুন", "Error", 5000);
    }
  };

  const handleMember = (value) => {
    setFormErrors({ ...formErrors, member: '', withdrawAmountRange: '' });
    setMemberNameObj({
      id: value.id,
      label: value.label,
    });
    setAccountsList([]);
    setAccountInfo({
      accountId: '',
      balance: '',
      blockAmount: '',
    });
    setAccountListDisableStatus(false);

    setWithdrawAmount(null);
    setNarration(null);
    if (projectId && samityId && value?.id) {
      getAccount(projectId, samityId, value?.id);
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

  const handleWithdrawAmount = (e) => {
    const regex = /[০-৯.,0-9]$/;
    if (regex.test(e.target.value) || e.target.value == '') {
      setWithdrawAmount(bangToEng(e.target.value));
      setFormErrors({ ...formErrors, withdrawAmount: '' });
    }
    if (
      String(accountInfo.balance) &&
      String(accountInfo.blockAmount) &&
      Number(bangToEng(e.target.value)) > Number(accountInfo.balance) - Number(accountInfo.blockAmount)
    ) {
      setFormErrors({
        ...formErrors,
        withdrawAmount: '',
        withdrawAmountRange: 'অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই',
      });
    } else {
      setFormErrors({
        ...formErrors,
        withdrawAmount: '',
        withdrawAmountRange: '',
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
    if (!accountInfo.accountId || accountInfo.accountId == 'নির্বাচন করুন') {
      result = false;
      formErrors.account = 'সদস্যের অ্যাকাউন্ট নির্বাচন করুন';
    }
    if (!withdrawAmount) {
      result = false;
      formErrors.withdrawAmount = 'নগদ উত্তোলনের পরিমাণ উল্লেখ করুন';
    }
    if (!narration) {
      result = false;
      formErrors.narration = 'লেনদেনের মন্তব্য উল্লেখ করুন';
    }
    if (!officeObj.id) {
      result = false;
      formErrors.office = 'অনুমোদনকারীর অফিস নির্বাচন করুন';
    }
    if (!deskObj.id) {
      result = false;
      formErrors.desk = 'অনুমোদনকারী নির্বাচন করুন';
    }
    if (formErrors.withdrawAmountRange) {
      result = false;
    }
    setFormErrors({ ...formErrors });
    return result;
  };

  const clearStates = () => {
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
    setWithdrawAmount(null);
    setFormErrors({ ...formErrors, withdrawAmountRange: '' });
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
    setAccountsList([]);
    setAccount(null);
    setAccountInfo({
      balance: '',
      blockAmount: '',
    });
    setNomineeSectionViewStatus(false);
    setAccountListDisableStatus(false);
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
  };

  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    payload = {
      projectId: projectId ? parseInt(projectId) : null,
      samityId: samityNameObj?.id ? parseInt(samityNameObj.id) : null,
      remarks: narration,
      nextAppDesignationId: deskObj?.id ? parseInt(deskObj.id) : null,
      data: {
        projectId: projectId ? parseInt(projectId) : null,
        samityId: samityNameObj?.id ? parseInt(samityNameObj.id) : null,
        customerId: memberNameObj?.id ? parseInt(memberNameObj.id) : null,
        accountId: accountInfo?.accountId ? parseInt(accountInfo.accountId) : null,
        withdrawAmount: withdrawAmount ? parseInt(withdrawAmount) : null,
        remarks: narration,
      },
    };
    if (result) {
      // cashWithdraw = await axios.post(
      //     specificApplication + "cashWithdraw" + "/" + componentName,
      //     payload,
      //     config
      // );
      setLoadingDataSaveUpdate(false);
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
        console.log({ result });
        if (result.isConfirmed) {
          axios
            .post(specificApplication + 'cashWithdraw' + '/' + componentName, payload, config)
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
        } else {
          // setLoadingDataSaveUpdate(false);
        }
      });
      // NotificationManager.success(cashWithdraw?.data?.message, "", 5000);
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
              {/* {(!projectId || projectId == "নির্বাচন করুন") && (
                                <span style={{ color: "red", }}>{formErrors.project}</span>
                            )} */}
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
                      withdrawAmountRange: '',
                    });

                    setSamityId(value.id);
                    setAccountsList([]);
                    setAccountInfo({
                      accountId: '',
                      balance: '',
                      blockAmount: '',
                    });
                    setWithdrawAmount(null);
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
              {/* {!samityNameObj?.id && (
                                <span style={{ color: "red" }}>{formErrors.samity}</span>
                            )} */}
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="memberName"
                key={memberNameObj}
                onChange={(event, value) => {
                  if (!value) {
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
                value={account ? account : ' '}
                disabled={accountListDisableStatus}
                error={formErrors.account ? true : false}
                helperText={formErrors.account}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {accountsList
                  ? accountsList.map((option) => (
                    <option key={option.accountId} value={JSON.stringify(option)}>
                      {`${option.productName} - ${option.accountNo}`}
                    </option>
                  ))
                  : ''}
              </TextField>
              {/* {!accountId || accountId == "নির্বাচন করুন" && (
                                <span style={{ color: "red" }}>{formErrors.account}</span>
                            )} */}
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="অ্যাকাউন্ট ব্যালেন্স"
                name="accountBalance"
                variant="outlined"
                size="small"
                value={accountInfo?.balance ? engToBang(accountInfo.balance) : ''}
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
                value={accountInfo?.blockAmount ? engToBang(accountInfo.blockAmount) : ''}
                disabled={true}
              />
            </Grid>
            {nomineeSectionViewStatus ? (
              <Grid item md={12} xs={12}>
                <Grid container className="section">
                  <SubHeading>অ্যাকাউন্টের নমিনি সংক্রান্ত তথ্য</SubHeading>
                  {accountInfo?.nomineeInfo
                    ? accountInfo.nomineeInfo.map((option, index) => (
                      <Grid key={''} container spacing={1.5} sx={{ marginLeft: '10px' }}>
                        <Grid item md={12} xs={12} sx={{ marginLeft: '10px' }}>
                          <div className="info">
                            <span className="label">{`নমিনি- ${engToBang(index + 1)}`}</span>
                          </div>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            fullWidth
                            label="নমিনির নাম"
                            name="nomineeName"
                            variant="outlined"
                            size="small"
                            value={option?.nomineeName ? option.nomineeName : ''}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            fullWidth
                            label="নমিনির সাথে সদস্যের সম্পর্ক"
                            name="nomineeRelation"
                            variant="outlined"
                            size="small"
                            value={option?.relation ? option.relation : ''}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            fullWidth
                            label="নমিনির শতকরা পরিমাণ"
                            name="nomineePercentage"
                            variant="outlined"
                            size="small"
                            value={option?.percentage ? option.percentage : ''}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    ))
                    : ''}
                </Grid>
              </Grid>
            ) : (
              ''
            )}
            <Grid item md={6} xs={12}>
              <TextField
                label={star('উত্তোলনের পরিমাণ')}
                name="withdrawAmount"
                type="text"
                number
                textAlign="right"
                value={withdrawAmount ? engToBang(withdrawAmount) : ''}
                error={formErrors?.withdrawAmount || formErrors?.withdrawAmountRange ? true : false}
                helperText={formErrors?.withdrawAmount || formErrors?.withdrawAmountRange}
                variant="outlined"
                size="small"
                onChange={(e) => handleWithdrawAmount(e)}
                sx={{ padding: '2px', minWidth: '100%' }}
              ></TextField>
              {/* {!withdrawAmount && (
                                <span style={{ color: "red" }}>
                                    {formErrors.withdrawAmount}
                                </span>
                            )} */}
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
              {/* {!officeObj?.id && (
                                <span style={{ color: "red" }}>{formErrors.office}</span>
                            )} */}
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

              {/* {!deskObj?.id && (
                                <span style={{ color: "red" }}>{formErrors.desk}</span>
                            )} */}
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

export default Withdraw;
