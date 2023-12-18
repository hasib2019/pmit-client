import { Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
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
const PartialByLawsData = ({
  index,
  i,
  previousByLaws,
  byLawsData,
  setByLawsData,
  isApproval,
  isEditable,
  newAmendmentData,
  setNewAmendmentData,
}) => {
  const alreadyData = (getData, isRight) => {
    let mergedResult = '';
    getData &&
      getData.forEach((item) => {
        mergedResult += item.data + ' ';
      });
    return (
      <Grid item sm={12} md={6} xs={12}>
        <Typography align="center" sx={{ color: isRight ? 'green' : '#FF0000' }}>
          {isRight ? 'আবেদিত' : 'বিদ্যমান'}
        </Typography>
        <Card sx={{ padding: '0' }}>
          <ReactQuill
            theme="snow"
            readOnly
            value={mergedResult || 'no data found'}
            formats={[]} // Disable all text formatting
            style={{ color: isRight ? 'black' : 'red' }} // Set the text color to red
            modules={{ toolbar: { container: toolbarOptions, handlers: {} } }} // Customize the toolbar options
            className="quill-disabled"
          />
        </Card>
      </Grid>
    );
  };
  const handleChange = (e, index, i, nextIndex) => {
    const { name, value } = e.target;
    switch (name) {
      case 'samityName':
        setByLawsData((draft) => {
          draft[index].data[i].data[nextIndex].data = value;
          draft[index].data[i].data[nextIndex].isEdit = true;
          draft[index].data[i].isEdit = true;
        });
        setNewAmendmentData({
          ...newAmendmentData,
          samityInfo: {
            ...newAmendmentData.samityInfo,
            [name]: value,
          },
        });
        break;
      case 'admission':
        setByLawsData((draft) => {
          draft[index].data[i].data[nextIndex].data = value;
          draft[index].data[i].data[nextIndex].isEdit = true;
          draft[index].data[i].isEdit = true;
        });
        setNewAmendmentData({
          ...newAmendmentData,
          samityInfo: {
            ...newAmendmentData.samityInfo,
            ['memberAdmissionFee']: value,
          },
        });
        break;
      default:
        setByLawsData((draft) => {
          draft[index].data[i].data[nextIndex].data = value;
          draft[index].data[i].data[nextIndex].isEdit = false;
          draft[index].data[i].isEdit = false;
        });
        break;
    }
  };
  return (
    <Grid container spacing={2} pb={1}>
      {/* বিদ্যমান  */}
      {previousByLaws && alreadyData(previousByLaws[index]?.data[i]?.data, false)}
      {isApproval || !isEditable ? (
        // if is approval true means uco report show
        byLawsData && alreadyData(byLawsData[index]?.data[i]?.data, true)
      ) : (
        // user/citizen edit part part =>>>>>> it work with edit or not edit part
        <Grid item sm={12} md={6} xs={12}>
          <Typography align="center" sx={{ color: '#2b7936' }}>
            আবেদিত
          </Typography>
          {byLawsData[index]?.data[i]?.data?.map((element, nextIndex) => (
            <div key={nextIndex}>
              {element?.isEditable === 'Y' && isApproval == false ? (
                // is editable is true then work how it work like as input field or other
                element?.type === 'input' ? (
                  // if input type text then show input field
                  <div style={{ margin: '15px 0' }}>
                    <TextField
                      fullWidth
                      // disabled
                      label={element?.label}
                      name={element?.name}
                      onChange={(e) => handleChange(e, index, i, nextIndex)}
                      value={element?.data}
                      variant="outlined"
                      size="small"
                    ></TextField>
                  </div>
                ) : element?.type === 'Text' ? (
                  // if input type Text then show quill text editor
                  <Card sx={{ padding: '0' }}>
                    <CardContent sx={{ padding: '0' }}>
                      <ReactQuill
                        theme="snow"
                        style={{ marginBottom: '-25px' }}
                        value={element?.data}
                        // modules={modules}
                        modules={{ toolbar: { container: toolbarOptions, handlers: {} } }}
                        onChange={(e) =>
                          setByLawsData((draft) => {
                            draft[index].data[i].data[nextIndex].data = e;
                            draft[index].data[i].data[nextIndex].isEdit = true;
                            draft[index].data[i].isEdit = true;
                          })
                        }
                      />
                    </CardContent>
                  </Card>
                ) : (
                  ''
                )
              ) : (
                // is it editable false then it work only show
                <Card sx={{ padding: '0', m: '10px 0' }}>
                  <CardContent sx={{ padding: 0, m: 0 }}>
                    <div
                      style={{ padding: '10px', margin: 0 }}
                      dangerouslySetInnerHTML={{ __html: unescape(element?.data) }}
                    ></div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default PartialByLawsData;
