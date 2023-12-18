/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Button, Card, CardContent, Typography } from '@mui/material';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';

const ReturnInfo = (props) => {
  return (
    <>
      <Card className="dashboard-info-card" {...props}>
        <div className="dashboard-info-card-head">রিটার্ন সম্পর্কিত তথ্য</div>
        <CardContent className="dashboard-info-content">
          <div className="info">
            <Typography>
              <span className="label">সর্বমোট সম্পাদিত রিটার্ন</span>
              {' : '} 0
            </Typography>
            <Typography>
              <span className="label">পূর্ববর্তী রিটার্নের তারিখ</span>
              {' : '} ১২-০৬-২০২২
            </Typography>
          </div>
          <Button size="small">
            <ViewComfyIcon />
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default ReturnInfo;
