/**
 * @author Md Hasibuzzaman
 * @author2 Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import ZoomImage from 'service/ZoomImage';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { applicationGetById } from '../../../url/coop/ApiList';

const ApprovalCommitteeSetup = (props) => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [documents, setDocuments] = useState([]);
  // const [membersData, setMembersData] = useState([]);
  // const [element, setElement] = useState('');
  const [serviceId, setServiceId] = useState('');

  useEffect(() => {
    samityReport(props.id);
  }, []);

  const samityReport = async (id) => {
    const samityData = await axios.get(applicationGetById + id, config);
    const data = samityData.data.data[0];
    setServiceId(data.data.serviceId);
    setSamityInfo(data);
    setCommittee(data.data.members);
    setDocuments(data.data.documents);
  };

  const imageType = (imageName) => {
    const lastWord = imageName.split('.').pop();
    return lastWord;
  };

  return (
    <>
      <Grid item xs={12} className="approve-info">
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নাম :&nbsp;</span>
              {samityInfo?.data?.samityName}
            </div>
            <div className="info">
              <span className="label">সমিতির ধরন :&nbsp;</span> {props.samityTypeName}
            </div>
          </Grid>
          {serviceId == 3 ? (
            <>
              <Grid
                item
                md={6}
                xs={12}
                sx={{
                  paddingTop: { xs: '0 !important', md: '12px !important' },
                }}
              >
                <div className="info">
                  <span className="label">সমিতির সভার তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.meetingDate + '')}
                </div>
                <div className="info">
                  <span className="label">সমিতির নির্বাচনের তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.electionDate + '')}
                </div>
              </Grid>
            </>
          ) : (
            ''
          )}

          {serviceId == 4 ? (
            <>
              <Grid
                item
                md={6}
                xs={12}
                sx={{
                  paddingTop: { xs: '0 !important', md: '12px !important' },
                }}
              >
                <div className="info">
                  <span className="label">সমিতির নির্বাচনের তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.electionDate + '')}
                </div>
                <div className="info">
                  <span className="label">মেয়াদ শুরুর তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.effectDate + '')}
                </div>
                <div className="info">
                  <span className="label">মেয়াদ শেষের তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.expireDate + '')}
                </div>
              </Grid>
            </>
          ) : (
            ''
          )}

          {serviceId == 5 || serviceId == 9 ? (
            <>
              <Grid
                item
                md={6}
                xs={12}
                sx={{
                  paddingTop: { xs: '0 !important', md: '12px !important' },
                }}
              >
                <div className="info">
                  <span className="label">সমিতির সভার তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.meetingDate + '')}
                </div>
                <div className="info">
                  <span className="label">মেয়াদ শুরুর তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.effectDate + '')}
                </div>
                <div className="info">
                  <span className="label">মেয়াদ শেষের তারিখ :&nbsp;</span>
                  {numberToWord('' + samityInfo?.data?.expireDate + '')}
                </div>
              </Grid>
            </>
          ) : (
            ''
          )}
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>কমিটির গঠনের ডকুমেন্ট</SubHeading>
          <Grid container>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center">ক্রমিক নং</TableCell>
                    <TableCell>ডকুমেন্টের নাম</TableCell>
                    <TableCell>ডকুমেন্টের নাম্বার</TableCell>
                    <TableCell align="center">ডকুমেন্ট / ছবি</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents?.map((img, i) =>
                    img ? (
                      <TableRow key={i}>
                        <TableCell scope="row" align="center">
                          {numberToWord('' + (i + 1) + '')}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{img?.documentNameBangla}</div>} arrow>
                            <span>{img?.documentNameBangla}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{img?.documentNo}</TableCell>
                        <TableCell align="center">
                          <ZoomImage
                            src={img?.documentName[0]?.fileNameUrl}
                            imageStyle={{ width: '40px', height: '40px' }}
                            divStyle={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                            key={img?.documentNo}
                            type={imageType(img?.documentName[0]?.fileName)}
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      ''
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>কমিটির পদ বরাদ্দকরন</SubHeading>
          <Grid container>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 375 }}>
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center">ক্রমিক নং</TableCell>
                    <TableCell>সদস্যের নাম</TableCell>
                    <TableCell align="center">সদস্য কি?</TableCell>
                    <TableCell>জাতীয় পরিচয়পত্র</TableCell>
                    <TableCell align="center">মোবাইল নম্বর</TableCell>
                    <TableCell align="center">জন্মতারিখ/সংগঠক</TableCell>
                    <TableCell>পদবী</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {committee?.map((degs, i) => (
                    <TableRow key={i}>
                      <TableCell scope="row" align="center">
                        {numberToWord('' + (i + 1) + '')}
                      </TableCell>
                      <TableCell>{degs?.memberNameBangla || degs?.memberName}</TableCell>
                      <TableCell align="center">{degs?.isMember == 'true' ? 'হ্যা' : 'না'}</TableCell>
                      <TableCell>{numberToWord('' + degs?.memberNid ? degs?.memberNid : '' + '')}</TableCell>
                      <TableCell align="center">{numberToWord('' + degs?.mobile ? degs?.mobile : '' + '')}</TableCell>
                      <TableCell align="center">
                        {degs?.memberDob ? numberToWord('' + degs?.memberDob + '') : degs?.orgName}
                      </TableCell>
                      <TableCell>{degs?.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ApprovalCommitteeSetup;
