import { FormControl, FormControlLabel, Grid, Switch, TextField } from '@mui/material';

import star from 'components/utils/coop/star';
import { FieldArray, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { bangToEng, engToBang, myValidate } from '../validator';

const InstallmentSetupForm = () => {
  const { specificProductInfo } = useSelector((state) => state.savingsProduct);
  const productName = specificProductInfo?.productMaster?.productName;
  const { values, handleChange, setFieldValue, handleBlur, errors, touched } = useFormikContext();
  const { installmentArray } = values;
  const ownHandleChange = (e, index, name) => {
    let { value, id } = e.target;
    const installmentArrayCopy = [...installmentArray];
    const token = 'number';

    if (id.toLowerCase().includes(token)) {
      let resultObj;
      value = bangToEng(value);

      if (id == 'numberWithCharge') {
        if (value.length == 1 && value == 0) return;
        resultObj = myValidate('chargeNumber', value);
        if (resultObj?.status) {
          return;
        }
      }
      installmentArray[index][name] = resultObj?.value;

      setFieldValue('productProfitArray', installmentArrayCopy);
      return;
    }

    installmentArrayCopy[index][name] = value;
    setFieldValue('installmentArray', installmentArrayCopy);
  };
  return (
    <>
      <FieldArray name="installmentArray">
        {() =>
          installmentArray.length > 0 &&
          installmentArray.map((item, index) => {
            return (
              <Grid key={index} container spacing={2} className="section">
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
                  <TextField
                    fullWidth
                    label={star('কিস্তির পরিমাণ')}
                    name="installmentAmount"
                    id="numberWithCharge"
                    onChange={(e) => ownHandleChange(e, index, 'installmentAmount')}
                    value={engToBang(item?.installmentAmount)}
                    variant="outlined"
                    onBlur={handleBlur}
                    size="small"
                    error={Boolean(
                      touched.installmentAmount
                        ? errors?.installmentArray && errors.installmentArray[index]?.installmentAmount
                        : touched.installmentArray &&
                        errors.installmentArray &&
                        touched.installmentArray[index]?.installmentAmount &&
                        errors.installmentArray[index]?.installmentAmount,
                    )}
                    helperText={
                      touched.installmentAmount
                        ? errors?.installmentArray && errors.installmentArray[index]?.installmentAmount
                        : touched.installmentArray &&
                        errors.installmentArray &&
                        touched.installmentArray[index]?.installmentAmount &&
                        errors.installmentArray[index]?.installmentAmount
                    }
                  ></TextField>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl component="fieldset" variant="standard">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={item?.status}
                          onChange={handleChange}
                          name={`installmentArray[${index}].status`}
                        />
                      }
                      label="স্ট্যাটাস?"
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

export default InstallmentSetupForm;
