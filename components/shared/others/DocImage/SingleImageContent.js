import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Button, Card, CardMedia, Grid, Paper } from '@mui/material';
import { useState } from 'react';
import Styles from './Sanction.module.css';
const SingleImageContentd = ({ md, lg, xs, sm, onFileSelectHandler, docObj }) => {
  const [flag] = useState('data:image/jpeg;base64,');
  return (
    <>
      <Card
        style={{
          padding: '40px',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        }}
      >
        <Grid
          container
          spacing={2.5}
          direction="column"
        //   style={{ marginBottom: "20px" }}
        >
          <Grid
            item
            md={md}
            lg={lg}
            xs={xs}
            sm={sm}
          // style={{ marginBottom: "40px" }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 120,
                height: 120,
                textAlign: 'center',
                margin: 'auto',
                cursor: 'pointer',
                borderRadius: '50%',
              }}
              src={
                docObj.documentPictureFront
                  ? flag + docObj.documentPictureFront
                  : // docObj.fileNameUrl.includes("http")
                  // ? docObj.fileNameUrl
                  // : flag + docObj.documentPictureFront
                  docObj?.fileNameUrl?.includes('http')
                    ? docObj?.fileNameUrl
                    : '/govt2.png'
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                size="small"
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                className={Styles.btnOne}
                // onChange={onFileSelectHandler}
                onChange={(e) => onFileSelectHandler(e)}
              >
                <input type="file" name="documentPictureFront" hidden />
                সংযুক্ত করুন
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
export default SingleImageContentd;
