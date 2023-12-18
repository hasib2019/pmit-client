/* eslint-disable no-unused-vars */

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import HelpIcon from '@mui/icons-material/Help';
import { Button, Grid, Paper, TextField, Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { docTypeRoute } from '../../../../../../url/ApiList';
import { myValidate } from '../../../../samity-managment/member-registration/validator';
import { getApi } from '../../utils/getApi';

const NecessaryDocumentReusable = (
  { idx, childData, forEdit, proName, onDeleteData, tempComponent, setDataForEdit, setAllChildData, setTempComponent },
  ref,
) => {
  const [allDocList, setAllDocList] = useState([]);
  const [necessaryDoc, setNecessaryDoc] = useState({
    docName: '',
    mendatory: false,
  });
  useEffect(() => {
    getDocList();
  }, []);

  useEffect(() => {
    childData(necessaryDoc, idx);
  }, [necessaryDoc]);

  useEffect(() => {
    setNecessaryDoc({
      docName: forEdit[0] ? forEdit[0].docName : '',
      mendatory: forEdit[0] ? forEdit[0].mendatory : false,
    });
  }, [forEdit[0]]);

  const getDocList = async () => {
    const docList = await getApi(docTypeRoute, 'get');

    setAllDocList(docList?.data?.data ? docList?.data?.data : []);
  };
  useImperativeHandle(ref, () => ({
    updateProState: updateProState,
  }));
  const updateProState = () => {
    setNecessaryDoc({
      docName: '',
      mendatory: false,
    });
    setTempComponent([]);
    setDataForEdit([]);
  };
  const handleChange = (e) => {
    const { name, value, id } = e.target;
    let resultObj;
    if (name == 'docNoLength') {
      resultObj = myValidate('docLengthVal', value);
      if (resultObj?.status) {
        return;
      }
      setNecessaryDoc({
        ...necessaryDoc,
        [name]: resultObj?.value,
      });
      return;
    }
    setNecessaryDoc({
      ...necessaryDoc,
      [name]: value,
    });
  };
  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  const { productName, docName, mendatory, nextAppDesId, isDocNoMandatory, docNoLength } = necessaryDoc;
  return (
    <>
      <Paper
        sx={{
          p: '20px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          mb: '20px',
        }}
      >
        <Grid container spacing={2.5} className="section">
          {tempComponent && tempComponent.length > 1 && (
            <Grid item md={12} xs={12} sx={{ textAlign: 'right' }}>
              <Tooltip title={'সার্ভিস চার্জ বাদ দিন' + idx}>
                <Button variant="contained" color="error" onClick={onDeleteData} size="small">
                  <ClearIcon />
                </Button>
              </Tooltip>
            </Grid>
          )}

          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              disabled
              id="standard-disabled"
              label={star('প্রোডাক্টের নাম')}
              defaultValue={proName}
              variant="standard"
            />
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              id="projectName"
              fullWidth
              label={star('ডকুমেন্টের ধরণ')}
              name="docName"
              select
              SelectProps={{ native: true }}
              value={docName ? docName : ' '}
              onChange={handleChange}
              disabled=""
              variant="outlined"
              size="small"
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
              selected={mendatory}
              onChange={() => {
                setNecessaryDoc({
                  ...necessaryDoc,
                  mendatory: !mendatory,
                });
              }}
              sx={{ height: '40px' }}
            >
              {mendatory ? (
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
              selected={isDocNoMandatory}
              onChange={() => {
                setNecessaryDoc({
                  ...necessaryDoc,
                  isDocNoMandatory: !isDocNoMandatory
                });
              }}
              sx={{ height: "40px" }}
            >
              {isDocNoMandatory ? (
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
          {/* {isDocNoMandatory ? (
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="ডকুমেন্ট নম্বরের সংখ্যা"
                  placeholder='ডকুমেন্ট নম্বর সংখ্যা একাধিক হলে কমা ব্যবহার করুন'
                  name="docNoLength"
                  onChange={handleChange}
                  id="number"
                  value={docNoLength}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              ):""} */}
        </Grid>
      </Paper>
    </>
  );
};
const NecessaryDocument = forwardRef(NecessaryDocumentReusable);
export default NecessaryDocument;
