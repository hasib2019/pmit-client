
import { CardContent } from '@mui/material';

function Title({ children }) {
  return (
    <CardContent
      style={{
        backgroundColor: 'var(--color-bg-variant)',
        color: 'var(--color-heading)',
        borderRadius: 5,
        fontSize: '18px',
      }}
    >
      {children}
    </CardContent>
  );
}

export default Title;
