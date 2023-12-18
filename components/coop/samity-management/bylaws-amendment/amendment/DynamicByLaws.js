/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { engToBang } from 'service/numberConverter';
import PartialByLawsData from './PartialByLawsData';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// function createMarkup(value) {
//   return {
//     __html: value,
//   };
// }

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
// const modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { font: [] }],
//     [{ size: [] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
//     ['link'],
//     ['clean'],
//   ],
//   clipboard: {
//     matchVisual: false,
//   },
// };

const toolbarOptions = [
  // Specify all the toolbar buttons you want to display
  ['bold', 'italic', 'underline', 'strike'],
  [{ header: 1 }, { header: 2 }],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
];

const DynamicByLaws = ({
  index,
  previousByLaws,
  byLawsData,
  setByLawsData,
  isApproval,
  newAmendmentData,
  setNewAmendmentData,
}) => {
  const alreadyData = (getData, index, i) => {
    return (
      <Grid item sm={12} md={6} xs={12}>
        <Typography align="center" sx={{ color: '#FF0000' }}>
          বিদ্যমান
        </Typography>
        <Card key={i} sx={{ padding: '0' }}>
          <ReactQuill
            theme="snow"
            readOnly
            value={getData && getData[index]?.data[i]?.data}
            formats={[]} // Disable all text formatting
            style={{ color: 'red' }} // Set the text color to red
            modules={{ toolbar: { container: toolbarOptions, handlers: {} } }} // Customize the toolbar options
            className="quill-disabled"
          />
        </Card>
      </Grid>
    );
  };
  const removeHtmlTags = (htmlString) => {
    const temporaryElement = document.createElement('div');
    temporaryElement.innerHTML = htmlString;
    return temporaryElement.textContent || temporaryElement.innerText || '';
  };
  return (
    <div>
      {byLawsData[index].data?.map(
        (row, i) =>
          ((row?.isEdit && isApproval) || !isApproval) && (
            <Accordion
              key={i}
              expanded={row?.isOpen}
              onChange={() =>
                setByLawsData((draft) => {
                  draft[index].data[i].isOpen = !draft[index].data[i].isOpen;
                })
              }
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                sx={{ backgroundColor: row?.isOpen && '#e1f6ff' }}
              >
                <Typography>{engToBang(row?.sectionNo) + ') ' + row?.sectionName}</Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 1, m: 0 }}>
                {row?.type === 'partial' ? (
                  // if partial data then show this one
                  <PartialByLawsData
                    key={i}
                    {...{
                      index,
                      i,
                      previousByLaws,
                      byLawsData,
                      setByLawsData,
                      isApproval,
                      isEditable: row?.isEditable === 'Y' ? true : false,
                      newAmendmentData,
                      setNewAmendmentData,
                    }}
                  />
                ) : (
                  // in ohter then load this one
                  <Grid container spacing={2} pb={1} key={i}>
                    {previousByLaws && alreadyData(previousByLaws, index, i)}
                    <Grid item sm={12} md={6} xs={12}>
                      {row?.isEditable === 'Y' && isApproval == false ? (
                        <div key={`${index}-${i}`}>
                          <Typography align="center" sx={{ color: '#2b7936' }}>
                            আবেদিত
                          </Typography>
                          <Card sx={{ padding: '0' }}>
                            <CardContent sx={{ padding: '0' }}>
                              <ReactQuill
                                theme="snow"
                                style={{ marginBottom: '-25px' }}
                                value={row?.data}
                                // modules={modules}
                                modules={{ toolbar: { container: toolbarOptions, handlers: {} } }}
                                onChange={(e) =>
                                  setByLawsData((draft) => {
                                    draft[index].data[i].isEdit =
                                      removeHtmlTags(draft[index].data[i].data) == removeHtmlTags(e) ? false : true;
                                    draft[index].data[i].data = e;
                                  })
                                }
                              />
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div key={index}>
                          <Typography align="center" sx={{ color: '#2b7936' }}>
                            {row?.isEditable === 'N' ? 'আবেদনের অনুমতি নেই।' : 'আবেদিত'}
                          </Typography>
                          <Card sx={{ padding: '0' }}>
                            <CardContent sx={{ padding: 0 }}>
                              <ReactQuill
                                theme="snow"
                                readOnly
                                value={row?.data}
                                style={{ marginBottom: '-25px' }}
                                formats={[]}
                                modules={{ toolbar: { container: toolbarOptions, handlers: {} } }}
                                className="quill-disabled"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ),
      )}
    </div>
  );
};

export default DynamicByLaws;
