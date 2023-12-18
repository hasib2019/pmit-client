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
import Title from 'components/shared/others/Title';
import RequiredFile from 'components/utils/RequiredFile';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { GetFeature, RoleCreate } from '../../../../../url/coop/RoleApi';

const CreateRole = () => {
  const updatedColor = useSelector((state) => state.ColorSlice.colorBucket);

  const token = localStorageData('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-type': 'DEV',
    },
  };
  const [sortedFeatureArr, setSortedFeatureArr] = useState([]);
  const [boxValue, setBoxValue] = useState([]);

  const [createRole, setCreateRole] = useState({
    roleName: '',
    description: '',
    features: [],
  });

  const [switchActive, setSwitchActive] = useState(false);

  useEffect(() => {
    getAllFeature();
  }, []);

  const getAllFeature = async () => {
    try {
      let allFeatures = await axios.get(GetFeature + '?isPagination=false', config);
      let features = allFeatures.data.data;

      let sortedFeatures = [];
      // root features extract =============================
      let rootArray = features.filter((v) => v.isRoot === true);
      // child Features Extraction =========================
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
      setSortedFeatureArr([...sortedFeatures]);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    setCreateRole({ ...createRole, [e.target.name]: e.target.value });
  };

  const toggleSwitch = () => {
    setSwitchActive(!switchActive);
  };

  const { roleName, description } = createRole;
  const boxValueChange = (e, id) => {
    let boxArray = [...boxValue];
    if (e.target.checked) {
      boxArray.push(id);
    } else {
      let value = boxArray.find((v) => v === id);
      let removeVal = boxArray.indexOf(value);
      boxArray.splice(removeVal, 1);
    }

    setBoxValue(boxArray);
  };

  const submitRole = async () => {
    const obj = {
      roleName: roleName,
      description: description,
      isActive: switchActive,
      features: boxValue,
    };

    try {
      if (boxValue.length < 1) {
        NotificationManager.error('কোন ফিচার সংযুক্ত নাই');
        return;
      }
      await axios.post(RoleCreate, obj, config);
      NotificationManager.success('রোল সফলভাবে তৈরি হয়েছে');
      setBoxValue([]);
      setCreateRole({
        roleName: '',
        description: '',
      });
      setSwitchActive(false);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item sm={12} md={12} xs={12} lg={12} xl={12} xxl={12}>
          <Grid container spacing={1.6} px={2} pt={2}>
            <Grid item md={5} sm={8} xs={12}>
              <TextField
                fullWidth
                label={RequiredFile('রোল নাম')}
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
                control={<Switch value={switchActive} onChange={toggleSwitch} color="primary" />}
                label={RequiredFile('সক্রিয়/নিষ্ক্রিয়')}
                labelPlacement="start"
                name="isActive"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Title>
            <Typography variant="h5" sx={{ color: '#00539CFF' }}>
              ফিচারসমূহ
            </Typography>
          </Title>
          <Grid container spacing={1.8} px={2} pt={1}>
            <FormControl component="fieldset" sx={{ marginTop: '20px' }}>
              <FormGroup aria-label="position" row>
                <Grid container spacing={1}>
                  {sortedFeatureArr.map((val, ind) => (
                    <Grid key={ind} item xs={12} sm={12} md={12} lg={12}>
                      {val.type === 'P' ? (
                        <Paper>
                          <Chip
                            className="chipBgLight"
                            sx={{
                              margin: val.isRoot === true ? '5px' : '5px 5px 5px 30px',
                              fontSize: '10px',
                              color: val.isRoot === true ? updatedColor : '',
                            }}
                            label={
                              <FormControlLabel
                                key={ind}
                                value={val.id}
                                control={<Checkbox onChange={(e) => boxValueChange(e, val.id)} />}
                                label={val.featureNameBan}
                                labelPlacement="end"
                              />
                            }
                          ></Chip>
                        </Paper>
                      ) : (
                        <Chip
                          className="chipBgDark"
                          sx={{ margin: '5px 5px 5px 50px', fontSize: '10px' }}
                          label={
                            <FormControlLabel
                              key={ind}
                              value={val.id}
                              control={<Checkbox onChange={(e) => boxValueChange(e, val.id)} />}
                              label={val.featureNameBan}
                              labelPlacement="end"
                            />
                          }
                        ></Chip>
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
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Tooltip title="সংরক্ষন করুন">
            <Button variant="contained" className="btn btn-save" onClick={submitRole} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সংরক্ষন করুন
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateRole;
