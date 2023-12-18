// **************************************Development By Md. Hasibuzzaman****************************************
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */

import { Card, CardContent, Typography } from '@mui/material';

const NewApplication = (props) => (
  <Card className="dashboard-counter" {...props}>
    <Typography className="counter-name">অপেক্ষমান নিবন্ধন</Typography>
    <CardContent>
      <Typography className="counter-value">0</Typography>
    </CardContent>
  </Card>
);

export default NewApplication;
