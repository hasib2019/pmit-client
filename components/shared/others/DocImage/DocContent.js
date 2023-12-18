import { Close } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, Grid, Paper, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ZoomImage from 'service/ZoomImage';
import ZoomSelectImage from 'service/ZoomSelectImage';

const DocSectionContent = ({ documentList, fileSelectedHandler, deleteDocumentList, removeDocumentImageFront }) => {
  console.log('documentList1111', documentList);
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  return (
    <>
      <Grid item md={12} xs={12} className="section">
        {documentList.length >= 1 &&
          documentList.map((doc, i) => {
            return (
              <Paper
                sx={{
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                  position: 'relative',
                }}
                key={i}
              >
                <Grid container alignItems="center" gap={1}>
                  <Grid item md={1} xs={12}></Grid>
                  <Grid item md={4} xs={12}>
                    <Box className="uploadImage">
                      {documentList[i].documentPictureFront ? (
                        <div className="img">
                          {documentList[i]?.documentPictureFrontFile ? (
                            <ZoomSelectImage
                              src={documentList[i]?.documentPictureFront}
                              xs={{
                                width: '100%',
                                height:
                                  documentList[i]?.documentPictureFrontFile?.type === 'application/pdf'
                                    ? '85px'
                                    : '100%',
                              }}
                              key={1}
                              type={documentList[i]?.documentPictureFrontFile?.type === 'application/pdf' ? 'pdf' : ''}
                            />
                          ) : (
                            <ZoomImage
                              src={documentList[i]?.documentPictureFront}
                              divStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                              }}
                              imageStyle={{ height: '100%', width: '100%' }}
                              key={1}
                              type={imageType(documentList[i].documentPictureFrontName)}
                            />
                          )}
                          {/* //////////////// Cross Button */}
                          <IconButton sx={{ position: 'absolute !important' }} className="imgCancel">
                            <CancelIcon onClick={(e) => removeDocumentImageFront(e, i)} />
                          </IconButton>
                        </div>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          component="label"
                          startIcon={<PhotoCamera />}
                          className="btn btn-upload btn btn-primary"
                          onChange={(e) => fileSelectedHandler(e, i)}
                          onClick={(event) => {
                            event.target.value = null;
                          }}
                        >
                          <input type="file" name="documentPictureFront" hidden />
                          সংযুক্ত করুন
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography>
                      সর্বোচ্চ আপলোড ফাইলের সাইজ: <b>3MB</b> <br /> নতুবা ফাইলটি অনলাইন থেকে রিসাইজ
                      <br /> করে আপলোড করেন।
                    </Typography>
                  </Grid>

                  {documentList.length > 1 && (
                    <Tooltip title="বাতিল করুন">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        className="btn-close"
                        sx={{ margin: { md: '0 0 0 auto', sm: '0 auto' } }}
                        onClick={(e) => deleteDocumentList(e, i)}
                      >
                        <Close />
                      </Button>
                    </Tooltip>
                  )}
                </Grid>
              </Paper>
            );
          })}
      </Grid>
    </>
  );
};

export default DocSectionContent;
