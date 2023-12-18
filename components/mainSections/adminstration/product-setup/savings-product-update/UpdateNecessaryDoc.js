import { Button, FormControl, FormControlLabel, Grid, Paper, Switch, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { docTypeRoute } from '../../../../../url/ApiList';
import { getApi } from '../utils/getApi';

const UpdateNecessaryDoc = ({
  neccessaryDocData,
  handleNeccessaryDocData,
  deleteNeccessaryDocData,
  prevNeccessaryDocData,
}) => {
  const [allDocList, setAllDocList] = useState([]);
  useEffect(() => {
    getDocList();
  }, []);

  const getDocList = async () => {
    const docList = await getApi(docTypeRoute, 'get');
    setAllDocList(docList.data.data ? docList.data.data : []);
  };

  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  return (
    <>
      {neccessaryDocData?.map((v, i) => (
        <Paper
          sx={{
            padding: '30px 20px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginBottom: '10px',
          }}
          key={i}
        >
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <TextField
                id="projectName"
                fullWidth
                label={star('ডকুমেন্টের ধরণ')}
                name="docTypeId"
                select
                SelectProps={{ native: true }}
                value={v.docTypeId || ' '}
                onChange={(e) => handleNeccessaryDocData(e, i)}
                disabled=""
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#FFF' }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {allDocList.map((option, idx) => (
                  <option key={idx} value={option.id}>
                    {option.docTypeDesc}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl component="fieldset" variant="standard">
                <FormControlLabel
                  control={
                    <Switch
                      checked={v.isMandatory}
                      onChange={(e) => handleNeccessaryDocData(e, i)}
                      name="isMandatory"
                    />
                  }
                  label="বাধ্যতামূলক?"
                  labelPlacement="start"
                />
              </FormControl>
            </Grid>
            {i < prevNeccessaryDocData?.length && (
              <Grid item md={4} xs={12}>
                <FormControl component="fieldset" variant="standard">
                  <FormControlLabel
                    control={
                      <Switch checked={v.isActive} onChange={(e) => handleNeccessaryDocData(e, i)} name="isActive" />
                    }
                    label="সক্রিয়?"
                    labelPlacement="start"
                  />
                </FormControl>
              </Grid>
            )}

            {i >= prevNeccessaryDocData?.length && (
              <Grid item md={4} xs={12}>
                <Button variant="contained" className="buttonCancel" onClick={(e) => deleteNeccessaryDocData(e, i)}>
                  বাতিল করুন
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
    </>
  );
};

export default UpdateNecessaryDoc;
