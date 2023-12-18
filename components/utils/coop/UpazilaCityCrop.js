
import { TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { geoData } from '../../../url/coop/ApiList';
import RequiredFile from '../../utils/RequiredFile';

const UpazilaCityCrop = (props) => {
  const config = localStorageData('config');
  const { allUpazilaData } = props;
  const {
    selectedDis,
    selectedDiv,
    selectedWDis,
    selectedWDiv,
    selectedUpazilaId,
    selectedUpazilaType,
    childUpaDefault,
  } = props;
  const { flag, childWUpa } = props;
  // const { childUpa } = props;
  // const { childPass } = props;
  const [resultOfUpazila, setResultOfUpazila] = useState([]);
  const [resultOfWUpazila, setResultOfWUpazila] = useState([]);
  // const [upazilaId, setUpazilaId] = useState('');
  const [wupazilaId, setWUpazilaId] = useState('');
  const [newUpaId, setNewUpaId] = useState('');
  const [newUpaType, setNewUpaType] = useState('');
  const [wnewUpaId, setWnewUpaId] = useState('');
  const [wnewUpaType, setwnewUpaType] = useState('');

  // new district
  allUpazilaData({
    newUpaId,
    newUpaType,
    wnewUpaId,
    wnewUpaType,
  });

  let changeUpazila = (e) => {
    let data = JSON.parse(e.target.value);
    // setUpazilaId(e.target.value);
    setNewUpaId(data.upaCityId);
    setNewUpaType(data.upaCityType);
  };

  let wchangeUpazila = (e) => {
    let data = JSON.parse(e.target.value);
    setWUpazilaId(e.target.value);
    setWnewUpaId(data.upaCityId);
    setwnewUpaType(data.upaCityType);
  };

  // let chilData = childPass != undefined ? childPass.upazilaEdit : '';
  // var upazila_Id = childUpa ? childUpa : chilData;

  // var upazila_id=childPass?childPass.upazilaEdit:"";
  useEffect(() => {
    getUpazila();
  }, [selectedDis, selectedDiv, selectedWDiv, selectedWDis]);

  const getUpazila = async () => {
    try {
      if (flag) {
        if (selectedDis && selectedDiv) {
          const upazilaData = await axios.get(
            geoData + `upa-city&districtId=${selectedDis}&divisionId=${selectedDiv}`,
            config,
          );
          setResultOfUpazila(upazilaData.data.data);
        } else if (selectedDis) {
          const upazilaData = await axios.get(geoData + `upa-city&districtId=${selectedDis}`, config);
          setResultOfUpazila(upazilaData.data.data);
        }
      } else {
        if (selectedWDis && selectedWDiv) {
          const upazilaData = await axios.get(
            geoData + `upa-city&districtId=${selectedWDis}&divisionId=${selectedWDiv}`,
            config,
          );
          setResultOfWUpazila(upazilaData.data.data);
        } else if (selectedWDis) {
          const upazilaData = await axios.get(geoData + `upa-city&districtId=${selectedWDis}`, config);
          setResultOfWUpazila(upazilaData.data.data);
        }
      }
    } catch (error) { 
      // 
    }
  };
  let wupazila_Id = childWUpa ? childWUpa : '';
  // const disableText = () => {
  //   if (selectedUpazilaId !== '' && selectedUpazilaType !== '') {
  //     return true;
  //   }
  //   // if (selectedUpazilaId && selectedUpazilaNameBangla) {
  //   //   return false;
  //   // }
  // };
  return (
    <>
      {/* <Grid item md={allreplica==6?2:2.4} xs={12}> */}
      {flag ? (
        <TextField
          fullWidth
          label={RequiredFile('উপজেলা/সিটি-কর্পোরেশন')}
          name="upazila"
          onChange={changeUpazila}
          select
          SelectProps={{ native: true }}
          disabled={childUpaDefault}
          value={JSON.stringify({
            upaCityId: selectedUpazilaId,
            upaCityType: selectedUpazilaType,
          })}
          variant="outlined"
          size="small"
          sx={{ backgroundColor: '#FFF' }}
          showSearch
        >
          <option>- নির্বাচন করুন -</option>
          {resultOfUpazila.map((option) =>
            option.upaCityId != null ? (
              <option
                key={option.upaCityId}
                value={JSON.stringify({
                  upaCityId: option.upaCityId,
                  upaCityType: option.upaCityType,
                })}
              >
                {' '}
                {option.upaCityNameBangla}{' '}
              </option>
            ) : (
              ''
            ),
          )}
        </TextField>
      ) : (
        <TextField
          fullWidth
          label={RequiredFile('উপজেলা/সিটি-কর্পোরেশন')}
          name="wupazila"
          onChange={wchangeUpazila}
          disabled={selectedUpazilaId !== '' && selectedUpazilaType !== ''}
          select
          SelectProps={{ native: true }}
          value={wupazilaId ? wupazilaId : wupazila_Id}
          // value={wupazilaId?wupazilaId:wupazila_Id}
          variant="outlined"
          size="small"
          sx={{ backgroundColor: '#FFF' }}
        >
          {selectedUpazilaId && selectedUpazilaType ? (
            <option
              key={selectedUpazilaId}
              value={JSON.stringify({
                upaCityId: selectedUpazilaId,
                upaCityType: 'UPA',
              })}
            >
              {/* {selectedUpazilaNameBangla} */}
            </option>
          ) : (
            <>
              <option>- নির্বাচন করুন -</option>
              {resultOfWUpazila.map((option, index) =>
                option.upaCityId != null ? (
                  <option
                    key={index}
                    value={JSON.stringify({
                      upaCityId: option.upaCityId,
                      upaCityType: option.upaCityType,
                    })}
                  >
                    {' '}
                    {option.upaCityNameBangla}{' '}
                  </option>
                ) : (
                  ''
                ),
              )}
            </>
          )}
        </TextField>
      )}
    </>
  );
};

export default UpazilaCityCrop;
