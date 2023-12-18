import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const SamityAndMemberRegistration = () => {

  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12}>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>সদস্যের কোড</TableCell>
                  <TableCell>সদস্যের নাম</TableCell>
                  <TableCell>জাতীয় পরিচয় পত্র নম্বর</TableCell>
                  <TableCell>মোবাইলে নম্বর</TableCell>
                  <TableCell>নির্বাচন করুন*</TableCell>
                  <TableCell>বিস্তারিত</TableCell>
                </TableRow>
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SamityAndMemberRegistration;
