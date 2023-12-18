/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/08/16 03.00.00
 * @modify date 2022-08-16
 * @desc [description]
 */
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import ZoomImage from 'service/ZoomImage';
import { localStorageData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import { ApproveSamityReportApi, GetCorrectonMembrData, masterData } from '../../../url/coop/ApiList';

const ApprovalMemberCorrection = ({ samityId }) => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [getCorrectionMemData, setGetCorrectionMemData] = useState([]);
  const [jobType, setJobType] = useState();

  useEffect(() => {
    allJobTypeShow();
    samityReport(samityId);
    getMemberDetails(samityId);
  }, []);

  const allJobTypeShow = async () => {
    try {
      const jobtypeResp = await axios.get(masterData + 'occupation?isPagination=false', config);
      setJobType(jobtypeResp.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const samityReport = async (id) => {
    const samityData = await axios.get(ApproveSamityReportApi + id, config);
    setSamityInfo(samityData.data.data.samityInfo);
  };
  const getMemberDetails = async (approveSamityId) => {
    try {
      const showCorrectionMemberData = await axios.get(GetCorrectonMembrData + approveSamityId, config);
      setGetCorrectionMemData(showCorrectionMemberData.data.data.data.membersInfo);
    } catch (error) {
      // errorHandler(error)
    }
  };

  const findoccupationName = (getOccupationId) => {
    let item = jobType?.find((item) => item?.id === parseInt(getOccupationId));
    if (item) {
      return item?.displayValue;
    }
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          boxShadow: '0 0 10px -5px rgba(0,0,0,0.5)',
          borderRadius: '10px',
          padding: '1rem',
          margin: '1rem 0 2rem',
        }}
      >
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নাম :&nbsp;</span>
              {samityInfo?.samityName}
            </div>
            <div className="info">
              <span className="label">সমিতির ধরন :&nbsp;</span> {samityInfo?.samityTypeName}
            </div>
            {samityInfo?.samityLevel == 'P' ? (
              <div className="info">
                <span className="label">প্রকল্পের নাম :&nbsp;</span> {samityInfo?.projectNameBangla}
              </div>
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={6} xs={12} sx={{ paddingTop: { xs: '0 !important', md: '12px !important' } }}>
            <div className="info">
              <span className="label">সমিতি গঠনের তারিখ :&nbsp;</span>
              {samityInfo?.samityFormationDate && numberToWord('' + dateFormat(samityInfo?.samityFormationDate) + '')}
            </div>
            {/* <div className="info">
              <span className="label">সমিতির নিবন্ধন তারিখ :&nbsp;</span>
              {samityInfo?.samityFormationDate && numberToWord("" + dateFormat(samityInfo?.samityFormationDate) + "")}
            </div> */}
          </Grid>
          <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
            <div className="info">
              <span className="label">সমিতির ঠিকানা :&nbsp;</span>
              {samityInfo?.samityDetailsAddress}, {samityInfo?.uniThanaPawNameBangla},&nbsp;
              {samityInfo?.upaCityNameBangla}, {samityInfo?.officeDistrictNameBangla},&nbsp;
              {samityInfo?.officeDivisionNameBangla}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid xs={12}>
          <SubHeading>সংরক্ষনকৃত / আবেদিত সদস্যের তথ্য </SubHeading>
          {getCorrectionMemData.length != 0 ? (
            samityInfo?.samityLevel == 'P' ? (
              <TableContainer className="table-container lg-table">
                <Table size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell>সদস্য নং</TableCell>
                      <TableCell>আবেদনের ধরন</TableCell>
                      <TableCell>এনআইডি/জন্ম নিবন্ধন</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>জন্মতারিখ</TableCell>
                      <TableCell>নাম</TableCell>
                      <TableCell>পিতার নাম</TableCell>
                      <TableCell>মাতার নাম</TableCell>
                      <TableCell>স্বামী/স্ত্রীর নাম</TableCell>
                      <TableCell>পেশা</TableCell>
                      <TableCell>মোবাইল নম্বর</TableCell>
                      <TableCell> সংযুক্তিসমূহ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCorrectionMemData?.map((member, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + member?.memberCode + '')}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Tooltip
                            title={
                              member?.actionFor == 'create'
                                ? 'নতুন সদস্য'
                                : member?.actionFor == 'update'
                                ? 'বিদ্যমান সদস্য'
                                : 'সদস্যপদ বাতিল'
                            }
                          >
                            <span className="data">
                              {member?.actionFor == 'create'
                                ? 'নতুন সদস্য'
                                : member?.actionFor == 'update'
                                ? 'বিদ্যমান সদস্য'
                                : 'সদস্যপদ বাতিল'}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              <div className="tooltip-title">
                                {member.nid ? numberToWord('' + member.nid + '') : numberToWord('' + member.brn + '')}
                              </div>
                            }
                          >
                            <span className="data">
                              {member.nid ? numberToWord('' + member.nid + '') : numberToWord('' + member.brn + '')}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + member?.dob + '')}</TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member?.memberNameBangla}</div>}>
                            <span className="data">{member?.memberNameBangla}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member?.fatherName}</div>}>
                            <span className="data">{member?.fatherName}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member?.motherName}</div>}>
                            <span className="data">{member?.motherName}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member?.spouseName}</div>}>
                            <span className="data">{member?.spouseName}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={<div className="tooltip-title">{findoccupationName(member?.occupationId)}</div>}
                          >
                            <span className="data">{findoccupationName(member?.occupationId)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{numberToWord(member.mobile)}</div>}>
                            <span className="data">{numberToWord(member.mobile)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {member.documents?.map((img) => (
                            <ZoomImage
                              src={img?.fileNameUrl}
                              imageStyle={{ width: '30px', height: '30px' }}
                              divStyle={{
                                display: 'flex',
                                float: 'left',
                                border: '1px dotted gray',
                                margin: '1px',
                              }}
                              key={img?.fileNameUrl}
                              type={imageType(img?.fileName)}
                            />
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer className="table-container lg-table">
                <Table size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell>ক্রমিক নং</TableCell>
                      <TableCell>আবেদনের ধরন</TableCell>
                      <TableCell>সদস্য সমিতির নাম</TableCell>
                      <TableCell>সমিতির সাক্ষরিত ব্যক্তি</TableCell>
                      <TableCell>সদস্য ভর্তির তারিখ</TableCell>
                      <TableCell>মোবাইল নম্বর</TableCell>
                      <TableCell> সংযুক্তিসমূহ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCorrectionMemData?.map((member, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ textAlign: 'center' }}>{numberToWord('' + (index + 1) + '')}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Tooltip
                            title={
                              member?.actionFor == 'create'
                                ? 'নতুন সদস্য'
                                : member?.actionFor == 'update'
                                ? 'বিদ্যমান সদস্য'
                                : 'সদস্যপদ বাতিল'
                            }
                          >
                            <span className="data">
                              {member?.actionFor == 'create'
                                ? 'নতুন সদস্য'
                                : member?.actionFor == 'update'
                                ? 'বিদ্যমান সদস্য'
                                : 'সদস্যপদ বাতিল'}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member?.memberName}</div>}>
                            <span className="data">{member?.memberName}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{member?.samitySignatoryPerson}</div>}>
                            <span className="data">{member?.samitySignatoryPerson}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              <div className="tooltip-title">
                                {numberToWord(dateFormat(member?.memberAdmissionDate))}
                              </div>
                            }
                          >
                            <span className="data">{numberToWord(dateFormat(member?.memberAdmissionDate))}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={<div className="tooltip-title">{numberToWord(member.mobile)}</div>}>
                            <span className="data">{numberToWord(member.mobile)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {member?.documents?.map((img) => (
                            <ZoomImage
                              src={img?.fileNameUrl}
                              imageStyle={{ width: '30px', height: '30px' }}
                              divStyle={{
                                display: 'flex',
                                float: 'left',
                                border: '1px dotted gray',
                                margin: '1px',
                              }}
                              key={img?.fileNameUrl}
                              type={imageType(img?.fileName)}
                            />
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          ) : (
            <Grid container>
              <Grid item md={12} sx={{ textAlign: 'center', fontSize: '20px' }} my={5}>
                আপনি কোন সদস্য যোগ করেননি ! নতুন সদস্য যোগ করতে{' '}
                <span style={{ color: '#2e7d32' }} className={'textAnimation'}>
                  ( সদস্য যোগ করুন )
                </span>{' '}
                বাটন ক্লিক করুন
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ApprovalMemberCorrection;
