
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { GetFeature, RoleCreate } from '../../../../url/coop/RoleApi';
import Title from '../../../shared/others/Title';

const UpdateRole = () => {
  const token = localStorageData('token');
  const config = localStorageData('config', token);
  const router = useRouter();
  const { id } = router.query;
  const updatedColor = useSelector((state) => state.ColorSlice.colorBucket);
  const [sortedFeatureArr, setSortedFeatureArr] = useState([]);
  const [updateRole, setUpdateRole] = useState({
    roleName: '',
    description: '',
    features: [],
  });

  const [switchActive, setSwitchActive] = useState(true);

  useEffect(() => {
    getData(id);
  }, []);

  let getData = async (id) => {
    try {
      let allFeatures = await axios.get(GetFeature, config);
      let features = allFeatures.data.data;

      features.map((val) => {
        val.isChecked = false;
      });

      let sortedFeatures = [];
      let rootArray = features.filter((v) => v.isRoot === true);

      for (let v of rootArray) {
        sortedFeatures.push(v);
        let childExtract = features.filter((c) => c.parentId === v.id);
        for (let iChild of childExtract) {
          if (iChild.type === 'C') {
            sortedFeatures.push(iChild);
          } else {
            sortedFeatures.push(iChild);
            let innerChildExtract = features.filter((c) => c.parentId === iChild.id);
            sortedFeatures.push(...innerChildExtract);
          }
        }
      }

      let url = RoleCreate + id;
      let dataId = await axios.get(url, config);
      let updateData = dataId.data.data.role;
      setSwitchActive(updateData.isActive);
      let featuresArr = updateData.featureList;

      setUpdateRole({
        roleName: updateData.roleName,
        description: updateData.description,
        features: updateData.featureList,
      });

      featuresArr.map((val) => {
        sortedFeatures.map((result) => {
          if (val.id === result.id) {
            result.isChecked = true;
          }
        });
      });

      setSortedFeatureArr([...sortedFeatures]);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    setUpdateRole({ ...updateRole, [e.target.name]: e.target.value });
  };

  const toggleSwitch = (e) => {
    setSwitchActive(e.target.checked);
  };

  const { roleName, description, isActive } = updateRole;

  const boxValueChange = (e, id, ind) => {
    sortedFeatureArr[ind].isChecked = !sortedFeatureArr[ind].isChecked;
    setSortedFeatureArr([...sortedFeatureArr]);
  };

  let handleUpdateRole = async (e) => {
    e.preventDefault();
    let { roleName, description } = updateRole;

    let trueId = [];
    for (let s of sortedFeatureArr) if (s.isChecked) trueId.push(s.id);

    const obj = {
      roleName: roleName,
      description: description,
      //approveStatus: switchActive == true ? 'A' : 'R',
      isActive: switchActive,
      features: trueId,
    };

    const config1 = {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-type': 'DEV',
      },
    };

    try {
      let url = RoleCreate + id;
      let updateRole = await axios.put(url, obj, config1);
      let msg = updateRole.data.message;
      NotificationManager.success(msg, '', 5000);
      router.back();
    } catch (error) {
      errorHandler(error);
    }
  };

  const fontSizeChanger = (label) => {
    return (
      <p
        style={{
          fontSize: '14px',
          fontFamily: "'Bangla', sans-serif",
          margin: '0',
          padding: '5px',
        }}
      >
        {label}
      </p>
    );
  };

  return (
    <>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item sm={12} md={12} xs={12} lg={12} xl={12} xxl={12}>
          <Grid container spacing={1.6} px={2} pt={2}>
            <Grid item md={5} sm={8} xs={12}>
              <TextField
                fullWidth
                label="রোল নাম"
                name="roleName"
                onChange={handleChange}
                text
                variant="outlined"
                size="small"
                value={roleName}
              ></TextField>
            </Grid>
            <Grid item md={4} sm={8} xs={12}>
              <TextareaAutosize
                fullWidth
                placeholder="বিস্তারিত"
                name="description"
                onChange={handleChange}
                text
                variant="outlined"
                size="small"
                value={description}
                minRows={2}
                style={{ width: 280 }}
              />
            </Grid>
            <Grid item md={3} sm={8} xs={12}>
              <FormControlLabel
                control={<Switch onChange={toggleSwitch} color="primary" />}
                label="সক্রিয়/নিষ্ক্রিয়"
                value={isActive}
                labelPlacement="start"
                name="isActive"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item sm={12} md={12} xs={12}>
          <Title>
            <Typography variant="h5" sx={{ color: '#ffffff' }}>
              বৈশিষ্ট্য
            </Typography>
          </Title>
          <Grid container spacing={1.8} px={2} pt={2}>
            <FormControl component="fieldset" sx={{ marginTop: '20px' }}>
              <FormGroup aria-label="position" row>
                <Grid container spacing={1}>
                  {sortedFeatureArr.map((val, ind) => (
                    <Grid container spacing={1} key={ind}>
                      {val.type === 'P' ? (
                        <Grid item xs={12} sm={10} md={12}>
                          <Paper>
                            <Chip
                              sx={{
                                margin: val.isRoot === true ? '5px' : '5px 5px 5px 30px',
                                fontSize: '10px',
                                bgcolor: val.isRoot === true ? updatedColor : '',
                                color: val.isRoot === true ? '#fff' : '',
                              }}
                              label={
                                <FormControlLabel
                                  key={ind}
                                  value={val.id}
                                  control={
                                    <Checkbox
                                      defaultChecked={val.isChecked}
                                      onChange={(e) => boxValueChange(e, val.id, ind)}
                                    />
                                  }
                                  label={fontSizeChanger(val.featureNameBan)}
                                  labelPlacement="end"
                                />
                              }
                            ></Chip>
                          </Paper>
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={10} md={4}>
                          <Chip
                            sx={{
                              margin: '5px 5px 5px 50px',
                              fontSize: '10px',
                            }}
                            label={
                              <FormControlLabel
                                key={ind}
                                value={val.id}
                                control={
                                  <Checkbox
                                    defaultChecked={val.isChecked}
                                    onChange={(e) => boxValueChange(e, val.id, ind)}
                                  />
                                }
                                label={val.featureNameBan}
                                labelPlacement="end"
                              />
                            }
                          ></Chip>
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container className="btn-container">
        <Tooltip title="হালনাগাদ করুন">
          <Button
            variant="contained"
            className="btn btn-save"
            onClick={handleUpdateRole}
            startIcon={<SaveOutlinedIcon />}
            endIcon={<KeyboardDoubleArrowDownIcon />}
          >
            {' '}
            হালনাগাদ করুন
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default UpdateRole;
