import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { omit } from 'lodash';
import { useEffect, useState } from 'react';
import { engToBang } from '../../../../service/numberConverter';
import SubHeading from '../../../shared/others/SubHeading';



const labelObj = {
  newFoCode: 'আবেদনকৃত মাঠ কর্মী',
  oldFoCode: 'পুরাতন মাঠ কর্মী',
  oldAddress: 'পুরাতন ঠিকানা',
  newAddress: 'আবেদনকৃত ঠিকানা',
  newMeetingDay: 'আবেদনকৃত মিটিং এর দিন',
  oldMeetingDay: 'পুরাতন মিটিং এর দিন',
  newMemberMinAge: 'আবেদনকৃত সদস্যের সর্বনিম্ন বয়স',
  oldMemberMinAge: 'পুরাতন সদস্যের সর্বনিম্ন বয়স',
  newMemberMaxAge: 'আবেদনকৃত সদস্যের সর্বোচ্চ বয়স',
  oldMemberMaxAge: 'পুরাতন সদস্যের সর্বোচ্চ বয়স',
  oldRadioValue: '',
  newRadioValue: '',
  oldSamityMinMember: 'পুরাতন সমিতির সবনিম্ন সদস্য ',
  newSamityMinMember: 'আবেদনকৃত সমিতির সবনিম্ন সদস্য ',
  oldSamityMaxMember: 'পুরাতন সমিতির সর্বোচ্চ সদস্য ',
  newSamityMaxMember: 'আবেদনকৃত সমিতির সর্বোচ্চ সদস্য ',
  oldGroupMinMember: 'পুরাতন দলের সর্বনিম্ন সদস্য',
  newGroupMinMember: 'আবেদনকৃত দলের সর্বনিম্ন সদস্য',
  oldGroupMaxMember: 'পুরাতন দলের সর্বোচ্চ সদস্য',
  newGroupMaxMember: 'আবেদনকৃত দলের সর্বোচ্চ সদস্য',
  oldInstituteName: 'পুরাতন হাই স্কুলের নাম',
  newInstituteName: 'আবেদনকৃত হাই স্কুলের নাম',
  oldInstituteAddress: 'পুরাতন হাই স্কুলের নাম ঠিকানা',
  newInstituteAddress: 'আবেদনকৃত হাই স্কুলের নাম ঠিকানা',
  newSamityMemberType: 'আবেদনকৃত সদস্যের ধরণ',
  oldSamityMemberType: 'পুরাতন সদস্যের ধরণ',
};

const SamityUpdateApproval = (props) => {
  const [samityBasicInfo, setSamityBasicInfo] = useState(props?.allData?.applicationInfo);
  useEffect(() => {
    // const omitKey = _.omit(props?.allData?.applicationInfo,['applicationId','serviceId']);
    setSamityBasicInfo(omit(props?.allData?.applicationInfo, ['applicationId', 'serviceId']));
  }, [props]);

  const { applicationInfo, history } = props.allData;
  function createMarkup(value) {
    return {
      __html: value,
    };
  }
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
        <SubHeading>সমিতির তথ্য(পূর্ববর্তী এবং পরবর্তী)</SubHeading>
        <Grid container display="flex">
          <Grid item md={12} xs={12}>
            {applicationInfo
              ? applicationInfo &&
              Object.keys(samityBasicInfo).map((elem, i) => (
                <Box
                  sx={{
                    display: 'inline',
                    visibility: 'visible',
                    margin: '10px',
                  }}
                  key={1}
                >
                  {elem in labelObj && labelObj[elem] + ' ' + ':'}{' '}
                  {elem in labelObj && samityBasicInfo[elem] && Number(samityBasicInfo[elem])
                    ? engToBang(samityBasicInfo[elem])
                    : samityBasicInfo[elem]}
                  {i % 2 == '1' && <br />}
                </Box>
              ))
              : ''}
          </Grid>
        </Grid>
      </Grid>
      <TableContainer className="hvr-underline-from-center hvr-shadow" sx={{ marginTop: '20px' }}>
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

export default SamityUpdateApproval;
