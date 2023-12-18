/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { Button, Card, CardContent, Typography } from '@mui/material';

const Audit = (props) => {
  return (
    <>
      <Card className="dashboard-info-card" {...props}>
        <div className="dashboard-info-card-head"> অডিট সম্পর্কিত তথ্য</div>
        <CardContent className="dashboard-info-content">
          <div className="info">
            <Typography>
              <span className="label">সর্বমোট সম্পাদিত অডিট</span>
              {' : '} 0
            </Typography>
            <Typography>
              <span className="label">সর্বশেষ সংগঠিত অডিট</span>
              {' : '}0
            </Typography>
            <Typography>
              <span className="label">পূর্ববর্তী অডিটের তারিখ</span>
              {' : '} ১২-০৬-২০২২
            </Typography>
            <Typography>
              <span className="label">পরিদর্শকের তথ্য</span>
              {' : '}মোঃ হাসিব
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

export default Audit;
