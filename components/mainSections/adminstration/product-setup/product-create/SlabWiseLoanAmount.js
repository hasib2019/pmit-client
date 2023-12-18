
import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Tooltip } from '@mui/material';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { prodcutDataUpdate, specificApplication } from '../../../../../url/ApiList';
import { bangToEng } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';
import SlabWiseLoanReuseable from './reuseable/SlabWiseLoanReuseable';
import SlabWiseLoanTable from './reuseable/SlabWiseLoanTable';

const SlabWiseLoanAmount = ({ appId, proName, handleChange2 }) => {
  const { prodName, projName } = proName;
  const slabWiseLoanRef = useRef();
  const [tempComponent, setTempComponent] = React.useState([
    {
      id: 101,
    },
  ]);
  const [allChildData, setAllChildData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [dataSubmitted, setDataSubmitted] = useState(0);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    if (appId === '') {
      NotificationManager.warning('অনুগ্রহ করে প্রোডাক্ট মাস্টার পেইজ প্ৰথমে সম্পূন্ন করুন।', 'সতর্কতা', 5000);
    }
  }, []);

  useEffect(() => {
    //appId = 367;
    if (appId) {
      getSlabWiseData();
    }
  }, [dataSubmitted]);
  const getSlabWiseData = async () => {
    let res = await getApi(specificApplication + '11/' + appId + '/loan', 'get');
    setTableData(
      res?.data?.data.applicationInfo?.slabWiseLoanAmount ? res.data.data.applicationInfo.slabWiseLoanAmount : [],
    );
  };

  const onAddData = () => {
    let temp = [...tempComponent];
    const ids = temp.map((object) => {
      return object.id;
    });
    console.log('Temp----', tempComponent);
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
      elem.highestAmount = bangToEng(elem.highestAmount);
      elem.lowestAmount = bangToEng(elem.lowestAmount);
      elem.pastLoanDifference = bangToEng(elem.pastLoanDifference);
      elem.perOfShares = bangToEng(elem.perOfShares);
      elem.perOfSavings = bangToEng(elem.perOfSavings);
    });
    let payload = {
      projectId: projName,
      samityId: null,
      data: {
        slabWiseLoanAmount: deepCopy,
      },
    };
    try {
      const res = await getApi(prodcutDataUpdate + 'productSanctionPolicy/' + appId, 'put', payload);
      if (res.data.data) {
        let message = res.data.message;
        NotificationManager.success(message);
        slabWiseLoanRef.current.updateProState();
        setDataSubmitted((prevState) => prevState + 1);
        setTempComponent([
          {
            id: 1,
          },
        ]);
        setAllChildData([]);
        setTargetId(null);
        handleChange2('6');
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
              <SlabWiseLoanReuseable
                ref={slabWiseLoanRef}
                idx={i}
                childData={takeData}
                forEdit={dataForEdit ? dataForEdit : []}
                proName={prodName}
                onDeleteData={() => onDeleteData(i)}
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
        <Tooltip title="ঋণের পরিমাণ যোগ করুন">
          <Button variant="contained" className="btn btn-primary" onClick={() => onAddData()} startIcon={<AddIcon />}>
            {' '}
            ঋণের পরিমাণ
          </Button>
        </Tooltip>
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
      <SlabWiseLoanTable data={tableData} editDataInd={editDataInd} />
    </>
  );
};

export default SlabWiseLoanAmount;
