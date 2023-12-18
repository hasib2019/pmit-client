import { Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';

const SamityReport = () => {
  return (
    <>
      <Grid
        item
        md={12}
        xs={12}
        mx={2}
        my={2}
        px={1}
        pt={2}
        pb={2}
        sx={{ backgroundColor: '#FAFAFA', borderRadius: '10px' }}
      >
        <Grid item md={12} xs={12}>
          <Grid container spacing={2.5}>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="উপজেলার/শাখা নাম"
                name="district"
                required
                select
                SelectProps={{ native: true }}
                // onChange={(e) => handleInputChangeDistrict(e)}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF' }}
              // value={memberApporval.district}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {/* {districtData.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.districtNameBangla}
                            </option>
                        ))} */}
              </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="সমিতির নাম"
                name="upazila"
                required
                select
                SelectProps={{ native: true }}
                // onChange={(e) => handleInputChangeUpazila(e)}
                type="text"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF' }}
              // value={memberApporval.upazila}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {/* {upozilaData.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.upazilaNameBangla}
                            </option>
                        ))} */}
              </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="সমিতির স্ট্যাটাস"
                select
                SelectProps={{ native: true }}
                // onChange={(e) => handleInputChangeShongho(e)}
                type="text"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF' }}
              //  value={memberApporval.upazila}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {/* {shongho.map((option, i) => (
                            <option key={i} value={JSON.stringify({val: option.id, insName: option.shareAmount, insAdd: option.address})} >
                                {option.samityName}
                            </option>
                        ))} */}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
        mx={2}
        my={2}
        px={1}
        pt={2}
        pb={2}
        sx={{ backgroundColor: '#FAFAFA', borderRadius: '10px' }}
      >
        <Grid item md={12} xs={12}>
          <Grid container spacing={2.5}>
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: '#d29119' }}>
                <TableRow>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>কিশোরী সদস্যের নাম</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>আইডি নং</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>জন্ম নিবন্ধন / আইডি নং</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>
                    বর্তমান ঠিকানা
                  </TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>পিতার নাম</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>মাতার নাম</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>বৈধ অবিভাবকের নাম</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>বৈধ অবিভাবকের মোবাইল নম্বর</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>ছবি</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>সাক্ষর</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {reportInfo && reportInfo.length > 0 ? reportInfo.map((member, index) => (
                            <TableRow key={member.id} >
                                <TableCell sx={{ p: "5px" }}>
                                   {member.nameEn}                                           
                                </TableCell>
                                <TableCell sx={{ p: "5px" }}>
                                   {member.customerCode}
                                </TableCell>
                                <TableCell sx={{ p: "5px" }}>
                                   {member.samityCode}
                                </TableCell>
                                <TableCell sx={{ p: "5px" }}>
                                  {member.nomineeName}
                                </TableCell>
                                <TableCell sx={{ p: "5px",width:"10%" }}>
                                    {member.fatherName}
                                </TableCell>
                                <TableCell sx={{ p: "5px",width:"10%" }} >
                                   {member.motherName}
                                </TableCell>                                           
                                <TableCell sx={{ p: "5px",width:"10%" }}>
                                   {member.guardianName}
                                </TableCell>
                                <TableCell sx={{ p: "5px", textAlign: "center" }}>
                                   {member.mobile}
                                </TableCell>
                                <TableCell sx={{ p: "5px", textAlign: "center" }}>
                                   {member.guardianName}
                                </TableCell>
                                <TableCell sx={{ p: "5px", textAlign: "center" }}>
                                   {member.guardianName}
                                </TableCell>
                            </TableRow>
                        )) : " "} */}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SamityReport;
