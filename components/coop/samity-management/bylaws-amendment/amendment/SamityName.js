/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { engToBang } from 'service/numberConverter';
import PartialByLawsData from './PartialByLawsData';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
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
}));

const SamityName = ({
  element,
  index,
  i,
  previousByLaws,
  byLawsData,
  setByLawsData,
  isApproval,
  newAmendmentData,
  setNewAmendmentData,
}) => {
  return (
    <Accordion
      expanded={element?.isOpen}
      onChange={() =>
        setByLawsData((draft) => {
          draft[index].data[i].isOpen = !draft[index].data[i].isOpen;
        })
      }
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        sx={{ backgroundColor: element?.isOpen && '#e1f6ff' }}
      >
        <Typography>{engToBang(element?.sectionNo) + ') ' + element?.sectionName}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, m: 0 }}>
        <PartialByLawsData
          {...{
            index,
            i,
            previousByLaws,
            byLawsData,
            setByLawsData,
            isApproval,
            isEditable: element?.isEditable === 'Y' ? true : false,
            newAmendmentData,
            setNewAmendmentData,
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default SamityName;
