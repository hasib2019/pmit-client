import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  Divider,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import React from 'react';

const ExcelUploadModal = ({
  open,
  file,
  // formikKey,
  // handleClickOpen,
  handleClose,
  handleChangeFile,
  handleExcelToJson,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ mb: 0, pb: 0 }}
    >
      <DialogTitle id="alert-dialog-title">{'ইম্পোর্ট করার আগে করনীয় কাজ'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          এক্সেল ফাইলে নির্দিষ্ট ফরম্যাটে ডাটা দিন, অন্যথায় সঠিক ভাবে ইম্পোর্ট করতে পারবেন না।
        </DialogContentText>
        <Grid container spacing={2.5} justifyContent="flex-start">
          <Grid item>ফরম্যাট ডাউনলোড করুন</Grid>
          <Grid item>
            <Button variant="outlined" size="small">
              ডাউনলোড
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }}></Divider>
        <Grid container>
          <Grid item>
            <TextField
              type="file"
              name="আপলোড ফাইল"
              inputProps={{ accept: '.xlsx, .xls' }}
              onChange={handleChangeFile}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }}></Divider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          বাতিল করুন
        </Button>
        <Button
          disabled={!file}
          onClick={async () => {
            await handleExcelToJson(file);
          }}
          variant="outlined"
        >
          ইম্পোর্ট করুন
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default React.memo(ExcelUploadModal);
