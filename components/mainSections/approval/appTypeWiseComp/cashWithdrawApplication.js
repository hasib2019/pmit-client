import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import ZoomImage from 'service/ZoomImage';
import { engToBang } from 'service/numberConverter';
import SubHeading from '../../../shared/others/SubHeading';



const CashWithdrawApplication = ({ allData }) => {
  const { applicationInfo } = allData;


  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      <Grid container className="section">
        <SubHeading>সমিতি ও সদস্যের তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>প্রকল্পের নাম</TableCell>
                <TableCell>সমিতি কোড</TableCell>
                <TableCell>সমিতির নাম</TableCell>
                <TableCell>সদস্যের কোড</TableCell>
                <TableCell>সদস্যের নাম</TableCell>
                <TableCell>মোবাইল নম্বর</TableCell>
                <TableCell>সদস্যের ছবি</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Tooltip title={<div className="tooltip-title">{applicationInfo?.projectNameBangla}</div>} arrow>
                    <span className="data">{applicationInfo?.projectNameBangla}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{engToBang(applicationInfo?.samityCode)}</TableCell>
                <TableCell>
                  <Tooltip title={<div className="tooltip-title">{applicationInfo?.samityName}</div>} arrow>
                    <span className="data">{applicationInfo?.samityName}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{engToBang(applicationInfo?.customerCode)}</TableCell>
                <TableCell>{applicationInfo?.customerName}</TableCell>
                <TableCell>{engToBang(applicationInfo?.mobile)}</TableCell>
                <TableCell>
                  <ZoomImage
                    src={applicationInfo?.memberPictureUrl}
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
                    type={imageType(applicationInfo?.memberPictureUrl)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* <Grid container className="section">
        <SubHeading>সদস্যের তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>সদস্যের কোড</TableCell>
                <TableCell>সদস্যের নাম</TableCell>
                <TableCell>মোবাইল নম্বর</TableCell>
                <TableCell>সদস্যের ছবি</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{engToBang(applicationInfo?.customerCode)}</TableCell>
                <TableCell>{applicationInfo?.customerName}</TableCell>
                <TableCell>{engToBang(applicationInfo?.mobile)}</TableCell>
                <TableCell>
                  <ZoomImage
                    src={applicationInfo?.memberPictureUrl}
                    divStyle={{
                      display: "flex",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                    }}
                    imageStyle={{
                      height: "50px",
                      width: "50px",
                    }}
                    key={1}
                    type={imageType(applicationInfo?.memberPictureUrl)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid> */}
      <Grid container className="section">
        <SubHeading>আবেদনের তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell>প্রোডাক্টের নাম</TableCell>
                <TableCell>হিসাবের শিরোনাম</TableCell>
                <TableCell>হিসাবের নম্বর</TableCell>
                <TableCell>বর্তমান ব্যালেন্স (টাকা)</TableCell>
                <TableCell>উত্তোলনের পরিমান (টাকা)</TableCell>
                <TableCell>মন্তব্য</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Tooltip title={<div className="tooltip-title">{applicationInfo?.productName}</div>} arrow>
                    <span className="data">{applicationInfo?.productName}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{applicationInfo?.accountTitle}</TableCell>
                <TableCell>{engToBang(applicationInfo?.accountNo)}</TableCell>
                <TableCell align="right">{engToBang(applicationInfo?.currentBalance)}</TableCell>
                <TableCell align="right">{engToBang(applicationInfo?.withdrawAmount)}</TableCell>
                <TableCell align="center">
                  <Tooltip title={<div className="tooltip-title">{applicationInfo?.narration}</div>} arrow>
                    <span className="data">{applicationInfo?.narration}</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default CashWithdrawApplication;
