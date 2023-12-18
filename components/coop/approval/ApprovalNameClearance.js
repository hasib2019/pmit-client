/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Grid } from '@mui/material';

const ApprovalNameClearance = (props) => {
  return (
    <>
      <Grid item className="approve-info">
        <Grid container spacing={2.5}>
          <Grid item md={6} xs={12}>
            <div className="info">
              <span className="label">সমিতির নাম :&nbsp;</span>
              {props.samityName}
            </div>
          </Grid>
          <Grid item md={6} xs={12} sx={{ paddingTop: { xs: '0 !important', md: '12px !important' } }}>
            <div className="info">
              <span className="label">সমিতির ধরন :&nbsp;</span>
              {props.samityTypeName}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ApprovalNameClearance;
