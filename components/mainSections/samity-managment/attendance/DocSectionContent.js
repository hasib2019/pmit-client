/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Button, Grid, Box } from '@mui/material';
import React, { useState } from 'react';
import ZoomSelectImage from '../../../../service/ZoomSelectImage';
import ZoomImage from '../../../../service/ZoomSelectImage';
const DocSectionContent = ({
  documentList,
  fileSelectedHandler,
  deleteDocumentList,
  formErrorsInDocuments,
  removeDocumentImageFront,
}) => {
  // const [flag, setFlag] = useState('data:image/jpeg;base64,');
  return (
    <>
      <Grid container gap={2}>
        {documentList.length >= 1 &&
          documentList.map((doc, i) => {
            return (
              <Grid item sx={{ width: '14rem' }} key={i}>
                <Box className="uploadImage">
                  {documentList[i].documentPictureFront ? (
                    <div className="img">
                      {documentList[i]?.documentPictureFrontFile ? (
                        <ZoomSelectImage
                          src={documentList[i]?.documentPictureFront}
                          xs={{ width: '100%', height: '100%' }}
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
                <Box my={2}>
                  {documentList.length > 1 && (
                    <Button variant="contained" className="btn btn-delete" onClick={(e) => deleteDocumentList(e, i)}>
                      বাতিল করুন
                    </Button>
                  )}
                </Box>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default DocSectionContent;
