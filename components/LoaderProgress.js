import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import * as React from 'react';

function LinearProgressWithLabel(props) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box sx={{ width: '33%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const LoaderProgress = () => {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <div>
        <LinearProgressWithLabel value={progress} />
      </div>
    </Box>
  );
};

export default LoaderProgress;
