import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, Paper, TextField } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { useEffect, useState } from 'react';
import { docTypeRoute } from '../../../../../url/ApiList';
import { getApi } from '../utils/getApi';

const UpdateNecessaryDoc = ({
  neccessaryDocData,
  handleNeccessaryDocData,
  handleToggle,
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
      {neccessaryDocData.map((v, i) => (
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
            <Grid
              item
              md={4}
              xs={12}
              sx={{
                '& .MuiToggleButton-root.Mui-selected': {
                  color: '#357C3C',
                  backgroundColor: '#E7FBBE',
                },
              }}
            >
              <ToggleButton
                value="check"
                fullWidth
                selected={v.isMandatory}
                onChange={(e) => handleToggle(e, i)}
                sx={{ height: '40px' }}
              >
                {v.isMandatory ? (
                  <>
                    <CheckCircleIcon /> <h3>বাধ্যতামূলক</h3>
                  </>
                ) : (
                  <>
                    <HelpIcon />
                    <h3>বাধ্যতামূলক?</h3>
                  </>
                )}
              </ToggleButton>
            </Grid>
            {/* <Grid
            item
            md={4}
            xs={12}
            sx={{
              "& .MuiToggleButton-root.Mui-selected": {
                color: "#357C3C",
                backgroundColor: "#E7FBBE",
              },
            }}

          >
            <ToggleButton
              value="check"
              fullWidth
              selected={v.isDocNoMandatory}
              onChange={(e)=>handleIsDocNoMandatoryToogle(e,i)}
              sx={{ height: "40px" }}
            >
              {v.isDocNoMandatory ? (
                <>
                  <CheckCircleIcon /> <h3>ডকুমেন্ট নম্বর বাধ্যতামূলক</h3>
                </>
              ) : (
                <>
                  <HelpIcon />
                  <h3>ডকুমেন্ট নম্বর বাধ্যতামূলক?</h3>
                </>
              )}
            </ToggleButton>
          </Grid> */}
            {/* {v.isDocNoMandatory ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="ডকুমেন্ট নম্বরের সংখ্যা"
                  placeholder='ডকুমেন্ট নম্বর সংখ্যা একাধিক হলে কমা ব্যবহার করুন'
                  name="docNoLength"
                  onChange={(e)=>handleNeccessaryDocData(e,i)}
                  id="number"
                  value={v.docNoLength}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              ):""} */}

            {i >= prevNeccessaryDocData.length && (
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
