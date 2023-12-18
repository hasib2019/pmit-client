import AddIcons from '@mui/icons-material/Add';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material';
import star from 'components/mainSections/loan-management/loan-application/utils';
import SubHeading from 'components/shared/others/SubHeading';

const DynamicNomineeList = ({
  nomineeInfoList,
  docTypeData,
  handleAddNomineeList,
  handleNominiList,
  deleteNomineeList,
}) => {
  return (
    <Box width="100%">
      <SubHeading>
        <span> নমিনীর ডকুমেন্ট সংক্রান্ত তথ্য </span>
        <Button className="btn btn-primary" variant="contained" onClick={handleAddNomineeList} size="small">
          <AddIcons sx={{ display: 'block' }} /> যুক্ত করুন
        </Button>
      </SubHeading>
      <Grid container gap={2.5}>
        {nomineeInfoList.map((x, i) => {
          return (
            <>
              <Box key={i} width="100%">
                <Grid container spacing={2.5} key={i + 1} alignItems="center">
                  <Grid item>
                    <TextField
                      fullWidth
                      label={star('ডকুমেন্ট এর ধরন')}
                      name="docTypeId"
                      onChange={(e) => handleNominiList(e, i)}
                      select
                      SelectProps={{ native: true }}
                      value={x.docTypeId ? x.docTypeId : ' '}
                      variant="outlined"
                      size="small"
                    >
                      <option value={'নির্বাচন করুন'}>- নির্বাচন করুন -</option>
                      {docTypeData.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.docTypeDesc}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item>
                    <FormControl>
                      <RadioGroup
                        aria-label=""
                        name="docRadio"
                        row
                        display="flex"
                        value={x.docRadio}
                        onChange={(e) => {
                          handleNominiList(e, i);
                        }}
                      >
                        <FormControlLabel value="docM" control={<Radio />} label="বাধ্যতামূলক" />
                        <FormControlLabel value="docOpt" control={<Radio />} label="ঐচ্ছিক" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    {nomineeInfoList.length > 1 && (
                      <Button
                        variant="outlined"
                        aria-label="add"
                        color="error"
                        size="small"
                        onClick={(e) => deleteNomineeList(e, i)}
                      >
                        বাতিল করুন
                      </Button>
                    )}
                  </Grid>
                  {/* {
                      x["numMandatory"] && <Grid item lg={5} md={5} xs={12}>
                      <Tooltip title="ডকুমেন্ট নম্বর সংখ্যা একাধিক হলে কমা ব্যবহার করুন">
                      <TextField
                        fullWidth
                        label={star("ডকুমেন্ট নম্বরের সংখ্যা")}
                        placeholder='ডকুমেন্ট নম্বর সংখ্যা একাধিক হলে কমা ব্যবহার করুন'
                        name="docNoLength"
                        type="text"
                        value={x.docNoLength ? x.docNoLength :" "}
                        onChange={(e) => handleNominiList(e, i)}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      </Tooltip>
                    </Grid>
                    }
                    
                    <Grid item >
                      <FormControl >
                        <RadioGroup
                          aria-label=""
                          name="numberRadio"
                          row
                          display="flex"
                        value={x.numberRadio}
                          onChange={(e)=>{handleNominiList(e,i)}}
                        >
                          <FormControlLabel
                            value="numM"
                            control={<Radio />}
                            label="ডকুমেন্ট নম্বর সংখ্যা বাধ্যতামূলক"
                          />
                          <FormControlLabel
                            value="numOpt"
                            control={<Radio />}
                            label="ডকুমেন্ট নম্বর সংখ্যা ঐচ্ছিক"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid> */}
                </Grid>
              </Box>
            </>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DynamicNomineeList;
