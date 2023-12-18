/**
 * @author2 Md Saifur Rahman
 * @email saifur1985bd@gmail.com
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
import { unescape } from 'underscore';
import { applicationGetById } from '../../../url/coop/ApiList';

const ApprovalAbasayan = (props) => {
  const config = localStorageData('config');
  const [samityInfo, setSamityInfo] = useState([]);
  const [contents, setContents] = useState('');
  const [applyDates, setApplyDates] = useState('');
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    samityReport(props.id);
  }, []);

  const samityReport = async (id) => {
    const samityData = await axios.get(applicationGetById + id, config);
    const data = samityData?.data?.data[0]?.data;
    setSamityInfo(data?.samityInfo);
    setContents(data?.content);
    setApplyDates(data?.applyDate);
    setDocuments(data?.documentInfo);
  };

  const imageType = (imageName) => {
    const lastWord = imageName.split('.').pop();
    return lastWord;
  };

  return (
    <>
      <Grid item xs={12} className="approve-info">
        <Grid container>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নাম :&nbsp;</span>
              {samityInfo?.samityName}
            </div>
            <div className="info">
              <span className="label">সমিতির ধরন :&nbsp;</span>{' '}
              {samityInfo?.samityLevel == 'P'
                ? ' প্রাথমিক সমিতি'
                : samityInfo?.samityLevel == 'C'
                ? ' কেন্দ্রীয় সমিতি'
                : samityInfo?.samityLevel == 'N'
                ? ' জাতীয় সমিতি'
                : ''}
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নিবন্ধনের তারিখ :&nbsp;</span>{' '}
              {samityInfo?.samityRegDate && numberToWord('' + samityInfo?.samityRegDate + '')}
            </div>
            <div className="info">
              <span className="label">সমিতির নিবন্ধন নম্বর :&nbsp;</span>{' '}
              {samityInfo?.samityCode && numberToWord('' + samityInfo?.samityCode + '')}
            </div>
          </Grid>
          <Grid container>
            <Grid item md={6} xs={12}>
              <div className="info">
                <span className="label">অবসায়নের জন্য আবেদন :&nbsp;</span>{' '}
                {applyDates && numberToWord('' + applyDates + '')}
              </div>
            </Grid>
            <Grid item md={6} xs={12}>
              <div className="info">
                <span className="label">অবসায়নের কারণ :&nbsp;</span>{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: unescape(contents),
                  }}
                ></span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>অবসায়নের ডকুমেন্ট</SubHeading>
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
    </>
  );
};

export default ApprovalAbasayan;
