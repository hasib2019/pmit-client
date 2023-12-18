import AddIcons from '@mui/icons-material/Add';
import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SubHeading from '../../../../shared/others/SubHeading';
import star from '../utils';

const JamindarSection = ({
  handleAddGrantorInfo,
  grantorInfo,
  occupationList,
  relationList,
  handleGrantorInfo,
  handleDateChangeEx,
  deleteGrantorInfo,
  formErrors,
  grantorDisabled,
  disableGrantorAdd,
}) => {
  return (
    <>
      <Grid className="section">
        <Grid container spacing={2.5}>
          <Grid item sm={12} md={12} xs={12}>
            <SubHeading>
              <span>জামিনদার এবং সাক্ষীর তথ্য</span>
              <Button
                className="btn btn-primary"
                variant="contained"
                onClick={handleAddGrantorInfo}
                size="small"
                disabled={disableGrantorAdd}
              >
                <AddIcons sx={{ display: 'block' }} /> জামিনদার/সাক্ষী যোগ করুন
              </Button>
            </SubHeading>
            <Grid>
              <Grid>
                {grantorInfo?.length >= 1 &&
                  grantorInfo.map((x, i) => {
                    return (
                      <Grid key={i + 1}>
                        <Grid container>
                          <Grid>
                            <Grid container spacing={2.5}>
                              <Grid item md={5} xs={12} className="radioInputContainer">
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    row
                                    name="grantorOrWitness"
                                    required
                                    value={x.grantorOrWitness}
                                    onChange={(e) => handleGrantorInfo(e, i)}
                                    className="radioInput"
                                  >
                                    <span className="radioLabel">{star('জামিনদারের/সাক্ষীর ধরণ:')}</span>
                                    <FormControlLabel value="J" control={<Radio />} label="জামিনদার" />
                                    <FormControlLabel value="S" control={<Radio />} label="সাক্ষী " />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} className="radioInputContainer">
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    row
                                    name="personType"
                                    required
                                    value={x.personType}
                                    onChange={(e) => handleGrantorInfo(e, i)}
                                    className="radioInput"
                                  >
                                    <span className="radioLabel">{star('সমিতির সদস্য?:')}</span>
                                    <FormControlLabel value="M" control={<Radio />} label="হ্যাঁ" />
                                    <FormControlLabel value="N" control={<Radio />} label="না" />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12}>
                                {x['personType'] == 'M' ? (
                                  <Grid>
                                    <TextField
                                      fullWidth
                                      label={star('সদস্যের নাম')}
                                      id="memberName"
                                      name="personName"
                                      onChange={(e) => handleGrantorInfo(e, i)}
                                      select
                                      SelectProps={{ native: true }}
                                      variant="outlined"
                                      size="small"
                                      value={x.personName ? x.personName : ' '}
                                    // disabled={grantorDisabled[i].disableGrantor}
                                    >
                                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                                      {x['personInfo']
                                        ? x['personInfo'].map((option) => (
                                          <option key={option.id} value={option.id}>
                                            {option.nameBn}
                                          </option>
                                        ))
                                        : ''}
                                    </TextField>
                                  </Grid>
                                ) : (
                                  ''
                                )}
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                <TextField
                                  fullWidth
                                  id="number"
                                  label={star('জাতীয় পরিচয়পত্র নম্বর (ইংরেজি)')}
                                  name="nidNumber"
                                  value={x.nidNumber}
                                  innerHTML="nidNumber"
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  disabled={grantorDisabled[i].disableGrantor}
                                ></TextField>
                                {x.nidNumber && <span style={{ color: 'red' }}>{formErrors[i]?.nidNumber}</span>}
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    label={star('জন্ম তারিখ (ইংরেজি)')}
                                    name="birthDate"
                                    value={x.birthDate}
                                    disabled={grantorDisabled[i].disableGrantor}
                                    maxDate={new Date()}
                                    onChange={(e) => handleDateChangeEx(e, i)}
                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                  />
                                </LocalizationProvider>
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                <TextField
                                  fullWidth
                                  label={star('নাম')}
                                  name="grantorName"
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  SelectProps={{ native: true }}
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  value={x.grantorName}
                                  disabled={grantorDisabled[i].disableGrantor}
                                ></TextField>
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                <TextField
                                  fullWidth
                                  label={star('পিতার নাম')}
                                  name="fatherName"
                                  value={x.fatherName}
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  disabled={grantorDisabled[i].disableGrantor}
                                ></TextField>
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                <TextField
                                  fullWidth
                                  label={star('মাতার নাম')}
                                  name="motherName"
                                  value={x.motherName}
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  disabled={grantorDisabled[i].disableGrantor}
                                ></TextField>
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                <TextField
                                  fullWidth
                                  id="number"
                                  label={star(' মোবাইল নম্বর (ইংরেজি)')}
                                  name="mobile"
                                  value={x.mobile}
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  disabled={grantorDisabled[i].disableGrantor}
                                ></TextField>
                                {x.mobile && <span style={{ color: 'red' }}>{formErrors[i]?.mobile}</span>}
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                {' '}
                                <TextField
                                  fullWidth
                                  label={star('পেশা')}
                                  name="occupation"
                                  select
                                  value={x.occupation ? x.occupation : ' '}
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  type="text"
                                  SelectProps={{ native: true }}
                                  variant="outlined"
                                  size="small"
                                  disabled={grantorDisabled[i].disableGrantor}
                                >
                                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                                  {occupationList.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.displayValue}
                                    </option>
                                  ))}
                                </TextField>
                              </Grid>
                              {x ? (
                                x.personType == 'M' ? (
                                  ''
                                ) : (
                                  <Grid item md={2.4} xs={12}>
                                    <TextField
                                      fullWidth
                                      label={star('সম্পর্ক')}
                                      name="relation"
                                      select
                                      value={x.relation ? x.relation : ' '}
                                      onChange={(e) => handleGrantorInfo(e, i)}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      SelectProps={{ native: true }}
                                      disabled={grantorDisabled[i].disableGrantor}
                                    >
                                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                                      {relationList.map((option) => (
                                        <option key={option.id} value={option.id}>
                                          {option.displayValue}
                                        </option>
                                      ))}
                                    </TextField>
                                  </Grid>
                                )
                              ) : (
                                ''
                              )}

                              <Grid item md={2.4} xs={12}>
                                <TextField
                                  fullWidth
                                  label={star('বর্তমান ঠিকানা')}
                                  name="preAddress"
                                  value={x.preAddress}
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  disabled={grantorDisabled[i].disableGrantor}
                                ></TextField>
                              </Grid>
                              <Grid item md={2.4} xs={12}>
                                <TextField
                                  fullWidth
                                  label={star('স্থায়ী  ঠিকানা')}
                                  name="perAddress"
                                  value={x.perAddress}
                                  onChange={(e) => handleGrantorInfo(e, i)}
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  disabled={grantorDisabled[i].disableGrantor}
                                ></TextField>
                              </Grid>
                            </Grid>

                            {grantorInfo.length > 1 && (
                              <Grid
                                container
                                className="btn-container"
                                sx={{ justifyContent: 'flex-start !important' }}
                              >
                                <Button
                                  // sx={{margin:"unset"}}
                                  variant="contained"
                                  className="btn-delete"
                                  onClick={(e) => deleteGrantorInfo(e, i)}
                                >
                                  বাতিল করুন
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default JamindarSection;
