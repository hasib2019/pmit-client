/* eslint-disable no-unused-vars */

import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Autocomplete, Button, Grid, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { employeeRecordByOffice, officeName, prodcutDataUpdate, specificApplication } from '../../../../../url/ApiList';
import { getApi } from '../utils/getApi';
import NecessaryDocumentReusable from './reuseable/NecessaryDocumentReusable';
import NecessaryDocumentTable from './reuseable/NecessaryDocumentTable';
const NecessaryDocument = ({ resSuccess, appId, proName, handleChange2 }) => {
  const neccessaryDocRef = useRef();
  const config = localStorageData('config');
  const { prodName, projName } = proName;
  const [tempComponent, setTempComponent] = React.useState([
    {
      id: 1,
    },
  ]);
  const [allChildData, setAllChildData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [dataSubmitted, setDataSubmitted] = useState(0);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [nextAppDesId, setNextAppDesId] = useState('');
  const [empList, setEmpList] = useState([]);
  const [officeObj, setOfficeObj] = useState({
    id: '',
    label: '',
  });
  const [officeNames, setOfficeNames] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  const onAddData = () => {
    let temp = [...tempComponent];
    const ids = temp.map((object) => {
      return object.id;
    });

    const max = Math.max(...ids);
    temp.push({
      id: max + 1,
    });
    setTempComponent(temp);
  };
  let getOfficeName = async () => {
    try {
      let officeNameData = await axios.get(officeName, config);
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      'error found', error;
      if (error.response) {
        'error found', error.response.data;
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getDeskId = async (id) => {
    try {
      let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, config);
      const deskData = Data.data.data;
      setEmpList(deskData);
    } catch (error) {
      errorHandler(error)
    }
  };
  useEffect(() => {
    if (appId === '') {
      NotificationManager.warning('অনুগ্রহ করে প্রোডাক্ট মাস্টার পেইজ প্ৰথমে সম্পূন্ন করুন।', 'সতর্কতা', 5000);
    }
    getOfficeName();
  }, []);

  useEffect(() => {
    if (appId) {
      getNecDocData();
    }
  }, [dataSubmitted]);

  const getNecDocData = async () => {
    let res = await getApi(specificApplication + '11/' + appId + '/loan', 'get');
    setTableData(
      res?.data?.data?.applicationInfo?.necessaryDocument ? res?.data?.data?.applicationInfo?.necessaryDocument : [],
    );
  };

  const onDeleteData = (i) => {
    let temp = [...tempComponent];
    let allChildDataCopy = [...allChildData];
    allChildDataCopy = allChildDataCopy.filter((elem, index) => index != i);
    let selectedId = temp[i]?.id;
    temp = temp.filter((elem) => elem.id != selectedId);
    setTempComponent(temp);
    setAllChildData(allChildDataCopy);
  };
  const takeData = (data, id) => {
    let arr = [...allChildData];
    arr[id] = data;
    setAllChildData(arr);
  };
  const editDataInd = (id) => {
    let target = [...tableData];
    let filterTarget = target.filter((v, i) => id === i);
    setDataForEdit(filterTarget);
    setTargetId(id);
  };

  const saveData = async () => {
    let deepCopy, copyData;
    if (targetId != null) {
      tableData[targetId] = allChildData[0];
      deepCopy = _.cloneDeep(tableData);
    } else {
      copyData = [...tableData, ...allChildData];
      deepCopy = _.cloneDeep(copyData);
    }

    let payload = {
      projectId: projName,
      samityId: null,
      data: {
        necessaryDocument: deepCopy,
      },
      nextAppDesId: nextAppDesId,
    };
    try {
      const res = await getApi(prodcutDataUpdate + 'productDocuments/' + appId, 'put', payload);
      if (res?.data?.data) {
        let message = res.data.message;
        NotificationManager.success(message);
        neccessaryDocRef.current.updateProState();
        setDataSubmitted((prevState) => prevState + 1);
        setTempComponent([
          {
            id: 1,
          },
        ]);
        setTargetId(null);
        setAllChildData([]);
      }
    } catch (err) {
      errorHandler(err)
    }
  };
  const handleChange = (e) => {
    setNextAppDesId(e.target.value);
  };
  return (
    <>
      <Grid container>
        {tempComponent.map((v, i) => (
          <Grid container key={v.id}>
            <Grid item xs={12} sm={12} md={12}>
              <NecessaryDocumentReusable
                ref={neccessaryDocRef}
                idx={i}
                childData={takeData}
                forEdit={dataForEdit ? dataForEdit : []}
                proName={prodName}
                onDeleteData={(e) => onDeleteData(i)}
                tempComponent={tempComponent}
                setAllChildData={setAllChildData}
                setDataForEdit={setDataForEdit}
                setTempComponent={setTempComponent}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="ডকুমেন্ট যোগ করুন">
          <Button variant="contained" className="btn btn-primary" onClick={() => onAddData()}>
            <AddIcon sx={{ display: 'block' }} />
            &nbsp;ডকুমেন্ট
          </Button>
        </Tooltip>
      </Grid>
      <Grid container mt={2} mb={4}>
        <Grid item md={6} xs={12} sx={{ marginTop: '10px', marginRight: '5px' }}>
          <Autocomplete
            disablePortal
            inputProps={{ style: { padding: 0, margin: 0 } }}
            name="officeName"
            onChange={(event, value) => {
              if (value == null) {
                setOfficeObj({
                  id: '',
                  label: '',
                });
              } else {
                value &&
                  setOfficeObj({
                    id: value.id,
                    label: value.label,
                  });
                getDeskId(value.id);
              }
            }}
            options={officeNames.map((option) => {
              return {
                id: option.id,
                label: option.nameBn,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={officeObj.id === '' ? 'কার্যালয় নির্বাচন করুন' : 'কার্যালয়'}
                variant="outlined"
                size="small"
              />
            )}
            value={officeObj}
          />
        </Grid>
        <Grid item md={5.5} xs={12} sx={{ marginTop: '10px', marginRight: '5px' }}>
          <TextField
            id="projectName"
            fullWidth
            label={star('আবেদন গ্রহনকারীর নাম')}
            name="nextAppDesId"
            select
            SelectProps={{ native: true }}
            value={nextAppDesId ? nextAppDesId : ' '}
            onChange={handleChange}
            disabled=""
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {empList.map((option, idx) => (
              <option key={idx} value={option.designationId}>
                {`${option.nameBn ? option.nameBn : ''} (${option.designation})`}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষণ করুন">
          <Button
            variant="contained"
            className="btn btn-save"
            onClick={() => saveData()}
            disabled={appId === '' ? true : false}
            startIcon={<SaveOutlinedIcon />}
          >
            {' '}
            সংরক্ষণ করুন
          </Button>
        </Tooltip>
      </Grid>
      <NecessaryDocumentTable data={tableData} editDataInd={editDataInd} />
    </>
  );
};

export default NecessaryDocument;
