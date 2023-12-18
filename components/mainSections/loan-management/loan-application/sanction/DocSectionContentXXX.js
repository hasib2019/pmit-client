/* eslint-disable @next/next/no-img-element */
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, Grid, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
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
  const [flag] = useState('data:image/jpeg;base64,');
  return (
    <>
      <Grid item md={12} xs={12} className="section">
        {documentList.length >= 1 &&
          documentList.map((doc, i) => {
            return (
              <Grid container spacing={2.5} key={i}>
                <Grid item md={6} xs={12}>
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
                          label={doc['docTypeDesc'] + ' এর নম্বর'}
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
                      {documentList[i].documentPictureFront == '' ? (
                        ''
                      ) : (
                        <div className="img">
                          <img
                            src={doc['update'] ? doc['documentPictureFront'] : flag + doc['documentPictureFront']}
                            style={{
                              margin: 'auto',
                              cursor: 'pointer',
                            }}
                            value={doc.documentPictureFront}
                            name="documentPictureFront"
                            id="documentPictureFront"
                            alt=""
                          />
                          {/* //////////////// Cross Button */}
                          <CancelIcon className="imgCancel" onClick={(e) => removeDocumentImageFront(e, i)} />
                        </div>
                      )}
                      <h5 style={{ fontSize: '10px', color: '#FF6B6B' }}>{doc.documentPictureFrontName}</h5>

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
                          <button onClick={() => addMoreDoc(doc, i)}>
                            <IconButton
                              aria-label="add"
                              className="btn btn-primary"
                              disabled={doc['addDoc']}
                              startIcon={<AddIcon />}
                            >
                              {' '}
                              আরও সংযুক্তি
                            </IconButton>
                          </button>
                        </Grid>
                      </Box>
                      {documentList[i]['addDoc'] ? (
                        <Box container className="uploadImage">
                          {documentList[i].documentPictureBack == '' ? (
                            ''
                          ) : (
                            <div className="img">
                              <img
                                src={doc['update'] ? doc['documentPictureBack'] : flag + doc['documentPictureBack']}
                                style={{
                                  margin: 'auto',
                                  cursor: 'pointer',
                                }}
                                className=""
                                alt=""
                                value={doc.documentPictureBack}
                              />
                              {/* //////////////// Cross Button */}
                              <CancelIcon className="imgCancel" onClick={(e) => removeDocumentImageBack(e, i)} />
                            </div>
                          )}
                          <h5 style={{ fontSize: '10px', color: '#FF6B6B' }}>{doc.documentPictureBackName}</h5>
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
                        </Box>
                      ) : (
                        ''
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12}>
                  {documentList.length > 1 && (
                    <Button variant="contained" className="buttonCancel" onClick={(e) => deleteDocumentList(e, i)}>
                      বাতিল করুন
                    </Button>
                  )}
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default DocSectionContent;
