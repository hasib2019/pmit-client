import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SubHeading from '../../../shared/others/SubHeading';
import { engToBang } from '../../samity-managment/member-registration/validator';
import ShowAcc from './samityDetailsAccordion';

const SamityCreateApprovel = ({ allData }) => {
  const { applicationInfo, history } = allData;

  function createMarkup(value) {
    return {
      __html: value,
    };
  }

  return (
    <>
      <Grid item xs={12}>
        <SubHeading>সমিতির তথ্য</SubHeading>
        <Grid container display="flex" sx={{ paddingLeft: '10px' }}>
          <Grid item md={4} xs={12}>
            <Typography>
              <span className="label">প্রকল্পের নাম : &nbsp;</span>
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.projectNameBangla}
            </Typography>
            <Typography>
              <span className="label">সমিতির নাম : &nbsp;</span>
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.samityName}
            </Typography>
            <Typography>
              <span className="label">সমিতির ঠিকানা: &nbsp;</span>{' '}
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.address}{' '}
            </Typography>
            <Typography>
              <span className="label">মিটিং এর দিন:&nbsp;</span>{' '}
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.meetingDayName}
            </Typography>
            <Typography>
              <span className="label">মিটিং এর ধরন:&nbsp;</span>{' '}
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.meetingType == 'W'
                ? 'সাপ্তাহিক'
                : 'মাসিক '}
            </Typography>
            <Typography>
              <span className="label"> মাঠ কর্মী :&nbsp;</span>{' '}
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.foName}
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography>
              <span className="label">বিভাগ :&nbsp;</span>{' '}
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.districtNameBangla}
            </Typography>
            <Typography>
              <span className="label">জেলা :&nbsp;</span>{' '}
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.uniThanaPawNameBangla}{' '}
            </Typography>
            <Typography>
              {' '}
              <span className="label">উপজেলা :&nbsp;</span>{' '}
              {applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.basic &&
                applicationInfo.data.basic.upaCityNameBangla}
            </Typography>
            <Typography>
              {' '}
              <span className="label">সামিতির সর্বনিম্ন সদস্য :&nbsp;</span>{' '}
              {engToBang(
                applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.setup &&
                applicationInfo.data.setup.samityMinMember,
              )}
            </Typography>
            <Typography>
              {' '}
              <span className="label">সামিতির সর্বোচ্চ সদস্য :&nbsp;</span>{' '}
              {engToBang(
                applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.setup &&
                applicationInfo.data.setup.samityMaxMember,
              )}
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography>
              {' '}
              <span className="label">সদস্যের সর্বোচ্চ বয়স :&nbsp;</span>{' '}
              {engToBang(
                applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.setup &&
                applicationInfo.data.setup.memberMaxAge,
              )}
            </Typography>
            <Typography>
              {' '}
              <span className="label">সদস্যের সর্বনিম্ন বয়স :&nbsp;</span>{' '}
              {engToBang(
                applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.setup &&
                applicationInfo.data.setup.memberMinAge,
              )}
            </Typography>
            <Typography>
              {' '}
              <span className="label">দলের সর্বনিম্ন সদস্য :&nbsp;</span>{' '}
              {engToBang(
                applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.setup &&
                applicationInfo.data.setup.groupMinMember,
              )}
            </Typography>
            <Typography>
              {' '}
              <span className="label">দলের সর্বোচ্চ সদস্য :&nbsp;</span>{' '}
              {engToBang(
                applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.setup &&
                applicationInfo.data.setup.groupMaxMember,
              )}
            </Typography>
            <Typography>
              {' '}
              <span className="label">শেয়ার সংখ্যা :&nbsp;</span>{' '}
              {engToBang(
                applicationInfo &&
                applicationInfo.data &&
                applicationInfo.data.setup &&
                applicationInfo.data.setup.shareAmount,
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={12} justifyContent="center" sx={{ marginTop: '10px' }}>
        <SubHeading>নতুন সদস্যসমূহের ভর্তির আবেদন</SubHeading>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            background: 'var(--color-bg)',
            padding: '15px',
          }}
        >
          <div style={{ width: '18%', paddingLeft: '2rem' }}>নাম</div>
          <div style={{ width: '15%' }}>পিতার নাম</div>
          <div style={{ width: '15%' }}>মাতার নাম</div>
          <div style={{ width: '13%' }}>মোবাইল নম্বর</div>
          <div style={{ width: '17%' }}>ইমেইল</div>
        </div>
        {applicationInfo &&
          applicationInfo.data &&
          applicationInfo.data.memberInfo &&
          applicationInfo.data.memberInfo.map((v, i) => (
            <div key={v.id} style={{ width: '100%' }}>
              <div key={v.id}>
                {' '}
                <ShowAcc val={v} ind={i} />{' '}
              </div>
            </div>
          ))}
      </Grid>
      <TableContainer className="hvr-underline-from-center hvr-shadow" sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <Table size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: '#B8FFF9' }}>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>মন্তব্যকারীর নাম</TableCell>
              <TableCell sx={{ width: '30%' }}>কার্যক্রম</TableCell>
              <TableCell sx={{ width: '30%' }}>মন্তব্য</TableCell>
              <TableCell sx={{ width: '30%' }}>সংযুক্তি</TableCell>
              <TableCell sx={{ width: '10%' }}>তারিখ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(history) &&
              history.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.nameBn}</TableCell>
                  <TableCell>{v.actionText}</TableCell>
                  <TableCell>
                    {' '}
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
    </>
  );
};

export default SamityCreateApprovel;
