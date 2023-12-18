
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  districtRoute,
  fieldOffRoute,
  loanProject,
  unionRoute,
  upazilaRoute
} from '../../../../url/ApiList';

const day = [
  {
    value: 'শনিবার',
    label: 'শনিবার',
  },
  {
    value: 'রবিবার',
    label: 'রবিবার',
  },
  {
    value: 'সোমবার',
    label: 'সোমবার',
  },
  {
    value: 'মঙ্গলবার',
    label: 'মঙ্গলবার',
  },
  {
    value: 'বুধবার',
    label: 'বুধবার',
  },
  {
    value: 'বৃহস্পতিবার',
    label: 'বৃহস্পতিবার',
  },
  {
    value: 'শুক্রবার',
    label: 'শুক্রবার',
  },
];

const SamityRegFromServey = () => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState({
    fromServey: '2',
    projectname: '',
    samityName: '',
    fasility: '',
    upazila: '',
    union: '',
    village: '',
    address: '',
    radioValue: '',
    meetingDay: '',
    memberMinAge: '',
    memberMaxAge: '',
    samityMinMember: '',
    samityMaxMember: '',
    memberAdmissionFee: '',
    groupMinMember: '',
    groupMaxMember: '',
  });

  const [allsamityNameFromSurvey] = useState([]);
  const [samityTypeValue] = useState();
  const [projects, setProjects] = useState([]);
  const [fieldOfficersList, setFieldOfficersList] = useState([]);
  const [divisionList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [unionList, setUnionList] = useState([]);
  const [division] = useState();
  const [district] = useState();
  const [upazila] = useState();

  const [districtId, setDistrictId] = useState();
  const [upazilaId, setUpazilaId] = useState();
  const [unionId, setUnionId] = useState();
  'samity Info', samityInfo;
  const handleChange = (e) => {
    setSamityInfo({
      ...samityInfo,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    getDistrict();
    getProject();
    getFieldOfficers();
    getUnion();
    getUpazila();
  }, []);

  let getDistrict = async () => {
    try {
      let districtList = await axios.get(districtRoute, config);
      if (districtList.data.data.length == 1) {
        setDistrictId(districtList.data.data[0].id);
        document.getElementById('district').setAttribute('disabled', 'true');
      }
      setDistrictList(districtList.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  let getUpazila = async () => {
    try {
      let upazilaList = await axios.get(upazilaRoute, config);
      if (upazilaList.data.data.length == 1) {
        setUpazilaId(upazilaList.data.data[0].id);
        document.getElementById('upazila').setAttribute('disabled', 'true');
      }
      setUpazilaList(upazilaList.data.data);
    } catch (error) {
      errorHandler(error)
    }
  };
  let getUnion = async () => {
    try {
      let unionList = await axios.get(unionRoute, config);
      if (unionList.data.data.length == 1) {
        setUnionId(unionList.data.data[0].id);
      }
      setUnionList(unionList.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);

      setProjects(projectData.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  let getFieldOfficers = async () => {
    try {
      let fieldOffList = await axios.get(fieldOffRoute, config);

      'FieldOfficerList=============', fieldOffList;
      if (fieldOffList.data.data) {
        setFieldOfficersList(fieldOffList.data.data);
      }
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
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
    let samityData;
    e.preventDefault();

    let payload = {
      resourceName: 'samity info from Servey',
      data: {
        basic: {
          address: samityInfo.address,
          unionId: 1,
          foCode: 1,
          projectId: 1,
          branchCode: 1,
          districtId: 1,
          upazilaId: 1,
          samityName: samityInfo.samityName,
          vilageName: samityInfo.village,
          workPlaceLat: 10.5455,
          workPlaceLong: 20.548,
          weeklyMeetingDay: samityInfo.meetingDay,
          // shareAmount:samityInfo.shareAmount,
          workAreaRadius: 50,
        },
        setup: {
          samityMemberType: samityInfo.radioValue,
          memberMinAge: samityInfo.memberMinAge,
          memberMaxAge: samityInfo.memberMaxAge,
          samityMinMember: samityInfo.samityMinMember,
          samityMaxMember: samityInfo.samityMaxMember,
          groupMinMember: samityInfo.groupMinMember,
          groupMaxMember: samityInfo.groupMaxMember,
          // shareAmount: samityInfo.shareAmount,
          admissionFee: samityInfo.memberAdmissionFee,
        },
        flag: 2,
      },
    }('Payload value', payload);
    try {
      ('Before post request');
      samityData = await axios.post('', payload, config);
      ('After post request');
      'success data', samityData;
      NotificationManager.success(samityData.data.message, 'Success', 5000);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        // let message = error.response.data.errors[0].message;
        // NotificationManager.error(message, "Error", 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };

  return (
    <>
      <Grid item md={12} xs={12} mx={2} my={2} px={1} pb={1} sx={{ backgroundColor: '#FAFAFA', borderRadius: '10px' }}>
        <Grid container spacing={1.6}>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="জেলা"
              name="district"
              id="district"
              select
              SelectProps={{ native: true }}
              value={districtId != null ? districtId : samityInfo.districtId}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {districtList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))}
            </TextField>
            {/* {formErrors.district.length > 0 && (
              <span style={{ color: "red" }}>{formErrors.district}</span>
            )} */}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="উপজেলা"
              name="upazilaId"
              id="upazila"
              required
              select
              SelectProps={{ native: true }}
              value={upazilaId != null ? upazilaId : samityInfo.upazilaId}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {upazilaList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.upazilaNameBangla}
                </option>
              ))}
            </TextField>
            {/* {formErrors.upazila.length > 0 && (
              <span style={{ color: "red" }}>{formErrors.upazila}</span>
            )} */}
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="ইউনিয়ন"
              name="unionId"
              id="union"
              required
              select
              SelectProps={{ native: true }}
              value={unionId != null ? unionId : samityInfo.unionId}
              onChange={handleChange}
              // disabled
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {unionList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.unionNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label="প্রকল্পের নাম"
              name="projectName"
              required
              select
              SelectProps={{ native: true }}
              // value={
              //   project != null ? project : samityInfo.projectName
              // }
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
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="samityTypeValue"
                name="samityTypeValue"
                required
                value={samityTypeValue}
                onChange={handleChange}

              // defaultChecked
              >
                <FormControlLabel value="1" control={<Radio />} label="বিদ্যমান" />
                <FormControlLabel value="2" control={<Radio />} label="নতুন" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সমিতির নাম"
              name="samityName"
              onChange={handleChange}
              required
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
              value={samityInfo.samityName}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {allsamityNameFromSurvey &&
                allsamityNameFromSurvey.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.samityName}
                  </option>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} xs={12} mx={2} my={2} px={1} pb={1} sx={{ backgroundColor: '#F9F9F9', borderRadius: '10px' }}>
        <Grid container spacing={1.6}>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="প্রকল্পের নাম"
              name="projectname"
              required
              select
              SelectProps={{ native: true }}
              value={samityInfo.projectname}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              {projects.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.projectName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সমিতির নাম"
              name="samityName"
              onChange={handleChange}
              number
              value={samityInfo.samityName}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="মাঠ কর্মী"
              name="fasility"
              required
              select
              SelectProps={{ native: true }}
              value={samityInfo.fasility}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
              onChange={handleChange}
            >
              <option>- নির্বাচন করুন -</option>
              {fieldOfficersList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nameBn}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="বিভাগ"
              name="division"
              required
              id="division"
              select
              SelectProps={{ native: true }}
              value={division}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              {divisionList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.divisionNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="জেলা"
              name="district"
              id="district"
              select
              SelectProps={{ native: true }}
              value={district}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              {districtList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.districtNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="উপজেলা"
              name="upazila"
              id="upazila"
              required
              select
              SelectProps={{ native: true }}
              value={upazila}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              {upazilaList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.upazilaNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="ইউনিয়ন"
              name="union"
              required
              select
              SelectProps={{ native: true }}
              value={unionId}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              {unionList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.unionNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="গ্রাম"
              name="village"
              onChange={handleChange}
              number
              value={samityInfo.village}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="ঠিকানা"
              name="address"
              onChange={handleChange}
              number
              value={samityInfo.address}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="gender"
                name="radioValue"
                required
                value={samityInfo.radioValue}
                onChange={handleChange}
              >
                <FormControlLabel value="M" control={<Radio />} label="পুরুষ" />
                <FormControlLabel value="F" control={<Radio />} label="মহিলা" />
                <FormControlLabel value="B" control={<Radio />} label="উভয়" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="মিটিং এর দিন"
              name="meetingDay"
              onChange={handleChange}
              required
              value={samityInfo.meetingDay}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              {day.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সদস্যের সর্বনিম্ন বয়স*"
              name="memberMinAge"
              onChange={handleChange}
              number
              value={samityInfo.memberMinAge}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সদস্যের সর্বোচ্চ বয়স*"
              name="memberMaxAge"
              onChange={handleChange}
              number
              value={samityInfo.memberMaxAge}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সমিতির সবনিম্ন সদস্য*"
              name="samityMinMember"
              onChange={handleChange}
              number
              value={samityInfo.samityMinMember}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সমিতির সর্বোচ্চ সদস্য*"
              name="samityMaxMember"
              onChange={handleChange}
              number
              value={samityInfo.samityMaxMember}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সদস্য ভর্তির ফি*"
              name="memberAdmissionFee"
              onChange={handleChange}
              number
              value={samityInfo.memberAdmissionFee}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="দলের সর্বনিম্ন সদস্য*"
              name="groupMinMember"
              onChange={handleChange}
              number
              value={samityInfo.groupMinMember}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="দলের সর্বোচ্চ সদস্য*"
              name="groupMaxMember"
              onChange={handleChange}
              number
              value={samityInfo.groupMaxMember}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} xs={12} mx={2} my={2} px={1} pb={1} sx={{ backgroundColor: '#F9F9F9', borderRadius: '10px' }}>
        <Grid container spacing={1}>
          <Grid item md={12} xs={12}>
            <Card sx={{ display: 'flex', height: '200px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h6">
                    গুগল ম্যাপে সমিতির অবস্থান নির্বাচন করুন-
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    <Stack direction="row" alignItems="center" spacing={2.5}></Stack>
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button variant="contained" className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {' '}
            সংরক্ষণ করুন
          </Button>
        </Tooltip>
        <Tooltip title="পরবর্তী পাতা">
          <Button variant="contained" className="btn btn-primary" endIcon={<SendIcon />}>
            পরবর্তী পাতায়
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default SamityRegFromServey;
