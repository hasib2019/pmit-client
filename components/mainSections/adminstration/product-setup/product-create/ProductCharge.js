/* eslint-disable no-unused-vars */
import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { prodcutDataUpdate, specificApplication } from '../../../../../url/ApiList';
import { bangToEng } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';

import ProductChargeReuseable from './reuseable/ProductChargeReuseable';
import ProductChargeTable from './reuseable/ProductChargeTable';
import { errorHandler } from 'service/errorHandler';
import _ from 'lodash';
const ProductCharge = ({ resSuccess, appId, proName, handleChange2 }) => {
  const { prodName, projName } = proName;
  const [tempComponent, setTempComponent] = React.useState([
    {
      id: 101,
    },
  ]);
  const productChargeInput = useRef();

  const [tableData, setTableData] = useState([]);
  const [allChildData, setAllChildData] = useState([]);
  const [dataSubmitted, setDataSubmitted] = useState(0);
  const [dataForEdit, setDataForEdit] = useState([]);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    if (appId === '') {
      NotificationManager.warning('অনুগ্রহ করে প্রোডাক্ট মাস্টার পেইজ প্ৰথমে সম্পূন্ন করুন।', 'সতর্কতা', 5000);
    }
  }, []);

  useEffect(() => {
    if (appId) {
      getProductChargeData();
    }
  }, [dataSubmitted]);
  const getProductChargeData = async () => {
    try {
      let res = await getApi(specificApplication + '11/' + appId + '/loan', 'get');
      setTableData(
        res?.data?.data?.applicationInfo?.productCharge ? res?.data?.data?.applicationInfo?.productCharge : [],
      );
    } catch (error) {
      errorHandler(error)
     }
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
      elem.chargeAmount = bangToEng(elem.chargeAmount);
    });
    let payload = {
      projectId: projName,
      samityId: null,
      data: {
        productCharge: deepCopy,
      },
    };
    try {
      const res = await getApi(prodcutDataUpdate + 'productCharge/' + appId, 'put', payload);
      if (res.data.data) {
        let message = res.data.message;
        NotificationManager.success(message);
        setDataSubmitted((prevState) => prevState + 1);
        productChargeInput.current.updateProChargeState();

        setTempComponent([
          {
            id: 101,
          },
        ]);
        setAllChildData([]);
        setTargetId(null);
        handleChange2('5');
      }
      setDataSubmitted((prevState) => prevState + 1);
    } catch (err) {
      err;
    }
  };

  return (
    <>
      <Grid container>
        {tempComponent.map((v, i) => (
          <Grid container key={v.id}>
            <Grid item xs={12} sm={12} md={12}>
              <ProductChargeReuseable
                ref={productChargeInput}
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
        {dataForEdit.length >= 1 ? (
          ''
        ) : (
          <Tooltip title="প্রোডাক্ট চার্জ যোগ করুন">
            <Button variant="contained" className="btn btn-primary" onClick={() => onAddData()} startIcon={<AddIcon />}>
              {' '}
              প্রোডাক্ট চার্জ
            </Button>
          </Tooltip>
        )}
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
      <ProductChargeTable data={tableData} editDataInd={editDataInd} />
    </>
  );
};

export default ProductCharge;
