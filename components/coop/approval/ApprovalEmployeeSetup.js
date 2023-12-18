/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */

import { Grid } from '@mui/material';

const ApprovalEmployeeSetup = (props) => {
  return (
    <>
      <Grid item md={12} xs={12} mx={2} my={2} px={2} py={2} sx={{ backgroundColor: '#5fc5cf', borderRadius: '10px' }}>
        <Grid container spacing={2.5} sx={{ color: '#000e73' }}>
          <Grid item md={12} xs={12}>
            <span style={{ fontSize: '35px' }}>সমিতির নাম : </span>
            <span> {props.samityName}</span>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ApprovalEmployeeSetup;
