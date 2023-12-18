/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/03/01 10:13:48
 * @modify date 2022-03-01 10:13:48
 * @desc [description]
 */
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material/';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { localStorageData } from 'service/common';
import { CoopRegApi } from '../../../../../url/coop/ApiList';

function PendingCoop(props) {
  const router = useRouter();
  const config = localStorageData('config');
  const stepId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('stepId')) : null;

  const { pendingCoopData } = props;
  const [coopData, setCoopData] = useState(0);
  const [show, setShow] = useState();

  const handleChange = (e) => {
    setShow(e.target.value);
    if (e.target.value == 1) {
      localStorage.setItem('stepId', JSON.stringify(0));
      localStorage.removeItem('storeId');
      localStorage.removeItem('storeName');
      localStorage.removeItem('samityLevel');
      window.location.reload();
    }
  };

  const handleChangeCoop = (e) => {
    const pendingData = JSON.parse(e.target.value);
    const lastStep = pendingData.lastStep;
    const samityId = pendingData.samityId;
    const url = pendingData.url;
    const samityName = pendingData.samityName;
    setCoopData(e.target.value);
    localStorage.setItem('stepId', JSON.stringify(lastStep));
    localStorage.setItem('storeId', JSON.stringify(samityId));
    localStorage.setItem('storeName', JSON.stringify(samityName));
    samityDataByID(samityId, url);
  };
  const samityDataByID = async (id, url) => {
    if (id) {
      const showSamityInfo = await axios.get(CoopRegApi + '/' + id, config);
      const samityLevel = showSamityInfo.data.data.Samity[0].samityLevel;
      localStorage.setItem('samityLevel', JSON.stringify(samityLevel));
      router.push({ pathname: url });
    }
  };

  return (
    <>
      <Grid item xs={12} mt={1}>
        <Grid container className="section" spacing={2.5}>
          <Grid item sx={12} md={4}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="nwl"
                name="samityLevel"
                onChange={handleChange}
                defaultValue={stepId == 0 ? 1 : ''}
              >
                <FormControlLabel
                  value="1"
                  sx={{ color: '#007bff' }}
                  control={<Radio color="primary" />}
                  label="নতুন আবেদন"
                />
                <FormControlLabel
                  sx={{ color: '#9500ae' }}
                  value="2"
                  control={<Radio color="secondary" />}
                  label="অসম্পূর্ণ আবেদন"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {show == 2 && (
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="অসম্পূর্ণ আবেদনের তালিকা"
                name="projectId"
                onChange={handleChangeCoop}
                required
                select
                SelectProps={{ native: true }}
                value={coopData}
                variant="outlined"
                size="small"
              >
                <option value={0}>- নির্বাচন করুন -</option>
                {pendingCoopData.map((row, i) => (
                  <option
                    key={i}
                    value={JSON.stringify({
                      lastStep: row.regStepsData.lastStep,
                      samityId: row.regStepsData.samityId,
                      url: row.regStepsData.url,
                      samityName: row.regStepsData.samityName,
                    })}
                  >
                    {row.regStepsData ? row.regStepsData.samityName : ''}
                  </option>
                ))}
              </TextField>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default PendingCoop;
