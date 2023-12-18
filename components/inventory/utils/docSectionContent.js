/* eslint-disable @next/next/no-img-element */
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, Grid, TextField } from '@mui/material';
// import IconButton from '@mui/material/IconButton';
import star from 'components/mainSections/loan-management/loan-application/utils';
import {
  addMoreDoc,
  deleteDocumentList,
  fileSelectedHandler,
  handleDocumentList,
  removeDocumentImageBack,
  removeDocumentImageFront,
} from 'features/inventory/documentSection/documentSectionSlice';
import { useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ZoomImage from 'service/ZoomImage';
import ZoomSelectImage from 'service/ZoomSelectImage';

const DocSectionContent = () => {
  const dispatch = useDispatch();
  const { documentList, documentType } = useSelector((state) => state.docSection);

  // const [flag, setFlag] = useState('data:image/jpeg;base64,');
  const formik = useFormikContext();
  const { errors, touched } = formik;

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
                          name={`documentType`}
                          onChange={(e) => dispatch(handleDocumentList({ e: e, index: i }))}
                          select
                          SelectProps={{ native: true }}
                          type="text"
                          variant="outlined"
                          size="small"
                          value={doc.documentType ? doc.documentType : ' '}
                          error={Boolean(
                            errors?.documentList &&
                            touched.documentList &&
                            touched.documentList[i].documentType &&
                            errors?.documentList[i]?.documentType,
                          )}
                          helperText={
                            errors?.documentList &&
                            touched.documentList &&
                            touched.documentList[i].documentType &&
                            errors?.documentList[i]?.documentType
                          }
                        >
                          <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                          {documentType?.map((option) => (
                            <option key={option.id} value={option.docType}>
                              {option.docTypeDesc}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      {doc['isDocMandatory'] && (
                        <Grid item md={12} xs={12}>
                          <TextField
                            fullWidth
                            label={doc['docTypeDesc'] ? doc['docTypeDesc'] + ' এর নম্বর' : 'ডকুমেন্ট' + ' এর নম্বর'}
                            name="documentNumber"
                            value={doc.documentNumber ? doc.documentNumber : ''}
                            onChange={(e) => dispatch(handleDocumentList({ e: e, index: i }))}
                            type="text"
                            variant="outlined"
                            size="small"
                          ></TextField>
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
                                xs={{ width: '100%', height: '100%' }}
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
                                imageStyle={{ height: '100%', width: '100%' }}
                                key={1}
                                type={imageType(documentList[i].documentPictureFrontName)}
                              />
                            )}
                            {/* //////////////// Cross Button */}
                            <Button sx={{ position: 'absolute !important' }} className="imgCancel">
                              <CancelIcon onClick={() => dispatch(removeDocumentImageFront({ index: i }))} />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                            className="btn btn-primary"
                            onChange={(e) => {
                              dispatch(fileSelectedHandler({ event: e, index: i }));
                            }}
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
                              onClick={() => dispatch(addMoreDoc({ ind: i }))}
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
                                    imageStyle={{
                                      height: '100%',
                                      width: '100%',
                                    }}
                                    key={1}
                                    type={imageType(documentList[i].documentPictureBackName)}
                                  />
                                )}
                                {/* //////////////// Cross Button */}
                                <CancelIcon
                                  className="imgCancel"
                                  onClick={() => dispatch(removeDocumentImageBack({ index: i }))}
                                />
                              </div>
                            ) : (
                              <Button
                                size="small"
                                variant="contained"
                                component="label"
                                startIcon={<PhotoCamera />}
                                className="btn btn-primary"
                                onChange={(e) => dispatch(fileSelectedHandler({ event: e, index: i }))}
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
                            onClick={() => dispatch(deleteDocumentList({ index: i }))}
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
