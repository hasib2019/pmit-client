import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

export default function Feepayment() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ m: 1 }}>
        <Grid item xs={4}>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-select-small-label">ফি এর ধরন</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>

        <Grid item xs={4}>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-select-small-label">সমিতির নাম</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>

        <Grid item xs={4}>
          <h3>
            <b>নিবন্ধন নাম্বারঃ</b> ১০২৩.১.০১.২০২৪.০০০১
          </h3>
        </Grid>
        <Grid item xs={6}>
          <h3>
            <b>নিবন্ধনের তারিখ</b> ১২/০১/২০২৩
          </h3>
        </Grid>

        <Grid item xs={6}>
          <h3>
            <b>ঠিকানাঃ </b> পল্টন
          </h3>
        </Grid>

        <Grid item xs={3}>
          <h3>
            <b> অর্থ বছরঃ </b> ২০২-২০২৩
          </h3>
        </Grid>

        <Grid item xs={3}>
          <h3>
            <b>আয়ঃ </b> ২০০০০০ টাকা
          </h3>
        </Grid>

        <Grid item xs={3}>
          <h3>
            <b> ব্যয়ঃ </b> ১০০০০০ টাকা
          </h3>
        </Grid>

        <Grid item xs={3}>
          <h3>
            <b> লাভঃ </b> ১০০০০০০ টাকা
          </h3>
        </Grid>

        <Grid item xs={3}>
          <h3>
            <b> নিরীক্ষা ফিঃ </b> ১০০০০ টাকা
          </h3>
        </Grid>

        <Grid item xs={9}>
          <h6 style={{ fontSize: '10px' }}>
            (নোটঃ লাভের ১০% প্রাথমিক হলে সর্বোচ্চ ১০,০০০ টাকা, কেন্দ্রিয়/জাতীয় হলে সর্বোচ্চ ৩০.০০০ টাকা )
          </h6>
        </Grid>

        <Grid item xs={12}>
          <h6>
            ১। অনলাইনেঃ একপে এর মাধ্যমে (VISA , MASTER CARD, AMERICAN EXPRESS, bKASH, Nagad, Rocket, Upay, Dmoney, OK
            Wallet, Bank Asia, Brack Bank, EBL, City Bank, UCB, AB Bank, DBBL, Midland Bank, MBL, Rainbow) অনলাইনে ফী
            প্রদান করা যাবে।
          </h6>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Button>
            <u>ফী প্রদান করতে ক্লিক করুন</u>
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
