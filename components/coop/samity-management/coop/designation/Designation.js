/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { numberToWord } from 'service/numberToWord';
import { steperFun } from 'service/steper';
import { allMemberInfo, committeeInfo, committeeRole } from '../../../../../url/coop/ApiList';

const Committee = [
  {
    value: '0',
    label: 'বাছাই করুন',
  },
  {
    value: '6',
    label: '৬ জন',
  },
  {
    value: '9',
    label: '৯ জন',
  },
  {
    value: '12',
    label: '১২ জন',
  },
];
// main section
const Designation = () => {
  const router = useRouter();
  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
  };
  const config = localStorageData('config');

  const getId = localStorageData('getSamityId');

  const stepId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('stepId')) : null;
  ///////////////////////////////////////////////////
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [memDegData, setMemDegData] = useState([]);
  const [memName, setMemName] = useState([]);
  const [copyMemName, setCopyMemName] = useState([]);

  // const [selectMemName, setSelectMemName] = useState([]);
  // const [selectRemoveMemName, setSelectRemoveMemName] = useState([]);
  const [committePerson, setCommitteePerson] = useState([]);
  const [countValue, setCountValue] = useState([]);
  let [allCommiteeData, setAllCommiteeData] = useState([]);
  let [countNumber, setCountNumber] = useState();
  // let [allCommiteeMem, setAllCommiteeMem] = useState([]);
  let [checked, setChecked] = useState(false);
  let [countNewNumber, setCountNewNumber] = useState('');
  const [hashArray, setHashArray] = useState([]);
  // const [copyMemDegData, setCopyMemDegData] = useState([]);
  // const [hashArrayForDesignation, setHashArrayForDesignation] = useState([]);
  const [designation, setDesignation] = useState({
    organizerp: '',
    communicationP: '',
    signingp: '',
  });
  const [formErrors, setFormErrors] = useState({
    communicationP: '',
    organizerp: '',
    signingp: '',
  });

  const handleSwitch = (e) => {
    setChecked(e.target.checked);
    setDesignation({ ...designation, signingp: '' });
  };

  useEffect(() => {
    checkPageValidation();
    getDesigData();
    getMemberInfo();
    getCommeteeData();
    creatingArrays();
  }, [countNumber]);

  // get member data
  let getMemberInfo = async () => {
    try {
      let memberInformation = await axios.get(allMemberInfo + '?samityId=' + getId + '&isPagination=false', config);
      let memberInfo = memberInformation.data.data;
      setMemName(memberInfo);

      //////////////////////////// not needed///////////////////////////////////////
      let newMemberInfo = [];
      memberInfo.map((row) => {
        newMemberInfo.push({
          id: row.id,
          memberNameBangla: row.memberNameBangla,
          isSelected: 0,
          dupId: 0,
        });
      });
      // setSelectMemName(newMemberInfo);
      /////////////////////////// end //////////////////////////////////
    } catch (error) {
      errorHandler(error);
    }
  };

  // get designation data
  let getDesigData = async () => {
    try {
      let memData = await axios.get(committeeRole + '?isPagination=false', config);
      let data = memData.data.data;
      let createObject = [];
      data.map((key) => {
        createObject.push(
          new Object({
            id: key.id,
            noOfMember: key.noOfMember,
            roleName: key.roleName,
            roleRank: key.roleRank,
            status: false,
          }),
        );
      });

      setMemDegData(createObject);
    } catch (error) {
      errorHandler(error);
    }
  };

  const roleRankSet = (id) => {
    return memDegData.find((element) => element.id == id).roleRank;
  };
  const noOfMemberSet = (id) => {
    return memDegData.find((element) => element.id == id).noOfMember;
  };

  const getCommeteeData = async () => {
    try {
      let getData = await axios.get(committeeInfo + '/' + getId, config);
      let data = getData.data.data;
      setAllCommiteeData(data);
      setChecked(data?.committeeSignatoryPerson ? true : false);
      setCountNumber(data.noOfMember);
      // setAllCommiteeMem(data.committeeMembers);
      let copyMemberArr = [];
      let comitteeData = data.committeeMembers;
      comitteeData.map((kew) => {
        copyMemberArr.push(
          new Object({
            position: kew.memberId,
            role: kew.committeeRoleId,
            noOfMember: noOfMemberSet(kew.committeeRoleId),
            roleRank: roleRankSet(kew.committeeRoleId),
            status: kew.committeeRoleId ? true : false,
            personInfo: memName,
            selectedId: kew.memberId,
            memDegData: memDegData,
            selectedDesig: kew.committeeRoleId,
          }),
        );
      });
      setCountValue(copyMemberArr);

      data
        ? setDesignation({
            organizerp: data.committeeOrganizer,
            communicationP: data.committeeContactPerson,
            signingp: data.committeeSignatoryPerson,
          })
        : {
            organizerp: '',
            communicationP: '',
            signingp: '',
          };
    } catch (error) {
      // errorHandler(error)
    }
  };

  // drop down filter section

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'signingp':
        if (value != '0') {
          setDesignation({ ...designation, [name]: value });
          setFormErrors({ ...formErrors, [name]: '' });
        } else {
          setDesignation({ ...designation, [name]: '' });
          setFormErrors({
            ...formErrors,
            [name]: 'কেন্দ্রীয়/জাতীয় সমিতির পক্ষে স্বাক্ষরের ব্যক্তি নির্বাচন করুন',
          });
        }
        break;
      case 'communicationP':
        if (value != '0') {
          setDesignation({ ...designation, [name]: value });
          setFormErrors({ ...formErrors, [name]: '' });
        } else {
          setDesignation({ ...designation, [name]: '' });
          setFormErrors({
            ...formErrors,
            [name]: 'যোগাযোগের ব্যক্তি নির্বাচন করুন',
          });
        }
        break;
      case 'organizerp':
        if (value != '0') {
          setDesignation({ ...designation, [name]: value });
          setFormErrors({ ...formErrors, [name]: '' });
        } else {
          setDesignation({ ...designation, [name]: '' });
          setFormErrors({ ...formErrors, [name]: 'সংগঠক নির্বাচন করুন' });
        }
        break;
      // default:
      //   setDesignation({
      //     ...designation,
      //     [e.target.name]: e.target.value,
      //   });
      //   break;
    }
  };

  let filterArrayOfSelected = async (array, index, id) => {
    array = array.filter((elem, i) => {
      if (i == index) {
        return elem;
      } else {
        return elem.id != id;
      }
    });
    return array;
  };
  const countId = (id) => {
    let count = 0;
    countValue.forEach((e) => {
      if (e.role == id) {
        count++;
      }
    });
    return count;
  };
  const roleRankCheck = (index, roleId) => {
    const list = [...countValue];
    const roleData = memDegData.find((element) => element.id == roleId);
    const noOfMember = roleData.noOfMember;
    const isPresent = countValue.some((e) => {
      return e.role == roleData.id || e.roleRank == 1;
    });
    if (roleData.roleRank == 1) {
      // ************************************************
      if (isPresent) {
        const message = 'সভাপতি, চেয়ারম্যান, ম্যানেজার পদ একের বেশি দেওয়া যাবে না';
        NotificationManager.warning(message, '', 5000);
      } else {
        list[index]['role'] = roleId;
        list[index]['roleRank'] = roleData.roleRank;
        list[index]['status'] = true;
        setCountValue(list);
      }
      // ************************************************
    } else if (roleData.roleRank != 1) {
      if (countId(roleId) <= noOfMember === true) {
        list[index]['role'] = roleId;
        list[index]['roleRank'] = roleData.roleRank;
        list[index]['status'] = true;
        setCountValue(list);
      } else {
        const message = 'এই পদবীটি ' + engToBang(countId(roleId)) + ' বার এর বেশি ব্যবহৃত করা যাবে না';
        NotificationManager.warning(message, '', 5000);
      }
    }
  };

  const handleChangePosition = async (e, index) => {
    const { name, value } = e.target;
    const list = [...countValue];
    let selectedID;
    if (name == 'selectedId' && value != 'নির্বাচন করুন') {
      let hashedArray = [...hashArray];
      let present = false;
      let selectedIndex;
      hashedArray.map((elem, i) => {
        if (elem.index == index) {
          present = true;
          elem.id = parseInt(value);
          selectedID = parseInt(value);
          selectedIndex = i;
        }
      });
      if (!present) {
        hashedArray.push({
          index,
          id: parseInt(value),
        });
      } else {
        hashedArray = await filterArrayOfSelected(hashedArray, selectedIndex, selectedID);
      }
      // if(!prevID && hashedArray.lenth)
      setHashArray(hashedArray);
      let selectedIDArray = hashedArray.map((element) => element.id);
      let newlyRemainingIdArray;

      newlyRemainingIdArray = copyMemName.filter((element) => {
        if (selectedIDArray.indexOf(element.id) == -1) {
          return element;
        }
      });
      let selectedIndexArray = hashedArray.map((element) => element.index);
      // selectedIndexArray.map((indexElem, ind) => {
      list.map((obj, index) => {
        if (selectedIndexArray.indexOf(index) == -1) {
          obj['personInfo'] = newlyRemainingIdArray;
        }
      });
    }
    // if (name == "selectedDesig" && value != "নির্বাচন করুন") {
    //   let hashedArrayForDesig = [...hashArrayForDesignation];
    //   let present = false;
    //   let selectedIndex;
    //   hashedArrayForDesig.map((elem, i) => {
    //     if (elem.index == index) {
    //       present = true;
    //       elem.id = parseInt(value);
    //       selectedDesigID = parseInt(value);
    //       selectedIndex = i;
    //     }
    //   })
    //   if (!present) {
    //     hashedArrayForDesig.push({
    //       index,
    //       id: parseInt(value)
    //     })
    //   } else {
    //     hashedArrayForDesig = await filterArrayOfSelected(hashedArrayForDesig, selectedIndex, selectedDesigID)
    //   }
    //   // if(!prevID && hashedArray.lenth)
    //   setHashArrayForDesignation(hashedArrayForDesig)
    //   let selectedIDArray = hashedArrayForDesig.map(element => element.id);
    //   let newlyRemainingIdArray;

    //   newlyRemainingIdArray = copyMemDegData.filter((element) => {

    //     if (selectedIDArray.indexOf(element.id) == -1) {
    //       return element;
    //     }
    //   })
    //   let selectedIndexArray = hashedArrayForDesig.map(element => element.index);
    //   // selectedIndexArray.map((indexElem, ind) => {
    //   list.map((obj, index) => {
    //     if (selectedIndexArray.indexOf(index) == -1) {
    //       obj['memDegData'] = newlyRemainingIdArray
    //     }
    //   })
    // }
    switch (name) {
      case 'role':
        roleRankCheck(index, value);
        break;
      default:
        list[index][name] = value;
        setCountValue(list);
        break;
    }
  };

  const handlecommittePerson = (e) => {
    setCommitteePerson(e.target.value);
    creatingArrays(e.target.value);
  };

  let creatingArrays = (count) => {
    let arr = [];
    let countVal = count ? count : countNumber;
    setCountNewNumber(countVal);
    for (let index = 0; index < countVal; index++) {
      arr.push(
        new Object({
          position: '',
          role: '',
          roleRank: '',
          status: false,
          personInfo: memName,
          selectedId: '',
          memDegData: memDegData,
          selectedDesig: '',
        }),
      );
    }

    setCopyMemName(memName);
    // setCopyMemDegData(memDegData);
    setCountValue(arr);
  };

  let checkMandatory = () => {
    let flag2 = false;
    let errorObj = {
      communicationP: designation.communicationP,
      organizerp: designation.organizerp,
      signingp: checked ? designation.signingp : 'not accept',
    };
    for (const key in errorObj) {
      if (errorObj[key].length == 0) {
        flag2 = true;
        if (key == 'communicationP' || key == 'organizerp' || key == 'signingp') {
          setFormErrors({
            ...formErrors,
            communicationP: designation.communicationP == '' ? 'যোগাযোগের ব্যক্তি নির্বাচন করুন' : '',
            organizerp: designation.organizerp == '' ? 'সংগঠক নির্বাচন করুন' : '',
            signingp: designation.signingp == '' ? 'কেন্দ্রীয়/জাতীয় সমিতির পক্ষে স্বাক্ষরের ব্যক্তি নির্বাচন করুন' : '',
          });
        }
      }
    }
    return flag2;
  };

  let onSubmitData = async (e) => {
    e.preventDefault();
    if (checkMandatory() == false) {
      setLoadingDataSaveUpdate(true);
      // countValue
      const commeteePayload = new Array();
      for (let i = 0; i < committePerson; i++) {
        commeteePayload.push(
          new Object({
            memberId: countValue[i].selectedId,
            committeeRoleId: countValue[i].role,
          }),
        );
      }

      let payload = {
        samityId: getId,
        noOfMember: parseInt(committePerson),
        committeeOrganizer: designation.organizerp,
        committeeContactPerson: designation.communicationP,
        ...(designation.signingp ? { committeeSignatoryPerson: designation.signingp } : ''),
        isMemberOfCentalOrNational: checked,
        committeeMembers: commeteePayload,
      };

      try {
        const userData = await axios.post(committeeInfo, payload, config);
        NotificationManager.success(userData.data.message, '', 5000);

        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        steperFun(3);
        //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
        setLoadingDataSaveUpdate(false);
        router.push({ pathname: '/coop/samity-management/coop/member-expenditure' });
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      setLoadingDataSaveUpdate(false);
      NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুন', '', 5000);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();
    if (checkMandatory() == false) {
      setLoadingDataSaveUpdate(true);
      const commeteePayload = new Array();
      for (let i = 0; i < countNewNumber; i++) {
        commeteePayload.push(
          new Object({
            memberId: countValue[i].selectedId,
            committeeRoleId: countValue[i].role,
          }),
        );
      }

      let payload = {
        samityId: getId,
        noOfMember: parseInt(countNewNumber),
        committeeOrganizer: designation.organizerp,
        committeeContactPerson: designation.communicationP,
        ...(designation.signingp ? { committeeSignatoryPerson: designation.signingp } : ''),
        isMemberOfCentalOrNational: checked,
        committeeMembers: commeteePayload,
      };
      try {
        const userData = await axios.put(committeeInfo + '/' + allCommiteeData.id, payload, config);
        NotificationManager.success(userData.data.message, '', 5000);
        setLoadingDataSaveUpdate(false);
      } catch (error) {
        setLoadingDataSaveUpdate(false);
        errorHandler(error);
      }
    } else {
      setLoadingDataSaveUpdate(false);
      NotificationManager.warning('বাধ্যতামূলক তথ্য প্রদান করুন', '', 5000);
    }
  };

  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/member-registration' });
  };

  const onNextPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/member-expenditure' });
  };
  return (
    <>
      <Grid item xs={12}>
        <Grid container spacing={2.5} className="section">
          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              label={RequiredFile('সংগঠক')}
              name="organizerp"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={designation.organizerp || 0}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
              error={formErrors.organizerp ? true : false}
              helperText={formErrors.organizerp}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {memName
                ? memName.map((option, i) => (
                    <option key={i} value={option.id}>
                      {option.memberNameBangla}
                    </option>
                  ))
                : ''}
            </TextField>
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              label={RequiredFile('যোগাযোগের ব্যক্তি')}
              name="communicationP"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              value={designation.communicationP || 0}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
              error={formErrors.communicationP ? true : false}
              helperText={formErrors.communicationP}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {memName
                ? memName.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.memberNameBangla}
                    </option>
                  ))
                : ''}
            </TextField>
          </Grid>
          <Grid item lg={4} md={4} xs={12}>
            <FormControlLabel
              control={<Switch checked={checked} onChange={handleSwitch} inputProps={{ 'aria-label': 'controlled' }} />}
              label={'এই সমিতিটি কেন্দ্রীয়/জাতীয় সমিতির সদস্য ভুক্ত হবে?'}
              labelPlacement="start"
            />
          </Grid>
          {checked == true ? (
            <>
              <Grid item lg={4} md={4} xs={12}>
                <TextField
                  fullWidth
                  label={'কেন্দ্রীয়/জাতীয় সমিতির পক্ষে স্বাক্ষরের ব্যক্তি'}
                  name="signingp"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={designation.signingp || 0}
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: '#FFF' }}
                  error={formErrors.signingp ? true : false}
                  helperText={formErrors.signingp}
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  {memName
                    ? memName.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.memberNameBangla}
                        </option>
                      ))
                    : ''}
                </TextField>
              </Grid>
            </>
          ) : (
            ''
          )}
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <Box>
            <SubHeading>কমিটির পদ বরাদ্দকরন</SubHeading>
            <Grid container spacing={2.5}>
              <Grid item lg={4} md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('কমিটির সদস্য সংখ্যা')}
                  name=""
                  onChange={handlecommittePerson}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                >
                  {Committee.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={allCommiteeData.noOfMember == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item lg={12} md={12} xs={12} mb={2}>
                <TableContainer className="table-container">
                  <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table" className="table-designation">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell align="center">ক্রমিক নং</TableCell>
                        <TableCell>সদস্যের নাম</TableCell>
                        <TableCell>পদবী</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {countValue.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + (i + 1) + '')}</TableCell>

                          <TableCell>
                            <TextField
                              fullWidth
                              name="selectedId"
                              onChange={(e) => handleChangePosition(e, i)}
                              required
                              select
                              SelectProps={{ native: true }}
                              variant="outlined"
                              size="small"
                              value={row.selectedId}
                            >
                              <option>- নির্বাচন করুন -</option>
                              {row.personInfo
                                ? row.personInfo.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.memberNameBangla}
                                    </option>
                                  ))
                                : ''}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              name="role"
                              onChange={(e) => handleChangePosition(e, i)}
                              required
                              select
                              SelectProps={{ native: true }}
                              variant="outlined"
                              size="small"
                              value={row.role}
                            >
                              <option>- নির্বাচন করুন -</option>
                              {row.memDegData.length > 1 &&
                                row.memDegData.map((option) => (
                                  <option key={option.id} value={option.id} disabled={option.status}>
                                    {option.roleName} {option.status}
                                  </option>
                                ))}
                            </TextField>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            {' '}
            আগের পাতায়
          </Button>
        </Tooltip>
        {allCommiteeData != '' ? (
          <>
            <Tooltip title="হালনাগাদ করুন">
              {loadingDataSaveUpdate ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  sx={{ mr: 1 }}
                  startIcon={<SaveOutlinedIcon />}
                  variant="outlined"
                >
                  হালনাগাদ করা হচ্ছে...
                </LoadingButton>
              ) : (
                <Button className="btn btn-save" onClick={updateData} startIcon={<SaveOutlinedIcon />}>
                  {' '}
                  হালনাগাদ করুন
                </Button>
              )}
            </Tooltip>
            <Tooltip title="পরবর্তী পাতা">
              <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
                পরবর্তী পাতায়{' '}
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="সংরক্ষন করুন">
              {loadingDataSaveUpdate ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  sx={{ mr: 1 }}
                  startIcon={<SaveOutlinedIcon />}
                  variant="outlined"
                >
                  সংরক্ষন করা হচ্ছে...
                </LoadingButton>
              ) : (
                <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
                  {' '}
                  সংরক্ষন করুন
                </Button>
              )}
            </Tooltip>
            {stepId > 3 ? (
              <Tooltip title="পরবর্তী পাতা">
                <Button className="btn btn-primary" onClick={onNextPage} endIcon={<NavigateNextIcon />}>
                  পরবর্তী পাতায়{' '}
                </Button>
              </Tooltip>
            ) : (
              ''
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default Designation;
