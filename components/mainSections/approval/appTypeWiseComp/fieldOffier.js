import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const fieldOffier = ({ allData }) => {
  //   const { projectInfo, userInfo, appHistory } = allData;
  const { applicationInfo, history } = allData;
  let employeeInfo = applicationInfo;
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
  return (
    <Grid container>
      <Grid item md={12} sm={12} xs={12} className="section">
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table" className="table-alter">
            <TableHead className="table-head">
              <TableRow>
                <TableCell sx={{ width: '30%' }}>নাম</TableCell>
                <TableCell sx={{ width: '20%' }}>পদবী </TableCell>
                <TableCell sx={{ width: '50%' }}>অফিসের নাম</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeInfo
                ? employeeInfo.map((items, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{items.employeeName}</TableCell>
                      <TableCell>{items.designationBn}</TableCell>
                      <TableCell>{items.officeName}</TableCell>
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
              {history.map((v, i) => (
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

export default fieldOffier;
