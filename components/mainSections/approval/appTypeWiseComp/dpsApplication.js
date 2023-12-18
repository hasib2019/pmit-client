/* eslint-disable @next/next/no-img-element */
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import SubHeading from 'components/shared/others/SubHeading';
import { useState } from 'react';
import ZoomImage from 'service/ZoomImage';
const imageType = (imageName) => {
  if (imageName) {
    const lastWord = imageName.split('.').pop();
    return lastWord;
  }
};
function createMarkup(value) {
  return {
    __html: value,
  };
}
const DpsApplication = (props) => {
  const flag = useState('data:image/jpeg;base64,');
  const { applicationInfo, history } = props.allData;

  return (
    <>
      {/* <Grid container className="section">
        <SubHeading>সদস্যের সাধারণ তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="first-td">
                  সদস্যের নাম
                </TableCell>
                <TableCell>
                 প্রকল্পের নাম
                </TableCell>
                <TableCell>
                প্রোডাক্টের নাম
                </TableCell>
                <TableCell>
                  সমিতির নাম
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="first-td">{applicationInfo.customerName}</TableCell>
                <TableCell>{applicationInfo.projectNameBangla}</TableCell>
                <TableCell>{applicationInfo.productName}</TableCell>
                <TableCell>{applicationInfo.samityName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid> */}
      <Grid container className="section" display="flex">
        <Grid item md={12} sm={12} xs={12}>
          <SubHeading>সদস্যের সাধারণ তথ্য</SubHeading>
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography>
            <span className="label">সদস্যের নাম : &nbsp;</span>
            {applicationInfo && applicationInfo.customerName}
          </Typography>
          <Typography>
            <span className="label">সমিতির নাম : &nbsp;</span>
            {applicationInfo && applicationInfo.samityName}
          </Typography>
          <Typography>
            <span className="label">প্রকল্পের নাম: &nbsp;</span> {applicationInfo && applicationInfo.projectNameBangla}{' '}
          </Typography>
          <Typography>
            <span className="label">প্রোডাক্টের নাম:&nbsp;</span> {applicationInfo && applicationInfo.productName}
          </Typography>
        </Grid>
      </Grid>

      <Grid container className="section" spacing={1}>
        <Grid item md={12} sm={12} xs={12}>
          <SubHeading>লেনদেন সংক্রান্ত তথ্য</SubHeading>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="right">কিস্তির পরিমান (টাকা)</TableCell>
                  <TableCell align="center">কিস্তির মেয়াদ (মাস)</TableCell>
                  <TableCell align="center">কিস্তির ধরণ</TableCell>
                  <TableCell align="center">ম্যাচুরিটির সময়</TableCell>
                  <TableCell align="right">ম্যাচুরিটি পরিমাণ (টাকা)</TableCell>
                  <TableCell align="center">মুনাফার হার (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className="table-data-right">
                    {applicationInfo.installmentAmount ? engToBang(applicationInfo.installmentAmount) : ' '}
                  </TableCell>
                  <TableCell className="table-data-center">
                    {applicationInfo.time ? engToBang(applicationInfo.time) : ' '}
                  </TableCell>
                  <TableCell className="table-data-center">
                    {applicationInfo.installmentFrequency == 'M' ? 'মাসিক' : 'সাপ্তাহিক'}
                  </TableCell>
                  <TableCell align="center">
                    {applicationInfo.maturityDate ? engToBang(applicationInfo.maturityDate) : ' '}
                  </TableCell>
                  <TableCell className="table-data-right">
                    {applicationInfo.maturityAmount ? engToBang(applicationInfo.maturityAmount) : ' '}
                  </TableCell>
                  <TableCell align="center">
                    {applicationInfo.intRate ? engToBang(applicationInfo.intRate) : ' '}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container className="section" spacing={1}>
        <Grid md={12} sm={12} xs={12}>
          <SubHeading>নমিনীর তথ্য</SubHeading>
        </Grid>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>নাম</TableCell>
                <TableCell>সম্পর্ক </TableCell>
                <TableCell>শতকরা হার </TableCell>
                <TableCell>ডকুমেন্টের ধরন </TableCell>
                <TableCell>ডকুমেন্ট নম্বর </TableCell>
                <TableCell align="center">ছবি </TableCell>
                <TableCell align="center">স্বাক্ষর</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicationInfo
                ? applicationInfo.nomineeInfo?.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>{data.nomineeName}</TableCell>
                    <TableCell>{data.relationName}</TableCell>
                    <TableCell>{engToBang(data.percentage)}</TableCell>
                    <TableCell>{data.docTypeDesc}</TableCell>
                    <TableCell>{engToBang(data.docNumber)}</TableCell>
                    <TableCell align="center">
                      <span>
                        <ZoomImage
                          src={data.nomineePictureUrl}
                          divStyle={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            maxWidth: '50px',
                          }}
                          imageStyle={{
                            height: '100%',
                            width: '100%',
                          }}
                          key={1}
                          type={imageType(data?.nomineePicture)}
                        />
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span>
                        <ZoomImage
                          src={data.nomineeSignUrl}
                          divStyle={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            maxWidth: '50px',
                          }}
                          imageStyle={{
                            height: '100%',
                            width: '100%',
                          }}
                          key={1}
                          type={imageType(data?.nomineePicture)}
                        />
                      </span>
                    </TableCell>
                  </TableRow>
                ))
                : ' '}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid container className="section">
        <Grid md={12} sm={12} xs={12}>
          <SubHeading>ডকুমেন্টের তথ্য</SubHeading>
        </Grid>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>ডকুমেন্টের ধরন</TableCell>
                <TableCell>ডকুমেন্ট নম্বর</TableCell>
                <TableCell align="center">ডকুমেন্টের ছবি (ফ্রন্ট)</TableCell>
                <TableCell align="center">ডকুমেন্টের ছবি (ব্যাক)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicationInfo
                ? applicationInfo.documentInfo?.map((v, i) => (
                  <TableRow key={i}>
                    <TableCell className="first-td">{v.docTypeName}</TableCell>
                    <TableCell>{v.documentNumber ? v.documentNumber : 'বিদ্যমান নেই'}</TableCell>
                    <TableCell align="center">
                      <Grid item className="table-img">
                        <img
                          src={v.documentFront ? flag + v.documentFront : '/store.svg'}
                          style={{
                            cursor: 'pointer',
                            width: '70px',
                            height: '40px',
                            margin: '3px',
                          }}
                          name="documentFront"
                          id="documentFront"
                          alt=""
                        />
                      </Grid>
                    </TableCell>
                    <TableCell align="center">
                      {v.documentBack ? (
                        <Grid item className="table-img">
                          <img
                            src={flag + v.documentBack}
                            style={{
                              margin: 'auto',
                              cursor: 'pointer',
                              width: '70px',
                              height: '40px',
                            }}
                            name="documentBack"
                            id="documentBack"
                            alt=""
                          />
                        </Grid>
                      ) : (
                        'বিদ্যমান নেই'
                      )}
                    </TableCell>
                  </TableRow>
                ))
                : ''}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid container className="section" spacing={1}>
        <Grid item md={12} sm={12} xs={12}>
          <TableContainer className="table-container">
            <Table size="small" aria-label="a dense table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>মন্তব্যকারীর নাম</TableCell>
                  <TableCell>কার্যক্রম</TableCell>
                  <TableCell>মন্তব্য</TableCell>
                  <TableCell>সংযুক্তি</TableCell>
                  <TableCell>তারিখ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history
                  ? history.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell>{v.nameBn}</TableCell>
                      <TableCell>{v.actionText}</TableCell>
                      <TableCell>
                        <div dangerouslySetInnerHTML={createMarkup(v.remarks)} />
                      </TableCell>
                      <TableCell style={{ color: 'blue', fontSize: '16px' }}>
                        <a href={v.attachment.fileNameUrl}>
                          {' '}
                          {v.attachment.fileNameUrl ? 'ডাউনলোড করুন' : 'সংযুক্তি নেই'}{' '}
                        </a>
                      </TableCell>
                      <TableCell>{v.actionDate}</TableCell>
                    </TableRow>
                  ))
                  : ' '}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default DpsApplication;
