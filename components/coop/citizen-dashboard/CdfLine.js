/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Card, CardContent } from '@mui/material';
import { ArcElement, Chart as ChartJS, Legend, RadialLinearScale, Tooltip } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const CdfLine = () => {
  const data = {
    labels: ['Profit Year 2020', 'Profit Year 2021', 'Profit Year 2022'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 5],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Card className="dashboard-info-card">
        <div className="dashboard-info-card-head">সিডিএফ</div>
        <CardContent
          className="dashboard-info-content"
          style={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <PolarArea data={data} style={{ paddingLeft: 0, paddingRight: 0, marginLeft: 'auto', marginRight: 'auto' }} />
        </CardContent>
      </Card>
    </>
  );
};

export default CdfLine;
