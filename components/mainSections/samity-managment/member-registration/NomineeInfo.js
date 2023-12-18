import AddIcons from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, CardMedia, Grid, Stack, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SubHeading from '../../../shared/others/SubHeading';
import star from '../../loan-management/loan-application/utils';
import { engToBang } from './validator';

const NomineeInfo = ({
  handleAddFNominiList,
  handleNominiList,
  nominiList,
  documentTypeList,
  guardianRelationList,
  Input,
  handleImage,
  flagForImage,
  handleSign,
  removeNomineeImage,
  removeNomineeSign,
  deleteNomineeInfo,
  handleNominiDate,
  nominiError,
}) => {
  // const imageType = (imageName) => {
  //   if (imageName) {
  //     const lastWord = imageName.split('.').pop();
  //     return lastWord;
  //   }
  // };
  return (
    <>
      <Grid container>
        <SubHeading>
          <span>নমিনীর তথ্য </span>
          {/* <span
          // className='btn btn-primary'
          // variant="contained"
          // onClick={handleAddFNominiList}
          // size="small"
          >
            সাধারন সঞ্চয় এর নমীনি একই কিনা?
          </span> */}
          <Button className="btn btn-primary" variant="contained" onClick={handleAddFNominiList} size="small">
            <AddIcons sx={{ display: 'block' }} /> নমিনী যোগ করুন
          </Button>
        </SubHeading>
        {nominiList.length >= 1 &&
          nominiList.map((x, i) => {
            return (
              <Grid container spacing={2.5} key={i + 1} mb={4}>
                <Grid item lg={7} md={6}>
                  <Grid container spacing={2.5}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label={star('নমিনীর নাম')}
                        name="nomineeName"
                        type="text"
                        value={x.nomineeName}
                        onChange={(e) => handleNominiList(e, i)}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {!x.nomineeName && (
                        <span style={{ color: 'var(--color-error)' }}>{nominiError[i]?.nomineeName}</span>
                      )}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label={star('জন্ম তারিখ(ইংরেজি)')}
                          name="birthDate"
                          inputFormat="dd/MM/yyyy"
                          value={x.birthDate}
                          onChange={(e) => handleNominiDate(e, i)}
                          maxDate={new Date()}
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                      {!x.birthDate && (
                        <span style={{ color: 'var(--color-error)' }}>{nominiError[i]?.birthDate}</span>
                      )}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label={star('সম্পর্ক')}
                        name="relation"
                        onChange={(e) => handleNominiList(e, i)}
                        value={x.relation ? x.relation : ' '}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined"
                        size="small"
                      >
                        <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                        {guardianRelationList
                          ? guardianRelationList.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.displayValue}
                            </option>
                          ))
                          : ''}
                      </TextField>
                      {(x.relation == 'নির্বাচন করুন' || !x.relation) && (
                        <span style={{ color: 'red' }}>{nominiError[i]?.relation}</span>
                      )}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        name="percentage"
                        label={star('শতকরা হার (%)')}
                        value={engToBang(x.percentage)}
                        onChange={(e) => handleNominiList(e, i)}
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {!x.nomineeName && <span style={{ color: 'red' }}>{nominiError[i]?.nomineeName}</span>}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label={star('ডকুমেন্টের ধরন')}
                        name="docType"
                        onChange={(e) => handleNominiList(e, i)}
                        select
                        SelectProps={{ native: true }}
                        type="text"
                        variant="outlined"
                        size="small"
                        value={x.docType ? x.docType : ' '}
                      >
                        <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                        {documentTypeList && documentTypeList.length >= 1
                          ? documentTypeList?.map((option) => (
                            <option key={option.id} value={option.docType}>
                              {option.docTypeDesc}
                            </option>
                          ))
                          : ''}
                      </TextField>
                      {!x.docType && <span style={{ color: 'red' }}>{nominiError[i]?.docType}</span>}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="ডকুমেন্টের নম্বর"
                        name="docNumber"
                        value={engToBang(x.docNumber)}
                        onChange={(e) => handleNominiList(e, i)}
                        type="text"
                        variant="outlined"
                        size="small"
                      ></TextField>
                      {<span style={{ color: 'red' }}>{nominiError[i]?.docNumber}</span>}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={5} md={6}>
                  <Grid
                    container
                    sx={{
                      flexWrap: 'wrap',
                      gap: '1rem',
                      height: '100%',
                      alignItems: 'center',
                    }}
                  >
                    <Box className="uploadImage">
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        <Stack direction="row" alignItems="center" spacing={2.5}>
                          <label htmlFor={`file-image-${i}`}>
                            <Input
                              accept="image/*"
                              name="nomineePicture"
                              id={`file-image-${i}`}
                              multiple
                              type="file"
                              onChange={(e) => handleImage(e, i)}
                              onClick={(event) => {
                                event.target.value = null;
                              }}
                            />
                            <Button
                              variant="contained"
                              component="span"
                              startIcon={<PhotoCamera />}
                              className="btn btn-primary"
                            >
                              নমিনীর ছবি
                            </Button>
                          </label>
                        </Stack>
                      </Typography>
                      {nominiList[i].nomineePicture && (
                        <div className="img">
                          <CardMedia
                            component="img"
                            sx={{ width: 140 }}
                            image={flagForImage + nominiList[i].nomineePicture}
                            alt="সদস্য"
                          />
                          <CancelIcon className="imgCancel" onClick={(e) => removeNomineeImage(e, i)} />
                        </div>
                      )}
                    </Box>
                    <Box className="uploadImage">
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        <Stack direction="row" alignItems="center" spacing={2.5}>
                          <label htmlFor={`file-sign-${i}`}>
                            <Input
                              accept="image/*"
                              name="nomineeSign"
                              id={`file-sign-${i}`}
                              multiple
                              type="file"
                              onChange={(e) => handleSign(e, i)}
                              onClick={(event) => {
                                event.target.value = null;
                              }}
                            />
                            <Button
                              variant="contained"
                              component="span"
                              startIcon={<PhotoCamera />}
                              className="btn btn-primary"
                            >
                              নমিনীর স্বাক্ষর
                            </Button>
                          </label>
                        </Stack>
                      </Typography>
                      {nominiList[i].nomineeSign && (
                        <div className="img">
                          <CardMedia
                            component="img"
                            sx={{ width: 140 }}
                            image={flagForImage + nominiList[i].nomineeSign}
                            alt="সদস্য"
                          />
                          <CancelIcon className="imgCancel" onClick={(e) => removeNomineeSign(e, i)} />
                        </div>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                <Grid item lg={12}>
                  {nominiList.length > 1 && (
                    <Button variant="contained" className="btn btn-delete" onClick={(e) => deleteNomineeInfo(e, i)}>
                      বাতিল করুন
                    </Button>
                  )}
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default NomineeInfo;
