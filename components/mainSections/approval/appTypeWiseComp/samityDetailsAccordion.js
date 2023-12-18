import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { useState } from 'react';
import ZoomImage from 'service/ZoomImage';
import { dateFormat, formatDate } from 'service/dateFormat';
import SubHeading from '../../../shared/others/SubHeading';

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

const ShowAcc = (props) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      <Accordion expanded={expanded} onChange={handleChange(!expanded)}>
        <AccordionSummary>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ width: '15%' }}>{props?.val.data.nameEn}</div>
            <div style={{ width: '15%' }}> {props?.val.data.fatherName} </div>
            <div style={{ width: '15%' }}> {props?.val.data.motherName}</div>
            <div style={{ width: '12%' }}> {engToBang(props?.val.data.mobile)}</div>
            <div style={{ width: '18%' }}> {props?.val.data.email}</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <SubHeading style={{ textDecoration: 'uderline' }}>সদস্যের সাধারণ তথ্য : </SubHeading>
          <Grid container display="flex">
            <Grid item md={4} xs={12}>
              <Typography>
                <span className="label">নাম : &nbsp;</span>
                {props?.val.data.nameBn}
              </Typography>
              <Typography>
                <span className="label">পিতার নাম: &nbsp;</span> {props?.val.data.fatherName}{' '}
              </Typography>
              <Typography>
                <span className="label">মাতার নাম:&nbsp;</span> {props?.val.data.motherName}
              </Typography>
              <Typography>
                <span className="label">বয়স:&nbsp;</span> {engToBang(props?.val.data.age)}
              </Typography>
              <Typography>
                <span className="label">লিঙ্গ:&nbsp;</span> {props?.val.data.genderName}
              </Typography>
              <Typography>
                <span className="label">শিক্ষাগত যোগ্যতা :&nbsp;</span> {props?.val.data.educationName}
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography>
                <span className="label"> জন্ম তারিখ :&nbsp;</span>{' '}
                {props?.val?.data?.birthDate ? engToBang(formatDate(props.val.data.birthDate)) : ''}
              </Typography>
              <Typography>
                <span className="label">ধর্ম:&nbsp;</span> {props?.val.data.religionName}
              </Typography>
              <Typography>
                <span className="label">বৈবাহিক অবস্থা:&nbsp;</span> {props?.val.data.maritalStatusName}{' '}
              </Typography>
              <Typography>
                {' '}
                <span className="label">মোবাইল নম্বর :&nbsp;</span> {engToBang(props?.val.data.mobile)}
              </Typography>
              <Typography>
                {' '}
                <span className="label">ইমেইল :&nbsp;</span> {props?.val.data.email}
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography>
                <span className="label">পিতার জাতীয় পরিচয় পত্র:&nbsp;</span> {engToBang(props?.val.data.fatherNid)}
              </Typography>
              <Typography>
                <span className="label"> মাতার জাতীয় পরিচয় পত্র :&nbsp;</span> {engToBang(props?.val.data.motherNid)}
              </Typography>
              <Typography>
                <span className="label">বাৎসরিক আয় :&nbsp;</span> {engToBang(props?.val.data.yearlyIncome)}
              </Typography>
              <Typography>
                <span className="label">ভর্তি ফি:&nbsp;</span> {engToBang(props?.val.data.admissionFee)}
              </Typography>
              <Typography>
                <span className="label"> পাসবুক ফি: {engToBang(props?.val.data.passbookFee)}&nbsp;</span>{' '}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        {props?.val?.guardianInfo && Object.keys(props.val.guardianInfo).length > 0 && (
          <Grid container spacing={0.5}>
            <Grid item md={5}>
              <AccordionDetails>
                <SubHeading>বৈধ অভিভাবক/খানা প্রধানের তথ্য</SubHeading>
                <TableContainer>
                  <TableHead style={{ width: '100%' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>নাম</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>সম্পর্ক </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ডকুমেন্ট নম্বর </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}> পেশা </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {(props && props.val && props.val.guardianInfo && props.val.guardianInfo.guardianName) ||
                          'বিদ্যমান নেই'}
                      </TableCell>
                      <TableCell>
                        {(props && props.val && props.val.guardianInfo && props.val.guardianInfo.relationName) ||
                          'বিদ্যমান নেই'}
                      </TableCell>
                      <TableCell>
                        {engToBang(props && props.val && props.val.guardianInfo && props.val.guardianInfo.documentNo) ||
                          'বিদ্যমান নেই'}
                      </TableCell>
                      <TableCell>
                        {(props && props.val && props.val.guardianInfo && props.val.guardianInfo.occupationName) ||
                          'বিদ্যমান নেই'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
              </AccordionDetails>
            </Grid>
            {props?.val?.nominee && props.val.nominee.length > 0 && (
              <Grid item md={7}>
                <AccordionDetails>
                  <SubHeading>নমিনীর তথ্য</SubHeading>
                  <TableContainer>
                    <TableHead style={{ width: '100%' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>নাম</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>সম্পর্ক </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>জন্ম তারিখ</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>শতকরা হার </TableCell>

                        <TableCell sx={{ fontWeight: 'bold' }}>ডকুমেন্টের ধরন </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>ডকুমেন্ট নম্বর </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>ছবি </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>স্বাক্ষর</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.val.nominee
                        ? props.val.nominee.map((data, i) => (
                          <TableRow key={i}>
                            <TableCell>{data.nomineeName}</TableCell>
                            <TableCell>{data.relationName}</TableCell>
                            <TableCell>{engToBang(dateFormat(data.birthDate))}</TableCell>
                            <TableCell>{engToBang(data.percentage)}</TableCell>
                            <TableCell>{data.docTypeName}</TableCell>
                            <TableCell>{engToBang(data.docNumber)}</TableCell>
                            {/* data.nomineePictureUrl   data.nomineeSignUrl*/}
                            <TableCell align="center">
                              <ZoomImage
                                src={data.nomineePictureUrl}
                                divStyle={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  height: '100%',
                                  width: '100%',
                                }}
                                imageStyle={{
                                  height: '100%',
                                  width: '100%',
                                }}
                                key={1}
                                type={imageType(data?.nomineePicture)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <ZoomImage
                                src={data.nomineeSignUrl}
                                divStyle={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  height: '100%',
                                  width: '100%',
                                }}
                                imageStyle={{
                                  height: '100%',
                                  width: '100%',
                                }}
                                key={1}
                                type={imageType(data?.nomineePicture)}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                        : ' '}
                    </TableBody>
                  </TableContainer>
                </AccordionDetails>
              </Grid>
            )}
          </Grid>
        )}
        <AccordionDetails>
          <SubHeading>সদস্যের ডকুমেন্টের তথ্য</SubHeading>
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ডকুমেন্টের ধরন </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ডকুমেন্ট নম্বর </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>সামনের ছবি </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>পেছনের ছবি </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.val.data
                ? props.val.data.memberDocuments.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>{data.docTypeName}</TableCell>
                    <TableCell>{engToBang(data.documentNumber)}</TableCell>
                    <TableCell>
                      {' '}
                      <ZoomImage
                        src={data.documentFrontUrl}
                        divStyle={{
                          display: 'flex',
                          justifyContent: 'center',
                          height: '100%',
                          width: '100%',
                        }}
                        imageStyle={{
                          height: '100%',
                          width: '100%',
                          maxWidth: '80px',
                        }}
                        key={1}
                        type={imageType(data?.documentFront)}
                      />
                    </TableCell>
                    <TableCell>
                      {' '}
                      <ZoomImage
                        src={data.documentBackUrl}
                        divStyle={{
                          display: 'flex',
                          justifyContent: 'center',
                          height: '100%',
                          width: '100%',
                        }}
                        imageStyle={{
                          height: '100%',
                          width: '100%',
                          maxWidth: '80px',
                        }}
                        key={1}
                        type={imageType(data?.documentBack)}
                      />
                    </TableCell>
                  </TableRow>
                ))
                : ' '}
            </TableBody>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
export default ShowAcc;
