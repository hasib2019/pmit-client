import { Grid, Typography } from '@mui/material';
import SubHeading from '../../../shared/others/SubHeading';
import ShowAccLoanInfo from './loanInfoMIgrationDetailAccordion';

const LoanInfoMigrationApproval = ({ allData }) => {
  ('iamHere');
  'samityCreateApprovel Data are:', allData;
  const { samityInfo, loanInfo } = allData;
  'loanInfo', loanInfo;
  return (
    <>
      <Grid
        container
        md={12}
        xs={12}
        lg={12}
        spacing={2.5}
        direction="row"
        justifyContent="center"
        sx={{ paddingLeft: '20px' }}
      >
        <SubHeading>সমিতির তথ্য</SubHeading>
        <Typography sx={{ width: { xs: '100%', md: '50%' } }}>
          <span className="label"> সমিতির নাম </span>
          <span className="label-clone">:</span>
          {samityInfo && samityInfo.samityName}
        </Typography>
        <Typography sx={{ width: { xs: '100%', md: '50%' } }}>
          <span className="label"> সমিতির ঠিকানা </span>
          <span className="label-clone">:</span>
          {samityInfo && samityInfo.address}
        </Typography>
      </Grid>
      <Grid
        container
        md={12}
        xs={12}
        lg={12}
        spacing={2.5}
        justifyContent="center"
        sx={{ paddingLeft: '20px', marginTop: '10px' }}
      >
        <SubHeading>মেম্বারের তথ্য</SubHeading>
        {/* <TableContainer >
                    <Table size="small" aria-label="a dense table">
                        <TableHead sx={{ backgroundColor: "#C0D8C0" }}>
                            <TableRow>
                                <div >
                                    নাম
                                </div>
                                <div >
                                    পিতার নাম
                                </div>
                                <div >
                                    মাতার নাম
                                </div>
                                <div >
                                    মোবাইল নম্বর
                                </div>
                                <div >
                                    ইমেইল
                                </div>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applicationInfo && applicationInfo.data && applicationInfo.data.memberInfo &&
                                applicationInfo.data.memberInfo.map((v, i) => (
                                    <TableRow key={v.id}>
                                        <div colSpan={5} key={v.id}> <ShowAcc val={v} ind={i} /> </div>
                                    </TableRow>
                                ))}

                        </TableBody>
                    </Table>
                </TableContainer> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            background: 'var(--color-bg)',
            padding: '15px',
          }}
        >
          <div style={{ width: '18%' }}>নাম</div>
          <div style={{ width: '15%' }}>পিতার নাম</div>
          <div style={{ width: '15%' }}>সদস্যের পুরাতন কোড</div>
          <div style={{ width: '15%' }}>সদস্যের নতুন কোড</div>
          <div style={{ width: '15%' }}>ঋণের পরিমাণ</div>
          <div style={{ width: '15%' }}>ঋণ বিতরণের তারিখ</div>
        </div>
        {loanInfo &&
          loanInfo.length > 0 &&
          loanInfo.map((v, i) => (
            <div key={v.id} style={{ width: '100%' }}>
              <div key={v.id}>
                {' '}
                <ShowAccLoanInfo val={v} ind={i} />{' '}
              </div>
            </div>
          ))}
      </Grid>
    </>
  );
};

export default LoanInfoMigrationApproval;
