import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import { localStorageData } from 'service/common';
import { getDolMember, loanProject, meetingInfo, memberAttendance, samityNameRoute } from '../../../../url/ApiList';
import SubHeading from '../../../shared/others/SubHeading';
import fileCheck from '../../loan-management/loan-application/sanction/FileUploadTypeCheck';
import star from '../../loan-management/loan-application/utils';
import { engToBang } from '../../samity-managment/member-registration/validator';
// import { documentChecking } from 'components/mainSections/loan-management/loan-application/sanction/validator';

const DynamicDocSectionHeader = dynamic(() => import('./DocSectionHeader'), { loading: () => <p>Loading...</p> });
const DynamicDocSectionContent = dynamic(() => import('./DocSectionContent'), { loading: () => <p>Loading...</p> });

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Attendance = () => {
  const token = localStorageData('token');
  const config = localStorageData('config');
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  //whole state info of Attandance Component
  const [attendanceInfo, setAttendanceInfo] = useState({
    projectId: '',
    samityId: '',
    meetingType: '',
  });

  //for auto-select upon single project a diiferent state is declared
  const [project] = useState(null);
  //projects-info for dropdown upon api calling in useEffect
  const [projects, setProjects] = useState([]);
  //samity-info for dropdown upon api calling in useEffect
  const [samityInfo, setSamityInfo] = useState([]);
  //samity-info for table population
  const [samityMemberInfo, setSamityMemberInfo] = useState([]);
  const [formErrors] = useState([]);
  // const [selectedMemberArray, setSelectedMemberArray] = useState([]);
  const [meetingTypeArray, setMeetingTypeArray] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [disableProject, setDisableProject] = useState(false);
  const [meetingDate, setMeetingDate] = useState(null);
  const [documentList, setDocumentList] = useState([
    {
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',
    },
  ]);

  const [samityNameObj, setSamityNameObj] = useState({
    id: '',
    label: '',
  });

  const fileSelectedHandler = (event, index) => {
    const { name } = event.target;
    let list = [...documentList];
    list[index][name] = '';
    list[index][name + 'Name'] = '';
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);

        // setProfileImage(base64Image);
        // setProfileImageType(file.type);
        if (typeStatus.showAble && base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = event.target.files[0];
          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not showable') {
          // list[index][name] = base64Image;
          //setDocumentList(list);
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = event.target.files[0];
          setDocumentList(list);
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not supported') {
          list[index][name + 'Name'] = 'Invalid File Type';
          setDocumentList(list);
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'File Type is not Supported';
          setDocumentList(list);
        }

        //("ImageData", this.state.profileImage)
        // this.props.handleState("NidFront", base64Image);

        // this.props.handleState("NidFrontType", file.type);
      };
      reader.onerror = () => {
        // ("there are some problems");
        NotificationManager.error('File can not be read', 'Error', 5000);
      };
    }
  };
  const handleDateChangeEx = (e) => {
    setMeetingDate(e);
  };
  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    // const formErr=formErrorsInDocuments.filter((g,i)=>index!=i);

    setDocumentList(arr);
    // setFormErrorsInDocuments(formErr)
  };
  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        documentPictureFront: '',
        documentPictureFrontName: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
      },
    ]);
  };
  useEffect(() => {
    getProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'projectId':
        if (value == 'নির্বাচন করুন') {
          formErrors.projectId = 'প্রোজেক্ট নির্বাচনকরুন';
        } else {
          formErrors.projectId = '';
        }
        samityDocument(value);
        getMeetingType(value);
        break;
      case 'samityId':
        if (value == 'নির্বাচন করুন') {
          formErrors.projectId = 'প্রোজেক্ট নির্বাচনকরুন';
        } else {
          formErrors.projectId = '';
        }
        getMemberDetails(value);
        break;
    }
    setAttendanceInfo({
      ...attendanceInfo,
      [name]: value,
    });
  };
  let onSubmitData = async () => {
    let newAttandaceArray = [...samityMemberInfo];
    let fileArray = [...documentList];
    newAttandaceArray = newAttandaceArray.map((element) => {
      return {
        id: element.id,
        nameBn: element.nameBn,
        isChecked: element.isChecked,
      };
    });
    fileArray = fileArray.map((element) => {
      return element.documentPictureFrontFile;
    });
    let formData = new FormData();
    formData.append('projectId', attendanceInfo.projectId);
    formData.append('samityId', samityNameObj?.id ? Number(samityNameObj.id) : '');
    formData.append('meetingTypeId', attendanceInfo.meetingType);
    formData.append('meetingAgenda', meetingAgenda);
    formData.append('meetingNotes', meetingNotes);
    formData.append('attendance', JSON.stringify(newAttandaceArray));
    formData.append('meetingDate', meetingDate);
    for (let f of fileArray) formData.append('attachment', f);
    try {
      let attadenceInfo = await axios({
        method: 'POST',
        url: memberAttendance,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      NotificationManager.success(attadenceInfo.data.message, '', 5000);
      setAttendanceInfo({
        meetingType: 'নির্বাচন করুন',
        projectId: 'নির্বাচন করুন',
        samityId: 'নির্বাচন করুন',
      });
      setMeetingAgenda('');
      setMeetingDate(null);
      setMeetingNotes('');
      setIsCheckAll(false);
      setDocumentList([
        {
          documentPictureFront: '',
          documentPictureFrontName: '',
          documentPictureFrontType: '',
          documentPictureFrontFile: '',
        },
      ]);
      setSamityNameObj({
        id: '',
        label: '',
      });
      setSamityMemberInfo([]);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const removeDocumentImage = (e, index) => {
    const list = [...documentList];
    list[index]['documentPictureFront'] = '';
    list[index]['documentPictureFrontType'] = '';
    setDocumentList(list);
  };
  let samityDocument = async (value) => {
    let samityInfo;
    try {
      samityInfo = await axios.get(samityNameRoute + '?project=' + value + '&value=1', config);
      let samityName = samityInfo.data.data;
      setSamityInfo(samityName);
    } catch (error) {
      //
    }
  };
  let getMeetingType = async (value) => {
    let meetingInformation;
    try {
      meetingInformation = await axios.get(meetingInfo + '?projectId=' + value, config);
      let meetingInformationArray = meetingInformation.data.data;
      setMeetingTypeArray(meetingInformationArray);
    } catch (error) {
      //
    }
  };
  // {{url}}/samity/memberBySamity?samityId=405&flag=1
  let getMemberDetails = async (value) => {
    let memberInfo;
    try {
      memberInfo = await axios.get(getDolMember + '?samityId=' + value + '&flag=1&defaultMembers=1', config);

      let memberName = memberInfo.data.data;
      memberName.map((item) => (item.isChecked = false));
      setSamityMemberInfo(memberName);
    } catch (error) {
      //
    }
  };
  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setDocumentList([...changeAddDoc]);
  };
  const handleDocumentList = (e, index) => {
    // let result;
    const { name, value } = e.target;
    const list = [...documentList];
    // result = documentChecking(index, name, value, documentList[index], formErrorsInDocuments);

    // if (result && !result.status) {
    //   formErrorsInDocuments[index][result.key] = result.message;
    // } else if (result && result.status) {
    //   formErrorsInDocuments[index][result.key] = result.message;
    // }
    list[index][name] = value;
    setDocumentList(list);
  };
  const handleSelectAll = (e) => {
    let samityMemberArray = [...samityMemberInfo];
    samityMemberArray.map((item) => (item.isChecked = e.target.checked));
    setSamityMemberInfo(samityMemberArray);
    // if (e.target.checked) {
    //   setSelectedMemberArray(samityMemberArray);
    // } else {
    //   setSelectedMemberArray([]);
    // }
    setIsCheckAll(e.target.checked);
  };
  const handleCheck = (member, e, index) => {
    let samityMemberArray = [...samityMemberInfo];
    samityMemberArray[index]['isChecked'] = e.target.checked;
    setSamityMemberInfo(samityMemberArray);
    // if(e.target.checked){
    //   setSelectedMemberArray([...selectedMemberArray,member]);
    // }
    // else{
    //      let newCheckedArray=[...selectedMemberArray];
    //      newCheckedArray=newCheckedArray.filter(element=>element.id!=member.id);
    //         setSelectedMemberArray(newCheckedArray);
    // }
  };
  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);
      if (projectData.data.data.length == 1) {
        setAttendanceInfo({
          ...attendanceInfo,
          projectId: projectData.data.data[0].id,
        });
        // document.getElementById("projectName").setAttribute("disabled", "true");
        setDisableProject(true);

        samityDocument(projectData.data.data[0].id);
        getMeetingType(projectData.data.data[0].id);
      }
      setProjects(projectData.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  // let handleSelectEditor = (e) => {
  //   setMeetingAgenda(e);
  // };
  // let handleSelectEditor2 = (e) => {
  //   setMeetingNotes(e);
  // };

  return (
    <>
      <Grid container className="section" spacing={2}>
        <Grid item md={6} xs={12}>
          <TextField
            id="projectId"
            fullWidth
            label={star('প্রকল্পের নাম')}
            name="projectId"
            disabled={disableProject}
            select
            SelectProps={{ native: true }}
            value={project != null ? project : attendanceInfo.projectId ? attendanceInfo.projectId : ' '}
            onChange={handleChange}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projects.map((option) => (
              <option key={option.id} value={option.id}>
                {option.projectNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          {/* <TextField
            name="samityId"
            fullWidth
            onChange={handleChange}
            label={star("সমিতির নাম")}
            select
            SelectProps={{ native: true }}
            variant="outlined"
            size="small"
            value={attendanceInfo.samityId ? attendanceInfo.samityId : " "}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {samityInfo && samityInfo.map((option) => (
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
              } else {
                value &&
                  setSamityNameObj({
                    id: value.id,
                    label: value.label,
                  });
                getMemberDetails(value.id);
              }
              // ("VVVVVV",value);
            }}
            options={samityInfo
              .map((option) => ({ id: option.id, label: option.samityName }))
              .filter((e) => e.id != null && e.employeeId !== null)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={samityNameObj.id === '' ? star('সমিতির নাম নির্বাচন করুন') : star('সমিতির নাম')}
                variant="outlined"
                size="small"
              />
            )}
            value={samityNameObj}
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <TextField
            id="projectId"
            fullWidth
            label={star('সভার ধরণ')}
            name="meetingType"
            // required
            select
            SelectProps={{ native: true }}
            value={attendanceInfo.meetingType ? attendanceInfo.meetingType : ' '}
            onChange={handleChange}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {meetingTypeArray.map((option) => (
              <option key={option.id} value={option.id}>
                {option.typeName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={star('সভার তারিখ')}
              name="meetingDate"
              inputFormat="dd/MM/yyyy"
              value={meetingDate}
              onChange={handleDateChangeEx}
              renderInput={(params) => <TextField {...params} size="small" fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container spacing={2} className="section">
        <Grid item md={6} sm={12} xs={12}>
          <SubHeading>সভার আলোচ্যসূচি</SubHeading>
          <ReactQuill style={{ width: '100%' }} theme="snow" value={meetingAgenda} onChange={setMeetingAgenda} />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <SubHeading>সভার মন্তব্য</SubHeading>
          <ReactQuill style={{}} theme="snow" value={meetingNotes} onChange={setMeetingNotes} />
        </Grid>
      </Grid>

      {samityMemberInfo.length > 0 && (
        <>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">ক্রমিক নং</TableCell>
                  <TableCell>মেম্বার নাম</TableCell>
                  <TableCell align="center">
                    উপস্থিতি
                    <Checkbox
                      type="checkbox"
                      name="selectAll"
                      id="selectAll"
                      onChange={handleSelectAll}
                      checked={isCheckAll}
                      color="success"
                    />
                  </TableCell>
                  <TableCell>মোবাইল নম্বর</TableCell>
                  <TableCell>পিতার নাম</TableCell>
                  <TableCell>মেম্বার কোড</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {samityMemberInfo && samityMemberInfo.length > 0
                  ? samityMemberInfo.map((member, index) => (
                      <TableRow key={member.id}>
                        <TableCell align="center">{engToBang(index + 1)}</TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member.nameBn}</div>} arrow>
                            <span className="data">{member.nameBn}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            style={{ paddingLeft: '3.7rem' }}
                            onChange={(e) => {
                              handleCheck(member, e, index);
                            }}
                            checked={member.isChecked}
                          />
                        </TableCell>
                        <TableCell>{engToBang(member.mobile)}</TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member.fatherName}</div>} arrow>
                            <span className="data">{member.fatherName}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{engToBang(member.customerCode)}</TableCell>
                      </TableRow>
                    ))
                  : ' '}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Grid container className="section" sx={{ marginTop: '2rem' }}>
        <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
        <DynamicDocSectionContent
          documentList={documentList}
          handleDocumentList={handleDocumentList}
          addMoreDoc={addMoreDoc}
          fileSelectedHandler={fileSelectedHandler}
          deleteDocumentList={deleteDocumentList}
          removeDocumentImage={removeDocumentImage}
        />
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

export default Attendance;
