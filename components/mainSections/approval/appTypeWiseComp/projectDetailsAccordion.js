import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Divider } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(() => ({
  border: `1px solid #f9f9f9`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: '#707070' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#D3DEDC',
  color: '#707070',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
  fontSize: '17px',
}));

export default function ProjectDetailsAccordion({ value, index }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion expanded={expanded} onChange={handleChange(!expanded)}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>আওতাধীন প্রকল্প - {index + 1}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <span style={{ color: '#707070' }}>
            প্রকল্পের নাম : <span style={{ color: '#4E944F' }}>{value.projectNameBangla}</span>
          </span>
          <br />
          <Divider />
          <span style={{ color: '#707070' }}>
            প্রকল্প পরিচালকের নাম : <span style={{ color: '#4E944F' }}>{value.projectDirector}</span>
          </span>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
