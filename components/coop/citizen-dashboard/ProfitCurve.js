/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Card, CardContent } from '@mui/material';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfitCurve = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
  };
  const labels = ['2020', '2021', '2022'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Profit Year 2020',
        data: ['2000', '5000', '9000'],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Profit Year 2021',
        data: ['9001', '10000', '12000'],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Profit Year 2022',
        data: ['2012', '2013', '2015'],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return (
    <>
      <Card className="dashboard-info-card">
        <div className="dashboard-info-card-head">প্রফিট কার্ভ</div>
        <CardContent className="dashboard-info-content" style={{ height: '300px' }}>
          <Bar options={options} data={data} />;
        </CardContent>
      </Card>
    </>
  );
};

export default ProfitCurve;
