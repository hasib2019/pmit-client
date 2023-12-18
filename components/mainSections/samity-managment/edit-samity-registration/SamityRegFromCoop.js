

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Card, CardContent, Divider, Grid, Stack, TextField, Tooltip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import {
  districtRoute,
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

const SamityRegFromCoop = () => {
  const router = useRouter();
  const [samityRegList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [unionList, setUnionList] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [upazilaId, setUpazilaId] = useState(null);
  const [unionId, setUnionId] = useState(null);
  const [projectList] = useState([]);
  const [coopSamityInfo, setCoopSamityInfo] = useState({
    fromCoop: '1',
    samityRegNo: '',
    projectName: '',
    samityName: '',
    officeName: '',
    districtId: '',
    upazilaId: '',
    unionId: '',
    village: '',
    address: '',
    meetingDay: '',
    lofi: '',
    shareAmount: '',
    latitude: '10.2568',
    longlitude: '30.5869',
  });
  const config = localStorageData('config');

  useEffect(() => {
    getDistrict();
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
      errorHandler(error);
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
      errorHandler(error);
    }
  };
  // ("Form Object", formErrors);
  let getUnion = async () => {
    try {
      let unionList = await axios.get(unionRoute, config);
      // (
      //   "Union List========================",
      //   unionList.data.data
      // );
      if (unionList.data.data.length == 1) {
        setUnionId(unionList.data.data[0].id);
      }
      setUnionList(unionList.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  const handleChange = (e) => {
    setCoopSamityInfo({
      ...coopSamityInfo,
      [e.target.name]: e.target.value,
    });
  };

  'Samity Data', coopSamityInfo;


  const onNextPage = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/loan/member-registration',
    });
  };

  return (
    <>
      <Grid item md={12} xs={12} mx={2} my={2} px={1} pb={1} sx={{ backgroundColor: '#F9F9F9', borderRadius: '10px' }}>
        <Grid container spacing={2.5}>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="প্রকল্পের নাম"
              name="projectName"
              required
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.projectName}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {projectList &&
                projectList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.projectName}
                  </option>
                ))}
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="সমিতির কোড"
              name="samityRegNo"
              required
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.samityRegNo}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {samityRegList &&
                samityRegList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
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
              value={coopSamityInfo.samityName}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="কার্যালয়ের নাম"
              name="officeName"
              onChange={handleChange}
              number
              value={coopSamityInfo.officeName}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              id="district"
              label="জেলা"
              name="district"
              required
              select
              SelectProps={{ native: true }}
              value={districtId != null ? districtId : coopSamityInfo.districtId}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ bgcolor: '#FFF' }}
            >
              {' '}
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
              id="upazila"
              name="upazila"
              required
              select
              SelectProps={{ native: true }}
              value={upazilaId != null ? upazilaId : coopSamityInfo.upazilaId}
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
              id="union"
              fullWidth
              label="ইউনিয়ন"
              name="union"
              required
              select
              SelectProps={{ native: true }}
              value={unionId != null ? unionId : coopSamityInfo.unionId}
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
              value={coopSamityInfo.village}
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
              value={coopSamityInfo.address}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            ></TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="মিটিং এর দিন"
              name="meetingDay"
              onChange={handleChange}
              required
              value={coopSamityInfo.meetingDay}
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
              label="ফ্যাসিলিটেটর / এলওফআই"
              name="lofi"
              required
              select
              SelectProps={{ native: true }}
              value={coopSamityInfo.lofi}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#FFF' }}
            >
              <option>- নির্বাচন করুন -</option>
              <option value={1}>- নির্বাচন করুন -</option>
            </TextField>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="শেয়ার সংখ্যা*"
              name="shareAmount"
              onChange={handleChange}
              number
              value={coopSamityInfo.shareAmount}
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
          {/* <Grid item md={5} xs={12}>
                        <Card sx={{ display: 'flex', height: '200px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography component="div" variant="h6">
                                        রেজোলিউশন
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                        <Stack direction="row" alignItems="center" spacing={2.5}>
                                            <label htmlFor="contained-button-file2">
                                                <Input accept="image/*" id="contained-button-file2" multiple type="file" />
                                                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                                                    সংযুক্তি
                                                </Button>
                                            </label>
                                        </Stack>
                                    </Typography>
                                </CardContent>
                            </Box>
                        </Card>
                    </Grid> */}
        </Grid>
      </Grid>
      <Divider />
      <Grid container className="btn-container">
        <Tooltip title="পরবর্তী পাতা">
          <Button
            variant="contained"
            className="btn btn-primary"
            onClick={onNextPage}
            endIcon={<KeyboardArrowRightIcon />}
          >
            পরবর্তী পাতায়{' '}
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default SamityRegFromCoop;
