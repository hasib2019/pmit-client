
import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Tooltip } from '@mui/material';
import { bangToEng } from 'components/mainSections/samity-managment/member-registration/validator';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { prodcutDataUpdate, specificApplication } from '../../../../../url/ApiList';
import { getApi } from '../utils/getApi';
import ScBivajonReuseable from './reuseable/ScBivajonReuseable';
import ScBivajonReuseableTable from './reuseable/ScBivajonReuseableTable';

const ServiceChargeBivajon = ({ appId, proName, handleChange2 }) => {
  const { prodName, projName } = proName;
  const [tempComponent, setTempComponent] = React.useState([
    {
      id: 1,
    },
  ]);
  const scBivajonInput = useRef();

  const [allChildData, setAllChildData] = useState([]);
  const [tableData, setTableData] = useState([]);
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
      getServiceChargeData();
    }
  }, [dataSubmitted]);

  const getServiceChargeData = async () => {
    try {
      let res = await getApi(specificApplication + '11/' + appId + '/loan', 'get');
      setTableData(
        res?.data?.data?.applicationInfo?.serviceChargeBivajon
          ? res?.data?.data?.applicationInfo?.serviceChargeBivajon
          : [],
      );
    } catch (err) {
      err;
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
    let selectedId = temp[i]?.id;
    allChildDataCopy = allChildDataCopy.filter((elem, index) => index != i);
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
      elem.percentage = bangToEng(elem.percentage);
    });

    let payload = {
      projectId: projName,
      samityId: null,
      data: {
        serviceChargeBivajon: deepCopy,
      },
    };
    try {
      let res = await getApi(prodcutDataUpdate + 'productServiceChargeSegregation/' + appId, 'put', payload);
      if (res?.data?.data) {
        let message = res?.data?.message;
        NotificationManager.success(message);
        scBivajonInput.current.updateScBijavonState();
        setDataSubmitted((prevState) => prevState + 1);

        setTempComponent([
          {
            id: 1,
          },
        ]);
        setAllChildData([]);
        setTargetId(null);
        handleChange2('4');
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
              <ScBivajonReuseable
                ref={scBivajonInput}
                idx={i}
                childData={takeData}
                forEdit={dataForEdit ? dataForEdit : []}
                proName={prodName}
                onDeleteData={() => onDeleteData(i)}
                setAllChildData={setAllChildData}
                tempComponent={tempComponent}
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
          <Tooltip title="সার্ভিস চার্জ বিভাজন যোগ করুন">
            <Button variant="contained" className="btn btn-primary" onClick={() => onAddData()} startIcon={<AddIcon />}>
              {' '}
              চার্জ বিভাজন
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
      <ScBivajonReuseableTable data={tableData} editDataInd={editDataInd} />
    </>
  );
};

export default ServiceChargeBivajon;
