import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';





const ProjectAssign = (props) => {
  const { appInfo, history } = props.allData;
  ({ appInfo, history });
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  return (
    <Grid container>
      <Grid item md={12} sm={12} xs={12} className="section">
        <Paper
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            padding: '10px',
          }}
        >
          <Typography>
            <span className="label">নাম : &nbsp;</span>
            {appInfo && appInfo.nameBn}
          </Typography>
          <Typography>
            <span className="label">পদবী : &nbsp;</span>
            {appInfo && appInfo.designationBn}
          </Typography>
        </Paper>
      </Grid>
      <Grid item md={12} sm={12} xs={12} className="section">
        <Grid md={12} xs={12}></Grid>
        <SubHeading>আওতাধীন প্রকল্পের তথ্য</SubHeading>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table" className="table-alter">
            <TableHead className="table-head">
              <TableRow>
                <TableCell sx={{ width: '30%' }}>প্রকল্পের নাম</TableCell>
                <TableCell sx={{ width: '20%' }}>প্রকল্প পরিচালক</TableCell>
                <TableCell sx={{ width: '50%' }}>স্ট্যাটাস</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appInfo && appInfo.assignProjectsDetailsInfo
                ? appInfo.assignProjectsDetailsInfo.map((items, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{items.projectNameBangla}</TableCell>
                      <TableCell>{items.projectDirector}</TableCell>
                      <TableCell>{items.changeStatus == 'N' ? 'নতুন' : 'বাতিল'}</TableCell>
                    </TableRow>
                  );
                })
                : ''}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item md={12} sm={12} xs={12} className="section">
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table" className="table-alter">
            <TableHead className="table-head">
              <TableRow>
                <TableCell sx={{ width: '20%' }}>মন্তব্যকারীর নাম</TableCell>
                <TableCell sx={{ width: '30%' }}>কার্যক্রম</TableCell>
                <TableCell sx={{ width: '30%' }}>মন্তব্য</TableCell>
                <TableCell sx={{ width: '30%' }}>সংযুক্তি</TableCell>
                <TableCell sx={{ width: '1%' }}>তারিখ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history?.map((v, i) => (
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
  );
};

export default ProjectAssign;
