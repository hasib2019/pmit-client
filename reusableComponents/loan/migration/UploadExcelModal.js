import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
import useExcelToJsonFunctionalities from 'hooks/loan/migration/useHandleExcelToJson';

const UploadExcelModalComponent = ({
  headerMapping,
  handleStateAfterConvertingExcel,
  columnsArray,
  fileName,

  handleModalClose,
  open,
}) => {
  const { handleExcelToJson, handleChangeFile, file, createWorkbook } = useExcelToJsonFunctionalities();
  console.log('headerMapping incomp', headerMapping);
  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
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
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                createWorkbook(columnsArray, fileName);
              }}
            >
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
        <Button onClick={handleModalClose} variant="outlined">
          বাতিল করুন
        </Button>
        <Button
          disabled={!file}
          onClick={() => {
            handleExcelToJson(headerMapping, file, handleStateAfterConvertingExcel, handleModalClose);
          }}
          variant="outlined"
        >
          ইম্পোর্ট করুন
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default UploadExcelModalComponent;
