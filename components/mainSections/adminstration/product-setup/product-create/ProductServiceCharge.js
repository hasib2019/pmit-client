/* eslint-disable no-unused-vars */

const _ = require('lodash');
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Paper, Tooltip } from '@mui/material';
import { bangToEng } from 'components/mainSections/samity-managment/member-registration/validator';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { prodcutDataUpdate, specificApplication } from '../../../../../url/ApiList';
import { getApi } from '../utils/getApi';
import ProductServiceChargeTable from './reuseable/ProductServiceChargeTable';
import PscReuseable from './reuseable/PscReuseable';
import { errorHandler } from 'service/errorHandler';

const ProductServiceCharge = ({ resSuccess, appId, proName, handleChange2 }) => {
  const { prodName, projName } = proName;
  const [stateId, setStateId] = useState(1);
  const [tempComponent, setTempComponent] = React.useState([
    {
      id: 1,
    },
  ]);

  const [allChildData, setAllChildData] = useState([
    {
      serviceChargeRate: 0,
      startDate: new Date(),
      lateServiceChargeRate: 0,
      expireServiceChargeRate: 0,
      activeToggle: true,
    },
  ]);
  const [tableData, setTableData] = useState([]);
  const [dataSubmitted, setDataSubmitted] = useState(0);
  const [dataForEdit, setDataForEdit] = useState([]);
  const [targetId, setTargetId] = useState(null);

  const inputRef = useRef();
  useEffect(() => {
    if (appId === '') {
      NotificationManager.warning('অনুগ্রহ করে প্রোডাক্টের তথ্য পেইজ প্ৰথমে সম্পূন্ন করুন।', 'সতর্কতা', 5000);
    }
  }, []);
  useEffect(() => { }, [allChildData]);
  useEffect(() => {
    if (appId) {
      getServiceChargeData();
    }
  }, [dataSubmitted]);

  const getServiceChargeData = async () => {
    try {
      let res = await getApi(specificApplication + appId, 'get');
      setTableData(res.data.data.productServiceCharge ? res.data.data.productServiceCharge : []);
    } catch (err) {
      err;
    }
  };

  const onAddData = () => {
    let temp = [...tempComponent];
    let allChildDataCopy = [...allChildData];
    const ids = temp.map((object) => {
      return object.id;
    });

    const max = Math.max(...ids);
    temp.push({
      id: max + 1,
    });
    setTempComponent(temp);
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
    deepCopy.forEach((elem) => {
      elem.serviceChargeRate = bangToEng(elem.serviceChargeRate);
      elem.lateServiceChargeRate = bangToEng(elem.lateServiceChargeRate);
      elem.expireServiceChargeRate = bangToEng(elem.expireServiceChargeRate);
    });

    let payload = {
      projectId: projName,
      samityId: null,
      data: {
        productServiceCharge: deepCopy,
      },
    };
    try {
      const res = await getApi(prodcutDataUpdate + 'productServiceCharge/' + appId, 'put', payload);
      if (res?.data?.data) {
        let message = res.data.message;
        NotificationManager.success(message);
        setDataSubmitted((prevState) => prevState + 1);
        inputRef.current.updateProState();
        setTempComponent([
          {
            id: 1,
          },
        ]);
        setAllChildData([]);
        setTargetId(null);
        handleChange2('3');
      }

      setDataSubmitted((prevState) => prevState + 1);
    } catch (error) { 
      errorHandler(error)
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: '20px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          mb: '20px',
        }}
      >
        <Grid container>
          {tempComponent.map((v, i) => (
            <Grid container key={v.id}>
              <Grid item xs={12} sm={12} md={12}>
                <PscReuseable
                  ref={inputRef}
                  idx={i}
                  childData={takeData}
                  forEdit={dataForEdit ? dataForEdit : []}
                  proName={prodName}
                  onDeleteData={(e) => onDeleteData(i)}
                  setAllChildData={setAllChildData}
                  tempComponent={tempComponent}
                  setTempComponent={setTempComponent}
                  setDataForEdit={setDataForEdit}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container className="btn-container">
        {/* { dataForEdit.length>=1?"": 
          <Tooltip title="সার্ভিস চার্জ যোগ করুন">
            <Button
              variant="contained"
              className="btn-add"
              onClick={() => onAddData()}
            >
              <AddIcon />
              &nbsp;সার্ভিস চার্জ
            </Button>
          </Tooltip>
        } */}
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
      <ProductServiceChargeTable data={tableData} editDataInd={editDataInd} />
    </>
  );
};

export default ProductServiceCharge;
