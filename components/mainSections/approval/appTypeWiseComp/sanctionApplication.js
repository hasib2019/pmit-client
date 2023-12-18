/* eslint-disable @next/next/no-img-element */
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import ZoomImage from 'service/ZoomImage';
import { engToBang } from 'service/numberConverter';
import SubHeading from '../../../shared/others/SubHeading';


const SanctionApplication = ({ allData }) => {
  const { documentList, grantorInfo, applicationInfos, appHistory, memberInfo } = allData;

  function createMarkup(value) {
    return {
      __html: value,
    };
  }

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      <Grid container className="section">
        <SubHeading>সদস্যের তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>সদস্যের নাম</TableCell>
                <TableCell>সদস্য কোড</TableCell>
                <TableCell>মোবাইল নং</TableCell>
                <TableCell>সমিতির নাম</TableCell>
                <TableCell>সমিতি কোড</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Tooltip title={<div className="tooltip-title">{memberInfo?.nameBn}</div>} arrow>
                    <span className="data">{memberInfo?.nameBn}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{engToBang(memberInfo.customerCode)}</TableCell>
                <TableCell>{engToBang(memberInfo.mobile)}</TableCell>
                <TableCell>
                  <Tooltip title={<div className="tooltip-title">{applicationInfos.samityName}</div>} arrow>
                    <span className="data">{applicationInfos.samityName}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{engToBang(applicationInfos.samityCode)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid container className="section">
        <SubHeading>আবেদনের তথ্য</SubHeading>
        <Grid container spacing={2.5}>
          <Grid item md={12} sm={12} xs={12}>
            <TableContainer className="table-container">
              <Table size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell width="12%">ঋণের পরিমান (টাকা)</TableCell>
                    <TableCell align="center">ঋণের মেয়াদ (মাস)</TableCell>
                    <TableCell align="right">কিস্তির পরিমান (টাকা)</TableCell>
                    <TableCell align="center">কিস্তির সংখ্যা</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="right">{engToBang(applicationInfos.loanAmount)}</TableCell>
                    <TableCell align="center">{engToBang(applicationInfos.loanTerm)}</TableCell>
                    <TableCell align="right">{engToBang(applicationInfos.installmentAmount)}</TableCell>
                    <TableCell align="center">{engToBang(applicationInfos.installmentNumber)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <TableContainer className="table-container">
              <Table size="small" aria-label="a dense table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell sx={{ width: '35%' }}>জামিনদারের এনআইডি</TableCell>
                    <TableCell sx={{ width: '30%' }}>জামিনদারের ঠিকানা</TableCell>
                    <TableCell sx={{ width: '35%' }}>জামিনদারের মোবাইল নং</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grantorInfo.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell>{engToBang(v.nidNumber)}</TableCell>
                      <TableCell>{v.perAddress ? v.perAddress : ''}</TableCell>
                      <TableCell>{engToBang(v.mobile)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
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
                  {appHistory.map((v, i) => (
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="section">
        <SubHeading>ডকুমেন্টের তথ্য</SubHeading>
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
              {documentList.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.docTypeName}</TableCell>
                  <TableCell>{v.documentNumber ? v.documentNumber : 'বিদ্যমান নেই'}</TableCell>
                  <TableCell align="center">
                    <ZoomImage
                      src={v.documentFrontUrl}
                      divStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                      }}
                      imageStyle={{
                        height: '50px',
                        width: '50px',
                      }}
                      key={1}
                      type={imageType(v.documentFront)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {v.documentBack ? (
                      <ZoomImage
                        src={v.documentBackUrl}
                        divStyle={{
                          display: 'flex',
                          justifyContent: 'center',
                          height: '100%',
                          width: '100%',
                        }}
                        imageStyle={{
                          height: '50px',
                          width: '50px',
                        }}
                        key={1}
                        type={imageType(v.documentBack)}
                      />
                    ) : (
                      'বিদ্যমান নেই'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default SanctionApplication;
