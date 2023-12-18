/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Card, CardContent, Typography } from '@mui/material';

const AllApplication = ({ applicationData }) => {
  return (
    <Card className="dashboard-counter">
      <Typography className="counter-name">নিবন্ধন প্রদান</Typography>
      <CardContent>
        <Typography className="counter-value">{applicationData?.primarySamityApprove}</Typography>
      </CardContent>
    </Card>
  );
};

export default AllApplication;
