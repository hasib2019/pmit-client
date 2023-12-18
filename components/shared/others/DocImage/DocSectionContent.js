import { Close } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, Grid, Paper, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import star from 'components/utils/coop/star';
import ZoomImage from 'service/ZoomImage';
import ZoomSelectImage from 'service/ZoomSelectImage';

const DocSectionContent = ({
  documentList,
  documentType,
  imageValidation,
  handleDocumentList,
  addMoreDoc,
  fileSelectedHandler,
  deleteDocumentList,
  formErrorsInDocuments,
  removeDocumentImageFront,
  removeDocumentImageBack,
  isApproval,
  notMandatory,
  manualSamityCorrection
}) => {
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  console.log({ documentList, manualSamityCorrection })
  return (
    <Grid item md={12} xs={12} className="section">
      {documentList.length >= 1 &&
        documentList?.map((doc, i) => (
          <Paper
            sx={{
              padding: '15px',
              marginBottom: '10px',
              boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
              position: 'relative',
            }}
            key={i}
          >
            <Grid container alignItems="center" gap={2}>
              <Grid item md={4} xs={12}>
                <Grid container spacing={2.5}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      label={notMandatory ? 'ডকুমেন্টের ধরন' : star('ডকুমেন্টের ধরন')}
                      name="documentType"
                      onChange={(e) => handleDocumentList(e, i)}
                      select
                      SelectProps={{ native: true }}
                      type="text"
                      variant="outlined"
                      disabled={isApproval ? isApproval : false}
                      size="small"
                      style={{ backgroundColor: '#FFF' }}
                      value={parseInt(doc?.documentType) || 0}
                      error={formErrorsInDocuments[i]?.documentType ? true : false}
                      helperText={formErrorsInDocuments[i]?.documentType}
                    >
                      <option value={0}>- নির্বাচন করুন -</option>
                      {documentType?.map((option, i) => {
                        return (
                          <option key={i} value={option?.id || option?.docId}>
                            {option?.docTypeDesc}
                          </option>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      label={'সংযুক্তির নাম / ডকুমেন্ট নম্বর / রেফারেন্স নং'}
                      name="documentNumber"
                      value={doc.documentNumber}
                      onChange={(e) => handleDocumentList(e, i)}
                      type="text"
                      variant="outlined"
                      disabled={isApproval ? isApproval : false}
                      size="small"
                      error={formErrorsInDocuments[i]?.documentNumber ? true : false}
                      helperText={formErrorsInDocuments[i]?.documentNumber}
                      style={{ backgroundColor: '#FFF' }}
                    ></TextField>
                  </Grid>
                  {/* )} */}
                </Grid>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid container sx={{ gap: '1rem', alignItems: 'center' }}>
                  <Box className="uploadImage">
                    {documentList[i].documentPictureFront ? (
                      <div className="img">
                        {documentList[i]?.documentPictureFrontFile ? (
                          <ZoomSelectImage
                            src={documentList[i]?.documentPictureFront}
                            xs={{
                              width: '100%',
                              height:
                                documentList[i]?.documentPictureFrontFile?.type === 'application/pdf' ? '85px' : '100%',
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
                        <IconButton
                          sx={{
                            position: 'absolute !important',
                            display: isApproval && 'none',
                          }}
                          className="imgCancel"
                        >
                          <CancelIcon onClick={(e) => removeDocumentImageFront(e, i)} />
                        </IconButton>
                      </div>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        component="label"
                        sx={{ display: isApproval && 'none' }}
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
                  {imageValidation?.backImage && (
                    <Grid
                      item
                      sx={{
                        position: 'relative',
                        maxWidth: '12rem',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        height: '7rem',
                      }}
                    >
                      {imageValidation?.backImage && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                          }}
                        >
                          <Grid item>
                            <button onClick={() => addMoreDoc(doc, i)}>
                              <IconButton aria-label="add" color="success" disabled={doc['addDoc']}>
                                <AddCircleOutlineIcon /> <span style={{ fontSize: '12px' }}>আরও সংযুক্তি</span>
                              </IconButton>
                            </button>
                          </Grid>
                        </Box>
                      )}

                      {documentList[i]['addDoc'] ? (
                        <Box container className="uploadImage">
                          {documentList[i].documentPictureBack ? (
                            <div className="img">
                              {documentList[i]?.documentPictureBackFile ? (
                                <ZoomSelectImage
                                  src={documentList[i]?.documentPictureBack}
                                  xs={{
                                    width: '100%',
                                    height:
                                      documentList[i]?.documentPictureBackFile?.type === 'application/pdf'
                                        ? '85px'
                                        : '100%',
                                  }}
                                  key={1}
                                  type={
                                    documentList[i]?.documentPictureBackFile?.type === 'application/pdf' ? 'pdf' : ''
                                  }
                                />
                              ) : (
                                <ZoomImage
                                  src={documentList[i]?.documentPictureBack}
                                  divStyle={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    height: '100%',
                                    width: '100%',
                                  }}
                                  imageStyle={{ height: '100%', width: '100%' }}
                                  key={1}
                                  type={imageType(documentList[i].documentPictureBackName)}
                                />
                              )}
                              <IconButton sx={{ position: 'absolute !important' }} className="imgCancel">
                                <CancelIcon onClick={(e) => removeDocumentImageBack(e, i)} />
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
                              <input type="file" name="documentPictureBack" hidden />
                              সংযুক্ত করুন
                            </Button>
                          )}
                        </Box>
                      ) : (
                        ''
                      )}
                    </Grid>
                  )}
                  <Typography>
                    সর্বোচ্চ আপলোড ফাইলের সাইজ: <b>3MB</b> <br /> নতুবা ফাইলটি অনলাইন থেকে রিসাইজ
                    <br /> করে আপলোড করেন।
                  </Typography>
                </Grid>
              </Grid>
              {documentList.length > 1 && (
                (manualSamityCorrection && documentList[i].id) ? "" :
                  <Tooltip title="বাতিল করুন">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      className="btn-close"
                      sx={{
                        margin: { md: '0 0 0 auto', sm: '0 auto' },
                        display: isApproval && 'none',
                      }}
                      onClick={(e) => deleteDocumentList(e, i)}
                    >
                      <Close />
                    </Button>
                  </Tooltip>
              )}
            </Grid>
          </Paper>
        ))}
    </Grid>
  );
};

export default DocSectionContent;
