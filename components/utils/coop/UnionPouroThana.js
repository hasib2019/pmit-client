
import { TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { geoData } from '../../../url/coop/ApiList';
import RequiredFile from '../../utils/RequiredFile';
import { errorHandler } from 'service/errorHandler';

const UnionPouroThana = (props) => {
  let token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { allUnionData } = props;
  const {
    selectedDis,
    selectedDivision,
    selectedWDis,
    selectedWDivId,
    selupazilaId,
    selupazilaType,
    wselupazilaId,
    wselupazilaType,
  } = props;
  const { flag } = props;
  const { childPass } = props;
  const [resultOfUnion, setResultOfUnion] = useState([]);
  const [resultOfWUnion, setResultOfWUnion] = useState([]);
  const [unionId, setUnionId] = useState('');
  const [wunionId, setWUnionId] = useState('');
  const [newUnionId, setNewUnionId] = useState('');
  const [newUnionType, setNewUnionType] = useState('');
  const [wnewUnionId, setWnewUnionId] = useState('');
  const [wnewUnionType, setWnewUnionType] = useState('');
  const { childWUnion } = props;
  // new district
  const { childUnion } = props;
  allUnionData({
    newUnionId,
    newUnionType,
    wnewUnionId,
    wnewUnionType,
  });

  let changeUnion = (e) => {
    let data = JSON.parse(e.target.value);
    setUnionId(e.target.value);
    setNewUnionId(data.uniThanaPawId);
    setNewUnionType(data.uniThanaPawType);
  };

  let wchangeUnion = (e) => {
    let data = JSON.parse(e.target.value);
    setWUnionId(e.target.value);
    setWnewUnionId(data.uniThanaPawId);
    setWnewUnionType(data.uniThanaPawType);
  };
  useEffect(() => {
    getUnion();
  }, [selectedDis, selupazilaId, selupazilaType, wselupazilaId, wselupazilaType, selectedWDis, selectedWDivId]);

  let getUnion = async () => {
    try {
      if (flag) {
        if (selectedDis && selupazilaId && selupazilaType) {
          let unionData = await axios.get(
            geoData +
            `uni-thana-paurasabha&districtId=${selectedDis}&upaCityId=${selupazilaId}&upaCityType=${selupazilaType}`,
            config,
          );

          setResultOfUnion(unionData.data.data);
        } else if (selectedDis) {
          let unionData = await axios.get(geoData + `uni-thana-paurasabha&districtId=${selectedDis}`, config);
          setResultOfUnion(unionData.data.data);
        } else if (selectedDivision) {
          let unionData = await axios.get(geoData + `uni-thana-paurasabha&divisionId=${selectedDivision}`, config);
          setResultOfUnion(unionData.data.data);
        }
      } else {
        if (selectedWDis && wselupazilaId && wselupazilaType) {
          let unionData = await axios.get(
            geoData +
            `uni-thana-paurasabha&districtId=${selectedWDis}&upaCityId=${wselupazilaId}&upaCityType=${wselupazilaType}`,
            config,
          );
          setResultOfWUnion(unionData.data.data);
        } else if (selectedWDivId) {
          let unionData = await axios.get(geoData + `uni-thana-paurasabha&divisionId=${selectedWDivId}`, config);
          setResultOfWUnion(unionData.data.data);
        }
        // else if(selectedWDis=='' && selectedWDivId=='')
        // {
        //     let unionData = await axios.get(
        //         geoData+'uni-thana-paurasabha',
        //         config
        //     );
        //     setResultOfWUnion(unionData.data.data);
        // }
      }
    } catch (error) { 
      errorHandler(error)
    }
  };
  let uData = childPass != undefined ? childPass.unionEdit : '';
  let wunion_Id = childWUnion ? childWUnion : '';
  var union_Id = childUnion ? childUnion : uData;

  return (
    <>
      {/* <Grid item md={allreplica==6?2:2.4} xs={12}> */}
      {flag ? (
        <TextField
          fullWidth
          label={RequiredFile('ইউনিয়ন/পৌরসভা/থানা')}
          name="uniThanaPawNameBangla"
          onChange={changeUnion}
          select
          SelectProps={{ native: true }}
          // value={unionId}
          value={unionId ? unionId : union_Id}
          variant="outlined"
          size="small"
          sx={{ backgroundColor: '#FFF' }}
        >
          <option>- নির্বাচন করুন -</option>
          {resultOfUnion.map((option) =>
            option.uniThanaPawId != null ? (
              <option
                key={option.uniThanaPawId}
                value={JSON.stringify({
                  uniThanaPawId: option.uniThanaPawId,
                  uniThanaPawType: option.uniThanaPawType,
                })}
              >
                {option.uniThanaPawNameBangla}
              </option>
            ) : (
              ''
            ),
          )}
        </TextField>
      ) : (
        <TextField
          fullWidth
          label={RequiredFile('ইউনিয়ন/পৌরসভা/থানা')}
          name="wunion"
          onChange={wchangeUnion}
          select
          SelectProps={{ native: true }}
          // value={wunionId}
          value={wunionId ? wunionId : wunion_Id}
          variant="outlined"
          size="small"
          sx={{ backgroundColor: '#FFF' }}
        >
          <option>- নির্বাচন করুন -</option>
          {resultOfWUnion.map((option) =>
            option.uniThanaPawId != null && option.uniThanaPawNameBangla != null ? (
              <option
                key={option.uniThanaPawId}
                value={JSON.stringify({
                  uniThanaPawId: option.uniThanaPawId,
                  uniThanaPawType: option.uniThanaPawType,
                })}
              >
                {option.uniThanaPawNameBangla}
              </option>
            ) : (
              ''
            ),
          )}
        </TextField>
      )}

      {/* </Grid> */}
    </>
  );
};

export default UnionPouroThana;
