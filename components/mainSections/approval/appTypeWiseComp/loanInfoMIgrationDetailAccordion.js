import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { useState } from 'react';
import { engToBang } from 'service/numberConverter';
import TableComponent from '../../../../service/TableComponent';
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

const ShowAccLoanInfo = (props) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  //   {
  //     "total": 1150,
  //     "scheduleNo": 1,
  //     "serviceCharge": 1250,
  //     "installmentDate": "2023/02/12",
  //     "principalBalance": 12500,
  //     "serviceChargeRate": 10,
  //     "interestPaidAmount": 104,
  //     "principalPaidAmount": 1046,
  //     "installmentPrincipalAmt": 1046,
  //     "installmentServiceChargeAmt": 104,
  //     "installmentGracePeriodChargeAmt": 0
  // }
  const columnNames = [
    'কিস্তির নম্বর',
    'কিস্তির তারিখ',
    'মূলধন (টাকা)',
    'সার্ভিস চার্জ (টাকা)',
    'কিস্তির পরিমাণ (টাকা)',
    'পরিশোধকৃত মূলধন (টাকা)',
    'পরিশোধকৃত সার্ভিস চার্জ (টাকা)',
    'সর্বমোট পরিশোধকৃত (টাকা)',
  ];
  const tableDataKeys = [
    'scheduleNo',
    'installmentDate',
    'installmentPrincipalAmt',
    'installmentServiceChargeAmt',
    'total',
    'principalPaidAmount',
    'interestPaidAmount',
    'totalPaidAmount',
  ];
  return (
    <>
      <Accordion expanded={expanded} onChange={handleChange(!expanded)}>
        <AccordionSummary>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ width: '15%' }}>{props?.val.nameBn}</div>
            <div style={{ width: '15%' }}> {props?.val.fatherName} </div>
            <div style={{ width: '15%' }}> {engToBang(props?.val.customerOldCode)}</div>
            <div style={{ width: '15%' }}> {engToBang(props?.val.customerCode)}</div>
            <div style={{ width: '15%' }}> {engToBang(props?.val.loaninfo.disbursementAmount)}</div>
            <div style={{ width: '15%' }}>
              {' '}
              {engToBang(moment(props?.val.loaninfo.disbursementDate).format('DD/MM/YYYY'))}
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <TableComponent
            columnNames={columnNames}
            tableData={props?.val.scheduleinfo}
            tableDataKeys={tableDataKeys}
            editFunction={() => { }}
            tableTitle=""
            salaries={[]}
            tableHeaderButtonHandler={() => { }}
            isPaginationTable={false}
          // plusButtonTitle="সেভিংস প্রোডাক্ট  তৈরী করুন "
          // tableShowHideCondition={salaryInfo.samityName}
          />
        </AccordionDetails>
        {/* <AccordionDetails>
          <SubHeading>সদস্যের ডকুমেন্টের তথ্য</SubHeading>
        </AccordionDetails> */}
      </Accordion>
      {/* hello there */}
    </>
  );
};
export default ShowAccLoanInfo;

// const ABC = ()=>{
//   return "hello World"
// }
// export default ABC
