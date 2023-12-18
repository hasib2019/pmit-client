import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import ZoomImage from 'service/ZoomImage';
import { dateFormat } from 'service/dateFormat';
import SubHeading from '../../../shared/others/SubHeading';
import { engToBang } from '../../samity-managment/member-registration/validator';


const labelObj = {
  newBirthDate: 'আবেদনকৃত জন্মতারিখ',
  oldBirthDate: 'পুরাতন জন্মতারিখ',
  oldemail: 'পুরাতন ইমেইল আইডি',
  newemail: 'আবেদনকৃত ইমেইল আইডি',
  newmobile: 'আবেদনকৃত মোবাইল নম্বর',
  oldmobile: 'পুরাতন মোবাইল নম্বর',
  newYearlyIncome: 'আবেদনকৃত বার্ষিক আয়',
  oldYearlyIncome: 'পুরাতন বার্ষিক আয়',
  oldNameBn: 'পুরাতন বাংলা নাম',
  newNameBn: 'আবেদনকৃত বাংলা নাম',
  oldNameEn: 'পুরাতন ইংরেজি নাম',
  newNameEn: 'আবেদনকৃত ইংরেজি নাম',
  oldFatherName: 'পুরাতন পিতার নাম',
  newFatherName: 'আবেদনকৃত পিতার নাম',
  oldMotherName: 'পুরাতন মাতার নাম',
  newMotherName: 'আবেদনকৃত মাতার নাম',
  newEducation: 'আবেদনকৃত শিক্ষাগত যোগ্যতা',
  oldEducation: 'পুরাতন শিক্ষাগত যোগ্যতা',
  newOccupation: 'আবেদনকৃত পেশা',
  oldOccupation: 'পুরাতন পেশা',
  newReligion: 'আবেদনকৃত ধর্ম',
  oldReligion: 'পুরাতন ধর্ম',
  newGender: 'আবেদনকৃত লিঙ্গের ধরণ',
  oldGender: 'পুরাতন লিঙ্গের ধরণ',
  newMaritalStatus: 'আবেদনকৃত বৈবাহিক অবস্থা',
  oldMaritalStatus: 'পুরাতন বৈবাহিক অবস্থা',
  newTransactionType: 'আবেদনকৃত লেনদেনের ধরণ',
  oldTransactionType: 'পুরাতন লেনদেনের ধরণ',
  newAccountNo: 'আবেদনকৃত হিসাবের নম্বর',
  oldAccountNo: 'পুরাতন হিসাবের নম্বর',
  newAccountTitle: 'আবেদনকৃত হিসাবের নাম',
  oldAccountTitle: 'পুরাতন হিসাবের নাম',
  newSecondaryOccupation: 'আবেদনকৃত দ্বিতীয় পেশা',
  oldSecondaryOccupation: 'পুরাতন দ্বিতীয় পেশা',
  newAge: 'আবেদনকৃত বয়স',
  oldAge: 'পুরাতন বয়স',
};
const imageType = (imageName) => {
  if (imageName) {
    const lastWord = imageName.split('.').pop();
    return lastWord;
  }
};


const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(() => ({
  border: `1px solid #f9f9f9`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: '#707070' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#D3DEDC',
  color: '#707070',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
  fontSize: '17px',
}));

const MemberUpdateAccordion = (props) => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <Accordion sx={{ padding: '0 15px' }} expanded={expanded} onChange={handleChange(!expanded)}>
        <AccordionSummary>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>{props?.applicationInfo?.memberName}</h3>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container display="flex">
            <Grid item md={12} xs={12}>
              {Object.keys(props?.applicationInfo?.data).length >= 1 &&
                Object.keys(props?.applicationInfo?.data).map((elem, i) => (
                  <Box sx={{ display: 'inline', visibility: 'visible', margin: '10px' }} key={1}>
                    {labelObj[elem]} -{' '}
                    {elem == 'oldBirthDate' || elem == 'newBirthDate'
                      ? engToBang(dateFormat(props?.applicationInfo?.data[elem]))
                      : engToBang(props?.applicationInfo?.data[elem])}
                    {i % 2 == '1' && <br />}
                  </Box>
                ))}
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionDetails>
          <div style={{ minHeight: '300px' }}>
            <Grid container md={12} xs={12} lg={12} spacing={2.5} direction="row" justifyContent="center">
              <Grid item md={6} xs={12}>
                <SubHeading>নমিনির পূর্ববর্তী তথ্য </SubHeading>

                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell width="1%">ক্রমিক নং</TableCell>
                        <TableCell width="1%">নমিনির নাম</TableCell>
                        <TableCell>ডকুমেন্টের ধরণ</TableCell>
                        <TableCell>ডকুমেন্ট নম্বর</TableCell>

                        <TableCell width="1%">সম্পর্ক</TableCell>
                        <TableCell width="1%">শতকরা</TableCell>
                        <TableCell width="1%">নমিনির ছবি</TableCell>
                        <TableCell width="1%">নমিনির স্বাক্ষর</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props?.applicationInfo && props?.applicationInfo?.nominee.length > 0
                        ? props?.applicationInfo?.nominee.map((item, i) =>
                          'old' in item ? (
                            <TableRow key={item.id}>
                              <TableCell align="center">{engToBang(i + 1)}</TableCell>
                              <TableCell align="center">{item?.old?.nomineeName}</TableCell>
                              <TableCell>
                                <Tooltip title={<div className="tooltip-title">{item?.old?.docTypeDesc}</div>} arrow>
                                  <span className="data">{item.projectNameBangla}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={<div className="tooltip-title">{item?.old?.docNumber}</div>} arrow>
                                  <span className="data">{item.projectDirector}</span>
                                </Tooltip>
                              </TableCell>

                              <TableCell align="center">{item?.old?.relationTypeDesc}</TableCell>
                              <TableCell align="right">{item?.old?.percentage}</TableCell>
                            </TableRow>
                          ) : (
                            ''
                          ),
                        )
                        : ' '}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item md={6} xs={12}>
                <SubHeading>নমিনির পরবর্তী তথ্য</SubHeading>

                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell width="1%">ক্রমিক নং</TableCell>
                        <TableCell width="1%">নমিনির নাম</TableCell>
                        <TableCell>ডকুমেন্টের ধরণ</TableCell>
                        <TableCell>ডকুমেন্ট নম্বর</TableCell>

                        <TableCell width="1%">সম্পর্ক</TableCell>
                        <TableCell width="1%">শতকরা</TableCell>
                        <TableCell width="1%">নমিনির ছবি</TableCell>
                        <TableCell width="1%">নমিনির স্বাক্ষর</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props?.applicationInfo && props?.applicationInfo?.nominee.length > 0
                        ? props?.applicationInfo?.nominee.map((item, i) => (
                          <TableRow key={item.id}>
                            <TableCell align="center">{engToBang(i + 1)}</TableCell>
                            <TableCell align="center">{item?.new?.nomineeName}</TableCell>
                            <TableCell align="center">{item?.new?.docTypeDesc}</TableCell>
                            <TableCell align="center">{engToBang(item?.new?.docNumber)}</TableCell>

                            <TableCell align="center">{item?.new?.relationTypeDesc}</TableCell>
                            <TableCell align="right">{engToBang(item?.new?.percentage)}</TableCell>
                            <TableCell>
                              <ZoomImage
                                src={item?.new?.nomineePictureUrl}
                                divStyle={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  height: '100%',
                                  width: '100%',
                                }}
                                imageStyle={{ height: '100%', width: '100%', maxWidth: '80px' }}
                                key={1}
                                type={imageType(item?.new?.nomineePicture)}
                              />
                            </TableCell>
                            <TableCell>
                              <ZoomImage
                                src={item?.new?.nomineeSignUrlUrl}
                                divStyle={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  height: '100%',
                                  width: '100%',
                                }}
                                imageStyle={{ height: '100%', width: '100%', maxWidth: '80px' }}
                                key={1}
                                type={imageType(item?.new?.nomineeSign)}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                        : ' '}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item md={6} xs={12}>
                <SubHeading>ডকুমেন্টের পূর্ববর্তী তথ্য</SubHeading>
                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell width="1%">ক্রমিক নং</TableCell>
                        <TableCell width="1%">ডকুমেন্ট নম্বর</TableCell>
                        <TableCell width="1%">ডকুমেন্ট(ফ্রন্ট)</TableCell>
                        <TableCell width="1%">ডকুমেন্ট(ব্যাক)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props?.applicationInfo && props?.applicationInfo?.memberDocuments.length > 0
                        ? props?.applicationInfo?.memberDocuments.map((item, i) =>
                          'old' in item ? (
                            <TableRow key={item.id}>
                              <TableCell align="center">{engToBang(i + 1)}</TableCell>
                              <TableCell align="center">{engToBang(item?.old?.documentNumber)}</TableCell>
                              <TableCell>
                                <ZoomImage
                                  src={item?.old?.documentFrontUrl}
                                  divStyle={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    height: '100%',
                                    width: '100%',
                                  }}
                                  imageStyle={{ height: '100%', width: '100%', maxWidth: '80px' }}
                                  key={1}
                                  type={imageType(item?.old?.documentFront)}
                                />
                              </TableCell>
                              <TableCell>
                                <ZoomImage
                                  src={item?.old?.documentBackUrl}
                                  divStyle={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    height: '100%',
                                    width: '100%',
                                  }}
                                  imageStyle={{ height: '100%', width: '100%', maxWidth: '80px' }}
                                  key={1}
                                  type={imageType(item?.old?.documentBack)}
                                />
                              </TableCell>
                            </TableRow>
                          ) : (
                            ''
                          ),
                        )
                        : ' '}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item md={6} xs={12}>
                <SubHeading>ডকুমেন্টের পরবর্তী তথ্য</SubHeading>

                <TableContainer className="table-container">
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell width="1%">ক্রমিক নং</TableCell>
                        <TableCell width="1%">ডকুমেন্ট নম্বর</TableCell>
                        <TableCell width="1%">ডকুমেন্ট(ফ্রন্ট)</TableCell>
                        <TableCell width="1%">ডকুমেন্ট(ব্যাক)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props?.applicationInfo && props?.applicationInfo?.memberDocuments.length > 0
                        ? props?.applicationInfo?.memberDocuments.map((item, i) => (
                          <TableRow key={item.id}>
                            <TableCell align="center">{engToBang(i + 1)}</TableCell>
                            <TableCell align="center">{engToBang(item?.new?.documentNumber)}</TableCell>
                            <TableCell>
                              {' '}
                              <ZoomImage
                                src={item?.new?.documentFrontUrl}
                                divStyle={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  height: '100%',
                                  width: '100%',
                                }}
                                imageStyle={{ height: '100%', width: '100%', maxWidth: '80px', maxHeight: '50px' }}
                                key={1}
                                type={imageType(item?.new?.documentFront)}
                              />
                            </TableCell>
                            <TableCell>
                              {' '}
                              <ZoomImage
                                src={item?.new?.documentBackUrl}
                                divStyle={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  height: '100%',
                                  width: '100%',
                                }}
                                imageStyle={{ height: '100%', width: '100%', maxWidth: '80px', maxHeight: '50px' }}
                                key={1}
                                type={imageType(item?.new?.documentBack)}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                        : ' '}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default MemberUpdateAccordion;
