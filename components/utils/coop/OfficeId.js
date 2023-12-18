
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getOfficeName } from '../../../url/coop/ApiList';

import { TextField } from '@mui/material';
import { localStorageData } from 'service/common';
import RequiredFile from '../../utils/RequiredFile';

const OfficeId = (props) => {
  const token = localStorageData('token');
  const config = localStorageData('config', token);
  const { allOfficeData } = props;
  const { selectedDis, selectedDiv, selectOfficeId } = props;
  const [resultOfficeData, setResultOfficeData] = useState([]);
  const [officeId, setOfficeId] = useState('');
  const { childDisDefault } = props;
  // new district
  allOfficeData({
    officeId,
  });

  let changeOfficeID = (e) => {
    setOfficeId(e.target.value);
  };

  //   var upazila_Id = childUpa ? childUpa : "";
  //   var upazila_id = childPass ? childPass.officeId : "";
  useEffect(() => {
    getOfficeAllData();
    setOfficeId(selectOfficeId);
  }, [selectedDis, selectedDiv, selectOfficeId]);

  let getOfficeAllData = async () => {
    try {
      if (selectedDiv != 0 && selectedDis != 0) {
        const OfficeAllData = await axios.get(
          getOfficeName + `?districtId=${selectedDis}&divisionId=${selectedDiv}&layerId=6&isPagination=false`,
          config,
        );
        setResultOfficeData(OfficeAllData.data.data);
      } else if (selectedDiv != 0 || selectedDis != 0) {
        setResultOfficeData([]);
      } else {
        setResultOfficeData([]);
      }
    } catch (error) {
      //
    }
  };

  return (
    <>
      {/* <Grid item md={allreplica==6?2:2.4} xs={12}> */}
      <TextField
        disabled={childDisDefault}
        fullWidth
        label={RequiredFile('অফিসের নাম')}
        name="upazila"
        onChange={changeOfficeID}
        // required
        select
        SelectProps={{ native: true }}
        value={officeId || 0}
        variant="outlined"
        size="small"
        sx={{ backgroundColor: '#FFF' }}
      >
        <option value={0}>- নির্বাচন করুন -</option>
        {resultOfficeData?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nameBn}
          </option>
        ))}
      </TextField>

      {/* </Grid> */}
    </>
  );
};

export default OfficeId;
