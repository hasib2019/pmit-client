import {
  CardMedia,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material/';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { numberToWord } from 'service/numberToWord';
import { memberInfoData } from '../../../url/coop/ApiList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Members = () => {
  const config = localStorageData('config');
  const getSamityId = localStorageData('reportsIdPer');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMemberValue();
  }, []);

  let getMemberValue = async () => {
    try {
      const memberValueData = await axios.get(memberInfoData + getSamityId, config);
      let memberValueList = memberValueData.data.data;

      setMembers(memberValueList);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ px: 2 }}>
        সদস্যের তালিকা
      </Typography>
      <Divider />
      <TableContainer sx={{ px: 1, py: 1 }}>
        <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: '#DDFFE7' }}>
            <TableRow>
              <StyledTableCell>ক্রমিক নং</StyledTableCell>
              <StyledTableCell>সদস্যের নাম</StyledTableCell>
              <StyledTableCell>পিতার নাম</StyledTableCell>
              <StyledTableCell>এনআইডি / জন্ম নিবন্ধন</StyledTableCell>
              <StyledTableCell>পেশা</StyledTableCell>
              <StyledTableCell>ছবি</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members &&
              members.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell component="th" scope="row">
                    &nbsp;&nbsp;{numberToWord('' + (i + 1) + '')}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.memberBasicInfo.memberNameBangla}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.memberBasicInfo.fatherName}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {numberToWord(row.memberBasicInfo.nid ? row.memberBasicInfo.nid : row.memberBasicInfo.brn)}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.memberBasicInfo.occupationName}
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: '5px' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 30, textAlign: 'center' }}
                      image={row.memberBasicInfo.memberPhotoUrl ? row.memberBasicInfo.memberPhotoUrl : '/avatar.png'}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Members;
