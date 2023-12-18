import AssignmentIcon from '@mui/icons-material/Assignment';
import { Avatar, Box } from '@mui/material';
function Heading({ children }) {
  return (
    <Box className="heading">
      <Avatar className="icon">
        <AssignmentIcon />
      </Avatar>
      <Box component="span">{children}</Box>
    </Box>
  );
}
export default Heading;
