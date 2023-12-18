import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Button,
  Divider,
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
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from 'service/numberConverter';
import {
  loanProject,
  samityNameRoute,
  transactionOfMember,
  transactionSamityMemberRoute,
} from '../../../../../url/ApiList';
import star from '../../loan-application/utils';
// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

const Deposit = () => {
  const [projects, setProjects] = useState([]);
  const [depositInfo, setDepositInfo] = useState({
    projectName: '',
    samityName: '',
  });
  const [samityNameObj, setSamityNameObj] = useState({
    id: '',
    label: '',
  });
  const [allSamityName, setAllSamityName] = useState([]);
  const [memberFromSamity, setMemberFromSamity] = useState([]);
  const [formErrors] = useState({});
  const [projectId, setProjectId] = useState('');
  const [projectDisableStatus, setProjectDisableStatus] = useState(false);
  const [depositFieldDisableStatus, setDepositFieldDisableStatus] = useState(false);
  const config = localStorageData('config');
  const token = localStorageData('token');
  const getTokenData = tokenData(token);
  const doptorId = getTokenData?.doptorId;
  useEffect(() => {
    getProject();
  }, []);

  let getSamityInfo = async (projectId) => {
    if (projectId != 'নির্বাচন করুন') {
      try {
        let samityInfo = await axios.get(samityNameRoute + '?value=1' + '&project=' + projectId, config);
        let samityName = samityInfo.data.data;
        setAllSamityName(samityName);
      } catch (error) {
        errorHandler(error);
      }
    }
  };
  let getSamityMemberInfo = async (samityId) => {
    let samityMembers;
    let samityMemberInfo;
    if (samityId != 'নির্বাচন করুন') {
      try {
        if (projectId) {
          samityMemberInfo = await axios.get(
            transactionSamityMemberRoute + '?projectId=' + projectId + '&samityId=' + samityId,
            config,
          );
        } else {
          samityMemberInfo = await axios.get(
            transactionSamityMemberRoute + '?projectId=' + depositInfo.projectName + '&samityId=' + samityId,
            config,
          );
        }
        samityMembers = samityMemberInfo.data.data;
        if (doptorId == 10) {
          for (let object of samityMembers) {
            for (let products of object['productDetails']) {
              products['tranAmt'] = products['depositAmt'];
            }
          }
          setDepositFieldDisableStatus(true);
        }
        setMemberFromSamity(samityMembers);
      } catch (error) {
        // if (error.response) {
        //   ("Error Data", error.response);
        //   let message = error.response.data.errors[0].message;
        //   NotificationManager.error(message, "Error", 5000);
        // } else if (error.request) {
        //   NotificationManager.error("Error Connecting...", "Error", 5000);
        // } else if (error) {
        //   NotificationManager.error(error.toString(), "Error", 5000);
        // }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == 'projectName') {
      setMemberFromSamity([]);
      setDepositInfo({ ...depositInfo, samityName: '' });
      getSamityInfo(value);
    }
    if (name == 'samityName') {
      getSamityMemberInfo(value);
    }
    setDepositInfo({
      ...depositInfo,
      [e.target.name]: e.target.value,
    });
  };
  let handleDeposit = (indexOfProduct, e, indexOfMember) => {
    let array = [...memberFromSamity];
    const regex = /[০-৯.,0-9]$/;
    if (regex.test(e.target.value) || e.target.value == '') {
      array[indexOfMember]['productDetails'][indexOfProduct]['tranAmt'] = bangToEng(e.target.value);
    }

    setMemberFromSamity(array);

    //   let indexToGet=-1;
    //   ("Member",member);

    //   array.map((element, index) => {
    //     if ((member.serialNo == element.serialNo) && (indexOfInput==element.index)) {
    //       indexToGet=index;
    //     }
    //   });
    //   ("Index to get===",indexToGet);
    //   if (indexToGet !== -1) {
    //         array[indexToGet]={
    //           depositAmount:e.target.value,
    //           serialNo:member.serialNo,
    //           product:product.productName,
    //           index:indexOfInput
    //         }
    //         settranAmt(array);
    //   }
    // else {
    //   ("A");
    //   array.push(
    //     new Object({
    //       depositAmount:e.target.value,
    //       serialNo:member.serialNo,
    //       product:product.productName,
    //       index:indexOfInput
    //     })
    //   );
    //   settranAmt(array);
    // }
    //  ("Arrryayyyy=========",array);
  };
  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);
      let projectList = projectData.data.data;
      if (projectList.length === 1) {
        setProjectId(projectList[0].id);
        setProjectDisableStatus(true);
        getSamityInfo(projectList[0].id);
      }
      // if(projectArray.length==1){
      setProjects(projectData.data.data);
    } catch (error) {
      if (error.response) {
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  let onSubmitData = async (e) => {
    e.preventDefault();

    let payLoadArray = [];

    for (let element of memberFromSamity) {
      for (let arrayElement of element['productDetails']) {
        if (arrayElement['tranAmt'] && parseInt(arrayElement['tranAmt']) != 0) {
          payLoadArray.push(
            new Object({
              productId: arrayElement['productId'],
              accountId: arrayElement['accountId'],
              tranAmt: arrayElement['tranAmt'],
            }),
          );
        }
      }
    }
    let payload = {
      ...(projectId && { projectId: projectId }),
      ...(depositInfo.projectName &&
        depositInfo.projectName != 'নির্বাচন করুন' && {
        projectId: Number(depositInfo.projectName),
      }),
      productDetails: payLoadArray,
    };

    if (projectId || depositInfo.projectName != 'নির্বাচন করুন') {
      try {
        //Samity Id should be get from Samity Reg from Survey(Remaining Work)
        let transactionResp = await axios.post(transactionOfMember, payload, config);
        NotificationManager.success(transactionResp.data.message, '', 5000);
        let array = [...memberFromSamity];
        for (let object of array) {
          for (let products of object['productDetails']) {
            products['tranAmt'] = '';
          }
        }
        // array[indexOfMember]["productDetails"][indexOfProduct]["tranAmt"]="";
        setMemberFromSamity(array);
        setDepositInfo({
          projectName: 'নির্বাচন করুন',
          samityName: 'নির্বাচন করুন',
        });
        setSamityNameObj({
          id: '',
          label: '',
        });
        setMemberFromSamity([]);
        setProjectDisableStatus(false);
        getProject();
      } catch (error) {
        if (error.response) {
          let length = error.response.data.errors.length;
          let count = 1;
          for (let i = 0; i < length; i++) {
            let message = error?.response?.data?.errors[i]?.message;
            // let index=Number(error.response.data.errors[i].field.slice(11,12));

            if (count == 3) {
              break;
            }
            NotificationManager.error(message, '', 3000);
            count++;
          }
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', 'Error', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), 'Error', 5000);
        }
      }
    }
  };
  // let tableRowStyle = {
  //   border: '1px solid gray',
  // }
  // let tableCellStyle = {
  //   padding: '7px 14px',
  //   borderRadius: '4px',
  //   border: '1px solid gray',
  //   display: 'block',
  //   width: '100%',
  //   margin: '2px 0px',
  //   border: '0',
  // }
  // let tableCellStyle2 = {
  //   padding: '7px 14px',
  //   borderRadius: '4px',
  //   border: '1px solid gray',
  //   display: 'block',
  //   width: '100%',
  //   margin: '4px 0px',
  //   fontSize: '3px!important'
  // }
  // let styleSerial = {
  //   textAlign: 'center',
  //   padding: '7px 2px',

  // }
  //   let leftSideAlignment = {
  //     display: 'flex',
  // justifyContent: 'flex-end',
  // alignItems: 'center',
  // width:"20%",
  //   }
  //   let th = {
  //     color: "var--",
  //     fontWeight: "bold"
  //   }
  //   let trflex = {
  //     display: "flex",
  //     width: "100%",
  //     justifyContent: 'space-between',
  //   }
  return (
    <>
      <Grid container spacing={2.5} className="section">
        <Grid item md={6} xs={12}>
          <TextField
            id="projectName"
            fullWidth
            // label="প্রকল্পের নাম"
            label={star('প্রকল্পের নাম')}
            name="projectName"
            // required
            select
            SelectProps={{ native: true }}
            value={projectId ? projectId : depositInfo.projectName ? depositInfo.projectName : ' '}
            disabled={projectDisableStatus}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ bgcolor: '#FFF' }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projects.map((option) => (
              <option key={option.id} value={option.id}>
                {option.projectNameBangla}
              </option>
            ))}
          </TextField>
          {!depositInfo.projectName && <span style={{ color: 'red' }}>{formErrors.projectName}</span>}
        </Grid>
        <Grid item md={6} xs={12}>
          {/* <TextField
            fullWidth
            label={star("সমিতির নাম")}
            name="samityName"
            onChange={handleChange}
            // required
            select
            SelectProps={{ native: true }}
            variant="outlined"
            size="small"
            style={{ backgroundColor: "#FFF" }}
            value={depositInfo.samityName ? depositInfo.samityName : " "}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {allSamityName.map((option) => (
              <option key={option.id} value={option.id}>
                {option.samityName}
              </option>
            ))}
          </TextField> */}
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
                setMemberFromSamity('');
              } else {
                value &&
                  setSamityNameObj({
                    id: value.id,
                    label: value.label,
                  });
                getSamityMemberInfo(value.id);
                setDepositInfo({
                  ...depositInfo,
                  samityName: value.id,
                });
              }
              // ("VVVVVV",value);
            }}
            options={allSamityName
              .map((option) => ({
                id: option.id,
                label: option.samityName,
              }))
              .filter((e) => e.id != null && e.employeeId !== null)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={samityNameObj.id === '' ? star(' সমিতির নাম নির্বাচন করুন') : star(' সমিতির নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={samityNameObj}
          />
          {!depositInfo.samityName && <span style={{ color: 'red' }}>{formErrors.samityName}</span>}
        </Grid>
      </Grid>
      <Grid container className="section">
        <TableContainer className="table-container deposit-table">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>সদস্য কোড</TableCell>
                <TableCell>সদস্যের নাম</TableCell>
                <TableCell width="60%">
                  <TableRow
                    className="cust-row"
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <TableCell sx={{ border: '0', width: '50%' }}>প্রোডাক্টের নাম</TableCell>
                    <TableCell sx={{ border: '0', textAlign: 'right', width: '120px' }}>আদায়যোগ্য (টাকা)</TableCell>
                    <TableCell sx={{ border: '0', textAlign: 'right', width: '120px' }}>জমা (টাকা)</TableCell>
                  </TableRow>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberFromSamity &&
                memberFromSamity.map((member, indexOfMember) => (
                  <TableRow key={member.customerId}>
                    <TableCell>{engToBang(member.memberCode)}</TableCell>
                    <TableCell>{member.memberName}</TableCell>
                    <tableCell width="60%">
                      {member.productDetails.map((product, indexOfProduct) => (
                        <>
                          <TableRow
                            className="cust-row cust-row-data"
                            sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <TableCell key={indexOfProduct} sx={{ width: '50%' }}>
                              <Tooltip title={<div className="tooltip-title">{product.productName}</div>} arrow>
                                <div className="data">{product.productName}</div>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                border: '0',
                                textAlign: 'right',
                                width: '120px',
                              }}
                              key={indexOfProduct}
                            >
                              <Tooltip
                                title={<div className="tooltip-title">{engToBang(product.depositAmt)}</div>}
                                arrow
                              >
                                <span className="data">{engToBang(product.depositAmt.split(',').pop())}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                border: '0',
                                textAlign: 'right',
                                width: '120px',
                              }}
                              key={indexOfProduct}
                            >
                              <TextField
                                className="table-input"
                                name="tranAmt"
                                required
                                type="text"
                                disabled={depositFieldDisableStatus}
                                number
                                textAlign="right"
                                value={engToBang(product.tranAmt)}
                                variant="outlined"
                                size="small"
                                onChange={(e) => handleDeposit(indexOfProduct, e, indexOfMember)}
                                sx={{ padding: '2px', minWidth: '100%' }}
                              ></TextField>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </tableCell>
                    <Divider />
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {' '}
            সংরক্ষণ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default Deposit;
