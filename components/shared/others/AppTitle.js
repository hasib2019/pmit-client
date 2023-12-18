
import { Box } from '@mui/material';

function AppTitle({ children }) {
  return (
    <Box
      component="div"
      sx={{
        display: 'inline-block',
        backgroundColor: 'var(--color-bg-variant)',
        color: 'var(--color-heading)',
        borderRadius: 5,
      }}
    >
      {children}
    </Box>
  );
}

export default AppTitle;
