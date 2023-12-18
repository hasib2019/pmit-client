import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { localStorageData, tokenData } from 'service/common';
import SamityRegCoop from './SamityRegFromCoop';
import SamityRegFromMilkvita from './SamityRegFromMilkvita';
import SamityRegNormal from './SamityRegFromNormal';
import SamityRegServey from './SamityRegFromServey';

const Registration = () => {
  const router = useRouter();
  const [samityLable, setSamityLable] = useState('');
  const token = localStorageData('token');
  const userData = tokenData(token);
  let doptorId = userData.doptorId;
  // if (typeof window !== "undefined") {
  //     doptorId = localStorage.getItem("doptorId");
  // }
  const handleChange = (e) => {
    setSamityLable(e.target.value);
  };
  useEffect(() => {
    if (router.query.data) {
      let base64ConvertedData = atob(router.query.data);
      let result = JSON.parse(base64ConvertedData);
      setSamityLable(result.samityLable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Grid container className="section">
        <Grid item>
          <Grid item>
            <FormControl component="fieldset">
              <RadioGroup name="samityLevel" value={samityLable} onChange={handleChange}>
                {doptorId == 3 && <FormControlLabel value="1" control={<Radio />} label="নিবন্ধিত সমবায় সমিতি" />}
                {doptorId == 10 && <FormControlLabel value="2" control={<Radio />} label="মিল্কভিটা সমিতি" />}
                {doptorId != 10 && doptorId != 3 && (
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="সার্ভের মাধ্যমে আগত সমিতি/সংঘ/দল অন্তরভুক্তি"
                  />
                )}
                {doptorId != 10 && doptorId != 3 && (
                  <FormControlLabel value="4" control={<Radio />} label="ম্যানুয়াল সমিতি/সংঘ/দল অন্তরভুক্তি" />
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      {samityLable == 1 ? <SamityRegCoop /> : ''}
      {samityLable == 2 ? <SamityRegFromMilkvita /> : ''}
      {samityLable == 3 ? <SamityRegServey /> : ''}
      {samityLable == 4 ? <SamityRegNormal /> : ''}
    </>
  );
};

export default Registration;
