import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
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
import {
  districtRoute,
  divisionRoute,
  fieldOffRoute,
  loanProject,
  loanSamityReg,
  tokenForLoan,
  unionRoute,
  upazilaRoute,
} from '../../../../url/ApiList';

// const Input = styled('input')({
//   display: 'none',
// });

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

const SamityRegFromNormal = () => {
  const config = {
    headers: {
      Authorization: `Bearer ${tokenForLoan}`,
    },
  };
  const [samityInfoFromNormal, setSamityInfoFromNormal] = useState({
    fromServey: '3',
    projectName: '',
    samityName: '',
    foCode: '',
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
    division: '',
    district: '',
    upazila: '',
    union: '',
  });
  const [projects, setProjects] = useState([]);
  const [fieldOfficersList, setFieldOfficersList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [unionList, setUnionList] = useState([]);
  const [division, setDivision] = useState(null);
  const [district, setDistrict] = useState(null);
  const [upazila, setUpazila] = useState(null);
  const [union, setUnion] = useState(null);
  const handleChange = (e) => {
    setSamityInfoFromNormal({
      ...samityInfoFromNormal,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    getDivision();
    getDistrict();
    getProject();
    getFieldOfficers();
    getUnion();
    getUpazila();
  }, []);
  let getDivision = async () => {
    try {
      let divisionList = await axios.get(divisionRoute, config);
      if (divisionList.data.data.length == 1) {
        setDivision(divisionList.data.data[0].id);
        document.getElementById('division').setAttribute('disabled', 'true');
      }
      setDivisionList(divisionList.data.data);
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
  let getDistrict = async () => {
    try {
      let districtList = await axios.get(districtRoute, config);
      if (districtList.data.data.length == 1) {
        setDistrict(districtList.data.data[0].id);
        document.getElementById('district').setAttribute('disabled', 'true');
      }
      setDistrictList(districtList.data.data);
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
  let getUpazila = async () => {
    try {
      let upazilaList = await axios.get(upazilaRoute, config);
      if (upazilaList.data.data.length == 1) {
        setUpazila(upazilaList.data.data[0].id);
        document.getElementById('upazila').setAttribute('disabled', 'true');
      }
      setUpazilaList(upazilaList.data.data);
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
  let getUnion = async () => {
    try {
      let unionList = await axios.get(unionRoute, config);
      if (unionList.data.data.length == 1) {
        setUnion(unionList.data.data[0].id);
      }
      setUnionList(unionList.data.data);
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
  let getProject = async () => {
    try {
      let projectData = await axios.get(loanProject, config);
      'Project Data===================', projectData;
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
      resourceName: 'samity info',
      data: {
        basic: {
          projectId: samityInfoFromNormal.projectName,
          samityName: samityInfoFromNormal.samityName,
          districtId: districtList.length > 1 ? samityInfoFromNormal.district : district,
          upazilaId: upazilaList.length > 1 ? samityInfoFromNormal.upazila : upazila,
          unionId: unionList.length > 1 ? samityInfoFromNormal.union : union,
          vilageName: samityInfoFromNormal.village,
          address: samityInfoFromNormal.address,
          weeklyMeetingDay: samityInfoFromNormal.meetingDay,
          foCode: samityInfoFromNormal.foCode,
          workPlaceLat: 10.5455,
          workPlaceLong: 20.548,
          workAreaRadius: 50,
        },
        setup: {
          memberMinAge: samityInfoFromNormal.memberMinAge,
          memberMaxAge: samityInfoFromNormal.memberMaxAge,
          samityMinMember: samityInfoFromNormal.samityMinMember,
          samityMaxMember: samityInfoFromNormal.samityMaxMember,
          groupMinMember: samityInfoFromNormal.groupMinMember,
          groupMaxMember: samityInfoFromNormal.groupMaxMember,
          shareAmount: 140,
          admissionFee: samityInfoFromNormal.memberAdmissionFee,
          samityMemberType: samityInfoFromNormal.radioValue,
        },
        flag: 1,
      },
    };

    try {
      samityData = await axios.post(loanSamityReg, payload, config);
      NotificationManager.success(samityData.data.message, 'Success', 5000);

      setSamityInfoFromNormal({
        fromServey: '',
        projectName: '',
        samityName: '',
        foCode: '',
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
        division: '',
        district: '',
        upazila: '',
        union: '',
      });
    } catch (error) {
      'Error Data', error.response;
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

  'SamityInfo===============', samityInfoFromNormal;

  return (
    <>
      <Grid item md={12} xs={12} mx={2} my={2} px={1} pb={1} sx={{ backgroundColor: '#F9F9F9', borderRadius: '10px' }}>
        <Grid container spacing={1.6}>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="প্রকল্পের নাম"
              name="projectName"
              required
              select
              SelectProps={{ native: true }}
              value={samityInfoFromNormal.projectName}
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
              value={samityInfoFromNormal.samityName}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="মাঠ কর্মী"
              name="foCode"
              required
              select
              SelectProps={{ native: true }}
              value={samityInfoFromNormal.foCode}
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
              value={division != null ? division : samityInfoFromNormal.division}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
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
              value={district != null ? district : samityInfoFromNormal.district}
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
              value={upazila != null ? upazila : samityInfoFromNormal.upazila}
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
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="ইউনিয়ন"
              name="union"
              required
              select
              SelectProps={{ native: true }}
              value={union != null ? union : samityInfoFromNormal.union}
              onChange={handleChange}
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
              fullWidth
              label="গ্রাম"
              name="village"
              onChange={handleChange}
              number
              value={samityInfoFromNormal.village}
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
              value={samityInfoFromNormal.address}
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
                value={samityInfoFromNormal.radioValue}
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
              value={samityInfoFromNormal.meetingDay}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
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
              value={samityInfoFromNormal.memberMinAge}
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
              value={samityInfoFromNormal.memberMaxAge}
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
              value={samityInfoFromNormal.samityMinMember}
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
              value={samityInfoFromNormal.samityMaxMember}
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
              value={samityInfoFromNormal.memberAdmissionFee}
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
              value={samityInfoFromNormal.groupMinMember}
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
              value={samityInfoFromNormal.groupMaxMember}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} xs={12} mx={2} my={2} px={1} pb={1} sx={{ backgroundColor: '#F9F9F9', borderRadius: '10px' }}>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
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
      <Grid container>
        <Grid item xs={12} md={12} sm={12} mx={2} my={2} sx={{ textAlign: 'center' }}>
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
        </Grid>
      </Grid>
    </>
  );
};

export default SamityRegFromNormal;
