/* eslint-disable no-misleading-character-class */
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
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
import axios from 'axios';
import { myValidate } from 'components/mainSections/samity-managment/member-registration/validator';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import engToBdNum from '../../../../../service/englishToBanglaDigit';
import { DeleteFeature, GetFeature } from '../../../../../url/ApiList';
import star from '../../../loan-management/loan-application/utils';

const FeatureCreate = () => {
  const config = localStorageData('config');
  const [createFeature, setCreateFeature] = useState({
    featureName: '',
    featureNameBan: '',
    featureCode: '',
    iconId: '',
    url: '',
    type: '',
    parentId: '',
    isActive: '',
    position: '',
    isRoot: '',
  });

  const [listFeature, setListFeature] = useState([]);
  const [allFetureList, setAllFeatureList] = useState([]);
  const [update, setUpdate] = useState(false);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    getFeatureList();
    getAllFeatureList();
  }, [flag]);

  let getFeatureList = async () => {
    try {
      let getFeatureData = await axios.get(GetFeature + '?isPagination=false&type=P', config);
      let arrayData = getFeatureData.data.data;
      setListFeature(arrayData);
    } catch (error) {
      errorHandler(error);
    }
  };

  let getAllFeatureList = async () => {
    try {
      let getFeatureData = await axios.get(GetFeature + '?isPagination=false', config);
      let arrayData = getFeatureData.data.data;
      setAllFeatureList(arrayData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    let resultObj;
    const { name, value, id } = e.target;
    switch (name) {
      case 'featureName':
        setCreateFeature({
          ...createFeature,
          [name]: value.replace(/[^A-Za-z0-9\w\s.-]/, ''),
        });
        break;

      case 'featureNameBan':
        setCreateFeature({
          ...createFeature,
          [name]: value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/,
            '',
          ),
        });
        break;

      case 'featureCode':
        resultObj = myValidate('fourNumber', value);
        'Result Object', resultObj.status;
        if (resultObj?.status) {
          return;
        }
        setCreateFeature({
          ...createFeature,
          [name]: resultObj?.value,
        });
        break;

      case 'iconId':
        resultObj = myValidate('fourNumber', value);
        'Result Object', resultObj.status;
        if (resultObj?.status) {
          return;
        }
        setCreateFeature({
          ...createFeature,
          [name]: resultObj?.value,
        });
        break;
    }
    if (id != 'fetureName' && id != 'fetureNameBn' && id != 'featureCode' && id != 'iconId') {
      setCreateFeature((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const onFeatureCreate = async (e) => {
    e.preventDefault();

    // let payload;
    // payload = {
    //   ...createFeature,
    //   featureCode: bangToEng(createFeature.featureCode),
    //   iconId: bangToEng(createFeature.iconId),
    //   isActive: createFeature.isActive,
    //   isRoot: createFeature.isRoot == 'true' ? true : false,
    //   parentId: createFeature.parentId ? parseInt(createFeature.parentId) : null,
    // };

    try {
      getFeatureList();

      setCreateFeature({
        featureName: '',
        featureNameBan: '',
        featureCode: '',
        iconId: '',
        url: '',
        type: 'নির্বাচন করুন',
        parentId: 'নির্বাচন করুন',
        isActive: 'নির্বাচন করুন',
        position: 'নির্বাচন করুন',
        isRoot: 'নির্বাচন করুন',
      });
      NotificationManager.success('ফিচার সফলভাবে তৈরি হয়েছে');
      setFlag(false);
      setFlag(true);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  let onHandleUpdate = (
    id,
    featureName,
    featureNameBan,
    featureCode,
    iconId,
    url,
    type,
    parentId,
    isActive,
    position,
    isRoot,
  ) => {
    setUpdate(true);
    setCreateFeature({
      id: id,
      featureName: featureName,
      featureNameBan: featureNameBan,
      featureCode: featureCode,
      iconId: iconId,
      url: url,
      type: type,
      parentId: parentId,
      isActive: isActive,
      position: position,
      isRoot: isRoot,
    });
  };
  const onFeatureUpdate = async (e) => {
    e.preventDefault();
    // const payload = createFeature;
    // let payload;
    // //////////////////////////////////////////////////////////////////////
    // if (createFeature.type === 'C') {
    //   payload = {
    //     featureName: createFeature.featureName,
    //     featureNameBan: createFeature.featureNameBan,
    //     featureCode: createFeature.featureCode,
    //     iconId: createFeature.iconId,
    //     url: createFeature.url,
    //     type: createFeature.type,
    //     parentId: createFeature.parentId,
    //     isActive: createFeature.isActive,
    //     position: createFeature.position,
    //     isRoot: createFeature.isRoot,
    //   };
    // } else {
    //   payload = {
    //     featureName: createFeature.featureName,
    //     featureNameBan: createFeature.featureNameBan,
    //     featureCode: createFeature.featureCode,
    //     iconId: createFeature.iconId,
    //     url: createFeature.url,
    //     type: createFeature.type,
    //     parentId: null,
    //     isActive: createFeature.isActive,
    //     position: createFeature.position,
    //     isRoot: createFeature.isRoot,
    //   };
    // }
    //////////////////////////////////////////////////////////////////////

    try {
      getFeatureList();

      setCreateFeature({
        featureName: '',
        featureNameBan: '',
        featureCode: '',
        iconId: '',
        url: '',
        type: 'নির্বাচন করুন',
        parentId: 'নির্বাচন করুন',
        isActive: 'নির্বাচন করুন',
        position: 'নির্বাচন করুন',
        isRoot: 'নির্বাচন করুন',
      });

      NotificationManager.success('ফিচার সফলভাবে হালনাগাদ হয়েছে');
      setFlag(false);
      setFlag(true);
      setUpdate(false);
    } catch (error) {
      errorHandler(error);
    }
  };

  let onFeatureDelete = async (id) => {
    let urlDelete = DeleteFeature + id;
    try {
      await axios.delete(urlDelete, config);
      // let msg = deleteFeature.data.message;
      NotificationManager.success('ফিচারটি সংরক্ষণাগারে রাখা হয়েছে');
      setFlag(false);
      setFlag(true);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      <Grid container className="section" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item md={12}>
          <Grid container spacing={2.5} id="goTo">
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                id="fetureName"
                fullWidth
                label={star('ফিচার নাম (ইংরেজি)')}
                name="featureName"
                onChange={handleChange}
                type="text"
                value={createFeature.featureName}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star('ফিচার নাম (বাংলা)')}
                id="fetureNameBn"
                name="featureNameBan"
                onChange={handleChange}
                type="text"
                value={createFeature.featureNameBan}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star('ফিচার কোড')}
                id="featureCode"
                name="featureCode"
                onChange={handleChange}
                type="text"
                value={createFeature.featureCode}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star('আইকন আইডি')}
                id="iconId"
                name="iconId"
                onChange={handleChange}
                type="text"
                value={createFeature.iconId}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star('লিংক')}
                name="url"
                onChange={handleChange}
                type="text"
                value={createFeature.url}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star('ফিচারের ধরণ')}
                name="type"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={createFeature.type ? createFeature.type : ' '}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                <option value="P">প্যারেন্ট</option>
                <option value="C">চাইল্ড </option>
              </TextField>
            </Grid>
            <Grid item xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star('রুট কি/না ?')}
                name="isRoot"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={createFeature.isRoot ? createFeature.isRoot : ' '}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                <option value="true">হ্যাঁ </option>
                <option value="false"> না </option>
              </TextField>
            </Grid>
            {createFeature.type == 'C' || createFeature.isRoot == 'false' ? (
              <Grid item xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
                <TextField
                  fullWidth
                  label={star('প্যারেন্ট আইডি')}
                  name="parentId"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={createFeature.parentId ? createFeature.parentId : ' '}
                  variant="outlined"
                  size="small"
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {listFeature.map((e, index) => {
                    return (
                      <option key={index} value={e.id}>
                        {`${e.featureCode}-${e.featureNameBan}`}
                      </option>
                    );
                  })}
                </TextField>
              </Grid>
            ) : (
              ' '
            )}
            <Grid item xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star(' সচল কি/না ?')}
                name="isActive"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={createFeature.isActive ? createFeature.isActive : ' '}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                <option value="true">সচল </option>
                <option value="false">সচল নয় </option>
              </TextField>
            </Grid>
            <Grid item xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
              <TextField
                fullWidth
                label={star('ফিচারের অবস্থান')}
                name="position"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={createFeature.position ? createFeature.position : ' '}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                <option value="SIDE">SideBar</option>
                <option value="NAV">NavBar</option>
                <option value="CONT">Content</option>
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className="btn-container">
          {update ? (
            <Tooltip title="হালনাগাদ করুন">
              <Button
                variant="contained"
                className="btn btn-save"
                onClick={onFeatureUpdate}
                startIcon={<SaveOutlinedIcon />}
              >
                {' '}
                হালনাগাদ করুন
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="সংরক্ষণ করুন">
              <Button
                variant="contained"
                className="btn btn-save"
                onClick={onFeatureCreate}
                startIcon={<SaveOutlinedIcon />}
              >
                {' '}
                সংরক্ষণ করুন
              </Button>
            </Tooltip>
          )}
        </Grid>
      </Grid>
      <Grid container className="section">
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>ক্রমিক</TableCell>
                <TableCell>ফিচার নাম </TableCell>
                <TableCell>ফিচার নাম (বাংলা)</TableCell>
                <TableCell>কোড</TableCell>
                <TableCell sx={{ width: '25%' }}>লিংক</TableCell>
                <TableCell>ধরন</TableCell>
                <TableCell>সচল</TableCell>
                <TableCell>রুট</TableCell>
                <TableCell align="center">সম্পাদন</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allFetureList
                ? allFetureList.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell align="center" component="th" scope="row">
                      {engToBdNum(i + 1)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{data.featureName}</div>} arrow>
                        <div className="data">{data.featureName}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{data.featureNameBan}</div>} arrow>
                        <div className="data">{data.featureNameBan}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{data.featureCode}</TableCell>
                    <TableCell className="">
                      {' '}
                      <Tooltip arrow title={<div className="tooltip-title">{data.url}</div>}>
                        <div className="data">{data.url}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{data.type === 'P' ? 'Parent' : 'Child'}</TableCell>
                    <TableCell>{JSON.stringify(data.isActive)}</TableCell>
                    <TableCell>{JSON.stringify(data.isRoot)}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: 'flex',
                          textAlign: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* =========================== tuhin vai solve korbe start */}
                        {/* <Link
                            activeClass="active"
                            to="#goTo"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={700}
                          >
                            <Button
                              size="small"
                              onClick={() =>
                                onHandleUpdate(
                                  data.id,
                                  data.featureName,
                                  data.featureNameBan,
                                  data.featureCode,
                                  data.iconId,
                                  data.url,
                                  data.type,
                                  data.parentId,
                                  data.isActive,
                                  data.position,
                                  data.isRoot
                                )
                              }
                            >
                              <EditIcon className="edit table-icon" />
                            </Button>
                          </Link> */}
                        {/* =========================== tuhin vai solve korbe end */}
                        <a href="#goTo">
                          <Button
                            size="small"
                            onClick={() =>
                              onHandleUpdate(
                                data.id,
                                data.featureName,
                                data.featureNameBan,
                                data.featureCode,
                                data.iconId,
                                data.url,
                                data.type,
                                data.parentId,
                                data.isActive,
                                data.position,
                                data.isRoot,
                              )
                            }
                          >
                            <EditIcon className="edit table-icon" />
                          </Button>
                        </a>
                        <Tooltip title="বাতিল করুন">
                          <Button
                            onClick={() =>
                              window.confirm('আপনি কি উক্ত ডাটাটি বাতিল করতে চাচ্ছেন?') && onFeatureDelete(data.id)
                            }
                          >
                            <CloseIcon className="delete table-icon" />
                          </Button>
                        </Tooltip>

                        {/* <Avatar sx={{ color: "#B20600", backgroundColor: "#F55353", height: "26px", width: "26px", marginLeft: "5px" }}>
                                                    
                                                </Avatar> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                : ' '}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default FeatureCreate;
