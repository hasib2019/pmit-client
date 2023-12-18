import {
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import IconButton from '@mui/material/IconButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SubHeading from '../../../../shared/others/SubHeading';

import { bangToEng, engToBang, myValidate } from '../../../samity-managment/member-registration/validator';
const UpdateProductInterest = ({
  productInterest,
  handleProductInterest,
  prevProductInterest,
  deleteProductInterest,
  productInterestError,
  handleProductInterestDate,
  setProductInterest,
}) => {
  const [modalClicked, setModalClicked] = useState(false);
  const [pMature, setPMature] = useState([]);
  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };
  const handleClose = () => {
    setModalClicked(false);
  };
  const handleModalClicked = (e, ind) => {
    const productIntrestCopy = [...productInterest];
    const preMature = [];

    if (productIntrestCopy[ind].id || productIntrestCopy[ind]['productPreMature'].length > 1) {
      setPMature(productIntrestCopy[ind].productPreMature);
    } else {
      if (
        productIntrestCopy[ind].insAmt &&
        productIntrestCopy[ind].maturityAmount &&
        productIntrestCopy[ind].timePeriod
      ) {
        const duration = +productIntrestCopy[ind].timePeriod / 12 - 1;
        for (let i = 0; i < duration; i++) {
          preMature.push({
            id: ind,
            interestRate: '',
            timePeriod: +(i + 1),
            maturityAmount: '',
          });
        }
        setPMature(preMature);
      } else {
        setPMature([]);
      }
    }
    setModalClicked((prevState) => !prevState);
  };
  const handlePreMature = () => {
    const id = pMature[0]?.id;
    const productInterestArrayCopy = [...productInterest];
    pMature.forEach((elem) => delete elem.id);
    productInterestArrayCopy[id]['productPreMature'] = pMature;

    setProductInterest(productInterestArrayCopy);
    setModalClicked((prevState) => !prevState);
  };
  const handleChangeE = (e, index) => {
    let { name, value, id } = e.target;
    let resultObj;
    const pMatureCopy = [...pMature];

    value = bangToEng(value);
    if (id == 'number') {
      resultObj = myValidate('chargeNumber', value);
      if (resultObj?.status) {
        return;
      }
    }
    pMatureCopy[index][name] = bangToEng(resultObj?.value);
    setPMature(pMatureCopy);
  };
  return (
    <>
      {productInterest?.map((v, i) => (
        <Paper
          sx={{
            padding: '30px 20px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginBottom: '10px',
          }}
          key={i}
        >
          <Grid container spacing={2.5} className="section">
            <Grid item md={4} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={star('কার্যকর তারিখ')}
                  name="effectDate"
                  value={v.effectDate}
                  minDate={prevProductInterest.length > i ? '' : new Date()}
                  disabled={prevProductInterest.length > i}
                  onChange={(e) => handleProductInterestDate(e, i)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('কিস্তির পরিমাণ')}
                name="insAmt"
                id="number"
                value={engToBang(v.insAmt)}
                variant="outlined"
                onChange={(e) => handleProductInterest(e, i)}
                size="small"
              ></TextField>
              {!productInterest[i]?.insAmt ? (
                <span style={{ color: '#FFCC00' }}>{productInterestError[i]?.insAmt}</span>
              ) : (
                ''
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="মুনাফার হার"
                name="intRate"
                id="chargeNumber"
                onChange={(e) => handleProductInterest(e, i)}
                number
                value={engToBang(v.intRate)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="সময়কাল"
                name="timePeriod"
                id="number"
                onChange={(e) => handleProductInterest(e, i)}
                number
                value={engToBang(v.timePeriod)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="ম্যাচুরিটি পরিমাণ"
                name="maturityAmount"
                id="number"
                onChange={(e) => handleProductInterest(e, i)}
                number
                value={engToBang(v.maturityAmount)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <Button variant="contained" className="buttonCancel" onClick={(e) => handleModalClicked(e, i)}>
                {i < prevProductInterest.length ? 'প্রিম্যাচুর সেটআপ দেখুন' : 'প্রিম্যাচুর সেটআপ করুন'}
              </Button>
            </Grid>
            {modalClicked ? (
              <div
                style={{
                  zIndex: '10',
                  position: 'absolute',
                }}
              >
                <Dialog
                  className="diaModal"
                  open={modalClicked}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  maxWidth="lg"
                  scroll="body"
                >
                  <div className="modal">
                    <Grid item md={12} xs={12}>
                      <SubHeading>প্রিম্যাচুর সেটআপ করুন</SubHeading>
                      <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: (theme) => theme.palette.grey[500],
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                    <Grid>
                      <TableContainer className="table-container">
                        <Table size="small" aria-label="a dense table">
                          <TableHead className="table-head">
                            <TableRow>
                              <TableCell>সময়কাল</TableCell>
                              <TableCell>মুনাফার হার</TableCell>
                              <TableCell>ম্যাচুরিটি পরিমাণ</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {pMature?.map((row, i) => (
                              <TableRow key={i + 'table'}>
                                <TableCell>{engToBang(row.timePeriod)}</TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    // label={star("মুনাফার হার(%)")}
                                    name="interestRate"
                                    id="number"
                                    onChange={(e) => handleChangeE(e, i)}
                                    value={engToBang(row?.interestRate)}
                                    variant="outlined"
                                    size="small"
                                  ></TextField>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    // label={star("মুনাফার হার(%)")}
                                    name="maturityAmount"
                                    onChange={(e) => handleChangeE(e, i)}
                                    id="number"
                                    value={engToBang(row?.maturityAmount)}
                                    variant="outlined"
                                    size="small"
                                  ></TextField>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Grid container className="btn-container">
                          <Tooltip title="সংরক্ষণ করুন">
                            <Button
                              variant="contained"
                              className="btn btn-save"
                              onClick={handlePreMature}
                              startIcon={<SaveOutlinedIcon />}
                            >
                              সংরক্ষণ করুন
                            </Button>
                          </Tooltip>
                        </Grid>
                      </TableContainer>
                    </Grid>
                  </div>
                </Dialog>
              </div>
            ) : (
              ''
            )}
            {i < prevProductInterest.length && (
              <Grid item md={4} xs={12}>
                <FormControl component="fieldset" variant="standard">
                  <FormControlLabel
                    control={
                      <Switch checked={v?.isActive} onChange={(e) => handleProductInterest(e, i)} name="isActive" />
                    }
                    label="সক্রিয়?"
                    labelPlacement="start"
                  />
                </FormControl>
              </Grid>
            )}
            {i >= prevProductInterest.length && (
              <Grid item md={4} xs={12}>
                <Button variant="contained" className="buttonCancel" onClick={(e) => deleteProductInterest(e, i)}>
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

export default UpdateProductInterest;
