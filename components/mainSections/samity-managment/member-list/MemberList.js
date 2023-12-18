import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { getDolMember, loanProject, samityNameRoute } from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';



const MemberList = () => {
  const router = useRouter();
  const config = localStorageData('config');

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const [projectId, setProjectId] = useState(null);

  const [projectName, setProjectName] = useState([]);

  const [samityId, setSamityId] = useState(null);

  const [samityName, setSamityName] = useState([]);

  const [member, setMember] = useState([]);


  useEffect(() => {
    getProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (event, newPage) => {
    'new page is', newPage;
    setPage(newPage);
  };

  const handleInputChangeProjectName = (e) => {
    const { value } = e.target;
    setProjectId(value);
    getSamity(value);
    getMember();
  };
  const handleChangeSamity = (e) => {
    const { value } = e.target;
    setSamityId(value);
    getMember(value);
  };
  // const handleDesk = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedDesk(value);
  // };
  // const handleCheckAccepted = (id, e) => {
  //   let data = allProject;
  //   const item = data.find((d) => d.id === id);
  //   const selectedArray = [...selectedData];
  //   let filteredArray;
  //   if (item.isChecked) {
  //     item.isChecked = false;
  //     filteredArray = selectedArray.filter((d) => d.id != id);
  //     setSelectedData(filteredArray);
  //   } else {
  //     item.isChecked = true;
  //     selectedArray.push(item);
  //     setSelectedData(selectedArray);
  //   }
  //   setAllProject(data);
  //   ("Item after chekcing", item);
  // };

  // let checkMandatory = () => {
  //   let result = true;
  //   const formErrors = { ...formErrors };
  //   if (selectUser == "" || selectUser == "নির্বাচন করুন") {
  //     result = false;
  //     formErrors.selectUser = "ব্যবহারকারী নির্বাচন করুন";
  //   }
  //   if (selectedDesk == "" || selectedDesk == "নির্বাচন করুন") {
  //     ("AAAAA");
  //     result = false;
  //     formErrors.selectedDesk = "অনুমোদনকারী নির্বাচন করুন";
  //   }
  //   setFormErrors(formErrors);
  //   return result;
  // };
  // ("Form Erros---", formErrors);
  // const onSubmitData = async () => {
  //   let result = checkMandatory();
  //   let payload;

  //   const idArray = [...selectedData];
  //   idArray = idArray.map((item) => item.id);

  //   ("ID ARRAY-----------", idArray);
  //   payload = {
  //     projectId: null,
  //     samityId: null,
  //     data: {
  //       userId: selectUser ? parseInt(selectUser) : "",
  //       projectId: idArray ? idArray : "",
  //     },
  //     nextAppDesignationId: selectedDesk ? parseInt(selectedDesk) : "",
  //   };
  //   ("Payload Value is", payload);
  //   if (result) {
  //     try {
  //       const assignProject = await axios.post(
  //         projectAssignPostRoute,
  //         payload,
  //         config
  //       );
  //       NotificationManager.success(
  //         assignProject.data.message,
  //         "",
  //         5000
  //       );
  //       setSelectedData("");
  //       setSelectUser("নির্বাচন করুন");
  //       setSelectedDesk("নির্বাচন করুন");
  //       getProject();
  //     } catch (error) {
  //       ("error found", error.message);
  //       if (error.response) {
  //         ("error found", error.response.data);
  //         let message = error.response.data.errors[0].message;
  //         NotificationManager.error(message, "", 5000);
  //       } else if (error.request) {
  //         NotificationManager.error("Error Connecting...", "", 5000);
  //       } else if (error) {
  //         NotificationManager.error(error.toString(), "", 5000);
  //       }
  //     }
  //   }
  // };

  const onEditPage = (id) => {
    let base64Data = JSON.stringify({
      id,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/samity-management/edit-member-registration',
      query: {
        data: base64Data,
      },
    });
  };

  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      if (projectList.length == 1) {
        setProjectId(projectList[0].id);
        document.getElementById('projectId')?.setAttribute('disabled', 'true');
        getSamity(projectList[0].id);
        getMember();
      }
      setProjectName(projectList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const getSamity = async (projectId) => {
    try {
      const samityData = await axios.get(samityNameRoute + '?value=1' + '&project=' + projectId + '&coop=0', config);
      let samityList = samityData.data.data;
      if (samityList.length == 1) {
        setSamityId(samityList[0].id);
        document.getElementById('samityName')?.setAttribute('disabled', 'true');
        getMember(samityList[0].id);
      }
      setSamityName(samityList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  const getMember = async (samityId) => {
    if (samityId != undefined) {
      try {
        const memberData = await axios.get(getDolMember + '?samityId=' + samityId + '&flag=1&defaultMembers=1', config);
        let memberList = memberData.data.data;
        setMember(memberList);
      } catch (error) {
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, 'Error', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', 'Error', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), 'Error', 5000);
        }
      }
    } else {
      setMember([]);
    }
  };

  return (
    <>
      <Grid container className="section" spacing={2.5}>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="projectName"
            label={star('প্রকল্পের নাম')}
            name="serviceId"
            onChange={handleInputChangeProjectName}
            select
            SelectProps={{ native: true }}
            value={projectId ? projectId : ' '}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projectName
              ? projectName.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.projectNameBangla}
                </option>
              ))
              : ' '}
          </TextField>
          {/* {!selectUser && (
            <span style={{ color: "red" }}>{formErrors.selectUser}</span>
          )} */}
        </Grid>
        <Grid item md={4} xs={12}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="samityTypeValue"
              name="samityTypeValue"

            //value={samityTypeValue}
            // onChange={handleChange}

            // defaultChecked
            >
              <FormControlLabel value="1" control={<Radio checked />} label="বিদ্যমান" />
              <FormControlLabel value="2" disabled control={<Radio />} label="নতুন" />
            </RadioGroup>
          </FormControl>
          {/* {!samityTypeValue && (
            <span style={{ color: "red" }}>
              {newObj.samityTypeValue}
            </span>
          )} */}
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="samityName"
            label={star('সমিতির তালিকা')}
            // name="serviceId"
            onChange={handleChangeSamity}
            select
            SelectProps={{ native: true }}
            value={samityId ? samityId : ' '}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {samityName
              ? samityName.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.samityName}
                </option>
              ))
              : ' '}
          </TextField>
          {/* {!selectedDesk && (
            <span style={{ color: "red" }}>{formErrors.selectedDesk}</span>
          )} */}
        </Grid>
      </Grid>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <Box>
            <SubHeading>সদস্যের তথ্য</SubHeading>
            <TableContainer className="table-container">
              <Table aria-label="customized table" size="small">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>সদস্যের নাম</TableCell>
                    <TableCell>মোবাইল নম্বর</TableCell>
                    <TableCell>পিতার নাম</TableCell>
                    <TableCell>মাতার নাম</TableCell>
                    <TableCell align="center" sx={{ width: '5%' }}>
                      সংশোধন
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {member
                    ? member.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell scope="row">{item.nameBn}</TableCell>
                        <TableCell scope="row">{item.mobile}</TableCell>
                        <TableCell scope="row">{item.fatherName}</TableCell>
                        <TableCell scope="row">{item.motherName}</TableCell>
                        <TableCell scope="row">
                          <Button variant="contained" className="button-edit" onClick={() => onEditPage(item.id)}>
                            <EditIcon className="icon" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                    : ' '}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={member.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
              />
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default MemberList;
