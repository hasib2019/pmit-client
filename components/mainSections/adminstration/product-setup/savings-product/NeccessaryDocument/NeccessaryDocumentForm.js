import ClearIcon from '@mui/icons-material/Clear';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import star from 'components/utils/coop/star';
import { FieldArray, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { docTypeRoute } from '../../../../../../url/ApiList';
import { getApi } from '../../utils/getApi';

const NeccessaryDocumentForm = () => {

  const [allDocList, setAllDocList] = useState([]);
  const { specificProductInfo } = useSelector((state) => state.savingsProduct);
  const productName = specificProductInfo?.productMaster?.productName;
  const { values,handleChange, setFieldValue, handleBlur, touched, errors } = useFormikContext();
  const { status, docType } = values;
  const { docArray } = values;
  const ownHandleChange = (e, index, name) => {
    const { value } = e.target;
    const docArrayCopy = [...docArray];
    if (name == 'docType') {
      const targetObj = allDocList.map((docType) => docType.id == value);
      docArrayCopy[index]['docTypeDesc'] = targetObj.docTypeDesc;
    }
    docArrayCopy[index][name] = value;
    setFieldValue('docArray', docArrayCopy);
  };
  const getDocList = async () => {
    const docList = await getApi(docTypeRoute, 'get');

    setAllDocList(docList?.data?.data ? docList?.data?.data : []);
  };
  useEffect(() => {
    getDocList();
  }, []);
  return (
    <>
      <FieldArray name="docArray">
        {(arrayHelpers) =>
          docArray.length > 0 &&
          docArray.map((item, index) => {
            return (
              <Grid container spacing={2} className="section" key={index}>
                {docArray && docArray.length > 1 && (
                  <Grid item md={12} xs={12} sx={{ textAlign: 'right' }}>
                    <Tooltip title="প্রয়োজনীয় ডকুমেন্ট বাদ দিন">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}
                        size="small"
                      >
                        <ClearIcon />
                      </Button>
                    </Tooltip>
                  </Grid>
                )}
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="প্রোডাক্টের নাম"
                    id="productName"
                    name="productName"
                    disabled
                    value={productName}
                    variant="outlined"
                    size="small"
                  ></TextField>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      {docType == '' ? star('ডকুমেন্টের ধরন নির্বাচন করুন') : star('ডকুমেন্টের ধরন')}
                    </InputLabel>
                    <Select
                      name="docType"
                      id="demo-simple-select"
                      value={docType}
                      label={docType == '' ? star('ডকুমেন্টের ধরন নির্বাচন করুন') : star('ডকুমেন্টের ধরন')}
                      onChange={(e) => ownHandleChange(e, index, 'docType')}
                      onBlur={handleBlur}
                      size="small"
                      sx={{
                        '& .MuiSelect-select': {
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {allDocList.map((option) => (
                        <MenuItem value={option.id} key={option.id}>
                          {option.docTypeDesc}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText
                    error={Boolean(
                      touched.docType
                        ? errors?.docArray && errors.docArray[index]?.docType
                        : touched.docArray &&
                        errors.docArray &&
                        touched.docArray[index]?.docType &&
                        errors.docArray[index]?.docType,
                    )}
                  >
                    {touched.docType
                      ? errors?.docArray && errors.docArray[index]?.docType
                      : touched.docArray &&
                      errors.docArray &&
                      touched.docArray[index]?.docType &&
                      errors.docArray[index]?.docType}
                  </FormHelperText>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl component="fieldset" variant="standard">
                    <FormControlLabel
                      control={<Switch checked={status} onChange={handleChange} name={`docArray[${index}].status`} />}
                      label="বাধ্যতামূলক?"
                      labelPlacement="start"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            );
          })
        }
      </FieldArray>
    </>
  );
};

export default NeccessaryDocumentForm;
