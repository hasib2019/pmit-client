import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, Grid, TextField } from '@mui/material';
// import { useState } from 'react';
import ZoomImage from 'service/ZoomImage';
import ZoomSelectImage from 'service/ZoomSelectImage';
import star from '../utils';

const DocSectionContent = ({
  documentList,
  documentType,
  handleDocumentList,
  addMoreDoc,
  fileSelectedHandler,
  deleteDocumentList,
  formErrorsInDocuments,
  removeDocumentImageFront,
  removeDocumentImageBack,
}) => {
  // const [flag, setFlag] = useState('data:image/jpeg;base64,');
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
              <div
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 2px 6px',
                  borderRadius: '.5rem',
                }}
                key={i}
              >
                <Grid container spacing={2.5}>
                  <Grid item md={4} xs={12}>
                    <Grid container spacing={2.5}>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          label={star('ডকুমেন্টের ধরন')}
                          name="documentType"
                          onChange={(e) => handleDocumentList(e, i)}
                          select
                          SelectProps={{ native: true }}
                          type="text"
                          variant="outlined"
                          size="small"
                          value={doc.documentType ? doc.documentType : ' '}
                        >
                          <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                          {documentType?.map((option) => (
                            <option key={option.id} value={option.docType}>
                              {option.docTypeDesc}
                            </option>
                          ))}
                        </TextField>
                        {doc['documentType'] && (
                          <span style={{ color: 'red' }}>{formErrorsInDocuments[i]?.documentType}</span>
                        )}
                      </Grid>
                      {doc['isDocMandatory'] && (
                        <Grid item md={12} xs={12}>
                          <TextField
                            fullWidth
                            label={(doc['docTypeDesc'] ? doc['docTypeDesc'] : 'ডকুমেন্ট') + ' এর নম্বর'}
                            name="documentNumber"
                            value={doc.documentNumber ? doc.documentNumber : ''}
                            onChange={(e) => handleDocumentList(e, i)}
                            type="text"
                            variant="outlined"
                            size="small"
                          ></TextField>
                          {doc['documentNumber'] && (
                            <span style={{ color: 'red' }}>{formErrorsInDocuments[i]?.documentNumber}</span>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Grid container sx={{ gap: '1rem', justifyContent: 'center' }}>
                      <Box className="uploadImage">
                        {documentList[i].documentPictureFront ? (
                          <div className="img">
                            {documentList[i]?.documentPictureFrontFile ? (
                              <ZoomSelectImage
                                src={documentList[i]?.documentPictureFront}
                                xs={{ width: '110px' }}
                                key={1}
                                type={
                                  documentList[i]?.documentPictureFrontFile?.type === 'application/pdf' ? 'pdf' : ''
                                }
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
                                imageStyle={{ height: '100px', width: '100px' }}
                                key={1}
                                type={imageType(documentList[i].documentPictureFrontName)}
                              />
                            )}
                            {/* //////////////// Cross Button */}
                            <Button sx={{ position: 'absolute !important' }} className="imgCancel">
                              <CancelIcon onClick={(e) => removeDocumentImageFront(e, i)} />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                            className="btn btn-primary"
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
                            <Button
                              onClick={() => addMoreDoc(doc, i)}
                              aria-label="add"
                              variant="outlined"
                              className="btn btn-outlined"
                              disabled={doc['addDoc']}
                              startIcon={<AddIcon />}
                            >
                              {' '}
                              আরও সংযুক্তি
                            </Button>
                          </Grid>
                        </Box>
                        {documentList[i]['addDoc'] ? (
                          <Box container className="uploadImage">
                            {documentList[i].documentPictureBack ? (
                              <div className="img">
                                {documentList[i]?.documentPictureBackFile ? (
                                  <ZoomSelectImage
                                    src={documentList[i]?.documentPictureBack}
                                    xs={{
                                      width: '110px',
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
                                    imageStyle={{
                                      height: '100%',
                                      width: '100%',
                                    }}
                                    key={1}
                                    type={imageType(documentList[i].documentPictureBackName)}
                                  />
                                )}
                                {/* //////////////// Cross Button */}
                                <CancelIcon className="imgCancel" onClick={(e) => removeDocumentImageBack(e, i)} />
                              </div>
                            ) : (
                              <Button
                                size="small"
                                variant="contained"
                                component="label"
                                startIcon={<PhotoCamera />}
                                className="btn btn-primary"
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
                    </Grid>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <div
                      style={{
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                        margin: '0 0 1.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                        }}
                      >
                        {documentList.length > 1 && (
                          <Button
                            variant="contained"
                            aria-label="add"
                            size="small"
                            className="btn btn-delete"
                            onClick={(e) => deleteDocumentList(e, i)}
                          >
                            বাতিল করুন
                          </Button>
                        )}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            );
          })}
      </Grid>
    </>
  );
};

export default DocSectionContent;
